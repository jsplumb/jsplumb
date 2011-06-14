;(function() {
	
	if (document.createStyleSheet) {	
		document.createStyleSheet().addRule(".jsplumb_vml", "behavior:url(#default#VML);position:absolute;");
		document.namespaces.add("jsplumb", "urn:schemas-microsoft-com:vml");
	}
	
	var scale = 1000,
	_atts = function(o, atts) {
		for (var i in atts) o.setAttribute(i, atts[i]);
	},
	_node = function(name, d, atts) {
		atts = atts || {};
		var o = document.createElement("jsplumb:" + name);
		o.className = (atts["class"] ? atts["class"] + " " : "") + "jsplumb_vml";
		_pos(o, d);
		//atts["coordsize"] = (d[2] * scale) + "," + (d[3] * scale);  //unsure about whether or not to include this.
		_atts(o, atts);
		document.body.appendChild(o);		
		return o;
	},
	_pos = function(o,d) {
		o.style.left = d[0] + "px";		
		o.style.top =  d[1] + "px";
		o.style.width= d[2] + "px";
		o.style.height= d[3] + "px";
	},
	_conv = function(v) {
		return Math.floor(v * scale);
	},
	_convertStyle = function(s, ignoreAlpha) {
		var o = s,
		pad = function(n) { return n.length == 1 ? "0" + n : n; },
		hex = function(k) { return pad(Number(k).toString(16)); },
		pattern = /(rgb[a]?\()(.*)(\))/;
		if (s.match(pattern)) {
			var parts = s.match(pattern)[2].split(",");
			o = "#" + hex(parts[0]) + hex(parts[1]) + hex(parts[2]);
			if (!ignoreAlpha && parts.length == 4) 
				o = o + hex(parts[3]);
		}
		
		return o;
	},
	_attachListeners = function(o, c) {
		var jpcl = jsPlumb.CurrentLibrary,
		events = [ "click", "dblclick", "mouseenter", "mouseout", "mousemove", "mousedown", "mouseup" ],
		eventFilters = { "mouseout":"mouseexit" },
		bindOne = function(evt) {
			var filteredEvent = eventFilters[evt] || evt;
			jpcl.bind(o, evt, function(ee) {
				c.fire(filteredEvent, ee);
			});
		};
		for (var i = 0; i < events.length; i++) {
			bindOne(events[i]); 			
		}
	},
	/*
	 * Class: VmlComponent
	 * base class for Vml endpoints and connectors. 
	 */
	VmlComponent = function() {				
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);		
	},	
	/*
	 * Class: VmlConnector
	 * base class for Vml connectors. extends VmlComponent.
	 */
	VmlConnector = function() {
		var self = this;
		self.canvas = null;
		VmlComponent.apply(this, arguments);
		this.paint = function(d, style, anchor) {
			if (style != null) {				
				var path = self.getPath(d), p = {};
				if (style.strokeStyle) {
					p["stroked"] = "true";
					p["strokecolor"] =_convertStyle(style.strokeStyle);
					p["strokeweight"] = style.lineWidth + "px";
				}
				else p["stroked"] = "false";
				if (style.fillStyle) {
					p["filled"] = "true";
					p["fillcolor"] = _convertStyle(style.fillStyle);
				}
				else p["filled"] = "false";
				p["path"] = path;
				if (self.canvas == null) {
					p["class"] = jsPlumb.connectorClass;
					self.canvas = _node("shape", d, p);					
					_attachListeners(self.canvas, self);
				}
				else {
					p["coordsize"] = (d[2] * scale) + "," + (d[3] * scale);
					_pos(self.canvas, d);
					_atts(self.canvas, p);
				}
			}
		};
	},		
	/*
	 * Class: VmlEndpoint
	 * base class for Vml endpoints. extends VmlComponent.
	 */
	VmlEndpoint = function() {
		VmlComponent.apply(this, arguments);
		var vml = null, self = this;
		this.paint = function(d, style, anchor) {
			var p = {};
			if (style.strokeStyle) {
				p["stroked"] = "true";
				p["strokecolor"] =_convertStyle(style.strokeStyle);
				p["strokeweight"] = style.lineWidth + "px";
			}
			if (style.fillStyle) {
				p["filled"] = "true";
				p["fillcolor"] = style.fillStyle;
			}
			if (vml == null) {
				p["class"] = jsPlumb.endpointClass;
				vml = self.getVml(d, p, anchor);				
				_attachListeners(vml, self);
			}
			else {
				//p["coordsize"] = "1,1";//(d[2] * scale) + "," + (d[3] * scale); again, unsure.
				_pos(vml, d);
				_atts(vml, p);
			}
		};
	};
	
	jsPlumb.Connectors.vml.Bezier = function() {
		jsPlumb.Connectors.Bezier.apply(this, arguments);	
		VmlConnector.apply(this, arguments);
		this.getPath = function(d) {
			return "m" + _conv(d[4]) + "," + _conv(d[5]) + 
				   " c" + _conv(d[8]) + "," + _conv(d[9]) + "," + _conv(d[10]) + "," + _conv(d[11]) + "," + _conv(d[6]) + "," + _conv(d[7]) + " e";
		};
	};
	
	jsPlumb.Connectors.vml.Straight = function() {
		jsPlumb.Connectors.Straight.apply(this, arguments);	
		VmlConnector.apply(this, arguments);
		this.getPath = function(d) {
			return "m" + _conv(d[4]) + "," + _conv(d[5]) + " l" + _conv(d[6]) + "," + _conv(d[7]) + " e";
		};
	};
	
	jsPlumb.Connectors.vml.Flowchart = function() {
    	jsPlumb.Connectors.Flowchart.apply(this, arguments);
		VmlConnector.apply(this, arguments);
    	this.getPath = function(dimensions) {
    		var p = "m " + _conv(dimensions[4]) + "," + _conv(dimensions[5]) + " l";
	        // loop through extra points
	        for (var i = 0; i < dimensions[8]; i++) {
	        	p = p + " " + _conv(dimensions[9 + (i*2)]) + "," + _conv(dimensions[10 + (i*2)]);
	        }
	        // finally draw a line to the end
	        p = p  + " " + _conv(dimensions[6]) + "," +  _conv(dimensions[7]) + " e";
	        return p;
    	};
    };
	
	/*jsPlumb.Connectors.vml.Flowchart = function() {
		jsPlumb.Connectors.Flowchart.apply(this, arguments);	
		VmlConnector.apply(this, arguments);
		this.getPath = function(d) {
			return "m" + _conv(d[4]) + "," + _conv(d[5]) + " l" + _conv(d[6]) + "," + _conv(d[7]) + " e";
		};
	};*/
	
	jsPlumb.Endpoints.vml.Dot = function() {
		jsPlumb.Endpoints.Dot.apply(this, arguments);
		VmlEndpoint.apply(this, arguments);
		this.getVml = function(d, atts, anchor) { return _node("oval", d, atts); };
	};
	
	jsPlumb.Endpoints.vml.Rectangle = function() {
		jsPlumb.Endpoints.Rectangle.apply(this, arguments);
		VmlEndpoint.apply(this, arguments);
		this.getVml = function(d, atts, anchor) { return _node("rect", d, atts); };
	};
	
	/*
	 * VML Image Endpoint.  Currently extends the canvas implementation; shouldn't.
	 */
	jsPlumb.Endpoints.vml.Image = function() {
		jsPlumb.Endpoints.canvas.Image.apply(this, arguments);		
	};
	
	jsPlumb.Overlays.vml.Label = function(params) {
		var self = this, lines = [];
		jsPlumb.Overlays.Label.apply(this, arguments);
		this.paint = function(connector, d) {
			/*if(self.group == null) {
				self.group = _node("g");
				connector.canvas.appendChild(self.group);									
			}
			_drawBox(d);
			_drawText(d);*/
		};
		this.getTextDimensions = function(connector) {
			return {};
		};
	};
	
	var AbstractVmlArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	var self = this, canvas = null, path =null;
    	var getPath = function(d) {
    		return "m " + d.hxy.x + "," + d.hxy.y +
    		       " l " + d.tail[0].x + "," + d.tail[0].y + 
    		       " " + d.cxy.x + "," + d.cxy.y + 
    		       " " + d.tail[1].x + "," + d.tail[1].y + 
    		       " x e";
    	};
    	this.paint = function(connector, d, lineWidth, strokeStyle, fillStyle) {
    		var p = {};
			if (strokeStyle) {
				p["stroked"] = "true";
				p["strokecolor"] =_convertStyle(strokeStyle);    				
			}
			if (lineWidth) p["strokeweight"] = lineWidth + "px";
			if (fillStyle) {
				p["filled"] = "true";
				p["fillcolor"] = fillStyle;
			}
			var xmin = Math.min(d.hxy.x, d.tail[0].x, d.tail[1].x, d.cxy.x),
			ymin = Math.min(d.hxy.y, d.tail[0].y, d.tail[1].y, d.cxy.y),
			xmax = Math.max(d.hxy.x, d.tail[0].x, d.tail[1].x, d.cxy.x),
			ymax = Math.max(d.hxy.y, d.tail[0].y, d.tail[1].y, d.cxy.y),
			w = Math.abs(xmax - xmin),
			h = Math.abs(ymax - ymin),
			dim = [xmin, ymin, w, h];
			/*
			 * <v:shape style='width:250;height:250' strokecolor="red" strokeweight="1.5pt"
fillcolor="blue" coordorigin="0 0" coordsize="200 200">
<v:path v="m 8,65 l 72,65, 92,11, 112,65, 174,65, 122,100, 142,155,
92,121, 42,155, 60,100 x e"/>
</v:shape>

			 */
			p["path"] = getPath(d);
    		
    		if (canvas == null) {
				canvas = _node("shape", dim, p);
				connector.canvas.parentNode.appendChild(canvas);
				//_attachListeners(self.canvas, self);
			}
			else {
				//p["coordsize"] = (w * scale) + "," + (h * scale);
				_pos(canvas, dim);
				_atts(canvas, p);
			}    		
    	};
    	var makePath=function(d) {
    		return "m" + d.hxy.x+","+ d.hxy.y+" l" + d.tail[0].x+","+ d.tail[0].y+" l" + d.cxy.x+","+  d.cxy.y+" l" + d.tail[1].x+","+ d.tail[1].y + " l" + d.hxy.x+","+ d.hxy.y;
    	};
    };
	
	jsPlumb.Overlays.vml.Arrow = function() {
    	AbstractVmlArrowOverlay.apply(this, [jsPlumb.Overlays.Arrow, arguments]);    	
    };
    
    jsPlumb.Overlays.vml.PlainArrow = function() {
    	AbstractVmlArrowOverlay.apply(this, [jsPlumb.Overlays.PlainArrow, arguments]);    	
    };
    
    jsPlumb.Overlays.vml.Diamond = function() {
    	AbstractVmlArrowOverlay.apply(this, [jsPlumb.Overlays.Diamond, arguments]);    	
    };
})();

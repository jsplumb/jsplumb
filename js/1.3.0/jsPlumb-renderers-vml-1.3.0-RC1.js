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
					p["strokecolor"] =_convertStyle(style.strokeStyle, true);
					p["strokeweight"] = style.lineWidth + "px";
				}
				else p["stroked"] = "false";
				if (style.fillStyle) {
					p["filled"] = "true";
					p["fillcolor"] = _convertStyle(style.fillStyle, true);
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
				p["strokecolor"] =_convertStyle(style.strokeStyle, true);
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
		var self = this, textbox = null, div = null, lines = [];
		jsPlumb.Overlays.Label.apply(this, arguments);
		var labelText = null;
		div = document.createElement("div");	
		div.style.position = "absolute";
		div.style.display="none";
		// initially, put these on the body, so the first pass at getTextDimensions can work.
		// after the first paint, we remove from body and append to the textbox.
		document.body.appendChild(div);
		jsPlumb.getId(div);		
		this.paint = function(connector, d, connectorDimensions) {
			var loc = [d.minx, d.miny, d.td.width , d.td.height];			
			if (textbox == null) {
				textbox = _node("textbox", loc);
				connector.canvas.parentNode.appendChild(textbox);	
				document.body.removeChild(div);				
				textbox.appendChild(div);
				div.style.display="block";
			}
			else {
				_pos(textbox, connectorDimensions.slice(0, 4));
			}
			_pos(div, loc);
			div.innerHTML = labelText;
			// TODO draw the background/border etc. maybe extract out a drawBox and drawText methods.
			div.style["font"] = self.labelStyle.font;
			div.style["color"] = self.labelStyle.color || "black";

		};
		this.getTextDimensions = function(connector) {
			labelText = typeof self.label == 'function' ? self.label(self) : self.label;
			div.innerHTML = labelText;
			var de = jsPlumb.CurrentLibrary.getElementObject(div),
			s = jsPlumb.CurrentLibrary.getSize(de);
			// TODO implement this properly.
			return {width:s[0], height:s[1], lines:["fff", "ddd" ], oneLine:10, padding:34, textHeight:56};
		};
	};
	
	var AbstractVmlArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	var self = this, canvas = null, path =null;
    	var getPath = function(d, connectorDimensions) {    		
    		return "m " + _conv(d.hxy.x) + "," + _conv(d.hxy.y) +
    		       " l " + _conv(d.tail[0].x) + "," + _conv(d.tail[0].y) + 
    		       " " + _conv(d.cxy.x) + "," + _conv(d.cxy.y) + 
    		       " " + _conv(d.tail[1].x) + "," + _conv(d.tail[1].y) + 
    		       " x e";
    	};
    	this.paint = function(connector, d, lineWidth, strokeStyle, fillStyle, connectorDimensions) {
    		var p = {};
			if (strokeStyle) {
				p["stroked"] = "true";
				p["strokecolor"] =_convertStyle(strokeStyle, true);    				
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
			
			// for VML, we create overlays using shapes that have the same dimensions and
			// coordsize as their connector - overlays calculate themselves relative to the
			// connector (it's how it's been done since the original canvas implementation, because
			// for canvas that makes sense).
			p["path"] = getPath(d, connectorDimensions);
			p["coordsize"] = (connectorDimensions[2] * scale) + "," + (connectorDimensions[3] * scale);
			dim[0] = connectorDimensions[0];
			dim[1] = connectorDimensions[1];
			dim[2] = connectorDimensions[2];
			dim[3] = connectorDimensions[3];
    		if (canvas == null) {
				canvas = _node("shape", dim, p);
				connector.canvas.parentNode.appendChild(canvas);
				//_attachListeners(self.canvas, self);
			}
			else {				
				_pos(canvas, dim);
				_atts(canvas, p);
			}    		
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

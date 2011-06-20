/**
 * SVG support for jsPlumb.
 * 
 * things to investigate:
 * 
 * gradients:  https://developer.mozilla.org/en/svg_in_html_introduction
 * css:http://tutorials.jenkov.com/svg/svg-and-css.html
 * text on a path: http://www.w3.org/TR/SVG/text.html#TextOnAPath
 * pointer events: https://developer.mozilla.org/en/css/pointer-events
 * 
 */
;(function() {
	
	var svgAttributeMap = {
		"stroke-linejoin":"stroke-linejoin",
		"joinstyle":"stroke-linejoin"
	};

	var ns = {
		svg:"http://www.w3.org/2000/svg",
		xhtml:"http://www.w3.org/1999/xhtml"
	},
	_attr = function(node, attributes) {
		for (var i in attributes)
			node.setAttribute(i, "" + attributes[i]);
	},	
	_node = function(name, attributes) {
		var n = document.createElementNS(ns.svg, name);
		attributes = attributes || {};
		attributes["version"] = "1.1";
		attributes["xmnls"] = ns.xhtml;
		_attr(n, attributes);
		return n;
	},
	_pos = function(d) { return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px"; },
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
	_applyStyles = function(parent, node, style) {
		node.setAttribute("fill", style.fillStyle ? _convertStyle(style.fillStyle, true) : "none");
		node.setAttribute("stroke", style.strokeStyle ? _convertStyle(style.strokeStyle, true) : "none");		
		if (style.lineWidth) {
			node.setAttribute("stroke-width", style.lineWidth);
		}
		if (style.gradient) {
			var id = "jsplumb_gradient_" + (new Date()).getTime();
			var g = _node("linearGradient", {id:id});
			parent.appendChild(g);
			for (var i = 0; i < style.gradient.stops.length; i++) {
				var s = _node("stop", {"offset":Math.floor(style.gradient.stops[i][0] * 100) + "%", "stop-color":_convertStyle(style.gradient.stops[i][1], true)});
				g.appendChild(s);
			}
			node.setAttribute("style", "fill:url(#" + id + ")");
		}
		// in SVG there is a stroke-dasharray attribute we can set, and its syntax looks like
		// the syntax in VML but is actually kind of nasty: values are given in the pixel
		// coordinate space, whereas in VML they are multiples of the width of the stroked
		// line, which makes a lot more sense.  for that reason, jsPlumb is supporting both
		// the native svg 'stroke-dasharray' attribute, and also the 'dashstyle' concept from
		// VML, which will be the preferred method.  the code below this converts a dashstyle
		// attribute given in terms of stroke width into a pixel representation, by using the
		// stroke's lineWidth.
		if(style["stroke-dasharray"]) {
			node.setAttribute("stroke-dasharray", style["stroke-dasharray"]);
		}
		if (style["dashstyle"] && style["lineWidth"]) {
			var sep = style["dashstyle"].indexOf(",") == -1 ? " " : ",",
			parts = style["dashstyle"].split(sep),
			styleToUse = "";
			parts.forEach(function(p) {
				styleToUse += (Math.floor(p * style.lineWidth) + sep);
			});
			node.setAttribute("stroke-dasharray", styleToUse);
		}		
	},
	_decodeFont = function(f) {
		var r = /([0-9].)(p[xt])\s(.*)/;
		var bits = f.match(r);
		return {size:bits[1], font:bits[2]};		
	}, 
	_attachListeners = function(o, c) {
		var jpcl = jsPlumb.CurrentLibrary,
		events = [ "click", "dblclick", "mouseenter", "mouseout", "mousemove", "mousedown", "mouseup" ],
		eventFilters = { "mouseout":"mouseexit" },
		bindOne = function(evt) {
			var filteredEvent = eventFilters[evt] || evt;
			jpcl.bind(o, evt, function(ee) {
				c.fire(filteredEvent, c, ee);
			});
		};
		for (var i = 0; i < events.length; i++) {
			bindOne(events[i]); 			
		}
	};
	
	/*
	 * Base class for SVG components.
	 */
	var SvgComponent = function(cssClass, originalArgs, pointerEventsSpec) {
		var self = this;
		pointerEventsSpec = pointerEventsSpec || "all";
		jsPlumb.jsPlumbUIComponent.apply(this, originalArgs);
		jsPlumb.EventGenerator.apply(this, originalArgs);
		self.canvas = null, self.path = null, self.svg = null; 
	
		self.canvas = document.createElement("div");
		self.canvas.style["position"] = "absolute";
		//self.canvas.className = cssClass; 
		jsPlumb.sizeCanvas(self.canvas,0,0,1,1);
		
		self.svg = _node("svg", {
			"style":"",
			"width":0,
			"height":0,
			"pointer-events":pointerEventsSpec,
			"class": cssClass
		});
		
		document.body.appendChild(self.canvas);
		self.canvas.appendChild(self.svg);		
		
		this.paint = function(d, style, anchor) {	   
			if (style != null) {
				jsPlumb.sizeCanvas(self.canvas, d[0], d[1], d[2], d[3]);
		    	_attr(self.svg, {
	    			"style":_pos([0,0,d[2], d[3]]),
	    			"width": d[2],
	    			"height": d[3]
	    		});
		    	self._paint.apply(this, arguments);		    			    	
			}
	    };	
	};
	
	/*
	 * Base class for SVG connectors.
	 */
	var SvgConnector = function() {
		var self = this;
		SvgComponent.apply(this, [ jsPlumb.connectorClass, arguments, "none" ]);
		this._paint = function(d, style) {
			var p = self.getPath(d), a = { "d":p };
			
			/*
        	//testing
        	//a["stroke-dashoffset"] = "50%";
        	
        	// testing
        //	a["stroke-linejoin"] = "round";*/
        							
			a["pointer-events"] = "all";
	    	if (self.path == null) {
		    	self.path = _node("path", a);
		    	self.svg.appendChild(self.path);
	    		_attachListeners(self.path, self);
	    	}
	    	else {
	    		_attr(self.path, a);
	    	}
	    	
	    	_applyStyles(self.svg, self.path, style);
		};
	};		

	/*
	 * SVG Bezier Connector
	 */
	jsPlumb.Connectors.svg.Bezier = function(curviness) {	
		jsPlumb.Connectors.Bezier.apply(this, arguments);
		SvgConnector.apply(this, arguments);	
		this.getPath = function(d) { return "M " + d[4] + " " + d[5] + " C " + d[8] + " " + d[9] + " " + d[10] + " " + d[11] + " " + d[6] + " " + d[7]; };	    	    
	};
	
	/*
	 * SVG straight line Connector
	 */
	jsPlumb.Connectors.svg.Straight = function(params) {			
		jsPlumb.Connectors.Straight.apply(this, arguments);
		SvgConnector.apply(this, arguments);	    		    
	    this.getPath = function(d) { return "M " + d[4] + " " + d[5] + " L " + d[6] + " " + d[7]; };	    
	};
	
	jsPlumb.Connectors.svg.Flowchart = function() {
    	var self = this;
    	jsPlumb.Connectors.Flowchart.apply(this, arguments);
		SvgConnector.apply(this, arguments);
    	this.getPath = function(dimensions) {
    		var p = "M " + dimensions[4] + "," + dimensions[5];
	        // loop through extra points
	        for (var i = 0; i < dimensions[8]; i++) {
	        	p = p + " L " + dimensions[9 + (i*2)] + " " + dimensions[10 + (i*2)];
	        }
	        // finally draw a line to the end
	        p = p  + " " + dimensions[6] + "," +  dimensions[7];
	        return p;
    	};
    };
    
    /*
	 * Base class for SVG endpoints (needs things to be pulled up into here)
	 */
	var SvgEndpoint = function() {
		var self = this;
		SvgComponent.apply(this, [ jsPlumb.endpointClass, arguments, "all" ]);
		this._paint = function(d, style) { 
			if (self.node == null) {
				self.node = self.makeNode(d, style);
				self.svg.appendChild(self.node);
				_attachListeners(self.node, self);
			}
			_applyStyles(self.svg, self.node, style);
			_pos(self.node, d);
		};
	};
	
	/*
	 * SVG Dot Endpoint
	 */
	jsPlumb.Endpoints.svg.Dot = function() {
		jsPlumb.Endpoints.Dot.apply(this, arguments);
		SvgEndpoint.apply(this, arguments);		
		this.makeNode = function(d, style) { 
			return _node("circle", {
					"cx"	:	d[2] / 2,
					"cy"	:	d[3] / 2,
					"r"		:	d[2] / 2
				});			
		};
	};
	
	/*
	 * SVG Rectangle Endpoint 
	 */
	jsPlumb.Endpoints.svg.Rectangle = function() {
		jsPlumb.Endpoints.Rectangle.apply(this, arguments);
		SvgEndpoint.apply(this, arguments);		
		this.makeNode = function(d, style) {
			return _node("rect", {
				"width":d[2],
				"height":d[3]
			});
		};			
	};		
	
	/*
	 * SVG Image Endpoint.  Currently extends the canvas implementation; shouldn't.
	 */
	jsPlumb.Endpoints.svg.Image = function() {
		jsPlumb.Endpoints.Image.apply(this, arguments);		
	};
	
	jsPlumb.Overlays.svg.Label = function(params) {
		var self = this, lines = [], bg = null, initialized = null;
		jsPlumb.Overlays.Label.apply(this, arguments);
		var _drawBox = function(conn, d, textDimensions) {
			var labelPadding = self.labelStyle.padding || 0.25;
			var height = textDimensions.aLineHeight * textDimensions.lineCount;
			height += (2 * labelPadding * height);
			var y = textDimensions.cy -  (height/ 2);
			var atts = {
				"x":textDimensions.cx - (textDimensions.xmax / 2) - (labelPadding * textDimensions.xmax),
				"y":y,
				"width":textDimensions.xmax + (2 * labelPadding * textDimensions.xmax),
				"height":height,
				"fill":self.labelStyle.fillStyle ? _convertStyle(self.labelStyle.fillStyle, true) : "none"
			};
			if (self.labelStyle.borderWidth > 0) {
				atts["stroke"] = self.labelStyle.borderStyle ? _convertStyle(self.labelStyle.borderStyle, true) : "black";
				atts["stroke-width"] = self.labelStyle.borderWidth;
			}
			if (bg == null) {
				bg = _node("rect", atts);
				self.group.appendChild(bg);
			} else {
				_attr(bg, atts);
			}
		};
		var _drawText = function(conn, d, doNotRecalculate) {
			var t = params.label.constructor == Function ? params.label(conn) : params.label;
			var l = t.split("\n");
			var font = _decodeFont(params.labelStyle.font);
			var lineLengths = [], y = d.cxy.y, aLineHeight = 0;
			if (lines.length != l.length) {
				self.group.innerHTML = "";			// must be a nice way to clear child nodes.
				lines.splice(0, lines.length);								
				for (var i = 0; i < l.length; i++) {
					var ln = _node("text", {
						"x":d.cxy.x,
						"y":y,
						"text-anchor":"middle",
						"font-family":font.font, 
						"font-size":font.size, 
						"fill":params.labelStyle.color
					});
				//	self.group.appendChild(ln);
					var tn = document.createTextNode(l[i]);
					ln.appendChild(tn);
					lineLengths[i] = ln.getComputedTextLength();
					lines.push({ln:ln, tn:tn});
					aLineHeight = ln.offsetHeight;
					y += ln.offsetHeight;
				}												
			}
			else {
				for (var i = 0; i < lines.length; i++) {					
					_attr(lines[i].ln, {
						"x":d.cxy.x,
						"y":y,
						"font-family":font.font, 
						"font-size":font.size, 
						"fill":params.labelStyle.color
					});
					lines[i].tn.textContent = l[i];					
					lineLengths[i] = lines[i].ln.getComputedTextLength();
					aLineHeight = lines[i].ln.offsetHeight;
					y += lines[i].ln.offsetHeight;
				}
			}
			
			return { cx:d.cxy.x, cy:d.cxy.y, 
					 xmax:lineLengths.sort().reverse()[0], 
					 ymax:y - d.cxy.y,
					 aLineHeight : aLineHeight,
					 lineCount:lines.length
			};
		};
		// TODO this method should do all of the work that is currently in the drawText method. It is
		// called before _drawText, and is used by jsPlumb to determine how big each connector's
		// surface needs to be. just need to be careful to ensure everything is ready in the UI
		// when this gets called; different technologies behave differently: what we need to do is
		// pre-render the content and then ask it how big it was.  the VML implementation does this
		// and nothing untoward happens; hopefully the svg implementation will too.
		//
		// a further complication (for both this and VML) is that to paint the background you must
		// know how big the text will be, but the first time the overlay is painted, if you append
		// the text nodes to the UI before the background, the background appears on top. so we need
		// to put a check in the code on the append stuff.
		// 
		this.getTextDimensions = function(connector) {
			return {width:0, height:0, lines:0, oneLine:0, padding:0, textHeight:0};
		};
		this.paint = function(connector, d) {
			if(self.group == null) {
				self.group = _node("g");
				connector.svg.appendChild(self.group);									
			}
			var dim = _drawText(connector, d);
			_drawBox(connector,d, dim);
			if (!initialized) {
				for (var i in lines) {
					self.group.appendChild(lines[i].ln);
				}
				initialized = true;
			}
		//	_drawText(connector, d, true);  
		};
			
	};
	
	var AbstractSvgArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	var self = this, path =null;
    	this.paint = function(connector, d, lineWidth, strokeStyle, fillStyle) {
    		if (path == null) {
    			path = _node("path");
    			connector.svg.appendChild(path);
    		}
    		
    		_attr(path, { 
    			"d"		:	makePath(d),
    			stroke 	: 	strokeStyle ? strokeStyle : null,
    			fill 	: 	fillStyle ? fillStyle : null
    		});    		
    	};
    	var makePath = function(d) {
    		return "M" + d.hxy.x + "," + d.hxy.y +
    				" L" + d.tail[0].x + "," + d.tail[0].y + 
    				" L" + d.cxy.x + "," + d.cxy.y + 
    				" L" + d.tail[1].x + "," + d.tail[1].y + 
    				" L" + d.hxy.x + "," + d.hxy.y;
    	};
    };
    
    jsPlumb.Overlays.svg.Arrow = function() {
    	AbstractSvgArrowOverlay.apply(this, [jsPlumb.Overlays.Arrow, arguments]);    	
    };
    
    jsPlumb.Overlays.svg.PlainArrow = function() {
    	AbstractSvgArrowOverlay.apply(this, [jsPlumb.Overlays.PlainArrow, arguments]);    	
    };
    
    jsPlumb.Overlays.svg.Diamond = function() {
    	AbstractSvgArrowOverlay.apply(this, [jsPlumb.Overlays.Diamond, arguments]);    	
    };
})();
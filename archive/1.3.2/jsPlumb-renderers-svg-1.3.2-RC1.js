/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.3.2
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the SVG renderers.
 *
 * Copyright (c) 2010 - 2011 Simon Porritt (http://jsplumb.org)
 * 
 * http://jsplumb.org
 * http://code.google.com/p/jsplumb
 * 
 * Triple licensed under the MIT, GPL2 and Beer licenses.
 */

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
		"joinstyle":"stroke-linejoin",		
		"stroke-dashoffset":"stroke-dashoffset"
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
	_clearGradient = function(parent) {
		for (var i = 0; i < parent.childNodes.length; i++) {
			if (parent.childNodes[i].tagName == "linearGradient" || parent.childNodes[i].tagName == "radialGradient")
				parent.removeChild(parent.childNodes[i]);
		}
	},		
	_updateGradient = function(parent, node, style, dimensions) {
		var id = "jsplumb_gradient_" + (new Date()).getTime();
		// first clear out any existing gradient
		_clearGradient(parent);
		// this checks for an 'offset' property in the gradient, and in the absence of it, assumes
		// we want a linear gradient. if it's there, we create a radial gradient.
		// it is possible that a more explicit means of defining the gradient type would be
		// better. relying on 'offset' means that we can never have a radial gradient that uses
		// some default offset, for instance.
		if (!style.gradient.offset) {
			var g = _node("linearGradient", {id:id});
			parent.appendChild(g);
		}
		else {
			var g = _node("radialGradient", {
				id:id
			});
			parent.appendChild(g);
		}
		
		// the svg radial gradient seems to treat stops in the reverse 
		// order to how canvas does it.  so we want to keep all the maths the same, but
		// iterate the actual style declarations in reverse order, if the x indexes are not in order.
		for (var i = 0; i < style.gradient.stops.length; i++) {
			// Straight Connectors and Bezier connectors act slightly differently; this code is a bit of a kludge.  but next version of
			// jsplumb will be replacing both Straight and Bezier to be generic instances of 'Connector', which has a list of segments.
			// so, not too concerned about leaving this in for now.
			var styleToUse = i;
			if (dimensions.length == 8) 
				styleToUse = dimensions[4] < dimensions[6] ? i: style.gradient.stops.length - 1 - i;
			else
				styleToUse = dimensions[4] < dimensions[6] ? style.gradient.stops.length - 1 - i : i;
			var stopColor = _convertStyle(style.gradient.stops[styleToUse][1], true);
			var s = _node("stop", {"offset":Math.floor(style.gradient.stops[i][0] * 100) + "%", "stop-color":stopColor});
			g.appendChild(s);
		}
		var applyGradientTo = style.strokeStyle ? "stroke" : "fill";
		node.setAttribute("style", applyGradientTo + ":url(#" + id + ")");
	},
	_applyStyles = function(parent, node, style, dimensions) {
		
		if (style.gradient) {
		_updateGradient(parent, node, style, dimensions);			
		}
		else {
			// make sure we clear any existing gradient
			_clearGradient(parent);
			node.setAttribute("style", "");
		}
		
		node.setAttribute("fill", style.fillStyle ? _convertStyle(style.fillStyle, true) : "none");
		node.setAttribute("stroke", style.strokeStyle ? _convertStyle(style.strokeStyle, true) : "none");		
		if (style.lineWidth) {
			node.setAttribute("stroke-width", style.lineWidth);
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
		
		// extra attributes such as join type, dash offset.
		for (var i in svgAttributeMap) {
			if (style[i]) {
				node.setAttribute(svgAttributeMap[i], style[i]);
			}
		}
	},
	_decodeFont = function(f) {
		var r = /([0-9].)(p[xt])\s(.*)/;
		var bits = f.match(r);
		return {size:bits[1] + bits[2], font:bits[3]};		
	};
	
	/*
	 * Base class for SVG components.
	 */
	var SvgComponent = function(cssClass, originalArgs, pointerEventsSpec) {
		var self = this;
		pointerEventsSpec = pointerEventsSpec || "all";
		jsPlumb.jsPlumbUIComponent.apply(this, originalArgs);
		self.canvas = null, self.path = null, self.svg = null; 
	
		this.setHover = function() { };
		
		self.canvas = document.createElement("div");
		self.canvas.style["position"] = "absolute";
		jsPlumb.sizeCanvas(self.canvas,0,0,1,1);
		
		var clazz = cssClass + " " + (originalArgs[0].cssClass || "");
		self.canvas.className = clazz;
		
		self.svg = _node("svg", {
			"style":"",
			"width":0,
			"height":0,
			"pointer-events":pointerEventsSpec/*,
			"class": clazz*/
		});
		
		jsPlumb.appendElement(self.canvas, originalArgs[0]["parent"]);
		self.canvas.appendChild(self.svg);		
		
		// TODO this displayElement stuff is common between all components, across all
		// renderers.  would be best moved to jsPlumbUIComponent.
		var displayElements = [ self.canvas ];
		this.getDisplayElements = function() { 
			return displayElements; 
		};
		
		this.appendDisplayElement = function(el) {
			displayElements.push(el);
		};
		
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
	var SvgConnector = function(params) {
		var self = this;
		SvgComponent.apply(this, [ params["_jsPlumb"].connectorClass, arguments, "none" ]);
		this._paint = function(d, style) {
			var p = self.getPath(d), a = { "d":p }, outlineStyle = null;									
			a["pointer-events"] = "all";
			
			// outline style.  actually means drawing an svg object underneath the main one.
			if (style.outlineColor) {
				var outlineWidth = style.outlineWidth || 1,
				outlineStrokeWidth = style.lineWidth + (2 * outlineWidth);
				outlineStyle = {
					strokeStyle:_convertStyle(style.outlineColor),
					lineWidth:outlineStrokeWidth
				};
				
				if (self.bgPath == null) {
					self.bgPath = _node("path", a);
			    	self.svg.appendChild(self.bgPath);
		    		self.attachListeners(self.bgPath, self);
				}
				else {
					_attr(self.bgPath, a);
				}
				
				_applyStyles(self.svg, self.bgPath, outlineStyle, d);
			}
			
			
	    	if (self.path == null) {
		    	self.path = _node("path", a);
		    	self.svg.appendChild(self.path);
	    		self.attachListeners(self.path, self);
	    	}
	    	else {
	    		_attr(self.path, a);
	    	}
	    		    	
	    	_applyStyles(self.svg, self.path, style, d);
		};
	};		

	/*
	 * SVG Bezier Connector
	 */
	jsPlumb.Connectors.svg.Bezier = function(params) {	
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
	 * Base class for SVG endpoints.
	 */
	var SvgEndpoint = function(params) {
		var self = this;
		SvgComponent.apply(this, [ params["_jsPlumb"].endpointClass, arguments, "all" ]);
		this._paint = function(d, style) {
			var s = jsPlumb.extend({}, style);
			if (s.outlineColor) {
				s.strokeWidth = s.outlineWidth;
				s.strokeStyle = _convertStyle(s.outlineColor, true);
			}
			
			if (self.node == null) {
				self.node = self.makeNode(d, s);
				self.svg.appendChild(self.node);
				self.attachListeners(self.node, self);
			}
			_applyStyles(self.svg, self.node, s, d);
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
	 * SVG Image Endpoint is the default image endpoint.
	 */
	jsPlumb.Endpoints.svg.Image = jsPlumb.Endpoints.Image;
	/*
	 * Blank endpoint in svg renderer is the default Blank endpoint.
	 */
	jsPlumb.Endpoints.svg.Blank = jsPlumb.Endpoints.Blank;	
	/*
	 * Label endpoint in svg renderer is the default Label endpoint.
	 */
	jsPlumb.Overlays.svg.Label = jsPlumb.Overlays.Label;
	
	
	var AbstractSvgArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	jsPlumb.jsPlumbUIComponent.apply(this, originalArgs);
    	var self = this, path =null;
    	this.paint = function(connector, d, lineWidth, strokeStyle, fillStyle) {
    		if (path == null) {
    			path = _node("path");
    			connector.svg.appendChild(path);
    			self.attachListeners(path, connector);
    			self.attachListeners(path, self);
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
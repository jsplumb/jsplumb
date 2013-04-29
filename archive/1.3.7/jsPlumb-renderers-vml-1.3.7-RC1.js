/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.3.7
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the VML renderers.
 *
 * Copyright (c) 2010 - 2012 Simon Porritt (http://jsplumb.org)
 * 
 * http://jsplumb.org
 * http://github.com/sporritt/jsplumb
 * http://code.google.com/p/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */

;(function() {
	
	// http://ajaxian.com/archives/the-vml-changes-in-ie-8
	// http://www.nczonline.net/blog/2010/01/19/internet-explorer-8-document-and-browser-modes/
	// http://www.louisremi.com/2009/03/30/changes-in-vml-for-ie8-or-what-feature-can-the-ie-dev-team-break-for-you-today/
	
	var vmlAttributeMap = {
		"stroke-linejoin":"joinstyle",
		"joinstyle":"joinstyle",		
		"endcap":"endcap",
		"miterlimit":"miterlimit"
	};
	
	if (document.createStyleSheet) {			
		
		// this is the style rule for IE7/6: it uses a CSS class, tidy.
		document.createStyleSheet().addRule(".jsplumb_vml", "behavior:url(#default#VML);position:absolute;");
		
		// these are for VML in IE8.  you have to explicitly call out which elements
		// you're going to expect to support VML!  
		//
		document.createStyleSheet().addRule("jsplumb\\:textbox", "behavior:url(#default#VML);position:absolute;");
		document.createStyleSheet().addRule("jsplumb\\:oval", "behavior:url(#default#VML);position:absolute;");
		document.createStyleSheet().addRule("jsplumb\\:rect", "behavior:url(#default#VML);position:absolute;");
		document.createStyleSheet().addRule("jsplumb\\:stroke", "behavior:url(#default#VML);position:absolute;");
		document.createStyleSheet().addRule("jsplumb\\:shape", "behavior:url(#default#VML);position:absolute;");
        document.createStyleSheet().addRule("jsplumb\\:group", "behavior:url(#default#VML);position:absolute;");
		
		// in this page it is also mentioned that IE requires the extra arg to the namespace
		// http://www.louisremi.com/2009/03/30/changes-in-vml-for-ie8-or-what-feature-can-the-ie-dev-team-break-for-you-today/
		// but someone commented saying they didn't need it, and it seems jsPlumb doesnt need it either.
		// var iev = document.documentMode;
		//if (!iev || iev < 8)
			document.namespaces.add("jsplumb", "urn:schemas-microsoft-com:vml");
		//else
		//	document.namespaces.add("jsplumb", "urn:schemas-microsoft-com:vml", "#default#VML");
	}
	
	jsPlumb.vml = {};
	
	var scale = 1000,

    _groupMap = {},
    _getGroup = function(container, connectorClass) {
        var id = jsPlumb.getId(container),
            g = _groupMap[id];
        if(!g) {
            g = _node("group", [0,0,scale, scale], {"class":connectorClass});
            //g.style.position=absolute;
            //g["coordsize"] = "1000,1000";
            g.style.backgroundColor="red";
            _groupMap[id] = g;
            jsPlumb.appendElement(g, container);  // todo if this gets reinstated, remember to use the current jsplumb instance.
            //document.body.appendChild(g);
        }
        return g;
    },
	_atts = function(o, atts) {
		for (var i in atts) { 
			// IE8 fix: setattribute does not work after an element has been added to the dom!
			// http://www.louisremi.com/2009/03/30/changes-in-vml-for-ie8-or-what-feature-can-the-ie-dev-team-break-for-you-today/
			//o.setAttribute(i, atts[i]);
			
			o[i] = atts[i];
		}
	},
	_node = function(name, d, atts) {
		atts = atts || {};
		var o = document.createElement("jsplumb:" + name);
		o.className = (atts["class"] ? atts["class"] + " " : "") + "jsplumb_vml";
		_pos(o, d);
		_atts(o, atts);
		return o;
	},
	_pos = function(o,d) {
		o.style.left = d[0] + "px";		
		o.style.top =  d[1] + "px";
		o.style.width= d[2] + "px";
		o.style.height= d[3] + "px";
		o.style.position = "absolute";
	},
	_conv = jsPlumb.vml.convertValue = function(v) {
		return Math.floor(v * scale);
	},	
	// tests if the given style is "transparent" and then sets the appropriate opacity node to 0 if so,
	// or 1 if not.  TODO in the future, support variable opacity.
	_maybeSetOpacity = function(styleToWrite, styleToCheck, type, component) {
		if ("transparent" === styleToCheck)
			component.setOpacity(type, "0.0");
		else
			component.setOpacity(type, "1.0");
	},
	_applyStyles = function(node, style, component) {
		var styleToWrite = {};
		if (style.strokeStyle) {
			styleToWrite["stroked"] = "true";
			var strokeColor = jsPlumb.util.convertStyle(style.strokeStyle, true);
			styleToWrite["strokecolor"] = strokeColor;
			_maybeSetOpacity(styleToWrite, strokeColor, "stroke", component);
			styleToWrite["strokeweight"] = style.lineWidth + "px";
		}
		else styleToWrite["stroked"] = "false";
		
		if (style.fillStyle) {
			styleToWrite["filled"] = "true";
			var fillColor = jsPlumb.util.convertStyle(style.fillStyle, true);
			styleToWrite["fillcolor"] = fillColor;
			_maybeSetOpacity(styleToWrite, fillColor, "fill", component);
		}
		else styleToWrite["filled"] = "false";
		
		if(style["dashstyle"]) {
			if (component.strokeNode == null) {
				component.strokeNode = _node("stroke", [0,0,0,0], { dashstyle:style["dashstyle"] });
				node.appendChild(component.strokeNode);
			}
			else
				component.strokeNode.dashstyle = style["dashstyle"];
		}					
		else if (style["stroke-dasharray"] && style["lineWidth"]) {
			var sep = style["stroke-dasharray"].indexOf(",") == -1 ? " " : ",",
			parts = style["stroke-dasharray"].split(sep),
			styleToUse = "";
			for(var i = 0; i < parts.length; i++) {
				styleToUse += (Math.floor(parts[i] / style.lineWidth) + sep);
			}
			if (component.strokeNode == null) {
				component.strokeNode = _node("stroke", [0,0,0,0], { dashstyle:styleToUse });
				node.appendChild(component.strokeNode);
			}
			else
				component.strokeNode.dashstyle = styleToUse;
		}
		
		_atts(node, styleToWrite);
	},
	/*
	 * Base class for Vml endpoints and connectors. Extends jsPlumbUIComponent. 
	 */
	VmlComponent = function() {				
		var self = this;
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);		
		this.opacityNodes = {
			"stroke":null,
			"fill":null
		};
		this.initOpacityNodes = function(vml) {
			self.opacityNodes["stroke"] = _node("stroke", [0,0,1,1], {opacity:"0.0"});
			self.opacityNodes["fill"] = _node("fill", [0,0,1,1], {opacity:"0.0"});				
			vml.appendChild(self.opacityNodes["stroke"]);
			vml.appendChild(self.opacityNodes["fill"]);	
		};
		this.setOpacity = function(type, value) {
			var node = self.opacityNodes[type];
			if (node) node["opacity"] = "" + value;
		};
		var displayElements = [ ];
		this.getDisplayElements = function() { 
			return displayElements; 
		};
		
		this.appendDisplayElement = function(el, doNotAppendToCanvas) {
			if (!doNotAppendToCanvas) self.canvas.parentNode.appendChild(el);
			displayElements.push(el);
		};
	},	
	/*
	 * Base class for Vml connectors. extends VmlComponent.
	 */
	VmlConnector = jsPlumb.VmlConnector = function(params) {
		var self = this;
		self.strokeNode = null;
		self.canvas = null;
		VmlComponent.apply(this, arguments);
		var clazz = self._jsPlumb.connectorClass + (params.cssClass ? (" " + params.cssClass) : "");
		this.paint = function(d, style, anchor) {
			if (style != null) {				
				var path = self.getPath(d), p = { "path":path };				

                //*
				if (style.outlineColor) {
					var outlineWidth = style.outlineWidth || 1,
					outlineStrokeWidth = style.lineWidth + (2 * outlineWidth),
					outlineStyle = {
						strokeStyle : jsPlumb.util.convertStyle(style.outlineColor),
						lineWidth : outlineStrokeWidth
					};
					for (var aa in vmlAttributeMap) outlineStyle[aa] = style[aa];
					
					if (self.bgCanvas == null) {						
						p["class"] = clazz;
						p["coordsize"] = (d[2] * scale) + "," + (d[3] * scale);
						self.bgCanvas = _node("shape", d, p);
						params["_jsPlumb"].appendElement(self.bgCanvas, params.parent);
						_pos(self.bgCanvas, d);
						self.appendDisplayElement(self.bgCanvas, true);	
					}
					else {
						p["coordsize"] = (d[2] * scale) + "," + (d[3] * scale);
						_pos(self.bgCanvas, d);
						_atts(self.bgCanvas, p);
					}
					
					_applyStyles(self.bgCanvas, outlineStyle, self);
				}
				//*/
				
				if (self.canvas == null) {										
					p["class"] = clazz;
					p["coordsize"] = (d[2] * scale) + "," + (d[3] * scale);
					if (self.tooltip) p["label"] = self.tooltip;
					self.canvas = _node("shape", d, p);
                    
                    //var group = _getGroup(params.parent);                   // test of append everything to a group
                    //group.appendChild(self.canvas);                           // sort of works but not exactly;
					params["_jsPlumb"].appendElement(self.canvas, params.parent);    //before introduction of groups

					self.appendDisplayElement(self.canvas, true);					
					
					self.attachListeners(self.canvas, self);
					
					self.initOpacityNodes(self.canvas, ["stroke"]);		
				}
				else {
					p["coordsize"] = (d[2] * scale) + "," + (d[3] * scale);
					_pos(self.canvas, d);
					_atts(self.canvas, p);
				}
				
				_applyStyles(self.canvas, style, self);
			}
		};
		
		//self.appendDisplayElement(self.canvas);
		
		this.reattachListeners = function() {
			if (self.canvas) self.reattachListenersForElement(self.canvas, self);
		};
	},		
	/*
	 * 
	 * Base class for Vml Endpoints. extends VmlComponent.
	 * 
	 */
	VmlEndpoint = function(params) {
		VmlComponent.apply(this, arguments);
		var vml = null, self = this, opacityStrokeNode = null, opacityFillNode = null;
		self.canvas = document.createElement("div");
		self.canvas.style["position"] = "absolute";

		//var group = _getGroup(params.parent);
        //group.appendChild(self.canvas);
		params["_jsPlumb"].appendElement(self.canvas, params.parent);

        if (self.tooltip) self.canvas.setAttribute("label", self.tooltip);
		
		this.paint = function(d, style, anchor) {
			var p = { };						
			
			jsPlumb.sizeCanvas(self.canvas, d[0], d[1], d[2], d[3]);
			if (vml == null) {
				p["class"] = jsPlumb.endpointClass;
				vml = self.getVml([0,0, d[2], d[3]], p, anchor);				
				self.canvas.appendChild(vml);
				self.attachListeners(vml, self);

				self.appendDisplayElement(vml, true);
				self.appendDisplayElement(self.canvas, true);
				
				self.initOpacityNodes(vml, ["fill"]);			
			}
			else {
				//p["coordsize"] = "1,1";//(d[2] * scale) + "," + (d[3] * scale); again, unsure.
				_pos(vml, [0,0, d[2], d[3]]);
				_atts(vml, p);
			}
			
			_applyStyles(vml, style, self);
		};
		
		this.reattachListeners = function() {
			if (vml) self.reattachListenersForElement(vml, self);
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
	 * VML Image Endpoint is the same as the default image endpoint.
	 */
	jsPlumb.Endpoints.vml.Image = jsPlumb.Endpoints.Image;
	
	/**
	 * placeholder for Blank endpoint in vml renderer.
	 */
	jsPlumb.Endpoints.vml.Blank = jsPlumb.Endpoints.Blank;
	
	/**
	 * VML Label renderer. uses the default label renderer (which adds an element to the DOM)
	 */
	jsPlumb.Overlays.vml.Label  = jsPlumb.Overlays.Label;
	
	var AbstractVmlArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	VmlComponent.apply(this, arguments);
    	var self = this, path = null;
    	self.canvas = null; 
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
				p["strokecolor"] = jsPlumb.util.convertStyle(strokeStyle, true);    				
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
			
    		if (self.canvas == null) {
    			//p["class"] = jsPlumb.overlayClass; // TODO currentInstance?
				self.canvas = _node("shape", dim, p);				
				connector.appendDisplayElement(self.canvas);
				self.attachListeners(self.canvas, connector);
			}
			else {				
				_pos(self.canvas, dim);
				_atts(self.canvas, p);
			}    		
    	};
    	
    	this.reattachListeners = function() {
			if (self.canvas) self.reattachListenersForElement(self.canvas, self);
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
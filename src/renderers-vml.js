/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.5.3
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the VML renderers.
 *
 * Copyright (c) 2010 - 2013 Simon Porritt (http://jsplumb.org)
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
	},
	jsPlumbStylesheet = null;
	
	if (document.createStyleSheet && document.namespaces) {			
		
		var ruleClasses = [
				".jsplumb_vml", "jsplumb\\:textbox", "jsplumb\\:oval", "jsplumb\\:rect", 
				"jsplumb\\:stroke", "jsplumb\\:shape", "jsplumb\\:group"
			],
			rule = "behavior:url(#default#VML);position:absolute;";

		jsPlumbStylesheet = document.createStyleSheet();

		for (var i = 0; i < ruleClasses.length; i++)
			jsPlumbStylesheet.addRule(ruleClasses[i], rule);

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
            //jsPlumb.appendElement(g, container);  // todo if this gets reinstated, remember to use the current jsplumb instance.
            //jsPlumb.CurrentLibrary.getDOMElement(container).appendChild(g);
            //document.body.appendChild(g);
        }
        return g;
    },
	_atts = function(o, atts) {
		for (var i in atts) { 
			// IE8 fix: setattribute does not work after an element has been added to the dom!
			// http://www.louisremi.com/2009/03/30/changes-in-vml-for-ie8-or-what-feature-can-the-ie-dev-team-break-for-you-today/
			//o.setAttribute(i, atts[i]);

			/*There is an additional problem when accessing VML elements by using get/setAttribute. The simple solution is following:

			if (document.documentMode==8) {
			ele.opacity=1;
			} else {
			ele.setAttribute(‘opacity’,1);
			}
			*/

			o[i] = atts[i];
		}
	},
	_node = function(name, d, atts, parent, _jsPlumb, deferToJsPlumbContainer) {
		atts = atts || {};
		var o = document.createElement("jsplumb:" + name);
		if (deferToJsPlumbContainer)
			_jsPlumb.appendElement(o, parent);
		else
			jsPlumb.CurrentLibrary.appendElement(o, parent);
		o.className = (atts["class"] ? atts["class"] + " " : "") + "jsplumb_vml";
		_pos(o, d);
		_atts(o, atts);
		return o;
	},
	_pos = function(o,d, zIndex) {
		o.style.left = d[0] + "px";		
		o.style.top =  d[1] + "px";
		o.style.width= d[2] + "px";
		o.style.height= d[3] + "px";
		o.style.position = "absolute";
		if (zIndex)
			o.style.zIndex = zIndex;
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
	_applyStyles = function(node, style, component, _jsPlumb) {
		var styleToWrite = {};
		if (style.strokeStyle) {
			styleToWrite.stroked = "true";
			var strokeColor = jsPlumbUtil.convertStyle(style.strokeStyle, true);
			styleToWrite.strokecolor = strokeColor;
			_maybeSetOpacity(styleToWrite, strokeColor, "stroke", component);
			styleToWrite.strokeweight = style.lineWidth + "px";
		}
		else styleToWrite.stroked = "false";
		
		if (style.fillStyle) {
			styleToWrite.filled = "true";
			var fillColor = jsPlumbUtil.convertStyle(style.fillStyle, true);
			styleToWrite.fillcolor = fillColor;
			_maybeSetOpacity(styleToWrite, fillColor, "fill", component);
		}
		else styleToWrite.filled = "false";
		
		if(style.dashstyle) {
			if (component.strokeNode == null) {
				component.strokeNode = _node("stroke", [0,0,0,0], { dashstyle:style.dashstyle }, node, _jsPlumb);				
			}
			else
				component.strokeNode.dashstyle = style.dashstyle;
		}					
		else if (style["stroke-dasharray"] && style.lineWidth) {
			var sep = style["stroke-dasharray"].indexOf(",") == -1 ? " " : ",",
			parts = style["stroke-dasharray"].split(sep),
			styleToUse = "";
			for(var i = 0; i < parts.length; i++) {
				styleToUse += (Math.floor(parts[i] / style.lineWidth) + sep);
			}
			if (component.strokeNode == null) {
				component.strokeNode = _node("stroke", [0,0,0,0], { dashstyle:styleToUse }, node, _jsPlumb);				
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
		var self = this, renderer = {};
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);	

		this.opacityNodes = {
			"stroke":null,
			"fill":null
		};
		this.initOpacityNodes = function(vml) {
			self.opacityNodes.stroke = _node("stroke", [0,0,1,1], {opacity:"0.0"}, vml, self._jsPlumb.instance);
			self.opacityNodes.fill = _node("fill", [0,0,1,1], {opacity:"0.0"}, vml, self._jsPlumb.instance);							
		};
		this.setOpacity = function(type, value) {
			var node = self.opacityNodes[type];
			if (node) node.opacity = "" + value;
		};
		var displayElements = [ ];
		this.getDisplayElements = function() { 
			return displayElements; 
		};
		
		this.appendDisplayElement = function(el, doNotAppendToCanvas) {
			if (!doNotAppendToCanvas) self.canvas.parentNode.appendChild(el);
			displayElements.push(el);
		};
	};
	jsPlumbUtil.extend(VmlComponent, jsPlumb.jsPlumbUIComponent, {
		cleanup:function() {			
			if (this.bgCanvas) jsPlumbUtil.removeElement(this.bgCanvas);
			jsPlumbUtil.removeElement(this.canvas);            				
		}
	});

	/*
	 * Base class for Vml connectors. extends VmlComponent.
	 */
	var VmlConnector = jsPlumb.ConnectorRenderers.vml = function(params) {		
		this.strokeNode = null;
		this.canvas = null;
		VmlComponent.apply(this, arguments);
		var clazz = this._jsPlumb.instance.connectorClass + (params.cssClass ? (" " + params.cssClass) : "");
		this.paint = function(style) {		
			if (style !== null) {			

				// we need to be at least 1 pixel in each direction, because otherwise coordsize gets set to
				// 0 and overlays cannot paint.
				this.w = Math.max(this.w, 1);
				this.h = Math.max(this.h, 1);

				var segments = this.getSegments(), p = { "path":"" },
                    d = [this.x, this.y, this.w, this.h];
				
				// create path from segments.	
				for (var i = 0; i < segments.length; i++) {
					p.path += jsPlumb.Segments.vml.SegmentRenderer.getPath(segments[i]);
					p.path += " ";
				}

                //*
				if (style.outlineColor) {
					var outlineWidth = style.outlineWidth || 1,
					outlineStrokeWidth = style.lineWidth + (2 * outlineWidth),
					outlineStyle = {
						strokeStyle : jsPlumbUtil.convertStyle(style.outlineColor),
						lineWidth : outlineStrokeWidth
					};
					for (var aa in vmlAttributeMap) outlineStyle[aa] = style[aa];
					
					if (this.bgCanvas == null) {						
						p["class"] = clazz;
						p.coordsize = (d[2] * scale) + "," + (d[3] * scale);
						this.bgCanvas = _node("shape", d, p, params.parent, this._jsPlumb.instance, true);						
						_pos(this.bgCanvas, d);
						this.appendDisplayElement(this.bgCanvas, true);	
						this.attachListeners(this.bgCanvas, this);					
						this.initOpacityNodes(this.bgCanvas, ["stroke"]);		
					}
					else {
						p.coordsize = (d[2] * scale) + "," + (d[3] * scale);
						_pos(this.bgCanvas, d);
						_atts(this.bgCanvas, p);
					}
					
					_applyStyles(this.bgCanvas, outlineStyle, this);
				}
				//*/
				
				if (this.canvas == null) {										
					p["class"] = clazz;
					p.coordsize = (d[2] * scale) + "," + (d[3] * scale);					
					this.canvas = _node("shape", d, p, params.parent, this._jsPlumb.instance, true);					                
                    //var group = _getGroup(params.parent);                   // test of append everything to a group
                    //group.appendChild(self.canvas);                           // sort of works but not exactly;
					//params["_jsPlumb"].appendElement(self.canvas, params.parent);    //before introduction of groups

					this.appendDisplayElement(this.canvas, true);										
					this.attachListeners(this.canvas, this);					
					this.initOpacityNodes(this.canvas, ["stroke"]);		
				}
				else {
					p.coordsize = (d[2] * scale) + "," + (d[3] * scale);
					_pos(this.canvas, d);
					_atts(this.canvas, p);
				}
				
				_applyStyles(this.canvas, style, this, this._jsPlumb.instance);
			}
		};	
				
	};
	jsPlumbUtil.extend(VmlConnector, VmlComponent, {
		reattachListeners : function() {
			if (this.canvas) this.reattachListenersForElement(this.canvas, this);
		},
		setVisible:function(v) {
			if (this.canvas) {
				this.canvas.style.display = v ? "block" : "none";
			}
			if (this.bgCanvas) {
				this.bgCanvas.style.display = v ? "block" : "none";
			}
		}
	});	
	
	/*
	 * 
	 * Base class for Vml Endpoints. extends VmlComponent.
	 * 
	 */
	var VmlEndpoint = window.VmlEndpoint = function(params) {
		VmlComponent.apply(this, arguments);
		this._jsPlumb.vml = null;//, opacityStrokeNode = null, opacityFillNode = null;
		this.canvas = document.createElement("div");
		this.canvas.style.position = "absolute";
		this._jsPlumb.clazz = this._jsPlumb.instance.endpointClass + (params.cssClass ? (" " + params.cssClass) : "");

		// TODO vml endpoint adds class to VML at constructor time.  but the addClass method adds VML
		// to the enclosing DIV. what to do?  seems like it would be better to just target the div.
		// HOWEVER...vml connection has no containing div.  why not? it feels like it should.

		//var group = _getGroup(params.parent);
        //group.appendChild(self.canvas);
		params._jsPlumb.appendElement(this.canvas, params.parent);

		this.paint = function(style, anchor) {
			var p = { }, vml = this._jsPlumb.vml;				
			
			jsPlumbUtil.sizeElement(this.canvas, this.x, this.y, this.w, this.h);
			if (this._jsPlumb.vml == null) {
				p["class"] = this._jsPlumb.clazz;
				vml = this._jsPlumb.vml = this.getVml([0,0, this.w, this.h], p, anchor, this.canvas, this._jsPlumb.instance);				
				this.attachListeners(vml, this);

				this.appendDisplayElement(vml, true);
				this.appendDisplayElement(this.canvas, true);
				
				this.initOpacityNodes(vml, ["fill"]);			
			}
			else {				
				_pos(vml, [0,0, this.w, this.h]);
				_atts(vml, p);
			}
			
			_applyStyles(vml, style, this);
		};		
	};
	jsPlumbUtil.extend(VmlEndpoint, VmlComponent, {
		reattachListeners : function() {
			if (this._jsPlumb.vml) this.reattachListenersForElement(this._jsPlumb.vml, this);
		}
	});
	
// ******************************* vml segments *****************************************************	
		
	jsPlumb.Segments.vml = {
		SegmentRenderer : {		
			getPath : function(segment) {
				return ({
					"Straight":function(segment) {
						var d = segment.params;
						return "m" + _conv(d.x1) + "," + _conv(d.y1) + " l" + _conv(d.x2) + "," + _conv(d.y2) + " e";
					},
					"Bezier":function(segment) {
						var d = segment.params;
						return "m" + _conv(d.x1) + "," + _conv(d.y1) + 
				   			" c" + _conv(d.cp1x) + "," + _conv(d.cp1y) + "," + _conv(d.cp2x) + "," + _conv(d.cp2y) + "," + _conv(d.x2) + "," + _conv(d.y2) + " e";
					},
					"Arc":function(segment) {					
						var d = segment.params,
							xmin = Math.min(d.x1, d.x2),
							xmax = Math.max(d.x1, d.x2),
							ymin = Math.min(d.y1, d.y2),
							ymax = Math.max(d.y1, d.y2),														
							sf = segment.anticlockwise ? 1 : 0,
							pathType = (segment.anticlockwise ? "at " : "wa "),
							makePosString = function() {
								if (d.loopback)
									return "0,0," + _conv(2*d.r) + "," + _conv(2 * d.r);

								var xy = [
										null,
										[ function() { return [xmin, ymin ];}, function() { return [xmin - d.r, ymin - d.r ];}],
										[ function() { return [xmin - d.r, ymin ];}, function() { return [xmin, ymin - d.r ];}],
										[ function() { return [xmin - d.r, ymin - d.r ];}, function() { return [xmin, ymin ];}],
										[ function() { return [xmin, ymin - d.r ];}, function() { return [xmin - d.r, ymin ];}]
									][segment.segment][sf]();

								return _conv(xy[0]) + "," + _conv(xy[1]) + "," + _conv(xy[0] + (2*d.r)) + "," + _conv(xy[1] + (2*d.r));
							};

						return pathType + " " + makePosString() + "," + _conv(d.x1) + "," + _conv(d.y1) + "," + _conv(d.x2) + "," + _conv(d.y2) + " e";												
					}
						
				})[segment.type](segment);	
			}
		}
	};
	
// ******************************* /vml segments *****************************************************	

// ******************************* vml endpoints *****************************************************
	
	jsPlumb.Endpoints.vml.Dot = function() {
		jsPlumb.Endpoints.Dot.apply(this, arguments);
		VmlEndpoint.apply(this, arguments);
		this.getVml = function(d, atts, anchor, parent, _jsPlumb) { return _node("oval", d, atts, parent, _jsPlumb); };
	};
	jsPlumbUtil.extend(jsPlumb.Endpoints.vml.Dot, VmlEndpoint);
	
	jsPlumb.Endpoints.vml.Rectangle = function() {
		jsPlumb.Endpoints.Rectangle.apply(this, arguments);
		VmlEndpoint.apply(this, arguments);
		this.getVml = function(d, atts, anchor, parent, _jsPlumb) { return _node("rect", d, atts, parent, _jsPlumb); };
	};
	jsPlumbUtil.extend(jsPlumb.Endpoints.vml.Rectangle, VmlEndpoint);
	
	/*
	 * VML Image Endpoint is the same as the default image endpoint.
	 */
	jsPlumb.Endpoints.vml.Image = jsPlumb.Endpoints.Image;
	
	/**
	 * placeholder for Blank endpoint in vml renderer.
	 */
	jsPlumb.Endpoints.vml.Blank = jsPlumb.Endpoints.Blank;
	
// ******************************* /vml endpoints *****************************************************	

// ******************************* vml overlays *****************************************************
	
	/**
	 * VML Label renderer. uses the default label renderer (which adds an element to the DOM)
	 */
	jsPlumb.Overlays.vml.Label  = jsPlumb.Overlays.Label;
	
	/**
	 * VML Custom renderer. uses the default Custom renderer (which adds an element to the DOM)
	 */
	jsPlumb.Overlays.vml.Custom = jsPlumb.Overlays.Custom;
	
	/**
	 * Abstract VML arrow superclass
	 */
	var AbstractVmlArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	VmlComponent.apply(this, originalArgs);
    	var self = this, path = null;
    	self.canvas = null; 
    	self.isAppendedAtTopLevel = true;
    	var getPath = function(d) {    		
    		return "m " + _conv(d.hxy.x) + "," + _conv(d.hxy.y) +
    		       " l " + _conv(d.tail[0].x) + "," + _conv(d.tail[0].y) + 
    		       " " + _conv(d.cxy.x) + "," + _conv(d.cxy.y) + 
    		       " " + _conv(d.tail[1].x) + "," + _conv(d.tail[1].y) + 
    		       " x e";
    	};
    	this.paint = function(params, containerExtents) {
    		// only draws for connectors, not endpoints.
    		if (params.component.canvas && containerExtents) {
	    		var p = {}, d = params.d, connector = params.component;
				if (params.strokeStyle) {
					p.stroked = "true";
					p.strokecolor = jsPlumbUtil.convertStyle(params.strokeStyle, true);    				
				}
				if (params.lineWidth) p.strokeweight = params.lineWidth + "px";
				if (params.fillStyle) {
					p.filled = "true";
					p.fillcolor = params.fillStyle;
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
				p.path = getPath(d);
				p.coordsize = (connector.w * scale) + "," + (connector.h * scale);			
				
				dim[0] = connector.x;
				dim[1] = connector.y;
				dim[2] = connector.w;
				dim[3] = connector.h;
				
	    		if (self.canvas == null) {
	    			var overlayClass = connector._jsPlumb.overlayClass || "";
	    			var clazz = originalArgs && (originalArgs.length == 1) ? (originalArgs[0].cssClass || "") : "";
	    			p["class"] = clazz + " " + overlayClass;
					self.canvas = _node("shape", dim, p, connector.canvas.parentNode, connector._jsPlumb.instance, true);								
					connector.appendDisplayElement(self.canvas, true);
					self.attachListeners(self.canvas, connector);
					self.attachListeners(self.canvas, self);
				}
				else {				
					_pos(self.canvas, dim);
					_atts(self.canvas, p);
				}    		
			}
    	};
    	
    	this.reattachListeners = function() {
			if (self.canvas) self.reattachListenersForElement(self.canvas, self);
		};

		this.cleanup = function() {
    		if (self.canvas != null) jsPlumb.CurrentLibrary.removeElement(self.canvas);
    	};
    };
    jsPlumbUtil.extend(AbstractVmlArrowOverlay, [VmlComponent, jsPlumb.Overlays.AbstractOverlay], {
    	setVisible : function(state) {
    	    this.canvas.style.display = state ? "block" : "none";
    	}
    });
	
	jsPlumb.Overlays.vml.Arrow = function() {
    	AbstractVmlArrowOverlay.apply(this, [jsPlumb.Overlays.Arrow, arguments]);    	
    };
    jsPlumbUtil.extend(jsPlumb.Overlays.vml.Arrow, [ jsPlumb.Overlays.Arrow, AbstractVmlArrowOverlay ]);
    
    jsPlumb.Overlays.vml.PlainArrow = function() {
    	AbstractVmlArrowOverlay.apply(this, [jsPlumb.Overlays.PlainArrow, arguments]);    	
    };
    jsPlumbUtil.extend(jsPlumb.Overlays.vml.PlainArrow, [ jsPlumb.Overlays.PlainArrow, AbstractVmlArrowOverlay ]);
    
    jsPlumb.Overlays.vml.Diamond = function() {
    	AbstractVmlArrowOverlay.apply(this, [jsPlumb.Overlays.Diamond, arguments]);    	
    };
    jsPlumbUtil.extend(jsPlumb.Overlays.vml.Diamond, [ jsPlumb.Overlays.Diamond, AbstractVmlArrowOverlay ]);
    
// ******************************* /vml overlays *****************************************************    
    
})();
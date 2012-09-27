/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.3.16
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the HTML5 canvas renderers.
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
	
// ********************************* CANVAS RENDERERS FOR CONNECTORS AND ENDPOINTS *******************************************************************
		
	// TODO refactor to renderer common script.  put a ref to jsPlumb.sizeCanvas in there too.
	var _connectionBeingDragged = null,
	    _hasClass = function(el, clazz) { return jsPlumb.CurrentLibrary.hasClass(_getElementObject(el), clazz); },
	    _getElementObject = function(el) { return jsPlumb.CurrentLibrary.getElementObject(el); },
	    _getOffset = function(el) { return jsPlumb.CurrentLibrary.getOffset(_getElementObject(el)); },
	    _pageXY = function(el) { return jsPlumb.CurrentLibrary.getPageXY(el); },
	    _clientXY = function(el) { return jsPlumb.CurrentLibrary.getClientXY(el); };
	
	/*
	 * Class:CanvasMouseAdapter
	 * Provides support for mouse events on canvases.  
	 */
	var CanvasMouseAdapter = function() {
		var self = this;
		self.overlayPlacements = [];
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);
		jsPlumbUtil.EventGenerator.apply(this, arguments);
		/**
		 * returns whether or not the given event is ojver a painted area of the canvas. 
		 */
	    this._over = function(e) {		    			  		    	
	    	var o = _getOffset(_getElementObject(self.canvas)),
	    	pageXY = _pageXY(e),
	    	x = pageXY[0] - o.left, y = pageXY[1] - o.top;
	    	if (x > 0 && y > 0 && x < self.canvas.width && y < self.canvas.height) {
		    	// first check overlays
		    	for ( var i = 0; i < self.overlayPlacements.length; i++) {
		    		var p = self.overlayPlacements[i];
		    		if (p && (p[0] <= x && p[1] >= x && p[2] <= y && p[3] >= y))
		    			return true;
		    	}
		    	
		    	// then the canvas
		    	var d = self.canvas.getContext("2d").getImageData(parseInt(x), parseInt(y), 1, 1);
		    	return d.data[0] != 0 || d.data[1] != 0 || d.data[2] != 0 || d.data[3] != 0;		  
	    	}
	    	return false;
	    };
	    
	    var _mouseover = false, _mouseDown = false, _posWhenMouseDown = null, _mouseWasDown = false,
	    _nullSafeHasClass = function(el, clazz) {
	    	return el != null && _hasClass(el, clazz);
	    };
	    this.mousemove = function(e) {		    
	    	var pageXY = _pageXY(e), clientXY = _clientXY(e),	   
	    	ee = document.elementFromPoint(clientXY[0], clientXY[1]),
	    	eventSourceWasOverlay = _nullSafeHasClass(ee, "_jsPlumb_overlay");	    	
			var _continue = _connectionBeingDragged == null && (_nullSafeHasClass(ee, "_jsPlumb_endpoint") || _nullSafeHasClass(ee, "_jsPlumb_connector"));
			if (!_mouseover && _continue && self._over(e)) {
				_mouseover = true;
				self.fire("mouseenter", self, e);		
				return true;
			}
			// TODO here there is a remote chance that the overlay the mouse moved onto
			// is actually not an overlay for the current component. a more thorough check would
			// be to ensure the overlay belonged to the current component.  
			else if (_mouseover && (!self._over(e) || !_continue) && !eventSourceWasOverlay) {
				_mouseover = false;
				self.fire("mouseexit", self, e);				
			}
			self.fire("mousemove", self, e);
	    };
	    		    		    
	    this.click = function(e) {	    		
	    	if (_mouseover && self._over(e) && !_mouseWasDown) 
	    		self.fire("click", self, e);		    	
	    	_mouseWasDown = false;
	    };
	    
	    this.dblclick = function(e) {
	    	if (_mouseover && self._over(e) && !_mouseWasDown) 
	    		self.fire("dblclick", self, e);		    	
	    	_mouseWasDown = false;
	    };
	    
	    this.mousedown = function(e) {
	    	if(self._over(e) && !_mouseDown) {
	    		_mouseDown = true;	    		
	    		_posWhenMouseDown = _getOffset(_getElementObject(self.canvas));
	    		self.fire("mousedown", self, e);
	    	}
	    };
	    
	    this.mouseup = function(e) {
	    	_mouseDown = false;
	    	self.fire("mouseup", self, e);
	    };

        this.contextmenu = function(e) {
          if (_mouseover && self._over(e) && !_mouseWasDown)
            self.fire("contextmenu", self, e);
          _mouseWasDown = false;
        };
	};
	
	var _newCanvas = function(params) {
		var canvas = document.createElement("canvas");
		params["_jsPlumb"].appendElement(canvas, params.parent);
		canvas.style.position = "absolute";
		if (params["class"]) canvas.className = params["class"];
		// set an id. if no id on the element and if uuid was supplied it
		// will be used, otherwise we'll create one.
		params["_jsPlumb"].getId(canvas, params.uuid);
		if (params.tooltip) canvas.setAttribute("title", params.tooltip);

		return canvas;
	};	

	var CanvasComponent = function(params) {
		CanvasMouseAdapter.apply(this, arguments);

		var displayElements = [ ];
		this.getDisplayElements = function() { return displayElements; };
		this.appendDisplayElement = function(el) { displayElements.push(el); };
	};
	
	/**
	 * Class:CanvasConnector
	 * Superclass for Canvas Connector renderers.
	 */
	var CanvasConnector = jsPlumb.CanvasConnector = function(params) {
		
		CanvasComponent.apply(this, arguments);
		
		var _paintOneStyle = function(dim, aStyle) {
			self.ctx.save();
			jsPlumb.extend(self.ctx, aStyle);
			if (aStyle.gradient) {
				var g = self.createGradient(dim, self.ctx);
				for ( var i = 0; i < aStyle.gradient.stops.length; i++)
					g.addColorStop(aStyle.gradient.stops[i][0], aStyle.gradient.stops[i][1]);
				self.ctx.strokeStyle = g;
			}
			self._paint(dim, aStyle);
			self.ctx.restore();
		};

		var self = this,
		clazz = self._jsPlumb.connectorClass + " " + (params.cssClass || "");
		self.canvas = _newCanvas({ 
			"class":clazz, 
			_jsPlumb:self._jsPlumb,
			parent:params.parent,
			tooltip:params.tooltip
		});	
		self.ctx = self.canvas.getContext("2d");
		
		self.appendDisplayElement(self.canvas);
		
		self.paint = function(dim, style) {						
			if (style != null) {																				
				jsPlumb.sizeCanvas(self.canvas, dim[0], dim[1], dim[2], dim[3]);
				if (self.getZIndex())
					self.canvas.style.zIndex = self.getZIndex();
				if (style.outlineColor != null) {
					var outlineWidth = style.outlineWidth || 1,
					outlineStrokeWidth = style.lineWidth + (2 * outlineWidth),
					outlineStyle = {
						strokeStyle:style.outlineColor,
						lineWidth:outlineStrokeWidth
					};
					_paintOneStyle(dim, outlineStyle);
				}
				_paintOneStyle(dim, style);
			}
		};				
	};		
	
	/**
	 * Class:CanvasEndpoint
	 * Superclass for Canvas Endpoint renderers.
	 */
	var CanvasEndpoint = function(params) {
		var self = this;				
		CanvasComponent.apply(this, arguments);		
		var clazz = self._jsPlumb.endpointClass + " " + (params.cssClass || ""),
			canvasParams = { 
			"class":clazz, 
			_jsPlumb:self._jsPlumb,
			parent:params.parent,
			tooltip:self.tooltip
		};
		self.canvas = _newCanvas(canvasParams);	
		self.ctx = self.canvas.getContext("2d");

		self.appendDisplayElement(self.canvas);
		
		this.paint = function(d, style, anchor) {
			jsPlumb.sizeCanvas(self.canvas, d[0], d[1], d[2], d[3]);			
			if (style.outlineColor != null) {
				var outlineWidth = style.outlineWidth || 1,
				outlineStrokeWidth = style.lineWidth + (2 * outlineWidth);
				var outlineStyle = {
					strokeStyle:style.outlineColor,
					lineWidth:outlineStrokeWidth
				};
			}
			
			self._paint.apply(this, arguments);
		};
	};
	
	jsPlumb.Endpoints.canvas.Dot = function(params) {		
		jsPlumb.Endpoints.Dot.apply(this, arguments);
		CanvasEndpoint.apply(this, arguments);
		var self = this,		
		parseValue = function(value) {
			try { return parseInt(value); }
			catch(e) {
				if (value.substring(value.length - 1) == '%')
					return parseInt(value.substring(0, value - 1));
			}
		},					    	
		calculateAdjustments = function(gradient) {
			var offsetAdjustment = self.defaultOffset, innerRadius = self.defaultInnerRadius;
			gradient.offset && (offsetAdjustment = parseValue(gradient.offset));
        	gradient.innerRadius && (innerRadius = parseValue(gradient.innerRadius));
        	return [offsetAdjustment, innerRadius];
		};
		this._paint = function(d, style, anchor) {
			if (style != null) {			
				var ctx = self.canvas.getContext('2d'), orientation = anchor.getOrientation(self);
				jsPlumb.extend(ctx, style);							
	            if (style.gradient) {            	
	            	var adjustments = calculateAdjustments(style.gradient), 
	            	yAdjust = orientation[1] == 1 ? adjustments[0] * -1 : adjustments[0],
	            	xAdjust = orientation[0] == 1 ? adjustments[0] * -1:  adjustments[0],
	            	g = ctx.createRadialGradient(d[4], d[4], d[4], d[4] + xAdjust, d[4] + yAdjust, adjustments[1]);
		            for (var i = 0; i < style.gradient.stops.length; i++)
		            	g.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
		            ctx.fillStyle = g;
	            }				
				ctx.beginPath();    		
				ctx.arc(d[4], d[4], d[4], 0, Math.PI*2, true);
				ctx.closePath();				
				if (style.fillStyle || style.gradient) ctx.fill();
				if (style.strokeStyle) ctx.stroke();
			}
    	};
	};	
		
	jsPlumb.Endpoints.canvas.Rectangle = function(params) {
		
		var self = this;
		jsPlumb.Endpoints.Rectangle.apply(this, arguments);
		CanvasEndpoint.apply(this, arguments);				
		
    	this._paint = function(d, style, anchor) {
				
			var ctx = self.canvas.getContext("2d"), orientation = anchor.getOrientation(self);
			jsPlumb.extend(ctx, style);
			
			/* canvas gradient */
		    if (style.gradient) {
		    	// first figure out which direction to run the gradient in (it depends on the orientation of the anchors)
		    	var y1 = orientation[1] == 1 ? d[3] : orientation[1] == 0 ? d[3] / 2 : 0;
				var y2 = orientation[1] == -1 ? d[3] : orientation[1] == 0 ? d[3] / 2 : 0;
				var x1 = orientation[0] == 1 ? d[2] : orientation[0] == 0 ? d[2] / 2 : 0;
				var x2 = orientation[0] == -1 ? d[2] : orientation[0] == 0 ? d[2] / 2 : 0;
			    var g = ctx.createLinearGradient(x1,y1,x2,y2);
			    for (var i = 0; i < style.gradient.stops.length; i++)
	            	g.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
	            ctx.fillStyle = g;
		    }
			
			ctx.beginPath();
			ctx.rect(0, 0, d[2], d[3]);
			ctx.closePath();				
			if (style.fillStyle || style.gradient) ctx.fill();
			if (style.strokeStyle) ctx.stroke();
    	};
	};		
	
	jsPlumb.Endpoints.canvas.Triangle = function(params) {
	        			
		var self = this;
		jsPlumb.Endpoints.Triangle.apply(this, arguments);
		CanvasEndpoint.apply(this, arguments);			
		
    	this._paint = function(d, style, anchor)
		{    		
			var width = d[2], height = d[3], x = d[0], y = d[1],			
			ctx = self.canvas.getContext('2d'),
			offsetX = 0, offsetY = 0, angle = 0,
			orientation = anchor.getOrientation(self);
			
			if( orientation[0] == 1 ) {
				offsetX = width;
				offsetY = height;
				angle = 180;
			}
			if( orientation[1] == -1 ) {
				offsetX = width;
				angle = 90;
			}
			if( orientation[1] == 1 ) {
				offsetY = height;
				angle = -90;
			}
			
			ctx.fillStyle = style.fillStyle;
			
			ctx.translate(offsetX, offsetY);
			ctx.rotate(angle * Math.PI/180);

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(width/2, height/2);
			ctx.lineTo(0, height);
			ctx.closePath();
			if (style.fillStyle || style.gradient) ctx.fill();
			if (style.strokeStyle) ctx.stroke();				
    	};
	};	
	
	/*
	 * Canvas Image Endpoint: uses the default version, which creates an <img> tag.
	 */
	jsPlumb.Endpoints.canvas.Image = jsPlumb.Endpoints.Image;
	
	/*
	 * Blank endpoint in all renderers is just the default Blank endpoint.
	 */
	jsPlumb.Endpoints.canvas.Blank = jsPlumb.Endpoints.Blank;
	
	/*
     * Canvas Bezier Connector. Draws a Bezier curve onto a Canvas element.
     */
    jsPlumb.Connectors.canvas.Bezier = function() {
    	var self = this;
    	jsPlumb.Connectors.Bezier.apply(this, arguments); 
    	CanvasConnector.apply(this, arguments);
    	this._paint = function(dimensions, style) {
        	self.ctx.beginPath();
        	self.ctx.moveTo(dimensions[4], dimensions[5]);
        	self.ctx.bezierCurveTo(dimensions[8], dimensions[9], dimensions[10], dimensions[11], dimensions[6], dimensions[7]);	            
        	self.ctx.stroke();            
        };
        
        // TODO i doubt this handles the case that source and target are swapped.
        this.createGradient = function(dim, ctx, swap) {
        	return /*(swap) ? self.ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]) : */self.ctx.createLinearGradient(dim[6], dim[7], dim[4], dim[5]);
        };
    };
    
    /*
     * Canvas straight line Connector. Draws a straight line onto a Canvas element.
     */
    jsPlumb.Connectors.canvas.Straight = function() {   	 
		var self = this,
			segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1] ];

		jsPlumb.Connectors.Straight.apply(this, arguments);
		CanvasConnector.apply(this, arguments);
		this._paint = function(dimensions, style) {

			self.ctx.beginPath();

			if (style.dashstyle && style.dashstyle.split(" ").length == 2) {			
				// only a very simple dashed style is supported - having two values, which define the stroke length 
				// (as a multiple of the stroke width) and then the space length (also as a multiple of stroke width). 
				var ds = style.dashstyle.split(" ");
				if (ds.length != 2) ds = [2, 2];
				var dss = [ ds[0] * style.lineWidth, ds[1] * style.lineWidth ],
					m = (dimensions[6] - dimensions[4]) / (dimensions[7] - dimensions[5]),
					s = jsPlumbUtil.segment([dimensions[4], dimensions[5]], [ dimensions[6], dimensions[7] ]),
					sm = segmentMultipliers[s],
					theta = Math.atan(m),
					l = Math.sqrt(Math.pow(dimensions[6] - dimensions[4], 2) + Math.pow(dimensions[7] - dimensions[5], 2)),
					repeats = Math.floor(l / (dss[0] + dss[1])),
					curPos = [dimensions[4], dimensions[5]];

				
				// TODO: the question here is why could we not support this in all connector types? it's really
				// just a case of going along and asking jsPlumb for the next point on the path a few times, until it
				// reaches the end. every type of connector supports that method, after all.  but right now its only the
				// bezier connector that gives you back the new location on the path along with the x,y coordinates, which
				// we would need. we'd start out at loc=0 and ask for the point along the path that is dss[0] pixels away.
				// we then ask for the point that is (dss[0] + dss[1]) pixels away; and from that one we need not just the
				// x,y but the location, cos we're gonna plug that location back in in order to find where that dash ends.
				//
				// it also strikes me that it should be trivial to support arbitrary dash styles (having more or less than two
				// entries). you'd just iterate that array using a step size of 2, and generify the (rss[0] + rss[1])
				// computation to be sum(rss[0]..rss[n]).

				for (var i = 0; i < repeats; i++) {
					self.ctx.moveTo(curPos[0], curPos[1]);

					var nextEndX = curPos[0] + (Math.abs(Math.sin(theta) * dss[0]) * sm[0]),
						nextEndY = curPos[1] + (Math.abs(Math.cos(theta) * dss[0]) * sm[1]),
						nextStartX = curPos[0] + (Math.abs(Math.sin(theta) * (dss[0] + dss[1]))  * sm[0]),
						nextStartY = curPos[1] + (Math.abs(Math.cos(theta) * (dss[0] + dss[1])) * sm[1])

					self.ctx.lineTo(nextEndX, nextEndY);
					curPos = [nextStartX, nextStartY];					
				}

				// now draw the last bit
				self.ctx.moveTo(curPos[0], curPos[1]);
				self.ctx.lineTo(dimensions[6], dimensions[7]);		

			}	        
	        else {
		        self.ctx.moveTo(dimensions[4], dimensions[5]);
	        	self.ctx.lineTo(dimensions[6], dimensions[7]);
	        }
	        	      
	        self.ctx.stroke();            
	    };
	    
	    // TODO this does not handle the case that src and target are swapped.
	    this.createGradient = function(dim, ctx) {
        	return ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]);
        };
    };
    
    jsPlumb.Connectors.canvas.Flowchart = function() {
    	var self = this;
    	jsPlumb.Connectors.Flowchart.apply(this, arguments);
		CanvasConnector.apply(this, arguments);
    	this._paint = function(dimensions, style) {
	        self.ctx.beginPath();
	        self.ctx.moveTo(dimensions[4], dimensions[5]);
	        // loop through extra points
	        for (var i = 0; i < dimensions[8]; i++) {
	        	self.ctx.lineTo(dimensions[9 + (i*2)], dimensions[10 + (i*2)]);
	        }
	        // finally draw a line to the end
	        self.ctx.lineTo(dimensions[6], dimensions[7]);
	        self.ctx.stroke();
    	};
    	
    	this.createGradient = function(dim, ctx) {
        	return ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]);
        };
    };
    
// ********************************* END OF CANVAS RENDERERS *******************************************************************    
    
    jsPlumb.Overlays.canvas.Label = jsPlumb.Overlays.Label;
	jsPlumb.Overlays.canvas.Custom = jsPlumb.Overlays.Custom;
    
    /**
     * a placeholder right now, really just exists to mirror the fact that there are SVG and VML versions of this. 
     */
    var CanvasOverlay = function() { 
    	jsPlumb.jsPlumbUIComponent.apply(this, arguments);
    };
    
    var AbstractCanvasArrowOverlay = function(superclass, originalArgs) {
    	superclass.apply(this, originalArgs);
    	CanvasOverlay.apply(this, originalArgs);
    	this.paint = function(connector, d, lineWidth, strokeStyle, fillStyle) {
    		var ctx = connector.ctx;
    		
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.moveTo(d.hxy.x, d.hxy.y);
			ctx.lineTo(d.tail[0].x, d.tail[0].y);
			ctx.lineTo(d.cxy.x, d.cxy.y);
			ctx.lineTo(d.tail[1].x, d.tail[1].y);
			ctx.lineTo(d.hxy.x, d.hxy.y);
			ctx.closePath();						
						
			if (strokeStyle) {
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}
			if (fillStyle) {
				ctx.fillStyle = fillStyle;			
				ctx.fill();
			}
    	};
    }; 
    
    jsPlumb.Overlays.canvas.Arrow = function() {
    	AbstractCanvasArrowOverlay.apply(this, [jsPlumb.Overlays.Arrow, arguments]);    	
    };
    
    jsPlumb.Overlays.canvas.PlainArrow = function() {
    	AbstractCanvasArrowOverlay.apply(this, [jsPlumb.Overlays.PlainArrow, arguments]);    	
    };
    
    jsPlumb.Overlays.canvas.Diamond = function() {
    	AbstractCanvasArrowOverlay.apply(this, [jsPlumb.Overlays.Diamond, arguments]);    	
    };		
})();
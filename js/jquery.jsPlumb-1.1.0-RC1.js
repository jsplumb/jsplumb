/*
 * jsPlumb 1.1.0-RC1
 * 
 * Provides a way to visually connect elements on an HTML page.
 * 
 * 1.1.0-RC1 contains the first pass at supporting connection editing.  the mechanism used to register
 * and retrieve connections has been turned around to be endpoint centric, rather than
 * connection centric.  this will allow us to create endpoints that have 0-N connections. 
 * 
 * http://morrisonpitt.com/jsPlumb/demo.html
 * http://code.google.com/p/jsPlumb
 * 
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function( v, b, s ) {
	 for( var i = +b || 0, l = this.length; i < l; i++ ) {
	  if( this[i]===v || s && this[i]==v ) { return i; }
	 }
	 return -1;
	};
}
(function() {
	
	var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
	
	var repaintFunction = function() { jsPlumb.repaintEverything(); };
	var automaticRepaint = true;
    function repaintEverything() {
    	if (automaticRepaint)
    		repaintFunction();
    };
    var resizeTimer = null;
    $(window).bind('resize', function() {
    	if (resizeTimer) clearTimeout(resizeTimer);
	    resizeTimer = setTimeout(repaintEverything, 100);
     });
	
	/**
	 * map of element id -> endpoint lists.  an element can have an arbitrary number of endpoints on it,
	 * and not all of them have to be connected to anything.
	 */
	var endpointsByElement = {};
	var offsets = [];
	var sizes = [];
	
	var DEFAULT_NEW_CANVAS_SIZE = 1200; // only used for IE; a canvas needs a size before the init call to excanvas (for some reason. no idea why.)	
	
	/**
     * applies all the styles to the given context.  this just wraps the $.extend function. 
     * 
     * @param context
     * @param styles
     */
    var applyPaintStyle = function(context, styles) {
        $.extend(context, styles);
        return context;
    };
    
    /**
     * Handles the dragging of an element.  
     * @param element jQuery element
     * @param ui UI object from jQuery's event system
     */
    var _drag = function(element, ui) {
    	var id = element.attr("id");    	
    	var endpoints = endpointsByElement[id];
    	// loop through endpoints for this element
    	for (var i = 0; i < endpoints.length; i++) {
    		var e = endpoints[i];
    		// first, paint the endpoint
    		/*_updateOffset(id, ui);
    		var off = offsets[id];*/
    		//todo...connector paint style?  we have lost that with the move to endpoint-centric.
    		// perhaps we only paint the endpoint here if it has no connections; it can use its own style.
    		if (!e.connections || e.connections.length == 0)
    			e.paint(/*[off.left, off.top]*/);
    		else {
	    		// then, get all connections for the endpoint..
	    		var l = e.connections;
	    		for (var j = 0; j < l.length; j++)
	    			l[j].paint(id, ui);  // and paint them
    		}
    	}
    };
    
    /**
     * performs the given function operation on all the connections found for the given element
     * id; this means we find all the endpoints for the given element, and then for each endpoint
     * find the connectors connected to it. then we pass each connection in to the given
     * function.
     */
    var _operation = function(elId, func) {
    	var endpoints = endpointsByElement[elId];
    	if (endpoints && endpoints.length) {
	    	for (var i = 0; i < endpoints.length; i++) {
	    		for (var j = 0; j < endpoints[i].connections.length; j++) {
	    			var retVal = func(endpoints[i].connections[j]);
	    			// if the function passed in returns true, we exit.
	    			// most functions return false.
	    			if (retVal) return;
	    		}
	    	}
    	}
    };
    
    /**
     * perform an operation on all elements.
     */
    var _operationOnAll = function(func) {
    	for (var elId in endpointsByElement) {
    		_operation(elId, func);
    	}    	
    };
    
    /**
     * updates the offset and size for a given element, and stores the values.
     * if 'ui' is not null we use that (it would have been passed in from a drag call) because it's faster; but if it is null,
     * or if 'recalc' is true in order to force a recalculation, we use the offset, outerWidth and outerHeight methods to get
     * the current values.
     */
    var _updateOffset = function(elId, ui, recalc) {
		if (recalc || ui == null) {
    		// get the current size and offset, and store them
    		var s = $("#" + elId);
    		sizes[elId] = [s.outerWidth(), s.outerHeight()];
    		offsets[elId] = s.offset();
		} else {
			// faster to use the ui element if it was passed in.  offset is a fallback.
			// fix for change in 1.8 (absolutePosition renamed to offset). plugin is compatible with
			// 1.8 and 1.7.
			var pos = ui.absolutePosition || ui.offset;
    		var anOffset = ui != null ? pos : $("#" + elId).offset();
    		offsets[elId] = anOffset;
		}
	};
    
    /**
     * helper method to add an item to a list, creating the list if it does not yet exist.
     */
    var _addToList = function(map, key, value) {
		var l = map[key];
		if (l == null) {
			l = [];
			map[key] = l; 
		}
		l.push(value);
	};
	
	/**
	 * private method to do the business of hiding/showing.
	 * @param elId Id of the element in question
	 * @param state String specifying a value for the css 'display' property ('block' or 'none').
	 */
	var _setVisible = function(elId, state) {
    	var f = function(jpc) {
    		jpc.canvas.style.display = state;
			jpc.sourceEndpointCanvas.style.display = state;
			jpc.targetEndpointCanvas.style.display = state;
    	};
    	
    	_operation(elId, f);    	
    };        
    
    /**
     * helper to create a canvas.
     * @param clazz optional class name for the canvas.
     */
    var newCanvas = function(clazz) {
        var canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.style.position="absolute";
        if (clazz) { canvas.className=clazz; }
        
        if (/MSIE/.test(navigator.userAgent) && !window.opera) {
        	// for IE we have to set a big canvas size. actually you can override this, too, if 1200 pixels
        	// is not big enough for the biggest connector/endpoint canvas you have at startup.
        	jsPlumb.sizeCanvas(canvas, 0, 0, DEFAULT_NEW_CANVAS_SIZE, DEFAULT_NEW_CANVAS_SIZE);
        	canvas = G_vmlCanvasManager.initElement(canvas);          
        }
        
        return canvas;
    };               
    
    /**
     * helper to remove a canvas from the DOM.
     */
    var removeCanvas = function(canvas) {
    	if (canvas != null) { 
    		try { document.body.removeChild(canvas); }
    		catch (e) { }
    	}    	
    }; 
	
	/**
	 * generic anchor - can be situated anywhere.  params should contain three values, and may optionally have an 'offsets' argument:
	 * 
	 * x - the x location of the anchor as a percentage of the total width.  
	 * y - the y location of the anchor as a percentage of the total height.
	 * orientation - an [x,y] array indicating the general direction a connection from the anchor should go in.
	 * offsets - an [x,y] array of fixed offsets that should be applied after the x,y position has been figured out.  may be null.
	 * 
	 */	
	var Anchor = function(params) {
		var self = this;
		this.x = params.x || 0; this.y = params.y || 0; this.orientation = params.orientation || [0,0]; this.offsets = params.offsets || [0,0];
		this.compute = function(xy, wh, txy, twh) {
			return [ xy[0] + (self.x * wh[0]) + self.offsets[0], xy[1] + (self.y * wh[1]) + self.offsets[1] ];
		}
	};
	
	/**
	 * models an endpoint.  can have one to N connections emanating from it (although how to handle that in the UI is
	 * a very good question). also has a Canvas and paint style.
	 */
	var Endpoint = function(params) {
		params = params || {};
		var self = this;
		var _anchor = params.anchor || jsPlumb.Anchors.TopCenter;
		var _endpoint = params.endpoint || new jsPlumb.Endpoints.Dot();
		var _style = params.style || jsPlumb.DEFAULT_ENDPOINT_STYLE;
		var _element = params.source;
		var _elementId = $(_element).attr("id");
		// todo: endpoint can act as a source for new connections
		this.canvas = params.canvas || newCanvas(jsPlumb.endpointClass);
		this.connections = params.connections || [];
		this.addConnection = function(connection) {
			self.connections.push(connection);
		};
		this.paint = function(anchorPoint, connectorPaintStyle) {
			if (arguments.length == 0) {
				
				var xy = offsets[_elementId];
				var wh = sizes[_elementId];
				anchorPoint = _anchor.compute([xy.left, xy.top], wh);
			}
			_endpoint.paint(anchorPoint, _anchor.orientation, self.canvas, _style, connectorPaintStyle || _style);
		};
	};
	
	/**
	 * jsPlumb public API
	 */
    var jsPlumb = window.jsPlumb = {

	connectorClass : '_jsPlumb_connector',
	endpointClass : '_jsPlumb_endpoint',
	DEFAULT_PAINT_STYLE : { lineWidth : 10, strokeStyle : "red" },
    DEFAULT_ENDPOINT_STYLE : { fillStyle : null }, // meaning it will be derived from the stroke style of the connector.
    DEFAULT_ENDPOINT_STYLES : [ null, null ], // meaning it will be derived from the stroke style of the connector.
    DEFAULT_DRAG_OPTIONS : { },
    DEFAULT_CONNECTOR : null,
    DEFAULT_ENDPOINT : null,    
    DEFAULT_ENDPOINTS : [null, null],  // new in 0.0.4, the ability to specify diff. endpoints.  DEFAULT_ENDPOINT is here for backwards compatibility.            
    
    /**
    * Places you can anchor a connection to.  These are helpers for common locations; they all just return an instance
    * of Anchor that has been configured appropriately.  
    * 
    * You can write your own one of these; you
    * just need to provide a 'compute' method and an 'orientation'.  so you'd say something like this:
    * 
    * jsPlumb.Anchors.MY_ANCHOR = {
    * 	compute : function(xy, wh, txy, twh) { return some mathematics on those variables; },
    *   orientation : [ox, oy]
    * };
    *
    * compute takes the [x,y] position of the top left corner of the anchored element,
    * and the element's [width,height] (all in pixels), as well as the location and dimension of the element it's plumbed to,
    * and returns where the anchor should be located.
    *
    * the 'orientation' array (returned here as [ox,oy]) indicates the general direction a connection from the anchor
    * should go in, if possible.  it is an [x,y] matrix where a value of 0 means no preference,
    * -1 means go in a negative direction for the given axis, and 1 means go in a positive
    * direction.  so consider a TopCenter anchor: the orientation matrix for it is [0,-1],
    * meaning connections naturally want to go upwards on screen.  in a Bezier implementation, for example, 
    * the curve would start out going in that direction, before bending towards the target anchor.
    */
    Anchors :
	{    			
    	TopCenter : new Anchor({x:0.5, y:0, orientation:[0,-1] }),
    	BottomCenter : new Anchor({x:0.5, y:1, orientation:[0, 1] }),
    	LeftMiddle: new Anchor({x:0, y:0.5, orientation:[-1,0] }),
    	RightMiddle : new Anchor({x:1, y:0.5, orientation:[1,0] }),
    	Center : new Anchor({x:0.5, y:0.5, orientation:[0,0] }),
    	TopRight : new Anchor({x:1, y:0, orientation:[0,-1] }),
    	BottomRight : new Anchor({x:1, y:1, orientation:[0,1] }),
    	TopLeft : new Anchor({x:0, y:0, orientation:[0,-1] }),
    	BottomLeft : new Anchor({x:0, y:1, orientation:[0,1] })
    },

    /**
     * Types of connectors, eg. Straight, Bezier.
     */
    Connectors :
    {
        /**
         * The Straight connector draws a simple straight line between the two anchor points.
         */
        Straight : function() {
    	
    		var self = this;

            /**
             * Computes the new size and position of the canvas.
             * @param sourceAnchor Absolute position on screen of the source object's anchor.
             * @param targetAnchor Absolute position on screen of the target object's anchor.
             * @param positionMatrix  Indicates the relative positions of the left,top of the
             *  two plumbed objects.  so [0,0] indicates that the source is to the left of, and
             *  above, the target.  [1,0] means the source is to the right and above.  [0,1] means
             *  the source is to the left and below.  [1,1] means the source is to the right
             *  and below.  this is used to figure out which direction to draw the connector in.
             * @returns an array of positioning information.  the first two values are
             * the [left, top] absolute position the canvas should be placed on screen.  the
             * next two values are the [width,height] the canvas should be.  after that each
             * Connector can put whatever it likes into the array:it will be passed back in
             * to the paint call.  This particular function stores the origin and destination of
             * the line it is going to draw.  a more involved implementation, like a Bezier curve,
             * would store the control point info in this array too.
             */
            this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth) {
    			var w = Math.abs(sourcePos[0] - targetPos[0]);
                var h = Math.abs(sourcePos[1] - targetPos[1]);
                var widthAdjusted = false, heightAdjusted = false;
                // these are padding to ensure the whole connector line appears
                var xo = 0.45 * w, yo = 0.45 * h;
                // these are padding to ensure the whole connector line appears
                w *= 1.9; h *=1.9;
                
                var x = Math.min(sourcePos[0], targetPos[0]) - xo;
                var y = Math.min(sourcePos[1], targetPos[1]) - yo;
                
                if (w < 2 * lineWidth) { 
            		// minimum size is 2 * line Width
            		w = 2 * lineWidth; 
            		// if we set this then we also have to place the canvas
            		x = sourcePos[0]  + ((targetPos[0] - sourcePos[0]) / 2) - lineWidth;
            		xo = (w - Math.abs(sourcePos[0]-targetPos[0])) / 2;
            	}
                if (h < 2 * lineWidth) { 
            		// minimum size is 2 * line Width
            		h = 2 * lineWidth; 
            		// if we set this then we also have to place the canvas
            		y = sourcePos[1]  + ((targetPos[1] - sourcePos[1]) / 2) - lineWidth;
            		yo = (h - Math.abs(sourcePos[1]-targetPos[1])) / 2;
            	}
                
                // here we check to see if the delta was very small and so the line in
                // one direction can be considered straight.                
                var sx = sourcePos[0] < targetPos[0] ? w-xo : xo;
                var sy = sourcePos[1] < targetPos[1] ? h-yo : yo;
                var tx = sourcePos[0] < targetPos[0] ? xo : w-xo;
                var ty = sourcePos[1] < targetPos[1] ? yo : h-yo;
                var retVal = [ x, y, w, h, sx, sy, tx, ty ];
                                
                // return [canvasX, canvasY, canvasWidth, canvasHeight, 
                //         sourceX, sourceY, targetX, targetY] 
                return retVal;
            };

            this.paint = function(dimensions, ctx)
            {
                ctx.beginPath();
                ctx.moveTo(dimensions[4], dimensions[5]);
                ctx.lineTo(dimensions[6], dimensions[7]);
                ctx.stroke();
            };
        },
                
        /**
         * This Connector draws a Bezier curve with two control points.
         * @param curviness How 'curvy' you want the curve to be! This is a directive for the
         * placement of control points, not endpoints of the curve, so your curve does not 
         * actually touch the given point, but it has the tendency to lean towards it.  the larger
         * this value, the greater the curve is pulled from a straight line.
         * 
         * a future implementation of this could take the control points as arguments, rather
         * than fixing the curve to one basic shape.
         */
        Bezier : function(curviness) {
        	
        	var self = this;
        	this.majorAnchor = curviness || 150;
            this.minorAnchor = 10;
            
            this._findControlPoint = function(point, anchor1Position, anchor2Position, anchor1, anchor2) {
                var p = [];            
                var ma = self.majorAnchor, mi = self.minorAnchor;
                if (anchor1.orientation[0] == 0) // X
                    p.push(anchor1Position[0] < anchor2Position[0] ? point[0] + mi : point[0] - mi);
                else p.push(point[0] - (ma * anchor1.orientation[0]));

                if (anchor1.orientation[1] == 0) // Y
                	p.push(anchor1Position[1] < anchor2Position[1] ? point[1] + mi : point[1] - mi);
                else p.push(point[1] + (ma * anchor2.orientation[1]));

                return p;
            };

            this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth)
            {
            	lineWidth = lineWidth || 0;
                var w = Math.abs(sourcePos[0] - targetPos[0]) + lineWidth, h = Math.abs(sourcePos[1] - targetPos[1]) + lineWidth;
                var canvasX = Math.min(sourcePos[0], targetPos[0])-(lineWidth/2), canvasY = Math.min(sourcePos[1], targetPos[1])-(lineWidth/2);
                var sx = sourcePos[0] < targetPos[0] ? w - (lineWidth/2): (lineWidth/2), sy = sourcePos[1] < targetPos[1] ? h-(lineWidth/2) : (lineWidth/2);
                var tx = sourcePos[0] < targetPos[0] ? (lineWidth/2) : w-(lineWidth/2), ty = sourcePos[1] < targetPos[1] ? (lineWidth/2) : h-(lineWidth/2);
                var CP = self._findControlPoint([sx,sy], sourcePos, targetPos, sourceAnchor, targetAnchor);
                var CP2 = self._findControlPoint([tx,ty], targetPos, sourcePos, targetAnchor, sourceAnchor);                
                var minx1 = Math.min(sx,tx); var minx2 = Math.min(CP[0], CP2[0]); var minx = Math.min(minx1,minx2);
                var maxx1 = Math.max(sx,tx); var maxx2 = Math.max(CP[0], CP2[0]); var maxx = Math.max(maxx1,maxx2);
                
                if (maxx > w) w = maxx;
                if (minx < 0) {
                    canvasX += minx; var ox = Math.abs(minx);
                    w += ox; CP[0] += ox; sx += ox; tx +=ox; CP2[0] += ox;
                }                

                var miny1 = Math.min(sy,ty); var miny2 = Math.min(CP[1], CP2[1]); var miny = Math.min(miny1,miny2);
                var maxy1 = Math.max(sy,ty); var maxy2 = Math.max(CP[1], CP2[1]); var maxy = Math.max(maxy1,maxy2);
                if (maxy > h) h = maxy;
                if (miny < 0) {
                    canvasY += miny; var oy = Math.abs(miny);
                    h += oy; CP[1] += oy; sy += oy; ty +=oy; CP2[1] += oy;
                }

                // return [ canvasx, canvasy, canvasWidth, canvasHeight,
                //          sourceX, sourceY, targetX, targetY,
                //          controlPoint1_X, controlPoint1_Y, controlPoint2_X, controlPoint2_Y
                return [canvasX, canvasY, w, h, sx, sy, tx, ty, CP[0], CP[1], CP2[0], CP2[1] ];
            };

            this.paint = function(d, ctx) {
	            ctx.beginPath();
	            ctx.moveTo(d[4],d[5]);
	            ctx.bezierCurveTo(d[8],d[9],d[10],d[11],d[6],d[7]);	            
	            ctx.stroke();
            }
        }
    },
    
    
    /**
     * Types of endpoint UIs.  we supply three - a circle of default radius 10px, a rectangle of
     * default size 20x20, and an image (with no default).  you can supply others of these if you want to - see the documentation
     * for a howto.
     */
    Endpoints : {

    	/**
    	 * a round endpoint, with default radius 10 pixels.
    	 */
    	Dot : function(params) {
    	
    		params = params || { radius:10 };
    		var self = this;
    		this.radius = params.radius;
    		var defaultOffset = 0.5 * this.radius;
    		var defaultInnerRadius = this.radius / 3;
    		
    		var parseValue = function(value) {
    			try {
					return parseInt(value); 
				}
				catch(e) {
					if (value.substring(value.length - 1) == '%')
						return parseInt(value.substring(0, value - 1));
				}
    		}
    		
    		var calculateAdjustments = function(gradient) {
    			var offsetAdjustment = defaultOffset;
    			var innerRadius = defaultInnerRadius;
    			if (gradient.offset) offsetAdjustment = parseValue(gradient.offset);
            	if(gradient.innerRadius) innerRadius = parseValue(gradient.innerRadius);
            	return [offsetAdjustment, innerRadius];
    		};
    		
	    	this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {
    			var radius = endpointStyle.radius || self.radius;
    			var x = anchorPoint[0] - radius;
    			var y = anchorPoint[1] - radius;
    			jsPlumb.sizeCanvas(canvas, x, y, radius * 2, radius * 2);
    			var ctx = canvas.getContext('2d');
    			var style = applyPaintStyle({}, endpointStyle);
    			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
    			applyPaintStyle(ctx, style);
    			
    			var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
                if (endpointStyle.gradient && !ie) {
                	
                	var adjustments = calculateAdjustments(endpointStyle.gradient); 
                	var yAdjust = orientation[1] == 1 ? adjustments[0] * -1 : adjustments[0];
                	var xAdjust = orientation[0] == 1 ? adjustments[0] * -1:  adjustments[0];
                	var g = ctx.createRadialGradient(radius, radius, radius, radius + xAdjust, radius + yAdjust, adjustments[1]);
    	            for (var i = 0; i < endpointStyle.gradient.stops.length; i++)
    	            	g.addColorStop(endpointStyle.gradient.stops[i][0], endpointStyle.gradient.stops[i][1]);
    	            ctx.fillStyle = g;
                }
    			
    			ctx.beginPath();    			
    			ctx.arc(radius, radius, radius, 0, Math.PI*2, true);
    			ctx.closePath();
    			ctx.fill();
	    	};
    	},
    	
    	/**
    	 * A Rectangular endpoint, with default size 20x20.
    	 */
    	Rectangle : function(params) {
        	
    		params = params || { width:20, height:20 };
    		var self = this;
    		this.width = params.width;
    		this.height = params.height;
    		
	    	this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {    		
    			var width = endpointStyle.width || self.width;
    			var height = endpointStyle.height || self.height;
    			var x = anchorPoint[0] - (width/2);
    			var y = anchorPoint[1] - (height/2);
    			jsPlumb.sizeCanvas(canvas, x, y, width, height);
    			var ctx = canvas.getContext('2d');
    			//todo: the fillStyle needs some thought. we want to support a few options:
    			// 1. nothing supplied; use the stroke color or the default if no stroke color.
    			// 2. a fill color supplied - use it
    			// 3. a gradient supplied - use it
    			// 4. setting the endpoint to the same color as the bg of the element it is attached to.
    			var style = applyPaintStyle({}, endpointStyle);
    			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
    			applyPaintStyle(ctx, style);
    			
    			var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
                if (endpointStyle.gradient && !ie) {
                	// first figure out which direction to run the gradient in (it depends on the orientation of the anchors)
                	var y1 = orientation[1] == 1 ? height : orientation[1] == 0 ? height / 2 : 0;
                	var y2 = orientation[1] == -1 ? height : orientation[1] == 0 ? height / 2 : 0;
                	var x1 = orientation[0] == 1 ? width : orientation[0] == 0 ? width / 2 : 0;
                	var x2 = orientation[0] == -1 ? width : orientation[0] == 0 ? height / 2 : 0;
    	            var g = ctx.createLinearGradient(x1,y1,x2,y2);
    	            for (var i = 0; i < endpointStyle.gradient.stops.length; i++)
    	            	g.addColorStop(endpointStyle.gradient.stops[i][0], endpointStyle.gradient.stops[i][1]);
    	            ctx.fillStyle = g;
                }
    			
    			ctx.beginPath();
    			ctx.rect(0, 0, width, height);
    			ctx.closePath();
    			ctx.fill();
	    	};
    	}, 
    	
    	/**
    	 * Image endpoint - draws an image as the endpoint.  You must provide a 'url' property in the params object..
    	 */
    	Image : function(params) {
    		var self = this;
    		this.img = new Image();
    		var ready = false;
    		this.img.onload = function() {
    			self.ready = true;
    		};
    		this.img.src = params.url;
    		
    		var actuallyPaint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {
    			var width = self.img.width || endpointStyle.width;
    			var height = self.img.height || endpointStyle.height;
    			var x = anchorPoint[0] - (width/2);
    			var y = anchorPoint[1] - (height/2);
    			jsPlumb.sizeCanvas(canvas, x, y, width, height);
    			var ctx = canvas.getContext('2d');
    			ctx.drawImage(self.img,0,0);
    		};
    		
    		this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {
    			if (self.ready) {
	    			actuallyPaint(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle)
    			}
    			else 
    				window.setTimeout(function() {    					
    					self.paint(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle);
    				}, 200);
    		};    		
    	}
    },
    
    /**
     * adds an endpoint to the element
     */
    addEndpoint : function(params) {
    	var e = new Endpoint(params);
    	var el = $(params.source);
    	_addToList(endpointsByElement, el.attr("id"), e);
    },
    
    /**
     * establishes a connection between two elements.
     * @param params object containing setup for the connection.  see documentation.
     */
    connect : function(params) {
    	var jpc = new jsPlumbConnection(params);    	
    	
		// register endpoints for the element
		/*var sourceEndpoint = new Endpoint({canvas:jpc.endpoints[0], connections:[jpc]});
		var targetEndpoint = new Endpoint({canvas:jpc.endpoints[1], connections:[jpc]});*/
		_addToList(endpointsByElement, jpc.sourceId, jpc.endpoints[0]);
		_addToList(endpointsByElement, jpc.targetId, jpc.endpoints[1]);
    },           
    
    /**
     * Remove one connection to an element.
     * @param sourceId id of the first window in the connection
     * @param targetId id of the second window in the connection
     * @return true if successful, false if not.
     */
    detach : function(sourceId, targetId) {
    	var f = function(jpc) {
    		if ((jpc.sourceId == sourceId && jpc.targetId == targetId) || (jpc.targetId == sourceId && jpc.sourceId == targetId)) {
    			removeCanvas(jpc.canvas);
				removeCanvas(jpc.targetEndpointCanvas);
				removeCanvas(jpc.sourceEndpointCanvas);    			
    			return true;
    		}    		
    	};    	
    	
    	// todo: how to cleanup the actual storage?  a third arg to _operation?
    	_operation(sourceId, f);    	
    },
    
    /**
     * remove all an element's connections.
     * @param elId id of the 
     */
    detachAll : function(elId) {    	
    	
    	var f = function(jpc) {
    		removeCanvas(jpc.canvas);
			removeCanvas(jpc.targetEndpointCanvas);
			removeCanvas(jpc.sourceEndpointCanvas);
    	};
    	_operation(elId, f);
    	delete endpointsByElement[elId];    	
    },
    
    /**
     * remove all connections.
     */
    detachEverything : function() {
    	var f = function(jpc) {
    		removeCanvas(jpc.canvas);
			removeCanvas(jpc.targetEndpointCanvas);
			removeCanvas(jpc.sourceEndpointCanvas);
    	};
    	
    	//for (var elId in endpointsByElement) {    		    	  
    		_operationOnAll(f);
    	//}
    	delete endpointsByElement;
    	endpointsByElement = {};
    },    
    
    /**
     * Gets all endpoints for the element with the given id.
     */
    getEndpoints : function(elId) {
    	return endpointsByElement[elId];
    },
    
    /**
     * Set an element's connections to be hidden.
     */
    hide : function(elId) {
    	_setVisible(elId, "none");
    },
    
    /**
     * Creates an anchor with the given params.
     * x - the x location of the anchor as a percentage of the total width.  
	 * y - the y location of the anchor as a percentage of the total height.
	 * orientation - an [x,y] array indicating the general direction a connection from the anchor should go in.
	 * offsets - an [x,y] array of fixed offsets that should be applied after the x,y position has been figured out.  optional. defaults to [0,0]. 
     */
    makeAnchor : function(x, y, xOrientation, yOrientation, xOffset, yOffset) {
    	// backwards compatibility here.  we used to require an object passed in but that makes the call very verbose.  easier to use
    	// by just passing in four values.  but for backwards compatibility if we are given only one value we assume it's a call in the old form.
    	var params = {};
    	if (arguments.length == 1) $.extend(params, x);
    	else {
    		params = {x:x, y:y};
    		if (arguments.length >= 4) {
    			params.orientation = [arguments[2], arguments[3]];
    		}
    		if (arguments.length == 6) params.offsets = [arguments[4], arguments[5]];
    	}
    	return new Anchor(params);
    },
        
    
    /**
     * repaint element and its connections. element may be an id or the actual jQuery object.
     * this method gets new sizes for the elements before painting anything.
     */
    repaint : function(el) {
    	var _repaint = function(el, elId) {
	    	var loc = {'absolutePosition': el.offset()};
	    	var f = function(jpc) {
	    		jpc.paint(elId, loc, true);
	    	};
	    	_operation(elId, f);
    	};
    	
    	var _processElement = function(el) {
    		var ele = typeof(el)=='string' ? $("#" + el) : el;
	    	var eleId = ele.attr("id");
	    	_repaint(ele, eleId);
    	};
    	
    	// TODO: support a jQuery result object too!
    	
    	// support both lists...
    	if (typeof el =='object') {
    		for (var i = 0; i < el.length; i++)
    			_processElement(el[i]);
    	} // ...and single strings.
    	else _processElement(el);
    },       
    
    /**
     * repaint all connections.
     */
    repaintEverything : function() {
    	var f = function(jpc) { jpc.repaint(); }
    	for (var elId in endpointsByElement) {  
    		_operation(elId, f);
    	}
    },
    
    /**
     * sets/unsets automatic repaint on window resize.
     */
    setAutomaticRepaint : function(value) {
    	automaticRepaint = value;
    },
    
    /**
     * Sets the default size jsPlumb will use for a new canvas (we create a square canvas so
     * one value is all that is required).  This is a hack for IE, because ExplorerCanvas seems
     * to need for a canvas to be larger than what you are going to draw on it at initialisation
     * time.  The default value of this is 1200 pixels, which is quite large, but if for some
     * reason you're drawing connectors that are bigger, you should adjust this value appropriately.
     */
    setDefaultNewCanvasSize : function(size) {
    	DEFAULT_NEW_CANVAS_SIZE = size;    	
    },
    
    /**
     * Sets the function to fire when the window size has changed and a repaint was fired.
     */
    setRepaintFunction : function(f) {
    	repaintFunction = f;
    },
        
    /**
     * Set an element's connections to be visible.
     */
    show : function(elId) {
    	_setVisible(elId, "block");
    },
    
    /**
     * helper to size a canvas.
     */
    sizeCanvas : function(canvas, x, y, w, h) {
        canvas.style.height = h + "px"; canvas.height = h;
        canvas.style.width = w + "px"; canvas.width = w; 
        canvas.style.left = x + "px"; canvas.style.top = y + "px";
    },
    
    /**
     * Toggles visibility of an element's connections.
     */
    toggle : function(elId) {
    	var f = function(jpc) {
    		_setVisible(elId, "none" == jpc.canvas.style.display ? "block" : "none");
    	};
    	_operation(elId, f);
    }, 
    
    /**
     * Unloads jsPlumb, deleting all storage.  You should call this 
     */
    unload : function() {
    	delete endpointsByElement;
		delete offsets;
		delete sizes;    	
    }
};

// ************** connection
// ****************************************
/**
* allowed params:
* source:	source element (string or a jQuery element) (required)
* target:	target element (string or a jQuery element) (required)
* anchors: optional array of anchor placements. defaults to BottomCenter for source
*          and TopCenter for target.
*/
var jsPlumbConnection = function(params) {

// ************** get the source and target and register the connection. *******************
    var self = this;
    // get source and target as jQuery objects
    this.source = (typeof params.source == 'string') ? $("#" + params.source) : params.source;    
    this.target = (typeof params.target == 'string') ? $("#" + params.target) : params.target;
    this.sourceId = $(this.source).attr("id");
    this.targetId = $(this.target).attr("id");
    this.endpointsOnTop = params.endpointsOnTop != null ? params.endpointsOnTop : true;
    
 // get anchor
    this.anchors = params.anchors || jsPlumb.DEFAULT_ANCHORS || [jsPlumb.Anchors.BottomCenter, jsPlumb.Anchors.TopCenter];
    // make connector
    this.connector = params.connector || jsPlumb.DEFAULT_CONNECTOR || new jsPlumb.Connectors.Bezier();
    this.paintStyle = params.paintStyle || jsPlumb.DEFAULT_PAINT_STYLE;
    
    // init endpoints
    this.endpoints = [];
    if(!params.endpoints) params.endpoints = [null,null];
    //this.endpoints[0] = params.endpoints[0] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[0] || jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();
    //this.endpoints[1] = params.endpoints[1] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[1] ||jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();    
    var endpoint0 = params.endpoints[0] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[0] || jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();
    var endpoint1 = params.endpoints[1] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[1] ||jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();;
    
    this.endpointStyles = [];
    if (!params.endpointStyles) params.endpointStyles = [null,null];
    /*this.endpointStyles[0] = params.endpointStyles[0] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[0] || jsPlumb.DEFAULT_ENDPOINT_STYLE;
    this.endpointStyles[1] = params.endpointStyles[1] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[1] || jsPlumb.DEFAULT_ENDPOINT_STYLE;*/
    var endpointStyle0 = params.endpointStyles[0] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[0] || jsPlumb.DEFAULT_ENDPOINT_STYLE;
    var endpointStyle1 = params.endpointStyles[1] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[1] || jsPlumb.DEFAULT_ENDPOINT_STYLE;
    
    this.endpoints[0] = new Endpoint({style:endpointStyle0, endpoint:endpoint0, connections:[self] });
    this.endpoints[1] = new Endpoint({style:endpointStyle1, endpoint:endpoint1, connections:[self] });
    
    offsets[this.sourceId] = this.source.offset(); 
    sizes[this.sourceId] = [this.source.outerWidth(), this.source.outerHeight()]; 
    offsets[this.targetId] = this.target.offset();
    sizes[this.targetId] = [this.target.outerWidth(), this.target.outerHeight()];

// *************** create canvases on which the connection will be drawn ************
    var canvas = newCanvas(jsPlumb.connectorClass);
    this.canvas = canvas;
    // create endpoint canvases
    /*this.sourceEndpointCanvas = newCanvas(jsPlumb.endpointClass);	    
    this.targetEndpointCanvas = newCanvas(jsPlumb.endpointClass);*/
 // register the connection on the endpoints. if the endpoints get dragged we can repaint the
    // whole connection.
    /*this.sourceEndpointCanvas.connection = self;
    this.targetEndpointCanvas.connection = self;*/
    // sit them on top of the underlying element?
    /*if (this.endpointsOnTop) {
	    $(this.sourceEndpointCanvas).css("zIndex", this.source.css("zIndex") + 1);
	    $(this.targetEndpointCanvas).css("zIndex", this.target.css("zIndex") + 1);
    } else {
	    $(this.sourceEndpointCanvas).css("zIndex", this.source.css("zIndex") - 1);
	    $(this.targetEndpointCanvas).css("zIndex", this.target.css("zIndex") - 1);
    }*/
// ************** store the anchors     
  
    /**
     * notification from an endpoint that it is currently floating.  the next time we paint, we should
     * use the offset given here for the anchor location rather than the static position.
     */
    this.endpointFloating = function(endpoint, offset) {
    	
    	
    };
    
    /**
     * paints the connection.
     * @param elId Id of the element that is in motion
     * @param ui jQuery's event system ui object (present if we came from a drag to get here)
     * @param recalc whether or not to recalculate element sizes. this is true if a repaint caused this to be painted.
     */
    this.paint = function(elId, ui, recalc) {    	
    	// if the moving object is not the source we must transpose the two references.
    	var swap = !(elId == this.sourceId);
    	var tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId;
    	var tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;
    	
    	if (this.canvas.getContext) {    		    		
    		    		
    		_updateOffset(elId, ui, recalc);
    		if (recalc) _updateOffset(tId);  // update the target if this is a foreced repaint. otherwise, only the source has been moved.
    		
    		var myOffset = offsets[elId]; 
    		var otherOffset = offsets[tId];
    		var myWH = sizes[elId];
            var otherWH = sizes[tId];
            
    		var ctx = canvas.getContext('2d');
            var sAnchorP = this.anchors[sIdx].compute([myOffset.left, myOffset.top], myWH, [otherOffset.left, otherOffset.top], otherWH);
            var sAnchorO = this.anchors[sIdx].orientation;
            var tAnchorP = this.anchors[tIdx].compute([otherOffset.left, otherOffset.top], otherWH, [myOffset.left, myOffset.top], myWH);
            var tAnchorO = this.anchors[tIdx].orientation;
            var dim = this.connector.compute(sAnchorP, tAnchorP, this.anchors[sIdx], this.anchors[tIdx], this.paintStyle.lineWidth);
            jsPlumb.sizeCanvas(canvas, dim[0], dim[1], dim[2], dim[3]);
            applyPaintStyle(ctx, this.paintStyle);
                        
            if (this.paintStyle.gradient && !ie) { 
	            var g = swap ? ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]) : ctx.createLinearGradient(dim[6], dim[7], dim[4], dim[5]);
	            for (var i = 0; i < this.paintStyle.gradient.stops.length; i++)
	            	g.addColorStop(this.paintStyle.gradient.stops[i][0],this.paintStyle.gradient.stops[i][1]);
	            ctx.strokeStyle = g;
            }
            	            
            this.connector.paint(dim, ctx);
                            
        	/*var style = this.endpointStyle || this.paintStyle;
        	var sourceCanvas = swap ? this.targetEndpointCanvas : this.sourceEndpointCanvas;
        	var targetCanvas = swap ? this.sourceEndpointCanvas : this.targetEndpointCanvas;
        	this.endpoints[swap ? 1 : 0].paint(sAnchorP, sAnchorO, sourceCanvas, this.endpointStyles[swap ? 1 : 0] || this.paintStyle, this.paintStyle);
        	this.endpoints[swap ? 0 : 1].paint(tAnchorP, tAnchorO, targetCanvas, this.endpointStyles[swap ? 0 : 1] || this.paintStyle, this.paintStyle);*/
            this.endpoints[swap ? 1 : 0].paint(sAnchorP, /*sAnchorO, */this.paintStyle);
        	this.endpoints[swap ? 0 : 1].paint(tAnchorP, /*tAnchorO, */this.paintStyle);
    	}
    };
    
    this.repaint = function() {
    	this.paint(this.sourceId, null, true);
    };

    // dragging
    var draggable = params.draggable == null ? true : params.draggable;
    if (draggable) {    	
    	var dragOptions = params.dragOptions || jsPlumb.DEFAULT_DRAG_OPTIONS; 
    	var dragCascade = dragOptions.drag || function(e,u) {};
    	var initDrag = function(element, dragFunc) {
    		// todo use $.extend here
    		var opts = {};
        	for (var i in dragOptions) {
                opts[i] = dragOptions[i];
            }
        	opts.drag = dragFunc;
        	element.draggable(opts);
    	};
    	initDrag(this.source, function(event, ui) {
    		_drag(self.source, ui);
    		dragCascade(event, ui);
    	});
    	initDrag(this.target, function(event, ui) {
    		_drag(self.target, ui);
    		dragCascade(event, ui);
    	});
    }
    
    // resizing (using the jquery.ba-resize plugin). todo: decide whether to include or not.
    if (this.source.resize) {
    	this.source.resize(function(e) {
    		jsPlumb.repaint(self.sourceId);
    	});
    }
    
    // draggable endpoints.  put this on a toggle or something.
   /* $(this.sourceEndpointCanvas).drag(function(event, ui) {
    	
    });
    
    $(this.targetEndpointCanvas).drag(function(event, ui) {
    	
    });*/
    
    // finally, draw it.
    var o = this.source.offset();
    this.paint(this.sourceId, {'absolutePosition': this.source.offset()});
};

})();

// jQuery plugin code
(function($){
	/**
	 * plumbs the results of the selector to some target, using the given options if supplied,
	 * or the defaults otherwise.
	 */
    $.fn.plumb = function(options) {
        var options = $.extend({}, options);

        return this.each(function()
        {
            var params = $.extend({source:$(this)}, options);
            jsPlumb.connect(params);
        });
  };
  
  /**
   * detaches the results of the selector from the given target or list of targets - 'target'
   * may be a String or a List.
   */
  $.fn.detach = function(target) {
	  return this.each(function() 
	  {
		 var id = $(this).attr("id");
		 if (typeof target == 'string') target = [target];
		 for (var i = 0; i < target.length; i++)
			 jsPlumb.detach(id, target[i]);
	  });	  
  };
  
  /**
   * detaches the results from the selector from all connections. 
   */
  $.fn.detachAll = function() {
	  return this.each(function() 
	  {
		 var id = $(this).attr("id");		 
		 jsPlumb.detachAll(id);
	  });	  
  };
  
  /**
   * adds an endpoint to the elements resulting from the selector.  options may be null,
   * in which case jsPlumb will use the default options. see documentation. 
   */
  $.fn.addEndpoint = function(options) {
	  return this.each(function() 
	  {
		  var params = $.extend({source:$(this)}, options);		 
		 jsPlumb.addEndpoint(params);
	  });	  
  };
  
})(jQuery);

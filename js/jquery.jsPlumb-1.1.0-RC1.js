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
	var floatingConnections = {};
	var draggableStates = {};
	var _draggableByDefault = true;
	var sizes = [];
	
	var DEFAULT_NEW_CANVAS_SIZE = 1200; // only used for IE; a canvas needs a size before the init call to excanvas (for some reason. no idea why.)	
	
	var _getId = function(element) {
		var id = $(element).attr("id");
		if (!id) {
			id = "_jsPlumb_" + new String((new Date()).getTime());
			$(element).attr("id", id);
		}
		return id;
	};
	
    /**
     * Handles the dragging of an element.  
     * @param element jQuery element
     * @param ui UI object from jQuery's event system
     */
    var _draw = function(element, ui) {
    	var id = $(element).attr("id");    	
    	var endpoints = endpointsByElement[id];
    	if (endpoints) {
	    	// loop through endpoints for this element
	    	for (var i = 0; i < endpoints.length; i++) {
	    		var e = endpoints[i];
	    		// first, paint the endpoint
	    		if (ui == null)
	    			_updateOffset(id, ui);
	    		//todo...connector paint style?  we have lost that with the move to endpoint-centric.
	    		// perhaps we only paint the endpoint here if it has no connections; it can use its own style.
	    		if (!e.connections || e.connections.length == 0)
	    			e.paint();
	    		else {
		    		// get all connections for the endpoint...
		    		var l = e.connections;
		    		for (var j = 0; j < l.length; j++)
		    			l[j].paint(id, ui);  // ...and paint them.
	    		}
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
		if (recalc || ui == null) {  // if forced repaint or no ui helper available, we recalculate.
    		// get the current size and offset, and store them
    		var s = $("#" + elId);
    		sizes[elId] = [s.outerWidth(), s.outerHeight()];
    		offsets[elId] = s.offset();
		} else {
			// faster to use the ui element if it was passed in.
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
     * helper method to remove an item from a list.
     */
    var _removeFromList = function(map, key, value) {
		var l = map[key];
		if (l != null) {
			for (var i = 0; i < l.length; i++) {
				if (l[i] == value) {
					delete(l[i]); break;
				}
			}
		}		
	};
	
    /**
     * Sets whether or not the given element(s) should be draggable, regardless of what a particular
     * plumb command may request.
     * 
     * @param element May be a string, an jQuery object, or a list of strings.
     * @param draggable Whether or not the given element(s) should be draggable.
     */
	var _setDraggable = function(element, draggable) {    
    	var _helper = function(el, id) {
    		draggableStates[id] = draggable;
        	if (el.draggable) {
        		el.draggable("option", "disabled", !draggable);
        	}
    	};
    	
    	if (typeof element == 'object' && element.length) {
    		for (var i = 0; i < element.length; i++) {
    			_helper($(element[i]), element[i]);
    		}
    	}
    	else {
	    	var el = typeof element == 'string' ? $("#" + element) : element;
	    	var id = el.attr("id");
	    	_helper(el, id);
    	}
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
    var _newCanvas = function(clazz) {
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
     * helper to remove a list of elements from the DOM.
     */
    var _removeElements = function(elements) {
    	for (var i in elements)
    		_removeElement(elements[i]);
    }
    
    /**
     * helper to remove an element from the DOM.
     */
    var _removeElement = function(element) {
    	if (element != null) { 
    		try { document.body.removeChild(element); }
    		catch (e) { }
    	}    	
    };
    
    var _wrap = function(cascadeFunction, plumbFunction) {
    	cascadeFunction = cascadeFunction || function(e, ui) { };
    	return function(e, ui) {
    		plumbFunction(e, ui);
    		cascadeFunction(e, ui);
    	};
    }
	
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
		this.x = params.x || 0; this.y = params.y || 0; 
		var orientation = params.orientation || [0,0];
		this.offsets = params.offsets || [0,0];
		this.compute = function(xy, wh, txy, twh) {
			return [ xy[0] + (self.x * wh[0]) + self.offsets[0], xy[1] + (self.y * wh[1]) + self.offsets[1] ];
		}
		this.getOrientation = function() { return orientation; };
	};
	
	/**
	 * an anchor that floats.  its orientation is computed dynamically from its position relative
	 * to the anchor it is floating relative to.
	 */
	var FloatingAnchor = function(params) {
		
		// this is the anchor that this floating anchor is referenced to for purposes of calculating the orientation.
		var ref = params.reference;
		// these are used to store the current relative position of our anchor wrt the reference anchor.  they only indicate
		// direction, so have a value of 1 or -1 (or, very rarely, 0).  these values are written by the compute method, and read
		// by the getOrientation method.
		var xDir = 0, yDir = 0; 
		
		this.compute = function(xy, wh, txy, twh) {
			xDir = xy[0] < txy[0] ? -1 : xy[0] == txy[0] ? 0 : 1;
			yDir = xy[1] < txy[1] ? -1 : xy[1] == txy[1] ? 0 : 1;
			return [xy[0], xy[1]];  // return origin of the element.  we may wish to improve this so that any object can be the drag proxy.
		};
		
		this.getOrientation = function() { 
			var o = ref.getOrientation();
			// here we take into account the orientation of the other anchor: if it declares zero for some direction, we declare zero too.
			// this might not be the most awesome.  perhaps we can come up with a better way.  it's just so that the line we draw looks
			// like it makes sense.  maybe this wont make sense.
			return [Math.abs(o[0]) * xDir * -1, Math.abs(o[1]) * yDir * -1]; 
		};
	};
	
	/**
	 * models an endpoint.  can have one to N connections emanating from it (although how to handle that in the UI is
	 * a very good question). also has a Canvas and paint style.
	 */
	var Endpoint = function(params) {
		params = params || {};
		var self = this;
		var _typeId = params.typeId;  // may be null
		var _anchor = params.anchor || jsPlumb.Anchors.TopCenter;
		var _endpoint = params.endpoint || new jsPlumb.Endpoints.Dot();
		var _style = params.style || jsPlumb.DEFAULT_ENDPOINT_STYLE;
		var _element = params.source;
		var _elementId = $(_element).attr("id");
		this.canvas = params.canvas || _newCanvas(jsPlumb.endpointClass);
		this.connections = params.connections || [];
		this.addConnection = function(connection) {
			self.connections.push(connection);
		};
		this.paint = function(anchorPoint, connectorPaintStyle, canvas) {
			if (anchorPoint == null) {				
				var xy = offsets[_elementId];
				var wh = sizes[_elementId];
				if (xy == null || wh == null) {
					_updateOffset(_elementId);
					var xy = offsets[_elementId];
					var wh = sizes[_elementId];
				}
				anchorPoint = _anchor.compute([xy.left, xy.top], wh);
			}
			_endpoint.paint(anchorPoint, _anchor.getOrientation(), canvas || self.canvas, _style, connectorPaintStyle || _style);
		};
		// is this a connection source? we make it draggable and have the drag listener 
		// maintain a connection with a floating endpoint.
		if (params.isSource) {
			
			var d = null, n = null, id = null, floatingEndpoint = null, jpc = null;
			var f = function() { return n; };
			
			var start = function(e, ui) {
				n = document.createElement("div");
				//document.body.appendChild(n);...seems to be not needed.
				// create and assign an id, and initialize the offset.
				id = new String(new Date().getTime());				
				$(n).attr("id", id);
				_updateOffset(id);
				$(self.canvas).attr("dragId", id);
				$(self.canvas).attr("elId", _elementId);
				
				var floatingAnchor = new FloatingAnchor({reference:_anchor});
				floatingEndpoint = new Endpoint({
					style:_style, 
					endpoint:_endpoint, 
					anchor:floatingAnchor, 
					source:n 
				});
				
				// create a connection. one end is this endpoint, the other is a floating endpoint.
				jpc = new jsPlumbConnection({
					sourceEndpoint:self, 
					targetEndpoint:floatingEndpoint,
					source:$(_element),
					target:$(n),
					anchors:[_anchor, floatingAnchor],
					// todo parameterize.  it should be defined on the endpoint - what is the style of 
					// connector this endpoint is the source of?
					connector: new jsPlumb.Connectors.Bezier()
				});
				
				floatingConnections[id] = jpc;
				
				// todo unregister on stop
				floatingEndpoint.addConnection(jpc);
				// todo ...unregister on stop
				self.addConnection(jpc);
				
				// only register for the target endpoint; we will not be dragging the source at any time
				// before this connection is either discarded or made into a permanent connection.
				_addToList(endpointsByElement, id, floatingEndpoint);
			};
			
			var dragOptions = params.dragOptions || { };
			var dragFunc = dragOptions.dragFunc || function(e, u) { };
			var stopFunc = dragOptions.stopFunc || function(e, u) { };
			var options = $.extend( { opacity:0.5, revert:true, helper:'clone', 
				start : start,
				drag: function(e, ui) {				
					_draw($(n), ui);
					dragFunc(e, ui);
				}, 				
				stop : function(e, ui) {
					_removeFromList(endpointsByElement, id, floatingEndpoint);
					_removeElements([floatingEndpoint.canvas, n]);
					if (jpc.endpoints[1] == floatingEndpoint) {						
						_removeElement(jpc.canvas);						
					}
					stopFunc(e, ui);
				}
			}, dragOptions);
			
			/*options.start = _wrap(options.start, start);
			options.drag = _wrap(options.drag, function(e, ui) { _draw($(n)); });
			options.stop = _wrap(options.stop, function(e, ui) {
				_removeFromList(endpointsByElement, id, floatingEndpoint);
				_removeElements([floatingEndpoint.canvas, n]);
				if (jpc.endpoints[1] == floatingEndpoint) {						
					_removeElement(jpc.canvas);						
				}
			});*/
			
			// todo make parameterisable things like opacity/revert
			$(self.canvas).draggable(options);
		}
		
		// connector target
		if (params.isTarget) {
			var dropOptions = params.dropOptions || jsPlumb.DEFAULT_DROP_OPTIONS; 
	    	var originalAnchor = null;
	    	dropOptions.drop = _wrap(dropOptions.drop , function(e, ui) {
	    		var id = $(ui.draggable).attr("dragId");
	    		var jpc = floatingConnections[id];
	    		jpc.target = _element;
	    		jpc.targetId = _elementId;
	    		jpc.anchors[1] = _anchor;
	    		jpc.endpoints[1] = self;
	    		self.addConnection(jpc);
	    		jsPlumb.repaint($(ui.draggable).attr("elId"));
	    		delete floatingConnections[id];
			 });
	    	// what to do when something is dropped.
	    	// 1. find the jpc that is being dragged.  the target endpoint of the jpc will be the
	    	// one that is being dragged.
	    	// 2. arrange for the floating endpoint to be replaced with this endpoint; make sure
	    	//    everything gets registered ok etc.
	    	// 3. arrange for the floating endpoint to be deleted.
	    	// 4. make sure that the stop method of the drag does not cause the jpc to be cleaned up.  we want to keep it now.
	    	
			// other considerations: when in the hover mode, we should switch the floating endpoint's
	    	// orientation to be the same as the drop target.  this will cause the connector to snap
	    	// into the shape it will take if the user drops at that point.
			 
			dropOptions.over = _wrap(dropOptions.over, function(event, ui) {  
				var id = $(ui.draggable).attr("dragId");
		    	var jpc = floatingConnections[id];
		    	originalAnchor = jpc.anchors[1];
		    	jpc.anchors[1] = _anchor;
			 });
			 
			 dropOptions.out = _wrap(dropOptions.out, function(event, ui) {  
				var id = $(ui.draggable).attr("dragId");
		    	var jpc = floatingConnections[id];
		    	if(originalAnchor)	
		    		jpc.anchors[1] = originalAnchor;
			 });
			 		
			$(self.canvas).droppable(dropOptions);
			
		}
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
            
            this._findControlPoint = function(point, sourceAnchorPosition, targetAnchorPosition, sourceAnchor, targetAnchor) {
            	// determine if the two anchors are perpendicular to each other in their orientation.  we swap the control 
            	// points around if so (code could be tightened up)
            	var soo = sourceAnchor.getOrientation(), too = targetAnchor.getOrientation();
            	var perpendicular = soo[0] != too[0] || soo[1] == too[1]; 
                var p = [];            
                var ma = self.majorAnchor, mi = self.minorAnchor;                
                if (!perpendicular) {
	                  if (soo[0] == 0) // X
	                    p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + mi : point[0] - mi);
	                else p.push(point[0] - (ma * soo[0]));
	                                 
	                 if (soo[1] == 0) // Y
	                	p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + mi : point[1] - mi);
	                else p.push(point[1] + (ma * too[1]));
                }
                 else {
	                if (too[0] == 0) // X
	                	p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + mi : point[0] - mi);
	                else p.push(point[0] + (ma * too[0]));
	                
	                if (too[1] == 0) // Y
	                	p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + mi : point[1] - mi);
	                else p.push(point[1] + (ma * soo[1]));
                 }

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
     * Types of endpoint UIs.  we supply four - a blank one, a circle of default radius 10px, a rectangle of
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
    			var style = $.extend({}, endpointStyle);
    			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
    			$.extend(ctx, style);
    			
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
    			var style = $.extend({}, endpointStyle);
    			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
    			$.extend(ctx, style);
    			
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
    	e.paint();
    },
    
    /**
     * adds a list of endpoints to the element
     */
    addEndpoints : function(endpoints, source) {
    	for (var i = 0; i < endpoints.length; i++) {
    		var params = $.extend({source:source}, endpoints[i]);
    		jsPlumb.addEndpoint(params);
    	}
    },
    
    /**
     * establishes a connection between two elements.
     * @param params object containing setup for the connection.  see documentation.
     */
    connect : function(params) {
    	var jpc = new jsPlumbConnection(params);    	
    	
		// register endpoints for the element
		_addToList(endpointsByElement, jpc.sourceId, jpc.endpoints[0]);
		_addToList(endpointsByElement, jpc.targetId, jpc.endpoints[1]);
		
		// force a paint
		_draw(jpc.source);
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
    			_removeElement(jpc.canvas);
				_removeElement(jpc.targetEndpointCanvas);
				_removeElement(jpc.sourceEndpointCanvas);    			
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
    		// todo replace with _cleanupConnection call here.
    		_removeElement(jpc.canvas);
			_removeElement(jpc.targetEndpointCanvas);
			_removeElement(jpc.sourceEndpointCanvas);
    	};
    	_operation(elId, f);
    	delete endpointsByElement[elId];    	
    },
    
    /**
     * remove all connections.
     */
    detachEverything : function() {
    	var f = function(jpc) {
    		_removeElement(jpc.canvas);
			_removeElement(jpc.targetEndpointCanvas);
			_removeElement(jpc.sourceEndpointCanvas);
    	};
    	
    	_operationOnAll(f);
    	
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
     * Sets whether or not a given element is draggable, regardless of what any plumb command
     * may request. 
     */
    setDraggable: function(element, draggable) {
    	_setDraggable(element, draggable);
    },
    
    /**
     * Sets whether or not elements are draggable by default.  Default for this is true.
     */
    setDraggableByDefault: function(draggable) {
    	_draggableByDefault = draggable;
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
		delete floatingConnections;
		delete draggableStates;		
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
    var endpoint0 = params.endpoints[0] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[0] || jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();
    var endpoint1 = params.endpoints[1] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[1] ||jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();;
    
    this.endpointStyles = [];
    if (!params.endpointStyles) params.endpointStyles = [null,null];
    var endpointStyle0 = params.endpointStyles[0] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[0] || jsPlumb.DEFAULT_ENDPOINT_STYLE;
    var endpointStyle1 = params.endpointStyles[1] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[1] || jsPlumb.DEFAULT_ENDPOINT_STYLE;
    
    this.endpoints[0] = params.sourceEndpoint || new Endpoint({style:endpointStyle0, endpoint:endpoint0, connections:[self] });
    this.endpoints[1] = params.targetEndpoint || new Endpoint({style:endpointStyle1, endpoint:endpoint1, connections:[self] });
    
    offsets[this.sourceId] = this.source.offset(); 
    sizes[this.sourceId] = [this.source.outerWidth(), this.source.outerHeight()]; 
    offsets[this.targetId] = this.target.offset();
    sizes[this.targetId] = [this.target.outerWidth(), this.target.outerHeight()];

// *************** create canvases on which the connection will be drawn ************
    var canvas = _newCanvas(jsPlumb.connectorClass);
    this.canvas = canvas;
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
    	var el = swap ? this.target : this.source;
    	
    	if (this.canvas.getContext) {    		    		
    		    		
    		_updateOffset(elId, ui, recalc);
    		if (recalc) _updateOffset(tId);  // update the target if this is a forced repaint. otherwise, only the source has been moved.
    		
    		var myOffset = offsets[elId]; 
    		var otherOffset = offsets[tId];
    		var myWH = sizes[elId];
            var otherWH = sizes[tId];
            
    		var ctx = canvas.getContext('2d');
            var sAnchorP = this.anchors[sIdx].compute([myOffset.left, myOffset.top], myWH, [otherOffset.left, otherOffset.top], otherWH);
            var sAnchorO = this.anchors[sIdx].getOrientation();
            var tAnchorP = this.anchors[tIdx].compute([otherOffset.left, otherOffset.top], otherWH, [myOffset.left, myOffset.top], myWH);
            var tAnchorO = this.anchors[tIdx].getOrientation();
            var dim = this.connector.compute(sAnchorP, tAnchorP, this.anchors[sIdx], this.anchors[tIdx], this.paintStyle.lineWidth);
            jsPlumb.sizeCanvas(canvas, dim[0], dim[1], dim[2], dim[3]);
            $.extend(ctx, this.paintStyle);
                        
            if (this.paintStyle.gradient && !ie) { 
	            var g = swap ? ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]) : ctx.createLinearGradient(dim[6], dim[7], dim[4], dim[5]);
	            for (var i = 0; i < this.paintStyle.gradient.stops.length; i++)
	            	g.addColorStop(this.paintStyle.gradient.stops[i][0],this.paintStyle.gradient.stops[i][1]);
	            ctx.strokeStyle = g;
            }
            	            
            this.connector.paint(dim, ctx);
                            
        	this.endpoints[swap ? 1 : 0].paint(sAnchorP, this.paintStyle);
        	this.endpoints[swap ? 0 : 1].paint(tAnchorP, this.paintStyle);
    	}
    };
    
    this.repaint = function() {
    	this.paint(this.sourceId, null, true);
    };

    // dragging
    var draggable = params.draggable == null ? _draggableByDefault : params.draggable;
    if (draggable && self.source.draggable) {    	
    	var dragOptions = params.dragOptions || jsPlumb.DEFAULT_DRAG_OPTIONS; 
    	var dragCascade = dragOptions.drag || function(e,u) {};
    	var initDrag = function(element, elementId, dragFunc) {
    		var opts = $.extend({drag:dragFunc}, dragOptions);
    		var draggable = draggableStates[elementId];
    		opts.disabled = draggable == null ? false : !draggable;
        	element.draggable(opts);
    	};
    	initDrag(this.source, this.sourceId, function(event, ui) {
    		 _draw(self.source, ui);
	    	dragCascade(event, ui);
    	});
    	initDrag(this.target, this.targetId, function(event, ui) {
    		_draw(self.target, ui);
	    	dragCascade(event, ui);
    	});
    }
    
    // resizing (using the jquery.ba-resize plugin). todo: decide whether to include or not.
    if (this.source.resize) {
    	this.source.resize(function(e) {
    		jsPlumb.repaint(self.sourceId);
    	});
    }
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
  
  /**
   * adds a list of endpoints to the elements resulting from the selector.  options may be null,
   * in which case jsPlumb will use the default options. see documentation. 
   */
  $.fn.addEndpoints = function(endpoints) {
	  return this.each(function() 
	  {		 
		 jsPlumb.addEndpoints(endpoints, $(this));
	  });	  
  };
  
})(jQuery);

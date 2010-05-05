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
	var _jsPlumbContextNode = null;
	
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
     * inits a draggable if it's not already initialised.
     * todo: if the element was draggable already, like from some non-jsPlumb call, wrap the drag function. 
     */
    var _initDraggableIfNecessary = function(element, elementId, isDraggable, dragOptions) {
    	// dragging
	    var draggable = isDraggable == null ? _draggableByDefault : isDraggable;
	    if (draggable && element.draggable) {    	
	    	var options = dragOptions || jsPlumb.DEFAULT_DRAG_OPTIONS; 
	    	var dragCascade = options.drag || function(e,u) {};
	    	var initDrag = function(element, elementId, dragFunc) {
	    		var opts = $.extend({drag:dragFunc}, options);
	    		var draggable = draggableStates[elementId];
	    		opts.disabled = draggable == null ? false : !draggable;
	        	element.draggable(opts);
	    	};
	    	initDrag(element, elementId, function(event, ui) {
	    		 _draw(element, ui);
		    	dragCascade(event, ui);
	    	});
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
			var i = l.indexOf(value);
			if (i >= 0) {
				delete( l[i] );
				l.splice( i, 1 );	
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
     * Returns (creating if necessary) the DIV element that jsPlumb uses as the context for all of its 
     * canvases.  having this makes it possible to makes calls like $("selector", context), which are
     * faster than if you provide no context.  also we can clear out everything easily like this, either
     * on a detachEverything() call or during unload().
     */
    var _getContextNode = function() {
    	if (_jsPlumbContextNode == null) {
    		_jsPlumbContextNode= document.createElement("div");
    		document.body.appendChild(_jsPlumbContextNode);
    	}
    	return $(_jsPlumbContextNode);
    };
    
    /**
     * helper to create a canvas.
     * @param clazz optional class name for the canvas.
     */
    var _newCanvas = function(clazz) {
        var canvas = document.createElement("canvas");
        _getContextNode().append(canvas);
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
    		try { _jsPlumbContextNode.removeChild(element); }
    		catch (e) { }
    	}    	
    };
    
    /**
     * wraps one function with another, creating a placeholder for the wrapped function
     * if it was null.  this is used to wrap the various drag/drop event functions - to allow
     * jsPlumb to be notified of important lifecycle events without imposing itself on the user's
     * drap/drop functionality.
     */
    var _wrap = function(cascadeFunction, plumbFunction) {
    	cascadeFunction = cascadeFunction || function(e, ui) { };
    	return function(e, ui) {
    		plumbFunction(e, ui);
    		cascadeFunction(e, ui);
    	};
    }
	
	/**
	 * Anchor class. Anchors can be situated anywhere.  
	 * params should contain three values, and may optionally have an 'offsets' argument:
	 * 
	 * x 			: the x location of the anchor as a fraction of the total width.
	 *   
	 * y 			: the y location of the anchor as a fraction of the total height.
	 * 
	 * orientation 	: an [x,y] array indicating the general direction a connection 
	 * 				  from the anchor should go in. for more info on this, see the documentation, 
	 * 				  or the docs in jquery-jsPlumb-defaults-XXX.js for the default Anchors.
	 * 
	 * offsets 		: an [x,y] array of fixed offsets that should be applied after the x,y position has been figured out.  may be null.
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
		// temporary member used to store an orientation when the floating anchor is hovering over another anchor.
		var orientation = null;
		
		this.compute = function(xy, wh, txy, twh) {
			// set these for the getOrientation method to use.
			xDir = xy[0] < txy[0] ? -1 : xy[0] == txy[0] ? 0 : 1;
			yDir = xy[1] < txy[1] ? -1 : xy[1] == txy[1] ? 0 : 1;
			return [xy[0], xy[1]];  // return origin of the element.  we may wish to improve this so that any object can be the drag proxy.
		};
		
		this.getOrientation = function() {
			if (orientation) return orientation;
			else {
				var o = ref.getOrientation();
				// here we take into account the orientation of the other anchor: if it declares zero for some direction, we declare zero too.
				// this might not be the most awesome.  perhaps we can come up with a better way.  it's just so that the line we draw looks
				// like it makes sense.  maybe this wont make sense.
				return [Math.abs(o[0]) * xDir * -1, Math.abs(o[1]) * yDir * -1];
			}
		};
		
		/**
		 * notification the endpoint associated with this anchor is hovering over another anchor; 
		 * we want to assume that anchor's orientation for the duration of the hover. 
		 */
		this.over = function(anchor) {
			orientation = anchor.getOrientation();			
		};
		
		/**
		 * notification the endpoint associated with this anchor is no longer hovering 
		 * over another anchor; we should resume calculating orientation as we normally do.
		 */
		this.out = function() {
			orientation = null;
		};
	};
	
	// ************** connection
	// ****************************************
	/**
	* allowed params:
	* source:	source element (string or a jQuery element) (required)
	* target:	target element (string or a jQuery element) (required)
	* 
	* anchors: optional array of anchor placements. defaults to BottomCenter for source
	*          and TopCenter for target.
	*/
	var Connection = function(params) {

	// ************** get the source and target and register the connection. *******************
	    var self = this;
	    // get source and target as jQuery objects
	    this.source = (typeof params.source == 'string') ? $("#" + params.source) : params.source;    
	    this.target = (typeof params.target == 'string') ? $("#" + params.target) : params.target;
	    this.sourceId = $(this.source).attr("id");
	    this.targetId = $(this.target).attr("id");
	    this.endpointsOnTop = params.endpointsOnTop != null ? params.endpointsOnTop : true;
	    // make connector
	    this.connector = params.connector || jsPlumb.DEFAULT_CONNECTOR || new jsPlumb.Connectors.Bezier();
	    this.paintStyle = params.paintStyle || jsPlumb.DEFAULT_PAINT_STYLE;
	    
	    // init endpoints
	    this.endpoints = [];
	    this.endpointStyles = [];
	    if (params.sourceEndpoint) this.endpoints[0] = params.sourceEndpoint;
	    else {
	    	if(!params.endpoints) params.endpoints = [null,null];
		    var endpoint0 = params.endpoints[0] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[0] || jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();
		    if (!params.endpointStyles) params.endpointStyles = [null,null];
		    var endpointStyle0 = params.endpointStyles[0] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[0] || jsPlumb.DEFAULT_ENDPOINT_STYLE;
		    var anchor0 = params.anchors  ? params.anchors[0] : jsPlumb.DEFAULT_ANCHORS[0] || jsPlumb.Anchors.BottomCenter;
		    this.endpoints[0] = new Endpoint({style:endpointStyle0, endpoint:endpoint0, connections:[self], anchor:anchor0 });	    	
	    }
	    if (params.targetEndpoint) this.endpoints[1] = params.targetEndpoint ;
	    else {
	    	if(!params.endpoints) params.endpoints = [null,null];
	    	if (!params.endpointStyles) params.endpointStyles = [null,null];
		    var endpoint1 = params.endpoints[1] || params.endpoint || jsPlumb.DEFAULT_ENDPOINTS[1] ||jsPlumb.DEFAULT_ENDPOINT || new jsPlumb.Endpoints.Dot();;
		    var endpointStyle1 = params.endpointStyles[1] || params.endpointStyle || jsPlumb.DEFAULT_ENDPOINT_STYLES[1] || jsPlumb.DEFAULT_ENDPOINT_STYLE;
		    var anchor1 = params.anchors  ? params.anchors[1] : jsPlumb.DEFAULT_ANCHORS[1] || jsPlumb.Anchors.TopCenter;
		    this.endpoints[1] =  new Endpoint({style:endpointStyle1, endpoint:endpoint1, connections:[self], anchor:anchor1 });
	    }
	    
	    _updateOffset(this.sourceId);
	    _updateOffset(this.targetId);

	// *************** create canvas on which the connection will be drawn ************
	    var canvas = _newCanvas(jsPlumb.connectorClass);
	    this.canvas = canvas;
	     
	    /**
	     * paints the connection.
	     * @param elId Id of the element that is in motion
	     * @param ui jQuery's event system ui object (present if we came from a drag to get here)
	     * @param recalc whether or not to recalculate element sizes. this is true if a repaint caused this to be painted.
	     */
	    this.paint = function(elId, ui, recalc) {    	
	    	var fai = self.floatingAnchorIndex;
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
	            var sAnchorP = this.endpoints[sIdx].anchor.compute([myOffset.left, myOffset.top], myWH, [otherOffset.left, otherOffset.top], otherWH);
	            var sAnchorO = this.endpoints[sIdx].anchor.getOrientation();
	            var tAnchorP = this.endpoints[tIdx].anchor.compute([otherOffset.left, otherOffset.top], otherWH, [myOffset.left, myOffset.top], myWH);
	            var tAnchorO = this.endpoints[tIdx].anchor.getOrientation();
	            var dim = this.connector.compute(sAnchorP, tAnchorP, this.endpoints[sIdx].anchor, this.endpoints[tIdx].anchor, this.paintStyle.lineWidth);
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

	    _initDraggableIfNecessary(self.source, self.sourceId, params.draggable, params.dragOptions);
	    _initDraggableIfNecessary(self.target, self.targetId, params.draggable, params.dragOptions);
	    	    
	    // resizing (using the jquery.ba-resize plugin). todo: decide whether to include or not.
	    if (this.source.resize) {
	    	this.source.resize(function(e) {
	    		jsPlumb.repaint(self.sourceId);
	    	});
	    }
	};
	
	/**
	 * models an endpoint.  can have one to N connections emanating from it (although how to handle that in the UI is
	 * a very good question). also has a Canvas and paint style.
	 * 
	 * params:
	 * 
	 * anchor			:	anchor for the endpoint, of type jsPlumb.Anchor. may be null. 
	 * endpoint 		: 	endpoint object, of type jsPlumb.Endpoint. may be null.
	 * style			:	endpoint style, a js object. may be null.
	 * source			:	element the endpoint is attached to, of type jquery object.  Required.
	 * canvas			:	canvas element to use. may be, and most often is, null.
	 * connections  	:	optional list of connections to configure the endpoint with.
	 * isSource			:	boolean. indicates the endpoint can act as a source of new connections. optional.
	 * dragOptions		:	if isSource is set to true, you can supply arguments for the jquery draggable method.  optional.
	 * connectionStyle	:	if isSource is set to true, this is the paint style for connections from this endpoint. optional.
	 * connector		:	optional connector type to use.
	 * isTarget			:	boolean. indicates the endpoint can act as a target of new connections. optional.
	 * dropOptions		:	if isTarget is set to true, you can supply arguments for the jquery droppable method.  optional.
	 * reattach			:	optional boolean that determines whether or not the connections reattach after they
	 *                      have been dragged off an endpoint and left floating.  defaults to false - connections
	 *                      dropped in this way will just be deleted.
	 */
	var Endpoint = function(params) {
		params = params || {};
		// make a copy. then we can use the wrapper function.
		params = $.extend({}, params);
		var self = this;
		self.anchor = params.anchor || jsPlumb.Anchors.TopCenter;
		var _endpoint = params.endpoint || new jsPlumb.Endpoints.Dot();
		var _style = params.style || jsPlumb.DEFAULT_ENDPOINT_STYLE;
		var _element = params.source;
		var _elementId = $(_element).attr("id");
		var _maxConnections = params.maxConnections || 1;
		this.canvas = params.canvas || _newCanvas(jsPlumb.endpointClass);
		this.connections = params.connections || [];
		var _reattach = params.reattach || false;
		this.addConnection = function(connection) {
			self.connections.push(connection);
		};
		this.removeConnection = function(connection) {
			var idx = self.connections.indexOf(connection);
			if (idx >= 0)
				self.connections.splice(idx, 1);
		};
		/**
		 * first pass at default ConnectorSelector: returns the first connection, if we have any.
		 */
		var connectorSelector = function() {
			return self.connections.length > 0 ? self.connections[0] : null;
		};

		// get the jsplumb context...lookups are faster with a context.
		var contextNode = _getContextNode();
		var isFull = function() { return self.connections.length >= _maxConnections; };
		
		/**
		 * paints the Endpoint, recalculating offset and anchor positions if necessary.
		 */
		this.paint = function(anchorPoint, connectorPaintStyle, canvas) {
			if (anchorPoint == null) {				
				var xy = offsets[_elementId];
				var wh = sizes[_elementId];
				if (xy == null || wh == null) {
					_updateOffset(_elementId);
					var xy = offsets[_elementId];
					var wh = sizes[_elementId];
				}
				anchorPoint = self.anchor.compute([xy.left, xy.top], wh);
			}
			_endpoint.paint(anchorPoint, self.anchor.getOrientation(), canvas || self.canvas, _style, connectorPaintStyle || _style);
		};
		
		
		// is this a connection source? we make it draggable and have the drag listener 
		// maintain a connection with a floating endpoint.
		if (params.isSource) {
			
			var n = null, id = null, 
			floatingEndpoint = null, jpc = null, 
			existingJpc = false, existingJpcParams = null;
			
			// first the question is, how many connections are on this endpoint?  if it's only one, then excellent.  otherwise we will either need a way
			// to select one connection from the list, or drag them all. if we had a pluggable 'ConnectorSelector' interface we could probably
			// provide a way for people to implement their own UI components to do the connector selection.  the question in that particular case would be how much
			// information the interface needs from jsPlumb at execution time. if, however, we leave out the connector selection, and drag them all,
			// that wouldn't be too hard to organise. perhaps that behaviour would be on a switch for the endpoint, or perhaps the ConnectorSelector
			// interface returns a List, with the default implementation just returning everything.  i think i like that.
			//
			// let's say for now that there is just one endpoint, cos we need to get this going before we can consider a list of them anyway.
			// the major difference between that case and the case of a new endpoint is actually quite small - it's a question of where the
			// Connection comes from.  for a new one, we create a new one. obviously.  otherwise we just get the jpc from the Endpoint
			// (remember we're only assuming one connection right now).  so all of the UI stuff we do to create the floating endpoint etc
			// will still be valid, but when we stop dragging, we'll have to do something different.  if we stop with a valid drop i think it will
			// be the same process.  but if we stop with an invalid drop we have to reset the Connection to how it was when we got it.
			var start = function(e, ui) {
				//if (!isFull()) {
				n = document.createElement("div");
				contextNode.append(n);
				// create and assign an id, and initialize the offset.
				id = new String(new Date().getTime());				
				$(n, contextNode).attr("id", id);
				_updateOffset(id);
				// store the id of the dragging div and the source element. the drop function
				// will pick these up.
				$(self.canvas, contextNode).attr("dragId", id);
				$(self.canvas, contextNode).attr("elId", _elementId);
				// create a floating anchor
				var floatingAnchor = new FloatingAnchor({reference:self.anchor});
				floatingEndpoint = new Endpoint({
					style:_style, 
					endpoint:_endpoint, 
					anchor:floatingAnchor, 
					source:n 
				});
				
				jpc = connectorSelector();
				if (jpc == null) {
					// create a connection. one end is this endpoint, the other is a floating endpoint.
					jpc = new Connection({
						sourceEndpoint:self, 
						targetEndpoint:floatingEndpoint,
						source:$(_element),
						target:$(n, contextNode),
						anchors:[self.anchor, floatingAnchor],
						paintStyle : params.connectionStyle, // this can be null. Connection will use the default.
						connector: params.connector
					});
					// todo ...unregister on stop
					self.addConnection(jpc);
				} else {
					existingJpc = true;
					var anchorIdx = jpc.sourceId == _elementId ? 0 : 1;
					jpc.floatingAnchorIndex = anchorIdx;
					// probably we should remove the connection? and add it back if the user
					// does not drop it somewhere proper.
					self.removeConnection(jpc);
					if (anchorIdx == 0){
						existingJpcParams = [jpc.source, jpc.sourceId];
						jpc.source = $(n, contextNode);
						jpc.sourceId = id;						
					}else {
						existingJpcParams = [jpc.target, jpc.targetId];
						jpc.target = $(n, contextNode);
						jpc.targetId = id;
					}					
					
					jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];
					jpc.endpoints[anchorIdx] = floatingEndpoint;
				}
				
				// register it.
				floatingConnections[id] = jpc;
				
				// todo unregister on stop
				floatingEndpoint.addConnection(jpc);
								
				// only register for the target endpoint; we will not be dragging the source at any time
				// before this connection is either discarded or made into a permanent connection.
				_addToList(endpointsByElement, id, floatingEndpoint);
				
				}
			//};
			
			var dragOptions = params.dragOptions || { };
			dragOptions = $.extend({ opacity:0.5, revert:true, helper:'clone' }, dragOptions);
			
			dragOptions.start = _wrap(dragOptions.start, start);
			dragOptions.drag = _wrap(dragOptions.drag, function(e, ui) { 
				_draw($(n, contextNode), ui); 
			});
			dragOptions.stop = _wrap(dragOptions.stop, 
				function(e, ui) {					
					_removeFromList(endpointsByElement, id, floatingEndpoint);
					_removeElements([floatingEndpoint.canvas, n]);
					var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
					if (jpc.endpoints[idx] == floatingEndpoint) {						
						
						// if the connection was an existing one:
						if (existingJpc) {
							if (_reattach) {
								jpc.floatingAnchorIndex = null;
								if (idx == 0) {
									jpc.source = existingJpcParams[0];
									jpc.sourceId = existingJpcParams[1];																	
								} else {
									jpc.target = existingJpcParams[0];
									jpc.targetId = existingJpcParams[1];
								}
								jpc.endpoints[idx] = jpc.suspendedEndpoint;
								jpc.suspendedEndpoint.addConnection(jpc);
								jsPlumb.repaint(existingJpcParams[1]);
							}
							else {
								jpc.suspendedEndpoint.removeConnection(jpc);
								_removeElement(jpc.canvas);
								self.removeConnection(jpc);
							}
						} else {							
							_removeElement(jpc.canvas);
							self.removeConnection(jpc);
						}
					}
					jpc = null;
					delete floatingEndpoint;
				}			
			);		
											
			$(self.canvas, contextNode).draggable(dragOptions);
		}
		
		// connector target
		if (params.isTarget) {
			var dropOptions = params.dropOptions || jsPlumb.DEFAULT_DROP_OPTIONS;
			dropOptions = $.extend({}, dropOptions);
	    	var originalAnchor = null;
	    	dropOptions.drop = _wrap(dropOptions.drop, function(e, ui) {
	    		var id = $(ui.draggable, contextNode).attr("dragId");
	    		var elId = $(ui.draggable, contextNode).attr("elId");
	    		var jpc = floatingConnections[id];
	    		var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
	    		if (idx == 0) {
	    			jpc.source = _element;
		    		jpc.sourceId = _elementId;		    		
	    		} else {
		    		jpc.target = _element;
		    		jpc.targetId = _elementId;		    		
	    		}
	    		// remove this jpc from the current endpoint
	    		jpc.endpoints[idx].removeConnection(jpc);
	    		if (jpc.suspendedEndpoint)
	    			jpc.suspendedEndpoint.removeConnection(jpc);
	    		jpc.endpoints[idx] = self;
	    		self.addConnection(jpc);
	    		jsPlumb.repaint($(ui.draggable, contextNode).attr("elId"));
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
				var id = $(ui.draggable, contextNode).attr("dragId");
		    	var jpc = floatingConnections[id];
		    	var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;  
		    	jpc.endpoints[idx].anchor.over(self.anchor);		    	
			 });
			 
			 dropOptions.out = _wrap(dropOptions.out, function(event, ui) {  
				var id = $(ui.draggable, contextNode).attr("dragId");
		    	var jpc = floatingConnections[id];
		    	var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
		    	jpc.endpoints[idx].anchor.out();
			 });
			 		
			$(self.canvas, contextNode).droppable(dropOptions);			
		}
		
		// woo...add a plumb command to Endpoint.
		this.plumb = function(params) {
			// not much to think about. the target should be an Endpoint, but what else?
			// all the style stuff is on the endpoint itself already.
			//todo this should call the main plumb method, just with some different args.
			
		};
		
		return self;
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
	
	    Anchors : {},
	    Connectors : {},
	    Endpoints : {},
	        
	    
	    /**
	     * adds an endpoint to the element
	     */
	    addEndpoint : function(target, params) {
	    	params = $.extend({}, params);
	    	var el = typeof target == 'string' ? $("#" + target) : target;
	    	var id = $(el).attr("id");
	    	params.source = el; 
	    	_updateOffset(id);
	    	var e = new Endpoint(params);
	    	_addToList(endpointsByElement, id, e);
	    	e.paint();
	    	return e;
	    },
	    
	    /**
	     * adds a list of endpoints to the element
	     */
	    addEndpoints : function(target, endpoints) {
	    	var results = [];
	    	for (var i = 0; i < endpoints.length; i++) {
	    		results.push(jsPlumb.addEndpoint(target, endpoints[i]));
	    	}
	    	return results;
	    },
	    
	    /**
	     * establishes a connection between two elements.
	     * @param params object containing setup for the connection.  see documentation.
	     */
	    connect : function(params) {
	    	var jpc = new Connection(params);    	
	    	
			// register endpoints for the element
			_addToList(endpointsByElement, jpc.sourceId, jpc.endpoints[0]);
			_addToList(endpointsByElement, jpc.targetId, jpc.endpoints[1]);
			
			// force a paint
			_draw(jpc.source);
	    },           
	    
	    connectEndpoints : function(params) {
	    	var jpc = Connection(params);
	    	
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
			document.body.removeChild(_jsPlumbContextNode);
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
	  var addedEndpoints = [];
	  this.each(function() 
	  {
		  //var params = $.extend({source:$(this)}, options);			  
		  addedEndpoints.push(jsPlumb.addEndpoint($(this).attr("id"), options));
	  });
	  return addedEndpoints;
  };
  
  /**
   * adds a list of endpoints to the elements resulting from the selector.  options may be null,
   * in which case jsPlumb will use the default options. see documentation. 
   */
  $.fn.addEndpoints = function(endpoints) {
	  var addedEndpoints = [];
	  return this.each(function() 
	  {		 
		 var e = jsPlumb.addEndpoints($(this).attr("id"), endpoints);
		 for (var i = 0; i < e.length; i++) addedEndpoints.push(e[i]);
	  });	  
	  return addedEndpoints;
  };
  
})(jQuery);

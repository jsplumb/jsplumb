/*
 * jsPlumb-all-1.1.0
 * 
 * This script contains the main jsPlumb script and the default anchors, connectors and endpoints.
 &
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
	
	var log = null;
	
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
     * Handles the dragging of an element.  
     * @param element jQuery element
     * @param ui UI object from jQuery's event system
     */
    var _draw = function(element, ui) {
    	var id = $(element).attr("id");    	
    	var endpoints = endpointsByElement[id];
    	if (endpoints) {
    		//if (ui == null) _updateOffset(id, ui);
    		_updateOffset(id, ui);
    		var myOffset = offsets[id];
			var myWH = sizes[id];
	    	// loop through endpoints for this element
	    	for (var i = 0; i < endpoints.length; i++) {
	    		var e = endpoints[i];
	    		// first, paint the endpoint
	    		
	    		var anchorLoc = endpoints[i].anchor.compute([myOffset.left, myOffset.top], myWH);
	           // var anchorOrientation = endpoints[i].anchor.getOrientation();
	    		
	    		//todo...connector paint style?  we have lost that with the move to endpoint-centric.
	    		// perhaps we only paint the endpoint here if it has no connections; it can use its own style.
	    		//if (!e.connections || e.connections.length == 0)
	    			e.paint(anchorLoc);
	            
	    	//	else {
	    		//if (e.connections && e.connections.length > 0) {
		    		// get all connections for the endpoint...
		    		var l = e.connections;
		    		for (var j = 0; j < l.length; j++)
		    			l[j].paint(id, ui);  // ...and paint them.
	    		//}
	    	}
    	}
    };
    
    /**
	 * helper function: the second argument is a function taking two args - the first is a
	 * jquery element, and the second is the element's id.
	 * 
	 * the first argument may be one of three things:
	 * 
	 *  1. a string, in the form "window1", for example.  an element's id. if your id starts with a
	 *     hash then jsPlumb does not append its own hash too... 
	 *  2. a jquery element, already resolved using $(...).
	 *  3. a list of strings/jquery elements.
	 */
	var _elementProxy = function(element, fn) {
		var retVal = null;
		if (typeof element == 'object' && element.length) {
			retVal = [];
    		for (var i = 0; i < element.length; i++) {
    			var el = typeof element[i] == 'string' ? $("#" + element[i]) : element[i];
    	    	var id = el.attr("id");
    			retVal.push(fn(el, id));  // append return values to what we will return
    		}
    	}
    	else {
	    	var el = typeof element == 'string' ? 
	    				element.indexOf("#") == 0 ? $(element) : $("#" + element) 
	    						: element;
	    	var id = el.attr("id");
	    	retVal = fn(el, id);
    	}
		
		return retVal;
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
    		_jsPlumbContextNode.className = "_jsPlumb_context";
    	}
    	return $(_jsPlumbContextNode);
    };
    
    /**
	 * gets an id for the given element, creating and setting one if necessary.
	 */
	var _getId = function(element) {
		var id = $(element).attr("id");
		if (!id) {
			id = "_jsPlumb_" + new String((new Date()).getTime());
			$(element).attr("id", id);
		}
		return id;
	};
    
    /**
     * inits a draggable if it's not already initialised.
     * todo: if the element was draggable already, like from some non-jsPlumb call, wrap the drag function. 
     */
    var _initDraggableIfNecessary = function(element, elementId, isDraggable, dragOptions) {
    	// dragging
	    var draggable = isDraggable == null ? _draggableByDefault : isDraggable;
	    if (draggable && element.draggable) {    	
	    	var options = dragOptions || jsPlumb.Defaults.DragOptions; 
	    	var dragCascade = options.drag || function(e,u) {};
	    	var initDrag = function(element, elementId, dragFunc) {
	    		var opts = $.extend({drag:dragFunc}, options);
	    		var draggable = draggableStates[elementId];
	    		opts.disabled = draggable == null ? false : !draggable;
	        	element.draggable(opts);
	    	};
	    	initDrag(element, elementId, function(event, ui) {
	    		 _draw(element, ui);
	    		 $(element).addClass("jsPlumb_dragged");
		    	dragCascade(event, ui);
	    	});
	    }
    	
    };
    
    var _log = function(msg) {
    // not implemented. yet.	
    }
    
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
     * helper to remove an element from the DOM.
     */
    var _removeElement = function(element) {
    	if (element != null) { 
    		try { _jsPlumbContextNode.removeChild(element); }
    		catch (e) { }
    	}    	
    };
    /**
     * helper to remove a list of elements from the DOM.
     */
    var _removeElements = function(elements) {
    	for (var i in elements)
    		_removeElement(elements[i]);
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
				return true;
			}
		}		
		return false;
	};
	/**
     * Sets whether or not the given element(s) should be draggable, regardless of what a particular
     * plumb command may request.
     * 
     * @param element May be a string, a jQuery elements, or a list of strings/jquery elements.
     * @param draggable Whether or not the given element(s) should be draggable.
     */
	var _setDraggable = function(element, draggable) {    
    	var _helper = function(el, id) {
    		draggableStates[id] = draggable;
        	if (el.draggable) {
        		el.draggable("option", "disabled", !draggable);
        	}
    	};       
    	
    	return _elementProxy(element, _helper);
    };
	/**
	 * private method to do the business of hiding/showing.
	 * @param elId Id of the element in question
	 * @param state String specifying a value for the css 'display' property ('block' or 'none').
	 */
	var _setVisible = function(elId, state) {
    	var f = function(jpc) {
    		//todo should we find all the endpoints instead of going by connection? this will 
    		jpc.canvas.style.display = state;
			/*jpc.sourceEndpointCanvas.style.display = state;
			jpc.targetEndpointCanvas.style.display = state;*/
    	};
    	
    	_operation(elId, f);
    };        
    /**
     * toggles the draggable state of the element with the given id.
     */
    var _toggleDraggable = function(el) {    	
    	var fn = function(el, elId) {
    		var state = draggableStates[elId] == null ? _draggableByDefault : draggableStates[elId];
	    	state = !state;
	    	draggableStates[elId] = state;
	    	el.draggable("option", "disabled", !state);
	    	return state;
    	};
    	return _elementProxy(el, fn);
    };
    /**
	 * private method to do the business of toggling hiding/showing.
	 * @param elId Id of the element in question
	 */
	var _toggleVisible = function(elId) {
    	var f = function(jpc) {;
    		var state = ('none' == jpc.canvas.style.display);
    		jpc.canvas.style.display = state ? "block" : "none";
			/*jpc.sourceEndpointCanvas.style.display = state;
			jpc.targetEndpointCanvas.style.display = state;*/
    	};
    	
    	_operation(elId, f);
    };
    /**
     * updates the offset and size for a given element, and stores the values.
     * if 'ui' is not null we use that (it would have been passed in from a drag call) because it's faster; but if it is null,
     * or if 'recalc' is true in order to force a recalculation, we use the offset, outerWidth and outerHeight methods to get
     * the current values.
     */
    var _updateOffset = function(elId, ui, recalc) {
    	
    	if (log) log.debug("updating offset for element [" + elId + "]; ui is [" + ui + "]; recalc is [" + recalc + "]");
    	
		if (recalc || ui == null) {  // if forced repaint or no ui helper available, we recalculate.
    		// get the current size and offset, and store them
    		var s = $("#" + elId);
    		sizes[elId] = [s.outerWidth(), s.outerHeight()];
    		offsets[elId] = s.offset();
		} else {
			// faster to use the ui element if it was passed in.
			// fix for change in 1.8 (absolutePosition renamed to offset). plugin is compatible with
			// 1.8 and 1.7.
			
			// todo: when the drag axis is supplied, the ui object passed in has incorrect values
			// for the other axis - like say you set axis='x'. when you move the mouse up and down
			// while dragging, the y values are for where the window would be if it was not
			// just constrained to x.  not sure if this is a jquery bug or whether there's a known
			// trick or whatever.
			var pos = ui.absolutePosition || ui.offset;
    		var anOffset = ui != null ? pos : $("#" + elId).offset();
    		offsets[elId] = anOffset;
		}
	};
    /**
     * wraps one function with another, creating a placeholder for the wrapped function
     * if it was null.  this is used to wrap the various drag/drop event functions - to allow
     * jsPlumb to be notified of important lifecycle events without imposing itself on the user's
     * drap/drop functionality.
     * TODO: determine whether or not we should try/catch the plumb function, so that the cascade function is always executed.
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
			xDir = 0;//xy[0] < txy[0] ? -1 : xy[0] == txy[0] ? 0 : 1;
			yDir = 0;//xy[1] < txy[1] ? -1 : xy[1] == txy[1] ? 0 : 1;
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
	    
	    // init endpoints
	    this.endpoints = [];
	    this.endpointStyles = [];
	    var prepareEndpoint = function(existing, index, params) {
	    	if (existing) self.endpoints[index] = existing;
		    else {
		    	if(!params.endpoints) params.endpoints = [null,null];
			    var ep = params.endpoints[index] || params.endpoint || jsPlumb.Defaults.Endpoints[index] || jsPlumb.Defaults.Endpoint|| new jsPlumb.Endpoints.Dot();
			    if (!params.endpointStyles) params.endpointStyles = [null,null];
			    var es = params.endpointStyles[index] || params.endpointStyle || jsPlumb.Defaults.EndpointStyles[index] || jsPlumb.Defaults.EndpointStyle;
			    var a = params.anchors  ? params.anchors[index] : jsPlumb.Defaults.Anchors[index] || jsPlumb.Anchors.BottomCenter;
			    self.endpoints[index] = new Endpoint({style:es, endpoint:ep, connections:[self], anchor:a });	    	
		    }
	    };
	    
	    prepareEndpoint(params.sourceEndpoint, 0, params);
	    prepareEndpoint(params.targetEndpoint, 1, params);
	    
	    // make connector.  if an endpoint has a connector + paintstyle to use, we use that.
	    // otherwise we use sensible defaults.
	    //this.connector = params.connector || jsPlumb.Defaults.Connector || new jsPlumb.Connectors.Bezier();
	    this.connector = this.endpoints[0].connector || this.endpoints[1].connector || params.connector || jsPlumb.Defaults.Connector || new jsPlumb.Connectors.Bezier();
	    //this.paintStyle = params.paintStyle || jsPlumb.Defaults.PaintStyle;
	    this.paintStyle = this.endpoints[0].connectionStyle  || this.endpoints[1].connectionStyle || params.paintStyle || jsPlumb.Defaults.PaintStyle;
	    	    	    	   
	    _updateOffset(this.sourceId);
	    _updateOffset(this.targetId);
	    
	    // paint the endpoints
	    var myOffset = offsets[this.sourceId], myWH = sizes[this.sourceId];		
    	var anchorLoc = this.endpoints[0].anchor.compute([myOffset.left, myOffset.top], myWH);
    	this.endpoints[0].paint(anchorLoc);    	
    	myOffset = offsets[this.targetId]; myWH = sizes[this.targetId];		
    	anchorLoc = this.endpoints[1].anchor.compute([myOffset.left, myOffset.top], myWH);
    	this.endpoints[1].paint(anchorLoc);

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
	    	
	    	if (log) log.debug("Painting Connection; element in motion is " + elId + "; ui is [" + ui + "]; recalc is [" + recalc + "]");
	    	
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
	                            
	        //	this.endpoints[swap ? 1 : 0].paint(sAnchorP, this.paintStyle);
	        	//this.endpoints[swap ? 0 : 1].paint(tAnchorP, this.paintStyle);
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
		var _style = params.style || jsPlumb.Defaults.EndpointStyle;
		this.connectionStyle = params.connectionStyle;
		this.connector = params.connector;
		var _element = params.source;
		var _elementId = $(_element).attr("id");
		var _maxConnections = params.maxConnections || 1;                     // maximum number of connections this endpoint can be the source of.
		this.canvas = params.canvas || _newCanvas(jsPlumb.endpointClass);
		this.connections = params.connections || [];
		var _reattach = params.reattach || false;
		var floatingEndpoint = null;
		this.addConnection = function(connection) {
			self.connections.push(connection);
		};
		this.removeConnection = function(connection) {
			var idx = self.connections.indexOf(connection);
			if (idx >= 0)
				self.connections.splice(idx, 1);
		};
		this.isFloating = function() { return floatingEndpoint != null; };
		/**
		 * first pass at default ConnectorSelector: returns the first connection, if we have any.
		 * modified a little, 5/10/2010: now it only returns a connector if we have not got equal to or more than _maxConnector connectors
		 * attached.  otherwise it is assumed a new connector is ok.  but note with this setup we can't select any other connection than the first
		 * one.  what if this could return a list?  that implies everything should work with a list - dragging etc. could be nasty. could also
		 * be cool.
		 */
		var connectorSelector = function() {
			return self.connections.length == 0 || self.connections.length < _maxConnections ?  null : self.connections[0]; 
		};

		// get the jsplumb context...lookups are faster with a context.
		var contextNode = _getContextNode();
		
		this.isFull = function() { return _maxConnections < 1 ? false : (self.connections.length >= _maxConnections); }; 
		
		/**
		 * paints the Endpoint, recalculating offset and anchor positions if necessary.
		 */
		this.paint = function(anchorPoint, connectorPaintStyle, canvas) {
			
			if (log) log.debug("Painting Endpoint with elementId [" + _elementId + "]; anchorPoint is [" + anchorPoint + "]");
			
			if (anchorPoint == null) {
				// do we always want to force a repaint here?  i dont think so!
				var xy = offsets[_elementId];
				var wh = sizes[_elementId];
				if (xy == null || wh == null) {
					_updateOffset(_elementId);
					xy = offsets[_elementId];
					wh = sizes[_elementId];
				}
				anchorPoint = self.anchor.compute([xy.left, xy.top], wh);
			}
			_endpoint.paint(anchorPoint, self.anchor.getOrientation(), canvas || self.canvas, _style, connectorPaintStyle || _style);
		};
		
		
		// is this a connection source? we make it draggable and have the drag listener 
		// maintain a connection with a floating endpoint.
		if (params.isSource && _element.draggable) {
			
			var n = null, id = null, 
			 jpc = null, 
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
				//floatingEndpoint.originalAnchor = 
				
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
						if (existingJpc && jpc.suspendedEndpoint) {
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
								jpc.endpoints[0].removeConnection(jpc);
								jpc.endpoints[1].removeConnection(jpc);
								_removeElement(jpc.canvas);
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
		if (params.isTarget && _element.droppable) {
			var dropOptions = params.dropOptions || jsPlumb.Defaults.DropOptions;
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
	    		_initDraggableIfNecessary(_element, _elementId, params.draggable, {});
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

    	Defaults : {
    		Anchors : [ null, null ],
    		Connector : null,
    		DragOptions: { },
    		DropOptions: { },
    		Endpoint : null,
    		Endpoints : [ null, null ],
    		EndpointStyle : { fillStyle : null },
    		EndpointStyles : [ null, null ],
    		MaxConnections : null,
    		PaintStyle : { lineWidth : 10, strokeStyle : 'red' }    		    		
    	},
    		
		connectorClass : '_jsPlumb_connector',
		endpointClass : '_jsPlumb_endpoint',
		
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

    		var myOffset = offsets[id];
			var myWH = sizes[id];
			
	    	var anchorLoc = e.anchor.compute([myOffset.left, myOffset.top], myWH);
	    	e.paint(anchorLoc);
	    	return e;
	    },
	    
	    /**
	     * wrapper around standard jquery animate function; injects a call to jsPlumb in the
	     * 'step' function (creating it if necessary).  this only supports the two-arg version
	     * of the animate call in jquery - the one that takes an object as the second arg.
	     */
	    animate : function(el, properties, options) {
	    	var ele = typeof(el)=='string' ? $("#" + el) : el;
	    	var id = ele.attr("id");
	    	options = options || {};
	    	options.step = _wrap(options.step, function() { jsPlumb.repaint(id); });
	    	ele.animate(properties, options);    	
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
	    	if (params.sourceEndpoint && params.sourceEndpoint.isFull()) {
	    		_log("could not add connection; source endpoint is full");
	    		return;
	    	}
	    	
	    	if (params.targetEndpoint && params.targetEndpoint.isFull()) {
	    		_log("could not add connection; target endpoint is full");
	    		return;
	    	}
	    		
	    	var jpc = new Connection(params);    	
	    	
			// register endpoints for the element
			_addToList(endpointsByElement, jpc.sourceId, jpc.endpoints[0]);
			_addToList(endpointsByElement, jpc.targetId, jpc.endpoints[1]);
			
			jpc.endpoints[0].addConnection(jpc);
			jpc.endpoints[1].addConnection(jpc);
			
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
					/*_removeElement(jpc.targetEndpointCanvas);
					_removeElement(jpc.sourceEndpointCanvas);*/
					jpc.endpoints[0].removeConnection(jpc);
					jpc.endpoints[1].removeConnection(jpc);
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
				/*_removeElement(jpc.targetEndpointCanvas);
				_removeElement(jpc.sourceEndpointCanvas);*/
				jpc.endpoints[0].removeConnection(jpc);
				jpc.endpoints[1].removeConnection(jpc);
	    	};
	    	_operation(elId, f);
	    	//delete endpointsByElement[elId];    	
	    },
	    
	    /**
	     * remove all connections.  and endpoints? probably not.
	     */
	    detachEverything : function() {
	    	var f = function(jpc) {
	    		_removeElement(jpc.canvas);
				/*_removeElement(jpc.targetEndpointCanvas);
				_removeElement(jpc.sourceEndpointCanvas);*/
				jpc.endpoints[0].removeConnection(jpc);
				jpc.endpoints[1].removeConnection(jpc);
	    	};
	    	
	    	_operationOnAll(f);
	    	
	    	/*delete endpointsByElement;
	    	endpointsByElement = {};*/
	    },    
	    
	    /**
	     * Set an element's connections to be hidden.
	     */
	    hide : function(elId) {
	    	_setVisible(elId, "none");
	    },
	    
	    /**
	     * Creates an anchor with the given params.
	     * x - the x location of the anchor as a fraction of the total width.  
		 * y - the y location of the anchor as a fraction of the total height.
		 * orientation - an [x,y] array indicating the general direction a connection from the anchor should go in.
		 * offsets - an [x,y] array of fixed offsets that should be applied after the x,y position has been figured out.  optional. defaults to [0,0]. 
	     */
	    makeAnchor : function(x, y, xOrientation, yOrientation, xOffset, yOffset) {
	    	// backwards compatibility here.  we used to require an object passed in but that makes the call very verbose.  easier to use
	    	// by just passing in four/six values.  but for backwards compatibility if we are given only one value we assume it's a call in the old form.
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
	    	
	    	var _processElement = function(el) {
	    		var ele = typeof(el)=='string' ? $("#" + el) : el;
		    	_draw(ele);
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
	    	for (var elId in endpointsByElement) {
	    		_draw($("#" + elId));
	    	}
	    },
	    
	    removeEndpoint : function(elId, endpoint) {
	    	var ebe = endpointsByElement[elId];
	    	if (ebe) {
	    //		var i = ebe.indexOf(endpoint);
	    	//	alert('element has ' + ebe.length);
	    		//if (i > -1) {
	    			//ebe.splice(i, 1);
	    			if(_removeFromList(endpointsByElement, elId, endpoint))
	    				_removeElement(endpoint.canvas);
	    		//}
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
	    setDraggable: _setDraggable, 
	    
	    /**
	     * Sets whether or not elements are draggable by default.  Default for this is true.
	     */
	    setDraggableByDefault: function(draggable) {
	    	_draggableByDefault = draggable;
	    },
	    
	    setDebugLog: function(debugLog) {
	    	log = debugLog;
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
	     * gets some test hooks.  nothing writable.
	     */
	    getTestHarness : function() {
	    	return {
	    		endpointCount : function(elId) {
	    			var e = endpointsByElement[elId];
	    			return e ? e.length : 0;
	    		}	    		
	    	};	    	
	    },
	    
	    /**
	     * Toggles visibility of an element's connections. kept for backwards compatibility
	     */
	    toggle : _toggleVisible,
	    
	    /**
	     * new name for the old toggle method.
	     */
	    toggleVisible : _toggleVisible,
	    
	    /**
	     * Toggles draggability (sic) of an element.
	     */
	    toggleDraggable : _toggleDraggable, 
	    
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
  
  /**
   * remove the endpoint, if it exists, deleting its UI elements etc. 
   */
  $.fn.removeEndpoint = function(endpoint) {
	  this.each(function() 
	  {			  
		  jsPlumb.removeEndpoint($(this).attr("id"), endpoint);
	  });
  };
  
})(jQuery);


/**
* jsPlumb-defaults-1.1.0
*
* This script contains the default Anchors, Endpoints and Connectors for jsPlumb.  It should be used with jsPlumb 1.1.0 and above; 
* prior to version 1.1.0 of jsPlumb the defaults were included inside the main script.
*
* NOTE: for production usage you should use jsPlumb-all-1.1.0-min.js, which contains the main jsPlumb script and this script together,
* in a minified file.
*/

(function() {

    /**
    * Places you can anchor a connection to.  These are helpers for common locations; they all just return an instance
    * of Anchor that has been configured appropriately.  
    * 
    * You can write your own one of these; you
    * just need to provide a 'compute' method and an 'orientation'.  so you'd say something like this:
    * 
    * jsPlumb.Anchors.MY_ANCHOR = {
    * 	compute : function(xy, wh, txy, twh) { return some mathematics on those variables; },
    *   getOrientation : function() { return [ox, oy]; }
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
	jsPlumb.Anchors.TopCenter 		= jsPlumb.makeAnchor(0.5, 0, 0,-1);
	jsPlumb.Anchors.BottomCenter 	= jsPlumb.makeAnchor(0.5, 1, 0, 1);
	jsPlumb.Anchors.LeftMiddle 		= jsPlumb.makeAnchor(0, 0.5, -1, 0);
	jsPlumb.Anchors.RightMiddle 	= jsPlumb.makeAnchor(1, 0.5, 1, 0);
	jsPlumb.Anchors.Center 			= jsPlumb.makeAnchor(0.5, 0.5, 0, 0);
	jsPlumb.Anchors.TopRight 		= jsPlumb.makeAnchor(1, 0, 0,-1);
	jsPlumb.Anchors.BottomRight 	= jsPlumb.makeAnchor(1, 1, 0, 1);
	jsPlumb.Anchors.TopLeft 		= jsPlumb.makeAnchor(0, 0, 0, -1);
	jsPlumb.Anchors.BottomLeft 		= jsPlumb.makeAnchor(0, 1, 0, 1);
	
	
        /**
         * The Straight connector draws a simple straight line between the two anchor points.
         */
    jsPlumb.Connectors.Straight = function() {
	
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
        		w = 2 * lineWidth; 
        		x = sourcePos[0]  + ((targetPos[0] - sourcePos[0]) / 2) - lineWidth;
        		xo = (w - Math.abs(sourcePos[0]-targetPos[0])) / 2;
        	}
            if (h < 2 * lineWidth) { 
        		// minimum size is 2 * line Width
        		h = 2 * lineWidth; 
        		y = sourcePos[1]  + ((targetPos[1] - sourcePos[1]) / 2) - lineWidth;
        		yo = (h - Math.abs(sourcePos[1]-targetPos[1])) / 2;
        	}
                            
            var sx = sourcePos[0] < targetPos[0] ? w-xo : xo;
            var sy = sourcePos[1] < targetPos[1] ? h-yo : yo;
            var tx = sourcePos[0] < targetPos[0] ? xo : w-xo;
            var ty = sourcePos[1] < targetPos[1] ? yo : h-yo;
            var retVal = [ x, y, w, h, sx, sy, tx, ty ];
                             
            return retVal;
        };

        this.paint = function(dimensions, ctx)
        {
            ctx.beginPath();
            ctx.moveTo(dimensions[4], dimensions[5]);
            ctx.lineTo(dimensions[6], dimensions[7]);
            ctx.stroke();
        };
    };
                
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
    jsPlumb.Connectors.Bezier = function(curviness) {
    	
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
        	
        	/*var img = new Image();
        	img.src = "../img/pattern.jpg";
        	ctx.fillStyle = ctx.createPattern(img, 'repeat-y');*/
        	
            ctx.beginPath();
            ctx.moveTo(d[4],d[5]);
            ctx.bezierCurveTo(d[8],d[9],d[10],d[11],d[6],d[7]);	            
            ctx.stroke();
            //ctx.fill();
        }
    };
    
    
    /**
     * Types of endpoint UIs.  we supply three - a circle of default radius 10px, a rectangle of
     * default size 20x20, and an image (with no default).  you can supply others of these if you want to - see the documentation
     * for a howto.
     */    	
    	
	/**
	 * a round endpoint, with default radius 10 pixels.
	 */
	jsPlumb.Endpoints.Dot = function(params) {
	
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
	};
	
	/**
	 * A Rectangular endpoint, with default size 20x20.
	 */
	jsPlumb.Endpoints.Rectangle = function(params) {
    	
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
	}; 
	
	/**
	 * Image endpoint - draws an image as the endpoint.  You must provide a 'url' property in the params object..
	 */
	jsPlumb.Endpoints.Image = function(params) {
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
	};    		
})();

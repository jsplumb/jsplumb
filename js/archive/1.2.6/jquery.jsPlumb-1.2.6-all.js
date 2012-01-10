/*
 * Class:jsPlumb
 * 
 * Provides a way to visually connect elements on an HTML page.
 * 
 * http://jsplumb.org
 * http://code.google.com/p/jsPlumb
 * 
 * Triple licensed under the MIT, GPL2 and Beer licenses.
 */

;(function() {

		var ie = !!!document.createElement('canvas').getContext;

		/**
		 * helper method to add an item to a list, creating the list if it does
		 * not yet exist.
		 */
		var _addToList = function(map, key, value) {
			var l = map[key];
			if (l == null) {
				l = [];
				map[key] = l;
			}
			l.push(value);
			return l;
		};

		var _connectionBeingDragged = null;

		var _getAttribute = function(el, attName) { return jsPlumb.CurrentLibrary.getAttribute(_getElementObject(el), attName); };
		var _setAttribute = function(el, attName, attValue) { jsPlumb.CurrentLibrary.setAttribute(_getElementObject(el), attName, attValue); };
		var _addClass = function(el, clazz) { jsPlumb.CurrentLibrary.addClass(_getElementObject(el), clazz); };
		var _hasClass = function(el, clazz) { return jsPlumb.CurrentLibrary.hasClass(_getElementObject(el), clazz); };
		var _removeClass = function(el, clazz) { jsPlumb.CurrentLibrary.removeClass(_getElementObject(el), clazz); };
		var _getElementObject = function(el) { return jsPlumb.CurrentLibrary.getElementObject(el); };
		var _getOffset = function(el) { return jsPlumb.CurrentLibrary.getOffset(_getElementObject(el)); };
		var _getSize = function(el) { return jsPlumb.CurrentLibrary.getSize(_getElementObject(el)); };
		
		/**
		 * 
		 */
		var _log = function(jsp, msg) {
			if (jsp.logEnabled && typeof console != "undefined")
				console.log(msg);
		};			
	
		var EventGenerator = function() {
			var _listeners = {};
			var self = this;
			this.overlayPlacements = [];
			this.paintStyle = null, this.hoverPaintStyle = null;
			
			/**
			 * returns whether or not the given event is over a painted area of the canvas. 
			 */
		    this._over = function(e) {		    			  		    	
		    	var o = _getOffset(_getElementObject(self.canvas));
		    	var pageXY = jsPlumb.CurrentLibrary.getPageXY(e);
		    	var x = pageXY[0] - o.left, y = pageXY[1] - o.top;
		    	if (x > 0 && y > 0 && x < self.canvas.width && y < self.canvas.height) {
			    	// first check overlays
			    	for ( var i = 0; i < self.overlayPlacements.length; i++) {
			    		var p = self.overlayPlacements[i];
			    		if (p && (p[0] <= x && p[1] >= x && p[2] <= y && p[3] >= y))
			    			return true;
			    	}
			    	
			    	if (!ie) {
				    	// then the canvas
				    	var d = self.canvas.getContext("2d").getImageData(parseInt(x), parseInt(y), 1, 1);
				    	return d.data[0] != 0 || d.data[1] != 0 || d.data[2] != 0 || d.data[3] != 0;
			    	}
			    	else {
			    		// need to get fancy with the vml.
			    	}
		    	}
		    	return false;
		    };
		    
			/*
			 * Binds a listener to an event.
			 * 
			 * 	event		-	name of the event to bind to.
			 * 	listener	-	function to execute.
			 */
			this.bind = function(event, listener) {
				_addToList(_listeners, event, listener);				
			};
			/*
			 * Fires an update for the given event.
			 * 
			 * 	event				-	event to fire
			 * 	value				-	value to pass to the event listener(s).
			 *  originalEvent		- 	the original event from the browser
			 */
			this.fireUpdate = function(event, value, originalEvent) {
				if (_listeners[event]) {
					for ( var i = 0; i < _listeners[event].length; i++) {
						try {
							_listeners[event][i](value, originalEvent);
						} catch (e) {
							_log(self, "jsPlumb: fireUpdate failed for event "
									+ event + " : " + e + "; not fatal.");
						}
					}
				}
			};
			/*
			 * Clears either all listeners, or listeners for some specific event.
			 * 
			 * event	-	optional. constrains the clear to just listeners for this event.
			 */
			this.clearListeners = function(event) {
				if (event) {
					delete _listeners[event];
				} else {
					delete _listeners;
					_listeners = {};
				}
			};
			
		    var _mouseover = false;
		    var _mouseDown = false, _mouseDownAt = null, _posWhenMouseDown = null, _mouseWasDown = false, srcWhenMouseDown = null,
		    targetWhenMouseDown = null;
		    this.mousemove = function(e) {		    	
		    	var jpcl = jsPlumb.CurrentLibrary;
		    	var pageXY = jpcl.getPageXY(e);
				var ee = document.elementFromPoint(pageXY[0], pageXY[1]);
				var _continue = _connectionBeingDragged == null && (_hasClass(ee, "_jsPlumb_endpoint") || _hasClass(ee, "_jsPlumb_connector"));
				
				if (_mouseDown && srcWhenMouseDown) {
					_mouseWasDown = true;
					_connectionBeingDragged = self;				
					var mouseNow = jpcl.getPageXY(e);
					var dx = mouseNow[0] - _mouseDownAt[0];
					var dy = mouseNow[1] - _mouseDownAt[1];
					var newPos = {left:srcWhenMouseDown.left + dx, top:srcWhenMouseDown.top + dy};
					jpcl.setOffset(jpcl.getElementObject(self.source), newPos);
					jsPlumb.repaint(self.source);
					newPos = {left:targetWhenMouseDown.left + dx, top:targetWhenMouseDown.top + dy};
					jpcl.setOffset(jpcl.getElementObject(self.target), newPos);
					jsPlumb.repaint(self.target);
				}				
				else if (!_mouseover && _continue && self._over(e)) {
					_mouseover = true;
					self.setHover(_mouseover);
					self.fireUpdate("mouseenter", self, e);				
				}
				else if (_mouseover && (!self._over(e) || !_continue)) {
					_mouseover = false;
				/*	if (self.hoverPaintStyle != null) {
						self.paintStyleInUse = self.paintStyle;
						self.repaint();
						_updateAttachedElements();
					}*/
					self.setHover(_mouseover);
					self.fireUpdate("mouseexit", self, e);				
				}
		    };
		    
		    /**
		     * sets/unsets the hover state of this element.
		     */
		    this.setHover = function(hover, ignoreAttachedElements) {
		    	if (self.hoverPaintStyle != null) {
					self.paintStyleInUse = hover ? self.hoverPaintStyle : self.paintStyle;
					self.repaint();
					// get the list of other affected elements. for a connection, its the endpoints.  for an endpoint, its the connections! surprise.
					if (!ignoreAttachedElements)
						_updateAttachedElements(hover);
				}
		    };
		    
		    var _updateAttachedElements = function(state) {
		    	var affectedElements = self.getAttachedElements();		// implemented in subclasses
		    	if (affectedElements) {
		    		for (var i = 0; i < affectedElements.length; i++) {
		    			affectedElements[i].setHover(state, true);			// tell the attached elements not to inform their own attached elements.
		    		}
		    	}
		    };
		    
		    this.click = function(e) {
		    	if (_mouseover && self._over(e) && !_mouseWasDown) 
		    		self.fireUpdate("click", self, e);		    	
		    	_mouseWasDown = false;
		    };
		    
		    this.dblclick = function(e) {
		    	if (_mouseover && self._over(e) && !_mouseWasDown) 
		    		self.fireUpdate("dblclick", self, e);		    	
		    	_mouseWasDown = false;
		    };
		    
		    this.mousedown = function(e) {
		    	if(self._over(e) && !_mouseDown) {
		    		_mouseDown = true;
		    		_mouseDownAt = jsPlumb.CurrentLibrary.getPageXY(e);
		    		if (self.canvas) _posWhenMouseDown = jsPlumb.CurrentLibrary.getOffset(jsPlumb.CurrentLibrary.getElementObject(self.canvas));
		    		if (self.source) srcWhenMouseDown = jsPlumb.CurrentLibrary.getOffset(jsPlumb.CurrentLibrary.getElementObject(self.source));
		    		if (self.target) targetWhenMouseDown = jsPlumb.CurrentLibrary.getOffset(jsPlumb.CurrentLibrary.getElementObject(self.target));		    		
		    	}
		    };
		    
		    this.mouseup = function() {
		    	if (self == _connectionBeingDragged) _connectionBeingDragged = null;
		    	_mouseDown = false;
		    };
			
		    /*
		     * Sets the paint style and then repaints the element.
		     * 
		     * style - Style to use.
		     */
		    this.setPaintStyle = function(style) {
		    	self.paintStyle = style;
		    	self.paintStyleInUse = self.paintStyle;
		    	self.repaint();
		    };
		    
		    /*
		     * Sets the paint style to use when the mouse is hovering over the element. This is null by default.
		     * 
		     * style - Style to use when the mouse is hovering.
		     */
		    this.setHoverPaintStyle = function(style) {
		    	self.hoverPaintStyle = style;
		    	self.repaint();
		    };
		};

	/**
	*	Class:jsPlumb
	*	The main jsPlumb class.  One of these is registered on the Window as 'jsPlumb'; you can also get one yourself by making a call to jsPlumb.getInstance.  This class is the class you use to establish Connections and add Endpoints.
	*/
	var jsPlumbInstance = function(_defaults) {
		
		/*
		 * Property: Defaults 
		 * 
		 * These are the default settings for jsPlumb.  They are what will be used if you do not supply specific pieces of information to the various API calls. A convenient way to implement your own look and feel can be to override these defaults by including a script somewhere after the jsPlumb include, but before you make any calls to jsPlumb, for instance in this example we set the PaintStyle to be a blue line of 27 pixels: > jsPlumb.Defaults.PaintStyle = { lineWidth:27, strokeStyle:'blue' }
		 */
		this.Defaults = {
			Anchor : null,
			Anchors : [ null, null ],
			BackgroundPaintStyle : null,
			Connector : null,
			Container : null,
			DragOptions : { },
			DropOptions : { },
			Endpoint : null,
			Endpoints : [ null, null ],
			EndpointStyle : { fillStyle : null },
			EndpointStyles : [ null, null ],
			EndpointHoverStyle : null,
			EndpointHoverStyles : [ null, null ],
			HoverPaintStyle : null,
			LabelStyle : { fillStyle : "rgba(0,0,0,0)", color : "black" },
			LogEnabled : true,
			MaxConnections : null,
			MouseEventsEnabled : false, 
			// TODO: should we have OverlayStyle too?
			PaintStyle : { lineWidth : 10, strokeStyle : 'red' },
			Scope : "_jsPlumb_DefaultScope"
		};
		if (_defaults) jsPlumb.extend(this.Defaults, _defaults);
		
		this.logEnabled = this.Defaults.LogEnabled;
		
		
		EventGenerator.apply(this);
		var _bb = this.bind;
		this.bind = function(event, fn) {
			if ("ready" === event && initialized) fn();
			else _bb(event, fn);
		};

		var _currentInstance = this;		
		var log = null;

		var repaintFunction = function() {
			jsPlumb.repaintEverything();
		};
		var automaticRepaint = true;
		function repaintEverything() {
			if (automaticRepaint)
				repaintFunction();
		};
		var resizeTimer = null;		

		var initialized = false;
		var connectionsByScope = {};
		/**
		 * map of element id -> endpoint lists. an element can have an arbitrary
		 * number of endpoints on it, and not all of them have to be connected
		 * to anything.
		 */
		var endpointsByElement = {};
		var endpointsByUUID = {};	
		var offsets = {};
		var offsetTimestamps = {};
		var floatingConnections = {};
		var draggableStates = {};
		var _mouseEventsEnabled = this.Defaults.MouseEventsEnabled;
		var _draggableByDefault = true;		
		var canvasList = [];
		var sizes = [];
		var listeners = {}; // a map: keys are event types, values are lists of listeners.
		var DEFAULT_SCOPE = 'DEFAULT';
		var DEFAULT_NEW_CANVAS_SIZE = 1200; // only used for IE; a canvas needs a size before the init call to excanvas (for some reason. no idea why.)

		var _findIndex = function(a, v, b, s) {
			var _eq = function(o1, o2) {
				if (o1 === o2)
					return true;
				else if (typeof o1 == 'object' && typeof o2 == 'object') {
					var same = true;
					for ( var propertyName in o1) {
						if (!_eq(o1[propertyName], o2[propertyName])) {
							same = false;
							break;
						}
					}
					for ( var propertyName in o2) {
						if (!_eq(o2[propertyName], o1[propertyName])) {
							same = false;
							break;
						}
					}
					return same;
				}
			};

			for ( var i = +b || 0, l = a.length; i < l; i++) {
				if (_eq(a[i], v))
					return i;
			}
			return -1;
		};		

		/**
		 * appends an element to the given parent, or the document body if no
		 * parent given.
		 */
		var _appendElement = function(canvas, parent) {
			if (!parent)
				document.body.appendChild(canvas);
			else
				jsPlumb.CurrentLibrary.appendElement(canvas, parent);
		};

		/**
		 * creates a timestamp, using milliseconds since 1970, but as a string.
		 */
		var _timestamp = function() { return "" + (new Date()).getTime(); };

		/**
		 * Draws an endpoint and its connections.
		 * 
		 * @param element element to draw (of type library specific element object)
		 * @param ui UI object from current library's event system. optional.
		 * @param timestamp timestamp for this paint cycle. used to speed things up a little by cutting down the amount of offset calculations we do.
		 */
		var _draw = function(element, ui, timestamp) {
			var id = _getAttribute(element, "id");
			var endpoints = endpointsByElement[id];
			if (!timestamp) timestamp = _timestamp();
			if (endpoints) {
				_updateOffset( { elId : id, offset : ui, recalc : false, timestamp : timestamp }); // timestamp is checked against last update cache; it is
				// valid for one paint cycle.
				var myOffset = offsets[id], myWH = sizes[id];
				for ( var i = 0; i < endpoints.length; i++) {
					endpoints[i].paint( { timestamp : timestamp, offset : myOffset, dimensions : myWH });
					var l = endpoints[i].connections;					
					for ( var j = 0; j < l.length; j++) {						
						l[j].paint( { elId : id, ui : ui, recalc : false, timestamp : timestamp }); // ...paint each connection.
						// then, check for dynamic endpoint; need to repaint it.						
						var oIdx = l[j].endpoints[0] == endpoints[i] ? 1 : 0;
						if (l[j].endpoints[oIdx].anchor.isDynamic && !l[j].endpoints[oIdx].isFloating()) {							
							var oId = oIdx == 0 ? l[j].sourceId : l[j].targetId;
							var oOffset = offsets[oId], oWH = sizes[oId];							
							// TODO i still want to make this faster.
							var anchorLoc = l[j].endpoints[oIdx].anchor.compute( {
										xy : [ oOffset.left, oOffset.top ],
										wh : oWH,
										element : l[j].endpoints[oIdx],
										txy : [ myOffset.left, myOffset.top ],
										twh : myWH,
										tElement : endpoints[i]
									});
							l[j].endpoints[oIdx].paint({ anchorLoc : anchorLoc });
						}
					}
				}
			}
		};

		/**
		 * executes the given function against the given element if the first
		 * argument is an object, or the list of elements, if the first argument
		 * is a list. the function passed in takes (element, elementId) as
		 * arguments.
		 */
		var _elementProxy = function(element, fn) {
			var retVal = null;
			if (element.constructor == Array) {
				retVal = [];
				for ( var i = 0; i < element.length; i++) {
					var el = _getElementObject(element[i]), id = _getAttribute(el, "id");
					retVal.push(fn(el, id)); // append return values to what we will return
				}
			} else {
				var el = _getElementObject(element), id = _getAttribute(el, "id");
				retVal = fn(el, id);
			}
			return retVal;
		};				

		/**
		 * gets an Endpoint by uuid.
		 */
		var _getEndpoint = function(uuid) { return endpointsByUUID[uuid]; };

		/**
		 * inits a draggable if it's not already initialised.
		 */
		var _initDraggableIfNecessary = function(element, isDraggable, dragOptions) {
			var draggable = isDraggable == null ? _draggableByDefault : isDraggable;
			if (draggable) {
				if (jsPlumb.CurrentLibrary.isDragSupported(element) && !jsPlumb.CurrentLibrary.isAlreadyDraggable(element)) {
					var options = dragOptions || _currentInstance.Defaults.DragOptions || jsPlumb.Defaults.DragOptions;
					options = jsPlumb.extend( {}, options); // make a copy.
					var dragEvent = jsPlumb.CurrentLibrary.dragEvents['drag'];
					var stopEvent = jsPlumb.CurrentLibrary.dragEvents['stop'];
					options[dragEvent] = _wrap(options[dragEvent], function() {
						var ui = jsPlumb.CurrentLibrary.getUIPosition(arguments);
						_draw(element, ui);
						_addClass(element, "jsPlumb_dragged");
					});
					options[stopEvent] = _wrap(options[stopEvent], function() {
						var ui = jsPlumb.CurrentLibrary.getUIPosition(arguments);
						_draw(element, ui);
						_removeClass(element, "jsPlumb_dragged");
					});
					var draggable = draggableStates[_getId(element)];
					options.disabled = draggable == null ? false : !draggable;
					jsPlumb.CurrentLibrary.initDraggable(element, options);
				}
			}
		};

		/**
		 * helper to create a canvas.
		 * 
		 */
		var _newCanvas = function(params) {
			var canvas = document.createElement("canvas");
			_appendElement(canvas, params.container);
			canvas.style.position = "absolute";
			if (params["class"]) canvas.className = params["class"];
			// set an id. if no id on the element and if uuid was supplied it
			// will be used, otherwise we'll create one.
			_getId(canvas, params.uuid);
			if (ie) {
				// for IE we have to set a big canvas size. actually you can
				// override this, too, if 1200 pixels
				// is not big enough for the biggest connector/endpoint canvas
				// you have at startup.
				jsPlumb.sizeCanvas(canvas, 0, 0, DEFAULT_NEW_CANVAS_SIZE, DEFAULT_NEW_CANVAS_SIZE);
				canvas = G_vmlCanvasManager.initElement(canvas);
			}

			return canvas;
		};
		
		var _newConnection = function(params) {
			var connectionFunc = jsPlumb.Defaults.ConnectionType || Connection;
			return new connectionFunc(params);
		};
		
		var _newEndpoint = function(params) {
			var endpointFunc = jsPlumb.Defaults.EndpointType || Endpoint;
			return new endpointFunc(params);
		};
		
		/**
		 * performs the given function operation on all the connections found
		 * for the given element id; this means we find all the endpoints for
		 * the given element, and then for each endpoint find the connectors
		 * connected to it. then we pass each connection in to the given
		 * function.
		 */
		var _operation = function(elId, func) {
			var endpoints = endpointsByElement[elId];
			if (endpoints && endpoints.length) {
				for ( var i = 0; i < endpoints.length; i++) {
					for ( var j = 0; j < endpoints[i].connections.length; j++) {
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
			for ( var elId in endpointsByElement) {
				_operation(elId, func);
			}
		};		
		
		/**
		 * helper to remove an element from the DOM.
		 */
		var _removeElement = function(element, parent) {
			if (element != null) {
				if (!parent) {
					try {
						document.body.removeChild(element);
					} catch (e) {
					}
				} else {
					jsPlumb.CurrentLibrary.removeElement(element, parent);
				}
			}
		};
		/**
		 * helper to remove a list of elements from the DOM.
		 */
		var _removeElements = function(elements, parent) {
			for ( var i = 0; i < elements.length; i++)
				_removeElement(elements[i], parent);
		};
		/**
		 * helper method to remove an item from a list.
		 */
		var _removeFromList = function(map, key, value) {
			if (key != null) {
				var l = map[key];
				if (l != null) {
					var i = _findIndex(l, value);
					if (i >= 0) {
						delete (l[i]);
						l.splice(i, 1);
						return true;
					}
				}
			}
			return false;
		};
		/**
		 * Sets whether or not the given element(s) should be draggable,
		 * regardless of what a particular plumb command may request.
		 * 
		 * @param element
		 *            May be a string, a element objects, or a list of
		 *            strings/elements.
		 * @param draggable
		 *            Whether or not the given element(s) should be draggable.
		 */
		var _setDraggable = function(element, draggable) {
			return _elementProxy(element, function(el, id) {
				draggableStates[id] = draggable;
				if (jsPlumb.CurrentLibrary.isDragSupported(el)) {
					jsPlumb.CurrentLibrary.setDraggable(el, draggable);
				}
			});
		};
		/**
		 * private method to do the business of hiding/showing.
		 * 
		 * @param el
		 *            either Id of the element in question or a library specific
		 *            object for the element.
		 * @param state
		 *            String specifying a value for the css 'display' property
		 *            ('block' or 'none').
		 */
		var _setVisible = function(el, state) {
			_operation(_getAttribute(el, "id"), function(jpc) {
				jpc.canvas.style.display = state;
			});
		};
		/**
		 * toggles the draggable state of the given element(s).
		 * 
		 * @param el
		 *            either an id, or an element object, or a list of
		 *            ids/element objects.
		 */
		var _toggleDraggable = function(el) {
			return _elementProxy(el, function(el, elId) {
				var state = draggableStates[elId] == null ? _draggableByDefault : draggableStates[elId];
				state = !state;
				draggableStates[elId] = state;
				jsPlumb.CurrentLibrary.setDraggable(el, state);
				return state;
			});
		};
		/**
		 * private method to do the business of toggling hiding/showing.
		 * 
		 * @param elId
		 *            Id of the element in question
		 */
		var _toggleVisible = function(elId) {
			_operation(elId, function(jpc) {
				var state = ('none' == jpc.canvas.style.display);
				jpc.canvas.style.display = state ? "block" : "none";
			});
			// todo this should call _elementProxy, and pass in the
			// _operation(elId, f) call as a function. cos _toggleDraggable does
			// that.
		};
		/**
		 * updates the offset and size for a given element, and stores the
		 * values. if 'offset' is not null we use that (it would have been
		 * passed in from a drag call) because it's faster; but if it is null,
		 * or if 'recalc' is true in order to force a recalculation, we get the current values.
		 */
		var _updateOffset = function(params) {
			var timestamp = params.timestamp, recalc = params.recalc, offset = params.offset, elId = params.elId;
			if (!recalc) {
				if (timestamp && timestamp === offsetTimestamps[elId])
					return;
			}
			if (recalc || offset == null) { // if forced repaint or no offset
											// available, we recalculate.
				// get the current size and offset, and store them
				var s = _getElementObject(elId);
				if (s != null) {
					sizes[elId] = _getSize(s);
					offsets[elId] = _getOffset(s);
					offsetTimestamps[elId] = timestamp;
				}
			} else {
				offsets[elId] = offset;
			}
		};

/**
		 * gets an id for the given element, creating and setting one if
		 * necessary.
		 */
		var _getId = function(element, uuid) {
			var ele = _getElementObject(element);
			var id = _getAttribute(ele, "id");
			if (!id || id == "undefined") {
				// check if fixed uuid parameter is given
				if (arguments.length == 2 && arguments[1] != undefined)
					id = uuid;
				else
					id = "jsPlumb_" + _timestamp();
				_setAttribute(ele, "id", id);
			}
			return id;
		};

/**
		 * wraps one function with another, creating a placeholder for the
		 * wrapped function if it was null. this is used to wrap the various
		 * drag/drop event functions - to allow jsPlumb to be notified of
		 * important lifecycle events without imposing itself on the user's
		 * drag/drop functionality. TODO: determine whether or not we should
		 * support an error handler concept, if one of the functions fails.
		 * 
		 * @param wrappedFunction original function to wrap; may be null.
		 * @param newFunction function to wrap the original with.
		 * @param returnOnThisValue Optional. Indicates that the wrappedFunction should 
		 * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
		 * note that this is a simple comparison and only works for primitives right now.
		 */
		var _wrap = function(wrappedFunction, newFunction, returnOnThisValue) {
			wrappedFunction = wrappedFunction || function() { };
			newFunction = newFunction || function() { };
			return function() {
				var r = null;
				try {
					r = newFunction.apply(this, arguments);
				} catch (e) {
					_log(_currentInstance, 'jsPlumb function failed : ' + e);
				}
				if (returnOnThisValue == null || (r !== returnOnThisValue)) {
					try {
						wrappedFunction.apply(this, arguments);
					} catch (e) {
						_log(_currentInstance, 'wrapped function failed : ' + e);
					}
				}
				return r;
			};
		};	

		/*
		 * Property: connectorClass 
		 *   The CSS class to set on Connection canvas elements. This value is a String and can have multiple classes; the entire String is appended as-is.
		 */
		this.connectorClass = '_jsPlumb_connector';

		/*
		 * Property: endpointClass 
		 *   The CSS class to set on Endpoint canvas elements. This value is a String and can have multiple classes; the entire String is appended as-is.
		 */
		this.endpointClass = '_jsPlumb_endpoint';

		/*
		 * Property: overlayClass 
		 * The CSS class to set on an Overlay that is an HTML element. This value is a String and can have multiple classes; the entire String is appended as-is.
		 */
		this.overlayClass = '_jsPlumb_overlay';

		/*
		 * Property: Anchors 
		 *   Default jsPlumb Anchors. These are supplied in the file jsPlumb-defaults-x.x.x.js, which is merged in with the main jsPlumb script to form <library>.jsPlumb-all-x.x.x.js. You can
		 * provide your own Anchors by supplying them in a script that is loaded after jsPlumb, for instance: > jsPlumb.Anchors.MyAnchor = { ....anchor code here. see the documentation. }
		 */
		this.Anchors = {};

		/*
		 * Property: Connectors 
		 *   Default jsPlumb Connectors. These are supplied
		 * in the file jsPlumb-defaults-x.x.x.js, which is merged in with the
		 * main jsPlumb script to form <library>.jsPlumb-all-x.x.x.js. You can
		 * provide your own Connectors by supplying them in a script that is
		 * loaded after jsPlumb, for instance: > jsPlumb.Connectors.MyConnector = {
		 * ....connector code here. see the documentation. }
		 */
		this.Connectors = {};

		/*
		 * Property: Endpoints 
		 *   Default jsPlumb Endpoints. These are supplied in
		 * the file jsPlumb-defaults-x.x.x.js, which is merged in with the main
		 * jsPlumb script to form <library>.jsPlumb-all-x.x.x.js. You can
		 * provide your own Endpoints by supplying them in a script that is
		 * loaded after jsPlumb, for instance: > jsPlumb.Endpoints.MyEndpoint = {
		 * ....endpoint code here. see the documentation. }
		 */
		this.Endpoints = {};

		/*
		 * Property:Overlays 
		 *   Default jsPlumb Overlays such as Arrows and Labels.
		 * These are supplied in the file jsPlumb-defaults-x.x.x.js, which is
		 * merged in with the main jsPlumb script to form
		 * <library>.jsPlumb-all-x.x.x.js. You can provide your own Overlays by
		 * supplying them in a script that is loaded after jsPlumb, for
		 * instance: > jsPlumb.Overlays.MyOverlay = { ....overlay code here. see
		 * the documentation. }
		 */
		this.Overlays = {};
		
		/*
		  Function: addEndpoint 
		  	
		  Adds an Endpoint to a given element.
		  			  
		  Parameters:
		   
		  	target - Element to add the endpoint to. either an element id, or a selector representing some element. 
		  	params - Object containing Endpoint options.  For more information, see the docs for Endpoint's constructor.
		  	referenceParams - Object containing more Endpoint options; it will be merged with params by jsPlumb.  You would use this if you had some shared parameters that you wanted to reuse when you added Endpoints to a number of elements.
		  	 
		  Returns: 
		  	The newly created Endpoint. 
		  	
		  See Also: 
		  	<addEndpoints>
		 */
		this.addEndpoint = function(target, params, referenceParams) {
			referenceParams = referenceParams || {};
			var p = jsPlumb.extend({}, referenceParams);
			jsPlumb.extend(p, params);
			p.endpoint = p.endpoint || _currentInstance.Defaults.Endpoint || jsPlumb.Defaults.Endpoint;
			p.endpointStyle = p.endpointStyle || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
			var el = _getElementObject(target), id = _getAttribute(el, "id");
			p.source = el;
			_updateOffset({ elId : id });
			var e = _newEndpoint(p);
			_addToList(endpointsByElement, id, e);
			var myOffset = offsets[id], myWH = sizes[id];
			var anchorLoc = e.anchor.compute( { xy : [ myOffset.left, myOffset.top ], wh : myWH, element : e });
			e.paint({ anchorLoc : anchorLoc });
			return e;
		};
		
		/*
		  Function: addEndpoints 
		  Adds a list of Endpoints to a given element.
		  
		  Parameters: 
		  	target - element to add the endpoint to. either an element id, or a selector representing some element. 
		  	endpoints - List of objects containing Endpoint options. one Endpoint is created for each entry in this list. 
			referenceParams - Object containing more Endpoint options; it will be merged with params by jsPlumb.  You would use this if you had some shared parameters that you wanted to reuse when you added Endpoints to a number of elements.		  	 

		  Returns: 
		  	List of newly created Endpoints, one for each entry in the 'endpoints' argument. 
		  	
		  See Also:
		  	<addEndpoint>
		 */
		this.addEndpoints = function(target, endpoints, referenceParams) {
			var results = [];
			for ( var i = 0; i < endpoints.length; i++) {
				results.push(_currentInstance.addEndpoint(target, endpoints[i], referenceParams));				
			}
			return results;
		};

		/*
		  Function: animate 
		  Wrapper around supporting library's animate function; injects a call to jsPlumb in the 'step' function (creating
		  it if necessary). This only supports the two-arg version of the animate call in jQuery, the one that takes an 'options' object as
		  the second arg. MooTools has only one method, a two arg one. Which is handy.
		   
		  Parameters: 
		  	el - Element to animate. Either an id, or a selector representing the element. 
		  	properties - The 'properties' argument you want passed to the library's animate call. 
		   	options - The 'options' argument you want passed to the library's animate call.
		    
		  Returns: 
		  	void
		 */
		this.animate = function(el, properties, options) {
			var ele = _getElementObject(el), id = _getAttribute(el, "id");
			options = options || {};
			var stepFunction = jsPlumb.CurrentLibrary.dragEvents['step'];
			var completeFunction = jsPlumb.CurrentLibrary.dragEvents['complete'];
			options[stepFunction] = _wrap(options[stepFunction], function() {
				_currentInstance.repaint(id);
			});

			// probably, onComplete should repaint too. that will help
			// keep up
			// with fast animations.
			options[completeFunction] = _wrap(options[completeFunction],
					function() {
						_currentInstance.repaint(id);
					});

			jsPlumb.CurrentLibrary.animate(ele, properties, options);
		};		

		/*
		  Function: connect 
		  Establishes a connection between two elements (or Endpoints, which are themselves registered to elements).
		  
		  Parameters: 
		    params - Object containing setup for the connection. See docs for Connection's constructor.
		    referenceParams - Optional object containing more params for the connection. Typically you would pass in data that a lot of connections are sharing here, such as connector style etc, and then use the main params for data specific to this connection.
		     
		  Returns: 
		  	The newly created Connection.
		 */
		this.connect = function(params, referenceParams) {
			var _p = jsPlumb.extend( {}, params);
			if (referenceParams) jsPlumb.extend(_p, referenceParams);
			
			if (_p.source && _p.source.endpoint) _p.sourceEndpoint = _p.source;
			if (_p.source && _p.target.endpoint) _p.targetEndpoint = _p.target;
			
			// test for endpoint uuids to connect
			if (params.uuids) {
				_p.sourceEndpoint = _getEndpoint(params.uuids[0]);
				_p.targetEndpoint = _getEndpoint(params.uuids[1]);
			}

			// now ensure that if we do have Endpoints already, they're not
			// full.
			if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
				_log(_currentInstance, "could not add connection; source endpoint is full");
				return;
			}

			if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
				_log(_currentInstance, "could not add connection; target endpoint is full");
				return;
			}
			
			// dynamic anchors. backwards compatibility here: from 1.2.6 onwards you don't need to specify "dynamicAnchors".  the fact that some anchor consists
			// of multiple definitions is enough to tell jsPlumb you want it to be dynamic.
			if (_p.dynamicAnchors) {
				// these can either be an array of anchor coords, which we will use for both source and target, or an object with {source:[anchors], target:[anchors]}, in which
				// case we will use a different set for each element.
				var a = _p.dynamicAnchors.constructor == Array;
				var sa = a ? new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors)) : new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors.source));
				var ta = a ? new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors)) : new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors.target));
				_p.anchors = [sa,ta];
			}

			var jpc = _newConnection(_p);
			// add to list of connections (by scope).
			_addToList(connectionsByScope, jpc.scope, jpc);
			// fire an event
			_currentInstance.fireUpdate("jsPlumbConnection", {
				source : jpc.source, target : jpc.target,
				sourceId : jpc.sourceId, targetId : jpc.targetId,
				sourceEndpoint : jpc.endpoints[0], targetEndpoint : jpc.endpoints[1]
			});
			// force a paint
			_draw(jpc.source);

			return jpc;
		};
		
		/*
		 Function: deleteEndpoint		 
		 Deletes an endpoint and removes all connections it has (which removes the connections from the other endpoints involved too)
		 
		 Parameters:
		 	object - either an Endpoint object (such as from an addEndpoint call), or a String UUID.
		 	
		 Returns:
		 	void		  
		 */
		this.deleteEndpoint = function(object) {
			var endpoint = (typeof object == "string") ? endpointsByUUID[object] : object;			
			if (endpoint) {
				var uuid = endpoint.getUuid();
				if (uuid) endpointsByUUID[uuid] = null;				
				endpoint.detachAll();				
				_removeElement(endpoint.canvas, endpoint.container);
				// remove from endpointsbyElement
				for (var e in endpointsByElement) {
					var endpoints = endpointsByElement[e];
					if (endpoints) {
						var newEndpoints = [];
						for (var i = 0; i < endpoints.length; i++)
							if (endpoints[i] != endpoint) newEndpoints.push(endpoints[i]);
						
						endpointsByElement[e] = newEndpoints;
					}
				}
				delete endpoint;								
			}									
		};
		
		/*
		 Function: deleteEveryEndpoint
		  Deletes every Endpoint, and their associated Connections, in this instance of jsPlumb. Do not unregister event listener (this is the only difference
between this method and jsPlumb.reset).  
		  
		 Returns: 
		 	void 
		 */
		this.deleteEveryEndpoint = function() {
			for ( var id in endpointsByElement) {
				var endpoints = endpointsByElement[id];
				if (endpoints && endpoints.length) {
					for ( var i = 0; i < endpoints.length; i++) {
						_currentInstance.deleteEndpoint(endpoints[i]);
					}
				}
			}
			delete endpointsByElement;
			endpointsByElement = {};
			delete endpointsByUUID;
			endpointsByUUID = {};
		};

		var fireDetachEvent = function(jpc) {
			_currentInstance.fireUpdate("jsPlumbConnectionDetached", {
				source : jpc.source, target : jpc.target,
				sourceId : jpc.sourceId, targetId : jpc.targetId,
				sourceEndpoint : jpc.endpoints[0], targetEndpoint : jpc.endpoints[1]
			});
		};

		/*
		  Function: detach 
		  Removes a connection.  takes either (source, target) (the old way, maintained for backwards compatibility), or a params
		    object with various possible values.
		  		   
		  Parameters: 
		    source - id or element object of the first element in the connection. 
		    target - id or element object of the second element in the connection.		    
		    params - a JS object containing the same parameters as you pass to jsPlumb.connect. If this is present then neither source nor
		             target should be present; it should be the only argument to the method. See the docs for Connection's constructor for information
about the parameters allowed in the params object.
		    Returns: 
		    	true if successful, false if not.
		 */
		this.detach = function(source, target) {
			if (arguments.length == 2) {
				var s = _getElementObject(source), sId = _getId(s);
				var t = _getElementObject(target), tId = _getId(t);
				_operation(sId, function(jpc) {
							if ((jpc.sourceId == sId && jpc.targetId == tId) || (jpc.targetId == sId && jpc.sourceId == tId)) {
								_removeElement(jpc.canvas, jpc.container);
								jpc.endpoints[0].removeConnection(jpc);
								jpc.endpoints[1].removeConnection(jpc);
								_removeFromList(connectionsByScope, jpc.scope, jpc);
							}
						});
			}
			// this is the new version of the method, taking a JS object like
			// the connect method does.
			else if (arguments.length == 1) {
				// TODO investigate whether or not this code still works when a user has supplied their own subclass of Connection. i suspect it may not.
				if (arguments[0].constructor == Connection) {
					//arguments[0].setHover(false);
					arguments[0].endpoints[0].detachFrom(arguments[0].endpoints[1]);
				}
				else if (arguments[0].connection) {
					//arguments[0].connection.setHover(false);
					arguments[0].connection.endpoints[0].detachFrom(arguments[0].connection.endpoints[1]);
				}
				else {
					var _p = jsPlumb.extend( {}, source); // a backwards compatibility hack: source should be thought of as 'params' in this case.
					// test for endpoint uuids to detach
					if (_p.uuids) {
						_getEndpoint(_p.uuids[0]).detachFrom(_getEndpoint(_p.uuids[1]));
					} else if (_p.sourceEndpoint && _p.targetEndpoint) {
						_p.sourceEndpoint.detachFrom(_p.targetEndpoint);
					} else {
						var sourceId = _getId(_p.source);
						var targetId = _getId(_p.target);
						_operation(sourceId, function(jpc) {
									if ((jpc.sourceId == sourceId && jpc.targetId == targetId) || (jpc.targetId == sourceId && jpc.sourceId == targetId)) {
										_removeElement(jpc.canvas, jpc.container);
										jpc.endpoints[0].removeConnection(jpc);
										jpc.endpoints[1].removeConnection(jpc);
										_removeFromList(connectionsByScope, jpc.scope, jpc);
									}
								});
					}
				}
			}
		};

		/*
		  Function: detachAll 
		  Removes all an element's Connections.
		   
		  Parameters:
		  	el - either the id of the element, or a selector for the element.
		  	
		  Returns: 
		  	void
		 */
		this.detachAllConnections = function(el) {
			var id = _getAttribute(el, "id");
			var endpoints = endpointsByElement[id];
			if (endpoints && endpoints.length) {
				for ( var i = 0; i < endpoints.length; i++) {
					endpoints[i].detachAll();
				}
			}
		};
		
		/**
		 * @deprecated Use detachAllConnections instead.  this will be removed in jsPlumb 1.3.
		 */
		this.detachAll = this.detachAllConnections;

		/*
		  Function: detachEveryConnection 
		  Remove all Connections from all elements, but leaves Endpoints in place.
		   
		  Returns: 
		  	void
		  	 
		  See Also:
		  	<removeEveryEndpoint>
		 */
		this.detachEveryConnection = function() {
			for ( var id in endpointsByElement) {
				var endpoints = endpointsByElement[id];
				if (endpoints && endpoints.length) {
					for ( var i = 0; i < endpoints.length; i++) {
						endpoints[i].detachAll();
					}
				}
			}
			delete connectionsByScope;
			connectionsByScope = {};
		};
		
		/**
		 * @deprecated use detachEveryConnection instead.  this will be removed in jsPlumb 1.3.
		 */
		this.detachEverything = this.detachEveryConnection;

		/*
		  Function: draggable 
		  Initialises the draggability of some element or elements.  You should use this instead of you library's draggable method so that jsPlumb can setup the appropriate callbacks.  Your underlying library's drag method is always called from this method.
		  
		  Parameters: 
		  	el - either an element id, a list of element ids, or a selector. 
		  	options - options to pass through to the underlying library
		  	 
		  Returns: 
		  	void
		 */
		this.draggable = function(el, options) {
			if (typeof el == 'object' && el.length) {
				for ( var i = 0; i < el.length; i++) {
					var ele = _getElementObject(el[i]);
					if (ele) _initDraggableIfNecessary(ele, true, options);
				}
			} 
			else if (el._nodes) { 	// TODO this is YUI specific; really the logic should be forced
				// into the library adapters (for jquery and mootools aswell)
				for ( var i = 0; i < el._nodes.length; i++) {
					var ele = _getElementObject(el._nodes[i]);
					if (ele) _initDraggableIfNecessary(ele, true, options);
				}
			}
			else {
				var ele = _getElementObject(el);
				if (ele) _initDraggableIfNecessary(ele, true, options);
			}
		};

		/*
		  Function: extend 
		  Wraps the underlying library's extend functionality.
		  
		  Parameters: 
		  	o1 - object to extend 
		  	o2 - object to extend o1 with
		  	
		  Returns: 
		  	o1, extended with all properties from o2.
		 */
		this.extend = function(o1, o2) {
			return jsPlumb.CurrentLibrary.extend(o1, o2);
		};
		
		/*
		 * Function: getDefaultEndpointType
		 * 	Returns the default Endpoint type. Used when someone wants to subclass Endpoint and have jsPlumb return instances of their subclass.
		 *  you would make a call like this in your class's constructor:
		 *    jsPlumb.getDefaultEndpointType().apply(this, arguments);
		 * 
		 * Returns:
		 * 	the default Endpoint function used by jsPlumb.
		 */
		this.getDefaultEndpointType = function() {
			return Endpoint;
		};
		
		/*
		 * Function: getDefaultConnectionType
		 * 	Returns the default Connection type. Used when someone wants to subclass Connection and have jsPlumb return instances of their subclass.
		 *  you would make a call like this in your class's constructor:
		 *    jsPlumb.getDefaultConnectionType().apply(this, arguments);
		 * 
		 * Returns:
		 * 	the default Connection function used by jsPlumb.
		 */
		this.getDefaultConnectionType = function() {
			return Connection;
		};

		/*
		 * Function: getConnections 
		 * Gets all or a subset of connections currently managed by this jsPlumb instance. 
		 * Parameters: 
		 * 	options - a JS object that holds options defining what sort of connections you're
		 * looking for. Valid values are: scope this may be a String or a list
		 * of Strings. jsPlumb will only return Connections whose scope matches
		 * what this option defines. If you omit it, you will be given
		 * Connections of every scope. source may be a string or a list of
		 * strings; constraints results to have only Connections whose source is
		 * this object. target may be a string or a list of strings; constraints
		 * results to have only Connections whose target is this object.
		 * 
		 * The return value is a dictionary in this format:
		 *  { 'scope1': [ {sourceId:'window1', targetId:'window2', source:<sourceElement>,
		 * target:<targetElement>, sourceEndpoint:<sourceEndpoint>,
		 * targetEndpoint:<targetEndpoint>, connection:<connection>},
		 * {sourceId:'window3', targetId:'window4', source:<sourceElement>,
		 * target:<targetElement>, sourceEndpoint:<sourceEndpoint>,
		 * targetEndpoint:<targetEndpoint>, connection:<connection>},
		 * {sourceId:'window1', targetId:'window3', source:<sourceElement>,
		 * target:<targetElement>, sourceEndpoint:<sourceEndpoint>,
		 * targetEndpoint:<targetEndpoint>, connection:<connection>} ],
		 * 'scope2': [ {sourceId:'window1', targetId:'window3', source:<sourceElement>,
		 * target:<targetElement>, sourceEndpoint:<sourceEndpoint>,
		 * targetEndpoint:<targetEndpoint>, connection:<connection>} ] }
		 * 
		 */
		this.getConnections = function(options) {
			var r = {};
			options = options || {};
			var prepareList = function(input) {
				var r = [];
				if (input) {
					if (typeof input == 'string')
						r.push(input);
					else
						r = input;
				}
				return r;
			};
			var scopes = prepareList(options.scope);
			var sources = prepareList(options.source);
			var targets = prepareList(options.target);
			var filter = function(list, value) {
				return list.length > 0 ? _findIndex(list, value) != -1 : true;
			};
			for ( var i in connectionsByScope) {
				if (filter(scopes, i)) {
					r[i] = [];
					for ( var j = 0; j < connectionsByScope[i].length; j++) {
						var c = connectionsByScope[i][j];
						if (filter(sources, c.sourceId) && filter(targets, c.targetId))
							r[i].push({ sourceId : c.sourceId, targetId : c.targetId, source : c.source, target : c.target, sourceEndpoint : c.endpoints[0], targetEndpoint : c.endpoints[1], connection : c });
					}
				}
			}
			return r;
		};

		/*
		 * Function: getDefaultScope 
		 * Gets the default scope for connections and  endpoints. a scope defines a type of endpoint/connection; supplying a
		 * scope to an endpoint or connection allows you to support different
		 * types of connections in the same UI. but if you're only interested in
		 * one type of connection, you don't need to supply a scope. this method
		 * will probably be used by very few people; it's good for testing
		 * though.
		 */
		this.getDefaultScope = function() {
			return DEFAULT_SCOPE;
		};

		/*
		  Function: getEndpoint 
		  Gets an Endpoint by UUID
		   
		  Parameters: 
		  	uuid - the UUID for the Endpoint
		  	 
		  Returns: 
		  	Endpoint with the given UUID, null if nothing found.
		 */
		this.getEndpoint = _getEndpoint;

		/*
		 * Gets an element's id, creating one if necessary. really only exposed
		 * for the lib-specific functionality to access; would be better to pass
		 * the current instance into the lib-specific code (even though this is
		 * a static call. i just don't want to expose it to the public API).
		 */
		this.getId = _getId;

		/*
		  Function: hide 
		  Sets an element's connections to be hidden.
		  
		  Parameters: 
		  	el - either the id of the element, or a selector for the element.
		  	 
		  Returns: 
		  	void
		 */
		this.hide = function(el) {
			_setVisible(el, "none");
		};
		
		/**
		 * callback from the current library to tell us to prepare ourselves (attach
		 * mouse listeners etc; can't do that until the library has provided a bind method)
		 * @return
		 */
		this.init = function() {
			var _bind = function(event) {
				jsPlumb.CurrentLibrary.bind(document, event, function(e) {
					if (!_currentInstance.currentlyDragging && _mouseEventsEnabled) {
						// try connections first
						for (var scope in connectionsByScope) {
			    			var c = connectionsByScope[scope];
			    			for (var i = 0; i < c.length; i++) {
			    				if (c[i][event](e)) return;			    			
			    			}
			    		}
						for (var el in endpointsByElement) {
							var ee = endpointsByElement[el];
							for (var i = 0; i < ee.length; i++) {
								if (ee[i][event](e)) return;
							}
						}
					}
				});
			};
			_bind("click");
			_bind("dblclick");
			_bind("mousemove");
			_bind("mousedown");
			_bind("mouseup");
			
			initialized = true;
			_currentInstance.fireUpdate("ready");
		};

		/*
		 * Creates an anchor with the given params.
		 * 
		 * You do not need to use this method.  It is exposed because of the way jsPlumb is
		 * split into three scripts; this will change in the future. 
		 * 
		 * x - the x location of the anchor as a fraction of the
		 * total width. y - the y location of the anchor as a fraction of the
		 * total height. xOrientation - value indicating the general direction a
		 * connection from the anchor should go in, in the x direction.
		 * yOrientation - value indicating the general direction a connection
		 * from the anchor should go in, in the y direction. xOffset - a fixed
		 * offset that should be applied in the x direction that should be
		 * applied after the x position has been figured out. optional. defaults
		 * to 0. yOffset - a fixed offset that should be applied in the y
		 * direction that should be applied after the y position has been
		 * figured out. optional. defaults to 0.
		 *  -- OR --
		 * 
		 * params - {x:..., y:..., xOrientation etc }
		 *  -- OR FROM 1.2.4 ---
		 * 
		 * name - the name of some Anchor in the _currentInstance.Anchors array.
		 *  -- OR FROM 1.2.4 ---
		 * 
		 * coords - a list of coords for the anchor, like you would pass to
		 * jsPlumb.makeAnchor (eg [0.5,0.5,0,-1] - an anchor in the center of
		 * some element, oriented towards the top of the screen)
		 *  -- OR FROM 1.2.4 ---
		 * 
		 * anchor - an existing anchor. just gets passed back. it's handy
		 * internally to have this functionality.
		 * 
		 * Returns: The newly created Anchor.
		 */
		this.makeAnchor = function(x, y, xOrientation, yOrientation, xOffset, yOffset) {
			// backwards compatibility here. we used to require an object passed
			// in but that makes the call very verbose. easier to use
			// by just passing in four/six values. but for backwards
			// compatibility if we are given only one value we assume it's a
			// call in the old form.
			if (arguments.length == 0) return null;
			var params = {};
			if (arguments.length == 1) {
				var specimen = arguments[0];
				// if it appears to be an anchor already...
				if (specimen.compute && specimen.getOrientation) return specimen;
				// is it the name of an anchor type?
				else if (typeof specimen == "string") return _currentInstance.Anchors[arguments[0]]();
				// is it an array of coordinates?
				else if (specimen.constructor == Array) {
					if (specimen[0].constructor == Array || specimen[0].constructor == String)
						return new DynamicAnchor(specimen);
					else
						return jsPlumb.makeAnchor.apply(this, specimen);
				}
				// last we try the backwards compatibility stuff.
				else if (typeof arguments[0] == "object") jsPlumb.extend(params, x);
			} else {
				params = { x : x, y : y };
				if (arguments.length >= 4) params.orientation = [ arguments[2], arguments[3] ];
				if (arguments.length == 6) params.offsets = [ arguments[4], arguments[5] ];
			}
			var a = new Anchor(params);
			a.clone = function() {
				return new Anchor(params);
			};
			return a;
		};

		/**
		 * makes a list of anchors from the given list of types or coords, eg
		 * ["TopCenter", "RightMiddle", "BottomCenter", [0, 1, -1, -1] ]
		 */
		this.makeAnchors = function(types) {
			var r = [];
			for ( var i = 0; i < types.length; i++)
				if (typeof types[i] == "string")
					r.push(_currentInstance.Anchors[types[i]]());
				else if (types[i].constructor == Array)
					r.push(jsPlumb.makeAnchor(types[i]));
			return r;
		};

		/**
		 * Makes a dynamic anchor from the given list of anchors (which may be in shorthand notation as strings or dimension arrays, or Anchor
		 * objects themselves) and the given, optional, anchorSelector function (jsPlumb uses a default if this is not provided; most people will
		 * not need to provide this - i think). 
		 */
		this.makeDynamicAnchor = function(anchors, anchorSelector) {
			return new DynamicAnchor(anchors, anchorSelector);
		};

		/*
		  Function: repaint 
		  Repaints an element and its connections. This method gets new sizes for the elements before painting anything.
		  
		  Parameters: 
		  	el - either the id of the element or a selector representing the element.
		  	 
		  Returns: 
		  	void
		  	 
		  See Also: 
		  	<repaintEverything>
		 */
		this.repaint = function(el) {
			var _processElement = function(el) { _draw(_getElementObject(el)); };
			// support both lists...
			if (typeof el == 'object')
				for ( var i = 0; i < el.length; i++) _processElement(el[i]);			 
			else // ...and single strings.
				_processElement(el);
		};

		/*
		  Function: repaintEverything 
		  Repaints all connections.
		   
		  Returns: 
		  	void
		  	
		  See Also: 
		  	<repaint>
		 */
		this.repaintEverything = function() {
			var timestamp = _timestamp();
			for ( var elId in endpointsByElement) {
				_draw(_getElementObject(elId), null, timestamp);
			}
		};

		/*
		  Function: removeAllEndpoints 
		  Removes all Endpoints associated with a given element. Also removes all Connections associated with each Endpoint it removes.
		  
		  Parameters: 
		  	el - either an element id, or a selector for an element.
		  	 
		  Returns: 
		  	void
		  	 
		  See Also: 
		  	<removeEndpoint>
		 */
		this.removeAllEndpoints = function(el) {
			var elId = _getAttribute(el, "id");
			var ebe = endpointsByElement[elId];
			for ( var i in ebe) 
				_currentInstance.deleteEndpoint(ebe[i]);
			endpointsByElement[elId] = [];
		};

		/*
		  Removes every Endpoint in this instance of jsPlumb.		   		  		  		  
		  @deprecated use deleteEveryEndpoint instead
		 */
		this.removeEveryEndpoint = this.deleteEveryEndpoint;
		
		/*
		  Removes the given Endpoint from the given element.		  		  
		  @deprecated Use jsPlumb.deleteEndpoint instead (and note you dont need to supply the element. it's irrelevant).
		 */
		this.removeEndpoint = function(el, endpoint) {
			_currentInstance.deleteEndpoint(endpoint);
		};

		/*
		  Function:reset 
		  Removes all endpoints and connections and clears the listener list. To keep listeners call jsPlumb.deleteEveryEndpoint instead of this.
		 */
		this.reset = function() {
			this.deleteEveryEndpoint();
			this.clearListeners();
		};

		/*
		  Function: setAutomaticRepaint 
		  Sets/unsets automatic repaint on window resize.
		   
		  Parameters: 
		  	value - whether or not to automatically repaint when the window is resized.
		  	 
		  Returns: void
		 */
		this.setAutomaticRepaint = function(value) {
			automaticRepaint = value;
		};

		/*
		 * Function: setDefaultNewCanvasSize 
		 * Sets the default size jsPlumb will use for a new canvas (we create a square canvas so one value is all
		 * that is required). This is a hack for IE, because ExplorerCanvas
		 * seems to need for a canvas to be larger than what you are going to
		 * draw on it at initialisation time. The default value of this is 1200
		 * pixels, which is quite large, but if for some reason you're drawing
		 * connectors that are bigger, you should adjust this value
		 * appropriately.
		 *  
		 * Parameters: 
		 * 	size - The default size to use. jsPlumb will use a square canvas so you need only supply one value.
		 *  
		 * Returns:
		 * 	void
		 */
		this.setDefaultNewCanvasSize = function(size) {
			DEFAULT_NEW_CANVAS_SIZE = size;
		};

		/*
		 * Function: setDefaultScope 
		 * Sets the default scope for Connections and Endpoints. A scope defines a type of Endpoint/Connection; supplying a
		 * scope to an Endpoint or Connection allows you to support different
		 * types of Connections in the same UI.  If you're only interested in
		 * one type of Connection, you don't need to supply a scope. This method
		 * will probably be used by very few people; it just instructs jsPlumb
		 * to use a different key for the default scope.
		 * 
		 * Parameters:
		 * 	scope - scope to set as default.
		 */
		this.setDefaultScope = function(scope) {
			DEFAULT_SCOPE = scope;
		};

		/*
		 * Function: setDraggable 
		 * Sets whether or not a given element is
		 * draggable, regardless of what any jsPlumb command may request.
		 * 
		 * Parameters: 
		 * 	el - either the id for the element, or a selector representing the element.
		 *  
		 * Returns: 
		 * 	void
		 */
		this.setDraggable = _setDraggable;

		/*
		 * Function: setDraggableByDefault 
		 * Sets whether or not elements are draggable by default. Default for this is true.
		 *  
		 * Parameters: 
		 * 	draggable - value to set
		 *  
		 * Returns: 
		 * 	void
		 */
		this.setDraggableByDefault = function(draggable) {
			_draggableByDefault = draggable;
		};

		this.setDebugLog = function(debugLog) {
			log = debugLog;
		};

		/*
		 * Function: setRepaintFunction 
		 * 	Sets the function to fire when the window size has changed and a repaint was fired. 
		 * 
		 * Parameters: 
		 * 	f - Function to execute.
		 *  
		 * Returns: void
		 */
		this.setRepaintFunction = function(f) {
			repaintFunction = f;
		};
		
		/*
		 * Function: setMouseEventsEnabled
		 * Sets whether or not mouse events are enabled.  By default they are not; this is just because jsPlumb has to add mouse listeners
		 * to the document, which may result in a performance hit a user does not need.
		 *  
		 * Parameters:
		 * 	enabled - whether or not mouse events should be enabled.
		 * 
		 * Returns: 
		 * 	void
		 */
		this.setMouseEventsEnabled = function(enabled) {
			_mouseEventsEnabled = enabled;
		};

		/*
		 * Function: show 
		 * Sets an element's connections to be visible.
		 * 
		 * Parameters: 
		 * 	el - either the id of the element, or a selector for the element.
		 *  
		 * Returns: 
		 * 	void
		 */
		this.show = function(el) {
			_setVisible(el, "block");
		};

		/*
		 * Function: sizeCanvas 
		 * Helper to size a canvas. You would typically use
		 * this when writing your own Connector or Endpoint implementation.
		 * 
		 * Parameters: 
		 * 	x - [int] x position for the Canvas origin 
		 * 	y - [int] y position for the Canvas origin 
		 * 	w - [int] width of the canvas 
		 * 	h - [int] height of the canvas
		 *  
		 * Returns: 
		 * 	void
		 */
		this.sizeCanvas = function(canvas, x, y, w, h) {
			if (canvas) {
				canvas.style.height = h + "px";
				canvas.height = h;
				canvas.style.width = w + "px";
				canvas.width = w;
				canvas.style.left = x + "px";
				canvas.style.top = y + "px";
			}
		};

		/**
		 * gets some test hooks. nothing writable.
		 */
		this.getTestHarness = function() {
			return {
				endpointsByElement : endpointsByElement,  
				endpointCount : function(elId) {
					var e = endpointsByElement[elId];
					return e ? e.length : 0;
				},
				connectionCount : function(scope) {
					scope = scope || DEFAULT_SCOPE;
					var c = connectionsByScope[scope];
					return c ? c.length : 0;
				},
				findIndex : _findIndex,
				getId : _getId
			};
		};

		/**
		 * Toggles visibility of an element's connections. kept for backwards
		 * compatibility
		 */
		this.toggle = _toggleVisible;

		/*
		 * Function: toggleVisible 
		 * Toggles visibility of an element's Connections.
		 *  
		 * Parameters: 
		 * 	el - either the element's id, or a selector representing the element.
		 *  
		 * Returns: 
		 * 	void, but should be updated to return the current state
		 */
		// TODO: update this method to return the current state.
		this.toggleVisible = _toggleVisible;

		/*
		 * Function: toggleDraggable 
		 * Toggles draggability (sic?) of an element's Connections.
		 *  
		 * Parameters: 
		 * 	el - either the element's id, or a selector representing the element.
		 *  
		 * Returns: 
		 * 	The current draggable state.
		 */
		this.toggleDraggable = _toggleDraggable;

		/*
		 * Function: unload 
		 * Unloads jsPlumb, deleting all storage. You should call this from an onunload attribute on the <body> element. 
		 * 
		 * Returns:
		 * 	void
		 */
		this.unload = function() {
			delete endpointsByElement;
			delete endpointsByUUID;
			delete offsets;
			delete sizes;
			delete floatingConnections;
			delete draggableStates;
			delete canvasList;
		};

		/*
		 * Helper method to wrap an existing function with one of
		 * your own. This is used by the various implementations to wrap event
		 * callbacks for drag/drop etc; it allows jsPlumb to be transparent in
		 * its handling of these things. If a user supplies their own event
		 * callback, for anything, it will always be called. 
		 */
		this.wrap = _wrap;			
		this.addListener = this.bind;

		/**
		 * Anchors model a position on some element at which an Endpoint may be located.  They began as a first class citizen of jsPlumb, ie. a user
		 * was required to create these themselves, but over time this has been replaced by the concept of referring to them either by name (eg. "TopMiddle"),
		 * or by an array describing their coordinates (eg. [ 0, 0.5, 0, -1 ], which is the same as "TopMiddle").  jsPlumb now handles all of the
		 * creation of Anchors without user intervention.
		 */
		var Anchor = function(params) {
			var self = this;
			this.x = params.x || 0;
			this.y = params.y || 0;
			var orientation = params.orientation || [ 0, 0 ];
			var lastTimestamp = null, lastReturnValue = null;
			this.offsets = params.offsets || [ 0, 0 ];
			self.timestamp = null;
			this.compute = function(params) {
				var xy = params.xy, wh = params.wh, element = params.element, timestamp = params.timestamp;
				if (timestamp && timestamp === self.timestamp) {
					return lastReturnValue;
				}
				lastReturnValue = [ xy[0] + (self.x * wh[0]) + self.offsets[0], xy[1] + (self.y * wh[1]) + self.offsets[1] ];
				var container = element ? element.container : null;
				var containerAdjustment = { left : 0, top : 0 };
				if (container != null) {
					var eo = _getElementObject(container);
					var o = _getOffset(eo);
					var sl = jsPlumb.CurrentLibrary.getScrollLeft(eo);
					var st = jsPlumb.CurrentLibrary.getScrollTop(eo);
					containerAdjustment.left = o.left - sl;
					containerAdjustment.top = o.top - st;
					lastReturnValue[0] = lastReturnValue[0] - containerAdjustment.left;
					lastReturnValue[1] = lastReturnValue[1] - containerAdjustment.top;
				}
				self.timestamp = timestamp;
				return lastReturnValue;
			};

			this.getOrientation = function() { return orientation; };

			this.equals = function(anchor) {
				if (!anchor) return false;
				var ao = anchor.getOrientation();
				var o = this.getOrientation();
				return this.x == anchor.x && this.y == anchor.y
						&& this.offsets[0] == anchor.offsets[0]
						&& this.offsets[1] == anchor.offsets[1]
						&& o[0] == ao[0] && o[1] == ao[1];
			};

			this.getCurrentLocation = function() { return lastReturnValue; };
		};

		/**
		 * An Anchor that floats. its orientation is computed dynamically from
		 * its position relative to the anchor it is floating relative to.  It is used when creating 
		 * a connection through drag and drop.
		 */
		var FloatingAnchor = function(params) {

			// this is the anchor that this floating anchor is referenced to for
			// purposes of calculating the orientation.
			var ref = params.reference;
			// the canvas this refers to.
			var refCanvas = params.referenceCanvas;
			var size = _getSize(_getElementObject(refCanvas));

			// these are used to store the current relative position of our
			// anchor wrt the reference anchor. they only indicate
			// direction, so have a value of 1 or -1 (or, very rarely, 0). these
			// values are written by the compute method, and read
			// by the getOrientation method.
			var xDir = 0, yDir = 0;
			// temporary member used to store an orientation when the floating
			// anchor is hovering over another anchor.
			var orientation = null;
			var _lastResult = null;

			this.compute = function(params) {
				var xy = params.xy, el = params.element;
				var result = [ xy[0] + (size[0] / 2), xy[1] + (size[1] / 2) ]; // return origin of the element. we may wish to improve this so that any object can be the drag proxy.
				if (el.container != null) {					
					var o = _getOffset(el.container);
					result[0] = result[0] - o.left;
					result[1] = result[1] - o.top;
				}
				_lastResult = result;
				return result;
			};

			this.getOrientation = function() {
				if (orientation) return orientation;
				else {
					var o = ref.getOrientation();
					// here we take into account the orientation of the other
					// anchor: if it declares zero for some direction, we declare zero too. this might not be the most awesome. perhaps we can come
					// up with a better way. it's just so that the line we draw looks like it makes sense. maybe this wont make sense.
					return [ Math.abs(o[0]) * xDir * -1,
							Math.abs(o[1]) * yDir * -1 ];
				}
			};

			/**
			 * notification the endpoint associated with this anchor is hovering
			 * over another anchor; we want to assume that anchor's orientation
			 * for the duration of the hover.
			 */
			this.over = function(anchor) { orientation = anchor.getOrientation(); };

			/**
			 * notification the endpoint associated with this anchor is no
			 * longer hovering over another anchor; we should resume calculating
			 * orientation as we normally do.
			 */
			this.out = function() { orientation = null; };

			this.getCurrentLocation = function() { return _lastResult; };
		};

		/* 
		 * A DynamicAnchors is an Anchor that contains a list of other Anchors, which it cycles
		 * through at compute time to find the one that is located closest to
		 * the center of the target element, and returns that Anchor's compute
		 * method result. this causes endpoints to follow each other with
		 * respect to the orientation of their target elements, which is a useful
		 * feature for some applications.
		 * 
		 */
		var DynamicAnchor = function(anchors, anchorSelector) {
			this.isSelective = true;
			this.isDynamic = true;			
			var _anchors = anchors || [];
			var _convert = function(anchor) { return anchor.constructor == Anchor ? anchor: jsPlumb.makeAnchor(anchor); };
			for (var i = 0; i < _anchors.length; i++) _anchors[i] = _convert(_anchors[i]);			
			this.addAnchor = function(anchor) { _anchors.push(_convert(anchor)); };
			this.getAnchors = function() { return _anchors; };
			var _curAnchor = _anchors.length > 0 ? _anchors[0] : null;
			var _curIndex = _anchors.length > 0 ? 0 : -1;
			this.locked = false;
			var self = this;
			
			// helper method to calculate the distance between the centers of the two elements.
			var _distance = function(anchor, cx, cy, xy, wh) {
				var ax = xy[0] + (anchor.x * wh[0]), ay = xy[1] + (anchor.y * wh[1]);
				return Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2));
			};
			// default method uses distance between element centers.  you can provide your own method in the dynamic anchor
			// constructor (and also to jsPlumb.makeDynamicAnchor). the arguments to it are four arrays: 
			// xy - xy loc of the anchor's element
			// wh - anchor's element's dimensions
			// txy - xy loc of the element of the other anchor in the connection
			// twh - dimensions of the element of the other anchor in the connection.
			// anchors - the list of selectable anchors
			var _anchorSelector = anchorSelector || function(xy, wh, txy, twh, anchors) {
				var cx = txy[0] + (twh[0] / 2), cy = txy[1] + (twh[1] / 2);
				var minIdx = -1, minDist = Infinity;
				for ( var i = 0; i < anchors.length; i++) {
					var d = _distance(anchors[i], cx, cy, xy, wh);
					if (d < minDist) {
						minIdx = i + 0;
						minDist = d;
					}
				}
				return anchors[minIdx];
			};
			this.compute = function(params) {				
				var xy = params.xy, wh = params.wh, timestamp = params.timestamp, txy = params.txy, twh = params.twh;				
				// if anchor is locked or an opposite element was not given, we
				// maintain our state. anchor will be locked
				// if it is the source of a drag and drop.
				if (self.locked || txy == null || twh == null)
					return _curAnchor.compute(params);
				else
					params.timestamp = null; // otherwise clear this, i think. we want the anchor to compute.
				
				_curAnchor = _anchorSelector(xy, wh, txy, twh, _anchors);
				
				var pos = _curAnchor.compute(params);
				return pos;
			};

			this.getCurrentLocation = function() {
				var cl = _curAnchor != null ? _curAnchor.getCurrentLocation() : null;
				return cl;				
			};

			this.getOrientation = function() { return _curAnchor != null ? _curAnchor.getOrientation() : [ 0, 0 ]; };
			this.over = function(anchor) { if (_curAnchor != null) _curAnchor.over(anchor); };
			this.out = function() { if (_curAnchor != null) _curAnchor.out(); };
		};

		/*
		 * Class: Connection
		 * The connecting line between two Endpoints.
		 */
		/*
		 * Function: Connection
		 * Connection constructor.
		 * 
		 * Parameters:
		 * 	source 	- either an element id, a selector for an element, or an Endpoint.
		 * 	target	- either an element id, a selector for an element, or an Endpoint
		 * 	scope	- scope descriptor for this connection. optional.
		 * 	container	- id of the containing div for this connection. optional; jsPlumb uses the default (which you can set, but which is the body by default) otherwise.
		 *  endpoint - Optional. Endpoint definition to use for both ends of the connection.
		 *  endpoints - Optional. Array of two Endpoint definitions, one for each end of the Connection. This and 'endpoint' are mutually exclusive parameters.
		 *  endpointStyle - Optional. Endpoint style definition to use for both ends of the Connection.
		 *  endpointStyles - Optional. Array of two Endpoint style definitions, one for each end of the Connection. This and 'endpoint' are mutually exclusive parameters.
		 *  paintStyle - Parameters defining the appearance of the Connection. Optional; jsPlumb will use the defaults if you supply nothing here.
		 *  backgroundPaintStyle - Parameters defining the appearance of the background of the Connection. Optional; jsPlumb will use the defaults if you supply nothing here.
		 *  hoverPaintStyle - Parameters defining the appearance of the Connection when the mouse is hovering over it. Optional; jsPlumb will use the defaults if you supply nothing here (note that the default hoverPaintStyle is null).
		 *  overlays - Optional array of Overlay definitions to appear on this Connection.
		 */
		var Connection = function(params) {

			EventGenerator.apply(this);
			// ************** get the source and target and register the connection. *******************
			var self = this;
			var visible = true;
			/**
				Function:isVisible
				Returns whether or not the Connection is currently visible.
			*/
			this.isVisible = function() { return visible; };
			/**
				Function: setVisible
				Sets whether or not the Connection should be visible.

				Parameters:
					visible - boolean indicating desired visible state.
			*/
			this.setVisible = function(v) {
				visible = v;
				if (self.canvas) self.canvas.style.display = v ? "block" : "none";
			};
			var id = new String('_jsplumb_c_' + (new Date()).getTime());
			this.getId = function() { return id; };
			this.container = params.container || _currentInstance.Defaults.Container; // may be null; we will append to the body if so.
			// get source and target as jQuery objects
			/**
				Property: source
				The source element for this Connection.
			*/
			this.source = _getElementObject(params.source);
			/**
				Property:target
				The target element for this Connection.
			*/
			this.target = _getElementObject(params.target);
			// sourceEndpoint and targetEndpoint override source/target, if they are present.
			if (params.sourceEndpoint) this.source = params.sourceEndpoint.getElement();
			if (params.targetEndpoint) this.target = params.targetEndpoint.getElement();
			/*
			 * Property: sourceId
			 * Id of the source element in the connection.
			 */
			this.sourceId = _getAttribute(this.source, "id");
			/*
			 * Property: targetId
			 * Id of the target element in the connection.
			 */
			this.targetId = _getAttribute(this.target, "id");
			this.endpointsOnTop = params.endpointsOnTop != null ? params.endpointsOnTop : true;
			this.getAttachedElements = function() {
				return self.endpoints;
			};
			
			/*
			 * Property: scope
			 * Optional scope descriptor for the connection.
			 */
			this.scope = params.scope; // scope may have been passed in to the connect call. if it wasn't, we will pull it from the source endpoint, after having initialised the endpoints. 
			/*
			 * Property: endpoints
			 * Array of [source, target] Endpoint objects.
			 */
			this.endpoints = [];
			this.endpointStyles = [];
			// wrapped the main function to return null if no input given. this lets us cascade defaults properly.
			var _makeAnchor = function(anchorParams) {
				if (anchorParams)
					return jsPlumb.makeAnchor(anchorParams);
			};
			var prepareEndpoint = function(existing, index, params, element) {
				if (existing) {
					self.endpoints[index] = existing;
					existing.addConnection(self);
				} else {
					if (!params.endpoints) params.endpoints = [ null, null ];
					var ep = params.endpoints[index] || params.endpoint
							|| _currentInstance.Defaults.Endpoints[index]
							|| jsPlumb.Defaults.Endpoints[index]
							|| _currentInstance.Defaults.Endpoint
							|| jsPlumb.Defaults.Endpoint
							|| new jsPlumb.Endpoints.Dot();
					if (ep.constructor == String) 
						ep = new jsPlumb.Endpoints[ep]();
					else if (ep.constructor == Array) {
						ep = new jsPlumb.Endpoints[ep[0]](ep[1]);
					}
					if (!params.endpointStyles) params.endpointStyles = [ null, null ];
					if (!params.endpointHoverStyles) params.endpointHoverStyles = [ null, null ];
					var es = params.endpointStyles[index] || params.endpointStyle || _currentInstance.Defaults.EndpointStyles[index] || jsPlumb.Defaults.EndpointStyles[index] || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
					var ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || _currentInstance.Defaults.EndpointHoverStyles[index] || jsPlumb.Defaults.EndpointHoverStyles[index] || _currentInstance.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle;
					var a = params.anchors ? params.anchors[index] : _makeAnchor(_currentInstance.Defaults.Anchors[index]) || _makeAnchor(jsPlumb.Defaults.Anchors[index]) || _makeAnchor(_currentInstance.Defaults.Anchor) || _makeAnchor(jsPlumb.Defaults.Anchor) || _makeAnchor("BottomCenter");
					var u = params.uuids ? params.uuids[index] : null;
					var e = _newEndpoint( { paintStyle : es, hoverPaintStyle:ehs, endpoint : ep, connections : [ self ], uuid : u, anchor : a, source : element, container : self.container });
					self.endpoints[index] = e;
					return e;
				}
			};

			var eS = prepareEndpoint(params.sourceEndpoint, 0, params, self.source);
			if (eS) _addToList(endpointsByElement, this.sourceId, eS);
			var eT = prepareEndpoint(params.targetEndpoint, 1, params, self.target);
			if (eT) _addToList(endpointsByElement, this.targetId, eT);
			// if scope not set, set it to be the scope for the source endpoint.
			if (!this.scope) this.scope = this.endpoints[0].scope;

			/*
			 * Property: connector
			 * The underlying Connector for this Connection (eg. a Bezier connector, straight line connector)
			 */
			this.connector = this.endpoints[0].connector || this.endpoints[1].connector || params.connector || _currentInstance.Defaults.Connector || jsPlumb.Defaults.Connector || new jsPlumb.Connectors.Bezier();
			if (this.connector.constructor == String) 
				this.connector = new jsPlumb.Connectors[this.connector](); // lets you use a string as shorthand.
			else if (this.connector.constructor == Array)
				this.connector = new jsPlumb.Connectors[this.connector[0]](this.connector[1]);
			this.paintStyle = this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || _currentInstance.Defaults.PaintStyle || jsPlumb.Defaults.PaintStyle;
			var backgroundPaintStyle = this.endpoints[0].connectorBackgroundStyle || this.endpoints[1].connectorBackgroundStyle || params.backgroundPaintStyle || _currentInstance.Defaults.BackgroundPaintStyle || jsPlumb.Defaults.BackgroundPaintStyle;
			this.hoverPaintStyle = this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || _currentInstance.Defaults.HoverPaintStyle || jsPlumb.Defaults.HoverPaintStyle;
			this.paintStyleInUse = this.paintStyle;
			
			/*
			 * Property: overlays
			 * List of Overlays for this Connection.
			 */
			this.overlays = [];
			if (params.overlays) {
				for (var i = 0; i < params.overlays.length; i++) {
					var o = params.overlays[i];
					if (o.constructor == Array) {	// this is for the shorthand ["Arrow", { width:50 }] syntax
						// there's also a three arg version:
						// ["Arrow", { width:50 }, {location:0.7}] 
						// which merges the 3rd arg into the 2nd.
						var type = o[0];
						var p = jsPlumb.CurrentLibrary.extend({connection:self}, o[1]);			// make a copy of the object so as not to mess up anyone else's reference...
						if (o.length == 3) jsPlumb.CurrentLibrary.extend(p, o[2]);
						this.overlays.push(new jsPlumb.Overlays[type](p));
					} else if (o.constructor == String) {
						this.overlays.push(new jsPlumb.Overlays[o]({connection:self}));
					}
					else this.overlays.push(o);
				}
			}
			var overlayPlacements = [];
			/*
			 * Function: addOverlay
			 * Adds an Overlay to the Connection.
			 * 
			 * Parameters:
			 * 	overlay - Overlay to add.
			 */
			this.addOverlay = function(overlay) { overlays.push(overlay); };

			// this is a shortcut helper method to let people add a label as
			// overlay.
			this.labelStyle = params.labelStyle || _currentInstance.Defaults.LabelStyle || jsPlumb.Defaults.LabelStyle;
			this.label = params.label;
			if (this.label) {
				this.overlays.push(new jsPlumb.Overlays.Label( {
					labelStyle : this.labelStyle,
					label : this.label,
					connection:self
				}));
			}

			_updateOffset( { elId : this.sourceId });
			_updateOffset( { elId : this.targetId });

			/*
			 * Function: setLabel
			 * Sets the Connection's label.  
			 * 
			 * Parameters:
			 * 	l	- label to set. May be a String or a Function that returns a String.
			 */
			this.setLabel = function(l) {
				self.label = l;
				_currentInstance.repaint(self.source);
			};

			// paint the endpoints
			var myOffset = offsets[this.sourceId], myWH = sizes[this.sourceId];
			var otherOffset = offsets[this.targetId];
			var otherWH = sizes[this.targetId];
			var anchorLoc = this.endpoints[0].anchor.compute( {
				xy : [ myOffset.left, myOffset.top ], wh : myWH, element : this.endpoints[0],
				txy : [ otherOffset.left, otherOffset.top ], twh : otherWH, tElement : this.endpoints[1]
			});
			this.endpoints[0].paint( { anchorLoc : anchorLoc });

			anchorLoc = this.endpoints[1].anchor.compute( {
				xy : [ otherOffset.left, otherOffset.top ], wh : otherWH, element : this.endpoints[1],
				txy : [ myOffset.left, myOffset.top ], twh : myWH, tElement : this.endpoints[0]
			});
			this.endpoints[1].paint({ anchorLoc : anchorLoc });

			var canvas = _newCanvas({"class":jsPlumb.connectorClass, container:self.container});
			this.canvas = canvas;			
		    		    
		    /*
		     * Function: setBackgroundPaintStyle
		     * Sets the Connection's background paint style and then repaints the Connection.
		     * 
		     * Parameters:
		     * 	style - Style to use.
		     */
		    this.setBackgroundPaintStyle = function(style) {
		    	backgroundPaintStyle = style;
		    	self.repaint();
		    };		    		    
		    
			/*
			 * Paints the connection. 
			 * 
			 * 	elId - Id of the element that is in motion.
			 * 	ui - current library's event system ui object (present if we came from a drag to get here).
			 *  recalc - whether or not to recalculate all anchors etc before painting. 
			 *  timestamp - timestamp of this paint.  If the Connection was last painted with the same timestamp, it does not paint again.
			 */
			this.paint = function(params) {
				params = params || {};
				var elId = params.elId, ui = params.ui, recalc = params.recalc, timestamp = params.timestamp;
				var fai = self.floatingAnchorIndex;
				// if the moving object is not the source we must transpose the two references.
				var swap = false;
				var tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId;
				var tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;
				var el = swap ? this.target : this.source;

				if (this.canvas.getContext) {
					_updateOffset( { elId : elId, offset : ui, recalc : recalc, timestamp : timestamp });
					_updateOffset( { elId : tId, timestamp : timestamp }); // update the target if this is a forced repaint. otherwise, only the source has been moved.
				    var ctx = canvas.getContext('2d');
					var sAnchorP = this.endpoints[sIdx].anchor.getCurrentLocation();					
					var sAnchorO = this.endpoints[sIdx].anchor.getOrientation();
					var tAnchorP = this.endpoints[tIdx].anchor.getCurrentLocation();
					var tAnchorO = this.endpoints[tIdx].anchor.getOrientation();
					
					// paint overlays
					var maxSize = 0;
					for ( var i = 0; i < self.overlays.length; i++) {
						var o = self.overlays[i];
						var s = o.computeMaxSize(self.connector, ctx);
						if (s > maxSize)
							maxSize = s;
					}

					var dim = this.connector.compute(sAnchorP, tAnchorP, this.endpoints[sIdx].anchor, this.endpoints[tIdx].anchor, self.paintStyleInUse.lineWidth, maxSize);
					jsPlumb.sizeCanvas(canvas, dim[0], dim[1], dim[2], dim[3]);

					var _paintOneStyle = function(ctx, aStyle) {
						ctx.save();
						jsPlumb.extend(ctx, aStyle);
						if (aStyle.gradient && !ie) {
							var g = self.connector.createGradient(dim, ctx, (elId == this.sourceId));
							for ( var i = 0; i < aStyle.gradient.stops.length; i++)
								g.addColorStop(aStyle.gradient.stops[i][0], aStyle.gradient.stops[i][1]);
							ctx.strokeStyle = g;
						}
						self.connector.paint(dim, ctx);
						ctx.restore();
					};

					// first check for the background style
					if (backgroundPaintStyle != null) {
						_paintOneStyle(ctx, backgroundPaintStyle);
					}
					_paintOneStyle(ctx, self.paintStyleInUse);

					// paint overlays
					for ( var i = 0; i < self.overlays.length; i++) {
						var o = self.overlays[i];
						self.overlayPlacements[i] = o.draw(self.connector, ctx, self.paintStyleInUse);
					}
				}
			};

			/*
			 * Function: repaint
			 * Repaints the Connection.
			 */
			this.repaint = function() {
				this.paint({ elId : this.sourceId, recalc : true });
			};

			_initDraggableIfNecessary(self.source, params.draggable, params.dragOptions);
			_initDraggableIfNecessary(self.target, params.draggable, params.dragOptions);

			// resizing (using the jquery.ba-resize plugin). todo: decide
			// whether to include or not.
			if (this.source.resize) {
				this.source.resize(function(e) {
					jsPlumb.repaint(self.sourceId);
				});
			}
			
			//_registerConnection(self);
		};

		/*
		 * Class: Endpoint 
		 * 
		 * Models an endpoint. Can have one to N connections emanating from it (although how to handle that in the UI is a very good question). also has a Canvas and paint style.
		 */

		/*
		 * Function: Endpoint 
		 * 
		 * Endpoint constructor.
		 * 
		 * Parameters: 
		 * anchor - definition of the Anchor for the endpoint.  You can include one or more Anchor definitions here; if you include more than one, jsPlumb creates a 'dynamic' Anchor, ie. an Anchor which changes position relative to the other elements in a Connection.  Each Anchor definition can be either a string nominating one of the basic Anchors provided by jsPlumb (eg. "TopCenter"), or a four element array that designates the Anchor's location and orientation (eg, and this is equivalent to TopCenter, [ 0.5, 0, 0, -1 ]).  To provide more than one Anchor definition just put them all in an array. You can mix string definitions with array definitions.
		 * endpoint - optional Endpoint definition. This takes the form of either a string nominating one of the basic Endpoints provided by jsPlumb (eg. "Rectangle"), or an array containing [name,params] for those cases where you don't wish to use the default values, eg. [ "Rectangle", { width:5, height:10 } ].
		 * paintStyle - endpoint style, a js object. may be null. 
		 * hoverPaintStyle - style to use when the mouse is hovering over the Endpoint. A js object. may be null; defaults to null. 
		 * source - element the Endpoint is attached to, of type String (an element id) or element selector. Required.
		 * canvas - canvas element to use. may be, and most often is, null.
		 * connections - optional list of Connections to configure the Endpoint with. 
		 * container - optional element (as a string id) to use as the container for the canvas associated with this Endpoint.  If not supplied, jsPlumb uses the default, which is the document body.  A better way to use this container functionality is to set it on the defaults (jsPlumb.Defaults.Container="someElement").
		 * isSource - boolean. indicates the endpoint can act as a source of new connections. Optional; defaults to false.
		 * maxConnections - integer; defaults to 1.  a value of -1 means no upper limit. 
		 * dragOptions - if isSource is set to true, you can supply arguments for the underlying library's drag method. Optional; defaults to null. 
		 * connectorStyle - if isSource is set to true, this is the paint style for Connections from this Endpoint. Optional; defaults to null.
		 * connectorBackgroundStyle - if isSource is set to true, this is the background paint style for Connections from this Endpoint. Optional; defaults to null. 
		 * connectorHoverStyle - if isSource is set to true, this is the hover paint style for Connections from this Endpoint. Optional; defaults to null.
		 * connector - optional Connector type to use.  Like 'endpoint', this may be either a single string nominating a known Connector type (eg. "Bezier", "Straight"), or an array containing [name, params], eg. [ "Bezier", 160 ].
		 * connectorOverlays - optional array of Overlay definitions that will be applied to any Connection from this Endpoint. 
		 * isTarget - boolean. indicates the endpoint can act as a target of new connections. Optional; defaults to false.
		 * dropOptions - if isTarget is set to true, you can supply arguments for the underlying library's drop method with this parameter. Optional; defaults to null. 
		 * reattach - optional boolean that determines whether or not the Connections reattach after they have been dragged off an Endpoint and left floating. defaults to false: Connections dropped in this way will just be deleted.
		 */
		var Endpoint = function(params) {
			EventGenerator.apply(this);
			params = params || {};
			var self = this;
			var visible = true;
			/*
				Function: isVisible
				Returns whether or not the Endpoint is currently visible.
			*/
			this.isVisible = function() { return visible; };
			/*
				Function: setVisible
				Sets whether or not the Endpoint is currently visible.

				Parameters:
					visible - whether or not the Endpoint should be visible.
					doNotChangeConnections - Instructs jsPlumb to not pass the visible state on to any attached Connections. defaults to false.
					doNotNotifyOtherEndpoint - Instructs jsPlumb to not pass the visible state on to Endpoints at the other end of any attached Connections. defaults to false. 
			*/
			this.setVisible = function(v, doNotChangeConnections, doNotNotifyOtherEndpoint) {
				visible = v;
				if (self.canvas) self.canvas.style.display = v ? "block" : "none";
				if (!doNotChangeConnections) {
					for (var i = 0; i < self.connections.length; i++) {
						self.connections[i].setVisible(v);
						if (!doNotNotifyOtherEndpoint) {
							var oIdx = self === self.connections[i].endpoints[0] ? 1 : 0;
							// only change the other endpoint if this is its only connection.
							if (self.connections[i].endpoints[oIdx].connections.length == 1) self.connections[i].endpoints[oIdx].setVisible(v, true, true);
						}
					}
				}
			};
			var id = new String('_jsplumb_e_' + (new Date()).getTime());
			this.getId = function() { return id; };
			if (params.dynamicAnchors)
				self.anchor = new DynamicAnchor(jsPlumb.makeAnchors(params.dynamicAnchors));
			else 			
				self.anchor = params.anchor ? jsPlumb.makeAnchor(params.anchor) : params.anchors ? jsPlumb.makeAnchor(params.anchors) : jsPlumb.makeAnchor("TopCenter");
			var _endpoint = params.endpoint || new jsPlumb.Endpoints.Dot();
			if (_endpoint.constructor == String) 
				_endpoint = new jsPlumb.Endpoints[_endpoint]();
			else if (_endpoint.constructor == Array)
				_endpoint = new jsPlumb.Endpoints[_endpoint[0]](_endpoint[1]);
			self.endpoint = _endpoint;
			this.paintStyle = params.paintStyle || params.style || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
			this.hoverPaintStyle = params.hoverPaintStyle || _currentInstance.Defaults.EndpointHoverStyle || jsPlumb.Defaults.EndpointHoverStyle;
			this.paintStyleInUse = this.paintStyle;
			this.connectorStyle = params.connectorStyle;
			this.connectorBackgroundStyle = params.connectorBackgroundStyle;
			this.connectorHoverStyle = params.connectorHoverStyle;
			this.connectorOverlays = params.connectorOverlays;
			this.connector = params.connector;
			this.isSource = params.isSource || false;
			this.isTarget = params.isTarget || false;
			var _element = params.source, _uuid = params.uuid;
			var floatingEndpoint = null, inPlaceCopy = null;
			if (_uuid) endpointsByUUID[_uuid] = self;
			this.container = params.container || _currentInstance.Defaults.Container || jsPlumb.Defaults.Container;
			var _elementId = _getAttribute(_element, "id");
			this.elementId = _elementId;
			var _maxConnections = params.maxConnections || 1; // maximum number of connections this endpoint can be the source of.
						
			this.getAttachedElements = function() {
				return self.connections;
			};
			
			/*
			 * Property: canvas
			 * The Endpoint's Canvas.
			 */
			this.canvas = params.canvas || _newCanvas({"class":jsPlumb.endpointClass, container:this.container, uuid:params.uuid});
			/*
			 * Property: connections
			 * List of Connections this Endpoint is attached to.
			 */
			this.connections = params.connections || [];
			/*
			 * Property: scope
			 * Scope descriptor for this Endpoint.
			 */
			this.scope = params.scope || DEFAULT_SCOPE;
			this.timestamp = null;
			var _reattach = params.reattach || false;
			var dragAllowedWhenFull = params.dragAllowedWhenFull || true;

			this.computeAnchor = function(params) {
				return self.anchor.compute(params);
			};
			/*
			 * Function: addConnection
			 *   Adds a Connection to this Endpoint.
			 *   
			 * Parameters:
			 *   connection - the Connection to add.
			 */
			this.addConnection = function(connection) {
				self.connections.push(connection);
			};			
			/*
			 * Function: detach
			 *   Detaches the given Connection from this Endpoint.
			 *   
			 * Parameters:
			 *   connection - the Connection to detach.
			 *   ignoreTarget - optional; tells the Endpoint to not notify the Connection target that the Connection was detached.  The default behaviour is to notify the target.
			 */
			this.detach = function(connection, ignoreTarget) {
				var idx = _findIndex(self.connections, connection);
				if (idx >= 0) {					
					self.connections.splice(idx, 1);
					// this avoids a circular loop
					if (!ignoreTarget) {
						var t = connection.endpoints[0] == self ? connection.endpoints[1] : connection.endpoints[0];
						t.detach(connection, true);
					}
					_removeElement(connection.canvas, connection.container);
					_removeFromList(connectionsByScope, connection.scope, connection);
					if(!ignoreTarget) fireDetachEvent(connection);
				}
			};			

			/*
			 * Function: detachAll
			 *   Detaches all Connections this Endpoint has.
			 */
			this.detachAll = function() {
				while (self.connections.length > 0) {
					self.detach(self.connections[0]);
				}
			};
			/*
			 * Function: detachFrom
			 *   Removes any connections from this Endpoint that are connected to the given target endpoint.
			 *   
			 * Parameters:
			 *   targetEndpoint - Endpoint from which to detach all Connections from this Endpoint.
			 */
			this.detachFrom = function(targetEndpoint) {
				var c = [];
				for ( var i = 0; i < self.connections.length; i++) {
					if (self.connections[i].endpoints[1] == targetEndpoint
							|| self.connections[i].endpoints[0] == targetEndpoint) {
						c.push(self.connections[i]);
					}
				}
				for ( var i = 0; i < c.length; i++) {
					c[i].setHover(false);
					self.detach(c[i]);
				}
			};			
			/*
			 * Function: detachFromConnection
			 *   Detach this Endpoint from the Connection, but leave the Connection alive. Used when dragging.
			 *   
			 * Parameters:
			 *   connection - Connection to detach from.
			 */
			this.detachFromConnection = function(connection) {
				var idx = _findIndex(self.connections, connection);
				if (idx >= 0) {
					self.connections.splice(idx, 1);
				}
			};

			/*
			 * Function: getElement
			 *   Returns the DOM element this Endpoint is attached to.
			 */
			this.getElement = function() {
				return _element;
			};						

			/*
			 * Function: getUuid
			 *   Returns the UUID for this Endpoint, if there is one. Otherwise returns null.
			 */
			this.getUuid = function() {
				return _uuid;
			};
			/**
			 * private but must be exposed.
			 */
			this.makeInPlaceCopy = function() {
				var e = _newEndpoint( { anchor : self.anchor, source : _element, paintStyle : this.paintStyle, endpoint : _endpoint });
				return e;
			};
			/*
			 * Function: isConnectedTo
			 *   Returns whether or not this endpoint is connected to the given Endpoint.
			 *   
			 * Parameters:
			 *   endpoint - Endpoint to test.
			 */
			this.isConnectedTo = function(endpoint) {
				var found = false;
				if (endpoint) {
					for ( var i = 0; i < self.connections.length; i++) {
						if (self.connections[i].endpoints[1] == endpoint) {
							found = true;
							break;
						}
					}
				}
				return found;
			};

			/**
			 * private but needs to be exposed.
			 */
			this.isFloating = function() {
				return floatingEndpoint != null;
			};
			
			/**
			 * returns a connection from the pool; used when dragging starts.  just gets the head of the array if it can.
			 */
			this.connectorSelector = function() {
				return (self.connections.length < _maxConnections) ? null : self.connections[0];
			};

			/*
			 * Function: isFull
			 *   Returns whether or not the Endpoint can accept any more Connections.
			 */
			this.isFull = function() {
				return _maxConnections < 1 ? false : (self.connections.length >= _maxConnections);
			};
			/*
			 * Function: setDragAllowedWhenFull
			 *   Sets whether or not connections can be dragged from this Endpoint once it is full. You would use this in a UI in 
			 *   which you're going to provide some other way of breaking connections, if you need to break them at all. This property 
			 *   is by default true; use it in conjunction with the 'reattach' option on a connect call.
			 *   
			 * Parameters:
			 *   allowed - whether drag is allowed or not when the Endpoint is full.
			 */
			this.setDragAllowedWhenFull = function(allowed) {
				dragAllowedWhenFull = allowed;
			};

			/*
			*	Function: setPaintStyle
			*	Sets the paint style of the Endpoint.  This is a JS object of the same form you supply to a jsPlumb.addEndpoint or jsPlumb.connect call.
			*
			*	Parameters:
			*   style - Style object to set, for example {fillStyle:"blue"}.
			*/
			this.setPaintStyle = this.setPaintStyle;  // i do this so NaturalDocs can pick up the function definition.

			/*
			*	Function: setHoverPaintStyle
			*	Sets the hover paint style of the Endpoint.  This is a JS object of the same form you supply to a jsPlumb.addEndpoint or jsPlumb.connect call.
			*
			*	Parameters:
			*   style - Style object to set, for example { fillStyle:"yellow" }.
			*/
			this.setHoverPaintStyle = this.setHoverPaintStyle;  // i do this so NaturalDocs can pick up the function definition.

			/*
			 *   Sets the paint style of the Endpoint.  
			 *  @deprecated use setPaintStyle instead.
			 */
			this.setStyle = self.setPaintStyle;

			/**
			 * a deep equals check. everything must match, including the anchor,
			 * styles, everything. TODO: finish Endpoint.equals
			 */
			this.equals = function(endpoint) {
				return this.anchor.equals(endpoint.anchor);
			};

			/*
			 * 
			 *   Paints the Endpoint, recalculating offset and anchor positions if necessary.
			 *   
			 * Parameters:
			 *   timestamp - optional timestamp advising the Endpoint of the current paint time; if it has painted already once for this timestamp, it will not paint again.
			 *   canvas - optional Canvas to paint on.  Only used internally by jsPlumb in certain obscure situations.
			 *   connectorPaintStyle - paint style of the Connector attached to this Endpoint. Used to get a fillStyle if nothing else was supplied.
			 */
			this.paint = function(params) {

				params = params || {};
				var timestamp = params.timestamp;
				if (!timestamp || self.timestamp !== timestamp) {
					var ap = params.anchorPoint, canvas = params.canvas, connectorPaintStyle = params.connectorPaintStyle;
					if (ap == null) {
						// do we always want to force a repaint here? i dont
						// think so!
						var xy = params.offset || offsets[_elementId];
						var wh = params.dimensions || sizes[_elementId];
						if (xy == null || wh == null) {
							_updateOffset( { elId : _elementId, timestamp : timestamp });
							xy = offsets[_elementId];
							wh = sizes[_elementId];
						}
						var anchorParams = { xy : [ xy.left, xy.top ], wh : wh, element : self, timestamp : timestamp };
						if (self.anchor.isDynamic) {
							if (self.connections.length > 0) {
								var c = self.connections[0];
								var oIdx = c.endpoints[0] == self ? 1 : 0;
								var oId = oIdx == 0 ? c.sourceId : c.targetId;
								var oOffset = offsets[oId], oWH = sizes[oId];
								anchorParams.txy = [ oOffset.left, oOffset.top ];
								anchorParams.twh = oWH;
								anchorParams.tElement = c.endpoints[oIdx];
							}
						}
						ap = self.anchor.compute(anchorParams);
					}
					_endpoint.paint(ap, self.anchor.getOrientation(), canvas || self.canvas, self.paintStyleInUse, connectorPaintStyle || self.paintStyleInUse);
					self.timestamp = timestamp;
				}
			};
			
			this.repaint = this.paint;

			/**
			 * @deprecated
			 */
			this.removeConnection = this.detach; // backwards compatibility

			// is this a connection source? we make it draggable and have the
			// drag listener maintain a connection with a floating endpoint.
			if (params.isSource && jsPlumb.CurrentLibrary.isDragSupported(_element)) {
				var n = null, id = null, jpc = null, existingJpc = false, existingJpcParams = null;
				var start = function() {
					jpc = self.connectorSelector();
					if (self.isFull() && !dragAllowedWhenFull) return false;
					_updateOffset( { elId : _elementId });
					inPlaceCopy = self.makeInPlaceCopy();
					inPlaceCopy.paint();										
					
					n = document.createElement("div");
					var nE = _getElementObject(n);
					_appendElement(n, self.container); //
					// create and assign an id, and initialize the offset.
					var id = _getId(nE);
					_updateOffset( { elId : id });
					// store the id of the dragging div and the source element. the drop function will pick these up.
					_setAttribute(_getElementObject(self.canvas), "dragId", id);
					_setAttribute(_getElementObject(self.canvas), "elId", _elementId);
					// create a floating anchor
					var floatingAnchor = new FloatingAnchor( { reference : self.anchor, referenceCanvas : self.canvas });
					floatingEndpoint = _newEndpoint({ paintStyle : { fillStyle : 'rgba(0,0,0,0)' }, endpoint : _endpoint, anchor : floatingAnchor, source : nE });

					if (jpc == null) {                                                                                                                                                         
						self.anchor.locked = true;
						// create a connection. one end is this endpoint, the
						// other is a floating endpoint.
						jpc = _newConnection({
							sourceEndpoint : self,
							targetEndpoint : floatingEndpoint,
							source : _getElementObject(_element),
							target : _getElementObject(n),
							anchors : [ self.anchor, floatingAnchor ],
							paintStyle : params.connectorStyle, // this can be null. Connection will use the default.
							hoverPaintStyle:params.connectorHoverStyle,
							backgroundPaintStyle:params.connectorBackgroundStyle,
							connector : params.connector, // this can also be null. Connection will use the default.
							overlays : params.connectorOverlays 
						});
						// TODO determine whether or not we wish to do de-select hover when dragging a connection.
						// it may be the case that we actually want to set it, since it provides a good
						// visual cue.
						jpc.setHover(false);
					} else {
						existingJpc = true;
						// TODO determine whether or not we wish to do de-select hover when dragging a connection.
						// it may be the case that we actually want to set it, since it provides a good
						// visual cue.
						jpc.setHover(false);
						// if existing connection, allow to be dropped back on the source endpoint (issue 51).
						_initDropTarget(_getElementObject(inPlaceCopy.canvas));						
						var anchorIdx = jpc.sourceId == _elementId ? 0 : 1;  	// are we the source or the target?						
						jpc.floatingAnchorIndex = anchorIdx;					// save our anchor index as the connection's floating index.						
						self.detachFromConnection(jpc);							// detach from the connection while dragging is occurring.
						
						// store the original scope (issue 57)
						var c = _getElementObject(self.canvas);
						var dragScope = jsPlumb.CurrentLibrary.getDragScope(c);
						_setAttribute(c, "originalScope", dragScope);
						// get a new, temporary scope, to use (issue 57)
						var newScope = "scope_" + (new Date()).getTime();

						// now we replace ourselves with the temporary div we created above:
						if (anchorIdx == 0) {
							existingJpcParams = [ jpc.source, jpc.sourceId, i, dragScope ];
							jpc.source = _getElementObject(n);
							jpc.sourceId = id;
						} else {
							existingJpcParams = [ jpc.target, jpc.targetId, i, dragScope ];
							jpc.target = _getElementObject(n);
							jpc.targetId = id;
						}
						// set the new, temporary scope (issue 57)
						jsPlumb.CurrentLibrary.setDragScope(i, newScope);
						// lock the other endpoint; if it is dynamic it will not move while the drag is occurring.
						jpc.endpoints[anchorIdx == 0 ? 1 : 0].anchor.locked = true;
						// store the original endpoint and assign the new floating endpoint for the drag.
						jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];
						jpc.endpoints[anchorIdx] = floatingEndpoint;
					}

					// register it.
					floatingConnections[id] = jpc;

					// TODO unregister on stop? or will floating endpoint's
					// destruction be assured.
					floatingEndpoint.addConnection(jpc);

					// only register for the target endpoint; we will not be
					// dragging the source at any time
					// before this connection is either discarded or made into a
					// permanent connection.
					_addToList(endpointsByElement, id, floatingEndpoint);
					
					// tell jsplumb about it
					_currentInstance.currentlyDragging = true;
				};

				var dragOptions = params.dragOptions || {};
				var defaultOpts = jsPlumb.extend( {}, jsPlumb.CurrentLibrary.defaultDragOptions);
				dragOptions = jsPlumb.extend(defaultOpts, dragOptions);
				dragOptions.scope = dragOptions.scope || self.scope;
				var startEvent = jsPlumb.CurrentLibrary.dragEvents['start'];
				var stopEvent = jsPlumb.CurrentLibrary.dragEvents['stop'];
				var dragEvent = jsPlumb.CurrentLibrary.dragEvents['drag'];
				dragOptions[startEvent] = _wrap(dragOptions[startEvent], start);
				dragOptions[dragEvent] = _wrap(dragOptions[dragEvent],
					function() {
						var _ui = jsPlumb.CurrentLibrary.getUIPosition(arguments);
						jsPlumb.CurrentLibrary.setOffset(n, _ui);
						_draw(_getElementObject(n), _ui);
					});
				dragOptions[stopEvent] = _wrap(dragOptions[stopEvent],
					function() {
						_removeFromList(endpointsByElement, id, floatingEndpoint);
						_removeElements( [ n, floatingEndpoint.canvas ], _element); // TODO: clean up the connection canvas (if the user aborted)
						_removeElement(inPlaceCopy.canvas, _element);
						var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
						jpc.endpoints[idx == 0 ? 1 : 0].anchor.locked = false;
						if (jpc.endpoints[idx] == floatingEndpoint) {
							// if the connection was an existing one:
							if (existingJpc && jpc.suspendedEndpoint) {
								// fix for issue35, thanks Sylvain Gizard: when firing the detach event make sure the
								// floating endpoint has been replaced.
								if (idx == 0) {
									jpc.source = existingJpcParams[0];
									jpc.sourceId = existingJpcParams[1];
								} else {
									jpc.target = existingJpcParams[0];
									jpc.targetId = existingJpcParams[1];
								}
								
								// restore the original scope (issue 57)
								jsPlumb.CurrentLibrary.setDragScope(existingJpcParams[2], existingJpcParams[3]);
								
								jpc.endpoints[idx] = jpc.suspendedEndpoint;
								if (_reattach) {
									jpc.floatingAnchorIndex = null;
									jpc.suspendedEndpoint.addConnection(jpc);
									jsPlumb.repaint(existingJpcParams[1]);
								} else {
									jpc.endpoints[idx == 0 ? 1 : 0].detach(jpc); // the main endpoint will inform the floating endpoint
									// to disconnect, and also post the detached event.
								}
							} else {
								// TODO this looks suspiciously kind of like an Endpoint.detach call too.
								// i wonder if this one should post an event though.  maybe this is good like this.
								_removeElement(jpc.canvas, self.container);
								self.detachFromConnection(jpc);								
							}																
						}
						self.anchor.locked = false;												
						self.paint();
						jpc.repaint();
						jpc = null;						
						delete inPlaceCopy;							
						delete endpointsByElement[floatingEndpoint.elementId];						
						delete floatingEndpoint;
						
						_currentInstance.currentlyDragging = false;
					});
				
				var i = _getElementObject(self.canvas);				
				jsPlumb.CurrentLibrary.initDraggable(i, dragOptions);
			}

			// pulled this out into a function so we can reuse it for the inPlaceCopy canvas; you can now drop detached connections
			// back onto the endpoint you detached it from.
			var _initDropTarget = function(canvas) {
				if (params.isTarget && jsPlumb.CurrentLibrary.isDropSupported(_element)) {
					var dropOptions = params.dropOptions || _currentInstance.Defaults.DropOptions || jsPlumb.Defaults.DropOptions;
					dropOptions = jsPlumb.extend( {}, dropOptions);
					dropOptions.scope = dropOptions.scope || self.scope;
					var originalAnchor = null;
					var dropEvent = jsPlumb.CurrentLibrary.dragEvents['drop'];
					var overEvent = jsPlumb.CurrentLibrary.dragEvents['over'];
					var outEvent = jsPlumb.CurrentLibrary.dragEvents['out'];				
					var drop = function() {
						var draggable = _getElementObject(jsPlumb.CurrentLibrary.getDragObject(arguments));
						var id = _getAttribute(draggable, "dragId");
						var elId = _getAttribute(draggable, "elId");
						
						// restore the original scope if necessary (issue 57)
						var scope = _getAttribute(draggable, "originalScope");
						if (scope) jsPlumb.CurrentLibrary.setDragScope(draggable, scope);
							
						var jpc = floatingConnections[id];
						var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex, oidx = idx == 0 ? 1 : 0;
						if (!self.isFull() && !(idx == 0 && !self.isSource) && !(idx == 1 && !self.isTarget)) {
							if (idx == 0) {
								jpc.source = _element;
								jpc.sourceId = _elementId;
							} else {
								jpc.target = _element;
								jpc.targetId = _elementId;
							}
							// todo test that the target is not full.
							// remove this jpc from the current endpoint
							jpc.endpoints[idx].detachFromConnection(jpc);
							if (jpc.suspendedEndpoint) jpc.suspendedEndpoint.detachFromConnection(jpc);
							jpc.endpoints[idx] = self;
							self.addConnection(jpc);
							if (!jpc.suspendedEndpoint) {  // if a new connection, add it. TODO: move this to a jsPlumb internal method - addConnection or something. doesnt need to be exposed.
								_addToList(connectionsByScope, jpc.scope, jpc);
								_initDraggableIfNecessary(_element, params.draggable, {});
							}
							else {
								var suspendedElement = jpc.suspendedEndpoint.getElement(), suspendedElementId = jpc.suspendedEndpoint.elementId;
								// fire a detach event
								_currentInstance.fireUpdate("jsPlumbConnectionDetached", {
									source : idx == 0 ? suspendedElement : jpc.source, 
									target : idx == 1 ? suspendedElement : jpc.target,
									sourceId : idx == 0 ? suspendedElementId : jpc.sourceId, 
									targetId : idx == 1 ? suspendedElementId : jpc.targetId,
									sourceEndpoint : idx == 0 ? jpc.suspendedEndpoint : jpc.endpoints[0], 
									targetEndpoint : idx == 1 ? jpc.suspendedEndpoint : jpc.endpoints[1],
									connection : jpc
								});
							}
							
							jsPlumb.repaint(elId);
							
							_currentInstance.fireUpdate("jsPlumbConnection", {
								source : jpc.source, target : jpc.target,
								sourceId : jpc.sourceId, targetId : jpc.targetId,
								sourceEndpoint : jpc.endpoints[0], 
								targetEndpoint : jpc.endpoints[1],
								connection:jpc
							});														
						}
			
						_currentInstance.currentlyDragging = false;
						delete floatingConnections[id];						
					};
					
					dropOptions[dropEvent] = _wrap(dropOptions[dropEvent], drop);
					dropOptions[overEvent] = _wrap(dropOptions[overEvent],
							function() {
								var draggable = jsPlumb.CurrentLibrary.getDragObject(arguments);
								var id = _getAttribute( _getElementObject(draggable), "dragId");
								var jpc = floatingConnections[id];
								var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
								jpc.endpoints[idx].anchor.over(self.anchor);
							});
	
					dropOptions[outEvent] = _wrap(dropOptions[outEvent],
							function() {
								var draggable = jsPlumb.CurrentLibrary.getDragObject(arguments);
								var id = _getAttribute(_getElementObject(draggable), "dragId");
								var jpc = floatingConnections[id];
								var idx = jpc.floatingAnchorIndex == null ? 1 : jpc.floatingAnchorIndex;
								jpc.endpoints[idx].anchor.out();
							});
	
					jsPlumb.CurrentLibrary.initDroppable(canvas, dropOptions);
				}
			};
			
			// initialise the endpoint's canvas as a drop target.  this will be ignored if the endpoint is not a target or drag is not supported.
			_initDropTarget(_getElementObject(self.canvas));			

			return self;
		};					
	};

	var jsPlumb = window.jsPlumb = new jsPlumbInstance();
	jsPlumb.getInstance = function(_defaults) {
		var j = new jsPlumbInstance(_defaults);
		//if (_defaults) jsPlumb.extend(j.Defaults, _defaults);
		return j;
	};
})();
/*
* jsPlumb-defaults-1.2.6-RC1
*
* This script contains the default Anchors, Endpoints, Connectors and Overlays for jsPlumb.  It should be used with jsPlumb 1.1.0 and above; 
* prior to version 1.1.0 of jsPlumb the defaults were included inside the main script.
*
* NOTE: for production usage you should use jsPlumb-all-x.x.x-min.js, which contains the main jsPlumb script and this script together,
* in a minified file.
* 
* Dual licensed under MIT and GPL2.
*/

(function() {
	
	var ie = !!!document.createElement('canvas').getContext;

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
	var _curryAnchor = function(x,y,ox,oy) {
		return function() {
			return jsPlumb.makeAnchor(x,y,ox,oy);
		};
	};
	jsPlumb.Anchors["TopCenter"] 		= _curryAnchor(0.5, 0, 0,-1);
	jsPlumb.Anchors["BottomCenter"] 	= _curryAnchor(0.5, 1, 0, 1);
	jsPlumb.Anchors["LeftMiddle"] 		= _curryAnchor(0, 0.5, -1, 0);
	jsPlumb.Anchors["RightMiddle"] 	= _curryAnchor(1, 0.5, 1, 0);
	jsPlumb.Anchors["Center"] 			= _curryAnchor(0.5, 0.5, 0, 0);
	jsPlumb.Anchors["TopRight"] 		= _curryAnchor(1, 0, 0,-1);
	jsPlumb.Anchors["BottomRight"] 	= _curryAnchor(1, 1, 0, 1);
	jsPlumb.Anchors["TopLeft"] 		= _curryAnchor(0, 0, 0, -1);
	jsPlumb.Anchors["BottomLeft"] 		= _curryAnchor(0, 1, 0, 1);
	
	
	jsPlumb.Defaults.DynamicAnchors = function() {
		return jsPlumb.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"]);
	};
	jsPlumb.Anchors["AutoDefault"]  = function() { return jsPlumb.makeDynamicAnchor(jsPlumb.Defaults.DynamicAnchors()); };
	                                   
        /**
         * The Straight connector draws a simple straight line between the two anchor points.
         */
    jsPlumb.Connectors.Straight = function() {
	 
		var self = this;
		var currentPoints = null;
		var _m, _m2, _b, _dx, _dy, _theta, _theta2, _sx, _sy, _tx, _ty;

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
        this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth, minWidth) {
        	var w = Math.abs(sourcePos[0] - targetPos[0]);
            var h = Math.abs(sourcePos[1] - targetPos[1]);
            var widthAdjusted = false, heightAdjusted = false;
            // these are padding to ensure the whole connector line appears
            var xo = 0.45 * w, yo = 0.45 * h;
            // these are padding to ensure the whole connector line appears
            w *= 1.9; h *=1.9;
            
            var x = Math.min(sourcePos[0], targetPos[0]) - xo;
            var y = Math.min(sourcePos[1], targetPos[1]) - yo;
            
            // minimum size is 2 * line Width if minWidth was not given.
            var calculatedMinWidth = Math.max(2 * lineWidth, minWidth);
            
            if (w < calculatedMinWidth) { 
        		w = calculatedMinWidth; 
        		x = sourcePos[0]  + ((targetPos[0] - sourcePos[0]) / 2) - (calculatedMinWidth / 2);
        		xo = (w - Math.abs(sourcePos[0]-targetPos[0])) / 2;
        	}
            if (h < calculatedMinWidth) { 
        		
        		h = calculatedMinWidth; 
        		y = sourcePos[1]  + ((targetPos[1] - sourcePos[1]) / 2) - (calculatedMinWidth / 2);
        		yo = (h - Math.abs(sourcePos[1]-targetPos[1])) / 2;
        	}
                            
            _sx = sourcePos[0] < targetPos[0] ?  xo : w-xo;
            _sy = sourcePos[1] < targetPos[1] ? yo:h-yo;
            _tx = sourcePos[0] < targetPos[0] ? w-xo : xo;
            _ty = sourcePos[1] < targetPos[1] ? h-yo : yo;
            currentPoints = [ x, y, w, h, _sx, _sy, _tx, _ty ];            
            
            _dx = _tx - _sx, _dy = (_ty - _sy);
			_m = _dy / _dx, _m2 = -1 / _m;
			
			_b = -1 * ((_m * _sx) - _sy);
			_theta = Math.atan(_m); _theta2 = Math.atan(_m2);
                             
            return currentPoints;
        };

        this.paint = function(dimensions, ctx)
        {
            ctx.beginPath();
            ctx.moveTo(dimensions[4], dimensions[5]);
            ctx.lineTo(dimensions[6], dimensions[7]);
            ctx.stroke();            
        };        
        
        /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for the straight line connector this is simple maths.  for Bezier, not so much.
         */
        this.pointOnPath = function(location) {
        	var xp = _sx + (location * _dx);
        	var yp = (_m == Infinity || _m == -Infinity) ? _sy + (location * (_ty - _sy)) : (_m * xp) + _b;
        	return {x:xp, y:yp};
        };
        
        /**
         * returns the gradient of the connector at the given point - which for us is constant.
         */
        this.gradientAtPoint = function(location) { return _m; };	
        
        /**
         * returns the point on the connector's path that is 'distance' along the length of the path from 'location', where 
         * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
         */
        this.pointAlongPathFrom = function(location, distance) {
        	var p = self.pointOnPath(location);
        	var orientation = distance > 0 ? 1 : -1;
        	var y = Math.abs(distance * Math.sin(_theta));
        	if (_sy > _ty) y = y * -1;
			var x =  Math.abs(distance * Math.cos(_theta));
			if (_sx > _tx) x = x * -1;
			return {x:p.x + (orientation * x), y:p.y + (orientation * y)};
        };
        
        /**
         * calculates a line that is perpendicular to, and centered on, the path at 'distance' pixels from the given location.
         * the line is 'length' pixels long.
         */
        this.perpendicularToPathAt = function(location, length, distance) {
        	var p = self.pointAlongPathFrom(location, distance);
        	var m = self.gradientAtPoint(p.location);
        	var _theta2 = Math.atan(-1 / m);
        	var y =  length / 2 * Math.sin(_theta2);
			var x =  length / 2 * Math.cos(_theta2);
			return [{x:p.x + x, y:p.y + y}, {x:p.x - x, y:p.y - y}];
        };        
        
        this.createGradient = function(dim, ctx) {
        	return ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]);
        };        
    };
                
    /**
     * This Connector draws a Bezier curve with two control points.
     * 
     * @param curviness How 'curvy' you want the curve to be! This is a directive for the
     * placement of control points, not endpoints of the curve, so your curve does not 
     * actually touch the given point, but it has the tendency to lean towards it.  the larger
     * this value, the greater the curve is pulled from a straight line.
     * 
     * note that the method signature changed in 1.2.6 to take a params object, so the method
     * argument was renamed.  you can still provide just an integer to this constructor, though the
     * preferred method is to use {curviness:XXX}.
     * 
     * a future implementation of this could take the control points as arguments, rather
     * than fixing the curve to one basic shape.
     */
    jsPlumb.Connectors.Bezier = function(params) {
    	var self = this;
    	this.majorAnchor = 150;
    	// backwards compatibility (ideally we'd just use params.curviness || 150).
    	if (params) {
    		if (params.constructor == Number) this.majorAnchor = params;
    		else if (params.curviness) this.majorAnchor = params.curviness;
    	}
        this.minorAnchor = 10;
        var currentPoints = null;
        
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

        var _CP, _CP2, _sx, _tx, _ty, _sx, _sy, _canvasX, _canvasY, _w, _h;
        this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth, minWidth)
        {
        	lineWidth = lineWidth || 0;
            _w = Math.abs(sourcePos[0] - targetPos[0]) + lineWidth; 
            _h = Math.abs(sourcePos[1] - targetPos[1]) + lineWidth;
            _canvasX = Math.min(sourcePos[0], targetPos[0])-(lineWidth/2);
            _canvasY = Math.min(sourcePos[1], targetPos[1])-(lineWidth/2);
            _sx = sourcePos[0] < targetPos[0] ? _w - (lineWidth/2): (lineWidth/2);
            _sy = sourcePos[1] < targetPos[1] ? _h - (lineWidth/2) : (lineWidth/2);
            _tx = sourcePos[0] < targetPos[0] ? (lineWidth/2) : _w - (lineWidth/2);
            _ty = sourcePos[1] < targetPos[1] ? (lineWidth/2) : _h - (lineWidth/2);
            _CP = self._findControlPoint([_sx,_sy], sourcePos, targetPos, sourceAnchor, targetAnchor);
            _CP2 = self._findControlPoint([_tx,_ty], targetPos, sourcePos, targetAnchor, sourceAnchor);                
            var minx1 = Math.min(_sx,_tx); var minx2 = Math.min(_CP[0], _CP2[0]); var minx = Math.min(minx1,minx2);
            var maxx1 = Math.max(_sx,_tx); var maxx2 = Math.max(_CP[0], _CP2[0]); var maxx = Math.max(maxx1,maxx2);
            
            if (maxx > _w) _w = maxx;
            if (minx < 0) {
                _canvasX += minx; var ox = Math.abs(minx);
                _w += ox; _CP[0] += ox; _sx += ox; _tx +=ox; _CP2[0] += ox;
            }                

            var miny1 = Math.min(_sy,_ty); var miny2 = Math.min(_CP[1], _CP2[1]); var miny = Math.min(miny1,miny2);
            var maxy1 = Math.max(_sy,_ty); var maxy2 = Math.max(_CP[1], _CP2[1]); var maxy = Math.max(maxy1,maxy2);
            if (maxy > _h) _h = maxy;
            if (miny < 0) {
                _canvasY += miny; var oy = Math.abs(miny);
                _h += oy; _CP[1] += oy; _sy += oy; _ty +=oy; _CP2[1] += oy;
            }
            
            if (minWidth && _w < minWidth) {
            	var posAdjust = (minWidth - _w) / 2;
        		_w = minWidth;        		
        		_canvasX -= posAdjust; _sx = _sx + posAdjust ; _tx = _tx + posAdjust; _CP[0] =  _CP[0] + posAdjust; _CP2[0] = _CP2[0] + posAdjust;
        	}
            
            if (minWidth && _h < minWidth) {
            	var posAdjust = (minWidth - _h) / 2;
        		_h = minWidth;        		
        		_canvasY -= posAdjust; _sy = _sy + posAdjust ; _ty = _ty + posAdjust; _CP[1] =  _CP[1] + posAdjust; _CP2[1] = _CP2[1] + posAdjust;
        	}

            currentPoints = [_canvasX, _canvasY, _w, _h, _sx, _sy, _tx, _ty, _CP[0], _CP[1], _CP2[0], _CP2[1] ];            
            return currentPoints;            
        };

        this.paint = function(d, ctx) {
        	ctx.beginPath();
            ctx.moveTo(d[4],d[5]);
            ctx.bezierCurveTo(d[8],d[9],d[10],d[11],d[6],d[7]);	            
            ctx.stroke();            
        };
        
        var _makeCurve = function() {
        	return [	
        	        	{ x:_sx, y:_sy },
        	        	{ x:_CP[0], y:_CP[1] },
        	        	{ x:_CP2[0], y:_CP2[1] },
        	        	{ x:_tx, y:_ty }
         	];
        };     
        
        /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for the straight line connector this is simple maths.  for Bezier, not so much.
         */
        this.pointOnPath = function(location) {        	
        	return jsBezier.pointOnCurve(_makeCurve(), location);
        };
        
        /**
         * returns the gradient of the connector at the given point.
         */
        this.gradientAtPoint = function(location) {
        	return jsBezier.gradientAtPoint(_makeCurve(), location);        	
        };	
        
        /**
         * for Bezier curves this method is a little tricky, cos calculating path distance algebraically is notoriously difficult.
         * this method is iterative, jumping forward .05% of the path at a time and summing the distance between this point and the previous
         * one, until the sum reaches 'distance'. the method may turn out to be computationally expensive; we'll see.
         * another drawback of this method is that if the connector gets quite long, .05% of the length of it is not necessarily smaller
         * than the desired distance, in which case the loop returns immediately and the arrow is mis-shapen. so a better strategy might be to
         * calculate the step as a function of distance/distance between endpoints.  
         */
        this.pointAlongPathFrom = function(location, distance) {        	
        	return jsBezier.pointAlongCurveFrom(_makeCurve(), location, distance);
        };        
        
        /**
         * calculates a line that is perpendicular to, and centered on, the path at 'distance' pixels from the given location.
         * the line is 'length' pixels long.
         */
        this.perpendicularToPathAt = function(location, length, distance) {        	
        	return jsBezier.perpendicularToCurveAt(_makeCurve(), location, length, distance);
        };
        
        this.createGradient = function(dim, ctx, swap) {
        	return (swap) ? ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]) : ctx.createLinearGradient(dim[6], dim[7], dim[4], dim[5]);
        };
    };
    
    
    /**
     * Types of endpoint UIs.  we supply four - a circle of default radius 10px, a rectangle of
     * default size 20x20, an image (with no default), and a Triangle, of default size 15.  
     * you can supply others of these if you want to - see the documentation for a howto.
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
		};
		
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
			var style = jsPlumb.extend({}, endpointStyle);
			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
			jsPlumb.extend(ctx, style);
						
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
			var style = jsPlumb.extend({}, endpointStyle);
			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
			jsPlumb.extend(ctx, style);
			
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
	
	jsPlumb.Endpoints.Triangle = function(params) {
	        	
		params = params || { width:55, height:55 };
		var self = this;
		this.width = params.width;
		this.height = params.height;
		
    	this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) 
		{    		
			var width = endpointStyle.width || self.width;
			var height = endpointStyle.height || self.height;
			var x = anchorPoint[0] - width/2;
			var y = anchorPoint[1] - height/2;
			
			jsPlumb.sizeCanvas(canvas, x, y, width, height);
			
			var ctx = canvas.getContext('2d');
			var offsetX = 0, offsetY = 0, angle = 0;
			
			if( orientation[0] == 1 )
			{
				offsetX = width;
				offsetY = height;
				angle = 180;
			}
			if( orientation[1] == -1 )
			{
				offsetX = width;
				angle = 90;
			}
			if( orientation[1] == 1 )
			{
				offsetY = height;
				angle = -90;
			}
			
			ctx.fillStyle = endpointStyle.fillStyle;
			
			ctx.translate(offsetX, offsetY);
			ctx.rotate(angle * Math.PI/180);

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(width/2, height/2);
			ctx.lineTo(0, height);
			ctx.closePath();
			ctx.fill();				
    	};
	};
	
	/**
	 * Image endpoint - draws an image as the endpoint.  You must provide a 'url' or, since 1.2.4, a 'src' property in the params object..
	 */
	jsPlumb.Endpoints.Image = function(params) {
		var self = this;
		this.img = new Image();
		var ready = false;
		this.img.onload = function() {
			self.ready = true;
		};
		this.img.src = params.src || params.url;
		
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
    			actuallyPaint(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle);
			}
			else 
				window.setTimeout(function() {    					
					self.paint(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle);
				}, 200);
		};    		
	};    		
	
	/**
	 * An arrow overlay.  you can provide:
	 * 
	 * length - distance in pixels from head to tail baseline. default 20.
	 * width - width in pixels of the tail baseline. default 20.
	 * fillStyle - style to use when filling the arrow.  defaults to "black".
	 * strokeStyle - style to use when stroking the arrow. defaults to null, which means the arrow is not stroked.
	 * lineWidth - line width to use when stroking the arrow. defaults to 1, but only used if strokeStyle is not null.
	 * foldback - distance (as a decimal from 0 to 1 inclusive) along the length of the arrow marking the point the tail points should fold back to.  defaults to 0.623.
	 * location - distance (as a decimal from 0 to 1 inclusive) marking where the arrow should sit on the connector. defaults to 0.5.
	 * direction - indicates the direction the arrow points in. valid values are -1 and 1; 1 is default.
	 */
	jsPlumb.Overlays.Arrow = function(params) {
		params = params || {};
		var self = this;
    	this.length = params.length || 20;
    	this.width = params.width || 20;
    	this.connection = params.connection;
    	var direction = (params.direction || 1) < 0 ? -1 : 1;
    	/*var fillStyle = params.fillStyle;
    	var strokeStyle = params.strokeStyle;
    	var lineWidth = params.lineWidth || 1;*/
    	var paintStyle = params.paintStyle || { lineWidth:1 };
    	this.loc = params.location == null ? 0.5 : params.location;
    	// how far along the arrow the lines folding back in come to. default is 62.3%. 
    	var foldback = params.foldback || 0.623;
    	var _getFoldBackPoint = function(connector, loc) {
    		if (foldback == 0.5) return connector.pointOnPath(loc);
    		else {
    			var adj = 0.5 - foldback; // we calculate relative to the center        			
    			return connector.pointAlongPathFrom(loc, direction * self.length * adj);
    		}
    	};
    	
    	this.computeMaxSize = function() { return self.width * 1.5; };
    	
    	this.draw = function(connector, ctx, currentConnectionPaintStyle) {
    		
    		// this is the arrow head position    		
			var hxy = connector.pointAlongPathFrom(self.loc, direction * (self.length / 2));
			// this is the center of the tail    		    		
			var txy = connector.pointAlongPathFrom(self.loc, -1 * direction * (self.length / 2)), tx = txy.x, ty = txy.y;
			// this is the tail vector    		
			var tail = connector.perpendicularToPathAt(self.loc, self.width, -1 * direction * (self.length / 2));
			// this is the point the tail goes in to
			var cxy = _getFoldBackPoint(connector, self.loc);
			
			// if loc = 1, then hxy should be flush with the element.
			if (self.loc == 1) {
				var lxy = connector.pointOnPath(self.loc);
				var dx = lxy.x - hxy.x, dy = lxy.y - hxy.y;
				cxy.x += dx; cxy.y += dy;
				txy.x += dx; txy.y += dy;
				tail[0].x += dx; tail[0].y += dy;
				tail[1].x += dx; tail[1].y += dy;
				hxy.x += dx; hxy.y += dy;
			}
			// if loc = 0, then tail midpoint should be flush with the element.
			if (self.loc == 0) {
				var lxy = connector.pointOnPath(self.loc);
				var tailMid = foldback > 1 ? cxy : { 
						x:tail[0].x + ((tail[1].x - tail[0].x) / 2),
						y:tail[0].y + ((tail[1].y - tail[0].y) / 2)
				};
				var dx = lxy.x - tailMid.x, dy = lxy.y - tailMid.y;
				cxy.x += dx; cxy.y += dy;
				txy.x += dx; txy.y += dy;
				tail[0].x += dx; tail[0].y += dy;
				tail[1].x += dx; tail[1].y += dy;
				hxy.x += dx; hxy.y += dy;
			}
			
			var minx = Math.min(hxy.x, tail[0].x, tail[1].x);
			var maxx = Math.max(hxy.x, tail[0].x, tail[1].x);
			var miny = Math.min(hxy.y, tail[0].y, tail[1].y);
			var maxy = Math.max(hxy.y, tail[0].y, tail[1].y);
			
			ctx.lineWidth = paintStyle.lineWidth;
			ctx.beginPath();
			ctx.moveTo(hxy.x, hxy.y);
			ctx.lineTo(tail[0].x, tail[0].y);
			ctx.lineTo(cxy.x, cxy.y);
			ctx.lineTo(tail[1].x, tail[1].y);
			ctx.lineTo(hxy.x, hxy.y);
			ctx.closePath();						
			
			if (paintStyle.strokeStyle) {
				ctx.strokeStyle = paintStyle.strokeStyle;
				ctx.stroke();
			}
			ctx.fillStyle = paintStyle.fillStyle || currentConnectionPaintStyle.strokeStyle;			
			ctx.fill();
			
			
			
			return [ minx, maxx, miny, maxy]; 
    	};
    };
    
    /**
	 * a basic arrow.  this is in fact just one instance of the more generic case in which the tail folds back on itself to some
	 * point along the length of the arrow: in this case, that foldback point is the full length of the arrow.  so it just does
	 * a 'call' to Arrow with foldback set appropriately.  See Arrow for params.     
	 */
    jsPlumb.Overlays.PlainArrow = function(params) {
    	params = params || {};
    	var p = jsPlumb.extend(params, {foldback:1});
    	jsPlumb.Overlays.Arrow.call(this, p);    	
    };
    
    /**
	 * a diamond.  like PlainArrow, this is a concrete case of the more generic case of the tail points converging on some point...it just
	 * happens that in this case, that point is greater than the length of the the arrow.  See Arrow for params.  
	 * 
	 *      this could probably do with some help with positioning...due to the way it reuses the Arrow paint code, what Arrow thinks is the
	 *      center is actually 1/4 of the way along for this guy.  but we don't have any knowledge of pixels at this point, so we're kind of
	 *      stuck when it comes to helping out the Arrow class. possibly we could pass in a 'transpose' parameter or something. the value
	 *      would be -l/4 in this case - move along one quarter of the total length.
	 */
    jsPlumb.Overlays.Diamond = function(params) {
    	params = params || {};
    	var l = params.length || 40;    	
    	var p = jsPlumb.extend(params, {length:l/2, foldback:2});
    	jsPlumb.Overlays.Arrow.call(this, p);    	
    };
    
    /**
     * A Label overlay.  Params you can provide:
     * 
     * labelStyle - js object containing style instructions for the label. defaults to jsPlumb.Defaults.LabelStyle.
     * label - the label to paint.  may be a string or a function that returns a string.  nothing will be painted if your label is null or your
     *         label function returns null.  empty strings _will_ be painted.
     * location - distance (as a decimal from 0 to 1 inclusive) marking where the label should sit on the connector. defaults to 0.5.
     * borderWidth - width of a border to paint.  defaults to zero.
     * borderStyle - strokeStyle to use when painting the border, if necessary.
     */
    jsPlumb.Overlays.Label = function(params) {
    	this.labelStyle = params.labelStyle || jsPlumb.Defaults.LabelStyle;
	    this.label = params.label;
	    this.connection = params.connection;
    	var self = this;
    	var labelWidth = null, labelHeight =  null, labelText = null, labelPadding = null;
    	this.location = params.location || 0.5;
    	this.cachedDimensions = null;             // setting on 'this' rather than using closures uses a lot less memory.  just don't monkey with it! 
    	var _textDimensions = function(ctx) {
    		if (self.cachedDimensions) return self.cachedDimensions;   // return cached copy if we can.  if we add a setLabel function remember to clear the cache. 
    		labelText = typeof self.label == 'function' ? self.label(self) : self.label;
    		var d = {};
    		if (labelText) {
    			var lines = labelText.split(/\n|\r\n/);
    			ctx.save();
	            if (self.labelStyle.font) ctx.font = self.labelStyle.font;
	            var t = _widestLine(lines, ctx);
				// a fake text height measurement: use the width of upper case M
				var h = ctx.measureText("M").width;					
				labelPadding = self.labelStyle.padding || 0.25;
				labelWidth = t + (2 * t * labelPadding);
				labelHeight = (lines.length * h) + (2 * h * labelPadding);
				var textHeight = lines.length * h;
				ctx.restore();
				d = {width:labelWidth, height:labelHeight, lines:lines, oneLine:h, padding:labelPadding, textHeight:textHeight};
    		}
    		if (typeof self.label != 'function') self.cachedDimensions = d;  // cache it if we can. 
    		return d;
    	};
    	this.computeMaxSize = function(connector, ctx) {
    		var td = _textDimensions(ctx);
    		return td.width ? Math.max(td.width, td.height) * 1.5 : 0;
    	};
    	var _widestLine = function(lines, ctx) {
    		var max = 0;
    		for (var i = 0; i < lines.length; i++) {
    			var t = ctx.measureText(lines[i]).width;
    			if (t > max) max = t;
    		}
    		return max;
    	};
    	
	    this.draw = function(connector, ctx, currentConnectionPaintStyle) {	
	    	var td = _textDimensions(ctx);
	    	if (td.width) {
				var cxy = connector.pointOnPath(self.location);
				if (self.labelStyle.font) ctx.font = self.labelStyle.font;		            		            		           
				if (self.labelStyle.fillStyle) 
					ctx.fillStyle = self.labelStyle.fillStyle;
				else 
					ctx.fillStyle = "rgba(0,0,0,0)";
				
				var minx = cxy.x - (td.width / 2);
				var miny = cxy.y - (td.height / 2);
				
				ctx.fillRect(minx, miny , td.width , td.height );
				
				if (self.labelStyle.color) ctx.fillStyle = self.labelStyle.color;					
				ctx.textBaseline = "middle";
				ctx.textAlign = "center";
				for (i = 0; i < td.lines.length; i++) { 
					ctx.fillText(td.lines[i],cxy.x, cxy.y - (td.textHeight / 2) + (td.oneLine/2) + (i*td.oneLine));
				}
				
				// border
				if (self.labelStyle.borderWidth > 0) {
					ctx.strokeStyle = self.labelStyle.borderStyle || "black";
					ctx.strokeRect(minx, miny, td.width , td.height );
				}
				
				return [minx, minx+td.width, miny, miny+td.height];
        	}
	    	else return [0,0,0,0];
	    };
    };
    
    /**
     * an image overlay.  params may contain:
     * 
     * location			:			proportion along the connector to draw the image. optional.
     * src				:			image src.  required.
     * events			:			map of event names to functions; each event listener will be bound to the img.
     */
    jsPlumb.Overlays.Image = function(params) {
    	var self = this;
    	this.location = params.location || 0.5;    	
    	this.img = new Image();
    	this.connection = params.connection;
    	var imgDiv = null;
    	var notReadyInterval = null;
    	var notReadyConnector, notReadyContext;
    	var events = params.events || {};
    	var _init = function() {
    		if (self.ready) {
    			window.clearInterval(notReadyInterval);
	    		imgDiv = document.createElement("img");
				imgDiv.src = self.img.src;
				imgDiv.style.position = "absolute";
				imgDiv.style.display="none";
				imgDiv.className = "_jsPlumb_overlay";
				document.body.appendChild(imgDiv);// HMM
				// attach events
				for (var e in events) {
					jsPlumb.CurrentLibrary.bind(imgDiv, e, events[e]);
				}
				if (notReadyConnector && notReadyContext) {
					_draw(notReadyConnector, notReadyContext);
					notReadyContext = null;
					notReadyConnector = null;
				}
    		}
    	};
		this.img.onload = function() {						
			self.ready = true;
		//	jsPlumb.repaintAll();
		};
		this.img.src = params.src || params.url;
		
		notReadyInterval = window.setInterval(_init, 250);
    	
    	this.computeMaxSize = function(connector, ctx) {
    		return [ self.img.width, self.img.height ];
    	};
    	
    	var _draw = function(connector, ctx, currentConnectionPaintStyle) {
    		if (imgDiv != null) {
	    		var cxy = connector.pointOnPath(self.location);
	    		var canvas = jsPlumb.CurrentLibrary.getElementObject(ctx.canvas);
	    		var canvasOffset = jsPlumb.CurrentLibrary.getOffset(canvas);
	    		var minx = cxy.x - (self.img.width/2);
	    		var miny = cxy.y - (self.img.height/2);
	    		var o = {left:canvasOffset.left + minx, top:canvasOffset.top + miny};
	    		jsPlumb.CurrentLibrary.setOffset(imgDiv, o);
	    		imgDiv.style.display = "block";
	    		return [minx,minx + self.img.width, miny, miny+self.img.height];
    		}
    	};
    	
    	this.draw = function(connector, ctx) {
    		if (self.ready)
	    		return _draw(connector, ctx);
    		else {
    			notReadyConnector = connector;
    			notReadyContext = ctx;
    			return [0,0,0,0];
    		}
    	};
    };       
})();;(function() {					
	
	jsPlumb.Connectors.Flowchart = function(params) {
		params = params || {};
		var self = this, 
		minStubLength = params.minStubLength || 30, 
		segments = [], 
		segmentGradients = [], 
		segmentProportions = [], 
		segmentLengths = [],
		segmentProportionalLengths = [],
		points = [],
		swapX, 
		swapY,
		/**
		 * recalculates the gradients of each segment, and the points at which the segments begin, proportional to the total length travelled 
		 * by all the segments that constitute the connector.   
		 */
		updateSegmentGradientsAndProportions = function(startX, startY, endX, endY) {
			var total = 0;
			for (var i = 0; i < segments.length; i++) {
				var sx = i == 0 ? startX : segments[i][2], 
					sy = i == 0 ? startY : segments[i][3],
					ex = segments[i][0], 
					ey = segments[i][1];
				
				segmentGradients[i] = sx == ex ? Infinity : 0;
				segmentLengths[i] = Math.abs(sx == ex ? ey - sy : ex - sx); 
				total += segmentLengths[i];
			}
			var curLoc = 0;
			for (var i = 0; i < segments.length; i++) {
				segmentProportionalLengths[i] = segmentLengths[i] / total;
				segmentProportions[i] = [curLoc, (curLoc += (segmentLengths[i] / total)) ];
			}
		},
		appendSegmentsToPoints = function() {
			points.push(segments.length);
			for (var i = 0; i < segments.length; i++) {
				points.push(segments[i][0]);
				points.push(segments[i][1]);
			}
		},		
		/**
		 * helper method to add a segment.
		 */
		addSegment = function(x, y, sx, sy, tx, ty) {
			var lx = segments.length == 0 ? sx : segments[segments.length - 1][0];
			var ly = segments.length == 0 ? sy : segments[segments.length - 1][1];
			segments.push([x, y, lx, ly]);
		},
		/**
		 * returns [segment, proportion of travel in segment, segment index] for the segment that contains the point which is 'location' distance along the entire path, where 'location' is
		 * a decimal between 0 and 1 inclusive. in this connector type paths are made up of a list of segments, each of which contributes some fraction to
		 * the total length.  
		 */
		findSegmentForLocation = function(location) {
			var idx = segmentProportions.length - 1, inSegmentProportion = 0;
			for (var i = 0; i < segmentProportions.length; i++) {
				if (segmentProportions[i][1] >= location) {
					idx = i;
					inSegmentProportion = (location - segmentProportions[i][0]) / segmentProportionalLengths[i];
 					break;
				}
			}
			return { segment:segments[idx], proportion:inSegmentProportion, index:idx };
		};
		
		this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth, minWidth) {
    	
			segments = [];
			segmentGradients = [];
			segmentProportionalLengths = [];
			segmentLengths = [];
			segmentProportionals = [];
			
            swapX = targetPos[0] < sourcePos[0]; 
            swapY = targetPos[1] < sourcePos[1];
			
			var lw = lineWidth || 1,
            offx = (lw / 2) + (minStubLength * 2), 
            offy = (lw / 2) + (minStubLength * 2),
            so = sourceAnchor.orientation || sourceAnchor.getOrientation(), 
            to = targetAnchor.orientation || targetAnchor.getOrientation(),
            x = swapX ? targetPos[0] : sourcePos[0], 
            y = swapY ? targetPos[1] : sourcePos[1],
            w = Math.abs(targetPos[0] - sourcePos[0]) + 2*offx, 
            h = Math.abs(targetPos[1] - sourcePos[1]) + 2*offy;
            if (w < minWidth) {      
            	offx += (minWidth - w) / 2;
            	w = minWidth;
            }
            if (h < minWidth) {            	
            	offy += (minWidth - h) / 2;
            	h = minWidth;
            }
            sx = swapX ? w-offx  : offx, 
            sy = swapY ? h-offy  : offy, 
            tx = swapX ? offx : w-offx ,
            ty = swapY ? offy : h-offy,
            startStubX = sx + (so[0] * minStubLength), 
            startStubY = sy + (so[1] * minStubLength),
            endStubX = tx + (to[0] * minStubLength), 
            endStubY = ty + (to[1] * minStubLength),
            midx = startStubX + ((endStubX - startStubX) / 2),
            midy = startStubY + ((endStubY - startStubY) / 2);
            
            x -= offx; y -= offy;
            points = [x, y, w, h, sx, sy, tx, ty], extraPoints = [];            
      
            addSegment(startStubX, startStubY, sx, sy, tx, ty);                        
            
            if (so[0] == 0) {        		
        		var startStubIsBeforeEndStub = startStubY < endStubY;             		        	
        		// when start point's stub is less than endpoint's stub
        		if (startStubIsBeforeEndStub) {
        			addSegment(startStubX, midy, sx, sy, tx, ty);
        			addSegment(midx, midy, sx, sy, tx, ty);
        			addSegment(endStubX, midy, sx, sy, tx, ty);
        		} else {
        			// when start point's stub is greater than endpoint's stub
        			addSegment(midx, startStubY, sx, sy, tx, ty);
        			addSegment(midx, endStubY, sx, sy, tx, ty);
        		}
        	}
        	else {
        		var startStubIsBeforeEndStub = startStubX < endStubX;
        		// when start point's stub is less than endpoint's stub
        		if (startStubIsBeforeEndStub) { 
        			addSegment(midx, startStubY, sx, sy, tx, ty);
        			addSegment(midx, midy, sx, sy, tx, ty);
        			addSegment(midx, endStubY, sx, sy, tx, ty);
        		} else {
        			// when start point's stub is greater than endpoint's stub        			
        			addSegment(startStubX, midy, sx, sy, tx, ty);
        			addSegment(endStubX, midy, sx, sy, tx, ty);
        		}
        	}            
            
            addSegment(endStubX, endStubY, sx, sy, tx, ty);
            addSegment(tx, ty, sx, sy, tx, ty);
            
            appendSegmentsToPoints();
            updateSegmentGradientsAndProportions(sx, sy, tx, ty);
            
			return points;
		};
        
	    this.paint = function(dimensions, ctx) {
	        ctx.beginPath();
	        ctx.moveTo(dimensions[4], dimensions[5]);
	        // loop through extra points
	        for (var i = 0; i < dimensions[8]; i++) {
	            ctx.lineTo(dimensions[9 + (i*2)], dimensions[10 + (i*2)]);
	        }
	        // finally draw a line to the end
	        ctx.lineTo(dimensions[6], dimensions[7]);
	        ctx.stroke();
	    };
	    
	    /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for this connector we must first figure out which segment the given point lies in, and then compute the x,y position
         * from our knowledge of the segment's start and end points.
         */
        this.pointOnPath = function(location) {
        	return self.pointAlongPathFrom(location, 0);
        };
        
        /**
         * returns the gradient of the connector at the given point; the gradient will be either 0 or Infinity, depending on the direction of the
         * segment the point falls in. segment gradients are calculated in the compute method.  
         */
        this.gradientAtPoint = function(location) { 
        	return segmentGradients[findSegmentForLocation(location)["index"]];
        };
        
        /**
         * returns the point on the connector's path that is 'distance' along the length of the path from 'location', where 
         * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.  when you consider this concept from the point of view
         * of this connector, it starts to become clear that there's a problem with the overlay paint code: given that this connector makes several
         * 90 degree turns, it's entirely possible that an arrow overlay could be forced to paint itself around a corner, which would look stupid. this is
         * because jsPlumb uses this method (and pointOnPath) so determine the locations of the various points that go to make up an overlay.  a better
         * solution would probably be to just use pointOnPath along with gradientAtPoint, and draw the overlay so that its axis ran along
         * a tangent to the connector.  for straight line connectors this would obviously mean the overlay was painted directly on the connector, since a 
         * tangent to a straight line is the line itself, which is what we want; for this connector, and for beziers, the results would probably be better.  an additional
         * advantage is, of course, that there's less computation involved doing it that way. 
         */
        this.pointAlongPathFrom = function(location, distance) {
        	var s = findSegmentForLocation(location), seg = s.segment, p = s.proportion, sl = segmentLengths[s.index], m = segmentGradients[s.index];        	
        	var e = { 
        		//x 	: m == Infinity ? seg[2] : /*swapX ? seg[2] - (p * sl) - distance : */seg[2] + (p * sl) + distance,
        		
        		x 	: m == Infinity ? seg[2] : seg[2] > seg[0] ? seg[0] + ((1 - p) * sl) - distance : seg[2] + (p * sl) + distance,
        			
        			
        		//y 	: m == 0 ? seg[3] : /*swapY ? seg[3] - (p * sl) - distance : */seg[3] + (p * sl) + distance,
        				y 	: m == 0 ? seg[3] : seg[3] > seg[1] ? seg[1] + ((1 - p) * sl) - distance  : seg[3] + (p * sl) + distance,
        		segmentInfo : s
        	};
        	
        	//console.log("pointalongpath, swapX =" + swapX + ",swapY=" + swapY, "loc", location, "travel", (p * sl), "dist", distance, e.x, e.y, "seg", seg, "len", sl, "prop.", p);
        	
        	return e;
        };
        
        /**
         * calculates a line that is perpendicular to, and centered on, the path at 'distance' pixels from the given location.
         * the line is 'length' pixels long.
         */
        this.perpendicularToPathAt = function(location, length, distance) {
        	var p = self.pointAlongPathFrom(location, distance);
        	var m = segmentGradients[p.segmentInfo.index];
        	var _theta2 = Math.atan(-1 / m);
        	var y =  length / 2 * Math.sin(_theta2);
			var x =  length / 2 * Math.cos(_theta2);
			return [{x:p.x + x, y:p.y + y}, {x:p.x - x, y:p.y - y}];
        	
        };
	};
})();/*
 * jquery.jsPlumb 1.2.6-RC1
 * 
 * jQuery specific functionality for jsPlumb.
 * 
 * http://morrisonpitt.com/jsPlumb/demo.html
 * http://code.google.com/p/jsPlumb
 * 
 * NOTE: for production usage you should use jsPlumb-all-x.x.x-min.js, which contains the main jsPlumb script and this script together,
 * in a minified file.
 * 
 * Dual licensed under MIT and GPL2.
 * 
 */ 
/* 
 * the library agnostic functions, such as find offset, get id, get attribute, extend etc.  
 * the full list is:
 * 
 * addClass				adds a class to the given element
 * animate				calls the underlying library's animate functionality
 * appendElement		appends a child element to a parent element.
 * bind					binds some event to an element
 * dragEvents			a dictionary of event names
 * extend				extend some js object with another.  probably not overly necessary; jsPlumb could just do this internally.
 * getAttribute			gets some attribute from an element
 * getDragObject		gets the object that is being dragged, by extracting it from the arguments passed to a drag callback
 * getDragScope			gets the drag scope for a given element.
 * getElementObject		turns an id or dom element into an element object of the underlying library's type.
 * getOffset			gets an element's offset
 * getPageXY			gets the page event's xy location.
 * getScrollLeft		gets an element's scroll left.  TODO: is this actually used?  will it be?
 * getScrollTop			gets an element's scroll top.  TODO: is this actually used?  will it be?
 * getSize				gets an element's size.
 * getUIPosition		gets the position of some element that is currently being dragged, by extracting it from the arguments passed to a drag callback.
 * hasClass				returns whether or not the given element has the given class.
 * initDraggable		initializes an element to be draggable 
 * initDroppable		initializes an element to be droppable
 * isDragSupported		returns whether or not drag is supported for some element.
 * isDropSupported		returns whether or not drop is supported for some element.
 * removeClass			removes a class from a given element.
 * removeElement		removes some element completely from the DOM.
 * setAttribute			sets an attribute on some element.
 * setDraggable			sets whether or not some element should be draggable.
 * setDragScope			sets the drag scope for a given element.
 * setOffset			sets the offset of some element.
 */
(function($) {	
	
	jsPlumb.CurrentLibrary = {					        
		
		/**
		 * adds the given class to the element object.
		 */
		addClass : function(el, clazz) {
			el.addClass(clazz);
		},
		
		/**
		 * animates the given element.
		 */
		animate : function(el, properties, options) {
			el.animate(properties, options);
		},				
		
		/**
		 * appends the given child to the given parent.
		 */
		appendElement : function(child, parent) {
			jsPlumb.CurrentLibrary.getElementObject(parent).append(child);			
		},   
		
		/**
		 * event binding wrapper.  it just so happens that jQuery uses 'bind' also.  yui3, for example,
		 * uses 'on'.
		 */
		bind : function(el, event, callback) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			el.bind(event, callback);
		},
		
		/**
         * mapping of drag events for jQuery
         */
		dragEvents : {
			'start':'start', 'stop':'stop', 'drag':'drag', 'step':'step',
			'over':'over', 'out':'out', 'drop':'drop', 'complete':'complete'
		},
				
		/**
		 * wrapper around the library's 'extend' functionality (which it hopefully has.
		 * otherwise you'll have to do it yourself). perhaps jsPlumb could do this for you
		 * instead.  it's not like its hard.
		 */
		extend : function(o1, o2) {
			return $.extend(o1, o2);
		},
		
		/**
		 * gets the named attribute from the given element object.  
		 */
		getAttribute : function(el, attName) {
			return el.attr(attName);
		},
		
		getDocumentElement : function() { return document; },
		
		/**
		 * takes the args passed to an event function and returns you an object representing that which is being dragged.
		 */
		getDragObject : function(eventArgs) {
			return eventArgs[1].draggable;
		},
		
		getDragScope : function(el) {
			return el.draggable("option", "scope");
		},
	
		/**
		 * gets an "element object" from the given input.  this means an object that is used by the
		 * underlying library on which jsPlumb is running.  'el' may already be one of these objects,
		 * in which case it is returned as-is.  otherwise, 'el' is a String, the library's lookup 
		 * function is used to find the element, using the given String as the element's id.
		 * 
		 */		
		getElementObject : function(el) {			
			return typeof(el)=='string' ? $("#" + el) : $(el);
		},
		
		/**
		  * gets the offset for the element object.  this should return a js object like this:
		  *
		  * { left:xxx, top: xxx }
		 */
		getOffset : function(el) {
			return el.offset();
		},
		
		getPageXY : function(eventObject) {
			return [eventObject.pageX, eventObject.pageY];
		},
														
		getScrollLeft : function(el) {
			return el.scrollLeft();
		},
		
		getScrollTop : function(el) {
			return el.scrollTop();
		},
		
		/**
		 * gets the size for the element object, in an array : [ width, height ].
		 */
		getSize : function(el) {
			return [el.outerWidth(), el.outerHeight()];
		},
		
		/**
		 * takes the args passed to an event function and returns you an object that gives the
		 * position of the object being moved, as a js object with the same params as the result of
		 * getOffset, ie: { left: xxx, top: xxx }.
		 * 
		 * different libraries have different signatures for their event callbacks.  
		 * see getDragObject as well
		 */
		getUIPosition : function(eventArgs) {
			var ui = eventArgs[1], _offset = ui.offset;			
			return _offset || ui.absolutePosition;
		},		
		
		hasClass : function(el, clazz) {
			return el.hasClass(clazz);
		},
		
		/**
		 * initialises the given element to be draggable.
		 */
		initDraggable : function(el, options) {
			// remove helper directive if present.  
			options.helper = null;
			//TODO: if 'revert' is set on the options it causes end points to animate back to
			// where they came from, if the connection is aborted.  do we care?  probably not.
			// the todo is to decide whether we care or not.
			options['scope'] = options['scope'] || jsPlumb.Defaults.Scope;
			el.draggable(options);
		},
		
		/**
		 * initialises the given element to be droppable.
		 */
		initDroppable : function(el, options) {
			options['scope'] = options['scope'] || jsPlumb.Defaults.Scope;
			el.droppable(options);
		},
		
		isAlreadyDraggable : function(el) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			return el.hasClass("ui-draggable");
		},
		
		/**
		 * returns whether or not drag is supported (by the library, not whether or not it is disabled) for the given element.
		 */
		isDragSupported : function(el, options) {
			return el.draggable;
		},				
						
		/**
		 * returns whether or not drop is supported (by the library, not whether or not it is disabled) for the given element.
		 */
		isDropSupported : function(el, options) {
			return el.droppable;
		},							
		
		/**
		 * removes the given class from the element object.
		 */
		removeClass : function(el, clazz) {
			el.removeClass(clazz);
		},
		
		removeElement : function(element, parent) {			
			jsPlumb.CurrentLibrary.getElementObject(element).remove();
		},
		
		/**
		 * sets the named attribute on the given element object.  
		 */
		setAttribute : function(el, attName, attValue) {
			el.attr(attName, attValue);
		},
		
		/**
		 * sets the draggable state for the given element
		 */
		setDraggable : function(el, draggable) {
			el.draggable("option", "disabled", !draggable);
		},
		
		/**
		 * sets the drag scope.  probably time for a setDragOption method (roll this and the one above together)
		 * @param el
		 * @param scope
		 */
		setDragScope : function(el, scope) {
			el.draggable("option", "scope", scope);
		},
		
		setOffset : function(el, o) {
			jsPlumb.CurrentLibrary.getElementObject(el).offset(o);
		}
	};
	
	$(document).ready(jsPlumb.init);
})(jQuery);
(function(){if(typeof Math.sgn=="undefined")Math.sgn=function(a){return a==0?0:a>0?1:-1};var p={subtract:function(a,b){return{x:a.x-b.x,y:a.y-b.y}},dotProduct:function(a,b){return a.x*b.x+a.y*b.y},square:function(a){return Math.sqrt(a.x*a.x+a.y*a.y)},scale:function(a,b){return{x:a.x*b,y:a.y*b}}},y=Math.pow(2,-65),u=function(a,b){for(var g=[],d=b.length-1,h=2*d-1,f=[],c=[],l=[],k=[],i=[[1,0.6,0.3,0.1],[0.4,0.6,0.6,0.4],[0.1,0.3,0.6,1]],e=0;e<=d;e++)f[e]=p.subtract(b[e],a);for(e=0;e<=d-1;e++){c[e]=
p.subtract(b[e+1],b[e]);c[e]=p.scale(c[e],3)}for(e=0;e<=d-1;e++)for(var m=0;m<=d;m++){l[e]||(l[e]=[]);l[e][m]=p.dotProduct(c[e],f[m])}for(e=0;e<=h;e++){k[e]||(k[e]=[]);k[e].y=0;k[e].x=parseFloat(e)/h}h=d-1;for(f=0;f<=d+h;f++){c=Math.min(f,d);for(e=Math.max(0,f-h);e<=c;e++){j=f-e;k[e+j].y+=l[j][e]*i[j][e]}}d=b.length-1;k=s(k,2*d-1,g,0);h=p.subtract(a,b[0]);l=p.square(h);for(e=i=0;e<k;e++){h=p.subtract(a,t(b,d,g[e],null,null));h=p.square(h);if(h<l){l=h;i=g[e]}}h=p.subtract(a,b[d]);h=p.square(h);if(h<
l){l=h;i=1}return{location:i,distance:l}},s=function(a,b,g,d){var h=[],f=[],c=[],l=[],k=0,i,e;e=Math.sgn(a[0].y);for(var m=1;m<=b;m++){i=Math.sgn(a[m].y);i!=e&&k++;e=i}switch(k){case 0:return 0;case 1:if(d>=64){g[0]=(a[0].x+a[b].x)/2;return 1}var n,o,q;k=a[0].y-a[b].y;i=a[b].x-a[0].x;e=a[0].x*a[b].y-a[b].x*a[0].y;m=max_distance_below=0;for(o=1;o<b;o++){q=k*a[o].x+i*a[o].y+e;if(q>m)m=q;else if(q<max_distance_below)max_distance_below=q}n=k;o=i;q=e-m;n=0*o-n*1;n=1/n;m=(1*q-o*0)*n;n=k;o=i;q=e-max_distance_below;
n=0*o-n*1;n=1/n;k=(1*q-o*0)*n;if(Math.max(m,k)-Math.min(m,k)<y?1:0){c=a[b].x-a[0].x;l=a[b].y-a[0].y;g[0]=0+1*(c*(a[0].y-0)-l*(a[0].x-0))*(1/(c*0-l*1));return 1}}t(a,b,0.5,h,f);a=s(h,b,c,d+1);b=s(f,b,l,d+1);for(d=0;d<a;d++)g[d]=c[d];for(d=0;d<b;d++)g[d+a]=l[d];return a+b},t=function(a,b,g,d,h){for(var f=[[]],c=0;c<=b;c++)f[0][c]=a[c];for(a=1;a<=b;a++)for(c=0;c<=b-a;c++){f[a]||(f[a]=[]);f[a][c]||(f[a][c]={});f[a][c].x=(1-g)*f[a-1][c].x+g*f[a-1][c+1].x;f[a][c].y=(1-g)*f[a-1][c].y+g*f[a-1][c+1].y}if(d!=
null)for(c=0;c<=b;c++)d[c]=f[c][0];if(h!=null)for(c=0;c<=b;c++)h[c]=f[b-c][c];return f[b][0]},v={},z=function(a){var b=v[a];if(!b){b=[];var g=function(i){return function(){return i}},d=function(){return function(i){return i}},h=function(){return function(i){return 1-i}},f=function(i){return function(e){for(var m=1,n=0;n<i.length;n++)m*=i[n](e);return m}};b.push(new function(){return function(i){return Math.pow(i,a)}});for(var c=1;c<a;c++){for(var l=[new g(a)],k=0;k<a-c;k++)l.push(new d);for(k=0;k<
c;k++)l.push(new h);b.push(new f(l))}b.push(new function(){return function(i){return Math.pow(1-i,a)}});v[a]=b}return b},r=function(a,b){for(var g=z(a.length-1),d=0,h=0,f=0;f<a.length;f++){d+=a[f].x*g[f](b);h+=a[f].y*g[f](b)}return{x:d,y:h}},w=function(a,b,g){var d=r(a,b),h=0;b=b;for(var f=g>0?1:-1,c=null;h<Math.abs(g);){b+=0.0050*f;c=r(a,b);h+=Math.sqrt(Math.pow(c.x-d.x,2)+Math.pow(c.y-d.y,2));d=c}return{point:c,location:b}},x=function(a,b){var g=r(a,b),d=r(a.slice(0,a.length-1),b);return Math.atan((d.y-
g.y)/(d.x-g.x))};window.jsBezier={distanceFromCurve:u,gradientAtPoint:x,nearestPointOnCurve:function(a,b){var g=u(a,b);return{point:t(b,b.length-1,g.location,null,null),location:g.location}},pointOnCurve:r,pointAlongCurveFrom:function(a,b,g){return w(a,b,g).point},perpendicularToCurveAt:function(a,b,g,d){d=d==null?0:d;b=w(a,b,d);a=x(a,b.location);d=Math.atan(-1/a);a=g/2*Math.sin(d);g=g/2*Math.cos(d);return[{x:b.point.x+g,y:b.point.y+a},{x:b.point.x-g,y:b.point.y-a}]}}})();
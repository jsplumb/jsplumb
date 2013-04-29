/*
 * jsPlumb 1.2.5-RC1
 * 
 * Provides a way to visually connect elements on an HTML page.
 * 
 * http://jsplumb.org
 * http://code.google.com/p/jsPlumb
 * 
 * Dual licensed under MIT and GPL2.
 */

(function() {
	
	var jsPlumbInstance = function() {
				
		/**
		 * helper class for objects that generate events
		 */
		var EventGenerator = function() {
			var _listeners = {};
			this.bind = function(event, listener) {
				var doOne = function(e, l) { _addToList(_listeners, e, l); };
				if (event.constructor == Array)
					for ( var i = 0; i < event.length; i++) doOne(event[i], listener);
				else 
					doOne(event, listener);				
			};
			this.fireUpdate = function(event, value) {
				if (_listeners[event]) {
					for ( var i = 0; i < _listeners[event].length; i++) {
						try {
							_listeners[event][i][event](value);
						} catch (e) {
							_log("jsPlumb: fireUpdate failed for event "
									+ event + ";not fatal.");
						}
					}
				}
			};
			this.clearListeners = function() {
				delete _listeners;
				_listeners = {};
			};
		};

		var _currentInstance = this;
		var ie = !!!document.createElement('canvas').getContext;
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

		/**
		 * map of element id -> endpoint lists. an element can have an arbitrary
		 * number of endpoints on it, and not all of them have to be connected
		 * to anything.
		 */
		var endpointsByElement = {};
		var endpointsByUUID = {};
		var connectionsByScope = {};
		var offsets = {};
		var offsetTimestamps = {};
		var floatingConnections = {};
		var draggableStates = {};
		var _draggableByDefault = true;
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
		 * 
		 */
		var _log = function(msg) {
			if (_currentInstance.logEnabled && typeof console != "undefined")
				console.log(msg);
		};
		
		var _getAttribute = function(el, attName) { return jsPlumb.CurrentLibrary.getAttribute(_getElementObject(el), attName); };
		var _setAttribute = function(el, attName, attValue) { jsPlumb.CurrentLibrary.setAttribute(_getElementObject(el), attName, attValue); };
		var _addClass = function(el, clazz) { jsPlumb.CurrentLibrary.addClass(_getElementObject(el), clazz); };
		var _removeClass = function(el, clazz) { jsPlumb.CurrentLibrary.removeClass(_getElementObject(el), clazz); };
		var _getElementObject = function(el) { return jsPlumb.CurrentLibrary.getElementObject(el); };
		var _getOffset = function(el) { return jsPlumb.CurrentLibrary.getOffset(_getElementObject(el)); };
		var _getSize = function(el) { return jsPlumb.CurrentLibrary.getSize(_getElementObject(el)); };

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
		 * @param clazz
		 *            optional class name for the canvas.
		 */
		var _newCanvas = function(clazz, parent, uuid) {
			var canvas = document.createElement("canvas");
			_appendElement(canvas, parent);
			canvas.style.position = "absolute";
			if (clazz) canvas.className = clazz;
			// set an id. if no id on the element and if uuid was supplied it
			// will be used, otherwise we'll create one.
			_getId(canvas, uuid);
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
		 * or if 'recalc' is true in order to force a recalculation, we use the
		 * offset, outerWidth and outerHeight methods to get the current values.
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
				sizes[elId] = _getSize(s);
				offsets[elId] = _getOffset(s);
				offsetTimestamps[elId] = timestamp;
			} else {
				offsets[elId] = offset;
			}
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
					_log('jsPlumb function failed : ' + e);
				}
				if (returnOnThisValue == null || (r !== returnOnThisValue)) {
					try {
						wrappedFunction.apply(this, arguments);
					} catch (e) {
						_log('wrapped function failed : ' + e);
					}
				}
				return r;
			};
		};

		/*
		 * Class: Anchor Models a position relative to the origin of some
		 * element that an Endpoint can be located.
		 */
		/*
		 * Function: Anchor
		 * 
		 * Constructor for the Anchor class
		 * 
		 * Parameters:
		 *  - x : the x location of the anchor as a fraction of the total width. -
		 * y : the y location of the anchor as a fraction of the total height. -
		 * orientation : an [x,y] array indicating the general direction a
		 * connection from the anchor should go in. for more info on this, see
		 * the documentation, or the docs in jquery-jsPlumb-defaults-XXX.js for
		 * the default Anchors. - offsets : an [x,y] array of fixed offsets that
		 * should be applied after the x,y position has been figured out. may be
		 * null.
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
		 * its position relative to the anchor it is floating relative to.
		 * 
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
		 * Class: DynamicAnchor
		 * 
		 * An Anchor that contains a list of other Anchors, which it cycles
		 * through at compute time to find the one that is located closest to
		 * the center of the target element, and returns that Anchor's compute
		 * method result. this causes endpoints to follow each other with
		 * respect to the orientation of their target elements - a useful
		 * feature for some applications.
		 * 
		 * the second argument - anchorSelector - is optional, but when provided should be a function
		 * that 
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
		 * Class:Connection
		 * 
		 * The connecting line between two Endpoints.
		 * 
		 */
		var Connection = function(params) {

			EventGenerator.apply(this);
			// ************** get the source and target and register the
			// connection. *******************
			var self = this;
			var id = new String('_jsplumb_c_' + (new Date()).getTime());
			this.getId = function() { return id; };
			this.container = params.container || _currentInstance.Defaults.Container; // may be null; we will append to the body if so.
			// get source and target as jQuery objects
			this.source = _getElementObject(params.source);
			this.target = _getElementObject(params.target);
			// sourceEndpoint and targetEndpoint override source/target, if they are present.
			if (params.sourceEndpoint) this.source = params.sourceEndpoint.getElement();
			if (params.targetEndpoint) this.target = params.targetEndpoint.getElement();
			this.sourceId = _getAttribute(this.source, "id");
			this.targetId = _getAttribute(this.target, "id");
			this.endpointsOnTop = params.endpointsOnTop != null ? params.endpointsOnTop : true;
			this.scope = params.scope; // scope may have been passed in to the connect call.
			// if it wasn't, we will pull it from the source endpoint, after having initialised the endpoints. init endpoints
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
					if (ep.constructor == String) ep = new jsPlumb.Endpoints[ep]();
					if (!params.endpointStyles) params.endpointStyles = [ null, null ];
					var es = params.endpointStyles[index] || params.endpointStyle || _currentInstance.Defaults.EndpointStyles[index] || jsPlumb.Defaults.EndpointStyles[index] || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
					var a = params.anchors ? params.anchors[index] : _makeAnchor(_currentInstance.Defaults.Anchors[index]) || _makeAnchor(jsPlumb.Defaults.Anchors[index]) || _makeAnchor(_currentInstance.Defaults.Anchor) || _makeAnchor(jsPlumb.Defaults.Anchor) || _makeAnchor("BottomCenter");
					var u = params.uuids ? params.uuids[index] : null;
					var e = new Endpoint( { style : es, endpoint : ep, connections : [ self ], uuid : u, anchor : a, source : element, container : self.container });
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

			this.connector = this.endpoints[0].connector || this.endpoints[1].connector || params.connector || _currentInstance.Defaults.Connector || jsPlumb.Defaults.Connector || new jsPlumb.Connectors.Bezier();
			if (this.connector.constructor == String) this.connector = new jsPlumb.Connectors[this.connector](); // lets you use a string as shorthand.
			this.paintStyle = this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || _currentInstance.Defaults.PaintStyle || jsPlumb.Defaults.PaintStyle;
			this.backgroundPaintStyle = this.endpoints[0].connectorBackgroundStyle || this.endpoints[1].connectorBackgroundStyle || params.backgroundPaintStyle || _currentInstance.Defaults.BackgroundPaintStyle || jsPlumb.Defaults.BackgroundPaintStyle;

			// init overlays
			this.overlays = params.overlays || [];
			this.addOverlay = function(overlay) { overlays.push(overlay); };

			// this is a shortcut helper method to let people add a label as
			// overlay.
			this.labelStyle = params.labelStyle || _currentInstance.Defaults.LabelStyle || jsPlumb.Defaults.LabelStyle;
			this.label = params.label;
			if (this.label) {
				this.overlays.push(new jsPlumb.Overlays.Label( {
					labelStyle : this.labelStyle,
					label : this.label
				}));
			}

			_updateOffset( { elId : this.sourceId });
			_updateOffset( { elId : this.targetId });

			// functions for mouse hover/select functionality
			this.distanceFrom = function(point) { return self.connector.distanceFrom(point); };

			this.setLabel = function(l) {
				self.label = l;
				_currentInstance.repaint(self.source);
			};

			// paint the endpoints
			var myOffset = offsets[this.sourceId], myWH = sizes[this.sourceId];
			var otherOffset = offsets[this.targetId];
			otherWH = sizes[this.targetId];
			// todo: why not fold this and the paint call that follows into one
			// call?
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

			var canvas = _newCanvas(jsPlumb.connectorClass, self.container);
			this.canvas = canvas;

			/*
			 * Function: paint 
			 * 
			 * paints the connection. 
			 * 
			 * Parameters:
			 * 	elId Id of the element that is in motion 
			 * 	ui current library's event system ui object (present if we came from a drag to get here) 
			 */
			this.paint = function(params) {
				params = params || {};
				var elId = params.elId, ui = params.ui, recalc = params.recalc, timestamp = params.timestamp;
				var fai = self.floatingAnchorIndex;
				// if the moving object is not the source we must transpose the
				// two references.
				var swap = false;
				var tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId;
				var tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;
				var el = swap ? this.target : this.source;

				if (this.canvas.getContext) {
					_updateOffset( { elId : elId, offset : ui, recalc : recalc, timestamp : timestamp });
					_updateOffset( { elId : tId, timestamp : timestamp }); // update the target if this is a forced repaint. otherwise, only the source has been moved.
				//	var myOffset = offsets[sId], otherOffset = offsets[tId], myWH = sizes[sId], otherWH = sizes[tId];
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

					var dim = this.connector.compute(sAnchorP, tAnchorP, this.endpoints[sIdx].anchor, this.endpoints[tIdx].anchor, this.paintStyle.lineWidth, maxSize);
					jsPlumb.sizeCanvas(canvas, dim[0], dim[1], dim[2], dim[3]);

					var _paintOneStyle = function(ctx, paintStyle) {
						ctx.save();
						jsPlumb.extend(ctx, paintStyle);
						if (paintStyle.gradient && !ie) {
							var g = self.connector.createGradient(dim, ctx, (elId == this.sourceId));
							for ( var i = 0; i < paintStyle.gradient.stops.length; i++)
								g.addColorStop(paintStyle.gradient.stops[i][0], paintStyle.gradient.stops[i][1]);
							ctx.strokeStyle = g;
						}
						self.connector.paint(dim, ctx);
						ctx.restore();
					};

					// first check for the background style
					if (this.backgroundPaintStyle != null) {
						_paintOneStyle(ctx, this.backgroundPaintStyle);
					}
					_paintOneStyle(ctx, this.paintStyle);

					// paint overlays
					for ( var i = 0; i < self.overlays.length; i++) {
						var o = self.overlays[i];
						o.draw(self.connector, ctx);
					}
				}
			};

			// TODO: should this take a timestamp? probably. it reduces the
			// amount of time
			// spent figuring out anchor locations.
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
		};

		/*
		 * Class: Endpoint Models an endpoint. Can have one to N connections
		 * emanating from it (although how to handle that in the UI is a very
		 * good question). also has a Canvas and paint style.
		 */

		/*
		 * Function: Endpoint This is the Endpoint class constructor.
		 * Parameters: anchor - anchor for the endpoint, of type jsPlumb.Anchor.
		 * may be null. endpoint - endpoint object, of type jsPlumb.Endpoint.
		 * may be null. style - endpoint style, a js object. may be null. source -
		 * element the endpoint is attached to, of type jquery object. Required.
		 * canvas - canvas element to use. may be, and most often is, null.
		 * connections - optional list of connections to configure the endpoint
		 * with. isSource - boolean. indicates the endpoint can act as a source
		 * of new connections. optional. dragOptions - if isSource is set to
		 * true, you can supply arguments for the jquery draggable method.
		 * optional. connectionStyle - if isSource is set to true, this is the
		 * paint style for connections from this endpoint. optional. connector -
		 * optional connector type to use. isTarget - boolean. indicates the
		 * endpoint can act as a target of new connections. optional.
		 * dropOptions - if isTarget is set to true, you can supply arguments
		 * for the jquery droppable method. optional. reattach - optional
		 * boolean that determines whether or not the connections reattach after
		 * they have been dragged off an endpoint and left floating. defaults to
		 * false: connections dropped in this way will just be deleted.
		 */
		var Endpoint = function(params) {
			params = params || {};
			var self = this;
			var id = new String('_jsplumb_e_' + (new Date()).getTime());
			this.getId = function() { return id; };
			if (params.dynamicAnchors)
				self.anchor = new DynamicAnchor(jsPlumb.makeAnchors(params.dynamicAnchors));
			else 			
				self.anchor = params.anchor ? jsPlumb.makeAnchor(params.anchor) : params.anchors ? jsPlumb.makeAnchor(params.anchors) : jsPlumb.makeAnchor("TopCenter");
			var _endpoint = params.endpoint || new jsPlumb.Endpoints.Dot();
			if (_endpoint.constructor == String) _endpoint = new jsPlumb.Endpoints[_endpoint]();
			self.endpoint = _endpoint;
			var _style = params.style || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
			this.connectorStyle = params.connectorStyle;
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
			this.canvas = params.canvas || _newCanvas(jsPlumb.endpointClass, this.container, params.uuid);
			this.connections = params.connections || [];
			this.scope = params.scope || DEFAULT_SCOPE;
			this.timestamp = null;
			var _reattach = params.reattach || false;
			this.dragAllowedWhenFull = params.dragAllowedWhenFull || true;

			this.computeAnchor = function(params) {
				return self.anchor.compute(params);
			};
			this.addConnection = function(connection) {
				self.connections.push(connection);
			};			
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

			/**
			 * detaches all connections this Endpoint has
			 */
			this.detachAll = function() {
				while (self.connections.length > 0) {
					self.detach(self.connections[0]);
				}
			};

			/**
			 * removes any connections from this Endpoint that are connected to
			 * the given target endpoint.
			 * 
			 * @param targetEndpoint
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
					self.detach(c[i]);
				}
			};
			
			/**
			 * detach this Endpoint from the Connection, but leave the Connection alive. used when dragging.
			 */
			this.detachFromConnection = function(connection) {
				var idx = _findIndex(self.connections, connection);
				if (idx >= 0) {
					self.connections.splice(idx, 1);
				}
			};

			/**
			 * returns the DOM element this Endpoint is attached to.
			 */
			this.getElement = function() {
				return _element;
			};

			/**
			 * returns the UUID for this Endpoint, if there is one.
			 */
			this.getUuid = function() {
				return _uuid;
			};

			/**
			 * private but must be exposed.
			 */
			this.makeInPlaceCopy = function() {
				var e = new Endpoint( { anchor : self.anchor, source : _element, style : _style, endpoint : _endpoint });
				return e;
			};

			/**
			 * returns whether or not this endpoint is connected to the given
			 * endpoint.
			 * 
			 * @param endpoint
			 *            Endpoint to test.
			 * @since 1.1.1
			 * 
			 * todo: needs testing. will this work if the endpoint passed in is
			 * the source?
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
			 * 
			 * @returns {Boolean}
			 */
			this.isFloating = function() {
				return floatingEndpoint != null;
			};
			
			/**
			 * returns a connection from the pool; used when dragging starts.  just gets the head of the array if it can.
			 */
			var connectorSelector = function() {
				return (self.connections.length < _maxConnections) ? null : self.connections[0];
			};

			/**
			 * @returns whether or not the Endpoint can accept any more
			 *          Connections.
			 */
			this.isFull = function() {
				return _maxConnections < 1 ? false : (self.connections.length >= _maxConnections);
			};

			/**
			 * sets whether or not connnctions can be dragged from this Endpoint
			 * once it is full. you would use this in a UI in which you're going
			 * to provide some other way of breaking connections, if you need to
			 * break them at all. this property is by default true; use it in
			 * conjunction with the 'reattach' option on a connect call.
			 */
			this.setDragAllowedWhenFull = function(allowed) {
				self.dragAllowedWhenFull = allowed;
			};

			/**
			 * a deep equals check. everything must match, including the anchor,
			 * styles, everything. TODO: finish Endpoint.equals
			 */
			this.equals = function(endpoint) {
				return this.anchor.equals(endpoint.anchor);
			};

			/**
			 * paints the Endpoint, recalculating offset and anchor positions if
			 * necessary.
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
					_endpoint.paint(ap, self.anchor.getOrientation(), canvas || self.canvas, _style, connectorPaintStyle || _style);
					self.timestamp = timestamp;
				}
			};

			/**
			 * @deprecated
			 */
			this.removeConnection = this.detach; // backwards compatibility

			// is this a connection source? we make it draggable and have the
			// drag listener
			// maintain a connection with a floating endpoint.
			if (params.isSource && jsPlumb.CurrentLibrary.isDragSupported(_element)) {
				var n = null, id = null, jpc = null, existingJpc = false, existingJpcParams = null;
				var start = function() {
					jpc = connectorSelector();
					if (self.isFull() && !self.dragAllowedWhenFull) return false;
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
					floatingEndpoint = new Endpoint({ style : { fillStyle : 'rgba(0,0,0,0)' }, endpoint : _endpoint, anchor : floatingAnchor, source : nE });

					if (jpc == null) {                                                                                                                                                         
						self.anchor.locked = true;
						// create a connection. one end is this endpoint, the
						// other is a floating endpoint.
						jpc = new Connection( {
							sourceEndpoint : self,
							targetEndpoint : floatingEndpoint,
							source : _getElementObject(_element),
							target : _getElementObject(n),
							anchors : [ self.anchor, floatingAnchor ],
							paintStyle : params.connectorStyle, // this can be null. Connection will use the default.
							connector : params.connector, // this can also be null. Connection will use the default.
							overlays : self.connectorOverlays // new in 1.2.4.
						});
					} else {
						existingJpc = true;
						// if existing connection, allow to be dropped back on the source endpoint (issue 51).
						_initDropTarget(_getElementObject(inPlaceCopy.canvas));
						var anchorIdx = jpc.sourceId == _elementId ? 0 : 1;
						jpc.floatingAnchorIndex = anchorIdx;
						// detach from the connection while dragging is occurring.
						self.detachFromConnection(jpc);
						if (anchorIdx == 0) {
							existingJpcParams = [ jpc.source, jpc.sourceId ];
							jpc.source = _getElementObject(n);
							jpc.sourceId = id;
						} else {
							existingJpcParams = [ jpc.target, jpc.targetId ];
							jpc.target = _getElementObject(n);
							jpc.targetId = id;
						}
						// lock the other endpoint; if it is dynamic it will not
						// move while the drag is occurring.
						jpc.endpoints[anchorIdx == 0 ? 1 : 0].anchor.locked = true;
						// store the original endpoint and assign the new
						// floating endpoint for the drag.
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
									source : idx == 0 ? suspendedElement : jpc.source, target : idx == 1 ? suspendedElement : jpc.target,
									sourceId : idx == 0 ? suspendedElementId : jpc.sourceId, targetId : idx == 1 ? suspendedElementId : jpc.targetId,
									sourceEndpoint : idx == 0 ? jpc.suspendedEndpoint : jpc.endpoints[0], targetEndpoint : idx == 1 ? jpc.suspendedEndpoint : jpc.endpoints[1]
								});
							}
							
							jsPlumb.repaint(elId);
							
							_currentInstance.fireUpdate("jsPlumbConnection", {
								source : jpc.source, target : jpc.target,
								sourceId : jpc.sourceId, targetId : jpc.targetId,
								sourceEndpoint : jpc.endpoints[0], targetEndpoint : jpc.endpoints[1]
							});								
						}
			
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

		/*
		 * Property: Defaults These are the default settings for jsPlumb, that
		 * is what will be used if you do not supply specific pieces of
		 * information to the various API calls. A convenient way to implement
		 * your own look and feel can be to override these defaults by including
		 * a script somewhere after the jsPlumb include, but before you make any
		 * calls to jsPlumb, for instance in this example we set the PaintStyle
		 * to be a blue line of 27 pixels: > jsPlumb.Defaults.PaintStyle = {
		 * lineWidth:27, strokeStyle:'blue' }
		 */
		this.Defaults = {
			Anchor : null,
			Anchors : [ null, null ],
			BackgroundPaintStyle : null,
			Connector : null,
			Container : null,
			DragOptions : {},
			DropOptions : {},
			Endpoint : null,
			Endpoints : [ null, null ],
			EndpointStyle : {
				fillStyle : null
			},
			EndpointStyles : [ null, null ],
			LabelStyle : {
				fillStyle : "rgba(0,0,0,0)",
				color : "black"
			},
			LogEnabled : true,
			MaxConnections : null,
			// TODO: should we have OverlayStyle too?
			PaintStyle : {
				lineWidth : 10,
				strokeStyle : 'red'
			},
			Scope : "_jsPlumb_DefaultScope"
		};

		this.logEnabled = this.Defaults.LogEnabled;

		/*
		 * Property: connectorClass The CSS class to set on Connection canvas
		 * elements. This value is a String and can have multiple classes; the
		 * entire String is appended as-is.
		 */
		this.connectorClass = '_jsPlumb_connector';

		/*
		 * Property: endpointClass The CSS class to set on Endpoint canvas
		 * elements. This value is a String and can have multiple classes; the
		 * entire String is appended as-is.
		 */
		this.endpointClass = '_jsPlumb_endpoint';

		/*
		 * Property: overlayClass The CSS class to set on an Overlay that is an
		 * HTML element. This value is a String and can have multiple classes;
		 * the entire String is appended as-is.
		 */
		this.overlayClass = '_jsPlumb_overlay';

		/*
		 * Property: Anchors Default jsPlumb Anchors. These are supplied in the
		 * file jsPlumb-defaults-x.x.x.js, which is merged in with the main
		 * jsPlumb script to form <library>.jsPlumb-all-x.x.x.js. You can
		 * provide your own Anchors by supplying them in a script that is loaded
		 * after jsPlumb, for instance: > jsPlumb.Anchors.MyAnchor = {
		 * ....anchor code here. see the documentation. }
		 */
		this.Anchors = {};

		/*
		 * Property: Connectors Default jsPlumb Connectors. These are supplied
		 * in the file jsPlumb-defaults-x.x.x.js, which is merged in with the
		 * main jsPlumb script to form <library>.jsPlumb-all-x.x.x.js. You can
		 * provide your own Connectors by supplying them in a script that is
		 * loaded after jsPlumb, for instance: > jsPlumb.Connectors.MyConnector = {
		 * ....connector code here. see the documentation. }
		 */
		this.Connectors = {};

		/*
		 * Property: Endpoints Default jsPlumb Endpoints. These are supplied in
		 * the file jsPlumb-defaults-x.x.x.js, which is merged in with the main
		 * jsPlumb script to form <library>.jsPlumb-all-x.x.x.js. You can
		 * provide your own Endpoints by supplying them in a script that is
		 * loaded after jsPlumb, for instance: > jsPlumb.Endpoints.MyEndpoint = {
		 * ....endpoint code here. see the documentation. }
		 */
		this.Endpoints = {};

		/*
		 * Property:Overlays Default jsPlumb Overlays such as Arrows and Labels.
		 * These are supplied in the file jsPlumb-defaults-x.x.x.js, which is
		 * merged in with the main jsPlumb script to form
		 * <library>.jsPlumb-all-x.x.x.js. You can provide your own Overlays by
		 * supplying them in a script that is loaded after jsPlumb, for
		 * instance: > jsPlumb.Overlays.MyOverlay = { ....overlay code here. see
		 * the documentation. }
		 */
		this.Overlays = {};

		/*
		 * Function: addEndpoint Adds an Endpoint to a given element.
		 * Parameters: target - Element to add the endpoint to. either an
		 * element id, or a selector representing some element. params - Object
		 * containing Endpoint options (more info required) Returns: The newly
		 * created Endpoint. See Also: <addEndpoints>
		 */
		this.addEndpoint = function(target, params) {
			params = jsPlumb.extend( {}, params);
			params.endpoint = params.endpoint || _currentInstance.Defaults.Endpoint || jsPlumb.Defaults.Endpoint;
			params.endpointStyle = params.endpointStyle || _currentInstance.Defaults.EndpointStyle || jsPlumb.Defaults.EndpointStyle;
			var el = _getElementObject(target), id = _getAttribute(el, "id");
			params.source = el;
			_updateOffset({ elId : id });
			var e = new Endpoint(params);
			_addToList(endpointsByElement, id, e);
			var myOffset = offsets[id], myWH = sizes[id];
			var anchorLoc = e.anchor.compute( { xy : [ myOffset.left, myOffset.top ], wh : myWH, element : e });
			e.paint({ anchorLoc : anchorLoc });
			return e;
		};

		/*
		 * Function: addEndpoint Adds a list of Endpoints to a given element.
		 * Parameters: target - element to add the endpoint to. either an
		 * element id, or a selector representing some element. endpoints - List
		 * of objects containing Endpoint options. one Endpoint is created for
		 * each entry in this list. Returns: List of newly created Endpoints,
		 * one for each entry in the 'endpoints' argument. See Also:
		 * <addEndpoint>
		 */
		this.addEndpoints = function(target, endpoints) {
			var results = [];
			for ( var i = 0; i < endpoints.length; i++) {
				results.push(_currentInstance.addEndpoint(target, endpoints[i]));
			}
			return results;
		};

		/*
		 * Function: animate Wrapper around supporting library's animate
		 * function; injects a call to jsPlumb in the 'step' function (creating
		 * it if necessary). This only supports the two-arg version of the
		 * animate call in jQuery - the one that takes an 'options' object as
		 * the second arg. MooTools has only one method - a two arg one. Which
		 * is handy. Parameters: el - Element to animate. Either an id, or a
		 * selector representing the element. properties - The 'properties'
		 * argument you want passed to the standard jQuery animate call. options -
		 * The 'options' argument you want passed to the standard jQuery animate
		 * call. Returns: void
		 */
		this.animate = function(el, properties, options) {
			var ele = _getElementObject(el), id = _getAttribute(el, "id");
			options = options || {};
			var stepFunction = jsPlumb.CurrentLibrary.dragEvents['step'];
			var completeFunction = jsPlumb.CurrentLibrary.dragEvents['complete'];
			options[stepFunction] = _wrap(options[stepFunction], function() {
				_currentInstance.repaint(id);
			});

			// you know, probably onComplete should repaint too. that will help
			// keep up
			// with fast animations.
			options[completeFunction] = _wrap(options[completeFunction],
					function() {
						_currentInstance.repaint(id);
					});

			jsPlumb.CurrentLibrary.animate(ele, properties, options);
		};		

		/*
		 * Function: connect Establishes a connection between two elements.
		 * Parameters: params - Object containing setup for the connection. see
		 * documentation. Returns: The newly created Connection.
		 */
		this.connect = function(params) {
			var _p = jsPlumb.extend( {}, params);
			// test for endpoint uuids to connect
			if (params.uuids) {
				_p.sourceEndpoint = _getEndpoint(params.uuids[0]);
				_p.targetEndpoint = _getEndpoint(params.uuids[1]);
			}

			// now ensure that if we do have Endpoints already, they're not
			// full.
			if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
				_log("could not add connection; source endpoint is full");
				return;
			}

			if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
				_log("could not add connection; target endpoint is full");
				return;
			}
			
			// dynamic anchors
			if (_p.dynamicAnchors) {
				// these can either be an array of anchor coords, which we will use for both source and target, or an object with {source:[anchors], target:[anchors]}, in which
				// case we will use a different set for each element.
				var a = _p.dynamicAnchors.constructor == Array;
				var sa = a ? new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors)) : new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors.source));
				var ta = a ? new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors)) : new DynamicAnchor(jsPlumb.makeAnchors(_p.dynamicAnchors.target));
				_p.anchors = [sa,ta];
			}

			var jpc = new Connection(_p);
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
		 
		 	deletes an endpoint and removes all connections it has (which removes the connections from the other endpoints involved too)
		  
		 	You can call this with either a string uuid, or an Endpoint
		  
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
		 * Function: deleteEveryEndpoint
		 *  
		 * Deletes every Endpoint in this instance
		 * of jsPlumb. Use this instead of removeEveryEndpoint now.  
		 * 
		 * Returns: void 
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
		 * Function: 
		 *   detach Removes a connection.  takes either (source, target) (the old way, maintained for backwards compatibility), or a params
		 *   object with various possible values.
		 * 
		 *  
		 * Parameters: 
		 *   source - id or element object of the first element in the connection. 
		 *   target - id or element object of the second element in the connection.
		 *   
		 *    OR
		 *    
		 *   params:
		 *     {
		 *   
		 *   Returns: true if successful, false if not.
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
								fireDetachEvent(jpc);
							}
						});
			}
			// this is the new version of the method, taking a JS object like
			// the connect method does.
			else if (arguments.length == 1) {
				if (arguments[0].constructor == Connection) {
					arguments[0].endpoints[0].detachFrom(arguments[0].endpoints[1]);
					fireDetachEvent(arguments[0]);
				}
				else if (arguments[0].connection) {
					arguments[0].connection.endpoints[0].detachFrom(arguments[0].connection.endpoints[1]);
					fireDetachEvent(arguments[0].connection);
				}
				else {
					var _p = jsPlumb.extend( {}, source); // a backwards compatibility hack: source should be thought of as 'params' in this case.
					// test for endpoint uuids to detach
					if (_p.uuids) {
						_getEndpoint(_p.uuids[0]).detachFrom(_getEndpoint(_p.uuids[1]));
					} else if (_p.sourceEndpoint && _p.targetEndpoint) {
						_p.sourceEndpoint.detachFrom(_p.targetEndpoint);
					} else {
						sourceId = _getId(_p.source);
						targetId = _getId(_p.target);
						_operation(sourceId, function(jpc) {
									if ((jpc.sourceId == sourceId && jpc.targetId == targetId) || (jpc.targetId == sourceId && jpc.sourceId == targetId)) {
										_removeElement(jpc.canvas, jpc.container);
										jpc.endpoints[0].removeConnection(jpc);
										jpc.endpoints[1].removeConnection(jpc);
										_removeFromList(connectionsByScope, jpc.scope, jpc);
										fireDetachEvent(jpc);
									}
								});
					}
				}
			}
		};

		/*
		 * Function: detachAll Removes all an element's connections. Parameters:
		 * el - either the id of the element, or a selector for the element.
		 * Returns: void
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
		 * Function: detachEverything Remove all Connections from all elements,
		 * but leaves Endpoints in place. Returns: void See Also:
		 * <removeEveryEndpoint>
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
		 * Function: draggable initialises the draggability of some element or
		 * elements. Parameters: el - either an element id, a list of element
		 * ids, or a selector. options - options to pass through to the
		 * underlying library Returns: void
		 */
		this.draggable = function(el, options) {
			if (typeof el == 'object' && el.length) {
				for ( var i = 0; i < el.length; i++) {
					var ele = _getElementObject(el[i]);
					if (ele) _initDraggableIfNecessary(ele, true, options);
				}
			} 
			else if (el._nodes) { 	// this is YUI specific; really the logic should be forced
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
		 * Function: extend Wraps the underlying library's extend functionality.
		 * Parameters: o1 - object to extend o2 - object to extend o1 with
		 * Returns: o1, extended with all properties from o2.
		 */
		this.extend = function(o1, o2) {
			return jsPlumb.CurrentLibrary.extend(o1, o2);
		};

		/*
		 * Function: getConnections Gets all or a subset of connections
		 * currently managed by this jsPlumb instance. Parameters: options - a
		 * JS object that holds options defining what sort of connections you're
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
		 * Function: getDefaultScope Gets the default scope for connections and
		 * endpoints. a scope defines a type of endpoint/connection; supplying a
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
		 * Function: getEndpoint gets an Endpoint by UUID Parameters: uuid - the
		 * UUID for the Endpoint Returns: Endpoint with the given UUID, null if
		 * nothing found.
		 */
		this.getEndpoint = _getEndpoint;

		/*
		 * gets an element's id, creating one if necessary. really only exposed
		 * for the lib-specific functionality to access; would be better to pass
		 * the current instance into the lib-specific code (even though this is
		 * a static call. i just don't want to expose it to the public API).
		 */
		this.getId = _getId;

		/*
		 * Function: hide Sets an element's connections to be hidden.
		 * Parameters: el - either the id of the element, or a selector for the
		 * element. Returns: void
		 */
		this.hide = function(el) {
			_setVisible(el, "none");
		};

		/*
		 * Function: makeAnchor Creates an anchor with the given params.
		 * 
		 * You do not need to use this method.  It is exposed because of the way jsPlumb is
		 * split into three scripts; this will change in the future. 
		 * 
		 * Parameters: x - the x location of the anchor as a fraction of the
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
		 * Function: repaint Repaints an element and its connections. This
		 * method gets new sizes for the elements before painting anything.
		 * Parameters: el - either the id of the element or a selector
		 * representing the element. Returns: void See Also: <repaintEverything>
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
		 * Function: repaintEverything Repaints all connections. 
		 * Returns: void
		 * See Also: <repaint>
		 */
		this.repaintEverything = function() {
			var timestamp = _timestamp();
			for ( var elId in endpointsByElement) {
				_draw(_getElementObject(elId), null, timestamp);
			}
		};

		/*
		 * Function: removeAllEndpoints 
		 * Removes all Endpoints associated with a given element. Also removes all Connections associated with each Endpoint it removes.
		 * Parameters: el - either an element id, or a selector for an element. 
		 * Returns: void 
		 * See Also: <removeEndpoint>
		 */
		this.removeAllEndpoints = function(el) {
			var elId = _getAttribute(el, "id");
			var ebe = endpointsByElement[elId];
			for ( var i in ebe) 
				_currentInstance.deleteEndpoint(ebe[i]);
			endpointsByElement[elId] = [];
		};

		/*
		 * Function: removeEveryEndpoint 
		 * Removes every Endpoint in this instance
		 * of jsPlumb. 
		 * 
		 * Returns: void 
		 * 
		 * See Also: <removeAllEndpoints> <removeEndpoint>
		 * 
		 * @deprecated use deleteEveryEndpoint instead
		 */
		this.removeEveryEndpoint = this.deleteEveryEndpoint;
		
		/**
		 * Function: removeEndpoint Removes the given Endpoint from the given
		 * element. Parameters: el - either an element id, or a selector for an
		 * element. endpoint - Endpoint to remove. this is an Endpoint object,
		 * such as would have been returned from a call to addEndpoint. Returns:
		 * void See Also: <removeAllEndpoints> <removeEveryEndpoint>
		 * 
		 * @deprecated Use jsPlumb.deleteEndpoint instead (and note you dont need to supply the element. it's irrelevant).
		 */
		this.removeEndpoint = function(el, endpoint) {
			_currentInstance.deleteEndpoint(endpoint);
		};

		/**
		 * Function:reset 
		 * removes all endpoints and connections and clears the
		 * listener list. to keep listeners just call jsPlumb.deleteEveryEndpoint.  
		 */
		this.reset = function() {
			this.deleteEveryEndpoint();
			this.clearListeners();
		};

		/*
		 * Function: setAutomaticRepaint Sets/unsets automatic repaint on window
		 * resize. Parameters: value - whether or not to automatically repaint
		 * when the window is resized. Returns: void
		 */
		this.setAutomaticRepaint = function(value) {
			automaticRepaint = value;
		};

		/*
		 * Function: setDefaultNewCanvasSize Sets the default size jsPlumb will
		 * use for a new canvas (we create a square canvas so one value is all
		 * that is required). This is a hack for IE, because ExplorerCanvas
		 * seems to need for a canvas to be larger than what you are going to
		 * draw on it at initialisation time. The default value of this is 1200
		 * pixels, which is quite large, but if for some reason you're drawing
		 * connectors that are bigger, you should adjust this value
		 * appropriately. Parameters: size - The default size to use. jsPlumb
		 * will use a square canvas so you need only supply one value. Returns:
		 * void
		 */
		this.setDefaultNewCanvasSize = function(size) {
			DEFAULT_NEW_CANVAS_SIZE = size;
		};

		/*
		 * Function: setDefaultScope Sets the default scope for connections and
		 * endpoints. a scope defines a type of endpoint/connection; supplying a
		 * scope to an endpoint or connection allows you to support different
		 * types of connections in the same UI. but if you're only interested in
		 * one type of connection, you don't need to supply a scope. this method
		 * will probably be used by very few people; it just instructs jsPlumb
		 * to use a different key for the default scope.
		 */
		this.setDefaultScope = function(scope) {
			DEFAULT_SCOPE = scope;
		};

		/*
		 * Function: setDraggable Sets whether or not a given element is
		 * draggable, regardless of what any plumb command may request.
		 * Parameters: el - either the id for the element, or a selector
		 * representing the element. Returns: void
		 */
		this.setDraggable = _setDraggable;

		/*
		 * Function: setDraggableByDefault Sets whether or not elements are
		 * draggable by default. Default for this is true. Parameters: draggable -
		 * value to set Returns: void
		 */
		this.setDraggableByDefault = function(draggable) {
			_draggableByDefault = draggable;
		};

		this.setDebugLog = function(debugLog) {
			log = debugLog;
		};

		/*
		 * Function: setRepaintFunction Sets the function to fire when the
		 * window size has changed and a repaint was fired. Parameters: f -
		 * Function to execute. Returns: void
		 */
		this.setRepaintFunction = function(f) {
			repaintFunction = f;
		};

		/*
		 * Function: show Sets an element's connections to be visible.
		 * Parameters: el - either the id of the element, or a selector for the
		 * element. Returns: void
		 */
		this.show = function(el) {
			_setVisible(el, "block");
		};

		/*
		 * Function: sizeCanvas Helper to size a canvas. You would typically use
		 * this when writing your own Connector or Endpoint implementation.
		 * Parameters: x - [int] x position for the Canvas origin y - [int] y
		 * position for the Canvas origin w - [int] width of the canvas h -
		 * [int] height of the canvas Returns: void
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
		 * Function: toggleVisible Toggles visibility of an element's
		 * connections. Parameters: el - either the element's id, or a selector
		 * representing the element. Returns: void, but should be updated to
		 * return the current state
		 */
		// TODO: update this method to return the current state.
		this.toggleVisible = _toggleVisible;

		/*
		 * Function: toggleDraggable Toggles draggability (sic) of an element's
		 * connections. Parameters: el - either the element's id, or a selector
		 * representing the element. Returns: The current draggable state.
		 */
		this.toggleDraggable = _toggleDraggable;

		/*
		 * Function: unload Unloads jsPlumb, deleting all storage. You should
		 * call this from an onunload attribute on the <body> element Returns:
		 * void
		 */
		this.unload = function() {
			delete endpointsByElement;
			delete endpointsByUUID;
			delete offsets;
			delete sizes;
			delete floatingConnections;
			delete draggableStates;
		};

		/*
		 * Function: wrap 
		 * 
		 * Helper method to wrap an existing function with one of
		 * your own. This is used by the various implementations to wrap event
		 * callbacks for drag/drop etc; it allows jsPlumb to be transparent in
		 * its handling of these things. If a user supplies their own event
		 * callback, for anything, it will always be called. 
		 */
		this.wrap = _wrap;
		
		EventGenerator.apply(this);
		this.addListener = this.bind;

	};

	var jsPlumb = window.jsPlumb = new jsPlumbInstance();
	jsPlumb.getInstance = function(_defaults) {
		var j = new jsPlumbInstance();
		if (_defaults) jsPlumb.extend(j.Defaults, _defaults);
		return j;
	};
})();
/*
* jsPlumb-defaults-1.2.4-RC1
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
        	var yp = _m == Infinity ? xp + _b : (_m * xp) + _b;
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
        	var y =  Math.abs(distance * Math.sin(_theta));
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

        var _CP, _CP2, _sx, _tx, _sx, _sy, _canvasX, _canvasY, _w, _h;
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
         * returns the distance the given point is from the curve.  not enabled for 1.2.3.  didnt make the cut.  next time.
         */
        this.distanceFrom = function(point) {
        	var curve = [ {x:currentPoints[4], y:currentPoints[5]},
        				  {x:currentPoints[8], y:currentPoints[9]}, 
        				  {x:currentPoints[10], y:currentPoints[11]}, 
        				  {x:currentPoints[6], y:currentPoints[7]}];
        	return (jsBezier.distanceFromCurve(point, curve));        	        	
        }; 
        
        this.nearestPointTo = function(point) {
        	var curve = [ {x:currentPoints[4], y:currentPoints[5]},
        				  {x:currentPoints[8], y:currentPoints[9]}, 
        				  {x:currentPoints[10], y:currentPoints[11]}, 
        				  {x:currentPoints[6], y:currentPoints[7]}];
        	return (jsBezier.nearestPointOnCurve(point, curve));
        	
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
	        	
		params = params || { width:15, height:15 };
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
    			actuallyPaint(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle)
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
	 */
	jsPlumb.Overlays.Arrow = function(params) {
		params = params || {};
		var self = this;
    	var length = params.length || 20;
    	var width = params.width || 20;
    	var fillStyle = params.fillStyle || "black";
    	var strokeStyle = params.strokeStyle;
    	var lineWidth = params.lineWidth || 1;
    	this.loc = params.location || 0.5;
    	// how far along the arrow the lines folding back in come to. default is 62.3%. 
    	var foldback = params.foldback || 0.623;
    	var _getFoldBackPoint = function(connector, loc) {
    		if (foldback == 0.5) return connector.pointOnPath(loc);
    		else {
    			var adj = 0.5 - foldback; // we calculate relative to the center
    			return connector.pointAlongPathFrom(loc, length * adj);        			
    		}
    	};
    	
    	this.computeMaxSize = function() { return width * 1.5; }
    	
    	this.draw = function(connector, ctx) {
    		// this is the arrow head position    		
			var hxy = connector.pointAlongPathFrom(self.loc, length / 2);		
			// this is the center of the tail
			var txy = connector.pointAlongPathFrom(self.loc, -length / 2), tx = txy.x, ty = txy.y;
			// this is the tail vector
			var tail = connector.perpendicularToPathAt(self.loc, width, -length / 2);
			// this is the point the tail goes in to
			var cxy = _getFoldBackPoint(connector, self.loc);
			
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.moveTo(hxy.x, hxy.y);
			ctx.lineTo(tail[0].x, tail[0].y);
			ctx.lineTo(cxy.x, cxy.y);
			ctx.lineTo(tail[1].x, tail[1].y);
			ctx.lineTo(hxy.x, hxy.y);
			ctx.closePath();
			
			if (strokeStyle) {
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}
			ctx.fillStyle = fillStyle;			
			ctx.fill();
    	}
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
    	
	    this.draw = function(connector, ctx) {	
	    	var td = _textDimensions(ctx);
	    	if (td.width) {
				var cxy = connector.pointOnPath(self.location);
				if (self.labelStyle.font) ctx.font = self.labelStyle.font;		            		            		           
				if (self.labelStyle.fillStyle) 
					ctx.fillStyle = self.labelStyle.fillStyle;
				else 
					ctx.fillStyle = "rgba(0,0,0,0)";
				ctx.fillRect(cxy.x - (td.width / 2), cxy.y - (td.height / 2) , td.width , td.height );
				
				if (self.labelStyle.color) ctx.fillStyle = self.labelStyle.color;					
				ctx.textBaseline = "middle";
				ctx.textAlign = "center";
				for (i = 0; i < td.lines.length; i++) { 
					ctx.fillText(td.lines[i],cxy.x, cxy.y - (td.textHeight / 2) + (td.oneLine/2) + (i*td.oneLine));
				}
				
				// border
				if (self.labelStyle.borderWidth > 0) {
					ctx.strokeStyle = self.labelStyle.borderStyle || "black";
					ctx.strokeRect(cxy.x - (td.width / 2), cxy.y - (td.height / 2) , td.width , td.height );
				}
        	}
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
		};
		this.img.src = params.src || params.url;
		
		notReadyInterval = window.setInterval(_init, 250);
    	
    	this.computeMaxSize = function(connector, ctx) {
    		return [self.img.width, self.img.height]
    	};
    	
    	var _draw = function(connector, ctx) {
    		var cxy = connector.pointOnPath(self.location);
    		var canvas = jsPlumb.CurrentLibrary.getElementObject(ctx.canvas);
    		var canvasOffset = jsPlumb.CurrentLibrary.getOffset(canvas);    		
    		var o = {left:canvasOffset.left + cxy.x - (self.img.width/2), top:canvasOffset.top + cxy.y - (self.img.height/2)};
    		jsPlumb.CurrentLibrary.setOffset(imgDiv, o);
    		imgDiv.style.display = "block";
    	};
    	
    	this.draw = function(connector, ctx) {
    		if (self.ready)
	    		_draw(connector, ctx);
    		else {
    			notReadyConnector = connector;
    			notReadyContext = ctx;
    		}
    	};
    };       
})();/*
 * mootools.jsPlumb 1.2.5-RC1
 * 
 * MooTools specific functionality for jsPlumb.
 * 
 * http://morrisonpitt.com/jsPlumb/demo.html
 * http://code.google.com/p/jsPlumb
 * 
 * NOTE: for production usage you should use mootools.jsPlumb-all-x.x.x-min.js, which contains the main jsPlumb script and this script together,
 * in a minified file.
 * 
 * Dual licensed under MIT and GPL2.
 * 
 */ 

(function() {
	
	/*
	 * overrides the FX class to inject 'step' functionality, which MooTools does not
	 * offer, and which makes me sad.  they don't seem keen to add it, either, despite
	 * the fact that it could be useful:
	 * 
	 * https://mootools.lighthouseapp.com/projects/2706/tickets/668
	 * 
	 */
	var jsPlumbMorph = new Class({
		Extends:Fx.Morph,
		onStep : null,
		initialize : function(el, options) {
			this.parent(el, options);
			if (options['onStep']) {
				this.onStep = options['onStep'];
			}
		},
		step : function() {
			this.parent();
			if (this.onStep) { 
				try { this.onStep(); } 
				catch(e) { } 
			}
		}
	});
	
	var _droppables = {};
	var _droppableOptions = {};
	var _draggablesByScope = {};
	var _draggablesById = {};
	/*
	 * 
	 */
	var _executeDroppableOption = function(el, dr, event) {
		if (dr) {
			var id = dr.get("id");
			if (id) {
				var options = _droppableOptions[id];
				if (options) {
					if (options[event]) {
						options[event](el, dr);
					}
				}
			}
		}
	};	
	
	var _checkHover = function(el, entering) {
		if (el) {
			var id = el.get("id");
			if (id) {
				var options = _droppableOptions[id];
				if (options) {
					if (options['hoverClass']) {
						if (entering) el.addClass(options['hoverClass']);
						else el.removeClass(options['hoverClass']);
					}
				}
			}
		}
	};

	/**
	 * adds the given value to the given list, with the given scope. creates the scoped list
	 * if necessary.
	 * used by initDraggable and initDroppable.
	 */
	var _add = function(list, scope, value) {
		var l = list[scope];
		if (!l) {
			l = [];
			list[scope] = l;
		}
		l.push(value);
	};
	
	/*
	 * gets an "element object" from the given input.  this means an object that is used by the
	 * underlying library on which jsPlumb is running.  'el' may already be one of these objects,
	 * in which case it is returned as-is.  otherwise, 'el' is a String, the library's lookup 
	 * function is used to find the element, using the given String as the element's id.
	 */
	var _getElementObject = function(el) {
		return $(el);
	};

		
	jsPlumb.CurrentLibrary = {					
		
		/**
		 * adds the given class to the element object.
		 */
		addClass : function(el, clazz) {
			el.addClass(clazz);
		},	
			
		animate : function(el, properties, options) {			
			var m = new jsPlumbMorph(el, options);
			m.start(properties);
		},
		
		appendElement : function(child, parent) {
			_getElementObject(parent).grab(child);			
		},
		
		bind : function(el, event, callback) {
			el = _getElementObject(el);
			el.addEvent(event, callback);
		},
		
		dragEvents : {
			'start':'onStart', 'stop':'onComplete', 'drag':'onDrag', 'step':'onStep',
			'over':'onEnter', 'out':'onLeave','drop':'onDrop', 'complete':'onComplete'
		},

		/*
		 * wrapper around the library's 'extend' functionality (which it hopefully has.
		 * otherwise you'll have to do it yourself). perhaps jsPlumb could do this for you
		 * instead.  it's not like its hard.
		 */
		extend : function(o1, o2) {
			return $extend(o1, o2);
		},
		
		/**
		 * gets the named attribute from the given element object.  
		 */
		getAttribute : function(el, attName) {
			return el.get(attName);
		},
		
		getDragObject : function(eventArgs) {
			return eventArgs[0];
		},
							
		getElementObject : _getElementObject,
		
		/*
		  gets the offset for the element object.  this should return a js object like this:
		  
		  { left:xxx, top: xxx}
		 */
		getOffset : function(el) {
			var p = el.getPosition();
			return { left:p.x, top:p.y };
		},								
		
		getScrollLeft : function(el) {
			return null;
		},
		
		getScrollTop : function(el) {
			return null;
		},
		
		getSize : function(el) {
			var s = el.getSize();
			return [s.x, s.y];
		},
		
		/*
		 * takes the args passed to an event function and returns you an object that gives the
		 * position of the object being moved, as a js object with the same params as the result of
		 * getOffset, ie: { left: xxx, top: xxx }.
		 */
		getUIPosition : function(eventArgs) {
			var ui = eventArgs[0];
			return { left: ui.offsetLeft, top: ui.offsetTop };
		},													
		
		initDraggable : function(el, options) {
			var id = jsPlumb.getId(el);
			var drag = _draggablesById[id];
			if (!drag) {
				var originalZIndex = 0, originalCursor = null;
				var dragZIndex = jsPlumb.Defaults.DragOptions.zIndex || 2000;
				options['onStart'] = jsPlumb.wrap(options['onStart'], function()
			    {
					originalZIndex = this.element.getStyle('z-index'); 
					this.element.setStyle('z-index', dragZIndex);
					if (jsPlumb.Defaults.DragOptions.cursor) {
						originalCursor = this.element.getStyle('cursor');
						this.element.setStyle('cursor', jsPlumb.Defaults.DragOptions.cursor);
					}
				});
				
				options['onComplete'] = jsPlumb.wrap(options['onComplete'], function()
			    {
					this.element.setStyle('z-index', originalZIndex);
					if (originalCursor) {
						this.element.setStyle('cursor', originalCursor);
					}
				});
				
				// DROPPABLES:
				var scope = options['scope'] || jsPlumb.Defaults.Scope;
				var filterFunc = function(entry) {
					return entry.get("id") != el.get("id");
				};
				var droppables = _droppables[scope] ? _droppables[scope].filter(filterFunc) : [];
				options['droppables'] = droppables;
				options['onLeave'] = jsPlumb.wrap(options['onLeave'], function(el, dr) {
					if (dr) {
						_checkHover(dr, false);
						_executeDroppableOption(el, dr, 'onLeave');						
					}
				});
				options['onEnter'] = jsPlumb.wrap(options['onEnter'], function(el, dr) {
					if (dr) {
						_checkHover(dr, true);
						_executeDroppableOption(el, dr, 'onEnter');							
					}
				});
				options['onDrop'] = function(el, dr) {
					if (dr) {
						_checkHover(dr, false);
						_executeDroppableOption(el, dr, 'onDrop');						
					}
				};					
				
				drag = new Drag.Move(el, options);
				_add(_draggablesByScope, scope, drag);
				_add(_draggablesById, el.get("id"), drag);
				// test for disabled.
				if (options.disabled) drag.detach();
			}
			return drag;
		},
		
		initDroppable : function(el, options) {
			var scope = options['scope'] || jsPlumb.Defaults.Scope;
			_add(_droppables, scope, el);
			var id = jsPlumb.getId(el);
			_droppableOptions[id] = options;
			var filterFunc = function(entry) { return entry.element != el; };
			var draggables = _draggablesByScope[scope] ? _draggablesByScope[scope].filter(filterFunc) : [];
			for (var i = 0; i < draggables.length; i++) {
				draggables[i].droppables.push(el);
			}
		},
		
		isAlreadyDraggable : function(el) {
			return _draggablesById[jsPlumb.getId(el)] != null;
		},										
		
		isDragSupported : function(el, options) {
			return typeof Drag != 'undefined' ;
		},	
		
		/*
		 * you need Drag.Move imported to make drop work.
		 */
		isDropSupported : function(el, options) {
			return (typeof Drag != undefined && typeof Drag.Move != undefined);
		},
		
		/**
		 * removes the given class from the element object.
		 */
		removeClass : function(el, clazz) {
			el.removeClass(clazz);
		},
		
		removeElement : function(element, parent) {		
			_getElementObject(element).dispose();  // ??
		},
		
		/**
		 * sets the named attribute on the given element object.  
		 */
		setAttribute : function(el, attName, attValue) {
			el.set(attName, attValue);
		},
		
		setDraggable : function(el, draggable) {
			var draggables = _draggablesById[el.get("id")];
			if (draggables) {
				draggables.each(function(d) {
					if (draggable) d.attach(); else d.detach();
				});
			}
		},
		
		setOffset : function(el, o) {
			_getElementObject(el).setPosition({x:o.left, y:o.top});
		}
	};
})();
/**
* a set of Bezier curve functions that deal with Cubic Beziers, used by jsPlumb, and perhaps useful for other people.
*
* - functions are all in the 'jsBezier' namespace.  
* 
* - all input points should be in the format {x:.., y:..}. all output points are in this format too.
* 
* - all input curves should be in the format [ {x:.., y:..}, {x:.., y:..}, {x:.., y:..}, {x:.., y:..} ]
* 
* - 'location' as used as an input here refers to a decimal in the range 0-1 inclusive, which indicates a point some proportion along the length
* of the curve.  location as output has the same format and meaning.
* 
* 
* Function List:
* --------------
* 
* distanceFromCurve(point, curve)
* 
* 	Calculates the distance that the given point lies from the given Cubic Bezier.  Note that it is computed relative to the center of the Bezier,
* so if you have stroked the curve with a wide pen you may wish to take that into account!  The distance returned is relative to the values 
* of the curve and the point - it will most likely be pixels.
* 
* gradientAtPoint(curve, location)
* 
* 	Calculates the gradient to the curve at the given location, as a decimal between 0 and 1 inclusive.
* 
* nearestPointOnCurve(point, curve) 
* 
*	Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
*point's coordinates and also the 'location' of the point (see above), for example:  { point:{x:551,y:150}, location:0.263365 }.
* 
* pointOnCurve(curve, location)
* 
* 	Calculates the coordinates of the point on the given cubic Bezier curve at the given location.  
* 		
* pointAlongCurveFrom(curve, location, distance)
* 
* 	Calculates the coordinates of the point on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
* space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
* 
* perpendicularToCurveAt(curve, location, length, distance)
* 
* 	Calculates the perpendicular to the given curve at the given location.  length is the length of the line you wish for (it will be centered
* on the point at 'location'). distance is optional, and allows you to specify a point along the path from the given location as the center of
* the perpendicular returned.  The return value of this is an array of two points: [ {x:...,y:...}, {x:...,y:...} ].  
* 
* quadraticPointOnCurve(curve, location)
* 
* 	Calculates the coordinates of the point on the given quadratic Bezier curve at the given location.  This function is used internally by
* pointOnCurve, and is exposed just because it seemed churlish not to do so.  But remember that all the other functions in this library deal with
* cubic Beziers. 
* 
* 
* references:
* 
* http://webdocs.cs.ualberta.ca/~graphics/books/GraphicsGems/gems/NearestPoint.c
* http://13thparallel.com/archive/bezier-curves/
* http://bimixual.org/AnimationLibrary/beziertangents.html
* 
*/

(function() {
	
	if(typeof Math.sgn == "undefined") {
		Math.sgn = function(x) { return x == 0 ? 0 : x > 0 ? 1 :-1; };
	}
	
	var Vectors = {
		subtract 	: 	function(v1, v2) { return {x:v1.x - v2.x, y:v1.y - v2.y }; },
		dotProduct	: 	function(v1, v2) { return (v1.x * v2.x)  + (v1.y * v2.y); },
		square		:	function(v) { return Math.sqrt((v.x * v.x) + (v.y * v.y)); },
		scale		:	function(v, s) { return {x:v.x * s, y:v.y * s }; }
	};
		
	var	MAXDEPTH = 64, EPSILON	= Math.pow(2.0,-MAXDEPTH-1), DEGREE = 3, W_DEGREE = 5;

	/**
	 * Calculates the distance that the point lies from the curve.
	 * 
	 * @param point a point in the form {x:567, y:3342}
	 * @param curve a Bezier curve in the form [{x:..., y:...}, {x:..., y:...}, {x:..., y:...}, {x:..., y:...}].  note that this is currently
	 * hardcoded to assume cubiz beziers, but would be better off supporting any degree. 
	 * @return a JS object literal containing location and distance, for example: {location:0.35, distance:10}.  Location is analogous to the location
	 * argument you pass to the pointOnPath function: it is a ratio of distance travelled along the curve.  Distance is the distance in pixels from
	 * the point to the curve. 
	 */
	var _distanceFromCurve = function(point, curve) {
		var candidates = new Array(W_DEGREE);     
	    var w = _convertToBezier(point, curve);
	    var numSolutions = _findRoots(w, W_DEGREE, candidates, 0);
		var v = Vectors.subtract(point, curve[0]), dist = Vectors.square(v), t = 0.0;
	    for (var i = 0; i < numSolutions; i++) {
			v = Vectors.subtract(point, _bezier(curve, DEGREE, candidates[i], null, null));
	    	var newDist = Vectors.square(v);
	    	if (newDist < dist) {
	            dist = newDist;
	        	t = candidates[i];
		    }
	    }
	    v = Vectors.subtract(point, curve[DEGREE]);
		newDist = Vectors.square(v);
	    if (newDist < dist) {
	        dist = newDist;
	    	t = 1.0;
	    }
		return {location:t, distance:dist};
	};
	/**
	 * finds the nearest point on the curve to the given point.
	 */
	var _nearestPointOnCurve = function(point, curve) {    
		var td = _distanceFromCurve(point, curve);
	    return {point:_bezier(curve, DEGREE, td.location, null, null), location:td.location};
	};
	/**
	 * internal method; converts to 5th degree Bezier form.
	 */
	var _convertToBezier = function(point, curve) {
	    var c = new Array(DEGREE+1), d = new Array(DEGREE), cdTable = [], w = [];
	    var z = [ [1.0, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1.0] ];	
	    for (var i = 0; i <= DEGREE; i++) c[i] = Vectors.subtract(curve[i], point);
	    for (var i = 0; i <= DEGREE - 1; i++) { 
			d[i] = Vectors.subtract(curve[i+1], curve[i]);
			d[i] = Vectors.scale(d[i], 3.0);
	    }
	    for (var row = 0; row <= DEGREE - 1; row++) {
			for (var column = 0; column <= DEGREE; column++) {
				if (!cdTable[row]) cdTable[row] = [];
		    	cdTable[row][column] = Vectors.dotProduct(d[row], c[column]);
			}
	    }
	    for (i = 0; i <= W_DEGREE; i++) {
			if (!w[i]) w[i] = [];
			w[i].y = 0.0;
			w[i].x = parseFloat(i) / W_DEGREE;
	    }
	    var n = DEGREE, m = DEGREE-1;
	    for (var k = 0; k <= n + m; k++) {
			var lb = Math.max(0, k - m);
			var ub = Math.min(k, n);
			for (i = lb; i <= ub; i++) {
		    	j = k - i;
		    	w[i+j].y += cdTable[j][i] * z[j][i];
			}
	    }
	    return w;
	};
	/**
	 * counts how many roots there are.
	 */
	var _findRoots = function(w, degree, t, depth) {  
	    var  i;
	    var Left = new Array(W_DEGREE+1), Right = new Array(W_DEGREE+1);	
	    var left_count, right_count;	
	    var left_t = new Array(W_DEGREE+1), right_t = new Array(W_DEGREE+1);
	    switch (_getCrossingCount(w, degree)) {
	       	case 0 : {	
	       		return 0;	
	       	}
	       	case 1 : {	
	       		if (depth >= MAXDEPTH) {
	       			t[0] = (w[0].x + w[W_DEGREE].x) / 2.0;
	       			return 1;
	       		}
	       		if (_isControlPolygonFlatEnough(w, degree)) {
	       			t[0] = _computeXIntercept(w, degree);
	       			return 1;
	       		}
	       		break;
	       	}
	    }
	    _bezier(w, degree, 0.5, Left, Right);
	    left_count  = _findRoots(Left,  degree, left_t, depth+1);
	    right_count = _findRoots(Right, degree, right_t, depth+1);
	    for (i = 0; i < left_count; i++) t[i] = left_t[i];
	    for (i = 0; i < right_count; i++) t[i+left_count] = right_t[i];    
		return (left_count+right_count);
	};
	var _getCrossingCount = function(curve, degree) {
	    var 	n_crossings = 0;	
	    var		sign, old_sign;		    	
	    sign = old_sign = Math.sgn(curve[0].y);
	    for (var i = 1; i <= degree; i++) {
			sign = Math.sgn(curve[i].y);
			if (sign != old_sign) n_crossings++;
			old_sign = sign;
	    }
	    return n_crossings;
	};
	var _isControlPolygonFlatEnough = function(curve, degree) {
	    var  error;
	    var  intercept_1, intercept_2, left_intercept, right_intercept;
	    var  a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
	    a = curve[0].y - curve[degree].y;
	    b = curve[degree].x - curve[0].x;
	    c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y;
	
	    var max_distance_above = max_distance_below = 0.0;
	    
	    for (var i = 1; i < degree; i++) {
	        var value = a * curve[i].x + b * curve[i].y + c;       
	        if (value > max_distance_above)
	            max_distance_above = value;
	        else if (value < max_distance_below)
	        	max_distance_below = value;
	    }
	    
	    a1 = 0.0; b1 = 1.0; c1 = 0.0; a2 = a; b2 = b;
	    c2 = c - max_distance_above;
	    det = a1 * b2 - a2 * b1;
	    dInv = 1.0/det;
	    intercept_1 = (b1 * c2 - b2 * c1) * dInv;
	    a2 = a; b2 = b; c2 = c - max_distance_below;
	    det = a1 * b2 - a2 * b1;
	    dInv = 1.0/det;
	    intercept_2 = (b1 * c2 - b2 * c1) * dInv;
	    left_intercept = Math.min(intercept_1, intercept_2);
	    right_intercept = Math.max(intercept_1, intercept_2);
	    error = right_intercept - left_intercept;
	    return (error < EPSILON)? 1 : 0;
	};
	var _computeXIntercept = function(curve, degree) {
	    var XLK = 1.0, YLK = 0.0;
	    var XNM = curve[degree].x - curve[0].x, YNM = curve[degree].y - curve[0].y;
	    var XMK = curve[0].x - 0.0, YMK = curve[0].y - 0.0;
	    var det = XNM*YLK - YNM*XLK, detInv = 1.0/det;
	    var S = (XNM*YMK - YNM*XMK) * detInv; 
	    return 0.0 + XLK * S;
	};
	var _bezier = function(curve, degree, t, left, right) {
	    var temp = [[]];
	    for (var j =0; j <= degree; j++) temp[0][j] = curve[j];
	    for (var i = 1; i <= degree; i++) {	
			for (var j =0 ; j <= degree - i; j++) {
				if (!temp[i]) temp[i] = [];
				if (!temp[i][j]) temp[i][j] = {};
		    	temp[i][j].x = (1.0 - t) * temp[i-1][j].x + t * temp[i-1][j+1].x;
		    	temp[i][j].y = (1.0 - t) * temp[i-1][j].y + t * temp[i-1][j+1].y;
			}
	    }    
	    if (left != null) 
	    	for (j = 0; j <= degree; j++) left[j]  = temp[j][0];
	    if (right != null)
			for (j = 0; j <= degree; j++) right[j] = temp[degree-j][j];
	    
	    return (temp[degree][0]);
	};
	
	/**
	 * calculates a point on the curve, for a cubic bezier (TODO: fold this and the other function into one). 
	 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}, {x:120,y:100}].  For a cubic bezier this should have four points.
	 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
	 */
	var _pointOnPath = function(curve, location) {
		// from http://13thparallel.com/archive/bezier-curves/
		function B1(t) { return t*t*t };
		function B2(t) { return 3*t*t*(1-t) };
		function B3(t) { return 3*t*(1-t)*(1-t) };
		function B4(t) { return (1-t)*(1-t)*(1-t) };
		
		var x = curve[0].x*B1(location) + curve[1].x * B2(location) + curve[2].x * B3(location) + curve[3].x * B4(location);
		var y = curve[0].y*B1(location) + curve[1].y * B2(location) + curve[2].y * B3(location) + curve[3].y * B4(location);
		//return [x,y];
		return {x:x, y:y};
	};
	
	/**
	 * calculates a point on the curve, for a quadratic bezier (TODO: fold this and the other function into one). 
	 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}].  For a quadratic bezier this should have three points.
	 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
	 */
	var _quadraticPointOnPath = function(curve, location) {
		function B1(t) { return t*t; };
		function B2(t) { return 2*t*(1-t); };
		function B3(t) { return (1-t)*(1-t); };
		var x = curve[0].x*B1(location) + curve[1].x*B2(location) + curve[2].x*B3(location);
		var y = curve[0].y*B1(location) + curve[1].y*B2(location) + curve[2].y*B3(location);
		return {x:x,y:y};
	};
	
	/**
	 * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
	 * its 'location' (proportion of travel along the path); the method below - _pointAlongPathFrom - calls this method and just returns the
	 * point.
	 */
	var _pointAlongPath = function(curve, location, distance) {
		var _dist = function(p1,p2) { return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)); };
		var prev = _pointOnPath(curve, location), tally = 0, curLoc = location, direction = distance > 0 ? 1 : -1, cur = null;
		while (tally < Math.abs(distance)) {
			curLoc += (0.005 * direction);
			cur = _pointOnPath(curve, curLoc);
			tally += _dist(cur, prev);	
			prev = cur;
		}
		return {point:cur, location:curLoc};        	
	};
	
	/**
	 * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
	 * its 'location' (proportion of travel along the path).
	 */
	var _pointAlongPathFrom = function(curve, location, distance) {
		return _pointAlongPath(curve, location, distance).point;
	};
	
	/**
	 * returns the gradient of the connector at the given location, which is a decimal between 0 and 1 inclusive.
	 * 
	 * thanks // http://bimixual.org/AnimationLibrary/beziertangents.html
	 */
	var _gradientAtPoint = function(curve, location) {
		var p1 = _pointOnPath(curve, location);	
		var p2 = _quadraticPointOnPath(curve, location);
		var dy = p2.y - p1.y, dx = p2.x - p1.x;
		return Math.atan(dy / dx);		
	};

	/**
	 * calculates a line that is 'length' pixels long, perpendicular to, and centered on, the path at 'distance' pixels from the given location.
	 * if distance is not supplied, the perpendicular for the given location is computed (ie. we set distance to zero).
	 */
	var _perpendicularToPathAt = function(curve, location, length, distance) {
		distance = distance == null ? 0 : distance;
		var p = _pointAlongPath(curve, location, distance);
		var m = _gradientAtPoint(curve, p.location);
		var _theta2 = Math.atan(-1 / m);
		var y =  length / 2 * Math.sin(_theta2);
		var x =  length / 2 * Math.cos(_theta2);
		return [{x:p.point.x + x, y:p.point.y + y}, {x:p.point.x - x, y:p.point.y - y}];
	};
	
	var jsBezier = window.jsBezier = {
		distanceFromCurve : _distanceFromCurve,
		gradientAtPoint : _gradientAtPoint,
		nearestPointOnCurve : _nearestPointOnCurve,
		pointOnCurve : _pointOnPath,		
		pointAlongCurveFrom : _pointAlongPathFrom,
		perpendicularToCurveAt : _perpendicularToPathAt,
		quadraticPointOnCurve : _quadraticPointOnPath			//TODO fold the two pointOnPath functions into one; it can detect what it was given.
	};
})();

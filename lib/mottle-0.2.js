/*
	Wraps touch events and presents them as mouse events: you register for standard mouse events such as 
	click, mousedown, mouseup and mousemove, and the touch adapter will automatically register corresponding
	touch events for each of these.  'click' and 'dblclick' are achieved through setting a timer on touchstart and
	firing an event on touchend if the timer has not yet expired. The delay for this timer can be set on 
	the Mottle's constructor (clickThreshold); the default is 150ms.

	Mottle has no external dependencies.
*/
;(function() {

	// matcheSelector seems to not honour the context. which makes it kind of useless here.
	//var ms = typeof HTMLElement != "undefined" ? (HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.oMatchesSelector || HTMLElement.prototype.msMatchesSelector) : null;
	var matchesSelector = function(el, selector, ctx) {
		/*if (ms) {
			return ms.apply(el, [ selector, ctx ]);
		} */

		ctx = ctx || el.parentNode;
		var possibles = ctx.querySelectorAll(selector);
		for (var i = 0; i < possibles.length; i++) {
			if (possibles[i] === el) {
				return true;
			}
		}
		return false;
	};
	
	var guid = 1;
	//
	// this function generates a guid for every handler, sets it on the handler, then adds
	// it to the associated object's map of handlers for the given event. this is what enables us 
	// to unbind all events of some type, or all events (the second of which can be requested by the user, 
	// but it also used by Mottle when an element is removed.)
	var _store = function(obj, event, fn) {
		var g = guid++;
		obj.__ta = obj.__ta || {};
		obj.__ta[event] = obj.__ta[event] || {};
		// store each handler with a unique guid.
		obj.__ta[event][g] = fn;
		// set the guid on the handler.
		fn.__tauid = g;
		return g;
	};
	
	var _unstore = function(obj, event, fn) {
		delete obj.__ta[event][fn.__tauid];
		// a handler might have attached extra functions, so we unbind those too.
		if (fn.__taExtra) {
			for (var i = 0; i < fn.__taExtra.length; i++) {
				_unbind(obj, fn.__taExtra[i][0], fn.__taExtra[i][1]);
			}
			fn.__taExtra.length = 0;
		}
		// a handler might have attached an unstore callback
		fn.__taUnstore && fn.__taUnstore();
	};
	
	var _curryChildFilter = function(children, obj, fn, evt) {
		if (children == null) return fn;
		else {
			var c = children.split(",");
			var _fn = function(e) {
				_fn.__tauid = fn.__tauid;
				var t = e.srcElement || e.target;
				for (var i = 0; i < c.length; i++) {
					if (matchesSelector(t, c[i], obj)) {
						fn.apply(t, arguments);
					}
				}
			};
			registerExtraFunction(fn, evt, _fn);
			return _fn;
		}
	};
	
	//
	// registers an 'extra' function on some event listener function we were given - a function that we
	// created and bound to the element as part of our housekeeping, and which we want to unbind and remove
	// whenever the given function is unbound.
	var registerExtraFunction = function(fn, evt, newFn) {
		fn.__taExtra = fn.__taExtra || [];
		fn.__taExtra.push([evt, newFn]);
	};
	
	var DefaultHandler = function(obj, evt, fn, children) {
		_bind(obj, evt, _curryChildFilter(children, obj, fn, evt), fn);
	};
	
	var SmartClickHandler = function(obj, evt, fn, children) {
		var down = function(e) {
				obj.__tad = _pageLocation(e);
				return true;
			},
			up = function(e) {
				obj.__tau = _pageLocation(e);
				return true;
			},
			click = function(e) {
				if (obj.__tad && obj.__tau && obj.__tad[0] == obj.__tau[0] && obj.__tad[1] == obj.__tau[1]) {
					fn.apply((e.srcElement || e.target), [ e ]);
				}
			};
			
		// TODO TOUCH
		DefaultHandler(obj, "mousedown", down, children);
		DefaultHandler(obj, "mouseup", up, children);
		DefaultHandler(obj, "click", click, children);
		
		// TODO ensure they are not unbound by a general "unbind mousedown or mouseup" call.
		registerExtraFunction(fn, "mousedown", down);
		registerExtraFunction(fn, "mouseup", up);
		registerExtraFunction(fn, "click", click);
	};
	
	var TouchEventHandler = function(obj, evt, fn, children) {
		
	};
	
	var meeHelper = function(type, evt, obj, target) {
		for (var i in obj.__tamee[type]) {
			obj.__tamee[type][i].apply(target, [ evt ]);
		}
	};
	
	var MouseEnterExitHandler = function() {
		var activeElements = [];
		return function(obj, evt, fn, children) {
			if (!obj.__tamee) {
				// __tamee holds a flag saying whether the mouse is currently "in" the element, and a list of
				// both mouseenter and mouseexit functions.
				obj.__tamee = {
					over:false,
					mouseenter:[],
					mouseexit:[]
				};
				// now register over and out functions (one time only)
				var over = function(e) {
					var t = e.srcElement || e.target;
					if (children == null) {
						if (t == obj && !obj.__tamee.over) {
							meeHelper("mouseenter", e, obj, t);
							obj.__tamee.over = true;
							activeElements.push(obj);
						}
					}
					else {
						// otherwise a child selector was supplied; does the target
						// match this selector?
						if (matchesSelector(t, children, obj) && (t.__tamee == null || !t.__tamee.over)) {
							meeHelper("mouseenter", e, obj, t);
							t.__tamee = t.__tamee || {};
							t.__tamee.over = true;
							activeElements.push(t);
						}
					}
				};
				_bind(obj, "mouseover", _curryChildFilter(children, obj, over, "mouseover"), over);

				var out = function(e) {
					var t = e.srcElement || e.target;
					// is the current target one of the activeElements? and is the 
					// related target NOT a descendant of it?
					for (var i = 0; i < activeElements.length; i++) {
						if (t == activeElements[i] && !matchesSelector(e.relatedTarget, "*", t)) {
							t.__tamee.over = false;
							activeElements.splice(i, 1);
							meeHelper("mouseexit", e, obj, t);
						}
					}
				};
				_bind(obj, "mouseout", _curryChildFilter(children, obj, out, "mouseout"), out);
			}
			
			fn.__taUnstore = function() {
				delete obj.__tamee[evt][fn.__tauid];
			};
			
			_store(obj, evt, fn);
			obj.__tamee[evt][fn.__tauid] = fn;
		};
		
	};

	var isTouchDevice = "ontouchstart" in document.documentElement,
		isMouseDevice = "onmousedown" in document.documentElement,
		downEvent = isTouchDevice ? "touchstart" : "mousedown",
		upEvent = isTouchDevice ? "touchend" : "mouseup",
		moveEvent = isTouchDevice ? "touchmove" : "mousemove",
		touchMap = { "mousedown":"touchstart", "mouseup":"touchend", "mousemove":"touchmove" },
		click="click", dblclick="dblclick",contextmenu="contextmenu",
		touchstart="touchstart",touchend="touchend",touchmove="touchmove",
		ta_down = "__MottleDown", ta_up = "__MottleUp", 
		ta_context_down = "__MottleContextDown", ta_context_up = "__MottleContextUp",
		iev = (function() {
			var rv = -1; 
			if (navigator.appName == 'Microsoft Internet Explorer') {
				var ua = navigator.userAgent,
					re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
				if (re.exec(ua) != null)
					rv = parseFloat(RegExp.$1);
			}
			return rv;
		})(),
		isIELT9 = iev > -1 && iev < 9, 
		_pageLocation = function(e) {
			if (isIELT9) {
				return [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
			}
			else {
				var ts = _touches(e), t = _getTouch(ts, 0);
				// this is for iPad. may not fly for Android.
				return [t.pageX, t.pageY];
			}
		},
		// 
		// extracts the touch with the given index from the list of touches
		//
		_getTouch = function(touches, idx) { return touches.item ? touches.item(idx) : touches[idx]; },
		//
		// gets the touches from the given event, if they exist. otherwise sends the original event back.
		//
		_touches = function(e) { return e.touches || [ e ]; },
		_touchCount = function(e) { return _touches(e).length || 1; },
		//http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
		_bind = function( obj, type, fn, originalFn) {
			_store(obj, type, fn);
			originalFn.__tauid = fn.__tauid;
			if (obj.addEventListener)
				obj.addEventListener( type, fn, false );
			else if (obj.attachEvent) {
				obj["e"+type+fn] = fn;
				obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
				obj.attachEvent( "on"+type, obj[type+fn] );
			}
		},
		_unbind = function( obj, type, fn) {
			_unstore(obj, type, fn);
			if (obj.removeEventListener)
				obj.removeEventListener( type, fn, false );
			else if (obj.detachEvent) {
				obj.detachEvent( "on"+type, obj[type+fn] );
				obj[type+fn] = null;
				obj["e"+type+fn] = null;
			}
		},
		_devNull = function() {};

	window.Mottle = function(params) {
		params = params || {};
		var self = this, 
			
			clickThreshold = params.clickThreshold || 150,
			dlbClickThreshold = params.dblClickThreshold || 250,
			mouseEnterExitHandler = new MouseEnterExitHandler(),
			_smartClicks = params.smartClicks,
			// wrap bind function to provide "smart" click functionality, which prevents click events if
			// the mouse has moved between up and down.
			__bind = function(obj, evt, fn, children) {
				if (_smartClicks && (evt === "click" || evt === "dblclick"))
					SmartClickHandler(obj, evt, fn, children);
				else if (evt === "mouseenter" || evt == "mouseexit")
					mouseEnterExitHandler(obj, evt, fn, children);
				else 
					DefaultHandler(obj, evt, fn, children);
			},
			// TODO MOVE TO A HANDLER
			_addClickWrapper = function(obj, fn, touchCount, eventIds, supportDoubleClick, children) {
				var handler = { down:false, touches:0, originalEvent:null, lastClick:null, timeout:null };
				//var down = function(e) {
				var down = _curryChildFilter(children, obj, function(e) {
						var tc = _touchCount(e);
						if (tc == touchCount) {
							handler.originalEvent = e;
							handler.touches = tc;
							handler.down = true;
							handler.timeout = window.setTimeout(function() {
								handler.down = null;
							}, clickThreshold);
						}
					}, touchstart);
					
				fn[eventIds[0]] = down;
				__bind(obj, touchstart, down);	
				//var up = function(e) {
				var up = _curryChildFilter(children, obj, function(e) {
					if (handler.down) {
						// if supporting double click, check if there is a timestamp for a recent click
						if (supportDoubleClick) {
							var t = new Date().getTime();
							if (handler.lastClick) {
								if (t - handler.lastClick < dblClickThreshold)
									fn(handler.originalEvent);
							}

							handler.lastClick = t;
						}
						else
							fn(handler.originalEvent);
					}
					handler.down = null;
					window.clearTimeout(handler.timeout);
				}, touchend);
				
				fn[eventIds[1]] = up;	
				__bind(obj, touchend, up);
			};

		var _doBind = function(obj, evt, fn, children) {
			obj = typeof obj === "string" ? document.getElementById(obj) : obj;
			//
			// TODO: some devices are both and touch AND mouse. we shouldn't make the
			// two cases mutually exclusive. 
			// also, it would be nice to refactor this.
			if (isTouchDevice) {
				if (evt === click) {
					_addClickWrapper(obj, fn, 1, [ta_down, ta_up], false, children);
				}
				else if (evt === dblclick) {
					_addClickWrapper(obj, fn, 1, [ta_down, ta_up], true, children);
				}
				else if (evt === contextmenu) {
					_addClickWrapper(obj, fn, 2, [ta_context_down, ta_context_up], false, children);
				}
				else {
					__bind(obj, touchMap[evt], fn, children);
				}
			}
			else 
				__bind(obj, evt, fn, children);

			return self;
		};

		/**
		* @name Mottle#remove
		* @function
		* @desc Removes an element from the DOM, and unregisters all event handlers for it. You should use this
		* to ensure you don't leak memory.
		* @param {String|Element} el Element, or id of the element, to remove.
		*/
		this.remove = function(el) {			
			el = typeof el == "string" ? document.getElementById(el) : el;
			if (el.__ta) {
				for (var evt in el.__ta) {
					for (var h in el.__ta[evt]) {
						_unbind(el, evt, el.__ta[evt][h]);
					}
				}
			}
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
		};

		/**
		* @name Mottle#on
		* @function
		* @desc Register an event handler, optionally as a delegate for some set of descendant elements. Note
		* that this method takes either 3 or 4 arguments - if you supply 3 arguments it is assumed you have 
		* omitted the `children` parameter, and that the event handler should be bound directly to the given element.
		* @param {Element|String} el Element - or ID of element - to bind event listener to.
		* @param {String} [children] Comma-delimited list of selectors identifying allowed children.
		* @param {String} event Event ID.
		* @param {Function} fn Event handler function.
		* @returns {Mottle} The current Mottle instance; you can chain this method.
		*/
		this.on = function(el, children, event, fn) {
			var _el = arguments[0],
				_c = arguments.length == 4 ? arguments[1] : null,
				_e = arguments[arguments.length - 2],
				_f = arguments[arguments.length - 1];

			_doBind(_el, _e, _f, _c);
			return this;
		};	

		/**
		* @name Mottle#off
		* @function
		* @desc Cancel delegate event handling for the given function. Note that unlike with 'on' you do not supply
		* a list of child selectors here: it removes event delegation from all of the child selectors for which the
		* given function was registered (if any).
		* @param {Element|String} el Element - or ID of element - from which to remove event listener.
		* @param {String} event Event ID.
		* @param {Function} fn Event handler function.
		* @returns {Mottle} The current Mottle instance; you can chain this method.
		*/
		this.off = function(el, evt, fn) {
			if (isTouchDevice) {
				if (evt === click) {
					_unbind(el, touchstart, fn[ta_down]);
					fn[ta_down] = null;
					_unbind(el, touchend, fn[ta_up]);
					fn[ta_up] = null;
				}
				else if (evt === contextmenu && wrapContextMenu) {
					_unbind(el, touchstart, fn[ta_context_down]);
					fn[ta_context_down] = null;
					_unbind(el, touchend, fn[ta_context_up]);
					fn[ta_context_up] = null;
				}
				else
					_unbind(el, touchMap[evt], fn);
			}
			
			_unbind(el, evt, fn);

			return this;
		};

		/**
		* @name Mottle#trigger
		* @function
		* @desc Triggers some event for a given element.
		* @param {Element} el Element for which to trigger the event.
		* @param {String} event Event ID.
		* @param {Event} originalEvent The original event. Should be optional of course, but currently is not, due
		* to the jsPlumb use case that caused this method to be added.
		* @returns {Mottle} The current Mottle instance; you can chain this method.
		*/
		this.trigger = function(el, event, originalEvent) {
			var evt;
			if (document.createEvent) {
				evt = document.createEvent("MouseEvents");
				evt.initMouseEvent(event, true, true, window, 0,
								   originalEvent.screenX, originalEvent.screenY,
								   originalEvent.clientX, originalEvent.clientY,
								   false, false, false, false, 1, null);
				el.dispatchEvent(evt);
			}
			else if (document.createEventObject) {
				evt = document.createEventObject();
				evt.eventType = evt.eventName = event;
				evt.screenX = originalEvent.screenX;
				evt.screenY = originalEvent.screenY;
				evt.clientX = originalEvent.clientX;
				evt.clientY = originalEvent.clientY;
				el.fireEvent('on' + event, evt);
			}
			return this;
		}
	};
})();

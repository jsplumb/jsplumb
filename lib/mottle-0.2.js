;(function() {

	"use strict";

	var matchesSelector = function(el, selector, ctx) {
			ctx = ctx || el.parentNode;
			var possibles = ctx.querySelectorAll(selector);
			for (var i = 0; i < possibles.length; i++) {
				if (possibles[i] === el) {
					return true;
				}
			}
			return false;
		},
		_gel = function(el) { return typeof el == "string" ? document.getElementById(el) : el; },
		_t = function(e) { return e.srcElement || e.target; },
		_d = function(l, fn) {
			for (var i = 0, j = l.length; i < j; i++) {
				if (l[i] == fn) break;
			}
			if (i < l.length) l.splice(i, 1);
		},
		guid = 1,
		//
		// this function generates a guid for every handler, sets it on the handler, then adds
		// it to the associated object's map of handlers for the given event. this is what enables us 
		// to unbind all events of some type, or all events (the second of which can be requested by the user, 
		// but it also used by Mottle when an element is removed.)
		_store = function(obj, event, fn) {
			var g = guid++;
			obj.__ta = obj.__ta || {};
			obj.__ta[event] = obj.__ta[event] || {};
			// store each handler with a unique guid.
			obj.__ta[event][g] = fn;
			// set the guid on the handler.
			fn.__tauid = g;
			return g;
		},
		_unstore = function(obj, event, fn) {
			obj.__ta[event] && delete obj.__ta[event][fn.__tauid];
			// a handler might have attached extra functions, so we unbind those too.
			if (fn.__taExtra) {
				for (var i = 0; i < fn.__taExtra.length; i++) {
					_unbind(obj, fn.__taExtra[i][0], fn.__taExtra[i][1]);
				}
				fn.__taExtra.length = 0;
			}
			// a handler might have attached an unstore callback
			fn.__taUnstore && fn.__taUnstore();
		},
		_curryChildFilter = function(children, obj, fn, evt) {
			if (children == null) return fn;
			else {
				var c = children.split(","),
					_fn = function(e) {
						_fn.__tauid = fn.__tauid;
						var t = _t(e);
						for (var i = 0; i < c.length; i++) {
							if (matchesSelector(t, c[i], obj)) {
								fn.apply(t, arguments);
							}
						}
					};
				registerExtraFunction(fn, evt, _fn);
				return _fn;
			}
		},
		//
		// registers an 'extra' function on some event listener function we were given - a function that we
		// created and bound to the element as part of our housekeeping, and which we want to unbind and remove
		// whenever the given function is unbound.
		registerExtraFunction = function(fn, evt, newFn) {
			fn.__taExtra = fn.__taExtra || [];
			fn.__taExtra.push([evt, newFn]);
		},
		DefaultHandler = function(obj, evt, fn, children) {
			// TODO: this was here originally because i wanted to handle devices that are both touch AND mouse. however this can cause certain of the helper
			// functions to be bound twice, as - for example - on a nexus 4, both a mouse event and a touch event are fired.  the use case i had in mind
			// was a device such as an Asus touch pad thing, which has a touch pad but can also be controlled with a mouse.
			//if (isMouseDevice)
			//	_bind(obj, evt, _curryChildFilter(children, obj, fn, evt), fn);
			
			if (isTouchDevice && touchMap[evt]) {
				_bind(obj, touchMap[evt], _curryChildFilter(children, obj, fn, touchMap[evt]), fn);
			}
			else
				_bind(obj, evt, _curryChildFilter(children, obj, fn, evt), fn);
		},
		SmartClickHandler = function(obj, evt, fn, children) {
			if (obj.__taSmartClicks == null) {
				var down = function(e) { obj.__tad = _pageLocation(e); },
					up = function(e) { obj.__tau = _pageLocation(e); },
					click = function(e) {
						if (obj.__tad && obj.__tau && obj.__tad[0] === obj.__tau[0] && obj.__tad[1] === obj.__tau[1]) {
							for (var i = 0; i < obj.__taSmartClicks.length; i++)
								obj.__taSmartClicks[i].apply(_t(e), [ e ]);
						}
					};
				DefaultHandler(obj, "mousedown", down, children);
				DefaultHandler(obj, "mouseup", up, children);
				DefaultHandler(obj, "click", click, children);
				obj.__taSmartClicks = [];
			}
			
			// store in the list of callbacks
			obj.__taSmartClicks.push(fn);
			// the unstore function removes this function from the object's listener list for this type.
			fn.__taUnstore = function() {
				_d(obj.__taSmartClicks, fn);
			};
		},
		_tapProfiles = {
			"tap":{touches:1, taps:1},
			"dbltap":{touches:1, taps:2},
			"contextmenu":{touches:2, taps:1}
		},
		TapHandler = function(clickThreshold, dblClickThreshold) {
			return function(obj, evt, fn, children) {
				// if event is contextmenu, for devices which are mouse only, we want to
				// use the default bind. 
				if (evt == "contextmenu" && isMouseDevice)
					DefaultHandler(obj, evt, fn, children);
				else {
					if (obj.__taTapHandler == null) {
						var tt = obj.__taTapHandler = {
							tap:[],
							dbltap:[],
							contextmenu:[],
							down:false,
							taps:0
						};
						var down = function(e) {
								tt.down = true;
								setTimeout(clearSingle, clickThreshold);
								setTimeout(clearDouble, dblClickThreshold);
							},
							up = function(e) {
								if (tt.down) {
									tt.taps++;
									var tc = _touchCount(e);
									for (var t in _tapProfiles) {
										var p = _tapProfiles[t];
										if (p.touches === tc && (p.taps === 1 || p.taps === tt.taps)) {
											for (var i = 0; i < tt[t].length; i++) {
												tt[t][i].apply(_t(e), [ e ]);
											}
										}
									}
								}
							},
							clearSingle = function() {
								tt.down = false;
							},
							clearDouble = function() {
								tt.taps = 0;
							};
						
						DefaultHandler(obj, "mousedown", down, children);
						DefaultHandler(obj, "mouseup", up, children);
					}
					obj.__taTapHandler[evt].push(fn);
					// the unstore function removes this function from the object's listener list for this type.
					fn.__taUnstore = function() {
						_d(obj.__taTapHandler[evt], fn);
					};
				}
			};
		},
		meeHelper = function(type, evt, obj, target) {
			for (var i in obj.__tamee[type]) {
				obj.__tamee[type][i].apply(target, [ evt ]);
			}
		},
		MouseEnterExitHandler = function() {
			var activeElements = [];
			return function(obj, evt, fn, children) {
				if (!obj.__tamee) {
					// __tamee holds a flag saying whether the mouse is currently "in" the element, and a list of
					// both mouseenter and mouseexit functions.
					obj.__tamee = { over:false, mouseenter:[], mouseexit:[] };
					// register over and out functions
					var over = function(e) {
							var t = _t(e);
							if ( (children== null && (t == obj && !obj.__tamee.over)) || (matchesSelector(t, children, obj) && (t.__tamee == null || !t.__tamee.over)) ) {
								meeHelper("mouseenter", e, obj, t);
								t.__tamee = t.__tamee || {};
								t.__tamee.over = true;
								activeElements.push(t);
							}
						},
						out = function(e) {
							var t = _t(e);
							// is the current target one of the activeElements? and is the 
							// related target NOT a descendant of it?
							for (var i = 0; i < activeElements.length; i++) {
								if (t == activeElements[i] && !matchesSelector((e.relatedTarget || e.toElement), "*", t)) {
									t.__tamee.over = false;
									activeElements.splice(i, 1);
									meeHelper("mouseexit", e, obj, t);
								}
							}
						};
						
					_bind(obj, "mouseover", _curryChildFilter(children, obj, over, "mouseover"), over);
					_bind(obj, "mouseout", _curryChildFilter(children, obj, out, "mouseout"), out);
				}

				fn.__taUnstore = function() {
					delete obj.__tamee[evt][fn.__tauid];
				};

				_store(obj, evt, fn);
				obj.__tamee[evt][fn.__tauid] = fn;
			};
		},
		isTouchDevice = "ontouchstart" in document.documentElement,
		isMouseDevice = "onmousedown" in document.documentElement,
		touchMap = { "mousedown":"touchstart", "mouseup":"touchend", "mousemove":"touchmove" },
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
		_getTouch = function(touches, idx) { return touches.item ? touches.item(idx) : touches[idx]; },
		_touches = function(e) {
			return e.touches && e.touches.length > 0 ? e.touches : 
				   e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches :
				   e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches :
				   [ e ];
		},
		_touchCount = function(e) { return _touches(e).length; },
		//http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
		_bind = function( obj, type, fn, originalFn) {
			_store(obj, type, fn);
			originalFn.__tauid = fn.__tauid;
			if (obj.addEventListener)
				obj.addEventListener( type, fn, false );
			else if (obj.attachEvent) {
				var key = type + fn.__tauid;
				obj["e" + key] = fn;
				// TODO look at replacing with .call(..)
				obj[key] = function() { obj["e"+key]( window.event ); };
				obj.attachEvent( "on"+type, obj[key] );
			}
		},
		_unbind = function( obj, type, fn) {
			_each(obj, function() {
				var _el = _gel(this);
				_unstore(_el, type, fn);
				// it has been bound if there is a tauid. otherwise it was not bound and we can ignore it.
				if (fn.__tauid != null) {
					if (_el.removeEventListener)
						_el.removeEventListener( type, fn, false );
					else if (this.detachEvent) {
						var key = type + fn.__tauid;
						_el[key] && _el.detachEvent( "on"+type, _el[key] );
						_el[key] = null;
						_el["e"+key] = null;
					}
				}
			});
		},
		_devNull = function() {},
		_each = function(obj, fn) {
			obj = (typeof obj !== "string") && (obj.tagName == null && obj.length != null) ? obj : [ obj ];
			for (var i = 0; i < obj.length; i++)
				fn.apply(obj[i]);
		};

	this.Mottle = function(params) {
		params = params || {};
		var self = this, 
			clickThreshold = params.clickThreshold || 150,
			dblClickThreshold = params.dblClickThreshold || 350,
			mouseEnterExitHandler = new MouseEnterExitHandler(),
			tapHandler = new TapHandler(clickThreshold, dblClickThreshold),
			_smartClicks = params.smartClicks,
			_doBind = function(obj, evt, fn, children) {
				_each(obj, function() {
					var _el = _gel(this);
					if (_smartClicks && evt === "click")
						SmartClickHandler(_el, evt, fn, children);
					else if (evt === "tap" || evt === "dbltap" || evt === "contextmenu") {
						tapHandler(_el, evt, fn, children);
					}
					else if (evt === "mouseenter" || evt == "mouseexit")
						mouseEnterExitHandler(_el, evt, fn, children);
					else 
						DefaultHandler(_el, evt, fn, children);
				});
			};

		/**
		* @name Mottle#remove
		* @function
		* @desc Removes an element from the DOM, and unregisters all event handlers for it. You should use this
		* to ensure you don't leak memory.
		* @param {String|Element} el Element, or id of the element, to remove.
		* @returns {Mottle} The current Mottle instance; you can chain this method.
		*/
		this.remove = function(el) {
			_each(el, function() {
				var _el = _gel(this);
				if (_el.__ta) {
					for (var evt in _el.__ta) {
						for (var h in _el.__ta[evt]) {
							_unbind(_el, evt, _el.__ta[evt][h]);
						}
					}
				}
				_el.parentNode && _el.parentNode.removeChild(_el);
			});
			return this;
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
			_each(el, function() {
				var _el = _gel(this), evt;
				if (document.createEvent) {
					evt = document.createEvent("MouseEvents");
					evt.initMouseEvent(event, true, true, window, 0,
						originalEvent.screenX, originalEvent.screenY,
						originalEvent.clientX, originalEvent.clientY,
						false, false, false, false, 1, null);
					_el.dispatchEvent(evt);
				}
				else if (document.createEventObject) {
					evt = document.createEventObject();
					evt.eventType = evt.eventName = event;
					evt.screenX = originalEvent.screenX;
					evt.screenY = originalEvent.screenY;
					evt.clientX = originalEvent.clientX;
					evt.clientY = originalEvent.clientY;
					_el.fireEvent('on' + event, evt);
				}
			});
			return this;
		}
	};

	/**
	* @name Mottle#consume
	* @desc Static method to assist in 'consuming' an element.
	*/
	Mottle.consume = function(e, doNotPreventDefault) {
		if (e.stopPropagation)
			e.stopPropagation();
		else 
			e.returnValue = false;
		if (!doNotPreventDefault && e.preventDefault)
			 e.preventDefault();
	};

}).call(this);

;(function() {

	"use strict";

	var Sniff = {
		android:navigator.userAgent.toLowerCase().indexOf("android") > -1
	};

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
			obj.__ta && obj.__ta[event] && delete obj.__ta[event][fn.__tauid];
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
		_genLoc = function(e, prefix) {
			if (e == null) return [ 0, 0 ];
			var ts = _touches(e), t = _getTouch(ts, 0);
			return [t[prefix + "X"], t[prefix + "Y"]];
		},
		_pageLocation = function(e) {
			if (e == null) return [ 0, 0 ];
			if (isIELT9) {
				return [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
			}
			else {
				return _genLoc(e, "page");
			}
		},
		_screenLocation = function(e) {
			return _genLoc(e, "screen");
		},
		_clientLocation = function(e) {
			return _genLoc(e, "client");
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
				obj[key] = function() { 
					obj["e"+key] && obj["e"+key]( window.event ); 
				};
				obj.attachEvent( "on"+type, obj[key] );
			}
		},
		_unbind = function( obj, type, fn) {
			if (fn == null) return;
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
			if (obj == null) return;
			// if a list (or list-like), use it. if a string, get a list 
			// by running the string through querySelectorAll. else, assume 
			// it's an Element.
			obj = (typeof obj !== "string") && (obj.tagName == null && obj.length != null) ? obj : typeof obj === "string" ? document.querySelectorAll(obj) : [ obj ];
			for (var i = 0; i < obj.length; i++)
				fn.apply(obj[i]);
		};

	/**
	* Event handler.  Offers support for abstracting out the differences
	* between touch and mouse devices, plus "smart click" functionality
	* (don't fire click if the mouse has moved betweeb mousedown and mouseup),
	* and synthesized click/tap events.
	* @class Mottle
	* @constructor
	* @param {Object} params Constructor params
	* @param {Integer} [params.clickThreshold=150] Threshold, in milliseconds beyond which a touchstart followed by a touchend is not considered to be a click.
	* @param {Integer} [params.dblClickThreshold=350] Threshold, in milliseconds beyond which two successive tap events are not considered to be a click.
	* @param {Boolean} [params.smartClicks=false] If true, won't fire click events if the mouse has moved between mousedown and mouseup. Note that this functionality
	* requires that Mottle consume the mousedown event, and so may not be viable in all use cases.
	*/
	this.Mottle = function(params) {
		params = params || {};
		var self = this, 
			clickThreshold = params.clickThreshold || 150,
			dblClickThreshold = params.dblClickThreshold || 350,
			mouseEnterExitHandler = new MouseEnterExitHandler(),
			tapHandler = new TapHandler(clickThreshold, dblClickThreshold),
			_smartClicks = params.smartClicks,
			_doBind = function(obj, evt, fn, children) {
				if (fn == null) return;
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
		* Removes an element from the DOM, and unregisters all event handlers for it. You should use this
		* to ensure you don't leak memory.
		* @method remove
		* @param {String|Element} el Element, or id of the element, to remove.
		* @return {Mottle} The current Mottle instance; you can chain this method.
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
		* Register an event handler, optionally as a delegate for some set of descendant elements. Note
		* that this method takes either 3 or 4 arguments - if you supply 3 arguments it is assumed you have 
		* omitted the `children` parameter, and that the event handler should be bound directly to the given element.
		* @method on
		* @param {Element[]|Element|String} el Either an Element, or a CSS spec for a list of elements, or an array of Elements.
		* @param {String} [children] Comma-delimited list of selectors identifying allowed children.
		* @param {String} event Event ID.
		* @param {Function} fn Event handler function.
		* @return {Mottle} The current Mottle instance; you can chain this method.
		*/
		this.on = function(el, event, children, fn) {
			var _el = arguments[0],
				_c = arguments.length == 4 ? arguments[2] : null,
				_e = arguments[1],
				_f = arguments[arguments.length - 1];

			_doBind(_el, _e, _f, _c);
			return this;
		};	

		/**
		* Cancel delegate event handling for the given function. Note that unlike with 'on' you do not supply
		* a list of child selectors here: it removes event delegation from all of the child selectors for which the
		* given function was registered (if any).
		* @method off
		* @param {Element[]|Element|String} el Element - or ID of element - from which to remove event listener.
		* @param {String} event Event ID.
		* @param {Function} fn Event handler function.
		* @return {Mottle} The current Mottle instance; you can chain this method.
		*/
		this.off = function(el, evt, fn) {
			_unbind(el, evt, fn);
			return this;
		};

		/**
		* Triggers some event for a given element.
		* @method trigger
		* @param {Element} el Element for which to trigger the event.
		* @param {String} event Event ID.
		* @param {Event} originalEvent The original event. Should be optional of course, but currently is not, due
		* to the jsPlumb use case that caused this method to be added.
		* @param {Object} [payload] Optional object to set as `payload` on the generated event; useful for message passing.
		* @return {Mottle} The current Mottle instance; you can chain this method.
		*/
		this.trigger = function(el, event, originalEvent, payload) {
			var eventToBind = (isTouchDevice && touchMap[event]) ? touchMap[event] : event;
			var pl = _pageLocation(originalEvent), sl = _screenLocation(originalEvent), cl = _clientLocation(originalEvent);
			_each(el, function() {
				var _el = _gel(this), evt;
				originalEvent = originalEvent || {
					screenX:sl[0],
					screenY:sl[1],
					clientX:cl[0],
					clientY:cl[1]
				};

				var _decorate = function(_evt) {
					if (payload) _evt.payload = payload;
				};

				var eventGenerators = {
					"TouchEvent":function(evt) {
						var t = document.createTouch(window, _el, 0, pl[0], pl[1], 
									sl[0], sl[1],
									cl[0], cl[1],
									0,0,0,0);

						evt.initTouchEvent(eventToBind, true, true, window, 0, 
							sl[0], sl[1],
							cl[0], cl[1],
							false, false, false, false, document.createTouchList(t));
					},
					"MouseEvents":function(evt) {
						evt.initMouseEvent(eventToBind, true, true, window, 0,
							sl[0], sl[1],
							cl[0], cl[1],
							false, false, false, false, 1, _el);
						
						if (Sniff.android) {
							// Android's touch events are not standard.
							var t = document.createTouch(window, _el, 0, pl[0], pl[1], 
										sl[0], sl[1],
										cl[0], cl[1],
										0,0,0,0);

							evt.touches = evt.targetTouches = evt.changedTouches = document.createTouchList(t);
						}
					}
				};

				if (document.createEvent) {
					var ite = (isTouchDevice && touchMap[event] && !Sniff.android), evtName = ite ? "TouchEvent" : "MouseEvents";
					evt = document.createEvent(evtName);
					eventGenerators[evtName](evt);
					_decorate(evt);
					_el.dispatchEvent(evt);
				}
				else if (document.createEventObject) {
					evt = document.createEventObject();
					evt.eventType = evt.eventName = eventToBind;
					evt.screenX = sl[0];
					evt.screenY = sl[1];
					evt.clientX = cl[0];
					evt.clientY = cl[1];
					_decorate(evt);
					_el.fireEvent('on' + eventToBind, evt);
				}
			});
			return this;
		}
	};

	/**
	* Static method to assist in 'consuming' an element: uses `stopPropagation` where available, or sets `e.returnValue=false` where it is not.
	* @method Mottle.consume
	* @param {Event} e Event to consume
	* @param {Boolean} [doNotPreventDefault=false] If true, does not call `preventDefault()` on the event.
	*/
	Mottle.consume = function(e, doNotPreventDefault) {
		if (e.stopPropagation)
			e.stopPropagation();
		else 
			e.returnValue = false;

		if (!doNotPreventDefault && e.preventDefault)
			 e.preventDefault();
	};

	/**
	* Gets the page location corresponding to the given event. For touch events this means get the page location of the first touch.
	* @method Mottle.pageLocation
	* @param {Event} e Event to get page location for.
	* @return {Integer[]} [left, top] for the given event.
	*/
	Mottle.pageLocation = _pageLocation;

}).call(this);

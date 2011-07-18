/*
 * mootools.jsPlumb 1.3.0-RC1
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

;(function() {
	
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
		step : function(now) {
			this.parent(now);
			if (this.onStep) { 
				try { this.onStep(); } 
				catch(e) { } 
			}
		}
	});
	
	var _droppables = {},
	_droppableOptions = {},
	_draggablesByScope = {},
	_draggablesById = {};
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
		
		getClientXY : function(eventObject) {
			return [eventObject.event.clientX, eventObject.event.clientY];
		},
		
		getDragObject : function(eventArgs) {
			return eventArgs[0];
		},
		
		getDragScope : function(el) {
			var id = jsPlumb.getId(el);
			var drags = _draggablesById[id];
			return drags[0].scope;
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
		
		getPageXY : function(eventObject) {
			return [eventObject.event.pageX, eventObject.event.pageY];
		},
		
		getParent : function(el) {
			return jsPlumb.CurrentLibrary.getElementObject(el).getParent();
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
			var ui = eventArgs[0],
			p = jsPlumb.CurrentLibrary.getElementObject(ui).getPosition();
			return { left:p.x, top:p.y };
		},		
		
		hasClass : function(el, clazz) {
			return el.hasClass(clazz);
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
				drag.scope = scope;
				//console.log("drag scope initialized to ", scope);
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
		
		setDragScope : function(el, scope) {
			var drag = _draggablesById[el.get("id")];
			var filterFunc = function(entry) {
				return entry.get("id") != el.get("id");
			};
			var droppables = _droppables[scope] ? _droppables[scope].filter(filterFunc) : [];
			drag[0].droppables = droppables;
		},
		
		setOffset : function(el, o) {
			_getElementObject(el).setPosition({x:o.left, y:o.top});
		}
	};
	
	window.addEvent('domready', jsPlumb.init);
})();

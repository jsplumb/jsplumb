/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.3.15
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the MooTools adapter.
 *
 * Copyright (c) 2010 - 2012 Simon Porritt (http://jsplumb.org)
 * 
 * http://jsplumb.org
 * http://github.com/sporritt/jsplumb
 * http://code.google.com/p/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
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
	_draggablesById = {},
	_droppableScopesById = {};
	/*
	 * 
	 */
	var _executeDroppableOption = function(el, dr, event, originalEvent) {
		if (dr) {
			var id = dr.get("id");
			if (id) {
				var options = _droppableOptions[id];
				if (options) {
					if (options[event]) {
						options[event](el, dr, originalEvent);
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
	var _add = function(list, _scope, value) {
		var l = list[_scope];
		if (!l) {
			l = [];
			list[_scope] = l;
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
			el = jsPlumb.CurrentLibrary.getElementObject(el)						
			try {
				if (el.className.constructor == SVGAnimatedString) {
					jsPlumbUtil.svg.addClass(el, clazz);
				}
				else el.addClass(clazz);
			}
			catch (e) {				
				// SVGAnimatedString not supported; no problem.
				el.addClass(clazz);
			}						
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
			var id = jsPlumb.getId(el),
			    drags = _draggablesById[id];
			return drags[0].scope;
		},
	
		getDropEvent : function(args) {			
			return args[2];
		},
		
		getDropScope : function(el) {
			var id = jsPlumb.getId(el);
			return _droppableScopesById[id];
		},
		
		getDOMElement : function(el) { 
			// MooTools just decorates the DOM elements. so we have either an ID or an Element here.
			return typeof(el) == "String" ? document.getElementById(el) : el; 
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
		
		getOriginalEvent : function(e) {
			return e.event;
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
		
		getSelector : function(spec) {
			return $$(spec);
		},
		
		getSize : function(el) {
			var s = el.getSize();
			return [s.x, s.y];
		},

        getTagName : function(el) {
            var e = jsPlumb.CurrentLibrary.getElementObject(el);
            return e != null ? e.tagName : null;
        },
		
		/*
		 * takes the args passed to an event function and returns you an object that gives the
		 * position of the object being moved, as a js object with the same params as the result of
		 * getOffset, ie: { left: xxx, top: xxx }.
		 */
		getUIPosition : function(eventArgs, zoom) {
		  var ui = eventArgs[0],
			  el = jsPlumb.CurrentLibrary.getElementObject(ui),
			  p = el.getPosition();
			
		  zoom = zoom || 1;		  
			
		  return { left:p.x / zoom, top:p.y / zoom};
		},		
		
		hasClass : function(el, clazz) {
			return el.hasClass(clazz);
		},
		
		initDraggable : function(el, options, isPlumbedComponent) {
			var id = jsPlumb.getId(el);
			var drag = _draggablesById[id];
			if (!drag) {
				var originalZIndex = 0,
                    originalCursor = null,
				    dragZIndex = jsPlumb.Defaults.DragOptions.zIndex || 2000;
                
				options['onStart'] = jsPlumb.wrap(options['onStart'], function() {
                    originalZIndex = this.element.getStyle('z-index');
					this.element.setStyle('z-index', dragZIndex);
                    drag.originalZIndex = originalZIndex;
					if (jsPlumb.Defaults.DragOptions.cursor) {
						originalCursor = this.element.getStyle('cursor');
						this.element.setStyle('cursor', jsPlumb.Defaults.DragOptions.cursor);
					}
				});
				
				options['onComplete'] = jsPlumb.wrap(options['onComplete'], function() {
					this.element.setStyle('z-index', originalZIndex);
					if (originalCursor) {
						this.element.setStyle('cursor', originalCursor);
					}                    
				});
				
				// DROPPABLES - only relevant if this is a plumbed component, ie. not just the result of the user making some DOM element
                // draggable.  this is the only library adapter that has to care about this parameter.
				var scope = "" + (options["scope"] || jsPlumb.Defaults.Scope),
				    filterFunc = function(entry) {
					    return entry.get("id") != el.get("id");
				    },
				    droppables = _droppables[scope] ? _droppables[scope].filter(filterFunc) : [];

                if (isPlumbedComponent) {

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
				    options['onDrop'] = function(el, dr, event) {
					    if (dr) {
						    _checkHover(dr, false);
						    _executeDroppableOption(el, dr, 'onDrop', event);
					    }
				    };
                }
                else
                    options["droppables"] = [];
				
				drag = new Drag.Move(el, options);
				drag.scope = scope;
                drag.originalZIndex = originalZIndex;
                _add(_draggablesById, el.get("id"), drag);
				// again, only keep a record of this for scope stuff if this is a plumbed component (an endpoint)
                if (isPlumbedComponent) {
				    _add(_draggablesByScope, scope, drag);
                }
				// test for disabled.
				if (options.disabled) drag.detach();
			}
			return drag;
		},
		
		initDroppable : function(el, options, isPlumbedComponent, isPermanent) {
			var scope = options["scope"];
            _add(_droppables, scope, el);
			var id = jsPlumb.getId(el);

            el.setAttribute("_isPermanentDroppable", isPermanent);  // we use this to clear out droppables on drag complete.
			_droppableOptions[id] = options;
			_droppableScopesById[id] = scope;
			var filterFunc = function(entry) { return entry.element != el; },
			    draggables = _draggablesByScope[scope] ? _draggablesByScope[scope].filter(filterFunc) : [];
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
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			try {
				if (el.className.constructor == SVGAnimatedString) {
					jsPlumbUtil.svg.removeClass(el, clazz);
				}
				else el.removeClass(clazz);
			}
			catch (e) {				
				// SVGAnimatedString not supported; no problem.
				el.removeClass(clazz);
			}
		},
		
		removeElement : function(element, parent) {
            var el = _getElementObject(element);
			if (el) el.dispose();  // ??
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
		},

        stopDrag : function() {
            for (var i in _draggablesById) {
                for (var j = 0; j < _draggablesById[i].length; j++) {
                    var d = _draggablesById[i][j];
                    d.stop();
                    if (d.originalZIndex != 0)
                        d.element.setStyle("z-index", d.originalZIndex);
                }
            }
        },
		
		/**
		 * note that jquery ignores the name of the event you wanted to trigger, and figures it out for itself.
		 * the other libraries do not.  yui, in fact, cannot even pass an original event.  we have to pull out stuff
		 * from the originalEvent to put in an options object for YUI. 
		 * @param el
		 * @param event
		 * @param originalEvent
		 */
		trigger : function(el, event, originalEvent) {
			originalEvent.stopPropagation();
			_getElementObject(el).fireEvent(event, originalEvent);
		},
		
		unbind : function(el, event, callback) {
			el = _getElementObject(el);
			el.removeEvent(event, callback);
		}
	};
	
	window.addEvent('domready', jsPlumb.init);
})();

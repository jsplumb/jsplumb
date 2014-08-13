/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.6.4
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG or VML.  
 * 
 * This file contains the MooTools adapter.
 *
 * Copyright (c) 2010 - 2014 Simon Porritt (http://jsplumbtoolkit.com)
 * 
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {
	
	"use strict";
	
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
			if (options.onStep) {
				this.onStep = options.onStep;
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
	
	var JSPLUMB_MOOTOOLS_DROPPABLE = "jsplumb-mootools-droppable";
	
	var _droppables = {},
	_droppableOptions = {},
	_draggablesByScope = {},
	_getDraggable = function(el, instance) {
		var id = instance.getId(el), d = instance.draggablesById;
			
		if (d != null)
			return d[id];
	},
	_clearDraggables= function(el, instance) {
		var d = instance.draggablesById;
		if (d) {
			delete d[instance.getId(el)];
		}
	},
	_addDraggable = function(el, instance, drag) {
		var d = instance.draggablesById, id = instance.getId(el);
			
		if (d == null) {
			d = instance.draggablesById = {};
			var re = instance.reset;
			instance.reset = function() {
				re.apply(instance);
				instance.draggablesById = {};
			};
		}
		
		d[id] = drag;
	},
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
					if (options.hoverClass) {
						if (entering) el.addClass(options.hoverClass);
						else el.removeClass(options.hoverClass);
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
	
	// new: move to putting stuff on jsplumb prototype
	$extend(jsPlumbInstance.prototype, {
		
		doAnimate : function(el, properties, options) {			
			var m = new jsPlumbMorph(el, options);
			m.start(properties);
		},		
		getSelector : function(context, spec) {
            if (arguments.length == 2) {
                return _getElementObject(context).getElements(spec);
            }
            else
			     return $$(context);
		},
		
		getDOMElement : function(el) { 
			if (el == null) return null;
			// MooTools just decorates the DOM elements. so we have either an ID, an element list, or an Element here.
			return typeof(el) == "string" ? document.getElementById(el) : el.length ? el[0] : el; 
		},
		
		getElementObject : _getElementObject,
		
		removeElement : function(element, parent) {
            var el = _getElementObject(element);
			if (el) el.dispose();  // ??
		},
		
		destroyDraggable : function(el) {
			var d = _getDraggable(el, this);
			if (d) {
				d.detach();
				_clearDraggables(el, this);
			}
		},

		destroyDroppable : function(el) {
			// TODO
		},
		initDraggable : function(el, options, isPlumbedComponent) {
			var drag = _getDraggable(el, this);
			if (!drag) {
				var originalZIndex = 0,
                    originalCursor = null,
				    dragZIndex = jsPlumb.Defaults.DragOptions.zIndex || 2000;
                
				options.onStart = jsPlumbUtil.wrap(options.onStart, function() {
                    originalZIndex = drag.element.getStyle('z-index');
					drag.element.setStyle('z-index', dragZIndex);
                    drag.originalZIndex = originalZIndex;
					if (jsPlumb.Defaults.DragOptions.cursor) {
						originalCursor = drag.element.getStyle('cursor');
						drag.element.setStyle('cursor', jsPlumb.Defaults.DragOptions.cursor);
					}
					$(document.body).addClass(this.dragSelectClass);
				}.bind(this));
				
				options.onComplete = jsPlumbUtil.wrap(options.onComplete, function() {
					drag.element.setStyle('z-index', originalZIndex);
					if (originalCursor) {
						drag.element.setStyle('cursor', originalCursor);
					}                    
					$(document.body).removeClass(this.dragSelectClass);
				}.bind(this));
				
				// DROPPABLES - only relevant if this is a plumbed component, ie. not just the result of the user making some DOM element
                // draggable.  this is the only library adapter that has to care about this parameter.
				var scope = "" + (options.scope || jsPlumb.Defaults.Scope),
				    filterFunc = function(entry) {
					    return entry.get("id") != el.get("id");
				    },
				    droppables = _droppables[scope] ? _droppables[scope].filter(filterFunc) : [];

                if (isPlumbedComponent) {

				    options.droppables = droppables;
				    options.onLeave = jsPlumbUtil.wrap(options.onLeave, function(el, dr) {
		    			if (dr) {
			    			_checkHover(dr, false);
				    		_executeDroppableOption(el, dr, 'onLeave');
					    }
				    });
				    options.onEnter = jsPlumbUtil.wrap(options.onEnter, function(el, dr) {
					    if (dr) {
						    _checkHover(dr, true);
						    _executeDroppableOption(el, dr, 'onEnter');
					    }
				    });
				    options.onDrop = function(el, dr, event) {
					    if (dr) {
						    _checkHover(dr, false);
						    _executeDroppableOption(el, dr, 'onDrop', event);
					    }
				    };
                }
                else
                    options.droppables = [];
				
				drag = new Drag.Move(el, options);
				drag.scope = scope;
                drag.originalZIndex = originalZIndex;
				_addDraggable(el, this, drag);
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
			var scope = options.scope;
            _add(_droppables, scope, el);
			var id = this.getId(el);

			jsPlumbAdapter.addClass(el, JSPLUMB_MOOTOOLS_DROPPABLE);
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
			return _getDraggable(el, this) != null;
		},										
		
		isDragSupported : function(el, options) {
			return typeof Drag != 'undefined' ;
		},	
		
		/*
		 * you need Drag.Move imported to make drop work.
		 */
		isDropSupported : function(el, options) {
			return (typeof Drag !== undefined && typeof Drag.Move !== undefined);
		},
		getDragObject : function(eventArgs) {
			return eventArgs[0];
		},
		
		getDragScope : function(el) {
			return _getDraggable(el, this).scope;
		},
	
		getDropEvent : function(args) {
			return args[2];
		},
		
		getDropScope : function(el) {
			var id = this.getId(el);
			return _droppableScopesById[id];
		},
		
		stopDrag : function() {
			var did = _draggablesById[this.getInstanceIndex()];
            for (var i in did) {
                for (var j = 0; j < did[i].length; j++) {
                    var d = did[i][j];
                    d.stop();
                    if (d.originalZIndex !== 0)
                        d.element.setStyle("z-index", d.originalZIndex);
                }
            }
        },
		
		/*
		 * takes the args passed to an event function and returns you an object that gives the
		 * position of the object being moved, as a js object with the same params as the result of
		 * getOffset, ie: { left: xxx, top: xxx }.
		 */
		getUIPosition : function(eventArgs, zoom) {
		  var ui = eventArgs[0],
		  	el = jsPlumb.getDOMElement(ui),
			o = jsPlumbAdapter.getOffset(el, this);
			zoom = zoom || 1;
			return { left:o.left / zoom, top:o.top/zoom };
		},
		
		isDragFilterSupported:function() { return false; },
		
		setDragFilter : function(el, filter) {
			jsPlumbUtil.log("NOT IMPLEMENTED: setDragFilter");
		},
		
		setElementDraggable : function(el, draggable) {
			var d = _getDraggable(el, this);
			if (d)
				d[draggable ? "attach" : "detach"]();
		},
		
		setDragScope : function(el, scope) {
			var drag = _getDraggable(el, this);
			var filterFunc = function(entry) {
				return entry.get("id") != el.get("id");
			};
			var droppables = _droppables[scope] ? _droppables[scope].filter(filterFunc) : [];
			drag.droppables = droppables;
		},
		
		dragEvents : {
			'start':'onStart', 'stop':'onComplete', 'drag':'onDrag', 'step':'onStep',
			'over':'onEnter', 'out':'onLeave','drop':'onDrop', 'complete':'onComplete'
		},
		animEvents:{
			'step':"onStep", 'complete':'onComplete'
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
		
		getOriginalEvent : function(e) {
			return e.event;
		},
		on : function(el, event, callback) {
			var els = jsPlumbUtil.isString(el) || typeof el.length == "undefined" ? [ _getElementObject(el) ] : $$(el);
			//el = _getElementObject(el);
			for (var i = 0; i < els.length; i++)
				els[i].addEvent(event, callback);
		},
		off : function(el, event, callback) {
			el = _getElementObject(el);
			el.removeEvent(event, callback);
		},
		reset:function() {

		}
	});

	window.addEvent('domready', jsPlumb.init);
})();

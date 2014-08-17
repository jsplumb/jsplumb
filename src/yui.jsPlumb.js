/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.6.4
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG or VML.  
 * 
 * This file contains the YUI3 adapter.
 *
 * Copyright (c) 2010 - 2014 Simon Porritt (simon@jsplumbtoolkit.com)
 * 
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {
	
	"use strict";
	
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function( v, b, s ) {
			for( var i = +b || 0, l = this.length; i < l; i++ ) {
	  			if( this[i]===v || s && this[i]==v ) { return i; }
	 		}
	 		return -1;
		};
	}
	
	var Y;
	
	YUI({
		base:"https://yui-s.yahooapis.com/" + YUI.version + "/build/"
	}).use('node', 'dd', 'dd-constrain', 'anim', 'node-event-simulate', function(_Y) {
		Y = _Y;	
		Y.on("domready", function() { jsPlumb.init(); });
	});
	
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
	},	
	ddEvents = [ "drag:mouseDown", "drag:afterMouseDown", "drag:mouseup",
	     "drag:align", "drag:removeHandle", "drag:addHandle", "drag:removeInvalid", "drag:addInvalid",
	     "drag:start", "drag:end", "drag:drag", "drag:over", "drag:enter",
	     "drag:exit", "drag:drophit", "drag:dropmiss", "drop:over", "drop:enter", "drop:exit", "drop:hit"	     	               
	],	
	animEvents = [ "tween" ],	
	/**
	 * helper function to curry callbacks for some element. 
	 */
	_wrapper = function(fn) {
		return function() {
			try {
				return fn.apply(this, arguments);
			}
			catch (e) { }
		};
	},	
	/**
	 * extracts options from the given options object, leaving out event handlers.
	 */
	_getDDOptions = function(options) {
		var o = {};
		for (var i in options) if (ddEvents.indexOf(i) == -1) o[i] = options[i];
		return o;
	},	
	/**
	 * attaches all event handlers found in options to the given dragdrop object, and registering
	 * the given el as the element of interest.
	 */
	_attachListeners = function(dd, options, eventList) {	
	    for (var ev in options) {
	    	if (eventList.indexOf(ev) != -1) {
	    		var w = _wrapper(options[ev]);
	    		dd.on(ev, w);
	    	}
	    }
	},
	_droppables = {},
	_droppableOptions = {},
	_draggablesByScope = {},
	_draggablesById = {},
	_droppableScopesById = {},
	_checkHover = function(el, entering) {
		if (el) {
			var id = el.get("id");
			if (id) {
				var options = _droppableOptions[id];
				if (options) {
					if (options.hoverClass) {
						el[entering ? "addClass" : "removeClass"](options.hoverClass);
					}
				}
			}
		}
	},
	_lastDragObject = null,	
	_getAttribute = function(el, attributeId) {
		return el.getAttribute(attributeId);
	},
	_getElementObject = function(el) {
		if (el == null) return null;
		var eee = null;
        eee = typeof el == 'string' ? Y.one('#' + el) : el._node ? el : Y.one(el);        
        return eee;
	};
	
	jsPlumb.extend(jsPlumbInstance.prototype, {		
		/**
		 * animates the given element.
		 */
		doAnimate : function(el, properties, options) {
			var o = jsPlumb.extend({node:el, to:properties}, options),
				id = _getAttribute(el, "id");
				
			// duration will be in milliseconds here; we have to divide by 1000
			// if it is present and it is a number.
			if (o.duration && jsPlumbUtil.isNumber(o.duration))
				o.duration /= 1000;
			
			// also, if easing was provided as a string, we want to see if it is
			// a support member in Y.Easing. if it is, we use that. otherwise
			// we delete it.
			if (o.easing && jsPlumbUtil.isString(o.easing)) {
				if (Y.Easing[o.easing]) 
					o.easing = Y.Easing[o.easing];
				else
					delete o.easing;
			}
				
			o.tween = jsPlumbUtil.wrap(properties.tween, function() {
				this.repaint(id);
			}.bind(this));
			var a = new Y.Anim(o);
			_attachListeners(a, o, animEvents);
			a.run();
		},
		getSelector : function(context, spec) {
			var _convert = function(s) { return s && s ._nodes ? s._nodes : []; };
            
            if (arguments.length == 2) {            
                return _convert(_getElementObject(context).all(spec));
            }
            else {
			     return _convert(Y.all(context));
            }            
		},
		getElementObject : _getElementObject,
		removeElement : function(el) { _getElementObject(el).remove(); },
		destroyDraggable : function(el) {
			var id = this.getId(el),
				dd = _draggablesById[id];

			if (dd) {
				dd.destroy();
				delete _draggablesById[id];
			}
		},

		destroyDroppable : function(el) {
			// TODO
		},
		initDraggable : function(el, options, isPlumbedComponent) {
			var _opts = _getDDOptions(options),
				id = this.getId(el);
			_opts.node = "#" + id;	
			options["drag:start"] = jsPlumbUtil.wrap(options["drag:start"], function() {
				Y.one(document.body).addClass(this.dragSelectClass);
			}.bind(this), false);	
			options["drag:end"] = jsPlumbUtil.wrap(options["drag:end"], function() {
				Y.one(document.body).removeClass(this.dragSelectClass);
			}.bind(this));	
			var dd = new Y.DD.Drag(_opts), 
                containment = options.constrain2node || options.containment;

			dd.el = el;	
            
            if (containment) {
                dd.plug(Y.Plugin.DDConstrained, {
                    constrain2node: containment
                });
            }
			
			if (isPlumbedComponent) {
				var scope = options.scope || this.Defaults.Scope;
				dd.scope = scope;
				_add(_draggablesByScope, scope, dd);
			}
			
			_draggablesById[id] = dd;						
			_attachListeners(dd, options, ddEvents);
		},
		
		initDroppable : function(el, options) {
			var _opts = _getDDOptions(options),
				id = this.getId(el);
			_opts.node = "#" + id;			
			var dd = new Y.DD.Drop(_opts);
			
			_droppableOptions[id] = options;
			
			options = jsPlumb.extend({}, options);
			var scope = options.scope || jsPlumb.Defaults.Scope;					
			_droppableScopesById[id] = scope;
			
			options["drop:enter"] = jsPlumbUtil.wrap(options["drop:enter"], function(e) {
				if (e.drag.scope !== scope) return true;
				_checkHover(el, true);
			}, true);
			options["drop:exit"] = jsPlumbUtil.wrap(options["drop:exit"], function(e) {
				_checkHover(el, false);
			});
			options["drop:hit"] = jsPlumbUtil.wrap(options["drop:hit"], function(e) {
				if (e.drag.scope !== scope) return true;
				_checkHover(el, false);
			}, true);
			
			_attachListeners(dd, options, ddEvents);
		},
		
		isAlreadyDraggable : function(el) {
			el = _getElementObject(el);
			return el.hasClass("yui3-dd-draggable");
		},
		
		isDragSupported : function(el) { return true; },		
		isDropSupported : function(el) { return true; },
		/**
		 * takes the args passed to an event function and returns you an object representing that which is being dragged.
		 */
		getDragObject : function(eventArgs) {
			// this is a workaround for the unfortunate fact that in YUI3, the 'drop:exit' event does
			// not contain a reference to the drag that just exited.  single-threaded js to the 
			// rescue: we'll just keep it for ourselves.
			if (eventArgs[0].drag) _lastDragObject = eventArgs[0].drag.el;
			return _lastDragObject;
		},
		
		getDragScope : function(el) {
			var id = this.getId(el),
				dd = _draggablesById[id];
			return dd.scope;
		},

		getDropEvent : function(args) {
			return args[0];
		},
		
		getDropScope : function(el) {
			var id = this.getId(el);
			return _droppableScopesById[id];
		},
		getUIPosition : function(args, zoom) {
			zoom = zoom || 1;
			var el = args[0].currentTarget.el._node || args[0].currentTarget.el;
			var o = jsPlumbAdapter.getOffset(el, this);
			return { left:o.left / zoom, top:o.top/zoom };
		},
		isDragFilterSupported:function() { return false; },
		
		setDragFilter : function(el, filter) {
			jsPlumbUtil.log("NOT IMPLEMENTED: setDragFilter");
		},
		
		/**
		 * sets the draggable state for the given element
		 */
		setElementDraggable : function(el, draggable) {
			var id = this.getId(el),
				dd = _draggablesById[id];
			if (dd) dd.set("lock", !draggable);
		},
		
		setDragScope : function(el, scope) {
			var id = this.getId(el),
				dd = _draggablesById[id];
			if (dd) dd.scope = scope;
		},
		
		trigger : function(el, event, originalEvent) {
			originalEvent.stopPropagation();
			_getElementObject(el).simulate(event, {
				pageX:originalEvent.pageX, 
				pageY:originalEvent.pageY, 
				clientX:originalEvent.clientX, 
				clientY:originalEvent.clientY
			});			
		},
		dragEvents : {
			"start":"drag:start", "stop":"drag:end", "drag":"drag:drag", "step":"step",
			"over":"drop:enter", "out":"drop:exit", "drop":"drop:hit"
		},
		animEvents:{
			'step':"tween", 'complete':'end'
		},
		stopDrag : function(el) {
            Y.DD.DDM.stopDrag();
        },
		
		getDOMElement : function(el) { 	
			if (el == null) return null;		
			if (typeof(el) == "string") 
				return document.getElementById(el);
			else if (el._node) 
				return el._node;
			else if (el.length)
				return el[0];
			else return el;
		},
		getOriginalEvent : function(e) {
			return e._event;
		},
		/**
		 * event binding wrapper.  
		 */
		on : function(el, event, callback) {
			var els = jsPlumbUtil.isString(el) || typeof el.length == "1.6.4" ? [ _getElementObject(el) ] : Y.all(el)._nodes;
			for (var i = 0; i < els.length; i++)
				Y.one(els[i]).on(event, callback);
		},
			
		
		/**
		 * event unbinding wrapper.  
		 */
		off : function(el, event, callback) {
			_getElementObject(el).detach(event, callback);
		}
	});
})();
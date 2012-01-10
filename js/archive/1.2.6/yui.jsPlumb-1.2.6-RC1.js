
/*
 * yui.jsPlumb 1.2.6-RC1
 * 
 * YUI3 specific functionality for jsPlumb.
 * 
 * http://morrisonpitt.com/jsPlumb/demo.html
 * http://code.google.com/p/jsPlumb
 * 
 * NOTE: for production usage you should use yui-all-x.x.x-min.js, which contains the main jsPlumb script and this script together,
 * in a minified file.
 * 
 * Dual licensed under MIT and GPL2.
 * 
 */ 

/**
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
 * getScrollLeft		gets an element's scroll left.  TODO: is this actually used?  will it be?
 * getScrollTop			gets an element's scroll top.  TODO: is this actually used?  will it be?
 * getSize				gets an element's size.
 * getUIPosition		gets the position of some element that is currently being dragged, by extracting it from the arguments passed to a drag callback.
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
(function() {
	
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function( v, b, s ) {
			for( var i = +b || 0, l = this.length; i < l; i++ ) {
	  			if( this[i]===v || s && this[i]==v ) { return i; }
	 		}
	 		return -1;
		};
	}
	
	var Y;
	
	YUI().use('node', 'dd', 'anim', function(_Y) {
		Y = _Y;	
		Y.on("domready", function() { 
			jsPlumb.init(); 
		});
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
	};
	
	var ddEvents = [ "drag:mouseDown", "drag:afterMouseDown", "drag:mouseup", 
	     "drag:align", "drag:removeHandle", "drag:addHandle", "drag:removeInvalid", "drag:addInvalid",
	     "drag:start", "drag:end", "drag:drag", "drag:over", "drag:enter",
	     "drag:exit", "drag:drophit", "drag:dropmiss", "drop:over", "drop:enter", "drop:exit", "drop:hit"	     	               
	];
	
	var animEvents = [ "tween" ];
	
	/**
	 * helper function to curry callbacks for some element. 
	 */
	var _wrapper = function(fn) {
		return function() { fn.apply(this, arguments); };
	};
	
	/**
	 * extracts options from the given options object, leaving out event handlers.
	 */
	var _getDDOptions = function(options) {
		var o = {};
		for (var i in options) if (ddEvents.indexOf(i) == -1) o[i] = options[i];
		return o;
	};
	
	/**
	 * attaches all event handlers found in options to the given dragdrop object, and registering
	 * the given el as the element of interest.
	 */
	var _attachListeners = function(dd, options, eventList) {	
	    for (var ev in options) {
	    	if (eventList.indexOf(ev) != -1) {
	    		var w = _wrapper(options[ev]);
	    		dd.on(ev, w);
	    	}
	    }
	};
	
	var _droppables = {};
	var _droppableOptions = {};
	var _draggablesByScope = {};
	var _draggablesById = {};
	
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
	
	var _lastDragObject = null;
	
	var _extend = function(o1, o2) {
		for (var i in o2)
			o1[i] = o2[i];
		return o1;
	};
	
	var _getAttribute = function(el, attributeId) {
		return el.getAttribute(attributeId);
	};
	
	var _getElementObject = function(el) {
		return typeof el == 'string' ? Y.one('#' + el) : Y.one(el);
	};
	
	jsPlumb.CurrentLibrary = {
			
		addClass : function(el, clazz) {
			el.addClass(clazz);
		},	
		
		/**
		 * animates the given element.
		 */
		animate : function(el, properties, options) {
			var o = _extend({node:el, to:properties}, options);			
			var id = _getAttribute(el, "id");
			o["tween"] = jsPlumb.wrap(properties["tween"], function() {
				jsPlumb.repaint(id);
			});
			var a = new Y.Anim(o);
			_attachListeners(a, o, animEvents);
			a.run();
		},
		
		appendElement : function(child, parent) {
			_getElementObject (parent).append(child);			
		},
		
		/**
		 * event binding wrapper.  
		 */
		bind : function(el, event, callback) {
			_getElementObject(el).on(event, callback);
		},
			
		dragEvents : {
			'start':'drag:start', 'stop':'drag:end', 'drag':'drag:drag', 'step':'step',
			'over':'drop:enter', 'out':'drop:exit', 'drop':'drop:hit'
		},								
			
		extend : _extend,
		
		getAttribute : _getAttribute,				
		
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
			var id = jsPlumb.getId(el);
			var dd = _draggablesById[id];
			return dd.scope;
		},
		
		getElementObject : _getElementObject,
		
		getOffset : function(el) {
			var bcr = el._node.getBoundingClientRect();
			return { left:bcr.left, top:bcr.top };
		},
		
		getPageXY : function(eventObject) {
			return [eventObject.pageX, eventObject.pageY];
		},
		
		getScrollLeft : function(el) {
			alert("YUI getScrollLeft not implemented yet");
		},
		
		getScrollTop : function(el) {
			alert("YUI getScrollTop not implemented yet");
		},
		
		getSize : function(el) {
			//TODO must be a better way to get this?
			var bcr = _getElementObject(el)._node.getBoundingClientRect();
			return [ bcr.right - bcr.left, bcr.bottom - bcr.top];		// for some reason, in IE, the bounding rect does not always have width,height precomputed.
		},
		
		getUIPosition : function(args) {		
			//TODO must be a better way to get this? args was passed through from the drag function
			// in initDraggable above - args[0] here is the element that was inited.
			var bcr = _getElementObject(args[0].currentTarget.el)._node.getBoundingClientRect();
			return { left:bcr.left, top:bcr.top };
		},		
		
		hasClass : function(el, clazz) {
			return el.hasClass(clazz);
		},
				
		initDraggable : function(el, options) {
			var _opts = _getDDOptions(options);
			var id = jsPlumb.getId(el);
			_opts.node = "#" + id;				
			var dd = new Y.DD.Drag(_opts);
			dd.el = el;			
			
			var scope = options['scope'] || jsPlumb.Defaults.Scope;
			dd.scope = scope;
			
			_draggablesById[id] = dd;
			_add(_draggablesByScope, scope, dd);
			
			_attachListeners(dd, options, ddEvents);
		},
		
		initDroppable : function(el, options) {
			var _opts = _getDDOptions(options);
			var id = jsPlumb.getId(el);
			_opts.node = "#" + id;			
			var dd = new Y.DD.Drop(_opts);
				
			_droppableOptions[id] = options;
			
			options = _extend({}, options);
			var scope = options['scope'] || jsPlumb.Defaults.Scope;					
			
			options["drop:enter"] = jsPlumb.wrap(options["drop:enter"], function(e) {
				if (e.drag.scope !== scope) return true;
				_checkHover(el, true);
			}, true);
			options["drop:exit"] = jsPlumb.wrap(options["drop:exit"], function(e) {
				_checkHover(el, false);
			});
			options["drop:hit"] = jsPlumb.wrap(options["drop:hit"], function(e) {
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
		removeClass : function(el, clazz) { el.removeClass(clazz); },		
		removeElement : function(el) { _getElementObject(el).remove(); },
		
		setAttribute : function(el, attributeName, attributeValue) {
			el.setAttribute(attributeName, attributeValue);
		},
		
		/**
		 * sets the draggable state for the given element
		 */
		setDraggable : function(el, draggable) {
			var id = jsPlumb.getId(el);
			var dd = _draggablesById[id];
			if (dd) dd.set("lock", !draggable);
		},
		
		setDragScope : function(el, scope) {
			var id = jsPlumb.getId(el);
			var dd = _draggablesById[id];
			if (dd) dd.scope = scope;
		},
		
		setOffset : function(el, o) {
			el = _getElementObject(el);
			el.set("top", o.top);
			el.set("left", o.left);
		}							
	};				
})();
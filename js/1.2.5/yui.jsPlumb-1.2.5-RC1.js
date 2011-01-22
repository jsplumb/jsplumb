
/*
 * yui.jsPlumb 1.2.5-RC1
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
 * setOffset			sets the offset of some element.
 */
(function() {
	
	var Y;
	
	YUI().use('node', 'dd',  function(_Y) {
		Y = _Y;
	});
	
	var ddEvents = [
	     "drag:mouseDown", 
	     "drag:afterMouseDown", 
	     "drag:mouseup", 
	     "drag:align",
	     "drag:removeHandle",
	     "drag:addHandle",
	     "drag:removeInvalid",
	     "drag:addInvalid",
	     "drag:start",
	     "drag:end",
	     "drag:drag",
	     "drag:over",
	     "drag:enter",
	     "drag:exit",
	     "drag:drophit",
	     "drag:dropmiss",
	     "drop:over",
	     "drop:enter",
	     "drop:exit",
	     "drop:hit"	     	               
	];
	
	/**
	 * helper function to curry callbacks for some element. 
	 */
	var _wrapper = function(fn, el) {
		//return function() { fn(el); };
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
	var _attachDDListeners = function(dd, options, el, log) {
		// attach event listeners
	
	    for (var ev in options) {
	    	if (ddEvents.indexOf(ev) != -1) {
	    		var w = _wrapper(options[ev], el);
	    		dd.on(ev, w);
	    		if (log) console.log("attached listener to event " + ev);
	    	}
	    }
	};
	
	var _droppables = {};
	var _droppableOptions = {};
	var _draggablesByScope = {};
	var _draggablesById = {};
	
	var _lastDragObject = null;
	                	
	jsPlumb.CurrentLibrary = {
			
		addClass : function(el, clazz) {
			el.addClass(clazz);
		},	
		
		/**
		 * animates the given element.
		 */
		animate : function(el, properties, options) {
			var o = jsPlumb.CurrentLibrary.extend({node:el, to:properties}, options);
			new Y.Anim(o).run();
		},
		
		appendElement : function(child, parent) {
			jsPlumb.CurrentLibrary.getElementObject(parent).append(child);			
		},
		
		/**
		 * event binding wrapper.  
		 */
		bind : function(el, event, callback) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			el.on(event, callback);
		},
			
		dragEvents : {
			'start':'drag:start', 'stop':'drag:end', 'drag':'drag:drag', 'step':'step',
			'over':'drop:enter', 'out':'drop:exit', 'drop':'drop:hit'
		},								
			
		extend : function(o1, o2) {
			for (var i in o2)
				o1[i] = o2[i];
			return o1;
		},
		
		getAttribute : function(el, attributeId) {
			return el.getAttribute(attributeId);
		},				
		
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
		
		getElementObject : function(el) {
			return typeof el == 'string' ? Y.one('#' + el) : Y.one(el);
		},
		
		getOffset : function(el) {
			var bcr = el._node.getBoundingClientRect();
			return { left:bcr.left, top:bcr.top };
		},
		
		getScrollLeft : function(el) {
			alert("YUI getScrollLeft not implemented yet");
		},
		
		getScrollTop : function(el) {
			alert("YUI getScrollTop not implemented yet");
		},
		
		getSize : function(el) {
			//TODO must be a better way to get this?
			var bcr = jsPlumb.CurrentLibrary.getElementObject(el)._node.getBoundingClientRect();
			return [ bcr.width, bcr.height ];
		},
		
		getUIPosition : function(args) {		
			//TODO must be a better way to get this? args was passed through from the drag function
			// in initDraggable above - args[0] here is the element that was inited.
			var bcr = jsPlumb.CurrentLibrary.getElementObject(args[0].currentTarget.el)._node.getBoundingClientRect();
			return { left:bcr.left, top:bcr.top };
		},
				
		initDraggable : function(el, options) {
			var _opts = _getDDOptions(options);
			var id = jsPlumb.getId(el);
			_opts.node = "#" + id;				
			var dd = new Y.DD.Drag(_opts);
			dd.el = el;
			_attachDDListeners(dd, options, el);
			_draggablesById[id] = dd;
		},
		
		initDroppable : function(el, options) {
			var _opts = _getDDOptions(options);
			_opts.node = "#" + jsPlumb.getId(el);			
			var dd = new Y.DD.Drop(_opts);
			_attachDDListeners(dd, options, el, true);			
		},
		
		isAlreadyDraggable : function(el) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			return el.hasClass("yui3-dd-draggable");
		},
		
		isDragSupported : function(el) { return true; },		
		isDropSupported : function(el) { return true; },										
		removeClass : function(el, clazz) { el.removeClass(clazz); },		
		removeElement : function(el) { jsPlumb.CurrentLibrary.getElementObject(el).remove(); },
		
		setAttribute : function(el, attributeName, attributeValue) {
			console.log("set attribute", el.getAttribute("id"), attributeName, attributeValue);
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
		
		setOffset : function(el, o) {
			el = jsPlumb.CurrentLibrary.getElementObject(el);
			el.set("top", o.top);
			el.set("left", o.left);
		}							
	};		
})();
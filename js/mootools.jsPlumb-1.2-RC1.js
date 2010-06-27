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
	var _draggables = {};
	var DEFAULT_SCOPE = "_jsPlumb_defaultScope";
	
	/**
	 * finds everything from mainList that does not match, according to filterFunc.
	 * used by initDraggable and initDroppable.
	 */
	var _find = function(list, filterFunc) {
		var result = [];
		if (list) {
			for (var i = 0; i < list.length; i++) {
				if (!filterFunc(list[i]))
					result.push(list[i]);
			}
		}
		return result;
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

		
	jsPlumb.CurrentLibrary = {
			
		dragEvents : {
			'start':'onStart', 'stop':'onStop', 'drag':'onDrag', 'step':'onStep'		
		},
		
		defaultDragOptions : { 
			onStart:function()
		    {
		      this.element.setOpacity(.5);
		    },
		    onComplete:function()
		    {
		      // TODO put the element back where it belongs. no. it shouldnt have moved.
		    	//TODO remove the dragging connection.
		      document.body.removeChild(this.element);/*.setOpacity(1);
		      this.element.style.clientLeft = 0;
		      this.element.style.clientTop = 0;*/
		    }

		},
			
		/*
		 * wrapper around the library's 'extend' functionality (which it hopefully has.
		 * otherwise you'll have to do it yourself). perhaps jsPlumb could do this for you
		 * instead.  it's not like its hard.
		 */
		extend : function(o1, o2) {
			return $extend(o1, o2);
		},
	
		/*
		 * gets an "element object" from the given input.  this means an object that is used by the
		 * underlying library on which jsPlumb is running.  'el' may already be one of these objects,
		 * in which case it is returned as-is.  otherwise, 'el' is a String, the library's lookup 
		 * function is used to find the element, using the given String as the element's id.
		 */
		getElementObject : function(el) {
			return $(el);
		},
		
		/*
		  gets the offset for the element object.  this should return a js object like this:
		  
		  { left:xxx, top: xxx}
		 */
		getOffset : function(el) {
			var p = el.getPosition();
			return { left:p.x, top:p.y };
		},
		
		getSize : function(el) {
			var s = el.getSize();
			return [s.x, s.y];
		},
		
		/**
		 * gets the named attribute from the given element object.  
		 */
		getAttribute : function(el, attName) {
			return el.get(attName);
		},
		
		/**
		 * sets the named attribute on the given element object.  
		 */
		setAttribute : function(el, attName, attValue) {
			el.set(attName, attValue);
		},
		
		/**
		 * adds the given class to the element object.
		 */
		addClass : function(el, clazz) {
			el.addClass(clazz);
		},
		
		initDraggable : function(el, options) {
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
			
			//options['droppables'] = _droppables[options['scope']];
			
			//TODO: add droppables.  but what if a new draggable is created after a droppable?
			// probably we will have to keep a list of these Drag objects by scope, and update
			// each time a new init drag/drop call is issued.
			new Drag.Move(el, options);
		},
		
		isDragSupported : function(el, options) {
			return typeof Drag != 'undefined' ;
		},
		
		setDraggable : function(el, draggable) {
		//	el.draggable("option", "disabled", !draggable);
		},
		
		initDroppable : function(el, options) {
			var scope = options['scope'] || DEFAULT_SCOPE;
			_add(_droppables, scope, el);
			var filterFunc = function(entry) {
				return entry.element == el;
			};
			var draggables = _find(_draggables[scope], filterFunc);
			for (var i = 0; i < draggables.length; i++)
				draggables[i].droppables.push(el);
		},
		
		/*
		 * you need Drag.Move imported to make drop work.
		 */
		isDropSupported : function(el, options) {
			if (typeof Drag != undefined)
				return typeof Drag.Move != undefined;
			return false;
		},
		
		animate : function(el, properties, options) {			
			var m = new jsPlumbMorph(el, options);
			m.start(properties);
		},
		
		/*
		 * takes the args passed to an event function and returns you an object that gives the
		 * position of the object being moved, as a js object with the same params as the result of
		 * getOffset, ie: { left: xxx, top: xxx }.
		 */
		getUIPosition : function(eventArgs) {
			var ui = eventArgs[1];
			return { left: ui.target.offsetLeft, top: ui.target.offsetTop };
		},
		
		//TODO!
		getDragObject : function(eventArgs) {
			return null;
		}
	};
})();

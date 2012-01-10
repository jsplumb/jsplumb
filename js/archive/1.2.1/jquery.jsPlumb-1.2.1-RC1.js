// jQuery plugin code; v 1.2.1-RC1

(function($){
	/**
	 * plumbs the results of the selector to some target, using the given options if supplied,
	 * or the defaults otherwise. 
	 */
    $.fn.plumb = function(options) {
        var options = $.extend({}, options);

        return this.each(function()
        {
            var params = $.extend({source:$(this)}, options);
            jsPlumb.connect(params);
        });
  };
  
  /**
   * detaches the results of the selector from the given target or list of targets - 'target'
   * may be a String or a List.
   */
  $.fn.detach = function(target) {	  
	  return this.each(function() {
		  if (target) {
			 var id = $(this).attr("id");
			 if (typeof target == 'string') target = [target];
			 for (var i = 0; i < target.length; i++)
				 jsPlumb.detach(id, target[i]);
		  }
	  });	  
  };
  
  /**
   * detaches the results from the selector from all connections. 
   */
  $.fn.detachAll = function() {
	  return this.each(function() 
	  {
		 var id = $(this).attr("id");		 
		 jsPlumb.detachAll(id);
	  });	  
  };
  
  /**
   * adds an endpoint to the elements resulting from the selector.  options may be null,
   * in which case jsPlumb will use the default options. see documentation. 
   */
  $.fn.addEndpoint = function(options) {
	  var addedEndpoints = [];
	  this.each(function() {
		  addedEndpoints.push(jsPlumb.addEndpoint($(this).attr("id"), options));
	  });
	  return addedEndpoints[0];
  };
  
  /**
   * adds a list of endpoints to the elements resulting from the selector.  options may be null,
   * in which case jsPlumb will use the default options. see documentation. 
   */
  $.fn.addEndpoints = function(endpoints) {
	  var addedEndpoints = [];
	  return this.each(function() {		 
		 var e = jsPlumb.addEndpoints($(this).attr("id"), endpoints);
		 for (var i = 0; i < e.length; i++) addedEndpoints.push(e[i]);
	  });	  
	  return addedEndpoints;
  };
  
  /**
   * remove the endpoint, if it exists, deleting its UI elements etc. 
   */
  $.fn.removeEndpoint = function(endpoint) {
	  this.each(function() {			  
		  jsPlumb.removeEndpoint($(this).attr("id"), endpoint);
	  });
  };
  
})(jQuery);


/*TODO: abstract this out from jQuery too!  but how...because jsPlumb is not loaded yet. 
$(window).bind('resize', function() {
	if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(repaintEverything, 100);
 });*/



/* 
 * the library agnostic functions, such as find offset, get id, get attribute, extend etc.  
 */
(function() {	
	
	jsPlumb.CurrentLibrary = {
					
        /**
         * mapping of drag events for jQuery
         */
		dragEvents : {
			'start':'start', 'stop':'stop', 'drag':'drag', 'step':'step',
			'over':'over', 'out':'out', 'drop':'drop', 'complete':'complete'
		},
		
		appendElement : function(child, parent) {
			jsPlumb.CurrentLibrary.getElementObject(parent).append(child);			
		},
				
		/**
		 * wrapper around the library's 'extend' functionality (which it hopefully has.
		 * otherwise you'll have to do it yourself). perhaps jsPlumb could do this for you
		 * instead.  it's not like its hard.
		 */
		extend : function(o1, o2) {
			return $.extend(o1, o2);
		},
	
		/**
		 * gets an "element object" from the given input.  this means an object that is used by the
		 * underlying library on which jsPlumb is running.  'el' may already be one of these objects,
		 * in which case it is returned as-is.  otherwise, 'el' is a String, the library's lookup 
		 * function is used to find the element, using the given String as the element's id.
		 * 
		 * since 1.2.1 this method has had a cache applied to it.  the cache is a very simple
		 * cache - a hashmap - so can grow and grow. this may not be optimum.  but it does
		 * speed up performance:
		 * 
		 * without cache, 312 connections take 5.22 seconds to create.
		 * with cache, 312 connections take 4.57 seconds to create. that's 13% faster.
		 */
		
		getElementObject : function(el) {			
			return typeof(el)=='string' ? $("#" + el) : $(el);
		},
		
		/**
		  * gets the offset for the element object.  this should return a js object like this:
		  *
		  * { left:xxx, top: xxx }
		 */
		getOffset : function(el) {
			return el.offset();
		},
		
		/**
		 * gets the size for the element object, in an array : [ width, height ].
		 */
		getSize : function(el) {
			return [el.outerWidth(), el.outerHeight()];
		},
		
		/**
		 * gets the named attribute from the given element object.  
		 */
		getAttribute : function(el, attName) {
			return el.attr(attName);
		},
		
		/**
		 * sets the named attribute on the given element object.  
		 */
		setAttribute : function(el, attName, attValue) {
			el.attr(attName, attValue);
		},
		
		/**
		 * adds the given class to the element object.
		 */
		addClass : function(el, clazz) {
			el.addClass(clazz);
		},
		
		/**
		 * initialises the given element to be draggable.
		 */
		initDraggable : function(el, options) {
			// remove helper directive if present.  we know what's best!
			options.helper = null;
			//TODO: if 'revert' is set on the options it causes end points to animate back to
			// where they came from, if the connection is aborted.  do we care?  probably not.
			// the todo is to decide whether we care or not.
			options['scope'] = options['scope'] || jsPlumb.Defaults.Scope;
			el.draggable(options);
		},
		
		/**
		 * returns whether or not drag is supported (by the library, not whether or not it is disabled) for the given element.
		 */
		isDragSupported : function(el, options) {
			return el.draggable;
		},
		
		/**
		 * sets the draggable state for the given element
		 */
		setDraggable : function(el, draggable) {
			el.draggable("option", "disabled", !draggable);
		},
		
		/**
		 * initialises the given element to be droppable.
		 */
		initDroppable : function(el, options) {
			options['scope'] = options['scope'] || jsPlumb.Defaults.Scope;
			el.droppable(options);
		},
		
		/**
		 * returns whether or not drop is supported (by the library, not whether or not it is disabled) for the given element.
		 */
		isDropSupported : function(el, options) {
			return el.droppable;
		},
		
		/**
		 * animates the given element.
		 */
		animate : function(el, properties, options) {
			el.animate(properties, options);
		},
		
		/**
		 * takes the args passed to an event function and returns you an object that gives the
		 * position of the object being moved, as a js object with the same params as the result of
		 * getOffset, ie: { left: xxx, top: xxx }.
		 * 
		 * different libraries have different signatures for their event callbacks.  
		 * see getDragObject as well
		 */
		getUIPosition : function(eventArgs) {
			var ui = eventArgs[1];
			return ui.absolutePosition || ui.offset;
		},
		
		/**
		 * takes the args passed to an event function and returns you an object representing that which is being dragged.
		 */
		getDragObject : function(eventArgs) {
			return eventArgs[1].draggable;
		},
		
		removeElement : function(element, parent) {			
			jsPlumb.CurrentLibrary.getElementObject(element).remove();
		},
		
		getScrollLeft : function(el) {
			return el.scrollLeft();
		},
		
		getScrollTop : function(el) {
			return el.scrollTop();
		}
	};
})();

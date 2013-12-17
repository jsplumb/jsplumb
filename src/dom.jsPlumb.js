
;(function() {	

	"use strict";
	
    /*

    METHODS TO USE/INVESTIGATE:

        getBoundingClientRect
        element.matches(...)
        document.querySelector/querySelectorAll
        element.classList (has add and remove methods)

     */
	 
	 var _getDragManager = function(instance) {
		 var k = instance._katavorio;
		 if (!k) {
			 k = instance._katavorio = new Katavorio( {
				 
			 })
		 }
		 return k;
	 };
	 
	 var getEventManager = function(instance) {
		 var e = instance._evensi;
		 if (!e) {
			 e = instance._evensi = new TouchAdapter({
				 
			 });
		 }
		 return e;
	 };       

	jsPlumb.extend(jsPlumbInstance.prototype, {		
	
		getDOMElement:function(el) { return el; },
		getElementObject:function(el) { return el; },
		doAnimate:function() { throw "not implemented!" },
		getSelector:function(spec) { return document.querySelectorAll(spec); },
		
		
		
		// DRAG/DROP
		destroyDraggable:function(el) {},
		destroyDroppable:function(el) {},
		initDraggable : function(el, options, isPlumbedComponent, _jsPlumb) {
			_getDragManager(this).draggable(el, options);
		},
		initDroppable : function(el, options) { 
			_getDragManager(this).droppable(el, options);
		},
		isAlreadyDraggable : function(el) { return el._katavorioDrag != null; },
		isDragSupported : function(el, options) { return true; },
		isDropSupported : function(el, options) { return true; },
		getDragObject : function(eventArgs) { },
		getDragScope : function(el) { },
		getDropEvent : function(args) { },
		getDropScope : function(el) { },
		getUIPosition : function(eventArgs, zoom) { },
		setDragFilter : function(el, filter) { },
		setElementDraggable : function(el, draggable) { },
		setDragScope : function(el, scope) { },
		dragEvents : {
			'start':'start', 'stop':'stop', 'drag':'drag', 'step':'step',
			'over':'over', 'out':'out', 'drop':'drop', 'complete':'complete'
		},
		trigger : function(el, event, originalEvent) { },
		getOriginalEvent : function(e) { return e; },
		
		
	});
	
	jsPlumb.CurrentLibrary = {					        
																															
				
		// TODO remove library dependency on a removeElement method.
		removeElement : function(element) {			
			_getElementObject(element).remove();
		},						
		
		/**
		 * event binding wrapper.  it just so happens that jQuery uses 'bind' also.  yui3, for example,
		 * uses 'on'.
		 */
		 
		 // TODO rename to 'on'
		on : function(el, event, callback) {
			el = _getElementObject(el);
			el.bind(event, callback);
		},				
		
		// TODO rename to 'off'
		off : function(el, event, callback) {
			el = _getElementObject(el);
			el.unbind(event, callback);
		}
	};
	
	//$(document).ready(jsPlumb.init);
	
}).call(this);


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
		 var k = instance._katavorio,
		 	e = _getEventManager(instance);
			
		 if (!k) {
			 k = instance._katavorio = new Katavorio( {
				bind:e.bind,
				unbind:e.unbind,
				getSize:jsPlumb.getSize,
				getPosition:function(el) {
					var o = jsPlumbAdapter.getOffset(el);
					return [o.left, o.top];
				},
				setPosition:function(el, xy) {
					el.style.left = xy[0] + "px";
					el.style.top = xy[1] + "px";
				},
				addClass:jsPlumbAdapter.addClass,
				removeClass:jsPlumbAdapter.removeClass,
				fireEvent:function() {
					console.log(arguments);
				},
				intersects:Biltong.intersects
			 });
		 }
		 return k;
	 };
	 
	 var _getEventManager = function(instance) {
		 var e = instance._evensi;
		 if (!e) {
			 e = instance._evensi = new TouchAdapter({
				 
			 });
		 }
		 return e;
	 };       

	jsPlumb.extend(jsPlumbInstance.prototype, {		
	
		getDOMElement:function(el) { return typeof el === "string" ? document.getElementById(el) : el; },
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
		/**
		 * event binding wrapper.  it just so happens that jQuery uses 'bind' also.  yui3, for example,
		 * uses 'on'.
		 */
		 
		 // TODO rename to 'on'
		on : function(el, event, callback) {
			_getEventManager(this).bind(event, callback);
		},				
		
		// TODO rename to 'off'
		off : function(el, event, callback) {
			_getEventManager(this).unbind(event, callback);
		}
		
		
	});
	
	jsPlumb.CurrentLibrary = {					        
																															
				
		// TODO remove library dependency on a removeElement method.
		removeElement : function(element) {			
			_getElementObject(element).remove();
		}
		
		
	};
	
	//$(document).ready(jsPlumb.init);
	var ready = function (f) {
        (/complete|loaded|interactive/.test(document.readyState)) ?
            f() :
            setTimeout(ready, 9, f);
    };
	ready(jsPlumb.init);
	
}).call(this);

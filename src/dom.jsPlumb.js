
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
					return [el.offsetLeft, el.offsetTop];
				},
				setPosition:function(el, xy) {
					el.style.left = xy[0] + "px";
					el.style.top = xy[1] + "px";
				},
				addClass:jsPlumbAdapter.addClass,
				removeClass:jsPlumbAdapter.removeClass,
				intersects:Biltong.intersects
			});
			instance.bind("zoom", k.setZoom);
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
		getSelector:function(ctx, spec) { 
			if (arguments.length == 1) {
				return ctx.nodeType != null ? ctx : document.querySelectorAll(ctx);
			}
			else
				return document.querySelectorAll(spec, ctx); 
		},
		
		// DRAG/DROP
		destroyDraggable:function(el) {
			// TODO add destroy methods to Katavorio
			//_getDragManager(this).destroyDraggable(el);
		},
		destroyDroppable:function(el) {
			// TODO add destroy methods to Katavorio
			//_getDragManager(this).destroyDroppable(el);
		},
		initDraggable : function(el, options, isPlumbedComponent, _jsPlumb) {
			_getDragManager(this).draggable(el, options);
		},
		initDroppable : function(el, options) { 
			_getDragManager(this).droppable(el, options);
		},
		isAlreadyDraggable : function(el) { return el._katavorioDrag != null; },
		isDragSupported : function(el, options) { return true; },
		isDropSupported : function(el, options) { return true; },
		getDragObject : function(eventArgs) { return eventArgs[0].drag.el; },
		getDragScope : function(el) {
			console.log("get drag scope!");
				throw "not implemented";
		},
		getDropEvent : function(args) { return args[0].event; },
		getDropScope : function(el) {
			console.log("get drop scope!");
				throw "not implemented";
		},
		getUIPosition : function(eventArgs, zoom) {
			return {
				left:eventArgs[0].pos[0],
				top:eventArgs[0].pos[1]
			};
		},
		setDragFilter : function(el, filter) {
			if (el._katavorioDrag) {
				el._katavorioDrag.setFilter(filter);
			}
		},
		setElementDraggable : function(el, draggable) { 
			throw "not implemented";
		},
		setDragScope : function(el, scope) { 
			throw "not implemented";
		},
		dragEvents : {
			'start':'start', 'stop':'stop', 'drag':'drag', 'step':'step',
			'over':'over', 'out':'out', 'drop':'drop', 'complete':'complete'
		},
		trigger : function(el, event, originalEvent) { },
		getOriginalEvent : function(e) { return e; },
		on : function(el, event, callback) {
			_getEventManager(this).bind(el, event, callback);
		},
		off : function(el, event, callback) {
			_getEventManager(this).unbind(el, event, callback);
		}
	});

	jsPlumb.CurrentLibrary = {
		// TODO use the touch adapter's remove method; it unregisters
		// event listeners properly.
		removeElement : function(element) {
			(element && element.parentNode) && element.parentNode.removeChild(element);
		}
	};

	var ready = function (f) {
        (/complete|loaded|interactive/.test(document.readyState)) ?
            f() :
            setTimeout(ready, 9, f);
    };
	ready(jsPlumb.init);
	
}).call(this);

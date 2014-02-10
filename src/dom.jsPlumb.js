
;(function() {

	"use strict";

	 var _getDragManager = function(instance) {
		var k = instance._katavorio,
			e = _getEventManager(instance);
			
		if (!k) {
			k = new Katavorio( {
				bind:e.on,
				unbind:e.off,
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
				intersects:Biltong.intersects,
				indexOf:jsPlumbUtil.indexOf,
				css:{
					noSelect : instance.dragSelectClass,
					droppable:"jsplumb-droppable"
				}
			});
			instance._katavorio = k;
			instance.bind("zoom", k.setZoom);
		}
		return k;
	};

	 var _getEventManager = function(instance) {
		 var e = instance._mottle;
		 if (!e) {
			 e = instance._mottle = new Mottle();
		 }
		 return e;
	 };

	jsPlumb.extend(jsPlumbInstance.prototype, {
	
		getDOMElement:function(el) { 
			if (el == null) return null;
			// here we pluck the first entry if el was a list of entries.
			// this is not my favourite thing to do, but previous versions of 
			// jsplumb supported jquery selectors, and it is possible a selector 
			// will be passed in here.
			el = typeof el === "string" ? el : el.length != null ? el[0] : el;
			return typeof el === "string" ? document.getElementById(el) : el; 
		},
		getElementObject:function(el) { return el; },
		removeElement : function(element) {
			_getDragManager(this).elementRemoved(element);
			_getEventManager(this).remove(element);
		},
		//
		// this adapter supports a rudimentary animation function. no easing is supported.  only
		// left/top properties are supported. property delta args are expected to be in the form
		//
		// +=x.xxxx
		//
		// or
		//
		// -=x.xxxx
		//
		doAnimate:function(el, properties, options) { 
			options = options || {};
			var o = jsPlumbAdapter.getOffset(el, this),
				lmult = properties.left ? properties.left.match(/-=/) ? -1 : 1 : 0,
				ldist = properties.left ? properties.left.substring(2) : 0,
				tmult = properties.top ? properties.top.match(/-=/) ? -1 : 1 : 0,
				tdist = properties.top ? properties.top.substring(2) : 0,
				d = options.duration || 250,
				step = 15, steps = d / step,
				linc = (step / d) * ldist,
				tinc = (step / d) * tdist,
				idx = 0,
				int = setInterval(function() {
					jsPlumbAdapter.setPosition(el, {
						left:o.left + (lmult * linc * (idx + 1)),
						top:o.top + (tmult * tinc * (idx + 1))
					});
					options.step && options.step();
					idx++;
					if (idx >= steps) {
						window.clearInterval(int);
						options.complete && options.complete()
					}
				}, step);
		},
		getSelector:function(ctx, spec) { 
			var sel = null;
			if (arguments.length == 1) {
				sel = ctx.nodeType != null ? ctx : document.querySelectorAll(ctx);
			}
			else
				sel = document.querySelectorAll(spec, ctx); 
				
			return sel;
		},
		// DRAG/DROP
		destroyDraggable:function(el) {
			_getDragManager(this).destroyDraggable(el);
		},
		destroyDroppable:function(el) {
			_getDragManager(this).destroyDroppable(el);
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
			return el._katavorioDrag && el._katavorioDrag.scopes.join(" ") || "";
		},
		getDropEvent : function(args) { return args[0].event; },
		getDropScope : function(el) {
			return el._katavorioDrop && el._katavorioDrop.scopes.join(" ") || "";
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
			el = jsPlumb.getDOMElement(el);
			if (el._katavorioDrag)
				el._katavorioDrag.setEnabled(draggable);
		},
		setDragScope : function(el, scope) { 
			if (el._katavorioDrag)
				el._katavorioDrag.k.setDragScope(el, scope);
		},
		dragEvents : {
			'start':'start', 'stop':'stop', 'drag':'drag', 'step':'step',
			'over':'over', 'out':'out', 'drop':'drop', 'complete':'complete'
		},
		stopDrag : function(el) {
			if (el._katavorioDrag)
				el._katavorioDrag.abort();
        },
// 		MULTIPLE ELEMENT DRAG
		// these methods are unique to this adapter, because katavorio
		// supports dragging multiple elements.
		addToDragSelection:function(spec) {
			_getDragManager(this).select(spec);
		},
		removeFromDragSelection:function(spec) {
			_getDragManager(this).deselect(spec);
		},
		clearDragSelection:function() {
			_getDragManager(this).deselectAll();
		},
//           EVENTS
		trigger : function(el, event, originalEvent) { 
			_getEventManager(this).trigger(el, event, originalEvent);
		},
		getOriginalEvent : function(e) { return e; },
		on : function(el, event, callback) {
			// TODO: here we would like to map the tap event if we know its
			// an internal bind to a click. we have to know its internal because only
			// then can we be sure that the UP event wont be consumed (tap is a synthesized
			// event from a mousedown followed by a mouseup).
			//event = { "click":"tap", "dblclick":"dbltap"}[event] || event;
			_getEventManager(this).on.apply(this, arguments);
		},
		off : function(el, event, callback) {
			_getEventManager(this).off.apply(this, arguments);
		}
	});

	var ready = function (f) {
        (/complete|loaded|interactive/.test(document.readyState)) ?
            f() :
            setTimeout(ready, 9, f);
    };
	ready(jsPlumb.init);
	
}).call(this);

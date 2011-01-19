(function() {
	
	var Y;
	
	YUI().use('node', function(_Y) {
		Y = _Y;
	});
	
	jsPlumb.CurrentLibrary = {
			
		dragEvents : {
			'start':'drag:start', 'stop':'drag:stop', 'drag':'drag:drag', 'step':'step',
			'over':'over', 'out':'out', 'drop':'drop'
		},
			
		extend : function(o1, o2) {
			for (var i in o2)
				o1[i] = o2[i];
			return o1;
		},
		
		getElementObject : function(el) {
			return typeof el == 'string' ? Y.one('#' + el) : el;
		},
		
		getAttribute : function(el, attributeId) {
			return el.getAttribute(attributeId);
		},
		
		getSize : function(el) {
			//TODO must be a proper way to get this?
			var bcr = el._node.getBoundingClientRect();
			return [ bcr.width, bcr.height ];
		},
		
		getOffset : function(el) {
			var bcr = el._node.getBoundingClientRect();
			return { left:bcr.left, top:bcr.top };
		},
		
		setAttribute : function(el, attributeName, attributeValue) {
			el.setAttribute(attributeName, attributeValue);
		},
		
		isDragSupported : function(el) { return true; },
		isDropSupported : function(el) { return false; },
		
		initDraggable : function(el, options) {
			var drag = function() {
				console.log("drag");
				options['drag:drag'](el);
			};
			new YUI().use('dd-drag', function(Y) {
			    var dd = new Y.DD.Drag({
			        node: '#' + el.getAttribute('id')
			    });
			    dd.on('drag:drag', drag);
			});
		},
		
		addClass : function(el, clazz) {
			el.addClass(clazz);
		},
		
		removeClass : function(el, clazz) {
			el.removeClass(clazz);
		},
		
		getUIPosition : function(args) {		
			//TODO must be a proper way to get this? args was passed through from the drag function
			// in initDraggable above - args[0] here is the element that was inited.
			var bcr = args[0]._node.getBoundingClientRect();
			return { left:bcr.left, top:bcr.top };
		}			
	};		
})();
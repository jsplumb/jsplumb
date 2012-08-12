;(function() {
	
	jsPlumbDemo.showConnectionInfo = function(s) {
		$("list").set('html', s);
		$("list").setStyle("display","block");
	};
	
	jsPlumbDemo.hideConnectionInfo = function() {
		$("list").setStyle("display","none");
	};
	
	jsPlumbDemo.getSelector = function(spec) {
		return $$(spec);
	};

	
	jsPlumbDemo.attachBehaviour = function() {
		$$(".hide").each(function(h) {
			h.addEvent('click', function() {
				jsPlumb.toggle(h.get("rel"));
			});
		});
		
		$$(".drag").each(function(d) {
			d.addEvent('click', function() {
				var s = jsPlumb.toggleDraggable(d.get("rel"));
				d.set('html', s ? 'disable dragging' : 'enable dragging');
				if (!s) $(d.get("rel")).addClass('drag-locked'); 
				else $(d.get("rel")).removeClass('drag-locked');
				$(d.get("rel")).setStyle("cursor", s ? "pointer" : "default");
			});

		});

		$$(".detach").each(function(d) {
			d.addEvent('click', function() {
				jsPlumb.detachAll(d.get("rel"));
			});
		});

		$("clear").addEvent('click', function() { jsPlumb.detachEverything(); showConnections(); });
	};

})();
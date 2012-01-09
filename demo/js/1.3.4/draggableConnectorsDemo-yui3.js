;(function() {
	
	jsPlumbDemo.showConnectionInfo = function(s) {
		Y.one('#list').setContent(s);
		Y.one('#list').setStyle("display","block");
	};
	
	jsPlumbDemo.hideConnectionInfo = function() {
		Y.one('#list').setStyle("display","none");
	};
	
	jsPlumbDemo.attachBehaviour = function() {
		Y.all(".hide").each(function(h) {
			h.on('click', function() {
				jsPlumb.toggle(h.get("rel"));
			});
		});
		
		Y.all(".drag").each(function(d) {
			d.on('click', function() {
				var s = jsPlumb.toggleDraggable(d.get("rel"));
				d.setContent(s ? 'disable dragging' : 'enable dragging');
				var rel = "#" + d.getAttribute("rel");
				if (!s) Y.one(rel).addClass('drag-locked'); 
				else Y.one(rel).removeClass('drag-locked');
				Y.one(rel).setStyle("cursor", s ? "pointer" : "default");
			});
		});

		Y.all(".detach").each(function(d) {
			d.on('click', function() {
				jsPlumb.detachAllConnections(d.getAttribute("rel"));
			});
		});

		Y.one("#clear").on('click', function() { 
			jsPlumb.detachEveryConnection();
			jsPlumbDemo.showConnectionInfo("");
		});
		
		new Y.DD.Drag({node:"#explanation"});
	};

})();
;(function() {
	
	jsPlumbDemo.showConnectionInfo = function(s) {
		$("#list").html(s);
		$("#list").fadeIn({complete:function() { jsPlumb.repaintEverything(); }});
	};
	
	jsPlumbDemo.hideConnectionInfo = function() {
		$("#list").fadeOut({complete:function() { jsPlumb.repaintEverything(); }});
	};
	
	jsPlumbDemo.attachBehaviour = function() {
		$(".hide").click(function() {
			jsPlumb.toggle($(this).attr("rel"));
		});

		$(".drag").click(function() {
			var s = jsPlumb.toggleDraggable($(this).attr("rel"));
			$(this).html(s ? 'disable dragging' : 'enable dragging');
			if (!s) $("#" + $(this).attr("rel")).addClass('drag-locked'); else $("#" + $(this).attr("rel")).removeClass('drag-locked');
			$("#" + $(this).attr("rel")).css("cursor", s ? "pointer" : "default");
		});

		$(".detach").click(function() {
			jsPlumb.detachAllConnections($(this).attr("rel"));
		});

		$("#clear").click(function() { 
			jsPlumb.detachEveryConnection(); jsPlumbDemo.showConnectionInfo("");
		});
	};

})();
;(function() {
	jsPlumbDemo.attachListeners = function() {		
		$("#enableDisableSource").bind("click", function() {
			var state = jsPlumb.toggleSourceEnabled("window1");
			$(this).html(state ? "disable" : "enable");
		});
	}
})();
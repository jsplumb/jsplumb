;(function() {
	jsPlumbDemo.attachListeners = function() {		
		Y.one("#enableDisableSource").on("click", function() {
			var state = jsPlumb.toggleSourceEnabled("window1");
			document.getElementById("enableDisableSource").innerHTML = (state ? "disable" : "enable");
		});
	}
})();
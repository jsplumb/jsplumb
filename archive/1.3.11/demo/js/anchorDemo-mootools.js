;(function() {
	jsPlumbDemo.attachListeners = function() {		
		$$("#enableDisableSource").addEvent("click", function() {
			var state = jsPlumb.toggleSourceEnabled("window1");
			document.getElementById("enableDisableSource").innerHTML = (state ? "disable" : "enable");
		});
	}
})();
/*
 *  This file contains the JS that handles the first init of each YUI3 demonstration, and also switching
 *  between render modes.
 */
YUI().use("node", function(Y) {
	
	jsPlumb.bind("ready", function() {

		// chrome fix.
		document.onselectstart = function () { return false; };
		
		jsPlumb.DemoList.init();
		
	     // render mode
		var resetRenderMode = function(desiredMode) {
			var newMode = jsPlumb.setRenderMode(desiredMode);
			Y.all(".rmode").each(function(e) { e.removeClass("selected"); });
			Y.all(".rmode[mode='" + newMode + "']").each(function(e) { e.addClass("selected"); });
			var disableList = (newMode === jsPlumb.VML) ? ".rmode[mode='canvas'],.rmode[mode='svg']" : ".rmode[mode='vml']"; 
			Y.all(disableList).each(function(e) { 
				e.setAttribute("disabled", true) 
			});				
			
			jsPlumbDemo.init();
		};
	     
		Y.all(".rmode").each(function(r) {
			r.on("click", function() {
				var desiredMode = r.getAttribute("mode");
				if (jsPlumbDemo.reset) jsPlumbDemo.reset();
				jsPlumb.reset();
				resetRenderMode(desiredMode);					
			});
		});
						
		resetRenderMode(jsPlumb.SVG);
       
	});
});
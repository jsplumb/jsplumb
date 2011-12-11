/*
 *  This file contains the JS that handles the first init of each MooTools demonstration, and also switching
 *  between render modes. it also initialises ".window" elements to be draggable.  from jsPlumb 1.3.4 
 *  elements are no longer initialised as draggable automatically.
 */
jsPlumb.bind("ready", function() {

	// chrome fix.
	document.onselectstart = function () { return false; };		
	
	jsPlumb.DemoList.init();
	
     // render mode
	var resetRenderMode = function(desiredMode) {
		var newMode = jsPlumb.setRenderMode(desiredMode);
		$$(".rmode").each(function(e) { e.removeClass("selected"); });
		$$(".rmode[mode='" + newMode + "']").each(function(e) { e.addClass("selected"); });
		var disableList = (newMode === jsPlumb.VML) ? ".rmode[mode='canvas'],.rmode[mode='svg']" : ".rmode[mode='vml']"; 
		$$(disableList).each(function(e) { 
			e.set("disabled", true); 
		});			
		
		jsPlumbDemo.init();
	};
     
	$$(".rmode").each(function(r) {
		r.addEvent("click", function() {
			var desiredMode = $(this).get("mode");
			if (jsPlumbDemo.reset) jsPlumbDemo.reset();
			jsPlumb.reset();
			resetRenderMode(desiredMode);					
		});
	});	

	resetRenderMode(jsPlumb.SVG);
       
});
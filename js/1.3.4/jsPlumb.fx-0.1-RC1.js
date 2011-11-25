/**
	jsPlumb effects plugin.
	
	this is an experiment right now; it's neither finished nor guaranteed to get finished, and it's not supported either.
	
	but all comments and suggestions are welcome.
*/
;(function() {

	var Animation = function(params) {
		this.loop = params.loop == null || params.loop === false ? false : true;
	};


/* ------------------ animate an overlay on a connection ----------------------------------- */

	var animateOverlay = function(params) {
		params = params || {};
		
		Animation.apply(this, arguments);
		
		var start = params.start || 0,
		finish = params.finish || 1,
		step = params.step || 0.1,
		overlay = params.connection.getOverlay(params.overlayId),
		timerHandle = null,
		self = this;
		
		// put the overlay at the start point and repaint
		overlay.setLocation(start);
		params.connection.repaint();
		
	    // set a timer that animates the location of the arrow (note that 'loc' was
   	 	// not exposed for this purpose, really, but it's kind of handy! i'm going
    	// to add getLocation/setLocation in the next version of jsPlumb)
    	
		timerHandle = window.setInterval(function() {
    		overlay.incrementLocation(step);
    		if ((step > 0 && overlay.getLocation() > finish) || (step < 0 && overlay.getLocation() < finish)) {
    			if (self.loop)
	    			overlay.setLocation(start);
	    		else {
	    			overlay.setLocation(finish);
	    			window.clearInterval(timerHandle);
	    		}
    		}
    		params.connection.repaint();
		}, 100);
	};
	
	jsPlumb.getDefaultConnectionType().prototype.animateOverlay = function(params) {
		var o = jsPlumb.extend({connection:this}, params);
		animateOverlay(o);
	};
	
/* ---------------------  cycle through gradients on a connection ----------------------- */

	var gradientCycle = function(params) {
		
	
	};

	jsPlumb.getDefaultConnectionType().prototype.gradientCycle = function(params) {
		var o = jsPlumb.extend({connection:this}, params);
		gradientCycle(o);
	};
	
		

})();
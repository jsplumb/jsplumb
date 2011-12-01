/**
	jsPlumb effects plugin.
	
	this is an experiment right now; it's neither finished nor guaranteed to get finished, and it's not supported either.
	
	but all comments and suggestions are welcome.
	
	This plugin offers (read: will offer. this list is aspirational in parts) the following functionality:
	
	- Connection.animateOverlay  (done)
	
		Animates an overlay along the path inscribed by the connector.
		
	- Connection.stopOverlayAnimation(overlayId)   (done)
	
		Stops an animating Overlay.  You can use this if you set loop:true on an animateOverlay call.
		
	- Connection.cycleGradient
	
		Cycles through 1..N different gradients.  This can be used for a "pulse" type effect.
		
	- Animation parameters in Overlay definitions (done)
	
		A new member will be supported in Overlay definitions, in jsPlumb.Defaults.Overlays, Endpoint's 'connectorOverlays'
		parameter, and Connection's 'overlays' parameter.  Something like this:
		
			jsPlumb.connect({
				source:d1,
				target:d2,
				overlays:[
					["Label", {
						animate: {
							loop:true,
							start:0,
							end:0.5,
							step:0.2
						}
					}]
				]
			});
			
			this animation should work when dragging a new connection too (not done yet)
			
	- "sprout" a Connection when drawing it
	
		This will animate a connection travelling along its path from the source to the target.  It will be called
		something like this:
		
			jsPlumb.connect({
				source:d1,
				target:d2,
				sprout:true,
				sproutDuration:400   (ms)
			});
			
		I'll also add jsPlumb.Defaults.Sprout and jsPlumb.Defaults.SproutDuration.
			
		Not sure yet whether to support this on existing connections.  Is there any point?
	
*/
;(function() {

	var Animation = function(params) {
		this.loop = params.loop == null || params.loop === false ? false : true;
	};


/* ------------------ animate an overlay on a connection ----------------------------------- */

	var animationTimers = {},
	getAnimationKey = function(conn, overlayId) {
		return conn.getId() + "_" + overlayId;
	},
	animateOverlay = function(params) {
		params = params || {};
		
		Animation.apply(this, arguments);
		
		var start = params.start || 0,
		finish = params.finish || 1,
		step = params.step || 0.1,
		tick = params.tick || 100,
		overlay = params.connection.getOverlay(params.overlayId),
		timerHandle = null,
		self = this;
		
		// put the overlay at the start point and repaint
		overlay.setLocation(start);
		params.connection.repaint();
		
	    // set a timer that animates the location of the arrow 
    	
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
		}, tick);
		
		animationTimers[getAnimationKey(params.connection, params.overlayId)] = timerHandle;
	};
	
	var ConnectionWithAnimation = function(params) {
		jsPlumb.getDefaultConnectionType().apply(this, arguments);
		var self = this;
		this.animateOverlay = function(params) {
			var handle = animationTimers[getAnimationKey(self, params.overlayId)];
			if (!handle) {
				var o = jsPlumb.extend({connection:self}, params);
				animateOverlay(o);
			}
		};
		this.stopAnimatingOverlay = function(overlayId) {
			var animKey = getAnimationKey(self, overlayId), handle = animationTimers[animKey];
			if (handle) {
				window.clearInterval(handle);
				delete animationTimers[animKey];
			}
		};
		
		// now see if we need to do anything about overlays
		if (params && params.overlays) {
			for (var i = 0; i < params.overlays.length; i++) {
				if (params.overlays[i].constructor == Array && params.overlays[i][1].animate) {
					var overlay = self.overlays[i];
					self.animateOverlay(jsPlumb.extend(params.overlays[i][1].animate, {overlayId:overlay.id}));				
				}
			}
		}

	};
	jsPlumb.Defaults.ConnectionType = ConnectionWithAnimation;
	
/* ---------------------  cycle through gradients on a connection ----------------------- */

	var cycleGradient = function(params) {
		
	
	};

	jsPlumb.getDefaultConnectionType().prototype.cycleGradient = function(params) {
		var o = jsPlumb.extend({connection:this}, params);
		cycleGradient(o);
	};
	
		

})();
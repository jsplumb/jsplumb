;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {			

			// list of possible anchor locations for the blue source element
			var sourceAnchors = [
				[ 0, 1, 0, 1 ],
				[ 0.25, 1, 0, 1 ],
				[ 0.5, 1, 0, 1 ],
				[ 0.75, 1, 0, 1 ],
				[ 1, 1, 0, 1 ]				
			];
            
            jsPlumb.importDefaults({
            	// set default anchors.  the 'connect' calls below will pick these up, and in fact setting these means
            	// that you also do not need to supply anchor definitions to the makeSource or makeTarget functions. 
	            Anchors : [ sourceAnchors, "TopCenter" ],
            	// drag options
            	DragOptions : { cursor: "pointer", zIndex:2000 },
				// default to blue at source and green at target
				EndpointStyles : [{ fillStyle:"#225588" }, { fillStyle:"#558822" }],
				// blue endpoints 7 px; green endpoints 11.
				Endpoints : [ ["Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ],
				// default to a gradient stroke from blue to green.  for IE provide all green fallback.
				PaintStyle : {
                	gradient:{ stops:[ [ 0, "#225588" ], [ 1, "#558822" ] ] },
                	strokeStyle:"#558822",
                	lineWidth:10
            	}
            });

            // make 'window1' a connection source.
			jsPlumb.makeSource("window1", {
				//anchor:sourceAnchors		// you could supply this if you want, but it was set in the defaults above.							
			});			

            // get the list of ".smallWindow" elements.  getSelector is just a helper method that abstracts out the underlying
            // library; you don't need to use it - you could use $(".smallWindow") in jquery, $$(".smallWindow") in
            // MooTools, or Y.all(".smallWindow") in YUI.
            //
			var smallWindows = jsPlumb.getSelector(".smallWindow");
			for (var i = 0; i < smallWindows.length; i++) {	
				jsPlumb.draggable(smallWindows[i]);
				jsPlumb.makeTarget(smallWindows[i], {
					//anchor:"TopCenter",				// you could supply this if you want, but it was set in the defaults above.					
					dropOptions:{ hoverClass:"hover" }
				});
			}

            // and finally connect a couple of small windows, just so its obvious what's going on when this demo loads.           
            jsPlumb.connect({ source:"window1", target:"window5" });
            jsPlumb.connect({ source:"window1", target:"window2" });

            // hand off to the library specific versions to attach listeners to the demo (anchorDemo-jquery.js etc)
            jsPlumbDemo.attachListeners();
		}
	};	
})();
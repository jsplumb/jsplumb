;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {

			jsPlumb.Defaults.DragOptions = { cursor: "pointer", zIndex:2000 };
			// default to blue at source and green at target
			jsPlumb.Defaults.EndpointStyles = [{ fillStyle:"#225588" }, { fillStyle:"#558822" }];
			// blue endpoints 7 px; green endpoints 11.
			jsPlumb.Defaults.Endpoints = [ ["Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ];
			// default to a gradient stroke from blue to green.  for IE provide all green fallback.
			jsPlumb.Defaults.PaintStyle = {
                gradient:{ stops:[ [ 0, "#225588" ], [ 1, "#558822" ] ] },
                strokeStyle:"#558822",
                lineWidth:10
            };

			// list of possible anchor locations for the blue source element
			var sourceAnchors = [
				[ 0, 1, 0, 1 ],
				[ 0.25, 1, 0, 1 ],
				[ 0.5, 1, 0, 1 ],
				[ 0.75, 1, 0, 1 ],
				[ 1, 1, 0, 1 ]				
			];

            // set the default anchors for jsplumb.
            jsPlumb.Defaults.Anchors = [ sourceAnchors, "TopCenter" ];

            // make 'window1' a connection source.  note the commented out endpoint declaration - we don't need it
            // because we've set defaults.  but i left it in to show what you'd do if just setting up defaults
            // wasn't going to cut it for you.
			jsPlumb.makeSource("window1", {
				/*endpoint:{
					anchor:sourceAnchors
				}*/
			});

            // get the list of ".smallWindow" elements.  getSelector is just a helper method that abstracts out the underlying
            // library; you don't need to use it - you could use $(".smallWindow") in jquery, $$(".smallWindow") in
            // MooTools, or Y.all(".smallWindow") in YUI.
            //
            // notice again here i've commented the endpoint declaration out, because we have achieved the result we need
            // through using the defaults. but you can supply an 'endpoint' object, which has exactly the same form
            // as one you would pass to jsPlumb.makeSource or jsPlumb.addEndpoint.
			var smallWindows = jsPlumb.getSelector(".smallWindow");
			for (var i = 0; i < smallWindows.length; i++) {	
				jsPlumb.draggable(smallWindows[i]);
				jsPlumb.makeTarget(smallWindows[i], {
					/*endpoint:{
						paintStyle: { fillStyle:'#558822' },
						anchor:"TopCenter"
					},*/
					dropOptions:{ hoverClass:"hover" }
				});
			}

            // and finally connect a couple of small windows, just so the demo doesnt look broken when it loads ;)
            jsPlumb.connect({ source:"window1", target:"window5" });
            jsPlumb.connect({ source:"window1", target:"window2" });
		}
	};	
})();
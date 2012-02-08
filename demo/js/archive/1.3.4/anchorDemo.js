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

            // set default anchors.  the 'connect' calls below will pick these up, and in fact setting these means
            // that you do not need to supply anchor definitions to the makeSource or makeTarget functions. but
            // i left those parameters in just to show what you can do.
            jsPlumb.Defaults.Anchors = [ sourceAnchors, "TopCenter" ];

            // make 'window1' a connection source.
			jsPlumb.makeSource("window1", {
				endpoint:{
					anchor:sourceAnchors
				}
			});

            // get the list of ".smallWindow" elements.  getSelector is just a helper method that abstracts out the underlying
            // library; you don't need to use it - you could use $(".smallWindow") in jquery, $$(".smallWindow") in
            // MooTools, or Y.all(".smallWindow") in YUI.
            //
			var smallWindows = jsPlumb.getSelector(".smallWindow");
			for (var i = 0; i < smallWindows.length; i++) {	
				jsPlumb.draggable(smallWindows[i]);
				jsPlumb.makeTarget(smallWindows[i], {
					endpoint:{
						paintStyle: { fillStyle:'#558822' },
						anchor:"TopCenter"
					},
					dropOptions:{ hoverClass:"hover" }
				});
			}

            // and finally connect a couple of small windows, just so the demo doesnt look broken when it loads.
            // note that
            jsPlumb.connect({ source:"window1", target:"window5" });
            jsPlumb.connect({ source:"window1", target:"window2" });
		}
	};	
})();
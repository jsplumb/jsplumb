;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {

			jsPlumb.Defaults.DragOptions = { cursor: 'pointer', zIndex:2000 };
			// default to blue at one end and green at the other
			jsPlumb.Defaults.EndpointStyles = [{ fillStyle:'#225588' }, { fillStyle:'#558822' }];
			// blue endpoints 7 px; green endpoints 11.
			jsPlumb.Defaults.Endpoints = [ ["Dot", {radius:7} ], [ "Dot", {radius:11} ] ];
			// default to a gradient stroke from blue to green.  for IE provide all green fallback.
			jsPlumb.Defaults.PaintStyle = { gradient:{stops:[[0,'#225588'], [1, '#558822']] }, strokeStyle:'#558822', lineWidth:10 };
						
			var sourceAnchors = [
				[ 0, 1, 0, 1 ],
				[ 0.25, 1, 0, 1 ],
				[ 0.5, 1, 0, 1 ],
				[ 0.75, 1, 0, 1 ],
				[ 1, 1, 0, 1 ]				
			];
			
			jsPlumb.makeSource("window1", {
				endpoint:{
					anchor:sourceAnchors
				}
			});
			
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
		}
	};	
})();
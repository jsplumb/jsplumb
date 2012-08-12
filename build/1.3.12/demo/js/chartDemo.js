;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {			

			var color = "gray";

			jsPlumb.importDefaults({
				// notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
				// than the curves on the first demo, which use the default curviness value.			
				Connector : [ "Bezier", { curviness:50 } ],
				DragOptions : { cursor: "pointer", zIndex:2000 },
				PaintStyle : { strokeStyle:color, lineWidth:2 },
				EndpointStyle : { radius:9, fillStyle:color },
				HoverPaintStyle : {strokeStyle:"#ec9f2e" },
				EndpointHoverStyle : {fillStyle:"#ec9f2e" },			
				Anchors :  [ "BottomCenter", "TopCenter" ]
			});
			
				
			// declare some common values:
			var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
				// use three-arg spec to create two different arrows with the common values:
				overlays = [
					[ "Arrow", { location:0.7 }, arrowCommon ],
					[ "Arrow", { location:0.3, direction:-1 }, arrowCommon ]
				];
		
			jsPlumb.connect({source:"window3", target:"window6", overlays:overlays, detachable:true, reattach:true});
			jsPlumb.connect({source:"window1", target:"window2", overlays:overlays});
			jsPlumb.connect({source:"window1", target:"window3", overlays:overlays});
			jsPlumb.connect({source:"window2", target:"window4", overlays:overlays});
			jsPlumb.connect({source:"window2", target:"window5", overlays:overlays});
			
			jsPlumb.draggable(jsPlumb.getSelector(".window"));
		}
	};
	
})();
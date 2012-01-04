;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {			

			var fillColor = "gray";
			// notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
			// than the curves on the first demo, which use the default curviness value.
			jsPlumb.Defaults.Connector = [ "Bezier", { curviness:50 } ];
			jsPlumb.Defaults.DragOptions = { cursor: "pointer", zIndex:2000 };
			jsPlumb.Defaults.PaintStyle = { strokeStyle:"gray", lineWidth:2 };
			jsPlumb.Defaults.EndpointStyle = { radius:9, fillStyle:"gray" };
			jsPlumb.Defaults.HoverPaintStyle = {strokeStyle:"#ec9f2e" };
			jsPlumb.Defaults.EndpointHoverStyle = {fillStyle:"#ec9f2e" };			
			jsPlumb.Defaults.Anchors =  [ "BottomCenter", "TopCenter" ];
				
			// declare some common values:
			var arrowCommon = { foldback:0.7, fillStyle:fillColor, width:14 };
			// use three-arg spec to create two different arrows with the common values:
			var overlays = [
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
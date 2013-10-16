;(function() {
	
	jsPlumb.ready(function() {			

		var color = "gray";

		var instance = jsPlumb.getInstance({
			// notice the 'curviness' argument to this Bezier curve.  the curves on this page are far smoother
			// than the curves on the first demo, which use the default curviness value.			
			Connector : [ "Bezier", { curviness:50 } ],
			DragOptions : { cursor: "pointer", zIndex:2000 },
			PaintStyle : { strokeStyle:color, lineWidth:2 },
			EndpointStyle : { radius:9, fillStyle:color },
			HoverPaintStyle : {strokeStyle:"#ec9f2e" },
			EndpointHoverStyle : {fillStyle:"#ec9f2e" },			
			Anchors :  [ "BottomCenter", "TopCenter" ],
			Container:"chart-demo"
		});
		
			
		// declare some common values:
		var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
			// use three-arg spec to create two different arrows with the common values:
			overlays = [
				[ "Arrow", { location:0.7 }, arrowCommon ],
				[ "Arrow", { location:0.3, direction:-1 }, arrowCommon ]
			];
	
		instance.connect({source:"chartWindow3", target:"chartWindow6", overlays:overlays, detachable:true, reattach:true});
		instance.connect({source:"chartWindow1", target:"chartWindow2", overlays:overlays});
		instance.connect({source:"chartWindow1", target:"chartWindow3", overlays:overlays});
		instance.connect({source:"chartWindow2", target:"chartWindow4", overlays:overlays});
		instance.connect({source:"chartWindow2", target:"chartWindow5", overlays:overlays});
		
		// you do not need to use this method. You can use your library's selector method.
		// the jsPlumb demos use it so that the code can be shared between all three libraries.
		instance.draggable(jsPlumb.getSelector(".chart-demo .window"));		
	});
	
})();
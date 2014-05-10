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
		Container:"chart-demo"
	});
		
	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {		
		// declare some common values:
		var arrowCommon = { foldback:0.7, fillStyle:color, width:14 },
			// use three-arg spec to create two different arrows with the common values:
			overlays = [
				[ "Arrow", { location:0.7 }, arrowCommon ],
				[ "Arrow", { location:0.3, direction:-1 }, arrowCommon ]
			];

		// add endpoints, giving them a UUID.
		// you DO NOT NEED to use this method. You can use your library's selector method.
		// the jsPlumb demos use it so that the code can be shared between all three libraries.
		var windows = jsPlumb.getSelector(".chart-demo .window");
		for (var i = 0; i < windows.length; i++) {
			instance.addEndpoint(windows[i], {
				uuid:windows[i].getAttribute("id") + "-bottom",
				anchor:"Bottom",
				maxConnections:-1
			});
			instance.addEndpoint(windows[i], {
				uuid:windows[i].getAttribute("id") + "-top",
				anchor:"Top",
				maxConnections:-1
			});
		}
	
		instance.connect({uuids:["chartWindow3-bottom", "chartWindow6-top" ], overlays:overlays, detachable:true, reattach:true});
		instance.connect({uuids:["chartWindow1-bottom", "chartWindow2-top" ], overlays:overlays});
		instance.connect({uuids:["chartWindow1-bottom", "chartWindow3-top" ], overlays:overlays});
		instance.connect({uuids:["chartWindow2-bottom", "chartWindow4-top" ], overlays:overlays});
		instance.connect({uuids:["chartWindow2-bottom", "chartWindow5-top" ], overlays:overlays});
				
		instance.draggable(windows);		
	});

	jsPlumb.fire("jsPlumbDemoLoaded", instance);
});
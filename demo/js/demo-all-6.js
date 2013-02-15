jsPlumb.ready(function() {
    var color = "gray";

    var j6 = jsPlumb.getInstance({
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

    j6.connect({source:"w6_3", target:"w6_6", overlays:overlays, detachable:true, reattach:true});
    j6.connect({source:"w6_1", target:"w6_2", overlays:overlays});
    j6.connect({source:"w6_1", target:"w6_3", overlays:overlays});
    j6.connect({source:"w6_2", target:"w6_4", overlays:overlays});
    j6.connect({source:"w6_2", target:"w6_5", overlays:overlays});
    
    j6.draggable(jsPlumb.getSelector("#demo6 .window"), { containment:"parent" });
    
});
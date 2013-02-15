jsPlumb.ready(function() {
    // list of possible anchor locations for the blue source element
    var sourceAnchors = [
        [ 0, 1, 0, 1 ],
        [ 0.25, 1, 0, 1 ],
        [ 0.5, 1, 0, 1 ],
        [ 0.75, 1, 0, 1 ],
        [ 1, 1, 0, 1 ]				
    ];
    
    var j7 = jsPlumb.getInstance({
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

    // make 'window1' a connection source. notice the filter parameter: it tells jsPlumb to ignore drags
    // that started on the 'enable/disable' link on the blue window.
    j7.makeSource("w7_1", {
        //anchor:sourceAnchors,		// you could supply this if you want, but it was set in the defaults above.							
        filter:function(evt, el) {
            var t = evt.target || evt.srcElement;
            return t.tagName !== "A";
        }
    });			

    // get the list of ".smallWindow" elements.            
    var smallWindows = jsPlumb.getSelector("#demo7 .smallWindow");
    // make them draggable
    j7.draggable(smallWindows, { containment:"parent" });
    // configure them as targets.
    j7.makeTarget(smallWindows, {
        //anchor:"TopCenter",				// you could supply this if you want, but it was set in the defaults above.					
        dropOptions:{ hoverClass:"hover" }
    });	

    // and finally connect a couple of small windows, just so its obvious what's going on when this demo loads.           
    j7.connect({ source:"w7_1", target:"w7_5" });
    j7.connect({ source:"w7_1", target:"w7_2" });

    // click listener for the enable/disable link.
    $("#enableDisableSource").bind("click", function(e) {
        var state = j7.toggleSourceEnabled("w7_1");
        $(this).html(state ? "disable" : "enable");
        e.preventDefault();
        e.stopPropagation();
    }); 
    
});
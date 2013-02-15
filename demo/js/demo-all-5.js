jsPlumb.ready(function() {
    var curColourIndex = 1, maxColourIndex = 24, nextColour = function() {
		var R,G,B;
		R = parseInt(128+Math.sin((curColourIndex*3+0)*1.3)*128);
		G = parseInt(128+Math.sin((curColourIndex*3+1)*1.3)*128);
		B = parseInt(128+Math.sin((curColourIndex*3+2)*1.3)*128);
		curColourIndex = curColourIndex + 1;
		if (curColourIndex > maxColourIndex) curColourIndex = 1;
		return "rgb(" + R + "," + G + "," + B + ")";
	 };
   
    // setup some defaults for jsPlumb.	
    var j5 = jsPlumb.getInstance({
        Endpoint : ["Dot", {radius:2}],
        HoverPaintStyle : {strokeStyle:"#42a62c", lineWidth:2 },
        ConnectionOverlays : [
            [ "Arrow", { 
                location:1,
                id:"arrow",
                length:14,
                foldback:0.8
            } ],
            [ "Label", { label:"FOO", id:"label" }]
        ]
    });

    // initialise draggable elements.  
    var windows = j5.getSelector($("#demo5 .w")),
        endpoints = j5.getSelector($("#demo5 .ep"));
    
    j5.draggable(windows, { containment:"parent" });

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
    // happening.
    j5.bind("click", function(c) { 
        j5.detach(c); 
    });
        
    // make each ".ep" div a source and give it some parameters to work with.  here we tell it
    // to use a Continuous anchor and the StateMachine connectors, and also we give it the
    // connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
    // which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i
    // would recommend you do. Note also here that we use the 'parent' option to assign the connections
    // that were dragged from this endpoint to some other element. This allows us to keep the parent element
    // draggable and have only the ".ep" div act as a connection source.
    endpoints.each(function(i,e) {
        var p = $(e).parent();
        j5.makeSource($(e), {
            parent:p,				
            anchor:"Continuous",
            connector:[ "StateMachine", { curviness:20 } ],
            connectorStyle:{ strokeStyle:nextColour(), lineWidth:2 },
            maxConnections:5,
            onMaxConnections:function(info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener changes the paint style to some random new color and also sets the connection's internal
    // id as the label overlay's text.
    j5.bind("connection", function(info) {
        info.connection.setPaintStyle({strokeStyle:nextColour()});
        info.connection.getOverlay("label").setLabel(info.connection.id);
    });

    // initialise all '.w' elements as connection targets.
    j5.makeTarget(windows, {
        dropOptions:{ hoverClass:"dragHover" },
        anchor:"Continuous"				
    });
    
    // and finally, make a couple of connections
    j5.connect({ source:"opened", target:"phone1" });
    j5.connect({ source:"phone1", target:"inperson" });            
    
});
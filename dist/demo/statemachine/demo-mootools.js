;(function() {

	jsPlumb.ready(function() {
				
		// setup some defaults for jsPlumb.	
		var instance = jsPlumb.getInstance({
			Endpoint : ["Dot", {radius:2}],
			HoverPaintStyle : {strokeStyle:"#42a62c", lineWidth:2 },
			ConnectionOverlays : [
				[ "Arrow", { 
					location:1,
					id:"arrow",
					length:14,
					foldback:0.8
				} ],
				[ "Label", { label:"FOO", id:"label", cssClass:"aLabel" }]
			]
		});

		// get window elements
		var windows = $$(".w");

		// initialise windows as draggable elements.
		instance.draggable(windows);

		// bind a click listener to each connection; the connection is deleted. you could of course
		// just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
		// happening.
		instance.bind("click", function(c) { 
			instance.detach(c); 
		});

		// make each ".ep" div a source and give it some parameters to work with.  here we tell it
		// to use a Continuous anchor and the StateMachine connectors, and also we give it the
		// connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
		// which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i
		// would recommend you do.
		$$(".ep").each(function(e) {
			var p = e.parentNode;
			instance.makeSource(e, {
				parent:p,
				anchor:"Continuous",
				connector:[ "StateMachine", { curviness:20 } ],
				connectorStyle:{ strokeStyle:"#5c96bc",lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
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
        instance.bind("connection", function(info) {
			info.connection.setPaintStyle({strokeStyle:"#5c96bc"});
            info.connection.getOverlay("label").setLabel(info.connection.id);
        });

		// initialise all '.w' elements as connection targets.
		instance.makeTarget(windows, {
			dropOptions:{ hoverClass:"dragHover" },
			anchor:"Continuous"				
		});
		
		// and finally, make a couple of connections
		instance.connect({ source:"opened", target:"phone1" });
        instance.connect({ source:"phone1", target:"inperson" });
        instance.connect({ source:"phone1", target:"phone1" });		
	});
})();
;(function() {

	var curColourIndex = 1, maxColourIndex = 24, nextColour = function() {
		var R,G,B;
		R = parseInt(128+Math.sin((curColourIndex*3+0)*1.3)*128);
		G = parseInt(128+Math.sin((curColourIndex*3+1)*1.3)*128);
		B = parseInt(128+Math.sin((curColourIndex*3+2)*1.3)*128);
		curColourIndex = curColourIndex + 1;
		if (curColourIndex > maxColourIndex) curColourIndex = 1;
		return "rgb(" + R + "," + G + "," + B + ")";
	};
		
	window.jsPlumbDemo = { 
	
		init :function() {
							
			jsPlumb.importDefaults({
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

            // initialise draggable elements.  note: jsPlumb does not do this by default from version 1.3.4 onwards.
			jsPlumb.draggable(jsPlumb.getSelector(".w"));

            // bind a click listener to each connection; the connection is deleted.
			jsPlumb.bind("click", function(c) { 
				jsPlumb.detach(c); 
			});
				
			// hand off to the library specific demo code here.  not my ideal, but to write common code
            // is less helpful for everyone, because all developers just like to copy stuff, right?
            // make each ".ep" div a source and give it some parameters to work with.  here we tell it
			// to use a Continuous anchor and the StateMachine connectors, and also we give it the
			// connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
			// which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i
			// would recommend you do.
			jsPlumbDemo.initEndpoints(nextColour);

            jsPlumb.bind("jsPlumbConnection", function(conn) {
                conn.connection.setPaintStyle({strokeStyle:nextColour()});
                conn.connection.getOverlay("label").setLabel(conn.connection.id);
            });

            jsPlumb.makeTarget(jsPlumb.getSelector(".w"), {
				dropOptions:{ hoverClass:"dragHover" },
				anchor:"Continuous"			
				//anchor:"TopCenter"			
			});
		}
	};
})();
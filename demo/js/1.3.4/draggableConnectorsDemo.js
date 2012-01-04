;(function() {
	
	window.jsPlumbDemo = {
		init : function() {
		
			jsPlumb.Defaults.DragOptions = { cursor: 'pointer', zIndex:2000 };
			jsPlumb.Defaults.PaintStyle = { strokeStyle:'#666' };
			jsPlumb.Defaults.EndpointStyle = { width:20, height:16, strokeStyle:'#666' };
			jsPlumb.Defaults.Endpoint = "Rectangle";
			jsPlumb.Defaults.Anchors = ["TopCenter", "TopCenter"];

			var connections = [];
			var updateConnections = function(conn, remove) {
				if (!remove) connections.push(conn);
				else {
					var idx = -1;
					for (var i = 0; i < connections.length; i++) {
						if (connections[i] == conn) {
							idx = i; break;
						}
					}
					if (idx != -1) connections.splice(idx, 1);
				}
				if (connections.length > 0) {
					var s = "<span>current connections</span><br/><br/><table><tr><th>scope</th><th>source</th><th>target</th></tr>";
					for (var j = 0; j < connections.length; j++) {
						s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
					}
					jsPlumbDemo.showConnectionInfo(s);
				} else 
					jsPlumbDemo.hideConnectionInfo();
			};				

			jsPlumb.bind("jsPlumbConnection", function(e) {
				updateConnections(e.connection);
			});
			jsPlumb.bind("jsPlumbConnectionDetached", function(e) {
				updateConnections(e.connection, true);
			});

			var exampleDropOptions = {
				tolerance:'touch',
				hoverClass:'dropHover',
				activeClass:'dragActive'
			};

			/**
				first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint), and it's both a source
				and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection starting from this Endpoint is of type
				'exampleConnection' and can only be dropped on an Endpoint target that declares 'exampleEndpoint' as its drop scope, and also that
				only 'exampleConnection' types can be dropped here.

				the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a lineWidth of
				5 pixels, and a gradient.		

			*/
			var exampleColor = "#00f";
			var exampleEndpoint = {
				endpoint:"Rectangle",
				paintStyle:{ width:25, height:21, fillStyle:exampleColor },
				isSource:true,
				reattach:true,
				scope:"blue rectangle",
				connectorStyle : {
					gradient:{stops:[[0, exampleColor], [0.5, "#09098e"], [1, exampleColor]]},
					lineWidth:5,
					strokeStyle:exampleColor,
					dashstyle:"2 2"
				},
				isTarget:true,
				beforeDrop:function(params) { return confirm("Connect " + params.sourceId + " to " + params.targetId + "?"); },				
				dropOptions : exampleDropOptions
			};

			/**
				the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target, and has scope
				'exampleConnection2'.
			*/
			var color2 = "#316b31";
			var exampleEndpoint2 = {
					endpoint:["Dot", { radius:15 }],
					paintStyle:{ fillStyle:color2 },
					isSource:true,
					scope:"green dot",
					connectorStyle:{ strokeStyle:color2, lineWidth:8 },
					connector: ["Bezier", { curviness:63 } ],
					maxConnections:3,
					isTarget:true,
					dropOptions : exampleDropOptions
			};

			/**
			the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
			'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
			overriden, so it appears in the same place on every element.

			this example also demonstrates the beforeDetach interceptor, which allows you to intercept 
			a connection detach and decide whether or not you wish to allow it to proceed.

			*/
			var example3Color = "rgba(229,219,61,0.5)";
			var exampleEndpoint3 = {
					endpoint:["Dot", {radius:17} ],
					anchor:"BottomLeft",
					paintStyle:{ fillStyle:example3Color, opacity:0.5 },
					isSource:true,
					scope:'yellow dot',
					connectorStyle:{ strokeStyle:example3Color, lineWidth:4 },
					connector : "Straight",
					isTarget:true,
					dropOptions : exampleDropOptions,
					beforeDetach:function(conn) { 
						return confirm("Detach connection?"); 
					}
			};

			// setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
			// of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)
			var e1 = jsPlumb.addEndpoint('window1', { anchor:[0.5, 1, 0, 1] }, exampleEndpoint2);

			//
			// here's an example of how the SelectiveAnchor stuff added to 1.2.3 works with
			// drag and drop connectors.
			//
			var anchors = [[1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0], [0.2, 0, 0, -1] ];
			jsPlumb.addEndpoint("window1", { anchor:anchors }, exampleEndpoint);

			jsPlumb.addEndpoint('window2', { anchor:[0.5, 1, 0, 1] }, exampleEndpoint);
			jsPlumb.addEndpoint('window2', { anchor:"RightMiddle" }, exampleEndpoint2);

			jsPlumb.addEndpoint("window3", { anchor:[0.25, 0, 0, -1] }, exampleEndpoint);
			jsPlumb.addEndpoint("window3", { anchor:[0.75, 0, 0, -1] }, exampleEndpoint2);

			jsPlumb.addEndpoint("window4", { anchor:[1, 0.5, 1, 0] }, exampleEndpoint);
			jsPlumb.addEndpoint("window4", { anchor:[0.25, 0, 0, -1] }, exampleEndpoint2);

			// three ways to do this - an id, a list of ids, or a selector (note the two different types of selectors shown here...anything that is valid jquery will work of course)
			//jsPlumb.draggable("window1");
			//jsPlumb.draggable(["window1", "window2"]);
			//jsPlumb.draggable($("#window1"));
			var divsWithWindowClass = jsPlumb.CurrentLibrary.getSelector(".window");
			jsPlumb.draggable(divsWithWindowClass);

			// add the third example using the '.window' class.				
			jsPlumb.addEndpoint(divsWithWindowClass, exampleEndpoint3);

			// each library uses different syntax for event stuff, so it is handed off
			// to the draggableConnectorsDemo-<library>.js files.
			jsPlumbDemo.attachBehaviour();			
		}
	};
	
})();

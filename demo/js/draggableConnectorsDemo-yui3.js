
;(function() {

	var _initialised = false,
		showConnectionInfo = function(s) {
			Y.one('#list').setContent(s);
			Y.one('#list').setStyle("display","block");
		},	
		hideConnectionInfo = function() {
			Y.one('#list').setStyle("display","none");
		},
		connections = [],
		updateConnections = function(conn, remove) {
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
				var s = "<span><strong>Connections</strong></span><br/><br/><table><tr><th>Scope</th><th>Source</th><th>Target</th></tr>";
				for (var j = 0; j < connections.length; j++) {
					s = s + "<tr><td>" + connections[j].scope + "</td>" + "<td>" + connections[j].sourceId + "</td><td>" + connections[j].targetId + "</td></tr>";
				}
				showConnectionInfo(s);
			} else 
				hideConnectionInfo();
		};
	
	window.jsPlumbDemo = {
		init : function() {
		
			// setup jsPlumb defaults.
			jsPlumb.importDefaults({
				DragOptions : { cursor: 'pointer', zIndex:2000 },
				PaintStyle : { strokeStyle:'#666' },
				EndpointStyle : { width:20, height:16, strokeStyle:'#666' },
				Endpoint : "Rectangle",
				Anchors : ["TopCenter", "TopCenter"]
			});												

			// bind to connection/connectionDetached events, and update the list of connections on screen.
			jsPlumb.bind("connection", function(info, originalEvent) {
				updateConnections(info.connection);
			});
			jsPlumb.bind("connectionDetached", function(info, originalEvent) {
				updateConnections(info.connection, true);
			});

			// configure some drop options for use by all endpoints.
			var exampleDropOptions = {
				tolerance:"touch",
				hoverClass:"dropHover",
				activeClass:"dragActive"
			};

			//
			// first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint),
			// and it's both a source and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection
			// starting from this Endpoint is of type 'exampleConnection' and can only be dropped on an Endpoint target
			// that declares 'exampleEndpoint' as its drop scope, and also that
			// only 'exampleConnection' types can be dropped here.
			//
			// the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a lineWidth of
			// 5 pixels, and a gradient.
			//
			// there is a 'beforeDrop' interceptor on this endpoint which is used to allow the user to decide whether
			// or not to allow a particular connection to be established.
			//
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
				beforeDrop:function(params) { 
					return confirm("Connect " + params.sourceId + " to " + params.targetId + "?"); 
				},				
				dropOptions : exampleDropOptions
			};			

			//
			// the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target,
			// and has scope 'exampleConnection2'.
			//
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

			//
			// the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
			// 'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
			// overriden, so it appears in the same place on every element.
			//
			// this example also demonstrates the beforeDetach interceptor, which allows you to intercept 
			// a connection detach and decide whether or not you wish to allow it to proceed.
			//			
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
				},
				onMaxConnections:function(info) {
					alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
				}
			};

			// setup some empty endpoints.  again note the use of the three-arg method to reuse all the parameters except the location
			// of the anchor (purely because we want to move the anchor around here; you could set it one time and forget about it though.)
			var e1 = jsPlumb.addEndpoint('window1', { anchor:[0.5, 1, 0, 1] }, exampleEndpoint2);

			// setup some DynamicAnchors for use with the blue endpoints			
			// and a function to set as the maxConnections callback.
			var anchors = [[1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0], [0.2, 0, 0, -1] ],
				maxConnectionsCallback = function(info) {
					alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
				};
				
			var e1 = jsPlumb.addEndpoint("window1", { anchor:anchors }, exampleEndpoint);
			// you can bind for a maxConnections callback using a standard bind call, but you can also supply 'onMaxConnections' in an Endpoint definition - see exampleEndpoint3 above.
			e1.bind("maxConnections", maxConnectionsCallback);

			var e2 = jsPlumb.addEndpoint('window2', { anchor:[0.5, 1, 0, 1] }, exampleEndpoint);
			// again we bind manually. it's starting to get tedious.  but now that i've done one of the blue endpoints this way, i have to do them all...
			e2.bind("maxConnections", maxConnectionsCallback);
			jsPlumb.addEndpoint('window2', { anchor:"RightMiddle" }, exampleEndpoint2);

			var e3 = jsPlumb.addEndpoint("window3", { anchor:[0.25, 0, 0, -1] }, exampleEndpoint);
			e3.bind("maxConnections", maxConnectionsCallback);
			jsPlumb.addEndpoint("window3", { anchor:[0.75, 0, 0, -1] }, exampleEndpoint2);

			var e4 = jsPlumb.addEndpoint("window4", { anchor:[1, 0.5, 1, 0] }, exampleEndpoint);
			e4.bind("maxConnections", maxConnectionsCallback);			
			jsPlumb.addEndpoint("window4", { anchor:[0.25, 0, 0, -1] }, exampleEndpoint2);

			// make .window divs draggable
			jsPlumb.draggable(Y.all(".window"));

			// add endpoint of type 3 using a selector. 
			jsPlumb.addEndpoint(Y.all(".window"), exampleEndpoint3);

			//			
			if (!_initialised) {
				Y.all(".hide").each(function(h) {
					h.on('click', function() {
						jsPlumb.toggle(h.get("rel"));
					});
				});
				
				Y.all(".drag").each(function(d) {
					d.on('click', function() {
						var s = jsPlumb.toggleDraggable(d.get("rel"));
						d.setContent(s ? 'disable dragging' : 'enable dragging');
						var rel = "#" + d.getAttribute("rel");
						if (!s) Y.one(rel).addClass('drag-locked'); 
						else Y.one(rel).removeClass('drag-locked');
						Y.one(rel).setStyle("cursor", s ? "pointer" : "default");
					});
				});
	
				Y.all(".detach").each(function(d) {
					d.on('click', function() {
						jsPlumb.detachAllConnections(d.getAttribute("rel"));
					});
				});
	
				Y.one("#clear").on('click', function() { 
					jsPlumb.detachEveryConnection();
					showConnectionInfo("");
				});
	
				_initialised = true;
			}
		}
	};	
})();

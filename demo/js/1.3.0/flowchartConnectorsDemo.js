;(function() {
	
	window.jsPlumbDemo = {
		init : function() {
				
			// default drag options
			jsPlumb.Defaults.DragOptions = { cursor: 'pointer', zIndex:2000 };
			// default to blue at one end and green at the other
			jsPlumb.Defaults.EndpointStyles = [{ fillStyle:'#225588' }, { fillStyle:'#558822' }];
			// blue endpoints 7 px; green endpoints 11.
			jsPlumb.Defaults.Endpoints = [ [ "Dot", {radius:7} ], [ "Dot", { radius:11 } ]];
			// enable mouse events
			jsPlumb.setMouseEventsEnabled(true);						

			// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
			// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
			jsPlumb.Defaults.Overlays = [
				[ "Arrow", { location:0.9 } ], 
				[ "Label", { 
					location:0.1,
					label:function(c) { 
						return c.labelText || ""; 
					},
					labelStyle : { 
						fillStyle:"#deea18", 
						padding:0.4, 
						font:"12px sans-serif", 
						color:"#444" 
					}
				}] 
			];

			// this is the paint style and hover style for the connecting lines
			var connectorPaintStyle = {
					/*gradient:{stops:[[0, "#deea18"], [0.5, '#09098e'], [1, "#deea18"]]},*/
					lineWidth:5,
					strokeStyle:"#deea18",
					joinstyle:"round"
			};
			var connectorHoverStyle = {lineWidth:7,strokeStyle:"#2e2aF8"};

			// the definition of source endpoints (the small blue ones)
			var sourceEndpoint = {
				endpoint:"Dot",
				paintStyle:{fillStyle:"#225588",radius:7},
				isSource:true,
				connector:"Flowchart",
				connectorStyle:connectorPaintStyle,
				hoverPaintStyle:connectorHoverStyle,
				connectorHoverStyle:connectorHoverStyle/*,
				connectorOverlays: overlays				*/
			};

			// the definition of target endpoints (the larger green ones)
			var targetEndpoint = {
				endpoint:"Dot",					
				paintStyle:{fillStyle:"#558822",radius:11},
				hoverPaintStyle:connectorHoverStyle,
				isTarget:true,
				maxConnections:-1,
				dropOptions:{hoverClass:"hover"}
			};	

			// add endpoints to the various elements
			var e11 = jsPlumb.addEndpoint("window1", {anchor:"RightMiddle"}, targetEndpoint);
			var e12 = jsPlumb.addEndpoint("window1", {anchor:"BottomCenter"}, sourceEndpoint);
			var e21 = jsPlumb.addEndpoint("window2", {anchor:"LeftMiddle"}, targetEndpoint);
			var e22 = jsPlumb.addEndpoint("window2", {anchor:"BottomCenter"}, sourceEndpoint);
			var e31 = jsPlumb.addEndpoint("window3", {anchor:"LeftMiddle"}, targetEndpoint);
			var e32 = jsPlumb.addEndpoint("window3", {anchor:"TopCenter"}, targetEndpoint);
			var e33 = jsPlumb.addEndpoint("window3", {anchor:"RightMiddle"}, targetEndpoint);
			var e34 = jsPlumb.addEndpoint("window3", {anchor:"BottomCenter"}, sourceEndpoint);
			var e41 = jsPlumb.addEndpoint("window4", {anchor:"RightMiddle"}, sourceEndpoint);
			var e42 = jsPlumb.addEndpoint("window4", {anchor:"BottomCenter"}, sourceEndpoint);				

			// helper method to set mouse handlers and the labelText member on connections.
			var init = function(conn) {
				conn.connector.labelText = conn.sourceId.substring(6) + " - " + conn.targetId.substring(6);						
				conn.bind("mouseenter", function(conn) { conn.setLabel("click to delete"); });
				conn.bind("mouseexit", function(conn) { conn.setLabel(""); });
				conn.repaint();
			};

			// connect two elements.  calls the init function to register mouse handlers etc.
			var connect = function(s,t) {
				var c = jsPlumb.connect({ source:s,target:t });
				if (c) init(c);
			};

			// connect, by Endpoint.
			connect(e12, e32);
		//	connect(e41, e21 );
			connect(e22, e33);
			connect(e42, e31);
			connect(e34, e11);

			// a little test 
			var anchors = [[1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0], [0.2, 0, 0, -1] ];					
			jsPlumb.makeTarget("window2", {
				endpoint:jsPlumb.extend(targetEndpoint, {anchor:anchors}),
				dropOptions:{ hoverClass:"hover" },
				deleteEndpointsOnDetach:true
			});

			// listen for new connections; initialise them the same way we initialise the connections at startup.
			jsPlumb.bind("jsPlumbConnection", function(connInfo) { 
				init(connInfo.connection);
			});

			jsPlumb.bind("click", function(conn) {
				if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
					jsPlumb.detach(conn); 
			});
		}
	};


})();
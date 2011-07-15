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
					label:function(label) {
						return label.connection.labelText || ""; 
					},
					cssClass:"aLabel"
				}] 
			];

			// this is the paint style for the connecting lines..
			var connectorPaintStyle = {
				lineWidth:5,
				strokeStyle:"#deea18",
				joinstyle:"round"
			},
			// .. and this is the hover style. 
			connectorHoverStyle = {
				lineWidth:7,
				strokeStyle:"#2e2aF8"
			},
			// the definition of source endpoints (the small blue ones)
			sourceEndpoint = {
				endpoint:"Dot",
				paintStyle:{ fillStyle:"#225588",radius:7 },
				isSource:true,
				connector:[ "Flowchart", { stub:40 } ],
				connectorStyle:connectorPaintStyle,
				hoverPaintStyle:connectorHoverStyle,
				connectorHoverStyle:connectorHoverStyle
			},
			// a source endpoint that sits at BottomCenter
			bottomSource = jsPlumb.extend( { anchor:"BottomCenter" }, sourceEndpoint),
			// the definition of target endpoints (will appear when the user drags a connection) 
			targetEndpoint = {
				endpoint:"Dot",					
				paintStyle:{ fillStyle:"#558822",radius:11 },
				hoverPaintStyle:connectorHoverStyle,
				maxConnections:-1,
				dropOptions:{ hoverClass:"hover", activeClass:"active" },
				isTarget:true,
				anchor:[ "LeftMiddle", "RightMiddle" ]
			},
			windows = ["window1", "window2", "window3", "window4"],
			init = function(connection) {
				connection.labelText = connection.sourceId.substring(6) + "-" + connection.targetId.substring(6);
			};

			// 
			// add endpoints to all windows. note here we use a string array; that's just because this demo is framework-agnostic.  you'd
			// probably use a selector in the real world, eg.
			//
			// jsPlumb.addEndpoint($(".window"), [ bottomSource ]);
			//
			var sourceEndpoints = jsPlumb.addEndpoint(windows, bottomSource),
			targetEndpoints = jsPlumb.addEndpoint(windows, targetEndpoint); 
			
			// listen for new connections; initialise them the same way we initialise the connections at startup.
			jsPlumb.bind("jsPlumbConnection", function(connInfo) { 
				init(connInfo.connection);
			});
								
			//
			// make all windows drop targets.  again note the string array vs selector issue.
			//
			/*jsPlumb.makeTarget(windows, {
				endpoint:targetEndpoint,
				dropOptions:{ hoverClass:"hover", activeClass:"active" },
				deleteEndpointsOnDetach:true
			});*/
			
			// make a couple of connections. note that the return value of addEndpoints is an array of Endpoints, 
			jsPlumb.connect({
				source:sourceEndpoints[0],
				target:targetEndpoints[1]
			});
			
			jsPlumb.connect({
				source:sourceEndpoints[3],
				target:targetEndpoints[2]
			});		

			//
			// listen for clicks on connections, and offer to delete connections on click.
			//
			jsPlumb.bind("click", function(conn) {
				if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
					jsPlumb.detach(conn); 
			});
		}
	};
})();
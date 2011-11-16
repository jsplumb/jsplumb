;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
			
			jsPlumb.Defaults.Container = $("body");
			jsPlumb.bind("click", function(conn) { 
				jsPlumb.detach(conn);
				jsPlumb.removeEndpoint(conn.target, conn.endpoints[1]);
			});
			//jsPlumb.setRenderMode(jsPlumb.SVG);
			
			var dropOptions = { hoverClass:"hover", activeClass:"active" },
			endpointStyle = {fillStyle:"#456"};
			
			var beforeDrop = function(connection) {
				var existingConnections = jsPlumb.getConnections({
					source:connection.sourceId,
					target:connection.targetId
				});
				console.log(existingConnections);
				return existingConnections.length == 0;
			};
			
			jsPlumb.makeTarget("window1", {
				endpoint:{
					anchor:["TopLeft", "TopRight", "BottomRight", "BottomLeft"],
					paintStyle:endpointStyle
				},
				dropOptions:dropOptions
			});
			
			jsPlumb.addEndpoint("window1", { 
				isTarget:true, 
				paintStyle:endpointStyle
			});			

			jsPlumb.makeTarget("window3", {
				endpoint:{
					anchor:[ "Fixed", { orientation:[0, 1] } ],
					paintStyle:endpointStyle,
				},
				dropOptions:dropOptions
			});
			
			jsPlumb.makeTarget("window4", {
				endpoint:{
					anchor:[ "Grid", { grid:[2,3], orientation:[0, 1] } ],
					paintStyle:endpointStyle,
				},
				dropOptions:dropOptions
			});
			
			var ep = {
				//endpoint:["Dot", {radius:10}],
				paintStyle:endpointStyle,
				isSource:true,
				maxConnections:-1,
				connectorStyle:{lineWidth:4,strokeStyle:"#456", outlineColor:"#FFFFD1", outlineWidth:2}
			};
			jsPlumb.addEndpoint("window2", {anchor:"TopCenter"}, ep);
			jsPlumb.addEndpoint("window2", {anchor:"TopLeft"}, ep);
			jsPlumb.addEndpoint("window2", {anchor:"TopRight"}, ep);
			
			jsPlumb.bind("beforeDrop", beforeDrop);
			
			jsPlumb.draggable($(".window"));
		}				
	}; 
	
})();
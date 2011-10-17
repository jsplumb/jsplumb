;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
			
			jsPlumb.Defaults.Container = $("body");
			jsPlumb.bind("click", function(conn) { 
				jsPlumb.detach(conn);
				jsPlumb.removeEndpoint(conn.target, conn.endpoints[1]);
			});
			//jsPlumb.setRenderMode(jsPlumb.SVG);
			
			var dropOptions = { hoverClass:"hover", activeClass:"active" };
			
			jsPlumb.Defaults.EndpointStyle = {fillStyle:"#E5E529"};
			jsPlumb.Defaults.PaintStyle = {
				lineWidth:4,
				strokeStyle:"#E5E529", 
				outlineColor:"#FFFFD1", 
				outlineWidth:2
			};
			
			jsPlumb.makeTarget("window1", {
				endpoint:{
					anchor:["TopLeft", "TopRight", "BottomRight", "BottomLeft"]//,
					//paintStyle:endpointStyle
				},
				dropOptions:dropOptions
			});
			

			jsPlumb.makeTarget("window3", {
				endpoint:{
					anchor:[ "Fixed", { orientation:[0, 1] } ]//,
				//	paintStyle:endpointStyle,
				},
				dropOptions:dropOptions
			});
			
			jsPlumb.makeTarget("window4", {
				endpoint:{
					anchor:[ "Grid", { grid:[2,3], orientation:[0, 1] } ]//,
					//paintStyle:endpointStyle,
				},
				dropOptions:dropOptions
			});
			
			var ep = {
				//endpoint:["Dot", {radius:10}],
			//	paintStyle:endpointStyle,
				isSource:true,
				maxConnections:-1//,
				//connectorStyle:{}
			};
			/*jsPlumb.addEndpoint("window2", {anchor:"TopCenter"}, ep);
			jsPlumb.addEndpoint("window2", {anchor:"TopLeft"}, ep);
			jsPlumb.addEndpoint("window2", {anchor:"TopRight"}, ep);*/
			
			jsPlumb.makeSource("window2", {
				endpoint:ep
			});
			
			jsPlumb.makeSource($("#w5Source"), {
				endpoint:{
					endpoint:["Dot", { radius:50 }],
					anchor:"AutoDefault",
					connectorStyle:{
						strokeStyle:"red",
						lineWidth:5
					}
					//paintStyle:{
						//fillStyle:"green"
					//}
				},
				parent:"window5"
			});
		}				
	}; 
	
})();
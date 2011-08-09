;(function() {
	
	window.jsPlumbDemo = {
		init : function() {

			var anchors = [[0.2, 0, 0, -1], [1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0] ],
			exampleColor = '#00f',
			exampleDropOptions = {
					tolerance:'touch',
					hoverClass:'dropHover',
					activeClass:'dragActive'
			}, 
			connectorStyle = {
				gradient:{stops:[[0, exampleColor], [0.5, '#09098e'], [1, exampleColor]]},
				lineWidth:5,
				strokeStyle:exampleColor
			},
			endpoint = ["Rectangle", {width:25, height:21} ],
			endpointStyle = { fillStyle:exampleColor },
			anEndpoint = {
				endpoint:endpoint,
				paintStyle:endpointStyle,
				isSource:true, 
				isTarget:true, 
				anchor:anchors, maxConnections:-1, 
				connectorStyle:connectorStyle
			},
			aConnection = {	
				endpoint:endpoint,				
				endpointStyle:endpointStyle,
				paintStyle : connectorStyle,
				dynamicAnchors:anchors,
				overlays:[ ["Diamond", { fillStyle:'#09098e', width:15, length:15 } ] ]
			};
			
			jsPlumb.DefaultDragOptions = { cursor: 'pointer', zIndex:2000 };

			jsPlumb.connect({ source:"window1", target:"window3" }, aConnection);
			jsPlumb.connect({ source:"window3", target:"window5" }, aConnection);
			jsPlumb.connect({ source:"window5", target:"window6" }, aConnection);
			jsPlumb.connect({ source:"window1", target:"window4" }, aConnection);
			
			// here we first create endpoints and then connect them.  notice how window2 behaves slightly differently to the others when
			// you drag it around, since its endpoint has more than one connection going to it.
			var e1 = jsPlumb.addEndpoint("window2", anEndpoint), 
			e2 = jsPlumb.addEndpoint("window5", anEndpoint),
			e3 = jsPlumb.addEndpoint("window4", anEndpoint);
			
			jsPlumb.connect({source:e1,target:e2});
			jsPlumb.connect({source:e3,target:e1});
		}
	};
	
})();
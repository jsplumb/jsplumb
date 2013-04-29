;(function() {
	
	window.jsPlumbDemo = {
		init : function() {

			var sourceAnchors = [[0.2, 0, 0, -1], [1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0] ],
				targetAnchors = [[0.6, 0, 0, -1], [1, 0.6, 1, 0], [0.4, 1, 0, 1], [0, 0.4, -1, 0] ],
			exampleColor = '#00f',
			exampleDropOptions = {
					tolerance:'touch',
					hoverClass:'dropHover',
					activeClass:'dragActive'
			}, 
			connector = [ "Bezier", { cssClass:"connectorClass", hoverClass:"connectorHoverClass" } ],
			connectorStyle = {
				gradient:{stops:[[0, exampleColor], [0.5, '#09098e'], [1, exampleColor]]},
				lineWidth:5,
				strokeStyle:exampleColor
			},
			hoverStyle = {
				strokeStyle:"#449999"
			},
			overlays = [ ["Diamond", { fillStyle:"#09098e", width:15, length:15 } ] ],
			endpoint = ["Dot", { cssClass:"endpointClass", radius:10, hoverClass:"endpointHoverClass" } ],
			endpointStyle = { fillStyle:exampleColor },
			anEndpoint = {
				endpoint:endpoint,
				paintStyle:endpointStyle,
				hoverPaintStyle:{ fillStyle:"#449999" },
				isSource:true, 
				isTarget:true, 
				maxConnections:-1, 
				connector:connector,
				connectorStyle:connectorStyle,
				connectorHoverStyle:hoverStyle,
				connectorOverlays:overlays
			};
			
			jsPlumb.DefaultDragOptions = { cursor: 'pointer', zIndex:2000 };
		
			var connections = {
				"window1":["window4"],
				"window3":["window1"],
				"window5":["window3"],
				"window6":["window5"],
				"window2":["window6"],
				"window4":["window2"]
				
			},
			endpoints = {},			
			// ask jsPlumb for a selector for the window class
			divsWithWindowClass = jsPlumb.CurrentLibrary.getSelector(".window");
			
			// add endpoints to all of these - one for source, and one for target, configured so they don't sit
			// on top of each other.
			for (var i = 0 ; i < divsWithWindowClass.length; i++) {
				var id = jsPlumb.getId(divsWithWindowClass[i]);
				endpoints[id] = [
					// note the three-arg version of addEndpoint; lets you re-use some common settings easily.
					jsPlumb.addEndpoint(id, anEndpoint, {anchor:sourceAnchors}),
					jsPlumb.addEndpoint(id, anEndpoint, {anchor:targetAnchors})
				];
			}
			// then connect everything using the connections map declared above.
			for (var e in endpoints) {
				if (connections[e]) {
					for (var j = 0; j < connections[e].length; j++) {					
						jsPlumb.connect({
							source:endpoints[e][0],
							target:endpoints[connections[e][j]][1]
						});						
					}
				}	
			}
			
			// bind click listener; delete connections on click			
			jsPlumb.bind("click", function(conn) {
				jsPlumb.detach(conn);
			});
			
			// bind beforeDetach interceptor: will be fired when the click handler above calls detach, and the user
			// will be prompted to confirm deletion.
			jsPlumb.bind("beforeDetach", function(conn) {
				return confirm("Delete connection?");
			});
			
			//
			// configure ".window" to be draggable. 'getSelector' is a jsPlumb convenience method that allows you to
			// write library-agnostic selectors; you could use your library's selector instead, eg.
			//
			// $(".window")  		jquery
			// $$(".window") 		mootools
			// Y.all(".window")		yui3
			//
			jsPlumb.draggable(jsPlumb.getSelector(".window"));
		}
	};
	
})();

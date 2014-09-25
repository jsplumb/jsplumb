jsPlumb.ready(function() {

	var instance = jsPlumb.getInstance({
		// default drag options
		DragOptions : { cursor: 'pointer', zIndex:2000 },
		// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
		// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
		ConnectionOverlays : [
			[ "Arrow", { location:1 } ],
			[ "Label", { 
				location:0.1,
				id:"label",
				cssClass:"aLabel"
			}]
		],
		Container:"flowchart-demo"
	});

	// this is the paint style for the connecting lines..
	var connectorPaintStyle = {
		lineWidth:4,
		strokeStyle:"#61B7CF",
		joinstyle:"round",
		outlineColor:"white",
		outlineWidth:2
	},
	// .. and this is the hover style. 
	connectorHoverStyle = {
		lineWidth:4,
		strokeStyle:"#216477",
		outlineWidth:2,
		outlineColor:"white"
	},
	endpointHoverStyle = {
		fillStyle:"#216477",
		strokeStyle:"#216477"
	},
	// the definition of source endpoints (the small blue ones)
	sourceEndpoint = {
		endpoint:"Dot",
		paintStyle:{ 
			strokeStyle:"#7AB02C",
			fillStyle:"transparent",
			radius:7,
			lineWidth:3 
		},				
		isSource:true,
		connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],								                
		connectorStyle:connectorPaintStyle,
		hoverPaintStyle:endpointHoverStyle,
		connectorHoverStyle:connectorHoverStyle,
        dragOptions:{},
        overlays:[
        	[ "Label", { 
            	location:[0.5, 1.5], 
            	label:"Drag",
            	cssClass:"endpointSourceLabel" 
            } ]
        ]
	},		
	// the definition of target endpoints (will appear when the user drags a connection) 
	targetEndpoint = {
		endpoint:"Dot",					
		paintStyle:{ fillStyle:"#7AB02C",radius:11 },
		hoverPaintStyle:endpointHoverStyle,
		maxConnections:-1,
		dropOptions:{ hoverClass:"hover", activeClass:"active" },
		isTarget:true,			
        overlays:[
        	[ "Label", { location:[0.5, -0.5], label:"Drop", cssClass:"endpointTargetLabel" } ]
        ]
	},			
	init = function(connection) {			
		connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
		connection.bind("editCompleted", function(o) {
			if (typeof console != "undefined")
				console.log("connection edited. path is now ", o.path);
		});
	};			

	var _addEndpoints = function(toId, sourceAnchors, targetAnchors) {
			for (var i = 0; i < sourceAnchors.length; i++) {
				var sourceUUID = toId + sourceAnchors[i];
				instance.addEndpoint("flowchart" + toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID });						
			}
			for (var j = 0; j < targetAnchors.length; j++) {
				var targetUUID = toId + targetAnchors[j];
				instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID });						
			}
		};

	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {

		_addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);			
		_addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
		_addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
		_addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);
					
		// listen for new connections; initialise them the same way we initialise the connections at startup.
		instance.bind("connection", function(connInfo, originalEvent) { 
			init(connInfo.connection);
		});			
					
		// make all the window divs draggable						
		instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });		
		// THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector 
		// method, or document.querySelectorAll:
		//jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });
        
		// connect a few up
		instance.connect({uuids:["Window2BottomCenter", "Window3TopCenter"], editable:true});
		instance.connect({uuids:["Window2LeftMiddle", "Window4LeftMiddle"], editable:true});
		instance.connect({uuids:["Window4TopCenter", "Window4RightMiddle"], editable:true});
		instance.connect({uuids:["Window3RightMiddle", "Window2RightMiddle"], editable:true});
		instance.connect({uuids:["Window4BottomCenter", "Window1TopCenter"], editable:true});
		instance.connect({uuids:["Window3BottomCenter", "Window1BottomCenter"], editable:true});
		//
        
		//
		// listen for clicks on connections, and offer to delete connections on click.
		//
		instance.bind("click", function(conn, originalEvent) {
			if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
				jsPlumb.detach(conn); 
		});	
		
		instance.bind("connectionDrag", function(connection) {
			console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
		});		
		
		instance.bind("connectionDragStop", function(connection) {
			console.log("connection " + connection.id + " was dragged");
		});

		instance.bind("connectionMoved", function(params) {
			console.log("connection " + params.connection.id + " was moved");
		});
	});

	jsPlumb.fire("jsPlumbDemoLoaded", instance);
	
});
;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
						
			jsPlumb.bind("click", function(conn) { 
				jsPlumb.detach(conn);
				jsPlumb.removeEndpoint(conn.target, conn.endpoints[1]);
			});
			
			jsPlumb.draggable($("#window1,#window3,#window4,#window5"));
			
			var dropOptions = { hoverClass:"hover", activeClass:"active" };
			
			jsPlumb.importDefaults({
				Container : $("body"),
				EndpointStyle : {fillStyle:"#E5E529"},
				PaintStyle : {
					lineWidth:4,
					strokeStyle:"#E5E529", 
					outlineColor:"#FFFFD1", 
					outlineWidth:2
				},
				HoverPaintStyle : {
					lineWidth:4,
					strokeStyle:"pink"
				},
				EndpointHoverStyle : {
					fillStyle:"pink"
				}
			});
			
			//
			// makes window1 into a connection target, specifying that any connections made to window1 will be given
			// a dynamic anchor that has positions at each of the div's corners.
			//
			jsPlumb.makeTarget("window1", {
				anchor:["TopLeft", "TopRight", "BottomRight", "BottomLeft"],
				dropOptions:dropOptions
			});
			
			//
			// makes window3 into a connection target, specifying that connections made to window3 will have an anchor that
			// is located at the position on window3 at which the mouseup event occurred.
			//
			//
			jsPlumb.makeTarget("window3", {
				anchor:[ "Assign", { 
					orientation:[0, 1],
					position:"Fixed"
				} ],
				dropOptions:dropOptions
			});
			
			//
			// makes window4 into a connection target, specifying that connections made to window3 will have an anchor that
			// is located on a 2x3 grid.
			//
			//
			jsPlumb.makeTarget("window4", {
				anchor:[ "Assign", { 
					position:"Grid",
					grid:[2,3], 
					orientation:[0, 1] 
				} ],
				dropOptions:dropOptions
			});			
			
			//
			// the most basic makeSource call you can make.  will use the defaults for everything - endpoint, anchor, 
			// endpoint/connector styles, etc. in this demo we have setup defaults for endpoint style and for connector
			// style.
			//
			// note that this div - window2 - is not draggable.  this is because it is acting as a connection source, and
			// dragging on this div means create a new connection.  see the example below for an alternative to this.
			//
			jsPlumb.makeSource("window2", {anchor:"TopCenter"});
			
			//
			// a more advanced makeSource call: in this one we specify a div we want to use for a connection source,
			// and we provide the 'parent' parameter, which tells jsPlumb that once a connection has been established it
			// should move the source endpoint to that element.  			 			
			jsPlumb.makeSource($("#w5Source"), {
				//anchor:"Continuous",
				anchor:"AutoDefault",
				parent:"window5"
			});
		}				
	}; 
	
})();
;(function() {
	
	window.jsPlumbDemo = {
			
		init : function() {
			
			jsPlumb.Defaults.Container = $("body");
			jsPlumb.bind("click", function(conn) { 
				jsPlumb.detach(conn);
				jsPlumb.removeEndpoint(conn.target, conn.endpoints[1]);
			});
			
			jsPlumb.draggable($("#window1,#window3,#window4,#window5"));
			
			var dropOptions = { hoverClass:"hover", activeClass:"active" };
			
			jsPlumb.Defaults.EndpointStyle = {fillStyle:"#E5E529"};
			jsPlumb.Defaults.PaintStyle = {
				lineWidth:4,
				strokeStyle:"#E5E529", 
				outlineColor:"#FFFFD1", 
				outlineWidth:2
			};
			jsPlumb.Defaults.HoverPaintStyle = {
				lineWidth:4,
				strokeStyle:"pink"
			};

			jsPlumb.Defaults.EndpointHoverStyle = {
				fillStyle:"pink"
			};
			
			//
			// makes window1 into a connection target, specifying that any connections made to window1 will be given
			// a dynamic anchor that has positions at each of the div's corners.
			//
			jsPlumb.makeTarget("window1", {
				endpoint:{
					anchor:["TopLeft", "TopRight", "BottomRight", "BottomLeft"]//,
					//paintStyle:endpointStyle
				},
				dropOptions:dropOptions
			});
			
			//
			// makes window3 into a connection target, specifying that connections made to window3 will have an anchor that
			// is located at the position on window3 at which the mouseup event occurred.
			//
			// note that the mechanism used to realise this anchor definition, and the "Grid" one below, will be refactored
			// before jsplumb 1.3.4 is released.  the code needs a cleanup, and i'm going to add support for pluggable
			// anchor definitions, allowing people to implement their own.
			//
			jsPlumb.makeTarget("window3", {
				endpoint:{
					anchor:[ "Assign", { 
						orientation:[0, 1],
						position:"Fixed"
					} ]
				},
				dropOptions:dropOptions
			});
			
			//
			// makes window4 into a connection target, specifying that connections made to window3 will have an anchor that
			// is located on a 2x3 grid.
			//
			// note that the mechanism used to realise this anchor definition, and the "Fixed" one above, will be refactored
			// before jsplumb 1.3.4 is released.  the code needs a cleanup, and i'm going to add support for pluggable
			// anchor definitions, allowing people to implement their own.
			//
			jsPlumb.makeTarget("window4", {
				endpoint:{
					anchor:[ "Assign", { 
						position:"Grid",
						grid:[2,3], 
						orientation:[0, 1] 
					} ]
				},
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
			jsPlumb.makeSource("window2");
			
			//
			// a more advanced makeSource call: in this one we specify a div we want to use for a connection source,
			// and we provide the 'parent' parameter, which tells jsPlumb that once a connection has been established it
			// should move the source endpoint to that element.  
			//
			// also in this call we have specified our own endpoint definition, anchor definition, and connector style.
			// the anchor definition is used by jsPlumb after a successful connection has been made.  in conjunction with the
			// 'parent' parameter on this call, it means that connections will be attached to "window5" using the default
			// 'dynamic' anchor, ie. the one that has TopCenter, RightMiddle, BottomCenter and LeftMiddle positions.
			// for the anchor here you can provide any valid anchor definition.  
			//
			jsPlumb.makeSource($("#w5Source"), {
				endpoint:{
					anchor:"Continuous"
				},
				parent:"window5"
			});
		}				
	}; 
	
})();
/*
	this is the JS for the main jsPlumb demo.  it is shared between the YUI, jQuery and MooTools
	demo pages.
*/
;(function() {

	window.jsPlumbDemo = {
			
		init : function() {
			
			jsPlumb.importDefaults({
				DragOptions : { cursor: "pointer", zIndex:2000 },
				HoverClass:"connector-hover"
			});
	
			var connectorStrokeColor = "rgba(50, 50, 200, 1)",
				connectorHighlightStrokeColor = "rgba(180, 180, 200, 1)",
				hoverPaintStyle = { strokeStyle:"#7ec3d9" };			// hover paint style is merged on normal style, so you 
			                                                        // don't necessarily need to specify a lineWidth
			
			// 
			// connect window1 to window2 with a 13 px wide olive colored Bezier, from the BottomCenter of 
			// window1 to 3/4 of the way along the top edge of window2.  give the connection a 1px black outline,
			// and allow the endpoint styles to derive their color and outline from the connection.
			// label it "Connection One" with a label at 0.7 of the length of the connection, and put an arrow that has a 50px
			// wide tail at a point 0.2 of the length of the connection.  we use 'cssClass' and 'endpointClass' to assign
			// our own css classes, and the Label overlay has three css classes specified for it too.  we also give this
			// connection a 'hoverPaintStyle', which defines the appearance when the mouse is hovering over it. 
			//
			var connection1 = jsPlumb.connect({
				source:"window1", 
			   	target:"window2", 			   	
				connector:["Bezier", { curviness:70 }],
			   	cssClass:"c1",
			   	endpoint:"Blank",
			   	endpointClass:"c1Endpoint",													   
			   	anchors:["BottomCenter", [ 0.75, 0, 0, -1 ]], 
			   	paintStyle:{ 
					lineWidth:6,
					strokeStyle:"#a7b04b",
					outlineWidth:1,
					outlineColor:"#666"
				},
				endpointStyle:{ fillStyle:"#a7b04b" },
			   	hoverPaintStyle:hoverPaintStyle,			   
			   	overlays : [
					["Label", {													   					
						cssClass:"l1 component label",
						label : "Connection One", 
						location:0.7,
						id:"label",
						events:{
							"click":function(label, evt) {
								alert("clicked on label for connection " + label.component.id);
							}
						}
					}],
					["Arrow", {
						cssClass:"l1arrow",
						location:0.5, width:140,length:100,
						events:{
							"click":function(arrow, evt) {
								alert("clicked on arrow for connection " + arrow.component.id);
							}
						}
					}]
				]
			});            
				
				        
	        var w23Stroke = "rgb(189,11,11)"; 
	        var connection3 = jsPlumb.connect({
				source:"window2", 
				target:"window3", 
				paintStyle:{ 
					lineWidth:8,
					strokeStyle:w23Stroke,
					outlineColor:"#666",
					outlineWidth:1 
				},
				detachable:false,
				hoverPaintStyle:hoverPaintStyle, 
				anchors:[ [ 0.3 , 1, 0, 1 ], "TopCenter" ], 
				endpoint:"Rectangle", 
				endpointStyles:[
					{ gradient : { stops:[[0, w23Stroke], [1, "#558822"]] }},
					{ gradient : {stops:[[0, w23Stroke], [1, "#882255"]] }}
				]	
			});					
				
			var connection2 = jsPlumb.connect({
				source:'window3', target:'window4', 
				paintStyle:{ 
				   lineWidth:10,
				   strokeStyle:connectorStrokeColor,
				   outlineColor:"#666",
				   outlineWidth:1
				},
				hoverPaintStyle:hoverPaintStyle, 
				anchor:"AutoDefault",
				detachable:false,
				endpointStyle:{ 
					   gradient : { 
						   stops:[[0, connectorStrokeColor], [1, connectorHighlightStrokeColor]],
						   offset:17.5, 
						   innerRadius:15 
					   }, 
					   radius:35
				},				        					        			
				label : function(connection) { 
					var d = new Date();
					var fmt = function(n, m) { m = m || 10;  return (n < m ? new Array(("" + m).length - (""+n).length + 1).join("0") : "") + n; }; 
					return (fmt(d.getHours()) + ":" + fmt(d.getMinutes()) + ":" + fmt(d.getSeconds())+ "." + fmt(d.getMilliseconds(), 100)); 
				},
				labelStyle:{
					cssClass:"component label"
				}
		   });
	

            //
            //this connects window5 with window6 using a Flowchart connector that is painted green,
            //with large Dot endpoints that are placed in the center of each element.  there is a
            //label at the default location of 0.5, and the connection is marked as not being
            //detachable.
			//
	        var conn4Color = "rgba(46,164,26,0.8)";
	        var connection4 = jsPlumb.connect({  
				source:'window5', 
				target:'window6', 
				connector:"Flowchart",
				anchors:["Center", "Center"],  
				paintStyle:{ 
					lineWidth:9, 
					strokeStyle:conn4Color, 
					outlineColor:"#666",
					outlineWidth:10,
					joinstyle:"round"
				},
				hoverPaintStyle:hoverPaintStyle,
				detachable:false,
				endpointsOnTop:false, 
				endpointStyle:{ radius:65, fillStyle:conn4Color },
				labelStyle : { cssClass:"component label" },
				label : "big\nendpoints"
		    });
	
	        var connection5 = jsPlumb.connect({
				source:"window4", 
				target:"window5", 
				anchors:["BottomRight", "TopLeft"], 
				paintStyle:{ 
					lineWidth:7,
					strokeStyle:"rgb(131,8,135)",
//										outlineColor:"#666",
//						 				outlineWidth:1,
					dashstyle:"4 2",
					joinstyle:"miter"
				},
				tooltip:"This connection will appear dashed when using SVG or VML.  This effect is achieved through CSS - see the accompanying stylesheet for this demo",
				hoverPaintStyle:hoverPaintStyle, 
				endpoint:["Image", {url:"../img/endpointTest1.png"}], 
				connector:"Straight", 
				endpointsOnTop:true,
				overlays:[ ["Label", {
								cssClass:"component label",		    			        				 
								label : "4 - 5",
								location:0.3
							}],
							"Arrow"
							
				]
			});
									
			var stateMachineConnector = {				
				connector:"StateMachine",
				paintStyle:{lineWidth:3,strokeStyle:"#056"},
				hoverPaintStyle:{strokeStyle:"#dbe300"},
				endpoint:"Blank",
				anchor:"Continuous",
				overlays:[ ["PlainArrow", {location:1, width:120, length:12} ]]
			};
			
			jsPlumb.connect({
				source:"window3",
				target:"window7"
			}, stateMachineConnector);
			
			jsPlumb.connect({
				source:"window7",
				target:"window3"
			}, stateMachineConnector);

			// jsplumb event handlers
	
			// double click on any connection 
			jsPlumb.bind("dblclick", function(connection, originalEvent) { alert("double click on connection from " + connection.sourceId + " to " + connection.targetId); });
			// single click on any endpoint
			jsPlumb.bind("endpointClick", function(endpoint, originalEvent) { alert("click on endpoint on element " + endpoint.elementId); });
			// context menu (right click) on any component.
			jsPlumb.bind("contextmenu", function(component, originalEvent) {
                alert("context menu on component " + component.id);
                originalEvent.preventDefault();
                return false;
            });
			
			// make all .window divs draggable. note that here i am just using a convenience method - getSelector -
			// that enables me to reuse this code across all three libraries. In your own usage of jsPlumb you can use
			// your library's selector method - "$" for jQuery, "$$" for MooTools, "Y.all" for YUI3.
			jsPlumb.draggable(jsPlumb.getSelector(".window"), { containment:".demo"});            
		}
	};	
})();

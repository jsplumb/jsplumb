
	// chrome fix.
	document.onselectstart = function () { return false; };		

console.log("initing demo");
		jsPlumb.DefaultDragOptions = { cursor: 'pointer', zIndex:2000 };
					
		// 
		// plumb window1 to window2 with a 15 px wide yellow Bezier, from the BottomCenter of window1 to 3/4 of the way along the top edge
		// of window2. endpoints are a slightly lighter shade of yellow. the connection is labelled "connection 1" with a 16px sans serif
		// black font. 				
		//
		var connection1 = jsPlumb.connect({source:'window1', 
										   target:'window2', 
										   anchors:["BottomCenter", jsPlumb.makeAnchor(0.75,0,0,-1)], 
										   paintStyle:{lineWidth:15,strokeStyle:'rgb(243,230,18)'},
										   backgroundPaintStyle:{lineWidth:17,strokeStyle:'rgba(100,100,100,50)'},  
										   endpointStyle:{fillStyle:'rgb(243,229,0)'},
										   overlays : [ new jsPlumb.Overlays.Label({
										   					labelStyle : {
																font : "15px sans-serif",				        
										        				color : "black"												            
										   					},
										   					label : "Connection One", 
										   					location:0.7})
					   					   ]});

        // plumb window2 to window3 with an 8px red Bezier and default rectangular endpoints.  see also how the first anchor is 
        // specified here - this is how you create anchors in locations jsPlumb does not offer shortcuts for.
        // the endpoints in this example have linear gradients applied.
        //
        var w23Stroke = 'rgb(189,11,11)'; 
        var connection3 = jsPlumb.connect({source:'window2', target:'window3', 
	        				 paintStyle:{lineWidth:8,strokeStyle:w23Stroke},
	        				 backgroundPaintStyle:{lineWidth:10,strokeStyle:'black'}, 
	        				 anchors:[jsPlumb.makeAnchor(0.3,1,0,1), "TopCenter"], 
	        				 endpoint:new jsPlumb.Endpoints.Rectangle(), 
	        				 endpointStyles:[{ gradient : {stops:[[0, w23Stroke], [1, '#558822']] }},
	    			        				 { gradient : {stops:[[0, w23Stroke], [1, '#882255']] }}]
	    			        });
		
										  												  
		//
		// plumb the right hand side of window3 to the left hand side of window4 with a 10px wide blue-ish half transparent Bezier. 
		// put endpoints underneath the element they attach to. the endpoints have a radial gradient. both possible ways of specifying 
		// gradient positioning are shown here.  this connection is labelled using the default label appearance (black text on transparent
		// background) by a function that returns the current time.  the argument to the label function is the Connection the label
		// belongs to. 
		//
		var w34Stroke = 'rgba(50, 50, 200, 1)';
		var w34HlStroke = 'rgba(180, 180, 200, 1)';
		var connection2 = jsPlumb.connect({source:'window3', target:'window4', 
			paintStyle:{lineWidth:10, strokeStyle:w34Stroke}, 
			anchors:["AutoDefault", "AutoDefault"], 
			endpointStyle:{ gradient : {stops:[[0, w34Stroke], [1, w34HlStroke]], offset:17.5, innerRadius:15 }, radius:35},
			backgroundPaintStyle:{lineWidth:12,strokeStyle:'rgba(100,100,100,50)'},
			endpointsOnTop:true,
			label : function(connection) { 
				var d = new Date();
				var fmt = function(n) { return (n < 10 ? "0" : "") + n; }; 
				return (fmt(d.getHours()) + ":" + fmt(d.getMinutes()) + ":" + fmt(d.getSeconds())+ "." + fmt(d.getMilliseconds())); 
			}
		});
		 
        //
        // plumb window5 to window6 from center to center, 5px wide line that is green and half transparent. 
        // the endpoints are 125px in radius and spill out from underneath their elements. the connection is labelled
        // "big endpoints" with black text on a green background using the default font style and size.
        //
        var connection4 = jsPlumb.connect({
			source:'window5', 
			target:'window6', 
			anchors:["Center", "Center"],  
			paintStyle:{lineWidth:5,strokeStyle:'rgba(46,164,26,0.8)'},
			endpointsOnTop:false, 
			endpointStyle:{radius:125, fillStyle:'rgba(46,164,26,0.8)'},
			labelStyle : { fillStyle:"rgba(46,164,26, 0.8)", color:"black",borderWidth:10 },
			label : "big\nendpoints\nthese are big endpoints.\nthe biggest endpoints that are on this page." 
		});
        
        //
        // plumb window4 to window5 from bottom right to top left, with a 7px straight line purple connector, and an 
        // image as the endpoint, placed on top of the element it is connected to.  the connection is labelled "4-5" with text
        // of the same color as the connector, on a white background with a purple border.  note the 'padding' value of 0.4: that 
        // instructs jsPlumb to make the background (2 * 0.4) times larger than the text in the horizontal and vertical directions.
        //
        var connection5 = jsPlumb.connect({
			source:'window4', 
			target:'window5', 
			anchors:["BottomRight",new jsPlumb.Anchors.TopLeft()], //comparison of old way and new way.  i recommend using the string.
			paintStyle:{lineWidth:7,strokeStyle:'rgb(131,8,135)'}, 
			endpoint:new jsPlumb.Endpoints.Image({url:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png"}), 
			connector:new jsPlumb.Connectors.Straight(), endpointsOnTop:true,
			overlays:[new jsPlumb.Overlays.Label({
							labelStyle : { 
								fillStyle:"white", 
								padding:0.4, 
								font:"16px sans-serif", 
								color:"rgb(131,8,135)", 
								borderStyle:"rgb(131,8,135)", 
								borderWidth:2 
							},			    			        				 
	    			        label : "4 - 5",
	    			        location:0.3 })
		]});
        		        	
	

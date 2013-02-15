jsPlumb.ready(function() {
    var connectorStrokeColor =  "#7ec3d9",
        connectorHighlightStrokeColor = "rgba(180, 180, 200, 1)",
        hoverColor ="orange" ;						 
    
    var j1 = jsPlumb.getInstance({
        DragOptions : { cursor: "pointer", zIndex:2000 },
        HoverClass:"connector-hover",
        Container:$("#demo1 .demo"),
        PaintStyle:{ 
           lineWidth:5,
           strokeStyle:connectorStrokeColor
           
        },
        HoverPaintStyle:{ strokeStyle:hoverColor },
        EndpointStyle:{ fillStyle:connectorStrokeColor },
        EndpointHoverStyle:{ fillStyle:hoverColor },
        ConnectionsDetachable:false
    });
    
    j1.connect({
        source:"w1_1", 
        target:"w1_2", 			   	
        connector:["Bezier", { curviness:70 }],
        cssClass:"c1",
        endpoint:"Blank",
        endpointClass:"c1Endpoint",													   
        anchors:["BottomCenter", [ 0.75, 0, 0, -1 ]],                  
        endpointStyle:{ fillStyle:"#a7b04b" }, 
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
                location:0.5, width:40,
                events:{
                    "click":function(arrow, evt) {
                        alert("clicked on arrow for connection " + arrow.component.id);
                    }
                }
            }]
        ]
    });
    
    var w23Stroke = "rgb(189,11,11)"; 
    j1.connect({
        source:"w1_2", 
        target:"w1_3",                 
        anchors:[ [ 0.3 , 1, 0, 1 ], "TopCenter" ], 
        endpoint:"Rectangle"
    });
    
    j1.connect({
        source:"w1_3", target:"w1_4", 
        anchor:"AutoDefault",                    
        endpointStyle:{ 
               gradient : { 
                   stops:[[0, connectorStrokeColor], [1, connectorHighlightStrokeColor]],
                   offset:17.5, 
                   innerRadius:15 
               }, 
               radius:20
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
    // this connects window5 with window6 using a Flowchart connector that is painted green,
    // with large Dot endpoints that are placed in the center of each element.  there is a
    // label at the default location of 0.5, and the connection is marked as not being
    // detachable.
    //                
    j1.connect({  
        source:"w1_5", 
        target:"w1_6", 
        connector:"Flowchart",
        anchors:["Center", "Center"],                                          
        endpointsOnTop:false, 
        endpointStyle:{ fillStyle:connectorStrokeColor, radius:45 },
        labelStyle : { cssClass:"component label" },
        label : "big\nendpoints"
    });
    
    j1.connect({
        source:"w1_4", 
        target:"w1_5", 
        anchors:["BottomRight", "TopLeft"], 
        paintStyle:{ 
            lineWidth:7,
            strokeStyle:connectorStrokeColor,    
            dashstyle:"4 2",
            joinstyle:"miter"
        },
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
        paintStyle:{lineWidth:3,strokeStyle:connectorStrokeColor},
        hoverPaintStyle:{strokeStyle:hoverColor},
        endpoint:"Blank",
        anchor:"Continuous",
        overlays:[ ["PlainArrow", {location:1, width:20, length:12} ]]
    };
    
    j1.connect({
        source:"w1_6",
        target:"w1_7"
    }, stateMachineConnector);
    
    j1.connect({
        source:"w1_7",
        target:"w1_6"
    }, stateMachineConnector);
                    
    var draggables = j1.getSelector("#demo1 .window");
    j1.draggable(draggables, { containment:"parent"});
});
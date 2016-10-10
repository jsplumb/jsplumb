### jsPlumb.connect Examples
This section provides various examples of how to use the programmatic API to establish Connections. 

The basic syntax of a call is that you execute 'connect', providing a source and a target, and optionally a paintStyle and preferences for where you want the plumbing to be anchored on each element, as well as the type of connector to use. 

- Connect window1 to window2 with the default settings:
<pre>
jsPlumb.connect({source:"window1", target:"window2"});
</pre>

- Connect window1 to window2 with a 15 pixel wide yellow Connector, and a slightly brighter endpoint (remember the default Endpoint is a Dot):
<pre>
jsPlumb.connect({
      source:'window1',
      target:'window2',
      paintStyle:{strokeWidth:15,stroke:'rgb(243,230,18)'},
      endpointStyle:{fill:'rgb(243,229,0)'}
});
</pre>
- Connect window1 to window2 with a 15 pixel wide yellow Connector, and a slightly brighter endpoint:
<pre>
jsPlumb.connect({
	  source:'window1',
	  target:'window2',
	  paintStyle:{strokeWidth:15,stroke:'rgb(243,230,18)'},
	  endpointStyle:{fill:'rgb(243,229,0)'}
});
</pre>
- Connect window3 to 'window4' with a 10 pixel wide, semi opaque blue Connector, anchored to the left middle of window3, and the right middle of window4, with a Rectangle endpoint of width 10 and height 8:
<pre>
jsPlumb.connect({
	  source:'window3',
	  target:'window4',
	  paintStyle:{ strokeWidth:10, stroke:'rgba(0, 0, 200, 0.5)' },
	  anchors:["Right", "Left"],
	  endpoint:[ "Rectangle", { width:10, height:8 } ]
});
</pre>
- Connect window2 to window3 with a default Connector from the top center of window2 to the bottom center of window3, and rectangular endpoints:
<pre>
jsPlumb.connect({
      source:'window2',
      target:'window3',
      paintStyle:{strokeWidth:8, stroke:'rgb(189,11,11    )'},
      anchors:["Bottom", "Top"],
      endpoint:"Rectangle"
});
</pre>

- Connect window1 to window2 with a 15 px wide yellow Bezier. Endpoints are a slightly lighter shade of yellow.
<pre>
jsPlumb.connect({
	  source:'window1',
	  target:'window2',
	  anchors:["Bottom", [0.75,0,0,-1]],
	  paintStyle:{strokeWidth:15,stroke:'rgb(243,230,18)'},
	  endpointStyle:{fill:'rgb(243,229,0)'}
});
</pre>

- Connect window3 to window4 with a 10px wide blue-ish half transparent Bezier. Put Endpoints underneath the element they attach to.  The Endpoints have a radial gradient. Both ways of specifying gradient positioning are shown here.

        var w34Stroke = 'rgba(50, 50, 200, 1)';
        var w34HlStroke = 'rgba(180, 180, 200, 1)';
        jsPlumb.connect( {
      	  source:'window3',
      	  target:'window4',
          paintStyle:{strokeWidth:10, stroke:w34Stroke},
          anchors:["RightMiddle", "LeftMiddle"],
          endpointStyle:{ gradient : {stops:[[ 0, w34Stroke ], [ 1, w34HlStroke ]], offset:17.5, innerRadius:15 }, radius:35},
          //endpointStyle:{ gradient : {stops:[[0, w34Stroke], [1, w34HlStroke]], offset:'78%', innerRadius:'73%'}, radius:35 }
        });


- Connect window2 to window3 with an 8px red Bezier and default rectangular endpoints.  See also how the first Anchor is specified here - this is how you create Anchors in locations jsPlumb does not offer shortcuts for.  The Endpoints in this example have linear gradients applied.

        var w23Stroke = 'rgb(189,11,11)';
        jsPlumb.connect({
	        source:'window2',
	        target:'window3',
            paintStyle:{strokeWidth:8,stroke:w23Stroke},
      	    anchors:[[0.3,1,0,1], "Top"],
      	    endpoint:"Rectangle",
      	    endpointStyles:[{ gradient : {stops:[[0, w23Stroke], [1, '#558822']] }},
       				{ gradient : {stops:[[0, w23Stroke], [1, '#882255']] }}]
        });


- Connect window5 to window6 from center to center, 5px wide line that is green and half transparent. the Endpoints are 125px in radius and spill out from underneath their elements.
<pre>
jsPlumb.connect({
	  source:'window5',
	  target:'window6',
	  anchors:["Center", "Center"],
	  paintStyle:{strokeWidth:5,stroke:'rgba(0,255,0,0.5)'},
      endpointStyle:{radius:125}
});
</pre>

- Connect window4 to window5 from bottom right to top left, with a 7px straight line purple Connector, and an image as the endpoint,
placed on top of the element it is connected to.
<pre>
jsPlumb.connect({
	source:"window4",
	target:"window5",
	anchors:[ "BottomRight","TopLeft" ],
	paintStyle:{ strokeWidth:7, stroke:"rgb(131,8,135)" },
	endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
	connector:"Straight"
});
</pre>
- Connect window5 to window6 between their center points with a semi-opaque connector, and 125px endpoints:
<pre>
jsPlumb.connect({
      source:"window5",
	  target:"window6",
	  anchors:[ "Center", "Center" ],
	  paintStyle:{ strokeWidth:5, stroke:"rgba(0,255,0,0.5)" },
	  endpointStyle:{ radius:125 }
});
</pre>

- Connect window7 to window8 with a 10 pixel wide blue Connector, anchored on the top left of window7 and the bottom right of window8:
<pre>
jsPlumb.connect({
      source:"window7",
	  target:"window8",
	  paintStyle:{ strokeWidth:10, stroke:"blue" },
	  anchors:[ "TopLeft", "BottomRight" ]
});
</pre>

- Connect the bottom right corner of window4 to the top left corner of window5, with rectangular Endpoints of size 40x40 and a hover color of light blue:
<pre>
jsPlumb.connect({
	  source:"window4",
	  target:"window5",
	  anchors:["BottomRight","TopLeft"],
	  paintStyle:{strokeWidth:7,stroke:'rgb(131,8,135)'},
	  hoverPaintStyle:{ stroke:"rgb(0, 0, 135)" },
	  endpointStyle:{ width:40, height:40 },
	  endpoint:"Rectangle",
	  connector:"Straight"
});
</pre>
- Connect window1 to window2 with the default paint settings but provide some drag options (which are passed through to the underlying library's draggable call):
<pre>
jsPlumb.connect({
      source:'window1', 
      target:'window2',
      dragOptions:{
        cursor:'crosshair'
      }
});
</pre>

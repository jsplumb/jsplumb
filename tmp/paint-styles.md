### Paint Styles

Defining the appearance of Connectors and Endpoints is achieved through a `paintStyle` (or a quite similar name) object passed as a parameter to one of `jsPlumb.connect`, `jsPlumb.addEndpoint`, `jsPlumb.makeSource` or `jsPlumb.makeTarget`.
Depending on the method you are calling, the parameter names vary.

##### Connector Paint Styles
These are specified in a `paintStyle` parameter on a call to `jsPlumb.connect`:

    jsPlumb.connect({
        source:"el1",
        target:"el2",
        paintStyle:{ stroke:"blue", strokeWidth:10 }
    });

or in the `connectorPaintStyle` parameter on a call to `jsPlumb.addEndpoint` or `jsPlumb.makeSource`:

    jsPlumb.addEndpoint("el1", {
        paintStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        connectorPaintStyle:{ stroke:"blue", strokeWidth:10 }
    });

    jsPlumb.makeSource("el1", {
        paintStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        connectorPaintStyle:{ stroke:"blue", strokeWidth:10 }
    });

Notice the `paintStyle` parameter in those examples: it is the paint style for the Endpoint, which we'll discuss below.

##### Endpoint Paint Styles
These are specified in a `paintStyle` parameter on a call to `addEndpoint`. This is the example from just above:

    jsPlumb.addEndpoint("el1", {
        paintStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        connectorPaintStyle:{ stroke:"blue", strokeWidth:10 }
    });

...or as the `endpointStyle` parameter to a `connect` call:		

    jsPlumb.connect({
        source:"el1",
        target:"el2",
        endpointStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        paintStyle:{ stroke:"blue", strokeWidth:10 }
    });

... or as an entry in the `endpointStyles` array passed to a `jsPlumb.connect` call:

    jsPlumb.connect({
        source:"el1",
        target:"el2",
        endpointStyles:[ 
            { fill:"blue", outlineStroke:"black", outlineWidth:1 },
            { fill:"green" }
        ],
        paintStyle:{ stroke:"blue", strokeWidth:10 }
    });

or as the `paintStyle` parameter passed to a `makeTarget` or `makeSource` call:

    jsPlumb.makeTarget("el1", {
        ...
        paintStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        ...
    });

    jsPlumb.makeSource("el1", {
        paintStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 }
        parent:"someOtherDivIJustPutThisHereToRemindYouYouCanDoThis"
    });

In the first example we  made `el1` into a drop target, and defined a paint style for the Endpoint jsPlumb will create when a Connection is established.  In the second we made el1 a connection source and assigned the same values for the Endpoint jsPlumb will create when a Connection is dragged from that element.
	
##### Overlay Paint Styles
The preferred way to set paint styles for Overlays is to use the `cssClass` parameter in the constructor arguments of an Overlay definition.
	
#### Paint Style Parameters
This is the full list of parameters you can set in a paintStyle object, but note that `fill` is ignored by Connectors, and `stroke` is ignored by Endpoints.  Also, if you create a Connection using jsPlumb.connect and do not specify any Endpoint styles, the Endpoints will derive their fill from the Connector's stroke.

`fill`, `stroke` and `outlineStroke` can be specified using any valid CSS3 syntax.

- **fill** - color for an Endpoint, eg. rgba(100,100,100,50), "blue", "#456", "#993355", rgb(34, 56, 78).
- **stroke** - color for a Connector. see fill examples.
- **strokeWidth** - width of a Connector's line. An integer.
- **outlineWidth** - width of the outline for an Endpoint or Connector. An integer.
- **outlineStroke** - color of the outline for an Endpoint or Connector. see fill examples.
- **dashstyle** - This comes from VML, and allows you to create dashed or dotted lines.  It has a better syntax than 
the equivalent attribute in SVG (`stroke-dasharray`, discussed below), so even though VML is no longer a supported renderer
we've decided to keep this attribute. The `dashstyle` attribute is specified as an array of strokes and spaces, where 
each value is some multiple of **the width of the Connector**, and that's where it's better than SVG, which just uses 
absolute pixel values.

[The VML spec](http://www.w3.org/TR/NOTE-VML) is a good place to find valid values for dashstyle. Note that jsPlumb does 
not support the string values for this attribute ("solid", "dashdot", etc).

jsPlumb uses the `strokeWidth` parameter in conjunction with the values in a `dashstyle` attribute to create an appropriate 
value for `stroke-dasharray`.

- **stroke-dasharray** - This is the SVG equivalent of `dashstyle`.  [The SVG spec](http://www.w3.org/TR/SVG/painting.html) 
discusses valid values for this parameter. 
- **stroke-dashoffset** - This is used in SVG to specify how far into the dash pattern to start painting.  For more information, see [the SVG spec](http://www.w3.org/TR/SVG/painting.html)
- **stroke-linejoin** - This attribute specifies how you want individual segments of connectors to be joined.

#### Hover Paint Styles
	 		
Connectors and Endpoints both support the concept of a "hover" paint style - a paint style to use when the mouse is hovering over the component.  These are specified in the exact same format as paint styles discussed above, but hover paint styles also inherit any values from the main paint style.  This is because you will typically want to just change the color, or perhaps outline color, of a Connector or Endpoint when the mouse is hovering, but leave everything else the same.  So having hover paint styles inherit their values precludes you from having to define things in more than one place.

The naming convention adopted for hover paint styles is pretty much to insert the word 'hover' into the corresponding main paint style parameters.  Here are a couple of examples:

    jsPlumb.connect({
        source:"el1",
        target:"el2",
        paintStyle:{ stroke:"blue", strokeWidth:10 },
        hoverPaintStyle:{ stroke:"red" },
        endpointStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        endpointHoverStyle:{ fill:"red" }
    });

In this example we specified a hover style for both the Connector, and each of its Endpoints.  Here's the same thing, but using the plural version, to specify a different hover style for each Endpoint:	

    jsPlumb.connect({
        source:"el1",
        target:"el2",
        paintStyle:{ stroke:"blue", strokeWidth:10 },
        hoverPaintStyle:{ stroke:"red" },
        endpointStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        endpointHoverStyles:[ 
            { fill:"red" }, 
            { fill:"yellow" } 
        ]
    });

Calls to `addEndpoint`, `makeSource` and `makeTarget` can also specify various hover paint styles:

    jsPlumb.addEndpoint("el1", {
        paintStyle:{ fill:"blue", outlineStroke:"black", outlineWidth:1 },
        hoverPaintStyle:{ fill:"red" },
        connectorPaintStyle:{ stroke:"blue", strokeWidth:10 },
        connectorHoverPaintStyle:{ stroke:"red", outlineStroke:"yellow", outlineWidth:1 }
    });

    jsPlumb.makeSource("el2", {
        paintStyle:{ 
            fill:"transparent", 
            outlineStroke:"yellow", 
            outlineWidth:1 
        },
        hoverPaintStyle:{ fill:"red" },
        connectorPaintStyle:{ 
            stroke:"green", 
            strokeWidth:3 
        },
        connectorHoverPaintStyle:{ 
            stroke:"#678", 
            outlineStroke:"yellow", 
            outlineWidth:1 
        }
    });

    jsPlumb.makeTarget("el3", {
        paintStyle:{ 
            fill:"transparent", 
            outlineStroke:"yellow", 
            outlineWidth:1 
        },
        hoverPaintStyle:{ fill:"red" }
    });
	 		
In these examples we specified a hover paint style for both the Endpoint we are adding, and any Connections to/from the Endpoint.

**Note** that `makeTarget` does not support Connector parameters. It is for creating targets only; Connector parameters will be set by the source Endpoint in any Connections that are made to the element that you turned into a target by using this method.
	 			 		
#### Gradients
jsPlumb uses its own syntax to define gradients; this was initially to abstract out the differences between the syntax 
required by canvas and that required by SVG, but in fact since jsPlumb does not support the canvas or VML renderers any more, 
it is possible that a future release will switch to using the SVG syntax for gradients.

There are two types of gradients available - a `linear` gradient, which consists of colored lines all going in one 
direction, and a `radial` gradient, which consists of colored circles emanating from one circle to another. Because of 
their basic shape, jsPlumb supports only linear gradients for Connectors.  But for Endpoints, jsPlumb supports both 
linear and radial gradients.

##### Connector gradients
To specify a linear gradient to use in a Connector, you must add a `gradient` object to your Connector's `paintStyle`, 
for instance:

```javascript
jsPlumb.connect({
  source : "window2",
  target : "window3",
  paintStyle:{
    gradient:{
      stops:[[0,"green"], [1,"red"]]
    },
    strokeWidth:15
  }
});
```

Here we have connected window2 to window3 with a 15 pixel wide connector that has a gradient from green to red.

Notice the `gradient` object and the `stops` list inside it - the gradient consists of an arbitrary number of these "color stops".  Each color stop is comprised of two values - [position, color].  Position must be a decimal value between 0 and 1 (inclusive), and indicates where the color stop is situated as a fraction of the length of the entire gradient.  Valid values for the colors in the stops list are the same as those that are valid for stroke when describing a color.

As mentioned, the stops list can hold an arbitrary number of entries.  Here's an example of a gradient that goes from red to blue to green, and back again through blue to red:

```javascript
jsPlumb.connect({
  source : 'window2',
  target : 'window3',
  paintStyle : {
    gradient:{
      stops:[[0,'red'], [0.33,'blue'], [0.66,'green'], [0.33,'blue'], [1,'red']]
    },
    strokeWidth : 15
  }
});
```

##### Endpoint gradients
Endpoint gradients are specified using the same syntax as Connector gradients.  You put the gradient specifier either 
in the `endpoint` member, or if you are specifying different Endpoints for each end of the Connector, in one or both of 
the values in the `endpoints` array.  Also, this information applies to the case that you are creating standalone 
Endpoints that you will be configuring for drag and drop creation of new Connections. 

This is an example of an Endpoint gradient that is different for each Endpoint in the Connector.  This comes from the 
main demo; it is the Connector joining Window 2 to Window 3:

```javascript
var w23Stroke = 'rgb(189,11,11)';
jsPlumb.connect({
  source : 'window2',
  target : 'window3',
  paintStyle:{
    strokeWidth:8,
    stroke:w23Stroke
  },
  anchors:[ [0.3,1,0,1], "TopCenter" ],
  endpoint:"Rectangle",
  endpointStyles:[{ 
    gradient : {
      stops:[[0, w23Stroke], [1, '#558822']] 
    } 
  },{ 
    gradient : {
      stops:[[0, w23Stroke], [1, '#882255']] 
    } 
  }]
});
```

The first entry in the gradient will be the one that is on the Connector end of the Endpoint.  You can of course have as many color stops as
you want in this gradient, just like with Connector gradients.

##### Applying the gradient in Endpoints
Only the Dot and Rectangle endpoints honour the presence of a gradient. The Image endpoint of course ignores a gradient 
as it does no painting of its own.

The type of gradient you will see depends on the Endpoint type:

- **Dot** - renders a radial endpoint, with color stop 0 on the outside, progressing inwards as we move through color stops.

Radial gradients actually require more data than linear gradients - in a linear gradient we just move from one point to 
another, whereas in a radial gradient we move from one <em>circle</em> to another.  By default, jsPlumb will render a 
radial gradient using a source circle of the same radius as the Endpoint itself, and a target circle of 1/3 of the 
radius of the Endpoint (both circles share the same center as the Endpoint itself). This circle will be offset by 
radius/2 in each direction.

You can supply your own values for these inside the gradient descriptor:

```javascript
var w34Stroke = 'rgba(50, 50, 200, 1)';
var w34HlStroke = 'rgba(180, 180, 200, 1)';
jsPlumb.connect({
  source : 'window3',
  target : 'window4',
  paintStyle:{
    strokeWidth:10,
    stroke:w34Stroke
  },
  anchors:[ "RightMiddle", "LeftMiddle" ],
  endpointStyle:{
    gradient : {
      stops:[ [0, w34Stroke], [1, w34HlStroke] ],
      offset:37.5,
      innerRadius:40
    },
    radius:55
  }
});
```

Here we have instructed jsPlumb to make the gradient's inner radius 10px instead of the default 25/3 = 8 ish pixels, 
and the offset in each direction will be 5px, instead of the default radius / 2 = 12.5 pixels.

It is also possible to specify the offset and inner radius as percentages - enter the values as strings with a '%' 
symbol on the end:

```javascript
var w34Stroke = 'rgba(50, 50, 200, 1)';
var w34HlStroke = 'rgba(180, 180, 200, 1)';
jsPlumb.connect({
  source : 'window3', 
  target : 'window4',
  paintStyle:{
    strokeWidth:10,
    stroke:w34Stroke
  },
  anchors:[ "RightMiddle", "LeftMiddle" ],
  endpointStyle:{
    gradient : {
      stops:[ [0, w34Stroke], [1, w34HlStroke] ],
      offset:'68%',
      innerRadius:'73%'
    },
    radius:25
  }
});
```

This will give roughly the same output as the example above (the percentages are not entirely exact).

- **Rectangle** - renders a linear endpoint, with color stop 0 closest to the end of the Connector


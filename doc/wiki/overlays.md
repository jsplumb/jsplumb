## Overlays
Overlays are UI elements that are painted onto Connections, such as Labels or Arrows.

  1. [Introduction](#intro)
  -  [Overlay Location](#location)
  - [Adding Overlays](#adding)
  - [Overlay Types](#types)
    - [Arrow](#type-arrow)
    - [Plain Arrow](#type-plain-arrow)
    - [Diamond](#type-diamond)
    - [Label](#type-label)
    - [Custom](#type-custom)
  - [Hiding/Showing Overlays](#visibility)
  - [Removing Overlays](#removing)

<a name="intro"></a>
### Introduction
jsPlumb comes with five types of Overlays:

- **Arrow** - a configurable arrow that is painted at some point along the connector.  You can control the length and width of the Arrow, the 'foldback' point - a point the tail points fold back into, and the direction (allowed values are 1 and -1; 1 is the default and means point in the direction of the connection)
- **Label** - a configurable label that is painted at some point along the connector.
- **PlainArrow** - an Arrow shaped as a triangle, with no foldback.
- **Diamond** - as the name suggests...a diamond.
- **Custom** - allows you to create the Overlay yourself - your Overlay may be any DOM element you like.

`PlainArrow` and `Diamond` are actually just configured instances of the generic `Arrow` overlay (see examples). 
			
<a name="location"></a>
### Overlay Location

A key concept with Overlays is that of their **location**.  

For a Connector, the location of an Overlay refers to some point along the path inscribed by the Connector. It can be specified in one of three ways: 

- as a decimal in the range [0..1], which indicates some proportional amount of travel along the path inscribed by the Connector. The default value of 0.5 is in this form, and it means the default location of an Overlay on a Connector is a point halfway along the path.
- as an integer greater than 1, which indicates some absolute number of pixels to travel along the Connector from the start point
- as an integer less than zero, which indicates some absolute number of pixels to travel backwards along the Connector from the end point.

For an Endpoint, the same principles apply, but location is specified as an [x,y] array. For instance, this would specify an Overlay that was positioned in the center of an Endpoint:

    location:[ 0.5, 0.5 ]
    
Whereas this would specify an Overlay that was positioned 5 pixels along the x axis from the top left corner:

    location: [ 5, 0 ]
    
And this would specify an Overlay that was positioned 5 pixels along the x axis from the bottom right corner:

    location: [ -5, 0 ]

All Overlays support these two methods for getting/setting their location:

- **getLocation** - returns the current location
- **setLocation** - sets the current location. For Endpoints, location is expressed in terms of an [ x, y ] array whose values are either proportional to the width/height of the Endpoint (decimals in the range 0-1 inclusive), or absolute values (decimals greater than 0).
			
<a name="adding"></a>
### Adding Overlays
You can specify one or more overlays when making a call to `jsPlumb.connect`, `jsPlumb.addEndpoint` or `jsPlumb.makeSource` (but not `jsPlumb.makeTarget`: overlays are always derived from what the source of a Connection defines)  The three cases are discussed below:

###### Specifying one or more overlays on a jsPlumb.connect call

In this example we'll create an Arrow with the default options for an Arrow, and a label with the text "foo":

```javascript
jsPlumb.connect({
  ...
  overlays:[ 
    "Arrow", 
      [ "Label", { label:"foo", location:0.25, id:"myLabel" } ]
    ],
  ...
});
```

This connection will have an arrow located halfway along it, and the label "foo" one quarter of the way along.  Notice the **id** parameter; it can be used later if you wish to remove the Overlay or change its visibility (see below).

Another example, this time with an absolute location of 50 pixels from the source:

```javascript
jsPlumb.connect({
  ...
  overlays:[ 
    "Arrow", 
      [ "Label", { label:"foo", location:50, id:"myLabel" } ]
    ],
    ...
});
```
			
###### Specifying one or more overlays on a jsPlumb.addEndpoint call.  

**Note** in this example that we use the parameter `connectorOverlays` and not `overlays` as in the last example.  This is because `overlays` would refer to Endpoint Overlays:

```javascript
jsPlumb.addEndpoint("someDiv", {
  ...
  overlays:[
    [ "Label", { label:"foo", id:"label", location:[-0.5, -0.5] } ]
  ],
  connectorOverlays:[ 
    [ "Arrow", { width:10, length:30, location:1, id:"arrow" } ],
    [ "Label", { label:"foo", id:"label" } ]
  ],
  ...
});
```

This connection will have a 10x30 Arrow located right at the head of the connection, and the label "foo" located at the halfway point. The Endpoint itself also has an overlay, located at [ -0.5 * width, -0.5 * height ] relative to the Endpoint's top,left corner.
			
###### Specifying one or more overlays on a jsPlumb.makeSource call.  

**Note** in this example that we again use the parameter `connectorOverlays` and not `overlays`.  The `endpoint` parameter to `jsPlumb.makeSource` supports everything you might pass to the second argument of a `jsPlumb.addEndpoint` call:

```javascript
jsPlumb.makeSource("someDiv", {
  ...
  endpoint:{
    connectorOverlays:[ 
      [ "Arrow", { width:10, length:30, location:1, id:"arrow" } ], 
      [ "Label", { label:"foo", id:"label" } ]
    ]
  }
  ...
});
```

This connection will have a 10x30 Arrow located right at the head of the connection, and the label "foo" located at the halfway point. 

###### Using the `addOverlay` method on an Endpoint or Connection
Endpoints and Connections both have an `addOverlay` method that takes as an argument a single Overlay definition. An example:

```javascript
var e = jsPlumb.addEndpoint("someElement");
e.addOverlay([ "Arrow", { width:10, height:10, id:"arrow" }]); 
```

<a name="types"></a>
### Overlay Types

<a name="type-arrow"></a>
###### Arrow 

Draws an arrow, using four points: the head and two tail points, and a `foldback` point, which permits the tail of the arrow to be indented. Available constructor arguments for this Overlay are:

- **width** - width of the tail of the arrow
- **length** - distance from the tail of the arrow to the head
- **location** - where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the Arrow should appear on the Connector
- **direction** - which way to point. Allowed values are 1 (the default, meaning forwards) and -1, meaning backwards 
- **foldback** - how far along the axis of the arrow the tail points foldback in to. Default is 0.623.
- **paintStyle** - a style object in the form used for paintStyle values for Endpoints and Connectors. 

<a name="type-plain-arrow"></a>
###### PlainArrow 
This is just a specialized instance of `Arrow` in which jsPlumb hardcodes `foldback` to 1, meaning the tail of the Arrow is a flat edge.  All of the constructor parameters from Arrow apply for PlainArrow.
               
<a name="type-diamond"></a>
###### Diamond
This is a specialized instance of `Arrow` in which jsPlumb hardcodes 'foldback' to 2, meaning the Arrow turns into a Diamond.  All of the constructor parameters from Arrow apply for Diamond.

<a name="type-label"></a>
###### Label
Provides a text label to decorate Connectors with.  The available constructor arguments are:		

- **label** - The text to display.  You can provide a function here instead of plain text: it is passed the Connection as an argument, and it should return a String.
- **cssClass** - Optional css class to use for the Label.  This is now preferred over using the `labelStyle` parameter.
- **labelStyle** - Optional arguments for the label's appearance.  Valid entries in this JS object are:
  - **font** - a font string in a format suitable for the Canvas element
  - **fill** - the color to fill the label's background with. Optional.
  - **color** - the color of the label's text. Optional.
  - **padding** - optional padding for the label. This is expressed as a proportion of the width of the label, not in pixels or ems.
  - **borderWidth** - optional width in pixels for the label's border. Defaults to 0.
  - **borderStyle** - optional. The color to paint the border, if there is one.
- **location** - As for Arrow Overlay.  Where, either proportionally from 0 to 1 inclusive, or as an absolute offset from either source or target, the label should appear.

The Label overlay offers two methods - `getLabel` and `setLabel` - for accessing/manipulating its content dynamically:

```javascript
var c = jsPlumb.connect({
  source:"d1", 
  target:"d2", 
  overlays:[
    [ "Label", {label:"FOO", id:"label"}]
  ]	
});
    
...
    
var label = c.getOverlay("label");
console.log("Label is currently", label.getLabel());
label.setLabel("BAR");
console.log("Label is now", label.getLabel());
```

In this example you can see that the Label Overlay is assigned an id of "label" in the connect call, and then retrieved using that id in the call to Connection's getOverlay method.

Both Connections and Endpoints support Label Overlays, and because changing labels is quite a common operation, **setLabel** and **getLabel** methods have been added to these objects:

```javascript
var conn = jsPlumb.connect({
  source:"d1", 
  target:"d2",
  label:"FOO"
});
    
...

console.log("Label is currently", conn.getLabel());
conn.setLabel("BAR");
console.log("Label is now", conn.getLabel());
```

These methods support passing in a Function instead of a String, and jsPlumb will create a label overlay for you if one does not yet exist when you call setLabel:

```javascript
var conn = jsPlumb.connect({
  source:"d1", 
  target:"d2"
});					
    
...
    
conn.setLabel(function(c) {
  var s = new Date();
  return s.getTime() + "milliseconds have elapsed since 01/01/1970";
});
console.log("Label is now", conn.getLabel());
```

<a name="type-custom"></a>
###### Custom
The Custom Overlay allows you to create your own Overlays, which jsPlumb will position for you.  You need to implement one method - `create(component)` - which is passed the component on which the Overlay is located as an argument, and which returns either a DOM element or a valid selector from the underlying library:

```javascript
var conn = jsPlumb.connect({
  source:"d1",
  target:"d2",
  paintStyle:{
    stroke:"red",
    strokeWidth:3
  },
  overlays:[
    ["Custom", {
      create:function(component) {
        return $("<select id='myDropDown'><option value='foo'>foo</option><option value='bar'>bar</option></select>");                
      },
      location:0.7,
      id:"customOverlay"
    }]
  ]
});
```

Here we have created a select box with a couple of values, assigned to it the id of 'customOverlay' and placed it at location 0.7. Note that the 'id' we assigned is distinct from the element's id. You can use the id you provided to later retrieve this Overlay using the `getOverlay(id)` method on a Connection or an Endpoint.
	
<a name="visibility"></a>
### Hiding/Showing Overlays
You can control the visibility of Overlays using the `setVisible` method of Overlays themselves, or with `showOverlay(id)` or `hideOverlay(id)` on a Connection.

Remember the **id** parameter that we specified in the examples above?  This can be used to retrieve the Overlay from a Connection:

```javascript
var connection = jsPlumb.connect({
  ...
  overlays:[ 
    "Arrow", 
    [ "Label", { label:"foo", location:0.25, id:"myLabel" } ]
  ],
  ...
});
    
// time passes
    
var overlay = connection.getOverlay("myLabel");
// now you can hide this Overlay:
overlay.setVisible(false);
// there are also hide/show methods:
overlay.show();
overlay.hide();
```					

However, Connection and Endpoint also have two convenience methods you could use instead:

```javascript
var connection = jsPlumb.connect({
  ...
  overlays:[ 
    "Arrow", 
    [ "Label", { label:"foo", location:-30 }, id:"myLabel" ]
  ],
  ...
});
    
// time passes
    
connection.hideOverlay("myLabel");
    
// more time passes
    
connection.showOverlay("myLabel");
```
	
<a name="removing"></a>
### Removing Overlays
Connection and Endpoint also have a `removeOverlay` method, that does what you might expect:

```javascript
var connection = jsPlumb.connect({
  ...
  overlays:[ 
    "Arrow", 
    [ "Label", { label:"foo", location:0.25 }, id:"myLabel" ]
  ],
  ...
});		
    
// time passes
    
connection.removeOverlay("myLabel");
```
					
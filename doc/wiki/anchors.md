## Anchors

  1. [Introduction](#intro)
  - [Static Anchors](#static)
  - [Dynamic Anchors](#dynamic)
    - [Default Dynamic Anchor](#dynamicdefault)
    - [Location Selection](#dynamiclocation)
  - [Perimeter Anchors](#perimeter)
    - [Perimeter Anchor Rotation](#perimeterrotation)
  - [Continuous Anchors](#continuous)
    - [Continuous Anchor Faces](#continuousfaces)
  - [Associating CSS classes with Anchors](#css)
    - [Changing the anchor class prefix](#anchorprefix)

<a name="intro"></a>
### Introduction

An `Anchor` models the notion of where on an element a `Connector` should connect - it defines the location of an `Endpoint`.  There are four main types of Anchors:

- **Static** - these are fixed to some point on an element and do not move.  They can be specified using a string to identify one of the defaults that jsPlumb ships with, or an array describing the location (see below)
- **Dynamic** - these are lists of Static anchors from which jsPlumb picks the most appropriate one each time a Connection is painted.  The algorithm used to determine the most appropriate anchor picks the one that is closest to the center of the other element in				the Connection. A future version of jsPlumb might support a pluggable algorithm to make this decision.
- **Perimeter** anchors - these are anchors that follow the perimeter of some given shape. They are, in essence, Dynamic Anchors whose locations are chosen from the perimeter of the underlying shape.
- **Continuous** anchors - These anchors are not fixed to any specific location; they are assigned to one of the four faces of an element depending on that element's orientation to the other element in the associated Connection.  Continuous anchors are slightly  more computationally intensive than Static or Dynamic anchors because jsPlumb is required to calculate the position of every Connection during a paint cycle, rather than just Connections belonging to the element in motion.
					
<a name="static"></a>
#### Static Anchors
jsPlumb has nine default anchor locations you can use to specify where the Connectors connect to elements: these are the four corners of an element, the center of the element, and the midpoint of each edge of the element:  		
	
- `Top` (also aliased as `TopCenter`)
- `TopRight`
- `Right` (also aliased as `RightMiddle`)
- `BottomRight`
- `Bottom` (also aliased as `BottomCenter`)
- `BottomLeft`
- `Left` (also aliased as `LeftMiddle`)
- `TopLeft`
- `Center`
			
Each of these string representations is just a wrapper around the underlying array-based syntax  `[x, y, dx, dy]`, where `x` and `y `are coordinates in the interval `[0,1]` specifying the position of the anchor, and `dx` and `dy`,which specify the orientation of the curve incident to the anchor, can have a value of 0, 1 or -1. For example, `[0, 0.5, -1, 0]` defines a `Left` anchor with a connector curve that emanates leftward from the anchor. Similarly, `[0.5, 0, 0, -1]` defines a `Top` anchor with a connector curve emanating upwards.	

```javascript
jsPlumb.connect({...., anchor:"Bottom", ... });
```

is identical to:

```javascript
jsPlumb.connect({...., anchor:[ 0.5, 1, 0, 1 ], ... });
```

##### Anchor Offsets
In addition to supplying the location and orientation of an anchor, you can optionally supply two more parameters that define an offset in pixels from the given location.  Here's the anchor specified above, but with a 50 pixel offset below the element in the y axis:	

```javascript
jsPlumb.connect({...., anchor:[ 0.5, 1, 0, 1, 0, 50 ], ... }); 
```

<a name="dynamic"></a>
#### Dynamic Anchors
These are Anchors that can be positioned in one of a number of locations, choosing the one that is most appropriate each time something moves or is painted in the UI.

There is no special syntax for creating a Dynamic Anchor; you just provide an array of individual Static Anchor specifications, eg:

```javascript
var dynamicAnchors = [ [ 0.2, 0, 0, -1 ],  [ 1, 0.2, 1, 0 ], 
			   [ 0.8, 1, 0, 1 ], [ 0, 0.8, -1, 0 ] ];

jsPlumb.connect({...., anchor:dynamicAnchors, ... });
```

Note that you can mix the types of these individual Static Anchor specifications:

```javascript
var dynamicAnchors = [ [ 0.2, 0, 0, -1 ],  [ 1, 0.2, 1, 0 ], 
			   "Top", "Bottom" ];

jsPlumb.connect({...., anchor:dynamicAnchors, ... });
```

<a name="dynamicdefault"></a>
##### Default Dynamic Anchor
jsPlumb provides a dynamic anchor called `AutoDefault` that chooses from `Top`, `Right`, `Bottom` and `Left`:

```javascript
jsPlumb.connect({...., anchor:"AutoDefault", ... });
```

<a name="dynamiclocation"></a>
##### Location Selection
The algorithm that decides which location to choose just calculates which location is closest to the center of the other element in the Connection.  It is possible that future versions of jsPlumb could support more sophisticated choice algorithms, if the need arose.

##### Draggable Connections
Dynamic Anchors and Draggable Connections can interoperate: jsPlumb locks the position of a dynamic anchor when you start to drag a connection from it, and unlocks it once the connection is either established or abandoned. At that point you may see the position of the dynamic anchor change, as jsPlumb optimises the connection.  

You can see this behaviour in the [draggable connections](https://jsplumbtoolkit.com/community/demo/draggableConnectors/dom.html) demonstration, when you drag a connection from the blue endpoint on window 1 to the blue endpoint on window 3 - the connection is established and then window 1's blue endpoint jumps down to a location that is closer to window 3.

<a name="perimeter"></a>
#### Perimeter Anchors
These are a form of Dynamic Anchor in which the anchor locations are chosen from the perimeter of some given shape. jsPlumb supports six shapes:

- `Circle`
- `Ellipse`
- `Triangle`
- `Diamond`
- `Rectangle`
- `Square`

`Rectangle` and `Square`, are not, strictly speaking, necessary, since rectangular shapes are the norm in a web page. But they are included for completeness.

```javascript
jsPlumb.addEndpoint("someElement", {
  endpoint:"Dot",
  anchor:[ "Perimeter", { shape:"Circle" } ]
});
```

In this example our anchor will travel around the path inscribed by a circle whose diameter is the width and height of the underlying element. 

Note that the `Circle` shape is therefore identical to `Ellipse`, since it is assumed the underlying element will have equal width and height, and if it does not, you will get an ellipse. `Rectangle` and `Square` have the same relationship.

By default, jsPlumb approximates the perimeter with 60 anchor locations.  You can change this, though:

```javascript
jsPlumb.addEndpoint("someDiv", {
	endpoint:"Dot",
	anchor:[ "Perimeter", { shape:"Square", anchorCount:150 }]
});
```

Obviously, the more points the smoother the operation. But also the more work your browser has to do.

Here's a triangle and diamond example, just for completeness:

```javascript
jsPlumb.connect({
	source:"someDiv",
	target:"someOtherDiv",
	endpoint:"Dot",
	anchors:[
		[ "Perimeter", { shape:"Triangle" } ],
		[ "Perimeter", { shape:"Diamond" } ]
	]
});
```

<a name="perimeterrotation"></a>
##### Perimeter Anchor Rotation
You can supply a `rotation` value to a Perimeter anchor - an example can be seen in [this demonstration](https://jsplumbtoolkit.com/community/demo/perimeterAnchors/index.html). Here's how you would use it:

```javascript
jsPlumb.connect({
	source:"someDiv",
	target:"someOtherDiv",
	endpoint:"Dot",
	anchors:[
		[ "Perimeter", { shape:"Triangle", rotation:25 } ],
		[ "Perimeter", { shape:"Triangle", rotation:-335 } ]
	]
});  
```

Note that the value must be supplied **in degrees**, not radians, and the number may be either positive or negative. In the example above, both triangles are of course rotated by the same amount.

<a name="continuous"></a>
#### Continuous Anchors	
As discussed above, these are anchors whose positions are calculated by jsPlumb according to the orientation between elements in a Connection, and also how many other Continuous anchors happen to be sharing the element.  You specify that you want to use Continuous anchors using the string syntax you would use to specify one of the default Static Anchors, for example:

```javascript
jsPlumb.connect({
	source:someDiv,
	target:someOtherDiv,
	anchor:"Continuous"
});
```

Note in this example I specified only "anchor", rather than "anchors" - jsPlumb will use the same spec for both anchors.  But I could have said this:

```javascript
jsPlumb.connect({
  source:someDiv,
  target:someOtherDiv,
  anchors:["Bottom", "Continuous"]
});
```

...which would have resulted in the source element having a Static Anchor at `BottomCenter`.  In practise, though, it seems the Continuous Anchors work best if both elements in a Connection are using them.

Note also that Continuous Anchors can be specified on `addEndpoint` calls:

```javascript
jsPlumb.addEndpoint(someDiv, {
  anchor:"Continuous",
  paintStyle:{ fill:"red" }
});
```

...and in `makeSource` / `makeTarget`:

```javascript
jsPlumb.makeSource(someDiv, {
  anchor:"Continuous",
  paintStyle:{ fill:"red" }
});

jsPlumb.makeTarget(someDiv, {
  anchor:"Continuous",
  paintStyle:{ fill:"red" }
});
```

... and in the jsPlumb defaults:

```javascript
jsPlumb.Defaults.Anchor = "Continuous";
```
      
<a name="continuousfaces"></a>          
##### Continuous Anchor Faces
By default, a Continuous anchor will choose points from all four faces of the element on which it resides.  You can control this behaviour, though, with the `faces` parameter on the anchor spec:

```javascript
jsPlumb.makeSource(someDiv, {
    anchor:["Continuous", { faces:[ "top", "left" ] } ]
});
```

Allowed values are:
- `top`
- `left`
- `right`
- `bottom`

If you provide an empty array for the `faces` parameter, jsPlumb will default to using all four faces.  

<a name="css"></a>
### Associating CSS Classes with Anchors
The array syntax discussed above supports an optional 7th value, which is a string that represents a CSS class. This CSS class is then associated with the Anchor, and applied to the Anchor's Endpoint and Element whenever the Anchor is selected.

A Static Anchor is of course always "selected", but a Dynamic Anchor cycles through a number of different locations, and each of these may have a different CSS class associated with it.

The CSS class that gets written to the Endpoint and Element is prefixed with the associated jsPlumb instance's `endpointAnchorClass` prefix, which defaults to:

```javascript
jtk-endpoint-anchor-
```
    
So if you had the following, for example:

```javascript
var ep = jsPlumb.addEndpoint("someDiv", {
  anchor:[0.5, 0, 0, -1, 0, 0, "top" ]
};
```
    
Then the Endpoint created by jsPlumb and also the element `someDiv` would have this class assigned to them:

```javascript
jtk-endpoint-anchor-top
```
    
An example using Dynamic Anchors:

```javascript
var ep = jsPlumb.addEndpoint("someDiv", {
  anchor:[
    [ 0.5, 0, 0, -1, 0, 0, "top" ],
    [ 1, 0.5, 1, 0, 0, 0, "right" ]
    [ 0.5, 1, 0, 1, 0, 0, "bottom" ]
    [ 0, 0.5, -1, 0, 0, 0, "left" ]
  ]
});
```
    
Here, the class assigned to Endpoint and Element would cycle through these values as the anchor location changes:

```javascript
jtk-endpoint-anchor-top
jtk-endpoint-anchor-right
jtk-endpoint-anchor-left
jtk-endpoint-anchor-bottom
```
    
Note that if you supply a class name that consists of more than one term, jsPlumb will not prepend the prefix to each term in the class:

```javascript
var ep = jsPlumb.addEndpoint("someDiv", {
  anchor:[ 0.5, 0, 0, -1, 0, 0, "foo bar" ]
});
```
    
would result in **2** classes being added to the Endpoint and Element:

```javascript
jtk-endpoint-anchor-foo
```

and

```javascript
bar
```
    
<a name="anchorprefix"></a>
##### Changing the anchor class prefix

The prefix used with anchor classes is stored as the jsPlumb member `endpointAnchorClass`.  You can change this to whatever you like on some instance of jsPlumb:

```javascript
jsPlumb.endpointAnchorClass = "anchor_";
```
    
or maybe

```javascript
var jp = jsPlumb.getInstance();
jp.endpointAnchorClass = "anchor_";
```
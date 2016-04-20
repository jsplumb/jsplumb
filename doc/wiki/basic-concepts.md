## Basic Concepts

  - [Introduction](#intro)
  - [Connector, Endpoint, Anchor &amp; Overlay Definitions](#definitions)

  
	
<a name="intro"></a>
### Introduction
jsPlumb is all about connecting things together, so the core abstraction in jsPlumb is the `Connection` object, which is 
itself broken down into these five concepts:
			
- **Anchor** - a location, relative to an element's origin, at which an Endpoint can exist. You do not create these 
yourself; you supply hints to the various jsPlumb functions, which create them as needed.  They have no visual 
representation; they are a logical position only. Anchors can be referenced by name, for the Anchors that jsPlumb ships 
with, or with an array containing various parameters, for greater control. See the [Anchors](anchors) page for more detail.
				
- **Endpoint** - the visual representation of one end of a Connection.  You can create and attach these to elements 
yourself, which you are required to do to support drag and drop, or have jsPlumb create them when creating a Connection 
programmatically using `jsPlumb.connect(...)`.  You can also join two Endpoints programmatically, by passing them as 
arguments to `jsPlumb.connect(...)`. See the [Endpoints](endpoints) page for more detail.

- **Connector** - the visual representation of the line connecting two elements in the page.  jsPlumb has four types of 
these available as defaults - a Bezier curve, a straight line, 'flowchart' connectors and 'state machine' connectors. 
You do not interact with Connectors; you just specify definitions of them when you need to. See the 
[Connectors](connectors) page for more detail.
                                                                                                                                                                                                                                                                                                                                  				
- **Overlay** - a UI component that is used to decorate a Connector, such as a Label, Arrow, etc.

- **Group** - a group of elements contained within some other element, which can be collapsed, causing connections to
all of the Group members to be pooled on the collapsed Group container. For more information, see the [Groups](groups)
page.


One Connection is made up of two Endpoints, a Connector, and zero or more Overlays working together to join two 
elements. Each Endpoint has an associated Anchor.

jsPlumb's public API exposes only Connection and Endpoint, handling the creation and configuration of everything else 
internally. But you still need to be across the concepts encapsulated by Anchor, Connector and Overlay.



<a name="definitions"></a>
### Connector, Endpoint, Anchor &amp; Overlay Definitions

Whenever you need to define a Connector, Endpoint, Anchor or Overlay, you must use a "definition" of it, rather than 
constructing one directly.  This definition can be either a string that nominates the artifact you want to create - see 
the `endpoint` parameter here:

```javascript
jsPlumb.connect({
    source:"someDiv",
    target:"someOtherDiv",
    endpoint:"Rectangle"
});
```

...or an array consisting of both the artifact's name and the arguments you want to pass to its constructor:		

```javascript
jsPlumb.connect({
    source:"someDiv",
    target:"someOtherDiv",
    endpoint:[ "Rectangle", { 
      cssClass:"myEndpoint", 
      width:30, 
      height:10 
  }]
});
```
		
There is also a three-argument method that allows you to specify two sets of parameters, which jsPlumb will merge 
together for you. The idea behind this is that you will often want to define common characteristics somewhere and reuse 
them across a bunch of different calls:

```javascript
var common = {
    cssClass	:	"myCssClass",
    hoverClass	:	"myHoverClass"
};
jsPlumb.connect({
    source:"someDiv",
    target:"someOtherDiv",
    endpoint:[ "Rectangle", { width:30, height:10 }, common ]
});
```

This syntax is supported for all Endpoint, Connector, Anchor and Overlay definitions.  Here's an example using 
definitions for all four:

```javascript
var common = {
    cssClass:"myCssClass"
};
jsPlumb.connect({
  source:"someDiv",
  target:"someOtherDiv",
  anchor:[ "Continuous", { faces:["top","bottom"] }],
  endpoint:[ "Dot", { radius:5, hoverClass:"myEndpointHover" }, common ],
  connector:[ "Bezier", { curviness:100 }, common ],
  overlays: [
        [ "Arrow", { foldback:0.2 }, common ],
        [ "Label", { cssClass:"labelClass" } ]	
    ]
});
```

The allowed constructor parameters are different for each artifact you create, but every artifact takes a single JS 
object as argument, with the parameters as (key,value) pairs in that object.


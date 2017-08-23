### Connections

1. [Programmatic Connections](#programmatic)
- [Drag and Drop Connections](#draganddrop)  		
- [Elements as sources and targets](#sourcesandtargets)
  - [Sources](#makesource)    
      - [Specifying drag source area](#sourcefilter)
      - [Endpoint options](#makeSourceOptions)
  - [Targets](#maketarget)
      - [Preventing Loopback Connections](#loopback)      
      - [Deleting Endpoints on Detach](#deleteOnDetach)
      - [Detaching connections made with the mouse](#detachMouse)
      - [Target Anchors positions with makeTarget](#targetAnchorPositions)
  - [Unique Endpoint per Source/Target](#uniqueEndpoint)
  - [Creating an Endpoint on a Source/Target prior to any Connections](#createEndpoint)
- [Drag Options](#dragOptions)
- [Drop Options](#dropOptions)
- [Drag and Drop Scope](#dragScope)
  - [Multiple Scopes](#multipleScopes)
  - [Changing the scope(s) of a source or target element](#setScope)
- [Disconnecting and Reconnecting](#disconnectreconnect)

<a name="programmatic"></a>
#### Programmatic Connections
The most simple connection you can make with jsPlumb looks like this:

```javascript
jsPlumb.connect({source:"element1", target:"element2"});
```

In this example we have created a Connection from 'element1' to 'element2'.  Remember that a Connection in jsPlumb consists of two Endpoints, a Connector, and zero or more Overlays.  But this call to 'connect' supplied none of those things, so jsPlumb uses the default values wherever it needs to.  In this case, default values have been used for the following: 

- The type and appearance of each Endpoint in the Connection. jsPlumb's default for this is the "Dot" endpoint, of radius 10, with fill color "#456".
- The Anchors that define where the Connection's Endpoints appear on each element. The jsPlumb default is `Bottom`.
- Whether or not each Endpoint can be a source or target for new Connections. The default is false.
- The type and appearance of the Connection's Connector. The default is a "Bezier" connector of line width 8, and color "#456".

So this call will result in an 8px Bezier, colored "#456", from the bottom center of 'element1' to the bottom center of 'element2', and each Endpoint will be a 10px radius Dot Endpoint, colored "#456".

Let's beef up this call a little and tell jsPlumb what sort of Endpoints we want, and where we want them:		

```javascript
jsPlumb.connect({
  source:"element1", 
  target:"element2",
  anchors:["Right", "Left" ],
  endpoint:"Rectangle",
  endpointStyle:{ fill: "yellow" }
});
```

This is what we have told jsPlumb we want this time:

- **anchors** - this array tells jsPlumb where the source and target Endpoints should be located on their parent elements. In this case, we use the shorthand syntax to name one of jsPlumb's default anchors; you can also specify custom locations (see [Anchors](anchors). Instead of `anchors` you can use `anchor`, if you want the source and target Endpoints to be located at the same place on their parent elements.		
- **endpoint**  - this tells jsPlumb to use the `Rectangle` Endpoint for both the source and target of the Connection.  As with anchors, `endpoint` has a plural version that allows you to specify a different Endpoint for each end of the Connection.
- **endpointStyle** - this is the definition of the appearance of the Endpoint you specified above.  Again, there is a plural equivalent of this that allows you to specify a different style for each end of the Connection. For more information about allowed values for this value, see [Connector, Endpoint, Anchor &amp; Overlay definitions](basic-concepts#definitions).
		
<a name="common"></a>
##### Reusing common settings between jsPlumb.connect calls
A fairly common situation you will find yourself in is wanting to create a bunch of Connections that have only minor differences between them.  To support that, `jsPlumb.connect` takes an optional second argument. For example:			 

```javascript
var common = {
  anchors:[ "BottomCenter", "TopCenter" ],
  endpoints:["Dot", "Blank" ]
};

jsPlumb.connect({ source:"someElement", target:"someOtherElement" }, common);

jsPlumb.connect({ source:"aThirdElement", target:"yetAnotherElement" }, common);
```

##### Endpoints created by jsPlumb.connect
If you supply an element id or selector for either the source or target, jsPlumb.connect will automatically create an Endpoint on the given element.  These automatically created Endpoints are not marked as drag source or targets, and cannot be interacted with.  For some situations this behaviour is perfectly fine, but for more interactive UIs you should set things up using one of the drag and drop methods discussed below.

**Note**: given that `jsPlumb.connect` creates its own Endpoints in some circumstances, in order to avoid leaving orphaned Endpoints around the place, if the Connection is subsequently deleted, these automatically created Endpoints are deleted too.  Should you want to, you can override this behaviour by setting `deleteEndpointsOnDetach` to false in the connect call:

```javascript
jsPlumb.connect({ 
  source:"aThirdElement", 
  target:"yetAnotherElement",
  deleteEndpointsOnDetach:false 
});
```

<a name="detaching"></a>
##### Detaching Connections
By default, connections made with `jsPlumb.connect` will be detachable via the mouse.  You can prevent this by either setting an appropriate default value:

```javascript
jsPlumb.importDefaults({ 
  ...
  ConnectionsDetachable:false
  ...
});
```

...or by specifying it on the connect call like this:

```javascript
jsPlumb.connect({ 
  source:"aThirdElement", 
  target:"yetAnotherElement",
  detachable:false
});
```

<a name="draganddrop"></a>
#### Drag and Drop Connections
To support drag and drop connections, you first need to set a few things up.  Every drag and drop connection needs at least a source Endpoint that the user can drag a connection from. Here's a simple example of how to create an Endpoint:

```javascript
var endpointOptions = { isSource:true };
var endpoint = jsPlumb.addEndpoint('elementId', endpointOptions);
```
	
This Endpoint will act as a source for new Connections, and will use the jsPlumb defaults for its own appearance and that of any Connections that are drawn from it.							
	
###### Tip: use the three-argument addEndpoint method for common data 
One thing that happens quite often is that you have an Endpoint whose appearance and behaviour is largely the same between usages on different elements, with just a few differences. 

```javascript
var exampleGreyEndpointOptions = {
  endpoint:"Rectangle",
  paintStyle:{ width:25, height:21, fill:'#666' },
  isSource:true,
  connectorStyle : { stroke:"#666" },
  isTarget:true
};
```
	
Notice there is no `anchor` set.  Here we apply it to two elements, at a different location in each:

```javascript
jsPlumb.addEndpoint("element1", { 
  anchor:"Bottom"
}, exampleGreyEndpointOptions)); 

jsPlumb.addEndpoint("element2", { 
  anchor:"Top" 
}, exampleGreyEndpointOptions));
```

Now that you have a source Endpoint, you need to either create a target Endpoint on some element, or notify jsPlumb that you wish to make an entire element a drop target.  Let's look at how to attach a target Endpoint first:

```javascript
var endpointOptions = { isTarget:true, endpoint:"Rectangle", paintStyle:{ fill:"gray" } };
var endpoint = jsPlumb.addEndpoint("otherElementId", endpointOptions);
```

This Endpoint, a gray rectangle, has declared that it can act as a drop target for Connections. 

<a name="sourcesandtargets"></a>
#### Elements as sources &amp; targets

jsPlumb also supports turning entire elements into Connection sources and targets, using the methods `makeSource` and `makeTarget`.  With these methods you mark an element as a source or target, and provide an Endpoint specification for jsPlumb to use when a Connection is established.  `makeSource` also gives you the ability to mark some child element as the place from which you wish to drag Connections, but still have the Connection on the main element after it has been established.

These methods honour the jsPlumb defaults - if, for example you set up the default Anchors to be this:

```javascript
jsPlumb.importDefaults({
  Anchors : [ "Left", "BottomRight" ]
});
```

... and then used `makeSource` and `makeTarget` without specifying Anchor locations, jsPlumb would use `Left` for the `makeSource` element and `BottomRight` for the `makeTarget` element.

A further thing to note about `makeSource` and `makeTarget` is that any prior calls to one of these methods is honoured by subsequent calls to `jsPlumb.connect`. This helps when you're building a UI that uses this functionality at runtime but which loads some initial data, and you want the statically loaded data to have the same appearance and behaviour as dynamically created Connections (obviously quite a common use case).  

For example:

```javascript
jsPlumb.makeSource("el1", {
  anchor:"Continuous",
  endpoint:["Rectangle", { width:40, height:20 }],
  maxConnections:3
});    
   
...
    
jsPlumb.connect({source:"el1", target:"el2"});
```

In this example, the source of the connection will be a Rectangle of size 40x20, having a Continuous Anchor.  The source is also configured to allow a maximum of three Connections.

You can override this behaviour by setting a `newConnection` parameter on the connect call:

```javascript
jsPlumb.makeSource("el1", {
  anchor:"Continuous",
  endpoint:["Rectangle", { width:40, height:20 }],
  maxConnections:1,
  onMaxConnections:function(params, originalEvent) {
      // params contains:
      // {
      //    endpoint:..
      //    connection:...
      //    maxConnections:N
      // }
      //
  }
});
    
...
    
jsPlumb.connect({ 
  source:"el1", 
  target:"el2", 
  newConnection:true 
});
```

Note the `onMaxConnections` parameter to this call - it allows you to supply a function to call if the user tries to 
drag a new Connection when the source has already reached capacity.

##### Reference Parameters
As with `jsPlumb.connect`, `makeSource` can take an optional third argument consisting of parameters that may be common across several different calls:

```javascript
var common = {
  anchor:"Continuous",
  endpoint:["Rectangle", { width:40, height:20 }],
};

jsPlumb.makeSource("el1", {
  maxConnections:1,
  onMaxConnections:function(params, originalEvent) {
    console.log("element is ", params.endpoint.element, "maxConnections is", params.maxConnections);
  }
}, common);
```

<a name="maketarget"></a>
##### jsPlumb.makeTarget
This method takes two arguments, the first of which specifies some element (or list of elements); the second specifies 
the Endpoint you wish to create on that element whenever a Connection is established on it.  In this example we will use 
the exact same target Endpoint we used before - the gray rectangle - but we will tell jsPlumb that the element 
`aTargetDiv` will be the drop target:

```javascript
var endpointOptions = { 
  isTarget:true, 
  maxConnections:5,
  endpoint:"Rectangle", 
  paintStyle:{ fill:"gray" } 
};
jsPlumb.makeTarget("aTargetDiv", endpointOptions);
```
		
The allowed values in 'endpointOptions' are identical for both the `jsPlumb.addEndpoint` and `jsPlumb.makeTarget` methods, 
but `makeTarget` supports an extended Anchor syntax that allows you more control over the location of the target endpoint.  
This is discussed below.	

Notice in the `endpointOptions` object above there is a parameted called `isTarget` - this may seem incongruous, since 
you know you're going to make some element a target.  Remember that the `endpointOptions` object is the information 
jsPlumb will use to create an Endpoint on the given target element each time a Connection is established to it. It 
takes the exact same format as you would pass to `addEndpoint`; `makeTarget` is essentially a deferred `addEndpoint` 
call followed by a `connect` call.  So in this case, we're telling jsPlumb that any Endpoints it happens to create on 
some element that was configured by the `makeTarget` call are themselves Connection targets.  You may or may not want 
this behaviour in your application - just control it by setting the appropriate value for that parameter (it defaults 
to false).

`makeTarget` also supports the `maxConnections` and `onMaxConnections` parameters, as `makeSource` does, but note that 
`onMaxConnections` is passed one extra parameter than its corresponding callback from `makeSource` - the Connection 
the user tried to drop:

```javascript
jsPlumb.makeTarget("aTargetDiv", { 
  isTarget:true, 
  maxConnections:5,
  endpoint:"Rectangle", 
  paintStyle:{ fill:"gray" },
  maxConnections:3,
  onMaxConnections:function(params, originalEvent) {
    console.log("user tried to drop connection", params.connection, "on element", params.endpoint.element, "with max connections", params.maxConnections);
  }
};
```

##### Reference Parameters
As with `jsPlumb.connect` and `jsPlumb.makeSource`, `jsPlumb.makeTarget` can take an optional third argument consisting 
of parameters that may be common across several different calls:

```javascript
var common = {
  anchor:"Continuous",
  endpoint:["Rectangle", { width:40, height:20 }],
};

jsPlumb.makeTarget("el1", {
  maxConnections:1,
  onMaxConnections:function(params, originalEvent) {
    console.log("element is ", params.endpoint.element, "maxConnections is", params.maxConnections);
  }
}, common);
```

<a id="loopback"></a>
##### Preventing Loopback Connections

In vanilla jsPlumb only, you can instruct jsPlumb to prevent loopback connections without having to resort to a [beforeDrop interceptor](interceptors). You do this by setting `allowLoopback:false` on the parameters passed to the `makeTarget` method:

```javascript
jsPlumb.makeTarget("foo", {
  allowLoopback:false
});
```

<a id="deleteOnDetach"></a>
##### Deleting Endpoints on detach
By default, any Endpoints created using makeTarget have `deleteEndpointsOnDetach` set to true, which means that once all Connections to that Endpoint are removed, the Endpoint is deleted.  You can override this by setting the flag to true on the `makeTarget` call:

```javascript
var endpointOptions = { 
  isTarget:true, 
  maxConnections:5,
  uniqueEndpoint:true,
  deleteEndpointsOnDetach:false,
  endpoint:"Rectangle", 
  paintStyle:{ fill:"gray" } 
};
jsPlumb.makeTarget("aTargetDiv", endpointOptions);
```

In this setup we have told jsPlumb to create an Endpoint the first time `aTargetElement` receives a Connection, and to not delete it even if there are no longer any Connections to it.  The created Endpoint will be reused for subsequent Connections, and can support a maximum of 5.

<a id="detachMouse"></a>
##### Detaching connections made with the mouse
As with `jsPlumb.connect`, Connections made with the mouse after setting up Endpoints with one of the functions we've just covered will be, by default, detachable.  You can prevent this in the jsPlumb defaults, as previously mentioned:

```javascript
jsPlumb.importDefaults({ 
  ...
  ConnectionsDetachable:false,
  ...
});
```

And you can also set this on a per-endpoint (or source/target) level, like in these examples:

```javascript
jsPlumb.addEndpoint("someElementId", { 
  connectionsDetachable:false	
});
    
jsPlumb.makeSource("someOtherElement", {
  ...
  connectionsDetachable:false,
  ...
});
    
jsPlumb.makeTarget("yetAnotherElement", {
  ...
  connectionsDetachable:false,
  ...
});
```

Note that in the jsPlumb defaults, by convention each word in a parameter is capitalised ("ConnectionsDetachable"), whereas for a call to one of these methods, we use camel case ("connectionsDetachable").

<a id="targetAnchorPositions"></a>
##### Target Anchors positions with makeTarget
When using the `makeTarget` method, jsPlumb allows you to provide a callback function to be used to determine
the appropriate location of a target Anchor for every new Connection dropped on the given target.  It may be the case that you want to take some special action rather than just relying on one of the standard Anchor mechanisms.

This is achieved through an extended Anchor syntax (note that this syntax is **not supported** in the `jsPlumb.addEndpoint` method) that supplies a "positionFinder" to the anchor specification.  jsPlumb provides two of these by default; you can register your own on jsPlumb and refer to them by name, or just supply a function. Here's a few examples:

- Instruct jsPlumb to place the target anchor at the exact location at which the mouse button was released on the target element. Note that you tell jsPlumb the anchor is of type "Assign", and you then provide a "position"
parameter, which can be the name of some position finder, or a position finder function itself:

```javascript
jsPlumb.makeTarget("someElement", {
  anchor:[ "Assign", { 
    position:"Fixed"
  }]
});
```

`Fixed` is one of the two default position finders provided by jsPlumb. The other is `Grid`:

```javascript
jsPlumb.makeTarget("someElement", {
  anchor:[ "Assign", { 
    position:"Grid",
    grid:[3,3]
  }]
});
```

The Grid position finder takes a `grid` parameter that defines the size of the grid required. [3,3] means 3 rows and 3 columns.

###### Supplying your own position finder
To supply your own position finder to jsPlumb you first need to create the callback function. First let's take a look at what the source code for the `Grid` position finder looks like:

```javascript
function(eventOffset, elementOffset, elementSize, constructorParams) {
  var dx = eventOffset.left - elementOffset.left, dy = eventOffset.top - elementOffset.top,
      gx = elementSize[0] / (constructorParams.grid[0]), 
      gy = elementSize[1] / (constructorParams.grid[1]),
      mx = Math.floor(dx / gx), my = Math.floor(dy / gy);

  return [ ((mx * gx) + (gx / 2)) / elementSize[0], ((my * gy) + (gy / 2)) / elementSize[1] ];
}
```

The four arguments are:

- **eventOffset** - Page left/top where the mouse button was released (a JS object)
- **elementOffset** - JS offset object containing offsets for the element on which the Connection is to be created
- **elementSize** - [width, height] array of the dimensions of the element on which the Connection is to be created
- **constructorParams** - the parameters that were passed to the Anchor's constructor. In the example given above, those parameters are 'position' and 'grid'; you can pass arbitrary parameters.

The return value of this function is an array of [x, y] - proportional values between 0 and 1 inclusive, such as you can pass to a static Anchor.

To make your own position finder you need to create a function that takes those four arguments and returns an [x, y] position for the anchor, for example:

```javascript
jsPlumb.AnchorPositionFinders.MyFinder = function(dp, ep, es, params) {
  ... do some maths ...	
  console.log("my custom parameter is ", params.myCustomParameter);
  return [ x, y ];	
};
```

Then refer to it in a makeTarget call:

```javascript
jsPlumb.makeTarget("someElement", {  
  anchor:[ "Assign", { 
    position:"MyFinder",
    myCustomParameter:"foo",
    anInteger:5
  }]
});
```

<a name="makesource"></a>
##### jsPlumb.makeSource

There are two use cases supported by this method.  The first is the case that you want to drag a Connection from the element itself and have an Endpoint attached to the element when a Connection is established.  The second is a more specialised case: you want to drag a Connection from the element, but once the Connection is established you want jsPlumb to move it so that its source is on some other element.

Here's an example code snippet for the basic use case of makeSource:

```javascript
jsPlumb.makeSource(someDiv, {
  paintStyle:{ fill:"yellow" },
  endpoint:"Blank",
  anchor:"BottomCenter"
});
```

Notice again that the second argument is the same as the second argument to an `addEndpoint` call.  `makeSource` is, essentially, a type of `addEndpoint` call.  In this example we have told jsPlumb that we will support dragging Connections directly from `someDiv`.  Whenever a Connection is established between `someDiv` and some other element, jsPlumb assigns an Endpoint at BottomCenter of `someDiv`, fills it yellow, and sets that Endpoint as the newly created Connection's source. 

<a name="sourcefilter"></a>
##### Specifying drag source area

Configuring an element to be an entire Connection source using `makeSource` means that the element cannot itself be draggable.  There would be no way for jsPlumb to distinguish between the user attempting to drag the element and attempting to drag a Connection from the element.  To handle this there is the `filter` parameter.

##### Supplying a `filter` parameter

You can supply a `filter` parameter to the makeSource call, which can be either a function or a selector. Consider this markup:

```html
<div id="foo">
  <span>FOO</span>
  <button>click me</button>
<div>
```

Let's suppose we do not want to interfere with the operation of the "click me" button. 

###### Selector Filter 

We can supply a selector filter to the `makeSource` call to do so:

```javascript
jsPlumb.makeSource("foo", {
  filter:":not(button)"
});
```

Valid values for a filter selector are [as per the spec](http://www.w3.org/TR/css3-selectors/). 

###### Negating a Selector Filter

One of the limitations of CSS3 selectors is that the contents of a `:not` selector are restricted to what are called __simple selectors__. What this means is that only one item may appear inside a `:not`, eg. `:not(.someClass)`, `:not(button)` etc. You cannot, however, do something like this: `:not(.myClass button)`.  

To allow for these sorts of negation selectors, you can set the `filterExclude:true` flag and re-write your selector:

```javascript
jsPlumb.makeSource("foo", {
  filter:"span",
  filterExclude:true
});
```

###### Filter Function

Alternatively, you can supply a function as the filter:

```javascript
jsPlumb.makeSource("foo", {
  filter:function(event, element) {
    return event.target.tagName !== "BUTTON";
  }
});
```

In this example, if the filter returns anything other than a boolean false, the drag will begin. It's important to note that only boolean false will prevent a drag. False-y values will not. 

<a id="makeSourceOptions"></a>
##### Endpoint options with makeSource
There are many things you can set in an Endpoint options object; for a thorough list see the API documentation for Endpoint.  

Here's an example of specifying that you want an Arrow overlay halfway along any Connection dragged from this Endpoint:

```javascript
var exampleGreyEndpointOptions = {
  endpoint:"Rectangle",
  paintStyle:{ width:25, height:21, fill:'#666' },
  isSource:true,
  connectorStyle : { stroke:"#666" },
  isTarget:true,
  connectorOverlays: [ [ "Arrow", { location:0.5 } ] ]
};
```

This is an Endpoint that moves around the element it is attached to dependent on the location of other elements in the connections it is attached to (a 'dynamic' anchor):

```javascript
var exampleGreyEndpointOptions = {
  endpoint:"Rectangle",
  paintStyle:{ width:25, height:21, fill:'#666' },
  isSource:true,
  connectorStyle : { stroke:"#666" },
  isTarget:true,
  connectorOverlays: [ [ "Arrow", { location:0.5 } ] ]
  anchor:[ "TopCenter","RightMiddle","BottomCenter","LeftMiddle" ]
};
```

##### Testing if an element is a target or source
You can test if some element has been made a connection source or target using these methods:

- `isTarget(some id, selector or DOM element)`
- `isSource(some id, selector or DOM element)`

The return value is a boolean.

##### Toggling an element as connection target or source
You can toggle the state of some source or target using these methods:

- `setTargetEnabled(some id, selector or DOM element)`
- `setSourceEnabled(some id, selector or DOM element)`

The return value from these methods is the current jsPlumb instance, allowing you to chain them:

`jsPlumb.setTargetEnabled("aDivId").setSourceEnabled($(".aSelector"));`

Note that if you call either of these methods on an element that was not originally configured as a target or source, nothing will happen.

You can check the enabled state of some target or source using these methods:

- `isTargetEnabled(some id, selector or DOM element)`
- `isSourceEnabled(some id, selector or DOM element)`

##### Canceling previous `makeTarget` and/or `makeSource` calls

jsPlumb offers four methods to let you cancel previous `makeTarget` or `makeSource` calls. Each of these methods returns the current jsPlumb instance, and so can be chained:

- `unmakeTarget(some id, selector or DOM element)`
- `unmakeSource(some id, selector or DOM element)`
- `unmakeEveryTarget`
- `unmakeEverySource`

These last two are analogous to the `removeEveryConnection` and `deleteEveryEndpoint` methods that have been in jsPlumb for a while now.

`unmakeTarget` and `unmakeSource` both take as argument the same sorts of values that `makeTarget` and `makeSource` accept - a string id, or a selector, or an array of either of these:

```javascript
jsPlumb.unmakeTarget("aDivId").unmakeSource($(".aSelector"));
```

<a id="uniqueEndpoint"></a>
##### Unique Endpoint per Source/Target

jsPlumb will create a new Endpoint using the supplied information every time a new Connection is established on 
a source or target element, by default, but you can override this behaviour and tell jsPlumb that it should create at 
most one Endpoint, which it should attempt to use for subsequent Connections:

```javascript
var endpointOptions = { 
  isTarget:true, 
  uniqueEndpoint:true,
  endpoint:"Rectangle", 
  paintStyle:{ fill:"gray" } 
};
jsPlumb.makeTarget("aTargetDiv", endpointOptions);
```

Here, the `uniqueEndpoint` parameter tells jsPlumb that there should be at most one Endpoint on this element.  
Notice that `maxConnections` is not set: the default is 1, so in this setup we have told jsPlumb that `aTargetDiv` 
can receive one Connection and no more.

The same parameter can be supplied to `makeSource`:

```javascript
var endpointOptions = { 
  isSource:true, 
  uniqueEndpoint:true,
  endpoint:"Rectangle", 
  paintStyle:{ fill:"gray" } 
};
jsPlumb.makeSource("aSourceDiv", endpointOptions);
```

<a id="createEndpoint"></a>
##### Creating an Endpoint on a Source/Target prior to any Connections

You can instruct jsPlumb to create a new Endpoint using the supplied information before any Connections have been established on 
a source or target element:

```javascript
var endpointOptions = { 
  isTarget:true, 
  createEndpoint:true,
  endpoint:"Rectangle", 
  paintStyle:{ fill:"gray" } 
};
jsPlumb.makeTarget("aTargetDiv", endpointOptions);
```

Setting `createEndpoint` to `true` will cause jsPlumb to also implicitly set `uniqueEndpoint` to be true. The characteristics of
the behaviour of this Endpiont will be as discussed above in the section on `uniqueEndpoint`. 

The same parameter can be supplied to `makeSource`:

```javascript
var endpointOptions = { 
  isSource:true, 
  createEndpoint:true,
  endpoint:"Rectangle", 
  paintStyle:{ fill:"gray" } 
};
jsPlumb.makeSource("aSourceDiv", endpointOptions);
```

<a name="dragOptions"></a>
#### Drag Options
These are options that will be passed through to the supporting library's drag API.  jsPlumb passes everything you supply here through, inserting wrapping functions if necessary for the various lifecycle events that jsPlumb needs to know about.  So if, for example, you pass a function to be called when dragging starts, jsPlumb will wrap that function with a function that does what jsPlumb needs to do, then call yours.

At the time of writing, jsPlumb supports jQuery, as well as having its own built-in support (actually supplied by a bundled library called [Katavorio](https://github.com/jsplumb/katavorio). If you're using jQuery you can supply jQuery drag option as values on the dragOptions; the best drag library to use, though, is Katavorio, which is bundled in vanilla jsPlumb from 1.6.0 onwards: it supports everything jQuery drag supports, as well as multiple scopes and multiple element dragging.

Given that the options here are library-specific, and they are all well-documented, we're going to discuss just the three drag options that behave the same way in all (see below for hoverClass):

- **opacity** - the opacity of an element that is being dragged.  Should be a fraction between 0 and 1 inclusive.
- **zIndex** - the zIndex of an element that is being dragged.
- **scope** - the scope of the draggable.  can only be dropped on a droppable with the same scope.  this is discussed below.

For more information about drag options, take a look at the [Katavorio](https://github.com/jsplumb/katavorio) docs.	
	
<a name="dropOptions"></a>
#### Drop Options
Drop options are treated by jsPlumb in the same way as drag options - they are passed through to the underlying library.  

Here are three common Katavorio droppable options that you might want to consider using:

- **hoverClass** - the CSS class to attach to the droppable when a draggable is hovering over it.
- **activeClass** - the CSS class to attach to the droppable when a draggable is, um, being dragged.
- **scope** - the scope of the draggable.  The draggable can only be dropped on a droppable with the same scope.  This is discussed below.


<a name="dragScope"></a>		
#### Drag and Drop Scope
jsPlumb borrowed the concept of 'scope' from jQuery's drag/drop implementation: the notion of which draggables can be dropped on which droppables.  
In jsPlumb you can provide a 'scope' entry when creating an Endpoint.  Here's the example grey Endpoint example with 'scope' added:

```javascript
var exampleGreyEndpointOptions = {
  endpoint:"Rectangle",
  paintStyle:{ width:25, height:21, fill:"#666" },
  isSource:true,
  connectionStyle : { stroke:"#666" },
  isTarget:true,
  scope:"exampleGreyConnection"
};
```
		
If you do not provide a 'scope' entry, jsPlumb uses a default scope.  Its value is accessible through this method:

`jsPlumb.getDefaultScope();`

If you want to change it for some reason you can do so with this method:

`jsPlumb.setDefaultScope("mySpecialDefaultScope");`

You can also, should you want to, provide the scope value separately on the drag/drop options, like this:

```javascript
var exampleGreyEndpointOptions = {
  endpoint:"Rectangle",
  paintStyle:{ width:25, height:21, fill:'#666' },
  isSource:true,
  connectionStyle : { stroke:"#666" },
  isTarget:true,
  dragOptions:{ scope:"dragScope" },
  dropOptions:{ scope:"dropScope" }
};
```

<a name="multipleScopes"></a>
##### Multiple Scopes

If you're using vanilla jsPlumb you can assign multiple scopes to some Endpoint, or element configured via `makeSource` or `makeTarget`. To do so, provide the scopes as a space-separated list, as you would with CSS classes:

```javascript
var exampleGreyEndpointOptions = {
  endpoint:"Rectangle",
  paintStyle:{ width:25, height:21, fill:"#666" },
  isSource:true,
  connectionStyle : { stroke:"#666" },
  isTarget:true,
  scope:"foo bar baz"
};
```

<a name="setScope"></a>
##### Changing the scope(s) of a source or target element

jsPlumb offers a few methods for changing the scope(s) of some element configured via `makeSource` or `makeTarget`:

- `setScope(el, scopeString)` Sets both the source _and_ target scope(s) for the given element.
- `setSourceScope(el, scopeString)` Sets the source scope(s) for the given element.
- `setTargetScope(el, scopeString)` Sets both the target scope(s) for the given element.

<a name="disconnectreconnect"></a>

#### Disconnecting and Reconnecting

By default, jsPlumb will allow you to detach connections from either Endpoint by dragging (assuming the Endpoint allows it; 
Blank Endpoints, for example, have nothing you can grab with the mouse). If you then drop a Connection you have dragged 
off an Endpoint, the Connection will be detached. This behaviour can be controlled using the `detachable` and `reattach` 
parameters, or their equivalents in the jsPlumb Defaults.

Some examples should help explain:	  

- Create a Connection that is detachable using the mouse, from either Endpoint, and which does not reattach:

`jsPlumb.connect({ source:"someElement", target:"someOtherElement" });`


- Create a Connection that is not detachable using the mouse:

`jsPlumb.connect({ source:"someElement", target:"someOtherElement", detachable:false });`

- Create a Connection that is detachable using the mouse and which reattaches on drop:

`jsPlumb.connect({ source:"someElement", target:"someOtherElement", reattach:true });`

This behaviour can also be controlled using jsPlumb defaults:

```javascript
jsPlumb.importDefaults({
  ConnectionsDetachable:true,
  ReattachConnections:true
});
```

The default value of ConnectionsDetachable is **true**, and the default value of ReattachConnections is **false**, so 
in actual fact those defaults are kind of pointless. But you probably get the idea.

##### Setting detachable/reattach on Endpoints

Endpoints support the `detachable` and `reattach` parameters too. If you create an Endpoint and mark `detachable:false`, 
then all Connections made from that Endpoint will not be detachable.  However, since there are two Endpoints involved in 
any Connection, jsPlumb takes into account the `detachable` and `reattach` parameters from both Endpoints when establishing 
a Connection. If either Endpoint declares either of these values as true, jsPlumb assumes the value to be true.  It is 
possible that in a future version of jsPlumb the concepts of detachable and reattach could be made more granular, through the
introduction of parameters like `sourceDetachable`/`targetReattach` etc.

##### Dropping a dragged Connection on another Endpoint

If you drag a Connection from its target Endpoint you can then drop it on another suitable target Endpoint - suitable 
meaning that it is of the correct scope and it is not full.  If you try to drop a Connection on another target that is full, 
the drop will be aborted and then the same rules will apply as if you had dropped the Connection in whitespace: if 
`reattach` is set, the Connection will reattach, otherwise it will be removed.

You can drag a Connection from its source Endpoint, but you can only drop it back on its source Endpoint - if you try 
to drop it on any other source or target Endpoint jsPlumb will treat the drop as if it happened in whitespace. Note 
that there is an issue with the `hoverClass` parameter when dragging a source Endpoint: target Endpoints are assigned the 
hover class, as if you could drop there. But you cannot; this is caused by how jsPlumb uses the underlying library's 
drag and drop, and is something that will be addressed in a future release.
	

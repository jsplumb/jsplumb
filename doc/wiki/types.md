## Connection and Endpoint Types

1. [Introduction](#intro)
- [Connection Types](#connection-type)
- [Parameterized Connection Types](#parameterized-connection-type)
- [Endpoint Types](#endpoint-type)
- [Parameterized Endpoint Types](#parameterized-endpoint-type)
- [Reapplying Types](#reapplying)
- [Fluid Interface](#fluid)

### Introduction

A Type is a collection of attributes such as paint style, hover paint style, overlays etc - it is a subset, including most but not all, of the parameters you can set in an Endpoint or Connection definition. It also covers behavioural attributes such as `isSource` or `maxConnections` on Endpoints.

An Endpoint or Connection can have zero or more Types assigned; they are merged as granularly as possible, in the order in which they were assigned. There is a supporting API with these methods:

- **hasType**
- **addType**
- **removeType**
- **toggleType**
- **setType**
- **clearTypes**

and each of these methods (except `hasType`) takes a space-separated string so you can add several at once.  Support for 
these methods has been added to the `jsPlumb.select` and `jsPlumb.selectEndpoint` methods, and you can also now 
specify a `type` parameter to an Endpoint or Connection at create time.

Types are a useful tool when you are building a UI that has connections whose appearance change under certain circumstances, 
or a UI that has various types of connections etc. 

<a name="connection-type"></a>
### Connection Type
Probably the easiest way to explain Types is with some code. In this snippet, we'll register a Connection Type on jsPlumb, 
create a Connection, and then assign the Type to it:

```javascript
jsPlumb.registerConnectionType("example", {
  paintStyle:{ stroke:"blue", strokeWidth:5  },
  hoverPaintStyle:{ stroke:"red", strokeWidth:7 }
});

var c = jsPlumb.connect({ source:"someDiv", target:"someOtherDiv" });
c.bind("click", function() {
  c.setType("example");
});	
```

Another example - a better one, in fact.  Say you have a UI in which you can click to select or deselect Connections, 
and you want a different appearance for each state.  Connection Types to the rescue!

```javascript
jsPlumb.registerConnectionTypes({
  "basic": {
    paintStyle:{ stroke:"blue", strokeWidth:5  },
    hoverPaintStyle:{ stroke:"red", strokeWidth:7 },
    cssClass:"connector-normal"
  },
  "selected":{
    paintStyle:{ stroke:"red", strokeWidth:5 },
    hoverPaintStyle:{ strokeWidth: 7 },
    cssClass:"connector-selected"
  }	
});
    
var c = jsPlumb.connect({ source:"someDiv", target:"someOtherDiv", type:"basic" });
    
c.bind("click", function() {
  c.toggleType("selected");
});
```

Notice here how we used a different method -`registerConnectionTypes` - to register a few Types at once.

Notice also the `hoverPaintStyle` for the `selected` Type: it declares only a `strokeWidth`.  As mentioned above, Types 
are merged with as much granularity as possible, so that means that in this case the `strokeWidth` value from `selected` 
will be merged into the `hoverPaintStyle` from `basic`, and voila, red, 7 pixels.

These examples, of course, use the `jsPlumb.connect` method, but in many UIs Connections are created via drag and drop.  
How would you assign that `basic` Type to a Connection created with drag and drop?  You provide it as the Endpoint's 
`connectionType` parameter, like so:

```javascript
var e1 = jsPlumb.addEndpoint("someDiv", {
  connectionType:"basic",
  isSource:true
});	

var e2 = jsPlumb.addEndpoint("someOtherDiv", {
  isTarget:true
});
		
//... user then perhaps drags a connection...or we do it programmatically:
    	
var c = jsPlumb.connect({ source:e1, target:e2 });
    	
// now c has type 'basic'
console.log(c.hasType("basic));   // -> true
```

Note that the second Endpoint we created did not have a `connectionType` parameter - we didn't need it, as the source 
Endpoint in the Connection had one.  But we could have supplied one, and jsPlumb will use it, but only if the source 
Endpoint has not declared `connectionType`.  This is the same way jsPlumb treats other Connector parameters such as 
`paintStyle` etc - the source Endpoint wins.

##### Supported Parameters in Connection Type objects
Not every parameter from a Connection's constructor is supported in a Connection Type - as mentioned above, Types act 
pretty much like CSS classes, so the things that are supported are related to behaviour or appearance (including 
the ability to set CSS classes on the UI artefacts). For instance, `source` is not supported: it indicates the source 
element for some particular Connection and therefore does not make sense inside a type specification: you cannot 
make a Connection Type that is fixed to a specific source element. Here's the full list of supported properties in 
Connection Type objects:

- **anchor** Anchor specification to use for both ends of the Connection.
- **anchors** Anchor specifications to use for each end of the Connection.
- **detachable** - whether or not the Connection is detachable using the mouse
- **paintStyle**
- **hoverPaintStyle**
- **scope** - remember, Connections support a single scope. So if you have multiple Types applied, you will get the scope 
from the last Type that defines one.
- **cssClass** a class to set on the element used to render the Connection's connector.  Unlike with `scope`, when 
multiple types assign a CSS class, the UI artefact gets all of them written to it.
- **parameters** - when you add/set a Type that has parameters, any existing parameters with the same keys will be 
overwritten. When you remove a Type that has parameters, its parameters are NOT removed from the Connection.
- **overlays** - when you have multiple types applied to a Connection, you get the union of all the Overlays defined 
across the various Types. **Note** when you create a Connection using jsPlumb.connect and you provide a 'type', that 
is equivalent to calling 'addType': you will get the Overlays defined by the Type(s) you set as well as any others you 
have provided to the constructor.
- **endpoint** Only works with a type applied to a new Connection.  But very useful for that particular use case.

<a name="parameterized-connection-type"></a>
##### Parameterized Connection Types
Connection Types support parameterized values - values that are derived at runtime by some object you supply. Here's 
the first example from above, with a parameterized value for `stroke`:

```javascript
jsPlumb.registerConnectionType("example", {
  paintStyle:{ stroke:"${color}", strokeWidth:5  },
  hoverPaintStyle:{ stroke:"red", strokeWidth:7 }
});

var c = jsPlumb.connect({ source:"someDiv", target:"someOtherDiv" });
  c.bind("click", function() {
    c.setType("example", { color:"blue" });
});	
```

`setType`, `addType` and `toggleType` all now support this optional second argument.  

You can also use a parameterized Type in a `jsPlumb.connect` call, by supplying a `data` value:

```javascript
jsPlumb.registerConnectionType("example", {
  paintStyle:{ stroke:"${color}", strokeWidth:5  },
  hoverPaintStyle:{ stroke:"red", strokeWidth:7 }
});

var c = jsPlumb.connect({ 
  source:"someDiv", 
  target:"someOtherDiv",
  type:"example",
  data:{ color: "blue" }
});
```

Here are a few examples showing you the full Type API:

```javascript
jsPlumb.registerConnectionTypes({
  "foo":{ paintStyle:{ stroke:"yellow", strokeWidth:5, cssClass:"foo" } },
  "bar":{ paintStyle:{ stroke:"blue", strokeWidth:10 } },
  "baz":{ paintStyle:{ stroke:"green", strokeWidth:1, cssClass:"${clazz}" } },
  "boz":{ paintStyle: { stroke:"${color}", strokeWidth:"${width}" } }
});
	
var c = jsPlumb.connect({ 
  source:"someDiv", 
  target:"someOtherDiv", 
  type:"foo" 
});
	
// see what types the connection has.  
console.log(c.hasType("foo"));  // -> true
console.log(c.hasType("bar"));  // -> false
    	
// add type 'bar'
c.addType("bar");
    	
// toggle both types (they will be removed in this case)
c.toggleType("foo bar");
    	
// toggle them back
c.toggleType("foo bar");
    	
// getType returns a list of current types.
console.log(c.getType()); // -> [ "foo", "bar" ]
    	
// set type to be 'baz' only
c.setType("baz");
    	
// add foo and bar back in
c.addType("foo bar");
    	
// remove baz and bar
c.removeType("baz bar");
    	
// what are we left with? good old foo.
console.log(c.getType()); // -> [ "foo" ]
    	
// now let's add 'boz', a parameterized type
c.addType("boz", {
  color:"#456",
  width:35
});

console.log(c.getType()); // -> [ "foo", "boz" ]

// now clear all types
c.clearTypes();

console.log(c.getType()); // -> [  ]
```

Things to note here are that every method **except hasType** can take a space-delimited list of Types to work with. So 
types work like CSS classes, basically. I think I might have mentioned that already though.

<a name="endpoint-type"></a>
### Endpoint Type
Endpoints can also be assigned one or more Types, both at creation and programmatically using the API discussed above.

The only real differences between Endpoint and Connection Types are the allowed parameters.  Here's the list for Endpoints:

- **paintStyle**
- **endpointStyle** - If this and `paintStyle` are provided, this takes precedence
- **hoverPaintStyle**
- **endpointHoverStyle** - If this and `hoverPaintStyle` are provided, this takes precedence
- **maxConnections**
- **connectorStyle** - paint style for any Connections that use this Endpoint.
- **connectorHoverStyle** - hover paint style for Connections from this Endpoint.
- **connector** - a Connector definition, like `StateMachine`, or `[ "Flowchart", { stub:50 } ]`
- **connectionType** - This allows you to specify the Connection Type for Connections made from this Endpoint.
- **scope** - remember, Endpoints support a single scope. So if you have multiple Types applied, you will get the scope 
from the last Type that defines one.
- **cssClass** - This works the same as CSS class for Connections: any class assigned by any active type will be written 
to the UI artefact.
- **parameters** - when you add/set a Type that has parameters, any existing parameters with the same keys will be 
overwritten. When you remove a Type that has parameters, its parameters are NOT removed from the Connection.
- **overlays** - when you have multiple Types applied to an Endpoint, you get the union of all the Overlays defined 
across the various types.

**Note** There are two sets of parameters you can use to set paint styles for Endpoints - `endpointStyle`/`endpointHoverStyle` and `paintStyle`/`hoverPaintStyle`.  The idea behind this is that when you use the `endpoint..` versions, you can use a single object to define a Type that is shared between Endpoints and Connectors.
	
One thing to be aware of is that the parameters here that are passed to Connections are only passed from a source Endpoint, not targets. Here's an example of using Endpoint Types:

```javascript
jsPlumb.registerEndpointTypes({
  "basic":{			
    paintStyle:{fill:"blue"}
  },
  "selected":{			
    paintStyle:{fill:"red"}
  }
});
  
var e = jsPlumb.addEndpoint("someElement", {
  anchor:"TopMiddle",
  type:"basic"
});
    
e.bind("click", function() {
  e.toggleType("selected");
});
```

So it works the same way as Connection Types.  There are several parameters allowed by an Endpoint Type that affect 
Connections coming from that Endpoint. Note that this does not affect existing Connections.  It affects only Connections 
that are created after you set the new Type(s) on an Endpoint.

<a name="parameterized-endpoint-type"></a>
### Parameterized Endpoint Types
You can use parameterized Types for Endpoints just as you can Connections:

```javascript
jsPlumb.registerEndpointType("example", {
  paintStyle:{ fill:"${color}"}
});

var e = jsPlumb.addEndpoint("someDiv", { 
  type:"example",
  data:{ color: "blue" }
});
```
    
<a name="reapplying"></a>
##### Reapplying Types   
If you have one or more parameterized Types set on some object and you wish for them to change to reflect a change in 
their underlying data, you can use the `reapplyTypes` function:

```javascript
jsPlumb.registerConnectionType("boz",{ 
  paintStyle: { 
    stroke:"${color}", 
    strokeWidth:"${width}" 
  } 
});

var c = jsPlumb.connect({ source:"s", target:"t" });
c.addType("boz",{ color:"green", width:23 });
    
    .. things happen ..
    
c.reapplyTypes({ color:"red", width:0 });
```

`reapplyTypes` applies the new parameters to the merged result of all Types currently set on an object.

<a name="fluid"></a>
#### Fluid Interface
As mentioned previously, all of the Type operations are supported by the `select` and `selectEndpoints` methods.

So you can do things like this:

```javascript
jsPlumb.selectEndpoints({
  scope:"terminal"
}).toggleType("active");
    	
jsPlumb.select({
  source:"someElement"
}).addType("highlighted available");	
```

Obviously, in these examples, `available` and `highlighted` would have previously been registered on jsPlumb using the 
appropriate register methods.

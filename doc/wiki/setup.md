## Required Imports and Basic Setup

I strongly encourage you to read this entire page. There are a few things you need to know about integrating jsPlumb with your UI.

  1. [Browser Compatibility](#browser)
  - [Setup](#setup)
  - [Required Imports](#imports)
  - [Initializing jsPlumb](#initializing)
  - [Multiple jsPlumb Instances](#multiple)
  - [Z-Index Considerations](#zindex)
  - [Where does jsPlumb add elements?](#container)
  - [Element Dragging](#dragging)
  - [Performance](#performance)

<a name="browser"></a>
### Browser Compatibility
jsPlumb runs on everything from IE6 up.  There are some caveats, though, because of various browser/library bugs:
                
  - jQuery 1.6.x and 1.7.x have a bug in their SVG implementation for IE9 that causes hover events to not get fired.
  - jQuery 2.0 does not support 6,7 or 8.
  - Safari 5.1 has an SVG bug that prevents mouse events from being passed through the transparent area of an SVG element (Safari 6.x does not seem to have the same problem)                

<a name="setup"></a>
### Setup
<a name="imports"></a>
#### Required Imports
##### jQuery
- jQuery 1.3.x or higher. jsPlumb has been tested with everything up to 2.x.
- jQuery UI 1.7.x or higher (if you wish to support drag and drop). Always remember to check that the versions of jQuery and jQuery UI you are using are compatible.
  
<pre>&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript" src="PATH_TO/jquery.jsPlumb-1.5.0-all-min.js "&gt;&lt;/script&gt;
</pre>			

###### Touch Events
jQuery <= 1.9.x does not support touch events, but there is a neat plugin you can use for this - [jQuery UI Touch Punch](http://touchpunch.furf.com/).  You need to include it in your page after both jQuery and jQueryUI. But note that it doesn't work properly with the `makeSource` method...better to use vanilla jsPlumb!
			
<a name="initializing"></a>
#### Initializing jsPlumb

You should not start making calls to jsPlumb until the DOM has been initialized - perhaps no surprises there.  To handle this, you should bind to the `ready` event on jsPlumb (or the instance of jsPlumb you are working with):			

```javascript
jsPlumb.bind("ready", function() {
...			
// your jsPlumb related init code goes here
...
});
```

There's a helper method that can save you a few precious characters:

```
jsPlumb.ready(function() {
...
// your jsPlumb related init code goes here
...
});
``` 
    
If you bind to the `ready` event after jsPlumb has already been initialized, your callback will be executed immediately.

<a name="multiple"></a>
#### Multiple jsPlumb instances
jsPlumb is registered on the browser's Window by default, providing one static instance for the whole page to use.  Should you need to, though, you can instantiate independent instances of jsPlumb, using the `getInstance` method, for example:

```javascript
var firstInstance = jsPlumb.getInstance();
```

The variable `firstInstance` can now be treated exactly as you would treat the `jsPlumb` variable - you can set defaults, call the `connect` method, whatever:

```javascript
firstInstance.importDefaults({
  Connector : [ "Bezier", { curviness: 150 } ],
  Anchors : [ "TopCenter", "BottomCenter" ]
});

firstInstance.connect({
  source:"element1", 
  target:"element2", 
  scope:"someScope" 
});
```

`getInstance` optionally takes an object that provides the defaults:

```javascript
var secondInstance = jsPlumb.getInstance({
  PaintStyle:{ 
    lineWidth:6, 
    strokeStyle:"#567567", 
    outlineColor:"black", 
    outlineWidth:1 
  },
  Connector:[ "Bezier", { curviness: 30 } ],
  Endpoint:[ "Dot", { radius:5 } ],
  EndpointStyle : { fillStyle: "#567567"  },
  Anchor : [ 0.5, 0.5, 1, 1 ]
});

secondInstance.connect({ source:"element4", target:"element3", scope:"someScope" });
```


<a name="zindex"></a>
#### Z-index Considerations
You need to pay attention to the z-indices of the various parts of your UI when using jsPlumb, in particular to ensure that the elements that jsPlumb adds to the DOM do not overlay other parts of the interface. 

jsPlumb adds an element to the DOM for each Endpoint, Connector and Overlay. So for a connection having visible Endpoints at each end and a label in the middle, jsPlumb adds four elements to the DOM.

To help you organise z-indices correctly, jsPlumb adds a CSS class to each type of element it adds. They are as follows:
		
<table style="color:black;font-size:90%;">
  <tr><td><strong>Component</strong></td><td><strong>Class</strong></td></tr>
  <tr><td>Endpoint</td><td>jsplumb-endpoint</td></tr>
  <tr><td>Connector</td><td>jsplumb-connector</td></tr>
  <tr><td>Overlay</td><td>jsplumb-overlay</td></tr>
</table>            
                            
In addition, whenever the mouse is hovering over an Endpoint or Connection, that component is assigned the class `jsplumb-hover`. For more information about styling jsPlumb with CSS, 
see [this page](styling-via-css).

<a name="container"></a>
#### Where does jsPlumb add elements?  	
It's important to understand where in the DOM jsPlumb will add any elements it creates, as it has a bearing on the markup you can use with jsPlumb.
		
Early versions of jsPlumb added everything to the end of the **body** element. This has the advantage of being the most flexible arrangement in terms of supporting which elements can be connected, but in certain use cases produced unexpected results. Consider the arrangement where you have some connected elements in a tab: you would expect jsPlumb to add elements inside the tab, so that when the user switches tabs and the current one is hidden, all the jsPlumb stuff is hidden too.  But when the elements are  on the body, this does not happen!   

For this reason, from 1.3.0 onwards, jsPlumb's default behaviour is to attach Endpoint elements to the parent of the element the Endpoint is attached to (**not** the actual element the Endpoint is attached to), and to attach Connector elements to the parent of the source Endpoint in the Connection. This results in all the elements of the Connection being siblings inside the same parent node, which jsPlumb requires, for various reasons arising from the trade off between doing lots of maths and the performance of the whole thing.

In general, the default behaviour means that you cannot do things like this:

```xml
<body>
    <div id="container0">
        <div id="node0></div>
    </div>
    <div id="container1">
        <div id="node1"></div>
    </div>
</body>

<script type="text/javascript">    
    var e0 = jsPlumb.addEndpoint("node0"),
    e1 = jsPlumb.addEndpoint("node1");

    jsPlumb.connect({ source:e0, target:e1 });
</script>
```

...because the elements created for `e0` and `e1` would have different parent nodes, and an attempt to make a Connection between them would not work.  For the example just given, you would need to register the Endpoints on the `container` divs (and then quite possibly throw away the `node` divs):  		

```xml
<body>
    <div id="container0">
    </div>
    <div id="container1">
    </div>
<body>

<script type="text/javascript">
  var e0 = jsPlumb.addEndpoint("container0"),
      e1 = jsPlumb.addEndpoint("container1");
    jsPlumb.connect({ source:e0, target:e1 });
</script>
```
	
now 'e0' and 'e1' have the same parent - the **body** element. 
	
Remember that you can use the `anchor` parameter to an `addEndpoint` call to specify where on an element you want an Endpoint to appear.  Used in conjunction with CSS classes (discussed below), you can have an Endpoint on top of some element wherever you like. 				

**Note regarding the drawEndpoints option on jsPlumb.connect**: with the default behaviour, jsPlumb uses the offsetParent of the source endpoint in a connection to make final adjustments to the position of a connector. When drawEndpoints is set to false, there is no offsetParent of the source endpoint because it is not visible.  If your connection lies inside some container other than the document body, the connector will not be able to take that container's offset into account, and will most likely not be in the right place.  You should either use the `Blank` endpoint when you don't want to see one, or instruct jsPlumb to attach everything to the document body (see below). 
	
#### Overriding the default behaviour
From version 1.3.3, the `Container` concept was reintroduced into jsPlumb, because there are use cases in which the default behaviour makes it difficult or impossible to build the UI you want. You can instruct jsPlumb to use some element as the parent of everything jsPlumb adds to the UI through usage of the `jsPlumb.Defaults.Container` property, or you can set a `container` parameter on calls to `addEndpoint` or `connect` (if this is set and a default is also set, this default value is actually used.  This may seem counter-intuitive, and could of course be changed if there is feedback from the community that this would be a good idea). 

Some examples:
		
- Set a container to use as the default container, using a jQuery selector (you can supply a selector, element id, or Element here), and then add an Endpoint.  The canvas (or SVG/VML element) created will be a child of the document body:

```javascript
jsPlumb.setContainer($("body"));
...
jsPlumb.addEndpoint(someDiv, { endpoint options });
```
		
- Set a container to use as the default container, using an element id, and then connect two elements.  The elements created in this example will be children of the element with id "containerId":

```javascript
jsPlumb.Defaults.Container = "containerId";
...
jsPlumb.connect({ source:someDiv, target:someOtherDiv });
```
		
- Pass a container to use into a `jsPlumb.connect` call, using a selector.  The elements created in this example will be children of the element with id "containerId":
	
```javascript
jsPlumb.connect({ source:someDiv, target:someOtherDiv, container:$("#containerId") });
```

- Pass a container to use into a `jsPlumb.addEndpoint` call, using an element id. The element created in this example will be a child of the element with id "containerId":		

```javascript
jsPlumb.addEndpoint(someDiv, { ..., container:"containerId" });
```

<a name="dragging"></a>
#### Element Dragging
A common feature of interfaces using jsPlumb is that the elements are draggable.  Unless you absolutely need to configure this behaviour using your library's underlying method, you should use `jsPlumb.draggable`:

```javascript
jsPlumb.draggable("elementId");
```

You can also pass a selector from your library in to this method:

```javascript
jsPlumb.draggable($(".someClass"));
```

This method is just a wrapper for the underlying library's draggable functionality, and there is a two-argument version in which the second argument is passed down to the underlying library (example below).  

##### Drag Containment
A common request is for the ability to contain the area within which an element may be dragged.  Remember that jsPlumb's `draggable` method is just a pass-through to the underlying library's drag functionality, so for jQuery this is as simple as providing a `containment` parameter:

```javascript
jsPlumb.draggable($("someSelector"), {
  containment:"parent"
});
```
   
Right now in vanilla jsPlumb you can use this syntax to constrain dragging to a parent element:

```javascript
jsPlumb.draggable(".someSelector", {
  constrain:true
});
```
 
    
##### Dragging nested elements
jsPlumb takes nesting into account when handling draggable elements. For example, say you have this markup:

```xml
<div id="container">
  <div class="childType1"></div>
  <div class="childType2"></div>
</div>
```

...and then you connect one of those child divs to something, and make "container" draggable:

```javascript
jsPlumb.connect({
    source:$("#container .childType1"),
    target:"somewhere else"
});

jsPlumb.draggable("container");
```

Now when you drag `container`, jsPlumb will have noticed that there are nested elements that have Connections, and they will be updated.  Note that the order of operations is not important here: if `container` was already draggable when you connected one of its children to something, you would get the same result.

###### Nested Element offsets
For performance reasons, jsPlumb caches the offset of each nested element relative to its draggable ancestor. If you make changes to the draggable ancestor that will have resulted in the offset of one or more nested elements changing, you need to tell jsPlumb about it, using the `recalculateOffsets` function.       

This does not apply, though, if you are dragging nested children.  In that case, jsPlumb automatically updates the child offsets after draggings ends - if you used `jsPlumb.draggable` to configure the child elements as draggable.


Consider the example from before, but with a change to the markup after initializing everything:            

```xml
<div id="container">
  <div class="header" style="height:20px;background-color:blue;">header</div>
  <div class="childType1"></div>
  <div class="childType2"></div>
<div>
```

...and then you connect one of those child divs to something, and make "container" draggable:

```javascript
jsPlumb.connect({
  source:$("#container .childType1"),
  target:"somewhere else"
});

jsPlumb.draggable("container");

...

$("#container .header).hide();    // hide the header bar. this will alter the offset of the other child elements...
jsPlumb.recalculateOffsets("container");   // tell jsPlumb that the internal dimensions have changed.
// you can also use a selector, eg $("#container")
```
    
Another setup we have seen in which you will need to call `recalculateOffsets` is when you have some draggable parent that itself contains draggable child nodes:

```xml
<div class="parent">
    <div class="child">child 1</div>
    <div class="child">child 2</div>
</div>
```
    
If you make both `.parent` and `.child` draggable, you need to make a call to `recalculateOffsets` whenever a `.child` node stops dragging:

```javascript
jsPlumb.draggable($(".parent"));
jsPlumb.draggable($(".child"), {
    containment:"parent",
    stop:function() {
        jsPlumb.recalculateOffsets($(this).parent());
    }
});
```javascript
    

<a name="performance"></a>
### Performance
The speed at which jsPlumb executes, and the practical limit to the number of manageable connections, is greatly affected by the browser upon which it is being run.  At the time of writing, it will probably not surprise you to learn that jsPlumb runs fastest in Chrome, followed by Safari/Firefox, and then IE browsers in descending version number order.

#### Suspending Drawing

Every `connect` or `addEndpoint` call in jsPlumb ordinarily causes a repaint of the associated element, which for many cases is what you want.  But if you are performing some kind of "bulk" operation - like loading data on page load perhaps - it is recommended that you suspend drawing before doing so:

```javascript
jsPlumb.setSuspendDrawing(true);
...
- load up all your data here -
...
jsPlumb.setSuspendDrawing(false, true);
```

Notice the second argument in the last call to `setSuspendDrawing`: it instructs jsPlumb to immediately perform a full repaint (by calling, internally, `repaintEverything`).

I said above it is recommended that you do this.  It really is.  It makes an enormous difference to the load time when you're dealing with a lot of Connections on slower browsers.

###### doWhileSuspended
This function abstracts out the pattern of suspending drawing, doing something, and then re-enabling drawing:

```javascript
jsPlumb.doWhileSuspended(fn, [doNotRepaintAfterwards]);
```

Example usage:

```javascript
jsPlumb.doWhileSuspended(function() {
  // import a billion things here
});
```
    
By default, this will run a repaint at the end. But you can suppress that, should you want to:

```javascript
jsPlumb.doWhileSuspended(function() {
  // import a billion things here
}, true);
```
    
**Note** just in case you take it literally, you should probably _not_ attempt to import a billion things into jsPlumb. You may find that performance suffers a little.    

#### Anchor Types
Continuous anchors are the type that require the most maths, because they have to calculate their position every time a paint cycle occurs. 

Dynamic and Perimeter anchors are the next slowest (with Perimeter being slower than most Dynamic Anchors as they are actually Dynamic Anchors that have, by default, 60 locations to choose from).  

Static anchors like `Top`, `Bottom` etc are the fastest.
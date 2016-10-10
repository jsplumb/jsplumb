## Styling via CSS

Using CSS to style the artefacts that jsPlumb creates is a lot more flexible than using `paintStyle` or 
`hoverPaintStyle`. 

On this page we'll first run through the default CSS classes that jsPlumb attaches, followed by a quick explanation 
for how to attach your own, and then we'll discuss how to style SVG.

### Z Index

One thing you can - and should - use CSS for, regardless of the renderer, is z-index. Every Connection, Endpoint and 
Overlay in jsPlumb adds some element to the UI, and you should take care to establish appropriate z-indices for each of 
these, in conjunction with the nodes in your application. 

### Basic CSS classes

By default, jsPlumb adds a specific class to each of the three types of elements it creates (These class names are 
exposed on the jsPlumb object and can be overridden if you need to do so - see the third column in the table) 

<table width="90%" class="table" style="align:left;font-size:12px;">
<tr><th>Component</th><th>CSS Class</th><th>jsPlumb Member</th></tr>
<tr><td>Connector</td><td>jtk-connector</td><td>connectorClass</td></tr>
<tr><td>Connector Outline</td><td>jtk-connector-outline</td><td>connectorOutlineClass (SVG only)</td></tr>
<tr><td>Endpoint</td><td>jtk-endpoint</td><td>endpointClass</td></tr>
<tr><td>Endpoint when full</td><td>jtk-endpoint-full</td><td>endpointFullClass</td></tr>
<tr><td>Overlay</td><td>jtk-overlay</td><td>overlayClass</td></tr>
</table>

In a simple UI, you can set appropriate z-index values for these classes. The jsPlumb demo pages, for instance, 
typically use a class of `.window` for the nodes in each demo page, and the z-index of the UI is controlled with CSS 
rules like this:

```css
.window { z-index:20; }
.jtk-connector { z-index:4; }
.jtk-endpoint { z-index:5; }
.jtk-overlay { z-index:6; }
```

### Interactive CSS Classes
jsPlumb assigns these classes on both Connectors and Endpoints when specific user interactivity occurs:

<table width="90%" class="table" style="align:left;font-size:12px;">
<tr><th>Activity</th><th>CSS Class</th><th>jsPlumb Member</th><th>Description</th></tr>
<tr><td>Mouse Hover</td><td>jtk-hover</td><td>hoverClass</td><td>Assigned to both Connectors and Endpoints when the mouse is hovering over them</td></tr>
<tr><td>Connection Drag</td><td>jtk-dragging</td><td>draggingClass</td><td>Assigned to a Connection when it is being dragged (either a new Connection or an existing Connection)</td></tr>
<tr><td>Element Dragging</td><td>jtk-element-dragging</td><td>elementDraggingClass</td><td>Assigned to all Connections whose source or target element is currently being dragged, and to their Endpoints.</td></tr>
<tr><td>Source Element Dragging</td><td>jtk-source-element-dragging</td><td>sourceElementDraggingClass</td><td>Assigned to all Connections whose source element is being dragged, and to their Endpoints</td></tr>
<tr><td>Target Element Dragging</td><td>jtk-target-element-dragging</td><td>targetElementDraggingClass</td><td>Assigned to all Connections whose target element is being dragged, and to their Endpoints</td></tr>
<tr><td>Anchor Class</td><td>***jtk-endpoint-anchor-***</td><td>endpointAnchorClassPrefix</td><td>Assigned to Endpoints, and their associated elements, that have either a static Anchor with an associated class, or a Dynamic Anchor whose individual locations have an associated CSS class. The `***` suffix in the class name above is the associated class.  Note that this class is added to both the artefact that jsPlumb creates and also the element on which the Endpoint resides, so you will normally have to build a selector with more criteria than just this class in order to target things properly. See the documentation regarding Anchors for a discussion of this.</td></tr>
<tr><td>Drop Allowed on Endpoint</td><td>jtk-endpoint-drop-allowed</td><td>endpointDropAllowedClass</td><td>Assigned to an Endpoint when another Endpoint is hovering over it and a drop would be allowed</td></tr>
<tr><td>Drop Forbidden on Endpoint</td><td>jtk-endpoint-drop-forbidden</td><td>endpointDropForbiddenClass</td><td>Assigned to an Endpoint when another Endpoint is hovering over it and a drop would not be allowed</td></tr>
<tr><td>Connection Hover</td><td>jtk-source-hover</td><td>hoverSourceClass</td><td>Assigned to the source element in a Connection when the mouse is hovering over the Connection</td></tr>
<tr><td>Connection Hover</td><td>jtk-target-hover</td><td>hoverTargetClass</td><td>Assigned to the target element in a Connection when the mouse is hovering over the Connection</td></tr>
<tr><td>Drag</td><td>jtk-drag-select</td><td>dragSelectClass</td><td>Assigned to the document body whenever a drag is in progress. It allows you to ensure document selection is disabled - see [here](home#dragSelection)</td></tr>
<tr><td>Source disable</td><td>jtk-source-disabled</td><td>-</td><td>Assigned to an element that was configured with `makeSource` and was subsequently disabled via `setEnabled(el, false)`.</td></tr>
<tr><td>Target disable</td><td>jtk-target-disabled</td><td>-</td><td>Assigned to an element that was configured with `makeTarget` and was subsequently disabled via `setEnabled(el, false)`.</td></tr>
</table>

**Note** the last two classes work in conjunction with the `checkDropAllowed` interceptor that you can register on 
jsPlumb. For more information about interceptors, see [here](interceptors), but in a nutshell you just provide a 
function that takes the two Endpoints and a Connection as argument, and returns whether not a drop would be allowed:

```javascript
jsPlumb.bind("checkDropAllowed", function(params) {

  // Here you have access to:
  // params.sourceEndpoint
  // params.targetEndpoint
  // params.connection
      
  return true; // or false.  in this case we say drop is allowed.
});
```
    
### Preventing selection while dragging
jsPlumb puts a class on the body that you can use to disable the default browser behaviour of selecting DOM elements 
when dragging:

```css
jtk-drag-select
```
    
A suitable value for this (from the jsPlumb demos) is:

```css
.jtk-drag-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;    
}
```

### Custom CSS Classes

In addition to the default CSS classes, each of the main methods you use to configure Endpoints or make Connections in 
jsPlumb support the following two parameters:

- **cssClass** - class(es) to set on the display elements
- **hoverClass** - class(es) to set on the display elements when in hover mode

In addition, `addEndpoint` and `makeSource` allow you to specify what these classes will be for any Connections that 
are dragged from them:

- **connectorClass** - class(es) to set on the display elements of Connections
- **connectorHoverClass** - class(es) to set on the display elements of Connections when in hover mode

These parameters should be supplied as a String; they will be appended as-is to the class member, so feel free to 
include multiple classes.  jsPlumb won't even know.

### CSS for SVG elements

#### Connections

SVG connections in jsPlumb consist of a parent `svg` element, inside of which there are one or more `path` elements, 
depending on whether or not you have specified an `outlineStyle`.  To target the path element for some connection, you 
need a rule like this:

```css
svg path {
  stroke:red;
}
```
    
Hooking this up to the custom class mechanism, you might do something like this:    

```javascript
jsPlumb.connect({
  source:"someElement",
  target:"someOtherElement",
  cssClass:"redLine"
});
```

CSS:

```css
svg.redLine path {
  stroke:red;
  stroke-width:3;
}
```

You might be thinking to yourself, why have the `svg` and `path` elements in this?  In fact they are perhaps not 
required: they're just there to call out the fact that this is a style on an SVG connector.

#### Endpoints
SVG Endpoints created by jsPlumb consist of a `div`, inside of which is an `svg` parent element, inside of which there 
is some shape, the tag name of which depends on the type of Endpoint:

<table>
  <tr><th>Endpoint Type</th><th>SVG Shape</th></tr>
  <tr><td>Rectangle</td><td>rect</td></tr>
  <tr><td>Dot</td><td>circle</td></tr>
</table>

So you can choose, when writing CSS rules for these, whether or not you specify the shape exactly, or just leave it up 
to a wildcard:

```javascript
jsPlumb.addEndpoint("someElement", {
  cssClass:"aRedEndpoint",
  endpoint:"Dot"
});
```

CSS:

```css
.aRedEndpoint svg circle {
  fill:red;
  stroke:yellow;
}
```

...or:

```css
.aRedEndpoint svg * {
  fill:red;
  stroke:yellow;
}
```

For a full discussion of the properties you can configure on an SVG element via CSS, we refer you to 
[the SVG spec](http://www.w3.org/TR/SVG/styling.html#StylingWithCSS).


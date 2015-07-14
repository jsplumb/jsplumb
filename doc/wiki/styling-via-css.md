## Styling via CSS

Using CSS to style the artefacts that jsPlumb creates is a lot more flexible than using `paintStyle` or `hoverPaintStyle`, but due to the fact that you cannot style things like stroke color or line width in VML, it's only really useful for SVG.  Of course, if you know your users won't be using VML then it's a great choice - and nowadays that is just a question of whether or not you will have any users on versions of IE earlier than 9.

On this page we'll first run through the default CSS classes that jsPlumb attaches, followed by a quick explanation for how to attach your own, and then we'll discuss how to style SVG (and then how you *would* style VML, if it were supported)

### Z Index

One thing you can - and should - use CSS for, regardless of the renderer, is z-index. Every Connection, Endpoint and Overlay in jsPlumb adds some element to the UI, and you should take care to establish appropriate z-indices for each of these, in conjunction with the nodes in your application. 

### Basic CSS classes

By default, jsPlumb adds a specific class to each of the three types of elements it creates (These class names are exposed on the jsPlumb object and can be overridden if you need to do so - see the third column in the table) 

<table width="90%" class="table" style="align:left;font-size:12px;">
<tr><th>Component</th><th>CSS Class</th><th>jsPlumb Member</th></tr>
<tr><td>Connector</td><td>_jsPlumb_connector</td><td>connectorClass</td></tr>
<tr><td>Connector Outline</td><td>_jsPlumb_connector_outline</td><td>connectorOutlineClass (SVG only)</td></tr>
<tr><td>Endpoint</td><td>_jsPlumb_endpoint</td><td>endpointClass</td></tr>
<tr><td>Endpoint when full</td><td>_jsPlumb_endpoint_full</td><td>endpointFullClass</td></tr>
<tr><td>Overlay</td><td>_jsPlumb_overlay</td><td>overlayClass</td></tr>
</table>

In a simple UI, you can set appropriate z-index values for these classes. The jsPlumb demo pages, for instance, typically use a class of `.window` for the nodes in each demo page, and the z-index of the UI is controlled with CSS rules like this:

```css
.window { z-index:20; }
._jsPlumb_connector { z-index:4; }
._jsPlumb_endpoint { z-index:5; }
._jsPlumb_overlay { z-index:6; }
```

### Interactive CSS Classes
jsPlumb assigns these classes on both Connectors and Endpoints when specific user interactivity occurs:

<table width="90%" class="table" style="align:left;font-size:12px;">
<tr><th>Activity</th><th>CSS Class</th><th>jsPlumb Member</th><th>Description</th></tr>
<tr><td>Mouse Hover</td><td>_jsPlumb_hover</td><td>hoverClass</td><td>Assigned to both Connectors and Endpoints when the mouse is hovering over them</td></tr>
<tr><td>Connection Drag</td><td>_jsPlumb_dragging</td><td>draggingClass</td><td>Assigned to a Connection when it is being dragged (either a new Connection or an existing Connection)</td></tr>
<tr><td>Element Dragging</td><td>_jsPlumb_element_dragging</td><td>elementDraggingClass</td><td>Assigned to all Connections whose source or target element is currently being dragged, and to their Endpoints.</td></tr>
<tr><td>Source Element Dragging</td><td>_jsPlumb_source_element_dragging</td><td>sourceElementDraggingClass</td><td>Assigned to all Connections whose source element is being dragged, and to their Endpoints</td></tr>
<tr><td>Target Element Dragging</td><td>_jsPlumb_target_element_dragging</td><td>targetElementDraggingClass</td><td>Assigned to all Connections whose target element is being dragged, and to their Endpoints</td></tr>
<tr><td>Anchor Class</td><td>***_jsPlumb_endpoint_anchor_***</td><td>endpointAnchorClassPrefix</td><td>Assigned to Endpoints, and their associated elements, that have either a static Anchor with an associated class, or a Dynamic Anchor whose individual locations have an associated CSS class. The `***` suffix in the class name above is the associated class.  Note that this class is added to both the artefact that jsPlumb creates and also the element on which the Endpoint resides, so you will normally have to build a selector with more criteria than just this class in order to target things properly. See the documentation regarding Anchors for a discussion of this.</td></tr>
<tr><td>Drop Allowed on Endpoint</td><td>_jsPlumb_endpoint_drop_allowed</td><td>endpointDropAllowedClass</td><td>Assigned to an Endpoint when another Endpoint is hovering over it and a drop would be allowed</td></tr>
<tr><td>Drop Forbidden on Endpoint</td><td>_jsPlumb_endpoint_drop_forbidden</td><td>endpointDropForbiddenClass</td><td>Assigned to an Endpoint when another Endpoint is hovering over it and a drop would not be allowed</td></tr>
<tr><td>Connection Hover</td><td>_jsPlumb_source_hover</td><td>hoverSourceClass</td><td>Assigned to the source element in a Connection when the mouse is hovering over the Connection</td></tr>
<tr><td>Connection Hover</td><td>_jsPlumb_target_hover</td><td>hoverTargetClass</td><td>Assigned to the target element in a Connection when the mouse is hovering over the Connection</td></tr>
<tr><td>Drag</td><td>_jsPlumb_drag_select</td><td>dragSelectClass</td><td>Assigned to the document body whenever a drag is in progress. It allows you to ensure document selection is disabled - see [here](home#dragSelection)</td></tr>
</table>

**Note** the last two classes work in conjunction with the `checkDropAllowed` interceptor that you can register on jsPlumb. For more information about interceptors, see [[here|interceptors]], but in a nutshell you just provide a function that takes the two Endpoints and a Connection as argument, and returns whether not a drop would be allowed:

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
jsPlumb puts a class on the body that you can use to disable the default browser behaviour of selecting DOM elements when dragging:

```css
_jsPlumb_drag_select
```
    
A suitable value for this (from the jsPlumb demos) is:

```css
._jsPlumb_drag_select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;    
}
```

### Custom CSS Classes

In addition to the default CSS classes, each of the main methods you use to configure Endpoints or make Connections in jsPlumb support the following two parameters:

- **cssClass** - class(es) to set on the display elements
- **hoverClass** - class(es) to set on the display elements when in hover mode

In addition, addEndpoint and makeSource allow you to specify what these classes will be for any Connections that are dragged from them:

- **connectorClass** - class(es) to set on the display elements of Connections
- **connectorHoverClass** - class(es) to set on the display elements of Connections when in hover mode

These parameters should be supplied as a String; they will be appended as-is to the class member, so feel free to include multiple classes.  jsPlumb won't even know.

### CSS for SVG elements

#### Connections

SVG connections in jsPlumb consist of a parent `svg` element, inside of which there are one or more `path` elements, depending on whether or not you have specified an `outlineStyle`.  To target the path element for some connection, you need a rule like this:

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

You might be thinking to yourself, why have the `svg` and `path` elements in this?  In fact they are perhaps not required: they're just there to call out the fact that this is a style on an SVG connector.

#### Endpoints
SVG Endpoints created by jsPlumb consist of a `div`, inside of which is an `svg` parent element, inside of which there is some shape, the tag name of which depends on the type of Endpoint:

<table>
  <tr><th>Endpoint Type</th><th>SVG Shape</th></tr>
  <tr><td>Rectangle</td><td>rect</td></tr>
  <tr><td>Dot</td><td>circle</td></tr>
</table>

So you can choose, when writing CSS rules for these, whether or not you specify the shape exactly, or just leave it up to a wildcard:

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

For a full discussion of the properties you can configure on an SVG element via CSS, I refer you to [the SVG spec](http://www.w3.org/TR/SVG/styling.html#StylingWithCSS).


### CSS for VML elements
VML does not really support styling via CSS.  There are some properties you can set, but these are typically things that are under jsPlumb's control and not something you should mess with.

[The VML spec](http://www.w3.org/TR/NOTE-VML#_Toc416858381) has a brief discussion of styling VML with CSS.  jsPlumb creates a top level `shape` element in VML, inside of which it attaches whatever elements are required for the Endpoint or Connector in question.  This `shape` element would be the thing that you would style via CSS, if it were possible.  But [here's](http://www.w3.org/TR/NOTE-VML#_Toc416858386) a link to the discussion about which properties you can style via CSS.  Note that all the paint type ones are all VML only.

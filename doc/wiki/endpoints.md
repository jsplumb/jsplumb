## Endpoints

An `Endpoint` models the appearance and behaviour of one end of a `Connection`; it delegates its location to an underlying `Anchor`. 

jsPlumb comes with four Endpoint implementations - `Dot`, `Rectangle`, `Blank` and `Image`. You optionally specify Endpoint properties using the `endpoint` parameter in a call to **jsPlumb.connect**, **jsPlumb.addEndpoint**, **jsPlumb.makeSource** or **jsPlumb.makeTarget**.

As with Connectors and Overlays, you specify Endpoints using the syntax described the page on [basic concepts](basic-concepts#definitions).

### Creating an Endpoint

Endpoints are created in a number of different ways:

- when you call `jsPlumb.connect(..)` and pass an element id or DOM element as source/target, a new Endpoint is created and assigned.
- when you call `jsPlumb.addEndpoint(...)` a new Endpoint is created (and returned from the call)
- when you have configured an element using `jsPlumb.makeSource(...)` and subsequently drag a connection from that element, a new Endpoint is created and assigned.

In each of these different cases, the parameters you can use to specify the Endpoint you wish to have created are exactly the same.

### Specifying Endpoint parameters

### Endpoint types

- **Dot** This Endpoint draws a dot on the screen. It supports three constructor parameters:  				 						 
    - `radius` - Optional; defaults to 10 pixels. Defines the radius of the dot.					
    - `cssClass` - Optional.  A CSS class to attach to the element the Endpoint creates.					   
    - `hoverClass` - Optional.  A CSS class to attach to the element the Endpoint creates whenever the mouse is hovering over the element or an attached Connection.					

- **Rectangle** Draws a rectangle. Supported constructor parameters are:
    - `width` Optional; defaults to 20 pixels. Defines the width of the rectangle.
    - `height` Optional; defaults to 20 pixels. Defines the height of the rectangle.
    - `cssClass` Optional.  A CSS class to attach to the element the Endpoint creates.
    - `hoverClass` Optional.  A CSS class to attach to the element the Endpoint creates whenever the mouse is hovering over the element or an attached Connection.

- **Image** Draws an image from a given URL.  This Endpoint supports three constructor parameters:
    - `src` Required.  Specifies the URL of the image to use
    - `cssClass` Optional.  A CSS class to attach to the element the Endpoint creates.
    - `hoverClass` Optional.  A CSS class to attach to the element the Endpoint creates whenever the mouse is hovering over the element or an attached Connection.

- **Blank** Does not draw anything visible to the user.  This Endpoint is probably not what you want if you need your users to be able to drag existing Connections - for that, use a Rectangle or Dot Endpoint and assign to it a CSS class that causes it to be transparent.

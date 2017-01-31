## Configuring Defaults

The easiest way to set a look and feel for your plumbing is to override the defaults that jsPlumb uses. If you do not do this you are forced to provide your overridden values on every call.  Every argument to the `connect` and `addEndpoint` methods has an associated default value in jsPlumb.

The defaults that ship with jsPlumb are stored in `jsPlumb.Defaults`, which is a Javascript object.  Valid entries, and their initial values, are:

```javascript
Anchor : "BottomCenter",
Anchors : [ null, null ],
ConnectionsDetachable   : true,
ConnectionOverlays  : [],
Connector : "Bezier",
Container : null,
DoNotThrowErrors  : false,
DragOptions : { },
DropOptions : { },
Endpoint : "Dot",
Endpoints : [ null, null ],
EndpointOverlays : [ ],
EndpointStyle : { fill : "#456" },
EndpointStyles : [ null, null ],
EndpointHoverStyle : null,
EndpointHoverStyles : [ null, null ],
HoverPaintStyle : null,
LabelStyle : { color : "black" },
LogEnabled : false,
Overlays : [ ],
MaxConnections : 1,
PaintStyle : { strokeWidth : 8, stroke : "#456" },
ReattachConnections : false,
RenderMode : "svg",
Scope : "jsPlumb_DefaultScope"
```

Note that in `EndpointHoverStyle`, the default `fill` is **null**.  This instructs jsPlumb to use the `stroke` from the attached Connector's hover style to fill the Endpoint.

Note also that you can specify either or both (or neither) of `EndpointStyle` and `EndpointStyles`.  This allows you to specify a different
style for each Endpoint in a Connection.  `Endpoint` and `Endpoints` use the same concept.  jsPlumb will look first in the
individual `Endpoint`/`EndpointStyle` arrays, and then fall back to the single default version.

You can override these defaults by using the `importDefaults` method:

```javascript
jsPlumb.importDefaults({
  PaintStyle : {
    strokeWidth:13,
    stroke: 'rgba(200,0,0,0.5)'
  },
  DragOptions : { cursor: "crosshair" },
  Endpoints : [ [ "Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ],
  EndpointStyles : [{ fill:"#225588" }, { fill:"#558822" }]
});
```

...after the jsPlumb script has been loaded of course!  Here we have specified the following default behaviour:

- connectors are 13 pixels wide and painted with a semi-transparent red line
- when dragging an element the crosshair cursor is used
- the source endpoint is a dot of radius 7; the target endpoint is a dot of radius 11
- the source endpoint is blue; the target endpoint is green

##### Explanation of each Default setting

  - **Anchor**  - this will be used as the Anchor for any Endpoint for which no Anchor is declared - this applies to both the source and/or target of any Connection.
                                                                                                    
  - **Anchors** - default source and target Anchors for Connections.

  - **Connector** - The default Connector to use.

  - **ConnectionsDetachable** - Whether or not Connections are detachable by default using the mouse.

  - **Container** - The element to use as the parent for all artefacts added by jsPlumb. You cannot set this using `importDefaults` - it will only be honoured when you provide it in the defaults you pass to a `getInstance` call.  To change the container after instantiating an instance of jsPlumb, use `setContainer`. See [here](home#container) for a discussion of the container concept.

  - **DoNotThrowErrors** - Whether or not jsPlumb will actually throw an exception if an Anchor, Endpoint or Connector that does not exist is requested.

  - **ConnectionOverlays** - Default Overlays to attach to every Connection

  - **DragOptions**  - Default options with which to configure any element made draggable with `jsPlumb.draggable`

  - **DropOptions** - Default options with which to configure the droppable behaviour of any target Endpoint.

  - **Endpoint** - The default Endpoint definition. Will be used whenever an Endpoint is added or otherwise created and jsPlumb has not been given any explicit Endpoint definition.

  - **Endpoints** - Default source and target Endpoint definitions for use with `jsPlumb.connect`.

  - **EndpointOverlays** - Default Overlays to attach to every Endpoint.

  - **EndpointStyle** - Default appearance of an Endpoint.

  - **EndpointStyles** - Default appearance of the source and target Endpoints in a Connection

  - **EndpointHoverStyle** - Default appearance of an Endpoint in hover state.

  - **EndpointHoverStyles** - Default appearance of the source and target Endpoints in a Connection in hover state.

  - **HoverPaintStyle** - Default appearance of a Connection in hover state.

  - **LabelStyle** - Default style for a Label. **Deprecated**: use CSS for this instead.

  - **LogEnabled** - Whether or not jsPlumb's internal logging is switched on.

  - **Overlays** - Default Overlays to add to both Connections and Endpoints

  - **MaxConnections** - The default maximum number of Connections any given Endpoint supports.

  - **PaintStyle** - The default appearance of a Connector

  - **ReattachConnections** - Whether or not to reattach Connections that were detached using the mouse and then neither reconnected to their original Endpoint nor connected to some other Endpoint.

  - **RenderMode** - The default render mode. 

  - **Scope** - The default scope of Endpoints and Connections. Scope provides a rudimentary control over which Endpoints can be connected to which other Endpoints.
  

#### Providing defaults to jsPlumb.getInstance

When you create a new instance of jsPlumb via `jsPlumb.getInstance` you can provide defaults for that instance as a constructor parameter - here's how we'd create a new instance using the same default values as the example above:

```javascript
jsPlumb.getInstance({
  PaintStyle : {
    strokeWidth:13,
    stroke: 'rgba(200,0,0,100)'
  },
  DragOptions : { cursor: "crosshair" },
  Endpoints : [ [ "Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ],
  EndpointStyles : [
    { fill:"#225588" }, 
    { fill:"#558822" }
  ]
});
```

## Connectors
Connectors are the lines that actually join elements of the UI.  jsPlumb has four connector implementations - a straight 
line, a Bezier curve, "flowchart", and "state machine".  The default connector is the Bezier curve.

You optionally specify a Connector by setting the `connector` property on a call to `jsPlumb.connect`, 
`jsPlumb.addEndpoint(s)`, `jsPlumb.makeSource` or `jsPlumb.makeTarget`. If you do not supply a value for `connector`, 
the default will be used.

You specify Connectors using the syntax described in
[Connector, Endpoint, Anchor & Overlay Definitions](basic-concepts#definitions). Allowed constructor values for each 
Connector type are described below.


- **Bezier** Provides a cubic Bezier path between the two Endpoints. It supports a single constructor argument:
    - `curviness` - Optional; defaults to 150. This defines the distance in pixels that the Bezier's control points are 
    situated from the anchor points.  This does not mean that your Connector will pass through a point at this distance 
    from your curve.  It is a hint to how you want the curve to travel. Rather than discuss Bezier curves at length 
    here, we refer you to [Wikipedia](http://en.wikipedia.org/wiki/B%C3%A9zier_curve).
			
- **Straight** Draws a straight line between the two endpoints. Two constructor arguments are supported:

    - `stub` - Optional, defaults to 0. Any positive value for this parameter will result in a stub of that length 
    emanating from the Endpoint before the straight segment connecting to the other end of the connection.
    - `gap` - Optional, defaults to 0. A gap between the endpoint and either the start of the stub or the segment 
        connecting to the other endpoint.

- **Flowchart** Draws a connection that consists of a series of vertical or horizontal segments - the classic flowchart 
look. Four constructor arguments are supported:
    - `stub` - this is the minimum length, in pixels, of the initial stub that emanates from an Endpoint.  This is an 
    optional parameter, and can be either an integer, which specifies the stub for each end of the Connector, or an 
    array of two integers, specifying the stub for the [source, target] endpoints in the Connection.  Defaults to an 
    integer with value 30 pixels.
    - `alwaysRespectStubs` - optional, defaults to false. This parameter instructs jsPlumb to always paint a line of 
    the specified stub length out of each Endpoint, instead of reducing the stubs automatically if the two elements are 
    closer than the sum of the two stubs.
    - `gap` - optional, defaults to 0 pixels. Lets you specify a gap between the end of the Connector and the elements 
    to which it is attached.
    - `midpoint` - optional, defaults to 0.5. This is the distance between the two elements that the longest section 
    of the flowchart connector will be drawn at.  This parameter is useful for those cases where you have programmatic 
    control of the drawing and perhaps want to avoid some other element on the page.
    - `cornerRadius` Defaults to 0. A positive value for this parameter will result in curved corner segments.
    
This Connector supports Connections that start and end on the same element ("loopback" connections).

- **State Machine** draws slightly curved lines (they are actually quadratic Bezier curves), similar to the State 
Machine connectors you may have seen in software like GraphViz.  Connections in which some element is both the 
source and the target ("loopback") are supported by these Connectors (as they are with Flowchart Connectors); in 
this case you get a circle. Supported constructor parameters are:

    - `margin` - Optional; defaults to 5.  Defines the distance from the element that the Connector begins/ends.
			
    - `curviness` - Optional, defaults to 10.  This has a similar effect to the curviness parameter on Bezier curves.
                  
    - `proximityLimit` - Optional, defaults to 80.  The minimum distance between the two ends of the Connector before 
    it paints itself as a straight line rather than a quadratic Bezier curve.
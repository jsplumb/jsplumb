
/**
* Parent for all Connector types. When you provide a Connector definition to an appropriate jsPlumb method,
* you can do so either as a `String`, or as an Array of the form `[String, Object]`.  In the former case, the String
* must be one of the members from this namespace, such as `"Bezier"` or `"StateMachine"`. In the latter case,
* the first argument to the array is the Connector name, and the second is a JS object containing 
* constructor parameters for the Connector, for instance
*
* 
*    `[ "Bezier", { curviness:75 } ]`
*
*
* Each Connector type supports its own set of parameters, with some parameters (such as stub) being shared by most.
* @class Connector
*/

/**
* The Connector's associated DOM element.
* @property canvas
* @type {Element}
*/

/**
* Provides `Flowchart` connectors.
* @class Connectors.Flowchart
* @constructor 
* @param {Object} params Constructor parameters
* @param {Integer|Integer[]} [params.stub=30] Minimum length for the stub at each end of the connector. This can be an integer, giving a value for both ends of the connections, 
* or an array of two integers, giving separate values for each end. 
* @param {Integer} [params.gap=0]  Gap to leave between the end of the connector and the element on which the endpoint resides. if you make this larger than stub then you will see some odd looking behaviour.  
*           Like stub, this can be an array or a single value.
* @param {Float} [params.cornerRadius=0] Optional, defines the radius of corners between segments. Defaults to 0 (hard edged corners).
* @param {Boolean} [params.alwaysRespectStubs=false] Whether or not the connectors should always draw the stub, or, if the two elements
*                       are in close proximity to each other (closer than the sum of the two stubs), to adjust the stubs.
*/

 /**
 * Gets the path inscribed by the connector, as a series of [x,y] points.
 * @method getPath 
 * @return {Array} An array of [x,y] locations.
 */

 /**
 * Provides "state machine" connectors. These are a quadratic bezier curve.
 * @class Connectors.StateMachine
 * @constructor
 * @param {Object} params Constructor parameters. 
 * @param {Float} [params.curviness=10] Measure of how "curvy" the connectors will be.  this is translated as the distance that the
 *                Bezier curve's control point is from the midpoint of the straight line connecting the two
 *              endpoints, and does not mean that the connector is this wide.  The Bezier curve never reaches
 *              its control points; they act as gravitational masses.
 * @param {Integer} [params.margin=5] Distance from element to start and end connectors, in pixels.
 * @param {Integer} [params.proximityLimit=80]  Sets the distance beneath which the elements are consider too close together to bother
 *            with fancy curves.
 * @param {Integer} [params.loopbackRadius=25] The radius of a loopback connector.
 * @param {Boolean} [params.showLoopback=true]   If set to false this tells the connector that it is ok to paint connections whose source and target is the same element with a connector running through the element. The default value for this is true; the connector always makes a loopback connection loop around the element rather than passing through it.
 * @param {String} [params.orientation="clockwise"] Valid values are `"clockwise"` and `"anticlockwise"`. Indicates in which direction a loopback connection should be considered to be travelling.
 */

/**
* The Straight connector draws a simple straight line between the two anchor points.  
* @class Connectors.Straight
* @constructor
* @param {Object} params Constructor parameters.
* @param {Integer} [params.stub=0] Optional distance to travel from each endpoint before making the connection between the two.
* @param {Integer} [params.sourceStub] Optional stub for the source endpoint only.
* @param {Integer} [params.targetStub] Optional stub for the target endpoint only.
* @param {Integer} [params.gap=0] Optional gap to leave between the endpoints and the start of the connector.
* @param {Integer} [params.sourceGap] Optional gap for the source endpoint only.
* @param {Integer} [params.targetGap] Optional gap for the target endpoint only.
*/  

/**
* This Connector draws a Bezier curve with two control points.  You can provide a 'curviness' value which gets applied to jsPlumb's
* internal voodoo machine and ends up generating locations for the two control points.
* @class Connectors.Bezier
* @constructor
* @param {Object} params Constructor parameters.
* @param {Integer} [params.curviness=150] How 'curvy' you want the curve to be! This is a directive for the placement of control points, not endpoints of the curve, so your curve does not 
* actually touch the given point, but it has the tendency to lean towards it.  The larger this value, the greater the curve is pulled from a straight line.
* @param {Integer} [params.stub=0] Optional value for a distance to travel from the connector's endpoint before beginning the Bezier curve.
*/
   	
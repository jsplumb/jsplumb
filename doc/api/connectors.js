
/**
* @doc module
* @name jsPlumb.Connectors.Flowchart
* @description The Flowchart connector.
*/

/**
 * @doc function
 * @name jsPlumb.Connectors.Flowchart.class:constructor 
 * 
 * @param {object} stub Minimum length for the stub at each end of the connector. This can be an integer, giving a value for both ends of the connections, 
 * or an array of two integers, giving separate values for each end. The default is an integer with value 30 (pixels). 
 * @param {object} gap  Gap to leave between the end of the connector and the element on which the endpoint resides. if you make this larger than stub then you will see some odd looking behaviour.  
 *           Like stub, this can be an array or a single value. defaults to 0 pixels for each end.     
 * @param {float} cornerRadius Optional, defines the radius of corners between segments. defaults to 0 (hard edged corners).
 * @param {boolean} alwaysRespectStubs Defaults to false. whether or not the connectors should always draw the stub, or, if the two elements
 *                       are in close proximity to each other (closer than the sum of the two stubs), to adjust the stubs.
 */

 /**
 * @doc function
 * @name jsPlumb.Connectors.Flowchart.class:getPath 
 * Gets the path inscribed by the connector, as a series of [x,y] points.
 */


 /**
 * @doc module
 * @name jsPlumb.Connectors.StateMachine
 * @description Provides 'state machine' connectors.
 */

 /**
 * @doc function
 * @name jsPlumb.Connectors.StateMachine.class:constructor
 * 
 * @param {float} curviness Measure of how "curvy" the connectors will be.  this is translated as the distance that the
 *                Bezier curve's control point is from the midpoint of the straight line connecting the two
 *              endpoints, and does not mean that the connector is this wide.  The Bezier curve never reaches
 *              its control points; they act as gravitational masses. defaults to 10.
 * @param {integer} margin Distance from element to start and end connectors, in pixels.  defaults to 5.
 * @param {integer} proximityLimit  Sets the distance beneath which the elements are consider too close together to bother
 *            with fancy curves. By default this is 80 pixels.
 * @param {integer} loopbackRadius The radius of a loopback connector.  optional; defaults to 25.
 * @param {boolean} showLoopback   If set to false this tells the connector that it is ok to paint connections whose source and target is the same element with a connector running through the element. The default value for this is true; the connector always makes a loopback connection loop around the element rather than passing through it.
 * @param {string} orientation Defaults to "clockwise"; valid values are `"clockwise"` and `"anticlockwise"`. Indicates in which direction a loopback connection should be considered to be travelling.
 */

/**
* @doc module
* @name jsPlumb.Connectors.Straight
* @description The Straight connector draws a simple straight line between the two anchor points.  
*/

/**
* @doc function 
* @name jsPlumb.Connectors.Straight.class:constructor
* @param {integer} stub Optional distance to travel from each endpoint before making the connection between the two. defaults to 0.
* @param {integer} sourceStub Optional stub for the source endpoint only.
* @param {integer} targetStub Optional stub for the target endpoint only.
* @param {integer} gap Optional gap to leave between the endpoints and the start of the connector.
* @param {integer} sourceGap Optional gap for the source endpoint only.
* @param {integer} targetGap Optional gap for the target endpoint only.
*/  
   	
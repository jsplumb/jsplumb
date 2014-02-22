
 /**
* An Anchor that is located at the top center of the element.
 * @class Anchors.Top 
 */
/**
* An Anchor that is located at the bottom center of the element.
 * @class Anchors.Bottom 
 */
/**
* An Anchor that is located at the left middle of the element.
 * @class Anchors.Left 
 */
/**
* An Anchor that is located at the right middle of the element.
 * @class Anchors.Right
 */
/**
* An Anchor that is located at the center of the element.
 * @class Anchors.Center
 */
/**
* An Anchor that is located at the top right corner of the element.
 * @class Anchors.TopRight
 */
/**
* An Anchor that is located at the bottom right corner of the element.
 * @class Anchors.BottomRight
 */
/**
* An Anchor that is located at the top left corner of the element.
 * @class Anchors.TopLeft
 */
/**
* An Anchor that is located at the bottom left corner of the element.
 * @class Anchors.BottomLeft
 */
/**
* Default DynamicAnchors - chooses from Top, Right, Bottom, Left.
 * @class Anchors.AutoDefault
 */
/**
 * An Anchor whose location is assigned at connection time, through an AnchorPositionFinder. Used in conjunction
 * with the `makeTarget` function. jsPlumb has two of these - `Fixed` and `Grid`, and you can also write your own.
 * @class Anchors.Assign
 */

/**
* A continuous anchor that uses only the left edge of the element.
* @class Anchors.ContinuousLeft
*/
/**
* A continuous anchor that uses only the top edge of the element.
* @class Anchors.ContinuousTop
*/            
/**
* A continuous anchor that uses only the bottom edge of the element.
* @class Anchors.ContinuousBottom
*/
/**
* A continuous anchor that uses only the right edge of the element.
* @class Anchors.ContinuousRight
*/

 /**
 * An Anchor that tracks the other element in the connection, choosing the closest face.
  * @class Anchors.Continuous
  * @constructor
  * @param {Object} [params] Constructor parameters
  * @param {String[]} [params.faces] Optional array of faces for the anchor. Valid values are `"top"`, `"left"`, `"bottom"` and `"right"`.
  */

 /**
 * An Anchor that tracks the perimeter of some shape, approximating it with a given number of dynamically
 * positioned locations.
  * @class Anchors.Perimeter
  * @constructor
  * @param {Object} params Constructor parameters
  * @param {Integer} [params.anchorCount=60] Optional number of anchors to use to approximate the perimeter. default is 60.
  * @param {String} params.shape Required. the name of the shape. Valid values are 'rectangle', 'square', 'ellipse', 'circle', 'triangle' and 'diamond'
  * @param {Number} [params.rotation] Optional rotation, in degrees, to apply. 
  */
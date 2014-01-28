/**
* Parent for all Overlay types.  The core concept with an Overlay is that of its `location`, which is specified
* as follows:
*
* ###### Connectors
*     - a value between 0 and 1 inclusive is a proportional value, relative to the length of the Connector's path.
*     - a value greater than 1 or less than 0 is an absolute value (travel along the path inscribed by the Connector)
* 
* For Connectors, the default value is `0.5`.
* 
* ###### Endpoints
*     - An array of two values which are proportional to the width and height of the Endpoint.
*
* For Endpoints, the default value is `[0.5, 0.5]`.
* @class AbstractOverlay
*/

/**
* Draws an arrow, using four points: the head and two tail points, and a `foldback` point, which permits the tail of the arrow to be indented.
* @class Overlays.Arrow
* @constructor
* @param {Object} params Constructor parameters
* @param {Integer} [params.width=20] Width of the tail of the arrow
* @param {Integer} [params.length=20] Distance from the tail of the arrow to the head
* @param {Float} [params.location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the Arrow should appear on the Connector
* @param {Integer} [params.direction=1] Which way to point. Allowed values are 1 (the default, meaning forwards) and -1, meaning backwards
* @param {Float} [params.foldback=0.623] How far along the axis of the arrow the tail points foldback in to.
* @param {Object} [params.paintStyle] A style object in the form used for paintStyle values for Endpoints and Connectors.
*/

/**
* This is just a specialized instance of Arrow in which jsPlumb hardcodes `foldback` to 1, meaning the tail of the Arrow is a flat edge
* @class Overlays.PlainArrow
* @constructor
* @param {Object} params Constructor parameters
* @param {Integer} [params.width=20] Width of the tail of the arrow
* @param {Integer} [params.length=20] Distance from the tail of the arrow to the head
* @param {Float} [params.location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the PlainArrow should appear on the Connector
* @param {Integer} [params.direction=1] Which way to point. Allowed values are 1 (the default, meaning forwards) and -1, meaning backwards
* @param {Object} [params.paintStyle] A style object in the form used for paintStyle values for Endpoints and Connectors.
*/

/**
* This is a specialized instance of Arrow in which jsPlumb hardcodes `foldback` to 2, meaning the Arrow turns into a Diamond
* @class Overlays.Diamond
* @param {Object} params Constructor parameters
* @param {Integer} [params.width=20] Width of the diamond.
* @param {Integer} [params.length=20] Length of the diamond.
* @param {Float} [params.location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the Diamond should appear on the Connector
* @param {Object} [params.paintStyle] A style object in the form used for paintStyle values for Endpoints and Connectors.
*/

/**
* Provides a text label with which to decorate Connectors or Endpoints. For all different renderer types (SVG/Canvas/VML), jsPlumb draws a Label overlay as a styled DIV.  You can style a Label
* using the `cssClass` parameter, or - if you need to programmatically generate the appearance - the `labelStyle` parameter.     
* @class Overlays.Label
* @constructor
* @param {Object} params Constructor parameters
* @param {String|Function} label - The text to display. You can provide a function here instead of plain text: it is passed the component as an argument, and it should return a String.
* @param {String} [cssClass] Optional css class to use for the Label.
* @param {Float} [location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the Label should appear on the Connector
* @param {Object} [labelStyle] Optional object containing properties for the label's style. Use this if you need to prgrammatically generate the label's appearance.
* @param {String} [labelStyle.cssClass] css class for the label (you can also use the `cssClass` parameter on the label; this exists for historical reasons)
* @param {String} [labelStyle.font] A string specifying a font to use, in valid CSS format.
* @param {String} [labelStyle.color] A string specifying a font color to use, in valid CSS format.
* @param {String} [labelStyle.fillStyle] A string specifying the background for the label, in valid CSS format.
* @param {String} [labelStyle.borderStyle] A string specifying the border color for the label, in valid CSS format.
* @param {Integer} [labelStyle.borderWidth] Width of the border's label
* @param {Integer} [labelStyle.padding] Padding for the label.
*/

/**
* @namespace jsPlumb.Overlays
* @desc Parent for all Overlay types.  The core concept with an Overlay is that of its `location`, which is specified
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
*/

/**
* @name jsPlumb.Overlays.Arrow
* @desc Draws an arrow, using four points: the head and two tail points, and a `foldback` point, which permits the tail of the arrow to be indented.
*/

/** 
* @name jsPlumb.Overlays.Arrow
* @constructor
* @function
* @param {Object} params Constructor parameters
* @param {Integer} width Width of the tail of the arrow
* @param {Integer} length Distance from the tail of the arrow to the head
* @param {Float} [location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the Arrow should appear on the Connector
* @param {Integer} direction Which way to point. Allowed values are 1 (the default, meaning forwards) and -1, meaning backwards
* @param {Float} [foldback=0.623] How far along the axis of the arrow the tail points foldback in to.
* @param {Object} paintStyle A style object in the form used for paintStyle values for Endpoints and Connectors.
*/

/**
* @name jsPlumb.Overlays.PlainArrow
* @desc This is just a specialized instance of Arrow in which jsPlumb hardcodes `foldback` to 1, meaning the tail of the Arrow is a flat edge
*/

/** 
* @name jsPlumb.Overlays.PlainArrow
* @constructor
* @function
* @param {Object} params Constructor parameters
* @param {Integer} width Width of the tail of the arrow
* @param {Integer} length Distance from the tail of the arrow to the head
* @param {Float} [location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the PlainArrow should appear on the Connector
* @param {Integer} direction Which way to point. Allowed values are 1 (the default, meaning forwards) and -1, meaning backwards
* @param {Object} paintStyle A style object in the form used for paintStyle values for Endpoints and Connectors.
*/

/**
* @name jsPlumb.Overlays.Diamond
* @desc This is a specialized instance of Arrow in which jsPlumb hardcodes `foldback` to 2, meaning the Arrow turns into a Diamond
*/

/** 
* @name jsPlumb.Overlays.Diamond
* @constructor
* @function
* @param {Object} params Constructor parameters
* @param {Integer} width Width of the diamond.
* @param {Integer} length Length of the diamond.
* @param {Float} [location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the Diamond should appear on the Connector
* @param {Integer} direction Which way to point. Allowed values are 1 (the default, meaning forwards) and -1, meaning backwards
* @param {Object} paintStyle A style object in the form used for paintStyle values for Endpoints and Connectors.
*/

/**
* @name jsPlumb.Overlays.Label
* @desc Provides a text label with which to decorate Connectors or Endpoints.
*/

/** 
* @name jsPlumb.Overlays.Label
* @constructor
* @function
* @param {Object} params Constructor parameters
* @param {String|Function} label - The text to display. You can provide a function here instead of plain text: it is passed the component as an argument, and it should return a String.
* @param {String} [cssClass] Optional css class to use for the Label. This is now preferred over using the `labelStyle` parameter.
* @param {Float} [location=0.5] Where, either as a proportional value from 0 to 1 inclusive, or as an absolute value (negative values mean distance from target; positive values greater than 1 mean distance from source) the Label should appear on the Connector
*/

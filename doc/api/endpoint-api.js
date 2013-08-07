/**
 * @name Endpoint 
 * @extends OverlayCapableJsPlumbUIComponent
 * @class
 * @classdesc Models an endpoint. Can have 1 to `maxConnections` connections emanating from it (set maxConnections to -1 
 * to allow unlimited).  If you use 'jsPlumb.connect' to programmatically connect two elements, you won't
 * actually deal with the underlying Endpoint objects.  But if you wish to support drag and drop Connections, one of the ways you
 * do so is by creating and registering endpoints using 'jsPlumb.addEndpoint', and marking these endpoints as 'source' and/or
 * 'target' endpoints for connections. 
 *
 * You never need to create one of these directly; jsPlumb will create them as needed, but check the docs for the constructor
 * as anything supported there can be set in the parameters passed to {@link jsPlumbInstance#addEndpoint}, 
 * {@link jsPlumbInstance#makeSource} or {@link jsPlumbInstance#makeTarget}.
 */

/**
 * @name Endpoint#Endpoint
 * @constructor 
 * @function
 * @desc You never instantiate an Endpoint directly, but, with the exception of `source`, all of the constructor parameters described here are valid
 * in the params object you pass to a `jsPlumb.addEndpoint`, `jsPlumb.makeSource` or `jsPlumb.makeTarget` call. 
 * @param {Object} params Constructor parameters.
 * @param {String|Array} [params.anchor] Definition of the Anchor for the endpoint.  See the jsPlumb documentation for a discussion of this.
 * @param {String|Array} [params.endpoint] Endpoint definition. See the jsPlumb documentation for a discussion of this.
 * @param {Boolean} [params.enabled=true] Whether or not the Endpoint should be enabled for mouse events (drag/drop).
 * @param {Object} [params.paintStyle=null] Endpoint style, a js object. may be null. 
 * @param {Object} [params.hoverPaintStyle=null] Style to use when the mouse is hovering over the Endpoint. A js object. may be null; defaults to null.
 * @param {String} [params.cssClass=null] CSS class to set on the display element associated with this Endpoint.
 * @param {String} [params.hoverClass=null] CSS class to set on the display element associated with this Endpoint when it is in hover state.
 * @param {String|Selector|Element} params.source Element the Endpoint is attached to, of type String (an element id), element selector, or element. Required. 
 * @param {String|Selector|Element} [params.container] Id or selector instructing jsPlumb where to attach the element it creates for this endpoint.  you should read the documentation for a full discussion of this.
 * @param {Connection[]} [params.connections] List of Connections to configure the Endpoint with. 
 * @param {Boolean} [params.isSource=false] Indicates the endpoint can act as a source of new connections. Optional; defaults to false.
 * @param {Integer} [params.maxConnections=1] A value of -1 means no upper limit. 
 * @param {Object} [params.dragOptions] If `isSource` is set to true, you can supply arguments for the underlying library's drag method. Optional; defaults to null. 
 * @param {Object} [params.connectorStyle] If `isSource` is set to true, this is the paint style for Connections from this Endpoint. Optional; defaults to null.
 * @param {Object} [params.connectorHoverStyle] If `isSource` is set to true, this is the hover paint style for Connections from this Endpoint. Optional; defaults to null.
 * @param {String|Object} [params.connector] Connector type to use.  Like `endpoint`, this may be either a single string nominating a known Connector type (eg. `"Bezier"`, `"Straight"`), or an array containing [name, params], eg. `[ "Bezier", { curviness:160 } ]`.
 * @param {Object[]} [params.connectorOverlays] Array of Overlay definitions that will be applied to any Connection from this Endpoint. 
 * @param {String} [params.connectorClass] CSS class to set on Connections emanating from this Endpoint.
 * @param {String} [params.connectorHoverClass] CSS class to set on to set on Connections emanating from this Endpoint when they are in hover state.		 
 * @param {Boolean} [params.connectionsDetachable=true] Sets whether connections to/from this Endpoint should be detachable or not.
 * @param {Boolean} [params.isTarget=false] Indicates the endpoint can act as a target of new connections. Optional; defaults to false.
 * @param {Object} [params.dropOptions] If `isTarget` is set to true, you can supply arguments for the underlying library's drop method with this parameter. Optional; defaults to null. 
 * @param {Boolean} [params.reattach=false] Determines whether or not the Connections reattach after they have been dragged off an Endpoint and left floating. defaults to false: Connections dropped in this way will just be deleted.
 * @param {Object} [params.parameters={}] JS object containing parameters to set on the Endpoint. These parameters are then available via the getParameter method.  When a connection is made involving this Endpoint, the parameters from this Endpoint are copied into that Connection. Source Endpoint parameters override target Endpoint parameters if they both have a parameter with the same name.
 * @param {String} [params.connector-pointer-events] A value for the 'pointer-events' property of any SVG elements that are created to render connections from this endoint.
 */

 /**
 * @name Endpoint#canvas
 * @desc The Endpoint's drawing area
 */

 /**
 * @name Endpoint#connections
 * @desc List of Connections for the Endpoint.
 */

 /**
 * @name Endpoint#scope
 * @desc Scope descriptor for the Endpoint.
 */


 /**
 * @name Endpoint#setAnchor
 * @function
 * @param {object} anchorParams Parameters for the anchor
 * @param {boolean} [doNotRepaint = false] Instructs jsPlumb to not repaint after setting the new anchor.
 * @desc Sets the anchor to use for this Endpoint.  `anchorParams` is an object in the same
 * form that you would pass as the `anchor` parameter to `jsPlumb.addEndpoint` or `jsPlumb.connect`.
 * @returns {Endpoint} The Endpoint.
 */

 /**
 * @name Endpoint#setEndpoint
 * @function
 * @param {Object} ep Parameters for the endpoint
 * @desc Sets the underlying visual representation to use for this Endpoint.  `ep` is an object in the same
 * form that you would pass as the `endpoint` parameter to `jsPlumb.addEndpoint` or `jsPlumb.makeSource`.
 */

 /**
 * @name Endpoint#detachFromConnection
 * @function
 * @param {Connection} connection
 * @description Detach from the given connection, without cleaning up or destroying the connection.
 */

 /**
 * @name Endpoint#detach
 * @function
 * @param {Connection} connection
 * @desc Detach and cleanup a connection. 
 */

 /**
 * @name Endpoint#detachAll
 * @function
 * @desc Detach all connections for this endpoint.
 * @param {Boolean} [fireEvent=true] Whether or not to fire an event for each detach.       
 */

 /**
 * @name Endpoint#detachFrom
 * @function
 * @desc Detach from the given target endpoint.
 * @param {Endpoint} targetEndpoint Endpoint between which and this Endpoint to detach all connections.
 * @param {Boolean} [fireEvent=true] Whether or not to fire an event.
 */

/**
* @name Endpoint#getElement
* @function
* @returns {Element} The DOM element this Endpoint is attached to.
*/

/**
* @name Endpoint#getUuid
* @function
* @returns {String} The UUID for this Endpoint, if there is one. Otherwise returns null.
*/

/**
* @name Endpoint#isEnabled
* @function
* @returns {Boolean} True if the Endpoint is enabled for drag/drop connections enabled, false otherwise.
*/

/**
* @name Endpoint#isFull
* @function
* @returns {Boolean} True if the Endpoint cannot accept any more Connections, false otherwise.
*/

/**
* @name Endpoint#isVisible
* @function
* @returns {Boolean} Whether or not the Endpoint is currently visible.
*/ 

/**
* @name Endpoint#setDragAllowedWhenFull
* @function
* @desc Sets whether or not connections can be dragged from this Endpoint once it is full. You would use this in a UI in 
*   which you're going to provide some other way of breaking connections, if you need to break them at all. This property 
*   is by default true; use it in conjunction with the 'reattach' option on a connect call.
* @param {Boolean} allowed Whether drag is allowed or not when the Endpoint is full.
*/   

/**
 * @name Endpoint#setElement
 * @function
 * @desc Sets the DOM element this Endpoint is attached to.
 * @param {String|Selector|Element} el	Element id, DOM element or selector identifying the new element
 * param {String|Selector|Element} [container] Specifies the actual parent element to use as the parent for this Endpoint's visual representation. See the jsPlumb documentation for a discussion about this.
 * @returns {Endpoint} The Endpoint.
 */ 

/**
* @name Endpoint#setEnabled
* @function
* @desc Sets whether or not the Endpoint is enabled for drag/drop connections.
* @param {Boolean} enabled Whether or not the Endpoint is enabled.			
*/

/**
* @name Endpoint#setVisible
* @function
* @desc Sets whether or not the Endpoint is currently visible.
* @param {Boolean} visible Whether or not the Endpoint should be visible.
* @param {Boolean} [doNotChangeConnections=false] Instructs jsPlumb to not pass the visible state on to any attached Connections.
* @param {Boolean} [doNotNotifyOtherEndpoint=false] Instructs jsPlumb to not pass the visible state on to Endpoints at the other end of any attached Connections.
*/


/**
* @namespace jsPlumb.Endpoints
* @desc Parent for all Endpoint types. When you provide an Endpoint definition to an appropriate jsPlumb method,
* you can do so either as a string, or as an array of the form `[String, Object]`.  In the former case, the string
* must be one of the members from this namespace, such as `"Dot"` or `"Rectangle"`. In the latter case,
* the first argument to the array is the Endpoint name, and the second is a JS object containing 
* constructor parameters for the Endpoint, for instance
*
* 
*    `[ "Dot", { radius:75 } ]`
*
*
* Valid values for the constructor parameters for each Endpoint type are given below.
*/

/**
* @name jsPlumb.Endpoints.Dot
* @desc A circular Endpoint.
* @param {Object} params Constructor parameters
* @param {Integer} [params.radius=10] Radius of the Endpoint
* @param {String} [params.cssClass] Optional space-delimited list of CSS classes to attach to the Endpoint.
* @param {String} [params.hoverClass] Optional space-delimited list of CSS classes to attach to the Endpoint when the mouse is hovering over it.
*/

/**
* @name jsPlumb.Endpoints.Rectangle
* @desc A rectangular Endpoint.
* @param {Object} params Constructor parameters
* @param {Integer} [params.width=20] Width of the Endpoint
* @param {Integer} [params.height=20] Height of the Endpoint
* @param {String} [params.cssClass] Optional space-delimited list of CSS classes to attach to the Endpoint.
* @param {String} [params.hoverClass] Optional space-delimited list of CSS classes to attach to the Endpoint when the mouse is hovering over it.
*/

/**
* @name jsPlumb.Endpoints.Image
* @desc An Image Endpoint.
* @param {Object} params Constructor parameters
* @param {Integer} params.src Url of the image to display
* @param {String} [params.cssClass] Optional space-delimited list of CSS classes to attach to the Endpoint.
* @param {String} [params.hoverClass] Optional space-delimited list of CSS classes to attach to the Endpoint when the mouse is hovering over it.
*/

/**
* @name jsPlumb.Endpoints.Blank
* @desc Does not draw anything visible to the user. This Endpoint is probably not what you want if you need your users to be able to drag existing Connections - for that, use a Rectangle or Dot Endpoint and assign to it a CSS class that causes it to be transparent.
*/

/**
* @name jsPlumb.Endpoints.Dot
* @constructor
* @function
* @param {Object} params Constructor parameters
* @param {Integer} [params.radius=10] Radius of the Endpoint
* @param {String} [params.cssClass] Optional space-delimited list of CSS classes to attach to the Endpoint.
* @param {String} [params.hoverClass] Optional space-delimited list of CSS classes to attach to the Endpoint when the mouse is hovering over it.
*/

/**
* @name jsPlumb.Endpoints.Rectangle
* @constructor
* @function
* @param {Object} params Constructor parameters
* @param {Integer} [params.width=20] Width of the Endpoint
* @param {Integer} [params.height=20] Height of the Endpoint
* @param {String} [params.cssClass] Optional space-delimited list of CSS classes to attach to the Endpoint.
* @param {String} [params.hoverClass] Optional space-delimited list of CSS classes to attach to the Endpoint when the mouse is hovering over it.
*/

/**
* @name jsPlumb.Endpoints.Image
* @constructor
* @function
* @param {Object} params Constructor parameters
* @param {Integer} params.src Url of the image to display
* @param {String} [params.cssClass] Optional space-delimited list of CSS classes to attach to the Endpoint.
* @param {String} [params.hoverClass] Optional space-delimited list of CSS classes to attach to the Endpoint when the mouse is hovering over it.
*/



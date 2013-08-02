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
 * @desc You never instantiate an Endpoint directly, but all of the constructor parameters described here are valid
 * in the params object you pass to a `jsPlumb.addEndpoint`, `jsPlumb.makeSource` or `jsPlumb.makeTarget` call. 
 * @param {Object} [anchor] Definition of the Anchor for the endpoint.  See the jsPlumb documentation for a discussion of this.
 * @param {Object} [endpoint] Endpoint definition. See the jsPlumb documentation for a discussion of this.
 * @param {Boolean} [enabled=true] Whether or not the Endpoint should be enabled for mouse events (drag/drop).
 * @param {Object} [paintStyle=null] Endpoint style, a js object. may be null. 
 * @param {Object} [hoverPaintStyle=null] Style to use when the mouse is hovering over the Endpoint. A js object. may be null; defaults to null.
 * @param {String} [cssClass=null] CSS class to set on the display element associated with this Endpoint.
 * @param {String} [hoverClass=null] CSS class to set on the display element associated with this Endpoint when it is in hover state.
 * @param {String|Selector|Element} source Element the Endpoint is attached to, of type String (an element id), element selector, or element. Required. 
 * @param {String|Selector|Element} [container] Id or selector instructing jsPlumb where to attach the element it creates for this endpoint.  you should read the documentation for a full discussion of this.
 * @param {Connection[]} [connections] List of Connections to configure the Endpoint with. 
 * @param {Boolean} [isSource=false] Indicates the endpoint can act as a source of new connections. Optional; defaults to false.
 * @param {Integer} [maxConnections=1] A value of -1 means no upper limit. 
 * @param {Object} [dragOptions] If `isSource` is set to true, you can supply arguments for the underlying library's drag method. Optional; defaults to null. 
 * @param {Object} [connectorStyle] If `isSource` is set to true, this is the paint style for Connections from this Endpoint. Optional; defaults to null.
 * @param {Object} [connectorHoverStyle] If `isSource` is set to true, this is the hover paint style for Connections from this Endpoint. Optional; defaults to null.
 * @param {String|Object} [connector] Connector type to use.  Like `endpoint`, this may be either a single string nominating a known Connector type (eg. `"Bezier"`, `"Straight"`), or an array containing [name, params], eg. `[ "Bezier", { curviness:160 } ]`.
 * @param {Object[]} [connectorOverlays] Array of Overlay definitions that will be applied to any Connection from this Endpoint. 
 * @param {String} [connectorClass] CSS class to set on Connections emanating from this Endpoint.
 * @param {String} [connectorHoverClass] CSS class to set on to set on Connections emanating from this Endpoint when they are in hover state.		 
 * @param {Boolean} [connectionsDetachable=true] Sets whether connections to/from this Endpoint should be detachable or not.
 * @param {Boolean} [isTarget=false] Indicates the endpoint can act as a target of new connections. Optional; defaults to false.
 * @param {Object} [dropOptions] If `isTarget` is set to true, you can supply arguments for the underlying library's drop method with this parameter. Optional; defaults to null. 
 * @param {Boolean} [reattach=false] Determines whether or not the Connections reattach after they have been dragged off an Endpoint and left floating. defaults to false: Connections dropped in this way will just be deleted.
 * @param {Object} [parameters={}] JS object containing parameters to set on the Endpoint. These parameters are then available via the getParameter method.  When a connection is made involving this Endpoint, the parameters from this Endpoint are copied into that Connection. Source Endpoint parameters override target Endpoint parameters if they both have a parameter with the same name.
 * @param {String} [connector-pointer-events] A value for the 'pointer-events' property of any SVG elements that are created to render connections from this endoint.
 */

 /**
 * @name Endpoint#setAnchor
 * @function
 * @param {object} anchorParams Parameters for the anchor
 * @param {boolean} [doNotRepaint] Optional, defaults to false. 
 * @desc Sets the anchor to use for this Endpoint.  `anchorParams` is an object in the same
 * form that you would pass as the `anchor` parameter to `jsPlumb.addEndpoint` or `jsPlumb.connect`.
 */

 /**
 * @name Endpoint#setEndpoint
 * @function
 * @param {object} ep Parameters for the endpoint
 * @desc Sets the underlying visual representation to use for this Endpoint.  `ep` is an object in the same
 * form that you would pass as the `endpoint` parameter to `jsPlumb.addEndpoint` or `jsPlumb.connect`.
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
 * Detach and cleanup a connection.
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
* @returns {String} The UUID for this Endpoint, if there is one. Otherwise returns null.
*/

/**
* @name Endpoint#isEnabled
* @returns {Boolean} True if the Endpoint is enabled for drag/drop connections enabled, false otherwise.
*/

/**
* @name Endpoint#isFull
* @returns {Boolean} True if the Endpoint cannot accept any more Connections, false otherwise.
*/

/**
* @name Endpoint#isVisible
* @returns {Boolean} Whether or not the Endpoint is currently visible.
*/ 

/**
* @name Endpoint#setDragAllowedWhenFull
* @desc Sets whether or not connections can be dragged from this Endpoint once it is full. You would use this in a UI in 
*   which you're going to provide some other way of breaking connections, if you need to break them at all. This property 
*   is by default true; use it in conjunction with the 'reattach' option on a connect call.
* @param {Boolean} allowed Whether drag is allowed or not when the Endpoint is full.
*/   

/**
 * @name Endpoint#setElement
 * @desc Sets the DOM element this Endpoint is attached to.
 * @param {String|Selector|Element} el	Element id, DOM element or selector identifying the new element
 * @param {String|Selector|Element} [container] Specifies the actual parent element to use as the parent for this Endpoint's visual representation. See the jsPlumb documentation for a discussion about this.
 */ 

/**
* @name Endpoint#setEnabled
* @desc Sets whether or not the Endpoint is enabled for drag/drop connections.
* @param {Boolean} enabled Whether or not the Endpoint is enabled.			
*/

/**
* @name Endpoint#setVisible
* @desc Sets whether or not the Endpoint is currently visible.
* @param {Boolean} visible Whether or not the Endpoint should be visible.
* @param {Boolean} [doNotChangeConnections=false] Instructs jsPlumb to not pass the visible state on to any attached Connections. defaults to false.
* @param {Boolean} [doNotNotifyOtherEndpoint=false] Instructs jsPlumb to not pass the visible state on to Endpoints at the other end of any attached Connections. defaults to false. 
*/

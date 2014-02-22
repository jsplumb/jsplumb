/**
* Models a Connection.  A Connection consists of two Endpoints (each of which belongs to some DOM element), a Connector (the actual path inscribed by the
* Connection), and zero or more Overlays.
 * @class Connection 
 * @extends OverlayCapableJsPlumbUIComponent
 */


 /**
 * Connection constructor. You should not ever create one of these directly. If you make a call to jsPlumb.connect, all of
  * the parameters that you pass in to that function will be passed to the Connection constructor; if your UI
  * uses the various Endpoint-centric methods like addEndpoint/makeSource/makeTarget, along with drag and drop,
  * then the parameters you set on those functions are translated and passed in to the Connection constructor. So
  * you should check the documentation for each of those methods.
  * @constructor
  * @param {Object} params Constructor parameters 
  * @param {String|Element|Selector|Endpoint} [params.source] Either an element id, a selector for an element, or an Endpoint.
  * @param {String|Element|Selector|Endpoint} [params.target] Either an element id, a selector for an element, or an Endpoint
  * @param {String} [params.scope=`jsPlumb.Defaults.Scope`] Scope descriptor for this connection. 
  * @param {String|Element|Selector} [params.container] Optional id, element or selector instructing jsPlumb where to attach all the elements it creates for this connection.  you should read the documentation for a full discussion of this.
  * @param {Boolean} [params.detachable=true] Defines whether or not the connection may be detached using the mouse.
  * @param {Boolean} [params.reattach=false] Defines whether not the connection should be retached if it was dragged off an Endpoint and then dropped in whitespace.
  * @param {Object} [params.endpoint] Optional Endpoint definition to use for both ends of the connection.
  * @param {Object[]} [params.endpoints] Optional array of two Endpoint definitions, one for each end of the Connection. This and 'endpoint' are mutually exclusive parameters.
  * @param {Object} [params.endpointStyle] Endpoint style definition to use for both ends of the Connection.
  * @param {Object[]} [params.endpointStyles] Array of two Endpoint style definitions, one for each end of the Connection. This and 'endpoint' are mutually exclusive parameters.
  * @param {Object} [params.paintStyle] Parameters defining the appearance of the Connection. Optional; jsPlumb will use the defaults if you supply nothing here.
  * @param {Object} [params.hoverPaintStyle] Parameters defining the appearance of the Connection when the mouse is hovering over it. Optional; jsPlumb will use the defaults if you supply nothing here (note that the default hoverPaintStyle is null).
  * @param {String} [params.cssClass] CSS class to set on the display element associated with this Connection.
  * @param {String} [params.hoverClass] CSS class to set on the display element associated with this Connection when it is in hover state.
  * @param {Object[]} [params.overlays] Array of Overlay definitions to appear on this Connection.
  * @param {Boolean} [params.drawEndpoints=true] If false, instructs jsPlumb to not draw the endpoints for this Connection.  Be careful with this: it only really works when you tell jsPlumb to attach elements to the document body. Read the documentation for a full discussion of this. 
  * @param {Object} [params.parameters={}] JS object containing parameters to set on the Connection. These parameters are then available via the getParameter method.
  */ 

  /**
  * ID of the source element.
  * @property sourceId
  * @type {String} 
  */

  /**
  * ID of the target element.
  * @property targetId
  * @type {String}
  */

  /**
  * Scope descriptor for the Connection.
  * @property scope
  * @type {String}
  * @default "_jsPlumb_Default_Scope"
  */

  /**
  * Source element in the Connection.
  * @property source
  * @type {Element}
  */

  /**
  * Target element in the Connection.
  * @property target
  * @type {Element}
  */

  /**
  * Array of Endpoints.
  * @property endpoints
  * @type {Endpoint[]}
  */


/**
* Gets the underlying Connector for this Connection. A Connector is the path the user sees between the two Endpoints.
* @method getConnector
* @return {Connector} The current Connector.
*/

/**
* Returns whether or not this Connection can be detached from its target/source endpoint.  By default this
* is false; use it in conjunction with the `reattach` parameter.
* @method isDetachable
* @return {Boolean} True if can be detached, false otherwise.
*/

/**
* Returns whether or not the Connection is editable.
* @method isEditable
* @return {Boolean} True if editable, false if not.
*/

/**
* Returns whether or not this Connection will be reattached after having been detached via the mouse and dropped.  By default this
* is false; use it in conjunction with the `detachable` parameter.
* @method isReattach
* @return {Boolean} True if will reattach, false if not.
*/

/**
* Returns whether or not the Connection is currently visible.
* @method isVisible
* @return {Boolean} True if visible, false if not.
*/

/**
* Sets the Connection's connector (eg `Bezier`, `Flowchart`, etc).  You pass a Connector definition into this method, the same
* thing that you would set as the `connector` property on a `jsPlumb.connect` call.
* @method setConnector
* @param {String|Object} connector Connector definition. See jsPlumb documentation for a discussion.
*/   

/**
* Sets whether or not this connection is detachable.
* @method setDetachable
* @param {Boolean} detachable Whether or not to set the Connection to be detachable.
*/

/**
* Sets whether or not the Connection is editable. This will only be honoured if
* the underlying Connector is editable - not all types are.
* @method setEditable
* @param {Boolean} editable Whether or not to set the Connection to be editable.
*/

/**
* Sets whether or not this connection will reattach after having been detached via the mouse and dropped.
* @method setReattach
* @param {Boolean} reattach	Whether or not to set the Connection to reattach after it has been dropped in whitespace.
*/

/**
* Sets whether or not the Connection should be visible.
* @method setVisible
* @param {Boolean} visible Boolean indicating desired visible state.
*/
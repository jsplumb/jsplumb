/**
 * @name Connection 
 * @extends OverlayCapableJsPlumbUIComponent
 * @class
 * @classdesc Models a connection.
 */


 /**
  * @name Connection#Connection
  * @constructor
  * @function
  * @desc Connection constructor. You should not ever create one of these directly. If you make a call to jsPlumb.connect, all of
  * the parameters that you pass in to that function will be passed to the Connection constructor; if your UI
  * uses the various Endpoint-centric methods like addEndpoint/makeSource/makeTarget, along with drag and drop,
  * then the parameters you set on those functions are translated and passed in to the Connection constructor. So
  * you should check the documentation for each of those methods.
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
  * @name Connection#sourceId
  * @desc ID of the source element.
  */

  /**
  * @name Connection#targetId
  * @desc ID of the target element.
  */

  /**
  * @name Connection#scope
  * @desc Scope descriptor for the Connection.
  */

  /**
  * @name Connection#source
  * @desc Source element in the Connection.
  */

  /**
  * @name Connection#target
  * @desc Target element in the Connection..
  */

/**
* @name Connection#getConnector
* @function
* @desc Gets the underlying Connector for this Connection (eg. a Bezier connector, straight line connector, flowchart connector etc)
* @returns {Connector} The current Connector.
*/

/**
* @name Connection#isDetachable
* @function
* @desc Returns whether or not this connection can be detached from its target/source endpoint.  By default this
* is false; use it in conjunction with the `reattach` parameter.
* @returns {Boolean} True if can be detached, false otherwise.
*/

/**
* @name Connection#isEditable
* @function
* @desc Returns whether or not the Connection is editable.
* @returns {Boolean} True if editable, false if not.
*/

/**
* @name Connection#isReattach
* @function
* @desc Returns whether or not this connection will be reattached after having been detached via the mouse and dropped.  by default this
* is false; use it in conjunction with the 'detachable' parameter.
* @returns {Boolean} True if will reattach, false if not.
*/

/**
* @name Connection#isVisible
* @function
* @desc Returns whether or not the Connection is currently visible.
* @returns True if visible, false if not.
*/

/**
* @name Connection#setConnector
* @function
* @desc Sets the Connection's connector (eg `Bezier`, `Flowchart`, etc).  You pass a Connector definition into this method, the same
* thing that you would set as the `connector` property on a `jsPlumb.connect` call.
* @param {String|Object} connector Connector definition. See jsPlumb documentation for a discussion.
*/   

/**
* @name Connection#setDetachable
* @function
* @desc Sets whether or not this connection is detachable.
* @param {Boolean} detachable Whether or not to set the Connection to be detachable.
*/

/**
* @name Connection#setEditable
* @function
* @desc Sets whether or not the Connection is editable. This will only be honoured if
* the underlying Connector is editable - not all types are.
* @param {Boolean} editable Whether or not to set the Connection to be editable
*/

/**
* @name Connection#setReattach
* @function
* @desc Sets whether or not this connection will reattach after having been detached via the mouse and dropped.
* @param {Boolean} reattach	Whether or not to set the Connection to reattach after drop in whitespace.
*/

/**
* @name Connection#setVisible
* @function
* @desc Sets whether or not the Connection should be visible.
* @param {Boolean} visible Boolean indicating desired visible state.
*/
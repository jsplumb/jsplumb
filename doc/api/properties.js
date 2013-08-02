// ------------------------------- jsPlumb Properties ------------------------------------

/**
* @desc The CSS class to set on Connection elements. This value is a String and can have multiple classes; the entire String is appended as-is.
* @name jsPlumbInstance#connectorClass
*/

/**
* @name jsPlumbInstance#hoverClass
* @desc The CSS class to set on Connection or Endpoint elements when hovering. This value is a String and can have multiple classes; the entire String is appended as-is.
*/

/**
* @name jsPlumbInstance#endpointClass
* @desc The CSS class to set on Endpoint elements. This value is a String and can have multiple classes; the entire String is appended as-is.
*/ 

/**
* @name jsPlumbInstance#endpointConnectedClass
* @desc The CSS class to set on an Endpoint element when its Endpoint has at least one connection. This value is a String and can have multiple classes; the entire String is appended as-is.
*/

/**
* @name jsPlumbInstance#endpointFullClass
* @desc The CSS class to set on a full Endpoint element. This value is a String and can have multiple classes; the entire String is appended as-is.
*/
/*
* @name jsPlumbInstance#endpointDropAllowedClass
* @desc The CSS class to set on an Endpoint on which a drop will be allowed (during drag and drop). This value is a String and can have multiple classes; the entire String is appended as-is.
*/
/*
* @name jsPlumbInstance#endpointDropForbiddenClass
* @desc The CSS class to set on an Endpoint on which a drop will be forbidden (during drag and drop). This value is a String and can have multiple classes; the entire String is appended as-is.
*/
/*
* @name jsPlumbInstance#overlayClass
* @desc The CSS class to set on an Overlay that is an HTML element. This value is a String and can have multiple classes; the entire String is appended as-is.
*/ 
/*
* @name jsPlumbInstance#draggingClass
* @desc The CSS class to set on connections that are being dragged. This value is a String and can have multiple classes; the entire String is appended as-is.
*/

/*
* @name jsPlumbInstance#elementDraggingClass
* @desc The CSS class to set on connections whose source or target element is being dragged, and
* on their endpoints too. This value is a String and can have multiple classes; the entire String is appended as-is.
*/ 

/**
* @name jsPlumbInstance#endpointAnchorClassPrefix
* @desc The prefix for the CSS class to set on endpoints that have dynamic anchors whose individual locations
* have declared an associated CSS class. This value is a String and, unlike the other classes, is expected
* to contain a single value, as it is used as a prefix for the final class: '_***' is appended,
* where "***" is the CSS class associated with the current dynamic anchor location.
*/

/**
* @name jsPlumb.CANVAS
* @desc Constant for use with the setRenderMode method	
 */
/**
* @name jsPlumb.VML
* @desc Constant for use with the setRenderMode method
*/
/*
* @name jsPlumb.SVG
* @desc Constant for use with the setRenderMode method
*/	

/**
 * @name jsPlumbInstance.Defaults 
 * @desc These are the default settings for jsPlumb.  They are what will be used if you do not supply specific pieces of information 
 * to the various API calls. A convenient way to implement your own look and feel can be to override these defaults 
 * by including a script somewhere after the jsPlumb include, but before you make any calls to jsPlumb.
 */
/**
* @name jsPlumbInstance.Defaults.Anchor
* @desc The default anchor to use for all connections (both source and target). Default is "BottomCenter".
*/
/**
* @name jsPlumbInstance.Defaults.Anchors				    
* @desc The default anchors to use as ([source, target]) for all connections. Defaults are ["BottomCenter", "BottomCenter"].
*/
/**
* @name jsPlumbInstance.Defaults.ConnectionsDetachable
* @desc Whether or not connections are detachable by default (using the mouse). Defaults to true.
*/
/**
* @name jsPlumbInstance.Defaults.ConnectionOverlays
* @desc The default overlay definitions for Connections. Defaults to an empty list.
*/
/**
* @name jsPlumbInstance.Defaults.Connector
* @desc Name of the default connector definition to use for all connections.  Default is "Bezier".
*/
/**
* @name jsPlumbInstance.Defaults.Container
* @desc Optional selector or element id that instructs jsPlumb to append elements it creates to a specific element.
*/
/**
* @name jsPlumbInstance.Defaults.DoNotThrowErrors
* @desc Defaults to false; whether or not to throw errors if a user specifies an unknown anchor, endpoint or connector type.
*/
/**
* @name jsPlumbInstance.Defaults.DragOptions
* @desc The default drag options to pass in to {@link jsPlumbInstance#connect}, {@link jsPlumbInstance#makeTarget} and {@link jsPlumbInstance#addEndpoint} calls. Default is empty.
*/
/**
* @name jsPlumbInstance.Defaults.DropOptions
* @desc The default drop options to pass in to {@link jsPlumbInstance#connect}, {@link jsPlumbInstance#makeTarget} and {@link jsPlumbInstance#addEndpoint} calls. Default is empty.
*/
/**
* @name jsPlumbInstance.Defaults.Endpoint				
* @desc The name of the default endpoint to use for all connections (both source and target).  Default is `"Dot"`.
*/
/**
* @name jsPlumbInstance.Defaults.Endpoints
* @desc The names of the default endpoint definitions ([ source, target ]) to use for all connections.  Defaults are `["Dot", "Dot"]`.
*/
/**
* @name jsPlumbInstance.Defaults.EndpointStyle
* @desc The default style definition to use for all endpoints. Default is `{ fillStyle:"#456" }`
*/
/**
* @name jsPlumbInstance.Defaults.EndpointStyles
* @desc The default style definitions ([ source, target ]) to use for all endpoints.  Defaults are empty.
*/
/**
* @name jsPlumbInstance.Defaults.EndpointHoverStyle
* @desc The default hover style definition to use for all endpoints. Default is null.
*/
/**
* @name jsPlumbInstance.Defaults.EndpointHoverStyles
* @desc The default hover style definitions ([ source, target ]) to use for all endpoints. Defaults are null.
*/
/**
* @name jsPlumbInstance.Defaults.HoverPaintStyle
* @desc The default hover style definition to use for all connections. Defaults are null.
*/
/**
* @name jsPlumbInstance.Defaults.LabelStyle
* @desc The default style to use for label overlays on connections.
* @deprecated Labels should be styled with CSS nowadays.
*/
/**
* @name jsPlumbInstance.Defaults.LogEnabled
* @desc Whether or not the jsPlumb log is enabled. defaults to false.
*/
/**
* @name jsPlumbInstance.Defaults.Overlays
* @desc The default overlay definitions (for both Connections and Endpoint). Defaults to an empty list.
*/
/**
* @name jsPlumbInstance.Defaults.MaxConnections
* @desc The default maximum number of connections for an Endpoint.  Defaults to 1.		 
*/
/**
* @name jsPlumbInstance.Defaults.PaintStyle
* @desc The default paint style for a connection. Default is line width of 8 pixels, with color "#456".
*/
/**
* @name jsPlumbInstance.Defaults.ReattachConnections
* @desc Whether or not to reattach Connections that a user has detached with the mouse and then dropped. Default is false.
*/
/**
* @name jsPlumbInstance.Defaults.RenderMode			
* @desc What mode to use to paint with.  If you're on IE<9, you don't really get to choose this.  You'll just get VML.  Otherwise, the jsPlumb default is to use SVG, but you can ask for Canvas if you wish.
*/
/**
* @name jsPlumbInstance.Defaults.Scope
* @desc The default "scope" to use for connections. Scope lets you assign connections to different categories. 
*/

// --------------------------------- Endpoint Properties ------------------------------------------------

/**
* @name Endpoint#canvas
* @desc The Endpoint's drawing area.
*/
/**
* @name Endpoint#connections
* @desc List of Connections this Endpoint is attached to.
*/
/**
* @name Endpoint#scope
* @desc Scope descriptor for this Endpoint.
*/
/**
* @name Endpoint#overlays
* @desc List of Overlays for this Endpoint.
*/

// -------------------------------- Connection properties ---------------------------------------------

/**
* @name Connection#sourceId
* @desc Id of the source element in the connection.
*/

/**
* @name Connection#targetId
* @desc Id of the target element in the connection.
*/

/**
* @name Connection#scope
* @desc Optional scope descriptor for the connection.
*/

/**
* @name Connection#endpoints
* @desc Array of Endpoints.
*/

/**
* @name Connection#source
* @desc The source element for this Connection.
*/

/**
* @name Connection#target
* @desc The target element for this Connection.
*/

/**
* @name Connection#overlays
* @desc List of Overlays for this component.
*/
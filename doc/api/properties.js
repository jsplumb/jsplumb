// ------------------------------- jsPlumb Properties ------------------------------------

/**
* @doc property
* @name jsPlumb.class:connectorClass
* @description
* The CSS class to set on Connection elements. This value is a String and can have multiple classes; the entire String is appended as-is.
*/

/**
* @doc property
* @name jsPlumb.class:hoverClass
* @description
* The CSS class to set on Connection or Endpoint elements when hovering. This value is a String and can have multiple classes; the entire String is appended as-is.
*/

/**
* @doc property
* @name jsPlumb.class:endpointClass
* @description The CSS class to set on Endpoint elements. This value is a String and can have multiple classes; the entire String is appended as-is.
*/ 
/*
* @doc property
* @name jsPlumb.class:endpointConnectedClass
*  The CSS class to set on an Endpoint element when its Endpoint has at least one connection. This value is a String and can have multiple classes; the entire String is appended as-is.
*/
/*
* @doc property
* @name jsPlumb.class:endpointFullClass
* @description The CSS class to set on a full Endpoint element. This value is a String and can have multiple classes; the entire String is appended as-is.
*/
/*
* @doc property
* @name jsPlumb.class:endpointDropAllowedClass
* @description The CSS class to set on an Endpoint on which a drop will be allowed (during drag and drop). This value is a String and can have multiple classes; the entire String is appended as-is.
*/
/*
* @doc property
* @name jsPlumb.class:endpointDropForbiddenClass
* @description The CSS class to set on an Endpoint on which a drop will be forbidden (during drag and drop). This value is a String and can have multiple classes; the entire String is appended as-is.
*/
/*
* @doc property
* @name jsPlumb.class:overlayClass
* @description The CSS class to set on an Overlay that is an HTML element. This value is a String and can have multiple classes; the entire String is appended as-is.
*/ 
/*
* @doc property
* @name jsPlumb.class:draggingClass
* @description The CSS class to set on connections that are being dragged. This value is a String and can have multiple classes; the entire String is appended as-is.
*/

/*
* @doc property
* @name jsPlumb.class:elementDraggingClass
* @description The CSS class to set on connections whose source or target element is being dragged, and
* on their endpoints too. This value is a String and can have multiple classes; the entire String is appended as-is.
*/ 

/**
* @doc property
* @name jsPlumb.class:endpointAnchorClassPrefix
* @description The prefix for the CSS class to set on endpoints that have dynamic anchors whose individual locations
* have declared an associated CSS class. This value is a String and, unlike the other classes, is expected
* to contain a single value, as it is used as a prefix for the final class: '_***' is appended,
* where "***" is the CSS class associated with the current dynamic anchor location.
*/

// --------------------------------- Endpoint Properties ------------------------------------------------

/**
* @doc property
* @name Endpoint.class:canvas
* @description The Endpoint's drawing area.
*/
/**
* @doc property
* @name Endpoint.class:connections
* @description List of Connections this Endpoint is attached to.
*/
/**
* @doc property
* @name Endpoint.class:scope
* Scope descriptor for this Endpoint.
*/
/**
* @doc property
* @name Endpoint.class:overlays
* @description List of Overlays for this Endpoint.
*/

// -------------------------------- Connection properties ---------------------------------------------

/**
* @doc property
* @name Connection.class:sourceId
* @description Id of the source element in the connection.
*/

/**
* @doc property
* @name Connection.class:targetId
* @description Id of the target element in the connection.
*/

/**
* @doc property
* @name Connection.class:scope
* @description Optional scope descriptor for the connection.
*/

/**
* @doc property
* @name Connection.class:endpoints
* @description Array of Endpoints.
*/

/**
* @doc property
* @name Connection.class:source
* @description The source element for this Connection.
*/

/**
* @doc property
* @name Connection.class:target
* @description The target element for this Connection.
*/

/**
* @doc property
* @name Connection.class:overlays
* @description List of Overlays for this component.
*/
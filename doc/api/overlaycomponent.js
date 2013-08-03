/**
* @name OverlayCapableJsPlumbUIComponent
* @class
* @classdesc Base class for components that support Overlays. This class should never be directly instantiated.
* @extends jsPlumbUIComponent
*/

/**
* @name OverlayCapableJsPlumbUIComponent#overlays
* @desc List of Overlays for this component.
*/

/**
* @name OverlayCapableJsPlumbUIComponent#getLabel
* @function
* @desc Returns the label text for this component (or a function if you are labelling with a function).
* This does not return the overlay itself; this is a convenience method which is a pair with
* `setLabel`; together they allow you to add and access a Label Overlay without having to create the
* Overlay object itself.  For access to the underlying label overlay that jsPlumb has created,
* use `getLabelOverlay`.
*
* @see {@link #getOverlay}
* @see {@link #getLabelOverlay}
*/

/**
* @name OverlayCapableJsPlumbUIComponent#getLabelOverlay
* @function
* @returns {Overlay} The underlying internal label overlay, which will exist if you specified a label on
* a `connect` call, or have called `setLabel` at any stage. Otherwise it will be null.
* @see {@link #setLabel}
*/

/**
* @name OverlayCapableJsPlumbUIComponent#getOverlay
* @function
* @desc Gets an overlay, by ID. Note: **by ID**.  You would pass an 'id' parameter
* in to the Overlay's constructor arguments, and then use that to retrieve it via this method.
* @param {String} overlayId Id of the overlay to retrieve.
* @returns {Overlay} The overlay stored against the given id, null if not found.
*/

/**
* @name OverlayCapableJsPlumbUIComponent#getOverlays
* @function
* @desc Gets all the overlays for this component.
* @returns {Array} List of the component's overlays.
*/

/**
* @name OverlayCapableJsPlumbUIComponent#hideOverlay
* @function
* @desc Hides the overlay specified by the given id.
* @param {String} overlayId Id of the overlay to hide.
*/

/**
* @name OverlayCapableJsPlumbUIComponent#hideOverlays
* @function
* @desc Hides all Overlays for this component.
*/


/**
* @name OverlayCapableJsPlumbUIComponent#showOverlay
* @function
* @desc Shows the overlay specified by the given id.
* @param {String} overlayId Id of the overlay to show.
*/

/**
* @name OverlayCapableJsPlumbUIComponent#showOverlays
* @function
* @desc Shows all Overlays for this component.
*/
/*
* @name OverlayCapableJsPlumbUIComponent#removeAllOverlays
* @function
* @desc Removes all overlays from the component, and then repaints.
*/

/*
* @name OverlayCapableJsPlumbUIComponent#removeOverlay
* @function
* @desc Removes an overlay by ID.  Note: by ID.  this is a string you set in the overlay spec.
* @param {String} overlayId Id of the overlay to remove.
*/

/*
* @name OverlayCapableJsPlumbUIComponent#removeOverlays
* @function
* @desc Removes a set of overlays by ID.  Note: **by ID**.  This is a string you set in the overlay spec.
* @param {...String} overlayIds This function takes an arbitrary number of arguments, each of which is a single overlay id.
*/ 

/*
* @name OverlayCapableJsPlumbUIComponent#setLabel
* @function
* @desc Sets the component's label.  
* @param {String|Function|Object} label	Label to set. May be a String, a Function that returns a String, or a params object containing { "label", "labelStyle", "location", "cssClass" }.  Note that this uses innerHTML on the label div, so keep that in mind if you need escaped HTML.
*/

/*
* @name OverlayCapableJsPlumbUIComponent#addOverlay
* @function
* @desc Adds an Overlay to the component.
* @param {Object} overlaySpec Specification of the Overlay to add.
*/ 
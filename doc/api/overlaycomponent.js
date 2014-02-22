/**
* Base class for components that support Overlays. This class should never be directly instantiated.
* @class OverlayCapableJsPlumbUIComponent
* @extends jsPlumbUIComponent
*/

/**
* List of Overlays for this component.
* @property overlays
* @type {List[Overlay]}
*/

/**
* Returns the label text for this component (or a function if you are labelling with a function).
* This does not return the overlay itself; this is a convenience method which is a pair with
* `setLabel`; together they allow you to add and access a Label Overlay without having to create the
* Overlay object itself.  For access to the underlying label overlay that jsPlumb has created,
* use `getLabelOverlay`.
* @method getLabel
* @see {@link #getOverlay}
* @see {@link #getLabelOverlay}
*/

/**
* @method getLabelOverlay
* @return {Overlay} The underlying internal label overlay, which will exist if you specified a label on
* a `connect` call, or have called `setLabel` at any stage. Otherwise it will be null.
* @see {@link #setLabel}
*/

/**
* Gets an overlay, by ID. Note: **by ID**.  You would pass an 'id' parameter
* in to the Overlay's constructor arguments, and then use that to retrieve it via this method.
* @method getOverlay
* @param {String} overlayId Id of the overlay to retrieve.
* @return {Overlay} The overlay stored against the given id, null if not found.
*/

/**
* Gets all the overlays for this component.
* @method getOverlays
* @returns {Array} List of the component's overlays.
*/

/**
* Hides the overlay specified by the given id.
* @method hideOverlay
* @param {String} overlayId Id of the overlay to hide.
*/

/**
* Hides all Overlays for this component.
* @method hideOverlays
*/


/**
* Shows the overlay specified by the given id.
* @method showOverlay
* @param {String} overlayId Id of the overlay to show.
*/

/**
* Shows all Overlays for this component.
* @method showOverlays
*/
/**
* Removes all overlays from the component, and then repaints.
* @method removeAllOverlays
*/

/**
* Removes an overlay by ID.  Note: by ID.  this is a string you set in the overlay spec.
* @method removeOverlay
* @param {String} overlayId Id of the overlay to remove.
*/

/**
* Removes a set of overlays by ID.  Note: **by ID**.  This is a string you set in the overlay spec.
* @method removeOverlays
* @param {...String} overlayIds This function takes an arbitrary number of arguments, each of which is a single overlay id.
*/ 

/**
* Sets the component's label.  
* @method setLabel
* @param {String|Function|Object} label Label to set. May be a String, a Function that returns a String, or a params object containing { "label", "labelStyle", "location", "cssClass" }.  Note that this uses innerHTML on the label div, so keep that in mind if you need escaped HTML.
*/

/**
* Adds an Overlay to the component.
* @method addOverlay
* @param {Object} overlaySpec Specification of the Overlay to add.
*/ 
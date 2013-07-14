/**
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:getLabel
* @description Returns the label text for this Connection (or a function if you are labelling with a function).
* This does not return the overlay itself; this is a convenience method which is a pair with
* <setLabel>; together they allow you to add and access a Label Overlay without having to create the
* Overlay object itself.  For access to the underlying label overlay that jsPlumb has created,
* use `getLabelOverlay`.
*
* See Also:
* 	<getOverlay>
* 	<getLabelOverlay>
*/

/**
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:getLabelOverlay
* @return {object} The underlying internal label overlay, which will exist if you specified a label on
* a `connect` call, or have called `setLabel` at any stage.   
*/

/**
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:getOverlay
* @description Gets an overlay, by ID. Note: by ID.  You would pass an 'id' parameter
* in to the Overlay's constructor arguments, and then use that to retrieve it via this method.
* @param {string} overlayId Id of the overlay to retrieve.
* @return {object} The overlay stored against the given id, null if not found.
*/

/**
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:getOverlays
* Gets all the overlays for this component.
* @return {array} List of the component's overlays.
*/

/**
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:hideOverlay
* @description Hides the overlay specified by the given id.
* @param {string} overlayId Id of the overlay to hide.
*/

/**
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:hideOverlays
* @description Hides all Overlays
*/

/*
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:removeAllOverlays
* @description Removes all overlays from the component, and then repaints.
*/

/*
* @doc function
* @name OverlayCapableJsPlumbUIComponent.class:removeOverlay
* @description Removes an overlay by ID.  Note: by ID.  this is a string you set in the overlay spec.
* @param {string} overlayId Id of the overlay to remove.
*/

  /*
  * @doc function
* @name OverlayCapableJsPlumbUIComponent.class: removeOverlays(overlayIds...)
  * Removes a set of overlays by ID.  Note: by ID.  this is a string you set in the overlay spec.
  * 
  * Parameters:
  * 	overlayIds - this function takes an arbitrary number of arguments, each of which is a single overlay id.
  */ 

  /*
   * @doc function
* @name OverlayCapableJsPlumbUIComponent.class: setLabel(label)
   * Sets the Connection's label.  
   * 
   * Parameters:
   * 	label	- label to set. May be a String, a Function that returns a String, or a params object containing { "label", "labelStyle", "location", "cssClass" }.  Note that this uses innerHTML on the label div, so keep
   * that in mind if you need escaped HTML.
   */

   /*
    * @doc function
* @name OverlayCapableJsPlumbUIComponent.class: addOverlay(overlaySpec)
    * Adds an Overlay to the Connection.
    * 
    * Parameters:
    * 	overlaySpec - specification of the Overlay to add.
    */ 
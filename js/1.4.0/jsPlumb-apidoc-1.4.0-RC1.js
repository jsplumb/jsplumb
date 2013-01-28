// ---------------- JSPLUMB ----------------------------------------

/**
 * Class: jsPlumb
 * The jsPlumb engine, registered as a static object in the window.  This object contains all of the methods you will use to
 * create and maintain Connections and Endpoints.
 */	

    /*
	 * Property: Anchors.TopCenter
	 * An Anchor that is located at the top center of the element.
	 */
	/*
	 * Property: Anchors.BottomCenter
	 * An Anchor that is located at the bottom center of the element.
	 */
	/*
	 * Property: Anchors.LeftMiddle
	 * An Anchor that is located at the left middle of the element.
	 */
	/*
	 * Property: Anchors.RightMiddle
	 * An Anchor that is located at the right middle of the element.
	 */
	/*
	 * Property: Anchors.Center
	 * An Anchor that is located at the center of the element.
	 */
	/*
	 * Property: Anchors.TopRight
	 * An Anchor that is located at the top right corner of the element.
	 */
	/*
	 * Property: Anchors.BottomRight
	 * An Anchor that is located at the bottom right corner of the element.
	 */
	/*
	 * Property: Anchors.TopLeft
	 * An Anchor that is located at the top left corner of the element.
	 */
	/*
	 * Property: Anchors.BottomLeft
	 * An Anchor that is located at the bototm left corner of the element.
	 */
	/*
	 * Property: Anchors.AutoDefault
	 * Default DynamicAnchors - chooses from TopCenter, RightMiddle, BottomCenter, LeftMiddle.
	 */
	/*
	 * Property: Anchors.Assign
	 * An Anchor whose location is assigned at connection time, through an AnchorPositionFinder. Used in conjunction
	 * with the 'makeTarget' function. jsPlumb has two of these - 'Fixed' and 'Grid', and you can also write your own.
	 */
	/*
	 * Property: Anchors.Continuous
	 * An Anchor that tracks the other element in the connection, choosing the closest face.
	 */
    /*
    * Property: Anchors.ContinuousLeft
    * A continuous anchor that uses only the left edge of the element.
    */
    /*
    * Property: Anchors.ContinuousTop
    * A continuous anchor that uses only the top edge of the element.
    */            
    /*
    * Property: Anchors.ContinuousBottom
    * A continuous anchor that uses only the bottom edge of the element.
    */
    /*
    * Property: Anchors.ContinuousRight
    * A continuous anchor that uses only the right edge of the element.
    */
/*
	 * Property: Anchors.Perimeter
	 * An Anchor that tracks the perimeter of some shape, approximating it with a given number of dynamically
	 * positioned locations.
	 *
	 * Parameters:
	 *
	 * anchorCount  -   optional number of anchors to use to approximate the perimeter. default is 60.
	 * shape        -   required. the name of the shape. valid values are 'rectangle', 'square', 'ellipse', 'circle', 'triangle' and 'diamond'
	 * rotation     -   optional rotation, in degrees, to apply. 
	 */

// ---------------- ENDPOINT -----------------------------------------------------

/*
 * Class: Endpoint 
 * 
 * Models an endpoint. Can have 1 to 'maxConnections' Connections emanating from it (set maxConnections to -1 
 * to allow unlimited).  Typically, if you use 'jsPlumb.connect' to programmatically connect two elements, you won't
 * actually deal with the underlying Endpoint objects.  But if you wish to support drag and drop Connections, one of the ways you
 * do so is by creating and registering Endpoints using 'jsPlumb.addEndpoint', and marking these Endpoints as 'source' and/or
 * 'target' Endpoints for Connections.  
 * 
 * 
 */
/*
 * Function: Endpoint 
 * 
 * Endpoint constructor.
 * 
 * Parameters: 
 * anchor - definition of the Anchor for the endpoint.  You can include one or more Anchor definitions here; if you include more than one, jsPlumb creates a 'dynamic' Anchor, ie. an Anchor which changes position relative to the other elements in a Connection.  Each Anchor definition can be either a string nominating one of the basic Anchors provided by jsPlumb (eg. "TopCenter"), or a four element array that designates the Anchor's location and orientation (eg, and this is equivalent to TopCenter, [ 0.5, 0, 0, -1 ]).  To provide more than one Anchor definition just put them all in an array. You can mix string definitions with array definitions.
 * endpoint - optional Endpoint definition. This takes the form of either a string nominating one of the basic Endpoints provided by jsPlumb (eg. "Rectangle"), or an array containing [name,params] for those cases where you don't wish to use the default values, eg. [ "Rectangle", { width:5, height:10 } ].
 * enabled - optional, defaults to true. Indicates whether or not the Endpoint should be enabled for mouse events (drag/drop).
 * paintStyle - endpoint style, a js object. may be null. 
 * hoverPaintStyle - style to use when the mouse is hovering over the Endpoint. A js object. may be null; defaults to null.
 * cssClass - optional CSS class to set on the display element associated with this Endpoint.
 * hoverClass - optional CSS class to set on the display element associated with this Endpoint when it is in hover state.
 * source - element the Endpoint is attached to, of type String (an element id) or element selector. Required.
 * canvas - canvas element to use. may be, and most often is, null.
 * container - optional id or selector instructing jsPlumb where to attach the element it creates for this endpoint.  you should read the documentation for a full discussion of this.
 * connections - optional list of Connections to configure the Endpoint with. 
 * isSource - boolean. indicates the endpoint can act as a source of new connections. Optional; defaults to false.
 * maxConnections - integer; defaults to 1.  a value of -1 means no upper limit. 
 * dragOptions - if isSource is set to true, you can supply arguments for the underlying library's drag method. Optional; defaults to null. 
 * connectorStyle - if isSource is set to true, this is the paint style for Connections from this Endpoint. Optional; defaults to null.
 * connectorHoverStyle - if isSource is set to true, this is the hover paint style for Connections from this Endpoint. Optional; defaults to null.
 * connector - optional Connector type to use.  Like 'endpoint', this may be either a single string nominating a known Connector type (eg. "Bezier", "Straight"), or an array containing [name, params], eg. [ "Bezier", { curviness:160 } ].
 * connectorOverlays - optional array of Overlay definitions that will be applied to any Connection from this Endpoint. 
 * connectorClass - optional CSS class to set on Connections emanating from this Endpoint.
 * connectorHoverClass - optional CSS class to set on to set on Connections emanating from this Endpoint when they are in hover state.		 
 * connectionsDetachable - optional, defaults to true. Sets whether connections to/from this Endpoint should be detachable or not.
 * isTarget - boolean. indicates the endpoint can act as a target of new connections. Optional; defaults to false.
 * dropOptions - if isTarget is set to true, you can supply arguments for the underlying library's drop method with this parameter. Optional; defaults to null. 
 * reattach - optional boolean that determines whether or not the Connections reattach after they have been dragged off an Endpoint and left floating. defaults to false: Connections dropped in this way will just be deleted.
 * parameters - Optional JS object containing parameters to set on the Endpoint. These parameters are then available via the getParameter method.  When a connection is made involving this Endpoint, the parameters from this Endpoint are copied into that Connection. Source Endpoint parameters override target Endpoint parameters if they both have a parameter with the same name.
 * connector-pointer-events - Optional. a value for the 'pointer-events' property of any SVG elements that are created to render connections from this endoint.
 */

/*
 * Function: addConnection
 *   Adds a Connection to this Endpoint.
 *   
 * Parameters:
 *   connection - the Connection to add.
 */
/*
 * Function: detach
 *   Detaches the given Connection from this Endpoint.
 *   
 * Parameters:
 *   connection - the Connection to detach.
 *   ignoreTarget - optional; tells the Endpoint to not notify the Connection target that the Connection was detached.  The default behaviour is to notify the target.
 */
/*
         * Function: detachAll
         *   Detaches all Connections this Endpoint has.
         *
         * Parameters:
         *  fireEvent   -   whether or not to fire the detach event.  defaults to false.
         */
        /*
         * Function: detachFrom
         *   Removes any connections from this Endpoint that are connected to the given target endpoint.
         *   
         * Parameters:
         *   targetEndpoint     - Endpoint from which to detach all Connections from this Endpoint.
         *   fireEvent          - whether or not to fire the detach event. defaults to false.
         */
        /*
         * Function: detachFromConnection
         *   Detach this Endpoint from the Connection, but leave the Connection alive. Used when dragging.
         *   
         * Parameters:
         *   connection - Connection to detach from.
         */
        /*
         * Function: getElement
         *
         * Returns:
         * 	The DOM element this Endpoint is attached to.
         */
        /*
         * Function: setElement
         * Sets the DOM element this Endpoint is attached to.
         *
         * Parameters:
         * 	el	-	dom element or selector
         * 	container	-	optional, specifies the actual parent element to use as the parent for this Endpoint's visual representation.
         * 	See the jsPlumb documentation for a discussion about this.
         */
        /*
         * Function: getUuid
         *   Returns the UUID for this Endpoint, if there is one. Otherwise returns null.
         */
        /*
         * Function: isConnectedTo
         *   Returns whether or not this endpoint is connected to the given Endpoint.
         *   
         * Parameters:
         *   endpoint - Endpoint to test.
         */
        /*
         * Function: isFull
         *   Returns whether or not the Endpoint can accept any more Connections.
         */
        /*
         * Function: setDragAllowedWhenFull
         *   Sets whether or not connections can be dragged from this Endpoint once it is full. You would use this in a UI in 
         *   which you're going to provide some other way of breaking connections, if you need to break them at all. This property 
         *   is by default true; use it in conjunction with the 'reattach' option on a connect call.
         *   
         * Parameters:
         *   allowed - whether drag is allowed or not when the Endpoint is full.
         */    
        /*
         * Function: setStyle
         *   Sets the paint style of the Endpoint.  This is a JS object of the same form you supply to a jsPlumb.addEndpoint or jsPlumb.connect call.
         *   TODO move setStyle into EventGenerator, remove it from here. is Connection's method currently setPaintStyle ? wire that one up to
         *   setStyle and deprecate it if so.
         *   
         * Parameters:
         *   style - Style object to set, for example {fillStyle:"blue"}.
         *   
         *  @deprecated use setPaintStyle instead.
         */
        /*
         * Function: paint
         *   Paints the Endpoint, recalculating offset and anchor positions if necessary. This does NOT paint
         *   any of the Endpoint's connections.
         *   
         * Parameters:
         *   timestamp - optional timestamp advising the Endpoint of the current paint time; if it has painted already once for this timestamp, it will not paint again.
         *   canvas - optional Canvas to paint on.  Only used internally by jsPlumb in certain obscure situations.
         *   connectorPaintStyle - paint style of the Connector attached to this Endpoint. Used to get a fillStyle if nothing else was supplied.
         */
        /*
         * Function: bind
         * Bind to an event on the Endpoint.  
         * 
         * Parameters:
         * 	event - the event to bind.  Available events on an Endpoint are:
         *         - *click*						:	notification that a Endpoint was clicked.  
         *         - *dblclick*						:	notification that a Endpoint was double clicked.
         *         - *mouseenter*					:	notification that the mouse is over a Endpoint. 
         *         - *mouseexit*					:	notification that the mouse exited a Endpoint.
         * 		   - *contextmenu*                  :   notification that the user right-clicked on the Endpoint.
         *         
         *  callback - function to callback. This function will be passed the Endpoint that caused the event, and also the original event.    
         */
        
        /*
         * Function: setPaintStyle
         * Sets the Endpoint's paint style and then repaints the Endpoint.
         * 
         * Parameters:
         * 	style - Style to use.
         */

         /*
         * Function: getPaintStyle
         * Gets the Endpoint's paint style. This is not necessarily the paint style in use at the time;
         * this is the paint style for the Endpoint when the mouse it not hovering over it.
         */
        
        /*
         * Function: setHoverPaintStyle
         * Sets the paint style to use when the mouse is hovering over the Endpoint. This is null by default.
         * The hover paint style is applied as extensions to the paintStyle; it does not entirely replace
         * it.  This is because people will most likely want to change just one thing when hovering, say the
         * color for example, but leave the rest of the appearance the same.
         * 
         * Parameters:
         * 	style - Style to use when the mouse is hovering.
         *  doNotRepaint - if true, the Endpoint will not be repainted.  useful when setting things up initially.
         */
        
        /*
         * Function: setHover
         * Sets/unsets the hover state of this Endpoint.
         * 
         * Parameters:
         * 	hover - hover state boolean
         * 	ignoreAttachedElements - if true, does not notify any attached elements of the change in hover state.  used mostly to avoid infinite loops.
         */

         /*
         * Function: getParameter
         * Gets the named parameter; returns null if no parameter with that name is set. Parameters may have been set on the Endpoint in the 'addEndpoint' call, or they may have been set with the setParameter function.
         *
         * Parameters:
         *   key - Parameter name.
         */

         /*
         * Function: setParameter
         * Sets the named parameter to the given value.
         *
         * Parameters:
         *   key - Parameter name.
         *   value - Parameter value.
         */
         
         /*
         * Property: canvas
         * The Endpoint's drawing area.
         */
        /*
         * Property: connections
         * List of Connections this Endpoint is attached to.
         */
        /*
         * Property: scope
         * Scope descriptor for this Endpoint.
         */
        
        /*
         * Property: overlays
         * List of Overlays for this Endpoint.
         */
        /*
         * Function: addOverlay
         * Adds an Overlay to the Endpoint.
         * 
         * Parameters:
         * 	overlay - Overlay to add.
         */
        /*
         * Function: getOverlay
         * Gets an overlay, by ID. Note: by ID.  You would pass an 'id' parameter
         * in to the Overlay's constructor arguments, and then use that to retrieve
         * it via this method.
         */
        /*
        * Function: getOverlays
        * Gets all the overlays for this component.
        */
        /*
         * Function: hideOverlay
         * Hides the overlay specified by the given id.
         */
        /*
         * Function: hideOverlays
         * Hides all Overlays
         */
        /*
         * Function: showOverlay
         * Shows the overlay specified by the given id.
         */
        /*
         * Function: showOverlays
         * Shows all Overlays 
         */
        /*
         * Function: removeAllOverlays
         * Removes all overlays from the Endpoint, and then repaints.
         */
        /*
         * Function: removeOverlay
         * Removes an overlay by ID.  Note: by ID.  this is a string you set in the overlay spec.
         * Parameters:
         * overlayId - id of the overlay to remove.
         */
        /*
         * Function: removeOverlays
         * Removes a set of overlays by ID.  Note: by ID.  this is a string you set in the overlay spec.
         * Parameters:
         * overlayIds - this function takes an arbitrary number of arguments, each of which is a single overlay id.
         */
        /*
         * Function: setLabel
         * Sets the Endpoint's label.  
         * 
         * Parameters:
         * 	l	- label to set. May be a String, a Function that returns a String, or a params object containing { "label", "labelStyle", "location", "cssClass" }.  Note that this uses innerHTML on the label div, so keep
         * that in mind if you need escaped HTML.
         */
        /*
            Function: getLabel
            Returns the label text for this Endpoint (or a function if you are labelling with a function).
            This does not return the overlay itself; this is a convenience method which is a pair with
            setLabel; together they allow you to add and access a Label Overlay without having to create the
            Overlay object itself.  For access to the underlying label overlay that jsPlumb has created,
            use getLabelOverlay.
        */
        /*
            Function: getLabelOverlay
            Returns the underlying internal label overlay, which will exist if you specified a label on
            an addEndpoint call, or have called setLabel at any stage.   
        */
/*
            Function: isVisible
            Returns whether or not the Endpoint is currently visible.
        */    
        /*
            Function: setVisible
            Sets whether or not the Endpoint is currently visible.

            Parameters:
                visible - whether or not the Endpoint should be visible.
                doNotChangeConnections - Instructs jsPlumb to not pass the visible state on to any attached Connections. defaults to false.
                doNotNotifyOtherEndpoint - Instructs jsPlumb to not pass the visible state on to Endpoints at the other end of any attached Connections. defaults to false. 
        */

// ---------------- / ENDPOINT -----------------------------------------------------

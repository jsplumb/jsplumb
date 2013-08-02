/**
* @name jsPlumbInstance
* @class
* @extends jsPlumbUtil.EventGenerator
* @classdesc This class models an instance of jsPlumb.  The global object {@link jsPlumb} is both a static module
* and an instance of this class, and it is an instance of this class that is returned from {@link jsPlumb.getInstance}.
* A jsPlumbInstance manages a set of Endpoints and Connections.
*/

/**
* @name #importDefaults
* @function
* @memberOf jsPlumbInstance
* @param {Object} defaults The defaults to import.
* @returns {jsPlumbInstance} The current jsPlumb instance.
* @desc Imports all the given defaults into this instance of jsPlumb.		
*/		

/**
* @name jsPlumbInstance#restoreDefaults
* @function
* @returns {jsPlumbInstance} The current jsPlumb instance.
* @desc Restores the default settings to "factory" values.
*/

/**
* @name jsPlumbInstance#setDraggable
* @function
* @desc Sets whether or not the given element(s) should be draggable, regardless of what a particular plumb command may request.
* @param {String|Object|Array} el Some identifier for the element(s) - may be a string id, a selector, or an array of ids/selectors
* @param {Boolean} draggable Whether or not the given element(s) should be draggable.
*/

/**
* @name jsPlumbInstance#addEndpoint
* @function
* @param {String|Object|Array} el Element to add the endpoint to. Either an element id, a selector representing some element(s), or an array of either of these. 
* @param {Object} [params] Object containing Endpoint constructor arguments.  For more information, see {@link Endpoint}
* @param {Object} [referenceParams] Object containing more Endpoint constructor arguments; it will be merged with params by jsPlumb.  You would use this if you had some 
* shared parameters that you wanted to reuse when you added Endpoints to a number of elements. The allowed values in this object are anything that 'params' can contain.  See <Endpoint>.	
* @desc Adds an {@link Endpoint} to a given element or elements.
* @returns {Object|Array} The newly created Endpoint, if `el` referred to a single element.  Otherwise, an array of newly created `Endpoint`s. 
* @see {@link jsPlumbInstance#addEndpoints}
*/

/**
* @name jsPlumbInstance#addEndpoints
* @function
* @param {String|Object|Array} target Element to add the Endpoint to. Either an element id, a selector representing some element(s), or an array of either of these. 
* @param {Array} endpoints List of objects containing Endpoint constructor arguments. one Endpoint is created for each entry in this list.  See {@link Endpoint}'s constructor documentation. 
* @param {Object} [referenceParams] Object containing more Endpoint constructor arguments; it will be merged with params by jsPlumb.  You would use this if you had some shared parameters that you wanted to reuse when you added Endpoints to a number of elements.		  	 
* @returns {Array} List of newly created Endpoints, one for each entry in the `endpoints` argument. 
* @desc Adds a list of Endpoints to a given element or elements.
* @see {@link jsPlumbInstance#addEndpoint}
*/

/**
* @name jsPlumbInstance#connect
* @function
* @param {Object} params Connection params
* @param {String|Object|Endpoint} params.source Source of the connection. May be an id, or an element, or an Endpoint.
* @param {String|Object|Endpoint} params.target Target of the connection. May be an id, or an element, or an Endpoint.
* @param {Object} referenceParams Optional second set of parameters, which will be merge into a new object along with `params`. This can be useful if
* you have some common settings to share between multiple `connect` calls.
* @desc Establishes a {@link Connection} between two elements (or {@link Endpoint}s, which are themselves registered to elements).
* @returns {Connection} The Connection that was created.
*/

/**
* @name jsPlumbInstance#registerConnectionType
* @function
* @param {String} typeId Id of the type
* @param {Object} type Object containing the type specification.
* @desc Registers the given connection type on this instance of jsPlumb.
*/

/**
 * @name jsPlumbInstance#setSuspendDrawing
 * @desc Suspends drawing operations.  This can (and should!) be used when you have a lot of connections to make or endpoints to register;
 * it will save you a lot of time.
 * @function
 * @param {Boolean} val	Indicates whether to suspend or not
 * @param {Boolean} [repaintAfterwards=false]	Instructs jsPlumb to do a full repaint after changing the suspension state.
 */

 /**
 * @name jsPlumbInstance#isSuspendDrawing
 * @function
 * @desc Returns whether or not drawing is currently suspended.
 * @returns True if drawing suspended, false otherwise.
 */ 

 /**
 * @name jsPlumbInstance#doWhileSuspended
 * @function
 * @desc Suspends drawing, runs the given function, then re-enables drawing (and repaints, unless
 * you set 'doNotRepaintAfterwards' to true)
 */

/**
* @name jsPlumbInstance#animate
* @function
* @desc This is a wrapper around the supporting library's animate function; it injects a call to jsPlumb in the 'step' function (creating
* the 'step' function if necessary). This only supports the two-arg version of the animate call in jQuery, the one that takes an 'options' object as
* the second arg. MooTools has only one method, a two arg one. Which is handy.  YUI has a one-arg method, so jsPlumb merges 'properties' and 'options' together for YUI.
* @param {String|Element|Selector} el Element to animate. Either an id, or a selector representing the element. 
* @param {Object} [properties] The 'properties' argument you want passed to the library's animate call. 
* @param {Object} [options] The 'options' argument you want passed to the library's animate call.      
*/

/**
* @name jsPlumbInstance#getDefaultEndpointType
* @function
* @desc Returns the default Endpoint type. Used when someone wants to subclass Endpoint and have jsPlumb return instances of their subclass.
*  you would make a call like this in your class's constructor:
*  
*    `jsPlumb.getDefaultEndpointType().apply(this, arguments);`
*  
* @returns The default Endpoint function used by jsPlumb.
*/

/**
 * @name jsPlumbInstance#getDefaultConnectionType
 * @function
 * @desc Returns the default Connection type. Used when someone wants to subclass Connection and have jsPlumb return instances of their subclass.
 *  you would make a call like this in your class's constructor:
 *  
 *    `jsPlumb.getDefaultConnectionType().apply(this, arguments);`
 * 
 * @returns The default Connection function used by jsPlumb.
 */

 /**
  * @name jsPlumbInstance#getConnections
  * @function
  * @desc Gets all or a subset of connections currently managed by this jsPlumb instance.  If only one scope is passed in to this method,
  * the result will be a list of connections having that scope (passing in no scope at all will result in jsPlumb assuming you want the
  * default scope).
  *
  * If multiple scopes are passed in, the return value will be a map of
  *
  *    `{ scope -> [ connection... ] }`
  * 
  *  Parameters:
  *
  *  	- scope	-	if the only argument to getConnections is a string, jsPlumb will treat that string as a scope filter, and return a list
  *                  of connections that are in the given scope. use '*' for all scopes.
  *      - options	-	if the argument is a JS object, you can specify a finer-grained filter:
  *      
  *      		-	*scope* may be a string specifying a single scope, or an array of strings, specifying multiple scopes. Also may have the value '*', indicating any scope.
  *      		-	*source* either a string representing an element id, a selector, or an array of ids. Also may have the value '*', indicating any source.  Constrains the result to connections having this/these element(s) as source.
  *      		-	*target* either a string representing an element id, a selector, or an array of ids. Also may have the value '*', indicating any target.  Constrains the result to connections having this/these element(s) as target.		 
  *		flat    -	return results in a flat array (don't return an object whose keys are scopes and whose values are lists per scope).
  * 
  * @return {Array|Map} If only one scope was requested, a list of Connections that match the criteria. Otherwise, a map of [scope->connection lists].
  */

/*
* @name jsPlumbInstance#select
* @function
* @desc Selects a set of Connections, using the filter options from the getConnections method, and returns an object
* that allows you to perform an operation on all of the Connections at once.
*
* The return value from any of these operations is the original list of Connections, allowing operations to be
* chained (for 'setter' type operations). 'getter' type operations return an array of values, where each entry is
* of the form:
*
*    `[ Connection, return value ]`
* 
* @param {String|String[]} [params.scope] scope - see getConnections
* @param {String|String[]} [params.source] - see getConnections
* @param {String|String[]} [params.target] - see getConnections
* @param {Connection[]} [params.connections] - an existing list of Connections.  If you supply this, 'source' and 'target' will be ignored.
*
* @returns A list of Connections on which operations may be executed. 'Setter' type operations can be chained; 'getter' type operations
* return an array of [Connection, value] pairs, one entry for each Connection in the list returned. The full list of operations 
* is as follows (where not specified, the operation's effect or return value is the same as the corresponding method on Connection) :
* 				
* - **addClass**
* -	**addOverlay**
* -	**addType**
* -	**detach** : detaches all the connections in the list. not chainable and does not return anything.		
* -	**each(function(connection)...)** : allows you to specify your own function to execute; this function is chainable.		
* -	**get(index)** : returns the Connection at 'index' in the list.			
* -	**getHoverPaintStyle**
* - **getLabel**
* -	**getOverlay**
* -	**getPaintStyle**		
* -	**getParameter**
* -	**getParameters**
* -	**getType**
* -	**getZIndex**
* -	**hasType**		
* -	**hideOverlay**
* -	**hideOverlays**		
* -	**isDetachable**		
* -	**isHover**
* -	**isReattach**
* -	**isVisible**		
* -	**length** : returns the length of the list.
* -	**removeAllOverlays**		
* - **removeClass**
* -	**removeOverlay**
* -	**removeOverlays**
* -	**removeType**
* -	**repaint**	
* -	**setConnector**		
* -	**setDetachable**
* -	**setHover**		
* -	**setHoverPaintStyle**		
* -	**setLabel**		
* -	**setPaintStyle**	
* -	**setParameter**
* -	**setParameters**
* - **setReattach**	
* -	**setType**	
* -	**showOverlay**	
* -	**showOverlays**
*/  

/**
* @name jsPlumbInstance#selectEndpoints
* @function
* @desc Selects a set of Endpoints and returns an object that allows you to execute various different methods on them at once. The return 
* value from any of these operations is the original list of Endpoints, allowing operations to be chained (for 'setter' type 
* operations). 'getter' type operations return an array of values, where each entry is of the form:
*
*     `[ Endpoint, return value ]`
* 
* @param {String|String[]} [params.scope] Scope(s) to match
* @param {String|Element|Selector|Array} [params.source] - limits returned endpoints to those that are declared as a source endpoint on any elements identified.
* @param {String|Element|Selector|Array} [params.target] - limits returned endpoints to those that are declared as a target endpoint on any elements identified.
* @param {String|Element|Selector|Array} [params.element] - limits returned endpoints to those that are declared as either a source OR a target endpoint on any elements identified.		
*
* @returns A list of Endpoints on which operations may be executed. 'Setter' type operations can be chained; 'getter' type operations
* return an array of `[Endpoint, value]` pairs, one entry for each Endpoint in the list returned. 
*
* The full list of operations is as follows (where not specified, the operation's effect or return value is the
* same as the corresponding method on Endpoint) :
* 
* -	**setHover**
* -	**removeAllOverlays**
* -	**setLabel**
* - **addClass**
* -	**addOverlay**
* - **removeClass**
* -	**removeOverlay**
* -	**removeOverlays**
* -	**showOverlay**
* -	**hideOverlay**
* -	**showOverlays**
* -	**hideOverlays**
* -	**setPaintStyle**
* -	**setHoverPaintStyle**
* -	**setParameter**
* -	**setParameters**
* -	**setAnchor**
* - **getLabel**
* -	**getOverlay**
* -	**isHover**
* -	**isDetachable**
* -	**getParameter**
* -	**getParameters**
* -	**getPaintStyle**
* -	**getHoverPaintStyle**
* -	**detachAll** : Detaches all the Connections from every Endpoint in the list. not chainable and does not return anything.
* -	**delete** : Deletes every Endpoint in the list. not chainable and does not return anything.		
* -	**length** : returns the length of the list.
* -	**get(index)** : returns the Endpoint at 'index' in the list.
* -	**each(function(endpoint)...)** : allows you to specify your own function to execute; this function is chainable.
*/

/**
* @name jsPlumbInstance#isHoverSuspended
* @function
* @returns Whether or not hover effects are currently suspended.
*/

/*
* @name jsPlumbInstance#setHoverSuspended
* @function
* @desc Sets whether or not hover effects should be suspended. jsPlumb uses this internally during various
* drag/drop operations, and it is exposed because it might also be useful for you too.
* @param {Boolean} hover whether or not to set hover suspended.
*/

/**
* @name jsPlumbInstance#hide
* @desc Sets an element's connections to be hidden.
* @function
* @param {String|Element|Selector| el Element to hide connections for.
* @param {Boolean} [changeEndpoints=false] Whether not to also hide endpoints on the element.
* @returns {jsPlumbInstance} The jsPlumb instance.
*/

/**
* @name jsPlumbInstance#show
* @desc Sets an element's connections to be visible.
* @function
* @param {String|Element|Selector| el Element to show connections for.
* @param {Boolean} [changeEndpoints=false] Whether or not to also change the visible state of the endpoints on the element.  this also has a bearing on
*  other connections on those endpoints: if their other endpoint is also visible, the connections are made visible.  
* @returns {jsPlumbInstance} The current jsPlumb instance.
*/

/**
* @name jsPlumbInstance#toggleVisible
* @desc Toggles visibility of an element's Connections.
* @function
* @param {String|Element|Selector| el Element to toggle visibility for.
* @param {Boolean} [changeEndpoints=false] Whether or not to also toggle the endpoints on the element.
* @returns {null} But should be updated to return the current state.
*/

/**
* @name jsPlumbInstance#toggleDraggable
* @desc Toggles draggability (sic?) of an element's Connections.
* @function
* @param {String|Element|Selector| el The element for which to toggle draggability.
* @returns {Boolean} The current draggable state.
*/   

/**
 * @name jsPlumbInstance#setDraggable
 * @desc Sets whether or not a given element is draggable, regardless of what any jsPlumb command may request.
 * @param {String|Element|Selector} el The element to set draggable or not.
 * @param {Boolean} draggable Whether or not the element should be draggable. 
 */

/**
 * @name jsPlumbInstance#recalculateOffsets
 * @desc Recalculates the offsets of all child elements of some element. If you have Endpoints registered on the
 * descendants of some element and you make changes to that element's markup, it is possible that the location
 * of each Endpooint relative to the origin of the element may have changed. So you call this to tell jsPlumb to
 * recalculate.  You need to do this because, for performance reasons, jsplumb won't calculate these offsets on
 * the fly.
 * @function
 * @param {String|Element|Selector| el The element for which to recalculate offsets.
 */

/*
* @name jsPlumbInstance#setId
* @desc Changes the id of some element, adjusting all connections and endpoints
* @param {String|Element|Selector| el Element to change id on.
* @param {String} newId The new id to set.
* @param {Boolean} [doNotSetAttribute=false] If true, the id on the DOM element wont be changed. 
*/ 

 /**
 * @name jsPlumbInstance#setIdChanged
 * @desc Notify jsPlumb that the element with oldId has had its id changed to newId.
 *
 * This method is equivalent to what jsPlumb does itself in the second step of the setId method.
 * @param {String} oldId Previous element id
 * @param {String{ newId Element's new id
 *
 * @see jsPlumbInstance#setId
 */

 /**
  * @name jsPlumbInstance#getAllConnections
  * @function
  * @returns {Object} All connections, as a map of the form:
  *
  *  `{ scope -> [ connection... ] }`
  */

  /**
   * @name jsPlumbInstance#getDefaultScope
   * @function
   * @desc Gets the default scope for connections and endpoints.
   *
   * A scope defines a type of endpoint/connection; supplying a
   * scope to an Endpoint or Connection allows you to support different
   * types of connections in the same UI. but if you're only interested in
   * one type of connection, you don't need to supply a scope. this method
   * will probably be used by very few people; it's good for testing
   * though.
   * @returns {String} The default scope for the given jsPlumbInstance
   */  

   /**
    * @name jsPlumbInstance#getEndpoints
    * @function
    * @desc Gets the list of Endpoints for a given element.
    * @param {String|Element|Selector} el The element to get endpoints for.
    * @returns {Endpoint[]} An array of Endpoints for the specified element.
    */   

/**
* name getEndpoint(uuid)
 Gets an Endpoint by UUID
  
 Parameters: 
 	uuid - the UUID for the Endpoint
 	 
 Returns: 
 	Endpoint with the given UUID, null if nothing found.
*/ 

/**
 * @name jsPlumb.Anchors.Top
 * @desc An Anchor that is located at the top center of the element.
 */
/**
 * @name jsPlumb.Anchors.Bottom
 * @desc An Anchor that is located at the bottom center of the element.
 */
/**
 * @name jsPlumb.Anchors.Left
 * @desc An Anchor that is located at the left middle of the element.
 */
/**
 * @name jsPlumb.Anchors.Right
 * @desc An Anchor that is located at the right middle of the element.
 */
/**
 * @name jsPlumb.Anchors.Center
 * @desc An Anchor that is located at the center of the element.
 */
/**
 * @name jsPlumb.Anchors.TopRight
 * @desc An Anchor that is located at the top right corner of the element.
 */
/**
 * @name jsPlumb.Anchors.BottomRight
 * @desc An Anchor that is located at the bottom right corner of the element.
 */
/**
 * @name jsPlumb.Anchors.TopLeft
 * @desc An Anchor that is located at the top left corner of the element.
 */
/**
 * @name jsPlumb.Anchors.BottomLeft
 * @desc An Anchor that is located at the bototm left corner of the element.
 */
/**
 * @name jsPlumb.Anchors.AutoDefault
 * @desc Default DynamicAnchors - chooses from TopCenter, RightMiddle, BottomCenter, LeftMiddle.
 */
/**
 * @name jsPlumb.Anchors.Assign
 * @desc An Anchor whose location is assigned at connection time, through an AnchorPositionFinder. Used in conjunction
 * with the 'makeTarget' function. jsPlumb has two of these - 'Fixed' and 'Grid', and you can also write your own.
 */
/**
 * @name jsPlumb.Anchors.Continuous
 * @desc An Anchor that tracks the other element in the connection, choosing the closest face.
 */
/**
* @name jsPlumb.Anchors.ContinuousLeft
* @desc A continuous anchor that uses only the left edge of the element.
*/
/**
* @name jsPlumb.Anchors.ContinuousTop
* @desc A continuous anchor that uses only the top edge of the element.
*/            
/**
* @name jsPlumb.Anchors.ContinuousBottom
* @desc A continuous anchor that uses only the bottom edge of the element.
*/
/**
* @name jsPlumb.Anchors.ContinuousRight
* @desc A continuous anchor that uses only the right edge of the element.
*/
/**
 * @name jsPlumb.Anchors.Perimeter
 * @desc An Anchor that tracks the perimeter of some shape, approximating it with a given number of dynamically
 * positioned locations.
 *
 * @param {Integer} [anchorCount] Optional number of anchors to use to approximate the perimeter. default is 60.
 * @param {String} shape Required. the name of the shape. valid values are 'rectangle', 'square', 'ellipse', 'circle', 'triangle' and 'diamond'
 * @param {Number} [rotation] Optional rotation, in degrees, to apply. 
 */

 // SP

/**
* @name jsPlumbInstance#makeTarget
* @function
* @desc Makes some DOM element a Connection target, allowing you to drag connections to it
* without having to register any Endpoints on it first.  When a Connection is established,
* the endpoint spec that was passed in to this method is used to create a suitable 
* Endpoint (the default will be used if you do not provide one).
* @param {String|Element|Selector} el Element to turn into a connection target.
* @param {Object} params	-	JS object containing parameters:
* 	  - *endpoint*	optional.	specification of an Endpoint to create when a Connection is established.
* 	  - *scope*		optional.   scope for the drop zone.
* 	  - *dropOptions* optional. same stuff as you would pass to dropOptions of an Endpoint definition.
* 	  - *deleteEndpointsOnDetach*  optional, defaults to true. whether or not to delete
*                             any Endpoints created by a connection to this target if
*                             the connection is subsequently detached. this will not 
*                             remove Endpoints that have had more Connections attached
*                             to them after they were created.
*   - *maxConnections*  optional. Specifies the maximum number of Connections that can be made to this element as a target. Default is no limit.
*   - *onMaxConnections* optional. Function to call when user attempts to drop a connection but the limit has been reached.
*   		The callback is passed two arguments: a JS object with:
*   		: { element, connection, maxConnection }
*   		...and the original event.		 
*/

/**
* @name jsPlumbInstance#unmakeTarget
* @function
* @desc Sets the given element to no longer be a connection target.
* @param {String|Element|Selector} el Element to unmake as a connection target.
* @returns {jsPlumbInstance} The current jsPlumb instance.
*/ 

/*
* @name jsPlumbInstance# makeTargets(els, [params], [referenceParams])
* Makes all elements in some array or a selector connection targets.
* 
* Parameters:
* 	els 	- 	either an array of ids or a selector
*  params  -   parameters to configure each element as a target with
*  referenceParams - extra parameters to configure each element as a target with.
*
* Returns:
* The current jsPlumb instance.
*/

/*
* @name jsPlumbInstance# makeSource(el, [params])
* Makes some DOM element a Connection source, allowing you to drag connections from it
* without having to register any Endpoints on it first.  When a Connection is established,
* the endpoint spec that was passed in to this method is used to create a suitable 
* Endpoint (the default will be used if you do not provide one).
* 
* Parameters:
*  el		-	string id or element selector for the element to make a source.
* 	params	-	JS object containing parameters:
* 	  - *endpoint*	optional.	specification of an endpoint to create when a connection is created.
* 	  - *parent*	optional.   the element to add Endpoints to when a Connection is established.  if you omit this, 
*                          Endpoints will be added to 'el'.
* 	  - *scope*		optional.   scope for the connections dragged from this element.
* 	  - *dragOptions* optional. same stuff as you would pass to dragOptions of an Endpoint definition.
* 	  - *deleteEndpointsOnDetach*  optional, defaults to false. whether or not to delete
*                             any Endpoints created by a connection from this source if
*                             the connection is subsequently detached. this will not 
*                             remove Endpoints that have had more Connections attached
*                             to them after they were created.
* 	  - *filter* - optional function to call when the user presses the mouse button to start a drag. This function is passed the original 
* event and the element on which the associated makeSource call was made.  If it returns anything other than false,
* the drag begins as usual. But if it returns false (the boolean false, not just something falsey), the drag is aborted.		 
*/      


/*
*	@name jsPlumbInstance# unmakeSource(el)
*	Sets the given element to no longer be a connection source.
*	
*	Parameters:
*		el - a string id, a dom element, or a selector representing the element.
*		
*	Returns:
*	The current jsPlumb instance.
*/

/*
*	@name jsPlumbInstance# unmakeEverySource()
*	Resets all elements in this instance of jsPlumb so that none of them are connection sources.
*	
*	Returns:
*	The current jsPlumb instance.
*/
/*
*	@name jsPlumbInstance# unmakeEveryTarget()
*	Resets all elements in this instance of jsPlumb so that none of them are connection targets.
*	
*	Returns:
*	The current jsPlumb instance.
*/

/*
* @name jsPlumbInstance# makeSources(els, [params], [referenceParams])
* Makes all elements in some array or a selector connection sources.
* 
* Parameters:
* 	els 	- 	either an array of ids or a selector
*  params  -   parameters to configure each element as a source with
*  referenceParams - extra parameters to configure each element as a source with.
*
* Returns:
* The current jsPlumb instance.
*/

/*
* @name jsPlumbInstance# setSourceEnabled(el, state)
* Sets the enabled state of one or more elements that were previously made a connection source with the makeSource
* method.
*
* Parameters:
*	el 	- 	either a string representing some element's id, or an array of ids, or a selector.
*	state - true to enable the element(s), false to disable it.
*
* Returns:
*	The current jsPlumb instance.
*/

/*
*	@name jsPlumbInstance# toggleSourceEnabled(el)
*	Toggles the source enabled state of the given element or elements.
*
* 	Parameters:
*		el 	- 	either a string representing some element's id, or an array of ids, or a selector.
*
*	Returns:
*	The current enabled state of the source.
*/

/*
*	@name jsPlumbInstance# isSource(el)
*	Returns whether or not the given element is registered as a connection source.
*
*	Parameters:
*		el 	- 	a string id, a dom element, or a selector representing a single element.
*
*	Returns:
*	True if source, false if not.
*/

/*
*	@name jsPlumbInstance# isSourceEnabled(el)
*	Returns whether or not the given connection source is enabled.
*
*	Parameters:
*	el 	- 	a string id, a dom element, or a selector representing a single element.
*
*	Returns:
*	True if enabled, false if not.
*/

/*
*	@name jsPlumbInstance# setTargetEnabled(el, state)
*	Sets the enabled state of one or more elements that were previously made a connection target with the makeTarget method.
*	method.
*
*	Parameters:
*		el 	- 	either a string representing some element's id, or an array of ids, or a selector.
*		state - true to enable the element(s), false to disable it.
*
*	Returns:
*	The current jsPlumb instance.
*/

/*
*	@name jsPlumbInstance# toggleTargetEnabled(el)
*	Toggles the target enabled state of the given element or elements.
*
*	Parameters:
*		el 	- 	either a string representing some element's id, or an array of ids, or a selector.
*
*	Returns:
*	The current enabled state of the target.
*/

/*
@name jsPlumbInstance# isTarget(el)
Returns whether or not the given element is registered as a connection target.

Parameters:
	el 	- 	a string id, a dom element, or a selector representing a single element.

Returns:
True if source, false if not.
*/

/*
@name jsPlumbInstance# isTargetEnabled(el)
Returns whether or not the given connection target is enabled.

Parameters:
	el 	- 	a string id, a dom element, or a selector representing a single element.

Returns:
True if enabled, false if not.
*/

/*
* @name jsPlumbInstance# ready(fn)
* Helper method to bind a function to jsPlumb's ready event. You should use this method instead of your
* library's equivalent, to ensure that jsPlumb has loaded properly before you start to use it. This is
* particularly true in the case of YUI, because of the asynchronous nature of the module loading process.
* 
* Parameters:
* fn - function to call once the instance is ready.
*/

/*
* @name jsPlumbInstance# repaint (el)
* Repaints an element and its connections. This method gets new sizes for the elements before painting anything.
*  
* Parameters: 
*	el - id of the element, a dom element, or a selector representing the element.
*  	 
* Returns: 
*	The current jsPlumb instance.
*  	 
* See Also: 
*	<repaintEverything>
*/

/*
* @name jsPlumbInstance# repaintEverything() 
* Repaints all connections and endpoints.
*  
* Returns: 
*	The current jsPlumb instance.
* 	
* See Also: 
*	<repaint>
*/

	/*
	* @name jsPlumbInstance# removeAllEndpoints(el, [recurse]) 
	* Removes all Endpoints associated with a given element. 
* Also removes all Connections associated with each Endpoint it removes. jsPlumb expects
* that the element referenced here exists in the DOM. If it does not, or you are uncertain
* whether it will exist or not, use jsPlumb.remove.
	* 
	* Parameters: 
	*	el - either an element id, or a selector for an element.
  *   recurse - whether or not to recurse down through this elements children and remove their endpoints too. defaults to false.
	*  	 
	* Returns: 
	* The current jsPlumb instance.
	*  	 
	* See Also: 
	* <deleteEndpoint>
	*/

	/*
	* @name jsPlumbInstance# remove(el)
	* Removes the given element from the DOM, along with all Endpoints associated with it,
	* and their connections.  This is present in jsPlumb since version 1.4.2. 
	*
	* Parameters:
	*  el - either an element id, a DOM element, or a selector for the element.
	*/ 	

	/*
	* @name jsPlumbInstance#reset()
	* Removes all endpoints and connections and clears the listener list. To keep listeners call
	* : jsPlumb.deleteEveryEndpoint()
	* instead of this.
	*/

	/*
	 * @name jsPlumbInstance# setDefaultScope(scope)
	 * Sets the default scope for Connections and Endpoints. A scope defines a type of Endpoint/Connection; supplying a
	 * scope to an Endpoint or Connection allows you to support different
	 * types of Connections in the same UI.  If you're only interested in
	 * one type of Connection, you don't need to supply a scope. This method
	 * will probably be used by very few people; it just instructs jsPlumb
	 * to use a different key for the default scope.
	 * 
	 * Parameters:
	 * 	scope - scope to set as default.
	 *
	 * Returns:
	 * The current jsPlumb instance.
	 */ 

	

	  




/**
* This is a static jsPlumbInstance that is created and registered on the window, really just for the sake of conveniense:  you do not have to use this; you can create your own instances using
* the {{#crossLink "jsPlumbInstance/getInstance:method"}}{{/crossLink}} method. For a list of the available methods and properties on this object,
* see the {{#crossLink "jsPlumbInstance"}}{{/crossLink}} API docs.
* @class jsPlumb
* @static
* @extends jsPlumbInstance
*/

/**
* This class models an instance of jsPlumb.  The global object {{#crossLink "jsPlumb"}}{{/crossLink}} is both a static module
* and an instance of this class, and it is an instance of this class that is returned from {{#crossLink "jsPlumb"}}{{/crossLink}}.
* A jsPlumbInstance manages a set of Endpoints and Connections.
* @class jsPlumbInstance
* @extends jsPlumbUtil.EventGenerator
*/

/**
* Imports all the given defaults into this instance of jsPlumb.   
* @method importDefaults
* @param {Object} defaults The defaults to import.
* @chainable
* @return {jsPlumbInstance} The current jsPlumb instance.
*/		

/**
* Restores the default settings to "factory" values.
* @method restoreDefaults
* @chainable
* @return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
* Sets the current element to use as the Container for the given jsPlumbInstance - the element that will be the parent for
* all artefacts added by jsPlumb. By default, the Container is set to the offsetParent of the first element on which 
* `connect`, `addEndpoint`, `makeSource` or `makeTarget` is called, but you are encouraged to set a Container either in the
* arguments to the `jsPlumb.newInstance(...)` method, or via `jsPlumbInstance.importDefaults`.
* @method setContainer
* @param {String|Element|Selector} container Either an element id, a DOM element, or a selector from the underlying library
*/

/**
* Gets the current element in use as the Container for the given jsPlumbInstance
* @method getContainer
* @return {Element} The current element in use as the Container.
*/

/**
* Sets whether or not the given element(s) should be draggable, regardless of what a particular method may request.
* @method setDraggable
* @param {String|Object|Array} el Some identifier for the element(s) - may be a string id, a selector, or an array of ids/selectors
* @param {Boolean} draggable Whether or not the given element(s) should be draggable.
*/

/**
* Adds an Endpoint to a given element or elements.
* @method addEndpoint
* @param {String|Object|Array} el Element to add the endpoint to. Either an element id, a selector representing some element(s), or an array of either of these. 
* @param {Object} [params] Object containing Endpoint constructor arguments.  For more information, see {@link Endpoint}
* @param {Object} [referenceParams] Object containing more Endpoint constructor arguments; it will be merged with params by jsPlumb.  You would use this if you had some 
* shared parameters that you wanted to reuse when you added Endpoints to a number of elements. The allowed values in this object are anything that 'params' can contain.  See <Endpoint>.	
* @return {Object|Array} The newly created Endpoint, if `el` referred to a single element.  Otherwise, an array of newly created `Endpoint`s. 
* @see jsPlumbInstance.addEndpoints
*/

/**
* Adds a list of Endpoints to a given element or elements.
* @method addEndpoints
* @param {String|Object|Array} target Element to add the Endpoint to. Either an element id, a selector representing some element(s), or an array of either of these. 
* @param {Array} endpoints List of objects containing Endpoint constructor arguments. one Endpoint is created for each entry in this list.  See {@link Endpoint}'s constructor documentation. 
* @param {Object} [referenceParams] Object containing more Endpoint constructor arguments; it will be merged with params by jsPlumb.  You would use this if you had some shared parameters that you wanted to reuse when you added Endpoints to a number of elements.		  	 
* @return {Array} List of newly created Endpoints, one for each entry in the `endpoints` argument. 
* @see {@link jsPlumbInstance#addEndpoint}
*/

/**
* Establishes a {@link Connection} between two elements (or {@link Endpoint}s, which are themselves registered to elements).
* @method connect
* @param {Object} params Connection params
* @param {String|Object|Endpoint} params.source Source of the connection. May be an id, or an element, or an Endpoint.
* @param {String|Object|Endpoint} params.target Target of the connection. May be an id, or an element, or an Endpoint.
* @param {String[]} [params.uuids] Optional array of UUIDs of the two Endpoints to connect. If you supply this you do not need to supply `source` or `target`.
* @param {String} [params.type] Optional type for the Connection.
* @param {String} [params.pointer-events] Optional `pointer-events` value for the Connection (only used by the SVG renderer)
* @param {Object} referenceParams Optional second set of parameters, which will be merged into a new object along with `params`. This can be useful if
* you have some common settings to share between multiple `connect` calls. Valid values in this object are anything that is valid in `params`.
* @return {Connection} The Connection that was created.
*/

/**
* Sets the source for some Connection. A `connectionMoved` event is fired.
* @method setSource
* @param {Connection} connection The connection to set the source for
* @param {String|Element|Endpoint} source Either an element, element id, or existing Endpoint. If you pass an element or element id for an element that
* has been registered as a Connection source via makeSource, the Endpoint properties from that call are used.
* @param {Boolean} [doNotRepaint=false] If true, the Connection will not be repainted after the source is changed.
* @return {jsPlumbInstance}  The current jsPlumb instance
*/

/**
* Sets the target for some Connection. A `connectionMoved` event is fired.
* @method setTarget
* @param {Connection} connection The connection to set the target for
* @param {String|Element|Endpoint} target Either an element, element id, or existing Endpoint. If you pass an element or element id for an element that
* has been registered as a Connection target via makeTarget, the Endpoint properties from that call are used.
* @param {Boolean} [doNotRepaint=false] If true, the Connection will not be repainted after the target is changed.
* @return {jsPlumbInstance}  The current jsPlumb instance
*/

/**
* Suspends drawing operations.  This can (and should!) be used when you have a lot of connections to make or endpoints to register;
* it will save you a lot of time.
 * @method setSuspendDrawing
 * @param {Boolean} val	Indicates whether to suspend or not
 * @param {Boolean} [repaintAfterwards=false]	Instructs jsPlumb to do a full repaint after changing the suspension state.
 */

 /**
 * Returns whether or not drawing is currently suspended.
 * @method isSuspendDrawing
 * @return {Boolean} True if drawing suspended, false otherwise.
 */ 

 /**
 * Suspends drawing, runs the given function, then re-enables drawing (and repaints, unless
 * you set 'doNotRepaintAfterwards' to true)
 * @method doWhileSuspended
 * @param {Function} fn Function to execute while drawing is suspended.
 * @param {Boolean} [doNotRepaintAfterwards=false] If true, will not run a repaint after running the function supplied to this function.
 */

/**
* This is a wrapper around the supporting library's animate function; it injects a call to jsPlumb in the 'step' function (creating
* the 'step' function if necessary). This only supports the two-arg version of the animate call in jQuery, the one that takes an 'options' object as
* the second arg. MooTools has only one method, a two arg one. Which is handy.  YUI has a one-arg method, so jsPlumb merges 'properties' and 'options' together for YUI.
* @method animate
* @param {String|Element|Selector} el Element to animate. Either an id, or a selector representing the element. 
* @param {Object} [properties] The 'properties' argument you want passed to the library's animate call. 
* @param {Object} [options] The 'options' argument you want passed to the library's animate call.      
*/

/**
* Returns the default Endpoint type. Used when someone wants to subclass Endpoint and have jsPlumb return instances of their subclass.
*  you would make a call like this in your class's constructor:
*  
*    `jsPlumb.getDefaultEndpointType().apply(this, arguments);`
*  
* @method getDefaultEndpointType
* @static
* @return The default Endpoint function used by jsPlumb.
*/

/**
* Returns the default Connection type. Used when someone wants to subclass Connection and have jsPlumb return instances of their subclass.
*  you would make a call like this in your class's constructor:
*  
*    `jsPlumb.getDefaultConnectionType().apply(this, arguments);`
* 
 * @method getDefaultConnectionType
 * @static
 * @return The default Connection function used by jsPlumb.
 */
 
 /**
 * Extends o1 with the properties of o2, optionally filtering via the values in filterList.
 * @method extend 
 * @static
 * @param {Object} o1 Object to extend into
 * @param {Object} o2 Object to extend from
 * @param {String[]} [filterList] Optional list of property names to filter by - if this is provided, only values whose keys are in this list will be copied into o1.
 * @return {Object} The object into which values were extended.
 */

 /**
  * Gets all or a subset of connections currently managed by this jsPlumb instance.  If only one scope is passed in to this method,
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
  * @method getConnections
  * @return {Array|Map} If only one scope was requested, a list of Connections that match the criteria. Otherwise, a map of [scope->connection lists].
  */

/**
* Selects a set of Connections, using the filter options from the getConnections method, and returns an object
* that allows you to perform an operation on all of the Connections at once.
*
* The return value from any of these operations is the original list of Connections, allowing operations to be
* chained (for 'setter' type operations). 'getter' type operations return an array of values, where each entry is
* of the form:
*
*    `[ Connection, return value ]`
* 
* @method select
* @param {Object} [params] Filter parameters. All of the values in this object are optional; if you supply no parameters at all you will get back all of the current Connections in the given jsPlumb instance.
* @param {String|String[]} [params.scope] scope - see getConnections
* @param {String|String[]} [params.source] - see getConnections
* @param {String|String[]} [params.target] - see getConnections
* @param {Connection[]} [params.connections] - an existing list of Connections.  If you supply this, 'source' and 'target' will be ignored.
*
* @return {Selection} A list of Connections on which operations may be executed. 'Setter' type operations can be chained; 'getter' type operations
* return an array of `[Connection, value]` pairs, one entry for each Connection in the list returned. The full list of operations 
* is as follows (where not specified, the operation's effect or return value is the same as the corresponding method on Connection) :
* 				
* - **addClass** : Adds a class to all the Connections in the list.
* -	**addOverlay** : Adds an Overlay to all the Connections in the list.
* -	**addType** : Adds a type to all the Connections in the list.
* -	**detach** : Detaches all the Connections in the list. Not chainable, and does not return anything.		
* -	**each(function(connection)...)** : Allows you to specify your own function to execute; this function is chainable.		
* -	**get(index)** : Returns the Connection at 'index' in the list.			
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
* Selects a set of Endpoints and returns an object that allows you to execute various different methods on them at once. The return 
* value from any of these operations is the original list of Endpoints, allowing operations to be chained (for 'setter' type 
* operations). 'getter' type operations return an array of values, where each entry is of the form:
*
*     `[ Endpoint, return value ]`
* 
* @method selectEndpoints
* @param {Object} [params] Filter parameters.
* @param {String|String[]} [params.scope=jsPlumb.DefaultScope] Scope(s) to match
* @param {String|Element|Selector|Array} [params.source] - limits returned endpoints to those that are declared as a source endpoint on any elements identified.
* @param {String|Element|Selector|Array} [params.target] - limits returned endpoints to those that are declared as a target endpoint on any elements identified.
* @param {String|Element|Selector|Array} [params.element] - limits returned endpoints to those that are declared as either a source OR a target endpoint on any elements identified.		
*
* @return {Selection} A list of Endpoints on which operations may be executed. 'Setter' type operations can be chained; 'getter' type operations
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
* @method isHoverSuspended
* @return {Boolean} Whether or not hover effects are currently suspended.
*/

/*
* Sets whether or not hover effects should be suspended. jsPlumb uses this internally during various
* drag/drop operations, and it is exposed because it might also be useful for you too.
* @method setHoverSuspended
* @param {Boolean} hover whether or not to set hover suspended.
*/

/**
* Sets an element's connections to be hidden.
* @method hide
* @param {String|Element|Selector} el Element to hide connections for.
* @param {Boolean} [changeEndpoints=false] Whether not to also hide endpoints on the element.
* @return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
* Sets an element's connections to be visible.
* @method show
* @param {String|Element|Selector} el Element to show connections for.
* @param {Boolean} [changeEndpoints=false] Whether or not to also change the visible state of the endpoints on the element.  this also has a bearing on
*  other connections on those endpoints: if their other endpoint is also visible, the connections are made visible.  
* @return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
* Toggles visibility of an element's Connections.
* @method toggleVisible
* @param {String|Element|Selector} el Element to toggle visibility for.
* @param {Boolean} [changeEndpoints=false] Whether or not to also toggle the endpoints on the element.
* @return {null} But should be updated to return the current state.
*/

/**
* Toggles draggability (sic?) of an element's Connections.
* @method toggleDraggable
* @param {String|Element|Selector} el The element for which to toggle draggability.
* @return {Boolean} The current draggable state.
*/   

/**
 * Recalculates the offsets of all child elements of some element. If you have Endpoints registered on the
 * descendants of some element and you make changes to that element's markup, it is possible that the location
 * of each Endpooint relative to the origin of the element may have changed. So you call this to tell jsPlumb to
 * recalculate.  You need to do this because, for performance reasons, jsplumb won't calculate these offsets on
 * the fly.
 * @method recalculateOffsets
 * @param {String|Element|Selector} el The element for which to recalculate offsets.
 */

/*
* Changes the id of some element, adjusting all Connections and Endpoints
* @method setId
* @param {String|Element|Selector} el Element to change id on.
* @param {String} newId The new id to set.
* @param {Boolean} [doNotSetAttribute=false] If true, the id on the DOM element wont be changed. 
*/ 

 /**
 * Notify jsPlumb that the element with oldId has had its id changed to newId. This method is equivalent to what jsPlumb does itself in the second step of the setId method.
 * @method setIdChanged
 * @param {String} oldId Previous element id
 * @param {String} newId Element's new id
 * @see jsPlumbInstance#setId
 */

 /**
 * Switches the parent of the element to be the newParent, updating jsPlumb references to the element as necessary.
 * @method setParent
 * @param {Selector|Element} el Element to re-parent
 * @param {Selector|Element|String} newParent Selector, DOM element, or id of new parent.
 */

 /**
 * Gets all Connections the given jsPlumbInstance is managing.
  * @method getAllConnections
  * @return {Object} All connections, as a map of the form:
  *
  *  `{ scope -> [ connection... ] }`
  */

  /**
   * Gets the default scope for connections and endpoints.
   * A scope defines a type of endpoint/connection; supplying a
   * scope to an Endpoint or Connection allows you to support different
   * types of connections in the same UI. but if you're only interested in
   * one type of connection, you don't need to supply a scope. this method
   * will probably be used by very few people; it's good for testing
   * though.
   * @method getDefaultScope
   * @return {String} The default scope for the given jsPlumbInstance
   */  

   /**
    * Gets the list of Endpoints for a given element.
    * @method getEndpoints
    * @param {String|Element|Selector} el The element to get endpoints for.
    * @return {Endpoint[]} An array of Endpoints for the specified element.
    */   

/**
* Gets an Endpoint by UUID
* @method getEndpoint
* @param {String} uuid The UUID for the Endpoint
* @return {Endpoint} Endpoint with the given UUID, null if nothing found.
*/ 
 

/**
* Makes some DOM element(s) a Connection target, allowing you to drag connections to it/them
* without having to first register any Endpoints.  When a Connection is established,
* the endpoint spec that was passed in to this method is used to create a suitable 
* Endpoint (the default will be used if you do not provide one).
* @method makeTarget
* @param {String|Element|Selector} el Element(s) to turn into a connection target.
* @param {Object} params Parameters for the call
* @param {String|Array} [params.endpoint] Specification of an Endpoint to create when a Connection is established.
* @param {String} [params.scope] Scope for the drop zone.
* @param {Object} [params.dropOptions] Same stuff as you would pass to dropOptions of an Endpoint definition.
* @param {Boolean} [params.deleteEndpointsOnDetach=true] Whether or not to delete any Endpoints created by a connection to this target if
* the connection is subsequently detached. this will not remove Endpoints that have had more Connections attached
* to them after they were created.
* @param {Integer} [params.maxConnections=-1] Specifies the maximum number of Connections that can be made to this element as a target.
* @param {Function} [params.onMaxConnections] Function to call when user attempts to drop a connection but the limit has been reached.
* The callback signature should look like this:
*     `function( { element, connection, maxConnection }, originalEvent )`
*/

/**
* Sets the given element to no longer be a connection target.
* @method unmakeTarget
* @param {String|Element|Selector} el Element to unmake as a connection target.
* @return {jsPlumbInstance} The current jsPlumb instance.
*/ 

/**
* Makes some DOM element(s) a Connection source, allowing you to drag connections from it/them
* without having to first register any Endpoints.  When a Connection is established, the endpoint spec 
* that was passed in to this method is used to create a suitable Endpoint (the default will be used if 
* you do not provide one).
* @method makeSource
* @param {String|Element|Selector} el	String id, element, or element selector for the element(s) to make a source.
* @param {Object} params Parameters for the call
* @param {String|Array} [params.endpoint]	Specification of an endpoint to create when a connection is created.
* @param {String|Element} [params.parent] The element to add Endpoints to when a Connection is established.  if you omit this, Endpoints will be added to 'el'.
* @param {String} [params.scope] Scope for the connections dragged from this element.
* @param {Object} [params.dragOptions] Same stuff as you would pass to dragOptions of an Endpoint definition.
* @param {Boolean} [params.deleteEndpointsOnDetach=false] Whether or not to delete any Endpoints created by a connection from this source if the connection is subsequently detached. this will not 
* remove Endpoints that have had more Connections attached to them after they were created.
* @param {Function} [params.filter] Function to call when the user presses the mouse button to start a drag. This function is passed the original 
* event and the element on which the associated makeSource call was made.  If it returns anything other than false,
* the drag begins as usual. But if it returns false (the boolean false, not just something falsey), the drag is aborted.		 
*/      


/**
*	Sets the given element to no longer be a connection source.
* @method unmakeSource
* @param {String|Element|Selector} el The element in question.
*	@return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
* Resets all elements in this instance of jsPlumb so that none of them are connection sources.
*	@method unmakeEverySource
* @return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
*	Resets all elements in this instance of jsPlumb so that none of them are connection targets.
* @method unmakeEveryTarget
* @return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
* Sets the enabled state of one or more elements that were previously made a connection source with the makeSource
* method.
* @method setSourceEnabled
* @param {String|Element|Selector} el The element in question.
*	@param {Boolean} state True to enable the element(s), false to disable it.
* @return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
*	Toggles the source enabled state of the given element or elements.
* @method toggleSourceEnabled
* @param {String|Element|Selector} el The element in question.
* @return {Boolean} The current enabled state of the source.
*/

/**
*	Returns whether or not the given element is registered as a connection source.
* @method isSource
* @param {String|Element|Selector} el The element in question.
* @return {Boolean} True if source, false if not.
*/

/**
*	Returns whether or not the given connection source is enabled.
* @method isSourceEnabled
* @param {String|Element|Selector} el The element in question.
* @return {Boolean} True if enabled, false if not.
*/

/**
*	Sets the enabled state of one or more elements that were previously made a connection target with the makeTarget method.
*	method.
* @method setTargetEnabled
* @param {String|Element|Selector} el The element in question.
*	@param {Boolean} state True to enable the element(s), false to disable it.
* @return {jsPlumbInstance} The current jsPlumb instance.
*/

/**
*	Toggles the target enabled state of the given element or elements.
* @method toggleTargetEnabled
* @param {String|Element|Selector} el The element in question.
* @return {Boolean} The current enabled state of the target.
*/

/**
* Returns whether or not the given element is registered as a connection target.
* @method isTarget
* @param {String|Element|Selector} el The element in question.
* @return {Boolean} True if source, false if not.
*/

/**
* Returns whether or not the given connection target is enabled.
* @method isTargetEnabled
* @param {String|Element|Selector} el The element in question.
* @return {Boolean} True if enabled, false if not.
*/

/**
* Helper method to bind a function to jsPlumb's ready event. You should use this method instead of your
* library's equivalent, to ensure that jsPlumb has loaded properly before you start to use it. This is
* particularly true in the case of YUI, because of the asynchronous nature of the module loading process.
* @method ready
* @param {Function} fn Function to call once the instance is ready.
*/

/**
* Repaints an element and its connections. This method gets new sizes for the elements before painting anything.
* @method repaint
* @param {String|Element|Selector} el The element in question.
* @return {jsPlumbInstance} The current jsPlumb instance.
* @see jsPlumbInstance#repaintEverything
*/

/**
* Repaints all connections and endpoints.
* @method repaintEverything 
* @param {Boolean} [clearEdits=false] If true, clear all edits made since last paint (anchors having moved, conenctions edited, absolute overlay positions etc)
* @return {jsPlumbInstance} The current jsPlumb instance.
* @see jsPlumbInstance#repaint
*/

/**
* Removes all Endpoints associated with a given element. 
* Also removes all Connections associated with each Endpoint it removes. jsPlumb expects
* that the element referenced here exists in the DOM. If it does not, or you are uncertain
* whether it will exist or not, use {@link jsPlumbInstance#remove}.
* @method removeAllEndpoints
* @param {String|Element|Selector} el The element in question.
* @param {Boolean} [recurse=false] Whether or not to recurse down through this elements children and remove their endpoints too.
* @return {jsPlumbInstance} The current jsPlumb instance.
* @see jsPlumbInstance#deleteEndpoint
*/

/**
* Removes the given element from the DOM, along with all Endpoints associated with it,
* and their connections.  
* @method remove
* @param {String|Element|Selector} el The element in question.
*/ 	

/**
* Removes all endpoints and connections and clears the listener list. To keep listeners call {@link jsPlumbInstance#deleteEveryEndpoint}
* instead of this.
* @method reset
*/

/**
 * Sets render mode.  jsPlumb will fall back to VML if it determines that
 * what you asked for is not supported (and that VML is).  If you asked for VML but the browser does
 * not support it, jsPlumb uses SVG.
 * @method setRenderMode
 * @param {String} mode One of `jsPlumb.SVG or `jsPlumb.VML.
 * @return {String} The render mode that jsPlumb set, which of course may be different from that requested.
 */
 
 /**
* Gets the current render mode for this instance of jsPlumb.
 * @method getRenderMode
 * @return {String} The current render mode - "svg" or "vml".
 */
 
 /**
  * Gets a new instance of jsPlumb.
  * @method getInstance
  * @param {object} [_defaults] Optional default settings for the new instance.
  */
 
 /**
  * Suspends drawing, runs the given function, then re-enables drawing (and repaints, unless you tell it not to)
  * @method doWhileSuspended
  * @param {Function} fn Function to run while suspended.
  * @param {Boolean} doNotRepaintAfterwards If true, jsPlumb won't run a full repaint. Otherwise it will.
  */

/**
* Sets the default scope for Connections and Endpoints. A scope defines a type of Endpoint/Connection; supplying a
* scope to an Endpoint or Connection allows you to support different
* types of Connections in the same UI.  If you're only interested in
* one type of Connection, you don't need to supply a scope. This method
* will probably be used by very few people; it just instructs jsPlumb
* to use a different key for the default scope.
* @method setDefaultScope
* @param {String} scope Scope to set as default.
* @return {jsPlumbInstance} The current jsPlumb instance.
*/ 

    /**
    * Detaches a Connection.
    * @method detach
    * @param {Connection} connection  The Connection to detach
    * @param {Object} [params] Optional parameters to the detach call.
    * @param {Boolean} [params.fireEvent=false] Indicates you want jsPlumb to fire a connection
    * detached event. The thinking behind this is that if you made a programmatic
    * call to detach an event, you probably don't need the callback.
    * @param {Boolean} [params.forceDetach=false] Allows you to override any beforeDetach listeners that may be registered.
    * @return {boolean} True if successful, false if not.  
    */

    // SP

    /**    
    * Removes all an element's Connections.
    * @method detachAllConnections
    * @param {Object} el Either the id of the element, or a selector for the element.
    * @param {Object} [params] Optional parameters.
    * @param {Boolean} [params.fireEvent=true] Whether or not to fire the detach event.
    * @return {jsPlumbInstance} The current jsPlumb instance.
    */  
    /**        
    * Remove all Connections from all elements, but leaves Endpoints in place ((unless a connection is set to auto delete its Endpoints).
    * @method detachEveryConnection
    * @param {Object} [params] optional params object for the call
    * @param {Boolean} [params.fireEvent=true] Whether or not to fire detach events
    * @return {jsPlumbInstance} The current jsPlumb Instance
    * @see jsPlumbInstance#deleteEveryEndpoint
    */

    /*
    * Initialises the draggability of some element or elements.  You should use this instead of your 
    * library's draggable method so that jsPlumb can setup the appropriate callbacks.  Your 
    * underlying library's drag method is always called from this method.
    * @method draggable
    * @param {Object} el Either an element id, a list of element ids, or a selector. 
    * @param {Object} [options] Options to pass through to the underlying library. A common use case in jQueryUI, for instance, is to provide a `containment` parameter:
    * 
    *         `jsPlumb.draggable("someElementId", {
    *            containment:"parent"
    *          });`
    *    
    * @return {jsPlumbInstance} The current jsPlumb instance.
    */
/**
* This method takes the given selector spec and, using the current underlying library, turns it into
* a selector from that library.  This method exists really as a helper function for those applications
* where you're writing jsPlumb code that will target more than one library (such as in the case of the
* jsPlumb demo pages).
* @method getSelector
* @param {Element|Selector} [context]  An element to search from. may be omitted (__not__ null: omitted. as in you only pass one argument to the function)
* @param {String} spec  A valid selector string.
*/
/**
* Sets whether or not drawing is suspended. you should use this when doing bulk painting, like when first drawing a UI.
* @method setSuspendDrawing
* @param {Boolean} val Whether or not to suspend drawing.
* @param {Boolean} [doNotRepaintAfterwards=false] If true, jsPlumb won't run a full repaint. Otherwise it will.
*/

/**
 * Deletes an Endpoint and removes all Connections it has (which removes the Connections from the other Endpoints involved too)
 * @method deleteEndpoint
 * @param {String|Endpoint} object Either a string, representing the endpoint's uuid, or an Endpoint.     
 * @param {Boolean} [doNotRepaintAfterwards=false] Indicates whether or not to repaint everything after this call.
 * @return {jsPlumbInstance} The current jsPlumb instance. 
 */   

/**
* Deletes every `Endpoint` and their associated `Connection`s. Distinct from {@link jsPlumbInstance#reset} because we dont clear listeners here, so
* for that reason this function is often the best way to reset a jsPlumb instance.
 * @method deleteEveryEndpoint
 * @return {jsPlumbInstance} The current jsPlumb instance. 
 */   

 /**
 * Returns the given type's specification.
 * @method getType
 * @param {String} id Id of the type to retrieve
 * @param {String} typeDescriptor `"connection"` or `"endpoint"` - the category of Type to get. 
 * @return {Object} Type specification, it if exists, null otherwise.
 */

 /** 
 * Registers all of the given Endpoint types on this instance of jsPlumb. `types` is expected
 * to contain keys with typeids and values with type specification objects.
 * @method registerEndpointTypes
 * @param {Object} types Object containing the type specifications. 
 */

 /**
 * Registers all of the given connection types on this instance of jsPlumb. `types` is expected
 * to contain keys with typeids and values with type specification objects.
 * @method registerConnectionTypes
 * @param {Object} types Object containing the type specifications.
 */

 /**
 * Registers the given connection type on this instance of jsPlumb.
 * @method registerConnectionType 
 * @param {String} typeId Id of the type
 * @param {Object} type Object containing the type specification. 
 */

 /**
 * Registers the given endpoint type on this instance of jsPlumb.
 * @method registerEndpointType
 * @param {String} typeId Id of the type
 * @param {Object} type Object containing the type specification.
 */
 
 


  // ------------------------------- jsPlumb Properties ------------------------------------

  /**
  * The CSS class(es) to set on Connection elements. This value is a String and can have multiple classes; the entire String is appended as-is (this is true of all the CSS properties in a jsPlumbInstance).
  * @property connectorClass
  * @type {String}
  */

  /**
  * The CSS class(es) to set on Connection or Endpoint elements when hovering. This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property hoverClass
  * @type {String}
  */

  /**
  * The CSS class(es) to set on Endpoint elements. This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property endpointClass
  * @type {String}
  */ 

  /**
  * The CSS class(es) to set on an Endpoint element when its Endpoint has at least one connection. This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property endpointConnectedClass
  * @type {String}
  */

  /**
  * The CSS class(es) to set on a full Endpoint element. This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property endpointFullClass
  * @type {String}
  */
  
  /**
  * The CSS class(es) to set on an Endpoint on which a drop will be allowed (during drag and drop). This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property endpointDropAllowedClass
  * @type {String}
  */
  
  /**
  * The CSS class(es) to set on an Endpoint on which a drop will be forbidden (during drag and drop). This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property endpointDropForbiddenClass
  * @type {String}  
  */
  
  /**
  * The CSS class(es) to set on an Overlay that is an HTML element. This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property overlayClass
  * @type {String}
  */ 
  
  /**
  * The CSS class(es) to set on connections that are being dragged. This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property draggingClass
  * @type {String}
  */

  /**
  * The CSS class(es) to set on connections whose source or target element is being dragged, and
  * on their endpoints too. This value is a String and can have multiple classes; the entire String is appended as-is.
  * @property elementDraggingClass
  * @type {String}
  */ 

  /**
  * The prefix for the CSS class to set on Endpoints that have dynamic anchors whose individual locations
  * have declared an associated CSS class. This value is a String and, unlike the other classes, is expected
  * to contain a single value, as it is used as a prefix for the final class: '_***' is appended,
  * where "***" is the CSS class associated with the current dynamic anchor location.
  * @property endpointAnchorClassPrefix
  * @type {String}
  */

  /**
  * Constant for use with the setRenderMode method
  * @property VML
  * @static
  * @type {String}
  */

  /**
  * Constant for use with the setRenderMode method
  * @property SVG
  * @static
  * @type {String}
  */  

  /**
  * These are the default settings for jsPlumb.  They are what will be used if you do not supply specific pieces of information 
  * to the various API calls. A convenient way to implement your own look and feel can be to override these defaults 
  * by including a script somewhere after the jsPlumb include, but before you make any calls to jsPlumb.
   * @property Defaults 
   * @type {Object}
   */
  /**
  * The default anchor to use for all connections (both source and target). Default is "Bottom".
  * @property Defaults.Anchor
  * @type {String}
  */
  /**
  * The default anchors to use as (`[source, target]`) for all connections. Defaults are `["Bottom", "Bottom"]`.
  * @property Defaults.Anchors            
  * @type {String[]}
  */
  /**
  * Whether or not connections are detachable by default (using the mouse). Defaults to true.
  * @property Defaults.ConnectionsDetachable
  * @type {Boolean}
  */
  /**
  * The default overlay definitions for Connections. Defaults to an empty list.
  * @property Defaults.ConnectionOverlays
  * @type {Object[]}
  */
  /**
  * Name of the default connector definition to use for all connections.  Default is "Bezier".
  * @property Defaults.Connector
  * @type {String}
  */
  /**
  * Optional selector or element id that instructs jsPlumb to append elements it creates to a specific element.
  * @property Defaults.Container
  * @type {Element|String}
  */
  /**
  * Defaults to false; whether or not to throw errors if a user specifies an unknown anchor, endpoint or connector type.
  * @property Defaults.DoNotThrowErrors
  * @type {Boolean}
  */
  /**
  * The default drag options to pass in to {@link jsPlumbInstance#connect}, {@link jsPlumbInstance#makeTarget} and {@link jsPlumbInstance#addEndpoint} calls. Default is empty.
  * @property Defaults.DragOptions
  * @type {Object}
  */
  /**
  * The default drop options to pass in to {@link jsPlumbInstance#connect}, {@link jsPlumbInstance#makeTarget} and {@link jsPlumbInstance#addEndpoint} calls. Default is empty.
  * @property Defaults.DropOptions
  * @type {Object}
  */
  /**
  * The name of the default endpoint to use for all connections (both source and target).  Default is `"Dot"`.
  * @property Defaults.Endpoint       
  * @type {String}
  */
  /**
  * The names of the default endpoint definitions ([ source, target ]) to use for all connections.  Defaults are `["Dot", "Dot"]`.
  * @property Defaults.Endpoints
  * @type {String[]}
  */
  /**
  * The default style definition to use for all endpoints. Default is `{ fillStyle:"#456" }`
  * @property Defaults.EndpointStyle
  * @type {Object}
  */
  /**
  * The default style definitions ([ source, target ]) to use for all endpoints.  Defaults are empty.
  * @property Defaults.EndpointStyles
  * @type {Object[]}
  */
  /**
  * The default hover style definition to use for all endpoints. Default is null.
  * @property Defaults.EndpointHoverStyle
  * @type {Object}
  */
  /**
  * The default hover style definitions ([ source, target ]) to use for all endpoints. Defaults are null.
  * @property Defaults.EndpointHoverStyles
  * @type {Object[]}
  */
  /**
  * The default hover style definition to use for all connections. Defaults are null.
  * @property Defaults.HoverPaintStyle
  * @type {Object}
  */
  /**
  * The default style to use for label overlays on connections.
  * @property Defaults.LabelStyle
  * @deprecated Labels should be styled with CSS nowadays.
  * @type {Object}
  */
  /**
  * Whether or not the jsPlumb log is enabled. defaults to false.
  * @property Defaults.LogEnabled
  * @type {Boolean}
  */
  /**
  * The default overlay definitions (for both Connections and Endpoint). Defaults to an empty list.
  * @property Defaults.Overlays
  * @type {Object[]}
  */
  /**
  * The default maximum number of connections for an Endpoint.  Defaults to 1.     
  * @property Defaults.MaxConnections
  * @type {Integer}
  */
  /**
  * The default paint style for a connection. Default is line width of 8 pixels, with color "#456".
  * @property Defaults.PaintStyle
  * @type {Object}
  */
  /**
  * Whether or not to reattach Connections that a user has detached with the mouse and then dropped. Default is false.
  * @property Defaults.ReattachConnections
  * @type {Boolean}
  */
  /**
  * What mode to use to paint with.  If you're on IE<9, you don't really get to choose this.  You'll just get VML.  Otherwise, jsPlumb uses SVG. Note that from 1.6.0 onwards, support for Canvas has been removed.
  * @property Defaults.RenderMode     
  * @type {String}
  */
  /**
  * The default "scope" to use for connections. Scope lets you assign connections to different categories. 
  * @property Defaults.Scope
  * @type {String}
  * @default "_jsPlumb_Default_Scope"
  */


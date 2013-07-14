// ---------------- JSPLUMB ----------------------------------------

/**
 * Class: jsPlumb
 * The jsPlumb engine, of which there is one instance registered as a static object in the window.  You
 * can use the jsPlumb.getInstance function to get a new instance of jsPlumb. This object contains all of the methods you will use to create and maintain Connections and Endpoints.
 */			
		
/*
 * Function: bind(event, callback)
 * Bind to an event on jsPlumb.  
 * 
 * Parameters:
 * 	event - the event to bind.  Available events on jsPlumb are:
 *         - *connection* 			: 	notification that a new Connection was established.  jsPlumb passes the new Connection to the callback.
 *         - *connectionDetached* 	: 	notification that a Connection was detached.  jsPlumb passes the detached Connection to the callback.
 *         - *click*						:	notification that a Connection was clicked.  jsPlumb passes the Connection that was clicked to the callback.
 *         - *dblclick*						:	notification that a Connection was double clicked.  jsPlumb passes the Connection that was double clicked to the callback.
 *         - *endpointClick*				:	notification that an Endpoint was clicked.  jsPlumb passes the Endpoint that was clicked to the callback.
 *         - *endpointDblClick*				:	notification that an Endpoint was double clicked.  jsPlumb passes the Endpoint that was double clicked to the callback.
 *         - *beforeDrop*					: 	notification that a Connection is about to be dropped. Returning false from this method cancels the drop. jsPlumb passes { sourceId, targetId, scope, connection, dropEndpoint } to your callback. For more information, refer to the jsPlumb documentation.
 *         - *beforeDetach*					: 	notification that a Connection is about to be detached. Returning false from this method cancels the detach. jsPlumb passes the Connection to your callback. For more information, refer to the jsPlumb documentation.
 *		   - *connectionDrag* 				:   notification that an existing Connection is being dragged. jsPlumb passes the Connection to your callback function.
 *         - *connectionDragStop*            :   notification that the drag of an existing Connection has ended.  jsPlumb passes the Connection to your callback function.
 *         
 *  callback - function to callback. This function will be passed the Connection/Endpoint that caused the event, and also the original event.    
 */
		
/*
 * Function: unbind([event])
 * Clears either all listeners, or listeners for some specific event.
 * 
 * Parameters:
 * 	event	-	optional. constrains the clear to just listeners for this event.
 */	

/*
* Function: getInstanceIndex()
* Returns:
* The "instance index" for this instance of jsPlumb. Probably not something you will need very often.
*/



 

  /*
    Function: animate 
    This is a wrapper around the supporting library's animate function; it injects a call to jsPlumb in the 'step' function (creating
    the 'step' function if necessary). This only supports the two-arg version of the animate call in jQuery, the one that takes an 'options' object as
    the second arg. MooTools has only one method, a two arg one. Which is handy.  YUI has a one-arg method, so jsPlumb merges 'properties' and 'options' together for YUI.
     
    Parameters: 
    	el - Element to animate. Either an id, or a selector representing the element. 
    	properties - The 'properties' argument you want passed to the library's animate call. 
     	options - The 'options' argument you want passed to the library's animate call.      
   */
  
      

       

     /*
       Function: extend(o1, o2)
       Wraps the underlying library's extend functionality.
       
       Parameters: 
       	o1 - object to extend 
       	o2 - object to extend o1 with
       	
       Returns: 
       	o1, extended with all properties from o2.
      */ 

/*
* Function: getDefaultEndpointType()
* 	Returns the default Endpoint type. Used when someone wants to subclass Endpoint and have jsPlumb return instances of their subclass.
*  you would make a call like this in your class's constructor:
*  
*  : jsPlumb.getDefaultEndpointType().apply(this, arguments);
*  
* 
* Returns:
* 	the default Endpoint function used by jsPlumb.
*/

/*
 * Function: getDefaultConnectionType()
 * 	Returns the default Connection type. Used when someone wants to subclass Connection and have jsPlumb return instances of their subclass.
 *  you would make a call like this in your class's constructor:
 *  
 *  : jsPlumb.getDefaultConnectionType().apply(this, arguments);
 * 
 * Returns:
 * 	the default Connection function used by jsPlumb.
 */

 /*
  * Function: getConnections(params) 
  * Gets all or a subset of connections currently managed by this jsPlumb instance.  If only one scope is passed in to this method,
  * the result will be a list of connections having that scope (passing in no scope at all will result in jsPlumb assuming you want the
  * default scope).
  *
  * If multiple scopes are passed in, the return value will be a map of
  *
  * : { scope -> [ connection... ] }
  * 
  *  Parameters:
  *  	scope	-	if the only argument to getConnections is a string, jsPlumb will treat that string as a scope filter, and return a list
  *                  of connections that are in the given scope. use '*' for all scopes.
  *      options	-	if the argument is a JS object, you can specify a finer-grained filter:
  *      
  *      		-	*scope* may be a string specifying a single scope, or an array of strings, specifying multiple scopes. Also may have the value '*', indicating any scope.
  *      		-	*source* either a string representing an element id, a selector, or an array of ids. Also may have the value '*', indicating any source.  Constrains the result to connections having this/these element(s) as source.
  *      		-	*target* either a string representing an element id, a selector, or an array of ids. Also may have the value '*', indicating any target.  Constrains the result to connections having this/these element(s) as target.		 
  *		flat    -	return results in a flat array (don't return an object whose keys are scopes and whose values are lists per scope).
  * 
  * Returns:
  * If only one scope was requested, a list of Connections that match the criteria. Otherwise, a map of [scope->connection lists].
  */ 

  		/*
  		* Function: select(params)
  		* Selects a set of Connections, using the filter options from the getConnections method, and returns an object
  		* that allows you to perform an operation on all of the Connections at once.
  		*
  		* The return value from any of these operations is the original list of Connections, allowing operations to be
  		* chained (for 'setter' type operations). 'getter' type operations return an array of values, where each entry is
  		* of the form:
  		*
  		* : [ Connection, return value ]
  		* 
  		* Parameters:
  		*	scope - see getConnections
  		* 	source - see getConnections
  		*	target - see getConnections
          *   connections - an existing list of Connections.  If you supply this, 'source' and 'target' will be ignored.
  		*
  		* Returns:
  		* A list of Connections on which operations may be executed. 'Setter' type operations can be chained; 'getter' type operations
  		* return an array of [Connection, value] pairs, one entry for each Connection in the list returned. The full list of operations 
  		* is as follows (where not specified, the operation's effect or return value is the same as the corresponding method on Connection) :
  		* 				
          *   -   addClass
  		*	-	addOverlay
  		*	-	addType
  		*	-	detach : detaches all the connections in the list. not chainable and does not return anything.		
  		*	-	each(function(connection)...) : allows you to specify your own function to execute; this function is chainable.		
  		*	-	get(index) : returns the Connection at 'index' in the list.			
  		*	-	getHoverPaintStyle		
  		*   - 	getLabel
  		*	-	getOverlay
  		*	-	getPaintStyle		
  		*	-	getParameter
  		*	-	getParameters
  		*	-	getType
  		*	-	getZIndex
  		*	-	hasType		
  		*	-	hideOverlay
  		*	-	hideOverlays		
  		*	-	isDetachable		
  		*	-	isHover
  		*	-	isReattach
  		*	-	isVisible		
  		*	-	length : returns the length of the list.
  		*	-	removeAllOverlays		
          *   -   removeClass
  		*	-	removeOverlay
  		*	-	removeOverlays
  		*	-	removeType
  		*	-	repaint	
  		*	-	setConnector		
  		*	-	setDetachable
  		*	-	setHover		
  		*	-	setHoverPaintStyle		
  		*	-	setLabel		
  		*	-	setPaintStyle		
  		*	-	setParameter
  		*	-	setParameters
  		*	- 	setReattach	
  		*	-	setType	
  		*	-	showOverlay		
  		*	-	showOverlays
  		*/  

/*
* Function: selectEndpoints(params)
* Selects a set of Endpoints and returns an object that allows you to execute various different methods on them at once. The return 
* value from any of these operations is the original list of Endpoints, allowing operations to be chained (for 'setter' type 
* operations). 'getter' type operations return an array of values, where each entry is of the form:
*
* : [ Endpoint, return value ]
* 
* Parameters:
*	scope - either a string or an array of strings.
* 	source - either a string, a dom element, or a selector, or an array of any mix of these. limits returned endpoints to those that are declared as a source endpoint on any elements identified.
*	target - either a string, a dom element, or a selector, or an array of any mix of these. limits returned endpoints to those that are declared as a target endpoint on any elements identified.
*	element - either a string, a dom element, or a selector, or an array of any mix of these. limits returned endpoints to those that are declared as either a source OR a target endpoint on any elements identified.		
*
* Returns:
* A list of Endpoints on which operations may be executed. 'Setter' type operations can be chained; 'getter' type operations
* return an array of [Endpoint, value] pairs, one entry for each Endpoint in the list returned. 
*
* The full list of operations is as follows (where not specified, the operation's effect or return value is the
* same as the corresponding method on Endpoint) :
* 
*	-	setHover								
*	-	removeAllOverlays
*	-	setLabel
*   -   addClass
*	-	addOverlay
*   -   removeClass
*	-	removeOverlay
*	-	removeOverlays
*	-	showOverlay
*	-	hideOverlay
*	-	showOverlays
*	-	hideOverlays
*	-	setPaintStyle
*	-	setHoverPaintStyle
*	-	setParameter
*	-	setParameters
*	-	setAnchor
*   - 	getLabel
*	-	getOverlay
*	-	isHover
*	-	isDetachable
*	-	getParameter
*	-	getParameters
*	-	getPaintStyle
*	-	getHoverPaintStyle
*	-	detachAll : Detaches all the Connections from every Endpoint in the list. not chainable and does not return anything.
*	-	delete : Deletes every Endpoint in the list. not chainable and does not return anything.		
*	-	length : returns the length of the list.
*	-	get(index) : returns the Endpoint at 'index' in the list.
*	-	each(function(endpoint)...) : allows you to specify your own function to execute; this function is chainable.
*/  		

/*
 * Property: Defaults 
 * 
 * These are the default settings for jsPlumb.  They are what will be used if you do not supply specific pieces of information 
 * to the various API calls. A convenient way to implement your own look and feel can be to override these defaults 
 * by including a script somewhere after the jsPlumb include, but before you make any calls to jsPlumb.
 * 
 * Properties:
 * 	-	*Anchor*				    The default anchor to use for all connections (both source and target). Default is "BottomCenter".
 * 	-	*Anchors*				    The default anchors to use ([source, target]) for all connections. Defaults are ["BottomCenter", "BottomCenter"].
 *  -   *ConnectionsDetachable*		Whether or not connections are detachable by default (using the mouse). Defaults to true.
 *  -   *ConnectionOverlays*		The default overlay definitions for Connections. Defaults to an empty list.
 * 	-	*Connector*				The default connector definition to use for all connections.  Default is "Bezier".
 *  -   *Container*				Optional selector or element id that instructs jsPlumb to append elements it creates to a specific element.
 *	-	*DoNotThrowErrors*		Defaults to false; whether or not to throw errors if a user specifies an unknown anchor, endpoint or connector type.
 * 	-	*DragOptions*			The default drag options to pass in to connect, makeTarget and addEndpoint calls. Default is empty.
 * 	-	*DropOptions*			The default drop options to pass in to connect, makeTarget and addEndpoint calls. Default is empty.
 * 	-	*Endpoint*				The default endpoint definition to use for all connections (both source and target).  Default is "Dot".
 *  -   *EndpointOverlays*		The default overlay definitions for Endpoints. Defaults to an empty list.
 * 	-	*Endpoints*				The default endpoint definitions ([ source, target ]) to use for all connections.  Defaults are ["Dot", "Dot"].
 * 	-	*EndpointStyle*			The default style definition to use for all endpoints. Default is fillStyle:"#456".
 * 	-	*EndpointStyles*		The default style definitions ([ source, target ]) to use for all endpoints.  Defaults are empty.
 * 	-	*EndpointHoverStyle*	The default hover style definition to use for all endpoints. Default is null.
 * 	-	*EndpointHoverStyles*	The default hover style definitions ([ source, target ]) to use for all endpoints. Defaults are null.
 * 	-	*HoverPaintStyle*		The default hover style definition to use for all connections. Defaults are null.
 * 	-	*LabelStyle*			The default style to use for label overlays on connections.
 * 	-	*LogEnabled*			Whether or not the jsPlumb log is enabled. defaults to false.
 * 	-	*Overlays*				The default overlay definitions (for both Connections and Endpoint). Defaults to an empty list.
 * 	-	*MaxConnections*		The default maximum number of connections for an Endpoint.  Defaults to 1.		 
 * 	-	*PaintStyle*			The default paint style for a connection. Default is line width of 8 pixels, with color "#456".
 * 	-	*ReattachConnections*	Whether or not to reattach Connections that a user has detached with the mouse and then dropped. Default is false.
 * 	-	*RenderMode*			What mode to use to paint with.  If you're on IE<9, you don't really get to choose this.  You'll just get VML.  Otherwise, the jsPlumb default is to use SVG.
 * 	-	*Scope*				The default "scope" to use for connections. Scope lets you assign connections to different categories. 
 */

 /*
  * Function: getAllConnections()
  * Returns:
  * All connections, as a map of the form:
  *
  *  { scope -> [ connection... ] } 
  */

  /*
   * Function: getDefaultScope()
   * Gets the default scope for connections and  endpoints.
   *
   * A scope defines a type of endpoint/connection; supplying a
   * scope to an Endpoint or Connection allows you to support different
   * types of connections in the same UI. but if you're only interested in
   * one type of connection, you don't need to supply a scope. this method
   * will probably be used by very few people; it's good for testing
   * though.
   */  

   /**
    * Function: getEndpoints(el)
    * Gets the list of Endpoints for a given element.
    *
    * Parameters:
    * 	el - element id, dom element, or selector.
    *
    * Returns:
    * 	An array of Endpoints for the specified element.
    */   

/*
 Function: getEndpoint(uuid)
 Gets an Endpoint by UUID
  
 Parameters: 
 	uuid - the UUID for the Endpoint
 	 
 Returns: 
 	Endpoint with the given UUID, null if nothing found.
*/   

 

 /*
 * Function: isHoverSuspended()
 * Returns:
 * whether or not hover effects are currently suspended.
 */

 /*
 * Function: setHoverSuspended(s)
 * Sets whether or not hover effects should be suspended. jsPlumb uses this internally during various
 * drag/drop operations, and it is exposed because it might also be useful for you too.
 * Parameters:
 * s - whether or not to set hover suspended.
 */

 /*
   Function: hide (el, [changeEndpoints])
   Sets an element's connections to be hidden.
   
   Parameters: 
   	el - either the id of the element, or a selector for the element.
   	changeEndpoints - whether not to also hide endpoints on the element. by default this is false.  
   	 
   Returns: 
   	The jsPlumb instance.
  */

  /**
   * Function: makeTarget(el, [params])
   * Makes some DOM element a Connection target, allowing you to drag connections to it
   * without having to register any Endpoints on it first.  When a Connection is established,
   * the endpoint spec that was passed in to this method is used to create a suitable 
   * Endpoint (the default will be used if you do not provide one).
   * 
   * Parameters:
   *  el		-	string id or element selector for the element to make a target.
   * 	params	-	JS object containing parameters:
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

   /*
   *	Function: unmakeTarget(el)
   *	Sets the given element to no longer be a connection target.
   *	
   *	Parameters:
   *		el - a string id, a dom element, or a selector representing the element.
   *		
   *	Returns:
   *	The current jsPlumb instance.
   */ 

     /*
      * Function: makeTargets(els, [params], [referenceParams])
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
       * Function: makeSource(el, [params])
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
*	Function: unmakeSource(el)
*	Sets the given element to no longer be a connection source.
*	
*	Parameters:
*		el - a string id, a dom element, or a selector representing the element.
*		
*	Returns:
*	The current jsPlumb instance.
*/

/*
*	Function: unmakeEverySource()
*	Resets all elements in this instance of jsPlumb so that none of them are connection sources.
*	
*	Returns:
*	The current jsPlumb instance.
*/
/*
*	Function: unmakeEveryTarget()
*	Resets all elements in this instance of jsPlumb so that none of them are connection targets.
*	
*	Returns:
*	The current jsPlumb instance.
*/

/*
 * Function: makeSources(els, [params], [referenceParams])
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
 * Function: setSourceEnabled(el, state)
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
 *	Function: toggleSourceEnabled(el)
 *	Toggles the source enabled state of the given element or elements.
 *
 * 	Parameters:
 *		el 	- 	either a string representing some element's id, or an array of ids, or a selector.
 *
 *	Returns:
 *	The current enabled state of the source.
 */

 /*
 *	Function: isSource(el)
 *	Returns whether or not the given element is registered as a connection source.
 *
 *	Parameters:
 *		el 	- 	a string id, a dom element, or a selector representing a single element.
 *
 *	Returns:
 *	True if source, false if not.
 */

 /*
 *	Function: isSourceEnabled(el)
 *	Returns whether or not the given connection source is enabled.
 *
 *	Parameters:
 *	el 	- 	a string id, a dom element, or a selector representing a single element.
 *
 *	Returns:
 *	True if enabled, false if not.
 */

 /*
 *	Function: setTargetEnabled(el, state)
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
 *	Function: toggleTargetEnabled(el)
 *	Toggles the target enabled state of the given element or elements.
 *
 *	Parameters:
 *		el 	- 	either a string representing some element's id, or an array of ids, or a selector.
 *
 *	Returns:
 *	The current enabled state of the target.
 */

 /*
 	Function: isTarget(el)
 	Returns whether or not the given element is registered as a connection target.

 	Parameters:
 		el 	- 	a string id, a dom element, or a selector representing a single element.

 	Returns:
 	True if source, false if not.
 */

 /*
 	Function: isTargetEnabled(el)
 	Returns whether or not the given connection target is enabled.

 	Parameters:
 		el 	- 	a string id, a dom element, or a selector representing a single element.

 	Returns:
 	True if enabled, false if not.
 */

 /*
 * Function: ready(fn)
 * Helper method to bind a function to jsPlumb's ready event. You should use this method instead of your
 * library's equivalent, to ensure that jsPlumb has loaded properly before you start to use it. This is
 * particularly true in the case of YUI, because of the asynchronous nature of the module loading process.
 * 
 * Parameters:
 * fn - function to call once the instance is ready.
 */

 /*
 * Function: repaint (el)
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
 * Function: repaintEverything() 
 * Repaints all connections and endpoints.
 *  
 * Returns: 
 *	The current jsPlumb instance.
 * 	
 * See Also: 
 *	<repaint>
 */

 		/*
 		* Function: removeAllEndpoints(el, [recurse]) 
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
 		* Function: remove(el)
 		* Removes the given element from the DOM, along with all Endpoints associated with it,
 		* and their connections.  This is present in jsPlumb since version 1.4.2. 
 		*
 		* Parameters:
 		*  el - either an element id, a DOM element, or a selector for the element.
 		*/ 	

 		/*
 		* Function:reset()
 		* Removes all endpoints and connections and clears the listener list. To keep listeners call
 		* : jsPlumb.deleteEveryEndpoint()
 		* instead of this.
 		*/

 		/*
 		 * Function: setDefaultScope(scope)
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

 		 /*
 		  * Function: setDraggable(el, draggable) 
 		  * Sets whether or not a given element is
 		  * draggable, regardless of what any jsPlumb command may request.
 		  * 
 		  * Parameters: 
 		  * 	el - either the id for the element, or a selector representing the element.
 		  * 	draggable - whether or not the element should be draggable.
 		  *  
 		  * Returns: 
 		  * 	void
 		  */

 		  /*
 		  * Function: setId(el, newId, [doNotSetAttribute])
 		  * Changes the id of some element, adjusting all connections and endpoints
 		  *
 		  * Parameters:
 		  * 	el - a selector, a DOM element, or a string. 
 		  * 	newId - string.
 		  *		doNotSetAttributes - defaults to false; if true, the id on the DOM element wont be changed.
 		  */ 

/*
* Function: setIdChanged(oldId, newId)
* Notify jsPlumb that the element with oldId has had its id changed to newId.
*
* This method is equivalent to what jsPlumb does itself in the second step of the setId method above.
*
* Parameters:
* 	oldId	- 	previous element id
* 	newId	-	element's new id
*
* See Also:
* 	<setId>
*/

/*
 * Function: setSuspendDrawing(val, [repaintAfterwards])
 * Suspends drawing operations.  This can (and should!) be used when you have a lot of connections to make or endpoints to register;
 * it will save you a lot of time.
 *
 * Parameters:
 * 	val	-	boolean indicating whether to suspend or not
 * 	repaintAfterwards	-	optional boolean instructing jsPlumb to do a full repaint after changing the suspension
 * 	state. defaults to false.
 */

 /*
 * Function: isSuspendDrawing()
 * Returns:
 * Whether or not drawing is currently suspended.
 */ 

 /*
 * Function: doWhileSuspended(fn, [doNotRepaintAfterwards])
 * Suspends drawing, runs the given function, then re-enables drawing (and repaints, unless
 * you set 'doNotRepaintAfterwards' to true)
 */ 

 /*
  * Function: show(el, [changeEndpoints])
  * Sets an element's connections to be visible.
  * 
  * Parameters: 
  * 	el - either the id of the element, or a selector for the element.
  *  changeEndpoints - whether or not to also change the visible state of the endpoints on the element.  this also has a bearing on
  *  other connections on those endpoints: if their other endpoint is also visible, the connections are made visible.  
  *  
  * Returns: 
  * 	The current jsPlumb instance.
  */

  /*
   * Function: toggleVisible(el, [changeEndpoints]) 
   * Toggles visibility of an element's Connections.
   *  
   * Parameters: 
   * 	el - either the element's id, or a selector representing the element.
   *  changeEndpoints - whether or not to also toggle the endpoints on the element.
   *  
   * Returns: 
   * 	void, but should be updated to return the current state
   */

   /*
    * Function: toggleDraggable(el)
    * Toggles draggability (sic?) of an element's Connections.
    *  
    * Parameters: 
    * 	el - either the element's id, or a selector representing the element.
    *  
    * Returns: 
    * 	The current draggable state.
    */   

    /*
     * Function: recalculateOffsets(el)
     * Recalculates the offsets of all child elements of some element. If you have Endpoints registered on the
     * descendants of some element and you make changes to that element's markup, it is possible that the location
     * of each Endpooint relative to the origin of the element may have changed. So you call this to tell jsPlumb to
     * recalculate.  You need to do this because, for performance reasons, jsplumb won't calculate these offsets on
     * the fly.
     *
     * Parameters:
     * el - either a string id, or a selector.
     */

/*
 * Property: Anchors.Top
 * An Anchor that is located at the top center of the element.
 */
/*
 * Property: Anchors.Bottom
 * An Anchor that is located at the bottom center of the element.
 */
/*
 * Property: Anchors.Left
 * An Anchor that is located at the left middle of the element.
 */
/*
 * Property: Anchors.Right
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
 * Function: addOverlay(overlaySpec)
 * Adds an Overlay to the Endpoint.
 * 
 * Parameters:
 * 	overlaySpec - Overlay to add. This is not an Overlay object but rather a specification in the format that jsPlumb uses.
 */
 /*
 * Function: addType(typeId)
 * Adds the specified type to the Endpoint. Types are registered using registerEndpointType on the associated jsPlumb instance.  See the wiki page for a full discussion.
 * 
 * Parameters:
 * 	typeId - Id of the type to add.
 */

 /*
  * Function: bind(event, callback)
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
 * Function: detach(connection, [ignoreTarget])
 *   Detaches the given Connection from this Endpoint.
 *   
 * Parameters:
 *   connection - the Connection to detach.
 *   ignoreTarget - optional; tells the Endpoint to not notify the Connection target that the Connection was detached.  The default behaviour is to notify the target.
 */
/*
 * Function: detachAll([fireEvent])
 *   Detaches all Connections this Endpoint has.
 *
 * Parameters:
 *  fireEvent   -   whether or not to fire the detach event.  defaults to false.
 */
/*
 * Function: detachFrom(targetEndpoint, [fireEvent])
 *   Removes any connections from this Endpoint that are connected to the given target endpoint.
 *   
 * Parameters:
 *   targetEndpoint     - Endpoint from which to detach all Connections from this Endpoint.
 *   fireEvent          - whether or not to fire the detach event. defaults to false.
 */
/*
 * Function: detachFromConnection(connection)
 *   Detach this Endpoint from the Connection, but leave the Connection alive. Used when dragging.
 *   
 * Parameters:
 *   connection - Connection to detach from.
 */
/*
 * Function: getElement()
 *
 * Returns:
 * 	The DOM element this Endpoint is attached to.
 */

 /*
 * Function: getLabel()
 * Returns:
 * The label text for this Endpoint (or a function if you are labelling with a function).
 * This does not return the overlay itself; this is a convenience method which is a pair with
 * setLabel; together they allow you to add and access a Label Overlay without having to create the
 * Overlay object itself.  For access to the underlying label overlay that jsPlumb has created,
 * use getLabelOverlay.
 */

 /*
 * Function: getLabelOverlay()
 * Returns:
 * The underlying internal label overlay, which will exist if you specified a label on
 * an addEndpoint call, or have called setLabel at any stage.   
 */

 /*
 * Function: getPaintStyle()
 * Returns:
 * The Endpoint's paint style. This is not necessarily the paint style in use at the time;
 * this is the paint style for the Endpoint when the mouse it not hovering over it.
 */

 /*
  * Function: getOverlay(overlayId)
  * Gets an overlay, by ID. Note: by ID.  You would pass an 'id' parameter
  * in to the Overlay's constructor arguments, and then use that to retrieve
  * it via this method.
  *
  * Parameters:
  *	overlayId 	-	String id for the overlay.
  *
  * Returns:
  * an Overlay or null if no overlay with that id is registered.
  */

 /*
 * Function: getOverlays()
 * Returns:
 * An array of all Overlays for the component.
 */

 /*
 * Function: getParameter(key)
 * Gets the named parameter; returns null if no parameter with that name is set. Parameters may have been set on the Endpoint in the 'addEndpoint' call, or they may have been set with the setParameter function.
 *
 * Parameters:
 *   key - Parameter name.
 *
 * Returns:
 * The value stored against the given parameter name, null if not found.
 */

 /*
 * Function: getParameters()
 * Returns:
 * All of the Endpoint's parameters. Note that you can edit the return value of this method and this will change the parameters on the Endpoint.
 */

 /* 
 * Function: getType()
 * Returns:
 * The Endpoint's current type(s)
 */

/*
 * Function: getUuid()
 * Returns: 
 * The UUID for this Endpoint, if there is one. Otherwise returns null.
 */

 /*
 * Function: hasType(typeId)
 * Returns:
 * Whether or not the Endpoint has the given type.
 */

 /*
  * Function: hideOverlay(overlayId)
  * Hides the overlay specified by the given id.
  *
  * Parameters:
  *		overlayId 	- 	id of the overlay to hide.
  */

 /*
  * Function: hideOverlays()
  * Hides all Overlays
  */

/*
 * Function: isConnectedTo(endpoint)
 * 
 * Parameters:
 *   endpoint - Endpoint to test.
 *
 * Returns:
 * True if connected to the given Endpoint, false otherwise.
 */

 /*
 * Function: isEnabled()
 * Returns:
 * True if the Endpoint is enabled for drag/drop connections enabled, false otherwise.
 */

/*
 * Function: isFull()
 * Returns:
 * True if the Endpoint cannot accept any more Connections, false otherwise.
 */

 /*
 * Function: isVisible()
 * Returns:
 * Whether or not the Endpoint is currently visible.
 */ 

 /*
  * Function: paint(params)
  *   Paints the Endpoint, recalculating offset and anchor positions if necessary. This does NOT paint
  *   any of the Endpoint's connections.  NOTE: the arguments to this method should be in a js object, not
  * individual arguments.
  *   
  * Parameters:
  *   timestamp - optional timestamp advising the Endpoint of the current paint time; if it has painted already once for this timestamp, it will not paint again.
  *   canvas - optional Canvas to paint on.  Only used internally by jsPlumb in certain obscure situations.
  *   connectorPaintStyle - paint style of the Connector attached to this Endpoint. Used to get a fillStyle if nothing else was supplied.
  */

/*
* Function: reapplyTypes(data, [doNotRepaint])  
* Reapplies all of the current types, but with the given data.
*
* Parameters:
* data - data to use for parameterised types
* doNotRepaint - if true, dont repaint after reapplying types.
*/

/*
* Function: removeAllOverlays()
* Removes all overlays from the Endpoint, and then repaints.
*/

/*
* Function: removeOverlay(overlayId)
* Removes an overlay by ID.  Note: by ID.  this is a string you set in the overlay spec.
*
* Parameters:
* overlayId - id of the overlay to remove.
*/

/*
* Function: removeOverlays(overlayIds...)
* Removes a set of overlays by ID.  Note: by ID.  this is a string you set in the overlay spec.
*
* Parameters:
* overlayIds - this function takes an arbitrary number of arguments, each of which is a single overlay id.
*/

/*
* Function: removeType(typeId)
* Removes the specified type from the Endpoint. Types are registered using registerEndpointType on the associated jsPlumb instance.  See the wiki page for a full discussion.
* 
* Parameters:
* 	typeId - Id of the type to remove.
*/

/*
* Function: setAnchor(anchorParams, [doNotRepaint])
* Sets the Endpoint's anchor. This takes an anchor in any supported form in a jsPlumb.connect
* or jsPlumb.addEndpoint call.
*
* Parameters:
* 	anchorParams - anchor spec
* 	doNotRepaint - optional, defaults to false.
*/	

/*
 * Function: setDragAllowedWhenFull(allowed)
 *   Sets whether or not connections can be dragged from this Endpoint once it is full. You would use this in a UI in 
 *   which you're going to provide some other way of breaking connections, if you need to break them at all. This property 
 *   is by default true; use it in conjunction with the 'reattach' option on a connect call.
 *   
 * Parameters:
 *   allowed - whether drag is allowed or not when the Endpoint is full.
 */   

 /*
  * Function: setElement(el, [container])
  * Sets the DOM element this Endpoint is attached to.
  *
  * Parameters:
  * 	el	-	dom element or selector
  * 	container	-	optional, specifies the actual parent element to use as the parent for this Endpoint's visual representation.
  * 	See the jsPlumb documentation for a discussion about this.
  */ 

 /*
 * Function: setEnabled(enabled)
 * Sets whether or not the Endpoint is enabled for drag/drop connections.
 *
 * Parameters:
 * 	enabled - whether or not the Endpoint is enabled.			
 */

 /*
 * Function: setEndpoint(endpointSpec)
 * Sets the Endpoint's visual representation and behaviour. The format of the value you pass to
 * this method is the same as you use for the second argument to a jsPlumb.addEndpoint call.
 *
 * Parameters:
 * 	endpointSpec - endpoint spec
 */	

 /*
  * Function: setHover(hover, [ignoreAttachedElements])
  * Sets/unsets the hover state of this Endpoint.
  * 
  * Parameters:
  * 	hover - hover state boolean
  * 	ignoreAttachedElements - if true, does not notify any attached elements of the change in hover state.  used mostly to avoid infinite loops.
  */

 

  /*
   * Function: setLabel(label)
   * Sets the Endpoint's label.  
   * 
   * Parameters:
   * 	label	- label to set. May be a String, a Function that returns a String, or a params object containing { "label", "labelStyle", "location", "cssClass" }.  Note that this uses innerHTML on the label div, so keep
   * that in mind if you need escaped HTML.
   */  

/*
 * Function: setPaintStyle(style)
 * Sets the Endpoint's paint style and then repaints the Endpoint.
 * 
 * Parameters:
 * 	style - Style to use.
 */

 /*
 * Function: setParameter(key, value)
 * Sets the named parameter to the given value.
 *
 * Parameters:
 *   key - Parameter name.
 *   value - Parameter value.
 */

 /*
 * Function: setParameters(parameters)
 * Sets the Endpoint's parameters.
 *
 * Parameters:
 *   params - JS object containing [key,value] pairs.
 */

 /*
 * Function: setType(typeId)
 * Sets the specified type of the Endpoint.  This replaces all existing types. Types are registered using registerEndpointType on the associated jsPlumb instance.  See the wiki page for a full discussion.
 * 
 * Parameters:
 * 	typeId - Id of the type to set on the Endpoint.
 */
   
 /*
* Function: setVisible(visible, [doNotChangeConnections], [doNotNotifyOtherEndpoint])
* Sets whether or not the Endpoint is currently visible.
* 
* Parameters:
* visible - whether or not the Endpoint should be visible.
* doNotChangeConnections - Instructs jsPlumb to not pass the visible state on to any attached Connections. defaults to false.
* doNotNotifyOtherEndpoint - Instructs jsPlumb to not pass the visible state on to Endpoints at the other end of any attached Connections. defaults to false. 
 */

/*
 * Function: showOverlay(overlayId)
 * Shows the overlay specified by the given id.
 *
 * Parameters:
 *	overlayId - id of the overlay to show.
 */

/*
 * Function: showOverlays()
 * Shows all Overlays 
 */


// ---------------- / ENDPOINT -----------------------------------------------------

// --------------- CONNECTION ----------------------



/*
 * Function: Connection
 * Connection constructor. You should not ever create one of these directly. If you make a call to jsPlumb.connect, all of
 * the parameters that you pass in to that function will be passed to the Connection constructor; if your UI
 * uses the various Endpoint-centric methods like addEndpoint/makeSource/makeTarget, along with drag and drop,
 * then the parameters you set on those functions are translated and passed in to the Connection constructor. So
 * you should check the documentation for each of those methods.
 * 
 * Parameters:
 * 	source 	- either an element id, a selector for an element, or an Endpoint.
 * 	target	- either an element id, a selector for an element, or an Endpoint
 * 	scope	- scope descriptor for this connection. optional.
 *  container - optional id or selector instructing jsPlumb where to attach all the elements it creates for this connection.  you should read the documentation for a full discussion of this.
 *  detachable - optional, defaults to true. Defines whether or not the connection may be detached using the mouse.
 *  reattach	- optional, defaults to false. Defines whether not the connection should be retached if it was dragged off an Endpoint and then dropped in whitespace.
 *  endpoint - Optional. Endpoint definition to use for both ends of the connection.
 *  endpoints - Optional. Array of two Endpoint definitions, one for each end of the Connection. This and 'endpoint' are mutually exclusive parameters.
 *  endpointStyle - Optional. Endpoint style definition to use for both ends of the Connection.
 *  endpointStyles - Optional. Array of two Endpoint style definitions, one for each end of the Connection. This and 'endpoint' are mutually exclusive parameters.
 *  paintStyle - Parameters defining the appearance of the Connection. Optional; jsPlumb will use the defaults if you supply nothing here.
 *  hoverPaintStyle - Parameters defining the appearance of the Connection when the mouse is hovering over it. Optional; jsPlumb will use the defaults if you supply nothing here (note that the default hoverPaintStyle is null).
 *  cssClass - optional CSS class to set on the display element associated with this Connection.
 *  hoverClass - optional CSS class to set on the display element associated with this Connection when it is in hover state.
 *  overlays - Optional array of Overlay definitions to appear on this Connection.
 *  drawEndpoints - if false, instructs jsPlumb to not draw the endpoints for this Connection.  Be careful with this: it only really works when you tell jsPlumb to attach elements to the document body. Read the documentation for a full discussion of this. 
 *  parameters - Optional JS object containing parameters to set on the Connection. These parameters are then available via the getParameter method.
 */


  /*
  * Function: addType(typeId)
  * Adds the specified type to the Connection. Types are registered using registerConnectionType on the associated jsPlumb instance.  See the wiki page for a full discussion.
  * 
  * Parameters:
  * 	typeId - Id of the type to add.
  */  

/*
* Function: bind(event, callback)
* Bind to an event on the Connection.  
* 
* Parameters:
* 	event - the event to bind.  Available events on a Connection are:
*         - *click*						:	notification that a Connection was clicked.  
*         - *dblclick*						:	notification that a Connection was double clicked.
*         - *mouseenter*					:	notification that the mouse is over a Connection. 
*         - *mouseexit*					:	notification that the mouse exited a Connection.
* 		   - *contextmenu*                  :   notification that the user right-clicked on the Connection.
*         
*  callback - function to callback. This function will be passed the Connection that caused the event, and also the original event.    
*/

/*
* Function: getConnector()
* Gets The underlying Connector for this Connection (eg. a Bezier connector, straight line connector, flowchart connector etc)
*/

/*
* Function: getLabel()
* Returns the label text for this Connection (or a function if you are labelling with a function).
* 
* This does not return the overlay itself; this is a convenience method which is a pair with
* <setLabel>; together they allow you to add and access a Label Overlay without having to create the
* Overlay object itself.  For access to the underlying label overlay that jsPlumb has created,
* use <getLabelOverlay>.
*
* See Also:
* 	<getOverlay>
* 	<getLabelOverlay>
*/



/*
* Function: getPaintStyle()
* Gets the Connection's paint style. This is not necessarily the paint style in use at the time;
* this is the paint style for the connection when the mouse it not hovering over it.
* Returns:
* The current non-hover paint style.
*/



/*
 * Function: isDetachable()
 * Returns whether or not this connection can be detached from its target/source endpoint.  by default this
 * is false; use it in conjunction with the 'reattach' parameter.
 */

 /*
 * Function: isEditable()
 * Returns whether or not the Connection is editable.
 */

/*
* Function: isReattach()
* Returns whether or not this connection will be reattached after having been detached via the mouse and dropped.  by default this
* is false; use it in conjunction with the 'detachable' parameter.
*/

 /*
 * Function: isVisible()
 * Returns whether or not the Connection is currently visible.
 */



 

/*
* Function: setConnector(connector)
* Sets the Connection's connector (eg "Bezier", "Flowchart", etc).  You pass a Connector definition into this method, the same
* thing that you would set as the 'connector' property on a jsPlumb.connect call.
* 
* Parameters:
* 	connector		-	Connector definition
*/   

/*
* Function: setDetachable(detachable)
* Sets whether or not this connection is detachable.
*
* Parameters:
* 	detachable - whether or not to set the Connection to be detachable.
*/

/*
* Function: setEditable(editable)
* Sets whether or not the Connection is editable. This will only be honoured if
* the underlying Connector is editable - not all types are.
*
* Parameters:
* 	editable - whether or not to set the Connection to be editable
*/


  



 /*
 * Function: setReattach(reattach)
 * Sets whether or not this connection will reattach after having been detached via the mouse and dropped.
 *
 * Parameters:
 * 	reattach	-	whether or not to set the Connection to reattach after drop in whitespace.
 */

 /*
 * Function: setType(typeId)
 * Sets the type of the Connection. This replaces all existing types. Types are registered using registerConnectionType on the associated jsPlumb instance.  See the wiki page for a full discussion.
 * 
 * Parameters:
 * 	typeId - Id of the type to set.
 */

 /*
 * Function: setVisible(visible)
 * Sets whether or not the Connection should be visible.
 *
 * Parameters:
 *	visible - boolean indicating desired visible state.
 */
                                                 

    	
        
    	
         

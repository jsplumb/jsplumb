// ---------------- JSPLUMB ----------------------------------------

  


  

  		  

  		

   

 

 

 

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

 		

 		  












                                                 

    	
        
    	
         

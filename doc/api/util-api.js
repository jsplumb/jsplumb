/**
* @name jsPlumbUtil
* @class
* @classdesc A set of helper methods for use by jsPlumb.
*/

/** 
* Returns whether the given object is an Array. 
* @name jsPlumbUtil.isArray
* @function
*/

/** 
* Returns whether the given object is a String. 
* @name jsPlumbUtil.isString
* @function
*/

/** 
* Returns whether the given object is a Boolean. 
* @name jsPlumbUtil.isBoolean
* @function
*/

/** 
* Returns whether the given object is null. 
* @name jsPlumbUtil.isNull
* @function
*/

/** 
* Returns whether the given object is an Object. 
* @name jsPlumbUtil.isObject
* @function
*/
/** 
* Returns whether the given object is a Date. 
* @name jsPlumbUtil.isDate
* @function
*/
/** 
* Returns whether the given object is a Function. 
* @name jsPlumbUtil.isFunction
* @function
*/
/** 
* Returns whether the given object (an Object or Array) is empty. 
* @name jsPlumbUtil.isEmpty
* @function
*/
/** 
* Returns whether the given object is a Number. 
* @name jsPlumbUtil.isNumber
* @function
*/

/**
* @name jsPlumbUtil.perpendicularLineTo
* @function
* @desc calculates a perpendicular to the line fromPoint->toPoint, that passes through toPoint and is 'length' long.
* @param fromPoint
* @param toPoint
* @param length
*/

/**
 * @name jsPlumbUtil.EventGenerator 
 * @class
 * @classdesc Provides event bind/fire functionality.
 */

 /**
  * @name jsPlumbUtil.EventGenerator#bind
  * @function
  * @description Binds a listener to an event.  
  * @param {String} event Name of the event to bind to.
  * @param {Function} listener Function to execute.
  * @param {Boolean} [insertAtStart=false] Whether or not to insert this listener at the start of the listener list, so it is fired before the other currently registered listeners.
  */

  /**
   * @name jsPlumbUtil.EventGenerator#fire
   * @function
   * @private
   * @description Fires an update for the given event.
   * @param {String} event Event to fire
   * @param {Object} value Value to pass to the event listener(s).
   * @param {Event} originalEvent The original event from the browser
   */

   /**
   * @name jsPlumbUtil.EventGenerator#unbind
   * @function
   * @description Clears either all listeners, or listeners for some specific event.
   * @param {String} [event] Optional. constrains the clear to just listeners for this event.
   */
   /**
   * @name jsPlumbUtil.EventGenerator#setSuspendEvents
   * @function
   * @param {Boolean} val Whether or not to suspend events.
   * @desc Sets whether or not events are suspended.
   */
   /**
   * @name jsPlumbUtil.EventGenerator#isSuspendEvents        
   * @function
   * @returns {Boolean} True if events are suspended, false otherwise.
   */
   /**
   * @name jsPlumbUtil.EventGenerator#cleanupListeners
   * @function
   * @desc Removes all listeners.
   */
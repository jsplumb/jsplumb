/**
* A set of helper methods for use by jsPlumb.
* @class jsPlumbUtil
* @static
*/

/** 
* Returns whether the given object is an Array. 
* @method isArray
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is an Array, false otherwise.
*/

/** 
* Returns whether the given object is a String. 
* @method isString
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is a String, false otherwise.
*/

/** 
* Returns whether the given object is a Boolean. 
* @method isBoolean
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is a Boolean, false otherwise.
*/

/** 
* Returns whether the given object is null. 
* @method isNull
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is null, false otherwise.
*/

/** 
* Returns whether the given object is an Object. 
* @method isObject
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is an Object, false otherwise.
*/
/** 
* Returns whether the given object is a Date. 
* @method isDate
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is a Date, false otherwise.
*/
/** 
* Returns whether the given object is a Function. 
* @method isFunction
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is a Function, false otherwise.
*/
/** 
* Returns whether the given object (an Object or Array) is empty. 
* @method isEmpty
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is empty, false otherwise.
*/
/** 
* Returns whether the given object is a Number. 
* @method isNumber
* @static
* @param {Object} obj Object to test
* @return {Boolean} True if the object is a Number, false otherwise.
*/

/**
* Merges one object into another, optionally folding individual values into arrays.
* @method merge
* @static
* @param {Object} a Object to merge into
* @param {Object} b Object to merge from.
* @param [String[]] [collations] Optional list of parameter keys for values that, if present in both 'a' and 'b', should result in an array with values from each (rather than the default behaviour of overwriting a's value with b's)
*/

/**
 * Provides event bind/fire functionality.
 * @class jsPlumbUtil.EventGenerator 
 */

/**
 * Binds a listener to an event.
 * @method bind
 * @param {String} event Name of the event to bind to.
 * @param {Function} listener Function to execute.
 * @param {Boolean} [insertAtStart=false] Whether or not to insert this listener at the start of the listener list, so it is fired before the other currently registered listeners.
 */

  /**
   * Fires an update for the given event.
   * @method fire
   * @private
   * @param {String} event Event to fire
   * @param {Object} value Value to pass to the event listener(s).
   * @param {Event} originalEvent The original event from the browser
   */

   /**
   * Clears either all listeners, or listeners for some specific event.
   * @method unbind
   * @param {String} [event] Constrains the clear to just listeners for this event.
   */
   /**
   * Sets whether or not events are suspended.
   * @method setSuspendEvents
   * @param {Boolean} val Whether or not to suspend events.
   */
   /**
   * Checks whether or not events are currently suspended.
   * @method isSuspendEvents
   * @return {Boolean} True if events are suspended, false otherwise.
   */
   /**
   * Removes all listeners.
   * @method cleanupListeners
   */

/**
* Replaces values inside some JS object according to a given path spec. A path spec is a string in dotted notation,
* with each component optionally declaring an array index. Some examples are:
*
* foo.bar
* foo.baz[2]
* foo.qux[3].baz[3].shwee
*
* The function fails gracefully if the path identifies a non-existent object.
*
* @method jsPlumbUtil.replace 
* @param {Object} inObj Object to perform replacements inside.
* @param {String} path Path to use for replacements
* @param {Object} value Value to set.
*/
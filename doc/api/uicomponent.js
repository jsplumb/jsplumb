/**
* Abstract superclass for Endpoint, Connection, Connector and Overlay.
* This class provides support for a few basic capabilities that are common to many objects in jsPlumb:
* 
* - Events
* - Types
* - CSS Classes
* - Parameters
* - Paint Styles
*
* You don't interact directly with an instance of this class; it is abstract.  
* @class jsPlumbUIComponent
* @extends jsPlumbUtil.EventGenerator
*/

/**
* Gets a parameter from the component
* @method getParameter
* @param {String} name Name of the parameter to get
* @return {Object} The given parameter's value, null if not found.
*/

/**
* Sets a parameter on the component			
* @method setParameter
* @param {String} name Name of the parameter to set
* @param {Object} value Value to set
*/

/**
* Gets all parameters from the component. Note that you are given the actual parameters
* object, not a copy, so you can alter their values directly, and if you hold the reference
* to the parameters object you could cause a memory leak.
* @method getParameters
* @return {Object} All of the component's parameters.
*/

/**
* Sets all parameters on the component.
* @method setParameters
* @param {Object} params Parameters to set.
*/

/**
* Adds a class or some classes to the visual elements for the given component. 
* @method addClass
* @param {String} class The class(es) to add. The values are  appended as given, meaning you can supply a space separated string of several classes if you wish.
*/

/**
* Removes a class or some classes from the visual elements for the given component. You can supply a space separated string of several classes if you wish.
* @method removeClass
* @param {String} class The class(es) to remove.
*/

/**
* This function sets a `type` for the given component. It replaces all existing types. For a full discussion of the concept
* of types, see the jsPlumb documentation.
* @method setType
* @param {String} typeId Id of the type to set.
* @param {Object} [params] Optional parameter object to expand.
* @param {Boolean} [doNotRepaint=false] Tells jsPlumb not to repaint after setting the type.
*/

/**
* Gets the current type - or types - for this component.
* @method getType
* @return {String[]} The current list of types, empty if none registered.
*/

/**
* Clears all `types` for a given component.
* @method clearTypes
* @param {Boolean} [doNotRepaint=false] Tells jsPlumb not to repaint after clearing the types.
*/

/**
* Reapplies the current list of types with the given (optional) parameters. See the 
* jsPlumb documentation for a full discussion of types.
* @method reapplyTypes
* @param {Object} [params] Optional params to use when reapplying types.
*/

/**
* Returns whether or not the component currently has the given type.
* @method hasType
* @param {String} typeId Id of the type to check for
* @return {Boolean} True if the component has the type, false if not.
*/

/**
* Adds a type to the component. Note this is distinct from {@link #setType}, which overrides all current types - this function just adds a type to the existing list.
* @method addType
* @param {String} typeId Id of the type to add.
* @param {Object} [params] Optional params to use when applying the type.
* @param {Boolean} [doNotRepaint=false] Tells jsPlumb not to repaint after adding the type.
*/

/**
* Removes the given type from the component.
* @method removeType
* @param {String} typeId Id of the type to remove.
* @param {Boolean} [doNotRepaint=false] Tells jsPlumb not to repaint after removing the type.
*/

/**
* Toggles the given type on the component.			
* @method toggleType
* @param {String} typeId Id of the type to toggle.
* @param {Object} [params] Optional params to use if the type is not currently set and jsPlumb applies it.
* @param {Boolean} [doNotRepaint=false] Tells jsPlumb not to repaint after toggling the type.
*/

/**
* Returns whether or not the object is currently in hover state
* @method isHover
* @return {Boolean} True if in hover state, false if not.
*/

/**
* Sets the paint style to use when the mouse is hovering over the component. This is null by default.
* The hover paint style is applied as extensions to the paintStyle; it does not entirely replace
* it. This is because people will most likely want to change just one thing when hovering, say the
* color for example, but leave the rest of the appearance the same.
* @method setHoverPaintStyle
* @param {Object} style Style to use when the mouse is hovering. The allowed values in this object originally come from valid values in an HTML5 canvas.
* @param {String} [style.fillStyle] Fill style, in valid CSS format (a hex code, name, or rgb value). Note that setting a `fillStyle` on a Connector will cause the browser to fill the connector's path - probably not what you want.
* @param {String} [style.strokeStyle] Stroke style, in valid CSS format (a hex code, name, or rgb value). You can use `strokeStyle` on Endpoints to define a border.
* @param {Integer} [style.lineWidth] Width of the stroked line (for Connectors this is the Connector itself; for Endpoints it is the outline)
* @param {Boolean} [doNotRepaint] If true, the component will not be repainted. Useful when setting things up initially.
*/

/**
* Sets/unsets the hover state of this component.
* @method setHover
* @param {Boolean} hover Hover state boolean
* @param {Boolean} [ignoreAttachedElements=false] If true, does not notify any attached elements of the change in hover state.  Used mostly by jsPlumb internally, to avoid infinite loops.
*/

/**
* Sets the component's paint style and then repaints the component.
* @method setPaintStyle
* @param {Object} style Style to use. The allowed values in this object originally come from valid values in an HTML5 canvas.
* @param {String} [style.fillStyle] Fill style, in valid CSS format (a hex code, name, or rgb value). Note that setting a `fillStyle` on a Connector will cause the browser to fill the connector's path - probably not what you want.
* @param {String} [style.strokeStyle] Stroke style, in valid CSS format (a hex code, name, or rgb value). You can use `strokeStyle` on Endpoints to define a border.
* @param {Integer} [style.lineWidth] Width of the stroked line (for Connectors this is the Connector itself; for Endpoints it is the outline)
* @param {Boolean} [doNotRepaint=false] If true, the component will not be repainted.
*/



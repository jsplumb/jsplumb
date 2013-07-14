/**
* @doc function
* @name jsPlumbUIComponent.class:getParameter
* @param {string} name Name of the parameter to get
* @description
* Gets a parameter from the component
* @return {object} The given parameter's value, null if not found.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:setParameter
* @param {string} name Name of the parameter to set
* @param {object} value Value to set
* @description
* Sets a parameter on the component			
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:getParameters
* @description
* Gets all parameters from the component. Note that you are given the actual parameters
* object, not a copy, so you can alter their values directly, and if you hold the reference
* to the parameters object you could cause a memory leak.
* @return {object} All of the component's parameters.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:setParameters
* @param {object} p Parameters to set.
* @description
* Sets all parameters on the component.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:addClass
* @param {string} clazz The class(es) to add.
* @description
*  Adds a class or some classes to the visual elements for the given component. The values are 
* appended as given, meaning you can supply a space separated string of several classes if you wish.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:removeClass
* @param {string} clazz The class(es) to remove.
* @description Removes a class or some classes from the visual elements for the given component. You can supply a space separated string of several classes if you wish.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:setType
* @param {string} typeId Id of the type to set.
* @param {object} Optional parameter object to expand (see description)
* @param {boolean} doNotRepaint Defaults to false; tells jsPlumb not to repaint after setting the type.
* @description This function sets a `type` for the given component. It replaces all existing types. For a full discussion of the concept
* of types, see the jsPlumb documentation.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:getType
* @description Gets the current type - or types - for this component.
* @return {array} The current list of types, empty if none registered.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:reapplyTypes
* @param {object} params Optional params to use when reapplying types.
* @description Reapplies the current list of types with the given (optional) parameters. See the 
* jsPlumb documentation for a full discussion of types.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:hasType
* @param {string} typeId Id of the type to check for
* @description Returns whether or not the component currently has the given type.
* @return {boolean} True if the component has the type, false if not.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:addType
* @param {string} typeId Id of the type to add.
* @param {object} params Optional params to use when applying the type.
* @param {boolean} doNotRepaint Defaults to false; tells jsPlumb not to repaint after adding the type.
* @description Adds a type to the component. Note this is distinct from `setType`, which overrides all current types - this function just adds a type to the existing list.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:removeType
* @param {string} typeId Id of the type to remove.
* @param {boolean} doNotRepaint Defaults to false; tells jsPlumb not to repaint after removing the type.
* @description Removes the given type from the component.			
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:toggleType
* @param {string} typeId Id of the type to toggle.
* @param {object} params Optional params to use if the type does not exist and jsPlumb applies it.
* @param {boolean} doNotRepaint Defaults to false; tells jsPlumb not to repaint after toggling the type.
* @description Toggles the given type on the component.			
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:isHover
* @description
* Returns whether or not the object is currently in hover state
* @return {boolean} True if in hover state, false if not.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:setHoverPaintStyle
* Sets the paint style to use when the mouse is hovering over the component. This is null by default.
* The hover paint style is applied as extensions to the paintStyle; it does not entirely replace
* it.  This is because people will most likely want to change just one thing when hovering, say the
* color for example, but leave the rest of the appearance the same.
* @param {object} style Style to use when the mouse is hovering.
* @param {boolean} doNotRepaint If true, the component will not be repainted.  useful when setting things up initially.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:setHover
* @description Sets/unsets the hover state of this component.
* @param {boolean} hover Hover state boolean
* @param {boolean} ignoreAttachedElements If true, does not notify any attached elements of the change in hover state.  Used mostly by jsPlumb internally, to avoid infinite loops.
*/

/**
* @doc function
* @name jsPlumbUIComponent.class:setPaintStyle
* @description Sets the component's paint style and then repaints the component.
* @param {object} style Style to use.
*/



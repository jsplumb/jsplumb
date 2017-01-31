### Utility Functions

This page contains a summary of some common scenarios you may find when using jsPlumb, and what functions jsPlumb offers to help you.

#### Repainting an element or elements
Assuming you use `jsPlumb.draggable` to initialise your draggable elements, you do not typically need to instruct jsPlumb to repaint.  However, there are times when you need to, for instance:

- you have resized an element and you need jsPlumb to recompute the location of Endpoints on that element
- you have moved an element programmatically
- you didn't actually use `jsPlumb.draggable` to initialise some draggable element.

To force a repaint, use:

    jsPlumb.repaint(el, [ui])

The first argument - `el` - can be a number of different datatypes:

- a string, representing the id of some element
- a list of strings, representing the ids of some elements
- a DOM element
- a list of DOM elements
- a selector from your underlying library

#### Performance: provide the element offset
Notice the `ui` argument?  This is an offset in the form:

    { left:X, top:Y }

...which, if provided, means that jsPlumb does not have to go and compute the offset of the element. 

**Note** this is of course relevant only if you are repainting a single element. If you provide this when you're painting multiple elements, they will all be assumed to be at the given offset!


#### Repainting everything

To repaint everything:

    jsPlumb.repaintEverything();


### Element Ids
jsPlumb uses element ids as keys for Connections and Endpoints, so if an element id changes, jsPlumb needs to know about it.  You can either have jsPlumb do it for you:

    jsPlumb.setId(el, newId);

or tell jsPlumb about it afterwards:

    jsPlumb.setIdChanged(oldId, newId);


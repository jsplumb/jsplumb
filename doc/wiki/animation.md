## Animation

jsPlumb offers an `animate` function, which wraps the underlying animation engine for whichever library you happen to be using, and inserts a callback for jsPlumb to repaint whatever it needs to at each step. You could of course do this yourself; it's a convenience method really.

The method signature is:
    
    jsPlumb.animate : function(el, properties, options)

The arguments are as follows:
- **el** - element id, or element object from the library you're using.
- **properties** - properties for the animation, such as duration etc.
- **options** - options for the animation, such as callbacks etc.


#### jQuery and the 'revert' option

jQuery offers a `revert` option that you can use to instruct it to revert a drag under some condition. This is rendered in the UI as an animation that returns the drag object from its current location to wherever it started out. It's a nice feature. 

Unfortunately, the animation that runs the revert does not offer any lifecycle callback methods - no 'step', no 'complete', etc - so its not possible for jsPlumb to know that the revert animation is taking place.

#### Vanilla jsPlumb supported properties

The adapter used by vanilla jsPlumb (from 1.6.0 onwards) supports only `left` and `top` properties in the animate method.
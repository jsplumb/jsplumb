## Animation

jsPlumb offers a simple `animate` function, inserts a callback for jsPlumb to repaint whatever it needs to at each step. 
You could of course do this yourself; it's a convenience method really.

The method signature is:
    
    jsPlumb.animate : function(el, properties, options)

The arguments are as follows:
- **el** - element id, or element object from the library you're using.
- **properties** - properties for the animation, currently only `left` and `top` are supported.
- **options** - options for the animation, such as callbacks etc.

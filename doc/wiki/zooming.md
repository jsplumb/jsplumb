## Zooming

A fairly common requirement with the sorts of applications that use jsPlumb is the ability to zoom in and out.  As of release 1.5.0 there is a way to do this for browsers that support CSS3 (meaning, essentially, everything except IE < 9).

Changing zoom requires that you do two things:

1. Set a `transform` property on an appropriate container
- Tell jsPlumb what the zoom level is.

#### Container

You need to identify some element that is the parent of all of your nodes and the jsPlumb artefacts. This is probably fairly obvious. What you might not know about, though, is the `Container` concept in jsPlumb.  If you don't, I'd encourage you to go and [read this page](home#container) just quickly, because the best thing to do is to correctly configure a `Container` and then manipulate the `transform` property of that element.

Let's say we have some `div` whose id is `drawing`, and we're going to use that as the `Container`:

```javascript
jsPlumb.setContainer("drawing");
```
    
#### CSS `transform` property    
    
Now to set the zoom to 0.75, say, we change the `transform` property accordingly. Remember that `transform` is one of those properties that have several vendor prefix versions, so there are several ways to do what I've got here, and, given that you're probably a computer programmer, you've most likely got a favourite.  But anyway, here's something.

```javascript
$("#drawing").css({
  "-webkit-transform":"scale(0.75)",
  "-moz-transform":"scale(0.75)",
  "-ms-transform":"scale(0.75)",
  "-o-transform":"scale(0.75)",
  "transform":"scale(0.75)"
});
```
    
#### jsPlumb.setZoom

You now need to tell jsPlumb about the new zoom level:

```javascript
jsPlumb.setZoom(0.75);
```
    
#### A Helper Function

Maybe you'd like to just grab this:

```javascript
window.setZoom = function(zoom, instance, transformOrigin, el) {
  transformOrigin = transformOrigin || [ 0.5, 0.5 ];
  instance = instance || jsPlumb;
  el = el || instance.getContainer();
  var p = [ "webkit", "moz", "ms", "o" ],
      s = "scale(" + zoom + ")",
      oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

  for (var i = 0; i < p.length; i++) {
    el.style[p[i] + "Transform"] = s;
    el.style[p[i] + "TransformOrigin"] = oString;
  }

  el.style["transform"] = s;
  el.style["transformOrigin"] = oString;

  instance.setZoom(zoom);    
};
```

**Notes**

- `el` is a DOM element. You don't have to pass in `el`; if you do not, it uses the Container from the jsPlumb instance. 
- `transformOrigin` is optional; it defaults to [0.5, 0.5] - the middle of the element (this is the browser default too)
- `instance` is an instance of jsPlumb - either `jsPlumb`, the static instance, or some instance you got through 
`jsPlumb.newInstance(...)`. The function will default to using the static instance of jsPlumb if you do not provide one.
- `zoom` is a decimal where 1 means 100%.

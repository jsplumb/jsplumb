## Element Dragging

A common feature of interfaces using jsPlumb is that the elements are draggable. You should use the `draggable` method on a `jsPlumbInstance` to configure this:

```javascript
myInstanceOfJsPlumb.draggable("elementId");
```

...because if you don't, jsPlumb won't know that an element has been dragged, and it won't repaint the element.


- [Allowed Argument Types](#allowed-args)
- [Required CSS](#css)
- [Drag Containment](#containment)
- [Dragging Nested Elements](#nested)
- [Dragging Multiple Elements](#multiple)
- [Text Selection while dragging](#selection)

<a name="allowed-args"></a>
#### Allowed argument types

`draggable` supports several types as argument:

- a String representing an element ID
- an Element
- any "list-like" object whose contents are Strings or Elements. 

A "list-like" element is one that exposes a `length` property and which can be indexed with brackets (`[ ]`). Some examples are:

- arrays

```javascript
jsPlumbInstance.draggable(["elementOne", "elementTwo"]);
```

- jQuery selectors

```javascript
jsPlumbInstance.draggable($(".someClass"));
```

- NodeLists

```javascript
var els = document.querySelectorAll(".someClass");
jsPlumbInstance.draggable(els);
```

#### Options

TALK ABOUT THE OPTIONS ARG

If you absolutely cannot use jsPlumb.draggable, you will have to arrange to repaint the drag element manually, via jsPlumb.repaint.

Note `jsPlumb` is an instance of the `jsPlumbInstance` class. If you are working with your own instances of jsPlumb, be sure to call the draggable method on those instances, not the global instance.

##### Vanilla jsPlumb

In vanilla jsPlumb, drag support is provided by a bundled library called Katavorio. Katavorio supports drag containment and constraining elements to a grid, as well as drag/drop of multiple elements.

<a name="css"></a>
#### Required CSS

You *must* set `position:absolute` on elements that you intend to be draggable. The reasoning for this is that all libraries implement dragging by manipulating the left and top properties of an element's style attribute.

When you position an element absolute, these `left`/`top` values are taken to mean with respect to the origin of this element's `offsetParent`, and the `offsetParent` is the first ancestor of the element that has `position:relative` set on it, or the body if no such ancestor is found.

When you position an element relative, the `left`/`top` values are taken to mean _move the element from its normal position by these amounts_, where "normal position" is dependent on document flow. You might have a test case or two in which relative positioning appears to work; for each of these you could create several others where it does not.

You cannot trust relative positioning with dragging, and, despite popular opinion, jQuery's `draggable` method does not "work" with it at all, it just might seem to at times.

<a name="containment"></a>
#### Drag Containment

A common request is for the ability to contain the area within which an element may be dragged. This is supported in both jQuery jsPlumb and vanilla jsPlumb (to a certain extent).

##### jQuery

For jQuery this is as simple as providing a containment parameter:

```javascript
jsPlumb.draggable($("someSelector"), {
  containment:"parent"
});
```

##### jQuery and the 'revert' option

jQuery offers a revert option that you can use to instruct it to revert a drag under some condition. This is rendered in the UI as an animation that returns the drag object from its current location to wherever it started out. It's a nice feature.

Unfortunately, the animation that runs the revert does not offer any lifecycle callback methods - no "step", no "complete", etc - so it's not possible for jsPlumb to know that the revert animation is taking place, meaning jsPlumb "doesn't work", as it were, with the revert option.

##### Vanilla

Vanilla jsPlumb offers support for containing a dragged element within the bounds of its parent:

```javascript
jsPlumb.draggable("someElement", {
   containment:true
});
```

<a name="nested"></a>
#### Dragging nested elements

jsPlumb takes nesting into account when handling draggable elements. For example, say you have this markup:

```xml
<div id="container">
  <div class="childType1"></div>
  <div class="childType2"></div>
</div>
```

...and then you connect one of those child divs to something, and make container draggable:

```javascript
jsPlumb.connect({
  source:$("#container .childType1"),
  target:"somewhere else"
});

jsPlumb.draggable("container");
```

Now when you drag `container`, jsPlumb will have noticed that there are nested elements that have Connections, and they will be updated. Note that the order of operations is not important here: if container was already draggable when you connected one of its children to something, you would get the same result.

##### Nested Element offsets

For performance reasons, jsPlumb caches the offset of each nested element relative to its draggable ancestor. If you make changes to the draggable ancestor that will have resulted in the offset of one or more nested elements changing, *you need to tell jsPlumb about it*, using the `recalculateOffsets` function.

Consider the example from before, but with a change to the markup after initializing everything:

```xml
<div id="container">
  <div class="header" style="height:20px;background-color:blue;">header</div>
  <div class="childType1"></div>
  <div class="childType2"></div>
<div>
```

Connect a child div to some element and make it draggable:

```javascript
jsPlumb.connect({
  source:$("#container .childType1"),
  target:"somewhere else"
});

jsPlumb.draggable($(".childType1"));
```

Now if you manipulate the DOM in such a way that the internal layout of the container node is changed, you need to tell jsPlumb:

```javascript
$("#container .header").hide();    // hide the header bar. this will alter the offset of the other child elements...
jsPlumb.recalculateOffsets("container");   // tell jsPlumb that the internal dimensions have changed.
// you can also use a selector, eg $("#container")
```

Note in this example, one of the child divs was made draggable. jsPlumb automatically recalculates internal offsets after dragging stops in that case - you do not need to call it yourself.

<a name="multiple"></a>
#### Dragging Multiple Elements

Vanilla jsPlumb, because it uses Katavorio as its drag library, supports dragging multiple elements at once. You do this by interacting with the `dragSelection` on a given jsPlumb instance.  Three methods are provided:

- **addToDragSelection: function (spec)** Add the specified elements to the drag selection.
- **removeFromDragSelection: function (spec)** Remove the specified elements from the drag selection
- **clearDragSelection** Clear the drag selection.

As previously mentioned, these methods are all provided by [Katavorio](https://github.com/jsplumb/katavorio).

<a name="selection"></a>
#### Text Selection while dragging

The default browser behaviour on mouse drag is to select elements in the DOM. jQuery suppresses this behaviour, but vanilla jsPlumb does not. To assist with handling this, however, this class is attached to the body at drag start:

`_jsPlumb_drag_select`

The class is removed at drag end.

A suitable value for this class (this is from the jsPlumb demo pages) is:

```css
._jsPlumb_drag_select * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;    
}    
```

## Element Dragging

The major change in version 3.0.0 is that all drag operations are now handled by delegated event handlers, instead of registering event handlers
 on each element you wish to make draggable. This also applies to the drag operations used when creating connections via the mouse.
 
Previously, you would have used the `draggable` method on a `jsPlumbInstance` to configure this, but from version 3.0.0 onwards this is not necessary - all elements are draggable by default.
 
Using delegated drag handlers has an enormous benefit in terms of memory usage and the time taken to initialise elements. The drag handler, for
 instance, used to take 3 - 4 ms to initialise each element. If you've got hundred or thousands of elements this converts to a matter of seconds,
 which is a big deal.


<a name="disable"></a>
#### Disabling dragging for an element

You can disable dragging for a specific element by setting a `jtk-not-draggable` attribute on it. 

```
<div jtk-not-draggable>
This div is not draggable
</div>
```

```
<div jtk-not-draggable="true">
Neither is this
</div>
```

```
<div jtk-not-draggable="false">
This is draggable. But you could just omit/delete the attribute.
</div>
```


<a name="selection"></a>
#### Text Selection while dragging

The default browser behaviour on mouse drag is to select elements in the DOM. To assist with handling this, this class is 
attached to the body at drag start:

`jtk-drag-select`

The class is removed at drag end.

A suitable value for this class (this is from the jsPlumb demo pages) is:

```css
.jtk-drag-select * {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;    
}    
```

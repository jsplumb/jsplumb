---
category: Dragging
title: Element Dragging
keywords: ui, drag, dragging
---

** This page has been updated to reflect changes in 4.x. Not all pages have. If you don't see this message on some other page it means we're yet to convert that page** 

## Element Dragging

A common feature of interfaces using jsPlumb is that the elements are draggable. In jsPlumb 4.x, all elements are draggable by default - there is no need to call the `draggable` function like in previous versions.


<a name="css"></a>
#### Required CSS

You *must* set `position:absolute` on elements that you intend to be draggable. The reasoning for this is that all libraries implement dragging by manipulating the left and top properties of an element's style attribute.

When you position an element absolute, these `left`/`top` values are taken to mean with respect to the origin of this element's `offsetParent`, and the `offsetParent` is the first ancestor of the element that has `position:relative` set on it, or the body if no such ancestor is found.

When you position an element relative, the `left`/`top` values are taken to mean _move the element from its normal position by these amounts_, where "normal position" is dependent on document flow. You might have a test case or two in which relative positioning appears to work; for each of these you could create several others where it does not.

You cannot trust relative positioning with dragging.  The easiest way to ensure your elements will be positioned absolute is to include the `jsplumbtoolkit-defaults.css` file that ships in the `@jsplumb/browser-ui` package.

<a name="containment"></a>
### Constraining Drag

jsPlumb offers a few ways of constraining where an element may be dragged to.

#### Via a ConstrainFunction

```javascript
jsPlumbBrowserUI.newInstance({
    dragOptions:{
        constrainFunction:(el:HTMLElement, pos:PointXY):PointXY => {
            // do some maths
            return somePointXY;
        }
    }
})
```

#### Via the `containment` property

If you just want to constrain element dragging to the parent container, use `containment`. There are three possible values for `containment`; under the hood jsPlumb creates a `ConstrainFunction` that implements the desired behaviour

- `notNegative`  - Elements can not be dragged into the negative in either the X or Y axis. This is helpful to prevent people from dragging elements to a position they can't get them back from

- `parent` - Elements can not be dragged into the negative, and they also cannot be dragged to a position where no part of them is visible in the positive axes either.

- `parentEnclosed` - Elements cannot be dragged to a position where any part of them lies outside the bounds of the parent container.

```javascript
jsPlumbBrowserUI.newInstance({
    dragOptions:{
        containment:"notNegative"
    }
})
```

#### Containment padding

When you use `parent` as the value for `containment` you can also specify a `containmentPadding` value (whose default is 5 pixels). This is the number of pixels that must be visible of some element when it has been dragged outside the bounds of the parent container in the positive axis. 

```javascript
jsPlumbBrowserUI.newInstance({
    dragOptions:{
        containment:"parent",
        containmentPadding:10
    }
})
```


<a name="grid"></a>
#### Dragging on a Grid

To constrain elements to a grid, supply the size of the grid in the `dragOptions` when creating a new instance:

```javascript
jsPlumbBrowserUI.newInstance({
    dragOptions:{
        grid:[50,50]
    }
})
```

<a name="multiple"></a>
### Dragging Multiple Elements

jsPlumb supports dragging multiple elements at once. There are two ways to do this.

#### The drag selection

Every jsPlumb instance has an associated `dragSelection` - a set of elements that are considered to be "selected" (and which have a CSS class assigned to them to indicate this fact). Any drag event occurring in the instance will cause the currently selected elements to be dragged too.  
 
There are three methods provided to work with the drag selection:

- `addToDragSelection(...el:Array<Element>)`  Add the specified elements to the drag selection.     
- `clearDragSelection()` Clear the drag selection.
- `removeFromDragSelection(...el:Array<Element>)` Remove the specified elements from the drag selection


#### Drag Groups

There is another way of configuring multiple element drag - the concept of a `drag group`. This is a group of elements that should all move whenever one of them is dragged. This mechanism is intended to be used for more "permanent" multiple drag arrangements - you may have a set of nodes that should always move together and they do not need to be considered to be "selected". 

You can define multiple drag groups in an instance but each element can belong to one drag group only. An element in a drag group is considered to be in one of two states: `active` or `passive`. An `active` element is one which, when dragged, causes all of the other elements in the drag group to be dragged along with it, maintaining the offsets between the dragged element and all of the other elements in the drag group. A `passive` element is one which, when dragged, does not cause the other elements in the drag group to be dragged, but which does get dragged whenever an `active` element is dragged. 

These methods are provided for working wth drag groups:

- `addToDragGroup(spec:DragGroupSpec, ...els:Array<Element>)`

Adds the given element(s) to the given drag group.  The `DragGroupSpec` interface has the following definition:
                                                    
```javascript
export type DragGroupSpec = string | { id:string, active:boolean }
```

...you either pass the ID of some drag group, or you pass its ID along with the state you want the new element(s) to be in. The default state is `active`.

- `removeFromDragGroup(...els:Array<Element>)`

Remove the given element(s) from any drag group they may be in.

- `setDragGroupState (state:boolean, ...els:Array<Element>)`

Change the state of the given element(s) inside their drag group.


<a name="selection"></a>
### Text Selection while dragging

The default browser behaviour on mouse drag is to select elements in the DOM. To assist with handling this, this class is attached to the body at drag start:

`jtk-drag-select`

The class is removed at drag end.

A suitable value for this class (this is provided in the `jsplumbtoolkit-defaults.css` file bundled with `@jsplumb/browser-ui`) is:

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

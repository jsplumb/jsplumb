---
category: Data Model
title: Scrollable Lists
keywords: lists, scroll, list item
---

## Scrollable Lists

jsPlumb supports the concept of scrollable lists - lists of items which can be connected, and when the list is scrolled, any connections
to/from a list item are scrolled too. When a particular list item is scrolled out of the list's viewport, any connections for that item
are stacked on the list itself.
 
- [Adding a List](#adding)
- [Removing a List](#removing)


<a name="adding" ref="list, add, scroll, scrollable" title="Adding a List"></a>
### Adding a list

To add a list you first need to have added it as an element in the DOM, and that it's behaving list a list does - which probably means its
a `ul`, a `dl`, or a `div` acting as a flex column, with `overflow:auto`. It is also a requirement that `position:relative` be set on the list element;
jsPlumb needs this when calculating the offset of its list items.

This is the most basic call:

```javascript
jsPlumbInstance.addList(someElement);
```

jsPlumb will add a `jtk-scrollable-list` attribute to `someElement`, and attach a scroll handler to it. If you use the `jsplumbtoolkit-defaults.css`
 file, this `jtk-scrollable-list` attribute will cause `position:relative` to be set on the element. Otherwise just make sure you do it yourself.
 
With this basic call, when an item scrolls out of the viewport, the behaviour will be:

- if the item scrolls out of the top and the endpoint is a source endpoint, the connection will be anchored to the `TopRight` of the list, and the
endpoint used will be of the same type as the endpoint on the scrolled item.
 
- if the item scrolls out of the top and the endpoint is a target endpoint, the connection will be anchored to the `TopLeft` of the list, and the
 endpoint used will be of the same type as the endpoint on the scrolled item.
 
Scrolling out of the bottom results in either a `BottomRight` or `BottomLeft` anchor being used.

#### List options

- `anchor:AnchorSpec` Optional. Supply this to provide the anchor used when any item is scrolled out of the viewport. This option takes precedence over `deriveAnchor`.
- `deriveAnchor:(edge, index, endpoint, connection) => AnchorSpec` Optional; `anchor` takes precedence. This offers a way for you to dynamically choose an anchor point based on the current situation.
 `edge` is one of `"top"` or `"bottom"`. `index` is 0 for a source endpoint and 1 for a target endpoint.
- `endpoint:EndpointSpec` Optional. Supply this to provide the endpoint used when any item is scrolled out of the viewport. `deriveEndpoint` takes precedence over this.
- `deriveEndpoint:(edge, index, endpoint, connection) => AnchorSpec` Optional. Takes precedence over `endpoint`. 
 


<a name="removing" ref="list, remove, scroll, scrollable" title="Removing a list"></a>
### Removing a List

```javascript
jsPlumbInstance.removeList(someElement);
```




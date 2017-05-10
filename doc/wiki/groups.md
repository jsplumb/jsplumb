## Groups

jsPlumb supports the concept of 'Groups', which are elements that act as the parent for a set of child elements. When a
 Group element is dragged, its child elements (which are, in the DOM, child nodes of the Group element) are dragged 
 along with it. Groups may be collapsed, which causes all of their child elements to be hidden, and for any connections
 from a child element to outside of the Group to be "proxied" onto the Group's collapsed element.
 
- [Adding a Group](#adding)
- [Removing a Group](#removing)
- [Proxy Endpoints](#proxyendpoints)
- [Adding an element to a Group](#addingElement)
- [Removing an element from a Group](#removingElement)
- [Dragging and dropping child elements](#childdragdrop)
- [Collapsing and expanding Groups](#collapseexpand)
- [CSS Classes](#css)
- [Events](#events)
- [Miscellaneous Methods](#misc)


<a name="adding"></a>
### Adding a Group

To add a Group you first need to have added it as an element in the DOM.  Let's assume you have some element called
`foo`. It can be any valid HTML element but since Groups are by their nature containers for other elements it's probably
best to just stick to trusty `div`. So let's assume you have a variable `foo` that references a DIV element.

A simple example, using the defaults:

```javascript
jsPlumb.addGroup({
  el:"foo",
  id:"aGroup"
});
```

Here we've created a Group with ID `aGroup`. Its element - `foo` - will be made draggable, and it will also
be configured to accept elements being dropped onto it.  By default, child elements will be draggable outside of the
Group element, but if they are not dropped onto another Group they will revert to their position inside the Group
element before they were dragged.

Several aspects of a Group's behaviour can be configured; broadly speaking these fall into two categories: the behaviour
of the Group element, and the behaviour of its child elements.

#### Group element parameters

- **draggable** Set to true by default. If false, the Group element will not be made into a draggable element.
- **dragOptions** Options for the Group element's drag behaviour. One parameter you will likely want to consider in
 the `dragOptions` is `filter`, which provides a selector, or selectors, identifying elements that should not cause a 
 drag to begin. For a Group element you will probably want to identify the child elements of the Group, so that they 
 can be dragged without kicking off a drag of the Group element.
- **droppable** Set to true by default. If false, the Group element will not allow elements to be dropped onto it in
order to add them to the Group.
- **dropOptions** Options for the Group element's drop behaviour.
- **proxied** True by default. Indicates that connections to child elements inside the Group (which emanate from outside
of the Group) should be proxied, when the Group is collapsed, by connections attached to the Group's element.

#### Child element behaviour parameters

- **revert** By default this is true, meaning that child elements dropped outside of the Group (and not onto another Group
that is accepting droppables) will revert to their last position inside the group on mouseup. If you set `revert:false` 
you get a Group that allows child elements to exist outside of the bounds of the Group element, but which will still 
drag when the Group is dragged and will be made invisible when the Group is collapsed.

- **prune** Set to false by default. If true, a child element dropped in whitespace outside of the Group element will
be removed from the Group and from the instance of jsPlumb, and any connections attached to the element will also be
cleaned up.

- **orphan** Set to false by default. If true, a child element dropped in whitespace outside of the Group element will
be removed from the Group, but not from the instance of jsPlumb.

- **constrain** Set to false by default. If true, child elements are constrained to be dragged inside of the Group
element only.

- **ghost** Set to false by default. If true, a child element that is dragged outside of the Group element will have 
  its original element left in place, and a 'ghost' element - a clone of the original - substituted, which tracks
  with the mouse.
  
- **dropOverride** False by default. If true, child elements may be dragged outside of the Group element (assuming 
no other flag prevents this), but may not be dropped onto other Groups.

#### Collapsed state

By default, a Group will initially be rendered in its expanded state. You can request the Group be collapsed initially:

```javascript
jsPlumb.addGroup({
  el:"foo",
  collapsed:true
});
```



<a name="removing"></a>
Groups can be removed with the `removeGroup` method:

```javascript
jsPlumb.removeGroup("aGroup");
```

This will remove the Group with ID `aGroup`.  If you also wish to remove all of the Group's child elements you can
provide a second argument:

```javascript
jsPlumb.removeGroup("aGroup", true);
```

---

<a name="proxyendpoints"></a>
### Proxy Endpoints

You can control the location, appearance and behaviour of the Endpoints that appear when a Group is collapsed with
 the `anchor` and `endpoint` parameters. These take the same values as in the other parts of the API in which they
 appear. For instance, perhaps you want to show a smallish dot that tracks the perimeter of a Group when it is
 collapsed:
 
```javascript
jsPlumb.addGroup({
    el:someElement,
    id:"aGroup",
    anchor:"Continuous",
    endpoint:[ "Dot", { radius:3 } ]
});
```

Perhaps you want to show a large rectangle in the top left corner:

```javascript
jsPlumb.addGroup({
    el:someElement,
    id:"aGroup",
    anchor:"TopLeft",
    endpoint:[ "Rectangle", { width:10, height:10 } ]
});
```

etc. Any valid `anchor` or `endpoint` may be used. 


---

<a name="addingElement"></a>
### Adding an element to a Group

You can add an element to a Group programmatically with the `addToGroup(group, el)` method:

```javascript
jsPlumb.addToGroup("aGroup", someElement);
```

If you try to add an element that already belongs to some other Group an exception is thrown.

---

<a name="removingElement"></a>

### Removing an element from a Group

You can remove an element from a Group programmatically with the `removeGromGroup(el)` method:

```javascript
jsPlumb.removeFromGroup(someElement);
```

Note that you do not need to nominate the Group from which you wish to remove the element. Since an element can belong
to only one Group at a time, it will simply be removed from the Group. If you call this method with an element that does
not belong to a Group, nothing happens.

---

<a name="childdragdrop"></a>
### Dragging and dropping child elements

By default, Groups are configured to accept elements being dropped onto them - any element that is currently being
managed by the jsPlumb instance, not just existing members of other groups. There are a few ways to prevent this,
both already discussed above:

- Set **droppable:false** when you create a Group:

```javascript
jsPlumb.addGroup({
    el:someElement,
    droppable:false
});
```

This prevents the Group from accepting dropped elements.

- Set **constrain:true** when you create a Group:

```javascript
jsPlumb.addGroup({
  el:someElement,
  constrain:true
});
```

This will prevent elements from being dragged outside of the Group.

- Set **dropOverride:true** when you create a Group:

```javascript
jsPlumb.addGroup({
  el:someElement,
  dropOverride:true
});
```

This will prevent elements from being dropped onto some other Group.


---

<a name="collapseexpand"></a>
### Collapsing and expanding Groups

Use `collapseGroup` and `expandGroup`:

```javascript

jsPlumb.collapseGroup("aGroup");

jsPlumb.expandGroup("aGroup");

```

--- 

<a name="css"></a>
### CSS

Three CSS classes are used:

<table>
<tr><td>Class</td><td>Purpose</td></tr>
<tr><td>jtk-group-expanded</td><td>added to non-collapsed group elements (added when group initialised)</td></tr>
<tr><td>jtk-group-collapsed</td><td>added to collapsed group elements</td></tr>
<tr><td>jtk-ghost-proxy</td><td>added to the proxy element used when `ghost` is set to true</td></tr>
</table>

---

<a name="events"></a>
### Events

A number of events are fired by the various methods for working with Groups.

<table>
<tr><td>Event</td><td>Description</td><td>Parameters</tr>
<tr><td>group:add</td><td>Fired when a new Group is added</td><td><strong>{group:Group}</strong></td></tr>
<tr><td>group:remove</td><td>Fired when a Group is removed</td><td><strong>{group:Group}</strong></td></tr>
<tr><td>group:addMember</td><td>Fired when an element is added to a Group</td><td><strong>{group:Group, el:Element}</strong></td></tr>
<tr><td>group:removeMember</td><td>Fired when an element is removed from a Group</td><td><strong>{group:Group, el:Element}</strong></td></tr>
<tr><td>group:collapse</td><td>Fired when a Group is collapsed</td><td><strong>{group:Group}</strong></td></tr>
<tr><td>group:expand</td><td>Fired when a Group is expanded</td><td><strong>{group:Group}</strong></td></tr>
</table>

---

<a name="misc"></a>
### Miscellaneous Methods

#### Retrieving a Group

- **getGroup(ID)** Return the Group with the given ID. May be null.

#### Finding out the Group to which an element belongs

- **getGroupFor(elementOrID)** - Gets the Group to which the given element (specified as a DOM element or element ID) 
belongs to. Returns null if the element either does not exist or does not belong to a Group.

#### Getting the members of a Group

- **getMembers()** - Note that this is a method on the Group object, which you either got back from a call to
 `addGroup` on a jsPlumb instance, or you retrieved from a jsPlumb instance using `getGroup(groupId)`.
 
 






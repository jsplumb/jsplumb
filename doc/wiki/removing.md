- [Removing Nodes](#nodes)
- [Removing Connections](#connections)
- [Removing Endpoints](#endpoints)

<a name="nodes"></a>
### Removing Nodes

If you have configured a DOM element with jsPlumb in any way you should use jsPlumb to remove the element from the DOM.

To help you with this, jsPlumb offers two methods:

#### jsPlumb.remove

This removes an element from the DOM and all Connections and Endpoints associate with that element:

```javascript
var conn = jsPlumb.connect({source:"element1", target:"element2"});
...
jsPlumb.remove("element1");
```

`conn` is now detached and `element1` is gone from the DOM. 

You can also pass a selector or DOM element to the `remove` method.

#### jsPlumb.empty

This removes all the child elements from some element, and all of the Connections and Endpoints associated with those child elements. Perhaps you have this markup:

```xml
<ul id="list">
  <li id="one">One</li>
</ul>
```

```javascript
var conn = jsPlumb.connect({source:"one", target:"someOtherElement"});
...
jsPlumb.empty("list");
```

`conn` is now detached and the UL is empty.

You can also pass a selector or DOM element to the `empty` method.

### Removing Connections/Endpoints

There are a number of different functions you can use to remove Connections and/or Endpoints.

<a name="connections"></a>
### Connections

##### Detaching a single connection

To remove a single Connection, use `jsPlumb.detach`:

    var conn = jsPlumb.connect({ some params});
    ...
    jsPlumb.detach(conn);

When you call `jsPlumb.detach` to remove a Connection, the Endpoints associated with that Connection may or may not also be deleted - it depends on the way the Connection was established. The Endpoints *will* be deleted under the following circumstances:

- you created the Connection using `jsPlumb.connect` and you did not set `deleteEndpointsOnDetach:false`.
- the Connection was created via the mouse by a user on an element configured via `makeSource` which did not have `deleteEndpointsOnDetach:false` set.


The Endpoints *will not* be deleted under the following circumstances:


- you created the Connection using `jsPlumb.connect` and you set `deleteEndpointsOnDetach:false`
- the Connection was created via the mouse by a user from an Endpoint registered with `addEndpoint`.
- the Connection was created via the mouse by a user on an element configured via `makeSource` which had `deleteEndpointsOnDetach:false` set.



##### Detaching all Connections from a single element

To detach all the Connections from some given element:

    jsPlumb.detachAllConnections(el, [params])


**el** may be:

- a String representing an element id
- a DOM element
- a selector representing a single element

**params** is optional and may contain:

- **fireEvent** - whether or not to fire a disconnection event. The default is true.
                

#### Detaching all Connections from every element
To detach every Connection in jsPlumb:

    jsPlumb.detachEveryConnection();

This leaves all Endpoints in place according to the deletion rules outlined in the description of `jsPlumb.detach` above.


<a name="endpoints"></a>
### Endpoints

##### Deleting a single Endpoint
To delete a single Endpoint:

    var ep = jsPlumb.addEndpoint(someElement, { ... });
    ...
    jsPlumb.deleteEndpoint(ep);

**ep** may be either:

- a String, representing an Endpoint's UUID (when you add an Endpoint you can provide a `uuid` member for that Endpoint)
- an actual Endpoint object (as in the example above)


##### Deleting every Endpoint
To delete every Endpoint in jsPlumb:

    jsPlumb.deleteEveryEndpoint();

This has the effect of removing every Endpoint and also every Connection. 

**Note** this method is quite similar to `jsPlumb.reset`, except that this method does not remove any event handlers that have been registered.
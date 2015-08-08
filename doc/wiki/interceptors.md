### Interceptors
Interceptors are basically event handlers from which you can return a value that tells jsPlumb to abort what it is that it was doing.  There are four interceptors supported - `beforeDrop`, which is called when the user has dropped a Connection onto some target, `beforeDetach`, which is called when the user is attempting to detach a Connection (by dragging it off one of its Endpoints and dropping in whitespace), `beforeDrag`, which is called when the user begins to drag a Connection, and `beforeStartDetach`, which is when the user has just begun to drag an existing Connection off of one of its Endpoints (compared with `beforeDetach`, in which the user is allowed to drag the Connection off).

Interceptors can be registered via the `bind` method on an instance of jsPlumb just like any other event listeners, and they can also be passed in to the `addEndpoint`, `makeSource` and `makeTarget` methods.  

Note that binding `beforeDrop` (as an example) on a jsPlumb instance itself is like a catch-all: it will be called every time a Connection is dropped on _any_ Endpoint, unless that Endpoint has its own `beforeDrop` interceptor. But passing a beforeDrop callback into an Endpoint constrains that callback to just the Endpoint in question.  		

#### beforeDrop
This event is fired when a new or existing connection has been dropped. Your callback is passed a JS object with these fields:

- **sourceId** - the id of the source element in the connection
- **targetId** - the id of the target element in the connection
- **scope** - the scope of the connection
- **connection** - the actual Connection object.  You can access the 'endpoints' array in a Connection to get the Endpoints involved in the Connection, but be aware that when a Connection is being dragged, one of these Endpoints will always be a transient Endpoint that exists only for the life of the drag. To get the Endpoint on which the Connection is being dropped, use the 'dropEndpoint' member.
- **dropEndpoint** - this is the actual Endpoint on which the Connection is being dropped.  This **may be null**, because it will not be set if the Connection is being dropped on an element on which makeTarget has been called. 


If you return false (or nothing) from this callback, the new Connection is aborted and removed from the UI.

#### beforeDetach
This is called when the user has detached a Connection, which can happen for a number of reasons: by default, jsPlumb allows users to drag Connections off of target Endpoints, but this can also result from a programmatic 'detach' call.  Every case is treated the same by jsPlumb, so in fact it is possible for you to write code that attempts to detach a Connection but then denies itself!  You might want to be careful with that. 

Note that this interceptor is passed the actual Connection object; this is different from the beforeDrop interceptor discussed above: in this case, we've already got a Connection, but with beforeDrop we are yet to confirm that a Connection should be created.

Returning false - or nothing - from this callback will cause the detach to be abandoned, and the Connection will be reinstated or left on its current target.

#### beforeDrag
This is called when the user starts to drag a new Connection.  These parameters are passed to the function you provide:

- **endpoint** the Endpoint from which the user is dragging a Connection
- **source** the DOM element the Endpoint belongs to
- **sourceId** the ID of the DOM element the Endpoint belongs to

`beforeDrag` operates slightly differently to the other interceptors: it is still the case that returning false from your interceptor function will abort the current activity - in this case cancelling the drag - but  you can also return an object from your interceptor, and this object will be passed in as the `data` parameter in the constructor of the new Connection:

```javascript
jsPlumbInstance.bind("beforeDrag", function(params) {
  return {
   foo:"bar"
  }
});
```

This is particularly useful if you have defined any [parameterized connection types](types#parameterized-connection-type). With this mechanism you can arrange for a newly dragged Connection to be populated with data of your choice.

**Note** all versions of jsPlumb prior to 1.7.6 would fire `beforeDetach` for both new Connection drags and also 
dragging of existing Connections. From 1.7.6 onwards this latter behaviour has been moved to the 
`beforeStartDetach` interceptor.

#### beforeStartDetach
This is called when the user starts to drag an existing Connection.  These parameters are passed to the function you provide:

- **endpoint** the Endpoint from which the user is dragging a Connection
- **source** the DOM element the Endpoint belongs to
- **sourceId** the ID of the DOM element the Endpoint belongs to
- **connection** The Connection that is about to be dragged.

Returning false from `beforeStartDetach` prevents the Connection from being dragged.
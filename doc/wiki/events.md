## Events
jsPlumb supports binding to several different events on Connections, Endpoints and Overlays, and also on the jsPlumb object itself.  

- [jsPlumb Events](#jsPlumbEvents)
<ul>
      <li>[connection](#evt-connection)</li>
      <li>[connectionDetached](#evt-connection-detached)</li>
      <li>[connectionMoved](#evt-connection-moved)</li>
      <li>[click](#evt-click)</li>
      <li>[dblclick](#evt-dlbclick)</li>
      <li>[endpointClick](#evt-endpoint-click)</li>
      <li>[endpointDblClick](#evt-endpoint-dblclick)</li>
      <li>[contextmenu](#evt-contextmenu)</li>
      <li>[beforeDrop](#evt-beforedrop)</li>
      <li>[beforeDetach](#evt-beforedetach)</li>
      <li>[zoom](#evt-zoom)</li>
</ul>
- [Connection Events](#connectionEvents)
- [Endpoint Events](#endpointEvents)
- [Overlay Events](#overlayEvents)
- [Unbinding Events](#unbindingEvents)
			
<a name="jsPlumbEvents"></a>
### jsPlumb Events
To bind an to event on jsPlumb itself (or a jsPlumb instance), use `jsPlumb.bind(event, callback)`:

    jsPlumb.bind("connection", function(info) {
       .. update your model in here, maybe.
    });

These are the events you can bind to on the jsPlumb class:

<a name="evt-connection"></a>
##### connection(info, originalEvent)
Notification a Connection was established.

`info` is an object with the following properties:					
    <ul>
      <li><strong>connection</strong> - 	the new Connection.  you can register listeners on this etc.</li>
      <li><strong>sourceId</strong> -	id of the source element in the Connection</li>
      <li><strong>targetId</strong> -	id of the target element in the Connection</li>
      <li><strong>source</strong> -	the source element in the Connection</li>
      <li><strong>target</strong> -	the target element in the Connection</li>
      <li><strong>sourceEndpoint</strong> -	the source Endpoint in the Connection</li>
      <li><strong>targetEndpoint</strong> -	the targetEndpoint in the Connection</li>
    </ul>

**Note:** `jsPlumb.connect` causes this event to be fired, but there is of course no original event when a connection is established programmatically. So you can test to see if `originalEvent` is undefined to determine whether a connection was estblished using the mouse or not.

All of the source/target properties are actually available inside the Connection object, but - for one of those rubbish historical reasons - are provided separately because of a vagary of the `connectionDetached` callback, which is discussed below.

<a name="evt-connection-detached"></a>
##### connectionDetached(info, originalEvent)
Notification a Connection was detached.  

As with `connection`, the first argument to the callback is an object with the following properties:

  <ul>
      <li><strong>connection</strong> - the Connection that was detached.</li>
      <li><strong>sourceId</strong> - id of the source element in the Connection _before_ it was detached</li>
      <li><strong>targetId</strong> -	id of the target element in the Connection before it was detached</li>
      <li><strong>source</strong> -	the source element in the Connection before it was detached</li>
      <li><strong>target</strong> -	the target element in the Connection before it was detached</li>
      <li><strong>sourceEndpoint</strong> -	the source Endpoint in the Connection before it was detached</li>
      <li><strong>targetEndpoint</strong> -	the targetEndpoint in the Connection before it was detached</li>
  </ul>

This event is not fired when a newly dragged Connection is abandoned before being connected to something. To catch that,
 use `connectionAborted`.

The `source`/`target` properties are provided separately from the Connection, because this event is fired whenever a 
Connection is either detached and abandoned, or detached from some Endpoint and attached to another.  In the latter case, 
the Connection that is passed to this callback is in an indeterminate state (that is, the Endpoints are still in the 
state they are in when dragging, and do not reflect static reality), and so the `source`/`target` properties give you 
the real story.

The second argument is the original mouse event that caused the disconnection, if any. 

<a name="evt-connection-moved"></a>
##### connectionMoved(info, originalEvent)
Notification that an existing connection's source or target endpoint was dragged to some new location. `info` contains the following properties:
    <ul>
        <li><strong>index</strong> - 0 for source endpoint, 1 for target endpoint</li>
        <li><strong>originalSourceId</strong> - id of connection source element before move</li>
        <li><strong>newSourceId</strong> - id of connection source element after move</li>
        <li><strong>originalTargetId</strong> id of connection target before move</li>
        <li><strong>newTargetId</strong> - id of connection target after move</li>
        <li><strong>originalSourceEndpoint</strong> - source endpoint before move</li>
        <li><strong>newSourceEndpoint</strong> - source endpoint after move</li>
        <li><strong>originalTargetEndpoint</strong> - target endpoint before move</li>
        <li><strong>newTargetEndpoint</strong> - target endpoint after move</li>
    </ul>

<a name="evt-connection-aborted"></a>
##### connectionAborted(connection, originalEvent)
Fired when a new Connection is dragged but abandoned before being connected to an Endpoint or a target element. 
	
<a name="evt-connection-drag"></a>
##### connectionDrag(connection)
Notification an existing Connection is being dragged. Note that when this event fires for a brand new Connection, the target of the Connection is a transient element that jsPlumb is using for dragging, and will be removed from the DOM when the Connection is subsequently either established or aborted.

<a name="evt-connection-drag-stop"></a>
##### connectionDragStop(connection)
Notification a Connection drag has stopped. This is only fired for existing Connections.

<a name="evt-click"></a>
##### click(connection, originalEvent)
Notification a Connection was clicked.

<a name="evt-dblclick"></a>
##### dblclick(connection, originalEvent)
Notification a Connection was double-clicked.

<a name="evt-endpoint-click"></a>
##### endpointClick(endpoint, originalEvent)
Notification an Endpoint was clicked.

<a name="evt-endpoint-dblclick"></a>
##### endpointDblClick(endpoint, originalEvent)
Notification an Endpoint was double-clicked.

<a name="evt-contextmenu"></a>
##### contextmenu(component, originalEvent)
A right-click on some given component.  jsPlumb will report right clicks on both Connections and Endpoints.

<a name="evt-beforedrop"></a>
##### beforeDrop(info)
This event is fired when a new or existing connection has been dropped. `info` contains the following properties:
					<ul>
						<li><strong>sourceId</strong> - the id of the source element in the connection</li>
						<li><strong>targetId</strong> - the id of the target element in the connection</li>
						<li><strong>scope</strong> - the scope of the connection</li>
						<li><strong>connection</strong> - the actual Connection object.  You can access the 'endpoints' array in a Connection to get the Endpoints involved in the Connection, but be aware that when a Connection is being dragged, one of these Endpoints will always be a transient Endpoint that exists only for the life of the drag. To get the Endpoint on which the Connection is being dropped, use the `dropEndpoint` member.</li>
						<li><strong>dropEndpoint</strong> - this is the actual Endpoint on which the Connection is being dropped.  This <strong>may be null</strong>, because it will not be set if the Connection is being dropped on an element on which makeTarget has been called. </li>
					</ul>

If you return false (or nothing) from this callback, the new Connection is aborted and removed from the UI.						
				
<a name="evt-beforedetach"></a>        
##### beforeDetach(connection)
This event is fired when a Connection is about to be detached, for whatever reason. Your callback function is passed the Connection that the user has just detached. Returning false from this interceptor aborts the Connection detach.

<a name="evt-zoom"></a>
##### zoom(value)
Notification the current zoom was changed.

<a name="connectionEvents"></a>
### Connection Events
To bind to an event on a Connection, you also use the `bind` method:

    var connection = jsPlumb.connect({source:"d1", target:"d2"});
    connection.bind("click", function(conn) {
    	console.log("you clicked on ", conn);
    });

These are the Connection events to which you can bind a listener:

- `click(connection, originalEvent)` - notification a Connection was clicked.
                                     
- `dblclick(connection, originalEvent)` - notification a Connection was double-clicked.
                                         
- `contextmenu(connection, originalEvent)` - a right-click on the Connection.
                                            
- `mouseover(connection, originalEvent)` - notification the mouse is over the Connection's path.
                                           
- `mouseout(connection, originalEvent)` - notification the mouse has exited the Connection's path.
                                          
- `mousedown(connection, originalEvent)` - notification the mouse button was pressed on the Connection's path.
                                         
- `mouseup(connection, originalEvent)` - notification the mouse button was released on the Connection's path.

<a name="endpointEvents"></a>
### Endpoint Events
To bind to an event on a Endpoint, you again use the `bind` method:
			
    var endpoint = jsPlumb.addEndpoint("d1", { someOptions } );
    endpoint.bind("click", function(endpoint) {
    	console.log("you clicked on ", endpoint);
    });

These are the Endpoint events to which you can bind a listener:

- `click(endpoint, originalEvent)` - notification an Endpoint was clicked.
           
- `dblclick(endpoint, originalEvent)` - notification an Endpoint was double-clicked.
                                      
- `contextmenu(endpoint, originalEvent)` - a right-click on the Endpoint.
                                        
- `mouseover(endpoint, originalEvent)` - notification the mouse is over the Endpoint.
                                      
- `mouseout(endpoint, originalEvent)` - notification the mouse has exited the Endpoint.
                                      
- `mousedown(endpoint, originalEvent)` - notification the mouse button was pressed on the Endpoint.
                                      
- `mouseup(endpoint, originalEvent)` - notification the mouse button was released on the Endpoint.
                                    
- `maxConnections(info, originalEvent)` - notification the user tried to drop a Connection on an Endpoint that already has the maximum number of Connections.  `info` is an object literal containing these values:
                         
    - **endpoint** : Endpoint on which the Connection was dropped
    - **connection** : The Connection the user tried to drop
    - **maxConnections** : The value of `maxConnections` for the Endpoint
                   
<a name="overlayEvents"></a>
### Overlay Events
Registering event listeners on an Overlay is a slightly different procedure - you provide them as arguments to the Overlay's constructor.  This is because you never actually act on an Overlay object.  
                                                                            
Here's how to register a click listener on an Overlay:
                                                                          
    
    jsPlumb.connect({
        source:"el1",
        target:"el2",
        overlays:[
          [ "Label", {
            events:{
              click:function(labelOverlay, originalEvent) { 
                console.log("click on label overlay for :" + labelOverlay.component); 
              }
            }
          }],
          [ "Diamond", {
            events:{
              dblclick:function(diamondOverlay, originalEvent) { 
                console.log("double click on diamond overlay for : " + diamondOverlay.component); 
              }
            }
          }] 	
        ]
      });

The related component for an Overlay is available to you as the `component` member of the Overlay.
 


<a name="unbindingEvents"></a>
### Unbinding Events
On the jsPlumb object and on Connections and Endpoints, you can use the `unbind` method to remove a listener.  This 
method either takes the name of the event to unbind:

    jsPlumb.unbind("click");

...or no argument, meaning unbind all events:

    var e = jsPlumb.addEndpoint("someDiv");
    e.bind("click", function() { ... });
    e.bind("dblclick", function() { ... });

    ...

    e.unbind("click");

### Utility Functions
- Hide all window5's connections
<pre>
jsPlumb.hide("window5");
</pre>
- Hide all window5's connections endpoints
<pre>
jsPlumb.hide("window5", true);
</pre>
- Show all window5's connections
<pre>
jsPlumb.show("window5");
</pre>
- Show all window5's connections and endpoints.  Note that in the case that you call jsPlumb.show with two arguments, jsPlumb will also not make a connection visible if it determines that the other endpoint in the connection is not visible.
<pre>
jsPlumb.show("window5", hide);
</pre>
- Toggle the visibility of window5's connections
<pre>
jsPlumb.toggleVisible("window5");
</pre>
- Force repaint of all of window5's connections
<pre>
jsPlumb.repaint("window5");
</pre>
- Force repaint of all of window5, window6 and window11's connections
<pre>
jsPlumb.repaint( [ "window5", "window6", "window11" ] );
</pre>
- Force repaint of every connection
<pre>
jsPlumb.repaintEverything();
</pre>
- Delete every connection that the given instance of jsPlumb is managing
<pre>
jsPlumb.deleteEveryConnection();
</pre>
- Delete all connections to/from "window1"
<pre>
jsPlumb.deleteConnectionsForElement("window1");
</pre>
- Remove all Endpoints for the element 'window1', deleting their Connections.
<pre>
jsPlumb.removeAllEndpoints("window1");
</pre>
- Deletes every Endpoint managed by this instance of jsPlumb, deleting all Connections. This is the same as jsPlumb.reset(), effectively, but it does not clear out the event listeners list. 
<pre>
jsPlumb.deleteEveryEndpoint();
</pre>
- Deletes the given Endpoint and all its Connections. 
<pre>
jsPlumb.deleteEndpoint(endpoint);
</pre>
- Removes every endpoint, detaches every connection, and clears the event listeners list.  Returns jsPlumb instance to its initial state.  
<pre>
jsPlumb.reset();
</pre>
- Set window1 to be not draggable, no matter what some jsPlumb command may request.
<pre>
jsPlumb.setDraggable("window1", false);
</pre>
- Set window1 and window2 to be not draggable, no matter what some jsPlumb command may request.
<pre>
jsPlumb.setDraggable(["window1","window2"], false);
</pre>
- Initialises window1 as a draggable element. Passes in an on drag callback				
<pre>
jsPlumb.draggable("window1");
</pre>
- Initialises window1 and window2 as draggable elements
<pre>
jsPlumb.draggable(["window1","window2"]);
</pre>
- Initialises window1 as a draggable element
<pre>
jsPlumb.draggable("window1");
</pre>

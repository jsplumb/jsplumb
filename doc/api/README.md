## jsPlumb API documentation

jsPlumb is organised into several classes and namespaces. The main classes you will deal with are `jsPlumbInstance`, `Endpoint`, `Connection`, `Anchor` and `Overlay`, but only rarely will you deal with these directly.  All objects are constructed by jsPlumb from "definitions" that you provide (see {@link ../docs/basic-concepts}), for instance, and most of the operations you wish to perform on jsPlumb objects are mediated through an instance of the `jsPlumbInstance` class.


#### Static jsPlumb instance

An important point to keep in mind is that the global `jsPlumb` object is just an instance of the `jsPlumbInstance` class that is registered by default on the browser window.  For many people this single static instance is sufficient, but others need more than one instance.

Either way, remember as you read through the API documentation that a reference to a method on the `jsPlumbInstance` class means that `jsPlumb` has that method.  

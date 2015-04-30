### Connection &amp; Endpoint Parameters
jsPlumb has a mechanism that allows you to set/get parameters on a per-connection basis.  These are not parameters that affect the appearance of operation of the object on which they are set; they are a means for you to associate information with jsPlumb objects.  This can be achieved in a few different ways:

- Providing parameters to a `jsPlumb.connect` call
- Providing parameters to a `jsPlumb.addEndpoint` call to/from which a connection is subsequently established using the mouse
- using the `setParameter` or `setParameters` method on a Connection

Getting parameters is achieved through either the `getParameter(key)` or `getParameters` method on a Connection.

#### jsPlumb.connect
Parameters can be passed in via an object literal to a jsPlumb.connect call:

    var myConnection = jsPlumb.connect({
    	source:"foo",
    	target:"bar",
    	parameters:{
    		"p1":34,
    		"p2":new Date(),
    		"p3":function() { console.log("i am p3"); }
    	}
    });

Note that they can be any valid Javascript objects - it's just an object literal.  You then access them like this:

    myConnection.getParameter("p3")();     // prints 'i am p3' to the console.

#### jsPlumb.addEndpoint
The information in this section also applies to the `makeSource` and `makeTarget` functions.

Using `jsPlumb.addEndpoint`, you can set parameters that will be copied in to any Connections that are established from or to the given Endpoint using the mouse.  (If you set parameters on both a source and target Endpoints and then connect them, the parameters set on the target Endpoint are copied in first, followed by those on the source. So the source Endpoint's parameters take precedence if they happen to have one or more with the same keys as those in the target).

Consider this example:

    var e1 = jsPlumb.addEndpoint("d1", {
    	isSource:true,
    	parameters:{
    		"p1":34,
    		"p2":new Date(),
    		"p3":function() { console.log("i am p3"); }
    	}
    });
    
    var e2 = jsPlumb.addEndpoint("d2", {
    	isTarget:true,
    	parameters:{
    		"p5":343,
    		"p3":function() { console.log("FOO FOO FOO"); }
    	}
    });
    
    var conn = jsPlumb.connect({source:e1, target:e2});

'conn' will have four parameters set on it, with the value for "p3" coming from the source Endpoint:

    var params = conn.getParameters();
    console.log(params.p1);   	// 34
    console.log(params.p2);   	// Mon May 14 2012 12:57:12 GMT+1000 (EST) (or however your console prints out a Date)
    console.log((params.p3)()); // "i am p3"  (note: we executed the function after retrieving it)
    console.log(params.p5);   	// 343

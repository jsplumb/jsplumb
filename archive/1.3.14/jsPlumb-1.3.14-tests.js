// _jsPlumb qunit tests.

QUnit.config.reorder = false;

var _getContextNode = function() {
	return $("#container");
};

var assertContextExists = function() {
	ok(_getContextNode().length == 1, "context node exists");
};

var assertContextSize = function(elementCount) {
	//equals(_getContextNode().children().length - _divs.length, elementCount, 'context has ' + elementCount + ' children');
};

var assertContextEmpty = function() {
	equals(_getContextNode().children.length, 0, "context empty");
};

var assertEndpointCount = function(elId, count, _jsPlumb) {
	equals(_jsPlumb.getTestHarness().endpointCount(elId), count, elId + " has " + count + (count > 1) ? "endpoints" : "endpoint");
	equals(_jsPlumb.anchorManager.getEndpointsFor(elId).length, count, "anchor manager has " + count + (count > 1) ? "endpoints" : "endpoint");
};

var assertConnectionCount = function(endpoint, count) {
	equals(endpoint.connections.length, count, "endpoint has " + count + " connections");
};

var assertConnectionByScopeCount = function(scope, count, _jsPlumb) {
	equals(_jsPlumb.getTestHarness().connectionCount(scope), count, 'Scope ' + scope + " has " + count + (count > 1) ? "connections" : "connection");

};

var _divs = [];
var _addDiv = function(id, parent) {
	var d1 = document.createElement("div");
	if (parent) parent.append(d1); else _getContextNode().append(d1);
	d1 = jsPlumb.CurrentLibrary.getElementObject(d1);
	jsPlumb.CurrentLibrary.setAttribute(d1, "id", id);
	_divs.push(id);
	return d1;
};

var defaults = null,
	_cleanup = function(_jsPlumb) {	
	
	_jsPlumb.reset();
	_jsPlumb.Defaults = defaults;
	
	for (var i in _divs) {
		$("#" + _divs[i]).remove();		
	}	
	_divs.splice(0, _divs.length - 1);

	$("#container").empty();
};

var testSuite = function(renderMode, _jsPlumb) {
	

	module("jsPlumb", {
		teardown: function() { 
			_cleanup(_jsPlumb); 
		},
		setup:function() {
			defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
		}
	});
	
	// setup the container
	var container = document.createElement("div");
	container.id = "container";
	document.body.appendChild(container);

	var jpcl = jsPlumb.CurrentLibrary;

	_jsPlumb.setRenderMode(renderMode);

	test(renderMode + " : getElementObject", function() {
		var e = document.createElement("div");
		e.id = "FOO";
		document.body.appendChild(e);
		var el = jpcl.getElementObject(e);
		equals(jpcl.getAttribute(el, "id"), "FOO");
	});

	test(renderMode + " : getDOMElement", function() {
		var e = document.createElement("div");
		e.id = "FOO";
		document.body.appendChild(e);
		var el = jpcl.getElementObject(e);
		var e2 = jpcl.getDOMElement(el);
		equals(e2.id, "FOO");
	});
	
	test(renderMode + ': _jsPlumb setup', function() {
		ok(_jsPlumb, "loaded");
	});
	
	test(renderMode + ': getId', function() {
		var d10 = _addDiv('d10');
		equals(_jsPlumb.getTestHarness().getId(d10), "d10");
	});
	
	test(renderMode + ': create a simple endpoint', function() {
		var d1 = _addDiv("d1");
		var e = _jsPlumb.addEndpoint($("#d1"), {});
		ok(e, 'endpoint exists');  
		assertEndpointCount("d1", 1, _jsPlumb);
		ok(e.id != null, "endpoint has had an id assigned");
	});
	
	test(renderMode + ': create and remove a simple endpoint', function() {
		var d1 = _addDiv("d1");
		var ee = _jsPlumb.addEndpoint(d1, {uuid:"78978597593"});
		ok(ee != null, "endpoint exists");
		var e = _jsPlumb.getEndpoint("78978597593");
		ok(e != null, "the endpoint could be retrieved by UUID");
		ok(e.id != null, "the endpoint has had an id assigned to it");
		assertEndpointCount("d1", 1, _jsPlumb);
		assertContextSize(1); // one Endpoint canvas.
		_jsPlumb.removeEndpoint(d1, ee);	 
		assertEndpointCount("d1", 0, _jsPlumb);
		e = _jsPlumb.getEndpoint("78978597593");
		equals(e, null, "the endpoint has been deleted");
		assertContextSize(0); // no Endpoint canvases.
	});
	
	test(renderMode + ': create two simple endpoints, registered using a selector', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		d1.addClass("window");d2.addClass("window");
		var endpoints = _jsPlumb.addEndpoint($(".window"), {});
		equals(endpoints.length, 2, "endpoint added to both windows");  
		assertEndpointCount("d1", 1, _jsPlumb);
		assertEndpointCount("d2", 1, _jsPlumb);
	});
	
	test(renderMode + ': create two simple endpoints, registered using an array of element ids', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		d1.addClass("window");d2.addClass("window");
		var endpoints = _jsPlumb.addEndpoint(["d1", "d2"], {});
		equals(endpoints.length, 2, "endpoint added to both windows");  
		assertEndpointCount("d1", 1, _jsPlumb);
		assertEndpointCount("d2", 1, _jsPlumb);
	});
	
	test(renderMode + ': draggable silently ignored when jquery ui not present', function() {
		var d1 = _addDiv("d1");
		var e = _jsPlumb.addEndpoint(d1, {isSource:true});
		ok(e, 'endpoint exists');
	});
	
	test(renderMode + ': droppable silently ignored when jquery ui not present', function() {
		var d1 = _addDiv("d1")
		var e = _jsPlumb.addEndpoint(d1, {isTarget:true});
		ok(e, 'endpoint exists');
	});
	
	test(renderMode + ': draggable in nested element does not cause extra ids to be created', function() {
	  var d = _addDiv("d1");
	  var d2 = document.createElement("div");
	  d2.setAttribute("foo", "ff");
	  d.append(d2);
	  var d3 = document.createElement("div");
	  d2.appendChild(d3);
	  ok(d2.getAttribute("id") == null, "no id on d2");
	  _jsPlumb.draggable(d);
	  _jsPlumb.addEndpoint(d3);
	  ok(d2.getAttribute("id") == null, "no id on d2");
	  ok(d3.getAttribute("id") != null, "id on d3");
	});
	
	test(renderMode + ': defaultEndpointMaxConnections', function() {
		var d3 = _addDiv("d3"), d4 = _addDiv("d4");
		var e3 = _jsPlumb.addEndpoint(d3, {isSource:true});
		ok(e3.anchor, 'endpoint 3 has an anchor');
		var e4 = _jsPlumb.addEndpoint(d4, {isSource:true});
		assertEndpointCount("d3", 1, _jsPlumb);
		assertEndpointCount("d4", 1, _jsPlumb);
		assertContextSize(2);						// one canvas for each of our two endpoints.
		ok(!e3.isFull(), "endpoint 3 is not full.");
		_jsPlumb.connect({source:d3, target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
		assertConnectionCount(e3, 1);   // we have one connection
		_jsPlumb.connect({source:d3, target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
		assertConnectionCount(e3, 1);  // should have refused the connection; default max is 1.
		assertContextSize(3); // now we have one more canvas, for the Connection that was accepted.
	});
	
	test(renderMode + ': specifiedEndpointMaxConnections', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var e5 = _jsPlumb.addEndpoint(d5, {isSource:true, maxConnections:3});
		ok(e5.anchor, 'endpoint 5 has an anchor');
		var e6 = _jsPlumb.addEndpoint(d6, {isSource:true, maxConnections:2});  // this one has max TWO
		assertEndpointCount("d5", 1, _jsPlumb); assertEndpointCount("d6", 1, _jsPlumb);
		assertContextSize(2);
		ok(!e5.isFull(), "endpoint 5 is not full.");
		_jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
		assertConnectionCount(e5, 1);   // we have one connection
		assertContextSize(3);
		_jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
		assertConnectionCount(e5, 2);  // two connections
		assertContextSize(4);
		_jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
		assertConnectionCount(e5, 2);  // should have refused; max is 2, for d4.
		assertContextSize(4);
	});
	
	test(renderMode + ': noEndpointMaxConnections', function() {
		var d3 = _addDiv("d3"), d4 = _addDiv("d4");
		var e3 = _jsPlumb.addEndpoint(d3, {isSource:true, maxConnections:-1});
		var e4 = _jsPlumb.addEndpoint(d4, {isSource:true, maxConnections:-1});
		_jsPlumb.connect({sourceEndpoint:e3, targetEndpoint:e4});
		assertContextSize(3);
		assertConnectionCount(e3, 1);   // we have one connection
		_jsPlumb.connect({sourceEndpoint:e3, targetEndpoint:e4});
		assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).
		assertContextSize(4);
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var e5 = _jsPlumb.addEndpoint(d3, {isSource:true, maxConnections:-1});
		_jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e4});
		assertConnectionCount(e4, 3);
		assertContextSize(6);
	});
	
	test(renderMode + ': anchors equal', function() {
		var a1 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
		var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
		ok(a1.equals(a2), "anchors are the same");
	});
	
	test(renderMode + ': anchors equal with offsets', function() {
		var a1 = _jsPlumb.makeAnchor([0, 1, 1, 1, 10, 13], null, _jsPlumb);
		var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1, 10, 13], null, _jsPlumb);
		ok(a1.equals(a2), "anchors are the same");
	});
	
	test(renderMode + ': anchors not equal', function() {
		var a1 = _jsPlumb.makeAnchor([0, 1, 0, 1], null, _jsPlumb);
		var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
		ok(!a1.equals(a2), "anchors are different");
	});
	
	test(renderMode + ': anchor not equal with offsets', function() {
		var a1 = _jsPlumb.makeAnchor([0, 1, 1, 1, 10, 13], null, _jsPlumb);
		var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
		ok(!a1.equals(a2), "anchors are different");
	});
	
	test(renderMode + ': detach does not fail when no arguments are provided', function() {
		var d3 = _addDiv("d3"), d4 = _addDiv("d4");
		_jsPlumb.connect({source:d3, target:d4});
		_jsPlumb.detach();	
	});

    // test that detach does not fire an event by default
	test(renderMode + ': _jsPlumb.detach should fire detach event by default', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var conn = _jsPlumb.connect({source:d5, target:d6});
		var eventCount = 0;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
		_jsPlumb.detach(conn);
		equals(eventCount, 1);
	});

    // test that detach does not fire an event by default
	test(renderMode + ': _jsPlumb.detach should fire detach event by default, using params object', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var conn = _jsPlumb.connect({source:d5, target:d6});
		var eventCount = 0;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
		_jsPlumb.detach({connection:conn});
		equals(eventCount, 1);
	});

    // test that detach fires an event when instructed to do so
	test(renderMode + ': _jsPlumb.detach should not fire detach event when instructed to not do so', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var conn = _jsPlumb.connect({source:d5, target:d6});
		var eventCount = 0;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
		_jsPlumb.detach(conn, {fireEvent:false});
		equals(eventCount, 0);
	});
	
	// issue 81
	test(renderMode + ': _jsPlumb.detach should fire only one detach event (pass Connection as argument)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var conn = _jsPlumb.connect({source:d5, target:d6});
		var eventCount = 0;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
		_jsPlumb.detach(conn);
		equals(eventCount, 1);
	});
	
	// issue 81
	test(renderMode + ': _jsPlumb.detach should fire only one detach event (pass Connection as param in argument)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var conn = _jsPlumb.connect({source:d5, target:d6});
		var eventCount = 0;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
		_jsPlumb.detach({connection:conn});
		equals(eventCount, 1);
	});
	
	// issue 81
	test(renderMode + ': detach should fire only one detach event (pass source and targets as strings as arguments in params object)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var conn = _jsPlumb.connect({source:d5, target:d6});
		var eventCount = 0;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
		_jsPlumb.detach({source:"d5", target:"d6"});
		equals(eventCount, 1);
	});
	
	// issue 81
	test(renderMode + ': detach should fire only one detach event (pass source and targets as divs as arguments in params object)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		var conn = _jsPlumb.connect({source:d5, target:d6});
		var eventCount = 0;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
		_jsPlumb.detach({source:d5, target:d6, fireEvent:true});
		equals(eventCount, 1);
	});
	
	//TODO make sure you run this test with a single detach call, to ensure that
	// single detach calls result in the connection being removed. detachEveryConnection can
	// just blow away the connectionsByScope array and recreate it.
	test(renderMode + ': getConnections (simple case, default scope)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		_jsPlumb.connect({source:d5, target:d6});
		assertContextSize(3);
		var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
		equals(c.length, 1, "there is one connection");
	});
	
	test(renderMode + ': getConnections (simple case, default scope; detach by element id using params object)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
		_jsPlumb.connect({source:d5, target:d6});
		_jsPlumb.connect({source:d6, target:d7});
		assertContextSize(6);
		var c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 2, "there are two connections initially");
		_jsPlumb.detach({source:'d5', target:'d6'});
		c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 1, "after detaching one, there is now one connection.");
		assertContextSize(5);
	});

    test(renderMode + ': getConnections (simple case, default scope; detach by id using params object)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
		_jsPlumb.connect({source:d5, target:d6});
		_jsPlumb.connect({source:d6, target:d7});
		assertContextSize(6);
		var c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 2, "there are two connections initially");
		_jsPlumb.detach({source:"d5", target:"d6"});
		c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 1, "after detaching one, there is now one connection.");
		assertContextSize(5);
	});

	test(renderMode + ': getConnections (simple case, default scope; detach by element object using params object)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
		_jsPlumb.connect({source:d5, target:d6});
		_jsPlumb.connect({source:d6, target:d7});
		assertContextSize(6);
		var c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 2, "there are two connections initially");
		_jsPlumb.detach({source:d5, target:d6});
		c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 1, "after detaching one, there is now one connection.");
		assertContextSize(5);
	});
	
	test(renderMode + ': getConnections (simple case, default scope; detach by Connection)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
		var c56 = _jsPlumb.connect({source:d5, target:d6});
		var c67 = _jsPlumb.connect({source:d6, target:d7});
		assertContextSize(6);
		var c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 2, "there are two connections initially");
		_jsPlumb.detach(c56);
		assertContextSize(5);		// check that the connection canvas was removed.
		c = _jsPlumb.getConnections();  // will get all connections
		equals(c.length, 1, "after detaching one, there is now one connection.");		
	});

// beforeDetach functionality
	
	test(renderMode + ": detach; beforeDetach on connect call returns false", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1, target:d2, beforeDetach:function(conn) { return false; }});
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
	});
	
	test(renderMode + ": detach; beforeDetach on connect call returns true", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1, target:d2, beforeDetach:function(conn) { return true; }});
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[0].connections.length, 0, "source endpoint has no connections after detach call was allowed");
	});

	test(renderMode + ": detach; beforeDetach on connect call throws an exception; we treat it with the contempt it deserves and pretend it said the detach was ok.", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1, target:d2, beforeDetach:function(conn) { throw "i am an example of badly coded beforeDetach, but i don't break jsPlumb "; }});
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[0].connections.length, 0, "source endpoint has no connections after detach call was allowed");
	});
	
	test(renderMode + ": detach; beforeDetach on addEndpoint call to source Endpoint returns false", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true, beforeDetach:function(conn) { return false; } }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
	});
	
	test(renderMode + ": detach; beforeDetach on addEndpoint call to source Endpoint returns true", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true, beforeDetach:function(conn) { return true; } }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[0].connections.length, 0, "source endpoint has no connections after detach call was allowed");
	});
	

	test(renderMode + ": Endpoint.detach; beforeDetach on addEndpoint call to source Endpoint returns false; Endpoint.detach returns false too (the UI needs it to)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true, beforeDetach:function(conn) { return false; } }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
		var success = e1.detach(c);
		equals(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
		ok(!success, "Endpoint reported detach did not execute");
	});

	test(renderMode + ": _jsPlumb.detach; beforeDetach on addEndpoint call to target Endpoint returns false", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true, beforeDetach:function(conn) { return false; } });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection after detach call was denied");
	});

    test(renderMode + ": _jsPlumb.detach; beforeDetach on addEndpoint call to target Endpoint returns false but detach is forced", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true, beforeDetach:function(conn) { return false; } });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		_jsPlumb.detach(c, {forceDetach:true});
        equals(c.endpoints[0].connections.length, 0, "source endpoint has no connections after detach call was denied but forced anyway");
		equals(c.endpoints[1].connections.length, 0, "target endpoint has no connections after detach call was denied but forced anyway");
	});
	
	test(renderMode + ": _jsPlumb.detach; beforeDetach on addEndpoint call to target Endpoint returns true", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true, beforeDetach:function(conn) { return true; } });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[1].connections.length, 0, "target endpoint has no connections after detach call was allowed");
	});
	
	test(renderMode + ": _jsPlumb.detach; beforeDetach bound to _jsPlumb returns false", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true });
		var c = _jsPlumb.connect({source:e1,target:e2});
		_jsPlumb.bind("beforeDetach", function(connection) {
			ok(connection.sourceId === "d1", "connection is provided and configured with correct source");
			ok(connection.targetId === "d2", "connection is provided and configured with correct target");
			return false;
		});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection after detach call was denied");
	});
	
	test(renderMode + ": _jsPlumb.detach; beforeDetach bound to _jsPlumb returns true", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true });
		var c = _jsPlumb.connect({source:e1,target:e2});
		_jsPlumb.bind("beforeDetach", function(connection) {
			ok(connection.sourceId === "d1", "connection is provided and configured with correct source");
			ok(connection.targetId === "d2", "connection is provided and configured with correct target");
			return true;
		});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		_jsPlumb.detach(c);
		equals(c.endpoints[1].connections.length, 0, "target endpoint has no connections after detach call was denied");
	});
	
	test(renderMode + ": _jsPlumb.detachAllConnections ; beforeDetach on addEndpoint call to target Endpoint returns false but we should detach anyway", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true, beforeDetach:function(conn) { return false; } });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		_jsPlumb.detachAllConnections(d1);
		equals(c.endpoints[1].connections.length, 0, "target endpoint has no connections after detachAll was called");
	});

	test(renderMode + ": _jsPlumb.detachEveryConnection ; beforeDetach on addEndpoint call to target Endpoint returns false but we should detach anyway", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true, beforeDetach:function(conn) { return false; } });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		_jsPlumb.detachEveryConnection();
		equals(c.endpoints[1].connections.length, 0, "target endpoint has no connections after detachEveryConnection was called");
	});

	test(renderMode + ": Endpoint.detachAll ; beforeDetach on addEndpoint call to target Endpoint returns false but we should detach anyway", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, { isSource:true }),
		e2 = _jsPlumb.addEndpoint(d2, { isTarget:true, beforeDetach:function(conn) { return false; } });
		var c = _jsPlumb.connect({source:e1,target:e2});
		equals(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
		e1.detachAll();
		equals(c.endpoints[1].connections.length, 0, "target endpoint has no connections after detachAllConnections was called");
	});
	
// ******** end of beforeDetach tests **************

// detachEveryConnection/detachAllConnections fireEvent overrides tests

    test(renderMode + ": _jsPlumb.detachEveryConnection fires events", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0;
        _jsPlumb.bind("jsPlumbConnection", function() { connCount++; });
        _jsPlumb.bind("jsPlumbConnectionDetached", function() { connCount--; });
        _jsPlumb.connect({source:d1, target:d2});
        _jsPlumb.connect({source:d1, target:d2});
        equals(connCount, 2, "two connections registered");
        _jsPlumb.detachEveryConnection();
        equals(connCount, 0, "no connections registered");
    });

    test(renderMode + ": _jsPlumb.detachEveryConnection doesn't fire events when instructed not to", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0;
        _jsPlumb.bind("jsPlumbConnection", function() { connCount++; });
        _jsPlumb.bind("jsPlumbConnectionDetached", function() { connCount--; });
        _jsPlumb.connect({source:d1, target:d2});
        _jsPlumb.connect({source:d1, target:d2});
        equals(connCount, 2, "two connections registered");
        _jsPlumb.detachEveryConnection({fireEvent:false});
        equals(connCount, 2, "two connections registered");
    });

     test(renderMode + ": _jsPlumb.detachAllConnections fires events", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0,
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.bind("jsPlumbConnection", function() { connCount++; });
        _jsPlumb.bind("jsPlumbConnectionDetached", function() { connCount--; });
        _jsPlumb.connect({source:d1, target:d2});
        _jsPlumb.connect({source:d1, target:d2});
        equals(connCount, 2, "two connections registered");
        _jsPlumb.detachAllConnections("d1");
        equals(connCount, 0, "no connections registered");
    });

    test(renderMode + ": _jsPlumb.detachAllConnections doesn't fire events when instructed not to", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0,
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.bind("jsPlumbConnection", function() { connCount++; });
        _jsPlumb.bind("jsPlumbConnectionDetached", function() { connCount--; });
        _jsPlumb.connect({source:d1, target:d2});
        _jsPlumb.connect({source:d1, target:d2});
        equals(connCount, 2, "two connections registered");
        _jsPlumb.detachAllConnections("d1", {fireEvent:false});
        equals(connCount, 2, "two connections registered");
    });
	
	test(renderMode + ': getConnections (scope testScope)', function() {
		var d5 = _addDiv("d5"), d6 = _addDiv("d6");
		_jsPlumb.connect({source:d5, target:d6, scope:'testScope'});
		var c = _jsPlumb.getConnections("testScope");  // will get all connections in testScope	
		equals(c.length, 1, "there is one connection");
		equals(c[0].sourceId, 'd5', "the connection's source is d5");
		equals(c[0].targetId, 'd6', "the connection's source is d6");
		c = _jsPlumb.getConnections();  // will get all connections in default scope; should be none.
		equals(c.length, 0, "there are no connections in the default scope");
	});
	
	test(renderMode + ': _jsPlumb.getAllConnections (filtered by scope)', function() {
		var d8 = _addDiv("d8"), d9 = _addDiv("d9"), d10 = _addDiv('d10');
		_jsPlumb.connect({source:d8, target:d9, scope:'testScope'});
		_jsPlumb.connect({source:d9, target:d10}); // default scope
		var c = _jsPlumb.getAllConnections();  // will get all connections	
		equals(c[_jsPlumb.getDefaultScope()].length, 1);
		equals(c['testScope'].length, 1);	
		// now supply a list of scopes
		c = _jsPlumb.getConnections();  	
		equals(c.length, 1);
		c = _jsPlumb.getConnections("testScope");
		equals(c.length, 1, "there is one connection in 'testScope'");
	});
	
	test(renderMode + ': _jsPlumb.getConnections (filtered by scope and sourceId)', function() {
		var d8 = _addDiv("d8"), d9 = _addDiv("d9"), d10 = _addDiv('d10');
		_jsPlumb.connect({source:d8, target:d9, scope:'testScope'});
		_jsPlumb.connect({source:d9, target:d8, scope:'testScope'});
		_jsPlumb.connect({source:d9, target:d10}); // default scope
		var c = _jsPlumb.getConnections({scope:'testScope', source:'d8'});  // will get all connections with sourceId 'd8'	
		equals(c.length, 1, "there is one connection in 'testScope' from d8");	
	});
	
	test(renderMode + ': _jsPlumb.getConnections (filtered by scope, source id and target id)', function() {
		var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
		_jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
		_jsPlumb.connect({source:d12, target:d13, scope:'testScope'});
		_jsPlumb.connect({source:d11, target:d13, scope:'testScope'});
		var c = _jsPlumb.getConnections({scope:'testScope', source:'d11', target:'d13'});  
		equals(c.length, 1, "there is one connection from d11 to d13");	
	});
	
	test(renderMode + ': _jsPlumb.getConnections (filtered by a list of scopes)', function() {
		var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
		_jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
		_jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
		_jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
		var c = _jsPlumb.getConnections({scope:['testScope','testScope3']});  
		equals(c['testScope'].length, 1, 'there is one connection in testScope');
		equals(c['testScope3'].length, 1, 'there is one connection in testScope3');
		equals(c['testScope2'], null, 'there are no connections in testScope2');
	});
	
	test(renderMode + ': _jsPlumb.getConnections (filtered by a list of scopes and source ids)', function() {
		var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
		_jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
		_jsPlumb.connect({source:d13, target:d12, scope:'testScope'});
		_jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
		_jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
		var c = _jsPlumb.getConnections({scope:['testScope','testScope3'], source:['d11']});  
		equals(c['testScope'].length, 1, 'there is one connection in testScope');
		equals(c['testScope3'].length, 1, 'there is one connection in testScope3');
		equals(c['testScope2'], null, 'there are no connections in testScope2');
	});
	
	test(renderMode + ': _jsPlumb.getConnections (filtered by a list of scopes, source ids and target ids)', function() {
		_jsPlumb.detachEveryConnection();
		var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13'), d14=_addDiv("d14"), d15=_addDiv("d15");
		_jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
		_jsPlumb.connect({source:d13, target:d12, scope:'testScope'});
		_jsPlumb.connect({source:d11, target:d14, scope:'testScope'});
		_jsPlumb.connect({source:d11, target:d15, scope:'testScope'});
		_jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
		_jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
		assertContextSize(18);
		var c = _jsPlumb.getConnections({scope:['testScope','testScope3'], source:['d11'], target:['d14', 'd15']});  
		equals(c['testScope'].length, 2, 'there are two connections in testScope');
		equals(c['testScope3'], null, 'there are no connections in testScope3');
		equals(c['testScope2'], null, 'there are no connections in testScope2');
		var anEntry = c['testScope'][0];
		ok(anEntry.endpoints[0] != null, "Source endpoint is set");
		ok(anEntry.endpoints[1] != null, "Target endpoint is set");
		equals(anEntry.source.attr("id"), "d11", "Source is div d11");
		equals(anEntry.target.attr("id"), "d14", "Target is div d14");
	});
	
	test(renderMode + ': getEndpoints, one Endpoint added by addEndpoint, get Endpoints by selector', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		_jsPlumb.addEndpoint(d1);
		var e = _jsPlumb.getEndpoints(d1);
		equals(e.length, 1, "there is one endpoint for element d1");
	});
	
	test(renderMode + ': getEndpoints, one Endpoint added by addEndpoint, get Endpoints by id', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		_jsPlumb.addEndpoint(d1);
		var e = _jsPlumb.getEndpoints("d1");
		equals(e.length, 1, "there is one endpoint for element d1");
	});
	
	test(renderMode + ': connection event listeners', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var returnedParams = null/*, returnedParams2 = null*/;
		_jsPlumb.bind("jsPlumbConnection", function(params) {
				returnedParams = $.extend({}, params);
		});
		var c = _jsPlumb.connect({source:d1, target:d2});
		ok(returnedParams != null, "new connection listener event was fired");
		ok(returnedParams.connection != null, 'connection is set');
		equals(returnedParams.sourceId, "d1", 'sourceid is set');
		equals(returnedParams.targetId, "d2", 'targetid is set');
		equals(returnedParams.source.attr("id"), "d1", 'source is set');
		equals(returnedParams.target.attr("id"), "d2" , 'target is set');
		ok(returnedParams.sourceEndpoint != null, "source endpoint is not null");
		ok(returnedParams.targetEndpoint != null, "target endpoint is not null");
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
		});
		_jsPlumb.detach(c);
		ok(returnedParams.connection != null, 'connection is set');		
	});
	
	test(renderMode + ': detach event listeners (detach by connection)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
		});
		var conn = _jsPlumb.connect({source:d1, target:d2});
		_jsPlumb.detach(conn);
		ok(returnedParams != null, "removed connection listener event was fired");
		ok(returnedParams.connection != null, "removed connection listener event passed in connection");
	});
	
	test(renderMode + ': detach event listeners (detach by element ids)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
		});
		var conn = _jsPlumb.connect({source:d1, target:d2});
		_jsPlumb.detach({source:"d1",target:"d2"});
		ok(returnedParams != null, "removed connection listener event was fired");
	});
	
	test(renderMode + ': detach event listeners (detach by elements)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
			});
		var conn = _jsPlumb.connect({source:d1, target:d2});
		_jsPlumb.detach({source:d1,target:d2});
		ok(returnedParams != null, "removed connection listener event was fired");
	});
	
	test(renderMode + ': detach event listeners (via Endpoint.detach method)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, {});
		var e2 = _jsPlumb.addEndpoint(d2, {});
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
			});
		var conn = _jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
		assertContextSize(3);
		e1.detach(conn);
		ok(returnedParams != null, "removed connection listener event was fired");
		assertContextSize(2);
	});
	
	test(renderMode + ': detach event listeners (via Endpoint.detachFrom method)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, {});
		var e2 = _jsPlumb.addEndpoint(d2, {});
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
			});
		_jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
		assertContextSize(3);
		e1.detachFrom(e2);
		ok(returnedParams != null, "removed connection listener event was fired");
		assertContextSize(2);
	});
	
	test(renderMode + ': detach event listeners (via Endpoint.detachAll method)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, {});
		var e2 = _jsPlumb.addEndpoint(d2, {});
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
			});
		_jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
		assertContextSize(3);
		e1.detachAll();
		ok(returnedParams != null, "removed connection listener event was fired");
		assertContextSize(2);
	});
	
	test(renderMode + ': detach event listeners (via _jsPlumb.deleteEndpoint method)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, {});
		var e2 = _jsPlumb.addEndpoint(d2, {});
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
			});
		_jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
		assertContextSize(3);
		_jsPlumb.deleteEndpoint(e1);
		ok(returnedParams != null, "removed connection listener event was fired");
		assertContextSize(1);
	});
	
	test(renderMode + ': detach event listeners (ensure cleared by _jsPlumb.reset)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var returnedParams = null;
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				returnedParams = $.extend({}, params);
			});
		var conn = _jsPlumb.connect({source:d1, target:d2});
		_jsPlumb.detach({source:d1,target:d2, fireEvent:true});
		ok(returnedParams != null, "removed connection listener event was fired");
		returnedParams = null;
		
		_jsPlumb.reset();
		var conn = _jsPlumb.connect({source:d1, target:d2});
		_jsPlumb.detach(d1,d2);
		ok(returnedParams == null, "connection listener was cleared by _jsPlumb.reset()");
	});
	
	test(renderMode + ': connection events that throw errors', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var returnedParams = null, returnedParams2 = null;
		_jsPlumb.bind("jsPlumbConnection", function(params) {
				returnedParams = $.extend({}, params);
				throw "oh no!";
			});
		_jsPlumb.connect({source:d1, target:d2});
		var d3 = _addDiv("d3"), d4 = _addDiv("d4");
		_jsPlumb.connect({source:d3, target:d4});
		ok(returnedParams != null, "new connection listener event was fired; we threw an error, _jsPlumb survived.");
	});

	test(renderMode + ': unbinding connection event listeners, connection', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var count = 0;
		_jsPlumb.bind("jsPlumbConnection", function(params) {
			count++;
		});
		var c = _jsPlumb.connect({source:d1, target:d2});
		ok(count == 1, "received one event");
		_jsPlumb.unbind("jsPlumbConnection");
		var c2 = _jsPlumb.connect({source:d1, target:d2});
		ok(count == 1, "still received only one event");
		
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			count--;
		});
		_jsPlumb.detach(c);
		ok(count == 0, "count of events is now zero");		
	});

	test(renderMode + ': unbinding connection event listeners, detach', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var count = 0;
		_jsPlumb.bind("jsPlumbConnection", function(params) {
			count++;
		});
		var c = _jsPlumb.connect({source:d1, target:d2});
		ok(count == 1, "received one event");		
		var c2 = _jsPlumb.connect({source:d1, target:d2});
		ok(count == 2, "received two events");
		
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			count--;
		});
		_jsPlumb.detach(c);
		ok(count == 1, "count of events is now one");		
		_jsPlumb.unbind("jsPlumbConnectionDetached");
		_jsPlumb.detach(c2);
		ok(count == 1, "count of events is still one");		
	});

	test(renderMode + ': unbinding connection event listeners, all listeners', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var count = 0;
		_jsPlumb.bind("jsPlumbConnection", function(params) {
			count++;
		});
		var c = _jsPlumb.connect({source:d1, target:d2}),
			c2 = _jsPlumb.connect({source:d1, target:d2}),
			c3 = _jsPlumb.connect({source:d1, target:d2});

		ok(count == 3, "received three events");					
		
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			count--;
		});
		_jsPlumb.detach(c);
		ok(count == 2, "count of events is now two");	
			
		_jsPlumb.unbind();  // unbind everything

		_jsPlumb.detach(c2);
		_jsPlumb.detach(c3);
		_jsPlumb.connect({source:d1, target:d2})
		_jsPlumb.connect({source:d1, target:d2})
		_jsPlumb.connect({source:d1, target:d2})
		_jsPlumb.connect({source:d1, target:d2})

		ok(count == 2, "count of events is still two");		
	});
	
	test(renderMode + ": Endpoint.detachFrom", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var conn = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertConnectionCount(e16, 1);
		assertConnectionCount(e17, 1);
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		e16.detachFrom(e17);	
		assertContextSize(2);				// the endpoint canvases should remain
		// but the connection should be gone, meaning not registered by _jsPlumb and not registered on either Endpoint:
		assertConnectionCount(e16, 0);
		assertConnectionCount(e17, 0);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);  
	});
	
	test(renderMode + ": Endpoint.detachFromConnection", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var conn = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertConnectionCount(e16, 1);
		assertConnectionCount(e17, 1);
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		e16.detachFromConnection(conn);	
		assertContextSize(3);				// all canvases should remain; the connection was not removed.
		// but endpoint e16 should have no connections now.
		assertConnectionCount(e16, 0);
		assertConnectionCount(e17, 1);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);  
	});
	
	test(renderMode + ": Endpoint.detachAll", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18");
		var e16 = _jsPlumb.addEndpoint($("#d16"), {isSource:true,maxConnections:-1});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint($("#d17"), {isSource:true});
		var e18 = _jsPlumb.addEndpoint($("#d18"), {isSource:true});
		_jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		_jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e18});
		assertConnectionCount(e16, 2);
		assertConnectionCount(e17, 1);
		assertConnectionCount(e18, 1);
		assertContextSize(5);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 2, _jsPlumb);  
		e16.detachAll();
		assertConnectionCount(e16, 0);
		assertConnectionCount(e17, 0);
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
	});
	
	test(renderMode + ": Endpoint.detach", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var conn = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertConnectionCount(e16, 1);
		assertConnectionCount(e17, 1);
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		e16.detach(conn);	
		assertContextSize(2);				// the endpoint canvases should remain
		// but the connection should be gone, meaning not registered by _jsPlumb and not registered on either Endpoint:
		assertConnectionCount(e16, 0);
		assertConnectionCount(e17, 0);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);  
	});
	
	test(renderMode + ": Endpoint.isConnectedTo", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var conn = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		equals(e16.isConnectedTo(e17), true, "e16 and e17 are connected");  
	});

	asyncTest(renderMode + "jsPlumbUtil.setImage on Endpoint, with supplied onload", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
        e = {
            endpoint:[ "Image", {
                src:"../img/endpointTest1.png",
                onload:function(imgEp) {                	
                	_jsPlumb.repaint("d1");
                    ok(imgEp.img.src.indexOf("endpointTest1.png") != -1, "image source is correct");                                        
                    ok(imgEp.img.src.indexOf("endpointTest1.png") != -1, "image elementsource is correct");                                        
                    
                    imgEp.canvas.setAttribute("id", "iwilllookforthis");
                    
                    _jsPlumb.removeAllEndpoints("d1");
                    ok(document.getElementById("iwilllookforthis") == null, "image element was removed after remove endpoint");
                }
            } ]
        };
        start();
        _jsPlumb.addEndpoint(d1, e);
    });
	
	test(renderMode + ": setting endpoint uuid", function() {
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		equals(e16.getUuid(), uuid, "endpoint's uuid was set correctly");
	});
	
	test(renderMode + ": _jsPlumb.getEndpoint (by uuid)", function() {
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		var e = _jsPlumb.getEndpoint(uuid);
		equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
	});
	
	test(renderMode + ": _jsPlumb.deleteEndpoint (by uuid, simple case)", function() {
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		var e = _jsPlumb.getEndpoint(uuid);
		equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
		_jsPlumb.deleteEndpoint(uuid);
		var f = _jsPlumb.getEndpoint(uuid);
		equals(f, null, "endpoint has been deleted");
		var ebe = _jsPlumb.getTestHarness().endpointsByElement["d16"];
		equals(ebe.length, 0, "no endpoints registered for element d16 anymore");
		assertContextSize(0);
	});
	
	test(renderMode + ": _jsPlumb.deleteEndpoint (by uuid, connections too)", function() {
		// create two endpoints (one with a uuid), add them to two divs and then connect them.
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
		_jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		// check that the connection was ok.
		equals(e16.connections.length, 1, "e16 has one connection");
		equals(e17.connections.length, 1, "e17 has one connection");
		assertContextSize(3);
		
		// delete the endpoint that has a uuid.  verify that the endpoint cannot be retrieved and that the connection has been removed, but that
		// element d17 still has its Endpoint.
		_jsPlumb.deleteEndpoint(uuid);
		var f = _jsPlumb.getEndpoint(uuid);
		equals(f, null, "endpoint has been deleted");
		equals(e16.connections.length, 0, "e16 has no connections");
		equals(e17.connections.length, 0, "e17 has no connections");
		var ebe = _jsPlumb.getTestHarness().endpointsByElement["d16"];
		equals(ebe.length, 0, "no endpoints registered for element d16 anymore");
		ebe = _jsPlumb.getTestHarness().endpointsByElement["d17"];
		equals(ebe.length, 1, "element d17 still has its Endpoint");
		assertContextSize(1);
		
		// now delete d17's endpoint and check that it has gone.
		_jsPlumb.deleteEndpoint(e17);
		f = _jsPlumb.getEndpoint(e17);
		equals(f, null, "endpoint has been deleted");
		ebe = _jsPlumb.getTestHarness().endpointsByElement["d17"];
		equals(ebe.length, 0, "element d17 no longer has any Endpoints");
		assertContextSize(0);
	});
	
	test(renderMode + ": _jsPlumb.deleteEndpoint (by reference, simple case)", function() {
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		var e = _jsPlumb.getEndpoint(uuid);
		equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
		_jsPlumb.deleteEndpoint(e16);
		var f = _jsPlumb.getEndpoint(uuid);
		equals(f, null, "endpoint has been deleted");
		assertContextSize(0);
	});
	
	test(renderMode + ": _jsPlumb.deleteEndpoint (by reference, connections too)", function() {
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
		_jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		equals(e16.connections.length, 1, "e16 has one connection");
		equals(e17.connections.length, 1, "e17 has one connection");
		assertContextSize(3);
		
		_jsPlumb.deleteEndpoint(e16);
		var f = _jsPlumb.getEndpoint(uuid);
		equals(f, null, "endpoint has been deleted");
		equals(e16.connections.length, 0, "e16 has no connections");
		equals(e17.connections.length, 0, "e17 has no connections");
		assertContextSize(1);
	});
	
	test(renderMode + ": _jsPlumb.deleteEveryEndpoint", function() {
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
		assertContextSize(2);
		var e = _jsPlumb.getEndpoint(uuid);
		equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
		
		_jsPlumb.deleteEveryEndpoint();
		
		var f = _jsPlumb.getEndpoint(uuid);
		equals(f, null, "endpoint e16 has been deleted");
		var g = _jsPlumb.getEndpoint(e17);
		equals(g, null, "endpoint e17 has been deleted");
		assertContextSize(0);
	});
	
	test(renderMode + ": _jsPlumb.deleteEveryEndpoint (connections too)", function() {
		var uuid = "14785937583175927504313";
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
		_jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		assertContextSize(3);
		var e = _jsPlumb.getEndpoint(uuid);
		equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
		
		_jsPlumb.deleteEveryEndpoint();
		
		var f = _jsPlumb.getEndpoint(uuid);
		equals(f, null, "endpoint e16 has been deleted");
		var g = _jsPlumb.getEndpoint(e17);
		equals(g, null, "endpoint e17 has been deleted");
		assertContextSize(0);								// no canvases. so all connection canvases have been cleaned up too.
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
	});
	
	test(renderMode + ": _jsPlumb.addEndpoint (simple case)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {anchor:[0,0.5,0,-1]});
		var e17 = _jsPlumb.addEndpoint(d17, {anchor:"TopCenter"});
		assertContextSize(2);
		equals(e16.anchor.x, 0);
		equals(e16.anchor.y, 0.5);
		equals(e17.anchor.x, 0.5);
		equals(e17.anchor.y, 0);
	});
	
	test(renderMode + ": _jsPlumb.addEndpoint (tooltip)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"), 
			e16 = _jsPlumb.addEndpoint(d16, {tooltip:"FOO"}),
			e17 = _jsPlumb.addEndpoint(d17, {tooltip:"BAZ"});
		assertContextSize(2);
		equals(e16.canvas.getAttribute("title"), "FOO");
		equals(e17.canvas.getAttribute("title"), "BAZ");
	});
	
	test(renderMode + ": _jsPlumb.addEndpoint (simple case, dynamic anchors)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		var e17 = _jsPlumb.addEndpoint(d17, {anchors:["TopCenter", "BottomCenter"]});
		assertContextSize(2);
		equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
		equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
	});
	
	test(renderMode + ": _jsPlumb.addEndpoint (simple case, two arg method)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchor:[0,0.5,0,-1]});
		var e17 = _jsPlumb.addEndpoint(d17, {isTarget:true, isSource:false}, {anchor:"TopCenter"});
		assertContextSize(2);
		equals(e16.anchor.x, 0);
		equals(e16.anchor.y, 0.5);
		equals(false, e16.isTarget);
		equals(true, e16.isSource);
		equals(e17.anchor.x, 0.5);
		equals(e17.anchor.y, 0);
		equals(true, e17.isTarget);
		equals(false, e17.isSource);
	});
	
	
	test(renderMode + ": _jsPlumb.addEndpoints (simple case)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoints(d16, [{isSource:true, isTarget:false, anchor:[0,0.5,0,-1] }, { isTarget:true, isSource:false, anchor:"TopCenter" }]);
		assertContextSize(2);
		equals(e16[0].anchor.x, 0);
		equals(e16[0].anchor.y, 0.5);
		equals(false, e16[0].isTarget);
		equals(true, e16[0].isSource);
		equals(e16[1].anchor.x, 0.5);
		equals(e16[1].anchor.y, 0);
		equals(true, e16[1].isTarget);
		equals(false, e16[1].isSource);
	});
	
	test(renderMode + ": _jsPlumb.addEndpoints (with reference params)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var refParams = {anchor:"RightMiddle"};
		var e16 = _jsPlumb.addEndpoints(d16, [{isSource:true, isTarget:false}, { isTarget:true, isSource:false }], refParams);
		assertContextSize(2);
		equals(e16[0].anchor.x, 1);
		equals(e16[0].anchor.y, 0.5);
		equals(false, e16[0].isTarget);
		equals(true, e16[0].isSource);
		equals(e16[1].anchor.x, 1);
		equals(e16[1].anchor.y, 0.5);
		equals(true, e16[1].isTarget);
		equals(false, e16[1].isSource);
	});
	
	test(renderMode + ": _jsPlumb.addEndpoint (simple case, dynamic anchors, two arg method)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		var e17 = _jsPlumb.addEndpoint(d17, {isTarget:true, isSource:false}, {anchors:["TopCenter", "BottomCenter"]});
		assertContextSize(2);
		equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
		equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
	});

	test(renderMode + ": _jsPlumb.addEndpoints (default overlays)", function() {
		_jsPlumb.Defaults.Overlays = [
			[ "Label", { id:"label" } ]
		];
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e1 = _jsPlumb.addEndpoint(d16),
			e2 = _jsPlumb.addEndpoint(d17);

		ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
	});

	test(renderMode + ": _jsPlumb.addEndpoints (default overlays)", function() {
		_jsPlumb.Defaults.Overlays = [
			[ "Label", { id:"label" } ]
		];
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e1 = _jsPlumb.addEndpoint(d16, {
				overlays:[
					["Label", { id:"label2", location:[ 0.5, 1 ] } ]
				]
			}),
			e2 = _jsPlumb.addEndpoint(d17);

		ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
		ok(e1.getOverlay("label2") != null, "endpoint 1 has overlay from addEndpoint call");
	});

	test(renderMode + ": _jsPlumb.addEndpoints (end point set label)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e1 = _jsPlumb.addEndpoint(d16),
			e2 = _jsPlumb.addEndpoint(d17);

		e1.setLabel("FOO");
		equals(e1.getLabel(), "FOO", "endpoint's label is correct");
	});

	test(renderMode + ": _jsPlumb.addEndpoints (end point set label in constructor, as string)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e1 = _jsPlumb.addEndpoint(d16, {label:"FOO"}),
			e2 = _jsPlumb.addEndpoint(d17);

		equals(e1.getLabel(), "FOO", "endpoint's label is correct");
	});

	test(renderMode + ": _jsPlumb.addEndpoints (end point set label in constructor, as function)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e1 = _jsPlumb.addEndpoint(d16, {label:function() { return "BAZ"; }, labelLocation:0.1}),
			e2 = _jsPlumb.addEndpoint(d17);

		equals(e1.getLabel()(), "BAZ", "endpoint's label is correct");
		equals(e1.getLabelOverlay().getLocation(), 0.1, "endpoint's label's location is correct");
	});

// ******************  makeTarget (and associated methods) tests ********************************************	
	
	test(renderMode + ": _jsPlumb.makeTarget (simple case)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { isTarget:true,anchor:"TopCenter"  });
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
	});

	test(renderMode + ": _jsPlumb.makeTarget (specify two divs in an array)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		_jsPlumb.makeTarget([d16, d17], { isTarget:true,anchor:"TopCenter"  });
		equals(true, jsPlumb.CurrentLibrary.hasClass(d16, "ui-droppable"));
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
	});
	
	test(renderMode + ": _jsPlumb.makeTarget (specify two divs by id in an array)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		_jsPlumb.makeTarget(["d16", "d17"], { isTarget:true,anchor:"TopCenter"  });
		equals(true, jsPlumb.CurrentLibrary.hasClass(d16, "ui-droppable"));
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
	});
	
	test(renderMode + ": _jsPlumb.makeTarget (specify divs by selector)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		d16.addClass("FOO");d17.addClass("FOO");
		_jsPlumb.makeTarget($(".FOO"), { isTarget:true,anchor:"TopCenter"  });
		equals(true, jsPlumb.CurrentLibrary.hasClass(d16, "ui-droppable"));
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
	});

	test(renderMode + ": _jsPlumb.connect after makeTarget (simple case)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { isTarget:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");
		equals(e.length, 1, "d17 has one endpoint");
		equals(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
	});

	test(renderMode + ": _jsPlumb.connect after makeTarget (simple case, two connect calls)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false, maxConnections:-1}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { isTarget:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
		_jsPlumb.connect({source:e16, target:"d17"});
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 2, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
	});

	test(renderMode + ": _jsPlumb.connect after makeTarget (simple case, two connect calls, uniqueEndpoint set)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false, maxConnections:-1}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { isTarget:true, anchor:"LeftMiddle", uniqueEndpoint:true, maxConnections:-1  }); // give it a non-default anchor, we will check this below.
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
		_jsPlumb.connect({source:e16, target:"d17"});
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].connections.length, 2, "endpoint on d17 has two connections");
	});

	test(renderMode + ": _jsPlumb.connect after makeTarget (newConnection:true specified)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { isTarget:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		equals(true, jsPlumb.CurrentLibrary.hasClass(d17, "ui-droppable"));
		_jsPlumb.connect({source:e16, target:"d17", newConnection:true});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0.5, "anchor is BottomCenter"); //here we should be seeing the default anchor
		equals(e[0].anchor.y, 1, "anchor is BottomCenter"); //here we should be seeing the default anchor
	});

// jsPlumb.connect, after makeSource has been called on some element
	test(renderMode + ": _jsPlumb.connect after makeSource (simple case)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
	});

	test(renderMode + ": _jsPlumb.connect after makeSource (simple case, two connect calls)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true, maxConnections:-1}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.		
		_jsPlumb.connect({source:"d17", target:e16});
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 2, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
	});

	test(renderMode + ": _jsPlumb.connect after makeTarget (simple case, two connect calls, uniqueEndpoint set)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true, maxConnections:-1}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true, anchor:"LeftMiddle", uniqueEndpoint:true, maxConnections:-1  }); // give it a non-default anchor, we will check this below.		
		_jsPlumb.connect({source:"d17", target:e16});
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].connections.length, 2, "endpoint on d17 has two connections");
	});

	test(renderMode + ": _jsPlumb.connect after makeTarget (newConnection:true specified)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.		
		_jsPlumb.connect({source:"d17", target:e16, newConnection:true});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0.5, "anchor is BottomCenter"); //here we should be seeing the default anchor
		equals(e[0].anchor.y, 1, "anchor is BottomCenter"); //here we should be seeing the default anchor
	});

	test(renderMode + ": _jsPlumb.connect after makeSource on child; wth parent set (parent should be recognised)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18", d17);
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d18, { isSource:true,anchor:"LeftMiddle", parent:d17  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);
		assertEndpointCount("d18", 0, _jsPlumb);
		var e = _jsPlumb.getEndpoints("d17");		
		equals(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
		equals(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
	});

	// makeSource, then disable it. should not be able to make a connection from it.
	test(renderMode + ": _jsPlumb.connect after makeSource and setSourceEnabled(false) (string id as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.setSourceEnabled(d17, false);
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		
	});

	// makeSource, then disable it. should not be able to make a connection from it.
	test(renderMode + ": _jsPlumb.connect after makeSource and setSourceEnabled(false) (selector as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.setSourceEnabled($("div"), false);
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		
	});

	// makeSource, then toggle its enabled state. should not be able to make a connection from it.
	test(renderMode + ": _jsPlumb.connect after makeSource and toggleSourceEnabled() (string id as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.toggleSourceEnabled(d17);
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		

		_jsPlumb.toggleSourceEnabled(d17);
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);		
	});

	// makeSource, then disable it. should not be able to make a connection from it.
	test(renderMode + ": _jsPlumb.connect after makeSource and toggleSourceEnabled() (selector as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.toggleSourceEnabled($("div"));
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		
		_jsPlumb.toggleSourceEnabled($("div"));
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);		
	});
		
	test(renderMode + ": jsPlumb.isSource and jsPlumb.isSourceEnabled", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		ok(_jsPlumb.isSource(d17) == true, "d17 is recognised as connection source");
		ok(_jsPlumb.isSourceEnabled(d17) == true, "d17 is recognised as enabled");
		_jsPlumb.setSourceEnabled(d17, false);
		ok(_jsPlumb.isSourceEnabled(d17) == false, "d17 is recognised as disabled");
	});

	// makeSource, then disable it. should not be able to make a connection to it.
	test(renderMode + ": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (string id as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.setTargetEnabled(d17, false);
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		
	});

	// makeTarget, then disable it. should not be able to make a connection to it.
	test(renderMode + ": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (selector as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.setTargetEnabled($("div"), false);
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		
	});

	// makeTarget, then toggle its enabled state. should not be able to make a connection to it.
	test(renderMode + ": _jsPlumb.connect after makeTarget and toggleTargetEnabled() (string id as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.toggleTargetEnabled(d17);
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		

		_jsPlumb.toggleTargetEnabled(d17);
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);		
	});

	// makeTarget, then disable it. should not be able to make a connection to it.
	test(renderMode + ": _jsPlumb.connect after makeTarget and toggleTargetEnabled() (selector as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		_jsPlumb.toggleTargetEnabled($("div"));
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 0, _jsPlumb);		
		_jsPlumb.toggleTargetEnabled($("div"));
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);		
	});
		
	test(renderMode + ": jsPlumb.isTarget and jsPlumb.isTargetEnabled", function() {
		var d17 = _addDiv("d17"); 
		_jsPlumb.makeTarget(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		ok(_jsPlumb.isTarget(d17) == true, "d17 is recognised as connection target");
		ok(_jsPlumb.isTargetEnabled(d17) == true, "d17 is recognised as enabled");
		_jsPlumb.setTargetEnabled(d17, false);
		ok(_jsPlumb.isTargetEnabled(d17) == false, "d17 is recognised as disabled");
	});

	// makeSource, then unmake it. should not be able to make a connection from it. then connect to it, which should succeed,
	// because jsPlumb will just add a new endpoint.
	test(renderMode + ": jsPlumb.unmakeSource (string id as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:false, isTarget:true}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeSource(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		ok(_jsPlumb.isSource(d17) == true, "d17 is currently a source");
		// unmake source
		_jsPlumb.unmakeSource(d17);		
		ok(_jsPlumb.isSource(d17) == false, "d17 is no longer a source");

		// this should succeed, because d17 is no longer a source and so jsPlumb will just create and add a new endpoint to d17.
		_jsPlumb.connect({source:"d17", target:e16});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);				
	});

	// maketarget, then unmake it. should not be able to make a connection to it. 
	test(renderMode + ": jsPlumb.unmakeTarget (string id as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		_jsPlumb.makeTarget(d17, { isSource:true,anchor:"LeftMiddle"  }); // give it a non-default anchor, we will check this below.
		ok(_jsPlumb.isTarget(d17) == true, "d17 is currently a target");
		// unmake target
		_jsPlumb.unmakeTarget(d17);		
		ok(_jsPlumb.isTarget(d17) == false, "d17 is no longer a target");

		// this should succeed, because d17 is no longer a target and so jsPlumb will just create and add a new endpoint to d17.
		_jsPlumb.connect({source:e16, target:"d17"});
		assertEndpointCount("d16", 1, _jsPlumb);
		assertEndpointCount("d17", 1, _jsPlumb);				
	});


	test(renderMode + ": jsPlumb.removeEverySource and removeEveryTarget (string id as argument)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18");
		_jsPlumb.makeSource(d16).makeTarget(d17).makeSource(d18);
		ok(_jsPlumb.isSource(d16) == true, "d16 is a source");
		ok(_jsPlumb.isTarget(d17) == true, "d17 is a target");
		ok(_jsPlumb.isSource(d18) == true, "d18 is a source");

		_jsPlumb.unmakeEverySource();
		_jsPlumb.unmakeEveryTarget();

		ok(_jsPlumb.isSource(d16) == false, "d16 is no longer a source");
		ok(_jsPlumb.isTarget(d17) == false, "d17 is no longer a target");
		ok(_jsPlumb.isSource(d18) == false, "d18 is no longer a source");
	});

// *********************** end of makeTarget (and associated methods) tests ************************ 
	
	test(renderMode + ': _jsPlumb.connect (between two Endpoints)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e = _jsPlumb.addEndpoint(d1, {});
		var e2 = _jsPlumb.addEndpoint(d2, {});
		ok(e, 'endpoint e exists');
		ok(e2, 'endpoint e2 exists');
		assertContextSize(2);				// should have a canvas for each endpoint now.  
		assertEndpointCount("d1", 1, _jsPlumb);
		assertEndpointCount("d2", 1, _jsPlumb);
		var c = _jsPlumb.connect({target:'d2', sourceEndpoint:e, targetEndpoint:e2});
		assertEndpointCount("d1", 1, _jsPlumb);		// no new endpoint should have been added
		assertEndpointCount("d2", 1, _jsPlumb); 		// no new endpoint should have been added
		assertContextSize(3);				// now we should also have a canvas for the connection.
		ok(c.id != null, "connection has had an id assigned");
	});
	
	test(renderMode + ': _jsPlumb.connect (Endpoint connectorTooltip parameter)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e = _jsPlumb.addEndpoint(d1, {connectorTooltip:"FOO"});
		var e2 = _jsPlumb.addEndpoint(d2, {});
		var c = _jsPlumb.connect({target:'d2', sourceEndpoint:e, targetEndpoint:e2});
		equals(c.connector.canvas.getAttribute("title"), "FOO", "connector canvas has label attribute set");
	});
	
	test(renderMode + ': _jsPlumb.connect (tooltip parameter)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e = _jsPlumb.addEndpoint(d1, {});
		var e2 = _jsPlumb.addEndpoint(d2, {});
		var c = _jsPlumb.connect({target:'d2', sourceEndpoint:e, targetEndpoint:e2, tooltip:"FOO"});
		equals(c.connector.canvas.getAttribute("title"), "FOO", "connector canvas has label attribute set");
	});
	
	test(renderMode + ': _jsPlumb.connect (between two Endpoints, and dont supply any parameters to the Endpoints.)', function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e = _jsPlumb.addEndpoint(d1);
		var e2 = _jsPlumb.addEndpoint(d2);
		ok(e, 'endpoint e exists');
		ok(e2, 'endpoint e2 exists');
		assertContextSize(2);				// should have a canvas for each endpoint now.  
		assertEndpointCount("d1", 1, _jsPlumb);
		assertEndpointCount("d2", 1, _jsPlumb);
		_jsPlumb.connect({target:'d2', sourceEndpoint:e, targetEndpoint:e2});
		assertEndpointCount("d1", 1, _jsPlumb);		// no new endpoint should have been added
		assertEndpointCount("d2", 1, _jsPlumb); 		// no new endpoint should have been added
		assertContextSize(3);				// now we should also have a canvas for the connection.
	});

	test(renderMode + " : _jsPlumb.connect, passing 'anchors' array" ,function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2, anchors:["LeftMiddle", "RightMiddle"]});

		equals(c.endpoints[0].anchor.x, 0, "source anchor is at x=0");
		equals(c.endpoints[0].anchor.y, 0.5, "source anchor is at y=0.5");
		equals(c.endpoints[1].anchor.x, 1, "target anchor is at x=1");
		equals(c.endpoints[1].anchor.y, 0.5, "target anchor is at y=0.5");
	});
	
	test(renderMode + ': _jsPlumb.connect (by endpoint)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		_jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
	});
	
	test(renderMode + ': _jsPlumb.connect (cost)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17, cost:567});
		assertContextSize(3);
		equals(c.getCost(), 567, "connection cost is 567");
	});
	
	test(renderMode + ': _jsPlumb.connect (default cost)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
		equals(c.getCost(), undefined, "default connection cost is 1");
	});
	
	test(renderMode + ': _jsPlumb.connect (set cost)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
		equals(c.getCost(), undefined, "default connection cost is 1");
		c.setCost(8989);
		equals(c.getCost(), 8989, "connection cost is 8989");
	});
	
	test(renderMode + ': _jsPlumb.connect two endpoints (connectionCost)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, connectionCost:567});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true});
		var c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
		equals(c.getCost(), 567, "connection cost is 567");
	});
	
	test(renderMode + ': _jsPlumb.connect two endpoints (change connectionCost)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e16 = _jsPlumb.addEndpoint(d16, {isSource:true, connectionCost:567, maxConnections:-1}),
			e17 = _jsPlumb.addEndpoint(d17, {isSource:true, maxConnections:-1});
			c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
		equals(c.getCost(), 567, "connection cost is 567");
		e16.setConnectionCost(23);
		var c2 = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		equals(c2.getCost(), 23, "connection cost is 23 after change on endpoint");
	});
	
	test(renderMode + ': _jsPlumb.connect (default bidirectional)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e16 = _jsPlumb.addEndpoint(d16, {isSource:true}),
			e17 = _jsPlumb.addEndpoint(d17, {isSource:true}),
			c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
		equals(c.isBidirectional(), true, "default connection is bidirectional");
	});
	
	test(renderMode + ': _jsPlumb.connect (bidirectional false)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e16 = _jsPlumb.addEndpoint(d16, {isSource:true}),
			e17 = _jsPlumb.addEndpoint(d17, {isSource:true}),
			c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17, bidirectional:false});
		assertContextSize(3);
		equals(c.isBidirectional(), false, "connection is not bidirectional");
	});
	
	test(renderMode + ': _jsPlumb.connect two endpoints (connectionsBidirectional)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {isSource:true, connectionsBidirectional:true, maxConnections:-1});
		ok(e16.anchor, 'endpoint 16 has an anchor');
		var e17 = _jsPlumb.addEndpoint(d17, {isSource:true, maxConnections:-1});
		var c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
		equals(c.isBidirectional(), true, "connection is bidrectional");
	});
	
	test(renderMode + ': _jsPlumb.connect two endpoints (change connectionsBidirectional)', function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"),
			e16 = _jsPlumb.addEndpoint(d16, {isSource:true, connectionsBidirectional:true, maxConnections:-1}),
			e17 = _jsPlumb.addEndpoint(d17, {isSource:true, maxConnections:-1});
			c = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		assertContextSize(3);
		equals(c.isBidirectional(), true, "connection is bidirectional");
		e16.setConnectionsBidirectional(false);
		var c2 = _jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
		equals(c2.isBidirectional(), false, "connection is not bidirectional");
	});
	
	test(renderMode + ": _jsPlumb.connect (two Endpoints - that have been already added - by UUID)", function() {
		var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e1 = _jsPlumb.addEndpoint("d16", {isSource:true, maxConnections:-1, uuid:srcEndpointUuid});
		var e2 = _jsPlumb.addEndpoint("d17", {isSource:true, maxConnections:-1, uuid:dstEndpointUuid});
		_jsPlumb.connect({ uuids:  [ srcEndpointUuid, dstEndpointUuid  ] });
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		assertContextSize(3);
	});
	
	test(renderMode + ": _jsPlumb.connect (two Endpoints - that have not been already added - by UUID)", function() {
		var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		_jsPlumb.connect({ uuids:  [ srcEndpointUuid, dstEndpointUuid  ], source:d16, target:d17 });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		var e1 = _jsPlumb.getEndpoint(srcEndpointUuid);
		ok(e1 != null, "endpoint with src uuid added");
		ok(e1.canvas != null);
		var e2 = _jsPlumb.getEndpoint(dstEndpointUuid);
		ok(e2 != null, "endpoint with target uuid added");
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
	});
	
	test(renderMode + ": _jsPlumb.connect (two Endpoints - that have been already added - by endpoint reference)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e1 = _jsPlumb.addEndpoint("d16", {isSource:true, maxConnections:-1});
		var e2 = _jsPlumb.addEndpoint("d17", {isSource:true, maxConnections:-1});
		_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
		assertContextSize(3);
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
	});
	
	test(renderMode + ": _jsPlumb.connect (two elements)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		_jsPlumb.connect({ source:d16, target:d17 });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
	});
	
	test(renderMode + ": _jsPlumb.connect (Connector test, straight)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
	});
	
	test(renderMode + ": _jsPlumb.connect (Connector test, bezier, no params)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:"Bezier" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Bezier, "Bezier connector chosen for connection");
		equals(conn.connector.majorAnchor, 150, "Bezier connector chose 150 curviness");
	});
	
	test(renderMode + ": _jsPlumb.connect (Connector test, bezier, curviness as int)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:["Bezier", { curviness:200 }] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Bezier, "Canvas Bezier connector chosen for connection");
		equals(conn.connector.majorAnchor, 200, "Bezier connector chose 200 curviness");
	});
	
	test(renderMode + ": _jsPlumb.connect (Connector test, bezier, curviness as named option)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:["Bezier", {curviness:300}] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Bezier, "Bezier connector chosen for connection");
		equals(conn.connector.majorAnchor, 300, "Bezier connector chose 300 curviness");
	});
	
	test(renderMode + ": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:"Straight", anchors:[[0.3,0.3,1,0], [0.7,0.7,0,1]] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Canvas Straight connector chosen for connection");
		equals(0.3, conn.endpoints[0].anchor.x, "source anchor x");
		equals(0.3, conn.endpoints[0].anchor.y, "source anchor y");
		equals(0.7, conn.endpoints[1].anchor.x, "target anchor x");
		equals(0.7, conn.endpoints[1].anchor.y, "target anchor y");
	});
	
	test(renderMode + ": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as strings)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:"Straight", anchors:["LeftMiddle", "RightMiddle"] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(0, conn.endpoints[0].anchor.x, "source anchor x");
		equals(0.5, conn.endpoints[0].anchor.y, "source anchor y");
		equals(1, conn.endpoints[1].anchor.x, "target anchor x");
		equals(0.5, conn.endpoints[1].anchor.y, "target anchor y");
	});
	
	test(renderMode + ": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:"Straight", anchors:[[0.3,0.3,1,0], [0.7,0.7,0,1]] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(0.3, conn.endpoints[0].anchor.x, "source anchor x");
		equals(0.3, conn.endpoints[0].anchor.y, "source anchor y");
		equals(0.7, conn.endpoints[1].anchor.x, "target anchor x");
		equals(0.7, conn.endpoints[1].anchor.y, "target anchor y");
	});
	
	
	test(renderMode + ": _jsPlumb.connect (two argument method in which some data is reused across connections)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18"), d19 = _addDiv("d19");
		var sharedData = { connector:"Straight", anchors:[[0.3,0.3,1,0], [0.7,0.7,0,1]] };
		var conn = _jsPlumb.connect({ source:d16, target:d17}, sharedData);
		var conn2 = _jsPlumb.connect({ source:d18, target:d19}, sharedData);
		assertContextSize(6);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 2, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(conn2.connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(0.3, conn.endpoints[0].anchor.x, "source anchor x");
		equals(0.3, conn.endpoints[0].anchor.y, "source anchor y");
		equals(0.7, conn.endpoints[1].anchor.x, "target anchor x");
		equals(0.7, conn.endpoints[1].anchor.y, "target anchor y");
		equals(0.3, conn2.endpoints[0].anchor.x, "source anchor x");
		equals(0.3, conn2.endpoints[0].anchor.y, "source anchor y");
		equals(0.7, conn2.endpoints[1].anchor.x, "target anchor x");
		equals(0.7, conn2.endpoints[1].anchor.y, "target anchor y");
	});
	
	test(renderMode + ": _jsPlumb.connect (Connector as string test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
	});
	
	test(renderMode + ": _jsPlumb.connect (Endpoint test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, endpoint:"Rectangle" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
		equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection target");
	});
	
	test(renderMode + ": _jsPlumb.connect (Endpoint as string test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, endpoint:"Rectangle" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
		equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection target");
	});
	
	test(renderMode + ": _jsPlumb.connect (Endpoints test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, endpoints:["Rectangle", "Dot" ] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
		equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Dot, "Dot endpoint chosen for connection target");
	});
	
	test(renderMode + ": _jsPlumb.connect (Blank Endpoint specified via 'endpoint' param)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, endpoint:"Blank" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection source");
		equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection target");
	});
	
	test(renderMode + ": _jsPlumb.connect (Blank Endpoint specified via 'endpoints' param)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, endpoints:["Blank", "Blank" ] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection source");
		equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection target");
	});
	
	test(renderMode + ": _jsPlumb.connect (Endpoint as string test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var conn = _jsPlumb.connect({ source:d16, target:d17, endpoints:["Rectangle", "Dot" ] });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
		equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Dot, "Dot endpoint chosen for connection target");
	});
	
	test(renderMode + ": _jsPlumb.connect (by Endpoints, connector test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {});
		var e17 = _jsPlumb.addEndpoint(d17, {});
		var conn = _jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(e16.connections[0].connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
	});
	
	test(renderMode + ": _jsPlumb.connect (by Endpoints, connector as string test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var e16 = _jsPlumb.addEndpoint(d16, {});
		var e17 = _jsPlumb.addEndpoint(d17, {});
		var conn = _jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(e16.connections[0].connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
	});
	
	test(renderMode + ": _jsPlumb.connect (by Endpoints, anchors as string test)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var a16 = "TopCenter", a17 = "BottomCenter";
		var e16 = _jsPlumb.addEndpoint(d16, {anchor:a16});
		var e17 = _jsPlumb.addEndpoint(d17, {anchor:a17});
		var conn = _jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(e16.connections[0].connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(e16.anchor.x, 0.5, "endpoint 16 is at top center");equals(e16.anchor.y, 0, "endpoint 16 is at top center");
		equals(e17.anchor.x, 0.5, "endpoint 17 is at bottom center");equals(e17.anchor.y, 1, "endpoint 17 is at bottom center");
	});
	
	test(renderMode + ": _jsPlumb.connect (by Endpoints, endpoints create anchors)", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17");
		var a16 = [0,0.5,0,-1], a17 = [1,0.0,-1,-1];
		var e16 = _jsPlumb.addEndpoint(d16, {anchor:a16});
		var e17 = _jsPlumb.addEndpoint(d17, {anchor:a17});
		var conn = _jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(e16.connections[0].connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(e16.anchor.x, a16[0]);equals(e16.anchor.y, a16[1]);
		equals(e17.anchor.x, a17[0]);equals(e17.anchor.y, a17[1]);
		equals(e16.anchor.getOrientation()[0], a16[2]); equals(e16.anchor.getOrientation()[1], a16[3]);
		equals(e17.anchor.getOrientation()[0], a17[2]); equals(e17.anchor.getOrientation()[1], a17[3]);
	});
	
	test(renderMode + ": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchor')", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {anchor:[[0,0.5,0,-1], [1,0.5,0,1]]});
		var e17 = _jsPlumb.addEndpoint(d17, {anchor:["TopCenter", "BottomCenter"]});
		var conn = _jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(e16.connections[0].connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
		equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
	});
	
	test(renderMode + ": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchors')", function() {
		var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
		var e16 = _jsPlumb.addEndpoint(d16, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
		var e17 = _jsPlumb.addEndpoint(d17, {anchors:["TopCenter", "BottomCenter"]});
		var conn = _jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		equals(e16.connections[0].connector.constructor, jsPlumb.Connectors[renderMode].Straight, "Straight connector chosen for connection");
		equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
		equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
	});
	
	test(renderMode + ": _jsPlumb.connect (connect by element, default endpoint, supplied dynamic anchors)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var anchors = [ [0.25, 0, 0, -1], [1, 0.25, 1, 0], [0.75, 1, 0, 1], [0, 0.75, -1, 0] ];
		_jsPlumb.connect({source:d1, target:d2, dynamicAnchors:anchors});                // auto connect with default endpoint and provided anchors
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		_jsPlumb.detach({source:d1, target:d2});
		// this changed in 1.3.5, because auto generated endpoints are now removed by detach.  so i added the test below this one
		// to check that the deleteEndpointsOnDetach flag is honoured.
		assertEndpointCount("d1", 0, _jsPlumb);assertEndpointCount("d2", 0, _jsPlumb);
		assertContextSize(2);
	});
	
	test(renderMode + ": _jsPlumb.connect (connect by element, default endpoint, supplied dynamic anchors, delete on detach false)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var anchors = [ [0.25, 0, 0, -1], [1, 0.25, 1, 0], [0.75, 1, 0, 1], [0, 0.75, -1, 0] ];
		_jsPlumb.connect({
			source:d1, 
			target:d2, 
			dynamicAnchors:anchors,
			deleteEndpointsOnDetach:false
		});                // auto connect with default endpoint and provided anchors
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		_jsPlumb.detach({source:d1, target:d2});
		// this changed in 1.3.5, because auto generated endpoints are now removed by detach.  so i added this test
		// to check that the deleteEndpointsOnDetach flag is honoured.
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		assertContextSize(2);
	});
	
	test(renderMode + ": _jsPlumb.connect (connect by element, supplied endpoint and dynamic anchors)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var endpoint = { isSource:true };
		var e1 = _jsPlumb.addEndpoint(d1, endpoint);
		var e2 = _jsPlumb.addEndpoint(d2, endpoint);
		var anchors = [ "TopCenter", "BottomCenter" ];
		_jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2, dynamicAnchors:anchors});
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		assertContextSize(3);
		_jsPlumb.detach({source:d1, target:d2});
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		assertContextSize(2);
	});
	
	test(renderMode + ": _jsPlumb.connect (connect by element, supplied endpoints using 'source' and 'target' (this test is identical to the one above apart from the param names), and dynamic anchors)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var endpoint = { isSource:true };
		var e1 = _jsPlumb.addEndpoint(d1, endpoint);
		var e2 = _jsPlumb.addEndpoint(d2, endpoint);
		var anchors = [ "TopCenter", "BottomCenter" ];
		_jsPlumb.connect({source:e1, target:e2, dynamicAnchors:anchors});
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		assertContextSize(3);
		_jsPlumb.detach({source:d1, target:d2});
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		assertContextSize(2);
	});

    test(renderMode + " detachable parameter defaults to true on _jsPlumb.connect", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            c = _jsPlumb.connect({source:d1, target:d2});
        equals(c.isDetachable(), true, "connections detachable by default");
    });

    test(renderMode + " detachable parameter set to false on _jsPlumb.connect", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            c = _jsPlumb.connect({source:d1, target:d2, detachable:false});
        equals(c.isDetachable(), false, "connection detachable");
    });

    test(renderMode + " setDetachable on initially detachable connection", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            c = _jsPlumb.connect({source:d1, target:d2});
        equals(c.isDetachable(), true, "connection initially detachable");
        c.setDetachable(false);
        equals(c.isDetachable(), false, "connection not detachable");
    });

    test(renderMode + " setDetachable on initially not detachable connection", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            c = _jsPlumb.connect({source:d1, target:d2, detachable:false });
        equals(c.isDetachable(), false, "connection not initially detachable");
        c.setDetachable(true);
        equals(c.isDetachable(), true, "connection now detachable");
    });

    test(renderMode + " _jsPlumb.Defaults.ConnectionsDetachable", function() {
        _jsPlumb.Defaults.ConnectionsDetachable = false;
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            c = _jsPlumb.connect({source:d1, target:d2});
        equals(c.isDetachable(), false, "connections not detachable by default (overrode the defaults)");
        _jsPlumb.Defaults.ConnectionsDetachable = true;
    });
	
	
	test(renderMode + ": _jsPlumb.connect (testing for connection event callback)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var connectCallback = null, detachCallback = null;
		_jsPlumb.bind("jsPlumbConnection", function(params) {
				connectCallback = $.extend({}, params);
			});
		_jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
				detachCallback = $.extend({}, params);
			});
		_jsPlumb.connect({source:d1, target:d2});                // auto connect with default endpoint and anchor set
		ok(connectCallback != null, "connect callback was made");
		assertContextSize(3);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		assertEndpointCount("d1", 1, _jsPlumb);assertEndpointCount("d2", 1, _jsPlumb);
		_jsPlumb.detach({source:d1, target:d2});
		assertContextSize(2);
		ok(detachCallback != null, "detach callback was made");
	});
	
	test(renderMode + ": _jsPlumb.connect (setting cssClass on Connector)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1,target:d2,cssClass:"CSS"});
		var has = function(clazz) { 
			var cn = c.connector.canvas.className,
				cns = cn.constructor == String ? cn : cn.baseVal; 
			
			return cns.indexOf(clazz) != -1; 
		};		
		ok(has("CSS"), "custom cssClass set correctly");
		ok(has(_jsPlumb.connectorClass), "basic connector class set correctly");
	});
	
	test(renderMode + ": _jsPlumb.connect (overlays, long-hand version)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var imageEventListener = function() { };
		var arrowSpec = {width:40,length:40,location:0.7, foldback:0, paintStyle:{lineWidth:1, strokeStyle:"#000000"}};
		var connection1 = _jsPlumb.connect({
		source:d1, 
	   	target:d2, 
	   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
	   	overlays : [ ["Label",{label:"CONNECTION 1", location:0.3}],
					["Arrow",arrowSpec ] ]
		});
		equals(2, connection1.overlays.length);
		equals(jsPlumb.Overlays[renderMode].Label, connection1.overlays[0].constructor);
		
		equals(jsPlumb.Overlays[renderMode].Arrow, connection1.overlays[1].constructor);
		equals(0.7, connection1.overlays[1].loc);
		equals(40, connection1.overlays[1].width);
		equals(40, connection1.overlays[1].length);
	});
	
	test(renderMode + ": _jsPlumb.connect (overlays, long-hand version, IDs specified)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var imageEventListener = function() { };
		var arrowSpec = { 
				width:40,
				length:40,
				location:0.7, 
				foldback:0, 
				paintStyle:{lineWidth:1, strokeStyle:"#000000"},
				id:"anArrow"
		};
		var connection1 = _jsPlumb.connect({
		source:d1, 
	   	target:d2, 
	   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
	   	overlays : [ ["Label",{label:"CONNECTION 1", location:0.3, id:"aLabel"}],
					["Arrow",arrowSpec ] ]
		});
		equals(2, connection1.overlays.length);
		equals(jsPlumb.Overlays[renderMode].Label, connection1.overlays[0].constructor);
		equals("aLabel", connection1.overlays[0].id);
		
		equals(jsPlumb.Overlays[renderMode].Arrow, connection1.overlays[1].constructor);
		equals(0.7, connection1.overlays[1].loc);
		equals(40, connection1.overlays[1].width);
		equals(40, connection1.overlays[1].length);
		equals("anArrow", connection1.overlays[1].id);
	});

	test(renderMode + ": _jsPlumb.connect (default overlays)", function() {
		_jsPlumb.Defaults.Overlays = [
			["Arrow",{ location:0.1, id:"arrow" }]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});

		ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
	});

	test(renderMode + ": _jsPlumb.connect (default overlays + overlays specified in connect call)", function() {
		_jsPlumb.Defaults.Overlays = [
			["Arrow",{ location:0.1, id:"arrow" }]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2, overlays:[
				["Label", {id:"label"}]
			]});

		ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
		ok(c.getOverlay("label") != null, "Label overlay created from connect call");
	});

	test(renderMode + ": _jsPlumb.connect (default connection overlays)", function() {
		_jsPlumb.Defaults.ConnectionOverlays = [
			["Arrow",{ location:0.1, id:"arrow" }]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});

		ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
	});

	test(renderMode + ": _jsPlumb.connect (default connection overlays + overlays specified in connect call)", function() {
		_jsPlumb.Defaults.ConnectionOverlays = [
			["Arrow",{ location:0.1, id:"arrow" }]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2, overlays:[
				["Label", {id:"label"}]
			]});

		ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
		ok(c.getOverlay("label") != null, "Label overlay created from connect call");
	});

	test(renderMode + ": _jsPlumb.connect (default overlays + default connection overlays)", function() {
		_jsPlumb.Defaults.ConnectionOverlays = [
			["Arrow",{ location:0.1, id:"arrow" }]
		];
		_jsPlumb.Defaults.Overlays = [
			["Arrow",{ location:0.1, id:"arrow2" }]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});

		ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
		ok(c.getOverlay("arrow2") != null, "Arrow overlay created from connection defaults");
	});

	test(renderMode + ": _jsPlumb.connect (default overlays + default connection overlays)", function() {
		_jsPlumb.Defaults.ConnectionOverlays = [
			["Arrow",{ location:0.1, id:"arrow" }]
		];
		_jsPlumb.Defaults.Overlays = [
			["Arrow",{ location:0.1, id:"arrow2" }]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2, overlays:[
					["Label", {id:"label"}]
				]});

		ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
		ok(c.getOverlay("arrow2") != null, "Arrow overlay created from connection defaults");
		ok(c.getOverlay("label") != null, "Label overlay created from connect call");
	});

	test(renderMode + ": _jsPlumb.connect (label overlay set using 'label')", function() {		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({
				source:d1, 
				target:d2, 
				label:"FOO"
			});

		equals(c.getLabel(), "FOO", "label is set correctly");
	});

	test(renderMode + ": _jsPlumb.connect (set label after construction, with string)", function() {		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({
				source:d1, 
				target:d2});

		c.setLabel("FOO");
		equals(c.getLabel(), "FOO", "label is set correctly");
	});

	test(renderMode + ": _jsPlumb.connect (set label after construction, with function)", function() {		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({
				source:d1, 
				target:d2});

		c.setLabel(function() { return "BAR"; });
		equals(c.getLabel()(), "BAR", "label is set correctly");
	});

	test(renderMode + ": _jsPlumb.connect (set label after construction, with params object)", function() {		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({
				source:d1, 
				target:d2});

		c.setLabel({
			label:"BAZ",
			cssClass:"CLASSY",
			location:0.9
		});
		var lo = c.getLabelOverlay();
		ok(lo != null, "label overlay exists");
		equals(lo.getLabel(), "BAZ", "label overlay has correct value");
		equals(lo.getLocation(), 0.9, "label overlay has correct location");
	});

	test(renderMode + ": _jsPlumb.connect (set label after construction with existing label set, with params object)", function() {		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({
				source:d1, 
				target:d2,
				label:"FOO",
				labelLocation:0.2
			});

		var lo = c.getLabelOverlay();
		equals(lo.getLocation(), 0.2, "label overlay has correct location");

		c.setLabel({
			label:"BAZ",
			cssClass:"CLASSY",
			location:0.9
		});
		
		ok(lo != null, "label overlay exists");
		equals(lo.getLabel(), "BAZ", "label overlay has correct value");
		equals(lo.getLocation(), 0.9, "label overlay has correct location");
	});

	test(renderMode + ": _jsPlumb.connect (getLabelOverlay, label on connect call)", function() {		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({
				source:d1, 
				target:d2, 
				label:"FOO"
			}),
			lo = c.getLabelOverlay();

		ok(lo != null, "label overlay exists");
		equals(lo.getLabel(), "FOO", "label overlay has correct value");
		equals(lo.getLocation(), 0.5, "label overlay has correct location");
	});

	test(renderMode + ": _jsPlumb.connect (getLabelOverlay, label on connect call, location set)", function() {		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({
				source:d1, 
				target:d2, 
				label:"FOO",
				labelLocation:0.2
			}),
			lo = c.getLabelOverlay();

		ok(lo != null, "label overlay exists");
		equals(lo.getLabel(), "FOO", "label overlay has correct value");
		equals(lo.getLocation(), 0.2, "label overlay has correct location");
	});	
	
	test(renderMode + ": _jsPlumb.connect (remove single overlay by id)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var arrowSpec = { 
				width:40,
				length:40,
				location:0.7, 
				foldback:0, 
				paintStyle:{lineWidth:1, strokeStyle:"#000000"},
				id:"anArrow"
		};
		var connection1 = _jsPlumb.connect({
		source:d1, 
	   	target:d2, 
	   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
	   	overlays : [ ["Label",{label:"CONNECTION 1", location:0.3, id:"aLabel"}],
					["Arrow",arrowSpec ] ]
		});
		equals(2, connection1.overlays.length);
		connection1.removeOverlay("aLabel");
		equals(1, connection1.overlays.length);
		equals("anArrow", connection1.overlays[0].id);
	});
	
	test(renderMode + ": _jsPlumb.connect (remove multiple overlays by id)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var arrowSpec = { 
				width:40,
				length:40,
				location:0.7, 
				foldback:0, 
				paintStyle:{lineWidth:1, strokeStyle:"#000000"},
				id:"anArrow"
		};
		var connection1 = _jsPlumb.connect({
		source:d1, 
	   	target:d2, 
	   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
	   	overlays : [ ["Label",{label:"CONNECTION 1", location:0.3, id:"aLabel"}],
					["Arrow",arrowSpec ] ]
		});
		equals(2, connection1.overlays.length);
		connection1.removeOverlays("aLabel", "anArrow");
		equals(0, connection1.overlays.length);
	});
	
	test(renderMode + ": _jsPlumb.connect (overlays, short-hand version)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var imageEventListener = function() { };
		var loc = { location:0.7 };
		var arrowSpec = { width:40,length:40, foldback:0, paintStyle:{lineWidth:1, strokeStyle:"#000000"} };
		var connection1 = _jsPlumb.connect({
		source:d1, 
	   	target:d2, 
	   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
	   	overlays : [ ["Label",  {label:"CONNECTION 1", location:0.3}],
					["Arrow", arrowSpec, loc] ]
		});
		equals(2, connection1.overlays.length);
		equals(jsPlumb.Overlays[renderMode].Label, connection1.overlays[0].constructor);
		
		equals(jsPlumb.Overlays[renderMode].Arrow, connection1.overlays[1].constructor);
		equals(0.7, connection1.overlays[1].loc);
		equals(40, connection1.overlays[1].width);
		equals(40, connection1.overlays[1].length);
	});
	
	test(renderMode + ": _jsPlumb.connect (removeAllOverlays)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var imageEventListener = function() { };
		var loc = { location:0.7 };
		var arrowSpec = { width:40,length:40, foldback:0, paintStyle:{lineWidth:1, strokeStyle:"#000000"} };
		var connection1 = _jsPlumb.connect({
		source:d1, 
	   	target:d2, 
	   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
	   	overlays : [ ["Label",  {label:"CONNECTION 1", location:0.3, cssClass:"PPPP"}],
					["Arrow", arrowSpec, loc] ]
		});
		equals(2, connection1.overlays.length);
		equals(jsPlumb.Overlays[renderMode].Label, connection1.overlays[0].constructor);
		
		equals(jsPlumb.Overlays[renderMode].Arrow, connection1.overlays[1].constructor);
		equals(0.7, connection1.overlays[1].loc);
		equals(40, connection1.overlays[1].width);
		equals(40, connection1.overlays[1].length);
		
		connection1.removeAllOverlays();
		equals(0, connection1.overlays.length);
		equals(0, $(".PPPP").length);
	});
	
	test(renderMode + ": _jsPlumb.connect, specify arrow overlay using string identifier only", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var conn = _jsPlumb.connect({source:d1,target:d2,overlays:["Arrow"]});
		equals(jsPlumb.Overlays[renderMode].Arrow, conn.overlays[0].constructor);
	});
	
	test(renderMode + ": Connection.getOverlay method, existing overlay", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var conn = _jsPlumb.connect({source:d1,target:d2,overlays:[ [ "Arrow", { id:"arrowOverlay" } ] ] });
		var overlay = conn.getOverlay("arrowOverlay");
		ok(overlay != null);
	});
	
	test(renderMode + ": Connection.getOverlay method, non-existent overlay", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var conn = _jsPlumb.connect({source:d1,target:d2,overlays:[ [ "Arrow", { id:"arrowOverlay" } ] ] });
		var overlay = conn.getOverlay("IDONTEXIST");
		ok(overlay == null);
	});
	
	test(renderMode + ": Overlay.setVisible method", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var conn = _jsPlumb.connect({source:d1,target:d2,overlays:[ [ "Arrow", { id:"arrowOverlay" } ] ] });
		var overlay = conn.getOverlay("arrowOverlay");
		ok(overlay.isVisible());
		overlay.setVisible(false);
		ok(!overlay.isVisible());
		overlay.setVisible(true);
		ok(overlay.isVisible());
	});
	
	test(renderMode + ": _jsPlumb.connect (custom label overlay, set on Defaults, return plain DOM element)", function() {
		_jsPlumb.Defaults.ConnectionOverlays = [
			["Custom",{ id:"custom", create:function(connection) {
				ok(connection != null, "we were passed in a connection");
				var d = document.createElement("div");
				d.setAttribute("custom", "true");
				d.innerHTML = connection.id;
				return d;
			}}]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});

		var o = c.getOverlay("custom");
		equals(o.getElement().getAttribute("custom"), "true", "custom overlay created correctly");
		equals(o.getElement().innerHTML, c.id, "custom overlay has correct value");		
	});
	
	test(renderMode + ": _jsPlumb.connect (custom label overlay, set on Defaults, return selector)", function() {
		_jsPlumb.Defaults.ConnectionOverlays = [
			["Custom",{ id:"custom", create:function(connection) {
				ok(connection != null, "we were passed in a connection");
				return $("<div custom='true'>" + connection.id + "</div>");
			}}]
		];
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});

		var o = c.getOverlay("custom");
		equals(o.getElement().getAttribute("custom"), "true", "custom overlay created correctly");
		equals(o.getElement().innerHTML, c.id, "custom overlay has correct value");		
	});
	
	// this test is for the original detach function; it should stay working after i mess with it
	// a little.
	test(renderMode + ": _jsPlumb.detach (by element ids)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1);
		var e2 = _jsPlumb.addEndpoint(d2);
		var e3 = _jsPlumb.addEndpoint(d1);
		var e4 = _jsPlumb.addEndpoint(d2);
		_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
		_jsPlumb.connect({ sourceEndpoint:e3, targetEndpoint:e4 });  // make two connections to be sure this works ;)
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		assertConnectionCount(e3, 1);
		assertConnectionCount(e4, 1);
		
		_jsPlumb.detach({source:"d1", target:"d2"});
		
		assertConnectionCount(e1, 0);
		assertConnectionCount(e2, 0);
		assertConnectionCount(e3, 0);
		assertConnectionCount(e4, 0);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
	});
	
	// detach is being made to operate more like connect - by taking one argument with a whole 
	// bunch of possible params in it.  if two args are passed in it will continue working
	// in the old way.
	test(renderMode + ": _jsPlumb.detach (params object, using element ids)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1);
		var e2 = _jsPlumb.addEndpoint(d2);
		_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		_jsPlumb.detach({source:"d1", target:"d2"});
		assertConnectionCount(e1, 0);
		assertConnectionCount(e2, 0);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
	});
/*
    test(renderMode + ": _jsPlumb.detach (params object, using target only)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
		    e1 = _jsPlumb.addEndpoint(d1, {maxConnections:2}),
		    e2 = _jsPlumb.addEndpoint(d2),
            e3 = _jsPlumb.addEndpoint(d3);
		_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
        _jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e3 });
		assertConnectionCount(e1, 2);
		assertConnectionCount(e2, 1);
        assertConnectionCount(e3, 1);
		_jsPlumb.detach({target:"d2"});
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 0);
        assertConnectionCount(e3, 1);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1);
	});
*/
	test(renderMode + ": _jsPlumb.detach (params object, using element objects)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1);
		var e2 = _jsPlumb.addEndpoint(d2);
		_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		assertContextSize(3);
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		_jsPlumb.detach({source:d1, target:d2});
		assertConnectionCount(e1, 0);
		assertConnectionCount(e2, 0);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
		assertContextSize(2);
	});
	
	test(renderMode + ": _jsPlumb.detach (source and target as endpoint UUIDs)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1, {uuid:"abcdefg"});
		ok(_jsPlumb.getEndpoint("abcdefg") != null, "e1 exists");	
		var e2 = _jsPlumb.addEndpoint(d2, {uuid:"hijklmn"});
		ok(_jsPlumb.getEndpoint("hijklmn") != null, "e2 exists");
		_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		assertContextSize(3);
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		_jsPlumb.detach({uuids:["abcdefg", "hijklmn"]});
		assertConnectionCount(e1, 0);
		assertConnectionCount(e2, 0);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
		assertContextSize(2);
	});
	
	test(renderMode + ": _jsPlumb.detach (sourceEndpoint and targetEndpoint supplied)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1);
		var e2 = _jsPlumb.addEndpoint(d2);
		_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
		assertContextSize(3);
		assertConnectionCount(e1, 1);
		assertConnectionCount(e2, 1);
		_jsPlumb.detach({ sourceEndpoint:e1, targetEndpoint:e2 });
		assertConnectionCount(e1, 0);
		assertConnectionCount(e2, 0);
		assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
		assertContextSize(2);
	});
	
	test(renderMode + ": _jsPlumb.makeDynamicAnchors (longhand)", function() {
		var anchors = [_jsPlumb.makeAnchor([0.2, 0, 0, -1], null, _jsPlumb), _jsPlumb.makeAnchor([1, 0.2, 1, 0], null, _jsPlumb), 
					   _jsPlumb.makeAnchor([0.8, 1, 0, 1], null, _jsPlumb), _jsPlumb.makeAnchor([0, 0.8, -1, 0], null, _jsPlumb) ];				   				
		var dynamicAnchor = _jsPlumb.makeDynamicAnchor(anchors);
		var a = dynamicAnchor.getAnchors();
		equals(a.length, 4, "Dynamic Anchors has four anchors");
		for (var i = 0; i < a.length; i++)
			ok(a[i].compute.constructor == Function, "anchor " + i + " well formed");
	});
	
	test(renderMode + ": _jsPlumb.makeDynamicAnchors (shorthand)", function() {
		var anchors = [[0.2, 0, 0, -1], [1, 0.2, 1, 0], 
					   [0.8, 1, 0, 1], [0, 0.8, -1, 0] ];				   				
		var dynamicAnchor = _jsPlumb.makeDynamicAnchor(anchors);
		var a = dynamicAnchor.getAnchors();
		equals(a.length, 4, "Dynamic Anchors has four anchors");
		for (var i = 0; i < a.length; i++)
			ok(a[i].compute.constructor == Function, "anchor " + i + " well formed");
	});
	
	test(renderMode + ": Connection.isVisible/setVisible", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c1 = _jsPlumb.connect({source:d1,target:d2});
		equals(true, c1.isVisible(), "Connection is visible after creation.");
		c1.setVisible(false);
		equals(false, c1.isVisible(), "Connection is not visible after calling setVisible(false).");
		equals($(c1.connector.canvas).css("display"), "none");
		c1.setVisible(true);
		equals(true, c1.isVisible(), "Connection is visible after calling setVisible(true).");
		equals($(c1.connector.canvas).css("display"), "block");
	});
	
	test(renderMode + ": Endpoint.isVisible/setVisible basic test (no connections)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1);
		equals(true, e1.isVisible(), "Endpoint is visible after creation.");
		e1.setVisible(false);
		equals(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
		equals($(e1.canvas).css("display"), "none");
		e1.setVisible(true);
		equals(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
		equals($(e1.canvas).css("display"), "block");
	});
	
	test(renderMode + ": Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should track changes in the source, because it has only this connection.)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
		equals(true, e1.isVisible(), "Endpoint is visible after creation.");
		var c1 = _jsPlumb.connect({source:e1, target:e2});
		e1.setVisible(false);
		equals(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
		equals(false, e2.isVisible(), "other Endpoint is not visible either.");
		equals(false, c1.isVisible(), "connection between the two is not visible either.");
		
		e1.setVisible(true);
		equals(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
		equals(true, e2.isVisible(), "other Endpoint is visible too");
		equals(true, c1.isVisible(), "connection between the two is visible too.");
	});
	
	test(renderMode + ": Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should not track changes in the source, because it has another connection.)", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		var e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2, { maxConnections:2 }), e3 = _jsPlumb.addEndpoint(d3);
		equals(true, e1.isVisible(), "Endpoint is visible after creation.");
		var c1 = _jsPlumb.connect({source:e1, target:e2});
		var c2 = _jsPlumb.connect({source:e2, target:e3});
		
		e1.setVisible(false);
		equals(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
		equals(true, e2.isVisible(), "other Endpoint should still be visible.");
		equals(true, e3.isVisible(), "third Endpoint should still be visible.");
		equals(false, c1.isVisible(), "connection between the two is not visible either.");
		equals(true, c2.isVisible(), "other connection is visible.");
		
		e1.setVisible(true);
		equals(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
		equals(true, e2.isVisible(), "other Endpoint is visible too");
		equals(true, c1.isVisible(), "connection between the two is visible too.");
		equals(true, c2.isVisible(), "other connection is visible.");
	});
	
	// tests of the functionality that allows a user to specify that they want elements appended to the document body
	test(renderMode + " _jsPlumb.Defaults.Container, specified with a selector", function() {
		_jsPlumb.Defaults.Container = $("body");
		equals($("#container")[0].childNodes.length, 0, "container has no nodes");
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		equals($("#container")[0].childNodes.length, 2, "container has two div elements");  // the divs we added have been added to the 'container' div.
		// but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
		_jsPlumb.connect({source:d1, target:d2});
		equals($("#container")[0].childNodes.length, 2, "container still has two div elements");
	});
	
	// tests of the functionality that allows a user to specify that they want elements appended to some specific container.
	test(renderMode + " _jsPlumb.Defaults.Container, specified with DOM element", function() {		
		_jsPlumb.Defaults.Container = document.getElementsByTagName("body")[0];
		equals(0, $("#container")[0].childNodes.length);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");		
		equals(2, $("#container")[0].childNodes.length, "two divs added to the container");  // the divs we added have been added to the 'container' div.
		// but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
		var bodyElementCount = $("body")[0].childNodes.length;
		_jsPlumb.connect({source:d1, target:d2});
		equals(2, $("#container")[0].childNodes.length, "still only two children in container; elements were added to the body by _jsPlumb");
		// test to see if 3 elements have been added
		equals(bodyElementCount + 3, $("body")[0].childNodes.length, "3 new elements added to the document body");
	});
	
	test(renderMode + " container specified to connect call, with a selector", function() {
		equals(0, $("#container")[0].childNodes.length);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		equals(2, $("#container")[0].childNodes.length);  // the divs we added have been added to the 'container' div.
		var bodyElementCount = $("body")[0].childNodes.length;
		// but here we tell _jsPlumb to add its elements to the body, so this connect call should not add another few elements to the container:
		_jsPlumb.connect({source:d1, target:d2, container:$("body")});
		equals(2, $("#container")[0].childNodes.length);
		equals(bodyElementCount + 3, $("body")[0].childNodes.length, "3 new elements added to the document body");
	});
	
	test(renderMode + " container specified to connect call, with a string ID", function() {
		equals(0, $("#container")[0].childNodes.length);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		equals(3, $("#container")[0].childNodes.length, "container has divs we added");  // the divs we added have been added to the 'container' div.
		var d3ElementCount = $("#d3")[0].childNodes.length;
		// but here we tell _jsPlumb to add its elements to "d3", so this connect call should not add another few elements to the container:
		_jsPlumb.connect({source:d1, target:d2, container:"d3"});
		equals(3, $("#container")[0].childNodes.length, "container still has only the divs we added");
		equals(d3ElementCount + 3, $("#d3")[0].childNodes.length, "3 new elements added to div d3");
	});	
	
	test(renderMode + " container specified to addEndpoint call, with a selector", function() {
		equals(0, $("#container")[0].childNodes.length);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		equals(2, $("#container")[0].childNodes.length);  // the divs we added have been added to the 'container' div.
		var bodyElementCount = $("body")[0].childNodes.length;
		// but here we tell _jsPlumb to add its elements to the body, so this connect call should not add another few elements to the container:
		_jsPlumb.addEndpoint(d1, {container:$("body")});
		equals(2, $("#container")[0].childNodes.length);
		equals(bodyElementCount + 1, $("body")[0].childNodes.length, "1 new element added to the document body");
	});
	
	test(renderMode + " container specified to addEndpoint call, with a string ID", function() {
		equals(0, $("#container")[0].childNodes.length);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
		equals(3, $("#container")[0].childNodes.length, "container has divs we added");  // the divs we added have been added to the 'container' div.
		var d3ElementCount = $("#d3")[0].childNodes.length;
		// but here we tell _jsPlumb to add its elements to "d3", so this connect call should not add another few elements to the container:
		_jsPlumb.addEndpoint(d1, { container:"d3" });
		equals(3, $("#container")[0].childNodes.length, "container still has only the divs we added");
		equals(d3ElementCount + 1, $("#d3")[0].childNodes.length, "1 new element added to div d3");
	});

    test(renderMode + " detachable defaults to true when connection made between two endpoints", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2),
            c = _jsPlumb.connect({source:e1, target:e2});
        equals(c.isDetachable(), true, "connection not detachable");
    });

    test(renderMode + " connection detachable when target endpoint has connectionsDetachable set to true", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2, {connectionsDetachable:true}),
            c = _jsPlumb.connect({source:e1, target:e2});
        equals(c.isDetachable(), true, "connection detachable because connectionsDetachable was set on target endpoint");
    });

    test(renderMode + " connection detachable when source endpoint has connectionsDetachable set to true", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {connectionsDetachable:true}), e2 = _jsPlumb.addEndpoint(d2),
            c = _jsPlumb.connect({source:e1, target:e2});
        equals(c.isDetachable(), true, "connection detachable because connectionsDetachable was set on source endpoint");
    });
	
	test(renderMode + " Connector has 'type' member set", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		
		var c = _jsPlumb.connect({source:d1, target:d2});
		equals(c.connector.type, "Bezier", "Bezier connector has type set");
		
		var c2 = _jsPlumb.connect({source:d1, target:d2, connector:"Straight"});
		equals(c2.connector.type, "Straight", "Straight connector has type set");
		
		var c3 = _jsPlumb.connect({source:d1, target:d2, connector:"Flowchart"});
		equals(c3.connector.type, "Flowchart", "Flowchart connector has type set");
	});
	
	test(renderMode + " Endpoints have 'type' member set", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		
		var c = _jsPlumb.connect({source:d1, target:d2});
		equals(c.endpoints[0].type, "Dot", "Dot endpoint has type set");
		
		var c2 = _jsPlumb.connect({source:d1, target:d2, endpoints:["Rectangle", "Blank"]});
		equals(c2.endpoints[1].type, "Blank", "Blank endpoint has type set");
		equals(c2.endpoints[0].type, "Rectangle", "Rectangle endpoint has type set");		
	});
	
	test(renderMode + " Overlays have 'type' member set", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		
		var c = _jsPlumb.connect({
			source:d1, 
			target:d2,
			overlays:[ "Arrow", "Label", "PlainArrow", "Diamond" ]
		});
		equals(c.overlays[0].type, "Arrow", "Arrow overlay has type set");
		equals(c.overlays[1].type, "Label", "Label overlay has type set");
		equals(c.overlays[2].type, "PlainArrow", "PlainArrow overlay has type set");
		equals(c.overlays[3].type, "Diamond", "Diamond overlay has type set");		
	});
	
	test(renderMode + " _jsPlumb.hide, original one-arg version", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
		e = { isSource:true, isTarget:true, maxConnections:-1 },
		e1 = _jsPlumb.addEndpoint(d1, e),
		e2 = _jsPlumb.addEndpoint(d2, e),
		c1 = _jsPlumb.connect({source:e1, target:e2});
		
		equals(true, c1.isVisible(), "Connection 1 is visible after creation.");
		equals(true, e1.isVisible(), "endpoint 1 is visible after creation.");
		equals(true, e2.isVisible(), "endpoint 2 is visible after creation.");
		
		_jsPlumb.hide(d1);
		
		equals(false, c1.isVisible(), "Connection 1 is no longer visible.");
		equals(true, e1.isVisible(), "endpoint 1 is still visible.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
		
		_jsPlumb.show(d1);
		
		equals(true, c1.isVisible(), "Connection 1 is visible again.");
	});
	
	test(renderMode + " _jsPlumb.hide, two-arg version, endpoints should also be hidden", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
		e = { isSource:true, isTarget:true, maxConnections:-1 },
		e1 = _jsPlumb.addEndpoint(d1, e),
		e2 = _jsPlumb.addEndpoint(d2, e),
		c1 = _jsPlumb.connect({source:e1, target:e2});
		
		equals(true, c1.isVisible(), "Connection 1 is visible after creation.");
		equals(true, e1.isVisible(), "endpoint 1 is visible after creation.");
		equals(true, e2.isVisible(), "endpoint 2 is visible after creation.");
		
		_jsPlumb.hide("d1", true);
		
		equals(false, c1.isVisible(), "Connection 1 is no longer visible.");
		equals(false, e1.isVisible(), "endpoint 1 is no longer visible.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
		
		_jsPlumb.show(d1);  // now show d1, but do not alter the endpoints. e1 should still be hidden
		
		equals(true, c1.isVisible(), "Connection 1 is visible again.");
		equals(false, e1.isVisible(), "endpoint 1 is no longer visible.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
	});
	
	test(renderMode + " _jsPlumb.show, two-arg version, endpoints should become visible", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
		e = { isSource:true, isTarget:true, maxConnections:-1 },
		e1 = _jsPlumb.addEndpoint(d1, e),
		e2 = _jsPlumb.addEndpoint(d2, e),
		c1 = _jsPlumb.connect({source:e1, target:e2});
				
		_jsPlumb.hide("d1", true);
		
		equals(false, c1.isVisible(), "Connection 1 is no longer visible.");
		equals(false, e1.isVisible(), "endpoint 1 is no longer visible.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
		
		_jsPlumb.show(d1, true);  // now show d1, and alter the endpoints. e1 should be visible.
		
		equals(true, c1.isVisible(), "Connection 1 is visible again.");
		equals(true, e1.isVisible(), "endpoint 1 is visible again.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
	});
	
	test(renderMode + " _jsPlumb.show, two-arg version, endpoints should become visible, but not all connections, because some other endpoints are  not visible.", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
		e = { isSource:true, isTarget:true, maxConnections:-1 },
		e1 = _jsPlumb.addEndpoint(d1, e),
		e11 = _jsPlumb.addEndpoint(d1, e),
		e2 = _jsPlumb.addEndpoint(d2, e),
		e3 = _jsPlumb.addEndpoint(d3, e),
		c1 = _jsPlumb.connect({source:e1, target:e2}),
		c2 = _jsPlumb.connect({source:e11, target:e3});
			
		// we now have d1 connected to both d3 and d2.  we'll hide d1, and everything on d1 should be hidden.
		
		_jsPlumb.hide("d1", true);
		
		equals(false, c1.isVisible(), "connection 1 is no longer visible.");
		equals(false, c2.isVisible(), "connection 2 is no longer visible.");
		equals(false, e1.isVisible(), "endpoint 1 is no longer visible.");
		equals(false, e11.isVisible(), "endpoint 1 is no longer visible.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
		equals(true, e3.isVisible(), "endpoint 3 is still visible.");
		
		// now, we will also hide d3. making d1 visible again should NOT result in c2 becoming visible, because the other endpoint
		// for c2 is e3, which is not visible.
		_jsPlumb.hide(d3, true);
		equals(false, e3.isVisible(), "endpoint 3 is no longer visible.");
		
		_jsPlumb.show(d1, true);  // now show d1, and alter the endpoints. e1 should be visible, c1 should be visible, but c2 should not.
		
		equals(true, c1.isVisible(), "Connection 1 is visible again.");
		equals(false, c2.isVisible(), "Connection 2 is not visible.");
		equals(true, e1.isVisible(), "endpoint 1 is visible again.");
		equals(true, e11.isVisible(), "endpoint 11 is visible again.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
		equals(false, e3.isVisible(), "endpoint 3 is still not visible.");
	});
	
	/*
	test(renderMode + " _jsPlumb.hide, two-arg version, endpoints should also be hidden", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
		e = { isSource:true, isTarget:true, maxConnections:-1 },
		e1 = _jsPlumb.addEndpoint(d1, e),
		e2 = _jsPlumb.addEndpoint(d2, e),
		c1 = _jsPlumb.connect({source:e1, target:e2});
		
		equals(true, c1.isVisible(), "Connection 1 is visible after creation.");
		equals(true, e1.isVisible(), "endpoint 1 is visible after creation.");
		equals(true, e2.isVisible(), "endpoint 2 is visible after creation.");
		
		_jsPlumb.hide("d1", true);
		
		equals(false, c1.isVisible(), "Connection 1 is no longer visible.");
		equals(false, e1.isVisible(), "endpoint 1 is no longer visible.");
		equals(true, e2.isVisible(), "endpoint 2 is still visible.");
	});
	
	/**
	 * test for issue 132: label leaves its element in the DOM after it has been 
	 * removed from a connection. 
	 */
	test(renderMode + " label cleans itself up properly", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1,target:d2, overlays:[
		    [ "Label", {id:"label", cssClass:"foo"}]                                                    		    
		]});
		ok($(".foo").length == 1, "label element exists in DOM");
		c.removeOverlay("label");
		ok($(".foo").length == 0, "label element does not exist in DOM");
	});
	
	test(renderMode + " arrow cleans itself up properly", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1,target:d2, overlays:[
		    [ "Arrow", {id:"arrow"}]                                                    		    
		]});
		ok(c.getOverlay("arrow") != null, "arrow overlay exists");
		c.removeOverlay("arrow");
		ok(c.getOverlay("arrow") == null, "arrow overlay has been removed");
	});
	
	test(renderMode + " label overlay getElement function", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1,target:d2, overlays:[
		    [ "Label", {id:"label"}]                                                    		    
		]});
		ok(c.getOverlay("label").getElement() != null, "label overlay exposes element via getElement method");
	});
	
	test(renderMode + " label overlay provides getLabel and setLabel methods", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1,target:d2, overlays:[
		    [ "Label", {id:"label", label:"foo"}]                                                    		    
		]});
		var o = c.getOverlay("label"), e = o.getElement();
		ok(e.innerHTML == "foo", "label text is set to original value");
		o.setLabel("baz");		
		equals(e.innerHTML, "baz", "label text is set to new value 'baz'");
		equals(o.getLabel(), "baz", "getLabel function works correctly with String");
		// now try functions
		var aFunction = function() { return "aFunction"; };
		o.setLabel(aFunction);
		equals(e.innerHTML, "aFunction", "label text is set to new value from Function");
		equals(o.getLabel(), aFunction, "getLabel function works correctly with Function");
	});
	
	test(renderMode + " parameters object works for Endpoint", function() {
		var d1 = _addDiv("d1"),
		f = function() { alert("FOO!"); },
		e = _jsPlumb.addEndpoint(d1, {
			isSource:true,
			parameters:{
				"string":"param1",
				"int":4,
				"function":f
			}
		});
		ok(e.getParameter("string") === "param1", "getParameter(String) works correctly");
		ok(e.getParameter("int") === 4, "getParameter(int) works correctly");
		ok(e.getParameter("function") == f, "getParameter(Function) works correctly");
	});
	
	test(renderMode + " parameters object works for Connection", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
		f = function() { alert("FOO!"); };
		var c = _jsPlumb.connect({
			source:d1,
			target:d2,
			parameters:{
				"string":"param1",
				"int":4,
				"function":f
			}
		});
		ok(c.getParameter("string") === "param1", "getParameter(String) works correctly");
		ok(c.getParameter("int") === 4, "getParameter(int) works correctly");
		ok(c.getParameter("function") == f, "getParameter(Function) works correctly");
	});
	
	test(renderMode + " parameters set on Endpoints and Connections are all merged, and merged correctly at that.", function() {
		var d1 = _addDiv("d1"),
		d2 = _addDiv("d2"),
		e = _jsPlumb.addEndpoint(d1, {
			isSource:true,
			parameters:{
				"string":"sourceEndpoint",
				"int":0,
				"function":function() { return "sourceEndpoint"; }
			}
		}),
		e2 = _jsPlumb.addEndpoint(d2, {
			isTarget:true,
			parameters:{
				"int":1,
				"function":function() { return "targetEndpoint"; }
			}
		}),
		c = _jsPlumb.connect({source:e, target:e2, parameters:{
			"function":function() { return "connection"; }
		}});
		
		ok(c.getParameter("string") === "sourceEndpoint", "getParameter(String) works correctly");
		ok(c.getParameter("int") === 1, "getParameter(int) works correctly");
		ok(c.getParameter("function")() == "connection", "getParameter(Function) works correctly");		
	});
	
	// anchor manager tests.  a new and more comprehensive way of managing the paint, introduced in 1.3.5
	test(renderMode + " anchorManager registers standard connection", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2");
		var c = _jsPlumb.connect({source:d1, target:d2});
		equals(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1);
		equals(_jsPlumb.anchorManager.getEndpointsFor("d1").length, 1);		
		equals(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1);
		equals(_jsPlumb.anchorManager.getEndpointsFor("d2").length, 1);				
		var c2 = _jsPlumb.connect({source:d1, target:d2});
		equals(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 2);
		equals(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 2);
		equals(_jsPlumb.anchorManager.getEndpointsFor("d1").length, 2);
		equals(_jsPlumb.anchorManager.getEndpointsFor("d2").length, 2);				
	});
	
	// anchor manager tests.  a new and more comprehensive way of managing the paint, introduced in 1.3.5
	test(renderMode + " anchorManager registers dynamic anchor connection, and removes it.", function() {
		var d3 = _addDiv("d3"), d4 = _addDiv("d4");
		var c = _jsPlumb.connect({source:d3, target:d4, anchors:["AutoDefault", "AutoDefault"]});

		equals(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1);
		
		var c2 = _jsPlumb.connect({source:d3, target:d4});
		equals(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 2);
		equals(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 2);		

		equals(_jsPlumb.anchorManager.getEndpointsFor("d3").length, 2);			
		_jsPlumb.detach(c);
		equals(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1);						
	});
	
	// anchor manager tests.  a new and more comprehensive way of managing the paint, introduced in 1.3.5
	test(renderMode + " anchorManager registers continuous anchor connection, and removes it.", function() {
		var d3 = _addDiv("d3"), d4 = _addDiv("d4");
		var c = _jsPlumb.connect({source:d3, target:d4, anchors:["Continuous", "Continuous"]});

		equals(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1);
		equals(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 1);							
	
		_jsPlumb.detach(c);
		equals(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0);		
		equals(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0);	
		
		_jsPlumb.reset();
		equals(_jsPlumb.anchorManager.getEndpointsFor("d4").length, 0);	
	});
	
// ------------- utility functions - math stuff, mostly --------------------------

    var tolerance = 0.00000005, withinTolerance = function(v1, v2, msg) {
        if (Math.abs(v1 - v2) < tolerance) ok(true, msg + "; expected " + v1 + " and got it");
        else {
            ok(false, msg + "; expected " + v1 + " got " + v2);
        }
    };
    test(renderMode + " jsPlumbUtil.gradient, segment 1", function() {
		var p1 = [2,2], p2 = [3,1], m = jsPlumbUtil.gradient(p1,p2);
		equals(m, -1, "gradient calculated correctly for simple case");
	});
	test(renderMode + " jsPlumbUtil.normal, segment 1", function() {
		var p1 = [2,2], p2 = [3,1], m = jsPlumbUtil.normal(p1,p2);
		equals(m, 1, "normal calculated correctly for simple case");
	});
	test(renderMode + " jsPlumbUtil.gradient, segment 2", function() {
		var p1 = [2,2], p2 = [3,3], m = jsPlumbUtil.gradient(p1,p2);
		equals(m, 1, "gradient calculated correctly for simple case");
	});
	test(renderMode + " jsPlumbUtil.normal, segment 2", function() {
		var p1 = [2,2], p2 = [3,3], m = jsPlumbUtil.normal(p1,p2);
		equals(m, -1, "normal calculated correctly for simple case");
	});
    test(renderMode + " jsPlumbUtil.gradient, segment 3", function() {
		var p1 = [2,2], p2 = [1,3], m = jsPlumbUtil.gradient(p1,p2);
		equals(m, -1, "gradient calculated correctly for simple case");
	});
	test(renderMode + " jsPlumbUtil.normal, segment 3", function() {
		var p1 = [2,2], p2 = [1,3], m = jsPlumbUtil.normal(p1,p2);
		equals(m, 1, "normal calculated correctly for simple case");
	});
    test(renderMode + " jsPlumbUtil.gradient, segment 4", function() {
		var p1 = [2,2], p2 = [1,1], m = jsPlumbUtil.gradient(p1,p2);
		equals(m, 1, "gradient calculated correctly for simple case");
	});
	test(renderMode + " jsPlumbUtil.normal, segment 4", function() {
		var p1 = [2,2], p2 = [1,1], m = jsPlumbUtil.normal(p1,p2);
		equals(m, -1, "normal calculated correctly for simple case");
	});
    test(renderMode + "jsPlumbUtil.pointOnLine, segment 1", function() {
       var p1 = {x:2,y:2}, p2={x:3, y:1},
           target = jsPlumbUtil.pointOnLine(p1, p2, Math.sqrt(2));
        withinTolerance(p2.x, target.x, "x is calculated correctly");
        withinTolerance(p2.y, target.y, "y is calculated correctly");
    });
    test(renderMode + "jsPlumbUtil.pointOnLine, segment 2", function() {
       var p1 = {x:2,y:2}, p2={x:3, y:3},
           target = jsPlumbUtil.pointOnLine(p1, p2, Math.sqrt(2));
        withinTolerance(p2.x, target.x, "x is calculated correctly");
        withinTolerance(p2.y, target.y, "y is calculated correctly");
    });
    test(renderMode + "jsPlumbUtil.pointOnLine, segment 3", function() {
       var p1 = {x:2,y:2}, p2={x:1, y:3},
           target = jsPlumbUtil.pointOnLine(p1, p2, Math.sqrt(2));
        withinTolerance(p2.x, target.x, "x is calculated correctly");
        withinTolerance(p2.y, target.y, "y is calculated correctly");
    });
    test(renderMode + "jsPlumbUtil.pointOnLine, segment 4", function() {
       var p1 = {x:2,y:2}, p2={x:1, y:1},
           target = jsPlumbUtil.pointOnLine(p1, p2, Math.sqrt(2));
        withinTolerance(p2.x, target.x, "x is calculated correctly");
        withinTolerance(p2.y, target.y, "y is calculated correctly");
    });
    test(renderMode + "jsPlumbUtil.perpendicularLineTo, segment 1", function() {
        var p1 = {x:2, y:2}, p2={x:3, y:1}, m = jsPlumbUtil.gradient(p1, p2),
            l = jsPlumbUtil.perpendicularLineTo(p1, p2, 2 * Math.sqrt(2));

        withinTolerance(4, l[0].x, "point 1 x is correct");
        withinTolerance(2, l[0].y, "point 1 y is correct");

        withinTolerance(2, l[1].x, "point 2 x is correct");
        withinTolerance(0, l[1].y, "point 2 y is correct");
    });
	test(renderMode + "jsPlumbUtil.perpendicularLineTo, segment 2", function() {
        var p1 = {x:2, y:2}, p2={x:3, y:3}, m = jsPlumbUtil.gradient(p1, p2),
            l = jsPlumbUtil.perpendicularLineTo(p1, p2, 2 * Math.sqrt(2));

        withinTolerance(4, l[0].x, "point 1 x is correct");
        withinTolerance(2, l[0].y, "point 1 y is correct");

        withinTolerance(2, l[1].x, "point 2 x is correct");
        withinTolerance(4, l[1].y, "point 2 y is correct");
    });
    test(renderMode + "jsPlumbUtil.perpendicularLineTo, segment 3", function() {
        var p1 = {x:2, y:2}, p2={x:1, y:3}, m = jsPlumbUtil.gradient(p1, p2),
            l = jsPlumbUtil.perpendicularLineTo(p1, p2, 2 * Math.sqrt(2));

        withinTolerance(2, l[0].x, "point 1 x is correct");
        withinTolerance(4, l[0].y, "point 1 y is correct");

        withinTolerance(0, l[1].x, "point 2 x is correct");
        withinTolerance(2, l[1].y, "point 2 y is correct");
    });
    test(renderMode + "jsPlumbUtil.perpendicularLineTo, segment 4", function() {
        var p1 = {x:2, y:2}, p2={x:1, y:1}, m = jsPlumbUtil.gradient(p1, p2),
            l = jsPlumbUtil.perpendicularLineTo(p1, p2, 2 * Math.sqrt(2));

        withinTolerance(2, l[0].x, "point 1 x is correct");
        withinTolerance(0, l[0].y, "point 1 y is correct");

        withinTolerance(0, l[1].x, "point 2 x is correct");
        withinTolerance(2, l[1].y, "point 2 y is correct");
    });
    test(renderMode + "jsPlumbUtil.intersects, with intersection", function() {
    	var r1 = { x: 2, y:2, w:4, h:6},
    		r2 = { x: 3, y:4, w:3, h:3};

    	ok(jsPlumbUtil.intersects(r1, r2), "r1 and r2 intersect");
    });
    test(renderMode + "jsPlumbUtil.intersects, with no intersection", function() {
    	var r1 = { x: 2, y:2, w:4, h:6},
    		r2 = { x: 13, y:4, w:3, h:3};

    	ok(!jsPlumbUtil.intersects(r1, r2), "r1 and r2 do not intersect");
    });
    test(renderMode + "jsPlumbUtil.intersects, with intersection, equal Y", function() {
    	var r1 = { x: 2, y:2, w:4, h:6},
    		r2 = { x: 1, y:2, w:3, h:6};

    	ok(jsPlumbUtil.intersects(r1, r2), "r1 and r2 intersect");
    });
    test(renderMode + "jsPlumbUtil.intersects, with intersection, equal X", function() {
    	var r1 = { x: 2, y:2, w:4, h:6},
    		r2 = { x: 2, y:1, w:4, h:6};

    	ok(jsPlumbUtil.intersects(r1, r2), "r1 and r2 intersect");
    });
    test(renderMode + "jsPlumbUtil.intersects, identical rectangles", function() {
    	var r1 = { x: 2, y:2, w:4, h:6},
    		r2 = { x: 2, y:2, w:4, h:6};

    	ok(jsPlumbUtil.intersects(r1, r2), "r1 and r2 intersect");
    });
    test(renderMode + "jsPlumbUtil.intersects, corners touch (intersection)", function() {
    	var r1 = { x: 2, y:2, w:4, h:6},
    		r2 = { x: 6, y:8, w:3, h:3};

    	ok(jsPlumbUtil.intersects(r1, r2), "r1 and r2 intersect");
    });
    test(renderMode + "jsPlumbUtil.intersects, one rectangle contained within the other", function() {
    	var r1 = { x: 2, y:2, w:4, h:6},
    		r2 = { x: 0, y:0, w:23, h:23};

    	ok(jsPlumbUtil.intersects(r1, r2), "r1 and r2 intersect");
    });
    test(renderMode + "setImage on Endpoint", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
        originalUrl = "../../img/endpointTest1.png",
        e = {
            endpoint:[ "Image", { src:originalUrl } ]
        },
        ep = _jsPlumb.addEndpoint(d1, e);        
    });
    test(renderMode + "setImage on Endpoint, with supplied onload", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
        e = {
            endpoint:[ "Image", {
                src:"../../img/endpointTest1.png",
                onload:function(imgEp) {
                    equals("../../img/endpointTest1.png", imgEp.img.src);
                    equals(ep.endpoint.canvas.getAttribute("src"), imgEp.img.src);
                }
            } ]
        },
        ep = _jsPlumb.addEndpoint(d1, e);
        ep.setImage("../../img/littledot.png", function(imgEp) {
            equals("../../img/littledot.png", imgEp.img.src);
            equals(ep.endpoint.canvas.getAttribute("src"), imgEp.img.src);
        });
    });
    
    test(renderMode + "attach endpoint to table when desired element was td", function() {
        var table = document.createElement("table"),
            tr = document.createElement("tr"),
            td = document.createElement("td");
        table.appendChild(tr); tr.appendChild(td);
        document.body.appendChild(table);
        var ep = _jsPlumb.addEndpoint(td);
        equals(ep.canvas.parentNode.tagName.toLowerCase(), "table");
    });

// issue 190 - regressions with getInstance.  these tests ensure that generated ids are unique across
// instances.    

    test(renderMode + " id clashes between instances", function() {
    	var d1 = document.createElement("div"),
    		d2 = document.createElement("div"),
    		_jsp2 = jsPlumb.getInstance();
    	
    	document.body.appendChild(d1);
    	document.body.appendChild(d2);

    	_jsPlumb.addEndpoint(d1);
    	_jsp2.addEndpoint(d2);

    	var id1 = d1.getAttribute("id"),
    		id2 = d2.getAttribute("id");

    	var idx = id1.indexOf("_"), idx2 = id1.lastIndexOf("_"), v1 = id1.substring(idx, idx2);
    	var idx3 = id2.indexOf("_"), idx4 = id2.lastIndexOf("_"), v2 = id2.substring(idx3, idx4);

    	ok (v1 != v2, "instance versions are different : " + v1 + " : " + v2);
    });

    test(renderMode + " id clashes between instances", function() {
    	var d1 = document.createElement("div"),
    		d2 = document.createElement("div"),
    		_jsp2 = jsPlumb.getInstance();
    	
    	document.body.appendChild(d1);
    	document.body.appendChild(d2);

    	_jsPlumb.addEndpoint(d1);
    	_jsPlumb.addEndpoint(d2);

    	var id1 = d1.getAttribute("id"),
    		id2 = d2.getAttribute("id");

    	var idx = id1.indexOf("_"), idx2 = id1.lastIndexOf("_"), v1 = id1.substring(idx, idx2);
    	var idx3 = id2.indexOf("_"), idx4 = id2.lastIndexOf("_"), v2 = id2.substring(idx3, idx4);

    	ok (v1 == v2, "instance versions are the same : " + v1 + " : " + v2);
    });

    test(renderMode + " importDefaults", function() {
    	_jsPlumb.Defaults.Anchors = ["LeftMiddle", "RightMiddle"];
    	var d1 = _addDiv("d1"), 
    		d2 = _addDiv(d2), 
    		c = _jsPlumb.connect({source:d1, target:d2}),
    		e = c.endpoints[0];

    	equals(e.anchor.x, 0, "left middle anchor");
    	equals(e.anchor.y, 0.5, "left middle anchor");

    	_jsPlumb.importDefaults({
    		Anchors:["TopLeft", "TopRight"]
    	});

    	var conn = _jsPlumb.connect({source:d1, target:d2}),
    		e1 = conn.endpoints[0], e2 = conn.endpoints[1];
    	
    	equals(e1.anchor.x, 0, "top leftanchor");
    	equals(e2.anchor.y, 0, "top left anchor");
    	equals(e2.anchor.x, 1, "top right anchor");
    	equals(e2.anchor.y, 0, "top right anchor");

    });

    test(renderMode + " restoreDefaults", function() {
    	_jsPlumb.importDefaults({
    		Anchors:["TopLeft", "TopRight"]
    	});

    	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), conn = _jsPlumb.connect({source:d1, target:d2}),
    		e1 = conn.endpoints[0], e2 = conn.endpoints[1];
    	
    	equals(e1.anchor.x, 0, "top leftanchor");
    	equals(e2.anchor.y, 0, "top left anchor");
    	equals(e2.anchor.x, 1, "top right anchor");
    	equals(e2.anchor.y, 0, "top right anchor");

    	_jsPlumb.restoreDefaults();
    	
    	var conn2 = _jsPlumb.connect({source:d1, target:d2}),
    		e3 = conn2.endpoints[0], e4 = conn2.endpoints[1];
    	
    	equals(e3.anchor.x, 0.5, "bottom center anchor");
    	equals(e3.anchor.y, 1, "bottom center anchor");
    	equals(e4.anchor.x, 0.5, "bottom center anchor");
    	equals(e4.anchor.y, 1, "bottom center anchor");    	
    });

// setId function

	test(renderMode + " setId, taking two strings, only default scope", function() {
		_addDiv("d1"); _addDiv("d2");

		_jsPlumb.Defaults.MaxConnections = -1;
		var e1 = _jsPlumb.addEndpoint("d1"),
			e2 = _jsPlumb.addEndpoint("d2"),
			e3 = _jsPlumb.addEndpoint("d1");

		assertEndpointCount("d1", 2, _jsPlumb);
		equals(e1.elementId, "d1", "endpoint has correct element id");
		equals(e3.elementId, "d1", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d1", "anchor has correct element id");
		equals(e3.anchor.elementId, "d1", "anchor has correct element id");

		var c = _jsPlumb.connect({source:e1, target:e2}),
			c2 = _jsPlumb.connect({source:e2, target:e1});

		_jsPlumb.setId("d1", "d3");
		assertEndpointCount("d3", 2, _jsPlumb);		
		assertEndpointCount("d1", 0, _jsPlumb);

		equals(e1.elementId, "d3", "endpoint has correct element id");
		equals(e3.elementId, "d3", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d3", "anchor has correct element id");
		equals(e3.anchor.elementId, "d3", "anchor has correct element id");

		equals(c.sourceId, "d3", "connection's sourceId has changed");
		equals(c.source.attr("id"), "d3", "connection's source has changed");
		equals(c2.targetId, "d3", "connection's targetId has changed");
		equals(c2.target.attr("id"), "d3", "connection's target has changed");
	});   
	
	test(renderMode + " setId, taking a selector and a string, only default scope", function() {
		_addDiv("d1"); _addDiv("d2");

		_jsPlumb.Defaults.MaxConnections = -1;
		var e1 = _jsPlumb.addEndpoint("d1"),
			e2 = _jsPlumb.addEndpoint("d2"),
			e3 = _jsPlumb.addEndpoint("d1");
		
		assertEndpointCount("d1", 2, _jsPlumb);
		equals(e1.elementId, "d1", "endpoint has correct element id");
		equals(e3.elementId, "d1", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d1", "anchor has correct element id");
		equals(e3.anchor.elementId, "d1", "anchor has correct element id");

		var c = _jsPlumb.connect({source:e1, target:e2}),
			c2 = _jsPlumb.connect({source:e2, target:e1});

		_jsPlumb.setId($("#d1"), "d3");
		assertEndpointCount("d3", 2, _jsPlumb);
		assertEndpointCount("d1", 0, _jsPlumb);

		equals(e1.elementId, "d3", "endpoint has correct element id");
		equals(e3.elementId, "d3", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d3", "anchor has correct element id");
		equals(e3.anchor.elementId, "d3", "anchor has correct element id");

		equals(c.sourceId, "d3", "connection's sourceId has changed");
		equals(c.source.attr("id"), "d3", "connection's source has changed");
		equals(c2.targetId, "d3", "connection's targetId has changed");
		equals(c2.target.attr("id"), "d3", "connection's target has changed");
	});   

	test(renderMode + " setId, taking a DOM element and a string, only default scope", function() {
		_addDiv("d1"); _addDiv("d2");

		_jsPlumb.Defaults.MaxConnections = -1;
		var e1 = _jsPlumb.addEndpoint("d1"),
			e2 = _jsPlumb.addEndpoint("d2"),
			e3 = _jsPlumb.addEndpoint("d1");

		assertEndpointCount("d1", 2, _jsPlumb);
		equals(e1.elementId, "d1", "endpoint has correct element id");
		equals(e3.elementId, "d1", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d1", "anchor has correct element id");
		equals(e3.anchor.elementId, "d1", "anchor has correct element id");

		var c = _jsPlumb.connect({source:e1, target:e2}),
			c2 = _jsPlumb.connect({source:e2, target:e1});

		_jsPlumb.setId($("#d1")[0], "d3");
		assertEndpointCount("d3", 2, _jsPlumb);
		assertEndpointCount("d1", 0, _jsPlumb);

		equals(e1.elementId, "d3", "endpoint has correct element id");
		equals(e3.elementId, "d3", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d3", "anchor has correct element id");
		equals(e3.anchor.elementId, "d3", "anchor has correct element id");

		equals(c.sourceId, "d3", "connection's sourceId has changed");
		equals(c.source.attr("id"), "d3", "connection's source has changed");
		equals(c2.targetId, "d3", "connection's targetId has changed");
		equals(c2.target.attr("id"), "d3", "connection's target has changed");
	}); 

	test(renderMode + " setId, taking two strings, mix of scopes", function() {
		_addDiv("d1"); _addDiv("d2");

		_jsPlumb.Defaults.MaxConnections = -1;
		var e1 = _jsPlumb.addEndpoint("d1"),
			e2 = _jsPlumb.addEndpoint("d2"),
			e3 = _jsPlumb.addEndpoint("d1");

		assertEndpointCount("d1", 2, _jsPlumb);
		equals(e1.elementId, "d1", "endpoint has correct element id");
		equals(e3.elementId, "d1", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d1", "anchor has correct element id");
		equals(e3.anchor.elementId, "d1", "anchor has correct element id");

		var c = _jsPlumb.connect({source:e1, target:e2, scope:"FOO"}),
			c2 = _jsPlumb.connect({source:e2, target:e1});

		_jsPlumb.setId("d1", "d3");
		assertEndpointCount("d3", 2, _jsPlumb);
		assertEndpointCount("d1", 0, _jsPlumb);

		equals(e1.elementId, "d3", "endpoint has correct element id");
		equals(e3.elementId, "d3", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d3", "anchor has correct element id");
		equals(e3.anchor.elementId, "d3", "anchor has correct element id");

		equals(c.sourceId, "d3", "connection's sourceId has changed");
		equals(c.source.attr("id"), "d3", "connection's source has changed");
		equals(c2.targetId, "d3", "connection's targetId has changed");
		equals(c2.target.attr("id"), "d3", "connection's target has changed");
	});   
	
	test(renderMode + " setId, taking a selector and a string, mix of scopes", function() {
		_addDiv("d1"); _addDiv("d2");

		_jsPlumb.Defaults.MaxConnections = -1;
		var e1 = _jsPlumb.addEndpoint("d1"),
			e2 = _jsPlumb.addEndpoint("d2"),
			e3 = _jsPlumb.addEndpoint("d1");
		
		assertEndpointCount("d1", 2, _jsPlumb);
		equals(e1.elementId, "d1", "endpoint has correct element id");
		equals(e3.elementId, "d1", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d1", "anchor has correct element id");
		equals(e3.anchor.elementId, "d1", "anchor has correct element id");

		var c = _jsPlumb.connect({source:e1, target:e2, scope:"FOO"}),
			c2 = _jsPlumb.connect({source:e2, target:e1});

		_jsPlumb.setId($("#d1"), "d3");
		assertEndpointCount("d3", 2, _jsPlumb);
		assertEndpointCount("d1", 0, _jsPlumb);

		equals(e1.elementId, "d3", "endpoint has correct element id");
		equals(e3.elementId, "d3", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d3", "anchor has correct element id");
		equals(e3.anchor.elementId, "d3", "anchor has correct element id");

		equals(c.sourceId, "d3", "connection's sourceId has changed");
		equals(c.source.attr("id"), "d3", "connection's source has changed");
		equals(c2.targetId, "d3", "connection's targetId has changed");
		equals(c2.target.attr("id"), "d3", "connection's target has changed");
	});   

	test(renderMode + " setId, taking a DOM element and a string, mix of scopes", function() {
		_addDiv("d1"); _addDiv("d2");

		_jsPlumb.Defaults.MaxConnections = -1;
		var e1 = _jsPlumb.addEndpoint("d1"),
			e2 = _jsPlumb.addEndpoint("d2"),
			e3 = _jsPlumb.addEndpoint("d1");

		assertEndpointCount("d1", 2, _jsPlumb);
		equals(e1.elementId, "d1", "endpoint has correct element id");
		equals(e3.elementId, "d1", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d1", "anchor has correct element id");
		equals(e3.anchor.elementId, "d1", "anchor has correct element id");

		var c = _jsPlumb.connect({source:e1, target:e2, scope:"FOO"}),
			c2 = _jsPlumb.connect({source:e2, target:e1});

		_jsPlumb.setId($("#d1")[0], "d3");
		assertEndpointCount("d3", 2, _jsPlumb);
		assertEndpointCount("d1", 0, _jsPlumb);

		equals(e1.elementId, "d3", "endpoint has correct element id");
		equals(e3.elementId, "d3", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d3", "anchor has correct element id");
		equals(e3.anchor.elementId, "d3", "anchor has correct element id");

		equals(c.sourceId, "d3", "connection's sourceId has changed");
		equals(c.source.attr("id"), "d3", "connection's source has changed");
		equals(c2.targetId, "d3", "connection's targetId has changed");
		equals(c2.target.attr("id"), "d3", "connection's target has changed");
	});

	test(renderMode + " setIdChanged, ", function() {
		_addDiv("d1"); _addDiv("d2");

		_jsPlumb.Defaults.MaxConnections = -1;
		var e1 = _jsPlumb.addEndpoint("d1"),
			e2 = _jsPlumb.addEndpoint("d2"),
			e3 = _jsPlumb.addEndpoint("d1");

		assertEndpointCount("d1", 2, _jsPlumb);
		equals(e1.elementId, "d1", "endpoint has correct element id");
		equals(e3.elementId, "d1", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d1", "anchor has correct element id");
		equals(e3.anchor.elementId, "d1", "anchor has correct element id");

		var c = _jsPlumb.connect({source:e1, target:e2}),
			c2 = _jsPlumb.connect({source:e2, target:e1});

		$("#d1").attr("id", "d3");

		_jsPlumb.setIdChanged("d1", "d3");
		
		assertEndpointCount("d3", 2, _jsPlumb);		
		assertEndpointCount("d1", 0, _jsPlumb);

		equals(e1.elementId, "d3", "endpoint has correct element id");
		equals(e3.elementId, "d3", "endpoint has correct element id");
		equals(e1.anchor.elementId, "d3", "anchor has correct element id");
		equals(e3.anchor.elementId, "d3", "anchor has correct element id");

		equals(c.sourceId, "d3", "connection's sourceId has changed");
		equals(c.source.attr("id"), "d3", "connection's source has changed");
		equals(c2.targetId, "d3", "connection's targetId has changed");
		equals(c2.target.attr("id"), "d3", "connection's target has changed");
	});  

	test(renderMode + " endpoint hide/show should hide/show overlays", function() {
		_addDiv("d1");
		var e1 = _jsPlumb.addEndpoint("d1", {
			overlays:[
				[ "Label", { id:"label", label:"foo" } ]
			]
		}),
		o = e1.getOverlay("label");

		ok(o.isVisible(), "overlay is initially visible");
		_jsPlumb.hide("d1", true);
		ok(!o.isVisible(), "overlay is no longer visible");
	});
    
    test(renderMode + " connection hide/show should hide/show overlays", function() {
		_addDiv("d1");_addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", 
			overlays:[
				[ "Label", { id:"label", label:"foo" } ]
			]
		}),
		o = c.getOverlay("label");

		ok(o.isVisible(), "overlay is initially visible");
		_jsPlumb.hide("d1", true);
		ok(!o.isVisible(), "overlay is no longer visible");
	});

	test(renderMode + " select, basic test", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2"}),
			s = _jsPlumb.select({source:"d1"});

		equals(s.length, 1, "one connection selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, basic test with multiple scopes; dont filter on scope.", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", scope:"FOO"}),
			c2 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAR"}),
			s = _jsPlumb.select({source:"d1"});

		equals(s.length, 2, "two connections selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, basic test with multiple scopes; filter on scope", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", scope:"FOO"}),
			c2 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAR"}),
			s = _jsPlumb.select({source:"d1", scope:"FOO"});

		equals(s.length, 1, "one connection selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, basic test with multiple scopes; filter on scopes", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", scope:"FOO"}),
			c2 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAR"}),
			c3 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAZ"})
			s = _jsPlumb.select({source:"d1", scope:["FOO","BAR"]});

		equals(s.length, 2, "two connections selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, basic test with multiple scopes; scope but no scope filter; single source id", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", scope:"FOO"}),
			c2 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAR"}),
			c3 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAZ"}),
			c4 = _jsPlumb.connect({source:"d2", target:"d1", scope:"BOZ"}),
			s = _jsPlumb.select({source:"d1"});

		equals(s.length, 3, "three connections selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, basic test with multiple scopes; filter on scopes; single source id", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", scope:"FOO"}),
			c2 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAR"}),
			c3 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAZ"}),
			c4 = _jsPlumb.connect({source:"d2", target:"d1", scope:"BOZ"}),
			s = _jsPlumb.select({source:"d1", scope:["FOO","BAR", "BOZ"]});

		equals(s.length, 2, "two connections selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, basic test with multiple scopes; filter on scope; dont supply sourceid", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", scope:"FOO"}),
			c2 = _jsPlumb.connect({source:"d1", target:"d2", scope:"BAR"}),
			s = _jsPlumb.select({ scope:"FOO" });

		equals(s.length, 1, "two connections selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, basic test with multiple scopes; filter on scope; dont supply sourceid", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({source:"d1", target:"d2", scope:"FOO"}),
			c2 = _jsPlumb.connect({source:"d2", target:"d1", scope:"BAR"}),
			s = _jsPlumb.select({ scope:"FOO" });

		equals(s.length, 1, "two connections selected");
		equals(s.get(0).sourceId, "d1", "d1 is connection source");

		s.setHover(true);
		ok(s.get(0).isHover(), "connection has had hover set to true");
		s.setHover(false);
		ok(!(s.get(0).isHover()), "connection has had hover set to false");
	});

	test(renderMode + " select, two connections, with overlays", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({
				source:"d1", 
				target:"d2",
				overlays:[
					["Label", {id:"l"}]
				]
			}),
			c2 = _jsPlumb.connect({
				source:"d1", 
				target:"d2",
				overlays:[
					["Label", {id:"l"}]
				]
			}),
			s = _jsPlumb.select({source:"d1"});
		
		equals(s.length, 2, "two connections selected");
		ok(s.get(0).getOverlay("l") != null, "connection has overlay");
		ok(s.get(1).getOverlay("l") != null, "connection has overlay");
	});

	test(renderMode + " select, chaining with setHover and hideOverlay", function() {
		_addDiv("d1"); _addDiv("d2");
		var c = _jsPlumb.connect({
				source:"d1", 
				target:"d2",
				overlays:[
					["Label", {id:"l"}]
				]
			});
			s = _jsPlumb.select({source:"d1"});
		
		s.setHover(false).hideOverlay("l");

		ok(!(s.get(0).isHover()), "connection is not hover");
		ok(!(s.get(0).getOverlay("l").isVisible()), "overlay is not visible");
	});

	test(renderMode + " select, .each function", function() {
		for (var i = 1; i < 6; i++) {
			_addDiv("d" + i); 	_addDiv("d" + (i * 10));
			_jsPlumb.connect({
				source:"d" + i, 
				target:"d" + (i*10)
			});
		}
				
		var s = _jsPlumb.select();
		equals(s.length, 5, "there are five connections");

		var t = "";
		s.each(function(connection) {
			t += "f";
		});
		equals("fffff", t, ".each is working");
	});

	test(renderMode + " select, multiple connections + chaining", function() {
		for (var i = 1; i < 6; i++) {
			_addDiv("d" + i); 	_addDiv("d" + (i * 10));
			_jsPlumb.connect({
				source:"d" + i, 
				target:"d" + (i*10),
				overlays:[
					["Arrow", {location:0.3}],
					["Arrow", {location:0.7}]
				]
			});
		}
				
		var s = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").setHover(false).setLabel("baz");
		equals(s.length, 5, "there are five connections");

		for (var j = 0; j < 5; j++) {
			equals(s.get(j).getOverlays().length, 1, "one overlay: the label");
			equals(s.get(j).getParameter("foo"), "bar", "parameter foo has value 'bar'");
			ok(!(s.get(j).isHover()), "hover is set to false");
			equals(s.get(j).getLabel(), "baz", "label is set to 'baz'");
		}			
	});

	test(renderMode + " select, simple getter", function() {
		for (var i = 1; i < 6; i++) {
			_addDiv("d" + i); 	_addDiv("d" + (i * 10));
			_jsPlumb.connect({
				source:"d" + i, 
				target:"d" + (i*10),
				label:"FOO"
			});
		}
				
		var lbls = _jsPlumb.select().getLabel();
		equals(lbls.length, 5, "there are five labels");

		for (var j = 0; j < 5; j++) {
			equals(lbls[j][0], "FOO", "label has value 'FOO'");
		}			
	});

	test(renderMode + " select, getter + chaining", function() {
		for (var i = 1; i < 6; i++) {
			_addDiv("d" + i); 	_addDiv("d" + (i * 10));
			_jsPlumb.connect({
				source:"d" + i, 
				target:"d" + (i*10),
				label:"FOO"
			});
		}
				
		var params = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").getParameter("foo");
		equals(params.length, 5, "there are five params");

		for (var j = 0; j < 5; j++) {
			equals(params[j][0], "bar", "parameter has value 'bar'");
		}			
	});


	test(renderMode + " select, detach method", function() {
		for (var i = 1; i < 6; i++) {
			_addDiv("d" + i); 	_addDiv("d" + (i * 10));
			_jsPlumb.connect({
				source:"d" + i, 
				target:"d" + (i*10),
				label:"FOO"
			});
		}
				
		var params = _jsPlumb.select().detach();

		equals(_jsPlumb.select().length, 0, "there are no connections");
	});
	
	test(renderMode + " select, repaint method", function() {
		for (var i = 1; i < 6; i++) {
			_addDiv("d" + i); 	_addDiv("d" + (i * 10));
			_jsPlumb.connect({
				source:"d" + i, 
				target:"d" + (i*10),
				label:"FOO"
			});
		}
				
		var len = _jsPlumb.select().repaint().length;

		equals(len, 5, "there are five connections");
	});	
	
	
	// selectEndpoints
	test(renderMode + " selectEndpoints, basic tests", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1),
			e2 = _jsPlumb.addEndpoint(d1);
			
		equals(_jsPlumb.selectEndpoints().length, 2, "there are two endpoints");
		equals(_jsPlumb.selectEndpoints({element:"d1"}).length, 2, "there are two endpoints on d1");
		equals(_jsPlumb.selectEndpoints({element:"d2"}).length, 0, "there are 0 endpoints on d2");
		
		equals(_jsPlumb.selectEndpoints({source:"d1"}).length, 0, "there are zero source endpoints on d1");
		equals(_jsPlumb.selectEndpoints({target:"d1"}).length, 0, "there are zero target endpoints on d1");		
		equals(_jsPlumb.selectEndpoints({source:"d2"}).length, 0, "there are zero source endpoints on d2");
		equals(_jsPlumb.selectEndpoints({target:"d2"}).length, 0, "there are zero target endpoints on d2");		
		
		equals(_jsPlumb.selectEndpoints({source:"d1", scope:"FOO"}).length, 0, "there are zero source endpoints on d1 with scope FOO");
		
		_jsPlumb.addEndpoint("d2", { scope:"FOO", isSource:true });
		equals(_jsPlumb.selectEndpoints({source:"d2", scope:"FOO"}).length, 1, "there is one source endpoint on d2 with scope FOO");
			
		equals(_jsPlumb.selectEndpoints({element:["d2", "d1"]}).length, 3, "there are three endpoints between d2 and d1");				
	});
	
	test(renderMode + " selectEndpoints, basic tests, various input argument formats", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1),
			e2 = _jsPlumb.addEndpoint(d1);
			
		equals(_jsPlumb.selectEndpoints({element:"d1"}).length, 2, "using id, there are two endpoints on d1");
		equals(_jsPlumb.selectEndpoints({element:d1}).length, 2, "using dom element, there are two endpoints on d1");
		equals(_jsPlumb.selectEndpoints({element:$("#d1")}).length, 2, "using selector, there are two endpoints on d1");
		equals(_jsPlumb.selectEndpoints({element:$(d1)}).length, 2, "using selector with dom element, there are two endpoints on d1");		
		
	});
	
	test(renderMode + " selectEndpoints, basic tests, scope", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {scope:"FOO"}),
			e2 = _jsPlumb.addEndpoint(d1);
			
		equals(_jsPlumb.selectEndpoints({element:"d1"}).length, 2, "using id, there are two endpoints on d1");
		equals(_jsPlumb.selectEndpoints({element:"d1", scope:"FOO"}).length, 1, "using id, there is one endpoint on d1 with scope 'FOO'");		
		_jsPlumb.addEndpoint(d1, {scope:"BAR"}),		
		equals(_jsPlumb.selectEndpoints({element:"d1", scope:"FOO"}).length, 1, "using id, there is one endpoint on d1 with scope 'BAR'");	
		equals(_jsPlumb.selectEndpoints({element:"d1", scope:["BAR", "FOO"]}).length, 2, "using id, there are two endpoints on d1 with scope 'BAR' or 'FOO'");					
	});
	
	test(renderMode + " selectEndpoints, isSource tests", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isSource:true}),
			e2 = _jsPlumb.addEndpoint(d1),
			e3 = _jsPlumb.addEndpoint(d2, {isSource:true});
			
		equals(_jsPlumb.selectEndpoints({source:"d1"}).length, 1, "there is one source endpoint on d1");
		equals(_jsPlumb.selectEndpoints({target:"d1"}).length, 0, "there are zero target endpoints on d1");		
		
		equals(_jsPlumb.selectEndpoints({source:"d2"}).length, 1, "there is one source endpoint on d2");
		
		equals(_jsPlumb.selectEndpoints({source:["d2", "d1"]}).length, 2, "there are two source endpoints between d1 and d2");			
	});
	
	test(renderMode + " selectEndpoints, isTarget tests", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isTarget:true}),
			e2 = _jsPlumb.addEndpoint(d1),
			e3 = _jsPlumb.addEndpoint(d2, {isTarget:true});
			
		equals(_jsPlumb.selectEndpoints({target:"d1"}).length, 1, "there is one target endpoint on d1");
		equals(_jsPlumb.selectEndpoints({source:"d1"}).length, 0, "there are zero source endpoints on d1");		
		
		equals(_jsPlumb.selectEndpoints({target:"d2"}).length, 1, "there is one target endpoint on d2");
		
		equals(_jsPlumb.selectEndpoints({target:["d2", "d1"]}).length, 2, "there are two target endpoints between d1 and d2");			
	});
	
	test(renderMode + " selectEndpoints, isSource + isTarget tests", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true}),
			e2 = _jsPlumb.addEndpoint(d1),
			e3 = _jsPlumb.addEndpoint(d1, {isSource:true}),			
			e4 = _jsPlumb.addEndpoint(d1, {isTarget:true});
			
		equals(_jsPlumb.selectEndpoints({source:"d1"}).length, 2, "there are two source endpoints on d1");
		equals(_jsPlumb.selectEndpoints({target:"d1"}).length, 2, "there are two target endpoints on d1");		
		
		equals(_jsPlumb.selectEndpoints({target:"d1", source:"d1"}).length, 1, "there is one source and target endpoint on d1");	
		
		equals(_jsPlumb.selectEndpoints({element:"d1"}).length, 4, "there are four endpoints on d1");	
		
	});
	
	test(renderMode + " selectEndpoints, delete endpoints", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true});
		
		equals(_jsPlumb.selectEndpoints({element:"d1"}).length, 1, "there is one endpoint on d1");	
		_jsPlumb.selectEndpoints({source:"d1"}).delete();
		equals(_jsPlumb.selectEndpoints({element:"d1"}).length, 0, "there are zero endpoints on d1");						
	});
	
	test(renderMode + " selectEndpoints, detach connections", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true}),
			e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true});			
			
		_jsPlumb.connect({source:e1, target:e2});
		
		equals(e1.connections.length, 1, "there is one connection on d1's endpoint");	
		equals(e2.connections.length, 1, "there is one connection on d2's endpoint");			
		
		_jsPlumb.selectEndpoints({source:"d1"}).detachAll();
		
		equals(e1.connections.length, 0, "there are zero connections on d1's endpoint");	
		equals(e2.connections.length, 0, "there are zero connections on d2's endpoint");			
	});
	
	test(renderMode + " selectEndpoints, hover tests", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true});
			
		equals(e1.isHover(), false, "hover not set");		
		_jsPlumb.selectEndpoints({source:"d1"}).setHover(true);
		equals(e1.isHover(), true, "hover set");		
		_jsPlumb.selectEndpoints({source:"d1"}).setHover(false);
		equals(e1.isHover(), false, "hover no longer set");		
	});
	
	test(renderMode + " selectEndpoints, setEnabled tests", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true});
			
		equals(e1.isEnabled(), true, "endpoint is enabled");		
		_jsPlumb.selectEndpoints({source:"d1"}).setEnabled(false);
		equals(e1.isEnabled(), false, "endpoint not enabled");				
	});
	
	test(renderMode + " selectEndpoints, setEnabled tests", function() {
		var d1 = _addDiv("d1"), _d2 = _addDiv("d2"),
			e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true});
			
		equals(e1.isEnabled(), true, "endpoint is enabled");		
		var e = _jsPlumb.selectEndpoints({source:"d1"}).isEnabled();
		equals(e[0][0], true, "endpoint enabled");
		_jsPlumb.selectEndpoints({source:"d1"}).setEnabled(false);
		e = _jsPlumb.selectEndpoints({source:"d1"}).isEnabled();
		equals(e[0][0], false, "endpoint not enabled");
	});

// setPaintStyle/getPaintStyle tests

	test(renderMode + " setPaintStyle", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), c = _jsPlumb.connect({source:d1, target:d2});
		c.setPaintStyle({strokeStyle:"FOO", lineWidth:999});
		equals(c.paintStyleInUse.strokeStyle, "FOO", "strokeStyle was set");
		equals(c.paintStyleInUse.lineWidth, 999, "lineWidth was set");

		c.setHoverPaintStyle({strokeStyle:"BAZ",  lineWidth:444});
		c.setHover(true);
		equals(c.paintStyleInUse.strokeStyle, "BAZ", "strokeStyle was set");
		equals(c.paintStyleInUse.lineWidth, 444, "lineWidth was set");

		equals(c.getPaintStyle().strokeStyle, "FOO", "getPaintStyle returns correct value");
		equals(c.getHoverPaintStyle().strokeStyle, "BAZ", "getHoverPaintStyle returns correct value");
	});	

// ******************* getEndpoints ************************************************

	test(renderMode + " getEndpoints", function() {
		_addDiv("d1");_addDiv("d2");
		
		_jsPlumb.addEndpoint("d1");
		_jsPlumb.addEndpoint("d2");
		_jsPlumb.addEndpoint("d1");

		var e = _jsPlumb.getEndpoints("d1"),
			e2 = _jsPlumb.getEndpoints("d2");
		equals(e.length, 2, "two endpoints on d1");
		equals(e2.length, 1, "one endpoint on d2");
	});
	
// connection type tests - types, type extension, set types, get types etc.
	test(renderMode + " set connection type on existing connection", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" }
		};
		
		_jsPlumb.registerConnectionType("basic", basicType);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("basic");
		equals(c.getPaintStyle().lineWidth, 4, "paintStyle lineWidth is 4");
		equals(c.getPaintStyle().strokeStyle, "yellow", "paintStyle strokeStyle is yellow");
		equals(c.getHoverPaintStyle().strokeStyle, "blue", "paintStyle strokeStyle is yellow");
		equals(c.getHoverPaintStyle().lineWidth, 4, "hoverPaintStyle linewidth is 6");
	});
	
	test(renderMode + " set connection type on existing connection then change type", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" }
		};
		var otherType = {
			connector:"Bezier",
			paintStyle:{ strokeStyle:"red", lineWidth:14 },
			hoverPaintStyle:{ strokeStyle:"green" }
		};
		
		_jsPlumb.registerConnectionType("basic", basicType);
		_jsPlumb.registerConnectionType("other", otherType);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("basic");
		equals(c.getPaintStyle().lineWidth, 4, "paintStyle lineWidth is 4");
		equals(c.getPaintStyle().strokeStyle, "yellow", "paintStyle strokeStyle is yellow");
		equals(c.getHoverPaintStyle().strokeStyle, "blue", "hoverPaintStyle strokeStyle is blue");
		equals(c.getHoverPaintStyle().lineWidth, 4, "hoverPaintStyle linewidth is 6");
		
		c.setType("other");
		equals(c.getPaintStyle().lineWidth, 14, "paintStyle lineWidth is 14");
		equals(c.getPaintStyle().strokeStyle, "red", "paintStyle strokeStyle is red");
		equals(c.getHoverPaintStyle().strokeStyle, "green", "hoverPaintStyle strokeStyle is green");
		equals(c.getHoverPaintStyle().lineWidth, 14, "hoverPaintStyle linewidth is 14");
	});
	
	test(renderMode + " set connection type on existing connection, overlays should be set", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		};
		
		_jsPlumb.registerConnectionType("basic", basicType);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("basic");
		equals(c.getOverlays().length, 1, "one overlay");
	});
	
	test(renderMode + " set connection type on existing connection, overlays should be removed with second type", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		};		
		var otherType = {
			connector:"Bezier"
		};		
		_jsPlumb.registerConnectionType("basic", basicType);
		_jsPlumb.registerConnectionType("other", otherType);
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("basic");
		equals(c.getOverlays().length, 1, "one overlay");
		c.setType("other");
		equals(c.getOverlays().length, 0, "no overlays");
		equals(c.getPaintStyle().lineWidth, _jsPlumb.Defaults.PaintStyle.lineWidth, "paintStyle lineWidth is default");
	});	
	
	test(renderMode + " set connection type on existing connection, hasType + toggleType", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		};
		
		_jsPlumb.registerConnectionTypes({
			"basic": basicType
		});
		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("basic");
		equals(c.hasType("basic"), true, "connection has 'basic' type");
		c.toggleType("basic");
		equals(c.hasType("basic"), false, "connection does not have 'basic' type");
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		c.toggleType("basic");
		equals(c.hasType("basic"), true, "connection has 'basic' type");
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		equals(c.getOverlays().length, 1, "one overlay");
		
	});
	
	test(renderMode + " set connection type on existing connection, merge tests", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		};
		// this tests all three merge types: connector should overwrite, linewidth should be inserted into
		// basic type's params, and arrow overlay should be added to list to end up with two overlays
		var otherType = {
			connector:"Bezier",
			paintStyle:{ lineWidth:14 },
			overlays:[
				["Arrow", {location:0.25}]
			]
		};		
		_jsPlumb.registerConnectionTypes({
			"basic": basicType,
			"other": otherType
		});
		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("basic");
		equals(c.hasType("basic"), true, "connection has 'basic' type");		
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		equals(c.getPaintStyle().lineWidth, 4, "connection has linewidth 4");
		equals(c.getOverlays().length, 1, "one overlay");
		
		c.addType("other");
		equals(c.hasType("basic"), true, "connection has 'basic' type");
		equals(c.hasType("other"), true, "connection has 'other' type");	
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		equals(c.getPaintStyle().lineWidth, 14, "connection has linewidth 14");
		equals(c.getOverlays().length, 2, "two overlays");
		
		c.removeType("basic");
		equals(c.hasType("basic"), false, "connection does not have 'basic' type");
		equals(c.hasType("other"), true, "connection has 'other' type");	
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		equals(c.getPaintStyle().lineWidth, 14, "connection has linewidth 14");
		equals(c.getOverlays().length, 1, "one overlay");
		
		c.toggleType("other");
		equals(c.hasType("other"), false, "connection does not have 'other' type");
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		equals(c.getPaintStyle().lineWidth, _jsPlumb.Defaults.PaintStyle.lineWidth, "connection has default linewidth");
		equals(c.getOverlays().length, 0, "nooverlays");
	});
	
	test(renderMode + " connection type tests, space separated arguments", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		};
		// this tests all three merge types: connector should overwrite, linewidth should be inserted into
		// basic type's params, and arrow overlay should be added to list to end up with two overlays
		var otherType = {
			connector:"Bezier",
			paintStyle:{ lineWidth:14 },
			overlays:[
				["Arrow", {location:0.25}]
			]
		};		
		_jsPlumb.registerConnectionTypes({
			"basic": basicType,
			"other": otherType
		});
		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("basic other");
		equals(c.hasType("basic"), true, "connection has 'basic' type");
		equals(c.hasType("other"), true, "connection has 'other' type");
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		equals(c.getPaintStyle().lineWidth, 14, "connection has linewidth 14");
		equals(c.getOverlays().length, 2, "two overlays");
		
		c.toggleType("other basic");
		equals(c.hasType("basic"), false, "after toggle, connection does not have 'basic' type");
		equals(c.hasType("other"), false, "after toggle, connection does not have 'other' type");	
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "after toggle, connection has default stroke style");
		equals(c.getPaintStyle().lineWidth, _jsPlumb.Defaults.PaintStyle.lineWidth, "after toggle, connection has default linewidth");
		equals(c.getOverlays().length, 0, "after toggle, no overlays");
		
		c.toggleType("basic other");
		equals(c.hasType("basic"), true, "after toggle again, connection has 'basic' type");
		equals(c.hasType("other"), true, "after toggle again, connection has 'other' type");
		equals(c.getPaintStyle().strokeStyle, "yellow", "after toggle again, connection has yellow stroke style");
		equals(c.getPaintStyle().lineWidth, 14, "after toggle again, connection has linewidth 14");
		equals(c.getOverlays().length, 2, "after toggle again, two overlays");
		
		c.removeType("other basic");
		equals(c.hasType("basic"), false, "after remove, connection does not have 'basic' type");
		equals(c.hasType("other"), false, "after remove, connection does not have 'other' type");	
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "after remove, connection has default stroke style");
		equals(c.getPaintStyle().lineWidth, _jsPlumb.Defaults.PaintStyle.lineWidth, "after remove, connection has default linewidth");
		equals(c.getOverlays().length, 0, "after remove, no overlays");
		
		c.addType("other basic");
		equals(c.hasType("basic"), true, "after add, connection has 'basic' type");
		equals(c.hasType("other"), true, "after add, connection has 'other' type");
		equals(c.getPaintStyle().strokeStyle, "yellow", "after add, connection has yellow stroke style");
		// NOTE here we added the types in the other order to before, so lineWidth 4 - from basic - should win.
		equals(c.getPaintStyle().lineWidth, 4, "after add, connection has linewidth 4");
		equals(c.getOverlays().length, 2, "after add, two overlays");
	});
	
	test(renderMode + " connection type tests, fluid interface", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		};
		// this tests all three merge types: connector should overwrite, linewidth should be inserted into
		// basic type's params, and arrow overlay should be added to list to end up with two overlays
		var otherType = {
			connector:"Bezier",
			paintStyle:{ lineWidth:14 },
			overlays:[
				["Arrow", {location:0.25}]
			]
		};		
		_jsPlumb.registerConnectionTypes({
			"basic": basicType,
			"other": otherType
		});
		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			c = _jsPlumb.connect({source:d1, target:d2}),
			c2 = _jsPlumb.connect({source:d2, target:d3});
			
		_jsPlumb.select().addType("basic");		
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		equals(c2.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		
		_jsPlumb.select().toggleType("basic");
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		equals(c2.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		
		_jsPlumb.select().addType("basic");		
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		equals(c2.getPaintStyle().strokeStyle, "yellow", "connection has yellow stroke style");
		
		_jsPlumb.select().removeType("basic").addType("other");		
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		equals(c2.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		
		
	});
	
	test(renderMode + " connection type tests, two types, check separation", function() {
		var basicType = {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 }
		};
		// this tests all three merge types: connector should overwrite, linewidth should be inserted into
		// basic type's params, and arrow overlay should be added to list to end up with two overlays
		var otherType = {
			paintStyle:{ strokeStyle:"red", lineWidth:14 }
		};		
		_jsPlumb.registerConnectionTypes({
			"basic": basicType,
			"other": otherType
		});
		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			c = _jsPlumb.connect({source:d1, target:d2}),
			c2 = _jsPlumb.connect({source:d2, target:d3});
		c.setType("basic");
			equals(c.getPaintStyle().strokeStyle, "yellow", "first connection has yellow stroke style");
		c2.setType("other");
		
		equals(c.getPaintStyle().strokeStyle, "yellow", "first connection has yellow stroke style");
	
		
	});
	
	test(renderMode + " setType when null", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType(null);		
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");		
		
	});
	
	test(renderMode + " setType to unknown type", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		c.setType("foo");		
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");		
		
	});
	
	test(renderMode + " setType to mix of known and unknown types", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		_jsPlumb.registerConnectionType("basic", {
			connector:"Flowchart",
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		});
			
		c.setType("basic foo");		
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has basic type's stroke style");
		
		c.toggleType("foo");		
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has basic type's stroke style");
		
		c.removeType("basic baz");		
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		
		c.addType("basic foo bar baz");		
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has basic type's stroke style");
		
	});
	
	test(renderMode + " create connection using type parameter", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
			
		_jsPlumb.Defaults.PaintStyle = {strokeStyle:"blue", lineWidth:34};
		
		_jsPlumb.registerConnectionTypes({
			"basic": {
				connector:"Flowchart",
				paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
				hoverPaintStyle:{ strokeStyle:"blue" },
				overlays:[
					"Arrow"
				]
			},
			"other":{
				paintStyle:{ lineWidth:14 }
			}
		});
		
		equals(_jsPlumb.Defaults.PaintStyle.strokeStyle, "blue", "default value has not been messed up");
		
		c = _jsPlumb.connect({source:d1, target:d2});
		equals(c.getPaintStyle().strokeStyle, _jsPlumb.Defaults.PaintStyle.strokeStyle, "connection has default stroke style");
		
		c = _jsPlumb.connect({source:d1, target:d2, type:"basic other"});
		equals(c.getPaintStyle().strokeStyle, "yellow", "connection has basic type's stroke style");
		equals(c.getPaintStyle().lineWidth, 14, "connection has other type's lineWidth");		
				
	});
	
	test(renderMode + " setType, scope", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		_jsPlumb.registerConnectionType("basic", {
			connector:"Flowchart",
			scope:"BANANA",
			detachable:false,
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		});
		
		_jsPlumb.Defaults.ConnectionsDetachable = true;//just make sure we've setup the test correctly.
			
		c.setType("basic");		
		equals(c.scope, "BANANA", "scope is correct");
		equals(c.isDetachable(), false, "not detachable");
		
	});
	
	test(renderMode + " setType, parameters", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");			
			
		_jsPlumb.registerConnectionType("basic", {
			parameters:{
				foo:1,
				bar:2,
				baz:6785962437582
			}
		});
		
		_jsPlumb.registerConnectionType("frank", {			
			parameters:{
				bar:5
			}
		});
		
		// first try creating one with the parameters
		c = _jsPlumb.connect({source:d1, target:d2, type:"basic"});
		
		equals(c.getParameter("foo"), 1, "foo param correct");
		equals(c.getParameter("bar"), 2, "bar param correct");
		
		c.addType("frank");
		equals(c.getParameter("foo"), 1, "foo param correct");
		equals(c.getParameter("bar"), 5, "bar param correct");
	});
	
	test(renderMode + " setType, scope, two types", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			c = _jsPlumb.connect({source:d1, target:d2});
			
		_jsPlumb.registerConnectionType("basic", {
			connector:"Flowchart",
			scope:"BANANA",
			detachable:false,
			paintStyle:{ strokeStyle:"yellow", lineWidth:4 },
			hoverPaintStyle:{ strokeStyle:"blue" },
			overlays:[
				"Arrow"
			]
		});
		
		_jsPlumb.registerConnectionType("frank", {			
			scope:"OVERRIDE",
			detachable:true
		});
		
		_jsPlumb.Defaults.ConnectionsDetachable = true;//just make sure we've setup the test correctly.
			
		c.setType("basic frank");		
		equals(c.scope, "OVERRIDE", "scope is correct");
		equals(c.isDetachable(), true, "detachable");
		
	});
	
	test(renderMode + " create connection from Endpoints - type should be passed through.", function() {
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			e1 = _jsPlumb.addEndpoint(d1, {
				connectionType:"basic"
			}),
			e2 = _jsPlumb.addEndpoint(d2, {
				connectionType:"basic"
			});
			
		_jsPlumb.registerConnectionTypes({
			"basic": {
				connector:"Flowchart",
				paintStyle:{ strokeStyle:"blue", lineWidth:4 },
				hoverPaintStyle:{ strokeStyle:"red" },
				overlays:[
					"Arrow"
				]
			},
			"other":{
				paintStyle:{ lineWidth:14 }
			}
		});	
		
		c = _jsPlumb.connect({source:e1, target:e2});
		equals(c.getPaintStyle().strokeStyle, "blue", "connection has default stroke style");
		equal(c.connector.type, "Flowchart", "connector is flowchart");
	});
	
	test(renderMode + " simple Endpoint type tests.", function() {
		_jsPlumb.registerEndpointType("basic", {
			paintStyle:{fillStyle:"blue"}
		});
		
		var d = _addDiv('d1'), e = _jsPlumb.addEndpoint(d);
		e.setType("basic");
		equals(e.getPaintStyle().fillStyle, "blue", "fill style is correct");
		
		var d2 = _addDiv('d2'), e2 = _jsPlumb.addEndpoint(d2, {type:"basic"});
		equals(e2.getPaintStyle().fillStyle, "blue", "fill style is correct");
	});
	
	test(renderMode + " create connection from Endpoints - with connector settings in Endpoint type.", function() {
			
		_jsPlumb.registerEndpointTypes({
			"basic": {
				connector:"Flowchart",
				connectorOverlays:[
					"Arrow"
				],
				connectorStyle:{strokeStyle:"green" },
				connectorHoverStyle:{lineWidth:534 },
				paintStyle:{ fillStyle:"blue" },
				hoverPaintStyle:{ strokeStyle:"red" },
				overlays:[
					"Arrow"
				]
			},
			"other":{
				paintStyle:{ fillStyle:"red" }
			}
		});
		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			e1 = _jsPlumb.addEndpoint(d1, {
				type:"basic"
			}),
			e2 = _jsPlumb.addEndpoint(d2);
		
		c = _jsPlumb.connect({source:e1, target:e2});
		equals(e1.getPaintStyle().fillStyle, "blue", "endpoint has fill style specified in Endpoint type");
		equals(c.getPaintStyle().strokeStyle, "green", "connection has stroke style specified in Endpoint type");
		equals(c.getHoverPaintStyle().lineWidth, 534, "connection has hover style specified in Endpoint type");
		equals(c.connector.type, "Flowchart", "connector is Flowchart");
		equals(c.overlays.length, 1, "connector has one overlay");
		equals(e1.overlays.length, 1, "endpoint has one overlay");
	});
	
	test(renderMode + " create connection from Endpoints - type should be passed through.", function() {		
			
		_jsPlumb.registerConnectionTypes({
			"basic": {
				connector:"Flowchart",
				paintStyle:{ strokeStyle:"bazona", lineWidth:4 },
				hoverPaintStyle:{ strokeStyle:"red" },
				overlays:[
					"Arrow"
				]
			}
		});
		
		_jsPlumb.registerEndpointType("basic", {
			connectionType:"basic",
			paintStyle:{fillStyle:"GAZOODA"}
		});
		
		var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
			e1 = _jsPlumb.addEndpoint(d1, {
				type:"basic"
			}),
			e2 = _jsPlumb.addEndpoint(d2);
		
		c = _jsPlumb.connect({source:e1, target:e2});
		equals(e1.getPaintStyle().fillStyle, "GAZOODA", "endpoint has correct paint style, from type.");
		equals(c.getPaintStyle().strokeStyle, "bazona", "connection has paint style from connection type, as specified in endpoint type. sweet!");
		equal(c.connector.type, "Flowchart", "connector is flowchart - this also came from connection type as specified by endpoint type.");
	});
	
	test(renderMode + " endpoint type", function() {
		_jsPlumb.registerEndpointTypes({"example": {hoverPaintStyle: null}});	
		//OR
		//jsPlumb.registerEndpointType("example", {hoverPaintStyle: null});

		var d = _addDiv("d");
		_jsPlumb.addEndpoint(d, {type: "example"});
		_jsPlumb.repaint(d);
	});
	
	/*
	 * test the merge function in jsplumb util: it should create an entirely new object
	 */
		test(renderMode + "jsPlumbUtil.merge", function() {
			var a = {
				foo:"a_foo",
				bar:"a_bar",
				nested:{
					foo:"a_foo",
					bar:"a_bar"
				}
			},
			b = {
				foo:"b_foo",
				nested :{
					foo:"b_foo"
				}
			},
			c = jsPlumbUtil.merge(a, b);
			equals(c.foo, "b_foo", "c has b's foo");
			equals(c.nested.foo, "b_foo", "c has b's nested foo");
			// now change c's foo. b should be unchanged.
			c.foo = "c_foo";
			equals(b.foo, "b_foo", "b has b's foo");
			c.nested.foo = "c_foo";
			equals(b.nested.foo, "b_foo", "b has b's nested foo");
			equals(a.nested.foo, "a_foo", "a has a's nested foo");
		});
	
	test(renderMode + "jsPlumbUtil.clone", function() {
		var a = {
			nested:{
				foo:"a_foo"
			}
		},
		b = jsPlumbUtil.clone(a);
		equals(b.nested.foo, "a_foo", "b has a's nested foo");
		equals(a.nested.foo, "a_foo", "a has a's nested foo");
		b.nested.foo="b_foo";
		equals(b.nested.foo, "b_foo", "b has b's nested foo");
		equals(a.nested.foo, "a_foo", "a has a's nested foo");
	});
	
};


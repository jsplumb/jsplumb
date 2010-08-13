module("jsPlumb");

var _getContextNode = function() {
	return $("._jsPlumb_context");
};

var assertContextExists = function() {
	ok(_getContextNode().length == 1, 'context node exists');
};

var assertContextSize = function(elementCount) {
	equals(_getContextNode().children().length, elementCount, 'context has ' + elementCount + ' children');
};

var assertContextEmpty = function() {
	equals(_getContextNode().children.length, 0, 'context empty');
};

var assertEndpointCount = function(elId, count) {
	equals(jsPlumb.getTestHarness().endpointCount(elId), count, elId + " has " + count + (count > 1) ? "endpoints" : "endpoint");
};

var assertConnectionCount = function(endpoint, count) {
	equals(endpoint.connections.length, count, "endpoint has " + count + " connections");
};

var assertConnectionByScopeCount = function(scope, count) {
	equals(jsPlumb.getTestHarness().connectionCount(scope), count, 'Scope ' + scope + " has " + count + (count > 1) ? "connections" : "connection");

};

var _divs = [];
var _addDiv = function(id) {
	var d1 = document.createElement("div");
	document.body.appendChild(d1);
	$(d1).attr("id", id);
	_divs.push(id);
	return d1;
};

var _cleanup = function() {
	for (var i in _divs) {
		$("#" + _divs[i]).remove();
	}	
	_divs.splice(0, _divs.length - 1);
};

test('findIndex method', function() {
	var array = [ 1,2,3, "test", "a string", { 'foo':'bar', 'baz':1 }, { 'ding':'dong' } ];
	equals(jsPlumb.getTestHarness().findIndex(array, 1), 0, "find works for integers");
	equals(jsPlumb.getTestHarness().findIndex(array, "test"), 3, "find works for strings");
	equals(jsPlumb.getTestHarness().findIndex(array, { 'foo':'bar', 'baz':1 }), 5, "find works for objects");
	equals(jsPlumb.getTestHarness().findIndex(array, { 'ding':'dong', 'baz':1 }), -1, "find works properly for objects (objects have different length but some same properties)");
});

test('jsPlumb setup', function() {
	ok(jsPlumb, "loaded");
	ok($.fn.plumb, "plumb function");
	ok($.fn.detach, "detach");
	ok($.fn.detachAll, "detachAll");
	ok($.fn.addEndpoint, "addEndpoint");
	ok($.fn.addEndpoints, "addEndpoints");
});

test('getId', function() {
	var d10 = _addDiv('d10');
	equals(jsPlumb.getTestHarness().getId(d10), "d10");
	_cleanup();
});

test('plumb two divs with default options', function() { 
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	$(d2).plumb({target:"d1"});
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	jsPlumb.detachEverything();
	//assertContextSize(2);  // the two endpoint canvases are still there.
	assertEndpointCount("d1", 1);
	assertEndpointCount("d2", 1);
	jsPlumb.removeAllEndpoints("d1");
	jsPlumb.removeAllEndpoints("d2");
	assertEndpointCount("d1", 0);
	assertEndpointCount("d2", 0);
});

var e;
test('create a simple endpoint', function() {
	e = $("#d1").addEndpoint({});
	ok(e, 'endpoint exists');
	//assertContextSize(1);  
	assertEndpointCount("d1", 1);
});

test('remove the simple endpoint', function() {
	ok(e != null, "endpoint exists");
	assertEndpointCount("d1", 1);
	//assertContextSize(1);
	$("#d1").removeEndpoint(e);	 
	assertEndpointCount("d1", 0);
});

var e2;
test('plumb between two endpoints', function() {
	e = $("#d1").addEndpoint({});
	e2 = $("#d2").addEndpoint({});
	ok(e, 'endpoint e exists');
	ok(e2, 'endpoint e2 exists');
	//assertContextSize(2);  
	assertEndpointCount("d1", 1);
	assertEndpointCount("d2", 1);
	$("#d1").plumb({target:'d2', sourceEndpoint:e, targetEndpoint:e2});
	assertEndpointCount("d1", 1);
	assertEndpointCount("d2", 1);
});

test('draggable silently ignored when jquery ui not present', function() {
	e = $("#d1").addEndpoint({isSource:true});
	ok(e, 'endpoint exists');
});

test('droppable silently ignored when jquery ui not present', function() {
	e = $("#d1").addEndpoint({isTarget:true});
	ok(e, 'endpoint exists');
});

test('defaultEndpointMaxConnections', function() {
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	var e3 = $("#d3").addEndpoint({isSource:true});
	ok(e3.anchor, 'endpoint 3 has an anchor');
	var e4 = $("#d4").addEndpoint({isSource:true});
	assertEndpointCount("d3", 1);
	assertEndpointCount("d4", 1);
	ok(!e3.isFull(), "endpoint 3 is not full.");
	$("#d3").plumb({target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 1);   // we have one connection
	$("#d3").plumb({target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 1);  // should have refused the connection; default max is 1.	
});

test('specifiedEndpointMaxConnections', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var e5 = $("#d5").addEndpoint({isSource:true, maxConnections:3});
	ok(e5.anchor, 'endpoint 5 has an anchor');
	var e6 = $("#d6").addEndpoint({isSource:true, maxConnections:2});  // this one has max TWO
	assertEndpointCount("d5", 1); assertEndpointCount("d6", 1);
	ok(!e5.isFull(), "endpoint 5 is not full.");
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 1);   // we have one connection
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 2);  // two connections
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 2);  // should have refused; max is 2, for d4.
	_cleanup();
});

test('noEndpointMaxConnections', function() {
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	var e3 = $("#d3").addEndpoint({isSource:true, maxConnections:-1});
	var e4 = $("#d4").addEndpoint({isSource:true, maxConnections:-1});
	jsPlumb.connect({sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 1);   // we have one connection
	jsPlumb.connect({sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var e5 = $("#d3").addEndpoint({isSource:true, maxConnections:-1});
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e4});
	assertConnectionCount(e4, 3);  
	_cleanup();
});

test('anchors equal', function() {
	var a1 = jsPlumb.makeAnchor(0, 1, 1, 1);
	var a2 = jsPlumb.makeAnchor(0, 1, 1, 1);
	ok(a1.equals(a2), "anchors are the same");
});

test('anchors equal with offsets', function() {
	var a1 = jsPlumb.makeAnchor(0, 1, 1, 1, 10, 13);
	var a2 = jsPlumb.makeAnchor(0, 1, 1, 1, 10, 13);
	ok(a1.equals(a2), "anchors are the same");
});

test('anchors not equal', function() {
	var a1 = jsPlumb.makeAnchor(0, 1, 0, 1);
	var a2 = jsPlumb.makeAnchor(0, 1, 1, 1);
	ok(!a1.equals(a2), "anchors are different");
});

test('anchor not equal with offsets', function() {
	var a1 = jsPlumb.makeAnchor(0, 1, 1, 1, 10, 13);
	var a2 = jsPlumb.makeAnchor(0, 1, 1, 1);
	ok(!a1.equals(a2), "anchors are different");
});

test('detach plays nice when no target given', function() {
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	jsPlumb.connect({source:d3, target:d4});
	$("#d3").detach();	
});

//TODO make sure you run this test with a single detach call, to ensure that
// single detach calls result in the connection being removed. detachEverything can
// just blow away the connectionsByScope array and recreate it.
test('get connections, simple case (default scope)', function() {
	jsPlumb.detachEverything();
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	jsPlumb.connect({source:d5, target:d6});
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "there is one connection");
});

test('get connections, simple case (default scope); single detach call', function() {
	jsPlumb.detachEverything();
	var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
	jsPlumb.connect({source:d5, target:d6});
	jsPlumb.connect({source:d6, target:d7});
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 2, "there are two connections initially");
	jsPlumb.detach('d5', 'd6');
	c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "after detaching one, there is now one connection.");
});

test('get connections, scope testScope', function() {
	jsPlumb.detachEverything();
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	jsPlumb.connect({source:d5, target:d6, scope:'testScope'});
	var c = jsPlumb.getConnections();  // will get all connections	
	equals(c['testScope'].length, 1, "there is one connection");
	equals(c['testScope'][0].sourceId, 'd5', "the connection's source is d5");
	equals(c['testScope'][0].targetId, 'd6', "the connection's source is d6");
});

test('get connections, filtered by scope', function() {
	jsPlumb.detachEverything();
	var d8 = _addDiv("d8"), d9 = _addDiv("d9"), d10 = _addDiv('d10');
	jsPlumb.connect({source:d8, target:d9, scope:'testScope'});
	jsPlumb.connect({source:d9, target:d10}); // default scope
	var c = jsPlumb.getConnections({scope:'testScope'});  // will get all connections	
	equals(c[jsPlumb.getDefaultScope()], null);
	equals(c['testScope'].length, 1);	
	// now supply a list of scopes
	c = jsPlumb.getConnections({scope:[jsPlumb.getDefaultScope(),'testScope']});  // will get all connections	
	equals(c[jsPlumb.getDefaultScope()].length, 1);
	equals(c['testScope'].length, 1, "there is one connection in 'testScope'");
});

test('get connections, filtered by scope and sourceId', function() {
	jsPlumb.detachEverything();
	var d8 = _addDiv("d8"), d9 = _addDiv("d9"), d10 = _addDiv('d10');
	jsPlumb.connect({source:d8, target:d9, scope:'testScope'});
	jsPlumb.connect({source:d9, target:d8, scope:'testScope'});
	jsPlumb.connect({source:d9, target:d10}); // default scope
	var c = jsPlumb.getConnections({scope:'testScope', source:'d8'});  // will get all connections with sourceId 'd8'	
	equals(c[jsPlumb.getDefaultScope()], null);
	equals(c['testScope'].length, 1, "there is one connection in 'testScope' from d8");	
});

test('get connections, filtered by scope, sourceId and targetId', function() {
	jsPlumb.detachEverything();
	var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
	jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d12, target:d13, scope:'testScope'});
	jsPlumb.connect({source:d11, target:d13, scope:'testScope'});
	var c = jsPlumb.getConnections({scope:'testScope', source:'d11', target:'d13'});  
	equals(c['testScope'].length, 1, "there is one connection from d11 to d13");	
});

test('get connections, filtered by a list of scopes', function() {
	jsPlumb.detachEverything();
	var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
	jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
	jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
	var c = jsPlumb.getConnections({scope:['testScope','testScope3']});  
	equals(c['testScope'].length, 1, 'there is one connection in testScope');
	equals(c['testScope3'].length, 1, 'there is one connection in testScope3');
	equals(c['testScope2'], null, 'there are no connections in testScope2');
});

test('get connections, filtered by a list of scopes and source ids', function() {
	jsPlumb.detachEverything();
	var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
	jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d13, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
	jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
	var c = jsPlumb.getConnections({scope:['testScope','testScope3'], source:['d11']});  
	equals(c['testScope'].length, 1, 'there is one connection in testScope');
	equals(c['testScope3'].length, 1, 'there is one connection in testScope3');
	equals(c['testScope2'], null, 'there are no connections in testScope2');
});

test('get connections, filtered by a list of scopes, source ids and target ids', function() {
	jsPlumb.detachEverything();
	var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13'), d14=_addDiv("d14"), d15=_addDiv("d15");
	jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d13, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d11, target:d14, scope:'testScope'});
	jsPlumb.connect({source:d11, target:d15, scope:'testScope'});
	jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
	jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
	var c = jsPlumb.getConnections({scope:['testScope','testScope3'], source:['d11'], target:['d14', 'd15']});  
	equals(c['testScope'].length, 2, 'there are two connections in testScope');
	equals(c['testScope3'].length, 0, 'there is no connections in testScope3');
	equals(c['testScope2'], null, 'there are no connections in testScope2');
});

test('connect by endpoint', function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = $("#d16").addEndpoint({isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = $("#d17").addEndpoint({isSource:true});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
});


/**
 * leave this test at the bottom!
 */
test('unload test', function() {
	jsPlumb.unload();
	var contextNode = $("._jsPlumb_context");
	ok(contextNode.length == 0, 'context node unloaded');
});



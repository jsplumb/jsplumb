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

var _addDiv = function(id) {
	var d1 = document.createElement("div");
	document.body.appendChild(d1);
	$(d1).attr("id", id);
	return d1;
};

test('findIndex method', function() {
	var array = [ 1,2,3, "test", "a string", { 'foo':'bar', 'baz':1 }, { 'ding':'dong' } ];
	equals(array.findIndex(1), 0, "find works for integers");
	equals(array.findIndex("test"), 3, "find works for strings");
	equals(array.findIndex({ 'foo':'bar', 'baz':1 }), 5, "find works for objects");
	equals(array.findIndex({ 'ding':'dong', 'baz':1 }), -1, "find works properly for objects (objects have different length but some same properties)");
});

test('jsPlumb setup', function() {
	ok(jsPlumb, "loaded");
	ok($.fn.plumb, "plumb function");
	ok($.fn.detach, "detach");
	ok($.fn.detachAll, "detachAll");
	ok($.fn.addEndpoint, "addEndpoint");
	ok($.fn.addEndpoints, "addEndpoints");
});

test('plumb two divs with default options', function() { 
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	$(d2).plumb({target:"d1"});
	assertContextExists();
	jsPlumb.detachEverything();
	assertContextSize(2);  // the two endpoint canvases are still there.
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
	assertContextSize(1);  
	assertEndpointCount("d1", 1);
});

test('remove the simple endpoint', function() {
	ok(e != null, "endpoint exists");
	assertEndpointCount("d1", 1);
	assertContextSize(1);
	$("#d1").removeEndpoint(e);	 
	assertEndpointCount("d1", 0);
});

var e2;
test('plumb between two endpoints', function() {
	e = $("#d1").addEndpoint({});
	e2 = $("#d2").addEndpoint({});
	ok(e, 'endpoint e exists');
	ok(e2, 'endpoint e2 exists');
	assertContextSize(2);  
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
	$("#d5").plumb({target:'d6', sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 1);   // we have one connection
	$("#d5").plumb({target:'d6', sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 2);  // two connections
	$("#d5").plumb({target:'d6', sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 2);  // should have refused; max is 2, for d4.
});

test('noEndpointMaxConnections', function() {
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	var e3 = $("#d3").addEndpoint({isSource:true, maxConnections:-1});
	var e4 = $("#d4").addEndpoint({isSource:true, maxConnections:-1});
	$("#d3").plumb({target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 1);   // we have one connection
	$("#d3").plumb({target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).	
});

/**
 * leave this test at the bottom!
 */
test('unload test', function() {
	jsPlumb.unload();
	var contextNode = $("._jsPlumb_context");
	ok(contextNode.length == 0, 'context node unloaded');

});



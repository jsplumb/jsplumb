
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
	return $(d1);
};

var _cleanup = function() {
	for (var i in _divs) {
		$("#" + _divs[i]).remove();		
	}	
	_divs.splice(0, _divs.length - 1);
	
	jsPlumb.reset();
};

module("jsPlumb", {teardown: _cleanup});

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

test('create a simple endpoint', function() {
	var d1 = _addDiv("d1");
	var e = $("#d1").addEndpoint({});
	ok(e, 'endpoint exists');  
	assertEndpointCount("d1", 1);
});

test('remove the simple endpoint', function() {
	var d1 = _addDiv("d1");
	var ee = $("#d1").addEndpoint({});
	ok(ee != null, "endpoint exists");
	assertEndpointCount("d1", 1);
	//assertContextSize(1);
	$("#d1").removeEndpoint(ee);	 
	assertEndpointCount("d1", 0);
});

test('plumb between two endpoints', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e = $("#d1").addEndpoint({});
	var e2 = $("#d2").addEndpoint({});
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
	var d1 = _addDiv("d1");
	var e = $("#d1").addEndpoint({isSource:true});
	ok(e, 'endpoint exists');
});

test('droppable silently ignored when jquery ui not present', function() {
	var d1 = _addDiv("d1")
	var e = $("#d1").addEndpoint({isTarget:true});
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
	var anEntry = c['testScope'][0];
	ok(anEntry.sourceEndpoint != null, "Source endpoint is set");
	ok(anEntry.targetEndpoint != null, "Target endpoint is set");
	equals(anEntry.source.attr("id"), "d11", "Source is div d11");
	equals(anEntry.target.attr("id"), "d14", "Target is div d14");
});

test('connect by endpoint', function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = $("#d16").addEndpoint({isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = $("#d17").addEndpoint({isSource:true});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
});

test('connection events', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null, returnedParams2 = null;
	jsPlumb.addListener(["jsPlumbConnection", "jsPlumbConnectionDetached"], {
		// signature of the 'interface' method is jsPlumbConnection.  params
		// has source, target, sourceId, targetId, sourceEndpoint, targetEndpoint
		jsPlumbConnection : function(params) {
			returnedParams = $.extend({}, params);
		},
		jsPlumbConnectionDetached : function(params) {
			returnedParams2 = $.extend({}, params);
		}
	});
	jsPlumb.connect({source:d1, target:d2});
	ok(returnedParams != null, "new connection listener event was fired");
	equals(returnedParams.sourceId, "d1", 'sourceid is set');
	equals(returnedParams.targetId, "d2", 'targetid is set');
	equals(returnedParams.source.attr("id"), "d1", 'source is set');
	equals(returnedParams.target.attr("id"), "d2" , 'target is set');
	ok(returnedParams.sourceEndpoint != null, "source endpoint is not null");
	ok(returnedParams.targetEndpoint != null, "target endpoint is not null");
	jsPlumb.detachAll("d1");
	ok(returnedParams2 != null, "removed connection listener event was fired");
});

test('connection events that throw errors', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null, returnedParams2 = null;
	jsPlumb.addListener(["jsPlumbConnection"], {
		// signature of the 'interface' method is jsPlumbConnection.  params
		// has source, target, sourceId, targetId, sourceEndpoint, targetEndpoint
		jsPlumbConnection : function(params) {
			returnedParams = $.extend({}, params);
			throw "oh no!";
		}
	});
	jsPlumb.connect({source:d1, target:d2});
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	jsPlumb.connect({source:d3, target:d4});
	ok(returnedParams != null, "new connection listener event was fired; we threw an error, jsPlumb survived.");
});

test("Endpoint.detachFrom", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = $("#d16").addEndpoint({isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = $("#d17").addEndpoint({isSource:true});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	assertConnectionCount(e16, 1);
	assertConnectionCount(e17, 1);
	e16.detachFrom(e17);
	assertConnectionCount(e16, 0);
	assertConnectionCount(e17, 0);
});

test("Endpoint.detachAll", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); d18 = _addDiv("d18");
	var e16 = $("#d16").addEndpoint({isSource:true,maxConnections:-1});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = $("#d17").addEndpoint({isSource:true});
	var e18 = $("#d18").addEndpoint({isSource:true});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e18});
	assertConnectionCount(e16, 2);
	assertConnectionCount(e17, 1);
	assertConnectionCount(e18, 1);
	e16.detachAll();
	assertConnectionCount(e16, 0);
	assertConnectionCount(e17, 0);
});

test("setting endpoint uuid", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); d18 = _addDiv("d18");
	var e16 = $("#d16").addEndpoint({isSource:true,maxConnections:-1, uuid:uuid});
	equals(e16.getUuid(), uuid, "endpoint's uuid was set correctly");
});

test("getting an Endpoint by uuid", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16");
	var e16 = $("#d16").addEndpoint({isSource:true,maxConnections:-1, uuid:uuid});
	var e = jsPlumb.getEndpoint(uuid);
	equals(e.getUuid(), uuid, "retrieved endpoint by uuid");

});

test("connecting two Endpoints (that have been already added) by UUID", function() {
	var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e1 = jsPlumb.addEndpoint("d16", {isSource:true, maxConnections:-1, uuid:srcEndpointUuid});
	var e2 = jsPlumb.addEndpoint("d17", {isSource:true, maxConnections:-1, uuid:dstEndpointUuid});
	jsPlumb.connect({ uuids:  [ srcEndpointUuid, dstEndpointUuid  ] });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
});


test("connecting two Endpoints (that have not been already added) by UUID", function() {
	var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	jsPlumb.connect({ uuids:  [ srcEndpointUuid, dstEndpointUuid  ], source:d16, target:d17 });
	var e1 = jsPlumb.getEndpoint(srcEndpointUuid);
	ok(e1 != null, "endpoint with src uuid added");
	var e2 = jsPlumb.getEndpoint(dstEndpointUuid);
	ok(e2 != null, "endpoint with target uuid added");
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
});

test("connecting two Endpoints (that have been already added) by endpoint reference", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e1 = jsPlumb.addEndpoint("d16", {isSource:true, maxConnections:-1});
	var e2 = jsPlumb.addEndpoint("d17", {isSource:true, maxConnections:-1});
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
});

// this test is for the original detach function; it should stay working after i mess with it
// a little.
test("original detach method tests", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach("d1", "d2");
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
});

// detach is being made to operate more like connect - by taking one argument with a whole 
// bunch of possible params in it.  if two args are passed in it will continue working
// in the old way.
test("detach method, source and target as element id strings", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({source:"d1", target:"d2"});
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
});

test("detach method, source and target as element objects", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({source:d1, target:d2});
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
});

test("detach method, source and target as endpoint UUIDs", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1, {uuid:"abcdefg"});
	ok(jsPlumb.getEndpoint("abcdefg") != null, "e1 exists");	
	var e2 = jsPlumb.addEndpoint(d2, {uuid:"hijklmn"});
	ok(jsPlumb.getEndpoint("hijklmn") != null, "e2 exists");
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({uuids:["abcdefg", "hijklmn"]});
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
});

test("detach method, sourceEndpoint and targetEndpoint supplied", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
});

/**
 * leave this test at the bottom!
 */
test('unload test', function() {
	jsPlumb.unload();
	var contextNode = $("._jsPlumb_context");
	ok(contextNode.length == 0, 'context node unloaded');
});



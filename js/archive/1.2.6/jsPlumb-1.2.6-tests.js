
var _getContextNode = function() {
	return $("#container");
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

$(document).ready(function() {

module("jsPlumb", {teardown: _cleanup});

// setup the container
var container = document.createElement("div");
container.id = "container";
document.body.appendChild(container);
jsPlumb.Defaults.Container = "container";

test('findIndex method', function() {
	var array = [ 1,2,3, "test", "a string", { 'foo':'bar', 'baz':1 }, { 'ding':'dong' } ];
	equals(jsPlumb.getTestHarness().findIndex(array, 1), 0, "find works for integers");
	equals(jsPlumb.getTestHarness().findIndex(array, "test"), 3, "find works for strings");
	equals(jsPlumb.getTestHarness().findIndex(array, { 'foo':'bar', 'baz':1 }), 5, "find works for objects");
	equals(jsPlumb.getTestHarness().findIndex(array, { 'ding':'dong', 'baz':1 }), -1, "find works properly for objects (objects have different length but some same properties)");
});

test('jsPlumb setup', function() {
	ok(jsPlumb, "loaded");
});

test('getId', function() {
	var d10 = _addDiv('d10');
	equals(jsPlumb.getTestHarness().getId(d10), "d10");
});

test('create a simple endpoint', function() {
	var d1 = _addDiv("d1");
	var e = jsPlumb.addEndpoint($("#d1"), {});
	ok(e, 'endpoint exists');  
	assertEndpointCount("d1", 1);
});

test('create and remove a simple endpoint', function() {
	var d1 = _addDiv("d1");
	var ee = jsPlumb.addEndpoint(d1, {uuid:"78978597593"});
	ok(ee != null, "endpoint exists");
	assertEndpointCount("d1", 1);
	assertContextSize(1); // one Endpoint canvas.
	jsPlumb.removeEndpoint(d1, ee);	 
	assertEndpointCount("d1", 0);
	var e = jsPlumb.getEndpoint("78978597593");
	equals(e, null, "the endpoint has been deleted");
	assertContextSize(0); // no Endpoint canvases.
});

test('draggable silently ignored when jquery ui not present', function() {
	var d1 = _addDiv("d1");
	var e = jsPlumb.addEndpoint(d1, {isSource:true});
	ok(e, 'endpoint exists');
});

test('droppable silently ignored when jquery ui not present', function() {
	var d1 = _addDiv("d1")
	var e = jsPlumb.addEndpoint(d1, {isTarget:true});
	ok(e, 'endpoint exists');
});

test('defaultEndpointMaxConnections', function() {
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	var e3 = jsPlumb.addEndpoint(d3, {isSource:true});
	ok(e3.anchor, 'endpoint 3 has an anchor');
	var e4 = jsPlumb.addEndpoint(d4, {isSource:true});
	assertEndpointCount("d3", 1);
	assertEndpointCount("d4", 1);
	assertContextSize(2);						// one canvas for each of our two endpoints.
	ok(!e3.isFull(), "endpoint 3 is not full.");
	jsPlumb.connect({source:d3, target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 1);   // we have one connection
	jsPlumb.connect({source:d3, target:'d4', sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 1);  // should have refused the connection; default max is 1.
	assertContextSize(3); // now we have one more canvas, for the Connection that was accepted.
});

test('specifiedEndpointMaxConnections', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var e5 = jsPlumb.addEndpoint(d5, {isSource:true, maxConnections:3});
	ok(e5.anchor, 'endpoint 5 has an anchor');
	var e6 = jsPlumb.addEndpoint(d6, {isSource:true, maxConnections:2});  // this one has max TWO
	assertEndpointCount("d5", 1); assertEndpointCount("d6", 1);
	assertContextSize(2);
	ok(!e5.isFull(), "endpoint 5 is not full.");
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 1);   // we have one connection
	assertContextSize(3);
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 2);  // two connections
	assertContextSize(4);
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e6});
	assertConnectionCount(e5, 2);  // should have refused; max is 2, for d4.
	assertContextSize(4);
});

test('noEndpointMaxConnections', function() {
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	var e3 = jsPlumb.addEndpoint(d3, {isSource:true, maxConnections:-1});
	var e4 = jsPlumb.addEndpoint(d4, {isSource:true, maxConnections:-1});
	jsPlumb.connect({sourceEndpoint:e3, targetEndpoint:e4});
	assertContextSize(3);
	assertConnectionCount(e3, 1);   // we have one connection
	jsPlumb.connect({sourceEndpoint:e3, targetEndpoint:e4});
	assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).
	assertContextSize(4);
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var e5 = jsPlumb.addEndpoint(d3, {isSource:true, maxConnections:-1});
	jsPlumb.connect({sourceEndpoint:e5, targetEndpoint:e4});
	assertConnectionCount(e4, 3);
	assertContextSize(6);
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
	jsPlumb.detach();	
});

// issue 81
test('jsPlumb.detach should fire only one detach event (pass Connection as argument)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var conn = jsPlumb.connect({source:d5, target:d6});
	var eventCount = 0;
	jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
	jsPlumb.detach(conn);
	equals(eventCount, 1);
});

// issue 81
test('jsPlumb.detach should fire only one detach event (pass Connection as param in argument)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var conn = jsPlumb.connect({source:d5, target:d6});
	var eventCount = 0;
	jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
	jsPlumb.detach({connection:conn});
	equals(eventCount, 1);
});

// issue 81
test('jsPlumb.detach should fire only one detach event (pass source and targets as strings as arguments in params object)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var conn = jsPlumb.connect({source:d5, target:d6});
	var eventCount = 0;
	jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
	jsPlumb.detach({source:"d5", target:"d6"});
	equals(eventCount, 1);
});

// issue 81
test('jsPlumb.detach should fire only one detach event (pass source and targets as divs as arguments in params object)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var conn = jsPlumb.connect({source:d5, target:d6});
	var eventCount = 0;
	jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
	jsPlumb.detach({source:d5, target:d6});
	equals(eventCount, 1);
});

// issue 81
test('jsPlumb.detach should fire only one detach event (pass source and targets as divs as arguments)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	var conn = jsPlumb.connect({source:d5, target:d6});
	var eventCount = 0;
	jsPlumb.bind("jsPlumbConnectionDetached", function(c) { eventCount++; });
	jsPlumb.detach(d5, d6);
	equals(eventCount, 1);
});

//TODO make sure you run this test with a single detach call, to ensure that
// single detach calls result in the connection being removed. detachEverything can
// just blow away the connectionsByScope array and recreate it.
test('jsPlumb.getConnections (simple case, default scope)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	jsPlumb.connect({source:d5, target:d6});
	assertContextSize(3);
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "there is one connection");
});

test('jsPlumb.getConnections (simple case, default scope; detach by element id)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
	jsPlumb.connect({source:d5, target:d6});
	jsPlumb.connect({source:d6, target:d7});
	assertContextSize(6);
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 2, "there are two connections initially");
	jsPlumb.detach('d5', 'd6');
	c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "after detaching one, there is now one connection.");
	assertContextSize(5);
});

test('jsPlumb.getConnections (simple case, default scope; detach by element id using params object)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
	jsPlumb.connect({source:d5, target:d6});
	jsPlumb.connect({source:d6, target:d7});
	assertContextSize(6);
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 2, "there are two connections initially");
	jsPlumb.detach({source:'d5', target:'d6'});
	c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "after detaching one, there is now one connection.");
	assertContextSize(5);
});

test('jsPlumb.getConnections (simple case, default scope; detach by element object)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
	jsPlumb.connect({source:d5, target:d6});
	jsPlumb.connect({source:d6, target:d7});
	assertContextSize(6);
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 2, "there are two connections initially");
	jsPlumb.detach(d5, d6);
	c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "after detaching one, there is now one connection.");
	assertContextSize(5);
});

test('jsPlumb.getConnections (simple case, default scope; detach by element object using params object)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
	jsPlumb.connect({source:d5, target:d6});
	jsPlumb.connect({source:d6, target:d7});
	assertContextSize(6);
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 2, "there are two connections initially");
	jsPlumb.detach({source:d5, target:d6});
	c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "after detaching one, there is now one connection.");
	assertContextSize(5);
});

test('jsPlumb.getConnections (simple case, default scope; detach by Connection)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
	var c56 = jsPlumb.connect({source:d5, target:d6});
	var c67 = jsPlumb.connect({source:d6, target:d7});
	assertContextSize(6);
	var c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 2, "there are two connections initially");
	jsPlumb.detach(c56);
	assertContextSize(5);		// check that the connection canvas was removed.
	c = jsPlumb.getConnections();  // will get all connections
	equals(c[jsPlumb.getDefaultScope()].length, 1, "after detaching one, there is now one connection.");
	
});

test('jsPlumb.getConnections (scope testScope)', function() {
	var d5 = _addDiv("d5"), d6 = _addDiv("d6");
	jsPlumb.connect({source:d5, target:d6, scope:'testScope'});
	var c = jsPlumb.getConnections();  // will get all connections	
	equals(c['testScope'].length, 1, "there is one connection");
	equals(c['testScope'][0].sourceId, 'd5', "the connection's source is d5");
	equals(c['testScope'][0].targetId, 'd6', "the connection's source is d6");
});

test('jsPlumb.getConnections (filtered by scope)', function() {
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

test('jsPlumb.getConnections (filtered by scope and sourceId)', function() {
	var d8 = _addDiv("d8"), d9 = _addDiv("d9"), d10 = _addDiv('d10');
	jsPlumb.connect({source:d8, target:d9, scope:'testScope'});
	jsPlumb.connect({source:d9, target:d8, scope:'testScope'});
	jsPlumb.connect({source:d9, target:d10}); // default scope
	var c = jsPlumb.getConnections({scope:'testScope', source:'d8'});  // will get all connections with sourceId 'd8'	
	equals(c[jsPlumb.getDefaultScope()], null);
	equals(c['testScope'].length, 1, "there is one connection in 'testScope' from d8");	
});

test('jsPlumb.getConnections (filtered by scope, source id and target id)', function() {
	var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
	jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d12, target:d13, scope:'testScope'});
	jsPlumb.connect({source:d11, target:d13, scope:'testScope'});
	var c = jsPlumb.getConnections({scope:'testScope', source:'d11', target:'d13'});  
	equals(c['testScope'].length, 1, "there is one connection from d11 to d13");	
});

test('jsPlumb.getConnections (filtered by a list of scopes)', function() {
	var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
	jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
	jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
	var c = jsPlumb.getConnections({scope:['testScope','testScope3']});  
	equals(c['testScope'].length, 1, 'there is one connection in testScope');
	equals(c['testScope3'].length, 1, 'there is one connection in testScope3');
	equals(c['testScope2'], null, 'there are no connections in testScope2');
});

test('jsPlumb.getConnections (filtered by a list of scopes and source ids)', function() {
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

test('jsPlumb.getConnections (filtered by a list of scopes, source ids and target ids)', function() {
	jsPlumb.detachEverything();
	var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13'), d14=_addDiv("d14"), d15=_addDiv("d15");
	jsPlumb.connect({source:d11, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d13, target:d12, scope:'testScope'});
	jsPlumb.connect({source:d11, target:d14, scope:'testScope'});
	jsPlumb.connect({source:d11, target:d15, scope:'testScope'});
	jsPlumb.connect({source:d12, target:d13, scope:'testScope2'});
	jsPlumb.connect({source:d11, target:d13, scope:'testScope3'});
	assertContextSize(18);
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

test('connection event listeners', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null/*, returnedParams2 = null*/;
	jsPlumb.bind("jsPlumbConnection", function(params) {
			returnedParams = $.extend({}, params);
	});
	jsPlumb.connect({source:d1, target:d2});
	ok(returnedParams != null, "new connection listener event was fired");
	equals(returnedParams.sourceId, "d1", 'sourceid is set');
	equals(returnedParams.targetId, "d2", 'targetid is set');
	equals(returnedParams.source.attr("id"), "d1", 'source is set');
	equals(returnedParams.target.attr("id"), "d2" , 'target is set');
	ok(returnedParams.sourceEndpoint != null, "source endpoint is not null");
	ok(returnedParams.targetEndpoint != null, "target endpoint is not null");
	//jsPlumb.detachAll("d1");
	//ok(returnedParams2 != null, "removed connection listener event was fired");
});

test('detach event listeners (detach by connection)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
	});
	var conn = jsPlumb.connect({source:d1, target:d2});
	jsPlumb.detach(conn);
	ok(returnedParams != null, "removed connection listener event was fired");
});

test('detach event listeners (detach by element ids)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
	});
	var conn = jsPlumb.connect({source:d1, target:d2});
	jsPlumb.detach("d1","d2");
	ok(returnedParams != null, "removed connection listener event was fired");
});

test('detach event listeners (detach by elements)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
		});
	var conn = jsPlumb.connect({source:d1, target:d2});
	jsPlumb.detach(d1,d2);
	ok(returnedParams != null, "removed connection listener event was fired");
});

test('detach event listeners (via Endpoint.detach method)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1, {});
	var e2 = jsPlumb.addEndpoint(d2, {});
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
		});
	var conn = jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
	assertContextSize(3);
	e1.detach(conn);
	ok(returnedParams != null, "removed connection listener event was fired");
	assertContextSize(2);
});

test('detach event listeners (via Endpoint.detachFrom method)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1, {});
	var e2 = jsPlumb.addEndpoint(d2, {});
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
		});
	jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
	assertContextSize(3);
	e1.detachFrom(e2);
	ok(returnedParams != null, "removed connection listener event was fired");
	assertContextSize(2);
});

test('detach event listeners (via Endpoint.detachAll method)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1, {});
	var e2 = jsPlumb.addEndpoint(d2, {});
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
		});
	jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
	assertContextSize(3);
	e1.detachAll();
	ok(returnedParams != null, "removed connection listener event was fired");
	assertContextSize(2);
});

test('detach event listeners (via jsPlumb.deleteEndpoint method)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1, {});
	var e2 = jsPlumb.addEndpoint(d2, {});
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
		});
	jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2});
	assertContextSize(3);
	jsPlumb.deleteEndpoint(e1);
	ok(returnedParams != null, "removed connection listener event was fired");
	assertContextSize(1);
});

test('detach event listeners (ensure cleared by jsPlumb.reset)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null;
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			returnedParams = $.extend({}, params);
		});
	var conn = jsPlumb.connect({source:d1, target:d2});
	jsPlumb.detach(d1,d2);
	ok(returnedParams != null, "removed connection listener event was fired");
	returnedParams = null;
	
	jsPlumb.reset();
	var conn = jsPlumb.connect({source:d1, target:d2});
	jsPlumb.detach(d1,d2);
	ok(returnedParams == null, "connection listener was cleared by jsPlumb.reset()");
});

test('connection events that throw errors', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var returnedParams = null, returnedParams2 = null;
	jsPlumb.bind("jsPlumbConnection", function(params) {
			returnedParams = $.extend({}, params);
			throw "oh no!";
		});
	jsPlumb.connect({source:d1, target:d2});
	var d3 = _addDiv("d3"), d4 = _addDiv("d4");
	jsPlumb.connect({source:d3, target:d4});
	ok(returnedParams != null, "new connection listener event was fired; we threw an error, jsPlumb survived.");
});

test("Endpoint.detachFrom", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true});
	var conn = jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	assertConnectionCount(e16, 1);
	assertConnectionCount(e17, 1);
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	e16.detachFrom(e17);	
	assertContextSize(2);				// the endpoint canvases should remain
	// but the connection should be gone, meaning not registered by jsPlumb and not registered on either Endpoint:
	assertConnectionCount(e16, 0);
	assertConnectionCount(e17, 0);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);  
});

test("Endpoint.detachFromConnection", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true});
	var conn = jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	assertConnectionCount(e16, 1);
	assertConnectionCount(e17, 1);
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	e16.detachFromConnection(conn);	
	assertContextSize(3);				// all canvases should remain; the connection was not removed.
	// but endpoint e16 should have no connections now.
	assertConnectionCount(e16, 0);
	assertConnectionCount(e17, 1);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);  
});

test("Endpoint.detachAll", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18");
	var e16 = jsPlumb.addEndpoint($("#d16"), {isSource:true,maxConnections:-1});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = jsPlumb.addEndpoint($("#d17"), {isSource:true});
	var e18 = jsPlumb.addEndpoint($("#d18"), {isSource:true});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e18});
	assertConnectionCount(e16, 2);
	assertConnectionCount(e17, 1);
	assertConnectionCount(e18, 1);
	assertContextSize(5);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 2);  
	e16.detachAll();
	assertConnectionCount(e16, 0);
	assertConnectionCount(e17, 0);
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);
});

test("Endpoint.detach", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true});
	var conn = jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	assertConnectionCount(e16, 1);
	assertConnectionCount(e17, 1);
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	e16.detach(conn);	
	assertContextSize(2);				// the endpoint canvases should remain
	// but the connection should be gone, meaning not registered by jsPlumb and not registered on either Endpoint:
	assertConnectionCount(e16, 0);
	assertConnectionCount(e17, 0);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);  
});

test("Endpoint.isConnectedTo", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true});
	var conn = jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	equals(e16.isConnectedTo(e17), true, "e16 and e17 are connected");  
});

test("setting endpoint uuid", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	equals(e16.getUuid(), uuid, "endpoint's uuid was set correctly");
});

test("jsPlumb.getEndpoint (by uuid)", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	var e = jsPlumb.getEndpoint(uuid);
	equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
});

test("jsPlumb.deleteEndpoint (by uuid, simple case)", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	var e = jsPlumb.getEndpoint(uuid);
	equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
	jsPlumb.deleteEndpoint(uuid);
	var f = jsPlumb.getEndpoint(uuid);
	equals(f, null, "endpoint has been deleted");
	var ebe = jsPlumb.getTestHarness().endpointsByElement["d16"];
	equals(ebe.length, 0, "no endpoints registered for element d16 anymore");
	assertContextSize(0);
});

test("jsPlumb.deleteEndpoint (by uuid, connections too)", function() {
	// create two endpoints (one with a uuid), add them to two divs and then connect them.
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	// check that the connection was ok.
	equals(e16.connections.length, 1, "e16 has one connection");
	equals(e17.connections.length, 1, "e17 has one connection");
	assertContextSize(3);
	
	// delete the endpoint that has a uuid.  verify that the endpoint cannot be retrieved and that the connection has been removed, but that
	// element d17 still has its Endpoint.
	jsPlumb.deleteEndpoint(uuid);
	var f = jsPlumb.getEndpoint(uuid);
	equals(f, null, "endpoint has been deleted");
	equals(e16.connections.length, 0, "e16 has no connections");
	equals(e17.connections.length, 0, "e17 has no connections");
	var ebe = jsPlumb.getTestHarness().endpointsByElement["d16"];
	equals(ebe.length, 0, "no endpoints registered for element d16 anymore");
	ebe = jsPlumb.getTestHarness().endpointsByElement["d17"];
	equals(ebe.length, 1, "element d17 still has its Endpoint");
	assertContextSize(1);
	
	// now delete d17's endpoint and check that it has gone.
	jsPlumb.deleteEndpoint(e17);
	f = jsPlumb.getEndpoint(e17);
	equals(f, null, "endpoint has been deleted");
	ebe = jsPlumb.getTestHarness().endpointsByElement["d17"];
	equals(ebe.length, 0, "element d17 no longer has any Endpoints");
	assertContextSize(0);
});

test("jsPlumb.deleteEndpoint (by reference, simple case)", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	var e = jsPlumb.getEndpoint(uuid);
	equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
	jsPlumb.deleteEndpoint(e16);
	var f = jsPlumb.getEndpoint(uuid);
	equals(f, null, "endpoint has been deleted");
	assertContextSize(0);
});

test("jsPlumb.deleteEndpoint (by reference, connections too)", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	equals(e16.connections.length, 1, "e16 has one connection");
	equals(e17.connections.length, 1, "e17 has one connection");
	assertContextSize(3);
	
	jsPlumb.deleteEndpoint(e16);
	var f = jsPlumb.getEndpoint(uuid);
	equals(f, null, "endpoint has been deleted");
	equals(e16.connections.length, 0, "e16 has no connections");
	equals(e17.connections.length, 0, "e17 has no connections");
	assertContextSize(1);
});

test("jsPlumb.deleteEveryEndpoint", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
	assertContextSize(2);
	var e = jsPlumb.getEndpoint(uuid);
	equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
	
	jsPlumb.deleteEveryEndpoint();
	
	var f = jsPlumb.getEndpoint(uuid);
	equals(f, null, "endpoint e16 has been deleted");
	var g = jsPlumb.getEndpoint(e17);
	equals(g, null, "endpoint e17 has been deleted");
	assertContextSize(0);
});

test("jsPlumb.deleteEveryEndpoint (connections too)", function() {
	var uuid = "14785937583175927504313";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true,maxConnections:-1, uuid:uuid});
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true,maxConnections:-1});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	assertContextSize(3);
	var e = jsPlumb.getEndpoint(uuid);
	equals(e.getUuid(), uuid, "retrieved endpoint by uuid");
	
	jsPlumb.deleteEveryEndpoint();
	
	var f = jsPlumb.getEndpoint(uuid);
	equals(f, null, "endpoint e16 has been deleted");
	var g = jsPlumb.getEndpoint(e17);
	equals(g, null, "endpoint e17 has been deleted");
	assertContextSize(0);								// no canvases. so all connection canvases have been cleaned up too.
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);
});

test("jsPlumb.addEndpoint (simple case)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoint(d16, {anchor:[0,0.5,0,-1]});
	var e17 = jsPlumb.addEndpoint(d17, {anchor:"TopCenter"});
	assertContextSize(2);
	equals(e16.anchor.x, 0);
	equals(e16.anchor.y, 0.5);
	equals(e17.anchor.x, 0.5);
	equals(e17.anchor.y, 0);
});

test("jsPlumb.addEndpoint (simple case, dynamic anchors)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoint(d16, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
	var e17 = jsPlumb.addEndpoint(d17, {anchors:["TopCenter", "BottomCenter"]});
	assertContextSize(2);
	equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
	equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
});

test("jsPlumb.addEndpoint (simple case, two arg method)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchor:[0,0.5,0,-1]});
	var e17 = jsPlumb.addEndpoint(d17, {isTarget:true, isSource:false}, {anchor:"TopCenter"});
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


test("jsPlumb.addEndpoints (simple case)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoints(d16, [{isSource:true, isTarget:false, anchor:[0,0.5,0,-1] }, { isTarget:true, isSource:false, anchor:"TopCenter" }]);
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

test("jsPlumb.addEndpoints (with reference params)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var refParams = {anchor:"RightMiddle"};
	var e16 = jsPlumb.addEndpoints(d16, [{isSource:true, isTarget:false}, { isTarget:true, isSource:false }], refParams);
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

test("jsPlumb.addEndpoint (simple case, dynamic anchors, two arg method)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true, isTarget:false}, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
	var e17 = jsPlumb.addEndpoint(d17, {isTarget:true, isSource:false}, {anchors:["TopCenter", "BottomCenter"]});
	assertContextSize(2);
	equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
	equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
});

test('jsPlumb.connect (between two Endpoints)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e = jsPlumb.addEndpoint(d1, {});
	var e2 = jsPlumb.addEndpoint(d2, {});
	ok(e, 'endpoint e exists');
	ok(e2, 'endpoint e2 exists');
	assertContextSize(2);				// should have a canvas for each endpoint now.  
	assertEndpointCount("d1", 1);
	assertEndpointCount("d2", 1);
	jsPlumb.connect({target:'d2', sourceEndpoint:e, targetEndpoint:e2});
	assertEndpointCount("d1", 1);		// no new endpoint should have been added
	assertEndpointCount("d2", 1); 		// no new endpoint should have been added
	assertContextSize(3);				// now we should also have a canvas for the connection.
});

test('jsPlumb.connect (between two Endpoints, and dont supply any parameters to the Endpoints.)', function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	ok(e, 'endpoint e exists');
	ok(e2, 'endpoint e2 exists');
	assertContextSize(2);				// should have a canvas for each endpoint now.  
	assertEndpointCount("d1", 1);
	assertEndpointCount("d2", 1);
	jsPlumb.connect({target:'d2', sourceEndpoint:e, targetEndpoint:e2});
	assertEndpointCount("d1", 1);		// no new endpoint should have been added
	assertEndpointCount("d2", 1); 		// no new endpoint should have been added
	assertContextSize(3);				// now we should also have a canvas for the connection.
});

test('jsPlumb.connect (by endpoint)', function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {isSource:true});
	ok(e16.anchor, 'endpoint 16 has an anchor');
	var e17 = jsPlumb.addEndpoint(d17, {isSource:true});
	jsPlumb.connect({sourceEndpoint:e16, targetEndpoint:e17});
	assertContextSize(3);
});

test("jsPlumb.connect (two Endpoints - that have been already added - by UUID)", function() {
	var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e1 = jsPlumb.addEndpoint("d16", {isSource:true, maxConnections:-1, uuid:srcEndpointUuid});
	var e2 = jsPlumb.addEndpoint("d17", {isSource:true, maxConnections:-1, uuid:dstEndpointUuid});
	jsPlumb.connect({ uuids:  [ srcEndpointUuid, dstEndpointUuid  ] });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	assertContextSize(3);
});

test("jsPlumb.connect (two Endpoints - that have not been already added - by UUID)", function() {
	var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	jsPlumb.connect({ uuids:  [ srcEndpointUuid, dstEndpointUuid  ], source:d16, target:d17 });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	var e1 = jsPlumb.getEndpoint(srcEndpointUuid);
	ok(e1 != null, "endpoint with src uuid added");
	ok(e1.canvas != null);
	var e2 = jsPlumb.getEndpoint(dstEndpointUuid);
	ok(e2 != null, "endpoint with target uuid added");
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
});

test("jsPlumb.connect (two Endpoints - that have been already added - by endpoint reference)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e1 = jsPlumb.addEndpoint("d16", {isSource:true, maxConnections:-1});
	var e2 = jsPlumb.addEndpoint("d17", {isSource:true, maxConnections:-1});
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertContextSize(3);
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
});

test("jsPlumb.connect (two elements)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	jsPlumb.connect({ source:d16, target:d17 });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
});

test("jsPlumb.connect (Connector test, straight)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:"Straight" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
});

test("jsPlumb.connect (Connector test, bezier, no params)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:"Bezier" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Bezier, "Bezier connector chosen for connection");
	equals(conn.connector.majorAnchor, 150, "Bezier connector chose 150 curviness");
});

test("jsPlumb.connect (Connector test, bezier, curviness as int)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:["Bezier", 200] });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Bezier, "Bezier connector chosen for connection");
	equals(conn.connector.majorAnchor, 200, "Bezier connector chose 200 curviness");
});

test("jsPlumb.connect (Connector test, bezier, curviness as named option)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:["Bezier", {curviness:300}] });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Bezier, "Bezier connector chosen for connection");
	equals(conn.connector.majorAnchor, 300, "Bezier connector chose 300 curviness");
});

test("jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:"Straight", anchors:[[0.3,0.3,1,0], [0.7,0.7,0,1]] });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(0.3, conn.endpoints[0].anchor.x, "source anchor x");
	equals(0.3, conn.endpoints[0].anchor.y, "source anchor y");
	equals(0.7, conn.endpoints[1].anchor.x, "target anchor x");
	equals(0.7, conn.endpoints[1].anchor.y, "target anchor y");
});

test("jsPlumb.connect (anchors registered correctly; source and target anchors given, as strings)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:new jsPlumb.Connectors.Straight(), anchors:["LeftMiddle", "RightMiddle"] });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(0, conn.endpoints[0].anchor.x, "source anchor x");
	equals(0.5, conn.endpoints[0].anchor.y, "source anchor y");
	equals(1, conn.endpoints[1].anchor.x, "target anchor x");
	equals(0.5, conn.endpoints[1].anchor.y, "target anchor y");
});

test("jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:"Straight", anchors:[[0.3,0.3,1,0], [0.7,0.7,0,1]] });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(0.3, conn.endpoints[0].anchor.x, "source anchor x");
	equals(0.3, conn.endpoints[0].anchor.y, "source anchor y");
	equals(0.7, conn.endpoints[1].anchor.x, "target anchor x");
	equals(0.7, conn.endpoints[1].anchor.y, "target anchor y");
});


test("jsPlumb.connect (two argument method in which some data is reused across connections)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"), d18 = _addDiv("d18"), d19 = _addDiv("d19");
	var sharedData = { connector:"Straight", anchors:[[0.3,0.3,1,0], [0.7,0.7,0,1]] };
	var conn = jsPlumb.connect({ source:d16, target:d17}, sharedData);
	var conn2 = jsPlumb.connect({ source:d18, target:d19}, sharedData);
	assertContextSize(6);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 2);
	equals(conn.connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(conn2.connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(0.3, conn.endpoints[0].anchor.x, "source anchor x");
	equals(0.3, conn.endpoints[0].anchor.y, "source anchor y");
	equals(0.7, conn.endpoints[1].anchor.x, "target anchor x");
	equals(0.7, conn.endpoints[1].anchor.y, "target anchor y");
	equals(0.3, conn2.endpoints[0].anchor.x, "source anchor x");
	equals(0.3, conn2.endpoints[0].anchor.y, "source anchor y");
	equals(0.7, conn2.endpoints[1].anchor.x, "target anchor x");
	equals(0.7, conn2.endpoints[1].anchor.y, "target anchor y");
});

test("jsPlumb.connect (Connector as string test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, connector:"Straight" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
});

test("jsPlumb.connect (Endpoint test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, endpoint:new jsPlumb.Endpoints.Rectangle() });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints.Rectangle, "Rectangle endpoint chosen for connection source");
	equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints.Rectangle, "Rectangle endpoint chosen for connection target");
});

test("jsPlumb.connect (Endpoint as string test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, endpoint:"Rectangle" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints.Rectangle, "Rectangle endpoint chosen for connection source");
	equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints.Rectangle, "Rectangle endpoint chosen for connection target");
});

test("jsPlumb.connect (Endpoints test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, endpoints:[new jsPlumb.Endpoints.Rectangle(),new jsPlumb.Endpoints.Dot()] });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints.Rectangle, "Rectangle endpoint chosen for connection source");
	equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints.Dot, "Dot endpoint chosen for connection target");
});

test("jsPlumb.connect (Endpoint as string test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var conn = jsPlumb.connect({ source:d16, target:d17, endpoints:["Rectangle", "Dot" ] });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints.Rectangle, "Rectangle endpoint chosen for connection source");
	equals(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints.Dot, "Dot endpoint chosen for connection target");
});

test("jsPlumb.connect (by Endpoints, connector test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoint(d16, {});
	var e17 = jsPlumb.addEndpoint(d17, {});
	var conn = jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:new jsPlumb.Connectors.Straight() });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(e16.connections[0].connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
});

test("jsPlumb.connect (by Endpoints, connector as string test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var e16 = jsPlumb.addEndpoint(d16, {});
	var e17 = jsPlumb.addEndpoint(d17, {});
	var conn = jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(e16.connections[0].connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
});

test("jsPlumb.connect (by Endpoints, anchors as string test)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var a16 = "TopCenter", a17 = "BottomCenter";
	var e16 = jsPlumb.addEndpoint(d16, {anchor:a16});
	var e17 = jsPlumb.addEndpoint(d17, {anchor:a17});
	var conn = jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(e16.connections[0].connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(e16.anchor.x, 0.5, "endpoint 16 is at top center");equals(e16.anchor.y, 0, "endpoint 16 is at top center");
	equals(e17.anchor.x, 0.5, "endpoint 17 is at bottom center");equals(e17.anchor.y, 1, "endpoint 17 is at bottom center");
});

test("jsPlumb.connect (by Endpoints, endpoints create anchors)", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17");
	var a16 = [0,0.5,0,-1], a17 = [1,0.0,-1,-1];
	var e16 = jsPlumb.addEndpoint(d16, {anchor:a16});
	var e17 = jsPlumb.addEndpoint(d17, {anchor:a17});
	var conn = jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(e16.connections[0].connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(e16.anchor.x, a16[0]);equals(e16.anchor.y, a16[1]);
	equals(e17.anchor.x, a17[0]);equals(e17.anchor.y, a17[1]);
	equals(e16.anchor.getOrientation()[0], a16[2]); equals(e16.anchor.getOrientation()[1], a16[3]);
	equals(e17.anchor.getOrientation()[0], a17[2]); equals(e17.anchor.getOrientation()[1], a17[3]);
});

test("jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchor')", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoint(d16, {anchor:[[0,0.5,0,-1], [1,0.5,0,1]]});
	var e17 = jsPlumb.addEndpoint(d17, {anchor:["TopCenter", "BottomCenter"]});
	var conn = jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(e16.connections[0].connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
	equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
});

test("jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchors')", function() {
	var d16 = _addDiv("d16"), d17 = _addDiv("d17"); 
	var e16 = jsPlumb.addEndpoint(d16, {anchors:[[0,0.5,0,-1], [1,0.5,0,1]]});
	var e17 = jsPlumb.addEndpoint(d17, {anchors:["TopCenter", "BottomCenter"]});
	var conn = jsPlumb.connect({ sourceEndpoint:e16, targetEndpoint:e17, connector:"Straight" });
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	equals(e16.connections[0].connector.constructor, jsPlumb.Connectors.Straight, "Straight connector chosen for connection");
	equals(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
	equals(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
});

test("jsPlumb.connect (connect by element, default endpoint, supplied dynamic anchors)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var anchors = [ [0.25, 0, 0, -1], [1, 0.25, 1, 0], [0.75, 1, 0, 1], [0, 0.75, -1, 0] ];
	jsPlumb.connect({source:d1, target:d2, dynamicAnchors:anchors});                // auto connect with default endpoint and provided anchors
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	assertEndpointCount("d1", 1);assertEndpointCount("d2", 1);
	jsPlumb.detach({source:d1, target:d2});
	assertEndpointCount("d1", 1);assertEndpointCount("d2", 1);
	assertContextSize(2);
});

test("jsPlumb.connect (connect by element, supplied endpoint and dynamic anchors)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var endpoint = { isSource:true };
	var e1 = jsPlumb.addEndpoint(d1, endpoint);
	var e2 = jsPlumb.addEndpoint(d2, endpoint);
	var anchors = [ "TopCenter", "BottomCenter" ];
	jsPlumb.connect({sourceEndpoint:e1, targetEndpoint:e2, dynamicAnchors:anchors});
	assertEndpointCount("d1", 1);assertEndpointCount("d2", 1);
	assertContextSize(3);
	jsPlumb.detach({source:d1, target:d2});
	assertEndpointCount("d1", 1);assertEndpointCount("d2", 1);
	assertContextSize(2);
});

test("jsPlumb.connect (connect by element, supplied endpoints using 'source' and 'target' (this test is identical to the one above apart from the param names), and dynamic anchors)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var endpoint = { isSource:true };
	var e1 = jsPlumb.addEndpoint(d1, endpoint);
	var e2 = jsPlumb.addEndpoint(d2, endpoint);
	var anchors = [ "TopCenter", "BottomCenter" ];
	jsPlumb.connect({source:e1, target:e2, dynamicAnchors:anchors});
	assertEndpointCount("d1", 1);assertEndpointCount("d2", 1);
	assertContextSize(3);
	jsPlumb.detach({source:d1, target:d2});
	assertEndpointCount("d1", 1);assertEndpointCount("d2", 1);
	assertContextSize(2);
});


test("jsPlumb.connect (testing for connection event callback)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var connectCallback = null, detachCallback = null;
	jsPlumb.bind("jsPlumbConnection", function(params) {
			connectCallback = $.extend({}, params);
		});
	jsPlumb.bind("jsPlumbConnectionDetached", function(params) {
			detachCallback = $.extend({}, params);
		});
	jsPlumb.connect({source:d1, target:d2});                // auto connect with default endpoint and anchor set
	ok(connectCallback != null, "connect callback was made");
	assertContextSize(3);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	assertEndpointCount("d1", 1);assertEndpointCount("d2", 1);
	jsPlumb.detach({source:d1, target:d2});
	assertContextSize(2);
	ok(detachCallback != null, "detach callback was made");
});

test("jsPlumb.connect (overlays, long-hand version)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var imageEventListener = function() { };
	var arrowSpec = {width:40,length:40,location:0.7, foldback:0, paintStyle:{lineWidth:1, strokeStyle:"#000000"}};
	var connection1 = jsPlumb.connect({
	source:d1, 
   	target:d2, 
   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
   	overlays : [ new jsPlumb.Overlays.Image({src:"../img/littledot.png", events:{"click":imageEventListener("window1", "window2")}}),
				new jsPlumb.Overlays.Label({label:"CONNECTION 1", location:0.3}),
				new jsPlumb.Overlays.Arrow(arrowSpec) ]
	});
	equals(3, connection1.overlays.length);
	equals(jsPlumb.Overlays.Image, connection1.overlays[0].constructor);
	equals(jsPlumb.Overlays.Label, connection1.overlays[1].constructor);
	
	equals(jsPlumb.Overlays.Arrow, connection1.overlays[2].constructor);
	equals(0.7, connection1.overlays[2].loc);
	equals(40, connection1.overlays[2].width);
	equals(40, connection1.overlays[2].length);
});

test("jsPlumb.connect (overlays, short-hand version)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var imageEventListener = function() { };
	var loc = { location:0.7 };
	var arrowSpec = { width:40,length:40, foldback:0, paintStyle:{lineWidth:1, strokeStyle:"#000000"} };
	var connection1 = jsPlumb.connect({
	source:d1, 
   	target:d2, 
   	anchors:["BottomCenter", [ 0.75,0,0,-1 ]], 
   	overlays : [ [ "Image", { src:"../img/littledot.png", events:{"click":imageEventListener("window1", "window2")}} ],
				["Label",  {label:"CONNECTION 1", location:0.3}],
				["Arrow", arrowSpec, loc] ]
	});
	equals(3, connection1.overlays.length);
	equals(jsPlumb.Overlays.Image, connection1.overlays[0].constructor);
	equals(jsPlumb.Overlays.Label, connection1.overlays[1].constructor);
	
	equals(jsPlumb.Overlays.Arrow, connection1.overlays[2].constructor);
	equals(0.7, connection1.overlays[2].loc);
	equals(40, connection1.overlays[2].width);
	equals(40, connection1.overlays[2].length);
});

test("jsPlumb.connect, specify arrow overlay using string identifier only", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var conn = jsPlumb.connect({source:d1,target:d2,overlays:["Arrow"]});
	equals(jsPlumb.Overlays.Arrow, conn.overlays[0].constructor);
});

// this test is for the original detach function; it should stay working after i mess with it
// a little.
test("jsPlumb.detach (by element ids)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	var e3 = jsPlumb.addEndpoint(d1);
	var e4 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	jsPlumb.connect({ sourceEndpoint:e3, targetEndpoint:e4 });  // make two connections to be sure this works ;)
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	assertConnectionCount(e3, 1);
	assertConnectionCount(e4, 1);
	
	jsPlumb.detach("d1", "d2");
	
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
	assertConnectionCount(e3, 0);
	assertConnectionCount(e4, 0);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);
});

// detach is being made to operate more like connect - by taking one argument with a whole 
// bunch of possible params in it.  if two args are passed in it will continue working
// in the old way.
test("jsPlumb.detach (params object, using element ids)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({source:"d1", target:"d2"});
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);
});

test("jsPlumb.detach (params object, using element objects)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	assertContextSize(3);
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({source:d1, target:d2});
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);
	assertContextSize(2);
});

test("jsPlumb.detach (source and target as endpoint UUIDs)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1, {uuid:"abcdefg"});
	ok(jsPlumb.getEndpoint("abcdefg") != null, "e1 exists");	
	var e2 = jsPlumb.addEndpoint(d2, {uuid:"hijklmn"});
	ok(jsPlumb.getEndpoint("hijklmn") != null, "e2 exists");
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	assertContextSize(3);
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({uuids:["abcdefg", "hijklmn"]});
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);
	assertContextSize(2);
});

test("jsPlumb.detach (sourceEndpoint and targetEndpoint supplied)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	var e2 = jsPlumb.addEndpoint(d2);
	jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 1);
	assertContextSize(3);
	assertConnectionCount(e1, 1);
	assertConnectionCount(e2, 1);
	jsPlumb.detach({ sourceEndpoint:e1, targetEndpoint:e2 });
	assertConnectionCount(e1, 0);
	assertConnectionCount(e2, 0);
	assertConnectionByScopeCount(jsPlumb.getDefaultScope(), 0);
	assertContextSize(2);
});

test("jsPlumb.makeDynamicAnchors (longhand)", function() {
	var anchors = [jsPlumb.makeAnchor(0.2, 0, 0, -1), jsPlumb.makeAnchor(1, 0.2, 1, 0), 
				   jsPlumb.makeAnchor(0.8, 1, 0, 1), jsPlumb.makeAnchor(0, 0.8, -1, 0) ];				   				
	var dynamicAnchor = jsPlumb.makeDynamicAnchor(anchors);
	var a = dynamicAnchor.getAnchors();
	equals(a.length, 4, "Dynamic Anchors has four anchors");
	for (var i = 0; i < a.length; i++)
		ok(a[i].compute.constructor == Function, "anchor " + i + " well formed");
});

test("jsPlumb.makeDynamicAnchors (shorthand)", function() {
	var anchors = [[0.2, 0, 0, -1], [1, 0.2, 1, 0], 
				   [0.8, 1, 0, 1], [0, 0.8, -1, 0] ];				   				
	var dynamicAnchor = jsPlumb.makeDynamicAnchor(anchors);
	var a = dynamicAnchor.getAnchors();
	equals(a.length, 4, "Dynamic Anchors has four anchors");
	for (var i = 0; i < a.length; i++)
		ok(a[i].compute.constructor == Function, "anchor " + i + " well formed");
});

test("Connection.isVisible/setVisible", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var c1 = jsPlumb.connect({source:d1,target:d2});
	equals(true, c1.isVisible(), "Connection is visible after creation.");
	c1.setVisible(false);
	equals(false, c1.isVisible(), "Connection is not visible after calling setVisible(false).");
	equals($(c1.canvas).css("display"), "none");
	c1.setVisible(true);
	equals(true, c1.isVisible(), "Connection is visible after calling setVisible(true).");
	equals($(c1.canvas).css("display"), "block");
});

test("Endpoint.isVisible/setVisible basic test (no connections)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1);
	equals(true, e1.isVisible(), "Endpoint is visible after creation.");
	e1.setVisible(false);
	equals(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
	equals($(e1.canvas).css("display"), "none");
	e1.setVisible(true);
	equals(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
	equals($(e1.canvas).css("display"), "block");
});

test("Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should track changes in the source, because it has only this connection.)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2");
	var e1 = jsPlumb.addEndpoint(d1), e2 = jsPlumb.addEndpoint(d2);
	equals(true, e1.isVisible(), "Endpoint is visible after creation.");
	var c1 = jsPlumb.connect({source:e1, target:e2});
	e1.setVisible(false);
	equals(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
	equals(false, e2.isVisible(), "other Endpoint is not visible either.");
	equals(false, c1.isVisible(), "connection between the two is not visible either.");
	
	e1.setVisible(true);
	equals(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
	equals(true, e2.isVisible(), "other Endpoint is visible too");
	equals(true, c1.isVisible(), "connection between the two is visible too.");
});

test("Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should not track changes in the source, because it has another connection.)", function() {
	var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
	var e1 = jsPlumb.addEndpoint(d1), e2 = jsPlumb.addEndpoint(d2, { maxConnections:2 }), e3 = jsPlumb.addEndpoint(d3);
	equals(true, e1.isVisible(), "Endpoint is visible after creation.");
	var c1 = jsPlumb.connect({source:e1, target:e2});
	var c2 = jsPlumb.connect({source:e2, target:e3});
	
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


/**
 * leave this test at the bottom!
 */
test('unload test', function() {
	jsPlumb.unload();
	var contextNode = $("._jsPlumb_context");
	ok(contextNode.length == 0, 'context node unloaded');
});


});

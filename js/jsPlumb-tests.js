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

var _addDiv = function(id) {
	var d1 = document.createElement("div");
	document.body.appendChild(d1);
	$(d1).attr("id", id);
	return d1;
};

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
});

var e;
test('create a simple endpoint', function() {
	e = $("#d1").addEndpoint({});
	ok(e, 'endpoint exists');
	assertContextSize(3);  // three endpoints now.
});

test('remove the simple endpoint', function() {
	$("#d1").removeEndpoint(e);
	assertContextSize(2);  // two endpoints now.
});

test('draggable silently ignored when jquery ui not present', function() {
	e = $("#d1").addEndpoint({isSource:true});
	ok(e, 'endpoint exists');
});

test('droppable silently ignored when jquery ui not present', function() {
	e = $("#d1").addEndpoint({isTarget:true});
	ok(e, 'endpoint exists');
});

/**
 * leave this test at the bottom!
 *
test('unload test', function() {
	jsPlumb.unload();
	var contextNode = $("._jsPlumb_context");
	ok(contextNode.length == 0, 'context node unloaded');

});*/



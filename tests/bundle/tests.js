// _jsPlumb qunit tests.

QUnit.config.reorder = false;

/**
 * @name Test
 * @class
 */

var _divs = [];
var _addDiv = function (id, parent, className, x, y, w, h) {
    var d1 = document.createElement("div");
    d1.style.position = "absolute";
    d1.innerHTML = id;
    if (parent) parent.appendChild(d1); else _jsPlumb.getContainer().appendChild(d1);
    d1.setAttribute("id", id);
    d1.style.left = (x != null ? x : (Math.floor(Math.random() * 1000))) + "px";
    d1.style.top = (y!= null ? y : (Math.floor(Math.random() * 1000))) + "px";
    if (className) d1.className = className;
    if (w) d1.style.width = w + "px";
    if (h) d1.style.height = h + "px";
    _divs.push(id);
    return d1;
};

var _length = function(obj) {
    var c = 0;
    for (var i in obj) if (obj.hasOwnProperty(i)) c++;
    return c;
};

var _head = function(obj) {
    for (var i in obj)
        return obj[i];
};

var assertConnectionCount = function (endpoint, count) {
    equal(endpoint.connections.length, count, "endpoint has " + count + " connections");
};

var assertConnectionByScopeCount = function (scope, count, _jsPlumb) {
    equal(_jsPlumb.select({scope: scope}).length, count, 'Scope ' + scope + " has " + count + (count > 1) ? "connections" : "connection");
};

var defaults = null, support, _jsPlumb, container;

var makeContainer = function() {
    container = document.createElement("div")
    document.documentElement.appendChild(container)
    container.style.position = "relative"
    container.style.overflow = "hidden"
    container.style.width="500px"
    container.style.height="500px"
    container.style.outline = "1px solid"
}

var removeContainer = function() {
    container && container.parentNode && container.parentNode.removeChild(container)
}

var isHover = function(connection) {
    return _jsPlumb.hasClass(connection.connector.canvas, "jtk-hover");
}

var consoleOutput = null
function withConsole(fn) {
    var c = console.log
    console.log = function(msg) {
        consoleOutput = msg.message
    }
    fn()
    console.log = c
}

var testSuite = function () {

    module("jsPlumb", {
        teardown: function () {
            for (var i in _divs) {
                var d = document.getElementById(_divs[i]);
                d && d.parentNode.removeChild(d);
            }
            _divs.length = 0;
            removeContainer()
        },
        setup: function () {
            consoleOutput = null
            makeContainer()
            _jsPlumb = jsPlumbBrowserUI.newInstance({container:container});
            defaults = jsPlumbBrowserUI.extend({}, _jsPlumb.defaults);
        }
    });


    test(': _jsPlumb setup', function () {
        ok(_jsPlumb, "loaded");
    });

    test(" container has data-jtk-container attribute set", function() {
        var c1 = _jsPlumb.getContainer().getAttribute("data-jtk-container");
        ok(c1 != null);

        // change container and check again
        var container2 = _addDiv("container2", document.body);

        _jsPlumb.setContainer(container2);

        var c2 = _jsPlumb.getContainer().getAttribute("data-jtk-container");
        ok(c2 != null);

        ok(c2 !== c1, "container attributes have different values");
    });

    test(': create a simple endpoint', function () {
        var d1 = _addDiv("d1");
        var e = _jsPlumb.addEndpoint(d1, {});
        ok(e, 'endpoint exists');

        ok(e.id != null, "endpoint has had an id assigned");
    });


    test(': create and remove a simple endpoint', function () {
        var d1 = _addDiv("d1");
        var ee = _jsPlumb.addEndpoint(d1, {uuid: "78978597593"});
        ok(ee != null, "endpoint exists");
        var e = _jsPlumb.getEndpoint("78978597593");
        ok(e != null, "the endpoint could be retrieved by UUID");
        ok(e.id != null, "the endpoint has had an id assigned to it");
        _jsPlumb.deleteEndpoint(ee);
        e = _jsPlumb.getEndpoint("78978597593");
        equal(e, null, "the endpoint has been deleted");
    });

    test('endpoint with overlays', function() {
        var d1 = _addDiv("d1");
        var e = _jsPlumb.addEndpoint(d1, {
            "overlays": [{type:"Label", options:{"label": "Label text", "cssClass": 'kw_port_label', "id": "66"}}]
        });
        var o = e.getOverlay("66");
        ok(o != null, "overlay exists");
    });

    test(' jsPlumb.remove after element removed from DOM', function () {
        var d = document.createElement("div");
        d.innerHTML = '<div id="container2"><ul id="targets"><li id="in1">input 1</li><li id="in2">input 2</li></ul><ul id="sources"><li id="output">output</li></ul></div>';
        var container = d.firstChild;
        document.body.appendChild(container);
        var output = document.getElementById("output")
        var e1 = _jsPlumb.addEndpoint(document.getElementById("in1"), { maxConnections: 1, source: false, target: true, anchor: [ 0, 0.4, -1, 0 ] }),
            e2 = _jsPlumb.addEndpoint(document.getElementById("in2"), { maxConnections: 1, source: false, target: true, anchor: [ 0, 0.4, -1, 0 ] }),
            e3 = _jsPlumb.addEndpoint(document.getElementById("output"), { source: true, target: false, anchor: [ 1, 0.4, 1, 0 ] });

        _jsPlumb.connect({source: e3, target: e1});

        // the element gets removed out of jsplumb's control
        var op = document.getElementById("output");
        op.parentNode.removeChild(op);

        // but you can tell jsPlumb about it after the fact
        _jsPlumb.unmanage(output, true)
        //_jsPlumb.removeElement("output");


        equal(_jsPlumb.selectEndpoints({element: "output"}).length, 0, "no endpoints registered for in1");
    });

    test(' jsPlumb.connect an endpoint to a div.', function () {

        var d1 = _addDiv("d1");
        var d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d2);

        _jsPlumb.connect({source: e1, target: d1});

        equal(_jsPlumb.select().length, 1, "one connection established");
    });

    test(": lineWidth specified as string (eew)", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            paintStyle: {
                stroke: "red",
                strokeWidth: "3"
            }
        });
        equal(c.paintStyleInUse.strokeWidth, 3, "line width converted to integer");
    });

    test(": outlineWidth specified as string (eew)", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            paintStyle: {
                stroke: "red",
                strokeWidth: 3,
                outlineWidth: "5"
            }
        });
        equal(c.paintStyleInUse.outlineWidth, 5, "outline width converted to integer");
    });


    test(": strokeWidth and outlineWidth specified as strings (eew)", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            paintStyle: {
                stroke: "red",
                strokeWidth: "3",
                outlineWidth: "5"
            }
        });
        equal(c.paintStyleInUse.outlineWidth, 5, "outline width converted to integer");
        equal(c.paintStyleInUse.strokeWidth, 3, "line width converted to integer");
    });



    test(': noEndpointMaxConnections', function () {
        var d3 = _addDiv("d3"), d4 = _addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {source: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);   // we have one connection
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var e5 = _jsPlumb.addEndpoint(d3, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e4});
        assertConnectionCount(e4, 3);
    });


    test(': endpoint.isConnectdTo', function () {
        var d3 = _addDiv("d3"), d4 = _addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {source: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        ok(e3.isConnectedTo(e4), "e3 is connected to e4");
        ok(e4.isConnectedTo(e3), "e4 is connected to e3");
    });

// ************** ANCHORS ********************************************	

    test(': anchors equal', function () {
        var d3 = _addDiv("d3"), d4 = _addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1], [0, 1, 1, 1]
            ]}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor;

        ok(_jsPlumb.router.anchorsEqual(sa, ta), "anchors are the same according to their equals method")
    });

    test(': anchors equal with offsets', function () {
        var d3 = _addDiv("d3"), d4 = _addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1, 10, 13], [0, 1, 1, 1, 10, 13]
            ]}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor;

        ok(_jsPlumb.router.anchorsEqual(sa, ta), "anchors are the same according to their equals method")
    });

    test(': anchors not equal', function () {
        var d3 = _addDiv("d3"), d4 = _addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 0, 1], [0, 1, 1, 1]
            ]}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor;
        ok(!_jsPlumb.router.anchorsEqual(sa, ta), "anchors are different, according to their equals method")
    });

    test(': anchor not equal with offsets', function () {
        var d3 = _addDiv("d3"), d4 = _addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1, 10, 13], [0, 1, 1, 1]
            ]}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor;
        ok(!_jsPlumb.router.anchorsEqual(sa, ta), "anchors are different, according to their equals method")
    });

    // test('simple makeAnchor, dynamicAnchors', function () {
    //     expect(0);
    //     var spec = [
    //         [0.2, 0, 0, -1],
    //         [1, 0.2, 1, 0],
    //         [0.8, 1, 0, 1],
    //         [0, 0.8, -1, 0]
    //     ];
    //     _jsPlumb.makeAnchor(spec);
    // });

    test(": unknown anchor type should log Error", function () {
        withConsole(function() {
            _addDiv("d1");
            _addDiv("d2");
            var c = _jsPlumb.connect({source: d1, target: d2, anchor: "FOO"});
            equal(c, null, "connection is null because of unknown anchor type")
            equal(consoleOutput, "jsPlumb: unknown anchor type 'FOO'", "error message was logged to console")
        })

    });

    test(": unknown endpoint type should log Error", function () {
        withConsole(function() {
            _addDiv("d1");
            _addDiv("d2");
            var c =_jsPlumb.connect({source: d1, target: d2, endpoint: "FOO"});
            equal(c, null, "connection is null because of unknown endpoint type")
            equal(consoleOutput, "jsPlumb: unknown endpoint type 'FOO'", "error message was logged to console")
        })
    });

    test(": unknown connector type should log Error", function () {
        withConsole(function() {
            _addDiv("d1");
            _addDiv("d2");
            var c = _jsPlumb.connect({source: d1, target: d2, connector: "FOO"});
            equal(c, null, "connection is null because of unknown endpoint type")
            equal(consoleOutput, "jsPlumb: unknown connector type 'FOO'", "error message was logged to console")
        })
    });


// ************** / ANCHORS ********************************************


// **************************** DETACHING CONNECTIONS ****************************************************


    test(': deleteConnection does not fail when no arguments are provided', function () {
        var d3 = _addDiv("d3"), d4 = _addDiv("d4");
        _jsPlumb.connect({source: d3, target: d4});
        _jsPlumb.deleteConnection();
        expect(0);
    });

    // test that deletConnection does not fire an event by default
    test(': _jsPlumb.deleteConnection should fire connection:detach event by default', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // test that you can try to delete a connection multiple times without it failing
    test(': _jsPlumb.deleteConnection can be called multiple times with the same connection without it failing', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
        ok(conn.deleted === true, "Connection has `deleted` flag set")

        try {
            _jsPlumb.deleteConnection(conn)
            ok(true, "Deleted connection twice without code throwing an error")
        }
        catch (e) {
            ok(false, "Should have been able to delete connection twice without code throwing an error")
        }
    });

    // test that detach does not fire an event by default
    test(': _jsPlumb.deleteConnection should fire detach event by default, using params object', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // test that detach fires an event when instructed to do so
    test(': _jsPlumb.deleteConnection should not fire detach event when instructed to not do so', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn, {fireEvent: false});
        equal(eventCount, 0);
    });

    // issue 81
    test(': _jsPlumb.deleteConnection should fire only one detach event (pass Connection as argument)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // issue 81
    test(': _jsPlumb.deleteConnection should fire only one detach event (pass Connection as param in argument)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // issue 81
    test('select().deleteAll should fire only one detach event (pass source and targets as elements as arguments in params object)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        equal(eventCount, 1);
    });

    // issue 81
    test('select().deleteAll should fire only one detach event (pass source and targets as divs as arguments in params object)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connection:detach", function (c) {
            eventCount++;
        });
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        equal(eventCount, 1);
    });

    //TODO make sure you run this test with a single detach call, to ensure that
    // single detach calls result in the connection being removed. detachEveryConnection can
    // just blow away the connectionsByScope array and recreate it.
    test(': getConnections (simple case, default scope)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        _jsPlumb.connect({source: d5, target: d6});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 1, "there is one connection");
    });

    test(': getConnections (simple case, multiple targets, default scope)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d5, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 2, "there are two connections");
    });

    test('getConnections (uuids)', function () {
        var d5 = _addDiv("d5"),
            d6 = _addDiv("d6"),
            e5 = _jsPlumb.addEndpoint(d5, {uuid:"foo"}),
            e6 = _jsPlumb.addEndpoint(d6, {uuid:"bar"});
        _jsPlumb.connect({uuids:["foo", "bar"]});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 1, "there is one connection");
        equal(c[0].getUuids()[0], "foo");
        equal(c[0].getUuids()[1], "bar");
    });

    test('getConnections (simple case, default scope; detach by element id using params object)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by id using params object)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by element object using params object)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by Connection)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6"), d7 = _addDiv("d7");
        var c56 = _jsPlumb.connect({source: d5, target: d6});
        var c67 = _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.deleteConnection(c56);
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

// beforeDetach functionality

    test(": detach; beforeDetach on connect call returns false", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            return false;
        }});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        equal(beforeDetachCount, 0, "jsplumb before detach was not called");
    });

    test(": detach; beforeDetach on connect call returns undefined", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) { }});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on connect call returns true", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            return true;
        }});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on connect call throws an exception; we treat it with the contempt it deserves and pretend it said the detach was ok.", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            throw "i am an example of badly coded beforeDetach, but i don't break jsPlumb ";
        }});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on addEndpoint call to source Endpoint returns false", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true, beforeDetach: function (conn) {
                return false;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        equal(beforeDetachCount, 0, "jsplumb before detach was not called");
    });

    test(": detach; beforeDetach on addEndpoint call to source Endpoint returns true", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true, beforeDetach: function (conn) {
                return true;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });


    test(": Endpoint.detach; beforeDetach on addEndpoint call to source Endpoint returns false; Endpoint.detach returns false too (the UI needs it to)", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true, beforeDetach: function (conn) {
                return false;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        var success = _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        ok(!success, "Endpoint reported detach did not execute");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns false", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection after detach call was denied");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns false but detach is forced", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c, {force: true});
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns true", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return true;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach bound to _jsPlumb returns false", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            ok(connection.source.id === "d1", "connection is provided and configured with correct source");
            ok(connection.target.id === "d2", "connection is provided and configured with correct target");
            beforeDetachCount++;
            return false;
        });
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection after detach call was denied");
        equal(beforeDetachCount, 1, "beforeDetach was called only one time");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach bound to _jsPlumb returns true", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        _jsPlumb.bind("beforeDetach", function (connection) {
            ok(connection.source.id === "d1", "connection is provided and configured with correct source");
            ok(connection.target.id === "d2", "connection is provided and configured with correct target");
            return true;
        });
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach bound to _jsPlumb returns false", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        _jsPlumb.bind("beforeDetach", function (connection) {
            return false;
        });
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        var deleted = _jsPlumb.deleteConnection(c);
        equal(e1.connections.length, 1, "source endpoint's connection was not removed");
        equal(deleted, false, "deleteConnection reports connection not deleted");
    });

    test("Endpoint.deleteEveryConnection", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");

        e1.deleteEveryConnection();
        equal(_jsPlumb.select().length, 0, "there are no connections in the instance");
    });

    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on addEndpoint call to target Endpoint returns true so we detach", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return true;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(_jsPlumb.select().length, 0, "there are no connections in the instance");
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on addEndpoint call to target Endpoint returns false so we do not detach", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(_jsPlumb.select().length, 1, "there is still 1 connection in the instance");
        equal(c.endpoints.length, 2, "connection's endpoints are in place");
        equal(e1.connections.length, 1, "source endpoint has one connection");
        equal(e2.connections.length, 1, "target endpoint has one connection");
    });
//
    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on jsPlumb returns false and we dont detach", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return false;
        });
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has a connection");
        equal(e2.connections.length, 1, "target endpoint has a connection");
    });
//
    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on jsPlumb returns true and we do detach", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return true;
        });
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on jsPlumb returns false and we dont detach", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return false;
        });
        _jsPlumb.deleteEveryConnection();
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has a connection");
        equal(e2.connections.length, 1, "target endpoint has a connection");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on jsPlumb returns true and we do detach", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return true;
        });
        _jsPlumb.deleteEveryConnection();
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on jsPlumb returns true but we have forced deletion of the connection", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return false;
        });
        var deletedCount = _jsPlumb.deleteEveryConnection({force: true});
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
        equal(deletedCount, 1, "deleteEveryConnection reports one connection deleted");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on addEndpoint call to target Endpoint returns false so we do not delete the connection", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteEveryConnection();
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has 1 connection");
        equal(e2.connections.length, 1, "target endpoint has 1 connection");
        equal(_jsPlumb.select().length, 1, "one connection in the instance");
    });

    test(": Endpoint.deleteEveryConnection ; beforeDetach on addEndpoint call to target Endpoint returns false so we dont delete the connection", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        e1.deleteEveryConnection();
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has one connection");
        equal(e2.connections.length, 1, "target endpoint has one connection");
    });

    test(": Endpoint.deleteEveryConnection ; beforeDetach on addEndpoint call to target Endpoint returns false but force is true so we delete the connection", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        e1.deleteEveryConnection({force:true});
        equal(c.endpoints, null, "connection's endpoints were not removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

// ******** end of beforeDetach tests **************

// detachEveryConnection/detachAllConnections fireEvent overrides tests

    test(": _jsPlumb.deleteEveryConnection fires events", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0;
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connection:detach", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections registered");
        _jsPlumb.deleteEveryConnection();
        equal(connCount, 0, "no connections registered");
    });


    test(": _jsPlumb.deleteEveryConnection doesn't fire events when instructed not to", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0;
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connection:detach", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections registered");
        _jsPlumb.deleteEveryConnection({fireEvent: false});
        equal(connCount, 2, "two connections registered");
    });

    test(": _jsPlumb.deleteConnectionsForElement fires events", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0,
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connection:detach", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections registered");
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(connCount, 0, "no connections registered after delete connections for element");
    });

    test(": _jsPlumb.deleteConnectionsForElement doesn't fire events when instructed not to", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), connCount = 0,
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connection:detach", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections counted by event listener");
        _jsPlumb.deleteConnectionsForElement(d1, {fireEvent: false});
        equal(connCount, 2, "two connections still registered by event listener");
    });

// **************************** / DETACHING CONNECTIONS ****************************************************    

    test(" : deletions, simple endpoint case", function () {

        // 1. simplest case - an endpoint that exists on some element.		
        var d1 = _addDiv("d1"),
            e = _jsPlumb.addEndpoint(d1);
            //dt = _jsPlumb.deleteObject({endpoint: e});

        equal(_jsPlumb.selectEndpoints().length, 1, "1 endpoint registered");
        _jsPlumb.deleteEndpoint(e);
        equal(_jsPlumb.selectEndpoints().length, 0, "0 endpoints registered");

//        equal(_jsPlumbUtil.isEmpty(dt.endpoints), false, "one endpoint to delete");
//        equal(dt.endpointCount, 1, "one endpoint to delete");
//        equal(_jsPlumbUtil.isEmpty(dt.connections), true, "zero connections to delete");
//        equal(dt.connectionCount, 0, "zero connections to delete");

        // 2. create two endpoints and connect them, then delete one. the other endpoint should
        // still exist.
        var d2 = _addDiv("d2"), d3 = _addDiv("d3"),
            e2 = _jsPlumb.addEndpoint(d2),
            e3 = _jsPlumb.addEndpoint(d3);

        _jsPlumb.connect({source: e2, target: e3});

        equal(_jsPlumb.select({source: d2}).length, 1, "one connection exists");
//
        equal(_jsPlumb.getEndpoints(d3).length, 1, "one endpoint on d3");
        _jsPlumb.deleteEndpoint(e2);
//        var dt2 = _jsPlumb.deleteObject({endpoint: e2});
//        equal(_jsPlumbUtil.isEmpty(dt2.endpoints), false, "one endpoint to delete");
//        equal(_jsPlumbUtil.isEmpty(dt2.connections), false, "one connection to delete");
        equal(_jsPlumb.select({source: d2}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d2).length, 0, "zero endpoints on d2");
        equal(_jsPlumb.getEndpoints(d3).length, 1, "one endpoint on d3");
//
//        // 3. create two endpoints and connect them, then detach the connection. the two endpoints
//        // should still exist, because they did not set `deleteOnEmpty`.
        var d4 = _addDiv("d4"), d5 = _addDiv("d5"),
            e4 = _jsPlumb.addEndpoint(d4),
            e5 = _jsPlumb.addEndpoint(d5);

        var c = _jsPlumb.connect({source: e4, target: e5});
        equal(_jsPlumb.select({source: d4}).length, 1, "one connection exists");
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select({source: d4}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d4).length, 1, "one endpoint on d4");
        equal(_jsPlumb.getEndpoints(d5).length, 1, "one endpoint on d5");

        // set deleteOnEmpty on e4
        e4.deleteOnEmpty = true;

        // 4. same as (3) but now deleteOnEmpty is set on e4
        c = _jsPlumb.connect({source: e4, target: e5});
        equal(_jsPlumb.select({source: d4}).length, 1, "one connection exists between e4 and e5");
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select({source: d4}).length, 0, "zero connections exist after connection delete");
        equal(_jsPlumb.getEndpoints(d4).length, 0, "no endpoints on d4");
        equal(_jsPlumb.getEndpoints(d5).length, 1, "one endpoint on d5");
//
//        // 5.set deleteEndpointsOnDetach on the connect call, then delete the connection.
        var d6 = _addDiv("d6"), d7 = _addDiv("d7");

        var c2 = _jsPlumb.connect({source: d6, target: d7, deleteEndpointsOnEmpty: true});
        equal(_jsPlumb.select({source: d6}).length, 1, "one connection exists");
        _jsPlumb.deleteConnection(c2);
//

        equal(_jsPlumb.select({source: d6}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d6).length, 0, "no endpoints on d6");
        equal(_jsPlumb.getEndpoints(d7).length, 0, "no endpoints on d7");

    });


    test(': getConnections (scope testScope)', function () {
        var d5 = _addDiv("d5"), d6 = _addDiv("d6");
        _jsPlumb.connect({source: d5, target: d6, scope: 'testScope'});
        var c = _jsPlumb.getConnections("testScope");  // will get all connections in testScope	
        equal(c.length, 1, "there is one connection");
        equal(c[0].source.id, 'd5', "the connection's source is d5");
        equal(c[0].target.id, 'd6', "the connection's source is d6");
        c = _jsPlumb.getConnections();  // will get all connections in default scope; should be none.
        equal(c.length, 0, "there are no connections in the default scope");
    });

    test(': _jsPlumb.getAllConnections (filtered by scope)', function () {
        var d8 = _addDiv("d8"), d9 = _addDiv("d9"), d10 = _addDiv('d10');
        _jsPlumb.connect({source: d8, target: d9, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d10}); // default scope
        var c = _jsPlumb.connections;  // will get all connections
        equal(c.length, 2, "all connections has two entries");
        // now supply a list of scopes
        c = _jsPlumb.getConnections();
        equal(c.length, 1, "1 connection in default scope");
        c = _jsPlumb.getConnections("testScope");
        equal(c.length, 1, "there is one connection in 'testScope'");
    });

    test(': _jsPlumb.getConnections (filtered by scope and sourceId)', function () {
        var d8 = _addDiv("d8"), d9 = _addDiv("d9"), d10 = _addDiv('d10');
        _jsPlumb.connect({source: d8, target: d9, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d8, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d10}); // default scope
        var c = _jsPlumb.getConnections({scope: 'testScope', source: d8});  // will get all connections with sourceId 'd8'
        equal(c.length, 1, "there is one connection in 'testScope' from d8");
    });

    test(': _jsPlumb.getConnections (filtered by scope, source id and target id)', function () {
        var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope'});
        var c = _jsPlumb.getConnections({scope: 'testScope', source: d11, target: d13});
        equal(c.length, 1, "there is one connection from d11 to d13");
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes)', function () {
        var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope2'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope3'});
        var c = _jsPlumb.getConnections({scope: ['testScope', 'testScope3']});
        equal(c['testScope'].length, 1, 'there is one connection in testScope');
        equal(c['testScope3'].length, 1, 'there is one connection in testScope3');
        equal(c['testScope2'], null, 'there are no connections in testScope2');
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes and source ids)', function () {
        var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d13, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope2'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope3'});
        var c = _jsPlumb.getConnections({scope: ['testScope', 'testScope3'], source: [d11]});
        equal(c['testScope'].length, 1, 'there is one connection in testScope');
        equal(c['testScope3'].length, 1, 'there is one connection in testScope3');
        equal(c['testScope2'], null, 'there are no connections in testScope2');
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes, source ids and target ids)', function () {
        _jsPlumb.deleteEveryConnection();
        var d11 = _addDiv("d11"), d12 = _addDiv("d12"), d13 = _addDiv('d13'), d14 = _addDiv("d14"), d15 = _addDiv("d15");
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d13, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d11, target: d14, scope: 'testScope'});
        _jsPlumb.connect({source: d11, target: d15, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope2'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope3'});
        var c = _jsPlumb.getConnections({scope: ['testScope', 'testScope3'], source: [d11], target: [d14, d15]});
        equal(c['testScope'].length, 2, 'there are two connections in testScope');
        equal(c['testScope3'], null, 'there are no connections in testScope3');
        equal(c['testScope2'], null, 'there are no connections in testScope2');
        var anEntry = c['testScope'][0];
        ok(anEntry.endpoints[0] != null, "Source endpoint is set");
        ok(anEntry.endpoints[1] != null, "Target endpoint is set");
        equal(anEntry.source.getAttribute("id"), "d11", "Source is div d11");
        equal(anEntry.target.getAttribute("id"), "d14", "Target is div d14");
    });

    test(': getEndpoints, one Endpoint added by addEndpoint, get Endpoints by selector', function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        _jsPlumb.addEndpoint(d1);
        var e = _jsPlumb.getEndpoints(d1);
        equal(e.length, 1, "there is one endpoint for element d1");
    });

    test(': getEndpoints, one Endpoint added by addEndpoint, get Endpoints by id', function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        _jsPlumb.addEndpoint(d1);
        var e = _jsPlumb.getEndpoints(d1);
        equal(e.length, 1, "there is one endpoint for element d1");
    });



};


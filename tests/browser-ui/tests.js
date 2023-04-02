// _jsPlumb qunit tests.

QUnit.config.reorder = false;

/**
 * @name Test
 * @class
 */

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
            support.cleanup();
            removeContainer()
        },
        setup: function () {
            consoleOutput = null
            makeContainer()
            _jsPlumb = jsPlumb.newInstance({container:container});
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });


    test(': _jsPlumb setup', function () {
        ok(_jsPlumb, "loaded");
    });

    test(" container has data-jtk-container attribute set", function() {
        var c1 = _jsPlumb.getContainer().getAttribute("data-jtk-container");
        ok(c1 != null);

        // change container and check again
        var container2 = support.addDiv("container2", document.body);

        _jsPlumb.setContainer(container2);

        var c2 = _jsPlumb.getContainer().getAttribute("data-jtk-container");
        ok(c2 != null);

        ok(c2 !== c1, "container attributes have different values");
    });

    test(': getId', function () {
        var d10 = support.addDiv('d10');
        equal(_jsPlumb.getId(d10), d10.getAttribute("data-jtk-managed"));
    });

    test(': create a simple endpoint', function () {
        var d1 = support.addDiv("d1");
        var e = _jsPlumb.addEndpoint(d1, {});
        ok(e, 'endpoint exists');
        support.assertEndpointCount(d1, 1);
        ok(e.id != null, "endpoint has had an id assigned");
    });

    test(': create a simple endpoint with a scope and ensure the scope is written to the DOM', function () {
        var d1 = support.addDiv("d1");
        var e = _jsPlumb.addEndpoint(d1, { scope:"one"});
        ok(e, 'endpoint exists');
        support.assertEndpointCount(d1, 1);
        ok(e.id != null, "endpoint has had an id assigned");
        ok(support.getEndpointCanvas(e).getAttribute("data-jtk-scope-one") != null, "scope was written to the element");
    });

    test(': create and remove a simple endpoint', function () {
        var d1 = support.addDiv("d1");
        var ee = _jsPlumb.addEndpoint(d1, {uuid: "78978597593"});
        ok(ee != null, "endpoint exists");
        var e = _jsPlumb.getEndpoint("78978597593");
        ok(e != null, "the endpoint could be retrieved by UUID");
        ok(e.id != null, "the endpoint has had an id assigned to it");
        support.assertEndpointCount(d1, 1);
        _jsPlumb.deleteEndpoint(ee);
        support.assertEndpointCount(d1, 0);
        e = _jsPlumb.getEndpoint("78978597593");
        equal(e, null, "the endpoint has been deleted");
    });

    test('endpoint with overlays', function() {
        var d1 = support.addDiv("d1");
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

        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d2);

        _jsPlumb.connect({source: e1, target: d1});

        equal(_jsPlumb.select().length, 1, "one connection established");
    });

    test(": lineWidth specified as string (eew)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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

    test(': defaultEndpointMaxConnections', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {source: true});
        ok(e3._anchor, 'endpoint 3 has an anchor');
        var e4 = _jsPlumb.addEndpoint(d4, {source: true});
        support.assertEndpointCount(d3, 1, _jsPlumb);
        support.assertEndpointCount(d4, 1, _jsPlumb);
        ok(!e3.isFull(), "endpoint 3 is not full.");
        _jsPlumb.connect({source: d3, target: 'd4', sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);   // we have one connection
        _jsPlumb.connect({source: d3, target: 'd4', sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);  // should have refused the connection; default max is 1.
    });

    test(': specifiedEndpointMaxConnections', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var e5 = _jsPlumb.addEndpoint(d5, {source: true, maxConnections: 3});
        ok(e5._anchor, 'endpoint 5 has an anchor');
        var e6 = _jsPlumb.addEndpoint(d6, {source: true, maxConnections: 2});  // this one has max TWO
        support.assertEndpointCount(d5, 1, _jsPlumb);
        support.assertEndpointCount(d6, 1, _jsPlumb);
        ok(!e5.isFull(), "endpoint 5 is not full.");
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e6});
        assertConnectionCount(e5, 1);   // we have one connection
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e6});
        assertConnectionCount(e5, 2);  // two connections
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e6});
        assertConnectionCount(e5, 2);  // should have refused; max is 2, for d4.
    });

    test(': noEndpointMaxConnections', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {source: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);   // we have one connection
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var e5 = _jsPlumb.addEndpoint(d3, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e4});
        assertConnectionCount(e4, 3);
    });


    test(': endpoint.isConnectdTo', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {source: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        ok(e3.isConnectedTo(e4), "e3 is connected to e4");
        ok(e4.isConnectedTo(e3), "e4 is connected to e3");
    });

// ************** ANCHORS ********************************************	

    test(': anchors equal', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1], [0, 1, 1, 1]
            ]}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor;

        ok(_jsPlumb.router.anchorsEqual(sa, ta), "anchors are the same according to their equals method")
    });

    test(': anchors equal with offsets', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1, 10, 13], [0, 1, 1, 1, 10, 13]
            ]}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor;

        ok(_jsPlumb.router.anchorsEqual(sa, ta), "anchors are the same according to their equals method")
    });

    test(': anchors not equal', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 0, 1], [0, 1, 1, 1]
            ]}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor;
        ok(!_jsPlumb.router.anchorsEqual(sa, ta), "anchors are different, according to their equals method")
    });

    test(': anchor not equal with offsets', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
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
            support.addDiv("d1");
            support.addDiv("d2");
            var c = _jsPlumb.connect({source: d1, target: d2, anchor: "FOO"});
            equal(c, null, "connection is null because of unknown anchor type")
            equal(consoleOutput, "jsPlumb: unknown anchor type 'FOO'", "error message was logged to console")
        })

    });

    test(": unknown endpoint type should log Error", function () {
        withConsole(function() {
            support.addDiv("d1");
            support.addDiv("d2");
            var c =_jsPlumb.connect({source: d1, target: d2, endpoint: "FOO"});
            equal(c, null, "connection is null because of unknown endpoint type")
            equal(consoleOutput, "jsPlumb: unknown endpoint type 'FOO'", "error message was logged to console")
        })
    });

    test(": unknown connector type should log Error", function () {
        withConsole(function() {
            support.addDiv("d1");
            support.addDiv("d2");
            var c = _jsPlumb.connect({source: d1, target: d2, connector: "FOO"});
            equal(c, null, "connection is null because of unknown endpoint type")
            equal(consoleOutput, "jsPlumb: unknown connector type 'FOO'", "error message was logged to console")
        })
    });


// ************** / ANCHORS ********************************************


// **************************** DETACHING CONNECTIONS ****************************************************


    test(': deleteConnection does not fail when no arguments are provided', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.connect({source: d3, target: d4});
        _jsPlumb.deleteConnection();
        expect(0);
    });

    // test that deletConnection does not fire an event by default
    test(': _jsPlumb.deleteConnection should fire connection:detach event by default', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
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
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        _jsPlumb.connect({source: d5, target: d6});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 1, "there is one connection");
    });

    test(': getConnections (simple case, multiple targets, default scope)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d5, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 2, "there are two connections");
    });

    test('getConnections (uuids)', function () {
        var d5 = support.addDiv("d5"),
            d6 = support.addDiv("d6"),
            e5 = _jsPlumb.addEndpoint(d5, {uuid:"foo"}),
            e6 = _jsPlumb.addEndpoint(d6, {uuid:"bar"});
        _jsPlumb.connect({uuids:["foo", "bar"]});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 1, "there is one connection");
        equal(c[0].getUuids()[0], "foo");
        equal(c[0].getUuids()[1], "bar");
    });

    test('getConnections (simple case, default scope; detach by element id using params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by id using params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by element object using params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by Connection)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) { }});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(beforeDetachCount, 1, "beforeDetach called once")
    });

    test(": detach; beforeDetach on connect call returns true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            return true;
        }});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on connect call throws an exception; we treat it with the contempt it deserves and pretend it said the detach was ok.", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            throw "i am an example of badly coded beforeDetach, but i don't break jsPlumb ";
        }});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on addEndpoint call to source Endpoint returns false", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var beforeDetachCount = 0;
        var e1 = _jsPlumb.addEndpoint(d1, { source: true, beforeDetach: function (conn) {
                    beforeDetachCount++;
                return false;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});

        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        equal(beforeDetachCount, 1, "jsplumb before detach was called once (by the endpoint; the main method was not called)");
    });

    test(": detach; beforeDetach on addEndpoint call to source Endpoint returns true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { source: true }),
            e2 = _jsPlumb.addEndpoint(d2, { target: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");

        e1.deleteEveryConnection();
        equal(_jsPlumb.select().length, 0, "there are no connections in the instance");
    });

    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on addEndpoint call to target Endpoint returns true so we detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0;
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0;
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0,
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0,
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
        var d1 = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d1);
            //dt = _jsPlumb.deleteObject({endpoint: e});

        equal(_jsPlumb.selectEndpoints().length, 1, "1 endpoint registered");
        _jsPlumb.deleteEndpoint(e);
        equal(_jsPlumb.selectEndpoints().length, 0, "0 endpoints registered");

//        equal(_jsPlumb.isEmpty(dt.endpoints), false, "one endpoint to delete");
//        equal(dt.endpointCount, 1, "one endpoint to delete");
//        equal(_jsPlumb.isEmpty(dt.connections), true, "zero connections to delete");
//        equal(dt.connectionCount, 0, "zero connections to delete");

        // 2. create two endpoints and connect them, then delete one. the other endpoint should
        // still exist.
        var d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e2 = _jsPlumb.addEndpoint(d2),
            e3 = _jsPlumb.addEndpoint(d3);

        _jsPlumb.connect({source: e2, target: e3});

        equal(_jsPlumb.select({source: d2}).length, 1, "one connection exists");
//
        equal(_jsPlumb.getEndpoints(d3).length, 1, "one endpoint on d3");
        _jsPlumb.deleteEndpoint(e2);
//        var dt2 = _jsPlumb.deleteObject({endpoint: e2});
//        equal(_jsPlumb.isEmpty(dt2.endpoints), false, "one endpoint to delete");
//        equal(_jsPlumb.isEmpty(dt2.connections), false, "one connection to delete");
        equal(_jsPlumb.select({source: d2}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d2).length, 0, "zero endpoints on d2");
        equal(_jsPlumb.getEndpoints(d3).length, 1, "one endpoint on d3");
//
//        // 3. create two endpoints and connect them, then detach the connection. the two endpoints
//        // should still exist, because they did not set `deleteOnEmpty`.
        var d4 = support.addDiv("d4"), d5 = support.addDiv("d5"),
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
        var d6 = support.addDiv("d6"), d7 = support.addDiv("d7");

        var c2 = _jsPlumb.connect({source: d6, target: d7, deleteEndpointsOnEmpty: true});
        equal(_jsPlumb.select({source: d6}).length, 1, "one connection exists");
        _jsPlumb.deleteConnection(c2);
//

        equal(_jsPlumb.select({source: d6}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d6).length, 0, "no endpoints on d6");
        equal(_jsPlumb.getEndpoints(d7).length, 0, "no endpoints on d7");

    });


    test(': getConnections (scope testScope)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        _jsPlumb.connect({source: d5, target: d6, scope: 'testScope'});
        var c = _jsPlumb.getConnections("testScope");  // will get all connections in testScope	
        equal(c.length, 1, "there is one connection");
        equal(c[0].source.id, 'd5', "the connection's source is d5");
        equal(c[0].target.id, 'd6', "the connection's source is d6");
        c = _jsPlumb.getConnections();  // will get all connections in default scope; should be none.
        equal(c.length, 0, "there are no connections in the default scope");
    });

    test(': _jsPlumb.getAllConnections (filtered by scope)', function () {
        var d8 = support.addDiv("d8"), d9 = support.addDiv("d9"), d10 = support.addDiv('d10');
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
        var d8 = support.addDiv("d8"), d9 = support.addDiv("d9"), d10 = support.addDiv('d10');
        _jsPlumb.connect({source: d8, target: d9, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d8, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d10}); // default scope
        var c = _jsPlumb.getConnections({scope: 'testScope', source: d8});  // will get all connections with sourceId 'd8'
        equal(c.length, 1, "there is one connection in 'testScope' from d8");
    });

    test(': _jsPlumb.getConnections (filtered by scope, source id and target id)', function () {
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope'});
        var c = _jsPlumb.getConnections({scope: 'testScope', source: d11, target: d13});
        equal(c.length, 1, "there is one connection from d11 to d13");
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes)', function () {
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope2'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope3'});
        var c = _jsPlumb.getConnections({scope: ['testScope', 'testScope3']});
        equal(c['testScope'].length, 1, 'there is one connection in testScope');
        equal(c['testScope3'].length, 1, 'there is one connection in testScope3');
        equal(c['testScope2'], null, 'there are no connections in testScope2');
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes and source ids)', function () {
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13');
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
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13'), d14 = support.addDiv("d14"), d15 = support.addDiv("d15");
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addEndpoint(d1);
        var e = _jsPlumb.getEndpoints(d1);
        equal(e.length, 1, "there is one endpoint for element d1");
    });

    test(': getEndpoints, one Endpoint added by addEndpoint, get Endpoints by id', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addEndpoint(d1);
        var e = _jsPlumb.getEndpoints(d1);
        equal(e.length, 1, "there is one endpoint for element d1");
    });

    test(': addEndpoint, css class on anchor added to endpoint artefact and element', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var ep = _jsPlumb.addEndpoint(d1, { anchor: [0, 0, 1, 1, 0, 0, "foo" ]});
        ok(_jsPlumb.hasClass(support.getEndpointCanvas(ep), "jtk-endpoint-anchor-foo"), "class set on endpoint");
        ok(_jsPlumb.hasClass(d1, "jtk-endpoint-anchor-foo"), "class set on element");
        _jsPlumb.deleteEndpoint(ep);
        ok(!_jsPlumb.hasClass(d1, "jtk-endpoint-anchor-foo"), "class removed from element");
    });

    test(': addEndpoint, blank css class on anchor does not add extra prefix ', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var ep = _jsPlumb.addEndpoint(d1, { anchor: [0, 0, 1, 1, 0, 0  ]});
        ok(!_jsPlumb.hasClass(support.getEndpointCanvas(ep), "jtk-endpoint-anchor"), "class not set on endpoint, as anchor class is null");
        ok(!_jsPlumb.hasClass(d1, "jtk-endpoint-anchor"), "class not set on endpoint, as anchor class is null");
        // _jsPlumb.deleteEndpoint(ep);
        // ok(!_jsPlumb.hasClass(d1, "jtk-endpoint-anchor"), "class removed from element");
    });

    test(': connect, jsplumb connected class added to elements', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        // connect two elements and check they both get the class.
        var c = _jsPlumb.connect({source:d1, target:d2});
        ok(_jsPlumb.hasClass(d1, "jtk-connected"), "class set on element d1");
        ok(_jsPlumb.hasClass(d2, "jtk-connected"), "class set on element d2");
        // connect d1 to another element and check d3 gets the class
        var c2 = _jsPlumb.connect({source:d1, target:d3});
        ok(_jsPlumb.hasClass(d3, "jtk-connected"), "class set on element d3");
        // now disconnect original connection. d2 should no longer have the class, but d1 should, since it has
        // still one connection.
        _jsPlumb.deleteConnection(c);
        ok(_jsPlumb.hasClass(d1, "jtk-connected"), "class still on element d1");
        ok(!_jsPlumb.hasClass(d2, "jtk-connected"), "class removed from element d2");
        _jsPlumb.deleteConnection(c2);
        ok(!_jsPlumb.hasClass(d1, "jtk-connected"), "class removed from element d1");
        ok(!_jsPlumb.hasClass(d3, "jtk-connected"), "class removed from element d3");
    });

    test(': connection event listeners', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connection", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var c = _jsPlumb.connect({source: d1, target: d2});
        ok(returnedParams != null, "new connection listener event was fired");
        ok(returnedParams.connection != null, 'connection is set');
        equal(returnedParams.source.id, "d1", 'sourceid is set');
        equal(returnedParams.target.id, "d2", 'targetid is set');
        equal(returnedParams.source.getAttribute("id"), "d1", 'source is set');
        equal(returnedParams.target.getAttribute("id"), "d2", 'target is set');
        ok(returnedParams.sourceEndpoint != null, "source endpoint is not null");
        ok(returnedParams.targetEndpoint != null, "target endpoint is not null");
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.deleteConnection(c);
        ok(returnedParams.connection != null, 'connection is set');
    });

    test(': detach event listeners (detach by connection)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.deleteConnection(conn);
        ok(returnedParams != null, "removed connection listener event was fired");
        ok(returnedParams.connection != null, "removed connection listener event passed in connection");
    });

    test(': detach event listeners (detach by element ids)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (detach by elements)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via jsPlumb.deleteConnection method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        _jsPlumb.deleteConnection(conn);
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via Endpoint.detachFrom method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        e1.detachFrom(e2);
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via Endpoint.deleteEveryConnection method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        e1.deleteEveryConnection();
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via _jsPlumb.deleteEndpoint method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        _jsPlumb.deleteEndpoint(e1);
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (ensure cleared by _jsPlumb.reset)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connection:detach", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        ok(returnedParams != null, "removed connection listener event was fired");
        returnedParams = null;

        _jsPlumb.reset(true);
        conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        equal(_jsPlumb.select({source: d1}).length, 0, "no connections from d1 after detach with two connections as arguments");
    });

    test(': connection events that throw errors', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null, returnedParams2 = null;
        _jsPlumb.bind("connection", function (params) {
            returnedParams = jsPlumb.extend({}, params);
            throw "oh no!";
        });
        _jsPlumb.connect({source: d1, target: d2});
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.connect({source: d3, target: d4});
        ok(returnedParams != null, "new connection listener event was fired; we threw an error, _jsPlumb survived.");
    });

    test(': unbinding connection event listeners, connection', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var count = 0;
        _jsPlumb.bind("connection", function (params) {
            count++;
        });
        var c = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 1, "received one event");
        _jsPlumb.unbind("connection");
        var c2 = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 1, "still received only one event");

        _jsPlumb.bind("connection:detach", function (params) {
            count--;
        });
        _jsPlumb.deleteConnection(c);
        ok(count == 0, "count of events is now zero");
    });

    test(': unbinding connection event listeners, detach', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var count = 0;
        _jsPlumb.bind("connection", function (params) {
            count++;
        });
        var c = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 1, "received one event");
        var c2 = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 2, "received two events");

        _jsPlumb.bind("connection:detach", function (params) {
            count--;
        });
        _jsPlumb.deleteConnection(c);
        ok(count == 1, "count of events is now one");
        _jsPlumb.unbind("connection:detach");
        _jsPlumb.deleteConnection(c2);
        ok(count == 1, "count of events is still one");
    });

    test(': unbinding connection event listeners, all listeners', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var count = 0;
        _jsPlumb.bind("connection", function (params) {
            count++;
        });
        var c = _jsPlumb.connect({source: d1, target: d2}),
            c2 = _jsPlumb.connect({source: d1, target: d2}),
            c3 = _jsPlumb.connect({source: d1, target: d2});

        ok(count == 3, "received three events");

        _jsPlumb.bind("connection:detach", function (params) {
            count--;
        });
        _jsPlumb.deleteConnection(c);
        ok(count == 2, "count of events is now two");

        _jsPlumb.unbind();  // unbind everything

        _jsPlumb.deleteConnection(c2);
        _jsPlumb.deleteConnection(c3);
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});

        ok(count == 2, "count of events is still two");
    });

    test(": Endpoint.detachFrom", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var conn = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionCount(e16, 1);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        e16.detachFrom(e17);
        // but the connection should be gone, meaning not registered by _jsPlumb and not registered on either Endpoint:
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });

    test(": Endpoint.detachFromConnection", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections:1});
        var c16 = support.getEndpointCanvas(e16);
        equal(false, _jsPlumb.hasClass(c16, _jsPlumb.endpointConnectedClass), "endpoint does not have connected class");
        equal(false, _jsPlumb.hasClass(c16, _jsPlumb.endpointFullClass), "endpoint does not have full class");

        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var conn = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});

        equal(true, _jsPlumb.hasClass(c16, _jsPlumb.endpointConnectedClass), "endpoint has connected class");
        equal(true, _jsPlumb.hasClass(c16, _jsPlumb.endpointFullClass), "endpoint has full class");

        assertConnectionCount(e16, 1);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        e16.detachFromConnection(conn);

        equal(false, _jsPlumb.hasClass(c16, _jsPlumb.endpointConnectedClass), "endpoint does not have connected class");
        equal(false, _jsPlumb.hasClass(c16, _jsPlumb.endpointFullClass), "endpoint does not have full class");

        // but endpoint e16 should have no connections now.
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
    });

    test(": Endpoint.detachAll", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var e18 = _jsPlumb.addEndpoint(d18, {source: true});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e18});
        assertConnectionCount(e16, 2);
        assertConnectionCount(e17, 1);
        assertConnectionCount(e18, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 2, _jsPlumb);
        e16.deleteEveryConnection();
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });

    test(": Endpoint.detach", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var conn = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionCount(e16, 1);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        _jsPlumb.deleteConnection(conn);
        // but the connection should be gone, meaning not registered by _jsPlumb and not registered on either Endpoint:
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });





    test(": setting endpoint uuid", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        equal(e16.getUuid(), uuid, "endpoint's uuid was set correctly");
    });

    test(": _jsPlumb.getEndpoint (by uuid)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
    });

    test(": _jsPlumb.deleteEndpoint (by uuid, simple case)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
        _jsPlumb.deleteEndpoint(uuid);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
        var ebe = _jsPlumb.getEndpoints(d16);
        equal(ebe.length, 0, "no endpoints registered for element d16 anymore");
    });


    test(": deleteEndpoint (by uuid, connections too)", function () {
        // create two endpoints (one with a uuid), add them to two divs and then connect them.
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        // check that the connection was ok.
        equal(e16.connections.length, 1, "e16 has one connection");
        equal(e17.connections.length, 1, "e17 has one connection");

        // delete the endpoint that has a uuid.  verify that the endpoint cannot be retrieved and that the connection has been removed, but that
        // element d17 still has its Endpoint.
        _jsPlumb.deleteEndpoint(uuid);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
        equal(e16.connections.length, 0, "e16 has no connections");
        equal(e17.connections.length, 0, "e17 has no connections");
        var ebe = _jsPlumb.getEndpoints(d16);
        equal(ebe.length, 0, "no endpoints registered for element d16 anymore");
        ebe = _jsPlumb.getEndpoints(d17);
        equal(ebe.length, 1, "element d17 still has its Endpoint");

        // now delete d17's endpoint and check that it has gone.
        _jsPlumb.deleteEndpoint(e17);
        f = _jsPlumb.getEndpoint(e17);
        equal(f, null, "endpoint has been deleted");
        ebe = _jsPlumb.getEndpoints(d17);
        equal(ebe.length, 0, "element d17 no longer has any Endpoints");
    });

    test(": deleteEndpoint (by reference, simple case)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
        _jsPlumb.deleteEndpoint(e16);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
    });

    test(": _jsPlumb.deleteEndpoint (by reference, connections too)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(e16.connections.length, 1, "e16 has one connection");
        equal(e17.connections.length, 1, "e17 has one connection");

        _jsPlumb.deleteEndpoint(e16);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
        equal(e16.connections.length, 0, "e16 has no connections");
        equal(e17.connections.length, 0, "e17 has no connections");
    });

    test(": _jsPlumb.reset", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");

        _jsPlumb.reset();

        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint e16 has been deleted");
        var g = _jsPlumb.getEndpoint(e17);
        equal(g, null, "endpoint e17 has been deleted");
    });

    test(": _jsPlumb.reset (endpoints and connections both removed)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");

        _jsPlumb.reset();

        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint e16 has been deleted");
        var g = _jsPlumb.getEndpoint(e17);
        equal(g, null, "endpoint e17 has been deleted");
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });

    test(": removeAllEndpoints, referenced as string", function () {
        var d1 = support.addDiv("d1");
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.removeAllEndpoints(d1);
        _jsPlumb.repaintEverything();

        _jsPlumb.addEndpoint(d1);
        equal(_jsPlumb.getEndpoints(d1).length, 1, "one endpoint for the given element");

        expect(1);
    });

    test(": removeAllEndpoints, referenced as selector", function () {
        var d1 = support.addDiv("d1");
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.removeAllEndpoints(d1);

        _jsPlumb.repaintEverything();

        _jsPlumb.addEndpoint(d1);
        equal(_jsPlumb.getEndpoints(d1).length, 1, "one endpoint for the given element");

        expect(1);
    });

    test(": removeAllEndpoints, endpointHoverStyle active", function () {

        _jsPlumb.importDefaults({
            endpointHoverStyle: {
                fill: "#808080",
                stroke: "#808080",
                strokeWidth: 6,
            }
        })

        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");

        var ep11 = _jsPlumb.addEndpoint(d1, {anchor:"Left"});
        var ep12 = _jsPlumb.addEndpoint(d1, {anchor:"Right"});

        var ep21 = _jsPlumb.addEndpoint(d2, {anchor:"Left"});
        var ep22 = _jsPlumb.addEndpoint(d2, {anchor:"Right"});

        _jsPlumb.connect({source:ep11, target:ep22})

        equal(document.querySelectorAll(".jtk-endpoint").length, 4, "4 endpoints in the DOM")

        _jsPlumb.removeAllEndpoints(d1);

        equal(document.querySelectorAll(".jtk-endpoint").length, 2, "2 endpoints in the DOM after remove all")


    });

    /*
    jsPlumbInstance = newInstance({
        container: container.value,
        ,
      });
      renderConnections();
    });

    const renderConnections = () => {
      const node1Endpoints = jsPlumbInstance.addEndpoints(
        node1.value,
        nodes.node1.endpoints
      );
      const node2Endpoints = jsPlumbInstance.addEndpoints(
        node2.value,
        nodes.node2.endpoints
      );

      const node3Endpoints = jsPlumbInstance.addEndpoints(
        node3.value,
        nodes.node3.endpoints
      );
      jsPlumbInstance.connect({
        source: node1Endpoints[1],
        target: node2Endpoints[0],
      });
      jsPlumbInstance.connect({
        source: node1Endpoints[0],
        target: node3Endpoints[0],
      });

      jsPlumbInstance.connect({
        source: node2Endpoints[1],
        target: node3Endpoints[1],
      });
    };
    const removeEndpoints = (node) => {
      console.log("node", node);
      debugger
      jsPlumbInstance.removeAllEndpoints(node);
    };

    return {
      container,
      node1,
      node2,
      removeEndpoints,
      node3,
      renderConnections,
    };
  },
};
</script>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#container {
  width: 100%;
  height: 900px;
  &:hover {
    background-color: lightcyan;
  }
}
.node {
  z-index: 2;
  background-color: white;
  position: absolute;
  left: 200px;
  top: 200px;
  border: 2px solid
     */

    //
    //test(": removeAllEndpoints - element already deleted", function() {
    //var d1 = support.addDiv("d1");
    // _jsPlumb.addEndpoint(d1);
    // _jsPlumb.addEndpoint(d1);
    // _jsPlumb.addEndpoint(d1);

    // d1.remove();
    // _jsPlumb.removeAllEndpoints("d1");
    // _jsPlumb.repaintEverything();

     //expect(0);
    // });

    // test(": jsPlumb.remove, element identified by string", function () {
    //     var d1 = support.addDiv("d1");
    //     var e1 = _jsPlumb.addEndpoint(d1);
    //
    //     _jsPlumb.unmanage(d1);
    //
    //     _jsPlumb.repaintEverything(); // shouldn't complain
    //
    //     equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the given element");
    //     //equal(e1.endpoint, null, "e1 cleaned up");
    // });

    test(": jsPlumb.remove, element provided as DOM element", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.unmanage(d1);

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints(d1).length, 0, "no endpoints for the given element");

        ok(d1.parentNode != null, "d1 is still in the DOM")
    });

    test(": jsPlumb.remove, element provided as DOM element, also remove from DOM", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.unmanage(d1, true);

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints(d1).length, 0, "no endpoints for the given element");

        ok(d1.parentNode == null, "d1 is no longer in the DOM")
    });

    test(": jsPlumb.remove, element identified by string, nested endpoints", function () {
        var d1 = support.addDiv("d1", null, null, 50, 50, 100, 100),
            d2 = support.addDiv("d2", null, null, 250, 250, 100, 100),
            d3 = support.addDiv("d3", null, null, 450, 450, 100, 100);
        d1.appendChild(d2);
        d1.appendChild(d3);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d3);

        equal(_jsPlumb.getEndpoints(d1).length, 1, " 1 endpoint exists for the parent div");
        equal(_jsPlumb.getEndpoints(d2).length, 2, " 2 endpoints exist for the first nested div");
        equal(_jsPlumb.getEndpoints(d3).length, 1, " 1 endpoint exists for the first nested div");

        _jsPlumb.unmanage(d1);

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints(d1).length, 0, "no endpoints for the main div");
        equal(_jsPlumb.getEndpoints(d2).length, 0, "no endpoints for the nested div");
        equal(_jsPlumb.getEndpoints(d3).length, 0, "no endpoints for the nested div");

    });

    test(": jsPlumb.remove, nested element, element identified by string, nested endpoints", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        d1.appendChild(d2);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d2);

        _jsPlumb.unmanage(d2);

        _jsPlumb.repaint(d1); // shouldn't complain

        equal(_jsPlumb.getEndpoints(d1).length, 0, "no endpoints for the main div");
        equal(_jsPlumb.getEndpoints(d2).length, 0, "no endpoints for the nested div");

        expect(2);
    });

    test("jsPlumb.remove fires connection:detach events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d3});

        var o = 0;
        _jsPlumb.bind("connection:detach", function () {
            o++;
        });

        _jsPlumb.unmanage(d1);
        equal(o, 2, "connection:detach event was fired twice.");

    });

    test("jsPlumb.removeAllEndpoints fires connection:detach events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d3});

        var o = 0;
        _jsPlumb.bind("connection:detach", function () {
            o++;
        });

        _jsPlumb.removeAllEndpoints(d1);
        equal(o, 2, "connection:detach event was fired twice.");

    });


    //
     //I'm on the fence about this one.  There is a method you can call to tell jsPlumb that an element
     //has been deleted, so in theory you should not get into a situation where you are doing what this
     //test does.  But you can of course get there accidentally, which is one reason why it would be good
     //for this test to exist.
     //test(": deleting endpoints of deleted element should not fail", function() {
     //var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
     //var ep1 = _jsPlumb.addEndpoint(d1);
     //_jsPlumb.addEndpoint(d1);
     //_jsPlumb.addEndpoint(d1);
     //_jsPlumb.connect({source:ep1, target:"d2"});
     //d1.remove();
     //var eps = _jsPlumb.getEndpoints(d1);
     //equal(eps.length, 3, "there are three endpoints for d1");
     //for (var i = 0; i < eps.length; i++) {
     //_jsPlumb.deleteEndpoint(eps[i]);
     //}
     //eps = _jsPlumb.getEndpoints("d1");
     //equal(eps, null, "there are zero endpoints for d1");
     //equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the given element");
     //});



    test(": _jsPlumb.addEndpoint (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [0, 0.5, 0, -1]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Top"}),
            sa = e16._anchor.locations[0],
            ta = e17._anchor.locations[0];

        var e16l = _jsPlumb.router.getEndpointLocation(e16)

        equal(sa.x, 0);
        equal(sa.y, 0.5);
        equal(ta.x, 0.5);
        equal(ta.y, 0);
    });


    test(": _jsPlumb.addEndpoint (simple case, dynamic anchors)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["Top", "Bottom"]}),
            sa = e16._anchor,
            ta = e17._anchor;
        equal(sa.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(ta.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.addEndpoint (simple case, two arg method)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, target: false}, {anchor: [0, 0.5, 0, -1]});
        var e17 = _jsPlumb.addEndpoint(d17, {target: true, source: false}, {anchor: "Top"}),
            sa = e16._anchor.locations[0],
            ta = e17._anchor.locations[0];
        equal(sa.x, 0);
        equal(sa.y, 0.5);
        equal(false, e16.isTarget);
        equal(true, e16.isSource);
        equal(ta.x, 0.5);
        equal(ta.y, 0);
        equal(true, e17.isTarget);
        equal(false, e17.isSource);
    });


    test(": _jsPlumb.addEndpoints (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoints(d16, [
            {source: true, target: false, anchor: [0, 0.5, 0, -1] },
            { target: true, source: false, anchor: "Top" }
        ]),
            sa = e16[0]._anchor.locations[0],
            ta = e16[1]._anchor.locations[0];
        equal(sa.x, 0);
        equal(sa.y, 0.5);
        equal(false, e16[0].isTarget);
        equal(true, e16[0].isSource);
        equal(ta.x, 0.5);
        equal(ta.y, 0);
        equal(true, e16[1].isTarget);
        equal(false, e16[1].isSource);
    });


    // test(": _jsPlumb.addEndpoint (empty array)", function () {
    //     _jsPlumb.addEndpoint([], {source: true});
    //     _jsPlumb.repaintEverything();
    //     expect(0);
    // });

    test(": _jsPlumb.addEndpoints (with reference params)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var refParams = {anchor: "Right"};
        var e16 = _jsPlumb.addEndpoints(d16, [
            {source: true, target: false},
            { target: true, source: false }
        ], refParams),
            sa = e16[0]._anchor.locations[0],
            ta = e16[1]._anchor.locations[0];
        equal(sa.x, 1);
        equal(sa.y, 0.5);
        equal(false, e16[0].isTarget);
        equal(true, e16[0].isSource);
        equal(ta.x, 1);
        equal(ta.y, 0.5);
        equal(true, e16[1].isTarget);
        equal(false, e16[1].isSource);
    });

    test(": _jsPlumb.addEndpoint (simple case, dynamic anchors, two arg method)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, target: false}, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {target: true, source: false}, {anchor: ["Top", "Bottom"]}),
            sa = e16._anchor,
            ta = e17._anchor;
        equal(sa.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(ta.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.defaults.endpointOverlays = [
            { type:"Label", options:{ id: "label" } }
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
    });



    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.defaults.endpointOverlays = [
            { type:"Label", options:{ id: "label" } }
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {
                overlays: [
                    {type:"Label", options:{ id: "label2", location: [ 0.5, 1 ] } }
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
        ok(e1.getOverlay("label2") != null, "endpoint 1 has overlay from addEndpoint call");
    });

    test(": _jsPlumb.addEndpoints (end point set label)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16),
            e2 = _jsPlumb.addEndpoint(d17);

        e1.setLabel("FOO");
        equal(e1.getLabel(), "FOO", "endpoint's label is correct");
    });

    test(": _jsPlumb.addEndpoints (end point set label in constructor, as string)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {label: "FOO"}),
            e2 = _jsPlumb.addEndpoint(d17);

        equal(e1.getLabel(), "FOO", "endpoint's label is correct");
    });



    test(": _jsPlumb.addEndpoints (end point set label in constructor, as function)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {label: function () {
                return "BAZ";
            }, labelLocation: 0.1}),
            e2 = _jsPlumb.addEndpoint(d17);

        equal(e1.getLabel(), "BAZ", "endpoint's label is correct");
        equal(e1.getLabelOverlay().location, 0.1, "endpoint's label's location is correct");
    });

    test(": jsPlumb.addEndpoint (events)", function () {
        var d16 = support.addDiv("d16"),
            click = 0,
            e16 = _jsPlumb.addEndpoint(d16, {
                source: true,
                target: false,
                anchor: [0, 0.5, 0, -1],
                events: {
                    click: function (ep) {
                        click++;
                    }
                }
            });
        e16.fire("click", function () {
            click++;
        });
        equal(click, 1, "click event was fired once");
    });


// ***************** setConnector ************************************************************



    test(": setConnector, check the connector is set", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");
        var def = {
            connector: { type:"Bezier", options:{ curviness: 45 } },
            container:"container"
        };
        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.connector.type, "Straight", "connector is the default");
        c._setConnector({type:"Bezier", options:{ curviness: 789 }});
        equal(def.connector.options.curviness, 45, "curviness unchanged by setConnector call");
    });

    test(": setConnector, overlays are retained", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");
        var def = {
            connector: { type:"Bezier", options:{ curviness: 45 } },
            container:"container"
        };
        var c = _jsPlumb.connect({
            source: d1, target: d2,
            overlays:[
                { type:"Label", options:{ label:"foo" } }
            ]
        });
        equal(c.connector.type, "Straight", "connector is the default");
        equal(_length(c.getOverlays()), 1, "one overlay on the connector");

        c._setConnector({type:"StateMachine", options:{ curviness: 789 }});
        equal(def.connector.options.curviness, 45, "curviness unchanged by setConnector call");
        equal(_length(c.getOverlays()), 1, "one overlay on the connector");
    });


// jsPlumb.connect, after makeSource has been called on some element


    test(": endpoint source and target scope", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var e16 = _jsPlumb.addEndpoint(d16, {scope: "foo"});
        var e18 = _jsPlumb.addEndpoint(d18, {scope: "bar"});
        var e17 = _jsPlumb.addEndpoint(d17, { scope: "foo" }); // give it a non-default anchor, we will check this below.

        var c = _jsPlumb.connect({source: e17, target: e16});
        ok(c != null, "connection with matching scope established");

        c = _jsPlumb.connect({source: e17, target: e18});
        ok(c == null, "connection with non-matching scope not established");
    });

    test(": endpoint source and target scope, multiple scope", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18"), d19 = support.addDiv("d19");
        var e16 = _jsPlumb.addEndpoint(d16, {scope: "foo baz", maxConnections: -1});
        var e18 = _jsPlumb.addEndpoint(d18, {scope: "bar"});
        var e17 = _jsPlumb.addEndpoint(d17, { scope: "baz", maxConnections: -1 }); // give it a non-default anchor, we will check this below.
        var e19 = _jsPlumb.addEndpoint(d17, { scope: "foo" }); // give it a non-default anchor, we will check this below.

        var c = _jsPlumb.connect({source: e17, target: e16});
        ok(c != null, "connection with matching scope established");

        c = _jsPlumb.connect({source: e17, target: e18});
        ok(c == null, "connection with non-matching scope not established");

        c = _jsPlumb.connect({source: e19, target: e16});
        ok(c != null, "connection with second matching scope established");
    });




// *********************** end of makeTarget (and associated methods) tests ************************ 



    test(": delete endpoints on detach, makeSource and makeTarget)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addSourceSelector("#d1")
        _jsPlumb.addTargetSelector("#d2")
        
        var c = _jsPlumb.connect({
            source: d1,
            target: d2
        });
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        // both endpoints should have been deleted, as they were both created automatically
        support.assertEndpointCount(d1, 0, _jsPlumb);
        support.assertEndpointCount(d2, 0, _jsPlumb);
    });

    test(": delete endpoints on detach, addEndpoint and makeTarget)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1);
        _jsPlumb.addTargetSelector("#d2");
        var c = _jsPlumb.connect({
            source: e,
            target: d2
        });
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        // only target endpoint should have been deleted, as the other was not added automatically
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 0, _jsPlumb);
    });

    test(": delete endpoints on detach, makeSource and addEndpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addSourceSelector("#d1");
        var e = _jsPlumb.addEndpoint(d2);
        var c = _jsPlumb.connect({
            source: d1,
            target: e
        });
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        // only source endpoint should have been deleted, as the other was not added automatically
        support.assertEndpointCount(d1, 0, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
    });



    function testConnectionCanvasClass(conn, clazz) {
        var el = support.getConnectionCanvas(conn);

        var cn = el.className,
            cns = cn.constructor == String ? cn : cn.baseVal;

        return cns.indexOf(clazz) != -1;
    }

    function testEndpointCanvasClass(ep, clazz) {
        var el = support.getEndpointCanvas(ep);

        var cn = el.className,
            cns = cn.constructor == String ? cn : cn.baseVal;

        return cns.indexOf(clazz) != -1;
    }

    function testConnectionElementClass(conn, clazz, elName) {
        var el = conn.connector[elName];
        var cn = el.className,
            cns = cn.constructor == String ? cn : cn.baseVal;

        return cns.indexOf(clazz) != -1;
    }



    test(": _jsPlumb.addEndpoint (setting cssClass on Endpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {cssClass: "CSS"});

        ok(testEndpointCanvasClass(e,"CSS"), "custom cssClass set correctly");
        ok(testEndpointCanvasClass(e, _jsPlumb.endpointClass), "basic endpoint class set correctly");
    });

    test(": _jsPlumb.addEndpoint (setting cssClass on blank Endpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {endpoint: "Blank", cssClass: "CSS"});
        ok(testEndpointCanvasClass(e, "CSS"), "custom cssClass set correctly");
        ok(testEndpointCanvasClass(e, _jsPlumb.endpointClass), "basic endpoint class set correctly");
    });



    test(": Connection.getOverlay method, existing overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{ id: "arrowOverlay" } }
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay != null);
    });

    test(": Connection.getOverlay method, non-existent overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{ id: "arrowOverlay" } }
        ] });
        var overlay = conn.getOverlay("IDONTEXIST");
        ok(overlay == null);
    });

    test(": Overlay.setVisible method", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{ id: "arrowOverlay" } }
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay.isVisible());
        overlay.setVisible(false);
        ok(!overlay.isVisible());
        overlay.setVisible(true);
        ok(overlay.isVisible());
    });



    test(": overlay events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var clicked = 0;
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays: [
                {
                    type:"Label",
                    options:{
                        label: "CONNECTION 1",
                        location: 0.3,
                        id: "label",
                        events: {
                            click: function (label, e) {
                                clicked++;
                            }
                        }
                    }
                }
            ]
        });
        var l = connection1.getOverlay("label");
        l.fire("click", l);
        equal(clicked, 1, "click event was fired once");
    });


    // this test is for the original detach function; it should stay working after i mess with it
    // a little.
    test(": _jsPlumb.detach (by element ids)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        var e3 = _jsPlumb.addEndpoint(d1);
        var e4 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        _jsPlumb.connect({ sourceEndpoint: e3, targetEndpoint: e4 });  // make two connections to be sure this works ;)
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        assertConnectionCount(e3, 1);
        assertConnectionCount(e4, 1);

        _jsPlumb.select({source: d1, target: d2}).deleteAll();

        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionCount(e3, 0);
        assertConnectionCount(e4, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });

    // detach is being made to operate more like connect - by taking one argument with a whole 
    // bunch of possible params in it.  if two args are passed in it will continue working
    // in the old way.
    test(": _jsPlumb.select+delete (params object, using element ids)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });
    //
    //test(": _jsPlumb.detach (params object, using target only)", function() {
     //var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
     //e1 = _jsPlumb.addEndpoint(d1, {maxConnections:2}),
     //e2 = _jsPlumb.addEndpoint(d2),
     //e3 = _jsPlumb.addEndpoint(d3);
     //_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
     //_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e3 });
     //assertConnectionCount(e1, 2);
     //assertConnectionCount(e2, 1);
     //assertConnectionCount(e3, 1);
     //_jsPlumb.detach({target:"d2"});
     //assertConnectionCount(e1, 1);
     //assertConnectionCount(e2, 0);
     //assertConnectionCount(e3, 1);
     //assertConnectionByScopeCount(_jsPlumb.defaultScope, 1);
     //});

    test(": _jsPlumb.select+delete (params object, using element objects)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });

    test(": _jsPlumb.select+delete (source and target as endpoint UUIDs)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {uuid: "abcdefg"});
        ok(_jsPlumb.getEndpoint("abcdefg") != null, "e1 exists");
        var e2 = _jsPlumb.addEndpoint(d2, {uuid: "hijklmn"});
        ok(_jsPlumb.getEndpoint("hijklmn") != null, "e2 exists");
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({uuids: ["abcdefg", "hijklmn"]}).deleteAll();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });

    test(": _jsPlumb.select+delete (sourceEndpoint and targetEndpoint supplied)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({ sourceEndpoint: e1, targetEndpoint: e2 }).deleteAll();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 0, _jsPlumb);
    });

    test(": _jsPlumb.makeDynamicAnchors (longhand)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var ep = _jsPlumb.addEndpoint(d1, {
            anchor:[[0.2, 0, 0, -1], [1, 0.2, 1, 0],[0.8, 1, 0, 1], [0, 0.8, -1, 0]]
        })

        var dynamicAnchor = ep._anchor

        var a = dynamicAnchor.locations
        equal(a.length, 4, "Dynamic Anchors has four anchors");
        // for (var i = 0; i < a.length; i++)
        //     ok(a[i].setPosition.constructor == Function, "anchor " + i + " well formed");
    });

    test(": Connection.isVisible/setVisible", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c1 = _jsPlumb.connect({source: d1, target: d2});
        var canvas = support.getConnectionCanvas(c1)
        equal(true, c1.isVisible(), "Connection is visible after creation.");
        c1.setVisible(false);
        equal(false, c1.isVisible(), "Connection is not visible after calling setVisible(false).");
        equal(canvas.style.display, "none");
        c1.setVisible(true);
        equal(true, c1.isVisible(), "Connection is visible after calling setVisible(true).");
        equal(support.getConnectionCanvas(c1).style.display, "");
    });


    test(": Endpoint.isVisible/setVisible basic test (no connections)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        equal(true, e1.isVisible(), "Endpoint is visible after creation.");
        e1.setVisible(false);
        equal(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
        equal(support.getEndpointCanvas(e1).style.display, "none");
        e1.setVisible(true);
        equal(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
        equal(support.getEndpointCanvas(e1).style.display, "block");
    });

    test(": Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should track changes in the source, because it has only this connection.)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        equal(true, e1.isVisible(), "Endpoint is visible after creation.");
        var c1 = _jsPlumb.connect({source: e1, target: e2});
        e1.setVisible(false);
        equal(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
        equal(false, e2.isVisible(), "other Endpoint is not visible either.");
        equal(false, c1.isVisible(), "connection between the two is not visible either.");

        e1.setVisible(true);
        equal(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
        equal(true, e2.isVisible(), "other Endpoint is visible too");
        equal(true, c1.isVisible(), "connection between the two is visible too.");
    });

    test(": Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should not track changes in the source, because it has another connection.)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2, { maxConnections: 2 }), e3 = _jsPlumb.addEndpoint(d3);
        equal(true, e1.isVisible(), "Endpoint is visible after creation.");
        var c1 = _jsPlumb.connect({source: e1, target: e2});
        var c2 = _jsPlumb.connect({source: e2, target: e3});

        e1.setVisible(false);
        equal(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
        equal(true, e2.isVisible(), "other Endpoint should still be visible.");
        equal(true, e3.isVisible(), "third Endpoint should still be visible.");
        equal(false, c1.isVisible(), "connection between the two is not visible either.");
        equal(true, c2.isVisible(), "other connection is visible.");

        e1.setVisible(true);
        equal(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
        equal(true, e2.isVisible(), "other Endpoint is visible too");
        equal(true, c1.isVisible(), "connection between the two is visible too.");
        equal(true, c2.isVisible(), "other connection is visible.");
    });

    // tests of the functionality that allows a user to specify that they want elements appended to the document body
    // test(" _jsPlumb.setContainer, specified with a selector", function () {
    //     _jsPlumb.setContainer(document.body);
    //     equal(document.getElementById("container").childNodes.length, 0, "container has no nodes");
    //     var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
    //     equal(document.getElementById("container").childNodes.length, 2, "container has two div elements");  // the divs we added have been added to the 'container' div.
    //     // but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
    //     _jsPlumb.connect({source: d1, target: d2});
    //     equal(document.getElementById("container").childNodes.length, 2, "container still has two div elements");
    // });

    // tests of the functionality that allows a user to specify that they want elements appended to some specific container.
    // test(" _jsPlumb.setContainer, specified with DOM element", function () {
    //     var newContainer = support.addDiv("newContainer", document.body)
    //
    //     //_jsPlumb.setContainer(document.getElementsByTagName("body")[0]);
    //     _jsPlumb.setContainer(newContainer);
    //
    //     equal(0, document.getElementById("container").childNodes.length);
    //     var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
    //     equal(2, newContainer.childNodes.length, "two divs added to the container");  // the divs we added have been added to the 'container' div.
    //     // but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
    //     var bodyElementCount = document.body.childNodes.length;
    //     _jsPlumb.connect({source: d1, target: d2});
    //     equal(2, document.getElementById("container").childNodes.length, "still only two children in container; elements were added to the body by _jsPlumb");
    //     // test to see if 3 elements have been added
    //     equal(bodyElementCount + 3, document.body.childNodes.length, "3 new elements added to the document body");
    // });

    test(" _jsPlumb.setContainer, cannot specify document or body", function () {

        try {
            _jsPlumb.setContainer(document)
            ok(false, "Not allowed to set document as container")
        }
        catch (e) {
            ok(true, "Not allowed to set document as container")
        }

        try {
            _jsPlumb.setContainer(document.body)
            ok(false, "Not allowed to set document body as container")
        }
        catch (e) {
            ok(true, "Not allowed to set document body as container")
        }

    });

    test(" _jsPlumb.setContainer, moves managed nodes", function () {
        var c2 = support.addDiv("c2", document.body);
        var c = container;

        equal(c.childNodes.length, 0, "container has no nodes");
        var d1 = support.addDiv("d1", c);
        equal(c.childNodes.length, 1, "container has one node");
        _jsPlumb.manage(d1);

        // d2 has d1 as the parent so it should not end up having the container as its parent.
        var d2 = support.addDiv("d2", d1);

        _jsPlumb.setContainer(c2);
        equal(d1.parentNode, c2, "managed node with no connections was moved");
        equal(c.childNodes.length, 0, "container has no nodes");
        equal(c2.childNodes.length, 2, "container 2 has two nodes (one is a text node)");
    });


    var _overlayTest = function(component, fn) {
        var o = component.getOverlays();
        for (var i in o)
            if (! fn(o[i])) return false;

        return true;
    };

    var _ensureContainer = function(component, container) {
        return _overlayTest(component, function(o) {
            return (o.canvas && o.canvas.parentNode == container) ||
                (o.path && o.path.parentNode.parentNode == container);
        });
    };


    test(" change Container programmatically", function () {

        _jsPlumb.setContainer(container);

        var newContainer = document.createElement("div");
        newContainer.id = "newContainer";
        document.body.appendChild(newContainer);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    { type: "Label", options:{ label: "FOO", id: "label" }}
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                overlays: [
                    { type: "Label", options:{ label: "FOO", id: "label" }}
                ]
            }),
            e3 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    { type: "Label", options:{ label: "FOO", id: "label" }}
                ]
            });

        var c = _jsPlumb.connect({
            source: e1, target: e2,
            paintStyle: {
                outline: 4,
                outlineStyle: "red",
                stroke: "red",
                strokeWidth: 2
            },
            overlays: [
                "Label", "Arrow"
            ]
        });

        equal(support.getEndpointCanvas(e1).parentNode, container, "e1 canvas parent is container");
        equal(support.getConnectionCanvas(c).parentNode, container, "connector parent is container");

        ok(_ensureContainer(e1, container), "all overlays for endpoint in container");
        ok(_ensureContainer(c, container), "all overlays for connection in container");

        _jsPlumb.setContainer(newContainer);

        equal(support.getEndpointCanvas(e1).parentNode, newContainer, "e1 canvas parent is newContainer");
        equal(support.getConnectionCanvas(c).parentNode, newContainer, "connector parent is newContainer");
        ok(_ensureContainer(e1, newContainer), "all overlays for endpoint in newContainer");
        ok(_ensureContainer(c, newContainer), "all overlays for connection in newContainer");
    });


    test(" detachable defaults to true when connection made between two endpoints", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2),
            c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.isDetachable(), true, "connection not detachable");
    });

    test(" connection detachable when target endpoint has connectionsDetachable set to true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2, {connectionsDetachable: true}),
            c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.isDetachable(), true, "connection detachable because connectionsDetachable was set on target endpoint");
    });

    test(" connection detachable when source endpoint has connectionsDetachable set to true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {connectionsDetachable: true}), e2 = _jsPlumb.addEndpoint(d2),
            c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.isDetachable(), true, "connection detachable because connectionsDetachable was set on source endpoint");
    });


    test(" Connector has 'type' member set", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.connector.type, "Straight", "Straight connector has type set");

        var c2 = _jsPlumb.connect({source: d1, target: d2, connector: "Bezier"});
        equal(c2.connector.type, "Bezier", "Bezier connector has type set");

        var c3 = _jsPlumb.connect({source: d1, target: d2, connector: "Flowchart"});
        equal(c3.connector.type, "Flowchart", "Flowchart connector has type set");
    });

    test(" Flowchart Connector has midpoint member set, and it ignores invalid numbers", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c1 = _jsPlumb.connect({source: d1, target: d2, connector: "Flowchart"});
        equal(c1.connector.midpoint, 0.5, "default midpoint is 0.5")
        var c2 = _jsPlumb.connect({source: d1, target: d2, connector: {type:"Flowchart", options:{ midpoint:0.2 }}});
        equal(c2.connector.midpoint, 0.2, "midpoint is set to 0.2")
        var c3 = _jsPlumb.connect({source: d1, target: d2, connector: {type:"Flowchart", options:{ midpoint:"not a number" }}});
        equal(c3.connector.midpoint, 0.5, "midpoint is set to 0.5, as the provided value could not be parsed")
    });

    test(" Endpoints have 'type' member set", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.endpoints[0].endpoint.type, "Dot", "Dot endpoint has type set");

        var c2 = _jsPlumb.connect({source: d1, target: d2, endpoints: ["Rectangle", "Blank"]});
        equal(c2.endpoints[1].endpoint.type, "Blank", "Blank endpoint has type set");
        equal(c2.endpoints[0].endpoint.type, "Rectangle", "Rectangle endpoint has type set");
    });

    test(" Overlays have 'type' member set", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays: [ "Arrow", "Label", "PlainArrow", "Diamond" ]
        });
        /*equal(c.overlays[0].type, "Arrow", "Arrow overlay has type set");
        equal(c.overlays[1].type, "Label", "Label overlay has type set");
        equal(c.overlays[2].type, "PlainArrow", "PlainArrow overlay has type set");
        equal(c.overlays[3].type, "Diamond", "Diamond overlay has type set");*/
        ok(_overlayTest(c, function(o) {
            return o.type != null;
        }, "type is set"));
    });


    test(" _jsPlumb.hide, original one-arg version", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = { source: true, target: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            c1 = _jsPlumb.connect({source: e1, target: e2, overlays:[ { type: "Label", options:{ id:"lbl"}}]});

        equal(true, c1.getOverlay("lbl").isVisible(), "overlay is visible");
        equal(true, c1.isVisible(), "Connection 1 is visible after creation.");
        equal(true, e1.isVisible(), "endpoint 1 is visible after creation.");
        equal(true, e2.isVisible(), "endpoint 2 is visible after creation.");

        _jsPlumb.hide(d1);

        equal(false, c1.getOverlay("lbl").isVisible(), "overlay is no longer visible");
        equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
        equal(true, e1.isVisible(), "endpoint 1 is still visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");

        _jsPlumb.show(d1);

        equal(true, c1.getOverlay("lbl").isVisible(), "overlay is no visible again");
        equal(true, c1.isVisible(), "Connection 1 is visible again.");
    });

    test(" _jsPlumb.hide, two-arg version, endpoints should also be hidden", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = { source: true, target: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            c1 = _jsPlumb.connect({source: e1, target: e2});

        equal(true, c1.isVisible(), "Connection 1 is visible after creation.");
        equal(true, e1.isVisible(), "endpoint 1 is visible after creation.");
        equal(true, e2.isVisible(), "endpoint 2 is visible after creation.");

        _jsPlumb.hide(d1, true);

        equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");

        _jsPlumb.show(d1);  // now show d1, but do not alter the endpoints. e1 should still be hidden

        equal(true, c1.isVisible(), "Connection 1 is visible again.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
    });

    test(" _jsPlumb.show, two-arg version, endpoints should become visible", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = { source: true, target: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            c1 = _jsPlumb.connect({source: e1, target: e2});

        _jsPlumb.hide(d1, true);

        equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");

        _jsPlumb.show(d1, true);  // now show d1, and alter the endpoints. e1 should be visible.

        equal(true, c1.isVisible(), "Connection 1 is visible again.");
        equal(true, e1.isVisible(), "endpoint 1 is visible again.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
    });

    test(" _jsPlumb.show, two-arg version, endpoints should become visible, but not all connections, because some other endpoints are  not visible.", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e = { source: true, target: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e11 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            e3 = _jsPlumb.addEndpoint(d3, e),
            c1 = _jsPlumb.connect({source: e1, target: e2}),
            c2 = _jsPlumb.connect({source: e11, target: e3});

        // we now have d1 connected to both d3 and d2.  we'll hide d1, and everything on d1 should be hidden.

        _jsPlumb.hide(d1, true);

        equal(false, c1.isVisible(), "connection 1 is no longer visible.");
        equal(false, c2.isVisible(), "connection 2 is no longer visible.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(false, e11.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
        equal(true, e3.isVisible(), "endpoint 3 is still visible.");

        // now, we will also hide d3. making d1 visible again should NOT result in c2 becoming visible, because the other endpoint
        // for c2 is e3, which is not visible.
        _jsPlumb.hide(d3, true);
        equal(false, e3.isVisible(), "endpoint 3 is no longer visible.");

        _jsPlumb.show(d1, true);  // now show d1, and alter the endpoints. e1 should be visible, c1 should be visible, but c2 should not.

        equal(true, c1.isVisible(), "Connection 1 is visible again.");
        equal(false, c2.isVisible(), "Connection 2 is not visible.");
        equal(true, e1.isVisible(), "endpoint 1 is visible again.");
        equal(true, e11.isVisible(), "endpoint 11 is visible again.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
        equal(false, e3.isVisible(), "endpoint 3 is still not visible.");
    });

    test("show/hide Overlays", function() {
        var c = _jsPlumb.connect({source:support.addDiv("d1"), target:support.addDiv("d2"), overlays:[
                { type: "Label", options:{ "id":"lbl" } }
        ]});

        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
        c.hideOverlays();
        //equal(c.getOverlay("lbl").canvas.style.display, "none", "overlay not visible");
        equal(c.getOverlay("lbl").isVisible(), false, "overlay is not visible");
        c.showOverlays();
        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
    });

     //
     //test for issue 132: label leaves its element in the DOM after it has been
     //removed from a connection.
     //
    test(" label cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Label", options:{id: "label", cssClass: "foo"}}
        ]});
        ok(_jsPlumb.getSelector(".foo").length == 1, "label element exists in DOM");
        c.removeOverlay("label");
        ok(_length(c.getOverlays()) == 0, "no overlays left on component");
        ok(_jsPlumb.getSelector(".foo").length == 0 , "label element does not exist in DOM");
    });


    test(" arrow cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{id: "arrow"}}
        ]});
        ok(c.getOverlay("arrow") != null, "arrow overlay exists");
        c.removeOverlay("arrow");
        ok(c.getOverlay("arrow") == null, "arrow overlay has been removed");
    });

    test(" label overlay provides getLabel and setLabel methods", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Label", options:{id: "label", label: "foo"}}
        ]});
        var o = c.getOverlay("label"), e = o.canvas;
        equal(e.innerHTML, "foo", "label text is set to original value");
        o.setLabel("baz");
        equal(e.innerHTML, "baz", "label text is set to new value 'baz'");
        equal(o.getLabel(), "baz", "getLabel function works correctly with String");
        // now try functions
        var aFunction = function () {
            return "aFunction";
        };
        o.setLabel(aFunction);
        equal(e.innerHTML, "aFunction", "label text is set to new value from Function");
        equal(o.getLabel(), "aFunction", "getLabel function works correctly with Function");
    });

    test(" label overlay custom css class", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Label", options:{
                id: "label",
                cssClass: "foo"
            }}
        ]});
        var o = c.getOverlay("label");
        ok(_jsPlumb.hasClass(o.canvas, "foo"), "label overlay has custom css class");
    });

    test(" parameters object works for Endpoint", function () {
        var d1 = support.addDiv("d1"),
            f = function () {
                alert("FOO!");
            },
            e = _jsPlumb.addEndpoint(d1, {
                source: true,
                parameters: {
                    "string": "param1",
                    "int": 4,
                    "function": f
                }
            });
        ok(e.parameters["string"] === "param1", "getParameter(String) works correctly");
        ok(e.parameters["int"] === 4, "getParameter(int) works correctly");
        ok(e.parameters["function"] == f, "getParameter(Function) works correctly");
    });


    test(" parameters object works for Connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            f = function () {
                alert("FOO!");
            };
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            parameters: {
                "string": "param1",
                "int": 4,
                "function": f
            }
        });
        ok(c.parameters["string"] === "param1", "getParameter(String) works correctly");
        ok(c.parameters["int"] === 4, "getParameter(int) works correctly");
        ok(c.parameters["function"] == f, "getParameter(Function) works correctly");
    });

    test(" parameters set on Endpoints and Connections are all merged, and merged correctly at that.", function () {
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv("d2"),
            e = _jsPlumb.addEndpoint(d1, {
                source: true,
                parameters: {
                    "string": "sourceEndpoint",
                    "int": 0,
                    "function": function () {
                        return "sourceEndpoint";
                    }
                }
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                target: true,
                parameters: {
                    "int": 1,
                    "function": function () {
                        return "targetEndpoint";
                    }
                }
            }),
            c = _jsPlumb.connect({source: e, target: e2, parameters: {
                "function": function () {
                    return "connection";
                }
            }});

        ok(c.parameters["string"] === "sourceEndpoint", "getParameter(String) works correctly");
        ok(c.parameters["int"] === 0, "getParameter(int) works correctly");
        ok(c.parameters["function"]() == "connection", "getParameter(Function) works correctly");
    });

    test(" Continuous anchor default face, no faces supplied", function () {
        var d3 = support.addDiv("d3"), ep = _jsPlumb.addEndpoint(d3, {
            anchor: "Continuous"
        }),
            a = ep._anchor

        equal(a.faces.length, 4, "default is all faces when no faces specified");
    });


    test(" Continuous anchor default face, faces supplied", function () {
        var d3 = support.addDiv("d3"), ep = _jsPlumb.addEndpoint(d3, {
            anchor: {type:"Continuous", options:{ faces: [ "bottom", "left" ] } }
        }), a = ep._anchor

        equal(a.faces.length, 2, "2 faces declared on continuous anchor")

        equal(jsPlumb.getDefaultFace(a), "bottom", "default is bottom");
        ok(jsPlumb.isEdgeSupported(a, "bottom"), "bottom edge supported");
        ok(jsPlumb.isEdgeSupported(a, "left"), "left edge supported");
        ok(!jsPlumb.isEdgeSupported(a, "right"), "right edge not supported");
        ok(!jsPlumb.isEdgeSupported(a, "top"), "top edge not supported");

        ok(!jsPlumb.isEdgeSupported(a, "unknown"), "unknown edge not supported");

        // TODO: support locking to a specific face.
        //ep.anchor.lock();
    });``

    test(" Continuous anchor current face is set", function () {
        var d3 = support.addDiv("d3", null, "", 50, 50, 200, 200),
            ep3 = _jsPlumb.addEndpoint(d3, {
                anchor: "Continuous"
            }),
            a3 = ep3._anchor,
            d4 = support.addDiv("d4", null, "", 50, 450, 200, 200),
            ep4 = _jsPlumb.addEndpoint(d4, {
                anchor: "Continuous"
            }),
            a4 = ep4._anchor

        _jsPlumb.connect({source:ep3, target:ep4});

        // we should have picked 'bottom' face for ep3 and 'top' for ep4, based on the orientation of their elements.
        equal(a3.currentFace, "bottom", "ep3's anchor is 'bottom'");
        equal(a4.currentFace, "top", "ep4's anchor is 'top'");

        // move d3, redraw, and check the anchors have changed appropriately.
        d3.style.top = "1050px";
        _jsPlumb.revalidate(d3);
        equal(a3.currentFace, "top", "ep3's anchor is 'top' after d3 moved below d4");
        equal(a4.currentFace, "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");
    });

    test(" Continuous anchor cannot set current face to an unsupported face", function () {
        var d3 = support.addDiv("d3", null, "", 50, 50, 200, 200),
            ep3 = _jsPlumb.addEndpoint(d3, {
                anchor: "ContinuousRight"
            }),
            a3 = ep3._anchor,
            d4 = support.addDiv("d4", null, "", 50, 450, 200, 200),
            ep4 = _jsPlumb.addEndpoint(d4, {
                anchor: "ContinuousLeft"
            }),
            a4 = ep4._anchor

        _jsPlumb.connect({source:ep3, target:ep4});

        // we should have picked 'bottom' face for ep3 and 'top' for ep4, based on the orientation of their elements.
        equal(a3.currentFace, "right", "ep3's anchor is 'bottom'");
        equal(a4.currentFace, "left", "ep4's anchor is 'top'");

        a3.currentFace = "top"
        equal(a3.currentFace, "right", "current face could not be changed to `top` as it is not supported")

        // // move d3, redraw, and check the anchors have changed appropriately.
        // d3.style.top = "1050px";
        // _jsPlumb.revalidate(d3);
        // equal(a3.currentFace, "top", "ep3's anchor is 'top' after d3 moved below d4");
        // equal(a4.currentFace, "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");
    });

    test(" Continuous anchor lock current face", function () {
        var d3 = support.addDiv("d3", null, "", 50, 50, 200, 200),
            ep3 = _jsPlumb.addEndpoint(d3, {
                anchor: "Continuous"
            }),
            a3 = ep3._anchor,
            d4 = support.addDiv("d4", null, "", 50, 450, 200, 200),
            ep4 = _jsPlumb.addEndpoint(d4, {
                anchor: "Continuous"
            }),
            a4 = ep4._anchor;

        _jsPlumb.connect({source:ep3, target:ep4});

        // as before, we should have picked 'bottom' face for ep3 and 'top' for ep4, based on the orientation of their elements.
        equal(a3.currentFace, "bottom", "ep3's anchor is 'bottom'");
        equal(a4.currentFace, "top", "ep4's anchor is 'top'");

        // lock ep3's face, move, redraw, check that only ep4's face has changed.
        _jsPlumb.router.lock(a3)
        d3.style.top = "1050px";
        _jsPlumb.revalidate(d3);
        equal(a3.currentFace, "bottom", "ep3's anchor is 'bottom' after d3 moved below d4, because ep3's current face is locked");
        equal(a4.currentFace, "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");

        // unlock ep3's face, redraw, check that only ep4's face has changed.
        _jsPlumb.router.unlock(a3);
        _jsPlumb.revalidate(d3);
        equal(a3.currentFace, "top", "ep3's anchor is 'top' after ep3's current face unlocked and a redraw called");
        equal(a4.currentFace, "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");
    });

    test(" Continuous anchor lock current axis", function () {
        var d3 = support.addDiv("d3", null, "", 50, 50, 200, 200),
            ep3 = _jsPlumb.addEndpoint(d3, {
                anchor: "Continuous"
            }),
            d4 = support.addDiv("d4", null, "", 50, 450, 200, 200),
            ep4 = _jsPlumb.addEndpoint(d4, {
                anchor: "Continuous"
            }),
            a4 = ep4._anchor,
            a3 = ep3._anchor

        _jsPlumb.connect({source:ep3, target:ep4});

        // as before, we should have picked 'bottom' face for ep3 and 'top' for ep4, based on the orientation of their elements.
        equal(a3.currentFace, "bottom", "ep3's anchor is 'bottom'");
        equal(a4.currentFace, "top", "ep4's anchor is 'top'");

        // move d3 to the right of d4, redraw, check that the anchor faces are correct

        d3.style.top = "450px";
        d3.style.left = "450px";
        _jsPlumb.revalidate(d3);
        equal(a3.currentFace, "left", "ep3's anchor is 'left' after d3 moved to the right of d4");
        equal(a4.currentFace, "right", "ep4's anchor is 'right' after d3 moved to the right of d4");

        // lock ep3's face, move, redraw, check that ep3's axis is 'right' (on the x axis; the choice of right is
        // a result of the face picking algorithm. it's directly underneath so it could be left or right without
        // affecting the user's perception)
        //a3.lockCurrentAxis();
        _jsPlumb.router.lockCurrentAxis(a3)
        d3.style.top = "1050px";
        d3.style.left = "0px";
        _jsPlumb.revalidate(d3);
        equal(a3.currentFace, "right", "ep3's anchor is 'right' after d3 moved below d4, because ep3's current axis is locked");
        equal(a4.currentFace, "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");

        // now move d3 over to the right far enough that the anchor would ordinarily switch to 'top', but the axis is locked.
        d3.style.top = "1050px";
        d3.style.left = "350px";
        _jsPlumb.revalidate(d3);
        equal(a3.currentFace, "left", "ep3's anchor is 'left' after d3 moved below d4, because ep3's current axis is locked");
        equal(a4.currentFace, "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");

        // unlock the axis for ep3, redraw. should move to 'top' now.
        _jsPlumb.router.unlockCurrentAxis(a3);
        _jsPlumb.revalidate(d3);
        equal(a3.currentFace, "top", "ep3's anchor is 'top' after axis unlocked");
        equal(a4.currentFace, "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");
    });


    test(" importDefaults", function () {
        _jsPlumb.defaults.anchors = ["Left", "Right"];
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv(d2),
            c = _jsPlumb.connect({source: d1, target: d2}),
            e = c.endpoints[0],
            a = e._anchor.locations[0]

        equal(a.x, 0, "left middle anchor");
        equal(a.y, 0.5, "left middle anchor");

        _jsPlumb.importDefaults({
            anchors: ["TopLeft", "TopRight"]
        });

        var conn = _jsPlumb.connect({source: d1, target: d2}),
            e1 = conn.endpoints[0], e2 = conn.endpoints[1],
            a1 = e1._anchor.locations[0],
            a2 = e2._anchor.locations[0]

        equal(a1.x, 0, "top leftanchor");
        equal(a2.y, 0, "top left anchor");
        equal(a2.x, 1, "top right anchor");
        equal(a2.y, 0, "top right anchor");

    });


    test(" restoreDefaults", function () {
        _jsPlumb.importDefaults({
            anchors: ["TopLeft", "TopRight"]
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), conn = _jsPlumb.connect({source: d1, target: d2}),
            e1 = conn.endpoints[0], e2 = conn.endpoints[1],
            a1 = e1._anchor.locations[0],
            a2 = e2._anchor.locations[0]

        equal(a1.x, 0, "top leftanchor");
        equal(a2.y, 0, "top left anchor");
        equal(a2.x, 1, "top right anchor");
        equal(a2.y, 0, "top right anchor");

        _jsPlumb.restoreDefaults();

        var conn2 = _jsPlumb.connect({source: d1, target: d2}),
            e3 = conn2.endpoints[0], e4 = conn2.endpoints[1],
            a3 = e3._anchor.locations[0],
            a4 = e4._anchor.locations[0]

        equal(a3.x, 0.5, "bottom center anchor");
        equal(a3.y, 1, "bottom center anchor");
        equal(a4.x, 0.5, "bottom center anchor");
        equal(a4.y, 1, "bottom center anchor");
    });


    test("defaults are isolated", function() {

        var foo = document.createElement("FOO");
        document.body.appendChild(foo);
        ok(_jsPlumb.defaults.anchors[0] == null, "no anchors set (to take one example, one's enough)");
        var j = jsPlumb.newInstance({
            container:foo,
            anchors:["Left", "Right"]
        });

        ok(_jsPlumb.defaults.anchors[0] == null, "still no anchors set after providing Anchors to an instance");

        jsPlumb.createTestSupportInstanceQUnit(j).cleanup();
        foo.parentNode.removeChild(foo);

    });


    test(" endpoint hide/show should hide/show overlays", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    { type: "Label", options:{ id: "label", label: "foo" } }
                ]
            }),
            o = e1.getOverlay("label");

        ok(o.isVisible(), "overlay is initially visible");
        _jsPlumb.hide(d1, true);
        ok(!o.isVisible(), "overlay is no longer visible");
    });

    test(" connection hide/show should hide/show overlays", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2,
                overlays: [
                    { type: "Label", options:{ id: "label", label: "foo" } }
                ]
            }),
            o = c.getOverlay("label");

        ok(o.isVisible(), "overlay is initially visible");
        _jsPlumb.hide(d1, true);
        ok(!o.isVisible(), "overlay is no longer visible");
    });

    test(" select, basic test", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2}),
            s = _jsPlumb.select({source: d1});

        equal(s.length, 1, "one connection selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; dont filter on scope.", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d1, target: d2, scope: "BAR"}),
            s = _jsPlumb.select({source: d1});

        equal(s.length, 2, "two connections selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scope", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d1, target: d2, scope: "BAR"}),
            s = _jsPlumb.select({source: d1, scope: "FOO"});

        equal(s.length, 1, "one connection selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scopes", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d1, target: d2, scope: "BAR"}),
            c3 = _jsPlumb.connect({source: d1, target: d2, scope: "BAZ"}),
            s = _jsPlumb.select({source: d1, scope: ["FOO", "BAR"]});

        equal(s.length, 2, "two connections selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; scope but no scope filter; single source id", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d1, target: d2, scope: "BAR"}),
            c3 = _jsPlumb.connect({source: d1, target: d2, scope: "BAZ"}),
            c4 = _jsPlumb.connect({source: d2, target: d1, scope: "BOZ"}),
            s = _jsPlumb.select({source: d1});

        equal(s.length, 3, "three connections selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scopes; single source id", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d1, target: d2, scope: "BAR"}),
            c3 = _jsPlumb.connect({source: d1, target: d2, scope: "BAZ"}),
            c4 = _jsPlumb.connect({source: d2, target: d1, scope: "BOZ"}),
            s = _jsPlumb.select({source: d1, scope: ["FOO", "BAR", "BOZ"]});

        equal(s.length, 2, "two connections selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" setHoverSuspended overrides setHover on connections", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d1, target: d2, scope: "BAR"}),
            c3 = _jsPlumb.connect({source: d1, target: d2, scope: "BAZ"}),
            c4 = _jsPlumb.connect({source: d2, target: d1, scope: "BOZ"}),
            s = _jsPlumb.select({source: d1, scope: ["FOO", "BAR", "BOZ"]});

        _jsPlumb.hoverSuspended = true;
        s.setHover(true);
        ok(isHover(s.get(0)) === false, "connection did not set hover as jsplumb overrides it");
        _jsPlumb.hoverSuspended = false ;
        s.setHover(true);
        ok(isHover(s.get(0)), "connection did set hover as jsplumb override removed");
    });

    test(" select, basic test with multiple scopes; filter on scope; dont supply sourceid", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d1, target: d2, scope: "BAR"}),
            s = _jsPlumb.select({ scope: "FOO" });

        equal(s.length, 1, "two connections selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scope; dont supply sourceid", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: d2, target: d1, scope: "BAR"}),
            s = _jsPlumb.select({ scope: "FOO" });

        equal(s.length, 1, "two connections selected");
        equal(s.get(0).source.id, "d1", "d1 is connection source");

        s.setHover(true);
        ok(isHover(s.get(0)), "connection has had hover set to true");
        s.setHover(false);
        ok(!(isHover(s.get(0))), "connection has had hover set to false");
    });

    test(" select, two connections, with overlays", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({
                source: d1,
                target: d2,
                overlays: [
                    { type:"Label", options:{id: "l"}}
                ]
            }),
            c2 = _jsPlumb.connect({
                source: d1,
                target: d2,
                overlays: [
                    { type:"Label", options:{id: "l"}}
                ]
            }),
            s = _jsPlumb.select({source: d1});

        equal(s.length, 2, "two connections selected");
        ok(s.get(0).getOverlay("l") != null, "connection has overlay");
        ok(s.get(1).getOverlay("l") != null, "connection has overlay");
    });

    test(" select, chaining with setHover and hideOverlay", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays: [
                { type:"Label", options:{id: "l"}}
            ]
        }),
        s = _jsPlumb.select({source: d1});

        s.setHover(false).hideOverlay("l");

        ok(!(isHover(s.get(0))), "connection is not hover");
        ok(!(s.get(0).getOverlay("l").isVisible()), "overlay is not visible");
    });

    test(" select, .each function", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: document.getElementById("d" + i),
                target: document.getElementById("d" + (i * 10))
            });
        }

        var s = _jsPlumb.select();
        equal(s.length, 5, "there are five connections");

        var t = "";
        s.each(function (connection) {
            t += "f";
        });
        equal("fffff", t, ".each is working");
    });

    test(" select, multiple connections + chaining", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: document.getElementById("d" + i),
                target: document.getElementById("d" + (i * 10)),
                overlays: [
                    { type:"Arrow", options:{location: 0.3}},
                    { type:"Arrow", options:{location: 0.7}}
                ]
            });
        }

        var s = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").setHover(false).setLabel("baz");
        equal(s.length, 5, "there are five connections");

        for (var j = 0; j < 5; j++) {
            equal(_length(s.get(j).getOverlays()), 1, "one overlay: the label");
            equal(s.get(j).parameters["foo"], "bar", "parameter foo has value 'bar'");
            ok(!(s.get(j).isHover()), "hover is set to false");
            equal(s.get(j).getLabel(), "baz", "label is set to 'baz'");
        }
    });

    // test(" select, simple getter", function () {
    //     for (var i = 1; i < 6; i++) {
    //         support.addDiv("d" + i);
    //         support.addDiv("d" + (i * 10));
    //         _jsPlumb.connect({
    //             source: "d" + i,
    //             target: "d" + (i * 10),
    //             label: "FOO"
    //         });
    //     }
    //
    //     var lbls = _jsPlumb.select().getLabel();
    //     equal(lbls.length, 5, "there are five labels");
    //
    //     for (var j = 0; j < 5; j++) {
    //         equal(lbls[j][0], "FOO", "label has value 'FOO'");
    //     }
    // });
    //
    // test(" select, getter + chaining", function () {
    //     for (var i = 1; i < 6; i++) {
    //         support.addDiv("d" + i);
    //         support.addDiv("d" + (i * 10));
    //         _jsPlumb.connect({
    //             source: "d" + i,
    //             target: "d" + (i * 10),
    //             label: "FOO"
    //         });
    //     }
    //
    //     var params = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").parameters["foo"];
    //     equal(params.length, 5, "there are five params");
    //
    //     for (var j = 0; j < 5; j++) {
    //         equal(params[j][0], "bar", "parameter has value 'bar'");
    //     }
    // });


    test(" select, deleteAll method", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source:document.getElementById( "d" + i ),
                target: document.getElementById("d" + (i * 10)),
                label: "FOO"
            });
        }

        var params = _jsPlumb.select().deleteAll();

        equal(_jsPlumb.select().length, 0, "there are no connections");
    });

    test(" select, repaint method", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: document.getElementById("d" + i),
                target: document.getElementById("d" + (i * 10)),
                label: "FOO"
            });
        }

        var len = _jsPlumb.select().repaint().length;

        equal(len, 5, "there are five connections");
    });


    // selectEndpoints
    test(" selectEndpoints, basic tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source:false, target:false}),
            e2 = _jsPlumb.addEndpoint(d1, {source:false, target:false});

        equal(_jsPlumb.selectEndpoints().length, 2, "there are two endpoints");
        equal(_jsPlumb.selectEndpoints({element: d1}).length, 2, "there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: d2}).length, 0, "there are 0 endpoints on d2");

        equal(_jsPlumb.selectEndpoints({source: d1}).length, 0, "there are zero source endpoints on d1");
        equal(_jsPlumb.selectEndpoints({target: d1}).length, 0, "there are zero target endpoints on d1");
        equal(_jsPlumb.selectEndpoints({source: d2}).length, 0, "there are zero source endpoints on d2");
        equal(_jsPlumb.selectEndpoints({target: d2}).length, 0, "there are zero target endpoints on d2");

        equal(_jsPlumb.selectEndpoints({source: d1, scope: "FOO"}).length, 0, "there are zero source endpoints on d1 with scope FOO");

        _jsPlumb.addEndpoint(d2, { scope: "FOO", source: true });
        equal(_jsPlumb.selectEndpoints({source: d2, scope: "FOO"}).length, 1, "there is one source endpoint on d2 with scope FOO");

        equal(_jsPlumb.selectEndpoints({element: [d2, d1]}).length, 3, "there are three endpoints between d2 and d1");
    });

    test(" selectEndpoints, basic tests, various input argument formats", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d1);

        equal(_jsPlumb.selectEndpoints({element: d1}).length, 2, "using id, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: d1}).length, 2, "using dom element, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: _jsPlumb.getSelector("#d1")}).length, 2, "using selector, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: _jsPlumb.getSelector(d1)}).length, 2, "using selector with dom element, there are two endpoints on d1");

    });

    test(" selectEndpoints, basic tests, scope", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {scope: "FOO"}),
            e2 = _jsPlumb.addEndpoint(d1);

        equal(_jsPlumb.selectEndpoints({element: d1}).length, 2, "using id, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: d1, scope: "FOO"}).length, 1, "using id, there is one endpoint on d1 with scope 'FOO'");
        _jsPlumb.addEndpoint(d1, {scope: "BAR"}),
            equal(_jsPlumb.selectEndpoints({element: d1, scope: "FOO"}).length, 1, "using id, there is one endpoint on d1 with scope 'BAR'");
        equal(_jsPlumb.selectEndpoints({element: d1, scope: ["BAR", "FOO"]}).length, 2, "using id, there are two endpoints on d1 with scope 'BAR' or 'FOO'");
    });

    test(" selectEndpoints, isSource tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source:true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d2, {source:true});

        equal(_jsPlumb.selectEndpoints({source: d1}).length, 1, "there is one source endpoint on d1");
        equal(_jsPlumb.selectEndpoints({target: d1}).length, 0, "there are zero target endpoints on d1");

        equal(_jsPlumb.selectEndpoints({source: d2}).length, 1, "there is one source endpoint on d2");

        equal(_jsPlumb.selectEndpoints({source: [d2, d1]}).length, 2, "there are two source endpoints between d1 and d2");
    });

    test(" selectEndpoints, isTarget tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {target:true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d2, {target:true});

        equal(_jsPlumb.selectEndpoints({target: d1}).length, 1, "there is one target endpoint on d1");
        equal(_jsPlumb.selectEndpoints({source: d1}).length, 0, "there are zero source endpoints on d1");

        equal(_jsPlumb.selectEndpoints({target: d2}).length, 1, "there is one target endpoint on d2");

        equal(_jsPlumb.selectEndpoints({target: [d2, d1]}).length, 2, "there are two target endpoints between d1 and d2");
    });

    test(" selectEndpoints, isSource + target tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source:true, target:true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d1, {source:true}),
            e4 = _jsPlumb.addEndpoint(d1, {target:true});

        equal(_jsPlumb.selectEndpoints({source:d1}).length, 2, "there are two source endpoints on d1");
        equal(_jsPlumb.selectEndpoints({target: d1}).length, 2, "there are two target endpoints on d1");

        equal(_jsPlumb.selectEndpoints({target: d1, source: d1}).length, 1, "there is one source and target endpoint on d1");

        equal(_jsPlumb.selectEndpoints({element: d1}).length, 4, "there are four endpoints on d1");

    });

    test(" selectEndpoints, delete endpoints", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source: true, target: true});

        equal(_jsPlumb.selectEndpoints({element: d1}).length, 1, "there is one endpoint on d1");
        _jsPlumb.selectEndpoints({source: d1}).deleteAll();
        equal(_jsPlumb.selectEndpoints({element: d1}).length, 0, "there are zero endpoints on d1");
    });

    test(" selectEndpoints, detach connections", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source: true, target: true}),
            e2 = _jsPlumb.addEndpoint(d2, {source: true, target: true});

        _jsPlumb.connect({source: e1, target: e2});

        equal(e1.connections.length, 1, "there is one connection on d1's endpoint");
        equal(e2.connections.length, 1, "there is one connection on d2's endpoint");

        _jsPlumb.selectEndpoints({source: d1}).deleteEveryConnection();

        equal(e1.connections.length, 0, "there are zero connections on d1's endpoint");
        equal(e2.connections.length, 0, "there are zero connections on d2's endpoint");
    });

    test(" selectEndpoints, hover tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source: true, target: true});

        equal(e1.isHover(), false, "hover not set");
        _jsPlumb.selectEndpoints({source: d1}).setHover(true);
        equal(e1.isHover(), true, "hover set");
        _jsPlumb.selectEndpoints({source: d1}).setHover(false);
        equal(e1.isHover(), false, "hover no longer set");
    });

    test(" selectEndpoints, setEnabled tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source: true, target: true});

        equal(e1.enabled, true, "endpoint is enabled");
        _jsPlumb.selectEndpoints({source: d1}).setEnabled(false);
        equal(e1.enabled, false, "endpoint not enabled");
    });

    test(" selectEndpoints, setEnabled tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {source: true, target: true});

        equal(e1.enabled, true, "endpoint is enabled");

        // var e = _jsPlumb.selectEndpoints({source: "d1"}).isEnabled();
        // equal(e[0][0], true, "endpoint enabled");
        // _jsPlumb.selectEndpoints({source: "d1"}).setEnabled(false);
        // e = _jsPlumb.selectEndpoints({source: "d1"}).isEnabled();
        // equal(e[0][0], false, "endpoint not enabled");
    });

// setPaintStyle/getPaintStyle tests

    test(" setPaintStyle", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), c = _jsPlumb.connect({source: d1, target: d2});
        c.setPaintStyle({stroke: "FOO", strokeWidth: 999});
        equal(c.paintStyleInUse.stroke, "FOO", "stroke was set");
        equal(c.paintStyleInUse.strokeWidth, 999, "strokeWidth was set");

        c.setHoverPaintStyle({stroke: "BAZ", strokeWidth: 444});

        _jsPlumb.setHover(c, true);

        equal(c.paintStyleInUse.stroke, "BAZ", "stroke was set");
        equal(c.paintStyleInUse.strokeWidth, 444, "strokeWidth was set");

        equal(c.getPaintStyle().stroke, "FOO", "getPaintStyle returns correct value");
        equal(c.getHoverPaintStyle().stroke, "BAZ", "getHoverPaintStyle returns correct value");
    });




// ******************* getEndpoints ************************************************

    test(" getEndpoints", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");

        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d1);

        var e = _jsPlumb.getEndpoints(d1),
            e2 = _jsPlumb.getEndpoints(d2);
        equal(e.length, 2, "two endpoints on d1");
        equal(e2.length, 1, "one endpoint on d2");
    });


// ------------- utility functions - math stuff, mostly --------------------------

    var tolerance = 0.00000005, withinTolerance = function (v1, v2, msg) {
        if (Math.abs(v1 - v2) < tolerance) ok(true, msg + "; expected " + v1 + " and got it");
        else {
            ok(false, msg + "; expected " + v1 + " got " + v2);
        }
    };

    var types = [
        { v: { "foo": "bar" }, t: "Object" },
        { v: null, t: "Null" },
        { v: 123, t: "Number" },
        { v: "foo", t: "String" },
        { v: [1, 2, 3], t: "Array" },
        { v: true, t: "Boolean" },
        { v: new Date(), t: "Date" },
        { v: function () {
        }, t: "Function" }
    ];

    test(" addClass method of Connection", function () {
        var d1 = support.addDiv("d1");
            var d2 = support.addDiv("d2");
            var c = _jsPlumb.connect({source: d1, target: d2, overlays:[
                    { type: "Label", options:{ id:"label", label:'hey'}}
            ]}), o = c.getOverlay("label");
            c.addClass("foo");
            ok(!(_jsPlumb.hasClass(support.getEndpointCanvas(c.endpoints[0]), "foo")), "endpoint does not have class 'foo'");
            ok(support.getConnectionCanvas(c).className.baseVal.indexOf("foo") != -1, "connection has class 'foo'");
            c.addClass("bar", true);
            ok(_jsPlumb.hasClass(support.getEndpointCanvas(c.endpoints[0]), "bar"), "endpoint has class 'bar'");
            c.removeClass("bar", true);
            ok(support.getConnectionCanvas(c).className.baseVal.indexOf("bar") == -1, "connection doesn't have class 'bar'");
            ok(!_jsPlumb.hasClass(support.getEndpointCanvas(c.endpoints[0]), "bar"), "endpoint doesnt have class 'bar'");

            ok(_jsPlumb.hasClass(o.canvas, "foo"), "overlay has class foo");

            c.addClass("foo2");
            ok(_jsPlumb.hasClass(o.canvas, "foo2"), "overlay has class foo2");
            ok(support.getConnectionCanvas(c).className.baseVal.indexOf("foo2") != -1, "connection has class 'foo2'");

            c.removeClass("foo2");
            ok(!_jsPlumb.hasClass(o.canvas, "foo2"), "overlay no longer has class foo2");
            ok(support.getConnectionCanvas(c).className.baseVal.indexOf("foo2") == -1, "connection no longer has class 'foo2'");

            c.addClass("foo2", true);
            ok(_jsPlumb.hasClass(o.canvas, "foo2"), "overlay has class foo2");
            ok(support.getConnectionCanvas(c).className.baseVal.indexOf("foo2") != -1, "connection has class 'foo2'");
    });

    test(" addClass via jsPlumb.select", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");
        equal(_jsPlumb.select().length, 0, "there are no connections");
        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select().length, 1, "there is one connection");
        _jsPlumb.select().addClass("foo");
        ok(!(_jsPlumb.hasClass(support.getEndpointCanvas(c.endpoints[0]), "foo")), "endpoint does not have class 'foo'");
        _jsPlumb.select().addClass("bar", true);
        ok(_jsPlumb.hasClass(support.getEndpointCanvas(c.endpoints[0]), "bar"), "endpoint hasclass 'bar'");
        _jsPlumb.select().removeClass("bar", true);
        ok(!(_jsPlumb.hasClass(support.getEndpointCanvas(c.endpoints[0]), "bar")), "endpoint doesn't have class 'bar'");
    });

    test(" : DOM adapter addClass/hasClass/removeClass/toggleClass", function () {
        var d1 = support.addDiv("d1");//, _d1 = [ d1 ];

        // add a single class and test for its existence	
        _jsPlumb.addClass(d1, "FOO");
        equal(d1.className, "FOO", "element has class FOO, using selector");
        ok(_jsPlumb.hasClass(d1, "FOO"), "element has class FOO, according to hasClass method");

        // add multiple classes and test for their existence
        _jsPlumb.addClass(d1, "BAZ BAR SHAZ");
        ok(_jsPlumb.hasClass(d1, "BAZ"), "element has class BAZ, according to hasClass method, DOM element");
        ok(_jsPlumb.hasClass(d1, "BAR"), "element has class BAR, according to hasClass method, DOM element");
        ok(_jsPlumb.hasClass(d1, "SHAZ"), "element has class SHAZ, according to hasClass method, DOM element");

        // remove one class
        _jsPlumb.removeClass(d1, "BAR");
        ok(!_jsPlumb.hasClass(d1, "BAR"), "element doesn't have class BAR, according to hasClass method, DOM element");

        // remove two more classes
        _jsPlumb.removeClass(d1, "BAZ SHAZ");
        ok(!_jsPlumb.hasClass(d1, "BAZ"), "element doesn't have class BAZ, according to hasClass method, DOM element");
        ok(!_jsPlumb.hasClass(d1, "SHAZ"), "element doesn't have class SHAZ, according to hasClass method, DOM element");

        // check FOO is still there
        ok(_jsPlumb.hasClass(d1, "FOO"), "element has class FOO, according to hasClass method, DOM element");

        // now for an SVG element.
        var s1 = _jsPlumb.svg.node("svg");
        document.body.appendChild(s1);
        _jsPlumb.addClass(s1, "SFOO");
        ok(_jsPlumb.hasClass(s1, "SFOO"), "SVG element has class SFOO, according to hasClass method, DOM element");

        _jsPlumb.addClass(s1, "BAZ BAR SHAZ");

        // remove one class
        _jsPlumb.removeClass(s1, "BAR");
        ok(!_jsPlumb.hasClass(s1, "BAR"), "SVG element doesn't have class BAR, according to hasClass method, DOM element");

        // remove two more classes
        _jsPlumb.removeClass(s1, "BAZ SHAZ");
        ok(!_jsPlumb.hasClass(s1, "BAZ"), "SVG element doesn't have class BAZ, according to hasClass method, DOM element");
        ok(!_jsPlumb.hasClass(s1, "SHAZ"), "SVG element doesn't have class SHAZ, according to hasClass method, DOM element");

        // check SFOO is still there
        ok(_jsPlumb.hasClass(s1, "SFOO"), "SVG element has class SFOO, according to hasClass method, DOM element");

        _jsPlumb.toggleClass(d1, "BAZ");
        ok(_jsPlumb.hasClass(d1, "BAZ"), "class toggled on");
        _jsPlumb.toggleClass(d1, "BAZ");
        ok(!_jsPlumb.hasClass(d1, "BAZ"), "class toggled off");
        _jsPlumb.toggleClass(d1, "BAZ");
        ok(_jsPlumb.hasClass(d1, "BAZ"), "class toggled back on");
        _jsPlumb.toggleClass(d1, "BAR");
        ok(_jsPlumb.hasClass(d1, "BAR"), "another class toggled on");

        var d2 = support.addDiv("d2");//, _d1 = [ d1 ]
        var d3 = support.addDiv("d3");
        d2.className = "multiple"
        d3.className = "multiple"

        var selector = document.querySelectorAll(".multiple")
        _jsPlumb.addClass(selector, "foo")
        ok(_jsPlumb.hasClass(d2, "foo"), "d2 has foo class")
        ok(_jsPlumb.hasClass(d3, "foo"), "d3 has foo class")

        _jsPlumb.removeClass(selector, "foo")
        ok(!_jsPlumb.hasClass(d2, "foo"), "d2 no longer has foo class")
        ok(!_jsPlumb.hasClass(d3, "foo"), "d3 no longer has foo class")

        _jsPlumb.toggleClass(selector, "foo")
        ok(_jsPlumb.hasClass(d2, "foo"), "d2 has foo class once more")
        ok(_jsPlumb.hasClass(d3, "foo"), "d3 has foo class once more")
    });

    test("endpointStyle on connect method", function () {
        support.addDivs(["d1", "d2"]);
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            endpointStyle: { fill: "blue" }
        });

        equal(support.getEndpointCanvas(c.endpoints[0]).childNodes[0].getAttribute("fill"), "blue", "endpoint style passed through by connect method");
    });

    /**
     * Tests that the `getOffset` function correctly ignores body scroll when adjusting for parent element scroll.
     * @method Test.offset_body_scroll
     */
    test("offset body scroll", function() {
        expect(0);
    });

    test("endpointStyle on connect method, with makeSource prepared element", function () {
        support.addDivs(["d1", "d2"]);
        _jsPlumb.addSourceSelector("#d1");

        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            endpointStyle: { fill: "blue" }
        });

        equal(support.getEndpointCanvas(c.endpoints[0]).childNodes[0].getAttribute("fill"), "blue", "endpoint style passed through by connect method");
    });



    test("setContainer does not cause multiple event registrations (issue 307)", function () {


        support.addDivs(["box1", "box2", "canvas"]);

        var clickCount = 0;
        var labelDef = {
            id: 'label-1',
            label: 'labeltext',
            events: {
                click: function (event) {
                    console.log('click on label');
                    clickCount++;
                }
            }
        };

        var connection = _jsPlumb.connect({
            source: box1,
            id: 'connector1',
            target: box2,
            anchors: ['Bottom', 'Left'],
            overlays:[
                { type: 'Label',options: labelDef }
            ]
        });


        _jsPlumb.trigger(connection.getOverlay("label-1").canvas, "click");

        equal(clickCount, 1, "1 click on overlay registered after first trigger");

        clickCount = 0;

         _jsPlumb.importDefaults({
            container: canvas
         });

        _jsPlumb.trigger(connection.getOverlay("label-1").canvas, "click");

        equal(clickCount, 1, "1 click on overlay registered");

        _jsPlumb.setContainer(canvas);
        clickCount = 0;
        _jsPlumb.trigger(connection.getOverlay("label-1").canvas, "click");

        equal(clickCount, 1, "1 click on overlay registered");

    });

    test("setContainer does not cause multiple event registrations, mousedown for drag", function () {

        support.addDivs(["box1", "box2", "canvas"]);
        box1.style.width = "50px"
        box1.style.height = "50px"

        canvas.style.width = "500px"
        canvas.style.height = "500px"

        _jsPlumb.manage(box1)

        equal(document.querySelectorAll(".jtk-endpoint").length, 0, "0 endpoints to start")

        _jsPlumb.addSourceSelector("#box1");

        _jsPlumb.trigger(box1, "mousedown");

        equal(document.querySelectorAll(".jtk-endpoint").length, 1, "1 endpoint after mousedown")

        _jsPlumb.trigger(box1, "mouseup");

        _jsPlumb.importDefaults({
            container: canvas
        });

        _jsPlumb.trigger(box1, "mousedown");

        equal(document.querySelectorAll(".jtk-endpoint").length, 1, "1 endpoint after mousedown")

        _jsPlumb.trigger(box1, "mouseup");

         _jsPlumb.setContainer(canvas);

        _jsPlumb.trigger(box1, "mousedown");

        equal(document.querySelectorAll(".jtk-endpoint").length, 1, "1 endpoint after mousedown")

        _jsPlumb.trigger(box1, "mouseup");

    });


    test("unbind a single event listener does not unbind them all", function() {
        var i = 0;
        var l1 = function() {
            i += 5;
        };
        var l2 = function() {
            i -= 6;
        };
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv("d2");

        _jsPlumb.bind("connection", l1);
        _jsPlumb.bind("connection", l2);

        _jsPlumb.connect({source:d1, target:d2});

        equal(i, -1,"both listeners fired");
        i = 0;

        // first test existing: unbind with no args unbinds everything.
        _jsPlumb.unbind("connection");
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, 0, "no listeners fired");

        // rebind and check
        _jsPlumb.bind("connection", l1);
        _jsPlumb.bind("connection", l2);
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, -1,"both listeners fired");

        i = 0;
        // unbind one.
        _jsPlumb.unbind("connection", l2);
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, 5, "only listener l1 fired");

        i = 0;
        _jsPlumb.unbind(l1);
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, 0, "no listeners fired");

    });

    test("bind multiple listeners via array (multiple events, one function)", function() {
        var count = 0;
        _jsPlumb.bind(["foo", "bar", "baz"], function() {
            count++;
        });

        _jsPlumb.fire("foo");
        equal(count, 1, "count is 1");
        _jsPlumb.fire("bar");
        equal(count, 2, "count is 2");
        _jsPlumb.fire("baz");
        equal(count, 3, "count is 3");
    });




// ------------------ issue 402...offset cache not cleared always --------------------
    test("offset cache cleared", function() {
       var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.connect({source:d1, target:d2});
        var id = d1.getAttribute("data-jtk-managed")
        var cd = _jsPlumb.viewport.getPosition(id);
       ok(cd != null, "d1 is cached");

        // reset and then move d1. get cached data and offset should have been updated.
        _jsPlumb.reset();
        d1.style.position = "absolute";
        d1.style.left = "5000px";
        var cd2 = _jsPlumb.viewport.getPosition("d1");
        ok(cd2 == null, "cache data cleared");
        _jsPlumb.connect({source:d1, target:d2});
        var cd3 = _jsPlumb.viewport.getPosition(id);
        ok(cd3 != null, "d1 is cached");


    });

    test("reset, all endpoints removed", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        _jsPlumb.connect({source:d1, target:d2});
        equal(2, _jsPlumb.selectEndpoints().length, "2 endpoints in the instance");
        equal(2, _jsPlumb.getContainer().querySelectorAll(".jtk-endpoint").length, "2 endpoints in the DOM");

        _jsPlumb.reset();
        equal(0, _jsPlumb.selectEndpoints().length, "0 endpoints in the instance");
        equal(0, _jsPlumb.getContainer().querySelectorAll(".jtk-endpoint").length, "0 endpoints in the DOM");
    });

    test("reset, and reset with optional retention of event bindings", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = false;
        _jsPlumb.bind("connection", function() { c = true; });
        _jsPlumb.connect({source:d1, target:d2});
        ok(c, "connection event fired");

        c = false;

        _jsPlumb.reset();
        _jsPlumb.connect({source:d1, target:d2});
        ok(c, "connection event fired after reset that did not unbind event listeners");

        c = false;

        _jsPlumb.reset(true);
        _jsPlumb.connect({source:d1, target:d2});
        ok(c, "connection event is fired after reset, because reset's default behaviour is not to unbind event listeners.");

    });


// click events on overlays

    test("overlay click event", function() {
            support.addDiv("d1");
            support.addDiv("d2");
        var count = 0;
            var c = _jsPlumb.connect({
                source: d1,
                target: d2,
                overlays:[
                    { type: "Label", options:{
                        id:"label",
                        label:'hey',
                        events:{
                            click:function() {
                                count++;
                            }
                        }
                    }},
                    { type: "Arrow", options:{
                        id:"arrow",
                        events:{
                            click:function() {
                                count++
                            }
                        }
                    }}
            ]}), o = c.getOverlay("label"), o2 = c.getOverlay("arrow");

        o.fire("click");
        ok(count == 1, "click event was triggered on label overlay");

        o2.fire("click");
        ok(count == 2, "click event was triggered on arrow overlay");
    });

    test("endpoint unmatched scopes", function() {
        var sourceEndpoint = {
                source: true,
                scope: "blue"
            }, targetEndpoint = {
                target:true
            },
            d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, sourceEndpoint),
            e2 = _jsPlumb.addEndpoint(d2, targetEndpoint);

        var c = _jsPlumb.connect({source:e1, target:e2});

        ok(c == null, "no connection as scopes dont match");
    });

    test("endpoint passes scope to connection, programmatic connection", function() {
        var sourceEndpoint = {
            source: true,
            scope: "blue"
            }, targetEndpoint = {
            target:true,
                scope:"blue"
            },
            d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, sourceEndpoint),
            e2 = _jsPlumb.addEndpoint(d2, targetEndpoint);

            var c = _jsPlumb.connect({source:e1, target:e2});

        equal(c.scope, "blue", "connection scope is blue.");
    });




// ------------------------------------------- groups ---------------------------------------------------------------



// -------------- endpoint clicks
    test("endpoint click", function() {
        var d = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d),
            c = 0,
            ec = 0;

        _jsPlumb.bind("connection:click", function() {
            c++;
        });

        _jsPlumb.bind("endpoint:click", function() {
            ec++;
        });

        // the SVG element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "click");

        // the path element
        _jsPlumb.trigger(support.getEndpointCanvas(e).childNodes[0], "click");

        // the main endpiint
        //_jsPlumb.trigger(e.canvas, "click");

        // each of those should have triggered a single click

        equal(ec, 2, "2 endpoint clicks");
        equal(c, 0, "no other clicks");
    });

    test("endpoint double click", function() {
        var d = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d),
            c = 0,
            ec = 0;

        _jsPlumb.bind("connection:dblclick", function() {
            c++;
        });

        _jsPlumb.bind("endpoint:dblclick", function() {
            ec++;
        });

        // the SVG element
        _jsPlumb.trigger(support.getEndpointCanvas(e).childNodes[0], "dblclick");

        // the path element
        //_jsPlumb.trigger(support.getEndpointCanvas(e).childNodes[0].childNodes[0], "dblclick");

        // the main endpoint element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "dblclick");

        // each of those should have triggered a single click

        equal(ec, 2, "2 endpoint dbl clicks");
        equal(c, 0, "no other dbl clicks");
    });

    test("endpoint mouseover/mouseout", function() {
        var d = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d),
            mm = 0,
            mo = 0;

        _jsPlumb.bind("endpoint:mouseover", function() {
            mm++;
        });

        _jsPlumb.bind("endpoint:mouseout", function() {
            mo++;
        });

        // the SVG element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "mouseover");

        // the path element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "mouseout");

        equal(mo, 1, "1 endpoint mouseout");
        equal(mm, 1, "1 endpoint mouseover");
    });

    test("endpoint mousedown/mouseup", function() {
        var d = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d),
            mm = 0,
            mo = 0;

        _jsPlumb.bind("endpoint:mousedown", function() {
            mm++;
        });

        _jsPlumb.bind("endpoint:mouseup", function() {
            mo++;
        });

        // the SVG element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "mousedown");

        // the path element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "mouseup");

        equal(mo, 1, "1 endpoint mousedown");
        equal(mm, 1, "1 endpoint mouseup");
    });

    test("connector click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2}),
            c = 0;

        _jsPlumb.bind("connection:click", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "click");

        // the SVG element
        _jsPlumb.trigger(support.getConnectionCanvas(conn), "click");

        // each of those should have triggered a single click

        equal(c, 2, "2 clicks in total");
    });

    test("connector dbl click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2}),
            c = 0;

        _jsPlumb.bind("connection:dblclick", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "dblclick");

        // the SVG element
        _jsPlumb.trigger(support.getConnectionCanvas(conn), "dblclick");

        // each of those should have triggered a single click

        equal(c, 2, "2 dblclicks in total");
    });

    test("connector mouseover/mouseout", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2}),
            mo = 0, mm = 0;

        _jsPlumb.bind("connection:mouseover", function() {
            mm++;
        });

        _jsPlumb.bind("connection:mouseout", function() {
            mo++;
        });

        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "mouseover");

        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "mouseout");

        equal(mo, 1, "1 connection mouseout");
        equal(mm, 1, "1 connection mouseover");
    });

    test("connector mousedown/mouseup", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2}),
            mo = 0, mm = 0;

        _jsPlumb.bind("connection:mousedown", function() {
            mm++;
        });

        _jsPlumb.bind("connection:mouseup", function() {
            mo++;
        });

        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "mousedown");

        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "mouseup");

        equal(mo, 1, "1 connection mousedown");
        equal(mm, 1, "1 connection mouseup");
    });

    test("arrow overlay click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                    { type: "Arrow", options:{ id:"lbl" }}
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("connection:click", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.path, "click");

        equal(c, 1, "1 click in total");
    });

    // this tests that clicking on an overlay causes its Connection to report a click.
    test("arrow overlay dblclick", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                    { type: "Arrow", options:{ id:"lbl" }}
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("connection:dblclick", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.path, "dblclick");
        _jsPlumb.trigger(lbl.path, "dblclick");

        // the SVG element
        _jsPlumb.trigger(lbl.path, "dblclick");

        // each of those should have triggered a single click

        equal(c, 3, "3 dblclicks in total");
    });

    test("label overlay click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                    { type: "Label", options:{ id:"lbl" }}
                ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("connection:click", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.canvas, "click");

        equal(c, 1, "1 click in total");
    });

    // this tests that clicking on an overlay causes its Connection to report a click.
    test("label overlay dblclick", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                    { type: "Label", options:{ id:"lbl" }}
                ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("connection:dblclick", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.canvas, "dblclick");
        _jsPlumb.trigger(lbl.canvas, "dblclick");

        // the SVG element
        _jsPlumb.trigger(lbl.canvas, "dblclick");

        // each of those should have triggered a single click

        equal(c, 3, "3 dblclicks in total");
    });

    test("retrieve endpoint params, Dot endpoint", function() {
       var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
           e = _jsPlumb.connect({
               source:d1,
               target:d2,
               endpoint:{type:"Dot", options:{ radius:250 }}
           });

        equal(e.endpoints[0].endpoint.radius, 250, "radius is set correctly and retrievable");
    });

    test("retrieve endpoint params, Rectangle endpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = _jsPlumb.connect({
                source:d1,
                target:d2,
                endpoint:{type:"Rectangle", options:{ width:250, height:250 }}
            });

        equal(e.endpoints[0].endpoint.width, 250, "width is set correctly and retrievable");
        equal(e.endpoints[0].endpoint.height, 250, "height is set correctly and retrievable");
        ok(e.endpoints[0].endpoint.x != null, "x is set and retrievable");
        ok(e.endpoints[0].endpoint.y != null, "y is set and retrievable");
    });

    test("endpoint deletion: no deletion by default", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 500, 500);
        var ep1 = _jsPlumb.addEndpoint(d1, { maxConnections:-1}), ep2 = _jsPlumb.addEndpoint(d2), ep3 = _jsPlumb.addEndpoint(d3);
        var c1 = _jsPlumb.connect({source:ep1, target:ep2});
        var c2 = _jsPlumb.connect({source:ep1, target:ep3});

        equal(_jsPlumb.select().length, 2, "two connections in the instance");
        equal(_jsPlumb.selectEndpoints().length, 3, "three endpoints in the instance");

        _jsPlumb.deleteConnection(c1);

        equal(_jsPlumb.select().length, 1, "one connection in the instance");
        equal(_jsPlumb.selectEndpoints().length, 3, "three endpoints in the instance");

        _jsPlumb.deleteEndpoint(ep1);
    });

    test("connectorClass specified in addEndpoint params", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var e1 = _jsPlumb.addEndpoint(d1, { anchor: "Top", connector:{type:"Flowchart", options:{cssClass: "connector"}}, endpoint: "Rectangle"} );
        _jsPlumb.connect({source:e1, target:d2});
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(e1.connections[0]), "connector", "connector class set"));

    });

    test("overlay location", function () {
        support.addDivs(["box1", "box2", "canvas"]);

        _jsPlumb.importDefaults({
            container: canvas
        });

        _jsPlumb.setContainer(canvas);

        var connection = _jsPlumb.connect({ source: box1, target: box2 });
        var o = connection.addOverlay({ type:'Label', options:{label:"first label"}});
        equal(0.5, o.location, "label is at default location of 0.5");

        var connection2 = _jsPlumb.connect({ source: box1, target: box2 });
        connection2.mergeData({labelLocation:0.2});
        var o2 = connection2.addOverlay({ type:'Label', options:{label:"second label"}});
        equal(0.2, o2.location, "label is at location of 0.2, which is the value of the `labelLocation` value in the connection's data");

        var connection3 = _jsPlumb.connect({ source: box1, target: box2 });
        connection3.mergeData({theattribute:0.1});
        var o3 = connection3.addOverlay({ type:'Label', options:{label:"second label", labelLocationAttribute:"theattribute"}});
        equal(0.1, o3.location, "label is at location of 0.1, which is the value of an attribute whose name was specified in the addOverlay call, and whose value is in the connection data");

    });

    test("connection.replaceEndpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                endpoint:{type: "Dot", options:{ radius:15 } }
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                endpoint:{type: "Dot", options:{ radius:25 } }
            }),
            c = _jsPlumb.connect({source:e1, target:e2});

        var d1Id = d1.getAttribute("data-jtk-managed")
        var d2Id = d2.getAttribute("data-jtk-managed")

        support.assertManagedEndpointCount(d1, 1)
        support.assertManagedEndpointCount(d2, 1)

        equal(15, c.endpoints[0].endpoint.radius, "endpoint 1 has radius 15");
        equal(25, c.endpoints[1].endpoint.radius, "endpoint 2 has radius 25");

        equal("Dot", c.endpoints[0].endpoint.type, "endpoint 1 is a Dot");
        equal("Dot", c.endpoints[1].endpoint.type, "endpoint 2 is a Dot");

        equal("Dot", _jsPlumb._managedElements[d1Id].endpoints[0].endpoint.type, "endpoint 1 is a Dot");
        equal("Dot", _jsPlumb._managedElements[d2Id].endpoints[0].endpoint.type, "endpoint 2 is a Dot");

        c.replaceEndpoint(0, { type:"Rectangle", options:{width:50,height:50}});
        c.replaceEndpoint(1, {type: "Dot", options:{radius:100}});

        support.assertManagedEndpointCount(d1, 1)
        support.assertManagedEndpointCount(d2, 1)

        equal(50, c.endpoints[0].endpoint.width, "endpoint 1 now has width 50");
        equal(50, c.endpoints[0].endpoint.height, "endpoint 1 now has height 50");
        equal(100, c.endpoints[1].endpoint.radius, "endpoint 2 now has radius 100");

        equal("Rectangle", c.endpoints[0].endpoint.type, "endpoint 1 is now a Rectangle");
        equal("Dot", c.endpoints[1].endpoint.type, "endpoint 2 is now a Dot");

        equal("Rectangle", _jsPlumb._managedElements[d1Id].endpoints[0].endpoint.type, "endpoint 1 is now a Rectangle");
        equal("Dot", _jsPlumb._managedElements[d2Id].endpoints[0].endpoint.type, "endpoint 2 is now a Dot");
    });

    /**
     * created to track issue 1012, but unfortunately the issue itself could not be reproduced.
     */
    test("shadow root", function() {
        const newContainer = support.addDiv("newContainer")

        if (newContainer.attachShadow != null) {

            newContainer.style.left = "0px"
            newContainer.style.top = "0px"
            const shadowRoot = newContainer.attachShadow({mode: 'open'});
            const canvas = support.addDiv("canvas", shadowRoot)

            canvas.style.outline = "1px solid"
            canvas.style.width = "1000px";
            canvas.style.height = "800px";
            _jsPlumb.setContainer(canvas)
            const d1 = support.addDiv("d1", canvas, null, 50, 50, 150, 150)
            d1.style.outline = "1px solid"
            const d2 = support.addDiv("d2", canvas, null, 350, 350, 150, 150)
            d2.style.outline = "1px solid"

            var c = _jsPlumb.connect({source: d1, target: d2, anchors: ["Bottom", "Top"]})
            var a1 = _jsPlumb.router.getEndpointLocation(c.endpoints[0])
            var a2 = _jsPlumb.router.getEndpointLocation(c.endpoints[1])
            equal(125, a1.curX, "anchor 1 x is correct")
            equal(200, a1.curY, "anchor 1 y is correct")

            equal(425, a2.curX, "anchor 2 x is correct")
            equal(350, a2.curY, "anchor 2 y is correct")
        } else {
            equal(1,1,"This browser does not support shadow DOM");
        }


    })

    test("insert sorted", function() {
        var a = [1,2,3,4,6]
        jsPlumb.insertSorted(5, a, function(a, b) { return a - b})
        equal(5, a[4], "value '5' inserted in the correct place")
    })

    test("insert sorted, descending", function() {
        var a = [6,4,3,2,1]
        jsPlumb.insertSorted(5, a, function(a, b) { return a - b}, true)
        equal(5, a[1], "value '5' inserted in the correct place")
    })

    test("isNodeList/isArrayLike", function() {
        var d = document.createElement("div"), d2 = document.createElement("div")
        d.className = "foo"
        d2.className = "foo"

        var str = "astring"
        var sel = document.querySelectorAll(".foo")
        var array = [ d, d2 ]

        equal(true, jsPlumb.isNodeList(sel), "NodeList is identified correctly")
        equal(false, jsPlumb.isNodeList(array), "Array is NOT identified as a NodeList")
        equal(false, jsPlumb.isNodeList(str), "string is NOT identified as a NodeList")

        equal(true, jsPlumb.isArrayLike(sel), "selector identified as array like")
        equal(true, jsPlumb.isArrayLike(array), "array identified as array like")
        equal(false, jsPlumb.isArrayLike(str), "string is NOT identified as array like")
    })

    test("merge function, default behaviour", function() {
        var a = {
            "foo":"parent",
            "bar":"parent",
            "fooNumber":1,
            "barNumber":1,
                "fooBoolean":true,
                "barBoolean":true,
            "fooArray":[1,2,3],
                "barArray":[4,5,6],
            "fooObject":{
                "foo":"parent",
                "bar":"parent"
            },
            "barObject":{
                "foo":"parent",
                "bar":"parent"
            },
            "fooFunction":function() { return "parent"},
                "barFunction":function() { return "parent"}
        },
        b = {
            "foo":"child",
            "fooNumber":2,
            "fooBoolean":false,
            "fooArray":[4,5],
            "fooObject":{
                "foo":"child"
            },
            "fooFunction":function() { return "child"}
        },
        c = jsPlumb.merge(a, b)

        equal(c.foo, "child", "foo property overridden; child value present")
        equal(c.bar, "parent", "bar property not overridden; no child value")
        equal(c.fooNumber, 2, "fooNumber property overridden; child value present")
        equal(c.barNumber, 1, "barNumber property not overridden; no child value")
        equal(c.fooBoolean, false, "fooBoolean property overridden")
        equal(c.barBoolean, true, "barBoolean property not overridden; there was only one value")
        equal(c.fooArray.length, 5, "foo array merged child into parent")
        equal(c.barArray.length, 3, "bar array not merged; no child value")
        equal(c.fooObject.foo, "child", "fooObject.foo property overridden; child merged into parent")
        equal(c.fooObject.bar, "parent", "fooObject.bar property not overridden; no child value")
        equal(c.barObject.foo, "parent", "barObject property overridden")
        equal(c.bar, "parent", "bar property not overridden; no child value")
        equal(c.fooFunction(), "child", "foo function overridden by default")
        equal(c.barFunction(), "parent", "barFunction not overridden; no child value")
    })

    test("merge function, collations", function() {
        var a = {
                "foo":"parent",
                "bar":"parent",
                "fooNumber":1,
                "barNumber":1,
                "fooBoolean":true,
                "barBoolean":true,
                "fooArray":[1,2,3],
                "barArray":[4,5,6],
                "fooObject":{
                    "foo":"parent",
                    "bar":"parent"
                },
                "barObject":{
                    "foo":"parent",
                    "bar":"parent"
                },
                "fooFunction":function() { return "parent"},
                "barFunction":function() { return "parent"}
            },
            b = {
                "foo":"child",
                "fooNumber":2,
                "fooBoolean":false,
                "fooArray":[4,5],
                "fooObject":{
                    "foo":"child"
                },
                "fooFunction":function() { return "child"}
            },
            c = jsPlumb.merge(a, b, ["foo", "bar", "fooNumber", "barNumber", "fooArray", "fooObject", "fooFunction", "fooBoolean", "barBoolean"])

        equal(c.foo.length, 2, "foo property collated")
        equal(c.bar, "parent", "bar property not collated; there was only one value")
        equal(c.fooNumber.length, 2, "fooNumber property collated")
        equal(c.barNumber, 1, "barNumber property not collated; there was only one value")
        equal(c.fooBoolean.length, 2, "fooBoolean property collated")
        equal(c.barBoolean, 1, "barBoolean property not collated; there was only one value")
        equal(c.fooArray.length, 4, "fooArray property collated")
        equal(c.barArray.length, 3, "bar array not merged; no child value")
        equal(c.fooObject.length, 2, "fooObject property collated")
        equal(c.barObject.foo, "parent", "barObject property not collated; there was only one value")
        equal(c.fooFunction.length, 2, "fooFunction property collated")
        equal(c.barFunction(), "parent", "barFunction property not collated; there was only one value")
    })


    test("merge function, overrides", function() {
        var a = {
                "foo":"parent",
                "bar":"parent",
                "fooNumber":1,
                "barNumber":1,
                "fooBoolean":true,
                "barBoolean":true,
                "fooArray":[1,2,3],
                "fooObject":{
                    "foo":"parent",
                    "bar":"parent"
                },
                "barObject":{
                    "foo":"parent",
                    "bar":"parent"
                },
                "fooFunction":function() { return "parent"},
                "barFunction":function() { return "parent"}
            },
            b = {
                "foo":"child",
                "fooNumber":2,
                "fooBoolean":false,
                "fooArray":[4,5],
                "fooObject":{
                    "foo":"child"
                },
                "fooFunction":function() { return "child"}
            },
            c = jsPlumb.merge(a, b, null, ["foo", "bar", "fooNumber", "barNumber", "fooArray", "fooObject", "fooFunction", "fooBoolean", "barBoolean"])

        equal(c.foo, "child", "foo property overridden")
        equal(c.bar, "parent", "bar property not overridden; there was only one value")
        equal(c.fooNumber, 2, "fooNumber property overridden")
        equal(c.barNumber, 1, "barNumber property not collated; there was only one value")
        equal(c.fooBoolean, false, "fooBoolean property overridden")
        equal(c.barBoolean, true, "barBoolean property not overridden; there was only one value")
        equal(c.fooArray.length, 2, "fooArray property overridden")
        equal(c.fooObject.foo, "child", "fooObject property overridden")
        equal(c.fooObject.bar, null, "fooObject property overridden")
        equal(c.barObject.foo, "parent", "barObject property not overridden; there was only one value")
        equal(c.fooFunction(), "child", "fooFunction property overridden")
        equal(c.barFunction(), "parent", "barFunction property not overridden; there was only one value")
    })

    asyncTest("resize observer", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50, 150, 150),
            d18 = support.addDiv("d18", null, null, 450, 50, 150, 150);

        d16.style.outline = "1px solid"
        d18.style.outline = "1px solid"
        var e16 = _jsPlumb.addEndpoint(d16, {anchor:"Right"});
        var e18 = _jsPlumb.addEndpoint(d18, {anchor: "Left"});

        var c = _jsPlumb.connect({source: e16, target: e18});
        equal(c.endpoints[0]._anchor.computedPosition.curX, 200, "source anchor at correct x position")
        equal(c.endpoints[0]._anchor.computedPosition.curY, 125, "source anchor at correct y position")

        d16.style.width = "200px"
        setTimeout(function() {
            QUnit.start()
            equal(c.endpoints[0]._anchor.computedPosition.curX, 250, "source anchor at correct x position after programmatic resize")
            equal(c.endpoints[0]._anchor.computedPosition.curY, 125, "source anchor at correct y position")
        }, 250)


    });

    // asyncTest("mutation observer", function() {
    //
    //     var d16 = support.addDiv("d16", null, null, 50, 50, 150, 150),
    //         d18 = support.addDiv("d18", null, null, 450, 50, 150, 150);
    //
    //     d16.style.outline = "1px solid"
    //     d18.style.outline = "1px solid"
    //     var e16 = _jsPlumb.addEndpoint(d16, {anchor:"Right"});
    //     var e18 = _jsPlumb.addEndpoint(d18, {anchor: "Left"});
    //
    //     var c = _jsPlumb.connect({source: e16, target: e18});
    //     equal(c.endpoints[0]._anchor.computedPosition.curX, 200, "source anchor at correct x position")
    //     equal(c.endpoints[0]._anchor.computedPosition.curY, 125, "source anchor at correct y position")
    //
    //     d16.parentNode.removeChild(d16)
    //
    //     setTimeout(function() {
    //         QUnit.start()
    //         equal(_jsPlumb.select().length, 0, "0 connections as mutation observer caught the removal of a div")
    //     }, 250)
    // })

};


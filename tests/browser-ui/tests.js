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

var VERY_SMALL_NUMBER = 0.00000000001;
// helper to test that a value is the same as some target, within our tolerance
// sometimes the trigonometry stuff needs a little bit of leeway.
var within = function (val, target, _ok, msg) {
    _ok(Math.abs(val - target) < VERY_SMALL_NUMBER, msg + "[expected: " + target + " got " + val + "] [diff:" + (Math.abs(val - target)) + "]");
};

var defaults = null, support, _jsPlumb;

var isHover = function(connection) {
    return connection.connector.canvas.classList.contains("jtk-hover");
}

var testSuite = function () {

    module("jsPlumb", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumbBrowserUI.newInstance({container:document.getElementById("container")});
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = Object.assign({}, _jsPlumb.Defaults);
        }
    });


    test(" : getElement", function () {
        var e = document.createElement("div");
        e.id = "FOO";
        document.body.appendChild(e);
        var e2 = _jsPlumb.getElement(e);
        equal(e2.id, "FOO");
        _jsPlumb.manage(e2)

        var e3 = _jsPlumb.getElement(e2.getAttribute("jtk-id"));
        equal(e3.id, "FOO");
    });

    test(': _jsPlumb setup', function () {
        ok(_jsPlumb, "loaded");
    });

    test(" container has jtk-container attribute set", function() {
        var c1 = _jsPlumb.getContainer().getAttribute("jtk-container");
        ok(c1 != null);

        // change container and check again
        var container2 = support.addDiv("container2", document.body);

        _jsPlumb.setContainer(container2);

        var c2 = _jsPlumb.getContainer().getAttribute("jtk-container");
        ok(c2 != null);

        ok(c2 !== c1, "container attributes have different values");
    });

    test(': getId', function () {
        var d10 = support.addDiv('d10');
        equal(_jsPlumb.getId(_jsPlumb.getElement(d10)), d10.getAttribute("jtk-id"));
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
        ok(support.getEndpointCanvas(e).getAttribute("jtk-scope-one") != null, "scope was written to the element");
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
            "overlays": [["Label", {"label": "Label text", "cssClass": 'kw_port_label', "id": "66"}]]
        });
        var o = e.getOverlay("66");
        ok(o != null, "overlay exists");
    });

    // test(': create two simple endpoints, registered using a selector', function () {
    //     var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
    //     _jsPlumb.addClass(d1, "window");
    //     _jsPlumb.addClass(d2, "window");
    //     var endpoints = _jsPlumb.addEndpoint(_jsPlumb.getSelector(".window"), {});
    //     support.assertEndpointCount(d1, 1);
    //     support.assertEndpointCount(d2, 1);
    // });
    //
    // test(': create two simple endpoints, registered using an array of element ids', function () {
    //     var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
    //     _jsPlumb.addClass(d1, "window");
    //     _jsPlumb.addClass(d2, "window");
    //     var endpoints = _jsPlumb.addEndpoint(["d1", "d2"], {});
    //     support.assertEndpointCount(d1, 1);
    //     support.assertEndpointCount(d2, 1);
    // });

    test(' jsPlumb.remove after element removed from DOM', function () {
        var d = document.createElement("div");
        d.innerHTML = '<div id="container2"><ul id="targets"><li id="in1">input 1</li><li id="in2">input 2</li></ul><ul id="sources"><li id="output">output</li></ul></div>';
        var container = d.firstChild;
        document.body.appendChild(_jsPlumb.getElement(container));
        var output = document.getElementById("output")
        var e1 = _jsPlumb.addEndpoint(document.getElementById("in1"), { maxConnections: 1, isSource: false, isTarget: true, anchor: [ 0, 0.4, -1, 0 ] }),
            e2 = _jsPlumb.addEndpoint(document.getElementById("in2"), { maxConnections: 1, isSource: false, isTarget: true, anchor: [ 0, 0.4, -1, 0 ] }),
            e3 = _jsPlumb.addEndpoint(document.getElementById("output"), { isSource: true, isTarget: false, anchor: [ 1, 0.4, 1, 0 ] });

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
        c.paint();
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
        c.paint();
        equal(c.paintStyleInUse.outlineWidth, 5, "outline width converted to integer");
        equal(c.paintStyleInUse.strokeWidth, 3, "line width converted to integer");
    });

    test(': defaultEndpointMaxConnections', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {isSource: true});
        ok(e3.anchor, 'endpoint 3 has an anchor');
        var e4 = _jsPlumb.addEndpoint(d4, {isSource: true});
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
        var e5 = _jsPlumb.addEndpoint(d5, {isSource: true, maxConnections: 3});
        ok(e5.anchor, 'endpoint 5 has an anchor');
        var e6 = _jsPlumb.addEndpoint(d6, {isSource: true, maxConnections: 2});  // this one has max TWO
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
        var e3 = _jsPlumb.addEndpoint(d3, {isSource: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);   // we have one connection
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var e5 = _jsPlumb.addEndpoint(d3, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e4});
        assertConnectionCount(e4, 3);
    });


    test(': endpoint.isConnectdTo', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {isSource: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        ok(e3.isConnectedTo(e4), "e3 is connected to e4");
        ok(e4.isConnectedTo(e3), "e4 is connected to e3");
    });

// ************** ANCHORS ********************************************	

    test(': anchors equal', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1], [0, 1, 1, 1]
            ]});
        ok(c.endpoints[0].anchor.equals(c.endpoints[1].anchor), "anchors are the same according to their equals method")
    });

    test(': anchors equal with offsets', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1, 10, 13], [0, 1, 1, 1, 10, 13]
            ]});
        ok(c.endpoints[0].anchor.equals(c.endpoints[1].anchor), "anchors are the same according to their equals method")
    });

    test(': anchors not equal', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 0, 1], [0, 1, 1, 1]
            ]});
        ok(!c.endpoints[0].anchor.equals(c.endpoints[1].anchor), "anchors are different, according to their equals method")
    });

    test(': anchor not equal with offsets', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source:d3, target:d4, anchors:[
                [0, 1, 1, 1, 10, 13], [0, 1, 1, 1]
            ]});
        ok(!c.endpoints[0].anchor.equals(c.endpoints[1].anchor), "anchors are different, according to their equals method")
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

    test(": unknown anchor type should throw Error", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.connect({source: d1, target: d2, anchor: "FOO"});
        }
        catch (e) {
            // ok	
            equal(e.message, "jsPlumb: unknown anchor type 'FOO'", "useful error message");
        }
    });

    test(": unknown endpoint type should throw Error", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.connect({source: d1, target: d2, endpoint: "FOO"});
        }
        catch (e) {
            // ok	
            equal(e.message, "jsPlumb: unknown endpoint type 'FOO'", "useful error message");
        }
    });

    test(": unknown connector type should throw Error", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.connect({source: d1, target: d2, connector: "FOO"});
        }
        catch (e) {
            // ok	
            equal(e.message, "jsPlumb: unknown connector type 'FOO'", "useful error message");
        }
    });


// ************** / ANCHORS ********************************************


// **************************** DETACHING CONNECTIONS ****************************************************


    test(': deleteConnection does not fail when no arguments are provided', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.connect({source: d3, target: d4});
        _jsPlumb.deleteConnection();
        expect(0);
    });

    // test that detach does not fire an event by default
    test(': _jsPlumb.detach should fire detach event by default', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // test that detach does not fire an event by default
    test(': _jsPlumb.detach should fire detach event by default, using params object', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // test that detach fires an event when instructed to do so
    test(': _jsPlumb.detach should not fire detach event when instructed to not do so', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn, {fireEvent: false});
        equal(eventCount, 0);
    });

    // issue 81
    test(': _jsPlumb.detach should fire only one detach event (pass Connection as argument)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // issue 81
    test(': _jsPlumb.detach should fire only one detach event (pass Connection as param in argument)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // issue 81
    test(': delete should fire only one detach event (pass source and targets as elements as arguments in params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.select({source: d5, target: d6}).deleteAll();
        equal(eventCount, 1);
    });

    // issue 81
    test(': detach should fire only one detach event (pass source and targets as divs as arguments in params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true, beforeDetach: function (conn) {
                return false;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true, beforeDetach: function (conn) {
                return true;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });


    test(": Endpoint.detach; beforeDetach on addEndpoint call to source Endpoint returns false; Endpoint.detach returns false too (the UI needs it to)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true, beforeDetach: function (conn) {
                return false;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        var success = _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        ok(!success, "Endpoint reported detach did not execute");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns false", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection after detach call was denied");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns false but detach is forced", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c, {force: true});
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");

        e1.deleteEveryConnection();
        equal(_jsPlumb.select().length, 0, "there are no connections in the instance");
    });

    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on addEndpoint call to target Endpoint returns true so we detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
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
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
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
        _jsPlumb.bind("connectionDetached", function () {
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
        _jsPlumb.bind("connectionDetached", function () {
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
        _jsPlumb.bind("connectionDetached", function () {
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
        _jsPlumb.bind("connectionDetached", function () {
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

//        equal(_jsPlumbUtil.isEmpty(dt.endpoints), false, "one endpoint to delete");
//        equal(dt.endpointCount, 1, "one endpoint to delete");
//        equal(_jsPlumbUtil.isEmpty(dt.connections), true, "zero connections to delete");
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
//        equal(_jsPlumbUtil.isEmpty(dt2.endpoints), false, "one endpoint to delete");
//        equal(_jsPlumbUtil.isEmpty(dt2.connections), false, "one connection to delete");
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
            returnedParams = Object.assign({}, params);
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
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
        });
        _jsPlumb.deleteConnection(c);
        ok(returnedParams.connection != null, 'connection is set');
    });

    test(': detach event listeners (detach by connection)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
        });
        var conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.deleteConnection(conn);
        ok(returnedParams != null, "removed connection listener event was fired");
        ok(returnedParams.connection != null, "removed connection listener event passed in connection");
    });

    test(': detach event listeners (detach by element ids)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (detach by elements)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
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
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
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
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
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
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
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
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
        });
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        _jsPlumb.deleteEndpoint(e1);
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (ensure cleared by _jsPlumb.reset)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = Object.assign({}, params);
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
            returnedParams = Object.assign({}, params);
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

        _jsPlumb.bind("connectionDetached", function (params) {
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

        _jsPlumb.bind("connectionDetached", function (params) {
            count--;
        });
        _jsPlumb.deleteConnection(c);
        ok(count == 1, "count of events is now one");
        _jsPlumb.unbind("connectionDetached");
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

        _jsPlumb.bind("connectionDetached", function (params) {
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var conn = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionCount(e16, 1);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        e16.detachFromConnection(conn);
        // but endpoint e16 should have no connections now.
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
    });

    test(": Endpoint.detachAll", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var e18 = _jsPlumb.addEndpoint(d18, {isSource: true});
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        equal(e16.getUuid(), uuid, "endpoint's uuid was set correctly");
    });

    test(": _jsPlumb.getEndpoint (by uuid)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
    });

    test(": _jsPlumb.deleteEndpoint (by uuid, simple case)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
        _jsPlumb.deleteEndpoint(e16);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
    });

    test(": _jsPlumb.deleteEndpoint (by reference, connections too)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
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
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
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

    test("jsPlumb.remove fires connectionDetached events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d3});

        var o = 0;
        _jsPlumb.bind("connectionDetached", function () {
            o++;
        });

        _jsPlumb.unmanage(d1);
        equal(o, 2, "connectionDetached event was fired twice.");

    });

    test("jsPlumb.removeAllEndpoints fires connectionDetached events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d3});

        var o = 0;
        _jsPlumb.bind("connectionDetached", function () {
            o++;
        });

        _jsPlumb.removeAllEndpoints(d1);
        equal(o, 2, "connectionDetached event was fired twice.");

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
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "TopCenter"});
        equal(e16.anchor.x, 0);
        equal(e16.anchor.y, 0.5);
        equal(e17.anchor.x, 0.5);
        equal(e17.anchor.y, 0);
    });


    test(": _jsPlumb.addEndpoint (simple case, dynamic anchors)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["TopCenter", "BottomCenter"]});
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.addEndpoint (simple case, two arg method)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchor: [0, 0.5, 0, -1]});
        var e17 = _jsPlumb.addEndpoint(d17, {isTarget: true, isSource: false}, {anchor: "TopCenter"});
        equal(e16.anchor.x, 0);
        equal(e16.anchor.y, 0.5);
        equal(false, e16.isTarget);
        equal(true, e16.isSource);
        equal(e17.anchor.x, 0.5);
        equal(e17.anchor.y, 0);
        equal(true, e17.isTarget);
        equal(false, e17.isSource);
    });


    test(": _jsPlumb.addEndpoints (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoints(d16, [
            {isSource: true, isTarget: false, anchor: [0, 0.5, 0, -1] },
            { isTarget: true, isSource: false, anchor: "TopCenter" }
        ]);
        equal(e16[0].anchor.x, 0);
        equal(e16[0].anchor.y, 0.5);
        equal(false, e16[0].isTarget);
        equal(true, e16[0].isSource);
        equal(e16[1].anchor.x, 0.5);
        equal(e16[1].anchor.y, 0);
        equal(true, e16[1].isTarget);
        equal(false, e16[1].isSource);
    });


    // test(": _jsPlumb.addEndpoint (empty array)", function () {
    //     _jsPlumb.addEndpoint([], {isSource: true});
    //     _jsPlumb.repaintEverything();
    //     expect(0);
    // });

    test(": _jsPlumb.addEndpoints (with reference params)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var refParams = {anchor: "RightMiddle"};
        var e16 = _jsPlumb.addEndpoints(d16, [
            {isSource: true, isTarget: false},
            { isTarget: true, isSource: false }
        ], refParams);
        equal(e16[0].anchor.x, 1);
        equal(e16[0].anchor.y, 0.5);
        equal(false, e16[0].isTarget);
        equal(true, e16[0].isSource);
        equal(e16[1].anchor.x, 1);
        equal(e16[1].anchor.y, 0.5);
        equal(true, e16[1].isTarget);
        equal(false, e16[1].isSource);
    });

    test(": _jsPlumb.addEndpoint (simple case, dynamic anchors, two arg method)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {isTarget: true, isSource: false}, {anchor: ["TopCenter", "BottomCenter"]});
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.Defaults.endpointOverlays = [
            [ "Label", { id: "label" } ]
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
    });



    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.Defaults.endpointOverlays = [
            [ "Label", { id: "label" } ]
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {
                overlays: [
                    ["Label", { id: "label2", location: [ 0.5, 1 ] } ]
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
                isSource: true,
                isTarget: false,
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
            connector: [ "Bezier", { curviness: 45 } ],
            container:"container"
        };
        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getConnector().type, "Bezier", "connector is the default");
        c.setConnector(["Bezier", { curviness: 789 }]);
        equal(def.connector[1].curviness, 45, "curviness unchanged by setConnector call");
    });

    test(": setConnector, overlays are retained", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");
        var def = {
            connector: [ "Bezier", { curviness: 45 } ],
            container:"container"
        };
        var c = _jsPlumb.connect({
            source: d1, target: d2,
            overlays:[
                [ "Label", { label:"foo" } ]
            ]
        });
        equal(c.getConnector().type, "Bezier", "connector is the default");
        equal(_length(c.getOverlays()), 1, "one overlay on the connector");

        c.setConnector(["StateMachine", { curviness: 789 }]);
        equal(def.connector[1].curviness, 45, "curviness unchanged by setConnector call");
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

    test(': _jsPlumb.connect (between two Endpoints)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        ok(e, 'endpoint e exists');
        ok(e2, 'endpoint e2 exists');
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        var c = _jsPlumb.connect({target: 'd2', sourceEndpoint: e, targetEndpoint: e2});
        support.assertEndpointCount(d1, 1, _jsPlumb);		// no new endpoint should have been added
        support.assertEndpointCount(d2, 1, _jsPlumb); 		// no new endpoint should have been added
        ok(c.id != null, "connection has had an id assigned");
    });


    test(': _jsPlumb.connect (between two Endpoints, and dont supply any parameters to the Endpoints.)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        ok(e, 'endpoint e exists');
        ok(e2, 'endpoint e2 exists');
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.connect({target: d2, sourceEndpoint: e, targetEndpoint: e2});
        support.assertEndpointCount(d1, 1, _jsPlumb);		// no new endpoint should have been added
        support.assertEndpointCount(d2, 1, _jsPlumb); 		// no new endpoint should have been added
    });

    test(" : _jsPlumb.connect, passing 'anchors' array", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, anchors: ["LeftMiddle", "RightMiddle"]});

        equal(c.endpoints[0].anchor.x, 0, "source anchor is at x=0");
        equal(c.endpoints[0].anchor.y, 0.5, "source anchor is at y=0.5");
        equal(c.endpoints[1].anchor.x, 1, "target anchor is at x=1");
        equal(c.endpoints[1].anchor.y, 0.5, "target anchor is at y=0.5");
    });

    test(': _jsPlumb.connect (by endpoint)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
    });

    test(': _jsPlumb.connect (cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17, cost: 567});
        equal(c.getCost(), 567, "connection cost is 567");
    });

    test(': _jsPlumb.connect (default cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), 1, "default connection cost is 1");
    });

    test(': _jsPlumb.connect (set cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), 1, "default connection cost is 1");
        c.setCost(8989);
        equal(c.getCost(), 8989, "connection cost is 8989");
    });

    test(': _jsPlumb.connect two endpoints (connectionCost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionCost: 567});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), 567, "connection cost is 567");
    });

    test(': _jsPlumb.connect two endpoints (change connectionCost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionCost: 567, maxConnections: -1}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), 567, "connection cost is 567");
        e16.connectionCost = 23;
        var c2 = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c2.getCost(), 23, "connection cost is 23 after change on endpoint");
    });

    test(': _jsPlumb.connect (directed is undefined by default)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true}),
            c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.isDirected(), undefined, "default connection is not directed");
    });

    test(': _jsPlumb.connect (directed true)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true}),
            c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17, directed: true});
        equal(c.isDirected(), true, "connection is directed");
    });

    test(': _jsPlumb.connect two endpoints (connectionsDirected)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionsDirected: true, maxConnections: -1});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.isDirected(), true, "connection is directed");
    });

    test(': _jsPlumb.connect two endpoints (change connectionsDirected)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionsDirected: true, maxConnections: -1}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.isDirected(), true, "connection is directed");
        e16.connectionsDirected = false;
        var c2 = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c2.isDirected(), false, "connection is not directed");
    });

    test(": _jsPlumb.connect (two Endpoints - that have been already added - by UUID)", function () {
        var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e1 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: srcEndpointUuid});
        var e2 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1, uuid: dstEndpointUuid});
        _jsPlumb.connect({ uuids: [ srcEndpointUuid, dstEndpointUuid  ] });
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
    });

    test(": _jsPlumb.connect (two Endpoints - that have not been already added - by UUID)", function () {
        var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.connect({ uuids: [ srcEndpointUuid, dstEndpointUuid  ], source: d16, target: d17 });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        var e1 = _jsPlumb.getEndpoint(srcEndpointUuid);
        ok(e1 != null, "endpoint with src uuid added");
        ok(support.getEndpointCanvas(e1) != null);
        var e2 = _jsPlumb.getEndpoint(dstEndpointUuid);
        ok(e2 != null, "endpoint with target uuid added");
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (two Endpoints - that have been already added - by endpoint reference)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e1 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1});
        var e2 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (two elements)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.connect({ source: d16, target: d17 });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (Connector test, straight)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (Connector test, bezier, no params)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Bezier" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Bezier", "Bezier connector chosen for connection");
        equal(conn.getConnector().getCurviness(), 150, "Bezier connector chose 150 curviness");
    });

    test(": _jsPlumb.connect (Connector test, bezier, curviness as int)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: ["Bezier", { curviness: 200 }] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Bezier", "Canvas Bezier connector chosen for connection");
        equal(conn.getConnector().getCurviness(), 200, "Bezier connector chose 200 curviness");
    });

    test(": _jsPlumb.connect (Connector test, bezier, curviness as named option)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: ["Bezier", {curviness: 300}] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Bezier", "Bezier connector chosen for connection");
        equal(conn.getConnector().getCurviness(), 300, "Bezier connector chose 300 curviness");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Canvas Straight connector chosen for connection");
        equal(0.3, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn.endpoints[1].anchor.y, "target anchor y");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as strings)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: ["LeftMiddle", "RightMiddle"] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(0, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.5, conn.endpoints[0].anchor.y, "source anchor y");
        equal(1, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.5, conn.endpoints[1].anchor.y, "target anchor y");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(0.3, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn.endpoints[1].anchor.y, "target anchor y");
    });


    test(": _jsPlumb.connect (two argument method in which some data is reused across connections)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18"), d19 = support.addDiv("d19");
        var sharedData = { connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] };
        var conn = _jsPlumb.connect({ source: d16, target: d17}, sharedData);
        var conn2 = _jsPlumb.connect({ source: d18, target: d19}, sharedData);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 2, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(conn2.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(0.3, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn.endpoints[1].anchor.y, "target anchor y");
        equal(0.3, conn2.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn2.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn2.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn2.endpoints[1].anchor.y, "target anchor y");
    });

    test(": _jsPlumb.connect (Connector as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (Endpoint test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoint: "Rectangle" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.getType(), "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.getType(), "Rectangle", "Rectangle endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoint as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoint: "Rectangle" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.getType(), "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.getType(), "Rectangle", "Rectangle endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoints test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Dot" ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.getType(), "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.getType(), "Dot", "Dot endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Blank Endpoint specified via 'endpoint' param)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoint: "Blank" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.getType(), "Blank", "Blank endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.getType(), "Blank", "Blank endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Blank Endpoint specified via 'endpoints' param)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Blank", "Blank" ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.getType(), "Blank", "Blank endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.getType(), "Blank", "Blank endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoint as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Dot" ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.getType(), "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.getType(), "Dot", "Dot endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (by Endpoints, connector test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {});
        var e17 = _jsPlumb.addEndpoint(d17, {});
        window.FOO = "BAR"
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        window.FOO = null;
    });

    test(": _jsPlumb.connect (by Endpoints, connector as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {});
        var e17 = _jsPlumb.addEndpoint(d17, {});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (by Endpoints, anchors as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var a16 = "TopCenter", a17 = "BottomCenter";
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: a16});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: a17});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.x, 0.5, "endpoint 16 is at top center");
        equal(e16.anchor.y, 0, "endpoint 16 is at top center");
        equal(e17.anchor.x, 0.5, "endpoint 17 is at bottom center");
        equal(e17.anchor.y, 1, "endpoint 17 is at bottom center");
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create anchors)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var a16 = [0, 0.5, 0, -1], a17 = [1, 0.0, -1, -1];
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: a16});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: a17});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.x, a16[0]);
        equal(e16.anchor.y, a16[1]);
        equal(e17.anchor.x, a17[0]);
        equal(e17.anchor.y, a17[1]);
        equal(e16.anchor.getOrientation()[0], a16[2]);
        equal(e16.anchor.getOrientation()[1], a16[3]);
        equal(e17.anchor.getOrientation()[0], a17[2]);
        equal(e17.anchor.getOrientation()[1], a17[3]);
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchor')", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["TopCenter", "BottomCenter"]});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchors')", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["TopCenter", "BottomCenter"]});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.connect (connect by element, default endpoint, supplied dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var anchors = [
            [0.25, 0, 0, -1],
            [1, 0.25, 1, 0],
            [0.75, 1, 0, 1],
            [0, 0.75, -1, 0]
        ];
        _jsPlumb.connect({source: d1, target: d2, dynamicAnchors: anchors, deleteEndpointsOnEmpty:true});                // auto connect with default endpoint and provided anchors
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        // this changed in 1.3.5, because auto generated endpoints are now removed by detach.  so i added the test below this one
        // to check that the deleteEndpointsOnDetach flag is honoured.
        // and changed back in 2.4.0...maybe
        support.assertEndpointCount(d1, 0, _jsPlumb);
        support.assertEndpointCount(d2, 0, _jsPlumb);
    });

    test(": _jsPlumb.connect (connect by element, default endpoint, supplied dynamic anchors, delete on detach false)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var anchors = [
            [0.25, 0, 0, -1],
            [1, 0.25, 1, 0],
            [0.75, 1, 0, 1],
            [0, 0.75, -1, 0]
        ];
        _jsPlumb.connect({
            source: d1,
            target: d2,
            dynamicAnchors: anchors,
            deleteEndpointsOnEmpty: false
        });                // auto connect with default endpoint and provided anchors
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        // this changed in 1.3.5, because auto generated endpoints are now removed by detach.  so i added this test
        // to check that the deleteEndpointsOnEmpty flag is honoured.
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
    });

    test(": delete endpoints on detach, makeSource and makeTarget)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.makeSource(d1);
        _jsPlumb.makeTarget(d2);
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
        _jsPlumb.makeTarget(d2);
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
        _jsPlumb.makeSource(d1);
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

    test(": _jsPlumb.connect (connect by element, supplied endpoint and dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var endpoint = { isSource: true };
        var e1 = _jsPlumb.addEndpoint(d1, endpoint);
        var e2 = _jsPlumb.addEndpoint(d2, endpoint);
        var anchors = [ "TopCenter", "BottomCenter" ];
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2, dynamicAnchors: anchors});
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (connect by element, supplied endpoints using 'source' and 'target' (this test is identical to the one above apart from the param names), and dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var endpoint = { isSource: true };
        var e1 = _jsPlumb.addEndpoint(d1, endpoint);
        var e2 = _jsPlumb.addEndpoint(d2, endpoint);
        var anchors = [ "TopCenter", "BottomCenter" ];
        _jsPlumb.connect({source: e1, target: e2, dynamicAnchors: anchors});
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
    });

    test(": jsPlumb.connect, events specified", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            clicked = 0,
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                events: {
                    click: function (conn) {
                        clicked++;
                    }
                }
            });

        c.fire("click", c);
        equal(1, clicked, "connection was clicked once");
    });

    test(" detachable parameter defaults to true on _jsPlumb.connect", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.isDetachable(), true, "connections detachable by default");
    });

    test(" detachable parameter set to false on _jsPlumb.connect", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, detachable: false});
        equal(c.isDetachable(), false, "connection detachable");
    });

    test(" setDetachable on initially detachable connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.isDetachable(), true, "connection initially detachable");
        c.setDetachable(false);
        equal(c.isDetachable(), false, "connection not detachable");
    });

    test(" setDetachable on initially not detachable connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, detachable: false });
        equal(c.isDetachable(), false, "connection not initially detachable");
        c.setDetachable(true);
        equal(c.isDetachable(), true, "connection now detachable");
    });

    test(" _jsPlumb.Defaults.ConnectionsDetachable", function () {
        _jsPlumb.Defaults.connectionsDetachable = false;
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.isDetachable(), false, "connections not detachable by default (overrode the defaults)");
        _jsPlumb.Defaults.connectionsDetachable = true;
    });


    test(": _jsPlumb.connect (testing for connection event callback)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var connectCallback = null, detachCallback = null;
        _jsPlumb.bind("connection", function (params) {
            connectCallback = Object.assign({}, params);
        });
        _jsPlumb.bind("connectionDetached", function (params) {
            detachCallback = Object.assign({}, params);
        });
        _jsPlumb.connect({source: d1, target: d2});                // auto connect with default endpoint and anchor set
        ok(connectCallback != null, "connect callback was made");
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        ok(detachCallback != null, "detach callback was made");
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

    test(": _jsPlumb.connect (setting outline class on Connector)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, paintStyle:{outlineStroke:"green", outlineWidth:6, strokeWidth:4, stroke:"red"}});

        ok(testConnectionCanvasClass(c, _jsPlumb.connectorClass), "basic connector class set correctly");

        ok(testConnectionElementClass(c, "jtk-connector-outline", "bgPath"), "outline canvas set correctly");
        ok(testConnectionElementClass(c, _jsPlumb.connectorOutlineClass, "bgPath"), "outline canvas set correctly");
    });

    test(": _jsPlumb.connect (setting cssClass on Connector)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, cssClass: "CSS"});
        ok(testConnectionCanvasClass(c, "CSS"), "custom cssClass set correctly");
        ok(testConnectionCanvasClass(c, _jsPlumb.connectorClass), "basic connector class set correctly");
    });

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

    test(": _jsPlumb.connect (overlays, long-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {width: 40, length: 40, location: 0.7, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a"};
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id:"l"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(_length(connection1.overlays), 2);
        equal("Label", connection1.overlays["l"].type);

        equal("Arrow", connection1.overlays["a"].type);
        equal(0.7, connection1.overlays["a"].location);
        equal(40, connection1.overlays["a"].width);
        equal(40, connection1.overlays["a"].length);
    });

    test(": _jsPlumb.connect (overlays, long-hand version, IDs specified)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, _length(connection1.overlays));
        equal("Label", connection1.overlays["aLabel"].type);
        equal("aLabel", connection1.overlays["aLabel"].id);

        equal("Arrow", connection1.overlays["anArrow"].type);
        equal(0.7, connection1.overlays["anArrow"].location);
        equal(40, connection1.overlays["anArrow"].width);
        equal(40, connection1.overlays["anArrow"].length);
        equal("anArrow", connection1.overlays["anArrow"].id);
    });

    test(": _jsPlumb.connect (default overlays)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default overlays + overlays specified in connect call)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default connection overlays)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default connection overlays + overlays specified in connect call)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });


    test(": _jsPlumb.connect (label overlay set using 'label')", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO"
            });

        equal(_length(c.getOverlays()), 1, "one overlay set");
        equal(c.getLabel(), "FOO", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with string)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel("FOO");
        equal(c.getLabel(), "FOO", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with function)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel(function () {
            return "BAR";
        });
        equal(c.getLabel(), "BAR", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with params object)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel({
            label: "BAZ",
            cssClass: "CLASSY",
            location: 0.9
        });
        var lo = c.getLabelOverlay();
        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.location, 0.9, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (set label after construction with existing label set, with params object)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            });

        var lo = c.getLabelOverlay();
        equal(lo.location, 0.2, "label overlay has correct location");

        c.setLabel({
            label: "BAZ",
            cssClass: "CLARS",
            location: 0.9
        });

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.location, 0.9, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (getLabelOverlay, label on connect call)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO"
            }),
            lo = c.getLabelOverlay();

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "FOO", "label overlay has correct value");
        equal(lo.location, 0.5, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (getLabelOverlay, label on connect call, location set)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            }),
            lo = c.getLabelOverlay();

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "FOO", "label overlay has correct value");
        equal(lo.location, 0.2, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (remove single overlay by id)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, _length(connection1.overlays));

        var labelOverlay = connection1.getOverlay("aLabel");
        var arrowOverlay = connection1.getOverlay("anArrow");

        ok(labelOverlay.canvas != null, "the label overlay has a canvas");

        connection1.removeOverlay("aLabel");

        equal(null, connection1.overlays["aLabel"], "not registered in overlays map");
        equal(null, connection1.overlayPositions["aLabel"], "not registered in overlay positions map");
        equal(null, connection1.overlayPlacements["aLabel"], "not registered in overlay positions map");

        equal(1, _length(connection1.overlays), "only one overlay remaining on the connection");
        equal("anArrow", connection1.overlays["anArrow"].id, "the id of this overlay is what we expected");

        equal(labelOverlay.canvas, null, "the label overlay was actually removed from the DOM");

        // remove the arrow
        var arrowElement = arrowOverlay.path;//renderer.getElement();
        ok(arrowElement.parentNode != null, "arrow element is in the DOM");
        connection1.removeOverlay("anArrow");

        equal(null, connection1.overlays["anArrow"], "anArrow not registered in overlays map");
        equal(null, connection1.overlayPositions["anArrow"], "anArrow not registered in overlay positions map");
        equal(null, connection1.overlayPlacements["anArrow"], "anArrow not registered in overlay positions map");

        equal(0, _length(connection1.overlays), "no overlays remaining on the connection");

        equal(arrowElement.parentNode, null, "the arrow overlay was actually removed from the DOM");


    });

    test(": _jsPlumb.connect (remove multiple overlays by id)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, _length(connection1.overlays));
        connection1.removeOverlays("aLabel", "anArrow");
        equal(0, _length(connection1.overlays));
    });

    test(": _jsPlumb.connect (overlays, short-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id:"l"}],
                ["Arrow", arrowSpec, loc]
            ]
        });
        equal(2, _length(connection1.overlays));
        equal("Label", connection1.overlays["l"].type);

        equal("Arrow", connection1.overlays["a"].type);
        equal(0.7, connection1.overlays["a"].location);
        equal(40, connection1.overlays["a"].width);
        equal(40, connection1.overlays["a"].length);
    });

    test(": _jsPlumb.connect (removeAllOverlays)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, cssClass: "PPPP", id:"l"}],
                ["Arrow", arrowSpec, loc]
            ]
        });
        equal(2, _length(connection1.overlays));
        equal("Label", connection1.overlays["l"].type);

        equal("Arrow", connection1.overlays["a"].type);
        equal(0.7, connection1.overlays["a"].location);
        equal(40, connection1.overlays["a"].width);
        equal(40, connection1.overlays["a"].length);

        // not valid anymore, as we dont nuke overlays until the component is deleted.
        /*connection1.removeAllOverlays();
        equal(0, connection1.overlays.length);
        equal(0, jsPlumb.getSelector(".PPPP").length);*/
        _jsPlumb.deleteConnection(connection1);
        equal(0, _jsPlumb.getSelector(".PPPP").length, "overlay has been fully cleaned up");
    });

    test(": _jsPlumb.connect, specify arrow overlay using string identifier only", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: ["Arrow"]});
        equal("Arrow", _head(conn.overlays).type);
    });

    test(": Connection.getOverlay method, existing overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay != null);
    });

    test(": Connection.getOverlay method, non-existent overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("IDONTEXIST");
        ok(overlay == null);
    });

    test(": Overlay.setVisible method", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay.isVisible());
        overlay.setVisible(false);
        ok(!overlay.isVisible());
        overlay.setVisible(true);
        ok(overlay.isVisible());
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return plain DOM element)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Custom", { id: "custom", create: function (connection) {
                ok(connection != null, "we were passed in a connection");
                var d = document.createElement("div");
                d.setAttribute("custom", "true");
                d.innerHTML = connection.id;
                return d;
            }}]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.canvas.getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.canvas.innerHTML, c.id, "custom overlay has correct value");
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return selector)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Custom", { id: "custom", create: function (connection) {
                ok(connection != null, "we were passed in a connection");
                return support.makeContent("<div custom='true'>" + connection.id + "</div>");
            }}]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.canvas.getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.canvas.innerHTML, c.id, "custom overlay has correct value");
    });

    test(": overlay events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var clicked = 0;
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays: [
                ["Label", {
                    label: "CONNECTION 1",
                    location: 0.3,
                    id: "label",
                    events: {
                        click: function (label, e) {
                            clicked++;
                        }
                    }
                }]
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

        var dynamicAnchor = ep.anchor;

        var a = dynamicAnchor.getAnchors();
        equal(a.length, 4, "Dynamic Anchors has four anchors");
        for (var i = 0; i < a.length; i++)
            ok(a[i].compute.constructor == Function, "anchor " + i + " well formed");
    });

    test(": Connection.isVisible/setVisible", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c1 = _jsPlumb.connect({source: d1, target: d2});
        equal(true, c1.isVisible(), "Connection is visible after creation.");
        c1.setVisible(false);
        equal(false, c1.isVisible(), "Connection is not visible after calling setVisible(false).");
        equal(support.getConnectionCanvas(c1).style.display, "none");
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
    test(" _jsPlumb.setContainer, specified with a selector", function () {
        _jsPlumb.setContainer(document.body);
        equal(document.getElementById("container").childNodes.length, 0, "container has no nodes");
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        equal(document.getElementById("container").childNodes.length, 2, "container has two div elements");  // the divs we added have been added to the 'container' div.
        // but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
        _jsPlumb.connect({source: d1, target: d2});
        equal(document.getElementById("container").childNodes.length, 2, "container still has two div elements");
    });

    // tests of the functionality that allows a user to specify that they want elements appended to some specific container.
    test(" _jsPlumb.setContainer, specified with DOM element", function () {
        _jsPlumb.setContainer(document.getElementsByTagName("body")[0]);
        equal(0, document.getElementById("container").childNodes.length);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        equal(2, document.getElementById("container").childNodes.length, "two divs added to the container");  // the divs we added have been added to the 'container' div.
        // but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
        var bodyElementCount = document.body.childNodes.length;
        _jsPlumb.connect({source: d1, target: d2});
        equal(2, document.getElementById("container").childNodes.length, "still only two children in container; elements were added to the body by _jsPlumb");
        // test to see if 3 elements have been added
        equal(bodyElementCount + 3, document.body.childNodes.length, "3 new elements added to the document body");
    });

    test(" _jsPlumb.setContainer, moves managed nodes", function () {
        var c2 = support.addDiv("c2", document.body);
        var c = document.getElementById("container");

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
                    [ "Label", { label: "FOO", id: "label" }]
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
                ]
            }),
            e3 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
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
        equal(c.getConnector().type, "Bezier", "Bezier connector has type set");

        var c2 = _jsPlumb.connect({source: d1, target: d2, connector: "Straight"});
        equal(c2.getConnector().type, "Straight", "Straight connector has type set");

        var c3 = _jsPlumb.connect({source: d1, target: d2, connector: "Flowchart"});
        equal(c3.getConnector().type, "Flowchart", "Flowchart connector has type set");
    });

    test(" Endpoints have 'type' member set", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.endpoints[0].endpoint.getType(), "Dot", "Dot endpoint has type set");

        var c2 = _jsPlumb.connect({source: d1, target: d2, endpoints: ["Rectangle", "Blank"]});
        equal(c2.endpoints[1].endpoint.getType(), "Blank", "Blank endpoint has type set");
        equal(c2.endpoints[0].endpoint.getType(), "Rectangle", "Rectangle endpoint has type set");
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
            e = { isSource: true, isTarget: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            c1 = _jsPlumb.connect({source: e1, target: e2, overlays:[ [ "Label", { id:"lbl"}]]});

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
            e = { isSource: true, isTarget: true, maxConnections: -1 },
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
            e = { isSource: true, isTarget: true, maxConnections: -1 },
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
            e = { isSource: true, isTarget: true, maxConnections: -1 },
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
            [ "Label", { "id":"lbl" } ]
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
            [ "Label", {id: "label", cssClass: "foo"}]
        ]});
        ok(_jsPlumb.getSelector(".foo").length == 1, "label element exists in DOM");
        c.removeOverlay("label");
        ok(_length(c.getOverlays()) == 0, "no overlays left on component");
        ok(_jsPlumb.getSelector(".foo").length == 0 , "label element does not exist in DOM");
    });


    test(" arrow cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", {id: "arrow"}]
        ]});
        ok(c.getOverlay("arrow") != null, "arrow overlay exists");
        c.removeOverlay("arrow");
        ok(c.getOverlay("arrow") == null, "arrow overlay has been removed");
    });

    test(" label overlay provides getLabel and setLabel methods", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {id: "label", label: "foo"}]
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
            [ "Label", {
                id: "label",
                cssClass: "foo"
            }]
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
                isSource: true,
                parameters: {
                    "string": "param1",
                    "int": 4,
                    "function": f
                }
            });
        ok(e.getParameter("string") === "param1", "getParameter(String) works correctly");
        ok(e.getParameter("int") === 4, "getParameter(int) works correctly");
        ok(e.getParameter("function") == f, "getParameter(Function) works correctly");
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
        ok(c.getParameter("string") === "param1", "getParameter(String) works correctly");
        ok(c.getParameter("int") === 4, "getParameter(int) works correctly");
        ok(c.getParameter("function") == f, "getParameter(Function) works correctly");
    });

    test(" parameters set on Endpoints and Connections are all merged, and merged correctly at that.", function () {
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv("d2"),
            e = _jsPlumb.addEndpoint(d1, {
                isSource: true,
                parameters: {
                    "string": "sourceEndpoint",
                    "int": 0,
                    "function": function () {
                        return "sourceEndpoint";
                    }
                }
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                isTarget: true,
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

        ok(c.getParameter("string") === "sourceEndpoint", "getParameter(String) works correctly");
        ok(c.getParameter("int") === 0, "getParameter(int) works correctly");
        ok(c.getParameter("function")() == "connection", "getParameter(Function) works correctly");
    });

    test(" Continuous anchor default face, no faces supplied", function () {
        var d3 = support.addDiv("d3"), ep = _jsPlumb.addEndpoint(d3, {
            anchor: "Continuous"
        });

        equal(ep.anchor.getDefaultFace(), "top", "default is top when no faces specified");
    });


    test(" Continuous anchor default face, faces supplied", function () {
        var d3 = support.addDiv("d3"), ep = _jsPlumb.addEndpoint(d3, {
            anchor: [ "Continuous", { faces: [ "bottom", "left" ] } ]
        });

        equal(ep.anchor.getDefaultFace(), "bottom", "default is bottom");
        ok(ep.anchor.isEdgeSupported("bottom"), "bottom edge supported");
        ok(ep.anchor.isEdgeSupported("left"), "left edge supported");
        ok(!ep.anchor.isEdgeSupported("right"), "right edge not supported");
        ok(!ep.anchor.isEdgeSupported("top"), "top edge not supported");

        ok(!ep.anchor.isEdgeSupported("unknown"), "unknown edge not supported");

        // TODO: support locking to a specific face.
        //ep.anchor.lock();
    });

    test(" Continuous anchor current face is set", function () {
        var d3 = support.addDiv("d3", null, "", 50, 50, 200, 200),
            ep3 = _jsPlumb.addEndpoint(d3, {
                anchor: "Continuous"
            }),
            d4 = support.addDiv("d4", null, "", 50, 450, 200, 200),
            ep4 = _jsPlumb.addEndpoint(d4, {
                anchor: "Continuous"
            });

        _jsPlumb.connect({source:ep3, target:ep4});

        // we should have picked 'bottom' face for ep3 and 'top' for ep4, based on the orientation of their elements.
        equal(ep3.anchor.getCurrentFace(), "bottom", "ep3's anchor is 'bottom'");
        equal(ep4.anchor.getCurrentFace(), "top", "ep4's anchor is 'top'");

        // move d3, redraw, and check the anchors have changed appropriately.
        d3.style.top = "1050px";
        _jsPlumb.revalidate(d3);
        equal(ep3.anchor.getCurrentFace(), "top", "ep3's anchor is 'top' after d3 moved below d4");
        equal(ep4.anchor.getCurrentFace(), "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");
    });

    test(" Continuous anchor lock current face", function () {
        var d3 = support.addDiv("d3", null, "", 50, 50, 200, 200),
            ep3 = _jsPlumb.addEndpoint(d3, {
                anchor: "Continuous"
            }),
            d4 = support.addDiv("d4", null, "", 50, 450, 200, 200),
            ep4 = _jsPlumb.addEndpoint(d4, {
                anchor: "Continuous"
            });

        _jsPlumb.connect({source:ep3, target:ep4});

        // as before, we should have picked 'bottom' face for ep3 and 'top' for ep4, based on the orientation of their elements.
        equal(ep3.anchor.getCurrentFace(), "bottom", "ep3's anchor is 'bottom'");
        equal(ep4.anchor.getCurrentFace(), "top", "ep4's anchor is 'top'");

        // lock ep3's face, move, redraw, check that only ep4's face has changed.
        ep3.anchor.lock();
        d3.style.top = "1050px";
        _jsPlumb.revalidate(d3);
        equal(ep3.anchor.getCurrentFace(), "bottom", "ep3's anchor is 'bottom' after d3 moved below d4, because ep3's current face is locked");
        equal(ep4.anchor.getCurrentFace(), "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");

        // unlock ep3's face, redraw, check that only ep4's face has changed.
        ep3.anchor.unlock();
        _jsPlumb.revalidate(d3);
        equal(ep3.anchor.getCurrentFace(), "top", "ep3's anchor is 'top' after ep3's current face unlocked and a redraw called");
        equal(ep4.anchor.getCurrentFace(), "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");
    });

    test(" Continuous anchor lock current axis", function () {
        var d3 = support.addDiv("d3", null, "", 50, 50, 200, 200),
            ep3 = _jsPlumb.addEndpoint(d3, {
                anchor: "Continuous"
            }),
            d4 = support.addDiv("d4", null, "", 50, 450, 200, 200),
            ep4 = _jsPlumb.addEndpoint(d4, {
                anchor: "Continuous"
            });

        _jsPlumb.connect({source:ep3, target:ep4});

        // as before, we should have picked 'bottom' face for ep3 and 'top' for ep4, based on the orientation of their elements.
        equal(ep3.anchor.getCurrentFace(), "bottom", "ep3's anchor is 'bottom'");
        equal(ep4.anchor.getCurrentFace(), "top", "ep4's anchor is 'top'");

        // move d3 to the right of d4, redraw, check that the anchor faces are correct

        d3.style.top = "450px";
        d3.style.left = "450px";
        _jsPlumb.revalidate(d3);
        equal(ep3.anchor.getCurrentFace(), "left", "ep3's anchor is 'left' after d3 moved to the right of d4");
        equal(ep4.anchor.getCurrentFace(), "right", "ep4's anchor is 'right' after d3 moved to the right of d4");

        // lock ep3's face, move, redraw, check that ep3's axis is 'right' (on the x axis; the choice of right is
        // a result of the face picking algorithm. it's directly underneath so it could be left or right without
        // affecting the user's perception)
        ep3.anchor.lockCurrentAxis();
        d3.style.top = "1050px";
        d3.style.left = "0px";
        _jsPlumb.revalidate(d3);
        equal(ep3.anchor.getCurrentFace(), "right", "ep3's anchor is 'right' after d3 moved below d4, because ep3's current axis is locked");
        equal(ep4.anchor.getCurrentFace(), "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");

        // now move d3 over to the right far enough that the anchor would ordinarily switch to 'top', but the axis is locked.
        d3.style.top = "1050px";
        d3.style.left = "350px";
        _jsPlumb.revalidate(d3);
        equal(ep3.anchor.getCurrentFace(), "left", "ep3's anchor is 'left' after d3 moved below d4, because ep3's current axis is locked");
        equal(ep4.anchor.getCurrentFace(), "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");

        // unlock the axis for ep3, redraw. should move to 'top' now.
        ep3.anchor.unlockCurrentAxis();
        _jsPlumb.revalidate(d3);
        equal(ep3.anchor.getCurrentFace(), "top", "ep3's anchor is 'top' after axis unlocked");
        equal(ep4.anchor.getCurrentFace(), "bottom", "ep4's anchor is 'bottom' after d3 moved below d4");
    });


// issue 190 - regressions with getInstance.  these tests ensure that generated ids are unique across
// instances.    

    test(" id clashes between instances", function () {
        var foo = document.createElement("div");
        document.body.appendChild(foo);
        var d1 = support.addDiv("d1"),
            _jsp2 = jsPlumbBrowserUI.newInstance({container:foo}),
            support2 = jsPlumbTestSupport.getInstance(_jsp2),
            d2 = support2.addDiv("d2");

        d1.removeAttribute("jtk-id");
        d2.removeAttribute("jtk-id");

        _jsPlumb.addEndpoint(d1);
        _jsp2.addEndpoint(d2);

        var id1 = d1.getAttribute("jtk-id"),
            id2 = d2.getAttribute("jtk-id");

        var idx = id1.indexOf("-"), idx2 = id1.lastIndexOf("-"), v1 = id1.substring(idx, idx2);
        var idx3 = id2.indexOf("-"), idx4 = id2.lastIndexOf("-"), v2 = id2.substring(idx3, idx4);

        ok(v1 != v2, "instance versions are different : " + v1 + " : " + v2);

        support2.cleanup();
        foo.parentNode.removeChild(foo);
    });


    test(" importDefaults", function () {
        _jsPlumb.Defaults.anchors = ["LeftMiddle", "RightMiddle"];
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv(d2),
            c = _jsPlumb.connect({source: d1, target: d2}),
            e = c.endpoints[0];

        equal(e.anchor.x, 0, "left middle anchor");
        equal(e.anchor.y, 0.5, "left middle anchor");

        _jsPlumb.importDefaults({
            anchors: ["TopLeft", "TopRight"]
        });

        var conn = _jsPlumb.connect({source: d1, target: d2}),
            e1 = conn.endpoints[0], e2 = conn.endpoints[1];

        equal(e1.anchor.x, 0, "top leftanchor");
        equal(e2.anchor.y, 0, "top left anchor");
        equal(e2.anchor.x, 1, "top right anchor");
        equal(e2.anchor.y, 0, "top right anchor");

    });


    test(" restoreDefaults", function () {
        _jsPlumb.importDefaults({
            anchors: ["TopLeft", "TopRight"]
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), conn = _jsPlumb.connect({source: d1, target: d2}),
            e1 = conn.endpoints[0], e2 = conn.endpoints[1];

        equal(e1.anchor.x, 0, "top leftanchor");
        equal(e2.anchor.y, 0, "top left anchor");
        equal(e2.anchor.x, 1, "top right anchor");
        equal(e2.anchor.y, 0, "top right anchor");

        _jsPlumb.restoreDefaults();

        var conn2 = _jsPlumb.connect({source: d1, target: d2}),
            e3 = conn2.endpoints[0], e4 = conn2.endpoints[1];

        equal(e3.anchor.x, 0.5, "bottom center anchor");
        equal(e3.anchor.y, 1, "bottom center anchor");
        equal(e4.anchor.x, 0.5, "bottom center anchor");
        equal(e4.anchor.y, 1, "bottom center anchor");
    });


    test("defaults are isolated", function() {

        var foo = document.createElement("FOO");
        document.body.appendChild(foo);
        ok(_jsPlumb.Defaults.anchors[0] == null, "no anchors set (to take one example, one's enough)");
        var j = jsPlumbBrowserUI.newInstance({
            container:foo,
            anchors:["Left", "Right"]
        });

        ok(_jsPlumb.Defaults.anchors[0] == null, "still no anchors set after providing Anchors to an instance");

        jsPlumbTestSupport.getInstance(j).cleanup();
        foo.parentNode.removeChild(foo);

    });



// setId function

    // test(" setId, taking two strings, only default scope", function () {
    //     var d1 = support.addDiv("d1", null, null, 50, 50, 100, 100);
    //     var d2 = support.addDiv("d2", null, null, 250, 250, 100, 100);
    //
    //     _jsPlumb.Defaults.maxConnections = -1;
    //     var e1 = _jsPlumb.addEndpoint(d1),
    //         e2 = _jsPlumb.addEndpoint(d2),
    //         e3 = _jsPlumb.addEndpoint(d1);
    //
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     equal(e1.elementId, "d1", "endpoint has correct element id");
    //     equal(e3.elementId, "d1", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d1", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d1", "anchor has correct element id");
    //
    //     var c = _jsPlumb.connect({source: e1, target: e2}),
    //         c2 = _jsPlumb.connect({source: e2, target: e1});
    //
    //     _jsPlumb.setId("d1", "d3");
    //     // the endpoint count hasnt changed, and this illustrates why setId is now pointless.
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     //support.assertEndpointCount(d1, 0, _jsPlumb);
    //
    //     equal(e1.elementId, "d3", "endpoint has correct element id");
    //     equal(e3.elementId, "d3", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d3", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d3", "anchor has correct element id");
    //
    //     equal(c.sourceId, "d3", "connection's sourceId has changed");
    //     equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
    //     equal(c2.targetId, "d3", "connection's targetId has changed");
    //     equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    // });
    //
    //
    //
    // test(" setId, taking a DOM element and a string, only default scope", function () {
    //     var d1 = support.addDiv("d1", null, null, 50, 50, 100, 100);
    //     var d2 = support.addDiv("d2", null, null, 250, 250, 100, 100);
    //
    //     _jsPlumb.Defaults.maxConnections = -1;
    //     var e1 = _jsPlumb.addEndpoint(d1),
    //         e2 = _jsPlumb.addEndpoint(d2),
    //         e3 = _jsPlumb.addEndpoint(d1);
    //
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     equal(e1.elementId, "d1", "endpoint has correct element id");
    //     equal(e3.elementId, "d1", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d1", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d1", "anchor has correct element id");
    //
    //     var c = _jsPlumb.connect({source: e1, target: e2}),
    //         c2 = _jsPlumb.connect({source: e2, target: e1});
    //
    //     _jsPlumb.setId(document.getElementById("d1"), "d3");
    //     //support.assertEndpointCount(d3, 2, _jsPlumb);
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //
    //     equal(e1.elementId, "d3", "endpoint has correct element id");
    //     equal(e3.elementId, "d3", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d3", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d3", "anchor has correct element id");
    //
    //     equal(c.sourceId, "d3", "connection's sourceId has changed");
    //     equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
    //     equal(c2.targetId, "d3", "connection's targetId has changed");
    //     equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    // });
    //
    // test(" setId, taking two strings, mix of scopes", function () {
    //     var d1 =  support.addDiv("d1", null, null, 50, 50, 100, 100);
    //     var d2 = support.addDiv("d2", null, null, 250, 250, 100, 100);
    //
    //     _jsPlumb.Defaults.maxConnections = -1;
    //     var e1 = _jsPlumb.addEndpoint(d1),
    //         e2 = _jsPlumb.addEndpoint(d2),
    //         e3 = _jsPlumb.addEndpoint(d1);
    //
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     equal(e1.elementId, "d1", "endpoint has correct element id");
    //     equal(e3.elementId, "d1", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d1", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d1", "anchor has correct element id");
    //
    //     var c = _jsPlumb.connect({source: e1, target: e2, scope: "FOO"}),
    //         c2 = _jsPlumb.connect({source: e2, target: e1});
    //
    //     _jsPlumb.setId("d1", "d3");
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     //support.assertEndpointCount(d1, 0, _jsPlumb);
    //
    //     equal(e1.elementId, "d3", "endpoint has correct element id");
    //     equal(e3.elementId, "d3", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d3", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d3", "anchor has correct element id");
    //
    //     equal(c.sourceId, "d3", "connection's sourceId has changed");
    //     equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
    //     equal(c2.targetId, "d3", "connection's targetId has changed");
    //     equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    // });
    //
    // test(" setId, taking a DOM element and a string, mix of scopes", function () {
    //     var d1 = support.addDiv("d1", null, null, 50, 50, 100, 100);
    //     var d2 = support.addDiv("d2", null, null, 250, 250, 100, 100);
    //
    //     _jsPlumb.Defaults.maxConnections = -1;
    //     var e1 = _jsPlumb.addEndpoint(d1),
    //         e2 = _jsPlumb.addEndpoint(d2),
    //         e3 = _jsPlumb.addEndpoint(d1);
    //
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     equal(e1.elementId, "d1", "endpoint has correct element id");
    //     equal(e3.elementId, "d1", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d1", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d1", "anchor has correct element id");
    //
    //     var c = _jsPlumb.connect({source: e1, target: e2, scope: "FOO"}),
    //         c2 = _jsPlumb.connect({source: e2, target: e1});
    //
    //     _jsPlumb.setId(_jsPlumb.getSelector("#d1")[0], "d3");
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     //support.assertEndpointCount(d1, 0, _jsPlumb);
    //
    //     equal(e1.elementId, "d3", "endpoint has correct element id");
    //     equal(e3.elementId, "d3", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d3", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d3", "anchor has correct element id");
    //
    //     equal(c.sourceId, "d3", "connection's sourceId has changed");
    //     equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
    //     equal(c2.targetId, "d3", "connection's targetId has changed");
    //     equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    // });
    //
    // test(" setIdChanged, ", function () {
    //     var d1 = support.addDiv("d1", null, null, 50, 50, 100, 100);
    //     var d2 = support.addDiv("d2", null, null, 250, 250, 100, 100);
    //
    //     _jsPlumb.Defaults.maxConnections = -1;
    //     var e1 = _jsPlumb.addEndpoint(d1),
    //         e2 = _jsPlumb.addEndpoint(d2),
    //         e3 = _jsPlumb.addEndpoint(d1);
    //
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     equal(e1.elementId, "d1", "endpoint has correct element id");
    //     equal(e3.elementId, "d1", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d1", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d1", "anchor has correct element id");
    //
    //     var c = _jsPlumb.connect({source: e1, target: e2}),
    //         c2 = _jsPlumb.connect({source: e2, target: e1});
    //
    //     document.getElementById("d1").setAttribute("id", "d3");
    //
    //     _jsPlumb.setIdChanged("d1", "d3");
    //
    //     support.assertEndpointCount(d1, 2, _jsPlumb);
    //     //support.assertEndpointCount(d1, 0, _jsPlumb);
    //
    //     equal(e1.elementId, "d3", "endpoint has correct element id");
    //     equal(e3.elementId, "d3", "endpoint has correct element id");
    //     equal(e1.anchor.elementId, "d3", "anchor has correct element id");
    //     equal(e3.anchor.elementId, "d3", "anchor has correct element id");
    //
    //     equal(c.sourceId, "d3", "connection's sourceId has changed");
    //     equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
    //     equal(c2.targetId, "d3", "connection's targetId has changed");
    //     equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    // });
    //
    // // TODO this test is pointless soon.
    // test(" setId, taking two strings, testing makeSource/makeTarget", function () {
    //     var d1 = support.addDiv("d1", null, null, 50, 50, 100, 100);
    //     var d2 = support.addDiv("d2", null, null, 250, 250, 100, 100);
    //
    //     // setup d1 as a source
    //     _jsPlumb.makeSource(d1, {
    //         endpoint:"Rectangle",
    //         parameters:{
    //             foo:"foo"
    //         }
    //     });
    //     // and d2 as a target
    //     _jsPlumb.makeTarget(d2, {
    //         endpoint:"Rectangle"
    //     });
    //
    //     // connect them, and check that the endpoints are of tyoe Rectangle, per the makeSource/makeTarget
    //     // directives
    //     var c = _jsPlumb.connect({source: d1, target: d2});
    //     equal(c.endpoints[0].endpoint.getType(), "Rectangle", "source endpoint is rectangle");
    //     equal(c.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint is rectangle");
    //
    //     // now change the id of d1 and connect the new id, and check again that the source endpoint is Rectangle
    //     // _jsPlumb.setId(d1, "foo");
    //     // _jsPlumb.setId(d2, "bar");
    //     // var c2 = _jsPlumb.connect({source: foo, target: d2});
    //     // equal(c2.endpoints[0].endpoint.getType(), "Rectangle", "source endpoint is rectangle");
    //     // equal(c2.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint is rectangle");
    //
    // });
    //
    // test(" setId, taking two strings, testing makeSource/makeTarget with the mouse", function () {
    //     var d1 = support.addDiv("d1", null, null, 50, 50, 100, 100);
    //     var d2 = support.addDiv("d2", null, null, 250, 250, 100, 100);
    //
    //     // setup d1 as a source
    //     _jsPlumb.makeSource(d1, {
    //         endpoint:"Rectangle",
    //         parameters:{
    //             foo:"foo"
    //         }
    //     });
    //     // and d2 as a target
    //     _jsPlumb.makeTarget(d2, {
    //         endpoint:"Rectangle"
    //     });
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(1, _jsPlumb.select().length, "1 connection in instance.");
    //
    //     // now change the id of d1 and connect the new id, and check again that the source endpoint is Rectangle
    //     _jsPlumb.setId("d1", "foo");
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(2, _jsPlumb.select().length, "2 connections in instance.");
    //
    //     _jsPlumb.setId("d2", "bar");
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(3, _jsPlumb.select().length, "3 connections in instance.");
    //
    // });
    //
    // test(" setId, taking an element and a string, testing makeSource/makeTarget with the mouse", function () {
    //     var d1 = support.addDiv("d1", null, null, 50,50,100,100);
    //     var d2 = support.addDiv("d2",null, null, 250,250,100,100);
    //
    //     // setup d1 as a source
    //     _jsPlumb.makeSource(d1, {
    //         endpoint:"Rectangle",
    //         parameters:{
    //             foo:"foo"
    //         }
    //     });
    //     // and d2 as a target
    //     _jsPlumb.makeTarget(d2, {
    //         endpoint:"Rectangle"
    //     });
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(1, _jsPlumb.select().length, "1 connection in instance.");
    //
    //     // now change the id of d1 and connect the new id, and check again that the source endpoint is Rectangle
    //     _jsPlumb.setId(d1, "foo");
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(2, _jsPlumb.select().length, "2 connections in instance.");
    //
    //     _jsPlumb.setId(d2, "bar");
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(3, _jsPlumb.select().length, "3 connections in instance.");
    //
    // });
    //
    // test(" setIdChanged testing makeSource/makeTarget with the mouse", function () {
    //     var d1 = support.addDiv("d1", null, null, 50,50,100,100);
    //     var d2 = support.addDiv("d2",null, null, 250,250,100,100);
    //
    //     // setup d1 as a source
    //     _jsPlumb.makeSource(d1, {
    //         endpoint:"Rectangle",
    //         parameters:{
    //             foo:"foo"
    //         }
    //     });
    //     // and d2 as a target
    //     _jsPlumb.makeTarget(d2, {
    //         endpoint:"Rectangle"
    //     });
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(1, _jsPlumb.select().length, "1 connection in instance.");
    //
    //     // now change the id of d1 and connect the new id, and check again that the source endpoint is Rectangle
    //     d1.setAttribute("id", "foo");
    //     _jsPlumb.setIdChanged("d1", "foo");
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(2, _jsPlumb.select().length, "2 connections in instance.");
    //
    //     d2.setAttribute("id", "bar");
    //     _jsPlumb.setIdChanged("d2", "bar");
    //
    //     support.dragConnection(d1, d2);
    //
    //     equal(3, _jsPlumb.select().length, "3 connections in instance.");
    //
    // });

    test(" endpoint hide/show should hide/show overlays", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    [ "Label", { id: "label", label: "foo" } ]
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
                    [ "Label", { id: "label", label: "foo" } ]
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
                    ["Label", {id: "l"}]
                ]
            }),
            c2 = _jsPlumb.connect({
                source: d1,
                target: d2,
                overlays: [
                    ["Label", {id: "l"}]
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
                ["Label", {id: "l"}]
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
                    ["Arrow", {location: 0.3}],
                    ["Arrow", {location: 0.7}]
                ]
            });
        }

        var s = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").setHover(false).setLabel("baz");
        equal(s.length, 5, "there are five connections");

        for (var j = 0; j < 5; j++) {
            equal(_length(s.get(j).getOverlays()), 1, "one overlay: the label");
            equal(s.get(j).getParameter("foo"), "bar", "parameter foo has value 'bar'");
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
    //     var params = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").getParameter("foo");
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
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d1);

        equal(_jsPlumb.selectEndpoints().length, 2, "there are two endpoints");
        equal(_jsPlumb.selectEndpoints({element: d1}).length, 2, "there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: d2}).length, 0, "there are 0 endpoints on d2");

        equal(_jsPlumb.selectEndpoints({source: d1}).length, 0, "there are zero source endpoints on d1");
        equal(_jsPlumb.selectEndpoints({target: d1}).length, 0, "there are zero target endpoints on d1");
        equal(_jsPlumb.selectEndpoints({source: d2}).length, 0, "there are zero source endpoints on d2");
        equal(_jsPlumb.selectEndpoints({target: d2}).length, 0, "there are zero target endpoints on d2");

        equal(_jsPlumb.selectEndpoints({source: d1, scope: "FOO"}).length, 0, "there are zero source endpoints on d1 with scope FOO");

        _jsPlumb.addEndpoint(d2, { scope: "FOO", isSource: true });
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
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d2, {isSource: true});

        equal(_jsPlumb.selectEndpoints({source: d1}).length, 1, "there is one source endpoint on d1");
        equal(_jsPlumb.selectEndpoints({target: d1}).length, 0, "there are zero target endpoints on d1");

        equal(_jsPlumb.selectEndpoints({source: d2}).length, 1, "there is one source endpoint on d2");

        equal(_jsPlumb.selectEndpoints({source: [d2, d1]}).length, 2, "there are two source endpoints between d1 and d2");
    });

    test(" selectEndpoints, isTarget tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isTarget: true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d2, {isTarget: true});

        equal(_jsPlumb.selectEndpoints({target: d1}).length, 1, "there is one target endpoint on d1");
        equal(_jsPlumb.selectEndpoints({source: d1}).length, 0, "there are zero source endpoints on d1");

        equal(_jsPlumb.selectEndpoints({target: d2}).length, 1, "there is one target endpoint on d2");

        equal(_jsPlumb.selectEndpoints({target: [d2, d1]}).length, 2, "there are two target endpoints between d1 and d2");
    });

    test(" selectEndpoints, isSource + isTarget tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d1, {isSource: true}),
            e4 = _jsPlumb.addEndpoint(d1, {isTarget: true});

        equal(_jsPlumb.selectEndpoints({source:d1}).length, 2, "there are two source endpoints on d1");
        equal(_jsPlumb.selectEndpoints({target: d1}).length, 2, "there are two target endpoints on d1");

        equal(_jsPlumb.selectEndpoints({target: d1, source: d1}).length, 1, "there is one source and target endpoint on d1");

        equal(_jsPlumb.selectEndpoints({element: d1}).length, 4, "there are four endpoints on d1");

    });

    test(" selectEndpoints, delete endpoints", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

        equal(_jsPlumb.selectEndpoints({element: d1}).length, 1, "there is one endpoint on d1");
        _jsPlumb.selectEndpoints({source: d1}).deleteAll();
        equal(_jsPlumb.selectEndpoints({element: d1}).length, 0, "there are zero endpoints on d1");
    });

    test(" selectEndpoints, detach connections", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true}),
            e2 = _jsPlumb.addEndpoint(d2, {isSource: true, isTarget: true});

        _jsPlumb.connect({source: e1, target: e2});

        equal(e1.connections.length, 1, "there is one connection on d1's endpoint");
        equal(e2.connections.length, 1, "there is one connection on d2's endpoint");

        _jsPlumb.selectEndpoints({source: d1}).deleteEveryConnection();

        equal(e1.connections.length, 0, "there are zero connections on d1's endpoint");
        equal(e2.connections.length, 0, "there are zero connections on d2's endpoint");
    });

    test(" selectEndpoints, hover tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

        equal(e1.isHover(), false, "hover not set");
        _jsPlumb.selectEndpoints({source: d1}).setHover(true);
        equal(e1.isHover(), true, "hover set");
        _jsPlumb.selectEndpoints({source: d1}).setHover(false);
        equal(e1.isHover(), false, "hover no longer set");
    });

    test(" selectEndpoints, setEnabled tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

        equal(e1.enabled, true, "endpoint is enabled");
        _jsPlumb.selectEndpoints({source: d1}).setEnabled(false);
        equal(e1.enabled, false, "endpoint not enabled");
    });

    test(" selectEndpoints, setEnabled tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

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

        //c.setHover(true);
        _jsPlumb.setHover(c, true);

        equal(c.paintStyleInUse.stroke, "BAZ", "stroke was set");
        equal(c.paintStyleInUse.strokeWidth, 444, "strokeWidth was set");

        equal(c.getPaintStyle().stroke, "FOO", "getPaintStyle returns correct value");
        equal(c.getHoverPaintStyle().stroke, "BAZ", "getHoverPaintStyle returns correct value");
    });


// ------------------------------- manage -----------------------------------------

    test("Manage adds jtk-managed attribute", function() {
        var d1 = support.addDiv("d1"), f1 = false;

        _jsPlumb.manage(d1);
        ok(d1.getAttribute("jtk-managed") != null, "d1 is marked jtk-managed");
        _jsPlumb.unmanage(d1);
        ok(d1.getAttribute("jtk-managed") == null, "d1 is no longer marked jtk-managed");
    });

    test("Manage supports optional internal id", function() {
        var d1 = support.addDiv("d1"), f1 = false;

        _jsPlumb.manage(d1, "foo");
        equal(d1.getAttribute("jtk-id"), "foo", "jtk-id attribute set per value passed in to manage method");

        _jsPlumb.unmanage(d1);
        ok(d1.getAttribute("jtk-managed") == null, "d1 is no longer marked jtk-managed");
        ok(d1.getAttribute("jtk-id") == null, "d1 no longer has jtk-id attribute");
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

    test("Object.assign, filter values", function () {
        var n = ["foo", "bar", "baz"],
            t = {"hello": "hello", "foo": "replaced"},
            f = {"foo": "new", "bar": "bar"};

        Object.assign(t, f, n);
        equal(t.foo, "new");
        equal(t.hello, "hello");
        equal(t.bar, "bar");
    });

    // -- geometry tests have been moved into the jtk-geom project (because that's where the code is now) ---


    // test(" arc segment tests", function () {
    //     var r = 10, circ = 2 * Math.PI * r;
    //     // first, an arc up and to the right (clockwise)
    //     var params = { r: r, x1: 0, y1: 0, x2: 10, y2: -10, cx: 10, cy: 0 };
    //     var s = new jsPlumb.Segments["Arc"](params);
    //     // segment should be one quarter of the circumference
    //     equal(s.getLength(), 0.25 * circ, "length of segment is correct");
    //     // point 0 is (0,0)
    //     var p1 = s.pointOnPath(0);
    //     within(p1.x, 0, ok, "start x is correct");
    //     within(p1.y, 0, ok, "start y is correct");
    //     // point 1 is (10, -10)
    //     var p2 = s.pointOnPath(1);
    //     within(p2.x, 10, ok, "end x is correct");
    //     within(p2.y, -10, ok, "end y is correct");
    //     // point at loc 0.5 is (2.92, -7.07))
    //     var p3 = s.pointOnPath(0.5);
    //     within(p3.x, 10 - (Math.sqrt(2) / 2 * 10), ok, "end x is correct");
    //     within(p3.y, -(Math.sqrt(2) / 2 * 10), ok, "end y is correct");
    //     // gradients
    //     equal(s.gradientAtPoint(0), -Infinity, "gradient at location 0 is -Infinity");
    //     equal(s.gradientAtPoint(1), 0, "gradient at location 1 is 0");
    //     within(s.gradientAtPoint(0.5), -1, ok, "gradient at location 0.5 is -1");
    //
    //     // an arc up and to the left (anticlockwise)
    //     params = { r: r, x1: 0, y1: 0, x2: -10, y2: -10, cx: -10, cy: 0, ac: true };
    //     s = new jsPlumb.Segments["Arc"](params);
    //     equal(s.getLength(), 0.25 * circ, "length of segment is correct");
    //     // point 0 is (0,0)
    //     p1 = s.pointOnPath(0);
    //     within(p1.x, 0, ok, "start x is correct");
    //     within(p1.y, 0, ok, "start y is correct");
    //     // point 1 is (-10, -10)
    //     p2 = s.pointOnPath(1);
    //     within(p2.x, -10, ok, "end x is correct");
    //     within(p2.y, -10, ok, "end y is correct");
    //     // point at loc 0.5 is (-2.92, -7.07))
    //     p3 = s.pointOnPath(0.5);
    //     within(p3.x, -2.9289321881345245, ok, "end x is correct");
    //     within(p3.y, -7.071067811865477, ok, "end y is correct");
    //     // gradients
    //     equal(s.gradientAtPoint(0), -Infinity, "gradient at location 0 is -Infinity");
    //     equal(s.gradientAtPoint(1), 0, "gradient at location 1 is 0");
    //     within(s.gradientAtPoint(0.5), 1, ok, "gradient at location 0.5 is 1");
    //
    //
    //     // clockwise, 180 degrees
    //     params = { r: r, x1: 0, y1: 0, x2: 0, y2: 20, cx: 0, cy: 10 };
    //     s = new jsPlumb.Segments["Arc"](params);
    //     equal(s.getLength(), 0.5 * circ, "length of segment is correct");
    //     p1 = s.pointOnPath(0);
    //     within(p1.x, 0, ok, "start x is correct");
    //     within(p1.y, 0, ok, "start y is correct");
    //     p2 = s.pointOnPath(1);
    //     within(p2.x, 0, ok, "end x is correct");
    //     within(p2.y, 20, ok, "end y is correct");
    //     var p3 = s.pointOnPath(0.5);
    //     within(p3.x, 10, ok, "end x is correct");
    //     within(p3.y, 10, ok, "end y is correct");
    //     // gradients
    //     equal(s.gradientAtPoint(0), 0, "gradient at location 0 is 0");
    //     equal(s.gradientAtPoint(1), 0, "gradient at location 1 is 0");
    //     equal(s.gradientAtPoint(0.5), Infinity, "gradient at location 0.5 is Infinity");
    //
    //
    //     // anticlockwise, 180 degrees
    //     params = { r: r, x1: 0, y1: 0, x2: 0, y2: -20, cx: 0, cy: -10, ac: true };
    //     s = new jsPlumb.Segments["Arc"](params);
    //     equal(s.getLength(), 0.5 * circ, "length of segment is correct");
    //     p1 = s.pointOnPath(0);
    //     within(p1.x, 0, ok, "start x is correct");
    //     within(p1.y, 0, ok, "start y is correct");
    //     p2 = s.pointOnPath(1);
    //     within(p2.x, 0, ok, "end x is correct");
    //     within(p2.y, -20, ok, "end y is correct");
    //     var p3 = s.pointOnPath(0.5);
    //     within(p3.x, 10, ok, "end x is correct");
    //     within(p3.y, -10, ok, "end y is correct");
    //
    //
    //     // clockwise, 270 degrees
    //     params = { r: r, x1: 0, y1: 0, x2: -10, y2: 10, cx: 0, cy: 10 };
    //     s = new jsPlumb.Segments["Arc"](params);
    //     equal(s.getLength(), 0.75 * circ, "length of segment is correct");
    //     p1 = s.pointOnPath(0);
    //     within(p1.x, 0, ok, "start x is correct");
    //     within(p1.y, 0, ok, "start y is correct");
    //     p2 = s.pointOnPath(1);
    //     within(p2.x, -10, ok, "end x is correct");
    //     within(p2.y, 10, ok, "end y is correct");
    //     var p3 = s.pointOnPath(0.5);
    //     within(p3.x, 7.071067811865477, ok, "end x is correct");
    //     within(p3.y, 17.071067811865477, ok, "end y is correct");
    //
    //
    //     // anticlockwise, 90 degrees
    //     params = { r: r, x1: 0, y1: 0, x2: -10, y2: 10, cx: 0, cy: 10, ac: true };
    //     s = new jsPlumb.Segments["Arc"](params);
    //     equal(s.getLength(), 0.25 * circ, "length of segment is correct");
    //     p1 = s.pointOnPath(0);
    //     within(p1.x, 0, ok, "start x is correct");
    //     within(p1.y, 0, ok, "start y is correct");
    //     p2 = s.pointOnPath(1);
    //     within(p2.x, -10, ok, "end x is correct");
    //     within(p2.y, 10, ok, "end y is correct");
    //     var p3 = s.pointOnPath(0.5);
    //     within(p3.x, -7.071067811865477, ok, "end x is correct");
    //     within(p3.y, 2.9289321881345245, ok, "end y is correct");
    //
    //
    //     // anticlockwise, 270 degrees
    //     params = { r: r, x1: 0, y1: 0, x2: 10, y2: 10, cx: 0, cy: 10, ac: true };
    //     s = new jsPlumb.Segments["Arc"](params);
    //     equal(s.getLength(), 0.75 * circ, "length of segment is correct");
    //     p1 = s.pointOnPath(0);
    //     within(p1.x, 0, ok, "start x is correct");
    //     within(p1.y, 0, ok, "start y is correct");
    //     p2 = s.pointOnPath(1);
    //     within(p2.x, 10, ok, "end x is correct");
    //     within(p2.y, 10, ok, "end y is correct");
    //     var p3 = s.pointOnPath(0.5);
    //     within(p3.x, -7.071067811865477, ok, "end x is correct");
    //     within(p3.y, 17.071067811865477, ok, "end y is correct");
    //
    //
    // });

// *********************************** jsPlumbUtil.extend tests *****************************************************



    test(" addClass method of Connection", function () {
        var d1 = support.addDiv("d1");
            var d2 = support.addDiv("d2");
            var c = _jsPlumb.connect({source: d1, target: d2, overlays:[
                [ "Label", { id:"label", label:'hey'}]
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
        var d1 = support.addDiv(d1);//, _d1 = [ d1 ];

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
    });

    test("endpointStyle on connect method", function () {
        support.addDivs(["d1", "d2"]);
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            endpointStyle: { fill: "blue" }
        });

        equal(support.getEndpointCanvas(c.endpoints[0]).childNodes[0].childNodes[0].getAttribute("fill"), "blue", "endpoint style passed through by connect method");
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
        _jsPlumb.makeSource(d1);

        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            endpointStyle: { fill: "blue" }
        });

        equal(support.getEndpointCanvas(c.endpoints[0]).childNodes[0].childNodes[0].getAttribute("fill"), "blue", "endpoint style passed through by connect method");
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
                [ 'Label', labelDef ]
            ]
        });

        //var o = connection.addOverlay(['Label', labelDef]);

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
        var id = d1.getAttribute("jtk-id")
        var cd = _jsPlumb.getCachedData(id);
       ok(cd != null, "d1 is cached");

        // reset and then move d1. get cached data and offset should have been updated.
        _jsPlumb.reset();
        d1.style.position = "absolute";
        d1.style.left = "5000px";
        var cd2 = _jsPlumb.getCachedData("d1");
        ok(cd2 == null, "cache data cleared");
        _jsPlumb.connect({source:d1, target:d2});
        var cd3 = _jsPlumb.getCachedData(id);
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
                    [ "Label", {
                        id:"label",
                        label:'hey',
                        events:{
                            click:function() {
                                count++;
                            }
                        }
                    }],
                    [ "Arrow", {
                        id:"arrow",
                        events:{
                            click:function() {
                                count++
                            }
                        }
                    }]
            ]}), o = c.getOverlay("label"), o2 = c.getOverlay("arrow");

        o.fire("click");
        ok(count == 1, "click event was triggered on label overlay");

        o2.fire("click");
        ok(count == 2, "click event was triggered on arrow overlay");
    });

    test("endpoint unmatched scopes", function() {
        var sourceEndpoint = {
                isSource: true,
                scope: "blue"
            }, targetEndpoint = {
                isTarget:true
            },
            d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, sourceEndpoint),
            e2 = _jsPlumb.addEndpoint(d2, targetEndpoint);

        var c = _jsPlumb.connect({source:e1, target:e2});

        ok(c == null, "no connection as scopes dont match");
    });

    test("endpoint passes scope to connection, programmatic connection", function() {
        var sourceEndpoint = {
            isSource: true,
            scope: "blue"
            }, targetEndpoint = {
            isTarget:true,
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

        _jsPlumb.bind("click", function() {
            c++;
        });

        _jsPlumb.bind("endpointClick", function() {
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

        _jsPlumb.bind("dblclick", function() {
            c++;
        });

        _jsPlumb.bind("endpointDblClick", function() {
            ec++;
        });

        // the SVG element
        _jsPlumb.trigger(support.getEndpointCanvas(e).childNodes[0], "dblclick");

        // the path element
        _jsPlumb.trigger(support.getEndpointCanvas(e).childNodes[0].childNodes[0], "dblclick");

        // the main endpoint element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "dblclick");

        // each of those should have triggered a single click

        equal(ec, 3, "3 endpoint dbl clicks");
        equal(c, 0, "no other dbl clicks");
    });

    test("endpoint mouseover/mouseout", function() {
        var d = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d),
            mm = 0,
            mo = 0;

        _jsPlumb.bind("endpointMouseOver", function() {
            mm++;
        });

        _jsPlumb.bind("endpointMouseOut", function() {
            mo++;
        });

        // the SVG element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "mouseover");

        // the path element
        _jsPlumb.trigger(support.getEndpointCanvas(e), "mouseout");

        equal(mo, 1, "1 endpoint mouseout");
        equal(mm, 1, "1 endpoint mouseover");
    });

    test("connector click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2}),
            c = 0;

        _jsPlumb.bind("click", function() {
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

        _jsPlumb.bind("dblclick", function() {
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

        _jsPlumb.bind("connectionMouseOver", function() {
            mm++;
        });

        _jsPlumb.bind("connectionMouseOut", function() {
            mo++;
        });

        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "mouseover");

        _jsPlumb.trigger(support.getConnectionCanvas(conn).childNodes[0], "mouseout");

        equal(mo, 1, "1 connection mouseout");
        equal(mm, 1, "1 connection mouseover");
    });

    test("arrow overlay click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                [ "Arrow", { id:"lbl" }]
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("click", function() {
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
                [ "Arrow", { id:"lbl" }]
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("dblclick", function() {
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
                    [ "Label", { id:"lbl" }]
                ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("click", function() {
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
                    [ "Label", { id:"lbl" }]
                ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("dblclick", function() {
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
               endpoint:["Dot", { radius:250 }]
           });

        equal(e.endpoints[0].endpoint.radius, 250, "radius is set correctly and retrievable");
    });

    test("retrieve endpoint params, Rectangle endpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = _jsPlumb.connect({
                source:d1,
                target:d2,
                endpoint:["Rectangle", { width:250, height:250 }]
            });

        equal(e.endpoints[0].endpoint.width, 250, "width is set correctly and retrievable");
        equal(e.endpoints[0].endpoint.height, 250, "height is set correctly and retrievable");
        ok(e.endpoints[0].endpoint.x != null, "x is set and retrievable");
        ok(e.endpoints[0].endpoint.y != null, "y is set and retrievable");
    });

// ---------------------------- pluggable size/position handler --------------------------------


    test("pluggable getSize", function() {
        var foo = support.addDiv("foo", document.body);
        document.body.appendChild(foo);
        var j = jsPlumbBrowserUI.newInstance({
            container:foo
        }, {
            getSize:function() { return [100,100]; }
        });

        var d = support.addDiv("d");
        equal(j.getSize(d)[0], 100, "width is set by pluggable function");
        equal(j.getSize(d)[1], 100, "height is set by pluggable function");

        jsPlumbTestSupport.getInstance(j).cleanup();
    });

    test("pluggable getOffset", function() {
        var foo = support.addDiv("foo", document.body);
        var j = jsPlumbBrowserUI.newInstance({
            container:foo
        }, {
            getOffset:function() { return {left:100, top:100}; }
        });

        var d = support.addDiv("d");
        equal(j.getOffset(d).left, 100, "offset left is set by pluggable function");
        equal(j.getOffset(d).top, 100, "offset top is set by pluggable function");

        jsPlumbTestSupport.getInstance(j).cleanup();
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
        var e1 = _jsPlumb.addEndpoint(d1, { anchor: "Top", connector:["Flowchart", {cssClass: "connector"}], endpoint: "Rectangle"} );
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
        var o = connection.addOverlay(['Label', {label:"first label"}]);
        equal(0.5, o.location, "label is at default location of 0.5");

        var connection2 = _jsPlumb.connect({ source: box1, target: box2 });
        connection2.mergeData({labelLocation:0.2});
        var o2 = connection2.addOverlay(['Label', {label:"second label"}]);
        equal(0.2, o2.location, "label is at location of 0.2, which is the value of the `labelLocation` value in the connection's data");

        var connection3 = _jsPlumb.connect({ source: box1, target: box2 });
        connection3.mergeData({theattribute:0.1});
        var o3 = connection3.addOverlay(['Label', {label:"second label", labelLocationAttribute:"theattribute"}]);
        equal(0.1, o3.location, "label is at location of 0.1, which is the value of an attribute whose name was specified in the addOverlay call, and whose value is in the connection data");

    });

    test("connection.replaceEndpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                endpoint:[ "Dot", { radius:15 } ]
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                endpoint:[ "Dot", { radius:25 } ]
            }),
            c = _jsPlumb.connect({source:e1, target:e2});

        equal(15, c.endpoints[0].endpoint.radius, "endpoint 1 has radius 15");
        equal(25, c.endpoints[1].endpoint.radius, "endpoint 2 has radius 25");

        equal("Dot", c.endpoints[0].endpoint.getType(), "endpoint 1 is a Dot");
        equal("Dot", c.endpoints[1].endpoint.getType(), "endpoint 2 is a Dot");

        c.replaceEndpoint(0, [ "Rectangle", {width:50,height:50}]);
        c.replaceEndpoint(1, [ "Dot", {radius:100}]);

        equal(50, c.endpoints[0].endpoint.width, "endpoint 1 now has width 50");
        equal(50, c.endpoints[0].endpoint.height, "endpoint 1 now has height 50");
        equal(100, c.endpoints[1].endpoint.radius, "endpoint 2 now has radius 100");

        equal("Rectangle", c.endpoints[0].endpoint.getType(), "endpoint 1 is now a Rectangle");
        equal("Dot", c.endpoints[1].endpoint.getType(), "endpoint 2 is now a Dot");
    });
};


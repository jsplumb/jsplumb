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

var testSuite = function () {

    module("jsPlumb", {
        teardown: function () {
            support.cleanup();
            removeContainer()
        },
        setup: function () {
            makeContainer()
            _jsPlumb = jsPlumb.newInstance({container:container});
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });

    test(': _jsPlumb.connect (between two Endpoints)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        ok(e, 'endpoint e exists');
        ok(e2, 'endpoint e2 exists');
        support.assertEndpointCount(d1, 1);
        support.assertEndpointCount(d2, 1);
        var c = _jsPlumb.connect({target: 'd2', sourceEndpoint: e, targetEndpoint: e2});
        support.assertEndpointCount(d1, 1);		// no new endpoint should have been added
        support.assertEndpointCount(d2, 1); 		// no new endpoint should have been added

        ok(c.id != null, "connection has had an id assigned");

        support.assertManagedEndpointCount(d1, 1)
        support.assertManagedConnectionCount(d1, 1)

        _jsPlumb.deleteEndpoint(e)
        support.assertManagedEndpointCount(d1, 0)
        support.assertManagedConnectionCount(d1, 0)


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
            c = _jsPlumb.connect({source: d1, target: d2, anchors: ["Left", "Right"]}),
            sa = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            ta = _jsPlumb.router.getEndpointLocation(c.endpoints[1])

        equal(sa.x, 0, "source anchor is at x=0");
        equal(sa.y, 0.5, "source anchor is at y=0.5");
        equal(ta.x, 1, "target anchor is at x=1");
        equal(ta.y, 0.5, "target anchor is at y=0.5");

        support.assertManagedEndpointCount(d1, 1)
        support.assertManagedConnectionCount(d1, 1)

        _jsPlumb.deleteConnection(c)
        support.assertManagedEndpointCount(d1, 0)
        support.assertManagedConnectionCount(d1, 0)
    });

    test(': _jsPlumb.connect (by endpoint)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
    });

    test(': _jsPlumb.connect (cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17, cost: 567});
        equal(c.cost, 567, "connection cost is 567");
    });

    test(': _jsPlumb.connect (default cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.cost, 1, "default connection cost is 1");
    });

    test(': _jsPlumb.connect (set cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.cost, 1, "default connection cost is 1");
        c.cost = 8989;
        equal(c.cost, 8989, "connection cost is 8989");
    });

    test(': _jsPlumb.connect two endpoints (connectionCost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, connectionCost: 567});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.cost, 567, "connection cost is 567");
    });

    test(': _jsPlumb.connect two endpoints (change connectionCost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {source: true, connectionCost: 567, maxConnections: -1}),
            e17 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
        c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.cost, 567, "connection cost is 567");
        e16.connectionCost = 23;
        var c2 = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c2.cost, 23, "connection cost is 23 after change on endpoint");
    });

    test(': _jsPlumb.connect (directed is undefined by default)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {source: true}),
            e17 = _jsPlumb.addEndpoint(d17, {source: true}),
            c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.directed, undefined, "default connection is not directed");
    });

    test(': _jsPlumb.connect (directed true)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {source: true}),
            e17 = _jsPlumb.addEndpoint(d17, {source: true}),
            c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17, directed: true});
        equal(c.directed, true, "connection is directed");
    });

    test(': _jsPlumb.connect two endpoints (connectionsDirected)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {source: true, connectionsDirected: true, maxConnections: -1});
        ok(e16._anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.directed, true, "connection is directed");
    });

    test(': _jsPlumb.connect two endpoints (change connectionsDirected)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {source: true, connectionsDirected: true, maxConnections: -1}),
            e17 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
        c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.directed, true, "connection is directed");
        e16.connectionsDirected = false;
        var c2 = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c2.directed, false, "connection is not directed");
    });

    test(": _jsPlumb.connect (two Endpoints - that have been already added - by UUID)", function () {
        var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e1 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1, uuid: srcEndpointUuid});
        var e2 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1, uuid: dstEndpointUuid});
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
        var e1 = _jsPlumb.addEndpoint(d16, {source: true, maxConnections: -1});
        var e2 = _jsPlumb.addEndpoint(d17, {source: true, maxConnections: -1});
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
        equal(conn.connector.type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (Connector test, bezier, no params)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Bezier" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.connector.type, "Bezier", "Bezier connector chosen for connection");
        equal(conn.connector.getCurviness(), 150, "Bezier connector chose 150 curviness");
    });

    test(": _jsPlumb.connect (Connector test, bezier, curviness as int)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: { type:"Bezier", options:{ curviness: 200 }} });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.connector.type, "Bezier", "Canvas Bezier connector chosen for connection");
        equal(conn.connector.getCurviness(), 200, "Bezier connector chose 200 curviness");
    });

    test(": _jsPlumb.connect (Connector test, bezier, curviness as named option)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: {type:"Bezier", options:{curviness: 300}} });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.connector.type, "Bezier", "Bezier connector chosen for connection");
        equal(conn.connector.getCurviness(), 300, "Bezier connector chose 300 curviness");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] }),
            sa = _jsPlumb.router.getEndpointLocation(conn.endpoints[0]),
            ta = _jsPlumb.router.getEndpointLocation(conn.endpoints[1]);

        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.connector.type, "Straight", "Canvas Straight connector chosen for connection");
        equal(0.3, sa.x, "source anchor x");
        equal(0.3, sa.y, "source anchor y");
        equal(0.7, ta.x, "target anchor x");
        equal(0.7, ta.y, "target anchor y");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as strings)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: ["Left", "Right"] }),
            sa = _jsPlumb.router.getEndpointLocation(conn.endpoints[0]),
            ta = _jsPlumb.router.getEndpointLocation(conn.endpoints[1]);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.connector.type, "Straight", "Straight connector chosen for connection");
        equal(0, sa.x, "source anchor x");
        equal(0.5, sa.y, "source anchor y");
        equal(1, ta.x, "target anchor x");
        equal(0.5, ta.y, "target anchor y");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] }),
            sa = _jsPlumb.router.getEndpointLocation(conn.endpoints[0]),
            ta = _jsPlumb.router.getEndpointLocation(conn.endpoints[1]);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.connector.type, "Straight", "Straight connector chosen for connection");
        equal(0.3, sa.x, "source anchor x");
        equal(0.3, sa.y, "source anchor y");
        equal(0.7, ta.x, "target anchor x");
        equal(0.7, ta.y, "target anchor y");
    });


    test(": _jsPlumb.connect (two argument method in which some data is reused across connections)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18"), d19 = support.addDiv("d19");
        var sharedData = { connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] };
        var conn = _jsPlumb.connect({ source: d16, target: d17}, sharedData),
            sa = _jsPlumb.router.getEndpointLocation(conn.endpoints[0]),
            ta = _jsPlumb.router.getEndpointLocation(conn.endpoints[1]);
        var conn2 = _jsPlumb.connect({ source: d18, target: d19}, sharedData),
            sa2 = _jsPlumb.router.getEndpointLocation(conn2.endpoints[0]),
            ta2 = _jsPlumb.router.getEndpointLocation(conn2.endpoints[1]);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 2, _jsPlumb);
        equal(conn.connector.type, "Straight", "Straight connector chosen for connection");
        equal(conn2.connector.type, "Straight", "Straight connector chosen for connection");
        equal(0.3, sa.x, "source anchor x");
        equal(0.3, sa.y, "source anchor y");
        equal(0.7, ta.x, "target anchor x");
        equal(0.7, ta.y, "target anchor y");
        equal(0.3, sa2.x, "source anchor x");
        equal(0.3, sa2.y, "source anchor y");
        equal(0.7, ta2.x, "target anchor x");
        equal(0.7, ta2.y, "target anchor y");
    });

    test(": _jsPlumb.connect (Connector as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.connector.type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (Endpoint test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Rectangle"] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.type, "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.type, "Rectangle", "Rectangle endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoint as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Rectangle"] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.type, "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.type, "Rectangle", "Rectangle endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoints test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Dot" ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.type, "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.type, "Dot", "Dot endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Blank Endpoint specified via 'endpoint' param)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Blank", "Blank"] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.type, "Blank", "Blank endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.type, "Blank", "Blank endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Blank Endpoint specified via 'endpoints' param)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Blank", "Blank" ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.type, "Blank", "Blank endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.type, "Blank", "Blank endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoint as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Dot" ] });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.type, "Rectangle", "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.type, "Dot", "Dot endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (by Endpoints, connector test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {});
        var e17 = _jsPlumb.addEndpoint(d17, {});
        window.FOO = "BAR"
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].connector.type, "Straight", "Straight connector chosen for connection");
        window.FOO = null;
    });

    test(": _jsPlumb.connect (by Endpoints, connector as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {});
        var e17 = _jsPlumb.addEndpoint(d17, {});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].connector.type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (by Endpoints, anchors as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var a16 = "Top", a17 = "Bottom";
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: a16});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: a17});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" }),
        sa = _jsPlumb.router.getEndpointLocation(conn.endpoints[0]),
            ta = _jsPlumb.router.getEndpointLocation(conn.endpoints[1]);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].connector.type, "Straight", "Straight connector chosen for connection");
        equal(sa.x, 0.5, "endpoint 16 is at top center");
        equal(sa.y, 0, "endpoint 16 is at top center");
        equal(ta.x, 0.5, "endpoint 17 is at bottom center");
        equal(ta.y, 1, "endpoint 17 is at bottom center");
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create anchors)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var a16 = [0, 0.5, 0, -1], a17 = [1, 0.0, -1, -1];
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: a16});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: a17});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" }),
            sa = _jsPlumb.router.getEndpointLocation(conn.endpoints[0]),
            ta = _jsPlumb.router.getEndpointLocation(conn.endpoints[1]);
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].connector.type, "Straight", "Straight connector chosen for connection");
        equal(sa.x, a16[0]);
        equal(sa.y, a16[1]);
        equal(ta.x, a17[0]);
        equal(ta.y, a17[1]);
        equal(  _jsPlumb.router.getEndpointOrientation(e16)[0], a16[2]);
        equal(_jsPlumb.router.getEndpointOrientation(e16)[1], a16[3]);
        equal(_jsPlumb.router.getEndpointOrientation(e17)[0], a17[2]);
        equal(_jsPlumb.router.getEndpointOrientation(e17)[1], a17[3]);
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchor')", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["Top", "Bottom"]});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" }),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor;
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].connector.type, "Straight", "Straight connector chosen for connection");
        equal(sa.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(ta.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchors')", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["Top", "Bottom"]});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" }),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor;
        assertConnectionByScopeCount(_jsPlumb.defaultScope, 1, _jsPlumb);
        equal(e16.connections[0].connector.type, "Straight", "Straight connector chosen for connection");
        equal(sa.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(ta.isDynamic, true, "Endpoint 17 has a dynamic anchor");
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


    test(": _jsPlumb.connect (connect by element, supplied endpoint and dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var endpoint = { source: true };
        var e1 = _jsPlumb.addEndpoint(d1, endpoint);
        var e2 = _jsPlumb.addEndpoint(d2, endpoint);
        var anchors = [ "Top", "Bottom" ];
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2, dynamicAnchors: anchors});
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).deleteAll();
        support.assertEndpointCount(d1, 1, _jsPlumb);
        support.assertEndpointCount(d2, 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (connect by element, supplied endpoints using 'source' and 'target' (this test is identical to the one above apart from the param names), and dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var endpoint = { source: true };
        var e1 = _jsPlumb.addEndpoint(d1, endpoint);
        var e2 = _jsPlumb.addEndpoint(d2, endpoint);
        var anchors = [ "Top", "Bottom" ];
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

    test(" _jsPlumb.defaults.ConnectionsDetachable", function () {
        _jsPlumb.defaults.connectionsDetachable = false;
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.isDetachable(), false, "connections not detachable by default (overrode the defaults)");
        _jsPlumb.defaults.connectionsDetachable = true;
    });


    test(": _jsPlumb.connect (testing for connection event callback)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var connectCallback = null, detachCallback = null;
        _jsPlumb.bind("connection", function (params) {
            connectCallback = jsPlumb.extend({}, params);
        });
        _jsPlumb.bind("connection:detach", function (params) {
            detachCallback = jsPlumb.extend({}, params);
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

    test(": _jsPlumb.connect (overlays, long-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {width: 40, length: 40, location: 0.7, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a"};
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id:"l"}},
                { type:"Arrow", options:arrowSpec }
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
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id: "aLabel"}},
                { type:"Arrow", options:arrowSpec }
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
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default overlays + overlays specified in connect call)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                    { type:"Label", options:{id: "label"}}
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default connection overlays)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default connection overlays + overlays specified in connect call)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                    { type:"Label", options:{id: "label"}}
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


    test(": _jsPlumb.connect (stroke color and width set using 'color' and `lineWidth')", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                color: "pink",
                lineWidth:15
            });

        equal(c.connector.canvas.querySelector("path").getAttribute("stroke"), "pink", "stroke color set via 'color' on connect call");
        equal(c.connector.canvas.querySelector("path").getAttribute("stroke-width"), "15", "stroke width set via 'lineWidth' on connect call");

        _jsPlumb.setColor(c, "yellow")
        _jsPlumb.setLineWidth(c, 25)

        equal(c.connector.canvas.querySelector("path").getAttribute("stroke"), "yellow", "stroke color changed via setColor call");
        equal(c.connector.canvas.querySelector("path").getAttribute("stroke-width"), "25", "stroke width changed via setLineWidth call");

    });

    test(": _jsPlumb.connect (outline color and outlinewidth set using 'outlineColor' and `outlineWidth')", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                color: "red",
                outlineColor: "pink",
                lineWidth:5,
                outlineWidth:15
            });

        equal(c.connector.canvas.querySelectorAll("path")[0].getAttribute("stroke"), "pink", "outline color set via 'color' on connect call");
        equal(c.connector.canvas.querySelectorAll("path")[0].getAttribute("stroke-width"), "35", "outline width set via 'lineWidth' on connect call");
        equal(c.connector.canvas.querySelectorAll("path")[1].getAttribute("stroke"), "red", "stroke color set via 'color' on connect call");
        equal(c.connector.canvas.querySelectorAll("path")[1].getAttribute("stroke-width"), "5", "stroke width set via 'lineWidth' on connect call");

        _jsPlumb.setColor(c, "yellow")
        _jsPlumb.setLineWidth(c, 25)
        _jsPlumb.setOutlineColor(c, "blue")
        _jsPlumb.setOutlineWidth(c, 35)

        equal(c.connector.canvas.querySelectorAll("path")[0].getAttribute("stroke"), "blue", "outline color changed via setOutlineColor call");
        equal(c.connector.canvas.querySelectorAll("path")[0].getAttribute("stroke-width"), "95", "stroke width changed via setOutlineWidth call");
        equal(c.connector.canvas.querySelectorAll("path")[1].getAttribute("stroke"), "yellow", "stroke color changed via setColor call");
        equal(c.connector.canvas.querySelectorAll("path")[1].getAttribute("stroke-width"), "25", "stroke width changed via setLineWidth call");

        _jsPlumb.setLineStyle(c, {
            color:"brown",
            lineWidth:2,
            outlineWidth:5,
            outlineColor:"cadetblue"
        })

        equal(c.connector.canvas.querySelectorAll("path")[0].getAttribute("stroke"), "cadetblue", "outline color changed via setLineStyle call");
        equal(c.connector.canvas.querySelectorAll("path")[0].getAttribute("stroke-width"), "12", "stroke width changed via setLineStyle call");
        equal(c.connector.canvas.querySelectorAll("path")[1].getAttribute("stroke"), "brown", "stroke color changed via setLineStyle call");
        equal(c.connector.canvas.querySelectorAll("path")[1].getAttribute("stroke-width"), "2", "stroke width changed via setLineStyle call");

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
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id: "aLabel"}},
                { type:"Arrow", options:arrowSpec }
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
        var arrowElement = arrowOverlay.path;
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
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id: "aLabel"}},
                { type:"Arrow", options:arrowSpec }
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
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id:"l"}},
                { type:"Arrow", options:jsPlumb.extend(arrowSpec, loc)}
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
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, cssClass: "PPPP", id:"l"}},
                { type:"Arrow", options:jsPlumb.extend(arrowSpec, loc)}
            ]
        });
        equal(2, _length(connection1.overlays));
        equal("Label", connection1.overlays["l"].type);

        equal("Arrow", connection1.overlays["a"].type);
        equal(0.7, connection1.overlays["a"].location);
        equal(40, connection1.overlays["a"].width);
        equal(40, connection1.overlays["a"].length);

        _jsPlumb.deleteConnection(connection1);
        equal(0, _jsPlumb.getSelector(".PPPP").length, "overlay has been fully cleaned up");
    });

    test(": _jsPlumb.connect, specify arrow overlay using string identifier only", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: ["Arrow"]});
        equal("Arrow", _head(conn.overlays).type);
    });



    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return plain DOM element)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            {
                type:"Custom",
                options:{
                    id: "custom",
                    create: function (connection) {
                        ok(connection != null, "we were passed in a connection");
                        var d = document.createElement("div");
                        d.setAttribute("custom", "true");
                        d.innerHTML = connection.id;
                        return d;
                    }
                }
            }
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.canvas.getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.canvas.innerHTML, c.id, "custom overlay has correct value");
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return selector)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            {
                type:"Custom",
                options:{
                    id: "custom",
                    create: function (connection) {
                        ok(connection != null, "we were passed in a connection");
                        return support.makeContent("<div custom='true'>" + connection.id + "</div>");
                    }
                }
            }
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.canvas.getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.canvas.innerHTML, c.id, "custom overlay has correct value");
    });
};


QUnit.config.reorder = false;

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

var reinit = function(defaults) {

    removeContainer()
    makeContainer()

    var d = jsPlumb.extend({container:container}, defaults || {});
    support.cleanup()

    _jsPlumb = jsPlumb.newInstance((d));
    support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
    defaults = jsPlumb.extend({}, _jsPlumb.defaults);
}

/**
 * Tests for dragging
 * @param _jsPlumb
 */

var testSuite = function () {

    var _addDiv = function(id, x, y, w, h) {
        if (!x) {
            _jsPlumb.testx = _jsPlumb.testx || 0;
            _jsPlumb.testx += 100;
            x = _jsPlumb.testx;
        }

        if (!y) {
            _jsPlumb.testy = _jsPlumb.testy || 0;
            _jsPlumb.testy += 100;
            y = _jsPlumb.testy;
        }

        return support.addDiv(id, _jsPlumb.getContainer(), "", x, y, w, h);
    };

    module("Connection Dragging", {
        // uncomment 'tests' and the code in this method and the tests will stop (if you have dev tools open) when a test fails.
        // it can be handy to see what's going on with the DOM elements when a test fails.
        teardown: function (/*tests*/) {

            // if (tests.assertions.findIndex((t) => t.result !== true) !== -1) {
            //     debugger;
            // }

            delete _jsPlumb.testx;
            delete _jsPlumb.testy;

            support.cleanup();

            removeContainer()
        },
        setup: function () {

            makeContainer()

            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);

            var epElCount = document.querySelectorAll(".jtk-endpoint").length,
                connElCount = document.querySelectorAll(".jtk-connector").length;

            if (epElCount > 0) {
                throw "there are " + epElCount + " endpoints already in the dom!";
            }
            //
            if (connElCount > 0) {
                throw "there are " + connElCount + " connections already in the dom!";
            }
        }
    });

// ----------------------------------------------------------------------------------------------------------------
// ---------------- ENDPOINTS AS SOURCES / TARGETS -----------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------


    /**
     * Tests endpoint mouse interaction via event triggering: the ability to drag a connection to another
     * endpoint, what happens when it is full, if it is disabled etc.
     * @method jsPlumb.Test.EndpointEventTriggering
     */
    test("connections via mouse between Endpoints configured with addEndpoint", function() {
        var d1 = support.addDiv("d1", null, null, 50, 50, 50, 50), d2 = support.addDiv("d2", null, null, 250, 250, 50, 50),
            e1 = _jsPlumb.addEndpoint(d1, {source:true, target:true, anchor:"Top"}),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true, anchor:"Top"});

        support.assertManagedEndpointCount(d1, 1)
        support.assertManagedEndpointCount(d2, 1)
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");
        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        _jsPlumb.select().deleteAll();
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
        equal(e2.connections.length, 0, "zero connections on endpoint 2 after connection removed");
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        // now disable e1 and try to drag a new connection: it should fail
        e1.enabled = false;
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 0, "zero connections after drag from disabled endpoint");
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        e1.enabled = true;
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag from enabled endpoint");
        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

         ok(e1.isFull(), "endpoint 1 is full");

        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
    });

    test("endpoint:connectionsDetachable mouse interaction", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                source:true, target:true,
                connectionsDetachable:false
            }),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true});

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 1, "one connection still after attempted detach because `connectionsDetachable` is false");
    });

    test("connection:detachable false, mouse interaction", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d2);

        equal(_jsPlumb.select().length, 0, "zero connections before connect");
        _jsPlumb.connect({source:e1, target:e2, detachable:false});
        equal(_jsPlumb.select().length, 1, "one connection after connect");
        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 1, "one connection still after attempted detach");
    });

    test("connection:detachable true by default, mouse interaction", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d2);

        equal(_jsPlumb.select().length, 0, "zero connections before connect");
        _jsPlumb.connect({source:e1, target:e2});
        equal(_jsPlumb.select().length, 1, "one connection after connect");
        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
    });

    test("connection:detach event is fired when no beforeDrop is active", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {
            target:true
        });
        var e2 = _jsPlumb.addEndpoint(d2, {source:true});
        var evt = false, originalEvent, evtCount = 0;
        _jsPlumb.bind('connection:detach', function (info, oevt) {
            evt = true;
            originalEvent = oevt;
            evtCount++;
        });

        support.dragConnection(e2, e1);
        equal(e1.connections.length, 1, "one connection");

        support.detachConnection(e1, 0);

        equal(e1.connections.length, 0, "no connections");
        ok(evt === true, "event was fired");
        equal(evtCount, 1, "event was fired once only");
        ok(originalEvent != null, "original event was provided in event callback");
    });

    test("beforeDrop returning false prevents connection:detach event", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {
            beforeDrop:function() {
                return false;
            },
            target:true
        });
        var e2 = _jsPlumb.addEndpoint(d2, {source:true});
        var evt = false, abortEvent = false;
        _jsPlumb.bind('connection:detach', function (info) {
            evt = true;
        });
        _jsPlumb.bind('connection:abort', function (info) {
            abortEvent = true;
        });

        support.dragConnection(e2, e1);
        ok(evt === false, "event was not fired");
        equal(e1.connections.length, 0, "no connections");
        ok(abortEvent === true, "connection:abort event was fired");

        equal(document.querySelectorAll(".jtk-connector").length, 0, "there are no connectors - it was cleaned up after beforeDrop returned false");
    });

    test("connection:abort event", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");

        var e2 = _jsPlumb.addEndpoint(d2, {source:true});
        var evt = false, abortEvent = false;
        _jsPlumb.bind('connection:detach', function (info) {
            evt = true;
        });
        _jsPlumb.bind('connection:abort', function (info) {
            abortEvent = true;
        });

        support.dragAndAbortConnection(e2);
        ok(evt === false, "connection:detach event was not fired");
        equal(e2.connections.length, 0, "no connections");
        ok(abortEvent === true, "connection:abort event was fired");
    });

    test("endpoint: suspendedElement set correctly", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, { source:true, target:true }),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true}),
            e3 = _jsPlumb.addEndpoint(d3, {source:true, target:true});

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        var c = support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");


        support.relocateTarget(c, e3, {
            beforeMouseUp:function() {
                equal(c.suspendedElement, d2, "suspended element is set");
                equal(c.suspendedEndpoint, e2, "suspended endpoint is set");
            },
            after :function() {
                equal(c.suspendedElement, null, "suspended element is cleared");
                equal(c.suspendedEndpoint, null, "suspended endpoint is cleared");
            }
        });
    });



    /*

     // future state.

     test("beforeDrop fired before onMaxConnections", function() {
     var d1 = _addDiv("d1"), d2 = _addDiv("d2");
     var bd = false;
     var e1 = _jsPlumb.addEndpoint(d1, {
     beforeDrop:function() {
     bd = true;
     return true;
     },
     target:true,
     onMaxConnections:function() {
     ok(bd === true, "beforeDrop was called before onMaxConnections");
     }
     });
     var e2 = _jsPlumb.addEndpoint(d2, {source:true, maxConnections:-1});
     support.dragConnection(e2, e1);
     equal(e1.connections.length, 1, "one connection");
     equal(bd, true, "beforeDrop was called");
     bd = false;
     support.dragConnection(e2, e1);
     equal(e1.connections.length, 1, "one connection");
     });
     */

    test("drag connection between two endpoints", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { target:true, maxConnections:-1 });
        var e2 = _jsPlumb.addEndpoint(d2, {source:true, maxConnections:-1 });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one conn now");

        var c2 = support.dragConnection(e2, e1);
        equal(e1.connections.length, 2, "two conns now");
    });

    test("drag connection between two endpoints, scope doesnt match", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { target:true, maxConnections:-1, scope:"foo" });
        var e2 = _jsPlumb.addEndpoint(d2, {source:true, maxConnections:-1, scope:"bar" });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 0, "no connections; scope didnt match");
    });

    test("drag connection between two endpoints, scope does match", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { target:true, maxConnections:-1, scope:"foo" });
        var e2 = _jsPlumb.addEndpoint(d2, {source:true, maxConnections:-1, scope:"foo" });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one connection; scope matched");
    });

    test("drag connection between two endpoints, scope does match, and then it doesnt. NOTE the css classes on the endpoint's element wont change.", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { target:true, maxConnections:-1, scope:"foo" });
        var e2 = _jsPlumb.addEndpoint(d2, {source:true, maxConnections:-1, scope:"foo" });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one connection; scope matched");

        e1.scope = "changed"
        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one connection; scope didnt match the second time");
    });

    test("drag connection between two endpoints but endpoints are full", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            d3 = _addDiv("d3");

        var e1 = _jsPlumb.addEndpoint(d1, { target:true });
        var e2 = _jsPlumb.addEndpoint(d2, { source:true });
        var e3 = _jsPlumb.addEndpoint(d3, { source:true });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one conn now");

        var c2 = support.dragConnection(e3, e1);
        equal(e1.connections.length, 1, "one conn now - endpoint 1 is full and did not accept the new connection");
    });

    /*
    // future state (issue 1036)
     test("endpoint:connectionSourceDetachable false, mouse interaction", function() {
     var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
     e1 = _jsPlumb.addEndpoint(d1, {connectionSourceDetachable:false, maxConnections:-1}),
     e2 = _jsPlumb.addEndpoint(d2, {maxConnections:-1});

     equal(_jsPlumb.select().length, 0, "zero connections before connect");
     _jsPlumb.connect({source:e1, target:e2});
     equal(_jsPlumb.select().length, 1, "one connection after connect");

     support.detachConnection(e1, 0);
     equal(_jsPlumb.select().length, 1, "one connection still after attempted detach of connection source");

     _jsPlumb.connect({source:e2, target:e1});
     equal(_jsPlumb.select().length, 2, "two connections after connect");
     support.detachConnection(e1, 1);
     equal(_jsPlumb.select().length, 1, "one connection after successful target detach");
     });
     //*/

    test("beforeDetach listener on instance via mouse interaction", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), r = 0, s = 0, bd = 0,
            e1 = _jsPlumb.addEndpoint(d1, {
                source:true, target:true

            }),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true});


        _jsPlumb.bind("beforeDetach", function() {
            r = true;
            return true;
        });

        _jsPlumb.bind("beforeDrag", function() {
            bd++;
            return true;
        });

        _jsPlumb.bind("beforeStartDetach", function() {
            s = true;
            return true;
        });

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");


        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "connection detached");

        equal(bd, 1, "beforeDrag called once");
        equal(r, 1, "beforeDetach interceptor called once");
        equal(s, 1, "beforeStartDetach interceptor called once");

    });

    test("beforeDetach listener on Endpoint via mouse interaction", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            beforeDetachCount = 0,
            endpointSpec = {
                source:true, target:true,
                beforeDetach:function() {
                    beforeDetachCount++;
                }

            },
            e1 = _jsPlumb.addEndpoint(d1, endpointSpec),
            e2 = _jsPlumb.addEndpoint(d2, endpointSpec);

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");


        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "connection detached");

        equal(beforeDetachCount, 2, "beforeDetach interceptor called twice, because each endpoint has a beforeDetach and it doesnt return a concrete value");

    });

    test("connection dragging, redrop on original target endpoint", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, { source:true });
        var e2 = _jsPlumb.addEndpoint(d2, { target:true, maxConnections:-1 });

        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, e2);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

    });

    test("endpoint passes scope to connection, connection via mouse", function() {
        var sourceEndpoint = {
                source: true,
                scope: "blue"
            }, targetEndpoint = {
                target:true,
                scope:"blue"
            },
            d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, sourceEndpoint),
            e2 = _jsPlumb.addEndpoint(d2, targetEndpoint);

        var c = support.dragConnection(e1, e2);

        equal(c.scope, "blue", "connection scope is blue.");
    });

    test("endpoint:click but not drag results in drag proxy being cleaned up", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                source:true, target:true,
                connectionsDetachable:false
            }),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true}),
            ec1 = support.getEndpointCanvas(e1);

        equal(2, document.querySelectorAll("[data-jtk-managed]").length, 2, "two managed elements after init");

        _jsPlumb.trigger(ec1, "mousedown", support.makeEvent(ec1));
        _jsPlumb.trigger(ec1, "mouseup", support.makeEvent(ec1));

        equal(2, document.querySelectorAll("[data-jtk-managed]").length, 2, "two managed elements after aborted drag: drag element was cleaned up.");
    });

    test("endpoint:drag, attached classes removed afterwards.", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                source:true, target:true,
                connectionsDetachable:false
            }),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true}),
            ec1 = support.getEndpointCanvas(e1);

        var conn = support.dragConnection(e1, e2),
            cc = support.getConnectionCanvas(conn);

        ok(!ec1.classList.contains("endpointDrag"), "endpointDrag class removed from endpoint after drag");
        ok(!ec1.classList.contains("jtk-dragging"), "jtk-dragging class removed from endpoint after drag");
        // Use jsplumb.hasClass here; IE11 doesnt have `classList` on SVG element
        ok(!_jsPlumb.hasClass(cc, "jtk-dragging"), "jtk-dragging class removed from connection after drag");

    });

    test("endpoint:drag to detach, classes removed afterwards.", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                source:true, target:true
            }),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true}),
            ec1 = support.getEndpointCanvas(e1),
            ec2 = support.getEndpointCanvas(e2);

        var conn = support.dragConnection(e1, e2),
            cc = support.getConnectionCanvas(conn);

        ok(!ec1.classList.contains("endpointDrag"), "endpointDrag class removed from endpoint after drag");
        ok(!ec1.classList.contains("jtk-dragging"), "jtk-dragging class removed from endpoint after drag");
        // Use jsplumb.hasClass here; IE11 doesnt have `classList` on SVG element
        ok(!_jsPlumb.hasClass(cc, "jtk-dragging"), "jtk-dragging class removed from connection after drag");

        support.dragAndAbortConnection(e2);

        ok(!ec1.classList.contains("endpointDrag"), "endpointDrag class removed from endpoint after drag");
        ok(!ec1.classList.contains("jtk-dragging"), "jtk-dragging class removed from endpoint after drag");
        ok(!ec2.classList.contains("endpointDrag"), "endpointDrag class removed from endpoint after drag");
        ok(!ec2.classList.contains("jtk-dragging"), "jtk-dragging class removed from endpoint after drag");

    });

// ----------------------------------------------------------------------------------------------------------------
// ---------------- CSS CLASSES -----------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

    test("css classes", function() {

        var CLASS_CONNECTED = _jsPlumb.endpointConnectedClass
        var CLASS_ENDPOINT = _jsPlumb.endpointClass
        var CLASS_FULL = _jsPlumb.endpointFullClass
        var CLASS_DRAGGING = _jsPlumb.draggingClass
        var CLASS_FLOATING = _jsPlumb.endpointFloatingClass

        var d1 = support.addDiv("d1", null, null, 50, 50, 50, 50),
            d2 = support.addDiv("d2", null, null, 250, 250, 50, 50),
            e1 = _jsPlumb.addEndpoint(d1, {source: true, target: true, anchor: "Top", cssClass:"customSource"}),
            e2 = _jsPlumb.addEndpoint(d2, {source: true, target: true, anchor: "Top", cssClass:"customTarget"}),
            c1 = support.getEndpointCanvas(e1),
            c2 = support.getEndpointCanvas(e2)

        support.assertManagedEndpointCount(d1, 1)
        support.assertManagedEndpointCount(d2, 1)
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        // we have 2 endpoints, both configured as source/target. First we'll check the initial class list.

        equal(c1.classList.contains(CLASS_ENDPOINT), true, "jtk-endpoint class set on new endpoint")
        equal(c2.classList.contains(CLASS_ENDPOINT), true, "jtk-endpoint class set on new endpoint")

        equal(c1.classList.contains("customSource"), true, "custom class set on source endpoint")
        equal(c2.classList.contains("customTarget"), true, "custom class set on target endpoint")

        equal(c1.classList.contains(CLASS_CONNECTED), false, "d1 endpoint has not jtk-endpoint-connected class")
        equal(c1.classList.contains(CLASS_FULL), false, "d1 endpoint has not jtk-endpoint-full class")
        equal(c1.classList.contains(CLASS_DRAGGING), false, "d1 endpoint has not jtk-dragging class")

        equal(c2.classList.contains(CLASS_CONNECTED), false, "d2 endpoint has not jtk-endpoint-connected class")
        equal(c2.classList.contains(CLASS_FULL), false, "d2 endpoint has not jtk-endpoint-full class")
        equal(c2.classList.contains(CLASS_DRAGGING), false, "d2 endpoint has not jtk-dragging class")

        // now drag a new connection. the source endpoint should show as connected, full and dragging. the target, during the drag, should
        // have no new classes. after the drop, the target should show as connected and full, and the source should not show dragging.
        support.dragConnection(e1, e2, false, {
            beforeMouseUp:function() {

                equal(c1.classList.contains(CLASS_CONNECTED), true, "d1 endpoint has jtk-endpoint-connected class when dragging new connection")
                equal(c1.classList.contains(CLASS_FULL), true, "d1 endpoint has jtk-endpoint-full class when dragging new connection")
                equal(c1.classList.contains(CLASS_DRAGGING), true, "d1 endpoint has jtk-dragging class (should be present as this is a new connection from a source) when dragging new connection")

                equal(c2.classList.contains(CLASS_CONNECTED), false, "d2 endpoint has not jtk-endpoint-connected class when dragging new connection")
                equal(c2.classList.contains(CLASS_FULL), false, "d2 endpoint has not jtk-endpoint-full class when dragging new connection")
                equal(c2.classList.contains(CLASS_DRAGGING), false, "d2 endpoint has not jtk-dragging class when dragging new connection")

                const d1Endpoints = _jsPlumb.endpointsByElement["d1"]
                const floatingElementId = d1Endpoints[0].connections[0].targetId

                support.assertManagedEndpointCount(d1Endpoints[0].connections[0].target, 1)

                const floatingEndpoints = _jsPlumb.endpointsByElement[floatingElementId]

                // debugger
                const fc = support.getEndpointCanvas(floatingEndpoints[0])
                equal(fc.classList.contains("customSource"), true, "custom class set on floating endpoint copied from source when dragging new connection")
                equal(fc.classList.contains(CLASS_FLOATING), true, "floating endpoint has jtk-floating-endpoint class when dragging new connection")
                equal(fc.classList.contains(CLASS_CONNECTED), false, "floating endpoint has not jtk-endpoint-connected class when dragging new connection")
                equal(fc.classList.contains(CLASS_FULL), false, "floating endpoint has not jtk-endpoint-full class when dragging new connection")
                equal(fc.classList.contains(CLASS_DRAGGING), false, "floating endpoint has not jtk-dragging class when dragging new connection")

            }
        });

        equal(c1.classList.contains(CLASS_CONNECTED), true, "d1 endpoint has jtk-endpoint-connected class when new connection established")
        equal(c1.classList.contains(CLASS_FULL), true, "d1 endpoint has jtk-endpoint-full class when new connection established")
        equal(c1.classList.contains(CLASS_DRAGGING), false, "d1 endpoint has not jtk-dragging class removed after drag when new connection established")
        equal(c2.classList.contains(CLASS_CONNECTED), true, "d2 endpoint has jtk-endpoint-connected class when new connection established")
        equal(c2.classList.contains(CLASS_FULL), true, "d2 endpoint has jtk-endpoint-full class when new connection established")

        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        // we now have 2 endpoints that are connected.  detaching via the source should mean:
        // - during the drag, the source should now show full, connected or dragging, whereas the target should show full and connected.
        //

        support.detachAndReattachConnection(e1, {
            beforeMouseUp:function() {

                // debugger
                const d2Endpoints = _jsPlumb.endpointsByElement["d2"]
                const floatingElementId = d2Endpoints[0].connections[0].sourceId
                const floatingEndpoints = _jsPlumb.endpointsByElement[floatingElementId]
                const fc = support.getEndpointCanvas(floatingEndpoints[0])
                equal(fc.classList.contains("customSource"), true, "custom class set on floating endpoint copied from source when detaching and reattaching source")

                equal(fc.classList.contains(CLASS_FLOATING), true, "floating endpoint has jtk-floating-endpoint class when detaching and reattaching source")
                equal(fc.classList.contains(CLASS_CONNECTED), false, "floating endpoint has not jtk-endpoint-connected class when detaching and reattaching source")
                equal(fc.classList.contains(CLASS_FULL), false, "floating endpoint has not jtk-endpoint-full class when detaching and reattaching source")
                equal(fc.classList.contains(CLASS_DRAGGING), false, "floating endpoint has not jtk-dragging class when detaching and reattaching source")

                equal(c1.classList.contains(CLASS_CONNECTED), false, "d1 endpoint has not jtk-endpoint-connected class as it is currently disconnected when detaching and reattaching source")
                equal(c1.classList.contains(CLASS_FULL), false, "d1 endpoint has not jtk-endpoint-full class as it is currently disconnected when detaching and reattaching source")
                equal(c1.classList.contains(CLASS_DRAGGING), false, "d1 endpoint has not jtk-dragging class as a new connection is not being dragged when detaching and reattaching source")
            }
        })

        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        equal(c1.classList.contains(CLASS_CONNECTED), true, "d1 endpoint has jtk-endpoint-connected class as the connection was reattached")
        equal(c1.classList.contains(CLASS_FULL), true, "d1 endpoint has jtk-endpoint-full class as the connection was reattached")
        equal(c1.classList.contains(CLASS_DRAGGING), false, "d1 endpoint does not have jtk-dragging class")

        // we now have 2 endpoints that are connected.  detaching via the target should mean:
        // - during the drag, the target should not show full, connected or dragging, whereas the target should show full and connected.
        //

        support.detachAndReattachConnection(e2, {
            beforeMouseUp:function() {

                // debugger
                const d1Endpoints = _jsPlumb.endpointsByElement["d1"]
                const floatingElementId = d1Endpoints[0].connections[0].targetId
                const floatingEndpoints = _jsPlumb.endpointsByElement[floatingElementId]
                const fc = support.getEndpointCanvas(floatingEndpoints[0])
                equal(fc.classList.contains("customTarget"), true, "custom class set on floating endpoint copied from target when detaching and reattaching target")

                equal(fc.classList.contains(CLASS_FLOATING), true, "floating endpoint has jtk-floating-endpoint class when detaching and reattaching target")
                equal(fc.classList.contains(CLASS_CONNECTED), false, "floating endpoint has not jtk-endpoint-connected class when detaching and reattaching target")
                equal(fc.classList.contains(CLASS_FULL), false, "floating endpoint has not jtk-endpoint-full class when detaching and reattaching target")
                equal(fc.classList.contains(CLASS_DRAGGING), false, "floating endpoint has not jtk-dragging class when detaching and reattaching target")

                equal(c2.classList.contains(CLASS_CONNECTED), false, "d2 endpoint has not jtk-endpoint-connected class as it is currently disconnected when detaching and reattaching target")
                equal(c2.classList.contains(CLASS_FULL), false, "d2 endpoint has not jtk-endpoint-full class as it is currently disconnected when detaching and reattaching target")
                equal(c2.classList.contains(CLASS_DRAGGING), false, "d2 endpoint has not jtk-dragging class as a new connection is not being dragged when detaching and reattaching target")
            }
        })

        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        equal(c2.classList.contains(CLASS_CONNECTED), true, "d2 endpoint has jtk-endpoint-connected class as the connection was reattached")
        equal(c2.classList.contains(CLASS_FULL), true, "d2 endpoint has jtk-endpoint-full class as the connection was reattached")
        equal(c2.classList.contains(CLASS_DRAGGING), false, "d2 endpoint does not have jtk-dragging class")
    });

    test("connections via mouse between Endpoints, zoom not equal to 1", function() {
        var d1 = support.addDiv("d1", null, null, 50, 50, 50, 50), d2 = support.addDiv("d2", null, null, 250, 250, 50, 50),
            e1 = _jsPlumb.addEndpoint(d1, {source:true, target:true, anchor:"Top"}),
            e2 = _jsPlumb.addEndpoint(d2, {source:true, target:true, anchor:"Top"});

        _jsPlumb.getContainer().style.transform = "scale(0.75)";
        _jsPlumb.setZoom(0.75)

        support.assertManagedEndpointCount(d1, 1)
        support.assertManagedEndpointCount(d2, 1)
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");
        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        _jsPlumb.select().deleteAll();
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
        equal(e2.connections.length, 0, "zero connections on endpoint 2 after connection removed");
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        // now disable e1 and try to drag a new connection: it should fail
        e1.enabled = false;
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 0, "zero connections after drag from disabled endpoint");
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        e1.enabled = true;
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag from enabled endpoint");
        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        ok(e1.isFull(), "endpoint 1 is full");

        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
    });


};

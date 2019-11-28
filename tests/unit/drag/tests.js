QUnit.config.reorder = false;

var defaults = null, _divs = [], support,
    _cleanup = function (_jsPlumb) {
        _jsPlumb.reset();
        _jsPlumb.unbindContainer();
        if (_jsPlumb.select().length != 0)
            throw "there are connections!";

        _jsPlumb.Defaults = defaults;

        support.cleanup();

        document.getElementById("container").innerHTML = "";
    };

var testSuite = function (_jsPlumb) {

    support = jsPlumbTestSupport.getInstance(_jsPlumb);

    var _detachThisConnection = function(c) {
        var idx = c.endpoints[1].connections.indexOf(c);
        support.detachConnection(c.endpoints[1], idx);
    };

    module("Drag", {
        teardown: function () {
            _cleanup(_jsPlumb);
        },
        setup: function () {
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
            _jsPlumb.setContainer("container");
        }
    });

    // setup the container
    var container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    test("sanity", function() {
        equal(1,1);
    });


    /**
     * Tests endpoint mouse interaction via event triggering: the ability to drag a connection to another
     * endpoint, what happens when it is full, if it is disabled etc.
     * @method jsPlumb.Test.EndpointEventTriggering
     */
    test("connections via mouse between Endpoints configured with addEndpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true}),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true});

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        _jsPlumb.select().delete();
        equal(_jsPlumb.select().length, 0, "zero connections after detach");

        // now disable e1 and try to drag a new connection: it should fail
        e1.setEnabled(false);
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 0, "zero connections after drag from disabled endpoint");

        e1.setEnabled(true);
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag from enabled endpoint");

        /*

         why does this fail? i get 0 instead of 1. it's detaching existing connections?

         ok(e1.isFull(), "endpoint 1 is full");
         support.dragConnection(e1, e2);
         equal(_jsPlumb.select().length, 1, "one connection after drag from endpoint that is full");
         */

        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
    });

    test("connections via mouse between elements configured with makeSource/makeTarget", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource("d1");
        _jsPlumb.makeSource("d4");
        _jsPlumb.makeTarget("d2");
        _jsPlumb.makeTarget("d3");

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        var cd1d2 = _jsPlumb.select().get(0);
        equal(cd1d2.source.id, "d1", "source of first connection is correct");
        equal(cd1d2.target.id, "d2", "target of first connection is correct");

        support.dragConnection(d1, d3);
        equal(_jsPlumb.select().length, 2, "two connections after drag from source to target");
        var cd1d3 = _jsPlumb.select().get(1);
        equal(cd1d3.source.id, "d1", "source of second connection is correct");
        equal(cd1d3.target.id, "d3", "target of second connection is correct");

        // now we will drag the connection from d1-d2 by its target endpoint and put it on d3.
        support.relocateTarget(cd1d2, d3);
        equal(cd1d2.target.id, "d3", "target of first connection has changed to d3");
        equal(_jsPlumb.select().length, 2, "two connections after relocate");

        support.dragConnection(d3, d1);
        equal(_jsPlumb.select().length, 2, "two connections after failed drag from target to source");

        // now drag the source of d1-d2 to be d4.
        support.relocateSource(cd1d2, d4);
        equal(cd1d2.source.id, "d4", "source of first connection has changed to d4");
        equal(_jsPlumb.select().length, 2, "two connections after relocate");

    });


    // https://github.com/jsplumb/jsPlumb/issues/415
    test("issue 415: spurious endpoints after dragging", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([ "d1", "d2", "d3", "d4" ], {
            maxConnections:-1
        });
        _jsPlumb.makeTarget([ "d1", "d2", "d3", "d4" ], {
            maxConnections:-1
        });

        ok(_jsPlumb.isSource(d4), "d4 is a connection source");
        ok(_jsPlumb.isTarget(d4), "d4 is a connection target");

        var d1d2 = support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        var d2d3 = support.dragConnection(d2, d3);
        equal(_jsPlumb.select().length, 2, "two connections after drag");

        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints before relocations");

        support.relocateTarget(d1d2, d4);
        equal(d1d2.target.id, "d4", "target of first connection has changed to d4");

        equal(_jsPlumb.select().length, 2, "two connections after relocations");
        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints after relocations");

        support.relocateSource(d2d3, d4);

        equal(d2d3.source.id, "d4", "source of second connection has changed to d4");
        equal(_jsPlumb.select().length, 2, "two connections after relocations");
        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints after relocations");

    });

    test("drag connection so it turns into a self-loop. ensure endpoints registered correctly. target not continuous anchor so not hidden (issue 419)", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([ "d1", "d2", "d3", "d4" ], { maxConnections: -1 });
        _jsPlumb.makeTarget([ "d1", "d2", "d3", "d4" ], { maxConnections: -1 });

        ok(_jsPlumb.isSource(d1), "d1 is a connection source");
        ok(_jsPlumb.isTarget(d2), "d2 is a connection target");

        // as a test: connect d3 to itself. 2 endpoints?
        var d3d3 = support.dragConnection(d3, d3);
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints");

        var d2d1 = support.dragConnection(d2, d1);
        equal(_jsPlumb.select().length, 2, "one connection after drag");

        support.relocateSource(d2d1, d1);
        equal(d2d1.endpoints[0].elementId, "d1", "source endpoint is on d1 now");
        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints after relocations");

        support.relocateSource(d2d1, d2);
        equal(d2d1.endpoints[0].elementId, "d2", "source endpoint is on d2 now");
        ok(d2d1.endpoints[1].canvas.parentNode != null, "target canvas put back into DOM");
    });

    test("drag connection so it turns into a self-loop. ensure endpoints registered correctly. target is continuous anchor so is hidden. (issue 419)", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([ "d1", "d2", "d3", "d4" ], { maxConnections: -1, anchor:"Continuous" });
        _jsPlumb.makeTarget([ "d1", "d2", "d3", "d4" ], { maxConnections: -1, anchor:"Continuous" });

        var d2d1 = support.dragConnection(d2, d1);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        support.relocateSource(d2d1, d1);
        equal(d2d1.endpoints[0].elementId, "d1", "source endpoint is on d1 now");
        // NOTE in this test we are not using Continuous anchors so we do not expect the target to have been
        // removed. the next test uses Continuous anchors and it checks the target has been removed.
        //ok(d2d1.endpoints[1].canvas.parentNode == null, "target canvas removed from DOM");

        support.relocateSource(d2d1, d2);
        equal(d2d1.endpoints[0].elementId, "d2", "source endpoint is on d2 now");
        ok(d2d1.endpoints[1].canvas.parentNode != null, "target canvas put back into DOM");
    });


    test("endpoint:connectionsDetachable mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                isSource:true, isTarget:true,
                connectionsDetachable:false
            }),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true});

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 1, "one connection still after attempted detach");
    });

    test("connection:detachable false, mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d2);

        equal(_jsPlumb.select().length, 0, "zero connections before connect");
        _jsPlumb.connect({source:e1, target:e2, detachable:false});
        equal(_jsPlumb.select().length, 1, "one connection after connect");
        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 1, "one connection still after attempted detach");
    });

    test("connection:detachable true by default, mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d2);

        equal(_jsPlumb.select().length, 0, "zero connections before connect");
        _jsPlumb.connect({source:e1, target:e2});
        equal(_jsPlumb.select().length, 1, "one connection after connect");
        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
    });

    test("connectionDetached event is fired when no beforeDrop is active", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {
            isTarget:true
        });
        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true});
        var evt = false, originalEvent;
        _jsPlumb.bind('connectionDetached', function (info, oevt) {
            evt = true;
            originalEvent = oevt;
        });
        support.dragConnection(e2, e1);
        equal(e1.connections.length, 1, "one connection");

        support.detachConnection(e1, 0);

        equal(e1.connections.length, 0, "no connections");
        ok(evt == true, "event was fired");
        ok(originalEvent != null, "original event was provided in event callback");
    });

    test("beforeDrop returning false prevents connectionDetached event", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {
            beforeDrop:function() {
                return false;
            },
            isTarget:true
        });
        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true});
        var evt = false, abortEvent = false;
        _jsPlumb.bind('connectionDetached', function (info) {
            evt = true;
        });
        _jsPlumb.bind('connectionAborted', function (info) {
            abortEvent = true;
        });
        support.dragConnection(e2, e1);
        ok(evt == false, "event was not fired");
        equal(e1.connections.length, 0, "no connections");
        ok(abortEvent == true, "connectionAborted event was fired");
    });

    test("connectionAborted event", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true});
        var evt = false, abortEvent = false;
        _jsPlumb.bind('connectionDetached', function (info) {
            evt = true;
        });
        _jsPlumb.bind('connectionAborted', function (info) {
            abortEvent = true;
        });
        support.dragAndAbortConnection(e2);
        ok(evt == false, "connectionDetached event was not fired");
        equal(e2.connections.length, 0, "no connections");
        ok(abortEvent == true, "connectionAborted event was fired");
    });

    test("endpoint: suspendedElement set correctly", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, { isSource:true, isTarget:true }),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true}),
            e3 = _jsPlumb.addEndpoint(d3, {isSource:true, isTarget:true});

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
     var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
     var bd = false;
     var e1 = _jsPlumb.addEndpoint(d1, {
     beforeDrop:function() {
     bd = true;
     return true;
     },
     isTarget:true,
     onMaxConnections:function() {
     ok(bd === true, "beforeDrop was called before onMaxConnections");
     }
     });
     var e2 = _jsPlumb.addEndpoint(d2, {isSource:true, maxConnections:-1});
     support.dragConnection(e2, e1);
     equal(e1.connections.length, 1, "one connection");
     equal(bd, true, "beforeDrop was called");
     bd = false;
     support.dragConnection(e2, e1);
     equal(e1.connections.length, 1, "one connection");
     });
     */

    test("drag connection between two endpoints", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isTarget:true, maxConnections:-1 });
        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true, maxConnections:-1 });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one conn now");

        var c2 = support.dragConnection(e2, e1);
        equal(e1.connections.length, 2, "two conns now");
    });

    test("drag connection between two endpoints but endpoints are full", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, { isTarget:true });
        var e2 = _jsPlumb.addEndpoint(d2, { isSource:true });
        var e3 = _jsPlumb.addEndpoint(d3, { isSource:true });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one conn now");

        var c2 = support.dragConnection(e3, e1);
        equal(e1.connections.length, 1, "one conn now");
    });

    /*
     test("endpoint:connectionSourceDetachable false, mouse interaction", function() {
     var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
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
     });*/

    test("endpoint:beforeDetach listener via mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), r = 0, s = 0, bd = 0,
            e1 = _jsPlumb.addEndpoint(d1, {
                isSource:true, isTarget:true

            }),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true});

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

    test("connection dragging, simple drag and detach case", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 0, "0 connections in jsplumb instance.");

    });

    /**
     * Tests the `extract` parameter on a `makeSource` call: extract provides a map of attribute names that you want to
     * read fom the source element when a drag starts, and whose values end up in the connection's data, keyed by the
     * value from the extract map. In this test we get the attribute `foo` and insert its value into the connection's
     * data, keyed as `fooAttribute`.
     */
    test("connection dragging, extractor atts defined on source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        d1.setAttribute("foo", "the value of foo");
        _jsPlumb.makeSource([d1, d2, d3], {
            extract:{
                "foo":"fooAttribute"
            }
        });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var con = support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        equal(con.getData().fooAttribute, "the value of foo", "attribute values extracted properly");
    });

    test("connection dragging, simple drag and detach case, beforeDetach interceptor says no.", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "still 1 connection registered for d1 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "still 1 connection registered for d2 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");

    });

    test("connection dragging, simple drag and detach case, reattach=true on connection prevents detach.", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        c.setReattach(true);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "still 1 connection registered for d1 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "still 1 connection registered for d2 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");

    });

    test("connection dragging, simple move target case", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

        //alert("ensure continuous anchor endpoint cleaned up in this case (simple target move)");
    });

    // DRAG SOURCE TO ANOTHER SOURCE
    test("connection dragging, simple move source case", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints; there is one connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

    });

    test("connection dragging, simple move source case, continuous anchors", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.importDefaults({Anchor:"Continuous"});
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints; there is one connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

    });

    test("connection dragging, simple move target case, beforeDetach aborts the move", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    test("connection dragging, simple move source case, beforeDetach aborts the move", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after aborted mouse move");
    });

    test("connection dragging, simple move case, connection reattach=true aborts the move", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        c.setReattach(true);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    test("connection dragging, redrop on original target", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d2);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE AND REDROP ON ORIGINAL
    test("connection dragging, redrop on original source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d1);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });


    // DRAG SOURCE TO AN ELEMENT NO CONFIGURED AS SOURCE (SHOULD DETACH)
    test("connection dragging, move source to element not configured as drag source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3, d4], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "zero endpoints; there are no connections");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE TO AN ELEMENT NO CONFIGURED AS SOURCE BUT DETACH DISABLED (SHOULDNT CARE)
    test("connection dragging, move source to element not configured as drag source, beforeDetach cancels connection", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3, d4], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "2 endpoints; there is 1 connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0, "0 connection registered for d4 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE TO ANOTHER SOURCE BUT BEFORE DROP SAYS NO
    test("connection dragging, move source to element not configured as drag source, beforeDrop cancels connection", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.bind("beforedrop", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3, d4], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "0 endpoints; there are no connections");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0, "0 connections registered for d4 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG TARGET TO ANOTHER SOURCE (BUT NOT A TARGET); SHOULD DETACH
    test("connection dragging, move source to element not configured as drag source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([d1, d2, d3, d4], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "zero endpoints; there are no connections");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });


    // DRAG TARGET TO ANOTHER SOURCE (BUT NOT A TARGET), BUT DETACH DISABLED. SHOULDNT CARE.
    test("connection dragging, move source to element not configured as drag source, beforeDetach cancels connection", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([ d1, d2, d3, d4 ], { });
        _jsPlumb.makeTarget([ d1, d2, d3 ], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "2 endpoints; there is 1 connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0, "0 connection registered for d4 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    /**
     * Tests that `endpoint` and `anchor` in a makeSource definition are honoured. The next test uses a connection type
     * but has the makeSource override the anchor.
     */
    test("connection dragging, makeSource sets source endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { endpoint:"Rectangle", anchor:"Left"});
        _jsPlumb.makeTarget([d1, d2, d3]);

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        equal(c.endpoints[0].type, "Rectangle", "source endpoint is Rectangle");
        equal(c.endpoints[0].anchor.x, 0, "x=0 in anchor");
        equal(c.endpoints[0].anchor.y, 0.5, "y=0.5 in anchor");
        equal(c.endpoints[1].type, _jsPlumb.Defaults.Endpoint, "target endpoint is the default");
    });

    /**
     * Tests that makeSource, when given `endpoint` and/or `anchor` values, will override any that were derived
     * from an applied type.
     */
    test("connection dragging, makeSource overrides source endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.registerConnectionType("basic", {
            endpoint:"Blank",
            anchor:"Right"
        });
        _jsPlumb.makeSource(d1, { connectionType:"basic", endpoint:"Rectangle", anchor:"Left"});
        _jsPlumb.makeSource(d2, { connectionType:"basic"});
        _jsPlumb.makeTarget([d1, d2, d3]);

        support.dragConnection(d1, d3);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        support.dragConnection(d2, d3);
        equal(_jsPlumb.select().length, 2, "2 connections in jsplumb instance.");
        var c2 = _jsPlumb.select().get(1);

        equal(c.endpoints[0].type, "Rectangle", "source endpoint was overridden to be Rectangle");
        equal(c.endpoints[0].anchor.x, 0, "x=0 in overridden anchor");
        equal(c.endpoints[0].anchor.y, 0.5, "y=0.5 in overridden anchor");

        equal(c2.endpoints[0].type, "Blank", "source endpoint is Blank in endpoint derived from type");
        equal(c2.endpoints[0].anchor.x, 1, "x=1 in anchor derived from type");
        equal(c2.endpoints[0].anchor.y, 0.5, "y=0.5 in anchor derived from type");

    });

    /**
     * Tests that makeSource, when given `endpoint` and/or `anchor` values, will override any that were derived
     * from an applied type.
     */
    test("connection dragging, makeSource overrides source endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.registerConnectionType("basic", {
            endpoint:"Blank",
            anchor:"Right"
        });
        _jsPlumb.makeSource(d1, { connectionType:"basic"});
        _jsPlumb.makeTarget(d2);
        _jsPlumb.makeTarget(d3, { endpoint:"Rectangle", anchor:"Left" });

        support.dragConnection(d1, d3);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 2, "2 connections in jsplumb instance.");
        var c2 = _jsPlumb.select().get(1);

        equal(c.endpoints[1].type, "Rectangle", "target endpoint was overridden to be Rectangle");
        equal(c.endpoints[1].anchor.x, 0, "x=0 in overridden anchor");
        equal(c.endpoints[1].anchor.y, 0.5, "y=0.5 in overridden anchor");

        equal(c2.endpoints[1].type, "Blank", "target endpoint is Blank in endpoint derived from type");
        equal(c2.endpoints[1].anchor.x, 1, "x=1 in anchor derived from type");
        equal(c2.endpoints[1].anchor.y, 0.5, "y=0.5 in anchor derived from type");

    });

    test("connection dragging, makeTarget overrides endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3]);
        _jsPlumb.makeTarget([d1, d2, d3], { endpoint:"Rectangle", anchor:"Top" });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        equal(c.endpoints[0].type, _jsPlumb.Defaults.Endpoint, "source endpoint is the default");
        equal(c.endpoints[1].anchor.x, 0.5, "x=0.5 in anchor");
        equal(c.endpoints[1].anchor.y, 0, "y=0 in anchor");
        equal(c.endpoints[1].type, "Rectangle", "target endpoint is Rectangle");

    });


    // DETACH CONNECTION VIA SOURCE, DETACH ENABLED, ALLOWED
    // DETACH CONNECTION VIA SOURCE, DETACH DISABLED, DISALLOWED



    test("connection dragging", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1,d2,d3], {
        });
        _jsPlumb.makeTarget([d1,d2,d3], {

        });
        /*
         var c = _jsPlumb.connect({source:d1, target:d2});
         equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after programmatic connect");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after programmatic connect");

         _jsPlumb.detach(c);
         equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after programmatic detach");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after programmatic detach");

         c = _jsPlumb.connect({source:d1, target:d2});
         equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect" );
         equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

         _detachThisConnection(c);
         equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse detach");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse detach");
         equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

         // reconnect, check
         support.dragConnection(d1, d2);
         equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");
         c = _jsPlumb.select().get(0);

         // move the target to d3, check
         support.relocateTarget(c, d3);
         equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse relocate");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse relocate");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse relocate");

         // toss it away again, check
         _detachThisConnection(c);
         equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse detach");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse detach");
         equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after mouse detach");
         equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
         */
        // reconnect, check
        support.dragConnection(d1, d2);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse connect");
        equal(1, _jsPlumb.select().length, "1 connection");

        //support.relocateSource(c, d3);
        //equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after source relocate");
        //equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after source relocate");
        //equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after source relocate");
        //equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

// ----------------------------------- element dragging ------------------------------


    test(': draggable in nested element does not cause extra ids to be created', function () {
        var d = support.addDiv("d1");
        var d2 = document.createElement("div");
        d2.setAttribute("foo", "ff");
        d.appendChild(d2);
        var d3 = document.createElement("div");
        d2.appendChild(d3);
        ok(d2.getAttribute("id") == null, "no id on d2");
        _jsPlumb.draggable(d);
        _jsPlumb.addEndpoint(d3);
        ok(d2.getAttribute("id") == null, "no id on d2");
        ok(d3.getAttribute("id") != null, "id on d3");
    });

    test(" : draggable, reference elements returned correctly", function () {
        var d = support.addDiv("d1");
        var d2 = document.createElement("div");
        d2.setAttribute("foo", "ff");
        d.appendChild(d2);
        var d3 = document.createElement("div");
        d3.setAttribute("id", "d3");
        d2.appendChild(d3);
        _jsPlumb.draggable(d);
        _jsPlumb.addEndpoint(d3);
        _jsPlumb.draggable(d3);
        // now check ref ids for element d1
        var els = _jsPlumb.dragManager.getElementsForDraggable("d1");
        ok(!jsPlumbUtil.isEmpty(els), "there is one sub-element for d1");
        ok(els["d3"] != null, "d3 registered");
    });


    test(" : draggable + setParent, reference elements returned correctly", function () {
        var d = support.addDiv("d1");
        var d2 = document.createElement("div");
        d2.setAttribute("foo", "ff");
        d.appendChild(d2);
        var d3 = document.createElement("div");
        d3.setAttribute("id", "d3");
        d2.appendChild(d3);
        _jsPlumb.draggable(d);
        _jsPlumb.addEndpoint(d3);
        _jsPlumb.draggable(d3);
        // create some other new parent
        var d12 = support.addDiv("d12");
        // and move d3
        _jsPlumb.setParent(d3, d12);

        // now check ref ids for element d1
        var els = _jsPlumb.dragManager.getElementsForDraggable("d1");
        ok(jsPlumbUtil.isEmpty(els), "there are no sub-elements for d1");
        var els12 = _jsPlumb.dragManager.getElementsForDraggable("d12");
        ok(!jsPlumbUtil.isEmpty(els12), "there is one sub-element for d12");
        ok(els12["d3"] != null, "d3 registered");
    });

    test("drag multiple elements and ensure their connections are painted correctly at the end", function() {

        var d1 = support.addDraggableDiv ('d1', null, null,50, 50, 100, 100);
        var d2 = support.addDraggableDiv ('d2', null, null,250, 250, 100, 100);
        var d3 = support.addDraggableDiv ('d3', null, null,500, 500, 100, 100);

        var e1 = _jsPlumb.addEndpoint(d1, {
            anchor:"TopLeft"
        });
        var e2 = _jsPlumb.addEndpoint(d2, {
            anchor:"TopLeft",
            maxConnections:-1
        });
        var e3 = _jsPlumb.addEndpoint(d3, {
            anchor:"TopLeft"
        });

        _jsPlumb.connect({source:e1, target:e2});
        _jsPlumb.connect({source:e2, target:e3});

        equal(e1.canvas.offsetLeft, 50 - (e1.canvas.offsetWidth/2), "endpoint 1 is at the right place");
        equal(e1.canvas.offsetTop, 50 - (e1.canvas.offsetHeight/2), "endpoint 1 is at the right place");
        equal(e2.canvas.offsetLeft, 250 - (e2.canvas.offsetWidth/2), "endpoint 2 is at the right place");
        equal(e2.canvas.offsetTop, 250 - (e2.canvas.offsetHeight/2), "endpoint 2 is at the right place");
        equal(e3.canvas.offsetLeft, 500 - (e3.canvas.offsetWidth/2), "endpoint 3 is at the right place");
        equal(e3.canvas.offsetTop, 500 - (e3.canvas.offsetHeight/2), "endpoint 3 is at the right place");

        _jsPlumb.addToDragSelection("d1");
        _jsPlumb.addToDragSelection("d3");

        // drag node 2 by 750,750. we expect its endpoint to have moved too

        support.dragNodeTo(d2, 1000, 1000);

        equal(d2.offsetLeft, 950, "div 2 is at the right left position");
        equal(d2.offsetTop, 950, "div 2 is at the right top position");

        // divs 1 and 3 have moved too, make sure they are in the right place
        equal(d1.offsetLeft, 750, "div 1 is at the right left position");
        equal(d1.offsetTop, 750, "div 1 is at the right top position");
        equal(d3.offsetLeft, 1200, "div 3 is at the right left position");
        equal(d3.offsetTop, 1200, "div 3 is at the right top position");

        // check the endpoints
        equal(e2.canvas.offsetLeft, 950 - (e2.canvas.offsetWidth/2), "endpoint 2 is at the right place");
        equal(e2.canvas.offsetTop, 950 - (e2.canvas.offsetHeight/2), "endpoint 2 is at the right place");

        equal(e1.canvas.offsetLeft, 750 - (e1.canvas.offsetWidth/2), "endpoint 1 is at the right place");
        equal(e1.canvas.offsetTop, 750 - (e1.canvas.offsetHeight/2), "endpoint 1 is at the right place");

        equal(e3.canvas.offsetLeft, 1200 - (e3.canvas.offsetWidth/2), "endpoint 3 is at the right place");
        equal(e3.canvas.offsetTop, 1200 - (e3.canvas.offsetHeight/2), "endpoint 3 is at the right place");

    });

    //
    // this is a test of how the drag selection works when something is selected but the thing being dragged does
    // not have the same parent. Consider a node in a group, and its selected. When you drag the group, that node
    // inside of it should not be dragged also, regardless of the fact that its in the drag selection. in fact in that
    // case the only events that should cause that node to be dragged
    test("multiple element drag (via addToDragSelection) works properly with groups", function() {

        var d1 = support.addDraggableDiv ('d1', null, null,50, 50, 100, 100);
        var d2 = support.addDraggableDiv ('d2', null, null,250, 250, 100, 100);
        var d3 = support.addDraggableDiv ('d3', null, null,500, 500, 100, 100);
        var d4 = support.addDraggableDiv ('d4', null, null,800, 800, 100, 100);

        var g = _jsPlumb.addGroup({el:d1, id:"g1" });
        _jsPlumb.addToGroup(g, d2);

        _jsPlumb.addToDragSelection("d1");
        equal(_jsPlumb.getDragSelection().length, 1, "the group was added to the drag selection");

        _jsPlumb.addToDragSelection("d2");
        equal(_jsPlumb.getDragSelection().length, 1, "the node was _NOT_ added to the drag selection, as it is in a group");

        _jsPlumb.addToDragSelection("d3");
        equal(_jsPlumb.getDragSelection().length, 2, "the second node was added to the drag selection as it is not in a group");

        _jsPlumb.addToGroup(g, d3);
        equal(_jsPlumb.getDragSelection().length, 1, "the second node removed from the drag selection when it was added to a group");




        // drag node 2 by 750,750. we expect its endpoint to have moved too

        // support.dragNodeTo(d2, 1000, 1000);
        //
        // equal(d2.offsetLeft, 950, "div 2 is at the right left position");
        // equal(d2.offsetTop, 950, "div 2 is at the right top position");
        //
        // // divs 1 and 3 have moved too, make sure they are in the right place
        // equal(d1.offsetLeft, 750, "div 1 is at the right left position");
        // equal(d1.offsetTop, 750, "div 1 is at the right top position");
        // equal(d3.offsetLeft, 1200, "div 3 is at the right left position");
        // equal(d3.offsetTop, 1200, "div 3 is at the right top position");
        //
        // // check the endpoints
        // equal(e2.canvas.offsetLeft, 950 - (e2.canvas.offsetWidth/2), "endpoint 2 is at the right place");
        // equal(e2.canvas.offsetTop, 950 - (e2.canvas.offsetHeight/2), "endpoint 2 is at the right place");
        //
        // equal(e1.canvas.offsetLeft, 750 - (e1.canvas.offsetWidth/2), "endpoint 1 is at the right place");
        // equal(e1.canvas.offsetTop, 750 - (e1.canvas.offsetHeight/2), "endpoint 1 is at the right place");
        //
        // equal(e3.canvas.offsetLeft, 1200 - (e3.canvas.offsetWidth/2), "endpoint 3 is at the right place");
        // equal(e3.canvas.offsetTop, 1200 - (e3.canvas.offsetHeight/2), "endpoint 3 is at the right place");

    });

};

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

    var renderMode = jsPlumb.SVG;
    support = jsPlumbTestSupport.getInstance(_jsPlumb);

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



};

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

var removeContainer = function() {
    container && container.parentNode && container.parentNode.removeChild(container)
}

var testSuite = function () {

    module("Make Source", {
        teardown: function () {
            support.cleanup();
            removeContainer()
        },
        setup: function () {
            makeContainer()
            _jsPlumb = jsPlumbBrowserUI.newInstance({container:container});
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
        }
    });

    test("connections via mouse between elements configured with makeSource/makeTarget", function() {

        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3"), d4 = _addDiv("d4");
        _jsPlumb.makeSource(d1);
        _jsPlumb.makeSource(d4);
        _jsPlumb.makeTarget(d2);
        _jsPlumb.makeTarget(d3);

        _jsPlumb.Defaults.maxConnections = -1;

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");

        equal(document.querySelectorAll(".jtk-endpoint").length, 2, "two endpoints in the DOM (the drag one was cleared up)");

        var cd1d2 = _jsPlumb.select().get(0);
        equal(cd1d2.source.id, "d1", "source of first connection is correct");
        equal(cd1d2.target.id, "d2", "target of first connection is correct");

        // support.dragConnection(d1, d3);
        // equal(_jsPlumb.select().length, 2, "two connections after drag from source to target");
        // equal(document.querySelectorAll(".jtk-endpoint").length, 4, "four endpoints in the DOM (the second drag one was cleared up)");
        //
        // var cd1d3 = _jsPlumb.select().get(1);
        // equal(cd1d3.source.id, "d1", "source of second connection is correct");
        // equal(cd1d3.target.id, "d3", "target of second connection is correct");
        //
        // // now we will drag the connection from d1-d2 by its target endpoint and put it on d3.
        // support.relocateTarget(cd1d2, d3);
        // equal(cd1d2.target.id, "d3", "target of first connection has changed to d3");
        // equal(_jsPlumb.select().length, 2, "two connections after relocate");
        // equal(document.querySelectorAll(".jtk-endpoint").length, 4, "four endpoints in the DOM (the drag one for relocate was cleared up)");
        //
        // support.dragConnection(d3, d1);
        // equal(_jsPlumb.select().length, 2, "two connections after failed drag from target to source (d3 is a target and not a source)");
        // equal(document.querySelectorAll(".jtk-endpoint").length, 4, "still four endpoints in the DOM after connection we rejected");
        //
        // // move d3 off of d1, it's overlapping right now and that's messing up the test
        //
        // support.dragANodeAround(d3);
        //
        // // now drag the source of d1-d2 to be d4.
        // support.relocateSource(cd1d2, d4);
        // equal(cd1d2.source.id, "d4", "source of first connection has changed to d4");
        // equal(_jsPlumb.select().length, 2, "two connections after relocate");

    });


    // https://github.com/jsplumb/jsPlumb/issues/415
    test("issue 415: spurious endpoints after dragging", function() {

        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3,d4].forEach(function(el) {
            _jsPlumb.makeSource(el, {
                maxConnections:-1
            });

            _jsPlumb.makeTarget(el, {
                maxConnections:-1
            });
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
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3,d4].forEach(function(el) {
            _jsPlumb.makeSource(el, {
                maxConnections:-1
            });

            _jsPlumb.makeTarget(el, {
                maxConnections:-1
            });
        });

        ok(_jsPlumb.isSource(d1), "d1 is a connection source");
        ok(_jsPlumb.isTarget(d2), "d2 is a connection target");

        // as a test: connect d3 to itself. 2 endpoints?
        var d3d3 = support.dragConnection(d3, d3);
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints");

        var d2d1 = support.dragConnection(d2, d1);
        equal(_jsPlumb.select().length, 2, "one connection after drag");

        support.relocateSource(d2d1, d1);
        equal(d2d1.endpoints[0].element.id, "d1", "source endpoint is on d1 now");
        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints after relocations");

        support.relocateSource(d2d1, d2);
        equal(d2d1.endpoints[0].element.id, "d2", "source endpoint is on d2 now");
        ok(support.getEndpointCanvas(d2d1.endpoints[1]).parentNode != null, "target canvas put back into DOM");
    });

    test("drag connection so it turns into a self-loop. ensure endpoints registered correctly. target is continuous anchor so is hidden. (issue 419)", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3,d4].forEach(function(el) {
            _jsPlumb.makeSource(el, {
                maxConnections:-1,
                anchor:"Continuous"
            });

            _jsPlumb.makeTarget(el, {
                maxConnections:-1,
                anchor:"Continuous"
            });
        });


        var d2d1 = support.dragConnection(d2, d1);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        support.relocateSource(d2d1, d1);
        equal(d2d1.endpoints[0].element.id, "d1", "source endpoint is on d1 now");
        // NOTE in this test we are not using Continuous anchors so we do not expect the target to have been
        // removed. the next test uses Continuous anchors and it checks the target has been removed.
        //ok(d2d1.endpoints[1].canvas.parentNode == null, "target canvas removed from DOM");

        support.relocateSource(d2d1, d2);
        equal(d2d1.endpoints[0].element.id, "d2", "source endpoint is on d2 now");
        ok(support.getEndpointCanvas(d2d1.endpoints[1]).parentNode != null, "target canvas put back into DOM");
    });




    test("connection dragging, simple drag and detach case", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");

        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { }); });
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { }) });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.detachConnectionByTarget(c);
        equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after mouse detach");
        equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse detach");
        //  equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 0, "0 connections in jsplumb instance.");

    });

    /**
     * Tests the `extract` parameter on a `makeSource` call: extract provides a map of attribute names that you want to
     * read fom the source element when a drag starts, and whose values end up in the connection's data, keyed by the
     * value from the extract map. In this test we get the attribute `foo` and insert its value into the connection's
     * data, keyed as `fooAttribute`.
     */
    test("connection dragging, extractor atts defined on source", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");

        d1.setAttribute("foo", "the value of foo");
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, {
            extract:{
                "foo":"fooAttribute"
            }
        })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var con = support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        equal(con.getData().fooAttribute, "the value of foo", "attribute values extracted properly");

        equal(con.endpoints[0].getParameter("fooAttribute"), "the value of foo", "attribute values extracted and set as parameters on Endpoint");
    });

    test("connection dragging, simple drag and detach case, beforeDetach interceptor says no.", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");

        _jsPlumb.bind("beforeDetach", function() { return false; });
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.detachConnectionByTarget(c);
        equal(_jsPlumb.select({source:d1}).length, 1, "still 1 connection registered for d1 after attempted mouse detach");
        equal(_jsPlumb.select({target:d2}).length, 1, "still 1 connection registered for d2 after attempted mouse detach");
        //equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");

    });

    test("connection dragging, simple drag and detach case, reattach=true on connection prevents detach.", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        c.setReattach(true);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.detachConnectionByTarget(c);
        equal(_jsPlumb.select({source:d1}).length, 1, "still 1 connection registered for d1 after attempted mouse detach");
        equal(_jsPlumb.select({target:d2}).length, 1, "still 1 connection registered for d2 after attempted mouse detach");
        //equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");

    });

    test("connection dragging, simple move target case", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d3);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.select({target:d3}).length, 1, "1 connection registered for d3 after mouse move");
        // equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");

        if (_jsPlumb.select({source:d1}).length !== 1) {
            debugger;
        }

        //alert("ensure continuous anchor endpoint cleaned up in this case (simple target move)");
    });

// ----------- DRAG SOURCE TO ANOTHER SOURCE ------------------------

    test("connection dragging, simple move source case", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        [d1,d2,d3].forEach(function(el) {  _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");
        equal(_jsPlumb.select({source:d3}).length, 0, "0 connections registered for d3 before mouse moves connection");

        support.relocateSource(c, d3);
        equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints; there is one connection");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.select({source:d3}).length, 1, "1 connection registered for d3 after mouse move");

        equal(_jsPlumb.select().length, 1, "1 connection registered on instance after mouse move");

        equal(null, c.floatingId, "floating ID was cleared")

    });

    test("connection dragging, simple move source case, continuous anchors", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        _jsPlumb.importDefaults({anchor:"Continuous"});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints; there is one connection");
        equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.select({source:d3}).length, 1, "1 connection registered for d3 after mouse move");

        equal(null, c.floatingId, "floating ID was cleared")

    });

    test("connection dragging, simple move target case, beforeDetach aborts the move (and causes the connection to be reattached)", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d3);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connections registered for d1 after aborted mouse move");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connections registered for d2 after aborted mouse move");
        equal(_jsPlumb.select({target:d3}).length, 0, "0 connections registered for d3 after aborted mouse move");

        equal(null, c.floatingId, "floating ID was cleared")
    });


    test("connection dragging, simple move source case, beforeDetach aborts the move", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.select({target:d3}).length, 0, "0 connections registered for d3 after aborted mouse move");
    });

    test("connection dragging, simple move case, connection setReattach(true) undoes the detach", function() {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        c.setReattach(true);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.detachConnectionByTarget(c);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.select({target:d3}).length, 0, "0 connections registered for d3 after aborted mouse move");

        equal(null, c.floatingId, "floating ID was cleared")
    });

    // DRAG TARGET and redrop on original
    test("connection dragging, redrop on original target", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d2);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse move");
        // equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE AND REDROP ON ORIGINAL
    test("connection dragging, redrop on original source", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d1);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse move");
        // equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });


    // DRAG SOURCE TO AN ELEMENT NOT CONFIGURED AS SOURCE (SHOULD DETACH)
    test("connection dragging, move source to element not configured as drag source", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3,d4].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "zero endpoints; there are no connections");
        equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.select({target:d3}).length, 0, "0 connections registered for d3 after mouse move");
        // equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE TO AN ELEMENT NO CONFIGURED AS SOURCE BUT DETACH DISABLED (SHOULDNT CARE)
    test("connection dragging, move source to element not configured as drag source, beforeDetach cancels connection", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        _jsPlumb.bind("beforeDetach", function() { return false; });
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3,d4].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "2 endpoints; there is 1 connection");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.select({source:d4}).length, 0, "0 connection registered for d4 after mouse move");
    });

    // DRAG SOURCE TO ELEMENT NOT CONFIGURED AS SOURCE BUT BEFORE DROP SAYS NO SO ITS IRRELEVANT
    test("connection dragging, move source to element not configured as drag source, beforeDrop cancels connection", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        _jsPlumb.bind("beforedrop", function() { return false; });
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3,d4].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "0 endpoints; there are no connections");
        equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.select({source:d4}).length, 0, "0 connections registered for d4 after mouse move");
    });

    // DRAG TARGET TO ANOTHER SOURCE (BUT NOT A TARGET); SHOULD DETACH
    test("connection dragging, move target to element not configured as drag target", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3,d4].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints found after connection established");

        support.relocateTarget(c, d4);
        equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 in anchor manager after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "zero endpoints found");
        equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.select({target:d3}).length, 0, "0 connections registered for d3 after mouse move");
        // equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");

        if (_jsPlumb.select({source:d1}).length !== 0) {
            debugger;
        }
    });


    // DRAG TARGET TO ANOTHER SOURCE (BUT NOT A TARGET), BUT DETACH DISABLED. SHOULDNT CARE.
    test("connection dragging, move source to element not configured as drag source, beforeDetach cancels connection", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        _jsPlumb.bind("beforeDetach", function() { return false; });
        [d1,d2,d3,d4].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d4);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "2 endpoints; there is 1 connection");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.select({target:d4}).length, 0, "0 connection registered for d4 after mouse move");
        //  equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    /**
     * Tests that `endpoint` and `anchor` in a makeSource definition are honoured. The next test uses a connection type
     * but has the makeSource override the anchor.
     */
    test("connection dragging, makeSource sets source endpoint and anchor", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { endpoint:"Rectangle", anchor:"Left"})});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "source endpoint is Rectangle");
        equal(c.endpoints[0].anchor.x, 0, "x=0 in anchor");
        equal(c.endpoints[0].anchor.y, 0.5, "y=0.5 in anchor");
        equal(c.endpoints[1].endpoint.getType(), _jsPlumb.Defaults.endpoint, "target endpoint is the default");
    });

    /**
     * Tests that makeSource, when given `endpoint` and/or `anchor` values, will override any that were derived
     * from an applied type.
     */
    test("connection dragging, makeSource overrides source endpoint and anchor", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        _jsPlumb.registerConnectionType("basic", {
            endpoint:"Dot",
            anchor:"Right"
        });
        _jsPlumb.makeSource(d1, { connectionType:"basic", endpoint:"Rectangle", anchor:"Left"});
        _jsPlumb.makeSource(d2, { connectionType:"basic"});
        //_jsPlumb.makeTarget([d1, d2, d3]);
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});

        support.dragConnection(d1, d3);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        support.dragConnection(d2, d3);
        equal(_jsPlumb.select().length, 2, "2 connections in jsplumb instance.");
        var c2 = _jsPlumb.select().get(1);

        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "source endpoint was overridden to be Rectangle");
        equal(c.endpoints[0].anchor.x, 0, "x=0 in overridden anchor");
        equal(c.endpoints[0].anchor.y, 0.5, "y=0.5 in overridden anchor");

        equal(c2.endpoints[0].endpoint.getType(), "Dot", "source endpoint is Blank in endpoint derived from type");
        equal(c2.endpoints[0].anchor.x, 1, "x=1 in anchor derived from type");
        equal(c2.endpoints[0].anchor.y, 0.5, "y=0.5 in anchor derived from type");

    });

    /**
     * Tests that makeSource, when given `endpoint` and/or `anchor` values, will override any that were derived
     * from an applied type.
     */
    test("connection dragging, makeTarget overrides source endpoint and anchor", function() {

        equal(_jsPlumb.select().length, 0, "0 connections in jsplumb instance.");

        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        _jsPlumb.registerConnectionType("basic", {
            endpoint:"Dot",
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

        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint was overridden to be Rectangle");
        equal(c.endpoints[1].anchor.x, 0, "x=0 in overridden anchor");
        equal(c.endpoints[1].anchor.y, 0.5, "y=0.5 in overridden anchor");

        equal(c2.endpoints[1].endpoint.getType(), "Dot", "target endpoint is Dot in endpoint derived from type");
        equal(c2.endpoints[1].anchor.x, 1, "x=1 in anchor derived from type");
        equal(c2.endpoints[1].anchor.y, 0.5, "y=0.5 in anchor derived from type");

    });

    test("connection dragging, makeTarget overrides endpoint and anchor", function() {
        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { endpoint:"Rectangle", anchor:"Top"})});

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        equal(c.endpoints[0].endpoint.getType(), _jsPlumb.Defaults.endpoint, "source endpoint is the default");
        equal(c.endpoints[1].anchor.x, 0.5, "x=0.5 in anchor");
        equal(c.endpoints[1].anchor.y, 0, "y=0 in anchor");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint is Rectangle");

    });


    // DETACH CONNECTION VIA SOURCE, DETACH ENABLED, ALLOWED
    // DETACH CONNECTION VIA SOURCE, DETACH DISABLED, DISALLOWED



    test("connection dragging", function() {

        var d1 = _addDiv("d1", 50, 50, 100, 100),
            d2 = _addDiv("d2", 250, 250, 100, 100),
            d3 = _addDiv("d3", 450, 450, 100, 100),
            d4 = _addDiv("d4", 650, 650, 100, 100);

        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeSource(el, { })});
        [d1,d2,d3].forEach(function(el) { _jsPlumb.makeTarget(el, { })});
        /*
         var c = _jsPlumb.connect({source:d1, target:d2});
         equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after programmatic connect");
         equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after programmatic connect");

         _jsPlumb.detach(c);
         equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after programmatic detach");
         equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after programmatic detach");

         c = _jsPlumb.connect({source:d1, target:d2});
         equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect" );
         equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");

         support.detachConnectionByTarget(c);
         equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after mouse detach");
         equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse detach");
         equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");

         // reconnect, check
         support.dragConnection(d1, d2);
         equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
         equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");
         c = _jsPlumb.select().get(0);

         // move the target to d3, check
         support.relocateTarget(c, d3);
         equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse relocate");
         equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse relocate");
         equal(_jsPlumb.select({target:"d3"}).length, 1, "1 connection registered for d3 after mouse relocate");

         // toss it away again, check
         support.detachConnectionByTarget(c);
         equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after mouse detach");
         equal(_jsPlumb.select({target:d2}).length, 0, "0 connections registered for d2 after mouse detach");
         equal(_jsPlumb.select({target:"d3"}).length, 0, "0 connections registered for d3 after mouse detach");
         equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
         */
        // reconnect, check
        support.dragConnection(d1, d2);
        equal(_jsPlumb.select({source:d1}).length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after mouse connect");
        var c = _jsPlumb.select().get(0);
        //  equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse connect");
        equal(1, _jsPlumb.select().length, "1 connection");

        //support.relocateSource(c, d3);
        //equal(_jsPlumb.select({source:d1}).length, 0, "0 connections registered for d1 after source relocate");
        //equal(_jsPlumb.select({target:d2}).length, 1, "1 connection registered for d2 after source relocate");
        //equal(_jsPlumb.select({target:"d3"}).length, 1, "1 connection registered for d3 after source relocate");
        //equal(_jsPlumb.select({source:c.floatingId}).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    test(" makeSource connection type is honoured, mouse connect", function () {
        var d1 = _addDiv("d1"), d2 = _addDiv("d2"), d3 = _addDiv("d3");

        _jsPlumb.Defaults.paintStyle = {stroke: "blue", strokeWidth: 34};

        _jsPlumb.registerConnectionTypes({
            "basic": {
                connector: "Flowchart",
                paintStyle: { stroke: "yellow", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "blue" },
                overlays: [
                    "Arrow"
                ],
                endpoint:"Rectangle"
            }
        });

        _jsPlumb.makeSource(d1, {
            connectionType:"basic"
        });

        _jsPlumb.makeTarget(d2, {
            endpoint:"Blank"
        });

        var c = support.dragConnection(d1, d2);
        c = _jsPlumb.select().get(0);
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has basic type's strokeWidth");
        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "source endpoint is of type rectangle");
        equal(c.endpoints[1].endpoint.getType(), "Blank", "target endpoint is of type Blank - it was overriden from the type's endpoint.");
    });

    test(": _jsPlumb.connect after makeSource (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
    });


    test(": _jsPlumb.connect after makeSource (simple case, two connect calls)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 2);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
    });

    test(": makeSource/makeTarget scope", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeTarget(d16, {scope: "foo"});
        _jsPlumb.makeTarget(d18, {scope: "bar"});
        _jsPlumb.makeSource(d17, { scope: "foo" }); // give it a non-default anchor, we will check this below.
        var c = _jsPlumb.connect({source: d17, target: d16});
        ok(c != null, "connection with matching scope established");
        c = _jsPlumb.connect({source: d17, target: d18});
        ok(c == null, "connection with non-matching scope not established");
    });

    test(": makeSource, manipulate scope programmatically", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeSource(d16, {scope: "foo", isSource: true, maxConnections: -1});
        _jsPlumb.makeTarget(d17, {scope: "bar", maxConnections: -1});
        _jsPlumb.makeTarget(d18, {scope: "qux", maxConnections: -1});

        equal(_jsPlumb.getSourceScope(d16), "foo", "scope of makeSource element retrieved");
        equal(_jsPlumb.getTargetScope(d17), "bar", "scope of makeTarget element retrieved");

        var c = _jsPlumb.connect({source: d16, target: d17});
        ok(c == null, "connection was established");

        // change scope of source, then try to connect, and it should fail.
        _jsPlumb.setSourceScope(d16, "qux");
        c = _jsPlumb.connect({source: d16, target: d17});
        ok(c == null, "connection was not established due to unmatched scopes");

        _jsPlumb.setTargetScope(d17, "foo qux");
        equal(_jsPlumb.getTargetScope(d17), "foo qux", "scope of makeTarget element retrieved");
        c = _jsPlumb.connect({source: d16, target: d17});
        ok(c != null, "connection was established now that scopes match");

        _jsPlumb.makeSource(d17);
        _jsPlumb.setScope(d17, "BAZ");
        // use setScope method to set source _and_ target scope
        equal(_jsPlumb.getTargetScope(d17), "BAZ", "scope of target element retrieved");
        equal(_jsPlumb.getSourceScope(d17), "BAZ", "scope of source element retrieved");

        // getScope will give us what it can, defaulting to source scope.
        equal(_jsPlumb.getScope(d16), "qux", "source scope retrieved for d16");
        equal(_jsPlumb.getScope(d18), "qux", "target scope retrieved for d18");
        equal(_jsPlumb.getScope(d17), "BAZ", "source scope retrieved for d17, although target scope is set too");

    });


    test(": _jsPlumb.connect after makeSource (parameters)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left", parameters: { foo: "bar"}  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].getParameter("foo"), "bar", "parameter was set on endpoint made from makeSource call");
    });

    test(": _jsPlumb.connect after makeTarget (simple case, two connect calls, uniqueEndpoint set)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left", uniqueEndpoint: true, maxConnections: -1  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].connections.length, 2, "endpoint on d17 has two connections");
    });

    test(": makeSource, create endpoint immediately", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d16, {isSource: false, isTarget: true, maxConnections: -1});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left", createEndpoint: true, maxConnections: -1  }); // give it a non-default anchor, we will check this below.

        // _jsPlumb.connect({source: "d17", target: e16});
        // _jsPlumb.connect({source: "d17", target: e16});
        // support.assertEndpointCount("d16", 1, _jsPlumb);

        // even though there has been no connections made the endpoint should exist.
        support.assertEndpointCount(d17, 1);
        // but not for d16
        support.assertEndpointCount(d16, 0);

        // now connect d17 twice to d16, there should still be only one endpoint for 17, and now two for 16
        _jsPlumb.connect({source: d17, target: d16});
        _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d17, 1);
        support.assertEndpointCount(d16, 2);

        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is Left"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].connections.length, 2, "endpoint on d17 has two connections");
    });

    test(": makeTarget, create endpoint immediately", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d16, {isSource: false, isTarget: true, createEndpoint: true, maxConnections: -1});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left", maxConnections: -1  }); // give it a non-default anchor, we will check this below.


        // even though there has been no connections made the endpoint should exist.
        support.assertEndpointCount(d16, 1);
        // but not for d17
        support.assertEndpointCount(d17, 0);

        // now connect d17 twice to d16, there should still be only one endpoint for 16, and now two for 17
        _jsPlumb.connect({source: d17, target: d16});
        _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d17, 2);
        support.assertEndpointCount(d16, 1);
    });

    test(": makeSource/makeTarget, create endpoint immediately", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d16, {isSource: false, isTarget: true, createEndpoint: true, maxConnections: -1});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left", createEndpoint: true,  maxConnections: -1  }); // give it a non-default anchor, we will check this below.


        // even though there has been no connections made the endpoint should exist.
        support.assertEndpointCount(d16, 1);
        // and for d17
        support.assertEndpointCount(d17, 1);

        // now connect d17 twice to d16, there should still be only one endpoint for 16 and 17
        var c1 = _jsPlumb.connect({source: d17, target: d16});
        var c2 = _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d17, 1);
        support.assertEndpointCount(d16, 1);

        // disconnect the connections. the endpoints should stick around.
        _jsPlumb.deleteConnection(c1);
        _jsPlumb.deleteConnection(c2);
        equal(0, _jsPlumb.select().length, "no connections left in instance");

        support.assertEndpointCount(d17, 1);
        support.assertEndpointCount(d16, 1);
    });

    test(": _jsPlumb.connect after makeTarget (newConnection:true specified)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16, newConnection: true});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0.5, "anchor is Bottom"); //here we should be seeing the default anchor
        equal(e[0].anchor.y, 1, "anchor is Bottom"); //here we should be seeing the default anchor
    });

    // makeSource, then disable it. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and setSourceEnabled(false) (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.setSourceEnabled(d17, false);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

    // makeSource, then disable it. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and setSourceEnabled(false) (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.setSourceEnabled(d17, false);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

    // makeSource, then toggle its enabled state. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and toggleSourceEnabled() (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);

        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    // makeSource, then disable it. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and toggleSourceEnabled() (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    test(": jsPlumb.isSource and jsPlumb.isSourceEnabled", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isSource(d17) == true, "d17 is recognised as connection source");
        ok(_jsPlumb.isSourceEnabled(d17) == true, "d17 is recognised as enabled");
        _jsPlumb.setSourceEnabled(d17, false);
        ok(_jsPlumb.isSourceEnabled(d17) == false, "d17 is recognised as disabled");

        equal(_jsPlumb.isSource(d17), true, "d17 is recognised as a source when provided as a string");

        try {
            _jsPlumb.isSource(null);
            ok(true, "requesting isSource with null argument doesnt throw an error");
        } catch(e) {
            ok(false, "requesting isSource with null argument threw an error when it shouldnt have");
        }
    });

    // makeSource, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (elements as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        var originallyEnabled = _jsPlumb.setTargetEnabled(d17, false);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);

        // tests for css class for disabled target
        ok(_jsPlumb.hasClass(d17, "jtk-target-disabled"), "disabled class added");

        ok(originallyEnabled, "setTargetEnabled returned the original enabled value of true when setting to false");
        originallyEnabled = _jsPlumb.setTargetEnabled(d17, true);
        ok(!originallyEnabled, "setTargetEnabled returned the previous enabled value of false when setting to true");

        ok(!d17.classList.contains("jtk-target-disabled"), "disabled class removed")
    });

    // makeSource, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (DOM element as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        var originallyEnabled = _jsPlumb.setTargetEnabled(d17, false);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);


        // tests for css class for disabled target
        ok(_jsPlumb.hasClass(d17, "jtk-target-disabled"), "disabled class added");

        ok(originallyEnabled, "setTargetEnabled returned the original enabled value of true when setting to false");
        originallyEnabled = _jsPlumb.setTargetEnabled(d17, true);
        ok(!originallyEnabled, "setTargetEnabled returned the previous enabled value of false when setting to true");

        ok(!_jsPlumb.hasClass(d17, "jtk-target-disabled"), "disabled class removed");
    });

    // makeTarget, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.setTargetEnabled(d17, false);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

    // makeTarget, then toggle its enabled state. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and toggleTargetEnabled() (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);

        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    // makeTarget, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and toggleTargetEnabled() (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    test(": jsPlumb.isTarget and jsPlumb.isTargetEnabled", function () {
        var d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isTarget(d17) === true, "d17 is recognised as connection target");
        ok(_jsPlumb.isTargetEnabled(d17) === true, "d17 is recognised as enabled");
        _jsPlumb.setTargetEnabled(d17, false);
        ok(_jsPlumb.isTargetEnabled(d17) === false, "d17 is recognised as disabled");

        equal(_jsPlumb.isTarget(d17), true, "d17 is recognised as a target when provided as a string");

        try {
            _jsPlumb.isTarget(null);
            ok(true, "requesting isTarget with null argument doesnt throw an error");
        } catch(e) {
            ok(false, "requesting isTarget with null argument threw an error when it shouldnt have");
        }
    });

    test(": _jsPlumb.makeTarget - endpoints deleted by default when they have no more connections", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeSource(d16);
        _jsPlumb.makeTarget(d17);

        var c = _jsPlumb.connect({source: d16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        support.assertEndpointCount(d16, 0, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

// setSource/setTarget methods.


    test(": _jsPlumb.setSource (element)", function () {

        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");

        var c = _jsPlumb.connect({source: d16, target: d17, endpoint: "Rectangle"});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        ok(_jsPlumb.hasClass(d16, "jtk-connected"), "d16 has jtk-connected class");
        ok(_jsPlumb.hasClass(d17, "jtk-connected"), "d17 has jtk-connected class");
        ok(!_jsPlumb.hasClass(d18, "jtk-connected"), "d18 does not have jtk-connected class");

        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");
        equal(c.endpoints[0].connections.length, 1, "endpoint has one connection");

        _jsPlumb.setSource(c, d18);
        equal(c.source.id, "d18", "source is now d18");
        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "endpoint is still type Rectangle");
        equal(c.endpoints[0].connections.length, 1, "endpoint has one connection");

        ok(_jsPlumb.hasClass(d18, "jtk-connected"), "d18 has jtk-connected class");
        ok(_jsPlumb.hasClass(d17, "jtk-connected"), "d17 has jtk-connected class");
        ok(!_jsPlumb.hasClass(d16, "jtk-connected"), "d16 does not have jtk-connected class");

        equal(sc, true, "connection:move event fired");

        // test we dont overwrite if the source is already the element
        c.endpoints[0].original = true;
        _jsPlumb.setSource(c, d18);
        equal(c.endpoints[0].original, true, "redundant setSource call ignored");
    });

    test(": _jsPlumb.setSource (endpoint)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var ep = _jsPlumb.addEndpoint(d18), ep2 = _jsPlumb.addEndpoint(d18);

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setSource(c, ep);
        equal(c.source.id, "d18", "source is now d18");

        // test that new endpoint is set (different from the case that an element or element id was given)
        c.endpoints[0].original = true;
        _jsPlumb.setSource(c, ep2);
        equal(c.endpoints[0].original, undefined, "setSource with new endpoint honoured");

    });

    test(": _jsPlumb.setSource (element, with makeSource)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeSource(d18, {
            endpoint: "Rectangle"
        });

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setSource(c, d18);
        equal(c.source.id, "d18", "source is now d18");
        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");

        // test we dont overwrite if the source is already the element
        c.endpoints[0].original = true;
        _jsPlumb.setSource(c, d18);
        equal(c.endpoints[0].original, true, "redundant setSource call ignored");
    });


    test(": _jsPlumb.setTarget (element)", function () {

        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");

        var c = _jsPlumb.connect({source: d16, target: d17, endpoint: "Rectangle"});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");

        _jsPlumb.setTarget(c, d18);
        equal(c.target.id, "d18", "source is now d18");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "endpoint is still type Rectangle");

        equal(sc, true, "connection:move event fired");

        // test we dont overwrite if the target is already the element
        c.endpoints[1].original = true;
        _jsPlumb.setTarget(c, d18);
        equal(c.endpoints[1].original, true, "redundant setTarget call ignored");
    });

    test(": _jsPlumb.setTarget (endpoint)", function () {
        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var ep = _jsPlumb.addEndpoint(d18), ep2 = _jsPlumb.addEndpoint(d18);

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setTarget(c, ep);
        equal(c.target.id, "d18", "source is now d18");

        equal(sc, true, "connection:move event fired");

        // test that new endpoint is set (different from the case that an element or element id was given)
        c.endpoints[1].original = true;
        _jsPlumb.setTarget(c, ep2);
        equal(c.endpoints[1].original, undefined, "setTarget with new endpoint honoured");
    });

    test(": _jsPlumb.setTarget (element, with makeSource)", function () {
        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeTarget(d18, {
            endpoint: "Rectangle",
            cssClass:"CHANGED"
        });

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setTarget(c, d18);
        equal(c.target.id, "d18", "source is now d18");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");
        ok(_jsPlumb.hasClass(c.endpoints[1].endpoint.canvas, "CHANGED"), "endpoint CSS class has 'CHANGED'");

        equal(sc, true, "connection:move event fired");

        // test we dont overwrite if the target is already the element
        c.endpoints[1].original = true;
        _jsPlumb.setTarget(c, d18);
        equal(c.endpoints[1].original, true, "redundant setTarget call ignored");
    });


// end setSource/setTarget methods.

    test(": _jsPlumb.makeSource (parameters)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            params = { "foo": "foo" },
            e16 = _jsPlumb.addEndpoint(d16, { parameters: params });

        _jsPlumb.makeSource(d17, {
            isSource: true,
            parameters: params
        });

        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].getParameter("foo"), "foo", "makeSource created endpoint has parameters");
        equal(e16.getParameter("foo"), "foo", "normally created endpoint has parameters");
    });

    // makeSource, then unmake it. should not be able to make a connection from it. then connect to it, which should succeed,
    // because jsPlumb will just add a new endpoint.
    test(": jsPlumb.unmakeSource (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isSource(d17) === true, "d17 is currently a source");
        // unmake source
        _jsPlumb.unmakeSource(d17);
        ok(_jsPlumb.isSource(d17) === false, "d17 is no longer a source");

        // this should succeed, because d17 is no longer a source and so jsPlumb will just create and add a new endpoint to d17.
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
    });

    // maketarget, then unmake it. should not be able to make a connection to it.
    test(": jsPlumb.unmakeTarget (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "Left"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isTarget(d17) === true, "d17 is currently a target");
        // unmake target
        _jsPlumb.unmakeTarget(d17);
        ok(_jsPlumb.isTarget(d17) === false, "d17 is no longer a target");

        // this should succeed, because d17 is no longer a target and so jsPlumb will just create and add a new endpoint to d17.
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
    });


    test(": jsPlumb.removeEverySource and removeEveryTarget (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeSource(d16).makeTarget(d17).makeSource(d18);
        ok(_jsPlumb.isSource(d16) === true, "d16 is a source");
        ok(_jsPlumb.isTarget(d17) === true, "d17 is a target");
        ok(_jsPlumb.isSource(d18) === true, "d18 is a source");

        _jsPlumb.unmakeEverySource();
        _jsPlumb.unmakeEveryTarget();

        ok(_jsPlumb.isSource(d16) === false, "d16 is no longer a source");
        ok(_jsPlumb.isTarget(d17) === false, "d17 is no longer a target");
        ok(_jsPlumb.isSource(d18) === false, "d18 is no longer a source");
    });

    test(": connectorOverlays", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");

        _jsPlumb.makeSource(d17, { isSource: true, anchor: "Left", connectorOverlays:[
                { type:"Label", options:{label:"FOO", id:"overlay"}}
        ]  });

        var c = _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);

        ok(c.getOverlay("overlay") != null);
    });


// ------------------------ filters and port ids ---------------------------------------------

    //
    // basic source filter setup - a single makeSource call on an element, with a filter.
    //
    test("source filter, ", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250);

        //_addDiv = function (id, parent, className, x, y, w, h) {

        var d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50);
        d16s.style.position = "absolute";

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            filter:".source"
        });

        _jsPlumb.makeTarget(d17);

        var c = support.dragConnection(d16, d17);
        ok(c == null, "no connection - source filter prevented it");

        c = support.dragConnection(d16s, d17);
        ok(c != null, "connection established - source filter allowed it");
    });

    //
    // more advanced source filter setup - two makeSource calls on an element, one with a filter that excludes it.
    //
    // the connection's source endpoint should provide the appropriate `portId`.
    //
    test("source filter, ", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50);

        d16s.style.position = "absolute";

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            filter:".source",
            filterExclude:true
        });

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            portId:"port2"
        });

        _jsPlumb.makeTarget(d17);

        var c = support.dragConnection(d16s, d17);
        ok(c != null, "connection established - the source config without a filter allowed it.");

        equal(c.endpoints[0].portId, "port2", "port2 is the id of the source port");
    });

    test("target filter, single target zone", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50);

        d16s.style.position = "absolute";
        d17t.style.position = "absolute";

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            filterExclude:true,
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            portId:"port2"
        });

        var c = support.dragConnection(d16, d17t, true);
        ok(c != null, "connection established - the target config without a filter allowed it.");

        equal(c.endpoints[1].portId, "port2", "port2 is the id of the target port");
    });

    test("target filter, two target zones", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50),
            d17t2 = support.addDiv("d17target2", d17, "target2", 10, 10, 50, 50);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target2",
            portId:"port2"
        });

        var c = support.dragConnection(d16, d17t, true);
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");
        var c2 = support.dragConnection(d16, d17t2, true);
        equal(c2.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
    });

    test("target filter, two source and two target zones", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50),
            d16s2 = support.addDiv("d16source2", d16, "source2", 10, 10, 50, 50),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50),
            d17t2 = support.addDiv("d17target2", d17, "target2", 10, 10, 50, 50);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            filter:".source",
            portId:"port1"
        });

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            filter:".source2",
            portId:"port2"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target2",
            portId:"port2"
        });

        var c = support.dragConnection(d16s, d17t, true);
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");

        c = support.dragConnection(d16s, d17t2, true);
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");

        c = support.dragConnection(d16s2, d17t, true);
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");

        c = support.dragConnection(d16s2, d17t2, true);
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
    });

    test("target filter, two source and two target zones, programmatic", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50),
            d16s2 = support.addDiv("d16source2", d16, "source2", 10, 10, 50, 50),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50),
            d17t2 = support.addDiv("d17target2", d17, "target2", 10, 10, 50, 50);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            filter:".source",
            portId:"port1",
            endpoint:"Blank"
        });

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            filter:".source2",
            portId:"port2"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target2",
            portId:"port2",
            endpoint:"Rectangle"
        });

        var c = _jsPlumb.connect({source:d16, target:d17, ports:["port1", "port1"]});
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Blank", "source endpoint type derived from the port1 source spec");
        equal(c.endpoints[1].endpoint.getType(), "Dot", "target endpoint type derived from the default");

        c = _jsPlumb.connect({source:d16, target:d17, ports:["port1", "port2"]});
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Blank", "source endpoint type derived from the port1 source spec");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint type derived from the port2 target spec");

        c = _jsPlumb.connect({source:d16, target:d17, ports:["port2", "port1"]});
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Dot", "source endpoint type derived from the default");
        equal(c.endpoints[1].endpoint.getType(), "Dot", "target endpoint type derived from the default");

        c = _jsPlumb.connect({source:d16, target:d17, ports:["port2", "port2"]});
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Dot", "source endpoint type derived from the default");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint type derived from the port2 target spec");
    });

    test("makeTarget allowLoopback false", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left"
        });

        _jsPlumb.makeTarget(d16, {
            // allowLooopback defaults to true
        });

        var c = support.dragConnection(d16, d16, true);
        ok(c != null, "connection established on d16 - the target config allows, by default, loopback connections");

        _jsPlumb.makeSource(d17, {
            isSource: true,
            anchor: "Left"
        });

        _jsPlumb.makeTarget(d17, {
            allowLoopback:false
        });

        c = support.dragConnection(d17, d17, true);
        ok(c == null, "connection not established - the target config does not allow loopback connections");
    });

    test("makeSource allowLoopback false", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "Left",
            // allowLooopback defaults to true
        });

        _jsPlumb.makeTarget(d16, {

        });

        var c = support.dragConnection(d16, d16, true);
        ok(c != null, "connection established on d16 - the source config allows, by default, loopback connections");

        _jsPlumb.makeSource(d17, {
            isSource: true,
            anchor: "Left",
            allowLoopback:false
        });

        _jsPlumb.makeTarget(d17, {

        });

        c = support.dragConnection(d17, d17, true);
        ok(c == null, "connection not established - the source config does not allow loopback connections");
    });

    // 1. two sources on one element, single target, mouse

    // 2. two sources on one element, two target zones on target element, mouse

    // 3. two sources on one element, single target, programmatic

    // 4. two sources on one element, two target zones on target element, programmatic

};

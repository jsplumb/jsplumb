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

    module("Drag", {
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

            // debugger
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


    /**
     * Add a CSS3 selector filter to the instance. It should then prevent anything with that selector from being draggable,
     * even if it would otherwise have been draggable.
     */
    test("filter on container (ignore drag at draggable level)", function() {

        var node = _addDiv("someNode", 50, 50);
        node.classList.add("someSelector");
        node.style.position = "absolute";
        _jsPlumb.manage(node);

        equal(50, parseInt(node.style.left, 10), "child node is left 50");
        equal(50, parseInt(node.style.top, 10), "child node is top 50");

        support.dragNodeBy(node, 50,50);

        equal(100, parseInt(node.style.left, 10), "child node is left 100");
        equal(100, parseInt(node.style.top, 10), "child node is top 100");

        _jsPlumb.addDragFilter(".someSelector");

        support.dragNodeBy(node, 50,50); // should not drag this time, as its selector has been added to the list to exclude.

        equal(100, parseInt(node.style.left, 10), "child node is still left 100 because .someSelector is filtered");
        equal(100, parseInt(node.style.top, 10), "child node is still top 100 because .someSelector is filtered");

        _jsPlumb.removeDragFilter(".someSelector");

        support.dragNodeBy(node, 50,50); // should drag this time, as its selector has been added to the list to exclude.

        equal(150, parseInt(node.style.left, 10), "child node is left 150 after .someSelector filter removed");
        equal(150, parseInt(node.style.top, 10), "child node is top 150 after .someSelector filter removed");

    });

    /**
     * Add a CSS3 selector filter to the instance. It should then prevent anything with that selector from being draggable,
     * even if it would otherwise have been draggable.
     */
    test("filter on container (ignore drag at draggable level), container is changed", function() {

        var node = _addDiv("someNode", 50, 50);
        node.classList.add("someSelector");
        node.style.position = "absolute";
        _jsPlumb.manage(node);

        equal(50, parseInt(node.style.left, 10), "child node is left 50");
        equal(50, parseInt(node.style.top, 10), "child node is top 50");

        support.dragNodeBy(node, 50,50);

        equal(100, parseInt(node.style.left, 10), "child node is left 100");
        equal(100, parseInt(node.style.top, 10), "child node is top 100");

        _jsPlumb.addDragFilter(".someSelector");

        support.dragNodeBy(node, 50,50); // should not drag this time, as its selector has been added to the list to exclude.

        equal(100, parseInt(node.style.left, 10), "child node is still left 100 because .someSelector is filtered");
        equal(100, parseInt(node.style.top, 10), "child node is still top 100 because .someSelector is filtered");


        var newContainer = support.addDiv("someNewContainer", document.body, "", 0,0,1000,1000);
        _jsPlumb.setContainer(newContainer)

        support.dragNodeBy(node, 50,50); // should not drag this time, as its selector has been added to the list to exclude.

        equal(100, parseInt(node.style.left, 10), "child node is still left 100 because .someSelector is still filtered after container is changed");
        equal(100, parseInt(node.style.top, 10), "child node is still top 100 because .someSelector is still filtered after container is changed");


        _jsPlumb.removeDragFilter(".someSelector");

        support.dragNodeBy(node, 50,50); // should drag this time, as its selector has been added to the list to exclude.

        equal(150, parseInt(node.style.left, 10), "child node is left 150 after .someSelector filter removed");
        equal(150, parseInt(node.style.top, 10), "child node is top 150 after .someSelector filter removed");

    });

    /**
     * Add a CSS3 selector filter to the instance. It should then prevent anything with that selector from being draggable,
     * even if it would otherwise have been draggable.
     */
    test("filter in dragOptions (ignore drag at draggable level)", function() {

        reinit({
            dragOptions:{
                filter:".someSelector"
            }
        })

        var node = _addDiv("someNode", 50, 50);
        node.classList.add("someSelector");
        node.style.position = "absolute";
        _jsPlumb.manage(node);

        equal(50, parseInt(node.style.left, 10), "child node is left 50");
        equal(50, parseInt(node.style.top, 10), "child node is top 50");

        support.dragNodeBy(node, 50,50);

        equal(50, parseInt(node.style.left, 10), "child node is still left 50");
        equal(50, parseInt(node.style.top, 10), "child node is still top 50");

        _jsPlumb.removeDragFilter(".someSelector");

        support.dragNodeBy(node, 50,50); // should drag this time, as its selector has been added to the list to exclude.

        equal(100, parseInt(node.style.left, 10), "child node is left 150 after .someSelector filter removed");
        equal(100, parseInt(node.style.top, 10), "child node is top 150 after .someSelector filter removed");

    });

    test("filter on selector (ignore drag at selector level)", function() {
        expect(0);
        // not sure if this needs to be supported or not.
    });

    test("filter on selector, multiple selectors, one filters the event so the second one gets it", function() {
        expect(0);
        // not sure if this needs to be supported or not.
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





    // test(': draggable in nested element does not cause extra ids to be created', function () {
    //     var d = _addDiv("d1");
    //     var d2 = document.createElement("div");
    //     d2.setAttribute("foo", "ff");
    //     d.appendChild(d2);
    //     var d3 = document.createElement("div");
    //     d2.appendChild(d3);
    //     ok(d2.getAttribute("id") == null, "no id on d2");
    //     _jsPlumb.draggable(d);
    //     _jsPlumb.addEndpoint(d3);
    //     ok(d2.getAttribute("id") == null, "no id on d2");
    //     ok(d3.getAttribute("id") != null, "id on d3");
    // });
    //
    // test(" : draggable, reference elements returned correctly", function () {
    //     var d = _addDiv("d1");
    //     var d2 = document.createElement("div");
    //     d2.setAttribute("foo", "ff");
    //     d.appendChild(d2);
    //     var d3 = document.createElement("div");
    //     d3.setAttribute("id", "d3");
    //     d2.appendChild(d3);
    //     _jsPlumb.draggable(d);
    //     _jsPlumb.addEndpoint(d3);
    //     _jsPlumb.draggable(d3);
    //     // now check ref ids for element d1
    //     var els = _jsPlumb.dragManager.getElementsForDraggable("d1");
    //     ok(!jsPlumbUtil.isEmpty(els), "there is one sub-element for d1");
    //     ok(els["d3"] != null, "d3 registered");
    // });
    //
    //
    // test(" : draggable + setParent, reference elements returned correctly", function () {
    //     var d = _addDiv("d1");
    //     var d2 = document.createElement("div");
    //     d2.setAttribute("foo", "ff");
    //     d.appendChild(d2);
    //     var d3 = document.createElement("div");
    //     d3.setAttribute("id", "d3");
    //     d2.appendChild(d3);
    //     _jsPlumb.draggable(d);
    //     _jsPlumb.addEndpoint(d3);
    //     _jsPlumb.draggable(d3);
    //     // create some other new parent
    //     var d12 = support.addDiv("d12");
    //     // and move d3
    //     _jsPlumb.setParent(d3, d12);
    //
    //     // now check ref ids for element d1
    //     var els = _jsPlumb.dragManager.getElementsForDraggable("d1");
    //     ok(jsPlumbUtil.isEmpty(els), "there are no sub-elements for d1");
    //     var els12 = _jsPlumb.dragManager.getElementsForDraggable("d12");
    //     ok(!jsPlumbUtil.isEmpty(els12), "there is one sub-element for d12");
    //     ok(els12["d3"] != null, "d3 registered");
    // });

    test("drag multiple elements and ensure their connections are painted correctly at the end", function() {

        var d1 = support.addDiv ('d1', null, null,50, 50, 100, 100);
        var d2 = support.addDiv ('d2', null, null,250, 250, 100, 100);
        var d3 = support.addDiv ('d3', null, null,500, 500, 100, 100);

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

        var e1canvas = support.getEndpointCanvasPosition(e1),
            e2canvas = support.getEndpointCanvasPosition(e2),
            e3canvas = support.getEndpointCanvasPosition(e3);

        equal(e1canvas.x, 50 - (e1canvas.w/2), "endpoint 1 is at the right place");
        equal(e1canvas.y, 50 - (e1canvas.h/2), "endpoint 1 is at the right place");
        equal(e2canvas.x, 250 - (e2canvas.w/2), "endpoint 2 is at the right place");
        equal(e2canvas.y, 250 - (e2canvas.h/2), "endpoint 2 is at the right place");
        equal(e3canvas.x, 500 - (e3canvas.w/2), "endpoint 3 is at the right place");
        equal(e3canvas.y, 500 - (e3canvas.h/2), "endpoint 3 is at the right place");

        _jsPlumb.addToDragSelection(d1);
        _jsPlumb.addToDragSelection(d3);

        // drag node 2 by 750,750. we expect its endpoint to have moved too

        support.dragNodeTo(d2, 1000, 1000);

        equal(d2.offsetLeft, 1000, "div 2 is at the correct left position");
        equal(d2.offsetTop, 1000, "div 2 is at the correct top position");

        // TODO - drag selection
        // divs 1 and 3 have moved too, because they are in the drag selection make sure they are in the right place
        equal(d1.offsetLeft, 800, "div 1 is at the right left position");
        equal(d1.offsetTop, 800, "div 1 is at the right top position");
        equal(d3.offsetLeft, 1250, "div 3 is at the right left position");
        equal(d3.offsetTop, 1250, "div 3 is at the right top position");

        // check the endpoints
        e2canvas = support.getEndpointCanvasPosition(e2)
        equal(e2canvas.x, 1000 - (e2canvas.w/2), "endpoint 2 is at the right place");
        equal(e2canvas.y, 1000 - (e2canvas.h/2), "endpoint 2 is at the right place");

        // TODO - drag selection
        // equal(e1.canvas.offsetLeft, 750 - (e1.canvas.offsetWidth/2), "endpoint 1 is at the right place");
        // equal(e1.canvas.offsetTop, 750 - (e1.canvas.offsetHeight/2), "endpoint 1 is at the right place");
        //
        // equal(e3.canvas.offsetLeft, 1200 - (e3.canvas.offsetWidth/2), "endpoint 3 is at the right place");
        // equal(e3.canvas.offsetTop, 1200 - (e3.canvas.offsetHeight/2), "endpoint 3 is at the right place");

    });

    test("drag selection, add/remove", function() {

        var d1 = support.addDiv('d1', null, null, 50, 50, 100, 100);
        var d2 = support.addDiv('d2', null, null, 250, 250, 100, 100);
        var d3 = support.addDiv('d3', null, null, 500, 500, 100, 100);

        equal(_jsPlumb.dragSelection.length, 0, "drag selection is empty");

        _jsPlumb.addToDragSelection(d1);
        equal(_jsPlumb.dragSelection.length, 1, "drag selection has one element");
        _jsPlumb.addToDragSelection(d1);
        equal(_jsPlumb.dragSelection.length, 1, "drag selection still has one element");

        _jsPlumb.removeFromDragSelection(d1);
        equal(_jsPlumb.dragSelection.length, 0, "drag selection is now empty");

        _jsPlumb.addToDragSelection(d1, d2, d3);
        equal(_jsPlumb.dragSelection.length, 3, "drag selection has three elements");

        _jsPlumb.removeFromDragSelection(d1, d2);
        equal(_jsPlumb.dragSelection.length, 1, "drag selection has one element");

        _jsPlumb.removeFromDragSelection(d3);
        equal(_jsPlumb.dragSelection.length, 0, "drag selection has no elements");

        _jsPlumb.addToDragSelection(d1, d2, d3);
        equal(_jsPlumb.dragSelection.length, 3, "drag selection has three elements");

        _jsPlumb.clearDragSelection();
        equal(_jsPlumb.dragSelection.length, 0, "drag selection has no elements");
    });

    test("drag selection, css classes", function() {

        var d1 = support.addDiv('d1', null, null, 50, 50, 100, 100);
        var d2 = support.addDiv('d2', null, null, 250, 250, 100, 100);
        var d3 = support.addDiv('d3', null, null, 500, 500, 100, 100);

        equal(_jsPlumb.dragSelection.length, 0, "drag selection is empty");

        _jsPlumb.addToDragSelection(d1);
        equal(_jsPlumb.dragSelection.length, 1, "drag selection has one element");

        ok(_jsPlumb.hasClass(d1, "jtk-drag-selected"), "selected class added to element");

        _jsPlumb.clearDragSelection();
        ok(!_jsPlumb.hasClass(d1, "jtk-drag-selected"), "selected class removed from element");
    });

    test("drag selection, unmanage event removes from selection", function() {

        var d1 = support.addDiv('d1', null, null, 50, 50, 100, 100);
        var d2 = support.addDiv('d2', null, null, 250, 250, 100, 100);
        var d3 = support.addDiv('d3', null, null, 500, 500, 100, 100);

        equal(_jsPlumb.dragSelection.length, 0, "drag selection is empty");

        _jsPlumb.addToDragSelection(d1);
        equal(_jsPlumb.dragSelection.length, 1, "drag selection has one element");
        ok(_jsPlumb.hasClass(d1, "jtk-drag-selected"), "selected class added to element");

        _jsPlumb.unmanage(d1);
        ok(_jsPlumb.dragSelection.length === 0, "drag selection empty");
        ok(!_jsPlumb.hasClass(d1, "jtk-drag-selected"), "selected class removed from element");
    });

    test("drag selection, instance destroy clears selection", function() {

        var d1 = support.addDiv('d1', null, null, 50, 50, 100, 100);
        var d2 = support.addDiv('d2', null, null, 250, 250, 100, 100);
        var d3 = support.addDiv('d3', null, null, 500, 500, 100, 100);

        equal(_jsPlumb.dragSelection.length, 0, "drag selection is empty");

        _jsPlumb.addToDragSelection(d1);
        equal(_jsPlumb.dragSelection.length, 1, "drag selection has one element");
        ok(_jsPlumb.hasClass(d1, "jtk-drag-selected"), "selected class added to element");

        _jsPlumb.destroy();

        ok(_jsPlumb.dragSelection.length === 0, "drag selection empty");
        ok(!_jsPlumb.hasClass(d1, "jtk-drag-selected"), "selected class removed from element");
    });

    // ----------------------- draggables and drag groups ----------------------------------------------------

    test("dragging works", function() {
        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

         // should not be necessary
        _jsPlumb.manage(d);

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(parseInt(d.style.left, 10), 150);
        equal(parseInt(d.style.top, 10), 150);
    });

    test("dragging multiple elements works", function() {

        reinit({
            dragOptions:{
                stop:function() {
                    console.log(arguments)
                }
            }
        });

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        var d2 = _addDiv("d2");
        d2.style.position = "absolute";
        d2.style.left = "350px";
        d2.style.top = "350px";
        d2.style.width = "100px";
        d2.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);
        _jsPlumb.manage(d2);

        _jsPlumb.addToDragSelection(d2)

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element d");
             //   ok(d2.classList.contains("jtk-drag"), "drag class set on element d2");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element d");
               // ok(!d2.classList.contains("jtk-drag"), "drag class no longer set on element d2");
            }
        });

        equal(parseInt(d.style.left, 10), 150);
        equal(parseInt(d.style.top, 10), 150);

        equal(parseInt(d2.style.left, 10), 450);
        equal(parseInt(d2.style.top, 10), 450);
    });

    test("dragging does not happen with `data-jtk-not-draggable` attribute set", function() {
        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";
        d.setAttribute("data-jtk-not-draggable", true);

         // should not be necessary
        _jsPlumb.manage(d);

        equal(parseInt(d.style.left, 10), 50);
        equal(parseInt(d.style.top, 10), 50);

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class not set on element during drag attempt");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class not set on element after drag attempt");
            }
        });

        equal(parseInt(d.style.left, 10), 50);
        equal(parseInt(d.style.top, 10), 50);
    });

    test("dragging does happen with `data-jtk-not-draggable='false'` attribute set", function() {
        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";
        d.setAttribute("data-jtk-not-draggable", "false");

         // should not be necessary
        _jsPlumb.manage(d);

        equal(parseInt(d.style.left, 10), 50);
        equal(parseInt(d.style.top, 10), 50);

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element during drag");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class not set on element after drag");
            }
        });

        equal(parseInt(d.style.left, 10), 150);
        equal(parseInt(d.style.top, 10), 150);
    });

    test("dragging does not happen when jsplumb instance created with `elementsDraggable:false`", function() {

        reinit({elementsDraggable:false});

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        support.dragNodeBy(d, 100, 100);

        equal(parseInt(d.style.left, 10), 50);
        equal(parseInt(d.style.top, 10), 50);

    });

    test("dragging does not happen when jsplumb instance has `elementsDraggable` set to false", function() {

        _jsPlumb.elementsDraggable = false;

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        support.dragNodeBy(d, 100, 100);

        equal(parseInt(d.style.left, 10), 50, "drag element has not moved in x axis");
        equal(parseInt(d.style.top, 10), 50, "drag element has not moved in y axis");

        // now set elements to be draggable and test again
        _jsPlumb.elementsDraggable = true;

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element during drag");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class not set on element after drag");
            }
        });

        equal(parseInt(d.style.left, 10), 150, "drag element has moved in x axis");
        equal(parseInt(d.style.top, 10), 150, "drag element has moved in y axis");
    });

    test("dragging, grid", function() {

        reinit({
            dragOptions:{
                grid:{w:50, h:50}
            }
        });

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by 26, 26. it should be snapped to 50,50 by the grid, because the default snap threshold is
        // > half of the grid size in each axis.
        support.dragNodeBy(d, 26, 26);

        equal(parseInt(d.style.left, 10), 100);
        equal(parseInt(d.style.top, 10), 100);
    });

    test("dragging, lifecycle events", function() {

        var start = false, beforeStart = false, drag = false, stop = false;

        reinit({
            dragOptions:{
                start:(p) => start = true,
                beforeStart:(p) => beforeStart = true,
                drag:(p) => drag = true,
                stop:(p) => stop = true
            }
        });

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by 26, 26. it should be snapped to 50,50 by the grid, because the default snap threshold is
        // > half of the grid size in each axis.
        support.dragNodeBy(d, 26, 26);

        equal(start, true, "start event fired")
        equal(beforeStart, true, "beforeStart event fired")
        equal(drag, true, "drag event fired")
        equal(stop, true, "stop event fired")
    });

    test("dragging, start event should not override disabled element (issue 1100)", function() {

        var start = false, beforeStart = false, drag = false, stop = false;

        reinit({
            dragOptions:{
                start:(p) => start = true
            }
        });

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        _jsPlumb.manage(d);

        _jsPlumb.setDraggable(d, false)

        // try to drag; it should not happen
        support.dragNodeBy(d, 26, 26);

        // our custom start handler should not be called
        equal(start, false, "start event not fired")

        // the element should not have moved
        equal(50, parseInt(d.style.left, 10), "left position unchanged as no drag occurred")
        equal(50, parseInt(d.style.top, 10), "top position unchanged as no drag occurred")

        // set draggable and try again
        _jsPlumb.setDraggable(d, true)

        support.dragNodeBy(d, 26, 26);

        // our custom start handler was invoked
        equal(start, true, "start event fired")

        // the element was moved.
        equal(76, parseInt(d.style.left, 10), "left position changed ")
        equal(76, parseInt(d.style.top, 10), "top position changed")
    });

    test("dragging, grid, change at runtime, including set to null", function() {

        reinit({
            dragOptions:{
                grid:{w:50, h:50}
            }
        });

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by 26, 26. it should be snapped to 10,100 by the grid, because the default snap threshold is
        // > half of the grid size in each axis.
        support.dragNodeBy(d, 26, 26);

        equal(parseInt(d.style.left, 10), 100, "node left snapped to 100 by 50,50 grid after moving 26 px from 50");
        equal(parseInt(d.style.top, 10), 100, "node top snapped to 100 by 50,50 grid after moving 26px from 50");

        _jsPlumb.setDragGrid({w:20,h:20})
        // drag by just over half the new grid size.  should snap now to the new grid, as the previous grid was larger
        // and would have snapped the element back to where it was.
        support.dragNodeBy(d, 11, 11);
        equal(parseInt(d.style.left, 10), 120, "node left snapped to 120 by 20,20 grid after moving 11px from 100");
        equal(parseInt(d.style.top, 10), 120, "node top snapped to 120 by 20,20 grid after moving 11px from 100");

        _jsPlumb.setDragGrid(null)
        // drag by just over half the new grid size.  should snap now to the new grid, as the previous grid was larger
        // and would have snapped the element back to where it was.
        support.dragNodeBy(d, 11, 11);
        equal(parseInt(d.style.left, 10), 131, "node left changed to 131 after moving 11px from 120, grid was cleared");
        equal(parseInt(d.style.top, 10), 131, "node top changed to 131 after moving 11px from 120, grid was cleared");
    });

    /**
     * Test constraining drag so that a child node cannot be dragged into the negative on either axis
     */
    test("dragging, constrain to not negative", function() {

        reinit({
            dragOptions:{
                containment:"notNegative"
            }
        });

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by -150, -150. it should not be dragged into negative in either axis, instead staying at 0,0
        support.dragNodeBy(d, -150, -150);

        equal(parseInt(d.style.left, 10), 0);
        equal(parseInt(d.style.top, 10), 0);

        support.dragNodeBy(d, 1000, 1000);
        equal(parseInt(d.style.left, 10), 1000);
        equal(parseInt(d.style.top, 10), 1000);
    });

    /**
     * Test constraining drag so that a child node cannot be dragged into the negative on either axis OR entirely out of the visible portion of the parent element.
     */
    test("dragging, constrain to parent, not negative, partial enclosure in positive axis ok, use default containmentPadding value", function() {

        reinit({
            dragOptions:{
                containment:"parent"
            }
        });

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        var d = _addDiv("d1", 50, 50, 100, 100);

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by -150, -150. it should not be dragged into negative in either axis, instead staying at 0,0
        support.dragNodeBy(d, -150, -150);

        equal(parseInt(d.style.left, 10), 0);
        equal(parseInt(d.style.top, 10), 0);

        // try to drag the node right out of the parent viewport (note: massively out in X, only slightly out in Y, but both situations count)
        support.dragNodeBy(d, 550, 460);

        // should be placed so that at least some of the node is visible  in X - `padding` pixels (for which see the next test; the default is 5)
        // in Y some is still visible so no adjustment
        equal(parseInt(d.style.left, 10), 495);
        equal(parseInt(d.style.top, 10), 460);

        // but if we drag down by 50 it will go out of the viewport, and then Y should be set t0 495: height - padding
        support.dragNodeBy(d, 0, 50);

        equal(parseInt(d.style.left, 10), 495);
        equal(parseInt(d.style.top, 10), 495);

    });

    /**
     * Test constraining drag so that a child node cannot be dragged into the negative on either axis OR entirely out of the visible portion of the parent element.
     */
    test("dragging, constrain to parent, not negative, partial enclosure in positive axis ok, supply our own containmentPadding value", function() {

        reinit({
            dragOptions:{
                containment:"parent",
                containmentPadding:10
            }
        });

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by -150, -150. it should not be dragged into negative in either axis, instead staying at 0,0
        support.dragNodeBy(d, -150, -150);

        equal(parseInt(d.style.left, 10), 0);
        equal(parseInt(d.style.top, 10), 0);

        // try to drag the node right out of the parent viewport (note: massively out in X, only slightly out in Y, but both situations count)
        support.dragNodeBy(d, 550, 460);

        // should be placed so that at least some of the node is visible  in X - `containmentPadding` pixels, which we have overriden from the default in this test
        // in Y some is still visible so no adjustment
        equal(parseInt(d.style.left, 10), 490);
        equal(parseInt(d.style.top, 10), 460);

        // but if we drag down by 50 it will go out of the viewport, and then Y should be set t0 495: height - padding
        support.dragNodeBy(d, 0, 50);

        equal(parseInt(d.style.left, 10), 490);
        equal(parseInt(d.style.top, 10), 490);

    });

    test("dragging, constrain to parent, not negative, fully enclosed in positive axis", function() {

        reinit({
            dragOptions:{
                containment:"parentEnclosed"
            }
        });

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by -150, -150. it should not be dragged into negative in either axis, instead staying at 0,0
        support.dragNodeBy(d, -150, -150);

        equal(parseInt(d.style.left, 10), 0);
        equal(parseInt(d.style.top, 10), 0);

        // try to drag the node right out of the parent viewport (note: massively out in X, only slightly out in Y, but both situations count)
        support.dragNodeBy(d, 550, 460);

        // should be placed so that all of the node is visible  in X and Y
        // in Y some is still visible so no adjustment
        equal(parseInt(d.style.left, 10), 400);
        equal(parseInt(d.style.top, 10), 400);

    });

    /**
     * Test constraining drag via a function
     */
    test("dragging, constrain function", function() {

        reinit({
            dragOptions:{
                // for any input, return x/2, y/2 as the allowed loc.
                constrainFunction:function(desiredLocation) {
                    return { x:desiredLocation.x / 2, y:desiredLocation.y / 2}
                }
            }
        });

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by -150, -150. it should not be dragged into negative in either axis, instead staying at 0,0
        support.dragNodeBy(d, -150, -150);

        equal(parseInt(d.style.left, 10), -50);
        equal(parseInt(d.style.top, 10), -50);

        // try to drag the node right out of the parent viewport (note: massively out in X, only slightly out in Y, but both situations count)
        support.dragNodeBy(d, 550, 460);

        // should be placed where the entire node is visible in both axes
        equal(parseInt(d.style.left, 10), 250);
        equal(parseInt(d.style.top, 10), 205);
    });

    /**
     * Test constraining drag via a function
     */
    test("dragging, constrain function returns null means element does not move", function() {

        reinit({
            dragOptions:{
                // only move when desired location x value is 200 or more
                constrainFunction:function(desiredLocation) {
                    if (desiredLocation.x < 200) {
                        return null
                    } else {
                        return desiredLocation
                    }
                }
            }
        });

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by 100, 100: should not move, as the constraint function returns null when desired x is less than 200
        support.dragNodeBy(d, 100, 100);

        equal(parseInt(d.style.left, 10), 50);
        equal(parseInt(d.style.top, 10), 50);

        support.dragNodeBy(d, 550, 550);

        // should be placed where the entire node is visible in both axes
        equal(parseInt(d.style.left, 10), 600);
        equal(parseInt(d.style.top, 10), 600);
    });

    /**
     * Test constraining drag via a function
     */
    test("dragging, constrain function returns null (for drag element) means all elements in drag selection do not move", function() {

        reinit({
            dragOptions:{
                // only move when desired location x value is 200 or more
                constrainFunction:function(desiredLocation) {
                    if (desiredLocation.x < 200) {
                        return null
                    } else {
                        return desiredLocation
                    }
                }
            }
        });

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        var d2 = _addDiv("d2");
        d2.style.position = "absolute";
        d2.style.left = "450px";
        d2.style.top = "450px";
        d2.style.width = "100px";
        d2.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);
        _jsPlumb.manage(d2);

        _jsPlumb.addToDragSelection(d2)

        // drag node by 100, 100: should not move, as the constraint function returns null when desired x is less than 200
        support.dragNodeBy(d, 100, 100);

        equal(parseInt(d.style.left, 10), 50, "d1 hasnt moved in X as the constrain function returned null");
        equal(parseInt(d.style.top, 10), 50, "d1 hasnt moved in Yas the constrain function returned null");

        equal(parseInt(d2.style.left, 10), 450, "d2 hasnt moved in X as the constrain function returned null (for d1, but nothing should move)");
        equal(parseInt(d2.style.top, 10), 450, "d2 hasnt moved in Yas the constrain function returned null");

        support.dragNodeBy(d, 550, 550);

        // should be placed where the entire node is visible in both axes
        equal(parseInt(d.style.left, 10), 600, "d1 has now moved in X as the constrain function allowed it");
        equal(parseInt(d.style.top, 10), 600, "d1 has now moved in Y as the constrain function allowed it");

        equal(parseInt(d2.style.left, 10), 1000, "d2 has now moved in X as the constrain function allowed it");
        equal(parseInt(d2.style.top, 10), 1000, "d2 has now moved in Y as the constrain function allowed it");
    });

    /**
     * Test constraining drag via a function
     */
    test("dragging, revert function", function() {

        reinit({
            dragOptions:{
                // revert drag if X is 100
                revertFunction:function(el, pos) {
                    return pos.x === 100
                }
            }
        });

        _jsPlumb.getContainer().style.width = "500px"
        _jsPlumb.getContainer().style.height = "500px"

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        // should not be necessary
        _jsPlumb.manage(d);

        // drag node by 50, 50. this will result in x=100, which will cause the revert function to return true, and the node will be reverted.
        support.dragNodeBy(d, 50, 50);

        equal(parseInt(d.style.left, 10), 50);
        equal(parseInt(d.style.top, 10), 50);

        // drag to a place where x != 100; the revert function will return false
        support.dragNodeBy(d, 100, 100);

        equal(parseInt(d.style.left, 10), 150);
        equal(parseInt(d.style.top, 10), 150);
    });


    //*/

    // test("snap elements, default threshold", function() {
    //
    //     var d = _addDiv("d1");
    //     d.style.position = "absolute";
    //     d.style.left = "23px";
    //     d.style.top = "23px";
    //     d.style.width = "100px";
    //     d.style.height = "100px";
    //
    //     // should not be necessary
    //     _jsPlumb.manage(d);
    //
    //     // snap the element to the snapThreshold given above. it's currently at 23, 23; it should be snaped to 0,0
    //     _jsPlumb.snap(d)
    //
    //     equal(parseInt(d.style.left, 10), 0);
    //     equal(parseInt(d.style.top, 10), 0);
    //
    //     // drag to 76, 76
    //     support.dragNodeBy(d, 76, 76);
    //
    //     // snap again. should move to 100,100 now
    //     _jsPlumb.snap(d)
    //
    //     equal(parseInt(d.style.left, 10), 100);
    //     equal(parseInt(d.style.top, 10), 100);
    //
    // });
    //
    // test("dragging, snap, snapThreshold", function() {
    //
    //     reinit({
    //         dragOptions:{
    //             snapThreshold:5
    //         }
    //     });
    //
    //     var d = _addDiv("d1");
    //     d.style.position = "absolute";
    //     d.style.left = "23px";
    //     d.style.top = "23px";
    //     d.style.width = "100px";
    //     d.style.height = "100px";
    //
    //     // should not be necessary
    //     _jsPlumb.manage(d);
    //
    //     // snap the element to the snapThreshold given above. it's currently at 23, 23; it should be snaped to 25,25
    //     _jsPlumb.snap(d)
    //
    //     equal(parseInt(d.style.left, 10), 0);
    //     equal(parseInt(d.style.top, 10), 0);
    //
    //     // drag to 86, 86
    //     support.dragNodeBy(d, 51, 51);
    //
    //     // snap again. should move to 85, 85 now
    //     _jsPlumb.snap(d)
    //
    //     equal(parseInt(d.style.left, 10), 85);
    //     equal(parseInt(d.style.top, 10), 85);
    // });

/* ------------------------------------ DRAG GROUPS --------------------------------------------- */

    //*
    test("dragging a drag group works, elements as argument", function() {

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";

        var d2 = _addDiv("d2");
        d2.style.position = "absolute";
        d2.style.left = "450px";
        d2.style.top = "450px";

         // should not be necessary
        _jsPlumb.manage(d);
        _jsPlumb.manage(d2);

        _jsPlumb.addToDragGroup("DragGroup", d, d2);

        var checkedElementsLength = false
        _jsPlumb.bind("drag:stop", function(p) {
            if (!checkedElementsLength) {
                equal(p.elements.length, 2, "there are 2 elements in the list of elements that were dragged")
                checkedElementsLength = true
            }
        })

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(150, parseInt(d.style.left, 10), "d has moved left by 100");
        equal(150, parseInt(d.style.top, 10), "d has moved top by 100");

        equal(550, parseInt(d2.style.left, 10), "d2 has moved left by 100");
        equal(550, parseInt(d2.style.top, 10), "d2 has moved top by 100");

        _jsPlumb.removeFromDragGroup(d2);
        support.dragNodeBy(d, -100, -100);

        equal(50, parseInt(d.style.left, 10));
        equal(50, parseInt(d.style.top, 10));

        equal(550, parseInt(d2.style.left, 10));
        equal(550, parseInt(d2.style.top, 10));
    });

    test("dragging a DragGroup works, then set element passive, dragging disabled.", function() {

        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";

        var d2 = _addDiv("d2");
        d2.style.position = "absolute";
        d2.style.left = "450px";
        d2.style.top = "450px";

        // should not be necessary
        _jsPlumb.manage(d);
        _jsPlumb.manage(d2);

        _jsPlumb.addToDragGroup("dragGroup", d, d2);

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(150, parseInt(d.style.left, 10), "d has moved left by 100");
        equal(150, parseInt(d.style.top, 10), "d has moved top by 100");

        equal(550, parseInt(d2.style.left, 10), "d2 has moved left by 100");
        equal(550, parseInt(d2.style.top, 10), "d2 has moved top by 100");

        _jsPlumb.setDragGroupState(false, d);
        support.dragNodeBy(d, 100, 100);
        equal(250, parseInt(d.style.left, 10), "d has moved further left by 100");
        equal(250, parseInt(d.style.top, 10), "d has moved further top by 100");

        equal(550, parseInt(d2.style.left, 10), "d2 has not moved this time");
        equal(550, parseInt(d2.style.top, 10), "d2 has not moved this time");

        _jsPlumb.setDragGroupState(true, d);
        support.dragNodeBy(d, 100, 100);
        equal(350, parseInt(d.style.left, 10), "d has moved further left by 100");
        equal(350, parseInt(d.style.top, 10), "d has moved further top by 100");

        equal(650, parseInt(d2.style.left, 10), "d2 has moved further left by 100");
        equal(650, parseInt(d2.style.top, 10), "d2 has further top by 100");

    });


    test("dragging a drag group works, elements as argument", function() {
        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";

        var d2 = _addDiv("d2");
        d2.style.position = "absolute";
        d2.style.left = "450px";
        d2.style.top = "450px";

        _jsPlumb.manageAll([d,d2]);
        _jsPlumb.addToDragGroup("dragGroup", d, d2);

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(150, parseInt(d.style.left, 10));
        equal(150, parseInt(d.style.top, 10));

        equal(550, parseInt(d2.style.left, 10));
        equal(550, parseInt(d2.style.top, 10));

        _jsPlumb.removeFromDragGroup(d2);
        support.dragNodeBy(d, -100, -100);

        equal(50, parseInt(d.style.left, 10));
        equal(50, parseInt(d.style.top, 10));

        equal(550, parseInt(d2.style.left, 10));
        equal(550, parseInt(d2.style.top, 10));
    });




    /* ------------------ node/group drag events --------------------------------------------------*/

    test("drag events", function() {
        var d = _addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

         // should not be necessary
        _jsPlumb.manage(d);

        var nodeDragged = null, pos = null, evt = null, dragStarted = false, dragStopped = false;
        _jsPlumb.bind("drag:move", function(p) {
            nodeDragged = p.el;
            pos = p.pos;
            evt = p.e;
        });
        _jsPlumb.bind("drag:start", function() { dragStarted = true; });
        _jsPlumb.bind("drag:stop", function() { dragStopped = true; });

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(parseInt(d.style.left, 10), 150);
        equal(parseInt(d.style.top, 10), 150);

        // test event fired
        equal(150, pos.x, "event x position correct");
        equal(150, pos.y, "event y position correct");
        equal(d, nodeDragged, "event el correct");
        ok(evt != null, "event original event was supplied");
        ok(dragStarted, "drag start event was fired");
        ok(dragStopped, "drag stop event was fired");
    });

    /**
     * Tests the behaviour of element dragging when the document is scrolled during the drag. The element's position should
     * be adjusted to account for the scroll delta.
     */
    //*/
    asyncTest("dragging, parent container scrolled during drag", function() {
        window.scrollTo(0,0)
        // debugger
        var d = _addDiv("d1");

        d.style.left = "50px";
        d.style.top = "50px";
        d.style.width = "100px";
        d.style.height = "100px";

        var c = _jsPlumb.getContainer();
        c.style.position = "relative"
        c.style.outline = "1px solid"
        c.style.height = "2500px"
        c.style.width = "500px"

        c.appendChild(d)

        var d2 = _addDiv("d2");
        d2.style.left = "50px";
        d2.style.top="auto"
        d2.style.bottom = "100px";
        d2.style.width = "100px";
        d2.style.height = "100px";
        d2.style.outline="10px solid blue"

        _jsPlumb.manage(d);

        var scrollAtStart = document.documentElement.scrollTop

        support.aSyncDragNodeBy(d, 100, 100, {


            beforeMouseUp:function() {
                d2.scrollIntoView()
                QUnit.start()
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
                QUnit.stop()
            },
            after:function() {
                var scrollDelta = Math.floor(document.documentElement.scrollTop - scrollAtStart)
                QUnit.start()
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
                equal(Math.floor(parseInt(d.style.left, 10)), 150);
                equal(Math.floor(parseInt(d.style.top, 10)), 150 + scrollDelta);
            }
        });


    });
    //*/

    /**
     * Tests the behaviour of element dragging when the document is scrolled during the drag. The element's position should
     * be adjusted to account for the scroll delta.
     */
    asyncTest("connection dragging, parent container scrolled during drag", function() {
        // debugger
         window.scrollTo(0,0)
        var d = _addDiv("d1", 50, 50, 100, 100);
        d.style.outline = "10px solid green"

        var c = _jsPlumb.getContainer();
       c.style.outline = "1px solid"
        c.style.height = "2500px"
        c.style.width = "500px"

        var d2 = _addDiv("d2");
        d2.style.left = "50px";
        d2.style.top="auto"
        d2.style.bottom = "100px";
        d2.style.width = "100px";
        d2.style.height = "100px";
        d2.style.outline="10px solid blue"

        _jsPlumb.importDefaults({
            elementsDraggable:false
        })

        _jsPlumb.manage(d);
        _jsPlumb.manage(d2);

        _jsPlumb.addSourceSelector("#d1")
        _jsPlumb.addTargetSelector("#d2")

        var scrollAtStart = document.documentElement.scrollTop

        support.aSyncDragConnection(d, d2, {
            beforeMouseUp:function() {
                d2.scrollIntoView()
            },
            after:function(conn) {
                var scrollDelta = document.documentElement.scrollTop - scrollAtStart
                QUnit.start()
                ok(conn != null, "connection was established")
            }
        })


    });

    // /**
    //  * Tests the behaviour of element dragging when the document is scrolled during the drag. The element's position should
    //  * be adjusted to account for the scroll delta.
    //  */
    // asyncTest("connection dragging, jsplumb container scrolled during drag", function() {
    //     // debugger
    //     window.scrollTo(0,0)
    //     var d = _addDiv("d1", 50, 50, 100, 100);
    //     d.style.outline = "10px solid green"
    //
    //     var c = _jsPlumb.getContainer();
    //     c.style.outline = "1px solid"
    //     c.style.height = "300px"
    //     c.style.width = "500px"
    //     c.style.overflow = "auto"
    //
    //     var d2 = _addDiv("d2");
    //     d2.style.left = "250px";
    //     d2.style.top="700px"
    //     d2.style.width = "100px";
    //     d2.style.height = "100px";
    //     d2.style.outline="10px solid blue"
    //
    //     var d3 = _addDiv("d3", 450, 150, 100, 100);
    //     d3.style.outline = "10px solid red"
    //
    //     _jsPlumb.importDefaults({
    //         elementsDraggable:false
    //     })
    //
    //     _jsPlumb.manage(d);
    //     _jsPlumb.manage(d2);
    //     _jsPlumb.manage(d3);
    //
    //     _jsPlumb.addSourceSelector("#d1")
    //     _jsPlumb.addTargetSelector("#d2")
    //
    //     var scrollAtStart = _jsPlumb.getContainer().scrollTop
    //
    //     support.aSyncDragConnection(d, d2, {
    //         beforeMouseMove:function() {
    //             d2.scrollIntoView()
    //         },
    //         after:function(conn) {
    //             var scrollDelta = _jsPlumb.getContainer().scrollTop - scrollAtStart
    //             QUnit.start()
    //             ok(conn != null, "connection was established")
    //         }
    //     })
    //
    //
    // });

};

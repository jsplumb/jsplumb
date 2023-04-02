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

var testSuite = function () {

    module("jsPlumb", {
        teardown: function () {
            support.cleanup();
            removeContainer()
        },
        setup: function () {
            makeContainer()
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });


    // ------------------------------- manage -----------------------------------------

    test("Manage adds data-jtk-managed attribute (and defaults to element's `id` if set), and removes it on unmanage", function() {
        var d1 = support.addDiv("d1"), f1 = false;

        _jsPlumb.manage(d1);
        equal(d1.getAttribute("data-jtk-managed"), "d1", "d1 is marked data-jtk-managed, using its id value");
        _jsPlumb.unmanage(d1);
        ok(d1.getAttribute("data-jtk-managed") == null, "d1 is no longer marked data-jtk-managed");
    });

    test("Manage adds data-jtk-managed attribute (and generates a value if `id` not set)", function() {
        var d1 = support.addDiv("d1"), f1 = false;
        d1.id = null

        _jsPlumb.manage(d1);
        notEqual(d1.getAttribute("data-jtk-managed"), "d1", "d1 is marked data-jtk-managed, using its id value");
        _jsPlumb.unmanage(d1);
        ok(d1.getAttribute("data-jtk-managed") == null, "d1 is no longer marked data-jtk-managed");
    });

    test("Manage supports optional internal id", function() {
        var d1 = support.addDiv("d1"), f1 = false;

        _jsPlumb.manage(d1, "foo");
        equal(d1.getAttribute("data-jtk-managed"), "foo", "data-jtk-managed attribute set per value passed in to manage method");

        _jsPlumb.unmanage(d1);
        ok(d1.getAttribute("data-jtk-managed") == null, "d1 is no longer marked data-jtk-managed");
        ok(d1.getAttribute("data-jtk-managed") == null, "d1 no longer has data-jtk-managed attribute");
    });

    test("manageAll, with array, adds data-jtk-managed attribute", function() {
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv("d2");

        _jsPlumb.manageAll([d1, d2]);
        ok(d1.getAttribute("data-jtk-managed") != null, "d1 is marked data-jtk-managed");
        ok(d2.getAttribute("data-jtk-managed") != null, "d2 is marked data-jtk-managed");
        _jsPlumb.unmanage(d1);
        ok(d1.getAttribute("data-jtk-managed") == null, "d1 is no longer marked data-jtk-managed");
    });

    test("manageAll, with NodeList, adds data-jtk-managed attribute", function() {
        var d1 = support.addDiv("d1", null, "foo"),
            d2 = support.addDiv("d2", null, "foo"),
            nl = document.querySelectorAll(".foo");

        _jsPlumb.manageAll(nl);
        ok(d1.getAttribute("data-jtk-managed") != null, "d1 is marked data-jtk-managed");
        ok(d2.getAttribute("data-jtk-managed") != null, "d2 is marked data-jtk-managed");
    });

    test("manageAll, with CSS selector, adds data-jtk-managed attribute", function() {
        var d1 = support.addDiv("d1", null, "foo"),
            d2 = support.addDiv("d2", null, "foo");

        _jsPlumb.manageAll(".foo");
        ok(d1.getAttribute("data-jtk-managed") != null, "d1 is marked data-jtk-managed");
        ok(d2.getAttribute("data-jtk-managed") != null, "d2 is marked data-jtk-managed");
    });

    test("manageAll, with CSS ID selector, adds data-jtk-managed attribute", function() {
        var d1 = support.addDiv("d1", null, "foo");

        _jsPlumb.manageAll("#d1");
        ok(d1.getAttribute("data-jtk-managed") != null, "d1 is marked data-jtk-managed");
    });

    test("jsPlumb.lineIntersection", function () {
        var i = jsPlumb.lineIntersection([{x:592,y:197}, {x:692,y:197}], [{x:642,y:157},{x:608.35,y:745.10423240126}])
        equal(i.y, 197, "intersection crosses at y = 197")
        var i2 = jsPlumb.lineIntersection([{x:592,y:197}, {x:692,y:197}], [{x:642,y:157},{x:608.35,y:745.1042324012622}])
        equal(i2.y, 197, "intersection crosses at y = 197")


    })

    test("Rectangle/line intersection", function() {
        var r = {x: 211, y: 8.04, w: 100, h: 80}
        var l = [{x: 304, y: 204}, {x: 261, y: 48.04}]

        var i = jsPlumb.lineRectangleIntersection(l, r)[0]
        ok(i != null)

        var l2 = [{x: 106.9, y: 40.355}, {x: 104.1, y: 159}]

        // center: {x: 106.9, y: 40.355}
        var r2 = {h: 80, w: 100, x: 56.9, y: 0.355}

        var i2 = jsPlumb.lineRectangleIntersection(l2, r2)[0]
        ok(i2 != null)

        var r3 = {h: 80,w: 100,x: 653,y: 683}
        var l3 =  [{x: 412, y: 105.8},{x: 703, y: 723}]

        var i3 = jsPlumb.lineRectangleIntersection(l3, r3)[0]
        ok(i3 != null)

        var r4 = {x: 13.5, y: 99.3, w: 100, h: 80}
        var l4 = [{x: 63.5, y: 139.3}, {x: 610, y: 140}]

        var i4 = jsPlumb.lineRectangleIntersection(l4, r4)[0]
        ok(i4 != null)
    })

    // asyncTest("element with data-jtk-managed attribute set is automatically managed", function() {
    //     _jsPlumb.bind("manageElement", function(p) {
    //         QUnit.start()
    //         equal(p.el, d1, "element was automatically managed via mutation observer")
    //     })
    //
    //     var d1 = support.addDiv("d1", null, "foo");
    //     d1.setAttribute("data-jtk-managed", "d1")
    // })
    //
    // asyncTest("element with data-jtk-managed attribute set is automatically removed from manage list when removed from dom", function() {
    //
    //     let addCount = 0, removeCount = 0
    //
    //     _jsPlumb.bind("unmanageElement", function(p) {
    //         removeCount++
    //         QUnit.start()
    //         ok(true,"unmanage event was called")
    //
    //         equal(removeCount, 1, "1 remove event fired")
    //         equal(addCount, 1, "1 add event fired")
    //     });
    //
    //     _jsPlumb.bind("manageElement", function(p) {
    //         addCount++
    //         equal(p.el, d1, "element was automatically managed via mutation observer")
    //         QUnit.stop()
    //         d1.parentNode.removeChild(d1)
    //     })
    //
    //     QUnit.start()
    //
    //     var d1 = support.addDiv("d1", null, "foo");
    //     d1.setAttribute("data-jtk-managed", "d1")
    // })
    //
    // asyncTest("data-jtk-managed attribute set is automatically managed, the attribute is changed, and jsplumb tracks the change", function() {
    //     _jsPlumb.bind("manageElement", function(p) {
    //         equal(p.el, d1, "element was automatically managed via mutation observer")
    //
    //         d1.setAttribute("data-jtk-managed", "newValue")
    //         QUnit.stop()
    //
    //         setTimeout(function() {
    //             QUnit.start()
    //             ok(_jsPlumb.getManagedElement("d1"), null, "d1 is not the ID used to register the element any more")
    //             ok(_jsPlumb.getManagedElement("newValue"), null, "newValue now the ID used to register the element")
    //         })
    //     })
    //
    //     QUnit.start()
    //     var d1 = support.addDiv("d1", null, "foo");
    //     d1.setAttribute("data-jtk-managed", "d1")
    // })

    // issue 190 - regressions with getInstance.  these tests ensure that generated ids are unique across
// instances.
    // AS OF 5.x (in fact probably 4.x) ID clashes dont matter, as jsplumb now uses the `data-jtk-managed` attribute,
    // and as long as those are unique within each instance's container there is no problem.

    // test(" id clashes between instances", function () {
    //     var foo = document.createElement("div");
    //     document.body.appendChild(foo);
    //     var d1 = support.addDiv("d1"),
    //         _jsp2 = jsPlumbBrowserUI.newInstance({container:foo}),
    //         support2 = jsPlumbTestSupport.getInstanceQUnit(_jsp2),
    //         d2 = support2.addDiv("d2");
    //
    //     d1.removeAttribute("data-jtk-managed");
    //     d2.removeAttribute("data-jtk-managed");
    //
    //     _jsPlumb.addEndpoint(d1);
    //     _jsp2.addEndpoint(d2);
    //
    //     var id1 = d1.getAttribute("data-jtk-managed"),
    //         id2 = d2.getAttribute("data-jtk-managed");
    //
    //     var idx = id1.indexOf("-"), idx2 = id1.lastIndexOf("-"), v1 = id1.substring(idx, idx2);
    //     var idx3 = id2.indexOf("-"), idx4 = id2.lastIndexOf("-"), v2 = id2.substring(idx3, idx4);
    //
    //     ok(v1 != v2, "instance versions are different : " + v1 + " : " + v2);
    //
    //     support2.cleanup();
    //     foo.parentNode.removeChild(foo);
    // });

    test("no options provided to connector (issue 1129)", function() {
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({
            source:d1,
            target:d2,
            connector:{
                type:"Bezier"
            }
        })

        ok(c != null, "connection established when no options set")
    })

    test("ensure stroke width is set (issue 1133)", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2")

        _jsPlumb.destroy()

        var j2 = jsPlumb.newInstance({
            container:container,
            paintStyle: { stroke: '#666'}
        });

        var c = j2.connect({source:d1, target:d2})
        var p = c.connector.canvas.querySelector("path")
        equal(p.getAttribute("stroke-width"), "2", "stroke-width set to 2 despite not being supplied")

        j2.destroy()

        var j3 = jsPlumb.newInstance({
            container:container,
            paintStyle: { stroke: '#666', strokeWidth:12}
        });

        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4")
        c = j3.connect({source:d3, target:d4})
        p = c.connector.canvas.querySelector("path")
        equal(p.getAttribute("stroke-width"), "12", "stroke-width set to 12 as that was the supplied value")

        j3.destroy()


    })
};

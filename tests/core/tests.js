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
            _jsPlumb = jsPlumbBrowserUI.newInstance(({container:container}));
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumbUtil.extend({}, _jsPlumb.defaults);
        }
    });


    // ------------------------------- manage -----------------------------------------

    test("Manage adds data-jtk-managed attribute (and defaults to element's `id` if set)", function() {
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
    //         support2 = jsPlumbTestSupport.getInstance(_jsp2),
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

};

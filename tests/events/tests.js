QUnit.config.reorder = false;

var defaults = null, support, _jsPlumb;

var reinit = function(defaults) {
    var d = jsPlumb.extend({container:container}, defaults || {});
    support.cleanup()

    _jsPlumb = jsPlumbBrowserUI.newInstance((d));
    support = jsPlumbTestSupport.getInstance(_jsPlumb);
    defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
}

/**
 * Tests for dragging
 * @param _jsPlumb
 */

var testSuite = function () {

    var _detachThisConnection = function(c) {
        var idx = c.endpoints[1].connections.indexOf(c);
        support.detachConnection(c.endpoints[1], idx);
    };

    var _addDiv = function(id, x, y, w, h) {
        if (!x) {
            _jsPlumb.testx = _jsPlumb.testx || 0;
            _jsPlumb.testx += 100;
            x = _jsPlumb.textx;
        }

        if (!y) {
            _jsPlumb.testy = _jsPlumb.testy || 0;
            _jsPlumb.testy += 100;
            y = _jsPlumb.testy;
        }

        return support.addDiv(id, _jsPlumb.getContainer(), "", x, y, w, h);
    };

    module("DOM Events", {
        // uncomment 'tests' and the code in this method and the tests will stop (if you have dev tools open) when a test fails.
        // it can be handy to see what's going on with the DOM elements when a test fails.
        teardown: function (/*tests*/) {

            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumbBrowserUI.newInstance(({container:container}));
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);


        }
    });

    // setup the container

    test("sanity", function() {
        equal(1,1);
    });


    test("click", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var clicked = false;
        _jsPlumb.on(d, "click", function() {
            clicked = true
        })

        _jsPlumb.trigger(d, "click")

        ok(clicked, "click event fired")
    })

    test("dblclick", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var clicked = false;
        _jsPlumb.on(d, "dblclick", function() {
            clicked = true
        })

        _jsPlumb.trigger(d, "dblclick")

        ok(clicked, "dblclick event fired")
    })

    test("tap", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var tapped = false;
        _jsPlumb.on(d, "tap", function() {
            tapped= true
        })

        _jsPlumb.trigger(d, "mousedown")
        _jsPlumb.trigger(d, "mouseup")

        ok(tapped, "tap event fired")
    })

    test("dbltap", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var tapped = false;
        _jsPlumb.on(d, "dbltap", function() {
            tapped= true
        })

        _jsPlumb.trigger(d, "mousedown")
        _jsPlumb.trigger(d, "mouseup")
        _jsPlumb.trigger(d, "mousedown")
        _jsPlumb.trigger(d, "mouseup")

        ok(tapped, "dbltap event fired")
    })

    test("tap doesnt fire when mouseup on some other element", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var tapped = false;
        _jsPlumb.on(d, "tap", function() {
            tapped= true
        })

        _jsPlumb.trigger(d, "mousedown")
        _jsPlumb.trigger(document, "mouseup")

        ok(!tapped, "tap event not fired")
    })

    test("tap, child element", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var tapped = false;
        _jsPlumb.on(d, "tap", function() {
            tapped= true
        })

        _jsPlumb.trigger(d1, "mousedown")
        _jsPlumb.trigger(d1, "mouseup")

        ok(tapped, "tap event fired")
    })

    test("click, child element", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "click", function() {
            clicked = true
        })

        _jsPlumb.trigger(d1, "click")

        ok(clicked, "click event fired")
    })

    test("click, child element, delegate selector", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.className = "one"
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.className = "two"
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "click", ".one", function() {
            clicked = true
        })

        _jsPlumb.trigger(d1, "click")

        ok(clicked, "click event fired")

        clicked = false

        _jsPlumb.trigger(d2, "click")

        ok(!clicked, "click event not fired when child selector doesnt match")
    })

    test("tap, child element, delegate selector", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.className = "one"
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.className = "two"
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "tap", ".one", function() {
            clicked = true
        })

        _jsPlumb.trigger(d1, "mousedown")
        _jsPlumb.trigger(d1, "mouseup")

        ok(clicked, "tap event fired")

        clicked = false

        _jsPlumb.trigger(d2, "mousedown")
        _jsPlumb.trigger(d2, "mouseup")

        ok(!clicked, "click event not fired when child selector doesnt match")
    })

};

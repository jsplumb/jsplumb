QUnit.config.reorder = false;

var defaults = null, support, _jsPlumb;

var reinit = function(defaults) {
    var d = jsPlumb.extend({container:container}, defaults || {});
    support.cleanup()

    _jsPlumb = jsPlumbBrowserUI.newInstance((d));
    support = jsPlumbTestSupport.getInstance(_jsPlumb);
    defaults = jsPlumb.extend({}, _jsPlumb.defaults);
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

    module("Anchors", {
        // uncomment 'tests' and the code in this method and the tests will stop (if you have dev tools open) when a test fails.
        // it can be handy to see what's going on with the DOM elements when a test fails.
        teardown: function (/*tests*/) {

            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumbBrowserUI.newInstance(({container:container}));
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);


        }
    });

    // setup the container


    test("continuous anchors, left and right", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var conn = _jsPlumb.connect({
            source:d1,
            target:d2,
            anchors:["ContinuousLeft", "ContinuousRight"]
        })

        equal(conn.endpoints[0].anchor.type, "ContinuousLeft")
        equal(conn.endpoints[1].anchor.type, "ContinuousRight")
    })

    test("continuous anchors, top and bottom", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var conn = _jsPlumb.connect({
            source:d1,
            target:d2,
            anchors:["ContinuousTop", "ContinuousBottom"]
        })

        equal(conn.endpoints[0].anchor.type, "ContinuousTop")
        equal(conn.endpoints[1].anchor.type, "ContinuousBottom")
    })

    test("continuous anchors, addEndpoint, left and right", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var ep1 = _jsPlumb.addEndpoint(d1, {
            anchor:"ContinuousRight"
        })

        var ep2 = _jsPlumb.addEndpoint(d2, {
            anchor:"ContinuousLeft"
        })

        var conn = _jsPlumb.connect({source:ep1, target:ep2})

        equal(conn.endpoints[0].anchor.type, "ContinuousRight")
        equal(conn.endpoints[1].anchor.type, "ContinuousLeft")
    })

    test("continuous anchors, addEndpoint, left and right, uuids", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var ep1 = _jsPlumb.addEndpoint(d1, {
            anchor:"ContinuousRight",
            uuid:"foo"
        })

        var ep2 = _jsPlumb.addEndpoint(d2, {
            anchor:"ContinuousLeft",
            uuid:"bar"
        })

        var conn = _jsPlumb.connect({uuids:["foo", "bar"]})

        equal(conn.endpoints[0].anchor.type, "ContinuousRight")
        equal(conn.endpoints[1].anchor.type, "ContinuousLeft")
    })

    test("continuous anchors, addEndpoint, top and bottom", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var ep1 = _jsPlumb.addEndpoint(d1, {
            anchor:"ContinuousTop"
        })

        var ep2 = _jsPlumb.addEndpoint(d2, {
            anchor:"ContinuousBottom"
        })

        var conn = _jsPlumb.connect({source:ep1, target:ep2})

        equal(conn.endpoints[0].anchor.type, "ContinuousTop")
        equal(conn.endpoints[1].anchor.type, "ContinuousBottom")
    })



};

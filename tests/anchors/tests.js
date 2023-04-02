QUnit.config.reorder = false;

var defaults = null, support, _jsPlumb;

var reinit = function(defaults) {
    var d = jsPlumb.extend({container:container}, defaults || {});
    support.cleanup()

    _jsPlumb = jsPlumb.newInstance((d));
    support = jsPlumb.getInstanceQUnit(_jsPlumb);
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
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
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
        }),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor

        equal(sa.type, "ContinuousLeft")
        equal(ta.type, "ContinuousRight")
    })

    test("continuous anchors, top and bottom", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var conn = _jsPlumb.connect({
            source:d1,
            target:d2,
            anchors:["ContinuousTop", "ContinuousBottom"]
        }),sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor

        equal(sa.type, "ContinuousTop")
        equal(ta.type, "ContinuousBottom")
    })

    test("continuous anchors, addEndpoint, left and right", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var ep1 = _jsPlumb.addEndpoint(d1, {
            anchor:"ContinuousRight"
        })

        var ep2 = _jsPlumb.addEndpoint(d2, {
            anchor:"ContinuousLeft"
        })

        var conn = _jsPlumb.connect({source:ep1, target:ep2}),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor

        equal(sa.type, "ContinuousRight")
        equal(ta.type, "ContinuousLeft")
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

        var conn = _jsPlumb.connect({uuids:["foo", "bar"]}),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor

        equal(sa.type, "ContinuousRight")
        equal(ta.type, "ContinuousLeft")
    })

    test("continuous anchors, addEndpoint, top and bottom", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var ep1 = _jsPlumb.addEndpoint(d1, {
            anchor:"ContinuousTop"
        })

        var ep2 = _jsPlumb.addEndpoint(d2, {
            anchor:"ContinuousBottom"
        })

        var conn = _jsPlumb.connect({source:ep1, target:ep2}),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor

        equal(sa.type, "ContinuousTop")
        equal(ta.type, "ContinuousBottom")
    })

    test("continuous anchors, different faces for two separate connect calls", function() {
        var d1 = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 550, 550, 100, 100)

        var conn = _jsPlumb.connect({
                source:d1,
                target:d2,
                anchors:["ContinuousLeft", "ContinuousRight"]
            }),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor

        equal(sa.type, "ContinuousLeft")
        equal(ta.type, "ContinuousRight")
        equal(ta.computedPosition.x, 1, "x = 1 on target anchor (right face)")

        var conn2 = _jsPlumb.connect({
                source:d1,
                target:d2,
                anchors:["ContinuousLeft", "ContinuousBottom"]
            }),
            sa2 = conn2.endpoints[0]._anchor,
            ta2 = conn2.endpoints[1]._anchor

        equal(sa2.type, "ContinuousLeft")
        equal(ta2.type, "ContinuousBottom")
        equal(ta2.computedPosition.y, 1, "y = 1 on target anchor (bottom face)")
    })
    
    test("perimeter anchors, circle", function () {
        var d1 = _addDiv("one", 50, 50, 100, 100), d2 = _addDiv("two", 550, 550, 100, 100)
        var ep1 = _jsPlumb.addEndpoint(d1, {
            anchor:{ type:"Perimeter", options:{shape:"Circle"}}
        })

        var ep2 = _jsPlumb.addEndpoint(d2, {
            anchor:{ type:"Perimeter", options:{shape:"Circle"}}
        })

        var conn = _jsPlumb.connect({source:ep1, target:ep2}),
            sa = conn.endpoints[0]._anchor,
            ta = conn.endpoints[1]._anchor

        equal(sa.type, "Perimeter", "source anchor is of type Perimeter")
        equal(ta.type, "Perimeter", "target anchor is of type Perimeter")

        equal(sa.shape, "Circle", "shape is correct on source anchor")
        equal(ta.shape, "Circle", "shape is correct on target anchor")
    })



};

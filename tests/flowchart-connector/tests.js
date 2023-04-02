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

    module("Flowchart Connector", {
        // uncomment 'tests' and the code in this method and the tests will stop (if you have dev tools open) when a test fails.
        // it can be handy to see what's going on with the DOM elements when a test fails.
        teardown: function (/*tests*/) {

            support.cleanup();
            removeContainer()
        },
        setup: function () {
            makeContainer()
            _jsPlumb = jsPlumb.newInstance(({
                container:container,
                connector:"Flowchart"
            }));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);


        }
    });


    test("basic connection", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d2 = _addDiv("two", 250, 250, 100, 100)
        var c = _jsPlumb.connect({source:d, target:d2})
        equal(c.connector.type, "Flowchart", "flowchart connector was chosen")
    })

    test("loopback connection, endpoints at 90 degrees", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var e1 = _jsPlumb.addEndpoint(d, {anchor:"Right"})
        var e2 = _jsPlumb.addEndpoint(d, {anchor:"Bottom"})
        var c = _jsPlumb.connect({source:e1, target:e2})
        equal(c.connector.type, "Flowchart", "flowchart connector was chosen")
        var s = c.connector.segments
        equal(s.length, 4, "4 segments in connector")
        equal(s[0].x2 - s[0].x1, c.connector.sourceStub)
        equal(s[1].x2, s[1].x1)
        equal(s[2].x2, 0)
        equal(s[3].y1 - s[3].y2, c.connector.targetStub)
    })

    test("loopback connection, endpoints opposite", function() {
        var {w,h} = {w:100, h:100}
        var d = _addDiv("one", 50, 50, w, h)
        var e1 = _jsPlumb.addEndpoint(d, {anchor:"Top"})
        var e2 = _jsPlumb.addEndpoint(d, {anchor:"Bottom"})
        var c = _jsPlumb.connect({source:e1, target:e2})
        equal(c.connector.type, "Flowchart", "flowchart connector was chosen")
        var s = c.connector.segments

        var ymin = -c.connector.targetStub
        var xmax = (w/2) + c.connector.sourceStub
        var ymax = h + c.connector.targetStub

        equal(s.length, 5, "5 segments in connector")
        equal(s[0].y2, ymin)

        equal(s[1].x1, 0)
        equal(s[1].x2, xmax)
        equal(s[1].y1, ymin)
        equal(s[1].y2, ymin)

        equal(s[2].x1, xmax)
        equal(s[2].x2, xmax)
        equal(s[2].y1, ymin)
        equal(s[2].y2, ymax)

        equal(s[3].x1, xmax)
        equal(s[3].x2, 0)
        equal(s[3].y1, ymax)
        equal(s[3].y2, ymax)

        equal(s[4].x1, 0)
        equal(s[4].x2, 0)
        equal(s[4].y1, ymax)
        equal(s[4].y2, ymax - c.connector.targetStub)
    })

};

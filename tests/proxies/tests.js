// _jsPlumb qunit tests.

QUnit.config.reorder = false;

/**
 * @name Test
 * @class
 */

var _length = function(obj) {
    var c = 0;
    for (var i in obj) if (obj.hasOwnProperty(i)) c++;
    return c;
};

var _head = function(obj) {
    for (var i in obj)
        return obj[i];
};

var defaults = null, support, _jsPlumb;

var isHover = function(connection) {
    return connection.connector.canvas.classList.contains("jtk-hover");
}

var testSuite = function () {

    module("Proxies", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance({container:document.getElementById("container")});
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });

    // Basic setup, everything where it should be
    test("basic proxy setup", function () {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3")
        _jsPlumb.manageAll([d1, d2, d3])

        var c = _jsPlumb.connect({source:d1, target:d2})
        var originalTargetEp = c.endpoints[1]

        _jsPlumb.proxyConnection(c, 1, d3,   function() { return "Rectangle" },  function() { return "Top" });
        ok(c.proxies[1] != null, "target proxy set on the connection")
        equal(c.proxies[1].originalEp, originalTargetEp, "target endpoint stashed correctly")
        equal(c.endpoints[1].id, originalTargetEp.proxiedBy.id, "proxiedBy is set on original endpoint")

        // now unproxy and check everything was cleaned up
        _jsPlumb.unproxyConnection(c, 1)
        ok(c.proxies[1] == null, "target proxy cleared from the connection")
        equal(c.endpoints[1], originalTargetEp, "target endpoint stashed correctly")
        equal(null, originalTargetEp.proxiedBy, "proxiedBy is set on original endpoint")
    });

    test("delete an endpoint that is currently proxied - connection should be removed", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3")
        _jsPlumb.manageAll([d1, d2, d3])

        var c = _jsPlumb.connect({source:d1, target:d2})
        var originalTargetEp = c.endpoints[1]

        _jsPlumb.proxyConnection(c, 1, d3,   function() { return "Rectangle" },  function() { return "Top" });
        ok(c.proxies[1] != null, "target proxy set on the connection")
        equal(c.proxies[1].originalEp, originalTargetEp, "target endpoint stashed correctly")
        equal(c.endpoints[1].id, originalTargetEp.proxiedBy.id, "proxiedBy is set on original endpoint")

        equal(1, _jsPlumb.select().length, "1 connection in the instance")

        // delete d2. it is currently proxied, but its proxy connection should be removed
        _jsPlumb.unmanage(d2, true)

        equal(0, _jsPlumb.select().length, "0 connections in the instance")
    })

};






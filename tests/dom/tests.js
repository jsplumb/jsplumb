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
            _jsPlumb = jsPlumb.newInstance(({container: container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });


    test(': addEndpoint, css class on anchor added to endpoint artefact and element', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var ep = _jsPlumb.addEndpoint(d1, {anchor: [0, 0, 1, 1, 0, 0, "foo"]});
        ok(_jsPlumb.hasClass(support.getEndpointCanvas(ep), "jtk-endpoint-anchor-foo"), "class set on endpoint");
        ok(_jsPlumb.hasClass(d1, "jtk-endpoint-anchor-foo"), "class set on element");
        _jsPlumb.deleteEndpoint(ep);
        ok(!_jsPlumb.hasClass(d1, "jtk-endpoint-anchor-foo"), "class removed from element");
    });

    test(': addEndpoint, blank css class on anchor does not add extra prefix ', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var ep = _jsPlumb.addEndpoint(d1, {anchor: [0, 0, 1, 1, 0, 0]});
        //ok(_jsPlumb.hasClass(support.getEndpointCanvas(ep), "jtk-endpoint-anchor"), "class set on endpoint");
        ok(!_jsPlumb.hasClass(d1, "jtk-endpoint-anchor"), "jtk-endpoint-anchor class not set on element since anchor doesnt have a class");
    });

    test(": jsPlumb.remove, element identified by string", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);

        _jsPlumb.unmanage(d1);

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints(d1).length, 0, "no endpoints for the given element");
        //ok(e1.endpoint == null, "e1 cleaned up");
    });

    test(": jsPlumb.remove, element identified by selector", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.unmanage(d1);

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints(d1).length, 0, "no endpoints for the given element");
        //ok(e1.endpoint == null, "e1 cleaned up");
    });


    test(': create a simple endpoint with a scope and ensure the scope is written to the DOM', function () {
        var d1 = support.addDiv("d1");
        var e = _jsPlumb.addEndpoint(d1, {scope: "one"});
        ok(e, 'endpoint exists');
        support.assertEndpointCount(d1, 1);
        ok(e.id != null, "endpoint has had an id assigned");
        ok(support.getEndpointCanvas(e).getAttribute("data-jtk-scope-one") != null, "scope was written to the element");
    });

    // issue 1123
    test("connect method adds endpoint connected and endpoint full classes, existing endpoints", function () {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d2);

        var c = _jsPlumb.connect({
            source: e1, target: e2
        });

        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint"), true, "jtk-endpoint class added to endpoint container");
        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint-connected"), true, "jtk-endpoint-connected class added to endpoint container");
        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint-full"), true, "jtk-endpoint-full class added to endpoint container");

        _jsPlumb.deleteConnection(c)

        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint"), true, "jtk-endpoint class added to endpoint container");
        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint-connected"), false, "jtk-endpoint-connected class removed from endpoint container");
        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint-full"), false, "jtk-endpoint-full class removed from endpoint container");

    });

    // issue 1123
    test("connect method adds endpoint connected and endpoint full classes, new endpoints", function () {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({
            source: d1, target: d2
        }), e1 = c.endpoints[0], e2 = c.endpoints[1]

        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint"), true, "jtk-endpoint class added to endpoint container");
        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint-connected"), true, "jtk-endpoint-connected class added to endpoint container");
        equal(support.getEndpointCanvas(e1).classList.contains("jtk-endpoint-full"), true, "jtk-endpoint-full class added to endpoint container");

        _jsPlumb.deleteConnection(c)

        equal(support.getEndpointCanvas(e1), null, "endpoint was cleaned up");

    });


    test(" change Container programmatically", function () {

        _jsPlumb.setContainer(container);

        var newContainer = document.createElement("div");
        newContainer.id = "newContainer";
        document.body.appendChild(newContainer);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    { type: "Label", options:{ label: "FOO", id: "label" }}
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                overlays: [
                    { type: "Label", options:{ label: "FOO", id: "label" }}
                ]
            }),
            e3 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    { type: "Label", options:{ label: "FOO", id: "label" }}
                ]
            });

        var c = _jsPlumb.connect({
            source: e1, target: e2,
            paintStyle: {
                outline: 4,
                outlineStyle: "red",
                stroke: "red",
                strokeWidth: 2
            },
            overlays: [
                "Label", "Arrow"
            ]
        });

        equal(support.getEndpointCanvas(e1).parentNode, container, "e1 canvas parent is container");

        equal(support.getConnectionCanvas(c).parentNode, container, "connector parent is container");

        // ok(_ensureContainer(e1, container));
        // ok(_ensureContainer(c, container));


        _jsPlumb.setContainer(newContainer);

        equal(support.getEndpointCanvas(e1).parentNode, newContainer, "e1 canvas parent is newContainer");
        equal(support.getConnectionCanvas(c).parentNode, newContainer, "connector parent is newContainer");
        // ok(_ensureContainer(e1, newContainer));
        //ok(_ensureContainer(c, newContainer));
    });

    test(": _jsPlumb.connect (setting outline class on Connector)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, paintStyle:{outlineStroke:"green", outlineWidth:6, strokeWidth:4, stroke:"red"}});
        var conn = support.getConnectionCanvas(c);
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), _jsPlumb.connectorClass), "basic connector class set correctly");

        // ok(has("jtk-connector-outline", "bgPath"), "outline canvas set correctly");
        // ok(has(_jsPlumb.connectorOutlineClass, "bgPath"), "outline canvas set correctly");
    });

    test(": _jsPlumb.connect (setting cssClass on Connector)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, cssClass: "CSS"});
        var has = function (clazz) {
            var cn = support.getConnectionCanvas(c).className,
                cns = cn.constructor == String ? cn : cn.baseVal;

            return cns.indexOf(clazz) != -1;
        };
        ok(has("CSS"), "custom cssClass set correctly");
        ok(has(_jsPlumb.connectorClass), "basic connector class set correctly");
    });

    test(": _jsPlumb.connect (setting paintStyle on Connector)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            paintStyle:{
                outlineStroke:"green",
                outlineWidth:6,
                strokeWidth:4,
                stroke:"red"
            }
        });
        var conn = support.getConnectionCanvas(c);
        var paths = conn.querySelectorAll("path")
        equal(paths[0].getAttribute("stroke"), "green", "outline stroke was set")
        equal(paths[1].getAttribute("stroke"), "red", "stroke was set")
        equal(paths[0].getAttribute("stroke-width"), "16", "outline stroke width was set")
        equal(paths[1].getAttribute("stroke-width"), "4", "stroke width was set")
    });

    test(": _jsPlumb.connect (setting colors and line widths directly on Connector (without paint style)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            outlineColor:"green",
            outlineWidth:6,
            lineWidth:4,
            color:"red"
        });
        var conn = support.getConnectionCanvas(c);
        var paths = conn.querySelectorAll("path")
        equal(paths[0].getAttribute("stroke"), "green", "outline stroke was set")
        equal(paths[1].getAttribute("stroke"), "red", "stroke was set")
        equal(paths[0].getAttribute("stroke-width"), "16", "outline stroke width was set")
        equal(paths[1].getAttribute("stroke-width"), "4", "stroke width was set")

        _jsPlumb.setOutlineColor(c, "pink")
        _jsPlumb.setOutlineWidth(c, 10)
        _jsPlumb.setLineWidth(c, 5)
        _jsPlumb.setColor(c, "yellow")
        //
        equal(paths[0].getAttribute("stroke"), "pink", "outline stroke was changed")
        equal(paths[1].getAttribute("stroke"), "yellow", "stroke was changed")
        equal(paths[0].getAttribute("stroke-width"), "25", "outline stroke width was changed")
        equal(paths[1].getAttribute("stroke-width"), "5", "stroke width was changed")
    });

    test(": _jsPlumb.addEndpoint (setting cssClass on Endpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {cssClass: "CSS"});
        var has = function (clazz) {
            var cn = support.getEndpointCanvas(e).className,
                cns = cn.constructor == String ? cn : cn.baseVal;

            return cns.indexOf(clazz) != -1;
        };
        ok(has("CSS"), "custom cssClass set correctly");
        ok(has(_jsPlumb.endpointClass), "basic endpoint class set correctly");
    });

    test(": _jsPlumb.addEndpoint (setting cssClass on blank Endpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {endpoint: "Blank", cssClass: "CSS"});
        var has = function (clazz) {
            var cn = support.getEndpointCanvas(e).className,
                cns = cn.constructor == String ? cn : cn.baseVal;

            return cns.indexOf(clazz) != -1;
        };
        ok(has("CSS"), "custom cssClass set correctly");
        ok(has(_jsPlumb.endpointClass), "basic endpoint class set correctly");
    });

};

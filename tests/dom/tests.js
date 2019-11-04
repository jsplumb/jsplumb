QUnit.config.reorder = false;
var defaults = null, support, _jsPlumb;

var testSuite = function () {

    module("jsPlumb", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
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
        ok(_jsPlumb.hasClass(d1, "jtk-endpoint-anchor"), "class set on element");
        _jsPlumb.deleteEndpoint(ep);
        ok(!_jsPlumb.hasClass(d1, "jtk-endpoint-anchor"), "class removed from element");
    });

    test(": jsPlumb.remove, element identified by string", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);

        _jsPlumb.remove("d1");

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the given element");
        ok(e1.endpoint == null, "e1 cleaned up");
    });

    test(": jsPlumb.remove, element identified by selector", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.remove(d1);

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the given element");
        ok(e1.endpoint == null, "e1 cleaned up");
    });

    test("Image Endpoint remove", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.makeSource(d1, {
            endpoint:[ "Image", { src:"atom.png" }]
        });

        _jsPlumb.makeTarget(d2, {
            endpoint:[ "Image", { src:"atom.png" }]
        });

        var c = _jsPlumb.connect({source:d1, target:d2});
        var ep = c.endpoints[0];

        ok(support.getEndpointCanvas(ep).parentNode != null, "endpoint 1 is in the DOM");

        _jsPlumb.deleteConnection(c);
        ok(ep.endpoint == null, "endpoint 1 is no longer in the DOM");
    });

    test(': create a simple endpoint with a scope and ensure the scope is written to the DOM', function () {
        var d1 = support.addDiv("d1");
        var e = _jsPlumb.addEndpoint("d1", { scope:"one"});
        ok(e, 'endpoint exists');
        support.assertEndpointCount("d1", 1);
        ok(e.id != null, "endpoint has had an id assigned");
        ok(support.getEndpointCanvas(e).getAttribute("jtk-scope-one") != null, "scope was written to the element");
    });

    test(" change Container programmatically", function () {

        _jsPlumb.setContainer(container);

        var newContainer = document.createElement("div");
        newContainer.id = "newContainer";
        document.body.appendChild(newContainer);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
                ]
            }),
            e3 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
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

QUnit.config.reorder = false;
var defaults = null, support,_jsPlumb, container;

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
            _jsPlumb = jsPlumb.newInstance({container:container});
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
        }
    });


    test(": _jsPlumb.connect (overlays, long-hand version, label and arrow)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {width: 40, length: 40, location: 0.7, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a"};
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id:"l"}},
                { type:"Arrow", options:arrowSpec }
            ]
        });
        equal(support.length(connection1.overlays), 2);
        equal("Label", connection1.getOverlays()["l"].type);

        equal("Arrow", connection1.getOverlays()["a"].type);
        equal(0.7, connection1.getOverlays()["a"].location);
        equal(40, connection1.getOverlays()["a"].width);
        equal(40, connection1.getOverlays()["a"].length);
    });

    test(": _jsPlumb.connect (overlays, long-hand version, diamond and arrow)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {width: 40, length: 40, location: 0.7, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a"};
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Diamond", options:{ id:"d"} },
                { type: "PlainArrow", options:{ id:"a"} }
            ]
        });
        equal(support.length(connection1.overlays), 2);
        equal("Diamond", connection1.getOverlays()["d"].type);

        equal("PlainArrow", connection1.getOverlays()["a"].type);
    });

    test(": _jsPlumb.connect (overlays, long-hand version, IDs specified)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id: "aLabel"}},
                { type:"Arrow", options:arrowSpec }
            ]
        });
        equal(2, support.length(connection1.overlays));
        equal("Label", connection1.getOverlays()["aLabel"].type);
        equal("aLabel", connection1.getOverlays()["aLabel"].id);

        equal("aLabel", _jsPlumb.getAttribute(connection1.getOverlays()["aLabel"].canvas, "jtk-overlay-id"), "label id set on element of label overlay as jtk-overlay-id attribute")
        equal("anArrow", _jsPlumb.getAttribute(connection1.getOverlays()["anArrow"].path, "jtk-overlay-id"), "arrow id set on element of arrow overlay as jtk-overlay-id attribute")

        equal("Arrow", connection1.getOverlays()["anArrow"].type);
        equal(0.7, connection1.overlays["anArrow"].location);
        equal(40, connection1.overlays["anArrow"].width);
        equal(40, connection1.overlays["anArrow"].length);
        equal("anArrow", connection1.overlays["anArrow"].id);
    });

    test(": _jsPlumb.connect (default overlays)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default overlays + overlays specified in connect call)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                    { type:"Label", options:{id: "label"}}
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default connection overlays)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default connection overlays + overlays specified in connect call)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                    { type:"Label", options:{id: "label"}}
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default overlays + default connection overlays)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }},
            { type:"Arrow", options:{ location: 0.1, id: "arrow2" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("arrow2") != null, "Arrow overlay created from connection defaults");
    });

    test("overlay visible tests", function() {

        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }},
            { type:"Arrow", options:{ location: 0.1, id: "arrow2" }},
            { type: "Label", options:{id:"label"}}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var a1 = c.getOverlay("arrow");
        var l = c.getOverlay("label");

        equal(c.connector.canvas, a1.path.parentNode, "arrow's parent is the connector");
        equal(_jsPlumb.getContainer(), l.canvas.parentNode, "label's parent is the container");

        a1.setVisible(false);
        equal("none", a1.path.style.display, "arrow's style is 'none', as it is hidden");

        l.setVisible(false);
        equal("none", l.canvas.style.display, "label's display is 'none'; it is hidden");

        a1.setVisible(true);
        equal("block", a1.path.style.display, "arrow's display is 'block'; it is visible");

        l.setVisible(true);
        equal("block", l.canvas.style.display, "label's display is 'block'; it is visible");

    });


    test(": _jsPlumb.connect (default overlays + default connection overlays)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            { type:"Arrow", options:{ location: 0.1, id: "arrow" }},
            { type:"Arrow", options:{ location: 0.1, id: "arrow2" }}
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                    { type:"Label", options:{id: "label"}}
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("arrow2") != null, "Arrow overlay created from connection defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (label overlay set using 'label')", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO"
            });

        equal(support.length(c.getOverlays()), 1, "one overlay set");
        equal(c.getLabel(), "FOO", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with string)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel("FOO");
        equal(c.getLabel(), "FOO", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with function)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel(function () {
            return "BAR";
        });
        equal(c.getLabel(), "BAR", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with params object)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel({
            label: "BAZ",
            cssClass: "CLASSY",
            location: 0.9
        });
        var lo = c.getLabelOverlay();
        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.location, 0.9, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (set label after construction with existing label set, with params object)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            });

        var lo = c.getLabelOverlay();
        equal(lo.location, 0.2, "label overlay has correct location");

        c.setLabel({
            label: "BAZ",
            cssClass: "CLASSY",
            location: 0.9
        });

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.location, 0.9, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (testing the updateFrom method of the label overlay, with valid data)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            });

        var lo = c.getLabelOverlay();
        equal(lo.location, 0.2, "label overlay has correct location");

        lo.updateFrom({
            label: "BAZ",
            cssClass: "CLASSY",
            location: 0.9
        });

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.location, 0.9, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (testing the updateFrom method of the label overlay, with invalid data)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            });

        var lo = c.getLabelOverlay();
        equal(lo.location, 0.2, "label overlay has correct location");

        lo.updateFrom({
            label: "BAZ",
            cssClass: "CLASSY",
            location: ""
        });

        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.location, 0.2, "label overlay has correct location (it was not changed because the new value was invalid");

        lo.updateFrom({
            label: "BAZZ",
            location: "not a number"
        });

        equal(lo.getLabel(), "BAZZ", "label overlay has correct value");
        equal(lo.location, 0.2, "label overlay has correct location (it was not changed because the new value was invalid");

        lo.updateFrom({
            location: 0.1
        });

        equal(lo.location, 0.1, "label overlay has correct new location");

    });

    test(": _jsPlumb.connect (testing the updateFrom method of the label overlay, with invalid data)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: "not a number"
            });

        var lo = c.getLabelOverlay();
        equal(lo.location, 0.5, "label overlay has default location because the one passed in is not valid");

    });

    test(": _jsPlumb.connect (getLabelOverlay, label on connect call)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO"
            }),
            lo = c.getLabelOverlay();

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "FOO", "label overlay has correct value");
        equal(lo.location, 0.5, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (getLabelOverlay, label on connect call, location set)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            }),
            lo = c.getLabelOverlay();

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "FOO", "label overlay has correct value");
        equal(lo.location, 0.2, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (remove single overlay by id)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id: "aLabel"}},
                { type:"Arrow", options:arrowSpec }
            ]
        });
        equal(2, support.length(connection1.overlays));

        var labelOverlay = connection1.getOverlay("aLabel");
        var arrowOverlay = connection1.getOverlay("anArrow");

        connection1.removeOverlay("aLabel");

        equal(null, connection1.overlays["aLabel"], "not registered in overlays map");
        equal(null, connection1.overlayPositions["aLabel"], "not registered in overlay positions map");
        equal(null, connection1.overlayPlacements["aLabel"], "not registered in overlay positions map");

        equal(1, support.length(connection1.overlays), "only one overlay remaining on the connection");
        equal("anArrow", connection1.overlays["anArrow"].id, "the id of this overlay is what we expected");

        equal(labelOverlay.canvas, null, "the label overlay was actually removed from the DOM");

        // remove the arrow
        connection1.removeOverlay("anArrow");

        equal(null, connection1.overlays["anArrow"], "anArrow not registered in overlays map");
        equal(null, connection1.overlayPositions["anArrow"], "anArrow not registered in overlay positions map");
        equal(null, connection1.overlayPlacements["anArrow"], "anArrow not registered in overlay positions map");

        equal(0, support.length(connection1.overlays), "no overlays remaining on the connection");

        equal(arrowOverlay.path, null, "the arrow overlay was actually removed from the DOM");


    });

    test(": _jsPlumb.connect (remove multiple overlays by id)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id: "aLabel"}},
                { type:"Arrow", options:arrowSpec }
            ]
        });
        equal(2, support.length(connection1.overlays));
        connection1.removeOverlays("aLabel", "anArrow");
        equal(0, support.length(connection1.overlays));
    });

    test("connect (overlays, short-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id:"l"}},
                { type:"Arrow", options:jsPlumb.extend(arrowSpec, loc)}
            ]
        });
        equal(2, support.length(connection1.overlays));
        equal("Label", connection1.getOverlays()["l"].type);

        equal("Arrow", connection1.getOverlays()["a"].type);
        equal(0.7, connection1.overlays["a"].location);
        equal(40, connection1.overlays["a"].width);
        equal(40, connection1.overlays["a"].length);
    });

    test("add overlay after connection created (issue 1106)", function() {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var connection = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchor:"Continuous",
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, id:"l"}}
            ]
        });

        ok(!isNaN(parseInt(connection.getOverlay("l").canvas.style.left, 10)), "left position set for overlay")

        connection.addOverlay({
            type: "Label",
            options: { label: "bar", id: "barlabel", location: 0.75 }
        });

        ok(isNaN(parseInt(connection.getOverlay("barlabel").canvas.style.left, 10)), "left position not set for overlay added via connection.addOverlay")

        _jsPlumb.addOverlay(connection, {
            type: "Label",
            options: { label: "bar", id: "barlabel2", location: 0.75 }
        });

        ok(!isNaN(parseInt(connection.getOverlay("barlabel2").canvas.style.left, 10)), "left position set for overlay added via _jsPlumb.addOverlay")

    })

    test(": _jsPlumb.connect (removeAllOverlays)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["Bottom", [ 0.75, 0, 0, -1 ]],
            overlays: [
                { type:"Label", options:{label: "CONNECTION 1", location: 0.3, cssClass: "PPPP", id:"l"}},
                { type:"Arrow", options:jsPlumb.extend(arrowSpec, loc) }
            ]
        });
        equal(2, support.length(connection1.overlays));
        equal("Label", connection1.getOverlays()["l"].type);

        equal("Arrow", connection1.getOverlays()["a"].type);
        equal(0.7, connection1.overlays["a"].location);
        equal(40, connection1.overlays["a"].width);
        equal(40, connection1.overlays["a"].length);

        // not valid anymore, as we dont nuke overlays until the component is deleted.
        /*connection1.removeAllOverlays();
         equal(0, connection1.overlays.length);
         equal(0, jsPlumb.getSelector(".PPPP").length);*/
        _jsPlumb.deleteConnection(connection1);
        equal(0, document.querySelectorAll(".PPPP").length, "overlay has been fully cleaned up");
    });

    test(": _jsPlumb.connect, specify arrow overlay using string identifier only", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: ["Arrow"]});
        equal("Arrow", support.head(conn.getOverlays()).type);
    });

    test(": Connection.getOverlay method, existing overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{ id: "arrowOverlay" } }
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay != null);
    });

    test(": Connection.getOverlay method, non-existent overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{ id: "arrowOverlay" } }
        ] });
        var overlay = conn.getOverlay("IDONTEXIST");
        ok(overlay == null);
    });

    test(": Overlay.setVisible method", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{ id: "arrowOverlay" } }
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay.isVisible());
        overlay.setVisible(false);
        ok(!overlay.isVisible());
        overlay.setVisible(true);
        ok(overlay.isVisible());
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return plain DOM element)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            {
                type: "Custom",
                options: {
                    id: "custom",
                    create: function (connection) {
                        ok(connection != null, "we were passed in a connection");
                        var d = document.createElement("div");
                        d.setAttribute("custom", "true");
                        d.innerHTML = connection.id;
                        return d;
                    }
                }
            }
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.canvas.getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.canvas.innerHTML, c.id, "custom overlay has correct value");
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return selector)", function () {
        _jsPlumb.defaults.connectionOverlays = [
            {
                type: "Custom",
                options: {
                    id: "custom",
                    create: function (connection) {
                        ok(connection != null, "we were passed in a connection");
                        return support.makeContent("<div custom='true'>" + connection.id + "</div>");
                    }
                }
            }
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.canvas.getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.canvas.innerHTML, c.id, "custom overlay has correct value");
    });

    test(": overlay events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var clicked = 0;
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays: [
                { type:"Label", options:{
                    label: "CONNECTION 1",
                    location: 0.3,
                    id: "label",
                    events: {
                        click: function (label, e) {
                            clicked++;
                        }
                    }
                }}
            ]
        });
        var l = connection1.getOverlay("label");
        l.fire("click", l);
        equal(clicked, 1, "click event was fired once");
    });

    test("show/hide Overlays", function() {
        var c = _jsPlumb.connect({source:support.addDiv("d1"), target:support.addDiv("d2"), overlays:[
                { type: "Label", options:{ "id":"lbl" } }
        ]});

        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
        c.hideOverlays();
        //equal(c.getOverlay("lbl").canvas.style.display, "none", "overlay not visible");
        equal(c.getOverlay("lbl").isVisible(), false, "overlay is not visible");
        c.showOverlays();
        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
    });

    test("show/hide Overlays, supply ids to hide/show", function() {
        var c = _jsPlumb.connect({source:support.addDiv("d1"), target:support.addDiv("d2"), overlays:[
                { type: "Label", options:{ "id":"lbl" } },
                { type: "Label", options:{ "id":"lbl2" } }
            ]});

        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
        c.hideOverlays("lbl");
        equal(c.getOverlay("lbl").isVisible(), false, "overlay is not visible");
        equal(c.getOverlay("lbl2").isVisible(), true, "overlay 2 is visible");
        c.showOverlays("lbl");
        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
        equal(c.getOverlay("lbl2").isVisible(), true, "overlay 2 is visible");
    });

    //
    //test for issue 132: label leaves its element in the DOM after it has been
    //removed from a connection.
    //
    test(" label cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Label",options: {id: "label", cssClass: "foo"}}
        ]});
        ok(document.querySelectorAll(".foo").length == 1, "label element exists in DOM");
        c.removeOverlay("label");
        ok(support.length(c.getOverlays()) == 0, "no overlays left on component");
        ok(document.querySelectorAll(".foo").length == 0 , "label element does not exist in DOM");
    });


    test(" arrow cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{id: "arrow"}}
        ]});
        ok(c.getOverlay("arrow") != null, "arrow overlay exists");
        c.removeOverlay("arrow");
        ok(c.getOverlay("arrow") == null, "arrow overlay has been removed");
    });


    test(" label overlay provides getLabel and setLabel methods", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Label", options:{id: "label", label: "foo"}}
        ]});
        var o = c.getOverlay("label"), e = o.canvas;
        equal(e.innerHTML, "foo", "label text is set to original value");
        o.setLabel("baz");
        equal(e.innerHTML, "baz", "label text is set to new value 'baz'");
        equal(o.getLabel(), "baz", "getLabel function works correctly with String");
        // now try functions
        var aFunction = function () {
            return "aFunction";
        };
        o.setLabel(aFunction);
        equal(e.innerHTML, "aFunction", "label text is set to new value from Function");
        equal(o.getLabel(), "aFunction", "getLabel function works correctly with Function");
    });

    test(" label overlay custom css class", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Label", options:{
                id: "label",
                cssClass: "foo"
            }}
        ]});
        var o = c.getOverlay("label");
        ok(_jsPlumb.hasClass(o.canvas, "foo"), "label overlay has custom css class");
    });

    test(" arrow overlay custom css class", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Arrow", options:{
                        id: "arrow",
                        cssClass: "foo",
                        width:10,
                        length:10
                    }}
            ]});
        var o = c.getOverlay("arrow");
        ok(_jsPlumb.hasClass(o.path, "foo"), "arrow overlay has custom css class");
    });

    test(" custom overlay custom css class", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                { type: "Custom", options:{
                        create:function() { return document.createElement("div")},
                        id: "label",
                        cssClass: "foo"
                    }}
            ]});
        var o = c.getOverlay("label");
        ok(_jsPlumb.hasClass(o.canvas, "foo"), "custom overlay has custom css class");
    });

    test(" overlay custom attributes", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                {
                    type: "Label",
                    options:{
                        id: "label",
                        cssClass: "foo",
                        attributes:{
                            att1:"att1",
                            att2:"att2"
                        }
                    }
                },
                {
                    type: "Arrow",
                    options:{
                        id:"arrow",
                        attributes:{
                            att1:"arrowAtt1"
                        }
                    }
                }
            ]});
        var o = c.getOverlay("label");
        ok(_jsPlumb.hasClass(o.canvas, "foo"), "label overlay has custom css class");
        equal(o.canvas.getAttribute("att1"), "att1", "label overlay has custom attribute");

        var a = c.getOverlay("arrow");
        equal(a.path.getAttribute("att1"), "arrowAtt1", "arrow overlay has custom attribute");
    });


    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.defaults.endpointOverlays = [
            { type: "Label", options:{ id: "label" } }
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
    });



    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.defaults.endpointOverlays = [
            { type: "Label", options:{ id: "label" } }
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {
                overlays: [
                    { type:"Label", options:{ id: "label2", location: [ 0.5, 1 ] } }
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
        ok(e1.getOverlay("label2") != null, "endpoint 1 has overlay from addEndpoint call");
    });

    test("label overlay click, bind to connection:click on instance", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                    { type: "Label", options:{ id:"lbl" }}
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("connection:click", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.canvas, "click");
        _jsPlumb.trigger(lbl.canvas, "click");

        // the SVG element
        _jsPlumb.trigger(lbl.canvas, "click");

        // each of those should have triggered a single click

        equal(c, 3, "3 clicks in total");
    });

    test("arrow overlay click, bind to click on instance", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                    { type: "Arrow", options:{ id:"lbl" }}
                ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("connection:click", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.path, "click");
        _jsPlumb.trigger(lbl.path, "click");

        // the SVG element
        _jsPlumb.trigger(lbl.path, "click");

        // each of those should have triggered a single click

        equal(c, 3, "3 clicks in total");
    });

    test("overlay dblclick, events in overlay specs", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                    { type: "Arrow", options:{ id:"lbl" }}
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("connection:dblclick", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.path, "dblclick");
        _jsPlumb.trigger(lbl.path, "dblclick");

        // the SVG element
        _jsPlumb.trigger(lbl.path, "dblclick");

        // each of those should have triggered a single click

        equal(c, 3, "3 dblclicks in total");
    });

    // click events on overlays

    test("overlay click/tap event, events in overlay specs", function() {
        support.addDiv("d1");
        support.addDiv("d2");
        var count = 0;
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays:[
                { type: "Label", options:{
                    id:"label",
                    label:'hey',
                    events:{
                        click:function(p) {
                            ok(p.e != null, "event was provided in click callback")
                            ok(p.overlay != null, "overlay was provided in click callback")
                            count++;
                        }
                    }
                }},
                {
                    type: "Arrow",
                    options:{
                        id:"arrow",
                        events:{
                            tap:function(p) {
                                ok(p.e != null, "event was provided in click callback")
                                ok(p.overlay != null, "overlay was provided in click callback")
                                count++
                            }
                        }
                    }
                }
            ]}), o = c.getOverlay("label"), o2 = c.getOverlay("arrow");

        _jsPlumb.trigger(o.canvas, "click");
        equal(count, 1, "click event was triggered on label overlay");

        _jsPlumb.trigger(o2.path, "mousedown");
        _jsPlumb.trigger(o2.path, "mouseup");
        equal(count, 2, "click event was triggered on arrow overlay");
    });

    test("connection:abort event, overlays cleaned up", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var e2 = _jsPlumb.addEndpoint(d2, {source:true, connectorOverlays:[
                { type:"Label", options:{location:0.5, label:"FOO", cssClass:"anOverlay"} }
            ]});
        var evt = false, abortEvent = false;
        _jsPlumb.bind('connection:detach', function (info) {
            evt = true;
        });
        _jsPlumb.bind('connection:abort', function (info) {
            abortEvent = true;
        });

        support.dragAndAbortConnection(e2);
        ok(evt === false, "connection:detach event was not fired");
        equal(e2.connections.length, 0, "no connections");
        ok(abortEvent === true, "connection:abort event was fired");

        equal(_jsPlumb.getContainer().querySelectorAll(".anOverlay").length, 0, "0 overlay elements remain")
    });
};

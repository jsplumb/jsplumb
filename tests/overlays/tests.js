QUnit.config.reorder = false;
var defaults = null, support,_jsPlumb;

var testSuite = function () {


    module("jsPlumb", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance({container:container});
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
        }
    });

    // setup the container
    var container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);


    test(": _jsPlumb.connect (overlays, long-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {width: 40, length: 40, location: 0.7, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a"};
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id:"l"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(support.length(connection1.overlays), 2);
        equal("Label", connection1.getOverlays()["l"].type);

        equal("Arrow", connection1.getOverlays()["a"].type);
        equal(0.7, connection1.getOverlays()["a"].location);
        equal(40, connection1.getOverlays()["a"].width);
        equal(40, connection1.getOverlays()["a"].length);
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
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, support.length(connection1.overlays));
        equal("Label", connection1.getOverlays()["aLabel"].type);
        equal("aLabel", connection1.getOverlays()["aLabel"].id);

        equal("Arrow", connection1.getOverlays()["anArrow"].type);
        equal(0.7, connection1.overlays["anArrow"].location);
        equal(40, connection1.overlays["anArrow"].width);
        equal(40, connection1.overlays["anArrow"].length);
        equal("anArrow", connection1.overlays["anArrow"].id);
    });

    test(": _jsPlumb.connect (default overlays)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default overlays + overlays specified in connect call)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default connection overlays)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default connection overlays + overlays specified in connect call)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default overlays + default connection overlays)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }],
            ["Arrow", { location: 0.1, id: "arrow2" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("arrow2") != null, "Arrow overlay created from connection defaults");
    });

    test("overlay visible tests", function() {

        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }],
            ["Arrow", { location: 0.1, id: "arrow2" }],
            [ "Label", {id:"label"}]
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
        _jsPlumb.Defaults.connectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }],
            ["Arrow", { location: 0.1, id: "arrow2" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
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
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
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
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, support.length(connection1.overlays));
        connection1.removeOverlays("aLabel", "anArrow");
        equal(0, support.length(connection1.overlays));
    });

    test(": _jsPlumb.connect (overlays, short-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id:"l"}],
                ["Arrow", arrowSpec, loc]
            ]
        });
        equal(2, support.length(connection1.overlays));
        equal("Label", connection1.getOverlays()["l"].type);

        equal("Arrow", connection1.getOverlays()["a"].type);
        equal(0.7, connection1.overlays["a"].location);
        equal(40, connection1.overlays["a"].width);
        equal(40, connection1.overlays["a"].length);
    });

    test(": _jsPlumb.connect (removeAllOverlays)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, cssClass: "PPPP", id:"l"}],
                ["Arrow", arrowSpec, loc]
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
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay != null);
    });

    test(": Connection.getOverlay method, non-existent overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("IDONTEXIST");
        ok(overlay == null);
    });

    test(": Overlay.setVisible method", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay.isVisible());
        overlay.setVisible(false);
        ok(!overlay.isVisible());
        overlay.setVisible(true);
        ok(overlay.isVisible());
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return plain DOM element)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Custom", { id: "custom", create: function (connection) {
                ok(connection != null, "we were passed in a connection");
                var d = document.createElement("div");
                d.setAttribute("custom", "true");
                d.innerHTML = connection.id;
                return d;
            }}]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.canvas.getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.canvas.innerHTML, c.id, "custom overlay has correct value");
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return selector)", function () {
        _jsPlumb.Defaults.connectionOverlays = [
            ["Custom", { id: "custom", create: function (connection) {
                ok(connection != null, "we were passed in a connection");
                return support.makeContent("<div custom='true'>" + connection.id + "</div>");
            }}]
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
                ["Label", {
                    label: "CONNECTION 1",
                    location: 0.3,
                    id: "label",
                    events: {
                        click: function (label, e) {
                            clicked++;
                        }
                    }
                }]
            ]
        });
        var l = connection1.getOverlay("label");
        l.fire("click", l);
        equal(clicked, 1, "click event was fired once");
    });

    test("show/hide Overlays", function() {
        var c = _jsPlumb.connect({source:support.addDiv("d1"), target:support.addDiv("d2"), overlays:[
            [ "Label", { "id":"lbl" } ]
        ]});

        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
        c.hideOverlays();
        //equal(c.getOverlay("lbl").canvas.style.display, "none", "overlay not visible");
        equal(c.getOverlay("lbl").isVisible(), false, "overlay is not visible");
        c.showOverlays();
        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
    });

    //
    //test(" _jsPlumb.hide, two-arg version, endpoints should also be hidden", function() {
    //var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
    //e = { isSource:true, isTarget:true, maxConnections:-1 },
    //e1 = _jsPlumb.addEndpoint(d1, e),
    //e2 = _jsPlumb.addEndpoint(d2, e),
    //c1 = _jsPlumb.connect({source:e1, target:e2});

    //equal(true, c1.isVisible(), "Connection 1 is visible after creation.");
    //equal(true, e1.isVisible(), "endpoint 1 is visible after creation.");
    //equal(true, e2.isVisible(), "endpoint 2 is visible after creation.");

    //_jsPlumb.hide("d1", true);

    //equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
    //equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
    //equal(true, e2.isVisible(), "endpoint 2 is still visible.");
    //});

    //
    //test for issue 132: label leaves its element in the DOM after it has been
    //removed from a connection.
    //
    test(" label cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {id: "label", cssClass: "foo"}]
        ]});
        ok(document.querySelectorAll(".foo").length == 1, "label element exists in DOM");
        c.removeOverlay("label");
        ok(support.length(c.getOverlays()) == 0, "no overlays left on component");
        ok(document.querySelectorAll(".foo").length == 0 , "label element does not exist in DOM");
    });


    test(" arrow cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", {id: "arrow"}]
        ]});
        ok(c.getOverlay("arrow") != null, "arrow overlay exists");
        c.removeOverlay("arrow");
        ok(c.getOverlay("arrow") == null, "arrow overlay has been removed");
    });


    test(" label overlay provides getLabel and setLabel methods", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {id: "label", label: "foo"}]
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
            [ "Label", {
                id: "label",
                cssClass: "foo"
            }]
        ]});
        var o = c.getOverlay("label");
        ok(_jsPlumb.hasClass(o.canvas, "foo"), "label overlay has custom css class");
    });


    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.Defaults.endpointOverlays = [
            [ "Label", { id: "label" } ]
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
    });



    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.Defaults.endpointOverlays = [
            [ "Label", { id: "label" } ]
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {
                overlays: [
                    ["Label", { id: "label2", location: [ 0.5, 1 ] } ]
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
        ok(e1.getOverlay("label2") != null, "endpoint 1 has overlay from addEndpoint call");
    });

    test("label overlay click, bind to click on instance", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                [ "Label", { id:"lbl" }]
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("click", function() {
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
                    [ "Arrow", { id:"lbl" }]
                ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("click", function() {
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
                [ "Arrow", { id:"lbl" }]
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("dblclick", function() {
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

    test("overlay click event, events in overlay specs", function() {
        support.addDiv("d1");
        support.addDiv("d2");
        var count = 0;
        var c = _jsPlumb.connect({
            source: "d1",
            target: "d2",
            overlays:[
                [ "Label", {
                    id:"label",
                    label:'hey',
                    events:{
                        click:function() {
                            count++;
                        }
                    }
                }],
                [ "Arrow", {
                    id:"arrow",
                    events:{
                        click:function() {
                            count++
                        }
                    }
                }]
            ]}), o = c.getOverlay("label"), o2 = c.getOverlay("arrow");

        _jsPlumb.trigger(o.canvas, "click");
        equal(count, 1, "click event was triggered on label overlay");

        _jsPlumb.trigger(o2.path, "click");
        equal(count, 2, "click event was triggered on arrow overlay");
    });

};

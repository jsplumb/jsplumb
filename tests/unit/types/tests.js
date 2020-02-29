QUnit.config.reorder = false;

var _jsPlumb, support;

var defaults = null, _divs = [], support,
    _cleanup = function (_jsPlumb) {
        _jsPlumb.reset();
        _jsPlumb.unbindContainer();
        if (_jsPlumb.select().length != 0)
            throw "there are connections!";

        _jsPlumb.Defaults = defaults;

        support.cleanup();

        document.getElementById("container").innerHTML = "";
    };

var testSuite = function () {


    module("Types", {
        teardown: function () {
            _cleanup(_jsPlumb);
        },
        setup: function () {
            _jsPlumb = jsPlumb.getInstance({container:container});
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
        }
    });

    // setup the container
    var container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    test("sanity", function() {
        equal(1,1);
    });



// ******************  connection type tests - types, type extension, set types, get types etc. also since 2.0.0
// tests for multiple makeSource/makeTarget on a single element (distinguished by their type/filter params) *****************

    test(" set connection type on existing connection", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO",
            endpoint:"Rectangle"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");
        equal(c.endpoints[0].type, "Dot", "endpoint is not of type rectangle, because that only works for new connections");
    });

    test(" add connection type on existing connection", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        equal(c.getConnector().type, "Bezier", "connector has bezier type before state add");

        c.addType("basic");
        equal(c.getConnector().type, "Flowchart", "connector has Flowchart type after state add");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");
    });

    test(" set connection type on existing connection then change type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO"
        };
        var otherType = {
            connector: "Bezier",
            paintStyle: { stroke: "red", strokeWidth: 14 },
            hoverPaintStyle: { stroke: "green" },
            cssClass: "BAR"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        equal(c.getConnector().type, "Bezier", "connector has bezier type before state change");

        c.setType("basic");
        equal(c.getConnector().type, "Flowchart", "connector has bezier type after state change");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "hoverPaintStyle stroke is blue");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");

        c.setType("other");
        equal(c.getConnector().type, "Bezier", "connector has bezier type after second state change");
        equal(c.getPaintStyle().strokeWidth, 14, "paintStyle strokeWidth is 14");
        equal(c.getPaintStyle().stroke, "red", "paintStyle stroke is red");
        equal(c.getHoverPaintStyle().stroke, "green", "hoverPaintStyle stroke is green");
        equal(c.getHoverPaintStyle().strokeWidth, 14, "hoverPaintStyle strokeWidth is 14");
        ok(!_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was removed from canvas");
        ok(_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class was set on canvas");
    });

    test(" set connection type on existing connection, overlays should be set", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        equal(support.length(c.getOverlays()), 1, "one overlay");
    });

    test(" set connection type on existing connection, overlays should be removed with second type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        var otherType = {
            connector: "Bezier"
        };
        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        c.getConnector().testFlag = true;
        equal(support.length(c.getOverlays()), 1, "one overlay after setting `basic` type");
        // set a flag on the overlay; we will test later that re-adding the basic type will not cause a whole new overlay
        // to be created
        support.head(c.getOverlays()).testFlag = true;

        c.setType("other");
        equal(support.length(c.getOverlays()), 0, "no overlays after setting type to `other`, which has no overlays");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "paintStyle strokeWidth is default");

        c.addType("basic");
        equal(support.length(c.getOverlays()), 1, "one overlay after reinstating `basic` type");
        ok(c.getConnector().testFlag, "connector is the one that was created on first application of basic type");
        ok(support.head(c.getOverlays()).testFlag, "overlay is the one that was created on first application of basic type");
    });

    test(" set connection type on existing connection, overlays should be overridden by setType and merged by addType", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                [ "Arrow", { id:"arrow" } ]
            ]
        };
        var otherType = {
            connector: "Bezier",
            overlays:[
                [ "Label", { id:"label"} ]
            ]
        };
        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        c.getConnector().testFlag = true;
        equal(support.length(c.getOverlays()), 1, "one overlay after setting `basic` type");
        // set a flag on the overlay; we will test later that re-adding the basic type will not cause a whole new overlay
        // to be created
        support.head(c.getOverlays()).testFlag = true;

        c.setType("other");
        equal(support.length(c.getOverlays()), 1, "one overlay after setting type to `other`, overlay is a label");
        equal(c.getOverlays()["label"].type, "Label", "type of overlay is correct");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "paintStyle strokeWidth is default");

        c.addType("basic");
        equal(support.length(c.getOverlays()), 2, "one overlays after re-adding `basic` type");
        ok(c.getConnector().testFlag, "connector is the one that was created on first application of basic type");
        //ok(support.head(c.getOverlays()).testFlag, "overlay is the one that was created on first application of basic type");
    });


    test(" set connection type on existing connection, anchors and connectors created only once", function () {
        var basicType = {
            connector: "Flowchart",
            anchor:"Continuous",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        var otherType = {
            connector: "Bezier",
            anchor:"AutoDefault"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        c.getConnector().testFlag = true;
        c.endpoints[0].anchor.testFlag = "source";
        c.endpoints[1].anchor.testFlag = "target";
        support.head(c.getOverlays()).testFlag = true;

        c.setType("other");
        c.getConnector().testFlag = true;
        ok(c.endpoints[0].anchor.testFlag == null, "test flag not set on source anchor");
        ok(c.endpoints[1].anchor.testFlag == null, "test flag not set on target anchor");

        c.addType("basic");
        equal(support.length(c.getOverlays()), 1, "one overlay after reinstating `basic` type");
        ok(c.getConnector().testFlag, "connector is the one that was created on first application of basic type");
        equal(c.endpoints[0].anchor.testFlag, "source", "test flag still set on source anchor: anchor was reused");
        equal(c.endpoints[1].anchor.testFlag, "target", "test flag still set on target anchor: anchor was reused");
        ok(support.head(c.getOverlays()).testFlag, "overlay is the one that was created on first application of basic type");
        ok(support.head(c.getOverlays()).path.parentNode != null, "overlay was reattached to the DOM correctly");
    });

    test(" set connection type on existing connection, hasType + toggleType", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };

        _jsPlumb.registerConnectionTypes({
            "basic": basicType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        c.toggleType("basic");
        equal(c.hasType("basic"), false, "connection does not have 'basic' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        c.toggleType("basic");
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(support.length(c.getOverlays()), 1, "one overlay");

    });

    test(" set connection type on existing connection, merge tests", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ],
            cssClass: "FOO"
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            connector: "Bezier",
            paintStyle: { strokeWidth: 14 },
            overlays: [
                ["Arrow", {location: 0.25}]
            ],
            cssClass: "BAR"
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays:[  [ "Label", {id:"LBL", label:"${lbl}" } ] ]});

        equal(support.length(c.getOverlays()), 1, "connection has one overlay to begin with");

        c.setType("basic", {lbl:"FOO"});
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has strokeWidth 4");
        equal(support.length(c.getOverlays()), 2, "two overlays after setting type to 'basic'");
        equal(c.getOverlay("LBL").getLabel(), "FOO", "overlay's label set via setType parameter");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");

        c.addType("other", {lbl:"BAZ"});
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
        //equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(support.length(c.getOverlays()), 3, "three overlays after adding 'other' type");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class is still set on canvas");
        ok(_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class was set on canvas");
        equal(c.getOverlay("LBL").getLabel(), "BAZ", "overlay's label updated via addType parameter is correct");

        c.removeType("basic", {lbl:"FOO"});
        equal(c.hasType("basic"), false, "connection does not have 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
        //equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(support.length(c.getOverlays()), 2, "two overlays after removing 'basic' type");
        ok(!_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was removed from canvas");
        ok(_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class is still set on canvas");
        equal(c.getOverlay("LBL").getLabel(), "FOO", "overlay's label updated via removeType parameter is correct");

        c.toggleType("other");
        equal(c.hasType("other"), false, "connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "connection has default strokeWidth");
        equal(support.length(c.getOverlays()), 1, "one overlay after toggling 'other' type. this is the original overlay now.");
        ok(!_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class was removed from canvas");

        c.removeOverlay("LBL");
        equal(support.length(c.getOverlays()), 0, "zero overlays after removing the original overlay.");
    });

    test("connection type tests, check overlays do not disappear", function () {
        var connectionTypes = {};
        connectionTypes["normal"] = {
            paintStyle: {
                stroke: "gray",
                strokeWidth: 3,
                cssClass: "normal"
            },
            hoverPaintStyle: {
                stroke: "#64c8c8",
                strokeWidth: 3
            }
        };
        connectionTypes["selected"] = {
            paintStyle: {
                stroke: "blue",
                strokeWidth: 3,
                cssClass: "selected"

            },
            hoverPaintStyle: {
                stroke: "#64c8c8",
                strokeWidth: 3
            }
        };

        _jsPlumb.registerConnectionTypes(connectionTypes);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            detachable: true,
            overlays: [
                ["Label",
                    {
                        label: "hello",
                        location: 50,
                        id: "myLabel1",
                        cssClass: "connectionLabel"
                    }
                ]
            ],
            type: "normal"
        });

        var labelOverlay = c.getOverlay("myLabel1");
        ok(labelOverlay != null, "label overlay was retrieved");
        labelOverlay.setLabel("foo");
        ok(labelOverlay.getLabel() === "foo", "label set correctly on overlay");

        c.addType("selected");
        labelOverlay = c.getOverlay("myLabel1");
        ok(labelOverlay != null, "label overlay was not blown away");
        c.removeType("selected");
        labelOverlay = c.getOverlay("myLabel1");
        ok(labelOverlay != null, "label overlay was not blown away");

        // see issue #311
        //ok(labelOverlay.getLabel() === "foo", "label set correctly on overlay");
    });

    test("endpoint type tests, check overlays do not disappear", function () {
        var epTypes = {};
        epTypes["normal"] = {
            paintStyle: {
                fill: "gray",
                cssClass: "normal"
            }
        };
        epTypes["selected"] = {
            paintStyle: {
                fill: "blue",
                cssClass: "selected"

            },
            hoverPaintStyle: {
                stroke: "#64c8c8",
                strokeWidth: 3
            }
        };

        _jsPlumb.registerEndpointTypes(epTypes);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {
            overlays: [
                ["Label",
                    {
                        label: "hello",
                        location: 50,
                        id: "myLabel1",
                        cssClass: "connectionLabel"
                    }
                ]
            ],
            type: "normal"
        });

        ok(e.getOverlay("myLabel1") != null, "label overlay was retrieved");

        e.addType("selected");
        ok(e.getOverlay("myLabel1") != null, "label overlay was not blown away");
        e.removeType("selected");
        ok(e.getOverlay("myLabel1") != null, "label overlay was not blown away");
    });

    test(" connection type tests, space separated arguments", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            connector: "Bezier",
            paintStyle: { strokeWidth: 14 },
            overlays: [
                ["Arrow", {location: 0.25}]
            ]
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic other");
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
//        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(support.length(c.getOverlays()), 2, "two overlays");

        c.toggleType("other basic");
        equal(c.hasType("basic"), false, "after toggle, connection does not have 'basic' type");
        equal(c.hasType("other"), false, "after toggle, connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "after toggle, connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "after toggle, connection has default strokeWidth");
        equal(support.length(c.getOverlays()), 0, "after toggle, no overlays");

        c.toggleType("basic other");
        equal(c.hasType("basic"), true, "after toggle again, connection has 'basic' type");
        equal(c.hasType("other"), true, "after toggle again, connection has 'other' type");
  //      equal(c.getPaintStyle().stroke, "yellow", "after toggle again, connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "after toggle again, connection has strokeWidth 14");
        equal(support.length(c.getOverlays()), 2, "after toggle again, two overlays");

        c.removeType("other basic");
        equal(c.hasType("basic"), false, "after remove, connection does not have 'basic' type");
        equal(c.hasType("other"), false, "after remove, connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "after remove, connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "after remove, connection has default strokeWidth");
        equal(support.length(c.getOverlays()), 0, "after remove, no overlays");

        c.addType("other basic");
        equal(c.hasType("basic"), true, "after add, connection has 'basic' type");
        equal(c.hasType("other"), true, "after add, connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "after add, connection has yellow stroke style");
        // NOTE here we added the types in the other order to before, so strokeWidth 4 - from basic - should win.
        equal(c.getPaintStyle().strokeWidth, 4, "after add, connection has strokeWidth 4");
        equal(support.length(c.getOverlays()), 2, "after add, two overlays");
    });

    test(" connection type tests, default type is overridden", function () {
        var defaultType = {
            anchor:[0.5, 0, 0, 0],
            overlays:[
                ["Arrow", { id:"default"}]
            ]
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var mergeType = {
            // note: this does not extend 'default' here; it does implicitly though.
            anchor:[0.5, 1, 0, 0],
            overlays:[
                ["Label", { id:"childMerged"}]
            ]
        };

        var overrideType = {
            // note: this does not extend 'default' here; it does implicitly though.
            anchor:[1, 0.8, 0, 0],
            mergeStrategy:"override",
            overlays:[
                ["Label", { id:"childOverridden"}]
            ]
        };

        _jsPlumb.registerConnectionTypes({
            "default": defaultType,
            "merged": mergeType,
            "overridden":overrideType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2, type:"merged"}),
            c2 = _jsPlumb.connect({source: d2, target: d3}),
            c3 = _jsPlumb.connect({source: d1, target: d2, type:"overridden"});


        equal(c.endpoints[0].anchor.y, 1, "anchor y is 1 in overridden (merged but anchors are not) edge");
        equal(c2.endpoints[0].anchor.y, 0, "anchor y is 0  in default edge");
        equal(c3.endpoints[0].anchor.y, 0.8, "anchor y is 0.8 in overridden edge");

        ok(c.getOverlays()["default"] != null, "merged override connection has overlay from base and from the override");
        ok(c.getOverlays()["childMerged"] != null, "merged override connection has overlay from base and from the override");

        ok(c3.getOverlays()["default"] == null, "overridden and not merged connection has no overlay from base but one from the override");
        ok(c3.getOverlays()["childOverridden"] != null, "merged override connection has overlay from base and from the override");

    });

    test(" connection type tests, fluid interface", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            connector: "Bezier",
            paintStyle: { strokeWidth: 14 },
            overlays: [
                ["Arrow", {location: 0.25}]
            ]
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2}),
            c2 = _jsPlumb.connect({source: d2, target: d3});

        _jsPlumb.select().addType("basic");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c2.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");

        _jsPlumb.select().toggleType("basic");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        equal(c2.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

        _jsPlumb.select().addType("basic");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c2.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");

        _jsPlumb.select().removeType("basic").addType("other");
//        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
//        equal(c2.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");


    });

    test(" connection type tests, two types, check separation", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 }
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            paintStyle: { stroke: "red", strokeWidth: 14 }
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2}),
            c2 = _jsPlumb.connect({source: d2, target: d3});
        c.setType("basic");
        equal(c.getPaintStyle().stroke, "yellow", "first connection has yellow stroke style");
        c2.setType("other");

        equal(c.getPaintStyle().stroke, "yellow", "first connection has yellow stroke style");


    });

    test(" setType when null", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType(null);
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

    });

    test(" setType to unknown type", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("foo");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

    });

    test(" setType to mix of known and unknown types", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        _jsPlumb.registerConnectionType("basic", {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        });

        c.setType("basic foo");
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");

        c.toggleType("foo");
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");

        c.removeType("basic baz");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

        c.addType("basic foo bar baz");
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");

    });

    test(" create connection using type parameter", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.Defaults.PaintStyle = {stroke: "blue", strokeWidth: 34};

        _jsPlumb.registerConnectionTypes({
            "basic": {
                connector: "Flowchart",
                paintStyle: { stroke: "yellow", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "blue" },
                overlays: [
                    "Arrow"
                ],
                endpoint:"Rectangle"
            },
            "other": {
                paintStyle: { strokeWidth: 14 }
            }
        });

        equal(_jsPlumb.Defaults.PaintStyle.stroke, "blue", "default value has not been messed up");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

        c = _jsPlumb.connect({source: d1, target: d2, type: "basic other"});
//        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has other type's strokeWidth");
        equal(c.endpoints[0].type, "Rectangle", "endpoint is of type rectangle");

    });

    test(" makeSource connection type is honoured", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.Defaults.PaintStyle = {stroke: "blue", strokeWidth: 34};

        _jsPlumb.registerConnectionTypes({
            "basic": {
                connector: "Flowchart",
                paintStyle: { stroke: "yellow", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "blue" },
                overlays: [
                    "Arrow"
                ],
                endpoint:"Rectangle"
            }
        });

        _jsPlumb.makeSource(d1, {
            connectionType:"basic"
        });

        var c = _jsPlumb.connect({source: d1, target: d2, type:"basic"});
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has basic type's strokeWidth");
        equal(c.endpoints[0].type, "Rectangle", "endpoint is of type rectangle");

        _jsPlumb.deleteConnection(c);

        _jsPlumb.makeTarget(d2, {
            endpoint:"Blank"
        });

        c = support.dragConnection(d1, d2);
        c = _jsPlumb.select().get(0);
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has basic type's strokeWidth");
        equal(c.endpoints[0].type, "Rectangle", "source endpoint is of type rectangle");
        equal(c.endpoints[1].type, "Blank", "target endpoint is of type Blank - it was overriden from the type's endpoint.");
    });

    test(" setType, scope", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        _jsPlumb.registerConnectionType("basic", {
            connector: "Flowchart",
            scope: "BANANA",
            detachable: false,
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        });

        _jsPlumb.Defaults.ConnectionsDetachable = true;//just make sure we've setup the test correctly.

        c.setType("basic");
        equal(c.scope, "BANANA", "scope is correct");
        equal(c.isDetachable(), false, "not detachable");

    });

    test(" setType, parameters", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.registerConnectionType("basic", {
            parameters: {
                foo: 1,
                bar: 2,
                baz: 6785962437582
            }
        });

        _jsPlumb.registerConnectionType("frank", {
            parameters: {
                bar: 5
            }
        });

        // first try creating one with the parameters
        c = _jsPlumb.connect({source: d1, target: d2, type: "basic"});

        equal(c.getParameter("foo"), 1, "foo param correct");
        equal(c.getParameter("bar"), 2, "bar param correct");

        c.addType("frank");
        equal(c.getParameter("foo"), 1, "foo param correct");
        equal(c.getParameter("bar"), 5, "bar param correct");
    });

    test(" set connection type on existing connection, parameterised type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "${strokeColor}", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" }
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic", { strokeColor: "yellow" });
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
    });

    test(" create connection with parameterised type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "${strokeColor}", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays:[
                ["Label", {id:"one", label:"one" }],
                ["Label", {id:"two", label:"${label}" }],
                ["Label", {id:"three", label:"${missing}" }]
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                type: "basic",
                data: { strokeColor: "yellow", label:"label" }
            });

        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");

        var o1 = c.getOverlay("one");
        equal(o1.getLabel(),"one", "static label set correctly");
        var o2 = c.getOverlay("two");
        equal(o2.getLabel(), "label", "parameterised label with provided value set correctly");
        var o3 = c.getOverlay("three");
        equal(o3.getLabel(), "", "parameterised label with missing value set correctly");

        ok(c.endpoints[0].getLabel() == null, "endpoint did not get a label assigned from the connector's type");
    });

    test(" create connection with parameterised type, label", function () {
        var basicType = {
            connector: "Flowchart",
            overlays: [
                [ "Label", { label: "${label}", id: "label"} ]
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                type: "basic",
                data: { label: "LABEL" }
            }),
            l = c.getOverlay("label");

        equal(l.getLabel(), "LABEL", "label is set correctly");

    });

    test(" create connection with parameterised type, label, value empty", function () {
        var basicType = {
            connector: "Flowchart",
            overlays: [
                [ "Label", { label: "${label}", id: "label"} ]
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                type: "basic",
                data: {  }
            }),
            l = c.getOverlay("label");

        equal(l.getLabel(), "", "label is blank when no value provided");

    });

    test(" reapply parameterised type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "${strokeColor}", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" }
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2
            });

        c.addType("basic", { strokeColor: "yellow" });
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");

        c.reapplyTypes({ strokeColor: "green" });
        equal(c.getPaintStyle().stroke, "green", "paintStyle stroke is now green");
    });

    test(" setType, scope, two types", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        _jsPlumb.registerConnectionType("basic", {
            connector: "Flowchart",
            scope: "BANANA",
            detachable: false,
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        });

        _jsPlumb.registerConnectionType("frank", {
            scope: "OVERRIDE",
            detachable: true
        });

        _jsPlumb.Defaults.ConnectionsDetachable = true;//just make sure we've setup the test correctly.

        c.setType("basic frank");
        equal(c.scope, "OVERRIDE", "scope is correct");
        equal(c.isDetachable(), true, "detachable");

    });

    test(" create connection from Endpoints - type should be passed through.", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, {
                connectionType: "basic"
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                connectionType: "basic"
            });

        _jsPlumb.registerConnectionTypes({
            "basic": {
                paintStyle: { stroke: "blue", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "red" },
                overlays: [
                    "Arrow"
                ]
            },
            "other": {
                paintStyle: { strokeWidth: 14 }
            }
        });

        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.getPaintStyle().stroke, "blue", "connection has default stroke style");
    });

    test(" simple Endpoint type tests.", function () {
        _jsPlumb.registerEndpointType("basic", {
            paintStyle: {fill: "blue"},
            cssClass: "FOO"
        });

        _jsPlumb.registerEndpointType("other", {
            paintStyle: {fill: "blue"},
            cssClass: "BAR"
        });

        var d = support.addDiv('d1'), e = _jsPlumb.addEndpoint(d);
        e.setType("basic");
        equal(e.getPaintStyle().fill, "blue", "fill style is correct");
        ok(jsPlumb.hasClass(e.canvas, "FOO"), "css class was set");
        e.removeType("basic");
        ok(!jsPlumb.hasClass(e.canvas, "FOO"), "css class was removed");

        // add basic type again; FOO should be back
        e.addType("basic");
        ok(jsPlumb.hasClass(e.canvas, "FOO"), "css class was set");
        // now set type to something else: FOO should be removed.
        e.setType("other");
        ok(!jsPlumb.hasClass(e.canvas, "FOO"), "FOO css class was removed");
        ok(jsPlumb.hasClass(e.canvas, "BAR"), "BAR css class was added");

        // toggle type: now BAR css class should be removed
        e.toggleType("other");
        ok(!jsPlumb.hasClass(e.canvas, "BAR"), "BAR css class was removed");

        var d2 = support.addDiv('d2'), e2 = _jsPlumb.addEndpoint(d2, {type: "basic"});
        equal(e2.getPaintStyle().fill, "blue", "fill style is correct");
    });

    test(" clearTypes", function () {
        _jsPlumb.registerEndpointType("basic", {
            paintStyle: {fill: "blue"},
            cssClass: "FOO"
        });

        var d = support.addDiv('d1'), e = _jsPlumb.addEndpoint(d);
        e.setType("basic");
        equal(e.getPaintStyle().fill, "blue", "fill style is correct");
        ok(jsPlumb.hasClass(e.canvas, "FOO"), "css class was set");

        e.clearTypes();
        ok(!jsPlumb.hasClass(e.canvas, "FOO"), "FOO css class was removed");
    });

    test(" new Endpoint, prefer endpointStyle to paintStyle.", function () {

        var d = support.addDiv('d1'),
            e = _jsPlumb.addEndpoint(d, {
                paintStyle: {fill: "blue"},
                endpointStyle: {fill: "green"},
                hoverPaintStyle: {fill: "red"},
                endpointHoverStyle: {fill: "yellow"}
            });

        equal(e.getPaintStyle().fill, "green", "fill style is correct");
        e.setHover(true);
        equal(e.getHoverPaintStyle().fill, "yellow", "fill style is correct");
    });

    test(" Endpoint type, prefer endpointStyle to paintStyle.", function () {
        _jsPlumb.registerEndpointType("basic", {
            paintStyle: {fill: "blue"},
            endpointStyle: {fill: "green"},
            hoverPaintStyle: {fill: "red"},
            endpointHoverStyle: {fill: "yellow"}
        });

        var d = support.addDiv('d1'), e = _jsPlumb.addEndpoint(d);
        e.setType("basic");
        equal(e.getPaintStyle().fill, "green", "fill style is correct");
        e.setHover(true);
        equal(e.getHoverPaintStyle().fill, "yellow", "fill style is correct");
    });

    test(" create connection from Endpoints - with connector settings in Endpoint type.", function () {

        _jsPlumb.registerEndpointTypes({
            "basic": {
                connector: "Flowchart",
                connectorOverlays: [
                    "Arrow"
                ],
                connectorStyle: {stroke: "green" },
                connectorHoverStyle: {strokeWidth: 534 },
                paintStyle: { fill: "blue" },
                hoverPaintStyle: { stroke: "red" },
                overlays: [
                    "Arrow"
                ]
            },
            "other": {
                paintStyle: { fill: "red" }
            }
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, {
                type: "basic"
            }),
            e2 = _jsPlumb.addEndpoint(d2);

        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(e1.getPaintStyle().fill, "blue", "endpoint has fill style specified in Endpoint type");
        equal(c.getPaintStyle().stroke, "green", "connection has stroke style specified in Endpoint type");
        equal(c.getHoverPaintStyle().strokeWidth, 534, "connection has hover style specified in Endpoint type");
        equal(c.getConnector().type, "Flowchart", "connector is Flowchart");
        equal(support.length(c._jsPlumb.overlays), 1, "connector has one overlay");
        equal(support.length(e1._jsPlumb.overlays), 1, "endpoint has one overlay");
    });

    test(" create connection from Endpoints - type should be passed through.", function () {

        _jsPlumb.registerConnectionTypes({
            "basic": {
                paintStyle: { stroke: "bazona", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "red" },
                overlays: [
                    "Arrow"
                ]
            }
        });

        _jsPlumb.registerEndpointType("basic", {
            connectionType: "basic",
            paintStyle: {fill: "GAZOODA"}
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, {
                type: "basic"
            }),
            e2 = _jsPlumb.addEndpoint(d2);

        c = _jsPlumb.connect({source: e1, target: e2});
        equal(e1.getPaintStyle().fill, "GAZOODA", "endpoint has correct paint style, from type.");
        equal(c.getPaintStyle().stroke, "bazona", "connection has paint style from connection type, as specified in endpoint type. sweet!");
    });

    test(" endpoint type", function () {
        _jsPlumb.registerEndpointTypes({"example": {hoverPaintStyle: null}});
        //OR
        //jsPlumb.registerEndpointType("example", {hoverPaintStyle: null});

        var d = support.addDiv("d");
        _jsPlumb.addEndpoint(d, {type: "example"});
        _jsPlumb.repaint(d);

        expect(0);
    });


    test(" multiple makeSource registrations, switched by connectionType", function () {
        _jsPlumb.importDefaults({
            PaintStyle:{strokeWidth:10, stroke:"red"}
        });
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO"
        };
        var otherType = {
            connector: "Straight",
            paintStyle: { stroke: "red", strokeWidth: 14 },
            hoverPaintStyle: { stroke: "green" },
            cssClass: "BAR"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        _jsPlumb.makeSource(d1, {
            connectionType:"basic",
            endpoint:"Blank"
        });

        // make a connection with type not provided; we should get the jsplumb defaults, as no default makeSource
        // registration has been made.
        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getPaintStyle().strokeWidth, 10, "connect without type specified gives default type");
        ok(!jsPlumb.hasClass(c.getConnector().canvas, "FOO"), "css class not set on connector");

        // make a connection whose type matches a register makeSource type; we should get its params.
        var c2 = _jsPlumb.connect({source: d1, target: d2, type:"basic"});
        equal(c2.getPaintStyle().strokeWidth, 4, "connect with type specified matches");
        ok(jsPlumb.hasClass(c2.getConnector().canvas, "FOO"), "css class set on connector");
        equal(c2.endpoints[0].type, "Blank", "source endpoint is blank, per basic type spec");

        // next makeSource with a different type and try to match it:
        _jsPlumb.makeSource(d1, {
            connectionType:"other",
            endpoint:"Rectangle"
        });

        var c3 = _jsPlumb.connect({source: d1, target: d2, type:"other"});
        equal(c3.getPaintStyle().strokeWidth, 14, "connect with type specified matches");
        ok(jsPlumb.hasClass(c3.getConnector().canvas, "BAR"), "css class set on connector");
        equal(c3.endpoints[0].type, "Rectangle", "source endpoint is Rectangle, per basic type spec");


        // finally add a default registration and connect without specifying type


        /*var c2 = _jsPlumb.connect({source: d1, target: d2, type:"other"});
        equal(c2.getPaintStyle().strokeWidth, 14, "connect with type specified matches");*/

    });

    test("changing type does not hide overlays", function() {

        var canvas = support.addDiv("canvas", null, null, 0, 0, 500, 500 ),
            d1 = support.addDiv("d1", canvas, null, 50, 50, 150, 150),
            d2 = support.addDiv("d2", canvas, null, 300,300,150,150);

        var jpInstance = jsPlumb.getInstance({
            Container: canvas,
            Anchor: 'Continuous',
            Endpoint: [
                'Dot',
                {
                    radius: 2
                }
            ],
            ConnectionOverlays: [
                ['Arrow', {
                    location: 1,
                    id: 'arrow',
                    length: 8,
                    width: 10,
                    foldback: 1
                }],
                ['Label', {
                    location: 0.5,
                    id: 'label',
                    label: "foo"
                }]
            ],
            PaintStyle: {
                stroke: '#b6b6b6',
                strokeWidth: 2,
                outlineStroke: 'transparent',
                outlineWidth: 4
            },
            HoverPaintStyle: {
                stroke: '#545454',
                zIndex: 6
            }
        });

        jpInstance.registerConnectionType('default', {
            connector: ['Flowchart', {
                cornerRadius: 10,
                gap: 10,
                stub: 15
            }],
            cssClass: 'transition'
        });

        jpInstance.registerConnectionType('loopback', {
            connector: ['StateMachine', {
                loopbackRadius: 10
            }],
            cssClass: 'transition'
        });

        var con1 = jpInstance.connect({
            source: 'd1',
            target: 'd1',
            type: 'loopback'
        });

        var con2 = jpInstance.connect({
            source: 'd2',
            target: 'd2',
            type: 'default'
        });

        // con2 has an arrow overlay after creation
        ok(con2.getOverlays()['arrow'] != null, "arrow overlay found");
        ok(con2.getOverlays()['arrow'].path.parentNode != null, "arrow overlay is in the DOM");
        ok(con2.getOverlays()['arrow'].path.parentNode.parentNode != null, "arrow overlay is in the DOM");

        ok(con2.getOverlays()['label'] != null, "label overlay found");
        ok(con2.getOverlays()['label'].canvas.parentNode != null, "label overlay is in the DOM");

        con2.setType('loopback');
        ok(con2.getOverlays()['label'].canvas.parentNode != null, "label overlay is in the DOM");
        ok(con2.getOverlays()['arrow'].path.parentNode != null, "arrow overlay is in the DOM");
        ok(con2.getOverlays()['arrow'].path.parentNode.parentNode != null, "arrow overlay is in the DOM");

        con2.setType('default');
        ok(con2.getOverlays()['label'].canvas.parentNode != null, "label overlay is in the DOM");
        ok(con2.getOverlays()['arrow'].path.parentNode != null, "arrow overlay is in the DOM");
        ok(con2.getOverlays()['arrow'].path.parentNode.parentNode != null, "arrow overlay is in the DOM");

    });

};

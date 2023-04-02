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

var assertConnectionCount = function (endpoint, count) {
    equal(endpoint.connections.length, count, "endpoint has " + count + " connections");
};

var assertConnectionByScopeCount = function (scope, count, _jsPlumb) {
    equal(_jsPlumb.select({scope: scope}).length, count, 'Scope ' + scope + " has " + count + (count > 1) ? "connections" : "connection");
};

var defaults = null, support, _jsPlumb;

var testSuite = function () {

    module("jsPlumb", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance({container:document.getElementById("container")});
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
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

        equal(c._types.size, 1, "1 type set")
        equal(Array.from(c._types)[0], "default", "default type set")
        c.setType("basic");
        equal(c._types.size, 1, "1 type set")
        equal(Array.from(c._types)[0], "basic", "basic type set")
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "FOO class was set on canvas");
        equal(c.endpoints[0].endpoint.type, "Dot", "endpoint is not of type rectangle, because that only works for new connections");
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

        equal(c.connector.type, "Straight", "connector has Straight type before state add");
        equal(c._types.size, 1, "1 type set")
        equal(Array.from(c._types)[0], "default", "default type set")

        c.addType("basic");
        equal(c._types.size, 2, "2 types set")
        equal(Array.from(c._types)[0], "default", "default type set")
        equal(Array.from(c._types)[1], "basic", "basic type set")
        equal(c.connector.type, "Flowchart", "connector has Flowchart type after state add");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "FOO class was set on canvas");
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

        equal(c.connector.type, "Straight", "connector has Straight type before state change");

        c.setType("basic");
        equal(c.connector.type, "Flowchart", "connector has bezier type after state change");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "hoverPaintStyle stroke is blue");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "FOO class was set on canvas");

        c.setType("other");
        equal(c.connector.type, "Bezier", "connector has bezier type after second state change");
        equal(c.getPaintStyle().strokeWidth, 14, "paintStyle strokeWidth is 14");
        equal(c.getPaintStyle().stroke, "red", "paintStyle stroke is red");
        equal(c.getHoverPaintStyle().stroke, "green", "hoverPaintStyle stroke is green");
        equal(c.getHoverPaintStyle().strokeWidth, 14, "hoverPaintStyle strokeWidth is 14");
        ok(!_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "FOO class was removed from canvas");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "BAR"), "BAR class was set on canvas");
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
        equal(_length(c.getOverlays()), 1, "one overlay");
    });

    test(" set same type twice, should only be set once", function () {
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

        c.setType("basic basic");
        equal(_length(c.getOverlays()), 1, "one overlay");
        equal(c._types.size, 1, "connection only has one type set")
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
        c.connector.testFlag = true;
        equal(_length(c.getOverlays()), 1, "one overlay after setting `basic` type");
        // set a flag on the overlay; we will test later that re-adding the basic type will not cause a whole new overlay
        // to be created
        _head(c.getOverlays()).testFlag = true;

        c.setType("other");
        equal(_length(c.getOverlays()), 0, "no overlays after setting type to `other`, which has no overlays");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.defaults.paintStyle.strokeWidth, "paintStyle strokeWidth is default");

        c.addType("basic");
        equal(_length(c.getOverlays()), 1, "one overlay after reinstating `basic` type");
        ok(c.connector.testFlag, "connector is the one that was created on first application of basic type");
        ok(_head(c.getOverlays()).testFlag, "overlay is the one that was created on first application of basic type");
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
            c = _jsPlumb.connect({source: d1, target: d2}),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor

        c.setType("basic");
        sa = c.endpoints[0]._anchor
        ta = c.endpoints[1]._anchor
        c.connector.testFlag = true;
        sa.testFlag = "source";
        ta.testFlag = "target";
        _head(c.getOverlays()).testFlag = true;

        c.setType("other");
        sa = c.endpoints[0]._anchor
        ta = c.endpoints[1]._anchor
        c.connector.testFlag = true;
        equal(sa.testFlag, null, "test flag not set on source anchor");
        equal(ta.testFlag, null, "test flag not set on target anchor");

        c.addType("basic");
        sa = c.endpoints[0]._anchor
        ta = c.endpoints[1]._anchor
        equal(_length(c.getOverlays()), 1, "one overlay after reinstating `basic` type");
        ok(c.connector.testFlag, "connector is the one that was created on first application of basic type");
        equal(sa.testFlag, "source", "test flag still set on source anchor: anchor was reused");
        equal(ta.testFlag, "target", "test flag still set on target anchor: anchor was reused");
        ok(_head(c.getOverlays()).testFlag, "overlay is the one that was created on first application of basic type");
        ok(_head(c.getOverlays()).path.parentNode != null, "overlay was reattached to the DOM correctly");
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
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");
        c.toggleType("basic");
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(_length(c.getOverlays()), 1, "one overlay");

    });

    test(" set connection type on existing connection, merge tests", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                { type: "Label", options:{id:"LBL", label:"${lbl}" } }
            ],
            cssClass: "FOO"
        };

        var overlayType = {
            overlays: [
                { type: "Label", options:{id:"LBL2", label:"LABEL 2" } }
            ]
        };

        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            connector: "Bezier",
            paintStyle: { strokeWidth: 14 },
            overlays: [
                { type:"Arrow", options:{location: 0.25}}
            ],
            cssClass: "BAR"
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType,
            "overlayType":overlayType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays:[  "Arrow" ]});

        equal(_length(c.getOverlays()), 1, "connection has one overlay to begin with");

        // TODO need another type. test addType (which should add overlays) and setType (which should set the overlays it wants)
        c.setType("basic", {lbl:"FOO"});
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has strokeWidth 4");
        equal(c.getOverlay("LBL").getLabel(), "FOO", "overlay's label set via setType parameter");
        equal(_length(c.getOverlays()), 2, "two overlays after setting'basic' type");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "FOO class was set on canvas");

        c.addType("overlayType");
        equal(_length(c.getOverlays()), 3, "three overlays after adding type 'overlayType'");
        equal(c.hasType("overlayType"), true, "connection has 'overlayType' type");

        c.addType("other", {lbl:"BAZ"});
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 4, "four overlays after adding 'other' type");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "FOO class is still set on canvas");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "BAR"), "BAR class was set on canvas");
        //equal(c.getOverlay("LBL").getLabel(), "BAZ", "overlay's label updated via addType parameter is correct");

        c.removeType("basic", {lbl:"FOO"});
        equal(c.hasType("basic"), false, "connection does not have 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 3, "three overlays after removing 'basic' type");
        ok(!_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "FOO class was removed from canvas");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c), "BAR"), "BAR class is still set on canvas");
        //equal(c.getOverlay("LBL").getLabel(), "FOO", "overlay's label updated via removeType parameter is correct");

        c.removeType("overlayType");
        equal(_length(c.getOverlays()), 2, "two overlays after removing 'overlayType' type");

        c.toggleType("other");
        equal(c.hasType("other"), false, "connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.defaults.paintStyle.strokeWidth, "connection has default strokeWidth");
        equal(_length(c.getOverlays()), 1, "one overlay after toggling 'other' type. this is the original overlay now.");
        ok(!_jsPlumb.hasClass(support.getConnectionCanvas(c), "BAR"), "BAR class was removed from canvas");

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
                {
                    type: "Label",
                    options: {
                        label: "hello",
                        location: 50,
                        id: "myLabel1",
                        cssClass: "connectionLabel"
                    }
                }
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
                {
                    type: "Label",
                    options: {
                        label: "hello",
                        location: 50,
                        id: "myLabel1",
                        cssClass: "connectionLabel"
                    }
                }
            ],
            type: "normal"
        });

        ok(e.getOverlay("myLabel1") != null, "label overlay was retrieved");

        e.addType("selected");
        ok(e.getOverlay("myLabel1") != null, "label overlay was not blown away");
        e.removeType("selected");
        ok(e.getOverlay("myLabel1") != null, "label overlay was not blown away");
    });

    test("changing type does not hide overlays", function() {

        var canvas = support.addDiv("canvas", null, null, 0, 0, 500, 500 ),
            d1 = support.addDiv("d1", canvas, null, 50, 50, 150, 150),
            d2 = support.addDiv("d2", canvas, null, 300,300,150,150);

        var jpInstance = jsPlumb.newInstance({
            container: canvas,
            anchor: 'Continuous',
            endpoint: {
                type: 'Dot',
                options: {
                    radius: 2
                }
            },
            connectionOverlays: [
                { type:'Arrow', options:{
                    location: 1,
                    id: 'arrow',
                    length: 8,
                    width: 10,
                    foldback: 1
                }},
                { type:'Label', options:{
                    location: 0.5,
                    id: 'label',
                    label: "foo"
                }}
            ],
            paintStyle: {
                stroke: '#b6b6b6',
                strokeWidth: 2,
                outlineStroke: 'transparent',
                outlineWidth: 4
            },
            hoverPaintStyle: {
                stroke: '#545454',
                zIndex: 6
            }
        });

        jpInstance.registerConnectionType('default', {
            connector: { type:'Flowchart', options:{
                cornerRadius: 10,
                gap: 10,
                stub: 15
            }},
            cssClass: 'transition'
        });

        jpInstance.registerConnectionType('loopback', {
            connector: { type:'StateMachine', options:{
                loopbackRadius: 10
            }},
            cssClass: 'transition'
        });

        var con1 = jpInstance.connect({
            source: d1,
            target: d1,
            type: 'loopback'
        });

        var con2 = jpInstance.connect({
            source: d2,
            target: d2,
            type: 'default'
        });

        // con2 has an arrow overlay after creation
        ok(con2.getOverlays()['arrow'] != null, "arrow overlay found");
        equal(con2.getOverlays()['arrow'].path.parentNode, con2.connector.canvas, "arrow overlay's parent is the connector canvas");

        ok(con2.getOverlays()['label'] != null, "label overlay found");
        equal(con2.getOverlays()['label'].canvas.parentNode, jpInstance.getContainer(), "label overlay's parent is the container");

        con2.setType('loopback');
        equal(con2.getOverlays()['label'].canvas.parentNode, jpInstance.getContainer(), "label overlay's parent is the container");
        equal(con2.getOverlays()['arrow'].path.parentNode, con2.connector.canvas, "arrow overlay's parent is the connector canvas");

        con2.setType('default');
        equal(con2.getOverlays()['label'].canvas.parentNode, jpInstance.getContainer(), "label overlay's parent is the container");
        equal(con2.getOverlays()['arrow'].path.parentNode, con2.connector.canvas, "arrow overlay's parent is the connector canvas");

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
                { type:"Arrow", options:{location: 0.25}}
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
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 2, "two overlays");

        c.toggleType("other basic");
        equal(c.hasType("basic"), false, "after toggle, connection does not have 'basic' type");
        equal(c.hasType("other"), false, "after toggle, connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "after toggle, connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.defaults.paintStyle.strokeWidth, "after toggle, connection has default strokeWidth");
        equal(_length(c.getOverlays()), 0, "after toggle, no overlays");

        c.toggleType("basic other");
        equal(c.hasType("basic"), true, "after toggle again, connection has 'basic' type");
        equal(c.hasType("other"), true, "after toggle again, connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "after toggle again, connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "after toggle again, connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 2, "after toggle again, two overlays");

        c.removeType("other basic");
        equal(c.hasType("basic"), false, "after remove, connection does not have 'basic' type");
        equal(c.hasType("other"), false, "after remove, connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "after remove, connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.defaults.paintStyle.strokeWidth, "after remove, connection has default strokeWidth");
        equal(_length(c.getOverlays()), 0, "after remove, no overlays");

        c.addType("other basic");
        equal(c.hasType("basic"), true, "after add, connection has 'basic' type");
        equal(c.hasType("other"), true, "after add, connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "after add, connection has yellow stroke style");
        // NOTE here we added the types in the other order to before, so strokeWidth 4 - from basic - should win.
        equal(c.getPaintStyle().strokeWidth, 4, "after add, connection has strokeWidth 4");
        equal(_length(c.getOverlays()), 2, "after add, two overlays");
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
                { type:"Arrow", options:{location: 0.25}}
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
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");
        equal(c2.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");

        _jsPlumb.select().addType("basic");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c2.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");

        _jsPlumb.select().removeType("basic").addType("other");
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");
        equal(c2.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");


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

    test(" connection type tests, two types, mergeStrategy:\"override\"", function () {
        var basicType = {
            overlays:[
                { type: "Arrow", options:{ location: 1, id:"basicArrow" }},
                { type: "Label", options:{ location:0.2, id:"basicLabel" }}
            ]
        };

        var otherType = {
            overlays:[
                { type: "Arrow", options:{ location: 0.5, id:"otherArrow" }}
            ],
            mergeStrategy:"override"

        };

        var anotherType = {
            overlays:[
                { type: "Label", options:{ location: 0.5, id:"anotherLabel" }}
            ]

        };

        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType,
            "another":anotherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2}),
            c2 = _jsPlumb.connect({source: d2, target: d3});

        // add the 'basic' type and observe it has two overlays.
        c.setType("basic");
        ok(c.getOverlays().basicArrow != null, "first connection has Arrow overlay from the basicType");
        ok(c.getOverlays().basicLabel != null, "first connection has Label overlay from the basicType");

        // add - not set - the `other` type, and observe it has only the overlay from that type due to the mergeStrategy.
        c.addType("other");

        ok(c.getOverlays().basicArrow == null, "first connection has no basicArrow overlay because otherType overrides basicType");
        ok(c.getOverlays().basicLabel == null, "first connection has no basicLabel overlay, because otherType overrides basicType");
        ok(c.getOverlays().otherArrow != null, "first connection has otherArrow overlay, because otherType overrides basicType");

        c.addType("another");
        ok(c.getOverlays().otherArrow != null, "first connection still has otherArrow overlay; anotherType merges normally");
        ok(c.getOverlays().anotherLabel != null, "first connection does not have anotherLabel overlay; type added afterwards is not overridden by `other` type's mergeStrategy");


    });

    test(" setType when null", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType(null);
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");

    });

    test(" setType to unknown type", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("foo");
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");

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
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");

        c.addType("basic foo bar baz");
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");

    });

    test(" create connection using type parameter", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.defaults.paintStyle = {stroke: "blue", strokeWidth: 34};

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

        equal(_jsPlumb.defaults.paintStyle.stroke, "blue", "default value has not been messed up");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getPaintStyle().stroke, _jsPlumb.defaults.paintStyle.stroke, "connection has default stroke style");

        c = _jsPlumb.connect({source: d1, target: d2, type: "basic other"});
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has other type's strokeWidth");
        equal(c.endpoints[0].endpoint.type, "Rectangle", "endpoint is of type rectangle");

    });

    test(" makeSource connection type is honoured, programmatic connect", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.manageAll([d1, d2, d3])

        _jsPlumb.defaults.paintStyle = {stroke: "blue", strokeWidth: 34};

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

        _jsPlumb.addSourceSelector("#d1", {
            edgeType:"basic"
        });

        var c = _jsPlumb.connect({source: d1, target: d2, type:"basic"});
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has basic type's strokeWidth");
        equal(c.endpoints[0].endpoint.type, "Rectangle", "endpoint is of type rectangle");

        _jsPlumb.deleteConnection(c);

        _jsPlumb.addTargetSelector("#d2", {
            endpoint:"Blank"
        });

        c = _jsPlumb.connect({source: d1, target: d2, type:"basic"});
        c = _jsPlumb.select().get(0);
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has basic type's strokeWidth");
        equal(c.endpoints[0].endpoint.type, "Rectangle", "source endpoint is of type rectangle");
        //equal(c.endpoints[1].type, "Blank", "target endpoint is of type Blank - it was overriden from the type's endpoint.");
    });

    test(" setType, scope", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        _jsPlumb.manageAll([d1, d2, d3])

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

        _jsPlumb.defaults.connectionsDetachable = true;//just make sure we've setup the test correctly.

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

        equal(c.parameters["foo"], 1, "foo param correct");
        equal(c.parameters["bar"], 2, "bar param correct");

        c.addType("frank");
        equal(c.parameters["foo"], 1, "foo param correct");
        equal(c.parameters["bar"], 5, "bar param correct");
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

    test(" set connection type on existing connection, parameterised type, new format", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "{{strokeColor}}", strokeWidth: 4 },
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
                { type:"Label", options:{id:"one", label:"one" }},
        { type:"Label", options:{id:"two", label:"${label}" }},
            { type:"Label", options:{id:"three", label:"${missing}" }}
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
                { type: "Label", options:{ label: "${label}", id: "label"} }
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
                { type: "Label", options:{ label: "${label}", id: "label"} }
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

        _jsPlumb.defaults.connectionsDetachable = true;//just make sure we've setup the test correctly.

        c.setType("basic frank");
        equal(c.scope, "OVERRIDE", "scope is correct");
        equal(c.isDetachable(), true, "detachable");

    });

    test(" create connection from Endpoints - type should be passed through.", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, {
                edgeType: "basic"
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                edgeType: "basic"
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
        ok(_jsPlumb.hasClass(support.getEndpointCanvas(e), "FOO"), "css class was set");
        e.removeType("basic");
        ok(!_jsPlumb.hasClass(support.getEndpointCanvas(e), "FOO"), "css class was removed");

        // add basic type again; FOO should be back
        e.addType("basic");
        ok(_jsPlumb.hasClass(support.getEndpointCanvas(e), "FOO"), "css class was set");
        // now set type to something else: FOO should be removed.
        e.setType("other");
        ok(!_jsPlumb.hasClass(support.getEndpointCanvas(e), "FOO"), "FOO css class was removed");
        ok(_jsPlumb.hasClass(support.getEndpointCanvas(e), "BAR"), "BAR css class was added");

        // toggle type: now BAR css class should be removed
        e.toggleType("other");
        ok(!_jsPlumb.hasClass(support.getEndpointCanvas(e), "BAR"), "BAR css class was removed");

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
        ok(_jsPlumb.hasClass(support.getEndpointCanvas(e), "FOO"), "css class was set");

        e.clearTypes();
        ok(!_jsPlumb.hasClass(support.getEndpointCanvas(e), "FOO"), "FOO css class was removed");
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
                hoverPaintStyle: { stroke: "red" }
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
        equal(c.getPaintStyle().stroke, "green", "connection has stroke style specified in Endpoint type's `connectorStyle` property");
        equal(c.getHoverPaintStyle().strokeWidth, 534, "connection has hover style specified in Endpoint type");
        equal(c.connector.type, "Flowchart", "connector is Flowchart");
        equal(_length(c.overlays), 1, "connector has one overlay");
        equal(_length(e1.overlays), 0, "endpoint has no overlays");
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
            edgeType: "basic",
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


    test(" multiple types, type set on `connect` call", function () {
        _jsPlumb.importDefaults({
            paintStyle:{strokeWidth:10, stroke:"red"}
        });
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO",
            endpoint:"Blank"
        };
        var otherType = {
            connector: "Straight",
            paintStyle: { stroke: "red", strokeWidth: 14 },
            hoverPaintStyle: { stroke: "green" },
            cssClass: "BAR",
            endpoint:"Rectangle"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        _jsPlumb.manageAll([d1, d2])


        // make a connection with type not provided; we should get the jsplumb defaults
        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getPaintStyle().strokeWidth, 10, "connect without type specified gives default type");
        ok(!_jsPlumb.hasClass(support.getConnectionCanvas(c), "FOO"), "css class not set on connector");

        // make a connection whose type matches a registered type
        var c2 = _jsPlumb.connect({source: d1, target: d2, type:"basic"});
        equal(c2.getPaintStyle().strokeWidth, 4, "connect with type specified matches");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c2), "FOO"), "css class set on connector");
        equal(c2.endpoints[0].endpoint.type, "Blank", "source endpoint is blank, per basic type spec");

        var c3 = _jsPlumb.connect({source: d1, target: d2, type:"other"});
        equal(c3.getPaintStyle().strokeWidth, 14, "connect with type specified matches");
        ok(_jsPlumb.hasClass(support.getConnectionCanvas(c3), "BAR"), "css class set on connector");
        equal(c3.endpoints[0].endpoint.type, "Rectangle", "source endpoint is Rectangle, per basic type spec");



    });

    test("changing type does not hide overlays", function() {

        var canvas = support.addDiv("canvas", null, null, 0, 0, 500, 500 ),
            d1 = support.addDiv("d1", canvas, null, 50, 50, 150, 150),
            d2 = support.addDiv("d2", canvas, null, 300,300,150,150);

        var jpInstance = jsPlumb.newInstance({
            container: canvas,
            anchor: 'Continuous',
            endpoint: {
                type: 'Dot',
                options: {
                    radius: 2
                }
            },
            connectionOverlays: [
                {
                    type:'Arrow',
                    options:{
                        location: 1,
                        id: 'arrow',
                        length: 8,
                        width: 10,
                        foldback: 1
                    }
                },
                {
                    type:'Label',
                    options:{
                        location: 0.5,
                        id: 'label',
                        label: "foo"
                    }
                }
            ],
            paintStyle: {
                stroke: '#b6b6b6',
                strokeWidth: 2,
                outlineStroke: 'transparent',
                outlineWidth: 4
            },
            hoverPaintStyle: {
                stroke: '#545454',
                zIndex: 6
            }
        });

        jpInstance.registerConnectionType('default', {
            connector: {
                type:'Flowchart',
                options:{
                    cornerRadius: 10,
                    gap: 10,
                    stub: 15
                }
            },
            cssClass: 'transition'
        });

        jpInstance.registerConnectionType('loopback', {
            connector: { type:'StateMachine', options:{
                loopbackRadius: 10
            }},
            cssClass: 'transition'
        });

        var con1 = jpInstance.connect({
            source: d1,
            target: d1,
            type: 'loopback'
        });

        var con2 = jpInstance.connect({
            source: d2,
            target: d2,
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


QUnit.config.reorder = false;

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

var testSuite = function (_jsPlumb) {

    var renderMode = jsPlumb.SVG;
    support = jsPlumbTestSupport.getInstance(_jsPlumb);

    module("Make Target", {
        teardown: function () {
            _cleanup(_jsPlumb);
        },
        setup: function () {
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
            _jsPlumb.setContainer("container");
        }
    });

    // setup the container
    var container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    test("sanity", function() {
        equal(1,1);
    });

    test(": makeSource (test basic structures created)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");

        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.makeTarget(d16, { isSource: true, anchor: "LeftMiddle", connectionType:"someType"  }); // give it a non-default anchor, we will check this below.

        equal(d17._jsPlumbTargetDefinitions.length, 1, "1 target definition on d17");
        equal(d16._jsPlumbTargetDefinitions.length, 1, "1 target definition on d16");

        equal(d17._jsPlumbTargetDefinitions[0].def.connectionType, "default", "d17's target def connectionType is 'default'");
        equal(d16._jsPlumbTargetDefinitions[0].def.connectionType, "someType", "d16's target def connectionType is 'someType'");
    });

    // ******************  makeTarget (and associated methods) tests ********************************************

    test(": _jsPlumb.makeTarget (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "TopCenter"  });
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);

        equal("default", d17._jsPlumbTargetDefinitions[0].def.connectionType);
    });

    test(": _jsPlumb.makeTarget (specify two divs in an array)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget([d16, d17], { isTarget: true, anchor: "TopCenter"  });
        equal(true, d16.getAttribute(support.isTargetAttribute) != null);
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);
    });

    test(": _jsPlumb.makeTarget (specify two divs by id in an array)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(["d16", "d17"], { isTarget: true, anchor: "TopCenter"  });
        equal(true, d16.getAttribute(support.isTargetAttribute) != null);
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);
    });

    test(": _jsPlumb.makeTarget (specify divs by selector)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        jsPlumb.addClass(d16, "FOO");
        jsPlumb.addClass(d17, "FOO");
        _jsPlumb.makeTarget(jsPlumb.getSelector(".FOO"), { isTarget: true, anchor: "TopCenter"  });
        equal(true, d16.getAttribute(support.isTargetAttribute) != null);
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);
    });

    test(": _jsPlumb.connect after makeTarget (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);
        _jsPlumb.connect({source: e16, target: "d17"});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e.length, 1, "d17 has one endpoint");
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
    });

    test(": _jsPlumb.connect after makeTarget (simple case, two connect calls)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);
        _jsPlumb.connect({source: e16, target: "d17"});
        _jsPlumb.connect({source: e16, target: "d17"});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 2, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
    });

    test(": _jsPlumb.connect after makeTarget (simple case, two connect calls, uniqueEndpoint set)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle", uniqueEndpoint: true, maxConnections: -1  }); // give it a non-default anchor, we will check this below.
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);
        _jsPlumb.connect({source: e16, target: "d17"});
        _jsPlumb.connect({source: e16, target: "d17"});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].connections.length, 2, "endpoint on d17 has two connections");
    });

    test(": _jsPlumb.connect after makeTarget (newConnection:true specified)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        equal(true, d17.getAttribute(support.isTargetAttribute) != null);
        _jsPlumb.connect({source: e16, target: "d17", newConnection: true});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e[0].anchor.x, 0.5, "anchor is BottomCenter"); //here we should be seeing the default anchor
        equal(e[0].anchor.y, 1, "anchor is BottomCenter"); //here we should be seeing the default anchor
    });

    test(": jsPlumb.isTarget and jsPlumb.isTargetEnabled", function () {
        var d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isTarget(d17) == true, "d17 is recognised as connection target");
        ok(_jsPlumb.isTargetEnabled(d17) == true, "d17 is recognised as enabled");
        _jsPlumb.setTargetEnabled(d17, false);
        ok(_jsPlumb.isTargetEnabled(d17) == false, "d17 is recognised as disabled");
    });

    test(": _jsPlumb.makeTarget - endpoints deleted by default.", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeSource(d16);
        _jsPlumb.makeTarget(d17);

        var c = _jsPlumb.connect({source: "d16", target: "d17"});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        support.assertEndpointCount("d16", 0, _jsPlumb);
        support.assertEndpointCount("d17", 0, _jsPlumb);
    });

    // maketarget, then unmake it. should not be able to make a connection to it.
    test(": jsPlumb.unmakeTarget (string id as argument)", function () {
        var d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isTarget(d17) === true, "d17 is currently a target");
        ok(d17.getAttribute(support.isTargetAttribute) != null, "the jtk-target attribute is set");
        // unmake target
        _jsPlumb.unmakeTarget(d17);
        ok(_jsPlumb.isTarget(d17) === false, "d17 is no longer a target");
        ok(d17.getAttribute(support.isTargetAttribute) == null, "the jtk-target attribute is no longer set");

    });

    test(": jsPlumb.unmakeTarget, multiple targets, removing one does not strip attributes from element.", function () {
        var d17 = support.addDiv("d17");

        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle"  });
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle", connectionType:"someConnection" });

        ok(_jsPlumb.isTarget(d17) == true, "d17 is currently a target");
        ok(d17.getAttribute(support.isTargetAttribute) != null, "the jtk-target attribute is set");
        // unmake target
        _jsPlumb.unmakeTarget(d17, "someConnection");
        ok(_jsPlumb.isTarget(d17) == true, "d17 is still currently a target");
        ok(d17.getAttribute(support.isTargetAttribute) != null, "the jtk-target attribute is still set");

    });

    test(": jsPlumb.unmakeTarget, multiple targets, remove all via type='*'.", function () {
        var d17 = support.addDiv("d17");

        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle"  });
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle", connectionType:"someConnection" });

        ok(_jsPlumb.isTarget(d17) == true, "d17 is currently a target");
        ok(d17.getAttribute(support.isTargetAttribute) != null, "the jtk-target attribute is set");

        // unmake target
        _jsPlumb.unmakeTarget(d17, "*");
        ok(d17.getAttribute(support.isTargetAttribute) == null, "the jtk-target attribute is not set");
        ok(_jsPlumb.isTarget(d17) == false, "d17 is no longer a target");

    });


};

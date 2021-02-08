QUnit.config.reorder = false;

var defaults = null, support, _jsPlumb;

var testSuite = function () {

    module("Make Source", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumbBrowserUI.newInstance({container:container});
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
        }
    });

    test("sanity", function() {
        equal(1,1);
    });

    test(": _jsPlumb.connect after makeSource (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
    });


    test(": _jsPlumb.connect after makeSource (simple case, two connect calls)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 2);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
    });

    test(": makeSource/makeTarget scope", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeTarget(d16, {scope: "foo"});
        _jsPlumb.makeTarget(d18, {scope: "bar"});
        _jsPlumb.makeSource(d17, { scope: "foo" }); // give it a non-default anchor, we will check this below.
        var c = _jsPlumb.connect({source: d17, target: d16});
        ok(c != null, "connection with matching scope established");
        c = _jsPlumb.connect({source: d17, target: d18});
        ok(c == null, "connection with non-matching scope not established");
    });

    test(": makeSource, manipulate scope programmatically", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeSource(d16, {scope: "foo", isSource: true, maxConnections: -1});
        _jsPlumb.makeTarget(d17, {scope: "bar", maxConnections: -1});
        _jsPlumb.makeTarget(d18, {scope: "qux", maxConnections: -1});

        equal(_jsPlumb.getSourceScope(d16), "foo", "scope of makeSource element retrieved");
        equal(_jsPlumb.getTargetScope(d17), "bar", "scope of makeTarget element retrieved");

        var c = _jsPlumb.connect({source: d16, target: d17});
        ok(c == null, "connection was established");

        // change scope of source, then try to connect, and it should fail.
        _jsPlumb.setSourceScope(d16, "qux");
        c = _jsPlumb.connect({source: d16, target: d17});
        ok(c == null, "connection was not established due to unmatched scopes");

        _jsPlumb.setTargetScope(d17, "foo qux");
        equal(_jsPlumb.getTargetScope(d17), "foo qux", "scope of makeTarget element retrieved");
        c = _jsPlumb.connect({source: d16, target: d17});
        ok(c != null, "connection was established now that scopes match");

        _jsPlumb.makeSource(d17);
        _jsPlumb.setScope(d17, "BAZ");
        // use setScope method to set source _and_ target scope
        equal(_jsPlumb.getTargetScope(d17), "BAZ", "scope of target element retrieved");
        equal(_jsPlumb.getSourceScope(d17), "BAZ", "scope of source element retrieved");

        // getScope will give us what it can, defaulting to source scope.
        equal(_jsPlumb.getScope(d16), "qux", "source scope retrieved for d16");
        equal(_jsPlumb.getScope(d18), "qux", "target scope retrieved for d18");
        equal(_jsPlumb.getScope(d17), "BAZ", "source scope retrieved for d17, although target scope is set too");

    });


    test(": _jsPlumb.connect after makeSource (parameters)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle", parameters: { foo: "bar"}  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].getParameter("foo"), "bar", "parameter was set on endpoint made from makeSource call");
    });

    test(": _jsPlumb.connect after makeTarget (simple case, two connect calls, uniqueEndpoint set)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle", uniqueEndpoint: true, maxConnections: -1  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16});
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].connections.length, 2, "endpoint on d17 has two connections");
    });

    test(": makeSource, create endpoint immediately", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d16, {isSource: false, isTarget: true, maxConnections: -1});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle", createEndpoint: true, maxConnections: -1  }); // give it a non-default anchor, we will check this below.

        // _jsPlumb.connect({source: "d17", target: e16});
        // _jsPlumb.connect({source: "d17", target: e16});
        // support.assertEndpointCount("d16", 1, _jsPlumb);

        // even though there has been no connections made the endpoint should exist.
        support.assertEndpointCount(d17, 1);
        // but not for d16
        support.assertEndpointCount(d16, 0);

        // now connect d17 twice to d16, there should still be only one endpoint for 17, and now two for 16
        _jsPlumb.connect({source: d17, target: d16});
        _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d17, 1);
        support.assertEndpointCount(d16, 2);

        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].connections.length, 2, "endpoint on d17 has two connections");
    });

    test(": makeTarget, create endpoint immediately", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d16, {isSource: false, isTarget: true, createEndpoint: true, maxConnections: -1});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle", maxConnections: -1  }); // give it a non-default anchor, we will check this below.


        // even though there has been no connections made the endpoint should exist.
        support.assertEndpointCount(d16, 1);
        // but not for d17
        support.assertEndpointCount(d17, 0);

        // now connect d17 twice to d16, there should still be only one endpoint for 16, and now two for 17
        _jsPlumb.connect({source: d17, target: d16});
        _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d17, 2);
        support.assertEndpointCount(d16, 1);
    });

    test(": makeSource/makeTarget, create endpoint immediately", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d16, {isSource: false, isTarget: true, createEndpoint: true, maxConnections: -1});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle", createEndpoint: true,  maxConnections: -1  }); // give it a non-default anchor, we will check this below.


        // even though there has been no connections made the endpoint should exist.
        support.assertEndpointCount(d16, 1);
        // and for d17
        support.assertEndpointCount(d17, 1);

        // now connect d17 twice to d16, there should still be only one endpoint for 16 and 17
        var c1 = _jsPlumb.connect({source: d17, target: d16});
        var c2 = _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d17, 1);
        support.assertEndpointCount(d16, 1);

        // disconnect the connections. the endpoints should stick around.
        _jsPlumb.deleteConnection(c1);
        _jsPlumb.deleteConnection(c2);
        equal(0, _jsPlumb.select().length, "no connections left in instance");

        support.assertEndpointCount(d17, 1);
        support.assertEndpointCount(d16, 1);
    });

    test(": _jsPlumb.connect after makeTarget (newConnection:true specified)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.connect({source: d17, target: e16, newConnection: true});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].anchor.x, 0.5, "anchor is BottomCenter"); //here we should be seeing the default anchor
        equal(e[0].anchor.y, 1, "anchor is BottomCenter"); //here we should be seeing the default anchor
    });

    // makeSource, then disable it. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and setSourceEnabled(false) (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.setSourceEnabled(d17, false);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

    // makeSource, then disable it. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and setSourceEnabled(false) (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.setSourceEnabled(d17, false);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

    // makeSource, then toggle its enabled state. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and toggleSourceEnabled() (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);

        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    // makeSource, then disable it. should not be able to make a connection from it.
    test(": _jsPlumb.connect after makeSource and toggleSourceEnabled() (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
        _jsPlumb.toggleSourceEnabled(d17);
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    test(": jsPlumb.isSource and jsPlumb.isSourceEnabled", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isSource(d17) == true, "d17 is recognised as connection source");
        ok(_jsPlumb.isSourceEnabled(d17) == true, "d17 is recognised as enabled");
        _jsPlumb.setSourceEnabled(d17, false);
        ok(_jsPlumb.isSourceEnabled(d17) == false, "d17 is recognised as disabled");

        equal(_jsPlumb.isSource(d17), true, "d17 is recognised as a source when provided as a string");

        try {
            _jsPlumb.isSource(null);
            ok(true, "requesting isSource with null argument doesnt throw an error");
        } catch(e) {
            ok(false, "requesting isSource with null argument threw an error when it shouldnt have");
        }
    });

    // makeSource, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (elements as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        var originallyEnabled = _jsPlumb.setTargetEnabled(d17, false);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);

        // tests for css class for disabled target
        ok(_jsPlumb.hasClass(d17, "jtk-target-disabled"), "disabled class added");

        ok(originallyEnabled, "setTargetEnabled returned the original enabled value of true when setting to false");
        originallyEnabled = _jsPlumb.setTargetEnabled(d17, true);
        ok(!originallyEnabled, "setTargetEnabled returned the previous enabled value of false when setting to true");

        ok(!d17.classList.contains("jtk-target-disabled"), "disabled class removed")
    });

    // makeSource, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (DOM element as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        var originallyEnabled = _jsPlumb.setTargetEnabled(d17, false);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);


        // tests for css class for disabled target
        ok(_jsPlumb.hasClass(d17, "jtk-target-disabled"), "disabled class added");

        ok(originallyEnabled, "setTargetEnabled returned the original enabled value of true when setting to false");
        originallyEnabled = _jsPlumb.setTargetEnabled(d17, true);
        ok(!originallyEnabled, "setTargetEnabled returned the previous enabled value of false when setting to true");

        ok(!_jsPlumb.hasClass(d17, "jtk-target-disabled"), "disabled class removed");
    });

    // makeTarget, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and setTargetEnabled(false) (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.setTargetEnabled(d17, false);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

    // makeTarget, then toggle its enabled state. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and toggleTargetEnabled() (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);

        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    // makeTarget, then disable it. should not be able to make a connection to it.
    test(": _jsPlumb.connect after makeTarget and toggleTargetEnabled() (div as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
        _jsPlumb.toggleTargetEnabled(d17);
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
    });

    test(": jsPlumb.isTarget and jsPlumb.isTargetEnabled", function () {
        var d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isTarget(d17) === true, "d17 is recognised as connection target");
        ok(_jsPlumb.isTargetEnabled(d17) === true, "d17 is recognised as enabled");
        _jsPlumb.setTargetEnabled(d17, false);
        ok(_jsPlumb.isTargetEnabled(d17) === false, "d17 is recognised as disabled");

        equal(_jsPlumb.isTarget(d17), true, "d17 is recognised as a target when provided as a string");

        try {
            _jsPlumb.isTarget(null);
            ok(true, "requesting isTarget with null argument doesnt throw an error");
        } catch(e) {
            ok(false, "requesting isTarget with null argument threw an error when it shouldnt have");
        }
    });

    test(": _jsPlumb.makeTarget - endpoints deleted by default when they have no more connections", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeSource(d16);
        _jsPlumb.makeTarget(d17);

        var c = _jsPlumb.connect({source: d16, target: d17});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        support.assertEndpointCount(d16, 0, _jsPlumb);
        support.assertEndpointCount(d17, 0, _jsPlumb);
    });

// setSource/setTarget methods.


    test(": _jsPlumb.setSource (element)", function () {

        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");

        var c = _jsPlumb.connect({source: d16, target: d17, endpoint: "Rectangle"});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        ok(_jsPlumb.hasClass(d16, "jtk-connected"), "d16 has jtk-connected class");
        ok(_jsPlumb.hasClass(d17, "jtk-connected"), "d17 has jtk-connected class");
        ok(!_jsPlumb.hasClass(d18, "jtk-connected"), "d18 does not have jtk-connected class");

        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");
        equal(c.endpoints[0].connections.length, 1, "endpoint has one connection");

        _jsPlumb.setSource(c, d18);
        equal(c.source.id, "d18", "source is now d18");
        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "endpoint is still type Rectangle");
        equal(c.endpoints[0].connections.length, 1, "endpoint has one connection");

        ok(_jsPlumb.hasClass(d18, "jtk-connected"), "d18 has jtk-connected class");
        ok(_jsPlumb.hasClass(d17, "jtk-connected"), "d17 has jtk-connected class");
        ok(!_jsPlumb.hasClass(d16, "jtk-connected"), "d16 does not have jtk-connected class");

        equal(sc, true, "connection:move event fired");

        // test we dont overwrite if the source is already the element
        c.endpoints[0].original = true;
        _jsPlumb.setSource(c, d18);
        equal(c.endpoints[0].original, true, "redundant setSource call ignored");
    });

    test(": _jsPlumb.setSource (endpoint)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var ep = _jsPlumb.addEndpoint(d18), ep2 = _jsPlumb.addEndpoint(d18);

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setSource(c, ep);
        equal(c.source.id, "d18", "source is now d18");

        // test that new endpoint is set (different from the case that an element or element id was given)
        c.endpoints[0].original = true;
        _jsPlumb.setSource(c, ep2);
        equal(c.endpoints[0].original, undefined, "setSource with new endpoint honoured");

    });

    test(": _jsPlumb.setSource (element, with makeSource)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeSource(d18, {
            endpoint: "Rectangle"
        });

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setSource(c, d18);
        equal(c.source.id, "d18", "source is now d18");
        equal(c.endpoints[0].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");

        // test we dont overwrite if the source is already the element
        c.endpoints[0].original = true;
        _jsPlumb.setSource(c, d18);
        equal(c.endpoints[0].original, true, "redundant setSource call ignored");
    });


    test(": _jsPlumb.setTarget (element)", function () {

        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");

        var c = _jsPlumb.connect({source: d16, target: d17, endpoint: "Rectangle"});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");

        _jsPlumb.setTarget(c, d18);
        equal(c.target.id, "d18", "source is now d18");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "endpoint is still type Rectangle");

        equal(sc, true, "connection:move event fired");

        // test we dont overwrite if the target is already the element
        c.endpoints[1].original = true;
        _jsPlumb.setTarget(c, d18);
        equal(c.endpoints[1].original, true, "redundant setTarget call ignored");
    });

    test(": _jsPlumb.setTarget (endpoint)", function () {
        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var ep = _jsPlumb.addEndpoint(d18), ep2 = _jsPlumb.addEndpoint(d18);

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setTarget(c, ep);
        equal(c.target.id, "d18", "source is now d18");

        equal(sc, true, "connection:move event fired");

        // test that new endpoint is set (different from the case that an element or element id was given)
        c.endpoints[1].original = true;
        _jsPlumb.setTarget(c, ep2);
        equal(c.endpoints[1].original, undefined, "setTarget with new endpoint honoured");
    });

    test(": _jsPlumb.setTarget (element, with makeSource)", function () {
        var sc = false;
        _jsPlumb.bind("connection:move", function () {
            sc = true;
        });

        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeTarget(d18, {
            endpoint: "Rectangle",
            cssClass:"CHANGED"
        });

        var c = _jsPlumb.connect({source: d16, target: d17});
        equal(c.source.id, "d16");
        equal(c.target.id, "d17");

        _jsPlumb.setTarget(c, d18);
        equal(c.target.id, "d18", "source is now d18");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "endpoint is type Rectangle");
        ok(_jsPlumb.hasClass(c.endpoints[1].endpoint.canvas, "CHANGED"), "endpoint CSS class has 'CHANGED'");

        equal(sc, true, "connection:move event fired");

        // test we dont overwrite if the target is already the element
        c.endpoints[1].original = true;
        _jsPlumb.setTarget(c, d18);
        equal(c.endpoints[1].original, true, "redundant setTarget call ignored");
    });


// end setSource/setTarget methods.

    test(": _jsPlumb.makeSource (parameters)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            params = { "foo": "foo" },
            e16 = _jsPlumb.addEndpoint(d16, { parameters: params });

        _jsPlumb.makeSource(d17, {
            isSource: true,
            parameters: params
        });

        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
        var e = _jsPlumb.getEndpoints(d17);
        equal(e[0].getParameter("foo"), "foo", "makeSource created endpoint has parameters");
        equal(e16.getParameter("foo"), "foo", "normally created endpoint has parameters");
    });

    // makeSource, then unmake it. should not be able to make a connection from it. then connect to it, which should succeed,
    // because jsPlumb will just add a new endpoint.
    test(": jsPlumb.unmakeSource (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: false, isTarget: true}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isSource(d17) === true, "d17 is currently a source");
        // unmake source
        _jsPlumb.unmakeSource(d17);
        ok(_jsPlumb.isSource(d17) === false, "d17 is no longer a source");

        // this should succeed, because d17 is no longer a source and so jsPlumb will just create and add a new endpoint to d17.
        _jsPlumb.connect({source: d17, target: e16});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
    });

    // maketarget, then unmake it. should not be able to make a connection to it.
    test(": jsPlumb.unmakeTarget (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isSource: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        ok(_jsPlumb.isTarget(d17) === true, "d17 is currently a target");
        // unmake target
        _jsPlumb.unmakeTarget(d17);
        ok(_jsPlumb.isTarget(d17) === false, "d17 is no longer a target");

        // this should succeed, because d17 is no longer a target and so jsPlumb will just create and add a new endpoint to d17.
        _jsPlumb.connect({source: e16, target: d17});
        support.assertEndpointCount(d16, 1);
        support.assertEndpointCount(d17, 1);
    });


    test(": jsPlumb.removeEverySource and removeEveryTarget (string id as argument)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        _jsPlumb.makeSource(d16).makeTarget(d17).makeSource(d18);
        ok(_jsPlumb.isSource(d16) === true, "d16 is a source");
        ok(_jsPlumb.isTarget(d17) === true, "d17 is a target");
        ok(_jsPlumb.isSource(d18) === true, "d18 is a source");

        _jsPlumb.unmakeEverySource();
        _jsPlumb.unmakeEveryTarget();

        ok(_jsPlumb.isSource(d16) === false, "d16 is no longer a source");
        ok(_jsPlumb.isTarget(d17) === false, "d17 is no longer a target");
        ok(_jsPlumb.isSource(d18) === false, "d18 is no longer a source");
    });

    test(": connectorOverlays", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");

        _jsPlumb.makeSource(d17, { isSource: true, anchor: "LeftMiddle", connectorOverlays:[
            ["Label", {label:"FOO", id:"overlay"}]
        ]  });

        var c = _jsPlumb.connect({source: d17, target: d16});
        support.assertEndpointCount(d16, 1, _jsPlumb);
        support.assertEndpointCount(d17, 1, _jsPlumb);

        ok(c.getOverlay("overlay") != null);
    });


// ------------------------ filters and port ids ---------------------------------------------

    //
    // basic source filter setup - a single makeSource call on an element, with a filter.
    //
    test("source filter, ", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250);

        //_addDiv = function (id, parent, className, x, y, w, h) {

        var d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50);
        d16s.style.position = "absolute";

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            filter:".source"
        });

        _jsPlumb.makeTarget(d17);

        var c = support.dragConnection(d16, d17);
        ok(c == null, "no connection - source filter prevented it");

        c = support.dragConnection(d16s, d17);
        ok(c != null, "connection established - source filter allowed it");
    });

    //
    // more advanced source filter setup - two makeSource calls on an element, one with a filter that excludes it.
    //
    // the connection's source endpoint should provide the appropriate `portId`.
    //
    test("source filter, ", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50);

        d16s.style.position = "absolute";

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            filter:".source",
            filterExclude:true
        });

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            portId:"port2"
        });

        _jsPlumb.makeTarget(d17);

        var c = support.dragConnection(d16s, d17);
        ok(c != null, "connection established - the source config without a filter allowed it.");

        equal(c.endpoints[0].portId, "port2", "port2 is the id of the source port");
    });

    test("target filter, single target zone", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50);

        d16s.style.position = "absolute";
        d17t.style.position = "absolute";

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            filterExclude:true,
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            portId:"port2"
        });

        var c = support.dragConnection(d16, d17t, true);
        ok(c != null, "connection established - the target config without a filter allowed it.");

        equal(c.endpoints[1].portId, "port2", "port2 is the id of the target port");
    });

    test("target filter, two target zones", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50),
            d17t2 = support.addDiv("d17target2", d17, "target2", 10, 10, 50, 50);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target2",
            portId:"port2"
        });

        var c = support.dragConnection(d16, d17t, true);
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");
        var c2 = support.dragConnection(d16, d17t2, true);
        equal(c2.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
    });

    test("target filter, two source and two target zones", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50),
            d16s2 = support.addDiv("d16source2", d16, "source2", 10, 10, 50, 50),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50),
            d17t2 = support.addDiv("d17target2", d17, "target2", 10, 10, 50, 50);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            filter:".source",
            portId:"port1"
        });

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            filter:".source2",
            portId:"port2"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target2",
            portId:"port2"
        });

        var c = support.dragConnection(d16s, d17t, true);
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");

        c = support.dragConnection(d16s, d17t2, true);
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");

        c = support.dragConnection(d16s2, d17t, true);
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");

        c = support.dragConnection(d16s2, d17t2, true);
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
    });

    test("target filter, two source and two target zones, programmatic", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d16s = support.addDiv("d16source", d16, "source", 10, 10, 50, 50),
            d16s2 = support.addDiv("d16source2", d16, "source2", 10, 10, 50, 50),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250),
            d17t = support.addDiv("d17target", d17, "target", 10, 10, 50, 50),
            d17t2 = support.addDiv("d17target2", d17, "target2", 10, 10, 50, 50);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            filter:".source",
            portId:"port1",
            endpoint:"Blank"
        });

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            filter:".source2",
            portId:"port2"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target",
            portId:"port1"
        });

        _jsPlumb.makeTarget(d17, {
            filter:".target2",
            portId:"port2",
            endpoint:"Rectangle"
        });

        var c = _jsPlumb.connect({source:d16, target:d17, ports:["port1", "port1"]});
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Blank", "source endpoint type derived from the port1 source spec");
        equal(c.endpoints[1].endpoint.getType(), "Dot", "target endpoint type derived from the default");

        c = _jsPlumb.connect({source:d16, target:d17, ports:["port1", "port2"]});
        equal(c.endpoints[0].portId, "port1", "connection shows `port1` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Blank", "source endpoint type derived from the port1 source spec");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint type derived from the port2 target spec");

        c = _jsPlumb.connect({source:d16, target:d17, ports:["port2", "port1"]});
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port1", "connection shows `port1` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Dot", "source endpoint type derived from the default");
        equal(c.endpoints[1].endpoint.getType(), "Dot", "target endpoint type derived from the default");

        c = _jsPlumb.connect({source:d16, target:d17, ports:["port2", "port2"]});
        equal(c.endpoints[0].portId, "port2", "connection shows `port2` as source port id");
        equal(c.endpoints[1].portId, "port2", "connection shows `port2` as target port id");
        equal(c.endpoints[0].endpoint.getType(), "Dot", "source endpoint type derived from the default");
        equal(c.endpoints[1].endpoint.getType(), "Rectangle", "target endpoint type derived from the port2 target spec");
    });

    test("makeTarget allowLoopback false", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle"
        });

        _jsPlumb.makeTarget(d16, {
            // allowLooopback defaults to true
        });

        var c = support.dragConnection(d16, d16, true);
        ok(c != null, "connection established on d16 - the target config allows, by default, loopback connections");

        _jsPlumb.makeSource(d17, {
            isSource: true,
            anchor: "LeftMiddle"
        });

        _jsPlumb.makeTarget(d17, {
            allowLoopback:false
        });

        c = support.dragConnection(d17, d17, true);
        ok(c == null, "connection not established - the target config does not allow loopback connections");
    });

    test("makeSource allowLoopback false", function () {
        var d16 = support.addDiv("d16", null, "", 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, "", 350, 350, 250, 250);

        _jsPlumb.makeSource(d16, {
            isSource: true,
            anchor: "LeftMiddle",
            // allowLooopback defaults to true
        });

        _jsPlumb.makeTarget(d16, {

        });

        var c = support.dragConnection(d16, d16, true);
        ok(c != null, "connection established on d16 - the source config allows, by default, loopback connections");

        _jsPlumb.makeSource(d17, {
            isSource: true,
            anchor: "LeftMiddle",
            allowLoopback:false
        });

        _jsPlumb.makeTarget(d17, {

        });

        c = support.dragConnection(d17, d17, true);
        ok(c == null, "connection not established - the source config does not allow loopback connections");
    });

    // 1. two sources on one element, single target, mouse

    // 2. two sources on one element, two target zones on target element, mouse

    // 3. two sources on one element, single target, programmatic

    // 4. two sources on one element, two target zones on target element, programmatic

};

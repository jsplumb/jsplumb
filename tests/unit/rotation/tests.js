// _jsPlumb qunit tests.

QUnit.config.reorder = false;

/**
 * @name Test
 * @class
 */

var VERY_SMALL_NUMBER = 0.00000000001;
// helper to test that a value is the same as some target, within our tolerance
// sometimes the trigonometry stuff needs a little bit of leeway.
var within = function (val, target, _ok, msg) {
    _ok(Math.abs(val - target) < VERY_SMALL_NUMBER, msg + "[expected: " + target + " got " + val + "] [diff:" + (Math.abs(val - target)) + "]");
};
var defaults = null, support,
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

    module("Rotations", {
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

    // element rotation, fixed anchors.
    test("element rotation, fixed anchors", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50), d17 = support.addDiv("d17", null, null, 250, 250);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "Bottom"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Top"});
        _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });

        var e16Loc = e16.anchor.lastReturnValue.slice(),
            e17Loc = e17.anchor.lastReturnValue.slice();

        equal(e16Loc[0], 100, "e16 x position is correct initially");
        equal(e16Loc[1], 200, "e16 y position is correct initially");
        equal(e17Loc[0], 300, "e17 x position is correct initially");
        equal(e17Loc[1], 250, "e17 y position is correct initially");

        equal(e16.anchor.getOrientation()[0], 0, "e16 x orientation is correct initially");
        equal(e16.anchor.getOrientation()[1], 1, "e16 y orientation is correct initially");
        equal(e17.anchor.getOrientation()[0], 0, "e17 x orientation is correct initially");
        equal(e17.anchor.getOrientation()[1], -1, "e17 y orientation is correct initially");

        // now rotate e16 by 90 degrees
        _jsPlumb.rotate("d16", 90);

        var e16Loc2 = e16.anchor.lastReturnValue.slice();
        var e17Loc2 = e17.anchor.lastReturnValue.slice();

        equal("center center", d16.style.transformOrigin, "transform origin was set");
        equal(d16.style.transform, "rotate(90deg)", "rotate transform was set");

        equal(e16Loc2[0], 25, "e16 x position is correct after rotation of d16");
        equal(e16Loc2[1], 125, "e16 y position is correct after rotation of d16");
        // these unchanged currently
        equal(e17Loc2[0], 300, "e17 x position is unchanged after rotation of d16");
        equal(e17Loc2[1], 250, "e17 y position is unchanged after rotation of d16");

        // rotate d17 by 90 degrees
        _jsPlumb.rotate("d17", 90);

        var e16Loc3 = e16.anchor.lastReturnValue.slice();
        var e17Loc3 = e17.anchor.lastReturnValue.slice();

        equal("center center", d17.style.transformOrigin, "d17 transform origin was set");
        equal(d17.style.transform, "rotate(90deg)", "d17 rotate transform was set");
        equal(e16Loc3[0], 25, "e16 x position is correct after rotation of 1d7");
        equal(e16Loc3[1], 125, "e16 y position is correct after rotation of d17");
        // these unchanged currently
        equal(e17Loc3[0], 375, "e17 x position is correct after rotation of d17");
        equal(e17Loc3[1], 325, "e17 y position is correct after rotation of d17");
    });

    test("element rotation, dynamic anchors ('auto default')", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50), d17 = support.addDiv("d17", null, null, 250, 250);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "AutoDefault"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "AutoDefault"});
        _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });

        var e16Loc = e16.anchor.lastReturnValue.slice(),
            e17Loc = e17.anchor.lastReturnValue.slice();

        equal(e16Loc[0], 150, "e16 x position is correct initially");
        equal(e16Loc[1], 125, "e16 y position is correct initially");
        equal(e17Loc[0], 250, "e17 x position is correct initially");
        equal(e17Loc[1], 325, "e17 y position is correct initially");

        equal(e16.anchor.getOrientation()[0], 1, "e16 x orientation is correct initially");
        equal(e16.anchor.getOrientation()[1], 0, "e16 y orientation is correct initially");
        equal(e17.anchor.getOrientation()[0], -1, "e17 x orientation is correct initially");
        equal(e17.anchor.getOrientation()[1], 0, "e17 y orientation is correct initially");

        // now rotate e16 by 90 degrees
        _jsPlumb.rotate("d16", 90);

        var e16Loc2 = e16.anchor.lastReturnValue.slice();
        var e17Loc2 = e17.anchor.lastReturnValue.slice();

        equal("center center", d16.style.transformOrigin, "transform origin was set");
        equal(d16.style.transform, "rotate(90deg)", "rotate transform was set");

        equal(e16Loc2[0], 100, "e16 x position is correct after rotation of d16");
        equal(e16Loc2[1], 175, "e16 y position is correct after rotation of d16");
        // these unchanged currently
        equal(e17Loc2[0], 250, "e17 x position is unchanged after rotation of d16");
        equal(e17Loc2[1], 325, "e17 y position is unchanged after rotation of d16");

        // rotate d17 by 90 degrees
        _jsPlumb.rotate("d17", 90);

        var e16Loc3 = e16.anchor.lastReturnValue.slice();
        var e17Loc3 = e17.anchor.lastReturnValue.slice();

        equal("center center", d17.style.transformOrigin, "d17 transform origin was set");
        equal(d17.style.transform, "rotate(90deg)", "d17 rotate transform was set");
        equal(e16Loc3[0], 100, "e16 x position is correct after rotation of 1d7");
        equal(e16Loc3[1], 175, "e16 y position is correct after rotation of d17");
        equal(e17Loc3[0], 300, "e17 x position is correct after rotation of d17");
        equal(e17Loc3[1], 275, "e17 y position is correct after rotation of d17");
    });

    test("element rotation, continuous anchors", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50), d17 = support.addDiv("d17", null, null, 250, 250);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "Continuous"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Continuous"});
        _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });

        equal(e16.anchor.getCurrentFace(), "right", "e16's anchor face is 'right'") ;
        equal(e17.anchor.getCurrentFace(), "top", "e17's anchor face is 'top'");

        // now rotate e16 by 180 degrees
        _jsPlumb.rotate("d16", 180);

        equal(e16.anchor.getCurrentFace(), "left", "e16's anchor face is 'left'") ;
        equal(e17.anchor.getCurrentFace(), "top", "e17's anchor face is 'top'");

        // rotate d17 by 90 degrees
        _jsPlumb.rotate("d17", 90);

        equal(e16.anchor.getCurrentFace(), "top", "e16's anchor face is 'top'") ;
        equal(e17.anchor.getCurrentFace(), "bottom", "e17's anchor face is 'bottom'");

        equal("center center", d17.style.transformOrigin, "d17 transform origin was set");
        equal(d17.style.transform, "rotate(90deg)", "d17 rotate transform was set");
    });

};


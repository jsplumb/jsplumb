// _jsPlumb qunit tests.

QUnit.config.reorder = false;


console.log(window.top)

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

    module("Rotations", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance({container:document.getElementById("container")});
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });

    // element rotation, fixed anchors.
    test("element rotation, fixed anchors", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50), d17 = support.addDiv("d17", null, null, 250, 250);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "Bottom"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Top"});
        var c = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" }),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor

        var e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        equal(e16Loc.curX, 100, "e16 x position is correct initially");
        equal(e16Loc.curY, 200, "e16 y position is correct initially");
        equal(e17Loc.curX, 300, "e17 x position is correct initially");
        equal(e17Loc.curY, 250, "e17 y position is correct initially");

        equal(e16Loc.x, 0.5, "e16 x position is middle");
        equal(e16Loc.y, 1, "e16 y position is bottom");
        equal(e17Loc.x, 0.5, "e17 x position is middle");
        equal(e17Loc.y, 0, "e17 y position is top");

        //var e16o = _jsPlumb.router.getEndpointOrientation(e16);
        equal(e16Loc.ox, 0, "e16 x orientation is correct initially");
        equal(e16Loc.oy, 1, "e16 y orientation is correct initially");

        equal(e17Loc.ox, 0, "e17 x orientation is correct initially");
        equal(e17Loc.oy, -1, "e17 y orientation is correct initially");

        // now rotate e16 by 90 degrees
        _jsPlumb.rotate(d16, 90);

        e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        equal(e16Loc.x, 0.5, "e16 x position is still middle after rotation");
        equal(e16Loc.y, 1, "e16 y position is still bottom after rotation");

        // equal(e16Loc.x, 0, "e16 x position is still middle after rotation");
        // equal(e16Loc.y, 0.5, "e16 y position is still bottom after rotation");

        equal(e17Loc.x, 0.5, "e17 x position is still middle after rotation");
        equal(e17Loc.y, 0, "e17 y position is still top after rotation");

        // var e16Loc2 = sa.lastReturnValue.slice();
        // var e17Loc2 = ta.lastReturnValue.slice();

        ok(d16.style.transformOrigin == "center center" || d16.style.transformOrigin == "center center 0px", "transform origin was set");
        equal(d16.style.transform, "rotate(90deg)", "rotate transform was set");

        equal(e16Loc.curX, 25, "e16 x position is correct after rotation of d16");
        equal(e16Loc.curY, 125, "e16 y position is correct after rotation of d16");
        // these unchanged currently
        equal(e17Loc.curX, 300, "e17 x position is unchanged after rotation of d16");
        equal(e17Loc.curY, 250, "e17 y position is unchanged after rotation of d16");

        // rotate d17 by 90 degrees
        _jsPlumb.rotate(d17, 90);

        e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        ok(d17.style.transformOrigin == "center center" || d17.style.transformOrigin == "center center 0px", "d17 transform origin was set");
        equal(d17.style.transform, "rotate(90deg)", "d17 rotate transform was set");
        equal(e16Loc.curX, 25, "e16 x position is correct after rotation of 1d7");
        equal(e16Loc.curY, 125, "e16 y position is correct after rotation of d17");
        // these unchanged currently
        equal(e17Loc.curX, 375, "e17 x position is correct after rotation of d17");
        equal(e17Loc.curY, 325, "e17 y position is correct after rotation of d17");
    });

    test("element rotation, dynamic anchors ('auto default')", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50), d17 = support.addDiv("d17", null, null, 250, 250);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "AutoDefault"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "AutoDefault"});
        var c = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" })

        var e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        equal(e16Loc.curX, 150, "e16 x position is correct initially");
        equal(e16Loc.curY, 125, "e16 y position is correct initially");
        equal(e17Loc.curX, 250, "e17 x position is correct initially");
        equal(e17Loc.curY, 325, "e17 y position is correct initially");

        equal(e16Loc.ox, 1, "e16 x orientation is correct initially");
        equal(e16Loc.oy, 0, "e16 y orientation is correct initially");
        equal(e17Loc.ox, -1, "e17 x orientation is correct initially");
        equal(e17Loc.oy, 0, "e17 y orientation is correct initially");

        // now rotate e16 by 90 degrees
        _jsPlumb.rotate(d16, 90);

        e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        ok(d16.style.transformOrigin == "center center" || d16.style.transformOrigin == "center center 0px", "transform origin was set");
        equal(d16.style.transform, "rotate(90deg)", "rotate transform was set");

        equal(e16Loc.curX, 100, "e16 x position is correct after rotation of d16");
        equal(e16Loc.curY, 175, "e16 y position is correct after rotation of d16");
        // equal(e16Loc.curX, 175, "e16 x position is correct after rotation of d16");
        // equal(e16Loc.curY, 125, "e16 y position is correct after rotation of d16");

        // these unchanged currently
        equal(e17Loc.curX, 250, "e17 x position is unchanged after rotation of d16");
        equal(e17Loc.curY, 325, "e17 y position is unchanged after rotation of d16");

        // rotate d17 by 90 degrees
        _jsPlumb.rotate(d17, 90);

        e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        ok(d17.style.transformOrigin == "center center" || d17.style.transformOrigin == "center center 0px", "d17 transform origin was set");
        equal(d17.style.transform, "rotate(90deg)", "d17 rotate transform was set");

        equal(e16Loc.curX, 100, "e16 x position is correct after rotation of 1d7");
        equal(e16Loc.curY, 175, "e16 y position is correct after rotation of d17");
        // equal(e16Loc.curX, 175, "e16 x position is correct after rotation of d16");
        // equal(e16Loc.curY, 125, "e16 y position is correct after rotation of d16");

        equal(e17Loc.curX, 300, "e17 x position is correct after rotation of d17");
        equal(e17Loc.curY, 275, "e17 y position is correct after rotation of d17");
        // equal(e17Loc.curX, 225, "e17 x position is correct after rotation of d17");
        // equal(e17Loc.curY, 325, "e17 y position is correct after rotation of d17");
    });

    test("element rotation, continuous anchors", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50), d17 = support.addDiv("d17", null, null, 250, 250);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "Continuous"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Continuous"});
        var c = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" }),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor

        equal(sa.currentFace, "right", "e16's anchor face is 'right'") ;
        equal(ta.currentFace, "top", "e17's anchor face is 'top'");

        // now rotate e16 by 90 degrees
        _jsPlumb.rotate(d16, 180);

        equal(sa.currentFace, "left", "e16's anchor face is 'left'") ;
        equal(ta.currentFace, "top", "e17's anchor face is 'top'");

        // rotate d17 by 90 degrees
        _jsPlumb.rotate(d17, 90);

        equal(sa.currentFace, "top", "e16's anchor face is 'top'") ;
        equal(ta.currentFace, "bottom", "e17's anchor face is 'bottom'");

        ok(d17.style.transformOrigin == "center center" || d17.style.transformOrigin == "center center 0px", "d17 transform origin was set");
        equal(d17.style.transform, "rotate(90deg)", "d17 rotate transform was set");
    });

    test("group contains nodes, node inside group is rotated", function() {
        var d16 = support.addDiv("d16", null, null, 550, 550),
            d17 = support.addDiv("d17", null, null, 250, 250),
            g1El = support.addDiv("g1", null, null, 500, 500, 600, 600);

        var g1 = _jsPlumb.addGroup({id:"g1", el:g1El});
        _jsPlumb.addToGroup(g1, d16);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "Bottom"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Top"});
        var c = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" })

        var e16Loc =  _jsPlumb.router.getEndpointLocation(e16)

        equal(600, e16Loc.curX, "x pos is 600 before rotation");
        equal(700, e16Loc.curY, "x pos is 700 before rotation");
        equal(0, e16Loc.ox, "x orientation is 0 before rotation");
        equal(1, e16Loc.oy, "y orientation is 1 before rotation");

        _jsPlumb.rotate(d16, 90);

        var e16LocRotated =  _jsPlumb.router.getEndpointLocation(e16)

        equal(525, e16LocRotated.curX, "x pos is 525 after rotation");
        equal(625, e16LocRotated.curY, "x pos is 625 after rotation");

        equal(-1, e16LocRotated.ox, "x orientation is -1 after rotation");
        equal(0, e16LocRotated.oy, "y orientation is 0 after rotation");

    });

    /**
     * Here we test what happens when you rotate an entire group that has nodes. Although the nodes don't need a transform applied,
     * they should behave as if they are rotated. In this case the node's position/rotation
     */
    test("group contains nodes, group itself is rotated", function() {
        var d16 = support.addDiv("d16", null, null, 550, 550),
            d17 = support.addDiv("d17", null, null, 250, 250),
            g1El = support.addDiv("g1", null, null, 500, 500, 600, 600);

        var g1 = _jsPlumb.addGroup({id:"g1", el:g1El});
        _jsPlumb.addToGroup(g1, d16);

        var d16Id = _jsPlumb.getId(d16);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "Bottom"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Top"});
        var c = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" })

        var e16Loc = _jsPlumb.router.getEndpointLocation(e16)

        equal(600, e16Loc.curX, "x pos is 600 before rotation");
        equal(700, e16Loc.curY, "x pos is 700 before rotation");
        equal(0, e16Loc.ox, "x orientation is 0 before rotation");
        equal(1, e16Loc.oy, "y orientation is 1 before rotation");

        _jsPlumb.rotate(g1.el, 90);

        var e16LocRotated = _jsPlumb.router.getEndpointLocation(e16)

        equal(900, e16LocRotated.curX, "x pos is 900 after rotation of parent group");
        equal(600, e16LocRotated.curY, "x pos is 600 after rotation of parent group");

        equal(-1, e16LocRotated.ox, "x orientation is -1 after rotation of parent group");
        equal(0, e16LocRotated.oy, "y orientation is 0 after rotation of parent group");

        equal(0, _jsPlumb._getRotation(d16Id), "d16 is registered as having rotation of 0 degrees")
        equal(90, _jsPlumb._getRotation(g1.elId), "g1 element is registered as having rotation of 90 degrees")

        // the anchor value should be different.

    });

    test("group contains nodes, node inside group is rotated, then group is rotated", function() {
        var d16 = support.addDiv("d16", null, null, 550, 550),
            d17 = support.addDiv("d17", null, null, 250, 250),
            g1El = support.addDiv("g1", null, null, 500, 500, 600, 600);

        var g1 = _jsPlumb.addGroup({id:"g1", el:g1El});
        _jsPlumb.addToGroup(g1, d16);

        var e16 = _jsPlumb.addEndpoint(d16, {anchor: "Bottom"});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "Top"});
        var c = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" }),
            e16Loc = _jsPlumb.router.getEndpointLocation(e16)


        equal(600, e16Loc.curX, "x pos is 600 before rotation");
        equal(700, e16Loc.curY, "x pos is 700 before rotation");
        equal(0, e16Loc.ox, "x orientation is 0 before rotation");
        equal(1, e16Loc.oy, "y orientation is 1 before rotation");

        _jsPlumb.rotate(d16, 90);

        var e16LocRotated = _jsPlumb.router.getEndpointLocation(e16)

        equal(525, e16LocRotated.curX, "x pos is 525 after rotation");
        equal(625, e16LocRotated.curY, "x pos is 625 after rotation");

        equal(-1, e16LocRotated.ox, "x orientation is -1 after rotation of node");
        equal(0, e16LocRotated.oy, "y orientation is 0 after rotation of node");

        _jsPlumb.rotate(g1.el, 90);

        e16LocRotated = _jsPlumb.router.getEndpointLocation(e16)

        equal(975, e16LocRotated.curX, "x pos is 975 after rotation of group the node is a member of");
        equal(525, e16LocRotated.curY, "x pos is 525 after rotation of group the node is a member of");

        equal(0, e16LocRotated.ox, "x orientation is 0 after rotation of group the node is a member of");
        equal(-1, e16LocRotated.oy, "y orientation is -1 after rotation of group the node is a member of");

    });

    // element rotation, fixed anchors.
    test("element rotation, fixed anchors, drag connection", function () {
        var d16 = support.addDiv("d16", null, null, 50, 50, 250, 250),
            d17 = support.addDiv("d17", null, null, 450, 450, 250, 250),
            e16 = _jsPlumb.addEndpoint(d16, {anchor: "Bottom", source:true}),
            e17 = _jsPlumb.addEndpoint(d17, {anchor: "Top", target:true}),
            c = support.dragConnection(e16, e17),
            sa = c.endpoints[0]._anchor,
            ta = c.endpoints[1]._anchor

        var e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0]),
            e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        equal(e16Loc.curX, 100, "e16 x position is correct initially");
        equal(e16Loc.curY, 200, "e16 y position is correct initially");
        equal(e17Loc.curX, 500, "e17 x position is correct initially");
        equal(e17Loc.curY, 450, "e17 y position is correct initially");

        equal(e16Loc.x, 0.5, "e16 x position is middle");
        equal(e16Loc.y, 1, "e16 y position is bottom");
        equal(e17Loc.x, 0.5, "e17 x position is middle");
        equal(e17Loc.y, 0, "e17 y position is top");

        //var e16o = _jsPlumb.router.getEndpointOrientation(e16);
        equal(e16Loc.ox, 0, "e16 x orientation is correct initially");
        equal(e16Loc.oy, 1, "e16 y orientation is correct initially");

        equal(e17Loc.ox, 0, "e17 x orientation is correct initially");
        equal(e17Loc.oy, -1, "e17 y orientation is correct initially");

        // now delete the connection, rotate e16 by 90 degrees, and connect again.
        _jsPlumb.deleteConnection(c)
        c = null
        _jsPlumb.rotate(d16, 90);
        c = support.dragConnection(e16, e17)

        e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0])
        e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1])

        equal(e16Loc.x, 0.5, "e16 x position is still middle after rotation");
        equal(e16Loc.y, 1, "e16 y position is still bottom after rotation");

        // equal(e16Loc.x, 0, "e16 x position is still middle after rotation");
        // equal(e16Loc.y, 0.5, "e16 y position is still bottom after rotation");

        equal(e17Loc.x, 0.5, "e17 x position is still middle after rotation");
        equal(e17Loc.y, 0, "e17 y position is still top after rotation");

        // var e16Loc2 = sa.lastReturnValue.slice();
        // var e17Loc2 = ta.lastReturnValue.slice();

        ok(d16.style.transformOrigin == "center center" || d16.style.transformOrigin == "center center 0px", "transform origin was set");
        equal(d16.style.transform, "rotate(90deg)", "rotate transform was set");

        equal(e16Loc.curX, 25, "e16 x position is correct after rotation of d16");
        equal(e16Loc.curY, 125, "e16 y position is correct after rotation of d16");
        // these unchanged currently
        equal(e17Loc.curX, 500, "e17 x position is unchanged after rotation of d16");
        equal(e17Loc.curY, 450, "e17 y position is unchanged after rotation of d16");

        // now delete the connection, rotate e17 by 90 degrees, and connect again.
        _jsPlumb.deleteConnection(c)
        c = null
        _jsPlumb.rotate(d17, 90);
        c = support.dragConnection(e16, e17)


        e16Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[0])
        e17Loc = _jsPlumb.router.getEndpointLocation(c.endpoints[1]);

        ok(d17.style.transformOrigin == "center center" || d17.style.transformOrigin == "center center 0px", "d17 transform origin was set");
        equal(d17.style.transform, "rotate(90deg)", "d17 rotate transform was set");
        equal(e16Loc.curX, 25, "e16 x position is correct after rotation of 1d7");
        equal(e16Loc.curY, 125, "e16 y position is correct after rotation of d17");
        // these unchanged currently
        equal(e17Loc.curX, 575, "e17 x position is correct after rotation of d17");
        equal(e17Loc.curY, 525, "e17 y position is correct after rotation of d17");
    });
};






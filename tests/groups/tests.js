QUnit.config.reorder = false;

var defaults = null, _divs = [], support, _jsPlumb, container;

var makeContainer = function() {
    container = document.createElement("div")
    document.documentElement.appendChild(container)
    container.style.position = "relative"
    container.style.overflow = "hidden"
    container.style.width="1500px"
    container.style.height="1500px"
    container.style.outline = "1px solid"
}

var removeContainer = function() {
    container && container.parentNode && container.parentNode.removeChild(container)
}

function getGroupSize(groupId) {
    return getNodeSize(_jsPlumb.getGroup(groupId).el);
}

function getNodeSize(node) {
    return _jsPlumb.getSize(node);
}

function getNodePosition(node) {
    return [ parseInt(node.style.left, 10), parseInt(node.style.top, 10)];
}

function positionsNotEqual(p1, p2) {
    return p1[0] !== p2[0] && p1[1] !== p2[1];
}

function positionsEqual(p1, p2) {
    return p1[0] === p2[0] && p1[1] === p2[1];
}

var testSuite = function () {


    module("Groups", {
        teardown: function () {
            support.cleanup();
            removeContainer()
        },
        setup: function () {
            makeContainer()
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);

        }
    });

    test("sanity", function() {
        equal(1,1);
    });

    var _addGroup = function(j, name, container, members, params) {
        var g = j.addGroup(jsPlumb.extend({
            el:container,
            id:name,
            anchor:"Continuous",
            endpoint:"Blank"
        }, params || {}));

        for (var i = 0; i < members.length; i++) {
            j.addToGroup(name, members[i]);
        }

        return g;
    };

    // var support.dragToGroup = function(_jsPlumb, el, targetGroup) {
    //     targetGroup = _jsPlumb.getGroup(targetGroup);
    //     var tgo = _jsPlumb.getOffset(targetGroup.el),
    //         tgs = _jsPlumb.getSize(targetGroup.el),
    //         tx = tgo.x + (tgs.w / 2),
    //         ty = tgo.y + (tgs.h / 2);
    //
    //     //
    //     //
    //     support.dragNodeTo(el, tx, ty);
    //     // _jsPlumb.getContainer().appendChild(el);
    //     // support.dragNodeTo(el, tx, ty);
    // };
    var c1,c2,c3,c4,c5,c6,c1_1,c1_2,c2_1,c2_2,c3_1,c3_2,c4_1,c4_2,c5_1,c5_2, c6_1, c6_2, c_noparent;
    var c1Id, c2Id, c3Id, c4Id, c5Id, c6Id;
    var g1, g2, g3, g4, g5, g6;
    var GROUP_WIDTH = 150;
    var GROUP_HEIGHT = 150;
    var NODE_WIDTH = 50;
    var NODE_HEIGHT = 50;

    var gpointer = 100, gx = 0, gy = 0;
    var _addGroupAndContainer = function(w, h, x, y, j) {

        j = j || _jsPlumb;

        w = w || GROUP_WIDTH;
        h = h || GROUP_HEIGHT;
        x = x || gx;
        y = y || gy;
        var cId = "container_" + gpointer;
        var c = support.addDiv(cId, null, "container", x, y, w, h);
        c.style.outline = "1px solid black";
        gx += w;
        gy += h;

        var gId = "" + gpointer;
        var g = _addGroup(j, gId, c, []);

        gpointer++;
        return g;
    };

    var npointer = 0;
    var _addNodeToGroup = function(g, x, y, w, h ) {
        var cId = "node_" + npointer;
        var c = support.addDiv(cId, _jsPlumb.getGroupContentArea(g), "w", x || 30, y || 30, w || NODE_WIDTH, h || NODE_HEIGHT);
        _jsPlumb.manage(c);
        _jsPlumb.addToGroup(g, c);

        npointer++;
        return c;
    };

    var _addNode = function(x, y, w, h) {
        var cId = "node_" + npointer;
        var c = support.addDiv(cId, _jsPlumb.getContainer(), "w", x, y, w, h);

        npointer++;
        _jsPlumb.manage(c);
        return c;
    };

    var _setupGroups = function(doNotMakeConnections) {
        c1 = support.addDiv("container1", null, "container", 0, 50, 300, 300);
        c2 = support.addDiv("container2", null, "container", 400, 50, 300, 300);
        c3 = support.addDiv("container3", null, "container", 800, 50, 300, 300);
        c4 = support.addDiv("container4", null, "container", 0, 400, 300, 300);
        c5 = support.addDiv("container5", null, "container", 400, 400, 300, 300);
        c6 = support.addDiv("container6", null, "container", 800, 400, 300, 300);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";
        c3.style.outline = "1px solid black";
        c4.style.outline = "1px solid black";
        c5.style.outline = "1px solid black";
        c6.style.outline = "1px solid black";

        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30);
        c1_2 = support.addDiv("c1_2", c1, "w", 180, 130);
        c5_1 = support.addDiv("c5_1", c5, "w", 30, 30);
        c5_2 = support.addDiv("c5_2", c5, "w", 180, 130);
        c4_1 = support.addDiv("c4_1", c4, "w", 30, 30);
        c4_2 = support.addDiv("c4_2", c4, "w", 180, 130);
        c3_1 = support.addDiv("c3_1", c3, "w", 30, 30);
        c3_2 = support.addDiv("c3_2", c3, "w", 180, 130);
        c2_1 = support.addDiv("c2_1", c2, "w", 30, 30);
        c2_2 = support.addDiv("c2_2", c2, "w", 180, 130);
        c6_1 = support.addDiv("c6_1", c6, "w", 30, 30);
        c6_2 = support.addDiv("c6_2", c6, "w", 180, 130);

        c_noparent = support.addDiv("c_noparent", null, "w", 1000, 1000);

        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1,c1_2], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [c2_1,c2_2], {dropOverride:true});
        g3 = _addGroup(_jsPlumb, "three", c3, [c3_1,c3_2],{ revert:false });
        g4 = _addGroup(_jsPlumb, "four", c4, [c4_1,c4_2], { prune: true });
        g5 = _addGroup(_jsPlumb, "five", c5, [c5_1,c5_2], { orphan:true, droppable:false });
        g6 = _addGroup(_jsPlumb, "six", c6, [c6_1,c6_2], { orphan:true, droppable:false, proxied:false });

        c1Id = c1.getAttribute("data-jtk-managed")
        c2Id = c2.getAttribute("data-jtk-managed")
        c3Id = c3.getAttribute("data-jtk-managed")
        c4Id = c4.getAttribute("data-jtk-managed")
        c5Id = c5.getAttribute("data-jtk-managed")
        c6Id = c6.getAttribute("data-jtk-managed")

        if (!doNotMakeConnections) {

            _jsPlumb.connect({source: c1_1, target: c2_1});
            _jsPlumb.connect({source: c2_1, target: c3_1});
            _jsPlumb.connect({source: c3_1, target: c4_1});
            _jsPlumb.connect({source: c4_1, target: c5_1});

            _jsPlumb.connect({source: c1_1, target: c1_2});
            _jsPlumb.connect({source: c2_1, target: c2_2});
            _jsPlumb.connect({source: c3_1, target: c3_2});
            _jsPlumb.connect({source: c4_1, target: c4_2});
            _jsPlumb.connect({source: c5_1, target: c5_2});
            _jsPlumb.connect({source: c5_1, target: c3_2});

            _jsPlumb.connect({source: c5_1, target: c5, anchors: ["Center", "Continuous"]});

            _jsPlumb.connect({source:c6_1, target:c1_1});
            _jsPlumb.connect({source:c1_2, target:c6_2});
        }
    };

    /**
     * testing the various defaults, combinations of values. for instance, both `prune` and `orphan` cannot be set. the default
     * is to `orphan`. `revert` is forced to false if `orphan` is true. 'ghost:true' forces 'constrain:true'.
     */
    test("group construction", function() {

        // default to `orphan` and not `prune`
        var gg = support.addDiv("group1")
        var g = _jsPlumb.addGroup({ el: gg })

        equal(true, g.revert, "by default, group has `revert` marked false");
        equal(false, g.orphan, "by default, group has `orphan` marked false");
        equal(false, g.prune, "by default, group has `prune` marked false");
        equal(true, g.droppable, "by default, group has `droppable` marked true");
        equal(false, g.ghost, "by default, group has `ghost` marked false");
        equal(true, g.enabled, "by default, group has `enabled` marked true");
        equal(true, g.proxied, "by default, group has `proxied` marked true");

        equal(false, g.constrain, "by default, group has `constrain` marked false");

        // set prune
        var gg = support.addDiv("group1")
        var g = _jsPlumb.addGroup({ el: gg, prune:true })

        equal(false, g.orphan, "group has `orphan` marked false");
        equal(true, g.prune, "group has `prune` marked true");

        // orphan and prune cannot both be true: orphan has priority
        gg = support.addDiv("group2")
        g = _jsPlumb.addGroup({ el: gg, prune:true, orphan:true })

        equal(true, g.orphan, "group has `orphan` marked true");
        equal(false, g.prune, "group has `prune` marked false");

        // orphan and revert cannot both be true: orphan has priority. in this test we use the fact that revert defaults to true
        gg = support.addDiv("group2")
        g = _jsPlumb.addGroup({ el: gg, orphan:true })

        equal(true, g.orphan, "group has `orphan` marked true");
        equal(false, g.revert, "group has `revert` marked false because orphan was marked true");

        // orphan and revert cannot both be true: orphan has priority. in this test we explicitly set revert to true
        gg = support.addDiv("group2")
        g = _jsPlumb.addGroup({ el: gg, orphan:true, revert:true })

        equal(true, g.orphan, "group has `orphan` marked true");
        equal(false, g.revert, "group has `revert` marked false because orphan was marked true");

        // 'ghost:true' forces constrain:true
        gg = support.addDiv("group2")
        g = _jsPlumb.addGroup({ el: gg, ghost:true})

        equal(true, g.ghost, "group has `ghost` marked true");
        equal(true, g.constrain, "group has `constrain` marked true because ghost was marked true");

        // 'ghost:true' forces constrain:true, override constrain:false
        gg = support.addDiv("group2")
        g = _jsPlumb.addGroup({ el: gg, ghost:true, constrain:false})

        equal(true, g.ghost, "group has `ghost` marked true");
        equal(true, g.constrain, "group has `constrain` marked true because ghost was marked true");

    });


    test("groups, simple access", function() {

        _setupGroups();

        // check a group has members
        equal(_jsPlumb.getGroup("four").children.length, 2, "2 members in group four");
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three");
        // check an unknown group throws an error
        try {
            _jsPlumb.getGroup("unknown");
            ok(false, "should not have been able to retrieve unknown group");
        }
        catch (e) {
            ok(true, "unknown group retrieve threw exception");
        }

        // group4 is at [1000, 400]
        // its children are

        equal(parseInt(c4.style.left), 0, "c4 at 0 left");
        equal(parseInt(c4.style.top), 400, "c4 at 400 top");
        equal(parseInt(c4_1.style.left), 30, "c4_1 at 30 left");
        equal(parseInt(c4_1.style.top), 30, "c4_1 at 30 top");
        equal(parseInt(c4_2.style.left), 180, "c4_2 at 180 left");
        equal(parseInt(c4_2.style.top), 130, "c4_2 at 130 top");

        ok(_jsPlumb._managedElements[c4Id] != null, "container4 is being managed");

        _jsPlumb.removeGroup("four", false);

        ok(_jsPlumb._managedElements[c4Id] == null, "container4 is not being managed after group removed");

        try {
            _jsPlumb.getGroup("four");
            ok(false, "should not have been able to retrieve removed group");
        }
        catch (e) {
            ok(true, "removed group subsequent retrieve threw exception");
        }
        ok(c4_1.parentNode != null, "c4_1 not removed from DOM even though group was removed");
        // check positions of child nodes; they should have been adjusted.
        equal(parseInt(c4_1.style.left), 30, "c4_1 at 30 left");
        equal(parseInt(c4_1.style.top), 430, "c4_1 at 430 top");
        equal(parseInt(c4_2.style.left), 180, "c4_2 at 180 left");
        equal(parseInt(c4_2.style.top), 530, "c4_2 at 530 top");

        var c5Id = container5.getAttribute("data-jtk-managed")

        ok(_jsPlumb._managedElements[c5Id] != null, "container5 is being managed");
        _jsPlumb.removeGroup("five", true);
        ok(_jsPlumb._managedElements[c5Id] == null, "container5 is not being managed after group removed");
        try {
            _jsPlumb.getGroup("five");
            ok(false, "should not have been able to retrieve removed group");
        }
        catch (e) {
            ok(true, "removed group subsequent retrieve threw exception");
        }
        ok(c5_1.parentNode == null, "c5_1 removed from DOM because group 5 also removes its children on group removal");

        // reset: all groups should be removed
        _jsPlumb.reset();
        try {
            _jsPlumb.getGroup("three");
            ok(false, "should not have been able to retrieve group after reset");
        }
        catch (e) {
            ok(true, "retrieve group after reset threw exception");
        }

    });

    test("groups, remove group, ensuring removal of children and edges to children", function() {

        _setupGroups();

        // check a group has members
        equal(_jsPlumb.getGroup("four").children.length, 2, "2 members in group four");
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three");

        equal(_jsPlumb.select().length, 13)
        equal(_jsPlumb.viewport._elementMap.size, 18, "18 managed elements to start with")

        // remove group but not its members
        _jsPlumb.removeGroup("three")
        // so no edges should have been removed
        equal(_jsPlumb.select().length, 13)
        equal(_jsPlumb.viewport._elementMap.size, 17, "17 managed elements after one group removed, but not its children")

        // remove group AND its members, via flag
        _jsPlumb.removeGroup("six", true)
        // so two edges should have been removed
        equal(_jsPlumb.select().length, 11, "2 edges - to orphaned child nodes - removed")
        equal(_jsPlumb.viewport._elementMap.size, 14, "14 managed elements after another group, and its 2 children, removed")


    });

    test("adding to/removing from group programmatically, test that elements are managed correctly and their `group` flag is set.", function() {
        var gg = support.addDiv("group1")
        gg.style.width = "600px";
        gg.style.height = "600px";
        var d1 = support.addDiv("d1");

        var g = _jsPlumb.addGroup({el:gg})
        var groupElId = g.elId

        equal(g.children.length, 0, "0 members in group");

        _jsPlumb.addToGroup(g, d1);
        equal(g.children.length, 1, "1 member in group");

         var d1Id = d1.getAttribute("data-jtk-managed")
        var ggId = gg.getAttribute("data-jtk-managed")

        ok(_jsPlumb._managedElements[d1Id] != null, "d1 is in the managed elements map")
        ok(_jsPlumb._managedElements[ggId] != null, "group1 element is in the managed elements map")

        equal(groupElId, _jsPlumb._managedElements[d1Id].group, "group element's data-jtk-managed has been registered as `group` for element d1")

        _jsPlumb.removeFromGroup(g, d1)

        equal(g.children.length, 0, "0 members in group");
        equal(null, _jsPlumb._managedElements[d1Id].group, "group's id has been removed from `group` value for element d1")

        // add back to group
        _jsPlumb.addToGroup(g, d1);
        equal(g.elId, _jsPlumb._managedElements[d1Id].group, "group id has been registered as `group` for element d1")

        // now remove the group. it should no longer be the `group` for d1
        _jsPlumb.removeGroup(g)
        equal(null, _jsPlumb._managedElements[d1Id].group, "group's id has been removed from `group` value for element d1 after group removed")

    });

    test("adding to/removing from group programmatically, test that elements are managed correctly and their `group` flag is set - nested groups", function() {
        var gg = support.addDiv("group1")
        gg.style.width = "600px";
        gg.style.height = "600px";

        var gg2 = support.addDiv("group2")
        gg2.style.width = "600px";
        gg2.style.height = "600px";

        var g = _jsPlumb.addGroup({el:gg})
        var g2 = _jsPlumb.addGroup({el:gg2})

        equal(g.getGroups().length, 0, "0 child groups in group1");

        g.addGroup(g2)

        equal(g.getGroups().length, 1, "1 child group in group1");

        var gg2Id = gg2.getAttribute("data-jtk-managed")
        var ggId = gg.getAttribute("data-jtk-managed")

        ok(_jsPlumb._managedElements[gg2Id] != null, "group2 element is in the managed elements map")
        ok(_jsPlumb._managedElements[ggId] != null, "group1 element is in the managed elements map")

        equal(g.elId, _jsPlumb._managedElements[gg2Id].group, "group1's id has been registered as `group` for the element related to group2")
        //
         g.removeGroup(g2)
        equal(g.getGroups().length, 0, "0 child groups in group1");
        equal(null, _jsPlumb._managedElements[gg2Id].group, "group1's id has been removed from `group` value for element related to group2")
        //
        // add back to group
        g.addGroup(g2)
        equal(g.elId, _jsPlumb._managedElements[gg2Id].group, "group1 id has been registered as `group` for element related to group 2")
        //
        // now remove the group. it should no longer be the `group` for d1
        _jsPlumb.removeGroup(g)
        equal(null, _jsPlumb._managedElements[gg2Id].group, "group1's id has been removed from `group` value for group2's element after group1 removed")

    });

    test("groups, dropping onto a group, single node", function() {

        var groupEl = support.addDiv("container1", null, "container", 0, 50, 300, 300);
        var child1 = support.addDiv("child1", null, "w", 400, 400);
        var child2 = support.addDiv("child2", null, "w", 880, 830);

        _jsPlumb.manageAll([groupEl, child1, child2])

        var group = _addGroup(_jsPlumb, "one", groupEl, []);
        equal(group.children.length, 0, "0 members in group at start");


        support.dragToGroup( child1, "one");

        equal(group.children.length, 1, "1 member in group after node drag/drop");

    });

    test("groups, dropping onto a group, multiple nodes", function() {

        var groupEl = support.addDiv("container1", null, "container", 0, 50, 300, 300);
        var child1 = support.addDiv("child1", null, "w", 400, 400);
        var child2 = support.addDiv("child2", null, "w", 880, 830);

        _jsPlumb.manageAll([groupEl, child1, child2])

        var group = _addGroup(_jsPlumb, "one", groupEl, []);
        equal(group.children.length, 0, "0 members in group at start");

        // add child2 to the drag selection. when child1 is dragged it will be dragged too, and it should be dropped into the group also.
        _jsPlumb.addToDragSelection(child2)

        support.dragToGroup( child1, "one");

        equal(group.children.length, 2, " 2 members in group after node drag/drop because 2 members in the drag selection");

    });


    test("groups, dragging between groups, take one", function() {
        _setupGroups();
        equal(_jsPlumb.getGroup("four").children.length, 2, "2 members in group four at start");

        // drag 4_1 to group 3
        support.dragToGroup( c4_1, "three");
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four after moving a node out");
        equal(_jsPlumb.getGroup("three").children.length, 3, "3 members in group three");

        // drag 4_2 to group 5 (which is not droppable)
        equal(_jsPlumb.getGroup("five").children.length, 2, "2 members in group five before drop attempt");
        support.dragToGroup( c4_2, "five");
        equal(_jsPlumb.getGroup("four").children.length, 0, "move to group 5 fails, not droppable: 0 members in group four because it prunes");
        equal(_jsPlumb.getGroup("five").children.length, 2, "but still only 2 members in group five");

    });

    test("groups, moving between groups, take one", function() {
        _setupGroups();
        var els;

        var addEvt = false, removeEvt = false;
        _jsPlumb.bind("group:member:added", function() {
            addEvt = true;
        });
        _jsPlumb.bind("group:member:removed", function() {
            removeEvt = true;
        });

        // move 4_1 to group 3
        _jsPlumb.addToGroup(_jsPlumb.getGroup("three"), c4_1);
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four");
        equal(_jsPlumb.getGroup("three").children.length, 3, "3 members in group three");

        ok(addEvt, "add event was fired");
        ok(removeEvt, "remove event was fired");

        // add again: it is already a member and should not be re-added
        addEvt = false;
        removeEvt = false;
        _jsPlumb.addToGroup(_jsPlumb.getGroup("three"), c4_1);
        equal(_jsPlumb.getGroup("three").children.length, 3, "3 members in group three");
        ok(!addEvt, "add event was NOT fired");
        ok(!removeEvt, "remove event was NOT fired");

        // momve 4_2 to group 5 (which is not droppable)
//        equal(_jsPlumb.getGroup("five").children.length, 2, "2 members in group five before drop attempt");
//        _jsPlumb.addToGroup(_jsPlumb.getGroup("five"), c4_2);
//        equal(_jsPlumb.getGroup("four").children.length, 0, "move to group 5 fails, not droppable: 0 members in group four because it prunes");
//        equal(_jsPlumb.getGroup("five").children.length, 2, "but still only 2 members in group five");

    });

    test("groups, dragging between groups, single nodes, take 2", function() {
        _setupGroups();

        // drag 4_2 to group 1 (which is not droppable)
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one before attempted drop from group 1");
        support.dragToGroup( c4_2, "one");
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four (it prunes on drop outside)");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after failed drop: group 1 not droppable");

        // drag 4_1 to group 2 (which is droppable)
        equal(_jsPlumb.getGroup("two").children.length, 2, "2 members in group two before drop from group 4");
        support.dragToGroup( c4_1, "two");
        equal(_jsPlumb.getGroup("four").children.length, 0, "0 members in group four after dropping el on group 2");
        equal(_jsPlumb.getGroup("two").children.length, 3, "3 members in group two after dropping el from group 4");

        // drag 1_2 to group 2 (group 1 has constrain switched on; should not drop even though 2 is droppable)
        support.dragToGroup( c1_2, "two");
        equal(_jsPlumb.getGroup("two").children.length, 3, "3 members in group two after attempting drop from group 1");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after drop on group 2 failed due to constraint");

        // drag 1_2 to group 3. should not work, as group 1 has constrain set.
        // equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three before attempted drop");
        // support.dragToGroup( c1_2, "three");
        // equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after attempting to drag one out");
        // equal(_jsPlumb.getGroup("three").children.length, 2, "still 2 members in group three after attempted drop");

    });


    test("groups, dragging between groups, multiple nodes", function() {

        _setupGroups();

        _jsPlumb.addToDragSelection(c4_1)

        // drag 4_2 to group 1 (which is not droppable)
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one before attempted drop from group 1");
        support.dragToGroup( c4_2, "one");
        equal(_jsPlumb.getGroup("four").children.length, 0, "0 members in group four (it prunes on drop outside and both of its nodes were dragged)");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after failed drop: group 1 not droppable");


        // drag 3_1 (and 3_2, because it's in the selection) to group 2 (which is droppable)
        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c3_2)
        equal(_jsPlumb.getGroup("two").children.length, 2, "2 members in group two before drop from group 4");
        support.dragToGroup( c3_1, "two");
        equal(_jsPlumb.getGroup("three").children.length, 0, "0 members in group three after dropping elements on group 2");
        equal(_jsPlumb.getGroup("two").children.length, 4, "4 members in group two after dropping elements from group 3");

        // drag 1_2 and 1_1 to group 2 (group 1 has constrain switched on; should not drop even though 2 is droppable)
        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c1_1)
        support.dragToGroup( c1_2, "two");
        equal(_jsPlumb.getGroup("two").children.length, 4, "still 4 members in group two after failed at attempting drop from group 1");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after drop on group 2 failed due to constraint");

        // drag 5_1 and 5_2 to group 3. should work
        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c5_1)
        equal(_jsPlumb.getGroup("five").children.length, 2, "2 members in group five before attempted drop");
        support.dragToGroup( c5_2, "three");
        equal(_jsPlumb.getGroup("five").children.length, 0, "0 members in group five after dragging both out");
        equal(_jsPlumb.getGroup("three").children.length, 2, "still 2 members in group three after attempted drop");

    });

    test("groups, dragging between groups, multiple nodes across multiple groups", function() {

        _setupGroups();

        _jsPlumb.addToDragSelection(c4_1)
        // drag 3_1 and 4_1 to group 1 (which is not droppable); it will fail
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one before attempted drop from groups 3 and 4");
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three before attempted drop from groups 3 and 4");
        equal(_jsPlumb.getGroup("four").children.length, 2, "2 members in group four before attempted drop from groups 3 and 4");
        support.dragToGroup( c4_2, "one");
        equal(_jsPlumb.getGroup("four").children.length, 0, "0 members in group four (it prunes on drop outside)");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after failed drop: group 1 not droppable");
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three (it reverts on drop outside)");


        // drag 3_1 (and 5_2 and 1_1 because it's in the selection although in a different group) to group 2 (which is droppable)
        // group 1 has 'constrain' switched on and so its node should never leave the group.
        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c5_2)
        _jsPlumb.addToDragSelection(c1_1)
        equal(_jsPlumb.getGroup("two").children.length, 2, "2 members in group two before drop from groups 5 and 3 and 1");
        equal(_jsPlumb.getGroup("five").children.length, 2, "2 members in group five before drop from groups 5 and 3 and 1");
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three before drop from groups 5 and 3 and 1");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one before drop from groups 5 and 3 and 1");
        support.dragToGroup( c3_1, "two", {
            
        });
        equal(_jsPlumb.getGroup("three").children.length, 1, "1 member in group three after dropping element on group 2");
        equal(_jsPlumb.getGroup("five").children.length, 1, "1 member in group five after dropping element on group 2");
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after failing to drop element on group 2 due to group 1's constrain flag");
        equal(_jsPlumb.getGroup("two").children.length, 4, "4 members in group two after dropping elements from groups 3 and 5");

        // // drag 1_2 and 1_1 to group 2 (group 1 has constrain switched on; should not drop even though 2 is droppable)
        // _jsPlumb.clearDragSelection()
        // _jsPlumb.addToDragSelection(c1_1)
        // support.dragToGroup( c1_2, "two");
        // equal(_jsPlumb.getGroup("two").children.length, 4, "still 4 members in group two after failed at attempting drop from group 1");
        // equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one after drop on group 2 failed due to constraint");
        //
        // // drag 5_1 and 5_2 to group 3. should work
        // _jsPlumb.clearDragSelection()
        // _jsPlumb.addToDragSelection(c5_1)
        // equal(_jsPlumb.getGroup("five").children.length, 2, "2 members in group five before attempted drop");
        // support.dragToGroup( c5_2, "three");
        // equal(_jsPlumb.getGroup("five").children.length, 0, "0 members in group five after dragging both out");
        // equal(_jsPlumb.getGroup("three").children.length, 2, "still 2 members in group three after attempted drop");

    });

    test("dragging nodes inside groups, single nodes", function() {
        _setupGroups();

        var c1_2_pos = getNodePosition(c1_2)
        var anchorPos = _jsPlumb.endpointsByElement["c1_2"][0]._anchor.computedPosition

        // try dragging 1_2 right out of the box and dropping it. it should not work: c1 has constrain switched on.
        // 1_2 will end up in the bottom right corner of the group.
        support.dragNodeBy(c1_2, 50, 60);

        var c1_2_newPos = getNodePosition(c1_2)
        equal(c1_2_newPos[0] - c1_2_pos[0], 50, "node has moved by 50 pixels in x axis")
        equal(c1_2_newPos[1] - c1_2_pos[1], 60, "node has moved by 60 pixels in x axis")

        // also test the anchor position has moved by the same amount.  this is a test for the code added to element-drag-handler in
        // commit af5fae4: its purpose is to ensure that an element dragged inside of some parent group has its location
        // correctly set at drag end.
        var newAnchorPos = _jsPlumb.endpointsByElement["c1_2"][0]._anchor.computedPosition
        equal(newAnchorPos.curX - anchorPos.curX, 50, "anchor has moved by 50 pixels in x axis")
        equal(newAnchorPos.curY - anchorPos.curY, 60, "anchor has moved by 60 pixels in x axis")
    })

    /**
     * We test here dragging inside of a group when the group has 'constrain' set - elements should only be draggable to
     * positions where they are entirely visible. in this test we also adjust the size of c1_1 to be 250px wide,
     * to specifically test the clamping functionality of the _drag selection_: c1_2 is the node we drag, but c1_1 is
     * in the drag selection.
     *
     * Note that we have to do a manual `revalidate` here because this test is not async. There is an automatic version
     * directly below, in which we set a timeout and rely on the instance's ResizeObserver to detect the change.
     *
     */
    test("dragging nodes inside groups, multiple nodes, constrain, manual revalidation", function() {
        _setupGroups();

        c1_1.style.width = "250px"
        _jsPlumb.revalidate(c1_1)

        var c1_2_pos = getNodePosition(c1_2)
        var c1_1_pos = getNodePosition(c1_1)

        _jsPlumb.addToDragSelection(c1_1)

        // try dragging 1_2 right out of the box and dropping it. it should not work: c1 has constrain switched on.
        // 1_2 will end up in the bottom right corner of the group.
        support.dragNodeBy(c1_2, 50, 60);

        var c1_2_newPos = getNodePosition(c1_2)
        equal(c1_2_newPos[0] - c1_2_pos[0], 50, "c1_2, the dragged node, has moved by 50 pixels in x axis")
        equal(c1_2_newPos[1] - c1_2_pos[1], 60, "c1_2, the dragged node, has moved by 60 pixels in y axis")

        var c1_1_newPos = getNodePosition(c1_1)
        // c1_1 is at x 50 since it is 250px wide and the group is 300, and constrain is switched on.
        equal(c1_1_newPos[0], 50, "c1_1, a node in the drag selection, has moved and been clamped by the group size")
    })

    /**
     * Async version of the test above. Here, instead of calling `revalidate` ourselves, we rely on the resize
     * observer to detect the change.
     *
     */
    asyncTest("dragging nodes inside groups, multiple nodes, constrain, automatic revalidation", function() {
        _setupGroups();

        c1_1.style.width = "250px"

        setTimeout(() => {
            QUnit.start()
            var c1_2_pos = getNodePosition(c1_2)
            var c1_1_pos = getNodePosition(c1_1)

            _jsPlumb.addToDragSelection(c1_1)

            // try dragging 1_2 right out of the box and dropping it. it should not work: c1 has constrain switched on.
            // 1_2 will end up in the bottom right corner of the group.
            support.dragNodeBy(c1_2, 50, 60);

            var c1_2_newPos = getNodePosition(c1_2)
            equal(c1_2_newPos[0] - c1_2_pos[0], 50, "c1_2, the dragged node, has moved by 50 pixels in x axis")
            equal(c1_2_newPos[1] - c1_2_pos[1], 60, "c1_2, the dragged node, has moved by 60 pixels in y axis")

            var c1_1_newPos = getNodePosition(c1_1)
            // c1_1 is at x 50 since it is 250px wide and the group is 300, and constrain is switched on.
            equal(c1_1_newPos[0], 50, "c1_1, a node in the drag selection, has moved and been clamped by the group size")
        }, 0)


    })

    test("dragging nodes out of groups, single nodes", function() {
        _setupGroups();

        var groupOneSize = getGroupSize("one");
        var c1_2_size = getNodeSize(c1_2);

        // try dragging 1_2 right out of the box and dropping it. it should not work: c1 has constrain switched on.
        // 1_2 will end up in the bottom right corner of the group.
        support.dragAndAbortConnection(c1_2);
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one");
        // check the node has not actually moved.
        var c1_2_pos = getNodePosition(c1_2);
        equal(groupOneSize.w - c1_2_size.w, c1_2_pos[0], "c1_2 left position constrained by parent");
        equal(groupOneSize.h - c1_2_size.h, c1_2_pos[1], "c1_2 top position constrained by parent");

        // try dragging 2_2 right out of the box and dropping it.
        var c2_2_pos = getNodePosition(c2_2);
        support.dragAndAbortConnection(c2_2);
        equal(_jsPlumb.getGroup("two").children.length, 2, "2 members in group two");
        // check the node position
        var c2_2_pos2 = getNodePosition(c2_2);
        ok(positionsEqual(c2_2_pos, c2_2_pos2), "c2_2 not moved");

        // c3, should also allow nodes to be dropped outside
        var c32o = getNodePosition(c3_2);
        support.dragAndAbortConnection(c3_2);
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three");
        // check the node has moved. but just not removed from the group.
        var c32o2 = getNodePosition(c3_2);
        ok(positionsNotEqual(c32o, c32o2), "left and top positions changed");

        let eventPosted = false
        _jsPlumb.bind("group:member:removed", function(p) {
            eventPosted = true
        })

        // c4 prunes nodes on drop outside

        support.dragAndAbortConnection(c4_2);
        equal(_jsPlumb.getGroup("four").children.length, 1, "1 member in group four");
        ok(c4_2.parentNode == null, "c4_2 removed from DOM");
        ok(eventPosted, "group:member:removed event was posted")

        // c5 orphans nodes on drop outside (remove from group but not from DOM)
        eventPosted = false
        support.dragAndAbortConnection(c5_2);
        equal(_jsPlumb.getGroup("five").children.length, 1, "1 member in group five");
        ok(c5_2.parentNode != null, "c5_2 still in DOM");
        ok(eventPosted, "group:member:removed event was posted")
    });

    //
    // this test only tests dragging nodes out of groups and dropping them in whitespace. It does nto test dragging between groups.
    //
    test("dragging nodes out of groups, multiple nodes", function() {
        _setupGroups();

        var groupOneSize = getGroupSize("one");
        var groupTwoSize = getGroupSize("two");
        var c1_1_size = getNodeSize(c1_1);
        var c1_2_size = getNodeSize(c1_2);
        var c2_2_size = getNodeSize(c2_2);

        _jsPlumb.addToDragSelection(c1_1)
        // try dragging 1_2 (and 1_1) right out of the box and dropping it. it should not work: c1 has constrain switched on.
        // 1_2 will end up in the bottom right corner of the group.
        //var c12o = _jsPlumb.getOffset(c1_2);
        support.dragAndAbortConnection(c1_2);
        equal(_jsPlumb.getGroup("one").children.length, 2, "2 members in group one");
        // check the nodes have not actually moved.
        var c1_2_pos = getNodePosition(c1_2);
        equal(groupOneSize.w - c1_2_size.w, c1_2_pos[0], "c1_2 left position constrained by parent");
        equal(groupOneSize.h - c1_2_size.h, c1_2_pos[1], "c1_2 top position constrained by parent");

        var c1_1_pos = getNodePosition(c1_2);
        equal(groupOneSize.w - c1_1_size.w, c1_1_pos[0], "c1_1 left position constrained by parent");
        equal(groupOneSize.h - c1_1_size.h, c1_1_pos[1], "c1_1 top position constrained by parent");

        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c2_1)
        // try dragging 2_2 right out of the box and dropping it. g2 has dropOverride:true so this should not be possible.
        var c2_2_pos = getNodePosition(c2_2);
        var c2_1_pos = getNodePosition(c2_1);
        support.dragAndAbortConnection(c2_2);
        equal(_jsPlumb.getGroup("two").children.length, 2, "2 members in group two");
        // check the node position
        var c2_2_pos2 = getNodePosition(c2_2);
        ok(positionsEqual(c2_2_pos, c2_2_pos2), "c2_2 not moved");
        var c2_1_pos2 = getNodePosition(c2_1);
        ok(positionsEqual(c2_1_pos, c2_1_pos2), "c2_1 not moved");

        // c3, should allow nodes to be dropped outside (but not removed)
        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c3_1)
        var c32o = getNodePosition(c3_2);
        var c31o = getNodePosition(c3_1);
        support.dragAndAbortConnection(c3_2);
        equal(_jsPlumb.getGroup("three").children.length, 2, "2 members in group three");
        // check the node has moved. but just not removed from the group.
        var c32o2 = getNodePosition(c3_2);
        ok(positionsNotEqual(c32o, c32o2), "left and top positions changed for node dropped outside of group 3");
        var c31o2 = getNodePosition(c3_1);
        ok(positionsNotEqual(c31o, c31o2), "left and top positions changed for other node dropped outside of group 3");

        // c4 prunes nodes on drop outside
        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c4_1)
        //var c32o = getNodePosition(c3_2);
        support.dragAndAbortConnection(c4_2);
        equal(_jsPlumb.getGroup("four").children.length, 0, "0 members in group four - they were both dragged out.");
        ok(c4_2.parentNode == null, "c4_2 removed from DOM");
        ok(c4_1.parentNode == null, "c4_1 removed from DOM");

        // c5 orphans nodes on drop outside (remove from group but not from DOM)
        _jsPlumb.clearDragSelection()
        _jsPlumb.addToDragSelection(c5_1)
        support.dragAndAbortConnection(c5_2);
        equal(_jsPlumb.getGroup("five").children.length, 0, "0 members in group five - they were both dragged out");
        ok(c5_2.parentNode != null, "c5_2 still in DOM");
        ok(c5_1.parentNode != null, "c5_1 still in DOM");
    });

    /**
    * Another test related to the update in commit af5fae4. Here we test nested group drag stop, plus we also test drag stop
     * when an element is inside a group that does not allow orphaning: the element goes back into the group, and the drag position
     * needs to have the parent group's offset added in order for anchors to be positioned correctly.
     */
    test("dragging groups inside groups, single groups", function() {

        var groupA = _addGroupAndContainer(1000,1000),
            groupB = _addGroupAndContainer(100,100),
            groupC = _addGroupAndContainer(100,100);

        // groupC.orphan = true

        _jsPlumb.setPosition(groupA.el, {x:20, y:30})
        _jsPlumb.revalidate(groupA.el)

        var n = _addNode(1200, 0, 100, 100)

        support.dragToGroup( groupB.el, groupA);
        support.dragToGroup(n, groupC);

        equal(_jsPlumb.getGroupContentArea(groupA), groupB.el.parentNode, "groupB is child of groupA in the DOM");
        equal(groupA.getGroups().length, 1, "groupA has one child group");

        // connect the node to the now nested group
        _jsPlumb.connect({source:n, target:groupB.el})

        var groupBPos = getNodePosition(groupB.el)
        var anchorPos = _jsPlumb.endpointsByElement[groupB.el.getAttribute("data-jtk-managed")][0]._anchor.computedPosition

        support.dragNodeBy(groupB.el, 50, 60)

        var groupBNewPos = getNodePosition(groupB.el)

        equal(groupBNewPos[0] - groupBPos[0], 50, "group b has moved by 50 pixels in the x axis")
        equal(groupBNewPos[1] - groupBPos[1], 60, "group b has moved by 60 pixels in the y axis")

        var newAnchorPos = _jsPlumb.endpointsByElement[groupB.el.getAttribute("data-jtk-managed")][0]._anchor.computedPosition

        equal(newAnchorPos.curX - anchorPos.curX, 50, "anchor has moved by 50 pixels in x axis")
        equal(newAnchorPos.curY - anchorPos.curY, 60, "anchor has moved by 60 pixels in y axis")

        var nodeAnchorPos = _jsPlumb.endpointsByElement[n.getAttribute("data-jtk-managed")][0]._anchor.computedPosition

        groupC.orphan = true

        support.dragNodeBy(n, 10, 260)
        var newNodeAnchorPos = _jsPlumb.endpointsByElement[n.getAttribute("data-jtk-managed")][0]._anchor.computedPosition
        equal(newNodeAnchorPos.curX - nodeAnchorPos.curX, 10, "anchor has moved 10 pixels in x axis ")
        equal(newNodeAnchorPos.curY - nodeAnchorPos.curY, 260, "anchor has moved 260 in y axis")

    });

    test("dragging groups out of groups, single groups", function() {

        var groupA = _addGroupAndContainer(400,400),
            groupB = _addGroupAndContainer(100,100);

        groupA.orphan = true;

        let eventPosted = false
        _jsPlumb.bind("group:nested:removed", function(p) {
            eventPosted = true
        })

        support.dragToGroup( groupB.el, groupA);

        equal(_jsPlumb.getGroupContentArea(groupA), groupB.el.parentNode, "groupB is child of groupA in the DOM");
        equal(groupA.getGroups().length, 1, "groupA has one child group");

        support.dragNodeBy(groupB.el, 500, 500)

        equal(_jsPlumb.getContainer(), groupB.el.parentNode, "groupB is child of the container in the DOM");
        equal(groupA.getGroups().length, 0, "groupA has zero children");

        ok(eventPosted, "group:nested:removed event was posted")


    });

    /**
     * - Create an internal connection and check it is registered
     * - Move the source element to another group, check that it was deregistered as internal and tracked as source/target in group2/group1
     */
    test("internal connection registration, test 1", function() {

        _setupGroups(true);

        // 1. create a connection which is internal, see it registered as internal.
        var c = _jsPlumb.connect({source: c3_1, target: c3_2});
        equal(_jsPlumb.getGroup("three").connections.internal.length, 1, "one internal connection in group 3");
        equal(_jsPlumb.getGroup("four").connections.target.length, 0, "zero target connections in group 4");
        equal(_jsPlumb.getGroup("three").connections.source.length, 0, "zero source connections in group 3");
        equal(c3_1._jsPlumbParentGroup.id, "three", "group three is parent of c3_1");

        // 2. drag its source to group 1
        support.dragToGroup( c3_1, "four");
        equal(_jsPlumb.getGroup("three").connections.internal.length, 0, "zero internal connections in group 3");
        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source connection in group 4");
        equal(_jsPlumb.getGroup("three").connections.target.length, 1, "one target connection in group 3");

        equal(c3_1._jsPlumbParentGroup.id, "four", "group four is parent of c3_1 now");

        // 3. delete it
        _jsPlumb.deleteConnection(c);
    });

    /**
     * - Create an internal connection and check it is registered
     * - Delete it. Check it was deregistered.
     */
    test("internal connection registration, test 2", function() {

        _setupGroups(true);

        // 1. create a connection which is internal, see it registered as internal.
        var c = _jsPlumb.connect({source: c1_1, target: c1_2});
        equal(_jsPlumb.getGroup("one").connections.internal.length, 1, "one internal connection in group 1");
        equal(_jsPlumb.getGroup("one").connections.source.length, 0, "zero source connections in group 1");

        // 3. delete it
        _jsPlumb.deleteConnection(c);

        equal(_jsPlumb.getGroup("one").connections.internal.length, 0, "zero internal connections in group 1");
        equal(_jsPlumb.getGroup("one").connections.source.length, 0, "zero source connections in group 1");
    });

    /**
     * - Create an internal connection and check it is registered
     * - Drag its source to an element in another group
     * - Check it was deregistered as an internal connection and changed to a target
     */
    test("internal connection registration, test 3", function() {

        _setupGroups(true);

        // 1. create a connection which is internal, see it registered as internal.
        var c = _jsPlumb.connect({source: c3_1, target: c3_2});
        equal(_jsPlumb.getGroup("three").connections.internal.length, 1, "one internal connection in group 3");
        equal(_jsPlumb.getGroup("four").connections.target.length, 0, "zero target connections in group 4");
        equal(_jsPlumb.getGroup("three").connections.source.length, 0, "zero source connections in group 3");
        equal(c3_1._jsPlumbParentGroup.id, "three", "group three is parent of c3_1");

        // 2. drag its source to group 1
        _jsPlumb.addSourceSelector("#c4_1");
        support.relocateSource(c, c4_1);

        equal(_jsPlumb.getGroup("three").connections.internal.length, 0, "zero internal connections in group 3");
        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source connection in group 4");
        equal(_jsPlumb.getGroup("three").connections.target.length, 1, "one target connection in group 3");

        equal(c3_1._jsPlumbParentGroup.id, "three", "group three is still parent of c3_1 (unlike in the first of these internal connection tests)");

        // 3. delete it
        _jsPlumb.deleteConnection(c);
    });

    test("connection registration, node in group to node in group", function() {

        _setupGroups(true);

        // 1. create a connection from one child node to another child node, check it was registered
        var c = _jsPlumb.connect({source: c3_1, target: c4_1});
        equal(_jsPlumb.getGroup("three").connections.internal.length, 0, "zero internal connection in group 3");
        equal(_jsPlumb.getGroup("four").connections.target.length, 1, "one target connections in group 4");
        equal(_jsPlumb.getGroup("three").connections.source.length, 1, "one source connections in group 3");


    });

    test("connection registration, group in group to node in group", function() {

        _setupGroups(true);

        g4.addGroup(g5)

        // 1. create a connection from one child node to another child node, check it was registered
        var c = _jsPlumb.connect({source: c3_1, target: c5});
        equal(g3.connections.internal.length, 0, "zero internal connection in group 3");
        equal(g4.connections.target.length, 1, "one target connections in group 4");
        equal(g3.connections.source.length, 1, "one source connections in group 3");

        var c2 = _jsPlumb.connect({source: c3_1, target: c5_1});
        equal(g5.connections.target.length, 1, "one target connections in group 5");
        equal(g3.connections.source.length, 2, "two source connections in group 3");

    });

    test("single group collapse and expand", function() {

        _setupGroups();

        equal(_jsPlumb.select({source:c3_1}).length, 2, "2 source connections for c3_1");
        equal(_jsPlumb.select({target:c3_1}).length, 1, "1 target connection for c3_1");
        _jsPlumb.collapseGroup("three");

        ok(_jsPlumb.hasClass(c3, "jtk-group-collapsed"), "group has collapsed class");
        var c3_1conns = _jsPlumb.select({source:c3_1});
        equal(c3_1conns.length, 2, "still 2 source connections for c3_1");
        equal(_jsPlumb.select({target:c3_1}).length, 1, "still 1 target connection for c3_1");
        equal(_jsPlumb.select({source:container3}).length, 0, "no source connections for container3. the connections are proxied.");
        equal(_jsPlumb.select({target:container3}).length, 0, "no target connections for container3. the connections are proxied.");

        _jsPlumb.expandGroup("three");
        equal(_jsPlumb.select({source:container3}).length, 0, "no connections for container3");
        equal(_jsPlumb.select({target:container3}).length, 0, "no connections for container3");
        c3_1conns = _jsPlumb.select({source:c3_1});
        equal(c3_1conns.length, 2, "still 2 source connections yet for c3_1");
        ok(c3_1conns.get(0).isVisible(), "first c3_1 connection is visible");
        ok(c3_1conns.get(1).isVisible(), "second c3_1 connection is visible");
        ok(!_jsPlumb.hasClass(c3, "jtk-group-collapsed"), "group doesnt have collapsed class");

    });

    test("group in collapsed state to start", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50);
        var g = _addGroup(_jsPlumb, "one", c1, [], { collapsed:true });
        ok(_jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group has collapsed class");
        ok(g.collapsed === true, "Group is collapsed");

        _jsPlumb.expandGroup("one");
        ok(!_jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group doesnt have collapsed class");
        ok(g.collapsed !== true, "Group is not collapsed");

        _jsPlumb.collapseGroup("one");
        ok(_jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group has collapsed class");
        ok(g.collapsed === true, "Group is collapsed");


    });

    test("group collapse that does not wish to be proxied.", function() {

        _setupGroups();

        equal(_jsPlumb.select({source:c6_1}).length, 1, "1 source connection for c6_1");
        equal(_jsPlumb.select({target:c6_2}).length, 1, "1 target connection for c6_2");
        _jsPlumb.collapseGroup("six");

        var c6_1conns = _jsPlumb.select({source:c6_1});
        equal(c6_1conns.length, 1, "still 1 source connection for c6_1");
        equal(_jsPlumb.select({target:c6_2}).length, 1, "still 1 target connection for c6_2");
        equal(c6_1conns.get(0).endpoints[0].element.id, "c6_1", "source endpoint unchanged for connection");
        ok(!c6_1conns.get(0).isVisible(), "source connection is not visible.");

        _jsPlumb.expandGroup("six");
        ok(c6_1conns.get(0).isVisible(), "source connection is visible.");

    });

    test("multiple group collapse and expand", function() {
        _setupGroups();

        equal(_jsPlumb.select({source:c3_1}).length, 2, "2 source connections for c3_1");
        _jsPlumb.collapseGroup("three");
        var c3_1_source = _jsPlumb.select({source:c3_1});
        equal(c3_1_source.length, 2, "still 2 source connections for c3_1");
        equal(c3_1_source.get(0).proxies[0].originalEp.element.id, "c3_1", "proxy configured correctly");
        equal(c3_1_source.get(1).proxies.length, 0, "second source connection from c3_1 not proxied as it goes to c3_2");
        ok(!c3_1_source.get(1).isVisible(), "second source connection from c3_1 not visible as it goes to c3_2");

        _jsPlumb.collapseGroup("five");

        _jsPlumb.expandGroup("five");

        _jsPlumb.expandGroup("three");

        _jsPlumb.collapseGroup("three");
    });

    test("drop on collapsed group", function() {
        _setupGroups(true);

        equal(_jsPlumb.select().length, 0, "0 connections to start");

        // a connection to the group to be collapsed
        var c = _jsPlumb.connect({source:c4_2, target:c3_1});
        // a connection from the group to be collapsed
        var c2 = _jsPlumb.connect({source:c3_2, target:c1_1});
        // a connection between two other elements, but which will become owned by the collapse group.
        var c3 = _jsPlumb.connect({source:c2_1, target:c5_1});

        equal(_jsPlumb.select().length, 3, "3 connections in total");

        // drop an element on a collapsed group
        // expand it afterwards
        // check everything is hunky dory
        _jsPlumb.collapseGroup("three");

        equal(c.proxies[1].originalEp.element.id, "c3_1", "target connection has been correctly proxied");
        ok(c.proxies[0] == null, "source connection has been correctly proxied");

        equal(c2.proxies[0].originalEp.element.id, "c3_2", "source connection has been correctly proxied");
        ok(c2.proxies[1] == null, "target connection has been correctly proxied");

        support.dragToGroup( c4_2, "three");

        equal(_jsPlumb.getGroup("three").children.length, 3, "there are 3 members in group 3 after node c4_1 dropped in it");
        equal(_jsPlumb.getGroup("four").children.length, 1, "there is 1 member in group 4 after node c4_1 moved out");

        // dragging c4_2 to group 3 means that its connection to c3_1 is now internal to the group,
        // and since the group is collapsed, it should not be visible.
        equal(false, c.isVisible(), "original connection now between two members of collapsed group and is invisible.");
        equal(c.proxies.length, 0, "source and target connection proxy removed now that the connection is internal");
        //ok(c.proxies[1] == null, "target connection proxy removed now that the connection is internal");

        equal(c.endpoints[0].element.id, "c4_2", "source endpoint reset to original");
        equal(c.endpoints[1].element.id, "c3_1", "target endpoint reset to original");

        support.dragToGroup( c5_1, "three");
        equal(_jsPlumb.getGroup("three").children.length, 4, "there are 4 members in group 3 after node moved dropped ");
        equal(_jsPlumb.getGroup("five").children.length, 1, "there is 1 member in group 5 after node moved out");
        ok(c3.proxies[0] == null, "source in connection dropped on collapsed group did not need to be proxied");
        equal(c3.endpoints[0].element.id, "c2_1", "source in connection dropped on collapsed group is unaltered");
        equal(c3.proxies[1].originalEp.element.id, "c5_1", "target in connection dropped on collapsed group has been correctly proxied");

        equal(_jsPlumb.select().length, 3, "3 connections in total");

    });

    test("a series of group collapses and expansions", function()
    {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1}),
            ep1 = c.endpoints[0],
            ep2 = c.endpoints[1];

//        equal(_jsPlumb.getGroup("three").proxies.length, 0, "there are 0 proxies in group 3 to begin");
//        equal(_jsPlumb.getGroup("four").proxies.length, 0, "there are 0 proxies in group 4 to begin");

        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
//        equal(_jsPlumb.getGroup("two").proxies.length, 1, "there is 1 proxy in group 2");
//        equal(_jsPlumb.getGroup("three").proxies.length, 0, "there are 0 proxies in group 3");

        equal(_jsPlumb.select().length, 1, "one connection after collapse 2");

        _jsPlumb.collapseGroup("three");

        _jsPlumb.expandGroup("three");

        _jsPlumb.expandGroup("two");

        _jsPlumb.collapseGroup("three");
    });


    test("deletion of proxy connections cleans up their proxied connections.", function() {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1});

        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
        equal(c.endpoints[0].element.id, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.element.id, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the proxy connection. it should clean up the original one. then when we collapse group three
        // there should be no connections of any sort.
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select().length, 0, "no connections");
    });


    test("deletion of proxIED connections cleans up their proxy connections.", function() {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1});


        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
        equal(c.endpoints[0].element.id, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.element.id, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the connection. it should clean up the original one. then when we collapse group three
        // there should be no connections of any sort.
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select().length, 0, "there should be no connections left after detach");
        equal(c.proxies.length, 0, "proxies not removed after detach, but cleaned up");
    });

    test("indirect deletion of proxIED connections cleans up their proxy connections.", function() {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1});

        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
        equal(c.endpoints[0].element.id, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.element.id, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the connection's endpoint.
        _jsPlumb.deleteEndpoint(c.endpoints[1]);
        equal(_jsPlumb.select().length, 0, "no connections");

    });

    test("move connections between group children via dragging connections", function() {
        _setupGroups(true);

        equal(_jsPlumb.select().length, 0, "0 connections to start");

        // a connection to the group to be collapsed
        var c = _jsPlumb.connect({source: c4_2, target: c3_1});
        _jsPlumb.addTargetSelector("#c2_1");

        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source conn in group 4");
        equal(_jsPlumb.getGroup("three").connections.target.length, 1, "one target conn in group 3");
        equal(_jsPlumb.getGroup("two").connections.target.length, 0, "zero target conns in group 2 before move");

        support.relocateTarget(c, c2_1);
        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source conn in group 4 after move");
        equal(_jsPlumb.getGroup("three").connections.target.length, 0, "zero target conns in group 3 after move");
        equal(_jsPlumb.getGroup("two").connections.target.length, 1, "one target conn in group 2 after move");
    });

    test("move connections between group children via dragging connections", function() {
        _setupGroups(true);

        equal(_jsPlumb.select().length, 0, "0 connections to start");

        // a connection to the group to be collapsed
        var c = _jsPlumb.connect({source: c4_2, target: c3_1});
        _jsPlumb.addTargetSelector("#c2_1");

        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source conn in group 4");
        equal(_jsPlumb.getGroup("three").connections.target.length, 1, "one target conn in group 3");

        support.relocateTarget(c, c2_1);
        equal(_jsPlumb.getGroup("four").connections.source.length, 1, "one source conn in group 4 after move");
        equal(_jsPlumb.getGroup("three").connections.target.length, 0, "zero target conns in group 3 after move");
        equal(_jsPlumb.getGroup("two").connections.target.length, 1, "one target conn in group 2 after move");
    });

    test("cannot create duplicate group", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addGroup({el:d1, id:"group"});
        try {
            _jsPlumb.addGroup({el:d2, id:"group"});
            ok(false, "should have thrown an error when trying to a duplicate group")
        }
        catch (e) {
            expect(0);
        }
    });

    test("cannot create a new Group with an element that is already configured as a Group", function() {
        var d1 = support.addDiv("d1");
        _jsPlumb.addGroup({el:d1, id:"group"});
        try {
            _jsPlumb.addGroup({el:d1, id:"group2"});
            ok(false, "should have thrown an error when trying to a add a group element as a new group")
        }
        catch (e) {
            expect(0);
        }

    });

    test("retrieve information about an element's Group, by ID", function() {
        _setupGroups(true);
        equal("four", _jsPlumb.getGroupFor(document.getElementById("c4_2")).id, "group id is correct, element referenced by ID");
    });

    test("retrieve information about an element's Group, by element", function() {
        _setupGroups(true);
        equal("four", _jsPlumb.getGroupFor(document.getElementById("c4_2")).id, "group id is correct, element referenced by ID");
    });

    test("retrieve information about a non existent element's Group", function() {
        equal(null, _jsPlumb.getGroupFor("unknown"), "group is null because element doesn't exist");
    });

    test("add elements that already have connections to a group", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source:d1, target:d2}),
            c2 = _jsPlumb.connect({source:d1, target:d3}),
            g = support.addDiv("group");

        equal(2, _jsPlumb.select().length, "there are two connections");

        var group = _jsPlumb.addGroup({
            el:g
        });

        // add d1; it has a connection to outside and also one to d3, which will be inside the group. add d3.
        group.add(d1); group.add(d3);
        // collapse the group. the connection from d1 should be proxied. the connection from d3 should not.
        _jsPlumb.collapseGroup(group);
        equal(2, _jsPlumb.select().length, "there are two connections");
        // test for proxied
        equal("d1", c.proxies[0].originalEp.element.id, "endpoint was proxied after collapse");
        // test for proxied
        equal("d1", c2.endpoints[0].element.id, "endpoint to internal element was not proxied after collapse");
        equal("d3", c2.endpoints[1].element.id, "endpoint to internal element was not proxied after collapse");
        equal(0, c2.proxies.length, "connection 2 did not get proxies added");

        // expand and test proxy was cleared
        _jsPlumb.expandGroup(group);
        ok(c.proxies[0] == null, "proxies removed after expand");
        // remove from the group and collapse
        group.remove(d1);
        _jsPlumb.collapseGroup(group);
        // test proxy was not attached
        ok(c.proxies[0] == null, "proxies not setup since element was removed");

        // expand
        _jsPlumb.expandGroup(group);

        // add d1 again; it has a connection
        group.add(d1);
        // collapse the group. the connection from d1 should be proxied.
        _jsPlumb.collapseGroup(group);
        // test for proxied
        equal("d1", c.proxies[0].originalEp.element.id, "endpoint was proxied after collapse");
        equal(2, group.children.length, "two members in group");

        group.removeAll();
        equal(0, group.children.length, "no members in group");
        _jsPlumb.expandGroup(group);

        c.proxies[0] = "flag";

        _jsPlumb.collapseGroup(group);
        // test proxy was not attached
        ok(c.proxies[0] == "flag", "proxies not setup since all elements were removed");
    });

    test("drag a connection from an element to a group", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        _jsPlumb.manageAll([d1])

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.addTargetSelector("#group");
        _jsPlumb.addSourceSelector("#d1");

        var c = support.dragConnection(d1, g);
        var conns = _jsPlumb.select();

        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, g, "target is the group element");
        equal(conns.get(0).source, d1, "source is the node element");
    });

    test("connect element to group, drag element inside the group, collapse then expand. Should not fail.", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            d2 = support.addDiv("d2", null, null, 10,10, 40, 40),
            d3 = support.addDiv("d3", null, null, 10,10, 40, 40),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        _jsPlumb.manageAll([d1, d2, d3])

        var group = _jsPlumb.addGroup({ el:g,
            revert:false,
            orphan:true,
            constrain:false
        });

        // support.dragToGroup( d3, group)
        // support.dragToGroup( d1, group)
        _jsPlumb.addToGroup(group, d1, d3)

        _jsPlumb.connect({source:d1, target:g, anchor:"Continuous", endpoint:"Blank"})
        _jsPlumb.connect({source:d1, target:d3, anchor:"Continuous", endpoint:"Blank"})
        _jsPlumb.connect({source:d1, target:d2, anchor:"Continuous", endpoint:"Blank"})

        /*_jsPlumb.connect({source:d1, target:g, anchor:"Continuous"})
        var conns = _jsPlumb.select();



        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, g, "target is the group element");
        equal(conns.get(0).source, d1, "source is the node element");



        _jsPlumb.connect({source:d1, target:d2, anchor:"Continuous"})
        _jsPlumb.connect({source:d3, target:d1, anchor:"Continuous"})

        */equal(3, _jsPlumb.select().length, "there are 3 connections");

        _jsPlumb.collapseGroup(group)

        try {
            _jsPlumb.expandGroup(group)
            ok(true, "group was expanded after collapsed without throwing an error")
        } catch (e) {
            ok(false, "group threw an error when it was expanded")
        }
    });

    test("drag a connection from an element to an element inside a group, element added to group before any elements made source/target", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            d2 = support.addDiv("d2", null, null, 0,0, 40, 40),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        _jsPlumb.manageAll([d1, d2])

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.addToGroup(group, d2);
        _jsPlumb.addTargetSelector("#group", {rank:0});
        _jsPlumb.addSourceSelector("#d1");
        _jsPlumb.addTargetSelector("#d2", {rank:10});

        d2.style.left = "40px";
        d2.style.top = "40px";

        var c = support.dragConnection(d1, d2);
        var conns = _jsPlumb.select();

        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, d2, "target is d2");
        equal(conns.get(0).source, d1, "source is d1");
    });

    test("drag a connection from an element to an element inside a group, element added to group after elements made source/target", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        _jsPlumb.manageAll([d1])
        _jsPlumb.addSourceSelector("#d1");

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.addTargetSelector("#group", {rank:0});

        var d2 = support.addDiv("d2", null, null, 0,0, 40, 40);
        _jsPlumb.addToGroup(group, d2);
        _jsPlumb.addTargetSelector("#d2", {rank:10});

        d2.style.left = "40px";
        d2.style.top = "40px";

        var c = support.dragConnection(d1, d2);
        var conns = _jsPlumb.select();

        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, d2, "target is d2");
        equal(conns.get(0).source, d1, "source is d1");
    });

    // -------------------------- drop precedence (required for nodes inside groups that are also droppables)
    test("drop precedence, set positive rank on element to upgrade", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.manageAll([d1, d2, d3])

        _jsPlumb.addTargetSelector("#d1", {rank:0});

        _jsPlumb.addTargetSelector("#d2", {rank:10}/*, {
         dropOptions:{
         rank:10
         }
         }*/);

        _jsPlumb.addSourceSelector("#d3");

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);

        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, and it was first.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2");

    });

    // there are no dropOptions on a per-element basis after the rewrite.  is that a bad thing?
    // test("drop precedence, set negative rank on element to downgrade", function() {
    //     var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
    //     var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
    //     var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);
    //
    //     _addGroup(_jsPlumb, "g1", d1, [d2]);
    //
    //     _jsPlumb.makeTarget(d1/*, {
    //      dropOptions:{
    //      rank:-10
    //      }
    //      }*/);
    //
    //     _jsPlumb.makeTarget(d2, {rank:-10});
    //
    //     _jsPlumb.makeSource(d3);
    //
    //     var sourceEvent = support.makeEvent(d3);
    //     var d2TargetEvent = support.makeEvent(d2);
    //
    //     _jsPlumb.trigger(d3, "mousedown", sourceEvent);
    //     _jsPlumb.trigger(document, "mousemove", d2TargetEvent);
    //
    //
    //     ok(d1.classList.contains("jtk-drag-hover"), "d1 has hover class");
    //     ok(!d2.classList.contains("jtk-drag-hover"), "d2 does not have hover class; only d1 has.");
    //
    //     _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);
    //
    //     equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
    //     equal(d1, _jsPlumb.select().get(0).target, "connection target is d2");
    //
    // });

    test("drag connection to node inside group, group configured first", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.manageAll([d1, d2, d3])
        _jsPlumb.addTargetSelector("#d1");
        _jsPlumb.addTargetSelector("#d2");

        _jsPlumb.addSourceSelector("#d3");

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);

        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, even though it was second.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2 (the node)");

    });

    test("drop on node inside group, group configured last", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 20, 20, 20, 20);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.manageAll([d1, d2, d3])

        _jsPlumb.addTargetSelector("#d2");
        _jsPlumb.addTargetSelector("#d1");

        _jsPlumb.addSourceSelector("#d3");

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);

        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, and it was first.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2");

    });

    // test("drop precedence, equal ranks, order of droppable is used, group first", function() {
    //     var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
    //     var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
    //     var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);
    //
    //     _addGroup(_jsPlumb, "g1", d1, [d2]);
    //
    //     _jsPlumb.makeTarget(d1, {
    //         dropOptions: {
    //             rank: 5
    //         }
    //     });
    //     _jsPlumb.makeTarget(d2, {
    //         dropOptions: {
    //             rank: 5
    //         }
    //     });
    //
    //     _jsPlumb.makeSource(d3);
    //
    //     var sourceEvent = support.makeEvent(d3);
    //     var d2TargetEvent = support.makeEvent(d2);
    //
    //     _jsPlumb.trigger(d3, "mousedown", sourceEvent);
    //     _jsPlumb.trigger(document, "mousemove", d2TargetEvent);
    //
    //
    //     ok(d1.classList.contains("jtk-drag-hover"), "d1 has hover class");
    //     ok(!d2.classList.contains("jtk-drag-hover"), "d2 does not have hover class; only d1 has, and it was first.");
    //
    //     _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);
    //
    //     equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
    //     equal(d1, _jsPlumb.select().get(0).target, "connection target is d1");
    //
    // });

    test("drop precedence, equal ranks, order of droppable is used, group last", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.manageAll([d2, d1, d3])

        _jsPlumb.addTargetSelector("#d2", { rank:5 });
        _jsPlumb.addTargetSelector("#d1", { rank:5 });

        _jsPlumb.addSourceSelector("#d3");

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);

        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, and it was first.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2");

    });

    test("drag node out of group and then back in", function() {
        var d1 = support.addDiv("d1", container, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", container, null, 700, 700, 50, 50);

        _jsPlumb.manageAll([d1, d2, d3])

        var g1 = _addGroup(_jsPlumb, "g1", d1, [d2], {orphan:true});
        equal(g1.children.length, 1, "group 1 has one member");

        var removeEvt = false, addEvt = false;
        _jsPlumb.bind("group:member:removed", function() {
            removeEvt = true;
        });

        _jsPlumb.bind("group:member:added", function() {
            addEvt = true;
        });

        support.dragNodeBy(d2, -500,-500);

        equal(g1.children.length, 0, "group 1 has zero members");

        ok(removeEvt, "the remove group member event was fired");

        removeEvt = false;

        support.dragNodeBy(d2, 300,300);

        ok(addEvt, "the add group member event was fired");

    });

    test("drag node out of one group and into another; move flag set in remove and add events", function() {
        var d1 = support.addDiv("d1", container, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        d2.style.zIndex = 5000;
        var d3 = support.addDiv("d3", container, null, 700, 700, 50, 50);

        var g1 = _addGroup(_jsPlumb, "g1", d1, [d2], {orphan:true});

        var g3 = _addGroup(_jsPlumb, "g3", d3, [], {orphan:true});

        _jsPlumb.manageAll([d1, d2, d3])

        equal(g1.children.length, 1, "group 1 has one child");

        var removeEvt = false, addEvt = false, targetGroup, sourceGroup;
        _jsPlumb.bind("group:member:removed", function(p) {
            removeEvt = true;
            targetGroup = p.targetGroup;
        });

        _jsPlumb.bind("group:member:added", function(p) {
            addEvt = true;
            sourceGroup = p.sourceGroup;
        });

        support.dragNodeBy(d2, 510,510);

        equal(g1.children.length, 0, "group 1 has zero children");

        ok(removeEvt, "the remove group member event was fired");
        ok(addEvt, "the add group member event was fired");

        equal(targetGroup.id, "g3", "g3 reported as target group in remove from group event");
        equal(sourceGroup.id, "g1", "g1 reported as source group in add to group event");

    });

    /**
     * create a group and give it two child nodes, each of which has a child node, and these grandchildren nodes are connected. test that the connection is visible.
     * collapse the group and then test that the connection is not visible.  expand the group and test that it is
     * once again.
     */
    test("groups, connections between children of nodes, both nodes child of the group", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50, 600, 600);
        c1.style.position="relative";

        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c1_2 = support.addDiv("c1_2", c1, "w", 480, 130, 150, 150);
        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1, c1_2], { constrain:true, droppable:false});

        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c1_1_2 = support.addDiv("c1_1_2", c1_2, "w", 30, 30, 50, 50);

        var conn = _jsPlumb.connect({source:c1_1_1, target:c1_1_2});
        //equal(g1.connections.source.length, 1, "1 connection in group source connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g1);

        equal(false, conn.isVisible(), "connection is not visible after group collapse");

        _jsPlumb.toggleGroup(g1);

        equal(true, conn.isVisible(), "connection is visible once more");



    });

    test("groups, connections between nodes (sanity test for next test), nodes child of different groups", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50);
        c2 = support.addDiv("container2", null, "container", 300, 50);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);
        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [c2_1], { constrain:true, droppable:false});

        _jsPlumb.connect({source:c1_1, target:c2_1});
        equal(g1.connections.source.length, 1, "1 connection in group source connections");

    });

    test("groups, connections between children of nodes, nodes child of different groups", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50, 500, 500);
        c2 = support.addDiv("container2", null, "container", 300, 50, 500, 500);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130, 150, 150);
        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [c2_1], { constrain:true, droppable:false});

        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c2_1_1 = support.addDiv("c2_1_1", c2_1, "w", 30, 30, 50, 50);

        var conn = _jsPlumb.connect({source:c1_1_1, target:c2_1_1});
        equal(g1.connections.source.length, 1, "1 connection in group source connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g1);

        equal(true, conn.isVisible(), "connection is visible after group collapse, because the group shows proxies.");

        // make sure that the child's connection is removed from the group when the element is removed.
        _jsPlumb.removeFromGroup(g1, c1_1);
        equal(g1.connections.source.length, 0, "0 connections in group source connections");

    });

    test("groups, connections between children of nodes, children connected before adding to group", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50, 500, 500);
        c2 = support.addDiv("container2", null, "container", 300, 50, 500, 500);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130, 150, 150);

        // create child elements and connect them
        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c2_1_1 = support.addDiv("c2_1_1", c2_1, "w", 30, 30, 50, 50);
        var conn = _jsPlumb.connect({source:c1_1_1, target:c2_1_1});

        //g1 = _addGroup(_jsPlumb, "one", c1, [], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [], { constrain:true, droppable:false});

        // add c2_1 to group 2.  c2_1 is not connected to anything itself, it has a child that is the target of a connection, though.
        _jsPlumb.addToGroup(g2, c2_1);

        equal(g2.connections.target.length, 1, "1 connection in group target connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g2);

        equal(true, conn.isVisible(), "connection is visible after group collapse, because the group shows proxies.");

        // make sure that the child's connection is removed from the group when the element is removed.
        _jsPlumb.removeFromGroup(g2, c2_1);
        equal(g2.connections.target.length, 0, "0 connections in group target connections");

    });

    test("groups, remove child while group is collapsed - proxy connection should be cleaned up, reconnected to node", function() {

        c1 = support.addDiv("group1", null, "container", 0, 50, 500, 500);
        c2 = support.addDiv("group2", null, "container", 300, 50, 500, 500);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130, 150, 150);

        // create child elements and connect them
        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c2_1_1 = support.addDiv("c2_1_1", c2_1, "w", 30, 30, 50, 50);
        var conn = _jsPlumb.connect({source:c1_1_1, target:c2_1_1});

        var g2 = _addGroup(_jsPlumb, "two", c2, [], { constrain:true, droppable:false});

        // add c2_1 to group 2.  c2_1 is not connected to anything itself, it has a child that is the target of a connection, though.
        _jsPlumb.addToGroup(g2, c2_1);

        equal(c2, c2_1.parentNode, "group 2's element is parent node of c2_1");

        equal(1, g2.connections.target.length, "1 connection in group target connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g2);

        equal(true, conn.isVisible(), "connection is visible after group collapse, because the group shows proxies.");

        // make sure that the child's connection is removed from the group when the element is removed.
        _jsPlumb.removeFromGroup(g2, c2_1);
        equal(g2.connections.target.length, 0, "0 connections in group target connections");
        equal(c2_1.parentNode, _jsPlumb.getContainer(), "container is parent node of c2_1 after removal from group");

        var groupConns = _jsPlumb.getConnections({target:c2, scope:'*'});
        equal(0, groupConns.length, "no connections registered for the group element");

        equal(true, conn.isVisible(), "connection is visible ");

        equal(conn.source, c1_1_1, "c1_1_1 is connection source after removal from group");
        equal(conn.target, c2_1_1, "c2_1_1 is connection target after removal from group");

        var conns = _jsPlumb.getConnections({source:c1_1_1, scope:'*'});
        equal(conns.length, 1, "1 connection registered for c1_1_1");

    });

    /**
     * tests a specific problem in the original rewrite: an edge between two nodes which are children of different
     * groups
     */
    test("nodes inside groups, collapse both groups, expand both groups", function() {

        var c1 = support.addDiv("container1", null, "container", 0, 50),
            c2 = support.addDiv("container2", null, "container", 300, 50);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";

        var c1_1 = support.addDiv("c1_1", c1, "w", 30, 30),
            c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);

        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1]);
        var g2 = _addGroup(_jsPlumb, "two", c2, [c2_1]);

        var conn = _jsPlumb.connect({source:c1_1, target:c2_1});

        equal(conn.endpoints[0].element, c1_1, "c1_1 is connection source");
        equal(conn.endpoints[1].element, c2_1, "c2_1 is connection target");

        _jsPlumb.collapseGroup("one");

        equal(conn.endpoints[0].element, c1, "c1 is connection source");
        equal(conn.endpoints[1].element, c2_1, "c2_1 is connection target");

        _jsPlumb.collapseGroup("two");

        equal(conn.endpoints[0].element, c1, "c1 is connection source");
        equal(conn.endpoints[1].element, c2, "c2 is connection target");

        _jsPlumb.expandGroup("one");

        equal(conn.endpoints[0].element, c1_1, "c1_1 is connection source");
        equal(conn.endpoints[1].element, c2, "c2 is connection target");

        _jsPlumb.expandGroup("two");

        // this is where the original code would fail: the target did not get reinstated to be c2_1, because the unproxy method
        // that ran when we expanded group one blew away the proxies, so when it came to unproxying this side it didnt know
        // it should.
        equal(conn.endpoints[0].element, c1_1, "c1_1 is connection source");
        equal(conn.endpoints[1].element, c2_1, "c2_1 is connection target");


    });

    test("nested groups, setup", function() {

        var c1 = support.addDiv("container1", null, "container", 0, 50),
            c2 = support.addDiv("container2", null, "container", 300, 50);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";

        var c1_1 = support.addDiv("c1_1", c1, "w", 30, 30),
            c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);

        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1]);
        var g2 = _addGroup(_jsPlumb, "two", c2, [c2_1]);

        g1.addGroup(g2);

        equal(1, g1.getGroups().length, "g1 has one child group");

        var g1DragArea = _jsPlumb.getGroupContentArea(g1)
        equal(g1DragArea, g2.el.parentNode, "g2 has been set as a child of g1's drag area");

        equal(0, g2.getGroups().length, "g2 initially has one child group");

        // create a new group and add as a child of g2 (which is itself a child of g1)
        var c3 = support.addDiv("container3", null, "container", 300, 50);
        c3.style.outline = "1px solid black";
        var g3 = _addGroup(_jsPlumb, "three", c3, []);
        g2.addGroup(g3);

        equal(1, g2.getGroups().length, "g2 now has one child group");
        equal(_jsPlumb.getGroupContentArea(g2), g3.el.parentNode, "g3 has been set as a child of g2's drag area");

    });

    test("nested groups, access parent, collapseParent and proxyGroup properties", function() {

        var c1 = support.addDiv("container1", null, "container", 0, 50, 400, 400),
            c2 = support.addDiv("container2", null, "container", 300, 50, 400, 400),
            c3 = support.addDiv("container3", null, "container", 300, 50, 400, 400);

        c1.style.outline = "1px solid black";
        c2.style.outline = "1px solid black";
        c3.style.outline = "1px solid black";

        var c1_1 = support.addDiv("c1_1", c1, "w", 30, 30),
            c2_1 = support.addDiv("c2_1", c2, "w", 180, 130);

        var g1 = _addGroup(_jsPlumb, "one", c1, [c1_1]);
        var g2 = _addGroup(_jsPlumb, "two", c2, [c2_1]);
        var g3 = _addGroup(_jsPlumb, "three", c3, []);

        g1.addGroup(g2);
        g2.addGroup(g3);

        equal(g2.group, g1, "group 2's parent is group one");
        equal(g3.group, g2, "group 3's parent is group two");

        equal(g2.proxyGroup, null, "g2 reports null as the group handling its proxies to start with");
        equal(g3.proxyGroup, null, "g3 reports null as the group handling its proxies to start with");

        // collapse g2.
        equal(g2.collapsed, false, "g2 is not collapsed");
        _jsPlumb.collapseGroup(g2);
        equal(g2.collapsed, true, "g2 is collapsed now");

        // g3's collapseParent should be g2
        equal(g3.collapseParent, g2, "g3's collapseParent is g2");

        // now collapse g1. g2 should report it as its collapseParent - and so should g3.
        _jsPlumb.collapseGroup(g1);
        equal(g2.collapseParent, g1, "g2's collapseParent is g1");
        equal(g3.collapseParent, g1, "g3's collapseParent is g1");

        // create a new group, g0.  collapse it. add g1 to it. g2 and g3 should report g0 as their collapse parent.
        var c0 = support.addDiv("container0", null, "container", 0, 50);
        var g0 = _addGroup(_jsPlumb, "zero", c0, []);
        _jsPlumb.collapseGroup(g0);

        g0.addGroup(g1);
        equal(g1.collapseParent.id, "zero", "g1's collapseParent is g0 after being added to g0");
        equal(g2.collapseParent.id, "zero", "g2's collapseParent is g0 after being added to g0");
        equal(g3.collapseParent.id, "zero", "g3's collapseParent is g0 after being added to g0");

        // expand g0. g1 should report no collapseParent. g2 and g3 should report g1.
        _jsPlumb.expandGroup(g0);
        equal(g1.collapseParent, null, "g1's collapseParent is null after g0 is expanded");
        equal(g2.collapseParent.id, "one", "g2's collapseParent is still g1 after g0 is expanded");
        equal(g3.collapseParent.id, "one", "g3's collapseParent is still g1 after g0 is expanded");

        // expand g1. g1 and g2 should report no collapse group. g3 should report g2.
        _jsPlumb.expandGroup(g1);
        equal(g1.collapseParent, null, "g1's collapseParent is null after g1 is expanded");
        equal(g2.collapseParent, null, "g2's collapseParent is null after g1 is expanded");
        equal(g3.collapseParent, g2, "g3's collapseParent is still g2 after g1 is expanded");

    });

    test("nested group collapse and expand, group added to parent group before collapse", function() {

        var g1 = _addGroupAndContainer(100,100),
            g2 = _addGroupAndContainer(400,400),
            g3 = _addGroupAndContainer(),
            n1_1 = _addNodeToGroup(g1),
            n2_1 = _addNodeToGroup(g2),
            n3_1 = _addNodeToGroup(g3),
            n4 = _addNode(500, 20, 50, 50);

        var c = _jsPlumb.connect({source:n3_1, target:n4}); // connect node in group 3 to node 4, which is standalone.
        equal(g3.connections.source.length, 1, "group 3 shows 1 source connection");

        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // collapse group 3, which is the parent of n3_1, and the source of the connection should now be g3's element, as it is proxied.
        _jsPlumb.collapseGroup(g3);
        equal(c.endpoints[0].element, g3.el, "source element is g3");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // ok now expand g3 and check its back to how it was
        _jsPlumb.expandGroup(g3);
        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // equal(g2.connections.source.length, 0, "no source connections for g2");
        // equal(g2.connections.source.length, 0, "no connections for g2");

        // add g3 as a child to g2
        g2.addGroup(g3);
        // manually resize group 2, this is just for me to look at, because g3 appears outside g2 even though its not.
        g2.el.style.width="700px";
        g2.el.style.height="700px";

        equal(g3.el._jsPlumbParentGroup.id, g2.id, "g2 marked as parent group on g3's element");

        // STATE 1: g3 is a child of g2. both g3 and g2 expanded. connection goes from n3 (child of g3) to n4 (not a group child)
        equal(1, g2.getGroups().length, "g2 now has one child group");
        equal(_jsPlumb.getGroupContentArea(g2), g3.el.parentNode, "g3 has been set as a child of g2's drag area");
        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // collapse g2, the edge source should now be g2's element
        _jsPlumb.collapseGroup(g2);
        equal(c.endpoints[0].element, g2.el, "source element is g2");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // so now we have group2 collapsed, with a connection showing to node 4. group 3 is a child of group2 and not visible. node 3, a child of group 3, is also not
        // visible.  if we collapse group 3 then nothing should happen to this arrangement:

        _jsPlumb.collapseGroup(g3);
        equal(c.endpoints[0].element, g2.el, "source element is g2");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // if we expand group 3 there should still be no change, because it's inside a collapsed group.
        _jsPlumb.expandGroup(g3);
        equal(c.endpoints[0].element, g2.el, "source element is g2");
        equal(c.endpoints[1].element, n4, "source element is n4");

        // so now again we have group2 collapsed, with a connection showing to node 4. group 3 is a child of group2 and not visible. node 3, a child of group 3, is also not
        // visible.
        // expand group 2. should return to state 1.
        // STATE 1: g3 is a child of g2. both g3 and g2 expanded. connection goes from n3 (child of g3) to n4 (not a group child)
        _jsPlumb.expandGroup(g2);
        equal(1, g2.getGroups().length, "g2 now has one child group");
        equal(_jsPlumb.getGroupContentArea(g2), g3.el.parentNode, "g3 has been set as a child of g2's drag area");
        equal(c.endpoints[0].element, n3_1, "source element is n3_1");
        equal(c.endpoints[1].element, n4, "source element is n4");

    });

    test("nested groups, collapse group that has a child group, each group has a node, and they are connected. On collapse, that connection should be hidden.", function() {
        // should remove from the current group and add to the new one

        var g1 = _addGroupAndContainer(100,100),
            g2 = _addGroupAndContainer(400,400),
            n1_1 = _addNodeToGroup(g1),
            n2_1 = _addNodeToGroup(g2);

        g2.addGroup(g1);
        g1.el.style.left = "100px";
        g1.el.style.top = "100px";
        _jsPlumb.revalidate(g1.el);

        var c = _jsPlumb.connect({source:n1_1, target:n2_1, connector:"StateMachine", anchor:"Continuous"}); // connect node in group 3 to node 4, which is standalone.
        equal(c.isVisible(), true, "connection initially visible");

        var c2 = _jsPlumb.connect({source:n2_1, target:n1_1, connector:"StateMachine", anchor:"Continuous"}); // connect node in group 3 to node 4, which is standalone.
        equal(c2.isVisible(), true, "connection 2 initially visible");

        _jsPlumb.collapseGroup(g2);

        equal(c.isVisible(), false, "connection is not visible after group collapse");
        equal(c2.isVisible(), false, "connection 2 is not visible after group collapse");

    });

    test("nested groups, dont try to add a group to itself.", function() {
        var g1 = _addGroupAndContainer(100,100);

        var added = g1.addGroup(g1);
        equal(added, false, "g1 reports that it was not added to itself");
        equal(0, g1.getGroups().length, "g1 has zero child groups");

    });

    test("nested groups, adding a group to some other group of which it is an ancestor does not succeed", function() {
        var groupA = _addGroupAndContainer(100,100),
            groupB = _addGroupAndContainer(400,400),
            n1_1 = _addNodeToGroup(groupA),
            n2_1 = _addNodeToGroup(groupB);

        groupB.addGroup(groupA);

        equal(groupB.getGroups().length, 1, "g2 has one child group");
        equal(groupA.getGroups().length, 0, "g1 has zero child groups");

        _jsPlumb.connect({source:n1_1, target:n2_1});

        groupA.addGroup(groupB);
        equal(groupB.getGroups().length, 1, "g2 has one child group");
        equal(groupA.getGroups().length, 0, "g1 has zero child groups");
    });

    test("nested groups, group A is child of group B. group C is child of group A. Add group B as a child to Group C. Should not work. ", function() {
        var groupA = _addGroupAndContainer(100,100),
            groupB = _addGroupAndContainer(400,400),
            groupC = _addGroupAndContainer(400,400),
            n1_1 = _addNodeToGroup(groupA),
            n2_1 = _addNodeToGroup(groupB);

        groupB.addGroup(groupA);
        groupA.addGroup(groupC);

        equal(groupB.getGroups().length, 1, "groupB has one child group");
        equal(groupA.getGroups().length, 1, "groupA has one child group");
        equal(groupC.getGroups().length, 0, "groupC zero child groups");

        _jsPlumb.connect({source:n1_1, target:n2_1});

        // cannot add B to A
        groupA.addGroup(groupB);
        equal(groupB.getGroups().length, 1, "groupB has one child group");
        equal(groupA.getGroups().length, 1, "groupA has one child group");

        // cannot add B to C
        groupC.addGroup(groupB);
        equal(groupB.getGroups().length, 1, "groupB has one child group");
        equal(groupA.getGroups().length, 1, "groupA has one child group");
        equal(groupC.getGroups().length, 0, "groupC has zero child groups");

        // CAN add C to B
        groupB.addGroup(groupC);
        equal(groupB.getGroups().length, 2, "groupB has two child groups");
        equal(groupA.getGroups().length, 0, "groupA has zero child groups");
        equal(groupC.getGroups().length, 0, "groupC has zero child groups");
        equal(_jsPlumb.getGroupContentArea(groupB), groupC.el.parentNode, "groupC is child of groupB in the DOM");
    });

    test("nested groups, one group can be dropped on another", function() {
        var groupA = _addGroupAndContainer(400,400),
            groupB = _addGroupAndContainer(100,100);

        support.dragToGroup( groupB.el, groupA);

        equal(_jsPlumb.getGroupContentArea(groupA), groupB.el.parentNode, "groupB is child of groupA in the DOM");
        equal(groupA.getGroups().length, 1, "groupA has one child group");

    });

    test("nested groups, a group can be dragged out of its parent group", function() {
        var groupA = _addGroupAndContainer(400,400),
            groupB = _addGroupAndContainer(100,100);

        groupA.orphan = true;

        support.dragToGroup( groupB.el, groupA);

        equal(_jsPlumb.getGroupContentArea(groupA), groupB.el.parentNode, "groupB is child of groupA in the DOM");
        equal(groupA.getGroups().length, 1, "groupA has one child group");

        support.dragAndAbortConnection(groupB.el);
        equal(_jsPlumb.getContainer(), groupB.el.parentNode, "groupB is no longer a child of groupA in the DOM after being dragged out");
        equal(groupA.getGroups().length, 0, "groupA has zero child groups");
        ok(groupB.group == null, "groupB has no parent group");
    });

    test("nested groups, a node can be dragged out of its parent nested group and its new position is reported correctly", function() {
        var groupA = _addGroupAndContainer(400,400),
            groupB = _addGroupAndContainer(100,100),
            nodeA = _addNodeToGroup(groupB, 50, 50, 50, 50)

        groupA.orphan = true;
        groupB.orphan = true;

        support.dragToGroup( groupB.el, groupA);

        equal(_jsPlumb.getGroupContentArea(groupA), groupB.el.parentNode, "groupB is child of groupA in the DOM");
        equal(groupA.getGroups().length, 1, "groupA has one child group");
        equal(nodeA._jsPlumbParentGroup, groupB, "node A is in group B")

        support.dragNodeTo(nodeA, 600, 0)

        equal(nodeA._jsPlumbParentGroup, null, "node A is not in group B after being dragged out")
        equal(parseInt(nodeA.style.left, 10), 600, "Node A at left 600")
        equal(parseInt(nodeA.style.top, 10), 0, "Node A at top 0")
        equal(0, groupB.children.length, "groupB has no children")
        equal(1, groupA.children.length, "groupA has one child")
    });

    test("nested groups, a nested group is in the drag selection, should not drag when its parent is dragged.", function() {
        var groupA = _addGroupAndContainer(400,400),
            groupB = _addGroupAndContainer(100,100),
            n2_1 = _addNodeToGroup(groupB);

        groupA.orphan = true;

        support.dragToGroup( groupB.el, groupA);

        equal(_jsPlumb.getGroupContentArea(groupA), groupB.el.parentNode, "groupB is child of groupA in the DOM");
        equal(groupA.getGroups().length, 1, "groupA has one child group");

        equal(parseInt(groupB.el.style.left, 10), 200, "group b at left 200")
        equal(parseInt(groupB.el.style.top, 10), 200, "group b at top 200")

        equal(parseInt(n2_1.style.left, 10), 30, "n2_1 at left 30")
        equal(parseInt(n2_1.style.top, 10), 30, "n2_1 at top 30")

        _jsPlumb.addToDragSelection(groupB.el)
        _jsPlumb.addToDragSelection(n2_1)

        support.dragNodeBy(groupA.el, 100, 100)

        equal(parseInt(groupB.el.style.left, 10), 200, "group b still at left 200")
        equal(parseInt(groupB.el.style.top, 10), 200, "group b still at top 200")
        equal(parseInt(n2_1.style.left, 10), 30, "n2_1 still at left 30")
        equal(parseInt(n2_1.style.top, 10), 30, "n2_1 still at top 30")

    });

    test("nested groups, a group is in the drag selection, should not drag when one of its descendants is dragged.", function() {
        var groupA = _addGroupAndContainer(400,400),
            groupB = _addGroupAndContainer(100,100),
            n2_1 = _addNodeToGroup(groupB);

        groupA.orphan = true;

        support.dragToGroup( groupB.el, groupA);

        equal(_jsPlumb.getGroupContentArea(groupA), groupB.el.parentNode, "groupB is child of groupA in the DOM");
        equal(groupA.getGroups().length, 1, "groupA has one child group");

        equal(parseInt(groupB.el.style.left, 10), 200, "group b at left 200")
        equal(parseInt(groupB.el.style.top, 10), 200, "group b at top 200")

        equal(parseInt(n2_1.style.left, 10), 30, "n2_1 at left 30")
        equal(parseInt(n2_1.style.top, 10), 30, "n2_1 at top 30")

        const gaLeft = parseInt(groupA.el.style.left, 10)
        const gaTop = parseInt(groupA.el.style.top, 10)

        _jsPlumb.addToDragSelection(groupB.el)
        _jsPlumb.addToDragSelection(groupA.el)

        support.dragNodeBy(n2_1, -20, -20)

        equal(parseInt(groupB.el.style.left, 10), 200, "group b still at left 200")
        equal(parseInt(groupB.el.style.top, 10), 200, "group b still at top 200")
        equal(parseInt(groupA.el.style.left, 10), gaLeft, "group a still at left " + gaLeft)
        equal(parseInt(groupA.el.style.top, 10), gaTop, "group a still at top " + gaTop)
    });

    test("nested groups, support allowNestedGroups flag on jsplumb constructor (defaults to true)", function() {
        var j = jsPlumb.newInstance({
            container:container,
            allowNestedGroups:false
        });

        var g1 = _addGroupAndContainer(100,100, null, null, j),
            g2 = _addGroupAndContainer(400,400, null, null, j);

        g2.addGroup(g1);

        equal(g2.getGroups().length, 0, "g2 has no child groups as nested groups are not allowed");

        j.destroy();
    });

    test("nested groups, one group can't be dropped on another if allowNestedGroups is false", function() {
        support.cleanup()
        var j = jsPlumb.newInstance({
            container:container,
            allowNestedGroups:false
        }),
            support2 = jsPlumb.createTestSupportInstanceQUnit(j)

        var groupA = _addGroupAndContainer(400,400, null, null, j),
            groupB = _addGroupAndContainer(100,100, null, null, j);

        support2.dragToGroup(groupB.el, groupA);

        equal(j.getContainer(), groupB.el.parentNode, "groupB is child of jsplumb container in the DOM (it wasnt dropped because allowNestedGroups is false)");
        equal(groupA.getGroups().length, 0, "groupA has no child groups");

        support2.cleanup()
    });

    test("nested groups, remove a group that has child groups, with deleteMembers true - should remove child groups too", function() {

        var groupA = _addGroupAndContainer(100,100),
            groupB = _addGroupAndContainer(400,400),
            groupC = _addGroupAndContainer(400,400),
            n1_1 = _addNodeToGroup(groupA),
            n2_1 = _addNodeToGroup(groupB);

        groupB.addGroup(groupA);
        groupA.addGroup(groupC);

        equal(_jsPlumb.groupManager.getGroups().length, 3, "there are 3 groups in the instance");

        _jsPlumb.removeGroup(groupA, true);
        equal(_jsPlumb.groupManager.getGroups().length, 1, "there is 1 group in the instance after groupA was removed");

        equal(groupC.el.parentNode, null, "groupC is not in the DOM");
        equal(groupA.el.parentNode, null, "groupA is not in the DOM");

    });

    test("nested groups, remove a group that has child groups and nodes, with deleteMembers false - should not remove child groups from the instance. The group children should become children of the parent of the deleted group", function() {
        // also check that the 'parent group' flag has been removed.
        var groupA = _addGroupAndContainer(100,100),
            groupB = _addGroupAndContainer(400,400),
            groupC = _addGroupAndContainer(400,400),
            n1_1 = _addNodeToGroup(groupA),
            n2_1 = _addNodeToGroup(groupB),
            n3_1 = _addNodeToGroup(groupC);

        groupB.addGroup(groupA);
        groupA.addGroup(groupC);

        equal(groupB.getNodes().length, 1, "groupB reports one child node  ");
        equal(_jsPlumb.groupManager.getGroups().length, 3, "there are 3 groups in the instance");

        _jsPlumb.removeGroup(groupA, false);
        equal(_jsPlumb.groupManager.getGroups().length, 2, "there are 2 groups in the instance after groupA was removed.");

        // n1_1, which was a child of groupA, should now be a child of groupB
        equal(groupB.children.length, 2, "groupB reports two child nodes");
        equal(n1_1.parentNode, _jsPlumb.getGroupContentArea(groupB), "n1_1 is a child of groupB in the DOM");
        // it should be positioned at exactly the same place it was before wrt the origin of the group it is now a child of.
        // so we need the offset groupA and also n1_1

        // groupC should be a child of groupB
        equal(groupC.el.parentNode, _jsPlumb.getGroupContentArea(groupB), "groupC is a child of groupB in the DOM");
    });


    test("nested groups, prune nested group", function() {
        var groupA = _addGroupAndContainer(100,100),
            groupB = _addGroupAndContainer(400,400);

        groupB.addGroup(groupA);

        groupB.prune = true;

        equal(_jsPlumb.groupManager.getGroups().length, 2, "2 groups in the instance");
        equal(groupB.getGroups().length, 1, "groupB reports one child group");

        support.dragAndAbortConnection(groupA.el);

        equal(_jsPlumb.groupManager.getGroups().length, 1, "1 group in the instance after nested group dragged out of parent that has prune:true set on it");
        equal(groupB.getGroups().length, 0, "groupB reports zero child groups");

    });

    test("nested groups, nestedGroupAdded and nestedGroupRemoved events fired, group added/removed programmatically", function() {

        var nestedRemoved, nestedAdded;

        _jsPlumb.bind("group:nested:added", function() {
            nestedAdded = true;
        });

        _jsPlumb.bind("group:nested:removed", function() {
            nestedRemoved = true;
        });

        var g1 = _addGroupAndContainer(100,100),
            g2 = _addGroupAndContainer(400,400);

        g2.addGroup(g1);

        equal(true, nestedAdded, "nested group added event");

        g2.removeGroup(g1);
        equal(true, nestedRemoved, "nested group removed event");
    });

    test("nested groups, nestedGroupAdded and nestedGroupRemoved events fired, group added/removed via mouse", function() {
        var nestedRemoved, nestedAdded;

        _jsPlumb.bind("group:nested:added", function() {
            nestedAdded = true;
        });

        _jsPlumb.bind("group:nested:removed", function() {
            nestedRemoved = true;
        });

        var g1 = _addGroupAndContainer(100,100),
            g2 = _addGroupAndContainer(400,400);

        support.dragToGroup( g1.el, g2);

        g2.orphan = true;

        equal(true, nestedAdded, "nested group added event");

        // drag a node onto the nested group
        var d1 = _addNode(50, 50, 50, 50)
        support.dragToGroup( d1, g1)
        equal(g1.children.length, 1, "1 member in the nested group")

        support.dragAndAbortConnection(g1.el);
        equal(true, nestedRemoved, "nested group removed event");
    });

    test("nested groups, removeGroup on instance updates groups correctly", function() {
        var groupA = _addGroupAndContainer(100,100),
            groupB = _addGroupAndContainer(400,400);

        groupB.addGroup(groupA);

        equal(_jsPlumb.groupManager.getGroups().length, 2, "2 groups in the instance");
        equal(groupB.getGroups().length, 1, "groupB reports one child group");

        _jsPlumb.removeGroup(groupA);

        equal(_jsPlumb.groupManager.getGroups().length, 1, "1 group in the instance after group removed via jsPlumb.removeGroup");
        equal(groupB.getGroups().length, 0, "groupB reports zero child groups after");

    });

    //
    // this tests that when you expand a root group that has nested groups which are collapsed, the expansion results in the
    // appropriate proxying of the connections in all nested groups.
    //
    test("nested groups, nested to 2 levels, collapse 2nd level nested, then collapse 1st nested, then collapse and expand root", function() {
        var groupA = _addGroupAndContainer(600,400),
            groupB = _addGroupAndContainer(300,350),
            groupC = _addGroupAndContainer(150,150),
            a1_1 = _addNodeToGroup(groupA, 10, 10, 50, 50),
            a1_2 = _addNodeToGroup(groupA, 100, 100, 50, 50),
            b1_1 = _addNodeToGroup(groupB, 10, 10, 50, 50),
            b1_2 = _addNodeToGroup(groupB, 100, 10, 50, 50),
            c1_1 = _addNodeToGroup(groupC, 10, 10, 50, 50),
            c1_2 = _addNodeToGroup(groupC, 100, 100, 50, 50),
            node = _addNode(50, 700, 100, 100);

        _jsPlumb.importDefaults({
            connector:"Straight",
            anchor:"Continuous"
        });

        groupB.el.style.left = "200px";
        groupB.el.style.top = "10px";

        groupC.el.style.left = "330px";
        groupC.el.style.top = "150px";

        _jsPlumb.revalidate(groupA.el);
        _jsPlumb.revalidate(groupB.el);

        _jsPlumb.revalidate(groupC.el);

        var a1_group = _jsPlumb.connect({source:a1_1, target:groupA.el});
        var b1_group = _jsPlumb.connect({source:b1_1, target:groupB.el});
        var c1_group = _jsPlumb.connect({source:c1_1, target:groupC.el});

        var a1_a2 = _jsPlumb.connect({source:a1_1, target:a1_2});
        var b1_b2 = _jsPlumb.connect({source:b1_1, target:b1_2});
        var c1_c2 = _jsPlumb.connect({source:c1_1, target:c1_2});

        var a1_node = _jsPlumb.connect({source:a1_1, target:node});
        var b1_node = _jsPlumb.connect({source:b1_1, target:node});
        var c1_node = _jsPlumb.connect({source:c1_1, target:node});

        groupA.addGroup(groupB);
        groupB.addGroup(groupC);

        // STATE 0
        // sanity check to start.
        function state0(msg) {
            ok(c1_c2.isVisible(), msg + " : internal connection in groupC is visible");
            ok(b1_b2.isVisible(), msg + " : internal connection in groupB is visible");
            ok(a1_a2.isVisible(), msg + " : internal connection in groupA is visible");

            ok(a1_group.isVisible(), msg + " : internal connection to group in groupA is visible");
            ok(b1_group.isVisible(), msg + " : internal connection to group in groupB is visible");
            ok(c1_group.isVisible(), msg + " : internal connection to group in groupC is visible");

            equal(a1_1, a1_a2.endpoints[0].element, msg + " : a1_1 is source element for a1_1-a1_2");
            equal(a1_2, a1_a2.endpoints[1].element, msg + " : a1_2 is target element for a1_1-a1_2");
            equal(b1_1, b1_b2.endpoints[0].element, msg + " : b1_1 is source element for b1_1-b1_2");
            equal(b1_2, b1_b2.endpoints[1].element, msg + " : b1_2 is target element for b1_1-b1_2");
            equal(c1_1, c1_c2.endpoints[0].element, msg + " : c1_1 is source element for c1_1-c1_2");
            equal(c1_2, c1_c2.endpoints[1].element, msg + " : c1_2 is target element for c1_1-c1_2");

            equal(a1_1, a1_node.endpoints[0].element, msg + " : a1_1 is source element for a1_1-node");
            equal(node, a1_node.endpoints[1].element, msg + " : node is target element for a1_1-node");
            equal(b1_1, b1_node.endpoints[0].element, msg + " : b1_1 is source element for b1_1-node");
            equal(node, b1_node.endpoints[1].element, msg + " : node is target element for b1_1-node");
            equal(c1_1, c1_node.endpoints[0].element, msg + " : c1_1 is source element for c1_1-node");
            equal(node, c1_node.endpoints[1].element, msg + " : node is target element for c1_1-node");

            equal(_jsPlumb.groupManager.getGroups().length, 3, msg + " : 3 groups in the instance");
            equal(groupA.getGroups().length, 1, msg + " : groupA reports one child group");
            equal(groupB.getGroups().length, 1, msg + " : groupB reports one child group");
        }

        state0("initial setup");

        function state1(msg) {
            ok(!c1_c2.isVisible(), msg + " : internal connection in groupC is not visible");
            ok(b1_b2.isVisible(), msg + " : internal connection in groupB is visible");
            ok(a1_a2.isVisible(), msg + " : internal connection in groupA is visible");
            ok(a1_group.isVisible(), msg + " : internal connection to group in groupA is visible");
            ok(b1_group.isVisible(), msg + " : internal connection to group in groupB is visible");
            ok(!c1_group.isVisible(), msg + " : internal connection to group in groupC is not visible");

            equal(a1_1, a1_a2.endpoints[0].element, msg + " : a1_1 is source element for a1_1-a1_2");
            equal(a1_2, a1_a2.endpoints[1].element, msg + " : a1_2 is target element for a1_1-a1_2");
            equal(b1_1, b1_b2.endpoints[0].element, msg + " : b1_1 is source element for b1_1-b1_2");
            equal(b1_2, b1_b2.endpoints[1].element, msg + " : b1_2 is target element for b1_1-b1_2");
            equal(c1_1, c1_c2.endpoints[0].element, msg + " : c1_1 is source element for c1_1-c1_2");
            equal(c1_2, c1_c2.endpoints[1].element, msg + " : c1_2 is target element for c1_1-c1_2");

            equal(a1_1, a1_node.endpoints[0].element, msg + " : a1_1 is source element for a1_1-node");
            equal(node, a1_node.endpoints[1].element, msg + " : node is target element for a1_1-node");
            equal(b1_1, b1_node.endpoints[0].element, msg + " : b1_1 is source element for b1_1-node");
            equal(node, b1_node.endpoints[1].element, msg + " : node is target element for b1_1-node");
            //equal(c1_1, c1_node.endpoints[0].element, "c1_1 is source element for c1_1-node");
            equal(groupC.el, c1_node.endpoints[0].element, msg + " : groupC is the source of group C's external connection (the proxy)");
            equal(node, c1_node.endpoints[1].element, msg + " : node is target element for c1_1-node");
        }

        // STATE 1
        // collapse group C, the innermost group. we expect c1_c2 to be invisible, and c1_node to be proxied with its source on groupC's element
        _jsPlumb.collapseGroup(groupC);
        state1("after collapse C");

        // STATE 2
        // collapse group B, the middle group. we expect c1_c2 and b1_b2 to be invisible, c1_node and b1_node to be proxied with its source on groupB's element
        _jsPlumb.collapseGroup(groupB);

        function state2(msg) {
            equal(a1_1, a1_a2.endpoints[0].element, msg + " : a1_1 is source element for a1_1-a1_2");
            equal(a1_2, a1_a2.endpoints[1].element, msg + " : a1_2 is target element for a1_1-a1_2");
            equal(b1_1, b1_b2.endpoints[0].element, msg + " : b1_1 is source element for b1_1-b1_2");
            equal(b1_2, b1_b2.endpoints[1].element, msg + " : b1_2 is target element for b1_1-b1_2");
            equal(c1_1, c1_c2.endpoints[0].element, msg + " : c1_1 is source element for c1_1-c1_2");
            equal(c1_2, c1_c2.endpoints[1].element, msg + " : c1_2 is target element for c1_1-c1_2");

            equal(a1_1, a1_node.endpoints[0].element, msg + " : a1_1 is source element for a1_1-node");
            equal(node, a1_node.endpoints[1].element, msg + " : node is target element for a1_1-node");
            //equal(b1_1, b1_node.endpoints[0].element, "b1_1 is source element for b1_1-node");
            equal(groupB.el, b1_node.endpoints[0].element, msg + " : groupB is the source of group B's external connection (the proxy)");
            equal(node, b1_node.endpoints[1].element, msg + " : node is target element for b1_1-node");
            //equal(c1_1, c1_node.endpoints[0].element, "c1_1 is source element for c1_1-node");
            equal(groupB.el, c1_node.endpoints[0].element, msg + " : groupB is the source of group C's external connection (the proxy)");
            equal(node, c1_node.endpoints[1].element, msg + " : node is target element for c1_1-node");

            ok(!c1_c2.isVisible(), msg + " : internal connection in groupC is not visible");
            ok(!b1_b2.isVisible(), msg + " : internal connection in groupB is not visible");
            ok(a1_a2.isVisible(), msg + " : internal connection in groupA is visible");

            ok(a1_group.isVisible(), msg + " : internal connection to group in groupA is visible");
            ok(!b1_group.isVisible(), msg + " : internal connection to group in groupB is not visible");
            ok(!c1_group.isVisible(), msg + " : internal connection to group in groupC is not visible");
        }

        state2("after collapse B");

        // collapse group A, the top group. we expect a1_a2, c1_c2 and b1_b2 to be invisible, a1_node, c1_node and b1_node to be proxied with its source on groupA's element
        _jsPlumb.collapseGroup(groupA);

        function state3(msg) {
            ok(!c1_c2.isVisible(), " : internal connection in groupC is not visible");
            ok(!b1_b2.isVisible(), " : internal connection in groupB is not visible");
            ok(!a1_a2.isVisible(), " : internal connection in groupA is not visible");

            ok(!a1_group.isVisible(), msg + " : internal connection to group in groupA is not visible");
            ok(!b1_group.isVisible(), msg + " : internal connection to group in groupB is not visible");
            ok(!c1_group.isVisible(), msg + " : internal connection to group in groupC is not visible");

            equal(a1_1, a1_a2.endpoints[0].element, msg + " : a1_1 is source element for a1_1-a1_2");
            equal(a1_2, a1_a2.endpoints[1].element, msg + " : a1_2 is target element for a1_1-a1_2");
            equal(b1_1, b1_b2.endpoints[0].element, msg + " : b1_1 is source element for b1_1-b1_2");
            equal(b1_2, b1_b2.endpoints[1].element, msg + " : b1_2 is target element for b1_1-b1_2");
            equal(c1_1, c1_c2.endpoints[0].element, msg + " : c1_1 is source element for c1_1-c1_2");
            equal(c1_2, c1_c2.endpoints[1].element, msg + " : c1_2 is target element for c1_1-c1_2");

            //equal(a1_1, a1_node.endpoints[0].element, "a1_1 is source element for a1_1-node");
            equal(groupA.el, a1_node.endpoints[0].element, msg + " : groupA is the source of group A's external connection (the proxy)");
            equal(node, a1_node.endpoints[1].element, msg + " : node is target element for a1_1-node");
            //equal(b1_1, b1_node.endpoints[0].element, "b1_1 is source element for b1_1-node");
            equal(groupA.el, b1_node.endpoints[0].element, msg + " : groupA is the source of group B's external connection (the proxy)");
            equal(node, b1_node.endpoints[1].element, msg + " : node is target element for b1_1-node");
            //equal(c1_1, c1_node.endpoints[0].element, "c1_1 is source element for c1_1-node");
            equal(groupA.el, c1_node.endpoints[0].element, msg + " : groupA is the source of group C's external connection (the proxy)");
            equal(node, c1_node.endpoints[1].element, msg + " : node is target element for c1_1-node");
        }

        state3("after collapse A");


        // expand group A
        _jsPlumb.expandGroup(groupA);
        state2("after expand A");

        // expand group B
        _jsPlumb.expandGroup(groupB);
        state1("after expand B");

        // expand groupC
        _jsPlumb.expandGroup(groupC);
        state0("after expand C");



    });

    test("nested groups, nested to 5 levels, collapse 2nd level nested, then collapse and expand root. check proxies are on the right elements.", function() {
        var group1 = _addGroupAndContainer(600,400),
            group2 = _addGroupAndContainer(300,350),
            group3 = _addGroupAndContainer(150,150),
            group4 = _addGroupAndContainer(150,150),
            group5 = _addGroupAndContainer(150,150)

        group1.addGroup(group2)
        group2.addGroup(group3)
        group3.addGroup(group4)
        group4.addGroup(group5)

        var group0 = _addGroupAndContainer(200,200)

        var e1 = _jsPlumb.connect({source:group1.el, target:group0.el})
        var e2 = _jsPlumb.connect({source:group2.el, target:group0.el})
        var e3 = _jsPlumb.connect({source:group3.el, target:group0.el})
        var e4 = _jsPlumb.connect({source:group4.el, target:group0.el})
        var e5 = _jsPlumb.connect({source:group5.el, target:group0.el})

        // collapse the first nested group. it should have four proxied edges on it now, for its own edge and those of its children
        _jsPlumb.collapseGroup(group2)

        equal(e2.proxies.length, 0, "edge 2 is not proxied")
        equal(e3.proxies[0].ep.element._jsPlumbGroup.id, group2.id, "edge 3 is proxied to group2")
        equal(e4.proxies[0].ep.element._jsPlumbGroup.id, group2.id, "edge 4 is proxied to group2")
        equal(e5.proxies[0].ep.element._jsPlumbGroup.id, group2.id, "edge 5 is proxied to group2")

        // now collapse the top group - all edges should now be proxied
        _jsPlumb.collapseGroup(group1)

        equal(e2.proxies[0].ep.element._jsPlumbGroup.id, group1.id, "edge 2 is proxied to group1")
        equal(e3.proxies[0].ep.element._jsPlumbGroup.id, group1.id, "edge 3 is proxied to group1")
        equal(e4.proxies[0].ep.element._jsPlumbGroup.id, group1.id, "edge 4 is proxied to group1")
        equal(e5.proxies[0].ep.element._jsPlumbGroup.id, group1.id, "edge 5 is proxied to group1")

        // expand the top
        _jsPlumb.expandGroup(group1)

        equal(e2.proxies.length, 0, "edge 2 is not proxied")
        equal(e3.proxies[0].ep.element._jsPlumbGroup.id, group2.id, "edge 3 is proxied to group2")
        equal(e4.proxies[0].ep.element._jsPlumbGroup.id, group2.id, "edge 4 is proxied to group2")
        equal(e5.proxies[0].ep.element._jsPlumbGroup.id, group2.id, "edge 5 is proxied to group2")

    })

    test("nested groups, removed nested group and its edges should be removed", function() {
        var group1 = _addGroupAndContainer(600,400),
            group2 = _addGroupAndContainer(300,350)

        group1.addGroup(group2)

        var group0 = _addGroupAndContainer(200,200)

        var e2 = _jsPlumb.connect({source:group2.el, target:group0.el})

        equal(_jsPlumb.select().length, 1, "1 edge in instance")
        _jsPlumb.removeGroup(group2)
        equal(_jsPlumb.select().length, 0, "0 edges in instance")

    })

    test("nested groups, removed nested group and its edges and those of its children should be removed when delete members flag set", function() {
        var group1 = _addGroupAndContainer(600,400),
            group2 = _addGroupAndContainer(300,350),
            group3 = _addGroupAndContainer(150,150)

        group1.addGroup(group2)
        group2.addGroup(group3)

        var group0 = _addGroupAndContainer(200,200)

        var e2 = _jsPlumb.connect({source:group2.el, target:group0.el})
        var e3 = _jsPlumb.connect({source:group3.el, target:group0.el})

        equal(_jsPlumb.select().length, 2, "2 edges in instance")
        _jsPlumb.removeGroup(group2, true)
        equal(_jsPlumb.select().length, 0, "0 edges in instance")

    })

    test("events, including check that nested group expand/collapse do not fire their own events", function() {
        var groupA = _addGroupAndContainer(600, 400),
            groupB = _addGroupAndContainer(300, 350),
            groupC = _addGroupAndContainer(150, 150)

        groupA.addGroup(groupB)
        groupB.addGroup(groupC)

        var collapseCount = 0, expandCount = 0

        _jsPlumb.bind("group:collapse", function(p) {
            collapseCount++
            ok(p.group != null, "group provided in collapse callback")
        })

        _jsPlumb.bind("group:expand", function(p) {
            expandCount++
            ok(p.group != null, "group provided in expand callback")
        })

        _jsPlumb.collapseGroup(groupA)
        equal(collapseCount, 1, "one collapse events when the parent group was collapsed")

        _jsPlumb.expandGroup(groupA)
        equal(expandCount, 1, "one expand events when the parent group was expanded (nested groups should not have expand events fired unless they are explicitly expanded)")

        _jsPlumb.collapseGroup(groupB)
        equal(collapseCount, 2, "two collapse events in total after group B was collapsed")

        _jsPlumb.collapseGroup(groupA)
        equal(collapseCount, 3, "3 collapse events in total after group A was collapsed")
    })

    //
    test("nested groups, drag/drop positioning takes nested groups into account", function() {
        var groupA = _addGroupAndContainer(600, 400, 400, 0),
            groupB = _addGroupAndContainer(300, 350, 450, 50),
            node = _addNode(100, 100, 50, 50);

        groupA.addGroup(groupB)

        // groupB is nested, at [50,50] to [350, 400]
        // node is located at [100,100].
        // if we move node by 10px it should NOT end up as a child of groupB. but if the positioning fails to take groupB's nested parent
        // into account, that is what will happen. in 5.10.4 this test should fail.

        equal(groupB.children.length, 0, "group B has no children")
        support.dragNodeBy(node, 20, 20)
        equal(groupB.children.length, 0, "group B still has no children")
    });
};

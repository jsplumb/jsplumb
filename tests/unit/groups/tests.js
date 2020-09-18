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

    support = jsPlumbTestSupport.getInstance(_jsPlumb);

    var _detachThisConnection = function(c) {
        var idx = c.endpoints[1].connections.indexOf(c);
        support.detachConnection(c.endpoints[1], idx);
    };

    module("Drag", {
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


    var _addGroupAndDomElement = function(j, name, params) {
        var c = support.addDiv(name, null, "container");
        return _addGroup(j, name, c, []);
    };

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

    var _dragToGroup = function(_jsPlumb, el, targetGroup) {
        targetGroup = _jsPlumb.getGroup(targetGroup);
        var tgo = jsPlumb.getOffset(targetGroup.getEl()),
            tgs = jsPlumb.getSize(targetGroup.getEl()),
            tx = tgo.left + (tgs[0] / 2),
            ty = tgo.top + (tgs[1] / 2);

        support.dragNodeTo(el, tx, ty);
    };
    var c1,c2,c3,c4,c5,c6,c1_1,c1_2,c2_1,c2_2,c3_1,c3_2,c4_1,c4_2,c5_1,c5_2, c6_1, c6_2, c_noparent;
    var g1, g2, g3, g4, g5, g6;

    var _setupGroups = function(doNotMakeConnections) {
        c1 = support.addDiv("container1", null, "container", 0, 50);
        c2 = support.addDiv("container2", null, "container", 300, 50);
        c3 = support.addDiv("container3", null, "container", 600, 50);
        c4 = support.addDiv("container4", null, "container", 1000, 400);
        c5 = support.addDiv("container5", null, "container", 300, 400);
        c6 = support.addDiv("container6", null, "container", 800, 1000);

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

        _jsPlumb.draggable([c1_1,c1_2,c2_1,c2_2,c3_1,c3_2,c4_1,c4_2,c5_1,c5_2, c6_1, c6_2]);

        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1,c1_2], { constrain:true, droppable:false});
        g2 = _addGroup(_jsPlumb, "two", c2, [c2_1,c2_2], {dropOverride:true});
        g3 = _addGroup(_jsPlumb, "three", c3, [c3_1,c3_2],{ revert:false });
        g4 = _addGroup(_jsPlumb, "four", c4, [c4_1,c4_2], { prune: true });
        g5 = _addGroup(_jsPlumb, "five", c5, [c5_1,c5_2], { orphan:true, droppable:false });
        g6 = _addGroup(_jsPlumb, "six", c6, [c6_1,c6_2], { orphan:true, droppable:false, proxied:false });

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

    test("groups, simple access", function() {

        _setupGroups();

        // check a group has members
        equal(_jsPlumb.getGroup("four").getMembers().length, 2, "2 members in group four");
        equal(_jsPlumb.getGroup("three").getMembers().length, 2, "2 members in group three");
        // check an unknown group throws an error
        try {
            _jsPlumb.getGroup("unknown");
            ok(false, "should not have been able to retrieve unknown group");
        }
        catch (e) {
            ok(true, "unknown group retrieve threw exception");
        }

        equal(2, g1.connections.source.length, "2 source connections for group 1");
        equal(1, g1.connections.target.length, "1 target connection for group 1");

        // group4 is at [1000, 400]
        // its children are

        equal(parseInt(c4.style.left), 1000, "c4 at 1000 left");
        equal(parseInt(c4.style.top), 400, "c4 at 400 top");
        equal(parseInt(c4_1.style.left), 30, "c4_1 at 30 left");
        equal(parseInt(c4_1.style.top), 30, "c4_1 at 30 top");
        equal(parseInt(c4_2.style.left), 180, "c4_2 at 180 left");
        equal(parseInt(c4_2.style.top), 130, "c4_2 at 130 top");


        _jsPlumb.removeGroup("four", false);
        try {
            _jsPlumb.getGroup("four");
            ok(false, "should not have been able to retrieve removed group");
        }
        catch (e) {
            ok(true, "removed group subsequent retrieve threw exception");
        }
        ok(c4_1.parentNode != null, "c4_1 not removed from DOM even though group was removed");
        // check positions of child nodes; they should have been adjusted.
        equal(parseInt(c4_1.style.left), 1030, "c4_1 at 1030 left");
        equal(parseInt(c4_1.style.top), 430, "c4_1 at 430 top");
        equal(parseInt(c4_2.style.left), 1180, "c4_2 at 1180 left");
        equal(parseInt(c4_2.style.top), 530, "c4_2 at 530 top");


        _jsPlumb.removeGroup("five", true);
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

    test("simple adding to group", function() {
        var g = _addGroupAndDomElement(_jsPlumb, "g1");
        var d1 = support.addDiv("d1");

        equal(g.getMembers().length, 0, "0 members in group");

        _jsPlumb.addToGroup(g, d1);
        equal(g.getMembers().length, 1, "1 member in group");

        var els = _jsPlumb.getDragManager().getElementsForDraggable("g1");
        equal(support.countKeys(els), 1, "1 element for group g1 to repaint");

        // add again; should ignore.
        _jsPlumb.addToGroup(g, d1);
        equal(g.getMembers().length, 1, "1 member in group");

        var g2 = _addGroupAndDomElement(_jsPlumb, "g2");
        _jsPlumb.addToGroup(g2, d1);
        equal(g.getMembers().length, 0, "0 members in group g1 after node removal");
        equal(g2.getMembers().length, 1, "1 member in group g2 after node addition");

        els = _jsPlumb.getDragManager().getElementsForDraggable("g1");
        equal(support.countKeys(els), 0, "0 elements for group g1 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("g2");
        equal(support.countKeys(els), 1, "1 element for group g2 to repaint");

        var d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.addToGroup(g2, [ d2, d3 ]);
        equal(g2.getMembers().length, 3, "3 members in group g2 after node additions");
        els = _jsPlumb.getDragManager().getElementsForDraggable("g2");
        equal(support.countKeys(els), 3, "3 elements for group g2 to repaint");

    });

    test("groups, dragging between groups, take one", function() {
        _setupGroups();
        var els;

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(support.countKeys(els), 2, "2 elements for group 3 to repaint");
        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(support.countKeys(els), 2, "2 elements for group 4 to repaint");

        // drag 4_1 to group 3
        _dragToGroup(_jsPlumb, c4_1, "three");
        equal(_jsPlumb.getGroup("four").getMembers().length, 1, "1 member in group four after moving a node out");
        equal(_jsPlumb.getGroup("three").getMembers().length, 3, "3 members in group three");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(support.countKeys(els), 3, "3 elements for group 3 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(support.countKeys(els), 1, "1 element for group 4 to repaint");

        // drag 4_2 to group 5 (which is not droppable)
        equal(_jsPlumb.getGroup("five").getMembers().length, 2, "2 members in group five before drop attempt");
        _dragToGroup(_jsPlumb, c4_2, "five");
        equal(_jsPlumb.getGroup("four").getMembers().length, 0, "move to group 5 fails, not droppable: 0 members in group four because it prunes");
        equal(_jsPlumb.getGroup("five").getMembers().length, 2, "but still only 2 members in group five");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(support.countKeys(els), 0, "0 elements for group 4 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(support.countKeys(els), 3, "3 elements for group 3 to repaint");

    });

    test("groups, moving between groups, take one", function() {
        _setupGroups();
        var els;

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(support.countKeys(els), 2, "2 elements for group 3 to repaint");
        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(support.countKeys(els), 2, "2 elements for group 4 to repaint");

        var addEvt = false, removeEvt = false;
        _jsPlumb.bind("group:addMember", function() {
            addEvt = true;
        });
        _jsPlumb.bind("group:removeMember", function() {
            removeEvt = true;
        });
        // move 4_1 to group 3
        _jsPlumb.addToGroup(_jsPlumb.getGroup("three"), c4_1);
        equal(_jsPlumb.getGroup("four").getMembers().length, 1, "1 member in group four");
        equal(_jsPlumb.getGroup("three").getMembers().length, 3, "3 members in group three");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(support.countKeys(els), 3, "3 elements for group 3 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(support.countKeys(els), 1, "1 element for group 4 to repaint");


        ok(addEvt, "add event was fired");
        ok(removeEvt, "remove event was fired");

        // add again: it is already a member and should not be re-added
        addEvt = false;
        removeEvt = false;
        _jsPlumb.addToGroup(_jsPlumb.getGroup("three"), c4_1);
        equal(_jsPlumb.getGroup("three").getMembers().length, 3, "3 members in group three");
        ok(!addEvt, "add event was NOT fired");
        ok(!removeEvt, "remove event was NOT fired");

        // momve 4_2 to group 5 (which is not droppable)
//        equal(_jsPlumb.getGroup("five").getMembers().length, 2, "2 members in group five before drop attempt");
//        _jsPlumb.addToGroup(_jsPlumb.getGroup("five"), c4_2);
//        equal(_jsPlumb.getGroup("four").getMembers().length, 0, "move to group 5 fails, not droppable: 0 members in group four because it prunes");
//        equal(_jsPlumb.getGroup("five").getMembers().length, 2, "but still only 2 members in group five");

    });

    test("groups, dragging between groups, take 2", function() {
        _setupGroups();

        // drag 4_2 to group 1 (which is not droppable)
        equal(_jsPlumb.getGroup("one").getMembers().length, 2, "2 members in group one before attempted drop from group 1");
        _dragToGroup(_jsPlumb, c4_2, "one");
        equal(_jsPlumb.getGroup("four").getMembers().length, 1, "1 member in group four (it prunes on drop outside)");
        equal(_jsPlumb.getGroup("one").getMembers().length, 2, "2 members in group one after failed drop: group 1 not droppable");

        // drag 4_1 to group 2 (which is droppable)
        equal(_jsPlumb.getGroup("two").getMembers().length, 2, "2 members in group two before drop from group 4");
        _dragToGroup(_jsPlumb, c4_1, "two");
        equal(_jsPlumb.getGroup("four").getMembers().length, 0, "0 members in group four after dropping el on group 2");
        equal(_jsPlumb.getGroup("two").getMembers().length, 3, "3 members in group two after dropping el from group 4");

        // drag 1_2 to group 2 (group 1 has constrain switched on; should not drop even though 2 is droppable)
        _dragToGroup(_jsPlumb, c1_2, "two");
        equal(_jsPlumb.getGroup("two").getMembers().length, 3, "3 members in group two after attempting drop from group 1");
        equal(_jsPlumb.getGroup("one").getMembers().length, 2, "2 members in group one after drop on group 2 failed due to constraint");

    });

    test("dragging nodes out of groups", function() {
        _setupGroups();
        // try dragging 1_2 right out of the box and dropping it. it should not work: c1 has constrain switched on.
        var c12o = _jsPlumb.getOffset(c1_2);
        support.dragtoDistantLand(c1_2);
        equal(_jsPlumb.getGroup("one").getMembers().length, 2, "2 members in group one");
        // check the node has not actually moved.
        equal(c12o.left, _jsPlumb.getOffset(c1_2).left, "c1_2 left position unchanged");
        equal(c12o.top, _jsPlumb.getOffset(c1_2).top, "c1_2 top position unchanged");

        // try dragging 2_2 right out of the box and dropping it. it should not work: c1 has revert switched on.
        var c22o = _jsPlumb.getOffset(c2_2);
        support.dragtoDistantLand(c2_2);
        equal(_jsPlumb.getGroup("two").getMembers().length, 2, "2 members in group two");
        // check the node has not actually moved.
        equal(c22o.left, _jsPlumb.getOffset(c2_2).left, "c2_2 left position unchanged");
        equal(c22o.top, _jsPlumb.getOffset(c2_2).top, "c2_2 top position unchanged");


        // c3, should also allow nodes to be dropped outside
        var c32o = _jsPlumb.getOffset(c3_2);
        support.dragtoDistantLand(c3_2);
        equal(_jsPlumb.getGroup("three").getMembers().length, 2, "2 members in group three");
        // check the node has moved. but just not removed from the group.
        ok(c32o.left != _jsPlumb.getOffset(c3_2).left, "c3_2 left position changed");
        ok(c32o.top != _jsPlumb.getOffset(c3_2).top, "c3_2 top position changed");

        // c4 prunes nodes on drop outside
        support.dragtoDistantLand(c4_2);
        equal(_jsPlumb.getGroup("four").getMembers().length, 1, "1 member in group four");
        ok(c4_2.parentNode == null, "c4_2 removed from DOM");

        // c5 orphans nodes on drop outside (remove from group but not from DOM)
        support.dragtoDistantLand(c5_2);
        equal(_jsPlumb.getGroup("five").getMembers().length, 1, "1 member in group five");
        ok(c5_2.parentNode != null, "c5_2 still in DOM");
    });

    test("single group collapse and expand", function() {

        _setupGroups();

        equal(_jsPlumb.select({source:"c3_1"}).length, 2, "2 source connections for c3_1");
        equal(_jsPlumb.select({target:"c3_1"}).length, 1, "1 target connection for c3_1");
        _jsPlumb.collapseGroup("three");

        ok(jsPlumb.hasClass(c3, "jtk-group-collapsed"), "group has collapsed class");
        var c3_1conns = _jsPlumb.select({source:"c3_1"});
        equal(c3_1conns.length, 2, "still 2 source connections for c3_1");
        equal(_jsPlumb.select({target:"c3_1"}).length, 1, "still 1 target connection for c3_1");
        equal(_jsPlumb.select({source:"container3"}).length, 0, "no source connections for container3. the connections are proxied.");
        equal(_jsPlumb.select({target:"container3"}).length, 0, "no target connections for container3. the connections are proxied.");

        _jsPlumb.expandGroup("three");
        equal(_jsPlumb.select({source:"container3"}).length, 0, "no connections for container3");
        equal(_jsPlumb.select({target:"container3"}).length, 0, "no connections for container3");
        c3_1conns = _jsPlumb.select({source:"c3_1"});
        equal(c3_1conns.length, 2, "still 2 source connections yet for c3_1");
        ok(c3_1conns.get(0).isVisible(), "first c3_1 connection is visible");
        ok(c3_1conns.get(1).isVisible(), "second c3_1 connection is visible");
        ok(!jsPlumb.hasClass(c3, "jtk-group-collapsed"), "group doesnt have collapsed class");

    });

    test("group in collapsed state to start", function() {

        c1 = support.addDiv("container1", null, "container", 0, 50);
        var g = _addGroup(_jsPlumb, "one", c1, [], { collapsed:true });
        ok(jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group has collapsed class");
        ok(g.collapsed === true, "Group is collapsed");

        _jsPlumb.expandGroup("one");
        ok(!jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group doesnt have collapsed class");
        ok(g.collapsed !== true, "Group is not collapsed");

        _jsPlumb.collapseGroup("one");
        ok(jsPlumb.hasClass(c1, "jtk-group-collapsed"), "group has collapsed class");
        ok(g.collapsed === true, "Group is collapsed");


    });

    test("group collapse that does not wish to be proxied.", function() {

        _setupGroups();

        equal(_jsPlumb.select({source:"c6_1"}).length, 1, "1 source connection for c6_1");
        equal(_jsPlumb.select({target:"c6_2"}).length, 1, "1 target connection for c6_2");
        _jsPlumb.collapseGroup("six");

        var c6_1conns = _jsPlumb.select({source:"c6_1"});
        equal(c6_1conns.length, 1, "still 1 source connection for c6_1");
        equal(_jsPlumb.select({target:"c6_2"}).length, 1, "still 1 target connection for c6_2");
        equal(c6_1conns.get(0).endpoints[0].elementId, "c6_1", "source endpoint unchanged for connection");
        ok(!c6_1conns.get(0).isVisible(), "source connection is not visible.");

        _jsPlumb.expandGroup("six");
        ok(c6_1conns.get(0).isVisible(), "source connection is visible.");

    });

    test("multiple group collapse and expand", function() {
        _setupGroups();

        equal(_jsPlumb.select({source:"c3_1"}).length, 2, "2 source connections for c3_1");
        _jsPlumb.collapseGroup("three");
        var c3_1_source = _jsPlumb.select({source:"c3_1"});
        equal(c3_1_source.length, 2, "still 2 source connections for c3_1");
        equal(c3_1_source.get(0).proxies[0].originalEp.elementId, "c3_1", "proxy configured correctly");
        ok(c3_1_source.get(1).proxies == null, "second source connection from c3_1 not proxied as it goes to c3_2");
        ok(!c3_1_source.get(1).isVisible(), "second source connection from c3_1 not visible as it goes to c3_2");

        _jsPlumb.collapseGroup("five");

        _jsPlumb.expandGroup("five");

        _jsPlumb.expandGroup("three");

        _jsPlumb.collapseGroup("three");
    });

    test("drop element on collapsed group", function()
    {
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

        equal(c.proxies[1].originalEp.elementId, "c3_1", "target connection has been correctly proxied");
        ok(c.proxies[0] == null, "source connection has been correctly proxied");

        equal(c2.proxies[0].originalEp.elementId, "c3_2", "source connection has been correctly proxied");
        ok(c2.proxies[1] == null, "target connection has been correctly proxied");

        _dragToGroup(_jsPlumb, c4_2, "three");
        equal(_jsPlumb.getGroup("three").getMembers().length, 3, "there are 3 members in group 3 after node moved dropped ");
        equal(_jsPlumb.getGroup("four").getMembers().length, 1, "there is 1 member in group 4 after node moved out");

        ok(!c.isVisible(), "original connection now between two members of collapsed group and is invisible.");
        ok(c.proxies[0] == null, "source connection proxy removed now that the connection is internal");
        ok(c.proxies[1] == null, "target connection proxy removed now that the connection is internal");
        equal(c.endpoints[0].elementId, "c4_2", "source endpoint reset to original");
        equal(c.endpoints[1].elementId, "c3_1", "target endpoint reset to original");

        _dragToGroup(_jsPlumb, c5_1, "three");
        equal(_jsPlumb.getGroup("three").getMembers().length, 4, "there are 4 members in group 3 after node moved dropped ");
        equal(_jsPlumb.getGroup("five").getMembers().length, 1, "there is 1 member in group 5 after node moved out");
        ok(c3.proxies[0] == null, "source in connection dropped on collapsed group did not need to be proxied");
        equal(c3.endpoints[0].elementId, "c2_1", "source in connection dropped on collapsed group is unaltered");
        equal(c3.proxies[1].originalEp.elementId, "c5_1", "target in connection dropped on collapsed group has been correctly proxied");

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
        equal(c.endpoints[0].elementId, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.elementId, "c2_1", "source endpoint stashed correctly after collapse");

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
        equal(c.endpoints[0].elementId, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.elementId, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the connection. it should clean up the original one. then when we collapse group three
        // there should be no connections of any sort.
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select().length, 0, "there should be no connections left after detach");
        ok(c.proxies == null, "proxies removed after detach");
    });

    test("indirect deletion of proxIED connections cleans up their proxy connections.", function() {
        _setupGroups(true);

        var c = _jsPlumb.connect({source: c2_1, target: c3_1});

        equal(_jsPlumb.select().length, 1, "one connection to begin");

        _jsPlumb.collapseGroup("two");
        equal(c.endpoints[0].elementId, "container2", "proxy configured for source after collapse");
        equal(c.proxies[0].originalEp.elementId, "c2_1", "source endpoint stashed correctly after collapse");

        // delete the connection's endpoint.
        _jsPlumb.deleteEndpoint(c.endpoints[1]);
        equal(_jsPlumb.select().length, 0, "no connections");

    });

    test("move connections between group children via dragging connections", function() {
        _setupGroups(true);

        equal(_jsPlumb.select().length, 0, "0 connections to start");

        // a connection to the group to be collapsed
        var c = _jsPlumb.connect({source: c4_2, target: c3_1});
        _jsPlumb.makeTarget(c2_1);

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
        equal("four", _jsPlumb.getGroupFor("c4_2").id, "group id is correct, element referenced by ID");
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
        equal("d1", c.proxies[0].originalEp.elementId, "endpoint was proxied after collapse");
        // test for proxied
        equal("d1", c2.endpoints[0].elementId, "endpoint to internal element was not proxied after collapse");
        equal("d3", c2.endpoints[1].elementId, "endpoint to internal element was not proxied after collapse");
        equal(null, c2.proxies, "connection 2 did not get proxies added");

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
        equal("d1", c.proxies[0].originalEp.elementId, "endpoint was proxied after collapse");
        equal(2, group.getMembers().length, "two members in group");

        group.removeAll();
        equal(0, group.getMembers().length, "no members in group");
        _jsPlumb.expandGroup(group);

        c.proxies[0] = "flag";

        _jsPlumb.collapseGroup(group);
        // test proxy was not attached
        ok(c.proxies[0] == "flag", "proxies not setup since all elements were removed");
    });

    test("drag a connection from an element to a group", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            //c = _jsPlumb.connect({source:d1, target:d2}),
            //c2 = _jsPlumb.connect({source:d1, target:d3}),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.makeTarget(g);
        _jsPlumb.makeSource(d1);

        var c = support.dragConnection(d1, g);
        var conns = _jsPlumb.select();

        equal(1, conns.length, "there is one connection");

        equal(conns.get(0).target, g, "target is the group element");
        equal(conns.get(0).source, d1, "source is the node element");
    });

    test("drag a connection from an element to an element inside a group, element added to group before any elements made source/target", function() {
        var d1 = support.addDiv("d1", null, null, 0,0, 40, 40),
            d2 = support.addDiv("d2", null, null, 0,0, 40, 40),
            g = support.addDiv("group", null, null, 600,600, 400, 400);

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.addToGroup(group, d2);
        _jsPlumb.makeTarget(g, {rank:0});
        _jsPlumb.makeSource(d1);
        _jsPlumb.makeTarget(d2, {rank:10});

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

        _jsPlumb.makeSource(d1);

        var group = _jsPlumb.addGroup({ el:g });
        _jsPlumb.makeTarget(g, {rank:0});


        var d2 = support.addDiv("d2", null, null, 0,0, 40, 40);
        _jsPlumb.addToGroup(group, d2);
        _jsPlumb.makeTarget(d2, {rank:10});

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

        _jsPlumb.makeTarget(d1, {rank:0});

        _jsPlumb.makeTarget(d2, {rank:10}/*, {
         dropOptions:{
         rank:10
         }
         }*/);

        _jsPlumb.makeSource(d3);

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

    test("drop precedence, set negative rank on element to downgrade", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d1/*, {
         dropOptions:{
         rank:-10
         }
         }*/);

        _jsPlumb.makeTarget(d2, {rank:-10});

        _jsPlumb.makeSource(d3);

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);


        ok(d1.classList.contains("jtk-drag-hover"), "d1 has hover class");
        ok(!d2.classList.contains("jtk-drag-hover"), "d2 does not have hover class; only d1 has.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d1, _jsPlumb.select().get(0).target, "connection target is d2");

    });

    test("drop precedence, default ranks (order of droppable is ignored), group first", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d1);
        _jsPlumb.makeTarget(d2);

        _jsPlumb.makeSource(d3);

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);


        ok(d1.classList.contains("jtk-drag-hover"), "d1 has hover class");
        ok(!d2.classList.contains("jtk-drag-hover"), "d2 does not have hover class; only d1 has, even though it was second.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d1, _jsPlumb.select().get(0).target, "connection target is d1 (the group)");

    });

    test("drop precedence, default ranks (order of droppable is ignored), group last", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d2);
        _jsPlumb.makeTarget(d1);

        _jsPlumb.makeSource(d3);

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

    test("drop precedence, equal ranks, order of droppable is used, group first", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d1, {
            dropOptions: {
                rank: 5
            }
        });
        _jsPlumb.makeTarget(d2, {
            dropOptions: {
                rank: 5
            }
        });

        _jsPlumb.makeSource(d3);

        var sourceEvent = support.makeEvent(d3);
        var d2TargetEvent = support.makeEvent(d2);

        _jsPlumb.trigger(d3, "mousedown", sourceEvent);
        _jsPlumb.trigger(document, "mousemove", d2TargetEvent);


        ok(d1.classList.contains("jtk-drag-hover"), "d1 has hover class");
        ok(!d2.classList.contains("jtk-drag-hover"), "d2 does not have hover class; only d1 has, and it was first.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d1, _jsPlumb.select().get(0).target, "connection target is d1");

    });

    test("drop precedence, equal ranks, order of droppable is used, group last", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d2, { rank:5 });
        _jsPlumb.makeTarget(d1, { rank:5 });

        _jsPlumb.makeSource(d3);

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
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _jsPlumb.draggable(d2);

        var g1 = _addGroup(_jsPlumb, "g1", d1, [d2], {orphan:true});

        var removeEvt = false, addEvt = false;
        _jsPlumb.bind("group:removeMember", function() {
            removeEvt = true;
        });

        _jsPlumb.bind("group:addMember", function() {
            addEvt = true;
        });

        ok(d2._jsPlumbGroup != null, "d2 is in the group");

        support.dragNodeBy(d2, -300,-300);

        ok(removeEvt, "the remove group member event was fired");

        removeEvt = false;

        support.dragNodeBy(d2, 300,300);

        ok(addEvt, "the add group member event was fired");

    });

    test("drag node out of one group and into another; move flag set in remove and add events", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _jsPlumb.draggable(d2);

        var g1 = _addGroup(_jsPlumb, "g1", d1, [d2], {orphan:true});

        var g3 = _addGroup(_jsPlumb, "g3", d3, [], {orphan:true});

        var removeEvt = false, addEvt = false, targetGroup, sourceGroup;
        _jsPlumb.bind("group:removeMember", function(p) {
            removeEvt = true;
            targetGroup = p.targetGroup;
        });

        _jsPlumb.bind("group:addMember", function(p) {
            addEvt = true;
            sourceGroup = p.sourceGroup;
        });

        support.dragNodeBy(d2, 510,510);

        ok(removeEvt, "the remove group member event was fired");
        ok(addEvt, "the add group member event was fired");

        equal(targetGroup, g3, "g3 reported as target group in remove from group event");
        equal(sourceGroup, g1, "g1 reported as source group in add to group event");

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
        g1 = _addGroup(_jsPlumb, "one", c1, [c1_1, c1_2], { constrain:true, droppable:false});

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

        c1 = support.addDiv("container1", null, "container", 0, 50, 500, 500);
        c2 = support.addDiv("container2", null, "container", 300, 50, 500, 500);
        c1_1 = support.addDiv("c1_1", c1, "w", 30, 30, 150, 150);
        c2_1 = support.addDiv("c2_1", c2, "w", 180, 130, 150, 150);

        // create child elements and connect them
        var c1_1_1 = support.addDiv("c1_1_1", c1_1, "w", 30, 30, 50, 50);
        var c2_1_1 = support.addDiv("c2_1_1", c2_1, "w", 30, 30, 50, 50);
        var conn = _jsPlumb.connect({source:c1_1_1, target:c2_1_1});

        g2 = _addGroup(_jsPlumb, "two", c2, [], { constrain:true, droppable:false});

        // add c2_1 to group 2.  c2_1 is not connected to anything itself, it has a child that is the target of a connection, though.
        _jsPlumb.addToGroup(g2, c2_1);

        equal(c2_1.parentNode, c2, "group 2's element is parent node of c2_1");

        equal(g2.connections.target.length, 1, "1 connection in group target connections");

        equal(true, conn.isVisible(), "connection is visible");

        _jsPlumb.toggleGroup(g2);

        equal(true, conn.isVisible(), "connection is visible after group collapse, because the group shows proxies.");

        // make sure that the child's connection is removed from the group when the element is removed.
        _jsPlumb.removeFromGroup(g2, c2_1);
        equal(g2.connections.target.length, 0, "0 connections in group target connections");
        equal(c2_1.parentNode, _jsPlumb.getContainer(), "container is parent node of c2_1");

        var groupConns = _jsPlumb.getConnections({target:c2, scope:'*'});
        equal(0, groupConns.length, "no connections registered for the group element");

        equal(true, conn.isVisible(), "connection is visible ");

        equal(conn.source, c1_1_1, "c1_1_1 is connection source after removal from group");
        equal(conn.target, c2_1_1, "c2_1_1 is connection target after removal from group");

        var conns = _jsPlumb.getConnections({source:c1_1_1, scope:'*'});
        equal(conns.length, 1, "1 connection registered for c1_1_1");

    });

};

jsPlumb.ready(function () {

    var j = window.j = jsPlumb.getInstance({Container:canvas, Connector:"StateMachine", Endpoint:["Dot", {radius:3}], Anchor:"Center"});

    j.bind("connection", function(p) {
        p.connection.bind("click", function() {
            j.detach(this);
        });
    });

    var evts = document.querySelector("#events");
    var _appendEvent = function(name, detail) {
        evts.innerHTML = "<br/><strong>" + name + "</strong><br/> " + detail + "<br/>" + evts.innerHTML;
    };
    j.bind("group:addMember", function(p) {
        _appendEvent("group:addMember", p.group.id + " - " + p.el.id);
    });
    j.bind("group:removeMember", function(p) {
        _appendEvent("group:removeMember", p.group.id + " - " + p.el.id);
    });
    j.bind("group:expand", function(p) {
        _appendEvent("group:expand", p.group.id);
    });
    j.bind("group:collapse", function(p) {
        _appendEvent("group:collapse", p.group.id);
    });
    j.bind("group:add", function(p) {
        _appendEvent("group:add", p.group.id);
    });
    j.bind("group:remove", function(p) {
        _appendEvent("group:remove", p.group.id);
    });

    // connect some before configuring group
    j.connect({source:c1_1, target:c2_1});
    j.connect({source:c2_1, target:c3_1});
    j.connect({source:c2_2, target:c6_2});
    j.connect({source:c3_1, target:c4_1});
    j.connect({source:c4_1, target:c5_1});
    j.connect({source:c1_1,target:c1_2});
    j.connect({source:c2_1,target:c2_2});

    // NOTE ordering here. we make one draggable before adding it to the group, and we add the other to the group
    //before making it draggable. they should both be constrained to the group extents.
    j.draggable(c1_1);
    j.addGroup({
        el:container1,
        id:"one",
        constrain:true,
        anchor:"Continuous",
        endpoint:"Blank",
        droppable:false
    });
    j.addToGroup("one", c1_1);
    j.addToGroup("one", c1_2);
    j.draggable(c1_2);


    j.draggable(c2_1);
    j.addGroup({
        el:container2,
        id:"two",
        dropOverride:true,
        endpoint:["Dot", { radius:3 }]
    });  //(the default is to revert)
    j.addToGroup("two", c2_1);
    j.addToGroup("two", c2_2);
    j.draggable(c2_2);

    j.draggable(c3_1);
    j.addGroup({
        el:container3,
        id:"three",
        revert:false,
        endpoint:["Dot", { radius:3 }]
    });
    j.addToGroup("three", c3_1);
    j.addToGroup("three", c3_2);
    j.draggable(c3_2);

    j.draggable(c4_1);
    j.addGroup({
        el:container4,
        id:"four",
        prune:true,
        endpoint:["Dot", { radius:3 }]
    });
    j.addToGroup("four", c4_1);
    j.addToGroup("four", c4_2);
    j.draggable(c4_2);

    j.draggable(c5_1);
    j.addGroup({
        el:container5,
        id:"five",
        orphan:true,
        droppable:false,
        endpoint:["Dot", { radius:3 }]
    });
    j.addToGroup("five", [c5_1, c5_2]);
    j.draggable(c5_2);

    j.draggable(c6_1);
    j.addGroup({
        el:container6,
        id:"six",
        proxied:false,
        endpoint:["Dot", { radius:3 }]
    });
    j.addToGroup("six", [c6_1, c6_2]);
    j.draggable(c6_2);

    j.draggable(c7_1);
    j.addGroup({
        el:container7,
        id:"seven",
        ghost:true,
        endpoint:["Dot", { radius:3 }]
    });
    j.addToGroup("seven", [c7_1, c7_2]);
    j.draggable(c7_2);

    // the independent element that demonstrates the fact that it can be dropped onto a group
    j.draggable("standalone");

    //... and connect others afterwards.
    j.connect({source:c3_1,target:c3_2});
    j.connect({source:c4_1,target:c4_2});
    j.connect({source:c5_1,target:c5_2});
    j.connect({source:c5_1,target:c3_2});
    j.connect({source:c5_1,target:container5, anchors:["Center", "Continuous"]});
    j.connect({source:c5_2,target:c6_1});
    j.connect({source:c6_2,target:c7_1});

    // delete group button
    j.on(canvas, "click", ".del", function() {
        var g = this.parentNode.getAttribute("group");
        j.removeGroup(g, this.getAttribute("delete-all") != null);
    });

    // collapse/expand group button
    j.on(canvas, "click", ".node-collapse", function() {
        var g = this.parentNode.getAttribute("group"), collapsed = j.hasClass(this.parentNode, "collapsed");

        j[collapsed ? "removeClass" : "addClass"](this.parentNode, "collapsed");
        j[collapsed ? "expandGroup" : "collapseGroup"](g);
    });

    jsPlumb.fire("jsPlumbDemoLoaded", j);

});
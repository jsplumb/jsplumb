QUnit.config.reorder = false;

var defaults = null, support, _jsPlumb, count = 0;

function makeNode(id, className) {
    var d = support.addDiv("" + ++count)
    d.className = className + " " + "node"
    _jsPlumb.manage(d, id)
    return d
}

function addZone(node, zoneClass) {
    var d = document.createElement("div")
    d.className = "zone " + zoneClass
    d.style.position = "relative"
    node.appendChild(d)
    return d
}

function makeSourceNode(id) {
    var d = makeNode(id, "source-node")
    return d
}

function makeTargetNode(id) {
    var d = makeNode(id, "target-node")
    return d
}

var testSuite = function () {

    module("Source/Target Selectors", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance({container:container});
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });

    test("addSourceSelector", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        var elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, d2, true)

        ok(elDragged === false, "element was not dragged")

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(sourceNode, d2, true)
        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the node itself is not a source")

    })

    test("addSourceSelector, scope, doesnt match", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("data-jtk-scope", "FOO")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")
        d2.setAttribute("data-jtk-scope", "BAR")

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, d2, true)

        equal(0, _jsPlumb.select().length, "zero connections in the instance, scopes did not match")

    })

    test("addSourceSelector, scope, does match", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("data-jtk-scope", "FOO")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")
        d2.setAttribute("data-jtk-scope", "FOO")

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, d2, true)

        equal(1, _jsPlumb.select().length, "one connections in the instance, scopes matched")

    })

    test("addSourceSelector, scope, doesnt match and then it does", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("data-jtk-scope", "FOO")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")
        d2.setAttribute("data-jtk-scope", "BAR")

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, d2, true)

        equal(0, _jsPlumb.select().length, "zero connections in the instance, scopes did not match")

        d2.setAttribute("data-jtk-scope", "FOO")

        support.dragConnection(zone, d2, true)

        equal(1, _jsPlumb.select().length, "one connections in the instance, scopes matched after target updates")

    })

    test("addSourceSelector, maxConnections 1", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        var d3 = support.addDiv("d3")
        d3.className = "node"
        _jsPlumb.manage(d3)
        _jsPlumb.addTargetSelector("#d3")

        var elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            maxConnections:1
        })

        support.dragConnection(zone, d2, true)

        ok(elDragged === false, "element was not dragged")

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(zone, d3, true)
        equal(1, _jsPlumb.select().length, "still only one connection in the instance, as maxConnections was set to 1")

    })

    test("addSourceSelector, maxConnections 2", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        var d3 = support.addDiv("d3")
        d3.className = "node"
        _jsPlumb.manage(d3)
        _jsPlumb.addTargetSelector("#d3")

        var d4 = support.addDiv("d4")
        d4.className = "node"
        _jsPlumb.manage(d4)
        _jsPlumb.addTargetSelector("#d4")

        var elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            maxConnections:2
        })

        support.dragConnection(zone, d2, true)

        ok(elDragged === false, "element was not dragged")

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(zone, d3, true)
        equal(2, _jsPlumb.select().length, "two connections in the instance after drag to d3")

        support.dragConnection(zone, d4, true)
        equal(2, _jsPlumb.select().length, "still two connections in the instance after drag to d4, as maxConnections was set to 2")


    })

    test("addSourceSelector, parameterExtractor returns object with maxConnections set", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        var d3 = support.addDiv("d3")
        d3.className = "node"
        _jsPlumb.manage(d3)
        _jsPlumb.addTargetSelector("#d3")

        var extractorCalled = false

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            parameterExtractor:function(el, eventTarget) {
                extractorCalled = true
                return { maxConnections: 1}
            }
        })

        support.dragConnection(zone, d2, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(extractorCalled, true, "extractor callback was called")

        support.dragConnection(zone, d3, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance, because maxConnections was reported as 1")

    })

    test("addSourceSelector, uniqueEndpoint", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var sourceNode2 = makeSourceNode()
        var zone2 = addZone(sourceNode2, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        var d3 = support.addDiv("d3")
        d3.className = "node"
        _jsPlumb.manage(d3)
        _jsPlumb.addTargetSelector("#d3")

        var d4 = support.addDiv("d4")
        d4.className = "node"
        _jsPlumb.manage(d4)
        _jsPlumb.addTargetSelector("#d4")

        var elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            uniqueEndpoint:true,
            maxConnections:2
        })

        support.dragConnection(zone, d2, true)
        support.dragConnection(zone2, d2, true)

        equal(2, _jsPlumb.select().length, "two connections in the instance")

        // uniqueEndpoint means unique per managed element, not unique across the instance
        equal(4, _jsPlumb.selectEndpoints().length, "four endpoints in the instance - two targets on d2 and one on each of two source elements")

        support.dragConnection(zone, d3, true)
        support.dragConnection(zone2, d3, true)

        equal(4, _jsPlumb.select().length, "4 connections in the instance")
        // now there should be 6 endpoints: 2 source endpoints, because they have unique endpoint set, and then 2 target endpoints on each of 2 elements.
        equal(6, _jsPlumb.selectEndpoints().length, "six endpoints in the instance")

        support.dragConnection(zone, d4, true)
        support.dragConnection(zone2, d4, true)

        // connection and endpoint count should not have changed, because maxConnections is set to 2 for each of these endpoints.
        equal(4, _jsPlumb.select().length, "4 connections in the instance")
        // now there should be 6 endpoints: 2 source endpoints, because they have unique endpoint set, and then 2 target endpoints on each of 2 elements.
        equal(6, _jsPlumb.selectEndpoints().length, "six endpoints in the instance")

    })

    // Setup a source selector, and drag a connection from some element using that selector. Then drag the source of that
    // connection to the appropriate part of some other element (ie. it matches the source selector); the connection should be
    // moved to that new element. This tests the 'redrop policy', which by default mandates that the source of some connection
    // can only be dropped on a part of some other element that matches the source selector.
    //
    // the next test shows how you can setup the source selector so you can drop back anywhere on the element instead.
    //
    test("addSourceSelector, move source of dragged connection, default redrop policy", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        var sourceNode2 = makeSourceNode()
        var zone2 = addZone(sourceNode2, "zone1")
        var sourceNode3 = makeSourceNode()
        var zone3 = addZone(sourceNode3, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        // drag a connection from the drag zone on the first source node to the target node
        var c = support.dragConnection(zone, d2, true)
        // and check it exists
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(sourceNode, c.source, "connection's source is first source node")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is Continuous, per the source selector spec")

        // relocate the dragged connection so that its source is the 3rd source node. note that here we have to drop the
        // connection on the part of the element that is setup as a source selector, which is a departure from v2/v4. the test below
        // shows how you can setup the source selector so you can drop back anywhere on the element instead.
        support.relocateSource(c, zone3)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode3, "source node is now node 3")

        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is still Continuous, per the source selector spec")
    })

    test("addSourceSelector, move source of dragged connection, redrop policy strict", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        var sourceNode2 = makeSourceNode()
        var zone2 = addZone(sourceNode2, "zone1")
        var sourceNode3 = makeSourceNode()
        var zone3 = addZone(sourceNode3, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        var elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:"strict"
        })

        // drag a connection from the drag zone on the first source node to the target node
        var c = support.dragConnection(zone, d2, true)
        // and check it exists
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(sourceNode, c.source, "connection's source is first source node")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is Continuous, per the source selector spec")

        // relocate the dragged connection so that its source is the 3rd source node. note that here we have to drop the
        // connection on the part of the element that is setup as a source selector, which is a departure from v2/v4. the test below
        // shows how you can setup the source selector so you can drop back anywhere on the element instead.
        support.relocateSource(c, zone3)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode3, "source node is now node 3")

        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is still Continuous, per the source selector spec")
    })

    test("addSourceSelector, move source of dragged connection, drop source on managed element instead of target", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        var sourceNode2 = makeSourceNode()
        var zone2 = addZone(sourceNode2, "zone1")
        var sourceNode3 = makeSourceNode()
        var zone3 = addZone(sourceNode3, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:"any"
        })

        // drag a connection from the drag zone on the first source node to the target node
        var c = support.dragConnection(zone, d2, true)
        // and check it exists
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(sourceNode, c.source, "connection's source is first source node")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is Continuous, per the source selector spec")

        // relocate the dragged connection so that its source is the second source node.
        support.relocateSource(c, sourceNode3)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode3, "source node is now node 3")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is still Continuous, per the source selector spec")

    })

    test("addSourceSelector, move source of dragged connection, drop source on original selector but with redrop policy of 'any'", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        var sourceNode2 = makeSourceNode()
        var zone2 = addZone(sourceNode2, "zone1")
        var sourceNode3 = makeSourceNode()
        var zone3 = addZone(sourceNode3, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:"any"
        })

        // drag a connection from the drag zone on the first source node to the target node
        var c = support.dragConnection(zone, d2, true)
        // and check it exists
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(sourceNode, c.source, "connection's source is first source node")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is Continuous, per the source selector spec")

        // relocate the dragged connection so that its source is the second source node.
        support.relocateSource(c, zone3)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode3, "source node is now node 3")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is still Continuous, per the source selector spec")

    })

    test("addSourceSelector, source selector is positioned absolute outside the bounds of parent. Redrop policy 'any'. Drag source to source selector positioned absolute outside the bounds of its parent", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        var sourceNode2 = makeSourceNode()
        var zone2 = addZone(sourceNode2, "zone1")
        zone2.style.position = "absolute"
        zone2.style.left = "-100px"
        zone2.style.top = "50px"
        var sourceNode3 = makeSourceNode()
        var zone3 = addZone(sourceNode3, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:"any"
        })

        // drag a connection from the drag zone on the first source node to the target node
        var c = support.dragConnection(zone, d2, true)
        // and check it exists
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(sourceNode, c.source, "connection's source is first source node")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is Continuous, per the source selector spec")

        // relocate the dragged connection so that its source is the second source node.
        support.relocateSource(c, zone2)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode2, "source node is now node 2")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is still Continuous, per the source selector spec")

    })


    test("addSourceSelector, two source zones in a single selector", function() {
        var sourceNode = makeSourceNode()
        var zone1 = addZone(sourceNode, "zone1")
        var zone2 = addZone(sourceNode, "zone2")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        var selector = _jsPlumb.addSourceSelector(".zone1, .zone2", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone1, d2, true)
        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(sourceNode, d2, true)
        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the node itself is not a source")
        ok(elDragged === true, "element was dragged")

        elDragged = false
        support.dragConnection(zone2, d2, true)
        ok(elDragged === false, "element was not dragged")

        equal(2, _jsPlumb.select().length, "two connections in the instance")

        // remove `.zone1, .zone2` and try to drag from each of the selectors

        _jsPlumb.removeSourceSelector(selector)

        support.dragConnection(zone1, d2, true)
        ok(elDragged === true, "element was dragged instead of connection dragged")
        equal(2, _jsPlumb.select().length, "two connections in the instance; .zone1 has been removed")

        elDragged = false
        support.dragConnection(zone2, d2, true)
        ok(elDragged === true, "element was dragged instead of connection dragged")
        equal(2, _jsPlumb.select().length, "two connections in the instance; .zone2 has been removed")

    })

    test("addSourceSelector, two source zones, registered separately", function() {
        var sourceNode = makeSourceNode()
        var zone1 = addZone(sourceNode, "zone1")
        var zone2 = addZone(sourceNode, "zone2")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        var selector = _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        var selector2 = _jsPlumb.addSourceSelector(".zone2", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone1, d2, true)
        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(sourceNode, d2, true)
        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the node itself is not a source")
        ok(elDragged === true, "element was dragged")

        elDragged = false
        support.dragConnection(zone2, d2, true)
        ok(elDragged === false, "element was not dragged")

        equal(2, _jsPlumb.select().length, "two connections in the instance")

        // remove `.zone1, .zone2` and try to drag from each of the selectors

        _jsPlumb.removeSourceSelector(selector)

        support.dragConnection(zone1, d2, true)
        ok(elDragged === true, "element was dragged instead of connection dragged")
        equal(2, _jsPlumb.select().length, "two connections in the instance; .zone1 has been removed")

        elDragged = false
        support.dragConnection(zone2, d2, true)
        ok(elDragged === false, "element was not dragged")
        equal(3, _jsPlumb.select().length, "three connections in the instance; .zone1 has been removed but .zone2 remains")

    })

    test("addSourceSelector, two source zones, registered separately, drag source from one zone to another zone with 'anySource' redrop selector", function() {
        var sourceNode = makeSourceNode()
        var zone1 = addZone(sourceNode, "zone1")
        var zone2 = addZone(sourceNode, "zone2")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        var selector = _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:"anySource"
        })

        var selector2 = _jsPlumb.addSourceSelector(".zone2", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        var c = support.dragConnection(zone1, d2, true)
        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.relocateSource(c, zone2)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode, "source node is still node 1")
        equal(c.endpoints[0]._anchor.type, "Continuous", "source anchor is still Continuous, per the source selector spec")


    })

    /**
     * Tests the `extract` parameter on an `addSourceSelector` call: extract provides a map of attribute names that you want to
     * read fom the source element when a drag starts, and whose values end up in the connection's data, keyed by the
     * value from the extract map. In this test we get the attribute `foo` and insert its value into the connection's
     * data, keyed as `fooAttribute`.
     */
    test("addSourceSelector, extractor atts defined on source", function() {

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            extract:{
                "foo":"fooAttribute"
            }
        })

        var c = support.dragConnection(zone, d2, true)

        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance")

        equal(c.getData().fooAttribute, "the value of foo", "attribute values extracted properly");

        equal(c.endpoints[0].parameters["fooAttribute"], "the value of foo", "attribute values extracted and set as parameters on Endpoint");
    });

    test("addSourceSelector, addTargetSelector, extractor atts defined on source and target", function() {

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")
        tzone.setAttribute("foo", "the value of foo target");

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            extract:{
                "foo":"fooAttribute"
            }
        })

        _jsPlumb.addTargetSelector(".zone2", {
            extract:{
                "foo":"fooAttribute"
            }
        })

        var c = support.dragConnection(zone, tzone, true)

        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance")

        equal(c.getData().fooAttribute, "the value of foo", "attribute values extracted properly");

        equal(c.endpoints[0].parameters["fooAttribute"], "the value of foo", "attribute values extracted and set as parameters on source Endpoint");
        equal(c.endpoints[1].parameters["fooAttribute"], "the value of foo target", "attribute values extracted and set as parameters on target Endpoint");
    });

    test("addSourceSelector, addTargetSelector, parameterExtractor defined", function() {

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")
        tzone.setAttribute("foo", "the value of foo target");

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            parameterExtractor:function(el, target, idx) {
                return {
                    parameters: {
                        fooAttribute: target.getAttribute("foo")
                    }
                }
            }
        })

        _jsPlumb.addTargetSelector(".zone2", {
            parameterExtractor:function(el, target, idx) {
                return {
                    parameters: {
                        fooAttribute: target.getAttribute("foo")
                    }
                }
            }
        })

        var c = support.dragConnection(zone, tzone, true)

        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance")

//        equal(c.getData().fooAttribute, "the value of foo", "attribute values extracted properly");

        equal(c.endpoints[0].parameters["fooAttribute"], "the value of foo", "attribute values extracted and set as parameters on source Endpoint");
        equal(c.endpoints[1].parameters["fooAttribute"], "the value of foo target", "attribute values extracted and set as parameters on target Endpoint");
    });

    test("addSourceSelector, exclude:true", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1") // this will be added as an 'exclude' source selector
        var zone2 = addZone(sourceNode, "zone2") // we will drag from this one

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addDragFilter(".node")  // need to add a drag filter as otherwise in this test the element would be dragged.

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        }, true)

        support.dragConnection(zone, d2, true)
        ok(elDragged === false, "element was not dragged")
        equal(0, _jsPlumb.select().length, "no connections in the instance, we dragged from an excluded selector")

        support.dragConnection(zone2, d2, true)
        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "1 connection in the instance, we dragged from a part of the element that is not excluded")

        support.dragConnection(sourceNode, d2, true)
        equal(2, _jsPlumb.select().length, "two connections in the instance - the node itself, outside of the excluded part, is now a source")

    })

    test("addSourceSelector, then disable it", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        var selector = _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        selector.setEnabled(false)

        support.dragConnection(zone, d2, true)

        ok(elDragged === false, "element was not dragged")

        equal(0, _jsPlumb.select().length, "zero connections in the instance; the selector is disabled")

        selector.setEnabled(true)

        support.dragConnection(zone, d2, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance; the selector is enabled")

    })

    test("addSourceSelector, then disable element via data-jtk-enabled='false'", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, d2, true)

        ok(elDragged === false, "element was not dragged")

        equal(1, _jsPlumb.select().length, "one connection in the instance after initial drag")

        _jsPlumb.select().deleteAll()
        equal(0, _jsPlumb.select().length, "zero connections in the instance after connections cleared")

        zone.setAttribute("data-jtk-enabled", false)
        support.dragConnection(zone, d2, true)
        equal(0, _jsPlumb.select().length, "zero connections in the instance after attempted drag from disabled element")

        zone.setAttribute("data-jtk-enabled", true)
        support.dragConnection(zone, d2, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance after element was re-enabled and a connection was dragged")

        zone.setAttribute("data-jtk-enabled", false)
        support.dragConnection(zone, d2, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance after element was disabled and a connection failed to drag")

        zone.removeAttribute("data-jtk-enabled")
        support.dragConnection(zone, d2, true)
        equal(2, _jsPlumb.select().length, "two connections in the instance after enabled attribute removed from element, meaning default true, and a connection was dragged")

    })

    test("addSourceSelector, then remove it", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addTargetSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        var selector = _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, d2, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        _jsPlumb.removeSourceSelector(selector)
        support.dragConnection(zone, d2, true)

        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the source selector was removed")

        // now the connection drag from 'zone' should actually drag the element, as the drag filter will have been removed.
        support.dragConnection(zone, d2)

        ok(elDragged === true, "element was dragged")

    })

    test("addSourceSelector, loopback not allowed, per the source definition", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        var zone2 = addZone(sourceNode, "zone2")

        _jsPlumb.addSourceSelector(".zone1", {
            allowLoopback:false
        })

        _jsPlumb.addTargetSelector(".zone2")

        var c = support.dragConnection(zone, zone2)

        equal(0, _jsPlumb.select().length, "connection not established because loopback not allowed")

    });

    test("addSourceSelector, loopback not allowed, per the target definition", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        var zone2 = addZone(sourceNode, "zone2")

        _jsPlumb.addSourceSelector(".zone1")

        _jsPlumb.addTargetSelector(".zone2", {
            allowLoopback:false
        })

        var c = support.dragConnection(zone, zone2)

        equal(0, _jsPlumb.select().length, "connection not established because loopback not allowed")

    });

    test("addTargetSelector", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(d2, zone, true)

        ok(elDragged === false, "element was not dragged")

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(d2, targetNode, true)
        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the node itself is not a targetNode")

    })

    test("addTargetSelector, specify different anchors on source and target (issue 1103)", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2", { anchor:"Top"})

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Right",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        var conn = support.dragConnection(d2, zone, true)

        ok(elDragged === false, "element was not dragged")

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        equal(conn.endpoints[0]._anchor.type, "Top", "source anchor is Top")
        equal(conn.endpoints[1]._anchor.type, "Right", "source anchor is Right")

        support.dragConnection(d2, targetNode, true)
        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the node itself is not a targetNode")

    })

    test("addTargetSelector, maxConnections 1", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        var d3 = support.addDiv("d3")
        d3.className = "node"
        _jsPlumb.manage(d3)
        _jsPlumb.addSourceSelector("#d3")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            maxConnections:1
        })

        support.dragConnection(d2, zone, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance")

        // try to drag another connection, but the target has a limit of 1 connection
        support.dragConnection(d3, zone, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance since the second connection was rejected")

        var targetNode2 = makeTargetNode()
        var zone2 = addZone(targetNode2, "zone1")

        support.dragConnection(d2, zone2, true)
        equal(2, _jsPlumb.select().length, "two connections in the instance")

        // try to drag another connection, but the target has a limit of 1 connection
        support.dragConnection(d3, zone2, true)
        equal(2, _jsPlumb.select().length, "2 connections in the instance since the second connection to the second target was rejected")

    })

    test("addTargetSelector, maxConnections 2", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        var d3 = support.addDiv("d3")
        d3.className = "node"
        _jsPlumb.manage(d3)
        _jsPlumb.addSourceSelector("#d3")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            maxConnections:2
        })

        support.dragConnection(d2, zone, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(d2, zone, true)
        equal(2, _jsPlumb.select().length, "two connections in the instance")

        // try to drag another connection, but the target has a limit of 1 connection
        support.dragConnection(d3, zone, true)
        equal(2, _jsPlumb.select().length, "two connection in the instance since the third connection was rejected")

    })

    test("addTargetSelector, move target of dragged connection, default redrop policy (strict)", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var targetNode2 = makeTargetNode()
        targetNode2.style.left = "600px"
        targetNode2.style.top = "600px"
        var zone2 = addZone(targetNode2, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        var c = support.dragConnection(d2, zone, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(c.target, targetNode, "connection's target is first target node")

        support.relocateTarget(c, targetNode2)
        equal(0, _jsPlumb.select().length, "zero connections in the instance after target moved, because it was dropped in violation of the strict redrop policy")

        // reestablish the connection
        c = support.dragConnection(d2, zone, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        // relocate the dragged connection so that its target is dropped on the second target node
        support.relocateTarget(c, zone2)
        equal(1, _jsPlumb.select().length, "one connection in the instance after target moved")
        equal(c.target, targetNode2, "connection's target is second target node")

    })

    test("addTargetSelector, move target of dragged connection, redrop policy 'any'", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var targetNode2 = makeTargetNode()
        targetNode2.style.left = "600px"
        targetNode2.style.top = "600px"
        var zone2 = addZone(targetNode2, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:'any'
        })

        var c = support.dragConnection(d2, zone, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(c.target, targetNode, "connection's target is first target node")

        support.relocateTarget(c, targetNode2)
        equal(1, _jsPlumb.select().length, "one connection in the instance after target moved")
        equal(c.target, targetNode2, "connection's target is second target node")

    })

    test("addTargetSelector, move target of dragged connection, redrop policy 'any' but drop on the target selector zone anyway", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var targetNode2 = makeTargetNode()
        targetNode2.style.left = "600px"
        targetNode2.style.top = "600px"
        var zone2 = addZone(targetNode2, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:'any'
        })

        var c = support.dragConnection(d2, zone, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(c.target, targetNode, "connection's target is first target node")

        support.relocateTarget(c, zone2)
        equal(1, _jsPlumb.select().length, "one connection in the instance after target moved")
        equal(c.target, targetNode2, "connection's target is second target node")

    })

    test("addTargetSelector, then disable it", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        var selector = _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        selector.setEnabled(false)

        support.dragConnection(d2, zone, true)

        ok(elDragged === false, "element was not dragged")

        equal(0, _jsPlumb.select().length, "zero connections in the instance; the selector is disabled")

        selector.setEnabled(true)

        support.dragConnection(d2, zone, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance; the selector is enabled")

    })

    test("addTargetSelector, then remove it", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        var selector = _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(d2, zone, true)

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        _jsPlumb.removeTargetSelector(selector)
        support.dragConnection(d2, zone)

        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the source selector was removed")


    })

    test("addTargetSelector, entire element", function() {
        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone1")

        var d2 = makeSourceNode()
        var zone = addZone(d2, "zone1")
        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous"
        })


        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".target-node, .target-node *", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, tzone, true)
        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance after drag to .zone1, which matches the `*` in the selector")

        support.dragConnection(zone, targetNode, true)
        equal(2, _jsPlumb.select().length, "two connections in the instance after drop on element, as the selector matches the element")

    })

    test("addTargetSelector, two target zone definitions", function() {
        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone1")
        var tzone2 = addZone(targetNode, "zone2")

        var d2 = makeSourceNode()
        var zone = addZone(d2, "zone1")
        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous"
        })

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            redrop:"anyTarget"
        })

        _jsPlumb.addTargetSelector(".zone2", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        var c = support.dragConnection(zone, tzone, true)
        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance after drag to .zone1")

        support.relocateTarget(c, tzone2)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[1].element, targetNode, "target node is node 2")
        equal(c.endpoints[0]._anchor.type, "Continuous", "target anchor is still Continuous, per the source selector spec")

    })

    test("addTargetSelector, two target zone definitions, drag target", function() {
        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone1")
        var tzone2 = addZone(targetNode, "zone2")

        var d2 = makeSourceNode()
        var zone = addZone(d2, "zone1")
        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous"
        })

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        _jsPlumb.addTargetSelector(".zone2", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(zone, tzone, true)
        ok(elDragged === false, "element was not dragged")
        equal(1, _jsPlumb.select().length, "one connection in the instance after drag to .zone1")

        support.dragConnection(zone, tzone2, true)
        ok(elDragged === false, "element was not dragged")
        equal(2, _jsPlumb.select().length, "two connections in the instance after drag to .zone2")


    })

    test("addTargetSelector, then disable it via data-jtk-enabled attribute", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.manage(d2)
        _jsPlumb.addSourceSelector("#d2")

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        support.dragConnection(d2, zone, true)

        ok(elDragged === false, "element was not dragged")

        equal(1, _jsPlumb.select().length, "one connection in the instance when drag first occurs")

        _jsPlumb.select().deleteAll()
        equal(0, _jsPlumb.select().length, "zero connections in the instance after connections cleared")

        zone.setAttribute("data-jtk-enabled", false)
        support.dragConnection(d2, zone, true)
        equal(0, _jsPlumb.select().length, "zero connections in the instance after drag fails due to disabled target")

        zone.setAttribute("data-jtk-enabled", true)
        support.dragConnection(d2, zone, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance after drag succeeds due to enabled target")

        zone.setAttribute("data-jtk-enabled", false)
        support.dragConnection(d2, zone, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance after drag fails due to disabled target")

        zone.removeAttribute("data-jtk-enabled")
        support.dragConnection(d2, zone, true)
        equal(2, _jsPlumb.select().length, "two connections in the instance after enabled attribute remove from target, so defaults to true")
    })

    test("source and target selectors are NOT cleared on `reset` but they are on `destroy`", function() {


        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        _jsPlumb.addSourceSelector(".zone2", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        _jsPlumb.addTargetSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        equal(2, _jsPlumb.sourceSelectors.length, "2 source selectors registered")
        equal(1, _jsPlumb.targetSelectors.length, "1 target selector registered")

        _jsPlumb.reset()

        equal(2, _jsPlumb.sourceSelectors.length, "2 source selectors registered")
        equal(1, _jsPlumb.targetSelectors.length, "1 target selector registered")

        _jsPlumb.destroy()

        equal(0, _jsPlumb.sourceSelectors.length, "0 source selectors registered")
        equal(0, _jsPlumb.targetSelectors.length, "0 target selector registered")


    })

    test("addSourceSelector, addTargetSelector, `anchor` from defaults honoured", function() {

        _jsPlumb.importDefaults({
            anchor:"Top"
        })

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")

        _jsPlumb.addSourceSelector(".zone1", {
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        _jsPlumb.addTargetSelector(".zone2")

        var c = support.dragConnection(zone, tzone, true)

        equal(c.endpoints[0]._anchor.type, "Top", "source anchor correct per defaults");
        equal(c.endpoints[1]._anchor.type, "Top", "target anchor correct per defaults");
    });

    test("addSourceSelector, addTargetSelector, `anchors` from defaults honoured", function() {

        _jsPlumb.importDefaults({
            anchors:["Left", "Right"]
        })

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")

        _jsPlumb.addSourceSelector(".zone1", {
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        _jsPlumb.addTargetSelector(".zone2")

        var c = support.dragConnection(zone, tzone, true)

        equal(c.endpoints[0]._anchor.type, "Left", "source anchor correct per defaults");
        equal(c.endpoints[1]._anchor.type, "Right", "target anchor correct per defaults");
    });

    test("addSourceSelector, parameterExtractor returns anchor, anchor orientation honoured.", function() {

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")
        tzone.setAttribute("foo", "the value of foo target");

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            parameterExtractor:function(el, target, idx) {
                return {
                    parameters: {
                        fooAttribute: target.getAttribute("foo")
                    },
                    anchor:[0.3, 0.1, -1, -1]  // -1, -1 is not a valid set of orientation values in the real world, but for testing it's ok.
                }
            }
        })

        _jsPlumb.addTargetSelector(".zone2", {
            parameterExtractor:function(el, target, idx) {
                return {
                    parameters: {
                        fooAttribute: target.getAttribute("foo")
                    }
                }
            }
        })

        var c = support.dragConnection(zone, tzone, true, {
            beforeMouseUp:() => {
                console.log("before mouse up!")
                const sourceEndpoint = _jsPlumb.selectEndpoints().get(0)
                equal(sourceEndpoint._anchor.locations[0].ox, -1, "x orientation correctly set for source endpoint")
                equal(sourceEndpoint._anchor.locations[0].oy, -1, "y orientation correctly set for source endpoint")

                equal(sourceEndpoint.connections[0].endpoints[1]._anchor.locations[0].ox, 0, "x orientation correctly set for floating endpoint")
                equal(sourceEndpoint.connections[0].endpoints[1]._anchor.locations[0].oy, 0, "y orientation correctly set for floating endpoint")
            }
        })

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        equal(c.endpoints[0]._anchor.locations[0].x, 0.3, "x location of source anchor is as given by parameter extractor");
        equal(c.endpoints[0]._anchor.locations[0].y, 0.1, "y location of target anchor is as given by parameter extractor");
    });

    test("addSourceSelector, addTargetSelector, anchorPositionFinder supplied, anchor orientation honoured.", function() {

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")
        tzone.setAttribute("foo", "the value of foo target");

        let elDragged = false;
        _jsPlumb.bind("drag:move", function() {
            elDragged = true
        })

        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            anchorPositionFinder:function(el, pos, def, e) {
                console.log("pos params", el, pos, def, e)
                return [0.3, 0.1, -1, -1]  // -1, -1 is not a valid set of orientation values in the real world, but for testing it's ok.
            }
        })

        _jsPlumb.addTargetSelector(".zone2", {
            anchorPositionFinder:function(el, pos, def, e) {
                console.log("pos params", el, pos, def, e)
                return [0.6, 0.2, 1, 1]  // -1, -1 is not a valid set of orientation values in the real world, but for testing it's ok.
            }
        })

        var c = support.dragConnection(zone, tzone, true, {
            beforeMouseUp:() => {
                console.log("before mouse up!")
                const sourceEndpoint = _jsPlumb.selectEndpoints().get(0)
                equal(sourceEndpoint._anchor.locations[0].ox, -1, "x orientation correctly set for source endpoint")
                equal(sourceEndpoint._anchor.locations[0].oy, -1, "y orientation correctly set for source endpoint")

                equal(sourceEndpoint.connections[0].endpoints[1]._anchor.locations[0].ox, 0, "x orientation correctly set for floating endpoint")
                equal(sourceEndpoint.connections[0].endpoints[1]._anchor.locations[0].oy, 0, "y orientation correctly set for floating endpoint")
            }
        })

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        equal(c.endpoints[0]._anchor.locations[0].x, 0.3, "x location of source anchor is as given by anchorPositionFinder");
        equal(c.endpoints[0]._anchor.locations[0].y, 0.1, "y location of source anchor is as given by anchorPositionFinder");
        equal(c.endpoints[0]._anchor.locations[0].ox, -1, "x orientation of source anchor is as given by anchorPositionFinder");
        equal(c.endpoints[0]._anchor.locations[0].oy, -1, "y orientation of source anchor is as given by anchorPositionFinder");

        equal(c.endpoints[1]._anchor.locations[0].x, 0.6, "x location of target anchor x is as given by anchorPositionFinder");
        equal(c.endpoints[1]._anchor.locations[0].y, 0.2, "y location of target anchor y is as given by anchorPositionFinder");
        equal(c.endpoints[1]._anchor.locations[0].ox, 1, "x orientation of target anchor is as given by anchorPositionFinder");
        equal(c.endpoints[1]._anchor.locations[0].oy, 1, "y orientation of target anchor is as given by anchorPositionFinder");
    });

    test("addTargetSelector with canAcceptNewConnection handler", function() {

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")
        tzone.setAttribute("foo", "the value of foo target");

        var targetNode2 = makeTargetNode()
        var tzone2 = addZone(targetNode2, "zone2")
        tzone.setAttribute("foo2", "the value of foo target");


        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart"
        })

        _jsPlumb.addTargetSelector(".zone2", {
            canAcceptNewConnection:function(el, event) {
                return el === targetNode2
            }
        })

        var c = support.dragConnection(zone, tzone, true)
        equal(0, _jsPlumb.select().length, "zero connections in the instance as targetNode cannot accept new connections")

        var c2 = support.dragConnection(zone, tzone2, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance, as targetNode2 can accept new connections")
    });

    test("addSourceSelector with canAcceptNewConnection handler", function() {

        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var sourceNode2 = makeSourceNode()
        var zone2 = addZone(sourceNode2, "zone1")
        zone.setAttribute("foo", "the value of foo");

        var targetNode = makeTargetNode()
        var tzone = addZone(targetNode, "zone2")
        tzone.setAttribute("foo", "the value of foo target");


        _jsPlumb.addSourceSelector(".zone1", {
            anchor:"Continuous",
            endpoint:"Rectangle",
            connector:"Flowchart",
            canAcceptNewConnection:function(el, event) {
                return el === sourceNode2
            }
        })

        _jsPlumb.addTargetSelector(".zone2")

        var c = support.dragConnection(zone, tzone, true)
        equal(0, _jsPlumb.select().length, "zero connections in the instance as sourceNode cannot accept new connections")

        var c2 = support.dragConnection(zone2, tzone, true)
        equal(1, _jsPlumb.select().length, "one connection in the instance, as sourceNode2 can accept new connections")
    });


// ----------------------------------------------------------------------------------------------------------------
// ---------------- CSS CLASSES -----------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

    test("css classes", function() {

        var CLASS_CONNECTED = _jsPlumb.endpointConnectedClass
        var CLASS_ENDPOINT = _jsPlumb.endpointClass
        var CLASS_FULL = _jsPlumb.endpointFullClass
        var CLASS_DRAGGING = _jsPlumb.draggingClass
        var CLASS_FLOATING = _jsPlumb.endpointFloatingClass

        var d1 = makeSourceNode("d1"),
            d2 = makeSourceNode("d2"),
            z1 = addZone(d1, "zone1"),
            z2 = addZone(d2, "zone2")

        _jsPlumb.addSourceSelector(".zone1", {
            cssClass:"customSource",
            source:true
        })
        _jsPlumb.addTargetSelector(".zone2", {
            cssClass:"customTarget",
            target:true
        })

        support.assertManagedEndpointCount(d1, 0)
        support.assertManagedEndpointCount(d2, 0)
        support.assertManagedConnectionCount(d1, 0)
        support.assertManagedConnectionCount(d2, 0)

        support.dragConnection(z1, z2, false, {
            beforeMouseUp:function() {

                var e1 = _jsPlumb.endpointsByElement["d1"][0],
                    c1 = support.getEndpointCanvas(e1)

                equal(c1.classList.contains(CLASS_ENDPOINT), true, "d1 endpoint has jtk-endpoint class when dragging new connection")
                equal(c1.classList.contains(CLASS_CONNECTED), true, "d1 endpoint has jtk-endpoint-connected class when dragging new connection")
                equal(c1.classList.contains(CLASS_FULL), true, "d1 endpoint has jtk-endpoint-full class when dragging new connection")
                equal(c1.classList.contains(CLASS_DRAGGING), true, "d1 endpoint has jtk-dragging class (should be present as this is a new connection from a source) when dragging new connection")

                const floatingElementId = e1.connections[0].targetId

                support.assertManagedEndpointCount(e1.connections[0].target, 1)

                const floatingEndpoints = _jsPlumb.endpointsByElement[floatingElementId]

                const fc = support.getEndpointCanvas(floatingEndpoints[0])
                equal(fc.classList.contains("customSource"), true, "custom class set on floating endpoint copied from source when dragging new connection")
                equal(fc.classList.contains(CLASS_FLOATING), true, "floating endpoint has jtk-floating-endpoint class when dragging new connection")
                equal(fc.classList.contains(CLASS_CONNECTED), false, "floating endpoint has not jtk-endpoint-connected class when dragging new connection")
                equal(fc.classList.contains(CLASS_FULL), false, "floating endpoint has not jtk-endpoint-full class when dragging new connection")
                equal(fc.classList.contains(CLASS_DRAGGING), false, "floating endpoint has not jtk-dragging class when dragging new connection")

            }
        })

        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        var e1 = _jsPlumb.endpointsByElement["d1"][0],
            c1 = support.getEndpointCanvas(e1)

        var e2 = _jsPlumb.endpointsByElement["d2"][0],
            c2 = support.getEndpointCanvas(e2)

        equal(c1.classList.contains(CLASS_CONNECTED), true, "d1 endpoint has jtk-endpoint-connected class when new connection established")
        equal(c1.classList.contains(CLASS_FULL), true, "d1 endpoint has jtk-endpoint-full class when new connection established")
        equal(c1.classList.contains(CLASS_DRAGGING), false, "d1 endpoint has not jtk-dragging class removed after drag when new connection established")
        equal(c1.classList.contains("customSource"), true, "d1 endpoint has customSource class new connection established")
        equal(c2.classList.contains(CLASS_CONNECTED), true, "d2 endpoint has jtk-endpoint-connected class when new connection established")
        equal(c2.classList.contains(CLASS_FULL), true, "d2 endpoint has jtk-endpoint-full class when new connection established")
        equal(c2.classList.contains("customTarget"), true, "d2 endpoint has customTarget class new connection established")

        // debugger
        support.detachAndReattachConnection(e1, {
            beforeMouseUp:function() {

                const d2Endpoints = _jsPlumb.endpointsByElement["d2"]
                const floatingElementId = d2Endpoints[0].connections[0].sourceId
                const floatingEndpoints = _jsPlumb.endpointsByElement[floatingElementId]
                const fc = support.getEndpointCanvas(floatingEndpoints[0])
                equal(fc.classList.contains("customSource"), true, "custom class set on floating endpoint copied from source when detaching and reattaching source")

                equal(fc.classList.contains(CLASS_FLOATING), true, "floating endpoint has jtk-floating-endpoint class when detaching and reattaching source")
                equal(fc.classList.contains(CLASS_CONNECTED), false, "floating endpoint has not jtk-endpoint-connected class when detaching and reattaching source")
                equal(fc.classList.contains(CLASS_FULL), false, "floating endpoint has not jtk-endpoint-full class when detaching and reattaching source")
                equal(fc.classList.contains(CLASS_DRAGGING), false, "floating endpoint has not jtk-dragging class when detaching and reattaching source")

                equal(c1.classList.contains(CLASS_CONNECTED), false, "d1 endpoint has not jtk-endpoint-connected class as it is currently disconnected when detaching and reattaching source")
                equal(c1.classList.contains(CLASS_FULL), false, "d1 endpoint has not jtk-endpoint-full class as it is currently disconnected when detaching and reattaching source")
                equal(c1.classList.contains(CLASS_DRAGGING), false, "d1 endpoint has not jtk-dragging class as a new connection is not being dragged when detaching and reattaching source")
            }
        })

        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        equal(c1.classList.contains(CLASS_CONNECTED), true, "d1 endpoint has jtk-endpoint-connected class as the connection was reattached")
        equal(c1.classList.contains(CLASS_FULL), true, "d1 endpoint has jtk-endpoint-full class as the connection was reattached")
        equal(c1.classList.contains(CLASS_DRAGGING), false, "d1 endpoint does not have jtk-dragging class")

        // we now have 2 endpoints that are connected.  detaching via the target should mean:
        // - during the drag, the target should not show full, connected or dragging, whereas the target should show full and connected.
        //

        support.detachAndReattachConnection(e2, {
            beforeMouseUp:function() {

                const d1Endpoints = _jsPlumb.endpointsByElement["d1"]
                const floatingElementId = d1Endpoints[0].connections[0].targetId
                const floatingEndpoints = _jsPlumb.endpointsByElement[floatingElementId]
                const fc = support.getEndpointCanvas(floatingEndpoints[0])
                equal(fc.classList.contains("customTarget"), true, "custom class set on floating endpoint copied from target when detaching and reattaching target")

                equal(fc.classList.contains(CLASS_FLOATING), true, "floating endpoint has jtk-floating-endpoint class when detaching and reattaching target")
                equal(fc.classList.contains(CLASS_CONNECTED), false, "floating endpoint has not jtk-endpoint-connected class when detaching and reattaching target")
                equal(fc.classList.contains(CLASS_FULL), false, "floating endpoint has not jtk-endpoint-full class when detaching and reattaching target")
                equal(fc.classList.contains(CLASS_DRAGGING), false, "floating endpoint has not jtk-dragging class when detaching and reattaching target")

                equal(c2.classList.contains(CLASS_CONNECTED), false, "d2 endpoint has not jtk-endpoint-connected class as it is currently disconnected when detaching and reattaching target")
                equal(c2.classList.contains(CLASS_FULL), false, "d2 endpoint has not jtk-endpoint-full class as it is currently disconnected when detaching and reattaching target")
                equal(c2.classList.contains(CLASS_DRAGGING), false, "d2 endpoint has not jtk-dragging class as a new connection is not being dragged when detaching and reattaching target")
            }
        })

        support.assertManagedConnectionCount(d1, 1)
        support.assertManagedConnectionCount(d2, 1)

        equal(c2.classList.contains(CLASS_CONNECTED), true, "d2 endpoint has jtk-endpoint-connected class as the connection was reattached")
        equal(c2.classList.contains(CLASS_FULL), true, "d2 endpoint has jtk-endpoint-full class as the connection was reattached")
        equal(c2.classList.contains(CLASS_DRAGGING), false, "d2 endpoint does not have jtk-dragging class")
    });

};

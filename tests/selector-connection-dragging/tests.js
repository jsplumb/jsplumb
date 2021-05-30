QUnit.config.reorder = false;

var defaults = null, support, _jsPlumb, count = 0;

function makeNode(id, className) {
    var d = support.addDiv("" + ++count)
    d.className = className + " " + "node"
    _jsPlumb.manage(d)
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
            _jsPlumb = jsPlumbBrowserUI.newInstance({container:container});
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumbUtil.extend({}, _jsPlumb.defaults);
        }
    });

    test("addSourceSelector", function() {
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

        equal(1, _jsPlumb.select().length, "one connection in the instance")

        support.dragConnection(sourceNode, d2, true)
        equal(1, _jsPlumb.select().length, "still only one connection in the instance - the node itself is not a source")

    })

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

        // relocate the dragged connection so that its source is the 3rd source node. note that here we have to drop the
        // connection on the part of the element that is setup as a source selector, which is a departure from v2/v4. the test below
        // shows how you can setup the source selector so you can drop back anywhere on the element instead.
        support.relocateSource(c, zone3)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode3, "source node is now node 3")
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

        let elDragged = false;
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

        // relocate the dragged connection so that its source is the 3rd source node. note that here we have to drop the
        // connection on the part of the element that is setup as a source selector, which is a departure from v2/v4. the test below
        // shows how you can setup the source selector so you can drop back anywhere on the element instead.
        support.relocateSource(c, zone3)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode3, "source node is now node 3")
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

        // relocate the dragged connection so that its source is the second source node.
        support.relocateSource(c, sourceNode3)
        equal(1, _jsPlumb.select().length, "one connection in the instance")
        equal(_jsPlumb.select().get(0).endpoints[0].element, sourceNode3, "source node is now node 3")

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

    test("addTargetSelector, move target of dragged connection", function() {
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

        // relocate the dragged connection so that its target is dropped on the second target node
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


};

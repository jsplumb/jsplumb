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
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
        }
    });

    test("addSourceSelector", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.makeTarget(d2)

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

    test("addSourceSelector, exclude:true", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1") // this will be added as an 'exclude' source selector
        var zone2 = addZone(sourceNode, "zone2") // we will drag from this one

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.makeTarget(d2)

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
        _jsPlumb.makeTarget(d2)

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

    test("addSourceSelector, then remove it", function() {
        var sourceNode = makeSourceNode()
        var zone = addZone(sourceNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.makeTarget(d2)

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

    test("addTargetSelector", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.makeSource(d2)

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

    test("addTargetSelector, then disable it", function() {
        var targetNode = makeTargetNode()
        var zone = addZone(targetNode, "zone1")

        var d2 = support.addDiv("d2")
        d2.className = "node"
        _jsPlumb.makeSource(d2)

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
        _jsPlumb.makeSource(d2)

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

    test("source and target selectors are cleared on reset", function() {


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

        equal(0, _jsPlumb.sourceSelectors.length, "0 source selectors registered")
        equal(0, _jsPlumb.targetSelectors.length, "0 target selector registered")


    })


};

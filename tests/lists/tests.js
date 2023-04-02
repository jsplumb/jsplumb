QUnit.config.reorder = false;
var defaults = null, support, _jsPlumb, divs = [], container, listManager

function makeAList(count, x, y) {
    var parent = support.addDiv(support.uuid(), null, null, x, y)
    parent.innerHTML = ""
    parent.style.display = "flex";
    parent.style.flexDirection = "column";
    parent.style.height = "200px";
    parent.style.width = "150px";
    parent.style.outline = "1px solid red";
    parent.style.overflow = "auto";

    count = count || 10;

    divs.push(parent);

    for (var i = 0; i < count; i++) {
        var child = document.createElement("div")
        parent.appendChild(child)
        child.innerHTML = "" + (i+1)
        child.style.width = "100%";
        child.style.flexBasis = "40px";
        child.style.outline = "1px solid";
        child.style.flexShrink = "0";
        divs.push(child);
    }

    return parent;
}

function makeTwoLists(count1, count2) {
    var l1 = makeAList(count1, 140,50), l2 = makeAList(count2, 400, 100),
        c1 = l1.querySelectorAll("div"),
        c2 = l2.querySelectorAll("div");

    for (var i = 0; i < c1.length; i++) {
        _jsPlumb.manage(c1[i])
        c1[i].className = "sourceList"

    }

    for (i = 0; i < c2.length; i++) {
        _jsPlumb.manage(c2[i])
        c2[i].className = "targetList"
    }

    listManager.addList(l1)
    listManager.addList(l2)

    _jsPlumb.addSourceSelector(".sourceList", {
        allowLoopback:false,
        anchor:["Left", "Right"]
    })
    _jsPlumb.addTargetSelector(".targetList", {
        allowLoopback:false,
        anchor:["Left", "Right"]
    })

    return [l1, l2]

}

var testSuite = function () {

    module("jsPlumb - Lists", {
        teardown: function () {
            support.cleanup();
            for (var i = 0; i < divs.length; i++) {
                try {
                    divs[i].parentNode && divs[i].parentNode.removeChild(divs[i]);
                }
                catch (e) {}
            }

            container.parentNode && container.parentNode.removeChild(container)
        },
        setup: function () {
            container = document.createElement("j" + jsPlumb.uuid().replace(/-/g, ""))
            container.style.position = "relative"
            document.body.appendChild(container)
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
            listManager = new jsPlumb.JsPlumbListManager(_jsPlumb)
        }
    });

    asyncTest(': configure two lists, connect them programmatically, scroll.', function () {
        var lists = makeTwoLists()
        var l1 = lists[0]
        var l2 = lists[1]
        // now we have two lists whose child items overflow their viewport.

        QUnit.start()
        var ii = _jsPlumb._instanceIndex
        equal(l1.getAttribute("jtk-scrollable-list"), ii + "_0", "scrollable list attribute set on l1");
        equal(l2.getAttribute("jtk-scrollable-list"), ii + "_1", "scrollable list attribute set on l2");

        // connect the first item of list 1 to the first item of list 2. no proxying should occur
        _jsPlumb.connect({source:l1.childNodes[0], target:l2.childNodes[0]});

        var secondSourceChild = l1.childNodes[1];
        var thirdSourceChild = l1.childNodes[2];
        var lastTargetChild = l2.childNodes[l2.childNodes.length - 1];
        // connect the second item of list 1 to the last item of list 2: proxying should occur
        _jsPlumb.connect({source:secondSourceChild, target:lastTargetChild});

        equal(1, lastTargetChild._jsPlumbProxies.length, "one proxy for last target child")

        // connect to the last item of list 2 again
        _jsPlumb.connect({source:thirdSourceChild, target:lastTargetChild});

        equal(2, lastTargetChild._jsPlumbProxies.length, "two proxies for last target child")

        QUnit.stop()

        lastTargetChild.scrollIntoView()

        setTimeout(function() {
            QUnit.start()
            equal(null, lastTargetChild._jsPlumbProxies, "zero proxies for last target child; it is now in the viewport")
        }, 0)

    });

    asyncTest(': configure two lists, connect them via the mouse, scroll.', function () {

       // var r = []

        var lists = makeTwoLists()
        var l1 = lists[0]
        var l2 = lists[1]
        // now we have two lists whose child items overflow their viewport.

        QUnit.start()
        var ii = _jsPlumb._instanceIndex
        equal(l1.getAttribute("jtk-scrollable-list"), ii + "_0", "scrollable list attribute set on l1");
        equal(l2.getAttribute("jtk-scrollable-list"), ii + "_1", "scrollable list attribute set on l2");

        var firstSourceChild = l1.childNodes[1];
        var secondSourceChild = l1.childNodes[1];
        var thirdSourceChild = l1.childNodes[2];
        var lastTargetChild = l2.childNodes[l2.childNodes.length - 1];
        var firstTargetChild = l2.childNodes[0];

        // connect the first item of list 1 to the first item of list 2. no proxying should occur
        support.dragConnection(firstSourceChild, firstTargetChild);
        equal(1, _jsPlumb.select().length, "1 connection in the instance");
        equal(null, firstSourceChild._jsPlumbProxies, "zero proxies for first source child")
        equal(null, firstTargetChild._jsPlumbProxies, "zero proxies for first target child")

        // try to connect the second item of list 1 to the last item of list 2: it should fail, because the target is out of the viewport.
        support.dragConnection(secondSourceChild, lastTargetChild);

        equal(0, lastTargetChild._jsPlumbProxies.length, "zero proxies for last target child")

        QUnit.stop()

        // scroll the last target into vew
        lastTargetChild.scrollIntoView()

        setTimeout(function() {
            QUnit.start()

            equal(1, firstTargetChild._jsPlumbProxies.length, "first target child now has been proxied as it is above the viewport")

            // drag a connection to the last target, and observe the connection was successful
            support.dragConnection(secondSourceChild, lastTargetChild);
            equal(2, _jsPlumb.select().length, "2 connections in the instance after dragging connection to last target child");


        }, 100)

    });



};

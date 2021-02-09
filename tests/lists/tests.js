QUnit.config.reorder = false;
var defaults = null, support, _jsPlumb, divs = []

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
        _jsPlumb.makeSource(c1[i], {
            allowLoopback:false,
            anchor:["Left", "Right"]
        })
    }

    for (i = 0; i < c2.length; i++) {
        _jsPlumb.makeTarget(c2[i], {
            allowLoopback:false,
            anchor:["Left", "Right"]
        })
    }

    _jsPlumb.addList(l1)
    _jsPlumb.addList(l2)

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
        },
        setup: function () {
            _jsPlumb = jsPlumbBrowserUI.newInstance(({container:container}));
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
        }
    });

    asyncTest(': configure two lists, connect them programmatically, scroll.', function () {
        let [l1,l2] = makeTwoLists()
        // now we have two lists whose child items overflow their viewport.

        QUnit.start()
        equal(l1.getAttribute("jtk-scrollable-list"), "1_0", "scrollable list attribute set on l1");
        equal(l2.getAttribute("jtk-scrollable-list"), "1_1", "scrollable list attribute set on l2");

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
            //equal(0, lastTargetChild._jsPlumbProxies.length, "zero proxies for last target child; it is now in the viewport")
            equal(null, lastTargetChild._jsPlumbProxies, "zero proxies for last target child; it is now in the viewport")
        }, 0)

    });

    asyncTest(': configure two lists, connect them via the mouse, scroll.', function () {
        let [l1,l2] = makeTwoLists()
        // now we have two lists whose child items overflow their viewport.

        QUnit.start()
        equal(l1.getAttribute("jtk-scrollable-list"), "2_0", "scrollable list attribute set on l1");
        equal(l2.getAttribute("jtk-scrollable-list"), "2_1", "scrollable list attribute set on l2");

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
        }, 0)

    });



};

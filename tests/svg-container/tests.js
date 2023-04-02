QUnit.config.reorder = false;
var defaults = null, support, _jsPlumb, container;

var makeContainer = function() {
    //container = document.createElement("div")
    container = jsPlumb.svg.node("svg")
    document.documentElement.appendChild(container)
    container.style.position = "relative"
    container.style.overflow = "hidden"
    container.style.width="500px"
    container.style.height="500px"
    container.style.outline = "1px solid"
}

var removeContainer = function() {
    container && container.parentNode && container.parentNode.removeChild(container)
}

var makeSvg = function(el, atts, parent) {
    var d = jsPlumb.svg.node(el, atts)
    if (parent) {
        parent.appendChild(d)
    }
    return d
}

var testSuite = function () {

    module("SVG Container", {
        teardown: function () {
            support.cleanup();
            removeContainer()
        },
        setup: function () {
            makeContainer()
            _jsPlumb = jsPlumb.newInstance(({container: container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
        }
    });


    test('SVG container recognised', function () {
        equal(_jsPlumb.containerType, "SVG", "container recognised as SVG element")
    })

    test('Cannot manage a non-svg element', function () {
        var d = document.createElement("div")
        try {
            _jsPlumb.manage(d)
            ok(false, "Should not be able to manage a non-svg element")
        }
        catch (e) {
            ok(true, "Error thrown when trying to manage non svg element")
        }
    })

    test('add SVG element', function () {
        var s = makeSvg("svg",{
            "width":50,
            "height":50,
            "x":50,
            "y":50
        })
        makeSvg("rect", {
            "width":50,
            "height":50,
            "x":0,
            "y":0,
            "fill":"blue"
        }, s)

        _jsPlumb.getContainer().appendChild(s)
        _jsPlumb.manage(s)
        var s1Id = s.getAttribute("data-jtk-managed")
        var vp1  = _jsPlumb._managedElements[s1Id]
        var vel1 = vp1.viewportElement
        equal(vel1.x, 50, "viewport x position is correct")
        equal(vel1.y, 50, "viewport y position is correct")
        equal(vel1.w, 50, "viewport width is correct")
        equal(vel1.h, 50, "viewport height is correct")

        var s2 = makeSvg("svg",{
            "width":50,
            "height":50,
            "x":250,
            "y":250
        })
        makeSvg("rect", {
            "width":50,
            "height":50,
            "x":0,
            "y":0,
            "fill":"red"
        }, s2)
        _jsPlumb.manage(s2)

        _jsPlumb.getContainer().appendChild(s2)

        //equal(s.getAttribute("x"), 50)

        var ep1 = _jsPlumb.addEndpoint(s, {
            type:"Dot"
        })
        equal(ep1.endpoint.canvas.getAttribute("x"), 70, "ep at x 70")

        _jsPlumb.connect({
            source:s,
            target:s2
        })

        equal(_jsPlumb.select().length, 1, "1 connection in instance")
    })

    test('not allowed to add non-SVG element', function () {
        var d = document.createElement("div")
        try {
            _jsPlumb.manage(d)
            ok(false, "should not be allowed to manage non-svg element")
        }
        catch (e) {
            ok(true, "exception thrown when trying to manage non-svg element")
        }
    })

};

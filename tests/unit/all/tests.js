// _jsPlumb qunit tests.

QUnit.config.reorder = false;

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

var countKeys = function(obj) {
    var i = 0;
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) i++;
    }
    return i;
};

var assertConnectionCount = function (endpoint, count) {
    equal(endpoint.connections.length, count, "endpoint has " + count + " connections");
};

var assertConnectionByScopeCount = function (scope, count, _jsPlumb) {
    equal(_jsPlumb.select({scope: scope}).length, count, 'Scope ' + scope + " has " + count + (count > 1) ? "connections" : "connection");
};

var VERY_SMALL_NUMBER = 0.00000000001;
// helper to test that a value is the same as some target, within our tolerance
// sometimes the trigonometry stuff needs a little bit of leeway.
var within = function (val, target, _ok, msg) {
    _ok(Math.abs(val - target) < VERY_SMALL_NUMBER, msg + "[expected: " + target + " got " + val + "] [diff:" + (Math.abs(val - target)) + "]");
};
//
// var _divs = [];
// var _addDiv = function (id, parent, className, x, y, w, h) {
//     var d1 = document.createElement("div");
//     d1.style.position = "absolute";
//     if (parent) parent.appendChild(d1); else document.getElementById("container").appendChild(d1);
//     d1.setAttribute("id", id);
//     d1.style.left = (x != null ? x : (Math.floor(Math.random() * 1000))) + "px";
//     d1.style.top = (y!= null ? y : (Math.floor(Math.random() * 1000))) + "px";
//     if (className) d1.className = className;
//     if (w) d1.style.width = w + "px";
//     if (h) d1.style.height = h + "px";
//     _divs.push(id);
//     return d1;
// };
//
// var support.addDraggableDiv( = function (_jsPlumb, id, parent, className, x, y, w, h) {
//     var d = _addDiv.apply(null, [id, parent, className, x, y, w, h]);
//     _jsPlumb.draggable(d);
//     return d;
// };
//
// var _addDivs = function (ids, parent) {
//     for (var i = 0; i < ids.length; i++)
//         support.addDiv(ids[i], parent);
// };

var defaults = null, support,
    _cleanup = function (_jsPlumb) {
        _jsPlumb.reset();
        _jsPlumb.unbindContainer();
        if (_jsPlumb.select().length != 0)
            throw "there are connections!";

        _jsPlumb.Defaults = defaults;

        support.cleanup();

        /*
        var svg = document.querySelectorAll("svg");
        for (var i = 0; i < svg.length; i++) {
            svg[i].parentNode.removeChild(svg[i]);
        }*/

        document.getElementById("container").innerHTML = "";
    };

var testSuite = function (_jsPlumb) {

    var renderMode = jsPlumb.SVG;
    support = jsPlumbTestSupport.getInstance(_jsPlumb);

    module("jsPlumb", {
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



    //*
/*
    test(" : getElementObject", function () {
        var e = document.createElement("div");
        e.id = "FOO";
        document.body.appendChild(e);
        var el = jsPlumb.getElementObject(e);
        equal(jsPlumbTestSupport.getAttribute(el, "id"), "FOO");
    });
    */

    test(" : getElement", function () {
        var e = document.createElement("div");
        e.id = "FOO";
        document.body.appendChild(e);
        var e2 = jsPlumb.getElement(e);
        equal(e2.id, "FOO");

        var e3 = jsPlumb.getElement("FOO");
        equal(e3.id, "FOO");
    });

    test(': _jsPlumb setup', function () {
        ok(_jsPlumb, "loaded");
    });

    test(': getId', function () {
        var d10 = support.addDiv('d10');
        equal(_jsPlumb.getId(jsPlumb.getElement(d10)), "d10");
    });

    test(': create a simple endpoint', function () {
        var d1 = support.addDiv("d1");
        var e = _jsPlumb.addEndpoint("d1", {});
        ok(e, 'endpoint exists');
        support.assertEndpointCount("d1", 1);
        ok(e.id != null, "endpoint has had an id assigned");
    });

    test(': create and remove a simple endpoint', function () {
        var d1 = support.addDiv("d1");
        var ee = _jsPlumb.addEndpoint(d1, {uuid: "78978597593"});
        ok(ee != null, "endpoint exists");
        var e = _jsPlumb.getEndpoint("78978597593");
        ok(e != null, "the endpoint could be retrieved by UUID");
        ok(e.id != null, "the endpoint has had an id assigned to it");
        support.assertEndpointCount("d1", 1);
        _jsPlumb.deleteEndpoint(ee);
        support.assertEndpointCount("d1", 0);
        e = _jsPlumb.getEndpoint("78978597593");
        equal(e, null, "the endpoint has been deleted");
    });

    test('endpoint with overlays', function() {
        var d1 = support.addDiv("d1");
        var e = _jsPlumb.addEndpoint(d1, {
            "overlays": [["Label", {"label": "Label text", "cssClass": 'kw_port_label', "id": "66"}]]
        });
        var o = e.getOverlay("66");
        ok(o != null, "overlay exists");
    });

    test(': create two simple endpoints, registered using a selector', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        jsPlumb.addClass(d1, "window");
        jsPlumb.addClass(d2, "window");
        var endpoints = _jsPlumb.addEndpoint(jsPlumb.getSelector(".window"), {});
        equal(endpoints.length, 2, "endpoint added to both windows");
        support.assertEndpointCount("d1", 1);
        support.assertEndpointCount("d2", 1);
    });

    test(': create two simple endpoints, registered using an array of element ids', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        jsPlumb.addClass(d1, "window");
        jsPlumb.addClass(d2, "window");
        var endpoints = _jsPlumb.addEndpoint(["d1", "d2"], {});
        equal(endpoints.length, 2, "endpoint added to both windows");
        support.assertEndpointCount("d1", 1);
        support.assertEndpointCount("d2", 1);
    });

    test(' jsPlumb.remove after element removed from DOM', function () {
        var d = document.createElement("div");
        d.innerHTML = '<div id="container2"><ul id="targets"><li id="in1">input 1</li><li id="in2">input 2</li></ul><ul id="sources"><li id="output">output</li></ul></div>';
        var container = d.firstChild;
        document.body.appendChild(jsPlumb.getElement(container));
        var e1 = _jsPlumb.addEndpoint("in1", { maxConnections: 1, isSource: false, isTarget: true, anchor: [ 0, 0.4, -1, 0 ] }),
            e2 = _jsPlumb.addEndpoint("in2", { maxConnections: 1, isSource: false, isTarget: true, anchor: [ 0, 0.4, -1, 0 ] }),
            e3 = _jsPlumb.addEndpoint("output", { isSource: true, isTarget: false, anchor: [ 1, 0.4, 1, 0 ] });

        _jsPlumb.connect({source: e3, target: e1});

        // the element gets removed out of jsplumb's control
        var op = document.getElementById("output");
        op.parentNode.removeChild(op);

        // but you can tell jsPlumb about it after the fact
        _jsPlumb.remove("output");


        equal(_jsPlumb.selectEndpoints({element: "output"}).length, 0, "no endpoints registered for in1");
    });

    test(': draggable in nested element does not cause extra ids to be created', function () {
        var d = support.addDiv("d1");
        var d2 = document.createElement("div");
        d2.setAttribute("foo", "ff");
        d.appendChild(d2);
        var d3 = document.createElement("div");
        d2.appendChild(d3);
        ok(d2.getAttribute("id") == null, "no id on d2");
        _jsPlumb.draggable(d);
        _jsPlumb.addEndpoint(d3);
        ok(d2.getAttribute("id") == null, "no id on d2");
        ok(d3.getAttribute("id") != null, "id on d3");
    });

    test(" : draggable, reference elements returned correctly", function () {
        var d = support.addDiv("d1");
        var d2 = document.createElement("div");
        d2.setAttribute("foo", "ff");
        d.appendChild(d2);
        var d3 = document.createElement("div");
        d3.setAttribute("id", "d3");
        d2.appendChild(d3);
        _jsPlumb.draggable(d);
        _jsPlumb.addEndpoint(d3);
        _jsPlumb.draggable(d3);
        // now check ref ids for element d1
        var els = _jsPlumb.dragManager.getElementsForDraggable("d1");
        ok(!jsPlumbUtil.isEmpty(els), "there is one sub-element for d1");
        ok(els["d3"] != null, "d3 registered");
    });


    test(" : draggable + setParent, reference elements returned correctly", function () {
        var d = support.addDiv("d1");
        var d2 = document.createElement("div");
        d2.setAttribute("foo", "ff");
        d.appendChild(d2);
        var d3 = document.createElement("div");
        d3.setAttribute("id", "d3");
        d2.appendChild(d3);
        _jsPlumb.draggable(d);
        _jsPlumb.addEndpoint(d3);
        _jsPlumb.draggable(d3);
        // create some other new parent
        var d12 = support.addDiv("d12");
        // and move d3
        _jsPlumb.setParent(d3, d12);

        // now check ref ids for element d1
        var els = _jsPlumb.dragManager.getElementsForDraggable("d1");
        ok(jsPlumbUtil.isEmpty(els), "there are no sub-elements for d1");
        var els12 = _jsPlumb.dragManager.getElementsForDraggable("d12");
        ok(!jsPlumbUtil.isEmpty(els12), "there is one sub-element for d12");
        ok(els12["d3"] != null, "d3 registered");
    });

test("drag multiple elements and ensure their connections are painted correctly at the end", function() {

        var d1 = support.addDraggableDiv ('d1', null, null,50, 50, 100, 100);
        var d2 = support.addDraggableDiv ('d2', null, null,250, 250, 100, 100);
        var d3 = support.addDraggableDiv ('d3', null, null,500, 500, 100, 100);

        var e1 = _jsPlumb.addEndpoint(d1, {
            anchor:"TopLeft"
        });
        var e2 = _jsPlumb.addEndpoint(d2, {
            anchor:"TopLeft",
            maxConnections:-1
        });
        var e3 = _jsPlumb.addEndpoint(d3, {
            anchor:"TopLeft"
        });

        _jsPlumb.connect({source:e1, target:e2});
        _jsPlumb.connect({source:e2, target:e3});

        equal(e1.canvas.offsetLeft, 50 - (e1.canvas.offsetWidth/2), "endpoint 1 is at the right place");
        equal(e1.canvas.offsetTop, 50 - (e1.canvas.offsetHeight/2), "endpoint 1 is at the right place");
        equal(e2.canvas.offsetLeft, 250 - (e2.canvas.offsetWidth/2), "endpoint 2 is at the right place");
        equal(e2.canvas.offsetTop, 250 - (e2.canvas.offsetHeight/2), "endpoint 2 is at the right place");
        equal(e3.canvas.offsetLeft, 500 - (e3.canvas.offsetWidth/2), "endpoint 3 is at the right place");
        equal(e3.canvas.offsetTop, 500 - (e3.canvas.offsetHeight/2), "endpoint 3 is at the right place");

        _jsPlumb.addToDragSelection("d1");
        _jsPlumb.addToDragSelection("d3");

        // drag node 2 by 750,750. we expect its endpoint to have moved too

        support.dragNodeTo(d2, 1000, 1000);

        equal(d2.offsetLeft, 950, "div 2 is at the right left position");
        equal(d2.offsetTop, 950, "div 2 is at the right top position");

        // divs 1 and 3 have moved too, make sure they are in the right place
        equal(d1.offsetLeft, 750, "div 1 is at the right left position");
        equal(d1.offsetTop, 750, "div 1 is at the right top position");
        equal(d3.offsetLeft, 1200, "div 3 is at the right left position");
        equal(d3.offsetTop, 1200, "div 3 is at the right top position");

        // check the endpoints
        equal(e2.canvas.offsetLeft, 950 - (e2.canvas.offsetWidth/2), "endpoint 2 is at the right place");
        equal(e2.canvas.offsetTop, 950 - (e2.canvas.offsetHeight/2), "endpoint 2 is at the right place");

        equal(e1.canvas.offsetLeft, 750 - (e1.canvas.offsetWidth/2), "endpoint 1 is at the right place");
        equal(e1.canvas.offsetTop, 750 - (e1.canvas.offsetHeight/2), "endpoint 1 is at the right place");

        equal(e3.canvas.offsetLeft, 1200 - (e3.canvas.offsetWidth/2), "endpoint 3 is at the right place");
        equal(e3.canvas.offsetTop, 1200 - (e3.canvas.offsetHeight/2), "endpoint 3 is at the right place");

    });

    test(": lineWidth specified as string (eew)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: "d1",
            target: "d2",
            paintStyle: {
                stroke: "red",
                strokeWidth: "3"
            }
        });
        equal(c._jsPlumb.paintStyleInUse.strokeWidth, 3, "line width converted to integer");
    });

    test(": outlineWidth specified as string (eew)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: "d1",
            target: "d2",
            paintStyle: {
                stroke: "red",
                strokeWidth: 3,
                outlineWidth: "5"
            }
        });
        c.repaint();
        equal(c._jsPlumb.paintStyleInUse.outlineWidth, 5, "outline width converted to integer");
    });




    test(": strokeWidth and outlineWidth specified as strings (eew)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: "d1",
            target: "d2",
            paintStyle: {
                stroke: "red",
                strokeWidth: "3",
                outlineWidth: "5"
            }
        });
        c.repaint();
        equal(c._jsPlumb.paintStyleInUse.outlineWidth, 5, "outline width converted to integer");
        equal(c._jsPlumb.paintStyleInUse.strokeWidth, 3, "line width converted to integer");
    });

    test(': defaultEndpointMaxConnections', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {isSource: true});
        ok(e3.anchor, 'endpoint 3 has an anchor');
        var e4 = _jsPlumb.addEndpoint(d4, {isSource: true});
        support.assertEndpointCount("d3", 1, _jsPlumb);
        support.assertEndpointCount("d4", 1, _jsPlumb);
        ok(!e3.isFull(), "endpoint 3 is not full.");
        _jsPlumb.connect({source: d3, target: 'd4', sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);   // we have one connection
        _jsPlumb.connect({source: d3, target: 'd4', sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);  // should have refused the connection; default max is 1.
    });

    test(': specifiedEndpointMaxConnections', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var e5 = _jsPlumb.addEndpoint(d5, {isSource: true, maxConnections: 3});
        ok(e5.anchor, 'endpoint 5 has an anchor');
        var e6 = _jsPlumb.addEndpoint(d6, {isSource: true, maxConnections: 2});  // this one has max TWO
        support.assertEndpointCount("d5", 1, _jsPlumb);
        support.assertEndpointCount("d6", 1, _jsPlumb);
        ok(!e5.isFull(), "endpoint 5 is not full.");
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e6});
        assertConnectionCount(e5, 1);   // we have one connection
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e6});
        assertConnectionCount(e5, 2);  // two connections
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e6});
        assertConnectionCount(e5, 2);  // should have refused; max is 2, for d4.
    });

    test(': noEndpointMaxConnections', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {isSource: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 1);   // we have one connection
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        assertConnectionCount(e3, 2);  // we have two.  etc (default was one. this proves max is working).
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var e5 = _jsPlumb.addEndpoint(d3, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e5, targetEndpoint: e4});
        assertConnectionCount(e4, 3);
    });


    test(': endpoint.isConnectdTo', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var e3 = _jsPlumb.addEndpoint(d3, {isSource: true, maxConnections: -1});
        var e4 = _jsPlumb.addEndpoint(d4, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e3, targetEndpoint: e4});
        ok(e3.isConnectedTo(e4), "e3 is connected to e4");
        ok(e4.isConnectedTo(e3), "e4 is connected to e3");
    });

// ************** ANCHORS ********************************************	

    test(': anchors equal', function () {
        var a1 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
        var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
        ok(a1.equals(a2), "anchors are the same");
    });

    test(': anchors equal with offsets', function () {
        var a1 = _jsPlumb.makeAnchor([0, 1, 1, 1, 10, 13], null, _jsPlumb);
        var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1, 10, 13], null, _jsPlumb);
        ok(a1.equals(a2), "anchors are the same");
    });

    test(': anchors not equal', function () {
        var a1 = _jsPlumb.makeAnchor([0, 1, 0, 1], null, _jsPlumb);
        var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
        ok(!a1.equals(a2), "anchors are different");
    });

    test(': anchor not equal with offsets', function () {
        var a1 = _jsPlumb.makeAnchor([0, 1, 1, 1, 10, 13], null, _jsPlumb);
        var a2 = _jsPlumb.makeAnchor([0, 1, 1, 1], null, _jsPlumb);
        ok(!a1.equals(a2), "anchors are different");
    });

    test('simple makeAnchor, dynamicAnchors', function () {
        expect(0);
        var spec = [
            [0.2, 0, 0, -1],
            [1, 0.2, 1, 0],
            [0.8, 1, 0, 1],
            [0, 0.8, -1, 0]
        ];
        _jsPlumb.makeAnchor(spec);
    });

    test(": unknown anchor type should throw Error", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.connect({source: "d1", target: "d2", anchor: "FOO"});
        }
        catch (e) {
            // ok	
            ok(e.msg == "jsPlumb: unknown anchor type 'FOO'", "useful error message");
        }
    });

    test(": unknown anchor type should not throw Error because it is suppressed in Defaults", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.Defaults.DoNotThrowErrors = true;
            _jsPlumb.connect({source: "d1", target: "d2", anchor: "FOO"});
        }
        catch (e) {
            // ok	
            ok(e.msg != "jsPlumb: unknown anchor type 'FOO'", "no error message");
        }
    });

    test(": unknown endpoint type should throw Error", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.Defaults.DoNotThrowErrors = false;
            _jsPlumb.connect({source: "d1", target: "d2", endpoint: "FOO"});
        }
        catch (e) {
            // ok	
            ok(e.msg == "jsPlumb: unknown endpoint type 'FOO'", "useful error message");
        }
    });

    test(": unknown endpoint type should not throw Error because it is suppressed in Defaults", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.Defaults.DoNotThrowErrors = true;
            _jsPlumb.connect({source: "d1", target: "d2", endpoint: "FOO"});
        }
        catch (e) {
            // ok	
            ok(e.msg != "jsPlumb: unknown endpoint type 'FOO'", "no error message");
        }
    });

    test(": unknown connector type should throw Error", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.Defaults.DoNotThrowErrors = false;
            _jsPlumb.connect({source: "d1", target: "d2", connector: "FOO"});
        }
        catch (e) {
            // ok	
            ok(e.msg == "jsPlumb: unknown connector type 'FOO'", "useful error message");
        }
    });

    test(": unknown connector type should not throw Error because it is suppressed in Defaults", function () {
        try {
            support.addDiv("d1");
            support.addDiv("d2");
            _jsPlumb.Defaults.DoNotThrowErrors = true;
            _jsPlumb.connect({source: "d1", target: "d2", connector: "FOO"});
        }
        catch (e) {
            // ok	
            ok(e.msg != "jsPlumb: unknown connector type 'FOO'", "no error message");
        }
    });

// ************** / ANCHORS ********************************************


// **************************** DETACHING CONNECTIONS ****************************************************


    test(': deleteConnection does not fail when no arguments are provided', function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.connect({source: d3, target: d4});
        _jsPlumb.deleteConnection();
        expect(0);
    });

    // test that detach does not fire an event by default
    test(': _jsPlumb.detach should fire detach event by default', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // test that detach does not fire an event by default
    test(': _jsPlumb.detach should fire detach event by default, using params object', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // test that detach fires an event when instructed to do so
    test(': _jsPlumb.detach should not fire detach event when instructed to not do so', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn, {fireEvent: false});
        equal(eventCount, 0);
    });

    // issue 81
    test(': _jsPlumb.detach should fire only one detach event (pass Connection as argument)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // issue 81
    test(': _jsPlumb.detach should fire only one detach event (pass Connection as param in argument)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.deleteConnection(conn);
        equal(eventCount, 1);
    });

    // issue 81
    test(': delete should fire only one detach event (pass source and targets as strings as arguments in params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.select({source: "d5", target: "d6"}).delete();
        equal(eventCount, 1);
    });

    // issue 81
    test(': detach should fire only one detach event (pass source and targets as divs as arguments in params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        var conn = _jsPlumb.connect({source: d5, target: d6});
        var eventCount = 0;
        _jsPlumb.bind("connectionDetached", function (c) {
            eventCount++;
        });
        _jsPlumb.select({source: d5, target: d6}).delete();
        equal(eventCount, 1);
    });

    //TODO make sure you run this test with a single detach call, to ensure that
    // single detach calls result in the connection being removed. detachEveryConnection can
    // just blow away the connectionsByScope array and recreate it.
    test(': getConnections (simple case, default scope)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        _jsPlumb.connect({source: d5, target: d6});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 1, "there is one connection");
    });

    test(': getConnections (simple case, multiple targets, default scope)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d5, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 2, "there are two connections");
    });

    test('getConnections (uuids)', function () {
        var d5 = support.addDiv("d5"),
            d6 = support.addDiv("d6"),
            e5 = _jsPlumb.addEndpoint(d5, {uuid:"foo"}),
            e6 = _jsPlumb.addEndpoint(d6, {uuid:"bar"});
        _jsPlumb.connect({uuids:["foo", "bar"]});
        var c = _jsPlumb.getConnections();  // will get all connections in the default scope.
        equal(c.length, 1, "there is one connection");
        equal(c[0].getUuids()[0], "foo");
        equal(c[0].getUuids()[1], "bar");
    });

    test('getConnections (simple case, default scope; detach by element id using params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: 'd5', target: 'd6'}).delete();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by id using params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: "d5", target: "d6"}).delete();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by element object using params object)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        _jsPlumb.connect({source: d5, target: d6});
        _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.select({source: d5, target: d6}).delete();
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

    test(': getConnections (simple case, default scope; detach by Connection)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6"), d7 = support.addDiv("d7");
        var c56 = _jsPlumb.connect({source: d5, target: d6});
        var c67 = _jsPlumb.connect({source: d6, target: d7});
        var c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 2, "there are two connections initially");
        _jsPlumb.deleteConnection(c56);
        c = _jsPlumb.getConnections();  // will get all connections
        equal(c.length, 1, "after detaching one, there is now one connection.");
    });

// beforeDetach functionality

    test(": detach; beforeDetach on connect call returns false", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            return false;
        }});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        equal(beforeDetachCount, 0, "jsplumb before detach was not called");
    });

    test(": detach; beforeDetach on connect call returns undefined", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) { }});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on connect call returns true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            return true;
        }});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on connect call throws an exception; we treat it with the contempt it deserves and pretend it said the detach was ok.", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, beforeDetach: function (conn) {
            throw "i am an example of badly coded beforeDetach, but i don't break jsPlumb ";
        }});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": detach; beforeDetach on addEndpoint call to source Endpoint returns false", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true, beforeDetach: function (conn) {
                return false;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            beforeDetachCount++;
        });
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        equal(beforeDetachCount, 0, "jsplumb before detach was not called");
    });

    test(": detach; beforeDetach on addEndpoint call to source Endpoint returns true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true, beforeDetach: function (conn) {
                return true;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
    });


    test(": Endpoint.detach; beforeDetach on addEndpoint call to source Endpoint returns false; Endpoint.detach returns false too (the UI needs it to)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true, beforeDetach: function (conn) {
                return false;
            } }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection initially");
        var success = _jsPlumb.deleteConnection(c);
        equal(c.endpoints[0].connections.length, 1, "source endpoint has a connection after detach call was denied");
        ok(!success, "Endpoint reported detach did not execute");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns false", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection after detach call was denied");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns false but detach is forced", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c, {force: true});
        equal(c.endpoints, null, "connection's endpoints were removed");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach on addEndpoint call to target Endpoint returns true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return true;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach bound to _jsPlumb returns false", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        var beforeDetachCount = 0;
        _jsPlumb.bind("beforeDetach", function (connection) {
            ok(connection.sourceId === "d1", "connection is provided and configured with correct source");
            ok(connection.targetId === "d2", "connection is provided and configured with correct target");
            beforeDetachCount++;
            return false;
        });
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection after detach call was denied");
        equal(beforeDetachCount, 1, "beforeDetach was called only one time");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach bound to _jsPlumb returns true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        _jsPlumb.bind("beforeDetach", function (connection) {
            ok(connection.sourceId === "d1", "connection is provided and configured with correct source");
            ok(connection.targetId === "d2", "connection is provided and configured with correct target");
            return true;
        });
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnection(c);
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteConnection; beforeDetach bound to _jsPlumb returns false", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        _jsPlumb.bind("beforeDetach", function (connection) {
            return false;
        });
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        var deleted = _jsPlumb.deleteConnection(c);
        equal(e1.connections.length, 1, "source endpoint's connection was not removed");
        equal(deleted, false, "deleteConnection reports connection not deleted");
    });

    test("Endpoint.deleteEveryConnection", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");

        e1.deleteEveryConnection();
        equal(_jsPlumb.select().length, 0, "there are no connections in the instance");
    });

    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on addEndpoint call to target Endpoint returns true so we detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return true;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(_jsPlumb.select().length, 0, "there are no connections in the instance");
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on addEndpoint call to target Endpoint returns false so we do not detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.select().length, 1, "there is one connection in the instance");
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(_jsPlumb.select().length, 1, "there is still 1 connection in the instance");
        equal(c.endpoints.length, 2, "connection's endpoints are in place");
        equal(e1.connections.length, 1, "source endpoint has one connection");
        equal(e2.connections.length, 1, "target endpoint has one connection");
    });
//
    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on jsPlumb returns false and we dont detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return false;
        });
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has a connection");
        equal(e2.connections.length, 1, "target endpoint has a connection");
    });
//
    test(": _jsPlumb.deleteConnectionsForElement ; beforeDetach on jsPlumb returns true and we do detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return true;
        });
        _jsPlumb.deleteConnectionsForElement(d1);
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on jsPlumb returns false and we dont detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return false;
        });
        _jsPlumb.deleteEveryConnection();
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has a connection");
        equal(e2.connections.length, 1, "target endpoint has a connection");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on jsPlumb returns true and we do detach", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return true;
        });
        _jsPlumb.deleteEveryConnection();
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on jsPlumb returns true but we have forced deletion of the connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.bind("beforeDetach", function (conn) {
            return false;
        });
        var deletedCount = _jsPlumb.deleteEveryConnection({force: true});
        equal(c.endpoints, null, "connection's endpoints were removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
        equal(deletedCount, 1, "deleteEveryConnection reports one connection deleted");
    });

    test(": _jsPlumb.deleteEveryConnection ; beforeDetach on addEndpoint call to target Endpoint returns false so we do not delete the connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        _jsPlumb.deleteEveryConnection();
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has 1 connection");
        equal(e2.connections.length, 1, "target endpoint has 1 connection");
        equal(_jsPlumb.select().length, 1, "one connection in the instance");
    });

    test(": Endpoint.deleteEveryConnection ; beforeDetach on addEndpoint call to target Endpoint returns false so we dont delete the connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        e1.deleteEveryConnection();
        equal(c.endpoints.length, 2, "connection's endpoints were not removed");
        equal(e1.connections.length, 1, "source endpoint has one connection");
        equal(e2.connections.length, 1, "target endpoint has one connection");
    });

    test(": Endpoint.deleteEveryConnection ; beforeDetach on addEndpoint call to target Endpoint returns false but force is true so we delete the connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource: true }),
            e2 = _jsPlumb.addEndpoint(d2, { isTarget: true, beforeDetach: function (conn) {
                return false;
            } });
        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.endpoints[1].connections.length, 1, "target endpoint has a connection initially");
        e1.deleteEveryConnection({force:true});
        equal(c.endpoints, null, "connection's endpoints were not removed");
        equal(e1.connections.length, 0, "source endpoint has no connections");
        equal(e2.connections.length, 0, "target endpoint has no connections");
    });

// ******** end of beforeDetach tests **************

// detachEveryConnection/detachAllConnections fireEvent overrides tests

    test(": _jsPlumb.deleteEveryConnection fires events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0;
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connectionDetached", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections registered");
        _jsPlumb.deleteEveryConnection();
        equal(connCount, 0, "no connections registered");
    });


    test(": _jsPlumb.deleteEveryConnection doesn't fire events when instructed not to", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0;
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connectionDetached", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections registered");
        _jsPlumb.deleteEveryConnection({fireEvent: false});
        equal(connCount, 2, "two connections registered");
    });

    test(": _jsPlumb.deleteConnectionsForElement fires events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0,
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connectionDetached", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections registered");
        _jsPlumb.deleteConnectionsForElement("d1");
        equal(connCount, 0, "no connections registered after delete connections for element");
    });

    test(": _jsPlumb.deleteConnectionsForElement doesn't fire events when instructed not to", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), connCount = 0,
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.bind("connection", function () {
            connCount++;
        });
        _jsPlumb.bind("connectionDetached", function () {
            connCount--;
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        equal(connCount, 2, "two connections counted by event listener");
        _jsPlumb.deleteConnectionsForElement("d1", {fireEvent: false});
        equal(connCount, 2, "two connections still registered by event listener");
    });

// **************************** / DETACHING CONNECTIONS ****************************************************    

    test(" : deletions, simple endpoint case", function () {

        // 1. simplest case - an endpoint that exists on some element.		
        var d1 = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d1);
            //dt = _jsPlumb.deleteObject({endpoint: e});

        equal(_jsPlumb.selectEndpoints().length, 1, "1 endpoint registered");
        _jsPlumb.deleteEndpoint(e);
        equal(_jsPlumb.selectEndpoints().length, 0, "0 endpoints registered");

//        equal(jsPlumbUtil.isEmpty(dt.endpoints), false, "one endpoint to delete");
//        equal(dt.endpointCount, 1, "one endpoint to delete");
//        equal(jsPlumbUtil.isEmpty(dt.connections), true, "zero connections to delete");
//        equal(dt.connectionCount, 0, "zero connections to delete");

        // 2. create two endpoints and connect them, then delete one. the other endpoint should
        // still exist.
        var d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e2 = _jsPlumb.addEndpoint(d2),
            e3 = _jsPlumb.addEndpoint(d3);

        _jsPlumb.connect({source: e2, target: e3});

        equal(_jsPlumb.select({source: d2}).length, 1, "one connection exists");
//
        equal(_jsPlumb.getEndpoints(d3).length, 1, "one endpoint on d3");
        _jsPlumb.deleteEndpoint(e2);
//        var dt2 = _jsPlumb.deleteObject({endpoint: e2});
//        equal(jsPlumbUtil.isEmpty(dt2.endpoints), false, "one endpoint to delete");
//        equal(jsPlumbUtil.isEmpty(dt2.connections), false, "one connection to delete");
        equal(_jsPlumb.select({source: d2}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d2).length, 0, "zero endpoints on d2");
        equal(_jsPlumb.getEndpoints(d3).length, 1, "one endpoint on d3");
//
//        // 3. create two endpoints and connect them, then detach the connection. the two endpoints
//        // should still exist, because they did not set `deleteOnEmpty`.
        var d4 = support.addDiv("d4"), d5 = support.addDiv("d5"),
            e4 = _jsPlumb.addEndpoint(d4),
            e5 = _jsPlumb.addEndpoint(d5);

        var c = _jsPlumb.connect({source: e4, target: e5});
        equal(_jsPlumb.select({source: d4}).length, 1, "one connection exists");
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select({source: d4}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d4).length, 1, "one endpoint on d4");
        equal(_jsPlumb.getEndpoints(d5).length, 1, "one endpoint on d5");

        // set deleteOnEmpty on e4
        e4.setDeleteOnEmpty(true);

        // 4. same as (3) but now deleteOnEmpty is set on e4
        c = _jsPlumb.connect({source: e4, target: e5});
        equal(_jsPlumb.select({source: d4}).length, 1, "one connection exists between e4 and e5");
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.select({source: d4}).length, 0, "zero connections exist after connection delete");
        equal(_jsPlumb.getEndpoints(d4).length, 0, "no endpoints on d4");
        equal(_jsPlumb.getEndpoints(d5).length, 1, "one endpoint on d5");
//
//        // 5.set deleteEndpointsOnDetach on the connect call, then delete the connection.
        var d6 = support.addDiv("d6"), d7 = support.addDiv("d7");

        var c2 = _jsPlumb.connect({source: d6, target: d7, deleteEndpointsOnEmpty: true});
        equal(_jsPlumb.select({source: d6}).length, 1, "one connection exists");
        _jsPlumb.deleteConnection(c2);
//

        equal(_jsPlumb.select({source: d6}).length, 0, "zero connections exist");
        equal(_jsPlumb.getEndpoints(d6).length, 0, "no endpoints on d6");
        equal(_jsPlumb.getEndpoints(d7).length, 0, "no endpoints on d7");

    });


    test(': getConnections (scope testScope)', function () {
        var d5 = support.addDiv("d5"), d6 = support.addDiv("d6");
        _jsPlumb.connect({source: d5, target: d6, scope: 'testScope'});
        var c = _jsPlumb.getConnections("testScope");  // will get all connections in testScope	
        equal(c.length, 1, "there is one connection");
        equal(c[0].sourceId, 'd5', "the connection's source is d5");
        equal(c[0].targetId, 'd6', "the connection's source is d6");
        c = _jsPlumb.getConnections();  // will get all connections in default scope; should be none.
        equal(c.length, 0, "there are no connections in the default scope");
    });

    test(': _jsPlumb.getAllConnections (filtered by scope)', function () {
        var d8 = support.addDiv("d8"), d9 = support.addDiv("d9"), d10 = support.addDiv('d10');
        _jsPlumb.connect({source: d8, target: d9, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d10}); // default scope
        var c = _jsPlumb.getAllConnections();  // will get all connections	
        equal(c.length, 2, "all connections has two entries");
        // now supply a list of scopes
        c = _jsPlumb.getConnections();
        equal(c.length, 1, "1 connection in default scope");
        c = _jsPlumb.getConnections("testScope");
        equal(c.length, 1, "there is one connection in 'testScope'");
    });

    test(': _jsPlumb.getConnections (filtered by scope and sourceId)', function () {
        var d8 = support.addDiv("d8"), d9 = support.addDiv("d9"), d10 = support.addDiv('d10');
        _jsPlumb.connect({source: d8, target: d9, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d8, scope: 'testScope'});
        _jsPlumb.connect({source: d9, target: d10}); // default scope
        var c = _jsPlumb.getConnections({scope: 'testScope', source: 'd8'});  // will get all connections with sourceId 'd8'	
        equal(c.length, 1, "there is one connection in 'testScope' from d8");
    });

    test(': _jsPlumb.getConnections (filtered by scope, source id and target id)', function () {
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope'});
        var c = _jsPlumb.getConnections({scope: 'testScope', source: 'd11', target: 'd13'});
        equal(c.length, 1, "there is one connection from d11 to d13");
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes)', function () {
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope2'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope3'});
        var c = _jsPlumb.getConnections({scope: ['testScope', 'testScope3']});
        equal(c['testScope'].length, 1, 'there is one connection in testScope');
        equal(c['testScope3'].length, 1, 'there is one connection in testScope3');
        equal(c['testScope2'], null, 'there are no connections in testScope2');
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes and source ids)', function () {
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13');
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d13, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope2'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope3'});
        var c = _jsPlumb.getConnections({scope: ['testScope', 'testScope3'], source: ['d11']});
        equal(c['testScope'].length, 1, 'there is one connection in testScope');
        equal(c['testScope3'].length, 1, 'there is one connection in testScope3');
        equal(c['testScope2'], null, 'there are no connections in testScope2');
    });

    test(': _jsPlumb.getConnections (filtered by a list of scopes, source ids and target ids)', function () {
        _jsPlumb.deleteEveryConnection();
        var d11 = support.addDiv("d11"), d12 = support.addDiv("d12"), d13 = support.addDiv('d13'), d14 = support.addDiv("d14"), d15 = support.addDiv("d15");
        _jsPlumb.connect({source: d11, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d13, target: d12, scope: 'testScope'});
        _jsPlumb.connect({source: d11, target: d14, scope: 'testScope'});
        _jsPlumb.connect({source: d11, target: d15, scope: 'testScope'});
        _jsPlumb.connect({source: d12, target: d13, scope: 'testScope2'});
        _jsPlumb.connect({source: d11, target: d13, scope: 'testScope3'});
        var c = _jsPlumb.getConnections({scope: ['testScope', 'testScope3'], source: ['d11'], target: ['d14', 'd15']});
        equal(c['testScope'].length, 2, 'there are two connections in testScope');
        equal(c['testScope3'], null, 'there are no connections in testScope3');
        equal(c['testScope2'], null, 'there are no connections in testScope2');
        var anEntry = c['testScope'][0];
        ok(anEntry.endpoints[0] != null, "Source endpoint is set");
        ok(anEntry.endpoints[1] != null, "Target endpoint is set");
        equal(anEntry.source.getAttribute("id"), "d11", "Source is div d11");
        equal(anEntry.target.getAttribute("id"), "d14", "Target is div d14");
    });

    test(': getEndpoints, one Endpoint added by addEndpoint, get Endpoints by selector', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addEndpoint(d1);
        var e = _jsPlumb.getEndpoints(d1);
        equal(e.length, 1, "there is one endpoint for element d1");
    });

    test(': getEndpoints, one Endpoint added by addEndpoint, get Endpoints by id', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.addEndpoint(d1);
        var e = _jsPlumb.getEndpoints("d1");
        equal(e.length, 1, "there is one endpoint for element d1");
    });

    test(': addEndpoint, css class on anchor added to endpoint artefact and element', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var ep = _jsPlumb.addEndpoint(d1, { anchor: [0, 0, 1, 1, 0, 0, "foo" ]});
        ok(jsPlumb.hasClass(ep.canvas, "jtk-endpoint-anchor-foo"), "class set on endpoint");
        ok(jsPlumb.hasClass(d1, "jtk-endpoint-anchor-foo"), "class set on element");
        _jsPlumb.deleteEndpoint(ep);
        ok(!jsPlumb.hasClass(d1, "jtk-endpoint-anchor-foo"), "class removed from element");
    });

    test(': addEndpoint, blank css class on anchor does not add extra prefix ', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var ep = _jsPlumb.addEndpoint(d1, { anchor: [0, 0, 1, 1, 0, 0  ]});
        ok(jsPlumb.hasClass(ep.canvas, "jtk-endpoint-anchor"), "class set on endpoint");
        ok(jsPlumb.hasClass(d1, "jtk-endpoint-anchor"), "class set on element");
        _jsPlumb.deleteEndpoint(ep);
        ok(!jsPlumb.hasClass(d1, "jtk-endpoint-anchor"), "class removed from element");
    });

    test(': connect, jsplumb connected class added to elements', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        // connect two elements and check they both get the class.
        var c = _jsPlumb.connect({source:d1, target:d2});
        ok(jsPlumb.hasClass(d1, "jtk-connected"), "class set on element d1");
        ok(jsPlumb.hasClass(d2, "jtk-connected"), "class set on element d2");
        // connect d1 to another element and check d3 gets the class
        var c2 = _jsPlumb.connect({source:d1, target:d3});
        ok(jsPlumb.hasClass(d3, "jtk-connected"), "class set on element d3");
        // now disconnect original connection. d2 should no longer have the class, but d1 should, since it has
        // still one connection.
        _jsPlumb.deleteConnection(c);
        ok(jsPlumb.hasClass(d1, "jtk-connected"), "class still on element d1");
        ok(!jsPlumb.hasClass(d2, "jtk-connected"), "class removed from element d2");
        _jsPlumb.deleteConnection(c2);
        ok(!jsPlumb.hasClass(d1, "jtk-connected"), "class removed from element d1");
        ok(!jsPlumb.hasClass(d3, "jtk-connected"), "class removed from element d3");
    });

    test(': connection event listeners', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connection", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var c = _jsPlumb.connect({source: d1, target: d2});
        ok(returnedParams != null, "new connection listener event was fired");
        ok(returnedParams.connection != null, 'connection is set');
        equal(returnedParams.sourceId, "d1", 'sourceid is set');
        equal(returnedParams.targetId, "d2", 'targetid is set');
        equal(returnedParams.source.getAttribute("id"), "d1", 'source is set');
        equal(returnedParams.target.getAttribute("id"), "d2", 'target is set');
        ok(returnedParams.sourceEndpoint != null, "source endpoint is not null");
        ok(returnedParams.targetEndpoint != null, "target endpoint is not null");
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.deleteConnection(c);
        ok(returnedParams.connection != null, 'connection is set');
    });

    test(': detach event listeners (detach by connection)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.deleteConnection(conn);
        ok(returnedParams != null, "removed connection listener event was fired");
        ok(returnedParams.connection != null, "removed connection listener event passed in connection");
    });

    test(': detach event listeners (detach by element ids)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: "d1", target: "d2"}).delete();
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (detach by elements)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).delete();
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via jsPlumb.deleteConnection method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        _jsPlumb.deleteConnection(conn);
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via Endpoint.detachFrom method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        e1.detachFrom(e2);
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via Endpoint.deleteEveryConnection method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        e1.deleteEveryConnection();
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (via _jsPlumb.deleteEndpoint method)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2});
        _jsPlumb.deleteEndpoint(e1);
        ok(returnedParams != null, "removed connection listener event was fired");
    });

    test(': detach event listeners (ensure cleared by _jsPlumb.reset)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null;
        _jsPlumb.bind("connectionDetached", function (params) {
            returnedParams = jsPlumb.extend({}, params);
        });
        var conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).delete();
        ok(returnedParams != null, "removed connection listener event was fired");
        returnedParams = null;

        _jsPlumb.reset();
        conn = _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.select({source: d1, target: d2}).delete();
        ok(returnedParams == null, "connection listener was cleared by _jsPlumb.reset()");
        equal(_jsPlumb.select({source: d1}).length, 0, "no connections from d1 after detach with two connections as arguments");
    });

    test(': connection events that throw errors', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var returnedParams = null, returnedParams2 = null;
        _jsPlumb.bind("connection", function (params) {
            returnedParams = jsPlumb.extend({}, params);
            throw "oh no!";
        });
        _jsPlumb.connect({source: d1, target: d2});
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.connect({source: d3, target: d4});
        ok(returnedParams != null, "new connection listener event was fired; we threw an error, _jsPlumb survived.");
    });

    test(': unbinding connection event listeners, connection', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var count = 0;
        _jsPlumb.bind("connection", function (params) {
            count++;
        });
        var c = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 1, "received one event");
        _jsPlumb.unbind("connection");
        var c2 = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 1, "still received only one event");

        _jsPlumb.bind("connectionDetached", function (params) {
            count--;
        });
        _jsPlumb.deleteConnection(c);
        ok(count == 0, "count of events is now zero");
    });

    test(': unbinding connection event listeners, detach', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var count = 0;
        _jsPlumb.bind("connection", function (params) {
            count++;
        });
        var c = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 1, "received one event");
        var c2 = _jsPlumb.connect({source: d1, target: d2});
        ok(count == 2, "received two events");

        _jsPlumb.bind("connectionDetached", function (params) {
            count--;
        });
        _jsPlumb.deleteConnection(c);
        ok(count == 1, "count of events is now one");
        _jsPlumb.unbind("connectionDetached");
        _jsPlumb.deleteConnection(c2);
        ok(count == 1, "count of events is still one");
    });

    test(': unbinding connection event listeners, all listeners', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var count = 0;
        _jsPlumb.bind("connection", function (params) {
            count++;
        });
        var c = _jsPlumb.connect({source: d1, target: d2}),
            c2 = _jsPlumb.connect({source: d1, target: d2}),
            c3 = _jsPlumb.connect({source: d1, target: d2});

        ok(count == 3, "received three events");

        _jsPlumb.bind("connectionDetached", function (params) {
            count--;
        });
        _jsPlumb.deleteConnection(c);
        ok(count == 2, "count of events is now two");

        _jsPlumb.unbind();  // unbind everything

        _jsPlumb.deleteConnection(c2);
        _jsPlumb.deleteConnection(c3);
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d2});

        ok(count == 2, "count of events is still two");
    });

    test(": Endpoint.detachFrom", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var conn = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionCount(e16, 1);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        e16.detachFrom(e17);
        // but the connection should be gone, meaning not registered by _jsPlumb and not registered on either Endpoint:
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    test(": Endpoint.detachFromConnection", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var conn = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionCount(e16, 1);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        e16.detachFromConnection(conn);
        // but endpoint e16 should have no connections now.
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
    });

    test(": Endpoint.detachAll", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var e16 = _jsPlumb.addEndpoint("d16", {isSource: true, maxConnections: -1});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint("d17", {isSource: true});
        var e18 = _jsPlumb.addEndpoint("d18", {isSource: true});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e18});
        assertConnectionCount(e16, 2);
        assertConnectionCount(e17, 1);
        assertConnectionCount(e18, 1);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 2, _jsPlumb);
        e16.deleteEveryConnection();
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    test(": Endpoint.detach", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var conn = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionCount(e16, 1);
        assertConnectionCount(e17, 1);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        _jsPlumb.deleteConnection(conn);
        // but the connection should be gone, meaning not registered by _jsPlumb and not registered on either Endpoint:
        assertConnectionCount(e16, 0);
        assertConnectionCount(e17, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    test("Image Endpoint remove", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.makeSource(d1, {
            endpoint:[ "Image", { src:"atom.png" }]
        });

        _jsPlumb.makeTarget(d2, {
            endpoint:[ "Image", { src:"atom.png" }]
        });

        var c = _jsPlumb.connect({source:d1, target:d2});
        var ep = c.endpoints[0];

        ok(ep.canvas.parentNode != null, "endpoint 1 is in the DOM");

        _jsPlumb.deleteConnection(c);
        ok(ep.canvas.parentNode == null, "endpoint 1 is no longer in the DOM");
    });

    // Some race condition causes this to fail randomly.
    // asyncTest(" jsPlumbUtil.setImage on Endpoint, with supplied onload", function() {
    // var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
    // e = {
    // endpoint:[ "Image", {
    // src:"../demo/home/endpointTest1.png",
    // onload:function(imgEp) {
    // _jsPlumb.repaint("d1");
    // ok(imgEp._jsPlumb.img.src.indexOf("endpointTest1.png") != -1, "image source is correct");
    // ok(imgEp._jsPlumb.img.src.indexOf("endpointTest1.png") != -1, "image elementsource is correct");

    // imgEp.canvas.setAttribute("id", "iwilllookforthis");

     //_jsPlumb.removeAllEndpoints("d1");
    // ok(document.getElementById("iwilllookforthis") == null, "image element was removed after remove endpoint");
    // }
    // } ]
    // };
    // start();
    // _jsPlumb.addEndpoint(d1, e);
    // expect(3);
    // });

    test(": setting endpoint uuid", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        equal(e16.getUuid(), uuid, "endpoint's uuid was set correctly");
    });

    test(": _jsPlumb.getEndpoint (by uuid)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
    });

    test(": _jsPlumb.deleteEndpoint (by uuid, simple case)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
        _jsPlumb.deleteEndpoint(uuid);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
        var ebe = _jsPlumb.getEndpoints("d16");
        equal(ebe.length, 0, "no endpoints registered for element d16 anymore");
    });


    test(": deleteEndpoint (by uuid, connections too)", function () {
        // create two endpoints (one with a uuid), add them to two divs and then connect them.
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        // check that the connection was ok.
        equal(e16.connections.length, 1, "e16 has one connection");
        equal(e17.connections.length, 1, "e17 has one connection");

        // delete the endpoint that has a uuid.  verify that the endpoint cannot be retrieved and that the connection has been removed, but that
        // element d17 still has its Endpoint.
        _jsPlumb.deleteEndpoint(uuid);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
        equal(e16.connections.length, 0, "e16 has no connections");
        equal(e17.connections.length, 0, "e17 has no connections");
        var ebe = _jsPlumb.getEndpoints("d16");
        equal(ebe.length, 0, "no endpoints registered for element d16 anymore");
        ebe = _jsPlumb.getEndpoints("d17");
        equal(ebe.length, 1, "element d17 still has its Endpoint");

        // now delete d17's endpoint and check that it has gone.
        _jsPlumb.deleteEndpoint(e17);
        f = _jsPlumb.getEndpoint(e17);
        equal(f, null, "endpoint has been deleted");
        ebe = _jsPlumb.getEndpoints("d17");
        equal(ebe.length, 0, "element d17 no longer has any Endpoints");
    });

    test(": deleteEndpoint (by reference, simple case)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");
        _jsPlumb.deleteEndpoint(e16);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
    });

    test(": _jsPlumb.deleteEndpoint (by reference, connections too)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(e16.connections.length, 1, "e16 has one connection");
        equal(e17.connections.length, 1, "e17 has one connection");

        _jsPlumb.deleteEndpoint(e16);
        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint has been deleted");
        equal(e16.connections.length, 0, "e16 has no connections");
        equal(e17.connections.length, 0, "e17 has no connections");
    });

    test(": _jsPlumb.deleteEveryEndpoint", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");

        _jsPlumb.deleteEveryEndpoint();

        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint e16 has been deleted");
        var g = _jsPlumb.getEndpoint(e17);
        equal(g, null, "endpoint e17 has been deleted");
    });

    test(": _jsPlumb.deleteEveryEndpoint (connections too)", function () {
        var uuid = "14785937583175927504313";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, maxConnections: -1, uuid: uuid});
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        var e = _jsPlumb.getEndpoint(uuid);
        equal(e.getUuid(), uuid, "retrieved endpoint by uuid");

        _jsPlumb.deleteEveryEndpoint();

        var f = _jsPlumb.getEndpoint(uuid);
        equal(f, null, "endpoint e16 has been deleted");
        var g = _jsPlumb.getEndpoint(e17);
        equal(g, null, "endpoint e17 has been deleted");
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    test(": removeAllEndpoints, referenced as string", function () {
        var d1 = support.addDiv("d1");
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.removeAllEndpoints("d1");
        _jsPlumb.repaintEverything();

        _jsPlumb.addEndpoint(d1);
        equal(_jsPlumb.getEndpoints("d1").length, 1, "one endpoint for the given element");

        expect(1);
    });

    test(": removeAllEndpoints, referenced as selector", function () {
        var d1 = support.addDiv("d1");
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.removeAllEndpoints(d1);

        _jsPlumb.repaintEverything();

        _jsPlumb.addEndpoint(d1);
        equal(_jsPlumb.getEndpoints("d1").length, 1, "one endpoint for the given element");

        expect(1);
    });

    //
    //test(": removeAllEndpoints - element already deleted", function() {
    //var d1 = support.addDiv("d1");
    // _jsPlumb.addEndpoint(d1);
    // _jsPlumb.addEndpoint(d1);
    // _jsPlumb.addEndpoint(d1);

    // d1.remove();
    // _jsPlumb.removeAllEndpoints("d1");
    // _jsPlumb.repaintEverything();

     //expect(0);
    // });

    test(": jsPlumb.remove, element identified by string", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);

        _jsPlumb.remove("d1");

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the given element");
        ok(e1.canvas.parentNode == null, "e1 cleaned up");
    });

    test(": jsPlumb.remove, element identified by selector", function () {
        var d1 = support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d1);

        _jsPlumb.remove(d1);

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the given element");
        ok(e1.canvas.parentNode == null, "e1 cleaned up");
    });

    test(": jsPlumb.remove, element identified by string, nested endpoints", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        d1.appendChild(d2);
        d1.appendChild(d3);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d3);

        ok(_jsPlumb.getEndpoints("d1").length == 1, " 1 endpoint exists for the parent div");
        ok(_jsPlumb.getEndpoints("d2").length == 2, " 2 endpoints exist for the first nested div");
        ok(_jsPlumb.getEndpoints("d3").length == 1, " 1 endpoint exists for the first nested div");

        _jsPlumb.remove("d1");

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the main div");
        equal(_jsPlumb.getEndpoints("d2").length, 0, "no endpoints for the nested div");
        equal(_jsPlumb.getEndpoints("d3").length, 0, "no endpoints for the nested div");

    });

    test(": jsPlumb.remove, nested element, element identified by string, nested endpoints", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        d1.appendChild(d2);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d2);

        _jsPlumb.remove("d2");

        _jsPlumb.repaint("d1"); // shouldn't complain
        _jsPlumb.recalculateOffsets("d1");

        equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the main div");
        equal(_jsPlumb.getEndpoints("d2").length, 0, "no endpoints for the nested div");

        expect(2);
    });

    test("jsPlumb.remove fires connectionDetached events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d3});

        var o = 0;
        _jsPlumb.bind("connectionDetached", function () {
            o++;
        });

        _jsPlumb.remove(d1);
        equal(o, 2, "connectionDetached event was fired twice.");

    });

    test("jsPlumb.removeAllEndpoints fires connectionDetached events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.connect({source: d1, target: d2});
        _jsPlumb.connect({source: d1, target: d3});

        var o = 0;
        _jsPlumb.bind("connectionDetached", function () {
            o++;
        });

        _jsPlumb.removeAllEndpoints(d1);
        equal(o, 2, "connectionDetached event was fired twice.");

    });

    test(": jsPlumb.empty, element identified by string", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        d1.appendChild(d2);
        d1.appendChild(d3);
        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d2);
        _jsPlumb.addEndpoint(d3);

        ok(_jsPlumb.getEndpoints("d1").length == 1, " 1 endpoint exists for the parent div");
        ok(_jsPlumb.getEndpoints("d2").length == 2, " 2 endpoints exist for the first nested div");
        ok(_jsPlumb.getEndpoints("d3").length == 1, " 1 endpoint exists for the first nested div");

        _jsPlumb.empty("d1");

        _jsPlumb.repaintEverything(); // shouldn't complain

        equal(_jsPlumb.getEndpoints("d1").length, 1, " 1 endpoint exists for the parent div");
        equal(_jsPlumb.getEndpoints("d2").length, 0, "no endpoints for the first nested div");
        equal(_jsPlumb.getEndpoints("d3").length, 0, "no endpoints for the second nested div");

    });

    //
     //I'm on the fence about this one.  There is a method you can call to tell jsPlumb that an element
     //has been deleted, so in theory you should not get into a situation where you are doing what this
     //test does.  But you can of course get there accidentally, which is one reason why it would be good
     //for this test to exist.
     //test(": deleting endpoints of deleted element should not fail", function() {
     //var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
     //var ep1 = _jsPlumb.addEndpoint(d1);
     //_jsPlumb.addEndpoint(d1);
     //_jsPlumb.addEndpoint(d1);
     //_jsPlumb.connect({source:ep1, target:"d2"});
     //d1.remove();
     //var eps = _jsPlumb.getEndpoints(d1);
     //equal(eps.length, 3, "there are three endpoints for d1");
     //for (var i = 0; i < eps.length; i++) {
     //_jsPlumb.deleteEndpoint(eps[i]);
     //}
     //eps = _jsPlumb.getEndpoints("d1");
     //equal(eps, null, "there are zero endpoints for d1");
     //equal(_jsPlumb.getEndpoints("d1").length, 0, "no endpoints for the given element");
     //});



    test(": _jsPlumb.addEndpoint (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [0, 0.5, 0, -1]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: "TopCenter"});
        equal(e16.anchor.x, 0);
        equal(e16.anchor.y, 0.5);
        equal(e17.anchor.x, 0.5);
        equal(e17.anchor.y, 0);
    });


    test(": _jsPlumb.addEndpoint (simple case, dynamic anchors)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["TopCenter", "BottomCenter"]});
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.addEndpoint (simple case, two arg method)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchor: [0, 0.5, 0, -1]});
        var e17 = _jsPlumb.addEndpoint(d17, {isTarget: true, isSource: false}, {anchor: "TopCenter"});
        equal(e16.anchor.x, 0);
        equal(e16.anchor.y, 0.5);
        equal(false, e16.isTarget);
        equal(true, e16.isSource);
        equal(e17.anchor.x, 0.5);
        equal(e17.anchor.y, 0);
        equal(true, e17.isTarget);
        equal(false, e17.isSource);
    });


    test(": _jsPlumb.addEndpoints (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoints(d16, [
            {isSource: true, isTarget: false, anchor: [0, 0.5, 0, -1] },
            { isTarget: true, isSource: false, anchor: "TopCenter" }
        ]);
        equal(e16[0].anchor.x, 0);
        equal(e16[0].anchor.y, 0.5);
        equal(false, e16[0].isTarget);
        equal(true, e16[0].isSource);
        equal(e16[1].anchor.x, 0.5);
        equal(e16[1].anchor.y, 0);
        equal(true, e16[1].isTarget);
        equal(false, e16[1].isSource);
    });


    test(": _jsPlumb.addEndpoint (empty array)", function () {
        _jsPlumb.addEndpoint([], {isSource: true});
        _jsPlumb.repaintEverything();
        expect(0);
    });

    test(": _jsPlumb.addEndpoints (with reference params)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var refParams = {anchor: "RightMiddle"};
        var e16 = _jsPlumb.addEndpoints(d16, [
            {isSource: true, isTarget: false},
            { isTarget: true, isSource: false }
        ], refParams);
        equal(e16[0].anchor.x, 1);
        equal(e16[0].anchor.y, 0.5);
        equal(false, e16[0].isTarget);
        equal(true, e16[0].isSource);
        equal(e16[1].anchor.x, 1);
        equal(e16[1].anchor.y, 0.5);
        equal(true, e16[1].isTarget);
        equal(false, e16[1].isSource);
    });

    test(": _jsPlumb.addEndpoint (simple case, dynamic anchors, two arg method)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {isTarget: true, isSource: false}, {anchor: ["TopCenter", "BottomCenter"]});
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.Defaults.Overlays = [
            [ "Label", { id: "label" } ]
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
    });



    test(": _jsPlumb.addEndpoints (default overlays)", function () {
        _jsPlumb.Defaults.Overlays = [
            [ "Label", { id: "label" } ]
        ];
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {
                overlays: [
                    ["Label", { id: "label2", location: [ 0.5, 1 ] } ]
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d17);

        ok(e1.getOverlay("label") != null, "endpoint 1 has overlay from defaults");
        ok(e1.getOverlay("label2") != null, "endpoint 1 has overlay from addEndpoint call");
    });

    test(": _jsPlumb.addEndpoints (end point set label)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16),
            e2 = _jsPlumb.addEndpoint(d17);

        e1.setLabel("FOO");
        equal(e1.getLabel(), "FOO", "endpoint's label is correct");
    });

    test(": _jsPlumb.addEndpoints (end point set label in constructor, as string)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {label: "FOO"}),
            e2 = _jsPlumb.addEndpoint(d17);

        equal(e1.getLabel(), "FOO", "endpoint's label is correct");
    });



    test(": _jsPlumb.addEndpoints (end point set label in constructor, as function)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e1 = _jsPlumb.addEndpoint(d16, {label: function () {
                return "BAZ";
            }, labelLocation: 0.1}),
            e2 = _jsPlumb.addEndpoint(d17);

        equal(e1.getLabel()(), "BAZ", "endpoint's label is correct");
        equal(e1.getLabelOverlay().getLocation(), 0.1, "endpoint's label's location is correct");
    });

    test(": jsPlumb.addEndpoint (events)", function () {
        var d16 = support.addDiv("d16"),
            click = 0,
            e16 = _jsPlumb.addEndpoint(d16, {
                isSource: true,
                isTarget: false,
                anchor: [0, 0.5, 0, -1],
                events: {
                    click: function (ep) {
                        click++;
                    }
                }
            });
        e16.fire("click", function () {
            click++;
        });
        equal(click, 1, "click event was fired once");
    });


// ***************** setConnector ************************************************************



    test(": setConnector, check the connector is set", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var def = {
            Connector: [ "Bezier", { curviness: 45 } ]
        };
        var j = jsPlumb.getInstance(def);
        var c = j.connect({source: "d1", target: "d2"});
        equal(c.getConnector().type, "Bezier", "connector is the default");
        c.setConnector(["Bezier", { curviness: 789 }]);
        equal(def.Connector[1].curviness, 45, "curviness unchanged by setConnector call");
        j.unbindContainer();
    });

    test(": setConnector, overlays are retained", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var def = {
            Connector: [ "Bezier", { curviness: 45 } ]
        };
        var j = jsPlumb.getInstance(def);
        var c = j.connect({
            source: "d1", target: "d2",
            overlays:[
                [ "Label", { label:"foo" } ]
            ]
        });
        equal(c.getConnector().type, "Bezier", "connector is the default");
        equal(_length(c.getOverlays()), 1, "one overlay on the connector");

        c.setConnector(["StateMachine", { curviness: 789 }]);
        equal(def.Connector[1].curviness, 45, "curviness unchanged by setConnector call");
        equal(_length(c.getOverlays()), 1, "one overlay on the connector");
        j.unbindContainer();
    });




// ******************  makeTarget (and associated methods) tests ********************************************	

    test(": _jsPlumb.makeTarget (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "TopCenter"  });
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
    });

    test(": _jsPlumb.makeTarget (specify two divs in an array)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget([d16, d17], { isTarget: true, anchor: "TopCenter"  });
        equal(true, jsPlumb.hasClass(d16, support.droppableClass));
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
    });

    test(": _jsPlumb.makeTarget (specify two divs by id in an array)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.makeTarget(["d16", "d17"], { isTarget: true, anchor: "TopCenter"  });
        equal(true, jsPlumb.hasClass(d16, support.droppableClass));
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
    });

    test(": _jsPlumb.makeTarget (specify divs by selector)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        jsPlumb.addClass(d16, "FOO");
        jsPlumb.addClass(d17, "FOO");
        _jsPlumb.makeTarget(jsPlumb.getSelector(".FOO"), { isTarget: true, anchor: "TopCenter"  });
        equal(true, jsPlumb.hasClass(d16, support.droppableClass));
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
    });

    test(": _jsPlumb.connect after makeTarget (simple case)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
        _jsPlumb.connect({source: e16, target: "d17"});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e.length, 1, "d17 has one endpoint");
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
    });

    test(": _jsPlumb.connect after makeTarget (simple case, two connect calls)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
        _jsPlumb.connect({source: e16, target: "d17"});
        _jsPlumb.connect({source: e16, target: "d17"});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 2, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
    });

    test(": _jsPlumb.connect after makeTarget (simple case, two connect calls, uniqueEndpoint set)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false, maxConnections: -1}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle", uniqueEndpoint: true, maxConnections: -1  }); // give it a non-default anchor, we will check this below.
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
        _jsPlumb.connect({source: e16, target: "d17"});
        _jsPlumb.connect({source: e16, target: "d17"});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e[0].anchor.x, 0, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].anchor.y, 0.5, "anchor is LeftMiddle"); //here we should be seeing the anchor we setup via makeTarget
        equal(e[0].connections.length, 2, "endpoint on d17 has two connections");
    });

    test(": _jsPlumb.connect after makeTarget (newConnection:true specified)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, isTarget: false}, {anchors: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        _jsPlumb.makeTarget(d17, { isTarget: true, anchor: "LeftMiddle"  }); // give it a non-default anchor, we will check this below.
        equal(true, jsPlumb.hasClass(d17, support.droppableClass));
        _jsPlumb.connect({source: e16, target: "d17", newConnection: true});
        support.assertEndpointCount("d16", 1, _jsPlumb);
        support.assertEndpointCount("d17", 1, _jsPlumb);
        var e = _jsPlumb.getEndpoints("d17");
        equal(e[0].anchor.x, 0.5, "anchor is BottomCenter"); //here we should be seeing the default anchor
        equal(e[0].anchor.y, 1, "anchor is BottomCenter"); //here we should be seeing the default anchor
    });

// jsPlumb.connect, after makeSource has been called on some element


    test(": endpoint source and target scope", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18");
        var e16 = _jsPlumb.addEndpoint(d16, {scope: "foo"});
        var e18 = _jsPlumb.addEndpoint(d18, {scope: "bar"});
        var e17 = _jsPlumb.addEndpoint(d17, { scope: "foo" }); // give it a non-default anchor, we will check this below.

        var c = _jsPlumb.connect({source: e17, target: e16});
        ok(c != null, "connection with matching scope established");

        c = _jsPlumb.connect({source: e17, target: e18});
        ok(c == null, "connection with non-matching scope not established");
    });

    test(": endpoint source and target scope, multiple scope", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18"), d19 = support.addDiv("d19");
        var e16 = _jsPlumb.addEndpoint(d16, {scope: "foo baz", maxConnections: -1});
        var e18 = _jsPlumb.addEndpoint(d18, {scope: "bar"});
        var e17 = _jsPlumb.addEndpoint(d17, { scope: "baz", maxConnections: -1 }); // give it a non-default anchor, we will check this below.
        var e19 = _jsPlumb.addEndpoint(d17, { scope: "foo" }); // give it a non-default anchor, we will check this below.

        var c = _jsPlumb.connect({source: e17, target: e16});
        ok(c != null, "connection with matching scope established");

        c = _jsPlumb.connect({source: e17, target: e18});
        ok(c == null, "connection with non-matching scope not established");

        c = _jsPlumb.connect({source: e19, target: e16});
        ok(c != null, "connection with second matching scope established");
    });




// *********************** end of makeTarget (and associated methods) tests ************************ 

    test(': _jsPlumb.connect (between two Endpoints)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {});
        var e2 = _jsPlumb.addEndpoint(d2, {});
        ok(e, 'endpoint e exists');
        ok(e2, 'endpoint e2 exists');
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        var c = _jsPlumb.connect({target: 'd2', sourceEndpoint: e, targetEndpoint: e2});
        support.assertEndpointCount("d1", 1, _jsPlumb);		// no new endpoint should have been added
        support.assertEndpointCount("d2", 1, _jsPlumb); 		// no new endpoint should have been added
        ok(c.id != null, "connection has had an id assigned");
    });


    test(': _jsPlumb.connect (between two Endpoints, and dont supply any parameters to the Endpoints.)', function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        ok(e, 'endpoint e exists');
        ok(e2, 'endpoint e2 exists');
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.connect({target: 'd2', sourceEndpoint: e, targetEndpoint: e2});
        support.assertEndpointCount("d1", 1, _jsPlumb);		// no new endpoint should have been added
        support.assertEndpointCount("d2", 1, _jsPlumb); 		// no new endpoint should have been added
    });

    test(" : _jsPlumb.connect, passing 'anchors' array", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, anchors: ["LeftMiddle", "RightMiddle"]});

        equal(c.endpoints[0].anchor.x, 0, "source anchor is at x=0");
        equal(c.endpoints[0].anchor.y, 0.5, "source anchor is at y=0.5");
        equal(c.endpoints[1].anchor.x, 1, "target anchor is at x=1");
        equal(c.endpoints[1].anchor.y, 0.5, "target anchor is at y=0.5");
    });

    test(': _jsPlumb.connect (by endpoint)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
    });

    test(': _jsPlumb.connect (cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17, cost: 567});
        equal(c.getCost(), 567, "connection cost is 567");
    });

    test(': _jsPlumb.connect (default cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), undefined, "default connection cost is 1");
    });

    test(': _jsPlumb.connect (set cost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), undefined, "default connection cost is 1");
        c.setCost(8989);
        equal(c.getCost(), 8989, "connection cost is 8989");
    });

    test(': _jsPlumb.connect two endpoints (connectionCost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionCost: 567});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), 567, "connection cost is 567");
    });

    test(': _jsPlumb.connect two endpoints (change connectionCost)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionCost: 567, maxConnections: -1}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.getCost(), 567, "connection cost is 567");
        e16.setConnectionCost(23);
        var c2 = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c2.getCost(), 23, "connection cost is 23 after change on endpoint");
    });

    test(': _jsPlumb.connect (directed is false by default)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true}),
            c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.isDirected(), false, "default connection is not directed");
    });

    test(': _jsPlumb.connect (directed true)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true}),
            c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17, directed: true});
        equal(c.isDirected(), true, "connection is directed");
    });

    test(': _jsPlumb.connect two endpoints (connectionsDirected)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionsDirected: true, maxConnections: -1});
        ok(e16.anchor, 'endpoint 16 has an anchor');
        var e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        var c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.isDirected(), true, "connection is directed");
    });

    test(': _jsPlumb.connect two endpoints (change connectionsDirected)', function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"),
            e16 = _jsPlumb.addEndpoint(d16, {isSource: true, connectionsDirected: true, maxConnections: -1}),
            e17 = _jsPlumb.addEndpoint(d17, {isSource: true, maxConnections: -1});
        c = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c.isDirected(), true, "connection is directed");
        e16.setConnectionsDirected(false);
        var c2 = _jsPlumb.connect({sourceEndpoint: e16, targetEndpoint: e17});
        equal(c2.isDirected(), false, "connection is not directed");
    });

    test(": _jsPlumb.connect (two Endpoints - that have been already added - by UUID)", function () {
        var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e1 = _jsPlumb.addEndpoint("d16", {isSource: true, maxConnections: -1, uuid: srcEndpointUuid});
        var e2 = _jsPlumb.addEndpoint("d17", {isSource: true, maxConnections: -1, uuid: dstEndpointUuid});
        _jsPlumb.connect({ uuids: [ srcEndpointUuid, dstEndpointUuid  ] });
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
    });

    test(": _jsPlumb.connect (two Endpoints - that have not been already added - by UUID)", function () {
        var srcEndpointUuid = "14785937583175927504313", dstEndpointUuid = "14785937583175927534325";
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.connect({ uuids: [ srcEndpointUuid, dstEndpointUuid  ], source: d16, target: d17 });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        var e1 = _jsPlumb.getEndpoint(srcEndpointUuid);
        ok(e1 != null, "endpoint with src uuid added");
        ok(e1.canvas != null);
        var e2 = _jsPlumb.getEndpoint(dstEndpointUuid);
        ok(e2 != null, "endpoint with target uuid added");
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (two Endpoints - that have been already added - by endpoint reference)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e1 = _jsPlumb.addEndpoint("d16", {isSource: true, maxConnections: -1});
        var e2 = _jsPlumb.addEndpoint("d17", {isSource: true, maxConnections: -1});
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (two elements)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        _jsPlumb.connect({ source: d16, target: d17 });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (Connector test, straight)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (Connector test, bezier, no params)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Bezier" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Bezier", "Bezier connector chosen for connection");
        equal(conn.getConnector().getCurviness(), 150, "Bezier connector chose 150 curviness");
    });

    test(": _jsPlumb.connect (Connector test, bezier, curviness as int)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: ["Bezier", { curviness: 200 }] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Bezier", "Canvas Bezier connector chosen for connection");
        equal(conn.getConnector().getCurviness(), 200, "Bezier connector chose 200 curviness");
    });

    test(": _jsPlumb.connect (Connector test, bezier, curviness as named option)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: ["Bezier", {curviness: 300}] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Bezier", "Bezier connector chosen for connection");
        equal(conn.getConnector().getCurviness(), 300, "Bezier connector chose 300 curviness");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Canvas Straight connector chosen for connection");
        equal(0.3, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn.endpoints[1].anchor.y, "target anchor y");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as strings)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: ["LeftMiddle", "RightMiddle"] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(0, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.5, conn.endpoints[0].anchor.y, "source anchor y");
        equal(1, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.5, conn.endpoints[1].anchor.y, "target anchor y");
    });

    test(": _jsPlumb.connect (anchors registered correctly; source and target anchors given, as arrays)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(0.3, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn.endpoints[1].anchor.y, "target anchor y");
    });


    test(": _jsPlumb.connect (two argument method in which some data is reused across connections)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17"), d18 = support.addDiv("d18"), d19 = support.addDiv("d19");
        var sharedData = { connector: "Straight", anchors: [
            [0.3, 0.3, 1, 0],
            [0.7, 0.7, 0, 1]
        ] };
        var conn = _jsPlumb.connect({ source: d16, target: d17}, sharedData);
        var conn2 = _jsPlumb.connect({ source: d18, target: d19}, sharedData);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 2, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(conn2.getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(0.3, conn.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn.endpoints[1].anchor.y, "target anchor y");
        equal(0.3, conn2.endpoints[0].anchor.x, "source anchor x");
        equal(0.3, conn2.endpoints[0].anchor.y, "source anchor y");
        equal(0.7, conn2.endpoints[1].anchor.x, "target anchor x");
        equal(0.7, conn2.endpoints[1].anchor.y, "target anchor y");
    });

    test(": _jsPlumb.connect (Connector as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.getConnector().type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (Endpoint test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoint: "Rectangle" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoint as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoint: "Rectangle" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoints test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Dot" ] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Dot, "Dot endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Blank Endpoint specified via 'endpoint' param)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoint: "Blank" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Blank Endpoint specified via 'endpoints' param)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Blank", "Blank" ] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Blank, "Blank endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (Endpoint as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var conn = _jsPlumb.connect({ source: d16, target: d17, endpoints: ["Rectangle", "Dot" ] });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(conn.endpoints[0].endpoint.constructor, jsPlumb.Endpoints[renderMode].Rectangle, "Rectangle endpoint chosen for connection source");
        equal(conn.endpoints[1].endpoint.constructor, jsPlumb.Endpoints[renderMode].Dot, "Dot endpoint chosen for connection target");
    });

    test(": _jsPlumb.connect (by Endpoints, connector test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {});
        var e17 = _jsPlumb.addEndpoint(d17, {});
        window.FOO = "BAR"
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        window.FOO = null;
    });

    test(": _jsPlumb.connect (by Endpoints, connector as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {});
        var e17 = _jsPlumb.addEndpoint(d17, {});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
    });

    test(": _jsPlumb.connect (by Endpoints, anchors as string test)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var a16 = "TopCenter", a17 = "BottomCenter";
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: a16});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: a17});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.x, 0.5, "endpoint 16 is at top center");
        equal(e16.anchor.y, 0, "endpoint 16 is at top center");
        equal(e17.anchor.x, 0.5, "endpoint 17 is at bottom center");
        equal(e17.anchor.y, 1, "endpoint 17 is at bottom center");
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create anchors)", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var a16 = [0, 0.5, 0, -1], a17 = [1, 0.0, -1, -1];
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: a16});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: a17});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.x, a16[0]);
        equal(e16.anchor.y, a16[1]);
        equal(e17.anchor.x, a17[0]);
        equal(e17.anchor.y, a17[1]);
        equal(e16.anchor.getOrientation()[0], a16[2]);
        equal(e16.anchor.getOrientation()[1], a16[3]);
        equal(e17.anchor.getOrientation()[0], a17[2]);
        equal(e17.anchor.getOrientation()[1], a17[3]);
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchor')", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["TopCenter", "BottomCenter"]});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.connect (by Endpoints, endpoints create dynamic anchors; anchors specified by 'anchors')", function () {
        var d16 = support.addDiv("d16"), d17 = support.addDiv("d17");
        var e16 = _jsPlumb.addEndpoint(d16, {anchor: [
            [0, 0.5, 0, -1],
            [1, 0.5, 0, 1]
        ]});
        var e17 = _jsPlumb.addEndpoint(d17, {anchor: ["TopCenter", "BottomCenter"]});
        var conn = _jsPlumb.connect({ sourceEndpoint: e16, targetEndpoint: e17, connector: "Straight" });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        equal(e16.connections[0].getConnector().type, "Straight", "Straight connector chosen for connection");
        equal(e16.anchor.isDynamic, true, "Endpoint 16 has a dynamic anchor");
        equal(e17.anchor.isDynamic, true, "Endpoint 17 has a dynamic anchor");
    });

    test(": _jsPlumb.connect (connect by element, default endpoint, supplied dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var anchors = [
            [0.25, 0, 0, -1],
            [1, 0.25, 1, 0],
            [0.75, 1, 0, 1],
            [0, 0.75, -1, 0]
        ];
        _jsPlumb.connect({source: d1, target: d2, dynamicAnchors: anchors, deleteEndpointsOnEmpty:true});                // auto connect with default endpoint and provided anchors
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).delete();
        // this changed in 1.3.5, because auto generated endpoints are now removed by detach.  so i added the test below this one
        // to check that the deleteEndpointsOnDetach flag is honoured.
        // and changed back in 2.4.0...maybe
        support.assertEndpointCount("d1", 0, _jsPlumb);
        support.assertEndpointCount("d2", 0, _jsPlumb);
    });

    test(": _jsPlumb.connect (connect by element, default endpoint, supplied dynamic anchors, delete on detach false)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var anchors = [
            [0.25, 0, 0, -1],
            [1, 0.25, 1, 0],
            [0.75, 1, 0, 1],
            [0, 0.75, -1, 0]
        ];
        _jsPlumb.connect({
            source: d1,
            target: d2,
            dynamicAnchors: anchors,
            deleteEndpointsOnEmpty: false
        });                // auto connect with default endpoint and provided anchors
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).delete();
        // this changed in 1.3.5, because auto generated endpoints are now removed by detach.  so i added this test
        // to check that the deleteEndpointsOnEmpty flag is honoured.
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
    });

    test(": delete endpoints on detach, makeSource and makeTarget)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.makeSource(d1);
        _jsPlumb.makeTarget(d2);
        var c = _jsPlumb.connect({
            source: d1,
            target: d2
        });
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        // both endpoints should have been deleted, as they were both created automatically
        support.assertEndpointCount("d1", 0, _jsPlumb);
        support.assertEndpointCount("d2", 0, _jsPlumb);
    });

    test(": delete endpoints on detach, addEndpoint and makeTarget)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1);
        _jsPlumb.makeTarget(d2);
        var c = _jsPlumb.connect({
            source: e,
            target: d2
        });
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        // only target endpoint should have been deleted, as the other was not added automatically
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 0, _jsPlumb);
    });

    test(": delete endpoints on detach, makeSource and addEndpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.makeSource(d1);
        var e = _jsPlumb.addEndpoint(d2);
        var c = _jsPlumb.connect({
            source: d1,
            target: e
        });
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.deleteConnection(c);
        // only source endpoint should have been deleted, as the other was not added automatically
        support.assertEndpointCount("d1", 0, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (connect by element, supplied endpoint and dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var endpoint = { isSource: true };
        var e1 = _jsPlumb.addEndpoint(d1, endpoint);
        var e2 = _jsPlumb.addEndpoint(d2, endpoint);
        var anchors = [ "TopCenter", "BottomCenter" ];
        _jsPlumb.connect({sourceEndpoint: e1, targetEndpoint: e2, dynamicAnchors: anchors});
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).delete();
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
    });

    test(": _jsPlumb.connect (connect by element, supplied endpoints using 'source' and 'target' (this test is identical to the one above apart from the param names), and dynamic anchors)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var endpoint = { isSource: true };
        var e1 = _jsPlumb.addEndpoint(d1, endpoint);
        var e2 = _jsPlumb.addEndpoint(d2, endpoint);
        var anchors = [ "TopCenter", "BottomCenter" ];
        _jsPlumb.connect({source: e1, target: e2, dynamicAnchors: anchors});
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).delete();
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
    });

    test(": jsPlumb.connect, events specified", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            clicked = 0,
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                events: {
                    click: function (conn) {
                        clicked++;
                    }
                }
            });

        c.fire("click", c);
        equal(1, clicked, "connection was clicked once");
    });

    test(" detachable parameter defaults to true on _jsPlumb.connect", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.isDetachable(), true, "connections detachable by default");
    });

    test(" detachable parameter set to false on _jsPlumb.connect", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, detachable: false});
        equal(c.isDetachable(), false, "connection detachable");
    });

    test(" setDetachable on initially detachable connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.isDetachable(), true, "connection initially detachable");
        c.setDetachable(false);
        equal(c.isDetachable(), false, "connection not detachable");
    });

    test(" setDetachable on initially not detachable connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, detachable: false });
        equal(c.isDetachable(), false, "connection not initially detachable");
        c.setDetachable(true);
        equal(c.isDetachable(), true, "connection now detachable");
    });

    test(" _jsPlumb.Defaults.ConnectionsDetachable", function () {
        _jsPlumb.Defaults.ConnectionsDetachable = false;
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.isDetachable(), false, "connections not detachable by default (overrode the defaults)");
        _jsPlumb.Defaults.ConnectionsDetachable = true;
    });


    test(": _jsPlumb.connect (testing for connection event callback)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var connectCallback = null, detachCallback = null;
        _jsPlumb.bind("connection", function (params) {
            connectCallback = jsPlumb.extend({}, params);
        });
        _jsPlumb.bind("connectionDetached", function (params) {
            detachCallback = jsPlumb.extend({}, params);
        });
        _jsPlumb.connect({source: d1, target: d2});                // auto connect with default endpoint and anchor set
        ok(connectCallback != null, "connect callback was made");
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        support.assertEndpointCount("d1", 1, _jsPlumb);
        support.assertEndpointCount("d2", 1, _jsPlumb);
        _jsPlumb.select({source: d1, target: d2}).delete();
        ok(detachCallback != null, "detach callback was made");
    });

    test(": _jsPlumb.connect (setting outline class on Connector)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, paintStyle:{outlineStroke:"green", outlineWidth:6, strokeWidth:4, stroke:"red"}});
        var has = function (clazz, elName) {
            var cn = c.getConnector()[elName].className,
                cns = cn.constructor == String ? cn : cn.baseVal;

            return cns.indexOf(clazz) != -1;
        };
        ok(has(_jsPlumb.connectorClass, "canvas"), "basic connector class set correctly");

        ok(has("jtk-connector-outline", "bgPath"), "outline canvas set correctly");
        ok(has(_jsPlumb.connectorOutlineClass, "bgPath"), "outline canvas set correctly");
    });

    test(": _jsPlumb.connect (setting cssClass on Connector)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, cssClass: "CSS"});
        var has = function (clazz) {
            var cn = c.getConnector().canvas.className,
                cns = cn.constructor == String ? cn : cn.baseVal;

            return cns.indexOf(clazz) != -1;
        };
        ok(has("CSS"), "custom cssClass set correctly");
        ok(has(_jsPlumb.connectorClass), "basic connector class set correctly");
    });

    test(": _jsPlumb.addEndpoint (setting cssClass on Endpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {cssClass: "CSS"});
        var has = function (clazz) {
            var cn = e.endpoint.canvas.className,
                cns = cn.constructor == String ? cn : cn.baseVal;

            return cns.indexOf(clazz) != -1;
        };
        ok(has("CSS"), "custom cssClass set correctly");
        ok(has(_jsPlumb.endpointClass), "basic endpoint class set correctly");
    });

    test(": _jsPlumb.addEndpoint (setting cssClass on blank Endpoint)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {endpoint: "Blank", cssClass: "CSS"});
        var has = function (clazz) {
            var cn = e.endpoint.canvas.className,
                cns = cn.constructor == String ? cn : cn.baseVal;

            return cns.indexOf(clazz) != -1;
        };
        ok(has("CSS"), "custom cssClass set correctly");
        ok(has(_jsPlumb.endpointClass), "basic endpoint class set correctly");
    });

    test(": _jsPlumb.connect (overlays, long-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {width: 40, length: 40, location: 0.7, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a"};
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id:"l"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(_length(connection1._jsPlumb.overlays), 2);
        equal(jsPlumb.Overlays[renderMode].Label, connection1._jsPlumb.overlays["l"].constructor);

        equal(jsPlumb.Overlays[renderMode].Arrow, connection1._jsPlumb.overlays["a"].constructor);
        equal(0.7, connection1._jsPlumb.overlays["a"].loc);
        equal(40, connection1._jsPlumb.overlays["a"].width);
        equal(40, connection1._jsPlumb.overlays["a"].length);
    });

    test(": _jsPlumb.connect (overlays, long-hand version, IDs specified)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, _length(connection1._jsPlumb.overlays));
        equal(jsPlumb.Overlays[renderMode].Label, connection1._jsPlumb.overlays["aLabel"].constructor);
        equal("aLabel", connection1._jsPlumb.overlays["aLabel"].id);

        equal(jsPlumb.Overlays[renderMode].Arrow, connection1._jsPlumb.overlays["anArrow"].constructor);
        equal(0.7, connection1._jsPlumb.overlays["anArrow"].loc);
        equal(40, connection1._jsPlumb.overlays["anArrow"].width);
        equal(40, connection1._jsPlumb.overlays["anArrow"].length);
        equal("anArrow", connection1._jsPlumb.overlays["anArrow"].id);
    });

    test(": _jsPlumb.connect (default overlays)", function () {
        _jsPlumb.Defaults.Overlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default overlays + overlays specified in connect call)", function () {
        _jsPlumb.Defaults.Overlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default connection overlays)", function () {
        _jsPlumb.Defaults.ConnectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
    });

    test(": _jsPlumb.connect (default connection overlays + overlays specified in connect call)", function () {
        _jsPlumb.Defaults.ConnectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (default overlays + default connection overlays)", function () {
        _jsPlumb.Defaults.ConnectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        _jsPlumb.Defaults.Overlays = [
            ["Arrow", { location: 0.1, id: "arrow2" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("arrow2") != null, "Arrow overlay created from connection defaults");
    });


    test(": _jsPlumb.connect (default overlays + default connection overlays)", function () {
        _jsPlumb.Defaults.ConnectionOverlays = [
            ["Arrow", { location: 0.1, id: "arrow" }]
        ];
        _jsPlumb.Defaults.Overlays = [
            ["Arrow", { location: 0.1, id: "arrow2" }]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays: [
                ["Label", {id: "label"}]
            ]});

        ok(c.getOverlay("arrow") != null, "Arrow overlay created from defaults");
        ok(c.getOverlay("arrow2") != null, "Arrow overlay created from connection defaults");
        ok(c.getOverlay("label") != null, "Label overlay created from connect call");
    });

    test(": _jsPlumb.connect (label overlay set using 'label')", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO"
            });

        equal(_length(c.getOverlays()), 1, "one overlay set");
        equal(c.getLabel(), "FOO", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with string)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel("FOO");
        equal(c.getLabel(), "FOO", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with function)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel(function () {
            return "BAR";
        });
        equal(c.getLabel()(), "BAR", "label is set correctly");
    });

    test(": _jsPlumb.connect (set label after construction, with params object)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2});

        c.setLabel({
            label: "BAZ",
            cssClass: "CLASSY",
            location: 0.9
        });
        var lo = c.getLabelOverlay();
        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.getLocation(), 0.9, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (set label after construction with existing label set, with params object)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            });

        var lo = c.getLabelOverlay();
        equal(lo.getLocation(), 0.2, "label overlay has correct location");

        c.setLabel({
            label: "BAZ",
            cssClass: "CLASSY",
            location: 0.9
        });

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "BAZ", "label overlay has correct value");
        equal(lo.getLocation(), 0.9, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (getLabelOverlay, label on connect call)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO"
            }),
            lo = c.getLabelOverlay();

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "FOO", "label overlay has correct value");
        equal(lo.getLocation(), 0.5, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (getLabelOverlay, label on connect call, location set)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                label: "FOO",
                labelLocation: 0.2
            }),
            lo = c.getLabelOverlay();

        ok(lo != null, "label overlay exists");
        equal(lo.getLabel(), "FOO", "label overlay has correct value");
        equal(lo.getLocation(), 0.2, "label overlay has correct location");
    });

    test(": _jsPlumb.connect (remove single overlay by id)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, _length(connection1._jsPlumb.overlays));
        connection1.removeOverlay("aLabel");
        equal(1, _length(connection1._jsPlumb.overlays));
        equal("anArrow", connection1._jsPlumb.overlays["anArrow"].id);
    });

    test(": _jsPlumb.connect (remove multiple overlays by id)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var arrowSpec = {
            width: 40,
            length: 40,
            location: 0.7,
            foldback: 0,
            paintStyle: {strokeWidth: 1, stroke: "#000000"},
            id: "anArrow"
        };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id: "aLabel"}],
                ["Arrow", arrowSpec ]
            ]
        });
        equal(2, _length(connection1._jsPlumb.overlays));
        connection1.removeOverlays("aLabel", "anArrow");
        equal(0, _length(connection1._jsPlumb.overlays));
    });

    test(": _jsPlumb.connect (overlays, short-hand version)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, id:"l"}],
                ["Arrow", arrowSpec, loc]
            ]
        });
        equal(2, _length(connection1._jsPlumb.overlays));
        equal(jsPlumb.Overlays[renderMode].Label, connection1._jsPlumb.overlays["l"].constructor);

        equal(jsPlumb.Overlays[renderMode].Arrow, connection1._jsPlumb.overlays["a"].constructor);
        equal(0.7, connection1._jsPlumb.overlays["a"].loc);
        equal(40, connection1._jsPlumb.overlays["a"].width);
        equal(40, connection1._jsPlumb.overlays["a"].length);
    });

    test(": _jsPlumb.connect (removeAllOverlays)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var imageEventListener = function () {
        };
        var loc = { location: 0.7 };
        var arrowSpec = { width: 40, length: 40, foldback: 0, paintStyle: {strokeWidth: 1, stroke: "#000000"}, id:"a" };
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
            overlays: [
                ["Label", {label: "CONNECTION 1", location: 0.3, cssClass: "PPPP", id:"l"}],
                ["Arrow", arrowSpec, loc]
            ]
        });
        equal(2, _length(connection1._jsPlumb.overlays));
        equal(jsPlumb.Overlays[renderMode].Label, connection1._jsPlumb.overlays["l"].constructor);

        equal(jsPlumb.Overlays[renderMode].Arrow, connection1._jsPlumb.overlays["a"].constructor);
        equal(0.7, connection1._jsPlumb.overlays["a"].loc);
        equal(40, connection1._jsPlumb.overlays["a"].width);
        equal(40, connection1._jsPlumb.overlays["a"].length);

        // not valid anymore, as we dont nuke overlays until the component is deleted.
        /*connection1.removeAllOverlays();
        equal(0, connection1._jsPlumb.overlays.length);
        equal(0, jsPlumb.getSelector(".PPPP").length);*/
        _jsPlumb.deleteConnection(connection1);
        equal(0, jsPlumb.getSelector(".PPPP").length, "overlay has been fully cleaned up");
    });

    test(": _jsPlumb.connect, specify arrow overlay using string identifier only", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: ["Arrow"]});
        equal(jsPlumb.Overlays[renderMode].Arrow, _head(conn._jsPlumb.overlays).constructor);
    });

    test(": Connection.getOverlay method, existing overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay != null);
    });

    test(": Connection.getOverlay method, non-existent overlay", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("IDONTEXIST");
        ok(overlay == null);
    });

    test(": Overlay.setVisible method", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var conn = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", { id: "arrowOverlay" } ]
        ] });
        var overlay = conn.getOverlay("arrowOverlay");
        ok(overlay.isVisible());
        overlay.setVisible(false);
        ok(!overlay.isVisible());
        overlay.setVisible(true);
        ok(overlay.isVisible());
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return plain DOM element)", function () {
        _jsPlumb.Defaults.ConnectionOverlays = [
            ["Custom", { id: "custom", create: function (connection) {
                ok(connection != null, "we were passed in a connection");
                var d = document.createElement("div");
                d.setAttribute("custom", "true");
                d.innerHTML = connection.id;
                return d;
            }}]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.getElement().getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.getElement().innerHTML, c.id, "custom overlay has correct value");
    });

    test(": _jsPlumb.connect (custom label overlay, set on Defaults, return selector)", function () {
        _jsPlumb.Defaults.ConnectionOverlays = [
            ["Custom", { id: "custom", create: function (connection) {
                ok(connection != null, "we were passed in a connection");
                return support.makeContent("<div custom='true'>" + connection.id + "</div>");
            }}]
        ];
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        var o = c.getOverlay("custom");
        equal(o.getElement().getAttribute("custom"), "true", "custom overlay created correctly");
        equal(o.getElement().innerHTML, c.id, "custom overlay has correct value");
    });

    test(": overlay events", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var clicked = 0;
        var connection1 = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays: [
                ["Label", {
                    label: "CONNECTION 1",
                    location: 0.3,
                    id: "label",
                    events: {
                        click: function (label, e) {
                            clicked++;
                        }
                    }
                }]
            ]
        });
        var l = connection1.getOverlay("label");
        l.fire("click", l);
        equal(clicked, 1, "click event was fired once");
    });


    // this test is for the original detach function; it should stay working after i mess with it
    // a little.
    test(": _jsPlumb.detach (by element ids)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        var e3 = _jsPlumb.addEndpoint(d1);
        var e4 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        _jsPlumb.connect({ sourceEndpoint: e3, targetEndpoint: e4 });  // make two connections to be sure this works ;)
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        assertConnectionCount(e3, 1);
        assertConnectionCount(e4, 1);

        _jsPlumb.select({source: "d1", target: "d2"}).delete();

        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionCount(e3, 0);
        assertConnectionCount(e4, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    // detach is being made to operate more like connect - by taking one argument with a whole 
    // bunch of possible params in it.  if two args are passed in it will continue working
    // in the old way.
    test(": _jsPlumb.select+delete (params object, using element ids)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({source: d1, target: d2}).delete();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });
    //
    //test(": _jsPlumb.detach (params object, using target only)", function() {
     //var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
     //e1 = _jsPlumb.addEndpoint(d1, {maxConnections:2}),
     //e2 = _jsPlumb.addEndpoint(d2),
     //e3 = _jsPlumb.addEndpoint(d3);
     //_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e2 });
     //_jsPlumb.connect({ sourceEndpoint:e1, targetEndpoint:e3 });
     //assertConnectionCount(e1, 2);
     //assertConnectionCount(e2, 1);
     //assertConnectionCount(e3, 1);
     //_jsPlumb.detach({target:"d2"});
     //assertConnectionCount(e1, 1);
     //assertConnectionCount(e2, 0);
     //assertConnectionCount(e3, 1);
     //assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1);
     //});

    test(": _jsPlumb.select+delete (params object, using element objects)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({source: d1, target: d2}).delete();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    test(": _jsPlumb.select+delete (source and target as endpoint UUIDs)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {uuid: "abcdefg"});
        ok(_jsPlumb.getEndpoint("abcdefg") != null, "e1 exists");
        var e2 = _jsPlumb.addEndpoint(d2, {uuid: "hijklmn"});
        ok(_jsPlumb.getEndpoint("hijklmn") != null, "e2 exists");
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({uuids: ["abcdefg", "hijklmn"]}).delete();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    test(": _jsPlumb.select+delete (sourceEndpoint and targetEndpoint supplied)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        var e2 = _jsPlumb.addEndpoint(d2);
        _jsPlumb.connect({ sourceEndpoint: e1, targetEndpoint: e2 });
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 1, _jsPlumb);
        assertConnectionCount(e1, 1);
        assertConnectionCount(e2, 1);
        _jsPlumb.select({ sourceEndpoint: e1, targetEndpoint: e2 }).delete();
        assertConnectionCount(e1, 0);
        assertConnectionCount(e2, 0);
        assertConnectionByScopeCount(_jsPlumb.getDefaultScope(), 0, _jsPlumb);
    });

    test(": _jsPlumb.makeDynamicAnchors (longhand)", function () {
        var anchors = [_jsPlumb.makeAnchor([0.2, 0, 0, -1], null, _jsPlumb), _jsPlumb.makeAnchor([1, 0.2, 1, 0], null, _jsPlumb),
            _jsPlumb.makeAnchor([0.8, 1, 0, 1], null, _jsPlumb), _jsPlumb.makeAnchor([0, 0.8, -1, 0], null, _jsPlumb) ];
        var dynamicAnchor = _jsPlumb.makeDynamicAnchor(anchors);
        var a = dynamicAnchor.getAnchors();
        equal(a.length, 4, "Dynamic Anchors has four anchors");
        for (var i = 0; i < a.length; i++)
            ok(a[i].compute.constructor == Function, "anchor " + i + " well formed");
    });

    test(": _jsPlumb.makeDynamicAnchors (shorthand)", function () {
        var anchors = [
            [0.2, 0, 0, -1],
            [1, 0.2, 1, 0],
            [0.8, 1, 0, 1],
            [0, 0.8, -1, 0]
        ];
        var dynamicAnchor = _jsPlumb.makeDynamicAnchor(anchors);
        var a = dynamicAnchor.getAnchors();
        equal(a.length, 4, "Dynamic Anchors has four anchors");
        for (var i = 0; i < a.length; i++)
            ok(a[i].compute.constructor == Function, "anchor " + i + " well formed");
    });

    test(": Connection.isVisible/setVisible", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c1 = _jsPlumb.connect({source: d1, target: d2});
        equal(true, c1.isVisible(), "Connection is visible after creation.");
        c1.setVisible(false);
        equal(false, c1.isVisible(), "Connection is not visible after calling setVisible(false).");
        equal(c1.getConnector().canvas.style.display, "none");
        c1.setVisible(true);
        equal(true, c1.isVisible(), "Connection is visible after calling setVisible(true).");
        equal(c1.getConnector().canvas.style.display, "");
    });


    test(": Endpoint.isVisible/setVisible basic test (no connections)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1);
        equal(true, e1.isVisible(), "Endpoint is visible after creation.");
        e1.setVisible(false);
        equal(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
        equal(e1.canvas.style.display, "none");
        e1.setVisible(true);
        equal(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
        equal(e1.canvas.style.display, "block");
    });

    test(": Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should track changes in the source, because it has only this connection.)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2);
        equal(true, e1.isVisible(), "Endpoint is visible after creation.");
        var c1 = _jsPlumb.connect({source: e1, target: e2});
        e1.setVisible(false);
        equal(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
        equal(false, e2.isVisible(), "other Endpoint is not visible either.");
        equal(false, c1.isVisible(), "connection between the two is not visible either.");

        e1.setVisible(true);
        equal(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
        equal(true, e2.isVisible(), "other Endpoint is visible too");
        equal(true, c1.isVisible(), "connection between the two is visible too.");
    });

    test(": Endpoint.isVisible/setVisible (one connection, other Endpoint's visibility should not track changes in the source, because it has another connection.)", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2, { maxConnections: 2 }), e3 = _jsPlumb.addEndpoint(d3);
        equal(true, e1.isVisible(), "Endpoint is visible after creation.");
        var c1 = _jsPlumb.connect({source: e1, target: e2});
        var c2 = _jsPlumb.connect({source: e2, target: e3});

        e1.setVisible(false);
        equal(false, e1.isVisible(), "Endpoint is not visible after calling setVisible(false).");
        equal(true, e2.isVisible(), "other Endpoint should still be visible.");
        equal(true, e3.isVisible(), "third Endpoint should still be visible.");
        equal(false, c1.isVisible(), "connection between the two is not visible either.");
        equal(true, c2.isVisible(), "other connection is visible.");

        e1.setVisible(true);
        equal(true, e1.isVisible(), "Endpoint is visible after calling setVisible(true).");
        equal(true, e2.isVisible(), "other Endpoint is visible too");
        equal(true, c1.isVisible(), "connection between the two is visible too.");
        equal(true, c2.isVisible(), "other connection is visible.");
    });

    // tests of the functionality that allows a user to specify that they want elements appended to the document body
    test(" _jsPlumb.setContainer, specified with a selector", function () {
        _jsPlumb.setContainer(document.body);
        equal(document.getElementById("container").childNodes.length, 0, "container has no nodes");
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        equal(document.getElementById("container").childNodes.length, 2, "container has two div elements");  // the divs we added have been added to the 'container' div.
        // but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
        _jsPlumb.connect({source: d1, target: d2});
        equal(document.getElementById("container").childNodes.length, 2, "container still has two div elements");
    });

    // tests of the functionality that allows a user to specify that they want elements appended to some specific container.
    test(" _jsPlumb.setContainer, specified with DOM element", function () {
        _jsPlumb.setContainer(document.getElementsByTagName("body")[0]);
        equal(0, document.getElementById("container").childNodes.length);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        equal(2, document.getElementById("container").childNodes.length, "two divs added to the container");  // the divs we added have been added to the 'container' div.
        // but we have told _jsPlumb to add its canvas to the body, so this connect call should not add another few elements to the container:
        var bodyElementCount = document.body.childNodes.length;
        _jsPlumb.connect({source: d1, target: d2});
        equal(2, document.getElementById("container").childNodes.length, "still only two children in container; elements were added to the body by _jsPlumb");
        // test to see if 3 elements have been added
        equal(bodyElementCount + 3, document.body.childNodes.length, "3 new elements added to the document body");
    });

    test(" _jsPlumb.setContainer, moves managed nodes", function () {
        var c2 = support.addDiv("c2", document.body);
        var c = document.getElementById("container");

        equal(c.childNodes.length, 0, "container has no nodes");
        var d1 = support.addDiv("d1", c);
        equal(c.childNodes.length, 1, "container has one node");
        _jsPlumb.manage("d1", d1);

        // d2 has d1 as the parent so it should not end up having the container as its parent.
        var d2 = support.addDiv("d2", d1);

        _jsPlumb.setContainer("c2");
        equal(d1.parentNode, c2, "managed node with no connections was moved");
        equal(c.childNodes.length, 0, "container has no nodes");
        equal(c2.childNodes.length, 1, "container 2 has one node");
    });


    var _overlayTest = function(component, fn) {
        var o = component.getOverlays();
        for (var i in o)
            if (! fn(o[i])) return false;

        return true;
    };

    var _ensureContainer = function(component, container) {
        return _overlayTest(component, function(o) {

            return o.canvas ? o.canvas.parentNode == container :  o.getElement().parentNode == container;
        });
    };


    test(" change Container programmatically", function () {

        _jsPlumb.setContainer(container);

        var newContainer = document.createElement("div");
        newContainer.id = "newContainer";
        document.body.appendChild(newContainer);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
                ]
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
                ]
            }),
            e3 = _jsPlumb.addEndpoint(d1, {
                overlays: [
                    [ "Label", { label: "FOO", id: "label" }]
                ]
            });

        var c = _jsPlumb.connect({
            source: e1, target: e2,
            paintStyle: {
                outline: 4,
                outlineStyle: "red",
                stroke: "red",
                strokeWidth: 2
            },
            overlays: [
                "Label", "Arrow"
            ]
        });

        equal(e1.canvas.parentNode, container, "e1 canvas parent is container");

        equal(c.getConnector().canvas.parentNode, container, "connector parent is container");

        ok(_ensureContainer(e1, container));
        ok(_ensureContainer(c, container));


        _jsPlumb.setContainer(newContainer);

        equal(e1.canvas.parentNode, newContainer, "e1 canvas parent is newContainer");
        equal(c.getConnector().canvas.parentNode, newContainer, "connector parent is newContainer");
        ok(_ensureContainer(e1, newContainer));
        ok(_ensureContainer(c, newContainer));
    });


    test(" detachable defaults to true when connection made between two endpoints", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2),
            c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.isDetachable(), true, "connection not detachable");
    });

    test(" connection detachable when target endpoint has connectionsDetachable set to true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1), e2 = _jsPlumb.addEndpoint(d2, {connectionsDetachable: true}),
            c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.isDetachable(), true, "connection detachable because connectionsDetachable was set on target endpoint");
    });

    test(" connection detachable when source endpoint has connectionsDetachable set to true", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {connectionsDetachable: true}), e2 = _jsPlumb.addEndpoint(d2),
            c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.isDetachable(), true, "connection detachable because connectionsDetachable was set on source endpoint");
    });


    test(" Connector has 'type' member set", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getConnector().type, "Bezier", "Bezier connector has type set");

        var c2 = _jsPlumb.connect({source: d1, target: d2, connector: "Straight"});
        equal(c2.getConnector().type, "Straight", "Straight connector has type set");

        var c3 = _jsPlumb.connect({source: d1, target: d2, connector: "Flowchart"});
        equal(c3.getConnector().type, "Flowchart", "Flowchart connector has type set");
    });

    test(" Endpoints have 'type' member set", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.endpoints[0].type, "Dot", "Dot endpoint has type set");

        var c2 = _jsPlumb.connect({source: d1, target: d2, endpoints: ["Rectangle", "Blank"]});
        equal(c2.endpoints[1].type, "Blank", "Blank endpoint has type set");
        equal(c2.endpoints[0].type, "Rectangle", "Rectangle endpoint has type set");
    });

    test(" Overlays have 'type' member set", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            overlays: [ "Arrow", "Label", "PlainArrow", "Diamond" ]
        });
        /*equal(c._jsPlumb.overlays[0].type, "Arrow", "Arrow overlay has type set");
        equal(c._jsPlumb.overlays[1].type, "Label", "Label overlay has type set");
        equal(c._jsPlumb.overlays[2].type, "PlainArrow", "PlainArrow overlay has type set");
        equal(c._jsPlumb.overlays[3].type, "Diamond", "Diamond overlay has type set");*/
        ok(_overlayTest(c, function(o) {
            return o.type != null;
        }, "type is set"));
    });


    test(" _jsPlumb.hide, original one-arg version", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = { isSource: true, isTarget: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            c1 = _jsPlumb.connect({source: e1, target: e2, overlays:[ [ "Label", { id:"lbl"}]]});

        equal(true, c1.getOverlay("lbl").isVisible(), "overlay is visible");
        equal(true, c1.isVisible(), "Connection 1 is visible after creation.");
        equal(true, e1.isVisible(), "endpoint 1 is visible after creation.");
        equal(true, e2.isVisible(), "endpoint 2 is visible after creation.");

        _jsPlumb.hide(d1);

        equal(false, c1.getOverlay("lbl").isVisible(), "overlay is no longer visible");
        equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
        equal(true, e1.isVisible(), "endpoint 1 is still visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");

        _jsPlumb.show(d1);

        equal(true, c1.getOverlay("lbl").isVisible(), "overlay is no visible again");
        equal(true, c1.isVisible(), "Connection 1 is visible again.");
    });

    test(" _jsPlumb.hide, two-arg version, endpoints should also be hidden", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = { isSource: true, isTarget: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            c1 = _jsPlumb.connect({source: e1, target: e2});

        equal(true, c1.isVisible(), "Connection 1 is visible after creation.");
        equal(true, e1.isVisible(), "endpoint 1 is visible after creation.");
        equal(true, e2.isVisible(), "endpoint 2 is visible after creation.");

        _jsPlumb.hide("d1", true);

        equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");

        _jsPlumb.show(d1);  // now show d1, but do not alter the endpoints. e1 should still be hidden

        equal(true, c1.isVisible(), "Connection 1 is visible again.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
    });

    test(" _jsPlumb.show, two-arg version, endpoints should become visible", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = { isSource: true, isTarget: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            c1 = _jsPlumb.connect({source: e1, target: e2});

        _jsPlumb.hide("d1", true);

        equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");

        _jsPlumb.show(d1, true);  // now show d1, and alter the endpoints. e1 should be visible.

        equal(true, c1.isVisible(), "Connection 1 is visible again.");
        equal(true, e1.isVisible(), "endpoint 1 is visible again.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
    });

    test(" _jsPlumb.show, two-arg version, endpoints should become visible, but not all connections, because some other endpoints are  not visible.", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e = { isSource: true, isTarget: true, maxConnections: -1 },
            e1 = _jsPlumb.addEndpoint(d1, e),
            e11 = _jsPlumb.addEndpoint(d1, e),
            e2 = _jsPlumb.addEndpoint(d2, e),
            e3 = _jsPlumb.addEndpoint(d3, e),
            c1 = _jsPlumb.connect({source: e1, target: e2}),
            c2 = _jsPlumb.connect({source: e11, target: e3});

        // we now have d1 connected to both d3 and d2.  we'll hide d1, and everything on d1 should be hidden.

        _jsPlumb.hide("d1", true);

        equal(false, c1.isVisible(), "connection 1 is no longer visible.");
        equal(false, c2.isVisible(), "connection 2 is no longer visible.");
        equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
        equal(false, e11.isVisible(), "endpoint 1 is no longer visible.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
        equal(true, e3.isVisible(), "endpoint 3 is still visible.");

        // now, we will also hide d3. making d1 visible again should NOT result in c2 becoming visible, because the other endpoint
        // for c2 is e3, which is not visible.
        _jsPlumb.hide(d3, true);
        equal(false, e3.isVisible(), "endpoint 3 is no longer visible.");

        _jsPlumb.show(d1, true);  // now show d1, and alter the endpoints. e1 should be visible, c1 should be visible, but c2 should not.

        equal(true, c1.isVisible(), "Connection 1 is visible again.");
        equal(false, c2.isVisible(), "Connection 2 is not visible.");
        equal(true, e1.isVisible(), "endpoint 1 is visible again.");
        equal(true, e11.isVisible(), "endpoint 11 is visible again.");
        equal(true, e2.isVisible(), "endpoint 2 is still visible.");
        equal(false, e3.isVisible(), "endpoint 3 is still not visible.");
    });

    test("show/hide Overlays", function() {
        var c = _jsPlumb.connect({source:support.addDiv("d1"), target:support.addDiv("d2"), overlays:[
            [ "Label", { "id":"lbl" } ]
        ]});

        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
        c.hideOverlays();
        //equal(c.getOverlay("lbl").canvas.style.display, "none", "overlay not visible");
        equal(c.getOverlay("lbl").isVisible(), false, "overlay is not visible");
        c.showOverlays();
        equal(c.getOverlay("lbl").isVisible(), true, "overlay is visible");
    });

    //
     //test(" _jsPlumb.hide, two-arg version, endpoints should also be hidden", function() {
     //var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
     //e = { isSource:true, isTarget:true, maxConnections:-1 },
     //e1 = _jsPlumb.addEndpoint(d1, e),
     //e2 = _jsPlumb.addEndpoint(d2, e),
     //c1 = _jsPlumb.connect({source:e1, target:e2});

     //equal(true, c1.isVisible(), "Connection 1 is visible after creation.");
     //equal(true, e1.isVisible(), "endpoint 1 is visible after creation.");
     //equal(true, e2.isVisible(), "endpoint 2 is visible after creation.");

     //_jsPlumb.hide("d1", true);

     //equal(false, c1.isVisible(), "Connection 1 is no longer visible.");
     //equal(false, e1.isVisible(), "endpoint 1 is no longer visible.");
     //equal(true, e2.isVisible(), "endpoint 2 is still visible.");
     //});

     //
     //test for issue 132: label leaves its element in the DOM after it has been
     //removed from a connection.
     //
    test(" label cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {id: "label", cssClass: "foo"}]
        ]});
        ok(jsPlumb.getSelector(".foo").length == 1, "label element exists in DOM");
        c.removeOverlay("label");
        ok(_length(c.getOverlays()) == 0, "no overlays left on component");
        ok(jsPlumb.getSelector(".foo").length == 0 , "label element does not exist in DOM");
    });


    test(" arrow cleans itself up properly", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Arrow", {id: "arrow"}]
        ]});
        ok(c.getOverlay("arrow") != null, "arrow overlay exists");
        c.removeOverlay("arrow");
        ok(c.getOverlay("arrow") == null, "arrow overlay has been removed");
    });

    test(" label overlay getElement function", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {id: "label"}]
        ]});
        ok(c.getOverlay("label").getElement() != null, "label overlay exposes element via getElement method");
    });


    test(" label overlay provides getLabel and setLabel methods", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {id: "label", label: "foo"}]
        ]});
        var o = c.getOverlay("label"), e = o.getElement();
        equal(e.innerHTML, "foo", "label text is set to original value");
        o.setLabel("baz");
        equal(e.innerHTML, "baz", "label text is set to new value 'baz'");
        equal(o.getLabel(), "baz", "getLabel function works correctly with String");
        // now try functions
        var aFunction = function () {
            return "aFunction";
        };
        o.setLabel(aFunction);
        equal(e.innerHTML, "aFunction", "label text is set to new value from Function");
        equal(o.getLabel(), aFunction, "getLabel function works correctly with Function");
    });

    test(" label overlay custom css class", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {
                id: "label",
                cssClass: "foo"
            }]
        ]});
        var o = c.getOverlay("label");
        ok(jsPlumb.hasClass(o.getElement(), "foo"), "label overlay has custom css class");
    });

    test(" label overlay custom css class in labelStyle", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {
                id: "label",
                labelStyle: {
                    cssClass: "foo"
                }
            }]
        ]});
        var o = c.getOverlay("label");
        ok(jsPlumb.hasClass(o.getElement(), "foo"), "label overlay has custom css class");
    });


    test(" label overlay - labelStyle", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2, overlays: [
            [ "Label", {
                id: "label",
                labelStyle: {
                    borderWidth: 2,
                    borderStyle: "red",
                    fill: "blue",
                    color: "green",
                    padding: 10
                }
            }]
        ]});
        var o = c.getOverlay("label"), el = o.getElement();
        equal(el.style.borderWidth, "2px", "border width 2");
        equal(el.style.borderColor, "red", "border color red");
        equal(el.style.backgroundColor, "blue", "bg color blue");
        equal(el.style.color, "green", "color green");

    });

    test(" parameters object works for Endpoint", function () {
        var d1 = support.addDiv("d1"),
            f = function () {
                alert("FOO!");
            },
            e = _jsPlumb.addEndpoint(d1, {
                isSource: true,
                parameters: {
                    "string": "param1",
                    "int": 4,
                    "function": f
                }
            });
        ok(e.getParameter("string") === "param1", "getParameter(String) works correctly");
        ok(e.getParameter("int") === 4, "getParameter(int) works correctly");
        ok(e.getParameter("function") == f, "getParameter(Function) works correctly");
    });


    test(" parameters object works for Connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            f = function () {
                alert("FOO!");
            };
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            parameters: {
                "string": "param1",
                "int": 4,
                "function": f
            }
        });
        ok(c.getParameter("string") === "param1", "getParameter(String) works correctly");
        ok(c.getParameter("int") === 4, "getParameter(int) works correctly");
        ok(c.getParameter("function") == f, "getParameter(Function) works correctly");
    });

    test(" parameters set on Endpoints and Connections are all merged, and merged correctly at that.", function () {
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv("d2"),
            e = _jsPlumb.addEndpoint(d1, {
                isSource: true,
                parameters: {
                    "string": "sourceEndpoint",
                    "int": 0,
                    "function": function () {
                        return "sourceEndpoint";
                    }
                }
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                isTarget: true,
                parameters: {
                    "int": 1,
                    "function": function () {
                        return "targetEndpoint";
                    }
                }
            }),
            c = _jsPlumb.connect({source: e, target: e2, parameters: {
                "function": function () {
                    return "connection";
                }
            }});

        ok(c.getParameter("string") === "sourceEndpoint", "getParameter(String) works correctly");
        ok(c.getParameter("int") === 0, "getParameter(int) works correctly");
        ok(c.getParameter("function")() == "connection", "getParameter(Function) works correctly");
    });

    // anchor manager tests.  a new and more comprehensive way of managing the paint, introduced in 1.3.5
    test(" anchorManager registers standard connection", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1);
        equal(_jsPlumb.anchorManager.getEndpointsFor("d1").length, 1);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1);
        equal(_jsPlumb.anchorManager.getEndpointsFor("d2").length, 1);
        var c2 = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 2);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 2);
        equal(_jsPlumb.anchorManager.getEndpointsFor("d1").length, 2);
        equal(_jsPlumb.anchorManager.getEndpointsFor("d2").length, 2);
    });


    // anchor manager tests.  a new and more comprehensive way of managing the paint, introduced in 1.3.5
    test(" anchorManager registers dynamic anchor connection, and removes it.", function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source: d3, target: d4, anchors: ["AutoDefault", "AutoDefault"]});

        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1);

        var c2 = _jsPlumb.connect({source: d3, target: d4});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 2);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 2);

        equal(_jsPlumb.anchorManager.getEndpointsFor("d3").length, 2);
        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1);
    });

    // anchor manager tests.  a new and more comprehensive way of managing the paint, introduced in 1.3.5
    test(" anchorManager registers continuous anchor connection, and removes it.", function () {
        var d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        var c = _jsPlumb.connect({source: d3, target: d4, anchors: ["Continuous", "Continuous"]});

        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 1);

        _jsPlumb.deleteConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0);

        _jsPlumb.reset();
        equal(_jsPlumb.anchorManager.getEndpointsFor("d4").length, 0);
    });

    test(" Continuous anchor default face, no faces supplied", function () {
        var d3 = support.addDiv("d3"), ep = _jsPlumb.addEndpoint(d3, {
            anchor: "Continuous"
        });

        equal(ep.anchor.getDefaultFace(), "top", "default is top when no faces specified");
    });


    test(" Continuous anchor default face, faces supplied", function () {
        var d3 = support.addDiv("d3"), ep = _jsPlumb.addEndpoint(d3, {
            anchor: [ "Continuous", { faces: [ "bottom", "left" ] } ]
        });

        equal(ep.anchor.getDefaultFace(), "bottom", "default is bottom");
    });

    asyncTest(" setImage on Endpoint, with supplied onload", function () {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), ep,
            e = {
                endpoint: [ "Image", {
                    src: "atom.png",
                    onload: function (imgEp) {
                        QUnit.start();
                        ok(imgEp._jsPlumb.img.src.indexOf("atom.png") != -1);
                        ep.setImage("littledot.png", function (imgEp) {
                            ok(imgEp._jsPlumb.img.src.indexOf("littledot.png") != -1);
                        });
                    }
                } ]
            };


        ep = _jsPlumb.addEndpoint(d1, e);

    });


// issue 190 - regressions with getInstance.  these tests ensure that generated ids are unique across
// instances.    

    test(" id clashes between instances", function () {
        var d1 = document.createElement("div"),
            d2 = document.createElement("div"),
            _jsp2 = jsPlumb.getInstance();

        document.body.appendChild(d1);
        document.body.appendChild(d2);

        _jsPlumb.addEndpoint(d1);
        _jsp2.addEndpoint(d2);

        var id1 = d1.getAttribute("id"),
            id2 = d2.getAttribute("id");

        var idx = id1.indexOf("_"), idx2 = id1.lastIndexOf("_"), v1 = id1.substring(idx, idx2);
        var idx3 = id2.indexOf("_"), idx4 = id2.lastIndexOf("_"), v2 = id2.substring(idx3, idx4);

        ok(v1 != v2, "instance versions are different : " + v1 + " : " + v2);

        _jsp2.unbindContainer();
    });

    test(" id clashes between instances", function () {
        var d1 = document.createElement("div"),
            d2 = document.createElement("div");

        document.body.appendChild(d1);
        document.body.appendChild(d2);

        _jsPlumb.addEndpoint(d1);
        _jsPlumb.addEndpoint(d2);

        var id1 = d1.getAttribute("id"),
            id2 = d2.getAttribute("id");

        var idx = id1.indexOf("_"), idx2 = id1.lastIndexOf("_"), v1 = id1.substring(idx, idx2);
        var idx3 = id2.indexOf("_"), idx4 = id2.lastIndexOf("_"), v2 = id2.substring(idx3, idx4);

        ok(v1 == v2, "instance versions are the same : " + v1 + " : " + v2);
    });



    test(" importDefaults", function () {
        _jsPlumb.Defaults.Anchors = ["LeftMiddle", "RightMiddle"];
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv(d2),
            c = _jsPlumb.connect({source: d1, target: d2}),
            e = c.endpoints[0];

        equal(e.anchor.x, 0, "left middle anchor");
        equal(e.anchor.y, 0.5, "left middle anchor");

        _jsPlumb.importDefaults({
            Anchors: ["TopLeft", "TopRight"]
        });

        var conn = _jsPlumb.connect({source: d1, target: d2}),
            e1 = conn.endpoints[0], e2 = conn.endpoints[1];

        equal(e1.anchor.x, 0, "top leftanchor");
        equal(e2.anchor.y, 0, "top left anchor");
        equal(e2.anchor.x, 1, "top right anchor");
        equal(e2.anchor.y, 0, "top right anchor");

    });


    test(" restoreDefaults", function () {
        _jsPlumb.importDefaults({
            Anchors: ["TopLeft", "TopRight"]
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), conn = _jsPlumb.connect({source: d1, target: d2}),
            e1 = conn.endpoints[0], e2 = conn.endpoints[1];

        equal(e1.anchor.x, 0, "top leftanchor");
        equal(e2.anchor.y, 0, "top left anchor");
        equal(e2.anchor.x, 1, "top right anchor");
        equal(e2.anchor.y, 0, "top right anchor");

        _jsPlumb.restoreDefaults();

        var conn2 = _jsPlumb.connect({source: d1, target: d2}),
            e3 = conn2.endpoints[0], e4 = conn2.endpoints[1];

        equal(e3.anchor.x, 0.5, "bottom center anchor");
        equal(e3.anchor.y, 1, "bottom center anchor");
        equal(e4.anchor.x, 0.5, "bottom center anchor");
        equal(e4.anchor.y, 1, "bottom center anchor");
    });



// setId function

    test(" setId, taking two strings, only default scope", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.Defaults.MaxConnections = -1;
        var e1 = _jsPlumb.addEndpoint("d1"),
            e2 = _jsPlumb.addEndpoint("d2"),
            e3 = _jsPlumb.addEndpoint("d1");

        support.assertEndpointCount("d1", 2, _jsPlumb);
        equal(e1.elementId, "d1", "endpoint has correct element id");
        equal(e3.elementId, "d1", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d1", "anchor has correct element id");
        equal(e3.anchor.elementId, "d1", "anchor has correct element id");

        var c = _jsPlumb.connect({source: e1, target: e2}),
            c2 = _jsPlumb.connect({source: e2, target: e1});

        _jsPlumb.setId("d1", "d3");
        support.assertEndpointCount("d3", 2, _jsPlumb);
        support.assertEndpointCount("d1", 0, _jsPlumb);

        equal(e1.elementId, "d3", "endpoint has correct element id");
        equal(e3.elementId, "d3", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d3", "anchor has correct element id");
        equal(e3.anchor.elementId, "d3", "anchor has correct element id");

        equal(c.sourceId, "d3", "connection's sourceId has changed");
        equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
        equal(c2.targetId, "d3", "connection's targetId has changed");
        equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    });

    test(" setId, taking a selector and a string, only default scope", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.Defaults.MaxConnections = -1;
        var e1 = _jsPlumb.addEndpoint("d1"),
            e2 = _jsPlumb.addEndpoint("d2"),
            e3 = _jsPlumb.addEndpoint("d1");

        support.assertEndpointCount("d1", 2, _jsPlumb);
        equal(e1.elementId, "d1", "endpoint has correct element id");
        equal(e3.elementId, "d1", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d1", "anchor has correct element id");
        equal(e3.anchor.elementId, "d1", "anchor has correct element id");

        var c = _jsPlumb.connect({source: e1, target: e2}),
            c2 = _jsPlumb.connect({source: e2, target: e1});

        ok(_jsPlumb.getManagedElements()["d1"] != null, "d1 exists in managed elements");
        ok(_jsPlumb.getManagedElements()["d3"] == null, "d3 does not exist in managed elements");

        _jsPlumb.setId(jsPlumb.getSelector("#d1"), "d3");
        support.assertEndpointCount("d3", 2, _jsPlumb);
        support.assertEndpointCount("d1", 0, _jsPlumb);

        equal(e1.elementId, "d3", "endpoint has correct element id");
        equal(e3.elementId, "d3", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d3", "anchor has correct element id");
        equal(e3.anchor.elementId, "d3", "anchor has correct element id");

        equal(c.sourceId, "d3", "connection's sourceId has changed");
        equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
        equal(c2.targetId, "d3", "connection's targetId has changed");
        equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");

        ok(_jsPlumb.getManagedElements()["d1"] == null, "d1 removed from managed elements");
        ok(_jsPlumb.getManagedElements()["d3"] != null, "d3 exists in managed elements");

    });

    test(" setId, taking a DOM element and a string, only default scope", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.Defaults.MaxConnections = -1;
        var e1 = _jsPlumb.addEndpoint("d1"),
            e2 = _jsPlumb.addEndpoint("d2"),
            e3 = _jsPlumb.addEndpoint("d1");

        support.assertEndpointCount("d1", 2, _jsPlumb);
        equal(e1.elementId, "d1", "endpoint has correct element id");
        equal(e3.elementId, "d1", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d1", "anchor has correct element id");
        equal(e3.anchor.elementId, "d1", "anchor has correct element id");

        var c = _jsPlumb.connect({source: e1, target: e2}),
            c2 = _jsPlumb.connect({source: e2, target: e1});

        _jsPlumb.setId(document.getElementById("d1"), "d3");
        support.assertEndpointCount("d3", 2, _jsPlumb);
        support.assertEndpointCount("d1", 0, _jsPlumb);

        equal(e1.elementId, "d3", "endpoint has correct element id");
        equal(e3.elementId, "d3", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d3", "anchor has correct element id");
        equal(e3.anchor.elementId, "d3", "anchor has correct element id");

        equal(c.sourceId, "d3", "connection's sourceId has changed");
        equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
        equal(c2.targetId, "d3", "connection's targetId has changed");
        equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    });

    test(" setId, taking two strings, mix of scopes", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.Defaults.MaxConnections = -1;
        var e1 = _jsPlumb.addEndpoint("d1"),
            e2 = _jsPlumb.addEndpoint("d2"),
            e3 = _jsPlumb.addEndpoint("d1");

        support.assertEndpointCount("d1", 2, _jsPlumb);
        equal(e1.elementId, "d1", "endpoint has correct element id");
        equal(e3.elementId, "d1", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d1", "anchor has correct element id");
        equal(e3.anchor.elementId, "d1", "anchor has correct element id");

        var c = _jsPlumb.connect({source: e1, target: e2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: e2, target: e1});

        _jsPlumb.setId("d1", "d3");
        support.assertEndpointCount("d3", 2, _jsPlumb);
        support.assertEndpointCount("d1", 0, _jsPlumb);

        equal(e1.elementId, "d3", "endpoint has correct element id");
        equal(e3.elementId, "d3", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d3", "anchor has correct element id");
        equal(e3.anchor.elementId, "d3", "anchor has correct element id");

        equal(c.sourceId, "d3", "connection's sourceId has changed");
        equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
        equal(c2.targetId, "d3", "connection's targetId has changed");
        equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    });

    test(" setId, taking a selector and a string, mix of scopes", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.Defaults.MaxConnections = -1;
        var e1 = _jsPlumb.addEndpoint("d1"),
            e2 = _jsPlumb.addEndpoint("d2"),
            e3 = _jsPlumb.addEndpoint("d1");

        support.assertEndpointCount("d1", 2, _jsPlumb);
        equal(e1.elementId, "d1", "endpoint has correct element id");
        equal(e3.elementId, "d1", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d1", "anchor has correct element id");
        equal(e3.anchor.elementId, "d1", "anchor has correct element id");

        var c = _jsPlumb.connect({source: e1, target: e2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: e2, target: e1});

        _jsPlumb.setId(jsPlumb.getSelector("#d1"), "d3");
        support.assertEndpointCount("d3", 2, _jsPlumb);
        support.assertEndpointCount("d1", 0, _jsPlumb);

        equal(e1.elementId, "d3", "endpoint has correct element id");
        equal(e3.elementId, "d3", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d3", "anchor has correct element id");
        equal(e3.anchor.elementId, "d3", "anchor has correct element id");

        equal(c.sourceId, "d3", "connection's sourceId has changed");
        equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
        equal(c2.targetId, "d3", "connection's targetId has changed");
        equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    });

    test(" setId, taking a DOM element and a string, mix of scopes", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.Defaults.MaxConnections = -1;
        var e1 = _jsPlumb.addEndpoint("d1"),
            e2 = _jsPlumb.addEndpoint("d2"),
            e3 = _jsPlumb.addEndpoint("d1");

        support.assertEndpointCount("d1", 2, _jsPlumb);
        equal(e1.elementId, "d1", "endpoint has correct element id");
        equal(e3.elementId, "d1", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d1", "anchor has correct element id");
        equal(e3.anchor.elementId, "d1", "anchor has correct element id");

        var c = _jsPlumb.connect({source: e1, target: e2, scope: "FOO"}),
            c2 = _jsPlumb.connect({source: e2, target: e1});

        _jsPlumb.setId(jsPlumb.getSelector("#d1")[0], "d3");
        support.assertEndpointCount("d3", 2, _jsPlumb);
        support.assertEndpointCount("d1", 0, _jsPlumb);

        equal(e1.elementId, "d3", "endpoint has correct element id");
        equal(e3.elementId, "d3", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d3", "anchor has correct element id");
        equal(e3.anchor.elementId, "d3", "anchor has correct element id");

        equal(c.sourceId, "d3", "connection's sourceId has changed");
        equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
        equal(c2.targetId, "d3", "connection's targetId has changed");
        equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    });

    test(" setIdChanged, ", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.Defaults.MaxConnections = -1;
        var e1 = _jsPlumb.addEndpoint("d1"),
            e2 = _jsPlumb.addEndpoint("d2"),
            e3 = _jsPlumb.addEndpoint("d1");

        support.assertEndpointCount("d1", 2, _jsPlumb);
        equal(e1.elementId, "d1", "endpoint has correct element id");
        equal(e3.elementId, "d1", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d1", "anchor has correct element id");
        equal(e3.anchor.elementId, "d1", "anchor has correct element id");

        var c = _jsPlumb.connect({source: e1, target: e2}),
            c2 = _jsPlumb.connect({source: e2, target: e1});

        document.getElementById("d1").setAttribute("id", "d3");

        _jsPlumb.setIdChanged("d1", "d3");

        support.assertEndpointCount("d3", 2, _jsPlumb);
        support.assertEndpointCount("d1", 0, _jsPlumb);

        equal(e1.elementId, "d3", "endpoint has correct element id");
        equal(e3.elementId, "d3", "endpoint has correct element id");
        equal(e1.anchor.elementId, "d3", "anchor has correct element id");
        equal(e3.anchor.elementId, "d3", "anchor has correct element id");

        equal(c.sourceId, "d3", "connection's sourceId has changed");
        equal(c.source.getAttribute("id"), "d3", "connection's source has changed");
        equal(c2.targetId, "d3", "connection's targetId has changed");
        equal(c2.target.getAttribute("id"), "d3", "connection's target has changed");
    });

    test(" setId, taking two strings, testing makeSource/makeTarget", function () {
        var d1 = support.addDiv("d1");
        var d2 = support.addDiv("d2");

        // setup d1 as a source
        _jsPlumb.makeSource("d1", {
            endpoint:"Rectangle",
            parameters:{
                foo:"foo"
            }
        });
        // and d2 as a target
        _jsPlumb.makeTarget("d2", {
            endpoint:"Rectangle"
        });

        // connect them, and check that the endpoints are of tyoe Rectangle, per the makeSource/makeTarget
        // directives
        var c = _jsPlumb.connect({source: "d1", target: "d2"});
        equal(c.endpoints[0].type, "Rectangle", "source endpoint is rectangle");
        equal(c.endpoints[1].type, "Rectangle", "target endpoint is rectangle");

        // now change the id of d1 and connect the new id, and check again that the source endpoint is Rectangle
        _jsPlumb.setId(d1, "foo");
        _jsPlumb.setId(d2, "bar");
        var c2 = _jsPlumb.connect({source: "foo", target: "bar"});
        equal(c2.endpoints[0].type, "Rectangle", "source endpoint is rectangle");
        equal(c2.endpoints[1].type, "Rectangle", "target endpoint is rectangle");

    });

    test(" endpoint hide/show should hide/show overlays", function () {
        support.addDiv("d1");
        var e1 = _jsPlumb.addEndpoint("d1", {
                overlays: [
                    [ "Label", { id: "label", label: "foo" } ]
                ]
            }),
            o = e1.getOverlay("label");

        ok(o.isVisible(), "overlay is initially visible");
        _jsPlumb.hide("d1", true);
        ok(!o.isVisible(), "overlay is no longer visible");
    });

    test(" connection hide/show should hide/show overlays", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2",
                overlays: [
                    [ "Label", { id: "label", label: "foo" } ]
                ]
            }),
            o = c.getOverlay("label");

        ok(o.isVisible(), "overlay is initially visible");
        _jsPlumb.hide("d1", true);
        ok(!o.isVisible(), "overlay is no longer visible");
    });

    test(" select, basic test", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2"}),
            s = _jsPlumb.select({source: "d1"});

        equal(s.length, 1, "one connection selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; dont filter on scope.", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAR"}),
            s = _jsPlumb.select({source: "d1"});

        equal(s.length, 2, "two connections selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scope", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAR"}),
            s = _jsPlumb.select({source: "d1", scope: "FOO"});

        equal(s.length, 1, "one connection selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scopes", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAR"}),
            c3 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAZ"})
        s = _jsPlumb.select({source: "d1", scope: ["FOO", "BAR"]});

        equal(s.length, 2, "two connections selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; scope but no scope filter; single source id", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAR"}),
            c3 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAZ"}),
            c4 = _jsPlumb.connect({source: "d2", target: "d1", scope: "BOZ"}),
            s = _jsPlumb.select({source: "d1"});

        equal(s.length, 3, "three connections selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scopes; single source id", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAR"}),
            c3 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAZ"}),
            c4 = _jsPlumb.connect({source: "d2", target: "d1", scope: "BOZ"}),
            s = _jsPlumb.select({source: "d1", scope: ["FOO", "BAR", "BOZ"]});

        equal(s.length, 2, "two connections selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" setHoverSuspended overrides setHover on connections", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAR"}),
            c3 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAZ"}),
            c4 = _jsPlumb.connect({source: "d2", target: "d1", scope: "BOZ"}),
            s = _jsPlumb.select({source: "d1", scope: ["FOO", "BAR", "BOZ"]});

        _jsPlumb.setHoverSuspended(true);
        s.setHover(true);
        ok(s.get(0).isHover() == false, "connection did not set hover as jsplumb overrides it");
        _jsPlumb.setHoverSuspended(false);
        s.setHover(true);
        ok(s.get(0).isHover(), "connection did set hover as jsplumb override removed");
    });

    test(" select, basic test with multiple scopes; filter on scope; dont supply sourceid", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d1", target: "d2", scope: "BAR"}),
            s = _jsPlumb.select({ scope: "FOO" });

        equal(s.length, 1, "two connections selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" select, basic test with multiple scopes; filter on scope; dont supply sourceid", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({source: "d1", target: "d2", scope: "FOO"}),
            c2 = _jsPlumb.connect({source: "d2", target: "d1", scope: "BAR"}),
            s = _jsPlumb.select({ scope: "FOO" });

        equal(s.length, 1, "two connections selected");
        equal(s.get(0).sourceId, "d1", "d1 is connection source");

        s.setHover(true);
        ok(s.get(0).isHover(), "connection has had hover set to true");
        s.setHover(false);
        ok(!(s.get(0).isHover()), "connection has had hover set to false");
    });

    test(" select, two connections, with overlays", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({
                source: "d1",
                target: "d2",
                overlays: [
                    ["Label", {id: "l"}]
                ]
            }),
            c2 = _jsPlumb.connect({
                source: "d1",
                target: "d2",
                overlays: [
                    ["Label", {id: "l"}]
                ]
            }),
            s = _jsPlumb.select({source: "d1"});

        equal(s.length, 2, "two connections selected");
        ok(s.get(0).getOverlay("l") != null, "connection has overlay");
        ok(s.get(1).getOverlay("l") != null, "connection has overlay");
    });

    test(" select, chaining with setHover and hideOverlay", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: "d1",
            target: "d2",
            overlays: [
                ["Label", {id: "l"}]
            ]
        });
        s = _jsPlumb.select({source: "d1"});

        s.setHover(false).hideOverlay("l");

        ok(!(s.get(0).isHover()), "connection is not hover");
        ok(!(s.get(0).getOverlay("l").isVisible()), "overlay is not visible");
    });

    test(" select, .each function", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: "d" + i,
                target: "d" + (i * 10)
            });
        }

        var s = _jsPlumb.select();
        equal(s.length, 5, "there are five connections");

        var t = "";
        s.each(function (connection) {
            t += "f";
        });
        equal("fffff", t, ".each is working");
    });

    test(" select, multiple connections + chaining", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: "d" + i,
                target: "d" + (i * 10),
                overlays: [
                    ["Arrow", {location: 0.3}],
                    ["Arrow", {location: 0.7}]
                ]
            });
        }

        var s = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").setHover(false).setLabel("baz");
        equal(s.length, 5, "there are five connections");

        for (var j = 0; j < 5; j++) {
            equal(_length(s.get(j).getOverlays()), 1, "one overlay: the label");
            equal(s.get(j).getParameter("foo"), "bar", "parameter foo has value 'bar'");
            ok(!(s.get(j).isHover()), "hover is set to false");
            equal(s.get(j).getLabel(), "baz", "label is set to 'baz'");
        }
    });

    test(" select, simple getter", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: "d" + i,
                target: "d" + (i * 10),
                label: "FOO"
            });
        }

        var lbls = _jsPlumb.select().getLabel();
        equal(lbls.length, 5, "there are five labels");

        for (var j = 0; j < 5; j++) {
            equal(lbls[j][0], "FOO", "label has value 'FOO'");
        }
    });

    test(" select, getter + chaining", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: "d" + i,
                target: "d" + (i * 10),
                label: "FOO"
            });
        }

        var params = _jsPlumb.select().removeAllOverlays().setParameter("foo", "bar").getParameter("foo");
        equal(params.length, 5, "there are five params");

        for (var j = 0; j < 5; j++) {
            equal(params[j][0], "bar", "parameter has value 'bar'");
        }
    });


    test(" select, detach method", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: "d" + i,
                target: "d" + (i * 10),
                label: "FOO"
            });
        }

        var params = _jsPlumb.select().delete();

        equal(_jsPlumb.select().length, 0, "there are no connections");
    });

    test(" select, repaint method", function () {
        for (var i = 1; i < 6; i++) {
            support.addDiv("d" + i);
            support.addDiv("d" + (i * 10));
            _jsPlumb.connect({
                source: "d" + i,
                target: "d" + (i * 10),
                label: "FOO"
            });
        }

        var len = _jsPlumb.select().repaint().length;

        equal(len, 5, "there are five connections");
    });


    // selectEndpoints
    test(" selectEndpoints, basic tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d1);

        equal(_jsPlumb.selectEndpoints().length, 2, "there are two endpoints");
        equal(_jsPlumb.selectEndpoints({element: "d1"}).length, 2, "there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: "d2"}).length, 0, "there are 0 endpoints on d2");

        equal(_jsPlumb.selectEndpoints({source: "d1"}).length, 0, "there are zero source endpoints on d1");
        equal(_jsPlumb.selectEndpoints({target: "d1"}).length, 0, "there are zero target endpoints on d1");
        equal(_jsPlumb.selectEndpoints({source: "d2"}).length, 0, "there are zero source endpoints on d2");
        equal(_jsPlumb.selectEndpoints({target: "d2"}).length, 0, "there are zero target endpoints on d2");

        equal(_jsPlumb.selectEndpoints({source: "d1", scope: "FOO"}).length, 0, "there are zero source endpoints on d1 with scope FOO");

        _jsPlumb.addEndpoint("d2", { scope: "FOO", isSource: true });
        equal(_jsPlumb.selectEndpoints({source: "d2", scope: "FOO"}).length, 1, "there is one source endpoint on d2 with scope FOO");

        equal(_jsPlumb.selectEndpoints({element: ["d2", "d1"]}).length, 3, "there are three endpoints between d2 and d1");
    });

    test(" selectEndpoints, basic tests, various input argument formats", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d1);

        equal(_jsPlumb.selectEndpoints({element: "d1"}).length, 2, "using id, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: d1}).length, 2, "using dom element, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: jsPlumb.getSelector("#d1")}).length, 2, "using selector, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: jsPlumb.getSelector(d1)}).length, 2, "using selector with dom element, there are two endpoints on d1");

    });

    test(" selectEndpoints, basic tests, scope", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {scope: "FOO"}),
            e2 = _jsPlumb.addEndpoint(d1);

        equal(_jsPlumb.selectEndpoints({element: "d1"}).length, 2, "using id, there are two endpoints on d1");
        equal(_jsPlumb.selectEndpoints({element: "d1", scope: "FOO"}).length, 1, "using id, there is one endpoint on d1 with scope 'FOO'");
        _jsPlumb.addEndpoint(d1, {scope: "BAR"}),
            equal(_jsPlumb.selectEndpoints({element: "d1", scope: "FOO"}).length, 1, "using id, there is one endpoint on d1 with scope 'BAR'");
        equal(_jsPlumb.selectEndpoints({element: "d1", scope: ["BAR", "FOO"]}).length, 2, "using id, there are two endpoints on d1 with scope 'BAR' or 'FOO'");
    });

    test(" selectEndpoints, isSource tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d2, {isSource: true});

        equal(_jsPlumb.selectEndpoints({source: "d1"}).length, 1, "there is one source endpoint on d1");
        equal(_jsPlumb.selectEndpoints({target: "d1"}).length, 0, "there are zero target endpoints on d1");

        equal(_jsPlumb.selectEndpoints({source: "d2"}).length, 1, "there is one source endpoint on d2");

        equal(_jsPlumb.selectEndpoints({source: ["d2", "d1"]}).length, 2, "there are two source endpoints between d1 and d2");
    });

    test(" selectEndpoints, isTarget tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isTarget: true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d2, {isTarget: true});

        equal(_jsPlumb.selectEndpoints({target: "d1"}).length, 1, "there is one target endpoint on d1");
        equal(_jsPlumb.selectEndpoints({source: "d1"}).length, 0, "there are zero source endpoints on d1");

        equal(_jsPlumb.selectEndpoints({target: "d2"}).length, 1, "there is one target endpoint on d2");

        equal(_jsPlumb.selectEndpoints({target: ["d2", "d1"]}).length, 2, "there are two target endpoints between d1 and d2");
    });

    test(" selectEndpoints, isSource + isTarget tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true}),
            e2 = _jsPlumb.addEndpoint(d1),
            e3 = _jsPlumb.addEndpoint(d1, {isSource: true}),
            e4 = _jsPlumb.addEndpoint(d1, {isTarget: true});

        equal(_jsPlumb.selectEndpoints({source: "d1"}).length, 2, "there are two source endpoints on d1");
        equal(_jsPlumb.selectEndpoints({target: "d1"}).length, 2, "there are two target endpoints on d1");

        equal(_jsPlumb.selectEndpoints({target: "d1", source: "d1"}).length, 1, "there is one source and target endpoint on d1");

        equal(_jsPlumb.selectEndpoints({element: "d1"}).length, 4, "there are four endpoints on d1");

    });

    test(" selectEndpoints, delete endpoints", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

        equal(_jsPlumb.selectEndpoints({element: "d1"}).length, 1, "there is one endpoint on d1");
        _jsPlumb.selectEndpoints({source: "d1"}).delete();
        equal(_jsPlumb.selectEndpoints({element: "d1"}).length, 0, "there are zero endpoints on d1");
    });

    test(" selectEndpoints, detach connections", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true}),
            e2 = _jsPlumb.addEndpoint(d2, {isSource: true, isTarget: true});

        _jsPlumb.connect({source: e1, target: e2});

        equal(e1.connections.length, 1, "there is one connection on d1's endpoint");
        equal(e2.connections.length, 1, "there is one connection on d2's endpoint");

        _jsPlumb.selectEndpoints({source: "d1"}).deleteEveryConnection();

        equal(e1.connections.length, 0, "there are zero connections on d1's endpoint");
        equal(e2.connections.length, 0, "there are zero connections on d2's endpoint");
    });

    test(" selectEndpoints, hover tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

        equal(e1.isHover(), false, "hover not set");
        _jsPlumb.selectEndpoints({source: "d1"}).setHover(true);
        equal(e1.isHover(), true, "hover set");
        _jsPlumb.selectEndpoints({source: "d1"}).setHover(false);
        equal(e1.isHover(), false, "hover no longer set");
    });

    test(" selectEndpoints, setEnabled tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

        equal(e1.isEnabled(), true, "endpoint is enabled");
        _jsPlumb.selectEndpoints({source: "d1"}).setEnabled(false);
        equal(e1.isEnabled(), false, "endpoint not enabled");
    });

    test(" selectEndpoints, setEnabled tests", function () {
        var d1 = support.addDiv("d1"), _d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource: true, isTarget: true});

        equal(e1.isEnabled(), true, "endpoint is enabled");
        var e = _jsPlumb.selectEndpoints({source: "d1"}).isEnabled();
        equal(e[0][0], true, "endpoint enabled");
        _jsPlumb.selectEndpoints({source: "d1"}).setEnabled(false);
        e = _jsPlumb.selectEndpoints({source: "d1"}).isEnabled();
        equal(e[0][0], false, "endpoint not enabled");
    });

// setPaintStyle/getPaintStyle tests

    test(" setPaintStyle", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), c = _jsPlumb.connect({source: d1, target: d2});
        c.setPaintStyle({stroke: "FOO", strokeWidth: 999});
        equal(c._jsPlumb.paintStyleInUse.stroke, "FOO", "stroke was set");
        equal(c._jsPlumb.paintStyleInUse.strokeWidth, 999, "strokeWidth was set");

        c.setHoverPaintStyle({stroke: "BAZ", strokeWidth: 444});
        c.setHover(true);
        equal(c._jsPlumb.paintStyleInUse.stroke, "BAZ", "stroke was set");
        equal(c._jsPlumb.paintStyleInUse.strokeWidth, 444, "strokeWidth was set");

        equal(c.getPaintStyle().stroke, "FOO", "getPaintStyle returns correct value");
        equal(c.getHoverPaintStyle().stroke, "BAZ", "getHoverPaintStyle returns correct value");
    });

    //
     //TODO figure out if we want this behaviour or not (components do not share paintStyle objects)
     //
     //test(" clone paint style", function() {
     //var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
     //c = _jsPlumb.connect({source:d1, target:d2, paintStyle:ps}),
     //c2 = _jsPlumb.connect({source:d1, target:d3}),
     //ps = {stroke:"FOO", strokeWidth:999};

     //c2.setPaintStyle(ps);

     //ps.foo = "bar";
     //equal(null, c.getPaintStyle().foo, "foo is not set in c paint style");
     //equal(null, c2.getPaintStyle().foo, "foo is not set in c2 paint style");
     //});


// ------------------------------- manage -----------------------------------------

    test("Manage fires events", function() {
        var d1 = support.addDiv("d1"), f1 = false;
        _jsPlumb.bind("manageElement", function() {
            f1 = true;
        });

        _jsPlumb.manage("d1", d1);
        ok(f1, "manageElement event fired");

        delete _jsPlumb.getManagedElements()["d1"];
        f1 = false;
        _jsPlumb.manage("d1", d1, true);
        ok(!f1, "manageElement event not fired for transient element");
    });


// ******************* getEndpoints ************************************************

    test(" getEndpoints", function () {
        support.addDiv("d1");
        support.addDiv("d2");

        _jsPlumb.addEndpoint("d1");
        _jsPlumb.addEndpoint("d2");
        _jsPlumb.addEndpoint("d1");

        var e = _jsPlumb.getEndpoints("d1"),
            e2 = _jsPlumb.getEndpoints("d2");
        equal(e.length, 2, "two endpoints on d1");
        equal(e2.length, 1, "one endpoint on d2");
    });

// ******************  connection type tests - types, type extension, set types, get types etc. also since 2.0.0
// tests for multiple makeSource/makeTarget on a single element (distinguished by their type/filter params) *****************

    test(" set connection type on existing connection", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO",
            endpoint:"Rectangle"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");
        equal(c.endpoints[0].type, "Dot", "endpoint is not of type rectangle, because that only works for new connections");
    });

    test(" add connection type on existing connection", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        equal(c.getConnector().type, "Bezier", "connector has bezier type before state add");

        c.addType("basic");
        equal(c.getConnector().type, "Flowchart", "connector has Flowchart type after state add");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");
    });

    test(" set connection type on existing connection then change type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO"
        };
        var otherType = {
            connector: "Bezier",
            paintStyle: { stroke: "red", strokeWidth: 14 },
            hoverPaintStyle: { stroke: "green" },
            cssClass: "BAR"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        equal(c.getConnector().type, "Bezier", "connector has bezier type before state change");

        c.setType("basic");
        equal(c.getConnector().type, "Flowchart", "connector has bezier type after state change");
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "hoverPaintStyle stroke is blue");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");

        c.setType("other");
        equal(c.getConnector().type, "Bezier", "connector has bezier type after second state change");
        equal(c.getPaintStyle().strokeWidth, 14, "paintStyle strokeWidth is 14");
        equal(c.getPaintStyle().stroke, "red", "paintStyle stroke is red");
        equal(c.getHoverPaintStyle().stroke, "green", "hoverPaintStyle stroke is green");
        equal(c.getHoverPaintStyle().strokeWidth, 14, "hoverPaintStyle strokeWidth is 14");
        ok(!_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was removed from canvas");
        ok(_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class was set on canvas");
    });

    test(" set connection type on existing connection, overlays should be set", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        equal(_length(c.getOverlays()), 1, "one overlay");
    });

    test(" set connection type on existing connection, overlays should be removed with second type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        var otherType = {
            connector: "Bezier"
        };
        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        c.getConnector().testFlag = true;
        equal(_length(c.getOverlays()), 1, "one overlay after setting `basic` type");
        // set a flag on the overlay; we will test later that re-adding the basic type will not cause a whole new overlay
        // to be created
        _head(c.getOverlays()).testFlag = true;

        c.setType("other");
        equal(_length(c.getOverlays()), 0, "no overlays after setting type to `other`, which has no overlays");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "paintStyle strokeWidth is default");

        c.addType("basic");
        equal(_length(c.getOverlays()), 1, "one overlay after reinstating `basic` type");
        ok(c.getConnector().testFlag, "connector is the one that was created on first application of basic type");
        ok(_head(c.getOverlays()).testFlag, "overlay is the one that was created on first application of basic type");
    });


    test(" set connection type on existing connection, anchors and connectors created only once", function () {
        var basicType = {
            connector: "Flowchart",
            anchor:"Continuous",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        var otherType = {
            connector: "Bezier",
            anchor:"AutoDefault"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        c.getConnector().testFlag = true;
        c.endpoints[0].anchor.testFlag = "source";
        c.endpoints[1].anchor.testFlag = "target";
        _head(c.getOverlays()).testFlag = true;

        c.setType("other");
        c.getConnector().testFlag = true;
        ok(c.endpoints[0].anchor.testFlag == null, "test flag not set on source anchor");
        ok(c.endpoints[1].anchor.testFlag == null, "test flag not set on target anchor");

        c.addType("basic");
        equal(_length(c.getOverlays()), 1, "one overlay after reinstating `basic` type");
        ok(c.getConnector().testFlag, "connector is the one that was created on first application of basic type");
        equal(c.endpoints[0].anchor.testFlag, "source", "test flag still set on source anchor: anchor was reused");
        equal(c.endpoints[1].anchor.testFlag, "target", "test flag still set on target anchor: anchor was reused");
        ok(_head(c.getOverlays()).testFlag, "overlay is the one that was created on first application of basic type");
        ok(_head(c.getOverlays()).path.parentNode != null, "overlay was reattached to the DOM correctly");
    });

    test(" set connection type on existing connection, hasType + toggleType", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };

        _jsPlumb.registerConnectionTypes({
            "basic": basicType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic");
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        c.toggleType("basic");
        equal(c.hasType("basic"), false, "connection does not have 'basic' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        c.toggleType("basic");
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(_length(c.getOverlays()), 1, "one overlay");

    });

    test(" set connection type on existing connection, merge tests", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ],
            cssClass: "FOO"
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            connector: "Bezier",
            paintStyle: { strokeWidth: 14 },
            overlays: [
                ["Arrow", {location: 0.25}]
            ],
            cssClass: "BAR"
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2, overlays:[  [ "Label", {id:"LBL", label:"${lbl}" } ] ]});

        equal(_length(c.getOverlays()), 1, "connectoin has one overlay to begin with");

        c.setType("basic", {lbl:"FOO"});
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has strokeWidth 4");
        equal(_length(c.getOverlays()), 2, "two overlays after setting type to 'basic'");
        equal(c.getOverlay("LBL").getLabel(), "FOO", "overlay's label set via setType parameter");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was set on canvas");

        c.addType("other", {lbl:"BAZ"});
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 3, "three overlays after adding 'other' type");
        ok(_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class is still set on canvas");
        ok(_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class was set on canvas");
        equal(c.getOverlay("LBL").getLabel(), "BAZ", "overlay's label updated via addType parameter is correct");

        c.removeType("basic", {lbl:"FOO"});
        equal(c.hasType("basic"), false, "connection does not have 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 2, "two overlays after removing 'basic' type");
        ok(!_jsPlumb.hasClass(c.canvas, "FOO"), "FOO class was removed from canvas");
        ok(_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class is still set on canvas");
        equal(c.getOverlay("LBL").getLabel(), "FOO", "overlay's label updated via removeType parameter is correct");

        c.toggleType("other");
        equal(c.hasType("other"), false, "connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "connection has default strokeWidth");
        equal(_length(c.getOverlays()), 1, "one overlay after toggling 'other' type. this is the original overlay now.");
        ok(!_jsPlumb.hasClass(c.canvas, "BAR"), "BAR class was removed from canvas");

        c.removeOverlay("LBL");
        equal(_length(c.getOverlays()), 0, "zero overlays after removing the original overlay.");
    });

    test("connection type tests, check overlays do not disappear", function () {
        var connectionTypes = {};
        connectionTypes["normal"] = {
            paintStyle: {
                stroke: "gray",
                strokeWidth: 3,
                cssClass: "normal"
            },
            hoverPaintStyle: {
                stroke: "#64c8c8",
                strokeWidth: 3
            }
        };
        connectionTypes["selected"] = {
            paintStyle: {
                stroke: "blue",
                strokeWidth: 3,
                cssClass: "selected"

            },
            hoverPaintStyle: {
                stroke: "#64c8c8",
                strokeWidth: 3
            }
        };

        _jsPlumb.registerConnectionTypes(connectionTypes);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({
            source: d1,
            target: d2,
            detachable: true,
            overlays: [
                ["Label",
                    {
                        label: "hello",
                        location: 50,
                        id: "myLabel1",
                        cssClass: "connectionLabel"
                    }
                ]
            ],
            type: "normal"
        });

        var labelOverlay = c.getOverlay("myLabel1");
        ok(labelOverlay != null, "label overlay was retrieved");
        labelOverlay.setLabel("foo");
        ok(labelOverlay.getLabel() === "foo", "label set correctly on overlay");

        c.addType("selected");
        labelOverlay = c.getOverlay("myLabel1");
        ok(labelOverlay != null, "label overlay was not blown away");
        c.removeType("selected");
        labelOverlay = c.getOverlay("myLabel1");
        ok(labelOverlay != null, "label overlay was not blown away");

        // see issue #311
        //ok(labelOverlay.getLabel() === "foo", "label set correctly on overlay");
    });

    test("endpoint type tests, check overlays do not disappear", function () {
        var epTypes = {};
        epTypes["normal"] = {
            paintStyle: {
                fill: "gray",
                cssClass: "normal"
            }
        };
        epTypes["selected"] = {
            paintStyle: {
                fill: "blue",
                cssClass: "selected"

            },
            hoverPaintStyle: {
                stroke: "#64c8c8",
                strokeWidth: 3
            }
        };

        _jsPlumb.registerEndpointTypes(epTypes);

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e = _jsPlumb.addEndpoint(d1, {
            overlays: [
                ["Label",
                    {
                        label: "hello",
                        location: 50,
                        id: "myLabel1",
                        cssClass: "connectionLabel"
                    }
                ]
            ],
            type: "normal"
        });

        ok(e.getOverlay("myLabel1") != null, "label overlay was retrieved");

        e.addType("selected");
        ok(e.getOverlay("myLabel1") != null, "label overlay was not blown away");
        e.removeType("selected");
        ok(e.getOverlay("myLabel1") != null, "label overlay was not blown away");
    });

    test(" connection type tests, space separated arguments", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            connector: "Bezier",
            paintStyle: { strokeWidth: 14 },
            overlays: [
                ["Arrow", {location: 0.25}]
            ]
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic other");
        equal(c.hasType("basic"), true, "connection has 'basic' type");
        equal(c.hasType("other"), true, "connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 2, "two overlays");

        c.toggleType("other basic");
        equal(c.hasType("basic"), false, "after toggle, connection does not have 'basic' type");
        equal(c.hasType("other"), false, "after toggle, connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "after toggle, connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "after toggle, connection has default strokeWidth");
        equal(_length(c.getOverlays()), 0, "after toggle, no overlays");

        c.toggleType("basic other");
        equal(c.hasType("basic"), true, "after toggle again, connection has 'basic' type");
        equal(c.hasType("other"), true, "after toggle again, connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "after toggle again, connection has yellow stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "after toggle again, connection has strokeWidth 14");
        equal(_length(c.getOverlays()), 2, "after toggle again, two overlays");

        c.removeType("other basic");
        equal(c.hasType("basic"), false, "after remove, connection does not have 'basic' type");
        equal(c.hasType("other"), false, "after remove, connection does not have 'other' type");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "after remove, connection has default stroke style");
        equal(c.getPaintStyle().strokeWidth, _jsPlumb.Defaults.PaintStyle.strokeWidth, "after remove, connection has default strokeWidth");
        equal(_length(c.getOverlays()), 0, "after remove, no overlays");

        c.addType("other basic");
        equal(c.hasType("basic"), true, "after add, connection has 'basic' type");
        equal(c.hasType("other"), true, "after add, connection has 'other' type");
        equal(c.getPaintStyle().stroke, "yellow", "after add, connection has yellow stroke style");
        // NOTE here we added the types in the other order to before, so strokeWidth 4 - from basic - should win.
        equal(c.getPaintStyle().strokeWidth, 4, "after add, connection has strokeWidth 4");
        equal(_length(c.getOverlays()), 2, "after add, two overlays");
    });

    test(" connection type tests, fluid interface", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            connector: "Bezier",
            paintStyle: { strokeWidth: 14 },
            overlays: [
                ["Arrow", {location: 0.25}]
            ]
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2}),
            c2 = _jsPlumb.connect({source: d2, target: d3});

        _jsPlumb.select().addType("basic");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c2.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");

        _jsPlumb.select().toggleType("basic");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        equal(c2.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

        _jsPlumb.select().addType("basic");
        equal(c.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");
        equal(c2.getPaintStyle().stroke, "yellow", "connection has yellow stroke style");

        _jsPlumb.select().removeType("basic").addType("other");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");
        equal(c2.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");


    });

    test(" connection type tests, two types, check separation", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 }
        };
        // this tests all three merge types: connector should overwrite, strokeWidth should be inserted into
        // basic type's params, and arrow overlay should be added to list to end up with two overlays
        var otherType = {
            paintStyle: { stroke: "red", strokeWidth: 14 }
        };
        _jsPlumb.registerConnectionTypes({
            "basic": basicType,
            "other": otherType
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2}),
            c2 = _jsPlumb.connect({source: d2, target: d3});
        c.setType("basic");
        equal(c.getPaintStyle().stroke, "yellow", "first connection has yellow stroke style");
        c2.setType("other");

        equal(c.getPaintStyle().stroke, "yellow", "first connection has yellow stroke style");


    });

    test(" setType when null", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType(null);
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

    });

    test(" setType to unknown type", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("foo");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

    });

    test(" setType to mix of known and unknown types", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        _jsPlumb.registerConnectionType("basic", {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        });

        c.setType("basic foo");
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");

        c.toggleType("foo");
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");

        c.removeType("basic baz");
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

        c.addType("basic foo bar baz");
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");

    });

    test(" create connection using type parameter", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.Defaults.PaintStyle = {stroke: "blue", strokeWidth: 34};

        _jsPlumb.registerConnectionTypes({
            "basic": {
                connector: "Flowchart",
                paintStyle: { stroke: "yellow", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "blue" },
                overlays: [
                    "Arrow"
                ],
                endpoint:"Rectangle"
            },
            "other": {
                paintStyle: { strokeWidth: 14 }
            }
        });

        equal(_jsPlumb.Defaults.PaintStyle.stroke, "blue", "default value has not been messed up");

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getPaintStyle().stroke, _jsPlumb.Defaults.PaintStyle.stroke, "connection has default stroke style");

        c = _jsPlumb.connect({source: d1, target: d2, type: "basic other"});
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 14, "connection has other type's strokeWidth");
        equal(c.endpoints[0].type, "Rectangle", "endpoint is of type rectangle");

    });

    test(" makeSource connection type is honoured", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.Defaults.PaintStyle = {stroke: "blue", strokeWidth: 34};

        _jsPlumb.registerConnectionTypes({
            "basic": {
                connector: "Flowchart",
                paintStyle: { stroke: "yellow", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "blue" },
                overlays: [
                    "Arrow"
                ],
                endpoint:"Rectangle"
            }
        });

        _jsPlumb.makeSource(d1, {
            connectionType:"basic"
        });

        var c = _jsPlumb.connect({source: d1, target: d2, type:"basic"});
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has basic type's strokeWidth");
        equal(c.endpoints[0].type, "Rectangle", "endpoint is of type rectangle");

        _jsPlumb.deleteConnection(c);

        _jsPlumb.makeTarget(d2, {
            endpoint:"Blank"
        });

        c = support.dragConnection(d1, d2);
        c = _jsPlumb.select().get(0);
        equal(c.getPaintStyle().stroke, "yellow", "connection has basic type's stroke style");
        equal(c.getPaintStyle().strokeWidth, 4, "connection has basic type's strokeWidth");
        equal(c.endpoints[0].type, "Rectangle", "source endpoint is of type rectangle");
        equal(c.endpoints[1].type, "Blank", "target endpoint is of type Blank - it was overriden from the type's endpoint.");
    });

    test(" setType, scope", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        _jsPlumb.registerConnectionType("basic", {
            connector: "Flowchart",
            scope: "BANANA",
            detachable: false,
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        });

        _jsPlumb.Defaults.ConnectionsDetachable = true;//just make sure we've setup the test correctly.

        c.setType("basic");
        equal(c.scope, "BANANA", "scope is correct");
        equal(c.isDetachable(), false, "not detachable");

    });

    test(" setType, parameters", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");

        _jsPlumb.registerConnectionType("basic", {
            parameters: {
                foo: 1,
                bar: 2,
                baz: 6785962437582
            }
        });

        _jsPlumb.registerConnectionType("frank", {
            parameters: {
                bar: 5
            }
        });

        // first try creating one with the parameters
        c = _jsPlumb.connect({source: d1, target: d2, type: "basic"});

        equal(c.getParameter("foo"), 1, "foo param correct");
        equal(c.getParameter("bar"), 2, "bar param correct");

        c.addType("frank");
        equal(c.getParameter("foo"), 1, "foo param correct");
        equal(c.getParameter("bar"), 5, "bar param correct");
    });

    test(" set connection type on existing connection, parameterised type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "${strokeColor}", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" }
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({source: d1, target: d2});

        c.setType("basic", { strokeColor: "yellow" });
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");
    });

    test(" create connection with parameterised type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "${strokeColor}", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays:[
                ["Label", {id:"one", label:"one" }],
                ["Label", {id:"two", label:"${label}" }],
                ["Label", {id:"three", label:"${missing}" }]
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                type: "basic",
                data: { strokeColor: "yellow", label:"label" }
            });

        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");

        var o1 = c.getOverlay("one");
        equal(o1.getLabel(),"one", "static label set correctly");
        var o2 = c.getOverlay("two");
        equal(o2.getLabel(), "label", "parameterised label with provided value set correctly");
        var o3 = c.getOverlay("three");
        equal(o3.getLabel(), "", "parameterised label with missing value set correctly");
    });

    test(" create connection with parameterised type, label", function () {
        var basicType = {
            connector: "Flowchart",
            overlays: [
                [ "Label", { label: "${label}", id: "label"} ]
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                type: "basic",
                data: { label: "LABEL" }
            }),
            l = c.getOverlay("label");

        equal(l.getLabel(), "LABEL", "label is set correctly");

    });

    test(" create connection with parameterised type, label, value empty", function () {
        var basicType = {
            connector: "Flowchart",
            overlays: [
                [ "Label", { label: "${label}", id: "label"} ]
            ]
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2,
                type: "basic",
                data: {  }
            }),
            l = c.getOverlay("label");

        equal(l.getLabel(), "", "label is blank when no value provided");

    });

    test(" reapply parameterised type", function () {
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "${strokeColor}", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" }
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            c = _jsPlumb.connect({
                source: d1,
                target: d2
            });

        c.addType("basic", { strokeColor: "yellow" });
        equal(c.getPaintStyle().strokeWidth, 4, "paintStyle strokeWidth is 4");
        equal(c.getPaintStyle().stroke, "yellow", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().stroke, "blue", "paintStyle stroke is yellow");
        equal(c.getHoverPaintStyle().strokeWidth, 4, "hoverPaintStyle strokeWidth is 6");

        c.reapplyTypes({ strokeColor: "green" });
        equal(c.getPaintStyle().stroke, "green", "paintStyle stroke is now green");
    });

    test(" setType, scope, two types", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            c = _jsPlumb.connect({source: d1, target: d2});

        _jsPlumb.registerConnectionType("basic", {
            connector: "Flowchart",
            scope: "BANANA",
            detachable: false,
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            overlays: [
                "Arrow"
            ]
        });

        _jsPlumb.registerConnectionType("frank", {
            scope: "OVERRIDE",
            detachable: true
        });

        _jsPlumb.Defaults.ConnectionsDetachable = true;//just make sure we've setup the test correctly.

        c.setType("basic frank");
        equal(c.scope, "OVERRIDE", "scope is correct");
        equal(c.isDetachable(), true, "detachable");

    });

    test(" create connection from Endpoints - type should be passed through.", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, {
                connectionType: "basic"
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                connectionType: "basic"
            });

        _jsPlumb.registerConnectionTypes({
            "basic": {
                paintStyle: { stroke: "blue", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "red" },
                overlays: [
                    "Arrow"
                ]
            },
            "other": {
                paintStyle: { strokeWidth: 14 }
            }
        });

        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(c.getPaintStyle().stroke, "blue", "connection has default stroke style");
    });

    test(" simple Endpoint type tests.", function () {
        _jsPlumb.registerEndpointType("basic", {
            paintStyle: {fill: "blue"},
            cssClass: "FOO"
        });

        _jsPlumb.registerEndpointType("other", {
            paintStyle: {fill: "blue"},
            cssClass: "BAR"
        });

        var d = support.addDiv('d1'), e = _jsPlumb.addEndpoint(d);
        e.setType("basic");
        equal(e.getPaintStyle().fill, "blue", "fill style is correct");
        ok(jsPlumb.hasClass(e.canvas, "FOO"), "css class was set");
        e.removeType("basic");
        ok(!jsPlumb.hasClass(e.canvas, "FOO"), "css class was removed");

        // add basic type again; FOO should be back
        e.addType("basic");
        ok(jsPlumb.hasClass(e.canvas, "FOO"), "css class was set");
        // now set type to something else: FOO should be removed.
        e.setType("other");
        ok(!jsPlumb.hasClass(e.canvas, "FOO"), "FOO css class was removed");
        ok(jsPlumb.hasClass(e.canvas, "BAR"), "BAR css class was added");

        // toggle type: now BAR css class should be removed
        e.toggleType("other");
        ok(!jsPlumb.hasClass(e.canvas, "BAR"), "BAR css class was removed");

        var d2 = support.addDiv('d2'), e2 = _jsPlumb.addEndpoint(d2, {type: "basic"});
        equal(e2.getPaintStyle().fill, "blue", "fill style is correct");
    });

    test(" clearTypes", function () {
        _jsPlumb.registerEndpointType("basic", {
            paintStyle: {fill: "blue"},
            cssClass: "FOO"
        });

        var d = support.addDiv('d1'), e = _jsPlumb.addEndpoint(d);
        e.setType("basic");
        equal(e.getPaintStyle().fill, "blue", "fill style is correct");
        ok(jsPlumb.hasClass(e.canvas, "FOO"), "css class was set");

        e.clearTypes();
        ok(!jsPlumb.hasClass(e.canvas, "FOO"), "FOO css class was removed");
    });

    test(" new Endpoint, prefer endpointStyle to paintStyle.", function () {

        var d = support.addDiv('d1'),
            e = _jsPlumb.addEndpoint(d, {
                paintStyle: {fill: "blue"},
                endpointStyle: {fill: "green"},
                hoverPaintStyle: {fill: "red"},
                endpointHoverStyle: {fill: "yellow"}
            });

        equal(e.getPaintStyle().fill, "green", "fill style is correct");
        e.setHover(true);
        equal(e.getHoverPaintStyle().fill, "yellow", "fill style is correct");
    });

    test(" Endpoint type, prefer endpointStyle to paintStyle.", function () {
        _jsPlumb.registerEndpointType("basic", {
            paintStyle: {fill: "blue"},
            endpointStyle: {fill: "green"},
            hoverPaintStyle: {fill: "red"},
            endpointHoverStyle: {fill: "yellow"}
        });

        var d = support.addDiv('d1'), e = _jsPlumb.addEndpoint(d);
        e.setType("basic");
        equal(e.getPaintStyle().fill, "green", "fill style is correct");
        e.setHover(true);
        equal(e.getHoverPaintStyle().fill, "yellow", "fill style is correct");
    });

    test(" create connection from Endpoints - with connector settings in Endpoint type.", function () {

        _jsPlumb.registerEndpointTypes({
            "basic": {
                connector: "Flowchart",
                connectorOverlays: [
                    "Arrow"
                ],
                connectorStyle: {stroke: "green" },
                connectorHoverStyle: {strokeWidth: 534 },
                paintStyle: { fill: "blue" },
                hoverPaintStyle: { stroke: "red" },
                overlays: [
                    "Arrow"
                ]
            },
            "other": {
                paintStyle: { fill: "red" }
            }
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, {
                type: "basic"
            }),
            e2 = _jsPlumb.addEndpoint(d2);

        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(e1.getPaintStyle().fill, "blue", "endpoint has fill style specified in Endpoint type");
        equal(c.getPaintStyle().stroke, "green", "connection has stroke style specified in Endpoint type");
        equal(c.getHoverPaintStyle().strokeWidth, 534, "connection has hover style specified in Endpoint type");
        equal(c.getConnector().type, "Flowchart", "connector is Flowchart");
        equal(_length(c._jsPlumb.overlays), 1, "connector has one overlay");
        equal(_length(e1._jsPlumb.overlays), 1, "endpoint has one overlay");
    });

    test(" create connection from Endpoints - type should be passed through.", function () {

        _jsPlumb.registerConnectionTypes({
            "basic": {
                paintStyle: { stroke: "bazona", strokeWidth: 4 },
                hoverPaintStyle: { stroke: "red" },
                overlays: [
                    "Arrow"
                ]
            }
        });

        _jsPlumb.registerEndpointType("basic", {
            connectionType: "basic",
            paintStyle: {fill: "GAZOODA"}
        });

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, {
                type: "basic"
            }),
            e2 = _jsPlumb.addEndpoint(d2);

        c = _jsPlumb.connect({source: e1, target: e2});
        equal(e1.getPaintStyle().fill, "GAZOODA", "endpoint has correct paint style, from type.");
        equal(c.getPaintStyle().stroke, "bazona", "connection has paint style from connection type, as specified in endpoint type. sweet!");
    });

    test(" endpoint type", function () {
        _jsPlumb.registerEndpointTypes({"example": {hoverPaintStyle: null}});
        //OR
        //jsPlumb.registerEndpointType("example", {hoverPaintStyle: null});

        var d = support.addDiv("d");
        _jsPlumb.addEndpoint(d, {type: "example"});
        _jsPlumb.repaint(d);

        expect(0);
    });


    test(" multiple makeSource registrations, switched by connectionType", function () {
        _jsPlumb.importDefaults({
            PaintStyle:{strokeWidth:10, stroke:"red"}
        });
        var basicType = {
            connector: "Flowchart",
            paintStyle: { stroke: "yellow", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "blue" },
            cssClass: "FOO"
        };
        var otherType = {
            connector: "Straight",
            paintStyle: { stroke: "red", strokeWidth: 14 },
            hoverPaintStyle: { stroke: "green" },
            cssClass: "BAR"
        };

        _jsPlumb.registerConnectionType("basic", basicType);
        _jsPlumb.registerConnectionType("other", otherType);
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        _jsPlumb.makeSource(d1, {
            connectionType:"basic",
            endpoint:"Blank"
        });

        // make a connection with type not provided; we should get the jsplumb defaults, as no default makeSource
        // registration has been made.
        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(c.getPaintStyle().strokeWidth, 10, "connect without type specified gives default type");
        ok(!jsPlumb.hasClass(c.getConnector().canvas, "FOO"), "css class not set on connector");

        // make a connection whose type matches a register makeSource type; we should get its params.
        var c2 = _jsPlumb.connect({source: d1, target: d2, type:"basic"});
        equal(c2.getPaintStyle().strokeWidth, 4, "connect with type specified matches");
        ok(jsPlumb.hasClass(c2.getConnector().canvas, "FOO"), "css class set on connector");
        equal(c2.endpoints[0].type, "Blank", "source endpoint is blank, per basic type spec");

        // next makeSource with a different type and try to match it:
        _jsPlumb.makeSource(d1, {
            connectionType:"other",
            endpoint:"Rectangle"
        });

        var c3 = _jsPlumb.connect({source: d1, target: d2, type:"other"});
        equal(c3.getPaintStyle().strokeWidth, 14, "connect with type specified matches");
        ok(jsPlumb.hasClass(c3.getConnector().canvas, "BAR"), "css class set on connector");
        equal(c3.endpoints[0].type, "Rectangle", "source endpoint is Rectangle, per basic type spec");


        // finally add a default registration and connect without specifying type


        /*var c2 = _jsPlumb.connect({source: d1, target: d2, type:"other"});
        equal(c2.getPaintStyle().strokeWidth, 14, "connect with type specified matches");*/

    });


// elements


    test("svg gradients cleaned up correctly", function() {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var c = _jsPlumb.connect({source:d1, target:d2, paintStyle:{
            gradient: {stops: [
                [0, "#678678"],
                [0.5, "#09098e"],
                [1, "#678678"]
            ]},
            strokeWidth: 5,
            stroke: "#678678",
            dashstyle: "2 2"
        }});

        var defs = c.canvas.querySelectorAll("defs");
        equal(defs.length, 1, "1 defs element");

        _jsPlumb.draggable(d1);

        support.dragANodeAround(d1);

        defs = c.canvas.querySelectorAll("defs");
        equal(defs.length, 1, "1 defs element");
    });

    test("node drag events", function() {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var started = false, dragged = false, stopped = false;

        _jsPlumb.draggable(d1, {
            start:function() { started = true; },
            drag:function() { dragged = true; },
            stop:function() { stopped = true; }
        });

        support.dragANodeAround(d1);

        ok(started, "start event fired");
        ok(dragged, "drag event fired");
        ok(stopped, "stop event fired");

        started = false; dragged = false; stopped = false;
        var started2 = false, dragged2 = false, stopped2 = false;

        _jsPlumb.draggable(d1, {
            start:function() { started2 = true; },
            drag:function() { dragged2 = true; },
            stop:function() { stopped2 = true; },
            force:true
        });

        support.dragANodeAround(d1);

        ok(started, "start event fired");
        ok(dragged, "drag event fired");
        ok(stopped, "stop event fired");
        ok(started2, "2nd start event fired");
        ok(dragged2, "2nd drag event fired");
        ok(stopped2, "2nd stop event fired");
    });

// ------------- utility functions - math stuff, mostly --------------------------

    var tolerance = 0.00000005, withinTolerance = function (v1, v2, msg) {
        if (Math.abs(v1 - v2) < tolerance) ok(true, msg + "; expected " + v1 + " and got it");
        else {
            ok(false, msg + "; expected " + v1 + " got " + v2);
        }
    };

    var types = [
        { v: { "foo": "bar" }, t: "Object" },
        { v: null, t: "Null" },
        { v: 123, t: "Number" },
        { v: "foo", t: "String" },
        { v: [1, 2, 3], t: "Array" },
        { v: true, t: "Boolean" },
        { v: new Date(), t: "Date" },
        { v: function () {
        }, t: "Function" }
    ];

    test("jsPlumbUtil typeof functions", function () {
        for (var i = 0; i < types.length; i++) {
            var v = types[i].v, f = jsPlumbUtil["is" + types[i].t];
            // first, test that the object type is identified correctly
            equal(f(v), true, types[i].t + " is recognised as " + types[i].t);
            // now test that everything else is recognised as not being of this type
            for (var j = 0; j < types.length; j++) {
                if (i != j) {
                    var v2 = types[j].v;
                    equal(f(v2), false, types[j].t + " is not recognised as " + types[i].t);
                }
            }
        }
    });

    test("jsPlumb.extend, filter values", function () {
        var n = ["foo", "bar", "baz"],
            t = {"hello": "hello", "foo": "replaced"},
            f = {"foo": "new", "bar": "bar"};

        jsPlumb.extend(t, f, n);
        equal(t.foo, "new");
        equal(t.hello, "hello");
        equal(t.bar, "bar");
    });

    // -- geometry tests have been moved into the jtk-geom project (because that's where the code is now) ---


    test(" arc segment tests", function () {
        var r = 10, circ = 2 * Math.PI * r;
        // first, an arc up and to the right (clockwise)
        var params = { r: r, x1: 0, y1: 0, x2: 10, y2: -10, cx: 10, cy: 0 };
        var s = new jsPlumb.Segments["Arc"](params);
        // segment should be one quarter of the circumference
        equal(s.getLength(), 0.25 * circ, "length of segment is correct");
        // point 0 is (0,0)
        var p1 = s.pointOnPath(0);
        within(p1.x, 0, ok, "start x is correct");
        within(p1.y, 0, ok, "start y is correct");
        // point 1 is (10, -10)
        var p2 = s.pointOnPath(1);
        within(p2.x, 10, ok, "end x is correct");
        within(p2.y, -10, ok, "end y is correct");
        // point at loc 0.5 is (2.92, -7.07))
        var p3 = s.pointOnPath(0.5);
        within(p3.x, 10 - (Math.sqrt(2) / 2 * 10), ok, "end x is correct");
        within(p3.y, -(Math.sqrt(2) / 2 * 10), ok, "end y is correct");
        // gradients
        equal(s.gradientAtPoint(0), -Infinity, "gradient at location 0 is -Infinity");
        equal(s.gradientAtPoint(1), 0, "gradient at location 1 is 0");
        within(s.gradientAtPoint(0.5), -1, ok, "gradient at location 0.5 is -1");

        // an arc up and to the left (anticlockwise)
        params = { r: r, x1: 0, y1: 0, x2: -10, y2: -10, cx: -10, cy: 0, ac: true };
        s = new jsPlumb.Segments["Arc"](params);
        equal(s.getLength(), 0.25 * circ, "length of segment is correct");
        // point 0 is (0,0)
        p1 = s.pointOnPath(0);
        within(p1.x, 0, ok, "start x is correct");
        within(p1.y, 0, ok, "start y is correct");
        // point 1 is (-10, -10)
        p2 = s.pointOnPath(1);
        within(p2.x, -10, ok, "end x is correct");
        within(p2.y, -10, ok, "end y is correct");
        // point at loc 0.5 is (-2.92, -7.07))
        p3 = s.pointOnPath(0.5);
        within(p3.x, -2.9289321881345245, ok, "end x is correct");
        within(p3.y, -7.071067811865477, ok, "end y is correct");
        // gradients
        equal(s.gradientAtPoint(0), -Infinity, "gradient at location 0 is -Infinity");
        equal(s.gradientAtPoint(1), 0, "gradient at location 1 is 0");
        within(s.gradientAtPoint(0.5), 1, ok, "gradient at location 0.5 is 1");


        // clockwise, 180 degrees
        params = { r: r, x1: 0, y1: 0, x2: 0, y2: 20, cx: 0, cy: 10 };
        s = new jsPlumb.Segments["Arc"](params);
        equal(s.getLength(), 0.5 * circ, "length of segment is correct");
        p1 = s.pointOnPath(0);
        within(p1.x, 0, ok, "start x is correct");
        within(p1.y, 0, ok, "start y is correct");
        p2 = s.pointOnPath(1);
        within(p2.x, 0, ok, "end x is correct");
        within(p2.y, 20, ok, "end y is correct");
        var p3 = s.pointOnPath(0.5);
        within(p3.x, 10, ok, "end x is correct");
        within(p3.y, 10, ok, "end y is correct");
        // gradients
        equal(s.gradientAtPoint(0), 0, "gradient at location 0 is 0");
        equal(s.gradientAtPoint(1), 0, "gradient at location 1 is 0");
        equal(s.gradientAtPoint(0.5), Infinity, "gradient at location 0.5 is Infinity");


        // anticlockwise, 180 degrees
        params = { r: r, x1: 0, y1: 0, x2: 0, y2: -20, cx: 0, cy: -10, ac: true };
        s = new jsPlumb.Segments["Arc"](params);
        equal(s.getLength(), 0.5 * circ, "length of segment is correct");
        p1 = s.pointOnPath(0);
        within(p1.x, 0, ok, "start x is correct");
        within(p1.y, 0, ok, "start y is correct");
        p2 = s.pointOnPath(1);
        within(p2.x, 0, ok, "end x is correct");
        within(p2.y, -20, ok, "end y is correct");
        var p3 = s.pointOnPath(0.5);
        within(p3.x, 10, ok, "end x is correct");
        within(p3.y, -10, ok, "end y is correct");


        // clockwise, 270 degrees
        params = { r: r, x1: 0, y1: 0, x2: -10, y2: 10, cx: 0, cy: 10 };
        s = new jsPlumb.Segments["Arc"](params);
        equal(s.getLength(), 0.75 * circ, "length of segment is correct");
        p1 = s.pointOnPath(0);
        within(p1.x, 0, ok, "start x is correct");
        within(p1.y, 0, ok, "start y is correct");
        p2 = s.pointOnPath(1);
        within(p2.x, -10, ok, "end x is correct");
        within(p2.y, 10, ok, "end y is correct");
        var p3 = s.pointOnPath(0.5);
        within(p3.x, 7.071067811865477, ok, "end x is correct");
        within(p3.y, 17.071067811865477, ok, "end y is correct");


        // anticlockwise, 90 degrees
        params = { r: r, x1: 0, y1: 0, x2: -10, y2: 10, cx: 0, cy: 10, ac: true };
        s = new jsPlumb.Segments["Arc"](params);
        equal(s.getLength(), 0.25 * circ, "length of segment is correct");
        p1 = s.pointOnPath(0);
        within(p1.x, 0, ok, "start x is correct");
        within(p1.y, 0, ok, "start y is correct");
        p2 = s.pointOnPath(1);
        within(p2.x, -10, ok, "end x is correct");
        within(p2.y, 10, ok, "end y is correct");
        var p3 = s.pointOnPath(0.5);
        within(p3.x, -7.071067811865477, ok, "end x is correct");
        within(p3.y, 2.9289321881345245, ok, "end y is correct");


        // anticlockwise, 270 degrees
        params = { r: r, x1: 0, y1: 0, x2: 10, y2: 10, cx: 0, cy: 10, ac: true };
        s = new jsPlumb.Segments["Arc"](params);
        equal(s.getLength(), 0.75 * circ, "length of segment is correct");
        p1 = s.pointOnPath(0);
        within(p1.x, 0, ok, "start x is correct");
        within(p1.y, 0, ok, "start y is correct");
        p2 = s.pointOnPath(1);
        within(p2.x, 10, ok, "end x is correct");
        within(p2.y, 10, ok, "end y is correct");
        var p3 = s.pointOnPath(0.5);
        within(p3.x, -7.071067811865477, ok, "end x is correct");
        within(p3.y, 17.071067811865477, ok, "end y is correct");


    });

// *********************************** jsPlumbUtil.extend tests *****************************************************



    test(" addClass method of Connection", function () {
        support.addDiv("d1");
            support.addDiv("d2");
            var c = _jsPlumb.connect({source: "d1", target: "d2", overlays:[
                [ "Label", { id:"label", label:'hey'}]
            ]}), o = c.getOverlay("label");
            c.addClass("foo");
            ok(!(jsPlumb.hasClass(c.endpoints[0].canvas, "foo")), "endpoint does not have class 'foo'");
            ok(c.canvas.className.baseVal.indexOf("foo") != -1, "connection has class 'foo'");
            c.addClass("bar", true);
            ok(jsPlumb.hasClass(c.endpoints[0].canvas, "bar"), "endpoint has class 'bar'");
            c.removeClass("bar", true);
            ok(c.canvas.className.baseVal.indexOf("bar") == -1, "connection doesn't have class 'bar'");
            ok(!jsPlumb.hasClass(c.endpoints[0].canvas, "bar"), "endpoint doesnt have class 'bar'");

            ok(jsPlumb.hasClass(o.canvas, "foo"), "overlay has class foo");

            c.addClass("foo2");
            ok(jsPlumb.hasClass(o.canvas, "foo2"), "overlay has class foo2");
            ok(c.canvas.className.baseVal.indexOf("foo2") != -1, "connection has class 'foo2'");

            c.removeClass("foo2");
            ok(!jsPlumb.hasClass(o.canvas, "foo2"), "overlay no longer has class foo2");
            ok(c.canvas.className.baseVal.indexOf("foo2") == -1, "connection no longer has class 'foo2'");

            c.addClass("foo2", true);
            ok(!jsPlumb.hasClass(o.canvas, "foo2"), "overlay doesnt have class foo2");
            ok(c.canvas.className.baseVal.indexOf("foo2") != -1, "connection has class 'foo2'");
    });

    test(" addClass via jsPlumb.select", function () {
        support.addDiv("d1");
        support.addDiv("d2");
        equal(_jsPlumb.select().length, 0, "there are no connections");
        var c = _jsPlumb.connect({source: "d1", target: "d2"});
        equal(_jsPlumb.select().length, 1, "there is one connection");
        _jsPlumb.select().addClass("foo");
        ok(!(jsPlumb.hasClass(c.endpoints[0].canvas, "foo")), "endpoint does not have class 'foo'");
        _jsPlumb.select().addClass("bar", true);
        ok(jsPlumb.hasClass(c.endpoints[0].canvas, "bar"), "endpoint hasclass 'bar'");
        _jsPlumb.select().removeClass("bar", true);
        ok(!(jsPlumb.hasClass(c.endpoints[0].canvas, "bar")), "endpoint doesn't have class 'bar'");
    });

// ******************* override pointer events ********************
    test("pointer-events, jsPlumb.connect", function () {
        if (_jsPlumb.getRenderMode() == jsPlumb.SVG) {
            support.addDivs(["d1", "d2"]);
            var c = _jsPlumb.connect({source: "d1", target: "d2", "pointer-events": "BANANA"});
            equal(jsPlumb.getSelector(c.getConnector().canvas, "path")[0].getAttribute("pointer-events"), "BANANA", "pointer events passed through to svg elements");
        }
        else
            expect(0);
    });

    test("connector-pointer-events, jsPlumb.addEndpoint", function () {
        if (_jsPlumb.getRenderMode() == jsPlumb.SVG) {
            support.addDivs(["d1", "d2"]);
            var e1 = _jsPlumb.addEndpoint("d1", { "connector-pointer-events": "BANANA" });
            var c = _jsPlumb.connect({source: e1, target: "d2"});
            equal(jsPlumb.getSelector(c.getConnector().canvas, "path")[0].getAttribute("pointer-events"), "BANANA", "pointer events passed through to svg elements");
        }
        else
            expect(0);
    });
    

    test(" : DOM adapter addClass/hasClass/removeClass", function () {
        var d1 = support.addDiv(d1), // d1 is a DOM element
            _d1 = jsPlumb.getSelector(d1);  // _d1 is a selector. we will test using each one.

        // add a single class and test for its existence	
        jsPlumb.addClass(d1, "FOO");
        equal(d1.className, "FOO", "element has class FOO, using selector");
        ok(jsPlumb.hasClass(_d1, "FOO"), "element has class FOO, according to hasClass method, DOM element");
        ok(jsPlumb.hasClass(d1, "FOO"), "element has class FOO, according to hasClass method, selector");

        // add multiple classes and test for their existence
        jsPlumb.addClass(_d1, "BAZ BAR SHAZ");
        ok(jsPlumb.hasClass(_d1, "BAZ"), "element has class BAZ, according to hasClass method, DOM element");
        ok(jsPlumb.hasClass(_d1, "BAR"), "element has class BAR, according to hasClass method, DOM element");
        ok(jsPlumb.hasClass(_d1, "SHAZ"), "element has class SHAZ, according to hasClass method, DOM element");

        // remove one class
        jsPlumb.removeClass(d1, "BAR");
        ok(!jsPlumb.hasClass(_d1, "BAR"), "element doesn't have class BAR, according to hasClass method, DOM element");

        // remove two more classes
        jsPlumb.removeClass(d1, "BAZ SHAZ");
        ok(!jsPlumb.hasClass(_d1, "BAZ"), "element doesn't have class BAZ, according to hasClass method, DOM element");
        ok(!jsPlumb.hasClass(_d1, "SHAZ"), "element doesn't have class SHAZ, according to hasClass method, DOM element");

        // check FOO is still there
        ok(jsPlumb.hasClass(_d1, "FOO"), "element has class FOO, according to hasClass method, DOM element");

        // now for an SVG element.
        var s1 = jsPlumbUtil.svg.node("svg");
        document.body.appendChild(s1);
        jsPlumb.addClass(s1, "SFOO");
        ok(jsPlumb.hasClass(s1, "SFOO"), "SVG element has class SFOO, according to hasClass method, DOM element");

        jsPlumb.addClass(s1, "BAZ BAR SHAZ");

        // remove one class
        jsPlumb.removeClass(s1, "BAR");
        ok(!jsPlumb.hasClass(s1, "BAR"), "SVG element doesn't have class BAR, according to hasClass method, DOM element");

        // remove two more classes
        jsPlumb.removeClass(s1, "BAZ SHAZ");
        ok(!jsPlumb.hasClass(s1, "BAZ"), "SVG element doesn't have class BAZ, according to hasClass method, DOM element");
        ok(!jsPlumb.hasClass(s1, "SHAZ"), "SVG element doesn't have class SHAZ, according to hasClass method, DOM element");

        // check SFOO is still there
        ok(jsPlumb.hasClass(s1, "SFOO"), "SVG element has class SFOO, according to hasClass method, DOM element");

        // set class for d1 to be BAZ only
        jsPlumb.setClass(d1, "BAZ");
        equal(d1.className, "BAZ", "element has only the class set with setClass");
    });

    test(" : DOM adapter addClass/removeClass, multiple elements, with selector", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        jsPlumb.addClass(d1, "BAZ");
        jsPlumb.addClass(d2, "BAZ");

        var els = jsPlumb.getSelector(".BAZ");

        // add a single class and test for its existence	
        jsPlumb.addClass(els, "FOO");
        ok(jsPlumb.hasClass(d1, "FOO"), "d1 has class FOO");
        ok(jsPlumb.hasClass(d2, "FOO"), "d1 has class FOO");

        // remove a single class and test for its non-existence.
        jsPlumb.removeClass(els, "FOO");
        ok(!jsPlumb.hasClass(d1, "FOO"), "d1 doesn't have class FOO");
        ok(!jsPlumb.hasClass(d2, "FOO"), "d1 doesn't have class FOO");

    });

    test("DOM adapter addClass/removeClass, multiple elements, with array of DOM elements", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        jsPlumb.addClass(d1, "BAZ");
        jsPlumb.addClass(d2, "BAZ");

        var els = [ d1, d2 ];

        // add a single class and test for its existence	
        jsPlumb.addClass(els, "FOO");
        ok(jsPlumb.hasClass(d1, "FOO"), "d1 has class FOO");
        ok(jsPlumb.hasClass(d2, "FOO"), "d1 has class FOO");

        // remove a single class and test for its non-existence.
        jsPlumb.removeClass(els, "FOO");
        ok(!jsPlumb.hasClass(d1, "FOO"), "d1 doesn't have class FOO");
        ok(!jsPlumb.hasClass(d2, "FOO"), "d1 doesn't have class FOO");
    });

    test("DOM adapter addClass/removeClass, multiple elements, with array of IDs", function () {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        jsPlumb.addClass(d1, "BAZ");
        jsPlumb.addClass(d2, "BAZ");

        var els = [ "d1", "d2" ];

        // add a single class and test for its existence	
        jsPlumb.addClass(els, "FOO");
        ok(jsPlumb.hasClass(d1, "FOO"), "d1 has class FOO");
        ok(jsPlumb.hasClass(d2, "FOO"), "d1 has class FOO");

        // remove a single class and test for its non-existence.
        jsPlumb.removeClass(els, "FOO");
        ok(!jsPlumb.hasClass(d1, "FOO"), "d1 doesn't have class FOO");
        ok(!jsPlumb.hasClass(d2, "FOO"), "d1 doesn't have class FOO");
    });


    test(" : DOM adapter addClass and removeClass at the same time, pass as arrays", function () {
        var d1 = support.addDiv("d1");
        jsPlumb.addClass(d1, "BAZ FOO BAR");
        ok(jsPlumb.hasClass(d1, "BAZ"), "d1 has class BAZ");
        ok(jsPlumb.hasClass(d1, "FOO"), "d1 has class FOO");
        ok(jsPlumb.hasClass(d1, "BAR"), "d1 has class BAR");

        // add qux, remove foo and bar.
        jsPlumb.updateClasses(d1, ["QUX", "BOZ"], ["FOO", "BAR"]);
        ok(jsPlumb.hasClass(d1, "QUX"), "d1 has class QUX");
        ok(jsPlumb.hasClass(d1, "BOZ"), "d1 has class BOZ");
        ok(jsPlumb.hasClass(d1, "BAZ"), "d1 has class BAZ");
        ok(!jsPlumb.hasClass(d1, "FOO"), "d1 has not class FOO");
        ok(!jsPlumb.hasClass(d1, "BAR"), "d1 has not class BAR");
    });

    test(" : DOM adapter addClass and removeClass at the same time, pass as strings", function () {
        var d1 = support.addDiv("d1");
        jsPlumb.addClass(d1, "BAZ FOO BAR");
        ok(jsPlumb.hasClass(d1, "BAZ"), "d1 has class BAZ");
        ok(jsPlumb.hasClass(d1, "FOO"), "d1 has class FOO");
        ok(jsPlumb.hasClass(d1, "BAR"), "d1 has class BAR");

        // add qux, remove foo and bar.
        jsPlumb.updateClasses(d1, "QUX BOZ", "FOO BAR");
        ok(jsPlumb.hasClass(d1, "QUX"), "d1 has class QUX");
        ok(jsPlumb.hasClass(d1, "BOZ"), "d1 has class BOZ");
        ok(jsPlumb.hasClass(d1, "BAZ"), "d1 has class BAZ");
        ok(!jsPlumb.hasClass(d1, "FOO"), "d1 has not class FOO");
        ok(!jsPlumb.hasClass(d1, "BAR"), "d1 has not class BAR");
    });

    test("endpointStyle on connect method", function () {
        support.addDivs(["d1", "d2"]);
        var c = _jsPlumb.connect({
            source: "d1",
            target: "d2",
            endpointStyle: { fill: "blue" }
        });

        equal(c.endpoints[0].canvas.childNodes[0].childNodes[0].getAttribute("fill"), "blue", "endpoint style passed through by connect method");
    });

    test("recalculateOffsets", function() {
        var d1 = support.addDiv("d1");

        var d2 = support.addDiv("d2", d1);
        d2.style.left = "250px";
        d2.style.top = "120px";

        var d3 = support.addDiv("d3", d1);
        d3.style.left = "150px";
        d3.style.top = "220px";

        _jsPlumb.connect({source:d2, target:d3});
        _jsPlumb.draggable(d1);

        var o = _jsPlumb.getDragManager().getElementsForDraggable("d1")["d2"];
        equal(250, o.offset.left, "d2 is at left=250");

        d2.style.left = "1250px";
        _jsPlumb.recalculateOffsets(d1);
        var o = _jsPlumb.getDragManager().getElementsForDraggable("d1")["d2"];
        equal(1250, o.offset.left, "d2 is at left=1250");

    });

    /**
     * Tests that the `getOffset` function correctly ignores body scroll when adjusting for parent element scroll.
     * @method Test.offset_body_scroll
     */
    test("offset body scroll", function() {
        expect(0);
    });



    test("endpointStyle on connect method, with makeSource prepared element", function () {
        support.addDivs(["d1", "d2"]);
        _jsPlumb.makeSource("d1");

        var c = _jsPlumb.connect({
            source: "d1",
            target: "d2",
            endpointStyle: { fill: "blue" }
        });

        equal(c.endpoints[0].canvas.childNodes[0].childNodes[0].getAttribute("fill"), "blue", "endpoint style passed through by connect method");
    });



    test("setContainer does not cause multiple event registrations (issue 307)", function () {
        support.addDivs(["box1", "box2", "canvas"]);

         _jsPlumb.importDefaults({
         Container: 'canvas'
         });

        _jsPlumb.setContainer('canvas');

        var connection = _jsPlumb.connect({
            source: 'box1',
            id: 'connector1',
            target: 'box2',
            anchors: ['Bottom', 'Left']
        });

        var clickCount = 0;
        var labelDef = {
            id: 'label-1',
            label: 'labeltext',
            events: {
                click: function (event) {
                    console.log('click on label');
                    clickCount++;
                }
            }
        };
        var o = connection.addOverlay(['Label', labelDef]);

        _jsPlumb.trigger(connection.getOverlay("label-1").canvas, "click");

        equal(clickCount, 1, "1 click on overlay registered");

    });



    var _detachThisConnection = function(c) {
        var idx = c.endpoints[1].connections.indexOf(c);
        support.detachConnection(c.endpoints[1], idx);
    };


     /**
     * Tests endpoint mouse interaction via event triggering: the ability to drag a connection to another
      * endpoint, what happens when it is full, if it is disabled etc.
     * @method jsPlumb.Test.EndpointEventTriggering
     */
     test("connections via mouse between Endpoints configured with addEndpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {isSource:true, isTarget:true}),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true});

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        _jsPlumb.select().delete();
        equal(_jsPlumb.select().length, 0, "zero connections after detach");

         // now disable e1 and try to drag a new connection: it should fail
         e1.setEnabled(false);
         support.dragConnection(e1, e2);
         equal(_jsPlumb.select().length, 0, "zero connections after drag from disabled endpoint");

         e1.setEnabled(true);
         support.dragConnection(e1, e2);
         equal(_jsPlumb.select().length, 1, "one connection after drag from enabled endpoint");

         /*

         why does this fail? i get 0 instead of 1. it's detaching existing connections?

         ok(e1.isFull(), "endpoint 1 is full");
         support.dragConnection(e1, e2);
         equal(_jsPlumb.select().length, 1, "one connection after drag from endpoint that is full");
         */

         support.detachConnection(e1, 0);
         equal(_jsPlumb.select().length, 0, "zero connections after detach");
    });

    test("connections via mouse between elements configured with makeSource/makeTarget", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource("d1");
        _jsPlumb.makeSource("d4");
        _jsPlumb.makeTarget("d2");
        _jsPlumb.makeTarget("d3");

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        var cd1d2 = _jsPlumb.select().get(0);
        equal(cd1d2.source.id, "d1", "source of first connection is correct");
        equal(cd1d2.target.id, "d2", "target of first connection is correct");

        support.dragConnection(d1, d3);
        equal(_jsPlumb.select().length, 2, "two connections after drag from source to target");
        var cd1d3 = _jsPlumb.select().get(1);
        equal(cd1d3.source.id, "d1", "source of second connection is correct");
        equal(cd1d3.target.id, "d3", "target of second connection is correct");

        // now we will drag the connection from d1-d2 by its target endpoint and put it on d3.
        support.relocateTarget(cd1d2, d3);
        equal(cd1d2.target.id, "d3", "target of first connection has changed to d3");
        equal(_jsPlumb.select().length, 2, "two connections after relocate");

        support.dragConnection(d3, d1);
        equal(_jsPlumb.select().length, 2, "two connections after failed drag from target to source");

        // now drag the source of d1-d2 to be d4.
        support.relocateSource(cd1d2, d4);
        equal(cd1d2.source.id, "d4", "source of first connection has changed to d4");
        equal(_jsPlumb.select().length, 2, "two connections after relocate");

    });


    // https://github.com/jsplumb/jsPlumb/issues/415
    test("issue 415: spurious endpoints after dragging", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([ "d1", "d2", "d3", "d4" ], {
            maxConnections:-1
        });
        _jsPlumb.makeTarget([ "d1", "d2", "d3", "d4" ], {
            maxConnections:-1
        });

        ok(_jsPlumb.isSource(d4), "d4 is a connection source");
        ok(_jsPlumb.isTarget(d4), "d4 is a connection target");

        var d1d2 = support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        var d2d3 = support.dragConnection(d2, d3);
        equal(_jsPlumb.select().length, 2, "two connections after drag");

        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints before relocations");

        support.relocateTarget(d1d2, d4);
        equal(d1d2.target.id, "d4", "target of first connection has changed to d4");

        equal(_jsPlumb.select().length, 2, "two connections after relocations");
        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints after relocations");

        support.relocateSource(d2d3, d4);

        equal(d2d3.source.id, "d4", "source of second connection has changed to d4");
        equal(_jsPlumb.select().length, 2, "two connections after relocations");
        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints after relocations");

    });

    test("drag connection so it turns into a self-loop. ensure endpoints registered correctly. target not continuous anchor so not hidden (issue 419)", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([ "d1", "d2", "d3", "d4" ], { maxConnections: -1 });
        _jsPlumb.makeTarget([ "d1", "d2", "d3", "d4" ], { maxConnections: -1 });

        ok(_jsPlumb.isSource(d1), "d1 is a connection source");
        ok(_jsPlumb.isTarget(d2), "d2 is a connection target");

        // as a test: connect d3 to itself. 2 endpoints?
        var d3d3 = support.dragConnection(d3, d3);
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints");

        var d2d1 = support.dragConnection(d2, d1);
        equal(_jsPlumb.select().length, 2, "one connection after drag");

        support.relocateSource(d2d1, d1);
        equal(d2d1.endpoints[0].elementId, "d1", "source endpoint is on d1 now");
        equal(_jsPlumb.selectEndpoints().length, 4, "four endpoints after relocations");

        support.relocateSource(d2d1, d2);
        equal(d2d1.endpoints[0].elementId, "d2", "source endpoint is on d2 now");
        ok(d2d1.endpoints[1].canvas.parentNode != null, "target canvas put back into DOM");
    });

    test("drag connection so it turns into a self-loop. ensure endpoints registered correctly. target is continuous anchor so is hidden. (issue 419)", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([ "d1", "d2", "d3", "d4" ], { maxConnections: -1, anchor:"Continuous" });
        _jsPlumb.makeTarget([ "d1", "d2", "d3", "d4" ], { maxConnections: -1, anchor:"Continuous" });

        var d2d1 = support.dragConnection(d2, d1);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        support.relocateSource(d2d1, d1);
        equal(d2d1.endpoints[0].elementId, "d1", "source endpoint is on d1 now");
        // NOTE in this test we are not using Continuous anchors so we do not expect the target to have been
        // removed. the next test uses Continuous anchors and it checks the target has been removed.
        //ok(d2d1.endpoints[1].canvas.parentNode == null, "target canvas removed from DOM");

        support.relocateSource(d2d1, d2);
        equal(d2d1.endpoints[0].elementId, "d2", "source endpoint is on d2 now");
        ok(d2d1.endpoints[1].canvas.parentNode != null, "target canvas put back into DOM");
    });


    test("endpoint:connectionsDetachable mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {
                isSource:true, isTarget:true,
                connectionsDetachable:false
            }),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true});

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 1, "one connection still after attempted detach");
    });

    test("connection:detachable false, mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d2);

        equal(_jsPlumb.select().length, 0, "zero connections before connect");
        _jsPlumb.connect({source:e1, target:e2, detachable:false});
        equal(_jsPlumb.select().length, 1, "one connection after connect");
        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 1, "one connection still after attempted detach");
    });

    test("connection:detachable true by default, mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1),
            e2 = _jsPlumb.addEndpoint(d2);

        equal(_jsPlumb.select().length, 0, "zero connections before connect");
        _jsPlumb.connect({source:e1, target:e2});
        equal(_jsPlumb.select().length, 1, "one connection after connect");
        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "zero connections after detach");
    });

    test("connectionDetached event is fired when no beforeDrop is active", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {
            isTarget:true
        });
        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true});
        var evt = false, originalEvent;
        _jsPlumb.bind('connectionDetached', function (info, oevt) {
            evt = true;
            originalEvent = oevt;
        });
        support.dragConnection(e2, e1);
        equal(e1.connections.length, 1, "one connection");

        support.detachConnection(e1, 0);

        equal(e1.connections.length, 0, "no connections");
        ok(evt == true, "event was fired");
        ok(originalEvent != null, "original event was provided in event callback");
    });

    test("beforeDrop returning false prevents connectionDetached event", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, {
            beforeDrop:function() {
                return false;
            },
            isTarget:true
        });
        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true});
        var evt = false, abortEvent = false;
        _jsPlumb.bind('connectionDetached', function (info) {
            evt = true;
        });
        _jsPlumb.bind('connectionAborted', function (info) {
            abortEvent = true;
        });
        support.dragConnection(e2, e1);
        ok(evt == false, "event was not fired");
        equal(e1.connections.length, 0, "no connections");
        ok(abortEvent == true, "connectionAborted event was fired");
    });

    test("connectionAborted event", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true});
        var evt = false, abortEvent = false;
        _jsPlumb.bind('connectionDetached', function (info) {
            evt = true;
        });
        _jsPlumb.bind('connectionAborted', function (info) {
            abortEvent = true;
        });
        support.dragAndAbortConnection(e2);
        ok(evt == false, "connectionDetached event was not fired");
        equal(e2.connections.length, 0, "no connections");
        ok(abortEvent == true, "connectionAborted event was fired");
    });

test("endpoint: suspendedElement set correctly", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"),
            e1 = _jsPlumb.addEndpoint(d1, { isSource:true, isTarget:true }),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true}),
            e3 = _jsPlumb.addEndpoint(d3, {isSource:true, isTarget:true});

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        var c = support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");

        support.relocateTarget(c, e3, {
            beforeMouseUp:function() {
                equal(c.suspendedElement, d2, "suspended element is set");
                equal(c.suspendedEndpoint, e2, "suspended endpoint is set");
            },
            after :function() {
                equal(c.suspendedElement, null, "suspended element is cleared");
                equal(c.suspendedEndpoint, null, "suspended endpoint is cleared");
            }
        });
    });

    /*

    // future state.

    test("beforeDrop fired before onMaxConnections", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var bd = false;
        var e1 = _jsPlumb.addEndpoint(d1, {
            beforeDrop:function() {
                bd = true;
                return true;
            },
            isTarget:true,
            onMaxConnections:function() {
                ok(bd === true, "beforeDrop was called before onMaxConnections");
            }
        });
        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true, maxConnections:-1});
        support.dragConnection(e2, e1);
        equal(e1.connections.length, 1, "one connection");
        equal(bd, true, "beforeDrop was called");
        bd = false;
        support.dragConnection(e2, e1);
        equal(e1.connections.length, 1, "one connection");
    });
    */

    test("drag connection between two endpoints", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        var e1 = _jsPlumb.addEndpoint(d1, { isTarget:true, maxConnections:-1 });
        var e2 = _jsPlumb.addEndpoint(d2, {isSource:true, maxConnections:-1 });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one conn now");

        var c2 = support.dragConnection(e2, e1);
        equal(e1.connections.length, 2, "two conns now");
    });

    test("drag connection between two endpoints but endpoints are full", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, { isTarget:true });
        var e2 = _jsPlumb.addEndpoint(d2, { isSource:true });
        var e3 = _jsPlumb.addEndpoint(d3, { isSource:true });

        var c1 = _jsPlumb.connect({source:e2, target:e1});
        equal(e1.connections.length, 1, "one conn now");

        var c2 = support.dragConnection(e3, e1);
        equal(e1.connections.length, 1, "one conn now");
    });

    /*
    test("endpoint:connectionSourceDetachable false, mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, {connectionSourceDetachable:false, maxConnections:-1}),
            e2 = _jsPlumb.addEndpoint(d2, {maxConnections:-1});

        equal(_jsPlumb.select().length, 0, "zero connections before connect");
        _jsPlumb.connect({source:e1, target:e2});
        equal(_jsPlumb.select().length, 1, "one connection after connect");

        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 1, "one connection still after attempted detach of connection source");

        _jsPlumb.connect({source:e2, target:e1});
        equal(_jsPlumb.select().length, 2, "two connections after connect");
        support.detachConnection(e1, 1);
        equal(_jsPlumb.select().length, 1, "one connection after successful target detach");
    });*/

    test("endpoint:beforeDetach listener via mouse interaction", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), r = 0, s = 0, bd = 0,
            e1 = _jsPlumb.addEndpoint(d1, {
                isSource:true, isTarget:true

            }),
            e2 = _jsPlumb.addEndpoint(d2, {isSource:true, isTarget:true});

        _jsPlumb.bind("beforeDetach", function() {
            r = true;
            return true;
        });

        _jsPlumb.bind("beforeDrag", function() {
            bd++;
            return true;
        });

        _jsPlumb.bind("beforeStartDetach", function() {
            s = true;
            return true;
        });

        equal(_jsPlumb.select().length, 0, "zero connections before drag");
        support.dragConnection(e1, e2);
        equal(_jsPlumb.select().length, 1, "one connection after drag");


        support.detachConnection(e1, 0);
        equal(_jsPlumb.select().length, 0, "connection detached");

        equal(bd, 1, "beforeDrag called once");
        equal(r, 1, "beforeDetach interceptor called once");
        equal(s, 1, "beforeStartDetach interceptor called once");

    });


    test("unbind a single event listener does not unbind them all", function() {
        var i = 0;
        var l1 = function() {
            i += 5;
        };
        var l2 = function() {
            i -= 6;
        };
        var d1 = support.addDiv("d1"),
            d2 = support.addDiv("d2");

        _jsPlumb.bind("connection", l1);
        _jsPlumb.bind("connection", l2);

        _jsPlumb.connect({source:d1, target:d2});

        equal(i, -1,"both listeners fired");
        i = 0;

        // first test existing: unbind with no args unbinds everything.
        _jsPlumb.unbind("connection");
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, 0, "no listeners fired");

        // rebind and check
        _jsPlumb.bind("connection", l1);
        _jsPlumb.bind("connection", l2);
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, -1,"both listeners fired");

        i = 0;
        // unbind one.
        _jsPlumb.unbind("connection", l2);
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, 5, "only listener l1 fired");

        i = 0;
        _jsPlumb.unbind(l1);
        _jsPlumb.connect({source:d1, target:d2});
        equal(i, 0, "no listeners fired");

    });

    test("bind multiple listeners via array (multiple events, one function)", function() {
        var count = 0;
        _jsPlumb.bind(["foo", "bar", "baz"], function() {
            count++;
        });

        _jsPlumb.fire("foo");
        equal(count, 1, "count is 1");
        _jsPlumb.fire("bar");
        equal(count, 2, "count is 2");
        _jsPlumb.fire("baz");
        equal(count, 3, "count is 3");
    });


// -----------------issue 383, setDraggable doesnt work with list-like arguments

    test("setDraggable with array", function() {
        var d1 = support.addDiv("d1", null, "aTest");
        var d2 = support.addDiv("d2", null, "aTest");

        ok(!_jsPlumb.isAlreadyDraggable(d1), "d1 is not draggable");
        ok(!_jsPlumb.isAlreadyDraggable(d2), "d2 is not draggable");
        var d = document.getElementsByClassName("aTest");

        // first make them draggable
        if(typeof d === "function") {
            expect(2);
        }
        else
        {
            _jsPlumb.draggable(d);
            ok(_jsPlumb.isElementDraggable(d1), "d1 is now draggable");
            ok(_jsPlumb.isElementDraggable(d2), "d2 is now draggable");

            // now disable
            _jsPlumb.setDraggable(d, false);
            ok(!_jsPlumb.isElementDraggable(d1), "d1 is not draggable");
            ok(!_jsPlumb.isElementDraggable(d2), "d2 is not draggable");

            // and enable
            _jsPlumb.toggleDraggable(d);
            ok(_jsPlumb.isElementDraggable(d1), "d1 is draggable after toggle ");
            ok(_jsPlumb.isElementDraggable(d2), "d2 is draggable after toggle");
        }
    });

// ------------------ issue 402...offset cache not cleared always --------------------
    test("offset cache cleared", function() {
       var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        _jsPlumb.connect({source:d1, target:d2});
        var cd = _jsPlumb.getCachedData("d1");
       ok(cd.o != null, "d1 is cached");

        // reset and then move d1. get cached data and offset should have been updated.
        _jsPlumb.reset();
        d1.style.position = "absolute";
        d1.style.left = "5000px";
        var cd2 = _jsPlumb.getCachedData("d1");
        ok(cd2.o == null, "cache data cleared");
        _jsPlumb.connect({source:d1, target:d2});
        var cd3 = _jsPlumb.getCachedData("d1");
        ok(cd3.o != null, "d1 is cached");

        // delete every endpoint and then move d1. get cached data and offset should have been updated.
        _jsPlumb.deleteEveryEndpoint();
        d1.style.position = "absolute";
        d1.style.left = "5000px";
        var cd2 = _jsPlumb.getCachedData("d1");
        ok(cd2.o == null, "cache data cleared");
        _jsPlumb.connect({source:d1, target:d2});
        var cd3 = _jsPlumb.getCachedData("d1");
        ok(cd3.o != null, "d1 is cached");
    });

// ---------------------- issue 405, jsPlumb.empty doesnt remove connections (cannot reproduce) -----------------------

    test("jsPlumb.empty removes connections", function() {
        var p = support.addDiv("p"),
            d1 = support.addDiv("d1", p),
            d2 = support.addDiv("d2", p);

        _jsPlumb.connect({source:d1, target:d2});
        ok(_jsPlumb.select().length == 1, "1 connection");

        _jsPlumb.empty(p);
        ok(document.getElementById("d1") == null);
        ok(_jsPlumb.select().length == 0, "0 connections");
    });



//  -- connection dragging tests

    test("connection dragging, simple drag and detach case", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 0, "0 connections in jsplumb instance.");

    });

    /**
     * Tests the `extract` parameter on a `makeSource` call: extract provides a map of attribute names that you want to
     * read fom the source element when a drag starts, and whose values end up in the connection's data, keyed by the
     * value from the extract map. In this test we get the attribute `foo` and insert its value into the connection's
     * data, keyed as `fooAttribute`.
     */
    test("connection dragging, extractor atts defined on source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        d1.setAttribute("foo", "the value of foo");
        _jsPlumb.makeSource([d1, d2, d3], {
            extract:{
                "foo":"fooAttribute"
            }
        });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var con = support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        equal(con.getData().fooAttribute, "the value of foo", "attribute values extracted properly");
    });

    test("connection dragging, simple drag and detach case, beforeDetach interceptor says no.", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "still 1 connection registered for d1 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "still 1 connection registered for d2 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");

    });

    test("connection dragging, simple drag and detach case, reattach=true on connection prevents detach.", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);
        c.setReattach(true);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "still 1 connection registered for d1 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "still 1 connection registered for d2 after attempted mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");

    });

    test("connection dragging, simple move target case", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

        //alert("ensure continuous anchor endpoint cleaned up in this case (simple target move)");
    });

    // DRAG SOURCE TO ANOTHER SOURCE
    test("connection dragging, simple move source case", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints; there is one connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

    });

    test("connection dragging, simple move source case, continuous anchors", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.importDefaults({Anchor:"Continuous"});
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.selectEndpoints().length, 2, "two endpoints; there is one connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

    });

    test("connection dragging, simple move target case, beforeDetach aborts the move", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    test("connection dragging, simple move source case, beforeDetach aborts the move", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after aborted mouse move");
    });

    test("connection dragging, simple move case, connection reattach=true aborts the move", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        c.setReattach(true);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after aborted mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    test("connection dragging, redrop on original target", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d2);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE AND REDROP ON ORIGINAL
    test("connection dragging, redrop on original source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d1);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });


    // DRAG SOURCE TO AN ELEMENT NO CONFIGURED AS SOURCE (SHOULD DETACH)
    test("connection dragging, move source to element not configured as drag source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3, d4], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "zero endpoints; there are no connections");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE TO AN ELEMENT NO CONFIGURED AS SOURCE BUT DETACH DISABLED (SHOULDNT CARE)
    test("connection dragging, move source to element not configured as drag source, beforeDetach cancels connection", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3, d4], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "2 endpoints; there is 1 connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0, "0 connection registered for d4 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG SOURCE TO ANOTHER SOURCE BUT BEFORE DROP SAYS NO
    test("connection dragging, move source to element not configured as drag source, beforeDrop cancels connection", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.bind("beforedrop", function() { return false; });
        _jsPlumb.makeSource([d1, d2, d3], { });
        _jsPlumb.makeTarget([d1, d2, d3, d4], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateSource(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "0 endpoints; there are no connections");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0, "0 connections registered for d4 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    // DRAG TARGET TO ANOTHER SOURCE (BUT NOT A TARGET); SHOULD DETACH
    test("connection dragging, move source to element not configured as drag source", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.makeSource([d1, d2, d3, d4], { });
        _jsPlumb.makeTarget([d1, d2, d3], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 0, "zero endpoints; there are no connections");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });


    // DRAG TARGET TO ANOTHER SOURCE (BUT NOT A TARGET), BUT DETACH DISABLED. SHOULDNT CARE.
    test("connection dragging, move source to element not configured as drag source, beforeDetach cancels connection", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");
        _jsPlumb.bind("beforeDetach", function() { return false; });
        _jsPlumb.makeSource([ d1, d2, d3, d4 ], { });
        _jsPlumb.makeTarget([ d1, d2, d3 ], { });

        var c = _jsPlumb.connect({source: d1, target: d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, d4);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse move");
        equal(_jsPlumb.selectEndpoints().length, 2, "2 endpoints; there is 1 connection");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d4").length, 0, "0 connection registered for d4 after mouse move");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });

    /**
     * Tests that `endpoint` and `anchor` in a makeSource definition are honoured. The next test uses a connection type
     * but has the makeSource override the anchor.
     */
    test("connection dragging, makeSource sets source endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3], { endpoint:"Rectangle", anchor:"Left"});
        _jsPlumb.makeTarget([d1, d2, d3]);

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        equal(c.endpoints[0].type, "Rectangle", "source endpoint is Rectangle");
        equal(c.endpoints[0].anchor.x, 0, "x=0 in anchor");
        equal(c.endpoints[0].anchor.y, 0.5, "y=0.5 in anchor");
        equal(c.endpoints[1].type, _jsPlumb.Defaults.Endpoint, "target endpoint is the default");
    });

    /**
     * Tests that makeSource, when given `endpoint` and/or `anchor` values, will override any that were derived
     * from an applied type.
     */
    test("connection dragging, makeSource overrides source endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.registerConnectionType("basic", {
            endpoint:"Blank",
            anchor:"Right"
        });
        _jsPlumb.makeSource(d1, { connectionType:"basic", endpoint:"Rectangle", anchor:"Left"});
        _jsPlumb.makeSource(d2, { connectionType:"basic"});
        _jsPlumb.makeTarget([d1, d2, d3]);

        support.dragConnection(d1, d3);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        support.dragConnection(d2, d3);
        equal(_jsPlumb.select().length, 2, "2 connections in jsplumb instance.");
        var c2 = _jsPlumb.select().get(1);

        equal(c.endpoints[0].type, "Rectangle", "source endpoint was overridden to be Rectangle");
        equal(c.endpoints[0].anchor.x, 0, "x=0 in overridden anchor");
        equal(c.endpoints[0].anchor.y, 0.5, "y=0.5 in overridden anchor");

        equal(c2.endpoints[0].type, "Blank", "source endpoint is Blank in endpoint derived from type");
        equal(c2.endpoints[0].anchor.x, 1, "x=1 in anchor derived from type");
        equal(c2.endpoints[0].anchor.y, 0.5, "y=0.5 in anchor derived from type");

    });

    /**
     * Tests that makeSource, when given `endpoint` and/or `anchor` values, will override any that were derived
     * from an applied type.
     */
    test("connection dragging, makeSource overrides source endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.registerConnectionType("basic", {
            endpoint:"Blank",
            anchor:"Right"
        });
        _jsPlumb.makeSource(d1, { connectionType:"basic"});
        _jsPlumb.makeTarget(d2);
        _jsPlumb.makeTarget(d3, { endpoint:"Rectangle", anchor:"Left" });

        support.dragConnection(d1, d3);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 2, "2 connections in jsplumb instance.");
        var c2 = _jsPlumb.select().get(1);

        equal(c.endpoints[1].type, "Rectangle", "target endpoint was overridden to be Rectangle");
        equal(c.endpoints[1].anchor.x, 0, "x=0 in overridden anchor");
        equal(c.endpoints[1].anchor.y, 0.5, "y=0.5 in overridden anchor");

        equal(c2.endpoints[1].type, "Blank", "target endpoint is Blank in endpoint derived from type");
        equal(c2.endpoints[1].anchor.x, 1, "x=1 in anchor derived from type");
        equal(c2.endpoints[1].anchor.y, 0.5, "y=0.5 in anchor derived from type");

    });

    test("connection dragging, makeTarget overrides endpoint and anchor", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1, d2, d3]);
        _jsPlumb.makeTarget([d1, d2, d3], { endpoint:"Rectangle", anchor:"Top" });

        support.dragConnection(d1, d2);
        equal(_jsPlumb.select().length, 1, "1 connection in jsplumb instance.");
        var c = _jsPlumb.select().get(0);

        equal(c.endpoints[0].type, _jsPlumb.Defaults.Endpoint, "source endpoint is the default");
        equal(c.endpoints[1].anchor.x, 0.5, "x=0.5 in anchor");
        equal(c.endpoints[1].anchor.y, 0, "y=0 in anchor");
        equal(c.endpoints[1].type, "Rectangle", "target endpoint is Rectangle");

    });


    // DETACH CONNECTION VIA SOURCE, DETACH ENABLED, ALLOWED
    // DETACH CONNECTION VIA SOURCE, DETACH DISABLED, DISALLOWED



    test("connection dragging", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.makeSource([d1,d2,d3], {
        });
        _jsPlumb.makeTarget([d1,d2,d3], {

        });
/*
        var c = _jsPlumb.connect({source:d1, target:d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after programmatic connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after programmatic connect");

        _jsPlumb.detach(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after programmatic detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after programmatic detach");

        c = _jsPlumb.connect({source:d1, target:d2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect" );
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");

        // reconnect, check
        support.dragConnection(d1, d2);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");
        c = _jsPlumb.select().get(0);

        // move the target to d3, check
        support.relocateTarget(c, d3);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse relocate");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse relocate");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after mouse relocate");

        // toss it away again, check
        _detachThisConnection(c);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 0, "0 connections registered for d2 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 0, "0 connections registered for d3 after mouse detach");
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
*/
        // reconnect, check
        support.dragConnection(d1, d2);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");
        var c = _jsPlumb.select().get(0);
        equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse connect");
        equal(1, _jsPlumb.select().length, "1 connection");

        //support.relocateSource(c, d3);
        //equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 0, "0 connections registered for d1 after source relocate");
        //equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after source relocate");
        //equal(_jsPlumb.anchorManager.getConnectionsFor("d3").length, 1, "1 connection registered for d3 after source relocate");
        //equal(_jsPlumb.anchorManager.getConnectionsFor(c.floatingId).length, 0, "0 connections registered for temporary drag element after mouse detach");
    });




// ----------------------- draggables and posses ----------------------------------------------------

    test("dragging works", function() {
        var d = support.addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";

        _jsPlumb.draggable(d);

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(150, parseInt(d.style.left, 10));
        equal(150, parseInt(d.style.top, 10));
    });

  test("dragging a posse works, elements as argument", function() {

        var d = support.addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";

        var d2 = support.addDiv("d2");
        d2.style.position = "absolute";
        d2.style.left = "450px";
        d2.style.top = "450px";

        _jsPlumb.draggable([d,d2]);
        _jsPlumb.addToPosse([d,d2], "posse");

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(150, parseInt(d.style.left, 10));
        equal(150, parseInt(d.style.top, 10));

        equal(550, parseInt(d2.style.left, 10));
        equal(550, parseInt(d2.style.top, 10));

        _jsPlumb.removeFromPosse(d2, "posse");
        support.dragNodeBy(d, -100, -100);

        equal(50, parseInt(d.style.left, 10));
        equal(50, parseInt(d.style.top, 10));

        equal(550, parseInt(d2.style.left, 10));
        equal(550, parseInt(d2.style.top, 10));
    });

    test("dragging a posse works, element ids as argument", function() {
        var d = support.addDiv("d1");
        d.style.position = "absolute";
        d.style.left = "50px";
        d.style.top = "50px";

        var d2 = support.addDiv("d2");
        d2.style.position = "absolute";
        d2.style.left = "450px";
        d2.style.top = "450px";

        _jsPlumb.draggable([d,d2]);
        _jsPlumb.addToPosse(["d1","d2"], "posse");

        support.dragNodeBy(d, 100, 100, {
            beforeMouseUp:function() {
                ok(d.classList.contains("jtk-drag"), "drag class set on element");
            },
            after:function() {
                ok(!d.classList.contains("jtk-drag"), "drag class no longer set on element");
            }
        });

        equal(150, parseInt(d.style.left, 10));
        equal(150, parseInt(d.style.top, 10));

        equal(550, parseInt(d2.style.left, 10));
        equal(550, parseInt(d2.style.top, 10));


        _jsPlumb.removeFromPosse(d2, "posse");
        support.dragNodeBy(d, -100, -100);

        equal(50, parseInt(d.style.left, 10));
        equal(50, parseInt(d.style.top, 10));

        equal(550, parseInt(d2.style.left, 10));
        equal(550, parseInt(d2.style.top, 10));
    });

    test("connection dragging, redrop on original target endpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        var e1 = _jsPlumb.addEndpoint(d1, { isSource:true });
        var e2 = _jsPlumb.addEndpoint(d2, { isTarget:true });

        var c = _jsPlumb.connect({source: e1, target: e2});
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

        support.relocateTarget(c, e2.canvas);
        equal(_jsPlumb.anchorManager.getConnectionsFor("d1").length, 1, "1 connection registered for d1 after mouse connect");
        equal(_jsPlumb.anchorManager.getConnectionsFor("d2").length, 1, "1 connection registered for d2 after mouse connect");

    });


    test("draggable function, the various ways in which it can be called", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");

        _jsPlumb.draggable(d1); // by element
        _jsPlumb.draggable(["d2", d3]);
        _jsPlumb.draggable(document.querySelectorAll("#d4"));

        ok(jsPlumb.hasClass(d1, "jtk-draggable"), "element registered as Element ok");
        ok(jsPlumb.hasClass(d2, "jtk-draggable", "elements registered as id in array ok"));
        ok(jsPlumb.hasClass(d3, "jtk-draggable", "elements registered as Element in array ok"));
        ok(jsPlumb.hasClass(d4, "jtk-draggable", "querySelectorAll output ok as input"));
    });


    test("droppable function, the various ways in which it can be called", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d3 = support.addDiv("d3"), d4 = support.addDiv("d4");

        _jsPlumb.droppable(d1); // by element
        _jsPlumb.droppable(["d2", d3]);
        _jsPlumb.droppable(document.querySelectorAll("#d4"));

        ok(jsPlumb.hasClass(d1, "jtk-droppable"), "element registered as Element ok");
        ok(jsPlumb.hasClass(d2, "jtk-droppable", "elements registered as id in array ok"));
        ok(jsPlumb.hasClass(d3, "jtk-droppable", "elements registered as Element in array ok"));
        ok(jsPlumb.hasClass(d4, "jtk-droppable", "querySelectorAll output ok as input"));
    });

// click events on overlays

    test("overlay click event", function() {
            support.addDiv("d1");
            support.addDiv("d2");
        var count = 0;
            var c = _jsPlumb.connect({
                source: "d1",
                target: "d2",
                overlays:[
                    [ "Label", {
                        id:"label",
                        label:'hey',
                        events:{
                            click:function() {
                                count++;
                            }
                        }
                    }],
                    [ "Arrow", {
                        id:"arrow",
                        events:{
                            click:function() {
                                count++
                            }
                        }
                    }]
            ]}), o = c.getOverlay("label"), o2 = c.getOverlay("arrow");

        _jsPlumb.trigger(o.canvas, "click");
        ok(count == 1, "click event was triggered on label overlay");

        _jsPlumb.trigger(o2.path, "click");
        ok(count == 2, "click event was triggered on arrow overlay");
    });

    test("endpoint unmatched scopes", function() {
        var sourceEndpoint = {
                isSource: true,
                scope: "blue"
            }, targetEndpoint = {
                isTarget:true
            },
            d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, sourceEndpoint),
            e2 = _jsPlumb.addEndpoint(d2, targetEndpoint);

        var c = _jsPlumb.connect({source:e1, target:e2});

        ok(c == null, "no connection as scopes dont match");
    });

    test("endpoint passes scope to connection, programmatic connection", function() {
        var sourceEndpoint = {
            isSource: true,
            scope: "blue"
            }, targetEndpoint = {
            isTarget:true,
                scope:"blue"
            },
            d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, sourceEndpoint),
            e2 = _jsPlumb.addEndpoint(d2, targetEndpoint);

            var c = _jsPlumb.connect({source:e1, target:e2});

        equal(c.scope, "blue", "connection scope is blue.");
    });

    test("endpoint passes scope to connection, connection via mouse", function() {
        var sourceEndpoint = {
                isSource: true,
                scope: "blue"
            }, targetEndpoint = {
                isTarget:true,
                scope:"blue"
            },
            d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e1 = _jsPlumb.addEndpoint(d1, sourceEndpoint),
            e2 = _jsPlumb.addEndpoint(d2, targetEndpoint);

        var c = support.dragConnection(e1, e2);

        equal(c.scope, "blue", "connection scope is blue.");
    });


// ------------------------------------------- groups ---------------------------------------------------------------

    var _addGroupAndDomElement = function(j, name, params) {
        var c = support.addDiv(name, null, "container")
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

    var _setupGroups = function(doNotMakeConnections) {
        c1 = support.addDiv("container1", null, "container", 0, 50);
        c2 = support.addDiv("container2", null, "container", 300, 50);
        c3 = support.addDiv("container3", null, "container", 600, 50);
        c4 = support.addDiv("container4", null, "container", 1000, 400);
        c5 = support.addDiv("container5", null, "container", 300, 400);
        c6 = support.addDiv("container6", null, "container", 800, 1000);

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

        _addGroup(_jsPlumb, "one", c1, [c1_1,c1_2], { constrain:true, droppable:false});
        _addGroup(_jsPlumb, "two", c2, [c2_1,c2_2], {dropOverride:true});
        _addGroup(_jsPlumb, "three", c3, [c3_1,c3_2],{ revert:false });
        _addGroup(_jsPlumb, "four", c4, [c4_1,c4_2], { prune: true });
        _addGroup(_jsPlumb, "five", c5, [c5_1,c5_2], { orphan:true, droppable:false });
        _addGroup(_jsPlumb, "six", c6, [c6_1,c6_2], { orphan:true, droppable:false, proxied:false });

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
        equal(countKeys(els), 1, "1 element for group g1 to repaint");

        // add again; should ignore.
        _jsPlumb.addToGroup(g, d1);
        equal(g.getMembers().length, 1, "1 member in group");

        var g2 = _addGroupAndDomElement(_jsPlumb, "g2");
        _jsPlumb.addToGroup(g2, d1);
        equal(g.getMembers().length, 0, "0 members in group g1 after node removal");
        equal(g2.getMembers().length, 1, "1 member in group g2 after node addition");

        els = _jsPlumb.getDragManager().getElementsForDraggable("g1");
        equal(countKeys(els), 0, "0 elements for group g1 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("g2");
        equal(countKeys(els), 1, "1 element for group g2 to repaint");

        var d2 = support.addDiv("d2"), d3 = support.addDiv("d3");
        _jsPlumb.addToGroup(g2, [ d2, d3 ]);
        equal(g2.getMembers().length, 3, "3 members in group g2 after node additions");
        els = _jsPlumb.getDragManager().getElementsForDraggable("g2");
        equal(countKeys(els), 3, "3 elements for group g2 to repaint");

    });

    test("groups, dragging between groups, take one", function() {
        _setupGroups();
        var els;

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(countKeys(els), 2, "2 elements for group 3 to repaint");
        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(countKeys(els), 2, "2 elements for group 4 to repaint");

        // drag 4_1 to group 3
        _dragToGroup(_jsPlumb, c4_1, "three");
        equal(_jsPlumb.getGroup("four").getMembers().length, 1, "1 member in group four after moving a node out");
        equal(_jsPlumb.getGroup("three").getMembers().length, 3, "3 members in group three");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(countKeys(els), 3, "3 elements for group 3 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(countKeys(els), 1, "1 element for group 4 to repaint");

        // drag 4_2 to group 5 (which is not droppable)
        equal(_jsPlumb.getGroup("five").getMembers().length, 2, "2 members in group five before drop attempt");
        _dragToGroup(_jsPlumb, c4_2, "five");
        equal(_jsPlumb.getGroup("four").getMembers().length, 0, "move to group 5 fails, not droppable: 0 members in group four because it prunes");
        equal(_jsPlumb.getGroup("five").getMembers().length, 2, "but still only 2 members in group five");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(countKeys(els), 0, "0 elements for group 4 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(countKeys(els), 3, "3 elements for group 3 to repaint");

    });

    test("groups, moving between groups, take one", function() {
        _setupGroups();
        var els;

        els = _jsPlumb.getDragManager().getElementsForDraggable("container3");
        equal(countKeys(els), 2, "2 elements for group 3 to repaint");
        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(countKeys(els), 2, "2 elements for group 4 to repaint");

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
        equal(countKeys(els), 3, "3 elements for group 3 to repaint");

        els = _jsPlumb.getDragManager().getElementsForDraggable("container4");
        equal(countKeys(els), 1, "1 element for group 4 to repaint");


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

// -------------- endpoint clicks
    test("endpoint click", function() {
        var d = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d),
            c = 0,
            ec = 0;

        _jsPlumb.bind("click", function() {
            c++;
        });

        _jsPlumb.bind("endpointClick", function() {
            ec++;
        });

        // the SVG element
        _jsPlumb.trigger(e.canvas.childNodes[0], "click");

        // the path element
        _jsPlumb.trigger(e.canvas.childNodes[0].childNodes[0], "click");

        // the main endpiint
        _jsPlumb.trigger(e.canvas, "click");

        // each of those should have triggered a single click

        equal(ec, 3, "3 endpoint clicks");
        equal(c, 0, "no other clicks");
    });

    test("endpoint double click", function() {
        var d = support.addDiv("d1"),
            e = _jsPlumb.addEndpoint(d),
            c = 0,
            ec = 0;

        _jsPlumb.bind("dblclick", function() {
            c++;
        });

        _jsPlumb.bind("endpointDblClick", function() {
            ec++;
        });

        // the SVG element
        _jsPlumb.trigger(e.canvas.childNodes[0], "dblclick");

        // the path element
        _jsPlumb.trigger(e.canvas.childNodes[0].childNodes[0], "dblclick");

        // the main endpiint
        _jsPlumb.trigger(e.canvas, "dblclick");

        // each of those should have triggered a single click

        equal(ec, 3, "3 endpoint dbl clicks");
        equal(c, 0, "no other dbl clicks");
    });

    test("connector click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2}),
            c = 0;

        _jsPlumb.bind("click", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(conn.canvas.childNodes[0], "click");

        // the SVG element
        _jsPlumb.trigger(conn.canvas, "click");

        // each of those should have triggered a single click

        equal(c, 2, "2 clicks in total");
    });

    test("connector dbl click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2}),
            c = 0;

        _jsPlumb.bind("dblclick", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(conn.canvas.childNodes[0], "dblclick");

        // the SVG element
        _jsPlumb.trigger(conn.canvas, "dblclick");

        // each of those should have triggered a single click

        equal(c, 2, "2 dblclicks in total");
    });

    test("overlay click", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                [ "Arrow", { id:"lbl" }]
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("click", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.canvas.childNodes[0], "click");
        _jsPlumb.trigger(lbl.canvas.childNodes[1], "click");

        // the SVG element
        _jsPlumb.trigger(lbl.canvas, "click");

        // each of those should have triggered a single click

        equal(c, 3, "3 clicks in total");
    });

    test("overlay dblclick", function() {
        var d = support.addDiv("d1"), d2 = support.addDiv("d2"),
            conn = _jsPlumb.connect({source:d, target:d2, overlays:[
                [ "Arrow", { id:"lbl" }]
            ]}),
            lbl = conn.getOverlay("lbl"),
            c = 0;

        _jsPlumb.bind("dblclick", function() {
            c++;
        });

        // the path element
        _jsPlumb.trigger(lbl.canvas.childNodes[0], "dblclick");
        _jsPlumb.trigger(lbl.canvas.childNodes[1], "dblclick");

        // the SVG element
        _jsPlumb.trigger(lbl.canvas, "dblclick");

        // each of those should have triggered a single click

        equal(c, 3, "3 dblclicks in total");
    });

    test("retrieve endpoint params, Dot endpoint", function() {
       var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
           e = _jsPlumb.connect({
               source:d1,
               target:d2,
               endpoint:["Dot", { radius:250 }]
           });

        equal(e.endpoints[0].endpoint.radius, 250, "radius is set correctly and retrievable");
    });

    test("retrieve endpoint params, Rectangle endpoint", function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"),
            e = _jsPlumb.connect({
                source:d1,
                target:d2,
                endpoint:["Rectangle", { width:250, height:250 }]
            });

        equal(e.endpoints[0].endpoint.width, 250, "width is set correctly and retrievable");
        equal(e.endpoints[0].endpoint.height, 250, "height is set correctly and retrievable");
        ok(e.endpoints[0].endpoint.x != null, "x is set and retrievable");
        ok(e.endpoints[0].endpoint.y != null, "y is set and retrievable");
    });

// ---------------------------- pluggable size/position handler --------------------------------


    test("pluggable getSize", function() {
        var j = jsPlumb.getInstance(null, {
            getSize:function() { return [100,100]; }
        });

        var d = support.addDiv("d");
        equal(j.getSize(d)[0], 100, "width is set by pluggable function");
        equal(j.getSize(d)[1], 100, "height is set by pluggable function");
    });


// -------------------------- drop precedence (required for nodes inside groups that are also droppables)
    test("drop precedence, set positive rank on element to upgrade", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 50, 50);

        _addGroup(_jsPlumb, "g1", d1, [d2]);

        _jsPlumb.makeTarget(d1);

        _jsPlumb.makeTarget(d2/*, {
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

        _jsPlumb.makeTarget(d2);

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


        ok(d2.classList.contains("jtk-drag-hover"), "d2 has hover class");
        ok(!d1.classList.contains("jtk-drag-hover"), "d1 does not have hover class; only d2 has, even though it was second.");

        _jsPlumb.trigger(d2, "mouseup", d2TargetEvent);

        equal(_jsPlumb.select().length, 1, "one connection after drag from source to target");
        equal(d2, _jsPlumb.select().get(0).target, "connection target is d2");

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



    test("endpoint deletion: no deletion by default", function() {
        var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
        var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
        var d3 = support.addDiv("d3", null, null, 700, 700, 500, 500);
        var ep1 = _jsPlumb.addEndpoint(d1, { maxConnections:-1}), ep2 = _jsPlumb.addEndpoint(d2), ep3 = _jsPlumb.addEndpoint(d3);
        var c1 = _jsPlumb.connect({source:ep1, target:ep2});
        var c2 = _jsPlumb.connect({source:ep1, target:ep3});

        equal(_jsPlumb.select().length, 2, "two connections in the instance");
        equal(_jsPlumb.selectEndpoints().length, 3, "three endpoints in the instance");

        _jsPlumb.deleteConnection(c1);

        equal(_jsPlumb.select().length, 1, "one connection in the instance");
        equal(_jsPlumb.selectEndpoints().length, 3, "three endpoints in the instance");

        _jsPlumb.deleteEndpoint(ep1);
    });

    /*
     test("endpoint deletion: no deletion by default", function() {
     var d1 = support.addDiv("d1", null, null, 0, 0, 500, 500);
     var d2 = support.addDiv("d2", d1, null, 200, 200, 50, 50);
     var d3 = support.addDiv("d3", null, null, 700, 700, 500, 500);
     var ep1 = _jsPlumb.addEndpoint(d1, { maxConnections:-1}), ep2 = _jsPlumb.addEndpoint(d2), ep3 = _jsPlumb.addEndpoint(d3);
     var c1 = _jsPlumb.connect({source:ep1, target:ep2});
     var c2 = _jsPlumb.connect({source:ep1, target:ep3});

     equal(_jsPlumb.select().length, 2, "two connections in the instance");
     equal(_jsPlumb.selectEndpoints().length, 3, "three endpoints in the instance");
     _jsPlumb.detach({connection:c1});
     equal(_jsPlumb.select().length, 1, "one connection in the instance");
     equal(_jsPlumb.selectEndpoints().length, 3, "three endpoints in the instance");
     });
     */

    test("events fired on discrete ticks of the event loop", function() {
        var a = {}, count = 0, flip = false;
        jsPlumbUtil.EventGenerator.apply(a, []);

        a.bind("event", function() {

            if (flip)
                equal(count, 1, "an event was already fired when the second event is processed");
            else
                equal(count, 0, "an event was not yet fired");

            // if this is the first event, we want to set a flag and fire a new event.

            if (!flip) {
                flip = true;
                a.fire("event");
            }

            count++

        });

        a.fire("event");

        equal(count, 2, "an event was fired");
    })

};


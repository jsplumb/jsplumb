QUnit.config.reorder = false;
var defaults = null, support, _jsPlumb;

var testSuite = function () {

    module("jsPlumb - viewports", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumbBrowserUI.newInstance(({container:container}));
            support = jsPlumbTestSupport.getInstance(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.Defaults);
        }
    });


    test('override getSize to return a constant - control test', function () {

        // test that our assumption about the number of times getSize is ordinarily called is correct

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");

        var gs = _jsPlumb.getSize, gsc = 0;
        _jsPlumb.getSize = function() {
            gsc++
            return gs.apply(_jsPlumb, arguments)
        };

        _jsPlumb.addEndpoint(d1, {anchor:"Center"})

        equal(1, gsc, "getSize called 1 time")

    });

    test('override getSize to return a constant value', function () {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        d1.style.left = "0px";
        d1.style.top = "0px";

        var gs = _jsPlumb.getSize, gsc = 0, gsc2 = 0;
        _jsPlumb.getSize = function() {
            gsc++
            return gs.apply(_jsPlumb, arguments)
        };

        _jsPlumb.viewport.getSize = function(el) {
            gsc2++;
            return [ 300, 600 ]
        };

        var e1 = _jsPlumb.addEndpoint(d1, {anchor:"Center"})

        equal(0, gsc, "_jsPlumb DOM getSize called 0 times, because it's been overridden by a fixed size return")
        equal(1, gsc2, "overridden viewport getSize called 1 time")

        equal(e1.anchor.lastReturnValue[0], 150, "anchor x positioned according to fixed size")
        equal(e1.anchor.lastReturnValue[1], 300, "anchor y positioned according to fixed size")

    });

    test('override getOffset to return a constant value', function () {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d1Id = _jsPlumb.getId(d1), d2Id = _jsPlumb.getId(d2);

        // set positions via style attribute. ordinarily these would be what jsplumn uses
        d1.style.left = "0px";
        d1.style.top = "0px";

        d1.style.height = "100px";
        d1.style.width = "100px";

        d2.style.left = "600px";
        d2.style.top = "600px";

        // map of element ids to offsets
        var offsets = {}
        offsets[d1Id] = {left:400, top:600}
        offsets[d2Id] = {left:1400, top:2000}

        _jsPlumb.viewport.getOffset = function(el) {
            return offsets[_jsPlumb.getId(el)]
        };

        var e1 = _jsPlumb.addEndpoint(d1, {anchor:"Center"})

        equal(e1.anchor.lastReturnValue[0], 450, "anchor x positioned according to fixed offset")
        equal(e1.anchor.lastReturnValue[1], 650, "anchor y positioned according to fixed offset")

    });

    test('override getOffset and also getSize to return constant values', function () {

        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2"), d1Id = _jsPlumb.getId(d1), d2Id = _jsPlumb.getId(d2);

        // set positions via style attribute. ordinarily these would be what jsplumb uses, but we override getOffset
        // and return values from a map instead.
        d1.style.left = "0px";
        d1.style.top = "0px";
        d2.style.left = "600px";
        d2.style.top = "600px";

        // set sizes for elements. again, these should be overridden in this case, but they are what would be
        // used normally.
        d1.style.height = "100px";
        d1.style.width = "100px";
        d2.style.height = "100px";
        d2.style.width = "100px";

        // map of element ids to offsets
        var offsets = {}
        offsets[d1Id] = {left:400, top:600}
        offsets[d2Id] = {left:1400, top:2000}

        _jsPlumb.viewport.getSize = function(el) {
            return [ 300, 600 ]
        };

        _jsPlumb.viewport.getOffset = function(el) {
            return offsets[_jsPlumb.getId(el)]
        };

        var e1 = _jsPlumb.addEndpoint(d1, {anchor:"Center"})

        equal(e1.anchor.lastReturnValue[0], 400 + (300 / 2), "anchor x positioned according to fixed offset and size")
        equal(e1.anchor.lastReturnValue[1], 600 + (600 / 2), "anchor y positioned according to fixed offset and size")

        var e2 = _jsPlumb.addEndpoint(d2, {anchor:"Center"})
        equal(e2.anchor.lastReturnValue[0], 1400 + (300 / 2), "anchor x positioned according to fixed offset and size")
        equal(e2.anchor.lastReturnValue[1], 2000 + (600 / 2), "anchor y positioned according to fixed offset and size")

    });




};

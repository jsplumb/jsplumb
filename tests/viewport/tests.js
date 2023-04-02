QUnit.config.reorder = false;
var defaults = null, support, _jsPlumb;

var testSuite = function () {

    module("jsPlumb - viewports", {
        teardown: function () {
            support.cleanup();
        },
        setup: function () {
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);
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
            return { w:300, h:600 }
        };

        var e1 = _jsPlumb.addEndpoint(d1, {anchor:"Center"})
        var a = _jsPlumb.router.getEndpointLocation(e1)

        equal(0, gsc, "_jsPlumb DOM getSize called 0 times, because it's been overridden by a fixed size return")
        equal(1, gsc2, "overridden viewport getSize called 1 time")

        equal(a.curX, 150, "anchor x positioned according to fixed size")
        equal(a.curY, 300, "anchor y positioned according to fixed size")

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
        offsets[d1Id] = {x:400, y:600}
        offsets[d2Id] = {x:1400, y:2000}

        _jsPlumb.viewport.getOffset = function(el) {
            return offsets[_jsPlumb.getId(el)]
        };

        var e1 = _jsPlumb.addEndpoint(d1, {anchor:"Center"}),
            a = _jsPlumb.router.getEndpointLocation(e1)

        equal(a.curX, 450, "anchor x positioned according to fixed offset")
        equal(a.curY, 650, "anchor y positioned according to fixed offset")

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
        offsets[d1Id] = {x:400, y:600}
        offsets[d2Id] = {x:1400, y:2000}

        _jsPlumb.viewport.getSize = function(el) {
            return {w: 300, h:600 }
        };

        _jsPlumb.viewport.getOffset = function(el) {
            return offsets[_jsPlumb.getId(el)]
        };

        var e1 = _jsPlumb.addEndpoint(d1, {anchor:"Center"}),
            sa = _jsPlumb.router.getEndpointLocation(e1)


        equal(sa.curX, 400 + (300 / 2), "anchor x positioned according to fixed offset and size")
        equal(sa.curY, 600 + (600 / 2), "anchor y positioned according to fixed offset and size")

        var e2 = _jsPlumb.addEndpoint(d2, {anchor:"Center"}),
        ta = _jsPlumb.router.getEndpointLocation(e2)
        equal(ta.curX, 1400 + (300 / 2), "anchor x positioned according to fixed offset and size")
        equal(ta.curY, 2000 + (600 / 2), "anchor y positioned according to fixed offset and size")

    });

    test('bounds not updated and elements not translated while a transaction is in effect', function() {
        var d1 = support.addDiv("d1"), d2 = support.addDiv("d2");
        d1.style.width = "200px";
        d1.style.height = "210px";

        d2.style.width = "300px";
        d2.style.height= "310px";

        d1.style.left = "50px";
        d1.style.top = "60px";

        d2.style.left = "500px";
        d2.style.top = "510px";

        var e1 = _jsPlumb.manage(d1, "d1")
        var e2 = _jsPlumb.manage(d2, "d2")
        equal(e1.viewportElement.x, 50, "e1 x is correct")
        equal(e1.viewportElement.y, 60, "e1 y is correct")
        equal(e1.viewportElement.w, 200, "e1 w is correct")
        equal(e1.viewportElement.h, 210, "e1 h is correct")
        equal(e1.viewportElement.x2, 250, "e1 x2 is correct")
        equal(e1.viewportElement.y2, 270, "e1 y2 is correct")
        equal(e1.viewportElement.t.x, 50, "e1 x is correct in finalised object")
        equal(e1.viewportElement.t.y, 60, "e1 y is correct in finalised object")
        equal(e1.viewportElement.t.w, 200, "e1 w is correct in finalised object")
        equal(e1.viewportElement.t.h, 210, "e1 h is correct in finalised object")
        equal(e1.viewportElement.t.x2, 250, "e1 x2 is correct in finalised object")
        equal(e1.viewportElement.t.y2, 270, "e1 y2 is correct in finalised object")

        equal(_jsPlumb.viewport.getX(), 50, "viewport min x is 50")
        equal(_jsPlumb.viewport.getY(), 60, "viewport min y is 60")
        equal(_jsPlumb.viewport.getBoundsWidth(), 750, "viewport width is 750")
        equal(_jsPlumb.viewport.getBoundsHeight(), 760, "viewport min y is 760")

        // Start a transaction. Once the transaction is in effect, updating any elements will only cause their x/y/w/h/r properties to change,
        // but they will not be finalised, and the bounds of the viewport will not be recomputed, until the transaction is ended.
        _jsPlumb.viewport.startTransaction()

        // so, update d1
        _jsPlumb.viewport.updateElement("d1", 600, 610)
        e1 = _jsPlumb.viewport.getPosition("d1")

        // check that the x/y/w/h/x2/y2 properties have been changed
        equal(e1.x, 600, "e1 x is correct after change")
        equal(e1.y, 610, "e1 y is correct after change")
        equal(e1.w, 200, "e1 w is unchanged")
        equal(e1.h, 210, "e1 h is unchanged")
        equal(e1.x2, 800, "e1 x2 is correct after change")
        equal(e1.y2, 820, "e1 y2 is correct after change")

        // ...but that the finalised properties have not been changed
        equal(e1.t.x, 50, "e1 x is unchanged in finalised object; a transaction is active")
        equal(e1.t.y, 60, "e1 y is unchanged in finalised object; a transaction is active")
        equal(e1.t.w, 200, "e1 w is unchanged")
        equal(e1.t.h, 210, "e1 h is unchanged")
        equal(e1.t.x2, 250, "e1 x2 is unchanged in finalised object; a transaction is active")
        equal(e1.t.y2, 270, "e1 y2 is unchanged in finalised object; a transaction is active")

        // ....and also that the viewport's bounds have not been recomputed.
        equal(_jsPlumb.viewport.getX(), 50, "viewport min x is 50 (unchanged; a transaction is in effect)")
        equal(_jsPlumb.viewport.getY(), 60, "viewport min y is 60 (unchanged; a transaction is in effect)")
        equal(_jsPlumb.viewport.getBoundsWidth(), 750, "viewport width is 750 (unchanged; a transaction is in effect)")
        equal(_jsPlumb.viewport.getBoundsHeight(), 760, "viewport height is 760 (unchanged; a transaction is in effect)")

        // end the transaction
        _jsPlumb.viewport.endTransaction()

        e1 = _jsPlumb.viewport.getPosition("d1")
        // check that the values in the finalised object have been updated.
        equal(e1.t.x, 600, "e1 x is now changed in finalised object; the transaction was ended")
        equal(e1.t.y, 610, "e1 y is now changed in finalised object; the transaction was ended")
        equal(e1.t.w, 200, "e1 w is unchanged")
        equal(e1.t.h, 210, "e1 h is unchanged")
        equal(e1.t.x2, 800, "e1 x2 is now changed in finalised object; the transaction was ended")
        equal(e1.t.y2, 820, "e1 y2 is now changed in finalised object; the transaction was ended")

        // the viewport's bounds should also have been recomputed now.
        equal(_jsPlumb.viewport.getX(), 500, "viewport min x is now 300 (d2 is leftmost)")
        equal(_jsPlumb.viewport.getY(), 510, "viewport min y is 510 (d2 is topmost)")
        equal(_jsPlumb.viewport.getBoundsWidth(), 300, "viewport width is now 300")
        equal(_jsPlumb.viewport.getBoundsHeight(), 310, "viewport height is now 310")
    });

    test("only one transaction can be active at a single time", function() {
        try {
            _jsPlumb.viewport.startTransaction()
            _jsPlumb.viewport.startTransaction()
            ok(false, "Starting a second transaction did not cause the viewport to throw an error")
        } catch {
            ok(true,"starting a second transaction caused the viewport to throw an error")
        }
    })




};

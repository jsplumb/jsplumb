QUnit.config.reorder = false;

var defaults = null, _divs = [],
    _cleanup = function (_jsPlumb) {
        _jsPlumb.reset();
        _jsPlumb.unbindContainer();
        if (_jsPlumb.select().length != 0)
            throw "there are connections!";

        _jsPlumb.Defaults = defaults;

        for (var i in _divs) {
            var d = document.getElementById(_divs[i]);
            d && d.parentNode.removeChild(d);
        }
        _divs.splice(0, _divs.length - 1);
        document.getElementById("container").innerHTML = "";
    };

var testSuite = function (_jsPlumb) {

    var renderMode = jsPlumb.SVG;
    var support = jsPlumbTestSupport.getInstance(_jsPlumb);

    module("Make Source", {
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

    test("sanity", function() {
        equal(1,1);
    });


};

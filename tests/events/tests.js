QUnit.config.reorder = false;

var defaults = null, support, _jsPlumb, container;

var makeContainer = function() {
    container = document.createElement("div")
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


/**
 * Tests for dragging
 * @param _jsPlumb
 */

var testSuite = function () {

    var _detachThisConnection = function(c) {
        var idx = c.endpoints[1].connections.indexOf(c);
        support.detachConnection(c.endpoints[1], idx);
    };

    var _addDiv = function(id, x, y, w, h) {
        if (!x) {
            _jsPlumb.testx = _jsPlumb.testx || 0;
            _jsPlumb.testx += 100;
            x = _jsPlumb.textx;
        }

        if (!y) {
            _jsPlumb.testy = _jsPlumb.testy || 0;
            _jsPlumb.testy += 100;
            y = _jsPlumb.testy;
        }

        return support.addDiv(id, _jsPlumb.getContainer(), "", x, y, w, h);
    };

    module("DOM Events", {
        // uncomment 'tests' and the code in this method and the tests will stop (if you have dev tools open) when a test fails.
        // it can be handy to see what's going on with the DOM elements when a test fails.
        teardown: function (/*tests*/) {

            support.cleanup();
            removeContainer()
        },
        setup: function () {
            makeContainer()
            _jsPlumb = jsPlumb.newInstance(({container:container}));
            support = jsPlumb.createTestSupportInstanceQUnit(_jsPlumb);
            defaults = jsPlumb.extend({}, _jsPlumb.defaults);


        }
    });

    // setup the container

    test("sanity", function() {
        equal(1,1);
    });


    test("click", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var clicked = false;
        _jsPlumb.on(d, "click", function() {
            clicked = true
        })

        support.clickOnElement(d)

        ok(clicked, "click event fired")
    })

    test("click, NodeList", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("one", 550, 550, 100, 100)

        d.className = "foo"
        d2.className = "foo"

        var clicked = false;
        _jsPlumb.on(document.querySelectorAll(".foo"), "click", function() {
            clicked = true
        })

        support.clickOnElement(d)

        ok(clicked, "click event fired")

        support.clickOnElement(d2)

        ok(clicked, "click event fired")
    })

    test("element:click", function() {
        var d = _addDiv("one", 50, 50, 100, 100)

        _jsPlumb.manage(d)

        var clicked = false
        _jsPlumb.bind("element:click", function(el, evt) {
            clicked = true
        })

        support.clickOnElement(d)

        ok(clicked, "element:click event fired")
    })

    test("element:tap", function() {
        var d = _addDiv("one", 50, 50, 100, 100)

        _jsPlumb.manage(d)

        var clicked = false
        _jsPlumb.bind("element:tap", function(el, evt) {
            clicked = true
        })

        support.tapOnElement(d)

        ok(clicked, "element:tap event fired")
    })

    test("element:dblclick", function() {
        var d = _addDiv("one", 50, 50, 100, 100)

        _jsPlumb.manage(d)

        var clicked = false
        _jsPlumb.bind("element:dblclick", function(el, evt) {
            clicked = true
        })

        support.clickOnElement(d)
        support.clickOnElement(d, 2)

        ok(clicked, "element:dblclick event fired")
    })

    test("element:dbltap", function() {
        var d = _addDiv("one", 50, 50, 100, 100)

        _jsPlumb.manage(d)

        var clicked = false
        _jsPlumb.bind("element:dbltap", function(el, evt) {
            clicked = true
        })

        support.dblTapOnElement(d)

        ok(clicked, "element:dbltap event fired")
    })


    test("dblclick", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var clicked = false;
        _jsPlumb.on(d, "dblclick", function() {
            clicked = true
        })

        support.dblClickOnElement(d)

        ok(clicked, "dblclick event fired")
    })

    test("tap", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var tapped = false;
        _jsPlumb.on(d, "tap", function() {
            tapped= true
        })

        support.tapOnElement(d)

        ok(tapped, "tap event fired")
    })

    test("dbltap", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var tapped = false;
        _jsPlumb.on(d, "dbltap", function() {
            tapped= true
        })

        support.dblTapOnElement(d)

        ok(tapped, "dbltap event fired")
    })

    test("tap doesnt fire when mouseup on some other element", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var tapped = false;
        _jsPlumb.on(d, "tap", function() {
            tapped= true
        })

        _jsPlumb.trigger(d, "mousedown")
        _jsPlumb.trigger(document, "mouseup")

        ok(!tapped, "tap event not fired")
    })

    test("tap, child element", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var tapped = false;
        _jsPlumb.on(d, "tap", function() {
            tapped= true
        })

        support.tapOnElement(d1)

        ok(tapped, "tap event fired")
    })

    test("click, child element", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "click", function() {
            clicked = true
        })

        support.clickOnElement(d1)

        ok(clicked, "click event fired")
    })

    test("click, child element, delegate selector", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.className = "one"
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.className = "two"
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "click", ".one", function() {
            clicked = true
        })

        support.clickOnElement(d1)

        ok(clicked, "click event fired")

        clicked = false

        support.clickOnElement(d2)

        ok(!clicked, "click event not fired when child selector doesnt match")
    })

    test("click, child element, delegate selector, filter with single class", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.className = "one"
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.className = "two"
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "click", ":not(.two)", function() {
            clicked = true
        })

        support.clickOnElement(d1)

        ok(clicked, "click event fired")

        clicked = false

        support.clickOnElement(d2)

        ok(!clicked, "click event not fired when child selector matches but clicked element is filtered")
    })

    test("click, child element, delegate selector, filter with two classes", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.className = "one"
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.className = "two"
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "click", ":not(.one), :not(.two)", function() {
            clicked = true
        })

        support.clickOnElement(d1)

        ok(!clicked, "click event not fired when child selector matches but clicked element is filtered")

        support.clickOnElement(d2)

        ok(!clicked, "click event not fired when child selector matches but clicked element is filtered")
    })

    test("tap, child element, delegate selector", function() {
        var d = _addDiv("one", 50, 50, 100, 100)
        var d1 = document.createElement("div")
        d1.className = "one"
        d1.style.width = "10px";
        d1.style.height= "10px";
        d.appendChild(d1)
        var d2 = document.createElement("div")
        d2.className = "two"
        d2.style.width = "10px";
        d2.style.height= "10px";
        d.appendChild(d2)
        var clicked = false;
        _jsPlumb.on(d, "tap", ".one", function() {
            clicked = true
        })

        support.tapOnElement(d1)

        ok(clicked, "tap event fired")

        clicked = false

        support.tapOnElement(d2)

        ok(!clicked, "click event not fired when child selector doesnt match")
    })

// -----------------connections -------------------------------------------

    test("connection click", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
         d2 = _addDiv("two", 50, 50, 400, 400);
        var clicked = false;
        _jsPlumb.bind("connection:click", function() {
            clicked = true
        })
        var c = _jsPlumb.connect({source:d, target:d2});

        support.clickOnConnection(c)

        ok(clicked, "click event fired")
    })

    test("connection:dblclick", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 50, 50, 400, 400)

        var clicked = false;
        _jsPlumb.bind("connection:dblclick", function() {
            clicked = true
        })

        var c = _jsPlumb.connect({source:d, target:d2});
        support.dblClickOnConnection(c)

        ok(clicked, "connection:dblclick event fired")
    })

    test("connection:tap", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 50, 50, 400, 400)
        var tapped = false;
        _jsPlumb.bind("connection:tap", function() {
            tapped= true
        })
        var c = _jsPlumb.connect({source:d, target:d2});

        support.tapOnConnection(c)

        ok(tapped, "connection:tap event fired")
    })

    test("connection:dbltap", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 50, 50, 400, 400)
        var tapped = false;
        _jsPlumb.bind("connection:dbltap", function() {
            tapped= true
        })

        var c = _jsPlumb.connect({source:d, target:d2});

        support.dblTapOnConnection(c)

        ok(tapped, "connection:dbltap event fired")
    })

// ----------------- connection overlays -------------------------------------------

    test("overlay click", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 50, 50, 400, 400);

        var clicked = false;

        var c = _jsPlumb.connect({
            source:d,
            target:d2,
            overlays:[
                {
                    type:"Label",
                    options: {
                        label: "FOO",
                        id: "overlay",
                        events: {
                            click: function () {
                                clicked = true
                            }
                        }
                    }
                }
            ]
        });

        support.clickOnOverlay(c,"overlay")

        ok(clicked, "click event fired")
    })

    test("overlay dblclick", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 50, 50, 400, 400)

        var clicked = false;
        var c = _jsPlumb.connect({
            source:d,
            target:d2,
            overlays:[
                {
                    type:"Label",
                    options: {
                        label: "FOO",
                        id: "overlay",
                        events: {
                            dblclick: function () {
                                clicked = true
                            }
                        }
                    }
                }
            ]
        });

        support.dblClickOnOverlay(c,"overlay")

        ok(clicked, "dblclick event fired")
    })

    test("overlay tap", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 50, 50, 400, 400)

        var clicked = false;
        var c = _jsPlumb.connect({
            source:d,
            target:d2,
            overlays:[
                {
                    type:"Label",
                    options: {
                        label: "FOO",
                        id: "overlay",
                        events: {
                            tap: function () {
                                clicked = true
                            }
                        }
                    }
                }
            ]
        });

        support.tapOnOverlay(c,"overlay")

        ok(clicked, "tap event fired")

    })

    test("connection dbltap", function() {
        var d = _addDiv("one", 50, 50, 100, 100),
            d2 = _addDiv("two", 50, 50, 400, 400)

        var clicked = false;
        var c = _jsPlumb.connect({
            source:d,
            target:d2,
            overlays:[
                {
                    type:"Label",
                    options: {
                        label: "FOO",
                        id: "overlay",
                        events: {
                            dbltap: function () {
                                clicked = true
                            }
                        }
                    }
                }
            ]
        });

        support.dblTapOnOverlay(c,"overlay")

        ok(clicked, "dbltap event fired")

    })

    test("event unbind", function() {
        var d = _addDiv("one", 0, 0, 1000, 1000), count = 0,
            d2 = _addDiv("two", 50, 50, 1000, 1000),
            e = new jsPlumb.EventManager()

        d2.className = "button"
        d.appendChild(d2)

        var h = function() {
            count++
        }

        e.on(d, "mousedown", ".button", h)

        _jsPlumb.trigger(d2, "mousedown")

        equal(1, count, "count has gone up by 1 after mousedown")

        e.off(d, "mousedown", h)

        _jsPlumb.trigger(d2, "mousedown")

        equal(1, count, "count has NOT gone up by 1 after mousedown when event handler was unbound")

    });

    test("endpoint hover", function() {
        var d = _addDiv("one", 0, 0, 100, 100), count = 0,
            d2 = _addDiv("two", 250, 520, 100, 100),
            e1 = _jsPlumb.addEndpoint(d, {
                hoverClass:"hovering"
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                hoverClass:"hovering"
            }),
            c = _jsPlumb.connect({source:e1, target:e2})

        support.fireEventOnEndpoint(e1, "mouseover", "mousemove")
        var c = support.getEndpointCanvas(e1)
        ok(c.classList.contains("hovering"), "hovered endpoint has hover class")
        var c2 = support.getEndpointCanvas(e2)
        ok(c2.classList.contains("hovering"), "other endpoint has hover class")
    })

    test("connector hover (including adding classes to source and target endpoints)", function() {
        var d = _addDiv("one", 0, 0, 100, 100),
            d2 = _addDiv("two", 250, 250, 100, 100),
            e1 = _jsPlumb.addEndpoint(d, {
                hoverClass:"sourcehovering"
            }),
            e2 = _jsPlumb.addEndpoint(d2, {
                hoverClass:"targethovering"
            }),
            c = _jsPlumb.connect({source:e1, target:e2})

        var cc = support.getConnectionCanvas(c)

        support.fireEventOnElement(cc.childNodes[0], "mouseover", "mousemove")

        ok(cc.classList.contains("jtk-hover"), "connector has hover class")
        var c = support.getEndpointCanvas(e1)
        ok(d.classList.contains("jtk-source-hover"), "source element has standard hover class")
        ok(c.classList.contains("sourcehovering"), "source endpoint has user supplied hover class")
        var c2 = support.getEndpointCanvas(e2)
        ok(d2.classList.contains("jtk-target-hover"), "target element has standard hover class")
        ok(c2.classList.contains("targethovering"), "source endpoint has user supplied hover class")

        support.fireEventOnElement(cc.childNodes[0], "mouseout")
        ok(!d.classList.contains("jtk-source-hover"), "source element hover class removed")
        ok(!d2.classList.contains("jtk-target-hover"), "target element hover class removed")
    })

};

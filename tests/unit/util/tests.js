QUnit.config.reorder = false;

var defaults = null, _divs = [], support,
    _cleanup = function (_jsPlumb) {
        _jsPlumb.reset();
        _jsPlumb.unbindContainer();
        if (_jsPlumb.select().length != 0)
            throw "there are connections!";

        _jsPlumb.Defaults = defaults;

        support.cleanup();

        document.getElementById("container").innerHTML = "";
    };

var testSuite = function (_jsPlumb) {

    var renderMode = jsPlumb.SVG;
    support = jsPlumbTestSupport.getInstance(_jsPlumb);

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

    test(" jsPlumbUtil.extend, single parent", function () {

        var Parent = function (arg) {
            this.aValue = "parent";
            this.inputArg = arg;
            console.log("FOO");
        };
        Parent.prototype = {
            id: function () {
                return "parent";
            },
            id2: function () {
                return "parent2";
            }
        };

        // extend parent and call with no constructor args and nothing overridden.
        var Child = function () {
            Parent.apply(this, arguments);
        };
        jsPlumbUtil.extend(Child, Parent);
        var aChild = new Child();
        equal(aChild.id(), "parent", "child has inherited parent's id method");
        equal(aChild.id2(), "parent2", "child has inherited parent's id2 method");
        equal(aChild.aValue, "parent", "child has inherited parent's aValue property");
        ok(typeof aChild.inputArg == "undefined", "input argument was undefined");

        // extend parent and call with a constructor arg
        var anotherChild = new Child("foo");
        equal(anotherChild.inputArg, "foo", "input argument was 'foo'");

        // extend parent with a constructor, then call it and check child's constructor was run.
        var Child2 = function (arg) {
            Parent.apply(this, arguments);
            this.inputArg = arg + " from child";
        };
        jsPlumbUtil.extend(Child2, Parent);
        var thirdChild = new Child2("foo");
        equal(thirdChild.inputArg, "foo from child", "input argument was 'foo from child'");

        // extend parent with a prototype that overrides the id method
        var Child3 = function () {
            Parent.apply(this, arguments);
        };

        jsPlumbUtil.extend(Child3, Parent, {
            id: function () {
                return "child";
            },
            id2: function () {
                return "child2";
            }
        });
        var fourthChild = new Child3("fourthChild");
        equal(fourthChild.inputArg, "fourthChild", "input arg was overriden correctly");
        equal(fourthChild.id(), "child", "id method from prototype was overridden");
        equal(fourthChild.id2(), "child2", "id method from prototype was overridden");
    });

    test(" jsPlumbUtil.extend, multiple parents", function () {

        var Mother = function (arg) {
            this.aValue = "mother";
            this.inputArg = arg;
            console.log("Mother");
        };
        Mother.prototype = {
            id: function () {
                return "mother";
            },
            mother: function () {
                return "mother";
            }
        };

        var Father = function (arg) {
            this.aValue = "father";
            this.inputArg = arg;
            console.log("Father");
        };
        Father.prototype = {
            id: function () {
                return "father";
            },
            father: function () {
                return "father";
            }
        };

        // extend parent and call with no constructor args and nothing overridden.
        var Child = function () {
            Mother.apply(this, arguments);
            Father.apply(this, arguments);
        };

        jsPlumbUtil.extend(Child, [Mother, Father]);
        var aChild = new Child();
        equal(aChild.id(), "father", "child has inherited father's id method");
        equal(aChild.mother(), "mother", "child has inherited mother's method");
        equal(aChild.father(), "father", "child has inherited father's method");
        equal(aChild.aValue, "father", "child has inherited father's aValue property");
        ok(typeof aChild.inputArg == "undefined", "input argument was undefined");

        // extend parent and call with a constructor arg
        var anotherChild = new Child("foo");
        equal(anotherChild.inputArg, "foo", "input argument was 'foo'");

        // extend parents with a constructor, then call it and check child's constructor was run.
        var Child2 = function (arg) {
            Mother.apply(this, arguments);
            Father.apply(this, arguments);
            this.inputArg = arg + " from child";
        };
        jsPlumbUtil.extend(Child2, [Mother, Father]);
        var thirdChild = new Child2("foo");
        equal(thirdChild.inputArg, "foo from child", "input argument was 'foo from child'");

        // extend parents with a prototype that overrides the id method
        var Child3 = function () {
            Mother.apply(this, arguments);
            Father.apply(this, arguments);
        };
        jsPlumbUtil.extend(Child3, [Mother, Father], {
            id: function () {
                return "child";
            }
        });
        var fourthChild = new Child3("fourthChild");
        equal(fourthChild.inputArg, "fourthChild", "input arg was overriden correctly");
        equal(fourthChild.id(), "child", "id method from prototype was overridden");
    });

    test(" jsPlumb.getSelector, simple case", function () {
        support.addDiv("d1");
        var s = _jsPlumb.getSelector("#d1");
        equal(s.length, 1, "d1 found by getSelector");
    });

    test(" jsPlumb.getSelector, with context node given as selector", function () {
        var d1 = support.addDiv("d1");
        var d = support.makeContent("<div id='foo'></div>");
        d1.appendChild(jsPlumb.getElement(d));
        var s = _jsPlumb.getSelector(d1, "#foo");
        equal(s.length, 1, "foo found by getSelector with context d1");
        equal(s[0].getAttribute("id"), "foo", "foo found by getSelector with context d1");
    });

    test(" jsPlumb.getSelector, with context node given as DOM element", function () {
        var d1 = support.addDiv("d1");
        var d = support.makeContent("<div id='foo'></div>");
        d1.appendChild(jsPlumb.getElement(d));
        var s = _jsPlumb.getSelector(d1, "#foo");
        equal(s.length, 1, "foo found by getSelector with context d1");
        equal(s[0].getAttribute("id"), "foo", "foo found by getSelector with context d1");
    });

    test("hasClass method, SVG element", function() {
        var svg = support.makeContent("<svg></svg>");
        jsPlumb.addClass(svg, "bar");
        jsPlumb.addClass(svg, "foo");
        ok(jsPlumb.hasClass(svg, "foo"), "class 'foo' found");
        ok(jsPlumb.hasClass(svg, "bar"), "class 'bar' found");
    });


    //
    // test the merge function in jsplumb util: it should create an entirely new object
    //
    test(" jsPlumbUtil.merge", function () {
        var a = {
                foo: "a_foo",
                bar: "a_bar",
                nested: {
                    foo: "a_foo",
                    bar: "a_bar"
                },
                becomeArray: "foo",
                becomeArray2: ["foo"]
            },
            b = {
                foo: "b_foo",
                nested: {
                    foo: "b_foo"
                },
                becomeArray: "bar",
                becomeArray2: "bar"
            },
            c = jsPlumbUtil.merge(a, b, [ "becomeArray", "becomeArray2"]);

        equal(c.foo, "b_foo", "c has b's foo");
        equal(c.nested.foo, "b_foo", "c has b's nested foo");
        // the 'becomeArray' values should have been folded into an array
        equal(c.becomeArray.length, 2, "2 values in becomeArray member");
        // the 'becomeArray2' value from 'b' should have been added to 'a'
        equal(c.becomeArray2.length, 2, "2 values in becomeArray member");

        // now change c's foo. b should be unchanged.
        c.foo = "c_foo";
        equal(b.foo, "b_foo", "b has b's foo");
        c.nested.foo = "c_foo";
        equal(b.nested.foo, "b_foo", "b has b's nested foo");
        equal(a.nested.foo, "a_foo", "a has a's nested foo");
    });



    // tests for a bug that i found in 1.3.16, in which an array would not overwrite an existing string.
    test(" jsPlumbUtil.merge, array overwriting string", function () {
        var a = {
                foo: "foo",
                bar: "bar"
            },
            b = {
                foo: [ "bar", "baz" ],
                bar: {
                    bar: "baz"
                }
            },
            c = jsPlumbUtil.merge(a, b);

        equal(c.foo[0], "bar", "array was copied correctly");
        equal(c.bar.bar, "baz", "object was copied correctly");
    });

    test(" jsPlumbUtil.clone", function () {
        var a = {
                nested: {
                    foo: "a_foo"
                }
            },
            b = jsPlumbUtil.clone(a);
        equal(b.nested.foo, "a_foo", "b has a's nested foo");
        equal(a.nested.foo, "a_foo", "a has a's nested foo");
        b.nested.foo = "b_foo";
        equal(b.nested.foo, "b_foo", "b has b's nested foo");
        equal(a.nested.foo, "a_foo", "a has a's nested foo");
    });

    test("jsPlumbUtil.replace", function () {
        var d, data = function () {
            return {
                foo: {
                    bar: {
                        baz: 23
                    },
                    ber: [
                        {},
                        {
                            baz: 22
                        }
                    ]
                }
            };
        };

        var s1 = "foo.bar.baz",
            s2 = "foo.ber[1].baz",
            s3 = "foo.ber[0]",
            f1 = "foo.qux",
            f2 = "foo.bar.qux",
            f3 = "foo.ber[3]",
            f4 = "foo.ber[0].qux",
            f5 = "foo.qux.qux",
            f6 = "foo.qux[6].qux";

        d = data();
        jsPlumbUtil.replace(d, s1, 99);
        equal(d.foo.bar.baz, 99, s1 + " successful");

        d = data();
        jsPlumbUtil.replace(d, s2, 99);
        equal(d.foo.ber[1].baz, 99, s2 + " successful");

        d = data();
        jsPlumbUtil.replace(d, s3, 99);
        equal(d.foo.ber[0], 99, s3 + " successful");

        d = data();
        jsPlumbUtil.replace(d, f1, 99);
        equal(d.foo.qux, 99, f1 + " successful");

        d = data();
        jsPlumbUtil.replace(d, f2, 99);
        equal(d.foo.bar.qux, 99, f2 + " successful");

        d = data();
        jsPlumbUtil.replace(d, f3, 99);
        equal(d.foo.ber[3], 99, f3 + " successful");

        d = data();
        jsPlumbUtil.replace(d, f4, 99);
        equal(d.foo.ber[0].qux, 99, f4 + " successful");

        d = data();
        jsPlumbUtil.replace(d, f5, 99);
        equal(d.foo.qux.qux, 99, f5 + " successful");

        d = data();
        jsPlumbUtil.replace(d, f6, 99);
        equal(d.foo.qux[6].qux, 99, f6 + " successful");

        // null test
        jsPlumbUtil.replace(null, f6, 99);
        ok(true, "null argument ignored by util.replace");

    });

    test(": jsPlumbUtil.isEmpty", function () {
        var e = {};
        equal(jsPlumbUtil.isEmpty(e), true, "e is empty");
        e.foo = "bar";
        equal(jsPlumbUtil.isEmpty(e), false, "e is not empty");
        equal(jsPlumbUtil.isEmpty(null), true, "null object is considered empty");
    });




};

;(function() {

    var DEFAULT_OPTIONS = {
        anchors:{
            top:["TopLeft", "TopRight"],
            bottom:["BottomLeft", "BottomRight"]
        }
    };

    var root = this;

    var ListManager = function(jsPlumbInstance) {

        this.count = 0;
        this.instance = jsPlumbInstance;
        this.lists = {};

        this.instance.bind("manageElement", function(p) {

            //look for [jtk-scrollable-list] elements and attach scroll listeners if necessary
            var scrollableLists = this.instance.getSelector(p.el, "[jtk-scrollable-list]");
            for (var i = 0; i < scrollableLists.length; i++) {
                this.addList(scrollableLists[i]);
            }

        }.bind(this));

        this.instance.bind("unmanageElement", function(p) {
            this.removeList(p.el);
        });
    };

    root.jsPlumbListManager = ListManager;

    ListManager.prototype = {

        addList : function(el, options) {
            options = this.instance.extend(DEFAULT_OPTIONS,  options || {});
            var id = [this.instance.getInstanceIndex(), this.count++].join("_");
            this.lists[id] = new List(this.instance, el, options, id);
        },

        removeList:function(el) {
            var list = this.lists[el._jsPlumbList];
            if (list) {
                list.destroy();
                delete this.lists[el._jsPlumbList];
            }
        }
    };

    var List = function(instance, el, options, id) {

        el["_jsPlumbList"] = id;

        var scrollHandler = function(e) {
            // console.log("scrolling a list");
            // console.log("scroll top is ", el.scrollTop);
            // console.log("viewport height is ", el.offsetHeight);

            var children = instance.getSelector(el, ".jtk-managed");
            var elId = instance.getId(el);

            for (var i = 0; i < children.length; i++) {

                //console.log(children[i].id, children[i].offsetTop);

                if (children[i].offsetTop < el.scrollTop) {
                    if (!children[i]._jsPlumbProxies) {
                        children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
                        instance.select({source: children[i]}).each(function (c) {
                            instance.proxyConnection(c, 0, el, elId, function () {
                                return "Dot";
                            }, function () {
                                return "TopRight";
                            });
                            children[i]._jsPlumbProxies.push([c, 0]);
                        });

                        instance.select({target: children[i]}).each(function (c) {
                            instance.proxyConnection(c, 1, el, elId, function () {
                                return "Dot";
                            }, function () {
                                return "TopLeft";
                            });
                            children[i]._jsPlumbProxies.push([c, 1]);
                        });
                    }
                }
                //
                else if (children[i].offsetTop > el.scrollTop + el.offsetHeight) {
                    if (!children[i]._jsPlumbProxies) {
                        children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];

                        instance.select({source: children[i]}).each(function (c) {
                            instance.proxyConnection(c, 0, el, elId, function () {
                                return "Dot";
                            }, function () {
                                return "BottomRight";
                            });
                            children[i]._jsPlumbProxies.push([c, 0]);
                        });

                        instance.select({target: children[i]}).each(function (c) {
                            instance.proxyConnection(c, 1, el, elId, function () {
                                return "Dot";
                            }, function () {
                                return "BottomLeft";
                            });
                            children[i]._jsPlumbProxies.push([c, 1]);
                        });
                    }
                } else if (children[i]._jsPlumbProxies) {
                    for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                        instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId);
                    }

                    delete children[i]._jsPlumbProxies;
                }

                instance.revalidate(children[i]);
            }
        };

        instance.on(el, "scroll", scrollHandler);

        this.destroy = function() {
            instance.off(el, "scroll", scrollHandler);
        };
    };


}).call(typeof window !== 'undefined' ? window : this);
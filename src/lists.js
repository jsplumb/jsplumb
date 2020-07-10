/*
 * This file contains the code for working with scrollable lists.
 *
 * Copyright (c) 2010 - 2020 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {

    var DEFAULT_OPTIONS = {
        deriveAnchor:function(edge, index, ep, conn) {
            return {
                top:["TopRight", "TopLeft"],
                bottom:["BottomRight", "BottomLeft"]
            }[edge][index];
        }
    };

    var root = this;

    var ListManager = function(jsPlumbInstance, params) {

        this.count = 0;
        this.instance = jsPlumbInstance;
        this.lists = {};
        this.options = params || {};

        this.instance.addList = function(el, options) {
            return this.listManager.addList(el, options);
        };

        this.instance.removeList = function(el) {
            this.listManager.removeList(el);
        };

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


        this.instance.bind("connection", function(c, evt) {
            if (evt == null) {
                // not added by mouse. look for an ancestor of the source and/or target element that is a scrollable list, and run
                // its scroll method.
                this._maybeUpdateParentList(c.source);
                this._maybeUpdateParentList(c.target);
            }
        }.bind(this));
    };

    root.jsPlumbListManager = ListManager;

    ListManager.prototype = {

        addList : function(el, options) {
            var dp = this.instance.extend({}, DEFAULT_OPTIONS);
            this.instance.extend(dp, this.options);
            options = this.instance.extend(dp,  options || {});
            var id = [this.instance.getInstanceIndex(), this.count++].join("_");
            this.lists[id] = new List(this.instance, el, options, id);
        },

        removeList:function(el) {
            var list = this.lists[el._jsPlumbList];
            if (list) {
                list.destroy();
                delete this.lists[el._jsPlumbList];
            }
        },

        _maybeUpdateParentList:function (el) {
            var parent = el.parentNode, container = this.instance.getContainer();
            while(parent != null && parent !== container) {
                if (parent._jsPlumbList != null && this.lists[parent._jsPlumbList] != null) {
                    parent._jsPlumbScrollHandler();
                    return
                }
                parent = parent.parentNode;
            }
        }


    };

    var List = function(instance, el, options, id) {

        el["_jsPlumbList"] = id;

        //
        // Derive an anchor to use for the current situation. In contrast to the way we derive an endpoint, here we use `anchor` from the options, if present, as
        // our first choice, and then `deriveAnchor` as our next choice. There is a default `deriveAnchor` implementation that uses TopRight/TopLeft for top and
        // BottomRight/BottomLeft for bottom.
        //
        // edge - "top" or "bottom"
        // index - 0 when endpoint is connection source, 1 when endpoint is connection target
        // ep - the endpoint that is being proxied
        // conn - the connection that is being proxied
        //
        function deriveAnchor(edge, index, ep, conn) {
            return options.anchor ? options.anchor : options.deriveAnchor(edge, index, ep, conn);
        }

        //
        // Derive an endpoint to use for the current situation. We'll use a `deriveEndpoint` function passed in to the options as our first choice,
        // followed by `endpoint` (an endpoint spec) from the options, and failing either of those we just use the `type` of the endpoint that is being proxied.
        //
        // edge - "top" or "bottom"
        // index - 0 when endpoint is connection source, 1 when endpoint is connection target
        // endpoint - the endpoint that is being proxied
        // connection - the connection that is being proxied
        //
        function deriveEndpoint(edge, index, ep, conn) {
            return options.deriveEndpoint ? options.deriveEndpoint(edge, index, ep, conn) : options.endpoint ? options.endpoint : ep.type;
        }

        //
        // look for a parent of the given scrollable list that is draggable, and then update the child offsets for it. this should not
        // be necessary in the delegated drag stuff from the upcoming 3.0.0 release.
        //
        function _maybeUpdateDraggable(el) {
            var parent = el.parentNode, container = instance.getContainer();
            while(parent != null && parent !== container) {
                if (instance.hasClass(parent, "jtk-managed")) {
                    instance.recalculateOffsets(parent);
                    return
                }
                parent = parent.parentNode;
            }
        }

        var scrollHandler = function(e) {

            var children = instance.getSelector(el, ".jtk-managed");
            var elId = instance.getId(el);

            for (var i = 0; i < children.length; i++) {

                if (children[i].offsetTop < el.scrollTop) {
                    if (!children[i]._jsPlumbProxies) {
                        children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
                        instance.select({source: children[i]}).each(function (c) {


                            instance.proxyConnection(c, 0, el, elId, function () {
                                return deriveEndpoint("top", 0, c.endpoints[0], c);
                            }, function () {
                                return deriveAnchor("top", 0, c.endpoints[0], c);
                            });
                            children[i]._jsPlumbProxies.push([c, 0]);
                        });

                        instance.select({target: children[i]}).each(function (c) {
                            instance.proxyConnection(c, 1, el, elId, function () {
                                return deriveEndpoint("top", 1, c.endpoints[1], c);
                            }, function () {
                                return deriveAnchor("top", 1, c.endpoints[1], c);
                            });
                            children[i]._jsPlumbProxies.push([c, 1]);
                        });
                    }
                }
                //
                else if (children[i].offsetTop + children[i].offsetHeight > el.scrollTop + el.offsetHeight) {
                    if (!children[i]._jsPlumbProxies) {
                        children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];

                        instance.select({source: children[i]}).each(function (c) {
                            instance.proxyConnection(c, 0, el, elId, function () {
                                return deriveEndpoint("bottom", 0, c.endpoints[0], c);
                            }, function () {
                                return deriveAnchor("bottom", 0, c.endpoints[0], c);
                            });
                            children[i]._jsPlumbProxies.push([c, 0]);
                        });

                        instance.select({target: children[i]}).each(function (c) {
                            instance.proxyConnection(c, 1, el, elId, function () {
                                return deriveEndpoint("bottom", 1, c.endpoints[1], c);
                            }, function () {
                                return deriveAnchor("bottom", 1, c.endpoints[1], c);
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

            _maybeUpdateDraggable(el);
        };

        instance.setAttribute(el, "jtk-scrollable-list", "true");
        el._jsPlumbScrollHandler = scrollHandler;
        instance.on(el, "scroll", scrollHandler);
        scrollHandler(); // run it once; there may be connections already.

        this.destroy = function() {
            instance.off(el, "scroll", scrollHandler);
            delete el._jsPlumbScrollHandler;

            var children = instance.getSelector(el, ".jtk-managed");
            var elId = instance.getId(el);

            for (var i = 0; i < children.length; i++) {
                if (children[i]._jsPlumbProxies) {
                    for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                        instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId);
                    }

                    delete children[i]._jsPlumbProxies;
                }
            }
        };
    };


}).call(typeof window !== 'undefined' ? window : this);

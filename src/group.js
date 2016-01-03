;(function() {
    "use strict";

    var GROUP_COLLAPSED_CLASS = "jsplumb-group-collapsed";
    var GROUP_EXPANDED_CLASS = "jsplumb-group-expanded";
    var GROUP_CONTAINER_CLASS = "jsplumb-group-content";
    var ELEMENT_DRAGGABLE_EVENT = "elementDraggable";
    var STOP = "stop";
    var REVERT = "revert";
    var GROUP_MANAGER = "_groupManager";
    var GROUP = "_jsPlumbGroup";

    var GroupManager = function(_jsPlumb) {
        var _managedGroups = {}, _connectionMap = {};

        _jsPlumb.bind("connection", function(p) {
            if(p.source[GROUP] != null && p.target[GROUP] != null && p.source[GROUP] === p.target[GROUP]) {
                //p.source[GROUP].connections.internal.push(p.connection);
                _connectionMap[p.connection.id] = p.source[GROUP];
            }
            else if (p.source[GROUP] != null) {
                p.source[GROUP].connections.source.push(p.connection);
                _connectionMap[p.connection.id] = p.source[GROUP];
            }
            else if (p.target[GROUP] != null) {
                p.target[GROUP].connections.target.push(p.connection);
                _connectionMap[p.connection.id] = p.target[GROUP];
            }
        });

        _jsPlumb.bind("connectionDetached", function(p) {
            var group = _connectionMap[p.connection.id];
            if (group != null) {
                var f = function(c) { return c.id === p.connection.id; };
                jsPlumbUtil.removeWithFunction(group.connections.source, f);
                jsPlumbUtil.removeWithFunction(group.connections.target, f);
                //jsPlumbUtil.removeWithFunction(group.connections.internal, f);
                delete _connectionMap[p.connection.id];
            }
        });

        _jsPlumb.bind("connectionMoved", function(p) {
            console.log("connectionMoved", p);
        });

        this.addGroup = function(group) {
            _jsPlumb.addClass(group.el, GROUP_EXPANDED_CLASS);
            _managedGroups[group.id] = group;
            group.manager = this;
            _updateConnectionsForGroup(group);
        };

        this.addToGroup = function(group, el) {
            this.getGroup(group).add(el);
        };

        this.removeFromGroup = function(group, el) {
            this.getGroup(group).remove(el);
        };

        this.getGroup = function(groupId) {
            var group = groupId;
            if (jsPlumbUtil.isString(groupId)) {
                group = _managedGroups[groupId];
                if (group == null) throw new TypeError("No such group [" + groupId + "]");
            }
            return group;
        };

        this.removeGroup = function(group, deleteMembers) {
            group = this.getGroup(group);
            group[deleteMembers ? "removeAll" : "orphanAll"]();
            _jsPlumb.remove(group.el);
            delete _managedGroups[group.id];
        };

        function _setVisible(group, state) {
            var m = group.getMembers();
            for (var i = 0; i < m.length; i++) {
                _jsPlumb[state ? "show" : "hide"](m[i], true);
            }
        }

        this.collapseGroup = function(group) {
            group = this.getGroup(group);

            // todo remove old proxy endpoints first, just in case?
            group.proxies.length = 0;

            // hide all connections
            _setVisible(group, false);

            // setup proxies for sources and targets
            for (var i = 0; i < group.connections.source.length; i++) {
                console.log(group.connections.source[i]);

//                var c = group.connections.source[i].clone();
//                var newEp = _jsPlumb.addEndpoint(group.el, {
//                    endpoint:group.endpoint,
//                    anchor:group.anchor
//                });
//                group.proxies[group.connections.source[i].id] = {ep:newEp, conn:c};// TODO add proxied connection.
//                c.endpoints[0] = newEp;
//                c.source = group.el;
//                c.sourceId = _jsPlumb.getId(group.el);
//                c.setVisible(true);
            }



            _jsPlumb.revalidate(group.el);
            group.collapsed = true;
            _jsPlumb.removeClass(group.el, GROUP_EXPANDED_CLASS);
            _jsPlumb.addClass(group.el, GROUP_COLLAPSED_CLASS);
        };

        this.expandGroup = function(group) {
            group = this.getGroup(group);
            _setVisible(group, true);

            // remove proxies for sources and targets


            _jsPlumb.revalidate(group.el);
            group.collapsed = false;
            _jsPlumb.addClass(group.el, GROUP_EXPANDED_CLASS);
            _jsPlumb.removeClass(group.el, GROUP_COLLAPSED_CLASS);
        };

        // TODO refactor this with the code that responds to `connection` events.
        function _updateConnectionsForGroup(group) {
            var members = group.getMembers();
            var c1 = _jsPlumb.getConnections({source:members}, true);
            var c2 = _jsPlumb.getConnections({target:members}, true);
            var processed = {};
            group.connections.source.length = 0;
            group.connections.target.length = 0;
            //group.connections.internal.length = 0;
            var oneSet = function(c) {
                for (var i = 0; i < c.length; i++) {
                    if (processed[c[i].id]) continue;
                    processed[c[i].id] = true;
                    if (c[i].source._jsPlumbGroup === group) {
                        if (c[i].target._jsPlumbGroup === group) {
                            //group.connections.internal.push(c[i]);
                        }
                        else {
                            group.connections.source.push(c[i]);
                        }
                        _connectionMap[c[i].id] = p.source[GROUP];
                    }
                    else if (c[i].target._jsPlumbGroup === group) {
                        group.connections.target.push(c[i]);
                        _connectionMap[c[i].id] = p.target[GROUP];
                    }
                }
            };
            oneSet(c1); oneSet(c2);
        }
    };

    var Group = function(_jsPlumb, params) {
        var self = this;
        this.el = params.el;
        this.elId = _jsPlumb.getId(params.el);
        this.id = params.id || jsPlumbUtil.uuid();
        var da = _jsPlumb.getSelector(this.el, GROUP_CONTAINER_CLASS);
        this.dragArea = da && da.length > 0 ? da[0] : this.el;
        var constrain = params.constrain === true;
        var revert = params.revert !== false;
        var orphan = params.orphan === true;
        var prune = params.prune === true;
        var elements = [];
        this.connections = { source:[], target:[], internal:[] };
        this.proxies = {}; // map of connection id->proxy connections.
        this.anchor = params.anchor || "Continuous";
        this.endpoint = params.endpoint || [ "Dot", { radius:2 }];
        this.collapsed = false;
        if (params.draggable !== false) {
            _jsPlumb.draggable(params.el, {
                start:function() {
                    console.log("group start drag");
                },
                stop:function() {
                    console.log("group stop drag");
                },
                drag:function() {
                    console.log("group drag");
                }
            });
        }
        var _each = function(el, fn) {
            var els = el.nodeType == null ?  el : [ el ];
            for (var i = 0; i < els.length; i++) {
                fn(els[i]);
            }
        };

        this.add = function(el) {
            _each(el, function(_el) {
                _el._jsPlumbGroup = self;
                elements.push(_el);
                // test if draggable and add handlers if so.
                if (_jsPlumb.isAlreadyDraggable(_el)) {
                    _bindDragHandlers(_el);
                }
            });
        };
        this.remove = function(el) {
            _each(el, function(_el) {
                delete _el._jsPlumbGroup;
                jsPlumbUtil.removeWithFunction(elements, function(e) {
                    return e === _el;
                });
                _unbindDragHandlers(_el);
            });
        };
        this.removeAll = function() {
            for (var i = 0; i < elements.length; i++) {
                _jsPlumb.remove(elements[i]);
            }
            elements.length = 0;
        };
        this.orphanAll = function() {
            for (var i = 0; i < elements.length; i++) {
                _orphan(elements[i]);
            }
            elements.length = 0;
        };
        this.getMembers = function() { return elements; };

        this.el[GROUP] = this;

        _jsPlumb.bind(ELEMENT_DRAGGABLE_EVENT, function(dragParams) {
            // if its for the current group,
            if (dragParams.el._jsPlumbGroup == this) {
                console.log("an element was made draggable", dragParams.el, dragParams.options);
                _bindDragHandlers(dragParams.el);
            }
        }.bind(this));

        // TODO: use instead the concept of an optiona .jtk-group-content parent? or should that element be the offset
        // parent anyway.
        function _findParent(el) {
            return el.offsetParent;
        }

        function _isInsideParent(el, pos) {
            var p = _findParent(el),
                s = _jsPlumb.getSize(p),
                ss = _jsPlumb.getSize(el),
                leftEdge = pos[0],
                rightEdge = leftEdge + ss[0],
                topEdge = pos[1],
                bottomEdge = topEdge + ss[1];

            return rightEdge > 0 && leftEdge < s[0] && bottomEdge > 0 && topEdge < s[1];
        }

        //
        // orphaning an element means taking it out of the group and adding it to the main jsplumb container.
        //
        function _orphan(el) {
            var pos = _jsPlumb.getOffset(el);
            el.parentNode.removeChild(el);
            _jsPlumb.getContainer().appendChild(el);
            _jsPlumb.setPosition(el, pos);
            delete el._jsPlumbGroup;
            _unbindDragHandlers(el);
        }

        //
        // remove an element from the group, then either prune it from the jsplumb instance, or just orphan it.
        //
        function _pruneOrOrphan(p) {
            if (!_isInsideParent(p.el, p.pos)) {
                setTimeout(function() {
                    p.el._jsPlumbGroup.remove(p.el);
                    if (prune) {
                        _jsPlumb.remove(p.el);
                    } else {
                        _orphan(p.el);
                    }
                }, 0);
            }
        }

        //
        // redraws the element
        //
        function _revalidate(el) {
            _jsPlumb.revalidate(el);
        }

        //
        // unbind the group specific drag/revert handlers.
        //
        function _unbindDragHandlers(el) {
            if (prune || orphan) {
                el._katavorioDrag.off(STOP, _pruneOrOrphan);
            }
            if (!prune && !orphan && revert) {
                el._katavorioDrag.off(REVERT, _revalidate);
                el._katavorioDrag.setRevert(null);
            }
        }

        function _bindDragHandlers(el) {
            if (prune || orphan) {
                el._katavorioDrag.on(STOP, _pruneOrOrphan);
            }

            if (constrain) {
                el._katavorioDrag.setConstrain(true);
            }

            if (!prune && !orphan && revert) {
                el._katavorioDrag.on(REVERT, _revalidate);
                el._katavorioDrag.setRevert(function(el, pos) {
                    return !_isInsideParent(el, pos);
                });
            }
        }

        _jsPlumb.getGroupManager().addGroup(this);
    };

    /**
     * Adds a group to the jsPlumb instance.
     * @method addGroup
     * @param {Object} params
     */
    jsPlumbInstance.prototype.addGroup = function(params) {
        var j = this;
        j._groups = j._groups || {};
        var group = new Group(j, params);
        j._groups[group.id] = group;
    };

    /**
     * Add an element to a group.
     * @method addToGroup
     * @param {String} group Group, or ID of the group, to add the element to.
     * @param {Element} el Element to add to the group.
     */
    jsPlumbInstance.prototype.addToGroup = function(group, el) {
        this.getGroupManager().addToGroup(group, el);
    };

    /**
     * Remove an element from a group.
     * @method removeFromGroup
     * @param {String} group Group, or ID of the group, to remove the element from.
     * @param {Element} el Element to add to the group.
     */
    jsPlumbInstance.prototype.removeFromGroup = function(group, el) {
        this.getGroupManager().removeFromGroup(group, el);
    };

    /**
     * Remove a group, and optionally remove its members from the jsPlumb instance.
     * @method removeGroup
     * @param {String|Group} group Group to delete, or ID of Grrup to delete.
     * @param {Boolean} [deleteMembers=false] If true, group members will be removed along with the group. Otherwise they will
     * just be 'orphaned' (returned to the main container).
     */
    jsPlumbInstance.prototype.removeGroup = function(group, deleteMembers) {
        this.getGroupManager().removeGroup(group, deleteMembers);
    };

    /**
     * Expands a group element. jsPlumb doesn't do "everything" for you here, because what it means to expand a Group
     * will vary from application to application. jsPlumb does these things:
     *
     * - Hides any connections that are internal to the group (connections between members, and connections from member of
     * the group to the group itself)
     * - Proxies all connections for which the source or target is a member of the group.
     * - Hides the proxied connections.
     * - Adds the jsplumb-group-expanded class to the group's element
     * - Removes the jsplumb-group-collapsed class from the group's element.
     *
     * @method expandGroup
     * @param {String|Group} group Group to expand, or ID of Group to expand.
     */
    jsPlumbInstance.prototype.expandGroup = function(group) {
        this.getGroupManager().expandGroup(group);
    };

    /**
     * Collapses a group element. jsPlumb doesn't do "everything" for you here, because what it means to collapse a Group
     * will vary from application to application. jsPlumb does these things:
     *
     * - Shows any connections that are internal to the group (connections between members, and connections from member of
     * the group to the group itself)
     * - Removes proxies for all connections for which the source or target is a member of the group.
     * - Shows the previously proxied connections.
     * - Adds the jsplumb-group-collapsed class to the group's element
     * - Removes the jsplumb-group-expanded class from the group's element.
     *
     * @method expandGroup
     * @param {String|Group} group Group to expand, or ID of Group to expand.
     */
    jsPlumbInstance.prototype.collapseGroup = function(groupId) {
        this.getGroupManager().collapseGroup(groupId);
    };

    //
    // lazy init a group manager for the given jsplumb instance.
    //
    jsPlumbInstance.prototype.getGroupManager = function() {
        var mgr = this[GROUP_MANAGER];
        if (mgr == null) {
            mgr = this[GROUP_MANAGER] = new GroupManager(this);
        }
        return mgr;
    }

})();
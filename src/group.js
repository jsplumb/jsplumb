;(function() {
    "use strict";

    var GROUP_COLLAPSED_CLASS = "jsplumb-group-collapsed";
    var GROUP_EXPANDED_CLASS = "jsplumb-group-expanded";
    var GROUP_CONTAINER_SELECTOR = "[jsplumb-group-content]";
    var ELEMENT_DRAGGABLE_EVENT = "elementDraggable";
    var STOP = "stop";
    var REVERT = "revert";
    var GROUP_MANAGER = "_groupManager";
    var GROUP = "_jsPlumbGroup";
    var PROXY_FOR = "proxyFor";
    var GROUP_DRAG_SCOPE = "_jsPlumbGroupDrag";
    var EVT_CHILD_ADDED = "group:addMember";
    var EVT_CHILD_REMOVED = "group:removeMember";
    var EVT_GROUP_ADDED = "group:add";
    var EVT_GROUP_REMOVED = "group:remove";
    var EVT_EXPAND = "group:expand";
    var EVT_COLLAPSE = "group:collapse";

    var GroupManager = function(_jsPlumb) {
        var _managedGroups = {}, _connectionSourceMap = {}, _connectionTargetMap = {}, self = this;

        _jsPlumb.bind("connection", function(p) {
            if (p.source[GROUP] != null && p.target[GROUP] != null && p.source[GROUP] === p.target[GROUP]) {
                _connectionSourceMap[p.connection.id] = p.source[GROUP];
                _connectionTargetMap[p.connection.id] = p.source[GROUP];
            }
            else {
                if (p.source[GROUP] != null) {
                    jsPlumbUtil.suggest(p.source[GROUP].connections.source, p.connection);
                    _connectionSourceMap[p.connection.id] = p.source[GROUP];
                }
                if (p.target[GROUP] != null) {
                    jsPlumbUtil.suggest(p.target[GROUP].connections.target, p.connection);
                    _connectionTargetMap[p.connection.id] = p.target[GROUP];
                }
            }
        });

        function _cleanupDetachedConnection(conn) {
            delete conn.proxies;
            var group = _connectionSourceMap[conn.id], f;
            if (group != null) {
                f = function(c) { return c.id === conn.id; };
                jsPlumbUtil.removeWithFunction(group.connections.source, f);
                jsPlumbUtil.removeWithFunction(group.connections.target, f);
                delete _connectionSourceMap[conn.id];
            }

            group = _connectionTargetMap[conn.id];
            if (group != null) {
                f = function(c) { return c.id === conn.id; };
                jsPlumbUtil.removeWithFunction(group.connections.source, f);
                jsPlumbUtil.removeWithFunction(group.connections.target, f);
                delete _connectionTargetMap[conn.id];
            }
        }

        _jsPlumb.bind("connectionDetached", function(p) {
            _cleanupDetachedConnection(p.connection);
        });

        _jsPlumb.bind("connectionMoved", function(p) {
            var connMap = p.index === 0 ? _connectionSourceMap : _connectionTargetMap;
            var group = connMap[p.connection.id];
            if (group) {
                var list = group.connections[p.index === 0 ? "source" : "target"];
                var idx = list.indexOf(p.connection);
                if (idx != -1) {
                    list.splice(idx, 1);
                }
            }
        });

        this.addGroup = function(group) {
            _jsPlumb.addClass(group.el, GROUP_EXPANDED_CLASS);
            _managedGroups[group.id] = group;
            group.manager = this;
            _updateConnectionsForGroup(group);
            _jsPlumb.fire(EVT_GROUP_ADDED, { group:group });
        };

        this.addToGroup = function(group, el, doNotFireEvent) {
            group = this.getGroup(group);
            if (group) {
                group.add(el, doNotFireEvent);
            }
        };

        this.removeFromGroup = function(group, el, doNotFireEvent) {
            group = this.getGroup(group);
            if (group) {
                group.remove(el, null, doNotFireEvent);
            }
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
            this.expandGroup(group, true); // this reinstates any original connections and removes all proxies, but does not fire an event.
            group[deleteMembers ? "removeAll" : "orphanAll"]();
            _jsPlumb.remove(group.el);
            delete _managedGroups[group.id];
            _jsPlumb.fire(EVT_GROUP_REMOVED, { group:group });
        };

        this.removeAllGroups = function(deleteMembers) {
            for (var g in _managedGroups) {
                this.removeGroup(_managedGroups[g], deleteMembers);
            }
        };

        function _setVisible(group, state) {
            var m = group.getMembers();
            for (var i = 0; i < m.length; i++) {
                _jsPlumb[state ? "show" : "hide"](m[i], true);
            }
        }

        var _collapseConnection = this.collapseConnection = function(c, index, group) {

            var proxyEp, groupElId = _jsPlumb.getId(group.el),
                originalElementId = c.endpoints[index].elementId;

            c.proxies = c.proxies || [];
            if(c.proxies[index]) {
                proxyEp = c.proxies[index].ep;
            }else {
                proxyEp = _jsPlumb.addEndpoint(group.el, {
                    endpoint:group.getEndpoint(c, index),
                    anchor:group.getAnchor(c, index),
                    parameters:{
                        isProxyEndpoint:true
                    }
                });
                proxyEp._forceDeleteOnDetach = true;
            }
            // for this index, stash proxy info: the new EP, the original EP.
            c.proxies[index] = { ep:proxyEp, originalEp: c.endpoints[index] };

            // and advise the anchor manager
            if (index === 0) {
                // TODO why are there two differently named methods? Why is there not one method that says "some end of this
                // connection changed (you give the index), and here's the new element and element id."
                _jsPlumb.anchorManager.sourceChanged(originalElementId, groupElId, c, group.el);
            }
            else {
                _jsPlumb.anchorManager.updateOtherEndpoint(c.endpoints[0].elementId, originalElementId, groupElId, c);
                c.target = group.el;
                c.targetId = groupElId;
            }


            // detach the original EP from the connection.
            c.proxies[index].originalEp.detachFromConnection(c, null, true);

            // set the proxy as the new ep
            proxyEp.connections = [ c ];
            c.endpoints[index] = proxyEp;

            c.setVisible(true);
        };

        this.collapseGroup = function(group) {
            group = this.getGroup(group);
            if (group == null || group.collapsed) return;

            // todo remove old proxy endpoints first, just in case?
            //group.proxies.length = 0;

            // hide all connections
            _setVisible(group, false);

            if (group.shouldProxy()) {
                // collapses all connections in a group.
                var _collapseSet = function (conns, index) {
                    for (var i = 0; i < conns.length; i++) {
                        var c = conns[i];
                        _collapseConnection(c, index, group);
                    }
                };

                // setup proxies for sources and targets
                _collapseSet(group.connections.source, 0);
                _collapseSet(group.connections.target, 1);
            }

            group.collapsed = true;
            _jsPlumb.removeClass(group.el, GROUP_EXPANDED_CLASS);
            _jsPlumb.addClass(group.el, GROUP_COLLAPSED_CLASS);
            _jsPlumb.revalidate(group.el);
            _jsPlumb.fire(EVT_COLLAPSE, { group:group  });
        };

        var _expandConnection = this.expandConnection = function(c, index, group) {

            // if no proxies or none for this end of the connection, abort.
            if (c.proxies == null || c.proxies[index] == null) return;

            var groupElId = _jsPlumb.getId(group.el),
                originalElement = c.proxies[index].originalEp.element,
                originalElementId = c.proxies[index].originalEp.elementId;

            c.endpoints[index] = c.proxies[index].originalEp;
            // and advise the anchor manager
            if (index === 0) {
                // TODO why are there two differently named methods? Why is there not one method that says "some end of this
                // connection changed (you give the index), and here's the new element and element id."
                _jsPlumb.anchorManager.sourceChanged(groupElId, originalElementId, c, originalElement);
            }
            else {
                _jsPlumb.anchorManager.updateOtherEndpoint(c.endpoints[0].elementId, groupElId, originalElementId, c);
                c.target = originalElement;
                c.targetId = originalElementId;
            }

            // detach the proxy EP from the connection.
            c.proxies[index].ep.detachFromConnection(c, null, true);


            c.proxies[index].originalEp.addConnection(c);

            // cleanup
            delete c.proxies[index];
        };

        this.expandGroup = function(group, doNotFireEvent) {

            group = this.getGroup(group);

            if (group == null || !group.collapsed) return;

            _setVisible(group, true);

            if (group.shouldProxy()) {
                // collapses all connections in a group.
                var _expandSet = function (conns, index) {
                    for (var i = 0; i < conns.length; i++) {
                        var c = conns[i];
                        _expandConnection(c, index, group);
                    }
                };

                // setup proxies for sources and targets
                _expandSet(group.connections.source, 0);
                _expandSet(group.connections.target, 1);
            }

            group.collapsed = false;
            _jsPlumb.addClass(group.el, GROUP_EXPANDED_CLASS);
            _jsPlumb.removeClass(group.el, GROUP_COLLAPSED_CLASS);
            _jsPlumb.revalidate(group.el);
            this.repaintGroup(group);
            if (!doNotFireEvent) {
                _jsPlumb.fire(EVT_EXPAND, { group: group});
            }
        };

        this.repaintGroup = function(group) {
            group = this.getGroup(group);
            var m = group.getMembers();
            for (var i = 0; i < m.length; i++) {
                _jsPlumb.revalidate(m[i]);
            }
        };

        // TODO refactor this with the code that responds to `connection` events.
        function _updateConnectionsForGroup(group) {
            var members = group.getMembers();
            var c1 = _jsPlumb.getConnections({source:members}, true);
            var c2 = _jsPlumb.getConnections({target:members}, true);
            var processed = {};
            group.connections.source.length = 0;
            group.connections.target.length = 0;
            var oneSet = function(c) {
                for (var i = 0; i < c.length; i++) {
                    if (processed[c[i].id]) continue;
                    processed[c[i].id] = true;
                    if (c[i].source._jsPlumbGroup === group) {
                        if (c[i].target._jsPlumbGroup !== group) {
                            group.connections.source.push(c[i]);
                        }
                        _connectionSourceMap[c[i].id] = group;
                    }
                    else if (c[i].target._jsPlumbGroup === group) {
                        group.connections.target.push(c[i]);
                        _connectionTargetMap[c[i].id] = group;
                    }
                }
            };
            oneSet(c1); oneSet(c2);
        }

        this.updateConnectionsForGroup = _updateConnectionsForGroup;
        this.refreshAllGroups = function() {
            for (var g in _managedGroups) {
                _updateConnectionsForGroup(_managedGroups[g]);
                _jsPlumb.dragManager.updateOffsets(_jsPlumb.getId(_managedGroups[g].el));
            }
        };
    };

    /**
     *
     * @param {jsPlumbInstance} _jsPlumb Associated jsPlumb instance.
     * @param {Object} params
     * @param {Element} params.el The DOM element representing the Group.
     * @param {String} [params.id] Optional ID for the Group. A UUID will be assigned as the Group's ID if you do not provide one.
     * @param {Boolean} [params.constrain=false] If true, child elements will not be able to be dragged outside of the Group container.
     * @param {Boolean} [params.revert=true] By default, child elements revert to the container if dragged outside. You can change this by setting `revert:false`. This behaviour is also overridden if you set `orphan` or `prune`.
     * @param {Boolean} [params.orphan=false] If true, child elements dropped outside of the Group container will be removed from the Group (but not from the DOM).
     * @param {Boolean} [params.prune=false] If true, child elements dropped outside of the Group container will be removed from the Group and also from the DOM.
     * @param {Boolean} [params.dropOverride=false] If true, a child element that has been dropped onto some other Group will not be subject to the controls imposed by `prune`, `revert` or `orphan`.
     * @constructor
     */
    var Group = function(_jsPlumb, params) {
        var self = this;
        this.el = params.el;
        this.elId = _jsPlumb.getId(params.el);
        this.id = params.id || jsPlumbUtil.uuid();
        this.el._isJsPlumbGroup = true;
        var da = _jsPlumb.getSelector(this.el, GROUP_CONTAINER_SELECTOR);
        this.dragArea = da && da.length > 0 ? da[0] : this.el;
        var ghost = params.ghost === true;
        var constrain = ghost || (params.constrain === true);
        var revert = params.revert !== false;
        var orphan = params.orphan === true;
        var prune = params.prune === true;
        var dropOverride = params.dropOverride === true;
        var proxied = params.proxied !== false;
        var elements = [];
        this.connections = { source:[], target:[], internal:[] };

        // this function, and getEndpoint below, are stubs for a future setup in which we can choose endpoint
        // and anchor based upon the connection and the index (source/target) of the endpoint to be proxied.
        this.getAnchor = function(conn, endpointIndex) {
            return params.anchor || "Continuous";
        };

        this.getEndpoint = function(conn, endpointIndex) {
            return params.endpoint || [ "Dot", { radius:10 }];
        };

        this.collapsed = false;
        if (params.draggable !== false) {
            var opts = {
                stop:function(params) {
                    _jsPlumb.fire("groupDragStop", jsPlumb.extend(params, {group:self}));
                },
                scope:GROUP_DRAG_SCOPE
            };
            if (params.dragOptions) {
                jsPlumb.extend(opts, params.dragOptions);
            }
            _jsPlumb.draggable(params.el, opts);
        }
        if (params.droppable !== false) {
            _jsPlumb.droppable(params.el, {
                drop:function(p) {
                    var groupManager = _jsPlumb.getGroupManager();
                    var el = p.drag.el;
                    if (el._isJsPlumbGroup) return;
                    var currentGroup = el._jsPlumbGroup;
                    // if already a member of this group, do nothing
                    if (currentGroup !== self) {
                        var elpos = _jsPlumb.getOffset(el, true);
                        var cpos = self.collapsed ? _jsPlumb.getOffset(self.el, true) : _jsPlumb.getOffset(self.dragArea, true);

                        // otherwise, transfer to this group.
                        if (currentGroup != null) {
                            if (currentGroup.overrideDrop(el, self)) {
                                return;
                            }
                            currentGroup.remove(el, true);
                            groupManager.updateConnectionsForGroup(currentGroup);
                        }
                        self.add(el, true);

                        var handleDroppedConnections = function(list, index) {
                            var oidx = index == 0 ? 1 : 0;
                            list.each(function(c) {
                                c.setVisible(false);
                                if (c.endpoints[oidx].element._jsPlumbGroup === self) {
                                    c.endpoints[oidx].setVisible(false);
                                    groupManager.expandConnection(c, oidx, self);
                                }
                                else {
                                    c.endpoints[index].setVisible(false);
                                    groupManager.collapseConnection(c, index, self);
                                }
                            });
                        };

                        if (self.collapsed) {
                            handleDroppedConnections(_jsPlumb.select({source: el}), 0);
                            handleDroppedConnections(_jsPlumb.select({target: el}), 1);
                        }

                        var elId = _jsPlumb.getId(el);
                        _jsPlumb.dragManager.setParent(el, elId, self.el, _jsPlumb.getId(self.el), elpos);
                        _jsPlumb.setPosition(el, {left:elpos.left - cpos.left, top:elpos.top - cpos.top});
                        _jsPlumb.dragManager.revalidateParent(el, elId, elpos);

                        groupManager.updateConnectionsForGroup(self);

                        setTimeout(function() {
                            _jsPlumb.fire(EVT_CHILD_ADDED, {group: self, el: el});
                        }, 0);
                    }
                }
            });
        }
        var _each = function(el, fn) {
            var els = el.nodeType == null ?  el : [ el ];
            for (var i = 0; i < els.length; i++) {
                fn(els[i]);
            }
        };

        this.overrideDrop = function(el, targetGroup) {
            return dropOverride && (revert || prune || orphan);
        };

        this.add = function(el, doNotFireEvent) {
            _each(el, function(_el) {
                _el._jsPlumbGroup = self;
                elements.push(_el);
                // test if draggable and add handlers if so.
                if (_jsPlumb.isAlreadyDraggable(_el)) {
                    _bindDragHandlers(_el);
                }

                if (_el.parentNode != self.dragArea) {
                    self.dragArea.appendChild(_el);
                }

                if (!doNotFireEvent) {
                    _jsPlumb.fire(EVT_CHILD_ADDED, {group: self, el: el});
                }
            });
        };
        this.remove = function(el, manipulateDOM, doNotFireEvent) {
            _each(el, function(_el) {
                delete _el._jsPlumbGroup;
                jsPlumbUtil.removeWithFunction(elements, function(e) {
                    return e === _el;
                });
                if (manipulateDOM) {
                    try { self.el.removeChild(_el); }
                    catch (e) {
                        console.log(e);
                    }
                }
                _unbindDragHandlers(_el);
                if (!doNotFireEvent) {
                    _jsPlumb.fire(EVT_CHILD_REMOVED, {group: self, el: el});
                }
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
            var id = _jsPlumb.getId(el);
            var pos = _jsPlumb.getOffset(el);
            el.parentNode.removeChild(el);
            _jsPlumb.getContainer().appendChild(el);
            _jsPlumb.setPosition(el, pos);
            delete el._jsPlumbGroup;
            _unbindDragHandlers(el);
            _jsPlumb.dragManager.clearParent(el, id);
        }

        //
        // remove an element from the group, then either prune it from the jsplumb instance, or just orphan it.
        //
        function _pruneOrOrphan(p) {
            if (!_isInsideParent(p.el, p.pos)) {
                p.el._jsPlumbGroup.remove(p.el);
                if (prune) {
                    _jsPlumb.remove(p.el);
                } else {
                    _orphan(p.el);
                }
            }
        }

        //
        // redraws the element
        //
        function _revalidate(el) {
            var id = _jsPlumb.getId(el);
            _jsPlumb.revalidate(el);
            _jsPlumb.dragManager.revalidateParent(el, id);
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

            if (ghost) {
                el._katavorioDrag.setUseGhostProxy(true);
            }

            if (!prune && !orphan && revert) {
                el._katavorioDrag.on(REVERT, _revalidate);
                el._katavorioDrag.setRevert(function(el, pos) {
                    return !_isInsideParent(el, pos);
                });
            }
        }

        this.shouldProxy = function() {
            return proxied;
        };

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
    jsPlumbInstance.prototype.addToGroup = function(group, el, doNotFireEvent) {
        this.getGroupManager().addToGroup(group, el, doNotFireEvent);
    };

    /**
     * Remove an element from a group.
     * @method removeFromGroup
     * @param {String} group Group, or ID of the group, to remove the element from.
     * @param {Element} el Element to add to the group.
     */
    jsPlumbInstance.prototype.removeFromGroup = function(group, el, doNotFireEvent) {
        this.getGroupManager().removeFromGroup(group, el, doNotFireEvent);
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
     * Remove all groups, and optionally remove their members from the jsPlumb instance.
     * @method removeAllGroup
     * @param {Boolean} [deleteMembers=false] If true, group members will be removed along with the groups. Otherwise they will
     * just be 'orphaned' (returned to the main container).
     */
    jsPlumbInstance.prototype.removeAllGroups = function(deleteMembers) {
        this.getGroupManager().removeAllGroups(deleteMembers);
    };

    /**
     * Get a group
     * @method getGroup
     * @param {String} groupId ID of the group to get
     */
    jsPlumbInstance.prototype.getGroup = function(groupId) {
        return this.getGroupManager().getGroup(groupId);
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


    jsPlumbInstance.prototype.repaintGroup = function(group) {
        this.getGroupManager().repaintGroup(group);
    };

    /**
     * Collapses or expands a group element depending on its current state. See notes in the collapseGroup and expandGroup method.
     *
     * @method toggleGroup
     * @param {String|Group} group Group to expand/collapse, or ID of Group to expand/collapse.
     */
    jsPlumbInstance.prototype.toggleGroup = function(group) {
        group = this.getGroupManager().getGroup(group);
        if (group != null) {
            this.getGroupManager()[group.collapsed ? "expandGroup" : "collapseGroup"](group);
        }
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
    };

    jsPlumbInstance.prototype.removeGroupManager = function() {
        delete this[GROUP_MANAGER];
    };

})();
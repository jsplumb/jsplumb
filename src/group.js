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
            if (p.connection.getParameter(PROXY_FOR) == null) {
                if (p.source[GROUP] != null && p.target[GROUP] != null && p.source[GROUP] === p.target[GROUP]) {
                    _connectionSourceMap[p.connection.id] = p.source[GROUP];
                    _connectionTargetMap[p.connection.id] = p.source[GROUP];
                }
                else {
                    if (p.source[GROUP] != null) {
                        p.source[GROUP].connections.source.push(p.connection);
                        _connectionSourceMap[p.connection.id] = p.source[GROUP];
                    }
                    if (p.target[GROUP] != null) {
                        p.target[GROUP].connections.target.push(p.connection);
                        _connectionTargetMap[p.connection.id] = p.target[GROUP];
                    }
                }
            }
        });

        _jsPlumb.bind("connectionDetached", function(p) {
            if (p.connection.isProxyFor != null) {
                var proxy = p.connection, original = proxy.isProxyFor;
                var eps = p.connection.endpoints;
                if (eps[0].getParameter("isProxyEndpoint")) eps[0]._forceDeleteOnDetach = true;
                if (eps[1].getParameter("isProxyEndpoint")) eps[1]._forceDeleteOnDetach = true;
                original.endpoints[0].detachFromConnection(proxy, null, true);
                original.endpoints[1].detachFromConnection(proxy, null, true);
                original.endpoints[0].addConnection(original);
                original.endpoints[1].addConnection(original);

                _jsPlumb.detach(original);
                self.removeProxyFromGroup(p.source[GROUP], p.connection);
                self.removeProxyFromGroup(p.target[GROUP], p.connection);

            }
            else {
                // TODO refactor to share code
                var group = _connectionSourceMap[p.connection.id], f;
                if (group != null) {
                    f = function(c) { return c.id === p.connection.id; };
                    jsPlumbUtil.removeWithFunction(group.connections.source, f);
                    jsPlumbUtil.removeWithFunction(group.connections.target, f);
                    delete _connectionSourceMap[p.connection.id];
                }

                group = _connectionTargetMap[p.connection.id];
                if (group != null) {
                    f = function(c) { return c.id === p.connection.id; };
                    jsPlumbUtil.removeWithFunction(group.connections.source, f);
                    jsPlumbUtil.removeWithFunction(group.connections.target, f);
                    delete _connectionTargetMap[p.connection.id];
                }
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
            _jsPlumb.fire(EVT_GROUP_ADDED, { group:group });
        };

        this.addToGroup = function(group, el) {
            group = this.getGroup(group);
            if (group) {
                group.add(el);
            }
        };

        this.removeFromGroup = function(group, el) {
            group = this.getGroup(group);
            if (group) {
                group.remove(el);
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
            var oidx = index === 0 ? 1 : 0;
            c.setVisible(false);

            var newEp = _jsPlumb.addEndpoint(group.el, {
                endpoint:group.getEndpoint(c, index),
                anchor:group.getAnchor(c, index),
                parameters:{
                    isProxyEndpoint:true
                }
            });

            if (c.isProxiedBy != null) {
                newEp.addConnection(c.isProxiedBy);
                c.isProxiedBy.endpoints[index] = newEp;
                var groupElId = _jsPlumb.getId(group.el);

                if (index === 0) {
                    // TODO why are there
                    // two differently named methods? Why is there not one method that says "some end of this
                    // connection changed (you give the index), and here's the new element and element id."
                    _jsPlumb.anchorManager.sourceChanged(c.isProxiedBy.sourceId, groupElId, c.isProxiedBy, group.el);
                }
                else {

                    _jsPlumb.anchorManager.updateOtherEndpoint(c.isProxiedBy.sourceId, c.isProxiedBy.targetId, _jsPlumb.getId(group.el), c.isProxiedBy);
                    c.isProxiedBy.target = group.el;
                    c.isProxiedBy.targetId = groupElId;
                }

                c.endpoints[oidx].detachFromConnection(proxy, null, true);
                c.endpoints[oidx].addConnection(c);

                c.isProxiedBy.setVisible(true);
                group.proxies.push({connection: c.isProxiedBy, original:c, index:index});
            }
            else {
                // detach current opposite endpoint, in case it has a maxConnections value, because we're going
                // to connect a new connection to it.
                c.endpoints[oidx].detachFromConnection(c, null, true);
                c.endpoints[index].detachFromConnection(c, null, true);
                // make the proxy connection
                var proxy = _jsPlumb.connect({
                    source: index === 0 ? newEp : c.endpoints[0],
                    target: index === 1 ? newEp : c.endpoints[1],
                    paintStyle:{strokeStyle:"red", lineWidth:3},   // remove, obviously, at some stage
                    parameters: {
                        proxyFor: c,
                        suspendedEndpoint: c.endpoints[oidx],
                        suspendedIndex: oidx
                    }
                });
                // stash it on the group and make each connection point at the other
                group.proxies.push({connection:proxy, original:c, index:index});
                c.isProxiedBy = proxy;
                proxy.isProxyFor = c;
            }
        };

        this.collapseGroup = function(group) {
            group = this.getGroup(group);

            // todo remove old proxy endpoints first, just in case?
            group.proxies.length = 0;

            // hide all connections
            _setVisible(group, false);

            // collapses all connections in a group.
            var _collapseSet = function(conns, index) {
                for (var i = 0; i < conns.length; i++) {
                    var c = conns[i];
                    _collapseConnection(c, index, group);
                }
            };

            // setup proxies for sources and targets
            _collapseSet(group.connections.source, 0);
            _collapseSet(group.connections.target, 1);

            group.collapsed = true;
            _jsPlumb.removeClass(group.el, GROUP_EXPANDED_CLASS);
            _jsPlumb.addClass(group.el, GROUP_COLLAPSED_CLASS);
            _jsPlumb.revalidate(group.el);
            _jsPlumb.fire(EVT_COLLAPSE, { group:group  });
        };

        this.expandGroup = function(group, doNotFireEvent) {
            var epToDelete, deletions = [], index, oidx, proxy, original, p, o, ep;
            group = this.getGroup(group);

            // remove proxies for sources and targets
            for(var i = 0; i < group.proxies.length; i++) {
                index = group.proxies[i].index;
                proxy = group.proxies[i].connection;
                original = proxy.isProxyFor;
                oidx = index === 0 ? 1 : 0;

                // if only this group has a proxied endpoint, just toss the proxy away and show the original.
                if (proxy.endpoints[oidx] === original.endpoints[oidx]) {
                    deletions.push({ep:proxy.endpoints[index], original:original, proxy:proxy, index:index, oidx:oidx});
                }
                else {
                    // need to keep the proxy, attached to one of the original endpoints.
                    var groupElId = _jsPlumb.getId(group.el);
                    proxy.endpoints[index].detachFromConnection(proxy, null, true);
                    original.endpoints[index].detachFromConnection(original, null, true);
                    original.endpoints[index].addConnection(proxy);
                    epToDelete = proxy.endpoints[index];
                    proxy.endpoints[index] = original.endpoints[index];
                    _jsPlumb.deleteEndpoint(epToDelete);

                    if (index === 0) {
                        _jsPlumb.anchorManager.sourceChanged(proxy.sourceId, original.sourceId, proxy, original.source);
                    } else {
                        _jsPlumb.anchorManager.updateOtherEndpoint(proxy.sourceId, groupElId, original.targetId, proxy);
                        proxy.target = original.target;
                        proxy.targetId = original.targetId;
                    }
                }
            }

            for (i = 0; i < deletions.length; i++) {
                p = deletions[i].proxy;
                index = deletions[i].index;
                oidx = deletions[i].oidx;
                o = deletions[i].original;
                ep = deletions[i].ep;

                _jsPlumb.detach({connection:p, fireEvent:false, deleteAttachedObjects:false});
                delete o.isProxiedBy;
                _jsPlumb.deleteEndpoint(ep);
                o.endpoints[oidx].detachFromConnection(p, null, true);
                o.endpoints[index].detachFromConnection(p, null, true);
                o.endpoints[index].addConnection(o);
                o.endpoints[oidx].addConnection(o);
                o.setVisible(true);
            }

            _setVisible(group, true);
            group.collapsed = false;
            group.proxies.length = 0;
            _jsPlumb.addClass(group.el, GROUP_EXPANDED_CLASS);
            _jsPlumb.removeClass(group.el, GROUP_COLLAPSED_CLASS);
            _jsPlumb.revalidate(group.el);
            if (!doNotFireEvent) {
                _jsPlumb.fire(EVT_EXPAND, { group: group});
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

        function _removeProxyFromGroup(group, c) {
            if (group != null) {
                jsPlumbUtil.removeWithFunction(group.proxies, function (p) {
                    return p.connection.id === c.id;
                });
            }
        }

        this.updateConnectionsForGroup = _updateConnectionsForGroup;
        this.removeProxyFromGroup = _removeProxyFromGroup;
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
        var da = _jsPlumb.getSelector(this.el, GROUP_CONTAINER_CLASS);
        this.dragArea = da && da.length > 0 ? da[0] : this.el;
        var constrain = params.constrain === true;
        var revert = params.revert !== false;
        var orphan = params.orphan === true;
        var prune = params.prune === true;
        var dropOverride = params.dropOverride === true;
        var elements = [];
        this.connections = { source:[], target:[], internal:[] };
        this.proxies = []; // map of connection id->proxy connections.

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
            _jsPlumb.draggable(params.el, {
                start:function() {
                    console.log("group start drag");
                },
                stop:function() {
                    console.log("group stop drag");
                },
                drag:function() {
                    console.log("group drag");
                },
                scope:GROUP_DRAG_SCOPE
            });
        }
        if (params.droppable !== false) {
            _jsPlumb.droppable(params.el, {
                drop:function(p) {
                    //console.log("drop on group!", self.el.id);
                    var groupManager = _jsPlumb.getGroupManager();
                    var el = p.drag.el;
                    if (el._isJsPlumbGroup) return;
                    var currentGroup = el._jsPlumbGroup;
                    // if already a member of this group, do nothing
                    if (currentGroup !== self) {
                        var elpos = _jsPlumb.getOffset(el, true);
                        var cpos = _jsPlumb.getOffset(self.el, true);

                        // otherwise, transfer to this group.
                        if (currentGroup != null) {
                            if (currentGroup.overrideDrop(el, self)) {
                                return;
                            }
                            currentGroup.remove(el, true);
                            groupManager.updateConnectionsForGroup(currentGroup);
                        }
                        self.add(el, true);

                        // if this group is collapsed we need to look at all connections to and from the
                        // dropped element. They may be in one of several states:

                        // 1. a connection to some other element in a group that is not collapsed, or to a standalone element.
                        // 2. a connection to some other element in a group that is collapsed
                        // 3. a connection to this group (which is collapsed)

                        // the logic for handling each case is different:

                        // 1. just 'collapse' the connection as we would have any other. this means we make a proxy, set it on this
                        // element, hide the original, etc. We use the _collapseConnection method for that.

                        // 2. i think in fact we can again use the _collapseConnection function like normal here. it
                        // will check if the connection is already proxied on the other end and deal with it.

                        // 3. this is trickier. the connection to this group will be proxied on this group's end, but not the
                        // other end of course: the fact that we could drag the node means its group is not collapsed.
                        // in this case we want to remove the proxy connection entirely, and leave the proxied one invisible.


                        var handleDroppedConnections = function(list, index) {
                            var oidx = index === 0 ? 1 : 0, c, other;
                            for (var i = 0; i < list.length; i++) {
                                c = list.get(i);
                                if (c.isVisible()) {
                                    other = c.endpoints[oidx];
                                    if (other.element === self.el) {
                                        var original = c.isProxyFor;
                                        _jsPlumb.detach(c);
                                        // disconnect original connection's endpoint for this element from the proxy.
                                        original.endpoints[index].detachFromConnection(c, null, true);
                                        original.endpoints[index].addConnection(original);
                                        original.endpoints[oidx].addConnection(original);
                                        delete original.isProxiedBy;
                                        _jsPlumb.deleteEndpoint(other);
                                        original.endpoints[index].setVisible(false);

                                        groupManager.removeProxyFromGroup(self, c);
                                    }
                                    else {
                                        groupManager.collapseConnection(c, index, self);
                                        c.endpoints[index].setVisible(false);
                                    }
                                }
                            }
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
                    }
                },
                over:function(p) {
                    console.log("drag hover!");
                }
            })
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

        this.add = function(el, manipulateDOM) {
            _each(el, function(_el) {
                _el._jsPlumbGroup = self;
                elements.push(_el);
                // test if draggable and add handlers if so.
                if (_jsPlumb.isAlreadyDraggable(_el)) {
                    _bindDragHandlers(_el);
                }
                if (manipulateDOM) {
                    self.el.appendChild(_el);
                }
                _jsPlumb.fire(EVT_CHILD_ADDED, {group: self, el: el});
            });
        };
        this.remove = function(el, manipulateDOM) {
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
                _jsPlumb.fire(EVT_CHILD_REMOVED, {group: self, el: el});
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

        // TODO: use instead the concept of an optional .jtk-group-content parent? or should that element be the offset
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
                //setTimeout(function() {
                    p.el._jsPlumbGroup.remove(p.el);
                    if (prune) {
                        _jsPlumb.remove(p.el);
                    } else {
                        _orphan(p.el);
                    }
                //}, 0);
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
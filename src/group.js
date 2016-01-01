;(function() {
    "use strict";

    var GROUP_CONTAINER_CLASS = ".jtk-group-content";
    var ELEMENT_DRAGGABLE_EVENT = "elementDraggable";
    var STOP = "stop";
    var REVERT = "revert";
    var GROUP_MANAGER = "_groupManager";
    var GROUP = "_jsPlumbGroup";

    var GroupManager = function(_jsPlumb) {
        var _managedGroups = {};

        _jsPlumb.bind("connection", function(p) {
            console.log("connection", p);
            if(p.source[GROUP] != null && p.target[GROUP] != null && p.source[GROUP] === p.target[GROUP]) {
                p.source[GROUP].connections.internal = p.connection;
            }
            else if (p.source[GROUP] != null) {
                p.source[GROUP].connections.source.push(p.connection);
            }
            else if (p.target[GROUP] != null) {
                p.target[GROUP].connections.target.push(p.connection);
            }

        });

        _jsPlumb.bind("connectionDetached", function(p) {
            console.log("connectionDetached", p);
        });

        _jsPlumb.bind("connectionMoved", function(p) {
            console.log("connectionMoved", p);
        });

        this.addGroup = function(group) {
            _managedGroups[group.id] = group;
            group.manager = this;
        };
    };

    function _manageGroup(_jsPlumb, group) {
        if (_jsPlumb[GROUP_MANAGER] == null) {

            _jsPlumb[GROUP_MANAGER] = new GroupManager(_jsPlumb);

        }
    }

    var Group = function(_jsPlumb, params) {
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
        this.add = function(el) {
            el._jsPlumbGroup = this;
            elements.push(el);
            // test if draggable and add handlers if so.
            if (_jsPlumb.isAlreadyDraggable(el)) {
                _bindDragHandlers(el);
            }
        };
        this.remove = function(el) {
            delete el._jsPlumbGroup;
            jsPlumbUtil.removeWithFunction(elements, function(e) {
                return e === el;
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

        _manageGroup(_jsPlumb, this);
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
     * Add an element to a group, by group id.
     * @method addToGroup
     * @param {String} groupId ID of the group to add the element to.
     * @param {Element} el Element to add to the group.
     */
    jsPlumbInstance.prototype.addToGroup = function(groupId, el) {
        if (!this._groups || ! this._groups[groupId]) throw new TypeError("No such group [" + groupId + "]");
        else {
            var g = this._groups[groupId];
            g.add(el);
        }
    };

    /**
     * Remove a group, and optionally remove its members from the jsPlumb instance.
     * @method deleteGroup
     * @param {String} groupId ID of the group to delete.
     * @param {Boolean} [deleteMembers=false] If true, group members will be removed along with the group. Otherwise they will
     * just be 'orphaned' (returned to the main container).
     */
    jsPlumbInstance.prototype.deleteGroup = function(groupId, deleteMembers) {
        if (!this._groups || ! this._groups[groupId]) throw new TypeError("No such group [" + groupId + "]");
        else {
            var g = this._groups[groupId];
            g[deleteMembers ? "removeAll" : "orphanAll"]();
            this.remove(g.el);
            delete this._groups[groupId];
        }
    };

    jsPlumbInstance.prototype.expandGroup = function(groupId) {
        if (!this._groups || ! this._groups[groupId]) throw new TypeError("No such group [" + groupId + "]");
        else {
            var g = this._groups[groupId];
            //

            this.revalidate(g.el);
        }
    };

    jsPlumbInstance.prototype.collapseGroup = function(groupId) {
        if (!this._groups || ! this._groups[groupId]) throw new TypeError("No such group [" + groupId + "]");
        else {
            var g = this._groups[groupId];
            var members = g.getMembers();
            var c1 = this.getConnections({source:members}, true);
            var c2 = this.getConnections({target:members}, true);
            var processed = {};
            var sources = [], targets = [], internal = [];
            var oneSet = function(c) {
                for (var i = 0; i < c.length; i++) {
                    if (processed[c[i].id]) continue;
                    processed[c[i].id] = true;
                    if (c[i].source._jsPlumbGroup === g) {
                        if (c[i].target._jsPlumbGroup === g) {
                            internal.push(c[i]);
                            c[i].setVisible(false);
                        }
                        else {
                            sources.push(c[i]);
                        }
                    }
                    else if (c[i].target._jsPlumbGroup === g) {
                        targets.push(c[i]);
                    }
                }
            };
            oneSet(c1); oneSet(c2);
            console.log(c1, c2)
            this.revalidate(g.el);
        }
    };

})();
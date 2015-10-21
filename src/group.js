;(function() {
    "use strict";

    var Group = function(_jsPlumb, params) {
        this.el = params.el;
        this.elId = _jsPlumb.getId(params.el);
        this.id = params.id || jsPlumbUtil.uuid();
        var elements = [];
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
        };

        this.el._jsPlumbGroup = this;
    };

    jsPlumbInstance.prototype.addGroup = function(params) {
        var j = this;
        j._groups = j._groups || {};
        var group = new Group(j, params);
        j._groups[group.id] = group;
    };

    /**
     * Add an element to a group, by group id.
     * @param params
     */
    jsPlumbInstance.prototype.addToGroup = function(groupId, el) {
        if (!this._groups || ! this._groups[groupId]) throw new TypeError("No such group [" + groupId + "]");
        else {
            var g = this._groups[groupId];
            g.add(el);
        }
    };

})();
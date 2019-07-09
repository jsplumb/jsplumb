import {ConnectionSelection, Dictionary, jsPlumbInstance} from "../core";
import {Group} from "./group";
import * as Constants from "../constants";
import {IS, removeWithFunction, suggest} from "../util";
import {Connection} from "..";

export class GroupManager<E> {

    groupMap:Dictionary<Group<E>> = {};
    _connectionSourceMap:Dictionary<Group<E>> = {};
    _connectionTargetMap:Dictionary<Group<E>> = {};

    constructor(public instance:jsPlumbInstance<E>) {

        instance.bind(Constants.EVENT_CONNECTION, (p:any) => {
            if (p.source[Constants.GROUP_KEY] != null && p.target[Constants.GROUP_KEY] != null && p.source[Constants.GROUP_KEY] === p.target[Constants.GROUP_KEY]) {
                this._connectionSourceMap[p.connection.id] = p.source[Constants.GROUP_KEY];
                this._connectionTargetMap[p.connection.id] = p.source[Constants.GROUP_KEY];
            }
            else {
                if (p.source[Constants.GROUP_KEY] != null) {
                    suggest(p.source[Constants.GROUP_KEY].connections.source, p.connection);
                    this._connectionSourceMap[p.connection.id] = p.source[Constants.GROUP_KEY];
                }
                if (p.target[Constants.GROUP_KEY] != null) {
                    suggest(p.target[Constants.GROUP_KEY].connections.target, p.connection);
                    this._connectionTargetMap[p.connection.id] = p.target[Constants.GROUP_KEY];
                }
            }
        });

        instance.bind(Constants.EVENT_INTERNAL_CONNECTION_DETACHED, (p:any) => {
            this._cleanupDetachedConnection(p.connection);
        });

        instance.bind(Constants.EVENT_CONNECTION_MOVED, (p:any) => {
            let connMap = p.index === 0 ? this._connectionSourceMap : this._connectionTargetMap;
            let group = connMap[p.connection.id];
            if (group) {
                let list = group.connections[p.index === 0 ? Constants.SOURCE : Constants.TARGET ];
                let idx = list.indexOf(p.connection);
                if (idx !== -1) {
                    list.splice(idx, 1);
                }
            }
        });
    }

    private _cleanupDetachedConnection(conn:Connection<E>) {
        delete conn.proxies;
        let group = this._connectionSourceMap[conn.id], f;
        if (group != null) {
            f = (c:Connection<E>) => { return c.id === conn.id; };
            removeWithFunction(group.connections.source, f);
            removeWithFunction(group.connections.target, f);
            delete this._connectionSourceMap[conn.id];
        }

        group = this._connectionTargetMap[conn.id];
        if (group != null) {
            f = (c:Connection<E>) => { return c.id === conn.id; };
            removeWithFunction(group.connections.source, f);
            removeWithFunction(group.connections.target, f);
            delete this._connectionTargetMap[conn.id];
        }
    }

    addGroup(params:any) {

        if (this.groupMap[params.id] != null) {
            throw new TypeError("cannot create Group [" + params.id + "]; a Group with that ID exists");
        }
        if (params.el[Constants.GROUP_KEY] != null) {
            throw new TypeError("cannot create Group [" + params.id + "]; the given element is already a Group");
        }
        let group = new Group<E>(this.instance, params.el, params);
        this.groupMap[group.id] = group;
        if (params.collapsed) {
            this.collapseGroup(group);
        }

        this.instance.addClass(group.el, Constants.GROUP_EXPANDED_CLASS);
        group.manager = this;
        this._updateConnectionsForGroup(group);

        this.instance.fire(Constants.EVENT_GROUP_ADDED, { group:group });

        return group;
    }

    getGroup (groupId:string | Group<E>):Group<E> {
        let group = groupId;
        if (IS.aString(groupId)) {
            group = this.groupMap[groupId as string];
            if (group == null) {
                throw new TypeError("No such group [" + groupId + "]");
            }
        }
        return group as Group<E>;
    }

    forEach(f:(g:Group<E>) => any) {
        for (let key in this.groupMap) {
            f(this.groupMap[key]);
        }
    }

    orphan(_el:E) {
        if (_el[Constants.GROUP_KEY]) {
            let id = this.instance.getId(_el);
            let pos = this.instance.getOffset(_el);
            (<any>_el).parentNode.removeChild(_el);
            this.instance.appendElement(_el);
            this.instance.setPosition(_el, pos);
            delete _el[Constants.GROUP_KEY];
            return [id, pos];
        }
    }

    private _setGroupVisible(group:Group<E>, state:boolean) {
        let m = group.children;
        for (let i = 0; i < m.length; i++) {
            this.instance[state ? Constants.CMD_SHOW : Constants.CMD_HIDE](m[i], true);
        }
    }

    _updateConnectionsForGroup(group:Group<E>) {
        let members = group.children;
        const c1 = this.instance.getConnections({source:members, scope:Constants.WILDCARD}, true) as Array<Connection<E>>;
        const c2 = this.instance.getConnections({target:members, scope:Constants.WILDCARD}, true) as Array<Connection<E>>;
        const processed = {};
        group.connections.source.length = 0;
        group.connections.target.length = 0;
        const oneSet = (c:Array<Connection<E>>) => {
            for (let i = 0; i < c.length; i++) {
                if (processed[c[i].id]) {
                    continue;
                }
                processed[c[i].id] = true;
                if (c[i].source[Constants.GROUP_KEY] === group) {
                    if (c[i].target[Constants.GROUP_KEY] !== group) {
                        group.connections.source.push(c[i]);
                    }
                    this._connectionSourceMap[c[i].id] = group;
                }
                else if (c[i].target[Constants.GROUP_KEY] === group) {
                    group.connections.target.push(c[i]);
                    this._connectionTargetMap[c[i].id] = group;
                }
            }
        };
        oneSet(c1); oneSet(c2);
    }

    private _collapseConnection(conn:Connection<E>, index:number, group:Group<E>) {
        let otherEl = conn.endpoints[index === 0 ? 1 : 0].element;
        if (otherEl[Constants.GROUP_KEY] && (!otherEl[Constants.GROUP_KEY].proxied && otherEl[Constants.GROUP_KEY].collapsed)) {
            return;
        }

        let groupEl = group.el, groupElId = this.instance.getId(groupEl);
        this.instance.proxyConnection(conn, index, groupEl, groupElId, (conn:Connection<E>, index:number) => { return group.getEndpoint(conn, index); }, (conn:Connection<E>, index:number) => { return group.getAnchor(conn, index); });
    }

    private _expandConnection(c:Connection<E>, index:number, group:Group<E>) {
        this.instance.unproxyConnection(c, index, this.instance.getId(group.el));
    }

    collapseGroup (group:string | Group<E>) {
        let actualGroup = this.getGroup(group);
        if (actualGroup == null || actualGroup.collapsed) {
            return;
        }

        let groupEl = actualGroup.el;

        // hide all connections
        this._setGroupVisible(actualGroup, false);

        if (actualGroup.proxied) {
            // collapses all connections in a group.
            const _collapseSet =  (conns:Array<Connection<E>>, index:number) => {
                for (let i = 0; i < conns.length; i++) {
                    let c = conns[i];
                    this._collapseConnection(c, index, actualGroup);
                }
            };

            // setup proxies for sources and targets
            _collapseSet(actualGroup.connections.source, 0);
            _collapseSet(actualGroup.connections.target, 1);
        }

        actualGroup.collapsed = true;
        this.instance.removeClass(groupEl, Constants.GROUP_EXPANDED_CLASS);
        this.instance.addClass(groupEl, Constants.GROUP_COLLAPSED_CLASS);
        this.instance.revalidate(groupEl);
        this.instance.fire(Constants.EVENT_COLLAPSE, { group:actualGroup  });
    }

    expandGroup(group:string | Group<E>, doNotFireEvent?:boolean) {

        let actualGroup = this.getGroup(group);

        if (actualGroup == null || !actualGroup.collapsed) {
            return;
        }
        var groupEl = actualGroup.el;

        this._setGroupVisible(actualGroup, true);

        if (actualGroup.proxied) {
            // collapses all connections in a group.
            var _expandSet = (conns:Array<Connection<E>>, index:number) => {
                for (let i = 0; i < conns.length; i++) {
                    let c = conns[i];
                    this._expandConnection(c, index, actualGroup);
                }
            };

            // setup proxies for sources and targets
            _expandSet(actualGroup.connections.source, 0);
            _expandSet(actualGroup.connections.target, 1);
        }

        actualGroup.collapsed = false;
        this.instance.addClass(groupEl, Constants.GROUP_EXPANDED_CLASS);
        this.instance.removeClass(groupEl, Constants.GROUP_COLLAPSED_CLASS);
        this.instance.revalidate(groupEl);
        this.repaintGroup(actualGroup);
        if (!doNotFireEvent) {
            this.instance.fire(Constants.EVENT_EXPAND, { group: group});
        }
    }

    repaintGroup (group:string|Group<E>) {
        let actualGroup = this.getGroup(group);
        const m = actualGroup.children;
        for (let i = 0; i < m.length; i++) {
            this.instance.revalidate(m[i]);
        }
    }

    addToGroup(group:string | Group<E>, el:E | Array<E>, doNotFireEvent?:boolean) {
        let actualGroup = this.getGroup(group);
        if (actualGroup) {
            let groupEl = actualGroup.el;

            const _one = (el:E) => {
                if (el[Constants.GROUP_KEY] != null) {
                    console.log("the thing being added is a group! is it possible to support nested groups")
                }

                let currentGroup = el[Constants.IS_GROUP_KEY];
                // if already a member of this group, do nothing
                if (currentGroup !== actualGroup) {
                    let elpos = this.instance.getOffset(el, true);
                    let cpos = actualGroup.collapsed ? this.instance.getOffset(groupEl, true) : this.instance.getOffset(actualGroup.getDragArea(), true);

                    // otherwise, transfer to this group.
                    if (currentGroup != null) {
                        currentGroup.remove(el, false, doNotFireEvent, false, actualGroup);
                        this._updateConnectionsForGroup(currentGroup);
                    }
                    actualGroup.add(el, doNotFireEvent/*, currentGroup*/);

                    const handleDroppedConnections = (list:ConnectionSelection<E>, index:number) => {
                        let oidx = index === 0 ? 1 : 0;
                        list.each( (c:Connection<E>) => {
                            c.setVisible(false);
                            if (c.endpoints[oidx].element[Constants.GROUP_KEY] === actualGroup) {
                                c.endpoints[oidx].setVisible(false);
                                this._expandConnection(c, oidx, actualGroup);
                            }
                            else {
                                c.endpoints[index].setVisible(false);
                                this._collapseConnection(c, index, actualGroup);
                            }
                        });
                    };

                    if (actualGroup.collapsed) {
                        handleDroppedConnections(this.instance.select({source: el}), 0);
                        handleDroppedConnections(this.instance.select({target: el}), 1);
                    }

                    let elId = this.instance.getId(el);
                    let newPosition = { left: elpos.left - cpos.left, top: elpos.top - cpos.top };

                    this.instance.setPosition(el, newPosition);

                    this._updateConnectionsForGroup(actualGroup);

                    this.instance.revalidate(elId);

                    if (!doNotFireEvent) {
                        let p = {group: actualGroup, el: el, pos:newPosition};
                        if (currentGroup) {
                            (<any>p).sourceGroup = currentGroup;
                        }
                        this.instance.fire(Constants.EVENT_CHILD_ADDED, p);
                    }
                }
            };

            this.instance.each(el, _one);

        }
    }

    removeFromGroup (group:string | Group<E>, el:E, doNotFireEvent?:boolean) {
        let actualGroup = this.getGroup(group);
        if (actualGroup) {
            actualGroup.remove(el, null, doNotFireEvent);
        }
    }

}
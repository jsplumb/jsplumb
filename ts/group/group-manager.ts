import {ConnectionSelection, Dictionary, jsPlumbInstance, Offset, PointArray} from "../core";
import {UIGroup} from "./group";
import * as Constants from "../constants";
import {IS, removeWithFunction, suggest} from "../util";
import {Connection} from "..";

export class GroupManager {

    groupMap:Dictionary<UIGroup> = {};
    _connectionSourceMap:Dictionary<UIGroup> = {};
    _connectionTargetMap:Dictionary<UIGroup> = {};

    constructor(public instance:jsPlumbInstance) {

        instance.bind(Constants.EVENT_CONNECTION, (p:any) => {

            const sourceGroup = this.getGroupFor(p.source);
            const targetGroup = this.getGroupFor(p.target);

            if (sourceGroup != null && targetGroup != null && sourceGroup === targetGroup) {
                this._connectionSourceMap[p.connection.id] = sourceGroup;
                this._connectionTargetMap[p.connection.id] = sourceGroup;
            }
            else {
                if (sourceGroup != null) {
                    suggest(sourceGroup.connections.source, p.connection);
                    this._connectionSourceMap[p.connection.id] = sourceGroup;
                }
                if (targetGroup != null) {
                    suggest(targetGroup.connections.target, p.connection);
                    this._connectionTargetMap[p.connection.id] = targetGroup;
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

    private _cleanupDetachedConnection(conn:Connection) {
        delete conn.proxies;
        let group = this._connectionSourceMap[conn.id], f;
        if (group != null) {
            f = (c:Connection) => { return c.id === conn.id; };
            removeWithFunction(group.connections.source, f);
            removeWithFunction(group.connections.target, f);
            delete this._connectionSourceMap[conn.id];
        }

        group = this._connectionTargetMap[conn.id];
        if (group != null) {
            f = (c:Connection) => { return c.id === conn.id; };
            removeWithFunction(group.connections.source, f);
            removeWithFunction(group.connections.target, f);
            delete this._connectionTargetMap[conn.id];
        }
    }

    addGroup(params:any) {

        if (this.groupMap[params.id] != null) {
            throw new TypeError("cannot create Group [" + params.id + "]; a Group with that ID exists");
        }
        if (params.el[Constants.IS_GROUP_KEY] != null) {
            throw new TypeError("cannot create Group [" + params.id + "]; the given element is already a Group");
        }
        let group = new UIGroup(this.instance, params.el, params);
        this.groupMap[group.id] = group;
        if (params.collapsed) {
            this.collapseGroup(group);
        }

        this.instance.manage(group.el);
        this.instance.addClass(group.el, Constants.GROUP_EXPANDED_CLASS);
        group.manager = this;
        this._updateConnectionsForGroup(group);

        this.instance.fire(Constants.EVENT_GROUP_ADDED, { group:group });

        return group;
    }

    getGroup (groupId:string | UIGroup):UIGroup {
        let group = groupId;
        if (IS.aString(groupId)) {
            group = this.groupMap[groupId as string];
            if (group == null) {
                throw new TypeError("No such group [" + groupId + "]");
            }
        }
        return group as UIGroup;
    }

    getGroupFor(el:any|string):UIGroup {
        let _el = this.instance.getElement(el);
        if (_el != null) {
            const c = this.instance.getContainer();
            let abort = false, g = null;
            while (!abort) {
                if (_el == null || _el === c) {
                    abort = true;
                } else {
                    if (_el[Constants.PARENT_GROUP_KEY]) {
                        g = _el[Constants.PARENT_GROUP_KEY];
                        abort = true;
                    } else {
                        _el = (_el as any).parentNode;
                    }
                }
            }
            return g;
        }
    }

    getGroups():Array<UIGroup> {
        const g = [];
        for (let key in this.groupMap) {
            g.push(this.groupMap[key]);
        }
        return g;
    }

    removeGroup(group:string | UIGroup, deleteMembers?:boolean, manipulateDOM?:boolean, doNotFireEvent?:boolean):Dictionary<Offset> {
        let actualGroup = this.getGroup(group);
        this.expandGroup(actualGroup, true); // this reinstates any original connections and removes all proxies, but does not fire an event.
        let newPositions:Dictionary<Offset> = {};
        //actualGroup[deleteMembers ? Constants.CMD_REMOVE_ALL : Constants.CMD_ORPHAN_ALL](manipulateDOM, doNotFireEvent);
        if (deleteMembers) {
            actualGroup.removeAll(manipulateDOM, doNotFireEvent);
        } else {
            newPositions = actualGroup.orphanAll();
        }
        this.instance.remove(actualGroup.el);
        delete this.groupMap[actualGroup.id];
        this.instance.fire(Constants.EVENT_GROUP_REMOVED, { group:actualGroup });
        return newPositions; // this will be null in the case or remove, but be a map of {id->[x,y]} in the case of orphan
    };

    removeAllGroups (deleteMembers?:boolean, manipulateDOM?:boolean, doNotFireEvent?:boolean) {
        for (let g in this.groupMap) {
            this.removeGroup(this.groupMap[g], deleteMembers, manipulateDOM, doNotFireEvent);
        }
    }

    forEach(f:(g:UIGroup) => any):void {
        for (let key in this.groupMap) {
            f(this.groupMap[key]);
        }
    }

    orphan(_el:any):[string, Offset] {
        if (_el[Constants.PARENT_GROUP_KEY]) {
            let id = this.instance.getId(_el);
            let pos = this.instance.getOffset(_el);
            (<any>_el).parentNode.removeChild(_el);
            this.instance.appendElement(_el, this.instance.getContainer());
            this.instance.setPosition(_el, pos);
            delete _el[Constants.PARENT_GROUP_KEY];
            return [id, pos];
        }
    }

    private _setGroupVisible(group:UIGroup, state:boolean) {
        let m = (group.el as any).querySelectorAll("[jtk-managed]");
        for (let i = 0; i < m.length; i++) {
            this.instance[state ? Constants.CMD_SHOW : Constants.CMD_HIDE](m[i], true);
        }
    }

    _updateConnectionsForGroup(group:UIGroup) {

        group.connections.source.length = 0;
        group.connections.target.length = 0;

        // get all direct members, and any of their descendants.
        const members = group.children.slice();
        const childMembers:Array<any> = [];
        members.forEach((member: any) => childMembers.push(...member.querySelectorAll("[jtk-managed]")));
        members.push(...childMembers);

        if (members.length > 0) {

            const c1 = this.instance.getConnections({
                source: members,
                scope: Constants.WILDCARD
            }, true) as Array<Connection>;
            const c2 = this.instance.getConnections({
                target: members,
                scope: Constants.WILDCARD
            }, true) as Array<Connection>;
            const processed = {};

            let gs, gt;
            const oneSet = (c: Array<Connection>) => {
                for (let i = 0; i < c.length; i++) {
                    if (processed[c[i].id]) {
                        continue;
                    }
                    processed[c[i].id] = true;

                    gs = this.getGroupFor(c[i].source);
                    gt = this.getGroupFor(c[i].target);

                    if (gs === group) {
                        if (gt !== group) {
                            group.connections.source.push(c[i]);
                        }
                        this._connectionSourceMap[c[i].id] = group;
                    } else if (gt === group) {
                        group.connections.target.push(c[i]);
                        this._connectionTargetMap[c[i].id] = group;
                    }
                }
            };
            oneSet(c1);
            oneSet(c2);
        }
    }

    private _collapseConnection(conn:Connection, index:number, group:UIGroup):boolean {
        let otherEl = conn.endpoints[index === 0 ? 1 : 0].element;
        if (otherEl[Constants.PARENT_GROUP_KEY] && (!otherEl[Constants.PARENT_GROUP_KEY].proxied && otherEl[Constants.PARENT_GROUP_KEY].collapsed)) {
            return false;
        }

        const es = conn.endpoints[0].element,
            esg = es[Constants.PARENT_GROUP_KEY],
            esgcp = esg != null ? (esg.collapseParent || esg) : null,
            et = conn.endpoints[1].element,
            etg = et[Constants.PARENT_GROUP_KEY],
            etgcp = etg != null ? (etg.collapseParent || etg) : null;

        if (esgcp == null || etgcp == null || (esgcp.id !== etgcp.id)) {
            let groupEl = group.el, groupElId = this.instance.getId(groupEl);
            this.instance.proxyConnection(conn, index, groupEl, groupElId, (conn:Connection, index:number) => { return group.getEndpoint(conn, index); }, (conn:Connection, index:number) => { return group.getAnchor(conn, index); });
            return true;
        } else {
            return false;
        }

        // let groupEl = group.el, groupElId = this.instance.getId(groupEl);
        // this.instance.proxyConnection(conn, index, groupEl, groupElId, (conn:Connection, index:number) => { return group.getEndpoint(conn, index); }, (conn:Connection, index:number) => { return group.getAnchor(conn, index); });
    }

    private _expandConnection(c:Connection, index:number, group:UIGroup) {
        this.instance.unproxyConnection(c, index, this.instance.getId(group.el));
    }

    private isElementDescendant(el:any, parentEl:any): boolean {
        const c = this.instance.getContainer();
        let abort = false;
        while (!abort) {
            if (el == null || el === c) {
                return false;
            } else {
                if (el === parentEl) {
                    return true;
                } else {
                    el = (el as any).parentNode; // TODO DOM specific.
                }
            }
        }
    }

    collapseGroup (group:string | UIGroup) {
        let actualGroup = this.getGroup(group);
        if (actualGroup == null || actualGroup.collapsed) {
            return;
        }

        let groupEl = actualGroup.el;

        if (actualGroup.collapseParent == null) {

            // hide all connections
            this._setGroupVisible(actualGroup, false);

            actualGroup.collapsed = true;

            if (actualGroup.proxied) {

                this.instance.removeClass(groupEl, Constants.GROUP_EXPANDED_CLASS);
                this.instance.addClass(groupEl, Constants.GROUP_COLLAPSED_CLASS);

                const collapsedConnectionIds = new Set<string>();

                // collapses all connections in a group.
                const _collapseSet = (conns: Array<Connection>, index: number) => {
                    for (let i = 0; i < conns.length; i++) {
                        let c = conns[i];

                        if (this._collapseConnection(c, index, actualGroup) === true) {
                            collapsedConnectionIds.add(c.id);
                        }
                    }
                };

                // setup proxies for sources and targets
                _collapseSet(actualGroup.connections.source, 0);
                _collapseSet(actualGroup.connections.target, 1);

                actualGroup.childGroups.forEach((cg: UIGroup) => {
                    this.cascadeCollapse(actualGroup, cg, collapsedConnectionIds);
                });

            }

            this.instance.revalidate(groupEl);
            this.repaintGroup(actualGroup);
            this.instance.fire(Constants.EVENT_COLLAPSE, { group:actualGroup  });

        } else {
            actualGroup.collapsed = true;
            this.instance.removeClass(groupEl, Constants.GROUP_EXPANDED_CLASS);
            this.instance.addClass(groupEl, Constants.GROUP_COLLAPSED_CLASS);
        }
    }

    /**
     * Cascade a collapse from the given `collapsedGroup` into the given `targetGroup`.
     * @param collapsedGroup
     * @param targetGroup
     * @param collapsedIds Set of connection ids for already collapsed connections, which we can ignore.
     */
    cascadeCollapse(collapsedGroup:UIGroup, targetGroup:UIGroup, collapsedIds:Set<string>) {
        if (collapsedGroup.proxied) {

            // collapses all connections in a group.
            const _collapseSet =  (conns:Array<Connection>, index:number) => {
                for (let i = 0; i < conns.length; i++) {
                    let c = conns[i];
                    if (!collapsedIds.has(c.id)) {

                        if (this._collapseConnection(c, index, collapsedGroup) === true) {
                            collapsedIds.add(c.id);
                        }
                    }
                }
            };

            // setup proxies for sources and targets
            _collapseSet(targetGroup.connections.source, 0);
            _collapseSet(targetGroup.connections.target, 1);

        }

        targetGroup.childGroups.forEach((cg:UIGroup) => {
            this.cascadeCollapse(collapsedGroup, cg, collapsedIds);
        });
    }

    expandGroup(group:string | UIGroup, doNotFireEvent?:boolean) {

        let actualGroup = this.getGroup(group);

        if (actualGroup == null || !actualGroup.collapsed) {
            return;
        }
        const groupEl = actualGroup.el;

        if (actualGroup.collapseParent == null) {

            this._setGroupVisible(actualGroup, true);
            actualGroup.collapsed = false;

            if (actualGroup.proxied) {
                this.instance.addClass(groupEl, Constants.GROUP_EXPANDED_CLASS);
                this.instance.removeClass(groupEl, Constants.GROUP_COLLAPSED_CLASS);

                // collapses all connections in a group.
                const _expandSet = (conns: Array<Connection>, index: number) => {
                    for (let i = 0; i < conns.length; i++) {
                        let c = conns[i];
                        this._expandConnection(c, index, actualGroup);
                    }
                };

                // setup proxies for sources and targets
                _expandSet(actualGroup.connections.source, 0);
                _expandSet(actualGroup.connections.target, 1);

                actualGroup.childGroups.forEach((cg:UIGroup) => {
                    this.cascadeExpand(actualGroup, cg);
                });
            }


            this.instance.revalidate(groupEl);
            this.repaintGroup(actualGroup);
            if (!doNotFireEvent) {
                this.instance.fire(Constants.EVENT_EXPAND, {group: group});
            }
        } else {
            actualGroup.collapsed = false;
            this.instance.addClass(groupEl, Constants.GROUP_EXPANDED_CLASS);
            this.instance.removeClass(groupEl, Constants.GROUP_COLLAPSED_CLASS);
        }

    }

    /**
     * Cascade an expand from the given `collapsedGroup` into the given `targetGroup`.
     * @param expandedGroup
     * @param targetGroup
     */
    cascadeExpand(expandedGroup:UIGroup, targetGroup:UIGroup) {
        //  What to do.
        //
        // We assume this method is only called when targetGroup is legitimately a descendant of collapsedGroup.
        // Basically all the connections on this group have to be re-proxied onto collapsedGroup, and this group has to be hidden.

        if (expandedGroup.proxied) {
            const _expandSet = (conns: Array<Connection>, index: number) => {
                for (let i = 0; i < conns.length; i++) {
                    let c = conns[i];
                    this._expandConnection(c, index, expandedGroup);
                }
            };

            // setup proxies for sources and targets
            _expandSet(targetGroup.connections.source, 0);
            _expandSet(targetGroup.connections.target, 1);

        }

        this.instance.revalidate(targetGroup.el);
        this.repaintGroup(targetGroup.el);
        this.instance.fire(Constants.EVENT_EXPAND, {group: targetGroup.el});

        targetGroup.childGroups.forEach((cg:UIGroup) => {
            this.cascadeExpand(expandedGroup, cg);
        });
    }

    toggleGroup(group:string|UIGroup) {
        group = this.getGroup(group);
        if (group != null) {
            if (group.collapsed) {
                this.expandGroup(group);
            } else {
                this.collapseGroup(group);
            }
        }
    }

    repaintGroup (group:string|UIGroup) {
        let actualGroup = this.getGroup(group);
        const m = actualGroup.children;
        for (let i = 0; i < m.length; i++) {
            this.instance.revalidate(m[i]);
        }
    }

    addToGroup(group:string | UIGroup, el:any | Array<any>, doNotFireEvent?:boolean) {
        let actualGroup = this.getGroup(group);
        if (actualGroup) {
            let groupEl = actualGroup.el;

            const _one = (el:any) => {
                let isGroup = el[Constants.IS_GROUP_KEY] != null,
                    droppingGroup = el[Constants.GROUP_KEY] as UIGroup;

                let currentGroup = el[Constants.PARENT_GROUP_KEY];
                // if already a member of this group, do nothing
                if (currentGroup !== actualGroup) {
                    const elpos = this.instance.getOffset(el, true);
                    const cpos = actualGroup.collapsed ? this.instance.getOffset(groupEl, true) : this.instance.getOffset(actualGroup.getDragArea(), true);

                    // otherwise, transfer to this group.
                    if (currentGroup != null) {
                        currentGroup.remove(el, false, doNotFireEvent, false, actualGroup);
                        this._updateConnectionsForGroup(currentGroup);
                    }
                    if (isGroup) {
                        actualGroup.addGroup(droppingGroup);
                    } else {
                        actualGroup.add(el, doNotFireEvent);
                    }


                    const handleDroppedConnections = (list:ConnectionSelection, index:number) => {
                        const oidx = index === 0 ? 1 : 0;
                        list.each( (c:Connection) => {
                            c.setVisible(false);
                            //if (c.endpoints[oidx].element[Constants.PARENT_GROUP_KEY] === actualGroup) {
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

                        // TODO fire a "child group added" event in that case?

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

    removeFromGroup (group:string | UIGroup, el:any, doNotFireEvent?:boolean):void {
        let actualGroup = this.getGroup(group);
        if (actualGroup) {


            // if this group is currently collapsed then any proxied connections for the given el (or its descendants) need
            // to be put back on their original element, and unproxied
            if (actualGroup.collapsed) {
                const _expandSet =  (conns:Array<Connection>, index:number) => {
                    for (let i = 0; i < conns.length; i++) {
                        const c = conns[i];
                        if (c.proxies) {
                            for(let j = 0; j < c.proxies.length; j++) {
                                if (c.proxies[j] != null) {
                                    const proxiedElement = c.proxies[j].originalEp.element;
                                    if (proxiedElement === el || this.isElementDescendant(proxiedElement, el)) {
                                        this._expandConnection(c, index, actualGroup);
                                    }
                                }

                            }
                        }
                    }
                };

                // setup proxies for sources and targets
                _expandSet(actualGroup.connections.source.slice(), 0);
                _expandSet(actualGroup.connections.target.slice(), 1);
            }

            actualGroup.remove(el, null, doNotFireEvent);
        }
    }

    getAncestors(group:UIGroup):Array<UIGroup> {
        const ancestors:Array<UIGroup> = [];
        let p = group.group;
        while (p != null) {
            ancestors.push(p);
            p = p.group;
        }
        return ancestors;
    }

    isAncestor(group:UIGroup, possibleAncestor:UIGroup):boolean {
        if (group == null || possibleAncestor == null) {
            return false;
        }
        return this.getAncestors(group).indexOf(possibleAncestor) !== -1;
    }

    getDescendants(group:UIGroup):Array<UIGroup> {
        const d:Array<UIGroup> = [];
        const _one = (g:UIGroup) => {
            d.push(...g.childGroups);
            g.childGroups.forEach(_one);
        };
        _one(group);
        return d;
    }

    isDescendant(possibleDescendant:UIGroup, ancestor:UIGroup):boolean {
        if (possibleDescendant == null || ancestor == null) {
            return false;
        }
        return this.getDescendants(ancestor).indexOf(possibleDescendant) !== -1;
    }

    reset() {
        this._connectionSourceMap = {};
        this._connectionTargetMap = {};
        this.groupMap = {};
    }

}

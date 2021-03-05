import {
    ConnectionDetachedParams,
    ConnectionEstablishedParams,
    Dictionary, jsPlumbElement,
    PointXY,
    ConnectionMovedParams
} from '../common'

import { JsPlumbInstance } from "../core"

import {UIGroup, GroupOptions} from "./group"
import * as Constants from "../constants"
import {IS, removeWithFunction, suggest, forEach } from "../util"
import {Connection} from "../connector/connection-impl"
import {ConnectionSelection} from "../selection/connection-selection"

interface GroupMemberEventParams<E> {
    el:jsPlumbElement<E>,
    group:UIGroup<E>
}

interface GroupMemberAddedParams<E> extends GroupMemberEventParams<E> {
    pos:PointXY
}

interface GroupMemberRemovedParams<E> extends GroupMemberEventParams<E> {
    targetGroup?:UIGroup<E>
}

export interface AddGroupOptions extends GroupOptions {
    el:any
    collapsed?:boolean
}

export class GroupManager<E> {

    groupMap:Dictionary<UIGroup<E>> = {}
    _connectionSourceMap:Dictionary<UIGroup<E>> = {}
    _connectionTargetMap:Dictionary<UIGroup<E>> = {}

    constructor(public instance:JsPlumbInstance) {

        instance.bind(Constants.EVENT_CONNECTION, (p:ConnectionEstablishedParams<E>) => {

            const sourceGroup = this.getGroupFor(p.source)
            const targetGroup = this.getGroupFor(p.target)

            if (sourceGroup != null && targetGroup != null && sourceGroup === targetGroup) {
                this._connectionSourceMap[p.connection.id] = sourceGroup
                this._connectionTargetMap[p.connection.id] = sourceGroup
                suggest(sourceGroup.connections.internal, p.connection)
            }
            else {
                if (sourceGroup != null) {
                    if ((p.target as unknown as jsPlumbElement<E>)._jsPlumbGroup === sourceGroup) {
                        suggest(sourceGroup.connections.internal, p.connection)
                    } else {
                        suggest(sourceGroup.connections.source, p.connection)
                    }
                    this._connectionSourceMap[p.connection.id] = sourceGroup
                }
                if (targetGroup != null) {
                    if ((p.source as unknown as jsPlumbElement<E>)._jsPlumbGroup === targetGroup) {
                        suggest(targetGroup.connections.internal, p.connection)
                    } else {
                        suggest(targetGroup.connections.target, p.connection)
                    }
                    this._connectionTargetMap[p.connection.id] = targetGroup
                }
            }
        })

        instance.bind(Constants.EVENT_INTERNAL_CONNECTION_DETACHED, (p:ConnectionDetachedParams<E>) => {
            this._cleanupDetachedConnection(p.connection)
        })

        instance.bind(Constants.EVENT_CONNECTION_MOVED, (p:ConnectionMovedParams) => {

            const originalElement = p.originalEndpoint.element,
                  originalGroup = this.getGroupFor(originalElement),
                  newEndpoint = p.connection.endpoints[p.index],
                  newElement = newEndpoint.element,
                  newGroup = this.getGroupFor(newElement),
                  connMap = p.index === 0 ? this._connectionSourceMap : this._connectionTargetMap,
                  otherConnMap = p.index === 0 ? this._connectionTargetMap : this._connectionSourceMap

            // adjust group manager's map for source/target (depends on index).
            if (newGroup != null) {
                connMap[p.connection.id] = newGroup
                // if source === target set the same ref in the other map
                if (p.connection.source === p.connection.target) {
                    otherConnMap[p.connection.id] = newGroup
                }
            } else {
                // otherwise if the connection's endpoint for index is no longer in a group, remove from the map.
                delete connMap[p.connection.id]
                // if source === target delete the ref in the other map.
                if (p.connection.source === p.connection.target) {
                    delete otherConnMap[p.connection.id]
                }
            }

            if (originalGroup != null) {
                this._updateConnectionsForGroup(originalGroup)
            }

            if (newGroup != null) {
                this._updateConnectionsForGroup(newGroup)
            }
        })
    }

    private _cleanupDetachedConnection(conn:Connection) {

        conn.proxies.length = 0

        let group = this._connectionSourceMap[conn.id], f
        if (group != null) {
            f = (c:Connection) => { return c.id === conn.id; }
            removeWithFunction(group.connections.source, f)
            removeWithFunction(group.connections.target, f)
            removeWithFunction(group.connections.internal, f)
            delete this._connectionSourceMap[conn.id]
        }

        group = this._connectionTargetMap[conn.id]
        if (group != null) {
            f = (c:Connection) => { return c.id === conn.id; }
            removeWithFunction(group.connections.source, f)
            removeWithFunction(group.connections.target, f)
            removeWithFunction(group.connections.internal, f)
            delete this._connectionTargetMap[conn.id]
        }
    }

    addGroup(params:AddGroupOptions) {

        if (this.groupMap[params.id] != null) {
            throw new Error("cannot create Group [" + params.id + "]; a Group with that ID exists")
        }
        if (params.el[Constants.IS_GROUP_KEY] != null) {
            throw new Error("cannot create Group [" + params.id + "]; the given element is already a Group")
        }
        let group:UIGroup<E> = new UIGroup(this.instance, params.el, params)
        this.groupMap[group.id] = group
        if (params.collapsed) {
            this.collapseGroup(group)
        }

        this.instance.manage(group.el)
        this.instance.addClass(group.el, Constants.CLASS_GROUP_EXPANDED)
        group.manager = this
        this._updateConnectionsForGroup(group)

        this.instance.fire(Constants.EVENT_GROUP_ADDED, { group:group })

        return group
    }

    getGroup (groupId:string | UIGroup<E>):UIGroup<E> {
        let group = groupId
        if (IS.aString(groupId)) {
            group = this.groupMap[groupId as string]
            if (group == null) {
                throw new Error("No such group [" + groupId + "]")
            }
        }
        return group as UIGroup<E>
    }

    getGroupFor(el:E):UIGroup<E> {

        let jel = el as unknown as jsPlumbElement<E>
        const c = this.instance.getContainer()
        let abort = false, g = null
        while (!abort) {
            if (jel == null || jel === c) {
                abort = true
            } else {
                if (jel._jsPlumbParentGroup) {
                    g = jel._jsPlumbParentGroup
                    abort = true
                } else {
                    // TODO knows about the DOM.
                    jel = (jel as any).parentNode
                }
            }
        }
        return g

    }

    getGroups():Array<UIGroup<E>> {
        const g = []
        for (let key in this.groupMap) {
            g.push(this.groupMap[key])
        }
        return g
    }

    removeGroup(group:string | UIGroup<E>, deleteMembers?:boolean, manipulateView?:boolean, doNotFireEvent?:boolean):Dictionary<PointXY> {
        let actualGroup = this.getGroup(group)
        this.expandGroup(actualGroup, true) // this reinstates any original connections and removes all proxies, but does not fire an event.
        let newPositions:Dictionary<PointXY> = {}
        // remove `group` from child nodes
        forEach(actualGroup.children,(_el:E) => {
            const entry = this.instance.getManagedElements()[this.instance.getId(_el)]
            if (entry) {
                delete entry.group
            }
        })
        forEach(actualGroup.childGroups, (g:UIGroup<E>) => {
            const entry = this.instance.getManagedElements()[this.instance.getId(g.el)]
            if (entry) {
                delete entry.group
            }
        })
        if (deleteMembers) {
            // remove all child groups
            forEach(actualGroup.childGroups, (cg:UIGroup<E>) => this.removeGroup(cg, deleteMembers, manipulateView))
            // remove all child nodes
            actualGroup.removeAll(manipulateView, doNotFireEvent)
        } else {
            // if we want to retain the child nodes then we need to test if there is a group that the parent of actualGroup.
            // if so, transfer the nodes to that group
            if (actualGroup.group) {
                forEach(actualGroup.children, (c:any) => actualGroup.group.add(c))
            }
            newPositions = actualGroup.orphanAll()
        }

        if (actualGroup.group) {
            actualGroup.group.removeGroup(actualGroup)
        } else {
            this.instance.unmanage(actualGroup.el, true)
        }

        delete this.groupMap[actualGroup.id]
        this.instance.fire(Constants.EVENT_GROUP_REMOVED, { group:actualGroup })
        return newPositions; // this will be null in the case of remove, but be a map of {id->[x,y]} in the case of orphan
    }

    removeAllGroups (deleteMembers?:boolean, manipulateView?:boolean, doNotFireEvent?:boolean):void {
        for (let g in this.groupMap) {
            this.removeGroup(this.groupMap[g], deleteMembers, manipulateView, doNotFireEvent)
        }
    }

    forEach(f:(g:UIGroup<E>) => any):void {
        for (let key in this.groupMap) {
            f(this.groupMap[key])
        }
    }

    // it would be nice to type `_el` as an element here, but the type of the element is currently specified by the
    // concrete implementation of jsplumb (of which there is 'DOM',  a browser implementation, at the moment.)
    orphan(el:E):[string, PointXY] {
        const jel = el as unknown as jsPlumbElement<E>
        if (jel._jsPlumbParentGroup) {
            const group = jel._jsPlumbParentGroup
            const groupPos = this.instance.getOffset(jel)
            const id = this.instance.getId(jel)
            const pos = this.instance.getOffset(el);
            (jel as any).parentNode.removeChild(jel)

            if (group.group) {
                pos.x += groupPos.x
                pos.y += groupPos.y
                group.group.getContentArea().appendChild(el); // set as child of parent group, if there is one.
            } else {
                this.instance.appendElement(el, this.instance.getContainer()); // set back as child of container
            }

            this.instance.setPosition(el, pos)
            delete jel._jsPlumbParentGroup
            return [id, pos]
        }
    }

    private _setGroupVisible(group:UIGroup<E>, state:boolean) {
        let m = (group.el as any).querySelectorAll(Constants.SELECTOR_MANAGED_ELEMENT)
        for (let i = 0; i < m.length; i++) {
            this.instance[state ? Constants.CMD_SHOW : Constants.CMD_HIDE](m[i], true)
        }
    }

    _updateConnectionsForGroup(group:UIGroup<E>) {

        group.connections.source.length = 0
        group.connections.target.length = 0
        group.connections.internal.length = 0

        // get all direct members, and any of their descendants.
        const members:Array<E> = group.children.slice()
        const childMembers:Array<E> = []
        forEach(members,(member: E) => {
            Array.prototype.push.apply(childMembers, this.instance.getSelector(member, "[jtk-managed]"))
        })

        Array.prototype.push.apply(members, childMembers)

        if (members.length > 0) {

            const c1 = this.instance.getConnections({
                source: members,
                scope: Constants.WILDCARD
            }, true) as Array<Connection>
            const c2 = this.instance.getConnections({
                target: members,
                scope: Constants.WILDCARD
            }, true) as Array<Connection>
            const processed = {}

            let gs, gt
            const oneSet = (c: Array<Connection>) => {
                for (let i = 0; i < c.length; i++) {
                    if (processed[c[i].id]) {
                        continue
                    }
                    processed[c[i].id] = true

                    gs = this.getGroupFor(c[i].source)
                    gt = this.getGroupFor(c[i].target)

                    if ( (c[i].source === group.el && gt === group) || (c[i].target === group.el && gs === group) ) {
                        group.connections.internal.push(c[i])
                    }
                    else if (gs === group) {
                        if (gt !== group) {
                            group.connections.source.push(c[i])
                        } else {
                            group.connections.internal.push(c[i])
                        }
                        this._connectionSourceMap[c[i].id] = group
                    } else if (gt === group) {
                        group.connections.target.push(c[i])
                        this._connectionTargetMap[c[i].id] = group
                    }
                }
            }
            oneSet(c1)
            oneSet(c2)
        }
    }

    private _collapseConnection(conn:Connection, index:number, group:UIGroup<E>):boolean {
        let otherEl = conn.endpoints[index === 0 ? 1 : 0].element
        if (otherEl[Constants.PARENT_GROUP_KEY] && (!otherEl[Constants.PARENT_GROUP_KEY].proxied && otherEl[Constants.PARENT_GROUP_KEY].collapsed)) {
            return false
        }

        const es = conn.endpoints[0].element,
            esg = es[Constants.PARENT_GROUP_KEY],
            esgcp = esg != null ? (esg.collapseParent || esg) : null,
            et = conn.endpoints[1].element,
            etg = et[Constants.PARENT_GROUP_KEY],
            etgcp = etg != null ? (etg.collapseParent || etg) : null

        if (esgcp == null || etgcp == null || (esgcp.id !== etgcp.id)) {
            let groupEl = group.el, groupElId = this.instance.getId(groupEl)
            this.instance.proxyConnection(conn, index, groupEl, /*groupElId, */(conn:Connection, index:number) => { return group.getEndpoint(conn, index); }, (conn:Connection, index:number) => { return group.getAnchor(conn, index); })
            return true
        } else {
            return false
        }
    }

    private _expandConnection(c:Connection, index:number, group:UIGroup<E>) {
        this.instance.unproxyConnection(c, index)
    }

    private isElementDescendant(el:any, parentEl:any): boolean {
        const c = this.instance.getContainer()
        let abort = false
        while (!abort) {
            if (el == null || el === c) {
                return false
            } else {
                if (el === parentEl) {
                    return true
                } else {
                    el = (el as any).parentNode; // TODO DOM specific.
                }
            }
        }
    }

    collapseGroup (group:string | UIGroup<E>) {
        let actualGroup = this.getGroup(group)
        if (actualGroup == null || actualGroup.collapsed) {
            return
        }

        let groupEl = actualGroup.el

        if (actualGroup.collapseParent == null) {

            // hide all connections
            this._setGroupVisible(actualGroup, false)

            actualGroup.collapsed = true

            if (actualGroup.proxied) {

                this.instance.removeClass(groupEl, Constants.CLASS_GROUP_EXPANDED)
                this.instance.addClass(groupEl, Constants.CLASS_GROUP_COLLAPSED)

                const collapsedConnectionIds = new Set<string>()

                // collapses all connections in a group.
                const _collapseSet = (conns: Array<Connection>, index: number) => {
                    for (let i = 0; i < conns.length; i++) {
                        let c = conns[i]

                        if (this._collapseConnection(c, index, actualGroup) === true) {
                            collapsedConnectionIds.add(c.id)
                        }
                    }
                }

                // setup proxies for sources and targets
                _collapseSet(actualGroup.connections.source, 0)
                _collapseSet(actualGroup.connections.target, 1)

                forEach(actualGroup.childGroups,(cg: UIGroup<E>) => {
                    this.cascadeCollapse(actualGroup, cg, collapsedConnectionIds)
                })

            }

            this.instance.revalidate(groupEl)
            this.repaintGroup(actualGroup)
            this.instance.fire(Constants.EVENT_COLLAPSE, { group:actualGroup  })

        } else {
            actualGroup.collapsed = true
            this.instance.removeClass(groupEl, Constants.CLASS_GROUP_EXPANDED)
            this.instance.addClass(groupEl, Constants.CLASS_GROUP_COLLAPSED)
        }
    }

    /**
     * Cascade a collapse from the given `collapsedGroup` into the given `targetGroup`.
     * @param collapsedGroup
     * @param targetGroup
     * @param collapsedIds Set of connection ids for already collapsed connections, which we can ignore.
     */
    cascadeCollapse(collapsedGroup:UIGroup<E>, targetGroup:UIGroup<E>, collapsedIds:Set<string>) {
        if (collapsedGroup.proxied) {

            // collapses all connections in a group.
            const _collapseSet =  (conns:Array<Connection>, index:number) => {
                for (let i = 0; i < conns.length; i++) {
                    let c = conns[i]
                    if (!collapsedIds.has(c.id)) {

                        if (this._collapseConnection(c, index, collapsedGroup) === true) {
                            collapsedIds.add(c.id)
                        }
                    }
                }
            }

            // setup proxies for sources and targets
            _collapseSet(targetGroup.connections.source, 0)
            _collapseSet(targetGroup.connections.target, 1)

        }

        forEach(targetGroup.childGroups,(cg:UIGroup<E>) => {
            this.cascadeCollapse(collapsedGroup, cg, collapsedIds)
        })
    }

    expandGroup(group:string | UIGroup<E>, doNotFireEvent?:boolean) {

        let actualGroup = this.getGroup(group)

        if (actualGroup == null /*|| !actualGroup.collapsed*/) {
            return
        }
        const groupEl = actualGroup.el

        if (actualGroup.collapseParent == null) {

            this._setGroupVisible(actualGroup, true)
            actualGroup.collapsed = false

            if (actualGroup.proxied) {
                this.instance.addClass(groupEl, Constants.CLASS_GROUP_EXPANDED)
                this.instance.removeClass(groupEl, Constants.CLASS_GROUP_COLLAPSED)

                // collapses all connections in a group.
                const _expandSet = (conns: Array<Connection>, index: number) => {
                    for (let i = 0; i < conns.length; i++) {
                        let c = conns[i]
                        this._expandConnection(c, index, actualGroup)
                    }
                }

                // setup proxies for sources and targets
                _expandSet(actualGroup.connections.source, 0)
                _expandSet(actualGroup.connections.target, 1)

                const _expandNestedGroup = (group:UIGroup<E>) => {
                  // if the group is collapsed:
                    // - all of its internal connections should remain hidden.
                    // - all external connections should be proxied to this group we are expanding (`actualGroup`)
                  // otherwise:
                    // just expend it as usual

                    if (group.collapsed) {

                        const _collapseSet =  (conns:Array<Connection>, index:number) => {
                            for (let i = 0; i < conns.length; i++) {
                                let c = conns[i]
                                this._collapseConnection(c, index, group.collapseParent || group)
                            }
                        }

                        // setup proxies for sources and targets
                        _collapseSet(group.connections.source, 0)
                        _collapseSet(group.connections.target, 1)

                        // hide internal connections - the group is collapsed
                        forEach(group.connections.internal,(c:Connection) => c.setVisible(false))

                        // expand child groups
                        forEach(group.childGroups, _expandNestedGroup)

                    } else {
                        this.expandGroup(group, doNotFireEvent)
                    }
                }

                // expand any nested groups. this will take into account if the nested group is collapsed.
                forEach(actualGroup.childGroups, _expandNestedGroup)
            }


            this.instance.revalidate(groupEl)
            this.repaintGroup(actualGroup)
            if (!doNotFireEvent) {
                this.instance.fire(Constants.EVENT_EXPAND, {group: group})
            }
        } else {
            actualGroup.collapsed = false
            this.instance.addClass(groupEl, Constants.CLASS_GROUP_EXPANDED)
            this.instance.removeClass(groupEl, Constants.CLASS_GROUP_COLLAPSED)
        }
    }

    /**
     * Cascade an expand from the given `collapsedGroup` into the given `targetGroup`.
     * @param expandedGroup
     * @param targetGroup
     */
    cascadeExpand(expandedGroup:UIGroup<E>, targetGroup:UIGroup<E>) {
        //  What to do.
        //
        // We assume this method is only called when targetGroup is legitimately a descendant of collapsedGroup.
        // Basically all the connections on this group have to be re-proxied onto collapsedGroup, and this group has to be hidden.

        if (expandedGroup.proxied) {
            const _expandSet = (conns: Array<Connection>, index: number) => {
                for (let i = 0; i < conns.length; i++) {
                    let c = conns[i]
                    if (targetGroup.collapsed) {
                        this._collapseConnection(c, index, targetGroup)
                    } else {
                        this._expandConnection(c, index, expandedGroup)
                    }
                }
            }

            // setup proxies for sources and targets
            _expandSet(targetGroup.connections.source, 0)
            _expandSet(targetGroup.connections.target, 1)

        }

        this.instance.revalidate(targetGroup.el)
        this.repaintGroup(targetGroup.el)
        this.instance.fire(Constants.EVENT_EXPAND, {group: targetGroup.el})

        forEach(targetGroup.childGroups,(cg:UIGroup<E>) => {
            this.cascadeExpand(expandedGroup, cg)
        })
    }

    toggleGroup(group:string|UIGroup<E>) {
        group = this.getGroup(group)
        if (group != null) {
            if (group.collapsed) {
                this.expandGroup(group)
            } else {
                this.collapseGroup(group)
            }
        }
    }

    repaintGroup (group:string|UIGroup<E>) {
        let actualGroup = this.getGroup(group)
        const m = actualGroup.children
        for (let i = 0; i < m.length; i++) {
            this.instance.revalidate(m[i])
        }
    }

    addToGroup(group:string | UIGroup<E>, doNotFireEvent:boolean, ...el:Array<E>) {
        let actualGroup = this.getGroup(group)
        if (actualGroup) {
            let groupEl = actualGroup.el

            const _one = (el:E) => {
                let isGroup = el[Constants.IS_GROUP_KEY] != null,
                    droppingGroup = el[Constants.GROUP_KEY] as UIGroup<E>

                let currentGroup = el[Constants.PARENT_GROUP_KEY]
                // if already a member of this group, do nothing
                if (currentGroup !== actualGroup) {

                    const entry = this.instance.manage(el)
                    const elpos = this.instance.getOffset(el)
                    const cpos = actualGroup.collapsed ? this.instance.getOffsetRelativeToRoot(groupEl) : this.instance.getOffset(actualGroup.getContentArea())
                    entry.group = actualGroup.elId

                    // otherwise, transfer to this group.
                    if (currentGroup != null) {
                        currentGroup.remove(el, false, doNotFireEvent, false, actualGroup)
                        this._updateConnectionsForGroup(currentGroup)
                    }
                    if (isGroup) {
                        actualGroup.addGroup(droppingGroup)
                    } else {
                        actualGroup.add(el, doNotFireEvent)
                    }

                    const handleDroppedConnections = (list:ConnectionSelection, index:number) => {
                        const oidx = index === 0 ? 1 : 0
                        list.each( (c:Connection) => {
                            c.setVisible(false)
                            if (c.endpoints[oidx].element[Constants.GROUP_KEY] === actualGroup) {
                                c.endpoints[oidx].setVisible(false)
                                this._expandConnection(c, oidx, actualGroup)
                            }
                            else {
                                c.endpoints[index].setVisible(false)
                                this._collapseConnection(c, index, actualGroup)
                            }
                        })
                    }

                    if (actualGroup.collapsed) {
                        handleDroppedConnections(this.instance.select({source: el}), 0)
                        handleDroppedConnections(this.instance.select({target: el}), 1)
                    }

                    let elId = this.instance.getId(el)
                    let newPosition = { x: elpos.x - cpos.x, y: elpos.y - cpos.y }

                    this.instance.setPosition(el, newPosition)

                    this._updateConnectionsForGroup(actualGroup)

                    this.instance.revalidate(el)

                    if (!doNotFireEvent) {

                        // TODO fire a "child group added" event in that case?

                        let p = {group: actualGroup, el: el, pos:newPosition}
                        if (currentGroup) {
                            (<any>p).sourceGroup = currentGroup
                        }
                        this.instance.fire(Constants.EVENT_GROUP_MEMBER_ADDED, p)
                    }
                }
            }

            forEach(el, _one)

        }
    }

    removeFromGroup (group:string | UIGroup<E>, doNotFireEvent:boolean, ...el:Array<E>):void {
        let actualGroup = this.getGroup(group)
        if (actualGroup) {

            const _one = (_el:E) => {
                // if this group is currently collapsed then any proxied connections for the given el (or its descendants) need
                // to be put back on their original element, and unproxied
                if (actualGroup.collapsed) {
                    const _expandSet = (conns: Array<Connection>, index: number) => {
                        for (let i = 0; i < conns.length; i++) {
                            const c = conns[i]
                            if (c.proxies) {
                                for (let j = 0; j < c.proxies.length; j++) {
                                    if (c.proxies[j] != null) {
                                        const proxiedElement = c.proxies[j].originalEp.element
                                        if (proxiedElement === _el || this.isElementDescendant(proxiedElement, _el)) {
                                            this._expandConnection(c, index, actualGroup)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // setup proxies for sources and targets
                    _expandSet(actualGroup.connections.source.slice(), 0)
                    _expandSet(actualGroup.connections.target.slice(), 1)
                }

                actualGroup.remove(_el, null, doNotFireEvent)
                const entry = this.instance.getManagedElements()[this.instance.getId(_el)]
                if (entry) {
                    delete entry.group
                }
            };

            forEach(el, _one)
        }
    }

    getAncestors(group:UIGroup<E>):Array<UIGroup<E>> {
        const ancestors:Array<UIGroup<E>> = []
        let p = group.group
        while (p != null) {
            ancestors.push(p)
            p = p.group
        }
        return ancestors
    }

    isAncestor(group:UIGroup<E>, possibleAncestor:UIGroup<E>):boolean {
        if (group == null || possibleAncestor == null) {
            return false
        }
        return this.getAncestors(group).indexOf(possibleAncestor) !== -1
    }

    getDescendants(group:UIGroup<E>):Array<UIGroup<E>> {
        const d:Array<UIGroup<E>> = []
        const _one = (g:UIGroup<E>) => {
            d.push(...g.childGroups)
            forEach(g.childGroups, _one)
        }
        _one(group)
        return d
    }

    isDescendant(possibleDescendant:UIGroup<E>, ancestor:UIGroup<E>):boolean {
        if (possibleDescendant == null || ancestor == null) {
            return false
        }
        return this.getDescendants(ancestor).indexOf(possibleDescendant) !== -1
    }

    reset() {
        this._connectionSourceMap = {}
        this._connectionTargetMap = {}
        this.groupMap = {}
    }

}

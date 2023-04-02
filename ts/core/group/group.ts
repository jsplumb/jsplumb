
import { JsPlumbInstance, jsPlumbElement } from "../core"
import { Connection } from '../connector/connection-impl'
import { DotEndpoint } from "../endpoint/dot-endpoint"
import { GroupManager } from "./group-manager"

import * as Constants from "../constants"
import {AnchorSpec} from "../../common/anchor"
import {getWithFunction, log, PointXY, removeWithFunction, uuid} from "../../util/util"
import {EndpointSpec} from "../../common/endpoint"

export interface GroupOptions {
    id?:string
    droppable?:boolean
    enabled?:boolean
    orphan?:boolean
    constrain?:boolean
    proxied?:boolean
    ghost?:boolean
    revert?:boolean
    prune?:boolean
    dropOverride?:boolean
    anchor?:AnchorSpec
    endpoint?:EndpointSpec
}

export class UINode<E> {
    group:UIGroup<E>
    constructor(public instance:JsPlumbInstance, public el:E) { }
}

export class UIGroup<E = any> extends UINode<E> {

    children:Array<UINode<E>> = []

    collapsed:boolean = false

    droppable:boolean
    enabled:boolean
    orphan:boolean
    constrain:boolean
    proxied:boolean
    ghost:boolean
    revert:boolean
    prune:boolean
    dropOverride:boolean
    anchor:AnchorSpec
    endpoint:EndpointSpec

    readonly connections:{source:Array<Connection>, target:Array<Connection>, internal:Array<Connection>} = {source:[], target:[], internal:[]}
    manager:GroupManager<E>

    id:string

    readonly elId:string

    constructor(public instance:JsPlumbInstance, el:E, options:GroupOptions) {
        super(instance, el)
        const jel = this.el as unknown as jsPlumbElement<E>

        jel._isJsPlumbGroup = true
        jel._jsPlumbGroup = this

        this.elId = instance.getId(el)

        this.orphan = options.orphan === true

        this.revert = this.orphan === true ? false : options.revert !== false
        this.droppable = options.droppable !== false
        this.ghost = options.ghost === true
        this.enabled = options.enabled !== false

        this.prune = this.orphan !== true && options.prune === true

        this.constrain = this.ghost || (options.constrain === true)
        this.proxied = options.proxied !== false
        this.id = options.id || uuid()
        this.dropOverride = options.dropOverride === true
        this.anchor = options.anchor
        this.endpoint = options.endpoint
        this.anchor = options.anchor

        instance.setAttribute(el, Constants.ATTRIBUTE_GROUP, "")
    }

    get contentArea():any {
        return this.instance.getGroupContentArea(this)
    }

    overrideDrop(el:any, targetGroup:UIGroup<E>):boolean {
        return this.dropOverride && (this.revert || this.prune || this.orphan)
    }

    // this function, and getEndpoint below, are stubs for a future setup in which we can choose endpoint
    // and anchor based upon the connection and the index (source/target) of the endpoint to be proxied.
    getAnchor (conn:Connection, endpointIndex:number):AnchorSpec {
        return this.anchor || "Continuous"
    }

    getEndpoint (conn:Connection, endpointIndex:number):EndpointSpec {
        return this.endpoint || { type:DotEndpoint.type, options:{ radius:10 }}
    }

    add(_el:E, doNotFireEvent?:boolean):void {
        const dragArea = this.instance.getGroupContentArea(this)
        const __el = _el as unknown as jsPlumbElement<E>
        //this.instance.each(_el, (__el:any) => {

            if (__el._jsPlumbParentGroup != null) {
                if (__el._jsPlumbParentGroup === this) {
                    return
                } else {
                    __el._jsPlumbParentGroup.remove(_el, true, doNotFireEvent, false)
                }
            }

            __el._jsPlumbParentGroup = this
            this.children.push(new UINode<E>(this.instance, _el))
            this.instance._appendElement(__el, dragArea)
       // })

        this.manager._updateConnectionsForGroup(this)
    }

    private resolveNode(el:E) {
        return el == null ? null : getWithFunction(this.children, (u:UINode<E>) => u.el === el)
    }

    remove (el:E, manipulateDOM?:boolean, doNotFireEvent?:boolean, doNotUpdateConnections?:boolean, targetGroup?:UIGroup<E>) {

        const uiNode = this.resolveNode(el)
        if (uiNode != null) {
            this._doRemove(uiNode, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup)
        }
    }

    private _doRemove(child:UINode<E>, manipulateDOM?:boolean, doNotFireEvent?:boolean, doNotUpdateConnections?:boolean, targetGroup?:UIGroup<E>) {

        const __el = child.el as unknown as jsPlumbElement<E>

        delete __el._jsPlumbParentGroup

        removeWithFunction(this.children, (e:UINode<E>) => {
            return e === child
        })

        // TODO this knows about DOM
        if (manipulateDOM) {
            try { (<any>this.instance.getGroupContentArea(this)).removeChild(__el); }
            catch (e) {
                log("Could not remove element from Group " + e)
            }
        }
        if (!doNotFireEvent) {
            const p = {group: this, el: __el}
            if (targetGroup) {
                (<any>p).targetGroup = targetGroup
            }
            this.instance.fire(Constants.EVENT_GROUP_MEMBER_REMOVED, p)
        }
        if (!doNotUpdateConnections) {
            this.manager._updateConnectionsForGroup(this)
        }
    }

    removeAll(manipulateDOM?:boolean, doNotFireEvent?:boolean):void {
        for (let i = 0, l = this.children.length; i < l; i++) {
            let child:UINode<E> = this.children[0]
            this._doRemove(child, manipulateDOM, doNotFireEvent, true)
            this.instance.unmanage(child.el, true)
        }
        this.children.length = 0
        this.manager._updateConnectionsForGroup(this)
    }

    orphanAll ():Record<string, PointXY> {

        let orphanedPositions:Record<string, PointXY> = {}

        for (let i = 0; i < this.children.length; i++) {
            let newPosition = this.manager.orphan(this.children[i].el, false)
            orphanedPositions[newPosition.id] = newPosition.pos
        }
        this.children.length = 0

        return orphanedPositions
    }

    addGroup(group:UIGroup<E>):boolean {

        if (this.instance.allowNestedGroups && group !== this) {

            if (this.instance.groupManager.isAncestor(this, group)) {
                return false; // cannot add a group as a child to this group if it is an ancestor of this group.
            }

            // TODO what happens if the group is a member of another group?
            if (group.group != null) {
                group.group.removeGroup(group)
            }

            const groupElId = this.instance.getId(group.el)
            const entry = this.instance.getManagedElements()[groupElId]
            entry.group = this.elId
            const elpos = this.instance.getOffsetRelativeToRoot(group.el)
            const cpos = this.collapsed ? this.instance.getOffsetRelativeToRoot(this.el) : this.instance.getOffsetRelativeToRoot(this.instance.getGroupContentArea(this));

            (group.el as unknown as jsPlumbElement<E>)._jsPlumbParentGroup = this

            this.children.push(group)

            this.instance._appendElementToGroup(this, group.el)

            group.group = this
            let newPosition = {x: elpos.x - cpos.x, y: elpos.y - cpos.y}

            this.instance.setPosition(group.el, newPosition)

            this.instance.fire(Constants.EVENT_NESTED_GROUP_ADDED, {
                parent:this,
                child:group
            })

            return true
        } else {
            // console log?
            return false
        }
    }

    removeGroup(group:UIGroup<E>):void {
        if (group.group === this) {
            const jel = group.el as unknown as jsPlumbElement<E>

            const d = this.instance.getGroupContentArea(this)
            if (d === jel.parentNode) {
                d.removeChild(group.el)
            }

            // clear the `group` flag for this group in managed elements.
            const groupElId = this.instance.getId(group.el)
            const entry = this.instance.getManagedElements()[groupElId]
            if (entry) {
                delete entry.group
            }

            this.children = this.children.filter((cg:UIGroup<E>) => cg.id !== group.id)
            delete group.group
            delete jel._jsPlumbParentGroup
            this.instance.fire(Constants.EVENT_NESTED_GROUP_REMOVED, {
                parent:this,
                child:group
            })
        }
    }

    getGroups():Array<UIGroup<E>> {
        return this.children.filter((cg:UINode<E>) => {
            return cg.constructor === UIGroup
        }) as Array<UIGroup<E>>
    }

    getNodes():Array<UINode<E>> {
        return this.children.filter((cg:UINode<E>) => {
            return cg.constructor === UINode
        }) as Array<UINode<E>>
    }

    get collapseParent():UIGroup<E> {
        let cg:UIGroup<E> = null
        if (this.group == null) {
            return null
        } else {
            let g = this.group
            while(g != null) {
                if (g.collapsed) {
                    cg = g
                }
                g = g.group
            }
            return cg
        }
    }

}

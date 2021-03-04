
import { Dictionary, PointXY} from '../common'
import { JsPlumbInstance } from "../core"
import { Connection } from '../connector/connection-impl'
import { AnchorSpec } from "../factory/anchor-factory"
import { ContinuousAnchor} from "../anchor/continuous-anchor"
import { DotEndpoint } from "../endpoint/dot-endpoint"
import { EndpointSpec} from "../endpoint/endpoint"
import { GroupManager } from "../group/group-manager"
import { removeWithFunction, uuid, log } from '../util'

import * as Constants from "../constants"

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
    constructor(public instance:JsPlumbInstance, public el:any) { }
}

export class UIGroup<E = any> extends UINode<E> {

    children:Array<E> = []
    childGroups:Array<UIGroup<E>> = []

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

    connections:{source:Array<Connection>, target:Array<Connection>, internal:Array<Connection>} = {source:[], target:[], internal:[]}
    groups:Array<UIGroup<E>> = []

    manager:GroupManager<E>

    id:string

    readonly elId:string

    constructor(public instance:JsPlumbInstance, el:E, options:GroupOptions) {
        super(instance, el)

        this.el[Constants.IS_GROUP_KEY] = true
        this.el[Constants.GROUP_KEY] = this

        this.elId = instance.getId(el)

        this.revert = options.revert !== false
        this.droppable = options.droppable !== false
        this.ghost = options.ghost === true
        this.enabled = options.enabled !== false
        this.orphan = options.orphan === true
        this.prune = options.prune === true
        this.constrain = this.ghost || (options.constrain === true)
        this.proxied = options.proxied !== false
        this.id = options.id || uuid()
        this.dropOverride = options.dropOverride === true
        this.anchor = options.anchor
        this.endpoint = options.endpoint
        this.anchor = options.anchor

        instance.setAttribute(el, Constants.ATTRIBUTE_GROUP, "")
    }

    overrideDrop(el:any, targetGroup:UIGroup<E>):boolean {
        return this.dropOverride && (this.revert || this.prune || this.orphan)
    }

    getContentArea():any {
        let da = this.instance.getSelector(this.el, Constants.SELECTOR_GROUP_CONTAINER)
        return da && da.length > 0 ? da[0] : this.el
    }

    // this function, and getEndpoint below, are stubs for a future setup in which we can choose endpoint
    // and anchor based upon the connection and the index (source/target) of the endpoint to be proxied.
    getAnchor (conn:Connection, endpointIndex:number):AnchorSpec {
        return this.anchor || ContinuousAnchor.type
    }

    getEndpoint (conn:Connection, endpointIndex:number):EndpointSpec {
        return this.endpoint || { type:DotEndpoint.type, options:{ radius:10 }}
    }

    add(_el:any, doNotFireEvent?:boolean):void {
        const dragArea = this.getContentArea()
        this.instance.each(_el, (__el:any) => {

            if (__el[Constants.PARENT_GROUP_KEY] != null) {
                if (__el[Constants.PARENT_GROUP_KEY] === this) {
                    return
                } else {
                    __el[Constants.PARENT_GROUP_KEY].remove(__el, true, doNotFireEvent, false)
                }
            }

            __el[Constants.PARENT_GROUP_KEY] = this
            this.children.push(__el)
            this.manager.instance.appendElement(__el, dragArea)
        })

        this.manager._updateConnectionsForGroup(this)
    }

    remove (el:E | Array<E>, manipulateDOM?:boolean, doNotFireEvent?:boolean, doNotUpdateConnections?:boolean, targetGroup?:UIGroup<E>) {

        this.instance.each(el, (__el:any) => {
            delete __el[Constants.PARENT_GROUP_KEY]
            removeWithFunction(this.children, (e:any) => {
                return e === __el
            })

            if (manipulateDOM) {
                try { (<any>this.getContentArea()).removeChild(__el); }
                catch (e) {
                    log("Could not remove element from Group " + e)
                }
            }
            if (!doNotFireEvent) {
                const p = {group: this, el: __el}
                if (targetGroup) {
                    (<any>p).targetGroup = targetGroup
                }
                this.manager.instance.fire(Constants.EVENT_GROUP_MEMBER_REMOVED, p)
            }
        })
        if (!doNotUpdateConnections) {
            this.manager._updateConnectionsForGroup(this)
        }
    }

    removeAll(manipulateDOM?:boolean, doNotFireEvent?:boolean):void {
        for (let i = 0, l = this.children.length; i < l; i++) {
            let el = this.children[0]
            this.remove(el, manipulateDOM, doNotFireEvent, true)
            this.manager.instance.removeElement(el)
        }
        this.children.length = 0
        this.manager._updateConnectionsForGroup(this)
    }

    orphanAll ():Dictionary<PointXY> {

        let orphanedPositions:Dictionary<PointXY> = {}

        for (let i = 0; i < this.children.length; i++) {
            let newPosition = this.manager.orphan(this.children[i])
            orphanedPositions[newPosition[0]] = newPosition[1]
        }
        this.children.length = 0

        for (let i = 0; i < this.childGroups.length; i++) {
            let newPosition = this.manager.orphan(this.childGroups[i].el)
            orphanedPositions[newPosition[0]] = newPosition[1]
        }

        this.childGroups.length = 0

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
            const cpos = this.collapsed ? this.instance.getOffsetRelativeToRoot(this.el) : this.instance.getOffsetRelativeToRoot(this.getContentArea())

            group.el[Constants.PARENT_GROUP_KEY] = this

            this.childGroups.push(group)

            this.instance.appendElement(group.el, this.getContentArea())

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
            const d = this.getContentArea()
            if (d === group.el.parentNode) {
                d.removeChild(group.el)
            }

            // clear the `group` flag for this group in managed elements.
            const groupElId = this.instance.getId(group.el)
            const entry = this.instance.getManagedElements()[groupElId]
            if (entry) {
                delete entry.group
            }

            this.childGroups = this.childGroups.filter((cg:UIGroup<E>) => cg.id !== group.id)
            delete group.group
            delete group.el._jsPlumbParentGroup
            this.instance.fire(Constants.EVENT_NESTED_GROUP_REMOVED, {
                parent:this,
                child:group
            })
        }
    }

    getGroups():Array<UIGroup<E>> {
        return this.childGroups
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

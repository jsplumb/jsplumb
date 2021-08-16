import {
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER,
    CLASS_DRAGGED,
    DragHandler
} from "./drag-manager"

import {
    EVENT_DRAG_MOVE, EVENT_DRAG_START,
    EVENT_DRAG_STOP
} from './constants'

import {BrowserJsPlumbInstance, DragGroupSpec} from "./browser-jsplumb-instance"
import { jsPlumbDOMElement} from './element-facade'

import {DragEventParams, Drag, DragStopEventParams, isInsideParent} from "./collicat"
import {
    JsPlumbInstance,
    RedrawResult,
    UIGroup,
    SELECTOR_MANAGED_ELEMENT,
    ATTRIBUTE_NOT_DRAGGABLE,
    CLASS_OVERLAY, cls
} from "@jsplumb/core"

import { FALSE } from "@jsplumb/common"

import {
    BoundingBox,
    Dictionary,
    isString,
    forEach,
    getFromSetWithFunction,
    PointXY,
    Size,
    intersects
} from "@jsplumb/util"
import {DragSelection} from "./drag-selection"

export type IntersectingGroup = {
    groupLoc:GroupLocation
    d:number
    intersectingElement:Element
}

export type GroupLocation = {
    el:Element
    r: BoundingBox
    group: UIGroup<Element>
}

type DragGroupMemberSpec = { el:jsPlumbDOMElement, elId:string, active:boolean }
type DragGroup = { id:string, members:Set<DragGroupMemberSpec>}

/**
 * Base payload for drag events. Contains the element being dragged, the corresponding mouse event, the current position, and the position when drag started.
 */
export interface DragPayload {
    el:Element
    e:Event
    pos:PointXY
    originalPosition:PointXY
    payload?:Record<string, any>
}

/**
 * Payload for `drag:stop` event. In addition to the base payload, contains a redraw result object, listing all the connections and endpoints that were affected by the drag.
 */
export interface DragStopPayload extends DragPayload {
    r:RedrawResult
    dropGroup?:UIGroup<Element>
    originalGroup?:UIGroup<Element>
    //draggedOutOfGroup:boolean
}

/**
 * Payload for `drag:move` event.
 */
export interface DragMovePayload extends DragPayload { }

/**
 * Payload for `drag:start` event.
 */
export interface DragStartPayload extends DragPayload { }

function decodeDragGroupSpec(instance:JsPlumbInstance, spec:DragGroupSpec):{id:string, active:boolean} {

    if (isString(spec)) {
        return { id:spec as string, active:true }
    } else {
        return {
            id:instance.getId(spec as any),
            active:(spec as any).active
        }
    }
}

function isActiveDragGroupMember(dragGroup:DragGroup, el:HTMLElement): boolean {
    const details = getFromSetWithFunction(dragGroup.members, (m:DragGroupMemberSpec) => m.el === el)
    if (details !== null) {
        return details.active === true
    } else {
        return false
    }
}

export class ElementDragHandler implements DragHandler {

    selector: string = "> " + SELECTOR_MANAGED_ELEMENT + ":not(" + cls(CLASS_OVERLAY) + ")"
    private _dragOffset:PointXY = null

    private _groupLocations:Array<GroupLocation> = []

    protected _intersectingGroups:Array<IntersectingGroup> = []
    private _currentDragParentGroup:UIGroup<Element> = null

    private _dragGroupByElementIdMap:Dictionary<DragGroup> = {}
    private _dragGroupMap:Dictionary<DragGroup> = {}

    private _currentDragGroup:DragGroup = null
    private _currentDragGroupOffsets:Map<string, [PointXY, jsPlumbDOMElement]> = new Map()
    private _currentDragGroupSizes:Map<string, Size> = new Map()

    private _dragPayload:Record<string, any> = null

    protected drag:Drag
    originalPosition:PointXY

    constructor(protected instance:BrowserJsPlumbInstance, protected _dragSelection:DragSelection) {}

    onDragInit(el:Element):Element { return null; }
    onDragAbort(el: Element):void {
        return null
    }

    //
    //
    //
    protected getDropGroup():IntersectingGroup|null {
        // figure out if there is a group that we're hovering on.
        let dropGroup:IntersectingGroup = null
        if (this._intersectingGroups.length > 0) {
            // we only support one for the time being
            let targetGroup = this._intersectingGroups[0].groupLoc.group
            let intersectingElement = this._intersectingGroups[0].intersectingElement as jsPlumbDOMElement

            let currentGroup = intersectingElement._jsPlumbParentGroup

            if (currentGroup !== targetGroup) {
                if (currentGroup == null || !currentGroup.overrideDrop(intersectingElement, targetGroup)) {
                    dropGroup = this._intersectingGroups[0]
                }
            }
        }
        return dropGroup
    }

    onStop(params:DragStopEventParams, draggedOutOfGroup?:boolean, originalGroup?:UIGroup, dropGroup?:IntersectingGroup):void {

        const dragElement = params.drag.getDragElement()

        dropGroup = dropGroup || this.getDropGroup()

        // add the element(s) to the group
        if (dropGroup != null) {
            this.instance.groupManager.addToGroup(dropGroup.groupLoc.group, false, dropGroup.intersectingElement)

            this._dragSelection.each((el, id, o, s) => {
                if (el !== params.el) {
                    this.instance.groupManager.addToGroup(dropGroup.groupLoc.group, false, el)
                }
            })
        }

        /**
         * Sets the final position of a given element, fires a drag stop event, and removes drag classes from the element.
         * @param _el
         * @param pos
         * @private
         */
        const _one = (_el:Element, pos:PointXY, originalGroup?:UIGroup, dropGroup?:IntersectingGroup) => {

            const redrawResult = this.instance.setElementPosition(_el, pos.x, pos.y)

            this.instance.fire<DragStopPayload>(EVENT_DRAG_STOP, {
                el:_el,
                e:params.e,
                pos:pos,
                r:redrawResult,
                originalPosition:this.originalPosition,
                dropGroup: dropGroup != null ? dropGroup.groupLoc.group : null,
                originalGroup,
                payload:this._dragPayload,
                //draggedOutOfGroup
            })

            this.instance.removeClass(_el, CLASS_DRAGGED)
            this.instance.select({source: _el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true)
            this.instance.select({target: _el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true)

        }

        // set position of main drag element, fire event etc
        _one(dragElement,  params.finalPos, originalGroup, dropGroup)

        // compute the final positions for all the other elements in the drag, fire events etc.
        this._dragSelection.each((el:jsPlumbDOMElement, id:string, o:PointXY, s:Size) => {
            if (el !== params.el) {
                const pp = {
                    x:params.finalPos.x + o.x,
                    y:params.finalPos.y + o.y
                }
                _one(el, pp, el._jsPlumbParentGroup, dropGroup)
            }
        })

        this._cleanup()
    }

    private _cleanup() {
        forEach(this._groupLocations,(groupLoc:GroupLocation) => {
            this.instance.removeClass(groupLoc.el, CLASS_DRAG_ACTIVE)
            this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER)
        })

        this._currentDragParentGroup = null
        this._groupLocations.length = 0
        this.instance.hoverSuspended = false

        this._dragOffset = null

        this._dragSelection.reset()

        this._dragPayload = null

        this._currentDragGroupOffsets.clear()
        this._currentDragGroupSizes.clear()

        this._currentDragGroup = null
    }

    reset() { }

    init(drag:Drag) {
        this.drag = drag
    }

    onDrag(params:DragEventParams):void {

        const el = params.drag.getDragElement()
        const finalPos = params.pos
        const elSize = this.instance.getSize(el)
        const ui = { x:finalPos.x, y:finalPos.y }

        this._intersectingGroups.length = 0

        if (this._dragOffset != null) {
            ui.x += this._dragOffset.x
            ui.y += this._dragOffset.y
        }

        const _one = (el:HTMLElement, bounds:BoundingBox, e:Event) => {

            // keep track of the ancestors of each intersecting group we find.
            const ancestorsOfIntersectingGroups = new Set<string>()

            forEach(this._groupLocations,(groupLoc:GroupLocation) => {
                if (!ancestorsOfIntersectingGroups.has(groupLoc.group.id) && intersects(bounds, groupLoc.r)) {

                    // when a group intersects it should only get the hover class if one of its descendants does not also intersect.
                    // groupLocations is already sorted by level of nesting

                    // we don't add the css class to the current group (but we do still add the group to the list of intersecting groups)
                    if (groupLoc.group !== this._currentDragParentGroup) {
                        this.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER)
                    }

                    this._intersectingGroups.push({
                        groupLoc,
                        intersectingElement:params.drag.getDragElement(true),
                        d:0
                    })

                    // store all this group's ancestor ids in a set, which will preclude them from being added as an intersecting group
                    forEach(this.instance.groupManager.getAncestors(groupLoc.group),(g:UIGroup<Element>) => ancestorsOfIntersectingGroups.add(g.id))

                } else {
                    this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER)
                }
            })

            this.instance.setElementPosition(el, bounds.x, bounds.y)

            this.instance.fire<DragMovePayload>(EVENT_DRAG_MOVE, {
                el:el,
                e:params.e,
                pos:{x:bounds.x,y:bounds.y},
                originalPosition:this.originalPosition,
                payload:this._dragPayload
            })
        }

        const elBounds:BoundingBox = { x:ui.x, y:ui.y, w:elSize.w, h:elSize.h }
        _one(el, elBounds, params.e)

        this._dragSelection.positionElements(elBounds, (el:jsPlumbDOMElement, id:string, s:Size, b:BoundingBox)=>{
            _one(el, b, params.e)
        })

        this._currentDragGroupOffsets.forEach((v:[PointXY, jsPlumbDOMElement], k:string) => {
            const s = this._currentDragGroupSizes.get(k)
            let _b:BoundingBox = {x:elBounds.x + v[0].x, y:elBounds.y + v[0].y, w:s.w, h:s.h}
            v[1].style.left = _b.x + "px"
            v[1].style.top = _b.y + "px"
            _one(v[1], _b, params.e)
        })

    }

    onStart(params:{e:MouseEvent, el:jsPlumbDOMElement, pos:PointXY, drag:Drag}):boolean {

        const el = params.drag.getDragElement() as jsPlumbDOMElement
        const elOffset = this.instance.getOffset(el)

        this.originalPosition = {x:params.pos.x, y:params.pos.y}

        if (el._jsPlumbParentGroup) {
            this._dragOffset = this.instance.getOffset(el.offsetParent)
            this._currentDragParentGroup = el._jsPlumbParentGroup
        }

        let cont = true
        let nd = el.getAttribute(ATTRIBUTE_NOT_DRAGGABLE)
        if (this.instance.elementsDraggable === false || (nd != null && nd !== FALSE)) {
            cont = false
        }

        if (cont) {

            this._groupLocations.length = 0
            this._intersectingGroups.length = 0
            this.instance.hoverSuspended = true

            // refresh the drag selection offsets
            this._dragSelection.refreshOffsets(elOffset)

            const _one = (_el:jsPlumbDOMElement):any => {

                // if drag el not a group
                if (!_el._isJsPlumbGroup || this.instance.allowNestedGroups) {

                    const isNotInAGroup = !_el._jsPlumbParentGroup
                    const membersAreDroppable = isNotInAGroup || _el._jsPlumbParentGroup.dropOverride !== true
                    const isGhostOrNotConstrained = !isNotInAGroup && (_el._jsPlumbParentGroup.ghost || _el._jsPlumbParentGroup.constrain !== true)

                    // in order that there could be other groups this element can be dragged to, it must satisfy these conditions:
                    // it's not in a group, OR
                    // it hasn't mandated its elements can't be dropped on other groups
                    // it hasn't mandated its elements are constrained to the group, unless ghost proxying is turned on.

                    if (isNotInAGroup || (membersAreDroppable && isGhostOrNotConstrained)) {

                        forEach(this.instance.groupManager.getGroups(), (group: UIGroup<Element>) => {
                            // prepare a list of potential droppable groups.

                            // get the group pertaining to the dragged element. this is null if the element being dragged is not a UIGroup.
                            const elementGroup = _el._jsPlumbGroup as UIGroup<Element>

                            if (group.droppable !== false && group.enabled !== false && _el._jsPlumbGroup !== group && !this.instance.groupManager.isDescendant(group, elementGroup)) {
                                let groupEl = group.el,
                                    s = this.instance.getSize(groupEl),
                                    o = this.instance.getOffset(groupEl),
                                    boundingRect = {x: o.x, y: o.y, w: s.w, h: s.h}

                                const groupLocation = {el: groupEl, r: boundingRect, group: group}
                                this._groupLocations.push(groupLocation)

                                // dont add the active class to the element/group's current parent (if any)
                                if (group !== this._currentDragParentGroup) {
                                    this.instance.addClass(groupEl, CLASS_DRAG_ACTIVE)
                                }
                            }
                        })
                        // sort group locations so that nested groups will be processed first in a drop
                        this._groupLocations.sort((a:GroupLocation, b:GroupLocation) => {
                            if (this.instance.groupManager.isDescendant(a.group, b.group)) {
                                return -1
                            } else if (this.instance.groupManager.isAncestor(b.group, a.group)) {
                                return 1
                            } else {
                                return 0
                            }
                        })
                    }
                }

                this.instance.select({source: _el}).addClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true)
                this.instance.select({target: _el}).addClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true)

                // if this event listener returns false it will be piped all the way back to the drag manager and cause
                // the drag to be aborted.
                return this.instance.fire<DragStartPayload>(EVENT_DRAG_START, {
                    el:_el,
                    e:params.e,
                    originalPosition:this.originalPosition,
                    pos:this.originalPosition
                })
            }

            const elId = this.instance.getId(el)
            this._currentDragGroup = this._dragGroupByElementIdMap[elId]
            if (this._currentDragGroup && !isActiveDragGroupMember(this._currentDragGroup, el)) {
                // clear the current dragGroup if this element is not an active member, ie. cannot instigate a drag for all members.
                this._currentDragGroup = null
            }

            const dragStartReturn = _one(el);      // process the original drag element.
            if (dragStartReturn === false) {
                this._cleanup()
                return false
            } else {
                this._dragPayload = dragStartReturn
            }

            if (this._currentDragGroup != null) {
                this._currentDragGroupOffsets.clear()
                this._currentDragGroupSizes.clear()
                this._currentDragGroup.members.forEach((jel:DragGroupMemberSpec) => {
                    let off = this.instance.getOffset(jel.el)
                    this._currentDragGroupOffsets.set(jel.elId, [ { x:off.x- elOffset.x, y:off.y - elOffset.y}, jel.el as jsPlumbDOMElement])
                    this._currentDragGroupSizes.set(jel.elId, this.instance.getSize(jel.el))
                    _one(jel.el)
                })
            }
        }
        return cont
    }

    addToDragGroup(spec:DragGroupSpec, ...els:Array<Element>) {

        const details = decodeDragGroupSpec(this.instance, spec)
        let dragGroup = this._dragGroupMap[details.id]
        if (dragGroup == null) {
            dragGroup = { id: details.id, members: new Set<DragGroupMemberSpec>()}
            this._dragGroupMap[details.id] = dragGroup
        }

        this.removeFromDragGroup(...els)

        forEach(els,(el:Element) => {
            const elId = this.instance.getId(el)
            dragGroup.members.add({elId:elId, el:el as jsPlumbDOMElement, active:details.active})
            this._dragGroupByElementIdMap[elId] = dragGroup
        })
    }

    removeFromDragGroup(...els:Array<Element>) {
        forEach(els,(el:Element) => {
            const id = this.instance.getId(el)
            const dragGroup = this._dragGroupByElementIdMap[id]
            if (dragGroup != null) {
                const s = new Set<DragGroupMemberSpec>()
                dragGroup.members.forEach((member) => {
                    if (member.el !== el) {
                        s.add(member)
                    }
                })
                dragGroup.members = s

                delete this._dragGroupByElementIdMap[id]
            }
        })
    }

    setDragGroupState (state:boolean, ...els:Array<Element>) {
        const elementIds = els.map(el => this.instance.getId(el))
        forEach(elementIds,(id:string) => {
            const dragGroup = this._dragGroupByElementIdMap[id]
            if (dragGroup != null) {
                const member = getFromSetWithFunction(dragGroup.members,(m:DragGroupMemberSpec) => m.elId === id)
                if (member != null) {
                    member.active = state
                }
            }
        })
    }

    /**
     * Perhaps prune or orphan the element represented by the given drag params.
     * @param params
     * @param doNotTransferToAncestor Used when dealing with nested groups. When true, it means remove the element from any groups; when false, which is
     * the default, elements that are orphaned will be added to this group's ancestor, if it has one.
     * @param isDefinitelyNotInsideParent Used internally when this method is called and we've already done an intersections test. This flag saves us repeating the calculation.
     * @private
     */
    protected _pruneOrOrphan(params:DragStopEventParams, doNotTransferToAncestor:boolean, isDefinitelyNotInsideParent:boolean):[string, PointXY] {

        const jel = params.el as unknown as jsPlumbDOMElement
        let orphanedPosition = null
        if (isDefinitelyNotInsideParent || !isInsideParent(this.instance, jel, params.pos)) {
            let group = jel._jsPlumbParentGroup
            if (group.prune) {
                if (jel._isJsPlumbGroup) {
                    // remove the group from the instance
                    this.instance.removeGroup(jel._jsPlumbGroup)
                } else {
                    // instruct the group to remove the element from itself and also from the DOM.
                    group.remove(params.el, true)
                }

            } else if (group.orphan) {
                orphanedPosition = this.instance.groupManager.orphan(params.el, doNotTransferToAncestor)
                if (jel._isJsPlumbGroup) {
                    // remove the nested group from the parent
                    group.removeGroup(jel._jsPlumbGroup)
                } else {
                    // remove the element from the group's DOM element.
                    group.remove(params.el)
                }

            }
        }

        return orphanedPosition
    }

}

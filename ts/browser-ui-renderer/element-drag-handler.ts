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
    BoundingBox,
    isString,
    forEach,
    getFromSetWithFunction,
    PointXY,
    Size
} from "../util/util"
import {DragSelection} from "./drag-selection"
import {UIGroup} from "../core/group/group"
import {ATTRIBUTE_NOT_DRAGGABLE, CLASS_OVERLAY, cls, SELECTOR_MANAGED_ELEMENT} from "../core/constants"
import {intersects} from "../util/geom"
import {JsPlumbInstance} from "../core/core"
import {RedrawResult} from "../core/router/router"
import {FALSE} from "../common/index"

// // TODO would be nice to be able to set a tolerance here. "is half inside parent" etc
// function isInsideParent(instance:BrowserJsPlumbInstance, _el:HTMLElement, pos:PointXY):boolean {
//     const p = <any>_el.parentNode,
//         s = instance.getSize(p),
//         ss = instance.getSize(_el),
//         leftEdge = pos.x,
//         rightEdge = leftEdge + ss.w,
//         topEdge = pos.y,
//         bottomEdge = topEdge + ss.h
//
//     return rightEdge > 0 && leftEdge < s.w && bottomEdge > 0 && topEdge < s.h
// }

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

export type DraggedElement = {el:jsPlumbDOMElement, id:string, pos:PointXY, originalPos:PointXY, originalGroup:UIGroup, redrawResult:RedrawResult, reverted:boolean, dropGroup:UIGroup}

/**
 * Payload for `drag:stop` event. In addition to the base payload, contains a redraw result object, listing all the connections and endpoints that were affected by the drag.
 * @public
 */
export interface DragStopPayload {
    elements:Array<DraggedElement>
    e:Event
    el:Element
    payload?:Record<string, any>
}

/**
 * Payload for `drag:move` event.
 * @public
 */
export interface DragMovePayload extends DragPayload { }

/**
 * Payload for `drag:start` event.
 * @public
 */
export interface DragStartPayload extends DragPayload {
    dragGroup?:DragGroup
    dragGroupMemberSpec?:DragGroupMemberSpec
}

/**
 * @internal
 * @param instance
 * @param spec
 */
function decodeDragGroupSpec(instance:JsPlumbInstance, spec:DragGroupSpec):{id:string, active:boolean} {

    if (isString(spec)) {
        return { id:spec as string, active:true }
    } else {
        return {
            id:(spec as any).id,
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

function getAncestors(el:jsPlumbDOMElement):Array<Element> {
    const ancestors:Array<Element> = []
    let p = el._jsPlumbParentGroup
    while (p != null) {
        ancestors.push(p.el)
        p = p.group
    }
    return ancestors
}

export class ElementDragHandler implements DragHandler {

    selector: string = "> " + SELECTOR_MANAGED_ELEMENT + ":not(" + cls(CLASS_OVERLAY) + ")"
    private _dragOffset:PointXY = null

    private _groupLocations:Array<GroupLocation> = []

    protected _intersectingGroups:Array<IntersectingGroup> = []
    private _currentDragParentGroup:UIGroup<Element> = null

    private _dragGroupByElementIdMap:Record<string, DragGroup> = {}
    private _dragGroupMap:Record<string, DragGroup> = {}

    private _currentDragGroup:DragGroup = null
    private _currentDragGroupOffsets:Map<string, [PointXY, jsPlumbDOMElement]> = new Map()
    private _currentDragGroupSizes:Map<string, Size> = new Map()
    private _currentDragGroupOriginalPositions:Map<string, PointXY> = new Map()

    private _dragPayload:Record<string, any> = null

    protected drag:Drag
    originalPosition:PointXY

    constructor(protected instance:BrowserJsPlumbInstance, protected _dragSelection:DragSelection) {}

    onDragInit(el:Element):Element { return null; }
    onDragAbort(el: Element):void { return null }

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

    onStop(params:DragStopEventParams):void {

        const jel = params.drag.getDragElement() as unknown as jsPlumbDOMElement

        let dropGroup:IntersectingGroup = this.getDropGroup()

        /*
        we have `dropGroup`, which is the group that the focus element was perhaps dropped on. we now need to create a list of
        elements to process, with their element, id, and offset.
         */
        const elementsToProcess:Array<DraggedElement> = []
        elementsToProcess.push({
            el:jel,
            id:this.instance.getId(jel),
            pos:params.finalPos,
            originalGroup:jel._jsPlumbParentGroup,
            redrawResult:null,
            originalPos:params.originalPos,
            reverted:false,
            dropGroup:dropGroup != null ? dropGroup.groupLoc.group : null
        })

        function addElementToProcess(el:jsPlumbDOMElement, id:string, currentPos:PointXY, s:Size, originalPosition:PointXY) {
            let x = currentPos.x, y = currentPos.y

            // TODO this is duplicated in dragSelection's update offsets method.
            // and of course in the group drag constrain args in the jsplumb constructor
            if (el._jsPlumbParentGroup && el._jsPlumbParentGroup.constrain) {

                // TODO not SVG safe (offsetWidth / offsetHeight)
                const constrainRect = {
                    w: el.parentNode.offsetWidth + el.parentNode.scrollLeft,
                    h: el.parentNode.offsetHeight + el.parentNode.scrollTop
                };

                x = Math.max(x, 0)
                y = Math.max(y, 0)
                x = Math.min(x, constrainRect.w - s.w)
                y = Math.min(y, constrainRect.h - s.h)

                currentPos.x = x
                currentPos.y = y
            }

            elementsToProcess.push({
                el,
                id,
                pos:currentPos,
                originalPos:originalPosition,
                originalGroup:el._jsPlumbParentGroup,
                redrawResult:null,
                reverted:false,
                dropGroup:dropGroup?.groupLoc.group
            })
        }

        this._dragSelection.each((el:jsPlumbDOMElement, id:string, o:PointXY, s:Size, originalPosition:PointXY) => {
            if (el !== params.el) {
               addElementToProcess(el, id, { x:o.x, y:o.y }, s, originalPosition)
            }
        })

        this._currentDragGroup?.members.forEach((d:DragGroupMemberSpec) => {
            if (d.el !== params.el) {
                const offset = this._currentDragGroupOffsets.get(d.elId)
                const s = this._currentDragGroupSizes.get(d.elId)
                const pp = {
                    x:params.finalPos.x + offset[0].x,
                    y:params.finalPos.y + offset[0].y
                }

                addElementToProcess(d.el, d.elId, pp, s, this._currentDragGroupOriginalPositions.get(d.elId))
            }
        })

        // now we have a list of all the elements that have been dragged.

        forEach(elementsToProcess, (p:DraggedElement)=> {
            let wasInGroup = p.originalGroup != null,
                isInOriginalGroup = wasInGroup && isInsideParent(this.instance, p.el, p.pos),
                parentOffset = {x:0, y:0}


            if (wasInGroup && !isInOriginalGroup) {
                if (dropGroup == null) {
                    // the element may be pruned or orphaned by its group
                    const orphanedPosition = this._pruneOrOrphan(p, true, true)
                    if (orphanedPosition.pos != null) {
                        // if orphaned, update the drag end position.
                        p.pos = orphanedPosition.pos.pos
                    } else {
                        if (!orphanedPosition.pruned && p.originalGroup.revert) {
                            // if not pruned and the original group has revert set, revert the element.
                            p.pos = p.originalPos
                            p.reverted = true
                        }
                    }
                }
            } else if (wasInGroup && isInOriginalGroup) {
                parentOffset = this._computeOffsetByParentGroup(p.originalGroup) //this.instance.viewport.getPosition(p.originalGroup.elId)
            }

            if (dropGroup != null && !isInOriginalGroup) {
                this.instance.groupManager.addToGroup(dropGroup.groupLoc.group, false, p.el)
            } else {
                p.dropGroup = null
            }

            // if this element was reverted we have to set its position in the DOM.
            if (p.reverted) {
                this.instance.setPosition(p.el, p.pos)
            }
            // in all cases we update the viewport.
            p.redrawResult = this.instance.setElementPosition(p.el, p.pos.x + parentOffset.x, p.pos.y + parentOffset.y)

            this.instance.removeClass(p.el, CLASS_DRAGGED)
            this.instance.select({source: p.el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true)
            this.instance.select({target: p.el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true)

            // this is the ghost proxy code. ghosts wont have been created for anything other than the main element i think. this code could,
            // currently, go outside of this loop (which it is, below).
            // if (wasInGroup) {
            //     let currentGroup: UIGroup<Element> = jel._jsPlumbParentGroup
            //     if (currentGroup !== p.originalGroup) {
            //         const originalElement = params.drag.getDragElement(true)
            //         if (originalGroup.ghost) {
            //             const o1 = this.instance.getOffset(this.instance.getGroupContentArea(currentGroup))
            //             const o2 = this.instance.getOffset(this.instance.getGroupContentArea(originalGroup))
            //             const o = {x: o2.x + params.pos.x - o1.x, y: o2.y + params.pos.y - o1.y}
            //             originalElement.style.left = o.x + "px"
            //             originalElement.style.top = o.y + "px"
            //
            //             this.instance.revalidate(originalElement)
            //         }
            //     }
            // }
        })

        // ghost proxy - see above.
        if (elementsToProcess[0].originalGroup != null) {
            let currentGroup: UIGroup<Element> = jel._jsPlumbParentGroup
            if (currentGroup !== elementsToProcess[0].originalGroup) {
                const originalElement = params.drag.getDragElement(true)
                if (elementsToProcess[0].originalGroup.ghost) {
                    const o1 = this.instance.getPosition(this.instance.getGroupContentArea(currentGroup))
                    const o2 = this.instance.getPosition(this.instance.getGroupContentArea(elementsToProcess[0].originalGroup))
                    const o = {x: o2.x + params.pos.x - o1.x, y: o2.y + params.pos.y - o1.y}
                    originalElement.style.left = o.x + "px"
                    originalElement.style.top = o.y + "px"

                    this.instance.revalidate(originalElement)
                }
            }
        }

        this.instance.fire<DragStopPayload>(EVENT_DRAG_STOP, {
            elements:elementsToProcess,
            e:params.e,
            el:jel,
            payload:this._dragPayload
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
        this._currentDragGroupOriginalPositions.clear()

        this._currentDragGroup = null
    }

    reset() { }

    init(drag:Drag) {
        this.drag = drag
    }

    onDrag(params:DragEventParams):void {

        const el = params.drag.getDragElement()
        const id = this.instance.getId(el)
        const finalPos = params.pos
        const elSize = this.instance.viewport.getPosition(id)
        const ui = { x:finalPos.x, y:finalPos.y }

        this._intersectingGroups.length = 0

        if (this._dragOffset != null) {
            ui.x += this._dragOffset.x
            ui.y += this._dragOffset.y
        }

        const _one = (el:HTMLElement, bounds:BoundingBox, findIntersectingGroups:boolean) => {

            if (findIntersectingGroups) {
                // keep track of the ancestors of each intersecting group we find.
                const ancestorsOfIntersectingGroups = new Set<string>()

                forEach(this._groupLocations, (groupLoc: GroupLocation) => {
                    if (!ancestorsOfIntersectingGroups.has(groupLoc.group.id) && intersects(bounds, groupLoc.r)) {

                        // when a group intersects it should only get the hover class if one of its descendants does not also intersect.
                        // groupLocations is already sorted by level of nesting

                        // we don't add the css class to the current group (but we do still add the group to the list of intersecting groups)
                        if (groupLoc.group !== this._currentDragParentGroup) {
                            this.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER)
                        }

                        this._intersectingGroups.push({
                            groupLoc,
                            intersectingElement: params.drag.getDragElement(true),
                            d: 0
                        })

                        // store all this group's ancestor ids in a set, which will preclude them from being added as an intersecting group
                        forEach(this.instance.groupManager.getAncestors(groupLoc.group), (g: UIGroup<Element>) => ancestorsOfIntersectingGroups.add(g.id))

                    } else {
                        this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER)
                    }
                })
            }

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
        _one(el, elBounds, true)

        this._dragSelection.updatePositions(finalPos, this.originalPosition, (el:jsPlumbDOMElement, id:string, s:Size, b:BoundingBox)=>{
            _one(el, b, false)
        })

        this._currentDragGroupOffsets.forEach((v:[PointXY, jsPlumbDOMElement], k:string) => {
            const s = this._currentDragGroupSizes.get(k)
            let _b:BoundingBox = {x:elBounds.x + v[0].x, y:elBounds.y + v[0].y, w:s.w, h:s.h}
            v[1].style.left = _b.x + "px"
            v[1].style.top = _b.y + "px"
            _one(v[1], _b, false)
        })
    }

    private _computeOffsetByParentGroup(group:UIGroup<Element>) {
        const parentGroupOffset = this.instance.getPosition(group.el)
        const contentArea = group.contentArea
        if (contentArea !== group.el) {
            const caOffset = this.instance.getPosition(contentArea)
            parentGroupOffset.x += caOffset.x
            parentGroupOffset.y += caOffset.y
        }
        if ((group.el as any)._jsPlumbParentGroup) {
            const ancestorOffset = this._computeOffsetByParentGroup((group.el as any)._jsPlumbParentGroup)
            parentGroupOffset.x += ancestorOffset.x
            parentGroupOffset.y += ancestorOffset.y
        }
        return parentGroupOffset
    }

    onStart(params:{e:MouseEvent, el:jsPlumbDOMElement, pos:PointXY, drag:Drag}):boolean {

        const el = params.drag.getDragElement() as jsPlumbDOMElement
        const elOffset = this.instance.getPosition(el)

        this.originalPosition = {x:params.pos.x, y:params.pos.y}

        if (el._jsPlumbParentGroup) {
            this._dragOffset = this._computeOffsetByParentGroup(el._jsPlumbParentGroup)
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

            // get the drag element and find its descendants + ancestors. then filter the drag selection to mark any descendant or ancestor inactive,
            // as they should not drag when an ancestor of theirs is being dragged.
            const originalElement = params.drag.getDragElement(true),
                descendants = originalElement.querySelectorAll(SELECTOR_MANAGED_ELEMENT),
                ancestors = getAncestors(originalElement),
                a:Array<Element> = []

            Array.prototype.push.apply(a, descendants)
            Array.prototype.push.apply(a, ancestors)

            this._dragSelection.filterActiveSet((p:{id:string, jel:jsPlumbDOMElement}) => {
                return a.indexOf(p.jel) === -1
            })

            // ---------------

            // init the drag selection positions
            this._dragSelection.initialisePositions()

            const _one = (_el:jsPlumbDOMElement, dragGroup?:DragGroup, dragGroupMemberSpec?:DragGroupMemberSpec):any => {

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
                                    groupElId = this.instance.getId(groupEl),
                                    p = this.instance.viewport.getPosition(groupElId),
                                    boundingRect = {x: p.x, y: p.y, w: p.w, h: p.h}

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
                    pos:this.originalPosition,
                    dragGroup,
                    dragGroupMemberSpec
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
                    const vp = this.instance.viewport.getPosition(jel.elId)
                    this._currentDragGroupOffsets.set(jel.elId, [ { x:vp.x- elOffset.x, y:vp.y - elOffset.y}, jel.el as jsPlumbDOMElement])
                    this._currentDragGroupSizes.set(jel.elId, vp)
                    this._currentDragGroupOriginalPositions.set(jel.elId, {x:vp.x, y:vp.y})
                    _one(jel.el, this._currentDragGroup, jel)
                })
            }
        }
        return cont
    }

    /**
     * @internal
     */
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

    /**
     * @internal
     */
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

    /**
     * @internal
     */
    setDragGroupState (active:boolean, ...els:Array<Element>) {
        const elementIds = els.map(el => this.instance.getId(el))
        forEach(elementIds,(id:string) => {
            const dragGroup = this._dragGroupByElementIdMap[id]
            if (dragGroup != null) {
                const member = getFromSetWithFunction(dragGroup.members,(m:DragGroupMemberSpec) => m.elId === id)
                if (member != null) {
                    member.active = active
                }
            }
        })
    }

    /**
     * @internal
     * @param name
     */
    clearDragGroup(name:string) {
        const dragGroup = this._dragGroupMap[name]
        if (dragGroup != null) {
            dragGroup.members.forEach(member => {
                delete this._dragGroupByElementIdMap[member.elId]
            })

            dragGroup.members.clear()
        }

    }

    /**
     * Perhaps prune or orphan the element represented by the given drag params.
     * @param params
     * @param doNotTransferToAncestor Used when dealing with nested groups. When true, it means remove the element from any groups; when false, which is
     * the default, elements that are orphaned will be added to this group's ancestor, if it has one.
     * @param isDefinitelyNotInsideParent Used internally when this method is called and we've already done an intersections test. This flag saves us repeating the calculation.
     * @internal
     */
    private _pruneOrOrphan(params:{el:jsPlumbDOMElement, pos:PointXY }, doNotTransferToAncestor:boolean, isDefinitelyNotInsideParent:boolean):{pruned:boolean, pos?:{id:string, pos:PointXY}} {

        const jel = params.el as unknown as jsPlumbDOMElement
        let orphanedPosition = {pruned:false, pos:null as any}
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
                orphanedPosition.pruned = true

            } else if (group.orphan) {
                orphanedPosition.pos = this.instance.groupManager.orphan(params.el, doNotTransferToAncestor)
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

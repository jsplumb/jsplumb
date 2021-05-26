import {
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER, CLASS_DRAG_SELECTED,
    CLASS_DRAGGED,
    DragHandler,
    EVENT_DRAG_MOVE, EVENT_DRAG_START,
    EVENT_DRAG_STOP,
} from "./drag-manager"

import {BrowserJsPlumbInstance, DragGroupSpec} from "./browser-jsplumb-instance"
import { jsPlumbDOMElement} from './element-facade'

import {DragEventParams,Drag,DragStopEventParams} from "./collicat"
import {

    JsPlumbInstance,
    RedrawResult,
    UIGroup,
    intersects,
    SELECTOR_MANAGED_ELEMENT,
    ATTRIBUTE_NOT_DRAGGABLE,
    FALSE,
    CLASS_OVERLAY, cls
} from "@jsplumb/core"

import {
    BoundingBox,
    Dictionary,
    isString,
    forEach,
    getFromSetWithFunction,
    PointXY,
    Size
} from "@jsplumb/util"

type IntersectingGroup = {
    group:UIGroup<Element>
    d:number
    intersectingElement:Element
}

type GroupLocation = {
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
}

/**
 * Payload for `drag:stop` event. In addition to the base payload, contains a redraw result object, listing all the connections and endpoints that were affected by the drag.
 */
export interface DragStopPayload extends DragPayload {
    r:RedrawResult
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
    private _intersectingGroups:Array<IntersectingGroup> = []
    private _currentDragParentGroup:UIGroup<Element> = null

    private _dragGroupByElementIdMap:Dictionary<DragGroup> = {}
    private _dragGroupMap:Dictionary<DragGroup> = {}

    private _currentDragGroup:DragGroup = null
    private _currentDragGroupOffsets:Map<string, [PointXY, jsPlumbDOMElement]> = new Map()
    private _currentDragGroupSizes:Map<string, Size> = new Map()

    private _dragSelection: Array<jsPlumbDOMElement> = []
    private _dragSelectionOffsets:Map<string, [PointXY, jsPlumbDOMElement]> = new Map()
    private _dragSizes:Map<string, Size> = new Map()

    protected drag:Drag
    originalPosition:PointXY

    constructor(protected instance:BrowserJsPlumbInstance) {}

    onDragInit(el:Element):Element { return null; }
    onDragAbort(el: Element):void {
        return null
    }

    onStop(params:DragStopEventParams):void {

        const _one = (_el:Element, pos:PointXY) => {

            const redrawResult = this.instance.setElementPosition(_el, pos.x, pos.y)

            this.instance.fire<DragStopPayload>(EVENT_DRAG_STOP, {
                el:_el,
                e:params.e,
                pos:pos,
                r:redrawResult,
                originalPosition:this.originalPosition
            })

            this.instance.removeClass(_el, CLASS_DRAGGED)
            this.instance.select({source: _el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true)
            this.instance.select({target: _el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true)

        }

        const dragElement = params.drag.getDragElement()
        _one(dragElement,  params.finalPos)

        this._dragSelectionOffsets.forEach( (v:[PointXY, jsPlumbDOMElement], k:string) => {
            if (v[1] !== params.el) {
                const pp = {
                    x:params.finalPos.x + v[0].x,
                    y:params.finalPos.y + v[0].y
                }
                _one(v[1], pp)
            }
        })

        // do the contents of the drag selection

        if (this._intersectingGroups.length > 0) {
            // we only support one for the time being
            let targetGroup = this._intersectingGroups[0].group
            let intersectingElement = this._intersectingGroups[0].intersectingElement as jsPlumbDOMElement

            let currentGroup = intersectingElement._jsPlumbParentGroup

            if (currentGroup !== targetGroup) {
                if (currentGroup != null) {
                    if (currentGroup.overrideDrop(intersectingElement, targetGroup)) {
                        return
                    }
                }
                this.instance.groupManager.addToGroup(targetGroup, false, intersectingElement)
            }
        }

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
        this._dragSelectionOffsets.clear()
        this._dragSizes.clear()

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

            // keep track of the ancestors of each intersecting group we find. if
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
                        group:groupLoc.group,
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
                originalPosition:this.originalPosition
            })
        }

        const elBounds = { x:ui.x, y:ui.y, w:elSize.w, h:elSize.h }
        _one(el, elBounds, params.e)

        this._dragSelectionOffsets.forEach((v:[PointXY, jsPlumbDOMElement], k:string) => {
            const s = this._dragSizes.get(k)
            let _b:BoundingBox = {x:elBounds.x + v[0].x, y:elBounds.y + v[0].y, w:s.w, h:s.h}
            v[1].style.left = _b.x + "px"
            v[1].style.top = _b.y + "px"
            _one(v[1], _b, params.e)
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

            // reset the drag selection offsets array
            this._dragSelectionOffsets.clear()
            this._dragSizes.clear()
            forEach(this._dragSelection,(jel:jsPlumbDOMElement) => {
                let id = this.instance.getId(jel)
                let off = this.instance.getOffset(jel)
                this._dragSelectionOffsets.set(id, [ { x:off.x- elOffset.x, y:off.y - elOffset.y }, jel])
                this._dragSizes.set(id, this.instance.getSize(jel))
            })

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

                                this._groupLocations.push({el: groupEl, r: boundingRect, group: group})

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

    addToDragSelection(el:Element) {

        const domElement = el as unknown as jsPlumbDOMElement
        if (this._dragSelection.indexOf(domElement) === -1) {
            this.instance.addClass(el, CLASS_DRAG_SELECTED)
            this._dragSelection.push(domElement)
        }
    }

    clearDragSelection() {
        forEach(this._dragSelection,(el) => this.instance.removeClass(el, CLASS_DRAG_SELECTED))
        this._dragSelection.length = 0
    }

    removeFromDragSelection(el:Element) {
        const domElement = el as unknown as jsPlumbDOMElement
        this._dragSelection = this._dragSelection.filter((e:jsPlumbDOMElement) => {
            const out = e !== domElement
            if (!out) {
                this.instance.removeClass(e, CLASS_DRAG_SELECTED)
            }
            return out
        })
    }

    toggleDragSelection(el:Element) {
        const domElement = el as unknown as jsPlumbDOMElement
        const isInSelection = this._dragSelection.indexOf(domElement) !== -1
        if (isInSelection) {
            this.removeFromDragSelection(el)
        } else {
            this.addToDragSelection(el)
        }
    }

    getDragSelection():Array<Element> {
        return this._dragSelection
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

}

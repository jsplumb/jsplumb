import {
    ATTR_NOT_DRAGGABLE,
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER, CLASS_DRAG_SELECTED,
    CLASS_DRAGGED, DragEventParams,
    DragHandler,
    EVT_DRAG_MOVE, EVT_DRAG_START,
    EVT_DRAG_STOP, DragStopEventParams
} from "./drag-manager"

import {BrowserJsPlumbInstance, jsPlumbDOMElement, PosseSpec} from "./browser-jsplumb-instance"


import {Drag} from "./collicat"
import {
    BoundingBox,
    Dictionary,
    GROUP_KEY, isString,
    Offset, optional,
    PARENT_GROUP_KEY,
    PointArray,
    RedrawResult,
    UIGroup
} from "@jsplumb/community-core"

type IntersectingGroup = {
    group:UIGroup
    d:number
    intersectingElement:HTMLElement
}

type GroupLocation = {
    el:HTMLElement
    r: BoundingBox
    group: UIGroup
}

type PosseMemberSpec = { el:HTMLElement, elId:string, active:boolean }
type Posse = { id:string, members:Set<PosseMemberSpec>}

export interface DragStopPayload {
    el:jsPlumbDOMElement
    e:MouseEvent
    pos:Offset
    r:RedrawResult
}

export class ElementDragHandler implements DragHandler {

    selector: string = "> [jtk-managed]"
    private _dragOffset:Offset = null
    private _groupLocations:Array<GroupLocation> = []
    private _intersectingGroups:Array<IntersectingGroup> = []
    private _currentDragParentGroup:UIGroup = null

    private _posseByElementIdMap:Dictionary<Posse> = {}
    private _posseMap:Dictionary<Posse> = {}

    private _currentPosse:Posse = null
    private _currentPosseOffsets:Map<string, [Offset, jsPlumbDOMElement]> = new Map()
    private _currentPosseSizes:Map<string, [number, number]> = new Map()

    private _dragSelection: Array<jsPlumbDOMElement> = []
    private _dragSelectionOffsets:Map<string, [Offset, jsPlumbDOMElement]> = new Map()
    private _dragSizes:Map<string, [number, number]> = new Map()

    protected drag:Drag

    constructor(protected instance:BrowserJsPlumbInstance) {}

    onDragInit(el:jsPlumbDOMElement):jsPlumbDOMElement { return null; }
    onDragAbort(el: jsPlumbDOMElement):void {
        return null
    }

    onStop(params:DragStopEventParams):void {

        const _one = (_el:jsPlumbDOMElement, pos:Offset) => {

            const redrawResult = this.instance._draw(_el, pos)

            this.instance.fire<DragStopPayload>(EVT_DRAG_STOP, {
                el:_el,
                e:params.e,
                pos:pos,
                r:redrawResult
            })

            this.instance.removeClass(_el, CLASS_DRAGGED)
            this.instance.select({source: _el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true)
            this.instance.select({target: _el}).removeClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true)

        }

        const dragElement = params.drag.getDragElement()
        _one(dragElement, {left:params.finalPos[0], top:params.finalPos[1]})

        this._dragSelectionOffsets.forEach((v:[Offset, jsPlumbDOMElement], k:string) => {
            if (v[1] !== params.el) {
                const pp = {
                    left:params.finalPos[0] + v[0].left,
                    top:params.finalPos[1] + v[0].top
                }
                _one(v[1], pp)
            }
        })

        // do the contents of the drag selection

        if (this._intersectingGroups.length > 0) {
            // we only support one for the time being
            let targetGroup = this._intersectingGroups[0].group
            let intersectingElement = this._intersectingGroups[0].intersectingElement

            let currentGroup = (<any>intersectingElement)[PARENT_GROUP_KEY]

            if (currentGroup !== targetGroup) {
                if (currentGroup != null) {
                    if (currentGroup.overrideDrop(intersectingElement, targetGroup)) {
                        return
                    }
                }
                this.instance.groupManager.addToGroup(targetGroup, intersectingElement, false)
            }
        }

        this._cleanup()
    }

    private _cleanup() {
        this._groupLocations.forEach((groupLoc:any) => {
            this.instance.removeClass(groupLoc.el, CLASS_DRAG_ACTIVE)
            this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER)
        })

        this._currentDragParentGroup = null
        this._groupLocations.length = 0
        this.instance.hoverSuspended = false

        this._dragOffset = null
        this._dragSelectionOffsets.clear()
        this._dragSizes.clear()

        this._currentPosseOffsets.clear()
        this._currentPosseSizes.clear()

        this._currentPosse = null
    }

    reset() { }

    init(drag:Drag) {
        this.drag = drag
    }

    onDrag(params:DragEventParams):void {

        const el = params.drag.getDragElement()
        const finalPos = params.finalPos || params.pos
        const elSize = this.instance.getSize(el)
        const ui = { left:finalPos[0], top:finalPos[1] }

        this._intersectingGroups.length = 0

        if (this._dragOffset != null) {
            ui.left += this._dragOffset.left
            ui.top += this._dragOffset.top
        }

        const _one = (el:any, bounds:BoundingBox, e:Event) => {

            // keep track of the ancestors of each intersecting group we find. if
            const ancestorsOfIntersectingGroups = new Set<string>()

            this._groupLocations.forEach((groupLoc:GroupLocation) => {
                if (!ancestorsOfIntersectingGroups.has(groupLoc.group.id) && this.instance.geometry.intersects(bounds, groupLoc.r)) {

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
                    this.instance.groupManager.getAncestors(groupLoc.group).forEach((g:UIGroup) => ancestorsOfIntersectingGroups.add(g.id))

                } else {
                    this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER)
                }
            })

            this.instance._draw(el, {left:bounds.x,top:bounds.y}, null)

            this.instance.fire(EVT_DRAG_MOVE, {
                el:el,
                e:params.e,
                pos:{left:bounds.x,top:bounds.y}
            })
        }

        const elBounds = { x:ui.left, y:ui.top, w:elSize[0], h:elSize[1] }
        _one(el, elBounds, params.e)

        this._dragSelectionOffsets.forEach((v:[Offset, jsPlumbDOMElement], k:string) => {
            const s = this._dragSizes.get(k)
            let _b:BoundingBox = {x:elBounds.x + v[0].left, y:elBounds.y + v[0].top, w:s[0], h:s[1]}
            v[1].style.left = _b.x + "px"
            v[1].style.top = _b.y + "px"
            _one(v[1], _b, params.e)
        })

        this._currentPosseOffsets.forEach((v:[Offset, jsPlumbDOMElement], k:string) => {
            const s = this._currentPosseSizes.get(k)
            let _b:BoundingBox = {x:elBounds.x + v[0].left, y:elBounds.y + v[0].top, w:s[0], h:s[1]}
            v[1].style.left = _b.x + "px"
            v[1].style.top = _b.y + "px"
            _one(v[1], _b, params.e)
        })

    }

    onStart(params:{e:MouseEvent, el:jsPlumbDOMElement, finalPos:PointArray, drag:Drag}):boolean {

        const el = params.drag.getDragElement() as jsPlumbDOMElement
        const elOffset = this.instance.getOffset(el)

        if (el._jsPlumbParentGroup) {
            this._dragOffset = this.instance.getOffset(el.offsetParent)
            this._currentDragParentGroup = el._jsPlumbParentGroup
        }

        let cont = true
        let nd = el.getAttribute(ATTR_NOT_DRAGGABLE)
        if (this.instance.elementsDraggable === false || (nd != null && nd !== "false")) {
            cont = false
        }

        if (cont) {

            this._groupLocations.length = 0
            this._intersectingGroups.length = 0
            this.instance.hoverSuspended = true

            // reset the drag selection offsets array
            this._dragSelectionOffsets.clear()
            this._dragSizes.clear()
            this._dragSelection.forEach((jel) => {
                let id = this.instance.getId(jel)
                let off = this.instance.getOffset(jel)
                this._dragSelectionOffsets.set(id, [ { left:off.left - elOffset.left, top:off.top - elOffset.top }, jel])
                this._dragSizes.set(id, this.instance.getSize(jel))
            })

            const _one = (_el:any):any => {

                // if drag el not a group
                if (!_el._isJsPlumbGroup || this.instance.allowNestedGroups) {

                    const isNotInAGroup = !_el[PARENT_GROUP_KEY]
                    const membersAreDroppable = isNotInAGroup || _el[PARENT_GROUP_KEY].dropOverride !== true
                    const isGhostOrNotConstrained = !isNotInAGroup && (_el[PARENT_GROUP_KEY].ghost || _el[PARENT_GROUP_KEY].constrain !== true)

                    // in order that there could be other groups this element can be dragged to, it must satisfy these conditions:
                    // it's not in a group, OR
                    // it hasnt mandated its element can't be dropped on other groups
                    // it hasn't mandated its elements are constrained to the group, unless ghost proxying is turned on.

                    if (isNotInAGroup || (membersAreDroppable && isGhostOrNotConstrained)) {
                        this.instance.groupManager.forEach((group: UIGroup) => {
                            // prepare a list of potential droppable groups.

                            // get the group pertaining to the dragged element. this is null if the element being dragged is not a UIGroup.
                            const elementGroup = _el[GROUP_KEY] as UIGroup

                            if (group.droppable !== false && group.enabled !== false && _el[GROUP_KEY] !== group && !this.instance.groupManager.isDescendant(group, elementGroup)) {
                                let groupEl = group.el,
                                    s = this.instance.getSize(groupEl),
                                    o = this.instance.getOffset(groupEl),
                                    boundingRect = {x: o.left, y: o.top, w: s[0], h: s[1]}

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
                return this.instance.fire(EVT_DRAG_START, {
                    el:_el,
                    e:params.e
                })
            }

            const elId = this.instance.getId(el)
            this._currentPosse = this._posseByElementIdMap[elId]
            if (this._currentPosse && !this.isActivePosseMember(this._currentPosse, el)) {
                // clear the current posse if this element is not an active member, ie. cannot instigate a drag for all members.
                this._currentPosse = null
            }

            const dragStartReturn = _one(el);      // process the original drag element.
            if (dragStartReturn === false) {
                this._cleanup()
                return false
            }

            if (this._currentPosse != null) {
                this._currentPosseOffsets.clear()
                this._currentPosseSizes.clear()
                this._currentPosse.members.forEach((jel) => {
                    let off = this.instance.getOffset(jel.el)
                    this._currentPosseOffsets.set(jel.elId, [ { left:off.left - elOffset.left, top:off.top - elOffset.top }, jel.el as jsPlumbDOMElement])
                    this._currentPosseSizes.set(jel.elId, this.instance.getSize(jel.el))
                    _one(jel.el)
                })
            }
        }
        return cont
    }

    addToDragSelection(el:string|jsPlumbDOMElement) {

        const candidate = (<unknown>this.instance.getElement(el)) as jsPlumbDOMElement
        if (this._dragSelection.indexOf(candidate) === -1) {
            this.instance.addClass(candidate, CLASS_DRAG_SELECTED)
            this._dragSelection.push(candidate)
        }
    }

    clearDragSelection() {
        this._dragSelection.forEach((el) => this.instance.removeClass(el, CLASS_DRAG_SELECTED))
        this._dragSelection.length = 0
    }

    removeFromDragSelection(el:string|HTMLElement) {
        const domElement = (<unknown>this.instance.getElement(el)) as jsPlumbDOMElement
        this._dragSelection = this._dragSelection.filter((e) => {
            const out = e !== domElement
            if (!out) {
                this.instance.removeClass(e, CLASS_DRAG_SELECTED)
            }
            return out
        })
    }

    toggleDragSelection(el:string|jsPlumbDOMElement) {
        const domElement = (<unknown>this.instance.getElement(el)) as jsPlumbDOMElement
        const isInSelection = this._dragSelection.indexOf(domElement) !== -1
        if (isInSelection) {
            this.removeFromDragSelection(domElement)
        } else {
            this.addToDragSelection(domElement)
        }
    }

    getDragSelection():Array<jsPlumbDOMElement> {
        return this._dragSelection
    }

    private static decodePosseSpec(spec:PosseSpec):{id:string, active:boolean} {

        if (isString(spec)) {
            return { id:spec as string, active:true }
        } else {
            return {
                id:(spec as any).id,
                active:(spec as any).active
            }
        }
    }

    addToPosse(spec:PosseSpec, ...els:Array<jsPlumbDOMElement>) {

        const details = ElementDragHandler.decodePosseSpec(spec)
        let posse = this._posseMap[details.id]
        if (posse == null) {
            posse = { id: details.id, members: new Set<PosseMemberSpec>()}
            this._posseMap[details.id] = posse
        }

        this.removeFromPosse(...els)

        els.forEach((el:HTMLElement) => {
            const elId = el.getAttribute("id")

            posse.members.add({elId:elId, el:el, active:details.active})
            this._posseByElementIdMap[elId] = posse
        })
    }

    removeFromPosse(...els:Array<jsPlumbDOMElement>) {
        els.forEach((el:jsPlumbDOMElement) => {
            const id = this.instance.getId(el)
            const posse = this._posseByElementIdMap[id]
            if (posse != null) {
                const s = new Set<PosseMemberSpec>()
                let p:IteratorResult<PosseMemberSpec>
                let e = posse.members.values()
                while (!(p = e.next()).done) {
                    if (p.value.el !== el) {
                        s.add(p.value)
                    }
                }
                posse.members = s

                delete this._posseByElementIdMap[id]
            }
        })
    }

    setPosseState (state:boolean, ...els:Array<jsPlumbDOMElement>) {
        const elementIds = els.map(el => el.getAttribute("id"))
        elementIds.forEach((id:string) => {
            optional<Posse>(this._posseByElementIdMap[id]).map(posse => {
                optional(Array.from(posse.members).find((m:any) => m.elId === id)).map ( member => {
                    member.active = state
                })
            })
        })
    }

    private isActivePosseMember(posse:Posse, el:any): boolean {
        const details = Array.from(posse.members).find((m:any) => m.el === el)
        if (details !== null) {
            return details.active === true
        } else {
            return false
        }
    }
}

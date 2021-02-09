import {
    ATTR_NOT_DRAGGABLE,
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER, CLASS_DRAG_SELECTED,
    CLASS_DRAGGED, DragEventParams,
    DragHandler,
    EVENT_DRAG_MOVE, EVENT_DRAG_START,
    EVENT_DRAG_STOP, DragStopEventParams
} from "./drag-manager"

import {BrowserJsPlumbInstance, DragGroupSpec, jsPlumbDOMElement} from "./browser-jsplumb-instance"

import {Drag} from "./collicat"
import {
    BoundingBox,
    Dictionary,
    GROUP_KEY, isString, JsPlumbInstance,
    Offset, optional,
    PARENT_GROUP_KEY,
    PointArray,
    RedrawResult,
    UIGroup,
    forEach,
    getFromSetWithFunction
} from "@jsplumb/core"

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

type DragGroupMemberSpec = { el:Element, elId:string, active:boolean }
type DragGroup = { id:string, members:Set<DragGroupMemberSpec>}

export interface DragStopPayload {
    el:Element
    e:MouseEvent
    pos:Offset
    r:RedrawResult
}

export class ElementDragHandler implements DragHandler {

    selector: string = "> [jtk-managed]"
    private _dragOffset:Offset = null
    private _groupLocations:Array<GroupLocation> = []
    private _intersectingGroups:Array<IntersectingGroup> = []
    private _currentDragParentGroup:UIGroup<Element> = null

    private _dragGroupByElementIdMap:Dictionary<DragGroup> = {}
    private _dragGroupMap:Dictionary<DragGroup> = {}

    private _currentDragGroup:DragGroup = null
    private _currentDragGroupOffsets:Map<string, [Offset, jsPlumbDOMElement]> = new Map()
    private _currentDragGroupSizes:Map<string, [number, number]> = new Map()

    private _dragSelection: Array<jsPlumbDOMElement> = []
    private _dragSelectionOffsets:Map<string, [Offset, jsPlumbDOMElement]> = new Map()
    private _dragSizes:Map<string, [number, number]> = new Map()

    protected drag:Drag

    constructor(protected instance:BrowserJsPlumbInstance) {}

    onDragInit(el:Element):Element { return null; }
    onDragAbort(el: Element):void {
        return null
    }

    onStop(params:DragStopEventParams):void {

        const _one = (_el:Element, pos:Offset) => {

            const redrawResult = this.instance.setElementPosition(_el, pos.left, pos.top)

            this.instance.fire<DragStopPayload>(EVENT_DRAG_STOP, {
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

        this._dragSelectionOffsets.forEach( (v:[Offset, jsPlumbDOMElement], k:string) => {
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
            let intersectingElement = this._intersectingGroups[0].intersectingElement as jsPlumbDOMElement

            let currentGroup = (<any>intersectingElement)[PARENT_GROUP_KEY]

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
        forEach(this._groupLocations,(groupLoc:any) => {
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

            forEach(this._groupLocations,(groupLoc:GroupLocation) => {
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
                    forEach(this.instance.groupManager.getAncestors(groupLoc.group),(g:UIGroup<Element>) => ancestorsOfIntersectingGroups.add(g.id))

                } else {
                    this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER)
                }
            })

            this.instance.setElementPosition(el, bounds.x, bounds.y)

            this.instance.fire(EVENT_DRAG_MOVE, {
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

        this._currentDragGroupOffsets.forEach((v:[Offset, jsPlumbDOMElement], k:string) => {
            const s = this._currentDragGroupSizes.get(k)
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
            forEach(this._dragSelection,(jel:jsPlumbDOMElement) => {
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

                        forEach(this.instance.groupManager.getGroups(), (group: UIGroup<Element>) => {
                            // prepare a list of potential droppable groups.

                            // get the group pertaining to the dragged element. this is null if the element being dragged is not a UIGroup.
                            const elementGroup = _el[GROUP_KEY] as UIGroup<Element>

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
                return this.instance.fire(EVENT_DRAG_START, {
                    el:_el,
                    e:params.e
                })
            }

            const elId = this.instance.getId(el)
            this._currentDragGroup = this._dragGroupByElementIdMap[elId]
            if (this._currentDragGroup && !this.isActiveDragGroupMember(this._currentDragGroup, el)) {
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
                this._currentDragGroup.members.forEach((jel) => {
                    let off = this.instance.getOffset(jel.el)
                    this._currentDragGroupOffsets.set(jel.elId, [ { left:off.left - elOffset.left, top:off.top - elOffset.top }, jel.el as jsPlumbDOMElement])
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

    private static decodeDragGroupSpec(instance:JsPlumbInstance, spec:DragGroupSpec):{id:string, active:boolean} {

        if (isString(spec)) {
            return { id:spec as string, active:true }
        } else {
            return {
                id:instance.getId(spec as any),
                active:(spec as any).active
            }
        }
    }

    addToDragGroup(spec:DragGroupSpec, ...els:Array<Element>) {

        const details = ElementDragHandler.decodeDragGroupSpec(this.instance, spec)
        let dragGroup = this._dragGroupMap[details.id]
        if (dragGroup == null) {
            dragGroup = { id: details.id, members: new Set<DragGroupMemberSpec>()}
            this._dragGroupMap[details.id] = dragGroup
        }

        this.removeFromDragGroup(...els)

        forEach(els,(el:Element) => {
            const elId = this.instance.getId(el)
            dragGroup.members.add({elId:elId, el:el, active:details.active})
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
            optional<DragGroup>(this._dragGroupByElementIdMap[id]).map(dragGroup => {
                optional(getFromSetWithFunction(dragGroup.members,(m:any) => m.elId === id)).map ( member => {
                    member.active = state
                })
            })
        })
    }

    private isActiveDragGroupMember(dragGroup:DragGroup, el:any): boolean {
        const details = getFromSetWithFunction(dragGroup.members, (m:any) => m.el === el)
        if (details !== null) {
            return details.active === true
        } else {
            return false
        }
    }
}

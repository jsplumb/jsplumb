
import {ElementDragHandler, IntersectingGroup} from "./element-drag-handler"
import {GhostProxyingDragHandler} from "./drag-manager"
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import { jsPlumbDOMElement} from './element-facade'
import {DragEventParams, Drag, DragStopEventParams, isInsideParent} from "./collicat"
import {SELECTOR_MANAGED_ELEMENT, UIGroup} from "@jsplumb/core"
import {PointXY} from "@jsplumb/util"
import {EVENT_REVERT, SELECTOR_GROUP} from "./constants"
import {DragSelection} from "./drag-selection"


export class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {

    selector: string = [">" , SELECTOR_GROUP, SELECTOR_MANAGED_ELEMENT].join(" ")

    doRevalidate:(el:jsPlumbDOMElement) => void

    constructor(protected instance:BrowserJsPlumbInstance, protected dragSelection:DragSelection) {
        super(instance, dragSelection)

        this.doRevalidate = this._revalidate.bind(this)
    }

    reset() {
        this.drag.off(EVENT_REVERT, this.doRevalidate)
    }

    private _revalidate(el:any) {
        this.instance.revalidate(el)
    }

    init(drag:Drag) {
        this.drag = drag
        drag.on(EVENT_REVERT, this.doRevalidate)
    }

    useGhostProxy(container:any, dragEl:Element) {
        let group = (dragEl as jsPlumbDOMElement)._jsPlumbParentGroup
        return group == null ? false : group.ghost === true
    }

    /**
     * Makes the element that acts as a ghost proxy.
     * @param el
     */
    makeGhostProxy (el: Element):Element {
        // do not believe an IDE if it tells you this method can be static. It can't.
        const jel = el as unknown as jsPlumbDOMElement
        const newEl = jel.cloneNode(true)
        newEl._jsPlumbParentGroup = jel._jsPlumbParentGroup
        return newEl
    }

    // onStoop(params: DragStopEventParams):void {
    //
    //     const jel = params.drag.getDragElement() as unknown as jsPlumbDOMElement
    //     let originalGroup:UIGroup<Element> = jel._jsPlumbParentGroup,
    //         isInGroup = isInsideParent(this.instance, jel, params.finalPos),
    //         draggedOutOfGroup = false
    //
    //     let dropGroup:IntersectingGroup = null
    //
    //     // 1. is it still within the bounds of the group? if so, nothing needs to be done.
    //     if (!isInGroup) {
    //         // 2. if not in group bounds, is it intersecting some other group (via the _intersectingGroups list) ? Entries in this list
    //         // have been vetted to ensure that things can be dropped on them, and that the group in which the current element resides is not
    //         // overriding drop on another group.
    //
    //         dropGroup = this.getDropGroup()
    //         if (dropGroup == null) {
    //             // if there was no drop group, then we need to prune or orphan the element
    //             const orphanedPosition:[string, PointXY] = this._pruneOrOrphan(params, true, true)
    //             draggedOutOfGroup = true
    //             // if the element was orphaned, we now adjust the final position of the drag to reflect its position after being orphaned from the group.
    //             if (orphanedPosition != null) {
    //                 params.finalPos = orphanedPosition[1]
    //             }
    //
    //         } // else, the superclass will take care of dropping it on a new group.
    //
    //     }
    //
    //     // we pass in the dropGroup here (which may be null) because we've already figured it out so there's no point in making the superclass
    //     // do it again
    //     super.onStop(params, draggedOutOfGroup, originalGroup, dropGroup)
    //
    //     let currentGroup:UIGroup<Element> = jel._jsPlumbParentGroup
    //     if (currentGroup !== originalGroup) {
    //         const originalElement = params.drag.getDragElement(true)
    //         if (originalGroup.ghost) {
    //             const o1 = this.instance.getOffset(this.instance.getGroupContentArea(currentGroup))
    //             const o2 = this.instance.getOffset(this.instance.getGroupContentArea(originalGroup))
    //             const o = { x:o2.x + params.pos.x - o1.x, y:o2.y + params.pos.y - o1.y}
    //             originalElement.style.left = o.x + "px"
    //             originalElement.style.top = o.y + "px"
    //
    //             this.instance.revalidate(originalElement)
    //         }
    //     }
    // }




}

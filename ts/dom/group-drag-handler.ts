
import { PointArray } from '../core/common'
import {UIGroup} from "../core/group/group"
import { PARENT_GROUP_KEY } from '../core/constants'

import {ElementDragHandler} from "./element-drag-handler"
import {DragEventParams, EVT_REVERT, GhostProxyingDragHandler, DragStopEventParams} from "./drag-manager"
import {BrowserJsPlumbInstance, jsPlumbDOMElement} from "./browser-jsplumb-instance"
import {Drag} from "./collicat"


export class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {

    selector: string = "> [jtk-group] [jtk-managed]"

    doRevalidate:(el:jsPlumbDOMElement) => void

    constructor(protected instance:BrowserJsPlumbInstance) {
        super(instance)

        this.doRevalidate = this._revalidate.bind(this)
    }

    reset() {
        this.drag.off(EVT_REVERT, this.doRevalidate)
    }

    private _revalidate(el:any) {
        this.instance.revalidate(el)
    }

    init(drag:Drag) {
        this.drag = drag
        drag.on(EVT_REVERT, this.doRevalidate)
    }

    useGhostProxy(container:any, dragEl:jsPlumbDOMElement) {
        let group = dragEl._jsPlumbParentGroup
        return group == null ? false : group.ghost === true
    }

    makeGhostProxy (el: jsPlumbDOMElement):jsPlumbDOMElement {
        const newEl = el.cloneNode(true) as jsPlumbDOMElement
        newEl._jsPlumbParentGroup = el._jsPlumbParentGroup
        return newEl
    }

    onDrag(params: DragEventParams) {
        super.onDrag(params)
    }

    onDragAbort(el: jsPlumbDOMElement):void {
        return null
    }

    onStop(params: DragStopEventParams) {

        const originalElement = params.drag.getDragElement(true)

        let originalGroup:UIGroup = params.el[PARENT_GROUP_KEY],
            out = super.onStop(params),
            currentGroup:UIGroup = params.el[PARENT_GROUP_KEY]

        if (currentGroup === originalGroup) {
            this._pruneOrOrphan(params)
        } else {
            if (originalGroup.ghost) {
                const o1 = this.instance.getOffset(currentGroup.getDragArea())
                const o2 = this.instance.getOffset(originalGroup.getDragArea())
                const o = { left:o2.left + params.pos[0] - o1.left, top:o2.top + params.pos[1]-o1.top}
                originalElement.style.left = o.left + "px"
                originalElement.style.top = o.top + "px"
            }
        }

        this.instance.revalidate(originalElement)

        return out
    }

    private _isInsideParent(_el:jsPlumbDOMElement, pos:PointArray):boolean {
        let p = _el.offsetParent,
            s = this.instance.getSize(p),
            ss = this.instance.getSize(_el),
            leftEdge = pos[0],
            rightEdge = leftEdge + ss[0],
            topEdge = pos[1],
            bottomEdge = topEdge + ss[1]

        return rightEdge > 0 && leftEdge < s[0] && bottomEdge > 0 && topEdge < s[1]
    }

    private _pruneOrOrphan(params:DragStopEventParams) {

        let orphanedPosition = null
        if (!this._isInsideParent(params.el, params.pos)) {
            let group = params.el[PARENT_GROUP_KEY]
            if (group.prune) {
                if (params.el._isJsPlumbGroup) {
                    // remove the group from the instance
                    this.instance.removeGroup(params.el._jsPlumbGroup)
                } else {
                    // instruct the group to remove the element from itself and also from the DOM.
                    group.remove(params.el, true)
                }

            } else if (group.orphan) {
                orphanedPosition = this.instance.groupManager.orphan(params.el)
                if (params.el._isJsPlumbGroup) {
                    // remove the nested group from the parent
                    group.removeGroup(params.el._jsPlumbGroup)
                } else {
                    // remove the element from the group's DOM element.
                    group.remove(params.el)
                }
            }
        }

        return orphanedPosition
    }

}

import {ElementDragHandler} from "./element-drag-handler";
import * as Constants from "../constants";
import {extend, PointXY} from "../core";
import {EVT_REVERT, GhostProxyingDragHandler} from "./drag-manager";
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance";
import { UIGroup } from "../group/group";
import {Drag} from "./collicat";

export class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {

    selector: string = "> [jtk-group] [jtk-managed]";

    doRevalidate:(el:any) => void;

    constructor(protected instance:BrowserJsPlumbInstance) {
        super(instance);

        this.doRevalidate = this._revalidate.bind(this);
    }

    reset() {
        this.drag.off(EVT_REVERT, this.doRevalidate);
    }

    private _revalidate(el:any) {
        this.instance.revalidate(el);
    }

    init(drag:Drag) {
        this.drag = drag;
        drag.on(EVT_REVERT, this.doRevalidate);
    }

    useGhostProxy(container:any, dragEl:any) {
        let group = dragEl[Constants.GROUP_KEY];
        return group == null ? false : group.ghost === true;
    }

    makeGhostProxy (el: any) {
        const newEl = el.cloneNode(true);
        newEl[Constants.GROUP_KEY] = el[Constants.GROUP_KEY];
        return newEl;
    }

    onDrag(params: any) {
        super.onDrag(params);
    }

    onDragInit(el:HTMLElement):HTMLElement { return null; }

    onDragAbort(el: HTMLElement):void {
        return null;
    }

    onStop(params: any) {

        const originalElement = params.drag.getDragElement(true);

        let originalGroup:UIGroup = params.el[Constants.GROUP_KEY],
            out = super.onStop(params),
            currentGroup:UIGroup = params.el[Constants.GROUP_KEY];

        if (currentGroup === originalGroup) {
            this._pruneOrOrphan(params);
        } else {
            if (originalGroup.ghost) {
                const o1 = this.instance.getOffset(currentGroup.getDragArea());
                const o2 = this.instance.getOffset(originalGroup.getDragArea());
                const o = { left:o2.left + params.pos[0] - o1.left, top:o2.top + params.pos[1]-o1.top};
                originalElement.style.left = o.left + "px";
                originalElement.style.top = o.top + "px";
            }
        }

        this.instance.revalidate(originalElement);

        return out;
    }

    private _isInsideParent(_el:HTMLElement, pos:PointXY):boolean {
        let p = (<any>_el).offsetParent,
            s = this.instance.getSize(p),
            ss = this.instance.getSize(_el),
            leftEdge = pos[0],
            rightEdge = leftEdge + ss[0],
            topEdge = pos[1],
            bottomEdge = topEdge + ss[1];

        return rightEdge > 0 && leftEdge < s[0] && bottomEdge > 0 && topEdge < s[1];
    }

    private _pruneOrOrphan(params:any) {

        let orphanedPosition = null;
        if (!this._isInsideParent(params.el, params.pos)) {
            let group = params.el[Constants.GROUP_KEY];
            if (group.prune) {

                this.instance.remove(params.el);
                group.remove(params.el);

            } else if (group.orphan) {
                orphanedPosition = this.instance.groupManager.orphan(params.el);
                group.remove(params.el);
            }

        }

        return orphanedPosition;
    }

}

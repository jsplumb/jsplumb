import {ElementDragHandler} from "./element-drag-handler";
import * as Constants from "../constants";
import {PointXY} from "../core";
import {EVT_REVERT, GhostProxyingDragHandler} from "./drag-manager";
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance";

export class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {

    selector: string = "> [jtk-group] [jtk-managed]";

    katavorioDraggable:any;
    doRevalidate:(el:any) => void;

    constructor(protected instance:BrowserJsPlumbInstance) {
        super(instance);

        this.doRevalidate = this._revalidate.bind(this);
    }

    reset() {
        this.katavorioDraggable.off(EVT_REVERT, this.doRevalidate);
    }

    private _revalidate(el:any) {
        this.instance.revalidate(el);
    }

    init(katavorioDraggable:any) {
        this.katavorioDraggable = katavorioDraggable;
        katavorioDraggable.on(EVT_REVERT, this.doRevalidate);
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
        console.log("on drag, inside a group");
        super.onDrag(params);
    }
    //
    // onStart(params: any) {
    //     console.log("on start, inside group. could have a group lock function and return false from here");
    //     return true;
    // }
    //
    onStop(params: any) {
        console.log("on stop, inside a group. here we should test for orphan, prune etc");

        let originalGroup = params.el[Constants.GROUP_KEY],
            out = super.onStop(params),
            currentGroup = params.el[Constants.GROUP_KEY];

        if (currentGroup === originalGroup) {
            this._pruneOrOrphan(params);
        }
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

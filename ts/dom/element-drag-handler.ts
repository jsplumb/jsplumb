import {
    ATTR_NOT_DRAGGABLE,
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER,
    CLASS_DRAGGED,
    DragHandler,
    EVT_DRAG_MOVE, EVT_DRAG_START,
    EVT_DRAG_STOP
} from "./drag-manager";
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance";
import {Group} from "../group/group";
import {BoundingBox, Offset} from "../core";

declare const Biltong:any;

type IntersectingGroup<E> = {
    group:Group<E>;
    d:number;
}

type GroupLocation<E> = {
    el:E;
    r: BoundingBox;
    group: Group<E>;
}

export class ElementDragHandler implements DragHandler {

    selector: string = "> [jtk-managed]";
    _dragOffset:Offset = null;
    _groupLocations:Array<GroupLocation<HTMLElement>> = [];
    _intersectingGroups:Array<IntersectingGroup<HTMLElement>> = [];

    constructor(protected instance:BrowserJsPlumbInstance) {}

    onStop(params:any):void {

        let elements = params.selection, uip;

        if (elements.length === 0) {
            elements = [ [ params.el, {left:params.finalPos[0], top:params.finalPos[1] }, params.drag ] ];
        }

        const _one = (_e:any) => {
            const dragElement = _e[2].getDragElement();
            if (_e[1] != null) {
                // run the reported offset through the code that takes parent containers
                // into account, to adjust if necessary (issue 554)
                uip = this.instance.getUIPosition([{
                    el:dragElement,
                    pos:[_e[1].left, _e[1].top]
                }]);
                if (this._dragOffset) {
                    uip.left += this._dragOffset.left;
                    uip.top += this._dragOffset.top;
                }
                this.instance._draw(dragElement, uip);

                this.instance.fire(EVT_DRAG_STOP, {
                    el:dragElement,
                    e:params.e,
                    pos:uip
                });
            }

            this.instance.removeClass(_e[0], CLASS_DRAGGED);
            this.instance.select({source: dragElement}).removeClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true);
            this.instance.select({target: dragElement}).removeClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true);

        };

        for (let i = 0; i < elements.length; i++) {
            _one(elements[i]);
        }

        if (this._intersectingGroups.length > 0) {
            // we only support one for the time being
            let targetGroup = this._intersectingGroups[0].group;
            let currentGroup = params.el._jsPlumbGroup;
            if (currentGroup !== targetGroup) {
                if (currentGroup != null) {
                    if (currentGroup.overrideDrop(params.el, targetGroup)) {
                        return;
                    }
                }
                this.instance.groupManager.addToGroup(targetGroup, params.el, false);
            }
        }


        this._groupLocations.forEach((groupLoc:any) => {
            this.instance.removeClass(groupLoc.el, CLASS_DRAG_ACTIVE);
            this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
        });

        this._groupLocations.length = 0;
        this.instance.hoverSuspended = false;
        this.instance.isConnectionBeingDragged = false;
        this._dragOffset = null;
    }

    reset() { }
    init(katavorioDraggable:any) { }

    onDrag(params:any):void {

        const el = params.drag.getDragElement();
        const finalPos = params.finalPos || params.pos;
        const elSize = this.instance.getSize(el);
        const ui = { left:finalPos[0], top:finalPos[1] };

        this._intersectingGroups.length = 0;

        // TODO refactor, now there are no drag options on each element as we dont call 'draggable' for each one. the canDrag method would
        // have been supplied to the instance's dragOptions.
        //var o = el._jsPlumbDragOptions || {};

        if (this._dragOffset != null) {
            ui.left += this._dragOffset.left;
            ui.top += this._dragOffset.top;
        }

        const bounds = { x:ui.left, y:ui.top, w:elSize[0], h:elSize[1] };

        // TODO  calculate if there is a target group
        this._groupLocations.forEach((groupLoc:any) => {
            if (Biltong.intersects(bounds, groupLoc.r)) {
                this.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER);
                this._intersectingGroups.push(groupLoc);
            } else {
                this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
            }
        });

        this.instance._draw(el, ui, null);

        this.instance.fire(EVT_DRAG_MOVE, {
            el:el,
            e:params.e,
            pos:ui
        });
    }

    onStart(params:any):boolean {

        const el = params.drag.getDragElement();

        if (el._jsPlumbGroup) {
            this._dragOffset = this.instance.getOffset(el.offsetParent);
        }

        let cont = true;
        let nd = el.getAttribute(ATTR_NOT_DRAGGABLE);
        if (nd != null && nd !== "false" ) {
            cont = false;
        }

        if (cont) {

            this._groupLocations.length = 0;
            this._intersectingGroups.length = 0;

            //
            // is it the best way to do it via the dom? the group manager can give all the groups, and also whether they are
            // collapsed etc
            //

            if (!el._isJsPlumbGroup && (!el._jsPlumbGroup || el._jsPlumbGroup.constrain !== true)) {
                this.instance.groupManager.forEach((group:Group<HTMLElement>) => {
                    if (group.droppable !== false && group.enabled !== false && group !== el._jsPlumbGroup) {
                        let groupEl = group.el,
                            s = this.instance.getSize(groupEl),
                            o = this.instance.getOffset(groupEl),
                            boundingRect = {x: o.left, y: o.top, w: s[0], h: s[1]};

                        this._groupLocations.push({el: groupEl, r: boundingRect, group: group});
                        this.instance.addClass(groupEl, CLASS_DRAG_ACTIVE);
                    }
                });
            }

            this.instance.hoverSuspended = true;
            this.instance.select({source: el}).addClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true);
            this.instance.select({target: el}).addClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true);
            this.instance.isConnectionBeingDragged = true;

            this.instance.fire(EVT_DRAG_START, {
                el:el,
                e:params.e
            });
        }
        return cont;
    }
}

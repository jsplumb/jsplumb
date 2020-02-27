import {
    ATTR_NOT_DRAGGABLE,
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER, CLASS_DRAG_SELECTED,
    CLASS_DRAGGED,
    DragHandler,
    EVT_DRAG_MOVE, EVT_DRAG_START,
    EVT_DRAG_STOP
} from "./drag-manager";
import {BrowserJsPlumbInstance, jsPlumbDOMElement} from "./browser-jsplumb-instance";
import {UIGroup} from "../group/group";
import {BoundingBox, Offset} from "../core";

declare const Biltong:any;

type IntersectingGroup<E> = {
    group:UIGroup<E>;
    d:number;
    intersectingElement:E;
}

type GroupLocation<E> = {
    el:E;
    r: BoundingBox;
    group: UIGroup<E>;
}

export class ElementDragHandler implements DragHandler {

    selector: string = "> [jtk-managed]";
    _dragOffset:Offset = null;
    _groupLocations:Array<GroupLocation<HTMLElement>> = [];
    _intersectingGroups:Array<IntersectingGroup<HTMLElement>> = [];

    private _dragSelection: Array<jsPlumbDOMElement> = [];
    private _dragSelectionOffsets:Map<string, [Offset, jsPlumbDOMElement]> = new Map();
    private _dragSizes:Map<string, [number, number]> = new Map();

    protected katavorioDraggable:any;

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

        // do the contents of the drag selection

        if (this._intersectingGroups.length > 0) {
            // we only support one for the time being
            let targetGroup = this._intersectingGroups[0].group;
            let intersectingElement = this._intersectingGroups[0].intersectingElement;
            //let currentGroup = params.el._jsPlumbGroup;
            let currentGroup = (<any>intersectingElement)._jsPlumbGroup;
            if (currentGroup !== targetGroup) {
                if (currentGroup != null) {
                    //if (currentGroup.overrideDrop(params.el, targetGroup)) {
                    if (currentGroup.overrideDrop(intersectingElement, targetGroup)) {
                        return;
                    }
                }
                //this.instance.groupManager.addToGroup(targetGroup, params.el, false);
                this.instance.groupManager.addToGroup(targetGroup, intersectingElement, false);
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
        this._dragSelectionOffsets.clear();
        this._dragSizes.clear();
    }

    reset() { }

    init(katavorioDraggable:any) {
        this.katavorioDraggable = katavorioDraggable;
    }

    onDrag(params:any):void {

        const el = params.drag.getDragElement();
        const finalPos = params.finalPos || params.pos;
        const elSize = this.instance.getSize(el);
        const ui = { left:finalPos[0], top:finalPos[1] };

        this._intersectingGroups.length = 0;

        if (this._dragOffset != null) {
            ui.left += this._dragOffset.left;
            ui.top += this._dragOffset.top;
        }

        const _one = (el:any, bounds:BoundingBox, e:Event) => {

            // TODO  calculate if there is a target group
            this._groupLocations.forEach((groupLoc:any) => {
                if (Biltong.intersects(bounds, groupLoc.r)) {
                    this.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER);
                    this._intersectingGroups.push({group:groupLoc.group, intersectingElement:el, d:0});
                } else {
                    this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
                }
            });

            this.instance._draw(el, {left:bounds.x,top:bounds.y}, null);

            this.instance.fire(EVT_DRAG_MOVE, {
                el:el,
                e:params.e,
                pos:{left:bounds.x,top:bounds.y}
            });
        };

        const elBounds = { x:ui.left, y:ui.top, w:elSize[0], h:elSize[1] };
        _one(el, elBounds, params.e);

        this._dragSelectionOffsets.forEach((v:[Offset, jsPlumbDOMElement], k:string) => {
            const s = this._dragSizes.get(k);
            let _b:BoundingBox = {x:elBounds.x + v[0].left, y:elBounds.y + v[0].top, w:s[0], h:s[1]};
            v[1].style.left = _b.x + "px";
            v[1].style.top = _b.y + "px";
            _one(v[1], _b, params.e);

        });

    }

    onStart(params:any):boolean {

        const el = params.drag.getDragElement() as jsPlumbDOMElement;
        const elOffset = this.instance.getOffset(el);

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

            // reset the drag selection offsets array
            this._dragSelectionOffsets.clear();
            this._dragSizes.clear();
            this._dragSelection.forEach((jel) => {
                let id = this.instance.getId(jel);
                let off = this.instance.getOffset(jel);
                this._dragSelectionOffsets.set(id, [ { left:off.left - elOffset.left, top:off.top - elOffset.top }, jel]);
                this._dragSizes.set(id, this.instance.getSize(jel));
            });

            // if drag el not a group
            if (!el._isJsPlumbGroup) {

                const isNotInAGroup = !el._jsPlumbGroup;
                const membersAreDroppable = isNotInAGroup || el._jsPlumbGroup.dropOverride !== true;
                const isGhostOrNotConstrained = !isNotInAGroup && (el._jsPlumbGroup.ghost || el._jsPlumbGroup.constrain !== true);

                // in order that there could be other groups this element can be dragged to, it must satisfy these conditions:
                // it's not in a group, OR
                // it hasnt mandated its element can't be dropped on other groups
                // it hasn't mandated its elements are constrained to the group, unless ghost proxying is turned on.

                if (isNotInAGroup || (membersAreDroppable && isGhostOrNotConstrained)) {
                    this.instance.groupManager.forEach((group: UIGroup<HTMLElement>) => {
                        // prepare a list of potential droppable groups.
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
            }

            this.instance.hoverSuspended = true;
            this.instance.select({source: el as any}).addClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true);
            this.instance.select({target: el as any}).addClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true);
            this.instance.isConnectionBeingDragged = true;

            this.instance.fire(EVT_DRAG_START, {
                el:el,
                e:params.e
            });
        }
        return cont;
    }

    addToDragSelection(el:string|HTMLElement) {

        const candidate = (<unknown>this.instance.getElement(el)) as jsPlumbDOMElement;
        if (this._dragSelection.indexOf(candidate) === -1) {
            this.instance.addClass(candidate, CLASS_DRAG_SELECTED);
            this._dragSelection.push(candidate);
        }
    }

    clearDragSelection() {
        this._dragSelection.forEach((el) => this.instance.removeClass(el, CLASS_DRAG_SELECTED));
        this._dragSelection.length = 0;
    }

    removeFromDragSelection(el:string|HTMLElement) {
        const domElement = (<unknown>this.instance.getElement(el)) as jsPlumbDOMElement;
        this._dragSelection = this._dragSelection.filter((e) => {
            const out = e !== domElement;
            if (!out) {
                this.instance.removeClass(e, CLASS_DRAG_SELECTED)
            }
            return out;
        });
    }

    toggleDragSelection(el:string|HTMLElement) {
        const domElement = (<unknown>this.instance.getElement(el)) as jsPlumbDOMElement;
        const isInSelection = this._dragSelection.indexOf(domElement) !== -1;
        if (isInSelection) {
            this.removeFromDragSelection(domElement);
        } else {
            this.addToDragSelection(domElement);
        }
    }

    getDragSelection():Array<HTMLElement> {
        return this._dragSelection;
    }

    addToPosse(el:HTMLElement, spec:any) {
        //alert("add to posse");
        //this._dragSelection.addToPosse(el, spec);
    }

    setPosse(el:HTMLElement, spec:any) {
        // this._dragSelection.setPosse(el, spec);
    }

    removeFromPosse(el:HTMLElement, posseId:string) {
        // this._dragSelection.removeFromPosse(el, posseId);
    }

    removeFromAllPosses(el:HTMLElement):void {
        // this._dragSelection.removeFromAllPosses(el);
    }

    setPosseState (posseId:string, state:boolean, ...el:any) {
        // this._dragSelection.setPosseState(posseId, state, el);
    }
}

import { DragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance, DragGroupSpec } from "./browser-jsplumb-instance";
import { jsPlumbDOMElement } from './element-facade';
import { DragEventParams, Drag, DragStopEventParams } from "./collicat";
import { BoundingBox, PointXY } from "../util/util";
import { DragSelection } from "./drag-selection";
import { UIGroup } from "../core/group/group";
import { RedrawResult } from "../core/router/router";
export declare type IntersectingGroup = {
    groupLoc: GroupLocation;
    d: number;
    intersectingElement: Element;
};
export declare type GroupLocation = {
    el: Element;
    r: BoundingBox;
    group: UIGroup<Element>;
};
declare type DragGroupMemberSpec = {
    el: jsPlumbDOMElement;
    elId: string;
    active: boolean;
};
declare type DragGroup = {
    id: string;
    members: Set<DragGroupMemberSpec>;
};
/**
 * Base payload for drag events. Contains the element being dragged, the corresponding mouse event, the current position, and the position when drag started.
 */
export interface DragPayload {
    el: Element;
    e: Event;
    pos: PointXY;
    originalPosition: PointXY;
    payload?: Record<string, any>;
}
export declare type DraggedElement = {
    el: jsPlumbDOMElement;
    id: string;
    pos: PointXY;
    originalPos: PointXY;
    originalGroup: UIGroup;
    redrawResult: RedrawResult;
    reverted: boolean;
    dropGroup: UIGroup;
};
/**
 * Payload for `drag:stop` event. In addition to the base payload, contains a redraw result object, listing all the connections and endpoints that were affected by the drag.
 * @public
 */
export interface DragStopPayload {
    elements: Array<DraggedElement>;
    e: Event;
    el: Element;
    payload?: Record<string, any>;
}
/**
 * Payload for `drag:move` event.
 * @public
 */
export interface DragMovePayload extends DragPayload {
}
/**
 * Payload for `drag:start` event.
 * @public
 */
export interface DragStartPayload extends DragPayload {
    dragGroup?: DragGroup;
    dragGroupMemberSpec?: DragGroupMemberSpec;
}
export declare class ElementDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    protected _dragSelection: DragSelection;
    selector: string;
    private _dragOffset;
    private _groupLocations;
    protected _intersectingGroups: Array<IntersectingGroup>;
    private _currentDragParentGroup;
    private _dragGroupByElementIdMap;
    private _dragGroupMap;
    private _currentDragGroup;
    private _currentDragGroupOffsets;
    private _currentDragGroupSizes;
    private _currentDragGroupOriginalPositions;
    private _dragPayload;
    protected drag: Drag;
    originalPosition: PointXY;
    constructor(instance: BrowserJsPlumbInstance, _dragSelection: DragSelection);
    onDragInit(el: Element): Element;
    onDragAbort(el: Element): void;
    protected getDropGroup(): IntersectingGroup | null;
    onStop(params: DragStopEventParams): void;
    private _cleanup;
    reset(): void;
    init(drag: Drag): void;
    onDrag(params: DragEventParams): void;
    private _computeOffsetByParentGroup;
    onStart(params: {
        e: MouseEvent;
        el: jsPlumbDOMElement;
        pos: PointXY;
        drag: Drag;
    }): boolean;
    /**
     * @internal
     */
    addToDragGroup(spec: DragGroupSpec, ...els: Array<Element>): void;
    /**
     * @internal
     */
    removeFromDragGroup(...els: Array<Element>): void;
    /**
     * @internal
     */
    setDragGroupState(active: boolean, ...els: Array<Element>): void;
    /**
     * @internal
     * @param name
     */
    clearDragGroup(name: string): void;
    /**
     * Perhaps prune or orphan the element represented by the given drag params.
     * @param params
     * @param doNotTransferToAncestor Used when dealing with nested groups. When true, it means remove the element from any groups; when false, which is
     * the default, elements that are orphaned will be added to this group's ancestor, if it has one.
     * @param isDefinitelyNotInsideParent Used internally when this method is called and we've already done an intersections test. This flag saves us repeating the calculation.
     * @internal
     */
    private _pruneOrOrphan;
}
export {};
//# sourceMappingURL=element-drag-handler.d.ts.map
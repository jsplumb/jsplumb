import { DragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance, DragGroupSpec } from "./browser-jsplumb-instance";
import { jsPlumbDOMElement } from './element-facade';
import { DragEventParams, Drag, DragStopEventParams } from "./collicat";
import { RedrawResult, PointXY } from "@jsplumb/core";
/**
 * Base payload for drag events. Contains the element being dragged, the corresponding mouse event, the current position, and the position when drag started.
 */
export interface DragPayload {
    el: Element;
    e: Event;
    pos: PointXY;
    originalPosition: PointXY;
}
/**
 * Payload for `drag:stop` event. In addition to the base payload, contains a redraw result object, listing all the connections and endpoints that were affected by the drag.
 */
export interface DragStopPayload extends DragPayload {
    r: RedrawResult;
}
/**
 * Payload for `drag:move` event.
 */
export interface DragMovePayload extends DragPayload {
}
/**
 * Payload for `drag:start` event.
 */
export interface DragStartPayload extends DragPayload {
}
export declare class ElementDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    selector: string;
    private _dragOffset;
    private _groupLocations;
    private _intersectingGroups;
    private _currentDragParentGroup;
    private _dragGroupByElementIdMap;
    private _dragGroupMap;
    private _currentDragGroup;
    private _currentDragGroupOffsets;
    private _currentDragGroupSizes;
    private _dragSelection;
    private _dragSelectionOffsets;
    private _dragSizes;
    protected drag: Drag;
    originalPosition: PointXY;
    constructor(instance: BrowserJsPlumbInstance);
    onDragInit(el: Element): Element;
    onDragAbort(el: Element): void;
    onStop(params: DragStopEventParams): void;
    private _cleanup;
    reset(): void;
    init(drag: Drag): void;
    onDrag(params: DragEventParams): void;
    onStart(params: {
        e: MouseEvent;
        el: jsPlumbDOMElement;
        pos: PointXY;
        drag: Drag;
    }): boolean;
    addToDragSelection(el: Element): void;
    clearDragSelection(): void;
    removeFromDragSelection(el: Element): void;
    toggleDragSelection(el: Element): void;
    getDragSelection(): Array<Element>;
    addToDragGroup(spec: DragGroupSpec, ...els: Array<Element>): void;
    removeFromDragGroup(...els: Array<Element>): void;
    setDragGroupState(state: boolean, ...els: Array<Element>): void;
}

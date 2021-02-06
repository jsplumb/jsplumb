import { DragEventParams, DragHandler, DragStopEventParams } from "./drag-manager";
import { BrowserJsPlumbInstance, DragGroupSpec, jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Drag } from "./collicat";
import { Offset, PointArray, RedrawResult } from "@jsplumb/core";
export interface DragStopPayload {
    el: Element;
    e: MouseEvent;
    pos: Offset;
    r: RedrawResult;
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
        finalPos: PointArray;
        drag: Drag;
    }): boolean;
    addToDragSelection(el: Element): void;
    clearDragSelection(): void;
    removeFromDragSelection(el: Element): void;
    toggleDragSelection(el: Element): void;
    getDragSelection(): Array<Element>;
    private static decodeDragGroupSpec;
    addToDragGroup(spec: DragGroupSpec, ...els: Array<Element>): void;
    removeFromDragGroup(...els: Array<Element>): void;
    setDragGroupState(state: boolean, ...els: Array<Element>): void;
    private isActiveDragGroupMember;
}

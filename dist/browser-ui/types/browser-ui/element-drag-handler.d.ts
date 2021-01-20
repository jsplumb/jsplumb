import { DragEventParams, DragHandler, DragStopEventParams } from "./drag-manager";
import { BrowserJsPlumbInstance, DragGroupSpec, jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Drag } from "./collicat";
import { Offset, PointArray, RedrawResult } from "@jsplumb/community-core";
export interface DragStopPayload {
    el: jsPlumbDOMElement;
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
    onDragInit(el: jsPlumbDOMElement): jsPlumbDOMElement;
    onDragAbort(el: jsPlumbDOMElement): void;
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
    addToDragSelection(el: string | jsPlumbDOMElement): void;
    clearDragSelection(): void;
    removeFromDragSelection(el: string | HTMLElement): void;
    toggleDragSelection(el: string | jsPlumbDOMElement): void;
    getDragSelection(): Array<jsPlumbDOMElement>;
    private static decodeDragGroupSpec;
    addToDragGroup(spec: DragGroupSpec, ...els: Array<jsPlumbDOMElement>): void;
    removeFromDragGroup(...els: Array<jsPlumbDOMElement>): void;
    setDragGroupState(state: boolean, ...els: Array<jsPlumbDOMElement>): void;
    private isActiveDragGroupMember;
}

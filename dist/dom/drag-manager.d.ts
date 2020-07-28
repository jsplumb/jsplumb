import { BrowserJsPlumbInstance, jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Dictionary, PointArray } from "../core";
import { Drag, DragHandlerOptions, GhostProxyGenerator } from "./collicat";
export declare const CLASS_DRAG_SELECTED = "jtk-drag-selected";
export declare const CLASS_DRAG_ACTIVE = "jtk-drag-active";
export declare const CLASS_DRAGGED = "jtk-dragged";
export declare const CLASS_DRAG_HOVER = "jtk-drag-hover";
export declare const ATTR_NOT_DRAGGABLE = "jtk-not-draggable";
export declare const EVT_DRAG_MOVE = "drag:move";
export declare const EVT_DRAG_STOP = "drag:stop";
export declare const EVT_DRAG_START = "drag:start";
export declare const EVT_MOUSEDOWN = "mousedown";
export declare const EVT_MOUSEMOVE = "mousemove";
export declare const EVT_MOUSEUP = "mouseup";
export declare const EVT_REVERT = "revert";
export declare const EVT_ZOOM = "zoom";
export declare const EVT_CONNECTION_DRAG = "connectionDrag";
export interface DragHandler {
    selector: string;
    onStart: (params: DragStartEventParams) => boolean;
    onDrag: (params: DragEventParams) => void;
    onStop: (params: DragStopEventParams) => void;
    onDragInit: (el: jsPlumbDOMElement) => jsPlumbDOMElement;
    onDragAbort: (el: jsPlumbDOMElement) => void;
    reset: () => void;
    init: (drag: Drag) => void;
    onBeforeStart?: (beforeStartParams: any) => void;
}
export interface GhostProxyingDragHandler extends DragHandler {
    useGhostProxy: (container: any, dragEl: jsPlumbDOMElement) => boolean;
    makeGhostProxy?: GhostProxyGenerator;
}
export interface DragStartEventParams {
    e: MouseEvent;
    el: jsPlumbDOMElement;
    finalPos?: PointArray;
    drag: Drag;
}
export interface DragEventParams extends DragStartEventParams {
    pos: PointArray;
}
export interface DragStopEventParams extends DragEventParams {
    finalPos: PointArray;
    selection: Array<any>;
}
export declare class DragManager {
    protected instance: BrowserJsPlumbInstance;
    private collicat;
    private drag;
    _draggables: Dictionary<any>;
    _dlist: Array<any>;
    _elementsWithEndpoints: Dictionary<any>;
    _draggablesForElements: Dictionary<any>;
    handlers: Array<DragHandler>;
    private _filtersToAdd;
    constructor(instance: BrowserJsPlumbInstance);
    addHandler(handler: DragHandler, dragOptions?: DragHandlerOptions): void;
    addFilter(filter: Function | string, exclude?: boolean): void;
    removeFilter(filter: Function | string): void;
    reset(): void;
}

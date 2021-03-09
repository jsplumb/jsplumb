import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { Dictionary, PointXY } from '@jsplumb/core';
import { BeforeStartEventParams, Drag, DragEventParams, DragHandlerOptions, DragStartEventParams, DragStopEventParams, GhostProxyGenerator } from "./collicat";
export declare function _isInsideParent(instance: BrowserJsPlumbInstance, _el: HTMLElement, pos: PointXY): boolean;
export declare const CLASS_DELEGATED_DRAGGABLE = "jtk-delegated-draggable";
export declare const CLASS_DROPPABLE = "jtk-droppable";
export declare const CLASS_DRAGGABLE = "jtk-draggable";
export declare const CLASS_DRAG_CONTAINER = "jtk-drag";
export declare const CLASS_GHOST_PROXY = "jtk-ghost-proxy";
export declare const CLASS_DRAG_SELECTED = "jtk-drag-selected";
export declare const CLASS_DRAG_ACTIVE = "jtk-drag-active";
export declare const CLASS_DRAGGED = "jtk-dragged";
export declare const CLASS_DRAG_HOVER = "jtk-drag-hover";
export declare const ATTR_NOT_DRAGGABLE = "jtk-not-draggable";
export declare const EVENT_DRAG_MOVE = "drag:move";
export declare const EVENT_DRAG_STOP = "drag:stop";
export declare const EVENT_DRAG_START = "drag:start";
export declare const EVENT_MOUSEDOWN = "mousedown";
export declare const EVENT_MOUSEMOVE = "mousemove";
export declare const EVENT_MOUSEUP = "mouseup";
export declare const EVENT_REVERT = "revert";
export declare const EVENT_ZOOM = "zoom";
export declare const EVENT_CONNECTION_ABORT = "connection:abort";
export declare const EVENT_CONNECTION_DRAG = "connection:drag";
export interface DragHandler {
    selector: string;
    onStart: (params: DragStartEventParams) => boolean;
    onDrag: (params: DragEventParams) => void;
    onStop: (params: DragStopEventParams) => void;
    onDragInit: (el: Element) => Element;
    onDragAbort: (el: Element) => void;
    reset: () => void;
    init: (drag: Drag) => void;
    onBeforeStart?: (beforeStartParams: BeforeStartEventParams) => void;
}
export interface GhostProxyingDragHandler extends DragHandler {
    useGhostProxy: (container: any, dragEl: Element) => boolean;
    makeGhostProxy?: GhostProxyGenerator;
}
export declare class DragManager {
    protected instance: BrowserJsPlumbInstance;
    private collicat;
    private drag;
    _draggables: Dictionary<any>;
    _dlist: Array<any>;
    _elementsWithEndpoints: Dictionary<any>;
    _draggablesForElements: Dictionary<any>;
    handlers: Array<{
        handler: DragHandler;
        options: DragHandlerOptions;
    }>;
    private _filtersToAdd;
    constructor(instance: BrowserJsPlumbInstance);
    addHandler(handler: DragHandler, dragOptions?: DragHandlerOptions): void;
    addFilter(filter: Function | string, exclude?: boolean): void;
    removeFilter(filter: Function | string): void;
    setFilters(filters: Array<[string, boolean]>): void;
    reset(): Array<[string, boolean]>;
    setOption(handler: DragHandler, options: DragHandlerOptions): void;
}

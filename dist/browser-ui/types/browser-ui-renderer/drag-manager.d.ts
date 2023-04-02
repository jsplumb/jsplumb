import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { BeforeStartEventParams, Drag, DragEventParams, DragHandlerOptions, DragStartEventParams, DragStopEventParams, GhostProxyGenerator } from "./collicat";
import { DragSelection } from "./drag-selection";
export declare const CLASS_DELEGATED_DRAGGABLE = "jtk-delegated-draggable";
export declare const CLASS_DRAGGABLE = "jtk-draggable";
export declare const CLASS_DRAG_CONTAINER = "jtk-drag";
export declare const CLASS_GHOST_PROXY = "jtk-ghost-proxy";
export declare const CLASS_DRAG_ACTIVE = "jtk-drag-active";
export declare const CLASS_DRAGGED = "jtk-dragged";
export declare const CLASS_DRAG_HOVER = "jtk-drag-hover";
export interface DragHandler {
    selector: string;
    onStart: (params: DragStartEventParams) => boolean;
    onDrag: (params: DragEventParams) => void;
    onStop: (params: DragStopEventParams) => void;
    onDragInit: (el: Element, e: MouseEvent) => Element;
    onDragAbort: (el: Element) => void;
    reset: () => void;
    init: (drag: Drag) => void;
    onBeforeStart?: (beforeStartParams: BeforeStartEventParams) => void;
}
export interface GhostProxyingDragHandler extends DragHandler {
    useGhostProxy: (container: any, dragEl: Element) => boolean;
    makeGhostProxy?: GhostProxyGenerator;
}
export interface DragManagerOptions {
    trackScroll?: boolean;
}
export declare class DragManager {
    protected instance: BrowserJsPlumbInstance;
    protected dragSelection: DragSelection;
    private collicat;
    private drag;
    _draggables: Record<string, any>;
    _dlist: Array<any>;
    _elementsWithEndpoints: Record<string, any>;
    _draggablesForElements: Record<string, any>;
    handlers: Array<{
        handler: DragHandler;
        options: DragHandlerOptions;
    }>;
    private _trackScroll;
    private _filtersToAdd;
    constructor(instance: BrowserJsPlumbInstance, dragSelection: DragSelection, options?: DragManagerOptions);
    addHandler(handler: DragHandler, dragOptions?: DragHandlerOptions): void;
    addSelector(params: DragHandlerOptions, atStart?: boolean): void;
    addFilter(filter: Function | string, exclude?: boolean): void;
    removeFilter(filter: Function | string): void;
    setFilters(filters: Array<[string, boolean]>): void;
    reset(): Array<[string, boolean]>;
    setOption(handler: DragHandler, options: DragHandlerOptions): void;
}
//# sourceMappingURL=drag-manager.d.ts.map
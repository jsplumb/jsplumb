import { Dictionary, PointXY, Size } from '@jsplumb/core';
import { EventManager } from "./event-manager";
import { jsPlumbDOMElement } from './element-facade';
export interface DragStartEventParams {
    e: Event;
    el: jsPlumbDOMElement;
    pos: PointXY;
    drag: Drag;
}
export interface DragEventParams extends DragStartEventParams {
}
export declare type RevertEventParams = jsPlumbDOMElement;
export interface BeforeStartEventParams extends DragStartEventParams {
}
export interface DragStopEventParams extends DragEventParams {
    finalPos: PointXY;
    selection: Array<[jsPlumbDOMElement, PointXY, Drag]>;
}
export declare const EVENT_START = "start";
export declare const EVENT_BEFORE_START = "beforeStart";
export declare const EVENT_DRAG = "drag";
export declare const EVENT_DROP = "drop";
export declare const EVENT_OVER = "over";
export declare const EVENT_OUT = "out";
export declare const EVENT_STOP = "stop";
declare abstract class Base {
    protected el: jsPlumbDOMElement;
    protected k: Collicat;
    abstract _class: string;
    uuid: string;
    private enabled;
    scopes: Array<string>;
    protected constructor(el: jsPlumbDOMElement, k: Collicat);
    setEnabled(e: boolean): void;
    isEnabled(): boolean;
    toggleEnabled(): void;
    addScope(scopes: string): void;
    removeScope(scopes: string): void;
    toggleScope(scopes: string): void;
}
export declare type GhostProxyGenerator = (el: Element) => Element;
export declare type Grid = [number, number];
declare enum ContainmentTypes {
    notNegative = "notNegative",
    parent = "parent",
    parentEnclosed = "parentEnclosed"
}
export declare type ContainmentType = keyof typeof ContainmentTypes;
export interface DragHandlerOptions {
    selector?: string;
    start?: (p: DragStartEventParams) => any;
    stop?: (p: DragStopEventParams) => any;
    drag?: (p: DragEventParams) => any;
    beforeStart?: (beforeStartParams: BeforeStartEventParams) => void;
    dragInit?: (el: Element) => any;
    dragAbort?: (el: Element) => any;
    ghostProxy?: GhostProxyGenerator | boolean;
    makeGhostProxy?: GhostProxyGenerator;
    useGhostProxy?: (container: any, dragEl: jsPlumbDOMElement) => boolean;
    ghostProxyParent?: Element;
    constrainFunction?: ConstrainFunction | boolean;
    revertFunction?: RevertFunction;
    filter?: string;
    filterExclude?: boolean;
    snapThreshold?: number;
    grid?: Grid;
    containment?: ContainmentType;
    containmentPadding?: number;
}
export interface DragParams extends DragHandlerOptions {
    rightButtonCanDrag?: boolean;
    consumeStartEvent?: boolean;
    clone?: boolean;
    scroll?: boolean;
    trackScroll?: boolean;
    multipleDrop?: boolean;
    canDrag?: Function;
    consumeFilteredEvents?: boolean;
    events?: Dictionary<Function>;
    parent?: any;
    ignoreZoom?: boolean;
    scope?: string;
}
export declare class Drag extends Base {
    _class: string;
    rightButtonCanDrag: boolean;
    consumeStartEvent: boolean;
    clone: boolean;
    scroll: boolean;
    trackScroll: boolean;
    private _downAt;
    private _posAtDown;
    private _pagePosAtDown;
    private _pageDelta;
    private _moving;
    private _lastPosition;
    private _lastScrollValues;
    private _initialScroll;
    _size: Size;
    private _currentParentPosition;
    private _ghostParentPosition;
    private _dragEl;
    private _multipleDrop;
    private _ghostProxyOffsets;
    private _ghostDx;
    private _ghostDy;
    _isConstrained: boolean;
    _ghostProxyParent: jsPlumbDOMElement;
    _useGhostProxy: Function;
    _ghostProxyFunction: GhostProxyGenerator;
    _activeSelectorParams: DragParams;
    _availableSelectors: Array<DragParams>;
    _canDrag: Function;
    private _consumeFilteredEvents;
    private _parent;
    private _ignoreZoom;
    _filters: Dictionary<[Function, boolean]>;
    _constrainRect: {
        w: number;
        h: number;
    };
    _elementToDrag: jsPlumbDOMElement;
    downListener: (e: MouseEvent) => void;
    moveListener: (e: MouseEvent) => void;
    upListener: (e?: MouseEvent) => void;
    listeners: Dictionary<Array<Function>>;
    constructor(el: jsPlumbDOMElement, params: DragParams, k: Collicat);
    on(evt: string, fn: Function): void;
    off(evt: string, fn: Function): void;
    private _upListener;
    private _downListener;
    private _moveListener;
    private mark;
    private unmark;
    moveBy(dx: number, dy: number, e?: Event): void;
    abort(): void;
    getDragElement(retrieveOriginalElement?: boolean): jsPlumbDOMElement;
    stop(e?: MouseEvent, force?: boolean): void;
    private _dispatch;
    private resolveGrid;
    /**
     * Snap the given position to a grid, if the active selector has declared a grid.
     * @param pos
     */
    private toGrid;
    setUseGhostProxy(val: boolean): void;
    private _doConstrain;
    _testFilter(e: any): boolean;
    addFilter(f: Function | string, _exclude?: boolean): void;
    removeFilter(f: Function | string): void;
    clearAllFilters(): void;
    addSelector(params: DragHandlerOptions, atStart?: boolean): void;
    destroy(): void;
}
export declare type ConstrainFunction = (desiredLoc: PointXY, dragEl: HTMLElement, constrainRect: Size, size: Size) => PointXY;
export declare type RevertFunction = (dragEl: HTMLElement, pos: PointXY) => boolean;
export interface CollicatOptions {
    zoom?: number;
    css?: Dictionary<string>;
    inputFilterSelector?: string;
}
export interface jsPlumbDragManager {
    getZoom(): number;
    setZoom(z: number): void;
    getInputFilterSelector(): string;
    setInputFilterSelector(selector: string): void;
    draggable(el: jsPlumbDOMElement, params: DragParams): Drag;
    destroyDraggable(el: jsPlumbDOMElement): void;
}
export declare class Collicat implements jsPlumbDragManager {
    eventManager: EventManager;
    private zoom;
    css: Dictionary<string>;
    inputFilterSelector: string;
    constructor(options?: CollicatOptions);
    getZoom(): number;
    setZoom(z: number): void;
    private _prepareParams;
    /**
     * Gets the selector identifying which input elements to filter from drag events.
     * @method getInputFilterSelector
     * @return {String} Current input filter selector.
     */
    getInputFilterSelector(): string;
    /**
     * Sets the selector identifying which input elements to filter from drag events.
     * @method setInputFilterSelector
     * @param {String} selector Input filter selector to set.
     * @return {Collicat} Current instance; method may be chained.
     */
    setInputFilterSelector(selector: string): this;
    draggable(el: jsPlumbDOMElement, params: DragParams): Drag;
    destroyDraggable(el: jsPlumbDOMElement): void;
}
export {};

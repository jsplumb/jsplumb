import { Dictionary, PointXY, Size } from '@jsplumb/core';
import { EventManager } from "./event-manager";
import { jsPlumbDOMElement } from './element-facade';
export interface DragStartEventParams {
    e: MouseEvent;
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
    constrain?: ConstrainFunction | boolean;
    revert?: RevertFunction;
    filter?: string;
    filterExclude?: boolean;
    snapThreshold?: number;
    grid?: Grid;
    allowNegative?: boolean;
}
export interface DragParams extends DragHandlerOptions {
    rightButtonCanDrag?: boolean;
    consumeStartEvent?: boolean;
    clone?: boolean;
    scroll?: boolean;
    multipleDrop?: boolean;
    containment?: boolean;
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
    private _downAt;
    private _posAtDown;
    private _pagePosAtDown;
    private _pageDelta;
    private _moving;
    private _initialScroll;
    _size: Size;
    private _currentParentPosition;
    private _ghostParentPosition;
    private _dragEl;
    private _multipleDrop;
    private _ghostProxyOffsets;
    private _ghostDx;
    private _ghostDy;
    _ghostProxyParent: jsPlumbDOMElement;
    _isConstrained: boolean;
    _useGhostProxy: Function;
    _activeSelectorParams: DragParams;
    _availableSelectors: Array<DragParams>;
    _ghostProxyFunction: GhostProxyGenerator;
    _snapThreshold: number;
    _grid: Grid;
    _allowNegative: boolean;
    _constrain: ConstrainFunction;
    _revertFunction: RevertFunction;
    _canDrag: Function;
    private _consumeFilteredEvents;
    private _parent;
    private _ignoreZoom;
    _filters: Dictionary<[Function, any]>;
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
    moveBy(dx: number, dy: number, e?: MouseEvent): void;
    abort(): void;
    getDragElement(retrieveOriginalElement?: boolean): jsPlumbDOMElement;
    stop(e?: MouseEvent, force?: boolean): void;
    private _dispatch;
    private _snap;
    private resolveGrid;
    toGrid(pos: PointXY): PointXY;
    setUseGhostProxy(val: boolean): void;
    private _negativeFilter;
    /**
     * Sets whether or not the Drag is constrained. A value of 'true' means constrain to parent bounds; a function
     * will be executed and returns true if the position is allowed.
     * @param value
     */
    setConstrain(value: ConstrainFunction | boolean): void;
    private _doConstrain;
    /**
     * Sets a function to call on drag stop, which, if it returns true, indicates that the given element should
     * revert to its position before the previous drag.
     * @param fn
     */
    setRevert(fn: RevertFunction): void;
    private _assignId;
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
    constrain?: ConstrainFunction;
    revert?: RevertFunction;
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
    constrain: ConstrainFunction;
    revert: RevertFunction;
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

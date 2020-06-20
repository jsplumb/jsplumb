/**
 A Typescript port of Katavorio, without Droppables or Posses, as the code
 does that for itself now.
*/
import { BoundingBox, Dictionary, PointArray } from "../core";
import { EventManager } from "./event-manager";
export interface DragSelector {
    filter?: string;
    filterExclude?: boolean;
    selector: string;
}
declare abstract class Base {
    protected el: HTMLElement;
    protected k: Collicat;
    abstract _class: string;
    uuid: string;
    private enabled;
    scopes: Array<string>;
    constructor(el: HTMLElement, k: Collicat);
    setEnabled(e: boolean): void;
    isEnabled(): boolean;
    toggleEnabled(): void;
    addScope(scopes: string): void;
    removeScope(scopes: string): void;
    toggleScope(scopes: string): void;
}
export declare type GhostProxyGenerator = (el: HTMLElement) => HTMLElement;
export interface DragParams {
    rightButtonCanDrag?: boolean;
    consumeStartEvent?: boolean;
    clone?: boolean;
    scroll?: boolean;
    multipleDrop?: boolean;
    ghostProxy?: GhostProxyGenerator | boolean;
    makeGhostProxy?: GhostProxyGenerator;
    selector?: string;
    snapThreshold?: number;
    grid?: PointArray;
    allowNegative?: boolean;
    constrain?: ConstrainFunction | boolean;
    containment?: boolean;
    revert?: RevertFunction;
    canDrag?: Function;
    consumeFilteredEvents?: boolean;
    events?: Dictionary<Function>;
    parent?: any;
    ignoreZoom?: boolean;
    ghostProxyParent?: HTMLElement;
    filter?: string;
    filterExclude?: boolean;
}
export interface DragSelector {
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
    private _size;
    private _currentParentPosition;
    private _ghostParentPosition;
    private _dragEl;
    private _multipleDrop;
    private _ghostProxyOffsets;
    private _ghostDx;
    private _ghostDy;
    _ghostProxyParent: HTMLElement;
    _isConstrained: boolean;
    _useGhostProxy: Function;
    _activeSelectorParams: any;
    _availableSelectors: Array<DragParams>;
    _ghostProxyFunction: GhostProxyGenerator;
    _snapThreshold: number;
    _grid: PointArray;
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
    _matchingDroppables: Array<any>;
    _intersectingDroppables: Array<any>;
    _elementToDrag: any;
    downListener: (e: MouseEvent) => void;
    moveListener: (e: MouseEvent) => void;
    upListener: (e?: MouseEvent) => void;
    listeners: Dictionary<Array<Function>>;
    constructor(el: HTMLElement, params: DragParams, k: Collicat);
    on(evt: string, fn: Function): void;
    off(evt: string, fn: Function): void;
    private _upListener;
    private _downListener;
    private _moveListener;
    mark(payload: any, andNotify?: boolean): void;
    unmark(e: MouseEvent): void;
    moveBy(dx: number, dy: number, e?: MouseEvent): void;
    abort(): void;
    getDragElement(retrieveOriginalElement?: boolean): any;
    stop(e?: MouseEvent, force?: boolean): void;
    private notifyStart;
    private _dispatch;
    private _snap;
    toGrid(pos: PointArray): PointArray;
    snap(x: number, y: number): PointArray;
    setUseGhostProxy(val: boolean): void;
    private _negativeFilter;
    private _setConstrain;
    /**
     * Sets whether or not the Drag is constrained. A value of 'true' means constrain to parent bounds; a function
     * will be executed and returns true if the position is allowed.
     * @param value
     */
    setConstrain(value: boolean): void;
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
    addSelector(params: any): void;
    destroy(): void;
}
export declare type ConstrainFunction = (desiredLoc: PointArray, dragEl: HTMLElement, constrainRect: BoundingBox, size: PointArray) => PointArray;
export declare type RevertFunction = (dragEl: HTMLElement, pos: PointArray) => boolean;
export interface CollicatOptions {
    zoom?: number;
    css?: Dictionary<string>;
    inputFilterSelector?: string;
    constrain?: ConstrainFunction;
    revert?: RevertFunction;
}
export declare class Collicat {
    eventManager: EventManager;
    private zoom;
    css: Dictionary<string>;
    inputFilterSelector: string;
    constrain: ConstrainFunction;
    revert: RevertFunction;
    constructor(options?: CollicatOptions);
    getZoom(): number;
    setZoom(z: number): void;
    _prepareParams(p: DragParams): DragParams;
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
     * @return {Katavorio} Current instance; method may be chained.
     */
    setInputFilterSelector(selector: string): this;
    draggable(el: any, params: DragParams): Drag;
    destroyDraggable(el: any): void;
}
export {};

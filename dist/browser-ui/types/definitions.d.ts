import { ConnectorBase, Endpoint, JsPlumbDefaults, jsPlumbElement, OverlayBase } from "@jsplumb/core";
import { Grid, PointXY, Size } from "@jsplumb/util";
import { Drag, GhostProxyGenerator } from "./collicat";
import { PaintStyle } from "@jsplumb/common";
/**
 * Definition of a function that can be used to constrain the movemement of an element that is being dragged. The function is
 * given the "desiredLoc", which is the location the element would be moved to if not constrained, and it is expected to return
 * either some other value, meaning place the element at that position, or null, meaning for the given desired location there
 * is no preferred position and the element should not be moved.
 *
 * @param desiredLoc - Position the element will be placed at if unconstrained
 * @param dragEl - the element that is being dragged
 * @param constrainRect - The size of any parent drag area
 * @param size - The size of the element being dragged
 * @param e - The mouse event associated with this tick of the drag lifecycle.
 */
export declare type ConstrainFunction = (desiredLoc: PointXY, dragEl: HTMLElement, constrainRect: Size, size: Size, e: MouseEvent) => PointXY;
export declare type RevertFunction = (dragEl: HTMLElement, pos: PointXY) => boolean;
export interface jsPlumbDOMElement extends HTMLElement, jsPlumbElement<Element> {
    _isJsPlumbGroup: boolean;
    _jsPlumbOrphanedEndpoints: Array<Endpoint>;
    offsetParent: jsPlumbDOMElement;
    parentNode: jsPlumbDOMElement;
    jtk: jsPlumbDOMInformation;
    _jsPlumbScrollHandler?: Function;
    _katavorioDrag?: Drag;
    cloneNode: (deep?: boolean) => jsPlumbDOMElement;
}
export interface UIComponent {
    canvas: HTMLElement;
    svg: SVGElement;
}
export declare type EndpointHelperFunctions<E> = {
    makeNode: (ep: E, paintStyle: PaintStyle) => void;
    updateNode: (ep: E, node: SVGElement) => void;
};
export interface DragStartEventParams {
    e: MouseEvent;
    el: jsPlumbDOMElement;
    pos: PointXY;
    drag: Drag;
    size: Size;
}
export interface DragEventParams extends DragStartEventParams {
    originalPos: PointXY;
}
export declare type RevertEventParams = jsPlumbDOMElement;
export interface BeforeStartEventParams extends DragStartEventParams {
}
export interface DragStopEventParams extends DragEventParams {
    finalPos: PointXY;
    selection: Array<[jsPlumbDOMElement, PointXY, Drag, Size]>;
}
export declare enum ContainmentType {
    notNegative = "notNegative",
    parent = "parent",
    parentEnclosed = "parentEnclosed"
}
/**
 * @internal
 */
export declare type GridResolver = () => Grid;
/**
 * @internal
 */
export interface DragHandlerOptions {
    selector?: string;
    start?: (p: DragStartEventParams) => any;
    stop?: (p: DragStopEventParams) => any;
    drag?: (p: DragEventParams) => any;
    beforeStart?: (beforeStartParams: BeforeStartEventParams) => void;
    dragInit?: (el: Element, e: MouseEvent) => any;
    dragAbort?: (el: Element) => any;
    ghostProxy?: GhostProxyGenerator | boolean;
    makeGhostProxy?: GhostProxyGenerator;
    useGhostProxy?: (container: any, dragEl: jsPlumbDOMElement) => boolean;
    ghostProxyParent?: Element;
    constrainFunction?: ConstrainFunction | boolean;
    revertFunction?: RevertFunction;
    filter?: string;
    filterExclude?: boolean;
    resolveGrid: GridResolver;
    snapThreshold?: number;
    grid?: Grid;
    containment?: ContainmentType;
    containmentPadding?: number;
}
export interface DragParams {
    rightButtonCanDrag?: boolean;
    consumeStartEvent?: boolean;
    clone?: boolean;
    scroll?: boolean;
    trackScroll?: boolean;
    multipleDrop?: boolean;
    canDrag?: Function;
    consumeFilteredEvents?: boolean;
    events?: Record<string, Function>;
    parent?: any;
    ignoreZoom?: boolean;
    scope?: string;
}
export interface DragOptions {
    containment?: ContainmentType;
    start?: (params: DragStartEventParams) => void;
    drag?: (params: DragEventParams) => void;
    stop?: (params: DragStopEventParams) => void;
    beforeStart?: (params: BeforeStartEventParams) => void;
    cursor?: string;
    zIndex?: number;
    trackScroll?: boolean;
    filter?: string;
}
/**
 * Defaults for the BrowserUI implementation of jsPlumb.
 * @public
 */
export interface BrowserJsPlumbDefaults extends JsPlumbDefaults<Element> {
    /**
     * Whether or not elements should be draggable. Default value is `true`.
     */
    elementsDraggable?: boolean;
    /**
     * Options for dragging - containment, grid, callbacks etc.
     */
    dragOptions?: DragOptions;
    /**
     * Specifies the CSS selector used to identify managed elements. This option is not something that most users of
     * jsPlumb will need to set.
     */
    managedElementsSelector?: string;
    /**
     * Defaults to true, indicating that a ResizeObserver will be used, where available, to allow jsPlumb to revalidate elements
     * whose size in the DOM have been changed, without the library user having to call `revalidate()`
     */
    resizeObserver?: boolean;
}
/**
 * @internal
 */
export interface jsPlumbDOMInformation {
    connector?: ConnectorBase;
    endpoint?: Endpoint;
    overlay?: OverlayBase;
}
/**
 * Definition of a drag group membership - either just the id of a drag group, or the id of a drag group and whether or not
 * this element plays an `active` role in the drag group.
 * @public
 */
export declare type DragGroupSpec = string | {
    id: string;
    active: boolean;
};
//# sourceMappingURL=definitions.d.ts.map
import { jsPlumbDefaults, Dictionary, Offset, PointArray, Size, jsPlumbElement, TypeDescriptor, JsPlumbInstance, AbstractConnector, Endpoint, Overlay, RedrawResult, PaintStyle, OverlayCapableComponent, Segment, LabelOverlay, Connection, Component, DeleteConnectionOptions } from '@jsplumb/core';
import { DragManager } from "./drag-manager";
import { EventManager } from "./event-manager";
import { CollicatOptions, Collicat, Drag } from './collicat';
import { JsPlumbList, JsPlumbListManager, JsPlumbListOptions } from "./lists";
export interface UIComponent {
    canvas: HTMLElement;
    svg: SVGElement;
}
export declare type EndpointHelperFunctions<E> = {
    makeNode: (ep: E, paintStyle: PaintStyle) => void;
    updateNode: (ep: E, node: SVGElement) => void;
};
export declare function registerEndpointRenderer<C>(name: string, fns: EndpointHelperFunctions<C>): void;
export interface DragEventCallbackOptions {
    /**
     * Associated Drag instance
     */
    drag: {
        _size: [number, number];
        getDragElement: () => Element;
    };
    /**
     * Current mouse event for the drag
     */
    e: MouseEvent;
    /**
     * Element being dragged
     */
    el: Element;
    /**
     * x,y location of the element. provided on the `drag` event only.
     */
    pos?: [number, number];
}
export interface DragOptions {
    containment?: string;
    start?: (params: DragEventCallbackOptions) => void;
    drag?: (params: DragEventCallbackOptions) => void;
    stop?: (params: DragEventCallbackOptions) => void;
    cursor?: string;
    zIndex?: number;
}
export interface BrowserJsPlumbDefaults extends jsPlumbDefaults<Element> {
    /**
     * Whether or not elements should be draggable. Default value is `true`.
     */
    elementsDraggable?: boolean;
    /**
     * Options for dragging - containment, grid, callbacks etc.
     */
    dragOptions?: DragOptions;
}
export interface jsPlumbDOMInformation {
    connector?: AbstractConnector;
    endpoint?: Endpoint;
    overlay?: Overlay;
}
export declare type ElementType = {
    E: Element;
};
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
export declare type DragGroupSpec = string | {
    id: string;
    active: boolean;
};
/**
 * JsPlumbInstance that renders to the DOM in a browser, and supports dragging of elements/connections.
 *
 */
export declare class BrowserJsPlumbInstance extends JsPlumbInstance<ElementType> {
    _instanceIndex: number;
    dragManager: DragManager;
    _connectorClick: Function;
    _connectorDblClick: Function;
    _endpointClick: Function;
    _endpointDblClick: Function;
    _overlayClick: Function;
    _overlayDblClick: Function;
    _connectorMouseover: Function;
    _connectorMouseout: Function;
    _endpointMouseover: Function;
    _endpointMouseout: Function;
    _overlayMouseover: Function;
    _overlayMouseout: Function;
    _elementClick: Function;
    _elementMouseenter: Function;
    _elementMouseexit: Function;
    _elementMousemove: Function;
    eventManager: EventManager;
    listManager: JsPlumbListManager;
    draggingClass: string;
    elementDraggingClass: string;
    hoverClass: string;
    sourceElementDraggingClass: string;
    targetElementDraggingClass: string;
    hoverSourceClass: string;
    hoverTargetClass: string;
    dragSelectClass: string;
    /**
     * Whether or not elements should be draggable. This can be provided in the constructor arguments, or simply toggled on the
     * class. The default value is `true`.
     */
    elementsDraggable: boolean;
    private elementDragHandler;
    constructor(_instanceIndex: number, defaults?: BrowserJsPlumbDefaults);
    addDragFilter(filter: Function | string, exclude?: boolean): void;
    removeDragFilter(filter: Function | string): void;
    removeElement(element: Element): void;
    appendElement(el: Element, parent: Element): void;
    getChildElements(el: Element): Array<Element>;
    _getAssociatedElements(el: Element): Array<Element>;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    getClass(el: Element): string;
    addClass(el: Element, clazz: string): void;
    hasClass(el: Element, clazz: string): boolean;
    removeClass(el: Element, clazz: string): void;
    toggleClass(el: Element, clazz: string): void;
    setAttribute(el: Element, name: string, value: string): void;
    getAttribute(el: Element, name: string): string;
    setAttributes(el: Element, atts: Dictionary<string>): void;
    removeAttribute(el: Element, attName: string): void;
    on(el: Element, event: string, callbackOrSelector: Function | string, callback?: Function): this;
    off(el: Element, event: string, callback: Function): this;
    trigger(el: Element, event: string, originalEvent?: Event, payload?: any): void;
    getOffsetRelativeToRoot(el: Element): Offset;
    getOffset(el: Element): Offset;
    getSize(el: Element): Size;
    getStyle(el: Element, prop: string): any;
    getSelector(ctx: string | Element, spec: string): NodeListOf<jsPlumbDOMElement>;
    setPosition(el: Element, p: Offset): void;
    static getPositionOnElement(evt: Event, el: Element, zoom: number): PointArray;
    setDraggable(element: Element, draggable: boolean): void;
    isDraggable(el: Element): boolean;
    toggleDraggable(el: Element): boolean;
    private _attachEventDelegates;
    private _detachEventDelegates;
    setContainer(newContainer: Element): void;
    reset(silently?: boolean): void;
    destroy(): void;
    unmanage(el: Element, removeElement?: boolean): void;
    addToDragSelection(...el: Array<Element>): void;
    clearDragSelection(): void;
    removeFromDragSelection(...el: Array<Element>): void;
    toggleDragSelection(...el: Array<Element>): void;
    getDragSelection(): Array<Element>;
    /**
     * Adds the given element(s) to the given drag group.
     * @param spec Either the ID of some drag group, in which case the elements are all added as 'active', or an object of the form
     * { id:"someId", active:boolean }. In the latter case, `active`, if true, which is the default, indicates whether
     * dragging the given element(s) should cause all the elements in the drag group to be dragged. If `active` is false it means the
     * given element(s) is "passive" and should only move when an active member of the drag group is dragged.
     * @param els Elements to add to the drag group.
     */
    addToDragGroup(spec: DragGroupSpec, ...els: Array<Element>): void;
    /**
     * Removes the given element(s) from any drag group they may be in. You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param els Elements to remove from drag groups.
     */
    removeFromDragGroup(...els: Array<Element>): void;
    /**
     * Sets the active/passive state for the given element(s).You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param state true for active, false for passive.
     * @param els
     */
    setDragGroupState(state: boolean, ...els: Array<Element>): void;
    /**
     * Consumes the given event.
     * @param e
     * @param doNotPreventDefault
     */
    consume(e: Event, doNotPreventDefault?: boolean): void;
    /**
     * Adds a managed list to the instance.
     * @param el Element containing the list.
     * @param options
     */
    addList(el: Element, options?: JsPlumbListOptions): JsPlumbList;
    /**
     * Removes a managed list from the instance
     * @param el Element containing the list.
     */
    removeList(el: Element): void;
    /**
     * Helper method for other libs/code to get a DragManager.
     * @param options
     */
    createDragManager(options: CollicatOptions): Collicat;
    rotate(element: Element, rotation: number, doNotRepaint?: boolean): RedrawResult;
    svg: {
        node: (name: string, attributes?: Dictionary<string | number>) => jsPlumbDOMElement;
        attr: (node: SVGElement, attributes: Dictionary<string | number>) => void;
        pos: (d: [number, number]) => string;
    };
    getPath(segment: Segment, isFirstSegment: boolean): string;
    addOverlayClass(o: Overlay, clazz: string): void;
    removeOverlayClass(o: Overlay, clazz: string): void;
    paintOverlay(o: Overlay, params: any, extents: any): void;
    setOverlayVisible(o: Overlay, visible: boolean): void;
    reattachOverlay(o: Overlay, c: OverlayCapableComponent): void;
    setOverlayHover(o: Overlay, hover: boolean): void;
    destroyOverlay(o: Overlay): void;
    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: [number, number]): any;
    updateLabel(o: LabelOverlay): void;
    setHover(component: Component, hover: boolean): void;
    paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: any): void;
    setConnectorHover(connector: AbstractConnector, h: boolean, doNotCascade?: boolean): void;
    destroyConnection(connection: Connection): void;
    addConnectorClass(connector: AbstractConnector, clazz: string): void;
    removeConnectorClass(connector: AbstractConnector, clazz: string): void;
    getConnectorClass(connector: AbstractConnector): string;
    setConnectorVisible(connector: AbstractConnector, v: boolean): void;
    applyConnectorType(connector: AbstractConnector, t: TypeDescriptor): void;
    addEndpointClass(ep: Endpoint, c: string): void;
    applyEndpointType<C>(ep: Endpoint, t: TypeDescriptor): void;
    destroyEndpoint(ep: Endpoint): void;
    renderEndpoint(ep: Endpoint, paintStyle: PaintStyle): void;
    removeEndpointClass(ep: Endpoint, c: string): void;
    getEndpointClass(ep: Endpoint): string;
    setEndpointHover(endpoint: Endpoint, h: boolean, doNotCascade?: boolean): void;
    setEndpointVisible(ep: Endpoint, v: boolean): void;
    deleteConnection(connection: Connection, params?: DeleteConnectionOptions): boolean;
}

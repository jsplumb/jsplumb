import { jsPlumbDefaults, jsPlumbHelperFunctions, Dictionary, SourceDefinition, TargetDefinition, Offset, PointArray, Size, jsPlumbElement, TypeDescriptor, JsPlumbInstance, UIGroup, AbstractConnector, Endpoint, Overlay, RedrawResult, PaintStyle, OverlayCapableComponent, Segment, LabelOverlay, Connection, Component } from '@jsplumb/community-core';
import { ElementAttributes } from './svg-util';
import { DragManager } from "./drag-manager";
import { EventManager } from "./event-manager";
import { CollicatOptions, Collicat, Drag } from './collicat';
import { jsPlumbList, jsPlumbListManager, jsPlumbListOptions } from "./lists";
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
        getDragElement: () => jsPlumbDOMElement;
    };
    /**
     * Current mouse event for the drag
     */
    e: MouseEvent;
    /**
     * Element being dragged
     */
    el: jsPlumbDOMElement;
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
export interface BrowserJsPlumbDefaults extends jsPlumbDefaults {
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
export interface jsPlumbDOMElement extends HTMLElement, jsPlumbElement {
    _jsPlumbGroup: UIGroup;
    _jsPlumbParentGroup: UIGroup;
    _isJsPlumbGroup: boolean;
    _jsPlumbOrphanedEndpoints: Array<Endpoint>;
    offsetParent: HTMLElement;
    getAttribute: (name: string) => string;
    parentNode: jsPlumbDOMElement;
    jtk: jsPlumbDOMInformation;
    _jsPlumbTargetDefinitions: Array<TargetDefinition>;
    _jsPlumbSourceDefinitions: Array<SourceDefinition>;
    _jsPlumbList: any;
    _jsPlumbScrollHandler?: Function;
    _katavorioDrag?: Drag;
    _jspContext?: any;
}
export declare type DragGroupSpec = string | {
    id: string;
    active: boolean;
};
/**
 * JsPlumbInstance that renders to the DOM in a browser, and supports dragging of elements/connections.
 *
 */
export declare class BrowserJsPlumbInstance extends JsPlumbInstance {
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
    listManager: jsPlumbListManager;
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
    constructor(_instanceIndex: number, defaults?: BrowserJsPlumbDefaults, helpers?: jsPlumbHelperFunctions);
    addDragFilter(filter: Function | string, exclude?: boolean): void;
    removeDragFilter(filter: Function | string): void;
    getElement(el: HTMLElement | string): HTMLElement;
    getElementById(elId: string): HTMLElement;
    removeElement(element: any): void;
    appendElement(el: HTMLElement, parent: HTMLElement): void;
    _getAssociatedElements(el: HTMLElement): Array<HTMLElement>;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    getClass(el: HTMLElement): string;
    addClass(el: HTMLElement, clazz: string): void;
    hasClass(el: HTMLElement, clazz: string): boolean;
    removeClass(el: HTMLElement, clazz: string): void;
    toggleClass(el: HTMLElement, clazz: string): void;
    setAttribute(el: HTMLElement, name: string, value: string): void;
    getAttribute(el: HTMLElement, name: string): string;
    setAttributes(el: HTMLElement, atts: Dictionary<string>): void;
    removeAttribute(el: HTMLElement, attName: string): void;
    on(el: HTMLElement, event: string, callbackOrSelector: Function | string, callback?: Function): this;
    off(el: HTMLElement, event: string, callback: Function): this;
    trigger(el: HTMLElement, event: string, originalEvent?: Event, payload?: any): void;
    _getOffsetRelativeToRoot(el: HTMLElement): Offset;
    _getOffset(el: HTMLElement): Offset;
    _getSize(el: HTMLElement): Size;
    getStyle(el: HTMLElement, prop: string): any;
    getSelector(ctx: string | HTMLElement, spec: string): NodeListOf<any>;
    setPosition(el: HTMLElement, p: Offset): void;
    static getPositionOnElement(evt: Event, el: HTMLElement, zoom: number): PointArray;
    setDraggable(element: HTMLElement, draggable: boolean): void;
    isDraggable(el: HTMLElement): boolean;
    toggleDraggable(el: HTMLElement): boolean;
    private _attachEventDelegates;
    private _detachEventDelegates;
    setContainer(c: string | jsPlumbDOMElement): void;
    reset(silently?: boolean): void;
    destroy(): void;
    unmanage(el: jsPlumbDOMElement, removeElement?: boolean): void;
    addToDragSelection(...el: Array<string | jsPlumbDOMElement>): void;
    clearDragSelection(): void;
    removeFromDragSelection(...el: Array<jsPlumbDOMElement>): void;
    toggleDragSelection(...el: Array<string | jsPlumbDOMElement>): void;
    getDragSelection(): Array<jsPlumbDOMElement>;
    /**
     * Adds the given element(s) to the given drag group.
     * @param spec Either the ID of some drag group, in which case the elements are all added as 'active', or an object of the form
     * { id:"someId", active:boolean }. In the latter case, `active`, if true, which is the default, indicates whether
     * dragging the given element(s) should cause all the elements in the drag group to be dragged. If `active` is false it means the
     * given element(s) is "passive" and should only move when an active member of the drag group is dragged.
     * @param els Elements to add to the drag group.
     */
    addToDragGroup(spec: DragGroupSpec, ...els: Array<jsPlumbDOMElement>): void;
    /**
     * Removes the given element(s) from any drag group they may be in. You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param els Elements to remove from drag groups.
     */
    removeFromDragGroup(...els: Array<jsPlumbDOMElement>): void;
    /**
     * Sets the active/passive state for the given element(s).You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param state true for active, false for passive.
     * @param els
     */
    setDragGroupState(state: boolean, ...els: Array<jsPlumbDOMElement>): void;
    /**
     * Consumes the given event.
     * @param e
     * @param doNotPreventDefault
     */
    consume(e: Event, doNotPreventDefault?: boolean): void;
    addList(el: jsPlumbDOMElement, options?: jsPlumbListOptions): jsPlumbList;
    removeList(el: jsPlumbDOMElement): void;
    /**
     * Helper method for other libs/code to get a DragManager.
     * @param options
     */
    createDragManager(options: CollicatOptions): Collicat;
    rotate(elementId: string, rotation: number, doNotRepaint?: boolean): RedrawResult;
    svg: {
        node: (name: string, attributes?: ElementAttributes) => jsPlumbDOMElement;
        attr: (node: SVGElement, attributes: ElementAttributes) => void;
        pos: (d: [number, number]) => string;
    };
    getPath(segment: Segment, isFirstSegment: boolean): string;
    addOverlayClass(o: Overlay, clazz: string): void;
    removeOverlayClass(o: Overlay, clazz: string): void;
    paintOverlay(o: Overlay, params: any, extents: any): void;
    setOverlayVisible(o: Overlay, visible: boolean): void;
    moveOverlayParent(o: Overlay, newParent: HTMLElement): void;
    reattachOverlay(o: Overlay, c: OverlayCapableComponent): any;
    setOverlayHover(o: Overlay, hover: boolean): any;
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
    paintEndpoint<C>(ep: Endpoint, paintStyle: PaintStyle): void;
    removeEndpointClass<C>(ep: Endpoint, c: string): void;
    getEndpointClass(ep: Endpoint): string;
    refreshEndpoint(endpoint: Endpoint): void;
    setEndpointHover(endpoint: Endpoint, h: boolean, doNotCascade?: boolean): void;
    setEndpointVisible<C>(ep: Endpoint, v: boolean): void;
}

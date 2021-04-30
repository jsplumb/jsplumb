import { jsPlumbDefaults, Dictionary, Size, TypeDescriptor, JsPlumbInstance, AbstractConnector, Endpoint, Overlay, RedrawResult, PaintStyle, OverlayCapableComponent, Segment, LabelOverlay, Connection, Component, DeleteConnectionOptions, PointXY, BehaviouralTypeDescriptor, SourceSelector } from '@jsplumb/core';
import { DragManager } from "./drag-manager";
import { jsPlumbDOMElement } from './element-facade';
import { EventManager } from "./event-manager";
import { DragStartEventParams, DragEventParams, DragStopEventParams, ContainmentType } from './collicat';
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
export declare function getPositionOnElement(evt: Event, el: Element, zoom: number): PointXY;
export interface DragOptions {
    containment?: ContainmentType;
    start?: (params: DragStartEventParams) => void;
    drag?: (params: DragEventParams) => void;
    stop?: (params: DragStopEventParams) => void;
    cursor?: string;
    zIndex?: number;
    grid?: [number, number];
    trackScroll?: boolean;
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
    _connectorTap: Function;
    _connectorDblTap: Function;
    _endpointClick: Function;
    _endpointDblClick: Function;
    _overlayClick: Function;
    _overlayDblClick: Function;
    _overlayTap: Function;
    _overlayDblTap: Function;
    _connectorMouseover: Function;
    _connectorMouseout: Function;
    _endpointMouseover: Function;
    _endpointMouseout: Function;
    _overlayMouseover: Function;
    _overlayMouseout: Function;
    _elementClick: Function;
    _elementTap: Function;
    _elementDblTap: Function;
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
    private groupDragOptions;
    private elementDragOptions;
    constructor(_instanceIndex: number, defaults?: BrowserJsPlumbDefaults);
    /**
     * Adds a filter to the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter CSS3 selector, or function that takes an element and returns true/false
     * @param exclude If true, the filter is inverted: anything _but_ this value.
     */
    addDragFilter(filter: Function | string, exclude?: boolean): void;
    /**
     * Removes a filter from the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter CSS3 selector, or function that takes an element and returns true/false
     */
    removeDragFilter(filter: Function | string): void;
    /**
     * Sets the grid that should be used when dragging elements.
     * @param grid [x, y] grid.
     */
    setDragGrid(grid: [number, number]): void;
    _removeElement(element: Element): void;
    _appendElement(el: Element, parent: Element): void;
    _getChildElements(el: Element): Array<Element>;
    _getAssociatedElements(el: Element): Array<Element>;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    getClass(el: Element): string;
    /**
     * Add one or more classes to the given element or list of elements.
     * @param el Element, or list of elements to which to add the class(es)
     * @param clazz A space separated list of classes to add.
     */
    addClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Returns whether or not the given element has the given class.
     * @param el
     * @param clazz
     */
    hasClass(el: Element, clazz: string): boolean;
    /**
     * Remove one or more classes from the given element or list of elements.
     * @param el Element, or list of elements from which to remove the class(es)
     * @param clazz A space separated list of classes to remove.
     */
    removeClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Toggles one or more classes on the given element or list of elements.
     * @param el Element, or list of elements on which to toggle the class(es)
     * @param clazz A space separated list of classes to toggle.
     */
    toggleClass(el: Element | NodeListOf<Element>, clazz: string): void;
    setAttribute(el: Element, name: string, value: string): void;
    getAttribute(el: Element, name: string): string;
    setAttributes(el: Element, atts: Dictionary<string>): void;
    removeAttribute(el: Element, attName: string): void;
    /**
     * Bind an event listener to the given element or elements.
     * @param el Element, or elements, to bind the event listener to.
     * @param event Name of the event to bind to.
     * @param callbackOrSelector Either a callback function, or a CSS 3 selector. When this is a selector the event listener is bound as a "delegate", ie. the event listeners
     * listens to events on children of the given `el` that match the selector.
     * @param callback Callback function for event. Only supplied when you're binding a delegated event handler.
     */
    on(el: Document | Element | NodeListOf<Element>, event: string, callbackOrSelector: Function | string, callback?: Function): this;
    /**
     * Remove an event binding from the given element or elements.
     * @param el Element, or elements, from which to remove the event binding.
     * @param event Name of the event to unbind.
     * @param callback The function you wish to unbind.
     */
    off(el: Document | Element | NodeListOf<Element>, event: string, callback: Function): this;
    /**
     * Trigger an event on the given element.
     * @param el Element to trigger the event on.
     * @param event Name of the event to trigger.
     * @param originalEvent Optional event that gave rise to this method being called.
     * @param payload Optional `payload` to set on the Event that is created.
     */
    trigger(el: Document | Element, event: string, originalEvent?: Event, payload?: any, detail?: number): void;
    getOffsetRelativeToRoot(el: Element): PointXY;
    getOffset(el: Element): PointXY;
    getSize(el: Element): Size;
    getStyle(el: Element, prop: string): any;
    getSelector(ctx: string | Element, spec?: string): ArrayLike<jsPlumbDOMElement>;
    /**
     * Sets the position of the given element.
     * @param el Element to change position for
     * @param p New location for the element.
     */
    setPosition(el: Element, p: PointXY): void;
    setDraggable(element: Element, draggable: boolean): void;
    isDraggable(el: Element): boolean;
    toggleDraggable(el: Element): boolean;
    private _attachEventDelegates;
    private _detachEventDelegates;
    setContainer(newContainer: Element): void;
    reset(): void;
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
    rotate(element: Element, rotation: number, doNotRepaint?: boolean): RedrawResult;
    svg: {
        node: (name: string, attributes?: Dictionary<string | number>) => SVGElement;
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
    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
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
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): SourceSelector;
    removeSourceSelector(selector: SourceSelector): void;
}

import { JsPlumbDefaults, TypeDescriptor, JsPlumbInstance, AbstractConnector, Endpoint, Overlay, RedrawResult, LabelOverlay, Connection, Component, DeleteConnectionOptions, BehaviouralTypeDescriptor, UIGroup, ManagedElement, ConnectionDragSelector } from '@jsplumb/core';
import { PointXY, Size, BoundingBox, Extents, Grid } from "@jsplumb/util";
import { PaintStyle } from "@jsplumb/common";
import { DragManager } from "./drag-manager";
import { jsPlumbDOMElement } from './element-facade';
import { EventManager } from "./event-manager";
import { DragStartEventParams, DragEventParams, DragStopEventParams, ContainmentType, BeforeStartEventParams } from './collicat';
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
    beforeStart?: (params: BeforeStartEventParams) => void;
    cursor?: string;
    zIndex?: number;
    grid?: Grid;
    trackScroll?: boolean;
    filter?: string;
}
/**
 * Defaults for the BrowserUI implementation of jsPlumb.
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
export declare function groupDragConstrain(desiredLoc: PointXY, dragEl: jsPlumbDOMElement, constrainRect: BoundingBox, size: Size): PointXY;
/**
 * JsPlumbInstance that renders to the DOM in a browser, and supports dragging of elements/connections.
 *
 */
export declare class BrowserJsPlumbInstance extends JsPlumbInstance<ElementType> {
    _instanceIndex: number;
    private readonly dragSelection;
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
    _connectorContextmenu: Function;
    _connectorMousedown: Function;
    _connectorMouseup: Function;
    _endpointMousedown: Function;
    _endpointMouseup: Function;
    _overlayMouseover: Function;
    _overlayMouseout: Function;
    _elementClick: Function;
    _elementTap: Function;
    _elementDblTap: Function;
    _elementMouseenter: Function;
    _elementMouseexit: Function;
    _elementMousemove: Function;
    _elementMouseup: Function;
    _elementMousedown: Function;
    _elementContextmenu: Function;
    private readonly _resizeObserver;
    eventManager: EventManager;
    draggingClass: string;
    elementDraggingClass: string;
    hoverClass: string;
    sourceElementDraggingClass: string;
    targetElementDraggingClass: string;
    hoverSourceClass: string;
    hoverTargetClass: string;
    dragSelectClass: string;
    managedElementsSelector: string;
    /**
     * Whether or not elements should be draggable. This can be provided in the constructor arguments, or simply toggled on the
     * class. The default value is `true`.
     */
    elementsDraggable: boolean;
    private elementDragHandler;
    private readonly groupDragOptions;
    private readonly elementDragOptions;
    constructor(_instanceIndex: number, defaults?: BrowserJsPlumbDefaults);
    /**
     * Fire an event for an overlay, and for its related component.
     * @internal
     * @param overlay
     * @param event
     * @param e
     */
    private fireOverlayMethod;
    /**
     * Adds a filter to the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter - CSS3 selector, or function that takes an element and returns true/false
     * @param exclude - If true, the filter is inverted: anything _but_ this value.
     * @public
     */
    addDragFilter(filter: Function | string, exclude?: boolean): void;
    /**
     * Removes a filter from the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter - CSS3 selector, or function that takes an element and returns true/false
     * @public
     */
    removeDragFilter(filter: Function | string): void;
    /**
     * Sets the grid that should be used when dragging elements.
     * @param grid - Grid to use.
     * @public
     */
    setDragGrid(grid: Grid): void;
    /**
     * @internal
     * @param element
     */
    _removeElement(element: Element): void;
    /**
     *
     * @param el
     * @param parent
     * @internal
     */
    _appendElement(el: Element, parent: Element): void;
    /**
     *
     * @param el
     * @internal
     */
    _getAssociatedElements(el: Element): Array<Element>;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    /**
     * Gets the CSS class for the given element.
     * @param el
     * @public
     */
    getClass(el: Element): string;
    /**
     * Add one or more classes to the given element or list of elements.
     * @param el Element, or list of elements to which to add the class(es)
     * @param clazz A space separated list of classes to add.
     * @public
     */
    addClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Returns whether or not the given element has the given class.
     * @param el
     * @param clazz
     * @public
     */
    hasClass(el: Element, clazz: string): boolean;
    /**
     * Remove one or more classes from the given element or list of elements.
     * @param el Element, or list of elements from which to remove the class(es)
     * @param clazz A space separated list of classes to remove.
     * @public
     */
    removeClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Toggles one or more classes on the given element or list of elements.
     * @param el Element, or list of elements on which to toggle the class(es)
     * @param clazz A space separated list of classes to toggle.
     * @public
     */
    toggleClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Sets an attribute on the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el
     * @param name
     * @param value
     * @public
     */
    setAttribute(el: Element, name: string, value: string): void;
    /**
     * Gets an attribute from the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el
     * @param name
     * @public
     */
    getAttribute(el: Element, name: string): string;
    /**
     * Sets some attributes on the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el - Element to set attributes on
     * @param atts - Map of attributes to set.
     * @public
     */
    setAttributes(el: Element, atts: Record<string, string>): void;
    /**
     * Remove an attribute from the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el - Element to remove an attribute from
     * @param attName - Name of the attribute to remove
     * @public
     */
    removeAttribute(el: Element, attName: string): void;
    /**
     * Bind an event listener to the given element or elements.
     * @param el - Element, or elements, to bind the event listener to.
     * @param event - Name of the event to bind to.
     * @param callbackOrSelector - Either a callback function, or a CSS 3 selector. When this is a selector the event listener is bound as a "delegate", ie. the event listeners
     * listens to events on children of the given `el` that match the selector.
     * @param callback - Callback function for event. Only supplied when you're binding a delegated event handler.
     * @public
     */
    on(el: Document | Element | NodeListOf<Element>, event: string, callbackOrSelector: Function | string, callback?: Function): this;
    /**
     * Remove an event binding from the given element or elements.
     * @param el - Element, or elements, from which to remove the event binding.
     * @param event - Name of the event to unbind.
     * @param callback - The function you wish to unbind.
     * @public
     */
    off(el: Document | Element | NodeListOf<Element>, event: string, callback: Function): this;
    /**
     * Trigger an event on the given element.  Exposed publically but mostly intended for internal use.
     * @param el - Element to trigger the event on.
     * @param event - Name of the event to trigger.
     * @param originalEvent - Optional event that gave rise to this method being called.
     * @param payload - Optional `payload` to set on the Event that is created.
     * @param detail - Optional detail for the Event that is created.
     * @public
     */
    trigger(el: Document | Element, event: string, originalEvent?: Event, payload?: any, detail?: number): void;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getOffsetRelativeToRoot(el: Element): PointXY;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getOffset(el: Element): PointXY;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getSize(el: Element): Size;
    /**
     * Gets a style property from some element.
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el Element to get property from
     * @param prop Property to look up
     */
    getStyle(el: Element, prop: string): any;
    /**
     * Gets the element representing some group's content area.
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param group
     */
    getGroupContentArea(group: UIGroup<any>): ElementType["E"];
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param ctx Either a string representing a selector, or an element. If a string, the container root is assumed to be the element context. Otherwise
     * the context is this value and the selector is the second arg to the method.
     * @param spec If `ctx` is an element, this is the selector
     */
    getSelector(ctx: string | Element, spec?: string): ArrayLike<jsPlumbDOMElement>;
    /**
     * Sets the position of the given element.
     * @param el Element to change position for
     * @param p New location for the element.
     * @internal
     */
    setPosition(el: Element, p: PointXY): void;
    /**
     * Helper method to set the draggable state of some element. Under the hood all this does is add/remove the `data-jtk-not-draggable` attribute.
     * @param element - Element to set draggable state for.
     * @param draggable
     * @public
     */
    setDraggable(element: Element, draggable: boolean): void;
    /**
     * Helper method to get the draggable state of some element. Under the hood all this does is check for the existence of the `data-jtk-not-draggable` attribute.
     * @param el - Element to get draggable state for.
     * @public
     */
    isDraggable(el: Element): boolean;
    toggleDraggable(el: Element): boolean;
    private _attachEventDelegates;
    private _detachEventDelegates;
    /**
     * Sets the element this instance will use as the container for everything it adds to the UI. In normal use this method is
     * not expected to be called very often, if at all. The method is used by the instance constructor and also in certain situations by
     * the Toolkit edition.
     * @param newContainer
     * @public
     */
    setContainer(newContainer: Element): void;
    /**
     * Clears all endpoints and connections and managed elements from the instance of jsplumb. Does not also clear out event listeners, selectors, or
     * connection/endpoint types - for that, use `destroy()`.
     * @public
     */
    reset(): void;
    /**
     * Clears the instance and unbinds any listeners on the instance. After you call this method you cannot use this
     * instance of jsPlumb again.
     * @public
     */
    destroy(): void;
    /**
     * Stops managing the given element.
     * @param el - Element, or ID of the element to stop managing.
     * @param removeElement - If true, also remove the element from the renderer.
     * @public
     */
    unmanage(el: Element, removeElement?: boolean): void;
    /**
     * Adds the given element(s) to the current drag selection.
     * @param el
     * @public
     */
    addToDragSelection(...el: Array<Element>): void;
    /**
     * Clears the current drag selection
     * @public
     */
    clearDragSelection(): void;
    /**
     * Removes the given element(s) from the current drag selection
     * @param el
     * @public
     */
    removeFromDragSelection(...el: Array<Element>): void;
    /**
     * Toggles membership in the current drag selection of the given element(s)
     * @param el
     * @public
     */
    toggleDragSelection(...el: Array<Element>): void;
    /**
     * Adds the given element(s) to the given drag group.
     * @param spec Either the ID of some drag group, in which case the elements are all added as 'active', or an object of the form
     * { id:"someId", active:boolean }. In the latter case, `active`, if true, which is the default, indicates whether
     * dragging the given element(s) should cause all the elements in the drag group to be dragged. If `active` is false it means the
     * given element(s) is "passive" and should only move when an active member of the drag group is dragged.
     * @param els Elements to add to the drag group.
     * @public
     */
    addToDragGroup(spec: DragGroupSpec, ...els: Array<Element>): void;
    /**
     * Removes the given element(s) from any drag group they may be in. You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param els Elements to remove from drag groups.
     * @public
     */
    removeFromDragGroup(...els: Array<Element>): void;
    /**
     * Sets the active/passive state for the given element(s) in their respective drag groups (if any). You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param state true for active, false for passive.
     * @param els
     * @public
     */
    setDragGroupState(state: boolean, ...els: Array<Element>): void;
    /**
     * Consumes the given event.
     * @param e
     * @param doNotPreventDefault
     * @public
     */
    consume(e: Event, doNotPreventDefault?: boolean): void;
    /**
     * Rotates the given element. This method overrides the same method from the superclass: the superclass only makes a note
     * of the current rotation for the given element, but in this class the element has appropriate CSS transforms applied to it
     * to effect the rotation in the DOM.
     * @param element Element to rotate.
     * @param rotation Rotation, in degrees.
     * @param doNotRepaint If true, a repaint is not done afterwards. Defaults to false.
     * @public
     */
    rotate(element: Element, rotation: number, doNotRepaint?: boolean): RedrawResult;
    svg: {
        node: (name: string, attributes?: Record<string, string | number>) => SVGElement;
        attr: (node: SVGElement, attributes: Record<string, string | number>) => void;
        pos: (d: [number, number]) => string;
    };
    addOverlayClass(o: Overlay, clazz: string): void;
    removeOverlayClass(o: Overlay, clazz: string): void;
    /**
     * @internal
     * @param o
     * @param params
     * @param extents
     * @private
     */
    _paintOverlay(o: Overlay, params: any, extents: any): void;
    setOverlayVisible(o: Overlay, visible: boolean): void;
    reattachOverlay(o: Overlay, c: Component): void;
    setOverlayHover(o: Overlay, hover: boolean): void;
    destroyOverlay(o: Overlay): void;
    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    updateLabel(o: LabelOverlay): void;
    setHover(component: Component, hover: boolean): void;
    paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: Extents): void;
    setConnectorHover(connector: AbstractConnector, hover: boolean, sourceEndpoint?: Endpoint): void;
    /**
     * @internal
     * @param connection
     */
    destroyConnector(connection: Connection): void;
    /**
     * @internal
     * @param connector
     * @param clazz
     */
    addConnectorClass(connector: AbstractConnector, clazz: string): void;
    /**
     * @internal
     * @param connector
     * @param clazz
     */
    removeConnectorClass(connector: AbstractConnector, clazz: string): void;
    /**
     * @internal
     * @param connector
     */
    getConnectorClass(connector: AbstractConnector): string;
    /**
     * @internal
     * @param connector
     * @param v
     */
    setConnectorVisible(connector: AbstractConnector, v: boolean): void;
    /**
     * @internal
     * @param connector
     * @param t
     */
    applyConnectorType(connector: AbstractConnector, t: TypeDescriptor): void;
    /**
     * @internal
     * @param ep
     * @param c
     */
    addEndpointClass(ep: Endpoint, c: string): void;
    /**
     * @internal
     * @param ep
     * @param t
     */
    applyEndpointType<C>(ep: Endpoint, t: TypeDescriptor): void;
    /**
     * @internal
     * @param ep
     */
    destroyEndpoint(ep: Endpoint): void;
    /**
     * @internal
     * @param ep
     * @param paintStyle
     */
    renderEndpoint(ep: Endpoint, paintStyle: PaintStyle): void;
    /**
     * @internal
     * @param ep
     * @param c
     */
    removeEndpointClass(ep: Endpoint, c: string): void;
    /**
     * @internal
     * @param ep
     */
    getEndpointClass(ep: Endpoint): string;
    /**
     * @internal
     * @param endpoint
     * @param hover
     * @param endpointIndex Optional (though you must provide a value) index that identifies whether the endpoint being hovered is the source
     * or target of some connection. A value for this will be provided whenever the source of the hover event is the connector.
     * @param doNotCascade
     */
    setEndpointHover(endpoint: Endpoint, hover: boolean, endpointIndex: -1 | 0 | 1, doNotCascade?: boolean): void;
    /**
     * @internal
     * @param ep
     * @param v
     */
    setEndpointVisible(ep: Endpoint, v: boolean): void;
    /**
     * @internal
     * @param group
     * @param state
     */
    setGroupVisible(group: UIGroup<Element>, state: boolean): void;
    /**
     * @internal
     * @param connection
     * @param params
     */
    deleteConnection(connection: Connection, params?: DeleteConnectionOptions): boolean;
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): ConnectionDragSelector;
    removeSourceSelector(selector: ConnectionDragSelector): void;
    manage(element: Element, internalId?: string, _recalc?: boolean): ManagedElement<Element>;
}
//# sourceMappingURL=browser-jsplumb-instance.d.ts.map
import { ElementAttributes } from './svg-util';
import { DragManager } from "./drag-manager";
import { jsPlumbDOMElement } from './element-facade';
import { ElementType } from "./browser-util";
import { EventManager } from "./event-manager";
import { DragStartEventParams, DragEventParams, DragStopEventParams, ContainmentType, BeforeStartEventParams, ConstrainFunction } from './collicat';
import { AbstractConnector } from "../core/connector/abstract-connector";
import { Overlay } from "../core/overlay/overlay";
import { Endpoint } from "../core/endpoint/endpoint";
import { LabelOverlay } from "../core/overlay/label-overlay";
import { Component } from "../core/component/component";
import { Connection } from "../core/connector/connection-impl";
import { JsPlumbDefaults } from "../core/defaults";
import { DeleteConnectionOptions, JsPlumbInstance, ManagedElement } from "../core/core";
import { UIGroup } from "../core/group/group";
import { RedrawResult } from "../core/router/router";
import { BehaviouralTypeDescriptor, TypeDescriptor } from "../core/type-descriptors";
import { ConnectionDragSelector } from "../core/source-selector";
import { PaintStyle } from "../common/index";
import { BoundingBox, Extents, Grid, PointXY, Size } from "../util/util";
export interface UIComponent {
    canvas: HTMLElement;
    svg: SVGElement;
}
export declare type EndpointHelperFunctions<E> = {
    makeNode: (ep: E, paintStyle: PaintStyle) => void;
    updateNode: (ep: E, node: SVGElement) => void;
};
export declare function registerEndpointRenderer<C>(name: string, fns: EndpointHelperFunctions<C>): void;
/**
 * @internal
 * @param evt
 * @param el
 * @param zoom
 */
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
    connector?: AbstractConnector;
    endpoint?: Endpoint;
    overlay?: Overlay;
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
/**
 * @internal
 * @param desiredLoc
 * @param dragEl
 * @param constrainRect
 * @param size
 */
export declare function groupDragConstrain(desiredLoc: PointXY, dragEl: jsPlumbDOMElement, constrainRect: BoundingBox, size: Size): PointXY;
/**
 * JsPlumbInstance that renders to the DOM in a browser, and supports dragging of elements/connections.
 * @public
 */
export declare class BrowserJsPlumbInstance extends JsPlumbInstance<{
    E: Element;
}> {
    _instanceIndex: number;
    containerType: ElementType;
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
     * Sets the function used to constrain the dragging of elements.
     * @param constrainFunction
     * @public
     */
    setDragConstrainFunction(constrainFunction: ConstrainFunction): void;
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
     * @internal
     * @param group
     * @param el
     * @private
     */
    _appendElementToGroup(group: UIGroup<any>, el: Element): void;
    /**
     * @internal
     * @param el
     * @private
     */
    _appendElementToContainer(el: Element): void;
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
     *
     * Places this is called:
     *
     * - dragToGroup in test support, to get the position of the target group
     * - `orphan` in group manager, to get an elements position relative to the group. since in this case we know its
     * a child of the group's content area we could theoretically use getBoundingClientRect here
     * - addToGroup in group manager, to find the position of some element that is about to be dropped
     * - addToGroup in group manager, to get the position of the content area of an uncollapsed group onto which an element is being dropped
     * - refreshElement, to get the current position of some element
     * - getOffset method in viewport (just does a pass through to the instance)
     * - onStop of group manager, when ghost proxy is active, to get the location of the original group's content area and the new group's content area
     * - onStart in drag manager, to get the position of an element that is about to be dragged
     * - onStart in drag manager, to get the position of an element's group parent when the element is about to be dragged (if the element is in a group)
     * - onStart in drag manager, to get the position of a group, when checking for target group's for the element that is about to be dragged
     * - onStart in drag manager, to get the position of all the elements in the current drag group (if there is one), so that they can be moved
     * relative to each other during the drag.
     *
     *
     */
    getOffset(el: Element): PointXY;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getSize(el: Element): Size;
    /**
     * get the position of the given element, allowing for svg elements and html elements
     * @param el
     */
    getPosition(el: Element): PointXY;
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
    getGroupContentArea(group: UIGroup<any>): Element;
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
    private _createEventListeners;
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
     * Removes all members from the drag group with the given name.
     * @param name
     * @public
     */
    clearDragGroup(name: string): void;
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
     * @param element - Element to rotate.
     * @param rotation - Rotation, in degrees.
     * @param doNotRepaint - If true, a repaint is not done afterwards. Defaults to false.
     * @public
     */
    rotate(element: Element, rotation: number, doNotRepaint?: boolean): RedrawResult;
    svg: {
        node: (name: string, attributes?: ElementAttributes) => SVGElement;
        attr: (node: SVGElement, attributes: ElementAttributes) => void;
        pos: (d: [number, number]) => string;
    };
    /**
     * @internal
     * @param o
     * @param clazz
     */
    addOverlayClass(o: Overlay, clazz: string): void;
    /**
     * @internal
     * @param o
     * @param clazz
     */
    removeOverlayClass(o: Overlay, clazz: string): void;
    /**
     * @internal
     * @param o
     * @param params
     * @param extents
     */
    _paintOverlay(o: Overlay, params: any, extents: any): void;
    /**
     * Sets the visibility of some overlay.
     * @param o - Overlay to hide or show
     * @param visible - If true, make the overlay visible, if false, make the overlay invisible.
     */
    setOverlayVisible(o: Overlay, visible: boolean): void;
    /**
     * @internal
     * @param o
     * @param c
     */
    reattachOverlay(o: Overlay, c: Component): void;
    /**
     * @internal
     * @param o
     * @param hover
     */
    setOverlayHover(o: Overlay, hover: boolean): void;
    /**
     * @internal
     * @param o
     */
    destroyOverlay(o: Overlay): void;
    /**
     * @internal
     * @param o
     * @param component
     * @param paintStyle
     * @param absolutePosition
     */
    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    /**
     * @internal
     * @param o
     */
    updateLabel(o: LabelOverlay): void;
    /**
     * @internal
     * @param component
     * @param hover
     */
    setHover(component: Component, hover: boolean): void;
    /**
     * @internal
     * @param connector
     * @param paintStyle
     * @param extents
     */
    paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: Extents): void;
    /**
     * @internal
     * @param connector
     * @param hover
     * @param sourceEndpoint
     */
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
    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeSource` functionality
     * that had been in jsPlumb since the early days (and which, in 5.x, has been removed). With this approach, rather than calling `makeSource` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse/touch events on elements that are managed by the instance.
     * @param selector - CSS3 selector identifying child element(s) of some managed element that should act as a connection source.
     * @param params - Options for the source: connector type, behaviour, etc.
     * @param exclude - If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     * @public
     */
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): ConnectionDragSelector;
    /**
     * Unregister the given source selector.
     * @param selector - Remove the given drag selector from the instance.
     * @public
     */
    removeSourceSelector(selector: ConnectionDragSelector): void;
    /**
     * Manage an element.  Adds the element to the viewport and sets up tracking for endpoints/connections for the element, as well as enabling dragging for the
     * element. This method is called internally by various methods of the jsPlumb instance, such as `connect`, `addEndpoint`, `makeSource` and `makeTarget`,
     * so if you use those methods to setup your UI then you may not need to call this. However, if you use the `addSourceSelector` and `addTargetSelector` methods
     * to configure your UI then you will need to register elements using this method, or they will not be draggable.
     * @param element - Element to manage. This method does not accept a DOM element ID as argument. If you wish to manage elements via their DOM element ID,
     * you should use `manageAll` and pass in an appropriate CSS selector that represents your element, eg `#myElementId`.
     * @param internalId - Optional ID for jsPlumb to use internally. If this is not supplied, one will be created.
     * @param _recalc - Maybe recalculate offsets for the element also. It is not recommended that clients of the API use this parameter; it's used in
     * certain scenarios internally
     */
    manage(element: Element, internalId?: string, _recalc?: boolean): ManagedElement<Element>;
}
//# sourceMappingURL=browser-jsplumb-instance.d.ts.map
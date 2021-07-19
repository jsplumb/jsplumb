import { JsPlumbDefaults } from "./defaults";
import { Connection, ConnectionOptions } from "./connector/connection-impl";
import { Endpoint } from "./endpoint/endpoint";
import { RedrawResult } from "./router/router";
import { RotatedPointXY, Rotations, PointXY, Size, Dictionary, Extents, EventGenerator } from "@jsplumb/util";
import { UpdateOffsetOptions, ConnectParams } from "./params";
import { SourceDefinition, BehaviouralTypeDescriptor, // <--
TypeDescriptor, ConnectionTypeDescriptor, EndpointTypeDescriptor } from './type-descriptors';
import { ConnectionMovedParams } from "./callbacks";
import { EndpointOptions } from "./endpoint/endpoint-options";
import { AddGroupOptions, GroupManager } from "./group/group-manager";
import { UIGroup } from "./group/group";
import { Router } from "./router/router";
import { EndpointSelection } from "./selection/endpoint-selection";
import { ConnectionSelection } from "./selection/connection-selection";
import { Viewport, ViewportElement } from "./viewport";
import { Component } from './component/component';
import { Overlay } from './overlay/overlay';
import { LabelOverlay } from './overlay/label-overlay';
import { AbstractConnector } from './connector/abstract-connector';
import { PaintStyle, AnchorPlacement, AnchorSpec, EndpointSpec } from '@jsplumb/common';
import { SourceSelector, TargetSelector } from "./source-selector";
import { InternalEndpointOptions } from "./endpoint/endpoint-options";
export interface jsPlumbElement<E> {
    _jsPlumbGroup: UIGroup<E>;
    _jsPlumbParentGroup: UIGroup<E>;
    _jsPlumbProxies: Array<[Connection, number]>;
    _isJsPlumbGroup: boolean;
    parentNode: jsPlumbElement<E>;
}
export declare type ElementSelectionSpecifier<E> = E | Array<E> | '*';
export declare type SelectionList = '*' | Array<string>;
export interface AbstractSelectOptions<E> {
    scope?: SelectionList;
    source?: ElementSelectionSpecifier<E>;
    target?: ElementSelectionSpecifier<E>;
}
export interface SelectOptions<E> extends AbstractSelectOptions<E> {
    connections?: Array<Connection>;
}
export interface SelectEndpointOptions<E> extends AbstractSelectOptions<E> {
    element?: ElementSelectionSpecifier<E>;
}
/**
 * Optional parameters to the `DeleteConnection` method.
 */
export declare type DeleteConnectionOptions = {
    /**
     * if true, force deletion even if the connection tries to cancel the deletion.
     */
    force?: boolean;
    /**
     * If false, an event won't be fired. Otherwise a `connection:detach` event will be fired.
     */
    fireEvent?: boolean;
    /**
     * Optional original event that resulted in the connection being deleted.
     */
    originalEvent?: Event;
    /**
     * internally when a connection is deleted, it may be because the endpoint it was on is being deleted.
     * in that case we want to ignore that endpoint.
     */
    endpointToIgnore?: Endpoint;
};
export declare type ManagedElement<E> = {
    el: jsPlumbElement<E>;
    viewportElement?: ViewportElement<E>;
    endpoints?: Array<Endpoint>;
    connections?: Array<Connection>;
    rotation?: number;
    group?: string;
};
export declare abstract class JsPlumbInstance<T extends {
    E: unknown;
} = any> extends EventGenerator {
    readonly _instanceIndex: number;
    defaults: JsPlumbDefaults<T["E"]>;
    private _initialDefaults;
    isConnectionBeingDragged: boolean;
    currentlyDragging: boolean;
    hoverSuspended: boolean;
    _suspendDrawing: boolean;
    _suspendedAt: string;
    connectorClass: string;
    connectorOutlineClass: string;
    connectedClass: string;
    endpointClass: string;
    endpointConnectedClass: string;
    endpointFullClass: string;
    endpointDropAllowedClass: string;
    endpointDropForbiddenClass: string;
    endpointAnchorClassPrefix: string;
    overlayClass: string;
    readonly connections: Array<Connection>;
    endpointsByElement: Dictionary<Array<Endpoint>>;
    private readonly endpointsByUUID;
    sourceSelectors: Array<SourceSelector>;
    targetSelectors: Array<TargetSelector>;
    allowNestedGroups: boolean;
    private _curIdStamp;
    readonly viewport: Viewport<T>;
    readonly router: Router<T, any>;
    readonly groupManager: GroupManager<T["E"]>;
    private _connectionTypes;
    private _endpointTypes;
    private _container;
    protected _managedElements: Dictionary<ManagedElement<T["E"]>>;
    private DEFAULT_SCOPE;
    readonly defaultScope: string;
    private _zoom;
    readonly currentZoom: number;
    constructor(_instanceIndex: number, defaults?: JsPlumbDefaults<T["E"]>);
    getContainer(): any;
    setZoom(z: number, repaintEverything?: boolean): boolean;
    _idstamp(): string;
    checkCondition(conditionName: string, args?: any): boolean;
    getId(element: T["E"], uuid?: string): string;
    getConnections(options?: SelectOptions<T["E"]>, flat?: boolean): Dictionary<Connection> | Array<Connection>;
    select(params?: SelectOptions<T["E"]>): ConnectionSelection;
    selectEndpoints(params?: SelectEndpointOptions<T["E"]>): EndpointSelection;
    setContainer(c: T["E"]): void;
    private _set;
    /**
     * Change the source of the given connection to be the given endpoint or element.
     * @param connection
     * @param el
     */
    setSource(connection: Connection, el: T["E"] | Endpoint): void;
    /**
     * Change the target of the given connection to be the given endpoint or element.
     * @param connection
     * @param el
     */
    setTarget(connection: Connection, el: T["E"] | Endpoint): void;
    /**
     * Returns whether or not hover is currently suspended.
     */
    isHoverSuspended(): boolean;
    /**
     * Sets whether or not drawing is suspended.
     * @param val True to suspend, false to enable.
     * @param repaintAfterwards If true, repaint everything afterwards.
     */
    setSuspendDrawing(val?: boolean, repaintAfterwards?: boolean): boolean;
    getSuspendedAt(): string;
    /**
     * Suspend drawing, run the given function, and then re-enable drawing, optionally repainting everything.
     * @param fn Function to run while drawing is suspended.
     * @param doNotRepaintAfterwards Whether or not to repaint everything after drawing is re-enabled.
     */
    batch(fn: Function, doNotRepaintAfterwards?: boolean): void;
    /**
     * Execute the given function for each of the given elements.
     * @param spec An Element, or an element id, or an array of elements/element ids.
     * @param fn The function to run on each element.
     */
    each(spec: T["E"] | Array<T["E"]>, fn: (e: T["E"]) => any): JsPlumbInstance;
    /**
     * Update the cached offset information for some element.
     * @param params
     * @return an UpdateOffsetResult containing the offset information for the given element.
     */
    updateOffset(params?: UpdateOffsetOptions): ViewportElement<T["E"]>;
    /**
     * Delete the given connection.
     * @param connection Connection to delete.
     * @param params Optional extra parameters.
     */
    deleteConnection(connection: Connection, params?: DeleteConnectionOptions): boolean;
    deleteEveryConnection(params?: DeleteConnectionOptions): number;
    /**
     * Delete all connections attached to the given element.
     * @param el
     * @param params
     */
    deleteConnectionsForElement(el: T["E"], params?: DeleteConnectionOptions): JsPlumbInstance;
    private fireDetachEvent;
    fireMoveEvent(params?: ConnectionMovedParams, evt?: Event): void;
    /**
     * Manage a group of elements.
     * @param elements Array-like object of strings or elements (can be an Array or a NodeList), or a CSS selector (which is applied with the instance's
     * container element as its context)
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manageAll(elements: ArrayLike<T["E"]> | string, recalc?: boolean): void;
    /**
     * Manage an element.  Adds the element to the viewport and sets up tracking for endpoints/connections for the element, as well as enabling dragging for the
     * element. This method is called internally by various methods of the jsPlumb instance, such as `connect`, `addEndpoint`, `makeSource` and `makeTarget`,
     * so if you use those methods to setup your UI then you may not need to call this. However, if you use the `addSourceSelector` and `addTargetSelector` methods
     * to configure your UI then you will need to register elements using this method, or they will not be draggable.
     * @param element Element to manage. This method does not accept a DOM element ID as argument. If you wish to manage elements via their DOM element ID,
     * you should use `manageAll` and pass in an appropriate CSS selector that represents your element, eg `#myElementId`.
     * @param internalId Optional ID for jsPlumb to use internally. If this is not supplied, one will be created.
     * @param recalc Maybe recalculate offsets for the element also. It is not recommended that clients of the API use this parameter; it's used in
     * certain scenarios internally
     */
    manage(element: T["E"], internalId?: string, _recalc?: boolean): ManagedElement<T["E"]>;
    /**
     * Gets the element with the given ID from the list managed elements, null if not currently managed.
     * @param id
     */
    getManagedElement(id: string): T["E"];
    /**
     * Stops managing the given element.
     * @method unmanage
     * @param el Element, or ID of the element to stop managing.
     * @param removeElement If true, also remove the element from the renderer.
     */
    unmanage(el: T["E"], removeElement?: boolean): void;
    /**
     * Sets rotation for the element to the given number of degrees (not radians). A value of null is treated as a
     * rotation of 0 degrees.
     * @method rotate
     * @param element Element to rotate
     * @param rotation Amount to totate
     * @param _doNotRepaint For internal use.
     */
    rotate(element: T["E"], rotation: number, _doNotRepaint?: boolean): RedrawResult;
    /**
     * Gets the current rotation for the element with the given ID. This method exists for internal use.
     * @param elementId Internal ID of the element for which to retrieve rotation.
     * @private
     */
    _getRotation(elementId: string): number;
    /**
     * Returns a list of rotation transformations that apply to the given element. An element may have rotation applied
     * directly to it, and/or it may be within a group, which may itself be rotated, and that group may be inside a group
     * which is also rotated, etc. It's rotated turtles all the way down, or at least it could be. This method is intended
     * for internal use only.
     * @param elementId
     * @private
     */
    _getRotations(elementId: string): Rotations;
    /**
     * Applies the given set of Rotations to the given point, and returns a new PointXY. For internal use.
     * @param point Point to rotate
     * @param rotations Rotations to apply.
     * @private
     */
    _applyRotations(point: [number, number, number, number], rotations: Rotations): RotatedPointXY;
    /**
     * Applies the given set of Rotations to the given point, and returns a new PointXY. For internal use.
     * @param point Point to rotate
     * @param rotations Rotations to apply.
     * @private
     */
    _applyRotationsXY(point: PointXY, rotations: Rotations): PointXY;
    /**
     * Internal method to create an Endpoint from the given options, perhaps with the given id. Do not use this method
     * as a consumer of the API. If you wish to add an Endpoint to some element, use `addEndpoint` instead.
     * @param params Options for the Endpoint.
     * @private
     */
    _internal_newEndpoint(params: InternalEndpointOptions<T["E"]>): Endpoint;
    /**
     * For internal use. For the given inputs, derive an appropriate anchor and endpoint definition.
     * @param type
     * @param dontPrependDefault
     * @private
     */
    _deriveEndpointAndAnchorSpec(type: string, dontPrependDefault?: boolean): {
        endpoints: [EndpointSpec, EndpointSpec];
        anchors: [AnchorSpec, AnchorSpec];
    };
    /**
     * Updates position/size information for the given element and redraws its Endpoints and their Connections. Use this method when you've
     * made a change to some element that may have caused the element to change its position or size and you want to ensure the connections are
     * in the right place.
     * @method revalidate
     * @param el Element to revalidate.
     * @param timestamp Optional, used internally to avoid recomputing position/size information if it has already been computed.
     */
    revalidate(el: T["E"], timestamp?: string): RedrawResult;
    /**
     * Repaint every connection and endpoint in the instance.
     * @method repaintEverything
     */
    repaintEverything(): JsPlumbInstance;
    /**
     * Sets the position of the given element to be [x,y].
     * @method setElementPosition
     * @param el Element to set the position for
     * @param x Position in X axis
     * @param y Position in Y axis
     * @return The result of the redraw operation that follows the update of the viewport.
     */
    setElementPosition(el: T["E"], x: number, y: number): RedrawResult;
    /**
     * Repaints all connections and endpoints associated with the given element, _without recomputing the element
     * size and position_. If you want to first recompute element size and position you should call `revalidate(el)` instead,
     * @method repaint
     * @param el
     * @param timestamp Optional parameter used internally to avoid recalculating offsets multiple times in one paint.
     * @param offsetsWereJustCalculated If true, we don't recalculate the offsets of child elements of the element we're repainting.
     */
    repaint(el: T["E"], timestamp?: string, offsetsWereJustCalculated?: boolean): RedrawResult;
    /**
     * @private
     * @param endpoint
     */
    private unregisterEndpoint;
    /**
     * Potentially delete the endpoint from the instance, depending on the endpoint's internal state. Not for external use.
     * @param endpoint
     * @private
     */
    _maybePruneEndpoint(endpoint: Endpoint): boolean;
    /**
     * Delete the given endpoint.
     * @method deleteEndpoint
     * @param object Either an Endpoint, or the UUID of an Endpoint.
     */
    deleteEndpoint(object: string | Endpoint): JsPlumbInstance;
    /**
     * Add an Endpoint to the given element.
     * @method addEndpoint
     * @param el Element to add the endpoint to.
     * @param params
     * @param referenceParams
     */
    addEndpoint(el: T["E"], params?: EndpointOptions<T["E"]>, referenceParams?: EndpointOptions<T["E"]>): Endpoint;
    /**
     * Add a set of Endpoints to an element
     * @param el Element to add the Endpoints to.
     * @param endpoints Array of endpoint options.
     * @param referenceParams
     */
    addEndpoints(el: T["E"], endpoints: Array<EndpointOptions<T["E"]>>, referenceParams?: EndpointOptions<T["E"]>): Array<Endpoint>;
    /**
     * Clears all endpoints and connections from the instance of jsplumb. Does not also clear out event listeners, selectors, or
     * connection/endpoint types - for that, use `destroy()`.
     */
    reset(): void;
    /**
     * Clears the instance and unbinds any listeners on the instance. After you call this method you cannot use this
     * instance of jsPlumb again.
     */
    destroy(): void;
    /**
     * Gets all registered endpoints for the given element.
     * @param el
     */
    getEndpoints(el: T["E"]): Array<Endpoint>;
    /**
     * Retrieve an endpoint by its UUID.
     * @param uuid
     */
    getEndpoint(uuid: string): Endpoint;
    /**
     * Set an endpoint's uuid, updating the internal map
     * @param endpoint
     * @param uuid
     */
    setEndpointUuid(endpoint: Endpoint, uuid: string): void;
    /**
     * Connect one element to another.
     * @param params At the very least you need to supply {source:.., target:...}.
     * @param referenceParams Optional extra parameters. This can be useful when you're creating multiple connections that have some things in common.
     */
    connect(params: ConnectParams<T["E"]>, referenceParams?: ConnectParams<T["E"]>): Connection;
    /**
     * @param params
     * @param referenceParams
     * @private
     */
    private _prepareConnectionParams;
    /**
     * Creates and registers a new connection. For internal use only. Use `connect` to create Connections.
     * @param params
     * @private
     */
    _newConnection(params: ConnectionOptions<T["E"]>): Connection;
    /**
     * Adds the connection to the backing model, fires an event if necessary and then redraws. This is a package-private method, not intended to be
     * called by external code.
     * @method _finaliseConnection
     * @param {Connection} jpc Connection to finalise
     * @param params
     * @param {Event} [originalEvent] Optional original event that resulted in the creation of this connection.
     * @private
     */
    _finaliseConnection(jpc: Connection, params?: any, originalEvent?: Event): void;
    /**
     * Remove every endpoint registered to the given element.
     * @method removeAllEndpoints
     * @param el Element to remove endpoints for.
     * @param recurse If true, also remove endpoints for elements that are descendants of this element.
     */
    removeAllEndpoints(el: T["E"], recurse?: boolean): JsPlumbInstance;
    protected _createSourceDefinition(params?: BehaviouralTypeDescriptor, referenceParams?: BehaviouralTypeDescriptor): SourceDefinition;
    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeSource` functionality
     * that has been in jsPlumb since the early days. With this approach, rather than calling `makeSource` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse events on elements that are managed by the instance.
     * @param selector CSS3 selector identifying child element(s) of some managed element that should act as a connection source.
     * @param params Options for the source: connector type, behaviour, etc.
     * @param exclude If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     */
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): SourceSelector;
    /**
     * Unregister the given source selector.
     * @param selector
     */
    removeSourceSelector(selector: SourceSelector): void;
    /**
     * Unregister the given target selector.
     * @param selector
     */
    removeTargetSelector(selector: TargetSelector): void;
    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeTarget` functionality
     * that has been in jsPlumb since the early days. With this approach, rather than calling `makeTarget` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse events on elements that are managed by the instance.
     * @param selector CSS3 selector identifying child element(s) of some managed element that should act as a connection target.
     * @param params Options for the target
     * @param exclude If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     */
    addTargetSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): TargetSelector;
    private _createTargetDefinition;
    show(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    hide(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    private _setVisible;
    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible(el: T["E"], changeEndpoints?: boolean): void;
    private _operation;
    registerConnectionType(id: string, type: ConnectionTypeDescriptor): void;
    registerConnectionTypes(types: Dictionary<ConnectionTypeDescriptor>): void;
    registerEndpointType(id: string, type: EndpointTypeDescriptor): void;
    registerEndpointTypes(types: Dictionary<EndpointTypeDescriptor>): void;
    getType(id: string, typeDescriptor: string): TypeDescriptor;
    getConnectionType(id: string): ConnectionTypeDescriptor;
    getEndpointType(id: string): EndpointTypeDescriptor;
    importDefaults(d: JsPlumbDefaults<T["E"]>): JsPlumbInstance;
    restoreDefaults(): JsPlumbInstance;
    getManagedElements(): Dictionary<ManagedElement<T["E"]>>;
    proxyConnection(connection: Connection, index: number, proxyEl: T["E"], endpointGenerator: (c: Connection, idx: number) => EndpointSpec, anchorGenerator: (c: Connection, idx: number) => AnchorSpec): void;
    unproxyConnection(connection: Connection, index: number): void;
    sourceOrTargetChanged(originalId: string, newId: string, connection: Connection, newElement: T["E"], index: number): void;
    abstract setGroupVisible(group: UIGroup, state: boolean): void;
    getGroup(groupId: string): UIGroup<T["E"]>;
    getGroupFor(el: T["E"]): UIGroup<T["E"]>;
    addGroup(params: AddGroupOptions<T["E"]>): UIGroup<T["E"]>;
    addToGroup(group: string | UIGroup<T["E"]>, ...el: Array<T["E"]>): void;
    collapseGroup(group: string | UIGroup<T["E"]>): void;
    expandGroup(group: string | UIGroup<T["E"]>): void;
    toggleGroup(group: string | UIGroup<T["E"]>): void;
    removeGroup(group: string | UIGroup<T["E"]>, deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): Dictionary<PointXY>;
    removeAllGroups(deleteMembers?: boolean, manipulateView?: boolean): void;
    removeFromGroup(group: string | UIGroup<T["E"]>, el: T["E"], doNotFireEvent?: boolean): void;
    paintEndpoint(endpoint: Endpoint, params: {
        timestamp?: string;
        offset?: ViewportElement<T["E"]>;
        recalc?: boolean;
        elementWithPrecedence?: string;
        connectorPaintStyle?: PaintStyle;
        anchorLoc?: AnchorPlacement;
    }): void;
    paintConnection(connection: Connection, params?: {
        timestamp?: string;
    }): void;
    refreshEndpoint(endpoint: Endpoint): void;
    makeConnector(connection: Connection<T["E"]>, name: string, args: any): AbstractConnector;
    /**
     * For some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group. For an element that has child
     * elements that are also managed, it means those child elements.
     * @param el
     * @private
     */
    abstract _getAssociatedElements(el: T["E"]): Array<T["E"]>;
    abstract _removeElement(el: T["E"]): void;
    abstract _appendElement(el: T["E"], parent: T["E"]): void;
    abstract removeClass(el: T["E"] | ArrayLike<T["E"]>, clazz: string): void;
    abstract addClass(el: T["E"] | ArrayLike<T["E"]>, clazz: string): void;
    abstract toggleClass(el: T["E"] | ArrayLike<T["E"]>, clazz: string): void;
    abstract getClass(el: T["E"]): string;
    abstract hasClass(el: T["E"], clazz: string): boolean;
    abstract setAttribute(el: T["E"], name: string, value: string): void;
    abstract getAttribute(el: T["E"], name: string): string;
    abstract setAttributes(el: T["E"], atts: Dictionary<string>): void;
    abstract removeAttribute(el: T["E"], attName: string): void;
    abstract getSelector(ctx: string | T["E"], spec?: string): ArrayLike<T["E"]>;
    abstract getStyle(el: T["E"], prop: string): any;
    abstract getSize(el: T["E"]): Size;
    abstract getOffset(el: T["E"]): PointXY;
    abstract getOffsetRelativeToRoot(el: T["E"] | string): PointXY;
    abstract getGroupContentArea(group: UIGroup): T["E"];
    abstract setPosition(el: T["E"], p: PointXY): void;
    abstract on(el: Document | T["E"] | ArrayLike<T["E"]>, event: string, callbackOrSelector: Function | string, callback?: Function): void;
    abstract off(el: Document | T["E"] | ArrayLike<T["E"]>, event: string, callback: Function): void;
    abstract trigger(el: Document | T["E"], event: string, originalEvent?: Event, payload?: any, detail?: number): void;
    getPathData(connector: AbstractConnector): any;
    abstract paintOverlay(o: Overlay, params: any, extents: any): void;
    abstract addOverlayClass(o: Overlay, clazz: string): void;
    abstract removeOverlayClass(o: Overlay, clazz: string): void;
    abstract setOverlayVisible(o: Overlay, visible: boolean): void;
    abstract destroyOverlay(o: Overlay): void;
    abstract updateLabel(o: LabelOverlay): void;
    abstract drawOverlay(overlay: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    abstract reattachOverlay(o: Overlay, c: Component): void;
    abstract setOverlayHover(o: Overlay, hover: boolean): void;
    abstract setHover(component: Component, hover: boolean): void;
    abstract paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: Extents): void;
    abstract destroyConnector(connection: Connection, force?: boolean): void;
    abstract setConnectorHover(connector: AbstractConnector, h: boolean, doNotCascade?: boolean): void;
    abstract addConnectorClass(connector: AbstractConnector, clazz: string): void;
    abstract removeConnectorClass(connector: AbstractConnector, clazz: string): void;
    abstract getConnectorClass(connector: AbstractConnector): string;
    abstract setConnectorVisible(connector: AbstractConnector, v: boolean): void;
    abstract applyConnectorType(connector: AbstractConnector, t: TypeDescriptor): void;
    abstract applyEndpointType(ep: Endpoint<T>, t: TypeDescriptor): void;
    abstract setEndpointVisible(ep: Endpoint<T>, v: boolean): void;
    abstract destroyEndpoint(ep: Endpoint<T>): void;
    abstract renderEndpoint(ep: Endpoint<T>, paintStyle: PaintStyle): void;
    abstract addEndpointClass(ep: Endpoint<T>, c: string): void;
    abstract removeEndpointClass(ep: Endpoint<T>, c: string): void;
    abstract getEndpointClass(ep: Endpoint<T>): string;
    abstract setEndpointHover(endpoint: Endpoint<T>, h: boolean, doNotCascade?: boolean): void;
}

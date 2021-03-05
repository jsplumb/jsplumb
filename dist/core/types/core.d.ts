import { jsPlumbDefaults } from "./defaults";
import { Connection } from "./connector/connection-impl";
import { Endpoint, EndpointSpec } from "./endpoint/endpoint";
import { FullOverlaySpec, OverlaySpec } from "./overlay/overlay";
import { AnchorPlacement, RedrawResult } from "./router/router";
import { RotatedPointXY } from "./util";
import { Dictionary, UpdateOffsetOptions, Size, jsPlumbElement, ConnectParams, // <--
SourceDefinition, TargetDefinition, BehaviouralTypeDescriptor, TypeDescriptor, Rotations, PointXY, ConnectionMovedParams, SourceBehaviouralTypeDescriptor, TargetBehaviouralTypeDescriptor } from './common';
import { EventGenerator } from "./event-generator";
import { EndpointOptions } from "./endpoint/endpoint";
import { AddGroupOptions, GroupManager } from "./group/group-manager";
import { UIGroup } from "./group/group";
import { Router } from "./router/router";
import { EndpointSelection } from "./selection/endpoint-selection";
import { ConnectionSelection } from "./selection/connection-selection";
import { Viewport, ViewportElement } from "./viewport";
import { Component } from './component/component';
import { Segment } from './connector/abstract-segment';
import { Overlay } from './overlay/overlay';
import { LabelOverlay } from './overlay/label-overlay';
import { AbstractConnector } from './connector/abstract-connector';
import { OverlayCapableComponent } from './component/overlay-capable-component';
import { PaintStyle } from './styles';
import { AnchorSpec } from "./factory/anchor-factory";
import { SourceSelector, TargetSelector } from "./source-selector";
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
    Defaults: jsPlumbDefaults<T["E"]>;
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
    targetSelectors: Array<SourceSelector>;
    allowNestedGroups: boolean;
    private _curIdStamp;
    readonly viewport: Viewport<T>;
    readonly router: Router<T>;
    readonly groupManager: GroupManager<T["E"]>;
    private _connectionTypes;
    private _endpointTypes;
    private _container;
    protected _managedElements: Dictionary<ManagedElement<T["E"]>>;
    private DEFAULT_SCOPE;
    readonly defaultScope: string;
    private _zoom;
    readonly currentZoom: number;
    constructor(_instanceIndex: number, defaults?: jsPlumbDefaults<T["E"]>);
    getContainer(): any;
    setZoom(z: number, repaintEverything?: boolean): boolean;
    _idstamp(): string;
    convertToFullOverlaySpec(spec: string | OverlaySpec): FullOverlaySpec;
    checkCondition(conditionName: string, args?: any): boolean;
    getId(element: T["E"], uuid?: string): string;
    getConnections(options?: SelectOptions<T["E"]>, flat?: boolean): Dictionary<Connection> | Array<Connection>;
    select(params?: SelectOptions<T["E"]>): ConnectionSelection;
    selectEndpoints(params?: SelectEndpointOptions<T["E"]>): EndpointSelection;
    setContainer(c: T["E"]): void;
    private _set;
    setSource(connection: Connection, el: T["E"] | Endpoint): void;
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
    deleteConnectionsForElement(el: T["E"], params?: DeleteConnectionOptions): JsPlumbInstance;
    private fireDetachEvent;
    fireMoveEvent(params?: ConnectionMovedParams, evt?: Event): void;
    /**
     * Manage a group of elements.
     * @param elements Array-like object of strings or elements.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manageAll(elements: Array<Element>, recalc?: boolean): void;
    /**
     * Manage an element.
     * @param element String, or element.
     * @param internalId Optional ID for jsPlumb to use internally.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manage(element: T["E"], internalId?: string, recalc?: boolean): ManagedElement<T["E"]>;
    /**
     * Stops managing the given element.
     * @param el Element, or ID of the element to stop managing.
     * @param removeElement If true, also remove the element from the renderer.
     */
    unmanage(el: T["E"], removeElement?: boolean): void;
    rotate(element: T["E"], rotation: number, doNotRepaint?: boolean): RedrawResult;
    getRotation(elementId: string): number;
    getRotations(elementId: string): Rotations;
    applyRotations(point: [number, number, number, number], rotations: Rotations): RotatedPointXY;
    applyRotationsXY(point: PointXY, rotations: Rotations): PointXY;
    /**
     * Internal method to create an Endpoint from the given options, perhaps with the given id. Do not use this method
     * as a consumer of the API. If you wish to add an Endpoint to some element, use `addEndpoint` instead.
     * @param params Options for the Endpoint.
     * @param id Optional ID for the Endpoint.
     */
    newEndpoint(params: EndpointOptions<T["E"]>, id?: string): Endpoint;
    deriveEndpointAndAnchorSpec(type: string, dontPrependDefault?: boolean): {
        endpoints: [EndpointSpec, EndpointSpec];
        anchors: [AnchorSpec, AnchorSpec];
    };
    revalidate(el: T["E"], timestamp?: string): RedrawResult;
    repaintEverything(): JsPlumbInstance;
    /**
     * Sets the position of the given element to be [x,y].
     * @param el Element to set the position for
     * @param x Position in X axis
     * @param y Position in Y axis
     * @return The result of the redraw operation that follows the update of the viewport.
     */
    setElementPosition(el: T["E"], x: number, y: number): RedrawResult;
    /**
     * Repaints all connections and endpoints associated with the given element.
     * @param el
     */
    repaint(el: T["E"]): void;
    private _draw;
    unregisterEndpoint(endpoint: Endpoint): void;
    maybePruneEndpoint(endpoint: Endpoint): boolean;
    deleteEndpoint(object: string | Endpoint): JsPlumbInstance;
    /**
     * Add an Endpoint to the given element.
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
    addEndpoints(el: T["E"], endpoints: Array<EndpointOptions<T["E"]>>, referenceParams?: any): Array<Endpoint>;
    /**
     * Clears all endpoints and connections from the instance of jsplumb. Does not also clear out event listeners - for that,
     * use `destroy()`.
     */
    reset(): void;
    /**
     * Clears the instance and unbinds any listeners on the instance. After you call this method you cannot use this
     * instance of jsPlumb again.
     */
    destroy(): void;
    getEndpoints(el: T["E"]): Array<Endpoint>;
    getEndpoint(id: string): Endpoint;
    /**
     * Connect one element to another.
     * @param params At the very least you need to supply {source:.., target:...}.
     * @param referenceParams Optional extra parameters. This can be useful when you're creating multiple connections that have some things in common.
     */
    connect(params: ConnectParams, referenceParams?: ConnectParams): Connection;
    private _prepareConnectionParams;
    _newConnection(params: any): Connection;
    _finaliseConnection(jpc: Connection, params?: any, originalEvent?: Event): void;
    removeAllEndpoints(el: T["E"], recurse?: boolean, affectedElements?: Array<T["E"]>): JsPlumbInstance;
    private _setEnabled;
    toggleSourceEnabled(el: T["E"], connectionType?: string): any;
    setSourceEnabled(el: T["E"], state: boolean, connectionType?: string): any;
    findFirstSourceDefinition(el: T["E"], connectionType?: string): SourceDefinition;
    findFirstTargetDefinition(el: T["E"], connectionType?: string): TargetDefinition;
    private findFirstDefinition;
    /**
     * Returns whether or not the given element is configured as a connection source.
     * @param el
     * @param connectionType
     */
    isSource(el: T["E"], connectionType?: string): boolean;
    /**
     * Returns whether or not the given element is configured as a connection source and that it is currently enabled.
     * @param el
     * @param connectionType
     */
    isSourceEnabled(el: T["E"], connectionType?: string): boolean;
    toggleTargetEnabled(el: T["E"], connectionType?: string): boolean;
    isTarget(el: T["E"], connectionType?: string): boolean;
    isTargetEnabled(el: T["E"], connectionType?: string): boolean;
    setTargetEnabled(el: T["E"], state: boolean, connectionType?: string): boolean;
    private _unmake;
    private _unmakeEvery;
    unmakeTarget(el: T["E"], connectionType?: string): void;
    unmakeSource(el: T["E"], connectionType?: string): void;
    unmakeEverySource(connectionType?: string): void;
    unmakeEveryTarget(connectionType?: string): void;
    private _writeScopeAttribute;
    protected _createSourceDefinition(params?: SourceBehaviouralTypeDescriptor, referenceParams?: SourceBehaviouralTypeDescriptor): SourceDefinition;
    makeSource(el: T["E"], params?: SourceBehaviouralTypeDescriptor, referenceParams?: SourceBehaviouralTypeDescriptor): JsPlumbInstance;
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
    addTargetSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): TargetSelector;
    private _getScope;
    getSourceScope(el: T["E"]): string;
    getTargetScope(el: T["E"]): string;
    getScope(el: T["E"]): string;
    private _setScope;
    setSourceScope(el: T["E"], scope: string): void;
    setTargetScope(el: T["E"], scope: string): void;
    setScope(el: T["E"], scope: string): void;
    private _createTargetDefinition;
    /**
     * Make the given element a connection target.
     * @param el
     * @param params
     * @param referenceParams
     */
    makeTarget(el: T["E"], params?: TargetBehaviouralTypeDescriptor, referenceParams?: TargetBehaviouralTypeDescriptor): JsPlumbInstance;
    show(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    hide(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    private _setVisible;
    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible(el: T["E"], changeEndpoints?: boolean): void;
    private _operation;
    registerConnectionType(id: string, type: TypeDescriptor): void;
    registerConnectionTypes(types: Dictionary<TypeDescriptor>): void;
    registerEndpointType(id: string, type: TypeDescriptor): void;
    registerEndpointTypes(types: Dictionary<TypeDescriptor>): void;
    getType(id: string, typeDescriptor: string): TypeDescriptor;
    importDefaults(d: jsPlumbDefaults<T["E"]>): JsPlumbInstance;
    restoreDefaults(): JsPlumbInstance;
    getManagedElements(): Dictionary<ManagedElement<T["E"]>>;
    proxyConnection(connection: Connection, index: number, proxyEl: T["E"], endpointGenerator: (c: Connection, idx: number) => EndpointSpec, anchorGenerator: (c: Connection, idx: number) => AnchorSpec): void;
    unproxyConnection(connection: Connection, index: number): void;
    sourceOrTargetChanged(originalId: string, newId: string, connection: any, newElement: any, index: number): void;
    getGroup(groupId: string): UIGroup<T["E"]>;
    getGroupFor(el: T["E"]): UIGroup<T["E"]>;
    addGroup(params: AddGroupOptions): UIGroup<T["E"]>;
    addToGroup(group: string | UIGroup<T["E"]>, ...el: Array<T["E"]>): void;
    collapseGroup(group: string | UIGroup<T["E"]>): void;
    expandGroup(group: string | UIGroup<T["E"]>): void;
    toggleGroup(group: string | UIGroup<T["E"]>): void;
    removeGroup(group: string | UIGroup<T["E"]>, deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): Dictionary<PointXY>;
    removeAllGroups(deleteMembers?: boolean, manipulateView?: boolean): void;
    removeFromGroup(group: string | UIGroup<T["E"]>, ...el: Array<T["E"]>): void;
    paintEndpoint(endpoint: Endpoint, params: {
        timestamp?: string;
        offset?: ViewportElement<T["E"]>;
        recalc?: boolean;
        elementWithPrecedence?: string;
        connectorPaintStyle?: PaintStyle;
        anchorLoc?: AnchorPlacement;
    }): void;
    paintConnection(connection: Connection, params?: any): void;
    refreshEndpoint(endpoint: Endpoint): void;
    /**
     * For some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group. For an element that has child
     * elements that are also managed, it means those child elements.
     * @param el
     * @private
     */
    abstract _getAssociatedElements(el: T["E"]): Array<T["E"]>;
    abstract removeElement(el: T["E"]): void;
    abstract appendElement(el: T["E"], parent: T["E"]): void;
    abstract getChildElements(el: T["E"]): Array<T["E"]>;
    abstract removeClass(el: T["E"], clazz: string): void;
    abstract addClass(el: T["E"], clazz: string): void;
    abstract toggleClass(el: T["E"], clazz: string): void;
    abstract getClass(el: T["E"]): string;
    abstract hasClass(el: T["E"], clazz: string): boolean;
    abstract setAttribute(el: T["E"], name: string, value: string): void;
    abstract getAttribute(el: T["E"], name: string): string;
    abstract setAttributes(el: T["E"], atts: Dictionary<string>): void;
    abstract removeAttribute(el: T["E"], attName: string): void;
    abstract getSelector(ctx: string | T["E"], spec?: string): Array<T["E"]>;
    abstract getStyle(el: T["E"], prop: string): any;
    abstract getSize(el: T["E"]): Size;
    abstract getOffset(el: T["E"]): PointXY;
    abstract getOffsetRelativeToRoot(el: T["E"] | string): PointXY;
    abstract setPosition(el: T["E"], p: PointXY): void;
    abstract on(el: Document | T["E"], event: string, callbackOrSelector: Function | string, callback?: Function): void;
    abstract off(el: Document | T["E"], event: string, callback: Function): void;
    abstract trigger(el: Document | T["E"], event: string, originalEvent?: Event, payload?: any): void;
    abstract getPath(segment: Segment, isFirstSegment: boolean): string;
    abstract paintOverlay(o: Overlay, params: any, extents: any): void;
    abstract addOverlayClass(o: Overlay, clazz: string): void;
    abstract removeOverlayClass(o: Overlay, clazz: string): void;
    abstract setOverlayVisible(o: Overlay, visible: boolean): void;
    abstract destroyOverlay(o: Overlay, force?: boolean): void;
    abstract updateLabel(o: LabelOverlay): void;
    abstract drawOverlay(overlay: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    abstract reattachOverlay(o: Overlay, c: OverlayCapableComponent): void;
    abstract setOverlayHover(o: Overlay, hover: boolean): void;
    abstract setHover(component: Component, hover: boolean): void;
    abstract paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: any): void;
    abstract destroyConnection(connection: Connection, force?: boolean): void;
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

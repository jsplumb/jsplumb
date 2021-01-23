import { jsPlumbDefaults, jsPlumbHelperFunctions } from "./defaults";
import { Connection } from "./connector/connection-impl";
import { Endpoint } from "./endpoint/endpoint-impl";
import { FullOverlaySpec, OverlaySpec } from "./overlay/overlay";
import { AnchorPlacement, RedrawResult } from "./anchor-manager";
import { Dictionary, UpdateOffsetOptions, Offset, Size, jsPlumbElement, PointArray, ConnectParams, // <--
SourceDefinition, TargetDefinition, BehaviouralTypeDescriptor, TypeDescriptor } from './common';
import { EventGenerator } from "./event-generator";
import { EndpointOptions } from "./endpoint/endpoint";
import { AddGroupOptions, GroupManager } from "./group/group-manager";
import { UIGroup } from "./group/group";
import { jsPlumbGeometryHelpers } from "./geom";
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
export declare type ElementSelectionSpecifier = jsPlumbElement | Array<jsPlumbElement> | '*';
export declare type SelectionList = '*' | Array<string>;
export interface AbstractSelectOptions {
    scope?: SelectionList;
    source?: ElementSelectionSpecifier;
    target?: ElementSelectionSpecifier;
}
export interface SelectOptions extends AbstractSelectOptions {
    connections?: Array<Connection>;
}
export interface SelectEndpointOptions extends AbstractSelectOptions {
    element?: ElementSelectionSpecifier;
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
export declare type ManagedElement = {
    el: jsPlumbElement;
    info?: ViewportElement;
    endpoints?: Array<Endpoint>;
    connections?: Array<Connection>;
    rotation?: number;
};
export declare abstract class JsPlumbInstance extends EventGenerator {
    readonly _instanceIndex: number;
    Defaults: jsPlumbDefaults;
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
    allowNestedGroups: boolean;
    private _curIdStamp;
    private _offsetTimestamps;
    readonly viewport: Viewport;
    readonly router: Router;
    readonly groupManager: GroupManager;
    private _connectionTypes;
    private _endpointTypes;
    private _container;
    protected _managedElements: Dictionary<ManagedElement>;
    private DEFAULT_SCOPE;
    get defaultScope(): string;
    private _helpers;
    geometry: jsPlumbGeometryHelpers;
    private _zoom;
    get currentZoom(): number;
    constructor(_instanceIndex: number, defaults?: jsPlumbDefaults, helpers?: jsPlumbHelperFunctions);
    getSize(el: any): Size;
    getOffset(el: any | string, relativeToRoot?: boolean): Offset;
    getContainer(): any;
    setZoom(z: number, repaintEverything?: boolean): boolean;
    _idstamp(): string;
    convertToFullOverlaySpec(spec: string | OverlaySpec): FullOverlaySpec;
    checkCondition(conditionName: string, args?: any): boolean;
    getId(element: jsPlumbElement, uuid?: string): string;
    getCachedData(elId: string): ViewportElement;
    getConnections(options?: SelectOptions, flat?: boolean): Dictionary<Connection> | Array<Connection>;
    select(params?: SelectOptions): ConnectionSelection;
    selectEndpoints(params?: SelectEndpointOptions): EndpointSelection;
    setContainer(c: string | jsPlumbElement): void;
    private _set;
    setSource(connection: Connection, el: jsPlumbElement | Endpoint, doNotRepaint?: boolean): void;
    setTarget(connection: Connection, el: jsPlumbElement | Endpoint, doNotRepaint?: boolean): void;
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
    computeAnchorLoc(endpoint: Endpoint, timestamp?: string): AnchorPlacement;
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
    each(spec: jsPlumbElement | Array<jsPlumbElement>, fn: (e: jsPlumbElement) => any): JsPlumbInstance;
    /**
     * Update the cached offset information for some element.
     * @param params
     * @return an UpdateOffsetResult containing the offset information for the given element.
     */
    updateOffset(params?: UpdateOffsetOptions): ViewportElement;
    /**
     * Delete the given connection.
     * @param connection Connection to delete.
     * @param params Optional extra parameters.
     */
    deleteConnection(connection: Connection, params?: DeleteConnectionOptions): boolean;
    deleteEveryConnection(params?: DeleteConnectionOptions): number;
    deleteConnectionsForElement(el: jsPlumbElement, params?: DeleteConnectionOptions): JsPlumbInstance;
    private fireDetachEvent;
    fireMoveEvent(params?: any, evt?: Event): void;
    /**
     * Manage a group of elements.
     * @param elements Array-like object of strings or elements.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manageAll(elements: Array<jsPlumbElement>, recalc?: boolean): void;
    /**
     * Manage an element.
     * @param element String, or element.
     * @param internalId Optional ID for jsPlumb to use internally.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manage(element: jsPlumbElement, internalId?: string, recalc?: boolean): ManagedElement;
    /**
     * Stops managing the given element.
     * @param el Element, or ID of the element to stop managing.
     * @param removeElement If true, also remove the element from the renderer.
     */
    unmanage(el: jsPlumbElement, removeElement?: boolean): void;
    rotate(element: jsPlumbElement, rotation: number, doNotRepaint?: boolean): RedrawResult;
    getRotation(elementId: string): number;
    /**
     * Internal method to create an Endpoint from the given options, perhaps with the given id. Do not use this method
     * as a consumer of the API. If you wish to add an Endpoint to some element, use `addEndpoint` instead.
     * @param params Options for the Endpoint.
     * @param id Optional ID for the Endpoint.
     */
    newEndpoint(params: EndpointOptions, id?: string): Endpoint;
    deriveEndpointAndAnchorSpec(type: string, dontPrependDefault?: boolean): any;
    repaint(el: jsPlumbElement, ui?: any, timestamp?: string): RedrawResult;
    revalidate(el: jsPlumbElement, timestamp?: string): RedrawResult;
    repaintEverything(): JsPlumbInstance;
    /**
     * for some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group.
     * @param el
     * @private
     */
    abstract _getAssociatedElements(el: jsPlumbElement): Array<any>;
    _draw(el: jsPlumbElement, ui?: any, timestamp?: string, offsetsWereJustCalculated?: boolean): RedrawResult;
    unregisterEndpoint(endpoint: Endpoint): void;
    maybePruneEndpoint(endpoint: Endpoint): boolean;
    deleteEndpoint(object: string | Endpoint): JsPlumbInstance;
    addEndpoint(el: jsPlumbElement, params?: EndpointOptions, referenceParams?: EndpointOptions): Endpoint;
    addEndpoints(el: jsPlumbElement, endpoints: Array<EndpointOptions>, referenceParams?: any): Array<Endpoint>;
    reset(silently?: boolean): void;
    uuid(): string;
    rotatePoint(point: Array<number>, center: PointArray, rotation: number): [number, number, number, number];
    rotateAnchorOrientation(orientation: [number, number], rotation: any): [number, number];
    destroy(): void;
    getEndpoints(el: jsPlumbElement): Array<Endpoint>;
    getEndpoint(id: string): Endpoint;
    connect(params: ConnectParams, referenceParams?: ConnectParams): Connection;
    private _prepareConnectionParams;
    _newConnection(params: any): Connection;
    _finaliseConnection(jpc: Connection, params?: any, originalEvent?: Event): void;
    removeAllEndpoints(el: jsPlumbElement, recurse?: boolean, affectedElements?: Array<jsPlumbElement>): JsPlumbInstance;
    private _setEnabled;
    toggleSourceEnabled(el: jsPlumbElement, connectionType?: string): any;
    setSourceEnabled(el: jsPlumbElement, state: boolean, connectionType?: string): any;
    findFirstSourceDefinition(el: jsPlumbElement, connectionType?: string): SourceDefinition;
    findFirstTargetDefinition(el: jsPlumbElement, connectionType?: string): TargetDefinition;
    private findFirstDefinition;
    isSource(el: jsPlumbElement, connectionType?: string): any;
    isSourceEnabled(el: jsPlumbElement, connectionType?: string): boolean;
    toggleTargetEnabled(el: jsPlumbElement, connectionType?: string): any;
    isTarget(el: jsPlumbElement, connectionType?: string): boolean;
    isTargetEnabled(el: jsPlumbElement, connectionType?: string): boolean;
    setTargetEnabled(el: jsPlumbElement, state: boolean, connectionType?: string): any;
    private _unmake;
    private _unmakeEvery;
    unmakeTarget(el: jsPlumbElement, connectionType?: string): void;
    unmakeSource(el: jsPlumbElement, connectionType?: string): void;
    unmakeEverySource(connectionType?: string): void;
    unmakeEveryTarget(connectionType?: string): void;
    private _writeScopeAttribute;
    makeSource(el: jsPlumbElement, params?: BehaviouralTypeDescriptor, referenceParams?: any): JsPlumbInstance;
    private _getScope;
    getSourceScope(el: jsPlumbElement): string;
    getTargetScope(el: jsPlumbElement): string;
    getScope(el: jsPlumbElement): string;
    private _setScope;
    setSourceScope(el: jsPlumbElement, scope: string): void;
    setTargetScope(el: jsPlumbElement, scope: string): void;
    setScope(el: jsPlumbElement, scope: string): void;
    makeTarget(el: jsPlumbElement, params: BehaviouralTypeDescriptor, referenceParams?: any): JsPlumbInstance;
    show(el: jsPlumbElement, changeEndpoints?: boolean): JsPlumbInstance;
    hide(el: jsPlumbElement, changeEndpoints?: boolean): JsPlumbInstance;
    private _setVisible;
    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible(el: jsPlumbElement, changeEndpoints?: boolean): void;
    private _operation;
    registerConnectionType(id: string, type: TypeDescriptor): void;
    registerConnectionTypes(types: Dictionary<TypeDescriptor>): void;
    registerEndpointType(id: string, type: TypeDescriptor): void;
    registerEndpointTypes(types: Dictionary<TypeDescriptor>): void;
    getType(id: string, typeDescriptor: string): TypeDescriptor;
    importDefaults(d: jsPlumbDefaults): JsPlumbInstance;
    restoreDefaults(): JsPlumbInstance;
    getManagedElements(): Dictionary<ManagedElement>;
    proxyConnection(connection: Connection, index: number, proxyEl: jsPlumbElement, proxyElId: string, endpointGenerator: any, anchorGenerator: any): void;
    unproxyConnection(connection: Connection, index: number, proxyElId: string): void;
    sourceOrTargetChanged(originalId: string, newId: string, connection: any, newElement: any, index: number): void;
    getGroup(groupId: string): UIGroup;
    getGroupFor(el: jsPlumbElement): UIGroup;
    addGroup(params: AddGroupOptions): UIGroup;
    addToGroup(group: string | UIGroup, ...el: Array<jsPlumbElement>): void;
    collapseGroup(group: string | UIGroup): void;
    expandGroup(group: string | UIGroup): void;
    toggleGroup(group: string | UIGroup): void;
    removeGroup(group: string | UIGroup, deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): void;
    removeAllGroups(deleteMembers?: boolean, manipulateView?: boolean): void;
    removeFromGroup(group: string | UIGroup, ...el: Array<jsPlumbElement>): void;
    abstract getElement(el: any | string): any;
    abstract getElementById(el: string): any;
    abstract removeElement(el: any): void;
    abstract appendElement(el: any, parent: any): void;
    abstract getChildElements(el: jsPlumbElement): Array<jsPlumbElement>;
    abstract removeClass(el: any, clazz: string): void;
    abstract addClass(el: any, clazz: string): void;
    abstract toggleClass(el: any, clazz: string): void;
    abstract getClass(el: any): string;
    abstract hasClass(el: any, clazz: string): boolean;
    abstract setAttribute(el: any, name: string, value: string): void;
    abstract getAttribute(el: any, name: string): string;
    abstract setAttributes(el: any, atts: Dictionary<string>): void;
    abstract removeAttribute(el: any, attName: string): void;
    abstract getSelector(ctx: string | any, spec?: string): NodeListOf<any>;
    abstract getStyle(el: any, prop: string): any;
    abstract _getSize(el: any): Size;
    abstract _getOffset(el: any | string): Offset;
    abstract _getOffsetRelativeToRoot(el: any | string): Offset;
    abstract setPosition(el: any, p: Offset): void;
    abstract on(el: any, event: string, callbackOrSelector: Function | string, callback?: Function): void;
    abstract off(el: any, event: string, callback: Function): void;
    abstract trigger(el: any, event: string, originalEvent?: Event, payload?: any): void;
    abstract getPath(segment: Segment, isFirstSegment: boolean): string;
    abstract paintOverlay(o: Overlay, params: any, extents: any): void;
    abstract addOverlayClass(o: Overlay, clazz: string): void;
    abstract removeOverlayClass(o: Overlay, clazz: string): void;
    abstract setOverlayVisible(o: Overlay, visible: boolean): void;
    abstract destroyOverlay(o: Overlay, force?: boolean): void;
    abstract updateLabel(o: LabelOverlay): void;
    abstract drawOverlay(overlay: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointArray): any;
    abstract moveOverlayParent(o: Overlay, newParent: any): void;
    abstract reattachOverlay(o: Overlay, c: OverlayCapableComponent): any;
    abstract setOverlayHover(o: Overlay, hover: boolean): any;
    abstract setHover(component: Component, hover: boolean): void;
    abstract paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: any): void;
    abstract destroyConnection(connection: Connection, force?: boolean): void;
    abstract setConnectorHover(connector: AbstractConnector, h: boolean, doNotCascade?: boolean): void;
    abstract addConnectorClass(connector: AbstractConnector, clazz: string): void;
    abstract removeConnectorClass(connector: AbstractConnector, clazz: string): void;
    abstract getConnectorClass(connector: AbstractConnector): string;
    abstract setConnectorVisible(connector: AbstractConnector, v: boolean): void;
    abstract applyConnectorType(connector: AbstractConnector, t: TypeDescriptor): void;
    abstract applyEndpointType(ep: Endpoint, t: TypeDescriptor): void;
    abstract setEndpointVisible(ep: Endpoint, v: boolean): void;
    abstract destroyEndpoint(ep: Endpoint): void;
    abstract paintEndpoint(ep: Endpoint, paintStyle: PaintStyle): void;
    abstract addEndpointClass(ep: Endpoint, c: string): void;
    abstract removeEndpointClass(ep: Endpoint, c: string): void;
    abstract getEndpointClass(ep: Endpoint): string;
    abstract setEndpointHover(endpoint: Endpoint, h: boolean, doNotCascade?: boolean): void;
    abstract refreshEndpoint(endpoint: Endpoint): void;
}

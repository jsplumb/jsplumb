import { jsPlumbDefaults, jsPlumbHelperFunctions } from "./defaults";
import { ComponentParameters } from "./component/component";
import { PaintStyle } from "./styles";
import { Connection } from "./connector/connection-impl";
import { Endpoint } from "./endpoint/endpoint-impl";
import { FullOverlaySpec, Overlay, OverlaySpec } from "./overlay/overlay";
import { AnchorManager } from "./anchor-manager";
import { EventGenerator } from "./event-generator";
import { Renderer } from "./renderer";
import { AnchorSpec } from "./factory/anchor-factory";
import { Anchor } from "./anchor/anchor";
import { EndpointOptions, EndpointSpec } from "./endpoint";
import { ConnectorSpec } from "./connector";
import { GroupManager } from "./group/group-manager";
import { UIGroup } from "./group/group";
export interface TypeDescriptor {
    cssClass?: string;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    parameters?: any;
    overlays?: Array<OverlaySpec>;
    overlayMap?: Dictionary<FullOverlaySpec>;
    endpoints?: [EndpointSpec, EndpointSpec];
    endpoint?: EndpointSpec;
    anchors?: [AnchorSpec, AnchorSpec];
    anchor?: AnchorSpec;
    detachable?: boolean;
    reattach?: boolean;
    scope?: string;
    connector?: ConnectorSpec;
}
export interface DeleteOptions<E> {
    connection?: Connection<E>;
    endpoint?: Endpoint<E>;
    dontUpdateHover?: boolean;
    deleteAttachedObjects?: boolean;
    originalEvent?: Event;
    fireEvent?: boolean;
}
export interface DeleteResult<E> {
    endpoints: Dictionary<Endpoint<E>>;
    connections: Dictionary<Connection<E>>;
    endpointCount: number;
    connectionCount: number;
}
export interface Offset {
    left: number;
    top: number;
}
export declare type Size = [number, number];
export interface OffsetAndSize {
    o: Offset;
    s: Size;
}
export declare type PointArray = [number, number];
export declare type PointXY = {
    x: number;
    y: number;
    theta?: number;
};
export declare type BoundingBox = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export declare type RectangleXY = BoundingBox;
export declare type LineXY = [PointXY, PointXY];
export interface UpdateOffsetOptions {
    timestamp?: string;
    recalc?: boolean;
    offset?: Offset;
    elId?: string;
}
export declare type UpdateOffsetResult = {
    o: ExtendedOffset;
    s: Size;
};
export interface ExtendedOffset extends Offset {
    width?: number;
    height?: number;
    centerx?: number;
    centery?: number;
    bottom?: number;
    right?: number;
}
export interface Dictionary<T> {
    [Key: string]: T;
}
export declare type ElementSpec<E> = string | E | Array<string | E>;
export declare type SortFunction<T> = (a: T, b: T) => number;
export declare type Constructable<T> = {
    new (...args: any[]): T;
};
export declare type Timestamp = string;
interface AbstractSelection<T, E> {
    length: number;
    each: (handler: (arg0: T) => void) => void;
    get(index: number): T;
    getLabel: () => string;
    getOverlay: (id: string) => Overlay<E>;
    isHover: () => boolean;
    getParameter: (key: string) => any;
    getParameters: () => ComponentParameters;
    getPaintStyle: () => PaintStyle;
    getHoverPaintStyle: () => PaintStyle;
    isVisible: () => boolean;
    hasType: (id: string) => boolean;
    getType: () => any;
    isSuspendEvents: () => boolean;
    "delete": () => void;
    addClass: (clazz: string, updateAttachedElements?: boolean) => void;
    removeClass: (clazz: string, updateAttachedElements?: boolean) => void;
}
export interface AbstractSelectOptions<E> {
    scope?: string;
    source?: string | E | Array<string | E>;
    target?: string | E | Array<string | E>;
}
export interface SelectOptions<E> extends AbstractSelectOptions<E> {
    connections?: Array<Connection<E>>;
}
export interface SelectEndpointOptions<E> extends AbstractSelectOptions<E> {
    element?: string | E | Array<string | E>;
}
export interface ConnectionSelection<E> extends AbstractSelection<Connection<E>, E> {
    setDetachable: (d: boolean) => void;
    setReattach: (d: boolean) => void;
    setConnector: (d: ConnectorSpec) => void;
    isDetachable: () => any;
    isReattach: () => any;
}
export interface EndpointSelection<E> extends AbstractSelection<Endpoint<E>, E> {
    setEnabled: (e: boolean) => void;
    setAnchor: (a: AnchorSpec) => void;
    isEnabled: () => any[];
    deleteEveryConnection: () => void;
}
export declare type DeleteConnectionOptions = {
    force?: boolean;
    fireEvent?: boolean;
    originalEvent?: Event;
};
/**
 * creates a timestamp, using milliseconds since 1970, but as a string.
 */
export declare function _timestamp(): Timestamp;
export declare function extend<T>(o1: T, o2: T, keys?: string[]): T;
declare type ContainerDelegation = [string, Function];
declare type ManagedElement<E> = {
    el: E;
    info?: {
        o: Offset;
        s: Size;
    };
    endpoints?: Array<Endpoint<E>>;
    connections?: Array<Connection<E>>;
};
export declare abstract class jsPlumbInstance<E> extends EventGenerator {
    protected _instanceIndex: number;
    renderer: Renderer<E>;
    Defaults: jsPlumbDefaults;
    private _initialDefaults;
    _containerDelegations: ContainerDelegation[];
    eventManager: any;
    isConnectionBeingDragged: boolean;
    currentlyDragging: boolean;
    hoverSuspended: boolean;
    _suspendDrawing: boolean;
    _suspendedAt: string;
    connectorClass: string;
    connectorOutlineClass: string;
    connectedClass: string;
    hoverClass: string;
    endpointClass: string;
    endpointConnectedClass: string;
    endpointFullClass: string;
    endpointDropAllowedClass: string;
    endpointDropForbiddenClass: string;
    overlayClass: string;
    draggingClass: string;
    elementDraggingClass: string;
    sourceElementDraggingClass: string;
    endpointAnchorClassPrefix: string;
    targetElementDraggingClass: string;
    hoverSourceClass: string;
    hoverTargetClass: string;
    dragSelectClass: string;
    connections: Array<Connection<E>>;
    endpointsByElement: Dictionary<Array<Endpoint<E>>>;
    endpointsByUUID: Dictionary<Endpoint<E>>;
    private _curIdStamp;
    private _offsetTimestamps;
    private _offsets;
    private _sizes;
    anchorManager: AnchorManager<E>;
    groupManager: GroupManager<E>;
    _connectionTypes: Dictionary<TypeDescriptor>;
    _endpointTypes: Dictionary<TypeDescriptor>;
    _container: E;
    _managedElements: Dictionary<ManagedElement<E>>;
    _floatingConnections: Dictionary<Connection<E>>;
    DEFAULT_SCOPE: string;
    _helpers?: jsPlumbHelperFunctions<E>;
    _zoom: number;
    abstract getElement(el: E | string): E;
    abstract getElementById(el: string): E;
    abstract removeElement(el: E | string): void;
    abstract appendElement(el: E, parent: E): void;
    abstract removeClass(el: E, clazz: string): void;
    abstract addClass(el: E, clazz: string): void;
    abstract toggleClass(el: E, clazz: string): void;
    abstract getClass(el: E): string;
    abstract hasClass(el: E, clazz: string): boolean;
    abstract setAttribute(el: E, name: string, value: string): void;
    abstract getAttribute(el: E, name: string): string;
    abstract setAttributes(el: E, atts: Dictionary<string>): void;
    abstract removeAttribute(el: E, attName: string): void;
    abstract getSelector(ctx: string | E, spec?: string): NodeListOf<any>;
    abstract getStyle(el: E, prop: string): any;
    abstract _getSize(el: E): Size;
    abstract _getOffset(el: E | string, relativeToRoot?: boolean, container?: E): Offset;
    abstract setPosition(el: E, p: Offset): void;
    abstract getUIPosition(eventArgs: any): Offset;
    abstract on(el: E, event: string, callbackOrSelector: Function | string, callback?: Function): void;
    abstract off(el: E, event: string, callback: Function): void;
    abstract trigger(el: E, event: string, originalEvent?: Event, payload?: any): void;
    abstract createElement(tag: string, style?: Dictionary<any>, clazz?: string, atts?: Dictionary<string | number>): E;
    abstract createElementNS(ns: string, tag: string, style?: Dictionary<any>, clazz?: string, atts?: Dictionary<string | number>): E;
    constructor(_instanceIndex: number, renderer: Renderer<E>, defaults?: jsPlumbDefaults, helpers?: jsPlumbHelperFunctions<E>);
    getSize(el: E): [number, number];
    getOffset(el: E | string, relativeToRoot?: boolean, container?: E): Offset;
    getContainer(): E;
    setZoom(z: number, repaintEverything?: boolean): boolean;
    getZoom(): number;
    _info(el: string | E): {
        el: E;
        text?: boolean;
        id?: string;
    };
    _idstamp(): string;
    convertToFullOverlaySpec(spec: string | OverlaySpec): FullOverlaySpec;
    checkCondition(conditionName: string, args?: any): boolean;
    getInternalId(element: E): string;
    getId(element: string | E, uuid?: string): string;
    /**
     * Set the id of the given element. Changes all the refs etc. Why is this ene
     * @param el
     * @param newId
     * @param doNotSetAttribute
     */
    setId(el: string | E, newId: string, doNotSetAttribute?: boolean): void;
    setIdChanged(oldId: string, newId: string): void;
    getCachedData(elId: string): {
        o: Offset;
        s: Size;
    };
    getConnections(options?: SelectOptions<E>, flat?: boolean): Dictionary<Connection<E>> | Array<Connection<E>>;
    private _makeCommonSelectHandler;
    private _makeConnectionSelectHandler;
    private _makeEndpointSelectHandler;
    select(params?: SelectOptions<E>): ConnectionSelection<E>;
    selectEndpoints(params?: SelectEndpointOptions<E>): EndpointSelection<E>;
    setContainer(c: E | string): void;
    private _set;
    setSource(connection: Connection<E>, el: E | Endpoint<E>, doNotRepaint?: boolean): void;
    setTarget(connection: Connection<E>, el: E | Endpoint<E>, doNotRepaint?: boolean): void;
    isHoverSuspended(): boolean;
    setSuspendDrawing(val?: boolean, repaintAfterwards?: boolean): boolean;
    getSuspendedAt(): string;
    batch(fn: Function, doNotRepaintAfterwards?: boolean): void;
    getDefaultScope(): string;
    /**
     * Execute the given function for each of the given elements.
     * @param spec An Element, or an element id, or an array of elements/element ids.
     * @param fn
     */
    each(spec: ElementSpec<E>, fn: (e: E) => any): jsPlumbInstance<E>;
    updateOffset(params?: UpdateOffsetOptions): UpdateOffsetResult;
    deleteConnection(connection: Connection<E>, params?: DeleteConnectionOptions): boolean;
    deleteEveryConnection(params?: DeleteConnectionOptions): number;
    deleteConnectionsForElement(el: E | string, params?: DeleteConnectionOptions): jsPlumbInstance<E>;
    private fireDetachEvent;
    fireMoveEvent(params?: any, evt?: Event): void;
    manage(element: ElementSpec<E>, recalc?: boolean): void;
    unmanage(id: string): void;
    newEndpoint(params: any, id?: string): Endpoint<E>;
    deriveEndpointAndAnchorSpec(type: string, dontPrependDefault?: boolean): any;
    getAllConnections(): Array<Connection<E>>;
    repaint(el: string | E | Array<string | E>, ui?: any, timestamp?: string): jsPlumbInstance<E>;
    revalidate(el: string | E | Array<string | E>, timestamp?: string, isIdAlready?: boolean): jsPlumbInstance<E>;
    repaintEverything(): jsPlumbInstance<E>;
    /**
     * for some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group.
     * @param el
     * @private
     */
    abstract _getAssociatedElements(el: E): Array<E>;
    _draw(element: string | E, ui?: any, timestamp?: string, offsetsWereJustCalculated?: boolean): void;
    deleteObject(params: DeleteOptions<E>): DeleteResult<E>;
    unregisterEndpoint(endpoint: Endpoint<E>): void;
    deleteEndpoint(object: string | Endpoint<E>, dontUpdateHover?: boolean, deleteAttachedObjects?: boolean): jsPlumbInstance<E>;
    addEndpoint(el: string | E, params?: EndpointOptions<E>, referenceParams?: EndpointOptions<E>): Endpoint<E>;
    addEndpoints(el: E, endpoints: Array<EndpointOptions<E>>, referenceParams?: any): Array<Endpoint<E>>;
    reset(silently?: boolean): void;
    uuid(): string;
    destroy(): void;
    getEndpoints(el: string | E): Array<Endpoint<E>>;
    getEndpoint(id: string): Endpoint<E>;
    connect(params: any, referenceParams?: any): Connection<E>;
    _prepareConnectionParams(params: any, referenceParams?: any): any;
    _newConnection(params: any): Connection<E>;
    _finaliseConnection(jpc: Connection<E>, params?: any, originalEvent?: Event, doInformAnchorManager?: boolean): void;
    private _doRemove;
    remove(el: string | E, doNotRepaint?: boolean): jsPlumbInstance<E>;
    removeAllEndpoints(el: string | E, recurse?: boolean, affectedElements?: Array<any>): jsPlumbInstance<E>;
    private _setEnabled;
    toggleSourceEnabled(el: E, connectionType?: string): any;
    setSourceEnabled(el: ElementSpec<E>, state: boolean, connectionType?: string): any;
    findFirstSourceDefinition(el: E, connectionType?: string): any;
    findFirstTargetDefinition(el: E, connectionType?: string): any;
    private findFirstDefinition;
    isSource(el: E, connectionType?: string): any;
    isSourceEnabled(el: E, connectionType?: string): boolean;
    toggleTargetEnabled(el: E, connectionType?: string): any;
    isTarget(el: E, connectionType?: string): boolean;
    isTargetEnabled(el: E, connectionType?: string): boolean;
    setTargetEnabled(el: E, state: boolean, connectionType?: string): any;
    makeAnchor(spec: AnchorSpec, elementId?: string): Anchor;
    private _unmake;
    private _unmakeEvery;
    unmakeTarget(el: E, connectionType?: string): void;
    unmakeSource(el: E, connectionType?: string): void;
    unmakeEverySource(connectionType?: string): void;
    unmakeEveryTarget(connectionType?: string): void;
    private _writeScopeAttribute;
    makeSource(el: ElementSpec<E>, params?: any, referenceParams?: any): jsPlumbInstance<E>;
    private _getScope;
    getSourceScope(el: E | string): string;
    getTargetScope(el: E | string): string;
    getScope(el: E | string): string;
    private _setScope;
    setSourceScope(el: E | string, scope: string): void;
    setTargetScope(el: E | string, scope: string): void;
    setScope(el: E | string, scope: string): void;
    makeTarget(el: ElementSpec<E>, params: any, referenceParams?: any): jsPlumbInstance<E>;
    show(el: string | E, changeEndpoints?: boolean): jsPlumbInstance<E>;
    hide(el: string | E, changeEndpoints?: boolean): jsPlumbInstance<E>;
    private _setVisible;
    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible(elId: string, changeEndpoints?: boolean): void;
    private _operation;
    registerConnectionType(id: string, type: TypeDescriptor): void;
    registerConnectionTypes(types: Dictionary<TypeDescriptor>): void;
    registerEndpointType(id: string, type: TypeDescriptor): void;
    registerEndpointTypes(types: Dictionary<TypeDescriptor>): void;
    getType(id: string, typeDescriptor: string): TypeDescriptor;
    importDefaults(d: jsPlumbDefaults): jsPlumbInstance<E>;
    restoreDefaults(): jsPlumbInstance<E>;
    getManagedElements(): Dictionary<ManagedElement<E>>;
    proxyConnection(connection: Connection<E>, index: number, proxyEl: E, proxyElId: string, endpointGenerator: any, anchorGenerator: any): void;
    unproxyConnection(connection: Connection<E>, index: number, proxyElId: string): void;
    sourceChanged(originalId: string, newId: string, connection: any, newElement: any): void;
    getGroup(id: string): UIGroup<E>;
    getGroupFor(el: E | string): UIGroup<E>;
    addGroup(params: any): UIGroup<E>;
    addToGroup(group: string | UIGroup<E>, el: E | Array<E>, doNotFireEvent?: boolean): void;
    collapseGroup(group: string | UIGroup<E>): void;
    expandGroup(group: string | UIGroup<E>): void;
    toggleGroup(group: string | UIGroup<E>): void;
    removeGroup(group: string | UIGroup<E>, deleteMembers?: boolean, manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    removeAllGroups(deleteMembers?: boolean, manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    removeFromGroup(group: string | UIGroup<E>, el: E, doNotFireEvent?: boolean): void;
}
export {};

import { UIGroup } from "./group/group";
import { Endpoint, EndpointStyle } from "./endpoint/endpoint";
import { EndpointSpec } from "./endpoint/endpoint";
import { AnchorSpec } from "./factory/anchor-factory";
import { ConnectorSpec } from "./connector/abstract-connector";
import { OverlaySpec } from "./overlay/overlay";
import { PaintStyle } from "./styles";
import { Connection } from "./connector/connection-impl";
export declare type UUID = string;
export interface jsPlumbElement<E> {
    _jsPlumbTargetDefinitions: Array<TargetDefinition>;
    _jsPlumbSourceDefinitions: Array<SourceDefinition>;
    _jsPlumbGroup: UIGroup<E>;
    _jsPlumbParentGroup: UIGroup<E>;
    _jsPlumbProxies: Array<[Connection, number]>;
    _isJsPlumbGroup: boolean;
    parentNode: jsPlumbElement<E>;
}
export interface ConnectParams<E> {
    uuids?: [UUID, UUID];
    source?: Element | Endpoint;
    target?: Element | Endpoint;
    detachable?: boolean;
    deleteEndpointsOnDetach?: boolean;
    reattach?: boolean;
    endpoint?: EndpointSpec;
    anchor?: AnchorSpec;
    anchors?: [AnchorSpec, AnchorSpec];
    label?: string;
    connector?: ConnectorSpec;
    overlays?: Array<OverlaySpec>;
    endpoints?: [EndpointSpec, EndpointSpec];
    endpointStyles?: [EndpointStyle, EndpointStyle];
    endpointHoverStyles?: [EndpointStyle, EndpointStyle];
    endpointStyle?: EndpointStyle;
    endpointHoverStyle?: EndpointStyle;
    ports?: [string, string];
    type?: string;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
}
export interface InternalConnectParams<E> extends ConnectParams<E> {
    sourceEndpoint?: Endpoint<E>;
    targetEndpoint?: Endpoint<E>;
    scope?: string;
    type?: string;
    newConnection?: (p: any) => Connection;
}
export interface ConnectionEstablishedParams<E = any> {
    connection: Connection<E>;
    source: E;
    sourceEndpoint: Endpoint<E>;
    sourceId: string;
    target: E;
    targetEndpoint: Endpoint<E>;
    targetId: string;
}
export interface ConnectionDetachedParams<E = any> extends ConnectionEstablishedParams<E> {
}
export interface ConnectionMovedParams<E = any> {
    connection: Connection<E>;
    index: number;
    originalSourceId: string;
    newSourceId: string;
    originalTargetId: string;
    newTargetId: string;
    originalEndpoint: Endpoint<E>;
    newEndpoint: Endpoint<E>;
}
export interface TypeDescriptor {
    cssClass?: string;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    parameters?: any;
    overlays?: Array<OverlaySpec>;
    anchors?: [AnchorSpec, AnchorSpec];
    anchor?: AnchorSpec;
    scope?: string;
    mergeStrategy?: string;
    endpoint?: EndpointSpec;
    connectorStyle?: PaintStyle;
    connectorHoverStyle?: PaintStyle;
    connector?: ConnectorSpec;
    connectorClass?: string;
}
export interface EndpointTypeDescriptor extends TypeDescriptor {
    connectionsDetachable?: boolean;
    reattachConnections?: boolean;
    maxConnections?: number;
}
export interface ConnectionTypeDescriptor extends TypeDescriptor {
    detachable?: boolean;
    reattach?: boolean;
    endpoints?: [EndpointSpec, EndpointSpec];
}
export interface BehaviouralTypeDescriptor extends EndpointTypeDescriptor {
    extract?: Dictionary<string>;
    uniqueEndpoint?: boolean;
    /**
     * Optional function to call if the user begins a new connection drag when the associated element is full.
     * @param value
     * @param event
     */
    onMaxConnections?: (value: any, event?: any) => any;
    connectionType?: string;
    portId?: string;
    /**
     * Defaults to true. If false, the user will not be permitted to drag a connection from the current node to itself.
     */
    allowLoopback?: boolean;
    rank?: number;
    /**
     * Optional selector identifying the ancestor of the event target that will be the element to which connections
     * are added. By default this is the internal attribute jsPlumb uses to mark managed elements (data-jtk-managed)
     *
     * TODO this only applies to an instance-wide source selector
     */
    parentSelector?: string;
    /**
     * If true, an Endpoint is created prior to the user interacting with the element.
     *
     * TODO this only applies to element selectors, not instance wide selectors.
     */
    createEndpoint?: boolean;
    /**
     * Optional filter that defines what parts of the element should respond to the mouse.
     * TODO this only applies to element selectors, not instance wide selectors.
     */
    filter?: string | Function;
    /**
     * Optional flag to indicate that `filter` defines parts of the element that should _not_ respond to the
     * mouse. Only valid if `filter` is also set.
     * TODO this only applies to element selectors, not instance wide selectors.
     */
    filterExclude?: boolean;
}
export interface SourceOrTargetDefinition {
    enabled?: boolean;
    def: BehaviouralTypeDescriptor;
    endpoint?: Endpoint;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
}
export interface SourceDefinition extends SourceOrTargetDefinition {
    def: BehaviouralTypeDescriptor;
}
export interface TargetDefinition extends SourceOrTargetDefinition {
    def: BehaviouralTypeDescriptor;
}
export interface Size {
    w: number;
    h: number;
}
export interface PointXY {
    x: number;
    y: number;
    theta?: number;
}
export declare type BoundingBox = {
    x: number;
    y: number;
    w: number;
    h: number;
    center?: PointXY;
};
export declare type RectangleXY = BoundingBox;
export declare type LineXY = [PointXY, PointXY];
/**
 * Subtracts p2 from p1, returning a new point.
 * @param p1
 * @param p2
 */
export declare function pointSubtract(p1: PointXY, p2: PointXY): PointXY;
export interface UpdateOffsetOptions {
    timestamp?: string;
    recalc?: boolean;
    elId?: string;
}
export interface Dictionary<T> {
    [Key: string]: T;
}
export declare type SortFunction<T> = (a: T, b: T) => number;
export declare type Constructable<T> = {
    new (...args: any[]): T;
};
export interface Rotation {
    r: number;
    c: PointXY;
}
export declare type Rotations = Array<Rotation>;

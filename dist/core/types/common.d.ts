import { UIGroup } from "./group/group";
import { Endpoint, EndpointStyle } from "./endpoint/endpoint";
import { EndpointSpec } from "./endpoint/endpoint";
import { AnchorSpec } from "./factory/anchor-factory";
import { ConnectorSpec } from "./connector/abstract-connector";
import { FullOverlaySpec, OverlaySpec } from "./overlay/overlay";
import { PaintStyle } from "./styles";
import { Connection } from "./connector/connection-impl";
export declare type UUID = string;
export interface jsPlumbElement<E> {
    _jsPlumbTargetDefinitions: Array<TargetDefinition>;
    _jsPlumbSourceDefinitions: Array<SourceDefinition>;
    _jsplumbid: string;
    _jsPlumbGroup: UIGroup<E>;
    _jsPlumbParentGroup: UIGroup<E>;
    _jspContext?: any;
    _jsPlumbConnections: Dictionary<boolean>;
    _jsPlumbProxies: Array<[Connection, number]>;
    _isJsPlumbGroup: boolean;
}
export interface ConnectParams {
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
}
export interface InternalConnectParams<E> extends ConnectParams {
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
    overlayMap?: Dictionary<FullOverlaySpec>;
    endpoints?: [EndpointSpec, EndpointSpec];
    endpoint?: EndpointSpec;
    anchors?: [AnchorSpec, AnchorSpec];
    anchor?: AnchorSpec;
    detachable?: boolean;
    reattach?: boolean;
    scope?: string;
    connector?: ConnectorSpec;
    mergeStrategy?: string;
}
export interface BehaviouralTypeDescriptor extends TypeDescriptor {
    filter?: string | Function;
    filterExclude?: boolean;
    extract?: Dictionary<string>;
    uniqueEndpoint?: boolean;
    onMaxConnections?: (value: any, event?: any) => any;
    connectionType?: string;
    portId?: string;
    allowLoopback?: boolean;
    rank?: number;
    maxConnections?: number;
    connectorStyle?: PaintStyle;
}
export interface SourceBehaviouralTypeDescriptor extends BehaviouralTypeDescriptor {
    createEndpoint?: boolean;
}
export interface TargetBehaviouralTypeDescriptor extends BehaviouralTypeDescriptor {
    createEndpoint?: boolean;
}
export interface SourceOrTargetDefinition {
    enabled?: boolean;
    def: BehaviouralTypeDescriptor;
    endpoint?: Endpoint;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
}
export interface SourceDefinition extends SourceOrTargetDefinition {
    def: SourceBehaviouralTypeDescriptor;
}
export interface TargetDefinition extends SourceOrTargetDefinition {
    def: TargetBehaviouralTypeDescriptor;
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

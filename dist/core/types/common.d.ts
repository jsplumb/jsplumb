import { Endpoint, EndpointStyle } from "./endpoint/endpoint";
import { OverlaySpec } from "./overlay/overlay";
import { PaintStyle } from "./styles";
import { Connection } from "./connector/connection-impl";
import { RedropPolicy } from "./source-selector";
import { Dictionary } from "@jsplumb/util";
import { AnchorSpec, ConnectorSpec, EndpointSpec } from "@jsplumb/common";
export declare type UUID = string;
/**
 * Options for the `connect` call on a JsPlumbInstance
 */
export interface ConnectParams<E> {
    /**
     * Optional UUIDs to assign to the source and target endpoints.
     */
    uuids?: [UUID, UUID];
    /**
     * Source for the connection - an Endpoint, or an element
     */
    source?: Element | Endpoint;
    /**
     * Source for the connection - an Endpoint, or an element
     */
    target?: Element | Endpoint;
    /**
     * Whether or not the connection is detachable. Defaults to true.
     */
    detachable?: boolean;
    /**
     * Whether or not to delete the connection's endpoints when this connection is detached. Defaults to false. Does not
     * delete endpoints if they have other connections.
     */
    deleteEndpointsOnDetach?: boolean;
    /**
     * Whether or not to delete any endpoints that were created by this connect call if at some
     * point in the future the endpoint has no remaining connections. Defaults to false.
     */
    deleteEndpointsOnEmpty?: boolean;
    /**
     * Whether or not to reattach this connection automatically should it be detached via user intervention. Defaults to false.
     */
    reattach?: boolean;
    /**
     * Spec for the endpoint to use for both source and target endpoints.
     */
    endpoint?: EndpointSpec;
    /**
     * Individual endpoint specs for the source/target endpoints.
     */
    endpoints?: [EndpointSpec, EndpointSpec];
    /**
     * Spec for the anchor to use for both source and target endpoints.
     */
    anchor?: AnchorSpec;
    /**
     * Individual anchor specs for the source/target endpoints.
     */
    anchors?: [AnchorSpec, AnchorSpec];
    /**
     * Optional label to set on the connection. In the default browser UI implementation this is rendered as a `label` attribute on the SVG element representing the connection.
     */
    label?: string;
    /**
     * Spec for the connector used to paint the connection.
     */
    connector?: ConnectorSpec;
    /**
     * Optional list of overlays to attach to the connection.
     */
    overlays?: Array<OverlaySpec>;
    /**
     * Spec for the styles to use on both source and target endpoints
     */
    endpointStyle?: EndpointStyle;
    /**
     * Individual specs for the source/target endpoint styles.
     */
    endpointStyles?: [EndpointStyle, EndpointStyle];
    /**
     * Spec for the styles to use on both source and target endpoints when they are in hover state
     */
    endpointHoverStyle?: EndpointStyle;
    /**
     * Individual specs for the source/target endpoint styles when they are in hover state.
     */
    endpointHoverStyles?: [EndpointStyle, EndpointStyle];
    /**
     * Optional port IDs for the source and target endpoints
     */
    ports?: [string, string];
    /**
     * Type of the connection. Used in conjunction with the `registerConnectionType` method.
     */
    type?: string;
    /**
     * Paint style for the connector.
     */
    paintStyle?: PaintStyle;
    /**
     * Paint style for the connector when in hover mode.
     */
    hoverPaintStyle?: PaintStyle;
    /**
     * Whether or not the connection is considered to be 'directed'
     */
    directed?: boolean;
    /**
     * Cost of the connection. Defaults to 1.
     */
    cost?: number;
    id?: string;
    data?: any;
    cssClass?: string;
    hoverClass?: string;
    outlineStroke?: number;
    outlineWidth?: number;
    scope?: string;
}
/**
 * Internal extension of ConnectParams containing a few extra things needed to establish a connection.
 */
export interface InternalConnectParams<E> extends ConnectParams<E> {
    sourceEndpoint?: Endpoint<E>;
    targetEndpoint?: Endpoint<E>;
    scope?: string;
    type?: string;
    newConnection?: (p: any) => Connection;
    id?: string;
}
/**
 * Definition of the parameters passed to a listener for the `connection` event.
 */
export interface ConnectionEstablishedParams<E = any> {
    connection: Connection<E>;
    source: E;
    sourceEndpoint: Endpoint<E>;
    sourceId: string;
    target: E;
    targetEndpoint: Endpoint<E>;
    targetId: string;
}
/**
 * Definition of the parameters passed to a listener for the `connection:detach` event.
 */
export interface ConnectionDetachedParams<E = any> extends ConnectionEstablishedParams<E> {
}
/**
 * Definition of the parameters passed to a listener for the `connection:move` event.
 */
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
/**
 * Definition of the parameters passed to the `beforeDrop` interceptor.
 */
export interface BeforeDropParams {
    sourceId: string;
    targetId: string;
    scope: string;
    connection: Connection;
    dropEndpoint: Endpoint;
}
export interface ManageElementParams<E = any> {
    el: E;
}
export interface UnmanageElementParams<E = any> {
    el: E;
}
/**
 * Base interface for endpoint/connection types, which are registered via `registerConnectionType` and `registerEndpointType`. This interface
 * contains parameters that are common between the two types.
 */
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
/**
 * Definition of an endpoint type.
 */
export interface EndpointTypeDescriptor extends TypeDescriptor {
    connectionsDetachable?: boolean;
    reattachConnections?: boolean;
    maxConnections?: number;
}
/**
 * Definition of a connection type.
 */
export interface ConnectionTypeDescriptor extends TypeDescriptor {
    detachable?: boolean;
    reattach?: boolean;
    endpoints?: [EndpointSpec, EndpointSpec];
}
export interface BehaviouralTypeDescriptor<T = any> extends EndpointTypeDescriptor {
    parameterExtractor?: (el: T, eventTarget: T) => Dictionary<string>;
    redrop?: RedropPolicy;
    extract?: Dictionary<string>;
    uniqueEndpoint?: boolean;
    /**
     * Optional function to call if the user begins a new connection drag when the associated element is full.
     * @param value
     * @param event
     */
    onMaxConnections?: (value: any, event?: any) => any;
    edgeType?: string;
    portId?: string;
    /**
     * Defaults to true. If false, the user will not be permitted to drag a connection from the current node to itself.
     */
    allowLoopback?: boolean;
    rank?: number;
    /**
     * Optional selector identifying the ancestor of the event target that could be the element to which connections
     * are added. By default this is the internal attribute jsPlumb uses to mark managed elements (data-jtk-managed)
     */
    parentSelector?: string;
}
export interface SourceOrTargetDefinition {
    enabled?: boolean;
    def: BehaviouralTypeDescriptor;
    endpoint?: Endpoint;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
}
export interface SourceDefinition extends SourceOrTargetDefinition {
}
export interface TargetDefinition extends SourceOrTargetDefinition {
}
export interface UpdateOffsetOptions {
    timestamp?: string;
    recalc?: boolean;
    elId?: string;
}

import { AnchorSpec } from "../factory/anchor-factory";
import { Anchor } from "../anchor/anchor";
import { PaintStyle } from "../styles";
import { OverlaySpec } from "../overlay/overlay";
import { ConnectorSpec } from "../connector/abstract-connector";
import { Connection } from "../connector/connection-impl";
import { EndpointRepresentation } from './endpoints';
import { DeleteConnectionOptions, JsPlumbInstance } from '../core';
import { OverlayCapableComponent } from '../component/overlay-capable-component';
export declare type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;
export declare type UserDefinedEndpointId = string;
export declare type EndpointParams = any;
export declare type FullEndpointSpec = {
    type: EndpointId;
    options: EndpointParams;
};
export declare type EndpointSpec = EndpointId | FullEndpointSpec;
export interface EndpointStyle extends PaintStyle, Record<string, any> {
}
export interface InternalEndpointOptions<E> extends EndpointOptions<E> {
    isTemporarySource?: boolean;
    elementId?: string;
    _transient?: boolean;
    type?: string;
    id?: string;
    preparedAnchor?: Anchor;
    connections?: Array<Connection>;
    element?: E;
    existingEndpoint?: EndpointRepresentation<E>;
}
export interface EndpointOptions<E = any> {
    parameters?: Record<string, any>;
    scope?: string;
    cssClass?: string;
    data?: any;
    hoverClass?: string;
    /**
     * Optional definition for both the source and target anchors for any connection created with this endpoint as its source.
     * If you do not supply this, the default `anchors` definition for the jsPlumb instance will be used
     */
    anchor?: AnchorSpec;
    /**
     * Optional definition for the source and target anchors for any connection created with this endpoint as its source.
     * If you do not supply this, the default `anchors` definition for the jsPlumb instance will be used
     */
    anchors?: [AnchorSpec, AnchorSpec];
    /**
     * Optional endpoint definition. If you do not supply this, the default endpoint definition for the jsPlumb instance will be used
     */
    endpoint?: EndpointSpec;
    /**
     * Whether or not the endpoint is initially enabled. Defaults to true.
     */
    enabled?: boolean;
    /**
     * Optional paint style to assign to the endpoint
     */
    paintStyle?: PaintStyle;
    /**
     * Optional paint style to assign, on hover, to the endpoint.
     */
    hoverPaintStyle?: PaintStyle;
    /**
     * Maximum number of connections this endpoint supports. Defaults to 1. Use a value of -1 to indicate there is no limit.
     */
    maxConnections?: number;
    /**
     * Optional paint style to assign to a connection that is created with this endpoint as its source.
     */
    connectorStyle?: PaintStyle;
    /**
     * Optional paint style to assign, on hover, to a connection that is created with this endpoint as its source.
     */
    connectorHoverStyle?: PaintStyle;
    /**
     * Optional connector definition for connections that are created with this endpoint as their source.
     */
    connector?: ConnectorSpec;
    /**
     * Optional list of overlays to add to a connection that is created with this endpoint as its source.
     */
    connectorOverlays?: Array<OverlaySpec>;
    /**
     * Optional class to assign to connections that have this endpoint as their source.
     */
    connectorClass?: string;
    /**
     * Optional class to assign, on mouse hover,  to connections that have this endpoint as their source.
     */
    connectorHoverClass?: string;
    /**
     * Whether or not connections that have this endpoint as their source are configured to be detachable with the mouse. Defaults to true.
     */
    connectionsDetachable?: boolean;
    /**
     * Whether or not this Endpoint acts as a source for connections dragged with the mouse. Defaults to false.
     */
    isSource?: boolean;
    /**
     * Whether or not this Endpoint acts as a target for connections dragged with the mouse. Defaults to false.
     */
    isTarget?: boolean;
    /**
     * Optional 'type' for connections that have this endpoint as their source.
     */
    connectionType?: string;
    /**
     * Whether or not to set `reattach:true` on connections that have this endpoint as their source. Defaults to false.
     */
    reattachConnections?: boolean;
    /**
     * Optional "port id" for this endpoint - a logical mapping of the endpoint to some name.
     */
    portId?: string;
    /**
     * Optional user-supplied ID for this endpoint.
     */
    uuid?: string;
    /**
     * Whether or not connections can be dragged from the endpoint when it is full. Since no new connection could be dragged from an endpoint that is
     * full, in a practical sense this means whether or not existing connections can be dragged off an endpoint that is full. Defaults to true.
     */
    dragAllowedWhenFull?: boolean;
    /**
     * Optional callback to fire when the endpoint transitions to the state that it is now full.
     * @param value
     * @param event
     */
    onMaxConnections?: (value: any, event?: any) => any;
    /**
     * Optional cost to set for connections that have this endpoint as their source. Defaults to 1.
     */
    connectionCost?: number;
    /**
     * Whether or not connections that have this endpoint as their source are considered "directed".
     */
    connectionsDirected?: boolean;
    /**
     * Whether or not to delete the Endpoint if it transitions to the state that it has no connections. Defaults to false. Note that this only
     * applies if the endpoint previously had one or more connections and now has none: a newly created endpoint with this flag set is not
     * immediately deleted.
     */
    deleteOnEmpty?: boolean;
}
export declare class Endpoint<E = any> extends OverlayCapableComponent {
    instance: JsPlumbInstance;
    getIdPrefix(): string;
    getTypeDescriptor(): string;
    getXY(): {
        x: number;
        y: number;
    };
    connections: Array<Connection<E>>;
    anchor: Anchor;
    endpoint: EndpointRepresentation<any>;
    element: E;
    elementId: string;
    dragAllowedWhenFull: boolean;
    timestamp: string;
    portId: string;
    maxConnections: number;
    proxiedBy: Endpoint<E>;
    connectorClass: string;
    connectorHoverClass: string;
    finalEndpoint: Endpoint<E>;
    enabled: boolean;
    isSource: boolean;
    isTarget: boolean;
    isTemporarySource: boolean;
    connectionCost: number;
    connectionsDirected: boolean;
    connectionsDetachable: boolean;
    reattachConnections: boolean;
    currentAnchorClass: string;
    referenceEndpoint: Endpoint<E>;
    connectionType: string;
    connector: ConnectorSpec;
    connectorOverlays: Array<OverlaySpec>;
    connectorStyle: PaintStyle;
    connectorHoverStyle: PaintStyle;
    deleteOnEmpty: boolean;
    private readonly uuid;
    scope: string;
    defaultLabelLocation: [number, number];
    getDefaultOverlayKey(): string;
    constructor(instance: JsPlumbInstance, params: InternalEndpointOptions<E>);
    private _updateAnchorClass;
    private prepareAnchor;
    private setPreparedAnchor;
    setAnchor(anchorParams: AnchorSpec | Array<AnchorSpec>): Endpoint;
    addConnection(conn: Connection): void;
    /**
     * Detaches this Endpoint from the given Connection.  If `deleteOnEmpty` is set to true and there are no
     * Connections after this one is detached, the Endpoint is deleted.
     * @param connection Connection from which to detach.
     * @param idx Optional, used internally to identify if this is the source (0) or target endpoint (1). Sometimes we already know this when we call this method.
     * @param transientDetach For internal use only.
     */
    detachFromConnection(connection: Connection, idx?: number, transientDetach?: boolean): void;
    /**
     * Delete every connection in the instance.
     * @param params
     */
    deleteEveryConnection(params?: DeleteConnectionOptions): void;
    /**
     * Removes all connections from this endpoint to the given other endpoint.
     * @param otherEndpoint
     */
    detachFrom(otherEndpoint: Endpoint): Endpoint;
    setVisible(v: boolean, doNotChangeConnections?: boolean, doNotNotifyOtherEndpoint?: boolean): void;
    applyType(t: any, typeMap: any): void;
    destroy(force?: boolean): void;
    isFull(): boolean;
    isFloating(): boolean;
    /**
     * Test if this Endpoint is connected to the given Endpoint.
     * @param otherEndpoint
     */
    isConnectedTo(otherEndpoint: Endpoint): boolean;
    setDragAllowedWhenFull(allowed: boolean): void;
    equals(endpoint: Endpoint): boolean;
    getUuid(): string;
    connectorSelector(): Connection;
    private prepareEndpoint;
    setEndpoint<C>(ep: EndpointSpec | EndpointRepresentation<C>): void;
    private setPreparedEndpoint;
    addClass(clazz: string, dontUpdateOverlays?: boolean): void;
    removeClass(clazz: string, dontUpdateOverlays?: boolean): void;
}

import { Connection } from "../connector/connection-impl";
import { EndpointRepresentation } from './endpoints';
import { DeleteConnectionOptions, JsPlumbInstance } from '../core';
import { Component } from "../component/component";
import { InternalEndpointOptions } from "./endpoint-options";
import { LightweightAnchor } from '../factory/anchor-record-factory';
import { OverlaySpec } from "../../common/overlay";
import { AnchorSpec } from "../../common/anchor";
import { EndpointSpec } from "../../common/endpoint";
import { PaintStyle } from "../../common/paint-style";
import { ConnectorSpec } from "../../common/connector";
export declare class Endpoint<E = any> extends Component {
    instance: JsPlumbInstance;
    getIdPrefix(): string;
    getTypeDescriptor(): string;
    getXY(): {
        x: number;
        y: number;
    };
    connections: Array<Connection<E>>;
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
    edgeType: string;
    connector: ConnectorSpec;
    connectorOverlays: Array<OverlaySpec>;
    connectorStyle: PaintStyle;
    connectorHoverStyle: PaintStyle;
    deleteOnEmpty: boolean;
    uuid: string;
    scope: string;
    _anchor: LightweightAnchor;
    defaultLabelLocation: [number, number];
    getDefaultOverlayKey(): string;
    constructor(instance: JsPlumbInstance, params: InternalEndpointOptions<E>);
    private _updateAnchorClass;
    private setPreparedAnchor;
    /**
     * Called by the router when a dynamic anchor has changed its current location.
     * @param currentAnchor
     */
    _anchorLocationChanged(currentAnchor: LightweightAnchor): void;
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
    destroy(): void;
    isFull(): boolean;
    isFloating(): boolean;
    /**
     * Test if this Endpoint is connected to the given Endpoint.
     * @param otherEndpoint
     */
    isConnectedTo(otherEndpoint: Endpoint): boolean;
    setDragAllowedWhenFull(allowed: boolean): void;
    getUuid(): string;
    connectorSelector(): Connection;
    private prepareEndpoint;
    setEndpoint<C>(ep: EndpointSpec | EndpointRepresentation<C>): void;
    private setPreparedEndpoint;
    addClass(clazz: string, cascade?: boolean): void;
    removeClass(clazz: string, cascade?: boolean): void;
}
//# sourceMappingURL=endpoint.d.ts.map
import { AnchorSpec } from "../factory/anchor-factory";
import { PaintStyle } from "../styles";
import { OverlaySpec } from "../overlay/overlay";
import { ConnectorSpec } from "../connector/abstract-connector";
import { Connection } from "../connector/connection-impl";
import { EndpointRepresentation } from './endpoints';
import { DeleteConnectionOptions, JsPlumbInstance } from '../core';
import { OverlayCapableComponent } from '../component/overlay-capable-component';
import { InternalEndpointOptions } from "@jsplumb/core";
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
export declare class Endpoint<E = any> extends OverlayCapableComponent {
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
    defaultLabelLocation: [number, number];
    getDefaultOverlayKey(): string;
    constructor(instance: JsPlumbInstance, params: InternalEndpointOptions<E>);
    private _updateAnchorClass;
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
    getUuid(): string;
    connectorSelector(): Connection;
    private prepareEndpoint;
    setEndpoint<C>(ep: EndpointSpec | EndpointRepresentation<C>): void;
    private setPreparedEndpoint;
    addClass(clazz: string, dontUpdateOverlays?: boolean): void;
    removeClass(clazz: string, dontUpdateOverlays?: boolean): void;
}

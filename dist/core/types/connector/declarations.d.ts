import { Merge } from "@jsplumb/util";
import { Endpoint } from '../endpoint/endpoint';
import { Component } from "../component/component";
import { ConnectorBase } from "./abstract-connector";
import { ConnectParams } from '../params';
import { EndpointSpec, PaintStyle } from "@jsplumb/common";
/**
 * Definition of a connection between two elements.
 */
export interface Connection<E = any> extends Component {
    connector: ConnectorBase;
    defaultLabelLocation: number;
    scope: string;
    deleted: boolean;
    typeId: string;
    idPrefix: string;
    defaultOverlayKey: string;
    previousConnection: Connection<E>;
    /**
     * The id of the source of the connection
     * @public
     */
    sourceId: string;
    /**
     * The id of the target of the connection
     * @public
     */
    targetId: string;
    /**
     * The element that is the source of the connection
     * @public
     */
    source: E;
    /**
     * The element that is the target of the connection
     * @public
     */
    target: E;
    /**
     * Whether or not this connection is detachable
     * @public
     */
    detachable: boolean;
    /**
     * Whether or not this connection should be reattached if it were detached via the mouse
     * @public
     */
    reattach: boolean;
    /**
     * UUIDs of the endpoints. If this is not specifically provided in the constructor of the connection it will
     * be null.
     * @public
     */
    readonly uuids: [string, string];
    /**
     * Connection's cost.
     * @public
     */
    cost: number;
    /**
     * Whether or not the connection is directed.
     * @public
     */
    directed: boolean;
    /**
     * Source and target endpoints.
     * @public
     */
    endpoints: [Endpoint, Endpoint];
    endpointStyles: [PaintStyle, PaintStyle];
    readonly endpointSpec: EndpointSpec;
    readonly endpointsSpec: [EndpointSpec, EndpointSpec];
    endpointStyle: PaintStyle;
    endpointHoverStyle: PaintStyle;
    readonly endpointHoverStyles: [PaintStyle, PaintStyle];
    id: string;
    lastPaintedAt: string;
    paintStyleInUse: PaintStyle;
    /**
     * @internal
     */
    suspendedEndpoint: Endpoint;
    /**
     * @internal
     */
    suspendedIndex: number;
    /**
     * @internal
     */
    suspendedElement: E;
    /**
     * @internal
     */
    suspendedElementId: string;
    /**
     * @internal
     */
    suspendedElementType: string;
    /**
     * @internal
     */
    _forceReattach: boolean;
    /**
     * @internal
     */
    _forceDetach: boolean;
    /**
     * List of current proxies for this connection. Used when collapsing groups and when dealing with scrolling lists.
     * @internal
     */
    proxies: Array<{
        ep: Endpoint;
        originalEp: Endpoint;
    }>;
    /**
     * @internal
     */
    pending: boolean;
}
/**
 * @internal
 */
export declare type ConnectionOptions<E = any> = Merge<ConnectParams<E>, {
    source?: E;
    target?: E;
    sourceEndpoint?: Endpoint;
    targetEndpoint?: Endpoint;
    previousConnection?: Connection;
    geometry?: any;
}>;
export declare const TYPE_ID_CONNECTION = "_jsplumb_connection";
/**
 * Prefix to use on the ID for connections.
 * @internal
 */
export declare const ID_PREFIX_CONNECTION = "_jsPlumb_c";
export declare const TYPE_DESCRIPTOR_CONNECTION = "connection";
export declare const DEFAULT_LABEL_LOCATION_CONNECTION = 0.5;
//# sourceMappingURL=declarations.d.ts.map
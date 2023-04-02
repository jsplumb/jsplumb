import { JsPlumbInstance } from "../core";
import { ConnectParams } from '../params';
import { ConnectionTypeDescriptor } from "../type-descriptors";
import { AbstractConnector } from "./abstract-connector";
import { Endpoint } from "../endpoint/endpoint";
import { Component } from "../component/component";
import { Merge } from "../../util/util";
import { AnchorSpec } from "../../common/anchor";
import { ConnectorSpec } from "../../common/connector";
import { EndpointSpec } from "../../common/endpoint";
import { PaintStyle } from "../../common/paint-style";
/**
 * @internal
 */
export declare type ConnectionOptions<E = any> = Merge<ConnectParams<E>, {
    source?: E;
    target?: E;
    sourceEndpoint?: Endpoint;
    targetEndpoint?: Endpoint;
    previousConnection?: Connection<E>;
    geometry?: any;
}>;
/**
 * @public
 */
export declare class Connection<E = any> extends Component {
    instance: JsPlumbInstance;
    connector: AbstractConnector;
    defaultLabelLocation: number;
    scope: string;
    typeId: string;
    getIdPrefix(): string;
    getDefaultOverlayKey(): string;
    getXY(): {
        x: number;
        y: number;
    };
    previousConnection: Connection;
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
    endpoints: [Endpoint<E>, Endpoint<E>];
    endpointStyles: [PaintStyle, PaintStyle];
    readonly endpointSpec: EndpointSpec;
    readonly endpointsSpec: [EndpointSpec, EndpointSpec];
    endpointStyle: PaintStyle;
    endpointHoverStyle: PaintStyle;
    readonly endpointHoverStyles: [PaintStyle, PaintStyle];
    /**
     * @internal
     */
    suspendedEndpoint: Endpoint<E>;
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
        ep: Endpoint<E>;
        originalEp: Endpoint<E>;
    }>;
    /**
     * @internal
     */
    pending: boolean;
    /**
     * Connections should never be constructed directly by users of the library.
     * @internal
     * @param instance
     * @param params
     */
    constructor(instance: JsPlumbInstance, params: ConnectionOptions<E>);
    makeEndpoint(isSource: boolean, el: any, elId: string, anchor?: AnchorSpec, ep?: Endpoint): Endpoint;
    static type: string;
    getTypeDescriptor(): string;
    isDetachable(ep?: Endpoint): boolean;
    setDetachable(detachable: boolean): void;
    isReattach(): boolean;
    setReattach(reattach: boolean): void;
    applyType(t: ConnectionTypeDescriptor, typeMap: any): void;
    /**
     * Adds the given class to the UI elements being used to represent this connection's connector, and optionally to
     * the UI elements representing the connection's endpoints.
     * @param c class to add
     * @param cascade If true, also add the class to the connection's endpoints.
     * @public
     */
    addClass(c: string, cascade?: boolean): void;
    /**
     * Removes the given class from the UI elements being used to represent this connection's connector, and optionally from
     * the UI elements representing the connection's endpoints.
     * @param c class to remove
     * @param cascade If true, also remove the class from the connection's endpoints.
     * @public
     */
    removeClass(c: string, cascade?: boolean): void;
    /**
     * Sets the visible state of the connection.
     * @param v
     * @public
     */
    setVisible(v: boolean): void;
    /**
     * @internal
     */
    destroy(): void;
    getUuids(): [string, string];
    /**
     * @internal
     */
    prepareConnector(connectorSpec: ConnectorSpec, typeId?: string): AbstractConnector;
    /**
     * @internal
     */
    setPreparedConnector(connector: AbstractConnector, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
    /**
     * @internal
     * @param connectorSpec
     * @param doNotRepaint
     * @param doNotChangeListenerComponent
     * @param typeId
     */
    _setConnector(connectorSpec: ConnectorSpec, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
    /**
     * Replace the Endpoint at the given index with a new Endpoint.  This is used by the Toolkit edition, if changes to an edge type
     * cause a change in Endpoint.
     * @param idx 0 for source, 1 for target
     * @param endpointDef Spec for the new Endpoint.
     * @public
     */
    replaceEndpoint(idx: number, endpointDef: EndpointSpec): void;
}
//# sourceMappingURL=connection-impl.d.ts.map
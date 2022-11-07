import { ConnectorSpec } from '../connector/declarations';
import { ConnectorBase } from "../connector/abstract-connector";
import { Endpoint, EndpointSpec } from '../endpoint/endpoint';
import { AnchorSpec } from "../anchor";
import { ConnectionTypeDescriptor } from "../type-descriptors";
import { JsPlumbUICore } from "../core";
import { Connection, ConnectionOptions } from './declarations';
/**
 * @internal
 */
export declare const TYPE_ITEM_ANCHORS = "anchors";
/**
 * @internal
 */
export declare const TYPE_ITEM_CONNECTOR = "connector";
/**
 * Sets a connector that has been prepared on a Connection, removing any previous connector, and caching by type if necessary.
 * @param connection
 * @param connector
 * @param doNotRepaint
 * @param doNotChangeListenerComponent
 * @param typeId
 * @internal
 */
export declare function setPreparedConnector(connection: Connection, connector: ConnectorBase, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
/**
 * Manager for operations on connections.
 * @internal
 */
export declare const Connections: {
    isReattach(connection: Connection, alsoCheckForced: boolean): boolean;
    isDetachable(connection: Connection, ep?: Endpoint): boolean;
    setDetachable(connection: Connection, detachable: boolean): void;
    setReattach(connection: Connection, reattach: boolean): void;
    prepareConnector(connection: Connection, connectorSpec: ConnectorSpec, typeId?: string): ConnectorBase;
    /**
     * @internal
     * @param connectorSpec
     * @param doNotRepaint
     * @param doNotChangeListenerComponent
     * @param typeId
     */
    setConnector(connection: Connection, connectorSpec: ConnectorSpec, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
    getUuids(connection: Connection): [string, string];
    /**
     * Replace the Endpoint at the given index with a new Endpoint.  This is used by the Toolkit edition, if changes to an edge type
     * cause a change in Endpoint.
     * @param idx 0 for source, 1 for target
     * @param endpointDef Spec for the new Endpoint.
     * @public
     */
    replaceEndpoint(connection: Connection, idx: number, endpointDef: EndpointSpec): void;
    /**
     * @internal
     * @param connection
     * @param isSource
     * @param el
     * @param elId
     * @param anchor
     * @param ep
     */
    makeEndpoint(connection: Connection, isSource: boolean, el: any, elId: string, anchor?: AnchorSpec, ep?: Endpoint): Endpoint;
    /**
     * @internal
     * @param connection
     * @param t
     * @param typeMap
     */
    applyType(connection: Connection, t: ConnectionTypeDescriptor, typeMap: any): void;
    destroy(connection: Connection): void;
    setVisible(connection: Connection, v: boolean): void;
    /**
     * Adds the given class to the UI elements being used to represent this connection's connector, and optionally to
     * the UI elements representing the connection's endpoints.
     * @param connection Connection to add class to
     * @param c class to add
     * @param cascade If true, also add the class to the connection's endpoints.
     * @public
     */
    addClass(connection: Connection, c: string, cascade?: boolean): void;
    /**
     * Removes the given class from the UI elements being used to represent this connection's connector, and optionally from
     * the UI elements representing the connection's endpoints.
     * @param connection Connection to remove class from
     * @param c class to remove
     * @param cascade If true, also remove the class from the connection's endpoints.
     * @public
     */
    removeClass(connection: Connection, c: string, cascade?: boolean): void;
    isConnection(component: any): component is Connection<any>;
    /**
     * @internal
     * @param instance
     * @param params
     */
    create(instance: JsPlumbUICore, params: ConnectionOptions): Connection;
};
//# sourceMappingURL=connections.d.ts.map
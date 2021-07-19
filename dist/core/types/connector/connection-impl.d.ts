import { JsPlumbInstance } from "../core";
import { ConnectParams } from '../params';
import { ConnectionTypeDescriptor } from "../type-descriptors";
import { AbstractConnector } from "./abstract-connector";
import { Endpoint } from "../endpoint/endpoint";
import { Component } from "../component/component";
import { Merge } from "@jsplumb/util";
import { ConnectorSpec, AnchorSpec, EndpointSpec, PaintStyle } from "@jsplumb/common";
export declare type ConnectionOptions<E = any> = Merge<ConnectParams<E>, {
    source?: E;
    target?: E;
    sourceEndpoint?: Endpoint;
    targetEndpoint?: Endpoint;
    previousConnection?: Connection<E>;
    geometry?: any;
}>;
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
    sourceId: string;
    targetId: string;
    source: E;
    target: E;
    detachable: boolean;
    reattach: boolean;
    uuids: [string, string];
    cost: number;
    directed: boolean;
    endpoints: [Endpoint<E>, Endpoint<E>];
    endpointStyles: [PaintStyle, PaintStyle];
    readonly endpointSpec: EndpointSpec;
    readonly endpointsSpec: [EndpointSpec, EndpointSpec];
    endpointStyle: PaintStyle;
    endpointHoverStyle: PaintStyle;
    readonly endpointHoverStyles: [PaintStyle, PaintStyle];
    suspendedEndpoint: Endpoint<E>;
    suspendedIndex: number;
    suspendedElement: E;
    suspendedElementId: string;
    suspendedElementType: string;
    _forceReattach: boolean;
    _forceDetach: boolean;
    proxies: Array<{
        ep: Endpoint<E>;
        originalEp: Endpoint<E>;
    }>;
    pending: boolean;
    constructor(instance: JsPlumbInstance, params: ConnectionOptions<E>);
    makeEndpoint(isSource: boolean, el: any, elId: string, anchor?: AnchorSpec, ep?: Endpoint): Endpoint;
    static type: string;
    getTypeDescriptor(): string;
    isDetachable(ep?: Endpoint): boolean;
    setDetachable(detachable: boolean): void;
    isReattach(): boolean;
    setReattach(reattach: boolean): void;
    applyType(t: ConnectionTypeDescriptor, typeMap: any): void;
    addClass(c: string, cascade?: boolean): void;
    removeClass(c: string, cascade?: boolean): void;
    setVisible(v: boolean): void;
    destroy(): void;
    getUuids(): [string, string];
    prepareConnector(connectorSpec: ConnectorSpec, typeId?: string): AbstractConnector;
    setPreparedConnector(connector: AbstractConnector, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
    setConnector(connectorSpec: ConnectorSpec, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
    /**
     * Replace the Endpoint at the given index with a new Endpoint.  This is used by the Toolkit edition, if changes to an edge type
     * cause a change in Endpoint.
     * @param idx 0 for source, 1 for target
     * @param endpointDef Spec for the new Endpoint.
     */
    replaceEndpoint(idx: number, endpointDef: EndpointSpec): void;
}

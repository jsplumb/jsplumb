import { JsPlumbInstance } from "../core";
import { ConnectionTypeDescriptor, ConnectParams } from '../common';
import { AbstractConnector } from "./abstract-connector";
import { Endpoint } from "../endpoint/endpoint";
import { PaintStyle } from "../styles";
import { OverlayCapableComponent } from "../component/overlay-capable-component";
import { Merge, Omit } from "../util";
import { AnchorSpec } from "../factory/anchor-factory";
import { ConnectorSpec } from "./abstract-connector";
import { EndpointSpec } from "../endpoint/endpoint";
declare type OnlyPluralsConnectParams<E> = Omit<ConnectParams<E>, 'anchor' | 'endpointStyle' | 'endpoint' | 'endpointHoverStyle'>;
export declare type ConnectionOptions<E = any> = Merge<OnlyPluralsConnectParams<E>, {
    source?: E;
    target?: E;
    sourceEndpoint?: Endpoint;
    targetEndpoint?: Endpoint;
    previousConnection?: Connection<E>;
}>;
export declare class Connection<E = any> extends OverlayCapableComponent {
    instance: JsPlumbInstance;
    id: string;
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
    readonly endpointsSpec: [EndpointSpec, EndpointSpec];
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
    getTypeDescriptor(): string;
    isDetachable(ep?: Endpoint): boolean;
    setDetachable(detachable: boolean): void;
    isReattach(): boolean;
    setReattach(reattach: boolean): void;
    applyType(t: ConnectionTypeDescriptor, typeMap: any): void;
    addClass(c: string, informEndpoints?: boolean): void;
    removeClass(c: string, informEndpoints?: boolean): void;
    setVisible(v: boolean): void;
    destroy(force?: boolean): void;
    getUuids(): [string, string];
    getCost(): number;
    setCost(c: number): void;
    isDirected(): boolean;
    getConnector(): AbstractConnector;
    makeConnector(name: string, args: any): AbstractConnector;
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
export {};

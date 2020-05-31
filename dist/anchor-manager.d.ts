import { Endpoint } from "./endpoint/endpoint-impl";
import { Dictionary, jsPlumbInstance, Offset } from "./core";
import { Connection } from "./connector/connection-impl";
import { ComputedAnchorPosition, Face } from "./factory/anchor-factory";
import { ContinuousAnchor } from "./anchor/continuous-anchor";
export interface AnchorManagerOptions {
}
export declare class ContinuousAnchorFactory<E> {
    private manager;
    private continuousAnchorLocations;
    constructor(manager: AnchorManager<E>);
    clear(endpointId: string): void;
    set(endpointId: string, pos: ComputedAnchorPosition): void;
    get(instance: jsPlumbInstance<E>, params?: any): ContinuousAnchor;
}
export declare class AnchorManager<E> {
    private instance;
    _amEndpoints: Dictionary<Array<Endpoint<E>>>;
    continuousAnchorLocations: any;
    continuousAnchorOrientations: any;
    private anchorLists;
    private floatingConnections;
    continuousAnchorFactory: ContinuousAnchorFactory<E>;
    constructor(instance: jsPlumbInstance<E>, params?: AnchorManagerOptions);
    reset(): void;
    private placeAnchors;
    addFloatingConnection(key: string, conn: Connection<E>): void;
    removeFloatingConnection(key: string): void;
    newConnection(conn: Connection<E>): void;
    removeEndpointFromAnchorLists(endpoint: any): void;
    connectionDetached(connInfo: any, doNotRedraw?: boolean): void;
    add(endpoint: any, elementId: string): void;
    changeId(oldId: string, newId: string): void;
    deleteEndpoint(endpoint: Endpoint<E>): void;
    clearFor(elementId: string): void;
    private _updateAnchorList;
    rehomeEndpoint(ep: Endpoint<E>, currentId: string, element: E): void;
    redraw(elementId: string, ui?: any, timestamp?: string, offsetToUI?: Offset, doNotRecalcEndpoint?: boolean): void;
    calculateOrientation(sourceId: string, targetId: string, sd: any, td: any, sourceAnchor: any, targetAnchor: any, connection?: Connection<E>): {
        orientation?: string;
        a: [Face, Face];
        theta?: number;
        theta2?: number;
    };
}

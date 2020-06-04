import { Endpoint } from "./endpoint/endpoint-impl";
import { Dictionary, ExtendedOffset, jsPlumbInstance, Offset } from "./core";
import { Connection } from "./connector/connection-impl";
import { ComputedAnchorPosition, Face, Orientation } from "./factory/anchor-factory";
import { ContinuousAnchor, ContinuousAnchorOptions } from "./anchor/continuous-anchor";
export declare class ContinuousAnchorFactory<E> {
    private continuousAnchorLocations;
    clear(endpointId: string): void;
    set(endpointId: string, pos: ComputedAnchorPosition): void;
    get(instance: jsPlumbInstance<E>, params?: ContinuousAnchorOptions): ContinuousAnchor;
}
interface OrientationResult {
    orientation?: string;
    a: [Face, Face];
    theta?: number;
    theta2?: number;
}
export declare class AnchorManager<E> {
    private instance;
    _amEndpoints: Dictionary<Array<Endpoint<E>>>;
    continuousAnchorLocations: Dictionary<[number, number, number, number]>;
    continuousAnchorOrientations: Dictionary<Orientation>;
    private anchorLists;
    private floatingConnections;
    continuousAnchorFactory: ContinuousAnchorFactory<E>;
    constructor(instance: jsPlumbInstance<E>);
    reset(): void;
    private placeAnchors;
    addFloatingConnection(key: string, conn: Connection<E>): void;
    removeFloatingConnection(key: string): void;
    newConnection(conn: Connection<E>): void;
    removeEndpointFromAnchorLists(endpoint: Endpoint<E>): void;
    connectionDetached(connection: Connection<E>): void;
    add(endpoint: Endpoint<E>, elementId: string): void;
    changeId(oldId: string, newId: string): void;
    deleteEndpoint(endpoint: Endpoint<E>): void;
    clearFor(elementId: string): void;
    private _updateAnchorList;
    rehomeEndpoint(ep: Endpoint<E>, currentId: string, element: E): void;
    redraw(elementId: string, ui?: Offset, timestamp?: string, offsetToUI?: Offset): void;
    calculateOrientation(sourceId: string, targetId: string, sd: ExtendedOffset, td: ExtendedOffset, sourceAnchor: ContinuousAnchor, targetAnchor: ContinuousAnchor): OrientationResult;
}
export {};

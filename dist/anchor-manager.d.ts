import { Endpoint } from "./endpoint/endpoint-impl";
import { Dictionary, ExtendedOffset, jsPlumbInstance, Offset } from "./core";
import { Connection } from "./connector/connection-impl";
import { Face, Orientation } from "./factory/anchor-factory";
import { ContinuousAnchor, ContinuousAnchorOptions } from "./anchor/continuous-anchor";
export declare type AnchorPlacement = [number, number, number, number];
export declare type ContinuousAnchorPlacement = [number, number, number, number, Connection, Connection];
export declare type AnchorFace = "top" | "right" | "bottom" | "left";
export declare class ContinuousAnchorFactory {
    private continuousAnchorLocations;
    clear(endpointId: string): void;
    set(endpointId: string, pos: AnchorPlacement): void;
    get(instance: jsPlumbInstance, params?: ContinuousAnchorOptions): ContinuousAnchor;
}
interface OrientationResult {
    orientation?: string;
    a: [Face, Face];
    theta?: number;
    theta2?: number;
}
export declare class AnchorManager {
    private instance;
    _amEndpoints: Dictionary<Array<Endpoint>>;
    continuousAnchorLocations: Dictionary<[number, number, number, number]>;
    continuousAnchorOrientations: Dictionary<Orientation>;
    private anchorLists;
    private floatingConnections;
    continuousAnchorFactory: ContinuousAnchorFactory;
    constructor(instance: jsPlumbInstance);
    reset(): void;
    private placeAnchors;
    addFloatingConnection(key: string, conn: Connection): void;
    removeFloatingConnection(key: string): void;
    newConnection(conn: Connection): void;
    removeEndpointFromAnchorLists(endpoint: Endpoint): void;
    connectionDetached(connection: Connection): void;
    addEndpoint(endpoint: Endpoint, elementId: string): void;
    changeId(oldId: string, newId: string): void;
    deleteEndpoint(endpoint: Endpoint): void;
    clearFor(elementId: string): void;
    private _updateAnchorList;
    rehomeEndpoint(ep: Endpoint, currentId: string, element: any): void;
    redraw(elementId: string, ui?: Offset, timestamp?: string, offsetToUI?: Offset): void;
    calculateOrientation(sourceId: string, targetId: string, sd: ExtendedOffset, td: ExtendedOffset, sourceAnchor: ContinuousAnchor, targetAnchor: ContinuousAnchor): OrientationResult;
}
export {};

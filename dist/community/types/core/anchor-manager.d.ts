import { Endpoint } from "./endpoint/endpoint-impl";
import { Dictionary, Offset } from "./common";
import { JsPlumbInstance } from "./core";
import { Connection } from "./connector/connection-impl";
import { Face, Orientation } from "./factory/anchor-factory";
import { ContinuousAnchor } from "./anchor/continuous-anchor";
import { ViewportElement } from "./viewport";
export declare type AnchorPlacement = [number, number, number, number];
export declare type ContinuousAnchorPlacement = [number, number, number, number, Connection, Connection];
export interface RedrawResult {
    c: Set<Connection>;
    e: Set<Endpoint>;
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
    constructor(instance: JsPlumbInstance);
    reset(): void;
    private placeAnchors;
    clearContinuousAnchorPlacement(endpointId: string): void;
    newConnection(conn: Connection): void;
    removeEndpointFromAnchorLists(endpoint: Endpoint): void;
    connectionDetached(connection: Connection): void;
    addEndpoint(endpoint: Endpoint, elementId: string): void;
    deleteEndpoint(endpoint: Endpoint): void;
    clearFor(elementId: string): void;
    private _updateAnchorList;
    rehomeEndpoint(ep: Endpoint, currentId: string, element: any): void;
    redraw(elementId: string, ui?: ViewportElement, timestamp?: string, offsetToUI?: Offset): RedrawResult;
    calculateOrientation(sourceId: string, targetId: string, sd: ViewportElement, td: ViewportElement, sourceAnchor: ContinuousAnchor, targetAnchor: ContinuousAnchor, sourceRotation: number, targetRotation: number): OrientationResult;
}
export {};

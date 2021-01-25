import { Endpoint } from "./endpoint/endpoint-impl";
import { Dictionary, Offset } from "./common";
import { JsPlumbInstance } from "./core";
import { Connection } from "./connector/connection-impl";
import { Orientation } from "./factory/anchor-factory";
import { ViewportElement } from "./viewport";
export declare type AnchorPlacement = [number, number, number, number];
export declare type ContinuousAnchorPlacement = [number, number, number, number, Connection, Connection];
export interface RedrawResult {
    c: Set<Connection>;
    e: Set<Endpoint>;
}
export declare class AnchorManager<T extends {
    E: unknown;
} = any> {
    private instance;
    continuousAnchorLocations: Dictionary<[number, number, number, number]>;
    continuousAnchorOrientations: Dictionary<Orientation>;
    private anchorLists;
    constructor(instance: JsPlumbInstance<T>);
    reset(): void;
    private placeAnchors;
    clearContinuousAnchorPlacement(endpointId: string): void;
    private removeEndpointFromAnchorLists;
    private connectionDetached;
    deleteEndpoint(endpoint: Endpoint): void;
    private _updateAnchorList;
    redraw(elementId: string, ui?: ViewportElement, timestamp?: string, offsetToUI?: Offset): RedrawResult;
    private calculateOrientation;
}

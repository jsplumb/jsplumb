import { Router, RedrawResult } from "./router";
import { JsPlumbInstance } from "../core";
import { Connection } from '../connector/connection-impl';
import { Endpoint } from '../endpoint/endpoint';
import { ViewportElement } from "../viewport";
import { Dictionary, Offset } from "../common";
import { AnchorComputeParams, Orientation } from "../factory/anchor-factory";
export declare class DefaultRouter<T extends {
    E: unknown;
}> implements Router {
    instance: JsPlumbInstance;
    continuousAnchorLocations: Dictionary<[number, number, number, number]>;
    continuousAnchorOrientations: Dictionary<Orientation>;
    private anchorLists;
    constructor(instance: JsPlumbInstance);
    reset(): void;
    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): any;
    getContinuousAnchorLocation(elementId: string): [number, number, number, number];
    getContinuousAnchorOrientation(endpointId: string): [number, number];
    addEndpoint(endpoint: Endpoint, elementId: string): void;
    elementRemoved(id: string): void;
    computePath(connection: Connection, timestamp: string): void;
    private placeAnchors;
    clearContinuousAnchorPlacement(endpointId: string): void;
    private removeEndpointFromAnchorLists;
    private _updateAnchorList;
    redraw(elementId: string, ui?: ViewportElement, timestamp?: string, offsetToUI?: Offset): RedrawResult;
    private calculateOrientation;
}

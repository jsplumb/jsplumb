import { Router, RedrawResult, AnchorPlacement } from "./router";
import { JsPlumbInstance } from "../core";
import { Connection } from '../connector/connection-impl';
import { Endpoint } from '../endpoint/endpoint';
import { Dictionary, PointXY } from "../common";
import { AnchorComputeParams, Orientation } from "../factory/anchor-factory";
import { Anchor } from '../anchor/anchor';
export declare class DefaultRouter<T extends {
    E: unknown;
}> implements Router<T> {
    instance: JsPlumbInstance;
    continuousAnchorLocations: Dictionary<[number, number, number, number]>;
    continuousAnchorOrientations: Dictionary<Orientation>;
    private anchorLists;
    constructor(instance: JsPlumbInstance);
    reset(): void;
    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement;
    computeAnchorLocation(anchor: Anchor, params: AnchorComputeParams): AnchorPlacement;
    private defaultAnchorCompute;
    private dynamicAnchorCompute;
    getEndpointOrientation(endpoint: Endpoint): Orientation;
    getAnchorOrientation(anchor: Anchor, endpoint?: Endpoint): Orientation;
    computePath(connection: Connection, timestamp: string): void;
    private placeAnchors;
    private _removeEndpointFromAnchorLists;
    private _updateAnchorList;
    redraw(elementId: string, timestamp?: string, offsetToUI?: PointXY): RedrawResult;
    private calculateOrientation;
}

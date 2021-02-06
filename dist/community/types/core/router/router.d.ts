import { Connection } from '../connector/connection-impl';
import { Endpoint } from '../endpoint/endpoint';
import { Offset } from '../common';
import { ViewportElement } from "../viewport";
import { Anchor } from "../anchor/anchor";
import { AnchorComputeParams, Orientation } from "../factory/anchor-factory";
export interface RedrawResult {
    c: Set<Connection>;
    e: Set<Endpoint>;
}
export declare type AnchorPlacement = [number, number, number, number];
export declare type ContinuousAnchorPlacement = [number, number, number, number, Connection, Connection];
export interface Router<T extends {
    E: unknown;
}> {
    reset(): void;
    redraw(elementId: string, ui?: ViewportElement<T["E"]>, timestamp?: string, offsetToUI?: Offset): RedrawResult;
    computePath(connection: Connection, timestamp: string): void;
    computeAnchorLocation(anchor: Anchor, params: AnchorComputeParams): AnchorPlacement;
    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement;
    getAnchorOrientation(anchor: Anchor, endpoint?: Endpoint): Orientation;
    getEndpointOrientation(endpoint: Endpoint): Orientation;
}

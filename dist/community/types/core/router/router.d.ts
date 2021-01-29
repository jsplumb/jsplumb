import { Connection } from '../connector/connection-impl';
import { Endpoint } from '../endpoint/endpoint';
import { Offset } from '../common';
import { ViewportElement } from "../viewport";
export interface RedrawResult {
    c: Set<Connection>;
    e: Set<Endpoint>;
}
export declare type AnchorPlacement = [number, number, number, number];
export declare type ContinuousAnchorPlacement = [number, number, number, number, Connection, Connection];
export interface Router {
    reset(): void;
    redraw(elementId: string, ui?: ViewportElement, timestamp?: string, offsetToUI?: Offset): RedrawResult;
    addEndpoint(endpoint: Endpoint, elementId: string): void;
    computePath(connection: Connection, timestamp: string): void;
    elementRemoved(id: string): void;
    clearContinuousAnchorPlacement(elementId: string): void;
    getContinuousAnchorLocation(elementId: string): [number, number, number, number];
    getContinuousAnchorOrientation(endpointId: string): [number, number];
}

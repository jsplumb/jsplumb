import { Router } from "./router";
import { AnchorManager, RedrawResult } from "../anchor-manager";
import { JsPlumbInstance } from "../core";
import { Offset } from '../common';
import { Connection } from '../connector/connection-impl';
import { Endpoint } from '../endpoint/endpoint-impl';
import { ViewportElement } from "../viewport";
export declare class DefaultRouter implements Router {
    instance: JsPlumbInstance;
    readonly anchorManager: AnchorManager;
    constructor(instance: JsPlumbInstance);
    reset(): void;
    redraw(elementId: string, ui?: ViewportElement, timestamp?: string, offsetToUI?: Offset): RedrawResult;
    clearContinuousAnchorPlacement(elementId: string): void;
    getContinuousAnchorLocation(elementId: string): [number, number, number, number];
    getContinuousAnchorOrientation(endpointId: string): [number, number];
    addEndpoint(endpoint: Endpoint, elementId: string): void;
    elementRemoved(id: string): void;
    computePath(connection: Connection, timestamp: string): void;
}

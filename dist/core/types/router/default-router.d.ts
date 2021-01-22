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
    newConnection(conn: Connection): void;
    connectionDetached(connInfo: any): void;
    redraw(elementId: string, ui?: ViewportElement, timestamp?: string, offsetToUI?: Offset): RedrawResult;
    deleteEndpoint(endpoint: Endpoint): void;
    rehomeEndpoint(ep: Endpoint, currentId: string, element: any): void;
    addEndpoint(endpoint: Endpoint, elementId: string): void;
    elementRemoved(id: string): void;
    computePath(connection: Connection, timestamp: string): void;
}

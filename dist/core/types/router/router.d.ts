import { Connection } from '../connector/connection-impl';
import { Endpoint } from '../endpoint/endpoint';
import { PointXY } from '@jsplumb/util';
import { AnchorComputeParams, Face, LightweightContinuousAnchor, Orientation } from "../factory/anchor-record-factory";
import { AnchorPlacement, AnchorSpec } from "@jsplumb/common";
export interface RedrawResult {
    c: Set<Connection>;
    e: Set<Endpoint>;
}
export interface Router<T extends {
    E: unknown;
}, A> {
    reset(): void;
    redraw(elementId: string, timestamp?: string, offsetToUI?: PointXY): RedrawResult;
    computePath(connection: Connection, timestamp: string): void;
    computeAnchorLocation(anchor: A, params: AnchorComputeParams): AnchorPlacement;
    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement;
    getAnchorOrientation(anchor: A, endpoint?: Endpoint): Orientation;
    getEndpointOrientation(endpoint: Endpoint): Orientation;
    setAnchor(endpoint: Endpoint, anchor: A): void;
    prepareAnchor(endpoint: Endpoint, params: AnchorSpec | Array<AnchorSpec>): A;
    setConnectionAnchors(conn: Connection, anchors: [A, A]): void;
    isDynamicAnchor(ep: Endpoint): boolean;
    isFloating(ep: Endpoint): boolean;
    setCurrentFace(a: LightweightContinuousAnchor, face: Face, overrideLock?: boolean): void;
    lock(a: A): void;
    unlock(a: A): void;
    anchorsEqual(a: A, b: A): boolean;
    selectAnchorLocation(a: A, coords: {
        x: number;
        y: number;
    }): boolean;
}

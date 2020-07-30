import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { jsPlumbInstance } from "../core";
import { Connection } from "./connection-impl";
import { AnchorPlacement } from "../anchor-manager";
export interface AbstractBezierOptions {
    showLoopback?: boolean;
    curviness?: number;
    margin?: number;
    proximityLimit?: number;
    orientation?: string;
    loopbackRadius?: number;
}
export declare abstract class AbstractBezierConnector extends AbstractConnector {
    connection: Connection;
    showLoopback: boolean;
    curviness: number;
    margin: number;
    proximityLimit: number;
    orientation: string;
    loopbackRadius: number;
    clockwise: boolean;
    isLoopbackCurrently: boolean;
    geometry: {
        controlPoints: [any, any];
        source: AnchorPlacement;
        target: AnchorPlacement;
    };
    getDefaultStubs(): [number, number];
    constructor(instance: jsPlumbInstance, connection: Connection, params: any);
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
    exportGeometry(): any;
    importGeometry(geometry: any): boolean;
    abstract _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, _w: number, _h: number): void;
}

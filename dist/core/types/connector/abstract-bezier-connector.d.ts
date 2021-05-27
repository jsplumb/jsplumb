import { PointXY } from "@jsplumb/util";
import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { Connection } from '../connector/connection-impl';
import { AnchorPlacement, ConnectorOptions } from "@jsplumb/common";
export interface AbstractBezierOptions extends ConnectorOptions {
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
    constructor(connection: Connection, params: any);
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
    exportGeometry(): any;
    importGeometry(geometry: any): boolean;
    abstract _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: PointXY, tp: PointXY, _w: number, _h: number): void;
}

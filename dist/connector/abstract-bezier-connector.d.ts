import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { jsPlumbInstance } from "../core";
import { ComputedAnchorPosition } from "../factory/anchor-factory";
import { Connection } from "./connection-impl";
export interface AbstractBezierOptions {
    showLoopback?: boolean;
    curviness?: number;
    margin?: number;
    proximityLimit?: number;
    orientation?: string;
    loopbackRadius?: number;
}
export declare abstract class AbstractBezierConnector<E> extends AbstractConnector<E> {
    connection: Connection<E>;
    showLoopback: boolean;
    curviness: number;
    margin: number;
    proximityLimit: number;
    orientation: string;
    loopbackRadius: number;
    clockwise: boolean;
    isLoopbackCurrently: boolean;
    constructor(instance: jsPlumbInstance<E>, connection: Connection<E>, params: any);
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams<E>): void;
    abstract _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams<E>, sp: ComputedAnchorPosition, tp: ComputedAnchorPosition, _w: number, _h: number): void;
}

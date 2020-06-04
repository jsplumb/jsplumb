import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { PaintGeometry, ConnectorComputeParams } from "./abstract-connector";
import { jsPlumbInstance } from "../core";
import { ComputedAnchorPosition } from "../factory/anchor-factory";
import { Connection } from "./connection-impl";
export declare class Bezier extends AbstractBezierConnector {
    connection: Connection;
    type: string;
    majorAnchor: number;
    minorAnchor: number;
    constructor(instance: jsPlumbInstance, connection: Connection, params: AbstractBezierOptions);
    getCurviness(): number;
    private _findControlPoint;
    _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: ComputedAnchorPosition, tp: ComputedAnchorPosition, _w: number, _h: number): void;
}

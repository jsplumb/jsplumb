import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { PaintGeometry, ConnectorComputeParams } from "./abstract-connector";
import { jsPlumbInstance } from "../core";
import { Connection } from "./connection-impl";
import { AnchorPlacement } from "../anchor-manager";
export declare class Bezier extends AbstractBezierConnector {
    connection: Connection;
    type: string;
    majorAnchor: number;
    minorAnchor: number;
    constructor(instance: jsPlumbInstance, connection: Connection, params: AbstractBezierOptions);
    getCurviness(): number;
    protected _findControlPoint(point: any, sourceAnchorPosition: any, targetAnchorPosition: any, soo: any, too: any): any[];
    _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, _w: number, _h: number): void;
}

import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { PaintGeometry, ConnectorComputeParams } from "./abstract-connector";
import { JsPlumbInstance } from "../core";
import { Connection } from "./connection-impl";
import { AnchorPlacement } from "../router/router";
export declare class BezierConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    majorAnchor: number;
    minorAnchor: number;
    constructor(instance: JsPlumbInstance, connection: Connection, params: AbstractBezierOptions);
    getCurviness(): number;
    protected _findControlPoint(point: any, sourceAnchorPosition: any, targetAnchorPosition: any, soo: any, too: any): any[];
    _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, _w: number, _h: number): void;
}

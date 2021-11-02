import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { Connection, PaintGeometry, ConnectorComputeParams } from "@jsplumb/core";
import { AnchorPlacement } from "@jsplumb/common";
import { PointXY } from "@jsplumb/util";
/**
 * Options for the Bezier connector.
 */
export interface BezierOptions extends AbstractBezierOptions {
}
export declare class BezierConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    majorAnchor: number;
    minorAnchor: number;
    constructor(connection: Connection, params: BezierOptions);
    getCurviness(): number;
    protected _findControlPoint(point: PointXY, sourceAnchorPosition: AnchorPlacement, targetAnchorPosition: AnchorPlacement, soo: [number, number], too: [number, number]): PointXY;
    _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, _w: number, _h: number): void;
}
//# sourceMappingURL=bezier-connector.d.ts.map
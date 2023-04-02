/**
 * The bezier connector's internal representation of a path.
 */
import { ConnectorOptions, Geometry } from "../common/connector";
import { PointXY } from "../util/util";
import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "../core/connector/abstract-connector";
import { AnchorPlacement } from "../common/anchor";
import { Connection } from "../core/connector/connection-impl";
export interface BezierConnectorGeometry extends Geometry {
    controlPoints: [
        PointXY,
        PointXY
    ];
    source: AnchorPlacement;
    target: AnchorPlacement;
}
/**
 * Base options interface for StateMachine and Bezier connectors.
 * @public
 */
export interface AbstractBezierOptions extends ConnectorOptions {
    /**
     * Whether or not to show connections whose source and target is the same element.
     */
    showLoopback?: boolean;
    /**
     * A measure of how "curvy" the bezier is. In terms of maths what this translates to is how far from the curve the control points are positioned.
     */
    curviness?: number;
    margin?: number;
    proximityLimit?: number;
    orientation?: string;
    loopbackRadius?: number;
}
/**
 * @internal
 */
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
    geometry: BezierConnectorGeometry;
    getDefaultStubs(): [number, number];
    constructor(connection: Connection, params: any);
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
    exportGeometry(): BezierConnectorGeometry;
    transformGeometry(g: BezierConnectorGeometry, dx: number, dy: number): BezierConnectorGeometry;
    importGeometry(geometry: BezierConnectorGeometry): boolean;
    abstract _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: PointXY, tp: PointXY, _w: number, _h: number): void;
}
//# sourceMappingURL=abstract-bezier-connector.d.ts.map
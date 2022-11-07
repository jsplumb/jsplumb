import { PointXY } from "@jsplumb/util";
import { ConnectorOptions, Geometry, Connection } from './declarations';
import { AnchorPlacement } from "../anchor";
import { ConnectorBase, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
export interface BaseBezierConnectorGeometry extends Geometry {
    source: AnchorPlacement;
    target: AnchorPlacement;
}
/**
 * The bezier connector's internal representation of a path.
 * @public
 */
export interface BezierConnectorGeometry extends BaseBezierConnectorGeometry {
    controlPoints: [
        PointXY,
        PointXY
    ];
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
export declare function _compute(connector: BezierConnectorBase, paintInfo: PaintGeometry, p: ConnectorComputeParams, _computeBezier: (connector: BezierConnectorBase, paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, _w: number, _h: number) => void): void;
/**
 * Defines the common properties of a bezier connector.
 * @internal
 */
export interface BezierConnectorBase extends ConnectorBase {
    showLoopback: boolean;
    curviness: number;
    margin: number;
    proximityLimit: number;
    orientation: string;
    loopbackRadius: number;
    clockwise: boolean;
    isLoopbackCurrently: boolean;
}
/**
 * Create a base bezier connector, shared by Bezier and StateMachine.
 * @param type
 * @param connection
 * @param params
 * @param defaultStubs
 * @internal
 */
export declare function createBezierConnectorBase(type: string, connection: Connection, params: ConnectorOptions, defaultStubs: [number, number]): BezierConnectorBase;
//# sourceMappingURL=abstract-bezier-connector.d.ts.map
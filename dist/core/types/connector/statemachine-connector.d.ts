import { AbstractBezierOptions, BaseBezierConnectorGeometry, BezierConnectorBase } from "./abstract-bezier-connector";
import { PointXY } from "@jsplumb/util";
import { ConnectorHandler } from "./connectors";
export interface StateMachineOptions extends AbstractBezierOptions {
}
export declare const CONNECTOR_TYPE_STATE_MACHINE = "StateMachine";
export declare const CONNECTOR_TYPE_QUADRATIC_BEZIER = "QuadraticBezier";
export interface StateMachineConnector extends BezierConnectorBase {
    type: typeof CONNECTOR_TYPE_STATE_MACHINE;
    geometry: StateMachineConnectorGeometry;
    _controlPoint: PointXY;
}
/**
 * The bezier connector's internal representation of a path.
 * @public
 */
export interface StateMachineConnectorGeometry extends BaseBezierConnectorGeometry {
    controlPoint: PointXY;
}
/**
 * @internal
 */
export declare const StateMachineConnectorHandler: ConnectorHandler;
//# sourceMappingURL=statemachine-connector.d.ts.map
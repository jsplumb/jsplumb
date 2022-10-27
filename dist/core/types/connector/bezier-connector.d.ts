import { AbstractBezierOptions, BezierConnectorBase, BezierConnectorGeometry } from "./abstract-bezier-connector";
import { ConnectorHandler } from "./connectors";
/**
 * Options for the Bezier connector.
 */
export interface BezierOptions extends AbstractBezierOptions {
}
export declare const CONNECTOR_TYPE_BEZIER = "Bezier";
export declare const CONNECTOR_TYPE_CUBIC_BEZIER = "CubicBezier";
/**
 * Models a cubic bezier connector
 * @internal
 */
export interface BezierConnector extends BezierConnectorBase {
    type: typeof CONNECTOR_TYPE_BEZIER;
    majorAnchor: number;
    minorAnchor: number;
    geometry: BezierConnectorGeometry;
}
/**
 * @internal
 */
export declare const BezierConnectorHandler: ConnectorHandler;
//# sourceMappingURL=bezier-connector.d.ts.map
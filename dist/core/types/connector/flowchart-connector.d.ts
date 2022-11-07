import { ConnectorHandler } from "./connectors";
import { ConnectorBase } from "./abstract-connector";
import { ConnectorOptions } from "./declarations";
/**
 * Options for a flowchart connector
 * @public
 */
export interface FlowchartConnectorOptions extends ConnectorOptions {
    /**
     * Always paint stubs at the end of a connector, even if the elements are closer together than the length of the stubs.
     */
    alwaysRespectStubs?: boolean;
    /**
     * Optional midpoint to use for the connector, defaults to 0.5.
     */
    midpoint?: number;
    /**
     * Optional curvature between segments. Defaults to 0, ie. no curve.
     */
    cornerRadius?: number;
    /**
     * How large to make a connector whose source and target is the same element.
     */
    loopbackRadius?: number;
}
declare type FlowchartSegment = [number, number, number, number, string];
export declare const CONNECTOR_TYPE_FLOWCHART = "Flowchart";
export interface FlowchartConnector extends ConnectorBase {
    type: typeof CONNECTOR_TYPE_FLOWCHART;
    internalSegments: Array<FlowchartSegment>;
    midpoint: number;
    alwaysRespectStubs: boolean;
    cornerRadius: number;
    lastx: number;
    lasty: number;
    loopbackRadius: number;
    isLoopbackCurrently: boolean;
}
/**
 * @internal
 */
export declare const FlowchartConnectorHandler: ConnectorHandler;
export {};
//# sourceMappingURL=flowchart-connector.d.ts.map
/**
 * Options for a flowchart connector
 * @public
 */
import { ConnectorOptions, Geometry } from "../common/connector";
import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "../core/connector/abstract-connector";
import { Connection } from "../core/connector/connection-impl";
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
/**
 * Flowchart connector inscribes a path consisting of a series of horizontal and vertical segments.
 * @public
 */
export declare class FlowchartConnector extends AbstractConnector {
    connection: Connection;
    static type: string;
    type: string;
    private internalSegments;
    midpoint: number;
    alwaysRespectStubs: boolean;
    cornerRadius: number;
    lastx: number;
    lasty: number;
    lastOrientation: any;
    loopbackRadius: number;
    isLoopbackCurrently: boolean;
    getDefaultStubs(): [number, number];
    constructor(connection: Connection, params: FlowchartConnectorOptions);
    private addASegment;
    private writeSegments;
    _compute(paintInfo: PaintGeometry, params: ConnectorComputeParams): void;
    transformGeometry(g: Geometry, dx: number, dy: number): Geometry;
}
//# sourceMappingURL=flowchart-connector.d.ts.map
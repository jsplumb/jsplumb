import { AbstractConnector, AbstractConnectorOptions, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { jsPlumbInstance } from "../core";
import { Connection } from "./connection-impl";
export interface FlowchartConnectorOptions extends AbstractConnectorOptions {
    alwaysRespectStubs?: boolean;
    midpoint?: number;
    cornerRadius?: number;
    loopbackRadius?: number;
}
declare type FlowchartSegment = [number, number, number, number, string];
export declare class FlowchartConnector extends AbstractConnector {
    instance: jsPlumbInstance;
    connection: Connection;
    type: string;
    internalSegments: Array<FlowchartSegment>;
    midpoint: number;
    alwaysRespectStubs: boolean;
    cornerRadius: number;
    lastx: number;
    lasty: number;
    lastOrientation: any;
    loopbackRadius: number;
    isLoopbackCurrently: boolean;
    constructor(instance: jsPlumbInstance, connection: Connection, params: FlowchartConnectorOptions);
    private addASegment;
    private writeSegments;
    _compute(paintInfo: PaintGeometry, params: ConnectorComputeParams): void;
}
export {};

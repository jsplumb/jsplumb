import { AbstractConnector, AbstractConnectorOptions, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { jsPlumbInstance } from "../core";
import { Connection } from "./connection-impl";
export interface FlowchartConnectorOptions<E> extends AbstractConnectorOptions<E> {
    alwaysRespectStubs?: boolean;
    midpoint?: number;
    cornerRadius?: number;
    loopbackRadius?: number;
}
declare type FlowchartSegment = [number, number, number, number, string];
export declare class FlowchartConnector<E> extends AbstractConnector<E> {
    instance: jsPlumbInstance<E>;
    connection: Connection<E>;
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
    constructor(instance: jsPlumbInstance<E>, connection: Connection<E>, params: FlowchartConnectorOptions<E>);
    private addASegment;
    private writeSegments;
    _compute(paintInfo: PaintGeometry, params: ConnectorComputeParams<E>): void;
}
export {};

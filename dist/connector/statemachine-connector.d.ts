import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { jsPlumbInstance } from "../core";
import { ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { ComputedAnchorPosition } from "../factory/anchor-factory";
import { Connection } from "./connection-impl";
export interface StateMachineOptions extends AbstractBezierOptions {
}
export declare class StateMachine extends AbstractBezierConnector {
    connection: Connection;
    type: string;
    _controlPoint: [number, number];
    proximityLimit: number;
    constructor(instance: jsPlumbInstance, connection: Connection, params: StateMachineOptions);
    _computeBezier(paintInfo: PaintGeometry, params: ConnectorComputeParams, sp: ComputedAnchorPosition, tp: ComputedAnchorPosition, w: number, h: number): void;
}

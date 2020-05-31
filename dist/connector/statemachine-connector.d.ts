import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { jsPlumbInstance } from "../core";
import { ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { ComputedAnchorPosition } from "../factory/anchor-factory";
import { Connection } from "./connection-impl";
export interface StateMachineOptions extends AbstractBezierOptions {
}
export declare class StateMachine<E> extends AbstractBezierConnector<E> {
    connection: Connection<E>;
    type: string;
    _controlPoint: [number, number];
    proximityLimit: number;
    constructor(instance: jsPlumbInstance<E>, connection: Connection<E>, params: StateMachineOptions);
    _computeBezier(paintInfo: PaintGeometry, params: ConnectorComputeParams<E>, sp: ComputedAnchorPosition, tp: ComputedAnchorPosition, w: number, h: number): void;
}

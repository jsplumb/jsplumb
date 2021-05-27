import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { Connection } from "./connection-impl";
import { AnchorPlacement } from "@jsplumb/common";
export interface StateMachineOptions extends AbstractBezierOptions {
}
export declare class StateMachineConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    _controlPoint: [number, number];
    proximityLimit: number;
    constructor(connection: Connection, params: StateMachineOptions);
    _computeBezier(paintInfo: PaintGeometry, params: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, w: number, h: number): void;
}

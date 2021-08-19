import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { Connection, ConnectorComputeParams, PaintGeometry } from "@jsplumb/core";
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
//# sourceMappingURL=statemachine-connector.d.ts.map
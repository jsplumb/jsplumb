import { AbstractBezierConnector, AbstractBezierOptions } from "./abstract-bezier-connector";
import { ConnectorComputeParams, PaintGeometry } from "../core/connector/abstract-connector";
import { PointXY } from "../util/util";
import { AnchorPlacement } from "../common/anchor";
import { Connection } from "../core/connector/connection-impl";
export interface StateMachineOptions extends AbstractBezierOptions {
}
export declare class StateMachineConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    _controlPoint: PointXY;
    constructor(connection: Connection, params: StateMachineOptions);
    _computeBezier(paintInfo: PaintGeometry, params: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, w: number, h: number): void;
}
//# sourceMappingURL=statemachine-connector.d.ts.map
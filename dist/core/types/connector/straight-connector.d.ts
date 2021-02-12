import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
export declare class StraightConnector extends AbstractConnector {
    static type: string;
    type: string;
    getDefaultStubs(): [number, number];
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
}

import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
export declare class StraightConnector extends AbstractConnector {
    type: string;
    getDefaultStubs(): [number, number];
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
}

import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
export declare class StraightConnector extends AbstractConnector {
    type: string;
    _compute(paintInfo: PaintGeometry, _: ConnectorComputeParams): void;
}

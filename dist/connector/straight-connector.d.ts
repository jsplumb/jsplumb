import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
export declare class StraightConnector<E> extends AbstractConnector<E> {
    type: string;
    _compute(paintInfo: PaintGeometry, _: ConnectorComputeParams<E>): void;
}

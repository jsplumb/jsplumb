import { AbstractConnector, ConnectorComputeParams, PaintGeometry } from "./abstract-connector";
import { AnchorPlacement } from "../../common/anchor";
export interface StraightConnectorGeometry {
    source: AnchorPlacement;
    target: AnchorPlacement;
}
export declare class StraightConnector extends AbstractConnector {
    static type: string;
    type: string;
    getDefaultStubs(): [number, number];
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
    transformGeometry(g: StraightConnectorGeometry, dx: number, dy: number): StraightConnectorGeometry;
}
//# sourceMappingURL=straight-connector.d.ts.map
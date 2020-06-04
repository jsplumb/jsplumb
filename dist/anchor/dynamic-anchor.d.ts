import { Anchor } from "./anchor";
import { AnchorComputeParams, AnchorOptions, ComputedAnchorPosition, Orientation } from "../factory/anchor-factory";
import { jsPlumbInstance, PointArray } from "../core";
import { Endpoint } from "../endpoint/endpoint-impl";
export interface DynamicAnchorOptions extends AnchorOptions {
    selector?: (xy: PointArray, wh: PointArray, txy: PointArray, twh: PointArray, anchors: Array<Anchor>) => Anchor;
    elementId?: string;
    anchors: Array<Anchor>;
}
export declare class DynamicAnchor extends Anchor {
    instance: jsPlumbInstance;
    anchors: Array<Anchor>;
    private _curAnchor;
    private _lastAnchor;
    private _anchorSelector;
    constructor(instance: jsPlumbInstance, options: DynamicAnchorOptions);
    getAnchors(): Array<Anchor>;
    compute(params: AnchorComputeParams): ComputedAnchorPosition;
    getCurrentLocation(params: AnchorComputeParams): ComputedAnchorPosition;
    getOrientation(_endpoint?: Endpoint): Orientation;
    over(anchor: Anchor, endpoint: Endpoint): void;
    out(): void;
    setAnchor(a: Anchor): void;
    getCssClass(): string;
    setAnchorCoordinates(coords: PointArray): boolean;
}

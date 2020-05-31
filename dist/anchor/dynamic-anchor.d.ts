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
    instance: jsPlumbInstance<any>;
    anchors: Array<Anchor>;
    private _curAnchor;
    private _lastAnchor;
    private _anchorSelector;
    constructor(instance: jsPlumbInstance<any>, options: DynamicAnchorOptions);
    getAnchors(): Array<Anchor>;
    compute(params: AnchorComputeParams): ComputedAnchorPosition;
    getCurrentLocation(params: AnchorComputeParams): ComputedAnchorPosition;
    getOrientation(_endpoint?: Endpoint<any>): Orientation;
    over(anchor: Anchor, endpoint: Endpoint<any>): void;
    out(): void;
    setAnchor(a: Anchor): void;
    getCssClass(): string;
    setAnchorCoordinates(coords: PointArray): boolean;
}

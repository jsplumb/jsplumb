import { Anchor } from "./anchor";
import { AnchorOptions, AnchorSpec } from "../factory/anchor-factory";
import { PointXY, Rotations, Size } from '../common';
import { JsPlumbInstance } from "../core";
export declare type AnchorSelectorFunction = (xy: PointXY, wh: Size, txy: PointXY, twh: Size, rotation: Rotations, targetRotation: Rotations, anchors: Array<Anchor>) => Anchor;
export interface DynamicAnchorOptions extends AnchorOptions {
    selector?: AnchorSelectorFunction;
    elementId?: string;
    anchors: Array<Anchor | AnchorSpec>;
}
export declare class DynamicAnchor extends Anchor {
    instance: JsPlumbInstance;
    anchors: Array<Anchor>;
    _curAnchor: Anchor;
    _lastAnchor: Anchor;
    _anchorSelector: AnchorSelectorFunction;
    constructor(instance: JsPlumbInstance, options: DynamicAnchorOptions);
    getAnchors(): Array<Anchor>;
    setAnchor(a: Anchor): void;
    getCssClass(): string;
    setAnchorCoordinates(coords: PointXY): boolean;
}

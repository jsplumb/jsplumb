import { Anchor } from "./anchor";
import { AnchorOptions } from "../factory/anchor-factory";
import { PointArray, Rotations } from '../common';
import { JsPlumbInstance } from "../core";
export interface DynamicAnchorOptions extends AnchorOptions {
    selector?: (xy: PointArray, wh: PointArray, txy: PointArray, twh: PointArray, rotation: Rotations, targetRotation: Rotations, anchors: Array<Anchor>) => Anchor;
    elementId?: string;
    anchors: Array<Anchor>;
}
export declare class DynamicAnchor extends Anchor {
    instance: JsPlumbInstance;
    anchors: Array<Anchor>;
    _curAnchor: Anchor;
    _lastAnchor: Anchor;
    _anchorSelector: (xy: PointArray, wh: PointArray, txy: PointArray, twh: PointArray, rotation: Rotations, targetRotation: Rotations, anchors: Array<Anchor>) => Anchor;
    constructor(instance: JsPlumbInstance, options: DynamicAnchorOptions);
    getAnchors(): Array<Anchor>;
    setAnchor(a: Anchor): void;
    getCssClass(): string;
    setAnchorCoordinates(coords: PointArray): boolean;
}

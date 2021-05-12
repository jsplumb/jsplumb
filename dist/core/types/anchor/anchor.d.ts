import { JsPlumbInstance } from "../core";
import { AnchorId, AnchorOptions, AnchorOrientationHint, Orientation } from "../factory/anchor-factory";
import { AnchorPlacement } from "../router/router";
export declare class Anchor {
    instance: JsPlumbInstance;
    type: AnchorId;
    isDynamic: boolean;
    isContinuous: boolean;
    isFloating: boolean;
    cssClass: string;
    elementId: string;
    readonly id: string;
    locked: boolean;
    offsets: [number, number];
    orientation: Orientation;
    x: number;
    y: number;
    timestamp: string;
    lastReturnValue: AnchorPlacement;
    _unrotatedOrientation: Orientation;
    clone: () => Anchor;
    constructor(instance: JsPlumbInstance, params?: AnchorOptions);
    setPosition(x: number, y: number, ox: AnchorOrientationHint, oy: AnchorOrientationHint, overrideLock?: boolean): void;
    setInitialOrientation(ox: number, oy: number): void;
    equals(anchor: Anchor): boolean;
    getCssClass(): string;
}

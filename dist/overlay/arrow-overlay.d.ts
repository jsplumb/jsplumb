import { ArrowOverlayOptions, Overlay } from "./overlay";
import { jsPlumbInstance, PointArray } from "../core";
import { Component, PaintStyle } from "..";
export declare class ArrowOverlay extends Overlay {
    instance: jsPlumbInstance;
    component: Component;
    width: number;
    length: number;
    foldback: number;
    direction: number;
    paintStyle: PaintStyle;
    static arrowType: string;
    type: string;
    cachedDimensions: PointArray;
    constructor(instance: jsPlumbInstance, component: Component, p: ArrowOverlayOptions);
    draw(component: Component, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointArray): any;
    updateFrom(d: any): void;
}
export declare function isArrowOverlay(o: Overlay): o is ArrowOverlay;

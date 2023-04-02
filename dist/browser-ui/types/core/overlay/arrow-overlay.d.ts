import { Overlay } from "./overlay";
import { JsPlumbInstance } from "../core";
import { Component } from '../component/component';
import { ArrowOverlayOptions } from "../../common/overlay";
import { PointXY, Size } from "../../util/util";
import { PaintStyle } from "../../common/paint-style";
export declare class ArrowOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    width: number;
    length: number;
    foldback: number;
    direction: number;
    location: number;
    paintStyle: PaintStyle;
    static type: string;
    type: string;
    cachedDimensions: Size;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
    draw(component: Component, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointXY): any;
    updateFrom(d: any): void;
}
export declare function isArrowOverlay(o: Overlay): o is ArrowOverlay;
//# sourceMappingURL=arrow-overlay.d.ts.map
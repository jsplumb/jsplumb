import { Overlay } from "./overlay";
import { JsPlumbInstance } from "../core";
import { Component } from "../component/component";
import { LabelOverlayOptions, PaintStyle } from "@jsplumb/common";
import { PointXY } from "@jsplumb/util";
export declare class PlainLabelOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    static type: string;
    type: string;
    location: number;
    paintStyle: PaintStyle;
    label: string | Function;
    constructor(instance: JsPlumbInstance, component: Component, p: LabelOverlayOptions);
    private _resolveLocation;
    draw(component: Component, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointXY): any;
    updateFrom(d: any): void;
}
export declare function isPlainLabelOverlay(o: Overlay): o is PlainLabelOverlay;
//# sourceMappingURL=plain-label-overlay.d.ts.map
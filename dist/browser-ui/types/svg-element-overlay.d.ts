import { Component, Overlay } from "@jsplumb/core";
import { PaintStyle } from "@jsplumb/common";
import { Extents } from "@jsplumb/util";
export interface SvgOverlayPaintParams extends Extents, PaintStyle {
    component: Component;
    d?: any;
}
export declare function ensureSVGOverlayPath(o: SVGElementOverlay): SVGElement;
export declare function paintSVGOverlay(o: SVGElementOverlay, path: string, params: SvgOverlayPaintParams, extents: Extents): void;
export declare function destroySVGOverlay(o: Overlay, force?: boolean): void;
export declare abstract class SVGElementOverlay extends Overlay {
    path: SVGElement;
}
//# sourceMappingURL=svg-element-overlay.d.ts.map
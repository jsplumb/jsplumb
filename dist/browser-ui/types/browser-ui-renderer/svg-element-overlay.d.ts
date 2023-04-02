import { PaintStyle } from "../common/paint-style";
import { Extents } from "../util/util";
import { Overlay } from "../core/overlay/overlay";
import { Component } from "../core/component/component";
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
import { Component, Extents, Overlay, PaintStyle } from "@jsplumb/core";
export interface SvgOverlayPaintParams extends Extents, PaintStyle {
    component: Component;
    d?: any;
}
export declare abstract class SVGElementOverlay extends Overlay {
    path: SVGElement;
    static ensurePath(o: SVGElementOverlay): SVGElement;
    static paint(o: SVGElementOverlay, path: string, params: SvgOverlayPaintParams, extents: Extents): void;
    static destroy(o: Overlay, force?: boolean): void;
}

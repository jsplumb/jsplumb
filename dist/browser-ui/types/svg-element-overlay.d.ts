import { Overlay } from "@jsplumb/core";
export declare abstract class SVGElementOverlay extends Overlay {
    path: SVGElement;
    static ensurePath(o: SVGElementOverlay): SVGElement;
    static paint(o: SVGElementOverlay, path: string, params: any, extents: any): void;
    static destroy(o: Overlay, force?: boolean): void;
}

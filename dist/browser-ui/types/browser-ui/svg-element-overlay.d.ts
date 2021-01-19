import { Overlay } from "@jsplumb/community-core";
export declare abstract class SVGElementOverlay {
    static ensurePath(o: any): HTMLElement;
    static paint(o: any, path: string, params: any, extents: any): void;
    static destroy(o: Overlay, force?: boolean): void;
}

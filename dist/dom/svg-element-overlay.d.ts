import { Overlay } from "..";
export declare abstract class SVGElementOverlay {
    static ensurePath(o: any): HTMLElement;
    static paint(o: any, path: string, params: any, extents: any): void;
    static destroy(o: Overlay<HTMLElement>, force?: boolean): void;
}

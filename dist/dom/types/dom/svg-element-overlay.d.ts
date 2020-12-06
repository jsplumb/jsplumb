import { Overlay } from '../core/overlay/overlay';
export declare abstract class SVGElementOverlay {
    static ensurePath(o: any): HTMLElement;
    static paint(o: any, path: string, params: any, extents: any): void;
    static destroy(o: Overlay, force?: boolean): void;
}

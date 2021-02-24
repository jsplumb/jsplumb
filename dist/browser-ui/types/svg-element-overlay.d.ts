import { Overlay } from "@jsplumb/core";
import { jsPlumbDOMElement } from './element-facade';
export declare abstract class SVGElementOverlay {
    static ensurePath(o: any): jsPlumbDOMElement;
    static paint(o: any, path: string, params: any, extents: any): void;
    static destroy(o: Overlay, force?: boolean): void;
}

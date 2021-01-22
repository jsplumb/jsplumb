import { Overlay } from "@jsplumb/community-core";
import { jsPlumbDOMElement } from "./browser-jsplumb-instance";
export declare abstract class SVGElementOverlay {
    static ensurePath(o: any): jsPlumbDOMElement;
    static paint(o: any, path: string, params: any, extents: any): void;
    static destroy(o: Overlay, force?: boolean): void;
}

import { ArrowOverlay } from "./arrow-overlay";
import { JsPlumbInstance } from "../core";
import { Component } from '../component/component';
import { Overlay } from "./overlay";
import { ArrowOverlayOptions } from "../../common/overlay";
export declare class PlainArrowOverlay extends ArrowOverlay {
    instance: JsPlumbInstance;
    static type: string;
    type: string;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
}
export declare function isPlainArrowOverlay(o: Overlay): o is PlainArrowOverlay;
//# sourceMappingURL=plain-arrow-overlay.d.ts.map
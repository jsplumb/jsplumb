import { ArrowOverlay } from "./arrow-overlay";
import { JsPlumbInstance } from "../core";
import { Component } from '../component/component';
import { ArrowOverlayOptions } from "@jsplumb/common";
import { Overlay } from "./overlay";
export declare class PlainArrowOverlay extends ArrowOverlay {
    instance: JsPlumbInstance;
    static type: string;
    type: string;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
}
export declare function isPlainArrowOverlay(o: Overlay): o is PlainArrowOverlay;

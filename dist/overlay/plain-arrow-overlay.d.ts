import { ArrowOverlay } from "./arrow-overlay";
import { jsPlumbInstance } from "../core";
import { ArrowOverlayOptions, Component } from "..";
export declare class PlainArrowOverlay extends ArrowOverlay {
    instance: jsPlumbInstance;
    constructor(instance: jsPlumbInstance, component: Component, p: ArrowOverlayOptions);
}

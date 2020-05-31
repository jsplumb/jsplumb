import { ArrowOverlay } from "./arrow-overlay";
import { jsPlumbInstance } from "../core";
import { ArrowOverlayOptions, Component } from "..";
export declare class DiamondOverlay<E> extends ArrowOverlay<E> {
    instance: jsPlumbInstance<E>;
    constructor(instance: jsPlumbInstance<E>, component: Component<E>, p: ArrowOverlayOptions);
}

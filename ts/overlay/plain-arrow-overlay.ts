import {ArrowOverlay} from "./arrow-overlay";
import {jsPlumbInstance} from "../core";
import {ArrowOverlayOptions, Component, OverlayFactory} from "..";

export class PlainArrowOverlay extends ArrowOverlay {

    constructor(public instance:jsPlumbInstance, component: Component, p: ArrowOverlayOptions) {
        super(instance, component, p);
        this.foldback = 1;
    }
}

OverlayFactory.register("PlainArrow", PlainArrowOverlay);

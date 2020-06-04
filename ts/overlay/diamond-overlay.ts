import {ArrowOverlay} from "./arrow-overlay";
import {jsPlumbInstance} from "../core";
import {ArrowOverlayOptions, Component, OverlayFactory} from "..";

export class DiamondOverlay extends ArrowOverlay {


    constructor(public instance: jsPlumbInstance<any>, component: Component, p: ArrowOverlayOptions) {
        super(instance, component, p);

        this.length = this.length / 2;
        this.foldback = 2;
    }
}

OverlayFactory.register("Diamond", DiamondOverlay);

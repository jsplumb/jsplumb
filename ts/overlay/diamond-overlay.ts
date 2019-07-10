import {ArrowOverlay} from "./arrow-overlay";
import {jsPlumbInstance} from "../core";
import {ArrowOverlayOptions, Component, OverlayFactory} from "..";

export class DiamondOverlay<E> extends ArrowOverlay<E> {


    constructor(instance: jsPlumbInstance<E>, component: Component<E>, p: ArrowOverlayOptions) {
        super(instance, component, p);

        this.length = this.length / 2;
        this.foldback = 2;
    }
}

OverlayFactory.register("Diamond", DiamondOverlay);
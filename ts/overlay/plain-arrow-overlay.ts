import {ArrowOverlay} from "./arrow-overlay";
import {jsPlumbInstance} from "../core";
import {ArrowOverlayOptions, Component, OverlayFactory} from "..";

export class PlainArrowOverlay<E> extends ArrowOverlay<E> {

    constructor(instance:jsPlumbInstance<E>, component: Component<E>, p: ArrowOverlayOptions) {
        super(instance, component, p);
        this.foldback = 1;
    }
}

OverlayFactory.register("PlainArrow", PlainArrowOverlay);
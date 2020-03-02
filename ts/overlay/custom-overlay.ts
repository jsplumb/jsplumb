import {CustomOverlayOptions, Overlay} from "./overlay";
import { jsPlumbInstance } from "../core";
import {Component, OverlayFactory } from "..";

export class CustomOverlay<E> extends Overlay<E> {

    create:(c:Component<E>) => E;

    constructor(public instance:jsPlumbInstance<E>, public component:Component<E>,
                p:CustomOverlayOptions<E>) {

        super(instance, component, p);
        this.create = p.create;
    }

    type:string = "Custom";

    updateFrom(d: any): void { }

}

OverlayFactory.register("Custom", CustomOverlay);

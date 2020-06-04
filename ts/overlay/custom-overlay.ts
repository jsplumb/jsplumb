import {CustomOverlayOptions, Overlay} from "./overlay";
import { jsPlumbInstance } from "../core";
import {Component, OverlayFactory } from "..";

export class CustomOverlay extends Overlay {

    create:(c:Component) => any;

    constructor(public instance:jsPlumbInstance, public component:Component,
                p:CustomOverlayOptions) {

        super(instance, component, p);
        this.create = p.create;
    }

    type:string = "Custom";

    updateFrom(d: any): void { }

}

OverlayFactory.register("Custom", CustomOverlay);

import { CustomOverlayOptions, Overlay } from "./overlay";
import { jsPlumbInstance } from "../core";
import { Component } from "..";
export declare class CustomOverlay extends Overlay {
    instance: jsPlumbInstance;
    component: Component;
    create: (c: Component) => any;
    constructor(instance: jsPlumbInstance, component: Component, p: CustomOverlayOptions);
    type: string;
    updateFrom(d: any): void;
}

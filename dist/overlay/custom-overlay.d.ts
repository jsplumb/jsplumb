import { CustomOverlayOptions, Overlay } from "./overlay";
import { jsPlumbInstance } from "../core";
import { Component } from "..";
export declare class CustomOverlay extends Overlay {
    instance: jsPlumbInstance;
    component: Component;
    create: (c: Component) => any;
    constructor(instance: jsPlumbInstance, component: Component, p: CustomOverlayOptions);
    static customType: string;
    type: string;
    updateFrom(d: any): void;
}
export declare function isCustomOverlay(o: Overlay): o is CustomOverlay;

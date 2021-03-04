import { LabelOverlayOptions, Overlay } from "./overlay";
import { Component } from "../component/component";
import { JsPlumbInstance } from "../core";
import { Size } from '../common';
export declare class LabelOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    label: string | Function;
    labelText: string;
    static type: string;
    type: string;
    cachedDimensions: Size;
    constructor(instance: JsPlumbInstance, component: Component, p: LabelOverlayOptions);
    getLabel(): string;
    setLabel(l: string | Function): void;
    getDimensions(): Size;
    updateFrom(d: any): void;
}
export declare function isLabelOverlay(o: Overlay): o is LabelOverlay;

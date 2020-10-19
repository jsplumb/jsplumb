import { LabelOverlayOptions, Overlay } from "./overlay";
import { Component } from "../component/component";
import { JsPlumbInstance } from "../core";
import { PointArray } from '../common';
export declare class LabelOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    label: string | Function;
    labelText: string;
    static labelType: string;
    type: string;
    cachedDimensions: PointArray;
    constructor(instance: JsPlumbInstance, component: Component, p: LabelOverlayOptions);
    getLabel(): string;
    setLabel(l: string | Function): void;
    getDimensions(): PointArray;
    updateFrom(d: any): void;
}
export declare function isLabelOverlay(o: Overlay): o is LabelOverlay;

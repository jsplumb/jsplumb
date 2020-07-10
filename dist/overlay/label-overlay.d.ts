import { LabelOverlayOptions, Overlay } from "./overlay";
import { Component } from "../component/component";
import { jsPlumbInstance, PointArray } from "../core";
export declare class LabelOverlay extends Overlay {
    instance: jsPlumbInstance;
    component: Component;
    label: string | Function;
    labelText: string;
    static labelType: string;
    type: string;
    cachedDimensions: PointArray;
    constructor(instance: jsPlumbInstance, component: Component, p: LabelOverlayOptions);
    getLabel(): string;
    setLabel(l: string | Function): void;
    getDimensions(): PointArray;
    updateFrom(d: any): void;
}
export declare function isLabelOverlay(o: Overlay): o is LabelOverlay;

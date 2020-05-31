import { LabelOverlayOptions, Overlay } from "./overlay";
import { Component } from "../component/component";
import { jsPlumbInstance, PointArray } from "../core";
export declare class LabelOverlay<E> extends Overlay<E> {
    instance: jsPlumbInstance<E>;
    component: Component<E>;
    label: string | Function;
    labelText: string;
    type: string;
    cachedDimensions: PointArray;
    constructor(instance: jsPlumbInstance<E>, component: Component<E>, p: LabelOverlayOptions);
    getLabel(): string;
    setLabel(l: string | Function): void;
    getDimensions(): PointArray;
    updateFrom(d: any): void;
}

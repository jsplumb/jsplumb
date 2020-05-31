import { ArrowOverlayOptions, Overlay } from "./overlay";
import { jsPlumbInstance, PointArray } from "../core";
import { Component, PaintStyle } from "..";
export declare class ArrowOverlay<E> extends Overlay<E> {
    instance: jsPlumbInstance<E>;
    component: Component<E>;
    width: number;
    length: number;
    foldback: number;
    direction: number;
    paintStyle: PaintStyle;
    type: string;
    cachedDimensions: PointArray;
    constructor(instance: jsPlumbInstance<E>, component: Component<E>, p: ArrowOverlayOptions);
    draw(component: Component<HTMLElement>, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointArray): any;
    updateFrom(d: any): void;
}

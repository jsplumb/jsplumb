import { ArrowOverlayOptions, Overlay } from "./overlay";
import { JsPlumbInstance } from "../core";
import { PointArray } from '../common';
import { Component } from '../component/component';
import { PaintStyle } from '../styles';
export declare class ArrowOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    width: number;
    length: number;
    foldback: number;
    direction: number;
    paintStyle: PaintStyle;
    static arrowType: string;
    type: string;
    cachedDimensions: PointArray;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
    draw(component: Component, currentConnectionPaintStyle: PaintStyle, absolutePosition?: [number, number]): any;
    updateFrom(d: any): void;
}
export declare function isArrowOverlay(o: Overlay): o is ArrowOverlay;

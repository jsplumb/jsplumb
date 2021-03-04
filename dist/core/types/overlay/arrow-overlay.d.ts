import { ArrowOverlayOptions, Overlay } from "./overlay";
import { JsPlumbInstance } from "../core";
import { PointXY, Size } from '../common';
import { Component } from '../component/component';
import { PaintStyle } from '../styles';
export declare class ArrowOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    width: number;
    length: number;
    foldback: number;
    direction: number;
    location: number;
    paintStyle: PaintStyle;
    static type: string;
    type: string;
    cachedDimensions: Size;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
    draw(component: Component, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointXY): any;
    updateFrom(d: any): void;
}
export declare function isArrowOverlay(o: Overlay): o is ArrowOverlay;

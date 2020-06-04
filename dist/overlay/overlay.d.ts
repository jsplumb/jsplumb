import { Dictionary, jsPlumbInstance } from "../core";
import { PaintStyle } from "../styles";
import { Component } from "../component/component";
import { EventGenerator } from "../event-generator";
export interface OverlayOptions {
    id?: string;
    cssClass?: string;
    location?: number;
    endpointLoc?: [number, number];
    events?: Dictionary<Function>;
}
export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number;
    length?: number;
    direction?: number;
    foldback?: number;
    paintStyle?: PaintStyle;
}
export interface LabelOverlayOptions extends OverlayOptions {
    label: string;
    endpointLocation?: [number, number];
    labelLocationAttribute?: string;
}
export interface CustomOverlayOptions extends OverlayOptions {
    create: (c: Component) => any;
}
export declare type OverlayId = "Label" | "Arrow" | "PlainArrow" | "Custom";
export declare type FullOverlaySpec = [OverlayId, OverlayOptions];
export declare type OverlaySpec = OverlayId | FullOverlaySpec;
export declare abstract class Overlay extends EventGenerator {
    instance: jsPlumbInstance;
    component: Component;
    id: string;
    abstract type: string;
    cssClass: string;
    visible: boolean;
    location: number;
    endpointLocation: [number, number];
    events?: Dictionary<Function>;
    constructor(instance: jsPlumbInstance, component: Component, p: OverlayOptions);
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    setVisible(v: boolean): void;
    isVisible(): boolean;
    destroy(force?: boolean): void;
    /**
     * Add a class to the overlay.
     * @param clazz
     */
    addClass(clazz: string): void;
    /**
     * Remove a class from the overlay.
     * @param clazz
     */
    removeClass(clazz: string): void;
    abstract updateFrom(d: any): void;
    private _postComponentEvent;
    click(e: Event): void;
    dblClick(e: Event): void;
}

import { JsPlumbInstance } from "../core";
import { Dictionary } from '../common';
import { PaintStyle } from "../styles";
import { Component } from "../component/component";
import { EventGenerator } from "../event-generator";
export interface OverlayOptions extends Record<string, any> {
    id?: string;
    cssClass?: string;
    location?: number | number[];
    events?: Dictionary<(value: any, event?: any) => any>;
}
export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number;
    length?: number;
    direction?: number;
    foldback?: number;
    paintStyle?: PaintStyle;
}
export interface LabelOverlayOptions extends OverlayOptions {
    label: string | Function;
    labelLocationAttribute?: string;
}
export interface CustomOverlayOptions extends OverlayOptions {
    create: (c: Component) => any;
}
export declare type FullOverlaySpec = {
    type: string;
    options: OverlayOptions;
};
export declare type OverlaySpec = string | FullOverlaySpec;
/**
 * Returns whether or not the given overlay spec is a 'full' overlay spec, ie. has a `type` and some `options`, or is just an overlay name.
 * @param o
 */
export declare function isFullOverlaySpec(o: OverlaySpec): o is FullOverlaySpec;
/**
 * Convert the given input into an object in the form of a `FullOverlaySpec`
 * @param spec
 */
export declare function convertToFullOverlaySpec(spec: string | OverlaySpec): FullOverlaySpec;
export declare abstract class Overlay extends EventGenerator {
    instance: JsPlumbInstance;
    component: Component;
    id: string;
    abstract type: string;
    cssClass: string;
    visible: boolean;
    location: number | Array<number>;
    events?: Dictionary<(value: any, event?: any) => any>;
    constructor(instance: JsPlumbInstance, component: Component, p: OverlayOptions);
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    setVisible(v: boolean): void;
    isVisible(): boolean;
    destroy(force?: boolean): void;
    abstract updateFrom(d: any): void;
    private _postComponentEvent;
    click(e: Event): void;
    dblclick(e: Event): void;
    tap(e: Event): void;
    dbltap(e: Event): void;
}
export interface OverlayMouseEventParams {
    e: Event;
    overlay: Overlay;
}

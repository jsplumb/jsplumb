import { JsPlumbInstance } from "../core";
import { Component } from "../component/component";
import { Dictionary, EventGenerator } from "@jsplumb/util";
import { OverlaySpec, FullOverlaySpec, OverlayOptions } from "@jsplumb/common";
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
    abstract updateFrom(d: any): void;
}
export interface OverlayMouseEventParams {
    e: Event;
    overlay: Overlay;
}

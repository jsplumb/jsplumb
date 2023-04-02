import { JsPlumbInstance } from "../core";
import { Component } from "../component/component";
import { FullOverlaySpec, OverlayOptions, OverlaySpec } from "../../common/overlay";
import { EventGenerator } from "../../util/event-generator";
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
    events: Record<string, (value: any, event?: any) => any>;
    attributes: Record<string, string>;
    constructor(instance: JsPlumbInstance, component: Component, p: OverlayOptions);
    setLocation(l: number | string): void;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    setVisible(v: boolean): void;
    isVisible(): boolean;
    abstract updateFrom(d: any): void;
}
export interface OverlayMouseEventParams {
    e: Event;
    overlay: Overlay;
}
//# sourceMappingURL=overlay.d.ts.map
import { Overlay } from "./overlay";
import { JsPlumbInstance } from "../core";
import { Component } from '../component/component';
import { OverlayOptions } from "../../common/overlay";
/**
 * @public
 */
export interface CustomOverlayOptions extends OverlayOptions {
    create: (c: Component) => any;
}
export declare class CustomOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    create: (c: Component) => any;
    constructor(instance: JsPlumbInstance, component: Component, p: CustomOverlayOptions);
    static type: string;
    type: string;
    updateFrom(d: any): void;
}
export declare function isCustomOverlay(o: Overlay): o is CustomOverlay;
//# sourceMappingURL=custom-overlay.d.ts.map
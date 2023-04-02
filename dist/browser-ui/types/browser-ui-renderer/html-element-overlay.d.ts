import { jsPlumbDOMElement } from './element-facade';
import { Size } from "../util/util";
import { Overlay } from "../core/overlay/overlay";
import { JsPlumbInstance } from "../core/core";
import { Component } from "../core/component/component";
interface HTMLElementOverlayHolder extends Overlay {
    canvas: jsPlumbDOMElement;
    cachedDimensions: Size;
}
export declare class HTMLElementOverlay {
    instance: JsPlumbInstance;
    overlay: Overlay;
    protected htmlElementOverlay: HTMLElementOverlayHolder;
    constructor(instance: JsPlumbInstance, overlay: Overlay);
    static getElement(o: HTMLElementOverlayHolder, component?: Component, elementCreator?: (c: Component) => Element): Element;
    static destroy(o: HTMLElementOverlayHolder): void;
    static _getDimensions(o: HTMLElementOverlayHolder, forceRefresh?: boolean): Size;
}
export {};
//# sourceMappingURL=html-element-overlay.d.ts.map
import { jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Component, JsPlumbInstance, Overlay, PointArray } from "@jsplumb/community-core";
interface HTMLElementOverlayHolder extends Overlay {
    canvas: jsPlumbDOMElement;
    cachedDimensions: PointArray;
}
export declare class HTMLElementOverlay {
    instance: JsPlumbInstance;
    overlay: Overlay;
    protected htmlElementOverlay: HTMLElementOverlayHolder;
    constructor(instance: JsPlumbInstance, overlay: Overlay);
    static createElement(o: HTMLElementOverlayHolder): Element;
    static getElement(o: HTMLElementOverlayHolder, component?: Component, elementCreator?: (c: Component) => Element): Element;
    static destroy(o: HTMLElementOverlayHolder): void;
    static _getDimensions(o: HTMLElementOverlayHolder, forceRefresh?: boolean): PointArray;
}
export {};

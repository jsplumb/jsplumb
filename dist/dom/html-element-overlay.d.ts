import { Overlay } from "../overlay/overlay";
import { jsPlumbInstance, PointArray } from "../core";
import { Component } from "../component/component";
interface HTMLElementOverlayHolder extends Overlay {
    canvas: HTMLElement;
    cachedDimensions: PointArray;
}
export declare class HTMLElementOverlay {
    instance: jsPlumbInstance;
    overlay: Overlay;
    protected htmlElementOverlay: HTMLElementOverlayHolder;
    constructor(instance: jsPlumbInstance, overlay: Overlay);
    static createElement(o: HTMLElementOverlayHolder): HTMLElement;
    static getElement(o: HTMLElementOverlayHolder, component?: Component, elementCreator?: (c: Component) => HTMLElement): HTMLElement;
    static destroy(o: HTMLElementOverlayHolder): void;
    static _getDimensions(o: HTMLElementOverlayHolder, forceRefresh?: boolean): PointArray;
}
export {};

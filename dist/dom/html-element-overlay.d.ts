import { PointArray } from '../core/common';
import { JsPlumbInstance } from "../core/core";
import { Overlay } from '../core/overlay/overlay';
import { Component } from '../core/component/component';
interface HTMLElementOverlayHolder extends Overlay {
    canvas: HTMLElement;
    cachedDimensions: PointArray;
}
export declare class HTMLElementOverlay {
    instance: JsPlumbInstance;
    overlay: Overlay;
    protected htmlElementOverlay: HTMLElementOverlayHolder;
    constructor(instance: JsPlumbInstance, overlay: Overlay);
    static createElement(o: HTMLElementOverlayHolder): HTMLElement;
    static getElement(o: HTMLElementOverlayHolder, component?: Component, elementCreator?: (c: Component) => HTMLElement): HTMLElement;
    static destroy(o: HTMLElementOverlayHolder): void;
    static _getDimensions(o: HTMLElementOverlayHolder, forceRefresh?: boolean): PointArray;
}
export {};

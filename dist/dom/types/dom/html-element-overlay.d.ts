import { PointArray } from '../core/common';
import { JsPlumbInstance } from "../core/core";
import { Overlay } from '../core/overlay/overlay';
import { Component } from '../core/component/component';
import { jsPlumbDOMElement } from "./browser-jsplumb-instance";
interface HTMLElementOverlayHolder extends Overlay {
    canvas: jsPlumbDOMElement;
    cachedDimensions: PointArray;
}
export declare class HTMLElementOverlay {
    instance: JsPlumbInstance;
    overlay: Overlay;
    protected htmlElementOverlay: HTMLElementOverlayHolder;
    constructor(instance: JsPlumbInstance, overlay: Overlay);
    static createElement(o: HTMLElementOverlayHolder): jsPlumbDOMElement;
    static getElement(o: HTMLElementOverlayHolder, component?: Component, elementCreator?: (c: Component) => jsPlumbDOMElement): jsPlumbDOMElement;
    static destroy(o: HTMLElementOverlayHolder): void;
    static _getDimensions(o: HTMLElementOverlayHolder, forceRefresh?: boolean): PointArray;
}
export {};

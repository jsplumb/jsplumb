import { Overlay } from "../overlay/overlay";
import { jsPlumbInstance, PointArray } from "../core";
import { Component } from "../component/component";
interface HTMLElementOverlayHolder extends Overlay<HTMLElement> {
    canvas: HTMLElement;
    cachedDimensions: PointArray;
}
export declare class HTMLElementOverlay {
    instance: jsPlumbInstance<HTMLElement>;
    overlay: Overlay<HTMLElement>;
    protected htmlElementOverlay: HTMLElementOverlayHolder;
    constructor(instance: jsPlumbInstance<HTMLElement>, overlay: Overlay<HTMLElement>);
    static createElement(o: HTMLElementOverlayHolder): HTMLElement;
    static getElement(o: HTMLElementOverlayHolder, component?: Component<HTMLElement>, elementCreator?: (c: Component<HTMLElement>) => HTMLElement): HTMLElement;
    static destroy(o: HTMLElementOverlayHolder): void;
    static _getDimensions(o: HTMLElementOverlayHolder, forceRefresh?: boolean): PointArray;
}
export {};

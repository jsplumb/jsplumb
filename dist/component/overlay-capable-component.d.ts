import { Component, ComponentOptions } from "./component";
import { Overlay, OverlaySpec } from "../overlay/overlay";
import { Dictionary, jsPlumbInstance, PointArray } from "../core";
import { LabelOverlay } from "../overlay/label-overlay";
export interface OverlayComponentOptions extends ComponentOptions {
    label?: string;
    labelLocation?: number;
}
export declare type ClassAction = "add" | "remove";
export declare abstract class OverlayCapableComponent extends Component {
    instance: jsPlumbInstance;
    defaultLabelLocation: number | [number, number];
    overlays: Dictionary<Overlay>;
    overlayPositions: Dictionary<PointArray>;
    overlayPlacements: Dictionary<{
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }>;
    constructor(instance: jsPlumbInstance, params: OverlayComponentOptions);
    addOverlay(overlay: OverlaySpec, doNotRepaint?: boolean): Overlay;
    getOverlay(id: string): Overlay;
    getOverlays(): Dictionary<Overlay>;
    hideOverlay(id: string): void;
    hideOverlays(): void;
    showOverlay(id: string): void;
    showOverlays(): void;
    removeAllOverlays(doNotRepaint?: boolean): void;
    removeOverlay(overlayId: string, dontCleanup?: boolean): void;
    removeOverlays(...overlays: string[]): void;
    getLabel(): string;
    getLabelOverlay(): LabelOverlay;
    setLabel(l: string | Function | LabelOverlay): void;
    destroy(force?: boolean): void;
    setVisible(v: boolean): void;
    setAbsoluteOverlayPosition(overlay: Overlay, xy: PointArray): void;
    getAbsoluteOverlayPosition(overlay: Overlay): PointArray;
    private _clazzManip;
    addClass(clazz: string, dontUpdateOverlays?: boolean): void;
    removeClass(clazz: string, dontUpdateOverlays?: boolean): void;
    applyType(t: any, doNotRepaint: boolean, typeMap: any): void;
}

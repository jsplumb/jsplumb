import { Component, ComponentOptions } from "./component";
import { Overlay, OverlaySpec } from "../overlay/overlay";
import { Dictionary, PointXY } from '../common';
import { JsPlumbInstance } from "../core";
import { LabelOverlay } from "../overlay/label-overlay";
export interface OverlayComponentOptions extends ComponentOptions {
    label?: string;
    labelLocation?: number;
    overlays?: Array<OverlaySpec>;
}
export declare type ClassAction = "add" | "remove";
export declare abstract class OverlayCapableComponent extends Component {
    instance: JsPlumbInstance;
    defaultLabelLocation: number | [number, number];
    overlays: Dictionary<Overlay>;
    overlayPositions: Dictionary<PointXY>;
    overlayPlacements: Dictionary<{
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
    }>;
    constructor(instance: JsPlumbInstance, params: OverlayComponentOptions);
    addOverlay(overlay: OverlaySpec): Overlay;
    /**
     * Get the Overlay with the given ID. You can optionally provide a type parameter for this method in order to get
     * a typed return value (such as `LabelOverlay`, `ArrowOverlay`, etc), since some overlays have methods that
     * others do not.
     * @param id ID of the overlay to retrieve.
     */
    getOverlay<T extends Overlay>(id: string): T;
    getOverlays(): Dictionary<Overlay>;
    hideOverlay(id: string): void;
    hideOverlays(): void;
    showOverlay(id: string): void;
    showOverlays(): void;
    removeAllOverlays(): void;
    removeOverlay(overlayId: string, dontCleanup?: boolean): void;
    removeOverlays(...overlays: string[]): void;
    getLabel(): string;
    getLabelOverlay(): LabelOverlay;
    setLabel(l: string | Function | LabelOverlay): void;
    destroy(force?: boolean): void;
    setVisible(v: boolean): void;
    setAbsoluteOverlayPosition(overlay: Overlay, xy: PointXY): void;
    getAbsoluteOverlayPosition(overlay: Overlay): PointXY;
    private _clazzManip;
    addClass(clazz: string, dontUpdateOverlays?: boolean): void;
    removeClass(clazz: string, dontUpdateOverlays?: boolean): void;
    applyType(t: any, typeMap: any): void;
}

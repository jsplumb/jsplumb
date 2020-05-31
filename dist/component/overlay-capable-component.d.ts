import { Component, ComponentOptions } from "./component";
import { Overlay, OverlaySpec } from "../overlay/overlay";
import { Dictionary, jsPlumbInstance, PointArray } from "../core";
import { LabelOverlay } from "../overlay/label-overlay";
export interface OverlayComponentOptions<E> extends ComponentOptions<E> {
    label?: string;
    labelLocation?: number;
}
export declare abstract class OverlayCapableComponent<E> extends Component<E> {
    instance: jsPlumbInstance<E>;
    defaultLabelLocation: number | [number, number];
    overlays: Dictionary<Overlay<E>>;
    overlayPositions: Dictionary<PointArray>;
    constructor(instance: jsPlumbInstance<E>, params: OverlayComponentOptions<E>);
    addOverlay(overlay: OverlaySpec, doNotRepaint?: boolean): Overlay<E>;
    getOverlay(id: string): Overlay<E>;
    getOverlays(): Dictionary<Overlay<E>>;
    hideOverlay(id: string): void;
    hideOverlays(): void;
    showOverlay(id: string): void;
    showOverlays(): void;
    removeAllOverlays(doNotRepaint?: boolean): void;
    removeOverlay(overlayId: string, dontCleanup?: boolean): void;
    removeOverlays(...overlays: string[]): void;
    getLabel(): string;
    getLabelOverlay(): LabelOverlay<E>;
    setLabel(l: string | Function | LabelOverlay<E>): void;
    destroy(force?: boolean): void;
    setVisible(v: boolean): void;
    setAbsoluteOverlayPosition(overlay: Overlay<E>, xy: PointArray): void;
    getAbsoluteOverlayPosition(overlay: Overlay<E>): PointArray;
    private _clazzManip;
    addClass(clazz: string, dontUpdateOverlays?: boolean): void;
    removeClass(clazz: string, dontUpdateOverlays?: boolean): void;
    applyType(t: any, doNotRepaint: boolean, typeMap: any): void;
}

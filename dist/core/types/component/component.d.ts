import { Extents, EventGenerator, Merge, PointXY, Dictionary } from "@jsplumb/util";
import { Overlay } from '../overlay/overlay';
import { TypeDescriptor } from '../type-descriptors';
import { JsPlumbInstance } from "../core";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint";
import { LabelOverlay } from "../overlay/label-overlay";
import { OverlaySpec, PaintStyle } from "@jsplumb/common";
export declare type ComponentParameters = Record<string, any>;
export declare function _removeTypeCssHelper<E>(component: Component, typeIndex: number): void;
export declare function _updateHoverStyle<E>(component: Component): void;
export declare type BeforeDetachInterceptor = (c: Connection) => boolean;
export declare type BeforeDropInterceptor = (params: {
    sourceId: string;
    targetId: string;
    scope: string;
    connection: Connection;
    dropEndpoint: Endpoint;
}) => boolean;
export interface ComponentOptions {
    parameters?: Record<string, any>;
    beforeDetach?: BeforeDetachInterceptor;
    beforeDrop?: BeforeDropInterceptor;
    hoverClass?: string;
    events?: Dictionary<(value: any, event: any) => any>;
    scope?: string;
    cssClass?: string;
    data?: any;
    id?: string;
    label?: string;
    labelLocation?: number;
    overlays?: Array<OverlaySpec>;
}
export declare type ClassAction = "add" | "remove";
export declare abstract class Component extends EventGenerator {
    instance: JsPlumbInstance;
    abstract getTypeDescriptor(): string;
    abstract getDefaultOverlayKey(): string;
    abstract getIdPrefix(): string;
    abstract getXY(): PointXY;
    defaultLabelLocation: number | [number, number];
    overlays: Dictionary<Overlay>;
    overlayPositions: Dictionary<PointXY>;
    overlayPlacements: Dictionary<Extents>;
    clone: () => Component;
    deleted: boolean;
    segment: number;
    x: number;
    y: number;
    w: number;
    h: number;
    id: string;
    visible: boolean;
    typeId: string;
    params: Dictionary<any>;
    paintStyle: PaintStyle;
    hoverPaintStyle: PaintStyle;
    paintStyleInUse: PaintStyle;
    _hover: boolean;
    lastPaintedAt: string;
    data: Record<string, any>;
    _defaultType: Merge<TypeDescriptor, {
        overlays: Dictionary<OverlaySpec>;
    }>;
    events: any;
    parameters: ComponentParameters;
    _types: string[];
    _typeCache: {};
    cssClass: string;
    hoverClass: string;
    beforeDetach: BeforeDetachInterceptor;
    beforeDrop: BeforeDropInterceptor;
    protected constructor(instance: JsPlumbInstance, params?: ComponentOptions);
    isDetachAllowed(connection: Connection): boolean;
    isDropAllowed(sourceId: string, targetId: string, scope: string, connection: Connection, dropEndpoint: Endpoint): boolean;
    getDefaultType(): TypeDescriptor;
    appendToDefaultType(obj: Record<string, any>): void;
    getId(): string;
    cacheTypeItem(key: string, item: any, typeId: string): void;
    getCachedTypeItem(key: string, typeId: string): any;
    setType(typeId: string, params?: any): void;
    getType(): string[];
    reapplyTypes(params?: any): void;
    hasType(typeId: string): boolean;
    addType(typeId: string, params?: any): void;
    removeType(typeId: string, params?: any): void;
    clearTypes(params?: any, doNotRepaint?: boolean): void;
    toggleType(typeId: string, params?: any): void;
    applyType(t: any, params?: any): void;
    setPaintStyle(style: PaintStyle): void;
    getPaintStyle(): PaintStyle;
    setHoverPaintStyle(style: PaintStyle): void;
    getHoverPaintStyle(): PaintStyle;
    destroy(): void;
    isHover(): boolean;
    mergeParameters(p: ComponentParameters): void;
    setVisible(v: boolean): void;
    isVisible(): boolean;
    setAbsoluteOverlayPosition(overlay: Overlay, xy: PointXY): void;
    getAbsoluteOverlayPosition(overlay: Overlay): PointXY;
    private _clazzManip;
    addClass(clazz: string, cascade?: boolean): void;
    removeClass(clazz: string, cascade?: boolean): void;
    getClass(): string;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    getData(): Record<string, any>;
    setData(d: any): void;
    mergeData(d: any): void;
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
}

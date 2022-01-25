import { Extents, EventGenerator, PointXY } from "@jsplumb/util";
import { Overlay } from '../overlay/overlay';
import { ComponentTypeDescriptor } from '../type-descriptors';
import { JsPlumbInstance } from "../core";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint";
import { BeforeDropParams } from '../callbacks';
import { LabelOverlay } from "../overlay/label-overlay";
import { OverlaySpec, PaintStyle } from "@jsplumb/common";
export declare type ComponentParameters = Record<string, any>;
export declare function _removeTypeCssHelper<E>(component: Component, typeIndex: number): void;
export declare function _updateHoverStyle<E>(component: Component): void;
/**
 * Defines the method signature for the callback to the `beforeDetach` interceptor. Returning false from this method
 * prevents the connection from being detached. The interceptor is fired by the core, meaning that it will be invoked
 * regardless of whether the detach occurred programmatically, or via the mouse.
 */
export declare type BeforeDetachInterceptor = (c: Connection) => boolean;
/**
 * Defines the method signature for the callback to the `beforeDrop` interceptor.
 * @public
 */
export declare type BeforeDropInterceptor = (params: BeforeDropParams) => boolean;
/**
 * The parameters passed to a `beforeDrag` interceptor.
 * @public
 */
export interface BeforeDragParams<E> {
    endpoint: Endpoint;
    source: E;
    sourceId: string;
    connection: Connection;
}
/**
 * The parameters passed to a `beforeStartDetach` interceptor.
 * @public
 */
export interface BeforeStartDetachParams<E> extends BeforeDragParams<E> {
}
/**
 * Defines the method signature for the callback to the `beforeDrag` interceptor. This method can return boolean `false` to
 * abort the connection drag, or it can return an object containing values that will be used as the `data` for the connection
 * that is created.
 * @public
 */
export declare type BeforeDragInterceptor<E = any> = (params: BeforeDragParams<E>) => boolean | Record<string, any>;
/**
 * Defines the method signature for the callback to the `beforeStartDetach` interceptor.
 * @public
 */
export declare type BeforeStartDetachInterceptor<E = any> = (params: BeforeStartDetachParams<E>) => boolean;
export interface ComponentOptions {
    parameters?: Record<string, any>;
    beforeDetach?: BeforeDetachInterceptor;
    beforeDrop?: BeforeDropInterceptor;
    hoverClass?: string;
    events?: Record<string, (value: any, event: any) => any>;
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
    overlays: Record<string, Overlay>;
    overlayPositions: Record<string, PointXY>;
    overlayPlacements: Record<string, Extents>;
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
    params: Record<string, any>;
    paintStyle: PaintStyle;
    hoverPaintStyle: PaintStyle;
    paintStyleInUse: PaintStyle;
    _hover: boolean;
    lastPaintedAt: string;
    data: Record<string, any>;
    _defaultType: ComponentTypeDescriptor;
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
    getDefaultType(): ComponentTypeDescriptor;
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
    getOverlays(): Record<string, Overlay>;
    hideOverlay(id: string): void;
    /**
     * Hide all overlays, or a specific set of overlays.
     * @param ids optional list of ids to hide.
     */
    hideOverlays(...ids: Array<string>): void;
    /**
     * Show a specific overlay
     * @param id
     */
    showOverlay(id: string): void;
    /**
     * Show all overlays, or a specific set of overlays.
     * @param ids optional list of ids to show.
     */
    showOverlays(...ids: Array<string>): void;
    removeAllOverlays(): void;
    removeOverlay(overlayId: string, dontCleanup?: boolean): void;
    removeOverlays(...overlays: string[]): void;
    getLabel(): string;
    getLabelOverlay(): LabelOverlay;
    setLabel(l: string | Function | LabelOverlay): void;
}
//# sourceMappingURL=component.d.ts.map
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
    /**
     * Returns a space-separated list of the current classes assigned to this component.
     * @public
     */
    getClass(): string;
    /**
     * @internal
     */
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    getData(): Record<string, any>;
    setData(d: any): void;
    mergeData(d: any): void;
    /**
     * Add an overlay to the component.  You must `revalidate` an associated element for this component if you call
     * this method directly. Consider using the `addOverlay` method of `JsPlumbInstance` instead, which adds the overlay
     * and then revalidates.
     * @param overlay
     * @internal
     */
    addOverlay(overlay: OverlaySpec): Overlay;
    /**
     * Get the Overlay with the given ID. You can optionally provide a type parameter for this method in order to get
     * a typed return value (such as `LabelOverlay`, `ArrowOverlay`, etc), since some overlays have methods that
     * others do not.
     * @param id ID of the overlay to retrieve.
     * @public
     */
    getOverlay<T extends Overlay>(id: string): T;
    /**
     * Gets all the overlays registered on this component.
     * @public
     */
    getOverlays(): Record<string, Overlay>;
    /**
     * Hide the overlay with the given id.
     * @param id
     * @public
     */
    hideOverlay(id: string): void;
    /**
     * Hide all overlays, or a specific set of overlays.
     * @param ids optional list of ids to hide.
     * @public
     */
    hideOverlays(...ids: Array<string>): void;
    /**
     * Show a specific overlay (set it to be visible)
     * @param id
     * @public
     */
    showOverlay(id: string): void;
    /**
     * Show all overlays, or a specific set of overlays.
     * @param ids optional list of ids to show.
     * @public
     */
    showOverlays(...ids: Array<string>): void;
    /**
     * Remove all overlays from this component.
     * @public
     */
    removeAllOverlays(): void;
    /**
     * Remove the overlay with the given id.
     * @param overlayId
     * @param dontCleanup This is an internal parameter. You are not encouraged to provide a value for this.
     * @public
     */
    removeOverlay(overlayId: string, dontCleanup?: boolean): void;
    /**
     * Remove the given set of overlays, specified by their ids.
     * @param overlays
     * @public
     */
    removeOverlays(...overlays: string[]): void;
    /**
     * Return this component's label, if one is set.
     * @public
     */
    getLabel(): string;
    /**
     * @internal
     */
    getLabelOverlay(): LabelOverlay;
    /**
     * Set this component's label.
     * @param l Either some text, or a function which returns some text, or an existing label overlay.
     * @public
     */
    setLabel(l: string | Function | LabelOverlay): void;
}
//# sourceMappingURL=component.d.ts.map
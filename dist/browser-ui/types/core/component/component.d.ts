import { Overlay } from '../overlay/overlay';
import { ComponentTypeDescriptor } from '../type-descriptors';
import { JsPlumbInstance } from "../core";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "../endpoint/endpoint";
import { BeforeDropParams } from '../callbacks';
import { LabelOverlay } from "../overlay/label-overlay";
import { OverlaySpec } from "../../common/overlay";
import { EventGenerator } from "../../util/event-generator";
import { Extents, PointXY } from "../../util/util";
import { PaintStyle } from "../../common/paint-style";
export declare type ComponentParameters = Record<string, any>;
export declare function _removeTypeCssHelper<E>(component: Component, typeId: string): void;
export declare function _updateHoverStyle<E>(component: Component): void;
/**
 * Defines the method signature for the callback to the `beforeDetach` interceptor. Returning false from this method
 * prevents the connection from being detached. The interceptor is fired by the core, meaning that it will be invoked
 * regardless of whether the detach occurred programmatically, or via the mouse.
 * @public
 */
export declare type BeforeConnectionDetachInterceptor = (c: Connection) => boolean;
/**
 * Defines the method signature for the callback to the `beforeDrop` interceptor.
 * @public
 */
export declare type BeforeConnectionDropInterceptor = (params: BeforeDropParams) => boolean;
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
export interface BeforeStartConnectionDetachParams<E> extends BeforeDragParams<E> {
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
export declare type BeforeStartConnectionDetachInterceptor<E = any> = (params: BeforeStartConnectionDetachParams<E>) => boolean;
/**
 * @internal
 */
export interface ComponentOptions {
    parameters?: Record<string, any>;
    beforeDetach?: BeforeConnectionDetachInterceptor;
    beforeDrop?: BeforeConnectionDropInterceptor;
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
export declare const ADD_CLASS_ACTION = "add";
export declare const REMOVE_CLASS_ACTION = "remove";
/**
 * @internal
 */
export declare type ClassAction = typeof ADD_CLASS_ACTION | typeof REMOVE_CLASS_ACTION;
/**
 * Base class for Endpoint and Connection.
 * @public
 */
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
    _types: Set<string>;
    _typeCache: {};
    cssClass: string;
    hoverClass: string;
    beforeDetach: BeforeConnectionDetachInterceptor;
    beforeDrop: BeforeConnectionDropInterceptor;
    protected constructor(instance: JsPlumbInstance, params?: ComponentOptions);
    /**
     * Called internally when the user is trying to disconnect the given connection.
     * @internal
     * @param connection
     */
    isDetachAllowed(connection: Connection): boolean;
    /**
     * @internal
     * @param sourceId
     * @param targetId
     * @param scope
     * @param connection
     * @param dropEndpoint
     */
    isDropAllowed(sourceId: string, targetId: string, scope: string, connection: Connection, dropEndpoint: Endpoint): boolean;
    /**
     * @internal
     */
    getDefaultType(): ComponentTypeDescriptor;
    /**
     * @internal
     */
    appendToDefaultType(obj: Record<string, any>): void;
    /**
     * @internal
     */
    getId(): string;
    /**
     * @internal
     */
    cacheTypeItem(key: string, item: any, typeId: string): void;
    /**
     * @internal
     */
    getCachedTypeItem(key: string, typeId: string): any;
    /**
     * @internal
     */
    setType(typeId: string, params?: any): void;
    /**
     * @internal
     */
    getType(): string[];
    /**
     * @internal
     */
    reapplyTypes(params?: any): void;
    /**
     * @internal
     */
    hasType(typeId: string): boolean;
    /**
     * @internal
     */
    addType(typeId: string, params?: any): void;
    /**
     * @internal
     */
    removeType(typeId: string, params?: any): void;
    /**
     * @internal
     */
    clearTypes(params?: any): void;
    /**
     * @internal
     */
    toggleType(typeId: string, params?: any): void;
    /**
     * @internal
     */
    applyType(t: any, params?: any): void;
    /**
     * @internal
     */
    setPaintStyle(style: PaintStyle): void;
    /**
     * @internal
     */
    getPaintStyle(): PaintStyle;
    /**
     * @internal
     */
    setHoverPaintStyle(style: PaintStyle): void;
    /**
     * @internal
     */
    getHoverPaintStyle(): PaintStyle;
    /**
     * @internal
     */
    destroy(): void;
    /**
     * @internal
     */
    isHover(): boolean;
    /**
     * @internal
     */
    mergeParameters(p: ComponentParameters): void;
    /**
     * @internal
     */
    setVisible(v: boolean): void;
    /**
     * @internal
     */
    isVisible(): boolean;
    /**
     * @internal
     */
    setAbsoluteOverlayPosition(overlay: Overlay, xy: PointXY): void;
    /**
     * @internal
     */
    getAbsoluteOverlayPosition(overlay: Overlay): PointXY;
    /**
     * @internal
     */
    private _clazzManip;
    /**
     * Adds a css class to the component
     * @param clazz Class to add. May be a space separated list.
     * @param cascade This is for subclasses to use, if they wish to. For instance, a Connection might want to optionally cascade a css class
     * down to its endpoints.
     * @public
     */
    addClass(clazz: string, cascade?: boolean): void;
    /**
     * Removes a css class from the component
     * @param clazz Class to remove. May be a space separated list.
     * @param cascade This is for subclasses to use, if they wish to. For instance, a Connection might want to optionally cascade a css class
     * removal down to its endpoints.
     * @public
     */
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
    /**
     * Gets any backing data stored against the given component.
     * @public
     */
    getData(): Record<string, any>;
    /**
     * Sets backing data stored against the given component, overwriting any current value.
     * @param d
     * @public
     */
    setData(d: any): void;
    /**
     * Merges the given backing data into any current backing data.
     * @param d
     * @public
     */
    mergeData(d: any): void;
    /**
     * Add an overlay to the component.  This method is not intended for use by users of the API. You must `revalidate`
     * an associated element for this component if you call this method directly. Consider using the `addOverlay` method
     * of `JsPlumbInstance` instead, which adds the overlay and then revalidates.
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
     * @internal
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
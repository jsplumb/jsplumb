/**
 * This package is the core of the jsPlumb Community Edition.
 *
 *
 * @packageDocumentation
 */

import { AbstractSegment } from '@jsplumb/common';
import { AnchorPlacement } from '@jsplumb/common';
import { AnchorSpec } from '@jsplumb/common';
import { ArrowOverlayOptions } from '@jsplumb/common';
import { BlankEndpointParams } from '@jsplumb/common';
import { Connector } from '@jsplumb/common';
import { ConnectorOptions } from '@jsplumb/common';
import { ConnectorSpec } from '@jsplumb/common';
import { Constructable } from '@jsplumb/util';
import { CustomOverlayOptions } from '@jsplumb/common';
import { DotEndpointParams } from '@jsplumb/common';
import { EndpointRepresentationParams } from '@jsplumb/common';
import { EndpointSpec } from '@jsplumb/common';
import { EndpointStyle } from '@jsplumb/common';
import { EventGenerator } from '@jsplumb/util';
import { Extents } from '@jsplumb/util';
import { FullOverlaySpec } from '@jsplumb/common';
import { Geometry } from '@jsplumb/common';
import { LabelOverlayOptions } from '@jsplumb/common';
import { Merge } from '@jsplumb/util';
import { OverlayOptions } from '@jsplumb/common';
import { OverlaySpec } from '@jsplumb/common';
import { PaintAxis } from '@jsplumb/common';
import { PaintStyle } from '@jsplumb/common';
import { PerimeterAnchorShapes } from '@jsplumb/common';
import { PointNearPath } from '@jsplumb/common';
import { PointXY } from '@jsplumb/util';
import { RectangleEndpointParams } from '@jsplumb/common';
import { RotatedPointXY } from '@jsplumb/util';
import { Rotations } from '@jsplumb/util';
import { Segment } from '@jsplumb/common';
import { SegmentParams } from '@jsplumb/common';
import { Size } from '@jsplumb/util';

export declare const ABSOLUTE = "absolute";

/**
 * @internal
 */
export declare abstract class AbstractConnector implements Connector {
    connection: Connection;
    abstract type: string;
    edited: boolean;
    stub: number | number[];
    sourceStub: number;
    targetStub: number;
    maxStub: number;
    typeId: string;
    gap: number;
    sourceGap: number;
    targetGap: number;
    segments: Array<Segment>;
    totalLength: number;
    segmentProportions: Array<[number, number]>;
    segmentProportionalLengths: Array<number>;
    protected paintInfo: PaintGeometry;
    strokeWidth: number;
    x: number;
    y: number;
    w: number;
    h: number;
    segment: number;
    bounds: Extents;
    cssClass: string;
    hoverClass: string;
    abstract getDefaultStubs(): [number, number];
    geometry: Geometry;
    constructor(connection: Connection, params: ConnectorOptions);
    getTypeDescriptor(): string;
    getIdPrefix(): string;
    protected setGeometry(g: Geometry, internal: boolean): void;
    /**
     * Subclasses can override this. By default we just pass back the geometry we are using internally.
     */
    exportGeometry(): Geometry;
    /**
     * Subclasses can override this. By default we just set the given geometry as our internal representation.
     */
    importGeometry(g: Geometry): boolean;
    resetGeometry(): void;
    /**
     *
     * @param g
     * @param dx
     * @param dy
     */
    abstract transformGeometry(g: Geometry, dx: number, dy: number): Geometry;
    /**
     * Helper method for subclasses - AnchorPlacement is a common component of a connector geometry.
     * @internal
     * @param a
     * @param dx
     * @param dy
     */
    protected transformAnchorPlacement(a: AnchorPlacement, dx: number, dy: number): AnchorPlacement;
    abstract _compute(geometry: PaintGeometry, params: ConnectorComputeParams): void;
    resetBounds(): void;
    /**
     * Function: findSegmentForPoint
     * Returns the segment that is closest to the given [x,y],
     * null if nothing found.  This function returns a JS
     * object with:
     *
     *   d   -   distance from segment
     *   l   -   proportional location in segment
     *   x   -   x point on the segment
     *   y   -   y point on the segment
     *   s   -   the segment itself.
     */
    findSegmentForPoint(x: number, y: number): SegmentForPoint;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(box: any): Array<PointXY>;
    _updateSegmentProportions(): void;
    /**
     * returns [segment, proportion of travel in segment, segment index] for the segment
     * that contains the point which is 'location' distance along the entire path, where
     * 'location' is a decimal between 0 and 1 inclusive. in this connector type, paths
     * are made up of a list of segments, each of which contributes some fraction to
     * the total length.
     * From 1.3.10 this also supports the 'absolute' property, which lets us specify a location
     * as the absolute distance in pixels, rather than a proportion of the total path.
     */
    _findSegmentForLocation(location: number, absolute?: boolean): {
        segment: Segment;
        proportion: number;
        index: number;
    };
    _addSegment(clazz: Constructable<Segment>, params: any): void;
    _clearSegments(): void;
    getLength(): number;
    private _prepareCompute;
    updateBounds(segment: Segment): void;
    private dumpSegmentsToConsole;
    pointOnPath(location: number, absolute?: boolean): PointXY;
    gradientAtPoint(location: number, absolute?: boolean): number;
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    compute(params: ConnectorComputeParams): void;
    setAnchorOrientation(idx: number, orientation: number[]): void;
}

export declare interface AbstractSelectOptions<E> {
    scope?: SelectionList;
    source?: ElementSelectionSpecifier<E>;
    target?: ElementSelectionSpecifier<E>;
}

export declare interface AddGroupOptions<E> extends GroupOptions {
    el: E;
    collapsed?: boolean;
}

/**
 * @internal
 */
export declare type AnchorComputeParams = {
    xy?: PointXY;
    wh?: Size;
    txy?: PointXY;
    twh?: Size;
    element?: Endpoint;
    timestamp?: string;
    index?: number;
    tElement?: Endpoint;
    connection?: Connection;
    elementId?: string;
    rotation?: Rotations;
    tRotation?: Rotations;
};

declare type AnchorListEntry = {
    theta: number;
    order: number;
    c: ConnectionFacade;
    b: boolean;
    elId: string;
    epId: string;
};

declare type AnchorLists = {
    top: Array<AnchorListEntry>;
    right: Array<AnchorListEntry>;
    bottom: Array<AnchorListEntry>;
    left: Array<AnchorListEntry>;
};

export declare type AnchorOrientationHint = -1 | 0 | 1;

/**
 * @internal
 */
export declare interface AnchorRecord {
    x: number;
    y: number;
    ox: AnchorOrientationHint;
    oy: AnchorOrientationHint;
    offx: number;
    offy: number;
    iox: AnchorOrientationHint;
    ioy: AnchorOrientationHint;
    cls: string;
}

/**
 * @internal
 */
export declare class ArcSegment extends AbstractSegment {
    static segmentType: string;
    type: string;
    cx: number;
    cy: number;
    radius: number;
    anticlockwise: boolean;
    startAngle: number;
    endAngle: number;
    sweep: number;
    length: number;
    circumference: number;
    frac: number;
    constructor(params: ArcSegmentParams);
    private _calcAngle;
    private _calcAngleForLocation;
    getPath(isFirstSegment: boolean): string;
    getLength(): number;
    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive.
     */
    pointOnPath(location: number, absolute?: boolean): PointXY;
    /**
     * returns the gradient of the segment at the given point.
     */
    gradientAtPoint(location: number, absolute?: boolean): number;
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
}

/**
 * @internal
 */
export declare interface ArcSegmentParams extends SegmentParams {
    cx: number;
    cy: number;
    r: number;
    ac: boolean;
    startAngle?: number;
    endAngle?: number;
}

export declare class ArrowOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    width: number;
    length: number;
    foldback: number;
    direction: number;
    location: number;
    paintStyle: PaintStyle;
    static type: string;
    type: string;
    cachedDimensions: Size;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
    draw(component: Component, currentConnectionPaintStyle: PaintStyle, absolutePosition?: PointXY): any;
    updateFrom(d: any): void;
}

export declare function att(...attName: Array<string>): string;

export declare const ATTRIBUTE_GROUP = "data-jtk-group";

export declare const ATTRIBUTE_MANAGED = "data-jtk-managed";

export declare const ATTRIBUTE_NOT_DRAGGABLE = "data-jtk-not-draggable";

export declare const ATTRIBUTE_SCOPE = "data-jtk-scope";

export declare const ATTRIBUTE_SCOPE_PREFIX: string;

export declare const ATTRIBUTE_TABINDEX = "tabindex";

export declare type Axis = [Face, Face];

/**
 * Defines the method signature for the callback to the `beforeDetach` interceptor. Returning false from this method
 * prevents the connection from being detached. The interceptor is fired by the core, meaning that it will be invoked
 * regardless of whether the detach occurred programmatically, or via the mouse.
 */
export declare type BeforeDetachInterceptor = (c: Connection) => boolean;

/**
 * Defines the method signature for the callback to the `beforeDrag` interceptor. This method can return boolean `false` to
 * abort the connection drag, or it can return an object containing values that will be used as the `data` for the connection
 * that is created.
 * @public
 */
export declare type BeforeDragInterceptor<E = any> = (params: BeforeDragParams<E>) => boolean | Record<string, any>;

/**
 * The parameters passed to a `beforeDrag` interceptor.
 * @public
 */
export declare interface BeforeDragParams<E> {
    endpoint: Endpoint;
    source: E;
    sourceId: string;
    connection: Connection;
}

/**
 * Defines the method signature for the callback to the `beforeDrop` interceptor.
 * @public
 */
export declare type BeforeDropInterceptor = (params: BeforeDropParams) => boolean;

/**
 * Definition of the parameters passed to the `beforeDrop` interceptor.
 * @public
 */
export declare interface BeforeDropParams {
    sourceId: string;
    targetId: string;
    scope: string;
    connection: Connection;
    dropEndpoint: Endpoint;
}

/**
 * Defines the method signature for the callback to the `beforeStartDetach` interceptor.
 * @public
 */
export declare type BeforeStartDetachInterceptor<E = any> = (params: BeforeStartDetachParams<E>) => boolean;

/**
 * The parameters passed to a `beforeStartDetach` interceptor.
 * @public
 */
export declare interface BeforeStartDetachParams<E> extends BeforeDragParams<E> {
}

/**
 * Extends EndpointTypeDescriptor to add the options supported by an `addSourceSelector` or `addTargetSelector` call.
 * @public
 */
export declare interface BehaviouralTypeDescriptor<T = any> extends EndpointTypeDescriptor {
    /**
     * A function that can be used to extract a set of parameters pertinent to the connection that is being dragged
     * from a given source.
     * @param el - The element that is the drag source
     * @param eventTarget - The element that captured the event that started the connection drag.
     */
    parameterExtractor?: (el: T, eventTarget: T) => Record<string, string>;
    redrop?: RedropPolicy;
    extract?: Record<string, string>;
    uniqueEndpoint?: boolean;
    /**
     * Optional function to call if the user begins a new connection drag when the associated element is full.
     * @param value
     * @param event
     */
    onMaxConnections?: (value: any, event?: any) => any;
    edgeType?: string;
    portId?: string;
    /**
     * Defaults to true. If false, the user will not be permitted to drag a connection from the current node to itself.
     */
    allowLoopback?: boolean;
    rank?: number;
    /**
     * Optional selector identifying the ancestor of the event target that could be the element to which connections
     * are added. By default this is the internal attribute jsPlumb uses to mark managed elements (data-jtk-managed)
     */
    parentSelector?: string;
}

export declare class BlankEndpoint extends EndpointRepresentation<ComputedBlankEndpoint> {
    constructor(endpoint: Endpoint, params?: BlankEndpointParams);
    static type: string;
    type: string;
}

export declare const BlankEndpointHandler: EndpointHandler<BlankEndpoint, ComputedBlankEndpoint>;

export declare const BLOCK = "block";

export declare const BOTTOM = FaceValues.bottom;

export declare const CHECK_CONDITION = "checkCondition";

export declare const CHECK_DROP_ALLOWED = "checkDropAllowed";

export declare const CLASS_CONNECTED = "jtk-connected";

export declare const CLASS_CONNECTOR = "jtk-connector";

export declare const CLASS_CONNECTOR_OUTLINE = "jtk-connector-outline";

export declare const CLASS_ENDPOINT = "jtk-endpoint";

export declare const CLASS_ENDPOINT_ANCHOR_PREFIX = "jtk-endpoint-anchor";

export declare const CLASS_ENDPOINT_CONNECTED = "jtk-endpoint-connected";

export declare const CLASS_ENDPOINT_DROP_ALLOWED = "jtk-endpoint-drop-allowed";

export declare const CLASS_ENDPOINT_DROP_FORBIDDEN = "jtk-endpoint-drop-forbidden";

export declare const CLASS_ENDPOINT_FULL = "jtk-endpoint-full";

export declare const CLASS_GROUP_COLLAPSED = "jtk-group-collapsed";

export declare const CLASS_GROUP_EXPANDED = "jtk-group-expanded";

export declare const CLASS_OVERLAY = "jtk-overlay";

export declare type ClassAction = "add" | "remove";

export declare function classList(...className: Array<string>): string;

export declare function cls(...className: Array<string>): string;

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

export declare interface ComponentOptions {
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

export declare type ComponentParameters = Record<string, any>;

/**
 * Base interface for type descriptors for internal methods.
 * @internal
 */
export declare interface ComponentTypeDescriptor extends TypeDescriptorBase {
    overlays: Record<string, OverlaySpec>;
}

export declare type ComputedBlankEndpoint = [number, number, number, number];

export declare type ComputedDotEndpoint = [number, number, number, number, number];

/**
 * @internal
 */
export declare interface ComputedPosition {
    curX: number;
    curY: number;
    ox: number;
    oy: number;
    x: number;
    y: number;
}

export declare type ComputedRectangleEndpoint = [number, number, number, number];

/**
 * @public
 */
export declare class Connection<E = any> extends Component {
    instance: JsPlumbInstance;
    connector: AbstractConnector;
    defaultLabelLocation: number;
    scope: string;
    typeId: string;
    getIdPrefix(): string;
    getDefaultOverlayKey(): string;
    getXY(): {
        x: number;
        y: number;
    };
    previousConnection: Connection;
    /**
     * The id of the source of the connection
     * @public
     */
    sourceId: string;
    /**
     * The id of the target of the connection
     * @public
     */
    targetId: string;
    /**
     * The element that is the source of the connection
     * @public
     */
    source: E;
    /**
     * The element that is the target of the connection
     * @public
     */
    target: E;
    /**
     * Whether or not this connection is detachable
     * @public
     */
    detachable: boolean;
    /**
     * Whether or not this connection should be reattached if it were detached via the mouse
     * @public
     */
    reattach: boolean;
    /**
     * UUIDs of the endpoints. If this is not specifically provided in the constructor of the connection it will
     * be null.
     * @public
     */
    readonly uuids: [string, string];
    /**
     * Connection's cost.
     * @public
     */
    cost: number;
    /**
     * Whether or not the connection is directed.
     * @public
     */
    directed: boolean;
    /**
     * Source and target endpoints.
     * @public
     */
    endpoints: [Endpoint<E>, Endpoint<E>];
    endpointStyles: [PaintStyle, PaintStyle];
    readonly endpointSpec: EndpointSpec;
    readonly endpointsSpec: [EndpointSpec, EndpointSpec];
    endpointStyle: PaintStyle;
    endpointHoverStyle: PaintStyle;
    readonly endpointHoverStyles: [PaintStyle, PaintStyle];
    /**
     * @internal
     */
    suspendedEndpoint: Endpoint<E>;
    /**
     * @internal
     */
    suspendedIndex: number;
    /**
     * @internal
     */
    suspendedElement: E;
    /**
     * @internal
     */
    suspendedElementId: string;
    /**
     * @internal
     */
    suspendedElementType: string;
    /**
     * @internal
     */
    _forceReattach: boolean;
    /**
     * @internal
     */
    _forceDetach: boolean;
    /**
     * List of current proxies for this connection. Used when collapsing groups and when dealing with scrolling lists.
     * @internal
     */
    proxies: Array<{
        ep: Endpoint<E>;
        originalEp: Endpoint<E>;
    }>;
    /**
     * @internal
     */
    pending: boolean;
    /**
     * Connections should never be constructed directly by users of the library.
     * @internal
     * @param instance
     * @param params
     */
    constructor(instance: JsPlumbInstance, params: ConnectionOptions<E>);
    makeEndpoint(isSource: boolean, el: any, elId: string, anchor?: AnchorSpec, ep?: Endpoint): Endpoint;
    static type: string;
    getTypeDescriptor(): string;
    isDetachable(ep?: Endpoint): boolean;
    setDetachable(detachable: boolean): void;
    isReattach(): boolean;
    setReattach(reattach: boolean): void;
    applyType(t: ConnectionTypeDescriptor, typeMap: any): void;
    /**
     * Adds the given class to the UI elements being used to represent this connection's connector, and optionally to
     * the UI elements representing the connection's endpoints.
     * @param c class to add
     * @param cascade If true, also add the class to the connection's endpoints.
     * @public
     */
    addClass(c: string, cascade?: boolean): void;
    /**
     * Removes the given class from the UI elements being used to represent this connection's connector, and optionally from
     * the UI elements representing the connection's endpoints.
     * @param c class to remove
     * @param cascade If true, also remove the class from the connection's endpoints.
     * @public
     */
    removeClass(c: string, cascade?: boolean): void;
    /**
     * Sets the visible state of the connection.
     * @param v
     * @public
     */
    setVisible(v: boolean): void;
    /**
     * @internal
     */
    destroy(): void;
    getUuids(): [string, string];
    /**
     * @internal
     */
    prepareConnector(connectorSpec: ConnectorSpec, typeId?: string): AbstractConnector;
    /**
     * @internal
     */
    setPreparedConnector(connector: AbstractConnector, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
    setConnector(connectorSpec: ConnectorSpec, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
    /**
     * Replace the Endpoint at the given index with a new Endpoint.  This is used by the Toolkit edition, if changes to an edge type
     * cause a change in Endpoint.
     * @param idx 0 for source, 1 for target
     * @param endpointDef Spec for the new Endpoint.
     * @public
     */
    replaceEndpoint(idx: number, endpointDef: EndpointSpec): void;
}

/**
 * Definition of the parameters passed to a listener for the `connection:detach` event.
 * @public
 */
export declare interface ConnectionDetachedParams<E = any> extends ConnectionEstablishedParams<E> {
}

export declare class ConnectionDragSelector {
    selector: string;
    protected def: SourceOrTargetDefinition;
    exclude: boolean;
    constructor(selector: string, def: SourceOrTargetDefinition, exclude?: boolean);
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
}

/**
 * Definition of the parameters passed to a listener for the `connection` event.
 * @public
 */
export declare interface ConnectionEstablishedParams<E = any> {
    connection: Connection<E>;
    source: E;
    sourceEndpoint: Endpoint<E>;
    sourceId: string;
    target: E;
    targetEndpoint: Endpoint<E>;
    targetId: string;
}

declare interface ConnectionFacade {
    endpoints: [Endpoint, Endpoint];
    placeholder?: boolean;
}

/**
 * Definition of the parameters passed to a listener for the `connection:move` event.
 * @public
 */
export declare interface ConnectionMovedParams<E = any> {
    connection: Connection<E>;
    index: number;
    originalSourceId: string;
    newSourceId: string;
    originalTargetId: string;
    newTargetId: string;
    originalEndpoint: Endpoint<E>;
    newEndpoint: Endpoint<E>;
}

/**
 * @internal
 */
export declare type ConnectionOptions<E = any> = Merge<ConnectParams<E>, {
    source?: E;
    target?: E;
    sourceEndpoint?: Endpoint;
    targetEndpoint?: Endpoint;
    previousConnection?: Connection<E>;
    geometry?: any;
}>;

export declare class ConnectionSelection extends SelectionBase<Connection> {
    setDetachable(d: boolean): ConnectionSelection;
    setReattach(d: boolean): ConnectionSelection;
    setConnector(spec: ConnectorSpec): ConnectionSelection;
    deleteAll(): void;
    repaint(): ConnectionSelection;
}

/**
 * Definition of a connection type.
 * @public
 */
export declare interface ConnectionTypeDescriptor extends TypeDescriptor {
    detachable?: boolean;
    reattach?: boolean;
    endpoints?: [EndpointSpec, EndpointSpec];
}

export declare type ConnectorComputeParams = {
    sourcePos: AnchorPlacement;
    targetPos: AnchorPlacement;
    sourceEndpoint: Endpoint;
    targetEndpoint: Endpoint;
    strokeWidth: number;
    sourceInfo: ViewportElement<any>;
    targetInfo: ViewportElement<any>;
};

export declare const Connectors: {
    get: (connection: Connection<any>, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};

/**
 * Options for the `connect` call on a JsPlumbInstance
 */
export declare interface ConnectParams<E> {
    /**
     * Optional UUIDs to assign to the source and target endpoints.
     */
    uuids?: [UUID, UUID];
    /**
     * Source for the connection - an Endpoint, or an element
     */
    source?: Element | Endpoint;
    /**
     * Source for the connection - an Endpoint, or an element
     */
    target?: Element | Endpoint;
    /**
     * Whether or not the connection is detachable. Defaults to true.
     */
    detachable?: boolean;
    /**
     * Whether or not to delete the connection's endpoints when this connection is detached. Defaults to false. Does not
     * delete endpoints if they have other connections.
     */
    deleteEndpointsOnDetach?: boolean;
    /**
     * Whether or not to delete any endpoints that were created by this connect call if at some
     * point in the future the endpoint has no remaining connections. Defaults to false.
     */
    deleteEndpointsOnEmpty?: boolean;
    /**
     * Whether or not to reattach this connection automatically should it be detached via user intervention. Defaults to false.
     */
    reattach?: boolean;
    /**
     * Spec for the endpoint to use for both source and target endpoints.
     */
    endpoint?: EndpointSpec;
    /**
     * Individual endpoint specs for the source/target endpoints.
     */
    endpoints?: [EndpointSpec, EndpointSpec];
    /**
     * Spec for the anchor to use for both source and target endpoints.
     */
    anchor?: AnchorSpec;
    /**
     * Individual anchor specs for the source/target endpoints.
     */
    anchors?: [AnchorSpec, AnchorSpec];
    /**
     * Optional label to set on the connection. In the default browser UI implementation this is rendered as a `label` attribute on the SVG element representing the connection.
     */
    label?: string;
    /**
     * Spec for the connector used to paint the connection.
     */
    connector?: ConnectorSpec;
    /**
     * Optional list of overlays to attach to the connection.
     */
    overlays?: Array<OverlaySpec>;
    /**
     * Spec for the styles to use on both source and target endpoints
     */
    endpointStyle?: EndpointStyle;
    /**
     * Individual specs for the source/target endpoint styles.
     */
    endpointStyles?: [EndpointStyle, EndpointStyle];
    /**
     * Spec for the styles to use on both source and target endpoints when they are in hover state
     */
    endpointHoverStyle?: EndpointStyle;
    /**
     * Individual specs for the source/target endpoint styles when they are in hover state.
     */
    endpointHoverStyles?: [EndpointStyle, EndpointStyle];
    /**
     * Optional port IDs for the source and target endpoints
     */
    ports?: [string, string];
    /**
     * Type of the connection. Used in conjunction with the `registerConnectionType` method.
     */
    type?: string;
    /**
     * Paint style for the connector.
     */
    paintStyle?: PaintStyle;
    /**
     * Paint style for the connector when in hover mode.
     */
    hoverPaintStyle?: PaintStyle;
    /**
     * Whether or not the connection is considered to be 'directed'
     */
    directed?: boolean;
    /**
     * Cost of the connection. Defaults to 1.
     */
    cost?: number;
    id?: string;
    data?: any;
    cssClass?: string;
    hoverClass?: string;
    outlineStroke?: number;
    outlineWidth?: number;
    scope?: string;
}

/**
 * Convert the given input into an object in the form of a `FullOverlaySpec`
 * @param spec
 */
export declare function convertToFullOverlaySpec(spec: string | OverlaySpec): FullOverlaySpec;

export declare function createFloatingAnchor(instance: JsPlumbInstance, element: any): LightweightFloatingAnchor;

export declare function _createPerimeterAnchor(params: Record<string, any>): LightweightPerimeterAnchor;

export declare class CustomOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    create: (c: Component) => any;
    constructor(instance: JsPlumbInstance, component: Component, p: CustomOverlayOptions);
    static type: string;
    type: string;
    updateFrom(d: any): void;
}

/**
 * Optional parameters to the `DeleteConnection` method.
 */
export declare type DeleteConnectionOptions = {
    /**
     * if true, force deletion even if the connection tries to cancel the deletion.
     */
    force?: boolean;
    /**
     * If false, an event won't be fired. Otherwise a `connection:detach` event will be fired.
     */
    fireEvent?: boolean;
    /**
     * Optional original event that resulted in the connection being deleted.
     */
    originalEvent?: Event;
    /**
     * internally when a connection is deleted, it may be because the endpoint it was on is being deleted.
     * in that case we want to ignore that endpoint.
     */
    endpointToIgnore?: Endpoint;
};

export declare class DiamondOverlay extends ArrowOverlay {
    instance: JsPlumbInstance;
    static type: string;
    type: string;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
}

export declare class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {
    radius: number;
    defaultOffset: number;
    defaultInnerRadius: number;
    constructor(endpoint: Endpoint, params?: DotEndpointParams);
    static type: string;
    type: string;
}

export declare const DotEndpointHandler: EndpointHandler<DotEndpoint, ComputedDotEndpoint>;

export declare type ElementSelectionSpecifier<E> = E | Array<E> | '*';

export declare class Endpoint<E = any> extends Component {
    instance: JsPlumbInstance;
    getIdPrefix(): string;
    getTypeDescriptor(): string;
    getXY(): {
        x: number;
        y: number;
    };
    connections: Array<Connection<E>>;
    endpoint: EndpointRepresentation<any>;
    element: E;
    elementId: string;
    dragAllowedWhenFull: boolean;
    timestamp: string;
    portId: string;
    maxConnections: number;
    proxiedBy: Endpoint<E>;
    connectorClass: string;
    connectorHoverClass: string;
    finalEndpoint: Endpoint<E>;
    enabled: boolean;
    isSource: boolean;
    isTarget: boolean;
    isTemporarySource: boolean;
    connectionCost: number;
    connectionsDirected: boolean;
    connectionsDetachable: boolean;
    reattachConnections: boolean;
    currentAnchorClass: string;
    referenceEndpoint: Endpoint<E>;
    edgeType: string;
    connector: ConnectorSpec;
    connectorOverlays: Array<OverlaySpec>;
    connectorStyle: PaintStyle;
    connectorHoverStyle: PaintStyle;
    deleteOnEmpty: boolean;
    uuid: string;
    scope: string;
    _anchor: LightweightAnchor;
    defaultLabelLocation: [number, number];
    getDefaultOverlayKey(): string;
    constructor(instance: JsPlumbInstance, params: InternalEndpointOptions<E>);
    private _updateAnchorClass;
    private setPreparedAnchor;
    /**
     * Called by the router when a dynamic anchor has changed its current location.
     * @param currentAnchor
     */
    _anchorLocationChanged(currentAnchor: LightweightAnchor): void;
    setAnchor(anchorParams: AnchorSpec | Array<AnchorSpec>): Endpoint;
    addConnection(conn: Connection): void;
    /**
     * Detaches this Endpoint from the given Connection.  If `deleteOnEmpty` is set to true and there are no
     * Connections after this one is detached, the Endpoint is deleted.
     * @param connection Connection from which to detach.
     * @param idx Optional, used internally to identify if this is the source (0) or target endpoint (1). Sometimes we already know this when we call this method.
     * @param transientDetach For internal use only.
     */
    detachFromConnection(connection: Connection, idx?: number, transientDetach?: boolean): void;
    /**
     * Delete every connection in the instance.
     * @param params
     */
    deleteEveryConnection(params?: DeleteConnectionOptions): void;
    /**
     * Removes all connections from this endpoint to the given other endpoint.
     * @param otherEndpoint
     */
    detachFrom(otherEndpoint: Endpoint): Endpoint;
    setVisible(v: boolean, doNotChangeConnections?: boolean, doNotNotifyOtherEndpoint?: boolean): void;
    applyType(t: any, typeMap: any): void;
    destroy(): void;
    isFull(): boolean;
    isFloating(): boolean;
    /**
     * Test if this Endpoint is connected to the given Endpoint.
     * @param otherEndpoint
     */
    isConnectedTo(otherEndpoint: Endpoint): boolean;
    setDragAllowedWhenFull(allowed: boolean): void;
    getUuid(): string;
    connectorSelector(): Connection;
    private prepareEndpoint;
    setEndpoint<C>(ep: EndpointSpec | EndpointRepresentation<C>): void;
    private setPreparedEndpoint;
    addClass(clazz: string, cascade?: boolean): void;
    removeClass(clazz: string, cascade?: boolean): void;
}

export declare type EndpointComputeFunction<T> = (endpoint: EndpointRepresentation<T>, anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any) => T;

export declare const EndpointFactory: {
    get: (ep: Endpoint<any>, name: string, params: any) => EndpointRepresentation<any>;
    clone: <C>(epr: EndpointRepresentation<C>) => EndpointRepresentation<C>;
    compute: <T>(endpoint: EndpointRepresentation<T>, anchorPoint: AnchorPlacement, orientation: [number, number], endpointStyle: any) => T;
    registerHandler: <E, T>(eph: EndpointHandler<E, T>) => void;
};

export declare interface EndpointHandler<E, T> {
    type: string;
    compute: EndpointComputeFunction<T>;
    getParams(endpoint: E): Record<string, any>;
    cls: Constructable<EndpointRepresentation<T>>;
}

export declare interface EndpointOptions<E = any> {
    parameters?: Record<string, any>;
    scope?: string;
    cssClass?: string;
    data?: any;
    hoverClass?: string;
    /**
     * Optional definition for both the source and target anchors for any connection created with this endpoint as its source.
     * If you do not supply this, the default `anchors` definition for the jsPlumb instance will be used
     */
    anchor?: AnchorSpec;
    /**
     * Optional definition for the source and target anchors for any connection created with this endpoint as its source.
     * If you do not supply this, the default `anchors` definition for the jsPlumb instance will be used
     */
    anchors?: [AnchorSpec, AnchorSpec];
    /**
     * Optional endpoint definition. If you do not supply this, the default endpoint definition for the jsPlumb instance will be used
     */
    endpoint?: EndpointSpec;
    /**
     * Whether or not the endpoint is initially enabled. Defaults to true.
     */
    enabled?: boolean;
    /**
     * Optional paint style to assign to the endpoint
     */
    paintStyle?: PaintStyle;
    /**
     * Optional paint style to assign, on hover, to the endpoint.
     */
    hoverPaintStyle?: PaintStyle;
    /**
     * Maximum number of connections this endpoint supports. Defaults to 1. Use a value of -1 to indicate there is no limit.
     */
    maxConnections?: number;
    /**
     * Optional paint style to assign to a connection that is created with this endpoint as its source.
     */
    connectorStyle?: PaintStyle;
    /**
     * Optional paint style to assign, on hover, to a connection that is created with this endpoint as its source.
     */
    connectorHoverStyle?: PaintStyle;
    /**
     * Optional connector definition for connections that are created with this endpoint as their source.
     */
    connector?: ConnectorSpec;
    /**
     * Optional list of overlays to add to a connection that is created with this endpoint as its source.
     */
    connectorOverlays?: Array<OverlaySpec>;
    /**
     * Optional class to assign to connections that have this endpoint as their source.
     */
    connectorClass?: string;
    /**
     * Optional class to assign, on mouse hover,  to connections that have this endpoint as their source.
     */
    connectorHoverClass?: string;
    /**
     * Whether or not connections that have this endpoint as their source are configured to be detachable with the mouse. Defaults to true.
     */
    connectionsDetachable?: boolean;
    /**
     * Whether or not this Endpoint acts as a source for connections dragged with the mouse. Defaults to false.
     */
    source?: boolean;
    /**
     * Whether or not this Endpoint acts as a target for connections dragged with the mouse. Defaults to false.
     */
    target?: boolean;
    /**
     * Optional 'type' for connections that have this endpoint as their source.
     */
    edgeType?: string;
    /**
     * Whether or not to set `reattach:true` on connections that have this endpoint as their source. Defaults to false.
     */
    reattachConnections?: boolean;
    /**
     * Optional "port id" for this endpoint - a logical mapping of the endpoint to some name.
     */
    portId?: string;
    /**
     * Optional user-supplied ID for this endpoint.
     */
    uuid?: string;
    /**
     * Whether or not connections can be dragged from the endpoint when it is full. Since no new connection could be dragged from an endpoint that is
     * full, in a practical sense this means whether or not existing connections can be dragged off an endpoint that is full. Defaults to true.
     */
    dragAllowedWhenFull?: boolean;
    /**
     * Optional callback to fire when the endpoint transitions to the state that it is now full.
     * @param value
     * @param event
     */
    onMaxConnections?: (value: any, event?: any) => any;
    /**
     * Optional cost to set for connections that have this endpoint as their source. Defaults to 1.
     */
    connectionCost?: number;
    /**
     * Whether or not connections that have this endpoint as their source are considered "directed".
     */
    connectionsDirected?: boolean;
    /**
     * Whether or not to delete the Endpoint if it transitions to the state that it has no connections. Defaults to false. Note that this only
     * applies if the endpoint previously had one or more connections and now has none: a newly created endpoint with this flag set is not
     * immediately deleted.
     */
    deleteOnEmpty?: boolean;
}

/**
 * Superclass for all types of Endpoint. This class is renderer
 * agnostic, as are any subclasses of it.
 */
export declare abstract class EndpointRepresentation<C> {
    endpoint: Endpoint;
    typeId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    computedValue: C;
    bounds: Extents;
    classes: Array<string>;
    instance: JsPlumbInstance;
    abstract type: string;
    protected constructor(endpoint: Endpoint, params?: EndpointRepresentationParams);
    addClass(c: string): void;
    removeClass(c: string): void;
    compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): void;
    setVisible(v: boolean): void;
}

export declare class EndpointSelection extends SelectionBase<Endpoint> {
    setEnabled(e: boolean): EndpointSelection;
    setAnchor(a: AnchorSpec): EndpointSelection;
    deleteEveryConnection(): EndpointSelection;
    deleteAll(): EndpointSelection;
}

/**
 * Definition of an endpoint type.
 * @public
 */
export declare interface EndpointTypeDescriptor extends TypeDescriptor {
    connectionsDetachable?: boolean;
    reattachConnections?: boolean;
    maxConnections?: number;
}

export declare const ERROR_SOURCE_DOES_NOT_EXIST = "Cannot establish connection: source does not exist";

export declare const ERROR_SOURCE_ENDPOINT_FULL = "Cannot establish connection: source endpoint is full";

export declare const ERROR_TARGET_DOES_NOT_EXIST = "Cannot establish connection: target does not exist";

export declare const ERROR_TARGET_ENDPOINT_FULL = "Cannot establish connection: target endpoint is full";

export declare const EVENT_ANCHOR_CHANGED = "anchor:changed";

export declare const EVENT_CONNECTION = "connection";

export declare const EVENT_CONNECTION_DETACHED = "connection:detach";

export declare const EVENT_CONNECTION_MOVED = "connection:move";

export declare const EVENT_CONTAINER_CHANGE = "container:change";

export declare const EVENT_ENDPOINT_REPLACED = "endpoint:replaced";

export declare const EVENT_GROUP_ADDED = "group:added";

export declare const EVENT_GROUP_COLLAPSE = "group:collapse";

export declare const EVENT_GROUP_EXPAND = "group:expand";

export declare const EVENT_GROUP_MEMBER_ADDED = "group:member:added";

export declare const EVENT_GROUP_MEMBER_REMOVED = "group:member:removed";

export declare const EVENT_GROUP_REMOVED = "group:removed";

export declare const EVENT_INTERNAL_CONNECTION = "internal.connection";

export declare const EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connection:detached";

export declare const EVENT_INTERNAL_ENDPOINT_UNREGISTERED = "internal.endpoint:unregistered";

export declare const EVENT_MANAGE_ELEMENT = "element:manage";

export declare const EVENT_MAX_CONNECTIONS = "maxConnections";

export declare const EVENT_NESTED_GROUP_ADDED = "group:nested:added";

export declare const EVENT_NESTED_GROUP_REMOVED = "group:nested:removed";

export declare const EVENT_UNMANAGE_ELEMENT = "element:unmanage";

export declare const EVENT_ZOOM = "zoom";

export declare type Face = keyof typeof FaceValues;

declare enum FaceValues {
    top = "top",
    left = "left",
    right = "right",
    bottom = "bottom"
}

export declare const FIXED = "fixed";

/**
 *
 * @param a
 * @internal
 */
export declare function getDefaultFace(a: LightweightContinuousAnchor): Face;

export declare interface GroupCollapsedParams<E> {
    group: UIGroup<E>;
}

export declare interface GroupExpandedParams<E> {
    group: UIGroup<E>;
}

export declare class GroupManager<E> {
    instance: JsPlumbInstance;
    groupMap: Record<string, UIGroup<E>>;
    _connectionSourceMap: Record<string, UIGroup<E>>;
    _connectionTargetMap: Record<string, UIGroup<E>>;
    constructor(instance: JsPlumbInstance);
    private _cleanupDetachedConnection;
    addGroup(params: AddGroupOptions<E>): UIGroup<E>;
    getGroup(groupId: string | UIGroup<E>): UIGroup<E>;
    getGroupFor(el: E): UIGroup<E>;
    getGroups(): Array<UIGroup<E>>;
    removeGroup(group: string | UIGroup<E>, deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): Record<string, PointXY>;
    removeAllGroups(deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): void;
    forEach(f: (g: UIGroup<E>) => any): void;
    orphan(el: E, doNotTransferToAncestor: boolean): {
        id: string;
        pos: PointXY;
    };
    _updateConnectionsForGroup(group: UIGroup<E>): void;
    private _collapseConnection;
    private _expandConnection;
    private isElementDescendant;
    collapseGroup(group: string | UIGroup<E>): void;
    /**
     * Cascade a collapse from the given `collapsedGroup` into the given `targetGroup`.
     * @param collapsedGroup
     * @param targetGroup
     * @param collapsedIds Set of connection ids for already collapsed connections, which we can ignore.
     */
    cascadeCollapse(collapsedGroup: UIGroup<E>, targetGroup: UIGroup<E>, collapsedIds: Set<string>): void;
    expandGroup(group: string | UIGroup<E>, doNotFireEvent?: boolean): void;
    toggleGroup(group: string | UIGroup<E>): void;
    repaintGroup(group: string | UIGroup<E>): void;
    addToGroup(group: string | UIGroup<E>, doNotFireEvent: boolean, ...el: Array<E>): void;
    removeFromGroup(group: string | UIGroup<E>, doNotFireEvent: boolean, ...el: Array<E>): void;
    getAncestors(group: UIGroup<E>): Array<UIGroup<E>>;
    /**
     * Tests if `possibleAncestor` is in fact an ancestor of `group`
     * @param group
     * @param possibleAncestor
     */
    isAncestor(group: UIGroup<E>, possibleAncestor: UIGroup<E>): boolean;
    getDescendants(group: UIGroup<E>): Array<UIGroup<E>>;
    isDescendant(possibleDescendant: UIGroup<E>, ancestor: UIGroup<E>): boolean;
    reset(): void;
}

export declare interface GroupOptions {
    id?: string;
    droppable?: boolean;
    enabled?: boolean;
    orphan?: boolean;
    constrain?: boolean;
    proxied?: boolean;
    ghost?: boolean;
    revert?: boolean;
    prune?: boolean;
    dropOverride?: boolean;
    anchor?: AnchorSpec;
    endpoint?: EndpointSpec;
}

export declare const INTERCEPT_BEFORE_DETACH = "beforeDetach";

export declare const INTERCEPT_BEFORE_DRAG = "beforeDrag";

export declare const INTERCEPT_BEFORE_DROP = "beforeDrop";

export declare const INTERCEPT_BEFORE_START_DETACH = "beforeStartDetach";

/**
 * Internal extension of ConnectParams containing a few extra things needed to establish a connection.
 */
export declare interface InternalConnectParams<E> extends ConnectParams<E> {
    sourceEndpoint?: Endpoint<E>;
    targetEndpoint?: Endpoint<E>;
    scope?: string;
    type?: string;
    newConnection?: (p: any) => Connection;
    id?: string;
}

export declare interface InternalEndpointOptions<E> extends EndpointOptions<E> {
    isTemporarySource?: boolean;
    elementId?: string;
    _transient?: boolean;
    type?: string;
    id?: string;
    preparedAnchor?: LightweightAnchor;
    connections?: Array<Connection>;
    element?: E;
    existingEndpoint?: EndpointRepresentation<E>;
}

export declare const IS_DETACH_ALLOWED = "isDetachAllowed";

export declare function isArrowOverlay(o: Overlay): o is ArrowOverlay;

export declare function isContinuous(a: LightweightAnchor): a is LightweightContinuousAnchor;

export declare function isCustomOverlay(o: Overlay): o is CustomOverlay;

export declare function isDiamondOverlay(o: Overlay): o is DiamondOverlay;

export declare function isDynamic(a: LightweightAnchor): boolean;

/**
 *
 * @param a
 * @param edge
 * @internal
 */
export declare function isEdgeSupported(a: LightweightContinuousAnchor, edge: Face): boolean;

export declare function isFloating(a: LightweightAnchor): a is LightweightFloatingAnchor;

/**
 * Returns whether or not the given overlay spec is a 'full' overlay spec, ie. has a `type` and some `options`, or is just an overlay name.
 * @param o
 */
export declare function isFullOverlaySpec(o: OverlaySpec): o is FullOverlaySpec;

export declare function isLabelOverlay(o: Overlay): o is LabelOverlay;

export declare function isPlainArrowOverlay(o: Overlay): o is PlainArrowOverlay;

export declare interface JsPlumbDefaults<E> {
    endpoint?: EndpointSpec;
    endpoints?: [EndpointSpec, EndpointSpec];
    anchor?: AnchorSpec;
    anchors?: [AnchorSpec, AnchorSpec];
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    endpointStyle?: EndpointStyle;
    endpointHoverStyle?: EndpointStyle;
    endpointStyles?: [EndpointStyle, EndpointStyle];
    endpointHoverStyles?: [EndpointStyle, EndpointStyle];
    connectionsDetachable?: boolean;
    reattachConnections?: boolean;
    endpointOverlays?: Array<OverlaySpec>;
    connectionOverlays?: Array<OverlaySpec>;
    listStyle?: ListSpec;
    container?: E;
    connector?: ConnectorSpec;
    scope?: string;
    maxConnections?: number;
    hoverClass?: string;
    allowNestedGroups?: boolean;
}

export declare interface jsPlumbElement<E> {
    _jsPlumbGroup: UIGroup<E>;
    _jsPlumbParentGroup: UIGroup<E>;
    _jsPlumbProxies: Array<[Connection, number]>;
    _isJsPlumbGroup: boolean;
    parentNode: jsPlumbElement<E>;
}

export declare abstract class JsPlumbInstance<T extends {
    E: unknown;
} = any> extends EventGenerator {
    readonly _instanceIndex: number;
    defaults: JsPlumbDefaults<T["E"]>;
    private _initialDefaults;
    isConnectionBeingDragged: boolean;
    currentlyDragging: boolean;
    hoverSuspended: boolean;
    _suspendDrawing: boolean;
    _suspendedAt: string;
    connectorClass: string;
    connectorOutlineClass: string;
    connectedClass: string;
    endpointClass: string;
    endpointConnectedClass: string;
    endpointFullClass: string;
    endpointDropAllowedClass: string;
    endpointDropForbiddenClass: string;
    endpointAnchorClassPrefix: string;
    overlayClass: string;
    readonly connections: Array<Connection>;
    endpointsByElement: Record<string, Array<Endpoint>>;
    private readonly endpointsByUUID;
    sourceSelectors: Array<SourceSelector>;
    targetSelectors: Array<TargetSelector>;
    allowNestedGroups: boolean;
    private _curIdStamp;
    readonly viewport: Viewport<T>;
    readonly router: Router<T, any>;
    readonly groupManager: GroupManager<T["E"]>;
    private _connectionTypes;
    private _endpointTypes;
    private _container;
    protected _managedElements: Record<string, ManagedElement<T["E"]>>;
    private DEFAULT_SCOPE;
    readonly defaultScope: string;
    private _zoom;
    readonly currentZoom: number;
    constructor(_instanceIndex: number, defaults?: JsPlumbDefaults<T["E"]>);
    /**
     * @internal
     */
    areDefaultAnchorsSet(): boolean;
    /**
     * @internal
     * @param anchors
     */
    validAnchorsSpec(anchors: [AnchorSpec, AnchorSpec]): boolean;
    getContainer(): any;
    setZoom(z: number, repaintEverything?: boolean): boolean;
    _idstamp(): string;
    checkCondition<RetVal>(conditionName: string, args?: any): RetVal;
    getId(element: T["E"], uuid?: string): string;
    getConnections(options?: SelectOptions<T["E"]>, flat?: boolean): Record<string, Connection> | Array<Connection>;
    select(params?: SelectOptions<T["E"]>): ConnectionSelection;
    selectEndpoints(params?: SelectEndpointOptions<T["E"]>): EndpointSelection;
    setContainer(c: T["E"]): void;
    private _set;
    /**
     * Change the source of the given connection to be the given endpoint or element.
     * @param connection
     * @param el
     */
    setSource(connection: Connection, el: T["E"] | Endpoint): void;
    /**
     * Change the target of the given connection to be the given endpoint or element.
     * @param connection
     * @param el
     */
    setTarget(connection: Connection, el: T["E"] | Endpoint): void;
    /**
     * Returns whether or not hover is currently suspended.
     */
    isHoverSuspended(): boolean;
    /**
     * Sets whether or not drawing is suspended.
     * @param val - True to suspend, false to enable.
     * @param repaintAfterwards - If true, repaint everything afterwards.
     */
    setSuspendDrawing(val?: boolean, repaintAfterwards?: boolean): boolean;
    getSuspendedAt(): string;
    /**
     * Suspend drawing, run the given function, and then re-enable drawing, optionally repainting everything.
     * @param fn - Function to run while drawing is suspended.
     * @param doNotRepaintAfterwards - Whether or not to repaint everything after drawing is re-enabled.
     */
    batch(fn: Function, doNotRepaintAfterwards?: boolean): void;
    /**
     * Execute the given function for each of the given elements.
     * @param spec - An Element, or an element id, or an array of elements/element ids.
     * @param fn - The function to run on each element.
     */
    each(spec: T["E"] | Array<T["E"]>, fn: (e: T["E"]) => any): JsPlumbInstance;
    /**
     * Update the cached offset information for some element.
     * @param params
     * @returns an UpdateOffsetResult containing the offset information for the given element.
     */
    updateOffset(params?: UpdateOffsetOptions): ViewportElement<T["E"]>;
    /**
     * Delete the given connection.
     * @param connection - Connection to delete.
     * @param params - Optional extra parameters.
     */
    deleteConnection(connection: Connection, params?: DeleteConnectionOptions): boolean;
    deleteEveryConnection(params?: DeleteConnectionOptions): number;
    /**
     * Delete all connections attached to the given element.
     * @param el
     * @param params
     */
    deleteConnectionsForElement(el: T["E"], params?: DeleteConnectionOptions): JsPlumbInstance;
    private fireDetachEvent;
    fireMoveEvent(params?: ConnectionMovedParams, evt?: Event): void;
    /**
     * Manage a group of elements.
     * @param elements - Array-like object of strings or elements (can be an Array or a NodeList), or a CSS selector (which is applied with the instance's
     * container element as its context)
     * @param recalc - Maybe recalculate offsets for the element also.
     */
    manageAll(elements: ArrayLike<T["E"]> | string, recalc?: boolean): void;
    /**
     * Manage an element.  Adds the element to the viewport and sets up tracking for endpoints/connections for the element, as well as enabling dragging for the
     * element. This method is called internally by various methods of the jsPlumb instance, such as `connect`, `addEndpoint`, `makeSource` and `makeTarget`,
     * so if you use those methods to setup your UI then you may not need to call this. However, if you use the `addSourceSelector` and `addTargetSelector` methods
     * to configure your UI then you will need to register elements using this method, or they will not be draggable.
     * @param element - Element to manage. This method does not accept a DOM element ID as argument. If you wish to manage elements via their DOM element ID,
     * you should use `manageAll` and pass in an appropriate CSS selector that represents your element, eg `#myElementId`.
     * @param internalId - Optional ID for jsPlumb to use internally. If this is not supplied, one will be created.
     * @param recalc - Maybe recalculate offsets for the element also. It is not recommended that clients of the API use this parameter; it's used in
     * certain scenarios internally
     */
    manage(element: T["E"], internalId?: string, _recalc?: boolean): ManagedElement<T["E"]>;
    /**
     * Gets the element with the given ID from the list managed elements, null if not currently managed.
     * @param id
     */
    getManagedElement(id: string): T["E"];
    /**
     * Stops managing the given element.
     * @param el - Element, or ID of the element to stop managing.
     * @param removeElement - If true, also remove the element from the renderer.
     * @public
     */
    unmanage(el: T["E"], removeElement?: boolean): void;
    /**
     * Sets rotation for the element to the given number of degrees (not radians). A value of null is treated as a
     * rotation of 0 degrees.
     * @param element - Element to rotate
     * @param rotation - Amount to totate
     * @param _doNotRepaint - For internal use.
     */
    rotate(element: T["E"], rotation: number, _doNotRepaint?: boolean): RedrawResult;
    /**
     * Gets the current rotation for the element with the given ID. This method exists for internal use.
     * @param elementId - Internal ID of the element for which to retrieve rotation.
     * @internal
     */
    _getRotation(elementId: string): number;
    /**
     * Returns a list of rotation transformations that apply to the given element. An element may have rotation applied
     * directly to it, and/or it may be within a group, which may itself be rotated, and that group may be inside a group
     * which is also rotated, etc. It's rotated turtles all the way down, or at least it could be. This method is intended
     * for internal use only.
     * @param elementId
     * @internal
     */
    _getRotations(elementId: string): Rotations;
    /**
     * Applies the given set of Rotations to the given point, and returns a new PointXY. For internal use.
     * @param point - Point to rotate
     * @param rotations - Rotations to apply.
     * @internal
     */
    _applyRotations(point: [number, number, number, number], rotations: Rotations): RotatedPointXY;
    /**
     * Applies the given set of Rotations to the given point, and returns a new PointXY. For internal use.
     * @param point - Point to rotate
     * @param rotations - Rotations to apply.
     * @internal
     */
    _applyRotationsXY(point: PointXY, rotations: Rotations): PointXY;
    /**
     * Internal method to create an Endpoint from the given options, perhaps with the given id. Do not use this method
     * as a consumer of the API. If you wish to add an Endpoint to some element, use `addEndpoint` instead.
     * @param params - Options for the Endpoint.
     * @internal
     */
    _internal_newEndpoint(params: InternalEndpointOptions<T["E"]>): Endpoint;
    /**
     * For internal use. For the given inputs, derive an appropriate anchor and endpoint definition.
     * @param type
     * @param dontPrependDefault
     * @internal
     */
    _deriveEndpointAndAnchorSpec(type: string, dontPrependDefault?: boolean): {
        endpoints: [EndpointSpec, EndpointSpec];
        anchors: [AnchorSpec, AnchorSpec];
    };
    /**
     * Updates position/size information for the given element and redraws its Endpoints and their Connections. Use this method when you've
     * made a change to some element that may have caused the element to change its position or size and you want to ensure the connections are
     * in the right place.
     * @param el - Element to revalidate.
     * @param timestamp - Optional, used internally to avoid recomputing position/size information if it has already been computed.
     */
    revalidate(el: T["E"], timestamp?: string): RedrawResult;
    /**
     * Repaint every connection and endpoint in the instance.
     */
    repaintEverything(): JsPlumbInstance;
    /**
     * Sets the position of the given element to be [x,y].
     * @param el - Element to set the position for
     * @param x - Position in X axis
     * @param y - Position in Y axis
     * @returns The result of the redraw operation that follows the update of the viewport.
     */
    setElementPosition(el: T["E"], x: number, y: number): RedrawResult;
    /**
     * Repaints all connections and endpoints associated with the given element, _without recomputing the element
     * size and position_. If you want to first recompute element size and position you should call `revalidate(el)` instead,
     * @param el - Element to repaint.
     * @param timestamp - Optional parameter used internally to avoid recalculating offsets multiple times in one paint.
     * @param offsetsWereJustCalculated - If true, we don't recalculate the offsets of child elements of the element we're repainting.
     */
    repaint(el: T["E"], timestamp?: string, offsetsWereJustCalculated?: boolean): RedrawResult;
    /**
     * @internal
     * @param endpoint
     */
    private unregisterEndpoint;
    /**
     * Potentially delete the endpoint from the instance, depending on the endpoint's internal state. Not for external use.
     * @param endpoint
     * @internal
     */
    _maybePruneEndpoint(endpoint: Endpoint): boolean;
    /**
     * Delete the given endpoint.
     * @param object - Either an Endpoint, or the UUID of an Endpoint.
     */
    deleteEndpoint(object: string | Endpoint): JsPlumbInstance;
    /**
     * Add an Endpoint to the given element.
     * @param el - Element to add the endpoint to.
     * @param params
     * @param referenceParams
     */
    addEndpoint(el: T["E"], params?: EndpointOptions<T["E"]>, referenceParams?: EndpointOptions<T["E"]>): Endpoint;
    /**
     * Add a set of Endpoints to an element
     * @param el - Element to add the Endpoints to.
     * @param endpoints - Array of endpoint options.
     * @param referenceParams
     */
    addEndpoints(el: T["E"], endpoints: Array<EndpointOptions<T["E"]>>, referenceParams?: EndpointOptions<T["E"]>): Array<Endpoint>;
    /**
     * Clears all endpoints and connections from the instance of jsplumb. Does not also clear out event listeners, selectors, or
     * connection/endpoint types - for that, use `destroy()`.
     * @public
     */
    reset(): void;
    /**
     * Clears the instance and unbinds any listeners on the instance. After you call this method you cannot use this
     * instance of jsPlumb again.
     * @public
     */
    destroy(): void;
    /**
     * Gets all registered endpoints for the given element.
     * @param el
     */
    getEndpoints(el: T["E"]): Array<Endpoint>;
    /**
     * Retrieve an endpoint by its UUID.
     * @param uuid
     */
    getEndpoint(uuid: string): Endpoint;
    /**
     * Set an endpoint's uuid, updating the internal map
     * @param endpoint
     * @param uuid
     */
    setEndpointUuid(endpoint: Endpoint, uuid: string): void;
    /**
     * Connect one element to another.
     * @param params - At the very least you need to supply a source and target.
     * @param referenceParams - Optional extra parameters. This can be useful when you're creating multiple connections that have some things in common.
     */
    connect(params: ConnectParams<T["E"]>, referenceParams?: ConnectParams<T["E"]>): Connection;
    /**
     * @param params
     * @param referenceParams
     * @internal
     */
    private _prepareConnectionParams;
    /**
     * Creates and registers a new connection. For internal use only. Use `connect` to create Connections.
     * @param params
     * @internal
     */
    _newConnection(params: ConnectionOptions<T["E"]>): Connection;
    /**
     * Adds the connection to the backing model, fires an event if necessary and then redraws. This is a package-private method, not intended to be
     * called by external code.
     * @param jpc - Connection to finalise
     * @param params
     * @param originalEvent - Optional original event that resulted in the creation of this connection.
     * @internal
     */
    _finaliseConnection(jpc: Connection, params?: any, originalEvent?: Event): void;
    /**
     * Remove every endpoint registered to the given element.
     * @param el - Element to remove endpoints for.
     * @param recurse - If true, also remove endpoints for elements that are descendants of this element.
     */
    removeAllEndpoints(el: T["E"], recurse?: boolean): JsPlumbInstance;
    protected _createSourceDefinition(params?: BehaviouralTypeDescriptor, referenceParams?: BehaviouralTypeDescriptor): SourceDefinition;
    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeSource` functionality
     * that had been in jsPlumb since the early days (and which, in 5.x, has been removed). With this approach, rather than calling `makeSource` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse/touch events on elements that are managed by the instance.
     * @param selector - CSS3 selector identifying child element(s) of some managed element that should act as a connection source.
     * @param params - Options for the source: connector type, behaviour, etc.
     * @param exclude - If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     * @public
     */
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): SourceSelector;
    /**
     * Unregister the given source selector.
     * @param selector
     * @public
     */
    removeSourceSelector(selector: SourceSelector): void;
    /**
     * Unregister the given target selector.
     * @param selector
     * @public
     */
    removeTargetSelector(selector: TargetSelector): void;
    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeTarget` functionality
     * that has been in jsPlumb since the early days. With this approach, rather than calling `makeTarget` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse events on elements that are managed by the instance.
     * @param selector - CSS3 selector identifying child element(s) of some managed element that should act as a connection target.
     * @param params - Options for the target
     * @param exclude - If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     * @public
     */
    addTargetSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): TargetSelector;
    private _createTargetDefinition;
    show(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    hide(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    private _setVisible;
    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible(el: T["E"], changeEndpoints?: boolean): void;
    private _operation;
    registerConnectionType(id: string, type: ConnectionTypeDescriptor): void;
    registerConnectionTypes(types: Record<string, ConnectionTypeDescriptor>): void;
    registerEndpointType(id: string, type: EndpointTypeDescriptor): void;
    registerEndpointTypes(types: Record<string, EndpointTypeDescriptor>): void;
    getType(id: string, typeDescriptor: string): TypeDescriptor;
    getConnectionType(id: string): ConnectionTypeDescriptor;
    getEndpointType(id: string): EndpointTypeDescriptor;
    importDefaults(d: JsPlumbDefaults<T["E"]>): JsPlumbInstance;
    restoreDefaults(): JsPlumbInstance;
    getManagedElements(): Record<string, ManagedElement<T["E"]>>;
    proxyConnection(connection: Connection, index: number, proxyEl: T["E"], endpointGenerator: (c: Connection, idx: number) => EndpointSpec, anchorGenerator: (c: Connection, idx: number) => AnchorSpec): void;
    unproxyConnection(connection: Connection, index: number): void;
    sourceOrTargetChanged(originalId: string, newId: string, connection: Connection, newElement: T["E"], index: number): void;
    abstract setGroupVisible(group: UIGroup, state: boolean): void;
    getGroup(groupId: string): UIGroup<T["E"]>;
    getGroupFor(el: T["E"]): UIGroup<T["E"]>;
    addGroup(params: AddGroupOptions<T["E"]>): UIGroup<T["E"]>;
    addToGroup(group: string | UIGroup<T["E"]>, ...el: Array<T["E"]>): void;
    collapseGroup(group: string | UIGroup<T["E"]>): void;
    expandGroup(group: string | UIGroup<T["E"]>): void;
    toggleGroup(group: string | UIGroup<T["E"]>): void;
    removeGroup(group: string | UIGroup<T["E"]>, deleteMembers?: boolean, manipulateView?: boolean, doNotFireEvent?: boolean): Record<string, PointXY>;
    removeAllGroups(deleteMembers?: boolean, manipulateView?: boolean): void;
    removeFromGroup(group: string | UIGroup<T["E"]>, el: T["E"], doNotFireEvent?: boolean): void;
    paintEndpoint(endpoint: Endpoint, params: {
        timestamp?: string;
        offset?: ViewportElement<T["E"]>;
        recalc?: boolean;
        elementWithPrecedence?: string;
        connectorPaintStyle?: PaintStyle;
        anchorLoc?: AnchorPlacement;
    }): void;
    paintConnection(connection: Connection, params?: {
        timestamp?: string;
    }): void;
    refreshEndpoint(endpoint: Endpoint): void;
    makeConnector(connection: Connection<T["E"]>, name: string, args: any): AbstractConnector;
    /**
     * For some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group. For an element that has child
     * elements that are also managed, it means those child elements.
     * @param el
     * @internal
     */
    abstract _getAssociatedElements(el: T["E"]): Array<T["E"]>;
    abstract _removeElement(el: T["E"]): void;
    abstract _appendElement(el: T["E"], parent: T["E"]): void;
    abstract removeClass(el: T["E"] | ArrayLike<T["E"]>, clazz: string): void;
    abstract addClass(el: T["E"] | ArrayLike<T["E"]>, clazz: string): void;
    abstract toggleClass(el: T["E"] | ArrayLike<T["E"]>, clazz: string): void;
    abstract getClass(el: T["E"]): string;
    abstract hasClass(el: T["E"], clazz: string): boolean;
    abstract setAttribute(el: T["E"], name: string, value: string): void;
    abstract getAttribute(el: T["E"], name: string): string;
    abstract setAttributes(el: T["E"], atts: Record<string, string>): void;
    abstract removeAttribute(el: T["E"], attName: string): void;
    abstract getSelector(ctx: string | T["E"], spec?: string): ArrayLike<T["E"]>;
    abstract getStyle(el: T["E"], prop: string): any;
    abstract getSize(el: T["E"]): Size;
    abstract getOffset(el: T["E"]): PointXY;
    abstract getOffsetRelativeToRoot(el: T["E"] | string): PointXY;
    abstract getGroupContentArea(group: UIGroup): T["E"];
    abstract setPosition(el: T["E"], p: PointXY): void;
    abstract on(el: Document | T["E"] | ArrayLike<T["E"]>, event: string, callbackOrSelector: Function | string, callback?: Function): void;
    abstract off(el: Document | T["E"] | ArrayLike<T["E"]>, event: string, callback: Function): void;
    abstract trigger(el: Document | T["E"], event: string, originalEvent?: Event, payload?: any, detail?: number): void;
    getPathData(connector: AbstractConnector): any;
    abstract paintOverlay(o: Overlay, params: any, extents: any): void;
    abstract addOverlayClass(o: Overlay, clazz: string): void;
    abstract removeOverlayClass(o: Overlay, clazz: string): void;
    abstract setOverlayVisible(o: Overlay, visible: boolean): void;
    abstract destroyOverlay(o: Overlay): void;
    abstract updateLabel(o: LabelOverlay): void;
    abstract drawOverlay(overlay: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    abstract reattachOverlay(o: Overlay, c: Component): void;
    abstract setOverlayHover(o: Overlay, hover: boolean): void;
    abstract setHover(component: Component, hover: boolean): void;
    /**
     * @internal
     * @param connector
     * @param paintStyle
     * @param extents
     */
    abstract paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: Extents): void;
    /**
     * @internal
     * @param connection
     * @param force
     */
    abstract destroyConnector(connection: Connection, force?: boolean): void;
    /**
     * @internal
     * @param connector
     * @param h
     * @param doNotCascade
     */
    abstract setConnectorHover(connector: AbstractConnector, h: boolean, doNotCascade?: boolean): void;
    /**
     * @internal
     * @param connector
     * @param clazz
     */
    abstract addConnectorClass(connector: AbstractConnector, clazz: string): void;
    abstract removeConnectorClass(connector: AbstractConnector, clazz: string): void;
    abstract getConnectorClass(connector: AbstractConnector): string;
    abstract setConnectorVisible(connector: AbstractConnector, v: boolean): void;
    abstract applyConnectorType(connector: AbstractConnector, t: TypeDescriptor): void;
    abstract applyEndpointType(ep: Endpoint<T>, t: TypeDescriptor): void;
    abstract setEndpointVisible(ep: Endpoint<T>, v: boolean): void;
    abstract destroyEndpoint(ep: Endpoint<T>): void;
    abstract renderEndpoint(ep: Endpoint<T>, paintStyle: PaintStyle): void;
    abstract addEndpointClass(ep: Endpoint<T>, c: string): void;
    abstract removeEndpointClass(ep: Endpoint<T>, c: string): void;
    abstract getEndpointClass(ep: Endpoint<T>): string;
    abstract setEndpointHover(endpoint: Endpoint<T>, h: boolean, doNotCascade?: boolean): void;
}

export declare const KEY_CONNECTION_OVERLAYS = "connectionOverlays";

export declare class LabelOverlay extends Overlay {
    instance: JsPlumbInstance;
    component: Component;
    label: string | Function;
    labelText: string;
    static type: string;
    type: string;
    cachedDimensions: Size;
    constructor(instance: JsPlumbInstance, component: Component, p: LabelOverlayOptions);
    getLabel(): string;
    setLabel(l: string | Function): void;
    getDimensions(): Size;
    updateFrom(d: any): void;
}

export declare const LEFT = FaceValues.left;

export declare interface LightweightAnchor {
    locations: Array<AnchorRecord>;
    currentLocation: number;
    locked: boolean;
    id: string;
    cssClass: string;
    isContinuous: boolean;
    isFloating: boolean;
    isDynamic: boolean;
    timestamp: string;
    type: string;
    computedPosition?: ComputedPosition;
}

export declare interface LightweightContinuousAnchor extends LightweightAnchor {
    faces: Array<Face>;
    lockedFace: Face;
    isContinuous: true;
    isDynamic: false;
    currentFace: Face;
    lockedAxis: Axis;
    clockwise: boolean;
}

export declare class LightweightFloatingAnchor implements LightweightAnchor {
    instance: JsPlumbInstance;
    element: any;
    isFloating: boolean;
    isContinuous: false;
    isDynamic: false;
    locations: any[];
    currentLocation: number;
    locked: boolean;
    cssClass: string;
    timestamp: string;
    type: string;
    id: string;
    orientation: Orientation;
    size: Size;
    constructor(instance: JsPlumbInstance, element: any);
    private _updateOrientationInRouter;
    /**
     * notification the endpoint associated with this anchor is hovering
     * over another anchor; we want to assume that anchor's orientation
     * for the duration of the hover.
     */
    over(endpoint: Endpoint): void;
    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out(): void;
}

export declare interface LightweightPerimeterAnchor extends LightweightAnchor {
    shape: PerimeterAnchorShapes;
}

export declare class LightweightRouter<T extends {
    E: unknown;
}> implements Router<T, LightweightAnchor> {
    instance: JsPlumbInstance;
    anchorLists: Map<string, AnchorLists>;
    anchorLocations: Map<string, AnchorPlacement>;
    constructor(instance: JsPlumbInstance);
    getAnchorOrientation(anchor: LightweightAnchor): Orientation;
    private _distance;
    private _anchorSelector;
    private _floatingAnchorCompute;
    private _setComputedPosition;
    private _computeSingleLocation;
    /**
     * Computes the position for an anchor that has only a single location. This is analogous to the
     * original `Anchor` class.
     * @param anchor
     * @param params
     * @internal
     */
    private _singleAnchorCompute;
    /**
     * Computes the position for an anchor that is neither floating nor continuous. This case covers what
     * was previously both DynamicAnchor and Anchor, since those concepts have now been folded into
     * a single concept - any given anchor has one or more locations.
     * @param anchor
     * @param params
     */
    private _defaultAnchorCompute;
    private _placeAnchors;
    private _updateAnchorList;
    private _removeEndpointFromAnchorLists;
    computeAnchorLocation(anchor: LightweightAnchor, params: AnchorComputeParams): AnchorPlacement;
    computePath(connection: Connection<any>, timestamp: string): void;
    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement;
    getEndpointOrientation(ep: Endpoint<any>): [number, number];
    setAnchorOrientation(anchor: LightweightAnchor, orientation: Orientation): void;
    isDynamicAnchor(ep: Endpoint<any>): boolean;
    isFloating(ep: Endpoint<any>): boolean;
    prepareAnchor(endpoint: Endpoint<any>, params: AnchorSpec | Array<AnchorSpec>): LightweightAnchor;
    redraw(elementId: string, timestamp?: string, offsetToUI?: PointXY): RedrawResult;
    reset(): void;
    setAnchor(endpoint: Endpoint<any>, anchor: LightweightAnchor): void;
    setConnectionAnchors(conn: Connection<any>, anchors: [LightweightAnchor, LightweightAnchor]): void;
    private _calculateOrientation;
    /**
     * @internal
     * @param a
     * @param face
     * @param overrideLock
     */
    setCurrentFace(a: LightweightContinuousAnchor, face: Face, overrideLock?: boolean): void;
    /**
     * @internal
     * @param a
     */
    lock(a: LightweightAnchor): void;
    /**
     * @internal
     * @param a
     */
    unlock(a: LightweightAnchor): void;
    /**
     * Attempts to set the location in the given anchor whose x/y matches the coordinates given. An anchor may have more than
     * one declared location. This method provides a means for setting the active location based upon matching its x/y values.
     * @param a
     * @param coords
     * @returns true if a matching location was found and activated, false if not.
     * @internal
     */
    selectAnchorLocation(a: LightweightAnchor, coords: {
        x: number;
        y: number;
    }): boolean;
    /**
     * @internal
     * @param a
     */
    lockCurrentAxis(a: LightweightContinuousAnchor): void;
    /**
     * @internal
     * @param a
     */
    unlockCurrentAxis(a: LightweightContinuousAnchor): void;
    /**
     * Returns whether or not the two anchors represent the same location.
     * @param a1
     * @param a2
     * @internal
     */
    anchorsEqual(a1: LightweightAnchor, a2: LightweightAnchor): boolean;
}

export declare interface ListSpec {
    endpoint?: EndpointSpec;
}

export declare function makeLightweightAnchorFromSpec(spec: AnchorSpec | Array<AnchorSpec>): LightweightAnchor;

export declare type ManagedElement<E> = {
    el: jsPlumbElement<E>;
    viewportElement?: ViewportElement<E>;
    endpoints?: Array<Endpoint>;
    connections?: Array<Connection>;
    rotation?: number;
    group?: string;
};

/**
 * Payload for an element managed event
 * @public
 */
export declare interface ManageElementParams<E = any> {
    el: E;
}

export declare const NONE = "none";

export declare type Orientation = [number, number];

export declare abstract class Overlay extends EventGenerator {
    instance: JsPlumbInstance;
    component: Component;
    id: string;
    abstract type: string;
    cssClass: string;
    visible: boolean;
    location: number | Array<number>;
    events?: Record<string, (value: any, event?: any) => any>;
    constructor(instance: JsPlumbInstance, component: Component, p: OverlayOptions);
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    setVisible(v: boolean): void;
    isVisible(): boolean;
    abstract updateFrom(d: any): void;
}

export declare const OverlayFactory: {
    get: (instance: JsPlumbInstance<any>, name: string, component: Component, params: any) => Overlay;
    register: (name: string, overlay: Constructable<Overlay>) => void;
};

export declare interface OverlayMouseEventParams {
    e: Event;
    overlay: Overlay;
}

/**
 * @internal
 */
export declare interface PaintGeometry {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    xSpan: number;
    ySpan: number;
    mx: number;
    my: number;
    so: Orientation;
    to: Orientation;
    x: number;
    y: number;
    w: number;
    h: number;
    segment: number;
    startStubX: number;
    startStubY: number;
    endStubX: number;
    endStubY: number;
    isXGreaterThanStubTimes2: boolean;
    isYGreaterThanStubTimes2: boolean;
    opposite: boolean;
    perpendicular: boolean;
    orthogonal: boolean;
    sourceAxis: PaintAxis;
    points: [number, number, number, number, number, number, number, number];
    stubs: [number, number];
    anchorOrientation?: string;
}

export declare class PlainArrowOverlay extends ArrowOverlay {
    instance: JsPlumbInstance;
    static type: string;
    type: string;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
}

export declare class RectangleEndpoint extends EndpointRepresentation<ComputedRectangleEndpoint> {
    width: number;
    height: number;
    constructor(endpoint: Endpoint, params?: RectangleEndpointParams);
    static type: string;
    type: string;
    static _getParams(ep: RectangleEndpoint): Record<string, any>;
}

export declare const RectangleEndpointHandler: EndpointHandler<RectangleEndpoint, ComputedRectangleEndpoint>;

export declare interface RedrawResult {
    c: Set<Connection>;
    e: Set<Endpoint>;
}

/**
 * Indicates that when dragging an existing connection by its source endpoint, it can be relocated onto some other source element by
 * dropping it anywhere on that element.
 */
export declare const REDROP_POLICY_ANY = "any";

/**
 * Indicates that when dragging an existing connection by its source endpoint, it can only be relocated onto some other source element by
 * dropping it on the part of that element defined by its source selector.
 */
export declare const REDROP_POLICY_STRICT = "strict";

/**
 * Defines how redrop of source endpoints can be done.
 */
export declare type RedropPolicy = typeof REDROP_POLICY_STRICT | typeof REDROP_POLICY_ANY;

export declare function _removeTypeCssHelper<E>(component: Component, typeIndex: number): void;

export declare const RIGHT = FaceValues.right;

export declare interface Router<T extends {
    E: unknown;
}, A> {
    reset(): void;
    redraw(elementId: string, timestamp?: string, offsetToUI?: PointXY): RedrawResult;
    computePath(connection: Connection, timestamp: string): void;
    computeAnchorLocation(anchor: A, params: AnchorComputeParams): AnchorPlacement;
    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement;
    getAnchorOrientation(anchor: A, endpoint?: Endpoint): Orientation;
    getEndpointOrientation(endpoint: Endpoint): Orientation;
    setAnchorOrientation(anchor: A, orientation: Orientation): void;
    setAnchor(endpoint: Endpoint, anchor: A): void;
    prepareAnchor(endpoint: Endpoint, params: AnchorSpec | Array<AnchorSpec>): A;
    setConnectionAnchors(conn: Connection, anchors: [A, A]): void;
    isDynamicAnchor(ep: Endpoint): boolean;
    isFloating(ep: Endpoint): boolean;
    setCurrentFace(a: LightweightContinuousAnchor, face: Face, overrideLock?: boolean): void;
    lock(a: A): void;
    unlock(a: A): void;
    anchorsEqual(a: A, b: A): boolean;
    selectAnchorLocation(a: A, coords: {
        x: number;
        y: number;
    }): boolean;
}

/**
 * @internal
 */
declare type SegmentForPoint = {
    d: number;
    s: Segment;
    x: number;
    y: number;
    l: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    index: number;
    connectorLocation: number;
};

export declare interface SelectEndpointOptions<E> extends AbstractSelectOptions<E> {
    element?: ElementSelectionSpecifier<E>;
}

declare class SelectionBase<T extends Component> {
    protected instance: JsPlumbInstance;
    protected entries: Array<T>;
    constructor(instance: JsPlumbInstance, entries: Array<T>);
    readonly length: number;
    each(handler: (arg0: T) => void): SelectionBase<T>;
    get(index: number): T;
    addClass(clazz: string, cascade?: boolean): SelectionBase<T>;
    removeClass(clazz: string, cascade?: boolean): SelectionBase<T>;
    removeAllOverlays(): SelectionBase<T>;
    setLabel(label: string): SelectionBase<T>;
    clear(): this;
    map<Q>(fn: (entry: T) => Q): Array<Q>;
    addOverlay(spec: OverlaySpec): SelectionBase<T>;
    removeOverlay(id: string): SelectionBase<T>;
    removeOverlays(): SelectionBase<T>;
    showOverlay(id: string): SelectionBase<T>;
    hideOverlay(id: string): SelectionBase<T>;
    setPaintStyle(style: PaintStyle): SelectionBase<T>;
    setHoverPaintStyle(style: PaintStyle): SelectionBase<T>;
    setSuspendEvents(suspend: boolean): SelectionBase<T>;
    setParameter(name: string, value: string): SelectionBase<T>;
    setParameters(p: Record<string, string>): SelectionBase<T>;
    setVisible(v: boolean): SelectionBase<T>;
    addType(name: string): SelectionBase<T>;
    toggleType(name: string): SelectionBase<T>;
    removeType(name: string): SelectionBase<T>;
    bind(evt: string, handler: (a: any, e?: any) => any): SelectionBase<T>;
    unbind(evt: string, handler: Function): SelectionBase<T>;
    setHover(h: boolean): SelectionBase<T>;
}

export declare type SelectionList = '*' | Array<string>;

export declare interface SelectOptions<E> extends AbstractSelectOptions<E> {
    connections?: Array<Connection>;
}

export declare const SELECTOR_MANAGED_ELEMENT: string;

export declare const SOURCE = "source";

export declare const SOURCE_INDEX = 0;

/**
 * Defines the supported options on an `addSourceSelector` call.
 * @public
 */
export declare interface SourceDefinition extends SourceOrTargetDefinition {
}

/**
 * Base interface for source/target definitions
 * @public
 */
export declare interface SourceOrTargetDefinition {
    enabled?: boolean;
    def: BehaviouralTypeDescriptor;
    endpoint?: Endpoint;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
}

export declare class SourceSelector extends ConnectionDragSelector {
    def: SourceDefinition;
    redrop: RedropPolicy;
    constructor(selector: string, def: SourceDefinition, exclude: boolean);
}

export declare const STATIC = "static";

export declare class StraightConnector extends AbstractConnector {
    static type: string;
    type: string;
    getDefaultStubs(): [number, number];
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
    transformGeometry(g: StraightConnectorGeometry, dx: number, dy: number): StraightConnectorGeometry;
}

export declare interface StraightConnectorGeometry {
    source: AnchorPlacement;
    target: AnchorPlacement;
}

/**
 * @internal
 */
export declare class StraightSegment extends AbstractSegment {
    length: number;
    m: number;
    m2: number;
    constructor(params: StraightSegmentParams);
    getPath(isFirstSegment: boolean): string;
    private _recalc;
    static segmentType: string;
    type: string;
    getLength(): number;
    getGradient(): number;
    private _setCoordinates;
    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive. for the straight line segment this is simple maths.
     */
    pointOnPath(location: number, absolute?: boolean): PointXY;
    /**
     * returns the gradient of the segment at the given point - which for us is constant.
     */
    gradientAtPoint(location: number, absolute?: boolean): number;
    /**
     * returns the point on the segment's path that is 'distance' along the length of the path from 'location', where
     * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
     * this hands off to jsPlumbUtil to do the maths, supplying two points and the distance.
     */
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    private within;
    private closest;
    /**
     * Finds the closest point on this segment to [x,y]. See
     * notes on this method in AbstractSegment.
     */
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    private _pointLiesBetween;
    /**
     * Calculates all intersections of the given line with this segment.
     * @param _x1
     * @param _y1
     * @param _x2
     * @param _y2
     * @returns Array of intersecting points.
     */
    lineIntersection(_x1: number, _y1: number, _x2: number, _y2: number): Array<PointXY>;
    /**
     * Calculates all intersections of the given box with this segment. By default this method simply calls `lineIntersection` with each of the four
     * faces of the box; subclasses can override this if they think there's a faster way to compute the entire box at once.
     * @param x X position of top left corner of box
     * @param y Y position of top left corner of box
     * @param w width of box
     * @param h height of box
     * @returns Array of intersecting points
     */
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
}

/**
 * @internal
 */
export declare type StraightSegmentCoordinates = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

/**
 * @internal
 */
export declare interface StraightSegmentParams extends SegmentParams {
}

export declare const TARGET = "target";

export declare const TARGET_INDEX = 1;

/**
 * Defines the supported options on an `addTargetSelector` call.
 * @public
 */
export declare interface TargetDefinition extends SourceOrTargetDefinition {
}

export declare class TargetSelector extends ConnectionDragSelector {
    def: TargetDefinition;
    constructor(selector: string, def: TargetDefinition, exclude: boolean);
}

export declare const TOP = FaceValues.top;

export declare type TranslatedViewportElement<E> = Pick<TranslatedViewportElementBase<E>, Exclude<keyof TranslatedViewportElementBase<E>, "dirty">>;

/**
 * @internal
 */
export declare interface TranslatedViewportElementBase<E> extends ViewportElementBase<E> {
    cr: number;
    sr: number;
}

/**
 * Base interface for type descriptors for public methods.
 * @public
 */
export declare interface TypeDescriptor extends TypeDescriptorBase {
    overlays?: Array<OverlaySpec>;
}

/**
 * Base interface for endpoint/connection types, which are registered via `registerConnectionType` and `registerEndpointType`. This interface
 * contains parameters that are common between the two types, and is shared by internal methods and public methods.
 * @public
 */
declare interface TypeDescriptorBase {
    cssClass?: string;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    parameters?: any;
    anchors?: [AnchorSpec, AnchorSpec];
    anchor?: AnchorSpec;
    scope?: string;
    mergeStrategy?: string;
    endpoint?: EndpointSpec;
    connectorStyle?: PaintStyle;
    connectorHoverStyle?: PaintStyle;
    connector?: ConnectorSpec;
    connectorClass?: string;
}

export declare class UIGroup<E = any> extends UINode<E> {
    instance: JsPlumbInstance;
    children: Array<UINode<E>>;
    collapsed: boolean;
    droppable: boolean;
    enabled: boolean;
    orphan: boolean;
    constrain: boolean;
    proxied: boolean;
    ghost: boolean;
    revert: boolean;
    prune: boolean;
    dropOverride: boolean;
    anchor: AnchorSpec;
    endpoint: EndpointSpec;
    readonly connections: {
        source: Array<Connection>;
        target: Array<Connection>;
        internal: Array<Connection>;
    };
    manager: GroupManager<E>;
    id: string;
    readonly elId: string;
    constructor(instance: JsPlumbInstance, el: E, options: GroupOptions);
    overrideDrop(el: any, targetGroup: UIGroup<E>): boolean;
    getAnchor(conn: Connection, endpointIndex: number): AnchorSpec;
    getEndpoint(conn: Connection, endpointIndex: number): EndpointSpec;
    add(_el: E, doNotFireEvent?: boolean): void;
    private resolveNode;
    remove(el: E, manipulateDOM?: boolean, doNotFireEvent?: boolean, doNotUpdateConnections?: boolean, targetGroup?: UIGroup<E>): void;
    private _doRemove;
    removeAll(manipulateDOM?: boolean, doNotFireEvent?: boolean): void;
    orphanAll(): Record<string, PointXY>;
    addGroup(group: UIGroup<E>): boolean;
    removeGroup(group: UIGroup<E>): void;
    getGroups(): Array<UIGroup<E>>;
    getNodes(): Array<UINode<E>>;
    readonly collapseParent: UIGroup<E>;
}

export declare class UINode<E> {
    instance: JsPlumbInstance;
    el: E;
    group: UIGroup<E>;
    constructor(instance: JsPlumbInstance, el: E);
}

/**
 * Payload for an element unmanaged event.
 * @public
 */
export declare interface UnmanageElementParams<E = any> {
    el: E;
}

export declare function _updateHoverStyle<E>(component: Component): void;

/**
 * Options for the UpdateOffset method
 */
export declare interface UpdateOffsetOptions {
    timestamp?: string;
    recalc?: boolean;
    elId?: string;
}

export declare type UUID = string;

/**
 * Models the positions of the elements a given jsPlumb instance is tracking. Users of the API should not need to interact directly
 * with a Viewport.
 * @public
 */
export declare class Viewport<T extends {
    E: unknown;
}> extends EventGenerator {
    instance: JsPlumbInstance<T>;
    private _currentTransaction;
    constructor(instance: JsPlumbInstance<T>);
    _sortedElements: Record<string, Array<[string, number]>>;
    _elementMap: Map<string, ViewportElement<T["E"]>>;
    _transformedElementMap: Map<string, TranslatedViewportElement<T["E"]>>;
    _bounds: Record<string, number>;
    private _updateBounds;
    private _recalculateBounds;
    recomputeBounds(): void;
    private _finaliseUpdate;
    shouldFireEvent(event: string, value: unknown, originalEvent?: Event): boolean;
    startTransaction(): void;
    endTransaction(): void;
    updateElements(entries: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    }>): void;
    /**
     * Updates the element with the given id. Any of the provided values may be null, in which case they are ignored (we never overwrite an
     * existing value with null).
     * @param id
     * @param x
     * @param y
     * @param width
     * @param height
     * @param rotation
     * @param doNotRecalculateBounds Defaults to false. For internal use. If true, does not update viewport bounds after updating the element.
     */
    updateElement(id: string, x: number, y: number, width: number, height: number, rotation: number, doNotRecalculateBounds?: boolean): ViewportElement<T["E"]>;
    /**
     * Update the size/offset of the element with the given id, and adjust viewport bounds.
     * @param elId
     * @param doNotRecalculateBounds If true, the viewport's bounds won't be recalculated after the element's size and position has been refreshed.
     */
    refreshElement(elId: string, doNotRecalculateBounds?: boolean): ViewportElement<T["E"]>;
    protected getSize(el: T["E"]): Size;
    protected getOffset(el: T["E"]): PointXY;
    /**
     * Creates an empty entry for an element with the given ID.
     * @param doNotRecalculateBounds If true, the viewport's bounds won't be recalculated after the element has been registered.
     * @param id
     */
    registerElement(id: string, doNotRecalculateBounds?: boolean): ViewportElement<T["E"]>;
    /**
     * Adds the element with the given id, with the given values for x, y, width, height and rotation. Any of these may be null.
     * @param id
     * @param x
     * @param y
     * @param width
     * @param height
     * @param rotation
     */
    addElement(id: string, x: number, y: number, width: number, height: number, rotation: number): ViewportElement<T["E"]>;
    /**
     * Rotates the element with the given id, recalculating bounds afterwards.
     * @param id
     * @param rotation
     */
    rotateElement(id: string, rotation: number): ViewportElement<T["E"]>;
    /**
     * Gets the width of the content managed by the viewport, taking any rotated elements into account.
     */
    getBoundsWidth(): number;
    /**
     * Gets the height of the content managed by the viewport, taking any rotated elements into account.
     */
    getBoundsHeight(): number;
    /**
     * Gets the leftmost point of the content managed by the viewport, taking any rotated elements into account.
     */
    getX(): number;
    /**
     * Gets the topmost of the content managed by the viewport, taking any rotated elements into account.
     */
    getY(): number;
    /**
     * Sets the size of the element with the given ID, recalculating bounds.
     * @param id
     * @param w
     * @param h
     */
    setSize(id: string, w: number, h: number): ViewportElement<T["E"]>;
    /**
     * Sets the [x,y] position of the element with the given ID, recalculating bounds.
     * @param id
     * @param x
     * @param y
     */
    setPosition(id: string, x: number, y: number): ViewportElement<T["E"]>;
    /**
     * Clears the internal state of the viewport, removing all elements.
     */
    reset(): void;
    /**
     * Remove the element with the given ID from the viewport.
     * @param id
     */
    remove(id: string): void;
    /**
     * Gets the position of the element. This returns both the original position, and also the translated position of the element. Certain internal methods, such as the anchor
     * calculation code, use the unrotated position and then subsequently apply the element's rotation to any calculated positions.
     * Other parts of the codebase - the Toolkit's magnetizer or pan/zoom widget, for instance - are interested in the rotated position.
     * @param id
     */
    getPosition(id: string): ViewportElement<T["E"]>;
    /**
     * Get all elements managed by the Viewport.
     */
    getElements(): Map<string, ViewportElement<T["E"]>>;
    /**
     * Returns whether or not the viewport is empty.
     */
    isEmpty(): boolean;
}

/**
 * @internal
 */
export declare interface ViewportElement<E> extends ViewportElementBase<E> {
    t: TranslatedViewportElement<E>;
}

/**
 * @internal
 */
export declare interface ViewportElementBase<E> extends ViewportPosition {
    x2: number;
    y2: number;
    dirty: boolean;
}

/**
 * Definition of some element's location and rotation in the viewport.
 * @public
 */
export declare interface ViewportPosition extends PointXY {
    w: number;
    h: number;
    r: number;
    c: PointXY;
}

export declare const X_AXIS_FACES: Axis;

export declare const Y_AXIS_FACES: Axis;

export { }

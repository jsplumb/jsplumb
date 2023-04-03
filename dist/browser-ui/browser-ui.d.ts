export declare const ABSOLUTE = "absolute";

/**
 * @internal
 */
export declare abstract class AbstractBezierConnector extends AbstractConnector {
    connection: Connection;
    showLoopback: boolean;
    curviness: number;
    margin: number;
    proximityLimit: number;
    orientation: string;
    loopbackRadius: number;
    clockwise: boolean;
    isLoopbackCurrently: boolean;
    geometry: BezierConnectorGeometry;
    getDefaultStubs(): [number, number];
    constructor(connection: Connection, params: any);
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
    exportGeometry(): BezierConnectorGeometry;
    transformGeometry(g: BezierConnectorGeometry, dx: number, dy: number): BezierConnectorGeometry;
    importGeometry(geometry: BezierConnectorGeometry): boolean;
    abstract _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: PointXY, tp: PointXY, _w: number, _h: number): void;
}

/**
 * Base options interface for StateMachine and Bezier connectors.
 * @public
 */
export declare interface AbstractBezierOptions extends ConnectorOptions {
    /**
     * Whether or not to show connections whose source and target is the same element.
     */
    showLoopback?: boolean;
    /**
     * A measure of how "curvy" the bezier is. In terms of maths what this translates to is how far from the curve the control points are positioned.
     */
    curviness?: number;
    margin?: number;
    proximityLimit?: number;
    orientation?: string;
    loopbackRadius?: number;
}

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

/**
 * Base class for segments in connectors.
 *
 * @internal
 */
export declare abstract class AbstractSegment implements Segment {
    protected params: SegmentParams;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    extents: Extents;
    abstract type: string;
    /**
     * Abstract method that subclasses are required to implement. Returns the length of the segment.
     */
    abstract getLength(): number;
    abstract pointOnPath(location: number, absolute?: boolean): PointXY;
    abstract gradientAtPoint(location: number, absolute?: boolean): number;
    abstract pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    abstract getPath(isFirstSegment: boolean): string;
    constructor(params: SegmentParams);
    /**
     * Finds the closest point on this segment to the given x/y, returning both the x and y of the point plus its distance from
     * the supplied point, and its location along the length of the path inscribed by the segment.  This implementation returns
     * Infinity for distance and null values for everything else subclasses are expected to override.
     * @param x - X location to find closest point to
     * @param y - Y location to find closest point to
     * @returns a `PointNearPath` object, which contains the location of the closest point plus other useful information.
     */
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    /**
     * Computes the list of points on the segment that intersect the given line.
     * @param x1 - X location of point 1
     * @param y1 - Y location of point 1
     * @param x2 - X location of point 2
     * @param y2 - Y location of point 2
     * @returns A list of intersecting points
     */
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the box with the given origin and size.
     * @param x - x origin of the box
     * @param y - y origin of the box
     * @param w - width of the box
     * @param h - height of the box
     * @returns A list of intersecting points
     */
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the given bounding box.
     * @param box - Box to test for intersections.
     * @returns A list of intersecting points
     */
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
}

export declare interface AbstractSelectOptions<E> {
    scope?: SelectionList;
    source?: ElementSelectionSpecifier<E>;
    target?: ElementSelectionSpecifier<E>;
}

/**
 * Adds the x and y values of the two points and returns a new point.
 * @param p1
 * @param p2
 * @public
 */
export declare function add(p1: PointXY, p2: PointXY): PointXY;

export declare const ADD_CLASS_ACTION = "add";

export declare function addClass(el: Element | NodeListOf<Element>, clazz: string): void;

export declare interface AddGroupOptions<E> extends GroupOptions {
    el: E;
    collapsed?: boolean;
}

/**
 * Adds an item to a dictionary whose values consists of array of some type. This method is used internally by jsPlumb and is not intended as part of the public API,
 * and will likely be removed at some point in the future when the code that depends upon it has been refactored.
 * @param map
 * @param key
 * @param value
 * @param insertAtStart
 * @internal
 */
export declare function addToDictionary<T>(map: Record<string, Array<T>>, key: string, value: any, insertAtStart?: boolean): Array<any>;

/**
 * Add an item to a list that is stored inside some map. This method is used internally.
 * @param map A map of <string, Array> entries.
 * @param key The ID of the list to search for in the map
 * @param value The value to add to the list, if found
 * @param insertAtStart If true, inserts the new item at the head of the list. Defaults to false.
 * @internal
 */
export declare function addToList<T>(map: Map<string, Array<T>>, key: string, value: any, insertAtStart?: boolean): Array<any>;

/**
 * Adds an item to a list if the given hash function determines that the item is not already in the list
 * @param list List to add to
 * @param item Item to add
 * @param hashFunction Function to use to check the current items of the list; if this function returns true for any current list item, the insertion does not proceed.
 * @internal
 */
export declare function addWithFunction<T>(list: Array<T>, item: T, hashFunction: (_a: T) => boolean): void;

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

/**
 * List of entries in the AnchorLocations enum
 * @public
 */
export declare type AnchorId = keyof typeof AnchorLocations;

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

/**
 * Default anchor locations.
 * @public
 */
export declare enum AnchorLocations {
    Assign = "Assign",
    /**
     * Chooses from Top, Left, Bottom or Right, depending on which is closest to the anchor at the other end of the connection.
     */
    AutoDefault = "AutoDefault",
    /**
     * Bottom middle of the element.
     */
    Bottom = "Bottom",
    /**
     * Bottom left corner of the element.
     */
    BottomLeft = "BottomLeft",
    /**
     * Bottom right corner of the element.
     */
    BottomRight = "BottomRight",
    /**
     * Center of the element.
     */
    Center = "Center",
    /**
     * Assigns a separate anchor point for each endpoint, choosing whichever face is closest to the element at the other end of each connection.
     */
    Continuous = "Continuous",
    /**
     * As with Continuous, but only use the bottom face.
     */
    ContinuousBottom = "ContinuousBottom",
    /**
     * As with Continuous, but only use the left face.
     */
    ContinuousLeft = "ContinuousLeft",
    /**
     * As with Continuous, but only use the right face.
     */
    ContinuousRight = "ContinuousRight",
    /**
     * As with Continuous, but only use the top face.
     */
    ContinuousTop = "ContinuousTop",
    /**
     * As with Continuous, but only use the left and right faces.
     */
    ContinuousLeftRight = "ContinuousLeftRight",
    /**
     * As with Continuous, but only use the top and bottom faces.
     */
    ContinuousTopBottom = "ContinuousTopBottom",
    /**
     * Center of the left edge of the element.
     */
    Left = "Left",
    /**
     * Tracks the perimeter of some shape.
     */
    Perimeter = "Perimeter",
    /**
     * Center of the right edge of the element.
     */
    Right = "Right",
    /**
     * Center of the top edge of the element.
     */
    Top = "Top",
    /**
     * Top left corner of the element.
     */
    TopLeft = "TopLeft",
    /**
     * Top right corner of the element.
     */
    TopRight = "TopRight"
}

export declare interface AnchorOptions extends Record<string, any> {
    /**
     * Optional css class that will be applied to any DOM element for an endpoint using this anchor.
     */
    cssClass?: string;
}

export declare type AnchorOrientationHint = -1 | 0 | 1;

/**
 * Defines the current location that an anchor is placed at.
 * @internal
 */
export declare type AnchorPlacement = {
    curX: number;
    curY: number;
    x: number;
    y: number;
    ox: AnchorOrientationHint;
    oy: AnchorOrientationHint;
};

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
 * Models the specification of anchor - which may be a SingleAnchorSpec, or an array of SingleAnchorSpec objects.
 * @public
 */
export declare type AnchorSpec = SingleAnchorSpec | Array<SingleAnchorSpec>;

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

/**
 * An anchor spec in the form [ x, y, ox, oy ]
 */
export declare type ArrayAnchorSpec = [number, number, AnchorOrientationHint, AnchorOrientationHint, number?, number?];

/**
 * Returns whether or not the two arrays are identical, ie. they have the same length and every value is the same
 * @param a
 * @param b
 * @internal
 */
export declare function arraysEqual(a: Array<any>, b: Array<any>): boolean;

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

/**
 * @public
 */
export declare interface ArrowOverlayOptions extends OverlayOptions {
    width?: number;
    length?: number;
    direction?: number;
    foldback?: number;
    paintStyle?: PaintStyle;
}

export declare function att(...attName: Array<string>): string;

declare function _attr(node: SVGElement, attributes: ElementAttributes): void;

export declare const ATTR_SCROLLABLE_LIST = "jtk-scrollable-list";

/**
 * @public
 */
export declare const ATTRIBUTE_CONTAINER = "data-jtk-container";

export declare const ATTRIBUTE_GROUP = "data-jtk-group";

/**
 * @public
 */
export declare const ATTRIBUTE_GROUP_CONTENT = "data-jtk-group-content";

/**
 * @public
 */
export declare const ATTRIBUTE_JTK_ENABLED = "data-jtk-enabled";

/**
 * @public
 */
export declare const ATTRIBUTE_JTK_SCOPE = "data-jtk-scope";

export declare const ATTRIBUTE_MANAGED = "data-jtk-managed";

export declare const ATTRIBUTE_NOT_DRAGGABLE = "data-jtk-not-draggable";

export declare const ATTRIBUTE_SCOPE = "data-jtk-scope";

export declare const ATTRIBUTE_SCOPE_PREFIX: string;

export declare const ATTRIBUTE_TABINDEX = "tabindex";

export declare type Axis = [Face, Face];

export declare type AxisCoefficients = [number, number, number, number];

declare abstract class Base {
    protected el: jsPlumbDOMElement;
    protected manager: Collicat;
    abstract _class: string;
    uuid: string;
    private enabled;
    scopes: Array<string>;
    /**
     * @internal
     */
    protected eventManager: EventManager;
    protected constructor(el: jsPlumbDOMElement, manager: Collicat);
    setEnabled(e: boolean): void;
    isEnabled(): boolean;
    toggleEnabled(): void;
    addScope(scopes: string): void;
    removeScope(scopes: string): void;
    toggleScope(scopes: string): void;
}

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
export declare type BeforeStartConnectionDetachInterceptor<E = any> = (params: BeforeStartConnectionDetachParams<E>) => boolean;

/**
 * The parameters passed to a `beforeStartDetach` interceptor.
 * @public
 */
export declare interface BeforeStartConnectionDetachParams<E> extends BeforeDragParams<E> {
}

export declare interface BeforeStartEventParams extends DragStartEventParams {
}

/**
 * Extends EndpointTypeDescriptor to add the options supported by an `addSourceSelector` or `addTargetSelector` call.
 * @public
 */
export declare interface BehaviouralTypeDescriptor<T = any> extends EndpointTypeDescriptor {
    /**
     * A function that can be used to extract a set of parameters pertinent to the connection that is being dragged
     * from a given source or dropped on a given target.
     * @param el - The element that is the drag source
     * @param eventTarget - The element that captured the event that started the connection drag.
     */
    parameterExtractor?: (el: T, eventTarget: T, event: Event) => Record<string, any>;
    /**
     * Optional policy for dropping existing connections that have been detached by their source/target.
     *
     * - 'strict' (`RedropPolicy.STRICT`) indicates that a connection can only be dropped back onto a part of
     * an element that matches the original source/target's selector.
     *
     * - 'any' (`RedropPolicy.ANY`) indicates that a connection can be dropped anywhere onto an element.
     *
     * - 'anySource' (`RedropPolicy.ANY_SOURCE`) indicates that a connection can be dropped onto any part of an element that
     * is configured as a source selector.
     *
     * - 'anyTarget' (`RedropPolicy.ANY_TARGET`) indicates that a connection can be dropped onto any part of an element that
     * is configured as a target selector.
     *
     * - 'anySourceOrTarget' (`RedropPolicy.ANY_SOURCE_OR_TARGET`) indicates that a connection can be dropped onto any part of an element that
     * is configured as a source selector or a target selector.
     */
    redrop?: RedropPolicy;
    /**
     * Optional function that is used to determine whether at the start of a drag, a given element is able to accept
     * new connections. For a source element returning false from here aborts the connection drag. For a target element
     * returning false from here means the target element is not active as a drop target.
     */
    canAcceptNewConnection?: (el: Element, e: Event) => boolean;
    /**
     * Optional set of values to extract from an element when a drag starts from that element. For target selectors this option is ignored.
     */
    extract?: Record<string, string>;
    /**
     * If true, only one endpoint will be created on any given element for this type descriptor, and subsequent connections will
     * all attach to that endpoint. Defaults to false.
     */
    uniqueEndpoint?: boolean;
    /**
     * Optional function to call if the user begins a new connection drag when the associated element is full.
     * @param value
     * @param event
     */
    onMaxConnections?: (value: any, event?: any) => any;
    /**
     * Optional type for connections dragged from a source selector. This option is ignored for target selectors.
     */
    edgeType?: string;
    /**
     * Optional logical id for the endpoint associated with a source or target selector.
     */
    portId?: string;
    /**
     * Defaults to true. If false, the user will not be permitted to drag a connection from the current node to itself.
     */
    allowLoopback?: boolean;
    /**
     * Optional rank for a given source or target selector. When selecting a selector from a list of candidates, rank can be used
     * to prioritise them. Higher values take precedence.
     */
    rank?: number;
    /**
     * Optional selector identifying the ancestor of the event target that could be the element to which connections
     * are added. By default this is the internal attribute jsPlumb uses to mark managed elements (data-jtk-managed)
     */
    parentSelector?: string;
    /**
     * This function offers a means for you to provide the anchor to use for
     * a new drag, or a drop. You're given the source/target element, the proportional location on
     * the element that the drag started/drop occurred, the associated type descriptor, and
     * the originating event.  Return null if you don't wish to provide a value,
     * and any other return value will be treated as an AnchorSpec.
     * @param el
     * @param elxy
     * @param def
     * @param e
     */
    anchorPositionFinder?: (el: Element, elxy: PointXY, def: BehaviouralTypeDescriptor, e: Event) => AnchorSpec | null;
    /**
     * Whether or not an endpoint created from this definition should subsequently
     * behave as a source for dragging connections with the mouse.
     */
    source?: boolean;
    /**
     * Whether or not an endpoint created from this definition should subsequently
     * behave as a target for dragging connections with the mouse.
     */
    target?: boolean;
}

export declare class BezierConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    majorAnchor: number;
    minorAnchor: number;
    constructor(connection: Connection, params: BezierOptions);
    getCurviness(): number;
    protected _findControlPoint(point: PointXY, sourceAnchorPosition: AnchorPlacement, targetAnchorPosition: AnchorPlacement, soo: [number, number], too: [number, number]): PointXY;
    _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, _w: number, _h: number): void;
}

export declare interface BezierConnectorGeometry extends Geometry {
    controlPoints: [
    PointXY,
    PointXY
    ];
    source: AnchorPlacement;
    target: AnchorPlacement;
}

/**
 * Calculates all intersections of the given line with the given curve.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param curve
 * @returns Array of intersecting points.
 */
export declare function bezierLineIntersection(x1: number, y1: number, x2: number, y2: number, curve: Curve): Array<PointXY>;

/**
 * Options for the Bezier connector.
 */
export declare interface BezierOptions extends AbstractBezierOptions {
}

export declare class BezierSegment extends AbstractSegment {
    curve: Curve;
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    length: number;
    constructor(params: BezierSegmentParams);
    static segmentType: string;
    type: string;
    private static _translateLocation;
    getPath(isFirstSegment: boolean): string;
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
    getLength(): number;
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
}

export declare interface BezierSegmentParams extends SegmentParams {
    cp1x: number;
    cp2x: number;
    cp1y: number;
    cp2y: number;
}

export declare class BlankEndpoint extends EndpointRepresentation<ComputedBlankEndpoint> {
    constructor(endpoint: Endpoint, params?: BlankEndpointParams);
    static type: string;
    type: string;
}

export declare const BlankEndpointHandler: EndpointHandler<BlankEndpoint, ComputedBlankEndpoint>;

/**
 * @public
 */
export declare interface BlankEndpointParams extends EndpointRepresentationParams {
}

export declare const BLOCK = "block";

export declare const BOTTOM = FaceValues.bottom;

/**
 * Defines the bounding box for some element - its x/y location, width and height, and optionally the computed center, but
 * that can of course be calculated from the other values. Internally there are times when the code has this to hand so we include
 * it here.
 * @public
 */
export declare type BoundingBox = {
    x: number;
    y: number;
    w: number;
    h: number;
    center?: PointXY;
};

/**
 * Calculates all intersections of the given bounding box with the given curve.
 * @param boundingBox Bounding box to test for intersections.
 * @param curve
 * @returns Array of intersecting points.
 * @public
 */
export declare function boundingBoxIntersection(boundingBox: BoundingBox, curve: Curve): Array<PointXY>;

/**
 * Calculates all intersections of the given box with the given curve.
 * @param x X position of top left corner of box
 * @param y Y position of top left corner of box
 * @param w width of box
 * @param h height of box
 * @param curve
 * @returns Array of intersecting points.
 * @public
 */
export declare function boxIntersection(x: number, y: number, w: number, h: number, curve: Curve): Array<PointXY>;

/**
 * Defaults for the BrowserUI implementation of jsPlumb.
 * @public
 */
export declare interface BrowserJsPlumbDefaults extends JsPlumbDefaults<Element> {
    /**
     * Whether or not elements should be draggable. Default value is `true`.
     */
    elementsDraggable?: boolean;
    /**
     * Options for dragging - containment, grid, callbacks etc.
     */
    dragOptions?: DragOptions;
    /**
     * Specifies the CSS selector used to identify managed elements. This option is not something that most users of
     * jsPlumb will need to set.
     */
    managedElementsSelector?: string;
    /**
     * Defaults to true, indicating that a ResizeObserver will be used, where available, to allow jsPlumb to revalidate elements
     * whose size in the DOM have been changed, without the library user having to call `revalidate()`
     */
    resizeObserver?: boolean;
}

/**
 * JsPlumbInstance that renders to the DOM in a browser, and supports dragging of elements/connections.
 * @public
 */
export declare class BrowserJsPlumbInstance extends JsPlumbInstance<{
    E: Element;
}> {
    _instanceIndex: number;
    containerType: ElementType;
    private readonly dragSelection;
    dragManager: DragManager;
    _connectorClick: Function;
    _connectorDblClick: Function;
    _connectorTap: Function;
    _connectorDblTap: Function;
    _endpointClick: Function;
    _endpointDblClick: Function;
    _overlayClick: Function;
    _overlayDblClick: Function;
    _overlayTap: Function;
    _overlayDblTap: Function;
    _connectorMouseover: Function;
    _connectorMouseout: Function;
    _endpointMouseover: Function;
    _endpointMouseout: Function;
    _connectorContextmenu: Function;
    _connectorMousedown: Function;
    _connectorMouseup: Function;
    _endpointMousedown: Function;
    _endpointMouseup: Function;
    _overlayMouseover: Function;
    _overlayMouseout: Function;
    _elementClick: Function;
    _elementTap: Function;
    _elementDblTap: Function;
    _elementMouseenter: Function;
    _elementMouseexit: Function;
    _elementMousemove: Function;
    _elementMouseup: Function;
    _elementMousedown: Function;
    _elementContextmenu: Function;
    private readonly _resizeObserver;
    eventManager: EventManager;
    draggingClass: string;
    elementDraggingClass: string;
    hoverClass: string;
    sourceElementDraggingClass: string;
    targetElementDraggingClass: string;
    hoverSourceClass: string;
    hoverTargetClass: string;
    dragSelectClass: string;
    managedElementsSelector: string;
    /**
     * Whether or not elements should be draggable. This can be provided in the constructor arguments, or simply toggled on the
     * class. The default value is `true`.
     */
    elementsDraggable: boolean;
    private elementDragHandler;
    private readonly groupDragOptions;
    private readonly elementDragOptions;
    constructor(_instanceIndex: number, defaults?: BrowserJsPlumbDefaults);
    /**
     * Fire an event for an overlay, and for its related component.
     * @internal
     * @param overlay
     * @param event
     * @param e
     */
    private fireOverlayMethod;
    /**
     * Adds a filter to the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter - CSS3 selector, or function that takes an element and returns true/false
     * @param exclude - If true, the filter is inverted: anything _but_ this value.
     * @public
     */
    addDragFilter(filter: Function | string, exclude?: boolean): void;
    /**
     * Removes a filter from the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter - CSS3 selector, or function that takes an element and returns true/false
     * @public
     */
    removeDragFilter(filter: Function | string): void;
    /**
     * Sets the grid that should be used when dragging elements.
     * @param grid - Grid to use.
     * @public
     */
    setDragGrid(grid: Grid): void;
    /**
     * Sets the function used to constrain the dragging of elements.
     * @param constrainFunction
     * @public
     */
    setDragConstrainFunction(constrainFunction: ConstrainFunction): void;
    /**
     * @internal
     * @param element
     */
    _removeElement(element: Element): void;
    /**
     *
     * @param el
     * @param parent
     * @internal
     */
    _appendElement(el: Element, parent: Element): void;
    /**
     * @internal
     * @param group
     * @param el
     * @private
     */
    _appendElementToGroup(group: UIGroup<any>, el: Element): void;
    /**
     * @internal
     * @param el
     * @private
     */
    _appendElementToContainer(el: Element): void;
    /**
     *
     * @param el
     * @internal
     */
    _getAssociatedElements(el: Element): Array<Element>;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    /**
     * Gets the CSS class for the given element.
     * @param el
     * @public
     */
    getClass(el: Element): string;
    /**
     * Add one or more classes to the given element or list of elements.
     * @param el Element, or list of elements to which to add the class(es)
     * @param clazz A space separated list of classes to add.
     * @public
     */
    addClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Returns whether or not the given element has the given class.
     * @param el
     * @param clazz
     * @public
     */
    hasClass(el: Element, clazz: string): boolean;
    /**
     * Remove one or more classes from the given element or list of elements.
     * @param el Element, or list of elements from which to remove the class(es)
     * @param clazz A space separated list of classes to remove.
     * @public
     */
    removeClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Toggles one or more classes on the given element or list of elements.
     * @param el Element, or list of elements on which to toggle the class(es)
     * @param clazz A space separated list of classes to toggle.
     * @public
     */
    toggleClass(el: Element | NodeListOf<Element>, clazz: string): void;
    /**
     * Sets an attribute on the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el
     * @param name
     * @param value
     * @public
     */
    setAttribute(el: Element, name: string, value: string): void;
    /**
     * Gets an attribute from the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el
     * @param name
     * @public
     */
    getAttribute(el: Element, name: string): string;
    /**
     * Sets some attributes on the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el - Element to set attributes on
     * @param atts - Map of attributes to set.
     * @public
     */
    setAttributes(el: Element, atts: Record<string, string>): void;
    /**
     * Remove an attribute from the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el - Element to remove an attribute from
     * @param attName - Name of the attribute to remove
     * @public
     */
    removeAttribute(el: Element, attName: string): void;
    /**
     * Bind an event listener to the given element or elements.
     * @param el - Element, or elements, to bind the event listener to.
     * @param event - Name of the event to bind to.
     * @param callbackOrSelector - Either a callback function, or a CSS 3 selector. When this is a selector the event listener is bound as a "delegate", ie. the event listeners
     * listens to events on children of the given `el` that match the selector.
     * @param callback - Callback function for event. Only supplied when you're binding a delegated event handler.
     * @public
     */
    on(el: Document | Element | NodeListOf<Element>, event: string, callbackOrSelector: Function | string, callback?: Function): this;
    /**
     * Remove an event binding from the given element or elements.
     * @param el - Element, or elements, from which to remove the event binding.
     * @param event - Name of the event to unbind.
     * @param callback - The function you wish to unbind.
     * @public
     */
    off(el: Document | Element | NodeListOf<Element>, event: string, callback: Function): this;
    /**
     * Trigger an event on the given element.  Exposed publically but mostly intended for internal use.
     * @param el - Element to trigger the event on.
     * @param event - Name of the event to trigger.
     * @param originalEvent - Optional event that gave rise to this method being called.
     * @param payload - Optional `payload` to set on the Event that is created.
     * @param detail - Optional detail for the Event that is created.
     * @public
     */
    trigger(el: Document | Element, event: string, originalEvent?: Event, payload?: any, detail?: number): void;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getOffsetRelativeToRoot(el: Element): PointXY;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     *
     * Places this is called:
     *
     * - dragToGroup in test support, to get the position of the target group
     * - `orphan` in group manager, to get an elements position relative to the group. since in this case we know its
     * a child of the group's content area we could theoretically use getBoundingClientRect here
     * - addToGroup in group manager, to find the position of some element that is about to be dropped
     * - addToGroup in group manager, to get the position of the content area of an uncollapsed group onto which an element is being dropped
     * - refreshElement, to get the current position of some element
     * - getOffset method in viewport (just does a pass through to the instance)
     * - onStop of group manager, when ghost proxy is active, to get the location of the original group's content area and the new group's content area
     * - onStart in drag manager, to get the position of an element that is about to be dragged
     * - onStart in drag manager, to get the position of an element's group parent when the element is about to be dragged (if the element is in a group)
     * - onStart in drag manager, to get the position of a group, when checking for target group's for the element that is about to be dragged
     * - onStart in drag manager, to get the position of all the elements in the current drag group (if there is one), so that they can be moved
     * relative to each other during the drag.
     *
     *
     */
    getOffset(el: Element): PointXY;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getSize(el: Element): Size;
    /**
     * get the position of the given element, allowing for svg elements and html elements
     * @param el
     */
    getPosition(el: Element): PointXY;
    /**
     * Gets a style property from some element.
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el Element to get property from
     * @param prop Property to look up
     */
    getStyle(el: Element, prop: string): any;
    /**
     * Gets the element representing some group's content area.
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param group
     */
    getGroupContentArea(group: UIGroup<any>): Element;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param ctx Either a string representing a selector, or an element. If a string, the container root is assumed to be the element context. Otherwise
     * the context is this value and the selector is the second arg to the method.
     * @param spec If `ctx` is an element, this is the selector
     */
    getSelector(ctx: string | Element, spec?: string): ArrayLike<jsPlumbDOMElement>;
    /**
     * Sets the position of the given element.
     * @param el Element to change position for
     * @param p New location for the element.
     * @internal
     */
    setPosition(el: Element, p: PointXY): void;
    /**
     * Helper method to set the draggable state of some element. Under the hood all this does is add/remove the `data-jtk-not-draggable` attribute.
     * @param element - Element to set draggable state for.
     * @param draggable
     * @public
     */
    setDraggable(element: Element, draggable: boolean): void;
    /**
     * Helper method to get the draggable state of some element. Under the hood all this does is check for the existence of the `data-jtk-not-draggable` attribute.
     * @param el - Element to get draggable state for.
     * @public
     */
    isDraggable(el: Element): boolean;
    toggleDraggable(el: Element): boolean;
    private _createEventListeners;
    private _attachEventDelegates;
    private _detachEventDelegates;
    /**
     * Sets the element this instance will use as the container for everything it adds to the UI. In normal use this method is
     * not expected to be called very often, if at all. The method is used by the instance constructor and also in certain situations by
     * the Toolkit edition.
     * @param newContainer
     * @public
     */
    setContainer(newContainer: Element): void;
    /**
     * Clears all endpoints and connections and managed elements from the instance of jsplumb. Does not also clear out event listeners, selectors, or
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
     * Stops managing the given element.
     * @param el - Element, or ID of the element to stop managing.
     * @param removeElement - If true, also remove the element from the renderer.
     * @public
     */
    unmanage(el: Element, removeElement?: boolean): void;
    /**
     * Adds the given element(s) to the current drag selection.
     * @param el
     * @public
     */
    addToDragSelection(...el: Array<Element>): void;
    /**
     * Clears the current drag selection
     * @public
     */
    clearDragSelection(): void;
    /**
     * Removes the given element(s) from the current drag selection
     * @param el
     * @public
     */
    removeFromDragSelection(...el: Array<Element>): void;
    /**
     * Toggles membership in the current drag selection of the given element(s)
     * @param el
     * @public
     */
    toggleDragSelection(...el: Array<Element>): void;
    /**
     * Adds the given element(s) to the given drag group.
     * @param spec Either the ID of some drag group, in which case the elements are all added as 'active', or an object of the form
     * { id:"someId", active:boolean }. In the latter case, `active`, if true, which is the default, indicates whether
     * dragging the given element(s) should cause all the elements in the drag group to be dragged. If `active` is false it means the
     * given element(s) is "passive" and should only move when an active member of the drag group is dragged.
     * @param els Elements to add to the drag group.
     * @public
     */
    addToDragGroup(spec: DragGroupSpec, ...els: Array<Element>): void;
    /**
     * Removes the given element(s) from any drag group they may be in. You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param els Elements to remove from drag groups.
     * @public
     */
    removeFromDragGroup(...els: Array<Element>): void;
    /**
     * Sets the active/passive state for the given element(s) in their respective drag groups (if any). You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param state true for active, false for passive.
     * @param els
     * @public
     */
    setDragGroupState(state: boolean, ...els: Array<Element>): void;
    /**
     * Removes all members from the drag group with the given name.
     * @param name
     * @public
     */
    clearDragGroup(name: string): void;
    /**
     * Consumes the given event.
     * @param e
     * @param doNotPreventDefault
     * @public
     */
    consume(e: Event, doNotPreventDefault?: boolean): void;
    /**
     * Rotates the given element. This method overrides the same method from the superclass: the superclass only makes a note
     * of the current rotation for the given element, but in this class the element has appropriate CSS transforms applied to it
     * to effect the rotation in the DOM.
     * @param element - Element to rotate.
     * @param rotation - Rotation, in degrees.
     * @param doNotRepaint - If true, a repaint is not done afterwards. Defaults to false.
     * @public
     */
    rotate(element: Element, rotation: number, doNotRepaint?: boolean): RedrawResult;
    svg: {
        node: (name: string, attributes?: ElementAttributes) => SVGElement;
        attr: (node: SVGElement, attributes: ElementAttributes) => void;
        pos: (d: [number, number]) => string;
    };
    /**
     * @internal
     * @param o
     * @param clazz
     */
    addOverlayClass(o: Overlay, clazz: string): void;
    /**
     * @internal
     * @param o
     * @param clazz
     */
    removeOverlayClass(o: Overlay, clazz: string): void;
    /**
     * @internal
     * @param o
     * @param params
     * @param extents
     */
    _paintOverlay(o: Overlay, params: any, extents: any): void;
    /**
     * Sets the visibility of some overlay.
     * @param o - Overlay to hide or show
     * @param visible - If true, make the overlay visible, if false, make the overlay invisible.
     */
    setOverlayVisible(o: Overlay, visible: boolean): void;
    /**
     * @internal
     * @param o
     * @param c
     */
    reattachOverlay(o: Overlay, c: Component): void;
    /**
     * @internal
     * @param o
     * @param hover
     */
    setOverlayHover(o: Overlay, hover: boolean): void;
    /**
     * @internal
     * @param o
     */
    destroyOverlay(o: Overlay): void;
    /**
     * @internal
     * @param o
     * @param component
     * @param paintStyle
     * @param absolutePosition
     */
    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    /**
     * @internal
     * @param o
     */
    updateLabel(o: LabelOverlay): void;
    /**
     * @internal
     * @param component
     * @param hover
     */
    setHover(component: Component, hover: boolean): void;
    /**
     * @internal
     * @param connector
     * @param paintStyle
     * @param extents
     */
    paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: Extents): void;
    /**
     * @internal
     * @param connector
     * @param hover
     * @param sourceEndpoint
     */
    setConnectorHover(connector: AbstractConnector, hover: boolean, sourceEndpoint?: Endpoint): void;
    /**
     * @internal
     * @param connection
     */
    destroyConnector(connection: Connection): void;
    /**
     * @internal
     * @param connector
     * @param clazz
     */
    addConnectorClass(connector: AbstractConnector, clazz: string): void;
    /**
     * @internal
     * @param connector
     * @param clazz
     */
    removeConnectorClass(connector: AbstractConnector, clazz: string): void;
    /**
     * @internal
     * @param connector
     */
    getConnectorClass(connector: AbstractConnector): string;
    /**
     * @internal
     * @param connector
     * @param v
     */
    setConnectorVisible(connector: AbstractConnector, v: boolean): void;
    /**
     * @internal
     * @param connector
     * @param t
     */
    applyConnectorType(connector: AbstractConnector, t: TypeDescriptor): void;
    /**
     * @internal
     * @param ep
     * @param c
     */
    addEndpointClass(ep: Endpoint, c: string): void;
    /**
     * @internal
     * @param ep
     * @param t
     */
    applyEndpointType<C>(ep: Endpoint, t: TypeDescriptor): void;
    /**
     * @internal
     * @param ep
     */
    destroyEndpoint(ep: Endpoint): void;
    /**
     * @internal
     * @param ep
     * @param paintStyle
     */
    renderEndpoint(ep: Endpoint, paintStyle: PaintStyle): void;
    /**
     * @internal
     * @param ep
     * @param c
     */
    removeEndpointClass(ep: Endpoint, c: string): void;
    /**
     * @internal
     * @param ep
     */
    getEndpointClass(ep: Endpoint): string;
    /**
     * @internal
     * @param endpoint
     * @param hover
     * @param endpointIndex Optional (though you must provide a value) index that identifies whether the endpoint being hovered is the source
     * or target of some connection. A value for this will be provided whenever the source of the hover event is the connector.
     * @param doNotCascade
     */
    setEndpointHover(endpoint: Endpoint, hover: boolean, endpointIndex: -1 | 0 | 1, doNotCascade?: boolean): void;
    /**
     * @internal
     * @param ep
     * @param v
     */
    setEndpointVisible(ep: Endpoint, v: boolean): void;
    /**
     * @internal
     * @param group
     * @param state
     */
    setGroupVisible(group: UIGroup<Element>, state: boolean): void;
    /**
     * @internal
     * @param connection
     * @param params
     */
    deleteConnection(connection: Connection, params?: DeleteConnectionOptions): boolean;
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
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): ConnectionDragSelector;
    /**
     * Unregister the given source selector.
     * @param selector - Remove the given drag selector from the instance.
     * @public
     */
    removeSourceSelector(selector: ConnectionDragSelector): void;
    /**
     * Manage an element.  Adds the element to the viewport and sets up tracking for endpoints/connections for the element, as well as enabling dragging for the
     * element. This method is called internally by various methods of the jsPlumb instance, such as `connect`, `addEndpoint`, `makeSource` and `makeTarget`,
     * so if you use those methods to setup your UI then you may not need to call this. However, if you use the `addSourceSelector` and `addTargetSelector` methods
     * to configure your UI then you will need to register elements using this method, or they will not be draggable.
     * @param element - Element to manage. This method does not accept a DOM element ID as argument. If you wish to manage elements via their DOM element ID,
     * you should use `manageAll` and pass in an appropriate CSS selector that represents your element, eg `#myElementId`.
     * @param internalId - Optional ID for jsPlumb to use internally. If this is not supplied, one will be created.
     * @param _recalc - Maybe recalculate offsets for the element also. It is not recommended that clients of the API use this parameter; it's used in
     * certain scenarios internally
     */
    manage(element: Element, internalId?: string, _recalc?: boolean): ManagedElement<Element>;
}

export declare class BrowserUITestSupport {
    private _jsPlumb;
    private ok;
    private equal;
    _divs: Array<string>;
    mottle: EventManager;
    private _t;
    constructor(_jsPlumb: BrowserJsPlumbInstance, ok: (b: boolean, m: string) => any, equal: (v1: any, v2: any, m?: string) => any);
    /**
     * Create a div element and append it either to the jsPlumb container or an element of your choosing.
     * @param id Unique ID for the element
     * @param parent If null, the new element is appended to the jsPlumb container. Otherwise the new element is appended to this element.
     * @param className Optional class name for the new element
     * @param x Optional x position. If this is omitted a random value is chosen.
     * @param y Optional y position. If this is omitted a random value is chosen.
     * @param w Optional width for the new element.
     * @param h Optional height for the new element.
     */
    addDiv(id: string, parent?: Element, className?: string, x?: number, y?: number, w?: number, h?: number): Element;
    addDivs(ids: Array<string>, parent?: Element): void;
    assertEndpointCount(el: Element, count: number): void;
    _assertManagedEndpointCount(el: Element, count: number): void;
    _assertManagedConnectionCount(el: Element, count: number): void;
    _registerDiv(div: string): void;
    private makeDragStartEvt;
    getAttribute(el: Element, att: string): string;
    /**
     * Drag an element by a given delta in x and y
     * @param el Element to drag
     * @param x X delta
     * @param y Y delta
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragNodeBy(el: Element, x: number, y: number, events?: EventHandlers): void;
    /**
     * Drag an element to a given x and y location
     * @param el Element to drag
     * @param x X location to drag to
     * @param y Y location to drag to
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragNodeTo(el: Element, x: number, y: number, events?: EventHandlers): void;
    /**
     * Drag an element to a given group
     * @param el Element to drag
     * @param targetGroupId ID of the group to drag to
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragToGroup(el: Element, targetGroupId: string, events?: EventHandlers): void;
    /**
     * Drag an element, asynchronously, by a given delta in x and y. "Asynchronously" here means that the initial mousedown
     * event is fired on the current tick, followed by any `beforeMouseMove` handler, and then a timeout is set, the
     * callback for which performs the mouse move, followed by a call to any `beforeMouseUp` handler.  Then another timeout
     * is set, the callback for which performs the mouseup and calls any `after` handler.
     * @param el Element to drag
     * @param x X delta
     * @param y Y delta
     * @param events Map of lifecycle event handlers
     * @public
     */
    aSyncDragNodeBy(el: Element, x: number, y: number, events?: EventHandlers): void;
    /**
     * Drags a node around, a random number of steps up to 50, by a random delta in x and y each time. After the node has
     * been randomly moved around, a mouseup event is fired.
     * @param el Element to drag around.
     * @param functionToAssertWhileDragging Optional function to call each time the element is moved.
     * @param assertMessage Message to supply to the assert while dragging function.
     * @public
     */
    dragANodeAround(el: HTMLElement, functionToAssertWhileDragging?: () => boolean, assertMessage?: string): void;
    /**
     * Drags a connection, using the mouse, from one element or endpoint to another element or endpoint.
     * @param d1
     * @param d2
     * @param mouseUpOnTarget If true, the mouseup event is posted on the target element. By default the mouseup event is fired on the document.
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    dragConnection(d1: Element | Endpoint, d2: Element | Endpoint, mouseUpOnTarget?: boolean, events?: EventHandlers<Connection>): Connection;
    /**
     * Drags a connection, using the mouse, from one element or endpoint to another element or endpoint, firing each stage after a timeout.
     * @param d1
     * @param d2
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    aSyncDragConnection(d1: Element | Endpoint, d2: Element | Endpoint, events?: EventHandlers<Connection>): void;
    /**
     * Drags a connection from the given endpoint or element, but aborts the operation by triggering a mouseup in whitespace.
     * @param d1
     * @public
     */
    dragAndAbortConnection(d1: Element | Endpoint): void;
    /**
     * Detach a connection from the given Endpoint by synthesizing a mousedown event, dragging to a distant point, and releasing the mouse.
     * @param e Endpoint to detach connection from
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachConnection(e: Endpoint, events?: EventHandlers): void;
    /**
     * Detach and reattach a connection from the given Endpoint by synthesizing a mousedown event, dragging to a distant point,
     * dragging it back to the endpoint, and releasing the mouse.
     * @param e Endpoint to detach and reattach connection from/to
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachAndReattachConnection(e: Endpoint, events?: EventHandlers): void;
    /**
     * Detach a connection by simulating the mouse dragging the target endpoint off and dropping it in whitespace.
     * @param c Connection to detach
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachConnectionByTarget(c: Connection, events?: EventHandlers): void;
    /**
     * Relocate the target of the given connection onto a different element
     * @param conn Connection to relocate target for
     * @param newEl DOM Element to drop the target ontp
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocateTarget(conn: Connection, newEl: Element, events?: EventHandlers): void;
    /**
     * Relocate either the source or the target of the given connection to a different element.
     * @param conn Connection to relocate
     * @param idx 0 for source, 1 for target
     * @param newEl The DOM element to drop the source/target onto.
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocate(conn: Connection, idx: number, newEl: Element, events?: EventHandlers): void;
    /**
     * Relocate the source of the given connection onto a different element
     * @param conn Connection to relocate target for
     * @param newEl DOM Element to drop the target ontp
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocateSource(conn: Connection, newEl: Element, events?: EventHandlers): void;
    /**
     * Create an object that models an event that occurs in the middle of the given element. This does not return
     * a real event, just an object with sufficient properties to use as a mouse event.
     * @param el
     * @public
     */
    makeEvent(el: Element): any;
    /**
     * Gets the DOM element used to represent the given Endpoint.
     * @param epOrEl
     * @public
     */
    getCanvas(epOrEl: any): any;
    /**
     * Gets the DOM element used to represent the given Endpoint.
     * @param ep
     * @public
     */
    getEndpointCanvas(ep: Endpoint): HTMLElement;
    /**
     * Gets the DOM element used to represent the given connection.
     * @param c
     * @public
     */
    getConnectionCanvas(c: Connection): HTMLElement;
    getEndpointCanvasPosition(ep: Endpoint): {
        x: number;
        y: number;
        w: string;
        h: string;
    };
    /**
     * Helper to test that a value is the same as some target, within our tolerance.
     * Sometimes the trigonometry stuff needs a little bit of leeway.
     */
    within(val: number, target: number, msg: string): void;
    /**
     * Asserts that the number of endpoints registered for a given element matches an expectation.
     * @param el Element to assert endpoint count for
     * @param count Expected number of endpoints
     * @public
     */
    assertManagedEndpointCount(el: Element, count: number): void;
    /**
     * Asserts that the number of connections registered for a given element matches an expectation.
     * @param el Element to assert connection count for
     * @param count Expected number of connections
     * @public
     */
    assertManagedConnectionCount(el: Element, count: number): void;
    /**
     * Fire one or more events on the DOM element that represents the given endpoint.
     * @param ep
     * @param events
     * @public
     */
    fireEventOnEndpoint(ep: Endpoint, ...events: Array<string>): void;
    /**
     * Fire one or more events on some DOM element
     * @param e
     * @param events
     * @public
     */
    fireEventOnElement(e: Element, ...events: Array<string>): void;
    /**
     * Fire one or more events on the DOM element that represents the given connection.
     * @param connection
     * @param events
     * @public
     */
    fireEventOnConnection(connection: Connection, ...events: Array<string>): void;
    /**
     * Fire a click event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    clickOnConnection(connection: Connection): void;
    /**
     * Fire a double click event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    dblClickOnConnection(connection: Connection): void;
    /**
     * Fire a tap event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    tapOnConnection(connection: Connection): void;
    /**
     * Fire a double tap event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    dblTapOnConnection(connection: Connection): void;
    /**
     * Fire a click event on the given element
     * @param element Element to fire click event on
     * @param clickCount Does not cause the event to be fired this number of times, but is set on the resulting Event object.
     * In some testing scenarios this ability is useful.
     * @public
     */
    clickOnElement(element: Element, clickCount?: number): void;
    /**
     * Fire a double click event on the given element
     * @param element
     * @public
     */
    dblClickOnElement(element: Element): void;
    /**
     * Fire a tap event (mousedown + mouseup) on the given element
     * @param element
     * @public
     */
    tapOnElement(element: Element): void;
    /**
     * Fire a double tap event (mousedown + mouseup, twice) on the given element
     * @param element
     * @public
     */
    dblTapOnElement(element: Element): void;
    /**
     * Gets the DOM element that represents the given overlay.
     * @param overlay
     * @public
     */
    getOverlayCanvas(overlay: Overlay): any;
    /**
     * Fire an event on an connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @param event Event to fire.
     * @public
     */
    fireEventOnOverlay(connection: Connection, overlayId: string, event: string): void;
    /**
     * Fire a click event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    clickOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Fire a double click event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    dblClickOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Fire a tap event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    tapOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Fire a double tap event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    dblTapOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Cleanup the support class, removing all created divs and destroying the associated jsplumb instance.
     */
    cleanup(): void;
    /**
     * Make a text node
     * @param s
     */
    makeContent(s: string): ChildNode;
    /**
     * Get the number of keys in an object
     * @param obj
     */
    length(obj: any): number;
    /**
     * Get the value corresponding to the first key found in an object.
     * @param obj
     */
    head(obj: any): any;
    /**
     * Get a UUID.
     */
    uuid(): string;
}

export declare const CHECK_CONDITION = "checkCondition";

export declare const CHECK_DROP_ALLOWED = "checkDropAllowed";

export declare const CLASS_CONNECTED = "jtk-connected";

export declare const CLASS_CONNECTOR = "jtk-connector";

export declare const CLASS_CONNECTOR_OUTLINE = "jtk-connector-outline";

export declare const CLASS_DELEGATED_DRAGGABLE = "jtk-delegated-draggable";

export declare const CLASS_DRAG_ACTIVE = "jtk-drag-active";

export declare const CLASS_DRAG_CONTAINER = "jtk-drag";

export declare const CLASS_DRAG_HOVER = "jtk-drag-hover";

export declare const CLASS_DRAGGABLE = "jtk-draggable";

export declare const CLASS_DRAGGED = "jtk-dragged";

export declare const CLASS_ENDPOINT = "jtk-endpoint";

export declare const CLASS_ENDPOINT_ANCHOR_PREFIX = "jtk-endpoint-anchor";

export declare const CLASS_ENDPOINT_CONNECTED = "jtk-endpoint-connected";

export declare const CLASS_ENDPOINT_DROP_ALLOWED = "jtk-endpoint-drop-allowed";

export declare const CLASS_ENDPOINT_DROP_FORBIDDEN = "jtk-endpoint-drop-forbidden";

export declare const CLASS_ENDPOINT_FLOATING = "jtk-floating-endpoint";

export declare const CLASS_ENDPOINT_FULL = "jtk-endpoint-full";

export declare const CLASS_GHOST_PROXY = "jtk-ghost-proxy";

export declare const CLASS_GROUP_COLLAPSED = "jtk-group-collapsed";

export declare const CLASS_GROUP_EXPANDED = "jtk-group-expanded";

export declare const CLASS_OVERLAY = "jtk-overlay";

/**
 * @internal
 */
export declare type ClassAction = typeof ADD_CLASS_ACTION | typeof REMOVE_CLASS_ACTION;

export declare function classList(...className: Array<string>): string;

/**
 * Makes a copy of the given object.
 * @param a
 * @internal
 */
export declare function clone(a: any): any;

export declare function cls(...className: Array<string>): string;

export declare class Collicat implements jsPlumbDragManager {
    eventManager: EventManager;
    private zoom;
    css: Record<string, string>;
    inputFilterSelector: string;
    positioningStrategy: PositioningStrategy;
    _positionSetter: SetPositionFunction;
    _positionGetter: GetPositionFunction;
    _sizeSetter: SetSizeFunction;
    _sizeGetter: GetSizeFunction;
    constructor(options?: CollicatOptions);
    getPosition(el: Element): PointXY;
    setPosition(el: Element, p: PointXY): void;
    getSize(el: Element): Size;
    getZoom(): number;
    setZoom(z: number): void;
    private _prepareParams;
    /**
     * Gets the selector identifying which input elements to filter from drag events.
     * @returns Current input filter selector.
     */
    getInputFilterSelector(): string;
    /**
     * Sets the selector identifying which input elements to filter from drag events.
     * @param selector Input filter selector to set.
     * @returns Current instance; method may be chained.
     */
    setInputFilterSelector(selector: string): this;
    draggable(el: jsPlumbDOMElement, params: DragParams): Drag;
    destroyDraggable(el: jsPlumbDOMElement): void;
}

export declare interface CollicatOptions {
    zoom?: number;
    css?: Record<string, string>;
    inputFilterSelector?: string;
    positioningStrategy?: PositioningStrategy;
}

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

/**
 * @internal
 */
export declare interface ComponentOptions {
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

export declare type ComponentParameters = Record<string, any>;

/**
 * Base interface for type descriptors for internal methods.
 * @internal
 */
export declare interface ComponentTypeDescriptor extends TypeDescriptorBase {
    overlays: Record<string, OverlaySpec>;
}

export declare function compoundEvent(stem: string, event: string, subevent?: string): string;

export declare function computeBezierLength(curve: Curve): number;

export declare type ComputedBlankEndpoint = [number, number, number, number];

export declare type ComputedDotEndpoint = [number, number, number, number, number];

/**
 * @internal
 */
export declare interface ComputedPosition {
    curX: number;
    curY: number;
    ox: AnchorOrientationHint;
    oy: AnchorOrientationHint;
    x: number;
    y: number;
}

export declare type ComputedRectangleEndpoint = [number, number, number, number];

/**
 * @public
 */
export declare const CONNECTION = "connection";

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
    /**
     * @internal
     * @param connectorSpec
     * @param doNotRepaint
     * @param doNotChangeListenerComponent
     * @param typeId
     */
    _setConnector(connectorSpec: ConnectorSpec, doNotRepaint?: boolean, doNotChangeListenerComponent?: boolean, typeId?: string): void;
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
    def: SourceOrTargetDefinition;
    exclude: boolean;
    readonly id: string;
    redrop: RedropPolicy;
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
    /**
     * Whether or not connections of this type should be detachable with the mouse. Defaults to true.
     */
    detachable?: boolean;
    /**
     * Whether or not when a user detaches a connection of this type it should be automatically
     * reattached. Defaults to false.
     */
    reattach?: boolean;
    /**
     * Specs for the [source, target] endpoints for connections of this type.
     */
    endpoints?: [EndpointSpec, EndpointSpec];
}

/**
 * High level definition of a Connector.
 * @public
 */
export declare interface Connector {
    /**
     * The connector's type.
     */
    type: string;
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

/**
 * Alias for the use case that a Connector is referenced just by its `type`.
 * @public
 */
export declare type ConnectorId = string;

/**
 * Common options for connectors.
 * @public
 */
export declare interface ConnectorOptions extends Record<string, any> {
    /**
     * Stub defines a number of pixels that the connector travels away from its element before the connector's actual path begins.
     */
    stub?: number | number[];
    /**
     * Defines a number of pixels between the end of the connector and its anchor point. Defaults to zero.
     */
    gap?: number;
    /**
     * Optional class to set on the element used to render the connector.
     */
    cssClass?: string;
    /**
     * Optional class to set on the element used to render the connector when the mouse is hovering over the connector.
     */
    hoverClass?: string;
}

export declare const Connectors: {
    get: (connection: Connection, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};

/**
 * Specification of a connector - either the type id of some Connector, a type+options object.
 * @public
 */
export declare type ConnectorSpec = ConnectorId | ConnectorWithOptions;

/**
 * Connector spec in the form `{type:.., options:{.. }}`
 * @public
 */
export declare type ConnectorWithOptions = {
    type: ConnectorId;
    options: ConnectorOptions;
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
    /**
     * Optional extra parameters to associate with the connection
     */
    parameters?: Record<string, any>;
    id?: string;
    data?: any;
    cssClass?: string;
    hoverClass?: string;
    outlineColor?: string;
    outlineWidth?: number;
    color?: string;
    lineWidth?: number;
    scope?: string;
}

/**
 * Definition of a function that can be used to constrain the movemement of an element that is being dragged. The function is
 * given the "desiredLoc", which is the location the element would be moved to if not constrained, and it is expected to return
 * either some other value, meaning place the element at that position, or null, meaning for the given desired location there
 * is no preferred position and the element should not be moved.
 *
 * @param desiredLoc - Position the element will be placed at if unconstrained
 * @param dragEl - the element that is being dragged
 * @param constrainRect - The size of any parent drag area
 * @param size - The size of the element being dragged
 * @param e - The mouse event associated with this tick of the drag lifecycle.
 */
export declare type ConstrainFunction = (desiredLoc: PointXY, dragEl: HTMLElement, constrainRect: Size, size: Size, e: MouseEvent) => PointXY;

/**
 * Defines an object that has a constructor. Used internally to create endpoints/connectors/overlays from their names.
 * Exposed as public for people to create their own endpoints/connectors/overlays.
 * @public
 */
export declare type Constructable<T> = {
    new (...args: any[]): T;
};

/**
 * Consume the given event, using `stopPropagation()` if present or `returnValue` if not, and optionally
 * also calling `preventDefault()`.
 * @param e
 * @param doNotPreventDefault
 */
export declare function consume(e: Event, doNotPreventDefault?: boolean): void;

export declare enum ContainmentType {
    notNegative = "notNegative",
    parent = "parent",
    parentEnclosed = "parentEnclosed"
}

/**
 * Convert the given input into an object in the form of a `FullOverlaySpec`
 * @param spec
 */
export declare function convertToFullOverlaySpec(spec: string | OverlaySpec): FullOverlaySpec;

export declare function createElement(tag: string, style?: Record<string, any>, clazz?: string, atts?: Record<string, string>): jsPlumbDOMElement;

export declare function createElementNS(ns: string, tag: string, style?: Record<string, any>, clazz?: string, atts?: Record<string, string | number>): jsPlumbDOMElement;

export declare function createFloatingAnchor(instance: JsPlumbInstance, element: Element, elementId: string): LightweightFloatingAnchor;

export declare function _createPerimeterAnchor(params: Record<string, any>): LightweightPerimeterAnchor;

/**
 * Create an instance of BrowserUITestSupport, using the given functions for testing boolean and equality.
 * @param instance - The jsPlumb instance to attach to.
 * @param ok - A function that tests a boolean.
 * @param equal - A function that tests for equality.
 * @public
 */
export declare function createTestSupportInstance(instance: BrowserJsPlumbInstance, ok: (b: boolean, msg: string) => any, equal: (v1: any, v2: any, m?: string) => any): BrowserUITestSupport;

/**
 * Create an instance of BrowserUITestSupport that uses QUnit, a now venerable testing framework, admittedly, but one
 * which jsPlumb still uses.
 * @param instance - The jsPlumb instance to attach to.
 * @public
 */
export declare function createTestSupportInstanceQUnit(instance: BrowserJsPlumbInstance): BrowserUITestSupport;

export declare type Curve = Array<PointXY>;

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
 * @public
 */
export declare interface CustomOverlayOptions extends OverlayOptions {
    create: (c: Component) => any;
}

/**
 * Constant used im various places internally, and in the Toolkit edition used as the key for default node, edge, port and group definitions.
 * @public
 */
export declare const DEFAULT = "default";

export declare const DEFAULT_KEY_ALLOW_NESTED_GROUPS = "allowNestedGroups";

export declare const DEFAULT_KEY_ANCHOR = "anchor";

export declare const DEFAULT_KEY_ANCHORS = "anchors";

export declare const DEFAULT_KEY_CONNECTION_OVERLAYS = "connectionOverlays";

export declare const DEFAULT_KEY_CONNECTIONS_DETACHABLE = "connectionsDetachable";

export declare const DEFAULT_KEY_CONNECTOR = "connector";

export declare const DEFAULT_KEY_CONTAINER = "container";

export declare const DEFAULT_KEY_ENDPOINT = "endpoint";

export declare const DEFAULT_KEY_ENDPOINT_HOVER_STYLE = "endpointHoverStyle";

export declare const DEFAULT_KEY_ENDPOINT_HOVER_STYLES = "endpointHoverStyles";

export declare const DEFAULT_KEY_ENDPOINT_OVERLAYS = "endpointOverlays";

export declare const DEFAULT_KEY_ENDPOINT_STYLE = "endpointStyle";

export declare const DEFAULT_KEY_ENDPOINT_STYLES = "endpointStyles";

export declare const DEFAULT_KEY_ENDPOINTS = "endpoints";

export declare const DEFAULT_KEY_HOVER_CLASS = "hoverClass";

export declare const DEFAULT_KEY_HOVER_PAINT_STYLE = "hoverPaintStyle";

export declare const DEFAULT_KEY_LIST_STYLE = "listStyle";

export declare const DEFAULT_KEY_MAX_CONNECTIONS = "maxConnections";

export declare const DEFAULT_KEY_PAINT_STYLE = "paintStyle";

export declare const DEFAULT_KEY_REATTACH_CONNECTIONS = "reattachConnections";

export declare const DEFAULT_KEY_SCOPE = "scope";

export declare const DEFAULT_LIST_OPTIONS: {
    deriveAnchor: (edge: SupportedEdge, index: number, ep: Endpoint, conn: Connection) => string;
};

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

export declare function dist(p1: PointXY, p2: PointXY): number;

export declare type DistanceFromCurve = {
    location: number;
    distance: number;
};

/**
 * Calculates the distance that the given point lies from the given Bezier.  Note that it is computed relative to the center of the Bezier,
 * so if you have stroked the curve with a wide pen you may wish to take that into account!  The distance returned is relative to the values
 * of the curve and the point - it will most likely be pixels.
 *
 * @param point - a point in the form {x:567, y:3342}
 * @param curve - a Bezier curve: an Array of PointXY objects. Note that this is currently
 * hardcoded to assume cubix beziers, but would be better off supporting any degree.
 * @returns a JS object literal containing location and distance. Location is analogous to the location
 * argument you pass to the pointOnPath function: it is a ratio of distance travelled along the curve.  Distance is the distance in pixels from
 * the point to the curve.
 * @public
 */
export declare function distanceFromCurve(point: PointXY, curve: Curve): DistanceFromCurve;

export declare class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {
    radius: number;
    defaultOffset: number;
    defaultInnerRadius: number;
    constructor(endpoint: Endpoint, params?: DotEndpointParams);
    static type: string;
    type: string;
}

export declare const DotEndpointHandler: EndpointHandler<DotEndpoint, ComputedDotEndpoint>;

/**
 * @public
 */
export declare interface DotEndpointParams extends EndpointRepresentationParams {
    radius?: number;
}

export declare class Drag extends Base {
    _class: string;
    rightButtonCanDrag: boolean;
    consumeStartEvent: boolean;
    clone: boolean;
    scroll: boolean;
    trackScroll: boolean;
    private _downAt;
    private _posAtDown;
    private _pagePosAtDown;
    private _pageDelta;
    private _moving;
    private _lastPosition;
    private _lastScrollValues;
    private _initialScroll;
    _size: Size;
    private _currentParentPosition;
    private _ghostParentPosition;
    private _dragEl;
    private _multipleDrop;
    private _ghostProxyOffsets;
    private _ghostDx;
    private _ghostDy;
    _isConstrained: boolean;
    _ghostProxyParent: jsPlumbDOMElement;
    _useGhostProxy: Function;
    _ghostProxyFunction: GhostProxyGenerator;
    _activeSelectorParams: DragParams;
    _availableSelectors: Array<DragParams>;
    _canDrag: Function;
    private _consumeFilteredEvents;
    private _parent;
    private _ignoreZoom;
    _filters: Record<string, [Function, boolean]>;
    _constrainRect: {
        w: number;
        h: number;
    };
    _elementToDrag: jsPlumbDOMElement;
    downListener: (e: MouseEvent) => void;
    moveListener: (e: MouseEvent) => void;
    upListener: (e?: MouseEvent) => void;
    scrollTracker: (e: Event) => void;
    listeners: Record<string, Array<Function>>;
    constructor(el: jsPlumbDOMElement, params: DragParams, manager: Collicat);
    private _trackScroll;
    on(evt: string, fn: Function): void;
    off(evt: string, fn: Function): void;
    private _upListener;
    private _downListener;
    private _moveListener;
    /**
     * Gets the delta between the mouse location of the down event that instigated a drag and the page location
     * of the element that is being dragged. For internal use.
     * @internal
     */
    getDragDelta(): PointXY;
    private mark;
    private unmark;
    moveBy(dx: number, dy: number, e?: MouseEvent): void;
    abort(): void;
    getDragElement(retrieveOriginalElement?: boolean): jsPlumbDOMElement;
    stop(e?: MouseEvent, force?: boolean): void;
    private _dispatch;
    private resolveGrid;
    /**
     * Snap the given position to a grid, if the active selector has declared a grid.
     * @param pos
     */
    private toGrid;
    setUseGhostProxy(val: boolean): void;
    private _doConstrain;
    _testFilter(e: any): boolean;
    addFilter(f: Function | string, _exclude?: boolean): void;
    removeFilter(f: Function | string): void;
    clearAllFilters(): void;
    addSelector(params: DragHandlerOptions, atStart?: boolean): void;
    destroy(): void;
}

export declare interface DragEventParams extends DragStartEventParams {
    originalPos: PointXY;
}

export declare type DraggedElement = {
    el: jsPlumbDOMElement;
    id: string;
    pos: PointXY;
    originalPos: PointXY;
    originalGroup: UIGroup;
    redrawResult: RedrawResult;
    reverted: boolean;
    dropGroup: UIGroup;
};

declare type DragGroup = {
    id: string;
    members: Set<DragGroupMemberSpec>;
};

declare type DragGroupMemberSpec = {
    el: jsPlumbDOMElement;
    elId: string;
    active: boolean;
};

/**
 * Definition of a drag group membership - either just the id of a drag group, or the id of a drag group and whether or not
 * this element plays an `active` role in the drag group.
 * @public
 */
export declare type DragGroupSpec = string | {
    id: string;
    active: boolean;
};

export declare interface DragHandler {
    selector: string;
    onStart: (params: DragStartEventParams) => boolean;
    onDrag: (params: DragEventParams) => void;
    onStop: (params: DragStopEventParams) => void;
    onDragInit: (el: Element, e: MouseEvent) => Element;
    onDragAbort: (el: Element) => void;
    reset: () => void;
    init: (drag: Drag) => void;
    onBeforeStart?: (beforeStartParams: BeforeStartEventParams) => void;
}

export declare interface DragHandlerOptions {
    selector?: string;
    start?: (p: DragStartEventParams) => any;
    stop?: (p: DragStopEventParams) => any;
    drag?: (p: DragEventParams) => any;
    beforeStart?: (beforeStartParams: BeforeStartEventParams) => void;
    dragInit?: (el: Element, e: MouseEvent) => any;
    dragAbort?: (el: Element) => any;
    ghostProxy?: GhostProxyGenerator | boolean;
    makeGhostProxy?: GhostProxyGenerator;
    useGhostProxy?: (container: any, dragEl: jsPlumbDOMElement) => boolean;
    ghostProxyParent?: Element;
    constrainFunction?: ConstrainFunction | boolean;
    revertFunction?: RevertFunction;
    filter?: string;
    filterExclude?: boolean;
    snapThreshold?: number;
    grid?: Grid;
    containment?: ContainmentType;
    containmentPadding?: number;
}

export declare class DragManager {
    protected instance: BrowserJsPlumbInstance;
    protected dragSelection: DragSelection;
    private collicat;
    private drag;
    _draggables: Record<string, any>;
    _dlist: Array<any>;
    _elementsWithEndpoints: Record<string, any>;
    _draggablesForElements: Record<string, any>;
    handlers: Array<{
        handler: DragHandler;
        options: DragHandlerOptions;
    }>;
    private _trackScroll;
    private _filtersToAdd;
    constructor(instance: BrowserJsPlumbInstance, dragSelection: DragSelection, options?: DragManagerOptions);
    addHandler(handler: DragHandler, dragOptions?: DragHandlerOptions): void;
    addSelector(params: DragHandlerOptions, atStart?: boolean): void;
    addFilter(filter: Function | string, exclude?: boolean): void;
    removeFilter(filter: Function | string): void;
    setFilters(filters: Array<[string, boolean]>): void;
    reset(): Array<[string, boolean]>;
    setOption(handler: DragHandler, options: DragHandlerOptions): void;
}

export declare interface DragManagerOptions {
    trackScroll?: boolean;
}

/**
 * Payload for `drag:move` event.
 * @public
 */
export declare interface DragMovePayload extends DragPayload {
}

export declare interface DragOptions {
    containment?: ContainmentType;
    start?: (params: DragStartEventParams) => void;
    drag?: (params: DragEventParams) => void;
    stop?: (params: DragStopEventParams) => void;
    beforeStart?: (params: BeforeStartEventParams) => void;
    cursor?: string;
    zIndex?: number;
    grid?: Grid;
    trackScroll?: boolean;
    filter?: string;
}

export declare interface DragParams extends DragHandlerOptions {
    rightButtonCanDrag?: boolean;
    consumeStartEvent?: boolean;
    clone?: boolean;
    scroll?: boolean;
    trackScroll?: boolean;
    multipleDrop?: boolean;
    canDrag?: Function;
    consumeFilteredEvents?: boolean;
    events?: Record<string, Function>;
    parent?: any;
    ignoreZoom?: boolean;
    scope?: string;
}

/**
 * Base payload for drag events. Contains the element being dragged, the corresponding mouse event, the current position, and the position when drag started.
 */
export declare interface DragPayload {
    el: Element;
    e: Event;
    pos: PointXY;
    originalPosition: PointXY;
    payload?: Record<string, any>;
}

declare class DragSelection {
    private instance;
    private _dragSelection;
    private _dragSizes;
    private _dragElements;
    private _dragElementStartPositions;
    private _dragElementPositions;
    private __activeSet;
    private get _activeSet();
    constructor(instance: BrowserJsPlumbInstance);
    get length(): number;
    filterActiveSet(fn: (p: {
        id: string;
        jel: jsPlumbDOMElement;
    }) => boolean): void;
    /**
     * Reset all computed values and remove all elements from the selection.
     */
    clear(): void;
    /**
     * Reset all computed values. Does not remove elements from the selection. Use `clear()` for that. This method is intended for
     * use after (or before) a drag.
     * @internal
     */
    reset(): void;
    initialisePositions(): void;
    updatePositions(currentPosition: PointXY, originalPosition: PointXY, callback: (el: jsPlumbDOMElement, id: string, s: Size, b: BoundingBox) => any): void;
    /**
     * Iterate through the contents of the drag selection and execute the given function on each entry.
     * @param f
     */
    each(f: (el: jsPlumbDOMElement, id: string, o: PointXY, s: Size, originalPosition: PointXY) => any): void;
    add(el: Element, id?: string): void;
    remove(el: Element): void;
    toggle(el: Element): void;
}

export declare interface DragStartEventParams {
    e: MouseEvent;
    el: jsPlumbDOMElement;
    pos: PointXY;
    drag: Drag;
    size: Size;
}

/**
 * Payload for `drag:start` event.
 * @public
 */
export declare interface DragStartPayload extends DragPayload {
    dragGroup?: DragGroup;
    dragGroupMemberSpec?: DragGroupMemberSpec;
}

export declare interface DragStopEventParams extends DragEventParams {
    finalPos: PointXY;
    selection: Array<[jsPlumbDOMElement, PointXY, Drag, Size]>;
}

/**
 * Payload for `drag:stop` event. In addition to the base payload, contains a redraw result object, listing all the connections and endpoints that were affected by the drag.
 * @public
 */
export declare interface DragStopPayload {
    elements: Array<DraggedElement>;
    e: Event;
    el: Element;
    payload?: Record<string, any>;
}

/**
 * Iterates through the given `obj` and applies the given function. if `obj` is not ArrayLike then the function is
 * executed directly on `obj`.
 * @param obj
 * @param fn
 * @internal
 */
export declare function each(obj: any, fn: Function): void;

/**
 * @public
 */
export declare const ELEMENT = "element";

/**
 * @public
 */
export declare const ELEMENT_DIV = "div";

declare type ElementAttributes = Record<string, string | number>;

export declare class ElementDragHandler implements DragHandler {
    protected instance: BrowserJsPlumbInstance;
    protected _dragSelection: DragSelection;
    selector: string;
    private _dragOffset;
    private _groupLocations;
    protected _intersectingGroups: Array<IntersectingGroup>;
    private _currentDragParentGroup;
    private _dragGroupByElementIdMap;
    private _dragGroupMap;
    private _currentDragGroup;
    private _currentDragGroupOffsets;
    private _currentDragGroupSizes;
    private _currentDragGroupOriginalPositions;
    private _dragPayload;
    protected drag: Drag;
    originalPosition: PointXY;
    constructor(instance: BrowserJsPlumbInstance, _dragSelection: DragSelection);
    onDragInit(el: Element): Element;
    onDragAbort(el: Element): void;
    protected getDropGroup(): IntersectingGroup | null;
    onStop(params: DragStopEventParams): void;
    private _cleanup;
    reset(): void;
    init(drag: Drag): void;
    onDrag(params: DragEventParams): void;
    private _computeOffsetByParentGroup;
    onStart(params: {
        e: MouseEvent;
        el: jsPlumbDOMElement;
        pos: PointXY;
        drag: Drag;
    }): boolean;
    /**
     * @internal
     */
    addToDragGroup(spec: DragGroupSpec, ...els: Array<Element>): void;
    /**
     * @internal
     */
    removeFromDragGroup(...els: Array<Element>): void;
    /**
     * @internal
     */
    setDragGroupState(active: boolean, ...els: Array<Element>): void;
    /**
     * @internal
     * @param name
     */
    clearDragGroup(name: string): void;
    /**
     * Perhaps prune or orphan the element represented by the given drag params.
     * @param params
     * @param doNotTransferToAncestor Used when dealing with nested groups. When true, it means remove the element from any groups; when false, which is
     * the default, elements that are orphaned will be added to this group's ancestor, if it has one.
     * @param isDefinitelyNotInsideParent Used internally when this method is called and we've already done an intersections test. This flag saves us repeating the calculation.
     * @internal
     */
    private _pruneOrOrphan;
}

export declare type ElementSelectionSpecifier<E> = E | Array<E> | '*';

export declare type ElementType = keyof typeof ElementTypes;

export declare enum ElementTypes {
    SVG = "SVG",
    HTML = "HTML"
}

/**
 * Returns an empty bounds object, used in certain initializers internally.
 * @internal
 */
export declare function EMPTY_BOUNDS(): Extents;

/**
 * Calculates whether or not r2 is completely enclosed by r1.
 * @param r1 First rectangle
 * @param r2 Second rectangle
 * @param [allowSharedEdges=false] If true, the concept of enclosure allows for one or more edges to be shared by the two rectangles.
 * @returns True if r1 encloses r2, false otherwise.
 * @public
 */
export declare function encloses(r1: RectangleXY, r2: RectangleXY, allowSharedEdges?: boolean): boolean;

/**
 * @public
 */
export declare const ENDPOINT = "endpoint";

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
    get: (ep: Endpoint, name: string, params: any) => EndpointRepresentation<any>;
    clone: <C>(epr: EndpointRepresentation<C>) => EndpointRepresentation<C>;
    compute: <T>(endpoint: EndpointRepresentation<T>, anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any) => T;
    registerHandler: <E, T_1>(eph: EndpointHandler<E, T_1>) => void;
};

export declare interface EndpointHandler<E, T> {
    type: string;
    compute: EndpointComputeFunction<T>;
    getParams(endpoint: E): Record<string, any>;
    cls: Constructable<EndpointRepresentation<T>>;
}

export declare type EndpointHelperFunctions<E> = {
    makeNode: (ep: E, paintStyle: PaintStyle) => void;
    updateNode: (ep: E, node: SVGElement) => void;
};

/**
 * @public
 */
export declare type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;

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
 * @public
 */
export declare type EndpointParams = any;

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

/**
 * @public
 */
export declare interface EndpointRepresentationParams {
    cssClass?: string;
}

export declare class EndpointSelection extends SelectionBase<Endpoint> {
    setEnabled(e: boolean): EndpointSelection;
    setAnchor(a: AnchorSpec): EndpointSelection;
    deleteEveryConnection(): EndpointSelection;
    deleteAll(): EndpointSelection;
}

/**
 * @public
 */
export declare type EndpointSpec = EndpointId | FullEndpointSpec;

/**
 * @public
 */
export declare interface EndpointStyle extends PaintStyle, Record<string, any> {
}

/**
 * Definition of an endpoint type.
 * @public
 */
export declare interface EndpointTypeDescriptor extends TypeDescriptor {
    /**
     * Whether or not connections created from this endpoint should be detachable via the mouse. Defaults to true.
     */
    connectionsDetachable?: boolean;
    /**
     * Whether or not when a user detaches a connection that was created from this endpoint it should be automatically
     * reattached. Defaults to false.
     */
    reattachConnections?: boolean;
    /**
     * Maximum number of connections this endpoint can support. Defaults to 1. A value of -1 means unlimited.
     */
    maxConnections?: number;
}

export declare const ERROR_SOURCE_DOES_NOT_EXIST = "Cannot establish connection: source does not exist";

export declare const ERROR_SOURCE_ENDPOINT_FULL = "Cannot establish connection: source endpoint is full";

export declare const ERROR_TARGET_DOES_NOT_EXIST = "Cannot establish connection: target does not exist";

export declare const ERROR_TARGET_ENDPOINT_FULL = "Cannot establish connection: target endpoint is full";

export declare const EVENT_ANCHOR_CHANGED = "anchor:changed";

export declare const EVENT_BEFORE_START = "beforeStart";

/**
 * @public
 */
export declare const EVENT_CLICK = "click";

export declare const EVENT_CONNECTION = "connection";

/**
 * @public
 */
export declare const EVENT_CONNECTION_ABORT = "connection:abort";

/**
 * @public
 */
export declare const EVENT_CONNECTION_CLICK: string;

/**
 * @public
 */
export declare const EVENT_CONNECTION_CONTEXTMENU: string;

/**
 * @public
 */
export declare const EVENT_CONNECTION_DBL_CLICK: string;

/**
 * @public
 */
export declare const EVENT_CONNECTION_DBL_TAP: string;

export declare const EVENT_CONNECTION_DETACHED = "connection:detach";

/**
 * @public
 */
export declare const EVENT_CONNECTION_DRAG = "connection:drag";

/**
 * @public
 */
export declare const EVENT_CONNECTION_MOUSEDOWN: string;

/**
 * @public
 */
export declare const EVENT_CONNECTION_MOUSEOUT: string;

/**
 * @public
 */
export declare const EVENT_CONNECTION_MOUSEOVER: string;

/**
 * @public
 */
export declare const EVENT_CONNECTION_MOUSEUP: string;

export declare const EVENT_CONNECTION_MOVED = "connection:move";

/**
 * @public
 */
export declare const EVENT_CONNECTION_TAP: string;

export declare const EVENT_CONTAINER_CHANGE = "container:change";

/**
 * @public
 */
export declare const EVENT_CONTEXTMENU = "contextmenu";

/**
 * @public
 */
export declare const EVENT_DBL_CLICK = "dblclick";

/**
 * @public
 */
export declare const EVENT_DBL_TAP = "dbltap";

export declare const EVENT_DRAG = "drag";

/**
 * @public
 */
export declare const EVENT_DRAG_MOVE = "drag:move";

/**
 * @public
 */
export declare const EVENT_DRAG_START = "drag:start";

/**
 * @public
 */
export declare const EVENT_DRAG_STOP = "drag:stop";

export declare const EVENT_DROP = "drop";

/**
 * @public
 */
export declare const EVENT_ELEMENT_CLICK: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_CONTEXTMENU: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_DBL_CLICK: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_DBL_TAP: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_MOUSE_DOWN: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_MOUSE_MOVE: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_MOUSE_OUT: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_MOUSE_OVER: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_MOUSE_UP: string;

/**
 * @public
 */
export declare const EVENT_ELEMENT_TAP: string;

/**
 * @public
 */
export declare const EVENT_ENDPOINT_CLICK: string;

/**
 * @public
 */
export declare const EVENT_ENDPOINT_DBL_CLICK: string;

/**
 * @public
 */
export declare const EVENT_ENDPOINT_DBL_TAP: string;

/**
 * @public
 */
export declare const EVENT_ENDPOINT_MOUSEDOWN: string;

/**
 * @public
 */
export declare const EVENT_ENDPOINT_MOUSEOUT: string;

/**
 * @public
 */
export declare const EVENT_ENDPOINT_MOUSEOVER: string;

/**
 * @public
 */
export declare const EVENT_ENDPOINT_MOUSEUP: string;

export declare const EVENT_ENDPOINT_REPLACED = "endpoint:replaced";

/**
 * @public
 */
export declare const EVENT_ENDPOINT_TAP: string;

/**
 * @public
 */
export declare const EVENT_FOCUS = "focus";

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

/**
 * @public
 */
export declare const EVENT_MOUSEDOWN = "mousedown";

/**
 * @public
 */
export declare const EVENT_MOUSEENTER = "mouseenter";

/**
 * @public
 */
export declare const EVENT_MOUSEEXIT = "mouseexit";

/**
 * @public
 */
export declare const EVENT_MOUSEMOVE = "mousemove";

/**
 * @public
 */
export declare const EVENT_MOUSEOUT = "mouseout";

/**
 * @public
 */
export declare const EVENT_MOUSEOVER = "mouseover";

/**
 * @public
 */
export declare const EVENT_MOUSEUP = "mouseup";

export declare const EVENT_NESTED_GROUP_ADDED = "group:nested:added";

export declare const EVENT_NESTED_GROUP_REMOVED = "group:nested:removed";

export declare const EVENT_OUT = "out";

export declare const EVENT_OVER = "over";

/**
 * @public
 */
export declare const EVENT_REVERT = "revert";

export declare const EVENT_SCROLL = "scroll";

export declare const EVENT_START = "start";

export declare const EVENT_STOP = "stop";

/**
 * @public
 */
export declare const EVENT_TAP = "tap";

/**
 * @public
 */
export declare const EVENT_TOUCHEND = "touchend";

/**
 * @public
 */
export declare const EVENT_TOUCHMOVE = "touchmove";

/**
 * @public
 */
export declare const EVENT_TOUCHSTART = "touchstart";

export declare const EVENT_UNMANAGE_ELEMENT = "element:unmanage";

export declare const EVENT_ZOOM = "zoom";

/**
 * Base class for classes that wish to support binding and firing of events.
 *
 * @remarks You need to implement the `shouldFireEvent` method in your concrete subclasses of this class, or you can
 * instead extend from `OptimisticEventGenerator`, which has a default implementation of `shouldFireEvent` that returns true.
 *
 * @public
 */
export declare abstract class EventGenerator {
    private _listeners;
    private eventsSuspended;
    private tick;
    private eventsToDieOn;
    private queue;
    protected abstract shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    constructor();
    /**
     * Fire the named event.
     * @param event Event to fire
     * @param value Value to pass to event handlers
     * @param originalEvent Optional original event that caused this event to be fired.
     * @public
     */
    fire<T>(event: string, value?: T, originalEvent?: Event): any;
    /**
     * Drain the queue of pending event notifications
     * @internal
     */
    private _drain;
    /**
     * Unbind the given event listener, or all listeners. If you call this method with no arguments then all event
     * listeners are unbound.
     * @param eventOrListener Either an event name, or an event handler function
     * @param listener If `eventOrListener` is defined, this is the event handler to unbind.
     * @public
     */
    unbind(eventOrListener?: string | Function, listener?: Function): EventGenerator;
    /**
     * Gets all listeners for the given named event.
     * @param forEvent
     * @public
     */
    getListener(forEvent: string): Array<any>;
    /**
     * Returns whether not event firing is currently suspended
     * @public
     */
    isSuspendEvents(): boolean;
    /**
     * Sets whether not event firing is currently suspended
     * @public
     */
    setSuspendEvents(val: boolean): void;
    /**
     * Bind an event listener. This method can be used with a type parameter by call sites; although it's not necessary it can be
     * helpful to use this to ensure you've thought about what the payload to your event handler is going to be.
     * @param event Name of the event(s) to bind to.
     * @param listener Function to bind to the given event(s)
     * @param insertAtStart Whether or not to insert this listener at the head of the listener queue. Defaults to false.
     * @public
     */
    bind<T = any>(event: string | Array<String>, listener: (a: T, e?: any) => any, insertAtStart?: boolean): EventGenerator;
    /**
     * Run the given function without firing any events.
     * @param fn
     * @public
     */
    silently(fn: Function): void;
}

/**
 * Defines a set of event handlers that can be supplied to various methods that simulate mouse activity.  Using these
 * you can inject tests into various parts of the lifecycle of a given operation.
 * @public
 */
export declare interface EventHandlers<T = any> {
    /**
     * Called before any activity occurs.
     */
    before?: () => any;
    /**
     * Called after a mousedown event has been posted but before the mouse has moved.
     */
    beforeMouseMove?: () => any;
    /**
     * Called after the mouse has moved but before the mouseup event has been posted.
     */
    beforeMouseUp?: () => any;
    /**
     * Called after the activity has been completed.
     * @param payload
     */
    after?: (payload?: T) => any;
}

export declare class EventManager {
    clickThreshold: number;
    dblClickThreshold: number;
    private readonly tapHandler;
    private readonly mouseEnterExitHandler;
    constructor(params?: EventManagerOptions);
    private _doBind;
    on(el: any, event: string, children?: string | Function, fn?: Function, options?: {
        passive?: boolean;
        capture?: boolean;
        once?: boolean;
    }): this;
    off(el: any, event: string, fn: any): this;
    trigger(el: any, event: string, originalEvent: any, payload?: any, detail?: number): this;
}

declare interface EventManagerOptions {
    clickThreshold?: number;
    dblClickThreshold?: number;
}

/**
 * Equivalent of Object.assign, which IE11 does not support.
 * @param o1
 * @param o2
 * @param keys Optional list of keys to use to copy values from `o2` to `o1`. If this is not provided, all values are copied.
 * @public
 */
export declare function extend<T>(o1: T, o2: T, keys?: string[]): T;

/**
 * Definition of the extends of some set of elements: the min/max values in each axis.
 * @internal
 */
export declare interface Extents {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}

export declare type Face = keyof typeof FaceValues;

declare enum FaceValues {
    top = "top",
    left = "left",
    right = "right",
    bottom = "bottom"
}

/**
 * Constant for the term "false"
 * @public
 */
export declare const FALSE = "false";

/**
 * Trims whitespace from the given string.
 * @param s
 * @public
 */
export declare function fastTrim(s: string): string;

/**
 * Internal method used to filter lists, supporting wildcards.
 * @param list
 * @param value
 * @param missingIsFalse
 * @internal
 */
export declare function filterList(list: Array<any> | string, value: any, missingIsFalse?: boolean): boolean;

/**
 * Returns a copy of the given object that has no null values. Note this only operates one level deep.
 * @param obj
 * @internal
 */
export declare function filterNull(obj: Record<string, any>): Record<string, any>;

/**
 * Find all entries in the given array like object for which the given predicate returns true.
 * @param a
 * @param predicate
 * @internal
 */
export declare function findAllWithFunction<T>(a: ArrayLike<T>, predicate: (_a: T) => boolean): Array<number>;

export declare function findParent(el: jsPlumbDOMElement, selector: string, container: Element, matchOnElementAlso: boolean): jsPlumbDOMElement;

/**
 * Search each entry in the given array for an entry for which the function `f` returns true. This is a stand-in replacement for the
 * `findIndex` method which is available on `Array` in modern browsers, but not IE11.
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The index of the entry for which the predicate returned true, -1 if not found.
 * @internal
 */
export declare function findWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): number;

export declare const FIXED = "fixed";

/**
 * Trim decimal points from a number. Defaults to 3 decimal points.
 * @param n
 * @param digits
 */
export declare function fixPrecision(n: number, digits?: number): number;

/**
 * Flowchart connector inscribes a path consisting of a series of horizontal and vertical segments.
 * @public
 */
export declare class FlowchartConnector extends AbstractConnector {
    connection: Connection;
    static type: string;
    type: string;
    private internalSegments;
    midpoint: number;
    alwaysRespectStubs: boolean;
    cornerRadius: number;
    lastx: number;
    lasty: number;
    lastOrientation: any;
    loopbackRadius: number;
    isLoopbackCurrently: boolean;
    getDefaultStubs(): [number, number];
    constructor(connection: Connection, params: FlowchartConnectorOptions);
    private addASegment;
    private writeSegments;
    _compute(paintInfo: PaintGeometry, params: ConnectorComputeParams): void;
    transformGeometry(g: Geometry, dx: number, dy: number): Geometry;
}

export declare interface FlowchartConnectorOptions extends ConnectorOptions {
    /**
     * Always paint stubs at the end of a connector, even if the elements are closer together than the length of the stubs.
     */
    alwaysRespectStubs?: boolean;
    /**
     * Optional midpoint to use for the connector, defaults to 0.5.
     */
    midpoint?: number;
    /**
     * Optional curvature between segments. Defaults to 0, ie. no curve.
     */
    cornerRadius?: number;
    /**
     * How large to make a connector whose source and target is the same element.
     */
    loopbackRadius?: number;
}

/**
 * Stand-in for the `forEach` method which is available on modern browsers but not on IE11.
 * @param a
 * @param f
 * @internal
 */
export declare function forEach<T>(a: ArrayLike<T>, f: (_a: T) => any): void;

/**
 * A shim for the `fromArray` method, which is not present in IE11.  This method falls back to `fromArray` if it is present.
 * @param a Array-like object to convert into an Array
 * @returns An Array
 * @internal
 */
export declare function fromArray<T>(a: ArrayLike<T>): Array<T>;

/**
 * An anchor spec in the form `{type:..., options:{ ... }}`
 * @public
 */
export declare type FullAnchorSpec = {
    type: AnchorId;
    options: AnchorOptions;
};

/**
 * @public
 */
export declare type FullEndpointSpec = {
    type: EndpointId;
    options: EndpointParams;
};

/**
 * @public
 */
export declare type FullOverlaySpec = {
    type: string;
    options: OverlayOptions;
};

/**
 * Chain a list of functions, supplied by [ object, method name, args ], and return on the first one that returns the failValue.
 * If none return the failValue, return the successValue. This is an internal method.
 * @param successValue
 * @param failValue
 * @param fns
 * @internal
 */
export declare function functionChain(successValue: any, failValue: any, fns: Array<Array<any>>): any;

/**
 * Geometry defines the path along which a connector travels. The internal contents of a Geometry vary widely between connectors.
 * @public
 */
export declare interface Geometry {
    source: any;
    target: any;
}

/**
 * Find all entries in the given array for which the function `f` returns true
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The entries for which the predicate returned true, empty array if not found.
 * @internal
 */
export declare function getAllWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): Array<T>;

export declare function getClass(el: Element): string;

/**
 *
 * @param a
 * @internal
 */
export declare function getDefaultFace(a: LightweightContinuousAnchor): Face;

/**
 * Gets the position of this element with respect to the container's origin, in container coordinates.
 *
 * Previously, drag handlers would use getOffset method from the underlying instance but as part of updating the code
 * to support dragging SVG elements this method, using getBoundingClientRect, has been introduced. Ideally this
 * method would be what all the positioning code uses, but there are a few edge cases, particularly
 * involving scrolling, that need to be investigated.
 *
 * Note that we divide the position coords by the current zoom, as getBoundingClientRect() returns values that
 * correspond to what the user sees.
 *
 * Note also that currently this method fails when an element is rotated, as getBoundingClientRect() returns the
 * rotated bounds. In fact "fails" is perhaps not precise: it fails at behaving the way the previous getOffset method
 * worked, but depending on the use case, it may be desirable to get the rotated bounds. Currently this method is used
 * by endpoint drag code, in which we know the elements are not rotated.
 *
 * @param el
 * @internal
 */
export declare function getElementPosition(el: Element, instance: BrowserJsPlumbInstance): {
    x: number;
    y: number;
};

/**
 * Gets the size of this element, in container coordinates. Note that we divide the size values from
 * getBoundingClientRect by the current zoom, as getBoundingClientRect() returns values that
 * correspond to what the user sees.
 * @param el
 * @internal
 */
export declare function getElementSize(el: Element, instance: BrowserJsPlumbInstance): Size;

export declare function getElementType(el: Element): ElementType;

export declare function getEventSource(e: Event): jsPlumbDOMElement;

/**
 * Extract a value from the set where the given predicate returns true for that value.
 * @param s
 * @param f
 * @internal
 */
export declare function getFromSetWithFunction<T>(s: Set<T>, f: (_a: T) => boolean): T;

/**
 * Gets the page location for the given event, abstracting out differences between touch and mouse events.
 * @param e
 */
export declare function getPageLocation(e: any): PointXY;

export declare type GetPositionFunction = (el: Element) => PointXY;

/**
 * @internal
 * @param evt
 * @param el
 * @param zoom
 */
export declare function getPositionOnElement(evt: Event, el: Element, zoom: number): PointXY;

/**
 * Get, or insert then get, a value from the map.
 * @param map Map to get the value from.
 * @param key Key of the value to retrieve
 * @param valueGenerator Method used to generate a value for the key if it is not currently in the map.
 * @public
 */
export declare function getsert<K, V>(map: Map<K, V>, key: K, valueGenerator: () => V): V;

export declare type GetSizeFunction = (el: Element) => Size;

export declare function getTouch(touches: TouchList, idx: number): Touch;

/**
 * Find the entry in the given array for which the function `f` returns true. This is a stand-in replacement for the
 * `find` method which is available on `Array` in modern browsers, but not IE11.
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The entry for which the predicate returned true, null if not found.
 * @internal
 */
export declare function getWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): T;

export declare type GhostProxyGenerator = (el: Element) => Element;

export declare interface GhostProxyingDragHandler extends DragHandler {
    useGhostProxy: (container: any, dragEl: Element) => boolean;
    makeGhostProxy?: GhostProxyGenerator;
}

/**
 * Calculates the gradient of a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The gradient of a line between the two points.
 * @public
 */
export declare function gradient(p1: PointXY, p2: PointXY): number;

/**
 * Calculates the gradient at the point on the given curve at the given location
 * @returns a decimal between 0 and 1 inclusive.
 * @public
 */
export declare function gradientAtPoint(curve: Curve, location: number): number;

/**
 * Returns the gradient of the curve at the point which is 'distance' from the given location.
 * if this point is greater than location 1, the gradient at location 1 is returned.
 * if this point is less than location 0, the gradient at location 0 is returned.
 * @returns a decimal between 0 and 1 inclusive.
 * @public
 */
export declare function gradientAtPointAlongPathFrom(curve: Curve, location: number, distance: number): number;

/**
 * Definition of a grid - the width/height of each cell, and, optionally, a threshold value for each axis to use when
 * trying to snap some coordinate to the grid.
 * @public
 */
export declare interface Grid extends Size {
    thresholdX?: number;
    thresholdY?: number;
}

export declare interface GroupCollapsedParams<E> {
    group: UIGroup<E>;
}

/**
 * @internal
 * @param desiredLoc
 * @param dragEl
 * @param constrainRect
 * @param size
 */
export declare function groupDragConstrain(desiredLoc: PointXY, dragEl: jsPlumbDOMElement, constrainRect: BoundingBox, size: Size): PointXY;

export declare interface GroupExpandedParams<E> {
    group: UIGroup<E>;
}

export declare type GroupLocation = {
    el: Element;
    r: BoundingBox;
    group: UIGroup<Element>;
};

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

export declare function hasClass(el: Element, clazz: string): boolean;

/**
 * Inserts the given value into the given array at a sorted location.
 * @param value Value to insert
 * @param array Array to insert into
 * @param comparator Function to use when determining sort order.
 * @param sortDescending Defaults to false; if true, the insertion is sorted in reverse order.
 * @public
 */
export declare function insertSorted<T>(value: T, array: Array<T>, comparator: (v1: T, v2: T) => number, sortDescending?: boolean): void;

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

export declare type IntersectingGroup = {
    groupLoc: GroupLocation;
    d: number;
    intersectingElement: Element;
};

/**
 * Calculates whether or not the two rectangles intersect.
 * @param r1 First rectangle
 * @param r2 Second rectangle
 * @returns True if the rectangles intersect, false otherwise.
 * @public
 */
export declare function intersects(r1: RectangleXY, r2: RectangleXY): boolean;

export declare const IS_DETACH_ALLOWED = "isDetachAllowed";

export declare function isArrayLike(el: any): el is ArrayLike<Element>;

export declare function isArrowOverlay(o: Overlay): o is ArrowOverlay;

/**
 * Returns true if the given `object` can be considered to be an instance of the class `cls`.  This is done by
 * testing the proto chain of the object and checking at each level to see if the proto is an instance of the given class.
 * @param object Object to test
 * @param cls Class to test for.
 * @public
 */
export declare function isAssignableFrom(object: any, cls: any): boolean;

/**
 * Returns whether or not the given value is of `boolean` type.
 * @param s
 * @public
 */
export declare function isBoolean(s: any): boolean;

export declare function isContinuous(a: LightweightAnchor): a is LightweightContinuousAnchor;

export declare function isCustomOverlay(o: Overlay): o is CustomOverlay;

/**
 * Returns whether or not the given value is of type `Date`
 * @param o
 * @public
 */
export declare function isDate(o: any): o is Date;

export declare function isDiamondOverlay(o: Overlay): o is DiamondOverlay;

export declare function isDynamic(a: LightweightAnchor): boolean;

/**
 *
 * @param a
 * @param edge
 * @internal
 */
export declare function isEdgeSupported(a: LightweightContinuousAnchor, edge: Face): boolean;

/**
 * Returns whether or not the given object - which may be ArrayLike, or an object - is empty.
 * @param o
 * @public
 */
export declare function isEmpty(o: any): boolean;

export declare function isFloating(a: LightweightAnchor): a is LightweightFloatingAnchor;

/**
 * Returns whether or not the given overlay spec is a 'full' overlay spec, ie. has a `type` and some `options`, or is just an overlay name.
 * @param o
 */
export declare function isFullOverlaySpec(o: OverlaySpec): o is FullOverlaySpec;

/**
 * Returns whether or not the given value is of type `Function`
 * @param o
 * @public
 */
export declare function isFunction(o: any): o is Function;

export declare function isInsideParent(instance: BrowserJsPlumbInstance, _el: HTMLElement, pos: PointXY): boolean;

export declare function isLabelOverlay(o: Overlay): o is LabelOverlay;

export declare function isMouseDevice(): boolean;

/**
 * Returns whether or not the given value is of type `Function` and is a named Function.
 * @param o
 * @public
 */
export declare function isNamedFunction(o: any): boolean;

export declare function isNodeList(el: any): el is NodeListOf<Element>;

/**
 * Returns whether or not the given value is of `number` type.
 * @param n
 * @public
 */
export declare function isNumber(n: any): boolean;

/**
 * Returns whether or not the given value is of type `object`
 * @param o
 * @public
 */
export declare function isObject(o: any): boolean;

export declare function isPlainArrowOverlay(o: Overlay): o is PlainArrowOverlay;

export declare function isPoint(curve: Curve): boolean;

/**
 * Returns whether or not the given value is of `string` type.
 * @param s
 * @public
 */
export declare function isString(s: any): boolean;

export declare function isSVGElement(el: Element): boolean;

export declare function isTouchDevice(): boolean;

export declare interface JsPlumbDefaults<E> {
    [DEFAULT_KEY_ENDPOINT]?: EndpointSpec;
    [DEFAULT_KEY_ENDPOINTS]?: [EndpointSpec, EndpointSpec];
    [DEFAULT_KEY_ANCHOR]?: AnchorSpec;
    [DEFAULT_KEY_ANCHORS]?: [AnchorSpec, AnchorSpec];
    [DEFAULT_KEY_PAINT_STYLE]?: PaintStyle;
    [DEFAULT_KEY_HOVER_PAINT_STYLE]?: PaintStyle;
    [DEFAULT_KEY_ENDPOINT_STYLE]?: EndpointStyle;
    [DEFAULT_KEY_ENDPOINT_HOVER_STYLE]?: EndpointStyle;
    [DEFAULT_KEY_ENDPOINT_STYLES]?: [EndpointStyle, EndpointStyle];
    [DEFAULT_KEY_ENDPOINT_HOVER_STYLES]?: [EndpointStyle, EndpointStyle];
    [DEFAULT_KEY_CONNECTIONS_DETACHABLE]?: boolean;
    [DEFAULT_KEY_REATTACH_CONNECTIONS]?: boolean;
    [DEFAULT_KEY_ENDPOINT_OVERLAYS]?: Array<OverlaySpec>;
    [DEFAULT_KEY_CONNECTION_OVERLAYS]?: Array<OverlaySpec>;
    [DEFAULT_KEY_LIST_STYLE]?: ListSpec;
    [DEFAULT_KEY_CONTAINER]?: E;
    [DEFAULT_KEY_CONNECTOR]?: ConnectorSpec;
    [DEFAULT_KEY_SCOPE]?: string;
    [DEFAULT_KEY_MAX_CONNECTIONS]?: number;
    [DEFAULT_KEY_HOVER_CLASS]?: string;
    [DEFAULT_KEY_ALLOW_NESTED_GROUPS]?: boolean;
}

export declare interface jsPlumbDOMElement extends HTMLElement, jsPlumbElement<Element> {
    _isJsPlumbGroup: boolean;
    _jsPlumbOrphanedEndpoints: Array<Endpoint>;
    offsetParent: jsPlumbDOMElement;
    parentNode: jsPlumbDOMElement;
    jtk: jsPlumbDOMInformation;
    _jsPlumbScrollHandler?: Function;
    _katavorioDrag?: Drag;
    cloneNode: (deep?: boolean) => jsPlumbDOMElement;
}

/**
 * @internal
 */
export declare interface jsPlumbDOMInformation {
    connector?: AbstractConnector;
    endpoint?: Endpoint;
    overlay?: Overlay;
}

export declare interface jsPlumbDragManager {
    getPosition(el: Element): PointXY;
    getSize(el: Element): Size;
    getZoom(): number;
    setZoom(z: number): void;
    getInputFilterSelector(): string;
    setInputFilterSelector(selector: string): void;
    draggable(el: jsPlumbDOMElement, params: DragParams): Drag;
    destroyDraggable(el: jsPlumbDOMElement): void;
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
    endpointFloatingClass: string;
    endpointDropAllowedClass: string;
    endpointDropForbiddenClass: string;
    endpointAnchorClassPrefix: string;
    overlayClass: string;
    readonly connections: Array<Connection>;
    endpointsByElement: Record<string, Array<Endpoint>>;
    private readonly endpointsByUUID;
    sourceSelectors: Array<ConnectionDragSelector>;
    targetSelectors: Array<ConnectionDragSelector>;
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
    get defaultScope(): string;
    private _zoom;
    get currentZoom(): number;
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
     * Sets the type of a connection and then repaints it.
     * @param connection
     * @param type
     */
    setConnectionType(connection: Connection, type: string, params?: any): void;
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
     * @param _recalc - Maybe recalculate offsets for the element also. It is not recommended that clients of the API use this parameter; it's used in
     * certain scenarios internally
     */
    manage(element: T["E"], internalId?: string, _recalc?: boolean): ManagedElement<T["E"]>;
    /**
     * Retrieve some data from the given managed element. Created for internal use, as a way to avoid memory leaks from having data pertaining
     * to some element spread around the codebase, but could be used by external code.
     * @internal
     * @param elementId ID of the element to retrieve the data for
     * @param dataIdentifier Type of data being retrieved
     * @param key The key to retrieve the data for
     */
    getManagedData(elementId: string, dataIdentifier: string, key: string): any;
    /**
     * Attach some data to the given managed element. Created for internal use, as a way to avoid memory leaks from having data pertaining
     * to some element spread around the codebase, but could be used by external code.
     * @internal
     * @param elementId ID of the element to store the data against
     * @param dataIdentifier Type of data being stored
     * @param key The key to store the data against
     * @param data The data to store.
     */
    setManagedData(elementId: string, dataIdentifier: string, key: string, data: any): void;
    /**
     * Gets the element with the given ID from the list managed elements, null if not currently managed.
     * @param id
     */
    getManagedElement(id: string): T["E"];
    /**
     * Stops managing the given element, removing it from internal tracking and clearing the custom attribute that is
     * added by jsPlumb to mark it as managed. This method fires an 'element:unmanage' event containing the unmanaged
     * element and its managed id.
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
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): ConnectionDragSelector;
    /**
     * Unregister the given source selector.
     * @param selector
     * @public
     */
    removeSourceSelector(selector: ConnectionDragSelector): void;
    /**
     * Unregister the given target selector.
     * @param selector
     * @public
     */
    removeTargetSelector(selector: ConnectionDragSelector): void;
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
    addTargetSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?: boolean): ConnectionDragSelector;
    private _createTargetDefinition;
    show(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    hide(el: T["E"], changeEndpoints?: boolean): JsPlumbInstance;
    private _setVisible;
    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible(el: T["E"], changeEndpoints?: boolean): void;
    private _operation;
    /**
     * Register a connection type: a set of connection attributes grouped together with an ID.
     * @param id
     * @param type
     */
    registerConnectionType(id: string, type: ConnectionTypeDescriptor): void;
    /**
     * Register a set of connection types
     * @param types Set of types to register.
     */
    registerConnectionTypes(types: Record<string, ConnectionTypeDescriptor>): void;
    /**
     * Register an endpoint type: a set of endpoint attributes grouped together with an ID.
     * @param id
     * @param type
     */
    registerEndpointType(id: string, type: EndpointTypeDescriptor): void;
    /**
     * Register a set of endpoint types
     * @param types Set of types to register.
     */
    registerEndpointTypes(types: Record<string, EndpointTypeDescriptor>): void;
    /**
     * Retrieve an endpoint or connection type by its id.
     * @param id
     * @param typeDescriptor
     * @public
     */
    getType(id: string, typeDescriptor: string): TypeDescriptor;
    /**
     * Retrieve a connection type by its id.
     * @param id
     * @public
     */
    getConnectionType(id: string): ConnectionTypeDescriptor;
    /**
     * Retrieve an endpoint type by its id.
     * @param id
     * @public
     */
    getEndpointType(id: string): EndpointTypeDescriptor;
    /**
     * Import the given set of defaults to the instance.
     * @param d
     * @public
     */
    importDefaults(d: JsPlumbDefaults<T["E"]>): JsPlumbInstance;
    /**
     * Reset the instance defaults to the defaults computed by the constructor.
     * @public
     */
    restoreDefaults(): JsPlumbInstance;
    /**
     * Gets all of the elements managed by this instance.
     * @public
     */
    getManagedElements(): Record<string, ManagedElement<T["E"]>>;
    /**
     * @internal
     * @param connection
     * @param index
     * @param proxyEl
     * @param endpointGenerator
     * @param anchorGenerator
     */
    proxyConnection(connection: Connection, index: number, proxyEl: T["E"], endpointGenerator: (c: Connection, idx: number) => EndpointSpec, anchorGenerator: (c: Connection, idx: number) => AnchorSpec): void;
    /**
     * @internal
     * @param connection
     * @param index
     */
    unproxyConnection(connection: Connection, index: number): void;
    /**
     * @internal
     * @param originalId
     * @param newId
     * @param connection
     * @param newElement
     * @param index
     */
    sourceOrTargetChanged(originalId: string, newId: string, connection: Connection, newElement: T["E"], index: number): void;
    abstract setGroupVisible(group: UIGroup, state: boolean): void;
    /**
     * Gets the group with given id, null if not found.
     * @param groupId
     * @public
     */
    getGroup(groupId: string): UIGroup<T["E"]>;
    /**
     * Gets the group associated with the given element, null if the given element does not map to a group.
     * @param el
     * @public
     */
    getGroupFor(el: T["E"]): UIGroup<T["E"]>;
    /**
     * Add a group.
     * @param params
     * @public
     */
    addGroup(params: AddGroupOptions<T["E"]>): UIGroup<T["E"]>;
    /**
     * Add an element to a group
     * @param group
     * @param el
     * @public
     */
    addToGroup(group: string | UIGroup<T["E"]>, ...el: Array<T["E"]>): void;
    /**
     * Collapse a group.
     * @param group
     * @public
     */
    collapseGroup(group: string | UIGroup<T["E"]>): void;
    /**
     * Expand a group.
     * @param group
     * @public
     */
    expandGroup(group: string | UIGroup<T["E"]>): void;
    /**
     * Expand a group if it is collapsed, or collapse it if it is expanded.
     * @param group
     * @public
     */
    toggleGroup(group: string | UIGroup<T["E"]>): void;
    /**
     * Remove a group from this instance of jsPlumb.
     * @param group - Group to remove
     * @param deleteMembers - Whether or not to also delete any members of the group. If this is false (the default) then
     * group members will be removed before the group is deleted.
     * @param _manipulateView - Not for public usage. Used internally.
     * @param _doNotFireEvent - Not recommended for public usage, used internally.
     * @public
     */
    removeGroup(group: string | UIGroup<T["E"]>, deleteMembers?: boolean, _manipulateView?: boolean, _doNotFireEvent?: boolean): Record<string, PointXY>;
    /**
     * Remove all groups from this instance of jsPlumb
     * @param deleteMembers
     * @param _manipulateView - Not for public usage. Used internally.
     * @public
     */
    removeAllGroups(deleteMembers?: boolean, _manipulateView?: boolean): void;
    /**
     * Remove an element from a group
     * @param group - Group to remove element from
     * @param el - Element to remove.
     * @param _doNotFireEvent - Not for public usage. Used internally.
     * @public
     */
    removeFromGroup(group: string | UIGroup<T["E"]>, el: T["E"], _doNotFireEvent?: boolean): void;
    /**
     * @internal
     * @param endpoint
     * @param params
     * @private
     */
    _paintEndpoint(endpoint: Endpoint, params: {
        timestamp?: string;
        offset?: ViewportElement<T["E"]>;
        recalc?: boolean;
        elementWithPrecedence?: string;
        connectorPaintStyle?: PaintStyle;
        anchorLoc?: AnchorPlacement;
    }): void;
    /**
     * @internal
     * @param connection
     * @param params
     */
    _paintConnection(connection: Connection, params?: {
        timestamp?: string;
    }): void;
    /**
     * @internal
     * @param endpoint
     */
    _refreshEndpoint(endpoint: Endpoint): void;
    /**
     * Prepare a connector using the given name and args.
     * @internal
     * @param connection
     * @param name
     * @param args
     */
    _makeConnector(connection: Connection<T["E"]>, name: string, args: any): AbstractConnector;
    /**
     * Adds an overlay to the given component, repainting the UI as necessary.
     * @param component - A Connection or Endpoint to add the overlay to
     * @param overlay - Spec for the overlay
     * @param doNotRevalidate - Defaults to true. If false, a repaint won't occur after adding the overlay. This flag can be used when adding
     * several overlays in a loop.
     * @public
     */
    addOverlay(component: Component, overlay: OverlaySpec, doNotRevalidate?: boolean): void;
    /**
     * Remove the overlay with the given id from the given component.
     * @param component - Component to remove the overlay from.
     * @param overlayId - ID of the overlay to remove.
     * @public
     */
    removeOverlay(component: Component, overlayId: string): void;
    /**
     * Set the outline color for the given connection
     * @param conn
     * @param color
     * @public
     */
    setOutlineColor(conn: Connection, color: string): void;
    /**
     * Sets the outline width for the given connection
     * @param conn
     * @param width
     * @public
     */
    setOutlineWidth(conn: Connection, width: number): void;
    /**
     * Sets the color of the connection.
     * @param conn
     * @param color
     * @public
     */
    setColor(conn: Connection, color: string): void;
    /**
     * Sets the line width of the connection
     * @param conn
     * @param width
     * @public
     */
    setLineWidth(conn: Connection, width: number): void;
    /**
     * Sets color, outline color, line width and outline width.
     * Any values for which the key is present will not be set, but if
     * the key is present and the value is null, the corresponding value in
     * the connection's paint style will be set to null.
     * @param conn
     * @param style
     * @public
     */
    setLineStyle(conn: Connection, style: {
        lineWidth?: number;
        outlineWidth?: number;
        color?: string;
        outlineColor?: string;
    }): void;
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
    abstract _appendElementToGroup(group: UIGroup, e: T["E"]): void;
    abstract _appendElementToContainer(e: T["E"]): void;
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
    /**
     * @internal
     * @param connector
     */
    getPathData(connector: AbstractConnector): any;
    /**
     * @internal
     * @param o
     * @param params
     * @param extents
     */
    abstract _paintOverlay(o: Overlay, params: any, extents: any): void;
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
     * @param sourceEndpoint
     */
    abstract setConnectorHover(connector: AbstractConnector, h: boolean, sourceEndpoint?: Endpoint): void;
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
    abstract setEndpointHover(endpoint: Endpoint<T>, h: boolean, endpointIndex: number, doNotCascade?: boolean): void;
}

/**
 * Models a list of elements that is scrollable, and connections to the elements contained in the list are proxied onto
 * the top of bottom edge of the list element whenever their source/target is not within the list element's current
 * viewport.
 */
export declare class JsPlumbList {
    private instance;
    private el;
    private options;
    readonly id: string;
    _scrollHandler: Function;
    readonly domElement: jsPlumbDOMElement;
    private readonly elId;
    constructor(instance: BrowserJsPlumbInstance, el: Element, options: JsPlumbListOptions, id: string);
    /**
     * Derive an anchor to use for the current situation. In contrast to the way we derive an endpoint, here we use `anchor` from the options, if present, as
     * our first choice, and then `deriveAnchor` as our next choice. There is a default `deriveAnchor` implementation that uses TopRight/TopLeft for top and
     * BottomRight/BottomLeft for bottom.
     * @param edge - Edge to find an anchor for - top or bottom
     * @param index - 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep - the endpoint that is being proxied
     * @param conn - the connection that is being proxied
     */
    private deriveAnchor;
    /**
     * Derive an endpoint to use for the current situation. We'll use a `deriveEndpoint` function passed in to the options as our first choice,
     * followed by `endpoint` (an endpoint spec) from the options, and failing either of those we just use the `type` of the endpoint that is being proxied.
     * @param edge - Edge to find an endpoint for - top or bottom
     * @param index - 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep - the endpoint that is being proxied
     * @param conn - the connection that is being proxied
     */
    private deriveEndpoint;
    /**
     * Notification that a new connection concerning this list has been added. This is not a method that should be
     * called as part of the public API; it is for the list manager to call.
     * @param c - New connection
     * @param el - The element which is either the source or target of the connection
     * @param index - 0 if the element is connection source, 1 if it is connection target.
     */
    newConnection(c: Connection, el: jsPlumbDOMElement, index: number): void;
    /**
     * Update all connections in the list. Run at init time and then whenever a scroll event occurs.
     */
    private scrollHandler;
    /**
     * Configure a proxy for a connection.
     * @param el - The element the connection is attached to.
     * @param conn - The connection to proxy.
     * @param index - 0 if the element is connection source, 1 if it is connection target
     * @param edge - List edge to proxy the connection to - top or bottom.
     * @internal
     */
    private _proxyConnection;
    /**
     * Destroys the list, cleaning up the DOM.
     */
    destroy(): void;
}

/**
 * Provides methods to create/destroy scrollable lists.
 */
export declare class JsPlumbListManager {
    private instance;
    options: ListManagerOptions;
    count: number;
    lists: Record<string, JsPlumbList>;
    constructor(instance: BrowserJsPlumbInstance, params?: ListManagerOptions);
    /**
     * Configure the given element as a scrollable list.
     * @param el - Element to configure as a list.
     * @param options - Options for the list.
     */
    addList(el: Element, options?: JsPlumbListOptions): JsPlumbList;
    /**
     * Gets the list associated with the given element, if any.
     * @param el
     */
    getList(el: Element): JsPlumbList;
    /**
     * Destroy any scrollable list associated with the given element.
     * @param el
     */
    removeList(el: Element): void;
    findParentList(el: jsPlumbDOMElement): JsPlumbList;
}

/**
 * Constructor options for a list.
 */
export declare interface JsPlumbListOptions {
    /**
     * Optional spec for the anchor to use when parking connections in response to a scroll.
     */
    anchor?: AnchorSpec;
    /**
     * Optional function to use to get an anchor spec when parking a connection.
     * @param edge - The edge of the element on which the connection is to be parked - top or bottom.
     * @param index - Index of the endpoint that is being parked - 0 if source endpoint, 1 if target endpoint.
     * @param ep - The endpoint that is being parked
     * @param conn - The connection that is being parked
     */
    deriveAnchor?: (edge: SupportedEdge, index: number, ep: Endpoint, conn: Connection) => AnchorSpec;
    /**
     * Optional spec for the endpoint to use when parking connections in response to a scroll.
     */
    endpoint?: EndpointSpec;
    /**
     * Optional function to use to get an endpoint spec when parking a connection.
     * @param edge - The edge of the element on which the connection is to be parked - top or bottom.
     * @param index - Index of the endpoint that is being parked - 0 if source endpoint, 1 if target endpoint.
     * @param ep - The endpoint that is being parked
     * @param conn - The connection that is being parked
     */
    deriveEndpoint?: (edge: SupportedEdge, index: number, ep: Endpoint, conn: Connection) => EndpointSpec;
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

/**
 * @public
 */
export declare interface LabelOverlayOptions extends OverlayOptions {
    label: string | Function;
    labelLocationAttribute?: string;
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
    element: Element;
    isFloating: boolean;
    isContinuous: false;
    isDynamic: false;
    locations: Array<AnchorRecord>;
    currentLocation: number;
    locked: boolean;
    cssClass: string;
    timestamp: string;
    type: string;
    id: string;
    orientation: Orientation;
    size: Size;
    constructor(instance: JsPlumbInstance, element: Element, elementId: string);
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
    getEndpointOrientation(ep: Endpoint<any>): Orientation;
    setAnchorOrientation(anchor: LightweightAnchor, orientation: Orientation): void;
    isDynamicAnchor(ep: Endpoint<any>): boolean;
    isFloating(ep: Endpoint<any>): boolean;
    prepareAnchor(params: AnchorSpec | Array<AnchorSpec>): LightweightAnchor;
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

/**
 * Compute the intersection of the two lines.
 * @param l1
 * @param l2
 * @returns A point if an intersection found, null otherwise.
 * @public
 */
export declare function lineIntersection(l1: LineXY, l2: LineXY): PointXY | null;

/**
 * Calculates the length of a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The length of a line between the two points.
 * @public
 */
export declare function lineLength(p1: PointXY, p2: PointXY): number;

/**
 * Finds all points where the given line intersects the given rectangle.
 * @param line
 * @param r
 * @returns An array of intersection points. If there are no intersection points the array will be empty, but never null.
 * @public
 */
export declare function lineRectangleIntersection(line: LineXY, r: RectangleXY): Array<PointXY>;

/**
 * Defines a line from some point to another.
 * @public
 */
export declare type LineXY = [PointXY, PointXY];

export declare interface ListManagerOptions {
}

export declare interface ListSpec {
    endpoint?: EndpointSpec;
}

/**
 * finds the location that is 'distance' along the path from 'location'.
 * @public
 */
export declare function locationAlongCurveFrom(curve: Curve, location: number, distance: number): number;

/**
 * Logs a console message.
 * @param args
 * @internal
 */
export declare function log(...args: string[]): void;

/**
 * Determines whether or not logging is currently enabled.
 * @public
 */
export declare const logEnabled: boolean;

export declare function makeLightweightAnchorFromSpec(spec: AnchorSpec | Array<AnchorSpec>): LightweightAnchor;

export declare type ManagedElement<E> = {
    el: jsPlumbElement<E>;
    viewportElement?: ViewportElement<E>;
    endpoints?: Array<Endpoint>;
    connections?: Array<Connection>;
    rotation?: number;
    group?: string;
    data: Record<string, Record<string, any>>;
};

/**
 * Payload for an element managed event
 * @public
 */
export declare interface ManageElementParams<E = any> {
    el: E;
}

/**
 * Maps some ArrayLike object. This is of course a copy of a method that typescript offers. It will likely fall out of use in the jsPlumb codebase.
 * @param obj
 * @param fn
 * @internal
 */
export declare function map(obj: any, fn: Function): any[];

export declare function matchesSelector(el: jsPlumbDOMElement, selector: string, ctx?: Element): boolean;

/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 * @internal
 */
export declare type Merge<M, N> = Omit_2<M, Extract<keyof M, keyof N>> & N;

/**
 * Merge the values from `b` into the values from `a`, resulting in `c`.  `b` and `a` are unchanged by this method.
 * Not every datatype can be merged - arrays can, and objects can, but primitives (strings/booleans/numbers/functions)
 * cannot, and are overwritten in `c` by the value from `b`, if present.
 *
 * @remarks
 *
 * Collating Values
 * ----------------
 *
 * You can choose to collate strings, booleans or functions if you wish, by providing their key names in the `collations` array. So if
 * you had, say:
 *
 * a:{
 *     foo:"hello"
 * }
 *
 * b:{
 *     foo:"world"
 * }
 *
 * and you called  `merge(a, b, ["foo"])`, then the output would be
 *
 * {
 *     foo:["hello", "world"]
 * }
 *
 * if the value in `a` is already an Array then the value from `b` is simply appended:
 *
 * a:{
 *     foo:["hello"]
 * }
 *
 * b:{
 *     foo:"world"
 * }
 *
 * here the output would be
 *
 * {
 *     foo:["hello", "world"]
 * }
 *
 *
 * Overwriting values
 * -----------------
 *
 * If you wish to overwrite, rather than merge, specific values, you can provide their keys in the `overwrites` array. Note that it's unnecessary to
 * specify any primitives in the `overwrites` array, as they will always be overwritten and not merged.
 *
 * a:{
 *     foo:["hello", "world"]
 * }
 *
 * b:{
 *     foo:"world"
 * }
 *
 * and you called  `merge(a, b, null, ["foo"])`, then the output would be
 *
 * {
 *     foo:"world"
 * }
 *
 * Note that it is irrelevant, in the case of overwriting, what the type of the parent's value is. It will be overwritten regardless.
 *
 * @param a Parent object
 * @param b Child object
 * @param collations Optional list of parameters to collate, rather than merging or overwriting.
 * @param overwrites Optional list of parameters to overwrite, rather than merging.
 * @internal
 */
export declare function merge(a: Record<string, any>, b: Record<string, any>, collations?: Array<string>, overwrites?: Array<string>): any;

/**
 * Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
 * point's coordinates and also the 'location' of the point (see above).
 * @public
 */
export declare function nearestPointOnCurve(point: PointXY, curve: Curve): {
    point: PointXY;
    location: number;
};

/**
 * Create a new BrowserJsPlumbInstance, optionally with the given defaults.
 * @param defaults
 * @public
 */
export declare function newInstance(defaults?: BrowserJsPlumbDefaults): BrowserJsPlumbInstance;

declare function _node(name: string, attributes?: ElementAttributes): SVGElement;

export declare const NONE = "none";

/**
 * Calculates the gradient of a normal to a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The gradient of a normal to a line between the two points.
 * @public
 */
export declare function normal(p1: PointXY, p2: PointXY): number;

/**
 * Returns whether or not the two objects are identical, ie. there are no keys in o1 that do not exist in o2 and vice versa.
 * @param a
 * @param b
 * @internal
 */
export declare function objectsEqual(a: Record<string, any>, b: Record<string, any>): boolean;

/**
 * Gets the position of the given element relative to the browser viewport's origin. This method is safe for
 * both HTML and SVG elements.
 * @param el
 * @internal
 */
export declare function offsetRelativeToRoot(el: Element): PointXY;

/**
 * Gets the offset width and offset height of the given element. Not safe for SVG elements. This method was previously
 * exported as `size` but has been renamed in order to reflect the fact that it uses offsetWidth and offsetHeight,
 * which are not set on SVG elements.
 * @param el
 * @public
 */
export declare function offsetSize(el: Element): Size;

/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 * @internal
 */
declare type Omit_2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export { Omit_2 as Omit }

/**
 * Execute the given function when the DOM is ready, or if the DOM is already ready, execute the given function immediately.
 * @param f
 * @public
 */
export declare function onDocumentReady(f: Function): void;

/**
 * Subclass of EventGenerator with a default implementation of `shouldFireEvent`, which returns true always.
 * @public
 */
export declare class OptimisticEventGenerator extends EventGenerator {
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
}

export declare type Orientation = [AnchorOrientationHint, AnchorOrientationHint];

export declare abstract class Overlay extends EventGenerator {
    instance: JsPlumbInstance;
    component: Component;
    id: string;
    abstract type: string;
    cssClass: string;
    visible: boolean;
    location: number | Array<number>;
    events: Record<string, (value: any, event?: any) => any>;
    attributes: Record<string, string>;
    constructor(instance: JsPlumbInstance, component: Component, p: OverlayOptions);
    setLocation(l: number | string): void;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    setVisible(v: boolean): void;
    isVisible(): boolean;
    abstract updateFrom(d: any): void;
}

export declare const OverlayFactory: {
    get: (instance: JsPlumbInstance, name: string, component: Component, params: any) => Overlay;
    register: (name: string, overlay: Constructable<Overlay>) => void;
};

export declare interface OverlayMouseEventParams {
    e: Event;
    overlay: Overlay;
}

/**
 * @public
 */
export declare interface OverlayOptions extends Record<string, any> {
    id?: string;
    cssClass?: string;
    location?: number | number[];
    events?: Record<string, (value: any, event?: any) => any>;
    attributes?: Record<string, string>;
}

/**
 * @public
 */
export declare type OverlaySpec = string | FullOverlaySpec;

export declare function pageLocation(e: Event): PointXY;

/**
 * Used internally by connectors.
 * @internal
 */
export declare type PaintAxis = "y" | "x";

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

export declare interface PaintStyle {
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
    outlineStroke?: string;
    outlineWidth?: number;
    dashstyle?: string;
}

/**
 * Constructor options for a Perimeter Anchor.
 * @public
 */
export declare interface PerimeterAnchorOptions extends AnchorOptions {
    shape: keyof PerimeterAnchorShapes;
    rotation?: number;
    anchorCount?: number;
}

/**
 * Supported shapes for a Perimeter anchor.
 * @public
 */
export declare enum PerimeterAnchorShapes {
    Circle = "Circle",
    Ellipse = "Ellipse",
    Triangle = "Triangle",
    Diamond = "Diamond",
    Rectangle = "Rectangle",
    Square = "Square"
}

/**
 * Calculates a line of length `length` that is perpendicular to the line from `fromPoint` to `toPoint` and passes through `toPoint`.
 * @param fromPoint First point
 * @param toPoint Second point
 * @param length Length of the line to generate
 * @returns Perpendicular line of the required length.
 * @public
 */
export declare function perpendicularLineTo(fromPoint: PointXY, toPoint: PointXY, length: number): LineXY;

/**
 * calculates a line that is 'length' pixels long, perpendicular to, and centered on, the path at 'distance' pixels from the given location.
 * if distance is not supplied, the perpendicular for the given location is computed (ie. we set distance to zero).
 * @public
 */
export declare function perpendicularToPathAt(curve: Curve, location: number, length: number, distance: number): LineXY;

export declare class PlainArrowOverlay extends ArrowOverlay {
    instance: JsPlumbInstance;
    static type: string;
    type: string;
    constructor(instance: JsPlumbInstance, component: Component, p: ArrowOverlayOptions);
}

/**
 * finds the point that is 'distance' along the path from 'location'.
 * @publix
 */
export declare function pointAlongCurveFrom(curve: Curve, location: number, distance: number): PointXY;

/**
 * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
 * its 'location' (proportion of travel along the path); the method below - _pointAlongPathFrom - calls this method and just returns the
 * point.
 *
 * TODO The compute length functionality was made much faster recently, using a lookup table. is it possible to use that lookup table find
 * a value for the point some distance along the curve from somewhere?
 */
export declare function pointAlongPath(curve: Curve, location: number, distance: number): PointOnPath;

/**
 * @internal
 */
export declare type PointNearPath = {
    s?: Segment;
    d: number;
    x: number;
    y: number;
    l: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

/**
 * calculates a point on the curve, for a Bezier of arbitrary order.
 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}, {x:120,y:100}].  For a cubic bezier this should have four points.
 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
 */
export declare function pointOnCurve(curve: Curve, location: number): PointXY;

/**
 * Calculates a point on the line from `fromPoint` to `toPoint` that is `distance` units along the length of the line.
 * @param fromPoint First point
 * @param toPoint Second point
 * @param distance Distance along the length that the point should be located.
 * @returns Point on the line, in the form `{ x:..., y:... }`.
 * @public
 */
export declare function pointOnLine(fromPoint: PointXY, toPoint: PointXY, distance: number): PointXY;

export declare type PointOnPath = {
    point: PointXY;
    location: number;
};

/**
 * Defines an x/y location.
 * @public
 */
export declare interface PointXY {
    x: number;
    y: number;
    theta?: number;
}

/**
 *
 * Take the given model and expand out any parameters. Parameters to expand are marked inside string values with this syntax:
 *
 * `
 * someKey:"this is a value of type {{type}}"
 * `
 *
 * so when you call this method and `values` contains a key `type`, the value for that key is inserted into the populated value. Note that prior to
 * 5.6.0 the syntax for parameter substitutions was this:
 *
 * someKey:"this is a value of type ${type}"
 *
 * which is still supported, but will not be from v 6.0.0 onwards. We've made this change because people are increasingly using JS string templates,
 * and the `${..}` syntax is part of those.
 *
 * @param model Object to populate with values.
 * @param values Object containing values to populate
 * @param functionPrefix This is optional, and if present, helps jsplumb figure out what to do if a value is a Function.
 * if you do not provide it (and `doNotExpandFunctions` is null, or false), jsplumb will run the given values through any functions it finds, and use the function's
 * output as the value in the result. if you do provide the prefix, only functions that are named and have this prefix
 * will be executed; other functions will be passed as values to the output.
 * @param doNotExpandFunctions Defaults to false. If true, Functions will be passed directly from `values` to `model` without being executed.
 * @returns
 * @internal
 */
export declare function populate(model: any, values: any, functionPrefix?: string, doNotExpandFunctions?: boolean): any;

export declare enum PositioningStrategies {
    absolutePosition = "absolutePosition",
    transform = "transform",
    xyAttributes = "xyAttributes"
}

export declare type PositioningStrategy = keyof typeof PositioningStrategies;

/**
 * @public
 */
export declare const PROPERTY_POSITION = "position";

/**
 * @public
 */
export declare type Quadrant = 1 | 2 | 3 | 4;

/**
 * Calculates the quadrant in which the angle between the two points lies.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The quadrant - 1 for upper right, 2 for lower right, 3 for lower left, 4 for upper left.
 * @public
 */
export declare function quadrant(p1: PointXY, p2: PointXY): Quadrant;

/**
 * Execute the given function when the DOM is ready, or if the DOM is already ready, execute the given function immediately.
 * @param f
 * @public
 */
export declare function ready(f: Function): void;

export declare class RectangleEndpoint extends EndpointRepresentation<ComputedRectangleEndpoint> {
    width: number;
    height: number;
    constructor(endpoint: Endpoint, params?: RectangleEndpointParams);
    static type: string;
    type: string;
    static _getParams(ep: RectangleEndpoint): Record<string, any>;
}

export declare const RectangleEndpointHandler: EndpointHandler<RectangleEndpoint, ComputedRectangleEndpoint>;

/**
 * @public
 */
export declare interface RectangleEndpointParams extends EndpointRepresentationParams {
    width?: number;
    height?: number;
}

/**
 * This is an alias for BoundingBox.
 * @public
 */
export declare type RectangleXY = BoundingBox;

export declare interface RedrawResult {
    c: Set<Connection>;
    e: Set<Endpoint>;
}

/**
 * Indicates that when dragging an existing connection by its source endpoint, it can be relocated onto some other source element by
 * dropping it anywhere on that element.
 * @public
 */
export declare const REDROP_POLICY_ANY = "any";

/**
 * Indicates that when dragging an existing connection by its source endpoint, it can be relocated onto any other source element, by dropping
 * it anywhere on a source element. But it cannot be dropped onto any target element. This flag is equivalent to `REDROP_POLICY_ANY` but with the
 * stipulation that the element on which the connections is being dropped must itself be configured with one or more source selectors.
 * @public
 */
export declare const REDROP_POLICY_ANY_SOURCE = "anySource";

/**
 * This flag is the union of REDROP_POLICY_ANY_TARGET and REDROP_POLICY_ANY_SOURCE
 * @public
 */
export declare const REDROP_POLICY_ANY_SOURCE_OR_TARGET = "anySourceOrTarget";

/**
 * Indicates that when dragging an existing connection by its target endpoint, it can be relocated onto any other target element, by dropping
 * it anywhere on a target element. But it cannot be dropped onto any source element. This flag is equivalent to `REDROP_POLICY_ANY` but with the
 * stipulation that the element on which the connections is being dropped must itself be configured with one or more target selectors.
 * @public
 */
export declare const REDROP_POLICY_ANY_TARGET = "anyTarget";

/**
 * Indicates that when dragging an existing connection by its source endpoint, it can only be relocated onto some other source element by
 * dropping it on the part of that element defined by its source selector.
 * @public
 */
export declare const REDROP_POLICY_STRICT = "strict";

/**
 * Defines how redrop of source endpoints can be done.
 * @public
 */
export declare type RedropPolicy = typeof REDROP_POLICY_STRICT | typeof REDROP_POLICY_ANY | typeof REDROP_POLICY_ANY_SOURCE | typeof REDROP_POLICY_ANY_TARGET | typeof REDROP_POLICY_ANY_SOURCE_OR_TARGET;

export declare function registerEndpointRenderer<C>(name: string, fns: EndpointHelperFunctions<C>): void;

/**
 * Remove an item from an array
 * @param l Array to remove the item from
 * @param v Item to remove.
 * @returns true if the item was removed, false otherwise.
 * @internal
 */
export declare function remove<T>(l: Array<T>, v: T): boolean;

export declare const REMOVE_CLASS_ACTION = "remove";

export declare function removeClass(el: Element | NodeListOf<Element>, clazz: string): void;

export declare function _removeTypeCssHelper<E>(component: Component, typeId: string): void;

/**
 * Remove the entry from the array for which the function `f` returns true.
 * @param a
 * @param f
 * @returns true if an element was removed, false if not.
 * @internal
 */
export declare function removeWithFunction<T>(a: Array<T>, f: (_a: T) => boolean): boolean;

/**
 * Replace a value inside some object with another value.
 * @param inObj Object within which to make the replacement.
 * @param path Path to the value to replace. Supports dotted and bracket notation. Eg "foo" means a value with key `foo` in the root. "foo.bar" means a value
 * with key `bar` inside a value with key `foo`. "foo[1]" means the object at index 1 inside a value with key `foo`.
 * @param value Value to replace the original value with.
 * @internal
 */
export declare function replace(inObj: any, path: string, value: any): any;

export declare type RevertEventParams = jsPlumbDOMElement;

export declare type RevertFunction = (dragEl: HTMLElement, pos: PointXY) => boolean;

export declare const RIGHT = FaceValues.right;

/**
 * Internal method used to rotate an anchor orientation.
 * @param orientation
 * @param rotation
 * @internal
 */
export declare function rotateAnchorOrientation(orientation: [number, number], rotation: any): [number, number];

/**
 * Extension of PointXY used internally to track extra information about the rotation.
 * @internal
 */
export declare interface RotatedPointXY extends PointXY {
    cr: number;
    sr: number;
}

/**
 * Rotate the given point around the given center, by the given rotation (in degrees)
 * @param point
 * @param center
 * @param rotation
 * @returns An object consisting of the rotated point, followed by cos theta and sin theta.
 */
export declare function rotatePoint(point: PointXY, center: PointXY, rotation: number): RotatedPointXY;

/**
 * Defines the current rotation of some element - its rotation (in degrees) and the center point around which it is rotated.
 * @internal
 */
export declare interface Rotation {
    r: number;
    c: PointXY;
}

/**
 * A set of compound rotations - used when nesting elements/groups inside other groups.
 * @internal
 */
export declare type Rotations = Array<Rotation>;

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
    prepareAnchor(params: AnchorSpec | Array<AnchorSpec>): A;
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
 * Definition of a segment. This is an internal class that users of the API need not access.
 * @internal
 */
export declare interface Segment {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    type: string;
    extents: Extents;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
    getLength(): number;
    pointOnPath(location: number, absolute?: boolean): PointXY;
    gradientAtPoint(location: number, absolute?: boolean): number;
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    getPath(isFirstSegment: boolean): string;
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

export declare interface SegmentParams {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export declare interface SelectEndpointOptions<E> extends AbstractSelectOptions<E> {
    element?: ElementSelectionSpecifier<E>;
}

declare class SelectionBase<T extends Component> {
    protected instance: JsPlumbInstance;
    protected entries: Array<T>;
    constructor(instance: JsPlumbInstance, entries: Array<T>);
    get length(): number;
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

/**
 * @public
 */
export declare const SELECTOR_CONNECTOR: string;

/**
 * @public
 */
export declare const SELECTOR_ENDPOINT: string;

/**
 * @public
 */
export declare const SELECTOR_GROUP: string;

/**
 * @public
 */
export declare const SELECTOR_GROUP_CONTAINER: string;

export declare const SELECTOR_MANAGED_ELEMENT: string;

/**
 * @public
 */
export declare const SELECTOR_OVERLAY: string;

export declare const SELECTOR_SCROLLABLE_LIST: string;

export declare function setForceMouseEvents(value: boolean): void;

export declare function setForceTouchEvents(value: boolean): void;

export declare type SetPositionFunction = (el: Element, p: PointXY) => void;

export declare type SetSizeFunction = (el: Element, s: Size) => void;

/**
 * Convert a set into an array. This is not needed for modern browsers but for IE11 compatibility we use this in jsplumb.
 * @param s
 * @internal
 */
export declare function setToArray<T>(s: Set<T>): Array<T>;

/**
 * Replacement for Math.sign, which IE11 does not support.
 * @param x
 */
export declare function sgn(x: number): -1 | 0 | 1;

/**
 * Models the specification of a single anchor.
 * @public
 */
export declare type SingleAnchorSpec = AnchorId | FullAnchorSpec | ArrayAnchorSpec;

/**
 * Defines the width and height of some element.
 * @public
 */
export declare interface Size {
    w: number;
    h: number;
}

/**
 * Snap the given x,y to a point on the grid defined by gridX and gridY, using the given thresholds to calculate proximity to the grid.
 * @param pos Position to transform
 * @param grid Definition of the grid
 * @param thresholdX Defines how close to a grid line in the x axis a value must be in order to be snapped to it.
 * @param thresholdY Defines how close to a grid line in the y axis a value must be in order to be snapped to it.
 * @returns The point to which the position was snapped, given the constraints of the grid.
 * @public
 */
export declare function snapToGrid(pos: PointXY, grid: Grid, thresholdX?: number, thresholdY?: number): PointXY;

/**
 * Defines a function that can be used to sort an array.
 * @internal
 */
export declare type SortFunction<T> = (a: T, b: T) => number;

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

export declare class StateMachineConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    _controlPoint: PointXY;
    constructor(connection: Connection, params: StateMachineOptions);
    _computeBezier(paintInfo: PaintGeometry, params: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, w: number, h: number): void;
}

export declare interface StateMachineOptions extends AbstractBezierOptions {
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

/**
 * Subtracts p2 from p1, returning a new point.
 * @param p1
 * @param p2
 * @returns a new Point, with p2 subtracted from p1.
 * @public
 */
export declare function subtract(p1: PointXY, p2: PointXY): PointXY;

/**
 * Add the given item to the given list if it does not exist on the list already.
 * @param list - List to add to
 * @param item - Item to add
 * @param insertAtHead - If true, insert new item at head. Defaults to false.
 * @internal
 */
export declare function suggest(list: Array<any>, item: any, insertAtHead?: boolean): boolean;

export declare enum SupportedEdge {
    top = 0,
    bottom = 1
}

export declare const svg: {
    attr: typeof _attr;
    node: typeof _node;
    ns: {
        svg: string;
    };
};

export declare function svgWidthHeightSize(el: Element): Size;

export declare function svgXYPosition(el: Element): PointXY;

export declare const TARGET = "target";

export declare const TARGET_INDEX = 1;

/**
 * Defines the supported options on an `addTargetSelector` call.
 * @public
 */
export declare interface TargetDefinition extends SourceOrTargetDefinition {
}

/**
 * Calculates the angle between the two points.
 * @param p1 First point
 * @param p2 Second point
 * @returns The angle between the two points.
 * @public
 */
export declare function theta(p1: PointXY, p2: PointXY): number;

export declare function toggleClass(el: Element | NodeListOf<Element>, clazz: string): void;

export declare const TOP = FaceValues.top;

export declare function touchCount(e: Event): number;

export declare function touches(e: any): TouchList;

export declare type TranslatedViewportElement<E> = Omit<TranslatedViewportElementBase<E>, "dirty">;

/**
 * @internal
 */
export declare interface TranslatedViewportElementBase<E> extends ViewportElementBase<E> {
    cr: number;
    sr: number;
}

/**
 * Constant for the term "true"
 * @public
 */
export declare const TRUE = "true";

/**
 * Definition of 2 PI
 * @public
 */
export declare const TWO_PI: number;

/**
 * Base interface for type descriptors for public methods.
 * @public
 */
export declare interface TypeDescriptor extends TypeDescriptorBase {
    /**
     * Array of overlays to add.
     */
    overlays?: Array<OverlaySpec>;
}

/**
 * Base interface for endpoint/connection types, which are registered via `registerConnectionType` and `registerEndpointType`. This interface
 * contains parameters that are common between the two types, and is shared by internal methods and public methods.
 * @public
 */
declare interface TypeDescriptorBase {
    /**
     * CSS class to add to the given component's representation in the UI
     */
    cssClass?: string;
    /**
     * Paint style to use for the component.
     */
    paintStyle?: PaintStyle;
    /**
     * Paint style to use for the component when the pointer is hovering over it.
     */
    hoverPaintStyle?: PaintStyle;
    /**
     * Optional set of parameters to store on the component that is generated from this type.
     */
    parameters?: Record<string, any>;
    /**
     * [source, target] anchor specs for edges.
     */
    anchors?: [AnchorSpec, AnchorSpec];
    /**
     * Spec for the anchor to use for both source and target.
     */
    anchor?: AnchorSpec;
    /**
     * Provides a simple means for controlling connectivity in the UI.
     */
    scope?: string;
    /**
     * When merging a type description into its parent(s), values in the child for `connector`, `anchor` and `anchors` will
     * always overwrite any such values in the parent. But other values, such as `overlays`, will be merged with their
     * parent's entry for that key. You can force a child's type to override _every_ corresponding value in its parent by
     * setting `mergeStrategy:'override'`.
     */
    mergeStrategy?: string;
    /**
     * Spec for an endpoint created for this type.
     */
    endpoint?: EndpointSpec;
    /**
     * Paint style for connectors created for this type.
     */
    connectorStyle?: PaintStyle;
    /**
     * Paint style for connectors created for this type when pointer is hovering over the component.
     */
    connectorHoverStyle?: PaintStyle;
    /**
     * Spec for connectors created for this type.
     */
    connector?: ConnectorSpec;
    /**
     * Class to add to any connectors created for this type.
     */
    connectorClass?: string;
}

export declare interface UIComponent {
    canvas: HTMLElement;
    svg: SVGElement;
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
    get contentArea(): any;
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
    get collapseParent(): UIGroup<E>;
}

export declare class UINode<E> {
    instance: JsPlumbInstance;
    el: E;
    group: UIGroup<E>;
    constructor(instance: JsPlumbInstance, el: E);
}

/**
 * Constant for matching JS 'undefined'.
 * @public
 */
export declare const UNDEFINED = "undefined";

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

/**
 * @public
 */
export declare type UserDefinedEndpointId = string;

export declare type UUID = string;

/**
 * Generate a v4 UUID.
 * @returns String representation of a UUID
 * @public
 */
export declare function uuid(): string;

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

/**
 * Constant representing the wildcard used in several places in the API.
 * @public
 */
export declare const WILDCARD = "*";

/**
 * Wraps one function with another, creating a placeholder for the
 * wrapped function if it was null. This is used to wrap the various
 * drag/drop event functions - to allow jsPlumb to be notified of
 * important lifecycle events without imposing itself on the user's
 * drag/drop functionality.
 * @param wrappedFunction - original function to wrap; may be null.
 * @param newFunction - function to wrap the original with.
 * @param returnOnThisValue - Optional. Indicates that the wrappedFunction should
 * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
 * note that this is a simple comparison and only works for primitives right now.
 * @internal
 */
export declare function wrap(wrappedFunction: Function, newFunction: Function, returnOnThisValue?: any): () => any;

export declare const X_AXIS_FACES: Axis;

export declare const Y_AXIS_FACES: Axis;

export { }

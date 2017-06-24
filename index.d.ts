// Type definitions for jsPlumb 2.2.4
// Ron Newcomb

/// <reference types="jquery"/>

declare var jsPlumb: jsPlumbInstance;

type Selector = string;
type UUID = string;

interface jsPlumbInstance {
    addEndpoint(el: string | Object | Array<any>, params?: Object, referenceParams?: Object): Object | Array<any>;
    addEndpoints(target: string | Object | Array<any>, endpoints: Array<any>, referenceParams?: Object): Array<any>;
    animate(el: string | Element | Selector, properties?: Object, options?: Object): void;
    batch(fn: Function, doNotRepaintAfterwards?: boolean/* =false */): void;
    bind(event: "connection", callback: (info: ConnectionMadeEventInfo, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void;
    bind(event: "click", callback: (info: Connection, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void;
    bind(event: string, callback: (info: OnConnectionBindInfo, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void;
    cleanupListeners(): void;
    connect(params: ConnectParams, referenceParams?: Object): Connection;
    deleteEndpoint(object: UUID | Endpoint, doNotRepaintAfterwards?: boolean/* =false */): jsPlumbInstance;
    deleteEveryEndpoint(): jsPlumbInstance;
    deleteConnection(conn: Connection): void;
    doWhileSuspended(): jsPlumbInstance;
    draggable(el: Object, options?: DragOptions): jsPlumbInstance;
    empty(el: string | Element | Selector): void;
    fire(event: string, value: Object, originalEvent: Event): void;
    getAllConnections(): Object;
    getConnections(scope: string, options: Object, scope2?: string | string, source?: string | string | Selector, target?: string | string | Selector, flat?: boolean/* =false */): Array<any> | Map<any, any>;
    getContainer(): Element;
    getDefaultScope(): string;
    getEndpoint(uuid: string): Endpoint;
    getInstance(_defaults?: Object): void;
    getScope(Element: Element | string): string;
    getSelector(context?: Element | Selector, spec?: string): void;
    getSourceScope(Element: Element | string): string;
    getTargetScope(Element: Element | string): string;
    getType(id: string, typeDescriptor: string): Object;
    hide(el: string | Element | Selector, changeEndpoints?: boolean/* =false */): jsPlumbInstance;
    importDefaults(defaults: Object): jsPlumbInstance;
    isHoverSuspended(): boolean;
    isSource(el: string | Element | Selector): boolean;
    isSourceEnabled(el: string | Element | Selector, connectionType?: string): boolean;
    isSuspendDrawing(): boolean;
    isSuspendEvents(): boolean;
    isTarget(el: string | Element | Selector): boolean;
    isTargetEnabled(el: string | Element | Selector): boolean;
    makeSource(el: string | Element | Selector, params: Object, endpoint?: string | Array<any>, parent?: string | Element, scope?: string, dragOptions?: Object, deleteEndpointsOnEmpty?: boolean/* =false */, filter?: Function): void;
    makeTarget(el: string | Element | Selector, params: Object, endpoint?: string | Array<any>, scope?: string, dropOptions?: Object, deleteEndpointsOnEmpty?: boolean/* =true */, maxConnections?: number/* =-1 */, onMaxConnections?: Function): void;
    off(el: Element | Element | string, event: string, fn: Function): jsPlumbInstance;
    on(el: Element | Element | string, children?: string, event?: string, fn?: Function): jsPlumbInstance;
    ready(fn: Function): void;
    recalculateOffsets(el: string | Element | Selector): void;
    registerConnectionType(typeId: string, type: Object): void;
    registerConnectionTypes(types: Object): void;
    registerEndpointType(typeId: string, type: Object): void;
    registerEndpointTypes(types: Object): void;
    remove(el: string | Element | Selector): void;
    removeAllEndpoints(el: string | Element | Selector, recurse?: boolean/* =false */): jsPlumbInstance;
    repaint(el: string | Element | Selector): jsPlumbInstance;
    repaintEverything(clearEdits?: boolean/* =false */): jsPlumbInstance;
    reset(): void;
    restoreDefaults(): jsPlumbInstance;
    revalidate(el: string | Element | Selector): void;
    select(params?: Object, scope?: string | string, source?: string | string, target?: string | string, connections?: Connection[]): { each(fn: (conn: Connection) => void): void };
    getHoverPaintStyle(params?: Object, scope?: string | string/* =jsPlumb.DefaultScope */, source?: string | Element | Selector | Array<any>, target?: string | Element | Selector | Array<any>, element?: string | Element | Selector | Array<any>): Selection;
    setHover(container: string | Element | Selector): void;
    setDefaultScope(scope: string): jsPlumbInstance;
    setDraggable(el: string | Object | Array<any>, draggable: boolean): void;
    setHoverSuspended(hover: boolean): void;
    setIdChanged(oldId: string, newId: string): void;
    setParent(el: Selector | Element, newParent: Selector | Element | string): void;
    setScope(el: Element | string, scope: string): void;
    setSource(connection: Connection, source: string | Element | Endpoint, doNotRepaint?: boolean/* =false */): jsPlumbInstance;
    setSourceEnabled(el: string | Element | Selector, state: boolean): jsPlumbInstance;
    setSourceScope(el: Element | string, scope: string, connectionType?: string): void;
    setSuspendDrawing(val: boolean, repaintAfterwards?: boolean/* =false */): boolean;
    setSuspendEvents(val: boolean): void;
    setTarget(connection: Connection, target: string | Element | Endpoint, doNotRepaint?: boolean/* =false */): jsPlumbInstance;
    setTargetEnabled(el: string | Element | Selector, state: boolean): jsPlumbInstance;
    setTargetScope(el: Element | string, scope: string, connectionType?: string): void;
    show(el: string | Element | Selector, changeEndpoints?: boolean/* =false */): jsPlumbInstance;
    toggleDraggable(el: string | Element | Selector): boolean;
    toggleSourceEnabled(el: string | Element | Selector): boolean;
    toggleTargetEnabled(el: string | Element | Selector): boolean;
    toggleVisible(el: string | Element | Selector, changeEndpoints?: boolean/* =false */): void;
    unbind(eventOrListener?: string | Function, listener?: Function): void;
    unmakeEverySource(): jsPlumbInstance;
    unmakeEveryTarget(): jsPlumbInstance;
    unmakeSource(el: string | Element | Selector): jsPlumbInstance;
    unmakeTarget(el: string | Element | Selector): jsPlumbInstance;
}

interface ConnectionMadeEventInfo {
    connection: Connection;
    source: HTMLDivElement;
    sourceEndpoint: Endpoint;
    sourceId: string;
    target: HTMLDivElement;
    targetEndpoint: Endpoint;
    targetId: string;
}

interface OnConnectionBindInfo {
    connection: Connection;// the new Connection.you can register listeners on this etc.
    sourceId: number;// - id of the source element in the Connection
    originalSourceId: number;
    newSourceId: number;
    targetId: number;// - id of the target element in the Connection
    originalTargetId: number;
    newTargetId: number;
    source: Element;// - the source element in the Connection
    target: Element;//- the target element in the Connection
    sourceEndpoint: Endpoint;//- the source Endpoint in the Connection
    newSourceEndpoint: Endpoint;
    targetEndpoint: Endpoint;//- the targetEndpoint in the Connection
    newTargetEndpoint: Endpoint;
}

interface Defaults {
    Endpoint?: any[];
    PaintStyle?: PaintStyle;
    HoverPaintStyle?: PaintStyle;
    ConnectionsDetachable?: boolean;
    ReattachConnections?: boolean;
    ConnectionOverlays?: any[][];
    Container?: any; // string(selector or id) or element
    DragOptions?: DragOptions;
}

interface PaintStyle {
    stroke: string;
    fill: string;
    strokeWidth: number;
}

interface ArrowOverlay {
    width?: number; // 20
    length?: number; // 20
    location?: number; // 0.5
    direction?: number; // 1
    foldback?: number; // 0.623
    paintStyle?: PaintStyle;
}

interface LabelOverlay {
    label: string;
    cssClass?: string;
    location?: number; // 0.5
    labelStyle?: {
        font?: string;
        color?: string;
        fill?: string;
        borderStyle?: string;
        borderWidth?: number;// integer
        padding?: number; //integer
    };
}

interface Connections {
    detach(): void;
    length: number;
    each(e: (c: Connection) => void): void;
}

interface ConnectParams {
    uuids?: any[];
    source?: any; // string, element or endpoint
    target?: any; // string, element or endpoint
    detachable?: boolean;
    deleteEndpointsOnDetach?: boolean;
    endPoint?: string;
    anchor?: string;
    anchors?: any[];
    label?: string;
}

interface DragOptions {
    containment?: string;
}

interface SourceOptions {
    parent: string;
    endpoint?: string;
    anchor?: string;
    connector?: any[];
    connectorStyle?: PaintStyle;
}

interface TargetOptions {
    isTarget?: boolean;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
    deleteEndpointsOnDetach?: boolean;
    endpoint?: string;
    dropOptions?: DropOptions;
    anchor?: any;
}

interface DropOptions {
    hoverClass: string;
}

interface SelectParams {
    scope?: string;
    source: string;
    target: string;
}

interface Connection {
    id: string;
    setDetachable(detachable: boolean): void;
    setParameter<T>(name: string, value: T): void;
    endpoints: Endpoint[];
    getOverlay(s: string): Connection;
    showOverlay(s: string): void;
    hideOverlay(s: string): void;
    setLabel(s: string): void;
    getElement(): Connection;
}

interface Endpoint {
    anchor?: AnchorObj;// | Array<AnchorObj>;
    endpoint?: Endpoint;
    enabled?: boolean;//= true
    paintStyle?: Object;
    hoverPaintStyle?: Object;
    cssClass?: string;
    hoverClass?: string;
    source: String | Selector | Element
    container?: String | Selector | Element;
    connections?: Connection[];
    isSource?: boolean;//= false
    maxConnections: number;//= 1?
    dragOptions?: DragOptions;
    connectorStyle?: Object;
    connectorHoverStyle?: Object;
    connector?: string | Object;
    connectorOverlays?: Object;
    connectorClass?: string;
    connectorHoverClass?: string;
    connectionsDetachable?: Boolean;//= true
    isTarget?: boolean;//= false
    dropOptions?: DropOptions;
    reattach?: boolean;//= false
    parameters: Object;
    "connector-pointer-events"?: String;
    connectionType?: String;
    dragProxy?: String | Array<String>;
    id: string;
    scope: string;
    reattachConnections: boolean;
    type: string; // "Dot", etc.

    addConnection(c: Connection): void;
}

interface AnchorObj {
    type: Anchor;
    cssClass: string;
    elementId: string;
    id: string;
    locked: boolean;
    offsets: number[];
    orientation: number[];
    x: number;
    y: number;
}

type Anchor =
    "Assign" |
    "AutoDefault" |
    "Bottom" |
    "BottomCenter" |
    "BottomLeft" |
    "BottomRight" |
    "Center" |
    "Continuous" |
    "ContinuousBottom" |
    "ContinuousLeft" |
    "ContinuousRight" |
    "ContinuousTop" |
    "Left" |
    "LeftMiddle" |
    "Perimeter" |
    "Right" |
    "RightMiddle" |
    "Top" |
    "TopCenter" |
    "TopLeft" |
    "TopRight";

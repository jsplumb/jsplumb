
declare module jsPlumb {

    interface PaintStyle {
        stroke?: string;
        fill?: string;
        strokeWidth?: number;
    }

    module jsPlumb {
        function extend(target: Object, source: Object): any;

        function addClass(el: NodeListOf<Element>, clazz: string): void;

        function removeClass(el: NodeListOf<Element>, clazz: string): void;

        function on(el: any, event: string, delegateSelector: string, handler: Function): void;
        function on(el: any, event: string, handler: Function): void;

        function off(el: any, event: string, handler: Function): void;

        function revalidate(el: Element): void;

        function getInstance(_defaults?: Defaults): jsPlumbInstance;
    }

    module jsPlumbUtil {
        function isArray(obj:any):boolean;
        function isNumber(obj:any):boolean;
        function isString(obj:any):boolean;
        function isBoolean(obj:any):boolean;
        function isNull(obj:any):boolean;
        function isObject(obj:any):boolean;
        function isDate(obj:any):boolean;
        function isFunction(obj:any):boolean;
        function isNamedFunction(obj:any):boolean;
        function isEmpty(obj:any):boolean;
        function extend(target: Object, source: Object): any;
        function uuid():UUID;
        function findWithFunction(list:Array<any>, fn:(obj:any)=>boolean):number;
        function addWithFunction(list:Array<any>, item:any, fn:(obj:any)=>boolean):void;
        function removeWithFunction(list:Array<any>, fn:(obj:any)=>boolean):number;
        function suggest(list:Array<any>, item:any, insertAtHead?:boolean):boolean;
        function fastTrim(s:string):string;
    }

    type Selector = string;
    type UUID = string;
    type ElementId = string;
    type ElementRef = ElementId | Element;
    type ElementGroupRef = ElementId | Element | Array<ElementId> | Array<Element>;
    type ConnectionId = string;

    class jsPlumbInstance {

        addEndpoint(el: ElementGroupRef, params?: EndpointOptions, referenceParams?: EndpointOptions): Endpoint | Array<Endpoint>;

        addEndpoints(target: ElementGroupRef, endpoints: Array<EndpointOptions>, referenceParams?: EndpointOptions): Array<Endpoint>;

        animate(el: ElementRef, properties?: Object, options?: Object): void;

        batch(fn: Function, doNotRepaintAfterwards?: boolean/* =false */): void;

        bind(event: "connection", callback: (info: ConnectionMadeEventInfo, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void;
        bind(event: "click", callback: (info: Connection, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void;
        bind(event: string, callback: (info: OnConnectionBindInfo, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void;

        cleanupListeners(): void;

        connect(params: ConnectParams, referenceParams?: Object): Connection;

        deleteEndpoint(object: UUID | Endpoint, doNotRepaintAfterwards?: boolean/* =false */): jsPlumbInstance;

        deleteEveryConnection(): void;

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

        getEndpoints(element:string|Element):Array<Endpoint>;

        getScope(Element: Element | string): string;

        getSelector(context?: Element | Selector, spec?: string): void;

        getSourceScope(element: Element | string): string;

        getTargetScope(element: Element | string): string;

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

        reset(doNotUnbindInstanceEventListeners?: boolean): void;

        restoreDefaults(): jsPlumbInstance;

        revalidate(el: string | Element | Selector): void;

        select(params?: Object, scope?: string | string, source?: string | string, target?: string | string, connections?: Connection[]): { each(fn: (conn: Connection) => void): void };

        getHoverPaintStyle(params?: Object, scope?: string | string/* =jsPlumb.DefaultScope */, source?: string | Element | Selector | Array<any>, target?: string | Element | Selector | Array<any>, element?: string | Element | Selector | Array<any>): Selection;

        setContainer(el: string | Element | Selector): void;

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
        sourceId: string;// - id of the source element in the Connection
        originalSourceId: string;
        newSourceId: string;
        targetId: string;// - id of the target element in the Connection
        originalTargetId: string;
        newTargetId: string;
        source: Element;// - the source element in the Connection
        target: Element;//- the target element in the Connection
        sourceEndpoint: Endpoint;//- the source Endpoint in the Connection
        newSourceEndpoint: Endpoint;
        targetEndpoint: Endpoint;//- the targetEndpoint in the Connection
        newTargetEndpoint: Endpoint;
    }

    interface Defaults {
        Endpoint?: EndpointSpec;
        Endpoints?: [ EndpointSpec, EndpointSpec ];
        Anchor?: AnchorSpec;
        Anchors?: [ AnchorSpec, AnchorSpec ];
        PaintStyle?: PaintStyle;
        HoverPaintStyle?: PaintStyle;
        EndpointStyle?: PaintStyle;
        EndpointHoverStyle?: PaintStyle;
        ConnectionsDetachable?: boolean;
        ReattachConnections?: boolean;
        ConnectionOverlays?: Array<OverlaySpec>;
        Container?: any; // string(selector or id) or element
        DragOptions?: DragOptions;
        Connector?:ConnectorSpec;
    }

    interface Connections {
        detach(): void;
        length: number;
        each(e: (c: Connection) => void): void;
    }

    interface ConnectParams {
        uuids?: [UUID, UUID];
        source?: ElementRef | Endpoint;
        target?: ElementRef | Endpoint;
        detachable?: boolean;
        deleteEndpointsOnDetach?: boolean;
        endpoint?: EndpointSpec;
        anchor?: AnchorSpec;
        anchors?: [AnchorSpec, AnchorSpec];
        label?: string;
        connector?: ConnectorSpec;
        overlays?:Array<OverlaySpec>;
    }

    interface DragEventCallbackOptions {
        drag: object; // The associated Drag instance
        e: MouseEvent;
        el: HTMLElement; // element being dragged
        pos: [number, number]; // x,y location of the element. drag event only.
    }

    interface DragOptions {
        containment?: string;
        start?: (params:DragEventCallbackOptions) => void;
        drag?: (params:DragEventCallbackOptions) => void;
        stop?: (params:DragEventCallbackOptions) => void;
        cursor?: string;
        zIndex?: number;
    }

    interface DropOptions {
        hoverClass: string;
    }

    interface Connection {
        id: ConnectionId;
        setDetachable(detachable: boolean): void;
        setParameter(name: string, value: any): void;
        endpoints: [Endpoint, Endpoint];
        getOverlay(s: string): Overlay;
        showOverlay(s: string): void;
        hideOverlay(s: string): void;
        setLabel(s: string): void;
        getElement(): Connection;
        repaint():void;
    }


    /* -------------------------------------------- CONNECTORS ---------------------------------------------------- */

    interface ConnectorOptions {
    }
    type UserDefinedConnectorId = string;
    type ConnectorId = "Bezier" | "StateMachine" | "Flowchart" | "Straight" | UserDefinedConnectorId;
    type ConnectorSpec = ConnectorId | [ConnectorId, ConnectorOptions];


    /* -------------------------------------------- ENDPOINTS ------------------------------------------------------ */

    type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;
    type UserDefinedEndpointId = string;
    type EndpointSpec = EndpointId | [EndpointId, EndpointOptions];

    interface EndpointOptions {
        anchor?: AnchorSpec;
        endpoint?: Endpoint;
        enabled?: boolean;//= true
        paintStyle?: PaintStyle;
        hoverPaintStyle?: PaintStyle;
        cssClass?: string;
        hoverClass?: string;
        maxConnections: number;//= 1?
        dragOptions?: DragOptions;
        dropOptions?: DropOptions;
        connectorStyle?: PaintStyle;
        connectorHoverStyle?: PaintStyle;
        connector?: ConnectorSpec;
        connectorOverlays?: Array<OverlaySpec>;
        connectorClass?: string;
        connectorHoverClass?: string;
        connectionsDetachable?: boolean;//= true
        isSource?: boolean;//= false
        isTarget?: boolean;//= false
        reattach?: boolean;//= false
        parameters: object;
        "connector-pointer-events"?: string;
        connectionType?: string;
        dragProxy?: string | Array<string>;
        id: string;
        scope: string;
        reattachConnections: boolean;
        type: string; // "Dot", etc.
    }

    class Endpoint {
        anchor: Anchor;
        connections?: Array<Connection>;
        maxConnections: number;//= 1?
        id: string;
        scope: string;
        type: EndpointId;

        setEndpoint(spec: EndpointSpec): void;

        connectorSelector(): Connection;

        isEnabled(): boolean;

        setEnabled(enabled: boolean): void;

        setHover(hover: boolean): void;

        getElement(): Element;

        setElement(el: Element): void;
    }

    /**
     * The actual component that does the rendering.
     */
    interface EndpointRenderer {
    }

    /* -------------------------------------------- ANCHORS -------------------------------------------------------- */

    interface AnchorOptions {
    }

    type AnchorOrientationHint = -1 | 0 | 1;

    interface Anchor {
        type: AnchorId;
        cssClass: string;
        elementId: string;
        id: string;
        locked: boolean;
        offsets: [number, number];
        orientation: [AnchorOrientationHint, AnchorOrientationHint];
        x: number;
        y: number;
    }

    type AnchorId =
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


    type AnchorSpec = AnchorId | [AnchorId, AnchorOptions]


    /* --------------------------------------- OVERLAYS ------------------------------------------------------------- */

    interface OverlayOptions {
    }

    interface ArrowOverlayOptions extends OverlayOptions {
        width?: number; // 20
        length?: number; // 20
        location?: number; // 0.5
        direction?: number; // 1
        foldback?: number; // 0.623
        paintStyle?: PaintStyle;
    }

    interface LabelOverlayOptions extends OverlayOptions {
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

    type OverlayId = "Label" | "Arrow" | "PlainArrow" | "Custom";

    type OverlaySpec = OverlayId | [OverlayId, OverlayOptions];

    interface Overlay { }
}

export = jsPlumb

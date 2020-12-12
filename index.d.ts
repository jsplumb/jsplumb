
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

        addEndpoint(el: ElementGroupRef, params?: EndpointOptions, referenceParams?: EndpointOptions): Endpoint | Array<Endpoint>

        addEndpoints(target: ElementGroupRef, endpoints: Array<EndpointOptions>, referenceParams?: EndpointOptions): Array<Endpoint>

        addGroup(params: GroupOptions): Group

        addToGroup(group: Group|string, el: ElementRef, doNotFireEvent?: boolean): void

        animate(el: ElementRef, properties?: Object, options?: Object): void

        batch(fn: Function, doNotRepaintAfterwards?: boolean/* =false */): void

        bind(event: "connection", callback: (info: ConnectionMadeEventInfo, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void
        bind(event: "click", callback: (info: Connection, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void
        bind(event: string, callback: (info: OnConnectionBindInfo, originalEvent: Event) => void, insertAtStart?: boolean/* =false */): void

        cleanupListeners(): void

        collapseGroup(group: Group|string): void

        connect(params: ConnectParams, referenceParams?: Object): Connection

        deleteEndpoint(object: UUID | Endpoint, doNotRepaintAfterwards?: boolean/* =false */): jsPlumbInstance

        deleteEveryConnection(): void

        deleteEveryEndpoint(): jsPlumbInstance

        deleteConnection(conn: Connection): void

        doWhileSuspended(): jsPlumbInstance

        draggable(el: Object, options?: DragOptions): jsPlumbInstance

        empty(el: string | Element | Selector): void

        expandGroup(group: Group|string, doNotFireEvent?: boolean): void

        fire(event: string, value: Object, originalEvent: Event): void

        getAllConnections(): Array<Connection>

        getConnections(scope: string, options: Object, scope2?: string | string, source?: string | string | Selector, target?: string | string | Selector, flat?: boolean/* =false */): Array<any> | Record<any, any>

        getContainer(): Element

        getDefaultScope(): string

        getEndpoint(uuid: string): Endpoint

        getEndpoints(element:string|Element):Array<Endpoint>

        getGroup(groupId: Group|string): Group

        getGroups(): Array<Group>

        /**
         * Gets the current rotation, if any, for the element with the given id. If no specific rotation has been applied this method will return 0, never null or undefined.
         * @param elementId ID of the element to retrieve rotation for.
         * @returns The element's current rotation, 0 if no rotation applied.
         */
        getRotation(elementId:string):number

        getScope(Element: Element | string): string

        getSelector(context?: Element | Selector, spec?: string): void

        getSourceScope(element: Element | string): string
        
        getTargetScope(element: Element | string): string

        getType(id: string, typeDescriptor: string): Object

        getZoom(): number

        hide(el: string | Element | Selector, changeEndpoints?: boolean/* =false */): jsPlumbInstance

        importDefaults(defaults: Object): jsPlumbInstance

        isHoverSuspended(): boolean

        isSource(el: string | Element | Selector): boolean

        isSourceEnabled(el: string | Element | Selector, connectionType?: string): boolean

        isSuspendDrawing(): boolean

        isSuspendEvents(): boolean

        isTarget(el: string | Element | Selector): boolean

        isTargetEnabled(el: string | Element | Selector): boolean

        makeSource(el: string | Element | Selector, params: Object, endpoint?: string | Array<any>, parent?: string | Element, scope?: string, dragOptions?: Object, deleteEndpointsOnEmpty?: boolean/* =false */, filter?: Function): void

        makeTarget(el: string | Element | Selector, params: Object, endpoint?: string | Array<any>, scope?: string, dropOptions?: Object, deleteEndpointsOnEmpty?: boolean/* =true */, maxConnections?: number/* =-1 */, onMaxConnections?: Function): void

        off(el: Element | Element | string, event: string, fn: Function): jsPlumbInstance

        on(el: Element | Element | string, children?: string, event?: string, fn?: Function): jsPlumbInstance

        ready(fn: Function): void;

        recalculateOffsets(el: string | Element | Selector): void;

        refreshAllGroups(): void

        registerConnectionType(typeId: string, type: Object): void

        registerConnectionTypes(types: Object): void

        registerEndpointType(typeId: string, type: Object): void

        registerEndpointTypes(types: Object): void

        remove(el: string | Element | Selector): void

        removeAllEndpoints(el: string | Element | Selector, recurse?: boolean/* =false */): jsPlumbInstance

        removeAllGroups(deleteMembers: string, manipulateDOM?: boolean, doNotFireEvent?: boolean):void

        removeGroup(group: Group|string, deleteMembers: string, manipulateDOM?: boolean, doNotFireEvent?: boolean):OrphanedPositions|void
        
        removeFromGroup(group: Group|string, el: ElementRef, doNotFireEvent?: boolean): void

        repaint(el: string | Element | Selector): jsPlumbInstance

        repaintEverything(clearEdits?: boolean/* =false */): jsPlumbInstance

        repaintGroup(group: Group|string): void

        reset(doNotUnbindInstanceEventListeners?: boolean): void

        restoreDefaults(): jsPlumbInstance

        revalidate(el: string | Element): RedrawResult

        /**
         * Rotates the element with the given id by the given amount in degrees. This method sets two properties on the element's style: `transform:rotate(<amount>deg)` and `transform-origin:center center`.
         * Transform origins other than `center center` are not supported. To reset the rotation for some element, call `rotate(elId, 0)`.
         * @param elId
         * @param amountInDegrees
         * @param doNotRedraw
         * @returns a RedrawResult, which is empty if no redraw was requested (or an element with the given id is not being managed)
         */
        rotate(elId:string, amountInDegrees:number, doNotRedraw?:boolean):RedrawResult

        select(params?: Object, scope?: string | string, source?: string | string, target?: string | string, connections?: Array<Connection>): { each(fn: (conn: Connection) => void): void }

        getHoverPaintStyle(params?: Object, scope?: string | string/* =jsPlumb.DefaultScope */, source?: string | Element | Selector | Array<any>, target?: string | Element | Selector | Array<any>, element?: string | Element | Selector | Array<any>): Selection

        setContainer(el: string | Element | Selector): void

        setHover(container: string | Element | Selector): void

        setDefaultScope(scope: string): jsPlumbInstance

        setDraggable(el: string | Object | Array<any>, draggable: boolean): void

        setHoverSuspended(hover: boolean): void

        setIdChanged(oldId: string, newId: string): void

        setParent(el: Selector | Element, newParent: Selector | Element | string): void

        setScope(el: Element | string, scope: string): void

        setSource(connection: Connection, source: string | Element | Endpoint, doNotRepaint?: boolean/* =false */): jsPlumbInstance

        setSourceEnabled(el: string | Element | Selector, state: boolean): jsPlumbInstance

        setSourceScope(el: Element | string, scope: string, connectionType?: string): void

        setSuspendDrawing(val: boolean, repaintAfterwards?: boolean/* =false */): boolean

        setSuspendEvents(val: boolean): void

        setTarget(connection: Connection, target: string | Element | Endpoint, doNotRepaint?: boolean/* =false */): jsPlumbInstance

        setTargetEnabled(el: string | Element | Selector, state: boolean): jsPlumbInstance

        setTargetScope(el: Element | string, scope: string, connectionType?: string): void

        setZoom(val: number, repaintEverything?: boolean/* =false */): boolean

        show(el: string | Element | Selector, changeEndpoints?: boolean/* =false */): jsPlumbInstance

        toggleDraggable(el: string | Element | Selector): boolean

        toggleSourceEnabled(el: string | Element | Selector): boolean

        toggleTargetEnabled(el: string | Element | Selector): boolean

        toggleVisible(el: string | Element | Selector, changeEndpoints?: boolean/* =false */): void

        unbind(eventOrListener?: string | Function, listener?: Function): void

        unmakeEverySource(): jsPlumbInstance

        unmakeEveryTarget(): jsPlumbInstance

        unmakeSource(el: string | Element | Selector): jsPlumbInstance

        unmakeTarget(el: string | Element | Selector): jsPlumbInstance
    }

    interface ConnectionMadeEventInfo {
        connection: Connection
        source: HTMLDivElement
        sourceEndpoint: Endpoint
        sourceId: string
        target: HTMLDivElement
        targetEndpoint: Endpoint
        targetId: string
    }

    interface OnConnectionBindInfo {
        connection: Connection// the new Connection.you can register listeners on this etc.
        sourceId: string// - id of the source element in the Connection
        originalSourceId: string
        newSourceId: string
        targetId: string// - id of the target element in the Connection
        originalTargetId: string
        newTargetId: string
        source: Element// - the source element in the Connection
        target: Element//- the target element in the Connection
        sourceEndpoint: Endpoint//- the source Endpoint in the Connection
        newSourceEndpoint: Endpoint
        targetEndpoint: Endpoint//- the targetEndpoint in the Connection
        newTargetEndpoint: Endpoint
    }

    interface Defaults {
        Endpoint?: EndpointSpec
        Endpoints?: [ EndpointSpec, EndpointSpec ]
        Anchor?: AnchorSpec
        Anchors?: [ AnchorSpec, AnchorSpec ]
        PaintStyle?: PaintStyle
        HoverPaintStyle?: PaintStyle
        EndpointStyle?: PaintStyle
        EndpointHoverStyle?: PaintStyle
        ConnectionsDetachable?: boolean
        ReattachConnections?: boolean
        ConnectionOverlays?: Array<OverlaySpec>
        Container?: any // string(selector or id) or element
        DragOptions?: DragOptions
        Connector?:ConnectorSpec
    }

    interface Connections {
        detach(): void
        length: number
        each(e: (c: Connection) => void): void
    }

    interface ConnectParams {
        uuids?: [UUID, UUID]
        source?: ElementRef | Endpoint
        target?: ElementRef | Endpoint
        detachable?: boolean
        deleteEndpointsOnDetach?: boolean
        endpoint?: EndpointSpec
        anchor?: AnchorSpec
        anchors?: [AnchorSpec, AnchorSpec]
        label?: string
        connector?: ConnectorSpec
        overlays?:Array<OverlaySpec>
        cssClass?: string
        parameters?: Record<string, any>
    }

    interface DragEventCallbackOptions {
        drag: object // The associated Drag instance
        e: MouseEvent
        el: HTMLElement // element being dragged
        pos: [number, number] // x,y location of the element. drag event only.
    }

    interface DragOptions {
        containment?: string
        start?: (params:DragEventCallbackOptions) => void
        drag?: (params:DragEventCallbackOptions) => void
        stop?: (params:DragEventCallbackOptions) => void
        cursor?: string
        zIndex?: number
    }

    interface DropOptions {
        hoverClass: string
    }

    interface UIComponent {
        getParameter:(name:string) => any
        setParameter:(name: string, value: any) => void
        getParameters:() => Record<string, any>
        setParameters:(parameters:Record<string, any>) => void
    }

    interface Connection extends UIComponent {
        readonly id: ConnectionId
        setDetachable(detachable: boolean): void
        readonly endpoints: [Endpoint, Endpoint]
        getLabelOverlay(): Overlay
        getOverlays(): Object
        getOverlay(id: string): Overlay
        showOverlay(id: string): void
        hideOverlay(id: string): void
        removeOverlay(id: string): void
        addOverlay(spec: OverlaySpec): Overlay
        setLabel(s: string): void
        getElement(): Connection
        repaint():void
        readonly source: Element
        readonly target: Element
        readonly sourceId: string
        readonly targetId: string
    }


    /* -------------------------------------------- CONNECTORS ---------------------------------------------------- */

    interface ConnectorOptions { }
    type UserDefinedConnectorId = string
    type ConnectorId = "Bezier" | "StateMachine" | "Flowchart" | "Straight" | UserDefinedConnectorId
    type ConnectorSpec = ConnectorId | [ConnectorId, ConnectorOptions]


    /* -------------------------------------------- Group ---------------------------------------------------- */

    interface Group {
        id: string
        connections: GroupConnections
        collapsed: boolean
        add(el: ElementRef, doNotFireEvent?: boolean): void
        getEl(): ElementRef
        getDragArea(): ElementRef
        getAnchor(): AnchorSpec
        getEndpoint(): EndpointSpec 
        overrideDrop(el?: ElementRef, targetGroup?: Group): boolean
        remove(el: ElementRef, manipulateDOM?: boolean, doNotFireEvent?: boolean, doNotUpdateConnections?: boolean, targetGroup?: Group): void
        removeAll(manipulateDOM?: boolean, doNotFireEvent?: boolean): void
        orphanAll(): OrphanedPositions
        getMembers(): Array<ElementRef>
    }

    interface GroupOptions {
        el: ElementRef
        id?: string
        anchor?: AnchorSpec
        constrain?: boolean
        collapsed?: boolean
        draggable?: boolean
        dragOptions?: DragOptions
        droppable?: boolean
        dropOverride?: boolean
        endpoint?: EndpointSpec
        ghost?: boolean
        orphan?: boolean
        prune?: boolean
        proxied?: boolean
        revert?: boolean
    }

    type Position = {left: number, top: number}

    type OrphanedPositions = Record<string, Position>

    type GroupConnections = {source: Array<Connection>, target: Array<Connection>, internal: Array<Connection>}

    /* -------------------------------------------- ENDPOINTS ------------------------------------------------------ */

    type EndpointSpec = EndpointId |
                        [ EndpointRectangle, EndpointRectangleOptions ] |
                        [ EndpointDot, EndpointDotOptions ] |
                        [ EndpointBlank, EndpointBlankOptions ]
    

    type EndpointId = EndpointRectangle | EndpointDot | EndpointBlank
    type EndpointRectangle = "Rectangle"
    type EndpointDot = "Dot"
    type EndpointBlank = "Blank"

    type EndpointDotOptions = { radius?: number, cssClass?: string, hoverClass?: string }
    type EndpointRectangleOptions = { width?: number, height?: number, cssClass?: string, hoverClass?: string}
    type EndpointImageOptions = { src: string, cssClass?: string, hoverClass?: string }
    type EndpointBlankOptions = {}


    interface EndpointOptions {
        anchor?: AnchorSpec
        endpoint?: EndpointSpec
        enabled?: boolean//= true
        paintStyle?: PaintStyle
        hoverPaintStyle?: PaintStyle
        cssClass?: string
        hoverClass?: string
        maxConnections: number//= 1?
        dragOptions?: DragOptions
        dropOptions?: DropOptions
        connectorStyle?: PaintStyle
        connectorHoverStyle?: PaintStyle
        connector?: ConnectorSpec
        connectorOverlays?: Array<OverlaySpec>
        connectorClass?: string
        connectorHoverClass?: string
        connectionsDetachable?: boolean//= true
        isSource?: boolean//= false
        isTarget?: boolean//= false
        reattach?: boolean//= false
        parameters?: Record<string, any>
        "connector-pointer-events"?: string
        connectionType?: string
        dragProxy?: string | Array<string>
        id?: string
        scope?: string
        reattachConnections?: boolean
        type?: string // "Dot", etc.
        overlays?:Array<OverlaySpec>
        uuid?:string
    }

    interface Endpoint extends UIComponent {
        anchor: Anchor
        connections?: Array<Connection>
        maxConnections: number//= 1?
        id: string
        scope: string
        type: EndpointId

        setEndpoint(spec: EndpointSpec): void

        connectorSelector(): Connection

        isEnabled(): boolean

        setEnabled(enabled: boolean): void

        setHover(hover: boolean): void

        getElement(): Element

        setElement(el: Element): void
    }

    /**
     * The actual component that does the rendering.
     */
    interface EndpointRenderer {
    }

    /* -------------------------------------------- ANCHORS -------------------------------------------------------- */

    type AnchorOrientationHint = -1 | 0 | 1

    interface Anchor {
        type: AnchorId
        cssClass: string
        elementId: string
        id: string
        locked: boolean
        offsets: [number, number]
        orientation: [AnchorOrientationHint, AnchorOrientationHint]
        x: number
        y: number
    }

    type AnchorDynamicSpec = Array<
         AnchorStaticSpec |
         AnchorDynamicId |
         AnchorPerimeterSpec |
         AnchorContinuousSpec
    >

    type AnchorDynamicId = "AutoDefault"

    type AnchorId =
        AnchorStaticId |
        AnchorDynamicId |
        AnchorPerimeterId |
        AnchorContinuousId
    

    type AnchorStaticSpec = AnchorStaticId | AnchorArraySpec

    type AnchorStaticId =
        "Assign" |
        "Bottom" |
        "BottomCenter" |
        "BottomLeft" |
        "BottomRight" |
        "Center" |
        "Left" |
        "LeftMiddle" |
        "Right" |
        "RightMiddle" |
        "Top" |
        "TopCenter" |
        "TopLeft" |
        "TopRight"
    

    type AnchorArraySpec = [ number, number, number, number, number?, number?, string? ]

    type AnchorPerimeterSpec = AnchorPerimeterId | [ AnchorPerimeterId, { shape?: PerimeterShape, anchorCount?: number, rotation?: number } ]

    type AnchorPerimeterId = "Perimeter"

    type PerimeterShape =
        "Circle" |
        "Ellipse" |
        "Triangle" |
        "Diamond" |
        "Rectangle" |
        "Square"
    

    type AnchorContinuousSpec = AnchorContinuousId | [ AnchorContinuousId, { faces?: [ ContinuousAnchorFace ] } ]

    type AnchorContinuousId =
        "Continuous" |
        "ContinuousBottom" |
        "ContinuousLeft" |
        "ContinuousRight" |
        "ContinuousTop"
    

    type ContinuousAnchorFace = "top" | "left" | "right" | "bottom"

    type AnchorSpec =
         AnchorStaticSpec |
         AnchorDynamicSpec |
         AnchorPerimeterSpec |
         AnchorContinuousSpec
    

    interface RedrawResult {
        c:Array<Connection>
        e:Array<Endpoint>
    }

    /* --------------------------------------- OVERLAYS ------------------------------------------------------------- */

    interface OverlayOptions { }

    interface ArrowOverlayOptions extends OverlayOptions {
        width?: number // 20
        length?: number // 20
        location?: number // 0.5
        direction?: number // 1
        foldback?: number // 0.623
        paintStyle?: PaintStyle
    }

    interface LabelOverlayOptions extends OverlayOptions {
        label: string
        cssClass?: string
        location?: number // 0.5
        labelStyle?: {
            font?: string
            color?: string
            fill?: string
            borderStyle?: string
            borderWidth?: number// integer
            padding?: number //integer
        }
    }

    type OverlayId = "Label" | "Arrow" | "PlainArrow" | "Custom"

    type OverlaySpec = OverlayId | [OverlayId, OverlayOptions]

    interface Overlay { }
}

export = jsPlumb

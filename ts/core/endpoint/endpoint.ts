import {AnchorLocations, AnchorSpec, makeAnchorFromSpec} from "../factory/anchor-factory"
import { Anchor} from "../anchor/anchor"
import {PaintStyle} from "../styles"
import {OverlaySpec} from "../overlay/overlay"
import {ConnectorSpec} from "../connector/abstract-connector"
import {Connection} from "../connector/connection-impl"
import { EndpointFactory } from "../factory/endpoint-factory"
import { EndpointRepresentation } from './endpoints'
import {extend, merge, isString, isAssignableFrom} from '../util'
import {DeleteConnectionOptions, JsPlumbInstance} from '../core'
import {Component} from "../component/component"
import {DEFAULT, EVENT_ANCHOR_CHANGED, EVENT_MAX_CONNECTIONS} from "../constants"

export type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId
export type UserDefinedEndpointId = string
export type EndpointParams = any
export type FullEndpointSpec = {type:EndpointId, options:EndpointParams}
export type EndpointSpec = EndpointId | FullEndpointSpec

export interface EndpointStyle extends PaintStyle, Record<string, any> {}

export interface InternalEndpointOptions<E> extends EndpointOptions<E> {
    isTemporarySource?:boolean
    elementId?:string
    _transient?:boolean
    type?: string; // "Dot", etc.
    id?: string
    preparedAnchor?:Anchor
    connections?:Array<Connection>
    element?:E
    existingEndpoint?:EndpointRepresentation<E>
}

export interface EndpointOptions<E = any> {

    parameters?:Record<string, any>

    scope?:string
    cssClass?:string
    data?:any
    hoverClass?:string

    /**
     * Optional definition for both the source and target anchors for any connection created with this endpoint as its source.
     * If you do not supply this, the default `anchors` definition for the jsPlumb instance will be used
     */
    anchor?: AnchorSpec

    /**
     * Optional definition for the source and target anchors for any connection created with this endpoint as its source.
     * If you do not supply this, the default `anchors` definition for the jsPlumb instance will be used
     */
    anchors?:[ AnchorSpec, AnchorSpec ]

    /**
     * Optional endpoint definition. If you do not supply this, the default endpoint definition for the jsPlumb instance will be used
     */
    endpoint?: EndpointSpec

    /**
     * Whether or not the endpoint is initially enabled. Defaults to true.
     */
    enabled?: boolean

    /**
     * Optional paint style to assign to the endpoint
     */
    paintStyle?: PaintStyle

    /**
     * Optional paint style to assign, on hover, to the endpoint.
     */
    hoverPaintStyle?: PaintStyle

    /**
     * Maximum number of connections this endpoint supports. Defaults to 1. Use a value of -1 to indicate there is no limit.
     */
    maxConnections?: number

    /**
     * Optional paint style to assign to a connection that is created with this endpoint as its source.
     */
    connectorStyle?: PaintStyle

    /**
     * Optional paint style to assign, on hover, to a connection that is created with this endpoint as its source.
     */
    connectorHoverStyle?: PaintStyle

    /**
     * Optional connector definition for connections that are created with this endpoint as their source.
     */
    connector?: ConnectorSpec

    /**
     * Optional list of overlays to add to a connection that is created with this endpoint as its source.
     */
    connectorOverlays?: Array<OverlaySpec>

    /**
     * Optional class to assign to connections that have this endpoint as their source.
     */
    connectorClass?: string

    /**
     * Optional class to assign, on mouse hover,  to connections that have this endpoint as their source.
     */
    connectorHoverClass?: string

    /**
     * Whether or not connections that have this endpoint as their source are configured to be detachable with the mouse. Defaults to true.
     */
    connectionsDetachable?: boolean

    /**
     * Whether or not this Endpoint acts as a source for connections dragged with the mouse. Defaults to true
     */
    source?: boolean//= true

    /**
     * Whether or not this Endpoint acts as a target for connections dragged with the mouse. Defaults to true.
     */
    target?: boolean// = true

    /**
     * Optional 'type' for connections that have this endpoint as their source.
     */
    edgeType?: string

    /**
     * Whether or not to set `reattach:true` on connections that have this endpoint as their source. Defaults to false.
     */
    reattachConnections?: boolean

    /**
     * Optional "port id" for this endpoint - a logical mapping of the endpoint to some name.
     */
    portId?:string

    /**
     * Optional user-supplied ID for this endpoint.
     */
    uuid?:string

    /**
     * Whether or not connections can be dragged from the endpoint when it is full. Since no new connection could be dragged from an endpoint that is
     * full, in a practical sense this means whether or not existing connections can be dragged off an endpoint that is full. Defaults to true.
     */
    dragAllowedWhenFull?:boolean

    /**
     * Optional callback to fire when the endpoint transitions to the state that it is now full.
     * @param value
     * @param event
     */
    onMaxConnections?:(value:any, event?:any) => any

    /**
     * Optional cost to set for connections that have this endpoint as their source. Defaults to 1.
     */
    connectionCost?:number

    /**
     * Whether or not connections that have this endpoint as their source are considered "directed".
     */
    connectionsDirected?:boolean

    /**
     * Whether or not to delete the Endpoint if it transitions to the state that it has no connections. Defaults to false. Note that this only
     * applies if the endpoint previously had one or more connections and now has none: a newly created endpoint with this flag set is not
     * immediately deleted.
     */
    deleteOnEmpty?:boolean

}


const typeParameters = [ "connectorStyle", "connectorHoverStyle", "connectorOverlays", "connector", "connectionType", "connectorClass", "connectorHoverClass" ]

export class Endpoint<E = any> extends Component {

    getIdPrefix ():string { return  "_jsplumb_e"; }

    getTypeDescriptor ():string {
        return "endpoint"
    }

    getXY() {
        return { x:this.endpoint.x, y:this.endpoint.y }
    }

    connections:Array<Connection<E>> = []
    anchor:Anchor
    endpoint:EndpointRepresentation<any>
    element:E
    elementId:string
    dragAllowedWhenFull:boolean = true
    timestamp:string

    portId:string

    maxConnections:number

    proxiedBy:Endpoint<E>

    connectorClass:string
    connectorHoverClass:string

    finalEndpoint:Endpoint<E>

    enabled = true

    isSource:boolean
    isTarget:boolean
    isTemporarySource:boolean

    connectionCost:number = 1
    connectionsDirected:boolean
    connectionsDetachable:boolean
    reattachConnections:boolean

    currentAnchorClass:string

    referenceEndpoint:Endpoint<E>

    edgeType:string
    connector:ConnectorSpec
    connectorOverlays:Array<OverlaySpec>

    connectorStyle:PaintStyle
    connectorHoverStyle:PaintStyle

    deleteOnEmpty:boolean

    uuid:string

    scope:string

    defaultLabelLocation = [ 0.5, 0.5 ] as [number, number]
    getDefaultOverlayKey () { return "endpointOverlays"; }

    constructor(public instance:JsPlumbInstance, params:InternalEndpointOptions<E>) {
        super(instance, params)

        this.appendToDefaultType({
            edgeType:params.edgeType,
            maxConnections: params.maxConnections == null ? this.instance.defaults.maxConnections : params.maxConnections, // maximum number of connections this endpoint can be the source of.,
            paintStyle: params.paintStyle || this.instance.defaults.endpointStyle,
            hoverPaintStyle: params.hoverPaintStyle || this.instance.defaults.endpointHoverStyle,
            connectorStyle: params.connectorStyle,
            connectorHoverStyle: params.connectorHoverStyle,
            connectorClass: params.connectorClass,
            connectorHoverClass: params.connectorHoverClass,
            connectorOverlays: params.connectorOverlays,
            connector: params.connector
        })

        this.enabled = !(params.enabled === false)
        this.visible = true
        this.element = params.element

        this.uuid = params.uuid

        this.portId = params.portId
        this.elementId = params.elementId

        this.connectionCost = params.connectionCost == null ? 1 : params.connectionCost
        this.connectionsDirected = params.connectionsDirected
        this.currentAnchorClass = ""
        this.events = {}

        this.connectorOverlays = params.connectorOverlays

        this.connectorStyle = params.connectorStyle
        this.connectorHoverStyle = params.connectorHoverStyle
        this.connector = params.connector
        this.edgeType = params.edgeType
        this.connectorClass = params.connectorClass
        this.connectorHoverClass = params.connectorHoverClass

        this.deleteOnEmpty = params.deleteOnEmpty === true

        this.isSource = params.source !== false
        this.isTemporarySource = params.isTemporarySource || false
        this.isTarget = params.target !== false

        this.connections = params.connections || []

        this.scope = params.scope || instance.defaultScope
        this.timestamp = null
        this.reattachConnections = params.reattachConnections || instance.defaults.reattachConnections
        this.connectionsDetachable = instance.defaults.connectionsDetachable
        if (params.connectionsDetachable === false) {
            this.connectionsDetachable = false
        }
        this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false

        if (params.onMaxConnections) {
            this.bind(EVENT_MAX_CONNECTIONS, params.onMaxConnections)
        }

        let ep = params.endpoint || params.existingEndpoint || instance.defaults.endpoint
        this.setEndpoint(ep)

        if (params.preparedAnchor != null) {
            this.setPreparedAnchor(params.preparedAnchor)
        } else {
            let anchorParamsToUse:AnchorSpec|Array<AnchorSpec> = params.anchor ? params.anchor : params.anchors ? params.anchors : (instance.defaults.anchor || AnchorLocations.Top)
            this.setAnchor(anchorParamsToUse)
        }

        // finally, set type if it was provided
        let type = [ DEFAULT, (params.type || "")].join(" ")
        this.addType(type, params.data)
    }

    private _updateAnchorClass ():void {
        const ac = this.anchor.getCssClass()
        if (ac != null && ac.length > 0) {
            // stash old, get new
            let oldAnchorClass = this.instance.endpointAnchorClassPrefix + "-" + this.currentAnchorClass
            this.currentAnchorClass = ac
            let anchorClass = this.instance.endpointAnchorClassPrefix + (this.currentAnchorClass ? "-" + this.currentAnchorClass : "")

            if (oldAnchorClass !== anchorClass) {
                this.removeClass(oldAnchorClass)
                this.addClass(anchorClass)
                this.instance.removeClass(this.element, oldAnchorClass)
                this.instance.addClass(this.element, anchorClass)
            }
        }
    }

    private prepareAnchor (anchorParams:any):Anchor {
        let a = makeAnchorFromSpec(this.instance, anchorParams, this.elementId)
        a.bind(EVENT_ANCHOR_CHANGED, (currentAnchor:Anchor) => {
            this.fire(EVENT_ANCHOR_CHANGED, {endpoint: this, anchor: currentAnchor})
            this._updateAnchorClass()
        })
        return a
    }

    private setPreparedAnchor (anchor:Anchor):Endpoint {
        this.anchor = anchor
        this._updateAnchorClass()
        return this
    }

    setAnchor (anchorParams:AnchorSpec | Array<AnchorSpec>):Endpoint {
        let a = this.prepareAnchor(anchorParams)
        this.setPreparedAnchor(a)
        return this
    }

    addConnection(conn:Connection) {
        const wasFull = this.isFull()
        const wasEmpty = this.connections.length === 0
        this.connections.push(conn)

        if (wasEmpty) {
            this.addClass(this.instance.endpointConnectedClass)
        }
        if (this.isFull()) {
            if (!wasFull) {
                this.addClass(this.instance.endpointFullClass)
            }
        } else if (wasFull) {
            this.removeClass(this.instance.endpointFullClass)
        }
    }

    /**
     * Detaches this Endpoint from the given Connection.  If `deleteOnEmpty` is set to true and there are no
     * Connections after this one is detached, the Endpoint is deleted.
     * @param connection Connection from which to detach.
     * @param idx Optional, used internally to identify if this is the source (0) or target endpoint (1). Sometimes we already know this when we call this method.
     * @param transientDetach For internal use only.
     */
    detachFromConnection (connection:Connection, idx?:number, transientDetach?:boolean):void {
        idx = idx == null ? this.connections.indexOf(connection) : idx
        if (idx >= 0) {
            this.connections.splice(idx, 1)
            // refresh the endpoint's appearance (which can change based on the number of connections, via classes)
            this.instance.refreshEndpoint(this)
        }

        if (!transientDetach  && this.deleteOnEmpty && this.connections.length === 0) {
            this.instance.deleteEndpoint(this)
        }
    }

    /**
     * Delete every connection in the instance.
     * @param params
     */
    deleteEveryConnection (params?:DeleteConnectionOptions):void {
        let c = this.connections.length
        for (let i = 0; i < c; i++) {
            this.instance.deleteConnection(this.connections[0], params)
        }
    }

    /**
     * Removes all connections from this endpoint to the given other endpoint.
     * @param otherEndpoint
     */
    detachFrom (otherEndpoint:Endpoint):Endpoint {
        let c = []
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].endpoints[1] === otherEndpoint || this.connections[i].endpoints[0] === otherEndpoint) {
                c.push(this.connections[i])
            }
        }
        for (let j = 0, count = c.length; j < count; j++) {
            this.instance.deleteConnection(c[0])
        }
        return this
    }

    setVisible(v:boolean, doNotChangeConnections?:boolean, doNotNotifyOtherEndpoint?:boolean) {

        super.setVisible(v)

        this.endpoint.setVisible(v)

        if (v) {
            this.showOverlays()
        } else {
            this.hideOverlays()
        }

        if (!doNotChangeConnections) {
            for (let i = 0; i < this.connections.length; i++) {
                this.connections[i].setVisible(v)
                if (!doNotNotifyOtherEndpoint) {
                    let oIdx = this === this.connections[i].endpoints[0] ? 1 : 0
                    // only change the other endpoint if this is its only connection.
                    if (this.connections[i].endpoints[oIdx].connections.length === 1) {
                        this.connections[i].endpoints[oIdx].setVisible(v, true, true)
                    }
                }
            }
        }
    }

    applyType(t:any, typeMap:any):void {

        super.applyType(t, typeMap)

        this.setPaintStyle(t.endpointStyle || t.paintStyle)
        this.setHoverPaintStyle(t.endpointHoverStyle || t.hoverPaintStyle)

        this.connectorStyle = t.connectorStyle
        this.connectorHoverStyle = t.connectorHoverStyle
        this.connector = t.connector
        this.connectorOverlays = t.connectorOverlays
        this.edgeType = t.edgeType

        if (t.maxConnections != null) {
            this.maxConnections = t.maxConnections
        }
        if (t.scope) {
            this.scope = t.scope
        }
        extend(t, typeParameters)

        this.instance.applyEndpointType(this, t)

    }

    destroy():void {

        super.destroy()

        let anchorClass = this.instance.endpointAnchorClassPrefix + (this.currentAnchorClass ? "-" + this.currentAnchorClass : "")
        this.instance.removeClass(this.element, anchorClass)
        this.anchor = null
        if(this.endpoint != null) {
            this.instance.destroyEndpoint(this)
        }


    }

    isFull():boolean {
        return this.maxConnections === 0 ? true : !(this.isFloating() || this.maxConnections < 0 || this.connections.length < this.maxConnections)
    }

    isFloating():boolean {
        return this.anchor != null && this.anchor.isFloating
    }

    /**
     * Test if this Endpoint is connected to the given Endpoint.
     * @param otherEndpoint
     */
    isConnectedTo(otherEndpoint:Endpoint):boolean {
        let found = false
        if (otherEndpoint) {
            for (let i = 0; i < this.connections.length; i++) {
                if (this.connections[i].endpoints[1] === otherEndpoint || this.connections[i].endpoints[0] === otherEndpoint) {
                    found = true
                    break
                }
            }
        }
        return found
    }

    setDragAllowedWhenFull(allowed:boolean):void {
        this.dragAllowedWhenFull = allowed
    }

    equals(endpoint:Endpoint):boolean {
        return this.anchor.equals(endpoint.anchor)
    }

    getUuid():string {
        return this.uuid
    }

    connectorSelector ():Connection {
        return this.connections[0]
    }

    private prepareEndpoint<C>(ep:EndpointSpec | EndpointRepresentation<C>, typeId?:string):EndpointRepresentation<C> {

        let endpointArgs = {
            cssClass: this.cssClass,
            endpoint: this
        }

        let endpoint:EndpointRepresentation<C>

        if(isAssignableFrom(ep, EndpointRepresentation)) {

            const epr = (ep as EndpointRepresentation<C>)
            endpoint = EndpointFactory.clone(epr)

        } else if (isString(ep)) {
            endpoint = EndpointFactory.get(this, ep as string, endpointArgs)
        }
        else {
            const fep = ep as FullEndpointSpec
            extend(endpointArgs, fep.options || {})
            endpoint = EndpointFactory.get(this, fep.type, endpointArgs)
        }

        endpoint.typeId = typeId
        return endpoint
    }

    setEndpoint<C>(ep:EndpointSpec | EndpointRepresentation<C>) {
        let _ep = this.prepareEndpoint(ep)
        this.setPreparedEndpoint(_ep)
    }

    private setPreparedEndpoint<C>(ep:EndpointRepresentation<C>) {
        if (this.endpoint != null) {
            this.instance.destroyEndpoint(this)
        }
        this.endpoint = ep
    }

    addClass(clazz: string, cascade?:boolean): void {
        super.addClass(clazz, cascade)
        if (this.endpoint != null) {
            this.endpoint.addClass(clazz)
        }
    }

    removeClass(clazz: string, cascade?:boolean): void {
        super.removeClass(clazz, cascade)
        if (this.endpoint != null) {
            this.endpoint.removeClass(clazz)
        }
    }
}

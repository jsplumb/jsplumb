import {AnchorSpec, makeAnchorFromSpec} from "../factory/anchor-factory"
import { Anchor} from "../anchor/anchor"
import {PaintStyle} from "../styles"
import {OverlaySpec} from "../overlay/overlay"
import {ComponentOptions} from "../component/component"
import {ConnectorSpec} from "../connector/abstract-connector"
import {Connection} from "../connector/connection-impl"
import { EndpointFactory } from "../factory/endpoint-factory"
import { EndpointRepresentation } from './endpoints'
import {extend, merge, isString, isAssignableFrom} from '../util'
import { JsPlumbInstance } from '../core'
import { OverlayCapableComponent } from '../component/overlay-capable-component'

export type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId
export type UserDefinedEndpointId = string
export type EndpointParams = any
export type FullEndpointSpec = {type:EndpointId, options:EndpointParams}
export type EndpointSpec = EndpointId | FullEndpointSpec

export interface EndpointStyle extends PaintStyle, Record<string, any> {}

export interface InternalEndpointOptions<E> extends EndpointOptions<E> {
    isTemporarySource?:boolean
}

export interface EndpointDropOptions {hoverClass?:string, activeClass?:string, rank?:number}

export interface EndpointOptions<E = any> extends ComponentOptions {
    preparedAnchor?:Anchor
    anchor?: AnchorSpec
    anchors?:[ AnchorSpec, AnchorSpec ]
    endpoint?: EndpointSpec | EndpointRepresentation<E>
    enabled?: boolean;//= true
    paintStyle?: PaintStyle
    hoverPaintStyle?: PaintStyle
    cssClass?: string
    hoverClass?: string
    maxConnections?: number;//= 1?
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
    parameters?: object
    dropOptions?:EndpointDropOptions

    data?:any

    isTemporarySource?:boolean

    connectionType?: string
    dragProxy?: string | Array<string>
    id?: string
    scope?: string
    reattachConnections?: boolean
    type?: string; // "Dot", etc.
    connectorTooltip?:string

    portId?:string
    uuid?:string
    source?:E

    connections?:Array<Connection>

    detachable?:boolean
    dragAllowedWhenFull?:boolean

    onMaxConnections?:(value:any, event?:any) => any

    connectionCost?:number
    connectionsDirected?:boolean
    deleteOnEmpty?:boolean

    elementId?:string
    _transient?:boolean
}

const typeParameters = [ "connectorStyle", "connectorHoverStyle", "connectorOverlays", "connector", "connectionType", "connectorClass", "connectorHoverClass" ]

export class Endpoint<E = any> extends OverlayCapableComponent {

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

    connectionType:string
    connector:ConnectorSpec
    connectorOverlays:Array<OverlaySpec>

    connectorStyle:PaintStyle
    connectorHoverStyle:PaintStyle

    dragProxy:any

    deleteOnEmpty:boolean

    private uuid:string

    scope:string

    defaultLabelLocation = [ 0.5, 0.5 ] as [number, number]
    getDefaultOverlayKey () { return "endpointOverlays"; }

    constructor(public instance:JsPlumbInstance, params:InternalEndpointOptions<E>) {
        super(instance, params)

        this.appendToDefaultType({
            connectionType:params.connectionType,
            maxConnections: params.maxConnections == null ? this.instance.Defaults.maxConnections : params.maxConnections, // maximum number of connections this endpoint can be the source of.,
            paintStyle: params.paintStyle || this.instance.Defaults.endpointStyle,
            hoverPaintStyle: params.hoverPaintStyle || this.instance.Defaults.endpointHoverStyle,
            connectorStyle: params.connectorStyle,
            connectorHoverStyle: params.connectorHoverStyle,
            connectorClass: params.connectorClass,
            connectorHoverClass: params.connectorHoverClass,
            connectorOverlays: params.connectorOverlays,
            connector: params.connector,
            connectorTooltip: params.connectorTooltip
        })

        this.enabled = !(params.enabled === false)
        this.visible = true
        this.element = params.source

        this.uuid = params.uuid

        this.portId = params.portId
        this.elementId = params.elementId
        this.dragProxy = params.dragProxy

        this.connectionCost = params.connectionCost == null ? 1 : params.connectionCost
        this.connectionsDirected = params.connectionsDirected
        this.currentAnchorClass = ""
        this.events = {}

        this.connectorOverlays = params.connectorOverlays

        this.connectionsDetachable = params.connectionsDetachable
        this.reattachConnections = params.reattachConnections
        this.connectorStyle = params.connectorStyle
        this.connectorHoverStyle = params.connectorHoverStyle
        this.connector = params.connector
        this.connectionType = params.connectionType
        this.connectorClass = params.connectorClass
        this.connectorHoverClass = params.connectorHoverClass

        this.deleteOnEmpty = params.deleteOnEmpty === true

        // copy all params onto this class
        extend((<any>this), params, typeParameters)

        this.isSource = params.isSource || false
        this.isTemporarySource = params.isTemporarySource || false
        this.isTarget = params.isTarget || false

        this.connections = params.connections || []

        this.scope = params.scope || instance.defaultScope
        this.timestamp = null
        this.reattachConnections = params.reattach || instance.Defaults.reattachConnections
        this.connectionsDetachable = instance.Defaults.connectionsDetachable
        if (params.connectionsDetachable === false || params.detachable === false) {
            this.connectionsDetachable = false
        }
        this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false

        if (params.onMaxConnections) {
            this.bind("maxConnections", params.onMaxConnections)
        }

        let ep = params.endpoint || instance.Defaults.endpoint
        this.setEndpoint(ep as any)

        if (params.preparedAnchor != null) {
            this.setPreparedAnchor(params.preparedAnchor)
        } else {
            let anchorParamsToUse:AnchorSpec|Array<AnchorSpec> = params.anchor ? params.anchor : params.anchors ? params.anchors : (instance.Defaults.anchor || "Top")
            this.setAnchor(anchorParamsToUse)
        }

        // finally, set type if it was provided
        let type = [ "default", (params.type || "")].join(" ")
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
        a.bind("anchorChanged", (currentAnchor:Anchor) => {
            this.fire("anchorChanged", {endpoint: this, anchor: currentAnchor})
            this._updateAnchorClass()
        })
        return a
    }

    // TODO refactor, somehow, to take AnchorManager out of the equation. update, rc35 - to take Router out of the equation.
    setPreparedAnchor (anchor:Anchor):Endpoint {
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
        this.connections.push(conn)
        this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass)
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
     * @param connection
     * @param idx
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

    deleteEveryConnection (params?:any):void {
        let c = this.connections.length
        for (let i = 0; i < c; i++) {
            this.instance.deleteConnection(this.connections[0], params)
        }
    }

    detachFrom (targetEndpoint:Endpoint):Endpoint {
        let c = []
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].endpoints[1] === targetEndpoint || this.connections[i].endpoints[0] === targetEndpoint) {
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

        this[v ? "showOverlays" : "hideOverlays"]()
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
        this.connectionType = t.connectionType

        if (t.maxConnections != null) {
            this.maxConnections = t.maxConnections
        }
        if (t.scope) {
            this.scope = t.scope
        }
        extend(t, typeParameters)

        this.instance.applyEndpointType(this, t)

    }

    destroy(force?:boolean):void {

        // TODO i feel like this anchor class stuff should be in the renderer? is it DOM specific?
        let anchorClass = this.instance.endpointAnchorClassPrefix + (this.currentAnchorClass ? "-" + this.currentAnchorClass : "")
        this.instance.removeClass(this.element, anchorClass)
        this.anchor = null
        if(this.endpoint != null) {
            this.instance.destroyEndpoint(this)
        }

        super.destroy(force)
    }

    isFull():boolean {
        return this.maxConnections === 0 ? true : !(this.isFloating() || this.maxConnections < 0 || this.connections.length < this.maxConnections)
    }

    isFloating():boolean {
        return this.anchor != null && this.anchor.isFloating
    }

    isConnectedTo(endpoint:Endpoint):boolean {
        let found = false
        if (endpoint) {
            for (let i = 0; i < this.connections.length; i++) {
                if (this.connections[i].endpoints[1] === endpoint || this.connections[i].endpoints[0] === endpoint) {
                    found = true
                    break
                }
            }
        }
        return found
    }

    setElementId(_elId:string):void {
        this.elementId = _elId
        this.anchor.elementId = _elId
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

    prepareEndpoint<C>(ep:EndpointSpec | EndpointRepresentation<C>, typeId?:string):EndpointRepresentation<C> {

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
            endpointArgs = merge(fep.options, endpointArgs)
            endpoint = EndpointFactory.get(this, fep.type, endpointArgs)
        }

        endpoint.typeId = typeId
        return endpoint
    }

    setEndpoint(ep:EndpointSpec) {
        let _ep = this.prepareEndpoint(ep)
        this.setPreparedEndpoint(_ep)
    }

    setPreparedEndpoint<C>(ep:EndpointRepresentation<C>) {
        if (this.endpoint != null) {
            this.instance.destroyEndpoint(this)
        }
        this.endpoint = ep
    }

    addClass(clazz: string, dontUpdateOverlays?: boolean): void {
        super.addClass(clazz, dontUpdateOverlays)
        if (this.endpoint != null) {
            this.endpoint.addClass(clazz)
        }
    }

    removeClass(clazz: string, dontUpdateOverlays?: boolean): void {
        super.removeClass(clazz, dontUpdateOverlays)
        if (this.endpoint != null) {
            this.endpoint.removeClass(clazz)
        }
    }
}

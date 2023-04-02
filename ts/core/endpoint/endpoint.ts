
import {Connection} from "../connector/connection-impl"
import { EndpointFactory } from "../factory/endpoint-factory"
import { EndpointRepresentation } from './endpoints'
import { DeleteConnectionOptions, JsPlumbInstance } from '../core'
import { Component } from "../component/component"
import { EVENT_ANCHOR_CHANGED, EVENT_MAX_CONNECTIONS } from "../constants"
import { InternalEndpointOptions } from "./endpoint-options"
import { LightweightAnchor } from '../factory/anchor-record-factory'
import {extend, isAssignableFrom, isString} from "../../util/util"
import {OverlaySpec} from "../../common/overlay"
import {AnchorLocations, AnchorSpec} from "../../common/anchor"
import {EndpointSpec, FullEndpointSpec} from "../../common/endpoint"
import {PaintStyle} from "../../common/paint-style"
import {ConnectorSpec} from "../../common/connector"
import {DEFAULT} from "../../common/index"

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

    _anchor:LightweightAnchor

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

        this.isSource = params.source || false
        this.isTemporarySource = params.isTemporarySource || false
        this.isTarget = params.target || false

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
        const ac = this._anchor && this._anchor.cssClass
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

    private setPreparedAnchor (anchor:LightweightAnchor):Endpoint {
        this.instance.router.setAnchor(this, anchor)
        this._updateAnchorClass()
        return this
    }

    /**
     * Called by the router when a dynamic anchor has changed its current location.
     * @param currentAnchor
     */
    _anchorLocationChanged(currentAnchor:LightweightAnchor) {
        this.fire(EVENT_ANCHOR_CHANGED, {endpoint: this, anchor: currentAnchor})
        this._updateAnchorClass()
    }

    setAnchor (anchorParams:AnchorSpec | Array<AnchorSpec>):Endpoint {
        const a = this.instance.router.prepareAnchor(anchorParams)
        this.setPreparedAnchor(a)
        return this
    }

    addConnection(conn:Connection) {
        this.connections.push(conn)
        this.instance._refreshEndpoint(this)
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
            this.instance._refreshEndpoint(this)
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

        // as issue 1110 pointed out, an endpointHoverStyle would result in an endpoint not being cleaned up
        // properly, as when deleting its connections, the connection sets hover(false) on each endpoint. When the endpoint
        // paints, it if it has no canvas, a new one is created
        this.deleted = true

        if(this.endpoint != null) {
            this.instance.destroyEndpoint(this)
        }

    }

    isFull():boolean {
        return this.maxConnections === 0 ? true : !(this.isFloating() || this.maxConnections < 0 || this.connections.length < this.maxConnections)
    }

    isFloating():boolean {
        return this.instance.router.isFloating(this)
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

    // equals(endpoint:Endpoint):boolean {
    //     return this.anchor.equals(endpoint.anchor)
    // }

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
            // cloning an existing endpoint
            const epr = (ep as EndpointRepresentation<C>)
            endpoint = EndpointFactory.clone(epr)
            // ensure the css classes are correctly applied
            endpoint.classes = endpointArgs.cssClass.split(" ")

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

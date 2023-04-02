
import { JsPlumbInstance } from "../core"
import {ConnectParams } from '../params'
import { ConnectionTypeDescriptor } from "../type-descriptors"
import {AbstractConnector} from "./abstract-connector"
import {Endpoint} from "../endpoint/endpoint"

import {Component} from "../component/component"
import {Overlay} from "../overlay/overlay"
import {makeLightweightAnchorFromSpec} from "../factory/anchor-record-factory"

import * as Constants from "../constants"
import {extend, isObject, isString, merge, Merge, uuid} from "../../util/util"
import {AnchorSpec} from "../../common/anchor"
import {ConnectorSpec, ConnectorWithOptions} from "../../common/connector"
import {EndpointSpec} from "../../common/endpoint"
import {PaintStyle} from "../../common/paint-style"
import {DEFAULT} from "../../common/index"

/**
 * @internal
 */
const TYPE_ITEM_ANCHORS = "anchors"
/**
 * @internal
 */
const TYPE_ITEM_CONNECTOR = "connector"

function prepareEndpoint<E>(conn:Connection<E>, existing:Endpoint, index:number, anchor?:AnchorSpec, element?:E, elementId?:string, endpoint?:EndpointSpec):Endpoint {

    let e

    if (existing) {
        conn.endpoints[index] = existing
        existing.addConnection(conn)
    } else {

        let ep = endpoint || conn.endpointSpec || conn.endpointsSpec[index] || conn.instance.defaults.endpoints[index] || conn.instance.defaults.endpoint

        let es = conn.endpointStyles[index] || conn.endpointStyle || conn.instance.defaults.endpointStyles[index] || conn.instance.defaults.endpointStyle

        // Endpoints derive their fill from the connector's stroke, if no fill was specified.
        if (es.fill == null && conn.paintStyle != null) {
            es.fill = conn.paintStyle.stroke
        }

        if (es.outlineStroke == null && conn.paintStyle != null) {
            es.outlineStroke = conn.paintStyle.outlineStroke
        }
        if (es.outlineWidth == null && conn.paintStyle != null) {
            es.outlineWidth = conn.paintStyle.outlineWidth
        }

        let ehs = conn.endpointHoverStyles[index] || conn.endpointHoverStyle || conn.endpointHoverStyle || conn.instance.defaults.endpointHoverStyles[index] || conn.instance.defaults.endpointHoverStyle
        // endpoint hover fill style is derived from connector's hover stroke style
        if (conn.hoverPaintStyle != null) {
            if (ehs == null) {
                ehs = {}
            }
            if (ehs.fill == null) {
                ehs.fill = conn.hoverPaintStyle.stroke
            }
        }

        let u = conn.uuids ? conn.uuids[index] : null

        anchor = anchor != null ? anchor : conn.instance.defaults.anchors != null ? conn.instance.defaults.anchors[index] : conn.instance.defaults.anchor

        e = conn.instance._internal_newEndpoint({
            paintStyle: es,
            hoverPaintStyle: ehs,
            endpoint: ep,
            connections: [ conn ],
            uuid: u,
            element: element,
            scope: conn.scope,
            anchor:anchor,
            reattachConnections: conn.reattach || conn.instance.defaults.reattachConnections,
            connectionsDetachable: conn.detachable || conn.instance.defaults.connectionsDetachable
        })

        conn.instance._refreshEndpoint(e)

        if (existing == null) {
            e.deleteOnEmpty = true
        }
        conn.endpoints[index] = e
    }

    return e
}

/**
 * @internal
 */
export type ConnectionOptions<E = any>  =  Merge<ConnectParams<E>,  {

    source?:E
    target?:E
    sourceEndpoint?:Endpoint
    targetEndpoint?:Endpoint

    previousConnection?:Connection<E>

    geometry?:any
}>

/**
 * @public
 */
export class Connection<E = any> extends Component {

    connector:AbstractConnector
    defaultLabelLocation:number = 0.5
    scope:string

    typeId = "_jsplumb_connection"
    getIdPrefix () { return  "_jsPlumb_c"; }
    getDefaultOverlayKey():string { return Constants.KEY_CONNECTION_OVERLAYS }

    getXY() {
        return { x:this.connector.x, y:this.connector.y }
    }

    previousConnection:Connection

    /**
     * The id of the source of the connection
     * @public
     */
    sourceId:string
    /**
     * The id of the target of the connection
     * @public
     */
    targetId:string
    /**
     * The element that is the source of the connection
     * @public
     */
    source:E
    /**
     * The element that is the target of the connection
     * @public
     */
    target:E

    /**
     * Whether or not this connection is detachable
     * @public
     */
    detachable:boolean = true

    /**
     * Whether or not this connection should be reattached if it were detached via the mouse
     * @public
     */
    reattach:boolean = false

    /**
     * UUIDs of the endpoints. If this is not specifically provided in the constructor of the connection it will
     * be null.
     * @public
     */
    readonly uuids:[string, string]

    /**
     * Connection's cost.
     * @public
     */
    cost:number = 1

    /**
     * Whether or not the connection is directed.
     * @public
     */
    directed:boolean

    /**
     * Source and target endpoints.
     * @public
     */
    endpoints:[Endpoint<E>, Endpoint<E>] = [null, null]
    endpointStyles:[PaintStyle, PaintStyle]

    readonly endpointSpec:EndpointSpec
    readonly endpointsSpec:[EndpointSpec, EndpointSpec]
    endpointStyle:PaintStyle = {}
    endpointHoverStyle:PaintStyle = {}
    readonly endpointHoverStyles:[PaintStyle, PaintStyle]

    /**
     * @internal
     */
    suspendedEndpoint:Endpoint<E>
    /**
     * @internal
     */
    suspendedIndex:number
    /**
     * @internal
     */
    suspendedElement:E
    /**
     * @internal
     */
    suspendedElementId:string
    /**
     * @internal
     */
    suspendedElementType:string

    /**
     * @internal
     */
    _forceReattach:boolean
    /**
     * @internal
     */
    _forceDetach:boolean

    /**
     * List of current proxies for this connection. Used when collapsing groups and when dealing with scrolling lists.
     * @internal
     */
    proxies:Array<{ ep:Endpoint<E>, originalEp: Endpoint<E> }> = []

    /**
     * @internal
     */
    pending:boolean = false

    /**
     * Connections should never be constructed directly by users of the library.
     * @internal
     * @param instance
     * @param params
     */
    constructor(public instance:JsPlumbInstance, params:ConnectionOptions<E>) {

        super(instance, params)

        this.id = params.id
        // if a new connection is the result of moving some existing connection, params.previousConnection
        // will have that Connection in it. listeners for the jsPlumbConnection event can look for that
        // member and take action if they need to.
        this.previousConnection = params.previousConnection

        this.source = params.source
        this.target = params.target

        if (params.sourceEndpoint) {
            this.source = params.sourceEndpoint.element
            this.sourceId = params.sourceEndpoint.elementId
        } else {
            this.sourceId = instance.getId(this.source)
        }

        if (params.targetEndpoint) {
            this.target = params.targetEndpoint.element
            this.targetId = params.targetEndpoint.elementId
        } else {
            this.targetId = instance.getId(this.target)
        }

        this.scope = params.scope

        const sourceAnchor = params.anchors ? params.anchors[0] : params.anchor
        const targetAnchor = params.anchors ? params.anchors[1] : params.anchor

        instance.manage(this.source)
        instance.manage(this.target)

        this.visible = true

        this.params = {
            cssClass: params.cssClass,
            hoverClass:params.hoverClass,
            "pointer-events": params["pointer-events"],
            overlays: params.overlays
        }
        this.lastPaintedAt = null

        if (params.type) {
            params.endpoints = params.endpoints || this.instance._deriveEndpointAndAnchorSpec(params.type).endpoints
        }

        this.endpointSpec = params.endpoint
        this.endpointsSpec = params.endpoints || [null, null]
        this.endpointStyle = params.endpointStyle
        this.endpointHoverStyle = params.endpointHoverStyle
        this.endpointStyles = params.endpointStyles || [null, null]
        this.endpointHoverStyles = params.endpointHoverStyles || [null, null]
        this.paintStyle = params.paintStyle
        this.hoverPaintStyle = params.hoverPaintStyle
        this.uuids = params.uuids

        this.makeEndpoint(true, this.source, this.sourceId, sourceAnchor, params.sourceEndpoint)
        this.makeEndpoint(false, this.target, this.targetId, targetAnchor, params.targetEndpoint)

        // if scope not set, set it to be the scope for the source endpoint.
        if (!this.scope) {
            this.scope = this.endpoints[0].scope
        }

        if (params.deleteEndpointsOnEmpty != null) {
            this.endpoints[0].deleteOnEmpty = params.deleteEndpointsOnEmpty
            this.endpoints[1].deleteOnEmpty = params.deleteEndpointsOnEmpty
        }

        let _detachable = this.instance.defaults.connectionsDetachable
        if (params.detachable === false) {
            _detachable = false
        }
        if (this.endpoints[0].connectionsDetachable === false) {
            _detachable = false
        }
        if (this.endpoints[1].connectionsDetachable === false) {
            _detachable = false
        }

        this.endpointsSpec = params.endpoints || [null, null]
        this.endpointSpec = params.endpoint || null

        let _reattach = params.reattach || this.endpoints[0].reattachConnections || this.endpoints[1].reattachConnections || this.instance.defaults.reattachConnections

        const initialPaintStyle = extend({}, this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || this.instance.defaults.paintStyle)
        this.appendToDefaultType({
            detachable: _detachable,
            reattach: _reattach,
            paintStyle:initialPaintStyle,
            hoverPaintStyle:extend({}, this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || this.instance.defaults.hoverPaintStyle)
        })
        if (params.outlineWidth) {
            initialPaintStyle.outlineWidth = params.outlineWidth
        }
        if (params.outlineColor) {
            initialPaintStyle.outlineStroke = params.outlineColor
        }
        if (params.lineWidth) {
            initialPaintStyle.strokeWidth = params.lineWidth
        }
        if (params.color) {
            initialPaintStyle.stroke = params.color
        }

        if (!this.instance._suspendDrawing) {
            const initialTimestamp = this.instance._suspendedAt || uuid()
            this.instance._paintEndpoint(this.endpoints[0], { timestamp: initialTimestamp })
            this.instance._paintEndpoint(this.endpoints[1], { timestamp: initialTimestamp })
        }

        this.cost = params.cost || this.endpoints[0].connectionCost
        this.directed = params.directed
        // inherit directed flag if set on source endpoint
        if (params.directed == null) {
            this.directed = this.endpoints[0].connectionsDirected
        }

        // PARAMETERS
        // merge all the parameters objects into the connection.  parameters set
        // on the connection take precedence; then source endpoint params, then
        // finally target endpoint params.
        let _p = extend({}, this.endpoints[1].parameters)
        extend(_p, this.endpoints[0].parameters)
        extend(_p, this.parameters)
        this.parameters = _p
// END PARAMETERS

// PAINTING

        this.paintStyleInUse = this.getPaintStyle() || {}

        this._setConnector(this.endpoints[0].connector || this.endpoints[1].connector || params.connector || this.instance.defaults.connector, true)

        let data = params.data == null || !isObject(params.data) ? {} : params.data
        this.setData(data)

        // the very last thing we do is apply types, if there are any.
        let _types = [ DEFAULT, this.endpoints[0].edgeType, this.endpoints[1].edgeType,  params.type ].join(" ")
        if (/[^\s]/.test(_types)) {
            this.addType(_types, params.data)
        }
    }

    makeEndpoint (isSource:boolean, el:any, elId:string, anchor?:AnchorSpec, ep?:Endpoint):Endpoint {
        elId = elId || this.instance.getId(el)
        return prepareEndpoint<E>(this, ep, isSource ? 0 : 1, anchor, el, elId)
    }

    static type = "connection"
    getTypeDescriptor ():string {
        return Connection.type
    }

    isDetachable (ep?:Endpoint):boolean {
        return this.detachable === false ? false : ep != null ? ep.connectionsDetachable === true : this.detachable === true
    }

    setDetachable (detachable:boolean):void {
        this.detachable = detachable === true
    }

    isReattach ():boolean {
        return this.reattach === true || this.endpoints[0].reattachConnections === true || this.endpoints[1].reattachConnections === true
    }

    setReattach (reattach:boolean):void {
        this.reattach = reattach === true
    }

    applyType(t:ConnectionTypeDescriptor, typeMap:any):void {

        let _connector = null
        if (t.connector != null) {
            _connector = this.getCachedTypeItem(TYPE_ITEM_CONNECTOR, typeMap.connector)
            if (_connector == null) {
                _connector = this.prepareConnector(t.connector, typeMap.connector)
                this.cacheTypeItem(TYPE_ITEM_CONNECTOR, _connector, typeMap.connector)
            }
            this.setPreparedConnector(_connector)
        }

        // apply connector before superclass, as a new connector means overlays have to move.
        super.applyType(t, typeMap)

        // none of these things result in the creation of objects so can be ignored.
        if (t.detachable != null) {
            this.setDetachable(t.detachable)
        }
        if (t.reattach != null) {
            this.setReattach(t.reattach)
        }
        if (t.scope) {
            this.scope = t.scope
        }

        let _anchors = null
        // this also results in the creation of objects.
        if (t.anchor) {
            // note that even if the param was anchor, we store `anchors`.
            _anchors = this.getCachedTypeItem(TYPE_ITEM_ANCHORS, typeMap.anchor)
            if (_anchors == null) {
                _anchors = [ makeLightweightAnchorFromSpec(t.anchor), makeLightweightAnchorFromSpec(t.anchor) ]
                this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchor)
            }
        }
        else if (t.anchors) {
            _anchors = this.getCachedTypeItem(TYPE_ITEM_ANCHORS, typeMap.anchors)
            if (_anchors == null) {
                _anchors = [
                    makeLightweightAnchorFromSpec(t.anchors[0]),
                    makeLightweightAnchorFromSpec(t.anchors[1])
                ]
                this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchors)
            }
        }
        if (_anchors != null) {
            this.instance.router.setConnectionAnchors(this, _anchors)

            if (this.instance.router.isDynamicAnchor(this.endpoints[1])) {
                this.instance.repaint(this.endpoints[1].element)
            }
        }

        this.instance.applyConnectorType(this.connector, t)
    }

    /**
     * Adds the given class to the UI elements being used to represent this connection's connector, and optionally to
     * the UI elements representing the connection's endpoints.
     * @param c class to add
     * @param cascade If true, also add the class to the connection's endpoints.
     * @public
     */
    addClass(c:string, cascade?:boolean) {
        super.addClass(c)

        if (cascade) {
            this.endpoints[0].addClass(c)
            this.endpoints[1].addClass(c)
            if (this.suspendedEndpoint) {
                this.suspendedEndpoint.addClass(c)
            }
        }

        if (this.connector) {
            this.instance.addConnectorClass(this.connector, c)
        }
    }

    /**
     * Removes the given class from the UI elements being used to represent this connection's connector, and optionally from
     * the UI elements representing the connection's endpoints.
     * @param c class to remove
     * @param cascade If true, also remove the class from the connection's endpoints.
     * @public
     */
    removeClass(c:string, cascade?:boolean) {
        super.removeClass(c)

        if (cascade) {
            this.endpoints[0].removeClass(c)
            this.endpoints[1].removeClass(c)
            if (this.suspendedEndpoint) {
                this.suspendedEndpoint.removeClass(c)
            }
        }

        if (this.connector) {
            this.instance.removeConnectorClass(this.connector, c)
        }
    }

    /**
     * Sets the visible state of the connection.
     * @param v
     * @public
     */
    setVisible(v:boolean) {
        super.setVisible(v)
        if (this.connector) {
            this.instance.setConnectorVisible(this.connector, v)
        }
        this.instance._paintConnection(this)
    }

    /**
     * @internal
     */
    destroy() {
        super.destroy()

        this.endpoints = null
        this.endpointStyles = null
        this.source = null
        this.target = null

        // TODO stop hover?

        this.instance.destroyConnector(this)

        this.connector = null
        this.deleted = true

    }

    getUuids():[string, string] {
        return [ this.endpoints[0].getUuid(), this.endpoints[1].getUuid() ]
    }

    /**
     * @internal
     */
    prepareConnector(connectorSpec:ConnectorSpec, typeId?:string):AbstractConnector {
        let connectorArgs = {
                cssClass: this.params.cssClass,
                hoverClass:this.params.hoverClass,
                "pointer-events": this.params["pointer-events"]
            },
            connector

        if (isString(connectorSpec)) {
            connector = this.instance._makeConnector(this, connectorSpec as string, connectorArgs)
        }
        else {
            const co = connectorSpec as ConnectorWithOptions
            connector = this.instance._makeConnector(this, co.type, merge(co.options || {}, connectorArgs))
        }
        if (typeId != null) {
            connector.typeId = typeId
        }
        return connector
    }

    /**
     * @internal
     */
    setPreparedConnector(connector:AbstractConnector, doNotRepaint?:boolean, doNotChangeListenerComponent?:boolean, typeId?:string) {

        if (this.connector !== connector) {

            let previous, previousClasses = ""
            // the connector will not be cleaned up if it was set as part of a type, because `typeId` will be set on it
            // and we havent passed in `true` for "force" here.
            if (this.connector != null) {
                previous = this.connector
                previousClasses = this.instance.getConnectorClass(this.connector)
                this.instance.destroyConnector(this)
            }

            this.connector = connector
            if (typeId) {
                this.cacheTypeItem(TYPE_ITEM_CONNECTOR, connector, typeId)
            }

            // put classes from prior connector onto the canvas
            this.addClass(previousClasses)

            if (previous != null) {
                let o:Record<string, Overlay> = this.getOverlays()
                for (let i in o) {
                    this.instance.reattachOverlay(o[i], this)
                }
            }

            if (!doNotRepaint) {
                this.instance._paintConnection(this)
            }
        }
    }

    /**
     * @internal
     * @param connectorSpec
     * @param doNotRepaint
     * @param doNotChangeListenerComponent
     * @param typeId
     */
    _setConnector(connectorSpec:ConnectorSpec, doNotRepaint?:boolean, doNotChangeListenerComponent?:boolean, typeId?:string) {
        let connector = this.prepareConnector(connectorSpec, typeId)
        this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId)
    }

    /**
     * Replace the Endpoint at the given index with a new Endpoint.  This is used by the Toolkit edition, if changes to an edge type
     * cause a change in Endpoint.
     * @param idx 0 for source, 1 for target
     * @param endpointDef Spec for the new Endpoint.
     * @public
     */
    replaceEndpoint(idx:number, endpointDef:EndpointSpec) {

        let current = this.endpoints[idx],
            elId = current.elementId,
            ebe = this.instance.getEndpoints(current.element),
            _idx = ebe.indexOf(current),
            _new = prepareEndpoint<E>(this, null, idx, null, current.element, elId, endpointDef)

        this.endpoints[idx] = _new

        ebe.splice(_idx, 1, _new)

        current.detachFromConnection(this)
        this.instance.deleteEndpoint(current)

        this.instance.fire(Constants.EVENT_ENDPOINT_REPLACED, {previous:current, current:_new})

    }
}

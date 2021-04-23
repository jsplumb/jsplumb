
import { JsPlumbInstance } from "../core"
import {ConnectionTypeDescriptor, Dictionary, jsPlumbElement, TypeDescriptor} from '../common'
import {AbstractConnector, ConnectorWithOptions} from "./abstract-connector"
import {Endpoint} from "../endpoint/endpoint"
import {PaintStyle} from "../styles"
import {OverlayCapableComponent} from "../component/overlay-capable-component"
import {extend, IS, isString, merge, uuid, addToDictionary, isEmpty} from "../util"
import {Overlay, OverlaySpec} from "../overlay/overlay"
import {Connectors} from "./connectors"
import {AnchorSpec, makeAnchorFromSpec} from "../factory/anchor-factory"
import {ConnectorSpec} from "./abstract-connector"
import {EndpointSpec} from "../endpoint/endpoint"
import * as Constants from "../constants"

const TYPE_ITEM_ANCHORS = "anchors"
const TYPE_ITEM_CONNECTOR = "connector"

function prepareEndpoint<E>(conn:Connection, existing:Endpoint, index:number, anchor?:AnchorSpec, element?:E, elementId?:string, endpoint?:EndpointSpec):Endpoint {

    let e

    if (existing) {
        conn.endpoints[index] = existing
        existing.addConnection(conn)
    } else {

        let ep = endpoint || conn.endpointSpec || conn.endpointsSpec[index] || conn.instance.Defaults.endpoints[index] || conn.instance.Defaults.endpoint

        let es = conn.endpointStyles[index] || conn.endpointStyle || conn.instance.Defaults.endpointStyles[index] || conn.instance.Defaults.endpointStyle

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

        let ehs = conn.endpointHoverStyles[index] || conn.endpointHoverStyle || conn.endpointHoverStyle || conn.instance.Defaults.endpointHoverStyles[index] || conn.instance.Defaults.endpointHoverStyle
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

        anchor = anchor != null ? anchor : conn.instance.Defaults.anchors != null ? conn.instance.Defaults.anchors[index] : conn.instance.Defaults.anchor

        e = conn.instance._internal_newEndpoint({
            paintStyle: es,
            hoverPaintStyle: ehs,
            endpoint: ep,
            connections: [ conn ],
            uuid: u,
            element: element,
            scope: conn.scope,
            anchor:anchor,
            reattachConnections: conn.reattach || conn.instance.Defaults.reattachConnections,
            connectionsDetachable: conn.detachable || conn.instance.Defaults.connectionsDetachable
        })

        if (existing == null) {
            e.deleteOnEmpty = true
        }
        conn.endpoints[index] = e
    }

    return e
}

export interface ConnectionParams<E = any> {

    id?:string
    source?:E
    target?:E
    sourceEndpoint?:Endpoint
    targetEndpoint?:Endpoint
    scope?:string

    overlays?:Array<OverlaySpec>

    connector?:ConnectorSpec

    type?:string
    endpoints?:[EndpointSpec, EndpointSpec]
    endpoint?:EndpointSpec

    endpointStyles?:[PaintStyle, PaintStyle]
    endpointStyle?:PaintStyle
    endpointHoverStyle?:PaintStyle
    endpointHoverStyles?:[PaintStyle, PaintStyle]
    outlineStroke?:number
    outlineWidth?:number
    uuids?:[string, string]

    deleteEndpointsOnEmpty?:boolean
    detachable?:boolean
    reattach?:boolean

    directed?:boolean
    cost?:number

    data?:any

    cssClass?:string
    hoverClass?:string

    paintStyle?:PaintStyle
    hoverPaintStyle?:PaintStyle

    previousConnection?:Connection

    anchors?:[AnchorSpec, AnchorSpec]
    anchor?:AnchorSpec
}

export class Connection<E = any> extends OverlayCapableComponent {

    id:string
    connector:AbstractConnector
    defaultLabelLocation:number = 0.5
    scope:string

    typeId = "_jsplumb_connection"
    getIdPrefix () { return  "_jsPlumb_c"; }
    getDefaultOverlayKey():string { return "connectionOverlays"; }

    getXY() {
        return { x:this.connector.x, y:this.connector.y }
    }

    previousConnection:Connection

    sourceId:string
    targetId:string
    source:E
    target:E

    detachable:boolean = true
    reattach:boolean = false

    uuids:[string, string]

    cost:number
    directed:boolean

    endpoints:[Endpoint<E>, Endpoint<E>] = [null, null]
    endpointStyles:[PaintStyle, PaintStyle]

    readonly endpointSpec:EndpointSpec
    readonly endpointsSpec:[EndpointSpec, EndpointSpec]
    endpointStyle:PaintStyle = {}
    endpointHoverStyle:PaintStyle = {}
    endpointHoverStyles:[PaintStyle, PaintStyle]

    suspendedEndpoint:Endpoint<E>
    suspendedIndex:number
    suspendedElement:E
    suspendedElementId:string
    suspendedElementType:string

    _forceReattach:boolean
    _forceDetach:boolean

    proxies:Array<{ ep:Endpoint<E>, originalEp: Endpoint<E> }> = []
    
    pending:boolean = false

    constructor(public instance:JsPlumbInstance, params:ConnectionParams<E>) {

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

        let eS = this.makeEndpoint(true, this.source, this.sourceId, sourceAnchor, params.sourceEndpoint),
            eT = this.makeEndpoint(false, this.target, this.targetId, targetAnchor, params.targetEndpoint)

        if (eS) {
            addToDictionary(instance.endpointsByElement, this.sourceId, eS)
        }
        if (eT) {
            addToDictionary(instance.endpointsByElement, this.targetId, eT)
        }

        // if scope not set, set it to be the scope for the source endpoint.
        if (!this.scope) {
            this.scope = this.endpoints[0].scope
        }

        if (params.deleteEndpointsOnEmpty != null) {
            this.endpoints[0].deleteOnEmpty = params.deleteEndpointsOnEmpty
            this.endpoints[1].deleteOnEmpty = params.deleteEndpointsOnEmpty
        }

        let _detachable = this.instance.Defaults.connectionsDetachable
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

        let _reattach = params.reattach || this.endpoints[0].reattachConnections || this.endpoints[1].reattachConnections || this.instance.Defaults.reattachConnections

        this.appendToDefaultType({
            detachable: _detachable,
            reattach: _reattach,
            paintStyle:this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || this.instance.Defaults.paintStyle,
            hoverPaintStyle:this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || this.instance.Defaults.hoverPaintStyle
        })

        if (!this.instance._suspendDrawing) {
            const initialTimestamp = this.instance._suspendedAt || uuid()
            this.instance.paintEndpoint(this.endpoints[0], { timestamp: initialTimestamp })
            this.instance.paintEndpoint(this.endpoints[1], { timestamp: initialTimestamp })
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
        let _p = extend({}, this.endpoints[1].getParameters())
        extend(_p, this.endpoints[0].getParameters())
        extend(_p, this.getParameters())
        this.setParameters(_p)
// END PARAMETERS

// PAINTING

        this.paintStyleInUse = this.getPaintStyle() || {}

        this.setConnector(this.endpoints[0].connector || this.endpoints[1].connector || params.connector || this.instance.Defaults.connector, true)

        let data = params.data == null || !IS.anObject(params.data) ? {} : params.data
        this.setData(data)

        // the very last thing we do is apply types, if there are any.
        let _types = [ "default", this.endpoints[0].connectionType, this.endpoints[1].connectionType,  params.type ].join(" ")
        if (/[^\s]/.test(_types)) {
            this.addType(_types, params.data)
        }
    }

    makeEndpoint (isSource:boolean, el:any, elId:string, anchor?:AnchorSpec, ep?:Endpoint):Endpoint {
        elId = elId || this.instance.getId(el)
        return prepareEndpoint<E>(this, ep, isSource ? 0 : 1, anchor, el, elId)
    }

    getTypeDescriptor ():string {
        return "connection"
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
                _anchors = [ makeAnchorFromSpec(this.instance, t.anchor, this.sourceId), makeAnchorFromSpec(this.instance, t.anchor, this.targetId) ]
                this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchor)
            }
        }
        else if (t.anchors) {
            _anchors = this.getCachedTypeItem(TYPE_ITEM_ANCHORS, typeMap.anchors)
            if (_anchors == null) {
                _anchors = [
                    makeAnchorFromSpec(this.instance, t.anchors[0], this.sourceId),
                    makeAnchorFromSpec(this.instance, t.anchors[1], this.targetId)
                ]
                this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchors)
            }
        }
        if (_anchors != null) {
            this.endpoints[0].anchor = _anchors[0]
            this.endpoints[1].anchor = _anchors[1]
            if (this.endpoints[1].anchor.isDynamic) {
                this.instance.repaint(this.endpoints[1].element)
            }
        }

        this.instance.applyConnectorType(this.connector, t)
    }

    addClass(c:string, informEndpoints?:boolean) {
        super.addClass(c)

        if (informEndpoints) {
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

    removeClass(c:string, informEndpoints?:boolean) {
        super.removeClass(c)

        if (informEndpoints) {
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

    setVisible(v:boolean) {
        super.setVisible(v)
        if (this.connector) {
            this.instance.setConnectorVisible(this.connector, v)
        }
        this.instance.paintConnection(this)
    }

    destroy(force?:boolean) {
        this.endpoints = null
        this.source = null
        this.target = null

        // TODO stop hover?

        this.instance.destroyConnection(this)

        this.connector = null
        this.deleted = true
        super.destroy(force)
    }

    getUuids():[string, string] {
        return [ this.endpoints[0].getUuid(), this.endpoints[1].getUuid() ]
    }

    getCost():number {
        return this.cost  == null ?  1 : this.cost
    }

    setCost(c:number) {
        this.cost = c
    }

    isDirected():boolean {
        return this.directed
    }

    getConnector():AbstractConnector {
        return this.connector
    }

    makeConnector(name:string, args:any):AbstractConnector {
        return Connectors.get(this.instance, this, name, args)
    }

    prepareConnector(connectorSpec:ConnectorSpec, typeId?:string):AbstractConnector {
        let connectorArgs = {
                cssClass: this.params.cssClass,
                hoverClass:this.params.hoverClass,
                "pointer-events": this.params["pointer-events"]
            },
            connector

        if (isString(connectorSpec)) {
            connector = this.makeConnector(connectorSpec as string, connectorArgs)
        }
        else {
            const co = connectorSpec as ConnectorWithOptions
            connector = this.makeConnector(co.type, merge(co.options, connectorArgs))
        }
        if (typeId != null) {
            connector.typeId = typeId
        }
        return connector
    }

    setPreparedConnector(connector:AbstractConnector, doNotRepaint?:boolean, doNotChangeListenerComponent?:boolean, typeId?:string) {

        if (this.connector !== connector) {

            let previous, previousClasses = ""
            // the connector will not be cleaned up if it was set as part of a type, because `typeId` will be set on it
            // and we havent passed in `true` for "force" here.
            if (this.connector != null) {
                previous = this.connector
                previousClasses = this.instance.getConnectorClass(this.connector)
                this.instance.destroyConnection(this)
            }

            this.connector = connector
            if (typeId) {
                this.cacheTypeItem(TYPE_ITEM_CONNECTOR, connector, typeId)
            }

            // put classes from prior connector onto the canvas
            this.addClass(previousClasses)

            if (previous != null) {
                let o:Dictionary<Overlay> = this.getOverlays()
                for (let i in o) {
                    this.instance.reattachOverlay(o[i], this)
                }
            }

            if (!doNotRepaint) {
                this.instance.paintConnection(this)
            }
        }
    }

    setConnector(connectorSpec:ConnectorSpec, doNotRepaint?:boolean, doNotChangeListenerComponent?:boolean, typeId?:string) {
        let connector = this.prepareConnector(connectorSpec, typeId)
        this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId)
    }

    /**
     * Replace the Endpoint at the given index with a new Endpoint.  This is used by the Toolkit edition, if changes to an edge type
     * cause a change in Endpoint.
     * @param idx 0 for source, 1 for target
     * @param endpointDef Spec for the new Endpoint.
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

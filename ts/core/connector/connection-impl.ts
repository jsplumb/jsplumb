
import { JsPlumbInstance } from "../core"
import {Dictionary, jsPlumbElement, TypeDescriptor} from '../common'
import {AbstractConnector} from "./abstract-connector"
import {Endpoint} from "../endpoint/endpoint-impl"
import {PaintStyle} from "../styles"
import {Component} from "../component/component"
import {OverlayCapableComponent} from "../component/overlay-capable-component"
import {extend, isArray, isEmpty, IS, isString, merge, uuid, addToDictionary} from "../util"
import {Overlay, OverlaySpec} from "../overlay/overlay"
import {Connectors} from "./connectors"
import {AnchorSpec, makeAnchorFromSpec} from "../factory/anchor-factory"
import {Anchor} from "../anchor/anchor"
import {ConnectorSpec} from "./abstract-connector"
import {EndpointSpec} from "../endpoint/endpoint"
import * as Constants from "../constants"

export interface ConnectionParams<E> {

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
    source:any
    target:any

    detachable:boolean = true
    reattach:boolean = false

    uuids:[string, string]

    cost:number
    directed:boolean

    endpoints:[Endpoint, Endpoint] = [null, null]
    endpointStyles:[PaintStyle, PaintStyle] = [null, null]

    _endpointSpec:EndpointSpec
    _endpointsSpec:[EndpointSpec, EndpointSpec]
    _endpointStyle:PaintStyle
    _endpointHoverStyle:PaintStyle
    _endpointStyles:[PaintStyle, PaintStyle]
    _endpointHoverStyles:[PaintStyle, PaintStyle]

    suspendedEndpoint:Endpoint
    suspendedIndex:number
    suspendedElement:any
    suspendedElementId:string
    suspendedElementType:string

    _forceReattach:boolean
    _forceDetach:boolean

    proxies:Array<{ ep:Endpoint, originalEp: Endpoint }> = []
    
    pending:boolean = false

    anchors:[AnchorSpec, AnchorSpec] = [ null, null ]
    anchor:AnchorSpec = null

    floatingIndex:number
    floatingEndpoint:Endpoint
    floatingId:string
    floatingElement:any

    static updateConnectedClass<E>(instance:JsPlumbInstance, conn:Connection, element:jsPlumbElement<E>, isRemoval:boolean) {
        if (element != null) {
            element._jsPlumbConnections = element._jsPlumbConnections || {}
            if (isRemoval) {
                delete element._jsPlumbConnections[conn.id]
            } else {
                element._jsPlumbConnections[conn.id] = true
            }
            if (isEmpty(element._jsPlumbConnections)) {
                instance.removeClass(element, conn.instance.connectedClass)
            }
            else {
                instance.addClass(element, conn.instance.connectedClass)
            }
        }
    }

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

        this.anchors = params.anchors
        this.anchor = params.anchor

        instance.manage(this.source)
        instance.manage(this.target)

        this.visible = true

        this.params = {
            cssClass: params.cssClass,
            "pointer-events": params["pointer-events"],
            overlays: params.overlays
        }
        this.lastPaintedAt = null

        if (params.type) {
            params.endpoints = params.endpoints || this.instance.deriveEndpointAndAnchorSpec(params.type).endpoints
        }

        this._endpointSpec = params.endpoint
        this._endpointsSpec = params.endpoints
        this._endpointStyle = params.endpointStyle
        this._endpointHoverStyle = params.endpointHoverStyle
        this._endpointStyles = params.endpointStyles
        this._endpointHoverStyles = params.endpointHoverStyles
        this.paintStyle = params.paintStyle
        this.hoverPaintStyle = params.hoverPaintStyle
        this.uuids = params.uuids

        let eS = this.makeEndpoint(true, this.source, this.sourceId, params.sourceEndpoint),
            eT = this.makeEndpoint(false, this.target, this.targetId, params.targetEndpoint)

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

        this._endpointsSpec = params.endpoints || [null, null]
        this._endpointSpec = params.endpoint || null

        let _reattach = params.reattach || this.endpoints[0].reattachConnections || this.endpoints[1].reattachConnections || this.instance.Defaults.reattachConnections

        this.appendToDefaultType({
            detachable: _detachable,
            reattach: _reattach,
            paintStyle:this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || this.instance.Defaults.paintStyle,
            hoverPaintStyle:this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || this.instance.Defaults.hoverPaintStyle
        })

        if (!this.instance._suspendDrawing) {
            const initialTimestamp = this.instance._suspendedAt || uuid()
            const sourceAnchorLoc = this.instance.computeAnchorLoc(this.endpoints[0], initialTimestamp)
            this.endpoints[0].paint({ anchorLoc: sourceAnchorLoc, timestamp: initialTimestamp })
            const targetAnchorLoc = this.instance.computeAnchorLoc(this.endpoints[1], initialTimestamp)
            this.endpoints[1].paint({ anchorLoc: targetAnchorLoc, timestamp: initialTimestamp })
        }

        this.cost = params.cost || this.endpoints[0].connectionCost
        this.directed = params.directed
        // inherit directed flag if set no source endpoint
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
            this.addType(_types, params.data, true)
        }

        this.updateConnectedClass(false)
    }

    makeEndpoint (isSource:boolean, el:any, elId:string, ep?:Endpoint):Endpoint {
        elId = elId || this.instance.getId(el)
        return this.prepareEndpoint(ep, isSource ? 0 : 1, el, elId)
    }

    getTypeDescriptor ():string {
        return "connection"
    }

    getAttachedElements ():Array<Component> {
        return this.endpoints
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

    applyType(t:TypeDescriptor, doNotRepaint:boolean, typeMap:any):void {

        let _connector = null
        if (t.connector != null) {
            _connector = this.getCachedTypeItem("connector", typeMap.connector)
            if (_connector == null) {
                _connector = this.prepareConnector(t.connector, typeMap.connector)
                this.cacheTypeItem("connector", _connector, typeMap.connector)
            }
            this.setPreparedConnector(_connector)
        }

        // apply connector before superclass, as a new connector means overlays have to move.
        super.applyType(t, doNotRepaint, typeMap)

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
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchor)
            if (_anchors == null) {
                _anchors = [ makeAnchorFromSpec(this.instance, t.anchor, this.sourceId), makeAnchorFromSpec(this.instance, t.anchor, this.targetId) ]
                this.cacheTypeItem("anchors", _anchors, typeMap.anchor)
            }
        }
        else if (t.anchors) {
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchors)
            if (_anchors == null) {
                _anchors = [
                    makeAnchorFromSpec(this.instance, t.anchors[0], this.sourceId),
                    makeAnchorFromSpec(this.instance, t.anchors[1], this.targetId)
                ]
                this.cacheTypeItem("anchors", _anchors, typeMap.anchors)
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
        this.paint()
    }

    destroy(force?:boolean) {
        this.updateConnectedClass(true)
        this.endpoints = null
        this.source = null
        this.target = null

        // TODO stop hover?

        this.instance.destroyConnection(this)

        this.connector = null
        super.destroy(force)
    }

    updateConnectedClass(isRemoval:boolean) {
        Connection.updateConnectedClass(this.instance, this, this.source, isRemoval)
        Connection.updateConnectedClass(this.instance, this, this.target, isRemoval)
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
                _jsPlumb: this.instance,
                cssClass: this.params.cssClass,
                container: this.params.container,
                "pointer-events": this.params["pointer-events"]
            },
            connector

        if (isString(connectorSpec)) {
            connector = this.makeConnector(connectorSpec as string, connectorArgs)
        } // lets you use a string as shorthand.
        else if (isArray(connectorSpec)) {
            if (connectorSpec.length === 1) {
                connector = this.makeConnector(connectorSpec[0], connectorArgs)
            }
            else {
                connector = this.makeConnector((connectorSpec as Array<any>)[0], merge((connectorSpec as Array<any>)[1], connectorArgs))
            }
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
                //previousClasses = previous.getClass()
                previousClasses = this.instance.getConnectorClass(this.connector)
                this.instance.destroyConnection(this)
            }

            this.connector = connector
            if (typeId) {
                this.cacheTypeItem("connector", connector, typeId)
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
                this.paint()
            }
        }
    }

    setConnector(connectorSpec:ConnectorSpec, doNotRepaint?:boolean, doNotChangeListenerComponent?:boolean, typeId?:string) {
        let connector = this.prepareConnector(connectorSpec, typeId)
        this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId)
    }

    paint(params?:any) {

        if (!this.instance._suspendDrawing && this.visible !== false) {

            params = params || {}
            let timestamp = params.timestamp
            if (timestamp != null && timestamp === this.lastPaintedAt) {
                return
            }

            if (timestamp == null || timestamp !== this.lastPaintedAt) {

                this.instance.router.computePath(this, timestamp);

                let overlayExtents = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }

                // compute overlays. we do this first so we can get their placements, and adjust the
                // container if needs be (if an overlay would be clipped)
                for (let i in this.overlays) {
                    if (this.overlays.hasOwnProperty(i)) {
                        let o:Overlay = this.overlays[i]
                        if (o.isVisible()) {

                            this.overlayPlacements[i] = this.instance.drawOverlay(o, this.connector, this.paintStyleInUse, this.getAbsoluteOverlayPosition(o))

                            overlayExtents.minX = Math.min(overlayExtents.minX, this.overlayPlacements[i].minX)
                            overlayExtents.maxX = Math.max(overlayExtents.maxX, this.overlayPlacements[i].maxX)
                            overlayExtents.minY = Math.min(overlayExtents.minY, this.overlayPlacements[i].minY)
                            overlayExtents.maxY = Math.max(overlayExtents.maxY, this.overlayPlacements[i].maxY)
                        }
                    }
                }

                let lineWidth = parseFloat("" + this.paintStyleInUse.strokeWidth || "1") / 2,
                    outlineWidth = parseFloat("" + this.paintStyleInUse.strokeWidth || "0"),
                    extents = {
                        xmin: Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                        ymin: Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                        xmax: Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                        ymax: Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
                    }

                this.instance.paintConnector(this.connector, this.paintStyleInUse, extents)

                // and then the overlays
                for (let j in this.overlays) {
                    if (this.overlays.hasOwnProperty(j)) {
                        let p = this.overlays[j]
                        if (p.isVisible()) {
                            this.instance.paintOverlay(p, this.overlayPlacements[j], extents)
                        }
                    }
                }
            }
            this.lastPaintedAt = timestamp
        }
    }

    prepareEndpoint(existing:Endpoint, index:number, element?:any, elementId?:string, params?:ConnectionParams<E>):Endpoint {

        let e
        params = params || {}

        if (existing) {
            this.endpoints[index] = existing
            existing.addConnection(this)
        } else {

            params.scope = params.scope == null ? this.scope : params.scope
            params.reattach = params.reattach == null ? this.reattach : params.reattach
            params.endpoints = params.endpoints == null ? this._endpointsSpec || [ null, null ] : params.endpoints
            params.endpointStyles = params.endpointStyles == null ? this._endpointStyles || [ null, null ] : params.endpointStyles
            params.endpointHoverStyles = params.endpointHoverStyles == null ? this._endpointHoverStyles || [ null, null ] : params.endpointHoverStyles
            params.paintStyle = params.paintStyle == null ? this.paintStyleInUse : params.paintStyle
            params.hoverPaintStyle = params.hoverPaintStyle == null ? this.hoverPaintStyle: params.hoverPaintStyle

            let ep = params.endpoints[index] || params.endpoint || this._endpointSpec || this.instance.Defaults.endpoints[index] || this.instance.Defaults.endpoint

            let es = params.endpointStyles[index] || params.endpointStyle || this._endpointStyle || this.instance.Defaults.endpointStyles[index] || this.instance.Defaults.endpointStyle

            // Endpoints derive their fill from the connector's stroke, if no fill was specified.
            if (es.fill == null && params.paintStyle != null) {
                es.fill = params.paintStyle.stroke
            }

            if (es.outlineStroke == null && params.paintStyle != null) {
                es.outlineStroke = params.paintStyle.outlineStroke
            }
            if (es.outlineWidth == null && params.paintStyle != null) {
                es.outlineWidth = params.paintStyle.outlineWidth
            }

            let ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || this._endpointHoverStyle || this.instance.Defaults.endpointHoverStyles[index] || this.instance.Defaults.endpointHoverStyle
            // endpoint hover fill style is derived from connector's hover stroke style
            if (params.hoverPaintStyle != null) {
                if (ehs == null) {
                    ehs = {}
                }
                if (ehs.fill == null) {
                    ehs.fill = params.hoverPaintStyle.stroke
                }
            }
            let a = this.anchors ? this.anchors[index] :
                    this.anchor ? this.anchor :

                        this._makeAnchor(this.instance.Defaults.anchors[index], elementId) || this._makeAnchor(this.instance.Defaults.anchor, elementId),

                u = this.uuids ? this.uuids[index] : null

            e = this.instance.newEndpoint({
                paintStyle: es, hoverPaintStyle: ehs, endpoint: ep, connections: [ this ],
                uuid: u, anchor: a, source: element, scope: params.scope,
                reattach: params.reattach || this.instance.Defaults.reattachConnections,
                detachable: params.detachable || this.instance.Defaults.connectionsDetachable
            })
            if (existing == null) {
                e.deleteOnEmpty = true
            }
            this.endpoints[index] = e
        }

        return e
    }

    private _makeAnchor(spec:AnchorSpec, elementId?:string):Anchor {
        return spec != null ? makeAnchorFromSpec(this.instance, spec, elementId) : null
    }

    replaceEndpoint(idx:number, endpointDef:EndpointSpec) {

        let current = this.endpoints[idx],
            elId = current.elementId,
            ebe = this.instance.getEndpoints(current.element),
            _idx = ebe.indexOf(current),
            _new = this.prepareEndpoint(null, idx, current.element, elId, {endpoint:endpointDef})

        this.endpoints[idx] = _new

        ebe.splice(_idx, 1, _new)

        current.detachFromConnection(this)
        this.instance.deleteEndpoint(current)

        this.instance.fire(Constants.EVENT_ENDPOINT_REPLACED, {previous:current, current:_new})

        this.updateConnectedClass(false)

    }
}

import {jsPlumbDefaults, jsPlumbHelperFunctions} from "./defaults"
import {Component, ComponentParameters} from "./component/component"
import {PaintStyle} from "./styles"
import {Connection} from "./connector/connection-impl"
import {Endpoint} from "./endpoint/endpoint-impl"
import {FullOverlaySpec, Overlay, OverlayId, OverlaySpec} from "./overlay/overlay"
import {AnchorManager, AnchorPlacement} from "./anchor-manager"
import {
    _mergeOverrides,
    addToList,
    findWithFunction,
    functionChain,
    IS,
    isString,
    log,
    removeWithFunction, rotateAnchorOrientation, rotatePoint,
    uuid
} from "./util"
import { EventGenerator } from "./event-generator"
import * as Constants from "./constants"
import {Renderer} from "./renderer"
import {AnchorSpec, makeAnchorFromSpec} from "./factory/anchor-factory"
import { Anchor } from "./anchor/anchor"
import {EndpointOptions, EndpointSpec} from "./endpoint/endpoint"
import {ConnectorSpec} from "./connector/abstract-connector"
import {GroupManager} from "./group/group-manager"
import {UIGroup} from "./group/group"
import {jsPlumbGeometry, jsPlumbGeometryHelpers} from "./geom"
import {jsPlumbDOMElement} from "./dom"
import {DefaultRouter} from "./router/default-router"
import {Router} from "./router/router"
import {EndpointSelection} from "./selection/endpoint-selection"
import {ConnectionSelection} from "./selection/connection-selection"

export type UUID = string
export type ElementId = string
export type ElementRef = ElementId | any

export interface ConnectParams {
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
    endpoints?:[EndpointSpec, EndpointSpec]
    endpointStyles?:[PaintStyle, PaintStyle]
    endpointHoverStyles?:[PaintStyle, PaintStyle]
    endpointStyle?:PaintStyle
    endpointHoverStyle?:PaintStyle
    ports?:[string, string]
}

interface InternalConnectParams extends ConnectParams {
    sourceEndpoint?:Endpoint
    targetEndpoint?:Endpoint
    scope?:string
    type?:string
    newConnection?:(p:any) => Connection
}

export interface ConnectionEstablishedParams {
    connection:Connection
    source:jsPlumbDOMElement
    sourceEndpoint:Endpoint
    sourceId:string
    target:jsPlumbDOMElement
    targetEndpoint:Endpoint
    targetId:string
}

export interface ConnectionDetachedParams extends ConnectionEstablishedParams {

}

export interface TypeDescriptor {
    cssClass?:string
    paintStyle?:PaintStyle
    hoverPaintStyle?:PaintStyle
    parameters?:any
    overlays?:Array<OverlaySpec>
    overlayMap?:Dictionary<FullOverlaySpec>
    endpoints?:[ EndpointSpec, EndpointSpec ]
    endpoint?:EndpointSpec
    anchors?:[AnchorSpec, AnchorSpec]
    anchor?:AnchorSpec
    detachable?:boolean
    reattach?:boolean
    scope?:string
    connector?:ConnectorSpec
    mergeStrategy?:string
}

export interface BehaviouralTypeDescriptor extends TypeDescriptor {
    filter?:string | Function
    filterExclude?:boolean
    extract?:Dictionary<string>
    uniqueEndpoint?:boolean
    onMaxConnections?:Function
    connectionType?:string
    portId?:string
}

export interface SourceOrTargetDefinition {
    enabled?:boolean
    def:BehaviouralTypeDescriptor
    endpoint?:Endpoint
    maxConnections?:number
    uniqueEndpoint?:boolean
}

export interface SourceDefinition extends SourceOrTargetDefinition { }
export interface TargetDefinition extends SourceOrTargetDefinition { }

export interface Offset {left:number, top:number}
export type Size = [ number, number ]
export type Rotation = number
export interface OffsetAndSize { o:Offset, s:Size }
export type PointArray = [ number, number ]
export interface PointXY { x:number, y:number, theta?:number }
export type BoundingBox = { x:number, y:number, w:number, h:number, center?:PointXY }
export type RectangleXY = BoundingBox
export type LineXY = [ PointXY, PointXY ]

export interface UpdateOffsetOptions {
    timestamp?:string
    recalc?:boolean
    offset?:Offset
    elId?:string
}

export type UpdateOffsetResult = {o:ExtendedOffset, s:Size, r:Rotation}

export interface ExtendedOffset extends Offset {
    width?:number
    height?:number
    centerx?:number
    centery?:number
    bottom?:number
    right?:number
}

export interface Dictionary<T> {
    [Key: string]: T
}

export type ElementSpec = string | any | Array<string | any>

export type SortFunction<T> = (a:T,b:T) => number

export type Constructable<T> = { new(...args: any[]): T }

export type Timestamp = string

function _scopeMatch(e1:Endpoint, e2:Endpoint):boolean {
    let s1 = e1.scope.split(/\s/), s2 = e2.scope.split(/\s/)
    for (let i = 0; i < s1.length; i++) {
        for (let j = 0; j < s2.length; j++) {
            if (s2[j] === s1[i]) {
                return true
            }
        }
    }

    return false
}

export interface AbstractSelectOptions {
    scope?:string
    source?:string | any | Array<string | any>
    target?:string | any | Array<string | any>
}
export interface SelectOptions extends AbstractSelectOptions {
    connections?:Array<Connection>
}

export interface SelectEndpointOptions extends AbstractSelectOptions {
    element?:string | any | Array<string | any>
}

/**
 * Optional parameters to the `DeleteConnection` method.
 */
export type DeleteConnectionOptions = {
    /**
     * if true, force deletion even if the connection tries to cancel the deletion.
     */
    force?:boolean
    /**
     * If false, an event won't be fired. Otherwise a `connectionDetached` event will be fired.
     */
    fireEvent?:boolean
    /**
     * Optional original event that resulted in the connection being deleted.
     */
    originalEvent?:Event

    /**
     * internally when a connection is deleted, it may be because the endpoint it was on is being deleted.
     * in that case we want to ignore that endpoint.
     */
    endpointToIgnore?:Endpoint
}

function prepareList(instance:jsPlumbInstance, input:any, doNotGetIds?:boolean):any {
    let r = []
    if (input) {
        if (typeof input === 'string') {
            if (input === "*") {
                return input
            }
            r.push(input)
        }
        else {
            if (doNotGetIds) {
                r = input
            }
            else {
                if (input.length != null) {
                    for (let i = 0, j = input.length; i < j; i++) {
                        r.push(instance._info(input[i]).id)
                    }
                }
                else {
                    r.push(instance._info(input).id)
                }
            }
        }
    }
    return r
}

function filterList (list:Array<any> | string, value:any, missingIsFalse?:boolean):boolean {
    if (list === "*") {
        return true
    }
    return (<any>list).length > 0 ? (<any>list).indexOf(value) !== -1 : !missingIsFalse
}

export function extend<T>(o1:T, o2:T, keys?:string[]):T {
    let i
    let _o1 = o1 as any,
        _o2 = o2 as any

    if (keys) {
        for (i = 0; i < keys.length; i++) {
            _o1[keys[i]] = _o2[keys[i]]
        }
    }
    else {
        for (i in _o2) {
            _o1[i] = _o2[i]
        }
    }

    return o1
}

export type ManagedElement = {
    el:jsPlumbDOMElement,
    info?:{o:Offset, s:Size},
    endpoints?:Array<Endpoint>,
    connections?:Array<Connection>,
    rotation?:number
}

export abstract class jsPlumbInstance extends EventGenerator {

    Defaults:jsPlumbDefaults
    private _initialDefaults:jsPlumbDefaults = {}

    isConnectionBeingDragged:boolean = false
    currentlyDragging:boolean = false
    hoverSuspended:boolean = false
    _suspendDrawing:boolean = false
    _suspendedAt:string = null

    connectorClass = "jtk-connector"
    connectorOutlineClass = "jtk-connector-outline"
    connectedClass = "jtk-connected"
    hoverClass = "jtk-hover"
    endpointClass = "jtk-endpoint"
    endpointConnectedClass = "jtk-endpoint-connected"
    endpointFullClass = "jtk-endpoint-full"
    endpointDropAllowedClass = "jtk-endpoint-drop-allowed"
    endpointDropForbiddenClass = "jtk-endpoint-drop-forbidden"
    overlayClass = "jtk-overlay"
    draggingClass = "jtk-dragging"
    elementDraggingClass = "jtk-element-dragging"
    sourceElementDraggingClass = "jtk-source-element-dragging"
    endpointAnchorClassPrefix = "jtk-endpoint-anchor"
    targetElementDraggingClass = "jtk-target-element-dragging"
    hoverSourceClass = "jtk-source-hover"
    hoverTargetClass = "jtk-target-hover"
    dragSelectClass = "jtk-drag-select"

    connections:Array<Connection> = []
    endpointsByElement:Dictionary<Array<Endpoint>> = {}
    endpointsByUUID:Dictionary<Endpoint> = {}

    public allowNestedGroups:boolean

    private _curIdStamp :number = 1
    private _offsetTimestamps:Dictionary<string> = {}
    private _offsets:Dictionary<ExtendedOffset> = {}
    private _sizes:Dictionary<Size> = {}

    router: Router
    anchorManager:AnchorManager
    groupManager:GroupManager
    private _connectionTypes:Dictionary<TypeDescriptor> = {}
    private _endpointTypes:Dictionary<TypeDescriptor> = {}
    private _container:any

    protected _managedElements:Dictionary<ManagedElement> = {}
    private _floatingConnections:Dictionary<Connection> = {}

    DEFAULT_SCOPE:string

    private _helpers:jsPlumbHelperFunctions
    public geometry:jsPlumbGeometryHelpers

    private _zoom:number = 1

    abstract getElement(el:any|string):any
    abstract getElementById(el:string):any
    abstract removeElement(el:any|string):void
    abstract appendElement (el:any, parent:any):void

    abstract removeClass(el:any, clazz:string):void
    abstract addClass(el:any, clazz:string):void
    abstract toggleClass(el:any, clazz:string):void
    abstract getClass(el:any):string
    abstract hasClass(el:any, clazz:string):boolean

    abstract setAttribute(el:any, name:string, value:string):void
    abstract getAttribute(el:any, name:string):string
    abstract setAttributes(el:any, atts:Dictionary<string>):void
    abstract removeAttribute(el:any, attName:string):void

    abstract getSelector(ctx:string | any, spec?:string):NodeListOf<any>
    abstract getStyle(el:any, prop:string):any

    abstract _getSize(el:any):Size
    abstract _getOffset(el:any|string, relativeToRoot?:boolean, container?:any):Offset
    abstract setPosition(el:any, p:Offset):void
    abstract getUIPosition(eventArgs:any):Offset

    abstract on (el:any, event:string, callbackOrSelector:Function | string, callback?:Function):void
    abstract off (el:any, event:string, callback:Function):void
    abstract trigger(el:any, event:string, originalEvent?:Event, payload?:any):void

    constructor(public readonly _instanceIndex:number, public readonly renderer:Renderer, defaults?:jsPlumbDefaults, helpers?:jsPlumbHelperFunctions) {

        super()

        this._helpers = helpers || {}

        this.geometry = new jsPlumbGeometry()

        this.Defaults = {
            anchor: "Bottom",
            anchors: [ null, null ],
            connectionsDetachable: true,
            connectionOverlays: [ ],
            connector: "Bezier",
            container: null,
            endpoint: "Dot",
            endpointOverlays: [ ],
            endpoints: [ null, null ],
            endpointStyle: { fill: "#456" },
            endpointStyles: [ null, null ],
            endpointHoverStyle: null,
            endpointHoverStyles: [ null, null ],
            hoverPaintStyle: null,
            listStyle: { },
            maxConnections: 1,
            paintStyle: { strokeWidth: 2, stroke: "#456" },
            reattachConnections: false,
            scope: "jsplumb_defaultscope",
            allowNestedGroups:true
        }

        if (defaults) {
            extend(this.Defaults, defaults)
        }

        extend(this._initialDefaults, this.Defaults)
        this.DEFAULT_SCOPE = this.Defaults.scope

        this.allowNestedGroups = this._initialDefaults.allowNestedGroups !== false

        this.router = new DefaultRouter(this)

        // TODO we don't want to expose the anchor manager on the instance. we dont want to expose it on Router, either.
        // this cast would currently mean any alternative Router could fail (if it didn't expose an anchorManager).
        // this is something that will need to be refactored before the Toolkit edition 4.x can be released.
        this.anchorManager = (this.router as DefaultRouter).anchorManager
        this.groupManager = new GroupManager(this)

        this.setContainer(this._initialDefaults.container)
    }

    getSize(el:any) {
        return this._helpers.getSize ? this._helpers.getSize(el) : this._getSize(el)
    }

    getOffset(el:any|string, relativeToRoot?:boolean, container?:any) {
        return this._helpers.getOffset ? this._helpers.getOffset(el, relativeToRoot, container) : this._getOffset(el, relativeToRoot, container)
    }

    getContainer():any { return this._container; }

    setZoom (z:number, repaintEverything?:boolean):boolean {
        this._zoom = z
        this.fire(Constants.EVENT_ZOOM, this._zoom)
        if (repaintEverything) {
            this.repaintEverything()
        }
        return true
    }

    getZoom ():number {
        return this._zoom
    }

    _info (el:string | any):{el:any, text?:boolean, id?:string} {
        if (el == null) {
            return null
        }
        else if ((<any>el).nodeType === 3 || (<any>el).nodeType === 8) {
            return { el:el, text:true }
        }
        else {
            let _el = this.getElement(el)
            return { el: _el, id: (isString(el) && _el == null) ? el as string : this.getId(_el) }
        }
    }

    _idstamp ():string {
        return "" + this._curIdStamp++
    }

    convertToFullOverlaySpec(spec:string | OverlaySpec):FullOverlaySpec {
        let o:FullOverlaySpec = null
        if (isString(spec)) {
            o = [ spec as OverlayId, { } ]
        } else {
            o = spec as FullOverlaySpec
        }
        o[1].id = o[1].id || uuid()
        return o
    }

    checkCondition(conditionName:string, args?:any):boolean {
        let l = this.getListener(conditionName),
            r = true

        if (l && l.length > 0) {
            let values = Array.prototype.slice.call(arguments, 1)
            try {
                for (let i = 0, j = l.length; i < j; i++) {
                    r = r && l[i].apply(l[i], values)
                }
            }
            catch (e) {
                log("cannot check condition [" + conditionName + "]" + e)
            }
        }
        return r
    }

    getInternalId(element:jsPlumbDOMElement):string {
        let id = (element as any)._jsplumbid
        if (id == null) {
            id = "jsplumb_" + this._instanceIndex + "_" + this._idstamp()
            element._jsplumbid = id
        }
        return id
    }

    getId (element:string | any, uuid?:string):string {
        if (isString(element)) {
            return element as string
        }
        if (element == null) {
            return null
        }

        let id:string = this.getAttribute(element, "id")
        if (!id || id === "undefined") {
            // check if fixed uuid parameter is given
            if (arguments.length === 2 && arguments[1] !== undefined) {
                id = uuid
            }
            else if (arguments.length === 1 || (arguments.length === 3 && !arguments[2])) {
                id = "jsPlumb_" + this._instanceIndex + "_" + this._idstamp()
            }

            this.setAttribute(element, "id", id)
        }
        return id
    }

    /**
     * Set the id of the given element. Changes all the refs etc.
     * @param el
     * @param newId
     * @param doNotSetAttribute
     */
    setId (el:any, newId:string, doNotSetAttribute?:boolean):void {
        //
        let id:string, _el:any

        if (isString(el)) {
            id = el as string
        }
        else {
            _el = this.getElement(el)
            id = this.getId(_el)
        }

        let sConns = this.getConnections({source: id, scope: '*'}, true) as Array<Connection>,
            tConns = this.getConnections({target: id, scope: '*'}, true) as Array<Connection>

        newId = "" + newId

        if (!doNotSetAttribute) {
            _el = this.getElement(id)
            this.setAttribute(_el, "id", newId)
        }
        else {
            _el = this.getElement(newId)
        }

        this.endpointsByElement[newId] = this.endpointsByElement[id] || []
        for (let i = 0, ii = this.endpointsByElement[newId].length; i < ii; i++) {
            this.endpointsByElement[newId][i].setElementId(newId)
            this.endpointsByElement[newId][i].setReferenceElement(_el)
        }
        delete this.endpointsByElement[id]
        this._managedElements[newId] = this._managedElements[id]
        delete this._managedElements[id]

        const _conns = (list:Array<Connection>, epIdx:number, type:string) => {
            for (let i = 0, ii = list.length; i < ii; i++) {
                list[i].endpoints[epIdx].setElementId(newId)
                list[i].endpoints[epIdx].setReferenceElement(_el)
                list[i][type + "Id"] = newId
                list[i][type] = _el
            }
        }
        _conns(sConns, 0, Constants.SOURCE)
        _conns(tConns, 1, Constants.TARGET)

        this.repaint(newId)
    }

    setIdChanged(oldId:string, newId:string) {
        this.setId(oldId, newId, true)
    }

    getCachedData(elId:string):{o:Offset, s:Size, r:Rotation} {

        let o = this._offsets[elId]
        if (!o) {
            return this.updateOffset({elId: elId})
        }
        else {
            return {o: o, s: this._sizes[elId], r:this.getRotation(elId)}
        }
    }



// ------------------  element selection ------------------------

    getConnections(options?:SelectOptions, flat?:boolean):Dictionary<Connection> | Array<Connection> {
        if (!options) {
            options = {}
        } else if (options.constructor === String) {
            options = { "scope": options } as SelectOptions
        }
        let scope = options.scope || this.getDefaultScope(),
            scopes = prepareList(this, scope, true),
            sources = prepareList(this, options.source),
            targets = prepareList(this, options.target),
            results = (!flat && scopes.length > 1) ? {} : [],
            _addOne = (scope:string, obj:any) => {
                if (!flat && scopes.length > 1) {
                    let ss = results[scope]
                    if (ss == null) {
                        ss = results[scope] = []
                    }
                    ss.push(obj)
                } else {
                    (<Array<any>>results).push(obj)
                }
            }

        for (let j = 0, jj = this.connections.length; j < jj; j++) {
            let c = this.connections[j],
                sourceId = c.proxies && c.proxies[0] ? c.proxies[0].originalEp.elementId : c.sourceId,
                targetId = c.proxies && c.proxies[1] ? c.proxies[1].originalEp.elementId : c.targetId

            if (filterList(scopes, c.scope) && filterList(sources, sourceId) && filterList(targets, targetId)) {
                _addOne(c.scope, c)
            }
        }

        return results
    }

    select (params?:SelectOptions):ConnectionSelection {
        params = params || {}
        params.scope = params.scope || "*"
        return new ConnectionSelection(this, params.connections || (this.getConnections(params, true) as Array<Connection>))
    }

    selectEndpoints(params?:SelectEndpointOptions):EndpointSelection {
        params = params || {}
        params.scope = params.scope || "*"

        let noElementFilters = !params.element && !params.source && !params.target,
            elements = noElementFilters ? "*" : prepareList(this, params.element),
            sources = noElementFilters ? "*" : prepareList(this, params.source),
            targets = noElementFilters ? "*" : prepareList(this, params.target),
            scopes = prepareList(this, params.scope, true)

        let ep:Array<Endpoint> = []

        for (let el in this.endpointsByElement) {
            let either = filterList(elements, el, true),
                source = filterList(sources, el, true),
                sourceMatchExact = sources !== "*",
                target = filterList(targets, el, true),
                targetMatchExact = targets !== "*"

            // if they requested 'either' then just match scope. otherwise if they requested 'source' (not as a wildcard) then we have to match only endpoints that have isSource set to to true, and the same thing with isTarget.
            if (either || source || target) {
                inner:
                    for (let i = 0, ii = this.endpointsByElement[el].length; i < ii; i++) {
                        let _ep = this.endpointsByElement[el][i]
                        if (filterList(scopes, _ep.scope, true)) {

                            let noMatchSource = (sourceMatchExact && sources.length > 0 && !_ep.isSource),
                                noMatchTarget = (targetMatchExact && targets.length > 0 && !_ep.isTarget)

                            if (noMatchSource || noMatchTarget) {
                                continue inner
                            }

                            ep.push(_ep)
                        }
                    }
            }
        }

        return new EndpointSelection(this, ep)
    }

    setContainer(c:any|string):void {
        // get container as element and set container.
        this._container = this.getElement(c);
        // tell people.
        this.fire(Constants.EVENT_CONTAINER_CHANGE, this._container)
    }

    private _set (c:Connection, el:any|Endpoint, idx:number, doNotRepaint?:boolean):any {

        const stTypes = [
            { el: "source", elId: "sourceId", epDefs: Constants.SOURCE_DEFINITION_LIST },
            { el: "target", elId: "targetId", epDefs: Constants.TARGET_DEFINITION_LIST }
        ]

        let ep, _st = stTypes[idx], cId = c[_st.elId], /*cEl = c[_st.el],*/ sid, sep,
            oldEndpoint = c.endpoints[idx]

        let evtParams = {
            index: idx,
            originalSourceId: idx === 0 ? cId : c.sourceId,
            newSourceId: c.sourceId,
            originalTargetId: idx === 1 ? cId : c.targetId,
            newTargetId: c.targetId,
            connection: c
        }

        if (el instanceof Endpoint) {
            ep = el;
            (<Endpoint>ep).addConnection(c)
            el = (<Endpoint>ep).element
        }
        else {
            sid = this.getId(el)
            sep = el[_st.epDefs] ? el[_st.epDefs][0] : null

            if (sid === c[_st.elId]) {
                ep = null; // dont change source/target if the element is already the one given.
            }
            else if (sep) {

                if (!sep.enabled) {
                    return
                }
                ep = sep.endpoint != null ? sep.endpoint : this.addEndpoint(el, sep.def)
                if (sep.uniqueEndpoint) {
                    sep.endpoint = ep
                }
                ep.addConnection(c)
            }
            else {
                ep = c.makeEndpoint(idx === 0, el, sid)
            }
        }

        if (ep != null) {
            oldEndpoint.detachFromConnection(c)
            c.endpoints[idx] = ep
            c[_st.el] = ep.element
            c[_st.elId] = ep.elementId
            evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId

            this.fireMoveEvent(evtParams)

            if (!doNotRepaint) {
                c.paint()
            }
        }

        (<any>evtParams).element = el
        return evtParams

    }

    setSource (connection:Connection, el:any|Endpoint, doNotRepaint?:boolean):void {
        let p = this._set(connection, el, 0, doNotRepaint)
        this.sourceOrTargetChanged(p.originalSourceId, p.newSourceId, connection, p.el, 0)
    }

    setTarget (connection:Connection, el:any|Endpoint, doNotRepaint?:boolean):void {
        let p = this._set(connection, el, 1, doNotRepaint)
        connection.updateConnectedClass()
    }

    /**
     * Returns whether or not hover is currently suspended.
     */
    isHoverSuspended():boolean { return this.hoverSuspended; }

    /**
     * Sets whether or not drawing is suspended.
     * @param val True to suspend, false to enable.
     * @param repaintAfterwards If true, repaint everything afterwards.
     */
    setSuspendDrawing (val?:boolean, repaintAfterwards?:boolean):boolean {
        let curVal = this._suspendDrawing
        this._suspendDrawing = val
        if (val) {
            this._suspendedAt = "" + new Date().getTime()
        } else {
            this._suspendedAt = null
        }
        if (repaintAfterwards) {
            this.repaintEverything()
        }
        return curVal
    }

    computeAnchorLoc(endpoint:Endpoint, timestamp?:string):AnchorPlacement {

        const myOffset = this._managedElements[endpoint.elementId].info.o
        const anchorLoc = endpoint.anchor.compute({
            xy: [ myOffset.left, myOffset.top ],
            wh: this._sizes[endpoint.elementId],
            element: endpoint,
            timestamp: timestamp || this._suspendedAt,
            rotation:this._managedElements[endpoint.elementId].rotation
        })
        return anchorLoc

    }

    // return time for when drawing was suspended.
    getSuspendedAt ():string {
        return this._suspendedAt
    }

    /**
     * Suspend drawing, run the given function, and then re-enable drawing, optionally repainting everything.
     * @param fn Function to run while drawing is suspended.
     * @param doNotRepaintAfterwards Whether or not to repaint everything after drawing is re-enabled.
     */
    batch (fn:Function, doNotRepaintAfterwards?:boolean):void {
        const _wasSuspended = this._suspendDrawing === true
        if (!_wasSuspended) {
            this.setSuspendDrawing(true)
        }
        try {
            fn()
        }
        catch (e) {
            log("Function run while suspended failed", e)
        }
        if (!_wasSuspended) {
            this.setSuspendDrawing(false, !doNotRepaintAfterwards)
        }
    }

    getDefaultScope ():string {
        return this.DEFAULT_SCOPE
    }

    /**
     * Execute the given function for each of the given elements.
     * @param spec An Element, or an element id, or an array of elements/element ids.
     * @param fn The function to run on each element.
     */
    each(spec:ElementSpec, fn:(e:any) => any):jsPlumbInstance {
        if (spec == null) {
            return
        }
        if (typeof spec === "string") {
            fn(this.getElement(spec))
        }
        else if ((<any>spec).length != null) {
            for (let i = 0; i < (<Array<any>>spec).length; i++) {
                fn(this.getElement(spec[i]))
            }
        }
        else {
            fn(spec)
        } // assume it's an element.

        return this
    }

    /**
     * Update the cached offset information for some element.
     * @param params
     * @return an UpdateOffsetResult containing the offset information for the given element.
     */
    updateOffset(params?:UpdateOffsetOptions):UpdateOffsetResult {

        let timestamp = params.timestamp,
            recalc = params.recalc,
            offset = params.offset,
            elId = params.elId,
            s

        if (this._suspendDrawing && !timestamp) {
            timestamp = this._suspendedAt
        }
        if (!recalc) {
            if (timestamp && timestamp === this._offsetTimestamps[elId]) {
                return {o: params.offset || this._offsets[elId], s: this._sizes[elId], r:this.getRotation(elId)}
            }
        }
        if (recalc || (!offset && this._offsets[elId] == null)) { // if forced repaint or no offset available, we recalculate.

            // get the current size and offset, and store them
            s = this._managedElements[elId] ? this._managedElements[elId].el : null
            if (s != null) {
                this._sizes[elId] = this.getSize(s)
                this._offsets[elId] = this.getOffset(s)
                this._offsetTimestamps[elId] = timestamp
            }
        } else {
            this._offsets[elId] = offset || this._offsets[elId]
            if (this._sizes[elId] == null) {
                s = this._managedElements[elId].el
                if (s != null) {
                    this._sizes[elId] = this.getSize(s)
                }
            }
            this._offsetTimestamps[elId] = timestamp
        }

        if (this._offsets[elId] && !this._offsets[elId].right) {
            this._offsets[elId].right = this._offsets[elId].left + this._sizes[elId][0]
            this._offsets[elId].bottom = this._offsets[elId].top + this._sizes[elId][1]
            this._offsets[elId].width = this._sizes[elId][0]
            this._offsets[elId].height = this._sizes[elId][1]
            this._offsets[elId].centerx = this._offsets[elId].left + (this._offsets[elId].width / 2)
            this._offsets[elId].centery = this._offsets[elId].top + (this._offsets[elId].height / 2)
        }

        return {o: this._offsets[elId], s: this._sizes[elId], r:this.getRotation(elId)}
    }

    /**
     * Delete the given connection.
     * @param connection Connection to delete.
     * @param params Optional extra parameters.
     */
    deleteConnection (connection:Connection, params?:DeleteConnectionOptions):boolean {

        if (connection != null) {
            params = params || {}

            if (params.force || functionChain(true, false, [
                    [ connection.endpoints[0], Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection.endpoints[1], Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection, Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ this, Constants.CHECK_CONDITION, [ Constants.BEFORE_DETACH, connection ] ]
                ])) {

                this.fireDetachEvent(connection, !connection.pending && params.fireEvent !== false, params.originalEvent)

                const sourceEndpoint = connection.endpoints[0]
                const targetEndpoint = connection.endpoints[1]

                if (sourceEndpoint !== params.endpointToIgnore) {
                    sourceEndpoint.detachFromConnection(connection, null, true)
                }

                if (targetEndpoint !== params.endpointToIgnore) {
                    targetEndpoint.detachFromConnection(connection, null, true)
                }

                removeWithFunction(this.connections, (_c:Connection) => {
                    return connection.id === _c.id
                })

                connection.destroy()

                if (sourceEndpoint !== params.endpointToIgnore && sourceEndpoint.deleteOnEmpty && sourceEndpoint.connections.length === 0) {
                    this.deleteEndpoint(sourceEndpoint)
                }

                if (targetEndpoint !== params.endpointToIgnore && targetEndpoint.deleteOnEmpty && targetEndpoint.connections.length === 0) {
                    this.deleteEndpoint(targetEndpoint)
                }

                return true
            }
        }
        return false
    }

    deleteEveryConnection (params?:DeleteConnectionOptions):number {
        params = params || {}
        let count = this.connections.length, deletedCount = 0
        this.batch(() => {
            for (let i = 0; i < count; i++) {
                deletedCount += this.deleteConnection(this.connections[0], params) ? 1 : 0
            }
        })
        return deletedCount
    }

    deleteConnectionsForElement(el:any|string, params?:DeleteConnectionOptions):jsPlumbInstance {
        params = params || {}
        let _el = this.getElement(el)
        let id = this.getId(_el), endpoints = this.endpointsByElement[id]
        if (endpoints && endpoints.length) {
            for (let i = 0, j = endpoints.length; i < j; i++) {
                endpoints[i].deleteEveryConnection(params)
            }
        }
        return this
    }

    private fireDetachEvent (jpc:Connection | any, doFireEvent?:boolean, originalEvent?:Event):void {
        // may have been given a connection, or in special cases, an object
        let argIsConnection:boolean = (jpc.id != null),
            params = argIsConnection ? {
                connection: jpc,
                source: jpc.source, target: jpc.target,
                sourceId: jpc.sourceId, targetId: jpc.targetId,
                sourceEndpoint: jpc.endpoints[0], targetEndpoint: jpc.endpoints[1]
            } : jpc

        if (doFireEvent) {
            this.fire(Constants.EVENT_CONNECTION_DETACHED, params, originalEvent)
        }

        // always fire this. used by internal jsplumb stuff.
        this.fire(Constants.EVENT_INTERNAL_CONNECTION_DETACHED, params, originalEvent)

        this.router.connectionDetached(params.connection)
    }

    fireMoveEvent (params?:any, evt?:Event):void {
        this.fire(Constants.EVENT_CONNECTION_MOVED, params, evt)
    }

    /**
     * Manage a group of elements.
     * @param elements Array-like object of strings or DOM elements.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manageAll (elements:any, recalc?:boolean):void {
        for (let i = 0; i < elements.length; i++) {
            this.manage(elements[i], recalc)
        }
    }

    /**
     * Manage an element.
     * @param element String, or DOM element.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manage (element:ElementSpec, recalc?:boolean):ManagedElement {

        const el:any = IS.aString(element) ? this.getElementById(element as string) : element
        const elId = this.getId(el)
        if (!this._managedElements[elId]) {

            this.setAttribute(el, Constants.ATTRIBUTE_MANAGED, "")

            this._managedElements[elId] = {
                el:el,
                endpoints:[],
                connections:[],
                rotation:0
            }

            if (this._suspendDrawing) {
                this._sizes[elId] = [0,0]
                this._offsets[elId] = {left:0,top:0}
                this._managedElements[elId].info = {o:this._offsets[elId], s:this._sizes[elId]}
            } else {
                this._managedElements[elId].info = this.updateOffset({elId: elId, timestamp: this._suspendedAt})
            }

            // write context into the element. we want to use this moving forward and get rid of endpointsByElement and the sizes, offsets and info stuff
            // from above. it should suffice to put the context on the elements themselves.
            el._jspContext = {
                ep:[],
                o:this._offsets[elId],
                s:this._sizes[elId]
            }

        } else {
            if (recalc) {
                this._managedElements[elId].info = this.updateOffset({elId: elId, timestamp: null,  recalc:true })
            }
        }

        return this._managedElements[elId]
    }

    /**
     * Stops managing the given element.
     * @param id ID of the element to stop managing.
     */
    unmanage (id:string):void {
        if (this._managedElements[id]) {
            this.removeAttribute(this._managedElements[id].el, Constants.ATTRIBUTE_MANAGED)
            delete this._managedElements[id]
        }
    }

    rotate(elementId:string, rotation:number, doNotRepaint?:boolean) {
        if (this._managedElements[elementId]) {
            this._managedElements[elementId].rotation = rotation
            if (doNotRepaint !== true) {
                this.revalidate(elementId)
            }
        }
    }

    getRotation(elementId:string):number {
        return this._managedElements[elementId] ? (this._managedElements[elementId].rotation || 0) : 0
    }

    newEndpoint(params:any, id?:string):Endpoint {
        let _p = extend({}, params)
        _p.elementId = id || this.getId(_p.source)

        let ep = new Endpoint(this, _p)
        ep.id = "ep_" + this._idstamp()
        this.manage(_p.source)

        return ep
    }

    deriveEndpointAndAnchorSpec(type:string, dontPrependDefault?:boolean):any {
        let bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/), eps = null, ep = null, a = null, as = null
        for (let i = 0; i < bits.length; i++) {
            let _t = this.getType(bits[i], "connection")
            if (_t) {
                if (_t.endpoints) {
                    eps = _t.endpoints
                }
                if (_t.endpoint) {
                    ep = _t.endpoint
                }
                if (_t.anchors) {
                    as = _t.anchors
                }
                if (_t.anchor) {
                    a = _t.anchor
                }
            }
        }
        return { endpoints: eps ? eps : [ ep, ep ], anchors: as ? as : [a, a ]}
    }

    getAllConnections ():Array<Connection> {
        return this.connections
    }

    // repaint some element's endpoints and connections
    repaint (el:string | any | Array<string | any>, ui?:any, timestamp?:string):jsPlumbInstance {
        return this.each(el, (_el:any | string) => {
            this._draw(_el, ui, timestamp)
        })
    }

    revalidate (el:string | any | Array<string | any>, timestamp?:string, isIdAlready?:boolean):jsPlumbInstance {
        return this.each(el, (_el:any | string) => {
            let elId = isIdAlready ? _el as string : this.getId(_el)
            this.updateOffset({ elId: elId, recalc: true, timestamp:timestamp })
            this.repaint(_el)
        })
    }

    // repaint every endpoint and connection.
    repaintEverything ():jsPlumbInstance {
        let timestamp = uuid(), elId:string

        for (elId in this.endpointsByElement) {
            this.updateOffset({ elId: elId, recalc: true, timestamp: timestamp })
        }

        for (elId in this.endpointsByElement) {
            this._draw(elId, null, timestamp, true)
        }

        return this
    }

    /**
     * for some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group.
     * @param el
     * @private
     */
    abstract _getAssociatedElements(el:any):Array<any>

    _draw(element:string | any, ui?:any, timestamp?:string, offsetsWereJustCalculated?:boolean) {

        if (!this._suspendDrawing) {

            let id = typeof element === "string" ? element as string : this.getId(element),
                el = typeof element === "string" ? this.getElementById(element as string) : element

            if (el != null) {
                let repaintEls = this._getAssociatedElements(el),
                    repaintOffsets:Array<ExtendedOffset> = []

                if (timestamp == null) {
                    timestamp = uuid()
                }

                if (!offsetsWereJustCalculated) {
                    // update the offset of everything _before_ we try to draw anything.
                    this.updateOffset({elId: id, offset: ui, recalc: false, timestamp: timestamp})
                    for (let i = 0; i < repaintEls.length; i++) {
                        repaintOffsets.push(this.updateOffset({
                            elId: this.getId(repaintEls[i]),
                            recalc: true,
                            timestamp: timestamp
                        }).o)
                    }
                } else {
                    for (let i = 0; i < repaintEls.length; i++) {
                        const reId = this.getId(repaintEls[i])
                        repaintOffsets.push(this._offsets[reId])
                    }
                }

                this.router.redraw(id, ui, timestamp, null)

                if (repaintEls.length > 0) {
                    for (let j = 0; j < repaintEls.length; j++) {
                        this.router.redraw(this.getId(repaintEls[j]), repaintOffsets[j], timestamp, null)
                    }
                }
            }
        }
    }

    unregisterEndpoint(endpoint:Endpoint) {
        const uuid = endpoint.getUuid()
        if (uuid) {
            delete this.endpointsByUUID[uuid]
        }
        this.router.deleteEndpoint(endpoint)

        // TODO at least replace this with a removeWithFunction call.
        for (let e in this.endpointsByElement) {
            let endpoints = this.endpointsByElement[e]
            if (endpoints) {
                let newEndpoints = []
                for (let i = 0, j = endpoints.length; i < j; i++) {
                    if (endpoints[i] !== endpoint) {
                        newEndpoints.push(endpoints[i])
                    }
                }

                this.endpointsByElement[e] = newEndpoints
            }
            if (this.endpointsByElement[e].length < 1) {
                delete this.endpointsByElement[e]
            }
        }
    }

    maybePruneEndpoint(endpoint:Endpoint):boolean {
        if (endpoint.deleteOnEmpty && endpoint.connections.length === 0) {
            this.deleteEndpoint(endpoint)
            return true
        } else {
            return false
        }
    }

    deleteEndpoint(object:string | Endpoint):jsPlumbInstance {
        let endpoint = (typeof object === "string") ? this.endpointsByUUID[object as string] : object as Endpoint
        if (endpoint) {

            // find all connections for the endpoint
            const connectionsToDelete = endpoint.connections.slice()
            connectionsToDelete.forEach((connection) => {
                // detach this endpoint from each of these connections.
                endpoint.detachFromConnection(connection, null, true)
            })

            // delete the endpoint
            this.unregisterEndpoint(endpoint)
            endpoint.destroy(true)

            // then delete the connections. each of these connections only has one endpoint at the moment
            connectionsToDelete.forEach((connection) => {
                // detach this endpoint from each of these connections.
                this.deleteConnection(connection, {force:true, endpointToIgnore:endpoint})
            })
        }
        return this
    }

    addEndpoint(el:string|any, params?:EndpointOptions, referenceParams?:EndpointOptions):Endpoint{
        referenceParams = referenceParams || {} as EndpointOptions
        let p:EndpointOptions = extend({}, referenceParams)
        extend(p, params)
        p.endpoint = p.endpoint || this.Defaults.endpoint
        p.paintStyle = p.paintStyle || this.Defaults.endpointStyle
        let _p = extend({source:el}, p)
        let id = this.getId(_p.source)
        const mel:ManagedElement = this.manage(el, !this._suspendDrawing)
        let e = this.newEndpoint(_p, id)

        addToList(this.endpointsByElement, id, e)

        // store the endpoint directly on the element.
        mel.el._jspContext.ep.push(e)

        if (!this._suspendDrawing) {

            // why not just a full renderer.paintEndpoint method here?

            //this.renderer.paintEndpoint()  // but why does this method expect a paintStyle?

            const anchorLoc = this.computeAnchorLoc(e)
            e.paint({
                anchorLoc: anchorLoc,
                timestamp: this._suspendedAt
            })
        }

        return e
    }

    addEndpoints(el:any, endpoints:Array<EndpointOptions>, referenceParams?:any):Array<Endpoint> {
        let results:Array<Endpoint> = []
        for (let i = 0, j = endpoints.length; i < j; i++) {
            results.push(this.addEndpoint(el, endpoints[i], referenceParams))
        }
        return results
    }

    // clears all endpoints and connections from the instance of jsplumb, optionally without firing any events
    // subclasses should take care of cleaning up the rendering.
    reset (silently?:boolean):void {
        this.silently(() => {
            this.endpointsByElement = {}
            this._managedElements = {}
            this.endpointsByUUID = {}
            this._offsets = {}
            this._offsetTimestamps = {}
            this.router.reset()
            this.groupManager.reset()
            this._connectionTypes = {}
            this._endpointTypes = {}
            this.connections.length = 0
        })
    }

// ------ these are exposed for library packages to use; it allows them to be built without needing to include the utils --------
    uuid(): string {
        return uuid()
    }

    rotatePoint(point:Array<number>, center:PointArray, rotation:number):[number, number, number, number] {
        return rotatePoint(point, center, rotation)
    }

    rotateAnchorOrientation(orientation:[number, number], rotation:any):[number, number] {
        return rotateAnchorOrientation(orientation, rotation)
    }

// ---------------------------------------------------------------------------------

    // clears the instance (without firing any events) and unbinds any listeners on the instance.
    destroy():void {
        this.reset(true)
        this.unbind()
    }

    getEndpoints(el:string|any):Array<Endpoint> {
        return this.endpointsByElement[this._info(el).id] || []
    }

    getEndpoint(id:string):Endpoint {
        return this.endpointsByUUID[id]
    }

    connect (params:ConnectParams, referenceParams?:ConnectParams):Connection {

        // prepare a final set of parameters to create connection with

        let _p = this._prepareConnectionParams(params, referenceParams), jpc:Connection
        // TODO probably a nicer return value if the connection was not made.  _prepareConnectionParams
        // will return null (and log something) if either endpoint was full.  what would be nicer is to
        // create a dedicated 'error' object.
        if (_p) {
            if (_p.source == null && _p.sourceEndpoint == null) {
                log("Cannot establish connection - source does not exist")
                return
            }
            if (_p.target == null && _p.targetEndpoint == null) {
                log("Cannot establish connection - target does not exist")
                return
            }

            // create the connection.  it is not yet registered
            jpc = this._newConnection(_p)

            // now add it the model, fire an event, and redraw

            this._finaliseConnection(jpc, _p)
        }


        return jpc
    }

    private _prepareConnectionParams(params:ConnectParams, referenceParams?:ConnectParams):InternalConnectParams {

        let _p:InternalConnectParams = extend({ }, params)
        if (referenceParams) {
            extend(_p, referenceParams)
        }

        // wire endpoints passed as source or target to sourceEndpoint/targetEndpoint, respectively.
        if (_p.source) {
            if ((_p.source as Endpoint).endpoint) {
                _p.sourceEndpoint = (_p.source as Endpoint)
            }
            else {
                _p.source = this.getElement(_p.source as any)
            }
        }
        if (_p.target) {
            if ((_p.target as Endpoint).endpoint) {
                _p.targetEndpoint = (_p.target as Endpoint)
            }
            else {
                _p.target = this.getElement(_p.target as any)
            }
        }

        // test for endpoint uuids to connect
        if (params.uuids) {
            _p.sourceEndpoint = this.getEndpoint(params.uuids[0])
            _p.targetEndpoint = this.getEndpoint(params.uuids[1])
        }

        // now ensure that if we do have Endpoints already, they're not full.
        // source:
        if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
            log("could not add connection; source endpoint is full")
            return
        }

        // target:
        if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
            log("could not add connection; target endpoint is full")
            return
        }

        // if source endpoint mandates connection type and nothing specified in our params, use it.
        if (!_p.type && _p.sourceEndpoint) {
            _p.type = _p.sourceEndpoint.connectionType
        }

        // copy in any connectorOverlays that were specified on the source endpoint.
        // it doesnt copy target endpoint overlays.  i'm not sure if we want it to or not.
        if (_p.sourceEndpoint && _p.sourceEndpoint.connectorOverlays) {
            _p.overlays = _p.overlays || []
            for (let i = 0, j = _p.sourceEndpoint.connectorOverlays.length; i < j; i++) {
                _p.overlays.push(_p.sourceEndpoint.connectorOverlays[i])
            }
        }

        // scope
        if (_p.sourceEndpoint && _p.sourceEndpoint.scope) {
            _p.scope = _p.sourceEndpoint.scope
        }

        // pointer events
        if (!_p["pointer-events"] && _p.sourceEndpoint && _p.sourceEndpoint.connectorPointerEvents) {
            _p["pointer-events"] = _p.sourceEndpoint.connectorPointerEvents
        }

        let _addEndpoint = (el:any, def?:any, idx?:number):Endpoint | Array<Endpoint> => {
            const params = _mergeOverrides(def, {
                anchor: _p.anchors ? _p.anchors[idx] : _p.anchor,
                endpoint: _p.endpoints ? _p.endpoints[idx] : _p.endpoint,
                paintStyle: _p.endpointStyles ? _p.endpointStyles[idx] : _p.endpointStyle,
                hoverPaintStyle: _p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle,
                portId: _p.ports ? _p.ports[idx] : null
            })
            return this.addEndpoint(el, params)
        }

        // check for makeSource/makeTarget specs.

        let _oneElementDef = (type:string, idx:number, matchType:string, portId:string) => {
            // `type` is "source" or "target". Check that it exists, and is not already an Endpoint.
            if (_p[type] && !_p[type].endpoint && !_p[type + "Endpoint"] && !_p.newConnection) {

                let elDefs = _p[type][type === Constants.SOURCE ? Constants.SOURCE_DEFINITION_LIST : Constants.TARGET_DEFINITION_LIST]
                if (elDefs) {
                    let defIdx = findWithFunction(elDefs, (d:any) => {

                        //return (d.def.connectionType == null || d.def.connectionType === matchType) && (portId == null || d.def.portId === portId)

                        return (d.def.connectionType == null || d.def.connectionType === matchType) && (d.def.portId == null || d.def.portId == portId)
                        //return (d.def.portId == null || d.def.portId == portId)
                    })
                    if (defIdx >= 0) {

                        let tep = elDefs[defIdx]

                        if (tep) {
                            // if not enabled, return.
                            if (!tep.enabled) {
                                return false
                            }

                            const epDef = extend({}, tep.def)
                            delete epDef.label

                            let newEndpoint = tep.endpoint != null ? tep.endpoint : _addEndpoint(_p[type], epDef, idx)
                            if (newEndpoint.isFull()) {
                                return false
                            }
                            _p[type + "Endpoint"] = newEndpoint
                            if (!_p.scope && epDef.scope) {
                                _p.scope = epDef.scope
                            } // provide scope if not already provided and endpoint def has one.
                            if (tep.uniqueEndpoint) {
                                if (!tep.endpoint) {
                                    tep.endpoint = newEndpoint
                                    newEndpoint.deleteOnEmpty = false
                                }
                                else {
                                    newEndpoint.finalEndpoint = tep.endpoint
                                }
                            } else {
                                newEndpoint.deleteOnEmpty = true
                            }

                            //
                            // copy in connector overlays if present on the source definition.
                            //
                            if (idx === 0 && epDef.connectorOverlays) {
                                _p.overlays = _p.overlays || []
                                Array.prototype.push.apply(_p.overlays, epDef.connectorOverlays)
                            }
                        }
                    }
                }
            }
        }

        if (_oneElementDef(Constants.SOURCE, 0, _p.type || Constants.DEFAULT, _p.ports ? _p.ports[0] : null) === false) {
            return
        }
        if (_oneElementDef(Constants.TARGET, 1, _p.type || Constants.DEFAULT, _p.ports ? _p.ports[1] : null) === false) {
            return
        }

        // last, ensure scopes match
        if (_p.sourceEndpoint && _p.targetEndpoint) {
            if (!_scopeMatch(_p.sourceEndpoint, _p.targetEndpoint)) {
                _p = null
            }
        }
        return _p
    }

    _newConnection (params:any):Connection {
        params.id = "con_" + this._idstamp()
        const c = new Connection(this, params)
        c.paint()
        return c
    }

    //
    // adds the connection to the backing model, fires an event if necessary and then redraws
    //
    _finaliseConnection(jpc:Connection, params?:any, originalEvent?:Event, doInformAnchorManager?:boolean):void {

        params = params || {}
        // add to list of connections (by scope).
        if (!jpc.suspendedEndpoint) {
            this.connections.push(jpc)
        }

        jpc.pending = null

        // turn off isTemporarySource on the source endpoint (only viable on first draw)
        jpc.endpoints[0].isTemporarySource = false

        // always inform the anchor manager
        // except that if jpc has a suspended endpoint it's not true to say the
        // connection is new; it has just (possibly) moved. the question is whether
        // to make that call here or in the anchor manager.  i think perhaps here.
        if (doInformAnchorManager !== false) {
            this.router.newConnection(jpc)
        }

        // force a paint
        this._draw(jpc.source)

        // fire an event
        if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {

            let eventArgs = {
                connection: jpc,
                source: jpc.source, target: jpc.target,
                sourceId: jpc.sourceId, targetId: jpc.targetId,
                sourceEndpoint: jpc.endpoints[0], targetEndpoint: jpc.endpoints[1]
            }

            this.fire(Constants.EVENT_CONNECTION, eventArgs, originalEvent)
        }
    }

    private _doRemove(info:{el:any, text?:boolean, id?:string}, affectedElements:Array<{el:any, text?:boolean, id?:string}>):void {
        this.removeAllEndpoints(info.id, true, affectedElements)
        let _one = (_info:{el:any, text?:boolean, id?:string}) => {

            if (info.el != null) {
                this.anchorManager.clearFor(_info.id)
                this.anchorManager.removeFloatingConnection(_info.id)

                if (this.isSource(_info.el)) {
                    this.unmakeSource(_info.el)
                }
                if (this.isTarget(_info.el)) {
                    this.unmakeTarget(_info.el)
                }

                delete this._floatingConnections[_info.id]
                delete this._managedElements[_info.id]
                delete this._offsets[_info.id]
                if (_info.el) {
                    this.removeElement(_info.el)
                }
            }
        }

        // remove all affected child elements
        for (let ae = 1; ae < affectedElements.length; ae++) {
            _one(affectedElements[ae])
        }
        // and always remove the requested one from the dom.
        _one(info)
    }

    //
    // TODO this method performs DOM operations, and shouldnt.
    remove(el:string|any, doNotRepaint?:boolean):jsPlumbInstance {
        let info = this._info(el), affectedElements:Array<any> = []
        if (info.text && (info.el as any).parentNode) {
            (info.el as any).parentNode.removeChild(info.el)
        }
        else if (info.id) {
            this.batch(() => {
                this._doRemove(info, affectedElements)
            }, doNotRepaint === true)
        }
        return this
    }

    removeAllEndpoints(el:string | any, recurse?:boolean, affectedElements?:Array<any>):jsPlumbInstance {
        affectedElements = affectedElements || []
        let _one = (_el:string | any) => {
            let info = this._info(_el),
                ebe = this.endpointsByElement[info.id],
                i, ii

            if (ebe) {
                affectedElements.push(info)
                for (i = 0, ii = ebe.length; i < ii; i++) {
                    // TODO check this logic. was the second arg a "do not repaint now" argument?
                    //this.deleteEndpoint(ebe[i], false)
                    this.deleteEndpoint(ebe[i])
                }
            }
            delete this.endpointsByElement[info.id]

            // TODO DOM specific
            if (recurse) {
                if (info.el && (<any>info.el).nodeType !== 3 && (<any>info.el).nodeType !== 8) {
                    for (i = 0, ii = (<any>info.el).childNodes.length; i < ii; i++) {
                        _one((<any>info.el).childNodes[i])
                    }
                }
            }

        }
        _one(el)
        return this
    }

    private _setEnabled (type:string, el:ElementSpec, state:boolean, toggle?:boolean, connectionType?:string):any {
        let originalState:Array<any> = [], newState, os

        connectionType = connectionType || Constants.DEFAULT

        this.each(el, (_el:any) => {
            let defs = _el[type === Constants.SOURCE ? Constants.SOURCE_DEFINITION_LIST : Constants.TARGET_DEFINITION_LIST]
            if (defs) {
                this.each(defs, (def:SourceOrTargetDefinition) =>{
                    if (def.def.connectionType == null || def.def.connectionType === connectionType) {
                        os = def.enabled
                        originalState.push(os)
                        newState = toggle ? !os : state
                        def.enabled = newState
                        this[newState ? "removeClass" : "addClass"](_el, "jtk-" + type + "-disabled")
                    }
                })
            }
        })

        return originalState.length > 1 ? originalState : originalState[0]

    }

    toggleSourceEnabled (el:any, connectionType?:string):any {
        this._setEnabled(Constants.SOURCE, el, null, true, connectionType)
        return this.isSourceEnabled(el, connectionType)
    }

    setSourceEnabled (el:ElementSpec, state:boolean, connectionType?:string):any {
        return this._setEnabled(Constants.SOURCE, el, state, null, connectionType)
    }

    findFirstSourceDefinition(el:any, connectionType?:string):SourceDefinition {
        return this.findFirstDefinition(Constants.SOURCE_DEFINITION_LIST, el, connectionType)
    }

    findFirstTargetDefinition(el:any, connectionType?:string):TargetDefinition {
        return this.findFirstDefinition(Constants.TARGET_DEFINITION_LIST, el, connectionType)
    }

    private findFirstDefinition<T>(key:string, el:any, connectionType?:string):T {
        if (el == null) {
            return null
        } else {
            const eldefs = el[key]
            if (eldefs && eldefs.length > 0) {
                let idx = connectionType == null ? 0 : findWithFunction(eldefs, (d: any) => {
                    return d.def.connectionType === connectionType
                })
                if (idx >= 0) {
                    return eldefs[0]
                }
            }
        }
    }

    isSource (el:any, connectionType?:string):any {
        return this.findFirstSourceDefinition(this.getElement(el), connectionType) != null
    }

    isSourceEnabled (el:any, connectionType?:string):boolean {
        let def = this.findFirstSourceDefinition(el, connectionType)
        return def != null && def.enabled !== false
    }

    toggleTargetEnabled(el:any, connectionType?:string):any {
        this._setEnabled(Constants.TARGET, el, null, true, connectionType)
        return this.isTargetEnabled(el, connectionType)
    }

    isTarget(el:any, connectionType?:string):boolean {
        return this.findFirstTargetDefinition(this.getElement(el), connectionType) != null
    }

    isTargetEnabled (el:any, connectionType?:string):boolean {
        let def = this.findFirstTargetDefinition(el, connectionType)
        return def != null && def.enabled !== false
    }

    setTargetEnabled(el:any, state:boolean, connectionType?:string):any {
        return this._setEnabled(Constants.TARGET, el, state, null, connectionType)
    }

    // really just exposed for testing
    makeAnchor(spec:AnchorSpec, elementId?:string):Anchor {
        return makeAnchorFromSpec(this, spec, elementId)
    }

    private _unmake (type:string, key:string, el:ElementSpec, connectionType?:string) {

        connectionType = connectionType || "*"

        this.each(el, (_el:any) => {
            if (_el[key]) {
                if (connectionType === "*") {
                    delete _el[key]
                    this.removeAttribute(_el, "jtk-" + type)
                } else {
                    let t:Array<any> = []
                    _el[key].forEach((def:any) => {
                        if (connectionType !== def.def.connectionType) {
                            t.push(def)
                        }
                    })

                    if (t.length > 0) {
                        _el[key] = t
                    } else {
                        delete _el[key]
                        this.removeAttribute(_el, "jtk-" + type)
                    }
                }
            }
        })
    }

    private _unmakeEvery (type:string, key:string, connectionType?:string) {
        let els = this.getSelector("[jtk-" + type + "]")
        for (let i = 0; i < els.length; i++) {
            this._unmake(type, key, els[i], connectionType)
        }
    }

    // see api docs
    unmakeTarget (el:any, connectionType?:string) {
        return this._unmake(Constants.TARGET, Constants.TARGET_DEFINITION_LIST, el, connectionType)
    }

    // see api docs
    unmakeSource (el:any, connectionType?:string) {
        return this._unmake(Constants.SOURCE, Constants.SOURCE_DEFINITION_LIST, el, connectionType)
    }

    // see api docs
    unmakeEverySource (connectionType?:string) {
        this._unmakeEvery(Constants.SOURCE, Constants.SOURCE_DEFINITION_LIST, connectionType || "*")
    }

    // see api docs
    unmakeEveryTarget (connectionType?:string) {
        this._unmakeEvery(Constants.TARGET, Constants.TARGET_DEFINITION_LIST, connectionType || "*")
    }

    private _writeScopeAttribute (el:any, scope:string):void {
        let scopes = scope.split(/\s/)
        for (let i = 0; i < scopes.length; i++) {
            this.setAttribute(el, "jtk-scope-" + scopes[i], "")
        }
    }

    // TODO knows about the DOM
    makeSource(el:ElementSpec, params?:BehaviouralTypeDescriptor, referenceParams?:any):jsPlumbInstance {
        let p = extend({_jsPlumb: this}, referenceParams)
        extend(p, params)
        p.connectionType = p.connectionType || Constants.DEFAULT
        let aae = this.deriveEndpointAndAnchorSpec(p.connectionType)
        p.endpoint = p.endpoint || aae.endpoints[0]
        p.anchor = p.anchor || aae.anchors[0]
        let maxConnections = p.maxConnections || -1

        const _one = (_el:any) => {

            let elInfo = this._info(_el)
            // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
            // and use the endpoint definition if found.
            let _del = elInfo.el

            this.manage(_del)
            this.setAttribute(_del, Constants.ATTRIBUTE_SOURCE, "")
            this._writeScopeAttribute(elInfo.el, (p.scope || this.Defaults.scope))
            this.setAttribute(_del, [ Constants.ATTRIBUTE_SOURCE, p.connectionType].join("-"), "")

            ;(elInfo.el as jsPlumbDOMElement)._jsPlumbSourceDefinitions = (elInfo.el as jsPlumbDOMElement)._jsPlumbSourceDefinitions || []

            let _def:SourceDefinition = {
                def:extend({}, p),
                uniqueEndpoint: p.uniqueEndpoint,
                maxConnections: maxConnections,
                enabled: true,
                endpoint:null as Endpoint
            }

            if (p.createEndpoint) {
                _def.uniqueEndpoint = true
                _def.endpoint = this.addEndpoint(_del, _def.def)
                _def.endpoint.deleteOnEmpty = false
            }

            (<any>elInfo).def = _def
            ;(elInfo.el as jsPlumbDOMElement)._jsPlumbSourceDefinitions.push(_def)

        }

        this.each(el, _one)

        return this
    }

    private _getScope(el:any|string, defKey:string):string {
        let elInfo = this._info(el)
        if (elInfo.el && elInfo.el[defKey] && elInfo.el[defKey].length > 0) {
            return elInfo.el[defKey][0].def.scope
        } else {
            return null
        }
    }

    getSourceScope(el:any|string):string {
        return this._getScope(el, Constants.SOURCE_DEFINITION_LIST)
    }

    getTargetScope(el:any|string):string {
        return this._getScope(el, Constants.TARGET_DEFINITION_LIST)
    }

    getScope(el:any|string):string {
        return this.getSourceScope(el) || this.getTargetScope(el)
    }

    private _setScope(el:any|string, scope:string, defKey:string):void {
        let elInfo = this._info(el)
        if (elInfo.el && elInfo.el[defKey]) {
            elInfo.el[defKey].forEach((def:any) => def.def.scope = scope)
        }
    }

    setSourceScope(el:any|string, scope:string):void {
        this._setScope(el, scope, Constants.SOURCE_DEFINITION_LIST)
    }

    setTargetScope(el:any|string, scope:string):void {
        this._setScope(el, scope, Constants.TARGET_DEFINITION_LIST)
    }

    setScope(el:any|string, scope:string):void {
        this._setScope(el, scope, Constants.SOURCE_DEFINITION_LIST)
        this._setScope(el, scope, Constants.TARGET_DEFINITION_LIST)
    }

    makeTarget (el:ElementSpec, params:BehaviouralTypeDescriptor, referenceParams?:any):jsPlumbInstance {

        // put jsplumb ref into params without altering the params passed in
        let p = extend({_jsPlumb: this}, referenceParams)
        extend(p, params)
        p.connectionType  = p.connectionType || Constants.DEFAULT

        let maxConnections = p.maxConnections || -1;//,

        const _one = (_el:any) => {

            // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
            // and use the endpoint definition if found.
            // decode the info for this element (id and element)
            let elInfo = this._info(_el),
                dropOptions = extend({}, p.dropOptions || {})

            this.manage(elInfo.el)
            this.setAttribute(elInfo.el, Constants.ATTRIBUTE_TARGET, "")
            this._writeScopeAttribute(elInfo.el, (p.scope || this.Defaults.scope))
            this.setAttribute(elInfo.el, [Constants.ATTRIBUTE_TARGET, p.connectionType].join("-"), "")

            ;(elInfo.el as jsPlumbDOMElement)._jsPlumbTargetDefinitions = (elInfo.el as jsPlumbDOMElement)._jsPlumbTargetDefinitions || []

            // if this is a group and the user has not mandated a rank, set to -1 so that Nodes takes
            // precedence.
            if ((<any>elInfo.el)._isJsPlumbGroup && dropOptions.rank == null) {
                dropOptions.rank = -1
            }

            // store the definition
            let _def = {
                def: extend({}, p),
                uniqueEndpoint: p.uniqueEndpoint,
                maxConnections: maxConnections,
                enabled: true,
                endpoint:null as Endpoint
            }

            if (p.createEndpoint) {
                _def.uniqueEndpoint = true
                _def.endpoint = this.addEndpoint(elInfo.el, _def.def)
                _def.endpoint.deleteOnEmpty = false
            }

            (elInfo.el as jsPlumbDOMElement)._jsPlumbTargetDefinitions.push(_def)
        }

        this.each(el, _one)

        return this
    }

    show (el:string|any, changeEndpoints?:boolean):jsPlumbInstance {
        this._setVisible(el, Constants.BLOCK, changeEndpoints)
        return this
    }

    hide (el:string|any, changeEndpoints?:boolean):jsPlumbInstance {
        this._setVisible(el, Constants.NONE, changeEndpoints)
        return this
    }

    private _setVisible (el:string|any, state:string, alsoChangeEndpoints?:boolean) {
        let visible = state === Constants.BLOCK
        let endpointFunc = null
        if (alsoChangeEndpoints) {
            endpointFunc = (ep:Endpoint) => {
                ep.setVisible(visible, true, true)
            }
        }
        let info = this._info(el)
        this._operation(info.id, (jpc:Connection) => {
            if (visible && alsoChangeEndpoints) {
                // this test is necessary because this functionality is new, and i wanted to maintain backwards compatibility.
                // this block will only set a connection to be visible if the other endpoint in the connection is also visible.
                let oidx = jpc.sourceId === info.id ? 1 : 0
                if (jpc.endpoints[oidx].isVisible()) {
                    jpc.setVisible(true)
                }
            }
            else { // the default behaviour for show, and what always happens for hide, is to just set the visibility without getting clever.
                jpc.setVisible(visible)
            }
        }, endpointFunc)
    }

    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible (elId:string, changeEndpoints?:boolean) {
        let endpointFunc = null
        if (changeEndpoints) {
            endpointFunc = (ep:Endpoint) => {
                let state = ep.isVisible()
                ep.setVisible(!state)
            }
        }
        this._operation(elId,  (jpc:Connection) => {
            let state = jpc.isVisible()
            jpc.setVisible(!state)
        }, endpointFunc)
    }

    private _operation (elId:string, func:(c:Connection) => any, endpointFunc?:(e:Endpoint) => any) {
        let endpoints = this.endpointsByElement[elId]
        if (endpoints && endpoints.length) {
            for (let i = 0, ii = endpoints.length; i < ii; i++) {
                for (let j = 0, jj = endpoints[i].connections.length; j < jj; j++) {
                    let retVal = func(endpoints[i].connections[j])
                    // if the function passed in returns true, we exit.
                    // most functions return false.
                    if (retVal) {
                        return
                    }
                }
                if (endpointFunc) {
                    endpointFunc(endpoints[i])
                }
            }
        }
    }

    registerConnectionType(id:string, type:TypeDescriptor):void {
        this._connectionTypes[id] = extend({}, type)
        if (type.overlays) {
            let to:Dictionary<FullOverlaySpec> = {}
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = this.convertToFullOverlaySpec(type.overlays[i])
                to[fo[1].id] = fo
            }
            //this._connectionTypes[id].overlayMap = to
            this._connectionTypes[id].overlays = to as any
        }
    }

    registerConnectionTypes(types:Dictionary<TypeDescriptor>) {
        for (let i in types) {
            this.registerConnectionType(i, types[i])
        }
    }

    registerEndpointType(id:string, type:TypeDescriptor) {
        this._endpointTypes[id] = extend({}, type)
        if (type.overlays) {
            let to:Dictionary<FullOverlaySpec> = {}
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = this.convertToFullOverlaySpec(type.overlays[i])
                to[fo[1].id] = fo
            }
            this._endpointTypes[id].overlays = to as any
        }
    }

    registerEndpointTypes(types:Dictionary<TypeDescriptor>) {
        for (let i in types) {
            this.registerEndpointType(i, types[i])
        }
    }

    getType(id:string, typeDescriptor:string):TypeDescriptor {
        return typeDescriptor === "connection" ? this._connectionTypes[id] : this._endpointTypes[id]
    }

    importDefaults(d:jsPlumbDefaults):jsPlumbInstance {
        for (let i in d) {
            this.Defaults[i] = d[i]
        }
        if (d.container) {
            this.setContainer(d.container)
        }

        return this
    }

    restoreDefaults ():jsPlumbInstance {
        this.Defaults = extend({}, this._initialDefaults)
        return this
    }

    getManagedElements():Dictionary<ManagedElement> {
        return this._managedElements
    }

// ----------------------------- proxy connections -----------------------

    proxyConnection(connection:Connection, index:number,
                    proxyEl:any, proxyElId:string,
                    endpointGenerator:any, anchorGenerator:any) {

        let alreadyProxied = connection.proxies[index] != null,
            proxyEp,
            originalElementId = alreadyProxied ? connection.proxies[index].originalEp.elementId : connection.endpoints[index].elementId,
            originalEndpoint = alreadyProxied ? connection.proxies[index].originalEp : connection.endpoints[index]

        // if proxies exist for this end of the connection
        if(connection.proxies[index]) {
            // and the endpoint is for the element we're going to proxy to, just use it.
            if (connection.proxies[index].ep.elementId === proxyElId) {
                proxyEp = connection.proxies[index].ep
            } else {
                // otherwise detach that previous endpoint; it will delete itself
                connection.proxies[index].ep.detachFromConnection(connection, index)
                proxyEp = this.addEndpoint(proxyEl, {
                    endpoint:endpointGenerator(connection, index),
                    anchor:anchorGenerator(connection, index),
                    parameters:{
                        isProxyEndpoint:true
                    }
                })
            }
        }else {
            proxyEp = this.addEndpoint(proxyEl, {
                endpoint:endpointGenerator(connection, index),
                anchor:anchorGenerator(connection, index),
                parameters:{
                    isProxyEndpoint:true
                }
            })
        }
        proxyEp.deleteOnEmpty = true

        // for this index, stash proxy info: the new EP, the original EP.
        connection.proxies[index] = { ep:proxyEp, originalEp: originalEndpoint }

        // and advise the anchor manager
        this.sourceOrTargetChanged(originalElementId, proxyElId, connection, proxyEl, index)

        // detach the original EP from the connection, but mark as a transient detach.
        originalEndpoint.detachFromConnection(connection, null, true)

        // set the proxy as the new ep
        proxyEp.connections = [ connection ]
        connection.endpoints[index] = proxyEp

        originalEndpoint.setVisible(false)

        connection.setVisible(true)

        this.revalidate(proxyEl)
    }

    unproxyConnection(connection:Connection, index:number, proxyElId:string) {
        // if connection cleaned up, no proxies, or none for this end of the connection, abort.
        if (connection.proxies == null || connection.proxies[index] == null) {
            return
        }

        let originalElement = connection.proxies[index].originalEp.element,
            originalElementId = connection.proxies[index].originalEp.elementId

        connection.endpoints[index] = connection.proxies[index].originalEp

        this.sourceOrTargetChanged(proxyElId, originalElementId, connection, originalElement, index)

        // detach the proxy EP from the connection (which will cause it to be removed as we no longer need it)
        connection.proxies[index].ep.detachFromConnection(connection, null)

        connection.proxies[index].originalEp.addConnection(connection)
        if(connection.isVisible()) {
            connection.proxies[index].originalEp.setVisible(true)
        }

        // cleanup
        connection.proxies[index] = null

        // if both empty, set length to 0.
        if (connection.proxies.find(p => p != null) == null) {
            connection.proxies.length = 0
        }
    }

    sourceOrTargetChanged (originalId:string, newId:string, connection:any, newElement:any, index:number):void {
        if (index === 0) {
            if (originalId !== newId) {
                connection.sourceId = newId
                connection.source = newElement
                connection.updateConnectedClass()
            }
        } else if (index === 1) {
            connection.targetId = newId
            connection.target = newElement
            connection.updateConnectedClass()
        }
    }

// ------------------------ GROUPS --------------

    getGroup(id:string) { return this.groupManager.getGroup(id); }
    getGroupFor(el:any|string) { return this.groupManager.getGroupFor(el); }
    addGroup(params:any) { return this.groupManager.addGroup(params); }
    addToGroup(group:string | UIGroup, el:any | Array<any>, doNotFireEvent?:boolean) { return this.groupManager.addToGroup(group, el, doNotFireEvent); }

    collapseGroup (group:string | UIGroup) { this.groupManager.collapseGroup(group); }
    expandGroup (group:string | UIGroup) { this.groupManager.expandGroup(group); }
    toggleGroup (group:string | UIGroup) { this.groupManager.toggleGroup(group); }

    removeGroup(group:string | UIGroup, deleteMembers?:boolean, manipulateDOM?:boolean, doNotFireEvent?:boolean) {
        this.groupManager.removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent)
    }

    removeAllGroups(deleteMembers?:boolean, manipulateDOM?:boolean, doNotFireEvent?:boolean) {
        this.groupManager.removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent)
    }
    removeFromGroup (group:string | UIGroup, el:any, doNotFireEvent?:boolean):void {
        this.groupManager.removeFromGroup(group, el, doNotFireEvent)
        this.appendElement(el, this.getContainer())
    }

}

import {jsPlumbDefaults} from "./defaults"

import {Connection} from "./connector/connection-impl"
import {Endpoint, EndpointSpec} from "./endpoint/endpoint"
import { DotEndpoint } from './endpoint/dot-endpoint'
import {FullOverlaySpec, OverlaySpec} from "./overlay/overlay"
import {AnchorPlacement, RedrawResult} from "./router/router"
import {
    _mergeOverrides,
    findWithFunction,
    functionChain,
    isString,
    log,
    removeWithFunction, rotatePoint,
    uuid,
    extend,
    filterList, addToDictionary, forEach, RotatedPointXY
} from "./util"

import {
    Dictionary,
    UpdateOffsetOptions,
    Offset,
    Size,
    jsPlumbElement,
    PointArray,
    ConnectParams,  // <--
    SourceDefinition,
    TargetDefinition,
    SourceOrTargetDefinition,
    BehaviouralTypeDescriptor,  // <--
    InternalConnectParams,
    TypeDescriptor,
    Rotation, Rotations, PointXY, ConnectionMovedParams
} from './common'

import { EventGenerator } from "./event-generator"
import * as Constants from "./constants"
import {EndpointOptions, InternalEndpointOptions} from "./endpoint/endpoint"
import {AddGroupOptions, GroupManager} from "./group/group-manager"
import {UIGroup} from "./group/group"

import {DefaultRouter} from "./router/default-router"
import {Router} from "./router/router"
import {EndpointSelection} from "./selection/endpoint-selection"
import {ConnectionSelection} from "./selection/connection-selection"
import {Viewport, ViewportElement} from "./viewport"

import { Component } from './component/component'
import { Segment } from './connector/abstract-segment'
import { Overlay } from './overlay/overlay'
import { LabelOverlay } from './overlay/label-overlay'
import { AbstractConnector } from './connector/abstract-connector'
import { Bezier } from './connector/bezier-connector'
import { OverlayCapableComponent } from './component/overlay-capable-component'
import { PaintStyle} from './styles'
import {AnchorComputeParams, AnchorSpec, AnchorLocations } from "./factory/anchor-factory"

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

export type ElementSelectionSpecifier<E> = E | Array<E> | '*'
export type SelectionList = '*' | Array<string>

export interface AbstractSelectOptions<E> {
    scope?:SelectionList
    source?:ElementSelectionSpecifier<E>
    target?:ElementSelectionSpecifier<E>
}
export interface SelectOptions<E> extends AbstractSelectOptions<E> {
    connections?:Array<Connection>
}

export interface SelectEndpointOptions<E> extends AbstractSelectOptions<E> {
    element?:ElementSelectionSpecifier<E>
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
     * If false, an event won't be fired. Otherwise a `connection:detach` event will be fired.
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

function prepareList(instance:JsPlumbInstance, input:any, doNotGetIds?:boolean):any {
    let r = []
    const _resolveId = (i:any) => {
        if (isString(i)) {
            return i
        } else {
            return instance.getId(i)
        }
    };

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
                    r.push(...[...input].map(_resolveId))
                }
                else {
                    r.push(_resolveId(input))
                }
            }
        }
    }

    return r
}

export type ManagedElement<E> = {
    el:jsPlumbElement<E>,
    viewportElement?:ViewportElement<E>,
    endpoints?:Array<Endpoint>,
    connections?:Array<Connection>,
    rotation?:number,
    group?:string
}

const ID_ATTRIBUTE = Constants.JTK_ID

export abstract class JsPlumbInstance<T extends { E:unknown } = any> extends EventGenerator {

    Defaults:jsPlumbDefaults<T["E"]>
    private _initialDefaults:jsPlumbDefaults<T["E"]> = {}

    isConnectionBeingDragged:boolean = false
    currentlyDragging:boolean = false
    hoverSuspended:boolean = false
    _suspendDrawing:boolean = false
    _suspendedAt:string = null

    connectorClass = "jtk-connector"
    connectorOutlineClass = "jtk-connector-outline"
    connectedClass = "jtk-connected"
    endpointClass = "jtk-endpoint"
    endpointConnectedClass = "jtk-endpoint-connected"
    endpointFullClass = "jtk-endpoint-full"
    endpointDropAllowedClass = "jtk-endpoint-drop-allowed"
    endpointDropForbiddenClass = "jtk-endpoint-drop-forbidden"
    endpointAnchorClassPrefix = "jtk-endpoint-anchor"
    overlayClass = "jtk-overlay"

    readonly connections:Array<Connection> = []
    endpointsByElement:Dictionary<Array<Endpoint>> = {}
    private readonly endpointsByUUID:Map<string, Endpoint> = new Map()

    public allowNestedGroups:boolean

    private _curIdStamp :number = 1
    readonly viewport:Viewport<T> = new Viewport(this)

    readonly router: Router<T>
    readonly groupManager:GroupManager<T["E"]>

    private _connectionTypes:Map<string, TypeDescriptor> = new Map()
    private _endpointTypes:Map<string, TypeDescriptor> = new Map()
    private _container:any

    protected _managedElements:Dictionary<ManagedElement<T["E"]>> = {}

    private DEFAULT_SCOPE:string
    get defaultScope() { return this.DEFAULT_SCOPE }

    private _zoom:number = 1
    get currentZoom() { return  this._zoom }

    constructor(public readonly _instanceIndex:number, defaults?:jsPlumbDefaults<T["E"]>) {

        super()

        this.Defaults = {
            anchor: AnchorLocations.Bottom,
            anchors: [ null, null ],
            connectionsDetachable: true,
            connectionOverlays: [ ],
            connector: Bezier.type,
            container: null,
            endpoint: DotEndpoint.type,
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

        this.groupManager = new GroupManager(this)

        this.setContainer(this._initialDefaults.container)
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

    _idstamp ():string {
        return "" + this._curIdStamp++
    }

    convertToFullOverlaySpec(spec:string | OverlaySpec):FullOverlaySpec {
        let o:FullOverlaySpec = null
        if (isString(spec)) {
            o = { type:spec as string, options:{ } }
        } else {
            o = spec as FullOverlaySpec
        }
        o.options.id = o.options.id || uuid()
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

    getId (element:T["E"], uuid?:string):string {

        if (element == null) {
            return null
        }

        let id:string = this.getAttribute(element, ID_ATTRIBUTE)
        if (!id || id === "undefined") {
            // check if fixed uuid parameter is given
            if (arguments.length === 2 && arguments[1] !== undefined) {
                id = uuid
            }
            else if (arguments.length === 1 || (arguments.length === 3 && !arguments[2])) {
                id = "jsplumb-" + this._instanceIndex + "-" + this._idstamp()
            }

            this.setAttribute(element, ID_ATTRIBUTE, id)
        }
        return id
    }

// ------------------  element selection ------------------------

    getConnections(options?:SelectOptions<T["E"]>, flat?:boolean):Dictionary<Connection> | Array<Connection> {
        if (!options) {
            options = {}
        } else if (options.constructor === String) {
            options = { "scope": options } as SelectOptions<T>
        }
        let scope = options.scope || this.defaultScope,
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

    select (params?:SelectOptions<T["E"]>):ConnectionSelection {
        params = params || {}
        params.scope = params.scope || "*"
        return new ConnectionSelection(this, params.connections || (this.getConnections(params, true) as Array<Connection>))
    }

    selectEndpoints(params?:SelectEndpointOptions<T["E"]>):EndpointSelection {
        params = params || {}
        params.scope = params.scope || Constants.WILDCARD

        let noElementFilters = !params.element && !params.source && !params.target,
            elements = noElementFilters ? Constants.WILDCARD : prepareList(this, params.element),
            sources = noElementFilters ? Constants.WILDCARD : prepareList(this, params.source),
            targets = noElementFilters ? Constants.WILDCARD : prepareList(this, params.target),

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

    setContainer(c:T["E"]):void {
        this._container = c
        this.fire(Constants.EVENT_CONTAINER_CHANGE, this._container)
    }

    private _set (c:Connection, el:T["E"]|Endpoint, idx:number):ConnectionMovedParams {

        const stTypes = [
            { el: "source", elId: "sourceId", epDefs: Constants.SOURCE_DEFINITION_LIST },
            { el: "target", elId: "targetId", epDefs: Constants.TARGET_DEFINITION_LIST }
        ]

        let ep,
            _st = stTypes[idx],
            cId = c[_st.elId],
            sid, sep,
            oldEndpoint = c.endpoints[idx]

        let evtParams:ConnectionMovedParams = {
            index: idx,
            originalEndpoint:oldEndpoint,
            originalSourceId: idx === 0 ? cId : c.sourceId,
            newSourceId: c.sourceId,
            originalTargetId: idx === 1 ? cId : c.targetId,
            newTargetId: c.targetId,
            connection: c,
            newEndpoint:oldEndpoint
        }

        if (el instanceof Endpoint) {
            ep = el;
            (<Endpoint>ep).addConnection(c)
            el = (<Endpoint>ep).element as unknown as Element
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
            evtParams.newEndpoint = ep
            oldEndpoint.detachFromConnection(c)
            c.endpoints[idx] = ep
            c[_st.el] = ep.element
            c[_st.elId] = ep.elementId
            evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId

            this.fireMoveEvent(evtParams)

            this.paintConnection(c)
        }

        return evtParams

    }

    setSource (connection:Connection, el:T["E"] | Endpoint):void {
        let p = this._set(connection, el, 0)
        Connection.updateConnectedClass(this, connection, p.originalEndpoint.element, true)
        this.sourceOrTargetChanged(p.originalSourceId, p.newSourceId, connection, p.newEndpoint.element, 0)
    }

    setTarget (connection:Connection, el:T["E"] | Endpoint):void {
        let p = this._set(connection, el, 1)
        Connection.updateConnectedClass(this, connection, p.originalEndpoint.element, true)
        connection.updateConnectedClass(false)
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
        fn()
        if (!_wasSuspended) {
            this.setSuspendDrawing(false, !doNotRepaintAfterwards)
        }
    }

    /**
     * Execute the given function for each of the given elements.
     * @param spec An Element, or an element id, or an array of elements/element ids.
     * @param fn The function to run on each element.
     */
    each(spec:T["E"] | Array<T["E"]>, fn:(e:T["E"]) => any):JsPlumbInstance {
        if (spec == null) {
            return
        }
        if ((<any>spec).length != null) {
            for (let i = 0; i < (<Array<any>>spec).length; i++) {
                fn(spec[i])
            }
        }
        else {
            fn(spec as T["E"])
        } // assume it's an element.

        return this
    }

    /**
     * Update the cached offset information for some element.
     * @param params
     * @return an UpdateOffsetResult containing the offset information for the given element.
     */
    updateOffset(params?:UpdateOffsetOptions):ViewportElement<T["E"]> {

        let elId = params.elId

        // if forced repaint, or no new offset provided, we recalculate the size + offset, then store on the viewport.
        // Here we would prefer to tell the viewport to recalculate size/offset, using whatever functions were made available to it.
        // abstracting out the size/offset to the viewport allows us to do things like a viewport with fixed size elements, and
        // to integrate with the Toolkit's layout for offsets (the Toolkit will write the offsets and the community edition
        // will not need to read from the DOM)
        if (params.recalc) {
            return this.viewport.refreshElement(elId)
        } else {
            return this.viewport.getPosition(elId)
        }
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
                    [ this, Constants.CHECK_CONDITION, [ Constants.INTERCEPT_BEFORE_DETACH, connection ] ]
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

    deleteConnectionsForElement(el:T["E"], params?:DeleteConnectionOptions):JsPlumbInstance {
        params = params || {}
        let id = this.getId(el), endpoints = this.endpointsByElement[id]
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
    }

    fireMoveEvent (params?:ConnectionMovedParams, evt?:Event):void {
        this.fire<ConnectionMovedParams>(Constants.EVENT_CONNECTION_MOVED, params, evt)
    }

    /**
     * Manage a group of elements.
     * @param elements Array-like object of strings or elements.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manageAll (elements:Array<Element>, recalc?:boolean):void {
        for (let i = 0; i < elements.length; i++) {
            this.manage(elements[i], null, recalc)
        }
    }

    /**
     * Manage an element.
     * @param element String, or element.
     * @param internalId Optional ID for jsPlumb to use internally.
     * @param recalc Maybe recalculate offsets for the element also.
     */
    manage (element:T["E"], internalId?:string, recalc?:boolean):ManagedElement<T["E"]> {

        if (this.getAttribute(element, ID_ATTRIBUTE) == null) {
            internalId = internalId || uuid()
            this.setAttribute(element, ID_ATTRIBUTE, internalId)
        }

        const elId = this.getId(element)

        if (!this._managedElements[elId]) {

            this.setAttribute(element, Constants.ATTRIBUTE_MANAGED, "")

            this._managedElements[elId] = {
                el:element as unknown as jsPlumbElement<T["E"]>,
                endpoints:[],
                connections:[],
                rotation:0
            }

            if (this._suspendDrawing) {
                this._managedElements[elId].viewportElement = this.viewport.registerElement(elId)

            } else {
                this._managedElements[elId].viewportElement = this.updateOffset({elId: elId, recalc:true})
            }

            this.fire<{el:T["E"]}>(Constants.EVENT_MANAGE_ELEMENT, {el:element})

        } else {
            if (recalc) {
                this._managedElements[elId].viewportElement = this.updateOffset({elId: elId, timestamp: null,  recalc:true })
            }
        }

        return this._managedElements[elId]
    }

    /**
     * Stops managing the given element.
     * @param el Element, or ID of the element to stop managing.
     * @param removeElement If true, also remove the element from the renderer.
     */
    unmanage (el:T["E"], removeElement?:boolean):void {

        let affectedElements:Array<T["E"]> = []

        this.removeAllEndpoints(el, true, affectedElements)

        let _one = (_el:T["E"]) => {

            let id = this.getId(_el)

            if (this.isSource(_el)) {
                this.unmakeSource(_el)
            }
            if (this.isTarget(_el)) {
                this.unmakeTarget(_el)
            }

            this.removeAttribute(_el, ID_ATTRIBUTE)
            this.removeAttribute(_el, Constants.ATTRIBUTE_MANAGED)
            delete this._managedElements[id]

            this.viewport.remove(id)

            this.fire<{el:T["E"]}>(Constants.EVENT_UNMANAGE_ELEMENT, {el:_el})

            if (_el && removeElement) {
                this.removeElement(_el)
            }
        }

        // remove all affected child elements
        for (let ae = 1; ae < affectedElements.length; ae++) {
            _one(affectedElements[ae])
        }

        // and always remove the requested one from the renderer.
        _one(el)
    }

    rotate(element:T["E"], rotation:number, doNotRepaint?:boolean):RedrawResult {
        const elementId = this.getId(element)
        if (this._managedElements[elementId]) {
            this._managedElements[elementId].rotation = rotation
            this.viewport.rotateElement(elementId, rotation)
            if (doNotRepaint !== true) {
                return this.revalidate(element)
            }
        }

        return { c:new Set(), e:new Set() }
    }

    getRotation(elementId:string):number {
        const entry = this._managedElements[elementId]
        if (entry != null) {
            return  entry.rotation || 0
        } else {
            return 0
        }
    }

    getRotations(elementId:string):Rotations {
        const rotations:Array<Rotation> = []
        const entry = this._managedElements[elementId]

        const _oneLevel = (e:ManagedElement<T["E"]>) => {
            if (e.group != null) {
                const gEntry = this._managedElements[e.group]
                if (gEntry != null) {
                    rotations.push({r:gEntry.viewportElement.r, c:gEntry.viewportElement.c})
                    _oneLevel(gEntry)
                }
            }
        }

        if (entry != null) {
            rotations.push({ r:entry.viewportElement.r || 0, c:entry.viewportElement.c })
            _oneLevel(entry)
        }

        return rotations
    }

    applyRotations(point:[number, number, number, number], rotations:Rotations) {
        const sl = point.slice()
        let current:RotatedPointXY = {x:sl[0], y:sl[1], cr:0, sr:0}
        forEach(rotations,(rotation) => {
            current = rotatePoint(current, rotation.c, rotation.r)
        })
        return current
    }

    applyRotationsXY(point:PointXY, rotations:Rotations) {
        forEach(rotations, (rotation) => {
            point = rotatePoint(point, rotation.c, rotation.r)
        })
        return point
    }

    /**
     * Internal method to create an Endpoint from the given options, perhaps with the given id. Do not use this method
     * as a consumer of the API. If you wish to add an Endpoint to some element, use `addEndpoint` instead.
     * @param params Options for the Endpoint.
     * @param id Optional ID for the Endpoint.
     */
    newEndpoint(params:EndpointOptions<T["E"]>, id?:string):Endpoint {
        let _p:InternalEndpointOptions<T["E"]> = extend({}, params)
        _p.elementId = id || this.getId(_p.source)

        let ep = new Endpoint(this, _p)
        ep.id = "ep_" + this._idstamp()
        this.manage(_p.source)
        if (params.uuid) {
            this.endpointsByUUID.set(params.uuid, ep)
        }

        return ep
    }

    deriveEndpointAndAnchorSpec(type:string, dontPrependDefault?:boolean):{endpoints:[EndpointSpec, EndpointSpec], anchors:[AnchorSpec, AnchorSpec]} {

        let bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/),
            eps = null,
            ep = null,
            a:AnchorSpec = null,
            as = null

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

    revalidate (el:T["E"], timestamp?:string):RedrawResult {
        let elId = this.getId(el)
        this.updateOffset({ elId: elId, recalc: true, timestamp:timestamp })
        return this._draw(el)
    }

    // repaint every endpoint and connection.
    repaintEverything ():JsPlumbInstance {
        let timestamp = uuid(), elId:string

        for (elId in this.endpointsByElement) {
            this.viewport.refreshElement(elId)
        }

        for (elId in this.endpointsByElement) {
            this._draw(this._managedElements[elId].el, null, timestamp, true)
        }

        return this
    }

    /**
     * Sets the position of the given element to be [x,y].
     * @param el Element to set the position for
     * @param x Position in X axis
     * @param y Position in Y axis
     * @return The result of the redraw operation that follows the update of the viewport.
     */
    setElementPosition(el:T["E"], x:number, y:number):RedrawResult {
        const id = this.getId(el)
        this.viewport.setPosition(id, x, y)
        return this._draw(el)
    }

    /**
     * Repaints all connections and endpoints associated with the given element.
     * @param el
     */
    repaint(el:T["E"]) {
        this._draw(el)
    }

    private _draw(el:T["E"], ui?:any, timestamp?:string, offsetsWereJustCalculated?:boolean):RedrawResult {

        let r:RedrawResult = {
            c:new Set<Connection>(),
            e:new Set<Endpoint>()
        }

        const _mergeRedraw = (r2:RedrawResult) => {
            // merge in r2 to r
            r2.c.forEach((c) => r.c.add(c))
            r2.e.forEach((e) => r.e.add(e))
        }

        if (!this._suspendDrawing) {

            const id = this.getId(el)

            if (el != null) {
                let repaintEls = this._getAssociatedElements(el),
                    repaintOffsets:Array<ViewportElement<T["E"]>> = []

                if (timestamp == null) {
                    timestamp = uuid()
                }

                if (!offsetsWereJustCalculated) {
                    // update the offset of everything _before_ we try to draw anything.

                    for (let i = 0; i < repaintEls.length; i++) {
                        repaintOffsets.push(this.updateOffset({
                            elId: this.getId(repaintEls[i]),
                            recalc: true,
                            timestamp: timestamp
                        }))
                    }
                } else {
                    for (let i = 0; i < repaintEls.length; i++) {
                        const reId = this.getId(repaintEls[i])
                        repaintOffsets.push(this.viewport.getPosition(reId))
                    }
                }

                _mergeRedraw(this.router.redraw(id, ui, timestamp, null))

                if (repaintEls.length > 0) {
                    for (let j = 0; j < repaintEls.length; j++) {
                        _mergeRedraw(this.router.redraw(this.getId(repaintEls[j]), repaintOffsets[j], timestamp, null))
                    }
                }
            }
        }

        return r
    }

    unregisterEndpoint(endpoint:Endpoint) {
        const uuid = endpoint.getUuid()
        if (uuid) {
            this.endpointsByUUID.delete(uuid)
        }

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

        this.fire(Constants.EVENT_INTERNAL_ENDPOINT_UNREGISTERED, endpoint)
    }

    maybePruneEndpoint(endpoint:Endpoint):boolean {
        if (endpoint.deleteOnEmpty && endpoint.connections.length === 0) {
            this.deleteEndpoint(endpoint)
            return true
        } else {
            return false
        }
    }

    deleteEndpoint(object:string | Endpoint):JsPlumbInstance {
        let endpoint = (typeof object === "string") ? this.endpointsByUUID.get(object as string) : object as Endpoint
        if (endpoint) {

            // find all connections for the endpoint
            const connectionsToDelete = endpoint.connections.slice()
            forEach(connectionsToDelete,(connection) => {
                // detach this endpoint from each of these connections.
                endpoint.detachFromConnection(connection, null, true)
            })

            // delete the endpoint
            this.unregisterEndpoint(endpoint)
            endpoint.destroy(true)

            // then delete the connections. each of these connections only has one endpoint at the moment
            forEach(connectionsToDelete,(connection) => {
                // detach this endpoint from each of these connections.
                this.deleteConnection(connection, {force:true, endpointToIgnore:endpoint})
            })
        }
        return this
    }

    /**
     * Add an Endpoint to the given element.
     * @param el Element to add the endpoint to.
     * @param params
     * @param referenceParams
     */
    addEndpoint(el:T["E"], params?:EndpointOptions<T["E"]>, referenceParams?:EndpointOptions<T["E"]>):Endpoint{
        referenceParams = referenceParams || {} as EndpointOptions<T["E"]>
        let p:EndpointOptions<T["E"]> = extend({}, referenceParams)
        extend(p, params || {})
        p.endpoint = p.endpoint || this.Defaults.endpoint
        p.paintStyle = p.paintStyle || this.Defaults.endpointStyle
        let _p:EndpointOptions<T["E"]> = extend({source:el}, p)
        let id = this.getId(_p.source)
        this.manage(el, null, !this._suspendDrawing)
        let e = this.newEndpoint(_p, id)

        addToDictionary(this.endpointsByElement, id, e)

        if (!this._suspendDrawing) {

            this.paintEndpoint(e, {
                timestamp: this._suspendedAt
            })
        }

        return e
    }

    /**
     * Add a set of Endpoints to an element
     * @param el Element to add the Endpoints to.
     * @param endpoints Array of endpoint options.
     * @param referenceParams
     */
    addEndpoints(el:T["E"], endpoints:Array<EndpointOptions<T["E"]>>, referenceParams?:any):Array<Endpoint> {
        let results:Array<Endpoint> = []
        for (let i = 0, j = endpoints.length; i < j; i++) {
            results.push(this.addEndpoint(el, endpoints[i], referenceParams))
        }
        return results
    }

    /**
     * Clears all endpoints and connections from the instance of jsplumb. Does not also clear out event listeners - for that,
     * use `destroy()`.
     */
    reset ():void {
        this.silently(() => {
            this.endpointsByElement = {}
            this._managedElements = {}
            this.endpointsByUUID.clear()
            this.viewport.reset()
            this.router.reset()
            this.groupManager.reset()
            this._connectionTypes.clear()
            this._endpointTypes.clear()
            this.connections.length = 0
        })
    }

// ---------------------------------------------------------------------------------

    /**
     * Clears the instance and unbinds any listeners on the instance. After you call this method you cannot use this
     * instance of jsPlumb again.
     */
    destroy():void {
        this.reset()
        this.unbind()
    }

    getEndpoints(el:T["E"]):Array<Endpoint> {
        return this.endpointsByElement[this.getId(el)] || []
    }

    getEndpoint(id:string):Endpoint {
        return this.endpointsByUUID.get(id)
    }

    /**
     * Connect one element to another.
     * @param params At the very least you need to supply {source:.., target:...}.
     * @param referenceParams Optional extra parameters. This can be useful when you're creating multiple connections that have some things in common.
     */
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

    private _prepareConnectionParams(params:ConnectParams, referenceParams?:ConnectParams):InternalConnectParams<T["E"]> {

        let _p:InternalConnectParams<T["E"]> = extend({ }, params)
        if (referenceParams) {
            extend(_p, referenceParams)
        }

        // wire endpoints passed as source or target to sourceEndpoint/targetEndpoint, respectively.
        if (_p.source) {
            if ((_p.source as Endpoint).endpoint) {
                _p.sourceEndpoint = (_p.source as Endpoint)
            }
        }
        if (_p.target) {
            if ((_p.target as Endpoint).endpoint) {
                _p.targetEndpoint = (_p.target as Endpoint)
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
                            return (d.def.connectionType == null || d.def.connectionType === matchType) && (d.def.portId == null || d.def.portId == portId)
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
        this.paintConnection(c)
        return c
    }

    //
    // adds the connection to the backing model, fires an event if necessary and then redraws
    //
    _finaliseConnection(jpc:Connection, params?:any, originalEvent?:Event):void {

        params = params || {}
        // add to list of connections (by scope).
        if (!jpc.suspendedEndpoint) {
            this.connections.push(jpc)
        }

        jpc.pending = null

        // turn off isTemporarySource on the source endpoint (only viable on first draw)
        jpc.endpoints[0].isTemporarySource = false


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

    removeAllEndpoints(el:T["E"], recurse?:boolean, affectedElements?:Array<T["E"]>):JsPlumbInstance {
        affectedElements = affectedElements || []
        let _one = (_el:T["E"]) => {
            let id = this.getId(_el),
                ebe = this.endpointsByElement[id],
                i, ii

            if (ebe) {
                affectedElements.push(_el)
                for (i = 0, ii = ebe.length; i < ii; i++) {
                    this.deleteEndpoint(ebe[i])
                }
            }
            delete this.endpointsByElement[id]

            if (recurse) {
                this.getChildElements(_el).map(_one)
            }

        }
        _one(el)
        return this
    }

    private _setEnabled (type:string, el:T["E"], state:boolean, toggle?:boolean, connectionType?:string):any {
        let originalState:Array<any> = [], newState, os
        let jel = el as unknown as jsPlumbElement<T["E"]>

        connectionType = connectionType || Constants.DEFAULT

        let defs = type === Constants.SOURCE ? jel._jsPlumbSourceDefinitions : jel._jsPlumbTargetDefinitions
        if (defs) {
            forEach(defs,(def: SourceOrTargetDefinition) => {
                if (def.def.connectionType == null || def.def.connectionType === connectionType) {
                    os = def.enabled
                    originalState.push(os)
                    newState = toggle ? !os : state
                    def.enabled = newState
                    const cls = ["jtk", type, "disabled"].join("-")
                    if (newState) {
                        this.removeClass(el, cls)
                    } else {
                        this.addClass(el, cls)
                    }
                }
            })
        }

        return originalState.length > 1 ? originalState : originalState[0]

    }

    toggleSourceEnabled (el:T["E"], connectionType?:string):any {
        this._setEnabled(Constants.SOURCE, el, null, true, connectionType)
        return this.isSourceEnabled(el, connectionType)
    }

    setSourceEnabled (el:T["E"], state:boolean, connectionType?:string):any {
        return this._setEnabled(Constants.SOURCE, el, state, null, connectionType)
    }

    findFirstSourceDefinition(el:T["E"], connectionType?:string):SourceDefinition {
        return this.findFirstDefinition(Constants.SOURCE_DEFINITION_LIST, el, connectionType)
    }

    findFirstTargetDefinition(el:T["E"], connectionType?:string):TargetDefinition {
        return this.findFirstDefinition(Constants.TARGET_DEFINITION_LIST, el, connectionType)
    }

    private findFirstDefinition<D>(key:string, el:T["E"], connectionType?:string):D {
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

    /**
     * Returns whether or not the given element is configured as a connection source.
     * @param el
     * @param connectionType
     */
    isSource (el:T["E"], connectionType?:string):boolean {
        return this.findFirstSourceDefinition(el, connectionType) != null
    }

    /**
     * Returns whether or not the given element is configured as a connection source and that it is currently enabled.
     * @param el
     * @param connectionType
     */
    isSourceEnabled (el:T["E"], connectionType?:string):boolean {
        let def = this.findFirstSourceDefinition(el, connectionType)
        return def != null && def.enabled !== false
    }

    toggleTargetEnabled(el:T["E"], connectionType?:string):boolean {
        this._setEnabled(Constants.TARGET, el, null, true, connectionType)
        return this.isTargetEnabled(el, connectionType)
    }

    isTarget(el:T["E"], connectionType?:string):boolean {
        return this.findFirstTargetDefinition(el, connectionType) != null
    }

    isTargetEnabled (el:T["E"], connectionType?:string):boolean {
        let def = this.findFirstTargetDefinition(el, connectionType)
        return def != null && def.enabled !== false
    }

    setTargetEnabled(el:T["E"], state:boolean, connectionType?:string):boolean {
        return this._setEnabled(Constants.TARGET, el, state, null, connectionType)
    }

    private _unmake (type:string, key:string, el:T["E"], connectionType?:string) {

        connectionType = connectionType || "*"

        if (el[key]) {
            if (connectionType === "*") {
                delete el[key]
                this.removeAttribute(el, "jtk-" + type)
            } else {
                let t: Array<any> = []
                forEach(el[key], (def: any) => {
                    if (connectionType !== def.def.connectionType) {
                        t.push(def)
                    }
                })

                if (t.length > 0) {
                    el[key] = t
                } else {
                    delete el[key]
                    this.removeAttribute(el, "jtk-" + type)
                }
            }
        }
    }

    private _unmakeEvery (type:string, key:string, connectionType?:string) {
        let els = this.getSelector("[jtk-" + type + "]")
        for (let i = 0; i < els.length; i++) {
            this._unmake(type, key, els[i], connectionType)
        }
    }

    // see api docs
    unmakeTarget (el:T["E"], connectionType?:string) {
        return this._unmake(Constants.TARGET, Constants.TARGET_DEFINITION_LIST, el, connectionType)
    }

    // see api docs
    unmakeSource (el:T["E"], connectionType?:string) {
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

    private _writeScopeAttribute (el:T["E"], scope:string):void {
        let scopes = scope.split(/\s/)
        for (let i = 0; i < scopes.length; i++) {
            this.setAttribute(el, Constants.SCOPE_PREFIX + scopes[i], "")
        }
    }

    makeSource(el:jsPlumbElement<T["E"]>, params?:BehaviouralTypeDescriptor, referenceParams?:any):JsPlumbInstance {
        let p = extend({_jsPlumb: this}, referenceParams)
        extend(p, params)
        p.connectionType = p.connectionType || Constants.DEFAULT
        let aae = this.deriveEndpointAndAnchorSpec(p.connectionType)
        p.endpoint = p.endpoint || aae.endpoints[0]
        p.anchor = p.anchor || aae.anchors[0]
        let maxConnections = p.maxConnections || -1

        this.manage(el)
        this.setAttribute(el, Constants.ATTRIBUTE_SOURCE, "")
        this._writeScopeAttribute(el, (p.scope || this.Defaults.scope))
        this.setAttribute(el, [ Constants.ATTRIBUTE_SOURCE, p.connectionType].join("-"), "")

        el._jsPlumbSourceDefinitions = el._jsPlumbSourceDefinitions || []

        let _def:SourceDefinition = {
            def:extend({}, p),
            uniqueEndpoint: p.uniqueEndpoint,
            maxConnections: maxConnections,
            enabled: true,
            endpoint:null as Endpoint
        }

        if (p.createEndpoint) {
            _def.uniqueEndpoint = true
            _def.endpoint = this.addEndpoint(el, _def.def)
            _def.endpoint.deleteOnEmpty = false
        }

        el._jsPlumbSourceDefinitions.push(_def)

        return this
    }

    private _getScope(el:T["E"], defKey:string):string {
        if (el[defKey] && el[defKey].length > 0) {
            return el[defKey][0].def.scope
        } else {
            return null
        }
    }

    getSourceScope(el:T["E"]):string {
        return this._getScope(el, Constants.SOURCE_DEFINITION_LIST)
    }

    getTargetScope(el:T["E"]):string {
        return this._getScope(el, Constants.TARGET_DEFINITION_LIST)
    }

    getScope(el:T["E"]):string {
        return this.getSourceScope(el) || this.getTargetScope(el)
    }

    private _setScope(el:T["E"], scope:string, defKey:string):void {
        if (el[defKey]) {
            forEach(el[defKey], (def:any) => def.def.scope = scope)
        }
    }

    setSourceScope(el:T["E"], scope:string):void {
        this._setScope(el, scope, Constants.SOURCE_DEFINITION_LIST)
    }

    setTargetScope(el:T["E"], scope:string):void {
        this._setScope(el, scope, Constants.TARGET_DEFINITION_LIST)
    }

    setScope(el:T["E"], scope:string):void {
        this._setScope(el, scope, Constants.SOURCE_DEFINITION_LIST)
        this._setScope(el, scope, Constants.TARGET_DEFINITION_LIST)
    }

    /**
     * Make the given element a connection target.
     * @param el
     * @param params
     * @param referenceParams
     */
    makeTarget (el:T["E"], params:BehaviouralTypeDescriptor, referenceParams?:any):JsPlumbInstance {

        let jel = el as unknown as jsPlumbElement<T["E"]>
        // put jsplumb ref into params without altering the params passed in
        let p = extend({_jsPlumb: this}, referenceParams)
        extend(p, params)
        p.connectionType  = p.connectionType || Constants.DEFAULT

        let maxConnections = p.maxConnections || -1;//,

        let dropOptions = extend({}, p.dropOptions || {})

        this.manage(el)
        this.setAttribute(el, Constants.ATTRIBUTE_TARGET, "")
        this._writeScopeAttribute(el, (p.scope || this.Defaults.scope))
        this.setAttribute(el, [Constants.ATTRIBUTE_TARGET, p.connectionType].join("-"), "")

        jel._jsPlumbTargetDefinitions = jel._jsPlumbTargetDefinitions || []

        // if this is a group and the user has not mandated a rank, set to -1 so that Nodes takes
        // precedence.
        if (jel._jsPlumbGroup && dropOptions.rank == null) {
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
            _def.endpoint = this.addEndpoint(el, _def.def)
            _def.endpoint.deleteOnEmpty = false
        }

        jel._jsPlumbTargetDefinitions.push(_def)

        return this
    }

    show (el:T["E"], changeEndpoints?:boolean):JsPlumbInstance {
        return this._setVisible(el, Constants.BLOCK, changeEndpoints)
    }

    hide (el:T["E"], changeEndpoints?:boolean):JsPlumbInstance {
        return this._setVisible(el, Constants.NONE, changeEndpoints)
    }

    private _setVisible (el:T["E"], state:string, alsoChangeEndpoints?:boolean) {
        let visible = state === Constants.BLOCK
        let endpointFunc = null
        if (alsoChangeEndpoints) {
            endpointFunc = (ep:Endpoint) => {
                ep.setVisible(visible, true, true)
            }
        }
        let id = this.getId(el)
        this._operation(el, (jpc:Connection) => {
            if (visible && alsoChangeEndpoints) {
                // this test is necessary because this functionality is new, and i wanted to maintain backwards compatibility.
                // this block will only set a connection to be visible if the other endpoint in the connection is also visible.
                let oidx = jpc.sourceId === id ? 1 : 0
                if (jpc.endpoints[oidx].isVisible()) {
                    jpc.setVisible(true)
                }
            }
            else { // the default behaviour for show, and what always happens for hide, is to just set the visibility without getting clever.
                jpc.setVisible(visible)
            }
        }, endpointFunc)

        return this
    }

    /**
     * private method to do the business of toggling hiding/showing.
     */
    toggleVisible (el:T["E"], changeEndpoints?:boolean) {
        let endpointFunc = null
        if (changeEndpoints) {
            endpointFunc = (ep:Endpoint) => {
                let state = ep.isVisible()
                ep.setVisible(!state)
            }
        }
        this._operation(el,  (jpc:Connection) => {
            let state = jpc.isVisible()
            jpc.setVisible(!state)
        }, endpointFunc)
    }

    private _operation (el:T["E"], func:(c:Connection) => any, endpointFunc?:(e:Endpoint) => any) {
        let elId = this.getId(el)
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
        this._connectionTypes.set(id, extend({}, type))
        if (type.overlays) {
            let to:Dictionary<FullOverlaySpec> = {}
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = this.convertToFullOverlaySpec(type.overlays[i])
                to[fo.options.id] = fo
            }
            this._connectionTypes.get(id).overlays = to as any
        }
    }

    registerConnectionTypes(types:Dictionary<TypeDescriptor>) {
        for (let i in types) {
            this.registerConnectionType(i, types[i])
        }
    }

    registerEndpointType(id:string, type:TypeDescriptor) {
        this._endpointTypes.set(id, extend({}, type))
        if (type.overlays) {
            let to:Dictionary<FullOverlaySpec> = {}
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = this.convertToFullOverlaySpec(type.overlays[i])
                to[fo.options.id] = fo
            }
            this._endpointTypes.get(id).overlays = to as any
        }
    }

    registerEndpointTypes(types:Dictionary<TypeDescriptor>) {
        for (let i in types) {
            this.registerEndpointType(i, types[i])
        }
    }

    getType(id:string, typeDescriptor:string):TypeDescriptor {
        return typeDescriptor === "connection" ? this._connectionTypes.get(id) : this._endpointTypes.get(id)
    }

    importDefaults(d:jsPlumbDefaults<T["E"]>):JsPlumbInstance {
        for (let i in d) {
            this.Defaults[i] = d[i]
        }
        if (d.container) {
            this.setContainer(d.container)
        }

        return this
    }

    restoreDefaults ():JsPlumbInstance {
        this.Defaults = extend({}, this._initialDefaults)
        return this
    }

    getManagedElements():Dictionary<ManagedElement<T["E"]>> {
        return this._managedElements
    }

// ----------------------------- proxy connections -----------------------

    proxyConnection(connection:Connection, index:number,
                    proxyEl:T["E"], proxyElId:string,
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
        if (findWithFunction(connection.proxies, (p:any) => p != null) === -1) {
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

    getGroup(groupId:string) { return this.groupManager.getGroup(groupId); }
    getGroupFor(el:T["E"]) { return this.groupManager.getGroupFor(el); }
    addGroup(params:AddGroupOptions) { return this.groupManager.addGroup(params); }
    addToGroup(group:string | UIGroup<T["E"]>, ...el:Array<T["E"]>) { return this.groupManager.addToGroup(group, false, ...el); }

    collapseGroup (group:string | UIGroup<T["E"]>) { this.groupManager.collapseGroup(group); }
    expandGroup (group:string | UIGroup<T["E"]>) { this.groupManager.expandGroup(group); }
    toggleGroup (group:string | UIGroup<T["E"]>) { this.groupManager.toggleGroup(group); }

    removeGroup(group:string | UIGroup<T["E"]>, deleteMembers?:boolean, manipulateView?:boolean, doNotFireEvent?:boolean) {
        this.groupManager.removeGroup(group, deleteMembers, manipulateView, doNotFireEvent)
    }

    removeAllGroups(deleteMembers?:boolean, manipulateView?:boolean) {
        this.groupManager.removeAllGroups(deleteMembers, manipulateView, false)
    }
    removeFromGroup (group:string | UIGroup<T["E"]>, ...el:Array<T["E"]>):void {
        this.groupManager.removeFromGroup(group, false, ...el)
        forEach(el,(_el) => {
            this.appendElement(_el, this.getContainer())
            this.updateOffset({recalc:true, elId:this.getId(_el)})
        })
    }


    // ----------------------------- PAINT ENDPOINT

    paintEndpoint(endpoint:Endpoint, params:{ timestamp?: string, offset?: ViewportElement<T["E"]>,
        recalc?:boolean, elementWithPrecedence?:string,
        connectorPaintStyle?:PaintStyle,
        anchorLoc?:AnchorPlacement
    }):void {

        function findConnectionToUseForDynamicAnchor<E>(ep:Endpoint):Connection {
            let idx = 0
            if (params.elementWithPrecedence != null) {
                for (let i = 0; i < ep.connections.length; i++) {
                    if (ep.connections[i].sourceId === params.elementWithPrecedence || ep.connections[i].targetId === params.elementWithPrecedence) {
                        idx = i
                        break
                    }
                }
            }

            return ep.connections[idx]
        }

        params = params || {}
        let timestamp = params.timestamp, recalc = !(params.recalc === false)
        if (!timestamp || endpoint.timestamp !== timestamp) {

            let info = this.viewport.getPosition(endpoint.elementId)
            let xy = params.offset ? {left:params.offset.x, top:params.offset.y} : {left:info.x, top:info.y }
            if (xy != null) {
                let ap = params.anchorLoc
                if (ap == null) {
                    let wh:PointArray = [info.w, info.h],
                        anchorParams:AnchorComputeParams = { xy: [ xy.left, xy.top ], wh: wh, element: endpoint, timestamp: timestamp }
                    if (recalc && endpoint.anchor.isDynamic && endpoint.connections.length > 0) {
                        let c = findConnectionToUseForDynamicAnchor(endpoint),
                            oIdx = c.endpoints[0] === endpoint ? 1 : 0,
                            oId = oIdx === 0 ? c.sourceId : c.targetId,
                            oInfo = this.viewport.getPosition(oId)

                        anchorParams.index = oIdx === 0 ? 1 : 0
                        anchorParams.connection = c
                        anchorParams.txy = [ oInfo.x, oInfo.y]
                        anchorParams.twh = [oInfo.w, oInfo.h]
                        anchorParams.tElement = c.endpoints[oIdx]
                        anchorParams.tRotation = this.getRotations(oId)

                    } else if (endpoint.connections.length > 0) {
                        anchorParams.connection = endpoint.connections[0]
                    }

                    anchorParams.rotation = this.getRotations(endpoint.elementId)

                    ap = this.router.computeAnchorLocation(endpoint.anchor, anchorParams)
                }

                endpoint.endpoint.compute(ap, this.router.getEndpointOrientation(endpoint), endpoint.paintStyleInUse)
                this.renderEndpoint(endpoint, endpoint.paintStyleInUse)
                endpoint.timestamp = timestamp

                // paint overlays
                for (let i in endpoint.overlays) {
                    if (endpoint.overlays.hasOwnProperty(i)) {
                        let o = endpoint.overlays[i]
                        if (o.isVisible()) {
                            endpoint.overlayPlacements[i] = this.drawOverlay(o, endpoint.endpoint, endpoint.paintStyleInUse, endpoint.getAbsoluteOverlayPosition(o))
                            this.paintOverlay(o, endpoint.overlayPlacements[i], {xmin:0, ymin:0})
                        }
                    }
                }
            }
        }
    }

    // ---- paint Connection

    paintConnection(connection:Connection, params?:any) {

        if (!this._suspendDrawing && connection.visible !== false) {

            params = params || {}
            let timestamp = params.timestamp
            if (timestamp != null && timestamp === connection.lastPaintedAt) {
                return
            }

            if (timestamp == null || timestamp !== connection.lastPaintedAt) {

                this.router.computePath(connection, timestamp);

                let overlayExtents = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }

                // compute overlays. we do this first so we can get their placements, and adjust the
                // container if needs be (if an overlay would be clipped)
                for (let i in connection.overlays) {
                    if (connection.overlays.hasOwnProperty(i)) {
                        let o:Overlay = connection.overlays[i]
                        if (o.isVisible()) {

                            connection.overlayPlacements[i] = this.drawOverlay(o, connection.connector, connection.paintStyleInUse, connection.getAbsoluteOverlayPosition(o))

                            overlayExtents.minX = Math.min(overlayExtents.minX, connection.overlayPlacements[i].minX)
                            overlayExtents.maxX = Math.max(overlayExtents.maxX, connection.overlayPlacements[i].maxX)
                            overlayExtents.minY = Math.min(overlayExtents.minY, connection.overlayPlacements[i].minY)
                            overlayExtents.maxY = Math.max(overlayExtents.maxY, connection.overlayPlacements[i].maxY)
                        }
                    }
                }

                let lineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "1") / 2,
                    outlineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "0"),
                    extents = {
                        xmin: Math.min(connection.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                        ymin: Math.min(connection.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                        xmax: Math.max(connection.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                        ymax: Math.max(connection.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
                    }

                this.paintConnector(connection.connector, connection.paintStyleInUse, extents)

                // and then the overlays
                for (let j in connection.overlays) {
                    if (connection.overlays.hasOwnProperty(j)) {
                        let p = connection.overlays[j]
                        if (p.isVisible()) {
                            this.paintOverlay(p, connection.overlayPlacements[j], extents)
                        }
                    }
                }
            }
            connection.lastPaintedAt = timestamp
        }
    }

    refreshEndpoint(endpoint: Endpoint): void {

        if (endpoint.connections.length > 0) {
            this.addEndpointClass(endpoint, this.endpointConnectedClass)
        } else {
            this.removeEndpointClass(endpoint, this.endpointConnectedClass)
        }

        if (endpoint.isFull()) {
            this.addEndpointClass(endpoint, this.endpointFullClass)
        } else {
            this.removeEndpointClass(endpoint, this.endpointFullClass)
        }
    }

    /**
     * For some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group. For an element that has child
     * elements that are also managed, it means those child elements.
     * @param el
     * @private
     */
    abstract _getAssociatedElements(el:T["E"]):Array<T["E"]>

    abstract removeElement(el:T["E"]):void
    abstract appendElement (el:T["E"], parent:T["E"]):void
    abstract getChildElements(el:T["E"]):Array<T["E"]>

    abstract removeClass(el:T["E"], clazz:string):void
    abstract addClass(el:T["E"], clazz:string):void
    abstract toggleClass(el:T["E"], clazz:string):void
    abstract getClass(el:T["E"]):string
    abstract hasClass(el:T["E"], clazz:string):boolean

    abstract setAttribute(el:T["E"], name:string, value:string):void
    abstract getAttribute(el:T["E"], name:string):string
    abstract setAttributes(el:T["E"], atts:Dictionary<string>):void
    abstract removeAttribute(el:T["E"], attName:string):void

    abstract getSelector(ctx:string | T["E"], spec?:string):Array<T["E"]>
    abstract getStyle(el:T["E"], prop:string):any

    abstract getSize(el:T["E"]):Size

    abstract getOffset(el:T["E"]):Offset
    abstract getOffsetRelativeToRoot(el:T["E"]|string):Offset

    abstract setPosition(el:T["E"], p:Offset):void

    abstract on (el:T["E"], event:string, callbackOrSelector:Function | string, callback?:Function):void
    abstract off (el:T["E"], event:string, callback:Function):void
    abstract trigger(el:T["E"], event:string, originalEvent?:Event, payload?:any):void

    abstract getPath(segment:Segment, isFirstSegment:boolean):string

    abstract paintOverlay(o: Overlay, params:any, extents:any):void
    abstract addOverlayClass(o:Overlay, clazz:string):void
    abstract removeOverlayClass(o:Overlay, clazz:string):void
    abstract setOverlayVisible(o: Overlay, visible:boolean):void
    abstract destroyOverlay(o: Overlay, force?:boolean):void
    abstract updateLabel(o:LabelOverlay):void
    abstract drawOverlay(overlay:Overlay, component:any, paintStyle:PaintStyle, absolutePosition?:PointArray):any
    abstract reattachOverlay(o:Overlay, c:OverlayCapableComponent):void

    abstract setOverlayHover(o:Overlay, hover:boolean):void

    abstract setHover(component:Component, hover:boolean):void

    abstract paintConnector(connector:AbstractConnector, paintStyle:PaintStyle, extents?:any):void
    abstract destroyConnection(connection:Connection, force?:boolean):void
    abstract setConnectorHover(connector:AbstractConnector, h:boolean, doNotCascade?:boolean):void
    abstract addConnectorClass(connector:AbstractConnector, clazz:string):void
    abstract removeConnectorClass(connector:AbstractConnector, clazz:string):void
    abstract getConnectorClass(connector:AbstractConnector):string
    abstract setConnectorVisible(connector:AbstractConnector, v:boolean):void
    abstract applyConnectorType(connector:AbstractConnector, t:TypeDescriptor):void

    abstract applyEndpointType(ep:Endpoint<T>, t:TypeDescriptor):void
    abstract setEndpointVisible(ep:Endpoint<T>, v:boolean):void
    abstract destroyEndpoint(ep:Endpoint<T>):void
    abstract renderEndpoint(ep:Endpoint<T>, paintStyle:PaintStyle):void
    abstract addEndpointClass(ep:Endpoint<T>, c:string):void
    abstract removeEndpointClass(ep:Endpoint<T>, c:string):void
    abstract getEndpointClass(ep:Endpoint<T>):string
    abstract setEndpointHover(endpoint: Endpoint<T>, h: boolean, doNotCascade?:boolean): void

}

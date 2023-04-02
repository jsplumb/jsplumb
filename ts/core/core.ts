import {DEFAULT_KEY_ALLOW_NESTED_GROUPS, DEFAULT_KEY_PAINT_STYLE, DEFAULT_KEY_SCOPE, JsPlumbDefaults} from "./defaults"

import {Connection, ConnectionOptions} from "./connector/connection-impl"
import {Endpoint} from "./endpoint/endpoint"
import { DotEndpoint } from './endpoint/dot-endpoint'
import {convertToFullOverlaySpec} from "./overlay/overlay"
import {RedrawResult} from "./router/router"

import {
    UpdateOffsetOptions,
    ConnectParams  // <--
} from "./params"

import {
    SourceDefinition,
    TargetDefinition,
    BehaviouralTypeDescriptor,  // <--
    TypeDescriptor, ConnectionTypeDescriptor, EndpointTypeDescriptor
} from './type-descriptors'

import {
    ConnectionMovedParams,
    ConnectionDetachedParams,
    ConnectionEstablishedParams,
    ManageElementParams
} from "./callbacks"

import * as Constants from "./constants"
import {EndpointOptions} from "./endpoint/endpoint-options"
import {AddGroupOptions, GroupManager} from "./group/group-manager"
import {UIGroup} from "./group/group"

import {Router} from "./router/router"
import {EndpointSelection} from "./selection/endpoint-selection"
import {ConnectionSelection} from "./selection/connection-selection"
import {Viewport, ViewportElement} from "./viewport"

import { Component } from './component/component'
import { Overlay } from './overlay/overlay'
import { LabelOverlay } from './overlay/label-overlay'
import { AbstractConnector } from './connector/abstract-connector'

import {AnchorComputeParams} from "./factory/anchor-record-factory"
import {
    ATTRIBUTE_MANAGED,
    CLASS_CONNECTED,
    CLASS_CONNECTOR,
    CLASS_CONNECTOR_OUTLINE,
    CLASS_ENDPOINT,
    CLASS_ENDPOINT_ANCHOR_PREFIX,
    CLASS_ENDPOINT_CONNECTED,
    CLASS_ENDPOINT_DROP_ALLOWED,
    CLASS_ENDPOINT_DROP_FORBIDDEN, CLASS_ENDPOINT_FLOATING,
    CLASS_ENDPOINT_FULL,
    CLASS_OVERLAY,
    ERROR_SOURCE_DOES_NOT_EXIST,
    ERROR_SOURCE_ENDPOINT_FULL, ERROR_TARGET_DOES_NOT_EXIST,
    ERROR_TARGET_ENDPOINT_FULL
} from "./constants"
import {InternalEndpointOptions} from "./endpoint/endpoint-options"
import {LightweightRouter} from "./router/lightweight-router"
import {Connectors} from "./connector/connectors"

import {StraightConnector} from "./connector/straight-connector"
import {ConnectionDragSelector} from "./source-selector"
import {FullOverlaySpec, OverlaySpec} from "../common/overlay"
import {AnchorLocations, AnchorPlacement, AnchorSpec} from "../common/anchor"
import {
    addToDictionary, extend,
    Extents,
    filterList,
    findWithFunction,
    forEach,
    functionChain, isString, log,
    PointXY, removeWithFunction,
    RotatedPointXY, rotatePoint, Rotation, Rotations,
    Size,
    uuid
} from "../util/util"
import {EndpointSpec} from "../common/endpoint"
import {DEFAULT, PaintStyle, WILDCARD} from "../common/index"
import {EventGenerator} from "../util/event-generator"

export interface jsPlumbElement<E> {
    _jsPlumbGroup: UIGroup<E>
    _jsPlumbParentGroup:UIGroup<E>
    _jsPlumbProxies:Array<[Connection, number]>
    _isJsPlumbGroup:boolean
    parentNode:jsPlumbElement<E>
}

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

function addManagedEndpoint(managedElement:ManagedElement<any>, ep:Endpoint) {
    if (managedElement != null) {
        managedElement.endpoints.push(ep)
    }

}

function removeManagedEndpoint(managedElement:ManagedElement<any>, endpoint:Endpoint) {
    if (managedElement != null) {
        removeWithFunction(managedElement.endpoints, (ep: Endpoint) => {
            return ep === endpoint
        })
    }
}

function addManagedConnection(connection:Connection, sourceEl?:ManagedElement<any>, targetEl?:ManagedElement<any>) {
    if (sourceEl != null) {
        sourceEl.connections.push(connection)
        if (sourceEl.connections.length === 1) {
            // add connected class if list previously empty and now has a connection
            connection.instance.addClass(connection.source, connection.instance.connectedClass)
        }
    }

    if (targetEl != null) {
        if (sourceEl == null || connection.sourceId !== connection.targetId) {
            targetEl.connections.push(connection)
            if (targetEl.connections.length === 1) {
                // add connected class if list previously empty and now has a connection
                connection.instance.addClass(connection.target, connection.instance.connectedClass)
            }
        }
    }
}

function removeManagedConnection(connection:Connection, sourceEl?:ManagedElement<any>, targetEl?:ManagedElement<any>) {

    if (sourceEl != null) {
        const sourceCount = sourceEl.connections.length

        removeWithFunction(sourceEl.connections, (_c:Connection) => {
            return connection.id === _c.id
        })

        // if this removal resulted in an empty connections list for the source element (and it wasnt previously empty), remove the connected class
        if (sourceCount > 0 && sourceEl.connections.length === 0) {
            connection.instance.removeClass(connection.source, connection.instance.connectedClass)
        }
    }

    if (targetEl != null) {
        const targetCount = targetEl.connections.length
        if (sourceEl == null || connection.sourceId !== connection.targetId) {
            removeWithFunction(targetEl.connections, (_c:Connection) => {
                return connection.id === _c.id
            })
        }

        // if this removal resulted in an empty connections list for the source element (and it wasnt previously empty), remove the connected class
        if (targetCount > 0 && targetEl.connections.length === 0) {
            connection.instance.removeClass(connection.target, connection.instance.connectedClass)
        }
    }
}

export type ManagedElement<E> = {
    el:jsPlumbElement<E>,
    viewportElement?:ViewportElement<E>,
    endpoints?:Array<Endpoint>,
    connections?:Array<Connection>,
    rotation?:number,
    group?:string,
    data:Record<string, Record<string, any>>
}

export abstract class JsPlumbInstance<T extends { E:unknown } = any> extends EventGenerator {

    defaults:JsPlumbDefaults<T["E"]>
    private _initialDefaults:JsPlumbDefaults<T["E"]> = {}

    isConnectionBeingDragged:boolean = false
    currentlyDragging:boolean = false
    hoverSuspended:boolean = false
    _suspendDrawing:boolean = false
    _suspendedAt:string = null

    connectorClass = CLASS_CONNECTOR
    connectorOutlineClass = CLASS_CONNECTOR_OUTLINE
    connectedClass = CLASS_CONNECTED
    endpointClass = CLASS_ENDPOINT
    endpointConnectedClass = CLASS_ENDPOINT_CONNECTED
    endpointFullClass = CLASS_ENDPOINT_FULL
    endpointFloatingClass = CLASS_ENDPOINT_FLOATING
    endpointDropAllowedClass = CLASS_ENDPOINT_DROP_ALLOWED
    endpointDropForbiddenClass = CLASS_ENDPOINT_DROP_FORBIDDEN
    endpointAnchorClassPrefix = CLASS_ENDPOINT_ANCHOR_PREFIX
    overlayClass = CLASS_OVERLAY

    readonly connections:Array<Connection> = []
    endpointsByElement:Record<string, Array<Endpoint>> = {}
    private readonly endpointsByUUID:Map<string, Endpoint> = new Map()

    sourceSelectors:Array<ConnectionDragSelector> = []
    targetSelectors:Array<ConnectionDragSelector> = []

    public allowNestedGroups:boolean

    private _curIdStamp :number = 1
    readonly viewport:Viewport<T> = new Viewport(this)

    readonly router: Router<T, any>
    readonly groupManager:GroupManager<T["E"]>

    private _connectionTypes:Map<string, ConnectionTypeDescriptor> = new Map()
    private _endpointTypes:Map<string, EndpointTypeDescriptor> = new Map()
    private _container:any

    protected _managedElements:Record<string, ManagedElement<T["E"]>> = {}

    private DEFAULT_SCOPE:string
    get defaultScope() { return this.DEFAULT_SCOPE }

    private _zoom:number = 1
    get currentZoom() { return  this._zoom }

    constructor(public readonly _instanceIndex:number, defaults?:JsPlumbDefaults<T["E"]>) {

        super()

        this.defaults = {
            anchor: AnchorLocations.Bottom,
            anchors: [ null, null ],
            connectionsDetachable: true,
            connectionOverlays: [ ],
            connector: StraightConnector.type,
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
            extend(this.defaults, defaults)
        }

        extend(this._initialDefaults, this.defaults)

        if (this._initialDefaults[DEFAULT_KEY_PAINT_STYLE] != null) {
            this._initialDefaults[DEFAULT_KEY_PAINT_STYLE].strokeWidth = this._initialDefaults[DEFAULT_KEY_PAINT_STYLE].strokeWidth || 2
        }

        this.DEFAULT_SCOPE = this.defaults[DEFAULT_KEY_SCOPE]

        this.allowNestedGroups = this._initialDefaults[DEFAULT_KEY_ALLOW_NESTED_GROUPS] !== false

        this.router = new LightweightRouter(this)

        this.groupManager = new GroupManager(this)

        this.setContainer(this._initialDefaults.container)

    }

    /**
     * @internal
     */
    areDefaultAnchorsSet():boolean {
        return this.validAnchorsSpec(this.defaults.anchors)
    }

    /**
     * @internal
     * @param anchors
     */
    validAnchorsSpec(anchors:[ AnchorSpec, AnchorSpec ]):boolean {
        return anchors != null && anchors[0] != null && anchors[1] != null
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

    checkCondition<RetVal>(conditionName:string, args?:any):RetVal {
        let l = this.getListener(conditionName),
            r:any = true

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
        return r as RetVal
    }

    getId (element:T["E"], uuid?:string):string {

        if (element == null) {
            return null
        }

        let id:string = this.getAttribute(element, ATTRIBUTE_MANAGED)
        if (!id || id === "undefined") {
            // check if fixed uuid parameter is given
            if (arguments.length === 2 && arguments[1] !== undefined) {
                id = uuid
            }
            else if (arguments.length === 1 || (arguments.length === 3 && !arguments[2])) {
                id = "jsplumb-" + this._instanceIndex + "-" + this._idstamp()
            }

            this.setAttribute(element, ATTRIBUTE_MANAGED, id)
        }
        return id
    }

// ------------------  element selection ------------------------

    getConnections(options?:SelectOptions<T["E"]>, flat?:boolean):Record<string, Connection> | Array<Connection> {
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
        params.scope = params.scope || WILDCARD

        let noElementFilters = !params.element && !params.source && !params.target,
            elements = noElementFilters ? WILDCARD : prepareList(this, params.element),
            sources = noElementFilters ? WILDCARD : prepareList(this, params.source),
            targets = noElementFilters ? WILDCARD : prepareList(this, params.target),

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
            { el: "source", elId: "sourceId"},
            { el: "target", elId: "targetId" }
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
        }
        else {
            sid = this.getId(el)

            if (sid === c[_st.elId]) {
                ep = null; // dont change source/target if the element is already the one given.
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
            this._paintConnection(c)
        }

        return evtParams

    }

    /**
     * Change the source of the given connection to be the given endpoint or element.
     * @param connection
     * @param el
     */
    setSource (connection:Connection, el:T["E"] | Endpoint):void {
        removeManagedConnection(connection, this._managedElements[connection.sourceId])
        let p = this._set(connection, el, 0)
        addManagedConnection(connection, this._managedElements[p.newSourceId])
    }

    /**
     * Change the target of the given connection to be the given endpoint or element.
     * @param connection
     * @param el
     */
    setTarget (connection:Connection, el:T["E"] | Endpoint):void {
        removeManagedConnection(connection, this._managedElements[connection.targetId])
        let p = this._set(connection, el, 1)
        addManagedConnection(connection, this._managedElements[p.newTargetId])
    }

    /**
     * Sets the type of a connection and then repaints it.
     * @param connection
     * @param type
     */
    setConnectionType(connection:Connection, type:string, params?:any):void {
        connection.setType(type, params)
        this._paintConnection(connection)
    }

    /**
     * Returns whether or not hover is currently suspended.
     */
    isHoverSuspended():boolean { return this.hoverSuspended; }

    /**
     * Sets whether or not drawing is suspended.
     * @param val - True to suspend, false to enable.
     * @param repaintAfterwards - If true, repaint everything afterwards.
     */
    setSuspendDrawing (val?:boolean, repaintAfterwards?:boolean):boolean {
        let curVal = this._suspendDrawing
        this._suspendDrawing = val
        if (val) {
            this._suspendedAt = "" + new Date().getTime()
        } else {
            this._suspendedAt = null
            this.viewport.recomputeBounds()
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
     * @param fn - Function to run while drawing is suspended.
     * @param doNotRepaintAfterwards - Whether or not to repaint everything after drawing is re-enabled.
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
     * @param spec - An Element, or an element id, or an array of elements/element ids.
     * @param fn - The function to run on each element.
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
     * @returns an UpdateOffsetResult containing the offset information for the given element.
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
     * @param connection - Connection to delete.
     * @param params - Optional extra parameters.
     */
    deleteConnection (connection:Connection, params?:DeleteConnectionOptions):boolean {
        if (connection != null && connection.deleted !== true) {
            params = params || {}

            if (params.force || functionChain(true, false, [
                    [ connection.endpoints[0], Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection.endpoints[1], Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection, Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ this, Constants.CHECK_CONDITION, [ Constants.INTERCEPT_BEFORE_DETACH, connection ] ]
                ])) {

                // ---------------------------
                // remove from the array in the managed element record
                removeManagedConnection(connection, this._managedElements[connection.sourceId], this._managedElements[connection.targetId])

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

    /**
     * Delete all connections attached to the given element.
     * @param el
     * @param params
     */
    deleteConnectionsForElement(el:T["E"], params?:DeleteConnectionOptions):JsPlumbInstance {

        let id = this.getId(el), m = this._managedElements[id]
        if (m) {
            const l = m.connections.length
            for (let i = 0; i < l; i++) {
                this.deleteConnection(m.connections[0], params)
            }
        }
        return this
    }

    private fireDetachEvent (jpc:Connection | any, doFireEvent?:boolean, originalEvent?:Event):void {
        // may have been given a connection, or in special cases, an object
        let argIsConnection:boolean = (jpc.id != null),
            params:ConnectionDetachedParams = argIsConnection ? {
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
     * @param elements - Array-like object of strings or elements (can be an Array or a NodeList), or a CSS selector (which is applied with the instance's
     * container element as its context)
     * @param recalc - Maybe recalculate offsets for the element also.
     */
    manageAll (elements:ArrayLike<T["E"]> | string, recalc?:boolean):void {

        const nl:ArrayLike<T["E"]> = isString(elements) ? this.getSelector(this.getContainer(), elements as string) : elements as ArrayLike<T["E"]>

        for (let i = 0; i < nl.length; i++) {
            this.manage(nl[i], null, recalc)
        }
    }

    /**
     * Manage an element.  Adds the element to the viewport and sets up tracking for endpoints/connections for the element, as well as enabling dragging for the
     * element. This method is called internally by various methods of the jsPlumb instance, such as `connect`, `addEndpoint`, `makeSource` and `makeTarget`,
     * so if you use those methods to setup your UI then you may not need to call this. However, if you use the `addSourceSelector` and `addTargetSelector` methods
     * to configure your UI then you will need to register elements using this method, or they will not be draggable.
     * @param element - Element to manage. This method does not accept a DOM element ID as argument. If you wish to manage elements via their DOM element ID,
     * you should use `manageAll` and pass in an appropriate CSS selector that represents your element, eg `#myElementId`.
     * @param internalId - Optional ID for jsPlumb to use internally. If this is not supplied, one will be created.
     * @param _recalc - Maybe recalculate offsets for the element also. It is not recommended that clients of the API use this parameter; it's used in
     * certain scenarios internally
     */
    manage (element:T["E"], internalId?:string, _recalc?:boolean):ManagedElement<T["E"]> {

        if (this.getAttribute(element, ATTRIBUTE_MANAGED) == null) {
            internalId = internalId || this.getAttribute(element, "id") || uuid()
            this.setAttribute(element, ATTRIBUTE_MANAGED, internalId)
        }

        const elId = this.getId(element)

        if (!this._managedElements[elId]) {

            const obj:ManagedElement<any> = {
                el:element as unknown as jsPlumbElement<T["E"]>,
                endpoints:[],
                connections:[],
                rotation:0,
                data:{}
            }

            this._managedElements[elId] = obj

            if (this._suspendDrawing) {
                obj.viewportElement = this.viewport.registerElement(elId, true)

            } else {
                obj.viewportElement = this.updateOffset({elId: elId, recalc:true})
            }

            this.fire<ManageElementParams>(Constants.EVENT_MANAGE_ELEMENT, {el:element})

        } else {
            if (_recalc) {
                this._managedElements[elId].viewportElement = this.updateOffset({elId: elId, timestamp: null,  recalc:true })
            }
        }

        return this._managedElements[elId]
    }

    /**
     * Retrieve some data from the given managed element. Created for internal use, as a way to avoid memory leaks from having data pertaining
     * to some element spread around the codebase, but could be used by external code.
     * @internal
     * @param elementId ID of the element to retrieve the data for
     * @param dataIdentifier Type of data being retrieved
     * @param key The key to retrieve the data for
     */
    getManagedData(elementId:string, dataIdentifier:string, key:string):any {
        if (this._managedElements[elementId]) {
            const data = this._managedElements[elementId].data[dataIdentifier]
            return data != null ? data[key] : null
        }
    }

    /**
     * Attach some data to the given managed element. Created for internal use, as a way to avoid memory leaks from having data pertaining
     * to some element spread around the codebase, but could be used by external code.
     * @internal
     * @param elementId ID of the element to store the data against
     * @param dataIdentifier Type of data being stored
     * @param key The key to store the data against
     * @param data The data to store.
     */
    setManagedData(elementId:string, dataIdentifier:string, key:string, data:any) {
        if (this._managedElements[elementId]) {
            this._managedElements[elementId].data[dataIdentifier] = this._managedElements[elementId].data[dataIdentifier] || {}
            this._managedElements[elementId].data[dataIdentifier][key] = data
        }
    }

    /**
     * Gets the element with the given ID from the list managed elements, null if not currently managed.
     * @param id
     */
    getManagedElement(id:string):T["E"] {
        return this._managedElements[id] ? this._managedElements[id].el as unknown as T["E"] : null
    }

    /**
     * Stops managing the given element, removing it from internal tracking and clearing the custom attribute that is
     * added by jsPlumb to mark it as managed. This method fires an 'element:unmanage' event containing the unmanaged
     * element and its managed id.
     * @param el - Element, or ID of the element to stop managing.
     * @param removeElement - If true, also remove the element from the renderer.
     * @public
     */
    unmanage (el:T["E"], removeElement?:boolean):void {

        this.removeAllEndpoints(el, true)

        let _one = (_el:T["E"]) => {

            const id = this.getId(_el)

            this.removeAttribute(_el, ATTRIBUTE_MANAGED)
            delete this._managedElements[id]

            this.viewport.remove(id)

            this.fire<{el:T["E"], id:string}>(Constants.EVENT_UNMANAGE_ELEMENT, {el:_el, id})

            if (_el && removeElement) {
                this._removeElement(_el)
            }
        }

        this._getAssociatedElements(el).map(_one)

        // and always remove the requested one from the renderer.
        _one(el)
    }

    /**
     * Sets rotation for the element to the given number of degrees (not radians). A value of null is treated as a
     * rotation of 0 degrees.
     * @param element - Element to rotate
     * @param rotation - Amount to totate
     * @param _doNotRepaint - For internal use.
     */
    rotate(element:T["E"], rotation:number, _doNotRepaint?:boolean):RedrawResult {
        const elementId = this.getId(element)
        if (this._managedElements[elementId]) {
            this._managedElements[elementId].rotation = rotation
            this.viewport.rotateElement(elementId, rotation)
            if (_doNotRepaint !== true) {
                return this.revalidate(element)
            }
        }

        return { c:new Set(), e:new Set() }
    }

    /**
     * Gets the current rotation for the element with the given ID. This method exists for internal use.
     * @param elementId - Internal ID of the element for which to retrieve rotation.
     * @internal
     */
    _getRotation(elementId:string):number {
        const entry = this._managedElements[elementId]
        if (entry != null) {
            return  entry.rotation || 0
        } else {
            return 0
        }
    }

    /**
     * Returns a list of rotation transformations that apply to the given element. An element may have rotation applied
     * directly to it, and/or it may be within a group, which may itself be rotated, and that group may be inside a group
     * which is also rotated, etc. It's rotated turtles all the way down, or at least it could be. This method is intended
     * for internal use only.
     * @param elementId
     * @internal
     */
    _getRotations(elementId:string):Rotations {
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

    /**
     * Applies the given set of Rotations to the given point, and returns a new PointXY. For internal use.
     * @param point - Point to rotate
     * @param rotations - Rotations to apply.
     * @internal
     */
    _applyRotations(point:[number, number, number, number], rotations:Rotations) {
        const sl = point.slice()
        let current:RotatedPointXY = {x:sl[0], y:sl[1], cr:0, sr:0}
        forEach(rotations,(rotation) => {
            current = rotatePoint(current, rotation.c, rotation.r)
        })
        return current
    }

    /**
     * Applies the given set of Rotations to the given point, and returns a new PointXY. For internal use.
     * @param point - Point to rotate
     * @param rotations - Rotations to apply.
     * @internal
     */
    _applyRotationsXY(point:PointXY, rotations:Rotations) {
        forEach(rotations, (rotation) => {
            point = rotatePoint(point, rotation.c, rotation.r)
        })
        return point
    }

    /**
     * Internal method to create an Endpoint from the given options, perhaps with the given id. Do not use this method
     * as a consumer of the API. If you wish to add an Endpoint to some element, use `addEndpoint` instead.
     * @param params - Options for the Endpoint.
     * @internal
     */
    _internal_newEndpoint(params:InternalEndpointOptions<T["E"]>):Endpoint {
        let _p:InternalEndpointOptions<T["E"]> = extend<InternalEndpointOptions<T["E"]>>({}, params)
        const managedElement = this.manage(_p.element)
        _p.elementId = this.getId(_p.element)
        _p.id = "ep_" + this._idstamp()
        let ep = new Endpoint(this, _p)
        addManagedEndpoint(managedElement, ep)

        if (params.uuid) {
            this.endpointsByUUID.set(params.uuid, ep)
        }

        addToDictionary(this.endpointsByElement, ep.elementId, ep)

        if (!this._suspendDrawing) {
            this._paintEndpoint(ep, {
                timestamp: this._suspendedAt
            })
        }

        return ep
    }

    /**
     * For internal use. For the given inputs, derive an appropriate anchor and endpoint definition.
     * @param type
     * @param dontPrependDefault
     * @internal
     */
    _deriveEndpointAndAnchorSpec(type:string, dontPrependDefault?:boolean):{endpoints:[EndpointSpec, EndpointSpec], anchors:[AnchorSpec, AnchorSpec]} {

        let bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/),
            eps = null,
            ep = null,
            a:AnchorSpec = null,
            as = null

        for (let i = 0; i < bits.length; i++) {
            let _t:ConnectionTypeDescriptor = this.getConnectionType(bits[i])
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

    /**
     * Updates position/size information for the given element and redraws its Endpoints and their Connections. Use this method when you've
     * made a change to some element that may have caused the element to change its position or size and you want to ensure the connections are
     * in the right place.
     * @param el - Element to revalidate.
     * @param timestamp - Optional, used internally to avoid recomputing position/size information if it has already been computed.
     */
    revalidate (el:T["E"], timestamp?:string):RedrawResult {
        let elId = this.getId(el)
        this.updateOffset({ elId: elId, recalc: true, timestamp:timestamp })
        return this.repaint(el)
    }

    /**
     * Repaint every connection and endpoint in the instance.
     */
    repaintEverything ():JsPlumbInstance {
        let timestamp = uuid(), elId:string

        for (elId in this._managedElements) {
            this.viewport.refreshElement(elId, true)
        }

        this.viewport.recomputeBounds()

        for (elId in this._managedElements) {
            this.repaint(this._managedElements[elId].el, timestamp, true)
        }

        return this
    }

    /**
     * Sets the position of the given element to be [x,y].
     * @param el - Element to set the position for
     * @param x - Position in X axis
     * @param y - Position in Y axis
     * @returns The result of the redraw operation that follows the update of the viewport.
     */
    setElementPosition(el:T["E"], x:number, y:number):RedrawResult {
        const id = this.getId(el)
        this.viewport.setPosition(id, x, y)
        return this.repaint(el)
    }


    /**
     * Repaints all connections and endpoints associated with the given element, _without recomputing the element
     * size and position_. If you want to first recompute element size and position you should call `revalidate(el)` instead,
     * @param el - Element to repaint.
     * @param timestamp - Optional parameter used internally to avoid recalculating offsets multiple times in one paint.
     * @param offsetsWereJustCalculated - If true, we don't recalculate the offsets of child elements of the element we're repainting.
     */
    repaint(el:T["E"], timestamp?:string, offsetsWereJustCalculated?:boolean):RedrawResult {

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
                let repaintEls = this._getAssociatedElements(el)

                if (timestamp == null) {
                    timestamp = uuid()
                }

                if (!offsetsWereJustCalculated) {
                    // update the offset of everything _before_ we try to draw anything, if offsets might be stale
                    for (let i = 0; i < repaintEls.length; i++) {
                        this.updateOffset({
                            elId: this.getId(repaintEls[i]),
                            recalc: true,
                            timestamp: timestamp
                        })
                    }
                }

                _mergeRedraw(this.router.redraw(id, timestamp, null))

                if (repaintEls.length > 0) {
                    for (let j = 0; j < repaintEls.length; j++) {
                        _mergeRedraw(this.router.redraw(this.getId(repaintEls[j]), timestamp, null))
                    }
                }
            }
        }

        return r
    }

    /**
     * @internal
     * @param endpoint
     */
    private unregisterEndpoint(endpoint:Endpoint) {
        const uuid = endpoint.getUuid()
        if (uuid) {
            this.endpointsByUUID.delete(uuid)
        }

        removeManagedEndpoint(this._managedElements[endpoint.elementId], endpoint)

        const ebe = this.endpointsByElement[endpoint.elementId]

        if (ebe != null) {
            this.endpointsByElement[endpoint.elementId] = ebe.filter(e => e !== endpoint)
        }

        this.fire(Constants.EVENT_INTERNAL_ENDPOINT_UNREGISTERED, endpoint)
    }

    /**
     * Potentially delete the endpoint from the instance, depending on the endpoint's internal state. Not for external use.
     * @param endpoint
     * @internal
     */
    _maybePruneEndpoint(endpoint:Endpoint):boolean {
        if (endpoint.deleteOnEmpty && endpoint.connections.length === 0) {
            this.deleteEndpoint(endpoint)
            return true
        } else {
            return false
        }
    }

    /**
     * Delete the given endpoint.
     * @param object - Either an Endpoint, or the UUID of an Endpoint.
     */
    deleteEndpoint(object:string | Endpoint):JsPlumbInstance {
        let endpoint = (typeof object === "string") ? this.endpointsByUUID.get(object as string) : object as Endpoint
        if (endpoint) {

            const proxy = endpoint.proxiedBy

            // find all connections for the endpoint
            const connectionsToDelete = endpoint.connections.slice()
            forEach(connectionsToDelete,(connection) => {
                // detach this endpoint from each of these connections.
                endpoint.detachFromConnection(connection, null, true)
            })

            // delete the endpoint
            this.unregisterEndpoint(endpoint)
            endpoint.destroy()

            // then delete the connections. each of these connections only has one endpoint at the moment
            forEach(connectionsToDelete,(connection) => {
                // detach this endpoint from each of these connections.
                this.deleteConnection(connection, {force:true, endpointToIgnore:endpoint})
            })

            if (proxy != null) {
                this.deleteEndpoint(proxy)
            }
        }
        return this
    }

    /**
     * Add an Endpoint to the given element.
     * @param el - Element to add the endpoint to.
     * @param params
     * @param referenceParams
     */
    addEndpoint(el:T["E"], params?:EndpointOptions<T["E"]>, referenceParams?:EndpointOptions<T["E"]>):Endpoint{

        referenceParams = referenceParams || {} as EndpointOptions<T["E"]>
        let p:EndpointOptions<T["E"]> = extend({}, referenceParams)
        extend<EndpointOptions<T["E"]>>(p, params || {})

        let _p:InternalEndpointOptions<T["E"]> = extend<InternalEndpointOptions<T["E"]>>({element:el}, p)

        return this._internal_newEndpoint(_p)
    }

    /**
     * Add a set of Endpoints to an element
     * @param el - Element to add the Endpoints to.
     * @param endpoints - Array of endpoint options.
     * @param referenceParams
     */
    addEndpoints(el:T["E"], endpoints:Array<EndpointOptions<T["E"]>>, referenceParams?:EndpointOptions<T["E"]>):Array<Endpoint> {
        let results:Array<Endpoint> = []
        for (let i = 0, j = endpoints.length; i < j; i++) {
            results.push(this.addEndpoint(el, endpoints[i], referenceParams))
        }
        return results
    }

    /**
     * Clears all endpoints and connections from the instance of jsplumb. Does not also clear out event listeners, selectors, or
     * connection/endpoint types - for that, use `destroy()`.
     * @public
     */
    reset ():void {
        this.silently(() => {
            this.endpointsByElement = {}
            this._managedElements = {}
            this.endpointsByUUID.clear()
            this.viewport.reset()
            this.router.reset()
            this.groupManager.reset()
            this.connections.length = 0
        })
    }

// ---------------------------------------------------------------------------------

    /**
     * Clears the instance and unbinds any listeners on the instance. After you call this method you cannot use this
     * instance of jsPlumb again.
     * @public
     */
    destroy():void {
        this.reset()
        this.unbind()
        this.sourceSelectors.length = 0
        this.targetSelectors.length = 0
        this._connectionTypes.clear()
        this._endpointTypes.clear()
    }

    /**
     * Gets all registered endpoints for the given element.
     * @param el
     */
    getEndpoints(el:T["E"]):Array<Endpoint> {
        return this.endpointsByElement[this.getId(el)] || []
    }

    /**
     * Retrieve an endpoint by its UUID.
     * @param uuid
     */
    getEndpoint(uuid:string):Endpoint {
        return this.endpointsByUUID.get(uuid)
    }

    /**
     * Set an endpoint's uuid, updating the internal map
     * @param endpoint
     * @param uuid
     */
    setEndpointUuid(endpoint:Endpoint, uuid:string) {
        if (endpoint.uuid) {
            this.endpointsByUUID.delete(endpoint.uuid)
        }
        endpoint.uuid = uuid
        this.endpointsByUUID.set(uuid, endpoint)
    }

    /**
     * Connect one element to another.
     * @param params - At the very least you need to supply a source and target.
     * @param referenceParams - Optional extra parameters. This can be useful when you're creating multiple connections that have some things in common.
     */
    connect (params:ConnectParams<T["E"]>, referenceParams?:ConnectParams<T["E"]>):Connection {

        try {
            // prepare a final set of parameters to create connection with
            let _p = this._prepareConnectionParams(params, referenceParams),
                jpc = this._newConnection(_p)

            // now add it the model, fire an event, and redraw
            this._finaliseConnection(jpc, _p)
            return jpc
        }
        catch(errorMessage) {
            log(errorMessage)
            return
        }
    }


    /**
     * @param params
     * @param referenceParams
     * @internal
     */
    private _prepareConnectionParams(params:ConnectParams<T["E"]>, referenceParams?:ConnectParams<T["E"]>):ConnectionOptions<T["E"]> {

        let temp:ConnectParams<T["E"]> = extend({}, params)
        if (referenceParams) {
            extend(temp, referenceParams)
        }

        let _p:ConnectionOptions<T["E"]> = temp as ConnectionOptions<T["E"]>

        // If endpoints were passed as source and/or target, set them as sourceEndpoint/targetEndpoint, respectively.
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

        // ensure that if we do have Endpoints already, they're not full, and that we have a source of some type.
        if (_p.sourceEndpoint != null) {
            if (_p.sourceEndpoint.isFull()) {
                throw ERROR_SOURCE_ENDPOINT_FULL
            }

            if (!_p.type) {
                _p.type = _p.sourceEndpoint.edgeType
            }
            if (_p.sourceEndpoint.connectorOverlays) {
                _p.overlays = _p.overlays || []
                for (let i = 0, j = _p.sourceEndpoint.connectorOverlays.length; i < j; i++) {
                    _p.overlays.push(_p.sourceEndpoint.connectorOverlays[i])
                }
            }
            if (_p.sourceEndpoint.scope) {
                _p.scope = _p.sourceEndpoint.scope
            }

        } else {
            if (_p.source == null) {
                throw ERROR_SOURCE_DOES_NOT_EXIST
            }
        }

        if (_p.targetEndpoint != null) {
            if (_p.targetEndpoint.isFull()) {
                throw ERROR_TARGET_ENDPOINT_FULL
            }
        } else {
            if(_p.target == null) {
                throw ERROR_TARGET_DOES_NOT_EXIST
            }
        }

        // last, ensure scopes match. always leave this as the last thing we do in this method, as scope could have come from
        // any of the preceding code.
        if (_p.sourceEndpoint && _p.targetEndpoint) {
            if (!_scopeMatch(_p.sourceEndpoint, _p.targetEndpoint)) {
                throw "Cannot establish connection: scopes do not match"
            }
        }
        return _p
    }

    /**
     * Creates and registers a new connection. For internal use only. Use `connect` to create Connections.
     * @param params
     * @internal
     */
    _newConnection (params:ConnectionOptions<T["E"]>):Connection {
        params.id = "con_" + this._idstamp()
        const c = new Connection(this, params)

        addManagedConnection(c, this._managedElements[c.sourceId], this._managedElements[c.targetId])

        this._paintConnection(c)
        return c
    }

    /**
     * Adds the connection to the backing model, fires an event if necessary and then redraws. This is a package-private method, not intended to be
     * called by external code.
     * @param jpc - Connection to finalise
     * @param params
     * @param originalEvent - Optional original event that resulted in the creation of this connection.
     * @internal
     */
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
        this.repaint(jpc.source)

        const payload:ConnectionEstablishedParams = {
            connection: jpc,
            source: jpc.source, target: jpc.target,
            sourceId: jpc.sourceId, targetId: jpc.targetId,
            sourceEndpoint: jpc.endpoints[0], targetEndpoint: jpc.endpoints[1]
        }

        // always fire internal event
        this.fire(Constants.EVENT_INTERNAL_CONNECTION, payload, originalEvent)

        // maybe fire public event
        if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {
            this.fire(Constants.EVENT_CONNECTION, payload, originalEvent)
        }
    }

    /**
     * Remove every endpoint registered to the given element.
     * @param el - Element to remove endpoints for.
     * @param recurse - If true, also remove endpoints for elements that are descendants of this element.
     */
    removeAllEndpoints(el:T["E"], recurse?:boolean):JsPlumbInstance {
        let _one = (_el:T["E"]) => {
            let id = this.getId(_el),
                ebe = this.endpointsByElement[id],
                i, ii

            if (ebe) {
                for (i = 0, ii = ebe.length; i < ii; i++) {
                    this.deleteEndpoint(ebe[i])
                }
            }
            delete this.endpointsByElement[id]
        }

        if (recurse) {
            this._getAssociatedElements(el).map(_one)
        }

        _one(el)
        return this
    }

    protected _createSourceDefinition(params?:BehaviouralTypeDescriptor, referenceParams?:BehaviouralTypeDescriptor):SourceDefinition {
        let p:BehaviouralTypeDescriptor = extend({}, referenceParams)
        extend(p, params)
        p.edgeType = p.edgeType || DEFAULT
        let aae = this._deriveEndpointAndAnchorSpec(p.edgeType)
        p.endpoint = p.endpoint || aae.endpoints[0]
        p.anchor = p.anchor || aae.anchors[0]
        let maxConnections = p.maxConnections || -1
        let _def:SourceDefinition = {
            def:extend({}, p),
            uniqueEndpoint: p.uniqueEndpoint,
            maxConnections: maxConnections,
            enabled: true,
            endpoint:null as Endpoint
        }
        return _def
    }

    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeSource` functionality
     * that had been in jsPlumb since the early days (and which, in 5.x, has been removed). With this approach, rather than calling `makeSource` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse/touch events on elements that are managed by the instance.
     * @param selector - CSS3 selector identifying child element(s) of some managed element that should act as a connection source.
     * @param params - Options for the source: connector type, behaviour, etc.
     * @param exclude - If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     * @public
     */
    addSourceSelector(selector:string, params?:BehaviouralTypeDescriptor, exclude = false):ConnectionDragSelector {

        const _def = this._createSourceDefinition(params)
        const sel = new ConnectionDragSelector(selector, _def, exclude)
        this.sourceSelectors.push(sel)

        return sel
    }

    /**
     * Unregister the given source selector.
     * @param selector
     * @public
     */
    removeSourceSelector(selector:ConnectionDragSelector) {
        removeWithFunction(this.sourceSelectors, (s:ConnectionDragSelector) => s === selector)
    }

    /**
     * Unregister the given target selector.
     * @param selector
     * @public
     */
    removeTargetSelector(selector:ConnectionDragSelector) {
        removeWithFunction(this.targetSelectors, (s:ConnectionDragSelector) => s === selector)
    }

    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeTarget` functionality
     * that has been in jsPlumb since the early days. With this approach, rather than calling `makeTarget` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse events on elements that are managed by the instance.
     * @param selector - CSS3 selector identifying child element(s) of some managed element that should act as a connection target.
     * @param params - Options for the target
     * @param exclude - If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     * @public
     */
    addTargetSelector(selector:string, params?:BehaviouralTypeDescriptor, exclude = false):ConnectionDragSelector {

        const _def = this._createTargetDefinition(params)
        const sel = new ConnectionDragSelector(selector, _def, exclude)
        this.targetSelectors.push(sel)

        return sel
    }

    private _createTargetDefinition(params?:BehaviouralTypeDescriptor, referenceParams?:BehaviouralTypeDescriptor):TargetDefinition {

        // put jsplumb ref into params without altering the params passed in
        let p:BehaviouralTypeDescriptor = extend({}, referenceParams)
        extend(p, params)
        p.edgeType  = p.edgeType || DEFAULT

        let maxConnections = p.maxConnections || -1;//,

        // store the definition
        let _def:TargetDefinition = {
            def: extend({}, p),
            uniqueEndpoint: p.uniqueEndpoint,
            maxConnections: maxConnections,
            enabled: true,
            endpoint:null as Endpoint
        }

        return _def
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

    /**
     * Register a connection type: a set of connection attributes grouped together with an ID.
     * @param id
     * @param type
     */
    registerConnectionType(id:string, type:ConnectionTypeDescriptor):void {
        this._connectionTypes.set(id, extend({}, type))
        if (type.overlays) {
            let to:Record<string, FullOverlaySpec> = {}
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = convertToFullOverlaySpec(type.overlays[i])
                to[fo.options.id] = fo
            }
            this._connectionTypes.get(id).overlays = to as any
        }
    }

    /**
     * Register a set of connection types
     * @param types Set of types to register.
     */
    registerConnectionTypes(types:Record<string, ConnectionTypeDescriptor>) {
        for (let i in types) {
            this.registerConnectionType(i, types[i])
        }
    }

    /**
     * Register an endpoint type: a set of endpoint attributes grouped together with an ID.
     * @param id
     * @param type
     */
    registerEndpointType(id:string, type:EndpointTypeDescriptor) {
        this._endpointTypes.set(id, extend({}, type))
        if (type.overlays) {
            let to:Record<string, FullOverlaySpec> = {}
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = convertToFullOverlaySpec(type.overlays[i])
                to[fo.options.id] = fo
            }
            this._endpointTypes.get(id).overlays = to as any
        }
    }

    /**
     * Register a set of endpoint types
     * @param types Set of types to register.
     */
    registerEndpointTypes(types:Record<string, EndpointTypeDescriptor>) {
        for (let i in types) {
            this.registerEndpointType(i, types[i])
        }
    }

    /**
     * Retrieve an endpoint or connection type by its id.
     * @param id
     * @param typeDescriptor
     * @public
     */
    getType(id:string, typeDescriptor:string):TypeDescriptor {
        return typeDescriptor === "connection" ? this.getConnectionType(id) : this.getEndpointType(id)
    }

    /**
     * Retrieve a connection type by its id.
     * @param id
     * @public
     */
    getConnectionType(id:string):ConnectionTypeDescriptor {
        return  this._connectionTypes.get(id)
    }

    /**
     * Retrieve an endpoint type by its id.
     * @param id
     * @public
     */
    getEndpointType(id:string):EndpointTypeDescriptor {
        return this._endpointTypes.get(id)
    }

    /**
     * Import the given set of defaults to the instance.
     * @param d
     * @public
     */
    importDefaults(d:JsPlumbDefaults<T["E"]>):JsPlumbInstance {
        for (let i in d) {
            this.defaults[i] = d[i]
        }

        if (this.defaults[DEFAULT_KEY_PAINT_STYLE] != null) {
            this.defaults[DEFAULT_KEY_PAINT_STYLE].strokeWidth = this.defaults[DEFAULT_KEY_PAINT_STYLE].strokeWidth || 2
        }

        if (d.container) {
            this.setContainer(d.container)
        }

        return this
    }

    /**
     * Reset the instance defaults to the defaults computed by the constructor.
     * @public
     */
    restoreDefaults ():JsPlumbInstance {
        this.defaults = extend({}, this._initialDefaults)
        return this
    }

    /**
     * Gets all of the elements managed by this instance.
     * @public
     */
    getManagedElements():Record<string, ManagedElement<T["E"]>> {
        return this._managedElements
    }

// ----------------------------- proxy connections -----------------------

    /**
     * @internal
     * @param connection
     * @param index
     * @param proxyEl
     * @param endpointGenerator
     * @param anchorGenerator
     */
    proxyConnection(connection:Connection, index:number,
                    proxyEl:T["E"],
                    endpointGenerator:(c:Connection, idx:number) => EndpointSpec,
                    anchorGenerator:(c:Connection, idx:number) => AnchorSpec) {

        let alreadyProxied = connection.proxies[index] != null,
            proxyEp,
            originalElementId = alreadyProxied ? connection.proxies[index].originalEp.elementId : connection.endpoints[index].elementId,
            originalEndpoint = alreadyProxied ? connection.proxies[index].originalEp : connection.endpoints[index],
            proxyElId = this.getId(proxyEl)

        // if proxies exist for this end of the connection
        if(connection.proxies[index]) {
            // and the endpoint is for the element we're going to proxy to, just use it.
            if (connection.proxies[index].ep.elementId === proxyElId) {
                proxyEp = connection.proxies[index].ep
            } else {
                // otherwise detach that previous endpoint; it will delete itself
                connection.proxies[index].ep.detachFromConnection(connection, index)
                proxyEp = this._internal_newEndpoint({
                    element:proxyEl,
                    endpoint:endpointGenerator(connection, index),
                    anchor:anchorGenerator(connection, index),
                    parameters:{
                        isProxyEndpoint:true
                    }
                })
            }
        } else {
            proxyEp = this._internal_newEndpoint({
                element:proxyEl,
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

        originalEndpoint.proxiedBy = proxyEp
        originalEndpoint.setVisible(false)

        connection.setVisible(true)

        this.revalidate(proxyEl)
    }

    /**
     * @internal
     * @param connection
     * @param index
     */
    unproxyConnection(connection:Connection, index:number) {
        // if connection cleaned up, no proxies, or none for this end of the connection, abort.
        if (connection.proxies == null || connection.proxies[index] == null) {
            return
        }

        let originalElement = connection.proxies[index].originalEp.element,
            originalElementId = connection.proxies[index].originalEp.elementId,
            proxyElId = connection.proxies[index].ep.elementId

        connection.endpoints[index] = connection.proxies[index].originalEp
        delete connection.proxies[index].originalEp.proxiedBy

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

    /**
     * @internal
     * @param originalId
     * @param newId
     * @param connection
     * @param newElement
     * @param index
     */
    sourceOrTargetChanged (originalId:string, newId:string, connection:Connection, newElement:T["E"], index:number):void {

        if (originalId !== newId) {
            if (index === 0) {
                connection.sourceId = newId
                connection.source = newElement
            } else if (index === 1) {
                connection.targetId = newId
                connection.target = newElement
            }

            removeManagedConnection(connection, this._managedElements[originalId])
            addManagedConnection(connection, this._managedElements[newId])
        }
    }

// ------------------------ GROUPS --------------

    abstract setGroupVisible(group:UIGroup, state:boolean):void

    /**
     * Gets the group with given id, null if not found.
     * @param groupId
     * @public
     */
    getGroup(groupId:string) { return this.groupManager.getGroup(groupId); }

    /**
     * Gets the group associated with the given element, null if the given element does not map to a group.
     * @param el
     * @public
     */
    getGroupFor(el:T["E"]) { return this.groupManager.getGroupFor(el); }

    /**
     * Add a group.
     * @param params
     * @public
     */
    addGroup(params:AddGroupOptions<T["E"]>) { return this.groupManager.addGroup(params); }

    /**
     * Add an element to a group
     * @param group
     * @param el
     * @public
     */
    addToGroup(group:string | UIGroup<T["E"]>, ...el:Array<T["E"]>) { return this.groupManager.addToGroup(group, false, ...el); }

    /**
     * Collapse a group.
     * @param group
     * @public
     */
    collapseGroup (group:string | UIGroup<T["E"]>) { this.groupManager.collapseGroup(group); }

    /**
     * Expand a group.
     * @param group
     * @public
     */
    expandGroup (group:string | UIGroup<T["E"]>) { this.groupManager.expandGroup(group); }

    /**
     * Expand a group if it is collapsed, or collapse it if it is expanded.
     * @param group
     * @public
     */
    toggleGroup (group:string | UIGroup<T["E"]>) { this.groupManager.toggleGroup(group); }

    /**
     * Remove a group from this instance of jsPlumb.
     * @param group - Group to remove
     * @param deleteMembers - Whether or not to also delete any members of the group. If this is false (the default) then
     * group members will be removed before the group is deleted.
     * @param _manipulateView - Not for public usage. Used internally.
     * @param _doNotFireEvent - Not recommended for public usage, used internally.
     * @public
     */
    removeGroup(group:string | UIGroup<T["E"]>, deleteMembers?:boolean, _manipulateView?:boolean, _doNotFireEvent?:boolean):Record<string, PointXY> {
        return this.groupManager.removeGroup(group, deleteMembers, _manipulateView, _doNotFireEvent)
    }

    /**
     * Remove all groups from this instance of jsPlumb
     * @param deleteMembers
     * @param _manipulateView - Not for public usage. Used internally.
     * @public
     */
    removeAllGroups(deleteMembers?:boolean, _manipulateView?:boolean) {
        this.groupManager.removeAllGroups(deleteMembers, _manipulateView, false)
    }

    /**
     * Remove an element from a group
     * @param group - Group to remove element from
     * @param el - Element to remove.
     * @param _doNotFireEvent - Not for public usage. Used internally.
     * @public
     */
    removeFromGroup (group:string | UIGroup<T["E"]>, el:T["E"], _doNotFireEvent?:boolean):void {
        this.groupManager.removeFromGroup(group, _doNotFireEvent, el)
        this._appendElement(el, this.getContainer())
        this.updateOffset({recalc:true, elId:this.getId(el)})
    }


    // ----------------------------- PAINT ENDPOINT

    /**
     * @internal
     * @param endpoint
     * @param params
     * @private
     */
    _paintEndpoint(endpoint:Endpoint, params:{ timestamp?: string, offset?: ViewportElement<T["E"]>,
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
            let xy = params.offset ? {x:params.offset.x, y:params.offset.y} : {x:info.x, y:info.y }
            if (xy != null) {
                let ap = params.anchorLoc
                if (ap == null) {
                    let anchorParams:AnchorComputeParams = { xy, wh: info, element: endpoint, timestamp: timestamp }
                    if (recalc && this.router.isDynamicAnchor(endpoint)&& endpoint.connections.length > 0) {
                        let c = findConnectionToUseForDynamicAnchor(endpoint),
                            oIdx = c.endpoints[0] === endpoint ? 1 : 0,
                            oId = oIdx === 0 ? c.sourceId : c.targetId,
                            oInfo = this.viewport.getPosition(oId)

                        anchorParams.index = oIdx === 0 ? 1 : 0
                        anchorParams.connection = c
                        anchorParams.txy = oInfo
                        anchorParams.twh = oInfo
                        anchorParams.tElement = c.endpoints[oIdx]
                        anchorParams.tRotation = this._getRotations(oId)

                    } else if (endpoint.connections.length > 0) {
                        anchorParams.connection = endpoint.connections[0]
                    }

                    anchorParams.rotation = this._getRotations(endpoint.elementId)

                    ap = this.router.computeAnchorLocation(endpoint._anchor, anchorParams)
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
                            this._paintOverlay(o, endpoint.overlayPlacements[i], {xmin:0, ymin:0})
                        }
                    }
                }
            }
        }
    }

    // ---- paint Connection

    /**
     * @internal
     * @param connection
     * @param params
     */
    _paintConnection(connection:Connection, params?:{timestamp?:string}) {

        if (!this._suspendDrawing && connection.visible !== false) {

            params = params || {}
            let timestamp = params.timestamp
            if (timestamp != null && timestamp === connection.lastPaintedAt) {
                return
            }

            if (timestamp == null || timestamp !== connection.lastPaintedAt) {

                this.router.computePath(connection, timestamp);

                let overlayExtents:Extents = { xmin: Infinity, ymin: Infinity, xmax: -Infinity, ymax: -Infinity }

                // compute overlays. we do this first so we can get their placements, and adjust the
                // container if needs be (if an overlay would be clipped)
                for (let i in connection.overlays) {
                    if (connection.overlays.hasOwnProperty(i)) {
                        let o:Overlay = connection.overlays[i]
                        if (o.isVisible()) {

                            connection.overlayPlacements[i] = this.drawOverlay(o, connection.connector, connection.paintStyleInUse, connection.getAbsoluteOverlayPosition(o))

                            overlayExtents.xmin = Math.min(overlayExtents.xmin, connection.overlayPlacements[i].xmin)
                            overlayExtents.xmax = Math.max(overlayExtents.xmax, connection.overlayPlacements[i].xmax)
                            overlayExtents.ymin = Math.min(overlayExtents.ymin, connection.overlayPlacements[i].ymin)
                            overlayExtents.ymax = Math.max(overlayExtents.ymax, connection.overlayPlacements[i].ymax)
                        }
                    }
                }

                let lineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "1") / 2,
                    outlineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "0"),
                    extents = {
                        xmin: Math.min(connection.connector.bounds.xmin - (lineWidth + outlineWidth), overlayExtents.xmin),
                        ymin: Math.min(connection.connector.bounds.ymin - (lineWidth + outlineWidth), overlayExtents.ymin),
                        xmax: Math.max(connection.connector.bounds.xmax + (lineWidth + outlineWidth), overlayExtents.xmax),
                        ymax: Math.max(connection.connector.bounds.ymax + (lineWidth + outlineWidth), overlayExtents.ymax)
                    }

                this.paintConnector(connection.connector, connection.paintStyleInUse, extents)

                // and then the overlays
                for (let j in connection.overlays) {
                    if (connection.overlays.hasOwnProperty(j)) {
                        let p = connection.overlays[j]
                        if (p.isVisible()) {
                            this._paintOverlay(p, connection.overlayPlacements[j], extents)
                        }
                    }
                }
            }
            connection.lastPaintedAt = timestamp
        }
    }

    /**
     * @internal
     * @param endpoint
     */
    _refreshEndpoint(endpoint: Endpoint): void {

        if (!endpoint._anchor.isFloating) {
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
    }

    /**
     * Prepare a connector using the given name and args.
     * @internal
     * @param connection
     * @param name
     * @param args
     */
    _makeConnector(connection:Connection<T["E"]>, name:string, args:any):AbstractConnector {
        return Connectors.get(connection, name, args)
    }

    /**
     * Adds an overlay to the given component, repainting the UI as necessary.
     * @param component - A Connection or Endpoint to add the overlay to
     * @param overlay - Spec for the overlay
     * @param doNotRevalidate - Defaults to true. If false, a repaint won't occur after adding the overlay. This flag can be used when adding
     * several overlays in a loop.
     * @public
     */
    addOverlay(component:Component, overlay:OverlaySpec, doNotRevalidate?:boolean) {
        const o = component.addOverlay(overlay)
        if (!doNotRevalidate) {
            const relatedElement = component instanceof Endpoint ? (component as Endpoint).element : (component as Connection).source
            this.revalidate(relatedElement)
        }
    }

    /**
     * Remove the overlay with the given id from the given component.
     * @param component - Component to remove the overlay from.
     * @param overlayId - ID of the overlay to remove.
     * @public
     */
    removeOverlay(component:Component, overlayId:string) {
        component.removeOverlay(overlayId)
        const relatedElement = component instanceof Endpoint ? (component as Endpoint).element : (component as Connection).source
        this.revalidate(relatedElement)
    }

    /**
     * Set the outline color for the given connection
     * @param conn
     * @param color
     * @public
     */
    setOutlineColor(conn:Connection, color:string) {
        conn.paintStyleInUse.outlineStroke = color
        this._paintConnection(conn)
    }

    /**
     * Sets the outline width for the given connection
     * @param conn
     * @param width
     * @public
     */
    setOutlineWidth(conn:Connection, width:number) {
        conn.paintStyleInUse.outlineWidth = width
        this._paintConnection(conn)
    }

    /**
     * Sets the color of the connection.
     * @param conn
     * @param color
     * @public
     */
    setColor(conn:Connection, color:string) {
        conn.paintStyleInUse.stroke = color
        this._paintConnection(conn)
    }

    /**
     * Sets the line width of the connection
     * @param conn
     * @param width
     * @public
     */
    setLineWidth(conn:Connection, width:number) {
        conn.paintStyleInUse.strokeWidth = width
        this._paintConnection(conn)
    }

    /**
     * Sets color, outline color, line width and outline width.
     * Any values for which the key is present will not be set, but if
     * the key is present and the value is null, the corresponding value in
     * the connection's paint style will be set to null.
     * @param conn
     * @param style
     * @public
     */
    setLineStyle(conn:Connection, style:{lineWidth?:number, outlineWidth?:number, color?:string, outlineColor?:string}) {
        if (style.lineWidth != null) {
            conn.paintStyleInUse.strokeWidth = style.lineWidth
        }
        if (style.outlineWidth != null) {
            conn.paintStyleInUse.outlineWidth = style.outlineWidth
        }
        if (style.color!= null) {
            conn.paintStyleInUse.stroke = style.color
        }
        if (style.outlineColor != null) {
            conn.paintStyleInUse.outlineStroke = style.outlineColor
        }
        this._paintConnection(conn)
    }

    /**
     * For some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group. For an element that has child
     * elements that are also managed, it means those child elements.
     * @param el
     * @internal
     */
    abstract _getAssociatedElements(el:T["E"]):Array<T["E"]>

    abstract _removeElement(el:T["E"]):void
    abstract _appendElement (el:T["E"], parent:T["E"]):void
    abstract _appendElementToGroup(group:UIGroup, e:T["E"]):void
    abstract _appendElementToContainer(e:T["E"]):void

    abstract removeClass(el:T["E"] | ArrayLike<T["E"]>, clazz:string):void
    abstract addClass(el:T["E"] | ArrayLike<T["E"]>, clazz:string):void
    abstract toggleClass(el:T["E"] | ArrayLike<T["E"]>, clazz:string):void
    abstract getClass(el:T["E"]):string
    abstract hasClass(el:T["E"], clazz:string):boolean

    abstract setAttribute(el:T["E"], name:string, value:string):void
    abstract getAttribute(el:T["E"], name:string):string
    abstract setAttributes(el:T["E"], atts:Record<string, string>):void
    abstract removeAttribute(el:T["E"], attName:string):void

    abstract getSelector(ctx:string | T["E"], spec?:string):ArrayLike<T["E"]>
    abstract getStyle(el:T["E"], prop:string):any

    abstract getSize(el:T["E"]):Size

    abstract getOffset(el:T["E"]):PointXY
    abstract getOffsetRelativeToRoot(el:T["E"]|string):PointXY

    abstract getGroupContentArea(group:UIGroup):T["E"]

    abstract setPosition(el:T["E"], p:PointXY):void

    abstract on (el:Document | T["E"] | ArrayLike<T["E"]>, event:string, callbackOrSelector:Function | string, callback?:Function):void
    abstract off (el:Document | T["E"] | ArrayLike<T["E"]>, event:string, callback:Function):void
    abstract trigger(el:Document | T["E"], event:string, originalEvent?:Event, payload?:any, detail?:number):void

    /**
     * @internal
     * @param connector
     */
    getPathData (connector:AbstractConnector):any {
        let p = ""
        for (let i = 0; i < connector.segments.length; i++) {
            p += connector.segments[i].getPath(i === 0)
            p += " "
        }
        return p
    }

    /**
     * @internal
     * @param o
     * @param params
     * @param extents
     */
    abstract _paintOverlay(o: Overlay, params:any, extents:any):void
    abstract addOverlayClass(o:Overlay, clazz:string):void
    abstract removeOverlayClass(o:Overlay, clazz:string):void
    abstract setOverlayVisible(o: Overlay, visible:boolean):void
    abstract destroyOverlay(o: Overlay):void
    abstract updateLabel(o:LabelOverlay):void
    abstract drawOverlay(overlay:Overlay, component:any, paintStyle:PaintStyle, absolutePosition?:PointXY):any
    abstract reattachOverlay(o:Overlay, c:Component):void

    abstract setOverlayHover(o:Overlay, hover:boolean):void

    abstract setHover(component:Component, hover:boolean):void

    /**
     * @internal
     * @param connector
     * @param paintStyle
     * @param extents
     */
    abstract paintConnector(connector:AbstractConnector, paintStyle:PaintStyle, extents?:Extents):void

    /**
     * @internal
     * @param connection
     * @param force
     */
    abstract destroyConnector(connection:Connection, force?:boolean):void

    /**
     * @internal
     * @param connector
     * @param h
     * @param sourceEndpoint
     */
    abstract setConnectorHover(connector:AbstractConnector, h:boolean, sourceEndpoint?:Endpoint):void

    /**
     * @internal
     * @param connector
     * @param clazz
     */
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
    abstract setEndpointHover(endpoint: Endpoint<T>, h: boolean, endpointIndex:number, doNotCascade?:boolean): void

}

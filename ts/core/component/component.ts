

import { Overlay } from '../overlay/overlay'
import {ComponentTypeDescriptor} from '../type-descriptors'
import { JsPlumbInstance } from "../core"
import {Connection} from "../connector/connection-impl"
import {Endpoint} from "../endpoint/endpoint"
import { INTERCEPT_BEFORE_DROP } from '../constants'
import { BeforeDropParams } from '../callbacks'
import {
    convertToFullOverlaySpec
} from "../overlay/overlay"
import { LabelOverlay } from "../overlay/label-overlay"
import { OverlayFactory } from "../factory/overlay-factory"
import {FullOverlaySpec, LabelOverlayOptions, OverlaySpec} from "../../common/overlay"
import {EventGenerator} from "../../util/event-generator"
import {
    clone,
    extend,
    Extents,
    isFunction,
    isString,
    log,
    merge,
    PointXY,
    populate,
    setToArray,
    uuid
} from "../../util/util"
import {PaintStyle} from "../../common/paint-style"

export type ComponentParameters = Record<string, any>

function _splitType (t:string):string[] {
    return t == null ? null : t.split(" ").filter(t => t != null && t.length > 0)
}

function _mapType (map:any, obj:any, typeId:string) {
    for (let i in obj) {
        map[i] = typeId
    }
}

const CONNECTOR = "connector"
const MERGE_STRATEGY_OVERRIDE = "override"
const CSS_CLASS = "cssClass"
const DEFAULT_TYPE_KEY = "__default"
const ANCHOR = "anchor"
const ANCHORS = "anchors"
const _internalLabelOverlayId = "__label"
const _internalLabelOverlayClass = "jtk-default-label"
const TYPE_ITEM_OVERLAY = "overlay"
const LOCATION_ATTRIBUTE = "labelLocation"
const ACTION_ADD = "add"
const ACTION_REMOVE = "remove"

function _applyTypes<E>(component:Component, params?:any) {
    if (component.getDefaultType) {
        let td = component.getTypeDescriptor(), map = {}
        let defType = component.getDefaultType()

        let o = extend({} as any, defType)

        _mapType(map, defType, DEFAULT_TYPE_KEY)

        component._types.forEach(tid => {
            if (tid !== DEFAULT_TYPE_KEY) {
                let _t = component.instance.getType(tid, td)
                if (_t != null) {

                    const overrides = new Set([CONNECTOR, ANCHOR, ANCHORS])
                    if (_t.mergeStrategy === MERGE_STRATEGY_OVERRIDE) {
                        for (let k in _t) {
                            overrides.add(k)
                        }
                    }

                    o = merge(o, _t, [CSS_CLASS], setToArray(overrides))
                    _mapType(map, _t, tid)
                }
            }
        })

        if (params) {
            o = populate(o, params, "_")
        }

        component.applyType(o, map)
    }
}

export function _removeTypeCssHelper<E>(component:Component, typeId:string) {
    let type = component.instance.getType(typeId, component.getTypeDescriptor())

     if (type != null && type.cssClass) {
        component.removeClass(type.cssClass)
    }
}

// helper method to update the hover style whenever it, or paintStyle, changes.
// we use paintStyle as the foundation and merge hoverPaintStyle over the
// top.
export function  _updateHoverStyle<E> (component:Component) {
    if (component.paintStyle && component.hoverPaintStyle) {
        let mergedHoverStyle:PaintStyle = {}
        extend(mergedHoverStyle, component.paintStyle)
        extend(mergedHoverStyle, component.hoverPaintStyle)
        component.hoverPaintStyle = mergedHoverStyle
    }
}

/**
 * Defines the method signature for the callback to the `beforeDetach` interceptor. Returning false from this method
 * prevents the connection from being detached. The interceptor is fired by the core, meaning that it will be invoked
 * regardless of whether the detach occurred programmatically, or via the mouse.
 * @public
 */
export type BeforeConnectionDetachInterceptor = (c:Connection) => boolean

/**
 * Defines the method signature for the callback to the `beforeDrop` interceptor.
 * @public
 */
export type BeforeConnectionDropInterceptor = (params:BeforeDropParams) => boolean

/**
 * The parameters passed to a `beforeDrag` interceptor.
 * @public
 */
export interface BeforeDragParams<E> {
    endpoint:Endpoint
    source:E
    sourceId:string
    connection:Connection
}

/**
 * The parameters passed to a `beforeStartDetach` interceptor.
 * @public
 */
export interface BeforeStartConnectionDetachParams<E> extends BeforeDragParams<E> {}

/**
 * Defines the method signature for the callback to the `beforeDrag` interceptor. This method can return boolean `false` to
 * abort the connection drag, or it can return an object containing values that will be used as the `data` for the connection
 * that is created.
 * @public
 */
export type BeforeDragInterceptor<E = any> = (params:BeforeDragParams<E>) => boolean|Record<string, any>

/**
 * Defines the method signature for the callback to the `beforeStartDetach` interceptor.
 * @public
 */
export type BeforeStartConnectionDetachInterceptor<E = any> = (params:BeforeStartConnectionDetachParams<E>) => boolean

/**
 * @internal
 */
export interface ComponentOptions {
    parameters?:Record<string, any>
    beforeDetach?:BeforeConnectionDetachInterceptor
    beforeDrop?:BeforeConnectionDropInterceptor
    hoverClass?:string
    events?:Record<string, (value:any, event:any) => any>
    scope?:string
    cssClass?:string
    data?:any
    id?:string
    label?:string
    labelLocation?:number
    overlays?:Array<OverlaySpec>
}

export const ADD_CLASS_ACTION = "add"
export const REMOVE_CLASS_ACTION = "remove"

/**
 * @internal
 */
export type ClassAction = typeof ADD_CLASS_ACTION | typeof REMOVE_CLASS_ACTION

function _makeLabelOverlay(component:Component, params:LabelOverlayOptions):LabelOverlay {

    let _params:any = {
            cssClass: params.cssClass,
            id: _internalLabelOverlayId,
            component: component
        },
        mergedParams:LabelOverlayOptions = extend<LabelOverlayOptions>(_params, params)

    return new LabelOverlay(component.instance, component, mergedParams)
}

function _processOverlay<E>(component:Component, o:OverlaySpec|Overlay) {
    let _newOverlay:Overlay = null
    if (isString(o)) {
        _newOverlay = OverlayFactory.get(component.instance, o as string, component, {})
    }
    else if ((o as FullOverlaySpec).type != null && (o as FullOverlaySpec).options != null) {
        // this is for the {type:"Arrow", options:{ width:50 }} syntax
        const oa = o as FullOverlaySpec
        const p = extend({}, oa.options)
        _newOverlay = OverlayFactory.get(component.instance, oa.type, component, p)
    } else {
        _newOverlay = o as Overlay
    }

    _newOverlay.id = _newOverlay.id || uuid()
    component.cacheTypeItem(TYPE_ITEM_OVERLAY, _newOverlay, _newOverlay.id)
    component.overlays[_newOverlay.id] = _newOverlay

    return _newOverlay
}

/**
 * Base class for Endpoint and Connection.
 * @public
 */
export abstract class Component extends EventGenerator {

    abstract getTypeDescriptor():string
    abstract getDefaultOverlayKey():string
    abstract getIdPrefix():string
    abstract getXY():PointXY

    defaultLabelLocation:number | [number, number] = 0.5

    overlays:Record<string, Overlay> = {}
    overlayPositions:Record<string, PointXY> = {}
    overlayPlacements:Record<string, Extents> = {}

    clone: () => Component

    deleted:boolean

    segment:number
    x:number
    y:number
    w:number
    h:number
    id:string

    visible:boolean = true
    
    typeId:string

    params:Record<string, any> = {}

    paintStyle:PaintStyle
    hoverPaintStyle:PaintStyle
    paintStyleInUse:PaintStyle

    _hover:boolean = false

    lastPaintedAt:string

    data:Record<string, any>

    _defaultType:ComponentTypeDescriptor

    events:any

    parameters:ComponentParameters

    _types:Set<string>
    _typeCache:{}

    cssClass:string
    hoverClass:string
    beforeDetach:BeforeConnectionDetachInterceptor
    beforeDrop:BeforeConnectionDropInterceptor

    protected constructor(public instance:JsPlumbInstance, params?:ComponentOptions) {

        super()

        params = params || ({} as ComponentOptions)

        this.cssClass = params.cssClass || ""
        this.hoverClass = params.hoverClass || instance.defaults.hoverClass

        this.beforeDetach = params.beforeDetach
        this.beforeDrop = params.beforeDrop

        this._types = new Set()
        this._typeCache = {}

        this.parameters = clone(params.parameters || {})

        this.id = params.id || this.getIdPrefix() + (new Date()).getTime()

        this._defaultType = {
            parameters: this.parameters,
            scope: params.scope || this.instance.defaultScope,
            overlays:{}
        }

        if (params.events) {
            for (let evtName in params.events) {
                this.bind(evtName, params.events[evtName])
            }
        }

        this.clone = ():Component => {
            let o = Object.create(this.constructor.prototype)
            this.constructor.apply(o, [instance, params])
            return o
        }

        this.overlays = {}
        this.overlayPositions = {}

        let o = params.overlays || [], oo:Record<string, OverlaySpec> = {}
        let defaultOverlayKey = this.getDefaultOverlayKey()
        if (defaultOverlayKey) {

            const defaultOverlays = this.instance.defaults[defaultOverlayKey] as Array<OverlaySpec>
            if (defaultOverlays) {
                o.push(...defaultOverlays)
            }

            for (let i = 0; i < o.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = convertToFullOverlaySpec(o[i])
                oo[fo.options.id] = fo
            }
        }

        this._defaultType.overlays = oo

        if (params.label) {
            this.getDefaultType().overlays[_internalLabelOverlayId] = {
                type:LabelOverlay.type,
                options:{
                    label: params.label,
                    location: params.labelLocation || this.defaultLabelLocation,
                    id:_internalLabelOverlayId,
                    cssClass:_internalLabelOverlayClass
                }
            }
        }
    }

    /**
     * Called internally when the user is trying to disconnect the given connection.
     * @internal
     * @param connection
     */
    isDetachAllowed(connection:Connection):boolean {
        let r = true
        if (this.beforeDetach) {
            try {
                r = this.beforeDetach(connection)
            }
            catch (e) {
                log("jsPlumb: beforeDetach callback failed", e)
            }
        }
        return r
    }

    /**
     * @internal
     * @param sourceId
     * @param targetId
     * @param scope
     * @param connection
     * @param dropEndpoint
     */
    isDropAllowed(sourceId:string, targetId:string, scope:string, connection:Connection, dropEndpoint:Endpoint):boolean {

        let r:boolean
        let payload = {
            sourceId: sourceId,
            targetId: targetId,
            scope: scope,
            connection: connection,
            dropEndpoint: dropEndpoint
        }

        if (this.beforeDrop) {
            try {
                r = this.beforeDrop(payload)
            }
            catch (e) {
                log("jsPlumb: beforeDrop callback failed", e)
            }
        } else {
            r = this.instance.checkCondition<boolean>(INTERCEPT_BEFORE_DROP, payload)
        }
        return r
    }

    /**
     * @internal
     */
    getDefaultType():ComponentTypeDescriptor {
        return this._defaultType
    }

    /**
     * @internal
     */
    appendToDefaultType (obj:Record<string, any>) {
        for (let i in obj) {
            this._defaultType[i] = obj[i]
        }
    }

    /**
     * @internal
     */
    getId():string { return this.id; }

    /**
     * @internal
     */
    cacheTypeItem(key:string, item:any, typeId:string) {
        this._typeCache[typeId] = this._typeCache[typeId] || {}
        this._typeCache[typeId][key] = item
    }

    /**
     * @internal
     */
    getCachedTypeItem (key:string, typeId:string):any {
        return this._typeCache[typeId] ? this._typeCache[typeId][key] : null
    }

    /**
     * @internal
     */
    setType(typeId:string, params?:any) {
        this.clearTypes()
        ;(_splitType(typeId) || []).forEach(this._types.add, this._types)
        _applyTypes(this, params)
    }

    /**
     * @internal
     */
    getType():string[] {
        return Array.from(this._types.keys())
    }

    /**
     * @internal
     */
    reapplyTypes(params?:any) {
        _applyTypes(this, params)
    }

    /**
     * @internal
     */
    hasType(typeId:string):boolean {
        return this._types.has(typeId)
    }

    /**
     * @internal
     */
    addType(typeId:string, params?:any):void {
        let t = _splitType(typeId), _somethingAdded = false
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                if (!this._types.has(t[i])) {
                    this._types.add(t[i])
                    _somethingAdded = true
                }
            }
            if (_somethingAdded) {
                _applyTypes(this, params)
            }
        }
    }

    /**
     * @internal
     */
    removeType(typeId:string, params?:any) {
        let t = _splitType(typeId), _cont = false, _one = (tt:string) =>{
            if (this._types.has(tt)) {
                _removeTypeCssHelper(this, tt)
                this._types.delete(tt)
                return true
            }
            return false
        }

        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                _cont = _one(t[i]) || _cont
            }
            if (_cont) {
                _applyTypes(this, params)
            }
        }
    }

    /**
     * @internal
     */
    clearTypes(params?:any):void {

        this._types.forEach(t => {
            _removeTypeCssHelper(this, t)
        })
        this._types.clear()

        _applyTypes(this, params)
    }

    /**
     * @internal
     */
    toggleType(typeId:string, params?:any) {
        let t = _splitType(typeId)
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                if (this._types.has(t[i])) {
                    _removeTypeCssHelper(this, t[i])
                    this._types.delete(t[i])
                } else {
                    this._types.add(t[i])
                }
            }

            _applyTypes(this, params)
        }
    }

    /**
     * @internal
     */
    applyType(t:any, params?:any):void {
        this.setPaintStyle(t.paintStyle)
        this.setHoverPaintStyle(t.hoverPaintStyle)
        this.mergeParameters(t.parameters)
        this.paintStyleInUse = this.getPaintStyle()
        if (t.overlays) {
            // loop through the ones in the type. if already present on the component,
            // dont remove or re-add.
            let keep = {}, i

            for (i in t.overlays) {

                let existing:Overlay = this.overlays[t.overlays[i].options.id]
                if (existing) {
                    // maybe update from data, if there were parameterised values for instance.
                    existing.updateFrom(t.overlays[i].options)
                    keep[t.overlays[i].options.id] = true
                    this.instance.reattachOverlay(existing, this)

                }
                else {
                    let c:Overlay = this.getCachedTypeItem(TYPE_ITEM_OVERLAY, t.overlays[i].options.id)
                    if (c != null) {
                        this.instance.reattachOverlay(c, this)
                        c.setVisible(true)
                        // maybe update from data, if there were parameterised values for instance.
                        c.updateFrom(t.overlays[i].options)
                        this.overlays[c.id] = c
                    }
                    else {
                        c = this.addOverlay(t.overlays[i])
                    }
                    keep[c.id] = true
                }
            }

            // now loop through the full overlays and remove those that we dont want to keep
            for (i in this.overlays) {
                if (keep[this.overlays[i].id] == null) {
                    this.removeOverlay(this.overlays[i].id, true); // remove overlay but dont clean it up.
                    // that would remove event listeners etc; overlays are never discarded by the types stuff, they are
                    // just detached/reattached.
                }
            }
        }
    }

    /**
     * @internal
     */
    setPaintStyle(style:PaintStyle):void {
        this.paintStyle = style
        this.paintStyleInUse = this.paintStyle
        _updateHoverStyle(this)
    }

    /**
     * @internal
     */
    getPaintStyle():PaintStyle {
        return this.paintStyle
    }

    /**
     * @internal
     */
    setHoverPaintStyle(style:PaintStyle) {
        this.hoverPaintStyle = style
        _updateHoverStyle(this)
    }

    /**
     * @internal
     */
    getHoverPaintStyle():PaintStyle {
        return this.hoverPaintStyle
    }

    /**
     * @internal
     */
    destroy():void {

        for (let i in this.overlays) {
            this.instance.destroyOverlay(this.overlays[i])
        }

        this.overlays = {}
        this.overlayPositions = {}

        this.unbind() // this is on EventGenerator
        this.clone = null
    }

    /**
     * @internal
     */
    isHover():boolean {
        return this._hover
    }

    /**
     * @internal
     */
    mergeParameters(p:ComponentParameters) {
        if (p != null) {
            extend(this.parameters, p)
        }
    }

    /**
     * @internal
     */
    setVisible(v:boolean) {
        this.visible = v
        if (v) {
            this.showOverlays()
        } else {
            this.hideOverlays()
        }
    }

    /**
     * @internal
     */
    isVisible():boolean {
        return this.visible
    }

    /**
     * @internal
     */
    setAbsoluteOverlayPosition(overlay:Overlay, xy:PointXY) {
        this.overlayPositions[overlay.id] = xy
    }

    /**
     * @internal
     */
    getAbsoluteOverlayPosition(overlay:Overlay):PointXY {
        return this.overlayPositions ? this.overlayPositions[overlay.id] : null
    }

    /**
     * @internal
     */
    private _clazzManip(action:ClassAction, clazz:string) {

        for (let i in this.overlays) {
            if (action === ACTION_ADD) {
                this.instance.addOverlayClass(this.overlays[i], clazz)
            } else if (action === ACTION_REMOVE) {
                this.instance.removeOverlayClass(this.overlays[i], clazz)
            }
        }
    }

    /**
     * Adds a css class to the component
     * @param clazz Class to add. May be a space separated list.
     * @param cascade This is for subclasses to use, if they wish to. For instance, a Connection might want to optionally cascade a css class
     * down to its endpoints.
     * @public
     */
    addClass(clazz:string, cascade?:boolean):void {
        let parts = (this.cssClass || "").split(" ")
        parts.push(clazz)
        this.cssClass = parts.join(" ")
        this._clazzManip(ACTION_ADD, clazz)
    }

    /**
     * Removes a css class from the component
     * @param clazz Class to remove. May be a space separated list.
     * @param cascade This is for subclasses to use, if they wish to. For instance, a Connection might want to optionally cascade a css class
     * removal down to its endpoints.
     * @public
     */
    removeClass(clazz:string, cascade?:boolean):void {
        let parts = (this.cssClass || "").split(" ")
        this.cssClass = parts.filter((p) => p !== clazz).join(" ")
        this._clazzManip(ACTION_REMOVE, clazz)
    }

    /**
     * Returns a space-separated list of the current classes assigned to this component.
     * @public
     */
    getClass() : string {
        return this.cssClass
    }

    /**
     * @internal
     */
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true
    }

    /**
     * Gets any backing data stored against the given component.
     * @public
     */
    getData () { return this.data; }

    /**
     * Sets backing data stored against the given component, overwriting any current value.
     * @param d
     * @public
     */
    setData (d:any) { this.data = d || {}; }

    /**
     * Merges the given backing data into any current backing data.
     * @param d
     * @public
     */
    mergeData (d:any) { this.data = extend(this.data, d); }

    /**
     * Add an overlay to the component.  This method is not intended for use by users of the API. You must `revalidate`
     * an associated element for this component if you call this method directly. Consider using the `addOverlay` method
     * of `JsPlumbInstance` instead, which adds the overlay and then revalidates.
     * @param overlay
     * @internal
     */
    addOverlay(overlay:OverlaySpec):Overlay {
        let o = _processOverlay(this, overlay)

        if (this.getData && o.type === LabelOverlay.type && !isString(overlay)) {
            //
            // component data might contain label location - look for it here.
            const d = this.getData(), p = (overlay as FullOverlaySpec).options
            if (d) {
                const locationAttribute = (<LabelOverlayOptions>p).labelLocationAttribute || LOCATION_ATTRIBUTE
                const loc = d[locationAttribute]

                if (loc) {
                    o.location = loc
                }
            }
        }
        return o
    }

    /**
     * Get the Overlay with the given ID. You can optionally provide a type parameter for this method in order to get
     * a typed return value (such as `LabelOverlay`, `ArrowOverlay`, etc), since some overlays have methods that
     * others do not.
     * @param id ID of the overlay to retrieve.
     * @public
     */
    getOverlay<T extends Overlay>(id:string):T {
        return this.overlays[id] as T
    }

    /**
     * Gets all the overlays registered on this component.
     * @public
     */
    getOverlays():Record<string, Overlay> {
        return this.overlays
    }

    /**
     * Hide the overlay with the given id.
     * @param id
     * @public
     */
    hideOverlay(id:string):void {
        let o = this.getOverlay(id)
        if (o) {
            o.setVisible(false)
        }
    }

    /**
     * Hide all overlays, or a specific set of overlays.
     * @param ids optional list of ids to hide.
     * @public
     */
    hideOverlays(...ids:Array<string>):void {
        ids = ids || []
        for (let i in this.overlays) {
            if (ids.length === 0 || ids.indexOf(i) !== -1) {
                this.overlays[i].setVisible(false)
            }
        }
    }

    /**
     * Show a specific overlay (set it to be visible)
     * @param id
     * @public
     */
    showOverlay(id:string):void {
        let o = this.getOverlay(id)
        if (o) {
            o.setVisible(true)
        }
    }

    /**
     * Show all overlays, or a specific set of overlays.
     * @param ids optional list of ids to show.
     * @public
     */
    showOverlays(...ids:Array<string>):void {
        ids = ids || []
        for (let i in this.overlays) {
            if (ids.length === 0 || ids.indexOf(i) !== -1) {
                this.overlays[i].setVisible(true)
            }
        }
    }

    /**
     * Remove all overlays from this component.
     * @public
     */
    removeAllOverlays():void {
        for (let i in this.overlays) {
            this.instance.destroyOverlay(this.overlays[i])
        }

        this.overlays = {}
        this.overlayPositions = null
        this.overlayPlacements= {}
    }

    /**
     * Remove the overlay with the given id.
     * @param overlayId
     * @param dontCleanup This is an internal parameter. You are not encouraged to provide a value for this.
     * @internal
     */
    removeOverlay(overlayId:string, dontCleanup?:boolean):void {
        let o = this.overlays[overlayId]
        if (o) {
            o.setVisible(false)
            if (!dontCleanup) {
                this.instance.destroyOverlay(o)
            }
            delete this.overlays[overlayId]
            if (this.overlayPositions) {
                delete this.overlayPositions[overlayId]
            }

            if (this.overlayPlacements) {
                delete this.overlayPlacements[overlayId]
            }
        }
    }

    /**
     * Remove the given set of overlays, specified by their ids.
     * @param overlays
     * @public
     */
    removeOverlays(...overlays:string[]):void {
        for (let i = 0, j = overlays.length; i < j; i++) {
            this.removeOverlay(arguments[i])
        }
    }

    /**
     * Return this component's label, if one is set.
     * @public
     */
    getLabel():string {
        let lo:LabelOverlay = this.getLabelOverlay()
        return lo != null ? lo.getLabel() : null
    }

    /**
     * @internal
     */
    getLabelOverlay():LabelOverlay {
        return this.getOverlay(_internalLabelOverlayId) as LabelOverlay
    }

    /**
     * Set this component's label.
     * @param l Either some text, or a function which returns some text, or an existing label overlay.
     * @public
     */
    setLabel(l:string|Function|LabelOverlay):void {
        let lo = this.getLabelOverlay()
        if (!lo) {
            let params:LabelOverlayOptions = isString(l) || isFunction(l) ? { label: l as string|Function } : (l as LabelOverlayOptions)
            lo = _makeLabelOverlay(this, params)
            this.overlays[_internalLabelOverlayId] = lo
        }
        else {
            if (isString(l) || isFunction(l)) {
                lo.setLabel(l as string|Function)
            }
            else {
                let ll = l as LabelOverlay
                if (ll.label) {
                    lo.setLabel(ll.label)
                }
                if (ll.location) {
                    lo.location = ll.location
                }
            }
        }
    }
}

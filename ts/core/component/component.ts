import {PaintStyle} from "../styles"
import {Dictionary, TypeDescriptor, PointXY, Extents} from '../common'
import { JsPlumbInstance } from "../core"
import {clone, extend, isFunction, isString, log, merge, populate, setToArray, uuid} from "../util"
import {EventGenerator} from "../event-generator"
import {Connection} from "../connector/connection-impl"
import {Endpoint} from "../endpoint/endpoint"
import { INTERCEPT_BEFORE_DROP } from '../constants'
import {
    convertToFullOverlaySpec, FullOverlaySpec,
    LabelOverlayOptions,
    Overlay,
    OverlaySpec
} from "../overlay/overlay"
import { LabelOverlay } from "../overlay/label-overlay"
import { OverlayFactory } from "../factory/overlay-factory"

export type ComponentParameters = Record<string, any>

function _splitType (t:string):string[] {
    return t == null ? null : t.split(" ")
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
const TYPE_ITEM_OVERLAY = "overlay"
const LOCATION_ATTRIBUTE = "labelLocation"
const ACTION_ADD = "add"
const ACTION_REMOVE = "remove"

function _applyTypes<E>(component:Component, params?:any) {
    if (component.getDefaultType) {
        let td = component.getTypeDescriptor(), map = {}
        let defType = component.getDefaultType()

        let o = extend({}, defType)

        _mapType(map, defType, DEFAULT_TYPE_KEY)
        for (let i = 0, j = component._types.length; i < j; i++) {
            let tid = component._types[i]
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
        }

        if (params) {
            o = populate(o, params, "_")
        }

        component.applyType(o, map)
    }
}

export function _removeTypeCssHelper<E>(component:Component, typeIndex:number) {
    let typeId = component._types[typeIndex],
        type = component.instance.getType(typeId, component.getTypeDescriptor())

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

export interface ComponentOptions {
    parameters?:Record<string, any>
    beforeDetach?:Function
    beforeDrop?:Function
    hoverClass?:string
    events?:Dictionary<(value:any, event:any) => any>
    scope?:string
    cssClass?:string
    data?:any
    id?:string
    label?:string
    labelLocation?:number
    overlays?:Array<OverlaySpec>
}


export type ClassAction = "add" | "remove"

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

export abstract class Component extends EventGenerator {

    abstract getTypeDescriptor():string
    abstract getDefaultOverlayKey():string
    abstract getIdPrefix():string
    abstract getXY():PointXY

    defaultLabelLocation:number | [number, number] = 0.5

    overlays:Dictionary<Overlay> = {}
    overlayPositions:Dictionary<PointXY> = {}
    overlayPlacements:Dictionary<Extents> = {}

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

    params:Dictionary<any> = {}

    paintStyle:PaintStyle
    hoverPaintStyle:PaintStyle
    paintStyleInUse:PaintStyle

    _hover:boolean = false

    lastPaintedAt:string

    data:any

    _defaultType:any

    events:any

    parameters:ComponentParameters

    _types:string[]
    _typeCache:{}

    cssClass:string
    hoverClass:string
    beforeDetach:Function
    beforeDrop:Function

    constructor(public instance:JsPlumbInstance, params?:ComponentOptions) {

        super()

        params = params || ({} as ComponentOptions)

        this.cssClass = params.cssClass || ""
        this.hoverClass = params.hoverClass || instance.defaults.hoverClass

        this.beforeDetach = params.beforeDetach
        this.beforeDrop = params.beforeDrop

        this._types = []
        this._typeCache = {}

        this.parameters = clone(params.parameters || {})

        this.id = params.id || this.getIdPrefix() + (new Date()).getTime()

        this._defaultType = {
            parameters: this.parameters,
            scope: params.scope || this.instance.defaultScope
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

        let o = params.overlays || [], oo = {}
        let defaultOverlayKey = this.getDefaultOverlayKey()
        if (defaultOverlayKey) {

            const defaultOverlays = this.instance.defaults[defaultOverlayKey]
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
                    id:_internalLabelOverlayId
                }
            }
        }
    }

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

    isDropAllowed(sourceId:string, targetId:string, scope:string, connection:Connection, dropEndpoint:Endpoint):any {
        let r = this.instance.checkCondition(INTERCEPT_BEFORE_DROP, {
            sourceId: sourceId,
            targetId: targetId,
            scope: scope,
            connection: connection,
            dropEndpoint: dropEndpoint
        })
        if (this.beforeDrop) {
            try {
                r = this.beforeDrop({
                    sourceId: sourceId,
                    targetId: targetId,
                    scope: scope,
                    connection: connection,
                    dropEndpoint: dropEndpoint
                })
            }
            catch (e) {
                log("jsPlumb: beforeDrop callback failed", e)
            }
        }
        return r
    }

    getDefaultType():TypeDescriptor {
        return this._defaultType
    }

    appendToDefaultType (obj:any) {
        for (let i in obj) {
            this._defaultType[i] = obj[i]
        }
    }

    getId():string { return this.id; }

    cacheTypeItem(key:string, item:any, typeId:string) {
        this._typeCache[typeId] = this._typeCache[typeId] || {}
        this._typeCache[typeId][key] = item
    }

    getCachedTypeItem (key:string, typeId:string):any {
        return this._typeCache[typeId] ? this._typeCache[typeId][key] : null
    }

    setType(typeId:string, params?:any) {
        this.clearTypes()
        this._types = _splitType(typeId) || []
        _applyTypes(this, params)
    }

    getType():string[] {
        return this._types
    }

    reapplyTypes(params?:any) {
        _applyTypes(this, params)
    }

    hasType(typeId:string):boolean {
        return this._types.indexOf(typeId) !== -1
    }

    addType(typeId:string, params?:any):void {
        let t = _splitType(typeId), _somethingAdded = false
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                if (!this.hasType(t[i])) {
                    this._types.push(t[i])
                    _somethingAdded = true
                }
            }
            if (_somethingAdded) {
                _applyTypes(this, params)
            }
        }
    }

    removeType(typeId:string, params?:any) {
        let t = _splitType(typeId), _cont = false, _one = (tt:string) =>{
            let idx = this._types.indexOf(tt)
            if (idx !== -1) {
                // remove css class if necessary
                _removeTypeCssHelper(this, idx)
                this._types.splice(idx, 1)
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

    clearTypes(params?:any, doNotRepaint?:boolean):void {
        let i = this._types.length
        for (let j = 0; j < i; j++) {
            _removeTypeCssHelper(this, 0)
            this._types.splice(0, 1)
        }
        _applyTypes(this, params)
    }

    toggleType(typeId:string, params?:any) {
        let t = _splitType(typeId)
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                let idx = this._types.indexOf(t[i])
                if (idx !== -1) {
                    _removeTypeCssHelper(this, idx)
                    this._types.splice(idx, 1)
                }
                else {
                    this._types.push(t[i])
                }
            }

            _applyTypes(this, params)
        }
    }

    applyType(t:any, params?:any):void {
        this.setPaintStyle(t.paintStyle)
        this.setHoverPaintStyle(t.hoverPaintStyle)
        this.mergeParameters(t.parameters)
        this.paintStyleInUse = this.getPaintStyle()

        // overlays?  not overlayMap?
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
                    let c:Overlay = this.getCachedTypeItem("overlay", t.overlays[i].options.id)
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

    setPaintStyle(style:PaintStyle):void {

        this.paintStyle = style
        this.paintStyleInUse = this.paintStyle
        _updateHoverStyle(this)
    }

    getPaintStyle():PaintStyle {
        return this.paintStyle
    }

    setHoverPaintStyle(style:PaintStyle) {
        this.hoverPaintStyle = style
        _updateHoverStyle(this)
    }

    getHoverPaintStyle():PaintStyle {
        return this.hoverPaintStyle
    }

    destroy(force?:boolean):void {

        for (let i in this.overlays) {
            this.instance.destroyOverlay(this.overlays[i])
        }

        if (force || this.typeId == null) {

                this.overlays = {}
                this.overlayPositions = {}

            this.unbind() // this is on EventGenerator
            this.clone = null
        }
    }

    isHover():boolean {
        return this._hover
    }

    mergeParameters(p:ComponentParameters) {
        if (p != null) {
            extend(this.parameters, p)
        }
    }

    setVisible(v:boolean) {
        this.visible = v
        if (v) {
            this.showOverlays()
        } else {
            this.hideOverlays()
        }
    }

    isVisible():boolean {
        return this.visible
    }

    setAbsoluteOverlayPosition(overlay:Overlay, xy:PointXY) {
        this.overlayPositions[overlay.id] = xy
    }

    getAbsoluteOverlayPosition(overlay:Overlay):PointXY {
        return this.overlayPositions ? this.overlayPositions[overlay.id] : null
    }

    private _clazzManip(action:ClassAction, clazz:string) {

        for (let i in this.overlays) {
            if (action === ACTION_ADD) {
                this.instance.addOverlayClass(this.overlays[i], clazz)
            } else if (action === ACTION_REMOVE) {
                this.instance.removeOverlayClass(this.overlays[i], clazz)
            }
        }
    }

    addClass(clazz:string, cascade?:boolean):void {
        let parts = (this.cssClass || "").split(" ")
        parts.push(clazz)
        this.cssClass = parts.join(" ")
        this._clazzManip(ACTION_ADD, clazz)
    }

    removeClass(clazz:string, cascade?:boolean):void {
        let parts = (this.cssClass || "").split(" ")
        this.cssClass = parts.filter((p) => p !== clazz).join(" ")
        this._clazzManip(ACTION_REMOVE, clazz)
    }

    getClass() : string {
        return this.cssClass
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true
    }

    getData () { return this.data; }
    setData (d:any) { this.data = d || {}; }
    mergeData (d:any) { this.data = extend(this.data, d); }

    // =----------- overlays ------------
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
     */
    getOverlay<T extends Overlay>(id:string):T {
        return this.overlays[id] as T
    }

    getOverlays():Dictionary<Overlay> {
        return this.overlays
    }

    hideOverlay(id:string):void {
        let o = this.getOverlay(id)
        if (o) {
            o.setVisible(false)
        }
    }

    hideOverlays():void {
        for (let i in this.overlays) {
            this.overlays[i].setVisible(false)
        }
    }

    showOverlay(id:string):void {
        let o = this.getOverlay(id)
        if (o) {
            o.setVisible(true)
        }
    }

    showOverlays():void {
        for (let i in this.overlays) {
            this.overlays[i].setVisible(true)
        }
    }

    removeAllOverlays():void {
        for (let i in this.overlays) {
            this.instance.destroyOverlay(this.overlays[i])
        }

        this.overlays = {}
        this.overlayPositions = null
        this.overlayPlacements= {}
    }

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

    removeOverlays(...overlays:string[]):void {
        for (let i = 0, j = overlays.length; i < j; i++) {
            this.removeOverlay(arguments[i])
        }
    }

    getLabel():string {
        let lo:LabelOverlay = this.getLabelOverlay()
        return lo != null ? lo.getLabel() : null
    }

    getLabelOverlay():LabelOverlay {
        return this.getOverlay(_internalLabelOverlayId) as LabelOverlay
    }

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

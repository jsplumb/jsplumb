import {PaintStyle} from "../styles"
import  { Dictionary, TypeDescriptor, PointXY} from '../common'
import { JsPlumbInstance } from "../core"
import {clone, extend, log, merge, populate, setToArray} from "../util"
import {EventGenerator} from "../event-generator"
import {Connection} from "../connector/connection-impl"
import {Endpoint} from "../endpoint/endpoint"
import { INTERCEPT_BEFORE_DROP } from '../constants'

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
}

export abstract class Component extends EventGenerator {

    abstract getTypeDescriptor():string
    abstract getDefaultOverlayKey():string
    abstract getIdPrefix():string
    abstract getXY():PointXY

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

        this.id = this.getIdPrefix() + (new Date()).getTime()

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

    applyType(t:TypeDescriptor, params?:any):void {
        this.setPaintStyle(t.paintStyle)
        this.setHoverPaintStyle(t.hoverPaintStyle)
        this.mergeParameters(t.parameters)
        this.paintStyleInUse = this.getPaintStyle()
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
        if (force || this.typeId == null) {
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
    }

    isVisible():boolean {
        return this.visible
    }

    addClass(clazz:string, dontUpdateOverlays?:boolean):void {
        let parts = (this.cssClass || "").split(" ")
        parts.push(clazz)
        this.cssClass = parts.join(" ")
    }

    removeClass(clazz:string, dontUpdateOverlays?:boolean):void {
        let parts = (this.cssClass || "").split(" ")
        this.cssClass = parts.filter((p) => p !== clazz).join(" ")
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
}

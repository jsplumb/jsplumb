import {Component, ComponentOptions} from "./component"
import {convertToFullOverlaySpec, FullOverlaySpec, LabelOverlayOptions, Overlay, OverlaySpec} from "../overlay/overlay"
import {Dictionary, PointXY} from '../common'
import { JsPlumbInstance } from "../core"
import {LabelOverlay} from "../overlay/label-overlay"
import {extend, isFunction, isString, uuid} from "../util"
import {OverlayFactory} from "../factory/overlay-factory"

const _internalLabelOverlayId = "__label"
const TYPE_ITEM_OVERLAY = "overlay"
const LOCATION_ATTRIBUTE = "labelLocation"
const ACTION_ADD = "add"
const ACTION_REMOVE = "remove"

export interface OverlayComponentOptions extends ComponentOptions {
    label?:string
    labelLocation?:number
    overlays?:Array<OverlaySpec>
}

export type ClassAction = "add" | "remove"

function _makeLabelOverlay(component:OverlayCapableComponent, params:LabelOverlayOptions):LabelOverlay {

    let _params:any = {
            cssClass: params.cssClass,
            id: _internalLabelOverlayId,
            component: component
        },
        mergedParams:LabelOverlayOptions = extend<LabelOverlayOptions>(_params, params)

    return new LabelOverlay(component.instance, component, mergedParams)
}

function _processOverlay<E>(component:OverlayCapableComponent, o:OverlaySpec|Overlay) {
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

export abstract class OverlayCapableComponent extends Component {

    defaultLabelLocation:number | [number, number] = 0.5

    overlays:Dictionary<Overlay> = {}
    overlayPositions:Dictionary<PointXY> = {}
    overlayPlacements:Dictionary<{minX:number, maxX:number, minY:number, maxY:number}> = {}

    constructor(public instance:JsPlumbInstance, params: OverlayComponentOptions) {
        super(instance, params)

        params = params || {}

        this.overlays = {}
        this.overlayPositions = {}

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

        let o = params.overlays || [], oo = {}
        let defaultOverlayKey = this.getDefaultOverlayKey()
        if (defaultOverlayKey) {

            const defaultOverlays = this.instance.Defaults[defaultOverlayKey]
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
    }

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
            this.overlays[i].destroy(true)
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
                o.destroy(true)
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

    destroy(force?:boolean) {
        for (let i in this.overlays) {
            this.overlays[i].destroy(force)
        }
        if (force) {
            this.overlays = {}
            this.overlayPositions = {}
        }

        super.destroy(force)
    }

    setVisible(v:boolean):void {
        super.setVisible(v)
        if (v) {
            this.showOverlays()
        } else {
            this.hideOverlays()
        }
    }

    setAbsoluteOverlayPosition(overlay:Overlay, xy:PointXY) {
        this.overlayPositions[overlay.id] = xy
    }

    getAbsoluteOverlayPosition(overlay:Overlay):PointXY {
        return this.overlayPositions ? this.overlayPositions[overlay.id] : null
    }

    private _clazzManip(action:ClassAction, clazz:string, dontUpdateOverlays?:boolean) {
        if (!dontUpdateOverlays) {
            for (let i in this.overlays) {
                if (action === ACTION_ADD) {
                    this.instance.addOverlayClass(this.overlays[i], clazz)
                } else if (action === ACTION_REMOVE) {
                    this.instance.removeOverlayClass(this.overlays[i], clazz)
                }
            }
        }
    }

    addClass(clazz:string, dontUpdateOverlays?:boolean):void {
        super.addClass(clazz)
        this._clazzManip(ACTION_ADD, clazz, dontUpdateOverlays)
    }

    removeClass(clazz:string, dontUpdateOverlays?:boolean):void {
        super.removeClass(clazz)
        this._clazzManip(ACTION_REMOVE, clazz, dontUpdateOverlays)
    }

    applyType(t:any, typeMap:any):void {
        super.applyType(t, typeMap)

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

}

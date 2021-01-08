import {Component, ComponentOptions} from "./component"
import {LabelOverlayOptions, Overlay, OverlaySpec} from "../overlay/overlay"
import { Dictionary, PointArray} from '../common'
import { JsPlumbInstance } from "../core"
import {LabelOverlay} from "../overlay/label-overlay"
import {extend, isArray, isFunction, isString, uuid} from "../util"
import {OverlayFactory} from "../factory/overlay-factory"

const _internalLabelOverlayId = "__label"

export interface OverlayComponentOptions extends ComponentOptions {
    label?:string
    labelLocation?:number
}

export type ClassAction = "add" | "remove"

function _makeLabelOverlay(component:OverlayCapableComponent, params:any):LabelOverlay {

    let _params:any = {
            cssClass: params.cssClass,
            id: _internalLabelOverlayId,
            component: component,
            _jsPlumb: component.instance  // TODO not necessary, since the instance can be accessed through the component.
        },
        mergedParams = extend(_params, params)

    return new LabelOverlay(component.instance, component, mergedParams)
}

function _processOverlay<E>(component:OverlayCapableComponent, o:OverlaySpec|Overlay) {
    let _newOverlay:Overlay = null
    if (isArray(o)) {	// this is for the shorthand ["Arrow", { width:50 }] syntax
        // there's also a three arg version:
        // ["Arrow", { width:50 }, {location:0.7}]
        // which merges the 3rd arg into the 2nd.
        let oa = (<Array<any>>o)
        let type = oa[0],
            // make a copy of the object so as not to mess up anyone else's reference...
            p = extend({}, oa[1])
        if (oa.length === 3) {
            extend(p, oa[2])
        }
        _newOverlay = OverlayFactory.get(component.instance, type, component, p)
    } else if (isString(o)) {
        _newOverlay = OverlayFactory.get(component.instance, o as string, component, {})
    } else {
        _newOverlay = o as Overlay
    }

    _newOverlay.id = _newOverlay.id || uuid()
    component.cacheTypeItem("overlay", _newOverlay, _newOverlay.id)
    component.overlays[_newOverlay.id] = _newOverlay

    return _newOverlay
}

export abstract class OverlayCapableComponent extends Component {

    defaultLabelLocation:number | [number, number] = 0.5

    overlays:Dictionary<Overlay> = {}
    overlayPositions:Dictionary<PointArray> = {}
    overlayPlacements:Dictionary<{minX:number, maxX:number, minY:number, maxY:number}> = {}

    constructor(public instance:JsPlumbInstance, params: OverlayComponentOptions) {
        super(instance, params)

        params = params || {}

        this.overlays = {}
        this.overlayPositions = {}

        if (params.label) {
            this.getDefaultType().overlays[_internalLabelOverlayId] = ["Label", {
                label: params.label,
                location: params.labelLocation || this.defaultLabelLocation,
                id:_internalLabelOverlayId
            }]
        }
    }

    addOverlay(overlay:OverlaySpec, doNotRepaint?:boolean):Overlay {
        let o = _processOverlay(this, overlay)

        if (this.getData && o.type === "Label" && isArray(overlay)) {
            //
            // component data might contain label location - look for it here.
            const d = this.getData(), p = overlay[1]
            if (d) {
                const locationAttribute = (<LabelOverlayOptions>p).labelLocationAttribute || "labelLocation"
                const loc = d[locationAttribute]

                if (loc) {
                    o.location = loc
                }
            }
        }

        if (!doNotRepaint) {
            this.paint()
        }
        return o
    }

    getOverlay(id:string):Overlay {
        return this.overlays[id]
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

    removeAllOverlays(doNotRepaint?:boolean):void {
        for (let i in this.overlays) {
            this.overlays[i].destroy(true)
        }

        this.overlays = {}
        this.overlayPositions = null
        this.overlayPlacements= {}
        if (!doNotRepaint) {
            this.paint()
        }
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
            let params = l.constructor === String || l.constructor === Function ? { label: l } : l
            lo = _makeLabelOverlay(this, params)
            this.overlays[_internalLabelOverlayId] = lo
        }
        else {
            if (isString(l) || isFunction(l)) {
                lo.setLabel(<any>l)
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

        if (!this.instance._suspendDrawing) {
            this.paint()
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
        this[v ? "showOverlays" : "hideOverlays"]()
    }

    setAbsoluteOverlayPosition(overlay:Overlay, xy:PointArray) {
        this.overlayPositions[overlay.id] = xy
    }

    getAbsoluteOverlayPosition(overlay:Overlay):PointArray {
        return this.overlayPositions ? this.overlayPositions[overlay.id] : null
    }

    private _clazzManip(action:ClassAction, clazz:string, dontUpdateOverlays?:boolean) {
        if (!dontUpdateOverlays) {
            for (let i in this.overlays) {
                if (action === "add") {
                    //this.overlays[i].addClass(clazz)
                    this.instance.addOverlayClass(this.overlays[i], clazz)
                } else if (action === "remove") {
                    //this.overlays[i].removeClass(clazz)
                    this.instance.removeOverlayClass(this.overlays[i], clazz)
                }
            }
        }
    }

    addClass(clazz:string, dontUpdateOverlays?:boolean):void {
        super.addClass(clazz)
        this._clazzManip("add", clazz, dontUpdateOverlays)
    }

    removeClass(clazz:string, dontUpdateOverlays?:boolean):void {
        super.removeClass(clazz)
        this._clazzManip("remove", clazz, dontUpdateOverlays)
    }

    applyType(t:any, doNotRepaint:boolean, typeMap:any):void {
        super.applyType(t, doNotRepaint, typeMap)

        // overlays?  not overlayMap?
        if (t.overlays) {
            // loop through the ones in the type. if already present on the component,
            // dont remove or re-add.
            let keep = {}, i

            for (i in t.overlays) {

                let existing:Overlay = this.overlays[t.overlays[i][1].id]
                if (existing) {
                    // maybe update from data, if there were parameterised values for instance.
                    existing.updateFrom(t.overlays[i][1])
                    keep[t.overlays[i][1].id] = true
                    this.instance.reattachOverlay(existing, this)

                }
                else {
                    let c:Overlay = this.getCachedTypeItem("overlay", t.overlays[i][1].id)
                    if (c != null) {
                        this.instance.reattachOverlay(c, this)
                        c.setVisible(true)
                        // maybe update from data, if there were parameterised values for instance.
                        c.updateFrom(t.overlays[i][1])
                        this.overlays[c.id] = c
                    }
                    else {
                        c = this.addOverlay(t.overlays[i], true)
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

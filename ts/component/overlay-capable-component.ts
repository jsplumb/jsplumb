import {Component, ComponentOptions} from "./component";
import {Overlay, OverlaySpec} from "../overlay/overlay";
import {Dictionary, extend, jsPlumbInstance, PointArray} from "../core";
import {LabelOverlay} from "../overlay/label-overlay";
import {LabelStyle} from "../label";
import {isArray, isFunction, isString, uuid} from "../util";
import {OverlayFactory} from "../factory/overlay-factory";

const _internalLabelOverlayId = "__label";

export interface OverlayComponentOptions<E> extends ComponentOptions<E> {
    label?:string;
    labelLocation?:number;
    labelStyle?:LabelStyle;
}

function _makeLabelOverlay<E>(component:OverlayCapableComponent<E>, params:any):LabelOverlay<E> {

    let _params:any = {
            cssClass: params.cssClass,
            labelStyle: component.labelStyle,
            id: _internalLabelOverlayId,
            component: component,
            _jsPlumb: component.instance  // TODO not necessary, since the instance can be accessed through the component.
        },
        mergedParams = extend(_params, params);

    return null;//new LabelOverlay(mergedParams);
}

function _processOverlay<E>(component:OverlayCapableComponent<E>, o:OverlaySpec|Overlay<E>) {
    let _newOverlay:Overlay<E> = null;
    if (isArray(o)) {	// this is for the shorthand ["Arrow", { width:50 }] syntax
        // there's also a three arg version:
        // ["Arrow", { width:50 }, {location:0.7}]
        // which merges the 3rd arg into the 2nd.
        let oa = (<Array<any>>o);
        let type = oa[0],
            // make a copy of the object so as not to mess up anyone else's reference...
            p = extend({}, oa[1]);
        if (oa.length === 3) {
            extend(p, oa[2]);
        }
        _newOverlay = OverlayFactory.get(component.instance, type, component, p);
    } else if (isString(o)) {
        _newOverlay = OverlayFactory.get(component.instance, o as string, component, {});
    } else {
        _newOverlay = o as Overlay<E>;
    }

    _newOverlay.id = _newOverlay.id || uuid();
    component.cacheTypeItem("overlay", _newOverlay, _newOverlay.id);
    component._jsPlumb.overlays[_newOverlay.id] = _newOverlay;

    return _newOverlay;
}

export abstract class OverlayCapableComponent<E> extends Component<E> {

    defaultLabelLocation:number | [number, number] = 0.5;
    labelStyle:LabelStyle;

    overlays:Dictionary<Overlay<E>> = {};
    overlayPositions:Dictionary<PointArray> = {};

    constructor(public instance:jsPlumbInstance<E>, params: OverlayComponentOptions<E>) {
        super(instance, params);

        params = params || {};

        this._jsPlumb.overlays = {};
        this._jsPlumb.overlayPositions = {};

        if (params.label) {
            this.getDefaultType().overlays[_internalLabelOverlayId] = ["Label", {
                label: params.label,
                location: params.labelLocation || this.defaultLabelLocation,
                labelStyle: params.labelStyle || instance.Defaults.labelStyle,
                id:_internalLabelOverlayId
            }];
        }
    }

    setListenerComponent (c:any) {
        if (this._jsPlumb) {

            super.setListenerComponent(c);

            for (let i in this._jsPlumb.overlays) {
                this._jsPlumb.overlays[i].setListenerComponent(c);
            }
        }
    }

    setHover(hover:boolean, ignoreAttachedElements?:boolean):void {
        super.setHover(hover, ignoreAttachedElements);
        if (this._jsPlumb && !this.instance.isConnectionBeingDragged) {
            for (let i in this._jsPlumb.overlays) {
                this._jsPlumb.overlays[i][hover ? "addClass" : "removeClass"](this._jsPlumb.instance.hoverClass);
            }
        }
    }

    addOverlay(overlay:OverlaySpec, doNotRepaint?:boolean):Overlay<E> {
        let o = _processOverlay(this, overlay);
        if (!doNotRepaint) {
            this.repaint();
        }
        return o;
    }

    getOverlay(id:string):Overlay<E> {
        return this._jsPlumb.overlays[id];
    }

    getOverlays():Dictionary<Overlay<E>> {
        return this._jsPlumb.overlays;
    }

    hideOverlay(id:string):void {
    let o = this.getOverlay(id);
        if (o) {
            o.hide();
        }
    }

    hideOverlays():void {
        for (let i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].hide();
        }
    }

    showOverlay(id:string):void {
        let o = this.getOverlay(id);
        if (o) {
            o.show();
        }
    }

    showOverlays():void {
        for (let i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].show();
        }
    }

    removeAllOverlays(doNotRepaint?:boolean):void {
        for (let i in this._jsPlumb.overlays) {
            if (this._jsPlumb.overlays[i].cleanup) {
                this._jsPlumb.overlays[i].cleanup();
            }
        }

        this._jsPlumb.overlays = {};
        this._jsPlumb.overlayPositions = null;
        this._jsPlumb.overlayPlacements= {};
        if (!doNotRepaint) {
            this.repaint();
        }
    }

    removeOverlay(overlayId:string, dontCleanup?:boolean):void {
        let o = this._jsPlumb.overlays[overlayId];
        if (o) {
            o.setVisible(false);
            if (!dontCleanup && o.cleanup) {
                o.cleanup();
            }
            delete this._jsPlumb.overlays[overlayId];
            if (this._jsPlumb.overlayPositions) {
                delete this._jsPlumb.overlayPositions[overlayId];
            }

            if (this._jsPlumb.overlayPlacements) {
                delete this._jsPlumb.overlayPlacements[overlayId];
            }
        }
    }

    removeOverlays(...overlays:string[]):void {
        for (let i = 0, j = overlays.length; i < j; i++) {
            this.removeOverlay(arguments[i]);
        }
    }


    //
    // TODO this component knows about the dom. it shouldnt. of course the label overlay knows all about the dom,
    // and wont actually work in a headless environment yet.
    //
    moveParent(newParent:E):void {
        // if (this.bgCanvas) {
        //     this.instance.removeElement(this.bgCanvas);
        //     this.instance.appendElement(newParent, this.bgCanvas);
        // }
        //
        // if (this.canvas && (<any>this.canvas).parentNode) {
        //     this.instance.removeElement(this.canvas);
        //     this.instance.appendElement(newParent, this.canvas);
        //
        //
        // }
        //
        // for (let i in this._jsPlumb.overlays) {
        //     if (this._jsPlumb.overlays[i].isAppendedAtTopLevel) {
        //         let el = this._jsPlumb.overlays[i].getElement();
        //         this.instance.removeElement(el);
        //         this.instance.appendElement(newParent, el);
        //     }
        // }
    }

    getLabel():string {
        let lo = this.getOverlay(_internalLabelOverlayId);
        return lo != null ? lo.getLabel() : null;
    }

    getLabelOverlay():Overlay<E> {
        return this.getOverlay(_internalLabelOverlayId);
    }

    setLabel(l:string|Function|LabelOverlay<E>):void {
        let lo = this.getOverlay(_internalLabelOverlayId);
        if (!lo) {
            let params = l.constructor === String || l.constructor === Function ? { label: l } : l;
            lo = _makeLabelOverlay(this, params);
            this._jsPlumb.overlays[_internalLabelOverlayId] = lo;
        }
        else {
            if (isString(l) || isFunction(l)) {
                lo.setLabel(<any>l);
            }
            else {
                let ll = l as LabelOverlay<E>;
                if (ll.label) {
                    lo.setLabel(ll.label);
                }
                if (ll.location) {
                    lo.setLocation(ll.location);
                }
            }
        }

        if (!this._jsPlumb.instance.isSuspendDrawing()) {
            this.repaint();
        }
    }

    cleanup(force?:boolean) {
        super.cleanup(force);
        for (let i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].cleanup(force);
            this._jsPlumb.overlays[i].destroy(force);
        }
        if (force) {
            this._jsPlumb.overlays = {};
            this._jsPlumb.overlayPositions = null;
        }
    }

    setVisible(v:boolean):void {
        super.setVisible(v);
        this[v ? "showOverlays" : "hideOverlays"]();
    }

    setAbsoluteOverlayPosition(overlay:Overlay<E>, xy:PointArray) {
        this._jsPlumb.overlayPositions[overlay.id] = xy;
    }

    getAbsoluteOverlayPosition(overlay:Overlay<E>):PointArray {
        return this._jsPlumb.overlayPositions ? this._jsPlumb.overlayPositions[overlay.id] : null;
    }

    private _clazzManip(action:string, clazz:string, dontUpdateOverlays?:boolean) {
        if (!dontUpdateOverlays) {
            for (let i in this._jsPlumb.overlays) {
                this._jsPlumb.overlays[i][action + "Class"](clazz);
            }
        }
    }

    addClass(clazz:string, dontUpdateOverlays?:boolean):void {
        super.addClass(clazz);
        this._clazzManip("add", clazz, dontUpdateOverlays);
    }

    removeClass(clazz:string, dontUpdateOverlays?:boolean):void {
        super.removeClass(clazz);
        this._clazzManip("remove", clazz, dontUpdateOverlays);
    }

    applyType(t:any, doNotRepaint:boolean, typeMap:any):void {
        super.applyType(t, doNotRepaint, typeMap);

        if (t.overlays) {
            // loop through the ones in the type. if already present on the component,
            // dont remove or re-add.
            let keep = {}, i;

            for (i in t.overlays) {

                let existing = this._jsPlumb.overlays[t.overlays[i][1].id];
                if (existing) {
                    // maybe update from data, if there were parameterised values for instance.
                    existing.updateFrom(t.overlays[i][1]);
                    keep[t.overlays[i][1].id] = true;
                }
                else {
                    let c:Overlay<E> = this.getCachedTypeItem("overlay", t.overlays[i][1].id);
                    if (c != null) {
                        c.reattach(this);
                        c.setVisible(true);
                        // maybe update from data, if there were parameterised values for instance.
                        c.updateFrom(t.overlays[i][1]);
                        this._jsPlumb.overlays[c.id] = c;
                    }
                    else {
                        c = this.addOverlay(t.overlays[i], true);
                    }
                    keep[c.id] = true;
                }
            }

            // now loop through the full overlays and remove those that we dont want to keep
            for (i in this._jsPlumb.overlays) {
                if (keep[this._jsPlumb.overlays[i].id] == null) {
                    this.removeOverlay(this._jsPlumb.overlays[i].id, true); // remove overlay but dont clean it up.
                    // that would remove event listeners etc; overlays are never discarded by the types stuff, they are
                    // just detached/reattached.
                }
            }
        }
    }

}

import {ComponentParams, UIComponent} from "../component/ui-component";
import {JsPlumb, JsPlumbInstance} from "../core";
import {isArray, isString} from "../util/_is";
import {log, uuid} from "../util";
import {Overlay} from "./overlay";
import {LabelOverlay} from "./label-overlay";

import {Connection} from "../connection";
import {Endpoint} from "../endpoint";

export abstract class OverlayCapableComponent<EventType, ElementType> extends UIComponent<EventType, ElementType> {

    private static _internalLabelOverlayId = "__label";

    defaultOverlayKeys():Array<string> { return [] };

    labelStyle:string;
    defaultLabelLocation:number|[number, number] = 0.5;

    // this is a shortcut helper method to let people add a label as
    // overlay.
    private _makeLabelOverlay(params?:any) {

        let _params = {
                cssClass: params.cssClass,
                labelStyle: this.labelStyle,
                id: OverlayCapableComponent._internalLabelOverlayId,
                component: this,
                _jsPlumb: this.instance  // TODO not necessary, since the instance can be accessed through the component.
            },
            mergedParams = JsPlumb.extend(_params, params);

        return new LabelOverlay(mergedParams);
    }

    private _processOverlay (o:any) {
        let _newOverlay = null;
        if (isArray(o)) {	// this is for the shorthand ["Arrow", { width:50 }] syntax
            // there's also a three arg version:
            // ["Arrow", { width:50 }, {location:0.7}]
            // which merges the 3rd arg into the 2nd.
            let type = o[0],
                // make a copy of the object so as not to mess up anyone else's reference...
                p = JsPlumb.extend({component: this, _jsPlumb: this.instance}, o[1]);
            if (o.length === 3) {
                JsPlumb.extend(p, o[2]);
            }
            _newOverlay = new Overlay.map[type](p);
        } else if (o.constructor === String) {
            _newOverlay = new Overlay.map[o]({component: this, _jsPlumb: this.instance});
        } else {
            _newOverlay = o;
        }

        _newOverlay.id = _newOverlay.id || uuid();
        this.cacheTypeItem("overlay", _newOverlay, _newOverlay.id);
        this._jsPlumb.overlays[_newOverlay.id] = _newOverlay;

        return _newOverlay;
    };

    constructor(params:any) {

        super(params);

        this._jsPlumb.overlays = {};
        this._jsPlumb.overlayPositions = {};

        let o = params.overlays || [], oo = {};

        let ok = this.defaultOverlayKeys();
        if (ok) {
            for (let i = 0; i < ok.length; i++) {
                Array.prototype.push.apply(o, this.instance.Defaults[ok[i]] || []);
            }

            for (let i = 0; i < o.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = JsPlumbInstance.convertToFullOverlaySpec(o[i]);
                oo[fo[1].id] = fo;
            }
        }

        this.appendToDefaultType({
            overlays:oo
        });

        if (params.label) {
            this.getDefaultType().overlays[OverlayCapableComponent._internalLabelOverlayId] = ["Label", {
                label: params.label,
                location: params.labelLocation || this.defaultLabelLocation || 0.5,
                labelStyle: params.labelStyle || this.instance.Defaults.LabelStyle,
                id:OverlayCapableComponent._internalLabelOverlayId
            }];
        }
    }

    /**
     * Overridden from UIComponent
     * @param t
     * @param doNotRepaint
     * @param typeMap
     */
    applyType(t:any, doNotRepaint:Boolean, typeMap?:any) {

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
                    let c = this.getCachedTypeItem("overlay", t.overlays[i][1].id);
                    if (c != null) {
                        c.reattach(this.instance, this);
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

    /**
     * overridden from UIComponent
     * @param hover
     * @param ignoreAttachedElements
     * @param timestamp
     */
    setHover(hover: Boolean, ignoreAttachedElements?: Boolean, timestamp?: string): any {

        super.setHover(hover, ignoreAttachedElements, timestamp);

        if (this._jsPlumb && !this.instance.isConnectionBeingDragged()) {
            for (let i in this._jsPlumb.overlays) {
                this._jsPlumb.overlays[i][hover ? "addClass" : "removeClass"](this.instance.hoverClass);
            }
        }
    }

    addOverlay(overlay:any, doNotRepaint?:Boolean) {
    let o = this._processOverlay(overlay);
        if (!doNotRepaint) {
            this.repaint();
        }
        return o;
    }

    getOverlay(id:string) {
        return this._jsPlumb.overlays[id];
    }

    getOverlays() {
        return this._jsPlumb.overlays;
    }

    hideOverlay(id:string) {
        let o = this.getOverlay(id);
        if (o) {
            o.hide();
        }
    }

    hideOverlays() {
        for (let i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].hide();
        }
    }

    showOverlay(id:string) {
        let o = this.getOverlay(id);
        if (o) {
            o.show();
        }
    }

    showOverlays() {
        for (let i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].show();
        }
    }

    removeAllOverlays(doNotRepaint?:Boolean) {
        for (let i in this._jsPlumb.overlays) {
            if (this._jsPlumb.overlays[i].cleanup) {
                this._jsPlumb.overlays[i].cleanup();
            }
        }

        this._jsPlumb.overlays = {};
        this._jsPlumb.overlayPositions = null;
        if (!doNotRepaint) {
            this.repaint();
        }
    }

    removeOverlay(overlayId:string, dontCleanup?:Boolean) {
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
        }
    }

    removeOverlays() {
        for (let i = 0, j = arguments.length; i < j; i++) {
            this.removeOverlay(arguments[i]);
        }
    }

    getLabel() {
        let lo = this.getOverlay(OverlayCapableComponent._internalLabelOverlayId);
        return lo != null ? lo.getLabel() : null;
    }

    getLabelOverlay() {
        return this.getOverlay(OverlayCapableComponent._internalLabelOverlayId);
    }

    setLabel(l:any) {
        let lo = this.getOverlay(OverlayCapableComponent._internalLabelOverlayId);
        if (!lo) {
            let params = l.constructor === String || l.constructor === Function ? { label: l } : l;
            lo = this._makeLabelOverlay(params);
            this._jsPlumb.overlays[OverlayCapableComponent._internalLabelOverlayId] = lo;
        }
        else {
            if (l.constructor === String || l.constructor === Function) {
                lo.setLabel(l);
            }
            else {
                if (l.label) {
                    lo.setLabel(l.label);
                }
                if (l.location) {
                    lo.setLocation(l.location);
                }
            }
        }

        if (!this.instance.isSuspendDrawing()) {
            this.repaint();
        }
    }

    // cleanup(force?:Boolean) {
    //  does this component need to implement this?
    // }

    moveParent(newParent:ElementType) {
        if (this.bgCanvas) {
            (<any>this.bgCanvas).parentNode.removeChild(this.bgCanvas);
            (<any>newParent).appendChild(this.bgCanvas);
        }

        if (this.canvas && (<any>this.canvas).parentNode) {
            (<any>this.canvas).parentNode.removeChild(this.canvas);
            (<any>newParent).appendChild(this.canvas);

            for (let i in this._jsPlumb.overlays) {
                if (this._jsPlumb.overlays[i].isAppendedAtTopLevel) {
                    let el = this._jsPlumb.overlays[i].getElement();
                    el.parentNode.removeChild(el);
                    (<any>newParent).appendChild(el);
                }
            }
        }
    }

    getAbsoluteOverlayPosition(overlay:any) {
        return this._jsPlumb.overlayPositions ? this._jsPlumb.overlayPositions[overlay.id] : null;
    }

    //reattach(instance:JsPlumbInstance<EventType, ElementType>) {
        //super.reattach(instance)
        // does this component need to implement this
    //}

    isDetachAllowed(connection:Connection<EventType, ElementType>) {
        let r = true;
        if (this._jsPlumb.beforeDetach) {
            try {
                r = this._jsPlumb.beforeDetach(connection);
            }
            catch (e) {
                log("jsPlumb: beforeDetach callback failed", e);
            }
        }
        return r;
    }

    isDropAllowed (sourceId:string, targetId:string, scope:string, connection:Connection<EventType, ElementType>, dropEndpoint:Endpoint<EventType, ElementType>, source:ElementType, target:ElementType) {
        let r = this.instance.checkCondition("beforeDrop", {
            sourceId: sourceId,
            targetId: targetId,
            scope: scope,
            connection: connection,
            dropEndpoint: dropEndpoint,
            source: source, target: target
        });
        if (this._jsPlumb.beforeDrop) {
            try {
                r = this._jsPlumb.beforeDrop({
                    sourceId: sourceId,
                    targetId: targetId,
                    scope: scope,
                    connection: connection,
                    dropEndpoint: dropEndpoint,
                    source: source, target: target
                });
            }
            catch (e) {
                log("jsPlumb: beforeDrop callback failed", e);
            }
        }
        return r;
    }

    shouldFireEvent(event: string, value: any, originalEvent?: EventType): Boolean {
        return true;
    }

}

import {ViewAdapter} from "../view-adapter";
import {RawElement} from "./dom-adapter";
import {JsPlumbInstance} from "../core";
import {each, log, trim} from "../util";
import {isArray} from "../util/_is";
import { ArrayLocation, LeftTopLocation } from "../jsplumb-defaults";
import {Connector} from "../connector/connector";
import {ConnectorRenderer} from "../renderer/ConnectorRenderer";
import {SvgConnector} from "../renderer/svg/svg-connector";

export class DomViewAdapter implements ViewAdapter<Event, RawElement> {

    instance:JsPlumbInstance<Event, RawElement>;

    constructor(instance:JsPlumbInstance<Event, RawElement>) {
        this.instance = instance;
    }

// --------------- private methods ------------------------------

    private _getClassName(el:RawElement):string {
        return (typeof el.className.baseVal === "undefined") ? el.className : el.className.baseVal;
    }

    private _setClassName(el:RawElement, cn:string, classList:Array<string>) {
        cn = trim(cn);
        if (typeof el.className.baseVal !== "undefined") {
            el.className.baseVal = cn;
        }
        else {
            el.className = cn;
        }

        // recent (i currently have  61.0.3163.100) version of chrome do not update classList when you set the base val
        // of an svg element's className. in the long run we'd like to move to just using classList anyway
        try {
            let cl = el.classList;
            while (cl.length > 0) {
                cl.remove(cl.item(0));
            }
            for (let i = 0; i < classList.length; i++) {
                if (classList[i]) {
                    cl.add(classList[i]);
                }
            }
        }
        catch(e) {
            // not fatal
            log("cannot set class list", e);
        }
    }

    private _classManip(el:RawElement, classesToAdd:string|Array<string>, classesToRemove?:string|Array<string>) {
        classesToAdd = classesToAdd == null ? [] : isArray(classesToAdd) ? classesToAdd : classesToAdd.split(/\s+/);
        classesToRemove = classesToRemove == null ? [] : isArray(classesToRemove) ? classesToRemove : classesToRemove.split(/\s+/);

        let className = this._getClassName(el),
            curClasses = className.split(/\s+/);

        let _oneSet = (add:Boolean, classes:Array<string>) => {
            for (let i = 0; i < classes.length; i++) {
                if (add) {
                    if (curClasses.indexOf(classes[i]) === -1) {
                        curClasses.push(classes[i]);
                    }
                }
                else {
                    let idx = curClasses.indexOf(classes[i]);
                    if (idx !== -1) {
                        curClasses.splice(idx, 1);
                    }
                }
            }
        };

        _oneSet(true, classesToAdd);
        _oneSet(false, classesToRemove);

        this._setClassName(el, curClasses.join(" "), curClasses);
    }

    _genLoc(prefix:string, e:Event) {
        if (e == null) {
            return [ 0, 0 ];
        }
        let ts = this._touches(e), t = this._getTouch(ts, 0);
        return [t[prefix + "X"], t[prefix + "Y"]];
    }

    // _pageLocation = _genLoc.bind(this, "page"),
    // _screenLocation = _genLoc.bind(this, "screen"),
    // _clientLocation = _genLoc.bind(this, "client"),
    //
    _getTouch(touches:TouchList, idx:number) {
        return touches.item ? touches.item(idx) : touches[idx];
    }

    _touches(e:any) {
        return e.touches && e.touches.length > 0 ? e.touches :
            e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches :
                e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches :
                    [ e ];
    };

// -------------- / private methods --------------------

    getSelector(ctx: any, spec: string): any {

        let sel = null;
        if (arguments.length === 1 || typeof arguments[1] === "undefined") {
            sel = ctx.nodeType != null ? ctx : document.querySelectorAll(ctx);
        }
        else {
            ctx = ctx || document;
            sel = ctx.querySelectorAll(spec);
        }

        return sel;
    }

    appendToRoot(node:RawElement) {
        document.body.appendChild(node);
    }


    trigger(el: RawElement, event: string, originalEvent?: Event, payload?:any): void {
        this.instance.getEventManager().trigger(el, event, originalEvent, payload);
    }

    // on(el:ElementType, evt:string, fn:Function):any;
    //
    // off(el:ElementType, fn:Function):any;

    // getAttrub(el:RawElement) {
    //     return el.getAttribute("id")
    // }

    getSize(el:RawElement):[number,number] {
        return [ el.offsetWidth, el.offsetHeight ];
    }

    getWidth(el:RawElement):number {
        return el.offsetWidth;
    }

    getHeight(el:RawElement):number {
        return el.offsetHeight;
    }

    getOffset(el:RawElement, relativeToRoot?:Boolean, container?:RawElement) {
        el = this.instance.getElement(el);
        container = container || this.instance.getContainer();

        let out = {
                left: el.offsetLeft,
                top: el.offsetTop
            },
            op = (relativeToRoot  || (container != null && (el !== container && el.offsetParent !== container))) ?  el.offsetParent : null,
            _maybeAdjustScroll = (offsetParent:RawElement) => {
                if (offsetParent != null && (<any>offsetParent) !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
                    out.left -= offsetParent.scrollLeft;
                    out.top -= offsetParent.scrollTop;
                }
            };

        while (op != null) {
            out.left += op.offsetLeft;
            out.top += op.offsetTop;
            _maybeAdjustScroll(op);
            op = relativeToRoot ? op.offsetParent :
                op.offsetParent === container ? null : op.offsetParent;
        }

    // if container is scrolled and the element (or its offset parent) is not absolute or fixed, adjust accordingly.
        if (container != null && !relativeToRoot && (container.scrollTop > 0 || container.scrollLeft > 0)) {
            let pp = el.offsetParent != null ? this.getStyle(el.offsetParent, "position") : "static",
                p = this.getStyle(el, "position");

            if (p !== "absolute" && p !== "fixed" && pp !== "absolute" && pp !== "fixed") {
                out.left -= container.scrollLeft;
                out.top -= container.scrollTop;
            }
        }
        return out;
    }


    createElement(tag: string, style?: Map<string, string>, clazz?: string, atts?: Map<string, string>): RawElement {
        return this.createElementNS(null, tag, style, clazz, atts);
    }


    createElementNS(ns: string, tag: string, style?: Map<string, string>, clazz?: string, atts?: Map<string, string>): RawElement {
        let e:Element = ns == null ? document.createElement(tag) : document.createElementNS(ns, tag);
        let re:RawElement = <RawElement>e;
        let i;
        style = style || new Map();
        for (i in style) {
            re.style[i] = style[i];
        }

        if (clazz) {
            e.className = clazz;
        }

        atts = atts || new Map();
        for (i in atts) {
            e.setAttribute(i, "" + atts[i]);
        }

        return re;
    }

    getAttribute(el:RawElement, attName:string):string {
        return el.getAttribute != null ? el.getAttribute(attName) : null;
    }

    setAttribute(el:RawElement, attName:string, attValue:string):void {
        if (el.setAttribute != null) {
            el.setAttribute(attName, attValue);
        }
    }

    setAttributes(el:RawElement, atts:Map<string, string>):void {
        for (let i in atts) {
            if (atts.hasOwnProperty(i)) {
                el.setAttribute(i, atts[i]);
            }
        }
    }

    getClass(el:RawElement) {
        return this._getClassName(el);
    }


    addClass(el: RawElement, clazz: string): void {
        this.instance.each(el, (e:RawElement) => {
            this._classManip(e, clazz);
        })
    }

    hasClass(el: RawElement, clazz: string): Boolean {
        el = this.instance.getElement(el);
        if (el.classList) {
            return el.classList.contains(clazz);
        }
        else {
            return this._getClassName(el).indexOf(clazz) !== -1;
        }
    }

    removeClass(el: RawElement, clazz: string): void {
        this.instance.each(el, (e:RawElement) => {
            this._classManip(e, null, clazz);
        });
    }

    updateClasses(el: RawElement, toAdd: string | Array<string>, toRemove?: string | Array<string>): void {
        this.instance.each(el, (e:RawElement) => {
            this._classManip(e, toAdd, toRemove);
        });
    }


    setClass(el: RawElement, clazz: string): void {
        if (clazz != null) {
            this.instance.each(el, (e:RawElement) => {
                this._setClassName(e, clazz, clazz.split(/\s+/));
            });
        }
    }

    setPosition(el: RawElement, p: LeftTopLocation): void {
        el.style.left = p.left + "px";
        el.style.top = p.top + "px";
    }

    getPosition(el: RawElement): LeftTopLocation {
        let _one = function (prop:string) {
            let v = el.style[prop];
            return v ? v.substring(0, v.length - 2) : 0;
        };
        return {
            left: _one("left"),
            top: _one("top")
        };
    }


    getStyle(el: RawElement, prop: string): string {
        if (typeof window.getComputedStyle !== 'undefined') {
            return getComputedStyle(el, null).getPropertyValue(prop);
        } else {
            return el.currentStyle[prop];
        }
    }


    getPositionOnElement(evt: Event, el: RawElement, zoom: number): ArrayLocation {
        let box = typeof el.getBoundingClientRect !== "undefined" ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 },
            body = document.body,
            docElem = document.documentElement,
            scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
            scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            pst = 0,
            psl = 0,
            top = box.top + scrollTop - clientTop + (pst * zoom),
            left = box.left + scrollLeft - clientLeft + (psl * zoom),
            cl = this.pageLocation(evt),
            w = box.width || (el.offsetWidth * zoom),
            h = box.height || (el.offsetHeight * zoom),
            x = (cl[0] - left) / w,
            y = (cl[1] - top) / h;

        return [ x, y ];
    }


    pageLocation(evt: Event): ArrayLocation {
        return this._genLoc("page", evt);
    }

    screenLocation(evt: Event): ArrayLocation {
        return this._genLoc("screen", evt);
    }

    clientLocation(evt: Event): ArrayLocation {
        return this._genLoc("client", evt);
    }

    getUIPosition(eventArgs:any, zoom:number):LeftTopLocation {
        // here the position reported to us by Katavorio is relative to the element's offsetParent. For top
        // level nodes that is fine, but if we have a nested draggable then its offsetParent is actually
        // not going to be the jsplumb container; it's going to be some child of that element. In that case
        // we want to adjust the UI position to account for the offsetParent's position relative to the Container
        // origin.
        let el = eventArgs.el;
        if (el.offsetParent == null) {
            return null;
        }
        let finalPos = eventArgs.finalPos || eventArgs.pos;
        let p = { left:finalPos[0], top:finalPos[1] };
        if (el._katavorioDrag && el.offsetParent !== this.instance.getContainer()) {
            let oc = this.getOffset(el.offsetParent);
            p.left += oc.left;
            p.top += oc.top;
        }
        return p;
    }


    createConnectorRenderer(connector: Connector<Event, RawElement>): ConnectorRenderer {
        return new SvgConnector(connector);
    }

    removeElement(el: RawElement): void {
        (<any>this.instance).getDragManager().elementRemoved(el);
    }
}
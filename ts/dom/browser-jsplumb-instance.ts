import {jsPlumbDefaults} from "../defaults";
import {Dictionary, jsPlumbInstance, Offset, PointArray, Size} from "../core";
import {BrowserRenderer} from "./browser-renderer";
import {fastTrim, isArray, isString, log} from "../util";
import {DragManager} from "./drag-manager";
import {ElementDragHandler} from "./element-drag-handler";
import {EndpointDragHandler} from "./endpoint-drag-handler";

declare const Mottle:any;
declare const Biltong:any;
declare const Katavorio:any;


export interface DragEventCallbackOptions {
    drag: object; // The associated Drag instance
    e: MouseEvent;
    el: HTMLElement; // element being dragged
    pos: [number, number]; // x,y location of the element. drag event only.
}

export interface DragOptions {
    containment?: string;
    start?: (params:DragEventCallbackOptions) => void;
    drag?: (params:DragEventCallbackOptions) => void;
    stop?: (params:DragEventCallbackOptions) => void;
    cursor?: string;
    zIndex?: number;
}

export interface DropOptions {
    hoverClass: string;
}

export interface BrowserJsPlumbDefaults extends jsPlumbDefaults {
    dragOptions?: DragOptions;
}

function _setClassName (el:HTMLElement, cn:string, classList:Array<string>):void {
    cn = fastTrim(cn);

    if (typeof (<any>el.className).baseVal !== "undefined") {
        (<any>el.className).baseVal = cn;
    }
    else {
        el.className = cn;
    }

    // recent (i currently have  61.0.3163.100) version of chrome do not update classList when you set the base val
    // of an svg element's className. in the long run we'd like to move to just using classList anyway
    try {
        let cl = el.classList;
        if (cl != null) {
            while (cl.length > 0) {
                cl.remove(cl.item(0));
            }
            for (let i = 0; i < classList.length; i++) {
                if (classList[i]) {
                    cl.add(classList[i]);
                }
            }
        }
    }
    catch(e) {
        // not fatal
        log("JSPLUMB: cannot set class list", e);
    }
}

//
// get the class name for either an html element or an svg element.
function _getClassName (el:HTMLElement):string {
     return (typeof (<any>el.className).baseVal === "undefined") ? el.className : (<any>el.className).baseVal as string;
}

function _classManip(el:HTMLElement, classesToAdd:string | Array<string>, classesToRemove?:string | Array<String>) {
    const cta:Array<string> = classesToAdd == null ? [] : isArray(classesToAdd) ? classesToAdd as string[] : (classesToAdd as string).split(/\s+/);
    const ctr:Array<string> = classesToRemove == null ? [] : isArray(classesToRemove) ? classesToRemove as string[] : (classesToRemove as string).split(/\s+/);

    let className = _getClassName(el),
        curClasses = className.split(/\s+/);

    const _oneSet =  (add:boolean, classes:Array<string>) => {
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

    _oneSet(true, cta);
    _oneSet(false, ctr);

    _setClassName(el, curClasses.join(" "), curClasses);
}

// function _animProps (o:any, p:any):[any, any] {
//     const _one = (pName:any) => {
//         if (p[pName] != null) {
//             if (isString(p[pName])) {
//                 let m = p[pName].match(/-=/) ? -1 : 1,
//                     v = p[pName].substring(2);
//                 return o[pName] + (m * v);
//             }
//             else {
//                 return p[pName];
//             }
//         }
//         else {
//             return o[pName];
//         }
//     };
//     return [ _one("left"), _one("top") ];
// }
// //
function _genLoc (prefix:string, e?:Event):PointArray {
    if (e == null) {
        return [ 0, 0 ];
    }
    let ts = _touches(e), t = _getTouch(ts, 0);
    return [t[prefix + "X"], t[prefix + "Y"]];
}

const _pageLocation = _genLoc.bind(null, "page");
//
// const _screenLocation = _genLoc.bind(null, "screen");
//
// const _clientLocation = _genLoc.bind(null, "client");

function _getTouch (touches:any, idx:number):Touch {
    return touches.item ? touches.item(idx) : touches[idx];
}
function _touches (e:Event):Array<Touch> {
    let _e = <any>e;
    return _e.touches && _e.touches.length > 0 ? _e.touches :
        _e.changedTouches && _e.changedTouches.length > 0 ? _e.changedTouches :
            _e.targetTouches && _e.targetTouches.length > 0 ? _e.targetTouches :
                [ _e ];
}
//
//
// type IntersectingGroup<E> = {
//     group:Group<E>;
//     d:number;
// }
//
// type GroupLocation<E> = {
//     el:E;
//     r: BoundingBox;
//     group: Group<E>;
// }

// ------------------------------------------------------------------------------------------------------------

export class BrowserJsPlumbInstance extends jsPlumbInstance<HTMLElement> {


    dragManager:DragManager;

    constructor(protected _instanceIndex:number, defaults?:BrowserJsPlumbDefaults) {
        super(_instanceIndex, new BrowserRenderer(), defaults);
        //this.eventManager = new Mottle();
        this.dragManager = new DragManager(this);

        this.dragManager.addHandler(new EndpointDragHandler(this));
        this.dragManager.addHandler(new ElementDragHandler(this));

    }

    getElement(el:HTMLElement|string):HTMLElement {
        if (el == null) {
            return null;
        }
        // here we pluck the first entry if el was a list of entries.
        // this is not my favourite thing to do, but previous versions of
        // jsplumb supported jquery selectors, and it is possible a selector
        // will be passed in here.
        el = typeof el === "string" ? el : (<any>el).length != null && (<any>el).enctype == null ? el[0] : el;
        return (typeof el === "string" ? document.getElementById(el) : el) as HTMLElement;
    }

    removeElement(element:HTMLElement | string):void {
        // seems to barf at the moment due to scoping. might need to produce a new
        // version of mottle.
        this.eventManager.remove(element);
    }

    appendElement(el:HTMLElement, parent?:HTMLElement):void {
        let _container = this.getContainer();
        if (_container) {
            _container.appendChild(el);
        }
        else if (!parent) {
            this.appendToRoot(el);
        }
        else {
            this.getElement(parent).appendChild(el);
        }
    }

    appendToRoot(node:HTMLElement):void {
        document.body.appendChild(node);
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true;
    }

    getClass(el:HTMLElement):string { return _getClassName(el); }

    addClass(el:HTMLElement, clazz:string):void {

        if (el != null && clazz != null && clazz.length > 0) {

            this.each(el, (_el:HTMLElement) => {
                if (_el.classList) {
                    let classes = Array.isArray(clazz) ? clazz : fastTrim(clazz).split(/\s+/);
                    (<any>window).DOMTokenList.prototype.add.apply(_el.classList, classes);

                } else {
                    _classManip(_el, clazz);
                }

            });

        }
    }

    hasClass(el:HTMLElement, clazz:string):boolean {
        if (el.classList) {
            return el.classList.contains(clazz);
        }
        else {
            return _getClassName(el).indexOf(clazz) !== -1;
        }
    }

    removeClass(el:HTMLElement, clazz:string):void {
        if (el != null && clazz != null && clazz.length > 0) {
            this.each(el, (_el:HTMLElement) => {
                if (_el.classList) {
                    (<any>window).DOMTokenList.prototype.remove.apply(_el.classList, clazz.split(/\s+/));
                } else {
                    _classManip(_el, null, clazz);
                }
            });
        }
    }

    toggleClass(el:HTMLElement, clazz:string):void {
        if (el != null && clazz != null && clazz.length > 0) {
            this.each(el, (_el:HTMLElement) => {
                if (_el.classList) {
                    _el.classList.toggle(clazz);
                }
                else {
                    if (this.hasClass(_el, clazz)) {
                        this.removeClass(_el, clazz);
                    } else {
                        this.addClass(_el, clazz);
                    }
                }
            });
        }
    }

    setAttribute(el:HTMLElement, name:string, value:string):void {
        el.setAttribute(name, value);
    }

    getAttribute(el:HTMLElement, name:string):string {
        return el.getAttribute(name);
    }

    setAttributes(el:HTMLElement, atts:Dictionary<string>) {
        for (let i in atts) {
            if (atts.hasOwnProperty(i)) {
                el.setAttribute(i, atts[i]);
            }
        }
    }

    removeAttribute(el:HTMLElement, attName:string) {
        el.removeAttribute && el.removeAttribute(attName);
    }

    on (el:HTMLElement, event:string, callbackOrSelector:Function|string, callback?:Function) {
        // TODO: here we would like to map the tap event if we know its
        // an internal bind to a click. we have to know its internal because only
        // then can we be sure that the UP event wont be consumed (tap is a synthesized
        // event from a mousedown followed by a mouseup).
        //event = { "click":"tap", "dblclick":"dbltap"}[event] || event;
        this.eventManager.on.apply(this, arguments);
        return this;
    }

    off (el:HTMLElement, event:string, callback:Function) {
        this.eventManager.off.apply(this, arguments);
        return this;
    }

    trigger(el:HTMLElement, event:string, originalEvent?:Event, payload?:any) {
        this.eventManager.trigger(el, event, originalEvent, payload);
    }

    getOffset(el:HTMLElement, relativeToRoot?:boolean, container?:HTMLElement):Offset {
     //   window.jtime("get offset");
        //console.log("get offset arg was " + el);
        //el = jsPlumb.getElement(el);
        container = container || this.getContainer();
        let out:Offset = {
                left: el.offsetLeft,
                top: el.offsetTop
            },
            op = ( (relativeToRoot  || (container != null && (el !== container && el.offsetParent !== container))) ?  el.offsetParent : null ) as HTMLElement,
            _maybeAdjustScroll = (offsetParent:HTMLElement) => {
                if (offsetParent != null && offsetParent !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
                    out.left -= offsetParent.scrollLeft;
                    out.top -= offsetParent.scrollTop;
                }
            };

        while (op != null) {
            out.left += op.offsetLeft;
            out.top += op.offsetTop;
            _maybeAdjustScroll(op);
            op = (relativeToRoot ? op.offsetParent :
                op.offsetParent === container ? null : op.offsetParent) as HTMLElement;
        }

        // if container is scrolled and the element (or its offset parent) is not absolute or fixed, adjust accordingly.
        if (container != null && !relativeToRoot && (container.scrollTop > 0 || container.scrollLeft > 0)) {
            let pp = el.offsetParent != null ? this.getStyle(el.offsetParent as HTMLElement, "position") : "static",
                p = this.getStyle(el, "position");
            if (p !== "absolute" && p !== "fixed" && pp !== "absolute" && pp !== "fixed") {
                out.left -= container.scrollLeft;
                out.top -= container.scrollTop;
            }
        }
        //window.jtimeEnd("get offset");

        return out;
    }

    getSize(el:HTMLElement):Size {
        return [ el.offsetWidth, el.offsetHeight ];
    }

    createElement(tag:string, style?:Dictionary<any>, clazz?:string, atts?:Dictionary<string>):HTMLElement {
        return this.createElementNS(null, tag, style, clazz, atts);
    }

    createElementNS(ns:string, tag:string, style?:Dictionary<any>, clazz?:string, atts?:Dictionary<string>):HTMLElement {
        let e = (ns == null ? document.createElement(tag) : document.createElementNS(ns, tag)) as HTMLElement;
        let i;
        style = style || {};
        for (i in style) {
            e.style[i] = style[i];
        }

        if (clazz) {
            e.className = clazz;
        }

        atts = atts || {};
        for (i in atts) {
            e.setAttribute(i, "" + atts[i]);
        }

        return e;
    }

    getStyle(el:HTMLElement, prop:string):any {
        if (typeof window.getComputedStyle !== 'undefined') {
            return getComputedStyle(el, null).getPropertyValue(prop);
        } else {
            return (<any>el).currentStyle[prop];
        }
    }

    getSelector(ctx:string | HTMLElement, spec:string):NodeListOf<any> {

        let sel:NodeListOf<any> = null;
        if (arguments.length === 1) {
            if (!isString(ctx)) {

                let nodeList = document.createDocumentFragment();
                nodeList.appendChild(ctx as HTMLElement);

                //return ctx as [ HTMLElement ];
                return nodeList.childNodes;
            }

            sel = document.querySelectorAll(<string>ctx);
        }
        else {
            sel = (<HTMLElement>ctx).querySelectorAll(<string>spec);
        }

        return sel;
    }

    setPosition(el:HTMLElement, p:Offset):void {
        el.style.left = p.left + "px";
        el.style.top = p.top + "px";
    }

    //
    // TODO investigate if this is still entirely necessary, since its only used by the drag stuff yet is declared as abstract on the jsPlumbInstance class.
    //
    getUIPosition(eventArgs:any):Offset {
        // here the position reported to us by Katavorio is relative to the element's offsetParent. For top
        // level nodes that is fine, but if we have a nested draggable then its offsetParent is actually
        // not going to be the jsplumb container; it's going to be some child of that element. In that case
        // we want to adjust the UI position to account for the offsetParent's position relative to the Container
        // origin.
        let el = eventArgs[0].el;
        if (el.offsetParent == null) {
            return null;
        }
        let finalPos = eventArgs[0].finalPos || eventArgs[0].pos;
        let p = { left:finalPos[0], top:finalPos[1] };
        if (el._katavorioDrag && el.offsetParent !== this.getContainer()) {
            let oc = this.getOffset(el.offsetParent);
            p.left += oc.left;
            p.top += oc.top;
        }
        return p;
    }

    getDragScope(el:any):string {
        return el._katavorioDrag && el._katavorioDrag.scopes.join(" ") || "";
    }

    getPositionOnElement(evt:Event, el:HTMLElement, zoom:number) {
        let box:any = typeof el.getBoundingClientRect !== "undefined" ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 },
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
            cl = _pageLocation(evt),
            w = box.width || (el.offsetWidth * zoom),
            h = box.height || (el.offsetHeight * zoom),
            x = (cl[0] - left) / w,
            y = (cl[1] - top) / h;

        return [ x, y ];
    }
}

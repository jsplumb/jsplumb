import {jsPlumbDefaults} from "../defaults";
import {BoundingBox, Dictionary, jsPlumbInstance, Offset, PointArray, Size} from "../core";
import {BrowserRenderer} from "./browser-renderer";
import {fastTrim, isArray, isString, log} from "../util";
import {PaintStyle} from "../styles";
import {Anchor} from "../anchor/anchor";
import {Endpoint} from "../endpoint/endpoint-impl";
import {Group} from "../group/group";
import {FloatingAnchor} from "../anchor/floating-anchor";
import {DragManager} from "./drag-manager";

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

function selectorFilter (evt:Event, _el:HTMLElement, selector:string, _instance:jsPlumbInstance<HTMLElement>, negate?:boolean):boolean {
    let t = evt.target || evt.srcElement, 
        ok = false,
        sel = _instance.getSelector(_el, selector);
    
    for (let j = 0; j < sel.length; j++) {
        if (sel[j] === t) {
            ok = true;
            break;
        }
    }
    return negate ? !ok : ok;
}

// creates a placeholder div for dragging purposes, adds it, and pre-computes its offset.
function _makeDraggablePlaceholder(placeholder:any, instance:jsPlumbInstance<HTMLElement>, ipco:any, ips:any):HTMLElement {
    let n = instance.createElement("div", { position : "absolute" });
    instance.appendElement(n);
    let id = instance.getId(n);
    instance.setPosition(n, ipco);
    n.style.width = ips[0] + "px";
    n.style.height = ips[1] + "px";
    instance.manage(id, n); // TRANSIENT MANAGE
    // create and assign an id, and initialize the offset.
    placeholder.id = id;
    placeholder.element = n;
    return n;
}

// create a floating endpoint (for drag connections)
function _makeFloatingEndpoint (paintStyle:PaintStyle, referenceAnchor:Anchor<HTMLElement>, endpoint:Endpoint<HTMLElement>, referenceCanvas:HTMLElement, sourceElement:HTMLElement, instance:jsPlumbInstance<HTMLElement>, scope?:string) {
    let floatingAnchor = new FloatingAnchor(instance, { reference: referenceAnchor, referenceCanvas: referenceCanvas });
    //setting the scope here should not be the way to fix that mootools issue.  it should be fixed by not
    // adding the floating endpoint as a droppable.  that makes more sense anyway!
    // TRANSIENT MANAGE
    return instance.newEndpoint({
        paintStyle: paintStyle,
        endpoint: endpoint,
        anchor: floatingAnchor,
        source: sourceElement,
        scope: scope
    });
}




// var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil,
//     _jk = root.Katavorio, _jg = root.Biltong;

// var _getEventManager = function(instance) {
//     var e = instance._mottle;
//     if (!e) {
//         e = instance._mottle = new root.Mottle();
//     }
//     return e;
// };

function hasManagedParent(container:HTMLElement, el:HTMLElement):boolean {
    let _el = <any>el;
    let pn:any = _el.parentNode;
    while (pn != null && pn !== container) {
        if (pn.getAttribute("jtk-managed") != null) {
            return true;
        } else {
            pn = pn.parentNode;
        }
    }
}

// var _dragOffset = null, _groupLocations = [], _intersectingGroups = [], payload;

function _animProps (o:any, p:any):[any, any] {
    const _one = (pName:any) => {
        if (p[pName] != null) {
            if (isString(p[pName])) {
                let m = p[pName].match(/-=/) ? -1 : 1,
                    v = p[pName].substring(2);
                return o[pName] + (m * v);
            }
            else {
                return p[pName];
            }
        }
        else {
            return o[pName];
        }
    };
    return [ _one("left"), _one("top") ];
}

function _genLoc (prefix:string, e?:Event):PointArray {
    if (e == null) {
        return [ 0, 0 ];
    }
    let ts = _touches(e), t = _getTouch(ts, 0);
    return [t[prefix + "X"], t[prefix + "Y"]];
}

const _pageLocation = _genLoc.bind(null, "page");

const _screenLocation = _genLoc.bind(null, "screen");

const _clientLocation = _genLoc.bind(null, "client");

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


type IntersectingGroup<E> = {
    group:Group<E>;
    d:number;
}

type GroupLocation<E> = {
    el:E;
    r: BoundingBox;
    group: Group<E>;
}

// ------------------------------------------------------------------------------------------------------------

export class BrowserJsPlumbInstance extends jsPlumbInstance<HTMLElement> {



    dragManager:DragManager;

    _dragOffset:Offset = null;
    _groupLocations:Array<GroupLocation<HTMLElement>> = [];
    _intersectingGroups:Array<IntersectingGroup<HTMLElement>> = [];
    payload:any;

    constructor(protected _instanceIndex:number, defaults?:BrowserJsPlumbDefaults) {
        super(_instanceIndex, new BrowserRenderer(), defaults);
        //this.eventManager = new Mottle();
        this.dragManager = new DragManager(this);
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

    on (el:HTMLElement, event:string, callback:Function) {
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

    _dragStop (params:any):void {

        let elements = params.selection, uip;

        if (elements.length === 0) {
            elements = [ [ params.el, {left:params.finalPos[0], top:params.finalPos[1] }, params.drag ] ];
        }

        const _one = (_e:any) => {
            const dragElement = _e[2].getDragElement();
            if (_e[1] != null) {
                // run the reported offset through the code that takes parent containers
                // into account, to adjust if necessary (issue 554)
                uip = this.getUIPosition([{
                    el:dragElement,
                    pos:[_e[1].left, _e[1].top]
                }]);
                if (this._dragOffset) {
                    uip.left += this._dragOffset.left;
                    uip.top += this._dragOffset.top;
                }
                this._draw(dragElement, uip);

                this.fire("drag:stop", {
                    el:dragElement,
                    e:params.e,
                    pos:uip
                });
            }

            this.removeClass(_e[0], "jtk-dragged");
            this.select({source: dragElement}).removeClass(this.elementDraggingClass + " " + this.sourceElementDraggingClass, true);
            this.select({target: dragElement}).removeClass(this.elementDraggingClass + " " + this.targetElementDraggingClass, true);

        };

        for (let i = 0; i < elements.length; i++) {
            _one(elements[i]);
        }

        if (this._intersectingGroups.length > 0) {
            // we only support one for the time being
            let targetGroup = this._intersectingGroups[0].group;
            let currentGroup = params.el._jsPlumbGroup;
            if (currentGroup !== targetGroup) {
                if (currentGroup != null) {
                    if (currentGroup.overrideDrop(params.el, targetGroup)) {
                        return;
                    }
                }
                this.groupManager.addToGroup(targetGroup, params.el, false);
            }
        }


        this._groupLocations.forEach((groupLoc:any) => {
            this.removeClass(groupLoc.el, "jtk-drag-active");
            this.removeClass(groupLoc.el, "jtk-drag-hover");
        });

        this._groupLocations.length = 0;
        this.hoverSuspended = false;
        this.isConnectionBeingDragged = false;
        this._dragOffset = null;
    }

    _beforeDragStart (beforeStartParams:any):void {
        this.payload = beforeStartParams.e.payload || {};
    }

    _dragMove (params:any):void {

        const el = params.drag.getDragElement();
        const finalPos = params.finalPos || params.pos;
        const elSize = this.getSize(el);
        const ui = { left:finalPos[0], top:finalPos[1] };

        if (ui != null) {

            this._intersectingGroups.length = 0;

            // TODO refactor, now there are no drag options on each element as we dont call 'draggable' for each one. the canDrag method would
            // have been supplied to the instance's dragOptions.
            //var o = el._jsPlumbDragOptions || {};

            if (this._dragOffset != null) {
                ui.left += this._dragOffset.left;
                ui.top += this._dragOffset.top;
            }

            const bounds = { x:ui.left, y:ui.top, w:elSize[0], h:elSize[1] };

            // TODO  calculate if there is a target group
            this._groupLocations.forEach((groupLoc:any) => {
                if (Biltong.intersects(bounds, groupLoc.r)) {
                    this.addClass(groupLoc.el, "jtk-drag-hover");
                    this._intersectingGroups.push(groupLoc);
                } else {
                    this.removeClass(groupLoc.el, "jtk-drag-hover");
                }
            });

            this._draw(el, ui, null);

            this.fire("drag:move", {
                el:el,
                e:params.e,
                pos:ui
            });

            // if (o._dragging) {
            //     instance.addClass(el, "jtk-dragged");
            // }
            // o._dragging = true;
        }
    }

    _dragStart (params:any):boolean {
        const el = params.drag.getDragElement();

        if(hasManagedParent(this.getContainer(), el) && el.offsetParent._jsPlumbGroup == null) {
            return false;
        } else {

            // TODO refactor, now there are no drag options on each element as we dont call 'draggable' for each one. the canDrag method would
            // have been supplied to the instance's dragOptions.

            let options = el._jsPlumbDragOptions || {};
            if (el._jsPlumbGroup) {
                this._dragOffset = this.getOffset(el.offsetParent);
            }

            let cont = true;
            if (options.canDrag) {
                cont = options.canDrag();
            }
            if (cont) {

                this._groupLocations.length = 0;
                this._intersectingGroups.length = 0;

                //
                // is it the best way to do it via the dom? the group manager can give all the groups, and also whether they are
                // collapsed etc
                //

                if (!el._isJsPlumbGroup && (!el._jsPlumbGroup || el._jsPlumbGroup.constrain !== true)) {
                    this.groupManager.groups.forEach((group:Group<HTMLElement>) => {
                        if (group.droppable !== false && group.enabled !== false && group !== el._jsPlumbGroup) {
                            let groupEl = group.el,
                                s = this.getSize(groupEl),
                                o = this.getOffset(groupEl),
                                boundingRect = {x: o.left, y: o.top, w: s[0], h: s[1]};

                            this._groupLocations.push({el: groupEl, r: boundingRect, group: group});
                            this.addClass(groupEl, "jtk-drag-active");
                        }
                    });
                }

                // instance.getSelector(instance.getContainer(), "[jtk-group]").forEach(function(candidate) {
                //     if (candidate._jsPlumbGroup && candidate._jsPlumbGroup.droppable !== false && candidate._jsPlumbGroup.enabled !== false) {
                //         var o = instance.getOffset(candidate), s = instance.getSize(candidate);
                //         var boundingRect = { x:o.left, y:o.top, w:s[0], h:s[1]};
                //         _groupLocations.push({el:candidate, r:boundingRect, group:el._jsPlumbGroup});
                //
                //         // _currentInstance.addClass(candidate, _currentInstance.Defaults.dropOptions.activeClass || "jtk-drag-active"); // TODO get from defaults.
                //     }
                //
                // });

                this.hoverSuspended = true;
                this.select({source: el}).addClass(this.elementDraggingClass + " " + this.sourceElementDraggingClass, true);
                this.select({target: el}).addClass(this.elementDraggingClass + " " + this.targetElementDraggingClass, true);
                this.isConnectionBeingDragged = true;

                this.fire("drag:start", {
                    el:el,
                    e:params.e
                });
            }
            return cont;
        }
    }

}

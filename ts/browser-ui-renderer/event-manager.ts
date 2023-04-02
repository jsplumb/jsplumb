

import {forEach, PointXY, removeWithFunction, uuid} from "../util/util"

import { jsPlumbDOMElement} from './element-facade'

import {
    EVENT_MOUSEDOWN,
    EVENT_MOUSEENTER,
    EVENT_MOUSEEXIT,
    EVENT_MOUSEOUT,
    EVENT_MOUSEOVER,
    EVENT_MOUSEUP,
    EVENT_TAP,
    EVENT_DBL_TAP,
    EVENT_CONTEXTMENU,
    EVENT_FOCUS,
    EVENT_TOUCHEND,
    EVENT_TOUCHSTART,
    EVENT_MOUSEMOVE, EVENT_TOUCHMOVE
} from './constants'
import {WILDCARD} from "../common/index"
import {ATTRIBUTE_TABINDEX} from "../core/constants"

/**
 * Creates a Touch object.
 * @param target
 * @param pageX
 * @param pageY
 * @param screenX
 * @param screenY
 * @param clientX
 * @param clientY
 * @returns
 * @internal
 */
function _touch(target:any, pageX:number, pageY:number, screenX:number, screenY:number, clientX:number, clientY:number):Touch {

    return new Touch({
        target:target,
        identifier:uuid() as any,
        pageX: pageX,
        pageY: pageY,
        screenX: screenX,
        screenY: screenY,
        clientX: clientX || screenX,
        clientY: clientY || screenY
    })
}

/**
 * Create a synthetic touch list from the given list of Touch objects.
 * @internal
 */
function _touchList(...touches:Array<Touch>) {
    const list:Array<any> = [];
    list.push(...touches);
    (list as any).item =  function(index:number) { return this[index]; }
    return list
}

/**
 * Create a Touch object and then insert it into a synthetic touch list, returning the list.
 * @param target
 * @param pageX
 * @param pageY
 * @param screenX
 * @param screenY
 * @param clientX
 * @param clientY
 * @returns
 * @internal
 */
function _touchAndList(target:any, pageX:number, pageY:number, screenX:number,
                       screenY:number, clientX:number, clientY:number) {
    return _touchList(_touch(target, pageX, pageY, screenX, screenY, clientX, clientY))
}


function matchesSelector(el:any, selector:string, ctx?:Element):boolean {
    ctx = ctx || el.parentNode
    const possibles = ctx.querySelectorAll(selector)
    for (let i = 0; i < possibles.length; i++) {
        if (possibles[i] === el) {
            return true
        }
    }
    return false
}

function _t (e:Event):EventTarget {
    return e.srcElement || e.target
}

//
// gets path info for the given event - the path from target to obj, in the event's bubble chain. if doCompute
// is false we just return target for the path.
//
function _pi (e:any, target:EventTarget, obj:any, doCompute?:boolean) {
    if (!doCompute) {
        return { path:[target], end:1 }
    }
    else {
        const path = e.composedPath ? e.composedPath() : e.path
        if (typeof path !== "undefined" && path.indexOf) {
            return { path, end: path.indexOf(obj) }
        } else {
            const out:any = { path:[], end:-1 }, _one = (el:any) => {
                out.path.push(el)
                if (el === obj) {
                    out.end = out.path.length - 1
                }
                else if (el.parentNode != null) {
                    _one(el.parentNode)
                }
            }
            _one(target)
            return out
        }
    }
}

function _d (l:Array<any>, fn:Function) {
    let i = 0, j
    for (i = 0, j = l.length; i < j; i++) {
        if (l[i][0] === fn) {
            break
        }
    }
    if (i < l.length) {
        l.splice(i, 1)
    }
}

let guid = 1

let forceTouchEvents = false
let forceMouseEvents = false
export function isTouchDevice():boolean { return  forceTouchEvents || "ontouchstart" in document.documentElement || (navigator.maxTouchPoints != null && navigator.maxTouchPoints > 0) }
export function isMouseDevice():boolean { return forceMouseEvents || "onmousedown" in document.documentElement }
const touchMap = { [EVENT_MOUSEDOWN]: EVENT_TOUCHSTART, [EVENT_MOUSEUP]: EVENT_TOUCHEND, [EVENT_MOUSEMOVE]: EVENT_TOUCHMOVE }

const PAGE = "page"
const SCREEN = "screen"
const CLIENT = "client"

function _genLoc (e:Event, prefix:string):PointXY {
    if (e == null) return {x:0, y:0 }
    const ts = touches(e), t = getTouch(ts, 0)
    return {x:t[prefix + "X"], y:t[prefix + "Y"]}
}
export function pageLocation (e:Event):PointXY {
    return _genLoc(e, PAGE)
}

function screenLocation (e:Event):PointXY {
    return _genLoc(e, SCREEN)
}

function clientLocation (e:Event):PointXY {
    return _genLoc(e, CLIENT)
}

export function getTouch (touches:TouchList, idx:number):Touch {
    return touches.item ? touches.item(idx) : touches[idx]
}

export function touches (e:any):TouchList {
    return e.touches && e.touches.length > 0 ? e.touches :
        e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches :
            e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches :
                [ e ]
}

export function touchCount (e:Event):number {
    return touches(e).length
}

/**
 * Gets the page location for the given event, abstracting out differences between touch and mouse events.
 * @param e
 */
export function getPageLocation(e:any):PointXY {
    if (e == null) {
        return {x:0, y:0 }
    } else if (e.pageX !== null) {
        return { x:e.pageX, y:e.pageY }
    } else {
        const ts = touches(e), t = getTouch(ts, 0)
        if (t != null && t.pageX != null) {
            return { x:t.pageX, y:t.pageY }
        } else {
            return {x:0, y:0 }
        }
    }


}

function _bind (obj:any, type:string, fn:any, originalFn:any, options?:{passive?:boolean, capture?:boolean, once?:boolean}) {
    _store(obj, type, fn)
    originalFn.__tauid = fn.__tauid
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false, options)
    }
    else if (obj.attachEvent) {
        const key = type + fn.__tauid
        obj["e" + key] = fn
        // TODO look at replacing with .call(..)
        obj[key] = function () {
            obj["e" + key] && obj["e" + key](window.event)
        }
        obj.attachEvent("on" + type, obj[key])
    }
}

function _unbind (obj:any, type:string, fn:any) {
    if (fn == null) return
    _each(obj, (_el:jsPlumbDOMElement) => {
        _unstore(_el, type, fn)
        // it has been bound if there is a tauid. otherwise it was not bound and we can ignore it.
        if (fn.__tauid != null) {
            if (_el.removeEventListener) {
                _el.removeEventListener(type, fn, false)
                if (isTouchDevice() && touchMap[type]) _el.removeEventListener(touchMap[type], fn, false)
            }
            else if (this.detachEvent) {
                const key = type + fn.__tauid
                _el[key] && (_el as any).detachEvent("on" + type, _el[key])
                _el[key] = null
                _el["e" + key] = null
            }
        }

        // if a touch event was also registered, deregister now.
        if (fn.__taTouchProxy) {
            _unbind(obj, fn.__taTouchProxy[1], fn.__taTouchProxy[0])
        }
    })
}

function _each (obj:any, fn:any) {
    if (obj == null) return
    // if a list (or list-like), use it. if a string, get a list
    // by running the string through querySelectorAll. else, assume
    // it's an Element.
    const entries = typeof obj === "string" ? document.querySelectorAll(obj) : obj.length != null ? obj : [ obj ]
    for (let i = 0; i < entries.length; i++) {
        fn(entries[i])
    }
}

function _store (obj:any, event:string, fn:FunctionFacade) {
    const g = guid++
    obj.__ta = obj.__ta || {}
    obj.__ta[event] = obj.__ta[event] || {}
    // store each handler with a unique guid.
    obj.__ta[event][g] = fn
    // set the guid on the handler.
    fn.__tauid = g
return g
}

interface FunctionFacade {
    __tauid: number
    __taExtra:Array<any>
    __taUnstore?:Function
    apply:(obj:any, ...args:Array<any>)=>any
}

function _unstore (obj:any, event:string, fn:FunctionFacade) {
    obj.__ta && obj.__ta[event] && delete obj.__ta[event][fn.__tauid]
    // a handler might have attached extra functions, so we unbind those too.
    if (fn.__taExtra) {
        for (let i = 0; i < fn.__taExtra.length; i++) {
            _unbind(obj, fn.__taExtra[i][0], fn.__taExtra[i][1])
        }
        fn.__taExtra.length = 0
    }
    // a handler might have attached an unstore callback
    fn.__taUnstore && fn.__taUnstore()
}

const NOT_SELECTOR_REGEX = /:not\(([^)]+)\)/

function _curryChildFilter (children:string, obj:any, fn:FunctionFacade, evt:string) {
    if (children == null) {
        return fn
    }
    else {
        const c = children.split(","),
            pc:Array<string> = [],
            nc:Array<string> = []

        // split into :not(...) and other selectors.
        forEach(c, (sel) => {
            const m = sel.match(NOT_SELECTOR_REGEX)
            if (m != null) {
                nc.push(m[1])
            } else {
                pc.push(sel)
            }
        })

        // if there were negative selectors but no positive selectors, push the wildcard selector to the positive selector list.
        if (nc.length > 0 && pc.length === 0) {
            pc.push(WILDCARD)
        }

        const _fn =  (e:any) => {
                (_fn as any).__tauid = fn.__tauid
                const t = _t(e)
                let done = false;
                let target = t;  // t is the target element on which the event occurred. it is the
                // element we will wish to pass to any callbacks.
                const pathInfo = _pi(e, t, obj, children != null)
                if (pathInfo.end != -1) {
                    for (let p = 0; !done && p < pathInfo.end; p++) {
                        target = pathInfo.path[p]

                        // if any negative selectors match, abort.
                        for (let i = 0; i < nc.length; i++) {
                            if (matchesSelector(target, nc[i], obj)) {
                                return
                            }
                        }

                        // now try to match a positive selector.
                        for (let i = 0; !done && i < pc.length; i++) {
                            if (matchesSelector(target, pc[i], obj)) {
                                fn.apply(target, [e, target])
                                done = true;
                                break;
                            }
                        }
                    }
                }
            }
        registerExtraFunction(fn, evt, _fn as any)
        return _fn
    }
}

function registerExtraFunction (fn:FunctionFacade, evt:string, newFn:FunctionFacade) {
    fn.__taExtra = fn.__taExtra || []
    fn.__taExtra.push([evt, newFn])
}

type Handler = (obj:any, evt:string, fn:FunctionFacade, children?:string, options?:{passive?:boolean, capture?:boolean, once?:boolean}) => void
const DefaultHandler:Handler = (obj:any, evt:string, fn:FunctionFacade, children?:string, options?:{passive?:boolean, capture?:boolean, once?:boolean}) => {
    if (isTouchDevice() && touchMap[evt]) {
        const tfn = _curryChildFilter(children, obj, fn, touchMap[evt])
        _bind(obj, touchMap[evt], tfn , fn, options)
    }
    if (evt === EVENT_FOCUS && obj.getAttribute(ATTRIBUTE_TABINDEX) == null) {
        obj.setAttribute(ATTRIBUTE_TABINDEX, "1")
    }
    _bind(obj, evt, _curryChildFilter(children, obj, fn, evt), fn, options)
}

const _tapProfiles = {
    [EVENT_TAP]: {touches: 1, taps: 1},
    [EVENT_DBL_TAP]: {touches: 1, taps: 2},
    [EVENT_CONTEXTMENU]: {touches: 2, taps: 1}
}

function meeHelper (type:string, evt:Event, obj:any, target:EventTarget) {
    for (let i in obj.__tamee[type]) {
        if (obj.__tamee[type].hasOwnProperty(i)) {
            obj.__tamee[type][i].apply(target, [ evt ])
        }
    }
}

class TapHandler {

    static generate(clickThreshold:number, dblClickThreshold:number):Handler {
        return (obj:any, evt:string, fn:FunctionFacade, children:string) => {
            // if event is contextmenu, for devices which are mouse only, we want to
            // use the default bind.
            if (evt == EVENT_CONTEXTMENU && isMouseDevice())
                DefaultHandler(obj, evt, fn, children)
            else {
                // the issue here is that this down handler gets registered only for the
                // child nodes in the first registration. in fact it should be registered with
                // no child selector and then on down we should cycle through the registered
                // functions to see if one of them matches. on mouseup we should execute ALL of
                // the functions whose children are either null or match the element.
                if (obj.__taTapHandler == null) {
                    const tt:any = obj.__taTapHandler = {
                        tap: [],
                        dbltap: [],
                        //contextmenu: [],
                        down: false,
                        taps: 0,
                        downSelectors: []
                    }
                    const down = (e:Event) => {
                            let target = _t(e), pathInfo = _pi(e, target, obj, children != null), finished = false
                            for (let p = 0; p < pathInfo.end; p++) {
                                if (finished) return
                                target = pathInfo.path[p]
                                for (let i = 0; i < tt.downSelectors.length; i++) {
                                    if (tt.downSelectors[i] == null || matchesSelector(target, tt.downSelectors[i], obj)) {
                                        tt.down = true
                                        setTimeout(clearSingle, clickThreshold)
                                        setTimeout(clearDouble, dblClickThreshold)
                                        finished = true
                                        break; // we only need one match on mousedown
                                    }
                                }
                            }
                        },
                        up = (e:Event) => {
                            if (tt.down) {
                                let target = _t(e), currentTarget, pathInfo
                                tt.taps++
                                const tc = touchCount(e)
                                for (let eventId in _tapProfiles) {
                                    if (_tapProfiles.hasOwnProperty(eventId)) {
                                        const p = _tapProfiles[eventId]
                                        if (p.touches === tc && (p.taps === 1 || p.taps === tt.taps)) {
                                            for (let i = 0; i < tt[eventId].length; i++) {
                                                pathInfo = _pi(e, target, obj, tt[eventId][i][1] != null)
                                                for (let pLoop = 0; pLoop < pathInfo.end; pLoop++) {
                                                    currentTarget = pathInfo.path[pLoop]
                                                    // this is a single event registration handler.
                                                    if (tt[eventId][i][1] == null || matchesSelector(currentTarget, tt[eventId][i][1], obj)) {
                                                        tt[eventId][i][0].apply(currentTarget, [e, currentTarget])
                                                        break
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        clearSingle = function () {
                            tt.down = false
                        },
                        clearDouble = function () {
                            tt.taps = 0
                        }

                    obj.__taTapHandler.downHandler = down
                    obj.__taTapHandler.upHandler = up

                        // these two handler registrations cause two events to be bound to `obj`.
                    DefaultHandler(obj, EVENT_MOUSEDOWN, down as any)
                    DefaultHandler(obj, EVENT_MOUSEUP, up as any)
                }
                // add this child selector (it can be null, that's fine).
                obj.__taTapHandler.downSelectors.push(children)

                obj.__taTapHandler[evt].push([fn, children])
                // the unstore function removes this function from the object's listener list for this type.
                fn.__taUnstore = function () {
                    if (obj.__taTapHandler != null) {
                        // remove this selector from the tap handlers list
                        removeWithFunction(obj.__taTapHandler.downSelectors, (ds: string) => ds === children)
                        // remove the function
                        _d(obj.__taTapHandler[evt], fn as any)
                        // now if there are no `downSelectors` left, unbind the tap handler and delete it
                        if (obj.__taTapHandler.downSelectors.length === 0) {
                            _unbind(obj, EVENT_MOUSEDOWN, obj.__taTapHandler.downHandler)
                            _unbind(obj, EVENT_MOUSEUP, obj.__taTapHandler.upHandler)
                            delete obj.__taTapHandler
                        }
                    }
                }
            }
        }
    }
}

class MouseEnterExitHandler {

    static generate():Handler {
        const activeElements:Array<any> = []
        return (obj:any, evt:string, fn:FunctionFacade, children?:string) => {
            if (!obj.__tamee) {
                // __tamee holds a flag saying whether the mouse is currently "in" the element, and a list of
                // both mouseenter and mouseexit functions.
                obj.__tamee = {over: false, mouseenter: [], mouseexit: []}
                // register over and out functions
                const over = (e:Event) => {
                        const t:any = _t(e)
                        if ((children == null && (t == obj && !obj.__tamee.over)) || (matchesSelector(t, children, obj) && (t.__tamee == null || !t.__tamee.over))) {
                            meeHelper(EVENT_MOUSEENTER, e, obj, t)
                            t.__tamee = t.__tamee || {}
                            t.__tamee.over = true
                            activeElements.push(t)
                        }
                    },
                    out = (e:Event) => {
                        const t:any = _t(e)
                        // is the current target one of the activeElements? and is the
                        // related target NOT a descendant of it?
                        for (let i = 0; i < activeElements.length; i++) {
                            if (t == activeElements[i] && !matchesSelector(((e as any).relatedTarget || (e as any).toElement), "*", t)) {
                                t.__tamee.over = false
                                activeElements.splice(i, 1)
                                meeHelper(EVENT_MOUSEEXIT, e, obj, t)
                            }
                        }
                    }

                _bind(obj, EVENT_MOUSEOVER, _curryChildFilter(children, obj, over as any, EVENT_MOUSEOVER), over)
                _bind(obj, EVENT_MOUSEOUT, _curryChildFilter(children, obj, out as any, EVENT_MOUSEOUT), out)
            }

            fn.__taUnstore = function () {
                delete obj.__tamee[evt][fn.__tauid]
            }

            _store(obj, evt, fn)
            obj.__tamee[evt][fn.__tauid] = fn
        }
    }
}

export interface EventManagerOptions {
    clickThreshold?:number
    dblClickThreshold?:number
}

export class EventManager {

    clickThreshold:number
    dblClickThreshold:number
    private readonly tapHandler:Handler
    private readonly mouseEnterExitHandler: Handler

    constructor(params?:EventManagerOptions) {
        params = params || {}
        this.clickThreshold = params.clickThreshold || 250
        this.dblClickThreshold = params.dblClickThreshold || 450
        this.mouseEnterExitHandler = MouseEnterExitHandler.generate()
        this.tapHandler = TapHandler.generate(this.clickThreshold, this.dblClickThreshold)
    }

    private _doBind (el:Element, evt:string, fn:any, children?:string, options?:{passive?:boolean, capture?:boolean, once?:boolean}) {
        if (fn == null) return

        const jel = el as unknown as jsPlumbDOMElement

        if (evt === EVENT_TAP || evt === EVENT_DBL_TAP || evt === EVENT_CONTEXTMENU) {
            this.tapHandler(jel, evt, fn, children, options)
        }
        else if (evt === EVENT_MOUSEENTER || evt == EVENT_MOUSEEXIT)
            this.mouseEnterExitHandler(jel, evt, fn, children, options)
        else {
            DefaultHandler(jel, evt, fn, children, options)
        }
    }

    on (el:any, event:string, children?:string|Function, fn?:Function, options?:{passive?:boolean, capture?:boolean, once?:boolean}) {
        let _c = fn == null ? null : children as string,
            _f = fn == null ? children as Function : fn

        this._doBind(el, event, _f, _c, options)
        return this
    }

    off (el:any, event:string, fn:any) {
        _unbind(el, event, fn)
        return this
    }

    trigger (el:any, event:string, originalEvent:any, payload?:any, detail?:number) {
        // MouseEvent undefined in old IE; that's how we know it's a mouse event.  A fine Microsoft paradox.
        const originalIsMouse = isMouseDevice() && (typeof MouseEvent === "undefined" || originalEvent == null || originalEvent.constructor === MouseEvent)

        let eventToBind = (isTouchDevice() && !isMouseDevice() && touchMap[event]) ? touchMap[event] : event,
            bindingAMouseEvent = !(isTouchDevice() && !isMouseDevice() && touchMap[event])

        const pl = pageLocation(originalEvent), sl = screenLocation(originalEvent), cl = clientLocation(originalEvent)
        _each(el, (_el:jsPlumbDOMElement) => {
            let evt
            originalEvent = originalEvent || {
                screenX: sl.x,
                screenY: sl.y,
                clientX: cl.x,
                clientY: cl.y
            }

            const _decorate = (_evt:any) => {
                if (payload) {
                    _evt.payload = payload
                }
            }

            const eventGenerators = {
                "TouchEvent": (evt:any) => {

                    const touchList = _touchAndList(_el, pl.x, pl.y, sl.x, sl.y, cl.x, cl.y),
                        init = evt.initTouchEvent || evt.initEvent

                    init(eventToBind, true, true, window, null, sl.x, sl.y,
                        cl.x, cl.y, false, false, false, false,
                        touchList, touchList, touchList, 1, 0)
                },
                "MouseEvents": (evt:any) => {
                    evt.initMouseEvent(eventToBind, true, true, window, detail == null ? 1 : detail,
                        sl.x, sl.y,
                        cl.x, cl.y,
                        false, false, false, false, 1, _el)
                }
            }

            const ite = !bindingAMouseEvent && !originalIsMouse && (isTouchDevice() && touchMap[event]),
                evtName = ite ? "TouchEvent" : "MouseEvents"

            // create event using constructors.
            // wont work for IE11.  currently causes
            // a test to fail also.
            // if (ite) {
            //     const touchList = _touchAndList(_el, pl.x, pl.y, sl.x, sl.y, cl.x, cl.y)
            //     evt = new TouchEvent(eventToBind,{
            //             touches:touchList,
            //             targetTouches:touchList,
            //             changedTouches:touchList,
            //             bubbles:true,
            //             cancelable:true
            //         })
            // } else {
            //     evt = new MouseEvent(eventToBind, {
            //         bubbles:true,
            //         cancelable:true,
            //         screenX:sl.x,
            //         screenY:sl.y,
            //         clientX:cl.x,
            //         clientY:cl.y,
            //         button:1,
            //         relatedTarget:_el
            //     })
            // }

            evt = document.createEvent(evtName)
            eventGenerators[evtName](evt)

            _decorate(evt)
            _el.dispatchEvent(evt)
        })
        return this
    }
}

export function setForceTouchEvents (value:boolean) {
    forceTouchEvents = value
}

export function setForceMouseEvents (value:boolean) {
    forceMouseEvents = value
}

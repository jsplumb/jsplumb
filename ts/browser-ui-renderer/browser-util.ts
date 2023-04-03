import { jsPlumbDOMElement} from './element-facade'
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance"
import {fastTrim, forEach, isString, log, PointXY, Size} from "../util/util"

// These are utility functions for use inside a Browser.

export function matchesSelector (el:jsPlumbDOMElement, selector:string, ctx?:Element) {
    ctx = (ctx || el.parentNode) as Element
    const possibles = ctx.querySelectorAll(selector)
    for (let i = 0; i < possibles.length; i++) {
        if (possibles[i] === el) {
            return true
        }
    }
    return false
}

/**
 * Consume the given event, using `stopPropagation()` if present or `returnValue` if not, and optionally
 * also calling `preventDefault()`.
 * @param e
 * @param doNotPreventDefault
 */
export function consume (e:Event, doNotPreventDefault?:boolean) {
    if (e.stopPropagation) {
        e.stopPropagation()
    }
    else {
        (<any>e).returnValue = false
    }

    if (!doNotPreventDefault && e.preventDefault){
        e.preventDefault()
    }
}

export function findParent(el:jsPlumbDOMElement, selector:string, container:Element, matchOnElementAlso:boolean):jsPlumbDOMElement {
    if (matchOnElementAlso && matchesSelector(el, selector, container)) {
        return el
    } else {
       el = el.parentNode
    }
    while (el != null && el !== container) {
        if (matchesSelector(el, selector)) {
            return el
        } else {
            el = el.parentNode
        }
    }
}

export function getEventSource(e:Event):jsPlumbDOMElement {
    return (e.srcElement || e.target) as jsPlumbDOMElement
}

function _setClassName (el:Element, cn:string, classList:Array<string>):void {
    cn = fastTrim(cn)

    if (typeof (<any>el.className).baseVal !== "undefined") {
        (<any>el.className).baseVal = cn
    }
    else {
        el.className = cn
    }

    // recent (i currently have  61.0.3163.100) version of chrome do not update classList when you set the base val
    // of an svg element's className. in the long run we'd like to move to just using classList anyway
    try {
        let cl = el.classList
        if (cl != null) {
            while (cl.length > 0) {
                cl.remove(cl.item(0))
            }
            for (let i = 0; i < classList.length; i++) {
                if (classList[i]) {
                    cl.add(classList[i])
                }
            }
        }
    }
    catch(e) {
        // not fatal
        log("WARN: cannot set class list", e)
    }
}

//
// get the class name for either an html element or an svg element.
function _getClassName (el:Element):string {
    return (<any>el).className != null ? (typeof (<any>el.className).baseVal === "undefined") ? el.className : (<any>el.className).baseVal as string : ""
}

function _classManip(el:Element, classesToAdd:string | Array<string>, classesToRemove?:string | Array<String>) {
    const cta:Array<string> = classesToAdd == null ? [] : Array.isArray(classesToAdd) ? classesToAdd as string[] : (classesToAdd as string).split(/\s+/)
    const ctr:Array<string> = classesToRemove == null ? [] : Array.isArray(classesToRemove) ? classesToRemove as string[] : (classesToRemove as string).split(/\s+/)

    let className = _getClassName(el),
        curClasses = className.split(/\s+/)

    const _oneSet =  (add:boolean, classes:Array<string>) => {
        for (let i = 0; i < classes.length; i++) {
            if (add) {
                if (curClasses.indexOf(classes[i]) === -1) {
                    curClasses.push(classes[i])
                }
            }
            else {
                let idx = curClasses.indexOf(classes[i])
                if (idx !== -1) {
                    curClasses.splice(idx, 1)
                }
            }
        }
    }

    _oneSet(true, cta)
    _oneSet(false, ctr)

    _setClassName(el, curClasses.join(" "), curClasses)
}

export function isNodeList(el:any): el is NodeListOf<Element> {
    return !isString(el) && !Array.isArray(el) && (el as any).length != null && (el as any).documentElement == null && (el as any).nodeType == null
}

export function isArrayLike(el:any): el is ArrayLike<Element> {
    return !isString(el) && (Array.isArray(el) || isNodeList(el))
}

export function getClass(el:Element):string { return _getClassName(el); }

export function addClass(el:Element | NodeListOf<Element>, clazz:string):void {

    const _one = (el:Element, clazz:string) => {
        if (el != null && clazz != null && clazz.length > 0) {
            if (el.classList) {
                const parts = fastTrim(clazz).split(/\s+/)
                forEach(parts, (part) => {
                    el.classList.add(part)
                })
            } else {
                _classManip(el, clazz)
            }
        }
    }

    if (isNodeList(el)) {
        forEach(el, (el:Element) => _one(el, clazz))
    } else {
        _one(el, clazz)
    }
}

export function hasClass(el:Element, clazz:string):boolean {
    if (el.classList) {
        return el.classList.contains(clazz)
    }
    else {
        return _getClassName(el).indexOf(clazz) !== -1
    }
}

export function removeClass(el:Element | NodeListOf<Element>, clazz:string):void {
    const _one = (el:Element, clazz:string) => {
        if (el != null && clazz != null && clazz.length > 0) {
            if (el.classList) {
                const parts = fastTrim(clazz).split(/\s+/)
                parts.forEach((part) => {
                    el.classList.remove(part)
                })
            } else {
                _classManip(el, null, clazz)
            }
        }
    }

    if (isNodeList(el)) {
        forEach(el, (el:Element) => _one(el, clazz))
    } else {
        _one(el, clazz)
    }
}

export function toggleClass(el:Element | NodeListOf<Element>, clazz:string):void {
    const _one = (el:Element, clazz:string) => {
        if (el != null && clazz != null && clazz.length > 0) {
            if (el.classList) {
                el.classList.toggle(clazz)
            } else {
                if (this.hasClass(el, clazz)) {
                    this.removeClass(el, clazz)
                } else {
                    this.addClass(el, clazz)
                }
            }
        }
    }

    if (isNodeList(el)) {
        forEach(el, (el:Element) => _one(el, clazz))
    } else {
        _one(el, clazz)
    }
}

export function createElement(tag:string, style?:Record<string, any>, clazz?:string, atts?:Record<string, string>):jsPlumbDOMElement {
    return createElementNS(null, tag, style, clazz, atts)
}

export function createElementNS(ns:string, tag:string, style?:Record<string, any>, clazz?:string, atts?:Record<string, string|number>):jsPlumbDOMElement{
    let e = (ns == null ? document.createElement(tag) : document.createElementNS(ns, tag)) as jsPlumbDOMElement
    let i

    style = style || {}

    for (i in style) {
        e.style[i] = style[i]
    }

    if (clazz) {
        e.className = clazz
    }

    atts = atts || {}
    for (i in atts) {
        e.setAttribute(i, "" + atts[i])
    }

    return e
}

/**
 * Gets the position of the given element relative to the browser viewport's origin. This method is safe for
 * both HTML and SVG elements.
 * @param el
 * @internal
 */
export function offsetRelativeToRoot(el:Element):PointXY {
    const box = el.getBoundingClientRect(),
        body = document.body,
        docElem = document.documentElement,
        // (2)
        scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
        scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        // (3)
        clientTop = docElem.clientTop || body.clientTop || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        // (4)
        top  = box.top +  scrollTop - clientTop,
        left = box.left + scrollLeft - clientLeft

    return {
        x:Math.round(left),
        y:Math.round(top)
    }
}

/**
 * Gets the offset width and offset height of the given element. Not safe for SVG elements. This method was previously
 * exported as `size` but has been renamed in order to reflect the fact that it uses offsetWidth and offsetHeight,
 * which are not set on SVG elements.
 * @param el
 * @public
 */
export function offsetSize(el:Element):Size {
    return { w:(el as any).offsetWidth, h:(el as any).offsetHeight }
}

export function svgWidthHeightSize(el:Element):Size {
    try {
        return {
            w: parseFloat((el as any).width.baseVal.value),
            h: parseFloat((el as any).height.baseVal.value),
        }
    } catch (e) {
        return { w:0, h:0 }
    }
}

export function svgXYPosition(el:Element):PointXY {
    try {
        return {
            x: parseFloat((el as any).x.baseVal.value),
            y: parseFloat((el as any).y.baseVal.value),
        }
    } catch (e) {
        return {
            x:0, y:0
        }
    }
}

/**
 * Gets the position of this element with respect to the container's origin, in container coordinates.
 *
 * Previously, drag handlers would use getOffset method from the underlying instance but as part of updating the code
 * to support dragging SVG elements this method, using getBoundingClientRect, has been introduced. Ideally this
 * method would be what all the positioning code uses, but there are a few edge cases, particularly
 * involving scrolling, that need to be investigated.
 *
 * Note that we divide the position coords by the current zoom, as getBoundingClientRect() returns values that
 * correspond to what the user sees.
 *
 * Note also that currently this method fails when an element is rotated, as getBoundingClientRect() returns the
 * rotated bounds. In fact "fails" is perhaps not precise: it fails at behaving the way the previous getOffset method
 * worked, but depending on the use case, it may be desirable to get the rotated bounds. Currently this method is used
 * by endpoint drag code, in which we know the elements are not rotated.
 *
 * @param el
 * @internal
 */
export function getElementPosition(el:Element, instance:BrowserJsPlumbInstance) {
    const pc = instance.getContainer().getBoundingClientRect()
    const ec = el.getBoundingClientRect()
    const z = instance.currentZoom
    return { x: (ec.left - pc.left) / z, y:(ec.top - pc.top) / z }
}

/**
 * Gets the size of this element, in container coordinates. Note that we divide the size values from
 * getBoundingClientRect by the current zoom, as getBoundingClientRect() returns values that
 * correspond to what the user sees.
 * @param el
 * @internal
 */
export function getElementSize(el:Element, instance:BrowserJsPlumbInstance):Size {
    const ec = el.getBoundingClientRect()
    const z = instance.currentZoom
    return { w:ec.width / z, h:ec.height /z }
}

export enum ElementTypes {
    SVG = "SVG",
    HTML = "HTML"
}

export type ElementType = keyof typeof ElementTypes

export function getElementType(el:Element):ElementType {
    return el instanceof SVGElement ? ElementTypes.SVG : ElementTypes.HTML
}

export function isSVGElement(el:Element):boolean {
    return getElementType(el) === ElementTypes.SVG
}

/**
 * Execute the given function when the DOM is ready, or if the DOM is already ready, execute the given function immediately.
 * @param f
 * @public
 */
export function onDocumentReady(f:Function) {
    const _do = function () {
        if (/complete|loaded|interactive/.test(document.readyState) && typeof(document.body) !== "undefined" && document.body != null) {
            f()
        }
        else {
            setTimeout(_do, 9)
        }
    }

    _do()
}

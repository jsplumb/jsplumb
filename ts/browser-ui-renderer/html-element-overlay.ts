
import {createElement} from './browser-util'
import { jsPlumbDOMElement} from './element-facade'
import {ELEMENT_DIV} from "./constants"
import {Size} from "../util/util"
import {Overlay} from "../core/overlay/overlay"
import {JsPlumbInstance} from "../core/core"
import {Component} from "../core/component/component"
import {ABSOLUTE, NONE} from "../core/constants"

interface HTMLElementOverlayHolder extends Overlay {
    canvas:jsPlumbDOMElement
    cachedDimensions:Size
} 

export class HTMLElementOverlay {

    protected htmlElementOverlay:HTMLElementOverlayHolder

    constructor(public instance:JsPlumbInstance, public overlay: Overlay) {
        this.htmlElementOverlay = overlay as HTMLElementOverlayHolder
    }

    static getElement (o:HTMLElementOverlayHolder, component?:Component, elementCreator?:(c:Component) => Element):Element{
        if (o.canvas == null) {
            if (elementCreator && component) {
                o.canvas = elementCreator(component) as jsPlumbDOMElement
                const cls = o.instance.overlayClass + " " + (o.cssClass ? o.cssClass : "")
                o.instance.addClass(o.canvas, cls)
            } else {
                o.canvas = createElement(ELEMENT_DIV, {}, o.instance.overlayClass + " " + (o.cssClass ? o.cssClass : ""))
            }

            o.instance.setAttribute(o.canvas, "jtk-overlay-id", o.id)
            for (let att in o.attributes) {
                o.instance.setAttribute(o.canvas, att, o.attributes[att])
            }

            o.canvas.style.position = ABSOLUTE
            o.instance._appendElement(o.canvas, o.instance.getContainer())
            o.instance.getId(o.canvas)
            
            let ts = "translate(-50%, -50%)";
            (<any>o.canvas.style).webkitTransform = ts;
            (<any>o.canvas.style).mozTransform = ts;
            (<any>o.canvas.style).msTransform = ts;
            (<any>o.canvas.style).oTransform = ts;
            (<any>o.canvas.style).transform = ts
    
            if (!o.isVisible()) {
                o.canvas.style.display = NONE
            }

            (<any>o.canvas).jtk = { overlay:o }

        }

        return o.canvas
    }

    static destroy(o:HTMLElementOverlayHolder) {
        o.canvas && o.canvas.parentNode && o.canvas.parentNode.removeChild(o.canvas)
        delete o.canvas
        delete o.cachedDimensions
    }

    static _getDimensions(o:HTMLElementOverlayHolder, forceRefresh?:boolean):Size {
        if (o.cachedDimensions == null || forceRefresh) {
            o.cachedDimensions = {w:1,h:1}
        }
        return o.cachedDimensions
    }
}


import {createElement} from './browser-util'
import { jsPlumbDOMElement} from './element-facade'
import {Component, JsPlumbInstance, Overlay, NONE, ABSOLUTE} from "@jsplumb/core"
import {ELEMENT_DIV} from "./browser-jsplumb-instance"
import { Size } from "@jsplumb/util"

interface HTMLElementOverlayHolder extends Overlay {
    canvas:jsPlumbDOMElement
    cachedDimensions:Size
} 

export class HTMLElementOverlay {

    protected htmlElementOverlay:HTMLElementOverlayHolder

    constructor(public instance:JsPlumbInstance, public overlay: Overlay) {
        this.htmlElementOverlay = overlay as HTMLElementOverlayHolder
    }

    static createElement(o:HTMLElementOverlayHolder):Element {
        const el = createElement(ELEMENT_DIV, {}, o.instance.overlayClass + " " +
            (o.cssClass ? o.cssClass : ""))

        o.instance.setAttribute(el, "jtk-overlay-id", o.id)
        return el
    }

    static getElement (o:HTMLElementOverlayHolder, component?:Component, elementCreator?:(c:Component) => Element):Element{
        if (o.canvas == null) {
            if (elementCreator && component) {
                o.canvas = elementCreator(component) as jsPlumbDOMElement
            } else {
                o.canvas = HTMLElementOverlay.createElement(o) as jsPlumbDOMElement
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

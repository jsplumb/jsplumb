import {Endpoint, jsPlumbElement} from "@jsplumb/core"
import {Drag} from "@jsplumb/dom/collicat"
import {jsPlumbDOMInformation} from "@jsplumb/dom/browser-jsplumb-instance"

export interface jsPlumbDOMElement extends HTMLElement, jsPlumbElement<Element> {
    _isJsPlumbGroup: boolean
    _jsPlumbOrphanedEndpoints:Array<Endpoint>
    offsetParent: jsPlumbDOMElement
    parentNode: jsPlumbDOMElement
    jtk:jsPlumbDOMInformation
    _jsPlumbScrollHandler?:Function
    _katavorioDrag?:Drag
    cloneNode:(deep?:boolean) => jsPlumbDOMElement
}


import { _attr, _node, _appendAtIndex, ELEMENT_PATH } from './svg-util'
import {PaintStyle} from "../common/paint-style"
import {extend, Extents} from "../util/util"
import {Endpoint} from "../core/endpoint/endpoint"
import {Connection} from "../core/connector/connection-impl"
import {Overlay} from "../core/overlay/overlay"
import {Component} from "../core/component/component"

export interface SvgOverlayPaintParams extends Extents, PaintStyle {
    component:Component
    d?:any
}

export function ensureSVGOverlayPath(o:SVGElementOverlay):SVGElement {

    if (o.path == null) {
        const atts = extend({"jtk-overlay-id": o.id}, o.attributes)
        o.path = _node(ELEMENT_PATH, atts)

        const cls = o.instance.overlayClass + " " + (o.cssClass ? o.cssClass : "")
        ;o.instance.addClass(<any>o.path, cls)

        ;(<any>o.path).jtk = { overlay:o }
    }

    let parent:SVGElement = o.path.parentNode as unknown as any
    if (parent == null) {
        if (o.component instanceof Connection) {
            let connector = (o.component as Connection).connector
            parent = connector != null ? (connector as any).canvas : null
        } else if (o.component instanceof Endpoint) {
            let endpoint = (o.component as Endpoint).endpoint
            parent = endpoint != null ? (endpoint as any).canvas : endpoint
        }

        if (parent != null) {
            _appendAtIndex(parent, o.path, 1)
        }
    }

    return o.path
}

export function paintSVGOverlay(o:SVGElementOverlay, path:string, params:SvgOverlayPaintParams, extents:Extents):void {

    ensureSVGOverlayPath(o)

    let offset = [0, 0]

    if (extents.xmin < 0) {
        offset[0] = -extents.xmin
    }
    if (extents.ymin < 0) {
        offset[1] = -extents.ymin
    }

    let a = {
        "d": path,
        stroke: params.stroke ? params.stroke : null,
        fill: params.fill ? params.fill : null,
        transform: "translate(" + offset[0] + "," + offset[1] + ")",
        "pointer-events": "visibleStroke"
    }

    _attr(o.path, a)
}

export function destroySVGOverlay(o:Overlay, force?:boolean) {

    let _o = o as any

    if (_o.path != null && _o.path.parentNode != null) {
        _o.path.parentNode.removeChild(_o.path)
    }

    if (_o.bgPath != null && _o.bgPath.parentNode != null) {
        _o.bgPath.parentNode.removeChild(_o.bgPath)
    }

    delete _o.path
    delete _o.bgPath


}

export abstract class SVGElementOverlay extends Overlay {

    path:SVGElement



}


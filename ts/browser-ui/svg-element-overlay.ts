
import { _attr, _node, _appendAtIndex, ELEMENT_PATH } from './svg-util'
import {Component, Connection, Endpoint, Extents, Overlay, PaintStyle} from "@jsplumb/core"

export interface SvgOverlayPaintParams extends Extents, PaintStyle {
    component:Component
    d?:any
}

export abstract class SVGElementOverlay extends Overlay {

    path:SVGElement

    static ensurePath(o:SVGElementOverlay):SVGElement {

        if (o.path == null) {
            o.path = _node(ELEMENT_PATH, {"jtk-overlay-id": o.id})
            let parent:SVGElement = null

            if (o.component instanceof Connection) {
                let connector = (o.component as Connection).connector
                parent = connector != null ? (connector as any).canvas : null
            } else if (o.component instanceof Endpoint) {
                let endpoint = (o.component as Endpoint).endpoint
                parent = endpoint != null ? (endpoint as any).svg : endpoint
            }

            if (parent != null) {
                _appendAtIndex(parent, o.path, 1)
            }

            o.instance.addClass(<any>o.path, o.instance.overlayClass);

            (<any>o.path).jtk = { overlay:o }
        }

        return o.path
    }

    static paint(o:SVGElementOverlay, path:string, params:SvgOverlayPaintParams, extents:Extents):void {

        this.ensurePath(o)

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

    static destroy(o:Overlay, force?:boolean) {

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
}



import {Overlay} from "./overlay"
import {JsPlumbInstance} from "../core"

import {Component} from '../component/component'
import { OverlayFactory } from '../factory/overlay-factory'
import {AbstractConnector} from "../connector/abstract-connector"
import {ArrowOverlayOptions} from "../../common/overlay"
import {perpendicularLineTo, pointOnLine} from "../../util/geom"
import {PointXY, Size} from "../../util/util"
import {PaintStyle} from "../../common/paint-style"

const DEFAULT_WIDTH = 20
const DEFAULT_LENGTH = 20

export class ArrowOverlay extends Overlay {

    width:number
    length:number
    foldback:number
    direction:number
    location:number = 0.5

    paintStyle:PaintStyle

    static type = "Arrow"
    type:string = ArrowOverlay.type

    cachedDimensions:Size

    constructor(public instance:JsPlumbInstance, public component:Component,
                p:ArrowOverlayOptions) {

        super(instance, component, p)
        p = p || {}

        this.width = p.width || DEFAULT_WIDTH
        this.length = p.length || DEFAULT_LENGTH
        this.direction = (p.direction || 1) < 0 ? -1 : 1
        this.foldback = p.foldback || 0.623
        this.paintStyle = p.paintStyle || { "strokeWidth": 1 }

        this.location = p.location == null ? this.location : Array.isArray(p.location) ? (p.location as number[])[0] : p.location as number
    }

    draw(component:Component, currentConnectionPaintStyle:PaintStyle, absolutePosition?: PointXY): any {

        if (component instanceof AbstractConnector) {

            let connector = component as AbstractConnector

            let hxy, mid, txy, tail, cxy

            if (this.location > 1 || this.location < 0) {
                let fromLoc = this.location < 0 ? 1 : 0
                hxy = connector.pointAlongPathFrom(fromLoc, this.location, false)
                mid = connector.pointAlongPathFrom(fromLoc, this.location - (this.direction * this.length / 2), false)
                txy = pointOnLine(hxy, mid, this.length)
            } else if (this.location === 1) {
                hxy = connector.pointOnPath(this.location)
                mid = connector.pointAlongPathFrom(this.location, -(this.length))
                txy = pointOnLine(hxy, mid, this.length)

                if (this.direction === -1) {
                    const _ = txy
                    txy = hxy
                    hxy = _
                }
            } else if (this.location === 0) {
                txy = connector.pointOnPath(this.location)
                mid = connector.pointAlongPathFrom(this.location, this.length)
                hxy = pointOnLine(txy, mid, this.length)
                if (this.direction === -1) {
                    const __ = txy
                    txy = hxy
                    hxy = __
                }
            } else {
                hxy = connector.pointAlongPathFrom(this.location, this.direction * this.length / 2)
                mid = connector.pointOnPath(this.location)
                txy = pointOnLine(hxy, mid, this.length)
            }

            tail = perpendicularLineTo(hxy, txy, this.width)
            cxy = pointOnLine(hxy, txy, this.foldback * this.length)

            let d = {hxy: hxy, tail: tail, cxy: cxy},
                stroke = this.paintStyle.stroke || currentConnectionPaintStyle.stroke,
                fill = this.paintStyle.fill || currentConnectionPaintStyle.stroke,
                lineWidth = this.paintStyle.strokeWidth || currentConnectionPaintStyle.strokeWidth

            return {
                component: component,
                d: d,
                "stroke-width": lineWidth,
                stroke: stroke,
                fill: fill,
                xmin: Math.min(hxy.x, tail[0].x, tail[1].x),
                xmax: Math.max(hxy.x, tail[0].x, tail[1].x),
                ymin: Math.min(hxy.y, tail[0].y, tail[1].y),
                ymax: Math.max(hxy.y, tail[0].y, tail[1].y)
            }
        }
    }

    updateFrom(d: any): void { }

}

export function isArrowOverlay(o:Overlay):o is ArrowOverlay {
    return o.type === ArrowOverlay.type
}

OverlayFactory.register(ArrowOverlay.type, ArrowOverlay)

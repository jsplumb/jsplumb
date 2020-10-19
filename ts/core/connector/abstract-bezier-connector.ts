import {AbstractConnector, ConnectorComputeParams, PaintGeometry} from "./abstract-connector"
import {ArcSegment} from "./arc-segment"
import { AnchorPlacement } from '../anchor-manager'
import { Connection } from '../connector/connection-impl'
import { JsPlumbInstance } from "../core"

export interface AbstractBezierOptions {
    showLoopback?:boolean
    curviness?:number
    margin?:number
    proximityLimit?:number
    orientation?:string
    loopbackRadius?:number
}

export abstract class AbstractBezierConnector extends AbstractConnector {

    showLoopback:boolean
    curviness:number
    margin:number
    proximityLimit:number
    orientation:string
    loopbackRadius:number
    clockwise:boolean
    isLoopbackCurrently:boolean

    geometry:{
        controlPoints:[any, any],
        source:AnchorPlacement,
        target:AnchorPlacement
    }

    getDefaultStubs():[number, number] {
        return [0,0]
    }

    constructor(instance:JsPlumbInstance, public connection:Connection, params:any) {

        super(instance, connection, params)

        params = params || {}
        this.showLoopback = params.showLoopback !== false
        this.curviness = params.curviness || 10
        this.margin = params.margin || 5
        this.proximityLimit = params.proximityLimit || 80
        this.clockwise = params.orientation && params.orientation === "clockwise"
        this.loopbackRadius = params.loopbackRadius || 25
        this.isLoopbackCurrently = false
    }

    _compute (paintInfo:PaintGeometry, p:ConnectorComputeParams) {

        let sp = p.sourcePos,
            tp = p.targetPos,
            _w = Math.abs(sp[0] - tp[0]),
            _h = Math.abs(sp[1] - tp[1])

        if (!this.showLoopback || (p.sourceEndpoint.elementId !== p.targetEndpoint.elementId)) {
            this.isLoopbackCurrently = false
            this._computeBezier(paintInfo, p, sp, tp, _w, _h)
        } else {
            this.isLoopbackCurrently = true
            // a loopback connector.  draw an arc from one anchor to the other.
            let x1 = p.sourcePos[0], y1 = p.sourcePos[1] - this.margin,
                cx = x1, cy = y1 - this.loopbackRadius,
                // canvas sizing stuff, to ensure the whole painted area is visible.
                _x = cx - this.loopbackRadius,
                _y = cy - this.loopbackRadius

            _w = 2 * this.loopbackRadius
            _h = 2 * this.loopbackRadius

            paintInfo.points[0] = _x
            paintInfo.points[1] = _y
            paintInfo.points[2] = _w
            paintInfo.points[3] = _h

            // ADD AN ARC SEGMENT.
            this._addSegment(ArcSegment, {
                loopback: true,
                x1: (x1 - _x) + 4,
                y1: y1 - _y,
                startAngle: 0,
                endAngle: 2 * Math.PI,
                r: this.loopbackRadius,
                ac: !this.clockwise,
                x2: (x1 - _x) - 4,
                y2: y1 - _y,
                cx: cx - _x,
                cy: cy - _y
            })
        }
    }

    exportGeometry():any {
        if (this.geometry == null) {
            return null
        } else {
            const s:Array<any> = [], t:Array<any> = [], cp1:Array<any> = [], cp2:Array<any> = []
            Array.prototype.push.apply(s, this.geometry.source)
            Array.prototype.push.apply(t, this.geometry.target)
            Array.prototype.push.apply(cp1, this.geometry.controlPoints[0])
            Array.prototype.push.apply(cp2, this.geometry.controlPoints[1])
            return {
                source:s,
                target:t,
                controlPoints:[ cp1, cp2 ]
            }
        }
    }

    importGeometry(geometry:any):boolean {
        if (geometry != null) {

            if (geometry.controlPoints == null || geometry.controlPoints.length != 2) {
                console.log("Bezier: cannot import geometry; controlPoints missing or does not have length 2")
                this.setGeometry(null, true)
                return false
            }

            if (geometry.controlPoints[0].length != 2 || geometry.controlPoints[1].length != 2) {
                console.log("Bezier: cannot import geometry; controlPoints malformed")
                this.setGeometry(null, true)
                return false
            }

            if (geometry.source == null || geometry.source.length != 4) {
                console.log("Bezier: cannot import geometry; source missing or malformed")
                this.setGeometry(null, true)
                return false
            }

            if (geometry.target == null || geometry.target.length != 4) {
                console.log("Bezier: cannot import geometry; target missing or malformed")
                this.setGeometry(null, true)
                return false
            }

            this.setGeometry(geometry, false)
            return true
        } else {
            return false
        }
    }

    abstract _computeBezier(paintInfo:PaintGeometry, p:ConnectorComputeParams, sp:AnchorPlacement, tp:AnchorPlacement, _w:number, _h:number):void

}

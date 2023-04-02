/**
 * The bezier connector's internal representation of a path.
 */
import {ConnectorOptions, Geometry} from "../common/connector"
import {extend, log, PointXY} from "../util/util"
import {ArcSegment} from "../core/connector/arc-segment"
import {AbstractConnector, ConnectorComputeParams, PaintGeometry} from "../core/connector/abstract-connector"
import {AnchorPlacement} from "../common/anchor"
import {Connection} from "../core/connector/connection-impl"


export interface BezierConnectorGeometry extends Geometry {
    controlPoints:[
        PointXY, PointXY
    ],
    source:AnchorPlacement,
    target:AnchorPlacement
}

/**
 * Base options interface for StateMachine and Bezier connectors.
 * @public
 */
export interface AbstractBezierOptions extends ConnectorOptions {
    /**
     * Whether or not to show connections whose source and target is the same element.
     */
    showLoopback?:boolean
    /**
     * A measure of how "curvy" the bezier is. In terms of maths what this translates to is how far from the curve the control points are positioned.
     */
    curviness?:number
    margin?:number
    proximityLimit?:number
    orientation?:string
    loopbackRadius?:number
}

/**
 * @internal
 */
export abstract class AbstractBezierConnector extends AbstractConnector {

    showLoopback:boolean
    curviness:number
    margin:number
    proximityLimit:number
    orientation:string
    loopbackRadius:number
    clockwise:boolean
    isLoopbackCurrently:boolean

    geometry: BezierConnectorGeometry = null

    getDefaultStubs():[number, number] {
        return [0,0]
    }

    constructor(public connection:Connection, params:any) {

        super(connection, params)

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
            _w = Math.abs(sp.curX - tp.curX),
            _h = Math.abs(sp.curY - tp.curY)

        if (!this.showLoopback || (p.sourceEndpoint.elementId !== p.targetEndpoint.elementId)) {
            this.isLoopbackCurrently = false
            this._computeBezier(paintInfo, p, sp, tp, _w, _h)
        } else {
            this.isLoopbackCurrently = true
            // a loopback connector.  draw an arc from one anchor to the other.
            let x1 = p.sourcePos.curX, y1 = p.sourcePos.curY - this.margin,
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

    exportGeometry():BezierConnectorGeometry {
        if (this.geometry == null) {
            return null
        } else {
            return {
                controlPoints:[
                    extend({} as any, this.geometry.controlPoints[0]),
                    extend({} as any, this.geometry.controlPoints[1])
                ],
                source:extend({} as any, this.geometry.source),
                target:extend({} as any, this.geometry.target)
            }
        }
    }


    transformGeometry(g: BezierConnectorGeometry, dx: number, dy: number): BezierConnectorGeometry {

        return {
            controlPoints:[
                {x:g.controlPoints[0].x + dx,y:g.controlPoints[0].y + dy },
                {x:g.controlPoints[1].x + dx,y:g.controlPoints[1].y + dy }
            ],
            source:this.transformAnchorPlacement(g.source, dx, dy),
            target:this.transformAnchorPlacement(g.target, dx, dy)
        }
    }

    importGeometry(geometry:BezierConnectorGeometry):boolean {
        if (geometry != null) {

            if (geometry.controlPoints == null || geometry.controlPoints.length != 2) {
                log("jsPlumb Bezier: cannot import geometry; controlPoints missing or does not have length 2")
                this.setGeometry(null, true)
                return false
            }

            if (geometry.controlPoints[0].x == null || geometry.controlPoints[0].y == null || geometry.controlPoints[1].x == null || geometry.controlPoints[1].y == null) {
                log("jsPlumb Bezier: cannot import geometry; controlPoints malformed")
                this.setGeometry(null, true)
                return false
            }

            if (geometry.source == null || geometry.source.curX == null || geometry.source.curY == null) {
                log("jsPlumb Bezier: cannot import geometry; source missing or malformed")
                this.setGeometry(null, true)
                return false
            }

            if (geometry.target == null || geometry.target.curX == null || geometry.target.curY == null) {
                log("jsPlumb Bezier: cannot import geometry; target missing or malformed")
                this.setGeometry(null, true)
                return false
            }

            this.setGeometry(geometry, false)
            return true
        } else {
            return false
        }
    }

    abstract _computeBezier(paintInfo:PaintGeometry, p:ConnectorComputeParams, sp:PointXY, tp:PointXY, _w:number, _h:number):void

}

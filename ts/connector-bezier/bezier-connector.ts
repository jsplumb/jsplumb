import {AbstractBezierConnector, AbstractBezierOptions} from "./abstract-bezier-connector"

import {BezierSegment} from "./bezier-segment"
import {ConnectorComputeParams, PaintGeometry} from "../core/connector/abstract-connector"
import {PointXY} from "../util/util"
import {AnchorPlacement} from "../common/anchor"
import {Connection} from "../core/connector/connection-impl"

/**
 * Options for the Bezier connector.
 */
export interface BezierOptions extends AbstractBezierOptions {}

export class BezierConnector extends AbstractBezierConnector {

    static type = "Bezier"
    type = BezierConnector.type

    majorAnchor:number
    minorAnchor:number

    constructor(public connection:Connection, params:BezierOptions) {
        super(connection, params)
        params = params || {}
        this.majorAnchor = params.curviness || 150
        this.minorAnchor = 10
    }

    getCurviness ():number {
        return this.majorAnchor
    }

    protected _findControlPoint (point:PointXY, sourceAnchorPosition:AnchorPlacement, targetAnchorPosition:AnchorPlacement, soo:[number, number], too:[number, number]):PointXY {
        // determine if the two anchors are perpendicular to each other in their orientation.  we swap the control
        // points around if so (code could be tightened up)
        let perpendicular = soo[0] !== too[0] || soo[1] === too[1],
            p:PointXY = {x:0,y:0}

        if (!perpendicular) {
            if (soo[0] === 0) {
                p.x = (sourceAnchorPosition.curX < targetAnchorPosition.curX ? point.x + this.minorAnchor : point.x - this.minorAnchor)
            }
            else {
                p.x = (point.x - (this.majorAnchor * soo[0]))
            }

            if (soo[1] === 0) {
                p.y = (sourceAnchorPosition.curY < targetAnchorPosition.curY ? point.y + this.minorAnchor : point.y - this.minorAnchor)
            }
            else {
                p.y = (point.y + (this.majorAnchor * too[1]))
            }
        }
        else {
            if (too[0] === 0) {
                p.x = (targetAnchorPosition.curX < sourceAnchorPosition.curX ? point.x + this.minorAnchor : point.x - this.minorAnchor)
            }
            else {
                p.x = (point.x + (this.majorAnchor * too[0]))
            }

            if (too[1] === 0) {
                p.y = (targetAnchorPosition.curY < sourceAnchorPosition.curY ? point.y + this.minorAnchor : point.y - this.minorAnchor)
            }
            else {
                p.y = (point.y + (this.majorAnchor * soo[1]))
            }
        }

        return p
    }

    _computeBezier (paintInfo:PaintGeometry, p:ConnectorComputeParams, sp:AnchorPlacement, tp:AnchorPlacement, _w:number, _h:number):void {

        let _CP, _CP2,
            _sx = sp.curX < tp.curX ? _w : 0,
            _sy = sp.curY < tp.curY ? _h : 0,
            _tx = sp.curX < tp.curX ? 0 : _w,
            _ty = sp.curY < tp.curY ? 0 : _h

        if (this.edited !== true) {
            _CP = this._findControlPoint({x:_sx, y:_sy}, sp, tp, paintInfo.so, paintInfo.to)
            _CP2 = this._findControlPoint({x:_tx, y:_ty}, tp, sp, paintInfo.to, paintInfo.so)

        } else {
            _CP = this.geometry.controlPoints[0]
            _CP2 = this.geometry.controlPoints[1]
        }

        this.geometry = {
            controlPoints:[_CP, _CP2],
            source:p.sourcePos,
            target:p.targetPos

        }

        this._addSegment(BezierSegment, {
            x1: _sx, y1: _sy, x2: _tx, y2: _ty,
            cp1x: _CP.x, cp1y: _CP.y, cp2x: _CP2.x, cp2y: _CP2.y
        })
    }

}

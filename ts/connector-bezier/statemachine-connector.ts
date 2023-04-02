import {AbstractBezierConnector, AbstractBezierOptions} from "./abstract-bezier-connector"
import {BezierSegment} from "./bezier-segment"
import {ConnectorComputeParams, PaintGeometry} from "../core/connector/abstract-connector"
import {PointXY} from "../util/util"
import {AnchorPlacement} from "../common/anchor"
import {Connection} from "../core/connector/connection-impl"

function _segment (x1:number, y1:number, x2:number, y2:number):number {
    if (x1 <= x2 && y2 <= y1) {
        return 1
    }
    else if (x1 <= x2 && y1 <= y2) {
        return 2
    }
    else if (x2 <= x1 && y2 >= y1) {
        return 3
    }
    return 4
}

// the control point we will use depends on the faces to which each end of the connection is assigned, specifically whether or not the
// two faces are parallel or perpendicular.  if they are parallel then the control point lies on the midpoint of the axis in which they
// are parellel and varies only in the other axis; this variation is proportional to the distance that the anchor points lie from the
// center of that face.  if the two faces are perpendicular then the control point is at some distance from both the midpoints; the amount and
// direction are dependent on the orientation of the two elements. 'seg', passed in to this method, tells you which segment the target element
// lies in with respect to the source: 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left.
//
// sourcePos and targetPos are arrays of info about where on the source and target each anchor is located.  their contents are:
//
// 0 - absolute x
// 1 - absolute y
// 2 - proportional x in element (0 is left edge, 1 is right edge)
// 3 - proportional y in element (0 is top edge, 1 is bottom edge)
//
function _findControlPoint (midx:number, midy:number, segment:number, sourceEdge:AnchorPlacement, targetEdge:AnchorPlacement, dx:number, dy:number, distance:number, proximityLimit:number):PointXY {
    // TODO (maybe)
    // - if anchor pos is 0.5, make the control point take into account the relative position of the elements.
    if (distance <= proximityLimit) {
        return {x:midx, y:midy}
    }

    if (segment === 1) {
        if (sourceEdge.curY <= 0 && targetEdge.curY >= 1) {
            return {x:midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), y:midy }
        }
        else if (sourceEdge.curX >= 1 && targetEdge.curX <= 0) {
            return {x:midx, y:midy + (sourceEdge.y < 0.5 ? -1 * dy : dy) }
        }
        else {
            return {x:midx + (-1 * dx) , y:midy + (-1 * dy) }
        }
    }
    else if (segment === 2) {
        if (sourceEdge.curY >= 1 && targetEdge.curY <= 0) {
            return {x:midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), y:midy }
        }
        else if (sourceEdge.curX >= 1 && targetEdge.curX <= 0) {
            return {x:midx, y:midy + (sourceEdge.y < 0.5 ? -1 * dy : dy) }
        }
        else {
            return {x:midx + dx, y:midy + (-1 * dy) }
        }
    }
    else if (segment === 3) {
        if (sourceEdge.curY >= 1 && targetEdge.curY <= 0) {
            return {x:midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), y:midy }
        }
        else if (sourceEdge.curX <= 0 && targetEdge.curX >= 1) {
            return {x:midx, y:midy + (sourceEdge.y < 0.5 ? -1 * dy : dy) }
        }
        else {
            return {x:midx + (-1 * dx) , y:midy + (-1 * dy) }
        }
    }
    else if (segment === 4) {
        if (sourceEdge.curY <= 0 && targetEdge.curY >= 1) {
            return {x:midx + (sourceEdge.x < 0.5 ? -1 * dx : dx), y:midy }
        }
        else if (sourceEdge.curX <= 0 && targetEdge.curX >= 1) {
            return {x:midx, y:midy + (sourceEdge.y < 0.5 ? -1 * dy : dy) }
        }
        else {
            return {x:midx + dx , y:midy + (-1 * dy) }
        }
    }
}

export interface StateMachineOptions extends AbstractBezierOptions  { }

export class StateMachineConnector extends AbstractBezierConnector {

    static type = "StateMachine"
    type = StateMachineConnector.type

    _controlPoint:PointXY

    constructor(public connection:Connection, params:StateMachineOptions) {
        super(connection, params)

        this.curviness = params.curviness || 10
        this.margin = params.margin || 5
        this.proximityLimit = params.proximityLimit || 80
        this.clockwise = params.orientation && params.orientation === "clockwise"
    }

    _computeBezier (paintInfo:PaintGeometry, params:ConnectorComputeParams, sp:AnchorPlacement, tp:AnchorPlacement, w:number, h:number):void {
        let _sx = sp.curX < tp.curX ? 0 : w,
            _sy = sp.curY < tp.curY ? 0 : h,
            _tx = sp.curX < tp.curX ? w : 0,
            _ty = sp.curY < tp.curY ? h : 0

        // now adjust for the margin
        if (sp.x === 0) {
            _sx -= this.margin
        }
        if (sp.x === 1) {
            _sx += this.margin
        }
        if (sp.y === 0) {
            _sy -= this.margin
        }
        if (sp.y === 1) {
            _sy += this.margin
        }
        if (tp.x === 0) {
            _tx -= this.margin
        }
        if (tp.x === 1) {
            _tx += this.margin
        }
        if (tp.y === 0) {
            _ty -= this.margin
        }
        if (tp.y === 1) {
            _ty += this.margin
        }

        //
        // these connectors are quadratic bezier curves, having a single control point. if both anchors
        // are located at 0.5 on their respective faces, the control point is set to the midpoint and you
        // get a straight line.  this is also the case if the two anchors are within 'proximityLimit', since
        // it seems to make good aesthetic sense to do that. outside of that, the control point is positioned
        // at 'curviness' pixels away along the normal to the straight line connecting the two anchors.
        //
        // there may be two improvements to this.  firstly, we might actually support the notion of avoiding nodes
        // in the UI, or at least making a good effort at doing so.  if a connection would pass underneath some node,
        // for example, we might increase the distance the control point is away from the midpoint in a bid to
        // steer it around that node.  this will work within limits, but i think those limits would also be the likely
        // limits for, once again, aesthetic good sense in the layout of a chart using these connectors.
        //
        // the second possible change is actually two possible changes: firstly, it is possible we should gradually
        // decrease the 'curviness' as the distance between the anchors decreases; start tailing it off to 0 at some
        // point (which should be configurable).  secondly, we might slightly increase the 'curviness' for connectors
        // with respect to how far their anchor is from the center of its respective face. this could either look cool,
        // or stupid, and may indeed work only in a way that is so subtle as to have been a waste of time.
        //

        if (this.edited !== true) {

            let _midx = (_sx + _tx) / 2,
                _midy = (_sy + _ty) / 2,
                segment = _segment(_sx, _sy, _tx, _ty),
                distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2))


            // calculate the control point.  this code will be where we'll put in a rudimentary element avoidance scheme; it
            // will work by extending the control point to force the curve to be, um, curvier.
            this._controlPoint = _findControlPoint(_midx,
                _midy,
                segment,
                params.sourcePos,
                params.targetPos,
                this.curviness, this.curviness,
                distance,
                this.proximityLimit)
        } else {
            this._controlPoint = this.geometry.controlPoints[0]
        }

        let cp1x, cp2x, cp1y, cp2y

        cp1x = this._controlPoint.x
        cp2x = this._controlPoint.x
        cp1y = this._controlPoint.y
        cp2y = this._controlPoint.y

        this.geometry = {
            controlPoints:[this._controlPoint, this._controlPoint],
            source:params.sourcePos,
            target:params.targetPos
        }

        this._addSegment(BezierSegment, {
            x1: _tx, y1: _ty, x2: _sx, y2: _sy,
            cp1x: cp1x, cp1y: cp1y,
            cp2x: cp2x, cp2y: cp2y
        })
    }

}

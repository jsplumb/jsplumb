
/**
 * @internal
 */
import {PointXY} from "../../util/util"
import {AbstractSegment, PointNearPath, SegmentParams} from "../../common/abstract-segment"
import {gradient, lineLength, pointOnLine} from "../../util/geom"

export type StraightSegmentCoordinates = { x1:number, y1:number, x2:number, y2:number}

/**
 * @internal
 */
export interface StraightSegmentParams extends SegmentParams {}

/**
 * @internal
 */
export class StraightSegment extends AbstractSegment {

    length:number
    m:number
    m2:number

    constructor(params:StraightSegmentParams) {
        super(params)
        this._setCoordinates({x1: params.x1, y1: params.y1, x2: params.x2, y2: params.y2})
    }

    getPath(isFirstSegment: boolean): string {
        return (isFirstSegment ? "M " + this.x1 + " " + this.y1 + " " : "") + "L " + this.x2 + " " + this.y2
    }

    private _recalc ():void {
        this.length = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2))
        this.m = gradient({x: this.x1, y: this.y1}, {x: this.x2, y: this.y2})
        this.m2 = -1 / this.m

        this.extents = {
            xmin: Math.min(this.x1, this.x2),
            ymin: Math.min(this.y1, this.y2),
            xmax: Math.max(this.x1, this.x2),
            ymax: Math.max(this.y1, this.y2)
        }
    }

    static segmentType:string = "Straight"
    type = StraightSegment.segmentType

    getLength ():number {
        return this.length
    }

    getGradient ():number {
        return this.m
    }

    private _setCoordinates (coords:StraightSegmentCoordinates):void {
        this.x1 = coords.x1
        this.y1 = coords.y1
        this.x2 = coords.x2
        this.y2 = coords.y2
        this._recalc()
    }

    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive. for the straight line segment this is simple maths.
     */
    pointOnPath(location:number, absolute?:boolean):PointXY {
        if (location === 0 && !absolute) {
            return { x: this.x1, y: this.y1 }
        }
        else if (location === 1 && !absolute) {
            return { x: this.x2, y: this.y2 }
        }
        else {
            let l = absolute ? location > 0 ? location : this.length + location : location * this.length
            return pointOnLine({x: this.x1, y: this.y1}, {x: this.x2, y: this.y2}, l)
        }
    }

    /**
     * returns the gradient of the segment at the given point - which for us is constant.
     */
    gradientAtPoint (location:number, absolute?:boolean):number {
        return this.m
    }

    /**
     * returns the point on the segment's path that is 'distance' along the length of the path from 'location', where
     * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
     * this hands off to jsPlumbUtil to do the maths, supplying two points and the distance.
     */
    pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY {
        let p = this.pointOnPath(location, absolute),
            farAwayPoint = distance <= 0 ? {x: this.x1, y: this.y1} : {x: this.x2, y: this.y2 }

        if (distance <= 0 && Math.abs(distance) > 1) {
            distance *= -1
        }

        return pointOnLine(p, farAwayPoint, distance)
    }

    // is c between a and b?
    private within (a:number, b:number, c:number):boolean {
        return c >= Math.min(a, b) && c <= Math.max(a, b)
    }

    // find which of a and b is closest to c
    private closest (a:number, b:number, c:number):number {
        return Math.abs(c - a) < Math.abs(c - b) ? a : b
    }

    /**
     * Finds the closest point on this segment to [x,y]. See
     * notes on this method in AbstractSegment.
     */
    findClosestPointOnPath (x:number, y:number):PointNearPath {
        let out:PointNearPath = {
            d: Infinity,
            x: null,
            y: null,
            l: null,
            x1: this.x1,
            x2: this.x2,
            y1: this.y1,
            y2: this.y2
        }

        if (this.m === 0) {
            out.y = this.y1
            out.x = this.within(this.x1, this.x2, x) ? x : this.closest(this.x1, this.x2, x)
        }
        else if (this.m === Infinity || this.m === -Infinity) {
            out.x = this.x1
            out.y = this.within(this.y1, this.y2, y) ? y : this.closest(this.y1, this.y2, y)
        }
        else {
            // closest point lies on normal from given point to this line.
            let b = this.y1 - (this.m * this.x1),
                b2 = y - (this.m2 * x),
                // y1 = m.x1 + b and y1 = m2.x1 + b2
                // so m.x1 + b = m2.x1 + b2
                // x1(m - m2) = b2 - b
                // x1 = (b2 - b) / (m - m2)
                _x1 = (b2 - b) / (this.m - this.m2),
                _y1 = (this.m * _x1) + b

            out.x = this.within(this.x1, this.x2, _x1) ? _x1 : this.closest(this.x1, this.x2, _x1);//_x1
            out.y = this.within(this.y1, this.y2, _y1) ? _y1 : this.closest(this.y1, this.y2, _y1);//_y1
        }

        let fractionInSegment = lineLength({x:out.x, y:out.y }, { x:this.x1, y:this.y1 })
        out.d = lineLength({x:x, y:y}, out)
        out.l = fractionInSegment / length
        return out
    }

    private _pointLiesBetween (q:number, p1:number, p2:number):boolean {
        return (p2 > p1) ? (p1 <= q && q <= p2) : (p1 >= q && q >= p2)
    }

    /**
     * Calculates all intersections of the given line with this segment.
     * @param _x1
     * @param _y1
     * @param _x2
     * @param _y2
     * @returns Array of intersecting points.
     */
    lineIntersection (_x1:number, _y1:number, _x2:number, _y2:number):Array<PointXY> {
        let m2 = Math.abs(gradient({x: _x1, y: _y1}, {x: _x2, y: _y2})),
            m1 = Math.abs(this.m),
            b = m1 === Infinity ? this.x1 : this.y1 - (m1 * this.x1),
            out:Array<PointXY> = [],
            b2 = m2 === Infinity ? _x1 : _y1 - (m2 * _x1)

        // if lines parallel, no intersection
        if  (m2 !== m1) {
            // perpendicular, segment horizontal
            if(m2 === Infinity  && m1 === 0) {
                if (this._pointLiesBetween(_x1, this.x1, this.x2) && this._pointLiesBetween(this.y1, _y1, _y2)) {
                    out.push({x: _x1, y:this.y1 })  // we return X on the incident line and Y from the segment
                }
            } else if(m2 === 0 && m1 === Infinity) {
                // perpendicular, segment vertical
                if(this._pointLiesBetween(_y1, this.y1, this.y2) && this._pointLiesBetween(this.x1, _x1, _x2)) {
                    out.push({x:this.x1, y:_y1})  // we return X on the segment and Y from the incident line
                }
            } else {
                let X, Y
                if (m2 === Infinity) {
                    // test line is a vertical line. where does it cross the segment?
                    X = _x1
                    if (this._pointLiesBetween(X, this.x1, this.x2)) {
                        Y = (m1 * _x1) + b
                        if (this._pointLiesBetween(Y, _y1, _y2)) {
                            out.push({x: X, y:Y })
                        }
                    }
                } else if (m2 === 0) {
                    Y = _y1
                    // test line is a horizontal line. where does it cross the segment?
                    if (this._pointLiesBetween(Y, this.y1, this.y2)) {
                        X = (_y1 - b) / m1
                        if (this._pointLiesBetween(X, _x1, _x2)) {
                            out.push({x: X, y:Y })
                        }
                    }
                } else {
                    // mX + b = m2X + b2
                    // mX - m2X = b2 - b
                    // X(m - m2) = b2 - b
                    // X = (b2 - b) / (m - m2)
                    // Y = mX + b
                    X = (b2 - b) / (m1 - m2)
                    Y = (m1 * X) + b
                    if(this._pointLiesBetween(X, this.x1, this.x2) && this._pointLiesBetween(Y, this.y1, this.y2)) {
                        out.push({x: X, y:Y})
                    }
                }
            }
        }

        return out
    }

    /**
     * Calculates all intersections of the given box with this segment. By default this method simply calls `lineIntersection` with each of the four
     * faces of the box; subclasses can override this if they think there's a faster way to compute the entire box at once.
     * @param x X position of top left corner of box
     * @param y Y position of top left corner of box
     * @param w width of box
     * @param h height of box
     * @returns Array of intersecting points
     */
    boxIntersection (x:number, y:number, w:number, h:number):Array<PointXY> {
        let a:Array<PointXY> = []
        a.push.apply(a, this.lineIntersection(x, y, x + w, y))
        a.push.apply(a, this.lineIntersection(x + w, y, x + w, y + h))
        a.push.apply(a, this.lineIntersection(x + w, y + h, x, y + h))
        a.push.apply(a, this.lineIntersection(x, y + h, x, y))
        return a
    }
}

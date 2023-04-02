
import {
    computeBezierLength,
    Curve,
    gradientAtPoint, bezierLineIntersection,
    locationAlongCurveFrom,
    nearestPointOnCurve,
    pointAlongCurveFrom,
    pointOnCurve
} from "./bezier"
import {PointXY} from "../util/util"
import {AbstractSegment, PointNearPath, SegmentParams} from "../common/abstract-segment"

export interface BezierSegmentParams extends SegmentParams {
    cp1x:number
    cp2x:number
    cp1y:number
    cp2y:number
}

export class BezierSegment extends AbstractSegment {

    curve:Curve
    cp1x:number
    cp1y:number
    cp2x:number
    cp2y:number

    length:number = 0

    constructor(params:BezierSegmentParams) {
        super(params)

        this.cp1x = params.cp1x
        this.cp1y = params.cp1y
        this.cp2x = params.cp2x
        this.cp2y = params.cp2y

        this.x1 = params.x1
        this.x2 = params.x2
        this.y1 = params.y1
        this.y2 = params.y2

        this.curve = [
            {x: this.x1, y: this.y1},
            {x: this.cp1x, y: this.cp1y},
            {x: this.cp2x, y: this.cp2y},
            {x: this.x2, y: this.y2}
        ]

        // although this is not a strictly rigorous determination of bounds
        // of a bezier curve, it works for the types of curves that this segment
        // type produces.
        this.extents = {
            xmin: Math.min(this.x1, this.x2, this.cp1x, this.cp2x),
            ymin: Math.min(this.y1, this.y2, this.cp1y, this.cp2y),
            xmax: Math.max(this.x1, this.x2, this.cp1x, this.cp2x),
            ymax: Math.max(this.y1, this.y2, this.cp1y, this.cp2y)
        }
    }

    static segmentType:string = "Bezier"
    type = BezierSegment.segmentType

    private static _translateLocation (_curve:Curve, location:number, absolute?:boolean):number {
        if (absolute) {
            location = locationAlongCurveFrom(_curve, location > 0 ? 0 : 1, location)
        }
        return location
    }

    getPath(isFirstSegment: boolean): string {
        return (isFirstSegment ? "M " + this.x2 + " " + this.y2 + " " : "") +
            "C " + this.cp2x + " " + this.cp2y + " " + this.cp1x + " " + this.cp1y + " " + this.x1 + " " + this.y1
    }

    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive.
     */
    pointOnPath(location:number, absolute?:boolean):PointXY {
        location = BezierSegment._translateLocation(this.curve, location, absolute)
        return pointOnCurve(this.curve, location)
    }

    /**
     * returns the gradient of the segment at the given point.
     */
    gradientAtPoint (location:number, absolute?:boolean):number {
        location = BezierSegment._translateLocation(this.curve, location, absolute)
        return gradientAtPoint(this.curve, location)
    }

    pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY {
        location = BezierSegment._translateLocation(this.curve, location, absolute)
        return pointAlongCurveFrom(this.curve, location, distance)
    }

    getLength ():number {
        if (this.length == null || this.length === 0) {
            this.length = computeBezierLength(this.curve)
        }
        return this.length
    }

    findClosestPointOnPath (x:number, y:number):PointNearPath {
        let p = nearestPointOnCurve({x:x,y:y}, this.curve)
        return {
            d:Math.sqrt(Math.pow(p.point.x - x, 2) + Math.pow(p.point.y - y, 2)),
            x:p.point.x,
            y:p.point.y,
            l:1 - p.location,
            s:this,
            x1:null,
            y1:null,
            x2:null,
            y2:null
        }
    }

    lineIntersection (x1:number, y1:number, x2:number, y2:number):Array<PointXY> {
        return bezierLineIntersection(x1, y1, x2, y2, this.curve)
    }
}

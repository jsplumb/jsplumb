import {Segment} from "./segment";
import {Bounds} from "../component/abstract-component";
import {JsPlumb} from "../core";

export type ControlPoint = {
    x: number,
    y: number
}

export type CurveDescriptor = [ ControlPoint, ControlPoint, ControlPoint, ControlPoint ];

declare const jsBezier:any;

export class BezierSegment extends Segment {

    tipe = "Bezier";

    curve:CurveDescriptor;
    bounds:Bounds;

    constructor(params:any) {
        super(params);

        this.curve = [
            { x: params.x1, y: params.y1},
            { x: params.cp1x, y: params.cp1y },
            { x: params.cp2x, y: params.cp2y },
            { x: params.x2, y: params.y2 }
        ];

        // although this is not a strictly rigorous determination of bounds
        // of a bezier curve, it works for the types of curves that this segment
        // type produces.
        this.bounds = {
            minX: Math.min(params.x1, params.x2, params.cp1x, params.cp2x),
            minY: Math.min(params.y1, params.y2, params.cp1y, params.cp2y),
            maxX: Math.max(params.x1, params.x2, params.cp1x, params.cp2x),
            maxY: Math.max(params.y1, params.y2, params.cp1y, params.cp2y)
        };


    }

    // TODO get jsBezier types
    private static _translateLocation(_curve:any, location:number, absolute?:Boolean) {
        if (absolute) {
            location = jsBezier.locationAlongCurveFrom(_curve, location > 0 ? 0 : 1, location);
        }

        return location;
    }

    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive.
     */
    pointOnPath(location:number, absolute?:Boolean) {
        location = BezierSegment._translateLocation(this.curve, location, absolute);
        return jsBezier.pointOnCurve(this.curve, location);
    }

    /**
     * returns the gradient of the segment at the given point.
     */
    gradientAtPoint(location:number, absolute?:Boolean) {
        location = BezierSegment._translateLocation(this.curve, location, absolute);
        return jsBezier.gradientAtPoint(this.curve, location);
    }

    pointAlongPathFrom(location:number, distance:number, absolute?:Boolean) {
        location = BezierSegment._translateLocation(this.curve, location, absolute);
        return jsBezier.pointAlongCurveFrom(this.curve, location, distance);
    }

    getLength() {
        return jsBezier.getLength(this.curve);
    }

    getBounds() {
        return this.bounds;
    }

}


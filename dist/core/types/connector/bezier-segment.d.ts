import { AbstractSegment, PointNearPath, SegmentBounds } from "./abstract-segment";
import { PointXY } from '../common';
import { JsPlumbInstance } from "../core";
import { Curve } from "../bezier";
export declare class BezierSegment extends AbstractSegment {
    curve: Curve;
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    bounds: SegmentBounds;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    length: number;
    constructor(instance: JsPlumbInstance, params: any);
    static segmentType: string;
    type: string;
    private static _translateLocation;
    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive.
     */
    pointOnPath(location: number, absolute?: boolean): PointXY;
    /**
     * returns the gradient of the segment at the given point.
     */
    gradientAtPoint(location: number, absolute?: boolean): number;
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    getLength(): number;
    getBounds(): SegmentBounds;
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
}

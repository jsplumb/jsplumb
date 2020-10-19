import { AbstractSegment } from "./abstract-segment";
import { PointXY } from '../common';
import { JsPlumbInstance } from "../core";
export declare class ArcSegment extends AbstractSegment {
    private instance;
    static segmentType: string;
    type: string;
    cx: number;
    cy: number;
    radius: number;
    anticlockwise: boolean;
    startAngle: number;
    endAngle: number;
    sweep: number;
    length: number;
    circumference: number;
    frac: number;
    constructor(instance: JsPlumbInstance, params: any);
    private _calcAngle;
    private _calcAngleForLocation;
    getLength(): number;
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
}

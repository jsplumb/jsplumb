import { Curve } from "./bezier";
import { PointXY } from "../util/util";
import { AbstractSegment, PointNearPath, SegmentParams } from "../common/abstract-segment";
export interface BezierSegmentParams extends SegmentParams {
    cp1x: number;
    cp2x: number;
    cp1y: number;
    cp2y: number;
}
export declare class BezierSegment extends AbstractSegment {
    curve: Curve;
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
    length: number;
    constructor(params: BezierSegmentParams);
    static segmentType: string;
    type: string;
    private static _translateLocation;
    getPath(isFirstSegment: boolean): string;
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
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
}
//# sourceMappingURL=bezier-segment.d.ts.map
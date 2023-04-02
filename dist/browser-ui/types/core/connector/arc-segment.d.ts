import { PointXY } from "../../util/util";
import { AbstractSegment, SegmentParams } from "../../common/abstract-segment";
/**
 * @internal
 */
export interface ArcSegmentParams extends SegmentParams {
    cx: number;
    cy: number;
    r: number;
    ac: boolean;
    startAngle?: number;
    endAngle?: number;
}
/**
 * @internal
 */
export declare class ArcSegment extends AbstractSegment {
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
    constructor(params: ArcSegmentParams);
    private _calcAngle;
    private _calcAngleForLocation;
    getPath(isFirstSegment: boolean): string;
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
//# sourceMappingURL=arc-segment.d.ts.map
/**
 * @internal
 */
import { PointXY } from "../../util/util";
import { AbstractSegment, PointNearPath, SegmentParams } from "../../common/abstract-segment";
export declare type StraightSegmentCoordinates = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
/**
 * @internal
 */
export interface StraightSegmentParams extends SegmentParams {
}
/**
 * @internal
 */
export declare class StraightSegment extends AbstractSegment {
    length: number;
    m: number;
    m2: number;
    constructor(params: StraightSegmentParams);
    getPath(isFirstSegment: boolean): string;
    private _recalc;
    static segmentType: string;
    type: string;
    getLength(): number;
    getGradient(): number;
    private _setCoordinates;
    /**
     * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
     * 0 to 1 inclusive. for the straight line segment this is simple maths.
     */
    pointOnPath(location: number, absolute?: boolean): PointXY;
    /**
     * returns the gradient of the segment at the given point - which for us is constant.
     */
    gradientAtPoint(location: number, absolute?: boolean): number;
    /**
     * returns the point on the segment's path that is 'distance' along the length of the path from 'location', where
     * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
     * this hands off to jsPlumbUtil to do the maths, supplying two points and the distance.
     */
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    private within;
    private closest;
    /**
     * Finds the closest point on this segment to [x,y]. See
     * notes on this method in AbstractSegment.
     */
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    private _pointLiesBetween;
    /**
     * Calculates all intersections of the given line with this segment.
     * @param _x1
     * @param _y1
     * @param _x2
     * @param _y2
     * @returns Array of intersecting points.
     */
    lineIntersection(_x1: number, _y1: number, _x2: number, _y2: number): Array<PointXY>;
    /**
     * Calculates all intersections of the given box with this segment. By default this method simply calls `lineIntersection` with each of the four
     * faces of the box; subclasses can override this if they think there's a faster way to compute the entire box at once.
     * @param x X position of top left corner of box
     * @param y Y position of top left corner of box
     * @param w width of box
     * @param h height of box
     * @returns Array of intersecting points
     */
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
}
//# sourceMappingURL=straight-segment.d.ts.map
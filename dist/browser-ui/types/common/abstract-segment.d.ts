/**
 * @internal
 */
import { BoundingBox, Extents, PointXY } from "../util/util";
export interface SegmentParams {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
/**
 * @internal
 */
export declare type PointNearPath = {
    s?: Segment;
    d: number;
    x: number;
    y: number;
    l: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
/**
 * Returns an empty bounds object, used in certain initializers internally.
 * @internal
 */
export declare function EMPTY_BOUNDS(): Extents;
/**
 * Definition of a segment. This is an internal class that users of the API need not access.
 * @internal
 */
export interface Segment {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    type: string;
    extents: Extents;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
    getLength(): number;
    pointOnPath(location: number, absolute?: boolean): PointXY;
    gradientAtPoint(location: number, absolute?: boolean): number;
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    getPath(isFirstSegment: boolean): string;
}
/**
 * Base class for segments in connectors.
 *
 * @internal
 */
export declare abstract class AbstractSegment implements Segment {
    protected params: SegmentParams;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    extents: Extents;
    abstract type: string;
    /**
     * Abstract method that subclasses are required to implement. Returns the length of the segment.
     */
    abstract getLength(): number;
    abstract pointOnPath(location: number, absolute?: boolean): PointXY;
    abstract gradientAtPoint(location: number, absolute?: boolean): number;
    abstract pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    abstract getPath(isFirstSegment: boolean): string;
    constructor(params: SegmentParams);
    /**
     * Finds the closest point on this segment to the given x/y, returning both the x and y of the point plus its distance from
     * the supplied point, and its location along the length of the path inscribed by the segment.  This implementation returns
     * Infinity for distance and null values for everything else subclasses are expected to override.
     * @param x - X location to find closest point to
     * @param y - Y location to find closest point to
     * @returns a `PointNearPath` object, which contains the location of the closest point plus other useful information.
     */
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    /**
     * Computes the list of points on the segment that intersect the given line.
     * @param x1 - X location of point 1
     * @param y1 - Y location of point 1
     * @param x2 - X location of point 2
     * @param y2 - Y location of point 2
     * @returns A list of intersecting points
     */
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the box with the given origin and size.
     * @param x - x origin of the box
     * @param y - y origin of the box
     * @param w - width of the box
     * @param h - height of the box
     * @returns A list of intersecting points
     */
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the given bounding box.
     * @param box - Box to test for intersections.
     * @returns A list of intersecting points
     */
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
}
//# sourceMappingURL=abstract-segment.d.ts.map
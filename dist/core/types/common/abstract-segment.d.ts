import { Extents, BoundingBox, PointXY } from "@jsplumb/util";
export interface SegmentParams {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
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
export declare function EMPTY_BOUNDS(): Extents;
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
export declare abstract class AbstractSegment implements Segment {
    protected params: SegmentParams;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    extents: Extents;
    abstract type: string;
    abstract getLength(): number;
    abstract pointOnPath(location: number, absolute?: boolean): PointXY;
    abstract gradientAtPoint(location: number, absolute?: boolean): number;
    abstract pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    abstract getPath(isFirstSegment: boolean): string;
    constructor(params: SegmentParams);
    /**
     * Function: findClosestPointOnPath
     * Finds the closest point on this segment to the given [x, y],
     * returning both the x and y of the point plus its distance from
     * the supplied point, and its location along the length of the
     * path inscribed by the segment.  This implementation returns
     * Infinity for distance and null values for everything else
     * subclasses are expected to override.
     */
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    /**
     * Computes the list of points on the segment that intersect the given line.
     * @method lineIntersection
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {Array<PointXY>}
     */
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the box with the given origin and size.
     * @method boxIntersection
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {Array<PointXY>}
     */
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the given bounding box, which is an object of the form { x:.., y:.., w:.., h:.. }.
     * @method lineIntersection
     * @param {BoundingBox} box
     * @returns {Array<[number, number]>}
     */
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
}

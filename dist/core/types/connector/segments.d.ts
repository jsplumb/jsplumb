import { Segment, PointNearPath } from "@jsplumb/common";
import { BoundingBox, PointXY } from "@jsplumb/util";
export interface SegmentHandler<T extends Segment> {
    getLength(s: T): number;
    getPath(s: T, isFirstSegment: boolean): string;
    gradientAtPoint(s: T, location: number, absolute?: boolean): number;
    pointAlongPathFrom(s: T, location: number, distance: number, absolute?: boolean): PointXY;
    gradientAtPoint(s: T, location: number, absolute?: boolean): number;
    pointOnPath(s: T, location: number, absolute?: boolean): PointXY;
    findClosestPointOnPath(s: T, x: number, y: number): PointNearPath;
    lineIntersection(s: T, x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    boxIntersection(s: T, x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(segment: T, box: BoundingBox): Array<PointXY>;
    create(segmentType: string, params: any): T;
}
export declare const Segments: {
    register: (segmentType: string, segmentHandler: SegmentHandler<any>) => void;
    get: (segmentType: string) => SegmentHandler<any>;
};
//# sourceMappingURL=segments.d.ts.map
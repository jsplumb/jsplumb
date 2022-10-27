import { Segment, SegmentParams } from "@jsplumb/common";
import { Curve } from "./bezier";
export interface CubicBezierSegmentParams extends SegmentParams {
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
}
export interface QuadraticBezierSegmentParams extends SegmentParams {
    cpx: number;
    cpy: number;
}
export declare const SEGMENT_TYPE_CUBIC_BEZIER = "CubicBezier";
export declare const SEGMENT_TYPE_QUADRATIC_BEZIER = "QuadraticBezier";
export interface BezierSegment extends Segment {
    length: number;
    curve: Curve;
}
export interface CubicBezierSegment extends BezierSegment {
    cp1x: number;
    cp1y: number;
    cp2x: number;
    cp2y: number;
}
export interface QuadraticBezierSegment extends BezierSegment {
    cpx: number;
    cpy: number;
}
//# sourceMappingURL=bezier-segment.d.ts.map
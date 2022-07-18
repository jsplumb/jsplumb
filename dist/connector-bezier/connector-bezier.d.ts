/**
 * This package contains the Bezier and StateMachine connectors. Prior to version 5.x these connectors were shipped
 * along with the core.
 *
 * @packageDocumentation
 */

import { AbstractConnector } from '@jsplumb/core';
import { AbstractSegment } from '@jsplumb/common';
import { AnchorPlacement } from '@jsplumb/common';
import { BoundingBox } from '@jsplumb/util';
import { Connection } from '@jsplumb/core';
import { ConnectorComputeParams } from '@jsplumb/core';
import { ConnectorOptions } from '@jsplumb/common';
import { Geometry } from '@jsplumb/common';
import { LineXY } from '@jsplumb/util';
import { PaintGeometry } from '@jsplumb/core';
import { PointNearPath } from '@jsplumb/common';
import { PointXY } from '@jsplumb/util';
import { SegmentParams } from '@jsplumb/common';

/**
 * @internal
 */
export declare abstract class AbstractBezierConnector extends AbstractConnector {
    connection: Connection;
    showLoopback: boolean;
    curviness: number;
    margin: number;
    proximityLimit: number;
    orientation: string;
    loopbackRadius: number;
    clockwise: boolean;
    isLoopbackCurrently: boolean;
    geometry: BezierConnectorGeometry;
    getDefaultStubs(): [number, number];
    constructor(connection: Connection, params: any);
    _compute(paintInfo: PaintGeometry, p: ConnectorComputeParams): void;
    exportGeometry(): BezierConnectorGeometry;
    transformGeometry(g: BezierConnectorGeometry, dx: number, dy: number): BezierConnectorGeometry;
    importGeometry(geometry: BezierConnectorGeometry): boolean;
    abstract _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: PointXY, tp: PointXY, _w: number, _h: number): void;
}

/**
 * Base options interface for StateMachine and Bezier connectors.
 * @public
 */
export declare interface AbstractBezierOptions extends ConnectorOptions {
    /**
     * Whether or not to show connections whose source and target is the same element.
     */
    showLoopback?: boolean;
    /**
     * A measure of how "curvy" the bezier is. In terms of maths what this translates to is how far from the curve the control points are positioned.
     */
    curviness?: number;
    margin?: number;
    proximityLimit?: number;
    orientation?: string;
    loopbackRadius?: number;
}

export declare type AxisCoefficients = [number, number, number, number];

export declare class BezierConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    majorAnchor: number;
    minorAnchor: number;
    constructor(connection: Connection, params: BezierOptions);
    getCurviness(): number;
    protected _findControlPoint(point: PointXY, sourceAnchorPosition: AnchorPlacement, targetAnchorPosition: AnchorPlacement, soo: [number, number], too: [number, number]): PointXY;
    _computeBezier(paintInfo: PaintGeometry, p: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, _w: number, _h: number): void;
}

/**
 * The bezier connector's internal representation of a path.
 */
export declare interface BezierConnectorGeometry extends Geometry {
    controlPoints: [
    PointXY,
    PointXY
    ];
    source: AnchorPlacement;
    target: AnchorPlacement;
}

/**
 * Calculates all intersections of the given line with the given curve.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param curve
 * @returns Array of intersecting points.
 */
export declare function bezierLineIntersection(x1: number, y1: number, x2: number, y2: number, curve: Curve): Array<PointXY>;

/**
 * Options for the Bezier connector.
 */
export declare interface BezierOptions extends AbstractBezierOptions {
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

export declare interface BezierSegmentParams extends SegmentParams {
    cp1x: number;
    cp2x: number;
    cp1y: number;
    cp2y: number;
}

/**
 * Calculates all intersections of the given bounding box with the given curve.
 * @param boundingBox Bounding box to test for intersections.
 * @param curve
 * @returns Array of intersecting points.
 * @public
 */
export declare function boundingBoxIntersection(boundingBox: BoundingBox, curve: Curve): Array<PointXY>;

/**
 * Calculates all intersections of the given box with the given curve.
 * @param x X position of top left corner of box
 * @param y Y position of top left corner of box
 * @param w width of box
 * @param h height of box
 * @param curve
 * @returns Array of intersecting points.
 * @public
 */
export declare function boxIntersection(x: number, y: number, w: number, h: number, curve: Curve): Array<PointXY>;

export declare function computeBezierLength(curve: Curve): number;

export declare type Curve = Array<PointXY>;

export declare function dist(p1: PointXY, p2: PointXY): number;

export declare type DistanceFromCurve = {
    location: number;
    distance: number;
};

/**
 * Calculates the distance that the given point lies from the given Bezier.  Note that it is computed relative to the center of the Bezier,
 * so if you have stroked the curve with a wide pen you may wish to take that into account!  The distance returned is relative to the values
 * of the curve and the point - it will most likely be pixels.
 *
 * @param point - a point in the form {x:567, y:3342}
 * @param curve - a Bezier curve: an Array of PointXY objects. Note that this is currently
 * hardcoded to assume cubix beziers, but would be better off supporting any degree.
 * @returns a JS object literal containing location and distance. Location is analogous to the location
 * argument you pass to the pointOnPath function: it is a ratio of distance travelled along the curve.  Distance is the distance in pixels from
 * the point to the curve.
 * @public
 */
export declare function distanceFromCurve(point: PointXY, curve: Curve): DistanceFromCurve;

/**
 * Calculates the gradient at the point on the given curve at the given location
 * @returns a decimal between 0 and 1 inclusive.
 * @public
 */
export declare function gradientAtPoint(curve: Curve, location: number): number;

/**
 * Returns the gradient of the curve at the point which is 'distance' from the given location.
 * if this point is greater than location 1, the gradient at location 1 is returned.
 * if this point is less than location 0, the gradient at location 0 is returned.
 * @returns a decimal between 0 and 1 inclusive.
 * @public
 */
export declare function gradientAtPointAlongPathFrom(curve: Curve, location: number, distance: number): number;

export declare function isPoint(curve: Curve): boolean;

/**
 * finds the location that is 'distance' along the path from 'location'.
 * @public
 */
export declare function locationAlongCurveFrom(curve: Curve, location: number, distance: number): number;

/**
 * Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
 * point's coordinates and also the 'location' of the point (see above).
 * @public
 */
export declare function nearestPointOnCurve(point: PointXY, curve: Curve): {
    point: PointXY;
    location: number;
};

/**
 * calculates a line that is 'length' pixels long, perpendicular to, and centered on, the path at 'distance' pixels from the given location.
 * if distance is not supplied, the perpendicular for the given location is computed (ie. we set distance to zero).
 * @public
 */
export declare function perpendicularToPathAt(curve: Curve, location: number, length: number, distance: number): LineXY;

/**
 * finds the point that is 'distance' along the path from 'location'.
 * @publix
 */
export declare function pointAlongCurveFrom(curve: Curve, location: number, distance: number): PointXY;

/**
 * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
 * its 'location' (proportion of travel along the path); the method below - _pointAlongPathFrom - calls this method and just returns the
 * point.
 *
 * TODO The compute length functionality was made much faster recently, using a lookup table. is it possible to use that lookup table find
 * a value for the point some distance along the curve from somewhere?
 */
export declare function pointAlongPath(curve: Curve, location: number, distance: number): PointOnPath;

/**
 * calculates a point on the curve, for a Bezier of arbitrary order.
 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}, {x:120,y:100}].  For a cubic bezier this should have four points.
 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
 */
export declare function pointOnCurve(curve: Curve, location: number): PointXY;

export declare type PointOnPath = {
    point: PointXY;
    location: number;
};

export declare class StateMachineConnector extends AbstractBezierConnector {
    connection: Connection;
    static type: string;
    type: string;
    _controlPoint: PointXY;
    constructor(connection: Connection, params: StateMachineOptions);
    _computeBezier(paintInfo: PaintGeometry, params: ConnectorComputeParams, sp: AnchorPlacement, tp: AnchorPlacement, w: number, h: number): void;
}

export declare interface StateMachineOptions extends AbstractBezierOptions {
}

export { }

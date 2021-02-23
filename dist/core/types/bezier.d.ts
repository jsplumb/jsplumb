/**
 * jsBezier
 *
 * Copyright (c) 2010 - 2020 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * licensed under the MIT license.
 *
 * a set of Bezier curve functions that deal with Beziers, used by jsPlumb, and perhaps useful for other people.  These functions work with Bezier
 * curves of arbitrary degree.
 *
 * - functions are all in the 'jsBezier' namespace.
 *
 * - all input points should be in the format {x:.., y:..}. all output points are in this format too.
 *
 * - all input curves should be in the format [ {x:.., y:..}, {x:.., y:..}, {x:.., y:..}, {x:.., y:..} ]
 *
 * - 'location' as used as an input here refers to a decimal in the range 0-1 inclusive, which indicates a point some proportion along the length
 * of the curve.  location as output has the same format and meaning.
 *
 *
 * Function List:
 * --------------
 *
 * distanceFromCurve(point, curve)
 *
 * 	Calculates the distance that the given point lies from the given Bezier.  Note that it is computed relative to the center of the Bezier,
 * so if you have stroked the curve with a wide pen you may wish to take that into account!  The distance returned is relative to the values
 * of the curve and the point - it will most likely be pixels.
 *
 * gradientAtPoint(curve, location)
 *
 * 	Calculates the gradient to the curve at the given location, as a decimal between 0 and 1 inclusive.
 *
 * gradientAtPointAlongCurveFrom (curve, location)
 *
 *	Calculates the gradient at the point on the given curve that is 'distance' units from location.
 *
 * nearestPointOnCurve(point, curve)
 *
 *	Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
 *point's coordinates and also the 'location' of the point (see above), for example:  { point:{x:551,y:150}, location:0.263365 }.
 *
 * pointOnCurve(curve, location)
 *
 * 	Calculates the coordinates of the point on the given Bezier curve at the given location.
 *
 * pointAlongCurveFrom(curve, location, distance)
 *
 * 	Calculates the coordinates of the point on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
 * space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
 *
 * locationAlongCurveFrom(curve, location, distance)
 *
 * 	Calculates the location on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
 * space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
 *
 * perpendicularToCurveAt(curve, location, length, distance)
 *
 * 	Calculates the perpendicular to the given curve at the given location.  length is the length of the line you wish for (it will be centered
 * on the point at 'location'). distance is optional, and allows you to specify a point along the path from the given location as the center of
 * the perpendicular returned.  The return value of this is an array of two points: [ {x:...,y:...}, {x:...,y:...} ].
 *
 *
 */
import { BoundingBox, LineXY, PointXY } from "./common";
export declare type Curve = Array<PointXY>;
export declare type PointOnPath = {
    point: PointXY;
    location: number;
};
export declare type DistanceFromCurve = {
    location: number;
    distance: number;
};
export declare type AxisCoefficients = [number, number, number, number];
/**
 * Calculates the distance that the point lies from the curve.
 *
 * @param point a point in the form {x:567, y:3342}
 * @param curve a Bezier curve in the form [{x:..., y:...}, {x:..., y:...}, {x:..., y:...}, {x:..., y:...}].  note that this is currently
 * hardcoded to assume cubiz beziers, but would be better off supporting any degree.
 * @return a JS object literal containing location and distance, for example: {location:0.35, distance:10}.  Location is analogous to the location
 * argument you pass to the pointOnPath function: it is a ratio of distance travelled along the curve.  Distance is the distance in pixels from
 * the point to the curve.
 */
export declare function distanceFromCurve(point: PointXY, curve: Curve): DistanceFromCurve;
/**
 * finds the nearest point on the curve to the given point.
 */
export declare function nearestPointOnCurve(point: PointXY, curve: Curve): {
    point: PointXY;
    location: number;
};
export declare function computeBezierLength(curve: Curve): number;
/**
 * calculates a point on the curve, for a Bezier of arbitrary order.
 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}, {x:120,y:100}].  For a cubic bezier this should have four points.
 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
 */
export declare function pointOnCurve(curve: Curve, location: number): PointXY;
export declare function dist(p1: PointXY, p2: PointXY): number;
export declare function isPoint(curve: Curve): boolean;
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
 * finds the point that is 'distance' along the path from 'location'.
 */
export declare function pointAlongCurveFrom(curve: Curve, location: number, distance: number): PointXY;
/**
 * finds the location that is 'distance' along the path from 'location'.
 */
export declare function locationAlongCurveFrom(curve: Curve, location: number, distance: number): number;
/**
 * returns the gradient of the curve at the given location, which is a decimal between 0 and 1 inclusive.
 *
 * thanks // http://bimixual.org/AnimationLibrary/beziertangents.html
 */
export declare function gradientAtPoint(curve: Curve, location: number): number;
/**
 returns the gradient of the curve at the point which is 'distance' from the given location.
 if this point is greater than location 1, the gradient at location 1 is returned.
 if this point is less than location 0, the gradient at location 0 is returned.
 */
export declare function gradientAtPointAlongPathFrom(curve: Curve, location: number, distance: number): number;
/**
 * calculates a line that is 'length' pixels long, perpendicular to, and centered on, the path at 'distance' pixels from the given location.
 * if distance is not supplied, the perpendicular for the given location is computed (ie. we set distance to zero).
 */
export declare function perpendicularToPathAt(curve: Curve, location: number, length: number, distance: number): LineXY;
/**
 * Calculates all intersections of the given line with the given curve.
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param curve
 * @returns {Array}
 */
export declare function lineIntersection(x1: number, y1: number, x2: number, y2: number, curve: Curve): Array<PointXY>;
/**
 * Calculates all intersections of the given box with the given curve.
 * @param x X position of top left corner of box
 * @param y Y position of top left corner of box
 * @param w width of box
 * @param h height of box
 * @param curve
 * @returns {Array}
 */
export declare function boxIntersection(x: number, y: number, w: number, h: number, curve: Curve): Array<PointXY>;
/**
 * Calculates all intersections of the given bounding box with the given curve.
 * @param boundingBox Bounding box, in { x:.., y:..., w:..., h:... } format.
 * @param curve
 * @returns {Array}
 */
export declare function boundingBoxIntersection(boundingBox: BoundingBox, curve: Curve): Array<PointXY>;

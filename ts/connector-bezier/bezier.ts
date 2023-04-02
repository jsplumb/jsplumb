/**
 * jsBezier
 *
 * Copyright (c) 2010 - 2023 jsPlumb (hello@jsplumbtoolkit.com)
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

 *
 * gradientAtPoint(curve, location)
 *
 * 	Calculates the gradient to the curve at the given location, as a decimal between 0 and 1 inclusive.
 *
 * gradientAtPointAlongCurveFrom (curve, location)
 *
 *
 *
 * nearestPointOnCurve(point, curve)
 *
 *
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

import {BoundingBox, LineXY, PointXY, sgn} from "../util/util"

export type Curve = Array<PointXY>
export type PointOnPath = { point:PointXY, location:number }
export type DistanceFromCurve = { location:number, distance:number }
export type AxisCoefficients = [ number, number, number, number ]
type CubicRoots = [ number, number, number]

/**
 * @internal
 */
const Vectors = {
    subtract : (v1:PointXY, v2:PointXY):PointXY => { return {x:v1.x - v2.x, y:v1.y - v2.y }; },
    dotProduct: (v1:PointXY, v2:PointXY):number => { return (v1.x * v2.x)  + (v1.y * v2.y); },
    square:(v:PointXY):number => { return Math.sqrt((v.x * v.x) + (v.y * v.y)); },
    scale:(v:PointXY, s:number) => { return {x:v.x * s, y:v.y * s }; }
}

const maxRecursion = 64
const flatnessTolerance = Math.pow(2.0,-maxRecursion-1)

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
export function distanceFromCurve (point:PointXY, curve:Curve):DistanceFromCurve {
    let candidates:Array<any> = [],
        w = _convertToBezier(point, curve),
        degree = curve.length - 1, higherDegree = (2 * degree) - 1,
        numSolutions = _findRoots(w, higherDegree, candidates, 0),
        v = Vectors.subtract(point, curve[0]), dist = Vectors.square(v), t = 0.0,
        newDist

    for (let i = 0; i < numSolutions; i++) {
        v = Vectors.subtract(point, _bezier(curve, degree, candidates[i], null, null))
        newDist = Vectors.square(v)
        if (newDist < dist) {
            dist = newDist
            t = candidates[i]
        }
    }
    v = Vectors.subtract(point, curve[degree])
    newDist = Vectors.square(v)
    if (newDist < dist) {
        dist = newDist
        t = 1.0
    }
    return {location:t, distance:dist}
}

/**
 * Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
 * point's coordinates and also the 'location' of the point (see above).
 * @public
 */
export function nearestPointOnCurve(point:PointXY, curve:Curve):{point:PointXY, location:number} {
    const td = distanceFromCurve(point, curve)
    return {point:_bezier(curve, curve.length - 1, td.location, null, null), location:td.location}
}

/**
 * @internal
 * @param point
 * @param curve
 */
function _convertToBezier (point:PointXY, curve:Curve):any {
    let degree = curve.length - 1, higherDegree = (2 * degree) - 1,
        c = [], d = [], cdTable:Array<Array<any>> = [], w:Array<any> = [],
        z = [ [1.0, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1.0] ]

    for (let i = 0; i <= degree; i++) {
        c[i] = Vectors.subtract(curve[i], point)
    }

    for (let i = 0; i <= degree - 1; i++) {
        d[i] = Vectors.subtract(curve[i+1], curve[i])
        d[i] = Vectors.scale(d[i], 3.0)
    }
    for (let row = 0; row <= degree - 1; row++) {
        for (let column = 0; column <= degree; column++) {
            if (!cdTable[row]) cdTable[row] = []
            cdTable[row][column] = Vectors.dotProduct(d[row], c[column])
        }
    }
    for (let i = 0; i <= higherDegree; i++) {
        if (!w[i]) {
            w[i] = []
        }
        w[i].y = 0.0
        w[i].x = parseFloat("" + i) / higherDegree
    }
    let n = degree, m = degree-1
    for (let k = 0; k <= n + m; k++) {
        const lb = Math.max(0, k - m),
            ub = Math.min(k, n)

        for (let i = lb; i <= ub; i++) {
            const j = k - i
            w[i+j].y += cdTable[j][i] * z[j][i]
        }
    }
    return w
}

/**
 * counts how many roots there are.
 */
function _findRoots (w:any, degree:number, t:any, depth:number):any {
    let left:Array<any> = [],
        right:Array<any> = [],
        left_count, right_count,
        left_t:Array<any> = [],
        right_t:Array<any> = []

    switch (_getCrossingCount(w, degree)) {
        case 0 : {
            return 0
        }
        case 1 : {
            if (depth >= maxRecursion) {
                t[0] = (w[0].x + w[degree].x) / 2.0
                return 1
            }
            if (_isFlatEnough(w, degree)) {
                t[0] = _computeXIntercept(w, degree)
                return 1
            }
            break
        }
    }
    _bezier(w, degree, 0.5, left, right)
    left_count  = _findRoots(left,  degree, left_t, depth+1)
    right_count = _findRoots(right, degree, right_t, depth+1)
    for (let i = 0; i < left_count; i++) {
        t[i] = left_t[i]
    }
    for (let i = 0; i < right_count; i++) {
        t[i+left_count] = right_t[i]
    }
    return (left_count+right_count)
}

function _getCrossingCount (curve:Curve, degree:number):number {
    let n_crossings = 0, sign, old_sign
    sign = old_sign = sgn(curve[0].y)
    for (let i = 1; i <= degree; i++) {
        sign = sgn(curve[i].y)
        if (sign != old_sign) n_crossings++
        old_sign = sign
    }
    return n_crossings
}

function _isFlatEnough (curve:Curve, degree:number):1|0 {
    let error,
        intercept_1, intercept_2, left_intercept, right_intercept,
        a, b, c, det, dInv, a1, b1, c1, a2, b2, c2
    a = curve[0].y - curve[degree].y
    b = curve[degree].x - curve[0].x
    c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y

    let max_distance_above, max_distance_below
    max_distance_above = max_distance_below = 0.0

    for (let i = 1; i < degree; i++) {
        let value = a * curve[i].x + b * curve[i].y + c
        if (value > max_distance_above) {
            max_distance_above = value
        }
        else if (value < max_distance_below) {
            max_distance_below = value
        }
    }

    a1 = 0.0; b1 = 1.0; c1 = 0.0; a2 = a; b2 = b
    c2 = c - max_distance_above
    det = a1 * b2 - a2 * b1
    dInv = 1.0/det
    intercept_1 = (b1 * c2 - b2 * c1) * dInv
    a2 = a; b2 = b; c2 = c - max_distance_below
    det = a1 * b2 - a2 * b1
    dInv = 1.0/det
    intercept_2 = (b1 * c2 - b2 * c1) * dInv
    left_intercept = Math.min(intercept_1, intercept_2)
    right_intercept = Math.max(intercept_1, intercept_2)
    error = right_intercept - left_intercept
    return (error < flatnessTolerance)? 1 : 0
}

function _computeXIntercept (curve:Curve, degree:number):number {
    let XLK = 1.0, YLK = 0.0,
        XNM = curve[degree].x - curve[0].x, YNM = curve[degree].y - curve[0].y,
        XMK = curve[0].x - 0.0, YMK = curve[0].y - 0.0,
        det = XNM*YLK - YNM*XLK, detInv = 1.0/det,
        S = (XNM*YMK - YNM*XMK) * detInv

    return 0.0 + XLK * S
}

function _bezier (curve:Curve, degree:number, t:any, left:any, right:any):any {
    let temp:Array<any> = [[]]
    for (let j =0; j <= degree; j++) {
        temp[0][j] = curve[j]
    }
    for (let i = 1; i <= degree; i++) {
        for (let j =0 ; j <= degree - i; j++) {
            if (!temp[i]) temp[i] = []
            if (!temp[i][j]) temp[i][j] = {}
            temp[i][j].x = (1.0 - t) * temp[i-1][j].x + t * temp[i-1][j+1].x
            temp[i][j].y = (1.0 - t) * temp[i-1][j].y + t * temp[i-1][j+1].y
        }
    }

    if (left != null) {
        for (let j = 0; j <= degree; j++) {
            left[j] = temp[j][0]
        }
    }

    if (right != null) {
        for (let j = 0; j <= degree; j++) {
            right[j] = temp[degree - j][j]
        }
    }

    return (temp[degree][0])
}

function _getLUT(steps:number, curve:Curve): Array<PointXY> {
    const out: Array<PointXY> = []
    steps--
    for (let n = 0; n <= steps; n++) {
        out.push(_computeLookup(n / steps, curve))
    }
    return out
}

function _computeLookup(e:number, curve:Curve):PointXY {

    const EMPTY_POINT:PointXY = {x:0, y:0}

    if (e === 0) {
        return curve[0]
    }

    let degree = curve.length - 1

    if (e === 1) {
        return curve[degree]
    }

    let o = curve
    let s = 1 - e

    if (degree === 0) {
        return curve[0]
    }

    if (degree === 1) {
        return {
            x: s * o[0].x + e * o[1].x,
            y: s * o[0].y + e * o[1].y
        }
    }

    if (4 > degree) {
        let l = s * s, h = e * e, u = 0, m, g, f
        if (degree === 2) {
            o = [o[0], o[1], o[2], EMPTY_POINT]
            m = l
            g = 2 * (s * e)
            f = h
        } else if (degree === 3) {
            m = l * s
            g = 3 * (l * e)
            f = 3 * (s * h)
            u = e * h
        }

        return {
            x: m * o[0].x + g * o[1].x + f * o[2].x + u * o[3].x,
            y: m * o[0].y + g * o[1].y + f * o[2].y + u * o[3].y
        }
    } else {
        return EMPTY_POINT; // not supported.
    }
}

export function computeBezierLength(curve:Curve):number {

    let length = 0

    if (!isPoint(curve)) {
        const steps = 16
        const lut = _getLUT(steps, curve)

        for (let i = 0; i < steps - 1; i++) {
            let a = lut[i], b = lut[i + 1]
            length += dist(a, b)
        }

    }

    return length
}

const _curveFunctionCache:Map<number, Array<TermFunc>> = new Map()
type TermFunc = (t:number) => number

function _getCurveFunctions (order:number):Array<TermFunc> {
    let fns:Array<TermFunc> = _curveFunctionCache.get(order)
    if (!fns) {
        fns = []
        const f_term = ():TermFunc => { return (t:number) => { return Math.pow(t, order); }; },
            l_term = ():TermFunc => { return (t:number) => { return Math.pow((1-t), order); }; },
            c_term = (c:number):TermFunc => { return (t:number) => { return c; }; },
            t_term = ():TermFunc => { return (t:number) => { return t; }; },
            one_minus_t_term = ():TermFunc => { return (t:number) => { return 1-t; }; },
            _termFunc = (terms:any):TermFunc => {
                return (t:number) => {
                    let p = 1
                    for (let i = 0; i < terms.length; i++) {
                        p = p * terms[i](t)
                    }
                    return p
                }
            }

        fns.push(f_term());  // first is t to the power of the curve order
        for (let i = 1; i < order; i++) {
            let terms = [c_term(order)]
            for (let j = 0 ; j < (order - i); j++) terms.push(t_term())
            for (let j = 0 ; j < i; j++) terms.push(one_minus_t_term())
            fns.push(_termFunc(terms))
        }
        fns.push(l_term());  // last is (1-t) to the power of the curve order

        _curveFunctionCache.set(order, fns)
    }

    return fns
}


/**
 * calculates a point on the curve, for a Bezier of arbitrary order.
 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}, {x:120,y:100}].  For a cubic bezier this should have four points.
 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
 */
export function pointOnCurve (curve:Curve, location:number):PointXY {
    let cc = _getCurveFunctions(curve.length - 1),
        _x = 0, _y = 0

    for (let i = 0; i < curve.length ; i++) {
        _x = _x + (curve[i].x * cc[i](location))
        _y = _y + (curve[i].y * cc[i](location))
    }

    return {x:_x, y:_y}
}

export function dist (p1:PointXY,p2:PointXY):number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

export function isPoint (curve:Curve):boolean {
    return curve[0].x === curve[1].x && curve[0].y === curve[1].y
}

/**
 * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
 * its 'location' (proportion of travel along the path); the method below - _pointAlongPathFrom - calls this method and just returns the
 * point.
 *
 * TODO The compute length functionality was made much faster recently, using a lookup table. is it possible to use that lookup table find
 * a value for the point some distance along the curve from somewhere?
 */
export function pointAlongPath (curve:Curve, location:number, distance:number):PointOnPath {

    if (isPoint(curve)) {
        return {
            point:curve[0],
            location:location
        }
    }

    let prev = pointOnCurve(curve, location),
        tally = 0,
        curLoc = location,
        direction = distance > 0 ? 1 : -1,
        cur = null

    while (tally < Math.abs(distance)) {
        curLoc += (0.005 * direction)
        cur = pointOnCurve(curve, curLoc)
        tally += dist(cur, prev)
        prev = cur
    }
    return {point:cur, location:curLoc}
}

/**
 * finds the point that is 'distance' along the path from 'location'.
 * @publix
 */
export function pointAlongCurveFrom (curve:Curve, location:number, distance:number):PointXY {
    return pointAlongPath(curve, location, distance).point
}

/**
 * finds the location that is 'distance' along the path from 'location'.
 * @public
 */
export function locationAlongCurveFrom (curve:Curve, location:number, distance:number):number {
    return pointAlongPath(curve, location, distance).location
}

/**
 * Calculates the gradient at the point on the given curve at the given location
 * @returns a decimal between 0 and 1 inclusive.
 * @public
 */
export function gradientAtPoint (curve:Curve, location:number):number {

    let p1 = pointOnCurve(curve, location),
        p2 = pointOnCurve(curve.slice(0, curve.length - 1), location),
        dy = p2.y - p1.y, dx = p2.x - p1.x

    return dy === 0 ? Infinity : Math.atan(dy / dx)
}

/**
 * Returns the gradient of the curve at the point which is 'distance' from the given location.
 * if this point is greater than location 1, the gradient at location 1 is returned.
 * if this point is less than location 0, the gradient at location 0 is returned.
 * @returns a decimal between 0 and 1 inclusive.
 * @public
 */
export function gradientAtPointAlongPathFrom (curve:Curve, location:number, distance:number):number {

    const p = pointAlongPath(curve, location, distance)
    if (p.location > 1) p.location = 1
    if (p.location < 0) p.location = 0
    return gradientAtPoint(curve, p.location)

}

/**
 * calculates a line that is 'length' pixels long, perpendicular to, and centered on, the path at 'distance' pixels from the given location.
 * if distance is not supplied, the perpendicular for the given location is computed (ie. we set distance to zero).
 * @public
 */
export function perpendicularToPathAt (curve:Curve, location:number, length:number, distance:number):LineXY {
    distance = distance == null ? 0 : distance
    const p = pointAlongPath(curve, location, distance),
        m = gradientAtPoint(curve, p.location),
        _theta2 = Math.atan(-1 / m),
        y =  length / 2 * Math.sin(_theta2),
        x =  length / 2 * Math.cos(_theta2)

    return [{x:p.point.x + x, y:p.point.y + y}, {x:p.point.x - x, y:p.point.y - y}]
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
export function bezierLineIntersection (x1:number, y1:number, x2:number, y2:number, curve:Curve):Array<PointXY> {
    let a = y2 - y1,
        b = x1 - x2,
        c = (x1 * (y1 - y2)) + (y1 * (x2-x1)),
        coeffs = _computeCoefficients(curve),
        p = [
            (a*coeffs[0][0]) + (b * coeffs[1][0]),
            (a*coeffs[0][1])+(b*coeffs[1][1]),
            (a*coeffs[0][2])+(b*coeffs[1][2]),
            (a*coeffs[0][3])+(b*coeffs[1][3]) + c
        ],
        r = _cubicRoots.apply(null, p),
        intersections:Array<PointXY> = []

    if (r != null) {

        for (let i = 0; i < 3; i++) {
            let t = r[i],
                t2 = Math.pow(t, 2),
                t3 = Math.pow(t, 3),
                x:PointXY = {
                    x: (coeffs[0][0] * t3) + (coeffs[0][1] * t2) + (coeffs[0][2] * t) + coeffs[0][3],
                    y: (coeffs[1][0] * t3) + (coeffs[1][1] * t2) + (coeffs[1][2] * t) + coeffs[1][3]
                }

            // check bounds of the line
            let s
            if ((x2 - x1) !== 0) {
                s = (x[0] - x1) / (x2 - x1)
            }
            else {
                s = (x[1] - y1) / (y2 - y1)
            }

            if (t >= 0 && t <= 1.0 && s >= 0 && s <= 1.0) {
                intersections.push(x)
            }
        }
    }

    return intersections
}

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
export function boxIntersection (x:number, y:number, w:number, h:number, curve:Curve):Array<PointXY> {
    let i:Array<PointXY> = []
    i.push.apply(i, bezierLineIntersection(x, y, x + w, y, curve))
    i.push.apply(i, bezierLineIntersection(x + w, y, x + w, y + h, curve))
    i.push.apply(i, bezierLineIntersection(x + w, y + h, x, y + h, curve))
    i.push.apply(i, bezierLineIntersection(x, y + h, x, y, curve))
    return i
}

/**
 * Calculates all intersections of the given bounding box with the given curve.
 * @param boundingBox Bounding box to test for intersections.
 * @param curve
 * @returns Array of intersecting points.
 * @public
 */
export function boundingBoxIntersection (boundingBox:BoundingBox, curve:Curve):Array<PointXY> {
    let i:Array<PointXY> = []
    i.push.apply(i, bezierLineIntersection(boundingBox.x, boundingBox.y, boundingBox.x + boundingBox.w, boundingBox.y, curve))
    i.push.apply(i, bezierLineIntersection(boundingBox.x + boundingBox.w, boundingBox.y, boundingBox.x + boundingBox.w, boundingBox.y + boundingBox.h, curve))
    i.push.apply(i, bezierLineIntersection(boundingBox.x + boundingBox.w, boundingBox.y + boundingBox.h, boundingBox.x, boundingBox.y + boundingBox.h, curve))
    i.push.apply(i, bezierLineIntersection(boundingBox.x, boundingBox.y + boundingBox.h, boundingBox.x, boundingBox.y, curve))
    return i
}

/**
 * @internal
 * @param curve
 * @param axis
 */
function _computeCoefficientsForAxis(curve:Curve, axis:string):AxisCoefficients {
    return [
        -(curve[0][axis]) + (3*curve[1][axis]) + (-3 * curve[2][axis]) + curve[3][axis],
        (3*(curve[0][axis])) - (6*(curve[1][axis])) + (3*(curve[2][axis])),
        -3*curve[0][axis] + 3*curve[1][axis],
        curve[0][axis]
    ]
}

/**
 * @internal
 * @param curve
 */
function _computeCoefficients(curve:Curve):[ AxisCoefficients, AxisCoefficients ]
{
    return [
        _computeCoefficientsForAxis(curve, "x"),
        _computeCoefficientsForAxis(curve, "y")
    ]
}

/**
 * @internal
 * @param a
 * @param b
 * @param c
 * @param d
 */
function _cubicRoots(a:number, b:number, c:number, d:number):CubicRoots{
    let A = b / a,
        B = c / a,
        C = d / a,
        Q = (3*B - Math.pow(A, 2))/9,
        R = (9*A*B - 27*C - 2*Math.pow(A, 3))/54,
        D = Math.pow(Q, 3) + Math.pow(R, 2),
        S,
        T,
        t:CubicRoots = [0,0,0]

    if (D >= 0)                                 // complex or duplicate roots
    {
        S = sgn(R + Math.sqrt(D))*Math.pow(Math.abs(R + Math.sqrt(D)),(1/3))
        T = sgn(R - Math.sqrt(D))*Math.pow(Math.abs(R - Math.sqrt(D)),(1/3))

        t[0] = -A/3 + (S + T)
        t[1] = -A/3 - (S + T)/2
        t[2] = -A/3 - (S + T)/2

        /*discard complex roots*/
        if (Math.abs(Math.sqrt(3)*(S - T)/2) !== 0) {
            t[1] = -1
            t[2] = -1
        }
    }
    else                                          // distinct real roots
    {
        let th = Math.acos(R/Math.sqrt(-Math.pow(Q, 3)))
        t[0] = 2*Math.sqrt(-Q)*Math.cos(th/3) - A/3
        t[1] = 2*Math.sqrt(-Q)*Math.cos((th + 2*Math.PI)/3) - A/3
        t[2] = 2*Math.sqrt(-Q)*Math.cos((th + 4*Math.PI)/3) - A/3
    }

    // discard out of spec roots
    for (let i = 0; i < 3; i++) {
        if (t[i] < 0 || t[i] > 1.0) {
            t[i] = -1
        }
    }

    return t
}

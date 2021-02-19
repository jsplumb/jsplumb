/**
 * Various geometry functions
 *
 * Copyright (c) 2021 jsPlumb Pty Ltd
 * https://jsplumbtoolkit.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
import { LineXY, PointXY, RectangleXY } from "./common";
export declare type Quadrant = 1 | 2 | 3 | 4;
export declare const TWO_PI: number;
export declare function pointXYFromArray(a: Array<number>): PointXY;
/**
 * @name gradient
 * @function
 * @desc Calculates the gradient of a line between the two points.
 * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
 * @return {number} The gradient of a line between the two points.
 */
export declare function gradient(p1: PointXY, p2: PointXY): number;
/**
 * @name normal
 * @function
 * @desc Calculates the gradient of a normal to a line between the two points.
 * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
 * @return {number} The gradient of a normal to a line between the two points.
 */
export declare function normal(p1: PointXY, p2: PointXY): number;
/**
 * @name lineLength
 * @function
 * @desc Calculates the length of a line between the two points.
 * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
 * @return {number} The length of a line between the two points.
 */
export declare function lineLength(p1: PointXY, p2: PointXY): number;
/**
 * @name quadrant
 * @function
 * @desc Calculates the quadrant in which the angle between the two points lies.
 * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
 * @return {Quadrant} The quadrant - 1 for upper right, 2 for lower right, 3 for lower left, 4 for upper left.
 */
export declare function quadrant(p1: PointXY, p2: PointXY): Quadrant;
/**
 * @name theta
 * @function
 * @desc Calculates the angle between the two points.
 * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
 * @return {number} The angle between the two points.
 */
export declare function theta(p1: PointXY, p2: PointXY): number;
/**
 * @name intersects
 * @function
 * @desc Calculates whether or not the two rectangles intersect.
 * @param {RectangleXY} r1 First rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
 * @param {RectangleXY} r2 Second rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
 * @return {boolean} True if the rectangles intersect, false otherwise.
 */
export declare function intersects(r1: RectangleXY, r2: RectangleXY): boolean;
/**
 * @name encloses
 * @function
 * @desc Calculates whether or not r2 is completely enclosed by r1.
 * @param {RectangleXY} r1 First rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
 * @param {RectangleXY} r2 Second rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
 * @param {boolean} [allowSharedEdges=false] If true, the concept of enclosure allows for one or more edges to be shared by the two rectangles.
 * @return {boolean} True if r1 encloses r2, false otherwise.
 */
export declare function encloses(r1: RectangleXY, r2: RectangleXY, allowSharedEdges?: boolean): boolean;
/**
 * @name pointOnLine
 * @function
 * @desc Calculates a point on the line from `fromPoint` to `toPoint` that is `distance` units along the length of the line.
 * @param {PointXY} fromPoint First point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {PointXY} toPoint Second point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {number} distance Distance along the length that the point should be located.
 * @return {PointXY} Point on the line, in the form `{ x:..., y:... }`.
 */
export declare function pointOnLine(fromPoint: PointXY, toPoint: PointXY, distance: number): PointXY;
/**
 * @name perpendicularLineTo
 * @function
 * @desc Calculates a line of length `length` that is perpendicular to the line from `fromPoint` to `toPoint` and passes through `toPoint`.
 * @param {PointXY} fromPoint First point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {PointXY} toPoint Second point, either as a 2 entry array or object with `left` and `top` properties.
 * @param {number} length Length of the line to generate
 * @return {LineXY} Perpendicular line, in the form `[ { x:..., y:... }, { x:..., y:... } ]`.
 */
export declare function perpendicularLineTo(fromPoint: PointXY, toPoint: PointXY, length: number): LineXY;

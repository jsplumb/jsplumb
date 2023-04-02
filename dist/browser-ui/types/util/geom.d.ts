/**
 * Various geometry functions
 *
 * Copyright (c) 2022 jsPlumb Pty Ltd
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
import { Grid, LineXY, PointXY, RectangleXY } from "./util";
/**
 * @public
 */
export declare type Quadrant = 1 | 2 | 3 | 4;
/**
 * Definition of 2 PI
 * @public
 */
export declare const TWO_PI: number;
/**
 * Adds the x and y values of the two points and returns a new point.
 * @param p1
 * @param p2
 * @public
 */
export declare function add(p1: PointXY, p2: PointXY): PointXY;
/**
 * Subtracts p2 from p1, returning a new point.
 * @param p1
 * @param p2
 * @returns a new Point, with p2 subtracted from p1.
 * @public
 */
export declare function subtract(p1: PointXY, p2: PointXY): PointXY;
/**
 * Calculates the gradient of a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The gradient of a line between the two points.
 * @public
 */
export declare function gradient(p1: PointXY, p2: PointXY): number;
/**
 * Calculates the gradient of a normal to a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The gradient of a normal to a line between the two points.
 * @public
 */
export declare function normal(p1: PointXY, p2: PointXY): number;
/**
 * Calculates the length of a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The length of a line between the two points.
 * @public
 */
export declare function lineLength(p1: PointXY, p2: PointXY): number;
/**
 * Calculates the quadrant in which the angle between the two points lies.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The quadrant - 1 for upper right, 2 for lower right, 3 for lower left, 4 for upper left.
 * @public
 */
export declare function quadrant(p1: PointXY, p2: PointXY): Quadrant;
/**
 * Calculates the angle between the two points.
 * @param p1 First point
 * @param p2 Second point
 * @returns The angle between the two points.
 * @public
 */
export declare function theta(p1: PointXY, p2: PointXY): number;
/**
 * Calculates whether or not the two rectangles intersect.
 * @param r1 First rectangle
 * @param r2 Second rectangle
 * @returns True if the rectangles intersect, false otherwise.
 * @public
 */
export declare function intersects(r1: RectangleXY, r2: RectangleXY): boolean;
/**
 * Trim decimal points from a number. Defaults to 3 decimal points.
 * @param n
 * @param digits
 */
export declare function fixPrecision(n: number, digits?: number): number;
/**
 * Compute the intersection of the two lines.
 * @param l1
 * @param l2
 * @returns A point if an intersection found, null otherwise.
 * @public
 */
export declare function lineIntersection(l1: LineXY, l2: LineXY): PointXY | null;
/**
 * Finds all points where the given line intersects the given rectangle.
 * @param line
 * @param r
 * @returns An array of intersection points. If there are no intersection points the array will be empty, but never null.
 * @public
 */
export declare function lineRectangleIntersection(line: LineXY, r: RectangleXY): Array<PointXY>;
/**
 * Calculates whether or not r2 is completely enclosed by r1.
 * @param r1 First rectangle
 * @param r2 Second rectangle
 * @param [allowSharedEdges=false] If true, the concept of enclosure allows for one or more edges to be shared by the two rectangles.
 * @returns True if r1 encloses r2, false otherwise.
 * @public
 */
export declare function encloses(r1: RectangleXY, r2: RectangleXY, allowSharedEdges?: boolean): boolean;
/**
 * Calculates a point on the line from `fromPoint` to `toPoint` that is `distance` units along the length of the line.
 * @param fromPoint First point
 * @param toPoint Second point
 * @param distance Distance along the length that the point should be located.
 * @returns Point on the line, in the form `{ x:..., y:... }`.
 * @public
 */
export declare function pointOnLine(fromPoint: PointXY, toPoint: PointXY, distance: number): PointXY;
/**
 * Calculates a line of length `length` that is perpendicular to the line from `fromPoint` to `toPoint` and passes through `toPoint`.
 * @param fromPoint First point
 * @param toPoint Second point
 * @param length Length of the line to generate
 * @returns Perpendicular line of the required length.
 * @public
 */
export declare function perpendicularLineTo(fromPoint: PointXY, toPoint: PointXY, length: number): LineXY;
/**
 * Snap the given x,y to a point on the grid defined by gridX and gridY, using the given thresholds to calculate proximity to the grid.
 * @param pos Position to transform
 * @param grid Definition of the grid
 * @param thresholdX Defines how close to a grid line in the x axis a value must be in order to be snapped to it.
 * @param thresholdY Defines how close to a grid line in the y axis a value must be in order to be snapped to it.
 * @returns The point to which the position was snapped, given the constraints of the grid.
 * @public
 */
export declare function snapToGrid(pos: PointXY, grid: Grid, thresholdX?: number, thresholdY?: number): PointXY;
//# sourceMappingURL=geom.d.ts.map
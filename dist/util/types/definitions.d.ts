/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 * @internal
 */
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 * @internal
 */
export declare type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
/**
 * Defines a function that can be used to sort an array.
 * @internal
 */
export declare type SortFunction<T> = (a: T, b: T) => number;
/**
 * Defines an x/y location.
 * @public
 */
export interface PointXY {
    x: number;
    y: number;
    theta?: number;
}
/**
 * Extension of PointXY used internally to track extra information about the rotation.
 * @internal
 */
export interface RotatedPointXY extends PointXY {
    cr: number;
    sr: number;
}
/**
 * Defines the bounding box for some element - its x/y location, width and height, and optionally the computed center, but
 * that can of course be calculated from the other values. Internally there are times when the code has this to hand so we include
 * it here.
 * @public
 */
export declare type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    center?: PointXY;
};
/**
 * This is an alias for BoundingBox.
 * @public
 */
export declare type RectangleXY = BoundingBox;
/**
 * Defines a line from some point to another.
 * @public
 */
export declare type LineXY = [PointXY, PointXY];
/**
 * Definition of a grid - the width/height of each cell, and, optionally, a threshold value for each axis to use when
 * trying to snap some coordinate to the grid.
 * @public
 */
export interface Grid extends Size {
    thresholdX?: number;
    thresholdY?: number;
}
/**
 * Defines the width and height of some element.
 * @public
 */
export interface Size {
    width: number;
    height: number;
}
/**
 * Defines the current rotation of some element - its rotation (in degrees) and the center point around which it is rotated.
 * @internal
 */
export interface Rotation {
    r: number;
    c: PointXY;
}
/**
 * A set of compound rotations - used when nesting elements/groups inside other groups.
 * @internal
 */
export declare type Rotations = Array<Rotation>;
/**
 * Definition of the extends of some set of elements: the min/max values in each axis.
 * @internal
 */
export interface Extents {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}
//# sourceMappingURL=definitions.d.ts.map
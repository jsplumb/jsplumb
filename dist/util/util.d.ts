/**
 * This package contains various utility functions used by both the Community and Toolkit editions of jsPlumb.
 *
 * @packageDocumentation
 */

/**
 * Adds the x and y values of the two points and returns a new point.
 * @param p1
 * @param p2
 * @public
 */
export declare function add(p1: PointXY, p2: PointXY): PointXY;

/**
 * Adds an item to a dictionary whose values consists of array of some type. This method is used internally by jsPlumb and is not intended as part of the public API,
 * and will likely be removed at some point in the future when the code that depends upon it has been refactored.
 * @param map
 * @param key
 * @param value
 * @param insertAtStart
 * @internal
 */
export declare function addToDictionary<T>(map: Record<string, Array<T>>, key: string, value: any, insertAtStart?: boolean): Array<any>;

/**
 * Add an item to a list that is stored inside some map. This method is used internally.
 * @param map A map of <string, Array> entries.
 * @param key The ID of the list to search for in the map
 * @param value The value to add to the list, if found
 * @param insertAtStart If true, inserts the new item at the head of the list. Defaults to false.
 * @internal
 */
export declare function addToList<T>(map: Map<string, Array<T>>, key: string, value: any, insertAtStart?: boolean): Array<any>;

/**
 * Adds an item to a list if the given hash function determines that the item is not already in the list
 * @param list List to add to
 * @param item Item to add
 * @param hashFunction Function to use to check the current items of the list; if this function returns true for any current list item, the insertion does not proceed.
 * @internal
 */
export declare function addWithFunction<T>(list: Array<T>, item: T, hashFunction: (_a: T) => boolean): void;

/**
 * Returns whether or not the two arrays are identical, ie. they have the same length and every value is the same
 * @param a
 * @param b
 * @internal
 */
export declare function arraysEqual(a: Array<any>, b: Array<any>): boolean;

/**
 * Defines the bounding box for some element - its x/y location, width and height, and optionally the computed center, but
 * that can of course be calculated from the other values. Internally there are times when the code has this to hand so we include
 * it here.
 * @public
 */
export declare type BoundingBox = {
    x: number;
    y: number;
    w: number;
    h: number;
    center?: PointXY;
};

/**
 * Makes a copy of the given object.
 * @param a
 * @internal
 */
export declare function clone(a: any): any;

/**
 * Defines an object that has a constructor. Used internally to create endpoints/connectors/overlays from their names.
 * Exposed as public for people to create their own endpoints/connectors/overlays.
 * @public
 */
export declare type Constructable<T> = {
    new (...args: any[]): T;
};

/**
 * Iterates through the given `obj` and applies the given function. if `obj` is not ArrayLike then the function is
 * executed directly on `obj`.
 * @param obj
 * @param fn
 * @internal
 */
export declare function each(obj: any, fn: Function): void;

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
 * Base class for classes that wish to support binding and firing of events.
 *
 * @remarks You need to implement the `shouldFireEvent` method in your concrete subclasses of this class, or you can
 * instead extend from `OptimisticEventGenerator`, which has a default implementation of `shouldFireEvent` that returns true.
 *
 * @public
 */
export declare abstract class EventGenerator {
    private _listeners;
    private eventsSuspended;
    private tick;
    private eventsToDieOn;
    private queue;
    protected abstract shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    constructor();
    /**
     * Fire the named event.
     * @param event Event to fire
     * @param value Value to pass to event handlers
     * @param originalEvent Optional original event that caused this event to be fired.
     * @public
     */
    fire<T>(event: string, value?: T, originalEvent?: Event): any;
    /**
     * Drain the queue of pending event notifications
     * @internal
     */
    private _drain;
    /**
     * Unbind the given event listener, or all listeners. If you call this method with no arguments then all event
     * listeners are unbound.
     * @param eventOrListener Either an event name, or an event handler function
     * @param listener If `eventOrListener` is defined, this is the event handler to unbind.
     * @public
     */
    unbind(eventOrListener?: string | Function, listener?: Function): EventGenerator;
    /**
     * Gets all listeners for the given named event.
     * @param forEvent
     * @public
     */
    getListener(forEvent: string): Array<any>;
    /**
     * Returns whether not event firing is currently suspended
     * @public
     */
    isSuspendEvents(): boolean;
    /**
     * Sets whether not event firing is currently suspended
     * @public
     */
    setSuspendEvents(val: boolean): void;
    /**
     * Bind an event listener. This method can be used with a type parameter by call sites; although it's not necessary it can be
     * helpful to use this to ensure you've thought about what the payload to your event handler is going to be.
     * @param event Name of the event(s) to bind to.
     * @param listener Function to bind to the given event(s)
     * @param insertAtStart Whether or not to insert this listener at the head of the listener queue. Defaults to false.
     * @public
     */
    bind<T = any>(event: string | Array<String>, listener: (a: T, e?: any) => any, insertAtStart?: boolean): EventGenerator;
    /**
     * Run the given function without firing any events.
     * @param fn
     * @public
     */
    silently(fn: Function): void;
}

/**
 * Equivalent of Object.assign, which IE11 does not support.
 * @param o1
 * @param o2
 * @param keys Optional list of keys to use to copy values from `o2` to `o1`. If this is not provided, all values are copied.
 * @public
 */
export declare function extend<T>(o1: T, o2: T, keys?: string[]): T;

/**
 * Definition of the extends of some set of elements: the min/max values in each axis.
 * @internal
 */
export declare interface Extents {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}

/**
 * Trims whitespace from the given string.
 * @param s
 * @public
 */
export declare function fastTrim(s: string): string;

/**
 * Internal method used to filter lists, supporting wildcards.
 * @param list
 * @param value
 * @param missingIsFalse
 * @internal
 */
export declare function filterList(list: Array<any> | string, value: any, missingIsFalse?: boolean): boolean;

/**
 * Returns a copy of the given object that has no null values. Note this only operates one level deep.
 * @param obj
 * @internal
 */
export declare function filterNull(obj: Record<string, any>): Record<string, any>;

/**
 * Find all entries in the given array like object for which the given predicate returns true.
 * @param a
 * @param predicate
 * @internal
 */
export declare function findAllWithFunction<T>(a: ArrayLike<T>, predicate: (_a: T) => boolean): Array<number>;

/**
 * Search each entry in the given array for an entry for which the function `f` returns true. This is a stand-in replacement for the
 * `findIndex` method which is available on `Array` in modern browsers, but not IE11.
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The index of the entry for which the predicate returned true, -1 if not found.
 * @internal
 */
export declare function findWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): number;

/**
 * Stand-in for the `forEach` method which is available on modern browsers but not on IE11.
 * @param a
 * @param f
 * @internal
 */
export declare function forEach<T>(a: ArrayLike<T>, f: (_a: T) => any): void;

/**
 * A shim for the `fromArray` method, which is not present in IE11.  This method falls back to `fromArray` if it is present.
 * @param a Array-like object to convert into an Array
 * @returns An Array
 * @internal
 */
export declare function fromArray<T>(a: ArrayLike<T>): Array<T>;

/**
 * Chain a list of functions, supplied by [ object, method name, args ], and return on the first one that returns the failValue.
 * If none return the failValue, return the successValue. This is an internal method.
 * @param successValue
 * @param failValue
 * @param fns
 * @internal
 */
export declare function functionChain(successValue: any, failValue: any, fns: Array<Array<any>>): any;

/**
 * Find all entries in the given array for which the function `f` returns true
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The entries for which the predicate returned true, empty array if not found.
 * @internal
 */
export declare function getAllWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): Array<T>;

/**
 * Extract a value from the set where the given predicate returns true for that value.
 * @param s
 * @param f
 * @internal
 */
export declare function getFromSetWithFunction<T>(s: Set<T>, f: (_a: T) => boolean): T;

/**
 * Get, or insert then get, a value from the map.
 * @param map Map to get the value from.
 * @param key Key of the value to retrieve
 * @param valueGenerator Method used to generate a value for the key if it is not currently in the map.
 * @public
 */
export declare function getsert<K, V>(map: Map<K, V>, key: K, valueGenerator: () => V): V;

/**
 * Find the entry in the given array for which the function `f` returns true. This is a stand-in replacement for the
 * `find` method which is available on `Array` in modern browsers, but not IE11.
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The entry for which the predicate returned true, null if not found.
 * @internal
 */
export declare function getWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): T;

/**
 * Calculates the gradient of a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The gradient of a line between the two points.
 * @public
 */
export declare function gradient(p1: PointXY, p2: PointXY): number;

/**
 * Definition of a grid - the width/height of each cell, and, optionally, a threshold value for each axis to use when
 * trying to snap some coordinate to the grid.
 * @public
 */
export declare interface Grid extends Size {
    thresholdX?: number;
    thresholdY?: number;
}

/**
 * Inserts the given value into the given array at a sorted location.
 * @param value Value to insert
 * @param array Array to insert into
 * @param comparator Function to use when determining sort order.
 * @param sortDescending Defaults to false; if true, the insertion is sorted in reverse order.
 * @public
 */
export declare function insertSorted<T>(value: T, array: Array<T>, comparator: (v1: T, v2: T) => number, sortDescending?: boolean): void;

/**
 * Calculates whether or not the two rectangles intersect.
 * @param r1 First rectangle
 * @param r2 Second rectangle
 * @returns True if the rectangles intersect, false otherwise.
 * @public
 */
export declare function intersects(r1: RectangleXY, r2: RectangleXY): boolean;

/**
 * Returns true if the given `object` can be considered to be an instance of the class `cls`.  This is done by
 * testing the proto chain of the object and checking at each level to see if the proto is an instance of the given class.
 * @param object Object to test
 * @param cls Class to test for.
 * @public
 */
export declare function isAssignableFrom(object: any, cls: any): boolean;

/**
 * Returns whether or not the given value is of `boolean` type.
 * @param s
 * @public
 */
export declare function isBoolean(s: any): boolean;

/**
 * Returns whether or not the given value is of type `Date`
 * @param o
 * @public
 */
export declare function isDate(o: any): o is Date;

/**
 * Returns whether or not the given object - which may be ArrayLike, or an object - is empty.
 * @param o
 * @public
 */
export declare function isEmpty(o: any): boolean;

/**
 * Returns whether or not the given value is of type `Function`
 * @param o
 * @public
 */
export declare function isFunction(o: any): o is Function;

/**
 * Returns whether or not the given value is of type `Function` and is a named Function.
 * @param o
 * @public
 */
export declare function isNamedFunction(o: any): boolean;

/**
 * Returns whether or not the given value is of `number` type.
 * @param n
 * @public
 */
export declare function isNumber(n: any): boolean;

/**
 * Returns whether or not the given value is of type `object`
 * @param o
 * @public
 */
export declare function isObject(o: any): boolean;

/**
 * Returns whether or not the given value is of `string` type.
 * @param s
 * @public
 */
export declare function isString(s: any): boolean;

/**
 * Compute the intersection of the two lines.
 * @param l1
 * @param l2
 * @returns A point if an intersection found, null otherwise.
 * @public
 */
export declare function lineIntersection(l1: LineXY, l2: LineXY): PointXY | null;

/**
 * Calculates the length of a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The length of a line between the two points.
 * @public
 */
export declare function lineLength(p1: PointXY, p2: PointXY): number;

/**
 * Finds all points where the given line intersects the given rectangle.
 * @param line
 * @param r
 * @returns An array of intersection points. If there are no intersection points the array will be empty, but never null.
 * @public
 */
export declare function lineRectangleIntersection(line: LineXY, r: RectangleXY): Array<PointXY>;

/**
 * Defines a line from some point to another.
 * @public
 */
export declare type LineXY = [PointXY, PointXY];

/**
 * Logs a console message.
 * @param args
 * @internal
 */
export declare function log(...args: string[]): void;

/**
 * Determines whether or not logging is currently enabled.
 * @public
 */
export declare const logEnabled: boolean;

/**
 * Maps some ArrayLike object. This is of course a copy of a method that typescript offers. It will likely fall out of use in the jsPlumb codebase.
 * @param obj
 * @param fn
 * @internal
 */
export declare function map(obj: any, fn: Function): any[];

/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 * @internal
 */
export declare type Merge<M, N> = Omit_2<M, Extract<keyof M, keyof N>> & N;

/**
 * Merge the values from `b` into the values from `a`, resulting in `c`.  `b` and `a` are unchanged by this method.
 * Not every datatype can be merged - arrays can, and objects can, but primitives (strings/booleans/numbers/functions)
 * cannot, and are overwritten in `c` by the value from `b`, if present.
 *
 * @remarks
 *
 * Collating Values
 * ----------------
 *
 * You can choose to collate strings, booleans or functions if you wish, by providing their key names in the `collations` array. So if
 * you had, say:
 *
 * a:{
 *     foo:"hello"
 * }
 *
 * b:{
 *     foo:"world"
 * }
 *
 * and you called  `merge(a, b, ["foo"])`, then the output would be
 *
 * {
 *     foo:["hello", "world"]
 * }
 *
 * if the value in `a` is already an Array then the value from `b` is simply appended:
 *
 * a:{
 *     foo:["hello"]
 * }
 *
 * b:{
 *     foo:"world"
 * }
 *
 * here the output would be
 *
 * {
 *     foo:["hello", "world"]
 * }
 *
 *
 * Overwriting values
 * -----------------
 *
 * If you wish to overwrite, rather than merge, specific values, you can provide their keys in the `overwrites` array. Note that it's unnecessary to
 * specify any primitives in the `overwrites` array, as they will always be overwritten and not merged.
 *
 * a:{
 *     foo:["hello", "world"]
 * }
 *
 * b:{
 *     foo:"world"
 * }
 *
 * and you called  `merge(a, b, null, ["foo"])`, then the output would be
 *
 * {
 *     foo:"world"
 * }
 *
 * Note that it is irrelevant, in the case of overwriting, what the type of the parent's value is. It will be overwritten regardless.
 *
 * @param a Parent object
 * @param b Child object
 * @param collations Optional list of parameters to collate, rather than merging or overwriting.
 * @param overwrites Optional list of parameters to overwrite, rather than merging.
 * @internal
 */
export declare function merge(a: Record<string, any>, b: Record<string, any>, collations?: Array<string>, overwrites?: Array<string>): any;

/**
 * Calculates the gradient of a normal to a line between the two points.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The gradient of a normal to a line between the two points.
 * @public
 */
export declare function normal(p1: PointXY, p2: PointXY): number;

/**
 * Returns whether or not the two objects are identical, ie. there are no keys in o1 that do not exist in o2 and vice versa.
 * @param a
 * @param b
 * @internal
 */
export declare function objectsEqual(a: Record<string, any>, b: Record<string, any>): boolean;

/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 * @internal
 */
declare type Omit_2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export { Omit_2 as Omit }

/**
 * Subclass of EventGenerator with a default implementation of `shouldFireEvent`, which returns true always.
 * @public
 */
export declare class OptimisticEventGenerator extends EventGenerator {
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
}

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
 * Calculates a point on the line from `fromPoint` to `toPoint` that is `distance` units along the length of the line.
 * @param fromPoint First point
 * @param toPoint Second point
 * @param distance Distance along the length that the point should be located.
 * @returns Point on the line, in the form `{ x:..., y:... }`.
 * @public
 */
export declare function pointOnLine(fromPoint: PointXY, toPoint: PointXY, distance: number): PointXY;

/**
 * Defines an x/y location.
 * @public
 */
export declare interface PointXY {
    x: number;
    y: number;
    theta?: number;
}

/**
 *
 * Take the given model and expand out any parameters.
 *
 * @param model Object to populate with values.
 * @param values Object containing values to populate
 * @param functionPrefix This is optional, and if present, helps jsplumb figure out what to do if a value is a Function.
 * if you do not provide it (and `doNotExpandFunctions` is null, or false), jsplumb will run the given values through any functions it finds, and use the function's
 * output as the value in the result. if you do provide the prefix, only functions that are named and have this prefix
 * will be executed; other functions will be passed as values to the output.
 * @param doNotExpandFunctions Defaults to false. If true, Functions will be passed directly from `values` to `model` without being executed.
 * @returns
 * @internal
 */
export declare function populate(model: any, values: any, functionPrefix?: string, doNotExpandFunctions?: boolean): any;

/**
 * @public
 */
export declare type Quadrant = 1 | 2 | 3 | 4;

/**
 * Calculates the quadrant in which the angle between the two points lies.
 * @param p1 First point in the line
 * @param p2 Second point in the line
 * @returns The quadrant - 1 for upper right, 2 for lower right, 3 for lower left, 4 for upper left.
 * @public
 */
export declare function quadrant(p1: PointXY, p2: PointXY): Quadrant;

/**
 * This is an alias for BoundingBox.
 * @public
 */
export declare type RectangleXY = BoundingBox;

/**
 * Remove an item from an array
 * @param l Array to remove the item from
 * @param v Item to remove.
 * @returns true if the item was removed, false otherwise.
 * @internal
 */
export declare function remove<T>(l: Array<T>, v: T): boolean;

/**
 * Remove the entry from the array for which the function `f` returns true.
 * @param a
 * @param f
 * @returns true if an element was removed, false if not.
 * @internal
 */
export declare function removeWithFunction<T>(a: Array<T>, f: (_a: T) => boolean): boolean;

/**
 * Replace a value inside some object with another value.
 * @param inObj Object within which to make the replacement.
 * @param path Path to the value to replace. Supports dotted and bracket notation. Eg "foo" means a value with key `foo` in the root. "foo.bar" means a value
 * with key `bar` inside a value with key `foo`. "foo[1]" means the object at index 1 inside a value with key `foo`.
 * @param value Value to replace the original value with.
 * @internal
 */
export declare function replace(inObj: any, path: string, value: any): any;

/**
 * Internal method used to rotate an anchor orientation.
 * @param orientation
 * @param rotation
 * @internal
 */
export declare function rotateAnchorOrientation(orientation: [number, number], rotation: any): [number, number];

/**
 * Extension of PointXY used internally to track extra information about the rotation.
 * @internal
 */
export declare interface RotatedPointXY extends PointXY {
    cr: number;
    sr: number;
}

/**
 * Rotate the given point around the given center, by the given rotation (in degrees)
 * @param point
 * @param center
 * @param rotation
 * @returns An object consisting of the rotated point, followed by cos theta and sin theta.
 */
export declare function rotatePoint(point: PointXY, center: PointXY, rotation: number): RotatedPointXY;

/**
 * Defines the current rotation of some element - its rotation (in degrees) and the center point around which it is rotated.
 * @internal
 */
export declare interface Rotation {
    r: number;
    c: PointXY;
}

/**
 * A set of compound rotations - used when nesting elements/groups inside other groups.
 * @internal
 */
export declare type Rotations = Array<Rotation>;

/**
 * Convert a set into an array. This is not needed for modern browsers but for IE11 compatibility we use this in jsplumb.
 * @param s
 * @internal
 */
export declare function setToArray<T>(s: Set<T>): Array<T>;

/**
 * Replacement for Math.sign, which IE11 does not support.
 * @param x
 */
export declare function sgn(x: number): -1 | 0 | 1;

/**
 * Defines the width and height of some element.
 * @public
 */
export declare interface Size {
    w: number;
    h: number;
}

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

/**
 * Defines a function that can be used to sort an array.
 * @internal
 */
export declare type SortFunction<T> = (a: T, b: T) => number;

/**
 * Subtracts p2 from p1, returning a new point.
 * @param p1
 * @param p2
 * @returns a new Point, with p2 subtracted from p1.
 * @public
 */
export declare function subtract(p1: PointXY, p2: PointXY): PointXY;

/**
 * Add the given item to the given list if it does not exist on the list already.
 * @param list - List to add to
 * @param item - Item to add
 * @param insertAtHead - If true, insert new item at head. Defaults to false.
 * @internal
 */
export declare function suggest(list: Array<any>, item: any, insertAtHead?: boolean): boolean;

/**
 * Calculates the angle between the two points.
 * @param p1 First point
 * @param p2 Second point
 * @returns The angle between the two points.
 * @public
 */
export declare function theta(p1: PointXY, p2: PointXY): number;

/**
 * Definition of 2 PI
 * @public
 */
export declare const TWO_PI: number;

/**
 * Generate a v4 UUID.
 * @returns String representation of a UUID
 * @public
 */
export declare function uuid(): string;

/**
 * Wraps one function with another, creating a placeholder for the
 * wrapped function if it was null. This is used to wrap the various
 * drag/drop event functions - to allow jsPlumb to be notified of
 * important lifecycle events without imposing itself on the user's
 * drag/drop functionality.
 * @param wrappedFunction - original function to wrap; may be null.
 * @param newFunction - function to wrap the original with.
 * @param returnOnThisValue - Optional. Indicates that the wrappedFunction should
 * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
 * note that this is a simple comparison and only works for primitives right now.
 * @internal
 */
export declare function wrap(wrappedFunction: Function, newFunction: Function, returnOnThisValue?: any): () => any;

export { }

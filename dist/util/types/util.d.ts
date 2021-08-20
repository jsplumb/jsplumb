/**
 * Internal method used to filter lists, supporting wildcards.
 * @param list
 * @param value
 * @param missingIsFalse
 */
export declare function filterList(list: Array<any> | string, value: any, missingIsFalse?: boolean): boolean;
/**
 * Equivalent of Object.assign, which IE11 does not support.
 * @param o1
 * @param o2
 * @param keys Optional list of keys to use to copy values from `o2` to `o1`. If this is not provided, all values are copied.
 */
export declare function extend<T>(o1: T, o2: T, keys?: string[]): T;
/**
 * Returns whether or not the given value is of `number` type.
 * @param n
 */
export declare function isNumber(n: any): boolean;
/**
 * Returns whether or not the given value is of `string` type.
 * @param s
 */
export declare function isString(s: any): boolean;
/**
 * Returns whether or not the given value is of `boolean` type.
 * @param s
 */
export declare function isBoolean(s: any): boolean;
/**
 * Returns whether or not the given value is null.
 * @param s
 */
export declare function isNull(s: any): boolean;
/**
 * Returns whether or not the given value is of type `object`
 * @param o
 */
export declare function isObject(o: any): boolean;
/**
 * Returns whether or not the given value is of type `Date`
 * @param o
 */
export declare function isDate(o: any): o is Date;
/**
 * Returns whether or not the given value is of type `Function`
 * @param o
 */
export declare function isFunction(o: any): o is Function;
/**
 * Returns whether or not the given value is of type `Function` and is a named Function.
 * @param o
 */
export declare function isNamedFunction(o: any): boolean;
/**
 * Returns whether or not the given object - which may be ArrayLike, or an object - is empty.
 * @param o
 */
export declare function isEmpty(o: any): boolean;
/**
 * Makes a copy of the given object.
 * @param a
 */
export declare function clone(a: any): any;
/**
 * Returns a copy of the given object that has no null values. Note this only operates one level deep.
 * @param obj
 */
export declare function filterNull(obj: Record<string, any>): Record<string, any>;
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
 */
export declare function merge(a: Record<string, any>, b: Record<string, any>, collations?: Array<string>, overwrites?: Array<string>): any;
/**
 * Replace a value inside some object with another value.
 * @param inObj Object within which to make the replacement.
 * @param path Path to the value to replace. Supports dotted and bracket notation. Eg "foo" means a value with key `foo` in the root. "foo.bar" means a value
 * with key `bar` inside a value with key `foo`. "foo[1]" means the object at index 1 inside a value with key `foo`.
 * @param value Value to replace the original value with.
 */
export declare function replace(inObj: any, path: string, value: any): any;
/**
 * Chain a list of functions, supplied by [ object, method name, args ], and return on the first one that returns the failValue.
 * If none return the failValue, return the successValue. This is an internal method.
 * @param successValue
 * @param failValue
 * @param fns
 * @private
 */
export declare function functionChain(successValue: any, failValue: any, fns: Array<Array<any>>): any;
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
 */
export declare function populate(model: any, values: any, functionPrefix?: string, doNotExpandFunctions?: boolean): any;
/**
 * Stand-in for the `forEach` method which is available on modern browsers but not on IE11.
 * @param a
 * @param f
 */
export declare function forEach<T>(a: ArrayLike<T>, f: (_a: T) => any): void;
/**
 * Search each entry in the given array for an entry for which the function `f` returns true. This is a stand-in replacement for the
 * `findIndex` method which is available on `Array` in modern browsers, but not IE11.
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The index of the entry for which the predicate returned true, -1 if not found.
 */
export declare function findWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): number;
/**
 * Find all entries in the given array like object for which the given predicate returns true.
 * @param a
 * @param predicate
 */
export declare function findAllWithFunction<T>(a: ArrayLike<T>, predicate: (_a: T) => boolean): Array<number>;
/**
 * Find the entry in the given array for which the function `f` returns true. This is a stand-in replacement for the
 * `find` method which is available on `Array` in modern browsers, but not IE11.
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The entry for which the predicate returned true, null if not found.
 */
export declare function getWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): T;
/**
 * Find all entries in the given array for which the function `f` returns true
 * @param a Array to search
 * @param f Predicate to use to test each entry
 * @returns The entries for which the predicate returned true, empty array if not found.
 */
export declare function getAllWithFunction<T>(a: ArrayLike<T>, f: (_a: T) => boolean): Array<T>;
/**
 * Extract a value from the set where the given predicate returns true for that value.
 * @param s
 * @param f
 */
export declare function getFromSetWithFunction<T>(s: Set<T>, f: (_a: T) => boolean): T;
/**
 * Convert a set into an array. This is not needed for modern browsers but for IE11 compatibility we use this in jsplumb.
 * @param s
 */
export declare function setToArray<T>(s: Set<T>): Array<T>;
/**
 * Remove the entry from the array for which the function `f` returns true.
 * @param a
 * @param f
 * @returns true if an element was removed, false if not.
 */
export declare function removeWithFunction<T>(a: Array<T>, f: (_a: T) => boolean): boolean;
/**
 * A shim for the `fromArray` method, which is not present in IE11.  This method falls back to `fromArray` if it is present.
 * @param a Array-like object to convert into an Array
 * @returns An Array
 */
export declare function fromArray<T>(a: ArrayLike<T>): Array<T>;
/**
 * Remove an item from an array
 * @param l Array to remove the item from
 * @param v Item to remove.
 * @returns true if the item was removed, false otherwise.
 */
export declare function remove<T>(l: Array<T>, v: T): boolean;
/**
 * Adds an item to a list if the given hash function determines that the item is not already in the list
 * @param list List to add to
 * @param item Item to add
 * @param hashFunction Function to use to check the current items of the list; if this function returns true for any current list item, the insertion does not proceed.
 */
export declare function addWithFunction<T>(list: Array<T>, item: T, hashFunction: (_a: T) => boolean): void;
/**
 * Adds an item to a dictionary whose values consists of array of some type. This method is used internally by jsPlumb and is not intended as part of the public API,
 * and will likely be removed at some point in the future when the code that depends upon it has been refactored.
 * @param map
 * @param key
 * @param value
 * @param insertAtStart
 */
export declare function addToDictionary<T>(map: Dictionary<Array<T>>, key: string, value: any, insertAtStart?: boolean): Array<any>;
/**
 * Add an item to a list that is stored inside some map. This method is used internally.
 * @param map A map of <string, Array> entries.
 * @param key The ID of the list to search for in the map
 * @param value The value to add to the list, if found
 * @param insertAtStart If true, inserts the new item at the head of the list. Defaults to false.
 */
export declare function addToList<T>(map: Map<string, Array<T>>, key: string, value: any, insertAtStart?: boolean): Array<any>;
/**
 * Add the given item to the given list if it does not exist on the list already.
 * @param list List to add to
 * @param item Item to add
 * @param insertAtHead If true, insert new item at head. Defaults to false.
 */
export declare function suggest(list: Array<any>, item: any, insertAtHead?: boolean): boolean;
/**
 * Generate a v4 UUID.
 * @returns String representation of a UUID
 */
export declare function uuid(): string;
/**
 * Rotate the given point around the given center, by the given rotation (in degrees)
 * @param point
 * @param center
 * @param rotation
 * @returns An object consisting of the rotated point, followed by cos theta and sin theta.
 */
export declare function rotatePoint(point: PointXY, center: PointXY, rotation: number): RotatedPointXY;
/**
 * Extension of PointXY used internally to track extra information about the rotation.
 * @private
 */
export interface RotatedPointXY extends PointXY {
    cr: number;
    sr: number;
}
/**
 * Internal method used to rotate an anchor orientation.
 * @param orientation
 * @param rotation
 * @private
 */
export declare function rotateAnchorOrientation(orientation: [number, number], rotation: any): [number, number];
/**
 * Trims whitespace from the given string.
 * @param s
 */
export declare function fastTrim(s: string): string;
/**
 * Iterates through the given `obj` and applies the given function. if `obj` is not ArrayLike then the function is
 * executed directly on `obj`.
 * @param obj
 * @param fn
 */
export declare function each(obj: any, fn: Function): void;
/**
 * Maps some ArrayLike object. This is of course a copy of a method that typescript offers. It will likely fall out of use in the jsPlumb codebase.
 * @param obj
 * @param fn
 */
export declare function map(obj: any, fn: Function): any[];
/**
 * Determines whether or not logging is currently enabled.
 */
export declare const logEnabled: boolean;
/**
 * Logs a console message.
 * @param args
 */
export declare function log(...args: string[]): void;
/**
 * Wraps one function with another, creating a placeholder for the
 * wrapped function if it was null. This is used to wrap the various
 * drag/drop event functions - to allow jsPlumb to be notified of
 * important lifecycle events without imposing itself on the user's
 * drag/drop functionality.
 * @param wrappedFunction original function to wrap; may be null.
 * @param newFunction function to wrap the original with.
 * @param [returnOnThisValue] Optional. Indicates that the wrappedFunction should
 * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
 * note that this is a simple comparison and only works for primitives right now.
 */
export declare function wrap(wrappedFunction: Function, newFunction: Function, returnOnThisValue?: any): () => any;
/**
 * Sorts an array. Seems quite unnecessary. Only used in one place in the codebase. Marking deprecated.
 * @param _array
 * @param _fn
 */
export declare function sortHelper<T>(_array: Array<T>, _fn: SortFunction<T>): Array<T>;
/**
 * Get, or insert then get, a value from the map.
 * @param map Map to get the value from.
 * @param key Key of the value to retrieve
 * @param valueGenerator Method used to generate a value for the key if it is not currently in the map.
 */
export declare function getsert<K, V>(map: Map<K, V>, key: K, valueGenerator: () => V): V;
/**
 * Returns true if the given `object` can be considered to be an instance of the class `cls`.  This is done by
 * testing the proto chain of the object and checking at each level to see if the proto is an instance of the given class.
 * @param object Object to test
 * @param cls Class to test for.
 */
export declare function isAssignableFrom(object: any, cls: any): boolean;
/**
 * Inserts the given value into the given array at a sorted location.
 * @param value Value to insert
 * @param array Array to insert into
 * @param comparator Function to use when determining sort order.
 * @param sortDescending Defaults to false; if true, the insertion is sorted in reverse order.
 */
export declare function insertSorted<T>(value: T, array: Array<T>, comparator: (v1: T, v2: T) => number, sortDescending?: boolean): void;
/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 */
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/**
 * A copy of a concept from a later version of Typescript than jsPlumb can currently use.
 */
export declare type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
/**
 * Simple definition of a map.  This construct is being replaced across the codebase with `Record<string, T>` and also `Map<..>`
 * @deprecated
 */
export interface Dictionary<T> {
    [Key: string]: T;
}
/**
 * Defines a function that can be used to sort an array.
 */
export declare type SortFunction<T> = (a: T, b: T) => number;
/**
 * Defines an object that has a constructor. Used internally to create endpoints/connectors/overlays from their names.
 */
export declare type Constructable<T> = {
    new (...args: any[]): T;
};
/**
 * Defines an x/y location.
 */
export interface PointXY {
    x: number;
    y: number;
    theta?: number;
}
/**
 * Defines the bounding box for some element - its x/y location, width and height, and optionally the computed center, but
 * that can of course be calculated from the other values. Internally there are times when the code has this to hand so we include
 * it here.
 */
export declare type BoundingBox = {
    x: number;
    y: number;
    w: number;
    h: number;
    center?: PointXY;
};
/**
 * This is an alias for BoundingBox.
 */
export declare type RectangleXY = BoundingBox;
/**
 * Defines a line from some point to another.
 */
export declare type LineXY = [PointXY, PointXY];
/**
 * Definition of a grid - the width/height of each cell, and, optionally, a threshold value for each axis to use when
 * trying to snap some coordinate to the grid.
 */
export interface Grid extends Size {
    thresholdX?: number;
    thresholdY?: number;
}
/**
 * Defines the width and height of some element.
 */
export interface Size {
    w: number;
    h: number;
}
/**
 * Defines the current rotation of some element - its rotation (in degrees) and the center point around which it is rotated.
 */
export interface Rotation {
    r: number;
    c: PointXY;
}
/**
 * A set of compound rotations - used when nesting elements/groups inside other groups.
 */
export declare type Rotations = Array<Rotation>;
/**
 * Definition of the extends of some set of elements: the min/max values in each axis.
 */
export interface Extents {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}
//# sourceMappingURL=util.d.ts.map
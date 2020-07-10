import { SortFunction } from "./core";
export declare function isArray(a: any): boolean;
export declare function isNumber(n: any): boolean;
export declare function isString(s: any): boolean;
export declare function isBoolean(s: any): boolean;
export declare function isNull(s: any): boolean;
export declare function isObject(o: any): boolean;
export declare function isDate(o: any): o is Date;
export declare function isFunction(o: any): o is Function;
export declare function isNamedFunction(o: any): boolean;
export declare function isEmpty(o: any): boolean;
export declare const IS: {
    anObject: (o: any) => boolean;
    aString: (o: any) => boolean;
};
export declare function clone(a: any): any;
export declare function merge(a: any, b: any, collations?: any, overwrites?: any): any;
export declare function replace(inObj: any, path: string, value: any): any;
export declare function functionChain(successValue: any, failValue: any, fns: Array<Array<any>>): any;
/**
 *
 * Take the given model and expand out any parameters. 'functionPrefix' is optional, and if present, helps jsplumb figure out what to do if a value is a Function.
 * if you do not provide it (and doNotExpandFunctions is null, or false), jsplumb will run the given values through any functions it finds, and use the function's
 * output as the value in the result. if you do provide the prefix, only functions that are named and have this prefix
 * will be executed; other functions will be passed as values to the output.
 *
 * @param model
 * @param values
 * @param functionPrefix
 * @param doNotExpandFunctions
 * @returns {any}
 */
export declare function populate(model: any, values: any, functionPrefix?: string, doNotExpandFunctions?: boolean): any;
export declare function findWithFunction<T>(a: Array<T>, f: (_a: T) => boolean): number;
export declare function removeWithFunction<T>(a: Array<T>, f: (_a: T) => boolean): boolean;
export declare function remove<T>(l: Array<T>, v: T): boolean;
export declare function addWithFunction<T>(list: Array<T>, item: T, hashFunction: (_a: T) => boolean): void;
export declare function addToList(map: any, key: string, value: any, insertAtStart?: boolean): Array<any>;
export declare function suggest(list: Array<any>, item: any, insertAtHead?: boolean): boolean;
export declare function uuid(): string;
export declare function fastTrim(s: string): string;
export declare function each(obj: any, fn: Function): void;
export declare function map(obj: any, fn: Function): any[];
export declare function mergeWithParents(type: Array<string> | string, map: any, parentAttribute?: string): any;
export declare const logEnabled: boolean;
export declare function log(...args: string[]): void;
/**
 * Wraps one function with another, creating a placeholder for the
 * wrapped function if it was null. this is used to wrap the various
 * drag/drop event functions - to allow jsPlumb to be notified of
 * important lifecycle events without imposing itself on the user's
 * drag/drop functionality.
 * @method wrap
 * @param {Function} wrappedFunction original function to wrap; may be null.
 * @param {Function} newFunction function to wrap the original with.
 * @param {Object} [returnOnThisValue] Optional. Indicates that the wrappedFunction should
 * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
 * note that this is a simple comparison and only works for primitives right now.
 */
export declare function wrap(wrappedFunction: Function, newFunction: Function, returnOnThisValue?: any): () => any;
export declare function sortHelper<T>(_array: Array<T>, _fn: SortFunction<T>): Array<T>;
export declare function _mergeOverrides(def: any, values: any): any;
export declare type MapFunction<T, Q> = (v: T) => Q;
export interface Optional<T> {
    isDefined: () => boolean;
    ifPresent: (fn: (v: T) => any) => void;
    map: (fn: MapFunction<T, any>) => any;
}
export declare function optional<T>(obj: T): Optional<T>;

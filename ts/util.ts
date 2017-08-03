/**
 jsplumb utils
 */

import { isString, isArray, isBoolean, isDate, isObject, isFunction } from "./util/_is";

//declare const exports:Object;
declare const Arrays:any;

// export function isString(s:any):s is string {
//     return typeof s === "string"
//}



export { isString as isString } from "./util/_is";
export { isBoolean as isBoolean } from "./util/_is";
export { isArray as isArray } from "./util/_is";
export { isDate as isDate } from "./util/_is";
export { isObject as isObject } from "./util/_is";
export { isNumber as isNumber } from "./util/_is";





export function isObjectEmpty(o:any) {
    for (let i in o) {
        if (o.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

export function clone(a:Object) {
    if (isString(a)) {
        return "" + a;
    }
    else if (isBoolean(a)) {
        return !!a;
    }
    else if (isDate(a)) {
        return new Date(a.getTime());
    }
    else if (isFunction(a)) {
        return a;
    }
    else if (isArray(a)) {
        let b = [];
        for (let i = 0; i < a.length; i++) {
            b.push(this.clone(a[i]));
        }
        return b;
    }
    else if (isObject(a)) {
        let c = {};
        for (let j in a) {
            c[j] = this.clone(a[j]);
        }
        return c;
    }
    else {
        return a;
    }
}

export function merge(a:Object, b:Object, collations:Array<string>) {
    // first change the collations array - if present - into a lookup table, because its faster.
    let cMap = {}, ar:any, i:any;
    collations = collations || [];
    for (i = 0; i < collations.length; i++) {
        cMap[collations[i]] = true;
    }

    let c = this.clone(a);
    for (i in b) {
        if (c[i] == null) {
            c[i] = b[i];
        }
        else if (isString(b[i]) || isBoolean(b[i])) {
            if (!cMap[i]) {
                c[i] = b[i]; // if we dont want to collate, just copy it in.
            }
            else {
                ar = [];
                // if c's object is also an array we can keep its values.
                ar.push.apply(ar, isArray(c[i]) ? c[i] : [ c[i] ]);
                ar.push.apply(ar, isArray(b[i]) ? b[i] : [ b[i] ]);
                c[i] = ar;
            }
        }
        else {
            if (isArray(b[i])) {
                ar = [];
                // if c's object is also an array we can keep its values.
                if (isArray(c[i])) {
                    ar.push.apply(ar, c[i]);
                }
                ar.push.apply(ar, b[i]);
                c[i] = ar;
            }
            else if (isObject(b[i])) {
                // overwite c's value with an object if it is not already one.
                if (!isObject(c[i])) {
                    c[i] = {};
                }
                for (let j in b[i]) {
                    c[i][j] = b[i][j];
                }
            }
        }

    }
    return c;
}

export function replace(inObj:Object, path:string, value:any) {
    if (inObj == null) {
        return;
    }
    let q = inObj, t = q;
    path.replace(/([^\.])+/g, (term:string, lc:any, pos:any, str:any):string => {
        let array = term.match(/([^\[0-9]+){1}(\[)([0-9+])/),
            last = pos + term.length >= str.length,
            _getArray = function () {
                return t[array[1]] || (function () {
                        t[array[1]] = [];
                        return t[array[1]];
                    })();
            };

        if (last) {
            // set term = value on current t, creating term as array if necessary.
            if (array) {
                _getArray()[array[3]] = value;
            }
            else {
                t[term] = value;
            }
            return "";
        }
        else {
            // set to current t[term], creating t[term] if necessary.
            if (array) {
                let a = _getArray();
                t = a[array[3]] || (function () {
                        a[array[3]] = {};
                        return a[array[3]];
                    })();
            }
            else {
                t = t[term] || (function () {
                        t[term] = {};
                        return t[term];
                    })();
            }
        }
    });

    return inObj;
}

export function functionChain(successValue:any, failValue:any, fns:Array<Function>) {
    for (let i = 0; i < fns.length; i++) {
        let o = fns[i][0][fns[i][1]].apply(fns[i][0], fns[i][2]);
        if (o === failValue) {
            return o;
        }
    }
    return successValue;
}

export function populate (model:Object, values:Object, functionPrefix?:string) {
    // for a string, see if it has parameter matches, and if so, try to make the substitutions.
    let getValue = function (fromString:string) {
            let matches = fromString.match(/(\${.*?})/g);
            if (matches != null) {
                for (let i = 0; i < matches.length; i++) {
                    let val = values[matches[i].substring(2, matches[i].length - 1)] || "";
                    if (val != null) {
                        fromString = fromString.replace(matches[i], val);
                    }
                }
            }
            return fromString;
        },
        // process one entry.
        _one = function (d:any):any {
            if (d != null) {
                if (isString(d)) {
                    return getValue(d);
                }
                else if (isFunction(d) && (functionPrefix == null || (d.name || "").indexOf(functionPrefix) === 0)) {
                    return d(values);
                }
                else if (isArray(d)) {
                    let r = [];
                    for (let i = 0; i < d.length; i++) {
                        r.push(_one(d[i]));
                    }
                    return r;
                }
                else if (isObject(d)) {
                    let s = {};
                    for (let j in d) {
                        s[j] = _one(d[j]);
                    }
                    return s;
                }
                else {
                    return d;
                }
            }
        };

    return _one(model);
}

export type Selector<T> = T | Array<T>;

export const Constants = {
    parent:"parent"
};

export const Events = {

};

export const Classes = {

};

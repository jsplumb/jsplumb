declare const Array:any;

export function isArray(a:any):a is Array<any> {
    return Array.isArray(a);
}

export function isBoolean(b:any):b is boolean {
    return typeof b === "boolean";
}

export function isString(s:any):s is string {
    return typeof s === "string";
}

export function isObject(o:any):o is object {
    return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
}

export function isNumber(n:any):n is Number {
    return Object.prototype.toString.call(n) === "[object Number]";
}

export function isDate(d:any):d is Date {
    return Object.prototype.toString.call(d) === "[object Date]";
}

export function isFunction(f:any):f is Function {
    return Object.prototype.toString.call(f) === "[object Function]";
}

export function isNamedFunction(f:any):f is Function {
    return isFunction(f) && f.name != null && f.name.length > 0;
}

export function isEmpty(o:any) {
    for (let i in o) {
        if (o.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}
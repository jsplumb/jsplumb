declare const Arrays:any;

export function isArray(a:any):a is Array<any> {
    return Arrays.isArray(a);
}

export default isArray;
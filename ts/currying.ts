/**
 * Created by simon on 19/10/2017.
 */
function setOperation(list:Array<any>, func:string, args:IArguments/*, selector:Function*/) {
    for (let i = 0, j = list.length; i < j; i++) {
        list[i][func].apply(list[i], args);
    }
    //return selector(list);
}

function getOperation(list:Array<any>, func:string, args:IArguments):Array<any> {
    let out = [];
    for (let i = 0, j = list.length; i < j; i++) {
        out.push([ list[i][func].apply(list[i], args), list[i] ]);
    }
    return out;
}

export function setter(list:Array<any>, func:string/*, selector:Function*/):Function{
    return function () {
        return setOperation(list, func, arguments/*, selector*/);
    };
}

export function getter(list:Array<any>, func:string):Function {
    return function () {
        return getOperation(list, func, arguments);
    };
}

export function curryEach(list:Array<any>/*, executor:Function*/):Function {
    return function (f:Function) {
        for (let i = 0, ii = list.length; i < ii; i++) {
            f(list[i]);
        }
        //return executor(list);
    };
}

export function curryGet(list:Array<any>):Function {
    return function (idx:number) {
        return list[idx];
    };
}
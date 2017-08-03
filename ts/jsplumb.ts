import * as jsPlumbUtil from "./util";
import {RawElement} from "./dom/dom-adapter";

export class JsPlumbInstance {

    container:RawElement;

    getContainer():RawElement {
        return this.container;
    }

}

export class jsPlumb {

    static extend(a:any, b:any):any {

    }

    static newInstance(options:any):JsPlumbInstance {
        return new JsPlumbInstance()
    }

    static addClass(el:RawElement, clazz:string) {

    }

    static removeClass(el:RawElement, clazz:string) {

    }
}
import {JsPlumbInstance} from "../core";
declare const document:Document;

export class RawElement extends Element {
    style:any;
    className:any;
    height:number;
    width:number;
    offsetWidth:number;
    offsetHeight:number;
    offsetLeft:number;
    offsetTop:number;
    offsetParent:RawElement;
    currentStyle:Map<string, string>;
    _jsPlumb:JsPlumbInstance<Event, RawElement>;
    _katavorioDrag:any;
    _katavorioDrop:any;
    parentNode:RawElement;
}

export function createElementNS(namespace:string, tag:string, style?:any, clazz?:string, attributes?:any) {
    let e = (namespace == null ? document.createElement(tag) : document.createElementNS(namespace, tag)) as RawElement;
    let i;
    style = style || {};
    for (i in style) {
        e.style[i] = style[i];
    }

    if (clazz) {
        e.className = clazz;
    }

    attributes = attributes || {};
    for (i in attributes) {
        e.setAttribute(i, "" + attributes[i]);
    }

    return e;
}

export function createElement(tag:string, style:any, clazz?:string, atts?:any) {
    return createElementNS(null, tag, style, clazz, atts);
}

export function getClass(el:RawElement) {
    return (typeof el.className.baseVal === "undefined") ? el.className : el.className.baseVal;
}


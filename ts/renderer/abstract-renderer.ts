/*
    Definition of a renderer.
 */

import {RawElement} from "../dom/dom-adapter";
import {JsPlumbInstance} from "../jsplumb";

export class Extents {
    xmin:number;
    xmax:number;
    ymin:number;
    ymax:number;
}

export interface AbstractElement {

}

export interface AbstractRenderer {
    createElement(tag:string, style?:any, clazz?:string, atts?:any):RawElement;
    createElementNS(namespace:string, tag:string, style?:any, clazz?:string, attributes?:any):RawElement;
    getAttribute(el:AbstractElement, attName:string):string;
    setAttribute(el:AbstractElement, name:string, value:string):void;
    setAttributes(el:AbstractElement, atts?:any):void;
    appendToRoot(node:AbstractElement):void;

}

export class jsPlumbUIComponent {

    x:number;
    y:number;
    w:number;
    h:number;

    typeId:string;

    renderer:AbstractRenderer;

    editable:boolean;

    constructor(params:any) {

    }

    setVisible (v:boolean) {
    }

    reattach(instance:JsPlumbInstance) {

    }

    cleanup(force?:boolean) {

    }

    isEditable():boolean {
        return this.editable;
    }

    setEditable(e:boolean) {
        this.editable = e;
    }
}
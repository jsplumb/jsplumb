import {Dictionary, jsPlumbInstance} from "../core";
import {Component} from "../component/component";
import * as Constants from "../constants";
import {createElementNS} from "..";
const svgAttributeMap = {
        "stroke-linejoin": "stroke-linejoin",
        "stroke-dashoffset": "stroke-dashoffset",
        "stroke-linecap": "stroke-linecap"
    };

export const STROKE_DASHARRAY = "stroke-dasharray";
export const DASHSTYLE = "dashstyle";
export const DEFS = "defs";
export const FILL = "fill";
export const STOP = "stop";
export const STROKE = "stroke";
export const STROKE_WIDTH = "stroke-width";
export const STYLE = "style";
export const LINE_WIDTH = "strokeWidth";

export type ElementAttributes = Dictionary<string | number>;

const ns = {
    svg: "http://www.w3.org/2000/svg"
};

export function _attr (node:SVGElement, attributes:ElementAttributes) {
    for (let i in attributes) {
        node.setAttribute(i, "" + attributes[i]);
    }
}

export function _node(instance:jsPlumbInstance, name:string, attributes?:ElementAttributes):SVGElement {
    attributes = attributes || {};
    attributes.version = "1.1";
    attributes.xmlns = ns.svg;
    return (<unknown>createElementNS(ns.svg, name, null, null, attributes)) as SVGElement;
}

export function _pos (d:[number, number]):string {
    return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px";
}

export function _applyStyles(parent:any, node:SVGElement, style:any, dimensions:any, uiComponent:Component) {

    node.setAttribute(FILL, style.fill ? style.fill : Constants.NONE);
    node.setAttribute(STROKE, style.stroke ? style.stroke : Constants.NONE);

    if (style.strokeWidth) {
        node.setAttribute(STROKE_WIDTH, style.strokeWidth);
    }

    // in SVG there is a stroke-dasharray attribute we can set, and its syntax looks like
    // the syntax in VML but is actually kind of nasty: values are given in the pixel
    // coordinate space, whereas in VML they are multiples of the width of the stroked
    // line, which makes a lot more sense.  for that reason, jsPlumb is supporting both
    // the native svg 'stroke-dasharray' attribute, and also the 'dashstyle' concept from
    // VML, which will be the preferred method.  the code below this converts a dashstyle
    // attribute given in terms of stroke width into a pixel representation, by using the
    // stroke's lineWidth.
    if (style[DASHSTYLE] && style[LINE_WIDTH] && !style[STROKE_DASHARRAY]) {
        let sep = style[DASHSTYLE].indexOf(",") === -1 ? " " : ",",
            parts = style[DASHSTYLE].split(sep),
            styleToUse = "";

        parts.forEach((p:any) => {
            styleToUse += (Math.floor(p * style.strokeWidth) + sep);
        });

        node.setAttribute(STROKE_DASHARRAY, styleToUse);
    }
    else if (style[STROKE_DASHARRAY]) {
        node.setAttribute(STROKE_DASHARRAY, style[STROKE_DASHARRAY]);
    }

    // extra attributes such as join type, dash offset.
    for (let i in svgAttributeMap) {
        if (style[i]) {
            node.setAttribute(svgAttributeMap[i], style[i]);
        }
    }
}

export function _appendAtIndex (svg:SVGElement, path:SVGElement, idx:number) {
    if (svg.childNodes.length > idx) {
        svg.insertBefore(path, svg.childNodes[idx]);
    }
    else {
        svg.appendChild(path);
    }
}


import {createElementNS} from './browser-util'
import {forEach} from "../util/util"
import {NONE} from "../core/constants"

const svgAttributeMap = {
        "stroke-linejoin": "stroke-linejoin",
        "stroke-dashoffset": "stroke-dashoffset",
        "stroke-linecap": "stroke-linecap"
    }

export const STROKE_DASHARRAY = "stroke-dasharray"
export const DASHSTYLE = "dashstyle"
export const FILL = "fill"
export const STROKE = "stroke"
export const STROKE_WIDTH = "stroke-width"
export const LINE_WIDTH = "strokeWidth"
export const ELEMENT_SVG = "svg"
export const ELEMENT_PATH = "path"

export type ElementAttributes = Record<string, string | number>

const ns = {
    svg: "http://www.w3.org/2000/svg"
}

export function _attr (node:SVGElement, attributes:ElementAttributes) {
    for (let i in attributes) {
        node.setAttribute(i, "" + attributes[i])
    }
}

export function _node(name:string, attributes?:ElementAttributes):SVGElement {
    attributes = attributes || {}
    attributes.version = "1.1"
    attributes.xmlns = ns.svg
    return (<unknown>createElementNS(ns.svg, name, null, null, attributes)) as SVGElement
}

export function _pos (d:[number, number]):string {
    return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px"
}

export function _applyStyles(parent:any, node:SVGElement, style:any) {

    node.setAttribute(FILL, style.fill ? style.fill : NONE)
    node.setAttribute(STROKE, style.stroke ? style.stroke : NONE)

    if (style.strokeWidth) {
        node.setAttribute(STROKE_WIDTH, style.strokeWidth)
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
            styleToUse = ""

        forEach(parts, (p:any) => {
            styleToUse += (Math.floor(p * style.strokeWidth) + sep)
        })

        node.setAttribute(STROKE_DASHARRAY, styleToUse)
    }
    else if (style[STROKE_DASHARRAY]) {
        node.setAttribute(STROKE_DASHARRAY, style[STROKE_DASHARRAY])
    }

    // extra attributes such as join type, dash offset.
    for (let i in svgAttributeMap) {
        if (style[i]) {
            node.setAttribute(svgAttributeMap[i], style[i])
        }
    }
}

export function _appendAtIndex (svg:SVGElement, path:SVGElement, idx:number) {
    if (svg.childNodes.length > idx) {
        svg.insertBefore(path, svg.childNodes[idx])
    }
    else {
        svg.appendChild(path)
    }
}

export function _size(svg:SVGElement, x:number, y:number, w:number, h:number) {
    svg.style.width = w + "px"
    svg.style.height = h + "px"
    svg.style.left = x + "px"
    svg.style.top = y + "px";
    (svg as any).height = h;
    (svg as any).width = w
}

export const svg = {
    attr:_attr,
    node:_node,
    ns
}

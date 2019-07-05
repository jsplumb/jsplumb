import {Dictionary, jsPlumbInstance} from "../core";
import {Component} from "../component/component";
const svgAttributeMap = {
        "stroke-linejoin": "stroke-linejoin",
        "stroke-dashoffset": "stroke-dashoffset",
        "stroke-linecap": "stroke-linecap"
    }

export const STROKE_DASHARRAY = "stroke-dasharray";
export const DASHSTYLE = "dashstyle";
export const LINEAR_GRADIENT = "linearGradient";
export const RADIAL_GRADIENT = "radialGradient";
export const DEFS = "defs";
export const FILL = "fill";
export const STOP = "stop";
export const STROKE = "stroke";
export const STROKE_WIDTH = "stroke-width";
export const STYLE = "style";
export const NONE = "none";
export const JSPLUMB_GRADIENT = "jsplumb_gradient_";
export const LINE_WIDTH = "strokeWidth";

export type Attributes = Dictionary<string | number>;

const ns = {
    svg: "http://www.w3.org/2000/svg"
};

export function _attr (node:SVGElement, attributes:Attributes) {
    for (let i in attributes) {
        node.setAttribute(i, "" + attributes[i]);
    }
}

export function _node<E>(instance:jsPlumbInstance<E>, name:string, attributes?:Attributes):SVGElement {
    attributes = attributes || {};
    attributes.version = "1.1";
    attributes.xmlns = ns.svg;
    return (<unknown>instance.createElementNS(ns.svg, name, null, null, attributes)) as SVGElement;
}

export function _pos (d:[number, number]):string {
    return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px";
}

export function _clearGradient (parent:any) {
    let els = parent.querySelectorAll(" defs,linearGradient,radialGradient");
    for (let i = 0; i < els.length; i++) {
        els[i].parentNode.removeChild(els[i]);
    }
}

export function _updateGradient<E>(parent:any, node:any, style:any, dimensions:any, uiComponent:Component<E>) {
    let id = JSPLUMB_GRADIENT + (<any>uiComponent).instance._idstamp();
    // first clear out any existing gradient
    _clearGradient(parent);
    // this checks for an 'offset' property in the gradient, and in the absence of it, assumes
    // we want a linear gradient. if it's there, we create a radial gradient.
    // it is possible that a more explicit means of defining the gradient type would be
    // better. relying on 'offset' means that we can never have a radial gradient that uses
    // some default offset, for instance.
    // issue 244 suggested the 'gradientUnits' attribute; without this, straight/flowchart connectors with gradients would
    // not show gradients when the line was perfectly horizontal or vertical.
    let g;
    if (!style.gradient.offset) {
        g = _node((<any>uiComponent).instance, LINEAR_GRADIENT, {id: id, gradientUnits: "userSpaceOnUse"});
    }
    else {
        g = _node((<any>uiComponent).instance, RADIAL_GRADIENT, { id: id });
    }

    let defs = _node((<any>uiComponent).instance, DEFS);
    parent.appendChild(defs);
    defs.appendChild(g);

    // the svg radial gradient seems to treat stops in the reverse
    // order to how canvas does it.  so we want to keep all the maths the same, but
    // iterate the actual style declarations in reverse order, if the x indexes are not in order.
    for (let i = 0; i < style.gradient.stops.length; i++) {
        let styleToUse = uiComponent.segment === 1 || uiComponent.segment === 2 ? i : style.gradient.stops.length - 1 - i,
            stopColor = style.gradient.stops[styleToUse][1],
            s = _node((<any>uiComponent).instance, STOP, {"offset": Math.floor(style.gradient.stops[i][0] * 100) + "%", "stop-color": stopColor});

        g.appendChild(s);
    }
    let applyGradientTo = style.stroke ? STROKE : FILL;
    node.setAttribute(applyGradientTo, "url(#" + id + ")");
}

export function _applyStyles<E>(parent:any, node:SVGElement, style:any, dimensions:any, uiComponent:Component<E>) {

    node.setAttribute(FILL, style.fill ? style.fill : NONE);
    node.setAttribute(STROKE, style.stroke ? style.stroke : NONE);

    if (style.gradient) {
        _updateGradient(parent, node, style, dimensions, uiComponent);
    }
    else {
        // make sure we clear any existing gradient
        _clearGradient(parent);
        node.setAttribute(STYLE, "");
    }

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

import {Connection} from "../connector/connection-impl"
import {Endpoint} from "../endpoint/endpoint"
import {Dictionary, PointXY, Rotations, Size} from "../common"
import { JsPlumbInstance } from "../core"

import {Anchor} from "../anchor/anchor"
import {DynamicAnchor} from "../anchor/dynamic-anchor"
import {extend, isArray, isNumber, isString} from "../util"
import {ContinuousAnchor, ContinuousAnchorOptions} from "../anchor/continuous-anchor"
import {AnchorPlacement} from "../router/router"

export type AnchorOrientationHint = -1 | 0 | 1
export type Orientation = [  number, number ]

export type Face = "top" | "right" | "bottom" | "left"
export type Axis = [ Face, Face ]

export const X_AXIS_FACES:Axis = ["left", "right"]
export const Y_AXIS_FACES:Axis = ["top", "bottom"]

export type AnchorComputeParams = {
    xy?: PointXY
    wh?: Size
    txy?:PointXY
    twh?:Size
    element?:Endpoint
    timestamp?: string
    index?:number
    tElement?:Endpoint
    connection?:Connection
    elementId?:string
    rotation?:Rotations
    tRotation?:Rotations
}

export interface AnchorOptions extends Record<string, any> {
    cssClass?:string
}

export enum AnchorLocations {
    Assign = "Assign",
    AutoDefault = "AutoDefault",
    Bottom = "Bottom",
    BottomLeft = "BottomLeft",
    BottomRight = "BottomRight",
    Center = "Center",
    Continuous = "Continuous",
    ContinuousBottom = "ContinuousBottom",
    ContinuousLeft = "ContinuousLeft",
    ContinuousRight = "ContinuousRight",
    ContinuousTop = "ContinuousTop",
    ContinuousLeftRight = "ContinuousLeftRight",
    ContinuousTopBottom = "ContinuousTopBottom",
    Left = "Left",
    Perimeter = "Perimeter",
    Right = "Right",
    Top = "Top",
    TopLeft = "TopLeft",
    TopRight = "TopRight"
}

export type AnchorId = keyof typeof AnchorLocations

export type FullAnchorSpec = {type:AnchorId, options:AnchorOptions}
export type SingleAnchorSpec = AnchorId | FullAnchorSpec | AnchorPlacement | Array<AnchorPlacement>
export type AnchorSpec = SingleAnchorSpec | Array<SingleAnchorSpec>

const anchorMap:Dictionary<(instance:JsPlumbInstance, args:any) => Anchor> = {}

export const Anchors = {

    get:(instance:JsPlumbInstance, name:string, args:any):Anchor => {

        let con = anchorMap[name]
        if (!con) {
            throw {message:"jsPlumb: unknown anchor type '" + name + "'"}
        } else {
            return con(instance, args || {}) as Anchor
        }
    }
}

function _makeAnchor(instance:JsPlumbInstance, x:number, y:number, ox:AnchorOrientationHint, oy:AnchorOrientationHint, offsetX:number, offsetY:number, elementId?:string):Anchor {
    let a = new Anchor(instance)
    a.x = x
    a.y = y
    a.setInitialOrientation(ox, oy)
    a.offsets = [ offsetX, offsetY ]
    if (elementId != null) {
        a.elementId = elementId
    }
    return a
}

function getNamedAnchor(instance:JsPlumbInstance, name:string, args?:any, elementId?:string):Anchor {
    let a = Anchors.get(instance, name, args)
    a.elementId = elementId
    return a
}

function getAnchorWithValues(instance:JsPlumbInstance,
                                x:number, y:number,
                                orientation:Orientation,
                                offsets:[number, number],
                                elementId?:string,
                                cssClass?:string):Anchor {
    let a = new Anchor(instance)
    a.x = x
    a.y = y
    a.setInitialOrientation(orientation[0], orientation[1])
    a.offsets = offsets
    a.elementId = elementId
    a.cssClass = cssClass || ""
    return a
}

function isPrimitiveAnchorSpec(sa:Array<any>):boolean {
    return sa.length < 7 && sa.every(isNumber) ||
           sa.length === 7 && sa.slice(0, 5).every(isNumber) && isString(sa[6])
}

export function makeAnchorFromSpec(instance:JsPlumbInstance, spec:AnchorSpec|Array<AnchorSpec>, elementId?:string):Anchor {

    // if a string, its just a named anchor
    if (isString(spec)){
        return getNamedAnchor(instance, spec as string, null, elementId)

    }
    else if (isArray(spec)) {

        // if its an array then it can be either:
        // - a DynamicAnchor, which is a series of Anchor specs
        // - a set of values for a low level Anchor create

        // if all values are numbers (or all numbers and an optional css class as the 7th arg) its a low level create
        if(isPrimitiveAnchorSpec(spec as Array<AnchorSpec>)) {
            return getAnchorWithValues(instance,
                spec[0],
                spec[1],
                [ spec[2] as AnchorOrientationHint, spec[3] as AnchorOrientationHint ],
                [ spec[4] || 0, spec[5] || 0],
                elementId,
                spec[6]
            )
        }
        else {
            // otherwise it's a list of specs, for plugging in to a DynamicAnchor.
            // TODO fold DynamicAnchor and Anchor into a separate concept: any given anchor should support multiple locations.
            return new DynamicAnchor(instance, {anchors:spec as Array<AnchorSpec>, elementId:elementId})
        }
    }
    else {
        // if not an array or string, then it's a named Anchor with constructor args
        const sa = spec as FullAnchorSpec
        return getNamedAnchor(instance, sa.type, sa.options, elementId)
    }
}

function _curryAnchor (x:number, y:number, ox:AnchorOrientationHint, oy:AnchorOrientationHint, type:AnchorId, fnInit?:Function) {
    anchorMap[type] = function(instance:JsPlumbInstance, params:any):Anchor {
        let a = _makeAnchor(instance, x, y, ox, oy, 0, 0)
        a.type = type
        if (fnInit) {
            fnInit(a, params)
        }
        return a
    }
}

_curryAnchor(0.5, 0, 0, -1, AnchorLocations.Top)
_curryAnchor(0.5, 1, 0, 1, AnchorLocations.Bottom)
_curryAnchor(0, 0.5, -1, 0, AnchorLocations.Left)
_curryAnchor(1, 0.5, 1, 0, AnchorLocations.Right)

_curryAnchor(0.5, 0.5, 0, 0, AnchorLocations.Center)
_curryAnchor(1, 0, 0, -1, AnchorLocations.TopRight)
_curryAnchor(1, 1, 0, 1, AnchorLocations.BottomRight)
_curryAnchor(0, 0, 0, -1, AnchorLocations.TopLeft)
_curryAnchor(0, 1, 0, 1, AnchorLocations.BottomLeft)


// ------------- DYNAMIC ANCHOR DEFAULT ---------------------------

const DEFAULT_DYNAMIC_ANCHORS = [ AnchorLocations.Top, AnchorLocations.Right, AnchorLocations.Bottom, AnchorLocations.Left ]
anchorMap[AnchorLocations.AutoDefault] = function(instance:JsPlumbInstance, params:any):Anchor {
    let a = new DynamicAnchor(instance, {anchors:DEFAULT_DYNAMIC_ANCHORS.map((da:string) => getNamedAnchor(instance, da, params))})
    a.type = AnchorLocations.AutoDefault
    return a
}

// --------------------------- perimeter -----------------------

function _circle (anchorCount:number) {
    let r = 0.5, step = Math.PI * 2 / anchorCount, current = 0, a = []
    for (let i = 0; i < anchorCount; i++) {
        let x = r + (r * Math.sin(current)),
            y = r + (r * Math.cos(current))
        a.push([ x, y, 0, 0 ])
        current += step
    }
    return a
}

function _path (anchorCount:number, segments:Array<any>):Array<any> {
    let anchorsPerFace = anchorCount / segments.length, a:Array<any> = [],
    _computeFace = (x1:number, y1:number, x2:number, y2:number, fractionalLength:number, ox?:number, oy?:number) => {
        anchorsPerFace = anchorCount * fractionalLength
        let dx = (x2 - x1) / anchorsPerFace, dy = (y2 - y1) / anchorsPerFace
        for (let i = 0; i < anchorsPerFace; i++) {
            a.push([
                x1 + (dx * i),
                y1 + (dy * i),
                ox == null ? 0 : ox,
                oy == null ? 0 : oy
            ])
        }
    }

    for (let i = 0; i < segments.length; i++) {
        _computeFace.apply(null, segments[i])
    }

    return a
}

function _shape (anchorCount:number, faces:Array<any>):Array<any> {
    let s = []
    for (let i = 0; i < faces.length; i++) {
        s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length, faces[i][4], faces[i][5]])
    }
    return _path(anchorCount, s)
}

function _rectangle (anchorCount:number):Array<any> {
    return _shape(anchorCount, [
        [ 0, 0, 1, 0, 0, -1 ],
        [ 1, 0, 1, 1, 1, 0 ],
        [ 1, 1, 0, 1, 0, 1 ],
        [ 0, 1, 0, 0, -1, 0 ]
    ])
}

function _rotate (points:Array<any>, amountInDegrees:number):Array<any> {
    let o = [], theta = amountInDegrees / 180 * Math.PI
    for (let i = 0; i < points.length; i++) {
        let _x = points[i][0] - 0.5,
            _y = points[i][1] - 0.5

        o.push([
            0.5 + ((_x * Math.cos(theta)) - (_y * Math.sin(theta))),
            0.5 + ((_x * Math.sin(theta)) + (_y * Math.cos(theta))),
            points[i][2],
            points[i][3]
        ])
    }
    return o
}

export type ShapeFunction = (anchorCount:number, p?:any) => Array<any>

const _shapes:Dictionary<ShapeFunction> = {
    "Circle": _circle,
    "Ellipse": _circle,
    "Diamond": (anchorCount:number) => {
        return _shape(anchorCount, [
            [ 0.5, 0, 1, 0.5 ],
            [ 1, 0.5, 0.5, 1 ],
            [ 0.5, 1, 0, 0.5 ],
            [ 0, 0.5, 0.5, 0 ]
        ])
    },
    "Rectangle": _rectangle,
    "Square": _rectangle,
    "Triangle":  (anchorCount:number) => {
        return _shape(anchorCount,[
            [ 0.5, 0, 1, 1 ],
            [ 1, 1, 0, 1 ],
            [ 0, 1, 0.5, 0]
        ])
    },
    "Path": (anchorCount:number, params:any) => {
        let points:Array<any> = params.points, p = [], tl = 0
        for (let i = 0; i < points.length - 1; i++) {
            let l = Math.sqrt(Math.pow(points[i][2] - points[i][0], 2) + Math.pow(points[i][3] - points[i][1], 2))
            tl += l
            p.push([points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], l])
        }
        for (let j = 0; j < p.length; j++) {
            p[j][4] = p[j][4] / tl
        }
        return _path(anchorCount, p)
    }
}

/**
 * Constructor options for a Perimeter Anchor.
 */
export interface PerimeterAnchorOptions extends AnchorOptions {
    shape:string
    rotation?:number
    anchorCount?:number
}

anchorMap[AnchorLocations.Perimeter] = function(instance:JsPlumbInstance, params:PerimeterAnchorOptions):Anchor {
    let anchorCount = params.anchorCount || 60

    if (!params.shape) {
        throw new Error("no shape supplied to Perimeter Anchor type")
    }

    if (!_shapes[params.shape]) {
        throw new Error("Shape [" + params.shape + "] is unknown by Perimeter Anchor type")
    }

    let da = _shapes[params.shape](anchorCount, params)
    if (params.rotation) {
        da = _rotate(da, params.rotation)
    }
    return new DynamicAnchor(instance, {anchors:da})
}

// ------------------------- CONTINUOUS ANCHOR -------------------

function _curryContinuousAnchor (type:AnchorId, faces?:Array<Face>) {
    anchorMap[type] = function(instance:JsPlumbInstance, params:any):Anchor {
        let o:ContinuousAnchorOptions = {}
        extend(o, params || {})
        if (faces) {
            o.faces = faces;
        }
        let a = new ContinuousAnchor(instance, o)
        a.type = type
        return a
    }
}

_curryContinuousAnchor(AnchorLocations.Continuous)
_curryContinuousAnchor(AnchorLocations.ContinuousLeft, ["left"])
_curryContinuousAnchor(AnchorLocations.ContinuousTop, ["top"])
_curryContinuousAnchor(AnchorLocations.ContinuousBottom, ["bottom"])
_curryContinuousAnchor(AnchorLocations.ContinuousRight, ["right"])
_curryContinuousAnchor(AnchorLocations.ContinuousLeft, ["left"])
_curryContinuousAnchor(AnchorLocations.ContinuousTop, ["top"])
_curryContinuousAnchor(AnchorLocations.ContinuousBottom, ["bottom"])
_curryContinuousAnchor(AnchorLocations.ContinuousLeftRight, ["left", "right"])
_curryContinuousAnchor(AnchorLocations.ContinuousTopBottom, ["top", "bottom"])


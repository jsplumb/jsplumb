import {AnchorOrientationHint, AnchorSpec, Axis, Face, FullAnchorSpec} from "./anchor-factory"
import {extend, isArray, isNumber, isString, uuid, map} from "../util"
import {Size} from "../common"

export interface AnchorRecord {
    x:number
    y:number
    ox:AnchorOrientationHint
    oy:AnchorOrientationHint
    offx:number
    offy:number
    iox:AnchorOrientationHint
    ioy:AnchorOrientationHint
    cls:string
}

export interface LightweightAnchor {
    locations:Array<AnchorRecord>
    currentLocation:number
    locked:boolean
    id:string
    cssClass:string
    isContinuous:boolean
    isFloating:boolean
    isDynamic:boolean
    timestamp:string
    type:string
}

export interface LightweightContinuousAnchor extends LightweightAnchor {
    faces:Array<Face>
    lockedFace:Face
    isContinuous:true
    isDynamic:false
    currentFace:Face
    lockedAxis:Axis
    clockwise:boolean
}

export interface LightweightFloatingAnchor extends LightweightAnchor {
    isFloating:true
    size:Size
}

export const TOP = "top"
export const BOTTOM = "bottom"
export const LEFT = "left"
export const RIGHT = "right"

const namedValues = {
    "Top":{x:0.5, y:0, ox:0, oy:-1, offs:0, offy:0 },
    "Bottom":{x:0.5, y:1, ox:0, oy:1, offs:0, offy:0 },
    "Left":{x:0, y:0.5, ox:-1, oy:0, offs:0, offy:0 },
    "Right":{x:1, y:0.5, ox:1, oy:0, offs:0, offy:0 },
    "TopLeft":{x:0, y:0, ox:0, oy:-1, offs:0, offy:0 },
    "TopRight":{x:1, y:0, ox:1, oy:-1, offs:0, offy:0 },
    "BottomLeft":{x:0, y:1, ox:0, oy:1, offs:0, offy:0 },
    "BottomRight":{x:1, y:1, ox:0, oy:1, offs:0, offy:0 },
    "Center":{x:0.5, y:0.5, ox:0, oy:0, offs:0, offy:0 },
}

const namedContinuousValues = {
    "Continuous":{faces:[TOP, LEFT, BOTTOM, RIGHT]},
    "ContinuousTop":{faces:[TOP]},
    "ContinuousRight":{faces:[RIGHT]},
    "ContinuousBottom":{faces:[BOTTOM]},
    "ContinuousLeft":{faces:[LEFT]},
    "ContinuousLeftRight":{faces:[LEFT, RIGHT]},
    "ContinuousTopBottom":{faces:[TOP, BOTTOM]}

}

function getNamedAnchor(name:string, params?:Record<string, any>):LightweightAnchor {
    params = params || {}
    let a = namedValues[name]
    if (a != null) {
        return _createAnchor(name, [ extend({iox:0, ioy:0}, a)], params)
    }

    a = namedContinuousValues[name]
    if (a != null) {
        return _createContinuousAnchor(name, a.faces, params)
    }
}

function _createAnchor(type:string, locations:Array<AnchorRecord>, params:Record<string, any>):LightweightAnchor {
    return {
        type:type,
        locations:locations,
        currentLocation:0,
        locked:false,
        id:uuid(),
        isFloating:false,
        isContinuous:false,
        isDynamic:locations.length > 1,
        timestamp:null,
        cssClass:params.cssClass || ""
    }
}

// function _createFloatingAnchor(type:string, locations:Array<AnchorRecord>, params:Record<string, any>, size:PointXY):LightweightFloatingAnchor {
//     const a = _createAnchor(type, locations, params) as LightweightFloatingAnchor
//     a.isFloating = true;
//     a.size = { x:size.x, y:size.y}
//     return a
// }

function _createFloatingAnchor(a:LightweightAnchor, size:Size):LightweightFloatingAnchor {
    const _a = a as LightweightFloatingAnchor
    _a.isFloating = true;
    _a.size = { w:size.w, h:size.h}
    return _a
}

function _createContinuousAnchor(type:string, faces:Array<Face>, params:Record<string, any>):LightweightContinuousAnchor {
    return {
        type:type,
        locations:[],
        currentLocation:0,
        locked:false,
        id:uuid(),
        cssClass:params.cssClass || "",
        isFloating:false,
        isContinuous:true,
        isDynamic:false,
        timestamp:null,
        faces,
        lockedFace:null,
        currentFace:null,
        lockedAxis:null,
        clockwise:!(params.clockwise === false)
    }
}

function isPrimitiveAnchorSpec(sa:Array<any>):boolean {
    return sa.length < 7 && sa.every(isNumber) ||
        sa.length === 7 && sa.slice(0, 5).every(isNumber) && isString(sa[6])
}

export function makeLightweightAnchorFromSpec(spec:AnchorSpec|Array<AnchorSpec>):LightweightAnchor {

    // if a string, its just a named anchor
    if (isString(spec)){
        return getNamedAnchor(spec as string, null)

    }
    else if (isArray(spec)) {

        // // if its an array then it can be either:
        // // - a DynamicAnchor, which is a series of Anchor specs
        // // - a set of values for a low level Anchor create
        //
        // // if all values are numbers (or all numbers and an optional css class as the 7th arg) its a low level create
        if(isPrimitiveAnchorSpec(spec as Array<AnchorSpec>)) {
            return _createAnchor(null, [{
                x:spec[0],
                y:spec[1],
                ox:spec[2] as AnchorOrientationHint,
                oy:spec[3] as AnchorOrientationHint,
                offx:spec[4] == null ? 0 : spec[4],
                offy:spec[5] == null ? 0 : spec[5],
                iox:spec[2] as AnchorOrientationHint,
                ioy:spec[3] as AnchorOrientationHint,
                cls:spec[6] || ""
            }], {cssClass:spec[6] || ""})
        }
        else {
            const locations:Array<AnchorRecord> = map(spec as Array<AnchorSpec>, (aSpec:AnchorSpec) => {
                if (isString(aSpec)) {
                    let a = namedValues[aSpec as string]
                    return a != null ? extend({iox:0, ioy:0}, a) : null
                } else if (isPrimitiveAnchorSpec(aSpec as Array<any>)) {
                    return {
                        x:aSpec[0],
                        y:aSpec[1],
                        ox:aSpec[2],
                        oy:aSpec[3],
                        offx:aSpec[4] == null ? 0 : aSpec[4],
                        offy:aSpec[5] == null ? 0 : aSpec[5],
                        iox:aSpec[2],
                        ioy:aSpec[3],
                        cls:aSpec[6] || ""
                    }
                }
            }).filter(ar => ar != null)

            return _createAnchor("Dynamic", locations, {})
        }
    }
    else {
        // // if not an array or string, then it's a named Anchor with constructor args
        const sa = spec as FullAnchorSpec
        return getNamedAnchor(sa.type, sa.options)
    }
}



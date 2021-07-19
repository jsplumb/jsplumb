import {Dictionary, PointXY, Rotations, Size, extend, isArray, isNumber, isString, uuid, map} from "@jsplumb/util"
import { Connection } from "../connector/connection-impl"
import { Endpoint } from "../endpoint/endpoint"
import { JsPlumbInstance } from "../core"
import {AnchorSpec, FullAnchorSpec} from "@jsplumb/common"

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

export interface ComputedPosition {curX:number,curY:number,ox:number,oy:number,x:number,y:number}

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
    computedPosition?:ComputedPosition
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

export class LightweightFloatingAnchor implements LightweightAnchor {

    isFloating = true
    isContinuous:false
    isDynamic:false

    locations = [ {x:0, y:0, ox:0, oy:0, offx:0, offy:0, iox:0, ioy:0, cls:''} as any]
    currentLocation = 0
    locked = false
    cssClass = ''
    timestamp:string = null

    type = "Floating"

    id = uuid()

    orientation:Orientation = [0,0]

    size:Size

    constructor(public instance:JsPlumbInstance, public element:any) {
        this.size = instance.getSize(element)
    }

    /**
     * notification the endpoint associated with this anchor is hovering
     * over another anchor; we want to assume that anchor's orientation
     * for the duration of the hover.
     */
    over (endpoint:Endpoint) {
        this.orientation = this.instance.router.getEndpointOrientation(endpoint)
        this.locations[0].ox = this.orientation[0]
        this.locations[0].oy = this.orientation[1]
    }

    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out ():void {
        this.orientation = null
        this.locations[0].ox = this.locations[0].iox
        this.locations[0].oy = this.locations[0].ioy
    }
}

const opposites:Dictionary<Face> = {"top": "bottom", "right": "left", "left": "right", "bottom": "top"}
const clockwiseOptions:Dictionary<Face> = {"top": "right", "right": "bottom", "left": "top", "bottom": "left"}
const antiClockwiseOptions:Dictionary<Face> = {"top": "left", "right": "top", "left": "bottom", "bottom": "right"}

// function getCurrentFace(a:LightweightContinuousAnchor):Face {
//     return a.currentFace
// }

/**
 *
 * @param a
 * @private
 */
export function getDefaultFace(a:LightweightContinuousAnchor):Face {
    return a.faces.length === 0 ? "top" : a.faces[0]
}

function _isFaceAvailable(a:LightweightContinuousAnchor, face:Face):boolean {
    return a.faces.indexOf(face) !== -1
}

function _secondBest(a:LightweightContinuousAnchor, edge:Face):Face {
    return (a.clockwise ? clockwiseOptions : antiClockwiseOptions)[edge]
}

function _lastChoice(a:LightweightContinuousAnchor, edge:Face):Face {
    return (a.clockwise ? antiClockwiseOptions : clockwiseOptions)[edge]
}

/**
 *
 * @param a
 * @param edge
 * @private
 */
export function isEdgeSupported (a:LightweightContinuousAnchor, edge:Face):boolean {
    return  a.lockedAxis == null ?
        (a.lockedFace == null ? _isFaceAvailable(a, edge) === true : a.lockedFace === edge)
        : a.lockedAxis.indexOf(edge) !== -1
}

// if the given edge is supported, returns it. otherwise looks for a substitute that _is_
// supported. if none supported we also return the request edge.
function verifyFace (a:LightweightContinuousAnchor, edge:Face):Face {
    //const availableFaces:Array<Face> = _getAvailableFaces(a)
    if (_isFaceAvailable(a, edge)) {
        return edge
    }
    else if (_isFaceAvailable(a, opposites[edge])) {
        return opposites[edge]
    }
    else {
        const secondBest = _secondBest(a, edge)
        if (_isFaceAvailable(a, secondBest)) {
            return secondBest
        } else {
            const lastChoice = _lastChoice(a, edge)
            if (_isFaceAvailable(a, lastChoice)) {
                return lastChoice
            }
        }
    }
    return edge // we have to give them something.
}

export const TOP = "top"
export const BOTTOM = "bottom"
export const LEFT = "left"
export const RIGHT = "right"

const _top = {x:0.5, y:0, ox:0, oy:-1, offx:0, offy:0 },
    _bottom = {x:0.5, y:1, ox:0, oy:1, offx:0, offy:0 },
    _left = {x:0, y:0.5, ox:-1, oy:0, offx:0, offy:0 },
    _right = {x:1, y:0.5, ox:1, oy:0, offx:0, offy:0 },
    _topLeft = {x:0, y:0, ox:0, oy:-1, offx:0, offy:0 },
    _topRight = {x:1, y:0, ox:1, oy:-1, offx:0, offy:0 },
    _bottomLeft = {x:0, y:1, ox:0, oy:1, offx:0, offy:0 },
    _bottomRight = {x:1, y:1, ox:0, oy:1, offx:0, offy:0 },
    _center = {x:0.5, y:0.5, ox:0, oy:0, offx:0, offy:0 }

const namedValues = {
    "Top":[_top],
    "Bottom":[_bottom],
    "Left":[_left],
    "Right":[_right],
    "TopLeft":[_topLeft],
    "TopRight":[_topRight],
    "BottomLeft":[_bottomLeft],
    "BottomRight":[_bottomRight],
    "Center":[_center],
    "AutoDefault":[_top, _left, _bottom, _right]

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
        return _createAnchor(name, map(a, (_a:any) => extend({iox:_a.ox, ioy:_a.oy}, _a)), params)
    }

    a = namedContinuousValues[name]
    if (a != null) {
        return _createContinuousAnchor(name, a.faces, params)
    }

    throw {message:"jsPlumb: unknown anchor type '" + name + "'"}
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

export function createFloatingAnchor(instance:JsPlumbInstance, element:any):LightweightFloatingAnchor {
    return new LightweightFloatingAnchor(instance, element)
}

const PROPERTY_CURRENT_FACE = "currentFace"

function _createContinuousAnchor(type:string, faces:Array<Face>, params:Record<string, any>):LightweightContinuousAnchor {
    const ca:any = {
        type:type,
        locations:[],
        currentLocation:0,
        locked:false,
        id:uuid(),
        cssClass:params.cssClass || "",
        isFloating:false,
        isContinuous:true,
        timestamp:null,
        faces:params.faces || faces,
        lockedFace:null,
        lockedAxis:null,
        clockwise:!(params.clockwise === false),
        __currentFace:null
    }

    Object.defineProperty(ca, PROPERTY_CURRENT_FACE, {
        get() {
            return this.__currentFace
        },
        set(f:Face) {
            this.__currentFace = verifyFace(this, f)
        }
    })

    return ca as LightweightContinuousAnchor
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
                    // note here we get the 0th location from the named anchor, making the assumption that it has only one (and that 'AutoDefault' has not been
                    // used as an arg for a multiple location anchor)
                    return a != null ? extend({iox:0, ioy:0, cls:""}, a[0]) : null
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



import { Connection } from "../connector/connection-impl"
import { Endpoint } from "../endpoint/endpoint"
import { JsPlumbInstance } from "../core"
import {extend, isNumber, isString, map, PointXY, Rotations, Size, uuid} from "../../util/util"
import {AnchorLocations, AnchorSpec, FullAnchorSpec, PerimeterAnchorShapes} from "../../common/anchor"

export type AnchorOrientationHint = -1 | 0 | 1
export type Orientation = [  AnchorOrientationHint, AnchorOrientationHint ]


enum FaceValues { top="top", left="left", right="right", bottom="bottom" }
export const TOP = FaceValues.top
export const LEFT = FaceValues.left
export const RIGHT = FaceValues.right
export const BOTTOM  = FaceValues.bottom

export type Face = keyof typeof FaceValues

export type Axis = [ Face, Face ]

export const X_AXIS_FACES:Axis = [ LEFT, RIGHT]
export const Y_AXIS_FACES:Axis = [TOP, BOTTOM]

/**
 * @internal
 */
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

/**
 * @internal
 */
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

/**
 * @internal
 */
export interface ComputedPosition {curX:number,curY:number,ox:AnchorOrientationHint,oy:AnchorOrientationHint,x:number,y:number}

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

export interface LightweightPerimeterAnchor extends LightweightAnchor {
    shape:PerimeterAnchorShapes
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

    locations:Array<AnchorRecord> = []
    currentLocation = 0
    locked = false
    cssClass = ''
    timestamp:string = null

    type = "Floating"

    id = uuid()

    orientation:Orientation = [0,0]

    size:Size

    constructor(public instance:JsPlumbInstance, public element:Element, elementId:string) {
        this.size = instance.viewport.getPosition(elementId)
        this.locations.push({x:0.5, y:0.5, ox:this.orientation[0], oy:this.orientation[1], offx:0, offy:0, iox:this.orientation[0], ioy:this.orientation[1], cls:''})
    }

    private _updateOrientationInRouter() {
        this.instance.router.setAnchorOrientation(this, [this.locations[0].ox, this.locations[0].oy])
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
        this._updateOrientationInRouter()
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
        this._updateOrientationInRouter()
    }
}

const opposites:Record<string, Face> = {[TOP]: BOTTOM, [RIGHT]: LEFT, [LEFT]: RIGHT, [BOTTOM]: TOP}
const clockwiseOptions:Record<string, Face> = {[TOP]: RIGHT, [RIGHT]: BOTTOM, [LEFT]: TOP, [BOTTOM]: LEFT}
const antiClockwiseOptions:Record<string, Face> = {[TOP]: LEFT, [RIGHT]: TOP, [LEFT]: BOTTOM, [BOTTOM]: RIGHT}

/**
 *
 * @param a
 * @internal
 */
export function getDefaultFace(a:LightweightContinuousAnchor):Face {
    return a.faces.length === 0 ? TOP : a.faces[0]
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
 * @internal
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

    if (name === AnchorLocations.Perimeter) {
        return _createPerimeterAnchor(params)
    }

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

export function createFloatingAnchor(instance:JsPlumbInstance, element:Element, elementId:string):LightweightFloatingAnchor {
    return new LightweightFloatingAnchor(instance, element, elementId)
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
    else if (Array.isArray(spec)) {

        // // if its an array then it can be either:
        // // - a DynamicAnchor, which is a series of Anchor specs
        // // - a set of values for a low level Anchor create
        //
        // // if all values are numbers (or all numbers and an optional css class as the 7th arg) its a low level create
        if(isPrimitiveAnchorSpec(spec as Array<AnchorSpec>)) {
            const _spec = spec as Array<any>
            return _createAnchor(null, [{
                x:_spec[0],
                y:_spec[1],
                ox:_spec[2] as AnchorOrientationHint,
                oy:_spec[3] as AnchorOrientationHint,
                offx:_spec[4] == null ? 0 : _spec[4],
                offy:_spec[5] == null ? 0 : _spec[5],
                iox:_spec[2] as AnchorOrientationHint,
                ioy:_spec[3] as AnchorOrientationHint,
                cls:_spec[6] || ""
            }], {cssClass:_spec[6] || ""})
        }
        else {
            const locations:Array<AnchorRecord> = map(spec as Array<AnchorSpec>, (aSpec:AnchorSpec) => {
                if (isString(aSpec)) {
                    let a = namedValues[aSpec as string]
                    // note here we get the 0th location from the named anchor, making the assumption that it has only one (and that 'AutoDefault' has not been
                    // used as an arg for a multiple location anchor)
                    return a != null ? extend({iox:a[0].ox, ioy:a[0].oy, cls:""}, a[0]) : null
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


// --------------- perimeter anchors ----------------------

function circleGenerator(anchorCount:number):Array<AnchorRecord> {
    const r = 0.5, step = Math.PI * 2 / anchorCount, a:Array<AnchorRecord> = []
    let current = 0
    for (let i = 0; i < anchorCount; i++) {
        const x = r + (r * Math.sin(current)),
            y = r + (r * Math.cos(current))

        a.push({
            x, y,
            ox:0,
            oy:0,
            offx:0,
            offy:0,
            iox:0,
            ioy:0,
            cls:''
        })
        current += step
    }
    return a
}

function _path (segments:Array<any>, anchorCount:number):Array<AnchorRecord> {
    let anchorsPerFace = anchorCount / segments.length, a:Array<AnchorRecord> = [],
        _computeFace = (x1:number, y1:number, x2:number, y2:number, fractionalLength:number, ox:AnchorOrientationHint, oy:AnchorOrientationHint) => {
            anchorsPerFace = anchorCount * fractionalLength;
            const dx = (x2 - x1) / anchorsPerFace, dy = (y2 - y1) / anchorsPerFace;
            for (let i = 0; i < anchorsPerFace; i++) {
                a.push({
                    x:x1 +(dx * i),
                    y:y1 +(dy * i),
                    ox:ox == null ? 0 : ox,
                    oy:oy == null ? 0 : oy,
                    offx:0, offy:0, iox:0, ioy:0, cls:''
                })
            }
        };

    for (let i = 0; i < segments.length; i++) {
        _computeFace.apply(null, segments[i])
    }

    return a;
}

function shapeGenerator(faces:Array<any>, anchorCount:number):Array<AnchorRecord> {
    const s:Array<any> = []

    for (let i = 0; i < faces.length; i++) {
        s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length, faces[i][4], faces[i][5]])
    }

    return _path(s, anchorCount)
}

function rectangleGenerator(anchorCount:number):Array<AnchorRecord> {
    return shapeGenerator([
        [ 0, 0, 1, 0, 0, -1 ],
        [ 1, 0, 1, 1, 1, 0 ],
        [ 1, 1, 0, 1, 0, 1 ],
        [ 0, 1, 0, 0, -1, 0 ]
    ], anchorCount);
}

function diamondGenerator(anchorCount:number):Array<AnchorRecord> {
    return shapeGenerator([
        [ 0.5, 0, 1, 0.5 ],
        [ 1, 0.5, 0.5, 1 ],
        [ 0.5, 1, 0, 0.5 ],
        [ 0, 0.5, 0.5, 0 ]
    ], anchorCount)
}

function triangleGenerator(anchorCount:number):Array<AnchorRecord> {
    return shapeGenerator([
        [ 0.5, 0, 1, 1 ],
        [ 1, 1, 0, 1 ],
        [ 0, 1, 0.5, 0]
    ], anchorCount)
}

function rotate (points:Array<AnchorRecord>, amountInDegrees:number):Array<AnchorRecord> {
    const o:Array<AnchorRecord> = [], theta = amountInDegrees / 180 * Math.PI
    for (let i = 0; i < points.length; i++) {
        const  _x = points[i].x - 0.5,
            _y = points[i].y - 0.5

        o.push({
            x:0.5 + ((_x * Math.cos(theta)) - (_y * Math.sin(theta))),
            y:0.5 + ((_x * Math.sin(theta)) + (_y * Math.cos(theta))),
            ox:points[i].ox,
            oy:points[i].oy,
            offx:0,
            offy:0,
            iox:0,
            ioy:0,
            cls:''
        })
    }
    return o
}

const anchorGenerators:Map<PerimeterAnchorShapes, (anchorCount:number)=>Array<AnchorRecord>> = new Map()
anchorGenerators.set(PerimeterAnchorShapes.Circle, circleGenerator)
anchorGenerators.set(PerimeterAnchorShapes.Ellipse, circleGenerator)
anchorGenerators.set(PerimeterAnchorShapes.Rectangle, rectangleGenerator)
anchorGenerators.set(PerimeterAnchorShapes.Square, rectangleGenerator)
anchorGenerators.set(PerimeterAnchorShapes.Diamond, diamondGenerator)
anchorGenerators.set(PerimeterAnchorShapes.Triangle, triangleGenerator)

export function _createPerimeterAnchor(params:Record<string, any>):LightweightPerimeterAnchor {

    params = params || {}
    const anchorCount = params.anchorCount || 60,
        shape:PerimeterAnchorShapes = params.shape

    if (!shape) {
        throw new Error("no shape supplied to Perimeter Anchor type");
    }

    if (!anchorGenerators.has(shape)) {
        throw new Error("Shape [" + shape + "] is unknown by Perimeter Anchor type");
    }

    let da = anchorGenerators.get(shape)(anchorCount)
    if (params.rotation) {
        da = rotate(da, params.rotation)
    }

    const a = _createAnchor(AnchorLocations.Perimeter, da, params)
    const aa = extend(a as any, { shape }) as LightweightPerimeterAnchor

    return aa
}



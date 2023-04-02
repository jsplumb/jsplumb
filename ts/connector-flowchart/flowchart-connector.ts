/**
 * Options for a flowchart connector
 * @public
 */
import {ConnectorOptions, Geometry} from "../common/connector"
import {ArcSegment} from "../core/connector/arc-segment"
import {AbstractConnector, ConnectorComputeParams, PaintGeometry} from "../core/connector/abstract-connector"
import {Connection} from "../core/connector/connection-impl"
import {StraightSegment} from "../core/connector/straight-segment"

export interface FlowchartConnectorOptions extends ConnectorOptions {
    /**
     * Always paint stubs at the end of a connector, even if the elements are closer together than the length of the stubs.
     */
    alwaysRespectStubs?:boolean
    /**
     * Optional midpoint to use for the connector, defaults to 0.5.
     */
    midpoint?:number
    /**
     * Optional curvature between segments. Defaults to 0, ie. no curve.
     */
    cornerRadius?:number
    /**
     * How large to make a connector whose source and target is the same element.
     */
    loopbackRadius?:number
}

type SegmentDirection = -1 | 0 | 1
type FlowchartSegment = [ number, number, number, number, string ]
type StubPositions = [number, number, number, number]

function sgn (n:number):SegmentDirection {
    return n < 0 ? -1 : n === 0 ? 0 : 1
}

function segmentDirections (segment:FlowchartSegment):[number, number] {
    return [
        sgn( segment[2] - segment[0] ),
        sgn( segment[3] - segment[1] )
    ]
}

function segLength (s:FlowchartSegment):number {
    return Math.sqrt(Math.pow(s[0] - s[2], 2) + Math.pow(s[1] - s[3], 2))
}

function _cloneArray (a:Array<any>):Array<any> {
    let _a:Array<any> = []
    _a.push.apply(_a, a)
    return _a
}

/**
 * Flowchart connector inscribes a path consisting of a series of horizontal and vertical segments.
 * @public
 */
export class FlowchartConnector extends AbstractConnector {

    static type = "Flowchart"
    type = FlowchartConnector.type

    private internalSegments:Array<FlowchartSegment> = []
    midpoint:number
    alwaysRespectStubs:boolean
    cornerRadius:number
    lastx:number
    lasty:number
    lastOrientation:any
    loopbackRadius:number
    isLoopbackCurrently:boolean

    getDefaultStubs(): [number, number] {
        return [30, 30]
    }

    constructor(public connection:Connection, params:FlowchartConnectorOptions) {
        super(connection, params)

        this.midpoint = params.midpoint == null || isNaN(params.midpoint) ? 0.5 : params.midpoint
        this.cornerRadius = params.cornerRadius != null ? params.cornerRadius : 0
        this.alwaysRespectStubs = params.alwaysRespectStubs === true

        this.lastx = null
        this.lasty = null
        this.lastOrientation = null

        // TODO now common between this and AbstractBezierEditor; refactor into superclass?
        this.loopbackRadius = params.loopbackRadius || 25
        this.isLoopbackCurrently = false
    }

    private addASegment(x:number, y:number, paintInfo:PaintGeometry) {
        if (this.lastx === x && this.lasty === y) {
            return
        }
        let lx = this.lastx == null ? paintInfo.sx : this.lastx,
            ly = this.lasty == null ? paintInfo.sy : this.lasty,
            o = lx === x ? "v" : "h"

        this.lastx = x
        this.lasty = y
        this.internalSegments.push([ lx, ly, x, y, o ])
    }

    private writeSegments (paintInfo:PaintGeometry):void {
        let current:FlowchartSegment = null, next:FlowchartSegment, currentDirection:[number,number], nextDirection:[number, number]
        for (let i = 0; i < this.internalSegments.length - 1; i++) {

            current = current || _cloneArray(this.internalSegments[i]) as FlowchartSegment
            next = _cloneArray(this.internalSegments[i + 1]) as FlowchartSegment

            currentDirection = segmentDirections(current)
            nextDirection = segmentDirections(next)

            if (this.cornerRadius > 0 && current[4] !== next[4]) {

                let minSegLength = Math.min(segLength(current), segLength(next))
                let radiusToUse = Math.min(this.cornerRadius, minSegLength / 2)

                current[2] -= currentDirection[0] * radiusToUse
                current[3] -= currentDirection[1] * radiusToUse
                next[0] += nextDirection[0] * radiusToUse
                next[1] += nextDirection[1] * radiusToUse

                let ac = (currentDirection[1] === nextDirection[0] && nextDirection[0] === 1) ||
                        ((currentDirection[1] === nextDirection[0] && nextDirection[0] === 0) && currentDirection[0] !== nextDirection[1]) ||
                        (currentDirection[1] === nextDirection[0] && nextDirection[0] === -1),
                    sgny = next[1] > current[3] ? 1 : -1,
                    sgnx = next[0] > current[2] ? 1 : -1,
                    sgnEqual = sgny === sgnx,
                    cx = (sgnEqual && ac || (!sgnEqual && !ac)) ? next[0] : current[2],
                    cy = (sgnEqual && ac || (!sgnEqual && !ac)) ? current[3] : next[1]

                this._addSegment(StraightSegment, {
                    x1: current[0], y1: current[1], x2: current[2], y2: current[3]
                })

                this._addSegment(ArcSegment, {
                    r: radiusToUse,
                    x1: current[2],
                    y1: current[3],
                    x2: next[0],
                    y2: next[1],
                    cx: cx,
                    cy: cy,
                    ac: ac
                })
            }
            else {
                this._addSegment(StraightSegment, {
                    x1: current[0], y1: current[1], x2: current[2], y2: current[3]
                })
            }
            current = next
        }
        if (next != null) {
            // last segment
            this._addSegment(StraightSegment, {
                x1: next[0], y1: next[1], x2: next[2], y2: next[3]
            })
        }
    }

    _compute (paintInfo:PaintGeometry, params:ConnectorComputeParams):void {

        this.internalSegments.length = 0
        this.lastx = null
        this.lasty = null
        this.lastOrientation = null

        let commonStubCalculator = (axis:string):StubPositions => {
                return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY]
            },
            stubCalculators:Record<string, (axis:string) => StubPositions> = {
                perpendicular: commonStubCalculator,
                orthogonal: commonStubCalculator,
                opposite:  (axis:string) => {
                    let pi = paintInfo,
                        idx = axis === "x" ? 0 : 1,
                        areInProximity = {
                            "x": function () {
                                return ( (pi.so[idx] === 1 && (
                                    ( (pi.startStubX > pi.endStubX) && (pi.tx > pi.startStubX) ) ||
                                    ( (pi.sx > pi.endStubX) && (pi.tx > pi.sx))))) ||

                                    ( (pi.so[idx] === -1 && (
                                    ( (pi.startStubX < pi.endStubX) && (pi.tx < pi.startStubX) ) ||
                                    ( (pi.sx < pi.endStubX) && (pi.tx < pi.sx)))))
                            },
                            "y": function () {
                                return ( (pi.so[idx] === 1 && (
                                    ( (pi.startStubY > pi.endStubY) && (pi.ty > pi.startStubY) ) ||
                                    ( (pi.sy > pi.endStubY) && (pi.ty > pi.sy))))) ||

                                    ( (pi.so[idx] === -1 && (
                                    ( (pi.startStubY < pi.endStubY) && (pi.ty < pi.startStubY) ) ||
                                    ( (pi.sy < pi.endStubY) && (pi.ty < pi.sy)))))
                            }
                        }

                    if (!this.alwaysRespectStubs && areInProximity[axis]()) {
                        return {
                            "x": [(paintInfo.sx + paintInfo.tx) / 2, paintInfo.startStubY, (paintInfo.sx + paintInfo.tx) / 2, paintInfo.endStubY] as StubPositions,
                            "y": [paintInfo.startStubX, (paintInfo.sy + paintInfo.ty) / 2, paintInfo.endStubX, (paintInfo.sy + paintInfo.ty) / 2] as StubPositions
                        }[axis]
                    }
                    else {
                        return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY] as StubPositions
                    }
                }
            }

        // calculate Stubs.
        let stubs:StubPositions = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis),
            idx = paintInfo.sourceAxis === "x" ? 0 : 1,
            oidx = paintInfo.sourceAxis === "x" ? 1 : 0,
            ss = stubs[idx],
            oss = stubs[oidx],
            es = stubs[idx + 2],
            oes = stubs[oidx + 2]

        // add the start stub segment. use stubs for loopback as it will look better, with the loop spaced
        // away from the element.
        this.addASegment(stubs[0], stubs[1], paintInfo)

        // if its a loopback and we should treat it differently.
        // if (false && params.sourcePos[0] === params.targetPos[0] && params.sourcePos[1] === params.targetPos[1]) {
        //
        //     // we use loopbackRadius here, as statemachine connectors do.
        //     // so we go radius to the left from stubs[0], then upwards by 2*radius, to the right by 2*radius,
        //     // down by 2*radius, left by radius.
        //     addSegment(segments, stubs[0] - loopbackRadius, stubs[1], paintInfo)
        //     addSegment(segments, stubs[0] - loopbackRadius, stubs[1] - (2 * loopbackRadius), paintInfo)
        //     addSegment(segments, stubs[0] + loopbackRadius, stubs[1] - (2 * loopbackRadius), paintInfo)
        //     addSegment(segments, stubs[0] + loopbackRadius, stubs[1], paintInfo)
        //     addSegment(segments, stubs[0], stubs[1], paintInfo)
        //
        // }
        // else {


        let midx = paintInfo.startStubX + ((paintInfo.endStubX - paintInfo.startStubX) * this.midpoint),
            midy = paintInfo.startStubY + ((paintInfo.endStubY - paintInfo.startStubY) * this.midpoint)

        let orientations = {x: [0, 1], y: [1, 0]},
            lineCalculators:Record<string, (axis:string, ss:number, oss:number, es:number, oes:number) => any> = {
                perpendicular: (axis:string, ss:number, oss:number, es:number, oes:number) => {
                    let pi = paintInfo,
                        sis = {
                            x: [
                                [[1, 2, 3, 4], null, [2, 1, 4, 3]],
                                null,
                                [[4, 3, 2, 1], null, [3, 4, 1, 2]]
                            ],
                            y: [
                                [[3, 2, 1, 4], null, [2, 3, 4, 1]],
                                null,
                                [[4, 1, 2, 3], null, [1, 4, 3, 2]]
                            ]
                        },
                        stubs = {
                            x: [[pi.startStubX, pi.endStubX], null, [pi.endStubX, pi.startStubX]],
                            y: [[pi.startStubY, pi.endStubY], null, [pi.endStubY, pi.startStubY]]
                        },
                        midLines = {
                            x: [[midx, pi.startStubY], [midx, pi.endStubY]],
                            y: [[pi.startStubX, midy], [pi.endStubX, midy]]
                        },
                        linesToEnd = {
                            x: [[pi.endStubX, pi.startStubY]],
                            y: [[pi.startStubX, pi.endStubY]]
                        },
                        startToEnd = {
                            x: [[pi.startStubX, pi.endStubY], [pi.endStubX, pi.endStubY]],
                            y: [[pi.endStubX, pi.startStubY], [pi.endStubX, pi.endStubY]]
                        },
                        startToMidToEnd = {
                            x: [[pi.startStubX, midy], [pi.endStubX, midy], [pi.endStubX, pi.endStubY]],
                            y: [[midx, pi.startStubY], [midx, pi.endStubY], [pi.endStubX, pi.endStubY]]
                        },
                        otherStubs = {
                            x: [pi.startStubY, pi.endStubY],
                            y: [pi.startStubX, pi.endStubX]
                        },
                        soIdx = orientations[axis][0], toIdx = orientations[axis][1],
                        _so = pi.so[soIdx] + 1,
                        _to = pi.to[toIdx] + 1,
                        otherFlipped = (pi.to[toIdx] === -1 && (otherStubs[axis][1] < otherStubs[axis][0])) || (pi.to[toIdx] === 1 && (otherStubs[axis][1] > otherStubs[axis][0])),
                        stub1 = stubs[axis][_so][0],
                        stub2 = stubs[axis][_so][1],
                        segmentIndexes = sis[axis][_so][_to]

                    if (pi.segment === segmentIndexes[3] || (pi.segment === segmentIndexes[2] && otherFlipped)) {
                        return midLines[axis]
                    }
                    else if (pi.segment === segmentIndexes[2] && stub2 < stub1) {
                        return linesToEnd[axis]
                    }
                    else if ((pi.segment === segmentIndexes[2] && stub2 >= stub1) || (pi.segment === segmentIndexes[1] && !otherFlipped)) {
                        return startToMidToEnd[axis]
                    }
                    else if (pi.segment === segmentIndexes[0] || (pi.segment === segmentIndexes[1] && otherFlipped)) {
                        return startToEnd[axis]
                    }
                },
                orthogonal: (axis:string, startStub:number, otherStartStub:number, endStub:number, otherEndStub:number) => {
                    let pi = paintInfo,
                        extent = {
                            "x": pi.so[0] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub),
                            "y": pi.so[1] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub)
                        }[axis]

                    return {
                        "x": [
                            [extent, otherStartStub],
                            [extent, otherEndStub],
                            [endStub, otherEndStub]
                        ],
                        "y": [
                            [otherStartStub, extent],
                            [otherEndStub, extent],
                            [otherEndStub, endStub]
                        ]
                    }[axis]
                },
                opposite: (axis:string, ss:number, oss:number, es:number, oes:number):any => {
                    let pi = paintInfo,
                        otherAxis:string = {"x": "y", "y": "x"}[axis],
                        dim = {"x": "h", "y": "w"}[axis],
                        comparator = pi["is" + axis.toUpperCase() + "GreaterThanStubTimes2"]

                    if (params.sourceEndpoint.elementId === params.targetEndpoint.elementId) {
                        let _val = oss + ((1 - params.sourceEndpoint._anchor.computedPosition[otherAxis]) * params.sourceInfo[dim]) + this.maxStub
                        return {
                            "x": [
                                [ss, _val],
                                [es, _val]
                            ],
                            "y": [
                                [_val, ss],
                                [_val, es]
                            ]
                        }[axis]

                    }
                    else if (!comparator || (pi.so[idx] === 1 && ss > es) || (pi.so[idx] === -1 && ss < es)) {
                        return {
                            "x": [
                                [ss, midy],
                                [es, midy]
                            ],
                            "y": [
                                [midx, ss],
                                [midx, es]
                            ]
                        }[axis]
                    }
                    else if ((pi.so[idx] === 1 && ss < es) || (pi.so[idx] === -1 && ss > es)) {
                        return {
                            "x": [
                                [midx, pi.sy],
                                [midx, pi.ty]
                            ],
                            "y": [
                                [pi.sx, midy],
                                [pi.tx, midy]
                            ]
                        }[axis]
                    }
                }
            }

        // compute the rest of the line
        let p:any = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes)
        if (p) {
            for (let i = 0; i < p.length; i++) {
                this.addASegment(p[i][0], p[i][1], paintInfo)
            }
        }

        // line to end stub
        this.addASegment(stubs[2], stubs[3], paintInfo)

        // end stub to end (common)
        this.addASegment(paintInfo.tx, paintInfo.ty, paintInfo)

        // write out the segments.
        this.writeSegments(paintInfo)
    }


    transformGeometry(g: Geometry, dx: number, dy: number): Geometry {
        return g
    }
}




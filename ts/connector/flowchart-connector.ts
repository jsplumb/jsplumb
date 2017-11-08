import {Connector} from "./connector";
import {cloneArray, sgn} from "../util";
import {JsPlumbInstance} from "../core";

export class FlowchartConnector<EventType, ElementType> extends Connector<EventType, ElementType> {

    type = "Flowchart";
    stub:number;
    midpoint:number;
    alwaysRespectStubs:Boolean;
    cornerRadius:number;
    loopbackRadius:number;
    lastx:number = -1;
    lasty:number = -1;
    lastOrientation:number;
    flowchartSegments:Array<any> = [];

    constructor(params:any) {
        super(params);
        this.midpoint = params.midpoint == null ? 0.5 : params.midpoint;
        this.alwaysRespectStubs = params.alwaysRespectStubs === true;
        this.cornerRadius = params.cornerRadius != null ? params.cornerRadius : 0;
        this.loopbackRadius = params.loopbackRadius || 25;
    }

    private pushSegment(x:number, y:number, paintInfo?:any) {
        if (this.lastx === x && this.lasty === y) {
            return;
        }
        let lx = this.lastx == null ? paintInfo.sx : this.lastx,
            ly = this.lasty == null ? paintInfo.sy : this.lasty,
            o = lx === x ? "v" : "h",
            sgnx = sgn(x - lx),
            sgny = sgn(y - ly);

        this.lastx = x;
        this.lasty = y;
        this.flowchartSegments.push([lx, ly, x, y, o, sgnx, sgny]);
    }

    static segLength(s:[number, number, number, number]) {
        return Math.sqrt(Math.pow(s[0] - s[2], 2) + Math.pow(s[1] - s[3], 2));
    }

    writeSegments(conn:Connector<EventType, ElementType>, segments:Array<any>, paintInfo?:any) {
        let current:any = null, next:any;
        for (let i = 0; i < segments.length - 1; i++) {

            current = current || cloneArray(segments[i]);
            next = cloneArray(segments[i + 1]);
            if (this.cornerRadius > 0 && current[4] !== next[4]) {
                let radiusToUse = Math.min(this.cornerRadius, FlowchartConnector.segLength(current), FlowchartConnector.segLength(next));
                // right angle. adjust current segment's end point, and next segment's start point.
                current[2] -= current[5] * radiusToUse;
                current[3] -= current[6] * radiusToUse;
                next[0] += next[5] * radiusToUse;
                next[1] += next[6] * radiusToUse;
                let ac = (current[6] === next[5] && next[5] === 1) ||
                        ((current[6] === next[5] && next[5] === 0) && current[5] !== next[6]) ||
                        (current[6] === next[5] && next[5] === -1),
                    sgny = next[1] > current[3] ? 1 : -1,
                    sgnx = next[0] > current[2] ? 1 : -1,
                    sgnEqual = sgny === sgnx,
                    cx = (sgnEqual && ac || (!sgnEqual && !ac)) ? next[0] : current[2],
                    cy = (sgnEqual && ac || (!sgnEqual && !ac)) ? current[3] : next[1];

                this._addSegment(conn, "Straight", {
                    x1: current[0], y1: current[1], x2: current[2], y2: current[3]
                });

                this._addSegment(conn, "Arc", {
                    r: radiusToUse,
                    x1: current[2],
                    y1: current[3],
                    x2: next[0],
                    y2: next[1],
                    cx: cx,
                    cy: cy,
                    ac: ac
                });
            }
            else {
                // dx + dy are used to adjust for line width.
                let dx = (current[2] === current[0]) ? 0 : (current[2] > current[0]) ? (paintInfo.lw / 2) : -(paintInfo.lw / 2),
                    dy = (current[3] === current[1]) ? 0 : (current[3] > current[1]) ? (paintInfo.lw / 2) : -(paintInfo.lw / 2);
                this._addSegment(conn, "Straight", {
                    x1: current[0] - dx, y1: current[1] - dy, x2: current[2] + dx, y2: current[3] + dy
                });
            }
            current = next;
        }
        if (next != null) {
            // last segment
            this._addSegment(conn, "Straight", {
                x1: next[0], y1: next[1], x2: next[2], y2: next[3]
            });
        }
    }

    _compute(paintInfo:any, params:any) {

        this.segments.length = 0;
        this.flowchartSegments.length = 0;
        this.lastx = null;
        this.lasty = null;
        this.lastOrientation = null;

        let commonStubCalculator = function () {
                return [ paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY ];
            },
            stubCalculators = {
                perpendicular: commonStubCalculator,
                orthogonal: commonStubCalculator,
                opposite: function (axis:string) {
                    let pi = paintInfo,
                        idx = axis === "x" ? 0 : 1,
                        areInProximity = {
                            "x": function () {
                                return ( (pi.so[idx] === 1 && (
                                    ( (pi.startStubX > pi.endStubX) && (pi.tx > pi.startStubX) ) ||
                                    ( (pi.sx > pi.endStubX) && (pi.tx > pi.sx))))) ||

                                    ( (pi.so[idx] === -1 && (
                                    ( (pi.startStubX < pi.endStubX) && (pi.tx < pi.startStubX) ) ||
                                    ( (pi.sx < pi.endStubX) && (pi.tx < pi.sx)))));
                            },
                            "y": function () {
                                return ( (pi.so[idx] === 1 && (
                                    ( (pi.startStubY > pi.endStubY) && (pi.ty > pi.startStubY) ) ||
                                    ( (pi.sy > pi.endStubY) && (pi.ty > pi.sy))))) ||

                                    ( (pi.so[idx] === -1 && (
                                    ( (pi.startStubY < pi.endStubY) && (pi.ty < pi.startStubY) ) ||
                                    ( (pi.sy < pi.endStubY) && (pi.ty < pi.sy)))));
                            }
                        };

                    if (!this.alwaysRespectStubs && areInProximity[axis]()) {
                        return {
                            "x": [(paintInfo.sx + paintInfo.tx) / 2, paintInfo.startStubY, (paintInfo.sx + paintInfo.tx) / 2, paintInfo.endStubY],
                            "y": [paintInfo.startStubX, (paintInfo.sy + paintInfo.ty) / 2, paintInfo.endStubX, (paintInfo.sy + paintInfo.ty) / 2]
                        }[axis];
                    }
                    else {
                        return [ paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY ];
                    }
                }
            };

        // calculate Stubs.
        let stubs = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis),
            idx = paintInfo.sourceAxis === "x" ? 0 : 1,
            oidx = paintInfo.sourceAxis === "x" ? 1 : 0,
            ss = stubs[idx],
            oss = stubs[oidx],
            es = stubs[idx + 2],
            oes = stubs[oidx + 2];

        // add the start stub segment. use stubs for loopback as it will look better, with the loop spaced
        // away from the element.
        this.pushSegment(stubs[0], stubs[1], paintInfo);

        // if its a loopback and we should treat it differently.
        // if (false &&params.sourcePos[0] === params.targetPos[0] && params.sourcePos[1] === params.targetPos[1]) {
        //
        //     // we use loopbackRadius here, as statemachine connectors do.
        //     // so we go radius to the left from stubs[0], then upwards by 2*radius, to the right by 2*radius,
        //     // down by 2*radius, left by radius.
        //     this.pushSegment(stubs[0] - this.loopbackRadius, stubs[1], paintInfo);
        //     this.pushSegment(stubs[0] - this.loopbackRadius, stubs[1] - (2 * this.loopbackRadius), paintInfo);
        //     this.pushSegment(stubs[0] + this.loopbackRadius, stubs[1] - (2 * this.loopbackRadius), paintInfo);
        //     this.pushSegment(stubs[0] + this.loopbackRadius, stubs[1], paintInfo);
        //     this.pushSegment(stubs[0], stubs[1], paintInfo);
        //
        // }
        // else {


            let midx = paintInfo.startStubX + ((paintInfo.endStubX - paintInfo.startStubX) * this.midpoint),
                midy = paintInfo.startStubY + ((paintInfo.endStubY - paintInfo.startStubY) * this.midpoint);

            let orientations = { x: [ 0, 1 ], y: [ 1, 0 ] },
                lineCalculators = {
                    perpendicular: function (axis:number) {
                        let pi = paintInfo,
                            sis = {
                                x: [
                                    [ [ 1, 2, 3, 4 ], null, [ 2, 1, 4, 3 ] ],
                                    null,
                                    [ [ 4, 3, 2, 1 ], null, [ 3, 4, 1, 2 ] ]
                                ],
                                y: [
                                    [ [ 3, 2, 1, 4 ], null, [ 2, 3, 4, 1 ] ],
                                    null,
                                    [ [ 4, 1, 2, 3 ], null, [ 1, 4, 3, 2 ] ]
                                ]
                            },
                            stubs = {
                                x: [ [ pi.startStubX, pi.endStubX ], null, [ pi.endStubX, pi.startStubX ] ],
                                y: [ [ pi.startStubY, pi.endStubY ], null, [ pi.endStubY, pi.startStubY ] ]
                            },
                            midLines = {
                                x: [ [ midx, pi.startStubY ], [ midx, pi.endStubY ] ],
                                y: [ [ pi.startStubX, midy ], [ pi.endStubX, midy ] ]
                            },
                            linesToEnd = {
                                x: [ [ pi.endStubX, pi.startStubY ] ],
                                y: [ [ pi.startStubX, pi.endStubY ] ]
                            },
                            startToEnd = {
                                x: [ [ pi.startStubX, pi.endStubY ], [ pi.endStubX, pi.endStubY ] ],
                                y: [ [ pi.endStubX, pi.startStubY ], [ pi.endStubX, pi.endStubY ] ]
                            },
                            startToMidToEnd = {
                                x: [ [ pi.startStubX, midy ], [ pi.endStubX, midy ], [ pi.endStubX, pi.endStubY ] ],
                                y: [ [ midx, pi.startStubY ], [ midx, pi.endStubY ], [ pi.endStubX, pi.endStubY ] ]
                            },
                            otherStubs = {
                                x: [ pi.startStubY, pi.endStubY ],
                                y: [ pi.startStubX, pi.endStubX ]
                            },
                            soIdx = orientations[axis][0], toIdx = orientations[axis][1],
                            _so = pi.so[soIdx] + 1,
                            _to = pi.to[toIdx] + 1,
                            otherFlipped = (pi.to[toIdx] === -1 && (otherStubs[axis][1] < otherStubs[axis][0])) || (pi.to[toIdx] === 1 && (otherStubs[axis][1] > otherStubs[axis][0])),
                            stub1 = stubs[axis][_so][0],
                            stub2 = stubs[axis][_so][1],
                            segmentIndexes = sis[axis][_so][_to];

                        if (pi.segment === segmentIndexes[3] || (pi.segment === segmentIndexes[2] && otherFlipped)) {
                            return midLines[axis];
                        }
                        else if (pi.segment === segmentIndexes[2] && stub2 < stub1) {
                            return linesToEnd[axis];
                        }
                        else if ((pi.segment === segmentIndexes[2] && stub2 >= stub1) || (pi.segment === segmentIndexes[1] && !otherFlipped)) {
                            return startToMidToEnd[axis];
                        }
                        else if (pi.segment === segmentIndexes[0] || (pi.segment === segmentIndexes[1] && otherFlipped)) {
                            return startToEnd[axis];
                        }
                    },
                    orthogonal: function (axis:string, startStub:number, otherStartStub:number, endStub:number, otherEndStub:number) {
                        let pi = paintInfo,
                            extent = {
                                "x": pi.so[0] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub),
                                "y": pi.so[1] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub)
                            }[axis];

                        return {
                            "x": [
                                [ extent, otherStartStub ],
                                [ extent, otherEndStub ],
                                [ endStub, otherEndStub ]
                            ],
                            "y": [
                                [ otherStartStub, extent ],
                                [ otherEndStub, extent ],
                                [ otherEndStub, endStub ]
                            ]
                        }[axis];
                    },
                    opposite: function (axis:string, ss:number, oss:number, es:number) {
                        let pi = paintInfo,
                            otherAxis = {"x": "y", "y": "x"}[axis],
                            dim = {"x": "height", "y": "width"}[axis],
                            comparator = pi["is" + axis.toUpperCase() + "GreaterThanStubTimes2"];

                        if (params.sourceEndpoint.elementId === params.targetEndpoint.elementId) {
                            let _val = oss + ((1 - params.sourceEndpoint.anchor[otherAxis]) * params.sourceInfo[dim]) + this.maxStub;
                            return {
                                "x": [
                                    [ ss, _val ],
                                    [ es, _val ]
                                ],
                                "y": [
                                    [ _val, ss ],
                                    [ _val, es ]
                                ]
                            }[axis];

                        }
                        else if (!comparator || (pi.so[idx] === 1 && ss > es) || (pi.so[idx] === -1 && ss < es)) {
                            return {
                                "x": [
                                    [ ss, midy ],
                                    [ es, midy ]
                                ],
                                "y": [
                                    [ midx, ss ],
                                    [ midx, es ]
                                ]
                            }[axis];
                        }
                        else if ((pi.so[idx] === 1 && ss < es) || (pi.so[idx] === -1 && ss > es)) {
                            return {
                                "x": [
                                    [ midx, pi.sy ],
                                    [ midx, pi.ty ]
                                ],
                                "y": [
                                    [ pi.sx, midy ],
                                    [ pi.tx, midy ]
                                ]
                            }[axis];
                        }
                    }
                };

            // compute the rest of the line
            let p = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes);
            if (p) {
                for (let i = 0; i < p.length; i++) {
                    this.pushSegment(p[i][0], p[i][1], paintInfo);
                }
            }

            // line to end stub
            this.pushSegment(stubs[2], stubs[3], paintInfo);

        //}

        // end stub to end (common)
        this.pushSegment(paintInfo.tx, paintInfo.ty, paintInfo);

        // write out the segments.
        this.writeSegments(this, this.flowchartSegments, paintInfo);
    }

    cleanup(force?: Boolean): void {
    }

    reattach(instance: JsPlumbInstance<EventType, ElementType>, component?: any): void {
    }
}

//Connector.map["Flowchart"] = FlowchartConnector;

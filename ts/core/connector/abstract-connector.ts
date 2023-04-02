
import { Connection} from './connection-impl'
import { Orientation} from '../factory/anchor-record-factory'
import { Endpoint} from '../endpoint/endpoint'

import { ViewportElement } from "../viewport"
import {Connector, ConnectorOptions, Geometry, PaintAxis} from "../../common/connector"
import {Constructable, Extents, log, PointXY} from "../../util/util"
import {quadrant} from "../../util/geom"
import {AnchorPlacement} from "../../common/anchor"
import {EMPTY_BOUNDS, Segment} from "../../common/abstract-segment"

/**
 * @internal
 */
type SegmentForPoint = { d: number, s: Segment, x: number, y: number, l: number, x1:number, y1:number, x2:number, y2:number, index:number, connectorLocation: number }

export type ConnectorComputeParams = {
    sourcePos: AnchorPlacement,
    targetPos: AnchorPlacement,
    sourceEndpoint: Endpoint,
    targetEndpoint: Endpoint,
    strokeWidth: number,
    sourceInfo: ViewportElement<any>,
    targetInfo: ViewportElement<any>
}

/**
 * @internal
 */
export interface PaintGeometry {
    sx: number
    sy: number
    tx: number
    ty: number
    xSpan: number
    ySpan: number
    mx: number
    my: number
    so: Orientation
    to: Orientation
    x: number
    y: number
    w: number
    h: number
    segment: number
    startStubX: number
    startStubY: number
    endStubX: number
    endStubY: number
    isXGreaterThanStubTimes2: boolean
    isYGreaterThanStubTimes2: boolean
    opposite: boolean
    perpendicular: boolean
    orthogonal: boolean
    sourceAxis: PaintAxis
    points: [ number, number, number, number, number, number, number, number ]
    stubs:[number, number]
    anchorOrientation?:string
}

/**
 * @internal
 */
export abstract class AbstractConnector implements Connector {

    abstract type:string

    edited = false

    stub:number | number[]
    sourceStub:number
    targetStub:number
    maxStub:number

    typeId:string

    gap:number
    sourceGap:number
    targetGap:number
    segments:Array<Segment> = []
    totalLength:number = 0
    segmentProportions:Array<[number,number]> = []
    segmentProportionalLengths:Array<number> = []
    protected paintInfo:PaintGeometry = null
    strokeWidth:number
    x:number
    y:number
    w:number
    h:number
    segment:number
    bounds:Extents = EMPTY_BOUNDS()
    cssClass:string
    hoverClass:string

    abstract getDefaultStubs():[number, number]

    geometry:Geometry

    constructor(public connection:Connection, params:ConnectorOptions) {
        this.stub = params.stub || this.getDefaultStubs()
        this.sourceStub = Array.isArray(this.stub) ? this.stub[0] : this.stub
        this.targetStub = Array.isArray(this.stub) ? this.stub[1] : this.stub
        this.gap = params.gap || 0
        this.sourceGap = Array.isArray(this.gap) ? this.gap[0] : this.gap
        this.targetGap = Array.isArray(this.gap) ? this.gap[1] : this.gap
        this.maxStub = Math.max(this.sourceStub, this.targetStub)
        this.cssClass = params.cssClass || ""
        this.hoverClass = params.hoverClass || ""
    }

    getTypeDescriptor ():string {
        return "connector"
    }
    
    getIdPrefix () { return  "_jsplumb_connector"; }

    protected setGeometry(g:Geometry, internal:boolean) {
        this.geometry = g
        this.edited = g != null && !internal
    }

    /**
     * Subclasses can override this. By default we just pass back the geometry we are using internally.
     */
    exportGeometry():Geometry {
        return this.geometry
    }

    /**
     * Subclasses can override this. By default we just set the given geometry as our internal representation.
     */
    importGeometry(g:Geometry):boolean {
        this.geometry = g
        return true
    }

    resetGeometry():void {
        this.geometry = null
        this.edited = false
    }

    /**
     *
     * @param g
     * @param dx
     * @param dy
     */
    abstract transformGeometry(g:Geometry, dx:number, dy:number):Geometry

    /**
     * Helper method for subclasses - AnchorPlacement is a common component of a connector geometry.
     * @internal
     * @param a
     * @param dx
     * @param dy
     */
    protected transformAnchorPlacement(a:AnchorPlacement, dx:number, dy:number):AnchorPlacement {
        return {
            x:a.x,
            y:a.y,
            ox:a.ox,
            oy:a.oy,
            curX:a.curX + dx,
            curY:a.curY + dy
        }
    }

    abstract _compute(geometry:PaintGeometry, params:ConnectorComputeParams):void

    resetBounds():void {
        this.bounds = EMPTY_BOUNDS()
    }

    /**
     * Function: findSegmentForPoint
     * Returns the segment that is closest to the given [x,y],
     * null if nothing found.  This function returns a JS
     * object with:
     *
     *   d   -   distance from segment
     *   l   -   proportional location in segment
     *   x   -   x point on the segment
     *   y   -   y point on the segment
     *   s   -   the segment itself.
     */
    findSegmentForPoint (x:number, y:number):SegmentForPoint {

        let out:SegmentForPoint = { d: Infinity, s: null, x: null, y: null, l: null, x1:null, y1:null, x2:null, y2:null, index:null, connectorLocation:null }
        for (let i = 0; i < this.segments.length; i++) {
            let _s = this.segments[i].findClosestPointOnPath(x, y)
            if (_s.d < out.d) {
                out.d = _s.d
                out.l = _s.l
                out.x = _s.x
                out.y = _s.y
                out.s = this.segments[i]
                out.x1 = _s.x1
                out.x2 = _s.x2
                out.y1 = _s.y1
                out.y2 = _s.y2
                out.index = i
                out.connectorLocation = this.segmentProportions[i][0] + (_s.l * (this.segmentProportions[i][1] - this.segmentProportions[i][0]))
            }
        }

        return out
    }

    lineIntersection (x1:number, y1:number, x2:number, y2:number):Array<PointXY> {
        let out:Array<PointXY> = []
        for (let i = 0; i < this.segments.length; i++) {
            out.push.apply(out, this.segments[i].lineIntersection(x1, y1, x2, y2))
        }
        return out
    }

    boxIntersection (x:number, y:number, w:number, h:number):Array<PointXY> {
        let out:Array<PointXY> = []
        for (let i = 0; i < this.segments.length; i++) {
            out.push.apply(out, this.segments[i].boxIntersection(x, y, w, h))
        }
        return out
    }

    boundingBoxIntersection (box:any):Array<PointXY> {
        let out:Array<PointXY> = []
        for (let i = 0; i < this.segments.length; i++) {
            out.push.apply(out, this.segments[i].boundingBoxIntersection(box))
        }
        return out
    }

    _updateSegmentProportions () {
        let curLoc = 0
        for (let i = 0; i < this.segments.length; i++) {
            let sl = this.segments[i].getLength()
            this.segmentProportionalLengths[i] = sl / this.totalLength
            this.segmentProportions[i] = [curLoc, (curLoc += (sl / this.totalLength)) ]
        }
    }

    /**
     * returns [segment, proportion of travel in segment, segment index] for the segment
     * that contains the point which is 'location' distance along the entire path, where
     * 'location' is a decimal between 0 and 1 inclusive. in this connector type, paths
     * are made up of a list of segments, each of which contributes some fraction to
     * the total length.
     * From 1.3.10 this also supports the 'absolute' property, which lets us specify a location
     * as the absolute distance in pixels, rather than a proportion of the total path.
     */
    _findSegmentForLocation (location:number, absolute?:boolean):{segment:Segment, proportion:number, index:number } {

        let idx, i, inSegmentProportion

        if (absolute) {
            location = location > 0 ? location / this.totalLength : (this.totalLength + location) / this.totalLength
        }

        // if location 1 we know its the last segment
        if (location === 1) {
            idx = this.segments.length - 1
            inSegmentProportion = 1
        } else if (location === 0) {
            // if location 0 we know its the first segment
            inSegmentProportion = 0
            idx = 0
        } else {

            // if location >= 0.5, traverse backwards (of course not exact, who knows the segment proportions. but
            // an educated guess at least)
            if (location >= 0.5) {

                idx = 0
                inSegmentProportion = 0
                for (i = this.segmentProportions.length - 1; i > -1; i--) {
                    if (this.segmentProportions[i][1] >= location && this.segmentProportions[i][0] <= location) {
                        idx = i
                        inSegmentProportion = (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i]
                        break
                    }
                }

            } else {
                idx = this.segmentProportions.length - 1
                inSegmentProportion = 1
                for (i = 0; i < this.segmentProportions.length; i++) {
                    if (this.segmentProportions[i][1] >= location) {
                        idx = i
                        inSegmentProportion = (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i]
                        break
                    }
                }
            }
        }

        return { segment: this.segments[idx], proportion: inSegmentProportion, index: idx }
    }

    _addSegment (clazz:Constructable<Segment>, params:any) {
        if (params.x1 === params.x2 && params.y1 === params.y2) {
            return
        }

        let s = (new clazz(params))
        this.segments.push(s)
        this.totalLength += s.getLength()
        this.updateBounds(s)
    }

    _clearSegments () {
        this.totalLength = 0
        this.segments.length = 0
        this.segmentProportions.length = 0
        this.segmentProportionalLengths.length = 0
    }

    getLength ():number {
        return this.totalLength
    }

    private _prepareCompute (params:ConnectorComputeParams):PaintGeometry {
        this.strokeWidth = params.strokeWidth
        let x1 = params.sourcePos.curX,
            x2 = params.targetPos.curX,
            y1 = params.sourcePos.curY,
            y2 = params.targetPos.curY,

            segment = quadrant({x:x1, y:y1}, {x:x2, y:y2}),
            swapX = x2 < x1,
            swapY = y2 < y1,
            so:Orientation = [ params.sourcePos.ox, params.sourcePos.oy ],
            to:Orientation = [ params.targetPos.ox, params.targetPos.oy ],
            x = swapX ? x2 : x1,
            y = swapY ? y2 : y1,
            w = Math.abs(x2 - x1),
            h = Math.abs(y2 - y1)

        // check that a valid orientation exists for both source and target. if one or both lacks an orientation,
        // compute one where missing by deriving it from the element's relative positions. the axis for the derived
        // orientation is the one in which the two elements are further apart. Previously, we'd use this computed
        // orientation for both anchors, but from 5.4.0 we only use it for an anchor that had [0,0]. This results in
        // a better new connection dragging experience when using the flowchart connectors.
        const noSourceOrientation = so[0] === 0 && so[1] === 0
        const noTargetOrientation = to[0] === 0 && to[1] === 0

        if (noSourceOrientation || noTargetOrientation) {
            let index = w > h ? 0 : 1,
                oIndex = [1, 0][index],
                v1 = index === 0 ? x1 : y1,
                v2 = index === 0 ? x2 : y2

            if (noSourceOrientation) {
                so[index] = v1 > v2 ? -1 : 1
                so[oIndex] = 0
            }

            if (noTargetOrientation) {
                to[index] = v1 > v2 ? 1 : -1
                to[oIndex] = 0
            }
        }

        let sx = swapX ? w + (this.sourceGap * so[0]) : this.sourceGap * so[0],
            sy = swapY ? h + (this.sourceGap * so[1]) : this.sourceGap * so[1],
            tx = swapX ? this.targetGap * to[0] : w + (this.targetGap * to[0]),
            ty = swapY ? this.targetGap * to[1] : h + (this.targetGap * to[1]),
            oProduct = ((so[0] * to[0]) + (so[1] * to[1]))

        let result:PaintGeometry = {
            sx: sx, sy: sy, tx: tx, ty: ty,
            xSpan: Math.abs(tx - sx),
            ySpan: Math.abs(ty - sy),
            mx: (sx + tx) / 2,
            my: (sy + ty) / 2,
            so: so, to: to, x: x, y: y, w: w, h: h,
            segment: segment,
            startStubX: sx + (so[0] * this.sourceStub),
            startStubY: sy + (so[1] * this.sourceStub),
            endStubX: tx + (to[0] * this.targetStub),
            endStubY: ty + (to[1] * this.targetStub),
            isXGreaterThanStubTimes2: Math.abs(sx - tx) > (this.sourceStub + this.targetStub),
            isYGreaterThanStubTimes2: Math.abs(sy - ty) > (this.sourceStub + this.targetStub),
            opposite: oProduct === -1,
            perpendicular: oProduct === 0,
            orthogonal: oProduct === 1,
            sourceAxis: so[0] === 0 ? "y" : "x",
            points: [x, y, w, h, sx, sy, tx, ty ],
            stubs:[this.sourceStub, this.targetStub]
        }
        result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular"
        return result
    }

    updateBounds (segment:Segment):void {
        let segBounds = segment.extents
        this.bounds.xmin = Math.min(this.bounds.xmin, segBounds.xmin)
        this.bounds.xmax = Math.max(this.bounds.xmax, segBounds.xmax)
        this.bounds.ymin = Math.min(this.bounds.ymin, segBounds.ymin)
        this.bounds.ymax = Math.max(this.bounds.ymax, segBounds.ymax)
    }

    private dumpSegmentsToConsole ():void {
        log("SEGMENTS:")
        for (let i = 0; i < this.segments.length; i++) {
            log(this.segments[i].type, "" + this.segments[i].getLength(), "" + this.segmentProportions[i])
        }
    }

    pointOnPath (location:number, absolute?:boolean):PointXY {
        let seg = this._findSegmentForLocation(location, absolute)
        return seg.segment && seg.segment.pointOnPath(seg.proportion, false) || {x:0, y:0}
    }

    gradientAtPoint (location:number, absolute?:boolean):number {
        let seg = this._findSegmentForLocation(location, absolute)
        return seg.segment && seg.segment.gradientAtPoint(seg.proportion, false) || 0
    }

    pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY {
        let seg = this._findSegmentForLocation(location, absolute)
        // TODO what happens if this crosses to the next segment?
        return seg.segment && seg.segment.pointAlongPathFrom(seg.proportion, distance, false) || {x:0, y:0}
    }

    compute (params:ConnectorComputeParams):void {
        this.paintInfo = this._prepareCompute(params)
        this._clearSegments()
        this._compute(this.paintInfo, params)
        this.x = this.paintInfo.points[0]
        this.y = this.paintInfo.points[1]
        this.w = this.paintInfo.points[2]
        this.h = this.paintInfo.points[3]
        this.segment = this.paintInfo.segment
        this._updateSegmentProportions()
    }

    //
    // a dummy implementation for subclasses to override if they want to.
    //
    setAnchorOrientation(idx:number, orientation:number[]):void { }
}

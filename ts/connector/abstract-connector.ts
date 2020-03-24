import {isArray, log} from "../util";
import {jsPlumbInstance, PointArray, PointXY, Timestamp, TypeDescriptor} from "../core";
import {EMPTY_BOUNDS, Segment, SegmentBounds} from "./abstract-segment";
import {Endpoint} from "../endpoint/endpoint-impl";
import {ComputedAnchorPosition, Orientation} from "../factory/anchor-factory";
import {PaintStyle} from "../styles";
import {Component, ComponentOptions} from "../component/component";
import {ConnectorRenderer} from "./connector-renderer";
import {Connection} from "./connection-impl";
import {pointXYFromArray, quadrant} from "../geom";

export interface PaintParams<E> {
    sourcePos:PointArray;
    targetPos:PointArray;
    sourceEndpoint:Endpoint<E>;
    targetEndpoint:Endpoint<E>;
    strokeWidth?:number;
}

export type PaintAxis = "y" | "x"

type SegmentForPoint = { d: number, s: Segment, x: number, y: number, l: number, x1:number, y1:number, x2:number, y2:number, index:number, connectorLocation: number };

export type ConnectorComputeParams<E> = {
    sourcePos: ComputedAnchorPosition,
    targetPos: ComputedAnchorPosition,
    sourceOrientation:Orientation,
    targetOrientation:Orientation,
    sourceEndpoint: Endpoint<E>,
    targetEndpoint: Endpoint<E>,
    strokeWidth: number,
    sourceInfo: any,
    targetInfo: any
}

export interface PaintGeometry {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    lw: number;
    xSpan: number;
    ySpan: number;
    mx: number;
    my: number;
    so: Orientation;
    to: Orientation;
    x: number;
    y: number;
    w: number;
    h: number;
    segment: number;
    startStubX: number;
    startStubY: number;
    endStubX: number;
    endStubY: number;
    isXGreaterThanStubTimes2: boolean;
    isYGreaterThanStubTimes2: boolean;
    opposite: boolean;
    perpendicular: boolean;
    orthogonal: boolean;
    sourceAxis: PaintAxis;
    points: [ number, number, number, number, number, number, number, number ];
    stubs:[number, number];
    anchorOrientation?:string;
}

export interface AbstractConnectorOptions <E> extends ComponentOptions<E> {
    stub?:number;
    gap?:number;
}

export abstract class AbstractConnector<E> {

    abstract type:string;

    stub:number;
    sourceStub:number;
    targetStub:number;
    maxStub:number;

    typeId:string;

    gap:number;
    sourceGap:number;
    targetGap:number;
    segments:Array<Segment> = [];
    totalLength:number = 0;
    segmentProportions:Array<[number,number]> = [];
    segmentProportionalLengths:Array<number> = [];
    private paintInfo:PaintGeometry = null;
    strokeWidth:number;
    x:number;
    y:number;
    w:number;
    h:number;
    segment:number;
    bounds:SegmentBounds = EMPTY_BOUNDS();
    cssClass:string;

    constructor(public instance:jsPlumbInstance<E>, public connection:Connection<E>, params:AbstractConnectorOptions<E>) {
        this.stub = params.stub || 0;
        this.sourceStub = isArray(this.stub) ? this.stub[0] : this.stub;
        this.targetStub = isArray(this.stub) ? this.stub[1] : this.stub;
        this.gap = params.gap || 0;
        this.sourceGap = isArray(this.gap) ? this.gap[0] : this.gap;
        this.targetGap = isArray(this.gap) ? this.gap[1] : this.gap;
        this.maxStub = Math.max(this.sourceStub, this.targetStub);
        this.cssClass = params.cssClass || "";
    }

    getTypeDescriptor ():string {
        return "connector";
    }
    
    getIdPrefix () { return  "_jsplumb_connector"; }

    abstract _compute(geometry:PaintGeometry, params:ConnectorComputeParams<E>):void;

    resetBounds():void {
        this.bounds = EMPTY_BOUNDS();
    }

    getPathData ():any {
        let p = "";
        for (let i = 0; i < this.segments.length; i++) {
            p += this.instance.renderer.getPath(this.segments[i], i === 0);
            p += " ";
        }
        return p;
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

        let out:SegmentForPoint = { d: Infinity, s: null, x: null, y: null, l: null, x1:null, y1:null, x2:null, y2:null, index:null, connectorLocation:null };
        for (let i = 0; i < this.segments.length; i++) {
            let _s = this.segments[i].findClosestPointOnPath(x, y);
            if (_s.d < out.d) {
                out.d = _s.d;
                out.l = _s.l;
                out.x = _s.x;
                out.y = _s.y;
                out.s = this.segments[i];
                out.x1 = _s.x1;
                out.x2 = _s.x2;
                out.y1 = _s.y1;
                out.y2 = _s.y2;
                out.index = i;
                out.connectorLocation = this.segmentProportions[i][0] + (_s.l * (this.segmentProportions[i][1] - this.segmentProportions[i][0]));
            }
        }

        return out;
    }

    lineIntersection (x1:number, y1:number, x2:number, y2:number):Array<PointArray> {
        let out:Array<PointArray> = [];
        for (let i = 0; i < this.segments.length; i++) {
            out.push.apply(out, this.segments[i].lineIntersection(x1, y1, x2, y2));
        }
        return out;
    }

    boxIntersection (x:number, y:number, w:number, h:number):Array<PointArray> {
        let out:Array<PointArray> = [];
        for (let i = 0; i < this.segments.length; i++) {
            out.push.apply(out, this.segments[i].boxIntersection(x, y, w, h));
        }
        return out;
    }

    boundingBoxIntersection (box:any):Array<PointArray> {
        let out:Array<PointArray> = [];
        for (let i = 0; i < this.segments.length; i++) {
            out.push.apply(out, this.segments[i].boundingBoxIntersection(box));
        }
        return out;
    }

    _updateSegmentProportions () {
        let curLoc = 0;
        for (let i = 0; i < this.segments.length; i++) {
            let sl = this.segments[i].getLength();
            this.segmentProportionalLengths[i] = sl / this.totalLength;
            this.segmentProportions[i] = [curLoc, (curLoc += (sl / this.totalLength)) ];
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
        if (absolute) {
            location = location > 0 ? location / this.totalLength : (this.totalLength + location) / this.totalLength;
        }

        // TODO here we could be smarter. if location === 0, then obviously its the first segment, proportion 0. if
        // segment === 1, then last segment, proportion 1.  if it's more than 0.5 should we not start from the end?
        // etc.

        let idx = this.segmentProportions.length - 1, inSegmentProportion = 1;
        for (let i = 0; i < this.segmentProportions.length; i++) {
            if (this.segmentProportions[i][1] >= location) {
                idx = i;
                // todo is this correct for all connector path types?
                inSegmentProportion = location === 1 ? 1 : location === 0 ? 0 : (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i];
                break;
            }
        }
        return { segment: this.segments[idx], proportion: inSegmentProportion, index: idx };
    }

    _addSegment (clazz:any, params:any) {
        if (params.x1 === params.x2 && params.y1 === params.y2) {
            return;
        }

        let s = (new clazz(this.instance, params)) as Segment;

        this.segments.push(s);

        this.totalLength += s.getLength();

        this.updateBounds(s);
    }

    _clearSegments () {
        this.totalLength = 0;
        this.segments.length = 0;
        this.segmentProportions.length = 0;
        this.segmentProportionalLengths.length = 0;
    }

    getLength ():number {
        return this.totalLength;
    }

    private _prepareCompute (params:ConnectorComputeParams<E>):PaintGeometry {
        this.strokeWidth = params.strokeWidth;
        let segment = quadrant(pointXYFromArray(params.sourcePos), pointXYFromArray(params.targetPos)),
            swapX = params.targetPos[0] < params.sourcePos[0],
            swapY = params.targetPos[1] < params.sourcePos[1],
            lw = params.strokeWidth || 1,
            so:Orientation = params.sourceEndpoint.anchor.getOrientation(params.sourceEndpoint),
            to:Orientation = params.targetEndpoint.anchor.getOrientation(params.targetEndpoint),
            x = swapX ? params.targetPos[0] : params.sourcePos[0],
            y = swapY ? params.targetPos[1] : params.sourcePos[1],
            w = Math.abs(params.targetPos[0] - params.sourcePos[0]),
            h = Math.abs(params.targetPos[1] - params.sourcePos[1]);

        // if either anchor does not have an orientation set, we derive one from their relative
        // positions.  we fix the axis to be the one in which the two elements are further apart, and
        // point each anchor at the other element.  this is also used when dragging a new connection.
        if (so[0] === 0 && so[1] === 0 || to[0] === 0 && to[1] === 0) {
            let index = w > h ? 0 : 1, oIndex = [1, 0][index];
            so = [0,0];
            to = [0,0];
            so[index] = params.sourcePos[index] > params.targetPos[index] ? -1 : 1;
            to[index] = params.sourcePos[index] > params.targetPos[index] ? 1 : -1;
            so[oIndex] = 0;
            to[oIndex] = 0;
        }

        let sx = swapX ? w + (this.sourceGap * so[0]) : this.sourceGap * so[0],
            sy = swapY ? h + (this.sourceGap * so[1]) : this.sourceGap * so[1],
            tx = swapX ? this.targetGap * to[0] : w + (this.targetGap * to[0]),
            ty = swapY ? this.targetGap * to[1] : h + (this.targetGap * to[1]),
            oProduct = ((so[0] * to[0]) + (so[1] * to[1]));

        let result:PaintGeometry = {
            sx: sx, sy: sy, tx: tx, ty: ty, lw: lw,
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
        };
        result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular";
        return result;
    }

    getSegments ():Array<Segment> {
        return this.segments;
    }

    updateBounds (segment:Segment):void {
        let segBounds = segment.getBounds();
        this.bounds.minX = Math.min(this.bounds.minX, segBounds.minX);
        this.bounds.maxX = Math.max(this.bounds.maxX, segBounds.maxX);
        this.bounds.minY = Math.min(this.bounds.minY, segBounds.minY);
        this.bounds.maxY = Math.max(this.bounds.maxY, segBounds.maxY);
    }

    private dumpSegmentsToConsole ():void {
        log("SEGMENTS:");
        for (let i = 0; i < this.segments.length; i++) {
            log(this.segments[i].type, "" + this.segments[i].getLength(), "" + this.segmentProportions[i]);
        }
    }

    pointOnPath (location:number, absolute?:boolean):PointXY {
        let seg = this._findSegmentForLocation(location, absolute);
        return seg.segment && seg.segment.pointOnPath(seg.proportion, false) || {x:0, y:0};
    }

    gradientAtPoint (location:number, absolute?:boolean):number {
        let seg = this._findSegmentForLocation(location, absolute);
        return seg.segment && seg.segment.gradientAtPoint(seg.proportion, false) || 0;
    }

    pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY {
        let seg = this._findSegmentForLocation(location, absolute);
        // TODO what happens if this crosses to the next segment?
        return seg.segment && seg.segment.pointAlongPathFrom(seg.proportion, distance, false) || {x:0, y:0};
    }

    compute (params:ConnectorComputeParams<E>):void {
        this.paintInfo = this._prepareCompute(params);
        this._clearSegments();
        this._compute(this.paintInfo, params);
        this.x = this.paintInfo.points[0];
        this.y = this.paintInfo.points[1];
        this.w = this.paintInfo.points[2];
        this.h = this.paintInfo.points[3];
        this.segment = this.paintInfo.segment;
        this._updateSegmentProportions();
    }
    getAttachedElements(): Array<Component<E>> {
        return [];
    }

    setHover(hover: boolean, ignoreAttachedElements?: boolean, timestamp?: Timestamp): void {
        //this.renderer.setHover(hover);
    }

    setVisible(v: boolean): any {
        //return this.renderer.setVisible(v);
    }

    applyType(t:TypeDescriptor) {
        //this.renderer.applyType(t);
    }

    addClass(clazz:string) {
        //this.renderer.addClass(clazz);
    }

    removeClass(clazz:string) {
        //this.renderer.removeClass(clazz);
    }

    getClass():string {
        return "";
        //return this.renderer.getClass();
    }

    cleanup(force?:boolean) {
        if (force || this.typeId == null) {
            //this.renderer.cleanup(force);
        }
    }

    destroy(force?:boolean) {
        if (force || this.typeId == null) {
            //this.renderer.destroy(force);
        }
    }
}

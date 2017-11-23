import {Bounds} from "../component/abstract-component";
import {isArray} from "../util/_is";
import {Segment} from "./segment";
import {JsPlumb} from "../core";
import {UIComponent} from "../component/ui-component";
import {ConnectorRenderer} from "../renderer/ConnectorRenderer";
import {SegmentRenderer} from "./segment-renderer";

// TODO Biltong should be ts
declare var Biltong:any;

export abstract class Connector<EventType, ElementType> extends UIComponent<EventType, ElementType> {

    static map:Map<string, Connector<any, any>> = new Map();


    /**
     * @override
     * @returns {string}
     */
    getTypeDescriptor(): string {
        return "connector";
    }


    /**
     * @override
     * @param event
     * @param value
     * @param originalEvent
     * @returns {boolean}
     */
    shouldFireEvent(event: string, value: any, originalEvent?: EventType): Boolean {
        return true;
    }

    bounds:Bounds;
    segments:Array<Segment> = [];
    totalLength:number = 0;
    segmentProportions:Array<Array<number>> = [];
    segmentProportionalLengths:Array<number> = [];
    stub:number;
    sourceStub:number;
    targetStub:number;
    gap :number;
    sourceGap:number;
    targetGap:number;
    userProvidedSegments:Array<any> | null = null;
    paintInfo:any = null;
    geometry:any = null;
    strokeWidth:number;
    segment:Segment;

    renderer:ConnectorRenderer;

    idPrefix:string = "_jsplumb_connector";

    abstract type:string;

    //
    // it isnt the greatest that this is here, it's because `paint` is in UIComponent,
    // and Connector extends UIComponent. of course we want to paint a Connector but in
    // fact the paint method should be on some specific renderer, like a DOM SVG renderer.
    // prior to TS, we had a nice multiple inheritance/mixin mechanism for this. TS has
    // a mixin thing but it doesn't look pretty. they should support Traits.
    //
    paint(style:any, anchor:any, extents:any):void {
        this.renderer.paint(style, anchor, extents)
    }

    repaint(params?: any): void { }

    constructor(params:any) {
        super(params);
        this.stub = params.stub || 0;
        this.sourceStub = isArray(this.stub) ? this.stub[0] : this.stub;
        this.targetStub = isArray(this.stub) ? this.stub[1] : this.stub;

        this.gap = params.gap || 0;
        this.sourceGap = isArray(this.gap) ? this.gap[0] : this.gap;
        this.targetGap = isArray(this.gap) ? this.gap[1] : this.gap;

        this.resetBounds();
        this.renderer = this.instance.viewAdapter.createConnectorRenderer(JsPlumb.extend(params, {connector:this}));
        this.canvas = this.renderer.canvas;
        this.bgCanvas = this.renderer.bgCanvas;
    }

    resetBounds () {
        this.bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    }

    setGeometry(g:any, internallyComputed:boolean):void {
        this.geometry = g;
    }

    getGeometry():any {
        return this.geometry;
    }

    getPathData():string {
        let p = "";
        for (let i = 0; i < this.segments.length; i++) {
            p += SegmentRenderer.getPath(this.segments[i]);
            p += " ";
        }
        return p;
    }

    findSegmentForPoint(x:number, y:number) {
        let out:any = { d: Infinity, s: null, x: null, y: null, l: null, x1:null, x2:null, y1:null, y2:null, index:null };
        for (let i = 0; i < this.segments.length; i++) {
            let _s = this.segments[i].findClosestPointOnPath(x, y);
            if (_s.distance < out.d) {
                out.d = _s.distance;
                out.l = _s.location;
                out.x = _s.x;
                out.y = _s.y;
                out.s = this.segments[i];
                out.x1 = _s.x1;
                out.x2 = _s.x2;
                out.y1 = _s.y1;
                out.y2 = _s.y2;
                out.index = i;
            }
        }

        return out;
    }

    setSegments(_segs:Array<any>) {
        this.userProvidedSegments = [];
        this.totalLength = 0;
        for (let i = 0; i < _segs.length; i++) {
            this.userProvidedSegments.push(_segs[i]);
            this.totalLength += _segs[i].getLength();
        }
    }


    getLength () {
        return this.totalLength;
    }

    private _updateSegmentProportions() {
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
    private _findSegmentForLocation(location:number, absolute?:Boolean):any {
        if (absolute) {
            location = location > 0 ? location / this.totalLength : (this.totalLength + location) / this.totalLength;
        }
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

    protected _addSegment(conn:Connector<EventType, ElementType>, segmentType:string, params:any) {
        if (params.x1 === params.x2 && params.y1 === params.y2) {
            return;
        }
        let s = SegmentRenderer.createSegment(segmentType, params);
        this.segments.push(s);
        this.totalLength += s.getLength();
        conn.updateBounds(s);
    }

    private _clearSegments() {
        this.totalLength = this.segments.length = this.segmentProportions.length = this.segmentProportionalLengths.length = 0;
    }

    private _prepareCompute(params:any) {
        this.strokeWidth = params.strokeWidth;
        let segment = Biltong.quadrant(params.sourcePos, params.targetPos),
            swapX = params.targetPos[0] < params.sourcePos[0],
            swapY = params.targetPos[1] < params.sourcePos[1],
            lw = params.strokeWidth || 1,
            so = params.sourceEndpoint.anchor.getOrientation(params.sourceEndpoint),
            to = params.targetEndpoint.anchor.getOrientation(params.targetEndpoint),
            x = swapX ? params.targetPos[0] : params.sourcePos[0],
            y = swapY ? params.targetPos[1] : params.sourcePos[1],
            w = Math.abs(params.targetPos[0] - params.sourcePos[0]),
            h = Math.abs(params.targetPos[1] - params.sourcePos[1]);

        // if either anchor does not have an orientation set, we derive one from their relative
        // positions.  we fix the axis to be the one in which the two elements are further apart, and
        // point each anchor at the other element.  this is also used when dragging a new connection.
        if (so[0] === 0 && so[1] === 0 || to[0] === 0 && to[1] === 0) {
            let index = w > h ? 0 : 1, oIndex = [1, 0][index];
            so = [];
            to = [];
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

        let result = {
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
            anchorOrientation:""
        };
        result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular";
        return result;
    }

    getSegments() {
        return this.segments;
    }

    updateBounds(segment:Segment) {
        let segBounds = segment.getBounds();
        this.bounds.minX = Math.min(this.bounds.minX, segBounds.minX);
        this.bounds.maxX = Math.max(this.bounds.maxX, segBounds.maxX);
        this.bounds.minY = Math.min(this.bounds.minY, segBounds.minY);
        this.bounds.maxY = Math.max(this.bounds.maxY, segBounds.maxY);
    }

    pointOnPath(location:number, absolute?:Boolean) {
        let seg = this._findSegmentForLocation(location, absolute);
        return seg.segment && seg.segment.pointOnPath(seg.proportion, false) || [0, 0];
    }

    gradientAtPoint(location:number, absolute?:Boolean) {
        let seg = this._findSegmentForLocation(location, absolute);
        return seg.segment && seg.segment.gradientAtPoint(seg.proportion, false) || 0;
    }

    pointAlongPathFrom(location:number, distance:number, absolute?:Boolean) {
        let seg = this._findSegmentForLocation(location, absolute);
        // TODO what happens if this crosses to the next segment?
        return seg.segment && seg.segment.pointAlongPathFrom(seg.proportion, distance, false) || [0, 0];
    }

    compute(params:any) {
        this.paintInfo = this._prepareCompute.call(this, params);

        this._clearSegments();
        this._compute(this.paintInfo, params);
        this.x = this.paintInfo.points[0];
        this.y = this.paintInfo.points[1];
        this.w = this.paintInfo.points[2];
        this.h = this.paintInfo.points[3];
        this.segment = this.paintInfo.segment;
        this._updateSegmentProportions();
    }

    abstract _compute(paintInfo:any, params?:any):void;
}

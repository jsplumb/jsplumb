import {BoundingBox, PointXY} from "../common"

export interface SegmentParams {
    x1:number
    x2:number
    y1:number
    y2:number
}

export type PointNearPath = {
    s?:Segment
    d:number
    x:number
    y:number
    l:number
    x1:number
    x2:number
    y1:number
    y2:number
}

function noSuchPoint():PointNearPath {
    return {
        d: Infinity,
        x: null,
        y: null,
        l: null,
        x1:null,
        y1:null,
        x2:null,
        y2:null
    }
}

export type SegmentBounds = {
    minX: number
    minY: number
    maxX: number
    maxY: number
}

export function EMPTY_BOUNDS():SegmentBounds { return  { minX:Infinity, maxX:-Infinity, minY:Infinity, maxY:-Infinity }; }

export interface Segment {

    x1:number
    x2:number
    y1:number
    y2:number

    type:string

    getBounds ():SegmentBounds
    lineIntersection (x1:number, y1:number, x2:number, y2:number):Array<PointXY>
    boxIntersection (x:number, y:number, w:number, h:number):Array<PointXY>
    boundingBoxIntersection (box:BoundingBox):Array<PointXY>
    getLength():number
    pointOnPath (location:number, absolute?:boolean):PointXY
    gradientAtPoint (location:number, absolute?:boolean):number
    pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY
    findClosestPointOnPath (x:number, y:number):PointNearPath
}

export abstract class AbstractSegment implements Segment {

    x1:number
    x2:number
    y1:number
    y2:number

    protected bounds:SegmentBounds

    abstract type:string
    abstract getLength():number
    abstract pointOnPath (location:number, absolute?:boolean):PointXY
    abstract gradientAtPoint (location:number, absolute?:boolean):number
    abstract pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY

    constructor(protected params:SegmentParams) {

        this.x1 = params.x1
        this.y1 = params.y1
        this.x2 = params.x2
        this.y2 = params.y2
    }

    getBounds ():SegmentBounds {
        return this.bounds
    }

    /**
     * Function: findClosestPointOnPath
     * Finds the closest point on this segment to the given [x, y],
     * returning both the x and y of the point plus its distance from
     * the supplied point, and its location along the length of the
     * path inscribed by the segment.  This implementation returns
     * Infinity for distance and null values for everything else
     * subclasses are expected to override.
     */
    findClosestPointOnPath (x:number, y:number):PointNearPath {
        return noSuchPoint()
    }

    /**
     * Computes the list of points on the segment that intersect the given line.
     * @method lineIntersection
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {Array<PointXY>}
     */
    lineIntersection (x1:number, y1:number, x2:number, y2:number):Array<PointXY> {
        return []
    }

    /**
     * Computes the list of points on the segment that intersect the box with the given origin and size.
     * @method boxIntersection
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {Array<PointXY>}
     */
    boxIntersection (x:number, y:number, w:number, h:number):Array<PointXY> {
        let a:Array<PointXY> = []
        a.push.apply(a, this.lineIntersection(x, y, x + w, y))
        a.push.apply(a, this.lineIntersection(x + w, y, x + w, y + h))
        a.push.apply(a, this.lineIntersection(x + w, y + h, x, y + h))
        a.push.apply(a, this.lineIntersection(x, y + h, x, y))
        return a
    }

    /**
     * Computes the list of points on the segment that intersect the given bounding box, which is an object of the form { x:.., y:.., w:.., h:.. }.
     * @method lineIntersection
     * @param {BoundingBox} box
     * @returns {Array<[number, number]>}
     */
    boundingBoxIntersection (box:BoundingBox):Array<PointXY> {
        return this.boxIntersection(box.x, box.y, box.w, box.h)
    }
}

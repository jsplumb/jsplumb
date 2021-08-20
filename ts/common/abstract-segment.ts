import {Extents , BoundingBox, PointXY} from "@jsplumb/util"

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

export function EMPTY_BOUNDS():Extents { return  { xmin:Infinity, xmax:-Infinity, ymin:Infinity, ymax:-Infinity }; }

/**
 * Definition of a segment.
 * @private
 */
export interface Segment {

    x1:number
    x2:number
    y1:number
    y2:number

    type:string

    extents:Extents
    lineIntersection (x1:number, y1:number, x2:number, y2:number):Array<PointXY>
    boxIntersection (x:number, y:number, w:number, h:number):Array<PointXY>
    boundingBoxIntersection (box:BoundingBox):Array<PointXY>
    getLength():number
    pointOnPath (location:number, absolute?:boolean):PointXY
    gradientAtPoint (location:number, absolute?:boolean):number
    pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY
    findClosestPointOnPath (x:number, y:number):PointNearPath

    getPath(isFirstSegment:boolean):string
}

/**
 * Base class for segments in connectors.
 *
 * @private
 */
export abstract class AbstractSegment implements Segment {

    x1:number
    x2:number
    y1:number
    y2:number

    extents:Extents = EMPTY_BOUNDS()

    abstract type:string
    abstract getLength():number
    abstract pointOnPath (location:number, absolute?:boolean):PointXY
    abstract gradientAtPoint (location:number, absolute?:boolean):number
    abstract pointAlongPathFrom (location:number, distance:number, absolute?:boolean):PointXY
    abstract getPath(isFirstSegment:boolean):string

    constructor(protected params:SegmentParams) {

        this.x1 = params.x1
        this.y1 = params.y1
        this.x2 = params.x2
        this.y2 = params.y2
    }

    /**
     * Finds the closest point on this segment to the given [x, y], returning both the x and y of the point plus its distance from
     * the supplied point, and its location along the length of the path inscribed by the segment.  This implementation returns
     * Infinity for distance and null values for everything else subclasses are expected to override.
     * @param x X location to find closest point to
     * @param y Y location to find closest point to
     */
    findClosestPointOnPath (x:number, y:number):PointNearPath {
        return noSuchPoint()
    }

    /**
     * Computes the list of points on the segment that intersect the given line.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {Array<PointXY>}
     */
    lineIntersection (x1:number, y1:number, x2:number, y2:number):Array<PointXY> {
        return []
    }

    /**
     * Computes the list of points on the segment that intersect the box with the given origin and size.
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @return {Array<PointXY>}
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
     * @param {BoundingBox} box
     * @return {Array<PointXY>}
     */
    boundingBoxIntersection (box:BoundingBox):Array<PointXY> {
        return this.boxIntersection(box.x, box.y, box.w, box.h)
    }
}

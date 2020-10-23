import {PointArray} from "./common"
import {EventGenerator} from "./event-generator"
import { getsert } from './util'

export interface ViewportElementBase {
    x:number
    y:number
    w:number
    h:number
    r:number
    c:PointArray
    x2:number
    y2:number
}

export interface ViewportElement extends ViewportElementBase {
    t:TranslatedViewportElement
}

export interface TranslatedViewportElement extends ViewportElementBase {
    cr:number
    sr:number
}

function EMPTY_POSITION ():ViewportElement {
    return { x:0, y:0, w:0, h:0, r:0, c:[0,0], x2:0, y2:0, t:{x:0, y:0, c:[0,0], w:0, h:0, r:0, x2:0, y2:0, cr:0, sr:0 } }
}

//
// rotate the given rectangle around its center, and return the new bounds, plus new center.
//
function rotate(x:number, y:number, w:number, h:number, r:number):TranslatedViewportElement {

    const center=[x + (w/2),y + (h/2)],
        cr = Math.cos(r / 360 * Math.PI * 2), sr = Math.sin(r / 360 * Math.PI * 2),
        _point = (x:number, y:number):PointArray => {
            return [
                center[0] + Math.round( ((x-center[0])*cr) - ( (y-center[1]) * sr) ),
                center[1] + Math.round( ((y-center[1])*cr) - ( (x-center[0]) * sr) )
            ];
        }

    const p1 = _point(x, y),
        p2 = _point(x+w, y),
        p3 = _point(x+w, y+h),
        p4 = _point(x, y+h),
        c = _point(x + (w/2), y + (h/2))

    const xmin = Math.min(p1[0], p2[0], p3[0], p4[0]),
        xmax = Math.max(p1[0], p2[0], p3[0], p4[0]),
        ymin = Math.min(p1[1], p2[1], p3[1], p4[1]),
        ymax = Math.max(p1[1], p2[1], p3[1], p4[1])

    return {
        x:xmin,
        y:ymin,
        w:xmax - xmin,
        h:ymax - ymin,
        c:c,
        r:r,
        x2:xmax,
        y2:ymax,
        cr:cr,
        sr:sr
    }
}

const entryComparator = (value:[string, any], arrayEntry:[string, any], sortDescending?:boolean) => {

    let c = 0

    if (arrayEntry[1] > value[1]) {
        c = -1
    } else if (arrayEntry[1] < value[1]) {
        c = 1
    }

    if (sortDescending) {
        c *= -1
    }

    return c
}

function insertSorted<T>(value:[string, T], array:Array<[string, T]>, comparator:any, sortDescending?:boolean) {

    if (array.length === 0) {
        array.push(value)
    } else {

        let min = 0
        let max = array.length
        let index = Math.floor((min + max) / 2)
        while (max > min) {
            if (comparator(value, array[index], sortDescending) < 0) {
                max = index
            } else {
                min = index + 1
            }
            index = Math.floor((min + max) / 2)
        }

        array.splice(index, 0, value)
    }
}

export class Viewport extends EventGenerator {

// --------------- PRIVATE  ------------------------------------------

    private _eventsSuspended:boolean = false

    //
    // this map contains sorted positions for each element, split into the two axes.
    // the `xmin` array contains a list of [ id, x ] entries, sorted by `x` in ascending order. `xmax` is
    // the same, but in descending order, but for max, and the y*** arrays do the same thing for the y axis.

    // so to get the bounds at any point you just need to get the first element from each of these
    // arrays.
    //
    _sortedElements:Record<string, Array<[string, number]>> = {
        xmin:[],
        xmax:[],
        ymin:[],
        ymax:[]
    }

    _elementMap:Map<string, ViewportElement> = new Map()
    _transformedElementMap:Map<string, TranslatedViewportElement> = new Map()

    _bounds:Record<string, number> = {
        minx:0,
        maxx:0,
        miny:0,
        maxy:0
    };

    private _clearElementIndex(id:string, array:Array<any>) {
        const idx = array.findIndex((entry) => {
            return entry[0] === id
        })
        if (idx > -1) {
            array.splice(idx, 1)
        }
    }

    private static _updateElementIndex<T>(id:string, value:T, array:Array<[string, T]>, sortDescending?:boolean) {
        insertSorted([id, value], array, entryComparator, sortDescending)
    }

    private _fireUpdate(payload?:any) {
        this.fire("update", payload || {})
    }

    private _updateBounds (id:string, updatedElement:any) {
        if (updatedElement != null) {

            this._clearElementIndex(id, this._sortedElements.xmin)
            this._clearElementIndex(id, this._sortedElements.xmax)
            this._clearElementIndex(id, this._sortedElements.ymin)
            this._clearElementIndex(id, this._sortedElements.ymax)

            Viewport._updateElementIndex(id, updatedElement.t.x, this._sortedElements.xmin, false)
            Viewport._updateElementIndex(id, updatedElement.t.x + updatedElement.t.w, this._sortedElements.xmax, true)
            Viewport._updateElementIndex(id, updatedElement.t.y, this._sortedElements.ymin, false)
            Viewport._updateElementIndex(id, updatedElement.t.y + updatedElement.t.h, this._sortedElements.ymax, true)

            this._recalculateBounds()

        } else {
            // a full update?
        }
    };

    private _recalculateBounds () {
        this._bounds.minx = this._sortedElements.xmin.length > 0 ? this._sortedElements.xmin[0][1] : 0
        this._bounds.maxx = this._sortedElements.xmax.length > 0 ? this._sortedElements.xmax[0][1] : 0
        this._bounds.miny = this._sortedElements.ymin.length > 0 ? this._sortedElements.ymin[0][1] : 0
        this._bounds.maxy = this._sortedElements.ymax.length > 0 ? this._sortedElements.ymax[0][1] : 0
    }


    private _finaliseUpdate (id:string, e:ViewportElement) {
        e.t = rotate(e.x, e.y, e.w, e.h, e.r)
        this._transformedElementMap.set(id, e.t)

        this._updateBounds(id, e)
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return !this._eventsSuspended
    }

// ---------------------- PUBLIC -----------------------------

    startTransaction() {
        this._eventsSuspended = true
    }

    endTransaction(doNotFireUpdate?:boolean) {
        this._eventsSuspended = false
        if (!doNotFireUpdate) {
            this._fireUpdate()
        }
    }

    updateElements (entries:Array<{id:string, x:number, y:number, width:number, height:number, rotation:number}>) {
        this.startTransaction()
        entries.forEach((e) => this.updateElement(e.id, e.x, e.y, e.width, e.height, e.rotation))
        this.endTransaction()
    }

    /**
     * Updates the element with the given id. Any of the provided values may be null, in which case they are ignored (we never overwrite an
     * existing value with null).
     * @param id
     * @param x
     * @param y
     * @param width
     * @param height
     * @param rotation
     */
    updateElement (id:string, x:number, y:number, width:number, height:number, rotation:number):ViewportElement {

        const e = getsert(this._elementMap, id, EMPTY_POSITION)

        if (x != null) {
            e.x = x
        }

        if (y != null) {
            e.y = y
        }

        if (width != null) {
            e.w = width
        }
        if (height != null) {
            e.h = height
        }

        if (rotation != null) {
            e.r = rotation || 0
        }

        e.c[0] = e.x + (e.w / 2)
        e.c[1] = e.y + (e.h / 2)

        e.x2 = e.x + e.w
        e.y2 = e.y + e.h

        this._finaliseUpdate(id, e)

        return e
    }

    /**
     * Creates an empty entry for an element with the given ID.
     * @param id
     */
    registerElement(id:string):ViewportElement {
        return this.updateElement(id, 0, 0, 0, 0, 0)
    }

    /**
     * Adds the element with the given id, with the given values for x, y, width, height and rotation. Any of these may be null.
     * @param id
     * @param x
     * @param y
     * @param width
     * @param height
     * @param rotation
     */
    addElement (id:string, x:number, y:number, width:number, height:number, rotation:number):ViewportElement {
        return this.updateElement(id, x, y, width, height, rotation)
    }

    /**
     * Rotates the element with the given id, recalculating bounds afterwards.
     * @param id
     * @param rotation
     */
    rotateElement (id:string, rotation:number):ViewportElement {

        const e = getsert(this._elementMap, id, EMPTY_POSITION)
        e.r = rotation || 0
        this._finaliseUpdate(id, e)
        //this._fireUpdate({type:"rotate", id:id, rotation:e.r})
        return e
    }

    /**
     * Gets the width of the content managed by the viewport, taking any rotated elements into account.
     */
    getBoundsWidth ():number {
        return this._bounds.maxx - this._bounds.minx
    }

    /**
     * Gets the height of the content managed by the viewport, taking any rotated elements into account.
     */
    getBoundsHeight():number {
        return this._bounds.maxy - this._bounds.miny
    }

    /**
     * Gets the leftmost point of the content managed by the viewport, taking any rotated elements into account.
     */
    getX():number {
        return this._bounds.minx
    }

    /**
     * Gets the topmost of the content managed by the viewport, taking any rotated elements into account.
     */
    getY():number {
        return this._bounds.miny
    }

    /**
     * Sets the size of the element with the given ID, recalculating bounds.
     * @param id
     * @param w
     * @param h
     */
    setSize (id:string, w:number, h:number):ViewportElement {
        if (this._elementMap.has(id)) {
            return this.updateElement(id, null, null, w, h, null)
        }
    }

    /**
     * Sets the [x,y] position of the element with the given ID, recalculating bounds.
     * @param id
     * @param x
     * @param y
     */
    setPosition(id:string, x:number, y:number):ViewportElement {
        if (this._elementMap.has(id)) {
            return this.updateElement(id, x, y, null, null, null)
        }
    }

    /**
     * Clears the internal state of the viewport, removing all elements.
     */
    reset () {
        this._sortedElements.xmin.length = 0
        this._sortedElements.xmax.length = 0
        this._sortedElements.ymin.length = 0
        this._sortedElements.ymax.length = 0
        this._elementMap.clear()
        this._transformedElementMap.clear()
        this._recalculateBounds()
    }

    /**
     * Remove the element with the given ID from the viewport.
     * @param id
     */
    remove (id:string) {

        this._clearElementIndex(id, this._sortedElements.xmin)
        this._clearElementIndex(id, this._sortedElements.xmax)
        this._clearElementIndex(id, this._sortedElements.ymin)
        this._clearElementIndex(id, this._sortedElements.ymax)

        this._elementMap.delete(id)
        this._transformedElementMap.delete(id)

        this._recalculateBounds()
    }

    /**
     * Gets the position of the element. This returns both the original position, and also the translated position of the element. Certain internal methods, such as the anchor
     * calculation code, use the unrotated position and then subsequently apply the element's rotation to any calculated positions.
     * Other parts of the codebase - the Toolkit's magnetizer or pan/zoom widget, for instance - are interested in the rotated position.
     * @param id
     */
    getPosition (id:string):ViewportElement {
        return this._elementMap.get(id)
    }

    /**
     * Get all elements managed by the Viewport.
     */
    getElements():Map<string, ViewportElement> {
        return this._elementMap
    }

    /**
     * Returns whether or not the viewport is empty.
     */
    isEmpty () {
        return this._elementMap.size === 0
    }
}

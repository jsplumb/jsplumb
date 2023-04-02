
import {JsPlumbInstance} from "./core"
import {EventGenerator} from "../util/event-generator"
import {findWithFunction, forEach, getsert, insertSorted, PointXY, Size} from "../util/util"

/**
 * Definition of some element's location and rotation in the viewport.
 * @public
 */
export interface ViewportPosition extends PointXY {
    w:number
    h:number
    r:number
    c:PointXY
}

/**
 * @internal
 */
export interface ViewportElementBase<E> extends ViewportPosition {
    x2:number
    y2:number
    dirty:boolean
}

/**
 * @internal
 */
export interface ViewportElement<E> extends ViewportElementBase<E> {
    t:TranslatedViewportElement<E>
}

/**
 * @internal
 */
export interface TranslatedViewportElementBase<E> extends ViewportElementBase<E> {
    cr:number
    sr:number
}

// use Omit once we can upgrade past ~3.4.0
export type TranslatedViewportElement<E> = Omit<TranslatedViewportElementBase<E>, "dirty">
// export type TranslatedViewportElement<E> = Pick<TranslatedViewportElementBase<E>, Exclude<keyof TranslatedViewportElementBase<E>, "dirty">>

/**
 * Captures a set of elements affected by some given operation. For internal use.
 * @internal
 */
class Transaction {
    affectedElements:Set<string> = new Set()
}

/**
 * @internal
 * @constructor
 */
function EMPTY_POSITION<E>():ViewportElement<E> {
    return { x:0, y:0, w:0, h:0, r:0, c:{x:0,y:0}, x2:0, y2:0, t:{x:0, y:0, c:{x:0,y:0}, w:0, h:0, r:0, x2:0, y2:0, cr:0, sr:0 }, dirty:true }
}

/**
 * rotate the given rectangle around its center, and return the new bounds, plus new center.
 * @internal
 */

function rotate<E>(x:number, y:number, w:number, h:number, r:number):TranslatedViewportElement<E> {

    const center={x:x + (w/2), y:y + (h/2)},
        cr = Math.cos(r / 360 * Math.PI * 2), sr = Math.sin(r / 360 * Math.PI * 2),
        _point = (x:number, y:number):PointXY => {``
            return {
                x: center.x + Math.round(((x - center.x) * cr) - ((y - center.y) * sr)),
                y: center.y + Math.round(((y - center.y) * cr) - ((x - center.x) * sr))
            };
        }

    const p1 = _point(x, y),
        p2 = _point(x+w, y),
        p3 = _point(x+w, y+h),
        p4 = _point(x, y+h),
        c = _point(x + (w/2), y + (h/2))

    const xmin = Math.min(p1.x, p2.x, p3.x, p4.x),
        xmax = Math.max(p1.x, p2.x, p3.x, p4.x),
        ymin = Math.min(p1.y, p2.y, p3.y, p4.y),
        ymax = Math.max(p1.y, p2.y, p3.y, p4.y)

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

/**
 * @internal
 * @param value
 * @param arrayEntry
 */
const entryComparator = (value:[string, any], arrayEntry:[string, any]) => {

    let c = 0

    if (arrayEntry[1] > value[1]) {
        c = -1
    } else if (arrayEntry[1] < value[1]) {
        c = 1
    }

    return c
}

/**
 * @internal
 * @param value
 * @param arrayEntry
 */
const reverseEntryComparator = (value:[string, any], arrayEntry:[string, any]) => {
    return entryComparator(value, arrayEntry) * -1
}

/**
 * @internal
 * @param id
 * @param value
 * @param array
 * @param sortDescending
 */
function _updateElementIndex(id:string, value:number, array:Array<[string, number]>, sortDescending?:boolean) {
    insertSorted<[string, number]>([id, value], array, entryComparator, sortDescending)
}

/**
 * @internal
 * @param id
 * @param array
 */
function _clearElementIndex<T>(id:string, array:Array<T>) {
    const idx = findWithFunction(array, (entry) => {
        return entry[0] === id
    })

    if (idx > -1) {
        array.splice(idx, 1)
    }
}

/**
 * Models the positions of the elements a given jsPlumb instance is tracking. Users of the API should not need to interact directly
 * with a Viewport.
 * @public
 */
export class Viewport<T extends{E:unknown}> extends EventGenerator {

// --------------- PRIVATE  ------------------------------------------

    private _currentTransaction:Transaction = null

    constructor(public instance:JsPlumbInstance<T>) {
        super()
    }

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

    _elementMap:Map<string, ViewportElement<T["E"]>> = new Map()
    _transformedElementMap:Map<string, TranslatedViewportElement<T["E"]>> = new Map()

    _bounds:Record<string, number> = {
        minx:0,
        maxx:0,
        miny:0,
        maxy:0
    };

    private _updateBounds (id:string, updatedElement:ViewportElement<T["E"]>, doNotRecalculateBounds?:boolean) {
        if (updatedElement != null) {

            _clearElementIndex(id, this._sortedElements.xmin)
            _clearElementIndex(id, this._sortedElements.xmax)
            _clearElementIndex(id, this._sortedElements.ymin)
            _clearElementIndex(id, this._sortedElements.ymax)

            _updateElementIndex(id, updatedElement.t.x, this._sortedElements.xmin, false)
            _updateElementIndex(id, updatedElement.t.x + updatedElement.t.w, this._sortedElements.xmax, true)
            _updateElementIndex(id, updatedElement.t.y, this._sortedElements.ymin, false)
            _updateElementIndex(id, updatedElement.t.y + updatedElement.t.h, this._sortedElements.ymax, true)

            if (doNotRecalculateBounds !== true) {
                this._recalculateBounds()
            }

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

    recomputeBounds() {
        this._sortedElements.xmin.length = 0
        this._sortedElements.xmax.length = 0
        this._sortedElements.ymin.length = 0
        this._sortedElements.ymax.length = 0

        this._elementMap.forEach((vp:ViewportElement<any>, id:string) => {
            this._sortedElements.xmin.push([id, vp.t.x])
            this._sortedElements.xmax.push([id, vp.t.x + vp.t.w])
            this._sortedElements.ymin.push([id, vp.t.y])
            this._sortedElements.ymax.push([id, vp.t.y + vp.t.h])
        })

        this._sortedElements.xmin.sort(entryComparator)
        this._sortedElements.ymin.sort(entryComparator)
        this._sortedElements.xmax.sort(reverseEntryComparator)
        this._sortedElements.ymax.sort(reverseEntryComparator)

        this._recalculateBounds()
    }


    private _finaliseUpdate (id:string, e:ViewportElement<T["E"]>, doNotRecalculateBounds?:boolean) {
        e.t = rotate(e.x, e.y, e.w, e.h, e.r)
        this._transformedElementMap.set(id, e.t)

        if (doNotRecalculateBounds !== true) {
            this._updateBounds(id, e, doNotRecalculateBounds)
        }
    }

    shouldFireEvent(event: string, value: unknown, originalEvent?: Event): boolean {
        return true
    }

// ---------------------- PUBLIC -----------------------------

    startTransaction() {
        if (this._currentTransaction != null) {
            throw new Error("Viewport: cannot start transaction; a transaction is currently active.")
        }
        this._currentTransaction = new Transaction()
    }

    endTransaction() {

        if (this._currentTransaction != null) {
            // recompute elements, holding off on computing bounds for the entire viewport until the end.
            this._currentTransaction.affectedElements.forEach( (id:string) => {
                const entry = this.getPosition(id)
                this._finaliseUpdate(id, entry, true)
            })
            // recompute bounds for the viewport.
            this.recomputeBounds()
            this._currentTransaction = null
        }
    }

    updateElements (entries:Array<{id:string, x:number, y:number, width:number, height:number, rotation:number}>) {

        forEach(entries, (e) => this.updateElement(e.id, e.x, e.y, e.width, e.height, e.rotation))
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
     * @param doNotRecalculateBounds Defaults to false. For internal use. If true, does not update viewport bounds after updating the element.
     */
    updateElement (id:string, x:number, y:number, width:number, height:number, rotation:number, doNotRecalculateBounds?:boolean):ViewportElement<T["E"]> {

        const e = getsert(this._elementMap, id, EMPTY_POSITION)

        e.dirty = (x == null && e.x == null) || (y == null && e.y == null) || (width == null && e.w == null) || (height == null && e.h == null)

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

        e.c.x = e.x + (e.w / 2)
        e.c.y = e.y + (e.h / 2)

        e.x2 = e.x + e.w
        e.y2 = e.y + e.h

        if (this._currentTransaction == null) {
            this._finaliseUpdate(id, e, doNotRecalculateBounds)
        } else {
            this._currentTransaction.affectedElements.add(id)
        }

        return e
    }

    /**
     * Update the size/offset of the element with the given id, and adjust viewport bounds.
     * @param elId
     * @param doNotRecalculateBounds If true, the viewport's bounds won't be recalculated after the element's size and position has been refreshed.
     */
    refreshElement(elId:string, doNotRecalculateBounds?:boolean):ViewportElement<T["E"]>  {
        const me = this.instance.getManagedElements()
        const s = me[elId] ? me[elId].el : null
        if (s != null) {
            const size = this.getSize(s)
            const offset = this.getOffset(s)
            return this.updateElement(elId, offset.x, offset.y, size.w, size.h, null, doNotRecalculateBounds)
        } else {
            return null
        }
    }

    protected getSize(el:T["E"]):Size {
        return this.instance.getSize(el)
    }

    protected getOffset(el:T["E"]):PointXY {
        return  this.instance.getOffset(el)
    }

    /**
     * Creates an empty entry for an element with the given ID.
     * @param doNotRecalculateBounds If true, the viewport's bounds won't be recalculated after the element has been registered.
     * @param id
     */
    registerElement(id:string, doNotRecalculateBounds?:boolean):ViewportElement<T["E"]> {
        return this.updateElement(id, 0, 0, 0, 0, 0, doNotRecalculateBounds)
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
    addElement (id:string, x:number, y:number, width:number, height:number, rotation:number):ViewportElement<T["E"]> {
        return this.updateElement(id, x, y, width, height, rotation)
    }

    /**
     * Rotates the element with the given id, recalculating bounds afterwards.
     * @param id
     * @param rotation
     */
    rotateElement (id:string, rotation:number):ViewportElement<T["E"]> {
        const e = getsert(this._elementMap, id, EMPTY_POSITION)
        e.r = rotation || 0
        this._finaliseUpdate(id, e)
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
    setSize (id:string, w:number, h:number):ViewportElement<T["E"]> {
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
    setPosition(id:string, x:number, y:number):ViewportElement<T["E"]> {
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

        _clearElementIndex(id, this._sortedElements.xmin)
        _clearElementIndex(id, this._sortedElements.xmax)
        _clearElementIndex(id, this._sortedElements.ymin)
        _clearElementIndex(id, this._sortedElements.ymax)

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
    getPosition (id:string):ViewportElement<T["E"]> {
        return this._elementMap.get(id)
    }

    /**
     * Get all elements managed by the Viewport.
     */
    getElements():Map<string, ViewportElement<T["E"]>> {
        return this._elementMap
    }

    /**
     * Returns whether or not the viewport is empty.
     */
    isEmpty () {
        return this._elementMap.size === 0
    }
}

import {jsPlumbDOMElement} from "./element-facade"
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance"
import {PointXY, Size, forEach, findWithFunction, BoundingBox} from "../util/util"

export const CLASS_DRAG_SELECTED = "jtk-drag-selected"

export class DragSelection {
    private _dragSelection: Array<{id:string, jel:jsPlumbDOMElement}> = []
    private _dragSizes:Map<string, Size> = new Map()
    private _dragElements:Map<string, jsPlumbDOMElement> = new Map()
    private _dragElementStartPositions:Map<string, PointXY> = new Map()
    private _dragElementPositions:Map<string, PointXY> = new Map()

    private __activeSet:Array<{id:string, jel:jsPlumbDOMElement}>

    private get _activeSet():Array<{id:string, jel:jsPlumbDOMElement}> {
        if (this.__activeSet == null) {
            return this._dragSelection
        } else {
            return this.__activeSet
        }
    }

    constructor(private instance:BrowserJsPlumbInstance) {}

    get length() {
        return this._dragSelection.length
    }

    filterActiveSet(fn:(p:{id:string, jel:jsPlumbDOMElement})=>boolean) {
        this.__activeSet = []
        forEach(this._dragSelection, (p) => {
            if(fn(p)) {
                this.__activeSet.push(p)
            }
        })
    }

    /**
     * Reset all computed values and remove all elements from the selection.
     */
    clear() {
        this.reset()
        forEach(this._dragSelection,(p) => this.instance.removeClass(p.jel, CLASS_DRAG_SELECTED))
        this._dragSelection.length = 0
    }

    /**
     * Reset all computed values. Does not remove elements from the selection. Use `clear()` for that. This method is intended for
     * use after (or before) a drag.
     * @internal
     */
    reset() {
        this._dragElementStartPositions.clear()
        this._dragElementPositions.clear()
        this._dragSizes.clear()
        this._dragElements.clear()
        this.__activeSet = null
    }

    initialisePositions() {
        forEach(this._activeSet, (p:{id:string, jel:jsPlumbDOMElement}) => {
            const vp = this.instance.viewport.getPosition(p.id)
            let off = {
                x:parseInt("" + p.jel.offsetLeft, 10),
                y:parseInt("" + p.jel.offsetTop, 10)
            }
            this._dragElementStartPositions.set(p.id, off)
            this._dragElementPositions.set(p.id, off)
            this._dragSizes.set(p.id, {w:vp.w,h:vp.h})
        })
    }

    updatePositions(currentPosition:PointXY, originalPosition:PointXY, callback:(el:jsPlumbDOMElement, id:string, s:Size, b:BoundingBox)=>any) {

        const dx = currentPosition.x - originalPosition.x, dy = currentPosition.y - originalPosition.y

        forEach(this._activeSet, (p:{id:string, jel:jsPlumbDOMElement}) => {
            const op = this._dragElementStartPositions.get(p.id)
            if (op) {

                let x = op.x + dx, y = op.y + dy
                const s = this._dragSizes.get(p.id)
                let _b:BoundingBox = {x, y, w:s.w, h:s.h}

                // TODO this is duplicated in the onStop of element DragHandler
                if (p.jel._jsPlumbParentGroup && p.jel._jsPlumbParentGroup.constrain) {
                    const constrainRect = {
                        w: p.jel.parentNode.offsetWidth + p.jel.parentNode.scrollLeft,
                        h: p.jel.parentNode.offsetHeight + p.jel.parentNode.scrollTop
                    };

                    _b.x = Math.max(_b.x, 0)
                    _b.y = Math.max(_b.y, 0)
                    _b.x = Math.min(_b.x, constrainRect.w - s.w)
                    _b.y = Math.min(_b.y, constrainRect.h - s.h)
                }

                this._dragElementPositions.set(p.id, {x,y})

                p.jel.style.left = _b.x + "px"
                p.jel.style.top = _b.y + "px"

                callback(p.jel, p.id, s, _b)

            }
        })
    }

    /**
     * Iterate through the contents of the drag selection and execute the given function on each entry.
     * @param f
     */
    each(f:(el:jsPlumbDOMElement, id:string, o:PointXY, s:Size, originalPosition:PointXY)=> any) {
        forEach(this._activeSet, (p:{id:string, jel:jsPlumbDOMElement}) => {
            const s = this._dragSizes.get(p.id)
            const o = this._dragElementPositions.get(p.id)
            const orig = this._dragElementStartPositions.get(p.id)
            f(p.jel, p.id, o, s, orig)
        })
    }

    add(el:Element, id?:string) {
        const jel = el as unknown as jsPlumbDOMElement
        id = id || this.instance.getId(jel)
        const idx = findWithFunction(this._dragSelection, (p) => p.id === id)
        //
        if (idx === -1) {
            this.instance.addClass(el, CLASS_DRAG_SELECTED)
            this._dragSelection.push({id:id, jel})
        }
    }

    remove(el:Element) {
        const jel = el as unknown as jsPlumbDOMElement
        this._dragSelection = this._dragSelection.filter((p) => {
            const out = p.jel !== jel
            if (!out) {
                this.instance.removeClass(p.jel, CLASS_DRAG_SELECTED)
            }
            return out
        })
    }

    toggle(el:Element) {
        const jel = el as unknown as jsPlumbDOMElement
        const idx = findWithFunction(this._dragSelection, (p) => p.jel === jel)
        if (idx !== -1) {
            this.remove(jel)
        } else {
            this.add(el)
        }
    }
}

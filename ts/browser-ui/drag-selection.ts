import {jsPlumbDOMElement} from "@jsplumb/browser-ui/element-facade"
import {BoundingBox, findWithFunction, forEach, PointXY, Size} from "@jsplumb/util"
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance"

export const CLASS_DRAG_SELECTED = "jtk-drag-selected"

export class DragSelection {
    private _dragSelection: Array<{id:string, jel:jsPlumbDOMElement}> = []
    private _dragSelectionOffsets:Map<string, PointXY> = new Map()
    private _dragSizes:Map<string, Size> = new Map()
    private _dragElements:Map<string, jsPlumbDOMElement> = new Map()

    constructor(private instance:BrowserJsPlumbInstance) {}

    get length() {
        return this._dragSelection.length
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
     * @private
     */
    reset() {
        this._dragSelectionOffsets.clear()
        this._dragSizes.clear()
        this._dragElements.clear()
    }

    /**
     * Refresh the absolute positions of each element in the selection by adding their respective offsets to the given origin.
     * @param origin
     */
    refreshOffsets(origin:PointXY) {
        forEach(this._dragSelection, (p:{id:string, jel:jsPlumbDOMElement}) => {
            let off = this.instance.getOffset(p.jel)
            this._dragSelectionOffsets.set(p.id, { x:off.x- origin.x, y:off.y - origin.y })
            this._dragSizes.set(p.id, this.instance.getSize(p.jel))
        })
    }

    /**
     * Iterate through the contents of the drag selection and execute the given function on each entry.
     * @param f
     */
    each(f:(el:jsPlumbDOMElement, id:string, o:PointXY, s:Size)=> any) {
        forEach(this._dragSelection, (p:{id:string, jel:jsPlumbDOMElement}) => {
            const s = this._dragSizes.get(p.id)
            const o = this._dragSelectionOffsets.get(p.id)
            f(p.jel, p.id, o, s)
        })
    }

    positionElements(bounds:BoundingBox, callback:(el:jsPlumbDOMElement, id:string, s:Size, b:BoundingBox)=>any) {
        forEach(this._dragSelection, (p:{id:string, jel:jsPlumbDOMElement}) => {
            const s = this._dragSizes.get(p.id)
            const o = this._dragSelectionOffsets.get(p.id)
            let _b:BoundingBox = {x:bounds.x + o.x, y:bounds.y + o.y, w:s.w, h:s.h}
            p.jel.style.left = _b.x + "px"
            p.jel.style.top = _b.y + "px"

            callback(p.jel, p.id, s, _b)
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

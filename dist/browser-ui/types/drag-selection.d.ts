import { jsPlumbDOMElement } from "./element-facade";
import { BoundingBox, PointXY, Size } from "@jsplumb/util";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
export declare const CLASS_DRAG_SELECTED = "jtk-drag-selected";
export declare class DragSelection {
    private instance;
    private _dragSelection;
    private _dragSizes;
    private _dragElements;
    private _dragElementStartPositions;
    private _dragElementPositions;
    private __activeSet;
    private readonly _activeSet;
    constructor(instance: BrowserJsPlumbInstance);
    readonly length: number;
    filterActiveSet(fn: (p: {
        id: string;
        jel: jsPlumbDOMElement;
    }) => boolean): void;
    /**
     * Reset all computed values and remove all elements from the selection.
     */
    clear(): void;
    /**
     * Reset all computed values. Does not remove elements from the selection. Use `clear()` for that. This method is intended for
     * use after (or before) a drag.
     * @private
     */
    reset(): void;
    initialisePositions(): void;
    updatePositions(currentPosition: PointXY, originalPosition: PointXY, callback: (el: jsPlumbDOMElement, id: string, s: Size, b: BoundingBox) => any): void;
    /**
     * Iterate through the contents of the drag selection and execute the given function on each entry.
     * @param f
     */
    each(f: (el: jsPlumbDOMElement, id: string, o: PointXY, s: Size, originalPosition: PointXY) => any): void;
    add(el: Element, id?: string): void;
    remove(el: Element): void;
    toggle(el: Element): void;
}

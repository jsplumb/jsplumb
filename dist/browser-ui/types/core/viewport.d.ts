import { PointArray } from "./common";
import { EventGenerator } from "./event-generator";
export interface ViewportElementBase {
    x: number;
    y: number;
    w: number;
    h: number;
    r: number;
    c: PointArray;
    x2: number;
    y2: number;
}
export interface ViewportElement extends ViewportElementBase {
    t: TranslatedViewportElement;
}
export interface TranslatedViewportElement extends ViewportElementBase {
    cr: number;
    sr: number;
}
export declare class Viewport extends EventGenerator {
    private _eventsSuspended;
    _sortedElements: Record<string, Array<[string, number]>>;
    _elementMap: Map<string, ViewportElement>;
    _transformedElementMap: Map<string, TranslatedViewportElement>;
    _bounds: Record<string, number>;
    private _clearElementIndex;
    private static _updateElementIndex;
    private _fireUpdate;
    private _updateBounds;
    private _recalculateBounds;
    private _finaliseUpdate;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    startTransaction(): void;
    endTransaction(doNotFireUpdate?: boolean): void;
    updateElements(entries: Array<{
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
    }>): void;
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
    updateElement(id: string, x: number, y: number, width: number, height: number, rotation: number): ViewportElement;
    /**
     * Creates an empty entry for an element with the given ID.
     * @param id
     */
    registerElement(id: string): ViewportElement;
    /**
     * Adds the element with the given id, with the given values for x, y, width, height and rotation. Any of these may be null.
     * @param id
     * @param x
     * @param y
     * @param width
     * @param height
     * @param rotation
     */
    addElement(id: string, x: number, y: number, width: number, height: number, rotation: number): ViewportElement;
    /**
     * Rotates the element with the given id, recalculating bounds afterwards.
     * @param id
     * @param rotation
     */
    rotateElement(id: string, rotation: number): ViewportElement;
    /**
     * Gets the width of the content managed by the viewport, taking any rotated elements into account.
     */
    getBoundsWidth(): number;
    /**
     * Gets the height of the content managed by the viewport, taking any rotated elements into account.
     */
    getBoundsHeight(): number;
    /**
     * Gets the leftmost point of the content managed by the viewport, taking any rotated elements into account.
     */
    getX(): number;
    /**
     * Gets the topmost of the content managed by the viewport, taking any rotated elements into account.
     */
    getY(): number;
    /**
     * Sets the size of the element with the given ID, recalculating bounds.
     * @param id
     * @param w
     * @param h
     */
    setSize(id: string, w: number, h: number): ViewportElement;
    /**
     * Sets the [x,y] position of the element with the given ID, recalculating bounds.
     * @param id
     * @param x
     * @param y
     */
    setPosition(id: string, x: number, y: number): ViewportElement;
    /**
     * Clears the internal state of the viewport, removing all elements.
     */
    reset(): void;
    /**
     * Remove the element with the given ID from the viewport.
     * @param id
     */
    remove(id: string): void;
    /**
     * Gets the position of the element. This returns both the original position, and also the translated position of the element. Certain internal methods, such as the anchor
     * calculation code, use the unrotated position and then subsequently apply the element's rotation to any calculated positions.
     * Other parts of the codebase - the Toolkit's magnetizer or pan/zoom widget, for instance - are interested in the rotated position.
     * @param id
     */
    getPosition(id: string): ViewportElement;
    /**
     * Get all elements managed by the Viewport.
     */
    getElements(): Map<string, ViewportElement>;
    /**
     * Returns whether or not the viewport is empty.
     */
    isEmpty(): boolean;
}

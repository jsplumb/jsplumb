import { Size, PointXY } from "./common";
import { EventGenerator } from "./event-generator";
import { JsPlumbInstance } from "./core";
export interface ViewportPosition extends PointXY {
}
export interface ViewportElementBase<E> extends ViewportPosition {
    w: number;
    h: number;
    r: number;
    c: PointXY;
    x2: number;
    y2: number;
    dirty: boolean;
}
export interface ViewportElement<E> extends ViewportElementBase<E> {
    t: TranslatedViewportElement<E>;
}
export interface TranslatedViewportElementBase<E> extends ViewportElementBase<E> {
    cr: number;
    sr: number;
}
export declare type TranslatedViewportElement<E> = Pick<TranslatedViewportElementBase<E>, Exclude<keyof TranslatedViewportElementBase<E>, "dirty">>;
export declare class Viewport<T extends {
    E: unknown;
}> extends EventGenerator {
    instance: JsPlumbInstance<T>;
    private _currentTransaction;
    constructor(instance: JsPlumbInstance<T>);
    _sortedElements: Record<string, Array<[string, number]>>;
    _elementMap: Map<string, ViewportElement<T["E"]>>;
    _transformedElementMap: Map<string, TranslatedViewportElement<T["E"]>>;
    _bounds: Record<string, number>;
    private _clearElementIndex;
    private _updateElementIndex;
    private _updateBounds;
    private _recalculateBounds;
    recomputeBounds(): void;
    private _finaliseUpdate;
    shouldFireEvent(event: string, value: unknown, originalEvent?: Event): boolean;
    startTransaction(): void;
    endTransaction(): void;
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
     * @param doNotRecalculateBounds Defaults to false. For internal use. If true, does not update viewport bounds after updating the element.
     */
    updateElement(id: string, x: number, y: number, width: number, height: number, rotation: number, doNotRecalculateBounds?: boolean): ViewportElement<T["E"]>;
    /**
     * Update the size/offset of the element with the given id, and adjust viewport bounds.
     * @param elId
     * @param doNotRecalculateBounds If true, the viewport's bounds won't be recalculated after the element's size and position has been refreshed.
     */
    refreshElement(elId: string, doNotRecalculateBounds?: boolean): ViewportElement<T["E"]>;
    protected getSize(el: T["E"]): Size;
    protected getOffset(el: T["E"]): PointXY;
    /**
     * Creates an empty entry for an element with the given ID.
     * @param doNotRecalculateBounds If true, the viewport's bounds won't be recalculated after the element has been registered.
     * @param id
     */
    registerElement(id: string, doNotRecalculateBounds?: boolean): ViewportElement<T["E"]>;
    /**
     * Adds the element with the given id, with the given values for x, y, width, height and rotation. Any of these may be null.
     * @param id
     * @param x
     * @param y
     * @param width
     * @param height
     * @param rotation
     */
    addElement(id: string, x: number, y: number, width: number, height: number, rotation: number): ViewportElement<T["E"]>;
    /**
     * Rotates the element with the given id, recalculating bounds afterwards.
     * @param id
     * @param rotation
     */
    rotateElement(id: string, rotation: number): ViewportElement<T["E"]>;
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
    setSize(id: string, w: number, h: number): ViewportElement<T["E"]>;
    /**
     * Sets the [x,y] position of the element with the given ID, recalculating bounds.
     * @param id
     * @param x
     * @param y
     */
    setPosition(id: string, x: number, y: number): ViewportElement<T["E"]>;
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
    getPosition(id: string): ViewportElement<T["E"]>;
    /**
     * Get all elements managed by the Viewport.
     */
    getElements(): Map<string, ViewportElement<T["E"]>>;
    /**
     * Returns whether or not the viewport is empty.
     */
    isEmpty(): boolean;
}

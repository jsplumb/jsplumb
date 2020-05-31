import { jsPlumbDefaults, jsPlumbHelperFunctions } from "../defaults";
import { Dictionary, jsPlumbInstance, Offset, Size } from "../core";
import { DragManager } from "./drag-manager";
import { UIGroup } from "../group/group";
export interface DragEventCallbackOptions {
    drag: {
        size: [number, number];
        getDragElement: () => HTMLElement;
    };
    e: MouseEvent;
    el: HTMLElement;
    pos: [number, number];
}
export interface DragOptions {
    containment?: string;
    start?: (params: DragEventCallbackOptions) => void;
    drag?: (params: DragEventCallbackOptions) => void;
    stop?: (params: DragEventCallbackOptions) => void;
    cursor?: string;
    zIndex?: number;
}
export interface BrowserJsPlumbDefaults extends jsPlumbDefaults {
    dragOptions?: DragOptions;
}
export interface jsPlumbDOMElement extends HTMLElement {
    _jsPlumbGroup: UIGroup<HTMLElement>;
    _isJsPlumbGroup: boolean;
    offsetParent: HTMLElement;
    getAttribute: (name: string) => string;
}
export declare type PosseSpec = string | {
    id: string;
    active: boolean;
};
export declare class BrowserJsPlumbInstance extends jsPlumbInstance<HTMLElement> {
    protected _instanceIndex: number;
    dragManager: DragManager;
    _connectorClick: Function;
    _connectorDblClick: Function;
    _endpointClick: Function;
    _endpointDblClick: Function;
    _overlayClick: Function;
    _overlayDblClick: Function;
    _connectorMouseover: Function;
    _connectorMouseout: Function;
    _endpointMouseover: Function;
    _endpointMouseout: Function;
    _overlayMouseover: Function;
    _overlayMouseout: Function;
    private elementDragHandler;
    constructor(_instanceIndex: number, defaults?: BrowserJsPlumbDefaults, helpers?: jsPlumbHelperFunctions<HTMLElement>);
    getElement(el: HTMLElement | string): HTMLElement;
    getElementById(elId: string): HTMLElement;
    removeElement(element: HTMLElement | string): void;
    appendElement(el: HTMLElement, parent: HTMLElement): void;
    _getAssociatedElements(el: HTMLElement): Array<HTMLElement>;
    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean;
    getClass(el: HTMLElement): string;
    addClass(el: HTMLElement, clazz: string): void;
    hasClass(el: HTMLElement, clazz: string): boolean;
    removeClass(el: HTMLElement, clazz: string): void;
    toggleClass(el: HTMLElement, clazz: string): void;
    setAttribute(el: HTMLElement, name: string, value: string): void;
    getAttribute(el: HTMLElement, name: string): string;
    setAttributes(el: HTMLElement, atts: Dictionary<string>): void;
    removeAttribute(el: HTMLElement, attName: string): void;
    on(el: HTMLElement, event: string, callbackOrSelector: Function | string, callback?: Function): this;
    off(el: HTMLElement, event: string, callback: Function): this;
    trigger(el: HTMLElement, event: string, originalEvent?: Event, payload?: any): void;
    _getOffset(el: HTMLElement, relativeToRoot?: boolean, container?: HTMLElement): Offset;
    _getSize(el: HTMLElement): Size;
    createElement(tag: string, style?: Dictionary<any>, clazz?: string, atts?: Dictionary<string>): HTMLElement;
    createElementNS(ns: string, tag: string, style?: Dictionary<any>, clazz?: string, atts?: Dictionary<string>): HTMLElement;
    getStyle(el: HTMLElement, prop: string): any;
    getSelector(ctx: string | HTMLElement, spec: string): NodeListOf<any>;
    setPosition(el: HTMLElement, p: Offset): void;
    getUIPosition(eventArgs: any): Offset;
    getDragScope(el: any): string;
    getPositionOnElement(evt: Event, el: HTMLElement, zoom: number): number[];
    setDraggable(element: HTMLElement, draggable: boolean): void;
    isDraggable(el: HTMLElement): boolean;
    toggleDraggable(el: HTMLElement): boolean;
    private _attachEventDelegates;
    private _detachEventDelegates;
    setContainer(c: string | HTMLElement): void;
    reset(silently?: boolean): void;
    destroy(): void;
    unmanage(id: string): void;
    addToDragSelection(...el: Array<string | HTMLElement>): void;
    clearDragSelection(): void;
    removeFromDragSelection(...el: Array<string | HTMLElement>): void;
    toggleDragSelection(...el: Array<string | HTMLElement>): void;
    getDragSelection(): Array<HTMLElement>;
    /**
     * Adds the given element(s) to the given posse.
     * @param spec Either the ID of some posse, in which case the elements are all added as 'active', or an object of the form
     * { id:"someId", active:boolean }. In the latter case, `active`, if true, which is the default, indicates whether
     * dragging the given element(s) should cause all the elements in the posse to be dragged. If `active` is false it means the
     * given element(s) is "passive" and should only move when an active member of the posse is dragged.
     * @param els Elements to add to the posse.
     */
    addToPosse(spec: PosseSpec, ...els: Array<HTMLElement>): void;
    /**
     * Removes the given element(s) from any posse they may be in. You don't need to supply the posse id, as elements
     * can only be in one posse anyway.
     * @param els Elements to remove from posses.
     */
    removeFromPosse(...els: Array<HTMLElement>): void;
    /**
     * Sets the active/passive state for the given element(s).You don't need to supply the posse id, as elements
     * can only be in one posse anyway.
     * @param state true for active, false for passive.
     * @param els
     */
    setPosseState(state: boolean, ...els: Array<HTMLElement>): void;
}

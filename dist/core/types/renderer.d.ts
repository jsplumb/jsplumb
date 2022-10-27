import { BoundingBox, Extents, PointXY, Size } from "@jsplumb/util";
import { OverlayBase } from "./overlay/overlay";
import { LabelOverlay } from "./overlay/label-overlay";
import { Component } from "./component/component";
import { PaintStyle } from "@jsplumb/common";
import { Connection } from "./connector/declarations";
import { Endpoint } from "./endpoint/endpoint";
import { TypeDescriptor } from "./type-descriptors";
import { JsPlumbUICore } from "./core";
export interface JsPlumbRenderer<ElementType> {
    /**
     * For some given element, find any other elements we want to draw whenever that element
     * is being drawn. for groups, for example, this means any child elements of the group. For an element that has child
     * elements that are also managed, it means those child elements.
     * @param el
     * @internal
     */
    _getAssociatedElements(el: ElementType): Array<ElementType>;
    _removeElement(el: ElementType): void;
    _appendElement(el: ElementType, parent: ElementType): void;
    toggleClass(el: ElementType | ArrayLike<ElementType>, clazz: string): void;
    getClass(el: ElementType): string;
    hasClass(el: ElementType, clazz: string): boolean;
    updateClasses(el: ElementType, classesToAdd: Array<string>, classesToRemove: Array<string>): void;
    setAttribute(el: ElementType, name: string, value: string): void;
    getAttribute(el: ElementType, name: string): string;
    setAttributes(el: ElementType, atts: Record<string, string>): void;
    removeAttribute(el: ElementType, attName: string): void;
    getSelector(ctx: string | ElementType, spec?: string): ArrayLike<ElementType>;
    getStyle(el: ElementType, prop: string): any;
    computeSize(el: ElementType): Size;
    getOffsetRelativeToElement(el: ElementType, elId: string, referenceElement: ElementType): PointXY;
    getOffsetRelativeToRoot(el: ElementType | string): PointXY;
    getPosition(el: Element): PointXY;
    getBounds(el: ElementType): BoundingBox;
    setPosition(el: ElementType, p: PointXY): void;
    setSize(el: ElementType, width: number, height: number): void;
    on(el: Document | ElementType | ArrayLike<ElementType>, event: string, callbackOrSelector: Function | string, callback?: Function): void;
    off(el: Document | ElementType | ArrayLike<ElementType>, event: string, callback: Function): void;
    trigger(el: Document | ElementType, event: string, originalEvent?: Event, payload?: any, detail?: number): void;
    /**
     * @internal
     * @param o
     * @param params
     * @param extents
     */
    _paintOverlay(o: OverlayBase, params: any, extents: any): void;
    addOverlayClass(o: OverlayBase, clazz: string): void;
    removeOverlayClass(o: OverlayBase, clazz: string): void;
    setOverlayVisible(o: OverlayBase, visible: boolean): void;
    destroyOverlay(o: OverlayBase): void;
    updateLabel(o: LabelOverlay, value: string): void;
    drawOverlay(overlay: OverlayBase, component: Component, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    reattachOverlay(o: OverlayBase, c: Component): void;
    setOverlayHover(instance: JsPlumbUICore<any>, o: OverlayBase, hover: boolean): void;
    setHover(component: Component, hover: boolean): void;
    /**
     * @internal
     * @param connector
     * @param paintStyle
     * @param extents
     */
    paintConnection(instance: JsPlumbUICore<any>, connection: Connection, paintStyle: PaintStyle, extents?: Extents): void;
    /**
     * @internal
     * @param connection
     * @param force
     */
    destroyConnection(connection: Connection, force?: boolean): void;
    /**
     * @internal
     * @param connection
     * @param h
     * @param sourceEndpoint
     */
    setConnectionHover(connection: Connection, h: boolean, sourceEndpoint?: Endpoint): void;
    /**
     * @internal
     * @param connection
     * @param clazz
     */
    addConnectionClass(connection: Connection, clazz: string): void;
    removeConnectionClass(connection: Connection, clazz: string): void;
    getConnectionClass(connection: Connection): string;
    setConnectionVisible(connection: Connection, v: boolean): void;
    applyConnectionType(connection: Connection, t: TypeDescriptor): void;
    applyEndpointType(ep: Endpoint, t: TypeDescriptor): void;
    setEndpointVisible(ep: Endpoint, v: boolean): void;
    destroyEndpoint(ep: Endpoint): void;
    renderEndpoint(ep: Endpoint, paintStyle: PaintStyle): void;
    addEndpointClass(ep: Endpoint, c: string): void;
    removeEndpointClass(ep: Endpoint, c: string): void;
    getEndpointClass(ep: Endpoint): string;
    setEndpointHover(endpoint: Endpoint, h: boolean, endpointIndex: number, doNotCascade?: boolean): void;
}
//# sourceMappingURL=renderer.d.ts.map
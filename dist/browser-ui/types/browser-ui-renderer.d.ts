import { JsPlumbRenderer } from "@jsplumb/core";
import { Component, Connection, Endpoint, LabelOverlay, OverlayBase, TypeDescriptor } from "@jsplumb/core";
import { BoundingBox, Extents, PointXY, Size } from "@jsplumb/util";
import { PaintStyle } from "@jsplumb/common";
import { EndpointHelperFunctions } from "./definitions";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { EventManager } from "./event-manager";
export declare function registerEndpointRenderer<C>(name: string, fns: EndpointHelperFunctions<C>): void;
/**
 * Renderer for DOM. This is an internal class that users of the library do not need to interact with.
 * @internal
 */
export declare class BrowserUIRenderer implements JsPlumbRenderer<Element> {
    eventManager: EventManager;
    constructor(eventManager: EventManager);
    _appendElement(el: Element, parent: Element): void;
    _getAssociatedElements(el: Element): Array<Element>;
    _paintOverlay(o: OverlayBase, params: any, extents: any): void;
    _removeElement(el: Element): void;
    /**
     * @internal
     * @param connector
     * @param clazz
     */
    addConnectionClass(connection: Connection, clazz: string): void;
    /**
     * @internal
     * @param ep
     * @param c
     */
    addEndpointClass(ep: Endpoint, c: string): void;
    /**
     * @internal
     * @param o
     * @param clazz
     */
    addOverlayClass(o: OverlayBase, clazz: string): void;
    /**
     * @internal
     * @param connector
     * @param t
     */
    applyConnectionType(connection: Connection, t: TypeDescriptor): void;
    /**
     * @internal
     * @param ep
     * @param t
     */
    applyEndpointType<C>(ep: Endpoint, t: TypeDescriptor): void;
    destroyConnection(connection: Connection<any>, force?: boolean): void;
    /**
     * @internal
     * @param ep
     */
    destroyEndpoint(ep: Endpoint): void;
    destroyOverlay(o: OverlayBase): void;
    drawOverlay(o: OverlayBase, component: Component, paintStyle: PaintStyle, absolutePosition?: PointXY): any;
    getAttribute(el: Element, name: string): string;
    getBounds(el: Element): BoundingBox;
    getClass(el: Element): string;
    /**
     * @internal
     * @param connection
     */
    getConnectionClass(connection: Connection): string;
    /**
     * @internal
     * @param ep
     */
    getEndpointClass(ep: Endpoint): string;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     *
     * Places this is called:
     *
     * - `orphan` in group manager, to get an elements position relative to the group. since in this case we know its
     * a child of the group's content area we could theoretically use getBoundingClientRect here
     * - addToGroup in group manager, to find the position of some element that is about to be dropped
     * - addToGroup in group manager, to get the position of the content area of an uncollapsed group onto which an element is being dropped
     * - getOffset method in viewport (just does a pass through to the instance)
     *
     */
    getOffsetRelativeToElement(el: Element, id: string, referenceElement: Element): PointXY;
    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getOffsetRelativeToRoot(el: Element): PointXY;
    getPosition(el: Element): PointXY;
    getSelector(ctx: string | Element, spec?: string): ArrayLike<Element>;
    computeSize(el: Element): Size;
    getStyle(el: Element, prop: string): any;
    hasClass(el: Element, clazz: string): boolean;
    off(el: Document | ArrayLike<Element> | Element, event: string, callback: Function): void;
    on(el: Document | ArrayLike<Element> | Element, event: string, callbackOrSelector: Function | string, callback?: Function): void;
    /**
     * @internal
     * @param connection
     * @param paintStyle
     * @param extents
     */
    paintConnection(instance: BrowserJsPlumbInstance, connection: Connection, paintStyle: PaintStyle, extents?: Extents): void;
    reattachOverlay(o: OverlayBase, c: Component): void;
    removeAttribute(el: Element, attName: string): void;
    /**
     * @internal
     * @param connection
     * @param clazz
     */
    removeConnectionClass(connection: Connection, clazz: string): void;
    /**
     * @internal
     * @param ep
     * @param c
     */
    removeEndpointClass(ep: Endpoint, c: string): void;
    removeOverlayClass(o: OverlayBase, clazz: string): void;
    /**
     * @internal
     * @param ep
     * @param paintStyle
     */
    renderEndpoint(ep: Endpoint, paintStyle: PaintStyle): void;
    setAttribute(el: Element, name: string, value: string): void;
    setAttributes(el: Element, atts: Record<string, string>): void;
    setConnectionHover(connection: Connection, hover: boolean, sourceEndpoint?: Endpoint): void;
    /**
     * @internal
     * @param connection
     * @param v
     */
    setConnectionVisible(connection: Connection, v: boolean): void;
    /**
     * @internal
     * @param endpoint
     * @param hover
     * @param endpointIndex Optional (though you must provide a value) index that identifies whether the endpoint being hovered is the source
     * or target of some connection. A value for this will be provided whenever the source of the hover event is the connector.
     * @param doNotCascade
     */
    setEndpointHover(endpoint: Endpoint, hover: boolean, endpointIndex: -1 | 0 | 1, doNotCascade?: boolean): void;
    /**
     * @internal
     * @param ep
     * @param v
     */
    setEndpointVisible(ep: Endpoint, v: boolean): void;
    setHover(component: Component, hover: boolean): void;
    setOverlayHover(instance: BrowserJsPlumbInstance, o: OverlayBase, hover: boolean): void;
    setOverlayVisible(o: OverlayBase, visible: boolean): void;
    setPosition(el: Element, p: PointXY): void;
    setSize(el: Element, width: number, height: number): void;
    toggleClass(el: Element, clazz: string): void;
    trigger(el: Document | Element, event: string, originalEvent?: Event, payload?: any, detail?: number): void;
    updateClasses(el: Element, classesToAdd: Array<string>, classesToRemove: Array<string>): void;
    updateLabel(o: LabelOverlay, value: string): void;
}
//# sourceMappingURL=browser-ui-renderer.d.ts.map
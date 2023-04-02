import { SupportedEdge } from './constants';
import { AnchorSpec } from "../common/anchor";
import { Endpoint } from "../core/endpoint/endpoint";
import { Connection } from "../core/connector/connection-impl";
import { EndpointSpec } from "../common/endpoint";
import { jsPlumbDOMElement } from "../browser-ui-renderer/element-facade";
import { BrowserJsPlumbInstance } from "../browser-ui-renderer/browser-jsplumb-instance";
export interface ListManagerOptions {
}
/**
 * Constructor options for a list.
 */
export interface JsPlumbListOptions {
    /**
     * Optional spec for the anchor to use when parking connections in response to a scroll.
     */
    anchor?: AnchorSpec;
    /**
     * Optional function to use to get an anchor spec when parking a connection.
     * @param edge - The edge of the element on which the connection is to be parked - top or bottom.
     * @param index - Index of the endpoint that is being parked - 0 if source endpoint, 1 if target endpoint.
     * @param ep - The endpoint that is being parked
     * @param conn - The connection that is being parked
     */
    deriveAnchor?: (edge: SupportedEdge, index: number, ep: Endpoint, conn: Connection) => AnchorSpec;
    /**
     * Optional spec for the endpoint to use when parking connections in response to a scroll.
     */
    endpoint?: EndpointSpec;
    /**
     * Optional function to use to get an endpoint spec when parking a connection.
     * @param edge - The edge of the element on which the connection is to be parked - top or bottom.
     * @param index - Index of the endpoint that is being parked - 0 if source endpoint, 1 if target endpoint.
     * @param ep - The endpoint that is being parked
     * @param conn - The connection that is being parked
     */
    deriveEndpoint?: (edge: SupportedEdge, index: number, ep: Endpoint, conn: Connection) => EndpointSpec;
}
/**
 * Provides methods to create/destroy scrollable lists.
 */
export declare class JsPlumbListManager {
    private instance;
    options: ListManagerOptions;
    count: number;
    lists: Record<string, JsPlumbList>;
    constructor(instance: BrowserJsPlumbInstance, params?: ListManagerOptions);
    /**
     * Configure the given element as a scrollable list.
     * @param el - Element to configure as a list.
     * @param options - Options for the list.
     */
    addList(el: Element, options?: JsPlumbListOptions): JsPlumbList;
    /**
     * Gets the list associated with the given element, if any.
     * @param el
     */
    getList(el: Element): JsPlumbList;
    /**
     * Destroy any scrollable list associated with the given element.
     * @param el
     */
    removeList(el: Element): void;
    findParentList(el: jsPlumbDOMElement): JsPlumbList;
}
/**
 * Models a list of elements that is scrollable, and connections to the elements contained in the list are proxied onto
 * the top of bottom edge of the list element whenever their source/target is not within the list element's current
 * viewport.
 */
export declare class JsPlumbList {
    private instance;
    private el;
    private options;
    readonly id: string;
    _scrollHandler: Function;
    readonly domElement: jsPlumbDOMElement;
    private readonly elId;
    constructor(instance: BrowserJsPlumbInstance, el: Element, options: JsPlumbListOptions, id: string);
    /**
     * Derive an anchor to use for the current situation. In contrast to the way we derive an endpoint, here we use `anchor` from the options, if present, as
     * our first choice, and then `deriveAnchor` as our next choice. There is a default `deriveAnchor` implementation that uses TopRight/TopLeft for top and
     * BottomRight/BottomLeft for bottom.
     * @param edge - Edge to find an anchor for - top or bottom
     * @param index - 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep - the endpoint that is being proxied
     * @param conn - the connection that is being proxied
     */
    private deriveAnchor;
    /**
     * Derive an endpoint to use for the current situation. We'll use a `deriveEndpoint` function passed in to the options as our first choice,
     * followed by `endpoint` (an endpoint spec) from the options, and failing either of those we just use the `type` of the endpoint that is being proxied.
     * @param edge - Edge to find an endpoint for - top or bottom
     * @param index - 0 when endpoint is connection source, 1 when endpoint is connection target
     * @param ep - the endpoint that is being proxied
     * @param conn - the connection that is being proxied
     */
    private deriveEndpoint;
    /**
     * Notification that a new connection concerning this list has been added. This is not a method that should be
     * called as part of the public API; it is for the list manager to call.
     * @param c - New connection
     * @param el - The element which is either the source or target of the connection
     * @param index - 0 if the element is connection source, 1 if it is connection target.
     */
    newConnection(c: Connection, el: jsPlumbDOMElement, index: number): void;
    /**
     * Update all connections in the list. Run at init time and then whenever a scroll event occurs.
     */
    private scrollHandler;
    /**
     * Configure a proxy for a connection.
     * @param el - The element the connection is attached to.
     * @param conn - The connection to proxy.
     * @param index - 0 if the element is connection source, 1 if it is connection target
     * @param edge - List edge to proxy the connection to - top or bottom.
     * @internal
     */
    private _proxyConnection;
    /**
     * Destroys the list, cleaning up the DOM.
     */
    destroy(): void;
}
//# sourceMappingURL=lists.d.ts.map
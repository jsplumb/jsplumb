import { EventManager } from "../browser-ui-renderer/event-manager";
import { Endpoint } from "../core/endpoint/endpoint";
import { Connection } from "../core/connector/connection-impl";
import { BrowserJsPlumbInstance } from "../browser-ui-renderer/browser-jsplumb-instance";
import { Overlay } from "../core/overlay/overlay";
/**
 * Defines a set of event handlers that can be supplied to various methods that simulate mouse activity.  Using these
 * you can inject tests into various parts of the lifecycle of a given operation.
 * @public
 */
export interface EventHandlers<T = any> {
    /**
     * Called before any activity occurs.
     */
    before?: () => any;
    /**
     * Called after a mousedown event has been posted but before the mouse has moved.
     */
    beforeMouseMove?: () => any;
    /**
     * Called after the mouse has moved but before the mouseup event has been posted.
     */
    beforeMouseUp?: () => any;
    /**
     * Called after the activity has been completed.
     * @param payload
     */
    after?: (payload?: T) => any;
}
export declare class BrowserUITestSupport {
    private _jsPlumb;
    private ok;
    private equal;
    _divs: Array<string>;
    mottle: EventManager;
    private _t;
    constructor(_jsPlumb: BrowserJsPlumbInstance, ok: (b: boolean, m: string) => any, equal: (v1: any, v2: any, m?: string) => any);
    /**
     * Create a div element and append it either to the jsPlumb container or an element of your choosing.
     * @param id Unique ID for the element
     * @param parent If null, the new element is appended to the jsPlumb container. Otherwise the new element is appended to this element.
     * @param className Optional class name for the new element
     * @param x Optional x position. If this is omitted a random value is chosen.
     * @param y Optional y position. If this is omitted a random value is chosen.
     * @param w Optional width for the new element.
     * @param h Optional height for the new element.
     */
    addDiv(id: string, parent?: Element, className?: string, x?: number, y?: number, w?: number, h?: number): Element;
    addDivs(ids: Array<string>, parent?: Element): void;
    assertEndpointCount(el: Element, count: number): void;
    _assertManagedEndpointCount(el: Element, count: number): void;
    _assertManagedConnectionCount(el: Element, count: number): void;
    _registerDiv(div: string): void;
    private makeDragStartEvt;
    getAttribute(el: Element, att: string): string;
    /**
     * Drag an element by a given delta in x and y
     * @param el Element to drag
     * @param x X delta
     * @param y Y delta
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragNodeBy(el: Element, x: number, y: number, events?: EventHandlers): void;
    /**
     * Drag an element to a given x and y location
     * @param el Element to drag
     * @param x X location to drag to
     * @param y Y location to drag to
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragNodeTo(el: Element, x: number, y: number, events?: EventHandlers): void;
    /**
     * Drag an element to a given group
     * @param el Element to drag
     * @param targetGroupId ID of the group to drag to
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragToGroup(el: Element, targetGroupId: string, events?: EventHandlers): void;
    /**
     * Drag an element, asynchronously, by a given delta in x and y. "Asynchronously" here means that the initial mousedown
     * event is fired on the current tick, followed by any `beforeMouseMove` handler, and then a timeout is set, the
     * callback for which performs the mouse move, followed by a call to any `beforeMouseUp` handler.  Then another timeout
     * is set, the callback for which performs the mouseup and calls any `after` handler.
     * @param el Element to drag
     * @param x X delta
     * @param y Y delta
     * @param events Map of lifecycle event handlers
     * @public
     */
    aSyncDragNodeBy(el: Element, x: number, y: number, events?: EventHandlers): void;
    /**
     * Drags a node around, a random number of steps up to 50, by a random delta in x and y each time. After the node has
     * been randomly moved around, a mouseup event is fired.
     * @param el Element to drag around.
     * @param functionToAssertWhileDragging Optional function to call each time the element is moved.
     * @param assertMessage Message to supply to the assert while dragging function.
     * @public
     */
    dragANodeAround(el: HTMLElement, functionToAssertWhileDragging?: () => boolean, assertMessage?: string): void;
    /**
     * Drags a connection, using the mouse, from one element or endpoint to another element or endpoint.
     * @param d1
     * @param d2
     * @param mouseUpOnTarget If true, the mouseup event is posted on the target element. By default the mouseup event is fired on the document.
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    dragConnection(d1: Element | Endpoint, d2: Element | Endpoint, mouseUpOnTarget?: boolean, events?: EventHandlers<Connection>): Connection;
    /**
     * Drags a connection, using the mouse, from one element or endpoint to another element or endpoint, firing each stage after a timeout.
     * @param d1
     * @param d2
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    aSyncDragConnection(d1: Element | Endpoint, d2: Element | Endpoint, events?: EventHandlers<Connection>): void;
    /**
     * Drags a connection from the given endpoint or element, but aborts the operation by triggering a mouseup in whitespace.
     * @param d1
     * @public
     */
    dragAndAbortConnection(d1: Element | Endpoint): void;
    /**
     * Detach a connection from the given Endpoint by synthesizing a mousedown event, dragging to a distant point, and releasing the mouse.
     * @param e Endpoint to detach connection from
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachConnection(e: Endpoint, events?: EventHandlers): void;
    /**
     * Detach and reattach a connection from the given Endpoint by synthesizing a mousedown event, dragging to a distant point,
     * dragging it back to the endpoint, and releasing the mouse.
     * @param e Endpoint to detach and reattach connection from/to
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachAndReattachConnection(e: Endpoint, events?: EventHandlers): void;
    /**
     * Detach a connection by simulating the mouse dragging the target endpoint off and dropping it in whitespace.
     * @param c Connection to detach
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachConnectionByTarget(c: Connection, events?: EventHandlers): void;
    /**
     * Relocate the target of the given connection onto a different element
     * @param conn Connection to relocate target for
     * @param newEl DOM Element to drop the target ontp
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocateTarget(conn: Connection, newEl: Element, events?: EventHandlers): void;
    /**
     * Relocate either the source or the target of the given connection to a different element.
     * @param conn Connection to relocate
     * @param idx 0 for source, 1 for target
     * @param newEl The DOM element to drop the source/target onto.
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocate(conn: Connection, idx: number, newEl: Element, events?: EventHandlers): void;
    /**
     * Relocate the source of the given connection onto a different element
     * @param conn Connection to relocate target for
     * @param newEl DOM Element to drop the target ontp
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocateSource(conn: Connection, newEl: Element, events?: EventHandlers): void;
    /**
     * Create an object that models an event that occurs in the middle of the given element. This does not return
     * a real event, just an object with sufficient properties to use as a mouse event.
     * @param el
     * @public
     */
    makeEvent(el: Element): any;
    /**
     * Gets the DOM element used to represent the given Endpoint.
     * @param epOrEl
     * @public
     */
    getCanvas(epOrEl: any): any;
    /**
     * Gets the DOM element used to represent the given Endpoint.
     * @param ep
     * @public
     */
    getEndpointCanvas(ep: Endpoint): HTMLElement;
    /**
     * Gets the DOM element used to represent the given connection.
     * @param c
     * @public
     */
    getConnectionCanvas(c: Connection): HTMLElement;
    getEndpointCanvasPosition(ep: Endpoint): {
        x: number;
        y: number;
        w: string;
        h: string;
    };
    /**
     * Helper to test that a value is the same as some target, within our tolerance.
     * Sometimes the trigonometry stuff needs a little bit of leeway.
     */
    within(val: number, target: number, msg: string): void;
    /**
     * Asserts that the number of endpoints registered for a given element matches an expectation.
     * @param el Element to assert endpoint count for
     * @param count Expected number of endpoints
     * @public
     */
    assertManagedEndpointCount(el: Element, count: number): void;
    /**
     * Asserts that the number of connections registered for a given element matches an expectation.
     * @param el Element to assert connection count for
     * @param count Expected number of connections
     * @public
     */
    assertManagedConnectionCount(el: Element, count: number): void;
    /**
     * Fire one or more events on the DOM element that represents the given endpoint.
     * @param ep
     * @param events
     * @public
     */
    fireEventOnEndpoint(ep: Endpoint, ...events: Array<string>): void;
    /**
     * Fire one or more events on some DOM element
     * @param e
     * @param events
     * @public
     */
    fireEventOnElement(e: Element, ...events: Array<string>): void;
    /**
     * Fire one or more events on the DOM element that represents the given connection.
     * @param connection
     * @param events
     * @public
     */
    fireEventOnConnection(connection: Connection, ...events: Array<string>): void;
    /**
     * Fire a click event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    clickOnConnection(connection: Connection): void;
    /**
     * Fire a double click event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    dblClickOnConnection(connection: Connection): void;
    /**
     * Fire a tap event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    tapOnConnection(connection: Connection): void;
    /**
     * Fire a double tap event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    dblTapOnConnection(connection: Connection): void;
    /**
     * Fire a click event on the given element
     * @param element Element to fire click event on
     * @param clickCount Does not cause the event to be fired this number of times, but is set on the resulting Event object.
     * In some testing scenarios this ability is useful.
     * @public
     */
    clickOnElement(element: Element, clickCount?: number): void;
    /**
     * Fire a double click event on the given element
     * @param element
     * @public
     */
    dblClickOnElement(element: Element): void;
    /**
     * Fire a tap event (mousedown + mouseup) on the given element
     * @param element
     * @public
     */
    tapOnElement(element: Element): void;
    /**
     * Fire a double tap event (mousedown + mouseup, twice) on the given element
     * @param element
     * @public
     */
    dblTapOnElement(element: Element): void;
    /**
     * Gets the DOM element that represents the given overlay.
     * @param overlay
     * @public
     */
    getOverlayCanvas(overlay: Overlay): any;
    /**
     * Fire an event on an connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @param event Event to fire.
     * @public
     */
    fireEventOnOverlay(connection: Connection, overlayId: string, event: string): void;
    /**
     * Fire a click event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    clickOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Fire a double click event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    dblClickOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Fire a tap event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    tapOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Fire a double tap event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    dblTapOnOverlay(connection: Connection, overlayId: string): void;
    /**
     * Cleanup the support class, removing all created divs and destroying the associated jsplumb instance.
     */
    cleanup(): void;
    /**
     * Make a text node
     * @param s
     */
    makeContent(s: string): ChildNode;
    /**
     * Get the number of keys in an object
     * @param obj
     */
    length(obj: any): number;
    /**
     * Get the value corresponding to the first key found in an object.
     * @param obj
     */
    head(obj: any): any;
    /**
     * Get a UUID.
     */
    uuid(): string;
}
//# sourceMappingURL=test-support.d.ts.map
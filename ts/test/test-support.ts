import {EVENT_CLICK, EVENT_DBL_CLICK, EVENT_MOUSEDOWN, EVENT_MOUSEMOVE, EVENT_MOUSEUP} from "../browser-ui-renderer/constants"
import {EventManager} from "../browser-ui-renderer/event-manager"
import {Endpoint} from "../core/endpoint/endpoint"
import {Connection} from "../core/connector/connection-impl"
import {BrowserJsPlumbInstance} from "../browser-ui-renderer/browser-jsplumb-instance"
import {Overlay} from "../core/overlay/overlay"
import {uuid} from "../util/util"


function _randomEvent ():any {
    const x = Math.floor(Math.random() * 2000), y = Math.floor(Math.random() * 2000);
    return {
        clientX:x,
        clientY:y,
        screenX:x,
        screenY:y,
        pageX:x,
        pageY:y
    } as any
}

const _distantPointEvent:any = {
    clientX: 50000,
    clientY: 50000,
    screenX: 50000,
    screenY: 50000,
    pageX: 50000,
    pageY: 50000
}

/**
 * Defines a set of event handlers that can be supplied to various methods that simulate mouse activity.  Using these
 * you can inject tests into various parts of the lifecycle of a given operation.
 * @public
 */
export interface EventHandlers<T = any> {
    /**
     * Called before any activity occurs.
     */
    before?:()=>any
    /**
     * Called after a mousedown event has been posted but before the mouse has moved.
     */
    beforeMouseMove?:()=>any
    /**
     * Called after the mouse has moved but before the mouseup event has been posted.
     */
    beforeMouseUp?:()=>any
    /**
     * Called after the activity has been completed.
     * @param payload
     */
    after?:(payload?:T)=>any
}


//
// used for uuid generation
//
const lut:Array<string> = [];
for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

const VERY_SMALL_NUMBER = 0.00000000001;

export class BrowserUITestSupport {
    
    _divs:Array<string> = []
    mottle:EventManager
    
    private _t (el:Document |Element, evt:string, x:number, y:number) {
        this.mottle.trigger(el, evt, { pageX:x, pageY:y, screenX:x, screenY:y, clientX:x, clientY:y});
    }
    
    constructor(private _jsPlumb:BrowserJsPlumbInstance, private ok:(b:boolean, m:string) => any, private equal:(v1:any, v2:any, m?:string)=>any) {
        this.mottle = new EventManager();
    }

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
    addDiv (id:string, parent?:Element, className?:string, x?:number, y?:number, w?:number, h?:number):Element {
        const d1 = document.createElement("div");
        d1.style.position = "absolute";
        d1.innerHTML = id;
        if (parent) parent.appendChild(d1); else this._jsPlumb.getContainer().appendChild(d1);
        d1.setAttribute("id", id);
        d1.style.left = (x != null ? x : (Math.floor(Math.random() * 1000))) + "px";
        d1.style.top = (y!= null ? y : (Math.floor(Math.random() * 1000))) + "px";
        if (className) d1.className = className;
        if (w) d1.style.width = w + "px";
        if (h) d1.style.height = h + "px";
        this._divs.push(id);
        return d1;
    }
    
    addDivs (ids:Array<string>, parent?:Element) {
        for (let i = 0; i < ids.length; i++)
            this.addDiv(ids[i], parent);
    }

    assertEndpointCount (el:Element, count:number) {
        const ep = this._jsPlumb.getEndpoints(el),
            epl = ep ? ep.length : 0

        this.equal(epl, count, el.getAttribute("data-jtk-managed") + " has " + count + ((count > 1 || count == 0) ? " endpoints" : " endpoint"))
    };

    _assertManagedEndpointCount(el:Element, count:number) {
        var id = this._jsPlumb.getId(el),
            _mel = (this._jsPlumb as any)._managedElements[id];

        this.equal(_mel.endpoints.length, count, id + " has " + count + " endpoints in managed record")
    }

    _assertManagedConnectionCount (el:Element, count:number) {
        var id = this._jsPlumb.getId(el),
            _mel = (this._jsPlumb as any)._managedElements[id];

        this.equal(_mel.connections.length, count, id + " has " + count + " connections in managed record")
    }

    _registerDiv (div:string) {
        this._divs.push(div)
    }

    private makeDragStartEvt (el:any):Event {
        var e = this.makeEvent(el) as any, c = this._jsPlumb.getContainer()
        e.clientX += c.offsetLeft;
        e.screenX += c.offsetLeft;
        e.pageX += c.offsetLeft;
        e.clientY += c.offsetTop;
        e.screenY += c.offsetTop;
        e.pageY += c.offsetTop;
        return e;
    }

    getAttribute(el:Element, att:string) {
        return el.getAttribute(att);
    }

    /**
     * Drag an element by a given delta in x and y
     * @param el Element to drag
     * @param x X delta
     * @param y Y delta
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragNodeBy (el:Element, x:number, y:number, events?:EventHandlers) {
        events = events || {};
        if (events.before) events.before();
        const downEvent = this.makeEvent(el);
        this._jsPlumb.trigger(el, EVENT_MOUSEDOWN, downEvent);
        if (events.beforeMouseMove) {
            events.beforeMouseMove();
        }
        this._t(document, EVENT_MOUSEMOVE, downEvent.pageX + x, downEvent.pageY + y);
        if (events.beforeMouseUp) {
            events.beforeMouseUp();
        }
        this.mottle.trigger(document, EVENT_MOUSEUP, null);
        if (events.after) events.after();
    }

    /**
     * Drag an element to a given x and y location
     * @param el Element to drag
     * @param x X location to drag to
     * @param y Y location to drag to
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragNodeTo (el:Element, x:number, y:number, events?:EventHandlers) {
        events = events || {};
        const size = this._jsPlumb.viewport.getPosition(this._jsPlumb.getId(el));
        if (events.before) events.before();
        const downEvent = this.makeEvent(el);
        this._jsPlumb.trigger(el, EVENT_MOUSEDOWN, downEvent);

        const cb = this._jsPlumb.getContainer().getBoundingClientRect()

        if (events.beforeMouseMove) {
            events.beforeMouseMove();
        }
        this._t(document, EVENT_MOUSEMOVE, cb.x + x + (size.w / 2), cb.y + y + (size.h / 2));
        if (events.beforeMouseUp) {
            events.beforeMouseUp();
        }
        this.mottle.trigger(document, EVENT_MOUSEUP, null);
        if (events.after) events.after();
    }

    /**
     * Drag an element to a given group
     * @param el Element to drag
     * @param targetGroupId ID of the group to drag to
     * @param events Map of lifecycle event handlers
     * @public
     */
    dragToGroup (el:Element, targetGroupId:string, events?:EventHandlers) {
        const targetGroup = this._jsPlumb.getGroup(targetGroupId);
        const tgo = this._jsPlumb.viewport.getPosition(targetGroup.elId),
                tx = tgo.x + (tgo.w / 2),
                ty = tgo.y + (tgo.h / 2);

        this.dragNodeTo(el, tx, ty, events);
    }

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
    aSyncDragNodeBy (el:Element, x:number, y:number, events?:EventHandlers) {
        events = events || {}
        if (events.before) {
            events.before()
        }

        const downEvent = this.makeEvent(el);
        this._jsPlumb.trigger(el, EVENT_MOUSEDOWN, downEvent);
        if (events.beforeMouseMove) {
            events.beforeMouseMove();
        }
        setTimeout(() => {

            this._t(document, EVENT_MOUSEMOVE, downEvent.pageX + x, downEvent.pageY + y);
            if (events.beforeMouseUp) {
                events.beforeMouseUp();
            }

            setTimeout(() =>{
                this.mottle.trigger(document, EVENT_MOUSEUP, null);
                if (events.after) {
                    events.after();
                }
            }, 45)

        }, 45)

    }

    /**
     * Drags a node around, a random number of steps up to 50, by a random delta in x and y each time. After the node has
     * been randomly moved around, a mouseup event is fired.
     * @param el Element to drag around.
     * @param functionToAssertWhileDragging Optional function to call each time the element is moved.
     * @param assertMessage Message to supply to the assert while dragging function.
     * @public
     */
    dragANodeAround (el:HTMLElement, functionToAssertWhileDragging?:()=>boolean, assertMessage?:string) {
        this._jsPlumb.trigger(el, EVENT_MOUSEDOWN, this.makeEvent(el));
        const steps = Math.random() * 50;
        for (let i = 0; i < steps; i++) {
            const evt = _randomEvent() as any
            el.style.left = evt.screenX + "px";
            el.style.top= evt.screenY + "px";
            this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, evt);
        }

        if (functionToAssertWhileDragging) {
            this.ok(functionToAssertWhileDragging(), assertMessage || "while dragging assert");
        }

        this._jsPlumb.trigger(document, EVENT_MOUSEUP, _distantPointEvent);
    }

    /**
     * Drags a connection, using the mouse, from one element or endpoint to another element or endpoint.
     * @param d1
     * @param d2
     * @param mouseUpOnTarget If true, the mouseup event is posted on the target element. By default the mouseup event is fired on the document.
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    dragConnection (d1:Element|Endpoint, d2:Element|Endpoint, mouseUpOnTarget?:boolean, events?:EventHandlers<Connection>):Connection {
        const el1 = this.getCanvas(d1), el2 = this.getCanvas(d2);
        const e1 = this.makeEvent(el1), e2 = this.makeEvent(el2);
        events = events || {}

        const conns = this._jsPlumb.select().length;

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        if (events.beforeMouseMove) {
            events.beforeMouseMove()
        }
        this._jsPlumb.trigger(mouseUpOnTarget ? el2 : document, EVENT_MOUSEMOVE, e2);

        if (events.beforeMouseUp) {
            events.beforeMouseUp()
        }
        this._jsPlumb.trigger(mouseUpOnTarget ? el2 : document, EVENT_MOUSEUP, e2);

        return this._jsPlumb.select().get(conns);
    }

    /**
     * Drags a connection, using the mouse, from one element or endpoint to another element or endpoint, firing each stage after a timeout.
     * @param d1
     * @param d2
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    aSyncDragConnection (d1:Element|Endpoint, d2:Element|Endpoint, events?:EventHandlers<Connection>) {
        events = events || {}
        const el1 = this.getCanvas(d1), el2 = this.getCanvas(d2);
        const e1 = this.makeEvent(el1), e2 = this.makeEvent(el2);

        const conns = this._jsPlumb.select().length;

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);

        setTimeout(() => {
            if (events.beforeMouseMove) {
                events.beforeMouseMove()
            }
            this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, e2);
            setTimeout(() => {

                if (events.beforeMouseUp) {
                    events.beforeMouseUp()
                }

                this._jsPlumb.trigger(el2 , EVENT_MOUSEUP, e2);
                if (events.after) {
                    events.after(this._jsPlumb.select().get(conns));
                }
            }, 5)
        }, 5)

    }

    /**
     * Drags a connection from the given endpoint or element, but aborts the operation by triggering a mouseup in whitespace.
     * @param d1
     * @public
     */
    dragAndAbortConnection(d1:Element|Endpoint):void {
        const el1 = this.getCanvas(d1);
        const e1 = this.makeEvent(el1);

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, _distantPointEvent);
        this._jsPlumb.trigger(document, EVENT_MOUSEUP, _distantPointEvent);
    }

    /**
     * Detach a connection from the given Endpoint by synthesizing a mousedown event, dragging to a distant point, and releasing the mouse.
     * @param e Endpoint to detach connection from
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachConnection (e:Endpoint, events?:EventHandlers):void {
        events = events || {}
        const el1 = this.getEndpointCanvas(e)

        const e1 = this.makeEvent(el1);

        events.before && events.before()
        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        events.beforeMouseMove && events.beforeMouseMove()
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, _distantPointEvent);
        events.beforeMouseUp && events.beforeMouseUp()
        this._jsPlumb.trigger(document, EVENT_MOUSEUP, _distantPointEvent);
        events.after && events.after()
    }

    /**
     * Detach and reattach a connection from the given Endpoint by synthesizing a mousedown event, dragging to a distant point,
     * dragging it back to the endpoint, and releasing the mouse.
     * @param e Endpoint to detach and reattach connection from/to
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachAndReattachConnection (e:Endpoint, events?:EventHandlers):void {
        events = events || {}
        const el1 = this.getEndpointCanvas(e)
        const e1 = this.makeEvent(el1);
        events.before && events.before()
        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        events.beforeMouseMove && events.beforeMouseMove()
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, _distantPointEvent);
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, e1);
        events.beforeMouseUp && events.beforeMouseUp()
        this._jsPlumb.trigger(document, EVENT_MOUSEUP, e1);
        events.after && events.after()
    }

    /**
     * Detach a connection by simulating the mouse dragging the target endpoint off and dropping it in whitespace.
     * @param c Connection to detach
     * @param events Map of event handlers for injecting tests into the lifecycle.
     * @public
     */
    detachConnectionByTarget (c:Connection, events?:EventHandlers) {
        this.detachConnection(c.endpoints[1], events)
    }

    /**
     * Relocate the target of the given connection onto a different element
     * @param conn Connection to relocate target for
     * @param newEl DOM Element to drop the target ontp
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocateTarget (conn:Connection, newEl:Element, events?:EventHandlers) {
        this.relocate(conn, 1, newEl, events)
    }

    /**
     * Relocate either the source or the target of the given connection to a different element.
     * @param conn Connection to relocate
     * @param idx 0 for source, 1 for target
     * @param newEl The DOM element to drop the source/target onto.
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocate (conn:Connection, idx:number, newEl:Element, events?:EventHandlers) {
        events = events || {}

        // allow Endpoints to be passed in
        newEl = this.getCanvas(newEl)

        const el1 = this.getEndpointCanvas(conn.endpoints[idx])
        const e1 = this.makeEvent(el1)
        const e2 = this.makeEvent(newEl)

        events.before && events.before()

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1)
        events.beforeMouseMove && events.beforeMouseMove()
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, e2)
        events.beforeMouseUp && events.beforeMouseUp()
        this._jsPlumb.trigger(newEl, EVENT_MOUSEUP, e2)

        events.after && events.after()
    }

    /**
     * Relocate the source of the given connection onto a different element
     * @param conn Connection to relocate target for
     * @param newEl DOM Element to drop the target ontp
     * @param events Optional map of event handlers, allowing you to inject tests at various phases in the lifecycle
     * @public
     */
    relocateSource (conn:Connection, newEl:Element, events?:EventHandlers) {
        this.relocate(conn, 0, newEl, events)
    }

    /**
     * Create an object that models an event that occurs in the middle of the given element. This does not return
     * a real event, just an object with sufficient properties to use as a mouse event.
     * @param el
     * @public
     */
    makeEvent (el:Element):any {
        const b = el.getBoundingClientRect() as DOMRect
        const l = b.x + (b.width / 2),
            t = b.y + (b.height / 2)

        return {
            clientX: l,
            clientY: t,
            screenX: l,
            screenY: t,
            pageX: l,
            pageY: t
        } as any
    }

    /**
     * Gets the DOM element used to represent the given Endpoint.
     * @param epOrEl
     * @public
     */
    getCanvas (epOrEl:any) {
        if (epOrEl.endpoint) {
            return this.getEndpointCanvas(epOrEl);
        } else {
            return epOrEl;
        }
    }

    /**
     * Gets the DOM element used to represent the given Endpoint.
     * @param ep
     * @public
     */
    getEndpointCanvas (ep:Endpoint):HTMLElement {
        return (ep as any).endpoint.canvas;
    }

    /**
     * Gets the DOM element used to represent the given connection.
     * @param c
     * @public
     */
    getConnectionCanvas (c:Connection):HTMLElement {
        return (c as any).connector.canvas;
    }

    getEndpointCanvasPosition(ep:Endpoint) {
        const c = this.getEndpointCanvas(ep)
        return {
            x:parseInt(c.style.left, 10),
            y:parseInt(c.style.top, 10),
            w:c.getAttribute("width"),
            h:c.getAttribute("height")
        }
    }

    /**
     * Helper to test that a value is the same as some target, within our tolerance.
     * Sometimes the trigonometry stuff needs a little bit of leeway.
     */
    within (val:number, target:number, msg:string) {
        this.ok(Math.abs(val - target) < VERY_SMALL_NUMBER, msg + "[expected: " + target + " got " + val + "] [diff:" + (Math.abs(val - target)) + "]");
    }

    /**
     * Asserts that the number of endpoints registered for a given element matches an expectation.
     * @param el Element to assert endpoint count for
     * @param count Expected number of endpoints
     * @public
     */
    assertManagedEndpointCount (el:Element, count:number) {
        const  id = this._jsPlumb.getId(el),
            _mel = (this._jsPlumb as any)._managedElements[id];

        this.equal(_mel.endpoints.length, count, id + " has " + count + " endpoints in managed record")
    }

    /**
     * Asserts that the number of connections registered for a given element matches an expectation.
     * @param el Element to assert connection count for
     * @param count Expected number of connections
     * @public
     */
    assertManagedConnectionCount(el:Element, count:number) {
        const id = this._jsPlumb.getId(el),
            _mel = (this._jsPlumb as any)._managedElements[id];

        this.equal(_mel.connections.length, count, id + " has " + count + " connections in managed record")
    }

    /**
     * Fire one or more events on the DOM element that represents the given endpoint.
     * @param ep
     * @param events
     * @public
     */
    fireEventOnEndpoint (ep:Endpoint, ...events:Array<string>) {
        const canvas = this.getEndpointCanvas(ep)
        for (let i = 0; i < events.length; i++) {
            this._jsPlumb.trigger(canvas, events[i])
        }
    }

    /**
     * Fire one or more events on some DOM element
     * @param e
     * @param events
     * @public
     */
    fireEventOnElement(e:Element, ...events:Array<string>) {
        for (let i = 0; i < events.length; i++) {
            this._jsPlumb.trigger(e, events[i])
        }
    }

    /**
     * Fire one or more events on the DOM element that represents the given connection.
     * @param connection
     * @param events
     * @public
     */
    fireEventOnConnection (connection:Connection, ...events:Array<string>) {
        const canvas = this.getConnectionCanvas(connection)
        this.fireEventOnElement(canvas, ...events)
    }

    /**
     * Fire a click event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    clickOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_CLICK)
    }

    /**
     * Fire a double click event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    dblClickOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_DBL_CLICK)
    }

    /**
     * Fire a tap event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    tapOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_MOUSEDOWN)
        this.fireEventOnConnection(connection, EVENT_MOUSEUP)
    }

    /**
     * Fire a double tap event on the DOM element that represents the given connection.
     * @param connection
     * @public
     */
    dblTapOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_MOUSEDOWN)
        this.fireEventOnConnection(connection, EVENT_MOUSEUP)
        this.fireEventOnConnection(connection, EVENT_MOUSEDOWN)
        this.fireEventOnConnection(connection, EVENT_MOUSEUP)
    }

    /**
     * Fire a click event on the given element
     * @param element Element to fire click event on
     * @param clickCount Does not cause the event to be fired this number of times, but is set on the resulting Event object.
     * In some testing scenarios this ability is useful.
     * @public
     */
    clickOnElement(element:Element, clickCount?:number) {
        this._jsPlumb.trigger(element, EVENT_CLICK, null, null, clickCount == null ? 1 : clickCount)
    }

    /**
     * Fire a double click event on the given element
     * @param element
     * @public
     */
    dblClickOnElement(element:Element) {
        this._jsPlumb.trigger(element, EVENT_DBL_CLICK)
    }

    /**
     * Fire a tap event (mousedown + mouseup) on the given element
     * @param element
     * @public
     */
    tapOnElement(element:Element) {
        this._jsPlumb.trigger(element, EVENT_MOUSEDOWN)
        this._jsPlumb.trigger(element, EVENT_MOUSEUP)
    }

    /**
     * Fire a double tap event (mousedown + mouseup, twice) on the given element
     * @param element
     * @public
     */
    dblTapOnElement(element:Element) {
        this._jsPlumb.trigger(element, EVENT_MOUSEDOWN)
        this._jsPlumb.trigger(element, EVENT_MOUSEUP)
        this._jsPlumb.trigger(element, EVENT_MOUSEDOWN)
        this._jsPlumb.trigger(element, EVENT_MOUSEUP)
    }

    /**
     * Gets the DOM element that represents the given overlay.
     * @param overlay
     * @public
     */
    getOverlayCanvas (overlay:Overlay) {
        return (overlay as any).canvas || (overlay as any).path
    }

    /**
     * Fire an event on an connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @param event Event to fire.
     * @public
     */
    fireEventOnOverlay (connection:Connection, overlayId:string, event:string) {
        const overlay = connection.getOverlay(overlayId)
        const canvas = this.getOverlayCanvas(overlay)
        this._jsPlumb.trigger(canvas, event)
    }

    /**
     * Fire a click event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    clickOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_CLICK)
    }

    /**
     * Fire a double click event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    dblClickOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_DBL_CLICK)
    }

    /**
     * Fire a tap event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    tapOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEDOWN)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEUP)
    }

    /**
     * Fire a double tap event on a connection's overlay
     * @param connection Connection to which the overlay belongs
     * @param overlayId ID of the overlay to fire the event on
     * @public
     */
    dblTapOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEDOWN)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEUP)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEDOWN)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEUP)
    }

    /**
     * Cleanup the support class, removing all created divs and destroying the associated jsplumb instance.
     */
    cleanup() {

        var container = this._jsPlumb.getContainer();

        this._jsPlumb.destroy();

        for (let i in this._divs) {
            const d = document.getElementById(this._divs[i]);
            d && d.parentNode.removeChild(d);
        }
        this._divs.length = 0;

        const connCount = this._jsPlumb.select().length,
            epCount = this._jsPlumb.selectEndpoints().length,
            epElCount = container.querySelectorAll(".jtk-endpoint").length,
            connElCount = container.querySelectorAll(".jtk-connector").length;

        for (let k in container.__ta) {
            for (let kk in container.__ta[k]) {
                throw "Container event bindings not empty for key " + k;
            }
        }

        if (connCount > 0)
            throw "there are connections in the data model!";

        if (epCount > 0)
            throw "there are endpoints in the data model!";

        if (epElCount > 0) {
            throw "there are " + epElCount + " endpoints left in the dom!";
        }
        //
        if (connElCount > 0) {
            throw "there are " + connElCount + " connections left in the dom!";
        }

    }

    /**
     * Make a text node
     * @param s
     */
    makeContent (s:string) {
        const d = document.createElement("div")
        d.innerHTML = s
        return d.firstChild
    }

    /**
     * Get the number of keys in an object
     * @param obj
     */
    length (obj:any):number {
        let c = 0;
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                c++
            }
        }
        return c;
    }

    /**
     * Get the value corresponding to the first key found in an object.
     * @param obj
     */
    head (obj:any):any {
        for (let i in obj) {
            return obj[i]
        }
    }

    /**
     * Get a UUID.
     */
    uuid():string {
        return uuid()
     }
 }

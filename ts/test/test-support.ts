import {
    BrowserJsPlumbInstance,
    EVENT_CLICK, EVENT_DBL_CLICK,
    EVENT_MOUSEDOWN,
    EVENT_MOUSEMOVE,
    EVENT_MOUSEUP,
    EventManager
} from "@jsplumb/browser-ui"
import {Connection, Endpoint, Overlay, UIGroup} from "@jsplumb/core"
import { uuid } from "@jsplumb/util"

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


function _makeEventAt (l:number, t:number):any {
    return {
        clientX: l,
        clientY: t,
        screenX: l,
        screenY: t,
        pageX: l,
        pageY: t
    } as any
}



export interface EventHandlers<T = any> {
    before?:()=>any
    beforeMouseMove?:()=>any
    beforeMouseUp?:()=>any
    after?:(payload?:T)=>any
}





//
// helper method to cause a connection to be dragged via the mouse, but programmatically.
//


function countKeys (obj:any) {
    var i = 0;
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) i++;
    }
    return i;
}

const lut:Array<string> = [];
for (let i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

const VERY_SMALL_NUMBER = 0.00000000001;



export class BrowserUITestSupport {
    
    _divs:Array<string> = []
    mottle:EventManager
    
    _t (el:Document |Element, evt:string, x:number, y:number) {
        this.mottle.trigger(el, evt, { pageX:x, pageY:y, screenX:x, screenY:y, clientX:x, clientY:y});
    };
    
    constructor(private _jsPlumb:BrowserJsPlumbInstance, private ok:(b:boolean, m:string) => any, private equal:(v1:any, v2:any, m?:string)=>any) {
        this.mottle = new EventManager();
    }
    
    addDiv (id:string, parent?:Element, className?:string, x?:number, y?:number, w?:number, h?:number):Element {
        var d1 = document.createElement("div");
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
        var ep = this._jsPlumb.getEndpoints(el),
            epl = ep ? ep.length : 0;
        this.equal(epl, count, el.getAttribute("data-jtk-managed") + " has " + count + ((count > 1 || count == 0) ? " endpoints" : " endpoint"));
        //equal(_jsPlumb.anchorManager.getEndpointsFor(elId).length, count, "anchor manager has " + count + ((count > 1 || count == 0) ? " endpoints" : " endpoint") + " for " + elId);
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

    makeDragStartEvt (el:any):Event {
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

    isTargetAttribute = "data-jtk-target"
    isSourceAttribute =  "data-jtk-source"

    droppableClass = "jtk-droppable"

    dragNodeBy (el:Element, x:number, y:number, events?:EventHandlers) {
        events = events || {};
        if (events.before) events.before();
        var downEvent = this.makeEvent(el);
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

    dragNodeTo (el:Element, x:number, y:number, events?:EventHandlers) {
        events = events || {};
        var size = this._jsPlumb.getSize(el);
        if (events.before) events.before();
        var downEvent = this.makeEvent(el);
        this._jsPlumb.trigger(el, EVENT_MOUSEDOWN, downEvent);

        var cb = this._jsPlumb.getContainer().getBoundingClientRect()

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

    dragToGroup (el:Element, targetGroupId:string, events?:EventHandlers) {
        const targetGroup = this._jsPlumb.getGroup(targetGroupId);
        var tgo = this._jsPlumb.getOffset(targetGroup.el),
            tgs = this._jsPlumb.getSize(targetGroup.el),
            tx = tgo.x + (tgs.w / 2),
            ty = tgo.y + (tgs.h / 2);

        this.dragNodeTo(el, tx, ty, events);
    }

    aSyncDragNodeBy (el:Element, x:number, y:number, events?:EventHandlers) {
        events = events || {}
        if (events.before) {
            events.before()
        }

        var downEvent = this.makeEvent(el);
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

    dragANodeAround (el:any, functionToAssertWhileDragging?:()=>boolean, assertMessage?:string) {
        this._jsPlumb.trigger(el, EVENT_MOUSEDOWN, this.makeEvent(el));
        const steps = Math.random() * 50;
        for (var i = 0; i < steps; i++) {
            var evt = _randomEvent() as any
            el.style.left = evt.screenX + "px";
            el.style.top= evt.screenY + "px";
            this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, evt);
        }

        if (functionToAssertWhileDragging) {
            this.ok(functionToAssertWhileDragging(), assertMessage || "while dragging assert");
        }

        this._jsPlumb.trigger(document, EVENT_MOUSEUP, _distantPointEvent);
    }

    dragConnection (d1:any, d2:any, mouseUpOnTarget?:boolean):Connection {
        const el1 = this.getCanvas(d1), el2 = this.getCanvas(d2);
        const e1 = this.makeEvent(el1), e2 = this.makeEvent(el2);

        const conns = this._jsPlumb.select().length;

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        this._jsPlumb.trigger(mouseUpOnTarget ? el2 : document, EVENT_MOUSEMOVE, e2);
        this._jsPlumb.trigger(mouseUpOnTarget ? el2 : document, EVENT_MOUSEUP, e2);

        return this._jsPlumb.select().get(conns);
    }

    aSyncDragConnection (d1:any, d2:any, events?:EventHandlers<Connection>) {
        events = events || {}
        var el1 = this.getCanvas(d1), el2 = this.getCanvas(d2);
        var e1 = this.makeEvent(el1), e2 = this.makeEvent(el2);

        var conns = this._jsPlumb.select().length;

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

    dragAndAbortConnection (d1:any):void {
        this.dragAndAbort(d1)
    }

    dragAndAbort(d1:any):void {
        const el1 = this.getCanvas(d1);
        const e1 = this.makeEvent(el1);

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, _distantPointEvent);
        this._jsPlumb.trigger(document, EVENT_MOUSEUP, _distantPointEvent);
    }


    dragToDistantLand(d1:any):void {
        this.dragAndAbort(d1)
    }

    detachConnection (e:Endpoint, connIndex:number):void {
        var el1 = this.getEndpointCanvas(e),
            c = e.connections[connIndex];

        var e1 = this.makeEvent(el1);

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, _distantPointEvent);
        this._jsPlumb.trigger(document, EVENT_MOUSEUP, _distantPointEvent);
    }

    detachConnectionByTarget (c:Connection) {
        var idx = c.endpoints[1].connections.indexOf(c);
        this.detachConnection(c.endpoints[1], idx);
    }

    relocateTarget (conn:Connection, target:any, events?:EventHandlers) {
        this.relocate(conn, 1, target, events);
    }

    relocate (conn:Connection, idx:number, newEl:Element, events?:EventHandlers) {
        events = events || {};

        // allow Endpoints to be passed in
        newEl = this.getCanvas(newEl);

        var el1 = this.getEndpointCanvas(conn.endpoints[idx]);
        var e1 = this.makeEvent(el1);
        var e2 = this.makeEvent(newEl);

        events.before && events.before();

        this._jsPlumb.trigger(el1, EVENT_MOUSEDOWN, e1);
        events.beforeMouseMove && events.beforeMouseMove();
        this._jsPlumb.trigger(document, EVENT_MOUSEMOVE, e2);
        events.beforeMouseUp && events.beforeMouseUp();
        this._jsPlumb.trigger(newEl, EVENT_MOUSEUP, e2);

        events.after && events.after();
    }

    relocateSource (conn:Connection, source:any, events?:EventHandlers) {
        this.relocate(conn, 0, source, events);
    }

    makeEvent (el:Element):any {
        var b = el.getBoundingClientRect() as DOMRect
        var l = b.x + (b.width / 2),
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

    getCanvas (epOrEl:any) {
        if (epOrEl.endpoint) {
            return this.getEndpointCanvas(epOrEl);
        } else {
            return epOrEl;
        }
    }

    getEndpointCanvas (ep:Endpoint) {
        return (ep as any).endpoint.canvas;
    }

    getConnectionCanvas (c:Connection) {
        return (c as any).connector.canvas;
    }

    // helper to test that a value is the same as some target, within our tolerance
// sometimes the trigonometry stuff needs a little bit of leeway.
    within (val:number, target:number, msg:string) {
        this.ok(Math.abs(val - target) < VERY_SMALL_NUMBER, msg + "[expected: " + target + " got " + val + "] [diff:" + (Math.abs(val - target)) + "]");
    };

    // addDiv:_addDiv,
    // addDivs:_addDivs,
    // addDraggableDiv:_addDraggableDiv.bind(null, _jsPlumb),
    // assertEndpointCount:_assertEndpointCount.bind(null, _jsPlumb),

    // assertManagedEndpointCount:_assertManagedEndpointCount.bind(null, _jsPlumb),
    // assertManagedConnectionCount:_assertManagedConnecti
    // onCount.bind(null, _jsPlumb),

    assertManagedEndpointCount (el:Element, count:number) {
        var id = this._jsPlumb.getId(el),
            _mel = (this._jsPlumb as any)._managedElements[id];

        this.equal(_mel.endpoints.length, count, id + " has " + count + " endpoints in managed record")
    }

    assertManagedConnectionCount(el:Element, count:number) {
        var id = this._jsPlumb.getId(el),
            _mel = (this._jsPlumb as any)._managedElements[id];

        this.equal(_mel.connections.length, count, id + " has " + count + " connections in managed record")
    }

    fireEventOnEndpoint (ep:Endpoint, ...events:Array<string>) {
        var canvas = this.getEndpointCanvas(ep)
        for (let i = 0; i < events.length; i++) {
            this._jsPlumb.trigger(canvas, events[i])
        }
    }

    fireEventOnElement(e:Element, ...events:Array<string>) {
        for (let i = 0; i < events.length; i++) {
            this._jsPlumb.trigger(e, events[i])
        }
    }

    fireEventOnConnection (connection:Connection, ...events:Array<string>) {
        var canvas = this.getConnectionCanvas(connection)
        this.fireEventOnElement(canvas, ...events)
    }

    clickOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_CLICK)
    }
    
    dblClickOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_DBL_CLICK)
    }
    
    tapOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_MOUSEDOWN)
        this.fireEventOnConnection(connection, EVENT_MOUSEUP)
    }
    
    dblTapOnConnection(connection:Connection) {
        this.fireEventOnConnection(connection, EVENT_MOUSEDOWN)
        this.fireEventOnConnection(connection, EVENT_MOUSEUP)
        this.fireEventOnConnection(connection, EVENT_MOUSEDOWN)
        this.fireEventOnConnection(connection, EVENT_MOUSEUP)
    }

    clickOnElement(element:Element, clickCount?:number) {
        this._jsPlumb.trigger(element, EVENT_CLICK, null, null, clickCount == null ? 1 : clickCount)
    }
    
    dblClickOnElement(element:Element) {
        this._jsPlumb.trigger(element, EVENT_DBL_CLICK)
    }
    
    tapOnElement(element:Element) {
        this._jsPlumb.trigger(element, EVENT_MOUSEDOWN)
        this._jsPlumb.trigger(element, EVENT_MOUSEUP)
    }

    dblTapOnElement(element:Element) {
        this._jsPlumb.trigger(element, EVENT_MOUSEDOWN)
        this._jsPlumb.trigger(element, EVENT_MOUSEUP)
        this._jsPlumb.trigger(element, EVENT_MOUSEDOWN)
        this._jsPlumb.trigger(element, EVENT_MOUSEUP)
    }

    getOverlayCanvas (overlay:Overlay) {
        return (overlay as any).canvas || (overlay as any).path
    }

    fireEventOnOverlay (connection:Connection, overlayId:string, event:string) {
        var overlay = connection.getOverlay(overlayId)
        var canvas = this.getOverlayCanvas(overlay)
        this._jsPlumb.trigger(canvas, event)
    }

    clickOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_CLICK)
    }

    dblClickOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_DBL_CLICK)
    }

    tapOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEDOWN)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEUP)
    }

    dblTapOnOverlay(connection:Connection, overlayId:string) {
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEDOWN)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEUP)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEDOWN)
        this.fireEventOnOverlay(connection, overlayId, EVENT_MOUSEUP)
    }

    cleanup() {

        var container = this._jsPlumb.getContainer();

        this._jsPlumb.destroy();

        for (var i in this._divs) {
            var d = document.getElementById(this._divs[i]);
            d && d.parentNode.removeChild(d);
        }
        this._divs.length = 0;

        var connCount = this._jsPlumb.select().length,
            epCount = this._jsPlumb.selectEndpoints().length,
            epElCount = container.querySelectorAll(".jtk-endpoint").length,
            connElCount = container.querySelectorAll(".jtk-connector").length;

        for (var k in container.__ta) {
            for (var kk in container.__ta[k]) {
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

    makeContent (s:string) {
        var d = document.createElement("div");
        d.innerHTML = s;
        return d.firstChild;
    }

    length (obj:any):number {
        var c = 0;
        for (var i in obj) if (obj.hasOwnProperty(i)) c++;
        return c;
    }

    head (obj:any):any {
        for (var i in obj)
            return obj[i];
    }

    uuid():string {
        return uuid()
     }
 }


import { _attr,
    _node,
    ElementAttributes,
    _pos} from './svg-util'

import {DragManager} from "./drag-manager"
import {ElementDragHandler} from "./element-drag-handler"
import {EndpointDragHandler} from "./endpoint-drag-handler"
import {GroupDragHandler} from "./group-drag-handler"
import { jsPlumbDOMElement} from './element-facade'
import {
    addClass,
    consume, ElementType, ElementTypes,
    findParent,
    getClass, getElementType,
    getEventSource,
    hasClass, isNodeList, isSVGElement, offsetRelativeToRoot,
    removeClass, offsetSize,
    toggleClass, svgWidthHeightSize, svgXYPosition
} from "./browser-util"
import {EventManager, pageLocation} from "./event-manager"

import {
    DragHandlerOptions,
    DragStartEventParams,
    DragEventParams,
    DragStopEventParams,
    ContainmentType,
    BeforeStartEventParams, ConstrainFunction
} from './collicat'

import {HTMLElementOverlay} from "./html-element-overlay"
import {destroySVGOverlay, ensureSVGOverlayPath, paintSVGOverlay, SVGElementOverlay} from "./svg-element-overlay"
import {paintSvgConnector} from "./svg-element-connector"
import {SvgEndpoint} from "./svg-element-endpoint"
import {
    ATTRIBUTE_CONTAINER,
    EVENT_CONNECTION_MOUSEOUT,
    EVENT_CONNECTION_MOUSEOVER,
    EVENT_DBL_CLICK,
    EVENT_DBL_TAP,
    EVENT_ELEMENT_CLICK,
    EVENT_ELEMENT_DBL_TAP,
    EVENT_ELEMENT_MOUSE_OUT,
    EVENT_ELEMENT_MOUSE_OVER,
    EVENT_ELEMENT_TAP,
    EVENT_ENDPOINT_CLICK,
    EVENT_ENDPOINT_DBL_CLICK,
    EVENT_ENDPOINT_MOUSEOUT,
    EVENT_ENDPOINT_MOUSEOVER,
    EVENT_MOUSEOUT,
    EVENT_MOUSEOVER,
    EVENT_TAP,
    EVENT_ELEMENT_DBL_CLICK,
    EVENT_MOUSEENTER,
    EVENT_MOUSEEXIT,
    SELECTOR_ENDPOINT,
    SELECTOR_GROUP_CONTAINER,
    SELECTOR_OVERLAY,
    SELECTOR_CONNECTOR,
    PROPERTY_POSITION,
    EVENT_CONNECTION_CLICK,
    EVENT_CONNECTION_DBL_CLICK,
    EVENT_CONNECTION_DBL_TAP,
    EVENT_CONNECTION_TAP,
    EVENT_CLICK,
    ENDPOINT,
    CONNECTION,
    compoundEvent,
    EVENT_CONNECTION_MOUSEUP,
    EVENT_CONNECTION_MOUSEDOWN,
    EVENT_ENDPOINT_MOUSEUP,
    EVENT_ENDPOINT_MOUSEDOWN,
    EVENT_MOUSEUP,
    EVENT_MOUSEDOWN,
    EVENT_ELEMENT_MOUSE_MOVE,
    EVENT_MOUSEMOVE,
    EVENT_ELEMENT_MOUSE_UP,
    EVENT_ELEMENT_MOUSE_DOWN,
    EVENT_CONTEXTMENU,
    EVENT_CONNECTION_CONTEXTMENU, EVENT_ELEMENT_CONTEXTMENU
} from "./constants"
import {DragSelection} from "./drag-selection"
import {AbstractConnector} from "../core/connector/abstract-connector"
import {Overlay, OverlayMouseEventParams} from "../core/overlay/overlay"
import {Endpoint} from "../core/endpoint/endpoint"
import {isArrowOverlay} from "../core/overlay/arrow-overlay"
import {isDiamondOverlay} from "../core/overlay/diamond-overlay"
import {isPlainArrowOverlay} from "../core/overlay/plain-arrow-overlay"
import {EndpointRepresentation} from "../core/endpoint/endpoints"
import {isLabelOverlay, LabelOverlay} from "../core/overlay/label-overlay"
import {CustomOverlay, isCustomOverlay} from "../core/overlay/custom-overlay"
import {Component} from "../core/component/component"
import {
    ABSOLUTE,
    ATTRIBUTE_MANAGED,
    ATTRIBUTE_NOT_DRAGGABLE, CLASS_CONNECTOR, CLASS_ENDPOINT, CLASS_OVERLAY,
    FIXED,
    SELECTOR_MANAGED_ELEMENT,
    STATIC
} from "../core/constants"
import {Connection} from "../core/connector/connection-impl"
import {JsPlumbDefaults} from "../core/defaults"
import {DeleteConnectionOptions, JsPlumbInstance, ManagedElement} from "../core/core"
import {UIGroup} from "../core/group/group"
import {RedrawResult} from "../core/router/router"
import {BehaviouralTypeDescriptor, TypeDescriptor} from "../core/type-descriptors"
import {ConnectionDragSelector} from "../core/source-selector"
import {FALSE, PaintStyle, TRUE, UNDEFINED} from "../common/index"
import {
    BoundingBox,
    Extents,
    forEach,
    fromArray,
    Grid,
    isFunction,
    isString,
    log,
    PointXY,
    Size,
    uuid
} from "../util/util"

export interface UIComponent {
    canvas: HTMLElement
    svg:SVGElement
}

export type EndpointHelperFunctions<E> = {
    makeNode:(ep:E, paintStyle:PaintStyle) => void,
    updateNode: (ep:E, node:SVGElement) => void
}

const endpointMap:Record<string, EndpointHelperFunctions<any>> = {}
export function registerEndpointRenderer<C>(name:string, fns:EndpointHelperFunctions<C>) {
    endpointMap[name] = fns
}

/**
 * @internal
 * @param evt
 * @param el
 * @param zoom
 */
export function getPositionOnElement(evt:Event, el:Element, zoom:number):PointXY {
    const jel = el as jsPlumbDOMElement
    let box:any = typeof el.getBoundingClientRect !== UNDEFINED ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 },
        body = document.body,
        docElem = document.documentElement,
        scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
        scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        clientTop = docElem.clientTop || body.clientTop || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        pst = 0,
        psl = 0,
        top = box.top + scrollTop - clientTop + (pst * zoom),
        left = box.left + scrollLeft - clientLeft + (psl * zoom),
        cl = pageLocation(evt),
        w = box.width || (jel.offsetWidth * zoom),
        h = box.height || (jel.offsetHeight * zoom),
        x = (cl.x - left) / w,
        y = (cl.y  - top) / h

    return { x, y }
}

export interface DragOptions {
    containment?: ContainmentType
    start?: (params:DragStartEventParams) => void
    drag?: (params:DragEventParams) => void
    stop?: (params:DragStopEventParams) => void
    beforeStart?:(params:BeforeStartEventParams) => void
    cursor?: string
    zIndex?: number
    grid?:Grid
    trackScroll?:boolean
    filter?:string
}

/**
 * Defaults for the BrowserUI implementation of jsPlumb.
 * @public
 */
export interface BrowserJsPlumbDefaults extends JsPlumbDefaults<Element> {
    /**
     * Whether or not elements should be draggable. Default value is `true`.
     */
    elementsDraggable?: boolean

    /**
     * Options for dragging - containment, grid, callbacks etc.
     */
    dragOptions?: DragOptions

    /**
     * Specifies the CSS selector used to identify managed elements. This option is not something that most users of
     * jsPlumb will need to set.
     */
    managedElementsSelector?:string

    /**
     * Defaults to true, indicating that a ResizeObserver will be used, where available, to allow jsPlumb to revalidate elements
     * whose size in the DOM have been changed, without the library user having to call `revalidate()`
     */
    resizeObserver?:boolean

    //mutationObserver?:boolean
}

/**
 * @internal
 */
export interface jsPlumbDOMInformation {
    connector?:AbstractConnector
    endpoint?:Endpoint
    overlay?:Overlay
}

function isSVGElementOverlay(o:Overlay): o is SVGElementOverlay {
    return isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)
}

/**
 * Definition of a drag group membership - either just the id of a drag group, or the id of a drag group and whether or not
 * this element plays an `active` role in the drag group.
 * @public
 */
export type DragGroupSpec = string | { id:string, active:boolean }

function setVisible(component: UIComponent, v:boolean) {
    if (component.canvas) {
        component.canvas.style.display = v ? "block" : "none"
    }
}

function cleanup(component: UIComponent) {
    if (component.canvas) {
        component.canvas.parentNode.removeChild(component.canvas)
    }

    delete component.canvas
}

function getEndpointCanvas<C>(ep:EndpointRepresentation<C>):any {
    return (ep as any).canvas
}

function getLabelElement(o:LabelOverlay):jsPlumbDOMElement{
    return HTMLElementOverlay.getElement(o as any) as jsPlumbDOMElement
}

function getCustomElement(o:CustomOverlay):jsPlumbDOMElement {
    return HTMLElementOverlay.getElement(o as any, o.component, (c:Component) => {
        const el = o.create(c)
        o.instance.addClass(el, o.instance.overlayClass)
        return el
    }) as jsPlumbDOMElement
}

/**
 * @internal
 * @param desiredLoc
 * @param dragEl
 * @param constrainRect
 * @param size
 */
export function groupDragConstrain (desiredLoc:PointXY, dragEl:jsPlumbDOMElement, constrainRect:BoundingBox, size:Size):PointXY {
    let x = desiredLoc.x, y = desiredLoc.y

    if (dragEl._jsPlumbParentGroup && dragEl._jsPlumbParentGroup.constrain) {
        x = Math.max(desiredLoc.x, 0)
        y = Math.max(desiredLoc.y, 0)
        x = Math.min(x, constrainRect.w - size.w)
        y = Math.min(y, constrainRect.h - size.h)
    }

    return {x, y}
}


// typescript does not seem to know about this.
declare const ResizeObserver:any;
interface ResizeObserverImpl {
    observe(el:Element):void
    disconnect():void
    unobserve(el:Element):void
}
type ResizeObserverEntry = {target:Element, contentRect:{width:number, height:number}}
type ResizeObserverEntries = Array<ResizeObserverEntry>

// ------------------------------------------------------------------------------------------------------------

/**
 * JsPlumbInstance that renders to the DOM in a browser, and supports dragging of elements/connections.
 * @public
 */
export class BrowserJsPlumbInstance extends JsPlumbInstance<{E:Element}> {

    containerType:ElementType = null

    private readonly dragSelection:DragSelection
    dragManager:DragManager
    _connectorClick:Function
    _connectorDblClick:Function
    _connectorTap:Function
    _connectorDblTap:Function

    _endpointClick:Function
    _endpointDblClick:Function

    _overlayClick:Function
    _overlayDblClick:Function
    _overlayTap:Function
    _overlayDblTap:Function

    _connectorMouseover:Function
    _connectorMouseout:Function
    _endpointMouseover:Function
    _endpointMouseout:Function

    _connectorContextmenu:Function

    _connectorMousedown:Function
    _connectorMouseup:Function
    _endpointMousedown:Function
    _endpointMouseup:Function

    _overlayMouseover:Function
    _overlayMouseout:Function

    _elementClick:Function
    _elementTap:Function
    _elementDblTap:Function
    _elementMouseenter:Function
    _elementMouseexit:Function
    _elementMousemove:Function
    _elementMouseup:Function
    _elementMousedown:Function
    _elementContextmenu:Function

    private readonly _resizeObserver:ResizeObserverImpl
    //private readonly _mutationObserver:MutationObserver

    eventManager:EventManager

    draggingClass = "jtk-dragging"

    elementDraggingClass = "jtk-element-dragging"
    hoverClass = "jtk-hover"
    sourceElementDraggingClass = "jtk-source-element-dragging"
    targetElementDraggingClass = "jtk-target-element-dragging"

    hoverSourceClass = "jtk-source-hover"
    hoverTargetClass = "jtk-target-hover"

    dragSelectClass = "jtk-drag-select"

    managedElementsSelector:string

    /**
     * Whether or not elements should be draggable. This can be provided in the constructor arguments, or simply toggled on the
     * class. The default value is `true`.
     */
    elementsDraggable:boolean

    private elementDragHandler:ElementDragHandler

    private readonly groupDragOptions:DragHandlerOptions
    private readonly elementDragOptions:DragHandlerOptions

    constructor(public _instanceIndex:number, defaults?:BrowserJsPlumbDefaults) {
        super(_instanceIndex, defaults)

        defaults = defaults || {}

        // strictly speaking should not be necessary, but because of the way classes are written, the containerType member
        // of this class is initialised to null after the super call.
        this.containerType = getElementType(this.getContainer())

        // by default, elements are draggable
        this.elementsDraggable = defaults && defaults.elementsDraggable !== false

        this.managedElementsSelector = defaults ? (defaults.managedElementsSelector || SELECTOR_MANAGED_ELEMENT) : SELECTOR_MANAGED_ELEMENT

        this.eventManager = new EventManager()
        this.dragSelection = new DragSelection(this)
        this.dragManager = new DragManager(this, this.dragSelection)

        this.dragManager.addHandler(new EndpointDragHandler(this))
        this.groupDragOptions = {
            constrainFunction: groupDragConstrain
        }
        this.dragManager.addHandler(new GroupDragHandler(this, this.dragSelection), this.groupDragOptions)

        this.elementDragHandler = new ElementDragHandler(this, this.dragSelection)

        this.elementDragOptions = (defaults && defaults.dragOptions) || {}

        this.dragManager.addHandler(this.elementDragHandler, this.elementDragOptions)

        if (defaults && defaults.dragOptions && defaults.dragOptions.filter) {
            this.dragManager.addFilter(defaults.dragOptions.filter)
        }

        this._createEventListeners()
        this._attachEventDelegates()

        if (defaults.resizeObserver !== false) {
            try {
                this._resizeObserver = new ResizeObserver((entries: ResizeObserverEntries) => {
                    const updates = entries.filter((e: ResizeObserverEntry) => {
                        const a = this.getAttribute(e.target, ATTRIBUTE_MANAGED)
                        if (a != null) {
                            const v = this.viewport._elementMap.get(a)
                            return v ? v.w !== e.contentRect.width || v.h !== e.contentRect.height : false
                        } else {
                            return false
                        }
                    })

                    updates.forEach(el => this.revalidate(el.target))

                })
            } catch (e) {
                // ResizeObserver not available. Not fatal.
                log("WARN: ResizeObserver could not be attached.")
            }
        }

        // if (defaults.mutationObserver !== false) {
        //     try {
        //         this._mutationObserver = new MutationObserver((entries:Array<MutationRecord>) => {
        //             for (let i = 0; i < entries.length; i++) {
        //                 let m = entries[i]
        //                 if (m.removedNodes.length > 0) {
        //                     for(let j = 0; j < m.removedNodes.length; j++) {
        //                         const managedId = (m.removedNodes[j] as Element).getAttribute(ATTRIBUTE_MANAGED)
        //                         if (managedId != null) {
        //                             this.unmanage(m.removedNodes[j] as Element)
        //                         }
        //                     }
        //                 }
        //             }
        //         })
        //
        //         this._mutationObserver.observe(this.getContainer(), { childList:true})
        //     }
        //     catch (e) {
        //         log("WARN: MutationObserver could not be attached.")
        //     }
        // }
    }


    /**
     * Fire an event for an overlay, and for its related component.
     * @internal
     * @param overlay
     * @param event
     * @param e
     */
    private fireOverlayMethod(overlay:Overlay, event:string, e:MouseEvent) {
        const stem = overlay.component instanceof Connection ? CONNECTION : ENDPOINT
        const mappedEvent = compoundEvent(stem, event)

        // set the overlay on the event so that connection/endpoint handlers will know this event has already been fired, and
        // not to fire the event again
        ;(e as any)._jsPlumbOverlay = overlay
        overlay.fire<OverlayMouseEventParams>(event, { e, overlay })
        this.fire(mappedEvent, overlay.component, e)
    }

    /**
     * Adds a filter to the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter - CSS3 selector, or function that takes an element and returns true/false
     * @param exclude - If true, the filter is inverted: anything _but_ this value.
     * @public
     */
    addDragFilter(filter:Function|string, exclude?:boolean) {
        this.dragManager.addFilter(filter, exclude)
    }

    /**
     * Removes a filter from the list of filters used to determine whether or not a given event should start an element drag.
     * @param filter - CSS3 selector, or function that takes an element and returns true/false
     * @public
     */
    removeDragFilter(filter:Function|string) {
        this.dragManager.removeFilter(filter)
    }

    /**
     * Sets the grid that should be used when dragging elements.
     * @param grid - Grid to use.
     * @public
     */
    setDragGrid(grid:Grid) {
        this.dragManager.setOption(this.elementDragHandler, {
            grid:grid
        })
    }

    /**
     * Sets the function used to constrain the dragging of elements.
     * @param constrainFunction
     * @public
     */
    setDragConstrainFunction(constrainFunction:ConstrainFunction) {
        this.dragManager.setOption(this.elementDragHandler, { constrainFunction })
    }

    /**
     * @internal
     * @param element
     */
    _removeElement(element:Element):void {
        element.parentNode && element.parentNode.removeChild(element)
    }

    /**
     *
     * @param el
     * @param parent
     * @internal
     */
    _appendElement(el:Element, parent:Element):void {
        if (parent) {
            parent.appendChild(el)
        }
    }

    /**
     * @internal
     * @param group
     * @param el
     * @private
     */
    _appendElementToGroup(group: UIGroup<any>, el: Element): void {
        this.getGroupContentArea(group).appendChild(el)
    }

    /**
     * @internal
     * @param el
     * @private
     */
    _appendElementToContainer(el: Element): void {
        this._appendElement(el, this.getContainer())
    }

    /**
     *
     * @param el
     * @internal
     */
    _getAssociatedElements(el: Element): Array<Element> {
        let a:Array<Element> = []
        if ((el as any).nodeType !== 3 && (el as any).nodeType !== 8) {
            let els = el.querySelectorAll(SELECTOR_MANAGED_ELEMENT)
            Array.prototype.push.apply(a, els)
        }
        return a.filter((_a:Element) => (_a as any).nodeType !== 3 && (_a as any).nodeType !== 8 )
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true
    }

    /**
     * Gets the CSS class for the given element.
     * @param el
     * @public
     */
    getClass(el:Element):string { return getClass(el) }

    /**
     * Add one or more classes to the given element or list of elements.
     * @param el Element, or list of elements to which to add the class(es)
     * @param clazz A space separated list of classes to add.
     * @public
     */
    addClass(el:Element | NodeListOf<Element>, clazz:string):void {
        addClass(el, clazz)
    }

    /**
     * Returns whether or not the given element has the given class.
     * @param el
     * @param clazz
     * @public
     */
    hasClass(el:Element, clazz:string):boolean {
        return hasClass(el, clazz)
    }

    /**
     * Remove one or more classes from the given element or list of elements.
     * @param el Element, or list of elements from which to remove the class(es)
     * @param clazz A space separated list of classes to remove.
     * @public
     */
    removeClass(el:Element | NodeListOf<Element>, clazz:string):void {
        removeClass(el, clazz)
    }

    /**
     * Toggles one or more classes on the given element or list of elements.
     * @param el Element, or list of elements on which to toggle the class(es)
     * @param clazz A space separated list of classes to toggle.
     * @public
     */
    toggleClass(el:Element | NodeListOf<Element>, clazz:string):void {
        toggleClass(el, clazz)
    }

    /**
     * Sets an attribute on the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el
     * @param name
     * @param value
     * @public
     */
    setAttribute(el:Element, name:string, value:string):void {
        el.setAttribute(name, value)
    }

    /**
     * Gets an attribute from the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el
     * @param name
     * @public
     */
    getAttribute(el:Element, name:string):string {
        return el.getAttribute(name)
    }

    /**
     * Sets some attributes on the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el - Element to set attributes on
     * @param atts - Map of attributes to set.
     * @public
     */
    setAttributes(el:Element, atts:Record<string, string>) {
        for (let i in atts) {
            el.setAttribute(i, atts[i])
        }
    }

    /**
     * Remove an attribute from the given element. Exposed publically but mostly for internal use, to allow the core to abstract out
     * the details of how the UI is being rendered.
     * @param el - Element to remove an attribute from
     * @param attName - Name of the attribute to remove
     * @public
     */
    removeAttribute(el:Element, attName:string) {
        el.removeAttribute && el.removeAttribute(attName)
    }

    /**
     * Bind an event listener to the given element or elements.
     * @param el - Element, or elements, to bind the event listener to.
     * @param event - Name of the event to bind to.
     * @param callbackOrSelector - Either a callback function, or a CSS 3 selector. When this is a selector the event listener is bound as a "delegate", ie. the event listeners
     * listens to events on children of the given `el` that match the selector.
     * @param callback - Callback function for event. Only supplied when you're binding a delegated event handler.
     * @public
     */
    on (el:Document | Element | NodeListOf<Element>, event:string, callbackOrSelector:Function|string, callback?:Function) {

        const _one = (_el:Document|Element) => {
            if (callback == null) {
                this.eventManager.on(_el, event, callbackOrSelector)
            } else {
                this.eventManager.on(_el, event, callbackOrSelector, callback)
            }
        }

        if (isNodeList(el)) {
            forEach(el, (el:Element) => _one(el))
        } else {
            _one(el)
        }

        return this
    }

    /**
     * Remove an event binding from the given element or elements.
     * @param el - Element, or elements, from which to remove the event binding.
     * @param event - Name of the event to unbind.
     * @param callback - The function you wish to unbind.
     * @public
     */
    off (el:Document | Element | NodeListOf<Element>, event:string, callback:Function) {
        if (isNodeList(el)) {
            forEach(el, (_el:Element) => this.eventManager.off(_el, event, callback))
        } else {
            this.eventManager.off(el, event, callback)
        }
        return this
    }

    /**
     * Trigger an event on the given element.  Exposed publically but mostly intended for internal use.
     * @param el - Element to trigger the event on.
     * @param event - Name of the event to trigger.
     * @param originalEvent - Optional event that gave rise to this method being called.
     * @param payload - Optional `payload` to set on the Event that is created.
     * @param detail - Optional detail for the Event that is created.
     * @public
     */
    trigger(el:Document | Element, event:string, originalEvent?:Event, payload?:any, detail?:number) {
        this.eventManager.trigger(el, event, originalEvent, payload, detail)
    }

    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getOffsetRelativeToRoot(el:Element) {
        return offsetRelativeToRoot(el)
    }

    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     *
     * Places this is called:
     *
     * - dragToGroup in test support, to get the position of the target group
     * - `orphan` in group manager, to get an elements position relative to the group. since in this case we know its
     * a child of the group's content area we could theoretically use getBoundingClientRect here
     * - addToGroup in group manager, to find the position of some element that is about to be dropped
     * - addToGroup in group manager, to get the position of the content area of an uncollapsed group onto which an element is being dropped
     * - refreshElement, to get the current position of some element
     * - getOffset method in viewport (just does a pass through to the instance)
     * - onStop of group manager, when ghost proxy is active, to get the location of the original group's content area and the new group's content area
     * - onStart in drag manager, to get the position of an element that is about to be dragged
     * - onStart in drag manager, to get the position of an element's group parent when the element is about to be dragged (if the element is in a group)
     * - onStart in drag manager, to get the position of a group, when checking for target group's for the element that is about to be dragged
     * - onStart in drag manager, to get the position of all the elements in the current drag group (if there is one), so that they can be moved
     * relative to each other during the drag.
     *
     *
     */
    getOffset(el:Element):PointXY {
        const jel = el as unknown as jsPlumbDOMElement
        const container = this.getContainer()
        let out = this.getPosition(jel),
            op = ((el !== container && jel.offsetParent !== container) ? jel.offsetParent : null) as HTMLElement,
            _maybeAdjustScroll = (offsetParent: HTMLElement) => {
                if (offsetParent != null && offsetParent !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
                    out.x -= offsetParent.scrollLeft
                    out.y -= offsetParent.scrollTop
                }
            }

        // this block is used when the element we're trying to find an offset for is not a direct child of the container.
        // we recurse through offset parents, and also adjust for scroll if necessary (consider a child of some element that is
        // a list, which can be internally scrolled: to know with certainty the offset of some child relative to the container's
        // origin, it is necessary to adjust for scroll.
        // it could be the case that getBoundingClientRect() takes parent scroll into account though. This requires
        // investigation.
        while (op != null) {
            out.x += op.offsetLeft
            out.y += op.offsetTop
            _maybeAdjustScroll(op)
            op = (op.offsetParent === container ? null : op.offsetParent) as HTMLElement
        }

        // if container is scrolled and the element (or its offset parent) is not absolute or fixed, adjust accordingly.
        if (container != null && (container.scrollTop > 0 || container.scrollLeft > 0)) {

            // get the offset parent's position - fixed, absolute, relative or static
            let pp = jel.offsetParent != null ? this.getStyle(jel.offsetParent as HTMLElement, PROPERTY_POSITION) : STATIC,
                // get the element's position - fixed, absolute, relative or static
                p = this.getStyle(jel, PROPERTY_POSITION)
            if (p !== ABSOLUTE && p !== FIXED && pp !== ABSOLUTE && pp !== FIXED) {
                out.x -= container.scrollLeft
                out.y -= container.scrollTop
            }
        }

        return out
    }

    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el
     */
    getSize(el:Element):Size {
        const _el = el as any
        if (_el.offsetWidth != null) {
            return offsetSize(el as any)
        } else if (_el.width && _el.width.baseVal) {
            return svgWidthHeightSize(_el as SVGElement)
        }
    }

    /**
     * get the position of the given element, allowing for svg elements and html elements
     * @param el
     */
    getPosition(el:Element):PointXY {
        const _el = el as any
        if (_el.offsetLeft!= null) {
            return {
                x:parseFloat(_el.offsetLeft),
                y:parseFloat(_el.offsetTop)
            }
        } else if (_el.x && _el.x.baseVal) {
            return svgXYPosition(_el as SVGElement)
        }
    }

    /**
     * Gets a style property from some element.
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param el Element to get property from
     * @param prop Property to look up
     */
    getStyle(el:Element, prop:string):any {
        if (typeof window.getComputedStyle !== UNDEFINED) {
            return getComputedStyle(el, null).getPropertyValue(prop)
        } else {
            return (<any>el).currentStyle[prop]
        }
    }

    /**
     * Gets the element representing some group's content area.
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param group
     */
    getGroupContentArea(group: UIGroup<any>): Element {
        let da = this.getSelector(group.el, SELECTOR_GROUP_CONTAINER)
        return da && da.length > 0 ? da[0] : group.el
    }

    /**
     * Exposed on this class to assist core in abstracting out the specifics of the renderer.
     * @internal
     * @param ctx Either a string representing a selector, or an element. If a string, the container root is assumed to be the element context. Otherwise
     * the context is this value and the selector is the second arg to the method.
     * @param spec If `ctx` is an element, this is the selector
     */
    getSelector(ctx:string | Element, spec?:string):ArrayLike<jsPlumbDOMElement> {

        let sel:Array<jsPlumbDOMElement> = null
        if (arguments.length === 1) {
            if (!isString(ctx)) {

                let nodeList = document.createDocumentFragment()
                nodeList.appendChild(ctx as Element)
                return fromArray(nodeList.childNodes) as Array<jsPlumbDOMElement>
            }

            sel = fromArray(document.querySelectorAll(<string>ctx))
        }
        else {
            sel = fromArray((<Element>ctx).querySelectorAll(<string>spec))  as Array<jsPlumbDOMElement>
        }

        return sel
    }

    /**
     * Sets the position of the given element.
     * @param el Element to change position for
     * @param p New location for the element.
     * @internal
     */
    setPosition(el:Element, p:PointXY):void {
        const jel = el as jsPlumbDOMElement
        jel.style.left = p.x + "px"
        jel.style.top = p.y + "px"
    }

    /**
     * Helper method to set the draggable state of some element. Under the hood all this does is add/remove the `data-jtk-not-draggable` attribute.
     * @param element - Element to set draggable state for.
     * @param draggable
     * @public
     */
    setDraggable(element:Element, draggable:boolean) {
        if (draggable) {
            this.removeAttribute(element, ATTRIBUTE_NOT_DRAGGABLE)
        } else {
            this.setAttribute(element, ATTRIBUTE_NOT_DRAGGABLE, TRUE)
        }
    }

    /**
     * Helper method to get the draggable state of some element. Under the hood all this does is check for the existence of the `data-jtk-not-draggable` attribute.
     * @param el - Element to get draggable state for.
     * @public
     */
    isDraggable(el:Element):boolean {
        let d = this.getAttribute(el, ATTRIBUTE_NOT_DRAGGABLE)
        return d == null || d === FALSE
    }

    /*
     * Toggles the draggable state of the given element(s).
     * @param el - Element to toggle draggable state for.
     * @public
     */
    toggleDraggable (el:Element):boolean {
        let state = this.isDraggable(el)
        this.setDraggable(el, !state)
        return !state
    }

    private _createEventListeners() {
        const _connClick = function(event:string, e:MouseEvent) {
            if (!e.defaultPrevented && (e as any)._jsPlumbOverlay == null) {
                let connectorElement = findParent(getEventSource(e), SELECTOR_CONNECTOR, this.getContainer(), true)
                this.fire(event, connectorElement.jtk.connector.connection, e)
            }
        }
        this._connectorClick = _connClick.bind(this, EVENT_CONNECTION_CLICK)
        this._connectorDblClick = _connClick.bind(this, EVENT_CONNECTION_DBL_CLICK)
        this._connectorTap = _connClick.bind(this, EVENT_CONNECTION_TAP)
        this._connectorDblTap = _connClick.bind(this, EVENT_CONNECTION_DBL_TAP)

        const _connectorHover = function(state:boolean, e:MouseEvent) {
            const el = getEventSource(e).parentNode
            if (el.jtk && el.jtk.connector) {
                const connector = el.jtk.connector
                const connection = connector.connection
                this.setConnectorHover(connector, state)

                if (state) {
                    this.addClass(connection.source, this.hoverSourceClass)
                    this.addClass(connection.target, this.hoverTargetClass)
                } else {
                    this.removeClass(connection.source, this.hoverSourceClass)
                    this.removeClass(connection.target, this.hoverTargetClass)
                }

                this.fire(state ? EVENT_CONNECTION_MOUSEOVER : EVENT_CONNECTION_MOUSEOUT, el.jtk.connector.connection, e)
            }
        }

        this._connectorMouseover = _connectorHover.bind(this, true)
        this._connectorMouseout = _connectorHover.bind(this, false)

        const _connectorMouseupdown = function(state:boolean, e:MouseEvent) {
            const el = getEventSource(e).parentNode
            if (el.jtk && el.jtk.connector) {
                this.fire(state ? EVENT_CONNECTION_MOUSEUP: EVENT_CONNECTION_MOUSEDOWN, el.jtk.connector.connection, e)
            }
        }

        this._connectorMouseup = _connectorMouseupdown.bind(this, true)
        this._connectorMousedown = _connectorMouseupdown.bind(this, false)

        this._connectorContextmenu = function(e:MouseEvent) {
            const el = getEventSource(e).parentNode
            if (el.jtk && el.jtk.connector) {
                this.fire(EVENT_CONNECTION_CONTEXTMENU, el.jtk.connector.connection, e)
            }
        }.bind(this)

        // ---

        const _epClick = function(event:string, e:MouseEvent, endpointElement:jsPlumbDOMElement) {
            if (!e.defaultPrevented && (e as any)._jsPlumbOverlay == null) {
                this.fire(event, endpointElement.jtk.endpoint, e)
            }
        }

        this._endpointClick = _epClick.bind(this, EVENT_ENDPOINT_CLICK)
        this._endpointDblClick = _epClick.bind(this, EVENT_ENDPOINT_DBL_CLICK)

        const _endpointHover = function(state: boolean, e:MouseEvent) {
            const el = getEventSource(e)
            if (el.jtk && el.jtk.endpoint) {
                this.setEndpointHover(el.jtk.endpoint, state)
                this.fire(state ? EVENT_ENDPOINT_MOUSEOVER : EVENT_ENDPOINT_MOUSEOUT, el.jtk.endpoint, e)
            }
        }
        this._endpointMouseover = _endpointHover.bind(this, true)
        this._endpointMouseout = _endpointHover.bind(this, false)

        const _endpointMouseupdown = function(state:boolean, e:MouseEvent) {
            const el = getEventSource(e)
            if (el.jtk && el.jtk.endpoint) {
                this.fire(state ? EVENT_ENDPOINT_MOUSEUP: EVENT_ENDPOINT_MOUSEDOWN, el.jtk.endpoint, e)
            }
        }

        this._endpointMouseup = _endpointMouseupdown.bind(this, true)
        this._endpointMousedown = _endpointMouseupdown.bind(this, false)

        // ---

        const _oClick = function(method:string, e:MouseEvent) {
            let overlayElement = findParent(getEventSource(e), SELECTOR_OVERLAY, this.getContainer(), true)
            let overlay = overlayElement.jtk.overlay
            if (overlay) {
                this.fireOverlayMethod(overlay, method, e)
            }
        }.bind(this)

        this._overlayClick = _oClick.bind(this, EVENT_CLICK)
        this._overlayDblClick = _oClick.bind(this, EVENT_DBL_CLICK)
        this._overlayTap = _oClick.bind(this, EVENT_TAP)
        this._overlayDblTap = _oClick.bind(this, EVENT_DBL_TAP)

        const _overlayHover = function(state:boolean, e:MouseEvent) {
            let overlayElement = findParent(getEventSource(e), SELECTOR_OVERLAY, this.getContainer(), true)
            let overlay = overlayElement.jtk.overlay
            if (overlay) {
                this.setOverlayHover(overlay, state)
            }
        }

        this._overlayMouseover = _overlayHover.bind(this, true)
        this._overlayMouseout = _overlayHover.bind(this, false)

        // ---

        const _elementClick = function(event:string, e:MouseEvent, target:HTMLElement) {
            if (!e.defaultPrevented) {
                this.fire(e.detail === 1 ? EVENT_ELEMENT_CLICK : EVENT_ELEMENT_DBL_CLICK, target, e)
            }
        }
        this._elementClick = _elementClick.bind(this, EVENT_ELEMENT_CLICK)

        const _elementTap = function(event:string, e:MouseEvent, target:HTMLElement) {
            if (!e.defaultPrevented) {
                this.fire(EVENT_ELEMENT_TAP, target, e)
            }
        }
        this._elementTap = _elementTap.bind(this, EVENT_ELEMENT_TAP)

        const _elementDblTap = function(event:string, e:MouseEvent, target:HTMLElement) {
            if (!e.defaultPrevented) {
                this.fire(EVENT_ELEMENT_DBL_TAP, target, e)
            }
        }
        this._elementDblTap = _elementDblTap.bind(this, EVENT_ELEMENT_DBL_TAP)

        const _elementHover = function(state:boolean, e:MouseEvent) {
            this.fire(state ? EVENT_ELEMENT_MOUSE_OVER : EVENT_ELEMENT_MOUSE_OUT, getEventSource(e), e)
        }

        this._elementMouseenter = _elementHover.bind(this, true)
        this._elementMouseexit = _elementHover.bind(this, false)

        this._elementMousemove = function(e:MouseEvent) {
            this.fire(EVENT_ELEMENT_MOUSE_MOVE, getEventSource(e), e)
        }.bind(this)

        this._elementMouseup = function(e:MouseEvent) {
            this.fire(EVENT_ELEMENT_MOUSE_UP, getEventSource(e), e)
        }.bind(this)

        this._elementMousedown  = function(e:MouseEvent) {
            this.fire(EVENT_ELEMENT_MOUSE_DOWN, getEventSource(e), e)
        }.bind(this)

        this._elementContextmenu = function(e:MouseEvent) {
            this.fire(EVENT_ELEMENT_CONTEXTMENU, getEventSource(e), e)
        }.bind(this)
    }

    private _attachEventDelegates() {
        let currentContainer = this.getContainer()
        this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_OVERLAY, this._overlayClick)
        this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_OVERLAY, this._overlayDblClick)
        this.eventManager.on(currentContainer, EVENT_TAP, SELECTOR_OVERLAY, this._overlayTap)
        this.eventManager.on(currentContainer, EVENT_DBL_TAP, SELECTOR_OVERLAY, this._overlayDblTap)

        this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_CONNECTOR, this._connectorClick)
        this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_CONNECTOR, this._connectorDblClick)
        this.eventManager.on(currentContainer, EVENT_TAP, SELECTOR_CONNECTOR, this._connectorTap)
        this.eventManager.on(currentContainer, EVENT_DBL_TAP, SELECTOR_CONNECTOR, this._connectorDblTap)

        this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_ENDPOINT, this._endpointClick)
        this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_ENDPOINT, this._endpointDblClick)

        this.eventManager.on(currentContainer, EVENT_CLICK, this.managedElementsSelector, this._elementClick)
        this.eventManager.on(currentContainer, EVENT_TAP, this.managedElementsSelector, this._elementTap)
        this.eventManager.on(currentContainer, EVENT_DBL_TAP, this.managedElementsSelector, this._elementDblTap)

        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_CONNECTOR, this._connectorMouseover)
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_CONNECTOR, this._connectorMouseout)
        this.eventManager.on(currentContainer, EVENT_CONTEXTMENU, SELECTOR_CONNECTOR, this._connectorContextmenu)

        this.eventManager.on(currentContainer, EVENT_MOUSEUP, SELECTOR_CONNECTOR, this._connectorMouseup)
        this.eventManager.on(currentContainer, EVENT_MOUSEDOWN, SELECTOR_CONNECTOR, this._connectorMousedown)

        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_ENDPOINT, this._endpointMouseover)
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_ENDPOINT, this._endpointMouseout)

        this.eventManager.on(currentContainer, EVENT_MOUSEUP, SELECTOR_ENDPOINT, this._endpointMouseup)
        this.eventManager.on(currentContainer, EVENT_MOUSEDOWN, SELECTOR_ENDPOINT, this._endpointMousedown)

        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_OVERLAY, this._overlayMouseover)
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_OVERLAY, this._overlayMouseout)

        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_MANAGED_ELEMENT, this._elementMouseenter)
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_MANAGED_ELEMENT, this._elementMouseexit)

        this.eventManager.on(currentContainer, EVENT_MOUSEMOVE, SELECTOR_MANAGED_ELEMENT, this._elementMousemove)
        this.eventManager.on(currentContainer, EVENT_MOUSEUP, SELECTOR_MANAGED_ELEMENT, this._elementMouseup)
        this.eventManager.on(currentContainer, EVENT_MOUSEDOWN, SELECTOR_MANAGED_ELEMENT, this._elementMousedown)
        this.eventManager.on(currentContainer, EVENT_CONTEXTMENU, SELECTOR_MANAGED_ELEMENT, this._elementContextmenu)
    }

    private _detachEventDelegates() {
        let currentContainer = this.getContainer()
        if (currentContainer) {

            this.eventManager.off(currentContainer, EVENT_CLICK, this._connectorClick)
            this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._connectorDblClick)
            this.eventManager.off(currentContainer, EVENT_TAP, this._connectorTap)
            this.eventManager.off(currentContainer, EVENT_DBL_TAP, this._connectorDblTap)

            this.eventManager.off(currentContainer, EVENT_CLICK, this._endpointClick)
            this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._endpointDblClick)

            this.eventManager.off(currentContainer, EVENT_CLICK, this._overlayClick)
            this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._overlayDblClick)
            this.eventManager.off(currentContainer, EVENT_TAP, this._overlayTap)
            this.eventManager.off(currentContainer, EVENT_DBL_TAP, this._overlayDblTap)

            this.eventManager.off(currentContainer, EVENT_CLICK, this._elementClick)
            this.eventManager.off(currentContainer, EVENT_TAP, this._elementTap)
            this.eventManager.off(currentContainer, EVENT_DBL_TAP, this._elementDblTap)

            this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._connectorMouseover)
            this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._connectorMouseout)

            this.eventManager.off(currentContainer, EVENT_CONTEXTMENU, this._connectorContextmenu)

            this.eventManager.off(currentContainer, EVENT_MOUSEUP, this._connectorMouseup)
            this.eventManager.off(currentContainer, EVENT_MOUSEDOWN, this._connectorMousedown)

            this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._endpointMouseover)
            this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._endpointMouseout)

            this.eventManager.off(currentContainer, EVENT_MOUSEUP, this._endpointMouseup)
            this.eventManager.off(currentContainer, EVENT_MOUSEDOWN, this._endpointMousedown)

            this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._overlayMouseover)
            this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._overlayMouseout)

            this.eventManager.off(currentContainer, EVENT_MOUSEENTER, this._elementMouseenter)
            this.eventManager.off(currentContainer, EVENT_MOUSEEXIT, this._elementMouseexit)

            this.eventManager.off(currentContainer, EVENT_MOUSEMOVE, this._elementMousemove)
            this.eventManager.off(currentContainer, EVENT_MOUSEUP, this._elementMouseup)
            this.eventManager.off(currentContainer, EVENT_MOUSEDOWN, this._elementMousedown)
            this.eventManager.off(currentContainer, EVENT_CONTEXTMENU, this._elementContextmenu)
        }
    }

    /**
     * Sets the element this instance will use as the container for everything it adds to the UI. In normal use this method is
     * not expected to be called very often, if at all. The method is used by the instance constructor and also in certain situations by
     * the Toolkit edition.
     * @param newContainer
     * @public
     */
    setContainer(newContainer: Element): void {

        if ((newContainer  as any) === document || newContainer === document.body) {
            throw new Error("Cannot set document or document.body as container element")
        }

        this._detachEventDelegates()
        let dragFilters:Array<[string, boolean]>
        if (this.dragManager != null) {
            dragFilters = this.dragManager.reset()
        }

        this.setAttribute(newContainer, ATTRIBUTE_CONTAINER, uuid().replace("-", ""))

        // move all endpoints, connectors, and managed elements
        const currentContainer = this.getContainer()
        if (currentContainer != null) {
            currentContainer.removeAttribute(ATTRIBUTE_CONTAINER)
            const children = fromArray(currentContainer.childNodes).filter( (cn:Element) => {
                return cn != null && (((this.hasClass(cn, CLASS_CONNECTOR) ||  this.hasClass(cn, CLASS_ENDPOINT) || this.hasClass(cn, CLASS_OVERLAY)) ||
                    cn.getAttribute && cn.getAttribute(ATTRIBUTE_MANAGED) != null)
                )
            })

            forEach(children, (el:Element) => {
                newContainer.appendChild(el)
            })

            // if (this._mutationObserver != null) {
            //     this._mutationObserver.disconnect()
            // }
        }

        super.setContainer(newContainer)

        this.containerType = getElementType(newContainer)

        if (this.eventManager != null) {
            this._attachEventDelegates()
        }
        if (this.dragManager != null) {
            this.dragManager.addHandler(new EndpointDragHandler(this))
            this.dragManager.addHandler(new GroupDragHandler(this, this.dragSelection), this.groupDragOptions)
            this.elementDragHandler = new ElementDragHandler(this, this.dragSelection)
            this.dragManager.addHandler(this.elementDragHandler, this.elementDragOptions)
            if (dragFilters != null) {
                this.dragManager.setFilters(dragFilters)
            }
        }

        // if (this._mutationObserver != null) {
        //     this._mutationObserver.observe(newContainer, { childList:true})
        // }
    }

    /**
     * Clears all endpoints and connections and managed elements from the instance of jsplumb. Does not also clear out event listeners, selectors, or
     * connection/endpoint types - for that, use `destroy()`.
     * @public
     */
    reset() {
        super.reset()
        if(this._resizeObserver) {
            this._resizeObserver.disconnect()
        }
        // if (this._mutationObserver != null) {
        //     this._mutationObserver.disconnect()
        // }
        const container = this.getContainer()
        const els = container.querySelectorAll([SELECTOR_MANAGED_ELEMENT, SELECTOR_ENDPOINT, SELECTOR_CONNECTOR, SELECTOR_OVERLAY].join(","))
        forEach(els,(el:any) => el.parentNode && el.parentNode.removeChild(el))
    }

    /**
     * Clears the instance and unbinds any listeners on the instance. After you call this method you cannot use this
     * instance of jsPlumb again.
     * @public
     */
    destroy(): void {

        this._detachEventDelegates()

        if (this.dragManager != null) {
            this.dragManager.reset()
        }

        this.clearDragSelection()

        super.destroy()
    }

    /**
     * Stops managing the given element.
     * @param el - Element, or ID of the element to stop managing.
     * @param removeElement - If true, also remove the element from the renderer.
     * @public
     */
    unmanage (el:Element, removeElement?:boolean):void {
        if (this._resizeObserver != null) {
            this._resizeObserver.unobserve(el)
        }
        this.removeFromDragSelection(el)
        super.unmanage(el, removeElement)
    }

    /**
     * Adds the given element(s) to the current drag selection.
     * @param el
     * @public
     */
    addToDragSelection(...el:Array<Element>) {
        forEach(el, (_el) => this.dragSelection.add(_el))
    }

    /**
     * Clears the current drag selection
     * @public
     */
    clearDragSelection() {
        this.dragSelection.clear()
    }

    /**
     * Removes the given element(s) from the current drag selection
     * @param el
     * @public
     */
    removeFromDragSelection(...el:Array<Element>) {
        forEach(el, (_el) => this.dragSelection.remove(_el))
    }

    /**
     * Toggles membership in the current drag selection of the given element(s)
     * @param el
     * @public
     */
    toggleDragSelection(...el:Array<Element>) {
        forEach(el,(_el) => this.dragSelection.toggle(_el))
    }


    // ------------ drag groups

    /**
     * Adds the given element(s) to the given drag group.
     * @param spec Either the ID of some drag group, in which case the elements are all added as 'active', or an object of the form
     * { id:"someId", active:boolean }. In the latter case, `active`, if true, which is the default, indicates whether
     * dragging the given element(s) should cause all the elements in the drag group to be dragged. If `active` is false it means the
     * given element(s) is "passive" and should only move when an active member of the drag group is dragged.
     * @param els Elements to add to the drag group.
     * @public
     */
    addToDragGroup(spec:DragGroupSpec, ...els:Array<Element>) {
        this.elementDragHandler.addToDragGroup(spec, ...els)
    }

    /**
     * Removes the given element(s) from any drag group they may be in. You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param els Elements to remove from drag groups.
     * @public
     */
    removeFromDragGroup(...els:Array<Element>) {
        this.elementDragHandler.removeFromDragGroup(...els)
    }

    /**
     * Sets the active/passive state for the given element(s) in their respective drag groups (if any). You don't need to supply the drag group id, as elements
     * can only be in one drag group anyway.
     * @param state true for active, false for passive.
     * @param els
     * @public
     */
    setDragGroupState (state:boolean, ...els:Array<Element>) {
        this.elementDragHandler.setDragGroupState(state, ...els)
    }

    /**
     * Removes all members from the drag group with the given name.
     * @param name
     * @public
     */
    clearDragGroup(name:string) {
        this.elementDragHandler.clearDragGroup(name)
    }

    /**
     * Consumes the given event.
     * @param e
     * @param doNotPreventDefault
     * @public
     */
    consume (e:Event, doNotPreventDefault?:boolean) {
        consume(e, doNotPreventDefault)
    }

    /**
     * Rotates the given element. This method overrides the same method from the superclass: the superclass only makes a note
     * of the current rotation for the given element, but in this class the element has appropriate CSS transforms applied to it
     * to effect the rotation in the DOM.
     * @param element - Element to rotate.
     * @param rotation - Rotation, in degrees.
     * @param doNotRepaint - If true, a repaint is not done afterwards. Defaults to false.
     * @public
     */
    rotate(element: Element, rotation: number, doNotRepaint?: boolean):RedrawResult {
        const elementId = this.getId(element)
        if (this._managedElements[elementId]) {
            (this._managedElements[elementId].el as jsPlumbDOMElement).style.transform = "rotate(" + rotation + "deg)";
            (this._managedElements[elementId].el as jsPlumbDOMElement).style.transformOrigin = "center center"
            return super.rotate(element, rotation, doNotRepaint)
        }

        return { c:new Set(), e:new Set() }
    }

    svg = {
        node: (name:string, attributes?:ElementAttributes) => _node(name, attributes),
        attr:(node:SVGElement, attributes:ElementAttributes) => _attr (node, attributes),
        pos:(d:[number, number]):string => _pos(d)
    }

    /**
     * @internal
     * @param o
     * @param clazz
     */
    addOverlayClass(o: Overlay, clazz: string): void {

        if (isLabelOverlay(o)) {
            o.instance.addClass(getLabelElement(o), clazz)
        } else if (isSVGElementOverlay(o)) {
            o.instance.addClass(ensureSVGOverlayPath(o), clazz)
        } else if (isCustomOverlay(o)) {
            o.instance.addClass(getCustomElement(o), clazz)
        } else {
            throw "Could not add class to overlay of type [" + o.type + "]"
        }
    }

    /**
     * @internal
     * @param o
     * @param clazz
     */
    removeOverlayClass(o: Overlay, clazz: string): void {
        if (isLabelOverlay(o)) {
            o.instance.removeClass(getLabelElement(o), clazz)
        } else if (isSVGElementOverlay(o)) {
            o.instance.removeClass(ensureSVGOverlayPath(o), clazz)
        } else if (isCustomOverlay(o)) {
            o.instance.removeClass(getCustomElement(o), clazz)
        } else {
            throw "Could not remove class from overlay of type [" + o.type + "]"
        }
    }

    /**
     * @internal
     * @param o
     * @param params
     * @param extents
     */
    _paintOverlay(o: Overlay, params:any, extents:any):void {

        //
        if (isLabelOverlay(o)) {

            getLabelElement(o)

            const XY = o.component.getXY();

            (o as any).canvas.style.left = XY.x + params.d.minx + "px";
            (o as any).canvas.style.top = XY.y + params.d.miny + "px"

        } else if (isSVGElementOverlay(o)) {

            const path = (isNaN(params.d.cxy.x) || isNaN(params.d.cxy.y)) ? "M 0 0" : "M" + params.d.hxy.x + "," + params.d.hxy.y +
                " L" + params.d.tail[0].x + "," + params.d.tail[0].y +
                " L" + params.d.cxy.x + "," + params.d.cxy.y +
                " L" + params.d.tail[1].x + "," + params.d.tail[1].y + " Z"

            paintSVGOverlay(o, path, params, extents)

        } else if (isCustomOverlay(o)) {
            getCustomElement(o)

            const XY = o.component.getXY();

            (o as any).canvas.style.left = XY.x + params.d.minx + "px"; // wont work for endpoint. abstracts
            (o as any).canvas.style.top = XY.y + params.d.miny + "px"
        } else {
            throw "Could not paint overlay of type [" + o.type + "]"
        }
    }

    /**
     * Sets the visibility of some overlay.
     * @param o - Overlay to hide or show
     * @param visible - If true, make the overlay visible, if false, make the overlay invisible.
     */
    setOverlayVisible(o: Overlay, visible:boolean):void {
        const d = visible ? "block" : "none"
        function s(el:any) {
            if (el != null) {
                el.style.display = d
            }
        }
        if (isLabelOverlay(o)) {
            s(getLabelElement(o))
        }
        else if (isCustomOverlay(o)) {
            s(getCustomElement(o))
        } else if (isSVGElementOverlay(o)) {
            s(o.path)
        }
    }

    /**
     * @internal
     * @param o
     * @param c
     */
    reattachOverlay(o: Overlay, c: Component): void {
        if (isLabelOverlay(o)) {
            o.instance._appendElement(getLabelElement(o), this.getContainer())
        } else if (isCustomOverlay(o)) {
            o.instance._appendElement(getCustomElement(o), this.getContainer())
        }
        else if (isSVGElementOverlay(o)){
            this._appendElement(ensureSVGOverlayPath(o), (c as any).connector.canvas)
        }
    }

    /**
     * @internal
     * @param o
     * @param hover
     */
    setOverlayHover(o: Overlay, hover: boolean): void {

        let canvas:Element

        if (isLabelOverlay(o)) {
            canvas = getLabelElement(o)
        } else if (isCustomOverlay(o)) {
            canvas = getCustomElement(o)
        }
        else if (isSVGElementOverlay(o)){
            canvas = ensureSVGOverlayPath(o)
        }

        if (canvas != null) {
            if (this.hoverClass != null) {
                if (hover) {
                    this.addClass(canvas, this.hoverClass)
                } else {
                    this.removeClass(canvas, this.hoverClass)
                }
            }

            this.setHover(o.component, hover)
        }
    }

    /**
     * @internal
     * @param o
     */
    destroyOverlay(o: Overlay):void {
        if (isLabelOverlay(o)) {
            const el = getLabelElement(o)
            el.parentNode.removeChild(el)
            delete (o as any).canvas
            delete (o as any).cachedDimensions
        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)){
            destroySVGOverlay(o)
        } else if (isCustomOverlay(o)) {
            const el = getCustomElement(o)
            el.parentNode.removeChild(el)
            delete (o as any).canvas
            delete (o as any).cachedDimensions
        }
    }

    // TODO remove `any` here,
    /**
     * @internal
     * @param o
     * @param component
     * @param paintStyle
     * @param absolutePosition
     */
    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: PointXY): any {
        if (isLabelOverlay(o) || isCustomOverlay(o)) {

            //  TO DO - move to a static method, or a shared method, etc.  (? future me doesnt know what that means.)

            let td = HTMLElementOverlay._getDimensions(o as any);
            if (td != null && td.w != null && td.h != null) {

                let cxy = {x: 0, y: 0}
                if (absolutePosition) {
                    cxy = {x: absolutePosition.x, y: absolutePosition.y}
                } else if (component instanceof EndpointRepresentation) {
                    let locToUse:Array<number> = Array.isArray(o.location) ? o.location as Array<number> : [o.location, o.location] as Array<number>
                    cxy = {
                        x: locToUse[0] * component.w,
                        y: locToUse[1] * component.h
                    }
                } else {
                    let loc = o.location, absolute = false
                    if (isString(o.location) || o.location < 0 || o.location > 1) {
                        loc = parseInt("" + o.location, 10)
                        absolute = true
                    }
                    cxy = (<any>component).pointOnPath(loc as number, absolute);  // a connection
                }

                let minx = cxy.x - (td.w / 2),
                    miny = cxy.y - (td.h / 2)

                return {
                    component: o,
                    d: {minx: minx, miny: miny, td: td, cxy: cxy},
                    xmin: minx,
                    xmax: minx + td.w,
                    ymin: miny,
                    ymax: miny + td.h
                }
            }
            else {
                return {xmin: 0, xmax: 0, ymin: 0, ymax: 0}
            }

        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
            return o.draw(component, paintStyle, absolutePosition)
        } else {
            throw "Could not draw overlay of type [" + o.type + "]"
        }
    }

    /**
     * @internal
     * @param o
     */
    updateLabel(o: LabelOverlay): void {

        if (isFunction(o.label)) {
            let lt = (o.label)(this)
            if (lt != null) {
                getLabelElement(o).innerText = lt
            } else {
                getLabelElement(o).innerText = ""
            }
        }
        else {
            if (o.labelText == null) {
                o.labelText = o.label as string
                if (o.labelText != null) {
                    getLabelElement(o).innerText = o.labelText
                } else {
                    getLabelElement(o).innerText = ""
                }
            }
        }
    }

    /**
     * @internal
     * @param component
     * @param hover
     */
    setHover(component: Component, hover: boolean): void {
        component._hover = hover
        if (component instanceof Endpoint && (component as Endpoint).endpoint != null) {
            this.setEndpointHover((component as Endpoint), hover, -1)
        } else if (component instanceof Connection && (component as Connection).connector != null) {
            this.setConnectorHover((component as Connection).connector, hover)
        }
    }

    // ------------------------------- connectors ---------------------------------------------------------

    /**
     * @internal
     * @param connector
     * @param paintStyle
     * @param extents
     */
    paintConnector(connector:AbstractConnector, paintStyle:PaintStyle, extents?:Extents):void {
        paintSvgConnector(this, connector, paintStyle, extents)
    }

    /**
     * @internal
     * @param connector
     * @param hover
     * @param sourceEndpoint
     */
    setConnectorHover(connector:AbstractConnector, hover:boolean, sourceEndpoint?:Endpoint):void {
        if (hover === false || (!this.currentlyDragging && !this.isHoverSuspended())) {

            const canvas = (connector as any).canvas

            if (canvas != null) {
                if (connector.hoverClass != null) {
                    if (hover) {
                        this.addClass(canvas, connector.hoverClass)
                    } else {
                        this.removeClass(canvas, connector.hoverClass)
                    }
                }

                if (hover) {
                    this.addClass(canvas, this.hoverClass)
                } else {
                    this.removeClass(canvas, this.hoverClass)
                }
            }
            if (connector.connection.hoverPaintStyle != null) {
                connector.connection.paintStyleInUse = hover ? connector.connection.hoverPaintStyle : connector.connection.paintStyle
                if (!this._suspendDrawing) {
                    this._paintConnection(connector.connection)
                }
            }

            if (connector.connection.endpoints[0] !== sourceEndpoint) {
                this.setEndpointHover(connector.connection.endpoints[0], hover, 0, true)
            }

            if (connector.connection.endpoints[1] !== sourceEndpoint) {
                this.setEndpointHover(connector.connection.endpoints[1], hover, 1, true)
            }
        }
    }

    /**
     * @internal
     * @param connection
     */
    destroyConnector(connection:Connection):void {
        if (connection.connector != null) {
            cleanup(connection.connector as any)
        }
    }

    /**
     * @internal
     * @param connector
     * @param clazz
     */
    addConnectorClass(connector:AbstractConnector, clazz:string):void {
        if ((connector as any).canvas) {
            this.addClass((connector as any).canvas, clazz)
        }
    }

    /**
     * @internal
     * @param connector
     * @param clazz
     */
    removeConnectorClass(connector:AbstractConnector, clazz:string):void {
        if ((connector as any).canvas) {
            this.removeClass((connector as any).canvas, clazz)
        }
    }

    /**
     * @internal
     * @param connector
     */
    getConnectorClass(connector: AbstractConnector): string {
        if ((connector as any).canvas) {
            return (connector as any).canvas.className.baseVal
        } else {
            return ""
        }
    }

    /**
     * @internal
     * @param connector
     * @param v
     */
    setConnectorVisible(connector:AbstractConnector, v:boolean):void {
        setVisible(connector as any, v)
    }

    /**
     * @internal
     * @param connector
     * @param t
     */
    applyConnectorType(connector:AbstractConnector, t:TypeDescriptor):void {
        if ((connector as any).canvas && t.cssClass) {
            const classes = Array.isArray(t.cssClass) ? t.cssClass as Array<string> : [ t.cssClass ]
            this.addClass((connector as any).canvas, classes.join(" "))
        }
    }

    /**
     * @internal
     * @param ep
     * @param c
     */
    addEndpointClass(ep: Endpoint, c: string): void {
        const canvas = getEndpointCanvas(ep.endpoint)
        if (canvas != null) {
            this.addClass(canvas, c)
        }
    }

    /**
     * @internal
     * @param ep
     * @param t
     */
    applyEndpointType<C>(ep: Endpoint, t: TypeDescriptor): void {
        if(t.cssClass) {
            const canvas = getEndpointCanvas(ep.endpoint)
            if (canvas) {
                const classes = Array.isArray(t.cssClass) ? t.cssClass as Array<string> : [t.cssClass]
                this.addClass(canvas, classes.join(" "))
            }
        }
    }

    /**
     * @internal
     * @param ep
     */
    destroyEndpoint(ep: Endpoint): void {
        let anchorClass = this.endpointAnchorClassPrefix + (ep.currentAnchorClass ? "-" + ep.currentAnchorClass : "")
        this.removeClass(ep.element, anchorClass)
        cleanup(ep.endpoint as any)
    }

    /**
     * @internal
     * @param ep
     * @param paintStyle
     */
    renderEndpoint(ep: Endpoint, paintStyle: PaintStyle): void {
        const renderer = endpointMap[ep.endpoint.type]
        if (renderer != null) {
            SvgEndpoint.paint(ep.endpoint, renderer, paintStyle)
        } else {
            log("jsPlumb: no endpoint renderer found for type [" + ep.endpoint.type + "]")
        }
    }

    /**
     * @internal
     * @param ep
     * @param c
     */
    removeEndpointClass(ep: Endpoint, c: string): void {
        const canvas = getEndpointCanvas(ep.endpoint)
        if (canvas != null) {
            this.removeClass(canvas, c)
        }
    }

    /**
     * @internal
     * @param ep
     */
    getEndpointClass(ep: Endpoint): string {
        const canvas = getEndpointCanvas(ep.endpoint)
        if (canvas != null) {
            return canvas.className
        } else {
            return ""
        }
    }

    /**
     * @internal
     * @param endpoint
     * @param hover
     * @param endpointIndex Optional (though you must provide a value) index that identifies whether the endpoint being hovered is the source
     * or target of some connection. A value for this will be provided whenever the source of the hover event is the connector.
     * @param doNotCascade
     */
    setEndpointHover(endpoint: Endpoint, hover: boolean, endpointIndex:-1|0|1, doNotCascade?:boolean): void {

        if (endpoint != null && (hover === false || (!this.currentlyDragging && !this.isHoverSuspended()))) {

            const canvas = getEndpointCanvas(endpoint.endpoint)

            if (canvas != null) {
                if (endpoint.hoverClass != null) {
                    if (hover) {
                        this.addClass(canvas, endpoint.hoverClass)
                    } else {
                        this.removeClass(canvas, endpoint.hoverClass)
                    }
                }

                if (endpointIndex === 0 || endpointIndex === 1) {
                    const genericHoverClass = endpointIndex === 0 ? this.hoverSourceClass : this.hoverTargetClass

                    if (hover) {
                        this.addClass(canvas, genericHoverClass)
                    } else {
                        this.removeClass(canvas, genericHoverClass)
                    }
                }
            }
            if (endpoint.hoverPaintStyle != null) {
                endpoint.paintStyleInUse = hover ? endpoint.hoverPaintStyle : endpoint.paintStyle
                if (!this._suspendDrawing) {
                    this.renderEndpoint(endpoint, endpoint.paintStyleInUse)
                }
            }

            if (!doNotCascade) {
                // instruct attached connections to set hover, unless doNotCascade was true.
                for(let i = 0; i < endpoint.connections.length; i++) {
                    this.setConnectorHover(endpoint.connections[i].connector, hover, endpoint)
                }
            }
        }
    }

    /**
     * @internal
     * @param ep
     * @param v
     */
    setEndpointVisible(ep: Endpoint, v: boolean): void {
        setVisible(ep.endpoint as any, v)
    }

    /**
     * @internal
     * @param group
     * @param state
     */
    setGroupVisible(group: UIGroup<Element>, state: boolean): void {
        let m = group.el.querySelectorAll(SELECTOR_MANAGED_ELEMENT)
        for (let i = 0; i < m.length; i++) {
            if (state) {
                this.show(m[i], true)
            } else {
                this.hide(m[i], true)
            }
        }
    }

    /**
     * @internal
     * @param connection
     * @param params
     */
    deleteConnection(connection: Connection, params?: DeleteConnectionOptions): boolean {
        if (connection != null && connection.deleted !== true) {
            if (connection.endpoints[0].deleted !== true) {
                this.setEndpointHover(connection.endpoints[0], false, 0, true)
            }
            if (connection.endpoints[1].deleted !== true) {
                this.setEndpointHover(connection.endpoints[1], false, 1, true)
            }
            return super.deleteConnection(connection, params)
        } else {
            return false
        }
    }

    /**
     * Registers a selector for connection drag on the instance. This is a newer version of the `makeSource` functionality
     * that had been in jsPlumb since the early days (and which, in 5.x, has been removed). With this approach, rather than calling `makeSource` on every element, you
     * can register a CSS selector on the instance that identifies something that is common to your elements. This will only respond to
     * mouse/touch events on elements that are managed by the instance.
     * @param selector - CSS3 selector identifying child element(s) of some managed element that should act as a connection source.
     * @param params - Options for the source: connector type, behaviour, etc.
     * @param exclude - If true, the selector defines an 'exclusion': anything _except_ elements that match this.
     * @public
     */
    addSourceSelector(selector: string, params?: BehaviouralTypeDescriptor, exclude?:boolean): ConnectionDragSelector {
        this.addDragFilter(selector)
        return super.addSourceSelector(selector, params, exclude)
    }

    /**
     * Unregister the given source selector.
     * @param selector - Remove the given drag selector from the instance.
     * @public
     */
    removeSourceSelector(selector: ConnectionDragSelector) {
        this.removeDragFilter(selector.selector)
        super.removeSourceSelector(selector)
    }

    /**
     * Manage an element.  Adds the element to the viewport and sets up tracking for endpoints/connections for the element, as well as enabling dragging for the
     * element. This method is called internally by various methods of the jsPlumb instance, such as `connect`, `addEndpoint`, `makeSource` and `makeTarget`,
     * so if you use those methods to setup your UI then you may not need to call this. However, if you use the `addSourceSelector` and `addTargetSelector` methods
     * to configure your UI then you will need to register elements using this method, or they will not be draggable.
     * @param element - Element to manage. This method does not accept a DOM element ID as argument. If you wish to manage elements via their DOM element ID,
     * you should use `manageAll` and pass in an appropriate CSS selector that represents your element, eg `#myElementId`.
     * @param internalId - Optional ID for jsPlumb to use internally. If this is not supplied, one will be created.
     * @param _recalc - Maybe recalculate offsets for the element also. It is not recommended that clients of the API use this parameter; it's used in
     * certain scenarios internally
     */
    manage (element:Element, internalId?:string, _recalc?:boolean):ManagedElement<Element> {

        if(this.containerType === ElementTypes.SVG && !isSVGElement(element)) {
            throw new Error("ERROR: cannot manage non-svg element when container is an SVG element.")
        }

        const managedElement = super.manage(element, internalId, _recalc)
        if (managedElement != null) {
            if (this._resizeObserver != null) {
                this._resizeObserver.observe(managedElement.el as unknown as Element)
            }
        }
        return managedElement
    }
}

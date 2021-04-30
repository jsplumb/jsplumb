import {
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER,
    DragHandler,
    EVENT_MOUSEDOWN,
    EVENT_MOUSEUP,
    EVENT_CONNECTION_ABORT,
    EVENT_CONNECTION_DRAG
} from "./drag-manager"
import {BrowserJsPlumbInstance, getPositionOnElement} from "./browser-jsplumb-instance"
import { jsPlumbDOMElement} from './element-facade'

import {consume, createElement, findParent} from "./browser-util"

import {Drag, DragStartEventParams,
    DragStopEventParams, DragEventParams} from "./collicat"

import {
    addToDictionary,
    FloatingAnchor,
    Anchor,
    INTERCEPT_BEFORE_DETACH,
    BoundingBox,
    CHECK_CONDITION,
    CHECK_DROP_ALLOWED,
    classList,
    cls,
    Connection,
    Dictionary,
    each,
    Endpoint,
    EndpointRepresentation,
    EVENT_MAX_CONNECTIONS,
    extend,
    functionChain,
    IS,
    IS_DETACH_ALLOWED,
    makeAnchorFromSpec,
    PaintStyle,
    SOURCE,
    SourceDefinition,
    SourceOrTargetDefinition,
    TARGET,
    AnchorSpec,
    forEach,
    EndpointSpec,
    intersects,
    PointXY,
    AnchorLocations,
    Size,
    TargetSelector,
    getWithFunction,
    INTERCEPT_BEFORE_DRAG,
    INTERCEPT_BEFORE_START_DETACH,
    SELECTOR_MANAGED_ELEMENT,
    CLASS_ENDPOINT,
    ATTRIBUTE_SCOPE_PREFIX,
    SourceSelector,
    getAllWithFunction,
    isAssignableFrom, InternalEndpointOptions, BehaviouralTypeDescriptor
} from "@jsplumb/core"

function _makeFloatingEndpoint (paintStyle:PaintStyle,
                                referenceAnchor:Anchor,
                                endpoint:EndpointSpec | EndpointRepresentation<any>,
                                referenceCanvas:Element,
                                sourceElement:jsPlumbDOMElement,
                                instance:BrowserJsPlumbInstance, scope?:string)
{
    let floatingAnchor = new FloatingAnchor(instance, { reference: referenceAnchor, referenceCanvas: referenceCanvas })
    const p:InternalEndpointOptions<any> = {
        paintStyle: paintStyle,
        preparedAnchor: floatingAnchor,
        element: sourceElement,
        scope: scope
    }

    if (endpoint != null) {

        if (isAssignableFrom(endpoint, EndpointRepresentation)) {
            p.existingEndpoint = endpoint as EndpointRepresentation<any>
        } else {
            p.endpoint = endpoint as EndpointSpec
        }
    }

    let ep = instance._internal_newEndpoint(p)
    instance.paintEndpoint(ep, {})
    return ep
}

function selectorFilter (evt:Event, _el:jsPlumbDOMElement, selector:string, _instance:BrowserJsPlumbInstance, negate?:boolean):boolean {
    let t = evt.target || evt.srcElement,
        ok = false,
        sel = _instance.getSelector(_el, selector)

    for (let j = 0; j < sel.length; j++) {
        if (sel[j] === t) {
            ok = true
            break
        }
    }
    return negate ? !ok : ok
}

const SELECTOR_DRAG_ACTIVE_OR_HOVER = cls(CLASS_DRAG_ACTIVE, CLASS_DRAG_HOVER)

export class EndpointDragHandler implements DragHandler {

    jpc:Connection
    existingJpc:boolean

    private _originalAnchor:AnchorSpec
    ep:Endpoint<Element>
    endpointRepresentation:EndpointRepresentation<any>
    canvasElement:Element
    private _activeDefinition:SourceOrTargetDefinition

    placeholderInfo:{ id?:string, element?:jsPlumbDOMElement } = { id: null, element: null }

    floatingIndex:number
    floatingId:string
    floatingElement:Element
    floatingEndpoint:Endpoint
    floatingAnchor:FloatingAnchor

    _stopped:boolean
    inPlaceCopy:any
    endpointDropTargets:Array<{el:jsPlumbDOMElement, endpoint:Endpoint, r:BoundingBox, def?:SourceOrTargetDefinition}> = []
    currentDropTarget:any = null
    payload:any
    floatingConnections:Dictionary<Connection> = {}

    _forceReattach:boolean
    _forceDetach:boolean

    mousedownHandler:(e:any) => void
    mouseupHandler:(e:any) => void

    selector: string = cls(CLASS_ENDPOINT)

    constructor(protected instance:BrowserJsPlumbInstance) {

        const container = instance.getContainer()

        this.mousedownHandler = this._mousedownHandler.bind(this)
        this.mouseupHandler = this._mouseupHandler.bind(this)

        instance.on(container , EVENT_MOUSEDOWN, SELECTOR_MANAGED_ELEMENT, this.mousedownHandler)
        instance.on(container, EVENT_MOUSEUP, SELECTOR_MANAGED_ELEMENT, this.mouseupHandler)

    }

    private _resolveDragParent(def:BehaviouralTypeDescriptor, eventTarget:jsPlumbDOMElement):jsPlumbDOMElement {
        const candidates = [ SELECTOR_MANAGED_ELEMENT ]
        let target:jsPlumbDOMElement
        let container = this.instance.getContainer()
        if (def.parentSelectors != null) {
            Array.prototype.unshift.apply(candidates, def.parentSelectors)
        }
        for (let i = 0; i < candidates.length; i++) {
            target = findParent(eventTarget, candidates[i], container)
            if (target != null) {
                return target
            }
        }
    }

    private _mousedownHandler (e:MouseEvent) {

        let targetEl:jsPlumbDOMElement
        let sourceDef:SourceDefinition

        if (e.which === 3 || e.button === 2) {
            return
        }

        sourceDef = this._getSourceDefinition(e)

        // first test for a source definition registered on the instance whose selector matches the target of this event
        if (sourceDef != null) {
            // then get the associated element, using the definition's own `parentSelector`, if provided, or the default.
            targetEl = this._resolveDragParent(sourceDef.def, (e.target || e.srcElement) as jsPlumbDOMElement)
            //targetEl = findParent((e.target || e.srcElement) as jsPlumbDOMElement, sourceDef.def.parentSelector || SELECTOR_MANAGED_ELEMENT, this.instance.getContainer())
            if (targetEl == null) {
                return
            }
        }

        if (sourceDef) {

            let sourceElement = e.currentTarget as jsPlumbDOMElement, def

            consume(e)

            this._activeDefinition = sourceDef

            // at this point we have a mousedown event on an element that is configured as a drag source.

            def = sourceDef.def
            // if maxConnections reached
            let sourceCount = this.instance.select({source: targetEl}).length
            if (sourceDef.maxConnections >= 0 && (sourceCount >= sourceDef.maxConnections)) {
                consume(e)
                // TODO this is incorrect - "self"
                if (def.onMaxConnections) {
                    def.onMaxConnections({
                        element: this.ep.element,
                        maxConnections: sourceDef.maxConnections
                    }, e)
                }
                e.stopImmediatePropagation && e.stopImmediatePropagation()
                return false
            }

            // find the position on the element at which the mouse was pressed; this is where the endpoint
            // will be located.
            let elxy = getPositionOnElement(e, targetEl, this.instance.currentZoom)

            // we need to override the anchor in here, and force 'isSource', but we don't want to mess with
            // the params passed in, because after a connection is established we're going to reset the endpoint
            // to have the anchor we were given.
            let tempEndpointParams:any = {}
            extend(tempEndpointParams, def)
            tempEndpointParams.isTemporarySource = true
            tempEndpointParams.anchor = [ elxy.x, elxy.y , 0, 0]

            if (def.scope) {
                tempEndpointParams.scope = def.scope
            }

            // add an endpoint to the element that is the connection source, using the anchor that will position it where
            // the mousedown event occurred.
            this.ep = this.instance.addEndpoint(targetEl, tempEndpointParams)
            // mark delete on empty
            this.ep.deleteOnEmpty = true
            // keep a reference to the anchor we want to use if the connection is finalised.
            this._originalAnchor = def.anchor || this.instance.Defaults.anchor

            // optionally check for attributes to extract from the source element
            let payload = {}
            if (def.extract) {
                for (let att in def.extract) {
                    let v = targetEl.getAttribute(att)
                    if (v) {
                        payload[def.extract[att]] = v
                    }
                }

                this.ep.mergeParameters(payload)
            }

            // if unique endpoint and it's already been created, push it onto the endpoint we create. at the end
            // of a successful connection we'll switch to that endpoint.
            // TODO this is the same code as the programmatic endpoints create on line 1050 ish
            if (def.uniqueEndpoint) {
                if (!sourceDef.endpoint) {
                    sourceDef.endpoint = this.ep
                    this.ep.deleteOnEmpty = false
                }
                else {
                    this.ep.finalEndpoint = sourceDef.endpoint
                }
            }

            // add to the list of endpoints that are a candidate for deletion if no activity has occurred on them.
            // a mouseup listener on the canvas cleans anything up from this list if it has no connections.
            // the list is then cleared.
            sourceElement._jsPlumbOrphanedEndpoints = sourceElement._jsPlumbOrphanedEndpoints || []
            sourceElement._jsPlumbOrphanedEndpoints.push(this.ep)

            // and then trigger its mousedown event, which will kick off a drag, which will start dragging
            // a new connection from this endpoint. The entry point is the `onStart` method in this class.
            this.instance.trigger((this.ep.endpoint as any).canvas, EVENT_MOUSEDOWN, e, payload)
        }
    }

    //
    // cleans up any endpoints added from a mousedown on a source that did not result in a connection drag
    // replaces what in previous versions was a mousedown/mouseup handler per element.
    //
    private _mouseupHandler(e:MouseEvent) {
        let el:any = e.currentTarget || e.srcElement
        if (el._jsPlumbOrphanedEndpoints) {
            each(el._jsPlumbOrphanedEndpoints, this.instance._maybePruneEndpoint.bind(this.instance))
            el._jsPlumbOrphanedEndpoints.length = 0
        }

        this._activeDefinition = null
    }

    /**
     * At the beginning of a drag, this method can be used to perform some setup in a handler, and if it returns a DOM
     * element, that element will be the one used for dragging.
     * @param el The element that will be dragged unless we return something different.
     */
    onDragInit(el:Element):Element {
        const ipco = this.instance.getOffset(el), ips = this.instance.getSize(el)

        this._makeDraggablePlaceholder(ipco, ips)

        this.placeholderInfo.element.jtk = (el as jsPlumbDOMElement).jtk
        return this.placeholderInfo.element
    }

    onDragAbort(el:Element):void {
        this._cleanupDraggablePlaceholder()
    }

    /**
     * Makes the element that is the placeholder for dragging. This element gets `managed` by the instance, and `unmanaged` when dragging
     * ends.
     * @param ipco
     * @param ips
     * @private
     */
    private _makeDraggablePlaceholder(ipco:PointXY, ips:Size):HTMLElement {

        this.placeholderInfo = this.placeholderInfo || {}

        let n = createElement("div", { position : "absolute" }) as jsPlumbDOMElement
        this.instance._appendElement(n, this.instance.getContainer())
        let id = this.instance.getId(n)
        this.instance.setPosition(n, ipco)
        n.style.width = ips.w + "px"
        n.style.height = ips.h + "px"
        this.instance.manage(n); // TRANSIENT MANAGE
        // create and assign an id, and initialize the offset.
        this.placeholderInfo.id = id
        this.placeholderInfo.element = n
        return n
    }

    private _cleanupDraggablePlaceholder() {
        if (this.placeholderInfo.element) {
            this.instance.unmanage(this.placeholderInfo.element, true)
            delete this.placeholderInfo.element
            delete this.placeholderInfo.id
        }
    }

    reset() {
        const c = this.instance.getContainer()
        this.instance.off(c, EVENT_MOUSEUP, this.mouseupHandler)
        this.instance.off(c, EVENT_MOUSEDOWN, this.mousedownHandler)
    }

    init(drag:Drag) {}

    private startNewConnectionDrag(scope:string, data?:any) {
        // create a connection. one end is this endpoint, the other is a floating endpoint.
        this.jpc = this.instance._newConnection({
            sourceEndpoint: this.ep,
            targetEndpoint: this.floatingEndpoint,
            source: this.ep.element,  // for makeSource with parent option.  ensure source element is represented correctly.
            target: this.placeholderInfo.element,
            paintStyle: this.ep.connectorStyle, // this can be null. Connection will use the default.
            hoverPaintStyle: this.ep.connectorHoverStyle,
            connector: this.ep.connector, // this can also be null. Connection will use the default.
            overlays: this.ep.connectorOverlays,
            type: this.ep.connectionType,
            cssClass: this.ep.connectorClass,
            hoverClass: this.ep.connectorHoverClass,
            scope:scope,
            data
        })
        this.jpc.pending = true
        this.jpc.addClass(this.instance.draggingClass)
        this.floatingEndpoint.addClass(this.instance.draggingClass)
        // fire an event that informs that a connection is being dragged
        this.instance.fire<Connection>(EVENT_CONNECTION_DRAG, this.jpc)
    }

    private startExistingConnectionDrag() {
        this.existingJpc = true
        this.instance.setHover(this.jpc, false)

        // new anchor idx
        const anchorIdx = this.jpc.endpoints[0].id === this.ep.id ? 0 : 1

        // detach from the connection while dragging is occurring. mark as a 'transient' detach, ie. dont delete
        // the endpoint if there are no other connections and it would otherwise have been cleaned up.
        this.ep.detachFromConnection(this.jpc, null, true)

        // attach the connection to the floating endpoint.
        this.floatingEndpoint.addConnection(this.jpc)
        this.floatingEndpoint.addClass(this.instance.draggingClass)

        // fire an event that informs that a connection is being dragged. we do this before
        // replacing the original target with the floating element info.
        this.instance.fire<Connection>(EVENT_CONNECTION_DRAG, this.jpc)

        // now we replace ourselves with the temporary div we created above
        this.instance.sourceOrTargetChanged(this.jpc.endpoints[anchorIdx].elementId, this.placeholderInfo.id, this.jpc, this.placeholderInfo.element, anchorIdx)

        // store the original endpoint and assign the new floating endpoint for the drag.
        this.jpc.suspendedEndpoint = this.jpc.endpoints[anchorIdx]

        // PROVIDE THE SUSPENDED ELEMENT, BE IT A SOURCE OR TARGET (ISSUE 39)
        this.jpc.suspendedElement = this.jpc.endpoints[anchorIdx].element
        this.jpc.suspendedElementId = this.jpc.endpoints[anchorIdx].elementId
        this.jpc.suspendedElementType = anchorIdx === 0 ? SOURCE : TARGET

        this.instance.setHover(this.jpc.suspendedEndpoint, false)

        this.floatingEndpoint.referenceEndpoint = this.jpc.suspendedEndpoint
        this.jpc.endpoints[anchorIdx] = this.floatingEndpoint

        this.jpc.addClass(this.instance.draggingClass)

        this.floatingId = this.placeholderInfo.id
        this.floatingIndex = anchorIdx
    }

    /**
     * Returns whether or not a connerction drag should start, and, if so, optionally returns a payload to associate with the drag.
     * @private
     */
    private _shouldStartDrag():[boolean, any] {
        let _continue = true
        // if not enabled, return
        if (!this.ep.enabled) {
            _continue = false
        }
        // if no connection and we're not a source - or temporarily a source, as is the case with makeSource - return.
        if (this.jpc == null && !this.ep.isSource && !this.ep.isTemporarySource) {
            _continue = false
        }
        // otherwise if we're full and not allowed to drag, also return false.
        if (this.ep.isSource && this.ep.isFull() && !(this.jpc != null && this.ep.dragAllowedWhenFull)) {
            _continue = false
        }
        // if the connection was setup as not detachable or one of its endpoints
        // was setup as connectionsDetachable = false, or Defaults.connectionsDetachable
        // is set to false...
        if (this.jpc != null && !this.jpc.isDetachable(this.ep)) {
            // .. and the endpoint is full
            if (this.ep.isFull()) {
                _continue = false
            } else {
                // otherwise, if not full, set the connection to null, and we will now proceed
                // to drag a new connection.
                this.jpc = null
            }
        }

        let beforeDrag:any = this.instance.checkCondition(this.jpc == null ? INTERCEPT_BEFORE_DRAG : INTERCEPT_BEFORE_START_DETACH, {
            endpoint:this.ep,
            source:this.ep.element,
            sourceId:this.ep.elementId,
            connection:this.jpc
        })
        if (beforeDrag === false) {
            _continue = false
        }
        // else we might have been given some data. we'll pass it in to a new connection as 'data'.
        // here we also merge in the optional payload we were given on mousedown.
        else if (typeof beforeDrag === "object") {
            extend(beforeDrag, this.payload || {})
        }
        else {
            // or if no beforeDrag data, maybe use the payload on its own.
            beforeDrag = this.payload || {}
        }

        return [ _continue, beforeDrag ]
    }

    /**
     * Creates the floating endpoint used in a connection drag.
     * @param canvasElement
     * @private
     */
    private _createFloatingEndpoint(canvasElement:Element) {
        let endpointToFloat:EndpointSpec|EndpointRepresentation<any> = this.ep.endpoint
        if (this.ep.connectionType != null) {
            const aae = this.instance._deriveEndpointAndAnchorSpec(this.ep.connectionType)
            endpointToFloat = aae.endpoints[1]
        }
        const centerAnchor = makeAnchorFromSpec(this.instance, AnchorLocations.Center)
        centerAnchor.isFloating = true

        this.floatingEndpoint = _makeFloatingEndpoint(this.ep.getPaintStyle(), centerAnchor, endpointToFloat, canvasElement, this.placeholderInfo.element, this.instance, this.ep.scope)
        this.floatingAnchor = this.floatingEndpoint.anchor as FloatingAnchor

        this.floatingEndpoint.deleteOnEmpty = true
        this.floatingElement = (this.floatingEndpoint.endpoint as any).canvas
        this.floatingId = this.instance.getId(this.floatingElement)
    }

    /**
     * Populate the list of drop targets based upon what is being dragged.
     * @param canvasElement
     * @private
     */
    private _populateTargets(canvasElement:Element) {
        const isSourceDrag = this.jpc && this.jpc.endpoints[0] === this.ep

        let boundingRect:BoundingBox

        //
        // any Endpoints whose scope matches the scope of the Endpoint being dragged are candidates. They also have to have `isSource` or `isTarget` set to match
        // what end of an existing connection is being dragged
        //
        const matchingEndpoints = this.instance.getContainer().querySelectorAll([".", CLASS_ENDPOINT, "[", ATTRIBUTE_SCOPE_PREFIX, this.ep.scope, "]" ].join(""))
        forEach(matchingEndpoints, (candidate:any) => {
            if ((this.jpc != null || candidate !== canvasElement) && candidate !== this.floatingElement) {
                if ( (isSourceDrag && candidate.jtk.endpoint.isSource) || (!isSourceDrag && candidate.jtk.endpoint.isTarget) ) {
                    const o = this.instance.getOffset(candidate), s = this.instance.getSize(candidate)
                    boundingRect = {x: o.x, y: o.y, w: s.w, h: s.h}
                    this.endpointDropTargets.push({el: candidate, r: boundingRect, endpoint: candidate.jtk.endpoint, def:null})
                    this.instance.addClass(candidate, CLASS_DRAG_ACTIVE)
                }
            }
        })

        // search for source/target selector registered on the instance that matches

        if (isSourceDrag) {

            // look for a source definition on the instance whose scope matches the current endpoint's scope
            const sourceDef = getWithFunction(this.instance.sourceSelectors,  (sSel:SourceSelector) => {
                return sSel.isEnabled() && (sSel.def.def.scope == null || sSel.def.def.scope === this.ep.scope)
            })

            if (sourceDef != null) {
                const targetZones = this.instance.getContainer().querySelectorAll(sourceDef.selector)
                forEach(targetZones, (el:Element) => {
                    let d: any = {r: null}
                    d.el = findParent(el as unknown as jsPlumbDOMElement, SELECTOR_MANAGED_ELEMENT, this.instance.getContainer(), true)

                    const o = this.instance.getOffset(d.el), s = this.instance.getSize(d.el)
                    d.r= {x: o.x, y: o.y, w: s.w, h: s.h}

                    if (sourceDef.def.def.rank != null) {
                        d.rank = sourceDef.def.def.rank
                    }

                    d.def = sourceDef
                    this.endpointDropTargets.push(d)
                    this.instance.addClass(d.el, CLASS_DRAG_ACTIVE) // TODO get from defaults.
                })
            }

        } else {

            const targetDefs = getAllWithFunction(this.instance.targetSelectors,  (tSel:TargetSelector) => {
                return tSel.isEnabled()
            })

            targetDefs.forEach((targetDef:TargetSelector) => {
                const targetZones = this.instance.getContainer().querySelectorAll(targetDef.selector)
                forEach(targetZones, (el:Element) => {
                    let d: any = {r: null}
                    d.el = findParent(el as unknown as jsPlumbDOMElement, SELECTOR_MANAGED_ELEMENT, this.instance.getContainer(), true)

                    // if loopback disallowed on source or target definition and this target is the current element, skip it
                    if (targetDef.def.def.allowLoopback === false || (this._activeDefinition && this._activeDefinition.def.allowLoopback === false)) {
                        if (d.el === this.ep.element) {
                            return
                        }
                    }

                    const o = this.instance.getOffset(el), s = this.instance.getSize(el)
                    d.r= {x: o.x, y: o.y, w: s.w, h: s.h}

                    d.def = targetDef.def

                    if (targetDef.def.def.rank != null) {
                        d.rank = targetDef.def.def.rank
                    }
                    this.endpointDropTargets.push(d)
                    this.instance.addClass(d.el, CLASS_DRAG_ACTIVE) // TODO get from defaults.
                })
            })
        }

        this.endpointDropTargets.sort((a:any, b:any) =>{

            if (a.el._isJsPlumbGroup && !b.el._isJsPlumbGroup) {
                return 1
            } else if (!a.el._isJsPlumbGroup && b.el._isJsPlumbGroup) {
                return -1
            } else {
                if (a.rank != null && b.rank != null) {
                    if(a.rank > b.rank) {
                        return -1
                    } else if (a.rank < b.rank) {
                        return 1
                    } else {

                    }
                } else {
                    return 0
                }
            }
        })
    }

    onStart(p:DragStartEventParams):boolean {

        // clear this list. we'll reconstruct it based on whether its an existing or new connection.
        this.endpointDropTargets.length = 0
        this.currentDropTarget = null
        this._stopped = false
        let dragEl = p.drag.getDragElement()
        this.ep = dragEl.jtk.endpoint

        if (!this.ep) {
            return false
        }

        this.endpointRepresentation = this.ep.endpoint
        this.canvasElement = (<unknown>(this.endpointRepresentation as any).canvas) as jsPlumbDOMElement
        
        this.jpc = this.ep.connectorSelector()

        // test if it is ok to proceed
        const [_continue, payload] = this._shouldStartDrag()
        
        if (_continue === false) {
            this._stopped = true
            return false
        }
        
        // ok to proceed.

        // clear endpoint hover and connections attached to it
        this.instance.setHover(this.ep, false)
        this.instance.isConnectionBeingDragged = true
        
        // if our endpoint is not full but there was a connection, make it null. we'll create a new one.
        if (this.jpc && !this.ep.isFull() && this.ep.isSource) {
            this.jpc = null
        }

        // create the endpoint we will drag around
        this._createFloatingEndpoint(this.canvasElement)

        // populate list of drop targets, whose contents depends on what's being dragged
        this._populateTargets(this.canvasElement)

        if (this.jpc == null) {
            this.startNewConnectionDrag(this.ep.scope, payload)
        } else {
            this.startExistingConnectionDrag()
        }

        this._registerFloatingConnection(this.placeholderInfo, this.jpc, this.floatingEndpoint)
        this.instance.currentlyDragging = true
    }

    onBeforeStart (beforeStartParams:any):void {
        this.payload = beforeStartParams.e.payload || {}
    }
    
    onDrag (params:DragEventParams) {

        if (this._stopped) {
            return true
        }

        if (this.placeholderInfo.element) {

            let floatingElementSize = this.instance.getSize(this.floatingElement)

            this.instance.setElementPosition(this.placeholderInfo.element, params.pos.x, params.pos.y)

            let boundingRect = { x:params.pos.x, y:params.pos.y, w:floatingElementSize.w, h:floatingElementSize.h},
                newDropTarget, idx, _cont

            for (let i = 0; i < this.endpointDropTargets.length; i++) {

                // test if this drop target has declared a filter (and possibly a value for filterExclude).
                // if the filter excludes this drop target we don't consider it.
                let cont = true,
                    filter =  this.endpointDropTargets[i].def ? this.endpointDropTargets[i].def.def.filter : null,
                    filterExclude = filter != null ? this.endpointDropTargets[i].def.def.filterExclude : null

                if (filter != null) {
                    let r = selectorFilter(params.e, this.endpointDropTargets[i].el, filter as string, this.instance, filterExclude)
                    if (r === false) {
                        cont = false
                    }
                }

                if (cont && intersects(boundingRect, this.endpointDropTargets[i].r)) {
                    newDropTarget = this.endpointDropTargets[i]
                    break
                }
            }

            if (newDropTarget !== this.currentDropTarget && this.currentDropTarget != null) {
                idx = this.getFloatingAnchorIndex(this.jpc)

                this.instance.removeClass(this.currentDropTarget.el, CLASS_DRAG_HOVER)

                if (this.currentDropTarget.endpoint) {
                    this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropAllowedClass)
                    this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropForbiddenClass)
                }

                this.floatingAnchor.out()
            }

            if (newDropTarget != null) {
                this.instance.addClass(newDropTarget.el, CLASS_DRAG_HOVER)

                idx = this.getFloatingAnchorIndex(this.jpc)

                if (newDropTarget.endpoint != null) {

                    _cont = (newDropTarget.endpoint.isSource && idx === 0) || (newDropTarget.endpoint.isTarget && idx !== 0) || (this.jpc.suspendedEndpoint && newDropTarget.endpoint.referenceEndpoint && newDropTarget.endpoint.referenceEndpoint.id === this.jpc.suspendedEndpoint.id)
                    if (_cont) {
                        let bb = this.instance.checkCondition(CHECK_DROP_ALLOWED, {
                            sourceEndpoint: this.jpc.endpoints[idx],
                            targetEndpoint: newDropTarget.endpoint.endpoint,
                            connection: this.jpc
                        })

                        if (bb) {
                            newDropTarget.endpoint.endpoint.addClass(this.instance.endpointDropAllowedClass)
                            newDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropForbiddenClass)
                        } else {
                            newDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropAllowedClass)
                            newDropTarget.endpoint.endpoint.addClass(this.instance.endpointDropForbiddenClass)
                        }

                        this.floatingAnchor.over(newDropTarget.endpoint.anchor, newDropTarget.endpoint)
                    } else {
                        newDropTarget = null
                    }
                }
            }

            this.currentDropTarget = newDropTarget
        }
    }

    private _maybeCleanup (ep:Endpoint):void {
        if (((<any>ep)._mtNew && ep.connections.length === 0)) {
            this.instance.deleteEndpoint(ep)
        }
        else {
            delete (<any>ep)._mtNew
        }
    }

    private _reattachOrDiscard(originalEvent: Event):boolean {

        let existingConnection = this.jpc.suspendedEndpoint != null
        let idx = this.getFloatingAnchorIndex(this.jpc)

        // if no drop target,
        if (existingConnection && this._shouldReattach(originalEvent)) {

            if (idx === 0) {
                this.jpc.source = this.jpc.suspendedElement
                this.jpc.sourceId = this.jpc.suspendedElementId
            } else {
                this.jpc.target = this.jpc.suspendedElement
                this.jpc.targetId = this.jpc.suspendedElementId
            }

            // is this an existing connection? try to reattach, if desired.
            this._doForceReattach(idx)
            return true

        } else {
            // otherwise throw it away (and throw away any endpoints attached to it that should be thrown away when they are no longer
            // connected to any edges.
            this._discard(idx, originalEvent)
            return false
        }
    }
    
    onStop(p:DragStopEventParams) {

        let originalEvent = p.e

        this.instance.isConnectionBeingDragged = false
        this.instance.currentlyDragging = false

        const classesToRemove = classList(CLASS_DRAG_HOVER, CLASS_DRAG_ACTIVE)

        const matchingSelectors = this.instance.getContainer().querySelectorAll(SELECTOR_DRAG_ACTIVE_OR_HOVER)
        forEach(matchingSelectors,(el:jsPlumbDOMElement) => {
            this.instance.removeClass(el, classesToRemove)
        })

        if (this.jpc && this.jpc.endpoints != null) {

            let existingConnection = this.jpc.suspendedEndpoint != null
            let idx = this.getFloatingAnchorIndex(this.jpc)
            let suspendedEndpoint = this.jpc.suspendedEndpoint
            let dropEndpoint
            let discarded = false

            // 1. is there a drop target?
            if (this.currentDropTarget != null) {

                // get the drop endpoint.
                dropEndpoint = this._getDropEndpoint(p, this.jpc)
                if (dropEndpoint == null) {
                    // no drop endpoint resolved. either reattach, or discard.
                    discarded = !this._reattachOrDiscard(p.e)
                } else {

                    // if we are dropping back on the original endpoint, force a reattach.
                    if (suspendedEndpoint && (suspendedEndpoint.id === dropEndpoint.id)) {
                        this._doForceReattach(idx)
                    } else {

                        if (!dropEndpoint.enabled) {
                            // if endpoint disabled, either reattach or discard
                            this._reattachOrDiscard(p.e)
                        } else if (dropEndpoint.isFull()) {
                            // if endpoint full, fire an event, then either reattach or discard
                            dropEndpoint.fire(EVENT_MAX_CONNECTIONS, {
                                endpoint: this,
                                connection: this.jpc,
                                maxConnections: this.instance.Defaults.maxConnections
                            }, originalEvent)
                            this._reattachOrDiscard(p.e)
                        } else {
                            if (idx === 0) {
                                this.jpc.source = dropEndpoint.element
                                this.jpc.sourceId = dropEndpoint.elementId
                            } else {
                                this.jpc.target = dropEndpoint.element
                                this.jpc.targetId = dropEndpoint.elementId
                            }

                            let _doContinue = true
                            /*
                                if this is an existing connection and detach is not allowed we won't continue. The connection's
                                endpoints have been reinstated; everything is back to how it was.
                            */
                            if (existingConnection && this.jpc.suspendedEndpoint.id !== dropEndpoint.id) {
                                if (!this.jpc.isDetachAllowed(this.jpc) || !this.jpc.endpoints[idx].isDetachAllowed(this.jpc) || !this.jpc.suspendedEndpoint.isDetachAllowed(this.jpc) || !this.instance.checkCondition("beforeDetach", this.jpc)) {
                                    _doContinue = false
                                }
                            }

                            /*
                                now check beforeDrop.  this will be available only on Endpoints that are setup to
                                have a beforeDrop condition (although, secretly, under the hood all Endpoints and
                                the Connection have them, because they are on jsPlumbUIComponent.  shhh!), because
                                it only makes sense to have it on a target endpoint.
                            */
                            _doContinue = _doContinue && dropEndpoint.isDropAllowed(this.jpc.sourceId, this.jpc.targetId, this.jpc.scope, this.jpc, dropEndpoint)

                            if (_doContinue) {
                                this._drop(dropEndpoint, idx, originalEvent, _doContinue)
                            } else {
                                this._reattachOrDiscard(p.e)
                            }
                        }
                    }

                }

            } else {
                // no drop target: either reattach, or discard.
                this._reattachOrDiscard(p.e)
            }

            // refresh the appearance of the endpoint, if necessary
            this.instance.refreshEndpoint(this.ep)
            this.ep.removeClass(this.instance.draggingClass)

            // common clean up

            this._cleanupDraggablePlaceholder()

            this.jpc.removeClass(this.instance.draggingClass)

            delete this.jpc.suspendedEndpoint
            delete this.jpc.suspendedElement
            delete this.jpc.suspendedElementType
            delete this.jpc.suspendedElementId
            delete this.jpc.suspendedIndex

            delete this.floatingId
            delete this.floatingIndex
            delete this.floatingElement
            delete this.floatingEndpoint
            delete this.floatingAnchor

            delete this.jpc.pending

            if (dropEndpoint != null) {
                this._maybeCleanup(dropEndpoint)
            }
        }
    }

    /**
     * Looks for a source selector on the instance that matches the target of the given event.
     * @param evt
     * @private
     */
    private _getSourceDefinition(evt:Event):SourceDefinition {
        let selector
        for (let i = 0; i < this.instance.sourceSelectors.length; i++) {
            selector = this.instance.sourceSelectors[i]
            if (selector.isEnabled()) {
                let r = selectorFilter(evt, this.instance.getContainer(), selector.selector, this.instance, selector.exclude)
                if (r !== false) {
                    return selector.def
                }
            }
        }
    }

    /**
     * Create - or retrieve - an appropriate endpoint for a connection drop.
     * @param p
     * @param jpc
     * @private
     */
    private _getDropEndpoint(p:DragStopEventParams, jpc:Connection):Endpoint {
        let dropEndpoint:Endpoint

        if (this.currentDropTarget.endpoint == null) {

            let targetDefinition:SourceOrTargetDefinition =  this.currentDropTarget.def

            // if no definition found, bail.
            if (targetDefinition == null) {
                return null
            }

            // if no cached endpoint, or there was one but it has been cleaned up
            // (ie. detached), create a new one
            let eps = this.instance._deriveEndpointAndAnchorSpec(jpc.getType().join(" "), true)

            let pp:any = eps.endpoints ? extend(p as any, {
                endpoint:targetDefinition.def.endpoint || eps.endpoints[1]
            }) :p
            if (eps.anchors) {
                pp = extend(pp, {
                    anchor:targetDefinition.def.anchor || eps.anchors[1]
                })
            }

            if(targetDefinition.def.parameters != null) {
                pp.parameters = targetDefinition.def.parameters
            }

            if(targetDefinition.def.portId != null) {
                pp.portId = targetDefinition.def.portId
            }

            dropEndpoint = this.instance.addEndpoint(this.currentDropTarget.el, pp) as Endpoint
            (<any>dropEndpoint)._mtNew = true
            dropEndpoint.deleteOnEmpty = true

            // if `extract` defined, read out attributes values and write to the drop endpoint's parameters
            if (targetDefinition.def.extract) {
                let tpayload = {}
                for (let att in targetDefinition.def.extract) {
                    let v = this.currentDropTarget.el.getAttribute(att)
                    if (v) {
                        tpayload[targetDefinition.def.extract[att]] = v
                    }
                }

                dropEndpoint.parameters = tpayload
            }

            if (dropEndpoint.anchor.positionFinder != null) {

                let finalPos:PointXY = p.finalPos || p.pos
                let dropPosition = { x:finalPos.x, y:finalPos.y }

                let elPosition = this.instance.getOffset(this.currentDropTarget.el),
                    elSize = this.instance.getSize(this.currentDropTarget.el),
                    ap = dropEndpoint.anchor.positionFinder(dropPosition, elPosition, elSize, (<any>dropEndpoint.anchor).constructorParams)

                dropEndpoint.anchor.x = ap[0]
                dropEndpoint.anchor.y = ap[1]
                // now figure an orientation for it..kind of hard to know what to do actually. probably the best thing i can do is to
                // support specifying an orientation in the anchor's spec. if one is not supplied then i will make the orientation
                // be what will cause the most natural link to the source: it will be pointing at the source, but it needs to be
                // specified in one axis only, and so how to make that choice? i think i will use whichever axis is the one in which
                // the target is furthest away from the source.
            }
        } else {
            dropEndpoint = this.currentDropTarget.endpoint
        }

        if (dropEndpoint) {
            dropEndpoint.removeClass(this.instance.endpointDropAllowedClass)
            dropEndpoint.removeClass(this.instance.endpointDropForbiddenClass)
        }

        return dropEndpoint
    }

    private _doForceReattach(idx:number):void {

        // TODO check this logic. why in this case is this a transient detach?
        this.floatingEndpoint.detachFromConnection(this.jpc, null, true)

        this.jpc.endpoints[idx] = this.jpc.suspendedEndpoint
        this.instance.setHover(this.jpc, false)

        this.jpc._forceDetach = true

        this.jpc.suspendedEndpoint.addConnection(this.jpc)
        this.instance.sourceOrTargetChanged(this.floatingId, this.jpc.suspendedEndpoint.elementId, this.jpc, this.jpc.suspendedEndpoint.element, idx)

        this.instance.deleteEndpoint(this.floatingEndpoint)

        this.instance.repaint(this.jpc.source)

        delete this.jpc._forceDetach
    }

    private _shouldReattach(originalEvent?:Event):boolean {
        return this.jpc.isReattach() || this.jpc._forceReattach || !functionChain(true, false, [
            [ this.jpc.endpoints[0], IS_DETACH_ALLOWED, [ this.jpc ] ],
            [ this.jpc.endpoints[1], IS_DETACH_ALLOWED, [ this.jpc ] ],
            [ this.jpc, IS_DETACH_ALLOWED, [ this.jpc ] ],
            [ this.instance, CHECK_CONDITION, [ INTERCEPT_BEFORE_DETACH, this.jpc ] ]
        ])
    }

    private _discard(idx:number, originalEvent?:Event) {

        if (this.jpc.pending) {
            this.instance.fire<Connection>(EVENT_CONNECTION_ABORT, this.jpc, originalEvent)
        } else {
            if (idx === 0) {
                this.jpc.source = this.jpc.suspendedEndpoint.element
                this.jpc.sourceId = this.jpc.suspendedEndpoint.elementId
            } else {
                this.jpc.target = this.jpc.suspendedEndpoint.element
                this.jpc.targetId = this.jpc.suspendedEndpoint.elementId
            }

            this.jpc.endpoints[idx] = this.jpc.suspendedEndpoint
        }

        if (this.floatingEndpoint) {
            this.floatingEndpoint.detachFromConnection(this.jpc)
        }

        this.instance.deleteConnection(this.jpc, {originalEvent:originalEvent, force:true})
    }

    //
    // drops the current connection on the given endpoint
    //
    private  _drop(dropEndpoint:Endpoint, idx:number, originalEvent:Event, optionalData?:any):void {
        // remove this jpc from the current endpoint, which is a floating endpoint that we will
        // subsequently discard.
        this.jpc.endpoints[idx].detachFromConnection(this.jpc)

        // if there's a suspended endpoint, detach it from the connection.
        if (this.jpc.suspendedEndpoint) {
            this.jpc.suspendedEndpoint.detachFromConnection(this.jpc)
        }

        this.jpc.endpoints[idx] = dropEndpoint
        dropEndpoint.addConnection(this.jpc)

        // copy our parameters in to the connection:
        this.jpc.mergeParameters(dropEndpoint.parameters)

        if (this.jpc.suspendedEndpoint) {
            let suspendedElementId = this.jpc.suspendedEndpoint.elementId
            this.instance.fireMoveEvent({
                index: idx,
                originalSourceId: idx === 0 ? suspendedElementId : this.jpc.sourceId,
                newSourceId: idx === 0 ? dropEndpoint.elementId : this.jpc.sourceId,
                originalTargetId: idx === 1 ? suspendedElementId : this.jpc.targetId,
                newTargetId: idx === 1 ? dropEndpoint.elementId : this.jpc.targetId,
                originalEndpoint:this.jpc.suspendedEndpoint,
                connection: this.jpc,
                newEndpoint:dropEndpoint
            }, originalEvent)
        }

        if (idx === 1) {
            this.instance.sourceOrTargetChanged(this.floatingId, this.jpc.targetId, this.jpc, this.jpc.target, 1)
        }
        else {
            this.instance.sourceOrTargetChanged(this.floatingId, this.jpc.sourceId, this.jpc, this.jpc.source, 0)
        }

        // when makeSource has uniqueEndpoint:true, we want to create connections with new endpoints
        // that are subsequently deleted. So makeSource sets `finalEndpoint`, which is the Endpoint to
        // which the connection should be attached. The `detachFromConnection` call below results in the
        // temporary endpoint being cleaned up.
        if (this.jpc.endpoints[0].finalEndpoint) {
            let _toDelete = this.jpc.endpoints[0]
            _toDelete.detachFromConnection(this.jpc)
            this.jpc.endpoints[0] = this.jpc.endpoints[0].finalEndpoint
            this.jpc.endpoints[0].addConnection(this.jpc)
        }

        // if optionalData was given, merge it onto the connection's data.
        if (IS.anObject(optionalData)) {
            this.jpc.mergeData(optionalData)
        }

        if (this._originalAnchor) {
            this.jpc.endpoints[0].setAnchor(this._originalAnchor)
            this._originalAnchor = null
        }

        this.instance._finaliseConnection(this.jpc, null, originalEvent)
        this.instance.setHover(this.jpc, false)

        // SP continuous anchor flush
        this.instance.revalidate(this.jpc.endpoints[0].element)
    }

    private _registerFloatingConnection(info:any, conn:Connection, ep:Endpoint) {
        this.floatingConnections[info.id] = conn
        // only register for the target endpoint; we will not be dragging the source at any time
        // before this connection is either discarded or made into a permanent connection.
        addToDictionary(this.instance.endpointsByElement, info.id, ep)
    }

    private getFloatingAnchorIndex(jpc:Connection):number {
        return jpc.endpoints[0].isFloating() ? 0 : jpc.endpoints[1].isFloating() ? 1 : 1  // default to 1, because a drag of a new connection is index 1.
    }
        
}

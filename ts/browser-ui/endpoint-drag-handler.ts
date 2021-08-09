import {
    CLASS_DRAG_ACTIVE,
    CLASS_DRAG_HOVER,
    DragHandler
} from "./drag-manager"
import {BrowserJsPlumbInstance, getPositionOnElement} from "./browser-jsplumb-instance"
import { jsPlumbDOMElement} from './element-facade'

import {
    EVENT_MOUSEDOWN,
    EVENT_MOUSEUP,
    EVENT_CONNECTION_ABORT,
    EVENT_CONNECTION_DRAG, ATTRIBUTE_JTK_SCOPE
} from './constants'

import {consume, createElement, findParent} from "./browser-util"

import {Drag, DragStartEventParams,
    DragStopEventParams, DragEventParams} from "./collicat"

import {
    INTERCEPT_BEFORE_DETACH,
    CHECK_CONDITION,
    CHECK_DROP_ALLOWED,
    classList,
    cls,
    Connection,
    Endpoint,
    EndpointRepresentation,
    EVENT_MAX_CONNECTIONS,
    IS_DETACH_ALLOWED,
    SOURCE,
    SourceDefinition,
    SourceOrTargetDefinition,
    TARGET,
    TargetSelector,
    INTERCEPT_BEFORE_DRAG,
    INTERCEPT_BEFORE_START_DETACH,
    SELECTOR_MANAGED_ELEMENT,
    CLASS_ENDPOINT,
    ATTRIBUTE_SCOPE_PREFIX,
    SourceSelector, InternalEndpointOptions,
    BehaviouralTypeDescriptor,
    createFloatingAnchor, LightweightFloatingAnchor, REDROP_POLICY_ANY
} from "@jsplumb/core"

import { FALSE,
    AnchorSpec, EndpointSpec, PaintStyle } from "@jsplumb/common"

import {
    getAllWithFunction,
    merge,
    isAssignableFrom,
    getWithFunction,
    forEach,
    PointXY,
    Size,
    extend,
    functionChain,
    IS,
    Dictionary,
    each,
    intersects,
    addToDictionary,
    BoundingBox
} from "@jsplumb/util"
import {ATTRIBUTE_JTK_ENABLED, ELEMENT_DIV} from "./constants"

function _makeFloatingEndpoint (paintStyle:PaintStyle,
                                endpoint:EndpointSpec | EndpointRepresentation<any>,
                                referenceCanvas:Element,
                                sourceElement:jsPlumbDOMElement,
                                instance:BrowserJsPlumbInstance,
                                scope?:string)
{
    let floatingAnchor = createFloatingAnchor(instance, sourceElement)// { reference: referenceAnchor, referenceCanvas: referenceCanvas })

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

type EndpointDropTarget = {el:jsPlumbDOMElement, endpoint:Endpoint, r:BoundingBox, def?:SourceOrTargetDefinition, targetEl:jsPlumbDOMElement, rank?:number}

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
    floatingAnchor:LightweightFloatingAnchor

    _stopped:boolean
    inPlaceCopy:any
    endpointDropTargets:Array<EndpointDropTarget> = []
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
        let container = this.instance.getContainer()

        let parent = findParent(eventTarget, SELECTOR_MANAGED_ELEMENT, container, true);

        if (def.parentSelector != null) {
            const child = findParent(eventTarget, def.parentSelector, container, true);
            if (child != null) {
                parent = findParent(child.parentNode, SELECTOR_MANAGED_ELEMENT, container, false);
            }
            return child || parent
        } else {
            return parent
        }
    }

    private _mousedownHandler (e:MouseEvent) {

        let sourceEl:jsPlumbDOMElement
        let sourceDef:SourceDefinition

        if (e.which === 3 || e.button === 2) {
            return
        }

        const eventTarget = (e.target || e.srcElement) as jsPlumbDOMElement

        sourceDef = this._getSourceDefinition(e)

        // first test for a source definition registered on the instance whose selector matches the target of this event
        if (sourceDef != null) {
            // then get the associated element, using the definition's own `parentSelector`, if provided, or the default.
            sourceEl = this._resolveDragParent(sourceDef.def, eventTarget)
            if (sourceEl == null || sourceEl.getAttribute(ATTRIBUTE_JTK_ENABLED) === FALSE) {
                return
            }
        }

        if (sourceDef) {

            let sourceElement = e.currentTarget as jsPlumbDOMElement, def

            if(eventTarget.getAttribute(ATTRIBUTE_JTK_ENABLED) !== FALSE) {

                consume(e)

                this._activeDefinition = sourceDef

                // at this point we have a mousedown event on an element that is configured as a drag source.

                def = sourceDef.def
                // if maxConnections reached
                let sourceCount = this.instance.select({source: sourceEl}).length
                if (sourceDef.maxConnections >= 0 && (sourceCount >= sourceDef.maxConnections)) {
                    consume(e)
                    if (def.onMaxConnections) {
                        def.onMaxConnections({
                            element: sourceEl,
                            maxConnections: sourceDef.maxConnections
                        }, e)
                    }
                    e.stopImmediatePropagation && e.stopImmediatePropagation()
                    return false
                }

                // find the position on the element at which the mouse was pressed; this is where the endpoint
                // will be located.
                let elxy = getPositionOnElement(e, sourceEl, this.instance.currentZoom)

                // we need to override the anchor in here, and force 'isSource', but we don't want to mess with
                // the params passed in, because after a connection is established we're going to reset the endpoint
                // to have the anchor we were given.
                let tempEndpointParams: any = {element: sourceEl}
                extend(tempEndpointParams, def)
                tempEndpointParams.isTemporarySource = true

                // if the definition declared a scope, use it
                if (def.scope) {
                    tempEndpointParams.scope = def.scope
                } else {
                    // otherwise if the element itself declared a scope, use that
                    const scopeFromElement  = eventTarget.getAttribute(ATTRIBUTE_JTK_SCOPE)
                    if (scopeFromElement != null) {
                        tempEndpointParams.scope = scopeFromElement
                    }
                    // otherwise we'll use the default scope
                }

                // what we want to do here is have `addEndpoint` contact the parameter extractor, because then we could use the same one
                // between drag and programmatic. but we don't want to overwrite `anchor` or `deleteOnEmpty`, and also we want to get
                // the original anchor back from the params, which wouldn't, of course, have been finalised until after addEndpoint had
                // contacted the parameter extractor.

                // perhaps extract some parameters from a parameter extractor
                const extractedParameters = def.parameterExtractor ? def.parameterExtractor(sourceEl, eventTarget as Element) : {}
                tempEndpointParams = merge(tempEndpointParams, extractedParameters)

                // keep a reference to the anchor we want to use if the connection is finalised, and then write a temp anchor
                // for the drag
                this._originalAnchor = tempEndpointParams.anchor || this.instance.defaults.anchor

                tempEndpointParams.anchor = [elxy.x, elxy.y, 0, 0]
                tempEndpointParams.deleteOnEmpty = true

                // add an endpoint to the element that is the connection source, using the anchor that will position it where
                // the mousedown event occurred.

                // ideally we would have `managed` the sourceEl before this call, since if the element is not yet managed then
                // an internal ID will be assigned here. but the toolkit edition would like this id to be `vertex.port`

                this.ep = this.instance._internal_newEndpoint(tempEndpointParams)

                // optionally check for attributes to extract from the source element
                let payload = {}
                if (def.extract) {
                    for (let att in def.extract) {
                        //let v = sourceEl.getAttribute(att)
                        let v = eventTarget.getAttribute(att)
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
                    } else {
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
        let n = createElement(ELEMENT_DIV, { position : "absolute" }) as jsPlumbDOMElement
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
            type: this.ep.edgeType,
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
        this.floatingEndpoint.mergeParameters(this.jpc.suspendedEndpoint.parameters)
        this.jpc.endpoints[anchorIdx] = this.floatingEndpoint

        this.jpc.addClass(this.instance.draggingClass)

        this.floatingId = this.placeholderInfo.id
        this.floatingIndex = anchorIdx
    }

    /**
     * Returns whether or not a connection drag should start, and, if so, optionally returns a payload to associate with the drag.
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
        if (this.ep.edgeType != null) {
            const aae = this.instance._deriveEndpointAndAnchorSpec(this.ep.edgeType)
            endpointToFloat = aae.endpoints[1]
        }

        this.floatingEndpoint = _makeFloatingEndpoint(this.ep.getPaintStyle(), endpointToFloat, canvasElement, this.placeholderInfo.element, this.instance, this.ep.scope)
        this.floatingAnchor = this.floatingEndpoint._anchor as LightweightFloatingAnchor//this.instance.router.getAnchor(this.floatingEndpoint)

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
                    this.endpointDropTargets.push({el: candidate, targetEl:candidate, r: boundingRect, endpoint: candidate.jtk.endpoint, def:null})
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
                // get a list of dom elements that are targets. note the check on `redrop` here: if `strict` then we can only drop on the parts of
                // source elements defined via the `selector`. If `any` then we can drop anywhere on the elements.
                const targetZones = this.instance.getContainer().querySelectorAll(sourceDef.redrop === REDROP_POLICY_ANY ? SELECTOR_MANAGED_ELEMENT : sourceDef.selector)
                forEach(targetZones, (el:Element) => {

                    if (el.getAttribute(ATTRIBUTE_JTK_ENABLED) !== FALSE) {

                        // if the target element declared a scope, test that it matches our current endpoint's scope
                        const scopeFromElement  = el.getAttribute(ATTRIBUTE_JTK_SCOPE)
                        if (scopeFromElement != null && scopeFromElement !== this.ep.scope) {
                            return
                        }

                        let d: any = {r: null, el}
                        d.targetEl = findParent(el as unknown as jsPlumbDOMElement, SELECTOR_MANAGED_ELEMENT, this.instance.getContainer(), true)

                        const o = this.instance.getOffset(d.el), s = this.instance.getSize(d.el)
                        d.r = {x: o.x, y: o.y, w: s.w, h: s.h}

                        if (sourceDef.def.def.rank != null) {
                            d.rank = sourceDef.def.def.rank
                        }

                        d.def = sourceDef
                        this.endpointDropTargets.push(d)
                        this.instance.addClass(d.targetEl, CLASS_DRAG_ACTIVE)
                    }
                })
            }

        } else {

            const targetDefs = getAllWithFunction(this.instance.targetSelectors,  (tSel:TargetSelector) => {
                return tSel.isEnabled()
            })

            targetDefs.forEach((targetDef:TargetSelector) => {
                const targetZones = this.instance.getContainer().querySelectorAll(targetDef.selector)
                forEach(targetZones, (el:Element) => {

                    if (el.getAttribute(ATTRIBUTE_JTK_ENABLED) !== FALSE) {

                        // if the target element declared a scope, test that it matches our current endpoint's scope
                        const scopeFromElement  = el.getAttribute(ATTRIBUTE_JTK_SCOPE)
                        if (scopeFromElement != null && scopeFromElement !== this.ep.scope) {
                            return
                        }

                        let d: any = {r: null, el}

                        if (targetDef.def.def.parentSelector != null) {
                            d.targetEl = findParent(el as unknown as jsPlumbDOMElement, targetDef.def.def.parentSelector, this.instance.getContainer(), true)
                        }
                        if (d.targetEl == null) {
                            d.targetEl = findParent(el as unknown as jsPlumbDOMElement, SELECTOR_MANAGED_ELEMENT, this.instance.getContainer(), true)
                        }

                        // if loopback disallowed on source or target definition and this target is the current element, skip it
                        if (targetDef.def.def.allowLoopback === false || (this._activeDefinition && this._activeDefinition.def.allowLoopback === false)) {
                            if (d.targetEl === this.ep.element) {
                                return
                            }
                        }

                        const o = this.instance.getOffset(el), s = this.instance.getSize(el)
                        d.r = {x: o.x, y: o.y, w: s.w, h: s.h}

                        d.def = targetDef.def

                        if (targetDef.def.def.rank != null) {
                            d.rank = targetDef.def.def.rank
                        }
                        this.endpointDropTargets.push(d)
                        this.instance.addClass(d.targetEl, CLASS_DRAG_ACTIVE)
                    }
                })
            })
        }

        this.endpointDropTargets.sort((a:EndpointDropTarget, b:EndpointDropTarget) =>{

            // if target A is a group and target B is not, target B takes precedence
            if (a.targetEl._isJsPlumbGroup && !b.targetEl._isJsPlumbGroup) {
                return 1
            // if target B is a group and target A is not, target A takes precedence
            } else if (!a.targetEl._isJsPlumbGroup && b.targetEl._isJsPlumbGroup) {
                return -1
            } else {
                // if they are both groups, is one nested inside the other?
                if(a.targetEl._isJsPlumbGroup && b.targetEl._isJsPlumbGroup) {
                    if (this.instance.groupManager.isAncestor(a.targetEl._jsPlumbGroup, b.targetEl._jsPlumbGroup)) {
                        // b is an ancestor of a. return -1
                        return -1
                    } else if (this.instance.groupManager.isAncestor(b.targetEl._jsPlumbGroup, a.targetEl._jsPlumbGroup)) {
                        // a is an ancestor of b
                        return 1
                    }
                    // if noone's an ancestor, fall through to the ranking code.
                } else {
                    if (a.rank != null && b.rank != null) {
                        if (a.rank > b.rank) {
                            return -1
                        } else if (a.rank < b.rank) {
                            return 1
                        } else {

                        }
                    } else {
                        return 0
                    }
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

                if (intersects(boundingRect, this.endpointDropTargets[i].r)) {
                    newDropTarget = this.endpointDropTargets[i]
                    break
                }
            }

            if (newDropTarget !== this.currentDropTarget && this.currentDropTarget != null) {
                idx = this._getFloatingAnchorIndex()

                this.instance.removeClass(this.currentDropTarget.el, CLASS_DRAG_HOVER)

                if (this.currentDropTarget.endpoint) {
                    this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropAllowedClass)
                    this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropForbiddenClass)
                }

                this.floatingAnchor.out()
            }

            if (newDropTarget != null) {
                this.instance.addClass(newDropTarget.el, CLASS_DRAG_HOVER)

                idx = this._getFloatingAnchorIndex()

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

                        this.floatingAnchor.over(newDropTarget.endpoint)
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
        let idx = this._getFloatingAnchorIndex()

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
            let idx = this._getFloatingAnchorIndex()
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
                                maxConnections: this.instance.defaults.maxConnections
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

            // TODO if the connection has been deleted then we dont want to update overlays.
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

            const eventTarget = (p.e.target || p.e.srcElement) as Element

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

            if(targetDefinition.def.portId != null) {
                pp.portId = targetDefinition.def.portId
            }

            const extractedParameters = targetDefinition.def.parameterExtractor ? targetDefinition.def.parameterExtractor(this.currentDropTarget.el, eventTarget) : {}
            pp = merge(pp, extractedParameters)

            pp.element = this.currentDropTarget.targetEl
            dropEndpoint = this.instance._internal_newEndpoint(pp);

            (<any>dropEndpoint)._mtNew = true
            dropEndpoint.deleteOnEmpty = true

            if (targetDefinition.def.parameters) {
                dropEndpoint.mergeParameters(targetDefinition.def.parameters)
            }

            // if `extract` defined, read out attributes values and write to the drop endpoint's parameters
            if (targetDefinition.def.extract) {
                let tpayload = {}
                for (let att in targetDefinition.def.extract) {
                    let v = this.currentDropTarget.el.getAttribute(att)
                    if (v) {
                        tpayload[targetDefinition.def.extract[att]] = v
                    }
                }

                dropEndpoint.mergeParameters(tpayload)
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

    private _getFloatingAnchorIndex() {
        return this.floatingIndex == null ? 1 : this.floatingIndex
    }
        
}

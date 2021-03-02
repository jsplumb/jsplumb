import {BoundingBox, Dictionary, extend, IS, uuid, PointXY, Size} from '@jsplumb/core'
import {addClass, consume, matchesSelector, removeClass, offsetRelativeToRoot} from "./browser-util"
import {EventManager, pageLocation} from "./event-manager"
import { jsPlumbDOMElement} from './element-facade'
import {EVENT_MOUSEUP, EVENT_MOUSEDOWN, EVENT_MOUSEMOVE, EVENT_REVERT} from "./drag-manager"

function findDelegateElement(parentElement:jsPlumbDOMElement, childElement:jsPlumbDOMElement, selector:string) {
    if (matchesSelector(childElement, selector, parentElement)) {
        return childElement
    } else {
        let currentParent = childElement.parentNode as jsPlumbDOMElement
        while (currentParent != null && currentParent !== parentElement) {
            if (matchesSelector(currentParent, selector, parentElement)) {
                return currentParent
            } else {
                currentParent = currentParent.parentNode as jsPlumbDOMElement
            }
        }
    }
}

function _getPosition(el:HTMLElement):PointXY {
    return {
        x: el.offsetLeft, y: el.offsetTop
    }
}

function _getSize(el:HTMLElement):Size {
    return {
        w: el.offsetWidth, h: el.offsetHeight
    }
}

function _setPosition(el:HTMLElement, pos:PointXY) {
    el.style.left = pos.x + "px"
    el.style.top = pos.y + "px"
}

export interface DragStartEventParams {
    e:MouseEvent
    el:jsPlumbDOMElement
    pos:PointXY
    drag:Drag
}

export interface DragEventParams extends DragStartEventParams { }

export type RevertEventParams = jsPlumbDOMElement

export interface BeforeStartEventParams extends DragStartEventParams {}

export interface DragStopEventParams extends DragEventParams {
    finalPos:PointXY
    selection:Array<[jsPlumbDOMElement, PointXY, Drag]>
}

/**
 * Finds all elements matching the given selector, for the given parent. In order to support "scoped root" selectors,
 * ie. things like "> .someClass", that is .someClass elements that are direct children of `parentElement`, we have to
 * jump through a small hoop here: when a delegate draggable is registered, we write a `katavorio-draggable` attribute
 * on the element on which the draggable is registered. Then when this method runs, we grab the value of that attribute and
 * prepend it as part of the selector we're looking for.  So "> .someClass" ends up being written as
 * "[katavorio-draggable='...' > .someClass]", which works with querySelectorAll.
 *
 * @param availableSelectors
 * @param parentElement
 * @param childElement
 * @returns {*}
 */
function findMatchingSelector(availableSelectors:Array<DragParams>, parentElement:jsPlumbDOMElement, childElement:jsPlumbDOMElement):[DragParams, HTMLElement] {
    let el = null
    let draggableId = parentElement.getAttribute("katavorio-draggable"),
        prefix = draggableId != null ? "[katavorio-draggable='" + draggableId + "'] " : ""

    for (let i = 0; i < availableSelectors.length; i++) {
        el = findDelegateElement(parentElement, childElement, prefix + availableSelectors[i].selector)
        if (el != null) {
            if (availableSelectors[i].filter) {
                const matches = matchesSelector(childElement, availableSelectors[i].filter, el),
                    exclude = availableSelectors[i].filterExclude === true

                if ( (exclude && !matches) || matches) {
                    return null
                }

            }
            return [ availableSelectors[i], el ]
        }
    }
    return null
}

export const EVENT_START = "start"
export const EVENT_BEFORE_START = "beforeStart"
export const EVENT_DRAG = "drag"
export const EVENT_DROP = "drop"
export const EVENT_OVER = "over"
export const EVENT_OUT = "out"
export const EVENT_STOP = "stop"
const ATTRIBUTE_DRAGGABLE = "katavorio-draggable"

const CLASS_DRAGGABLE = ATTRIBUTE_DRAGGABLE

const DEFAULT_GRID_X = 10
const DEFAULT_GRID_Y = 10
const TRUE = function() { return true; }
const FALSE = function() { return false; }

const _classes:Dictionary<string> = {
    delegatedDraggable:"katavorio-delegated-draggable",  // elements that are the delegated drag handler for a bunch of other elements
    draggable:CLASS_DRAGGABLE,    // draggable elements
    drag : "katavorio-drag",            // elements currently being dragged
    selected:"katavorio-drag-selected", // elements in current drag selection
    //active : "katavorio-drag-active",   // droppables that are targets of a currently dragged element
    //hover : "katavorio-drag-hover",     // droppables over which a matching drag element is hovering
    noSelect : "katavorio-drag-no-select", // added to the body to provide a hook to suppress text selection
    ghostProxy:"katavorio-ghost-proxy",  // added to a ghost proxy element in use when a drag has exited the bounds of its parent.
    clonedDrag:"katavorio-clone-drag"     // added to a node that is a clone of an element created at the start of a drag
}



const _events = [ EVENT_STOP, EVENT_START, EVENT_DRAG, EVENT_DROP, EVENT_OVER, EVENT_OUT, EVENT_BEFORE_START ]
const _devNull = function() {}

const _each = function(obj:any, fn:any) {
    if (obj == null) return
    obj = !IS.aString(obj) && (obj.tagName == null && obj.length != null) ? obj : [ obj ]
    for (let i = 0; i < obj.length; i++)
        fn.apply(obj[i], [ obj[i] ])
}

//
// filters out events on all input elements, like textarea, checkbox, input, select.
// Collicat has a default list of these.
//
const _inputFilter = function(e:Event, el:HTMLElement, collicat:Collicat) {
    const t = (e.srcElement || e.target) as jsPlumbDOMElement
    return !matchesSelector(t, collicat.getInputFilterSelector(), el)
}

abstract class Base {

    abstract _class:string

    uuid = uuid()
    private enabled = true
    scopes:Array<string> = []

    protected constructor(protected el:jsPlumbDOMElement, protected k:Collicat) { }

    setEnabled(e:boolean) {
        this.enabled = e
    }

    isEnabled():boolean {
        return this.enabled
    }

    toggleEnabled() {
        this.enabled = !this.enabled
    }

    addScope (scopes:string) {
        const m:Dictionary<boolean> = {}
        _each(this.scopes, (s:string) => { m[s] = true;})
        _each(scopes ? scopes.split(/\s+/) : [], (s:string) => { m[s] = true;})
        this.scopes.length = 0
        for (let i in m) {
            this.scopes.push(i)
        }
    }

    removeScope (scopes:string) {
        const m:Dictionary<boolean> = {}
        _each(this.scopes, (s:string) => { m[s] = true;})
        _each(scopes ? scopes.split(/\s+/) : [], (s:string) => { delete m[s];})
        this.scopes.length = 0
        for (let i in m) {
            this.scopes.push(i)
        }
    }

    toggleScope (scopes:string) {
        const m:Dictionary<boolean> = {}
        _each(this.scopes, (s:string) => { m[s] = true;})
        _each(scopes ? scopes.split(/\s+/) : [], (s:string) => {
            if (m[s]) delete m[s]
            else m[s] = true
        })
        this.scopes.length = 0
        for (let i in m) {
            this.scopes.push(i)
        }
    }
}

export type GhostProxyGenerator = (el:Element) => Element

function getConstrainingRectangle(el:jsPlumbDOMElement):{w:number, h:number} {
    return { w:el.parentNode.scrollWidth, h:el.parentNode.scrollHeight }
}

export type Grid = [number, number]

export interface DragHandlerOptions {
    selector?:string
    start?:(p:DragStartEventParams) => any
    stop?:(p:DragStopEventParams) => any
    drag?:(p:DragEventParams) => any
    beforeStart?:(beforeStartParams:BeforeStartEventParams) => void
    dragInit?:(el:Element) => any
    dragAbort?:(el:Element) => any
    ghostProxy?:GhostProxyGenerator | boolean
    makeGhostProxy?:GhostProxyGenerator
    useGhostProxy?:(container:any, dragEl:jsPlumbDOMElement) => boolean
    ghostProxyParent?:Element
    constrain?:ConstrainFunction | boolean
    revert?:RevertFunction
    filter?:string
    filterExclude?:boolean
    snapThreshold?:number
    grid?:Grid
    allowNegative?:boolean
}

export interface DragParams extends DragHandlerOptions {
    rightButtonCanDrag?:boolean
    consumeStartEvent?:boolean
    clone?:boolean
    scroll?:boolean
    multipleDrop?:boolean

    containment?:boolean

    canDrag?:Function
    consumeFilteredEvents?:boolean
    events?:Dictionary<Function>
    parent?:any
    ignoreZoom?:boolean


    scope?:string
}

export class Drag extends Base {

    _class:string
    rightButtonCanDrag:boolean
    consumeStartEvent:boolean
    clone:boolean
    scroll:boolean

    private _downAt:PointXY
    private _posAtDown:PointXY
    private _pagePosAtDown:PointXY
    private _pageDelta:PointXY = {x:0, y:0}
    private _moving: boolean
    private _initialScroll:PointXY = {x:0, y:0}
    _size:Size
    private _currentParentPosition:PointXY
    private _ghostParentPosition:PointXY

    private _dragEl:jsPlumbDOMElement
    private _multipleDrop:boolean

    private _ghostProxyOffsets:PointXY
    private _ghostDx:number
    private _ghostDy:number

    _ghostProxyParent:jsPlumbDOMElement
    _isConstrained: boolean = false
    _useGhostProxy:Function
    _activeSelectorParams:DragParams
    _availableSelectors:Array<DragParams> = []
    _ghostProxyFunction:GhostProxyGenerator
    _snapThreshold:number
    _grid:Grid
    _allowNegative:boolean
    _constrain:ConstrainFunction
    _revertFunction:RevertFunction
    _canDrag:Function
    private _consumeFilteredEvents:boolean
    private _parent:jsPlumbDOMElement
    private _ignoreZoom:boolean

    // a map of { spec -> [ fn, exclusion ] } entries.
    _filters:Dictionary<[Function, boolean]> = {}

    _constrainRect:{w:number, h:number}
    _elementToDrag:jsPlumbDOMElement

    downListener:(e:MouseEvent) => void
    moveListener:(e:MouseEvent) => void
    upListener:(e?:MouseEvent) => void

    listeners:Dictionary<Array<Function>> = {"start":[], "drag":[], "stop":[], "over":[], "out":[], "beforeStart":[], "revert":[] }

    constructor(el:jsPlumbDOMElement, params: DragParams, k:Collicat) {

        super(el, k)

        this._class = this.k.css.draggable
        addClass(this.el, this._class)

        this.downListener = this._downListener.bind(this)
        this.upListener = this._upListener.bind(this)
        this.moveListener = this._moveListener.bind(this)

        this.rightButtonCanDrag = params.rightButtonCanDrag === true
        this.consumeStartEvent = params.consumeStartEvent !== false
        this._dragEl = this.el
        this.clone = params.clone === true
        this.scroll= params.scroll === true
        this._multipleDrop = params.multipleDrop !== false
        this._grid = params.grid
        this._allowNegative = params.allowNegative
        this._revertFunction = params.revert
        this._canDrag = params.canDrag || TRUE
        this._consumeFilteredEvents = params.consumeFilteredEvents
        this._parent = params.parent
        this._ignoreZoom = params.ignoreZoom === true
        this._ghostProxyParent = params.ghostProxyParent as jsPlumbDOMElement

        if (params.ghostProxy === true) {
            this._useGhostProxy = TRUE
        } else {
            if (params.ghostProxy && typeof params.ghostProxy === "function") {
                this._useGhostProxy = params.ghostProxy as Function
            } else {
                this._useGhostProxy = (container:any, dragEl:any) => {
                    if (this._activeSelectorParams && this._activeSelectorParams.useGhostProxy) {
                        return this._activeSelectorParams.useGhostProxy(container, dragEl)
                    } else {
                        return false
                    }
                }
            }
        }

        if (params.makeGhostProxy) {
            this._ghostProxyFunction = params.makeGhostProxy
        } else {

            this._ghostProxyFunction = (el:any) => {
                if (this._activeSelectorParams && this._activeSelectorParams.makeGhostProxy) {
                    return this._activeSelectorParams.makeGhostProxy(el)
                } else {
                    return el.cloneNode(true)
                }
            }

        }

        if (params.selector) {
            let draggableId = this.el.getAttribute(ATTRIBUTE_DRAGGABLE)
            if (draggableId == null) {
                draggableId = "" + new Date().getTime()
                this.el.setAttribute("katavorio-draggable", draggableId)
            }

            this._availableSelectors.push(params)
        }

        this._snapThreshold = params.snapThreshold
        this.setConstrain(typeof params.constrain === "function" ? params.constrain  : (params.constrain || params.containment))

        this.k.eventManager.on(this.el, EVENT_MOUSEDOWN, this.downListener)
    }

    on (evt:string, fn:Function) {
        if (this.listeners[evt]) {
            this.listeners[evt].push(fn)
        }
    }

    off (evt:string, fn:Function) {
        if (this.listeners[evt]) {
            const l = []
            for (let i = 0; i < this.listeners[evt].length; i++) {
                if (this.listeners[evt][i] !== fn) {
                    l.push(this.listeners[evt][i])
                }
            }
            this.listeners[evt] = l
        }
    }

    private _upListener (e?:MouseEvent) {
        if (this._downAt) {

            this._downAt = null
            this.k.eventManager.off(document, EVENT_MOUSEMOVE, this.moveListener)
            this.k.eventManager.off(document, EVENT_MOUSEUP, this.upListener)
            removeClass(document.body as any, _classes.noSelect)
            this.unmark(e)
            this.stop(e)
            this._moving = false

            if (this.clone) {
                this._dragEl && this._dragEl.parentNode && this._dragEl.parentNode.removeChild(this._dragEl)
                this._dragEl = null
            } else {
                if (this._revertFunction && this._revertFunction(this._dragEl, _getPosition(this._dragEl)) === true) {
                    _setPosition(this._dragEl, this._posAtDown)
                    this._dispatch<RevertEventParams>(EVENT_REVERT, this._dragEl)
                }
            }

        }
    }

    private _downListener (e:MouseEvent) {
        if (e.defaultPrevented) { return; }
        const isNotRightClick = this.rightButtonCanDrag || (e.which !== 3 && e.button !== 2)
        if (isNotRightClick && this.isEnabled() && this._canDrag()) {

            const _f =  this._testFilter(e) && _inputFilter(e, this.el, this.k)
            if (_f) {

                this._activeSelectorParams = null
                this._elementToDrag = null

                if (this._availableSelectors.length === 0) {
                    console.log("JSPLUMB: no available drag selectors")
                }

                const eventTarget = (e.target || e.srcElement) as jsPlumbDOMElement
                const match = findMatchingSelector(this._availableSelectors, this.el, eventTarget)
                if (match != null) {
                    this._activeSelectorParams = match[0]
                    this._elementToDrag = match[1] as jsPlumbDOMElement
                }

                if(this._activeSelectorParams == null || this._elementToDrag == null) {
                    return
                }

                // dragInit gives a handler a chance to provide the actual element to drag. in the case of the endpoint stuff, for instance,
                // this is the drag placeholder. but for element drag the current value of `_elementToDrag` is the one we want to use.
                const initial = this._activeSelectorParams.dragInit ? this._activeSelectorParams.dragInit(this._elementToDrag) : null
                if (initial != null) {
                    this._elementToDrag = initial
                }

                if (this.clone) {
                    // here when doing a makeSource endpoint we dont end up with the right
                    this._dragEl = this._elementToDrag.cloneNode(true)
                    addClass(this._dragEl, _classes.clonedDrag)

                    this._dragEl.setAttribute("id", null)
                    this._dragEl.style.position = "absolute"

                    if (this._parent != null) {
                        const p = _getPosition(this.el)
                        this._dragEl.style.left = p.x + "px"
                        this._dragEl.style.top = p.y + "px"
                        this._parent.appendChild(this._dragEl)
                    } else {
                        // the clone node is added to the body; getOffsetRect gives us a value
                        // relative to the body.
                        const b = offsetRelativeToRoot(this._elementToDrag)
                        this._dragEl.style.left = b.x + "px"
                        this._dragEl.style.top = b.y + "px"

                        document.body.appendChild(this._dragEl)
                    }

                } else {
                    this._dragEl = this._elementToDrag
                }

                if(this.consumeStartEvent) {
                    consume(e)
                }


                this._downAt = pageLocation(e)

                if (this._dragEl && this._dragEl.parentNode) {
                    this._initialScroll = {x:this._dragEl.parentNode.scrollLeft, y:this._dragEl.parentNode.scrollTop}
                }

                this._posAtDown = _getPosition(this._dragEl)

                this._pagePosAtDown = offsetRelativeToRoot(this._dragEl)
                this._pageDelta = {x:this._pagePosAtDown.x - this._posAtDown.x, y:this._pagePosAtDown.y - this._posAtDown.y}
                this._size = _getSize(this._dragEl)

                this.k.eventManager.on(document, EVENT_MOUSEMOVE, this.moveListener)
                this.k.eventManager.on(document, EVENT_MOUSEUP, this.upListener)

                addClass(document.body as any, _classes.noSelect)
                this._dispatch<BeforeStartEventParams>(EVENT_BEFORE_START, {el:this.el, pos:this._posAtDown, e:e, drag:this})
            }
            else if (this._consumeFilteredEvents) {
                consume(e)
            }
        }
    }

    private _moveListener(e:MouseEvent) {
        if (this._downAt) {
            if (!this._moving) {
                const dispatchResult = this._dispatch<DragStartEventParams>(EVENT_START, {el:this.el, pos:this._posAtDown, e:e, drag:this})
                if (dispatchResult !== false) {
                    if (!this._downAt) {
                        return
                    }
                    this.mark(dispatchResult)
                    this._moving = true
                } else {
                    this.abort()
                }
            }

            // it is possible that the start event caused the drag to be aborted. So we check
            // again that we are currently dragging.
            if (this._downAt) {
                let pos:PointXY = pageLocation(e),
                    dx = pos.x - this._downAt.x,
                    dy = pos.y - this._downAt.y,
                    z = this._ignoreZoom ? 1 : this.k.getZoom()

                if (this._dragEl && this._dragEl.parentNode)
                {
                    dx += this._dragEl.parentNode.scrollLeft - this._initialScroll.x
                    dy += this._dragEl.parentNode.scrollTop - this._initialScroll.y
                }

                dx /= z
                dy /= z

                this.moveBy(dx, dy, e)
            }
        }
    }

    private mark(payload:any) {

        this._posAtDown = _getPosition(this._dragEl)

        this._pagePosAtDown = offsetRelativeToRoot(this._dragEl)
        this._pageDelta = {x:this._pagePosAtDown.x - this._posAtDown.x, y:this._pagePosAtDown.y - this._posAtDown.y}
        this._size = _getSize(this._dragEl)
        addClass(this._dragEl, this.k.css.drag)

        this._constrainRect = getConstrainingRectangle(this._dragEl)

        this._ghostDx = 0
        this._ghostDy = 0
    }

    private unmark(e:MouseEvent) {

        if (this._isConstrained && this._useGhostProxy(this._elementToDrag, this._dragEl)) {
            this._ghostProxyOffsets = {x:this._dragEl.offsetLeft - this._ghostDx, y:this._dragEl.offsetTop - this._ghostDy}
            this._dragEl.parentNode.removeChild(this._dragEl)
            this._dragEl = this._elementToDrag
        }
        else {
            this._ghostProxyOffsets = null
        }

        removeClass(this._dragEl, this.k.css.drag)
        this._isConstrained = false
    }

    moveBy (dx:number, dy:number, e?:MouseEvent) {

        let desiredLoc = this.toGrid({x:this._posAtDown.x + dx, y:this._posAtDown.y + dy}),
            cPos:PointXY = this._doConstrain(desiredLoc, this._dragEl, this._constrainRect, this._size)

        // if we should use a ghost proxy...
        if (this._useGhostProxy(this.el, this._dragEl)) {
            // and the element has been dragged outside of its parent bounds
            if (desiredLoc.x !== cPos.x || desiredLoc.y !== cPos.y) {

                // ...if ghost proxy not yet created
                if (!this._isConstrained) {
                    // create it
                    let gp = this._ghostProxyFunction(this._elementToDrag) as jsPlumbDOMElement
                    addClass(gp, _classes.ghostProxy)

                    if (this._ghostProxyParent) {
                        this._ghostProxyParent.appendChild(gp)
                        // find offset between drag el's parent the ghost parent
                        this._currentParentPosition = offsetRelativeToRoot(this._elementToDrag.parentNode)
                        this._ghostParentPosition = offsetRelativeToRoot(this._ghostProxyParent)

                        this._ghostDx = this._currentParentPosition.x - this._ghostParentPosition.x
                        this._ghostDy = this._currentParentPosition.y - this._ghostParentPosition.y

                    } else {
                        this._elementToDrag.parentNode.appendChild(gp)
                    }

                    // the ghost proxy is the drag element
                    this._dragEl = gp
                    // set this flag so we dont recreate the ghost proxy
                    this._isConstrained = true
                }
                // now the drag position can be the desired position, as the ghost proxy can support it.
                cPos = desiredLoc
            }
            else {
                // if the element is not outside of its parent bounds, and ghost proxy is in place,
                if (this._isConstrained) {
                    // remove the ghost proxy from the dom
                    this._dragEl.parentNode.removeChild(this._dragEl)
                    // reset the drag element to the original element
                    this._dragEl = this._elementToDrag
                    // clear this flag.
                    this._isConstrained = false
                    this._currentParentPosition = null
                    this._ghostParentPosition = null
                    this._ghostDx = 0
                    this._ghostDy = 0
                }
            }
        }

        _setPosition(this._dragEl, {x:cPos.x + this._ghostDx, y:cPos.y + this._ghostDy})

        this._dispatch<DragEventParams>("drag", {el:this.el, pos:cPos, e:e, drag:this})

        /* test to see if the parent needs to be scrolled (future)
         if (scroll) {
         var pnsl = dragEl.parentNode.scrollLeft, pnst = dragEl.parentNode.scrollTop
         console.log("scroll!", pnsl, pnst)
         }*/
    }

    abort() {
        if (this._downAt != null) {
            this._upListener()
        }
    }

    getDragElement (retrieveOriginalElement?:boolean) {
        return retrieveOriginalElement ? this._elementToDrag || this.el : this._dragEl || this.el
    }

    stop (e?:MouseEvent, force?:boolean) {
        if (force || this._moving) {
            let positions:Array<[jsPlumbDOMElement, PointXY, Drag]> = [],
                sel:Array<any> = [],
                dPos = _getPosition(this._dragEl)

            // TODO unreachable..sel was just created.
            if (sel.length > 0) {
                for (let i = 0; i < sel.length; i++) {
                    const p = _getPosition(sel[i].el)
                    positions.push([ sel[i].el, p, sel[i] ])
                }
            }
            else {
                positions.push([ this._dragEl, dPos, this ])
            }

            this._dispatch<DragStopEventParams>("stop", {
                el: this._dragEl,
                pos: this._ghostProxyOffsets || dPos,
                finalPos:dPos,
                e: e,
                drag: this,
                selection:positions
            })
        } else if (!this._moving) {
            this._activeSelectorParams.dragAbort ? this._activeSelectorParams.dragAbort(this._elementToDrag) : null
        }
    }

    private _dispatch<T>(evt:string, value:T) {
        let result = null
        if (this._activeSelectorParams && this._activeSelectorParams[evt]) {
            result = this._activeSelectorParams[evt](value)
        } else if (this.listeners[evt]) {
            for (let i = 0; i < this.listeners[evt].length; i++) {
                try {
                    const v = this.listeners[evt][i](value)
                    if (v != null) {
                        result = v
                    }
                } catch (e) {
                }

            }
        }
        return result
    }

    private _snap (pos:PointXY, gridX:number, gridY:number, thresholdX:number, thresholdY:number):PointXY {

        let _dx = Math.floor(pos.x / gridX),
            _dxl = gridX * _dx,
            _dxt = _dxl + gridX,
            x = Math.abs(pos.x - _dxl) <= thresholdX ? _dxl : Math.abs(_dxt - pos.x) <= thresholdX ? _dxt : pos.x

        let _dy = Math.floor(pos.y / gridY),
            _dyl = gridY * _dy,
            _dyt = _dyl + gridY,
            y = Math.abs(pos.y - _dyl) <= thresholdY ? _dyl : Math.abs(_dyt - pos.y) <= thresholdY ? _dyt : pos.y

        return {x,y}
    }

    private resolveGrid():[ Grid, number, number ] {
        let out:[ Grid, number, number ] = [ this._grid, this._snapThreshold ? this._snapThreshold : DEFAULT_GRID_X / 2, this._snapThreshold ? this._snapThreshold : DEFAULT_GRID_Y / 2 ]
        if(this._activeSelectorParams != null && this._activeSelectorParams.grid != null) {
            out[0] = this._activeSelectorParams.grid
            if (this._activeSelectorParams.snapThreshold != null) {
                out[1] = this._activeSelectorParams.snapThreshold
                out[2] = this._activeSelectorParams.snapThreshold
            }
        }
        return out
    }

    toGrid (pos:PointXY):PointXY {

        const [grid, thresholdX, thresholdY] = this.resolveGrid()

        if (grid == null) {
            // if there's no grid, return the desired position.
            return pos
        }
        else {

            const tx = grid ? grid[0] / 2 : thresholdX,
                ty = grid ? grid[1] / 2 : thresholdY

            return this._snap(pos, grid[0], grid[1], tx, ty)
        }
    }

    // snap (x:number, y:number):PointXY{
    //
    //     const [grid, thresholdX, thresholdY] = this.resolveGrid()
    //
    //     if (this._dragEl == null) {
    //         return
    //     }
    //     x = x || (grid ? grid[0] : DEFAULT_GRID_X)
    //     y = y || (grid ? grid[1] : DEFAULT_GRID_Y)
    //
    //     const p = _getPosition(this._dragEl),
    //         tx = grid ? grid[0] / 2 : thresholdX,
    //         ty = grid ? grid[1] / 2 : thresholdY,
    //         snapped = this._snap(p, x, y, tx, ty)
    //
    //     _setPosition(this._dragEl, snapped)
    //     return snapped
    // }

    setUseGhostProxy (val:boolean) {
        this._useGhostProxy = val ? TRUE : FALSE
    }

    private _negativeFilter (pos:PointXY):PointXY {
        return (this._allowNegative === false) ? {x: Math.max (0, pos.x), y:Math.max(0, pos.y) } : pos
    }

    /**
     * Sets whether or not the Drag is constrained. A value of 'true' means constrain to parent bounds; a function
     * will be executed and returns true if the position is allowed.
     * @param value
     */
    setConstrain (value:ConstrainFunction | boolean) {
        this._constrain = typeof value === "function" ? value as ConstrainFunction : value ? (pos:PointXY, dragEl:jsPlumbDOMElement, _constrainRect:BoundingBox, _size:Size):PointXY => {
            return this._negativeFilter({
                x: Math.max(0, Math.min(_constrainRect.w - _size.w, pos.x)),
                y: Math.max(0, Math.min(_constrainRect.h - _size.h, pos.y))
            })
        }: (pos:PointXY):PointXY => { return this._negativeFilter(pos); }
    }


    private _doConstrain(pos:PointXY, dragEl:jsPlumbDOMElement, _constrainRect:Size, _size:Size) {
        if (this._activeSelectorParams != null && this._activeSelectorParams.constrain && typeof this._activeSelectorParams.constrain === "function") {
            return this._activeSelectorParams.constrain(pos, dragEl, _constrainRect, _size)
        } else {
            return this._constrain(pos, dragEl, _constrainRect, _size)
        }
    }

    /**
     * Sets a function to call on drag stop, which, if it returns true, indicates that the given element should
     * revert to its position before the previous drag.
     * @param fn
     */
    setRevert (fn:RevertFunction) {
        this._revertFunction = fn
    }

    private _assignId (obj:Function | string):string {
        if (typeof obj === "function") {
            (obj as any)._katavorioId = uuid()
            return (obj as any)._katavorioId
        } else {
            return obj
        }
    }

    _testFilter (e:any) {
        for (let key in this._filters) {

            const f = this._filters[key]
            let rv = f[0](e)
            if (f[1]) {
                rv = !rv
            }
            if (!rv) {
                return false
            }
        }
        return true
    }

    addFilter (f:Function|string, _exclude?:boolean) {
        if (f) {
            const key = this._assignId(f)
            this._filters[key] = [
                (e:any) => {
                    const t = e.srcElement || e.target
                    let m
                    if (IS.aString(f)) {
                        m = matchesSelector(t, f as string, this.el)
                    }
                    else if (typeof f === "function") {
                        m = f(e, this.el)
                    }
                    return m
                },
                _exclude !== false
            ]
        }
    }

    removeFilter (f:Function | string) {
        const key = typeof f === "function" ? (f as any)._katavorioId : f
        delete this._filters[key]
    }

    clearAllFilters () {
        this._filters = {}
    }

    addSelector (params:DragHandlerOptions, atStart?:boolean) {
        if (params.selector) {
            if (atStart) {
                this._availableSelectors.unshift(params)
            } else {
                this._availableSelectors.push(params)
            }
        }
    }

    destroy() {
        this.k.eventManager.off(this.el, EVENT_MOUSEDOWN, this.downListener)
        this.k.eventManager.off(document, EVENT_MOUSEMOVE, this.moveListener)
        this.k.eventManager.off(document, EVENT_MOUSEUP, this.upListener)
        this.downListener = null
        this.upListener = null
        this.moveListener = null
    }

}

export type ConstrainFunction = (desiredLoc:PointXY, dragEl:HTMLElement, constrainRect:Size, size:Size) => PointXY
export type RevertFunction = (dragEl:HTMLElement, pos:PointXY) => boolean

export interface CollicatOptions {
    zoom?:number
    css?:Dictionary<string>
    inputFilterSelector?:string
    constrain?:ConstrainFunction
    revert?:RevertFunction
}

export interface jsPlumbDragManager {
    getZoom():number
    setZoom(z:number):void
    getInputFilterSelector():string
    setInputFilterSelector (selector:string):void
    draggable(el:jsPlumbDOMElement, params:DragParams):Drag
    destroyDraggable(el:jsPlumbDOMElement):void
}

const DEFAULT_INPUT_FILTER_SELECTOR = "input,textarea,select,button,option"

export class Collicat implements jsPlumbDragManager {

    eventManager:EventManager
    private zoom:number = 1
    css:Dictionary<string> = {}
    inputFilterSelector:string
    constrain:ConstrainFunction
    revert:RevertFunction

    constructor(options?:CollicatOptions) {
        options = options || {}
        this.inputFilterSelector = options.inputFilterSelector || DEFAULT_INPUT_FILTER_SELECTOR
        this.eventManager = new EventManager()
        this.zoom = options.zoom || 1
        const _c = options.css || {}
        extend(this.css, _c)
        this.constrain = options.constrain
        this.revert = options.revert
    }

    getZoom():number {
        return this.zoom
    }

    setZoom(z:number):void {
        this.zoom = z
    }

    private _prepareParams(p:DragParams):DragParams {

        p = p || {}

        if (p.constrain == null && this.constrain != null) {
            p.constrain = this.constrain
        }

        if (p.revert == null && this.revert != null) {
            p.revert = this.revert
        }

        let _p:DragParams = {
            events:{}
        }, i

        for (i in p) _p[i] = p[i]
        // events

        for (i = 0; i < _events.length; i++) {
            _p.events[_events[i]] = p[_events[i]] || _devNull
        }

        return _p
    }

    /**
     * Gets the selector identifying which input elements to filter from drag events.
     * @method getInputFilterSelector
     * @return {String} Current input filter selector.
     */
    getInputFilterSelector () { return this.inputFilterSelector; }

    /**
     * Sets the selector identifying which input elements to filter from drag events.
     * @method setInputFilterSelector
     * @param {String} selector Input filter selector to set.
     * @return {Collicat} Current instance; method may be chained.
     */
    setInputFilterSelector (selector:string) {
        this.inputFilterSelector = selector
        return this
    }

    draggable(el:jsPlumbDOMElement, params:DragParams):Drag {

        if(el._katavorioDrag == null) {
            const p = this._prepareParams(params)
            const d = new Drag(el, p, this)
            addClass(el, _classes.delegatedDraggable)
            el._katavorioDrag = d
            return d
        } else {
            return el._katavorioDrag
        }
    }

    destroyDraggable(el:jsPlumbDOMElement):void {
        if (el._katavorioDrag) {
            // current selection? are we handling that?
            el._katavorioDrag.destroy()
            delete el._katavorioDrag
        }
    }
}



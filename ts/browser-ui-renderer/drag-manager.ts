import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import {jsPlumbDOMElement} from './element-facade'
import {EVENT_REVERT} from './constants'

import {
    BeforeStartEventParams,
    Collicat,
    ContainmentType,
    Drag,
    DragEventParams,
    DragHandlerOptions,
    DragParams,
    DragStartEventParams,
    DragStopEventParams,
    GhostProxyGenerator
} from "./collicat"

import {CLASS_DRAG_SELECTED, DragSelection} from "./drag-selection"
import {EVENT_ZOOM} from "../core/constants"
import {BoundingBox, extend, forEach, getWithFunction, PointXY, Size, wrap} from "../util/util"

export const CLASS_DELEGATED_DRAGGABLE = "jtk-delegated-draggable"
export const CLASS_DRAGGABLE = "jtk-draggable"
export const CLASS_DRAG_CONTAINER = "jtk-drag"
export const CLASS_GHOST_PROXY = "jtk-ghost-proxy"
export const CLASS_DRAG_ACTIVE = "jtk-drag-active"
export const CLASS_DRAGGED = "jtk-dragged"
export const CLASS_DRAG_HOVER = "jtk-drag-hover"

export interface DragHandler {

    selector:string

    onStart:(params:DragStartEventParams) => boolean
    onDrag:(params:DragEventParams) => void
    onStop:(params:DragStopEventParams) => void
    onDragInit: (el:Element, e:MouseEvent) => Element
    onDragAbort:(el:Element) => void

    reset:() => void
    init:(drag:Drag) => void

    onBeforeStart?:(beforeStartParams:BeforeStartEventParams) => void
}

export interface GhostProxyingDragHandler extends DragHandler {
    useGhostProxy:(container:any, dragEl:Element) => boolean
    makeGhostProxy?:GhostProxyGenerator
}

type DragFilterSpec = [ Function|string, boolean ]

export interface DragManagerOptions {
    trackScroll?:boolean
}

export class DragManager {

    private collicat:Collicat
    private drag:Drag

    _draggables:Record<string, any> = {}
    _dlist:Array<any> = []
    _elementsWithEndpoints:Record<string, any> = {}
    // elementids mapped to the draggable to which they belong.
    _draggablesForElements:Record<string, any> = {}

    handlers:Array<{handler:DragHandler, options:DragHandlerOptions}> = []

    private _trackScroll:boolean

    private _filtersToAdd:Array<DragFilterSpec> = []

    constructor(protected instance:BrowserJsPlumbInstance, protected dragSelection:DragSelection, options?:DragManagerOptions) {

        // create a delegated drag handler
        this.collicat = new Collicat({
            zoom:this.instance.currentZoom,
            css: {
                noSelect: this.instance.dragSelectClass,
                delegatedDraggable: CLASS_DELEGATED_DRAGGABLE,
                draggable: CLASS_DRAGGABLE,
                drag: CLASS_DRAG_CONTAINER,
                selected: CLASS_DRAG_SELECTED,
                active: CLASS_DRAG_ACTIVE,
                hover: CLASS_DRAG_HOVER,
                ghostProxy: CLASS_GHOST_PROXY
            }
        })

        this.instance.bind(EVENT_ZOOM, (z:number) => {
            this.collicat.setZoom(z)
        })

        options = options || {}
        this._trackScroll = options.trackScroll !== false
    }

    addHandler(handler:DragHandler, dragOptions?:DragHandlerOptions):void {
        const o = extend<DragHandlerOptions>({selector:handler.selector} as any, (dragOptions || {}) as any)

        o.start = wrap(o.start, (p:DragStartEventParams) => { return handler.onStart(p); }, false)
        o.drag = wrap(o.drag, (p:DragEventParams) => { return handler.onDrag(p); })
        o.stop = wrap(o.stop, (p:DragStopEventParams) => { return handler.onStop(p); })

        const handlerBeforeStart = (handler.onBeforeStart || ((p:BeforeStartEventParams) =>  {})).bind(handler)
        o.beforeStart = wrap(o.beforeStart, (p:BeforeStartEventParams) => { return handlerBeforeStart(p) })

        o.dragInit = (el:Element, e:MouseEvent) => handler.onDragInit(el, e)
        o.dragAbort = (el:Element) => handler.onDragAbort(el)

        if ((handler as GhostProxyingDragHandler).useGhostProxy) {
            o.useGhostProxy  = (handler as GhostProxyingDragHandler).useGhostProxy
            o.makeGhostProxy  = (handler as GhostProxyingDragHandler).makeGhostProxy
        }

        if(o.constrainFunction == null && o.containment != null) {
            switch(o.containment) {
                case ContainmentType.notNegative: {
                    o.constrainFunction = (pos:PointXY, dragEl:jsPlumbDOMElement, _constrainRect:BoundingBox, _size:Size):PointXY => {
                        return {
                            x: Math.max(0, Math.min(pos.x)),
                            y: Math.max(0, Math.min(pos.y))
                        }
                    }
                    break
                }
                case ContainmentType.parent:{
                    const padding = o.containmentPadding || 5
                    o.constrainFunction = (pos:PointXY, dragEl:jsPlumbDOMElement, _constrainRect:BoundingBox, _size:Size):PointXY => {
                        const x = pos.x < 0 ? 0 : pos.x > (_constrainRect.w - padding) ? _constrainRect.w - padding : pos.x
                        const y = pos.y < 0 ? 0 : pos.y > (_constrainRect.h - padding) ? _constrainRect.h - padding : pos.y
                        return { x,y }
                    }
                    break
                }
                case ContainmentType.parentEnclosed: {
                    o.constrainFunction = (pos:PointXY, dragEl:jsPlumbDOMElement, _constrainRect:BoundingBox, _size:Size):PointXY => {
                        const x = pos.x < 0 ? 0 : (pos.x + _size.w) > _constrainRect.w ? (_constrainRect.w - _size.w) : pos.x
                        const y = pos.y < 0 ? 0 : (pos.y + _size.h) > _constrainRect.h ? (_constrainRect.h - _size.h) : pos.y
                        return { x, y}
                    }
                    break
                }
            }
        }

        if (this.drag == null) {
            // TODO it would be better to separate out DragOptions (for a Drag object) from DragHandlerOptions
            (o as DragParams).trackScroll = this._trackScroll
            this.drag = this.collicat.draggable(this.instance.getContainer(), o)
            forEach(this._filtersToAdd, (filterToAdd) => this.drag.addFilter(filterToAdd[0], filterToAdd[1]))

            this.drag.on(EVENT_REVERT, (el:Element) => {
                this.instance.revalidate(el)
            })

        } else {
            this.drag.addSelector(o)
        }

        this.handlers.push({handler:handler, options:o})

        handler.init(this.drag)
    }

    addSelector (params:DragHandlerOptions, atStart?:boolean) {
        this.drag && this.drag.addSelector(params, atStart)
    }

    addFilter(filter:Function|string, exclude?:boolean) {
        if (this.drag == null) {
            this._filtersToAdd.push([filter, exclude === true ])
        } else {
            this.drag.addFilter(filter, exclude)
        }
    }

    removeFilter(filter:Function|string) {
        if (this.drag != null) {
            this.drag.removeFilter(filter)
        }
    }

    setFilters(filters:Array<[string, boolean]>) {
        forEach(filters, (f) => {
            this.drag.addFilter(f[0], f[1])
        })
    }

    reset():Array<[string, boolean]> {

        let out:Array<[string, boolean]> = []

        forEach(this.handlers,(p:{handler:DragHandler, options:DragHandlerOptions}) => { p.handler.reset() })

        this.handlers.length = 0

        if (this.drag != null) {
            const currentFilters = this.drag._filters

            for(let f in currentFilters) {
                out.push([f, currentFilters[f][1]])
            }
            this.collicat.destroyDraggable(this.instance.getContainer())
        }

        delete this.drag
        return out
    }

    setOption(handler:DragHandler, options:DragHandlerOptions) {
        const handlerAndOptions = getWithFunction(this.handlers, (p) => p.handler === handler)
        if (handlerAndOptions != null) {
            extend(handlerAndOptions.options, options || {})
        }
    }

}

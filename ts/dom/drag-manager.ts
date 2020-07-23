import {BrowserJsPlumbInstance, jsPlumbDOMElement} from "./browser-jsplumb-instance";
import {BoundingBox, Dictionary, extend, PointArray} from "../core";
import {wrap} from "../util";
import {Collicat, Drag, DragHandlerOptions, GhostProxyGenerator} from "./collicat";
import * as Constants from "../constants";

function _isInsideParent(instance:BrowserJsPlumbInstance, _el:HTMLElement, pos:PointArray):boolean {
    const p = <any>_el.parentNode,
        s = instance.getSize(p),
        ss = instance.getSize(_el),
        leftEdge = pos[0],
        rightEdge = leftEdge + ss[0],
        topEdge = pos[1],
        bottomEdge = topEdge + ss[1];

    return rightEdge > 0 && leftEdge < s[0] && bottomEdge > 0 && topEdge < s[1];
}

export const CLASS_DRAG_SELECTED = "jtk-drag-selected";
export const CLASS_DRAG_ACTIVE = "jtk-drag-active";
export const CLASS_DRAGGED = "jtk-dragged";
export const CLASS_DRAG_HOVER = "jtk-drag-hover";
export const ATTR_NOT_DRAGGABLE = "jtk-not-draggable";
export const EVT_DRAG_MOVE = "drag:move";
export const EVT_DRAG_STOP = "drag:stop";
export const EVT_DRAG_START = "drag:start";
export const EVT_MOUSEDOWN = "mousedown";
export const EVT_MOUSEMOVE = "mousemove";
export const EVT_MOUSEUP= "mouseup";
export const EVT_REVERT = "revert";
export const EVT_ZOOM = "zoom";

export const EVT_CONNECTION_DRAG = "connectionDrag";

export interface DragHandler {

    selector:string;

    onStart:(params:{e:MouseEvent, el:jsPlumbDOMElement, finalPos:PointArray, drag:Drag}) => boolean;
    onDrag:(params:{e:MouseEvent, el:jsPlumbDOMElement, finalPos:PointArray, pos:PointArray, drag:Drag}) => void;
    onStop:(params:{e:MouseEvent, el:jsPlumbDOMElement, finalPos:PointArray, pos:PointArray, drag:Drag}) => void;
    onDragInit: (el:HTMLElement) => HTMLElement;
    onDragAbort:(el:HTMLElement) => void;

    reset:() => void;
    init:(drag:Drag) => void;

    onBeforeStart?:(beforeStartParams:any) => void;
}

export interface GhostProxyingDragHandler extends DragHandler {
    useGhostProxy:(container:any, dragEl:any) => boolean;
    makeGhostProxy?:GhostProxyGenerator;
}

type DragFilterSpec = [ Function|string, boolean ];

export class DragManager {

    private collicat:Collicat;
    private drag:Drag;

    _draggables:Dictionary<any> = {};
    _dlist:Array<any> = [];
    _elementsWithEndpoints:Dictionary<any> = {};
    // elementids mapped to the draggable to which they belong.
    _draggablesForElements:Dictionary<any> = {};

    handlers:Array<DragHandler> = [];

    private _filtersToAdd:Array<DragFilterSpec> = [];

    constructor(protected instance:BrowserJsPlumbInstance) {

        // create a delegated drag handler
        this.collicat = this.instance.createDragManager({
            zoom:this.instance.getZoom(),
            css: {
                noSelect: this.instance.dragSelectClass,
                delegatedDraggable: "jtk-delegated-draggable",
                droppable: "jtk-droppable",
                draggable: "jtk-draggable",
                drag: "jtk-drag",
                selected: "jtk-drag-selected",
                active: "jtk-drag-active",
                hover: "jtk-drag-hover",
                ghostProxy: "jtk-ghost-proxy"
            },
            // TODO this should move to the specific drag handler for elements.
            constrain: (desiredLoc:PointArray, dragEl:HTMLElement, constrainRect:BoundingBox, size:PointArray):PointArray => {
                let x = desiredLoc[0], y = desiredLoc[1];

                if ((<any>dragEl)[Constants.PARENT_GROUP_KEY] && (<any>dragEl)[Constants.PARENT_GROUP_KEY].constrain) {
                    x = Math.max(desiredLoc[0], 0);
                    y = Math.max(desiredLoc[1], 0);
                    x = Math.min(x, constrainRect.w - size[0]);
                    y = Math.min(y, constrainRect.h - size[1]);

                }

                return [x, y];
            },
            revert: (dragEl:HTMLElement, pos:PointArray):boolean => {
                const _el = <any>dragEl;
                // if drag el not removed from DOM (pruned by a group), and it has a group which has revert:true, then revert.
                return _el.parentNode != null && _el[Constants.PARENT_GROUP_KEY] && _el[Constants.PARENT_GROUP_KEY].revert ? !_isInsideParent(this.instance, _el, pos) : false;
            }
        });

        this.instance.bind(EVT_ZOOM, (z:number) => {
            this.collicat.setZoom(z);
        });
    }

    addHandler(handler:DragHandler, dragOptions?:DragHandlerOptions):void {
        const o = extend<DragHandlerOptions>({selector:handler.selector} as any, (dragOptions || {}) as any);

        this.handlers.push(handler);

        o.start = wrap(o.start, (p:any) => { return handler.onStart(p); });
        o.drag = wrap(o.drag, (p:any) => { return handler.onDrag(p); });
        o.stop = wrap(o.stop, (p:any) => { return handler.onStop(p); });
        o.beforeStart = (handler.onBeforeStart || function(p:any) {}).bind(handler);
        o.dragInit = (el:HTMLElement) => handler.onDragInit(el);
        o.dragAbort = (el:HTMLElement) => handler.onDragAbort(el);

        if ((handler as GhostProxyingDragHandler).useGhostProxy) {
            o.useGhostProxy  = (handler as GhostProxyingDragHandler).useGhostProxy;
            o.makeGhostProxy  = (handler as GhostProxyingDragHandler).makeGhostProxy;
        }

        if (this.drag == null) {
            this.drag = this.collicat.draggable(this.instance.getContainer(), o);
            this._filtersToAdd.forEach((filterToAdd) => this.drag.addFilter(filterToAdd[0], filterToAdd[1]));

            this.drag.on(EVT_REVERT, (el:HTMLElement) => {
                this.instance.revalidate(el);
            });

        } else {
            this.drag.addSelector(o);
        }

        handler.init(this.drag);
    }

    addFilter(filter:Function|string, exclude?:boolean) {
        if (this.drag == null) {
            this._filtersToAdd.push([filter, exclude === true ]);
        } else {
            this.drag.addFilter(filter, exclude);
        }
    }

    removeFilter(filter:Function|string) {
        if (this.drag != null) {
            this.drag.removeFilter(filter);
        }
    }

    reset():void {

        this.handlers.forEach((handler:DragHandler) => { handler.reset(); });

        if (this.drag != null) {
            this.collicat.destroyDraggable(this.instance.getContainer());
        }

        delete this.drag;
    }

}

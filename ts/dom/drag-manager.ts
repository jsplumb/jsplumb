import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance";
import {BoundingBox, Dictionary, extend, PointArray} from "../core";
import {wrap} from "../util";
import {intersects} from "../geom";

declare const Katavorio:any;

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
export const EVT_MOUSEUP= "mouseup";
export const EVT_REVERT = "revert";

export interface DragHandler {

    selector:string;

    onStart:(params:any) => boolean;
    onDrag:(params:any) => void;
    onStop:(params:any) => void;

    reset:() => void;
    init:(katavorioDraggable:any) => void;

    onBeforeStart?:(beforeStartParams:any) => void;
}

export interface GhostProxyingDragHandler extends DragHandler {
    makeGhostProxy:(el:any) => any;
    useGhostProxy:(container:any, dragEl:any) => boolean;
}

export class DragManager {

    private katavorio:any;
    private katavorioDraggable:any;

    _draggables:Dictionary<any> = {};
    _dlist:Array<any> = [];
    _elementsWithEndpoints:Dictionary<any> = {};
    // elementids mapped to the draggable to which they belong.
    _draggablesForElements:Dictionary<any> = {};

    handlers:Array<DragHandler> = [];

    constructor(protected instance:BrowserJsPlumbInstance) {

        const e = instance.eventManager;

        // create a delegated drag handler
        this.katavorio = new Katavorio({
            bind: e.on,
            unbind: e.off,
            getSize: this.instance.getSize.bind(instance),
            getConstrainingRectangle: (el:HTMLElement) => {
                return [(<any>el.parentNode).scrollWidth, (<any>el.parentNode).scrollHeight];
            },
            getPosition: (el:HTMLElement, relativeToRoot?:boolean):PointArray => {
                // if this is a nested draggable then compute the offset against its own offsetParent, otherwise
                // compute against the Container's origin. see also the getUIPosition method below.
                //var o = _currentInstance.getOffset(el, relativeToRoot, el._katavorioDrag ? el.offsetParent : null);
                //var o = _currentInstance.getOffset(el, relativeToRoot, el._jsPlumbGroup ? el.offsetParent : null);
                let o = this.instance.getOffset(el, relativeToRoot, <any>el.offsetParent);
                //console.log("get position ", el.id, o.left, o.top);
                return [o.left, o.top];
            },
            setPosition: (el:HTMLElement, xy:PointArray):void => {
                el.style.left = xy[0] + "px";
                el.style.top = xy[1] + "px";
            },
            addClass: this.instance.addClass.bind(instance),
            removeClass: this.instance.removeClass.bind(instance),
            intersects: intersects,
            indexOf: (l:Array<any>, i:any):number => {
                return l.indexOf(i);
            },
            scope: this.instance.getDefaultScope(),
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
            zoom: this.instance.getZoom(),
            constrain: (desiredLoc:PointArray, dragEl:HTMLElement, constrainRect:BoundingBox, size:PointArray):PointArray => {
                let x = desiredLoc[0], y = desiredLoc[1];

                if ((<any>dragEl)._jsPlumbGroup && (<any>dragEl)._jsPlumbGroup.constrain) {
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
                return _el.parentNode != null && _el._jsPlumbGroup && _el._jsPlumbGroup.revert ? !_isInsideParent(this.instance, _el, pos) : false;
            }
        });

        //(<any>this._katavorio_main = katavorio;

        this.instance.bind("zoom", (z:number) => {
            this.katavorio.setZoom(z);
        });

        //
        // ------------ drag handler for elements (and elements inside groups). this is added as a selector on the endpoint drag handler below ------------------
        //

        //const elementDragOptions = extend({selector:"> [jtk-managed]"}, this.instance.Defaults.dragOptions || {});
        // const elementDragOptions:any = extend({selector:"> [jtk-managed]"}, {});  // we dont have dragOptions in the defaults for the time being
        //
        // elementDragOptions.start = wrap(elementDragOptions.start, (p:any) => { return this.instance._dragStart(p); });
        // elementDragOptions.drag = wrap(elementDragOptions.drag, (p:any) => { return this.instance._dragMove(p); });
        // elementDragOptions.stop = wrap(elementDragOptions.stop, (p:any) => { return this.instance._dragStop(p); });
        //
        // this.katavorio.draggable(this.instance.getContainer(), elementDragOptions);
    }

    addHandler(handler:DragHandler, dragOptions?:any):void {
        const o = extend({selector:handler.selector}, dragOptions || {});

        this.handlers.push(handler);

        o.start = wrap(o.start, (p:any) => { return handler.onStart(p); });
        o.drag = wrap(o.drag, (p:any) => { return handler.onDrag(p); });
        o.stop = wrap(o.stop, (p:any) => { return handler.onStop(p); });
        o.beforeStart = (handler.onBeforeStart || function(p:any) {}).bind(handler);

        if ((handler as GhostProxyingDragHandler).useGhostProxy) {
            o.useGhostProxy  = (handler as GhostProxyingDragHandler).useGhostProxy;
            o.makeGhostProxy  = (handler as GhostProxyingDragHandler).makeGhostProxy;
        }

        if (this.katavorioDraggable == null) {
            this.katavorioDraggable = this.katavorio.draggable(this.instance.getContainer(), o)[0];
        } else {
            this.katavorioDraggable.addSelector(o);
        }

        handler.init(this.katavorioDraggable);
    }

    reset():void {

        this.handlers.forEach((handler:DragHandler) => { handler.reset(); });

        if (this.katavorioDraggable != null) {
            this.katavorio.destroyDraggable(this.instance.getContainer());
        }
    }

}

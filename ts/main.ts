
import {JsPlumb, JsPlumbInstance} from "./core";
import {JsPlumbDOM} from "./core-dom";
import {RawElement} from "./dom/dom-adapter";
import {ViewAdapter} from "./view-adapter";
import {DomViewAdapter} from "./dom/dom-view-adapter";
import {addToList, each, wrap} from "./util";
import {DragManager} from "./dom/drag-manager";
import {Endpoint} from "./endpoint";
import {Connection} from "./connection";
import {Anchors} from "./anchor/anchors";
import {AnchorManager} from "./anchor/anchor-manager";

export {FlowchartConnector} from "./connector/flowchart-connector";
export {BezierConnector} from "./connector/bezier-connector";
export {StraightConnector} from "./connector/straight-connector";

export {SvgDotEndpoint} from "./renderer/svg/svg-dot-endpoint";
export {SvgFlowchartConnector} from "./renderer/svg/svg-flowchart-connector";

export {LabelOverlay} from "./overlay/label-overlay";
export {ArrowOverlay} from "./overlay/arrow-overlay";
export {DiamondOverlay} from "./overlay/diamond-overlay";
export {PlainArrowOverlay} from "./overlay/plain-arrow-overlay";

export class JsPlumbDOMInstance extends JsPlumbInstance<Event, RawElement> {

    private dragManagers:Map<string, DragManager> = new Map();

    constructor(defaults: any) {
        super(defaults);
        new AnchorManager(this);
    }

    draggableStates:Map<string, Boolean> = new Map();
    getDragManager(category?:string):DragManager {
        category = category || "main";
        if (!this.dragManagers[category]) {
            this.dragManagers[category] = new DragManager(this, category);
        }
        return this.dragManagers[category];
    }

    connectionBeingDragged:Boolean = false;
    setConnectionBeingDragged(value:Boolean) {
        this.connectionBeingDragged = value;
    }

    floatingConnections:Map<string, Connection<Event, RawElement>> = new Map();

    registerFloatingConnection(info:any, conn:Connection<EventTarget,  RawElement>, ep:Endpoint<Event, RawElement>) {
        this.floatingConnections[info.id] = conn;
        // only register for the target endpoint; we will not be dragging the source at any time
        // before this connection is either discarded or made into a permanent connection.
        addToList(this.endpointsByElement, info.id, ep);
    }

    getFloatingConnectionFor(id:string) {
        return this.floatingConnections[id];
    }

    draggingClass:string = "jtk-dragging";
    elementDraggingClass:string = "jtk-element-dragging";
    sourceElementDraggingClass:string = "jtk-source-element-dragging";
    targetElementDraggingClass:string = "jtk-target-element-dragging";
    dragSelectClass = "jtk-drag-select";

    // dragEvents:any = {
    //     'start': 'start', 'stop': 'stop', 'drag': 'drag', 'step': 'step',
    //     'over': 'over', 'out': 'out', 'drop': 'drop', 'complete': 'complete',
    //     'beforeStart':'beforeStart'
    // };

    animEvents:any = {
        'step': "step", 'complete': 'complete'
    };

    getViewAdapter(): ViewAdapter<Event, RawElement> {
        return new DomViewAdapter(this);
    }

    private _initDraggableIfNecessary(element:any, isDraggable:true, dragOptions:any, id:string, fireEvent?:Boolean) {
        let _draggable = isDraggable == null ? false : isDraggable;
        if (_draggable) {
            //if (this.viewAdapter.isDragSupported(element)) {
                let options = dragOptions || this.Defaults.DragOptions;
                options = JsPlumb.extend({}, options); // make a copy.
                if (!this.isAlreadyDraggable(element)) {
                    let dragEvent = "drag",
                        stopEvent = "stop",
                        startEvent = "start",
                        _started = false;

                    this.manage(id, element);

                    options[startEvent] = wrap(options[startEvent],  () => {
                        this.setHoverSuspended(true);
                        this.select({source: element}).addClass(this.elementDraggingClass + " " + this.sourceElementDraggingClass, true);
                        this.select({target: element}).addClass(this.elementDraggingClass + " " + this.targetElementDraggingClass, true);
                        this.setConnectionBeingDragged(true);
                        if (options.canDrag) {
                            return dragOptions.canDrag();
                        }
                    }, false);

                    options[dragEvent] = wrap(options[dragEvent], (dragParams:any) => {
                        // TODO: here we could actually use getDragObject, and then compute it ourselves,
                        // since every adapter does the same thing. but i'm not sure why YUI's getDragObject
                        // differs from getUIPosition so much
                        let ui = this.viewAdapter.getUIPosition(dragParams, this.getZoom());
                        if (ui != null) {
                            this._draw(element, ui, null, true);
                            if (_started) {
                                this.addClass(element, "jtk-dragged");
                            }
                            _started = true;
                        }
                    });
                    options[stopEvent] = wrap(options[stopEvent], (stopParams:any) => {
                        let elements = stopParams.selection, uip;

                        let _one = (_e:any) => {
                            if (_e[1] != null) {
                                // run the reported offset through the code that takes parent containers
                                // into account, to adjust if necessary (issue 554)
                                uip = this.viewAdapter.getUIPosition({
                                    el:_e[2].el,
                                    pos:[_e[1].left, _e[1].top]
                                }, this.getZoom());

                                this._draw(_e[2].el, uip);
                            }
                            this.removeClass(_e[0], "jtk-dragged");
                            this.select({source: _e[2].el}).removeClass(this.elementDraggingClass + " " + this.sourceElementDraggingClass, true);
                            this.select({target: _e[2].el}).removeClass(this.elementDraggingClass + " " + this.targetElementDraggingClass, true);

                            this.getDragManager().dragEnded(_e[2].el);
                        };

                        for (let i = 0; i < elements.length; i++) {
                            _one(elements[i]);
                        }

                        _started = false;
                        this.setHoverSuspended(false);
                        this.setConnectionBeingDragged(false);
                    });
                    let elId = this.getId(element); // need ID
                    this.draggableStates[elId] = true;
                    let draggable = this.draggableStates[elId];
                    options.disabled = draggable == null ? false : !draggable;
                    this.initDraggable(element, options);
                    this.getDragManager().register(element);
                    if (fireEvent) {
                        this.fire("elementDraggable", {el:element, options:options});
                    }
                }
                else {
                    // already draggable. attach any start, drag or stop listeners to the current Drag.
                    if (dragOptions.force) {
                        this.initDraggable(element, options);
                    }
                }
            //}
        }
    }

    destroyDraggable(el:RawElement, category:string) {
        this.getDragManager(category).destroyDraggable(el);
    }

    destroyDroppable(el:RawElement, category:string) {
        this.getDragManager(category).destroyDroppable(el);
    }

    initDraggable(el:RawElement, options:any, category?:string) {
        this.getDragManager(category).draggable(el, options);
    }

    initDroppable(el:RawElement, options:any, category?:string) {
        this.getDragManager(category).droppable(el, options);
    }

    isDragSupported(el:RawElement): Boolean {
        return true;
    }

    isDropSupported(el:RawElement): Boolean {
        return true;
    }

    isAlreadyDraggable(el:RawElement):Boolean {
        return el._katavorioDrag != null;
    }

    draggable(el: RawElement, options?: any) {
        let info;
        each((_el: RawElement) => {
            info = this.elementInfo(_el);
            if (info.el) {
                this._initDraggableIfNecessary(info.el, true, options, info.id, true);
            }
        }, el);
        return this;
    }

    static getDragObject(eventArgs:any) {
        return eventArgs[0].drag.getDragElement();
    }

    static getDragScope(el:RawElement) {
        return el._katavorioDrag && el._katavorioDrag.scopes.join(" ") || "";
    }

    static getDropEvent(args:any) {
        return args[0].e;
    }

    static setDragFilter(el:RawElement, filter:Function, _exclude?:Boolean) {
        if (el._katavorioDrag) {
            el._katavorioDrag.setFilter(filter, _exclude);
        }
    }

    setElementDraggable(el:any, draggable:Boolean) {
        el = this.getElement(el);
        if (el._katavorioDrag) {
            el._katavorioDrag.setEnabled(draggable);
        }
    }

    static setDragScope(el:RawElement, scope:string) {
        if (el._katavorioDrag) {
            el._katavorioDrag.k.setDragScope(el, scope);
        }
    }

    static setDropScope(el:RawElement, scope:string) {
        if (el._katavorioDrop && el._katavorioDrop.length > 0) {
            el._katavorioDrop[0].k.setDropScope(el, scope);
        }
    }

    static stopDrag(el:RawElement) {
        if (el._katavorioDrag) {
            el._katavorioDrag.abort();
        }
    }

    // static _makeConnectionDragHandler(endpoint:Endpoint<any,any>, placeholder:any, _jsPlumb:JsPlumbInstance<any,any>) {
    //     let stopped = false;
    //     return {
    //         drag: function () {
    //             if (stopped) {
    //                 stopped = false;
    //                 return true;
    //             }
    //
    //             if (placeholder.element) {
    //                 let _ui = _jsPlumb.viewAdapter.getUIPosition(arguments, _jsPlumb.getZoom());
    //                 if (_ui != null) {
    //                     _jsPlumb.viewAdapter.setPosition(placeholder.element, _ui);
    //                 }
    //                 _jsPlumb.repaint(placeholder.element, _ui);
    //                 // always repaint the source endpoint, because only continuous/dynamic anchors cause the endpoint
    //                 // to be repainted, so static anchors need to be told (or the endpoint gets dragged around)
    //                 endpoint.paint({anchorPoint:endpoint.anchor.getCurrentLocation({element:endpoint})});
    //             }
    //         },
    //         stopDrag: function () {
    //             stopped = true;
    //         }
    //     };
    // }
    //
    // static _makeDraggablePlaceholder(placeholder:any, _jsPlumb:JsPlumbInstance<any,any>, ipco:any, ips:any) {
    //     let n = _jsPlumb.createElement("div", { position : "absolute" });
    //     _jsPlumb.appendElement(n);
    //     let id = _jsPlumb.getId(n);
    //     _jsPlumb.viewAdapter.setPosition(n, ipco);
    //     n.style.width = ips[0] + "px";
    //     n.style.height = ips[1] + "px";
    //     _jsPlumb.manage(id, n, true); // TRANSIENT MANAGE
    //     // create and assign an id, and initialize the offset.
    //     placeholder.id = id;
    //     placeholder.element = n;
    // }

    _makeFloatingEndpoint<EventType, ElementType>(paintStyle:any, referenceAnchor:any, endpoint:Endpoint<EventType, ElementType>, referenceCanvas:any, sourceElement:any, scope:string) {
        let floatingAnchor = Anchors["FloatingAnchor"]({ reference: referenceAnchor, referenceCanvas: referenceCanvas, jsPlumbInstance: this });
        //setting the scope here should not be the way to fix that mootools issue.  it should be fixed by not
        // adding the floating endpoint as a droppable.  that makes more sense anyway!
        // TRANSIENT MANAGE
        return this._newEndpoint({
            paintStyle: paintStyle,
            endpoint: endpoint,
            anchor: floatingAnchor,
            source: sourceElement,
            scope: scope
        });
    }

    addToDragSelection(spec:any) {
        this.getDragManager().select(spec);
    }

    removeFromDragSelection(spec:any) {
        this.getDragManager().deselect(spec);
    }

    clearDragSelection() {
        this.getDragManager().deselectAll();
    }

    addToPosse(el:any, spec:any) {
        let specs = Array.prototype.slice.call(arguments, 1);
        let dm = this.getDragManager();
        this.each(el, function(_el:any) {
            _el = [ this.getElement(_el) ];
            _el.push.apply(_el, specs );
            dm.addToPosse.apply(dm, _el);
        });
    }

    setPosse(el:any, spec:any) {
        let specs = Array.prototype.slice.call(arguments, 1);
        let dm = this.getDragManager();
        this.each(el, function(_el:any) {
            _el = [ this.getElement(_el) ];
            _el.push.apply(_el, specs );
            dm.setPosse.apply(dm, _el);
        });
    }

    removeFromPosse(el:any, posseId:string) {
        let specs = Array.prototype.slice.call(arguments, 1);
        let dm = this.getDragManager();
        this.each(el, function(_el:any) {
            _el = [ this.getElement(_el) ];
            _el.push.apply(_el, specs );
            dm.removeFromPosse.apply(dm, _el);
        });
    }

    removeFromAllPosses(el:any) {
        let dm = this.getDragManager();
        this.each(el, function(_el:any) { dm.removeFromAllPosses(this.getElement(_el)); });
    }

    setPosseState(el:any, posseId:string, state:Boolean) {
        let dm = this.getDragManager();
        this.each(el, function(_el:any) { dm.setPosseState(this.getElement(_el), posseId, state); });
    }

    getDescendantElements(id:string):any {
        return this.getDragManager().getElementsForDraggable(id);
    }
}

(<any>window).jsPlumb = {

    getInstance : (_defaults:any, overrideFns:any) => {
        let j = new JsPlumbDOMInstance(_defaults);
        if (overrideFns) {
            for (let ovf in overrideFns) {
                j[ovf] = overrideFns[ovf];
            }
        }
        j.init();
        return j;
    },
    ready:(fn:Function) => JsPlumbDOM.ready(fn)

};
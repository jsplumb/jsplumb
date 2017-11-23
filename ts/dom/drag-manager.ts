import {JsPlumbDOMInstance} from "../main";
import {RawElement} from "./dom-adapter";
import {ArrayLocation} from "../jsplumb-defaults";
import {Endpoint} from "../endpoint";
//import {Katavorio} from "katavorio";

declare var Katavorio:any;
declare var Biltong:any;

export type KatavorioInstance = {
    draggable(el:any, options?:any):void,
    droppable(el:any, options?:any):void,
    destroyDraggable(el:any):void,
    destroyDroppable(el:any):void,
    select(el:any):void,
    deselect(el:any):void,
    deselectAll():void,
    addToPosse(el:any, spec:any):any,
    setPosse(el:any, spec:any):any,
    removeFromPosse(el:any, spec:any):any,
    removeFromAllPosses(el:any):any,
    setPosseState(el:any, posseId:string, state:Boolean):any
}

export class DragManager {

    instance:JsPlumbDOMInstance;
    _elementsWithEndpoints:Map<string, number> = new Map();
    _draggables:Map<string, any> = new Map();
    _delements:Map<string, any> = new Map();
    _draggablesForElements:Map<string, any> = new Map();
    _dlist:Array<any> = [];
    delegate:KatavorioInstance;

    constructor(instance:JsPlumbDOMInstance, category?:string) {
        this.instance = instance;

        category = category || "main";
        let key = "_katavorio_" + category;
        let k = instance[key],
            e = instance.getEventManager();

        instance.bind("reset", () => {
            this.reset();
        });

        instance.bind("internal:revalidate", (elId:any) => {
            this.updateOffsets(elId);
        });

        instance.bind("internal:addEndpoint", (params:any) => {
            this.endpointAdded(params.source, params.id);
        });

        if (!k) {
            k = new Katavorio({
                bind: e.on,
                unbind: e.off,
                getSize: (el:any) => instance.getSize(el),
                getConstrainingRectangle:(el:RawElement) => {
                    return [ el.parentNode.scrollWidth, el.parentNode.scrollHeight ];
                },
                getPosition: (el:RawElement, relativeToRoot?:Boolean) => {
                    // if this is a nested draggable then compute the offset against its own offsetParent, otherwise
                    // compute against the Container's origin. see also the getUIPosition method below.
                    let o = instance.getOffset(el, relativeToRoot, el._katavorioDrag ? el.offsetParent : null);
                    return [o.left, o.top];
                },
                setPosition: (el:RawElement, xy:ArrayLocation) => {
                    el.style.left = xy[0] + "px";
                    el.style.top = xy[1] + "px";
                },
                addClass: (el:any, cls:any) => instance.addClass(el, cls),
                removeClass: (el:any, cls:any) => instance.removeClass(el, cls),
                intersects: Biltong.intersects,
                indexOf: (l:Array<any>, i:any) => { return l.indexOf(i); },
                scope:instance.getDefaultScope(),
                css: {
                    noSelect: instance.dragSelectClass,
                    droppable: "jtk-droppable",
                    draggable: "jtk-draggable",
                    drag: "jtk-drag",
                    selected: "jtk-drag-selected",
                    active: "jtk-drag-active",
                    hover: "jtk-drag-hover",
                    ghostProxy:"jtk-ghost-proxy"
                }
            });
            k.setZoom(instance.getZoom());
            instance[key] = k;
            instance.bind("zoom", k.setZoom);
            this.delegate = k;
        }
    }

    endpointAdded(el:any, id:string) {

        id = id || this.instance.getId(el);

        let b = document.body,
            p = el.parentNode;

        this._elementsWithEndpoints[id] = this._elementsWithEndpoints[id] ? this._elementsWithEndpoints[id] + 1 : 1;

        while (p != null && p !== b) {
            let pid = this.instance.getId(p, null, true);
            if (pid && this._draggables[pid]) {
                let pLoc = this.instance.getOffset(p);

                if (this._delements[pid][id] == null) {
                    let cLoc = this.instance.getOffset(el);
                    this._delements[pid][id] = {
                        id: id,
                        offset: {
                            left: cLoc.left - pLoc.left,
                            top: cLoc.top - pLoc.top
                        }
                    };
                    this._draggablesForElements[id] = pid;
                }
                break;
            }
            p = p.parentNode;
        }
    }

    register(el:any) {
        let id = this.instance.getId(el),
            parentOffset = this.instance.getOffset(el);

        if (!this._draggables[id]) {
            this._draggables[id] = el;
            this._dlist.push(el);
            this._delements[id] = {};
        }

        // look for child elements that have endpoints and register them against this draggable.
        let _oneLevel = (p:any) => {
            if (p) {
                for (let i = 0; i < p.childNodes.length; i++) {
                    if (p.childNodes[i].nodeType !== 3 && p.childNodes[i].nodeType !== 8) {
                        let cEl = this.instance.getElement(p.childNodes[i]),
                            cid = this.instance.getId(p.childNodes[i], null, true);
                        if (cid && this._elementsWithEndpoints[cid] && this._elementsWithEndpoints[cid] > 0) {
                            let cOff = this.instance.getOffset(cEl);
                            this._delements[id][cid] = {
                                id: cid,
                                offset: {
                                    left: cOff.left - parentOffset.left,
                                    top: cOff.top - parentOffset.top
                                }
                            };
                            this._draggablesForElements[cid] = id;
                        }
                        _oneLevel(p.childNodes[i]);
                    }
                }
            }
        };

        _oneLevel(el);
    }

    updateOffsets(elId:string, childOffsetOverrides?:any) {
        if (elId != null) {
            childOffsetOverrides = childOffsetOverrides || {};
            let domEl = this.instance.getElement(elId),
                id = this.instance.getId(domEl),
                children = this._delements[id],
                parentOffset = this.instance.getOffset(domEl);

            if (children) {
                for (let i in children) {
                    if (children.hasOwnProperty(i)) {
                        let cel = this.instance.getElement(i),
                            cOff = childOffsetOverrides[i] || this.instance.getOffset(cel);

                        // do not update if we have a value already and we'd just be writing 0,0
                        if (cel.offsetParent == null && this._delements[id][i] != null) {
                            continue;
                        }

                        this._delements[id][i] = {
                            id: i,
                            offset: {
                                left: cOff.left - parentOffset.left,
                                top: cOff.top - parentOffset.top
                            }
                        };
                        this._draggablesForElements[i] = id;
                    }
                }
            }
        }
    }

    endpointDeleted(endpoint:Endpoint<any,any>) {
        if (this._elementsWithEndpoints[endpoint.elementId]) {
            this._elementsWithEndpoints[endpoint.elementId]--;
            if (this._elementsWithEndpoints[endpoint.elementId] <= 0) {
                for (let i in this._delements) {
                    if (this._delements.hasOwnProperty(i) && this._delements[i]) {
                        delete this._delements[i][endpoint.elementId];
                        delete this._draggablesForElements[endpoint.elementId];
                    }
                }
            }
        }
    }

    changeId(oldId:string, newId:string) {
        this._delements[newId] = this._delements[oldId];
        this._delements[oldId] = {};
        this._draggablesForElements[newId] = this._draggablesForElements[oldId];
        this._draggablesForElements[oldId] = null;
    }

    getElementsForDraggable(id:string) {
        return this._delements[id];
    }

    elementRemoved(elementId:string) {
        let elId = this._draggablesForElements[elementId];
        if (elId) {
            delete this._delements[elId][elementId];
            delete this._draggablesForElements[elementId];
        }
    }

    reset() {
        this._draggables.clear();
        this._dlist.length = 0;
        this._delements.clear();
        this._elementsWithEndpoints.clear();
    }

    dragEnded(el:any) {
        if (el.offsetParent != null) {
            let id = this.instance.getId(el),
                ancestor = this._draggablesForElements[id];

            if (ancestor) {
                this.updateOffsets(ancestor);
            }
        }
    }

    setParent(el:any, elId:string, p:any, pId:string, currentChildLocation?:any) {
        let current = this._draggablesForElements[elId];
        if (!this._delements[pId]) {
            this._delements[pId] = {};
        }
        let pLoc = this.instance.getOffset(p),
            cLoc = currentChildLocation || this.instance.getOffset(el);

        if (current && this._delements[current]) {
            delete this._delements[current][elId];
        }

        this._delements[pId][elId] = {
            id:elId,
            offset : {
                left: cLoc.left - pLoc.left,
                top: cLoc.top - pLoc.top
            }
        };
        this._draggablesForElements[elId] = pId;
    }

    clearParent(el:any, elId:string) {
        let current = this._draggablesForElements[elId];
        if (current) {
            delete this._delements[current][elId];
            delete this._draggablesForElements[elId];
        }
    }

    revalidateParent(el:any, elId:string, childOffset?:any) {
        let current = this._draggablesForElements[elId];
        if (current) {
            let co = {};
            co[elId] = childOffset;
            this.updateOffsets(current, co);
            this.instance.revalidate(current);
        }
    }

    getDragAncestor(el:any) {
        let de = this.instance.getElement(el),
            id = this.instance.getId(de),
            aid = this._draggablesForElements[id];

        if (aid) {
            return this.instance.getElement(aid);
        }
        else {
            return null;
        }
    }

    draggable(el:any, options?:any) {
        this.delegate.draggable(el, options);
    }

    droppable(el:any, options?:any) {
        this.delegate.droppable(el, options);
    }

    destroyDroppable(el:any): void { this.delegate.destroyDroppable(el); }
    destroyDraggable(el:any): void { this.delegate.destroyDraggable(el); }
    select(el:any) { this.delegate.select(el); }
    deselect(el:any) { this.delegate.deselect(el); }
    deselectAll() { this.delegate.deselectAll(); }
    addToPosse(el:any, spec:any):any { return this.delegate.addToPosse(el, spec); }
    setPosse(el:any, spec:any):any { return this.delegate.setPosse(el, spec); }
    removeFromPosse(el:any, spec:any):any { return this.delegate.removeFromPosse(el, spec); }
    removeFromAllPosses(el:any):any { return this.delegate.removeFromAllPosses(el); }
    setPosseState(el:any, posseId:string, state:Boolean):any { return this.delegate.setPosseState(el, posseId, state); }

}
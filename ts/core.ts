

import {jsPlumbDefaults} from "./defaults";
import {ComponentParameters} from "./component/component";
import {PaintStyle} from "./styles";
import {Connection} from "./connector/connection-impl";
import {Endpoint} from "./endpoint/endpoint-impl";
import {FullOverlaySpec, Overlay, OverlayId, OverlaySpec} from "./overlay";
import {AnchorManager} from "./anchor-manager";
import {
    _mergeOverrides,
    addToList,
    findWithFunction,
    functionChain,
    isArray,
    IS,
    isString,
    log,
    removeWithFunction,
    uuid
} from "./util";
import { EventGenerator } from "./event-generator";
import * as Constants from "./constants";
import {Renderer} from "./renderer";
import {AnchorSpec, makeAnchorFromSpec} from "./factory/anchor-factory";
import { Anchor } from "./anchor/anchor";
import {DynamicAnchor} from "./anchor/dynamic-anchor";
import {EndpointOptions, EndpointSpec} from "./endpoint";
import {ConnectorSpec} from "./connector";

declare const jsPlumb:any;

export interface TypeDescriptor {
    cssClass?:string;
    paintStyle?:PaintStyle;
    hoverPaintStyle?:PaintStyle;
    parameters?:any;
    overlays?:Array<OverlaySpec>;
    overlayMap?:Dictionary<FullOverlaySpec>;
    endpoints?:[ EndpointSpec, EndpointSpec ];
    endpoint?:EndpointSpec;
    anchors?:[AnchorSpec, AnchorSpec];
    anchor?:AnchorSpec;
    detachable?:boolean;
    reattach?:boolean;
    scope?:string;
    connector?:ConnectorSpec;
}


export interface DeleteOptions<E> {
    connection?:Connection<E>;
    endpoint?:Endpoint<E>;
    dontUpdateHover?:boolean;
    deleteAttachedObjects?:boolean;
    originalEvent?:Event;
    fireEvent?:boolean;
}

export interface DeleteResult<E> {
    endpoints:Dictionary<Endpoint<E>>;
    connections:Dictionary<Connection<E>>;
    endpointCount:number;
    connectionCount:number;
}

export interface Offset {left:number, top:number}
export type Size = [ number, number ]
export interface OffsetAndSize { o:Offset, s:Size }
export type PointArray = [ number, number ]
export type PointXY = { x:number, y:number, theta?:number }
export type BoundingBox = { x:number, y:number, w:number, h:number }

export interface ExtendedOffset {
    left:number;
    top:number;
    width?:number;
    height?:number;
    centerx?:number;
    centery?:number;
    bottom?:number;
    right?:number;
}

export interface Dictionary<T> {
    [Key: string]: T;
}

export type ElementSpec<E> = string | E | Array<string | E>;

export type SortFunction = (a:any,b:any) => number;

export type Constructable<T> = { new(...args: any[]): T };

export type Timestamp = string;

function _scopeMatch<E>(e1:Endpoint<E>, e2:Endpoint<E>):boolean {
    let s1 = e1.scope.split(/\s/), s2 = e2.scope.split(/\s/);
    for (let i = 0; i < s1.length; i++) {
        for (let j = 0; j < s2.length; j++) {
            if (s2[j] === s1[i]) {
                return true;
            }
        }
    }

    return false;
}

interface AbstractSelection<T, E> {
    length:number;
    each:( handler:(arg0:T) => void ) => void;
    get(index:number):T;

    getLabel:() => string;
    getOverlay:(id:string) => Overlay<E>;
    isHover:() => boolean;
    getParameter:(key:string) => any;
    getParameters:() => ComponentParameters;
    getPaintStyle:() => PaintStyle;
    getHoverPaintStyle:() => PaintStyle;
    isVisible:() => boolean;
    hasType:(id:string) => boolean;
    getType:() => any;
    isSuspendEvents:() => boolean;

    "delete": () => void;
}

export interface AbstractSelectOptions<E> {
    scope?:string;
    source?:string | E | Array<string | E>;
    target?:string | E | Array<string | E>;
}
export interface SelectOptions<E> extends AbstractSelectOptions<E> {
    connections?:Array<Connection<E>>;
}

export interface SelectEndpointOptions<E> extends AbstractSelectOptions<E> {
    element?:string | E | Array<string | E>;
}

export interface ConnectionSelection<E> extends AbstractSelection<Connection<E>, E> {

    setDetachable: (d:boolean) => void;
    setReattach: (d:boolean) => void;
    setConnector: (d:ConnectorSpec) => void;

    isDetachable:() => any;
    isReattach: () => any;

}

export interface EndpointSelection<E> extends AbstractSelection<Endpoint<E>, E> {
    setEnabled:(e:boolean) => void;

    setAnchor:(a:AnchorSpec) => void;
    isEnabled:() => any[];
    deleteEveryConnection:() => void;

}

function _setOperation (list:Array<any>, func:string, args?:any, selector?:any):any {
    for (let i = 0, j = list.length; i < j; i++) {
        list[i][func].apply(list[i], args);
    }
    return selector(list);
}

function  _getOperation (list:Array<any>, func:string, args?:any):Array<any> {
    let out = [];
    for (let i = 0, j = list.length; i < j; i++) {
        out.push([ list[i][func].apply(list[i], args), list[i] ]);
    }
    return out;
}

function setter (list:Array<any>, func:string, selector:any) {
    return function () {
        return _setOperation(list, func, arguments, selector);
    };
}

function getter (list:Array<any>, func:string) {
    return function () {
        return _getOperation(list, func, arguments);
    };
}

function prepareList<E>(instance:jsPlumbInstance<E>, input:any, doNotGetIds?:boolean):any {
    let r = [];
    if (input) {
        if (typeof input === 'string') {
            if (input === "*") {
                return input;
            }
            r.push(input);
        }
        else {
            if (doNotGetIds) {
                r = input;
            }
            else {
                if (input.length) {
                    for (let i = 0, j = input.length; i < j; i++) {
                        r.push(instance._info(input[i]).id);
                    }
                }
                else {
                    r.push(instance._info(input).id);
                }
            }
        }
    }
    return r;
}

function filterList (list:Array<any> | string, value:any, missingIsFalse?:boolean):boolean {
    if (list === "*") {
        return true;
    }
    return (<any>list).length > 0 ? (<any>list).indexOf(value) !== -1 : !missingIsFalse;
}

/**
 * creates a timestamp, using milliseconds since 1970, but as a string.
 */
export function  _timestamp ():Timestamp {
    return "" + (new Date()).getTime();
}

export function extend<T>(o1:T, o2:T, keys?:string[]):T {
    let i;
    let _o1 = o1 as any,
        _o2 = o2 as any;

    if (keys) {
        for (i = 0; i < keys.length; i++) {
            _o1[keys[i]] = _o2[keys[i]];
        }
    }
    else {
        for (i in _o2) {
            _o1[i] = _o2[i];
        }
    }

    return o1;
}

function _curryEach (list:any[], executor:(l:any[]) => void) {
    return function (f:Function) {
        for (let i = 0, ii = list.length; i < ii; i++) {
            f(list[i]);
        }
        return executor(list);
    };
}
function _curryGet<T>(list:Array<T>) {
    return function (idx:number):T {
        return list[idx];
    }
}


const events = ["tap", "dbltap", "click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu" ];

type ContainerDelegation = [ string, Function ];
type ManagedElement<E> = {
    el:E,
    info?:{o:Offset, s:Size},
    endpoints?:Array<Endpoint<E>>,
    connections?:Array<Connection<E>>
};

export abstract class jsPlumbInstance<E> extends EventGenerator {

    Defaults:jsPlumbDefaults;
    private _initialDefaults:jsPlumbDefaults = {};

    isConnectionBeingDragged:boolean = false;
    currentlyDragging:boolean = false;
    hoverSuspended:boolean = false;
    _suspendDrawing:boolean = false;
    _suspendedAt:string = null;

    targetEndpointDefinitions:Dictionary<any>= {};
    sourceEndpointDefinitions:Dictionary<any> = {};

    connectorClass = "jtk-connector";
    connectorOutlineClass = "jtk-connector-outline";
    connectedClass = "jtk-connected";
    hoverClass = "jtk-hover";
    endpointClass = "jtk-endpoint";
    endpointConnectedClass = "jtk-endpoint-connected";
    endpointFullClass = "jtk-endpoint-full";
    endpointDropAllowedClass = "jtk-endpoint-drop-allowed";
    endpointDropForbiddenClass = "jtk-endpoint-drop-forbidden";
    overlayClass = "jtk-overlay";
    draggingClass = "jtk-dragging";
    elementDraggingClass = "jtk-element-dragging";
    sourceElementDraggingClass = "jtk-source-element-dragging";
    endpointAnchorClassPrefix = "jtk-endpoint-anchor";
    targetElementDraggingClass = "jtk-target-element-dragging";
    hoverSourceClass = "jtk-source-hover";
    hoverTargetClass = "jtk-target-hover";
    dragSelectClass = "jtk-drag-select";

    Anchors = {};
    Connectors = {  "svg": {} };
    Endpoints = { "svg": {} };
    Overlays = { "svg": {} } ;
    ConnectorRenderers = {};
    SVG = "svg";
    connections:Array<Connection<E>> = [];
    endpointsByElement:Dictionary<Array<Endpoint<E>>> = {};
    endpointsByUUID:Dictionary<Endpoint<E>> = {};

    private _curIdStamp :number = 1;
    private _offsetTimestamps:Dictionary<string> = {};
    private _offsets:Dictionary<ExtendedOffset> = {};
    private _sizes:Dictionary<Size> = {};

    anchorManager:AnchorManager<E>;
    _connectionTypes:Dictionary<TypeDescriptor> = {};
    _endpointTypes:Dictionary<TypeDescriptor> = {};
    _container:E;
    _containerDelegations:ContainerDelegation[] = [];
    _managedElements:Dictionary<ManagedElement<E>> = {};
    _floatingConnections:Dictionary<Connection<E>> = {};

    DEFAULT_SCOPE:string;

    _zoom:number = 1;

    abstract getElement(el:E|string):E;
    abstract removeElement(el:E|string):void;
    abstract appendElement (el:E, parent?:E):void;
    abstract appendToRoot(node:E):void;

    abstract removeClass(el:E, clazz:string):void;
    abstract addClass(el:E, clazz:string):void;
    abstract toggleClass(el:E, clazz:string):void;
    abstract getClass(el:E):string;
    abstract hasClass(el:E, clazz:string):boolean;

    abstract setAttribute(el:E, name:string, value:string):void;
    abstract getAttribute(el:E, name:string):string;
    abstract setAttributes(el:E, atts:Dictionary<string>):void
    abstract removeAttribute(el:E, attName:string):void;

    abstract getSelector(ctx:string | E, spec?:string):NodeListOf<any>;
    abstract getStyle(el:E, prop:string):any;

    abstract getSize(el:E|string):Size;
    abstract getOffset(el:E|string, relativeToRoot?:boolean, container?:E):Offset;

    abstract on (el:E, event:string, selector:Function | string, callback?:Function):void;
    abstract off (el:E, event:string, callback:Function):void;

    abstract createElement(tag:string, style?:Dictionary<any>, clazz?:string, atts?:Dictionary<string | number>):E;
    abstract createElementNS(ns:string, tag:string, style?:Dictionary<any>, clazz?:string, atts?:Dictionary<string | number>):E;

    constructor(protected _instanceIndex:number, public renderer:Renderer<E>, defaults?:jsPlumbDefaults) {

        super();

        this.Defaults = {
            anchor: "Bottom",
            anchors: [ null, null ],
            connectionsDetachable: true,
            connectionOverlays: [ ],
            connector: "Bezier",
            container: null,
            //dragOptions: { },
            //dropOptions: { },
            endpoint: "Dot",
            endpointOverlays: [ ],
            endpoints: [ null, null ],
            endpointStyle: { fill: "#456" },
            endpointStyles: [ null, null ],
            endpointHoverStyle: null,
            endpointHoverStyles: [ null, null ],
            hoverPaintStyle: null,
            labelStyle: { color: "black" },
            overlays: [ ],
            maxConnections: 1,
            paintStyle: { strokeWidth: 4, stroke: "#456" },
            reattachConnections: false,
            scope: "jsPlumb_DefaultScope"
        };

        if (defaults) {
            extend(this.Defaults, defaults);
        }

        extend(this._initialDefaults, this.Defaults);
        this.DEFAULT_SCOPE = this.Defaults.scope;

        this.anchorManager = new AnchorManager(this);
    }

    getContainer():E { return this._container; }

    setZoom (z:number, repaintEverything?:boolean):boolean {
        this._zoom = z;
        this.fire("zoom", this._zoom);
        if (repaintEverything) {
            this.repaintEverything();
        }
        return true;
    }

    getZoom ():number {
        return this._zoom;
    }

    _info (el:string | E):{el:E, text?:boolean, id?:string} {
        if (el == null) {
            return null;
        }
        else if ((<any>el).nodeType === 3 || (<any>el).nodeType === 8) {
            return { el:el as E, text:true };
        }
        else {
            let _el = this.getElement(el);
            return { el: _el, id: (isString(el) && _el == null) ? el as string : this.getId(_el) };
        }
    }

    _idstamp ():string {
        return "" + this._curIdStamp++;
    }

    convertToFullOverlaySpec(spec:string | OverlaySpec):FullOverlaySpec {
        let o:FullOverlaySpec = null;
        if (isString(spec)) {
            o = [ spec as OverlayId, { } ];
        } else {
            o = spec as FullOverlaySpec;
        }
        o[1].id = o[1].id || uuid();
        return o;
    }

    checkCondition(conditionName:string, args?:any):boolean {
        let l = this.getListener(conditionName),
            r = true;

        if (l && l.length > 0) {
            let values = Array.prototype.slice.call(arguments, 1);
            try {
                for (let i = 0, j = l.length; i < j; i++) {
                    r = r && l[i].apply(l[i], values);
                }
            }
            catch (e) {
                log("cannot check condition [" + conditionName + "]" + e);
            }
        }
        return r;
    }

    getId (element:string | E, uuid?:string, doNotCreateIfNotFound?:boolean):string {
        if (isString(element)) {
            return element as string;
        }
        if (element == null) {
            return null;
        }
        let id:string = this.getAttribute(element as E, "id");
        if (!id || id === "undefined") {
            // check if fixed uuid parameter is given
            if (arguments.length === 2 && arguments[1] !== undefined) {
                id = uuid;
            }
            else if (arguments.length === 1 || (arguments.length === 3 && !arguments[2])) {
                id = "jsPlumb_" + this._instanceIndex + "_" + this._idstamp();
            }

            if (!doNotCreateIfNotFound) {
                this.setAttribute(element as E, "id", id);
            }
        }
        return id;
    }

    setId (el:string | E, newId:string, doNotSetAttribute?:boolean):void {
        //
        let id:string, _el:E;

        if (isString(el)) {
            id = el as string;
        }
        else {
            _el = this.getElement(el);
            id = this.getId(_el);
        }

        let sConns = this.getConnections({source: id, scope: '*'}, true),
            tConns = this.getConnections({target: id, scope: '*'}, true);

        newId = "" + newId;

        if (!doNotSetAttribute) {
            _el = this.getElement(id);
            this.setAttribute(_el, "id", newId);
        }
        else {
            _el = this.getElement(newId);
        }

        this.endpointsByElement[newId] = this.endpointsByElement[id] || [];
        for (let i = 0, ii = this.endpointsByElement[newId].length; i < ii; i++) {
            this.endpointsByElement[newId][i].setElementId(newId);
            this.endpointsByElement[newId][i].setReferenceElement(_el);
        }
        delete this.endpointsByElement[id];
        this._managedElements[newId] = this._managedElements[id];
        delete this._managedElements[id];

        let _conns = (list:any, epIdx:number, type:string) => {
            for (let i = 0, ii = list.length; i < ii; i++) {
                list[i].endpoints[epIdx].setElementId(newId);
                list[i].endpoints[epIdx].setReferenceElement(_el);
                list[i][type + "Id"] = newId;
                list[i][type] = _el;
            }
        };
        _conns(sConns, 0, "source");
        _conns(tConns, 1, "target");

        this.repaint(newId);
    }

    setIdChanged(oldId:string, newId:string) {
        this.setId(oldId, newId, true);
    }

    getCachedData(elId:string):{o:Offset, s:Size} {
        let o = this._offsets[elId];
        if (!o) {
            return this.updateOffset({elId: elId});
        }
        else {
            return {o: o, s: this._sizes[elId]};
        }
    }

    unbindContainer ():void  {
        if (this._container != null && this._containerDelegations.length > 0) {
            for (let i = 0; i < this._containerDelegations.length; i++) {
                this.off(this._container, this._containerDelegations[i][0], this._containerDelegations[i][1]);
            }
        }
    }

// ------------------  element selection ------------------------

    getConnections(options?:SelectOptions<E>, flat?:boolean):Dictionary<Connection<E>> | Array<Connection<E>> {
        if (!options) {
            options = {};
        } else if (options.constructor === String) {
            options = { "scope": options } as SelectOptions<E>;
        }
        let scope = options.scope || this.getDefaultScope(),
            scopes = prepareList(this, scope, true),
            sources = prepareList(this, options.source),
            targets = prepareList(this, options.target),
            results = (!flat && scopes.length > 1) ? {} : [],
            _addOne = (scope:string, obj:any) => {
                if (!flat && scopes.length > 1) {
                    let ss = results[scope];
                    if (ss == null) {
                        ss = results[scope] = [];
                    }
                    ss.push(obj);
                } else {
                    (<Array<any>>results).push(obj);
                }
            };

        for (let j = 0, jj = this.connections.length; j < jj; j++) {
            let c = this.connections[j],
                sourceId = c.proxies && c.proxies[0] ? c.proxies[0].originalEp.elementId : c.sourceId,
                targetId = c.proxies && c.proxies[1] ? c.proxies[1].originalEp.elementId : c.targetId;

            if (filterList(scopes, c.scope) && filterList(sources, sourceId) && filterList(targets, targetId)) {
                _addOne(c.scope, c);
            }
        }

        return results;
    }

    private _makeCommonSelectHandler<T> (list:any[], executor:(l:any[]) => void):AbstractSelection<T, E> {
        let out = {
            length: list.length,
            each: _curryEach(list, executor),
            get: _curryGet(list)
        },
        setters = ["setHover", "removeAllOverlays", "setLabel", "addClass", "addOverlay", "removeOverlay",
            "removeOverlays", "showOverlay", "hideOverlay", "showOverlays", "hideOverlays", "setPaintStyle",
            "setHoverPaintStyle", "setSuspendEvents", "setParameter", "setParameters", "setVisible",
            "repaint", "addType", "toggleType", "removeType", "removeClass", "setType", "bind", "unbind" ],

        getters = ["getLabel", "getOverlay", "isHover", "getParameter", "getParameters", "getPaintStyle",
            "getHoverPaintStyle", "isVisible", "hasType", "getType", "isSuspendEvents" ],
        i, ii;

        for (i = 0, ii = setters.length; i < ii; i++) {
            out[setters[i]] = setter(list, setters[i], executor);
        }

        for (i = 0, ii = getters.length; i < ii; i++) {
            out[getters[i]] = getter(list, getters[i]);
        }

        return out as AbstractSelection<T, E>;
    }

    private _makeConnectionSelectHandler (list:Connection<E>[]):ConnectionSelection<E> {
        let common = this._makeCommonSelectHandler<Connection<E>>(list, this._makeConnectionSelectHandler.bind(this))  as ConnectionSelection<E>;

        let connectionFunctions:any = {
            // setters
            setDetachable: setter(list, "setDetachable", this._makeConnectionSelectHandler.bind(this)),
            setReattach: setter(list, "setReattach", this._makeConnectionSelectHandler.bind(this)),
            setConnector: setter(list, "setConnector", this._makeConnectionSelectHandler.bind(this)),
            delete: () => {
                for (let i = 0, ii = list.length; i < ii; i++) {
                    this.deleteConnection(list[i]);
                }
            },
            // getters
            isDetachable: getter(list, "isDetachable"),
            isReattach: getter(list, "isReattach")
        };

        let merge = extend(common, connectionFunctions);

        return merge;
    }

    private _makeEndpointSelectHandler (list:Array<Endpoint<E>>):EndpointSelection<E> {
        let common = this._makeCommonSelectHandler(list, this._makeEndpointSelectHandler.bind(this)) as EndpointSelection<E>;
        let endpointFunctions:any = {
            setEnabled: setter(list, "setEnabled", this._makeEndpointSelectHandler.bind(this)),
            setAnchor: setter(list, "setAnchor", this._makeEndpointSelectHandler.bind(this)),
            isEnabled: getter(list, "isEnabled"),
            deleteEveryConnection: () => {
                for (let i = 0, ii = list.length; i < ii; i++) {
                    list[i].deleteEveryConnection();
                }
            },
            "delete": () => {
                for (let i = 0, ii = list.length; i < ii; i++) {
                    this.deleteEndpoint(list[i]);
                }
            }
        };
        let merge = extend(common, endpointFunctions);
        return merge;
    }

    select (params?:SelectOptions<E>):ConnectionSelection<E> {
        params = params || {};
        params.scope = params.scope || "*";
        return this._makeConnectionSelectHandler(params.connections || (this.getConnections(params, true) as Array<Connection<E>>));
    }

    selectEndpoints(params?:SelectEndpointOptions<E>):EndpointSelection<E> {
        params = params || {};
        params.scope = params.scope || "*";

        let noElementFilters = !params.element && !params.source && !params.target,
            elements = noElementFilters ? "*" : prepareList(this, params.element),
            sources = noElementFilters ? "*" : prepareList(this, params.source),
            targets = noElementFilters ? "*" : prepareList(this, params.target),
            scopes = prepareList(this, params.scope, true);

        let ep:Array<Endpoint<E>> = [];

        for (let el in this.endpointsByElement) {
            let either = filterList(elements, el, true),
                source = filterList(sources, el, true),
                sourceMatchExact = sources !== "*",
                target = filterList(targets, el, true),
                targetMatchExact = targets !== "*";

            // if they requested 'either' then just match scope. otherwise if they requested 'source' (not as a wildcard) then we have to match only endpoints that have isSource set to to true, and the same thing with isTarget.
            if (either || source || target) {
                inner:
                    for (let i = 0, ii = this.endpointsByElement[el].length; i < ii; i++) {
                        let _ep = this.endpointsByElement[el][i];
                        if (filterList(scopes, _ep.scope, true)) {

                            let noMatchSource = (sourceMatchExact && sources.length > 0 && !_ep.isSource),
                                noMatchTarget = (targetMatchExact && targets.length > 0 && !_ep.isTarget);

                            if (noMatchSource || noMatchTarget) {
                                continue inner;
                            }

                            ep.push(_ep);
                        }
                    }
            }
        }

        return this._makeEndpointSelectHandler(ep);

        //return null//this._makeEndpointSelectHandler(params.connections || this.getConnections(params, true));
    }



    setContainer(c:E|string):void {

        this.unbindContainer();

        // get container as dom element.
        let _c = this.getElement(c);
        // move existing connections and endpoints, if any.
        this.select().each((conn:Connection<E>) => {
            conn.moveParent(_c);
        });
        this.selectEndpoints().each((ep:Endpoint<E>) => {
            ep.moveParent(_c);
        });

        // set container.
        let previousContainer = this._container;
        this._container = _c;
        this._containerDelegations.length = 0;
        const eventAliases = {
            "endpointclick":"endpointClick",
            "endpointdblclick":"endpointDblClick"
        };

        const _oneDelegateHandler = (id:string, e:Event, componentType?:string) => {
            let t:any = e.srcElement || e.target,
                jp = (t && t.parentNode ? t.parentNode._jsPlumb : null) || (t ? t._jsPlumb : null) || (t && t.parentNode && t.parentNode.parentNode ? t.parentNode.parentNode._jsPlumb : null);
            if (jp) {
                jp.fire(id, jp, e);
                let alias = componentType ? eventAliases[componentType + id] || id : id;
                // jsplumb also fires every event coming from components/overlays. That's what the test for `jp.component` is for.
                this.fire(alias, jp.component || jp, e);
            }
        };

        const _addOneDelegate = (eventId:string, selector:string, fn:Function) => {
            this._containerDelegations.push([eventId, fn]);
            this.on(this._container, eventId, selector, fn);
        };

        // delegate one event on the container to jsplumb elements. it might be possible to
        // abstract this out: each of endpoint, connection and overlay could register themselves with
        // jsplumb as "component types" or whatever, and provide a suitable selector. this would be
        // done by the renderer (although admittedly from 2.0 onwards we're not supporting vml anymore)
        const _oneDelegate = (id:string) => {
            // connections.
            _addOneDelegate(id, Constants.SELECTOR_CONNECTOR, (e:Event) => {
                _oneDelegateHandler(id, e);
            });
            // endpoints. note they can have an enclosing div, or not.
            _addOneDelegate(id, Constants.SELECTOR_ENDPOINT, (e:Event) => {
                _oneDelegateHandler(id, e, "endpoint");
            });
            // overlays
            _addOneDelegate(id, Constants.SELECTOR_OVERLAY, (e:Event) => {
                _oneDelegateHandler(id, e);
            });
        };

        for (let i = 0; i < events.length; i++) {
            _oneDelegate(events[i]);
        }

        // managed elements
        for (let elId in this._managedElements) {
            let el = this._managedElements[elId].el;
            if ((<any>el).parentNode === previousContainer) {
                (<any>previousContainer).removeChild(el);
                (<any>this._container).appendChild(el);
            }
        }

        this.setAttribute(this._container, Constants.ATTRIBUTE_CONTAINER, uuid().replace("-", ""));

        this.fire(Constants.EVENT_CONTAINER_CHANGE, this._container);

    }

    isHoverSuspended() { return this.hoverSuspended; }

    setSuspendDrawing (val?:boolean, repaintAfterwards?:boolean) {
        let curVal = this._suspendDrawing;
        this._suspendDrawing = val;
        if (val) {
            this._suspendedAt = "" + new Date().getTime();
        } else {
            this._suspendedAt = null;
        }
        if (repaintAfterwards) {
            this.repaintEverything();
        }
        return curVal;
    }

    // returns whether or not drawing is currently suspended.
    isSuspendDrawing ():boolean {
        return this._suspendDrawing;
    }

    // return time for when drawing was suspended.
    getSuspendedAt ():string {
        return this._suspendedAt;
    }

    batch (fn:Function, doNotRepaintAfterwards?:boolean):void {
        const _wasSuspended = this.isSuspendDrawing();
        if (!_wasSuspended) {
            this.setSuspendDrawing(true);
        }
        try {
            fn();
        }
        catch (e) {
            log("Function run while suspended failed", e);
        }
        if (!_wasSuspended) {
            this.setSuspendDrawing(false, !doNotRepaintAfterwards);
        }
    }

    getDefaultScope ():string {
        return this.DEFAULT_SCOPE;
    }

    each(spec:ElementSpec<E>, fn:(e:E) => any) {
        if (spec == null) {
            return;
        }
        if (typeof spec === "string") {
            fn(this.getElement(spec));
        }
        else if ((<any>spec).length != null) {
            for (let i = 0; i < (<Array<any>>spec).length; i++) {
                fn(this.getElement(spec[i]));
            }
        }
        else {
            fn(spec as E);
        } // assume it's an element.
    }



    updateOffset(params?:{
        timestamp?:string,
        recalc?:boolean,
        offset?:Offset,
        elId?:string
    }):{o:ExtendedOffset, s:Size} {

        let timestamp = params.timestamp, recalc = params.recalc, offset = params.offset, elId = params.elId, s;
        if (this._suspendDrawing && !timestamp) {
            timestamp = this._suspendedAt;
        }
        if (!recalc) {
            if (timestamp && timestamp === this._offsetTimestamps[elId]) {
                return {o: params.offset || this._offsets[elId], s: this._sizes[elId]};
            }
        }
        if (recalc || (!offset && this._offsets[elId] == null)) { // if forced repaint or no offset available, we recalculate.

            // get the current size and offset, and store them
            s = this._managedElements[elId] ? this._managedElements[elId].el : null;
            if (s != null) {
                this._sizes[elId] = this.getSize(s);
                this._offsets[elId] = this.getOffset(s);
                this._offsetTimestamps[elId] = timestamp;
            }
        } else {
            this._offsets[elId] = offset || this._offsets[elId];
            if (this._sizes[elId] == null) {
                s = this._managedElements[elId].el;
                if (s != null) {
                    this._sizes[elId] = this.getSize(s);
                }
            }
            this._offsetTimestamps[elId] = timestamp;
        }

        if (this._offsets[elId] && !this._offsets[elId].right) {
            this._offsets[elId].right = this._offsets[elId].left + this._sizes[elId][0];
            this._offsets[elId].bottom = this._offsets[elId].top + this._sizes[elId][1];
            this._offsets[elId].width = this._sizes[elId][0];
            this._offsets[elId].height = this._sizes[elId][1];
            this._offsets[elId].centerx = this._offsets[elId].left + (this._offsets[elId].width / 2);
            this._offsets[elId].centery = this._offsets[elId].top + (this._offsets[elId].height / 2);
        }

        return {o: this._offsets[elId], s: this._sizes[elId]};
    }

    // _draw(element:string | E, ui?:any, timestamp?:Timestamp) {
    //
    //     if (!this._suspendDrawing) {
    //         let id = this.getId(element),
    //             repaintEls:Array<E> = [],
    //             repaintOffsets:Array<Offset> = [];//,
    //             //dm = _currentInstance.getDragManager();
    //
    //         // if (dm) {
    //         //     repaintEls = dm.getElementsForDraggable(element);
    //         // }
    //
    //         if (timestamp == null) {
    //             timestamp = _timestamp();
    //         }
    //
    //         // update the offset of everything _before_ we try to draw anything.
    //         this.updateOffset({ elId: id, offset: ui, recalc: false, timestamp: timestamp });
    //         for (let i = 0; i < repaintEls.length; i++) {
    //             repaintOffsets.push(this.updateOffset({ elId: this.getId(repaintEls[i]), recalc: true, timestamp: timestamp }).o);
    //         }
    //
    //         this.anchorManager.redraw(id, ui, timestamp, null);
    //
    //         // if (repaintEls.length > 0) {
    //         //     for (var j = 0; j < repaintEls.length; j++) {
    //         //         _currentInstance.anchorManager.redraw(_currentInstance.getId(repaintEls[j]), repaintOffsets[j], timestamp, null, clearEdits, true);
    //         //     }
    //         // }
    //     }
    // }

    deleteConnection (connection:Connection<E>, params?:any):boolean {

        if (connection != null) {
            params = params || {};

            if (params.force || functionChain(true, false, [
                    [ connection.endpoints[0], Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection.endpoints[1], Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection, Constants.IS_DETACH_ALLOWED, [ connection ] ],
                    [ this, Constants.CHECK_CONDITION, [ Constants.BEFORE_DETACH, connection ] ]
                ])) {

                connection.setHover(false);
                this.fireDetachEvent(connection, !connection.pending && params.fireEvent !== false, params.originalEvent);

                connection.endpoints[0].detachFromConnection(connection);
                connection.endpoints[1].detachFromConnection(connection);
                removeWithFunction(this.connections, (_c:Connection<E>) => {
                    return connection.id === _c.id;
                });

                connection.cleanup();
                connection.destroy();
                return true;
            }
        }
        return false;
    }

    deleteEveryConnection (params?:any):number {
        params = params || {};
        let count = this.connections.length, deletedCount = 0;
        this.batch(() => {
            for (let i = 0; i < count; i++) {
                deletedCount += this.deleteConnection(this.connections[0], params) ? 1 : 0;
            }
        });
        return deletedCount;
    }

    deleteConnectionsForElement(el:E|string, params?:any):jsPlumbInstance<E> {
        params = params || {};
        let _el = this.getElement(el);
        let id = this.getId(_el), endpoints = this.endpointsByElement[id];
        if (endpoints && endpoints.length) {
            for (let i = 0, j = endpoints.length; i < j; i++) {
                endpoints[i].deleteEveryConnection(params);
            }
        }
        return this;
    }

    private fireDetachEvent (jpc:Connection<E> | any, doFireEvent?:boolean, originalEvent?:Event):void {
        // may have been given a connection, or in special cases, an object
        let argIsConnection:boolean = (jpc.id != null),
            params = argIsConnection ? {
                connection: jpc,
                source: jpc.source, target: jpc.target,
                sourceId: jpc.sourceId, targetId: jpc.targetId,
                sourceEndpoint: jpc.endpoints[0], targetEndpoint: jpc.endpoints[1]
            } : jpc;

        if (doFireEvent) {
            this.fire(Constants.EVENT_CONNECTION_DETACHED, params, originalEvent);
        }

        // always fire this. used by internal jsplumb stuff.
        this.fire(Constants.EVENT_INTERNAL_CONNECTION_DETACHED, params, originalEvent);

        this.anchorManager.connectionDetached(params);
    };

    private fireMoveEvent (params?:any, evt?:Event):void {
        this.fire(Constants.EVENT_CONNECTION_MOVED, params, evt);
    }

    manage (id:string | E, element?:E):ManagedElement<E> {

        let _id:string, _element:E;

        if (!isString(id)) {
            _id = this.getId(id as E);
            _element = id as E;
        } else {
            _id = id as string;
            _element = element;
        }

        if (!this._managedElements[_id]) {
            this._managedElements[_id] = {
                el: _element,
                endpoints: [],
                connections: []
            };

            // dont compute size now if drawing suspend (to avoid any reflows)
            if (this.isSuspendDrawing()) {
                this._sizes[_id] = [0,0];
                this._offsets[_id] = {left:0,top:0};
                this._managedElements[_id].info = {o:this._offsets[_id], s:this._sizes[_id]};
            } else {
                this._managedElements[_id].info = this.updateOffset({elId: _id, timestamp: this._suspendedAt});
            }

            this.setAttribute(_element, "jtk-managed", "");
        }

        return this._managedElements[_id];

    }

    unmanage (id:string):void {
        if (this._managedElements[id]) {
            this.removeAttribute(this._managedElements[id].el, "jtk-managed");
            delete this._managedElements[id];
        }
    }

    newEndpoint(params:any, id?:string):Endpoint<E> {
        let _p = extend({}, params);
        _p._jsPlumb = this;
        // _p.endpointsByUUID = this.endpointsByUUID;
        // _p.endpointsByElement = this.endpointsByElement;
        // _p.fireDetachEvent = this.fireDetachEvent;
        _p.elementId = id || this.getId(_p.source);

        let ep = new Endpoint(this, _p);
        ep.id = "ep_" + this._idstamp();
        this.manage(_p.elementId, _p.source);

        return ep;
    }

    deriveEndpointAndAnchorSpec(type:string, dontPrependDefault?:boolean):any {
        let bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/), eps = null, ep = null, a = null, as = null;
        for (let i = 0; i < bits.length; i++) {
            let _t = this.getType(bits[i], "connection");
            if (_t) {
                if (_t.endpoints) {
                    eps = _t.endpoints;
                }
                if (_t.endpoint) {
                    ep = _t.endpoint;
                }
                if (_t.anchors) {
                    as = _t.anchors;
                }
                if (_t.anchor) {
                    a = _t.anchor;
                }
            }
        }
        return { endpoints: eps ? eps : [ ep, ep ], anchors: as ? as : [a, a ]};
    }

    getAllConnections ():Array<Connection<E>> {
        return this.connections;
    }

    private _elEach (el:E | string | Array<E | string>, fn:Function):jsPlumbInstance<E> {
    // support both lists...
        if (typeof el === 'object' && (<any>el).length) {
            let ela = el as Array<any>;
            for (let i = 0, ii = ela.length; i < ii; i++) {
                fn(ela[i]);
            }
        }
        else {// ...and single strings or elements.
            fn(el);
        }

        return this;
    }

    // repaint some element's endpoints and connections
    repaint (el:string | E | Array<string | E>, ui?:any, timestamp?:string):jsPlumbInstance<E> {
        return this._elEach(el, (_el:E | string) => {
            this._draw(_el, ui, timestamp);
        });
    }

    revalidate (el:string | E | Array<string | E>, timestamp?:string, isIdAlready?:boolean):jsPlumbInstance<E> {
        return this._elEach(el, (_el:E | string) => {
            let elId = isIdAlready ? _el as string : this.getId(_el);
            this.updateOffset({ elId: elId, recalc: true, timestamp:timestamp });
            this.repaint(_el);
        });
    }

    // repaint every endpoint and connection.
    repaintEverything ():jsPlumbInstance<E> {
        // TODO this timestamp causes continuous anchors to not repaint properly.
        // fix this. do not just take out the timestamp. it runs a lot faster with
        // the timestamp included.
        let timestamp = _timestamp(), elId:string;

        for (elId in this.endpointsByElement) {
            this.updateOffset({ elId: elId, recalc: true, timestamp: timestamp });
        }

        for (elId in this.endpointsByElement) {
            this._draw(elId, null, timestamp);
        }

        return this;
    }

    _draw(element:string | E, ui?:any, timestamp?:string) {

        if (!this._suspendDrawing) {
            let id = this.getId(element),
                repaintEls = [],
                repaintOffsets = [];//,
            //     dm = _currentInstance.getDragManager();
            //
            // if (dm) {
            //     repaintEls = dm.getElementsForDraggable(element);
            // }

            if (timestamp == null) {
                timestamp = _timestamp();
            }

            // update the offset of everything _before_ we try to draw anything.
            this.updateOffset({ elId: id, offset: ui, recalc: false, timestamp: timestamp });
            // for (let i = 0; i < repaintEls.length; i++) {
            //     repaintOffsets.push(this._updateOffset({ elId: this.getId(repaintEls[i]), recalc: true, timestamp: timestamp }).o);
            // }

            this.anchorManager.redraw(id, ui, timestamp, null);

            // if (repaintEls.length > 0) {
            //     for (let j = 0; j < repaintEls.length; j++) {
            //         this.anchorManager.redraw(this.getId(repaintEls[j]), repaintOffsets[j], timestamp, null, true);
            //     }
            // }
        }
    }

    deleteObject(params:DeleteOptions<E>):DeleteResult<E> {
        let result:DeleteResult<E> = {
                endpoints: {},
                connections: {},
                endpointCount: 0,
                connectionCount: 0
            },
            deleteAttachedObjects = params.deleteAttachedObjects !== false;

        let unravelConnection = (connection:Connection<E>) => {
            if (connection != null && result.connections[connection.id] == null) {
                if (!params.dontUpdateHover && connection._jsPlumb != null) {
                    connection.setHover(false);
                }
                result.connections[connection.id] = connection;
                result.connectionCount++;
            }
        };
        let unravelEndpoint = (endpoint:Endpoint<E>) => {
            if (endpoint != null && result.endpoints[endpoint.id] == null) {
                if (!params.dontUpdateHover && endpoint._jsPlumb != null) {
                    endpoint.setHover(false);
                }
                result.endpoints[endpoint.id] = endpoint;
                result.endpointCount++;

                if (deleteAttachedObjects) {
                    for (let i = 0; i < endpoint.connections.length; i++) {
                        let c = endpoint.connections[i];
                        unravelConnection(c);
                    }
                }
            }
        };

        if (params.connection) {
            unravelConnection(params.connection);
        }
        else {
            unravelEndpoint(params.endpoint);
        }

        // loop through connections
        for (let i in result.connections) {
            let c = result.connections[i];
            if (c._jsPlumb) {
                removeWithFunction(this.connections, (_c:Connection<E>) => {
                    return c.id === _c.id;
                });

                this.fireDetachEvent(c, params.fireEvent === false ? false : !c.pending, params.originalEvent);
                let doNotCleanup = params.deleteAttachedObjects == null ? null : !params.deleteAttachedObjects;

                c.endpoints[0].detachFromConnection(c, null, doNotCleanup);
                c.endpoints[1].detachFromConnection(c, null, doNotCleanup);

                c.cleanup(true);
                c.destroy(true);
            }
        }

        // loop through endpoints
        for (let j in result.endpoints) {
            let e = result.endpoints[j];
            if (e._jsPlumb) {
                this.unregisterEndpoint(e);
                // FIRE some endpoint deleted event?
                e.cleanup(true);
                e.destroy(true);
            }
        }

        return result;
    }

    unregisterEndpoint(endpoint:Endpoint<E>) {
        if (endpoint._jsPlumb.uuid) {
            delete this.endpointsByUUID[endpoint._jsPlumb.uuid];
        }
        this.anchorManager.deleteEndpoint(endpoint);

        // TODO at least replace this with a removeWithFunction call.
        for (let e in this.endpointsByElement) {
            let endpoints = this.endpointsByElement[e];
            if (endpoints) {
                let newEndpoints = [];
                for (let i = 0, j = endpoints.length; i < j; i++) {
                    if (endpoints[i] !== endpoint) {
                        newEndpoints.push(endpoints[i]);
                    }
                }

                this.endpointsByElement[e] = newEndpoints;
            }
            if (this.endpointsByElement[e].length < 1) {
                delete this.endpointsByElement[e];
            }
        }
    }

    deleteEndpoint(object:string | Endpoint<E>, dontUpdateHover?:boolean, deleteAttachedObjects?:boolean):jsPlumbInstance<E> {
        let endpoint = (typeof object === "string") ? this.endpointsByUUID[object as string] : object as Endpoint<E>;
        if (endpoint) {
            this.deleteObject({ endpoint: endpoint, dontUpdateHover: dontUpdateHover, deleteAttachedObjects:deleteAttachedObjects });
        }
        return this;
    }

    deleteEveryEndpoint ():jsPlumbInstance<E> {
        let _is = this.setSuspendDrawing(true);
        for (let id in this.endpointsByElement) {
            let endpoints = this.endpointsByElement[id];
            if (endpoints && endpoints.length) {
                for (let i = 0, j = endpoints.length; i < j; i++) {
                    this.deleteEndpoint(endpoints[i], true);
                }
            }
        }
        this.endpointsByElement = {};
        this._managedElements = {};
        this.endpointsByUUID = {};
        this._offsets = {};
        this._offsetTimestamps = {};
        this.anchorManager.reset();
        // var dm = _currentInstance.getDragManager();
        // if (dm) {
        //     dm.reset();
        // }
        if (!_is) {
            this.setSuspendDrawing(false);
        }
        return this;
    }

    addEndpoint(el:ElementSpec<E>, params?:EndpointOptions<E>, referenceParams?:EndpointOptions<E>):Endpoint<E> | Array<Endpoint<E>> {
        referenceParams = referenceParams || {} as EndpointOptions<E>;
        let p:EndpointOptions<E> = extend({}, referenceParams);
        extend(p, params);
        p.endpoint = p.endpoint || this.Defaults.endpoint;
        p.paintStyle = p.paintStyle || this.Defaults.endpointStyle;

        let ep:Array<Endpoint<E>> = [];

        this.each(el, (_el:E) => {
            let _p = extend({source:_el}, p);
            //p.source = _el;
            this.manage(_p.source);
            let id = this.getId(_p.source),
                e = this.newEndpoint(_p, id);

            addToList(this.endpointsByElement, id, e);

            if (!this._suspendDrawing) {
                let myOffset = this._managedElements[id].info.o;
                e.paint({
                    anchorLoc: e.anchor.compute({ xy: [ myOffset.left, myOffset.top ], wh: this._sizes[id], element: e, timestamp: this._suspendedAt }),
                    timestamp: this._suspendedAt
                });
            }

            ep.push(e);
        });


        return ep.length > 1 ? ep : ep[0];
    }

    addEndpoints(el:ElementSpec<E>, endpoints:Array<EndpointOptions<E>>, referenceParams?:any):Array<Endpoint<E>> {
        let results:Array<Endpoint<E>> = [];
        for (let i = 0, j = endpoints.length; i < j; i++) {
            let e = this.addEndpoint(el, endpoints[i], referenceParams);
            if (isArray(e)) {
                Array.prototype.push.apply(results, e as Array<Endpoint<E>>);
            }
            else {
                results.push(e as Endpoint<E>);
            }
        }
        return results;
    }

    reset (doNotUnbindInstanceEventListeners?:boolean):void {
        this.silently(() => {
            //this._hoverSuspended = false;
            //this.removeAllGroups();
            //this.removeGroupManager();
            this.deleteEveryEndpoint();
            if (!doNotUnbindInstanceEventListeners) {
                this.unbind();
            }
            //delete _container._katavorioDrag;
            this.connections.length = 0;
            // if (this.doReset) {
            //     this.doReset();
            // }
        });
    }

    empty(el:E, doNotRepaint?:boolean):jsPlumbInstance<E> {
        let affectedElements:Array<{el:E, text?:boolean, id?:string}> = [];
        let _one = (el:E, dontRemoveFocus?:boolean) => {
            let info = this._info(el);
            if (info.text) {
                this.removeElement(info.el)
                //(<any>info.el).parentNode.removeChild(info.el);
            }
            // TODO DOM specific:
            else if (info.el) {
                while((<any>info.el).childNodes.length > 0) {
                    _one((<any>info.el).childNodes[0]);
                }
                if (!dontRemoveFocus) {
                    this._doRemove(info, affectedElements);
                }
            }
        };

        this.batch(() => {
            _one(el, true);
        }, doNotRepaint === false);

        return this;
    }

    getEndpoints(el:string|E):Array<Endpoint<E>> {
        return this.endpointsByElement[this._info(el).id] || [];
    }

    getEndpoint(id:string):Endpoint<E> {
        return this.endpointsByUUID[id];
    }

    connect (params:any, referenceParams?:any):Connection<E> {

        // prepare a final set of parameters to create connection with
        let _p = this._prepareConnectionParams(params, referenceParams), jpc:Connection<E>;

        // TODO probably a nicer return value if the connection was not made.  _prepareConnectionParams
        // will return null (and log something) if either endpoint was full.  what would be nicer is to
        // create a dedicated 'error' object.
        if (_p) {
            if (_p.source == null && _p.sourceEndpoint == null) {
                log("Cannot establish connection - source does not exist");
                return;
            }
            if (_p.target == null && _p.targetEndpoint == null) {
                log("Cannot establish connection - target does not exist");
                return;
            }
            //_ensureContainer(_p.source);

            // create the connection.  it is not yet registered
            jpc = this._newConnection(_p);

            // now add it the model, fire an event, and redraw
            this._finaliseConnection(jpc, _p);
        }


        return jpc;
    }

    _prepareConnectionParams(params:any, referenceParams?:any):any {


        let _p = extend({ }, params);
        if (referenceParams) {
            extend(_p, referenceParams);
        }

        // hotwire endpoints passed as source or target to sourceEndpoint/targetEndpoint, respectively.
        if (_p.source) {
            if (_p.source.endpoint) {
                _p.sourceEndpoint = _p.source;
            }
            else {
                _p.source = this.getElement(_p.source);
            }
        }
        if (_p.target) {
            if (_p.target.endpoint) {
                _p.targetEndpoint = _p.target;
            }
            else {
                _p.target = this.getElement(_p.target);
            }
        }

        // test for endpoint uuids to connect
        if (params.uuids) {
            _p.sourceEndpoint = this.getEndpoint(params.uuids[0]);
            _p.targetEndpoint = this.getEndpoint(params.uuids[1]);
        }

        // now ensure that if we do have Endpoints already, they're not full.
        // source:
        if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
            log("could not add connection; source endpoint is full");
            return;
        }

        // target:
        if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
            log("could not add connection; target endpoint is full");
            return;
        }

        // if source endpoint mandates connection type and nothing specified in our params, use it.
        if (!_p.type && _p.sourceEndpoint) {
            _p.type = _p.sourceEndpoint.connectionType;
        }

        // copy in any connectorOverlays that were specified on the source endpoint.
        // it doesnt copy target endpoint overlays.  i'm not sure if we want it to or not.
        if (_p.sourceEndpoint && _p.sourceEndpoint.connectorOverlays) {
            _p.overlays = _p.overlays || [];
            for (let i = 0, j = _p.sourceEndpoint.connectorOverlays.length; i < j; i++) {
                _p.overlays.push(_p.sourceEndpoint.connectorOverlays[i]);
            }
        }

        // scope
        if (_p.sourceEndpoint && _p.sourceEndpoint.scope) {
            _p.scope = _p.sourceEndpoint.scope;
        }

        // pointer events
        if (!_p["pointer-events"] && _p.sourceEndpoint && _p.sourceEndpoint.connectorPointerEvents) {
            _p["pointer-events"] = _p.sourceEndpoint.connectorPointerEvents;
        }

        let _addEndpoint = (el:E, def?:any, idx?:number):Endpoint<E> | Array<Endpoint<E>> => {
            return this.addEndpoint(el, _mergeOverrides(def, {
                anchor: _p.anchors ? _p.anchors[idx] : _p.anchor,
                endpoint: _p.endpoints ? _p.endpoints[idx] : _p.endpoint,
                paintStyle: _p.endpointStyles ? _p.endpointStyles[idx] : _p.endpointStyle,
                hoverPaintStyle: _p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle
            }));
        };

        // check for makeSource/makeTarget specs.

        let _oneElementDef = (type:string, idx:number, defs?:any, matchType?:string) => {
            // `type` is "source" or "target". Check that it exists, and is not already an Endpoint.
            if (_p[type] && !_p[type].endpoint && !_p[type + "Endpoint"] && !_p.newConnection) {

                let elDefs = _p[type][type === "source" ? "_jsPlumbSourceDefinitions" : "_jsPlumbTargetDefinitions"];
                if (elDefs) {
                    let defIdx = findWithFunction(elDefs, (d:any) => {
                        return d.def.connectionType == null || d.def.connectionType === matchType;
                    });
                    if (defIdx >= 0) {

                        let tep = elDefs[defIdx];

                        if (tep) {
                            // if not enabled, return.
                            if (!tep.enabled) {
                                return false;
                            }
                            let newEndpoint = tep.endpoint != null && tep.endpoint._jsPlumb ? tep.endpoint : _addEndpoint(_p[type], tep.def, idx);
                            if (newEndpoint.isFull()) {
                                return false;
                            }
                            _p[type + "Endpoint"] = newEndpoint;
                            if (!_p.scope && tep.def.scope) {
                                _p.scope = tep.def.scope;
                            } // provide scope if not already provided and endpoint def has one.
                            if (tep.uniqueEndpoint) {
                                if (!tep.endpoint) {
                                    tep.endpoint = newEndpoint;
                                    newEndpoint.deleteOnEmpty = false;
                                }
                                else {
                                    newEndpoint.finalEndpoint = tep.endpoint;
                                }
                            } else {
                                newEndpoint.deleteOnEmpty = true;
                            }

                            //
                            // copy in connector overlays if present on the source definition.
                            //
                            if (idx === 0 && tep.def.connectorOverlays) {
                                _p.overlays = _p.overlays || [];
                                Array.prototype.push.apply(_p.overlays, tep.def.connectorOverlays);
                            }
                        }
                    }
                }


            }
        };

        if (_oneElementDef("source", 0, this.sourceEndpointDefinitions, _p.type || "default") === false) {
            return;
        }
        if (_oneElementDef("target", 1, this.targetEndpointDefinitions, _p.type || "default") === false) {
            return;
        }

        // last, ensure scopes match
        if (_p.sourceEndpoint && _p.targetEndpoint) {
            if (!_scopeMatch(_p.sourceEndpoint, _p.targetEndpoint)) {
                _p = null;
            }
        }
        return _p;
    }

    _newConnection (params:any):Connection<E> {

        //var connectionFunc = _currentInstance.Defaults.ConnectionType || _currentInstance.getDefaultConnectionType();

        params._jsPlumb = this;
        //params.newConnection = this._newConnection;
        //params.newEndpoint = this._newEndpoint;
        //params.endpointsByUUID = endpointsByUUID;
        //params.endpointsByElement = endpointsByElement;
        //params.finaliseConnection = _finaliseConnection;
        params.id = "con_" + this._idstamp();
        let con = new Connection(this, params);



        return con;
    }

    //
    // adds the connection to the backing model, fires an event if necessary and then redraws
    //
    _finaliseConnection(jpc:Connection<E>, params?:any, originalEvent?:Event, doInformAnchorManager?:boolean):void {

        params = params || {};
        // add to list of connections (by scope).
        if (!jpc.suspendedEndpoint) {
            this.connections.push(jpc);
        }

        jpc.pending = null;

        // turn off isTemporarySource on the source endpoint (only viable on first draw)
        jpc.endpoints[0].isTemporarySource = false;

        // always inform the anchor manager
        // except that if jpc has a suspended endpoint it's not true to say the
        // connection is new; it has just (possibly) moved. the question is whether
        // to make that call here or in the anchor manager.  i think perhaps here.
        if (doInformAnchorManager !== false) {
            this.anchorManager.newConnection(jpc);
        }

        // force a paint
        this._draw(jpc.source);

        // fire an event
        if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {

            let eventArgs = {
                connection: jpc,
                source: jpc.source, target: jpc.target,
                sourceId: jpc.sourceId, targetId: jpc.targetId,
                sourceEndpoint: jpc.endpoints[0], targetEndpoint: jpc.endpoints[1]
            };

            this.fire("connection", eventArgs, originalEvent);
        }
    }

    private _doRemove(info:{el:E, text?:boolean, id?:string}, affectedElements:Array<{el:E, text?:boolean, id?:string}>):void {
        this.removeAllEndpoints(info.id, true, affectedElements);
        //var dm = _currentInstance.getDragManager();
        let _one = (_info:{el:E, text?:boolean, id?:string}) => {

            this.anchorManager.clearFor(_info.id);
            this.anchorManager.removeFloatingConnection(_info.id);

            if (this.isSource(_info.el)) {
                this.unmakeSource(_info.el);
            }
            if (this.isTarget(_info.el)) {
                this.unmakeTarget(_info.el);
            }

            delete this._floatingConnections[_info.id];
            delete this._managedElements[_info.id];
            delete this._offsets[_info.id];
            if (_info.el) {
                this.removeElement(_info.el);
                //_info.el._jsPlumb = null;
            }
        };

        // remove all affected child elements
        for (let ae = 1; ae < affectedElements.length; ae++) {
            _one(affectedElements[ae]);
        }
        // and always remove the requested one from the dom.
        _one(info);
    }

    remove(el:string|E, doNotRepaint?:boolean):jsPlumbInstance<E> {
        let info = this._info(el), affectedElements:Array<any> = [];
        if (info.text) {
            this.remove(info.el);
            //(<any>info.el).parentNode.removeChild(info.el);
        }
        else if (info.id) {
            this.batch(() => {
                this._doRemove(info, affectedElements);
            }, doNotRepaint === true);
        }
        return this;
    }

    removeAllEndpoints(el:string | E, recurse?:boolean, affectedElements?:Array<any>):jsPlumbInstance<E> {
        affectedElements = affectedElements || [];
        let _one = (_el:string | E) => {
            let info = this._info(_el),
                ebe = this.endpointsByElement[info.id],
                i, ii;

            if (ebe) {
                affectedElements.push(info);
                for (i = 0, ii = ebe.length; i < ii; i++) {
                    this.deleteEndpoint(ebe[i], false);
                }
            }
            delete this.endpointsByElement[info.id];

            // TODO DOM specific
            if (recurse) {
                if (info.el && (<any>info.el).nodeType !== 3 && (<any>info.el).nodeType !== 8) {
                    for (i = 0, ii = (<any>info.el).childNodes.length; i < ii; i++) {
                        _one((<any>info.el).childNodes[i]);
                    }
                }
            }

        };
        _one(el);
        return this;
    }

    private _setEnabled (type:string, el:ElementSpec<E>, state:boolean, toggle?:boolean, connectionType?:string):any {
        let originalState:Array<any> = [], newState, os;

        connectionType = connectionType || "default";

        this.each(el, (_el:any) => {
            let defs = _el[type === "source" ? "_jsPlumbSourceDefinitions" : "_jsPlumbTargetDefinitions"];
            if (defs) {
                this.each(defs, (def:any) =>{
                    if (def.def.connectionType == null || def.def.connectionType === connectionType) {
                        os = def.enabled;
                        originalState.push(os);
                        newState = toggle ? !os : state;
                        def.enabled = newState;
                        this[newState ? "removeClass" : "addClass"](_el, "jtk-" + type + "-disabled");
                    }
                });
            }
        });

        return originalState.length > 1 ? originalState : originalState[0];

    }


    toggleSourceEnabled (el:E, connectionType?:string):any {
        this._setEnabled("source", el, null, true, connectionType);
        return this.isSourceEnabled(el, connectionType);
    }

    setSourceEnabled (el:ElementSpec<E>, state:boolean, connectionType?:string):any {
        return this._setEnabled("source", el, state, null, connectionType);
    }

    findFirstSourceDefinition(el:E, connectionType?:string):any {
        return this.findFirstDefinition("_jsPlumbSourceDefinitions", el, connectionType);
    }

    findFirstTargetDefinition(el:E, connectionType?:string):any {
        return this.findFirstDefinition("_jsPlumbTargetDefinitions", el, connectionType);
    }

    private findFirstDefinition(key:string, el:E, connectionType?:string):any {
        let eldefs = el[key];
        if (eldefs && eldefs.length > 0) {
            let idx = connectionType == null ? 0 : findWithFunction(eldefs, (d:any) => { return d.def.connectionType === connectionType; });
            if (idx >= 0) {
                return eldefs[0];
            }
        }
    }

    isSource (el:E, connectionType?:string):any {
        return this.findFirstSourceDefinition(el, connectionType) != null;
    }

    isSourceEnabled (el:E, connectionType?:string):boolean {
        let def = this.findFirstSourceDefinition(el, connectionType);
        return def != null && def.enabled !== false;
    }

    toggleTargetEnabled(el:E, connectionType?:string):any {
        this._setEnabled("target", el, null, true, connectionType);
        return this.isTargetEnabled(el, connectionType);
    };

    isTarget(el:E, connectionType?:string):boolean {
        return this.findFirstTargetDefinition(el, connectionType) != null;
    }

    isTargetEnabled (el:E, connectionType?:string):boolean {
        let def = this.findFirstTargetDefinition(el, connectionType);
        return def != null && def.enabled !== false;
    }

    setTargetEnabled(el:E, state:boolean, connectionType?:string):any {
        return this._setEnabled("target", el, state, null, connectionType);
    }

    // really just exposed for testing
    makeAnchor(spec:AnchorSpec, elementId?:string):Anchor<E> {
        return makeAnchorFromSpec(this, spec, elementId);
    }

    private _unmake (type:string, key:string, el:ElementSpec<E>, connectionType?:string) {

        connectionType = connectionType || "default";

        this.each(el, (_el:E) => {
            if (_el[key]) {
                if (connectionType === "*") {
                    delete _el[key];
                    this.removeAttribute(_el, "jtk-" + type);
                } else {
                    let t:Array<any> = [];
                    _el[key].forEach((def:any) => {
                        if (connectionType !== def.def.connectionType) {
                            t.push(def);
                        }
                    });

                    if (t.length > 0) {
                        _el[key] = t;
                    } else {
                        delete _el[key];
                        this.removeAttribute(_el, "jtk-" + type);
                    }
                }
            }
        });
    }

    private _unmakeEvery (type:string, key:string, connectionType?:string) {
        let els = this.getSelector("[jtk-" + type + "]");
        for (let i = 0; i < els.length; i++) {
            this._unmake(type, key, els[i], connectionType);
        }
    }

    // see api docs
    unmakeTarget (el:E, connectionType?:string) {
        return this._unmake("target", "_jsPlumbTargetDefinitions", el, connectionType);
    }

    // see api docs
    unmakeSource (el:E, connectionType?:string) {
        return this._unmake("source", "_jsPlumbSourceDefinitions", el, connectionType);
    }

    // see api docs
    unmakeEverySource (connectionType?:string) {
        this._unmakeEvery("source", "_jsPlumbSourceDefinitions", connectionType || "*");
    }

    // see api docs
    unmakeEveryTarget (connectionType?:string) {
        this._unmakeEvery("target", "_jsPlumbTargetDefinitions", connectionType || "*");
    }

    private _writeScopeAttribute (el:E, scope:string):void {
        let scopes = scope.split(/\s/);
        for (let i = 0; i < scopes.length; i++) {
            this.setAttribute(el, "jtk-scope-" + scopes[i], "");
        }
    }

    // TODO knows about the DOM
    makeSource(el:ElementSpec<E>, params?:any, referenceParams?:any):jsPlumbInstance<E> {
        let p = extend({_jsPlumb: this}, referenceParams);
        extend(p, params);
        p.connectionType = p.connectionType || "default";
        let aae = this.deriveEndpointAndAnchorSpec(p.connectionType);
        p.endpoint = p.endpoint || aae.endpoints[0];
        p.anchor = p.anchor || aae.anchors[0];
        let maxConnections = p.maxConnections || -1;

        let inputs:Array<any> = !isString(el) ? el as Array<any> : [ el ];
        for (let i = 0, ii = inputs.length; i < ii; i++) {
            let elInfo = this._info(inputs[i]);
            // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
            // and use the endpoint definition if found.
            let elid = elInfo.id,
                _del = elInfo.el;

            this.manage(_del);
            this.setAttribute(_del, "jtk-source", "");
            this._writeScopeAttribute(elInfo.el, (p.scope || this.Defaults.scope));
            this.setAttribute(_del, "jtk-source-" + p.connectionType, "");

            this.sourceEndpointDefinitions[elid] = this.sourceEndpointDefinitions[elid] || {};
            (<any>elInfo.el)._jsPlumbSourceDefinitions = (<any>elInfo.el)._jsPlumbSourceDefinitions || [];

            // TODO find the interface that pertains to this
            let _def = {
                def:extend({}, p),
                uniqueEndpoint: p.uniqueEndpoint,
                maxConnections: maxConnections,
                enabled: true,
                endpoint:null as Endpoint<E>
            };

            if (p.createEndpoint) {
                _def.uniqueEndpoint = true;
                _def.endpoint = this.addEndpoint(_del, _def.def)[0];
                _def.endpoint.deleteOnEmpty = false;
            }

            (<any>elInfo).def = _def;
            (<any>elInfo.el)._jsPlumbSourceDefinitions.push(_def);

        }

        return this;
    }

    makeTarget (el:ElementSpec<E>, params:any, referenceParams?:any):jsPlumbInstance<E> {

        // make an array if only given one element
        let inputs:Array<any> = !isString ? el as Array<any> : [ el ];

        // put jsplumb ref into params without altering the params passed in
        let p = extend({_jsPlumb: this}, referenceParams);
        extend(p, params);
        p.connectionType  = p.connectionType || "default";

        let maxConnections = p.maxConnections || -1;//,

        // register each one in the list.
        for (let i = 0, ii = inputs.length; i < ii; i++) {

            // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
            // and use the endpoint definition if found.
            // decode the info for this element (id and element)
            let elInfo = this._info(inputs[i]),
                dropOptions = extend({}, p.dropOptions || {});

            this.manage(elInfo.el);
            this.setAttribute(elInfo.el, "jtk-target", "");
            this._writeScopeAttribute(elInfo.el, (p.scope || this.Defaults.scope));
            this.setAttribute(elInfo.el, "jtk-target-" + p.connectionType, "");

            (<any>elInfo.el)._jsPlumbTargetDefinitions = (<any>elInfo.el)._jsPlumbTargetDefinitions || [];

            // if this is a group and the user has not mandated a rank, set to -1 so that Nodes takes
            // precedence.
            if ((<any>elInfo.el)._isJsPlumbGroup && dropOptions.rank == null) {
                dropOptions.rank = -1;
            }

            // store the definition
            let _def = {
                def: extend({}, p),
                uniqueEndpoint: p.uniqueEndpoint,
                maxConnections: maxConnections,
                enabled: true,
                endpoint:null as Endpoint<E>
            };

            if (p.createEndpoint) {
                _def.uniqueEndpoint = true;
                _def.endpoint = this.addEndpoint(elInfo.el, _def.def)[0];
                _def.endpoint.deleteOnEmpty = false;
            }

            //(<any>elInfo).def = _def;
            (<any>elInfo.el)._jsPlumbTargetDefinitions.push(_def);
        }

        return this;
    }

    show (el:string|E, changeEndpoints?:boolean):jsPlumbInstance<E> {
        this._setVisible(el, "block", changeEndpoints);
        return this;
    }

    hide (el:string|E, changeEndpoints?:boolean):jsPlumbInstance<E> {
        this._setVisible(el, "none", changeEndpoints);
        return this;
    }

    private _setVisible (el:string|E, state:string, alsoChangeEndpoints?:boolean) {
        let visible = state === "block";
        let endpointFunc = null;
        if (alsoChangeEndpoints) {
            endpointFunc = (ep:Endpoint<E>) => {
                ep.setVisible(visible, true, true);
            };
        }
        let info = this._info(el);
        this._operation(info.id, (jpc:Connection<E>) => {
            if (visible && alsoChangeEndpoints) {
                // this test is necessary because this functionality is new, and i wanted to maintain backwards compatibility.
                // this block will only set a connection to be visible if the other endpoint in the connection is also visible.
                let oidx = jpc.sourceId === info.id ? 1 : 0;
                if (jpc.endpoints[oidx].isVisible()) {
                    jpc.setVisible(true);
                }
            }
            else { // the default behaviour for show, and what always happens for hide, is to just set the visibility without getting clever.
                jpc.setVisible(visible);
            }
        }, endpointFunc);
    }

    /**
     * private method to do the business of toggling hiding/showing.
     */
    private _toggleVisible (elId:string, changeEndpoints?:boolean) {
        let endpointFunc = null;
        if (changeEndpoints) {
            endpointFunc = (ep:Endpoint<E>) => {
                let state = ep.isVisible();
                ep.setVisible(!state);
            };
        }
        this._operation(elId,  (jpc:Connection<E>) => {
            let state = jpc.isVisible();
            jpc.setVisible(!state);
        }, endpointFunc);
    }

    private _operation (elId:string, func:(c:Connection<E>) => any, endpointFunc?:(e:Endpoint<E>) => any) {
        let endpoints = this.endpointsByElement[elId];
        if (endpoints && endpoints.length) {
            for (let i = 0, ii = endpoints.length; i < ii; i++) {
                for (let j = 0, jj = endpoints[i].connections.length; j < jj; j++) {
                    let retVal = func(endpoints[i].connections[j]);
                    // if the function passed in returns true, we exit.
                    // most functions return false.
                    if (retVal) {
                        return;
                    }
                }
                if (endpointFunc) {
                    endpointFunc(endpoints[i]);
                }
            }
        }
    }

    registerConnectionType(id:string, type:TypeDescriptor):void {
        this._connectionTypes[id] = extend({}, type);
        if (type.overlays) {
            let to:Dictionary<FullOverlaySpec> = {};
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = this.convertToFullOverlaySpec(type.overlays[i]);
                to[fo[1].id] = fo;
            }
            this._connectionTypes[id].overlayMap = to;
        }
    }

    registerConnectionTypes(types:Dictionary<TypeDescriptor>) {
        for (let i in types) {
            this.registerConnectionType(i, types[i]);
        }
    }

    registerEndpointType(id:string, type:TypeDescriptor) {
        this._endpointTypes[id] = extend({}, type);
        if (type.overlays) {
            let to:Dictionary<FullOverlaySpec> = {};
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = this.convertToFullOverlaySpec(type.overlays[i]);
                to[fo[1].id] = fo;
            }
            this._endpointTypes[id].overlayMap = to;
        }
    }

    registerEndpointTypes(types:Dictionary<TypeDescriptor>) {
        for (let i in types) {
            this.registerEndpointType(i, types[i]);
        }
    }

    getType(id:string, typeDescriptor:string):TypeDescriptor {
        return typeDescriptor === "connection" ? this._connectionTypes[id] : this._endpointTypes[id];
    }

    importDefaults(d:jsPlumbDefaults):jsPlumbInstance<E> {
        for (let i in d) {
            this.Defaults[i] = d[i];
        }
        if (d.container) {
            this.setContainer(d.container);
        }

        return this;
    }

    restoreDefaults ():jsPlumbInstance<E> {
        this.Defaults = extend({}, this._initialDefaults);
        return this;
    }

    getManagedElements():Dictionary<ManagedElement<E>> {
        return this._managedElements;
    }
}

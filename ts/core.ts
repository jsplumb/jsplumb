
import {RawElement} from "./dom/dom-adapter";
import {isArray, isString} from "./util/_is";
import {_timestamp, addToList, functionChain, log, mergeOverrides, removeWithFunction, uuid} from "./util";
import {curryEach, curryGet } from "./currying";
import {Endpoint, EndpointParams} from "./endpoint";
import {Connection} from "./connection";
import {EventGenerator} from "./event/event-generator";
import {ViewAdapter} from "./view-adapter";
import {getter, setter} from "./currying";
import {ArrayLocation, DefaultsContainer, DefaultsFactory, LeftTopLocation} from "./jsplumb-defaults";

declare const Mottle:any;

export type ManagedElement<EventType, ElementType> = {
    el:ElementType,
    endpoints:Array<Endpoint<EventType, ElementType>>,
    connections:Array<Connection<EventType, ElementType>>,
    info:OffsetInformation
}

export type OffsetInformation = {
    o:LeftTopLocation,
    s:ArrayLocation
}

export type EventDelegation = [ string, Function ];

export abstract class JsPlumbInstance<EventType, ElementType> extends EventGenerator<EventType> {

    _connectionTypes: Map<string, any> = new Map();
    _endpointTypes:Map<string, any> = new Map();

    viewAdapter:ViewAdapter<EventType, ElementType>;

    _instanceIndex:number;

    events = ["tap", "dbltap", "click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu" ];
    eventFilters = { "mouseout": "mouseleave", "mouseexit": "mouseleave" };

    connectorClass = "jtk-connector";
    connectorOutlineClass = "jtk-connector-outline";
    editableConnectorClass = "jtk-connector-editable";
    connectedClass = "jtk-connected";
    hoverClass = "jtk-hover";
    endpointClass = "jtk-endpoint";
    endpointFullClass = "jtk-endpoint-full";
    endpointConnectedClass = "jtk-endpoint-connected";
    endpointDropAllowedClass = "jtk-endpoint-drop-allowed";
    endpointDropForbiddenClass = "jtk-endpoint-drop-forbidden";
    overlayClass = "jtk-overlay";
    endpointAnchorClassPrefix = "jtk-endpoint-anchor";
    hoverSourceClass = "jtk-source-hover";
    hoverTargetClass = "jtk-target-hover";
    dragSelectClass = "jtk-drag-select";

    /**
     * TODO - move this drag aware stuff to a browser aware file.
     */
    currentlyDragging:Boolean;
    connectionBeingDragged:Boolean = false;

    isConnectionBeingDragged() {
        return this.connectionBeingDragged;
    }

    Defaults:DefaultsContainer;
    _initialDefaults:DefaultsContainer = DefaultsFactory.getDefaults();
    targetEndpointDefinitions = {};
    sourceEndpointDefinitions = {};

    constructor(defaults: any) {
        super();
        this.viewAdapter = this.getViewAdapter();

        this._instanceIndex = JsPlumb.getInstanceIndex();

        this.Defaults = mergeOverrides(DefaultsFactory.getDefaults(), defaults);
        for (let i in this.Defaults) {
            this._initialDefaults[i] = this.Defaults[i];
        }
    }

    container: ElementType;
    containerDelegations:Array<EventDelegation> = [];

    _curIdStamp = 1;
    _idstamp() {
        return "" + this._curIdStamp++;
    }

    getContainer(): ElementType {
        return this.container;
    }

    unbindContainer() {
        if (this.container != null && this.containerDelegations.length > 0) {
            for (let i = 0; i < this.containerDelegations.length; i++) {
                this.off(this.container, this.containerDelegations[i][0], this.containerDelegations[i][1]);
            }
        }
    }

    setContainer(c:any) {

        this.unbindContainer();

        // get container as dom element.
        c = this.getElement(c);
        // move existing connections and endpoints, if any.
        this.select().each((conn:Connection<EventType, ElementType>) => {
            conn.moveParent(c);
        });
        this.selectEndpoints().each((ep:Endpoint<EventType, ElementType>) => {
            ep.moveParent(c);
        });

        // set container.
        let previousContainer = this.container;
        this.container = c;
        this.containerDelegations.length = 0;

        let eventAliases = {
            "endpointclick":"endpointClick",
            "endpointdblclick":"endpointDblClick"
        };

        let _oneDelegateHandler = (id:string, e:any, componentType?:any) => {
            let t = e.srcElement || e.target,
                jp = (t && t.parentNode ? t.parentNode._jsPlumb : null) || (t ? t._jsPlumb : null) || (t && t.parentNode && t.parentNode.parentNode ? t.parentNode.parentNode._jsPlumb : null);
            if (jp) {
                jp.fire(id, jp, e);
                let alias = componentType ? eventAliases[componentType + id] || id : id;
                // jsplumb also fires every event coming from components/overlays. That's what the test for `jp.component` is for.
                this.fire(alias, jp.component || jp, e);
            }
        };

        let _addOneDelegate = (eventId:string, selector:string, fn:Function) => {
            this.containerDelegations.push([eventId, fn]);
            this.on(this.container, eventId, selector, fn);
        };

        // delegate one event on the container to jsplumb elements. it might be possible to
        // abstract this out: each of endpoint, connection and overlay could register themselves with
        // jsplumb as "component types" or whatever, and provide a suitable selector. this would be
        // done by the renderer (although admittedly from 2.0 onwards we're not supporting vml anymore)
        let _oneDelegate =  (id:string) => {
            // connections.
            _addOneDelegate(id, ".jtk-connector", function (e:EventType) {
                _oneDelegateHandler(id, e);
            });
            // endpoints. note they can have an enclosing div, or not.
            _addOneDelegate(id, ".jtk-endpoint", function (e:EventType) {
                _oneDelegateHandler(id, e, "endpoint");
            });
            // overlays
            _addOneDelegate(id, ".jtk-overlay", function (e:EventType) {
                _oneDelegateHandler(id, e);
            });
        };

        for (let i = 0; i < this.events.length; i++) {
            _oneDelegate(this.events[i]);
        }

        // managed elements
        for (let elId in this.managedElements) {
            let el = this.managedElements[elId].el;
            if (el.parentNode === previousContainer) {
                (<any>previousContainer).removeChild(el);
                (<any>this.container).appendChild(el);
            }
        }
    }

    init(): void {

    }

    importDefaults(d:any) {
        for (let i in d) {
            this.Defaults[i] = d[i];
        }
        if (d.Container) {
            this.setContainer(d.Container);
        }

        return this;
    }

    restoreDefaults() {
        this.Defaults = JsPlumb.extend({}, this._initialDefaults);
        return this;
    }

    abstract getViewAdapter():ViewAdapter<EventType, ElementType>;
    getSelector(ctx:any, spec:string):any { return this.viewAdapter.getSelector(ctx, spec) }
    // isDragSupported(el:ElementType):Boolean { return this.viewAdapter.isDragSupported(el); }
    // isDropSupported(el:ElementType):Boolean { return this.viewAdapter.isDropSupported(el); }
    trigger(el:ElementType, event:string, originalEvent?:EventType):void { return this.viewAdapter.trigger(el, event, originalEvent); }
    // on(el:ElementType, evt:string, fn:Function):any { return this.viewAdapter.on(el, evt, fn); }
    // off(el:ElementType, fn:Function):any { return this.viewAdapter.off(el, fn); }
    getSize(el:ElementType):[number, number] { return this.viewAdapter.getSize(el); }
    getWidth(el:ElementType):number { return this.viewAdapter.getWidth(el); }
    getHeight(el:ElementType):number { return this.viewAdapter.getHeight(el); }
    addClass(el:ElementType, clazz:string) { this.viewAdapter.addClass(el, clazz); }
    getClass(el:ElementType):string { return this.viewAdapter.getClass(el); }
    setClass(el:ElementType, clazz:string) { this.viewAdapter.setClass(el, clazz); }
    updateClasses(el:ElementType, classesToAdd?:string|Array<string>, classesToRemove?:string|Array<string>) { return this.viewAdapter.updateClasses(el, classesToAdd, classesToRemove); }
    removeClass(el:ElementType, clazz:string) { this.viewAdapter.removeClass(el, clazz); }
    hasClass(el:ElementType, clazz:string):Boolean { return this.viewAdapter.hasClass(el, clazz); }
    getOffset(el:ElementType, relativeToRoot?:Boolean, container?:ElementType):LeftTopLocation { return this.viewAdapter.getOffset(el, relativeToRoot, container); }
    getAttribute(el:any, attName:string) { return this.viewAdapter.getAttribute(el, attName)}
    setAttribute(el:any, attName:string, attValue:string) { this.viewAdapter.setAttribute(el, attName, attValue);}
    setAttributes(el:ElementType, atts:any):void { this.viewAdapter.setAttributes(el, atts); }
    createElement(tag:string, style?:any, clazz?:string, atts?:Map<string, string>):ElementType {
        return this.viewAdapter.createElement(tag, style, clazz, atts);
    }
    createElementNS(ns:string, tag:string, style?:Map<string, string>, clazz?:string, atts?:Map<string, string>):ElementType {
        return this.viewAdapter.createElementNS(ns, tag, style, clazz, atts);
    }

    appendElement(el:ElementType, parent?:any) {
        if (this.container) {
            (<any>this.container).appendChild(<any>el);
        }
        else if (!parent) {
            this.viewAdapter.appendToRoot(el);
        }
        else {
            (<any>this.getElement(parent)).appendChild(el);
        }
    }

    removeElement(el:ElementType) {
        this.getEventManager().remove(el);
        this.viewAdapter.removeElement(el);
    }

    /**
     * abstract method from EventGenerator
     * @returns {boolean}
     */
    shouldFireEvent():Boolean { return true; }

    getDefaultScope():string {
        return this.Defaults.Scope;
    }

// ------------------------------------ element positioning and management -----------------------------------------------

    private managedElements:Map<string, ManagedElement<EventType, ElementType>> = new Map();

    manage(id:string, element:ElementType, _transient?:Boolean):ManagedElement<EventType, ElementType> {
        if (!this.managedElements[id]) {
            this.managedElements[id] = {
                el: element,
                endpoints: [],
                connections: [],
                info:null
            };

            this.managedElements[id].info = this.updateOffset({ elId: id, timestamp: this.suspendedAt });
            if (!_transient) {
                this.fire("manageElement", { id:id, info:this.managedElements[id].info, el:element });
            }
        }

        return this.managedElements[id];
    };

    unmanage(id:string) {
        if (this.managedElements[id]) {
            delete this.managedElements[id];
            this.fire("unmanageElement", id);
        }
    }

    _ensureContainer(candidate:any) {
        if (!this.container && candidate) {
            let can = this.getElement(candidate);
            if ((<any>can).offsetParent) {
                this.setContainer((<any>can).offsetParent);
            }
        }
    };

    _getContainerFromDefaults() {
        if (this.Defaults.Container) {
            this.setContainer(this.Defaults.Container);
        }
    }

    elementInfo(el:any):any {
        if (el == null) {
            return null;
        }
        else if (el.nodeType === 3 || el.nodeType === 8) {
            return { el:el, text:true };
        }
        else {
            let _el = this.getElement(el);
            return { el: _el, id: (isString(el) && _el == null) ? el : this.getId(_el) };
        }
    }

    private offsetTimestamps:Map<string, number> = new Map();
    private offsets:Map<string, LeftTopLocation> = new Map();
    private sizes:Map<string, ArrayLocation> = new Map();
    updateOffset(params:any):OffsetInformation {
        params = params || {};
        let timestamp = params.timestamp, recalc = params.recalc, offset = params.offset, elId = params.elId, s;
        if (this.suspendDrawing && !timestamp) {
            timestamp = this.suspendedAt;
        }
        if (!recalc) {
            if (timestamp && timestamp === this.offsetTimestamps[elId]) {
                return {o: params.offset || this.offsets[elId], s: this.sizes[elId]};
            }
        }
        if (recalc || (!offset && this.offsets[elId] == null)) { // if forced repaint or no offset available, we recalculate.

            // get the current size and offset, and store them
            s = this.managedElements[elId] ? this.managedElements[elId].el : null;
            if (s != null) {
                this.sizes[elId] = this.getSize(s);
                this.offsets[elId] = this.getOffset(s);
                this.offsetTimestamps[elId] = timestamp;
            }
        } else {
            this.offsets[elId] = offset || this.offsets[elId];
            if (this.sizes[elId] == null) {
                s = this.managedElements[elId].el;
                if (s != null) {
                    this.sizes[elId] = this.getSize(s);
                }
            }
            this.offsetTimestamps[elId] = timestamp;
        }

        if (this.offsets[elId] && !this.offsets[elId].right) {
            this.offsets[elId].right = this.offsets[elId].left + this.sizes[elId][0];
            this.offsets[elId].bottom = this.offsets[elId].top + this.sizes[elId][1];
            this.offsets[elId].width = this.sizes[elId][0];
            this.offsets[elId].height = this.sizes[elId][1];
            this.offsets[elId].centerx = this.offsets[elId].left + (this.offsets[elId].width / 2);
            this.offsets[elId].centery = this.offsets[elId].top + (this.offsets[elId].height / 2);
        }

        return {o: this.offsets[elId], s: this.sizes[elId]};
    }

    getCachedData(elId:string) {
        let o = this.offsets[elId];
        if (!o) {
            return this.updateOffset({elId: elId});
        }
        else {
            return {o: o, s: this.sizes[elId]};
        }
    }

    // these are the default anchor positions finders, which are used by the makeTarget function.  supplying
    // a position finder argument to that function allows you to specify where the resulting anchor will
    // be located
    AnchorPositionFinders = {
        "Fixed": function (dp:LeftTopLocation, ep:LeftTopLocation, es:[number, number]) {
            return [ (dp.left - ep.left) / es[0], (dp.top - ep.top) / es[1] ];
        },
        "Grid": function (dp:LeftTopLocation, ep:LeftTopLocation, es:[number, number], params:any) {
            let dx = dp.left - ep.left, dy = dp.top - ep.top,
                gx = es[0] / (params.grid[0]), gy = es[1] / (params.grid[1]),
                mx = Math.floor(dx / gx), my = Math.floor(dy / gy);
            return [ ((mx * gx) + (gx / 2)) / es[0], ((my * gy) + (gy / 2)) / es[1] ];
        }
    };

// -------------------------------- / element positioning and management --------------------------------

// ---------------------------------------- connection and endpoint types ---------------------------------

    registerConnectionType(typeId: string, options: any):void {
        this._connectionTypes[typeId] = JsPlumb.extend({}, options);

        if (options.overlays) {
            let to = {};
            for (let i = 0; i < options.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = JsPlumbInstance.convertToFullOverlaySpec(options.overlays[i]);
                to[fo[1].id] = fo;
            }
            this._connectionTypes[typeId].overlays = to;
        }
    }

    registerConnectionTypes(types:any) {
        for (let i in types) {
            this.registerConnectionType(i, types[i]);
        }
    }

    registerEndpointType(id:string, type:any) {
        this._endpointTypes[id] = JsPlumb.extend({}, type);
        if (type.overlays) {
            let to = {};
            for (let i = 0; i < type.overlays.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = JsPlumbInstance.convertToFullOverlaySpec(type.overlays[i]);
                to[fo[1].id] = fo;
            }
            this._endpointTypes[id].overlays = to;
        }
    }

    registerEndpointTypes(types:any) {
        for (let i in types) {
            this.registerEndpointType(i, types[i]);
        }
    }

    getType(id:string, typeDescriptor:string) {
        return typeDescriptor === "connection" ? this._connectionTypes[id] : this._endpointTypes[id];
    }

    deriveEndpointAndAnchorSpec(type:string, dontPrependDefault?:Boolean) {
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

    public static convertToFullOverlaySpec(spec:any) {
        if (isString(spec)) {
            spec = [ spec, { } ];
        }
        spec[1].id = spec[1].id || uuid();
        return spec;
    }

// --------------------------------- / connection and endpoint types ---------------------------------------------

// ---------------------------------- selections, getConnections, getEndpoints -----------------------------------


    private listHelpers = {
        "prepare":(input:any, doNotGetIds?:Boolean) => {
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
                                r.push(this.elementInfo(input[i]).id);
                            }
                        }
                        else {
                            r.push(this.elementInfo(input).id);
                        }
                    }
                }
            }
            return r;
        },
        "filter":(list:any, value:any, missingIsFalse?:Boolean) => {
            if (list === "*") {
                return true;
            }
            return list.length > 0 ? list.indexOf(value) !== -1 : !missingIsFalse;
        }
    };

    select(params?:any) {
        params = params || {};
        params.scope = params.scope || "*";
        return this._makeConnectionSelectHandler(params.connections || this.getConnections(params, true));
    }

    connections:Array<Connection<EventType, ElementType>> = [];

    getConnections(options?:any, flat?:Boolean) {
        if (!options) {
            options = {};
        } else if (options.constructor === String) {
            options = { "scope": options };
        }
        let scope = options.scope || this.getDefaultScope(),
            scopes = this.listHelpers.prepare(scope, true),
            sources = this.listHelpers.prepare(options.source),
            targets = this.listHelpers.prepare(options.target),
            results:any = (!flat && scopes.length > 1) ? {} : [],
            _addOne = function (scope:string, obj:any) {
                if (!flat && scopes.length > 1) {
                    let ss = results[scope];
                    if (ss == null) {
                        ss = results[scope] = [];
                    }
                    ss.push(obj);
                } else {
                    results.push(obj);
                }
            };

        for (let j = 0, jj = this.connections.length; j < jj; j++) {
            let c = this.connections[j],
                sourceId = c.proxies && c.proxies[0] ? c.proxies[0].originalEp.elementId : c.sourceId,
                targetId = c.proxies && c.proxies[1] ? c.proxies[1].originalEp.elementId : c.targetId;

            if (this.listHelpers.filter(scopes, c.scope) && this.listHelpers.filter(sources, sourceId) && this.listHelpers.filter(targets, targetId)) {
                _addOne(c.scope, c);
            }
        }

        return results;
    }

    private _makeCommonSelectHandler(list:Array<any>/*, executor:Function*/) {
        let out = {
                length: list.length,
                each: curryEach(list/*, executor*/),
                get: curryGet(list)
            },
            setters = ["setHover", "removeAllOverlays", "setLabel", "addClass", "addOverlay", "removeOverlay",
                "removeOverlays", "showOverlay", "hideOverlay", "showOverlays", "hideOverlays", "setPaintStyle",
                "setHoverPaintStyle", "setSuspendEvents", "setParameter", "setParameters", "setVisible",
                "repaint", "addType", "toggleType", "removeType", "removeClass", "setType", "bind", "unbind" ],

            getters = ["getLabel", "getOverlay", "isHover", "getParameter", "getParameters", "getPaintStyle",
                "getHoverPaintStyle", "isVisible", "hasType", "getType", "isSuspendEvents" ],
            i, ii;

        for (i = 0, ii = setters.length; i < ii; i++) {
            out[setters[i]] = setter(list, setters[i]/*, executor*/);
        }

        for (i = 0, ii = getters.length; i < ii; i++) {
            out[getters[i]] = getter(list, getters[i]);
        }

        return out;
    }

    _makeConnectionSelectHandler = function(list:Array<any>) {
        let common = this._makeCommonSelectHandler(list/*, this._makeConnectionSelectHandler*/);
        return JsPlumb.extend(common, {
            // setters
            setDetachable: setter(list, "setDetachable"/*, this._makeConnectionSelectHandler*/),
            setReattach: setter(list, "setReattach"/*, this._makeConnectionSelectHandler*/),
            setConnector: setter(list, "setConnector"/*, this._makeConnectionSelectHandler*/),
            "delete": () => {
                for (let i = 0, ii = list.length; i < ii; i++) {
                    this.deleteConnection(list[i]);
                }
            },
            // getters
            isDetachable: getter(list, "isDetachable"),
            isReattach: getter(list, "isReattach")
        });
    };

    _makeEndpointSelectHandler = function(list:Array<any>) {
        let common = this._makeCommonSelectHandler(list/*, this._makeEndpointSelectHandler*/);
        return JsPlumb.extend(common, {
            setEnabled: setter(list, "setEnabled"/*, this._makeEndpointSelectHandler*/),
            setAnchor: setter(list, "setAnchor"/*, this._makeEndpointSelectHandler*/),
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
        });
    }

    protected endpointsByElement:Map<string, Array<Endpoint<EventType, ElementType>>> = new Map();

    selectEndpoints(params?:any) {
        params = params || {};
        params.scope = params.scope || "*";
        let noElementFilters = !params.element && !params.source && !params.target,
            elements = noElementFilters ? "*" : this.listHelpers.prepare(params.element),
            sources = noElementFilters ? "*" : this.listHelpers.prepare(params.source),
            targets = noElementFilters ? "*" : this.listHelpers.prepare(params.target),
            scopes = this.listHelpers.prepare(params.scope, true);

        let ep = [];

        for (let el in this.endpointsByElement) {
            let either = this.listHelpers.filter(elements, el, true),
                source = this.listHelpers.filter(sources, el, true),
                sourceMatchExact = sources !== "*",
                target = this.listHelpers.filter(targets, el, true),
                targetMatchExact = targets !== "*";

            // if they requested 'either' then just match scope. otherwise if they requested 'source' (not as a wildcard) then we have to match only endpoints that have isSource set to to true, and the same thing with isTarget.
            if (either || source || target) {
                for (let i = 0, ii = this.endpointsByElement[el].length; i < ii; i++) {
                    let _ep = this.endpointsByElement[el][i];
                    if (this.listHelpers.filter(scopes, _ep.scope, true)) {

                        let noMatchSource = (sourceMatchExact && sources.length > 0 && !_ep.isSource),
                            noMatchTarget = (targetMatchExact && targets.length > 0 && !_ep.isTarget);

                        if (noMatchSource || noMatchTarget) {
                            continue;
                        }

                        ep.push(_ep);
                    }
                }
            }
        }

        return this._makeEndpointSelectHandler(ep);
    };

    // get all connections managed by the instance of jsplumb.
    getAllConnections() {
        return this.connections;
    }

    getDefaultEndpointType() {
        return Endpoint;
    }

    // gets the default connection type. used when subclassing.  see wiki.
    getDefaultConnectionType() {
        return Connection;
    }

// ---------------------------------------------------- drawing suspension, batching etc  --------------------------------------

    private hoverSuspended:Boolean = false;
    setHoverSuspended(suspended:Boolean) {
        this.hoverSuspended = suspended;
    }
    isHoverSuspended():Boolean {
        return this.hoverSuspended;
    }

    private suspendedAt:number = null;
    private suspendDrawing:Boolean = false;
    isSuspendDrawing():Boolean {
        return this.suspendDrawing;
    }
    setSuspendDrawing(suspend:Boolean, repaintAfterwards?:Boolean):Boolean {

        let curVal = this.suspendDrawing;
        this.suspendDrawing = suspend;
        if (suspend) {
            this.suspendedAt = new Date().getTime();
        } else {
            this.suspendedAt = null;
        }
        if (repaintAfterwards) {
            this.repaintEverything();
        }
        return suspend;
    }
    getSuspendedAt() {
        return this.suspendedAt;
    }

    batch(fn:Function, doNotRepaintAfterwards?:Boolean):void {
        let _wasSuspended = this.isSuspendDrawing();
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

// ------------------------------------------------ zoom ------------------------------------------------------------
    private zoom:number = 1;
    setZoom (z:number, repaintEverything?:Boolean) {
        this.zoom = z;
        this.fire("zoom", z);
        if (repaintEverything) {
            this.repaintEverything();
        }
        return true;
    }

    getZoom () {
        return this.zoom;
    }

// ----------------------------------------------------- events ----------------------------------------

    getEventManager () {
        let e = (<any>this)._mottle;
        if (!e) {
            e = (<any>this)._mottle = new Mottle();
        }
        return e;
    }

    on(el:ElementType, evt:string, selector?:string, fn?:Function):JsPlumbInstance<EventType, ElementType> {
        // TODO: here we would like to map the tap event if we know its
        // an internal bind to a click. we have to know its internal because only
        // then can we be sure that the UP event wont be consumed (tap is a synthesized
        // event from a mousedown followed by a mouseup).
        //event = { "click":"tap", "dblclick":"dbltap"}[event] || event;
        this.getEventManager().on.apply(this, arguments);
        return this;
    }

    off(el:ElementType, evt:string, fn:Function):JsPlumbInstance<EventType, ElementType> {
        this.getEventManager().off.apply(this, arguments);
        return this;
    }

    fireDetachEvent(jpc:Connection<EventType, ElementType>, doFireEvent?:Boolean, originalEvent?:EventType) {
        // may have been given a connection, or in special cases, an object
        let connType = this.Defaults.ConnectionType || this.getDefaultConnectionType(),
            argIsConnection = jpc.constructor === connType,
            params = argIsConnection ? {
                connection: jpc,
                source: jpc.source, target: jpc.target,
                sourceId: jpc.sourceId, targetId: jpc.targetId,
                sourceEndpoint: jpc.endpoints[0], targetEndpoint: jpc.endpoints[1]
            } : jpc;

        if (doFireEvent) {
            this.fire("connectionDetached", params, originalEvent);
        }

        // always fire this. used by internal jsplumb stuff.
        this.fire("internal.connectionDetached", params, originalEvent);
    };

    fireMoveEvent(params:any, evt?:EventType) {
        this.fire("connectionMoved", params, evt);
    }

// ----------------------------------------------- painting/repainting ----------------------------------------------


    /**
     * not implemented in the core; implemented by the DOM extension.
     * @param id
     */
    getDescendantElements(id:string):any {}

    private _elEach(el:any, fn:Function) {
        // support both lists...
        if (typeof el === 'object' && el.length) {
            for (let i = 0, ii = el.length; i < ii; i++) {
                fn(el[i]);
            }
        }
        else {// ...and single strings or elements.
            fn(el);
        }

        return this;
    };

    _draw(element:any, ui?:any, timestamp?:string, clearEdits?:Boolean) {

        if (!this.suspendDrawing) {
            let id = this.getId(element),
                repaintEls = this.getDescendantElements(id);

            if (timestamp == null) {
                timestamp = _timestamp();
            }

            // update the offset of everything _before_ we try to draw anything.
            let o = this.updateOffset({ elId: id, offset: ui, recalc: false, timestamp: timestamp });

            if (repaintEls && o && o.o) {
                for (let i in repaintEls) {
                    this.updateOffset({
                        elId: repaintEls[i].id,
                        offset: {
                            left: o.o.left + repaintEls[i].offset.left,
                            top: o.o.top + repaintEls[i].offset.top
                        },
                        recalc: false,
                        timestamp: timestamp
                    });
                }
            }

            //_currentInstance.anchorManager.redraw(id, ui, timestamp, null, clearEdits);
            this.fire("internal:redraw", {
                id:id,
                ui:ui,
                timestamp:timestamp,
                uiOffset:null,
                clearEdits:clearEdits
            });

            for (let j in repaintEls) {
                //_currentInstance.anchorManager.redraw(repaintEls[j].id, ui, timestamp, repaintEls[j].offset, clearEdits, true);

                this.fire("internal:redraw", {
                    id:repaintEls[j].id,
                    ui:ui,
                    timestamp:timestamp,
                    uiOffset:repaintEls[j].offset,
                    clearEdits:clearEdits
                });
            }
        }
    }

    // repaint some element's endpoints and connections
    repaint(el:any, ui?:any, timestamp?:string) {
        return this._elEach(el, function(_el:any) {
            this._draw(_el, ui, timestamp);
        });
    };

    revalidate(el:any, timestamp?:string, isIdAlready?:Boolean) {
        return this._elEach(el, function(_el:any) {
            let elId = isIdAlready ? _el : this.getId(_el);
            this.updateOffset({ elId: elId, recalc: true, timestamp:timestamp });

            this.fire("internal:revalidate", elId);

            this.repaint(_el);
        });
    };

    // repaint every endpoint and connection.
    repaintEverything() {
        // TODO this timestamp causes continuous anchors to not repaint properly.
        // fix this. do not just take out the timestamp. it runs a lot faster with
        // the timestamp included.
        let timestamp = _timestamp(), elId;

        for (elId in this.endpointsByElement) {
            this.updateOffset({ elId: elId, recalc: true, timestamp: timestamp });
        }

        for (elId in this.endpointsByElement) {
            this._draw(elId, null, timestamp);
        }

        return this;
    };


// ----------------------------------------------- mapping from internal to external --------------------------------


    getId(element:any, uuid?:string, doNotCreateIfNotFound?:Boolean) {
        if (isString(element)) {
            return element;
        }
        if (element == null) {
            return null;
        }
        let id = this.getAttribute(element, "id");
        if (!id || id === "undefined") {
            // check if fixed uuid parameter is given
            if (arguments.length === 2 && arguments[1] !== undefined) {
                id = uuid;
            }
            else if (arguments.length === 1 || (arguments.length === 3 && !arguments[2])) {
                id = "jsPlumb_" + this._instanceIndex + "_" + this._idstamp();
            }

            if (!doNotCreateIfNotFound) {
                this.viewAdapter.setAttribute(element, "id", id);
            }
        }
        return id;
    }


    getElement(el:any):ElementType {
        if (el == null) {
            return null;
        }
        // here we pluck the first entry if el was a list of entries.
        // this is not my favourite thing to do, but previous versions of
        // jsplumb supported jquery selectors, and it is possible a selector
        // will be passed in here.
        el = typeof el === "string" ? el : el.length != null && el.enctype == null ? el[0] : el;
        return typeof el === "string" ? document.getElementById(el) : el;
    }

    // TODO use type guards
    each(spec:any | Array<any>, fn:Function) {
        if (spec == null) {
            return;
        }
        if (typeof spec === "string") {
            fn(this.getElement(spec));
        }
        else if (spec.length != null) {
            for (let i = 0; i < spec.length; i++) {
                fn(this.getElement(spec[i]));
            }
        }
        else {
            fn(spec);
        } // assume it's an element.
    }

// ------------------------------------------- housekeeping ----------------------------------------------------

    deleteObject(params:any) {
        let result:any = {
                endpoints: {},
                connections: {},
                endpointCount: 0,
                connectionCount: 0
            },
            deleteAttachedObjects = params.deleteAttachedObjects !== false;

        let unravelConnection = function (connection:Connection<EventType, ElementType>) {
            if (connection != null && result.connections[connection.id] == null) {
                if (!params.dontUpdateHover && connection._jsPlumb != null) {
                    connection.setHover(false);
                }
                result.connections[connection.id] = connection;
                result.connectionCount++;
            }
        };

        let unravelEndpoint = function (endpoint:Endpoint<EventType, ElementType>) {
            if (endpoint != null && result.endpoints[endpoint.id] == null) {
                if (!params.dontUpdateHover && endpoint._jsPlumb != null) {
                    endpoint.setHover(false);
                }
                result.endpoints[endpoint.id] = endpoint;
                result.endpointCount++;

                if (deleteAttachedObjects) {
                    for (let i = 0; i < endpoint.connections.length; i++) {
                        unravelConnection(endpoint.connections[i]);
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
                removeWithFunction(this.connections, function (_c:Connection<EventType, ElementType>) {
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

// ----------------------------------------------- endpoints --------------------------------------------------------

    protected _newEndpoint(params:any, id?:string) {
        let endpointFunc = this.Defaults.EndpointType || Endpoint;
        let _p = JsPlumb.extend({}, params);
        _p._jsPlumb = this;
        _p.newConnection = this._newConnection;
        _p.newEndpoint = this._newEndpoint;
        _p.endpointsByUUID = this.endpointsByUUID;
        _p.endpointsByElement = this.endpointsByElement;
        _p.fireDetachEvent = this.fireDetachEvent;
        _p.elementId = id || this.getId(_p.source);
        let ep = new endpointFunc(_p);
        ep.id = "ep_" + this._idstamp();
        this.manage(_p.elementId, _p.source);

        this.fire("internal:addEndpoint", {
            source:_p.source,
            id:id
        });

        return ep;
    }


    endpointsByUUID:Map<string, Endpoint<EventType, ElementType>> = new Map();
    addEndpoint(el:any, params?:EndpointParams<EventType, ElementType>, referenceParams?:EndpointParams<EventType, ElementType>): Endpoint<EventType, ElementType> | Array<Endpoint<EventType, ElementType>> {
        referenceParams = referenceParams || {};

        let p = JsPlumb.extend({}, referenceParams);
        JsPlumb.extend(p, params);

        p.endpoint = p.endpoint || this.Defaults.Endpoint;
        p.paintStyle = p.paintStyle || this.Defaults.EndpointStyle;

        let results = [],
            inputs = (isArray(el) || (el.length != null && !isString(el))) ? el : [ el ];

        for (let i = 0, j = inputs.length; i < j; i++) {
            p.source = this.getElement(inputs[i]);
            this._ensureContainer(p.source);

            let id = this.getId(p.source), e = this._newEndpoint(p, id);

            // ensure element is managed.
            let myOffset = this.manage(id, p.source).info.o;
            addToList(this.endpointsByElement, id, e);

            if (!this.suspendDrawing) {
                e.paint({
                    anchorLoc: e.anchor.compute({ xy: [ myOffset.left, myOffset.top ], wh: this.sizes[id], element: e, timestamp: this.suspendedAt }),
                    timestamp: this.suspendedAt
                });
            }

            results.push(e);
        }

        return results.length === 1 ? results[0] : results;
    }

    deleteEndpoint(object:any, dontUpdateHover?:Boolean, deleteAttachedObjects?:Boolean):JsPlumbInstance<EventType, ElementType> {
        let endpoint = (typeof object === "string") ? this.endpointsByUUID[object] : object;
        if (endpoint) {
            this.deleteObject({ endpoint: endpoint, dontUpdateHover: dontUpdateHover, deleteAttachedObjects:deleteAttachedObjects });
        }
        return this;
    }

    deleteEveryEndpoint() {
        let _is = this.setSuspendDrawing(true);
        for (let id in this.endpointsByElement) {
            let endpoints = this.endpointsByElement[id];
            if (endpoints && endpoints.length) {
                for (let i = 0, j = endpoints.length; i < j; i++) {
                    this.deleteEndpoint(endpoints[i], true);
                }
            }
        }
        this.endpointsByElement.clear();
        this.managedElements.clear();
        this.endpointsByUUID.clear();
        this.offsets.clear();
        this.offsetTimestamps.clear();

        this.fire("reset");


        if (!_is) {
            this.setSuspendDrawing(false);
        }
        return this;
    }

    unregisterEndpoint(endpoint:Endpoint<EventType, ElementType>) {
        if (endpoint._jsPlumb.uuid) {
            this.endpointsByUUID[endpoint._jsPlumb.uuid] = null;
        }

        this.fire("internal:deleteEndpoint", endpoint);

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

// ----------------------------- connections

    IS_DETACH_ALLOWED = "isDetachAllowed";
    BEFORE_DETACH = "beforeDetach";
    CHECK_CONDITION = "checkCondition";

    _scopeMatch(e1:Endpoint<EventType, ElementType>, e2:Endpoint<EventType, ElementType>) {
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

    checkCondition(conditionName:string, args?:any) {
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

    _prepareConnectionParams(params:any, referenceParams?:any) {
        let _p = JsPlumb.extend({ }, params);
        if (referenceParams) {
            JsPlumb.extend(_p, referenceParams);
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
            _p.sourceEndpoint = this.endpointsByUUID[params.uuids[0]];
            _p.targetEndpoint = this.endpointsByUUID[params.uuids[1]];
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

        let _addEndpoint = function (el:any, def:any, idx:number) {
            return this.addEndpoint(el, this._mergeOverrides(def, {
                anchor: _p.anchors ? _p.anchors[idx] : _p.anchor,
                endpoint: _p.endpoints ? _p.endpoints[idx] : _p.endpoint,
                paintStyle: _p.endpointStyles ? _p.endpointStyles[idx] : _p.endpointStyle,
                hoverPaintStyle: _p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle
            }));
        };

        // check for makeSource/makeTarget specs.

        let _oneElementDef = function (type:string, idx:number, defs?:any, matchType?:string) {
            if (_p[type] && !_p[type].endpoint && !_p[type + "Endpoint"] && !_p.newConnection) {
                let tid = this.getId(_p[type]), tep = defs[tid];

                tep = tep ? tep[matchType] : null;

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
                            newEndpoint.setDeleteOnEmpty(false);
                        }
                        else {
                            newEndpoint.finalEndpoint = tep.endpoint;
                        }
                    } else {
                        newEndpoint.setDeleteOnEmpty(true);
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
            if (!this._scopeMatch(_p.sourceEndpoint, _p.targetEndpoint)) {
                _p = null;
            }
        }

        return _p;
    }

    _newConnection = function (params:any):Connection<EventType, ElementType> {
        let connectionFunc = this.Defaults.ConnectionType || this.getDefaultConnectionType();

        params._jsPlumb = this;
        params.newConnection = this._newConnection;
        params.newEndpoint = this._newEndpoint;
        params.endpointsByUUID = this.endpointsByUUID;
        params.endpointsByElement = this.endpointsByElement;
        params.finaliseConnection = this._finaliseConnection;
        params.id = "con_" + this._idstamp();
        let con:Connection<EventType, ElementType> = new connectionFunc(params);

        // SP moved this to Endpoint. trying to contain the drag knowledge.
        // if the connection is draggable, then maybe we need to tell the target endpoint to init the
        // dragging code. it won't run again if it already configured to be draggable.
        if (con.isDetachable()) {
            // con.endpoints[0].initDraggable("_jsPlumbSource");
            // con.endpoints[1].initDraggable("_jsPlumbTarget");
        }

        return con;
    }

    //
    // adds the connection to the backing model, fires an event if necessary and then redraws
    //
    _finaliseConnection(jpc:Connection<EventType, ElementType>, params:any, originalEvent?:EventType, doInformAnchorManager?:Boolean) {
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
            this.fire("internal:newConnection", jpc)
        }

        // force a paint
        this._draw(jpc.source);

        // fire an event
        if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {

            let eventArgs:any = {
                connection: jpc,
                source: jpc.source, target: jpc.target,
                sourceId: jpc.sourceId, targetId: jpc.targetId,
                sourceEndpoint: jpc.endpoints[0], targetEndpoint: jpc.endpoints[1]
            };

            this.fire("connection", eventArgs, originalEvent);
        }
    }

    connect(params:any, referenceParams?:any) {
        // prepare a final set of parameters to create connection with
        let _p = this._prepareConnectionParams(params, referenceParams), jpc;
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
            this._ensureContainer(_p.source);
            // create the connection.  it is not yet registered
            jpc = this._newConnection(_p);
            // now add it the model, fire an event, and redraw
            this._finaliseConnection(jpc, _p);
        }
        return jpc;
    }

    deleteConnection(connection:Connection<EventType, ElementType>, params?:any) {

        if (connection != null) {
            params = params || {};

            if (params.force || functionChain(true, false, [
                    [ connection.endpoints[0], this.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection.endpoints[1], this.IS_DETACH_ALLOWED, [ connection ] ],
                    [ connection, this.IS_DETACH_ALLOWED, [ connection ] ],
                    [ this, this.CHECK_CONDITION, [ this.BEFORE_DETACH, connection ] ]
                ])) {

                connection.setHover(false);
                this.fireDetachEvent(connection, !connection.pending && params.fireEvent !== false, params.originalEvent);

                connection.endpoints[0].detachFromConnection(connection);
                connection.endpoints[1].detachFromConnection(connection);
                removeWithFunction(this.connections, function (_c:Connection<EventType, ElementType>) {
                    return connection.id === _c.id;
                });

                connection.cleanup();
                connection.destroy();
                return true;
            }
        }
        return false;
    }

    _stTypes = [
        { el: "source", elId: "sourceId", epDefs: "sourceEndpointDefinitions" },
        { el: "target", elId: "targetId", epDefs: "targetEndpointDefinitions" }
    ];

    _set(c:any, el:any, idx:number, doNotRepaint?:Boolean) {
        let ep, _st = this._stTypes[idx], cId = c[_st.elId], cEl = c[_st.el], sid, sep,
            oldEndpoint = c.endpoints[idx];

        let evtParams:any = {
            index: idx,
            originalSourceId: idx === 0 ? cId : c.sourceId,
            newSourceId: c.sourceId,
            originalTargetId: idx === 1 ? cId : c.targetId,
            newTargetId: c.targetId,
            connection: c
        };

        if (el.constructor === Endpoint) {
            ep = el;
            ep.addConnection(c);
            el = ep.element;
        }
        else {
            sid = this.getId(el);
            sep = this[_st.epDefs][sid];

            if (sid === c[_st.elId]) {
                ep = null; // dont change source/target if the element is already the one given.
            }
            else if (sep) {
                for (let t in sep) {
                    if (!sep[t].enabled) {
                        return;
                    }
                    ep = sep[t].endpoint != null && sep[t].endpoint._jsPlumb ? sep[t].endpoint : this.addEndpoint(el, sep[t].def);
                    if (sep[t].uniqueEndpoint) {
                        sep[t].endpoint = ep;
                    }
                    ep.addConnection(c);
                }
            }
            else {
                ep = c.makeEndpoint(idx === 0, el, sid);
            }
        }

        if (ep != null) {
            oldEndpoint.detachFromConnection(c);
            c.endpoints[idx] = ep;
            c[_st.el] = ep.element;
            c[_st.elId] = ep.elementId;
            evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId;

            this.fireMoveEvent(evtParams);

            if (!doNotRepaint) {
                c.repaint();
            }
        }

        evtParams.element = el;
        return evtParams;

    }

    setSource(connection:Connection<EventType, ElementType>, el:any, doNotRepaint?:Boolean) {
        let p = this._set(connection, el, 0, doNotRepaint);
        this.fire("internal:sourceChanged", {
            previous:p.originalSourceId,
            current:p.newSourceId,
            connection:connection,
            el:p.el
        });
    }

    setTarget(connection:Connection<EventType, ElementType>, el:any, doNotRepaint?:Boolean) {
        let p = this._set(connection, el, 1, doNotRepaint);
        this.fire("internal:targetChanged", p);
    }

}



export class JsPlumb {

    static _jsPlumbInstanceIndex:number = 0;

    static getInstanceIndex() {
        let i = JsPlumb._jsPlumbInstanceIndex + 1;
        JsPlumb._jsPlumbInstanceIndex++;
        return i;
    };

    static extend(a:any, b:any, names?:Array<string>):any {
        let i;
        if (names) {
            for (i = 0; i < names.length; i++) {
                a[names[i]] = b[names[i]];
            }
        }
        else {
            for (i in b) {
                a[i] = b[i];
            }
        }

        return a;
    }

    // static newInstance(options:any):JsPlumbInstance {
    //     return new JsPlumbInstance(options)
    // }

    // static addClass(el:RawElement, clazz:string) {
    //
    // }
    //
    // static removeClass(el:RawElement, clazz:string) {
    //
    // }
    //
}
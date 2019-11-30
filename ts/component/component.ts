import {PaintStyle} from "../styles";
import {extend, _timestamp, Dictionary, jsPlumbInstance, Timestamp, TypeDescriptor, PointArray, PointXY} from "../core";
import {log, merge, populate} from "../util";
import {EventGenerator} from "../event-generator";
import {Connection} from "../connector/connection-impl";
import {Endpoint} from "../endpoint/endpoint-impl";
import {Overlay, OverlaySpec} from "../overlay/overlay";
import {EndpointSpec} from "../endpoint";
import {ConnectorSpec} from "../connector";

declare const jsPlumbUtil:any;

export type ComponentConfig<E> = {
    paintStyle?:PaintStyle;
    hoverPaintStyle?:PaintStyle;
    types:string[];
    instance:jsPlumbInstance<E>;
    paintStyleInUse?:PaintStyle;

    cssClass?:string;
    hoverClass?:string;

    parameters:ComponentParameters;
    typeCache:{};

    overlays?:Dictionary<Overlay<E>>;
    overlayPlacements?: Dictionary<any>;
    overlayPositions?:Dictionary<PointArray>

    hover?: boolean;
    beforeDetach?:Function;
    beforeDrop?:Function;

    params?:any;
    lastPaintedAt?:string;

    directed?:boolean;
    cost?:number;
    connectionCost?:number;
    connectionsDirected?:boolean;

    visible?:boolean;

    detachable?:boolean;
    reattach?:boolean;
    maxConnections?:number;

    uuids?:[string, string];

    endpoint?:EndpointSpec;
    endpoints?:[EndpointSpec, EndpointSpec];
    endpointStyle?:PaintStyle;
    endpointHoverStyle?:PaintStyle;
    endpointStyles?:[PaintStyle, PaintStyle];
    endpointHoverStyles?:[PaintStyle, PaintStyle];


    enabled?:boolean;

    currentAnchorClass?:string;

    uuid?:string;

    floatingEndpoint?:Endpoint<E>;

    events?:any;

    connectorStyle?:PaintStyle;
    connectorHoverStyle?:PaintStyle;

    connector?:ConnectorSpec;
    connectorOverlays?:Array<OverlaySpec>;

    scope?:string;

}

export type ComponentParameters = Dictionary<any>;

function  _updateAttachedElements<E> (component:Component<E>, state:boolean, timestamp?:Timestamp, sourceElement?:any) {
    let affectedElements = component.getAttachedElements();
    if (affectedElements) {
        for (let i = 0, j = affectedElements.length; i < j; i++) {
            if (!sourceElement || sourceElement !== affectedElements[i]) {
                affectedElements[i].setHover(state, true, timestamp);			// tell the attached elements not to inform their own attached elements.
            }
        }
    }
}

function _splitType (t:string):string[] {
    return t == null ? null : t.split(" ");
}

function _mapType (map:any, obj:any, typeId:string) {
    for (let i in obj) {
        map[i] = typeId;
    }
}

function _applyTypes<E>(component:Component<E>, params?:any, doNotRepaint?:boolean) {
    if (component.getDefaultType) {
        let td = component.getTypeDescriptor(), map = {};
        let defType = component.getDefaultType();
        let o = merge({}, defType);
        _mapType(map, defType, "__default");
        for (let i = 0, j = component._jsPlumb.types.length; i < j; i++) {
            let tid = component._jsPlumb.types[i];
            if (tid !== "__default") {
                let _t = component._jsPlumb.instance.getType(tid, td);
                if (_t != null) {
                    o = merge(o, _t, [ "cssClass" ], [ "connector" ]);
                    _mapType(map, _t, tid);
                }
            }
        }

        if (params) {
            o = populate(o, params, "_");
        }

        component.applyType(o, doNotRepaint, map);
        if (!doNotRepaint) {
            component.repaint();
        }
    }
}

export function _removeTypeCssHelper<E>(component:Component<E>, typeIndex:number) {
    let typeId = component._jsPlumb.types[typeIndex],
        type = component._jsPlumb.instance.getType(typeId, component.getTypeDescriptor());

     if (type != null && type.cssClass) {
        component.removeClass(type.cssClass);
    }
}

// helper method to update the hover style whenever it, or paintStyle, changes.
// we use paintStyle as the foundation and merge hoverPaintStyle over the
// top.
export function  _updateHoverStyle<E> (component:Component<E>) {
    if (component._jsPlumb.paintStyle && component._jsPlumb.hoverPaintStyle) {
        let mergedHoverStyle:PaintStyle = {};
        extend(mergedHoverStyle, component._jsPlumb.paintStyle);
        extend(mergedHoverStyle, component._jsPlumb.hoverPaintStyle);
        delete component._jsPlumb.hoverPaintStyle;
        // we want the fill of paintStyle to override a gradient, if possible.
        if (mergedHoverStyle.gradient && component._jsPlumb.paintStyle.fill) {
            delete mergedHoverStyle.gradient;
        }
        component._jsPlumb.hoverPaintStyle = mergedHoverStyle;
    }
}

export type RepaintOptions = {
    timestamp?:Timestamp;
    recalc?:boolean;
}

export interface ComponentOptions<E> {
    _jsPlumb?:jsPlumbInstance<E>;
    parameters?:any;
    beforeDetach?:Function;
    beforeDrop?:Function;
    hoverClass?:string;
    overlays?:Array<OverlaySpec>;
    events?:Dictionary<Function>;
    scope?:string;
    cssClass?:string;
}

export abstract class Component<E> extends EventGenerator {

    abstract getTypeDescriptor():string;
    abstract getDefaultOverlayKeys():Array<string>;
    abstract getAttachedElements():Array<Component<E>>;
    abstract getIdPrefix():string;
    abstract getXY():PointXY;

    clone: ()=>Component<E>;

    segment?:number;
    x:number;
    y:number;
    w:number;
    h:number;
    id:string;
    
    typeId:string;

    protected displayElements:Array<E> = [];
    overlayPlacements:Array<any> = [];
    paintStyle:PaintStyle;
    hoverPaintStyle:PaintStyle;
    domListeners:Array<any> = [];
    paintStyleInUse:PaintStyle;

    data:any;

    _defaultType:any;

    _jsPlumb:ComponentConfig<E>;

    cssClass:string;

    constructor(protected instance:jsPlumbInstance<E>, params?:ComponentOptions<E>) {

        super();

        params = params || ({} as ComponentOptions<E>);

        this.cssClass = params.cssClass || "";

        this._jsPlumb = {
            instance: instance,
            parameters: params.parameters || {},
            paintStyle: null,
            hoverPaintStyle: null,
            paintStyleInUse: null,
            hover: false,
            beforeDetach: params.beforeDetach,
            beforeDrop: params.beforeDrop,
            overlayPlacements: [],
            hoverClass: params.hoverClass || instance.Defaults.hoverClass,
            types: [],
            typeCache:{},
            visible:true
        };

        this.id = this.getIdPrefix() + (new Date()).getTime();

        let o = params.overlays || [], oo = {};
        let defaultOverlayKeys = this.getDefaultOverlayKeys();
        if (defaultOverlayKeys) {
            for (let i = 0; i < defaultOverlayKeys.length; i++) {
                Array.prototype.push.apply(o, this.instance.Defaults[defaultOverlayKeys[i]] || []);
            }

            for (let i = 0; i < o.length; i++) {
                // if a string, convert to object representation so that we can store the typeid on it.
                // also assign an id.
                let fo = this.instance.convertToFullOverlaySpec(o[i]);
                oo[fo[1].id] = fo;
            }
        }

        this._defaultType = {
            overlays:oo,
            parameters: params.parameters || {},
            scope: params.scope || this.instance.getDefaultScope()
        };

        if (params.events) {
            for (let evtName in params.events) {
                this.bind(evtName, params.events[evtName]);
            }
        }

        this.clone = ():Component<E> => {
            let o = Object.create(this.constructor.prototype);
            this.constructor.apply(o, [instance, params]);
            return o;
        };

    }

    setListenerComponent (c:any) {
        for (let i = 0; i < this.domListeners.length; i++) {
            this.domListeners[i][3] = c;
        }
    }

    isDetachAllowed(connection:Connection<E>):boolean {
        let r = true;
        if (this._jsPlumb.beforeDetach) {
            try {
                r = this._jsPlumb.beforeDetach(connection);
            }
            catch (e) {
                log("jsPlumb: beforeDetach callback failed", e);
            }
        }
        return r;
    }

    isDropAllowed(sourceId:string, targetId:string, scope:string, connection:Connection<E>, dropEndpoint:Endpoint<E>, source?:E, target?:E):any {
        let r = this._jsPlumb.instance.checkCondition("beforeDrop", {
            sourceId: sourceId,
            targetId: targetId,
            scope: scope,
            connection: connection,
            dropEndpoint: dropEndpoint,
            source: source, target: target
        });
        if (this._jsPlumb.beforeDrop) {
            try {
                r = this._jsPlumb.beforeDrop({
                    sourceId: sourceId,
                    targetId: targetId,
                    scope: scope,
                    connection: connection,
                    dropEndpoint: dropEndpoint,
                    source: source, target: target
                });
            }
            catch (e) {
                log("jsPlumb: beforeDrop callback failed", e);
            }
        }
        return r;
    }

    getDefaultType():TypeDescriptor {
        return this._defaultType;
    }

    appendToDefaultType (obj:any) {
        for (let i in obj) {
            this._defaultType[i] = obj[i];
        }
    }

    // clone ():Component<E> {
    //     let o = Object.create(this.constructor.prototype);
    //     this.constructor.apply(o, a);
    //     return o;
    // }

    getId():string { return this.id; }

    cacheTypeItem(key:string, item:any, typeId:string) {
        this._jsPlumb.typeCache[typeId] = this._jsPlumb.typeCache[typeId] || {};
        this._jsPlumb.typeCache[typeId][key] = item;
    }

    getCachedTypeItem (key:string, typeId:string):any {
        return this._jsPlumb.typeCache[typeId] ? this._jsPlumb.typeCache[typeId][key] : null;
    }

    getDisplayElements() {
        return this.displayElements;
    }

    appendDisplayElement (el:E) {
        this.displayElements.push(el);
    };

    setType(typeId:string, params?:any, doNotRepaint?:boolean) {
        this.clearTypes();
        this._jsPlumb.types = _splitType(typeId) || [];
        _applyTypes(this, params, doNotRepaint);
    }

    getType():string[] {
        return this._jsPlumb.types;
    }

    reapplyTypes(params?:any, doNotRepaint?:boolean) {
        _applyTypes(this, params, doNotRepaint);
    }

    hasType(typeId:string):boolean {
        return this._jsPlumb.types.indexOf(typeId) !== -1;
    }

    addType(typeId:string, params?:any, doNotRepaint?:boolean):void {
        let t = _splitType(typeId), _cont = false;
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                if (!this.hasType(t[i])) {
                    this._jsPlumb.types.push(t[i]);
                    _cont = true;
                }
            }
            if (_cont) {
                _applyTypes(this, params, doNotRepaint);
            }
        }
    }

    removeType(typeId:string, params?:any, doNotRepaint?:boolean) {
        let t = _splitType(typeId), _cont = false, _one = function (tt:string) {
            let idx = this._jsPlumb.types.indexOf(tt);
            if (idx !== -1) {
                // remove css class if necessary
                _removeTypeCssHelper(this, idx);
                this._jsPlumb.types.splice(idx, 1);
                return true;
            }
            return false;
        }.bind(this);

        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                _cont = _one(t[i]) || _cont;
            }
            if (_cont) {
                _applyTypes(this, params, doNotRepaint);
            }
        }
    }

    clearTypes(params?:any, doNotRepaint?:boolean):void {
        let i = this._jsPlumb.types.length;
        for (let j = 0; j < i; j++) {
            _removeTypeCssHelper(this, 0);
            this._jsPlumb.types.splice(0, 1);
        }
        _applyTypes(this, params, doNotRepaint);
    }

    toggleType(typeId:string, params?:any, doNotRepaint?:boolean) {
        let t = _splitType(typeId);
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                let idx = this._jsPlumb.types.indexOf(t[i]);
                if (idx !== -1) {
                    _removeTypeCssHelper(this, idx);
                    this._jsPlumb.types.splice(idx, 1);
                }
                else {
                    this._jsPlumb.types.push(t[i]);
                }
            }

            _applyTypes(this, params, doNotRepaint);
        }
    }

    applyType(t:TypeDescriptor, doNotRepaint?:boolean, params?:any):void {
        this.setPaintStyle(t.paintStyle, doNotRepaint);
        this.setHoverPaintStyle(t.hoverPaintStyle, doNotRepaint);
        if (t.parameters) {
            for (let i in t.parameters) {
                this.setParameter(i, t.parameters[i]);
            }
        }
        this._jsPlumb.paintStyleInUse = this.getPaintStyle();
    }

    setPaintStyle(style:PaintStyle, doNotRepaint?:boolean):void {

        this._jsPlumb.paintStyle = style;
        this._jsPlumb.paintStyleInUse = this._jsPlumb.paintStyle;
        _updateHoverStyle(this);
        if (!doNotRepaint) {
            this.repaint();
        }
    }

    getPaintStyle():PaintStyle {
        return this._jsPlumb.paintStyle;
    }

    setHoverPaintStyle(style:PaintStyle, doNotRepaint?:boolean) {
        this._jsPlumb.hoverPaintStyle = style;
        _updateHoverStyle(this);
        if (!doNotRepaint) {
            this.repaint();
        }
    }

    getHoverPaintStyle():PaintStyle {
        return this._jsPlumb.hoverPaintStyle;
    }

    cleanup(force?:boolean):void {

    }

    destroy(force?:boolean):void {
        if (force || this.typeId == null) {
            this.cleanupListeners(); // this is on EventGenerator
            this.clone = null;
            this._jsPlumb = null;
        }
    }

    isHover():boolean {
        return this._jsPlumb.hover;
    }

    setHover(hover:boolean, ignoreAttachedElements?:boolean, timestamp?:Timestamp):void {
        // while dragging, we ignore these events.  this keeps the UI from flashing and
        // swishing and whatevering.
        if (this._jsPlumb && !this._jsPlumb.instance.currentlyDragging && !this._jsPlumb.instance.isHoverSuspended()) {

            this._jsPlumb.hover = hover;
            let method = hover ? "addClass" : "removeClass";

            // if (this.canvas != null) {
            //     if (this._jsPlumb.instance.hoverClass != null) {
            //         this._jsPlumb.instance[method](this.canvas, this._jsPlumb.instance.hoverClass);
            //     }
            //     if (this._jsPlumb.hoverClass != null) {
            //         this._jsPlumb.instance[method](this.canvas, this._jsPlumb.hoverClass);
            //     }
            // }

            if (this._jsPlumb.hoverPaintStyle != null) {
                this._jsPlumb.paintStyleInUse = hover ? this._jsPlumb.hoverPaintStyle : this._jsPlumb.paintStyle;
                if (!this._jsPlumb.instance.isSuspendDrawing()) {
                    timestamp = timestamp || _timestamp();
                    this.repaint({timestamp: timestamp, recalc: false});
                }
            }
            // get the list of other affected elements, if supported by this component.
            // for a connection, its the endpoints.  for an endpoint, its the connections! surprise.
            if (this.getAttachedElements && !ignoreAttachedElements) {
                _updateAttachedElements(this, hover, _timestamp(), this);
            }
        }
    }

    getParameter(name:string):any {
        return this._jsPlumb.parameters[name];
    }

    setParameter(name:string, value:any) {
        this._jsPlumb.parameters[name] = value;
    }

    getParameters():ComponentParameters {
        return this._jsPlumb.parameters;
    }

    setParameters(p:ComponentParameters) {
        this._jsPlumb.parameters = p;
    }

    reattach<E>(instance:jsPlumbInstance<E>) {

    }

    setVisible(v:boolean) {
        this._jsPlumb.visible = v;
    }

    isVisible():boolean {
        return this._jsPlumb.visible;
    }

    addClass(clazz:string, dontUpdateOverlays?:boolean):void {
        let parts = (this._jsPlumb.cssClass || "").split(" ");
        parts.push(clazz);
        this._jsPlumb.cssClass = parts.join(" ");
    }

    removeClass(clazz:string, dontUpdateOverlays?:boolean):void {
        let parts = (this._jsPlumb.cssClass || "").split(" ");
        this._jsPlumb.cssClass = parts.filter((p) => p !== clazz).join(" ");
    }

    getClass() : string {
        return this._jsPlumb.cssClass;
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true;
    }

    repaint(options?:RepaintOptions):void {
        this.instance.renderer.repaint(this, this.getTypeDescriptor(), options);
    }

    getData () { return this.data; };
    setData (d:any) { this.data = d || {}; };
    mergeData (d:any) { this.data = extend(this.data, d); };
}

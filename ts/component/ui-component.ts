import {EventGenerator} from "../event/event-generator";
import {JsPlumb, JsPlumbInstance} from "../core";

import {_timestamp, log} from "../util";
import {Types} from "../types";
export type Point = { x:number, y:number };

export type ComponentParams<EventType, ElementType> = {
    _jsPlumb:JsPlumbInstance<EventType, ElementType>,
    parameters?:any,
    beforeDetach?:Function,
    beforeDrop?:Function,
    hoverClass?:string,
    overlays?:any,
    scope?:string,
    events?:Map<string, Function>,
    label?:string,
    labelStyle?:string,
    labelLocation?:number
}

export abstract class UIComponent<EventType, ElementType> extends EventGenerator<EventType> {

    abstract idPrefix:string;

    _jsPlumb:any;
    id:string;

    private domListeners:Array<any> = [];
    private _defaultType:any;

    canvas:ElementType;
    bgCanvas:ElementType;

    typeId:string = null;
    w:number;
    h:number;
    x:number;
    y:number;
    visible:Boolean = true;

    instance:JsPlumbInstance<EventType, ElementType>;

    constructorArguments:IArguments;

    constructor(params:ComponentParams<EventType, ElementType>) {
        super();

        this.constructorArguments = arguments;

        this.id = this.idPrefix + (new Date()).getTime();
        this.instance = params._jsPlumb;

        this._jsPlumb = {
            parameters: params.parameters || {},
            paintStyle: null,
            hoverPaintStyle: null,
            paintStyleInUse: null,
            hover: false,
            beforeDetach: params.beforeDetach,
            beforeDrop: params.beforeDrop,
            overlayPlacements: [],
            hoverClass: params.hoverClass || params._jsPlumb.Defaults.HoverClass,
            types: [],
            typeCache:new Map<string, any>()
        };

        this._defaultType = {
            parameters: params.parameters || {},
            scope: params.scope || this.instance.getDefaultScope()
        };

        if (params.events) {
            for (let evtName in params.events) {
                this.bind(evtName, params.events[evtName]);
            }
        }
    }

    abstract repaint(params?:any):void;
    abstract getTypeDescriptor():string;

    getDefaultType() {
        return this._defaultType;
    };

    appendToDefaultType (obj:any) {
        for (let i in obj) {
            this._defaultType[i] = obj[i];
        }
    }

    clone() {
        let o = Object.create(this.constructor.prototype);
        this.constructor.apply(o, this.constructorArguments);
        return o;
    }

    cacheTypeItem(key:string, item:any, typeId:string) {
        this._jsPlumb.typeCache[typeId] = this._jsPlumb.typeCache[typeId] || {};
        this._jsPlumb.typeCache[typeId][key] = item;
    }

    getCachedTypeItem(key:string, typeId:string) {
        return this._jsPlumb.typeCache[typeId] ? this._jsPlumb.typeCache[typeId][key] : null;
    }

    getId() { return this.id; }

    // sets the component associated with listener events. for instance, an overlay delegates
    // its events back to a connector. but if the connector is swapped on the underlying connection,
    // then this component must be changed. This is called by setConnector in the Connection class.
    //setListenerComponent(c:UIComponent<EventType, ElementType>) {
    setListenerComponent(c:any) {
        for (let i = 0; i < this.domListeners.length; i++) {
            this.domListeners[i][3] = c;
        }
    }

    getParameter(name:string):any {
        return this._jsPlumb.parameters[name];
    }

    setParameter(name:string, value:any) {
        this._jsPlumb.parameters[name] = value;
    }

    getParameters():any {
        return this._jsPlumb.parameters;
    }

    setParameters(p:any):void {
        this._jsPlumb.parameters = p;
    }

    getClass():string {
        return this.instance.getClass(this.canvas);
    }

    hasClass(clazz:string):Boolean {
        return this.instance.hasClass(this.canvas, clazz);
    }

    addClass(clazz:string) {
        this.instance.addClass(this.canvas, clazz);
    }

    removeClass(clazz:string) {
        this.instance.removeClass(this.canvas, clazz);
    }

    updateClasses(classesToAdd:string|Array<string>, classesToRemove?:string|Array<string>) {
        this.instance.updateClasses(this.canvas, classesToAdd, classesToRemove);
    }

    setType(typeId:string, params:any, doNotRepaint?:Boolean) {
        this.clearTypes();
        this._jsPlumb.types = Types.split(typeId) || [];
        Types.apply(this, params, doNotRepaint);
    }

    getType() {
        return this._jsPlumb.types;
    }

    reapplyTypes(params:any, doNotRepaint?:Boolean) {
        Types.apply(this, params, doNotRepaint);
    }

    hasType(typeId:string) {
        return this._jsPlumb.types.indexOf(typeId) !== -1;
    }

    addType(typeId:string, params:any, doNotRepaint?:Boolean) {
        let t = Types.split(typeId), _cont = false;
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                if (!this.hasType(t[i])) {
                    this._jsPlumb.types.push(t[i]);
                    _cont = true;
                }
            }
            if (_cont) {
                Types.apply(this, params, doNotRepaint);
            }
        }
    }

    removeType(typeId:string, params:any, doNotRepaint?:Boolean) {
        let t = Types.split(typeId),
            _cont = false,
            _one = (tt:string) => {
                let idx = this._jsPlumb.types.indexOf(tt);
                if (idx !== -1) {
                    // remove css class if necessary
                    Types.cleanupCss(this, idx);
                    this._jsPlumb.types.splice(idx, 1);
                    return true;
                }
                return false;
            };

        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                _cont = _one(t[i]) || _cont;
            }
            if (_cont) {
                Types.apply(this, params, doNotRepaint);
            }
        }
    }

    clearTypes(params?:any, doNotRepaint?:Boolean) {
        let i = this._jsPlumb.types.length;
        for (let j = 0; j < i; j++) {
            Types.cleanupCss(this, 0);
            this._jsPlumb.types.splice(0, 1);
        }
        Types.apply(this, params, doNotRepaint);
    }

    toggleType(typeId:string, params:any, doNotRepaint?:Boolean) {
        let t = Types.split(typeId);
        if (t != null) {
            for (let i = 0, j = t.length; i < j; i++) {
                let idx = this._jsPlumb.types.indexOf(t[i]);
                if (idx !== -1) {
                    Types.cleanupCss(this, idx);
                    this._jsPlumb.types.splice(idx, 1);
                }
                else {
                    this._jsPlumb.types.push(t[i]);
                }
            }

            Types.apply(this, params, doNotRepaint);
        }
    }

    applyType(t:any, doNotRepaint:Boolean, typeMap?:any) {
        this.setPaintStyle(t.paintStyle, doNotRepaint);
        this.setHoverPaintStyle(t.hoverPaintStyle, doNotRepaint);
        if (t.parameters) {
            for (let i in t.parameters) {
                this.setParameter(i, t.parameters[i]);
            }
        }
        this._jsPlumb.paintStyleInUse = this.getPaintStyle();
    }

    setPaintStyle(style:any, doNotRepaint?:Boolean) {
        // this._jsPlumb.paintStyle = jsPlumb.extend({}, style);
        // TODO figure out if we want components to clone paintStyle so as not to share it.
        this._jsPlumb.paintStyle = style;
        this._jsPlumb.paintStyleInUse = this._jsPlumb.paintStyle;
        this.updateHoverStyle();
        if (!doNotRepaint) {
            this.repaint();
        }
    }

    getPaintStyle() {
        return this._jsPlumb.paintStyle;
    }

    private updateHoverStyle() {
        if (this._jsPlumb.paintStyle && this._jsPlumb.hoverPaintStyle) {
            let mergedHoverStyle:any = {};
            JsPlumb.extend(mergedHoverStyle, this._jsPlumb.paintStyle);
            JsPlumb.extend(mergedHoverStyle, this._jsPlumb.hoverPaintStyle);
            delete this._jsPlumb.hoverPaintStyle;
            // we want the fill of paintStyle to override a gradient, if possible.
            if (mergedHoverStyle.gradient && this._jsPlumb.paintStyle.fill) {
                delete mergedHoverStyle.gradient;
            }
            this._jsPlumb.hoverPaintStyle = mergedHoverStyle;
        }
    }

    setHoverPaintStyle(style:any, doNotRepaint?:Boolean) {
        //this._jsPlumb.hoverPaintStyle = jsPlumb.extend({}, style);
        // TODO figure out if we want components to clone paintStyle so as not to share it.
        this._jsPlumb.hoverPaintStyle = style;
        this.updateHoverStyle();
        if (!doNotRepaint) {
            this.repaint();
        }
    }

    getHoverPaintStyle() {
        return this._jsPlumb.hoverPaintStyle;
    }

    destroy(force?:Boolean) {
        if (force || this.typeId == null) {
            this.cleanupListeners(); // this is on EventGenerator
            //this.clone = null;
            this._jsPlumb = null;
        }
    }

    isHover() {
        return this._jsPlumb.hover;
    }

    /**
     * Subclasses should override this.
     * @returns {Array}
     */
    getAttachedElements():Array<UIComponent<EventType, ElementType>> {
        return [];
    }

    private updateAttachedElements(state:Boolean, timestamp?:string, sourceElement?:UIComponent<EventType, ElementType>) {
        let affectedElements = this.getAttachedElements();
        if (affectedElements) {
            for (let i = 0, j = affectedElements.length; i < j; i++) {
                if (!sourceElement || sourceElement !== affectedElements[i]) {
                    affectedElements[i].setHover(state, true, timestamp);			// tell the attached elements not to inform their own attached elements.
                }
            }
        }
    }

    setHover(hover:Boolean, ignoreAttachedElements?:Boolean, timestamp?:string) {
        // while dragging, we ignore these events.  this keeps the UI from flashing and
        // swishing and whatevering.
        // TODO `currentlyDragging` is not, strictly speaking, something that jsplumb should know, ie. if it were running headless.
        if (this._jsPlumb && !this.instance.currentlyDragging && !this.instance.isHoverSuspended()) {

            this._jsPlumb.hover = hover;
            let method = hover ? "addClass" : "removeClass";

            if (this.canvas != null) {
                if (this.instance.hoverClass != null) {
                    this.instance[method](this.canvas, this.instance.hoverClass);
                }
                if (this._jsPlumb.hoverClass != null) {
                    this.instance[method](this.canvas, this._jsPlumb.hoverClass);
                }
            }
            if (this._jsPlumb.hoverPaintStyle != null) {
                this._jsPlumb.paintStyleInUse = hover ? this._jsPlumb.hoverPaintStyle : this._jsPlumb.paintStyle;
                if (!this.instance.isSuspendDrawing()) {
                    timestamp = timestamp || _timestamp();
                    this.repaint({timestamp: timestamp, recalc: false});
                }
            }
            // get the list of other affected elements, if supported by this component.
            // for a connection, its the endpoints.  for an endpoint, its the connections! surprise.
            if (this.getAttachedElements && !ignoreAttachedElements) {
                this.updateAttachedElements(hover, _timestamp(), this);
            }
        }
    }

    abstract cleanup(force?:Boolean):void;

    setVisible(value:Boolean) {
        this.visible = value;
    }

    isVisible() {
        return this.visible;
    }

    abstract reattach(instance:JsPlumbInstance<EventType, ElementType>, component?:any):void

}
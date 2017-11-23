import {JsPlumb, JsPlumbInstance} from "./core";
import { Connection } from "./connection";
import {Anchors} from "./anchor/anchors";
import {Anchor} from "./anchor/abstract-anchor";
import {LeftTopLocation, ParameterConfiguration} from "./jsplumb-defaults";
import {DragManager} from "./dom/drag-manager";
import {JsPlumbDOMInstance} from "./main";
import {addToList, merge, wrap} from "./util";
import {OverlayCapableComponent} from "./overlay/overlay-capable-component";
import {isArray, isString} from "./util/_is";


export type EndpointParams<EventType, ElementType> = {
    instance?:JsPlumbInstance<EventType, ElementType>,
    element?:ElementType,
    elementId?:string,
    uuid?:string,
    connectionType?:string,
    maxConnections?:number,
    endpointStyle?:any,
    paintStyle?:any,
    style?:any,
    endpointHoverStyle?:any,
    hoverPaintStyle?:any,
    connectorStyle?:any,
    connectorHoverStyle?:any,
    connectorClass?:string,
    connectorHoverClass?:string,
    connector?:ParameterConfiguration,
    connectorOverlays?:any,
    connectorTooltip?:any,
    source?:any,
    endpoint?:any,
    anchor?:any,
    anchors?:any,


    _newConnection?:Function,

    dragProxy?:any,
    dragOptions?:any,

    endpointsByUUID?:Map<string, Endpoint<EventType, ElementType>>,
    connectionCost?:number,
    connectionsDirected?:Boolean,
    deleteOnEmpty?:Boolean,
    _transient?:Boolean,
    isSource?:Boolean,
    isTarget?:Boolean,
    isTemporarySource?:Boolean,
    connections?:Array<any>,
    scope?:string,
    reattach?:Boolean,
    connectionsDetachable?:Boolean,
    detachable?:Boolean,
    dragAllowedWhenFull?:Boolean,
    onMaxConnections?:Function,
    enabled?:Boolean
    endpointsByElement?:Map<any, any>
}


export class Endpoint<EventType, ElementType> extends OverlayCapableComponent<EventType, ElementType> {

    static map:Map<string, Endpoint<any, any>> = new Map();

    static _makeConnectionDragHandler<EventType, ElementType>(endpoint:Endpoint<EventType, ElementType>, placeholder:any, _jsPlumb:JsPlumbInstance<EventType, ElementType>) {
        let stopped = false;
        return {
            drag: function () {
                if (stopped) {
                    stopped = false;
                    return true;
                }

                if (placeholder.element) {
                    let _ui = _jsPlumb.viewAdapter.getUIPosition(arguments, _jsPlumb.getZoom());
                    if (_ui != null) {
                        _jsPlumb.viewAdapter.setPosition(placeholder.element, _ui);
                    }
                    _jsPlumb.repaint(placeholder.element, _ui);
                    // always repaint the source endpoint, because only continuous/dynamic anchors cause the endpoint
                    // to be repainted, so static anchors need to be told (or the endpoint gets dragged around)
                    endpoint.paint({anchorPoint:endpoint.anchor.getCurrentLocation({element:endpoint})});
                }
            },
            stopDrag: function () {
                stopped = true;
            }
        };
    }

    static _makeDraggablePlaceholder<EventType, ElementType>(placeholder:any, _jsPlumb:JsPlumbInstance<EventType, ElementType>, ipco:LeftTopLocation, ips:[number, number]) {
        let n = _jsPlumb.createElement("div", { position : "absolute" });
        _jsPlumb.appendElement(n);
        let id = _jsPlumb.getId(n);
        _jsPlumb.viewAdapter.setPosition(n, ipco);
        (<any>n).style.width = ips[0] + "px";
        (<any>n).style.height = ips[1] + "px";
        _jsPlumb.manage(id, n, true); // TRANSIENT MANAGE
        // create and assign an id, and initialize the offset.
        placeholder.id = id;
        placeholder.element = n;
    }

    // static _makeFloatingEndpoint<EventType, ElementType>(paintStyle:any, referenceAnchor:any, endpoint:Endpoint<EventType, ElementType>, referenceCanvas:any, sourceElement:any, _jsPlumb:JsPlumbInstance<EventType, ElementType>, _newEndpoint:any, scope:string) {
    //     let floatingAnchor = Anchors["FloatingAnchor"]({ reference: referenceAnchor, referenceCanvas: referenceCanvas, jsPlumbInstance: _jsPlumb });
    //     //setting the scope here should not be the way to fix that mootools issue.  it should be fixed by not
    //     // adding the floating endpoint as a droppable.  that makes more sense anyway!
    //     // TRANSIENT MANAGE
    //     return _newEndpoint({
    //         paintStyle: paintStyle,
    //         endpoint: endpoint,
    //         anchor: floatingAnchor,
    //         source: sourceElement,
    //         scope: scope
    //     });
    // }

    typeParameters = [ "connectorStyle", "connectorHoverStyle", "connectorOverlays",
        "connector", "connectionType", "connectorClass", "connectorHoverClass" ];

    reattachConnections:Boolean = true;
    scope:string;
    deleteOnEmpty:Boolean = false;
    connectionsDetachable:Boolean = true;
    connectorStyle:any = {};
    connectorHoverStyle:any = {};
    connectorOverlays:any;
    connectorClass:string;
    connectorHoverClass:string;
    anchor:any;
    elementId:string;
    connectionsDirected:Boolean;
    connectionCost:number;
    uuid:string;
    connections:Array<Connection<EventType, ElementType>> = [];
    inPlaceCopy:Endpoint<EventType, ElementType> = null;
    isTemporarySource:Boolean = false;
    connector:ParameterConfiguration;
    connectionType:string;
    connectorPointerEvents:any;
    timestamp:string;
    dragAllowedWhenFull:Boolean;
    maxConnections:number = -1;
    enabled:Boolean = true;
    _newConnection:Function;
    _continuousAnchorEdge:number;
    type:string;
    cssClass:string;
    tooltip:string;
    connectorTooltip:string;

    dragOptions:any;

    endpoint:any; // the actual visual endpoint

    defaultLabelLocation:[number, number] = [ 0.5, 0.5 ];

    defaultOverlayKeys():Array<string> { return ["Overlays", "EndpointOverlays"] };

    idPrefix = "_jsplumb_e";

    isSource:Boolean;
    isTarget:Boolean;

    element:ElementType;
    dragProxy:any;

    getTypeDescriptor(): string {
        return "endpoint";
    }

    constructor(params:EndpointParams<EventType, ElementType>) {
        super(params);
        this.element = params.element;

        this.maxConnections = params.maxConnections == null ? this.instance.Defaults.MaxConnections : params.maxConnections;

        this.appendToDefaultType({
            connectionType:params.connectionType,
            maxConnections: this.maxConnections,
            paintStyle: params.endpointStyle || params.paintStyle || params.style || this.instance.Defaults.EndpointStyle,
            hoverPaintStyle: params.endpointHoverStyle || params.hoverPaintStyle || this.instance.Defaults.EndpointHoverStyle,
            connectorStyle: params.connectorStyle,
            connectorHoverStyle: params.connectorHoverStyle,
            connectorClass: params.connectorClass,
            connectorHoverClass: params.connectorHoverClass,
            connectorOverlays: params.connectorOverlays,
            connector: params.connector,
            connectorTooltip: params.connectorTooltip
        });

        this._jsPlumb.enabled = !(params.enabled === false);
        this._jsPlumb.visible = true;
        this.element = this.instance.getElement(params.source);
        this._jsPlumb.uuid = params.uuid;
        this._jsPlumb.floatingEndpoint = null;
        this.connectionCost = params.connectionCost == null ? 1 : params.connectionCost;
        this.connectionsDirected = params.connectionsDirected == null ? false : params.connectionsDirected;

        this.connector = params.connector;
        this.connectorClass = params.connectorClass;
        this.connectorHoverClass = params.connectorHoverClass;
        this.connectorStyle = params.connectorStyle;

        this.connectionType = params.connectionType;
        this.connectorOverlays = params.connectorOverlays;

        if (this._jsPlumb.uuid) {
            params.endpointsByUUID[this._jsPlumb.uuid] = this;
        }
        this.elementId = params.elementId;
        this.enabled = params.enabled !== false;
        this._newConnection = params._newConnection;

        this.dragProxy = params.dragProxy;
        this.dragOptions = params.dragOptions;

        this._jsPlumb.connectionCost = params.connectionCost;
        this._jsPlumb.connectionsDirected = params.connectionsDirected;
        this._jsPlumb.currentAnchorClass = "";
        this._jsPlumb.events = {};

        this.deleteOnEmpty = params.deleteOnEmpty === true;

        let internalHover = function (state:Boolean) {
            if (this.connections.length > 0) {
                for (let i = 0; i < this.connections.length; i++) {
                    this.connections[i].setHover(state, false);
                }
            }
            else {
                this.setHover(state);
            }
        }.bind(this);

        this.bind("mouseover", function () {
            internalHover(true);
        });
        this.bind("mouseout", function () {
            internalHover(false);
        });

        if (!params._transient) { // in place copies, for example, are transient.  they will never need to be retrieved during a paint cycle, because they dont move, and then they are deleted.
            this.instance.fire("internal:newEndpoint", {
                endpoint:this,
                elementId:this.elementId
            });
        }

        this.isSource = params.isSource || false;
        this.isTemporarySource = params.isTemporarySource || false;
        this.isTarget = params.isTarget || false;

        this.connections = params.connections || [];
        this.connectorPointerEvents = params["connector-pointer-events"];

        this.scope = params.scope || this.instance.getDefaultScope();
        this.timestamp = null;
        this.reattachConnections = params.reattach || this.instance.Defaults.ReattachConnections;
        this.connectionsDetachable = this.instance.Defaults.ConnectionsDetachable;
        if (params.connectionsDetachable === false || params.detachable === false) {
            this.connectionsDetachable = false;
        }
        this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false;

        if (params.onMaxConnections) {
            this.bind("maxConnections", params.onMaxConnections);
        }

        let ep = params.endpoint || this.instance.Defaults.Endpoint;
        this.setEndpoint(ep, true);
        let anchorParamsToUse = params.anchor ? params.anchor : params.anchors ? params.anchors : (this.instance.Defaults.Anchor || "Top");
        this.setAnchor(anchorParamsToUse, true);
    }

    isEnabled() {
        return this.enabled;
    }

    setEnabled(e:Boolean) {
        this.enabled = e;
    }

    setDeleteOnEmpty(value:Boolean) {
        this.deleteOnEmpty = value;
    }

    paint(params:any) {

    }

    repaint(params:any) {
        this.paint(params);
    }

    getElement():ElementType {
        return this.element;
    }

    getConnectionCost():number {
        return this.connectionCost;
    }

    areConnectionsDirected():Boolean {
        return this.connectionsDirected;
    }

    getUuid() {
        return this.uuid;
    }

    isFull():Boolean {
        return this.maxConnections === 0 ? true : !(this.isFloating() || this.maxConnections < 0 || this.connections.length < this.maxConnections);
    }

    isFloating():Boolean {
        return this.anchor != null && this.anchor.isFloating;
    }

    addConnection(connection:any) {
        this.connections.push(connection);
        this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass);
        this[(this.isFull() ? "add" : "remove") + "Class"](this.instance.endpointFullClass);

        // if the connection is draggable, then maybe we need to tell the target endpoint to init the
        // dragging code. it won't run again if it already configured to be draggable.
        if(connection.isDetachable()) {
            this.initDraggable();
        }
    }

    detachFromConnection (connection:Connection<EventType, ElementType>, idx?:number, doNotCleanup?:Boolean) {
        idx = idx == null ? this.connections.indexOf(connection) : idx;
        if (idx >= 0) {
            this.connections.splice(idx, 1);
            this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass);
            this[(this.isFull() ? "add" : "remove") + "Class"](this.instance.endpointFullClass);
        }

        if (!doNotCleanup && this.deleteOnEmpty && this.connections.length === 0) {
            this.instance.deleteObject({
                endpoint: this,
                fireEvent: false,
                deleteAttachedObjects: doNotCleanup !== true
            });
        }
    }

    deleteEveryConnection(params?:any) {
        let c = this.connections.length;
        for (let i = 0; i < c; i++) {
            this.instance.deleteConnection(this.connections[0], params);
        }
    }

    detachFrom(targetEndpoint:Endpoint<EventType, ElementType>, fireEvent?:Boolean, originalEvent?:EventType) {
        let c = [];
        for (let i = 0; i < this.connections.length; i++) {
            if (this.connections[i].endpoints[1] === targetEndpoint || this.connections[i].endpoints[0] === targetEndpoint) {
                c.push(this.connections[i]);
            }
        }
        for (let j = 0, count = c.length; j < count; j++) {
            this.instance.deleteConnection(c[0]);
        }
        return this;
    }

    _updateAnchorClass() {
        // stash old, get new
        let oldAnchorClass = this.instance.endpointAnchorClassPrefix + "-" + this._jsPlumb.currentAnchorClass;
        this._jsPlumb.currentAnchorClass = this.anchor.getCssClass();
        let anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");

        this.removeClass(oldAnchorClass);
        this.addClass(anchorClass);
        // add and remove at the same time to reduce the number of reflows.
        this.updateClasses(anchorClass, oldAnchorClass);
    }

    prepareAnchor(anchorParams:any):Anchor<EventType, ElementType> {
        let a = Anchors.makeAnchor(anchorParams, this.elementId, this.instance);
        a.bind("anchorChanged", (currentAnchor:Anchor<EventType, ElementType>) => {
            this.fire("anchorChanged", {endpoint: this, anchor: currentAnchor});
            this._updateAnchorClass();
        });
        return a;
    }

    setPreparedAnchor(anchor:Anchor<EventType, ElementType>, doNotRepaint?:Boolean) {

        this.instance.fire("internal:setEndpointAnchor", {
            endpoint:this,
            anchor:anchor
        });

        this.anchor = anchor;
        this._updateAnchorClass();

        if (!doNotRepaint) {
            this.instance.repaint(this.elementId);
        }

        return this;
    }


    setAnchor(anchorParams:any, doNotRepaint?:Boolean) {
        let a = this.prepareAnchor(anchorParams);
        this.setPreparedAnchor(a, doNotRepaint);
        return this;
    }

    prepareEndpoint(ep:any, typeId?:string) {
        let _e = function (t:any, p:any) {
            if (Endpoint.map[t]) {
                return new Endpoint.map[t](p);
            }
            if (!this.instance.Defaults.DoNotThrowErrors) {
                throw { msg: "jsPlumb: unknown endpoint type '" + t + "'" };
            }
        };

        let endpointArgs = {
            _jsPlumb: this.instance,
            cssClass: this.cssClass,
            container: this.instance.getContainer,
            tooltip: this.tooltip,
            connectorTooltip: this.connectorTooltip,
            endpoint: this
        };

        let endpoint;

        if (isString(ep)) {
            endpoint = _e(ep, endpointArgs);
        }
        else if (isArray(ep)) {
            endpointArgs = merge(ep[1], endpointArgs);
            endpoint = _e(ep[0], endpointArgs);
        }
        else {
            endpoint = ep.clone();
        }

        // assign a clone function using a copy of endpointArgs. this is used when a drag starts: the endpoint that was dragged is cloned,
        // and the clone is left in its place while the original one goes off on a magical journey.
        // the copy is to get around a closure problem, in which endpointArgs ends up getting shared by
        // the whole world.
        //var argsForClone = jsPlumb.extend({}, endpointArgs);
        endpoint.clone = function () {
            // TODO this, and the code above, can be refactored to be more dry.
            if (isString(ep)) {
                return _e(ep, endpointArgs);
            }
            else if (isArray(ep)) {
                endpointArgs = merge(ep[1], endpointArgs);
                return _e(ep[0], endpointArgs);
            }
        }.bind(this);

        endpoint.typeId = typeId;
        return endpoint;
    }

    setEndpoint(ep:any, doNotRepaint?:Boolean) {
        let _ep = this.prepareEndpoint(ep);
        this.setPreparedEndpoint(_ep, true);
    };

    setPreparedEndpoint(ep:Endpoint<EventType, ElementType>, doNotRepaint?:Boolean) {
        if (this.endpoint != null) {
            this.endpoint.cleanup();
            this.endpoint.destroy();
        }
        this.endpoint = ep;
        this.type = this.endpoint.type;
        this.canvas = this.endpoint.canvas;
    };



    connectorSelector() {
        let candidate = this.connections[0];
        if (candidate) {
            return candidate;
        }
        else {
            return (this.connections.length < this._jsPlumb.maxConnections) || this._jsPlumb.maxConnections === -1 ? null : candidate;
        }
    }

    cleanup(force?:Boolean) {
        let anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");
        this.instance.removeClass(this.element, anchorClass);
        this.anchor = null;
        this.endpoint.cleanup(true);
        this.endpoint.destroy();
        this.endpoint = null;

        // drag/drop
        // TODO instance doesnt know about dragging, only the dom version
        // knows. also endpoint knows a lot about dragging. would be better
        // to split the drag stuff into a DOM extension
        //this.instance.destroyDraggable(this.canvas, "internal");
        //this.instance.destroyDroppable(this.canvas, "internal");

    }

    draggingInitialised:Boolean = false;
    initDraggable() {

        // is this a connection source? we make it draggable and have the
        // drag listener maintain a connection with a floating endpoint.
        if (!this.draggingInitialised) {
            let placeholderInfo:any = { id: null, element: null },
                jpc:Connection<EventType, ElementType> = null,
                existingJpc = false,
                existingJpcParams:any = null,
                _dragHandler = Endpoint._makeConnectionDragHandler(this, placeholderInfo, this.instance),
                dragOptions = this.dragOptions || {},
                defaultOpts = {},
                startEvent = "start",
                stopEvent = "stop",
                dragEvent = "drag",
                beforeStartEvent = "beforeStart",
                payload:any;

            // respond to beforeStart from katavorio; this will have, optionally, a payload of attribute values
            // that were placed there by the makeSource mousedown listener.
            let beforeStart = function(beforeStartParams:any) {
                payload = beforeStartParams.e.payload || {};
            };

            let start = (startParams:any) => {

    // -------------   first, get a connection to drag. this may be null, in which case we are dragging a new one.

                jpc = this.connectorSelector();

    // -------------------------------- now a bunch of tests about whether or not to proceed -------------------------

                let _continue = true;
                // if not enabled, return
                if (!this.isEnabled()) {
                    _continue = false;
                }
                // if no connection and we're not a source - or temporarily a source, as is the case with makeSource - return.
                if (jpc == null && !this.isSource && !this.isTemporarySource) {
                    _continue = false;
                }
                // otherwise if we're full and not allowed to drag, also return false.
                if (this.isSource && this.isFull() && !(jpc != null && this.dragAllowedWhenFull)) {
                    _continue = false;
                }
                // if the connection was setup as not detachable or one of its endpoints
                // was setup as connectionsDetachable = false, or Defaults.ConnectionsDetachable
                // is set to false...
                if (jpc != null && !jpc.isDetachable(this)) {
                    _continue = false;
                }

                let beforeDrag = this.instance.checkCondition(jpc == null ? "beforeDrag" : "beforeStartDetach", {
                    endpoint:this,
                    source:this.element,
                    sourceId:this.elementId,
                    connection:jpc
                });
                if (beforeDrag === false) {
                    _continue = false;
                }
                // else we might have been given some data. we'll pass it in to a new connection as 'data'.
                // here we also merge in the optional payload we were given on mousedown.
                else if (typeof beforeDrag === "object") {
                    JsPlumb.extend(beforeDrag, payload || {});
                }
                else {
                    // or if no beforeDrag data, maybe use the payload on its own.
                    beforeDrag = payload || {};
                }

                if (_continue === false) {
                    // this is for mootools and yui. returning false from this causes jquery to stop drag.
                    // the events are wrapped in both mootools and yui anyway, but i don't think returning
                    // false from the start callback would stop a drag.
                    // if (_jsPlumb.stopDrag) {
                    //     _jsPlumb.stopDrag(this.canvas);
                    // }
                    _dragHandler.stopDrag();
                    return false;
                }

    // ---------------------------------------------------------------------------------------------------------------------

                // ok to proceed.

                // clear hover for all connections for this endpoint before continuing.
                for (let i = 0; i < this.connections.length; i++) {
                    this.connections[i].setHover(false);
                }

                this.addClass("endpointDrag");
                (<any>this.instance).setConnectionBeingDragged(true);

                // if we're not full but there was a connection, make it null. we'll create a new one.
                if (jpc && !this.isFull() && this.isSource) {
                    jpc = null;
                }

                this.instance.updateOffset({ elId: this.elementId });

    // ----------------    make the element we will drag around, and position it -----------------------------

                let ipco = this.instance.getOffset(this.canvas),
                    canvasElement = this.canvas,
                    ips = this.instance.getSize(this.canvas);

                Endpoint._makeDraggablePlaceholder(placeholderInfo, this.instance, ipco, ips);

                // store the id of the dragging div and the source element. the drop function will pick these up.
                this.instance.setAttributes(this.canvas, {
                    "dragId":placeholderInfo.id,
                    "elId": this.elementId
                });

    // ------------------- create an endpoint that will be our floating endpoint ------------------------------------

                let endpointToFloat = this.dragProxy || this.endpoint;
                if (this.dragProxy == null && this.connectionType != null) {
                    let aae = this.instance.deriveEndpointAndAnchorSpec(this.connectionType);
                    if (aae.endpoints[1]) {
                        endpointToFloat = aae.endpoints[1];
                    }
                }
                let centerAnchor = Anchors.makeAnchor("Center", placeholderInfo.id, this.instance);
                centerAnchor.isFloating = true;
                this._jsPlumb.floatingEndpoint = (<any>this.instance)._makeFloatingEndpoint(this.getPaintStyle(), centerAnchor, endpointToFloat, this.canvas, placeholderInfo.element, this.scope);
                let _savedAnchor = this._jsPlumb.floatingEndpoint.anchor;

                if (jpc == null) {

                    this.setHover(false, false);
                    // create a connection. one end is this endpoint, the other is a floating endpoint.
                    jpc = this._newConnection({
                        sourceEndpoint: this,
                        targetEndpoint: this._jsPlumb.floatingEndpoint,
                        source: this.element,  // for makeSource with parent option.  ensure source element is represented correctly.
                        target: placeholderInfo.element,
                        anchors: [ this.anchor, this._jsPlumb.floatingEndpoint.anchor ],
                        paintStyle: this.connectorStyle, // this can be null. Connection will use the default.
                        hoverPaintStyle: this.connectorHoverStyle,
                        connector: this.connector, // this can also be null. Connection will use the default.
                        overlays: this.connectorOverlays,
                        type: this.connectionType,
                        cssClass: this.connectorClass,
                        hoverClass: this.connectorHoverClass,
                        scope:this.scope,
                        data:beforeDrag
                    });
                    jpc.pending = true;
                    jpc.addClass((<any>this.instance).draggingClass);
                    this._jsPlumb.floatingEndpoint.addClass((<any>this.instance).draggingClass);
                    this._jsPlumb.floatingEndpoint.anchor = _savedAnchor;
                    // fire an event that informs that a connection is being dragged
                    this.instance.fire("connectionDrag", jpc);

                    // register the new connection on the drag manager. This connection, at this point, is 'pending',
                    // and has as its target a temporary element (the 'placeholder'). If the connection subsequently
                    // becomes established, the anchor manager is informed that the target of the connection has
                    // changed.

                   // _jsPlumb.anchorManager.newConnection(jpc);
                    this.instance.fire("internal:newConnection", jpc);

                } else {
                    existingJpc = true;
                    jpc.setHover(false);
                    // new anchor idx
                    let anchorIdx = jpc.endpoints[0].id === this.id ? 0 : 1;
                    this.detachFromConnection(jpc, null, true);                         // detach from the connection while dragging is occurring. but dont cleanup automatically.

                    // store the original scope (issue 57)
                    let dragScope = (<any>this.instance).getDragScope(canvasElement);
                    this.instance.setAttribute(this.canvas, "originalScope", dragScope);

                    // fire an event that informs that a connection is being dragged. we do this before
                    // replacing the original target with the floating element info.
                    this.instance.fire("connectionDrag", jpc);

                    // now we replace ourselves with the temporary div we created above:
                    if (anchorIdx === 0) {
                        existingJpcParams = [ jpc.source, jpc.sourceId, canvasElement, dragScope ];
                        //_jsPlumb.anchorManager.sourceChanged(jpc.endpoints[anchorIdx].elementId, placeholderInfo.id, jpc, placeholderInfo.element);
                        this.instance.fire("internal:sourceChanged", {
                            previous:jpc.sourceId,
                            current:jpc.floatingElementId,
                            connection:jpc,
                            el:placeholderInfo.element
                        });

                    } else {
                        existingJpcParams = [ jpc.target, jpc.targetId, canvasElement, dragScope ];
                        jpc.target = placeholderInfo.element;
                        jpc.targetId = placeholderInfo.id;

                        //_jsPlumb.anchorManager.updateOtherEndpoint(jpc.sourceId, jpc.endpoints[anchorIdx].elementId, jpc.targetId, jpc);
                        this.instance.fire("internal:targetChanged", {
                            originalSourceId:jpc.sourceId,
                            originalTargetId:jpc.targetId,
                            newTargetId:jpc.floatingElementId
                        });
                    }

                    // store the original endpoint and assign the new floating endpoint for the drag.
                    jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];

                    // PROVIDE THE SUSPENDED ELEMENT, BE IT A SOURCE OR TARGET (ISSUE 39)
                    jpc.suspendedElement = jpc.endpoints[anchorIdx].getElement();
                    jpc.suspendedElementId = jpc.endpoints[anchorIdx].elementId;
                    jpc.suspendedElementType = anchorIdx === 0 ? "source" : "target";

                    jpc.suspendedEndpoint.setHover(false);
                    this._jsPlumb.floatingEndpoint.referenceEndpoint = jpc.suspendedEndpoint;
                    jpc.endpoints[anchorIdx] = this._jsPlumb.floatingEndpoint;

                    jpc.addClass((<any>this.instance).draggingClass);
                    this._jsPlumb.floatingEndpoint.addClass((<any>this.instance).draggingClass);
                }

                // register it and register connection on it.
                // this.instance.floatingConnections[placeholderInfo.id] = jpc;
                //
                // // only register for the target endpoint; we will not be dragging the source at any time
                // // before this connection is either discarded or made into a permanent connection.
                // addToList(params.endpointsByElement, placeholderInfo.id, this._jsPlumb.floatingEndpoint);
                (<any>this.instance).registerFloatingConnection(placeholderInfo, jpc, this._jsPlumb.floatingEndpoint);

                // tell jsplumb about it
                (<any>this.instance).currentlyDragging = true;
            };

            let stop = function () {
                this.instance.setConnectionBeingDragged(false);

                if (jpc && jpc.endpoints != null) {
                    // get the actual drop event (decode from library args to stop function)
                    let originalEvent = this.instance.getDropEvent(arguments);
                    // unlock the other endpoint (if it is dynamic, it would have been locked at drag start)
                    let idx = this.instance.getFloatingAnchorIndex(jpc);
                    jpc.endpoints[idx === 0 ? 1 : 0].anchor.locked = false;
                    // TODO: Dont want to know about css classes inside jsplumb, ideally.
                    jpc.removeClass(this.instance.draggingClass);

                    // if we have the floating endpoint then the connection has not been dropped
                    // on another endpoint.  If it is a new connection we throw it away. If it is an
                    // existing connection we check to see if we should reattach it, throwing it away
                    // if not.
                    if (this._jsPlumb && (jpc.deleteConnectionNow || jpc.endpoints[idx] === this._jsPlumb.floatingEndpoint)) {
                        // 6a. if the connection was an existing one...
                        if (existingJpc && jpc.suspendedEndpoint) {
                            // fix for issue35, thanks Sylvain Gizard: when firing the detach event make sure the
                            // floating endpoint has been replaced.
                            if (idx === 0) {
                                jpc.floatingElement = jpc.source;
                                jpc.floatingElementId = jpc.sourceId;
                                jpc.floatingEndpoint = jpc.endpoints[0];
                                jpc.floatingIndex = 0;
                                jpc.source = existingJpcParams[0];
                                jpc.sourceId = existingJpcParams[1];
                            } else {
                                // keep a copy of the floating element; the anchor manager will want to clean up.
                                jpc.floatingElement = jpc.target;
                                jpc.floatingElementId = jpc.targetId;
                                jpc.floatingEndpoint = jpc.endpoints[1];
                                jpc.floatingIndex = 1;
                                jpc.target = existingJpcParams[0];
                                jpc.targetId = existingJpcParams[1];
                            }

                            let fe = this._jsPlumb.floatingEndpoint; // store for later removal.
                            // restore the original scope (issue 57)
                            this.instance.setDragScope(existingJpcParams[2], existingJpcParams[3]);
                            jpc.endpoints[idx] = jpc.suspendedEndpoint;
                            // if the connection should be reattached, or the other endpoint refuses detach, then
                            // reset the connection to its original state
                            if (jpc.isReattach() || jpc._forceReattach || jpc._forceDetach || !this.instance.deleteConnection(jpc, {originalEvent: originalEvent})) {

                                jpc.setHover(false);
                                jpc._forceDetach = null;
                                jpc._forceReattach = null;
                                this._jsPlumb.floatingEndpoint.detachFromConnection(jpc);
                                jpc.suspendedEndpoint.addConnection(jpc);

                                // TODO this code is duplicated in lots of places...and there is nothing external
                                // in the code; it all refers to the connection itself. we could add a
                                // `checkSanity(connection)` method to anchorManager that did this.
                                if (idx === 1) {
                                    this.instance.fire("internal:targetChanged", {
                                        originalSourceId:jpc.sourceId,
                                        originalTargetId:jpc.floatingElementId,
                                        newTargetId:jpc.targetId
                                    });
                                }
                                else {
                                    //_jsPlumb.anchorManager.sourceChanged(jpc.floatingElementId, jpc.sourceId, jpc, jpc.source);
                                    this.instance.fire("internal:sourceChanged", {
                                        previous:jpc.floatingElementId,
                                        current:jpc.sourceId,
                                        connection:jpc,
                                        el:jpc.suspendedElement
                                    });
                                }

                                this.instance.repaint(existingJpcParams[1]);
                            }
                            else {
                                this.instance.deleteObject({endpoint: fe});
                            }
                        }
                    }

                    // makeTargets sets this flag, to tell us we have been replaced and should delete this object.
                    if (this.deleteAfterDragStop) {
                        this.instance.deleteObject({endpoint: this});
                    }
                    else {
                        if (this._jsPlumb) {
                            this.paint({recalc: false});
                        }
                    }

                    // although the connection is no longer valid, there are use cases where this is useful.
                    this.instance.fire("connectionDragStop", jpc, originalEvent);
                    // fire this event to give people more fine-grained control (connectionDragStop fires a lot)
                    if (jpc.pending) {
                        this.instance.fire("connectionAborted", jpc, originalEvent);
                    }
                    // tell jsplumb that dragging is finished.
                    this.instance.currentlyDragging = false;
                    jpc.suspendedElement = null;
                    jpc.suspendedEndpoint = null;
                    jpc = null;
                }

                // if no endpoints, jpc already cleaned up. but still we want to ensure we're reset properly.
                // remove the element associated with the floating endpoint
                // (and its associated floating endpoint and visual artefacts)
                if (placeholderInfo && placeholderInfo.element) {
                    this.instance.remove(placeholderInfo.element, false, false);
                }
                // remove the inplace copy
                if (this.inPlaceCopy) {
                    this.instance.deleteObject({endpoint: this.inPlaceCopy});
                }

                if (this._jsPlumb) {
                    // make our canvas visible (TODO: hand off to library; we should not know about DOM)
                    this.canvas.style.visibility = "visible";
                    // unlock our anchor
                    this.anchor.locked = false;
                    // clear floating anchor.
                    this._jsPlumb.floatingEndpoint = null;
                }

            }.bind(this);

            dragOptions = JsPlumb.extend(defaultOpts, dragOptions);
            dragOptions.scope = this.scope || dragOptions.scope;
            dragOptions[beforeStartEvent] = wrap(dragOptions[beforeStartEvent], beforeStart, false);
            dragOptions[startEvent] = wrap(dragOptions[startEvent], start, false);
            // extracted drag handler function so can be used by makeSource
            dragOptions[dragEvent] = wrap(dragOptions[dragEvent], _dragHandler.drag);
            dragOptions[stopEvent] = wrap(dragOptions[stopEvent], stop);
            dragOptions.multipleDrop = false;

            dragOptions.canDrag = function () {
                return this.isSource || this.isTemporarySource || /*(this.isTarget && */this.connections.length > 0/*)*/;
            }.bind(this);

            (<any>this.instance).initDraggable(this.canvas, dragOptions, "internal");

            (<any>this.canvas)._jsPlumbRelatedElement = this.element;

            this.draggingInitialised = true;
        }
    }


    reattach(instance: JsPlumbInstance<EventType, ElementType>, component?: any): void {
    }
}
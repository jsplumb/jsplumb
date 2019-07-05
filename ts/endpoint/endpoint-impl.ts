import {EndpointOptions, EndpointSpec} from "../endpoint";
import {Component} from "../component/component";
import {extend, jsPlumbInstance, OffsetAndSize, Size, Timestamp} from "../core";
import {ComputedAnchorPosition, makeAnchorFromSpec} from "../factory/anchor-factory";
import {Anchor} from "../anchor/anchor";
import {OverlayCapableComponent} from "../component/overlay-capable-component";
import {addToList, isArray, isString, merge, removeWithFunction} from "../util";
import {AnchorComputeParams} from "../factory/anchor-factory";
import {Connection} from "../connector/connection-impl";
import {PaintStyle} from "../styles";
import {ConnectorSpec} from "../connector";
import {EndpointRepresentation} from "./endpoints";
import {EndpointFactory} from "../factory/endpoint-factory";

function findConnectionToUseForDynamicAnchor<E>(ep:Endpoint<E>, elementWithPrecedence?:string):Connection<E> {
    let idx = 0;
    if (elementWithPrecedence != null) {
        for (let i = 0; i < ep.connections.length; i++) {
            if (ep.connections[i].sourceId === elementWithPrecedence || ep.connections[i].targetId === elementWithPrecedence) {
                idx = i;
                break;
            }
        }
    }

    return ep.connections[idx];
}

const typeParameters = [ "connectorStyle", "connectorHoverStyle", "connectorOverlays", "connector", "connectionType", "connectorClass", "connectorHoverClass" ];

export class Endpoint<E> extends OverlayCapableComponent<E> {

    getIdPrefix ():string { return  "_jsplumb_e"; }

    getTypeDescriptor ():string {
        return "endpoint";
    }

    getXY() {
        return { x:this.endpoint.x, y:this.endpoint.y }
    }

    connections:Array<Connection<E>> = [];
    connectorPointerEvents:string;
    anchor:Anchor<E>;
    endpoint:EndpointRepresentation<E, any>;
    element:E;
    elementId:string;
    dragAllowedWhenFull:boolean = true;
    scope:string;
    timestamp:string;

    connectorClass:string;
    connectorHoverClass:string;

    _originalAnchor:any;
    deleteAfterDragStop:boolean;
    finalEndpoint:Endpoint<E>;

    isSource:boolean;
    isTarget:boolean;
    isTemporarySource:boolean;

    connectionsDetachable:boolean;
    reattachConnections:boolean;

    referenceEndpoint:Endpoint<E>;

    connectionType:string;
    connector:ConnectorSpec;

    connectorStyle:PaintStyle;
    connectorHoverStyle:PaintStyle;

    dragProxy:any;

    deleteOnEmpty:boolean;

    defaultLabelLocation = [ 0.5, 0.5 ] as [number, number];
    getDefaultOverlayKeys () { return ["overlays", "endpointOverlays"]; }

    constructor(public instance:jsPlumbInstance<E>, params:EndpointOptions<E>) {
        super(instance, params);

        this.appendToDefaultType({
            connectionType:params.connectionType,
            maxConnections: params.maxConnections == null ? this._jsPlumb.instance.Defaults.maxConnections : params.maxConnections, // maximum number of connections this endpoint can be the source of.,
            paintStyle: params.paintStyle || this.instance.Defaults.endpointStyle,
            hoverPaintStyle: params.hoverPaintStyle || this.instance.Defaults.endpointHoverStyle,
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
        if (this._jsPlumb.uuid) {
            this.instance.endpointsByUUID[this._jsPlumb.uuid] = this;
        }
        this.elementId = params.elementId;
        this.dragProxy = params.dragProxy;

        this._jsPlumb.connectionCost = params.connectionCost;
        this._jsPlumb.connectionsDirected = params.connectionsDirected;
        this._jsPlumb.currentAnchorClass = "";
        this._jsPlumb.events = {};
        this._jsPlumb.connectorStyle = params.connectorStyle;
        this._jsPlumb.connectorHoverStyle = params.connectorHoverStyle;
        this._jsPlumb.connector = params.connector;
        this._jsPlumb.connectorOverlays = params.connectorOverlays;
        this._jsPlumb.scope = params.scope;

        this.connectionsDetachable = params.connectionsDetachable;
        this.reattachConnections = params.reattachConnections;
        this.connectorStyle = params.connectorStyle;
        this.connectorHoverStyle = params.connectorHoverStyle;
        this.connector = params.connector;
        this.connectionType = params.connectionType;
        this.connectorClass = params.connectorClass;
        this.connectorHoverClass = params.connectorHoverClass;

        this.deleteOnEmpty = params.deleteOnEmpty === true;

        let internalHover = (state:boolean) => {
            if (this.connections.length > 0) {
                for (let i = 0; i < this.connections.length; i++) {
                    this.connections[i].setHover(state);
                }
            }
            else {
                this.setHover(state);
            }
        };

        this.bind("mouseover", function () {
            internalHover(true);
        });
        this.bind("mouseout", function () {
            internalHover(false);
        });

        if (!params._transient) { // in place copies, for example, are transient.  they will never need to be retrieved during a paint cycle, because they dont move, and then they are deleted.
            this.instance.anchorManager.add(this, this.elementId);
        }

        // what does this do?
        extend((<any>this), params, typeParameters);

        this.isSource = params.isSource || false;
        this.isTemporarySource = params.isTemporarySource || false;
        this.isTarget = params.isTarget || false;

        this.connections = params.connections || [];
        this.connectorPointerEvents = params["connector-pointer-events"];

        this.scope = params.scope || instance.getDefaultScope();
        this.timestamp = null;
        this.reattachConnections = params.reattach || instance.Defaults.reattachConnections;
        this.connectionsDetachable = instance.Defaults.connectionsDetachable;
        if (params.connectionsDetachable === false || params.detachable === false) {
            this.connectionsDetachable = false;
        }
        this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false;

        if (params.onMaxConnections) {
            this.bind("maxConnections", params.onMaxConnections);
        }

        let ep = params.endpoint || instance.Defaults.endpoint;
        this.setEndpoint(ep);
        let anchorParamsToUse = params.anchor ? params.anchor : params.anchors ? params.anchors : (instance.Defaults.anchor || "Top");
        this.setAnchor(anchorParamsToUse, true);

        // finally, set type if it was provided
        let type = [ "default", (params.type || "")].join(" ");
        this.addType(type, params.data, true);

        //this.canvas = this.endpoint.canvas;
        //this.canvas._jsPlumb = this;
    }

    private _updateAnchorClass ():void {
        // stash old, get new
        let oldAnchorClass = this.instance.endpointAnchorClassPrefix + "-" + this._jsPlumb.currentAnchorClass;
        this._jsPlumb.currentAnchorClass = this.anchor.getCssClass();
        let anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");

        this.removeClass(oldAnchorClass);
        this.addClass(anchorClass);
        this.instance.removeClass(this.element, oldAnchorClass);
        this.instance.addClass(this.element, anchorClass);
    }

    private prepareAnchor (anchorParams:any):Anchor<E> {
        let a = makeAnchorFromSpec(this.instance, anchorParams, this.elementId);
        a.bind("anchorChanged", (currentAnchor:Anchor<E>) => {
            this.fire("anchorChanged", {endpoint: this, anchor: currentAnchor});
            this._updateAnchorClass();
        });
        return a;
    }

    setPreparedAnchor (anchor:Anchor<E>, doNotRepaint?:boolean):Endpoint<E> {
        this.instance.anchorManager.continuousAnchorFactory.clear(this.elementId);
        this.anchor = anchor;
        this._updateAnchorClass();

        if (!doNotRepaint) {
            this.instance.repaint(this.elementId);
        }

        return this;
    }

    setAnchor (anchorParams:any, doNotRepaint?:boolean):Endpoint<E> {
        let a = this.prepareAnchor(anchorParams);
        this.setPreparedAnchor(a, doNotRepaint);
        return this;
    }

    addConnection(conn:Connection<E>) {
        this.connections.push(conn);
        this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass);
        this[(this.isFull() ? "add" : "remove") + "Class"](this.instance.endpointFullClass);
    }

    detachFromConnection (connection:Connection<E>, idx?:number, doNotCleanup?:boolean):void {
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

    deleteEveryConnection (params?:any):void {
        let c = this.connections.length;
        for (let i = 0; i < c; i++) {
            this.instance.deleteConnection(this.connections[0], params);
        }
    }

    detachFrom (targetEndpoint:Endpoint<E>, fireEvent?:boolean, originalEvent?:Event):Endpoint<E> {
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

    setVisible(v:boolean, doNotChangeConnections?:boolean, doNotNotifyOtherEndpoint?:boolean) {

        super.setVisible(v);

        this.endpoint.setVisible(v);

        this[v ? "showOverlays" : "hideOverlays"]();
        if (!doNotChangeConnections) {
            for (let i = 0; i < this.connections.length; i++) {
                this.connections[i].setVisible(v);
                if (!doNotNotifyOtherEndpoint) {
                    let oIdx = this === this.connections[i].endpoints[0] ? 1 : 0;
                    // only change the other endpoint if this is its only connection.
                    if (this.connections[i].endpoints[oIdx].connections.length === 1) {
                        this.connections[i].endpoints[oIdx].setVisible(v, true, true);
                    }
                }
            }
        }
    }

    getAttachedElements():Array<Component<E>> {
        return this.connections;
    }

    applyType(t:any, doNotRepaint:boolean, typeMap:any):void {

        super.applyType(t, doNotRepaint, typeMap);

        this.setPaintStyle(t.endpointStyle || t.paintStyle, doNotRepaint);
        this.setHoverPaintStyle(t.endpointHoverStyle || t.hoverPaintStyle, doNotRepaint);
        if (t.maxConnections != null) {
            this._jsPlumb.maxConnections = t.maxConnections;
        }
        if (t.scope) {
            this.scope = t.scope;
        }
        extend(t, typeParameters);

        this.endpoint.applyType(t);

    }

    isEnabled():boolean {
        return this._jsPlumb.enabled;
    }

    setEnabled(e:boolean):void {
        this._jsPlumb.enabled = e;
    }

    cleanup(force?:boolean):void {
        super.cleanup(force);

        let anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");
        this.instance.removeClass(this.element, anchorClass);
        this.anchor = null;
        this.endpoint.cleanup(true);
        this.endpoint.destroy();
        this.endpoint = null;
    }


    setHover(hover: boolean, ignoreAttachedElements?: boolean, timestamp?: Timestamp): void {
        super.setHover(hover, ignoreAttachedElements);
        if (this.endpoint && this._jsPlumb && !this.instance.isConnectionBeingDragged) {
            this.endpoint.setHover(hover);
        }
    }

    isFull():boolean {
        return this._jsPlumb.maxConnections === 0 ? true : !(this.isFloating() || this._jsPlumb.maxConnections < 0 || this.connections.length < this._jsPlumb.maxConnections);
    }

    isFloating():boolean {
        return this.anchor != null && this.anchor.isFloating;
    }

    isConnectedTo(endpoint:Endpoint<E>):boolean {
        let found = false;
        if (endpoint) {
            for (let i = 0; i < this.connections.length; i++) {
                if (this.connections[i].endpoints[1] === endpoint || this.connections[i].endpoints[0] === endpoint) {
                    found = true;
                    break;
                }
            }
        }
        return found;
    }

    getConnectionCost():number {
        return this._jsPlumb.connectionCost;
    }

    setConnectionCost(c:number) {
        this._jsPlumb.connectionCost = c;
    }

    areConnectionsDirected():boolean {
        return this._jsPlumb.connectionsDirected;
    }

    setConnectionsDirected(b:boolean):void {
        this._jsPlumb.connectionsDirected = b;
    }

    setElementId(_elId:string):void {
        this.elementId = _elId;
        this.anchor.elementId = _elId;
    }

    setReferenceElement(_el:E | string) {
        this.element = this.instance.getElement(_el);
    }

    setDragAllowedWhenFull(allowed:boolean):void {
        this.dragAllowedWhenFull = allowed;
    }

    equals(endpoint:Endpoint<E>):boolean {
        return this.anchor.equals(endpoint.anchor);
    }

    getUuid():string {
        return this._jsPlumb.uuid;
    }

    computeAnchor(params:any) {
        return this.anchor.compute(params);
    }

    setElement (el:E):Endpoint<E> {
        let parentId = this.instance.getId(el),
            curId = this.elementId;
        // remove the endpoint from the list for the current endpoint's element
        removeWithFunction(this.instance.endpointsByElement[this.elementId], (e:Endpoint<E>) => {
            return e.id === this.id;
        });
        this.element = this.instance.getElement(el);
        this.elementId = this.instance.getId(this.element);
        this.instance.anchorManager.rehomeEndpoint(this, curId, this.element);

        //this.instance.dragManager.endpointAdded(this.element);

        addToList(this.instance.endpointsByElement, parentId, this);
        return this;
    }

    connectorSelector ():Connection<E> {
        return this.connections[0];
    }

    paint(params:{ timestamp?: string, offset?: OffsetAndSize, dimensions?: Size,
        recalc?:boolean, elementWithPrecedence?:string,
        connectorPaintStyle?:PaintStyle,
        anchorLoc?:ComputedAnchorPosition }):void {

        params = params || {};
        let timestamp = params.timestamp, recalc = !(params.recalc === false);
        if (!timestamp || this.timestamp !== timestamp) {

        //    window.jtime("endpoint paint");

            let info = this.instance.updateOffset({ elId: this.elementId, timestamp: timestamp });

            let xy = params.offset ? params.offset.o : info.o;
            if (xy != null) {
                let ap = params.anchorLoc, connectorPaintStyle = params.connectorPaintStyle;
                if (ap == null) {
                    let wh = params.dimensions || info.s,
                        anchorParams:AnchorComputeParams<E> = { xy: [ xy.left, xy.top ], wh: wh, element: this, timestamp: timestamp };
                    if (recalc && this.anchor.isDynamic && this.connections.length > 0) {
                        let c = findConnectionToUseForDynamicAnchor(this, params.elementWithPrecedence),
                            oIdx = c.endpoints[0] === this ? 1 : 0,
                            oId = oIdx === 0 ? c.sourceId : c.targetId,
                            oInfo = this.instance.getCachedData(oId),
                            oOffset = oInfo.o, oWH = oInfo.s;

                        anchorParams.index = oIdx === 0 ? 1 : 0;
                        anchorParams.connection = c;
                        anchorParams.txy = [ oOffset.left, oOffset.top ];
                        anchorParams.twh = oWH;
                        anchorParams.tElement = c.endpoints[oIdx];
                    } else if (this.connections.length > 0) {
                        anchorParams.connection = this.connections[0];
                    }
                    ap = this.anchor.compute(anchorParams);
                }

                this.endpoint.compute(ap, this.anchor.getOrientation(this), this._jsPlumb.paintStyleInUse);
                this.endpoint.paint(this._jsPlumb.paintStyleInUse);
                this.timestamp = timestamp;

                // paint overlays
                for (let i in this._jsPlumb.overlays) {
                    if (this._jsPlumb.overlays.hasOwnProperty(i)) {
                        let o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {
                            this._jsPlumb.overlayPlacements[i] = o.draw(this.endpoint, this._jsPlumb.paintStyleInUse);
                            o.paint(this._jsPlumb.overlayPlacements[i]);
                        }
                    }
                }
            }

            //window.jtimeEnd("endpoint paint");
        }
    }

    prepareEndpoint<C>(ep:EndpointSpec, typeId?:string):EndpointRepresentation<E, C> {

        let endpointArgs = {
            _jsPlumb: this._jsPlumb.instance,
            cssClass: this._jsPlumb.cssClass,
            // container: params.container,
            // tooltip: params.tooltip,
            // connectorTooltip: params.connectorTooltip,
            endpoint: this
        };

        let endpoint:EndpointRepresentation<E, C>;

        if (isString(ep)) {
            endpoint = EndpointFactory.get(this, ep as string, endpointArgs);
        }
        else if (isArray(ep)) {
            endpointArgs = merge(ep[1], endpointArgs);
            endpoint = EndpointFactory.get(this, ep[0] as string, endpointArgs);
        } else if (ep instanceof EndpointRepresentation) {
            endpoint = (ep as EndpointRepresentation<E, any>).clone()
        }

        // assign a clone function using a copy of endpointArgs. this is used when a drag starts: the endpoint that was dragged is cloned,
        // and the clone is left in its place while the original one goes off on a magical journey.
        // the copy is to get around a closure problem, in which endpointArgs ends up getting shared by
        // the whole world.
        //var argsForClone = jsPlumb.extend({}, endpointArgs);
        endpoint.clone = () => {
            // TODO this, and the code above, can be refactored to be more dry.
            if (isString(ep)) {
                return EndpointFactory.get(this, ep as string, endpointArgs);
            }
            else if (isArray(ep)) {
                endpointArgs = merge(ep[1], endpointArgs);
                return EndpointFactory.get(this, ep[0] as string, endpointArgs);
            } else if (ep instanceof EndpointRepresentation) {
                return (ep as EndpointRepresentation<E, any>).clone()
            }
        };

        endpoint.typeId = typeId;
        return endpoint;
    }

    setEndpoint(ep:EndpointSpec) {
        let _ep = this.prepareEndpoint(ep);
        this.setPreparedEndpoint(_ep);
    }

    setPreparedEndpoint<C>(ep:EndpointRepresentation<E, C>) {
        if (this.endpoint != null) {
            this.endpoint.cleanup();
            this.endpoint.destroy();
        }
        this.endpoint = ep;
        //this.type = this.endpoint.type;
        //this.canvas = this.endpoint.canvas;

        // let scopes = this.scope.split(/\s/);
        // for (let i = 0; i < scopes.length; i++) {
        //     this.instance.setAttribute(this.canvas, "jtk-scope-" + scopes[i], "true");
        // }
    }
}

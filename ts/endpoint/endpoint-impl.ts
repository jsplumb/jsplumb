import {EndpointOptions, EndpointSpec} from "../endpoint/endpoint";
import {extend, jsPlumbInstance, OffsetAndSize, Size, Timestamp} from "../core";
import {makeAnchorFromSpec} from "../factory/anchor-factory";
import {Anchor} from "../anchor/anchor";
import {OverlayCapableComponent} from "../component/overlay-capable-component";
import {addToList, isArray, isString, merge, removeWithFunction} from "../util";
import {AnchorComputeParams} from "../factory/anchor-factory";
import {Connection} from "../connector/connection-impl";
import {PaintStyle} from "../styles";
import {ConnectorSpec} from "../connector/abstract-connector";
import {EndpointRepresentation} from "./endpoints";
import {EndpointFactory} from "../factory/endpoint-factory";
import {AnchorPlacement, OverlaySpec} from "..";

function findConnectionToUseForDynamicAnchor<E>(ep:Endpoint, elementWithPrecedence?:string):Connection {
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

export class Endpoint extends OverlayCapableComponent {

    getIdPrefix ():string { return  "_jsplumb_e"; }

    getTypeDescriptor ():string {
        return "endpoint";
    }

    getXY() {
        return { x:this.endpoint.x, y:this.endpoint.y }
    }

    connections:Array<Connection> = [];
    connectorPointerEvents:string;
    anchor:Anchor;
    endpoint:EndpointRepresentation<any>;
    element:any;
    elementId:string;
    dragAllowedWhenFull:boolean = true;
    scope:string;
    timestamp:string;

    maxConnections:number;

    connectorClass:string;
    connectorHoverClass:string;

    _originalAnchor:any;
    deleteAfterDragStop:boolean;
    finalEndpoint:Endpoint;

    isSource:boolean;
    isTarget:boolean;
    isTemporarySource:boolean;

    connectionsDirected:boolean;
    connectionsDetachable:boolean;
    reattachConnections:boolean;

    referenceEndpoint:Endpoint;

    connectionType:string;
    connector:ConnectorSpec;
    connectorOverlays:Array<OverlaySpec>;

    connectorStyle:PaintStyle;
    connectorHoverStyle:PaintStyle;

    dragProxy:any;

    deleteOnEmpty:boolean;

    defaultLabelLocation = [ 0.5, 0.5 ] as [number, number];
    getDefaultOverlayKey () { return "endpointOverlays"; }

    constructor(public instance:jsPlumbInstance, params:EndpointOptions) {
        super(instance, params);

        this.appendToDefaultType({
            connectionType:params.connectionType,
            maxConnections: params.maxConnections == null ? this.instance.Defaults.maxConnections : params.maxConnections, // maximum number of connections this endpoint can be the source of.,
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
        this.visible = true;
        this.element = this.instance.getElement(params.source);
        this._jsPlumb.uuid = params.uuid;
        this._jsPlumb.floatingEndpoint = null;
        if (this._jsPlumb.uuid) {
            this.instance.endpointsByUUID[this._jsPlumb.uuid] = this;
        }
        this.elementId = params.elementId;
        this.dragProxy = params.dragProxy;

        this._jsPlumb.connectionCost = params.connectionCost;
        this.connectionsDirected = params.connectionsDirected;
        this._jsPlumb.currentAnchorClass = "";
        this._jsPlumb.events = {};

        this.connectorOverlays = params.connectorOverlays;
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
    }

    private _updateAnchorClass ():void {
        const ac = this.anchor.getCssClass();
        if (ac != null && ac.length > 0) {
            // stash old, get new
            let oldAnchorClass = this.instance.endpointAnchorClassPrefix + "-" + this._jsPlumb.currentAnchorClass;
            this._jsPlumb.currentAnchorClass = ac;
            let anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");

            if (oldAnchorClass !== anchorClass) {
                this.removeClass(oldAnchorClass);
                this.addClass(anchorClass);
                this.instance.removeClass(this.element, oldAnchorClass);
                this.instance.addClass(this.element, anchorClass);
            }
        }
    }

    private prepareAnchor (anchorParams:any):Anchor {
        let a = makeAnchorFromSpec(this.instance, anchorParams, this.elementId);
        a.bind("anchorChanged", (currentAnchor:Anchor) => {
            this.fire("anchorChanged", {endpoint: this, anchor: currentAnchor});
            this._updateAnchorClass();
        });
        return a;
    }

    setPreparedAnchor (anchor:Anchor, doNotRepaint?:boolean):Endpoint {
        this.instance.anchorManager.continuousAnchorFactory.clear(this.elementId);
        this.anchor = anchor;
        this._updateAnchorClass();

        if (!doNotRepaint) {
            this.instance.repaint(this.elementId);
        }

        return this;
    }

    setAnchor (anchorParams:any, doNotRepaint?:boolean):Endpoint {
        let a = this.prepareAnchor(anchorParams);
        this.setPreparedAnchor(a, doNotRepaint);
        return this;
    }

    addConnection(conn:Connection) {
        const wasFull = this.isFull();
        this.connections.push(conn);
        this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass);
        if (this.isFull()) {
            if (!wasFull) {
                this.addClass(this.instance.endpointFullClass);
            }
        } else if (wasFull) {
            this.removeClass(this.instance.endpointFullClass);
        }

    }

    /**
     * Detaches this Endpoint from the given Connection.  If `deleteOnEmpty` is set to true and there are no
     * Connections after this one is detached, the Endpoint is deleted.
     * @param connection
     * @param idx
     */
    detachFromConnection (connection:Connection, idx?:number, transientDetach?:boolean):void {
        idx = idx == null ? this.connections.indexOf(connection) : idx;
        if (idx >= 0) {
            this.connections.splice(idx, 1);
            this.instance.renderer.refreshEndpoint(this);
        }

        if (!transientDetach  && this.deleteOnEmpty && this.connections.length === 0) {
            this.instance.deleteEndpoint(this);
        }
    }

    deleteEveryConnection (params?:any):void {
        let c = this.connections.length;
        for (let i = 0; i < c; i++) {
            this.instance.deleteConnection(this.connections[0], params);
        }
    }

    detachFrom (targetEndpoint:Endpoint, fireEvent?:boolean, originalEvent?:Event):Endpoint {
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

    applyType(t:any, doNotRepaint:boolean, typeMap:any):void {

        super.applyType(t, doNotRepaint, typeMap);

        this.setPaintStyle(t.endpointStyle || t.paintStyle, doNotRepaint);
        this.setHoverPaintStyle(t.endpointHoverStyle || t.hoverPaintStyle, doNotRepaint);

        this.connectorStyle = t.connectorStyle;
        this.connectorHoverStyle = t.connectorHoverStyle;
        this.connector = t.connector;
        this.connectorOverlays = t.connectorOverlays;
        this.connectionType = t.connectionType;

        if (t.maxConnections != null) {
            this.maxConnections = t.maxConnections;
        }
        if (t.scope) {
            this.scope = t.scope;
        }
        extend(t, typeParameters);

        this.instance.renderer.applyEndpointType(this, t);

    }

    isEnabled():boolean {
        return this._jsPlumb.enabled;
    }

    setEnabled(e:boolean):void {
        this._jsPlumb.enabled = e;
    }

    destroy(force?:boolean):void {
        // TODO i feel like this anchor class stuff should be in the renderer
        let anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");
        this.instance.removeClass(this.element, anchorClass);
        this.anchor = null;
        if(this.endpoint != null) {
            this.instance.renderer.destroyEndpoint(this);
        }
        this.endpoint = null;

        super.destroy(force);
    }

    isFull():boolean {
        return this.maxConnections === 0 ? true : !(this.isFloating() || this.maxConnections < 0 || this.connections.length < this.maxConnections);
    }

    isFloating():boolean {
        return this.anchor != null && this.anchor.isFloating;
    }

    isConnectedTo(endpoint:Endpoint):boolean {
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
        return this.connectionsDirected;
    }

    setConnectionsDirected(b:boolean):void {
        this.connectionsDirected = b;
    }

    setElementId(_elId:string):void {
        this.elementId = _elId;
        this.anchor.elementId = _elId;
    }

    setReferenceElement(_el:any) {
        this.element = this.instance.getElement(_el);
    }

    setDragAllowedWhenFull(allowed:boolean):void {
        this.dragAllowedWhenFull = allowed;
    }

    equals(endpoint:Endpoint):boolean {
        return this.anchor.equals(endpoint.anchor);
    }

    getUuid():string {
        return this._jsPlumb.uuid;
    }

    computeAnchor(params:any) {
        return this.anchor.compute(params);
    }

    setElement (el:any):Endpoint {
        let parentId = this.instance.getId(el),
            curId = this.elementId;
        // remove the endpoint from the list for the current endpoint's element
        removeWithFunction(this.instance.endpointsByElement[this.elementId], (e:Endpoint) => {
            return e.id === this.id;
        });
        this.element = this.instance.getElement(el);
        this.elementId = this.instance.getId(this.element);
        this.instance.anchorManager.rehomeEndpoint(this, curId, this.element);
        addToList(this.instance.endpointsByElement, parentId, this);
        return this;
    }

    connectorSelector ():Connection {
        return this.connections[0];
    }

    paint(params:{ timestamp?: string, offset?: OffsetAndSize, dimensions?: Size,
        recalc?:boolean, elementWithPrecedence?:string,
        connectorPaintStyle?:PaintStyle,
        anchorLoc?:AnchorPlacement }):void {

        params = params || {};
        let timestamp = params.timestamp, recalc = !(params.recalc === false);
        if (!timestamp || this.timestamp !== timestamp) {

            let info = this.instance.updateOffset({ elId: this.elementId, timestamp: timestamp });
            let xy = params.offset ? params.offset.o : info.o;
            if (xy != null) {
                let ap = params.anchorLoc, connectorPaintStyle = params.connectorPaintStyle;
                if (ap == null) {
                    let wh = params.dimensions || info.s,
                        anchorParams:AnchorComputeParams = { xy: [ xy.left, xy.top ], wh: wh, element: this, timestamp: timestamp };
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

                this.endpoint.compute(ap, this.anchor.getOrientation(this), this.paintStyleInUse);
                //this.endpoint.paint(this.paintStyleInUse);
                this.instance.renderer.paintEndpoint(this, this.paintStyleInUse);
                this.timestamp = timestamp;

                // paint overlays
                for (let i in this._jsPlumb.overlays) {
                    if (this._jsPlumb.overlays.hasOwnProperty(i)) {
                        let o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {
                            this._jsPlumb.overlayPlacements[i] = this.instance.renderer.drawOverlay(o, this.endpoint, this.paintStyleInUse, this.getAbsoluteOverlayPosition(o));
                            this.instance.renderer.paintOverlay(o, this._jsPlumb.overlayPlacements[i], {xmin:0, ymin:0});
                        }
                    }
                }
            }
        }
    }

    prepareEndpoint<C>(ep:EndpointSpec | EndpointRepresentation<C>, typeId?:string):EndpointRepresentation<C> {

        let endpointArgs = {
            _jsPlumb: this._jsPlumb.instance,
            cssClass: this._jsPlumb.cssClass,
            endpoint: this
        };

        let endpoint:EndpointRepresentation<C>;

        if (isString(ep)) {
            endpoint = EndpointFactory.get(this, ep as string, endpointArgs);
        }
        else if (isArray(ep)) {
            endpointArgs = merge(ep[1], endpointArgs);
            endpoint = EndpointFactory.get(this, ep[0] as string, endpointArgs);
        } else if (ep instanceof EndpointRepresentation) {
            endpoint = (ep as EndpointRepresentation<any>).clone()
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
                return (ep as EndpointRepresentation<any>).clone()
            }
        };

        endpoint.typeId = typeId;
        return endpoint;
    }

    setEndpoint(ep:EndpointSpec) {
        let _ep = this.prepareEndpoint(ep);
        this.setPreparedEndpoint(_ep);
    }

    setPreparedEndpoint<C>(ep:EndpointRepresentation<C>) {
        if (this.endpoint != null) {
            this.instance.renderer.destroyEndpoint(this);
        }
        this.endpoint = ep;
    }


    addClass(clazz: string, dontUpdateOverlays?: boolean): void {
        super.addClass(clazz, dontUpdateOverlays);
        this.endpoint.addClass(clazz);
    }

    removeClass(clazz: string, dontUpdateOverlays?: boolean): void {
        super.removeClass(clazz, dontUpdateOverlays);
        this.endpoint.removeClass(clazz);
    }
}

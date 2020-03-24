
import {_timestamp, Dictionary, extend, jsPlumbInstance, TypeDescriptor} from "../core";
import {AbstractConnector} from "./abstract-connector";
import {Endpoint} from "../endpoint/endpoint-impl";
import {PaintStyle} from "../styles";
import {Component} from "../component/component";
import {OverlayCapableComponent} from "../component/overlay-capable-component";
import {addToList, isArray, isEmpty, IS, isString, merge} from "../util";
import {Overlay, OverlaySpec} from "../overlay/overlay";
import {Connectors} from "./connectors";
import {AnchorSpec, makeAnchorFromSpec} from "../factory/anchor-factory";
import {Anchor} from "../anchor/anchor";
import {ConnectorSpec} from "../connector";
import {EndpointSpec} from "../endpoint";

export interface ConnectionParams<E> {
    id?:string;
    source?:string | E;
    target?:string | E;
    sourceEndpoint?:Endpoint<E>;
    targetEndpoint?:Endpoint<E>;
    scope?:string;

    overlays?:Array<OverlaySpec>;

    connector?:ConnectorSpec;

    type?:string;
    endpoints?:[EndpointSpec, EndpointSpec];
    endpoint?:EndpointSpec;

    endpointStyles?:[PaintStyle, PaintStyle];
    endpointStyle?:PaintStyle;
    endpointHoverStyle?:PaintStyle;
    endpointHoverStyles?:[PaintStyle, PaintStyle];
    outlineStroke?:number;
    outlineWidth?:number;
    uuids?:[string, string];
   // drawEndpoints?:boolean;

    deleteEndpointsOnEmpty?:boolean;
    detachable?:boolean;
    reattach?:boolean;

    directed?:boolean;
    cost?:number;

    data?:any;

    cssClass?:string;

    paintStyle?:PaintStyle;
    hoverPaintStyle?:PaintStyle;

    previousConnection?:Connection<E>;

    anchors?:[AnchorSpec, AnchorSpec];
    anchor?:AnchorSpec;
}

function _updateConnectedClass<E>(conn:Connection<E>, element:any, remove?:boolean) {
    if (element != null) {
        element._jsPlumbConnections = element._jsPlumbConnections || {};
        if (remove) {
            delete element._jsPlumbConnections[conn.id];
        }
        else {
            element._jsPlumbConnections[conn.id] = true;
        }

        if (isEmpty(element._jsPlumbConnections)) {
            conn.instance.removeClass(element, conn.instance.connectedClass);
        }
        else {
            conn.instance.addClass(element, conn.instance.connectedClass);
        }
    }
}

export class Connection<E> extends OverlayCapableComponent<E>{//} implements Connection<E> {        // extend OverlayCapableComponent.. hmm.

    id:string;
    connector:AbstractConnector<E>;
    defaultLabelLocation:number = 0.5;
    scope:string;

    typeId = "_jsplumb_connection";
    getIdPrefix () { return  "_jsPlumb_c"; }
    getDefaultOverlayKey():string { return "connectionOverlays"; };

    getXY() {
        return { x:this.connector.x, y:this.connector.y };
    }

    previousConnection:Connection<E>;

    sourceId:string;
    targetId:string;
    source:E;
    target:E;

    endpoints:[Endpoint<E>, Endpoint<E>] = [null, null];
    endpointStyles:[PaintStyle, PaintStyle] = [null, null];

    suspendedEndpoint:Endpoint<E>;
    suspendedIndex:number;
    suspendedElement:E;
    suspendedElementId:string;
    suspendedElementType:string;

    _forceReattach:boolean;
    _forceDetach:boolean;

    proxies:Array<{ ep:Endpoint<E>, originalEp: Endpoint<E> }> = [];
    
    pending:boolean = false;

    anchors:[AnchorSpec, AnchorSpec] = [ null, null ];
    anchor:AnchorSpec = null;

    floatingIndex:number;
    floatingEndpoint:Endpoint<E>;
    floatingId:string;
    floatingElement:E;

    constructor(public instance:jsPlumbInstance<E>, params:ConnectionParams<E>) {

        super(instance, params);

        this.id = params.id;
        // if a new connection is the result of moving some existing connection, params.previousConnection
        // will have that Connection in it. listeners for the jsPlumbConnection event can look for that
        // member and take action if they need to.
        this.previousConnection = params.previousConnection;

        this.source = instance.getElement(params.source);
        this.target = instance.getElement(params.target);

        if (params.sourceEndpoint) {
            this.source = params.sourceEndpoint.element;
            this.sourceId = params.sourceEndpoint.elementId;
        } else {
            this.sourceId = instance.getId(this.source);
        }

        if (params.targetEndpoint) {
            this.target = params.targetEndpoint.element;
            this.targetId = params.targetEndpoint.elementId;
        } else {
            this.targetId = instance.getId(this.target);
        }

        this.scope = params.scope;

        this.anchors = params.anchors;
        this.anchor = params.anchor;

        instance.manage(this.source);
        instance.manage(this.target);

        this.visible = true;

        this._jsPlumb.params = {
            cssClass: params.cssClass,
            "pointer-events": params["pointer-events"],
            overlays: params.overlays
        };
        this._jsPlumb.lastPaintedAt = null;

        this.bind("mouseover", () =>{
            this.setHover(true);
        });

        this.bind("mouseout", () => {
            this.setHover(false);
        });

        if (params.type) {
            params.endpoints = params.endpoints || this.instance.deriveEndpointAndAnchorSpec(params.type).endpoints;
        }

        this._jsPlumb.endpoint = params.endpoint;
        this._jsPlumb.endpoints = params.endpoints;
        this._jsPlumb.endpointStyle = params.endpointStyle;
        this._jsPlumb.endpointHoverStyle = params.endpointHoverStyle;
        this._jsPlumb.endpointStyles = params.endpointStyles;
        this._jsPlumb.endpointHoverStyles = params.endpointHoverStyles;
        this._jsPlumb.paintStyle = params.paintStyle;
        this._jsPlumb.hoverPaintStyle = params.hoverPaintStyle;
        this._jsPlumb.uuids = params.uuids;

        let eS = this.makeEndpoint(true, this.source, this.sourceId, params.sourceEndpoint),
            eT = this.makeEndpoint(false, this.target, this.targetId, params.targetEndpoint);

        if (eS) {
            addToList(instance.endpointsByElement, this.sourceId, eS);
        }
        if (eT) {
            addToList(instance.endpointsByElement, this.targetId, eT);
        }

        // if scope not set, set it to be the scope for the source endpoint.
        if (!this.scope) {
            this.scope = this.endpoints[0].scope;
        }

        if (params.deleteEndpointsOnEmpty != null) {
            this.endpoints[0].deleteOnEmpty = params.deleteEndpointsOnEmpty;
            this.endpoints[1].deleteOnEmpty = params.deleteEndpointsOnEmpty;
        }

        let _detachable = this.instance.Defaults.connectionsDetachable;
        if (params.detachable === false) {
            _detachable = false;
        }
        if (this.endpoints[0].connectionsDetachable === false) {
            _detachable = false;
        }
        if (this.endpoints[1].connectionsDetachable === false) {
            _detachable = false;
        }

        this._jsPlumb.endpoints = params.endpoints || [null, null];
        this._jsPlumb.endpoint = params.endpoint || null;

        let _reattach = params.reattach || this.endpoints[0].reattachConnections || this.endpoints[1].reattachConnections || this.instance.Defaults.reattachConnections;

        this.appendToDefaultType({
            detachable: _detachable,
            reattach: _reattach,
            paintStyle:this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || this.instance.Defaults.paintStyle,
            hoverPaintStyle:this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || this.instance.Defaults.hoverPaintStyle
        });

        if (!this.instance._suspendDrawing) {
            // paint the endpoints
            let myInfo = this.instance.getCachedData(this.sourceId),
                myOffset = myInfo.o, myWH = myInfo.s,
                otherInfo = this.instance.getCachedData(this.targetId),
                otherOffset = otherInfo.o,
                otherWH = otherInfo.s,
                initialTimestamp = this.instance._suspendedAt || _timestamp(),
                anchorLoc = this.endpoints[0].anchor.compute({
                    xy: [ myOffset.left, myOffset.top ], wh: myWH, element: this.endpoints[0],
                    elementId: this.endpoints[0].elementId,
                    txy: [ otherOffset.left, otherOffset.top ], twh: otherWH, tElement: this.endpoints[1],
                    timestamp: initialTimestamp
                });

            this.endpoints[0].paint({ anchorLoc: anchorLoc, timestamp: initialTimestamp });

            anchorLoc = this.endpoints[1].anchor.compute({
                xy: [ otherOffset.left, otherOffset.top ], wh: otherWH, element: this.endpoints[1],
                elementId: this.endpoints[1].elementId,
                txy: [ myOffset.left, myOffset.top ], twh: myWH, tElement: this.endpoints[0],
                timestamp: initialTimestamp
            });
            this.endpoints[1].paint({ anchorLoc: anchorLoc, timestamp: initialTimestamp });
        }

        this._jsPlumb.cost = params.cost || this.endpoints[0].getConnectionCost();
        this._jsPlumb.directed = params.directed;
        // inherit directed flag if set no source endpoint
        if (params.directed == null) {
            this._jsPlumb.directed = this.endpoints[0].areConnectionsDirected();
        }

        // PARAMETERS
        // merge all the parameters objects into the connection.  parameters set
        // on the connection take precedence; then source endpoint params, then
        // finally target endpoint params.
        let _p = extend({}, this.endpoints[1].getParameters());
        extend(_p, this.endpoints[0].getParameters());
        extend(_p, this.getParameters());
        this.setParameters(_p);
// END PARAMETERS

// PAINTING

        this.setConnector(this.endpoints[0].connector || this.endpoints[1].connector || params.connector || this.instance.Defaults.connector, true);

        let data = params.data == null || !IS.anObject(params.data) ? {} : params.data;
        this.setData(data);

        // the very last thing we do is apply types, if there are any.
        let _types = [ "default", this.endpoints[0].connectionType, this.endpoints[1].connectionType,  params.type ].join(" ");
        if (/[^\s]/.test(_types)) {
            this.addType(_types, params.data, true);
        }

        this.updateConnectedClass();

    }

    makeEndpoint (isSource:boolean, el:E, elId:string, ep?:Endpoint<E>):Endpoint<E> {
        elId = elId || this._jsPlumb.instance.getId(el);
        return this.prepareEndpoint(ep, isSource ? 0 : 1, el, elId);
    };

    getTypeDescriptor ():string {
        return "connection";
    }

    getAttachedElements ():Array<Component<E>> {
        return this.endpoints;
    }

    isDetachable (ep?:Endpoint<E>):boolean {
        return this._jsPlumb.detachable === false ? false : ep != null ? ep.connectionsDetachable === true : this._jsPlumb.detachable === true;
    }

    setDetachable (detachable:boolean):void {
        this._jsPlumb.detachable = detachable === true;
    }

    isReattach ():boolean {
        return this._jsPlumb.reattach === true || this.endpoints[0].reattachConnections === true || this.endpoints[1].reattachConnections === true;
    }

    setReattach (reattach:boolean):void {
        this._jsPlumb.reattach = reattach === true;
    }

    applyType(t:TypeDescriptor, doNotRepaint:boolean, typeMap:any):void {

        super.applyType(t, doNotRepaint, typeMap);

        //window.jtime("apply connection type");

        let _connector = null;
        if (t.connector != null) {
            _connector = this.getCachedTypeItem("connector", typeMap.connector);
            if (_connector == null) {
                _connector = this.prepareConnector(t.connector, typeMap.connector);
                this.cacheTypeItem("connector", _connector, typeMap.connector);
            }
            this.setPreparedConnector(_connector);
        }

        // none of these things result in the creation of objects so can be ignored.
        if (t.detachable != null) {
            this.setDetachable(t.detachable);
        }
        if (t.reattach != null) {
            this.setReattach(t.reattach);
        }
        if (t.scope) {
            this.scope = t.scope;
        }

        // if (t.cssClass != null && this.canvas) {
        //     this._jsPlumb.instance.addClass(this.canvas, t.cssClass);
        // }

        let _anchors = null;
        // this also results in the creation of objects.
        if (t.anchor) {
            // note that even if the param was anchor, we store `anchors`.
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchor);
            if (_anchors == null) {
                _anchors = [ makeAnchorFromSpec(this.instance, t.anchor, this.sourceId), makeAnchorFromSpec(this.instance, t.anchor, this.targetId) ];
                this.cacheTypeItem("anchors", _anchors, typeMap.anchor);
            }
        }
        else if (t.anchors) {
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchors);
            if (_anchors == null) {
                _anchors = [
                    makeAnchorFromSpec(this.instance, t.anchors[0], this.sourceId),
                    makeAnchorFromSpec(this.instance, t.anchors[1], this.targetId)
                ];
                this.cacheTypeItem("anchors", _anchors, typeMap.anchors);
            }
        }
        if (_anchors != null) {
            this.endpoints[0].anchor = _anchors[0];
            this.endpoints[1].anchor = _anchors[1];
            if (this.endpoints[1].anchor.isDynamic) {
                this.instance.repaint(this.endpoints[1].elementId);
            }
        }

        this.connector.applyType(t);

     //   window.jtimeEnd("apply connection type");
    }

    addClass(c:string, informEndpoints?:boolean) {
        super.addClass(c);

        if (informEndpoints) {
            this.endpoints[0].addClass(c);
            this.endpoints[1].addClass(c);
            if (this.suspendedEndpoint) {
                this.suspendedEndpoint.addClass(c);
            }
        }
        if (this.connector) {
            this.connector.addClass(c);
        }
    }

    removeClass(c:string, informEndpoints?:boolean) {
        super.removeClass(c);

        if (informEndpoints) {
            this.endpoints[0].removeClass(c);
            this.endpoints[1].removeClass(c);
            if (this.suspendedEndpoint) {
                this.suspendedEndpoint.removeClass(c);
            }
        }
        if (this.connector) {
            this.connector.removeClass(c);
        }
    }

    setVisible(v:boolean) {
        super.setVisible(v);
        if (this.connector) {
            this.connector.setVisible(v);
        }
        this.repaint();
    }

    destroy(force?:boolean) {
        this.updateConnectedClass(true);
        this.endpoints = null;
        this.source = null;
        this.target = null;
        if (this.connector != null) {
            this.instance.renderer.destroyConnector(this.connector);
        }
        this.connector = null;
        super.destroy(force);
    }

    moveParent(newParent:E):void {
        this.instance.renderer.moveConnectorParent(this.connector, newParent);
        super.moveParent(newParent);
    }

    updateConnectedClass(remove?:boolean) {
        if (this._jsPlumb) {
            _updateConnectedClass(this, this.source, remove);
            _updateConnectedClass(this, this.target, remove);
        }
    }

    setHover(state:boolean) {
        super.setHover(state);
        if (this.connector && this._jsPlumb && !this.instance.isConnectionBeingDragged) {
            this.connector.setHover(state);
            this.instance[state ? "addClass" : "removeClass"](this.source, this.instance.hoverSourceClass);
            this.instance[state ? "addClass" : "removeClass"](this.target, this.instance.hoverTargetClass);
        }
    }

    getUuids():[string, string] {
        return [ this.endpoints[0].getUuid(), this.endpoints[1].getUuid() ];
    }

    getCost():number {
        return this._jsPlumb ? this._jsPlumb.cost : -Infinity;
    }

    setCost(c:number) {
        this._jsPlumb.cost = c;
    }

    isDirected():boolean {
        return this._jsPlumb.directed;
    }

    getConnector():AbstractConnector<E> {
        return this.connector;
    }

    makeConnector(name:string, args:any):AbstractConnector<E> {
        return Connectors.get(this.instance, this, name, args);
    }

    prepareConnector(connectorSpec:ConnectorSpec, typeId?:string):AbstractConnector<E> {
        let connectorArgs = {
                _jsPlumb: this._jsPlumb.instance,
                cssClass: this._jsPlumb.params.cssClass,
                container: this._jsPlumb.params.container,
                "pointer-events": this._jsPlumb.params["pointer-events"]
            },
            connector;

        if (isString(connectorSpec)) {
            connector = this.makeConnector(connectorSpec as string, connectorArgs);
        } // lets you use a string as shorthand.
        else if (isArray(connectorSpec)) {
            if (connectorSpec.length === 1) {
                connector = this.makeConnector((connectorSpec as Array<any>)[0], connectorArgs);
            }
            else {
                connector = this.makeConnector((connectorSpec as Array<any>)[0], merge((connectorSpec as Array<any>)[1], connectorArgs));
            }
        }
        if (typeId != null) {
            connector.typeId = typeId;
        }
        return connector;
    }

    setPreparedConnector(connector:AbstractConnector<E>, doNotRepaint?:boolean, doNotChangeListenerComponent?:boolean, typeId?:string) {

        if (this.connector !== connector) {

            let previous, previousClasses = "";
            // the connector will not be cleaned up if it was set as part of a type, because `typeId` will be set on it
            // and we havent passed in `true` for "force" here.
            if (this.connector != null) {
                previous = this.connector;
                previousClasses = previous.getClass();
                this.instance.renderer.destroyConnector(this.connector);
            }

            this.connector = connector;
            if (typeId) {
                this.cacheTypeItem("connector", connector, typeId);
            }

            // this.canvas = this.connector.canvas;
            // this.bgCanvas = this.connector.bgCanvas;

            // put classes from prior connector onto the canvas
            this.addClass(previousClasses);

            if (previous != null) {
                let o:Dictionary<Overlay<E>> = this.getOverlays();
                for (let i in o) {
                    if (o[i].transfer) {
                        o[i].transfer(this.connector);
                    }
                }
            }

            if (!doNotRepaint) {
                this.repaint();
            }
        }
    }

    setConnector(connectorSpec:ConnectorSpec, doNotRepaint?:boolean, doNotChangeListenerComponent?:boolean, typeId?:string) {
        let connector = this.prepareConnector(connectorSpec, typeId);
        this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId);
    }

    paint(params:any) {

        if (!this.instance._suspendDrawing && this.visible !== false) {

            params = params || {};
            let timestamp = params.timestamp;
            if (timestamp != null && timestamp === this._jsPlumb.lastPaintedAt) {
                return;
            }

            // if the moving object is not the source we must transpose the two references.
            let    swap = false,
                tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId,
                tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;

            if (timestamp == null || timestamp !== this._jsPlumb.lastPaintedAt) {
                let sourceInfo = this.instance.updateOffset({elId:sId}).o,
                    targetInfo = this.instance.updateOffset({elId:tId}).o,
                    sE = this.endpoints[sIdx], tE = this.endpoints[tIdx];

                let sAnchorP = sE.anchor.getCurrentLocation({xy: [sourceInfo.left, sourceInfo.top], wh: [sourceInfo.width, sourceInfo.height], element: sE, timestamp: timestamp}),
                    tAnchorP = tE.anchor.getCurrentLocation({xy: [targetInfo.left, targetInfo.top], wh: [targetInfo.width, targetInfo.height], element: tE, timestamp: timestamp});

                this.connector.resetBounds();

                this.connector.compute({
                    sourcePos: sAnchorP,
                    targetPos: tAnchorP,
                    sourceOrientation:sE.anchor.getOrientation(sE),
                    targetOrientation:tE.anchor.getOrientation(tE),
                    sourceEndpoint: this.endpoints[sIdx],
                    targetEndpoint: this.endpoints[tIdx],
                    strokeWidth: this._jsPlumb.paintStyleInUse.strokeWidth,
                    sourceInfo: sourceInfo,
                    targetInfo: targetInfo
                });

                let overlayExtents = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

                // compute overlays. we do this first so we can get their placements, and adjust the
                // container if needs be (if an overlay would be clipped)
                for (let i in this._jsPlumb.overlays) {
                    if (this._jsPlumb.overlays.hasOwnProperty(i)) {
                        let o:Overlay<E> = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {

                            this._jsPlumb.overlayPlacements[i] = this.instance.renderer.drawOverlay(o, this.connector, this._jsPlumb.paintStyleInUse, this.getAbsoluteOverlayPosition(o));

                            overlayExtents.minX = Math.min(overlayExtents.minX, this._jsPlumb.overlayPlacements[i].minX);
                            overlayExtents.maxX = Math.max(overlayExtents.maxX, this._jsPlumb.overlayPlacements[i].maxX);
                            overlayExtents.minY = Math.min(overlayExtents.minY, this._jsPlumb.overlayPlacements[i].minY);
                            overlayExtents.maxY = Math.max(overlayExtents.maxY, this._jsPlumb.overlayPlacements[i].maxY);
                        }
                    }
                }

                let lineWidth = parseFloat("" + this._jsPlumb.paintStyleInUse.strokeWidth || "1") / 2,
                    outlineWidth = parseFloat("" + this._jsPlumb.paintStyleInUse.strokeWidth || "0"),
                    extents = {
                        xmin: Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                        ymin: Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                        xmax: Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                        ymax: Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
                    };

                this.instance.renderer.paintConnector(this.connector, this._jsPlumb.paintStyleInUse, extents);

                // and then the overlays
                for (let j in this._jsPlumb.overlays) {
                    if (this._jsPlumb.overlays.hasOwnProperty(j)) {
                        let p = this._jsPlumb.overlays[j];
                        if (p.isVisible()) {
                            this.instance.renderer.paintOverlay(p, this._jsPlumb.overlayPlacements[j], extents);
                        }
                    }
                }
            }
            this._jsPlumb.lastPaintedAt = timestamp;
        }
    }

    repaint(params?:any):void {
        let p = extend(params || {}, {});
        p.elId = this.sourceId;
        this.paint(p);
    }

    prepareEndpoint(existing:Endpoint<E>, index:number, element?:E, elementId?:string, params?:ConnectionParams<E>):Endpoint<E> {

        let e;
        params = <any>(params || this._jsPlumb);

        if (existing) {
            this.endpoints[index] = existing;
            existing.addConnection(this);
        } else {
            if (!params.endpoints) {
                params.endpoints = [ null, null ];
            }
            let ep = params.endpoints[index] || params.endpoint || this.instance.Defaults.endpoints[index] || this.instance.Defaults.endpoint;
            if (!params.endpointStyles) {
                params.endpointStyles = [ null, null ];
            }
            if (!params.endpointHoverStyles) {
                params.endpointHoverStyles = [ null, null ];
            }
            let es = params.endpointStyles[index] || params.endpointStyle || this.instance.Defaults.endpointStyles[index] || this.instance.Defaults.endpointStyle;
            // Endpoints derive their fill from the connector's stroke, if no fill was specified.
            if (es.fill == null && params.paintStyle != null) {
                es.fill = params.paintStyle.stroke;
            }

            if (es.outlineStroke == null && params.paintStyle != null) {
                es.outlineStroke = params.paintStyle.outlineStroke;
            }
            if (es.outlineWidth == null && params.paintStyle != null) {
                es.outlineWidth = params.paintStyle.outlineWidth;
            }

            let ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || this.instance.Defaults.endpointHoverStyles[index] || this.instance.Defaults.endpointHoverStyle;
            // endpoint hover fill style is derived from connector's hover stroke style
            if (params.hoverPaintStyle != null) {
                if (ehs == null) {
                    ehs = {};
                }
                if (ehs.fill == null) {
                    ehs.fill = params.hoverPaintStyle.stroke;
                }
            }
            let a = this.anchors ? this.anchors[index] :
                    this.anchor ? this.anchor :

                        this._makeAnchor(this.instance.Defaults.anchors[index], elementId) || this._makeAnchor(this.instance.Defaults.anchor, elementId),

                u = params.uuids ? params.uuids[index] : null;

            e = this.instance.newEndpoint({
                paintStyle: es, hoverPaintStyle: ehs, endpoint: ep, connections: [ this ],
                uuid: u, anchor: a, source: element, scope: params.scope,
                reattach: params.reattach || this.instance.Defaults.reattachConnections,
                detachable: params.detachable || this.instance.Defaults.connectionsDetachable
            });
            if (existing == null) {
                e.deleteOnEmpty = true;
            }
            this.endpoints[index] = e;
        }

        return e;
    }

    private _makeAnchor(spec:AnchorSpec, elementId?:string):Anchor {
        return spec != null ? makeAnchorFromSpec(this.instance, spec, elementId) : null;
    }

    replaceEndpoint(idx:number, endpointDef:EndpointSpec) {

        let current = this.endpoints[idx],
            elId = current.elementId,
            ebe = this.instance.getEndpoints(elId),
            _idx = ebe.indexOf(current),
            _new = this.prepareEndpoint(null, idx, current.element, elId, {endpoint:endpointDef});

        this.endpoints[idx] = _new;

        ebe.splice(_idx, 1, _new);
        this.instance.deleteObject({endpoint:current, deleteAttachedObjects:false});
        this.instance.fire("endpointReplaced", {previous:current, current:_new});

        this.updateConnectedClass();

    }



}

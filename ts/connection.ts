/**
 * Created by simon on 19/10/2017.
 */

import {Endpoint} from "./endpoint";
import {Connector} from "./connector/connector";
import { JsPlumb, JsPlumbInstance } from "./core";
import {ComponentParams, Point} from "./component/ui-component";
import {_timestamp, addToList, merge} from "./util";
import {ParameterConfiguration} from "./jsplumb-defaults";
import {isArray, isEmpty, isObject, isString} from "./util/_is";
import {Anchors} from "./anchor/anchors";
import {PathBasedComponent} from "./component/path-based-component";
import {OverlayCapableComponent} from "./overlay/overlay-capable-component";

export type ConnectionParams<EventType, ElementType> = ComponentParams<EventType, ElementType> & {
    id?:string,
    newEndpoint?:Endpoint<EventType, ElementType>,
    previousConnection?:Connection<EventType, ElementType>,
    source:string|ElementType,
    target:string|ElementType,
    sourceEndpoint?:Endpoint<EventType, ElementType>,
    targetEndpoint?:Endpoint<EventType, ElementType>,
    editable?:Boolean,
    cssClass?:string,
    container?:ElementType,
    connectionType:any,
    endpoints?:Array<Endpoint<EventType, ElementType>>,
    endpointsByElement:any,
    deleteEndpointsOnEmpty?:Boolean,
    detachable:Boolean,
    reattach?:Boolean,
    hoverPaintStyle?:any,
    paintStyle?:any,
    cost?:number,
    directed:Boolean,
    connector:ParameterConfiguration,
    data?:any,
    type?:string,
    _newEndpoint?:Function
}

export class Connection<EventType, ElementType> extends OverlayCapableComponent<EventType, ElementType> implements PathBasedComponent<EventType, ElementType> {

    static makeConnector<EventType, ElementType>(_jsPlumb:JsPlumbInstance<EventType, ElementType>, connectorName:string, connectorArgs?:any, forComponent?:any) {
        if (!_jsPlumb.Defaults.DoNotThrowErrors && Connector.map[connectorName] == null) {
            throw { msg: "jsPlumb: unknown connector type '" + connectorName + "'" };
        }

        return new Connector.map[connectorName](connectorArgs, forComponent);
    }

    static _makeAnchor<EventType, ElementType>(anchorParams:any, elementId:string, _jsPlumb:JsPlumbInstance<EventType, ElementType>) {
        return (anchorParams) ? Anchors.makeAnchor(anchorParams, elementId, _jsPlumb) : null;
    }

    static _updateConnectedClass<EventType, ElementType>(conn:Connection<EventType, ElementType>, element:any, _jsPlumb:JsPlumbInstance<EventType, ElementType>, remove?:Boolean) {
        if (element != null) {
            element._jsPlumbConnections = element._jsPlumbConnections || {};
            if (remove) {
                delete element._jsPlumbConnections[conn.id];
            }
            else {
                element._jsPlumbConnections[conn.id] = true;
            }

            if (isEmpty(element._jsPlumbConnections)) {
                _jsPlumb.removeClass(element, _jsPlumb.connectedClass);
            }
            else {
                _jsPlumb.addClass(element, _jsPlumb.connectedClass);
            }
        }
    }

    instance:JsPlumbInstance<EventType, ElementType>;
    id:string;
    connector:Connector<EventType, ElementType>;
    idPrefix:string = "_jsplumb_c";
    defaultLabelLocation:number = 0.5;
    previousConnection:Connection<EventType, ElementType>;
    source:ElementType;
    target:ElementType;
    sourceId:string;
    targetId:string;
    scope:string;
    endpoints:Array<Endpoint<EventType, ElementType>> = [];
    endpointStyles:Array<any> = [];
    pending:Boolean = false;
    constructorParams:any;

    suspendedEndpoint:Endpoint<EventType, ElementType>;
    suspendedElement:ElementType;
    suspendedElementId:string;
    suspendedElementType:string;

    floatingEndpoint:Endpoint<EventType, ElementType>;
    floatingElement:ElementType;
    floatingElementId:string;
    floatingIndex:number;

    deleteConnectionNow:Boolean = false;
    _forceDetach:Boolean;
    _forceReattach:Boolean;

    proxies:Array<any> = [];
    data:any;
    _newEndpoint:Function;

    defaultOverlayKeys():Array<string> { return ["Overlays", "ConnectionOverlays"] };

    constructor(params:ConnectionParams<EventType, ElementType>) {

        super(params);

        this.id = params.id;
        this.previousConnection = params.previousConnection;

        this.constructorParams = params;

        this.source = this.instance.getElement(params.source);
        this.target = this.instance.getElement(params.target);
        if (params.sourceEndpoint) {
            this.source = params.sourceEndpoint.getElement();
        }
        if (params.targetEndpoint) {
            this.target = params.targetEndpoint.getElement();
        }
        this.sourceId = this.instance.getId(this.source);
        this.targetId = this.instance.getId(this.target);
        this.scope = params.scope; // scope may have been passed in to the connect call. if it wasn't, we will pull it from the source endpoint, after having initialised the endpoints.
        this.endpoints = [];
        this.endpointStyles = [];

        this.instance.manage(this.sourceId, this.source);
        this.instance.manage(this.targetId, this.target);

        this._jsPlumb.visible = true;
        this._jsPlumb.editable = params.editable === true;

        this._newEndpoint = params._newEndpoint;

        if (params.connectionType) {
            params.endpoints = params.endpoints || this.instance.deriveEndpointAndAnchorSpec(params.connectionType).endpoints;
        }

        let eS = this.makeEndpoint(true, this.source, this.sourceId, params.sourceEndpoint),
            eT = this.makeEndpoint(false, this.target, this.targetId, params.targetEndpoint);

        if (eS) {
            addToList(params.endpointsByElement, this.sourceId, eS);
        }
        if (eT) {
            addToList(params.endpointsByElement, this.targetId, eT);
        }
        // if scope not set, set it to be the scope for the source endpoint.
        if (!this.scope) {
            this.scope = this.endpoints[0].scope;
        }

        // if explicitly told to (or not to) delete endpoints when empty, override endpoint's preferences
        if (params.deleteEndpointsOnEmpty != null) {
            this.endpoints[0].setDeleteOnEmpty(params.deleteEndpointsOnEmpty);
            this.endpoints[1].setDeleteOnEmpty(params.deleteEndpointsOnEmpty);
        }

        let _detachable = this.instance.Defaults.ConnectionsDetachable;
        if (params.detachable === false) {
            _detachable = false;
        }
        if (this.endpoints[0].connectionsDetachable === false) {
            _detachable = false;
        }
        if (this.endpoints[1].connectionsDetachable === false) {
            _detachable = false;
        }

        let _reattach = params.reattach || this.endpoints[0].reattachConnections || this.endpoints[1].reattachConnections || this.instance.Defaults.ReattachConnections;

        this.appendToDefaultType({
            detachable: _detachable,
            reattach: _reattach,
            paintStyle:this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || this.instance.Defaults.PaintStyle,
            hoverPaintStyle:this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || this.instance.Defaults.HoverPaintStyle
        });

        this._jsPlumb.params = {
            cssClass: params.cssClass,
            container: params.container,
            "pointer-events": params["pointer-events"],
            overlays: params.overlays
        };
        this._jsPlumb.lastPaintedAt = null;

        this.bind("mouseover", () => {
            this.setHover(true);
        });
        this.bind("mouseout", () => {
            this.setHover(false);
        });

        let _suspendedAt = this.instance.getSuspendedAt();
        if (!this.instance.isSuspendDrawing()) {
            // paint the endpoints
            let myInfo = this.instance.getCachedData(this.sourceId),
                myOffset = myInfo.o, myWH = myInfo.s,
                otherInfo = this.instance.getCachedData(this.targetId),
                otherOffset = otherInfo.o,
                otherWH = otherInfo.s,
                initialTimestamp = _suspendedAt || _timestamp(),
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

        // COST + DIRECTIONALITY
        // if cost not supplied, try to inherit from source endpoint
        this._jsPlumb.cost = params.cost || this.endpoints[0].getConnectionCost();
        this._jsPlumb.directed = params.directed;
        // inherit directed flag if set no source endpoint
        if (params.directed == null) {
            this._jsPlumb.directed = this.endpoints[0].areConnectionsDirected();
        }
        // END COST + DIRECTIONALITY

        // PARAMETERS
        // merge all the parameters objects into the connection.  parameters set
        // on the connection take precedence; then source endpoint params, then
        // finally target endpoint params.
        let _p = JsPlumb.extend({}, this.endpoints[1].getParameters());
        JsPlumb.extend(_p, this.endpoints[0].getParameters());
        JsPlumb.extend(_p, this.getParameters());
        this.setParameters(_p);
        // END PARAMETERS

        this.setConnector(this.endpoints[0].connector || this.endpoints[1].connector || params.connector || this.instance.Defaults.Connector, true);

        this.data = params.data == null || !isObject(params.data) ? {} : params.data;

        // the very last thing we do is apply types, if there are any.
        let _types = [ "default", this.endpoints[0].connectionType, this.endpoints[1].connectionType,  params.type ].join(" ");
        if (/[^\s]/.test(_types)) {
            this.addType(_types, params.data, true);
        }

        this.updateConnectedClass();
    }

    makeEndpoint(isSource:Boolean, el:ElementType, elId:string, ep?:Endpoint<EventType, ElementType>) {
        elId = elId || this.instance.getId(el);
        return this.prepareEndpoint(this.instance, this._newEndpoint, this, ep, isSource ? 0 : 1, this.constructorParams, el, elId);
    }

    getTypeDescriptor() {
        return "connection";
    }

    shouldFireEvent(event: string, value: any, originalEvent?: EventType): Boolean {
        return true;
    }

    getAttachedElements() {
        return this.endpoints;
    };

    isDetachable(referenceEndpoint?:Endpoint<EventType, ElementType>) {
        return this._jsPlumb.detachable === true;
    }

    setDetachable(detachable:Boolean) {
        this._jsPlumb.detachable = detachable === true;
    }

    isReattach() {
        return this._jsPlumb.reattach === true || this.endpoints[0].reattachConnections === true || this.endpoints[1].reattachConnections === true;
    }

    setReattach(reattach:Boolean) {
        this._jsPlumb.reattach = reattach === true;
    }

    paint(params?:any) {

        if (!this.instance.isSuspendDrawing() && this._jsPlumb.visible) {
            params = params || {};
            let timestamp = params.timestamp,
                // if the moving object is not the source we must transpose the two references.
                swap = false,
                tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId,
                tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;

            if (timestamp == null || timestamp !== this._jsPlumb.lastPaintedAt) {
                let sourceInfo:any = this.instance.updateOffset({elId:sId}).o,
                    targetInfo:any = this.instance.updateOffset({elId:tId}).o,
                    sE = this.endpoints[sIdx], tE = this.endpoints[tIdx];

                let sAnchorP = sE.anchor.getCurrentLocation({xy: [sourceInfo.left, sourceInfo.top], wh: [sourceInfo.width, sourceInfo.height], element: sE, timestamp: timestamp}),
                    tAnchorP = tE.anchor.getCurrentLocation({xy: [targetInfo.left, targetInfo.top], wh: [targetInfo.width, targetInfo.height], element: tE, timestamp: timestamp});

                this.connector.resetBounds();

                this.connector.compute({
                    sourcePos: sAnchorP,
                    targetPos: tAnchorP,
                    sourceEndpoint: this.endpoints[sIdx],
                    targetEndpoint: this.endpoints[tIdx],
                    "stroke-width": this._jsPlumb.paintStyleInUse.strokeWidth,
                    sourceInfo: sourceInfo,
                    targetInfo: targetInfo
                });

                let overlayExtents = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };

                // compute overlays. we do this first so we can get their placements, and adjust the
                // container if needs be (if an overlay would be clipped)
                for (let i in this._jsPlumb.overlays) {
                    if (this._jsPlumb.overlays.hasOwnProperty(i)) {
                        let o = this._jsPlumb.overlays[i];
                        if (o.isVisible()) {
                            this._jsPlumb.overlayPlacements[i] = o.draw(this.connector, this._jsPlumb.paintStyleInUse, this.getAbsoluteOverlayPosition(o));
                            overlayExtents.minX = Math.min(overlayExtents.minX, this._jsPlumb.overlayPlacements[i].minX);
                            overlayExtents.maxX = Math.max(overlayExtents.maxX, this._jsPlumb.overlayPlacements[i].maxX);
                            overlayExtents.minY = Math.min(overlayExtents.minY, this._jsPlumb.overlayPlacements[i].minY);
                            overlayExtents.maxY = Math.max(overlayExtents.maxY, this._jsPlumb.overlayPlacements[i].maxY);
                        }
                    }
                }

                let lineWidth = parseFloat(this._jsPlumb.paintStyleInUse.strokeWidth || 1) / 2,
                    outlineWidth = parseFloat(this._jsPlumb.paintStyleInUse.strokeWidth || 0),
                    extents = {
                        xmin: Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                        ymin: Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                        xmax: Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                        ymax: Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
                    };
                // paint the connector.
                this.connector.paint(this._jsPlumb.paintStyleInUse, null, extents);

                // and then the overlays
                // for (let j in this._jsPlumb.overlays) {
                //     if (this._jsPlumb.overlays.hasOwnProperty(j)) {
                //         let p = this._jsPlumb.overlays[j];
                //         if (p.isVisible()) {
                //             p.paint(this._jsPlumb.overlayPlacements[j], extents);
                //         }
                //     }
                // }
            }
            this._jsPlumb.lastPaintedAt = timestamp;
        }
    }

    getData() { return this.data; };
    setData(d:any) { this.data = d || {}; };
    mergeData(d:any) { this.data = JsPlumb.extend(this.data, d); };

    repaint(params?:any) {
        params = params || {};
        this.paint({ elId: this.sourceId, recalc: !(params.recalc === false), timestamp: params.timestamp});
    }

    prepareEndpoint(_jsPlumb:JsPlumbInstance<EventType, ElementType>, _newEndpoint:Function, conn:Connection<EventType, ElementType>, existing?:Endpoint<EventType, ElementType>, index?:number, params?:any, element?:ElementType, elementId?:string) {
        let e;
        if (existing) {
            conn.endpoints[index] = existing;
            existing.addConnection(conn);
        } else {
            if (!params.endpoints) {
                params.endpoints = [ null, null ];
            }
            let ep = params.endpoints[index] || params.endpoint || _jsPlumb.Defaults.Endpoints[index] || _jsPlumb.Defaults.Endpoint ;
            if (!params.endpointStyles) {
                params.endpointStyles = [ null, null ];
            }
            if (!params.endpointHoverStyles) {
                params.endpointHoverStyles = [ null, null ];
            }
            let es = params.endpointStyles[index] || params.endpointStyle || _jsPlumb.Defaults.EndpointStyles[index] ||  _jsPlumb.Defaults.EndpointStyle;
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

            let ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || _jsPlumb.Defaults.EndpointHoverStyles[index] || _jsPlumb.Defaults.EndpointHoverStyle;
            // endpoint hover fill style is derived from connector's hover stroke style
            if (params.hoverPaintStyle != null) {
                if (ehs == null) {
                    ehs = {};
                }
                if (ehs.fill == null) {
                    ehs.fill = params.hoverPaintStyle.stroke;
                }
            }
            let a = params.anchors ? params.anchors[index] :
                    params.anchor ? params.anchor :
                        Connection._makeAnchor(_jsPlumb.Defaults.Anchors[index], elementId, _jsPlumb) ||
                        Connection._makeAnchor(_jsPlumb.Defaults.Anchor, elementId, _jsPlumb),
                u = params.uuids ? params.uuids[index] : null;

            e = _newEndpoint({
                paintStyle: es, hoverPaintStyle: ehs, endpoint: ep, connections: [ conn ],
                uuid: u, anchor: a, source: element, scope: params.scope,
                reattach: params.reattach || _jsPlumb.Defaults.ReattachConnections,
                detachable: params.detachable || _jsPlumb.Defaults.ConnectionsDetachable
            });
            if (existing == null) {
                e.setDeleteOnEmpty(true);
            }
            conn.endpoints[index] = e;

            if (params.drawEndpoints === false) {
                e.setVisible(false, true, true);
            }

        }
        return e;
    }

    applyType(t:any, doNotRepaint:Boolean, typeMap?:any) {

        super.applyType(t, doNotRepaint, typeMap);

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

        if (t.cssClass != null && this.canvas) {
            this.instance.addClass(this.canvas, t.cssClass);
        }

        let _anchors = null;
        // this also results in the creation of objects.
        if (t.anchor) {
            // note that even if the param was anchor, we store `anchors`.
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchor);
            if (_anchors == null) {
                _anchors = [ Anchors.makeAnchor(t.anchor, null, this.instance), Anchors.makeAnchor(t.anchor, null, this.instance) ];
                this.cacheTypeItem("anchors", _anchors, typeMap.anchor);
            }
        }
        else if (t.anchors) {
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchors);
            if (_anchors == null) {
                _anchors = [
                    Anchors.makeAnchor(t.anchors[0], null, this.instance),
                    Anchors.makeAnchor(t.anchors[1], null, this.instance)
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

    }

    addClass(c:string, informEndpoints?:Boolean) {

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

    removeClass(c:string, informEndpoints?:Boolean) {
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

    isVisible() {
        return this._jsPlumb.visible;
    }

    setVisible(v:Boolean) {
        this._jsPlumb.visible = v;
        if (this.connector) {
            this.connector.setVisible(v);
        }
        this.repaint();
    }

    cleanup(force?:Boolean) {
        //super.cleanup();
        this.updateConnectedClass(true);
        this.endpoints = null;
        this.source = null;
        this.target = null;
        if (this.connector != null) {
            this.connector.cleanup(true);
            this.connector.destroy(true);
        }
        this.connector = null;
    }

    updateConnectedClass(remove?:Boolean) {
        if (this._jsPlumb) {
            Connection._updateConnectedClass(this, this.source, this.instance, remove);
            Connection._updateConnectedClass(this, this.target, this.instance, remove);
        }
    }

    setHover(state:Boolean) {
        super.setHover(state);
        if (this.connector && this._jsPlumb && !(<any>this.instance).isConnectionBeingDragged()) {
            this.connector.setHover(state);
            this.instance[state ? "addClass" : "removeClass"](this.source, this.instance.hoverSourceClass);
            this.instance[state ? "addClass" : "removeClass"](this.target, this.instance.hoverTargetClass);
        }
    }

    getUuids() {
        return [ this.endpoints[0].getUuid(), this.endpoints[1].getUuid() ];
    }

    getCost() {
        return this._jsPlumb ? this._jsPlumb.cost : -Infinity;
    }

    setCost(c:number) {
        this._jsPlumb.cost = c;
    }

    isDirected() {
        return this._jsPlumb.directed === true;
    }

    getConnector() {
        return this.connector;
    }

    prepareConnector(connectorSpec:ParameterConfiguration, typeId:string) {
        let connectorArgs = {
                _jsPlumb: this.instance,
                cssClass: (this._jsPlumb.params.cssClass || ""),
                container: this._jsPlumb.params.container,
                "pointer-events": this._jsPlumb.params["pointer-events"]
            },
            connector;

        if (isString(connectorSpec)) {
            connector = Connection.makeConnector(this.instance, connectorSpec, connectorArgs, this);
        } // lets you use a string as shorthand.
        else if (isArray(connectorSpec)) {
            if (connectorSpec.length === 1) {
                connector = Connection.makeConnector(this.instance, connectorSpec[0], connectorArgs, this);
            }
            else {
                connector = Connection.makeConnector(this.instance, connectorSpec[0], merge(connectorSpec[1], connectorArgs), this);
            }
        }
        if (typeId != null) {
            connector.typeId = typeId;
        }
        return connector;
}

    setPreparedConnector(connector:Connector<EventType, ElementType>, doNotRepaint?:Boolean, doNotChangeListenerComponent?:Boolean, typeId?:string) {

        let previous, previousClasses = "";
        // the connector will not be cleaned up if it was set as part of a type, because `typeId` will be set on it
        // and we havent passed in `true` for "force" here.
        if (this.connector != null) {
            previous = this.connector;
            previousClasses = previous.getClass();
            this.connector.cleanup();
            this.connector.destroy();
        }

        this.connector = connector;
        if (typeId) {
            this.cacheTypeItem("connector", connector, typeId);
        }

        this.canvas = this.connector.canvas;
        this.bgCanvas = this.connector.bgCanvas;

        // put classes from prior connector onto the canvas
        this.addClass(previousClasses);

        // new: instead of binding listeners per connector, we now just have one delegate on the container.
        // so for that handler we set the connection as the '_jsPlumb' member of the canvas element, and
        // bgCanvas, if it exists, which it does right now in the VML renderer, so it won't from v 2.0.0 onwards.
        if (this.canvas) {
            (<any>this.canvas)._jsPlumb = this;
        }
        if (this.bgCanvas) {
            (<any>this.bgCanvas)._jsPlumb = this;
        }

        if (previous != null) {
            let o = this.getOverlays();
            for (let i = 0; i < o.length; i++) {
                if (o[i].transfer) {
                    o[i].transfer(this.connector);
                }
            }
        }

        if (!doNotChangeListenerComponent) {
            this.setListenerComponent(this.connector);
        }
        if (!doNotRepaint) {
            this.repaint();
        }
    }

    setConnector(connectorSpec:ParameterConfiguration, doNotRepaint?:Boolean, doNotChangeListenerComponent?:Boolean, typeId?:string) {
        let connector = this.prepareConnector(connectorSpec, typeId);
        this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId);
    }


    pointOnPath(location: number, absolute?: Boolean): Point {
        return this.connector.pointOnPath(location, absolute);
    }

    gradientAtPoint(location: number, absolute?: Boolean): number {
        return this.connector.gradientAtPoint(location, absolute);
    }

    pointAlongPathFrom(location: number, distance: number, absolute?: Boolean): Point {
        return this.connector.pointAlongPathFrom(location, distance, absolute);
    }

    reattach(instance: JsPlumbInstance<EventType, ElementType>, component?: any): void {
    }
}

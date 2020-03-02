import {Segment} from "./connector/abstract-segment";
import {Component, RepaintOptions} from "./component/component";
import {EndpointRepresentation} from "./endpoint/endpoints";
import {EndpointRenderer} from "./endpoint/endpoint-renderer";
import {jsPlumbInstance, PointArray, TypeDescriptor} from "./core";
import {Overlay} from "./overlay/overlay";
import {LabelOverlay} from "./overlay/label-overlay";
import {ConnectorRenderer} from "./connector/connector-renderer";
import {AbstractConnector, AbstractConnectorOptions} from "./connector/abstract-connector";
import {Endpoint} from "./endpoint/endpoint-impl";
import {PaintStyle} from "./styles";

export interface Renderer<E> {

    getPath(segment:Segment, isFirstSegment:boolean):string;

    assignRenderer<C>(endpoint:Endpoint<E>, ep: EndpointRepresentation<E, C>): EndpointRenderer<E>;

    assignConnectorRenderer(instance:jsPlumbInstance<E>, c:AbstractConnector<E>):ConnectorRenderer<E>;

    repaint(component:Component<E>, typeDescriptor:string, options?:RepaintOptions):void;

    paintOverlay(o: Overlay<E>, params:any, extents:any):void;
    addOverlayClass(o:Overlay<E>, clazz:string):void;
    removeOverlayClass(o:Overlay<E>, clazz:string):void;
    setOverlayVisible(o: Overlay<E>, visible:boolean):void;
    destroyOverlay(o: Overlay<E>, force?:boolean):void;
    updateLabel(o:LabelOverlay<E>):void;
    drawOverlay(overlay:Overlay<E>, component:any, paintStyle:PaintStyle, absolutePosition?:PointArray):any;
    moveOverlayParent(o:Overlay<E>, newParent:E):void;

    paintConnector(connector:AbstractConnector<E>, paintStyle:PaintStyle, extents?:any):void;

    setConnectorHover(connector:AbstractConnector<E>, h:boolean):void;
    cleanupConnector(connector:AbstractConnector<E>, force?:boolean):void;
    destroyConnector(connector:AbstractConnector<E>, force?:boolean):void;

    addConnectorClass(connector:AbstractConnector<E>, clazz:string):void;

    removeConnectorClass(connector:AbstractConnector<E>, clazz:string):void;
    //getClass():string;

    setConnectorVisible(connector:AbstractConnector<E>, v:boolean):void;

    applyConnectorType(connector:AbstractConnector<E>, t:TypeDescriptor):void;

    moveConnectorParent(connector:AbstractConnector<E>, newParent:E):void;


}

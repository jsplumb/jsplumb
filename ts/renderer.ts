import {Segment} from "./connector/abstract-segment";
import {Component, RepaintOptions} from "./component/component";
import {EndpointRepresentation} from "./endpoint/endpoints";
import {PointArray, TypeDescriptor} from "./core";
import {Overlay} from "./overlay/overlay";
import {LabelOverlay} from "./overlay/label-overlay";
import {AbstractConnector} from "./connector/abstract-connector";
import {PaintStyle} from "./styles";
import {OverlayCapableComponent} from "./component/overlay-capable-component";

export interface Renderer<E> {

    getPath(segment:Segment, isFirstSegment:boolean):string;

    repaint(component:Component<E>, typeDescriptor:string, options?:RepaintOptions):void;

    paintOverlay(o: Overlay<E>, params:any, extents:any):void;
    addOverlayClass(o:Overlay<E>, clazz:string):void;
    removeOverlayClass(o:Overlay<E>, clazz:string):void;
    setOverlayVisible(o: Overlay<E>, visible:boolean):void;
    destroyOverlay(o: Overlay<E>, force?:boolean):void;
    updateLabel(o:LabelOverlay<E>):void;
    drawOverlay(overlay:Overlay<E>, component:any, paintStyle:PaintStyle, absolutePosition?:PointArray):any;
    moveOverlayParent(o:Overlay<E>, newParent:E):void;
    reattachOverlay(o:Overlay<E>, c:OverlayCapableComponent<E>):any;

    paintConnector(connector:AbstractConnector<E>, paintStyle:PaintStyle, extents?:any):void;
    setConnectorHover(connector:AbstractConnector<E>, h:boolean):void;
    destroyConnector(connector:AbstractConnector<E>, force?:boolean):void;
    addConnectorClass(connector:AbstractConnector<E>, clazz:string):void;
    removeConnectorClass(connector:AbstractConnector<E>, clazz:string):void;
    setConnectorVisible(connector:AbstractConnector<E>, v:boolean):void;
    applyConnectorType(connector:AbstractConnector<E>, t:TypeDescriptor):void;

    moveConnectorParent(connector:AbstractConnector<E>, newParent:E):void;
    moveEndpointParent<C>(endpoint:EndpointRepresentation<E,C>, newParent:E):void;

    setEndpointHover<C>(endpoint:EndpointRepresentation<E, C>, h: boolean):void;
    applyEndpointType<C>(ep:EndpointRepresentation<E,C>, t:TypeDescriptor):void;
    setEndpointVisible<C>(ep:EndpointRepresentation<E,C>, v:boolean):void;
    destroyEndpoint<C>(ep:EndpointRepresentation<E,C>):void;
    paintEndpoint<C>(ep:EndpointRepresentation<E,C>, paintStyle:PaintStyle):void;
    addEndpointClass<C>(ep:EndpointRepresentation<E,C>, c:string):void;
    removeEndpointClass<C>(ep:EndpointRepresentation<E,C>, c:string):void;


}

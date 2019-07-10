import {Segment} from "./connector/abstract-segment";
import {Component, RepaintOptions} from "./component/component";
import {EndpointRepresentation} from "./endpoint/endpoints";
import {EndpointRenderer} from "./endpoint/endpoint-renderer";
import {OverlayRenderer} from "./overlay/overlay-renderer";
import {jsPlumbInstance} from "./core";
import {Overlay} from "./overlay/overlay";
import {ConnectorRenderer} from "./connector/connector-renderer";
import {AbstractConnector, AbstractConnectorOptions} from "./connector/abstract-connector";
import {Endpoint} from "./endpoint/endpoint-impl";

export interface Renderer<E> {

    getPath(segment:Segment, isFirstSegment:boolean):string;

    assignRenderer<C>(endpoint:Endpoint<E>, ep: EndpointRepresentation<E, C>): EndpointRenderer<E>;
    assignOverlayRenderer(instance: jsPlumbInstance<E>, o: Overlay<E>): OverlayRenderer<E>;
    assignConnectorRenderer(instance:jsPlumbInstance<E>, c:AbstractConnector<E>):ConnectorRenderer<E>;

    repaint(component:Component<E>, typeDescriptor:string, options?:RepaintOptions):void;
}

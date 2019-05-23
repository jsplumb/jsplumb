import {AnchorSpec} from "./anchor/anchors";
import {PaintStyle} from "./styles";
import {OverlaySpec} from "./overlay";
import {Dictionary, OffsetAndSize, Size} from "./core";
import {ComponentOptions} from "./component/component";
import {Endpoint} from "./endpoint/endpoint-impl";
import {ConnectorSpec} from "./connector";
import {Connection} from "./connector/connection-impl";

export type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;
export type UserDefinedEndpointId = string;
export type EndpointParams = any;
export type EndpointSpec = EndpointId | [EndpointId, EndpointParams];

export interface EndpointOptions<E> extends ComponentOptions<E> {
    anchor?: AnchorSpec;
    anchors?:[ AnchorSpec, AnchorSpec ];
    endpoint?: EndpointSpec;
    enabled?: boolean;//= true
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    cssClass?: string;
    hoverClass?: string;
    maxConnections?: number;//= 1?
    connectorStyle?: PaintStyle;
    connectorHoverStyle?: PaintStyle;
    connector?: ConnectorSpec;
    connectorOverlays?: Array<OverlaySpec>;
    connectorClass?: string;
    connectorHoverClass?: string;
    connectionsDetachable?: boolean;//= true
    isSource?: boolean;//= false
    isTarget?: boolean;//= false
    reattach?: boolean;//= false
    parameters?: object;

    data?:any;

    isTemporarySource?:boolean;

    connectionType?: string;
    dragProxy?: string | Array<string>;
    id?: string;
    scope?: string;
    reattachConnections?: boolean;
    type?: string; // "Dot", etc.
    connectorTooltip?:string;

    uuid?:string;
    source?:string|E;

    connections?:Array<Connection<E>>;

    "connector-pointer-events"?:string;

    detachable?:boolean;
    dragAllowedWhenFull?:boolean;

    onMaxConnections?:Function;

    connectionCost?:number;
    connectionsDirected?:boolean;
    deleteOnEmpty?:boolean;

    //endpointsByUUID?:Dictionary<Endpoint<E>>;
    elementId?:string;
    _transient?:boolean;
}

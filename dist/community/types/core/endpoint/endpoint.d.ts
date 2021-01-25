import { AnchorSpec } from "../factory/anchor-factory";
import { Anchor } from "../anchor/anchor";
import { PaintStyle } from "../styles";
import { OverlaySpec } from "../overlay/overlay";
import { ComponentOptions } from "../component/component";
import { ConnectorSpec } from "../connector/abstract-connector";
import { Connection } from "../connector/connection-impl";
import { Endpoint } from "./endpoint-impl";
export declare type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;
export declare type UserDefinedEndpointId = string;
export declare type EndpointParams = any;
export declare type EndpointSpec = EndpointId | [EndpointId, EndpointParams];
export interface InternalEndpointOptions<T extends {
    E: unknown;
} = any> extends EndpointOptions<T> {
    isTemporarySource?: boolean;
}
export interface EndpointOptions<T extends {
    E: unknown;
} = any> extends ComponentOptions {
    anchor?: AnchorSpec | Anchor;
    anchors?: [AnchorSpec, AnchorSpec];
    endpoint?: EndpointSpec | Endpoint<T>;
    enabled?: boolean;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    cssClass?: string;
    hoverClass?: string;
    maxConnections?: number;
    connectorStyle?: PaintStyle;
    connectorHoverStyle?: PaintStyle;
    connector?: ConnectorSpec;
    connectorOverlays?: Array<OverlaySpec>;
    connectorClass?: string;
    connectorHoverClass?: string;
    connectionsDetachable?: boolean;
    isSource?: boolean;
    isTarget?: boolean;
    reattach?: boolean;
    parameters?: object;
    data?: any;
    isTemporarySource?: boolean;
    connectionType?: string;
    dragProxy?: string | Array<string>;
    id?: string;
    scope?: string;
    reattachConnections?: boolean;
    type?: string;
    connectorTooltip?: string;
    portId?: string;
    uuid?: string;
    source?: T["E"];
    connections?: Array<Connection>;
    detachable?: boolean;
    dragAllowedWhenFull?: boolean;
    onMaxConnections?: (value: any, event?: any) => any;
    connectionCost?: number;
    connectionsDirected?: boolean;
    deleteOnEmpty?: boolean;
    elementId?: string;
    _transient?: boolean;
}

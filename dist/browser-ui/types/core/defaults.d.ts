import { EndpointSpec, EndpointStyle } from "../common/endpoint";
import { AnchorSpec } from "../common/anchor";
import { OverlaySpec } from "../common/overlay";
import { PaintStyle } from "../common/paint-style";
import { ConnectorSpec } from "../common/connector";
export interface ListSpec {
    endpoint?: EndpointSpec;
}
export declare const DEFAULT_KEY_ALLOW_NESTED_GROUPS = "allowNestedGroups";
export declare const DEFAULT_KEY_ANCHOR = "anchor";
export declare const DEFAULT_KEY_ANCHORS = "anchors";
export declare const DEFAULT_KEY_CONNECTION_OVERLAYS = "connectionOverlays";
export declare const DEFAULT_KEY_CONNECTIONS_DETACHABLE = "connectionsDetachable";
export declare const DEFAULT_KEY_CONNECTOR = "connector";
export declare const DEFAULT_KEY_CONTAINER = "container";
export declare const DEFAULT_KEY_ENDPOINT = "endpoint";
export declare const DEFAULT_KEY_ENDPOINT_OVERLAYS = "endpointOverlays";
export declare const DEFAULT_KEY_ENDPOINTS = "endpoints";
export declare const DEFAULT_KEY_ENDPOINT_STYLE = "endpointStyle";
export declare const DEFAULT_KEY_ENDPOINT_STYLES = "endpointStyles";
export declare const DEFAULT_KEY_ENDPOINT_HOVER_STYLE = "endpointHoverStyle";
export declare const DEFAULT_KEY_ENDPOINT_HOVER_STYLES = "endpointHoverStyles";
export declare const DEFAULT_KEY_HOVER_CLASS = "hoverClass";
export declare const DEFAULT_KEY_HOVER_PAINT_STYLE = "hoverPaintStyle";
export declare const DEFAULT_KEY_LIST_STYLE = "listStyle";
export declare const DEFAULT_KEY_MAX_CONNECTIONS = "maxConnections";
export declare const DEFAULT_KEY_PAINT_STYLE = "paintStyle";
export declare const DEFAULT_KEY_REATTACH_CONNECTIONS = "reattachConnections";
export declare const DEFAULT_KEY_SCOPE = "scope";
export interface JsPlumbDefaults<E> {
    [DEFAULT_KEY_ENDPOINT]?: EndpointSpec;
    [DEFAULT_KEY_ENDPOINTS]?: [EndpointSpec, EndpointSpec];
    [DEFAULT_KEY_ANCHOR]?: AnchorSpec;
    [DEFAULT_KEY_ANCHORS]?: [AnchorSpec, AnchorSpec];
    [DEFAULT_KEY_PAINT_STYLE]?: PaintStyle;
    [DEFAULT_KEY_HOVER_PAINT_STYLE]?: PaintStyle;
    [DEFAULT_KEY_ENDPOINT_STYLE]?: EndpointStyle;
    [DEFAULT_KEY_ENDPOINT_HOVER_STYLE]?: EndpointStyle;
    [DEFAULT_KEY_ENDPOINT_STYLES]?: [EndpointStyle, EndpointStyle];
    [DEFAULT_KEY_ENDPOINT_HOVER_STYLES]?: [EndpointStyle, EndpointStyle];
    [DEFAULT_KEY_CONNECTIONS_DETACHABLE]?: boolean;
    [DEFAULT_KEY_REATTACH_CONNECTIONS]?: boolean;
    [DEFAULT_KEY_ENDPOINT_OVERLAYS]?: Array<OverlaySpec>;
    [DEFAULT_KEY_CONNECTION_OVERLAYS]?: Array<OverlaySpec>;
    [DEFAULT_KEY_LIST_STYLE]?: ListSpec;
    [DEFAULT_KEY_CONTAINER]?: E;
    [DEFAULT_KEY_CONNECTOR]?: ConnectorSpec;
    [DEFAULT_KEY_SCOPE]?: string;
    [DEFAULT_KEY_MAX_CONNECTIONS]?: number;
    [DEFAULT_KEY_HOVER_CLASS]?: string;
    [DEFAULT_KEY_ALLOW_NESTED_GROUPS]?: boolean;
}
//# sourceMappingURL=defaults.d.ts.map
import { Endpoint } from "./endpoint/endpoint";
import { Connection } from "./connector/connection-impl";
import { EndpointSpec, EndpointStyle } from "../common/endpoint";
import { AnchorSpec } from "../common/anchor";
import { OverlaySpec } from "../common/overlay";
import { PaintStyle } from "../common/paint-style";
import { ConnectorSpec } from "../common/connector";
export declare type UUID = string;
/**
 * Options for the `connect` call on a JsPlumbInstance
 */
export interface ConnectParams<E> {
    /**
     * Optional UUIDs to assign to the source and target endpoints.
     */
    uuids?: [UUID, UUID];
    /**
     * Source for the connection - an Endpoint, or an element
     */
    source?: Element | Endpoint;
    /**
     * Source for the connection - an Endpoint, or an element
     */
    target?: Element | Endpoint;
    /**
     * Whether or not the connection is detachable. Defaults to true.
     */
    detachable?: boolean;
    /**
     * Whether or not to delete the connection's endpoints when this connection is detached. Defaults to false. Does not
     * delete endpoints if they have other connections.
     */
    deleteEndpointsOnDetach?: boolean;
    /**
     * Whether or not to delete any endpoints that were created by this connect call if at some
     * point in the future the endpoint has no remaining connections. Defaults to false.
     */
    deleteEndpointsOnEmpty?: boolean;
    /**
     * Whether or not to reattach this connection automatically should it be detached via user intervention. Defaults to false.
     */
    reattach?: boolean;
    /**
     * Spec for the endpoint to use for both source and target endpoints.
     */
    endpoint?: EndpointSpec;
    /**
     * Individual endpoint specs for the source/target endpoints.
     */
    endpoints?: [EndpointSpec, EndpointSpec];
    /**
     * Spec for the anchor to use for both source and target endpoints.
     */
    anchor?: AnchorSpec;
    /**
     * Individual anchor specs for the source/target endpoints.
     */
    anchors?: [AnchorSpec, AnchorSpec];
    /**
     * Optional label to set on the connection. In the default browser UI implementation this is rendered as a `label` attribute on the SVG element representing the connection.
     */
    label?: string;
    /**
     * Spec for the connector used to paint the connection.
     */
    connector?: ConnectorSpec;
    /**
     * Optional list of overlays to attach to the connection.
     */
    overlays?: Array<OverlaySpec>;
    /**
     * Spec for the styles to use on both source and target endpoints
     */
    endpointStyle?: EndpointStyle;
    /**
     * Individual specs for the source/target endpoint styles.
     */
    endpointStyles?: [EndpointStyle, EndpointStyle];
    /**
     * Spec for the styles to use on both source and target endpoints when they are in hover state
     */
    endpointHoverStyle?: EndpointStyle;
    /**
     * Individual specs for the source/target endpoint styles when they are in hover state.
     */
    endpointHoverStyles?: [EndpointStyle, EndpointStyle];
    /**
     * Optional port IDs for the source and target endpoints
     */
    ports?: [string, string];
    /**
     * Type of the connection. Used in conjunction with the `registerConnectionType` method.
     */
    type?: string;
    /**
     * Paint style for the connector.
     */
    paintStyle?: PaintStyle;
    /**
     * Paint style for the connector when in hover mode.
     */
    hoverPaintStyle?: PaintStyle;
    /**
     * Whether or not the connection is considered to be 'directed'
     */
    directed?: boolean;
    /**
     * Cost of the connection. Defaults to 1.
     */
    cost?: number;
    /**
     * Optional extra parameters to associate with the connection
     */
    parameters?: Record<string, any>;
    id?: string;
    data?: any;
    cssClass?: string;
    hoverClass?: string;
    outlineColor?: string;
    outlineWidth?: number;
    color?: string;
    lineWidth?: number;
    scope?: string;
}
/**
 * Internal extension of ConnectParams containing a few extra things needed to establish a connection.
 */
export interface InternalConnectParams<E> extends ConnectParams<E> {
    sourceEndpoint?: Endpoint<E>;
    targetEndpoint?: Endpoint<E>;
    scope?: string;
    type?: string;
    newConnection?: (p: any) => Connection;
    id?: string;
}
/**
 * Options for the UpdateOffset method
 */
export interface UpdateOffsetOptions {
    timestamp?: string;
    recalc?: boolean;
    elId?: string;
}
//# sourceMappingURL=params.d.ts.map
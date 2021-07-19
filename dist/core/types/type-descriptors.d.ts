/**
 * Base interface for endpoint/connection types, which are registered via `registerConnectionType` and `registerEndpointType`. This interface
 * contains parameters that are common between the two types.
 */
import { PaintStyle, OverlaySpec, ConnectorSpec, EndpointSpec, AnchorSpec } from "@jsplumb/common";
import { Dictionary } from "@jsplumb/util";
import { RedropPolicy } from "./source-selector";
import { Endpoint } from "./endpoint/endpoint";
export interface TypeDescriptor {
    cssClass?: string;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    parameters?: any;
    overlays?: Array<OverlaySpec>;
    anchors?: [AnchorSpec, AnchorSpec];
    anchor?: AnchorSpec;
    scope?: string;
    mergeStrategy?: string;
    endpoint?: EndpointSpec;
    connectorStyle?: PaintStyle;
    connectorHoverStyle?: PaintStyle;
    connector?: ConnectorSpec;
    connectorClass?: string;
}
/**
 * Definition of an endpoint type.
 */
export interface EndpointTypeDescriptor extends TypeDescriptor {
    connectionsDetachable?: boolean;
    reattachConnections?: boolean;
    maxConnections?: number;
}
/**
 * Definition of a connection type.
 */
export interface ConnectionTypeDescriptor extends TypeDescriptor {
    detachable?: boolean;
    reattach?: boolean;
    endpoints?: [EndpointSpec, EndpointSpec];
}
export interface BehaviouralTypeDescriptor<T = any> extends EndpointTypeDescriptor {
    parameterExtractor?: (el: T, eventTarget: T) => Dictionary<string>;
    redrop?: RedropPolicy;
    extract?: Dictionary<string>;
    uniqueEndpoint?: boolean;
    /**
     * Optional function to call if the user begins a new connection drag when the associated element is full.
     * @param value
     * @param event
     */
    onMaxConnections?: (value: any, event?: any) => any;
    edgeType?: string;
    portId?: string;
    /**
     * Defaults to true. If false, the user will not be permitted to drag a connection from the current node to itself.
     */
    allowLoopback?: boolean;
    rank?: number;
    /**
     * Optional selector identifying the ancestor of the event target that could be the element to which connections
     * are added. By default this is the internal attribute jsPlumb uses to mark managed elements (data-jtk-managed)
     */
    parentSelector?: string;
}
export interface SourceOrTargetDefinition {
    enabled?: boolean;
    def: BehaviouralTypeDescriptor;
    endpoint?: Endpoint;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
}
export interface SourceDefinition extends SourceOrTargetDefinition {
}
export interface TargetDefinition extends SourceOrTargetDefinition {
}

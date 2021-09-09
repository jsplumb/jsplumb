import { PaintStyle, OverlaySpec, ConnectorSpec, EndpointSpec, AnchorSpec } from "@jsplumb/common";
import { Dictionary } from "@jsplumb/util";
import { RedropPolicy } from "./source-selector";
import { Endpoint } from "./endpoint/endpoint";
/**
 * Base interface for endpoint/connection types, which are registered via `registerConnectionType` and `registerEndpointType`. This interface
 * contains parameters that are common between the two types, and is shared by internal methods and public methods.
 * @public
 */
interface TypeDescriptorBase {
    cssClass?: string;
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;
    parameters?: any;
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
 * Base interface for type descriptors for public methods.
 * @public
 */
export interface TypeDescriptor extends TypeDescriptorBase {
    overlays?: Array<OverlaySpec>;
}
/**
 * Base interface for type descriptors for internal methods.
 * @internal
 */
export interface ComponentTypeDescriptor extends TypeDescriptorBase {
    overlays: Dictionary<OverlaySpec>;
}
/**
 * Definition of an endpoint type.
 * @public
 */
export interface EndpointTypeDescriptor extends TypeDescriptor {
    connectionsDetachable?: boolean;
    reattachConnections?: boolean;
    maxConnections?: number;
}
/**
 * Definition of a connection type.
 * @public
 */
export interface ConnectionTypeDescriptor extends TypeDescriptor {
    detachable?: boolean;
    reattach?: boolean;
    endpoints?: [EndpointSpec, EndpointSpec];
}
/**
 * Extends EndpointTypeDescriptor to add the options supported by an `addSourceSelector` or `addTargetSelector` call.
 * @public
 */
export interface BehaviouralTypeDescriptor<T = any> extends EndpointTypeDescriptor {
    /**
     * A function that can be used to extract a set of parameters pertinent to the connection that is being dragged
     * from a given source.
     * @param el - The element that is the drag source
     * @param eventTarget - The element that captured the event that started the connection drag.
     */
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
/**
 * Base interface for source/target definitions
 * @public
 */
export interface SourceOrTargetDefinition {
    enabled?: boolean;
    def: BehaviouralTypeDescriptor;
    endpoint?: Endpoint;
    maxConnections?: number;
    uniqueEndpoint?: boolean;
}
/**
 * Defines the supported options on an `addSourceSelector` call.
 * @public
 */
export interface SourceDefinition extends SourceOrTargetDefinition {
}
/**
 * Defines the supported options on an `addTargetSelector` call.
 * @public
 */
export interface TargetDefinition extends SourceOrTargetDefinition {
}
export {};
//# sourceMappingURL=type-descriptors.d.ts.map
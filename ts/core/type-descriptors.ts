
import {PaintStyle, OverlaySpec, ConnectorSpec, EndpointSpec, AnchorSpec} from "@jsplumb/common"
import {RedropPolicy} from "./source-selector"
import {Endpoint} from "./endpoint/endpoint"
import {PointXY} from "@jsplumb/util"

/**
 * Base interface for endpoint/connection types, which are registered via `registerConnectionType` and `registerEndpointType`. This interface
 * contains parameters that are common between the two types, and is shared by internal methods and public methods.
 * @public
 */
interface TypeDescriptorBase {
    cssClass?:string
    paintStyle?:PaintStyle
    hoverPaintStyle?:PaintStyle
    parameters?:any
    anchors?:[AnchorSpec, AnchorSpec]
    anchor?:AnchorSpec
    scope?:string

    mergeStrategy?:string

    endpoint?:EndpointSpec
    connectorStyle?:PaintStyle
    connectorHoverStyle?:PaintStyle
    connector?:ConnectorSpec
    connectorClass?:string
}

/**
 * Base interface for type descriptors for public methods.
 * @public
 */
export interface TypeDescriptor extends TypeDescriptorBase {
    overlays?:Array<OverlaySpec>
}

/**
 * Base interface for type descriptors for internal methods.
 * @internal
 */
export interface ComponentTypeDescriptor extends TypeDescriptorBase {
    overlays:Record<string, OverlaySpec>
}

/**
 * Definition of an endpoint type.
 * @public
 */
export interface EndpointTypeDescriptor extends TypeDescriptor {
    connectionsDetachable?:boolean
    reattachConnections?:boolean
    maxConnections?:number
}

/**
 * Definition of a connection type.
 * @public
 */
export interface ConnectionTypeDescriptor extends TypeDescriptor {
    detachable?:boolean
    reattach?:boolean
    endpoints?:[ EndpointSpec, EndpointSpec ]
}

/**
 * Extends EndpointTypeDescriptor to add the options supported by an `addSourceSelector` or `addTargetSelector` call.
 * @public
 */
export interface BehaviouralTypeDescriptor<T = any> extends EndpointTypeDescriptor {

    /**
     * A function that can be used to extract a set of parameters pertinent to the connection that is being dragged
     * from a given source or dropped on a given target.
     * @param el - The element that is the drag source
     * @param eventTarget - The element that captured the event that started the connection drag.
     */
    parameterExtractor?:(el:T, eventTarget:T) => Record<string, any>
    redrop?:RedropPolicy

    extract?:Record<string, string>

    /**
     * If true, only one endpoint will be created on any given element for this type descriptor, and subsequent connections will
     * all attach to that endpoint. Defaults to false.
     */
    uniqueEndpoint?:boolean

    /**
     * Optional function to call if the user begins a new connection drag when the associated element is full.
     * @param value
     * @param event
     */
    onMaxConnections?:(value:any, event?:any) => any
    edgeType?:string
    portId?:string

    /**
     * Defaults to true. If false, the user will not be permitted to drag a connection from the current node to itself.
     */
    allowLoopback?:boolean


    rank?:number

    /**
     * Optional selector identifying the ancestor of the event target that could be the element to which connections
     * are added. By default this is the internal attribute jsPlumb uses to mark managed elements (data-jtk-managed)
     */
    parentSelector?:string

    /**
     * This function offers a means for you to provide the anchor to use for
     * a new drag, or a drop. You're given the source/target element, the proportional location on
     * the element that the drag started/drop occurred, the associated type descriptor, and
     * the originating event.  Return null if you don't wish to provide a value,
     * and any other return value will be treated as an AnchorSpec.
     * @param el
     * @param elxy
     * @param def
     * @param e
     */
    anchorPositionFinder?:(el:Element, elxy:PointXY, def:BehaviouralTypeDescriptor, e:Event) => AnchorSpec|null
}

/**
 * Base interface for source/target definitions
 * @public
 */
export interface SourceOrTargetDefinition {
    enabled?:boolean
    def:BehaviouralTypeDescriptor
    endpoint?:Endpoint
    maxConnections?:number
    uniqueEndpoint?:boolean
}

/**
 * Defines the supported options on an `addSourceSelector` call.
 * @public
 */
export interface SourceDefinition extends SourceOrTargetDefinition { }


/**
 * Defines the supported options on an `addTargetSelector` call.
 * @public
 */
export interface TargetDefinition extends SourceOrTargetDefinition { }

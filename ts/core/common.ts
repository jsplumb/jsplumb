import {UIGroup} from "./group/group"
import {Endpoint} from "./endpoint/endpoint"
import {EndpointSpec} from "./endpoint/endpoint"
import {AnchorSpec} from "./factory/anchor-factory"
import {ConnectorSpec} from "./connector/abstract-connector"
import {FullOverlaySpec, OverlaySpec} from "./overlay/overlay"
import {PaintStyle} from "./styles"
import {Connection} from "./connector/connection-impl"

export type UUID = string

export interface jsPlumbElement<E> {
    _jsPlumbTargetDefinitions:Array<TargetDefinition>
    _jsPlumbSourceDefinitions:Array<SourceDefinition>
    _jsplumbid:string
    _jsPlumbGroup: UIGroup<E>
    _jsPlumbParentGroup:UIGroup<E>
    _jspContext?:any
    _jsPlumbConnections:Dictionary<boolean>
    _jsPlumbProxies:Array<[Connection, number]>
}

export interface ConnectParams {
    uuids?: [UUID, UUID]
    source?: Element | Endpoint
    target?: Element | Endpoint
    detachable?: boolean
    deleteEndpointsOnDetach?: boolean
    endpoint?: EndpointSpec
    anchor?: AnchorSpec
    anchors?: [AnchorSpec, AnchorSpec]
    label?: string
    connector?: ConnectorSpec
    overlays?:Array<OverlaySpec>
    endpoints?:[EndpointSpec, EndpointSpec]
    endpointStyles?:[PaintStyle, PaintStyle]
    endpointHoverStyles?:[PaintStyle, PaintStyle]
    endpointStyle?:PaintStyle
    endpointHoverStyle?:PaintStyle
    ports?:[string, string]
}

export interface InternalConnectParams<E> extends ConnectParams {
    sourceEndpoint?:Endpoint<E>
    targetEndpoint?:Endpoint<E>
    scope?:string
    type?:string
    newConnection?:(p:any) => Connection
}

export interface ConnectionEstablishedParams<E = any> {
    connection:Connection<E>
    source:E
    sourceEndpoint:Endpoint<E>
    sourceId:string
    target:E
    targetEndpoint:Endpoint<E>
    targetId:string
}

export interface ConnectionDetachedParams<E = any> extends ConnectionEstablishedParams<E> {

}

export interface ConnectionMovedParams<E = any>  {
    connection:Connection<E>
    index:number
    originalSourceId:string
    newSourceId:string
    originalTargetId:string
    newTargetId:string
    originalEndpoint:Endpoint<E>
    newEndpoint:Endpoint<E>
}

export interface TypeDescriptor {
    cssClass?:string
    paintStyle?:PaintStyle
    hoverPaintStyle?:PaintStyle
    parameters?:any
    overlays?:Array<OverlaySpec>
    overlayMap?:Dictionary<FullOverlaySpec>
    endpoints?:[ EndpointSpec, EndpointSpec ]
    endpoint?:EndpointSpec
    anchors?:[AnchorSpec, AnchorSpec]
    anchor?:AnchorSpec
    detachable?:boolean
    reattach?:boolean
    scope?:string
    connector?:ConnectorSpec
    mergeStrategy?:string
}

export interface BehaviouralTypeDescriptor extends TypeDescriptor {
    filter?:string | Function
    filterExclude?:boolean
    extract?:Dictionary<string>
    uniqueEndpoint?:boolean
    onMaxConnections?:(value:any, event?:any) => any
    connectionType?:string
    portId?:string
    allowLoopback?:boolean
}

export interface SourceOrTargetDefinition {
    enabled?:boolean
    def:BehaviouralTypeDescriptor
    endpoint?:Endpoint
    maxConnections?:number
    uniqueEndpoint?:boolean
}

export interface SourceDefinition extends SourceOrTargetDefinition { }
export interface TargetDefinition extends SourceOrTargetDefinition { }

export interface Size { w:number, h:number }

export type PointArray = [ number, number ]
export interface PointXY { x:number, y:number, theta?:number }
export type BoundingBox = { x:number, y:number, w:number, h:number, center?:PointXY }
export type RectangleXY = BoundingBox
export type LineXY = [ PointXY, PointXY ]

export interface UpdateOffsetOptions {
    timestamp?:string
    recalc?:boolean
    elId?:string
}

export interface ExtendedOffset extends PointXY {
    width?:number
    height?:number
    centerx?:number
    centery?:number
    bottom?:number
    right?:number
}

export interface Dictionary<T> {
    [Key: string]: T
}

export type SortFunction<T> = (a:T,b:T) => number

export type Constructable<T> = { new(...args: any[]): T }

export type Timestamp = string

export interface Rotation {r:number, c:PointXY}
export type Rotations = Array<Rotation>


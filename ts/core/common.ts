import {UIGroup} from "./group/group"
import {Endpoint} from "./endpoint/endpoint-impl"
import {EndpointSpec} from "./endpoint/endpoint"
import {AnchorSpec} from "./factory/anchor-factory"
import {ConnectorSpec} from "./connector/abstract-connector"
import {FullOverlaySpec, OverlaySpec} from "./overlay/overlay"
import {PaintStyle} from "./styles"
import {Connection} from "./connector/connection-impl"
import {EventGenerator} from "./event-generator"
import {AnchorManager} from "@jsplumb/core/anchor-manager"
import {jsPlumbDefaults} from "@jsplumb/core/defaults"
import {Renderer} from "@jsplumb/core/renderer"
import {jsPlumbGeometryHelpers} from "@jsplumb/core/geom"

export type UUID = string
export type ElementId = string
export type ElementRef = ElementId | any

export interface jsPlumbElement {
    _jsPlumbTargetDefinitions:Array<TargetDefinition>
    _jsPlumbSourceDefinitions:Array<SourceDefinition>
    _jsplumbid:string
    _jsPlumbGroup: UIGroup
    _jsPlumbParentGroup:UIGroup
    _jspContext?:any
}

export interface ConnectParams {
    uuids?: [UUID, UUID]
    source?: ElementRef | Endpoint
    target?: ElementRef | Endpoint
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

export interface InternalConnectParams extends ConnectParams {
    sourceEndpoint?:Endpoint
    targetEndpoint?:Endpoint
    scope?:string
    type?:string
    newConnection?:(p:any) => Connection
}

export interface ConnectionEstablishedParams {
    connection:Connection
    source:jsPlumbElement
    sourceEndpoint:Endpoint
    sourceId:string
    target:jsPlumbElement
    targetEndpoint:Endpoint
    targetId:string
}

export interface ConnectionDetachedParams extends ConnectionEstablishedParams {

}

export interface ConnectionMovedParams {
    connection:Connection,
    index:number,
    originalSourceId:string,
    newSourceId:string,
    originalTargetId:string,
    newTargetId:string,
    originalSourceEndpoint:Endpoint,
    newSourceEndpoint:Endpoint,
    originalTargetEndpoint:Endpoint,
    newTargetEndpoint:Endpoint
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
    onMaxConnections?:Function
    connectionType?:string
    portId?:string
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

export interface Offset {left:number, top:number}
export type Size = [ number, number ]
export type Rotation = number
export interface OffsetAndSize { o:Offset, s:Size }
export type PointArray = [ number, number ]
export interface PointXY { x:number, y:number, theta?:number }
export type BoundingBox = { x:number, y:number, w:number, h:number, center?:PointXY }
export type RectangleXY = BoundingBox
export type LineXY = [ PointXY, PointXY ]

export interface UpdateOffsetOptions {
    timestamp?:string
    recalc?:boolean
    offset?:Offset
    elId?:string
}

export type UpdateOffsetResult = {o:ExtendedOffset, s:Size, r:Rotation}

export interface ExtendedOffset extends Offset {
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

export type ElementSpec = string | any | Array<string | any>

export type SortFunction<T> = (a:T,b:T) => number

export type Constructable<T> = { new(...args: any[]): T }

export type Timestamp = string


// export interface JsPlumbInstance {
//
//     anchorManager:AnchorManager
//     Defaults:jsPlumbDefaults
//     renderer:Renderer
//     geometry:jsPlumbGeometryHelpers
//
//     convertToFullOverlaySpec(spec:string | OverlaySpec):FullOverlaySpec
//
//     info (el:string | any):{el:any, text?:boolean, id?:string}
//     bind (event: string | Array<String>, listener: Function, insertAtStart?: boolean): EventGenerator
//     getElement(el:any|string):any
//     getElementById(el:string):any
//     removeElement(el:any|string):void
//     appendElement (el:any, parent:any):void
//
//     removeClass(el:any, clazz:string):void
//     addClass(el:any, clazz:string):void
//     toggleClass(el:any, clazz:string):void
//     getClass(el:any):string
//     hasClass(el:any, clazz:string):boolean
//
//     setAttribute(el:any, name:string, value:string):void
//     getAttribute(el:any, name:string):string
//     setAttributes(el:any, atts:Dictionary<string>):void
//     removeAttribute(el:any, attName:string):void
//
//     getSelector(ctx:string | any, spec?:string):NodeListOf<any>
//     getStyle(el:any, prop:string):any
//
//     updateOffset(params?:UpdateOffsetOptions):UpdateOffsetResult
//
//     getSize(el:any):Size
//     _getOffset(el:any|string, relativeToRoot?:boolean, container?:any):Offset
//     setPosition(el:any, p:Offset):void
//     getUIPosition(eventArgs:any):Offset
//
//     on (el:any, event:string, callbackOrSelector:Function | string, callback?:Function):void
//     off (el:any, event:string, callback:Function):void
//     trigger(el:any, event:string, originalEvent?:Event, payload?:any):void
//
//     getDefaultScope ():string
//
//     deleteEndpoint(object:string | Endpoint):JsPlumbInstance
//
// }

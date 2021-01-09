import {AnchorSpec} from "../factory/anchor-factory"
import { Anchor} from "../anchor/anchor"
import {PaintStyle} from "../styles"
import {OverlaySpec} from "../overlay/overlay"
import {ComponentOptions} from "../component/component"
import {ConnectorSpec} from "../connector/abstract-connector"
import {Connection} from "../connector/connection-impl"
import {jsPlumbElement} from "../common"
import { Endpoint } from "./endpoint-impl"

export type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId
export type UserDefinedEndpointId = string
export type EndpointParams = any
export type EndpointSpec = EndpointId | [EndpointId, EndpointParams]

export interface EndpointOptions extends ComponentOptions {
    anchor?: AnchorSpec | Anchor
    anchors?:[ AnchorSpec, AnchorSpec ]
    endpoint?: EndpointSpec | Endpoint
    enabled?: boolean;//= true
    paintStyle?: PaintStyle
    hoverPaintStyle?: PaintStyle
    cssClass?: string
    hoverClass?: string
    maxConnections?: number;//= 1?
    connectorStyle?: PaintStyle
    connectorHoverStyle?: PaintStyle
    connector?: ConnectorSpec
    connectorOverlays?: Array<OverlaySpec>
    connectorClass?: string
    connectorHoverClass?: string
    connectionsDetachable?: boolean;//= true
    isSource?: boolean;//= false
    isTarget?: boolean;//= false
    reattach?: boolean;//= false
    parameters?: object

    data?:any

    isTemporarySource?:boolean

    connectionType?: string
    dragProxy?: string | Array<string>
    id?: string
    scope?: string
    reattachConnections?: boolean
    type?: string; // "Dot", etc.
    connectorTooltip?:string

    portId?:string
    uuid?:string
    source?:jsPlumbElement

    connections?:Array<Connection>

    "connector-pointer-events"?:string

    detachable?:boolean
    dragAllowedWhenFull?:boolean

    onMaxConnections?:Function

    connectionCost?:number
    connectionsDirected?:boolean
    deleteOnEmpty?:boolean

    elementId?:string
    _transient?:boolean
}

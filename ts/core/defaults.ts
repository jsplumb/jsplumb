import {EndpointStyle} from "./endpoint/endpoint"
import {PaintStyle} from "./styles"
import {OverlaySpec} from "./overlay/overlay"
import {AnchorSpec, ConnectorSpec, EndpointSpec} from "@jsplumb/common"

export interface ListSpec {
    endpoint?: EndpointSpec
}

export interface JsPlumbDefaults<E> {
    endpoint?: EndpointSpec
    endpoints?: [ EndpointSpec, EndpointSpec ]
    anchor?: AnchorSpec
    anchors?: [ AnchorSpec, AnchorSpec ]
    paintStyle?: PaintStyle
    hoverPaintStyle?: PaintStyle

    endpointStyle?: EndpointStyle
    endpointHoverStyle?: EndpointStyle
    endpointStyles?: [ EndpointStyle, EndpointStyle ]
    endpointHoverStyles?: [ EndpointStyle, EndpointStyle ],

    connectionsDetachable?: boolean
    reattachConnections?: boolean

    endpointOverlays?: Array<OverlaySpec>
    connectionOverlays?: Array<OverlaySpec>

    listStyle?: ListSpec

    container?: E
    connector?:ConnectorSpec
    scope?:string

    maxConnections?:number

    hoverClass?:string

    allowNestedGroups?:boolean

}


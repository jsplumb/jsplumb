import {EndpointSpec} from "./endpoint";
import {AnchorSpec} from "./factory/anchor-factory";
import {PaintStyle} from "./styles";
import {OverlaySpec} from "./overlay/overlay";
import {ConnectorSpec} from "./connector";
import {Offset, Size} from "./core";

export interface ListSpec {
    endpoint?: EndpointSpec;
}

export interface jsPlumbDefaults {
    endpoint?: EndpointSpec;
    endpoints?: [ EndpointSpec, EndpointSpec ];
    anchor?: AnchorSpec;
    anchors?: [ AnchorSpec, AnchorSpec ];
    paintStyle?: PaintStyle;
    hoverPaintStyle?: PaintStyle;

    endpointStyle?: PaintStyle;
    endpointHoverStyle?: PaintStyle;
    endpointStyles?: [ PaintStyle, PaintStyle ];
    endpointHoverStyles?: [ PaintStyle, PaintStyle ],

    connectionsDetachable?: boolean;
    reattachConnections?: boolean;

    endpointOverlays?: Array<OverlaySpec>;
    connectionOverlays?: Array<OverlaySpec>;

    listStyle?: ListSpec;

    container?: any; // string(selector or id) or element
    connector?:ConnectorSpec;
    scope?:string;

    maxConnections?:number;

    hoverClass?:string;
}

export interface jsPlumbHelperFunctions<E> {
    getSize?:(el:E) => Size;
    getOffset?:(el:E|string, relativeToRoot?:boolean, container?:E) => Offset;
}

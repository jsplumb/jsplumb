import {Endpoint} from "./endpoint";
import {Connection} from "./connection";

export type Selector = string;
export type UUID = string;
export type ElementId = string;
export type ElementRef = ElementId | Element;
export type ElementGroupRef = ElementId | Element | Array<ElementId> | Array<Element>;

export type LeftTopLocation = {
    left:number,
    top:number
}

export type ArrayLocation = Array<number>;

export type ParameterConfiguration = Boolean | string | Array<string|any>;

export type DefaultsContainer = {
    Anchor: ParameterConfiguration,
    Anchors: ParameterConfiguration,
    ConnectionsDetachable: Boolean,
    ConnectionOverlays: Array<ParameterConfiguration>,
    ConnectionType?:Connection<any,any>,
    Connector: ParameterConfiguration,
    Container: ElementRef,
    DoNotThrowErrors: Boolean,
    DragOptions: any,
    DropOptions: any,
    Endpoint: ParameterConfiguration,
    EndpointOverlays: Array<ParameterConfiguration>,
    Endpoints: Array<ParameterConfiguration>,
    EndpointStyle: any, // TODO Style object
    EndpointStyles: Array<any>, // TODO style object
    EndpointHoverStyle: any,
    EndpointHoverStyles: Array<any>,
    EndpointType:any,
    HoverPaintStyle: any,
    HoverClass:string,
    LabelStyle: any,
    LogEnabled: Boolean,
    Overlays: Array<ParameterConfiguration>,
    MaxConnections: number,
    PaintStyle: any,
    ReattachConnections: Boolean,
    Scope: string
}

export class DefaultsFactory {
    static getDefaults():DefaultsContainer {
        return {
            Anchor: "Bottom",
            Anchors: [ null, null ],
            ConnectionsDetachable: true,
            ConnectionOverlays: [ ],
            Connector: "Bezier",
            Container: null,
            DoNotThrowErrors: false,
            DragOptions: { },
            DropOptions: { },
            Endpoint: "Dot",
            EndpointOverlays: [ ],
            Endpoints: [ null, null ],
            EndpointStyle: { fill: "#456" },
            EndpointStyles: [ null, null ],
            EndpointHoverStyle: null,
            EndpointHoverStyles: [ null, null ],
            EndpointType:Endpoint,
            HoverClass:"",
            HoverPaintStyle: null,
            LabelStyle: { color: "black" },
            LogEnabled: false,
            Overlays: [ ],
            MaxConnections: 1,
            PaintStyle: { "stroke-width": 4, stroke: "#456" },
            ReattachConnections: false,
            Scope: "jsPlumb_DefaultScope"
        }
    }
}



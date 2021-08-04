import {PaintStyle} from "./paint-style"

export type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId
export type UserDefinedEndpointId = string
export type EndpointParams = any
export type FullEndpointSpec = {type:EndpointId, options:EndpointParams}
export type EndpointSpec = EndpointId | FullEndpointSpec
export interface EndpointStyle extends PaintStyle, Record<string, any> {}

export interface EndpointRepresentationParams {
    cssClass?:string
}

export interface DotEndpointParams extends EndpointRepresentationParams {
    radius?:number
}

export interface RectangleEndpointParams extends EndpointRepresentationParams {
    width?:number
    height?:number
}

export interface BlankEndpointParams extends EndpointRepresentationParams {}

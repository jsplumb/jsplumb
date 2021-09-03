import {PaintStyle} from "./paint-style"

/**
 * @public
 */
export type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId
/**
 * @public
 */
export type UserDefinedEndpointId = string
/**
 * @public
 */
export type EndpointParams = any
/**
 * @public
 */
export type FullEndpointSpec = {type:EndpointId, options:EndpointParams}
/**
 * @public
 */
export type EndpointSpec = EndpointId | FullEndpointSpec

/**
 * @public
 */
export interface EndpointStyle extends PaintStyle, Record<string, any> {}

/**
 * @public
 */
export interface EndpointRepresentationParams {
    cssClass?:string
}

/**
 * @public
 */
export interface DotEndpointParams extends EndpointRepresentationParams {
    radius?:number
}

/**
 * @public
 */
export interface RectangleEndpointParams extends EndpointRepresentationParams {
    width?:number
    height?:number
}

/**
 * @public
 */
export interface BlankEndpointParams extends EndpointRepresentationParams {}

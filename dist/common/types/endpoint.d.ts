import { PaintStyle } from "./paint-style";
/**
 * @public
 */
export declare type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;
/**
 * @public
 */
export declare type UserDefinedEndpointId = string;
/**
 * @public
 */
export declare type EndpointParams = any;
/**
 * @public
 */
export declare type FullEndpointSpec = {
    type: EndpointId;
    options: EndpointParams;
};
/**
 * @public
 */
export declare type EndpointSpec = EndpointId | FullEndpointSpec;
/**
 * @public
 */
export interface EndpointStyle extends PaintStyle, Record<string, any> {
}
/**
 * @public
 */
export interface EndpointRepresentationParams {
    cssClass?: string;
}
/**
 * @public
 */
export interface DotEndpointParams extends EndpointRepresentationParams {
    radius?: number;
}
/**
 * @public
 */
export interface RectangleEndpointParams extends EndpointRepresentationParams {
    width?: number;
    height?: number;
}
/**
 * @public
 */
export interface BlankEndpointParams extends EndpointRepresentationParams {
}
//# sourceMappingURL=endpoint.d.ts.map
import { PaintStyle } from "./paint-style";
export declare type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;
export declare type UserDefinedEndpointId = string;
export declare type EndpointParams = any;
export declare type FullEndpointSpec = {
    type: EndpointId;
    options: EndpointParams;
};
export declare type EndpointSpec = EndpointId | FullEndpointSpec;
export interface EndpointStyle extends PaintStyle, Record<string, any> {
}

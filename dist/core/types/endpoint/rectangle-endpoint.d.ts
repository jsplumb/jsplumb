import { EndpointRepresentation, EndpointRepresentationParams } from "./endpoints";
import { Endpoint } from "./endpoint";
import { EndpointHandler } from "../factory/endpoint-factory";
export declare type ComputedRectangleEndpoint = [number, number, number, number];
export interface RectangleEndpointParams extends EndpointRepresentationParams {
    width?: number;
    height?: number;
}
export declare class RectangleEndpoint extends EndpointRepresentation<ComputedRectangleEndpoint> {
    width: number;
    height: number;
    constructor(endpoint: Endpoint, params?: RectangleEndpointParams);
    static type: string;
    type: string;
    static _getParams(ep: RectangleEndpoint): Record<string, any>;
}
export declare const RectangleEndpointHandler: EndpointHandler<RectangleEndpoint, ComputedRectangleEndpoint>;

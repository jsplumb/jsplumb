import { EndpointRepresentation, EndpointRepresentationParams } from "./endpoints";
import { Endpoint } from "./endpoint";
import { EndpointHandler } from "../factory/endpoint-factory";
export declare type ComputedDotEndpoint = [number, number, number, number, number];
export interface DotEndpointParams extends EndpointRepresentationParams {
    radius?: number;
}
export declare class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {
    radius: number;
    defaultOffset: number;
    defaultInnerRadius: number;
    constructor(endpoint: Endpoint, params?: DotEndpointParams);
    static type: string;
    type: string;
}
export declare const DotEndpointHandler: EndpointHandler<DotEndpoint, ComputedDotEndpoint>;

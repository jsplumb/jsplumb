import { EndpointRepresentation, EndpointRepresentationParams } from "./endpoints";
import { Endpoint } from "./endpoint";
import { EndpointHandler } from "../factory/endpoint-factory";
export declare type ComputedBlankEndpoint = [number, number, number, number];
export interface BlankEndpointParams extends EndpointRepresentationParams {
}
export declare class BlankEndpoint extends EndpointRepresentation<ComputedBlankEndpoint> {
    constructor(endpoint: Endpoint, params?: BlankEndpointParams);
    static type: string;
    type: string;
}
export declare const BlankEndpointHandler: EndpointHandler<BlankEndpoint, ComputedBlankEndpoint>;

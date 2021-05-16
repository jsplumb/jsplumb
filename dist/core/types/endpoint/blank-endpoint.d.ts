import { EndpointRepresentation, EndpointRepresentationParams } from "./endpoints";
import { Orientation } from "../factory/anchor-record-factory";
import { Endpoint } from "./endpoint";
import { AnchorPlacement } from "../router/router";
export declare type ComputedBlankEndpoint = [number, number, number, number];
export interface BlankEndpointParams extends EndpointRepresentationParams {
}
export declare class BlankEndpoint extends EndpointRepresentation<ComputedBlankEndpoint> {
    constructor(endpoint: Endpoint, params?: BlankEndpointParams);
    getParams(): Record<string, any>;
    _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): ComputedBlankEndpoint;
    static type: string;
    type: string;
}

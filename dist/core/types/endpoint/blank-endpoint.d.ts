import { EndpointRepresentation } from "./endpoints";
import { Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint";
import { AnchorPlacement } from "../router/router";
export declare type ComputedBlankEndpoint = [number, number, number, number];
export interface BlankEndpointParams {
}
export declare class BlankEndpoint extends EndpointRepresentation<ComputedBlankEndpoint> {
    constructor(endpoint: Endpoint, params?: BlankEndpointParams);
    getParams(): Record<string, any>;
    _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): ComputedBlankEndpoint;
    static type: string;
    getType(): string;
}

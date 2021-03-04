import { EndpointRepresentation } from "./endpoints";
import { Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint";
import { AnchorPlacement } from "../router/router";
export declare type ComputedDotEndpoint = [number, number, number, number, number];
export interface DotEndpointParams {
    radius?: number;
}
export declare class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {
    radius: number;
    defaultOffset: number;
    defaultInnerRadius: number;
    constructor(endpoint: Endpoint, params?: DotEndpointParams);
    getParams(): Record<string, any>;
    _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): ComputedDotEndpoint;
    static type: string;
    getType(): string;
}

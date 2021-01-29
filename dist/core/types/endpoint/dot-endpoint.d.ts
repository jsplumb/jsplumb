import { EndpointRepresentation } from "./endpoints";
import { Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint";
import { AnchorPlacement } from "../router/router";
export declare type ComputedDotEndpoint = [number, number, number, number, number];
export declare class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {
    radius: number;
    defaultOffset: number;
    defaultInnerRadius: number;
    constructor(endpoint: Endpoint, params?: any);
    _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): ComputedDotEndpoint;
    static dotEndpointType: string;
    getType(): string;
}
export declare function register(): void;

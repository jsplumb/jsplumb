import { EndpointRepresentation } from "./endpoints";
import { Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint";
import { AnchorPlacement } from "../router/router";
export declare type ComputedRectangleEndpoint = [number, number, number, number];
export interface RectangleEndpointParams {
    width?: number;
    height?: number;
}
export declare class RectangleEndpoint extends EndpointRepresentation<ComputedRectangleEndpoint> {
    width: number;
    height: number;
    constructor(endpoint: Endpoint, params?: RectangleEndpointParams);
    getParams(): Record<string, any>;
    _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): ComputedRectangleEndpoint;
    static type: string;
    getType(): string;
}

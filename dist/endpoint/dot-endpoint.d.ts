import { EndpointRepresentation } from "./endpoints";
import { ComputedAnchorPosition, Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint-impl";
export declare type ComputedDotEndpoint = [number, number, number, number, number];
export declare class DotEndpoint<E> extends EndpointRepresentation<E, ComputedDotEndpoint> {
    radius: number;
    defaultOffset: number;
    defaultInnerRadius: number;
    constructor(endpoint: Endpoint<E>, params?: any);
    _compute(anchorPoint: ComputedAnchorPosition, orientation: Orientation, endpointStyle: any): ComputedDotEndpoint;
    getType(): string;
}

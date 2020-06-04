import { EndpointRepresentation } from "./endpoints";
import { ComputedAnchorPosition, Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint-impl";
export declare type ComputedBlankEndpoint = [number, number, number, number];
export declare class BlankEndpoint<E> extends EndpointRepresentation<ComputedBlankEndpoint> {
    constructor(endpoint: Endpoint, params?: any);
    _compute(anchorPoint: ComputedAnchorPosition, orientation: Orientation, endpointStyle: any): ComputedBlankEndpoint;
    getType(): string;
}

import { EndpointRepresentation } from "./endpoints";
import { Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint-impl";
import { AnchorPlacement } from "../anchor-manager";
export declare type ComputedBlankEndpoint = [number, number, number, number];
export declare class BlankEndpoint<E> extends EndpointRepresentation<ComputedBlankEndpoint> {
    constructor(endpoint: Endpoint, params?: any);
    _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): ComputedBlankEndpoint;
    getType(): string;
}

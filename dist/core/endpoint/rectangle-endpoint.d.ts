import { EndpointRepresentation } from "./endpoints";
import { Orientation } from "../factory/anchor-factory";
import { Endpoint } from "./endpoint-impl";
import { AnchorPlacement } from "../anchor-manager";
export declare type ComputedRectangleEndpoint = [number, number, number, number];
export declare class RectangleEndpoint<E> extends EndpointRepresentation<ComputedRectangleEndpoint> {
    width: number;
    height: number;
    constructor(endpoint: Endpoint, params?: any);
    _compute(anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any): ComputedRectangleEndpoint;
    getType(): string;
}

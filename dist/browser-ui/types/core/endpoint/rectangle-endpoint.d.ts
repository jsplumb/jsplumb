import { EndpointRepresentation } from "./endpoints";
import { Endpoint } from "./endpoint";
import { EndpointHandler } from "../factory/endpoint-factory";
import { RectangleEndpointParams } from "../../common/endpoint";
export declare type ComputedRectangleEndpoint = [number, number, number, number];
export declare class RectangleEndpoint extends EndpointRepresentation<ComputedRectangleEndpoint> {
    width: number;
    height: number;
    constructor(endpoint: Endpoint, params?: RectangleEndpointParams);
    static type: string;
    type: string;
    static _getParams(ep: RectangleEndpoint): Record<string, any>;
}
export declare const RectangleEndpointHandler: EndpointHandler<RectangleEndpoint, ComputedRectangleEndpoint>;
//# sourceMappingURL=rectangle-endpoint.d.ts.map
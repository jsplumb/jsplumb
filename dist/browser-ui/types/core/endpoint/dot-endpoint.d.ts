import { EndpointRepresentation } from "./endpoints";
import { Endpoint } from "./endpoint";
import { EndpointHandler } from "../factory/endpoint-factory";
import { DotEndpointParams } from "../../common/endpoint";
export declare type ComputedDotEndpoint = [number, number, number, number, number];
export declare class DotEndpoint extends EndpointRepresentation<ComputedDotEndpoint> {
    radius: number;
    defaultOffset: number;
    defaultInnerRadius: number;
    constructor(endpoint: Endpoint, params?: DotEndpointParams);
    static type: string;
    type: string;
}
export declare const DotEndpointHandler: EndpointHandler<DotEndpoint, ComputedDotEndpoint>;
//# sourceMappingURL=dot-endpoint.d.ts.map
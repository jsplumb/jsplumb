import { EndpointRepresentation } from "../endpoint/endpoints";
import { Endpoint } from "../endpoint/endpoint";
import { Orientation } from "../factory/anchor-record-factory";
import { Constructable } from "../../util/util";
import { AnchorPlacement } from "../../common/anchor";
export declare type EndpointComputeFunction<T> = (endpoint: EndpointRepresentation<T>, anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any) => T;
export declare const EndpointFactory: {
    get: (ep: Endpoint, name: string, params: any) => EndpointRepresentation<any>;
    clone: <C>(epr: EndpointRepresentation<C>) => EndpointRepresentation<C>;
    compute: <T>(endpoint: EndpointRepresentation<T>, anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any) => T;
    registerHandler: <E, T_1>(eph: EndpointHandler<E, T_1>) => void;
};
export interface EndpointHandler<E, T> {
    type: string;
    compute: EndpointComputeFunction<T>;
    getParams(endpoint: E): Record<string, any>;
    cls: Constructable<EndpointRepresentation<T>>;
}
//# sourceMappingURL=endpoint-factory.d.ts.map
import { EndpointRepresentation } from "../endpoint/endpoints";
import { Endpoint } from "../endpoint/endpoint";
import { Orientation } from "../factory/anchor-record-factory";
import { Constructable } from "@jsplumb/util";
import { AnchorPlacement } from "@jsplumb/common";
export declare type EndpointComputeFunction<T> = (endpoint: EndpointRepresentation<T>, anchorPoint: AnchorPlacement, orientation: Orientation, endpointStyle: any) => T;
export declare const EndpointFactory: {
    get: (ep: Endpoint<any>, name: string, params: any) => EndpointRepresentation<any>;
    clone: <C>(epr: EndpointRepresentation<C>) => EndpointRepresentation<C>;
    compute: <T>(endpoint: EndpointRepresentation<T>, anchorPoint: AnchorPlacement, orientation: [number, number], endpointStyle: any) => T;
    registerHandler: <E, T>(eph: EndpointHandler<E, T>) => void;
};
export interface EndpointHandler<E, T> {
    type: string;
    compute: EndpointComputeFunction<T>;
    getParams(endpoint: E): Record<string, any>;
    cls: Constructable<EndpointRepresentation<T>>;
}

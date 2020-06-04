import { EndpointRepresentation } from "../endpoint/endpoints";
import { Constructable } from "../core";
import { Endpoint } from "../endpoint/endpoint-impl";
export declare const EndpointFactory: {
    get: (ep: Endpoint, name: string, params: any) => EndpointRepresentation<any>;
    register: (name: string, ep: Constructable<EndpointRepresentation<any>>) => void;
};

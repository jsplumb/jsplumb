import { EndpointRepresentation } from "../endpoint/endpoints";
import { Constructable } from "../core";
import { Endpoint } from "../endpoint/endpoint-impl";
export declare const EndpointFactory: {
    get: (ep: Endpoint<any>, name: string, params: any) => EndpointRepresentation<any, any>;
    register: (name: string, ep: Constructable<EndpointRepresentation<any, any>>) => void;
};

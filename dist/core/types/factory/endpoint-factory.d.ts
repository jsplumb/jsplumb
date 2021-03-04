import { EndpointRepresentation } from "../endpoint/endpoints";
import { Constructable } from "../common";
import { Endpoint } from "../endpoint/endpoint";
export declare const EndpointFactory: {
    get: (ep: Endpoint<any>, name: string, params: any) => EndpointRepresentation<any>;
    register: (name: string, ep: Constructable<EndpointRepresentation<any>>) => void;
    clone: <C>(epr: EndpointRepresentation<C>) => EndpointRepresentation<C>;
};

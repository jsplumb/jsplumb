import {EndpointRepresentation} from "../endpoint/endpoints";
import {Constructable, Dictionary} from "../core";
import {Endpoint} from "../endpoint/endpoint-impl";
const endpointMap:Dictionary<Constructable<EndpointRepresentation<any>>> = {};

export const EndpointFactory = {
    get:(ep:Endpoint, name:string, params:any):EndpointRepresentation<any> => {

        let e:Constructable<EndpointRepresentation<any>> = endpointMap[name];
        if (!e) {
            throw {message:"jsPlumb: unknown endpoint type '" + name + "'"};
        } else {
            return new e(ep, params) as EndpointRepresentation<any>;
        }
    },

    register:(name:string, ep:Constructable<EndpointRepresentation<any>>) => {
        endpointMap[name] = ep;
    }
};

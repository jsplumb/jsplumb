import {EndpointRepresentation} from "../endpoint/endpoints";
import {Constructable, Dictionary, jsPlumbInstance} from "../core";
import {Endpoint} from "../endpoint/endpoint-impl";
const endpointMap:Dictionary<Constructable<EndpointRepresentation<any, any>>> = {};

export const EndpointFactory = {
    get:(ep:Endpoint<any>, name:string, params:any):EndpointRepresentation<any, any> => {

        let e:Constructable<EndpointRepresentation<any, any>> = endpointMap[name];
        if (!e) {
            throw {message:"jsPlumb: unknown endpoint type '" + name + "'"};
        } else {
            return new e(ep, params) as EndpointRepresentation<any, any>;
        }
    },

    register:(name:string, ep:Constructable<EndpointRepresentation<any, any>>) => {
        endpointMap[name] = ep;
    }
};

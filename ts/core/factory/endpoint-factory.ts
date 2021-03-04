import {EndpointRepresentation} from "../endpoint/endpoints"
import {Constructable, Dictionary} from "../common"
import {Endpoint} from "../endpoint/endpoint"
const endpointMap:Dictionary<Constructable<EndpointRepresentation<any>>> = {}

export const EndpointFactory = {
    get:(ep:Endpoint, name:string, params:any):EndpointRepresentation<any> => {

        let e:Constructable<EndpointRepresentation<any>> = endpointMap[name]
        if (!e) {
            throw {message:"jsPlumb: unknown endpoint type '" + name + "'"}
        } else {
            return new e(ep, params) as EndpointRepresentation<any>
        }
    },

    register:(name:string, ep:Constructable<EndpointRepresentation<any>>) => {
        endpointMap[name] = ep
    },

    clone:<C>(epr:EndpointRepresentation<C>):EndpointRepresentation<C> => {
        return EndpointFactory.get(epr.endpoint, epr.getType(), epr.getParams())
    }
}

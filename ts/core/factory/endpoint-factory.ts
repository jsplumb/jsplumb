import {EndpointRepresentation} from "../endpoint/endpoints"
import {Endpoint} from "../endpoint/endpoint"
import {Orientation} from "../factory/anchor-record-factory"
import {Constructable, log} from "../../util/util"
import {AnchorPlacement} from "../../common/anchor"

const endpointMap:Record<string, Constructable<EndpointRepresentation<any>>> = {}
const endpointComputers:Record<string, EndpointComputeFunction<any>> = {}
const handlers:Record<string, EndpointHandler<any, any>> = {}

export type EndpointComputeFunction<T> = (endpoint:EndpointRepresentation<T>, anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any) => T

export const EndpointFactory = {
    get:(ep:Endpoint, name:string, params:any):EndpointRepresentation<any> => {

        let e:Constructable<EndpointRepresentation<any>> = endpointMap[name]
        if (!e) {
            throw {message:"jsPlumb: unknown endpoint type '" + name + "'"}
        } else {
            return new e(ep, params) as EndpointRepresentation<any>
        }
    },

    clone:<C>(epr:EndpointRepresentation<C>):EndpointRepresentation<C> => {
        const handler = handlers[epr.type]
        return EndpointFactory.get(epr.endpoint, epr.type, handler.getParams(epr))
    },

    compute:<T>(endpoint:EndpointRepresentation<T>, anchorPoint:AnchorPlacement, orientation:Orientation, endpointStyle:any):T => {
      const c = endpointComputers[endpoint.type]
      if (c != null) {
          return c(endpoint, anchorPoint, orientation, endpointStyle)
      } else {
          log("jsPlumb: cannot find endpoint calculator for endpoint of type ", endpoint.type)
      }
    },

    registerHandler:<E,T>(eph:EndpointHandler<E, T>) => {
        handlers[eph.type] = eph
        endpointMap[eph.type] = eph.cls
        endpointComputers[eph.type] = eph.compute
    }
}

export interface EndpointHandler<E, T> {
    type:string
    compute:EndpointComputeFunction<T>
    getParams(endpoint:E):Record<string, any>
    cls:Constructable<EndpointRepresentation<T>>
}

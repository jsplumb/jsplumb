import {Endpoint} from "./endpoint/endpoint-impl";

export interface ProxyConnection<E>{
    originalEp:Endpoint<E>;
}
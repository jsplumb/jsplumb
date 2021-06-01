import { Endpoint } from "./endpoint/endpoint";
import { Connection } from "./connector/connection-impl";
/**
 * Definition of the parameters passed to a listener for the `connection` event.
 */
export interface ConnectionEstablishedParams<E = any> {
    connection: Connection<E>;
    source: E;
    sourceEndpoint: Endpoint<E>;
    sourceId: string;
    target: E;
    targetEndpoint: Endpoint<E>;
    targetId: string;
}
/**
 * Definition of the parameters passed to a listener for the `connection:detach` event.
 */
export interface ConnectionDetachedParams<E = any> extends ConnectionEstablishedParams<E> {
}
/**
 * Definition of the parameters passed to a listener for the `connection:move` event.
 */
export interface ConnectionMovedParams<E = any> {
    connection: Connection<E>;
    index: number;
    originalSourceId: string;
    newSourceId: string;
    originalTargetId: string;
    newTargetId: string;
    originalEndpoint: Endpoint<E>;
    newEndpoint: Endpoint<E>;
}
/**
 * Definition of the parameters passed to the `beforeDrop` interceptor.
 */
export interface BeforeDropParams {
    sourceId: string;
    targetId: string;
    scope: string;
    connection: Connection;
    dropEndpoint: Endpoint;
}
export interface ManageElementParams<E = any> {
    el: E;
}
export interface UnmanageElementParams<E = any> {
    el: E;
}

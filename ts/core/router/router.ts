import {Connection} from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint'
import { Offset } from '../common'
import {ViewportElement} from "../viewport"

export interface RedrawResult {
    c:Set<Connection>
    e:Set<Endpoint>
}

export type AnchorPlacement = [ number, number, number, number ]
export type ContinuousAnchorPlacement = [ number, number, number, number, Connection, Connection ]

export interface Router {

    reset ():void

    redraw (elementId:string, ui?:ViewportElement, timestamp?:string, offsetToUI?:Offset):RedrawResult

    addEndpoint (endpoint:Endpoint, elementId:string):void

    computePath(connection:Connection, timestamp:string):void

    elementRemoved(id:string):void

    // TODO we dont want this method. it only delegates to anchorManager, which should listen to an event.
    clearContinuousAnchorPlacement(elementId:string):void

    // TODO we dont want this either.
    getContinuousAnchorLocation(elementId:string):[number, number, number, number]

    // TODO or this
    getContinuousAnchorOrientation(endpointId:string):[number, number]

}

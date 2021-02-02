import {Connection} from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint'
import { Offset } from '../common'
import {ViewportElement} from "../viewport"
import {Anchor} from "../anchor/anchor"
import {AnchorComputeParams, Orientation} from "../factory/anchor-factory"

export interface RedrawResult {
    c:Set<Connection>
    e:Set<Endpoint>
}

export type AnchorPlacement = [ number, number, number, number ]
export type ContinuousAnchorPlacement = [ number, number, number, number, Connection, Connection ]

export interface Router {

    reset ():void

    redraw (elementId:string, ui?:ViewportElement, timestamp?:string, offsetToUI?:Offset):RedrawResult

    computePath(connection:Connection, timestamp:string):void
    computeAnchorLocation(anchor:Anchor, params:AnchorComputeParams):AnchorPlacement

    // TODO does this definitely have to be exposed, or does all the code that calls it now site inside router?
    getAnchorOrientation(anchor:Anchor, endpoint?: Endpoint): Orientation
    getEndpointOrientation(endpoint: Endpoint): Orientation

}

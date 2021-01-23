import {Connection} from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint-impl'
import { Offset } from '../common'
import {ViewportElement} from "../viewport"
import {RedrawResult} from "../anchor-manager"


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

import {Connection} from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint-impl'
import { Offset } from '../common'


export interface Router {

    reset ():void

    changeId (oldId:string, newId:string):void

    newConnection (conn:Connection):void

    connectionDetached (connInfo:any):void

    redraw (elementId:string, ui?:Offset, timestamp?:string, offsetToUI?:Offset):void

    deleteEndpoint (endpoint:Endpoint):void

    rehomeEndpoint (ep:Endpoint, currentId:string, element:any):void

    addEndpoint (endpoint:Endpoint, elementId:string):void

    computePath(connection:Connection, timestamp:string):void

}

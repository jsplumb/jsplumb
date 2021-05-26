import {Connection} from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint'
import { PointXY } from '@jsplumb/util'
import {
    AnchorComputeParams,
    AnchorSpec, Face,
    LightweightContinuousAnchor,
    Orientation
} from "../factory/anchor-record-factory"

export interface RedrawResult {
    c:Set<Connection>
    e:Set<Endpoint>
}

export type AnchorPlacement = {
    curX:number,
    curY:number,
    x:number,
    y:number,
    ox:number,
    oy:number
}

export interface Router<T extends {E:unknown}, A> {

    reset ():void

    redraw (elementId:string, timestamp?:string, offsetToUI?:PointXY):RedrawResult

    computePath(connection:Connection, timestamp:string):void
    computeAnchorLocation(anchor:A, params:AnchorComputeParams):AnchorPlacement

    getEndpointLocation(endpoint: Endpoint<any>, params:AnchorComputeParams): AnchorPlacement

    // TODO does this definitely have to be exposed, or does all the code that calls it now site inside router?
    getAnchorOrientation(anchor:A, endpoint?: Endpoint): Orientation
    getEndpointOrientation(endpoint: Endpoint): Orientation

    setAnchor(endpoint:Endpoint, anchor:A):void
    prepareAnchor(endpoint:Endpoint, params:AnchorSpec | Array<AnchorSpec>):A
    setConnectionAnchors(conn:Connection, anchors:[A, A]):void
    isDynamicAnchor(ep:Endpoint):boolean

    isFloating(ep:Endpoint):boolean

    setCurrentFace (a:LightweightContinuousAnchor, face:Face, overrideLock?:boolean):void

    lock(a:A):void
    unlock(a:A):void

    anchorsEqual(a:A, b:A):boolean

    selectAnchorLocation(a:A, coords:{x:number, y:number}):boolean


}

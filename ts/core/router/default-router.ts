import {Router} from "./router"
import {AnchorManager, RedrawResult} from "../anchor-manager"
import { JsPlumbInstance } from "../core"
import { Offset } from '../common'
import { Connection } from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint-impl'
import {ViewportElement} from "../viewport"

/*
 * Default router. Defers to an AnchorManager for placement of anchors, and connector paint routines for paths.
 * Currently this is a placeholder and acts as a facade to the pre-existing anchor manager. The Toolkit edition
 * will make use of concept to provide more advanced routing.
 *
 * Copyright (c) 2010 - 2020 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
export class DefaultRouter implements Router {
    readonly anchorManager:AnchorManager;

    constructor(public instance:JsPlumbInstance ) {
        this.anchorManager = new AnchorManager(this.instance)
    }

    reset ():void {
        this.anchorManager.reset()
    }

    newConnection (conn:Connection):void {
        this.anchorManager.newConnection(conn)
    }

    connectionDetached (connInfo:any):void {
        this.anchorManager.connectionDetached(connInfo)
    }

    redraw (elementId:string, ui?:ViewportElement, timestamp?:string, offsetToUI?:Offset):RedrawResult {
        return this.anchorManager.redraw(elementId, ui, timestamp, offsetToUI)
    }

    deleteEndpoint (endpoint:Endpoint):void {
        this.anchorManager.deleteEndpoint(endpoint)
    }

    rehomeEndpoint (ep:Endpoint, currentId:string, element:any):void {
        this.anchorManager.rehomeEndpoint(ep, currentId, element)
    }

    addEndpoint (endpoint:Endpoint, elementId:string):void {
        this.anchorManager.addEndpoint(endpoint, elementId)
    }

    elementRemoved(id: string): void {
        // here we'd cleanup the anchor manager, ideally. there's a lot of shared responsibility between DefaultRouter and AnchorManager currently.
    }

    computePath(connection: Connection, timestamp:string): void {
        let sourceInfo = this.instance.updateOffset({elId:connection.sourceId}),
            // TODO dont create these intermediate sourceOffset/targetOffset objects, just use the ViewportElements.
            sourceOffset = {left:sourceInfo.x, top:sourceInfo.y},
            targetInfo = this.instance.updateOffset({elId:connection.targetId}),
            targetOffset = {left:targetInfo.x, top:targetInfo.y},
            sE = connection.endpoints[0], tE = connection.endpoints[1]

        let sAnchorP = sE.anchor.getCurrentLocation({
                    xy: [sourceInfo.x, sourceInfo.y],
                    wh: [sourceInfo.w, sourceInfo.h],
                    element: sE,
                    timestamp: timestamp,
                    rotation:sourceInfo.r
            }),
            tAnchorP = tE.anchor.getCurrentLocation({
                xy: [targetInfo.x, targetInfo.y],
                wh: [targetInfo.w, targetInfo.h],
                element: tE,
                timestamp: timestamp,
                rotation:targetInfo.r
            })

        connection.connector.resetBounds()

        connection.connector.compute({
            sourcePos: sAnchorP,
            targetPos: tAnchorP,
            sourceOrientation:sE.anchor.getOrientation(sE),
            targetOrientation:tE.anchor.getOrientation(tE),
            sourceEndpoint: connection.endpoints[0],
            targetEndpoint: connection.endpoints[1],
            strokeWidth: connection.paintStyleInUse.strokeWidth,
            sourceInfo: sourceOffset,
            targetInfo: targetOffset
        })
    }
}

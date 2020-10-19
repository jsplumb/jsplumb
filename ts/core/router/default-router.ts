import {Router} from "./router"
import {AnchorManager} from "../anchor-manager"
import { JsPlumbInstance } from "../core"
import { Offset } from '../common'
import { Connection } from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint-impl'

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
    anchorManager:AnchorManager;

    constructor(public instance:JsPlumbInstance ) {
        this.anchorManager = new AnchorManager(this.instance)
    }

    reset ():void {
        this.anchorManager.reset()
    }

    changeId (oldId:string, newId:string):void {
        this.anchorManager.changeId(oldId, newId)
    }

    newConnection (conn:Connection):void {
        this.anchorManager.newConnection(conn)
    }

    connectionDetached (connInfo:any):void {
        this.anchorManager.connectionDetached(connInfo)
    }

    redraw (elementId:string, ui?:Offset, timestamp?:string, offsetToUI?:Offset):void {
        this.anchorManager.redraw(elementId, ui, timestamp, offsetToUI)
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

    computePath(connection: Connection, timestamp:string): void {
        let sourceInfo = this.instance.updateOffset({elId:connection.sourceId}),
            sourceOffset = sourceInfo.o,
            targetInfo = this.instance.updateOffset({elId:connection.targetId}),
            targetOffset = targetInfo.o,
            sE = connection.endpoints[0], tE = connection.endpoints[1]

        let sAnchorP = sE.anchor.getCurrentLocation({
                    xy: [sourceOffset.left, sourceOffset.top],
                    wh: [sourceOffset.width, sourceOffset.height],
                    element: sE,
                    timestamp: timestamp,
                    rotation:sourceInfo.r
            }),
            tAnchorP = tE.anchor.getCurrentLocation({
                xy: [targetOffset.left, targetOffset.top],
                wh: [targetOffset.width, targetOffset.height],
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

/*



(function () {

    "use strict"

    var root = this,
        _ju = root.jsPlumbUtil,
        _jp = root.jsPlumb

    _jp.DefaultRouter = function(jsPlumbInstance) {
        this.jsPlumbInstance = jsPlumbInstance
        this.anchorManager = new _jp.AnchorManager({jsPlumbInstance:jsPlumbInstance})

        this.sourceOrTargetChanged = function (originalId, newId, connection, newElement, anchorIndex) {
            this.anchorManager.sourceOrTargetChanged(originalId, newId, connection, newElement, anchorIndex)
        }
    }



}).call(typeof window !== 'undefined' ? window : this)



*/

import {Router} from "./router"
import {AnchorManager} from "../anchor-manager"
import {Connection, Endpoint, jsPlumbInstance, Offset} from ".."

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

    constructor(public instance:jsPlumbInstance ) {
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

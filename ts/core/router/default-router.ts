import {Router, ContinuousAnchorPlacement, RedrawResult} from "./router"

import { JsPlumbInstance } from "../core"
import { Connection } from '../connector/connection-impl'
import { Endpoint } from '../endpoint/endpoint'
import {ViewportElement} from "../viewport"

import {
    ConnectionDetachedParams,
    Dictionary,
    Offset,
    PointArray,
    PointXY,
    SortFunction
} from "../common"


import {Face, Orientation} from "../factory/anchor-factory"
import { DynamicAnchor } from "../anchor/dynamic-anchor"
import {findWithFunction, removeWithFunction, rotatePoint, rotatePointXY, sortHelper, uuid} from "../util"
import {ContinuousAnchor} from "../anchor/continuous-anchor"

import * as Constants from '../constants'

function placeAnchorsOnLine(element:ViewportElement, connections:Array<any>, horizontal:boolean, otherMultiplier:number, reverse:boolean):Array<ContinuousAnchorPlacement> {

    const sizeInAxis = horizontal ? element.w : element.h
    const sizeInOtherAxis = horizontal ? element.h : element.w
    let a:Array<ContinuousAnchorPlacement> = [], step = sizeInAxis / (connections.length + 1)

    for (let i = 0; i < connections.length; i++) {
        let val = (i + 1) * step, other = otherMultiplier * sizeInOtherAxis
        if (reverse) {
            val = sizeInAxis - val
        }

        let dx = (horizontal ? val : other), x = element.x + dx, xp = dx / element.w
        let dy = (horizontal ? other : val), y = element.y + dy, yp = dy / element.h

        if (element.r !== 0 && element.r != null) {
            const rotated = rotatePoint([x, y], element.c, element.r);
            x = rotated[0];
            y = rotated[1];
        }

        a.push([ x, y, xp, yp, connections[i][1], connections[i][2] ])
    }

    return a
}

function rightAndBottomSort (a:AnchorListEntry, b:AnchorListEntry):number {
    return b[0][0] - a[0][0]
}

// used by edgeSortFunctions
function leftAndTopSort(a:AnchorListEntry, b:AnchorListEntry):number {
    let p1 = a[0][0] < 0 ? -Math.PI - a[0][0] : Math.PI - a[0][0],
        p2 = b[0][0] < 0 ? -Math.PI - b[0][0] : Math.PI - b[0][0]

    return p1 - p2
}

// used by placeAnchors
const edgeSortFunctions:Dictionary<SortFunction<AnchorListEntry>> = {
    "top": leftAndTopSort,
    "right": rightAndBottomSort,
    "bottom": rightAndBottomSort,
    "left": leftAndTopSort
}

interface ConnectionFacade {
    endpoints: [ Endpoint, Endpoint ],
    paint:() => any
}

interface OrientationResult {
    orientation?:string,
    a:[Face, Face],
    theta?:number,
    theta2?:number
}

// internal data models for the anchor manager
type AnchorListEntry = [ PointArray, Connection, boolean, string, string ]
type AnchorLists = { top: Array<AnchorListEntry>, right: Array<AnchorListEntry>, bottom: Array<AnchorListEntry>, left: Array<AnchorListEntry> }
type AnchorDictionary = Dictionary<AnchorLists>

/*
 * Default router. Defers to an AnchorManager for placement of anchors, and connector paint routines for paths.
 * Currently this is a placeholder and acts as a facade to the pre-existing anchor manager. The Toolkit edition
 * will make use of concept to provide more advanced routing.
 *
 * Copyright (c) 2010 - 2021 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
export class DefaultRouter<T extends {E:unknown}> implements Router {
    // TODO we don't want to expose the anchor manager on the instance (and as of RC35 that's been done). but we dont want to expose it on Router, either.
    // this cast would currently mean any alternative Router could fail (if it didn't expose an anchorManager).
    // this is something that will need to be refactored before the Toolkit edition 4.x can be released.
    //readonly anchorManager:AnchorManager;

    continuousAnchorLocations:Dictionary<[number, number, number, number]> = {}
    continuousAnchorOrientations:Dictionary<Orientation> = {}

    private anchorLists:AnchorDictionary = {}

    constructor(public instance:JsPlumbInstance ) {
        //this.anchorManager = new AnchorManager(this.instance)
        instance.bind<ConnectionDetachedParams<T["E"]>>(Constants.EVENT_INTERNAL_CONNECTION_DETACHED, (p:ConnectionDetachedParams<T["E"]>) => {
            this.connectionDetached(p)
        })
    }

    reset ():void {
        //this.anchorManager.reset()
        this.anchorLists = {}
    }


    // TODO we dont want this in here either.
    getContinuousAnchorLocation(elementId: string): [number, number, number, number] {
        return this.continuousAnchorLocations[elementId] || [0, 0, 0, 0]
    }

    // TODO or this.
    getContinuousAnchorOrientation(endpointId: string): [number, number] {
        return this.continuousAnchorOrientations[endpointId] || [0, 0]
    }

    addEndpoint (endpoint:Endpoint, elementId:string):void {
        // no-op. method required?
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

    // ----------------- continuous anchors -----------
    private placeAnchors (instance:JsPlumbInstance, elementId:string, _anchorLists:AnchorLists):void {
        let cd:ViewportElement = instance.getCachedData(elementId),
            placeSomeAnchors = (desc:string, element:ViewportElement, unsortedConnections:Array<AnchorListEntry>, isHorizontal:boolean, otherMultiplier:number, orientation:Orientation) => {
                if (unsortedConnections.length > 0) {
                    let sc = sortHelper(unsortedConnections, edgeSortFunctions[desc]), // puts them in order based on the target element's pos on screen
                        reverse = desc === "right" || desc === "top",
                        anchors = placeAnchorsOnLine(cd, sc,
                            isHorizontal,
                            otherMultiplier,
                            reverse)

                    // takes a computed anchor position and adjusts it for parent offset and scroll, then stores it.
                    let _setAnchorLocation = (endpoint:Endpoint, anchorPos:ContinuousAnchorPlacement) => {
                        this.continuousAnchorLocations[endpoint.id] = [ anchorPos[0], anchorPos[1], anchorPos[2], anchorPos[3] ]
                        this.continuousAnchorOrientations[endpoint.id] = orientation
                    }

                    for (let i = 0; i < anchors.length; i++) {
                        let c = anchors[i][4], weAreSource = c.endpoints[0].elementId === elementId, weAreTarget = c.endpoints[1].elementId === elementId
                        if (weAreSource) {
                            _setAnchorLocation(c.endpoints[0], anchors[i])
                        }
                        if (weAreTarget) {
                            _setAnchorLocation(c.endpoints[1], anchors[i])
                        }
                    }
                }
            }

        placeSomeAnchors("bottom", cd, _anchorLists.bottom, true, 1, [0, 1])
        placeSomeAnchors("top", cd, _anchorLists.top, true, 0, [0, -1])
        placeSomeAnchors("left", cd, _anchorLists.left, false, 0, [-1, 0])
        placeSomeAnchors("right", cd, _anchorLists.right, false, 1, [1, 0])
    }

    clearContinuousAnchorPlacement(endpointId:string) {
        delete this.continuousAnchorLocations[endpointId]
    }

    private removeEndpointFromAnchorLists (endpoint:Endpoint):void {
        (function (list, eId) {
            if (list) {  // transient anchors dont get entries in this list.
                let f = (e:AnchorListEntry) => {
                    return e[4] === eId
                }
                removeWithFunction(list.top, f)
                removeWithFunction(list.left, f)
                removeWithFunction(list.bottom, f)
                removeWithFunction(list.right, f)
            }
        })(this.anchorLists[endpoint.elementId], endpoint.id)
    }

    private connectionDetached (params:ConnectionDetachedParams<T["E"]>) {
        // TODO this is DOM specific. core should not know.
        if (params.connection.floatingId) {
            this.removeEndpointFromAnchorLists(params.connection.floatingEndpoint)
        }
        // remove from anchorLists
        this.removeEndpointFromAnchorLists(params.sourceEndpoint)
        this.removeEndpointFromAnchorLists(params.targetEndpoint)
    }

    deleteEndpoint (endpoint:Endpoint) {
        this.removeEndpointFromAnchorLists(endpoint)
    }

    // updates the given anchor list by either updating an existing anchor's info, or adding it. this function
    // also removes the anchor from its previous list, if the edge it is on has changed.
    // all connections found along the way (those that are connected to one of the faces this function
    // operates on) are added to the connsToPaint list, as are their endpoints. in this way we know to repaint
    // them wthout having to calculate anything else about them.
    private _updateAnchorList (lists:AnchorLists, theta:number, order:number, conn:ConnectionFacade, aBoolean:boolean, otherElId:string, idx:number, reverse:boolean, edgeId:string, connsToPaint:Set<Connection>, endpointsToPaint:Set<Endpoint>) {
        // first try to find the exact match, but keep track of the first index of a matching element id along the way.s
        let exactIdx = -1,
            firstMatchingElIdx = -1,
            endpoint = conn.endpoints[idx],
            endpointId = endpoint.id,
            oIdx = [1, 0][idx],
            values = [
                [ theta, order ],
                conn,
                aBoolean,
                otherElId,
                endpointId
            ],
            listToAddTo = lists[edgeId],
            listToRemoveFrom = (endpoint as any)._continuousAnchorEdge ? lists[(endpoint as any)._continuousAnchorEdge] : null,
            candidate:Connection

        if (listToRemoveFrom) {
            let rIdx = findWithFunction(listToRemoveFrom, function (e) {
                return e[4] === endpointId
            })
            if (rIdx !== -1) {
                listToRemoveFrom.splice(rIdx, 1)
                // get all connections from this list
                for (let i = 0; i < listToRemoveFrom.length; i++) {
                    candidate = listToRemoveFrom[i][1]

                    connsToPaint.add(candidate)
                    endpointsToPaint.add(listToRemoveFrom[i][1].endpoints[idx])
                    endpointsToPaint.add(listToRemoveFrom[i][1].endpoints[oIdx])
                }
            }
        }

        for (let i = 0; i < listToAddTo.length; i++) {
            candidate = listToAddTo[i][1]

            connsToPaint.add(candidate)

            endpointsToPaint.add(listToAddTo[i][1].endpoints[idx])
            endpointsToPaint.add(listToAddTo[i][1].endpoints[oIdx])
        }
        if (exactIdx !== -1) {
            listToAddTo[exactIdx] = values
        }
        else {
            let insertIdx = reverse ? firstMatchingElIdx !== -1 ? firstMatchingElIdx : 0 : listToAddTo.length; // of course we will get this from having looked through the array shortly.
            listToAddTo.splice(insertIdx, 0, values)
        }

        // store this for next time.
        (endpoint as any)._continuousAnchorEdge = edgeId
    }

    redraw (elementId:string, ui?:ViewportElement, timestamp?:string, offsetToUI?:Offset):RedrawResult {

        let connectionsToPaint:Set<Connection> = new Set(),
            endpointsToPaint:Set<Endpoint> = new Set(),
            anchorsToUpdate:Set<string> = new Set()

        if (!this.instance._suspendDrawing) {

            // get all the endpoints for this element
            let ep = this.instance.endpointsByElement[elementId] || []

            timestamp = timestamp || uuid()
            // offsetToUI are values that would have been calculated in the dragManager when registering
            // an endpoint for an element that had a parent (somewhere in the hierarchy) that had been
            // registered as draggable.
            offsetToUI = offsetToUI || {left: 0, top: 0}
            let offsetToUse = null
            // TODO updateOffset should take an OffsetAndSize object, not a ViewportElement.
            if (ui) {
                offsetToUse = {
                    left: ui.x + offsetToUI.left,
                    top: ui.y + offsetToUI.top
                }
            }

            // valid for one paint cycle.
            this.instance.updateOffset({ elId: elementId, offset: offsetToUse, recalc: false, timestamp: timestamp })
            let orientationCache = {}

            for(let anEndpoint of ep) {

                endpointsToPaint.add(anEndpoint)

                if (anEndpoint.connections.length === 0) {
                    if (anEndpoint.anchor.isContinuous) {
                        if (!this.anchorLists[elementId]) {
                            this.anchorLists[elementId] = { top: [], right: [], bottom: [], left: [] }
                        }
                        this._updateAnchorList(
                            this.anchorLists[elementId],
                            -Math.PI / 2,
                            0,
                            {endpoints: [anEndpoint, anEndpoint], paint: function () { }},
                            false,
                            elementId,
                            0,
                            false,
                            (<ContinuousAnchor>anEndpoint.anchor).getDefaultFace(),
                            connectionsToPaint,
                            endpointsToPaint)
                        anchorsToUpdate.add(elementId)
                    }

                } else {
                    for (let i = 0; i < anEndpoint.connections.length; i++) {
                        let conn = anEndpoint.connections[i],
                            sourceId = conn.sourceId,
                            targetId = conn.targetId,
                            sourceContinuous = conn.endpoints[0].anchor.isContinuous,
                            targetContinuous = conn.endpoints[1].anchor.isContinuous

                        if (sourceContinuous || targetContinuous) {
                            let oKey = sourceId + "_" + targetId,
                                o = orientationCache[oKey],
                                oIdx = conn.sourceId === elementId ? 1 : 0

                            if (sourceContinuous && !this.anchorLists[sourceId]) {
                                this.anchorLists[sourceId] = { top: [], right: [], bottom: [], left: [] }
                            }
                            if (targetContinuous && !this.anchorLists[targetId]) {
                                this.anchorLists[targetId] = { top: [], right: [], bottom: [], left: [] }
                            }

                            if (elementId !== targetId) {
                                this.instance.updateOffset({ elId: targetId, timestamp: timestamp })
                            }
                            if (elementId !== sourceId) {
                                this.instance.updateOffset({ elId: sourceId, timestamp: timestamp })
                            }

                            let td = this.instance.getCachedData(targetId),
                                sd = this.instance.getCachedData(sourceId)

                            if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                                // here we may want to improve this by somehow determining the face we'd like
                                // to put the connector on.  ideally, when drawing, the face should be calculated
                                // by determining which face is closest to the point at which the mouse button
                                // was released.  for now, we're putting it on the top face.
                                this._updateAnchorList( this.anchorLists[sourceId], -Math.PI / 2, 0, conn, false, targetId, 0, false, "top", connectionsToPaint, endpointsToPaint)
                                this._updateAnchorList( this.anchorLists[targetId], -Math.PI / 2, 0, conn, false, sourceId, 1, false, "top", connectionsToPaint, endpointsToPaint)
                            }
                            else {
                                const sourceRotation = this.instance.getRotation(sourceId);
                                const targetRotation = this.instance.getRotation(targetId);

                                if (!o) {
                                    o = this.calculateOrientation(sourceId, targetId, sd, td,
                                        (conn.endpoints[0].anchor as ContinuousAnchor),
                                        (conn.endpoints[1].anchor as ContinuousAnchor),
                                        sourceRotation,
                                        targetRotation)
                                    orientationCache[oKey] = o
                                }
                                if (sourceContinuous) {
                                    this._updateAnchorList(this.anchorLists[sourceId], o.theta, 0, conn, false, targetId, 0, false, o.a[0], connectionsToPaint, endpointsToPaint)
                                }
                                if (targetContinuous) {
                                    this._updateAnchorList(this.anchorLists[targetId], o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], connectionsToPaint, endpointsToPaint)
                                }
                            }

                            if (sourceContinuous) {
                                anchorsToUpdate.add(sourceId)
                            }
                            if (targetContinuous) {
                                anchorsToUpdate.add(targetId)
                            }

                            connectionsToPaint.add(conn)

                            if ((sourceContinuous && oIdx === 0) || (targetContinuous && oIdx === 1)) {
                                endpointsToPaint.add(conn.endpoints[oIdx])
                            }
                        }
                        else {
                            let otherEndpoint = anEndpoint.connections[i].endpoints[conn.sourceId === elementId ? 1 : 0]

                            if (otherEndpoint.anchor.constructor === DynamicAnchor) {

                                this.instance.paintEndpoint(otherEndpoint, { elementWithPrecedence: elementId, timestamp: timestamp })

                                connectionsToPaint.add(anEndpoint.connections[i])

                                // all the connections for the other endpoint now need to be repainted
                                for (let k = 0; k < otherEndpoint.connections.length; k++) {
                                    if (otherEndpoint.connections[k] !== anEndpoint.connections[i]) {
                                        connectionsToPaint.add(otherEndpoint.connections[k])
                                    }
                                }
                            } else {
                                connectionsToPaint.add(anEndpoint.connections[i])
                            }
                        }
                    }
                }
            }

            // now place all the continuous anchors we need to
            for (let anchor of anchorsToUpdate) {
                this.placeAnchors(this.instance, anchor, this.anchorLists[anchor])
            }

            // now that continuous anchors have been placed, paint all the endpoints for this element and any other endpoints we came across as a result of the continuous anchors.
            for (let ep of endpointsToPaint) {
                let cd = this.instance.getCachedData(ep.elementId)
                this.instance.paintEndpoint(ep, { timestamp: timestamp, offset: cd })
            }

            // paint all the connections
            for (let c of connectionsToPaint) {
                c.paint({elId: elementId, timestamp: timestamp, recalc: false})
            }
        }

        return {
            c:connectionsToPaint,
            e:endpointsToPaint
        }
    }


    private calculateOrientation (sourceId:string, targetId:string,
                                  sd:ViewportElement, td:ViewportElement,
                                  sourceAnchor:ContinuousAnchor,
                                  targetAnchor:ContinuousAnchor,
                                  sourceRotation:number,
                                  targetRotation:number):OrientationResult {

        let Orientation = { HORIZONTAL: "horizontal", VERTICAL: "vertical", DIAGONAL: "diagonal", IDENTITY: "identity" }

        if (sourceId === targetId) {
            return {
                orientation: Orientation.IDENTITY,
                a: ["top", "top"]
            }
        }

        // since we only support rotation around the center of an element these two lines don't have to take rotation
        // into account.
        let theta = Math.atan2((td.c[1] - sd.c[1]), (td.c[0]- sd.c[0])),
            theta2 = Math.atan2((sd.c[1] - td.c[1]), (sd.c[0] - td.c[0]))

// --------------------------------------------------------------------------------------

        // improved face calculation. get midpoints of each face for source and target, then put in an array with all combinations of
        // source/target faces. sort this array by distance between midpoints. the entry at index 0 is our preferred option. we can
        // go through the array one by one until we find an entry in which each requested face is supported.
        let candidates:Array<{source:Face, target:Face, dist:number}> = [], midpoints:Dictionary<{
                top:PointXY,
                left:PointXY,
                right:PointXY,
                bottom:PointXY
            }> = { }
        ;(function (types:Array<string>, dim:Array<[ViewportElement, number]>) {
            for (let i = 0; i < types.length; i++) {
                midpoints[types[i]] = {
                    "left": {x:dim[i][0].x, y:dim[i][0].c[1] },
                    "right": {x:dim[i][0].x + dim[i][0].w, y:dim[i][0].c[1] },
                    "top": {x:dim[i][0].c[0], y:dim[i][0].y },
                    "bottom": {x:dim[i][0].c[0], y:dim[i][0].y + dim[i][0].h}
                }

                if (dim[i][1] !== 0) {
                    for (let axis in midpoints[types[i]]) {
                        midpoints[types[i]][axis] = rotatePointXY(midpoints[types[i]][axis], {x:dim[i][0].c[0], y:dim[i][0].c[1]}, dim[i][1]);
                    }
                }

            }
        })([ "source", "target" ], [ [ sd, sourceRotation], [td, targetRotation] ])

        let FACES:Array<Face> = [ "top", "right", "left", "bottom" ]

        for (let sf = 0; sf < FACES.length; sf++) {
            for (let tf = 0; tf < FACES.length; tf++) {
                candidates.push({
                    source: FACES[sf],
                    target: FACES[tf],
                    dist: this.instance.geometry.lineLength(midpoints.source[FACES[sf]], midpoints.target[FACES[tf]])
                })
            }
        }

        candidates.sort(function (a, b) {
            if (a.dist < b.dist) {
                return -1
            } else if (b.dist < a.dist) {
                return 1
            } else {
                const axisIndices = {
                        "left":0,
                        "top":1,
                        "right":2,
                        "bottom":3
                    },
                    ais = axisIndices[a.source],
                    bis = axisIndices[b.source],
                    ait = axisIndices[a.target],
                    bit = axisIndices[b.target]

                return ais < bis ? -1 : bis < ais ? 1 : ait < bit ? -1 : bit < ait ? 1 : 0
            }
        })

        // now go through this list and try to get an entry that satisfies both (there will be one, unless one of the anchors
        // declares no available faces)
        let sourceEdge = candidates[0].source, targetEdge = candidates[0].target
        for (let i = 0; i < candidates.length; i++) {

            if (sourceAnchor.isContinuous && sourceAnchor.locked) {
                sourceEdge = sourceAnchor.getCurrentFace()
            }
            else if (!sourceAnchor.isContinuous || sourceAnchor.isEdgeSupported(candidates[i].source)) {
                sourceEdge = candidates[i].source
            }
            else {
                sourceEdge = null
            }

            if (targetAnchor.isContinuous && targetAnchor.locked) {
                targetEdge = targetAnchor.getCurrentFace()
            }
            else if (!targetAnchor.isContinuous || targetAnchor.isEdgeSupported(candidates[i].target)) {
                targetEdge = candidates[i].target
            }
            else {
                targetEdge = null
            }

            if (sourceEdge != null && targetEdge != null) {
                break
            }
        }

        if (sourceAnchor.isContinuous) {
            sourceAnchor.setCurrentFace(sourceEdge)
        }

        if (targetAnchor.isContinuous) {
            targetAnchor.setCurrentFace(targetEdge)
        }

// --------------------------------------------------------------------------------------

        return {
            a: [ sourceEdge, targetEdge ],
            theta: theta,
            theta2: theta2
        }
    }
}

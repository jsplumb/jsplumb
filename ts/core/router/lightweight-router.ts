
import {Endpoint} from "../endpoint/endpoint"
import {
    AnchorComputeParams,
    AnchorOrientationHint,
    ComputedPosition,
    Face, getDefaultFace, isEdgeSupported,
    Orientation,
    X_AXIS_FACES, Y_AXIS_FACES,
    AnchorRecord,
    LightweightAnchor,
    LightweightContinuousAnchor,
    LightweightFloatingAnchor, makeLightweightAnchorFromSpec,
    TOP, BOTTOM, LEFT, RIGHT
} from "../factory/anchor-record-factory"
import {ConnectionDetachedParams} from "../callbacks"
import {RedrawResult, Router} from "./router"
import {Connection} from "../connector/connection-impl"
import {JsPlumbInstance} from "../core"
import * as Constants from "../constants"

import {ViewportElement} from "../viewport"
import {SOURCE, TARGET} from "../constants"
import {
    extend,
    findWithFunction,
    forEach,
    PointXY,
    removeWithFunction, RotatedPointXY, rotatePoint,
    Rotations,
    Size,
    SortFunction,
    uuid
} from "../../util/util"
import {lineLength} from "../../util/geom"
import {AnchorPlacement, AnchorSpec} from "../../common/anchor"


// -------------------- internal data structures --------------------------------------

interface ConnectionFacade {
    endpoints: [ Endpoint, Endpoint ]
    placeholder?:boolean
}

interface OrientationResult {
    orientation?:string,
    a:[Face, Face],
    theta?:number,
    theta2?:number
}

// TODO surely we want anchorId:string,  here
type AnchorListEntry = {theta:number, order:number, c:ConnectionFacade, b:boolean, elId:string, epId:string }
type AnchorLists = { top: Array<AnchorListEntry>, right: Array<AnchorListEntry>, bottom: Array<AnchorListEntry>, left: Array<AnchorListEntry> }
type ContinuousAnchorPlacement = { x:number, y:number, xLoc:number, yLoc:number, c:ConnectionFacade  }

function _placeAnchorsOnLine<E>(element:ViewportElement<E>, connections:Array<AnchorListEntry>, horizontal:boolean, otherMultiplier:number, reverse:boolean):Array<ContinuousAnchorPlacement> {

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
            const rotated = rotatePoint({x, y}, element.c, element.r);
            x = rotated.x;
            y = rotated.y;
        }

        a.push({ x, y, xLoc:xp, yLoc:yp, c:connections[i].c })
    }

    return a
}

function _rightAndBottomSort (a:AnchorListEntry, b:AnchorListEntry):number {
    return b.theta - a.theta
}

// used by edgeSortFunctions
function _leftAndTopSort(a:AnchorListEntry, b:AnchorListEntry):number {
    let p1 = a.theta < 0 ? -Math.PI - a.theta : Math.PI - a.theta,
        p2 = b.theta < 0 ? -Math.PI - b.theta : Math.PI - b.theta

    return p1 - p2
}

// used by placeAnchors
const edgeSortFunctions:Record<string, SortFunction<AnchorListEntry>> = {
    [TOP]: _leftAndTopSort,
    [RIGHT]: _rightAndBottomSort,
    [BOTTOM]: _rightAndBottomSort,
    [LEFT]: _leftAndTopSort
}

// -------------------- / internal data structures --------------------------------------

export function isContinuous(a:LightweightAnchor):a is LightweightContinuousAnchor {
    return a.isContinuous === true
}

export function isFloating(a:LightweightAnchor):a is LightweightFloatingAnchor {
    return a.isContinuous === true
}

export function isDynamic(a:LightweightAnchor):boolean {
    return a.locations.length > 1
}

function getCurrentLocation(anchor:LightweightAnchor):[number, AnchorRecord] {
    return [anchor.currentLocation, anchor.locations[anchor.currentLocation]]
}

export class LightweightRouter<T extends {E:unknown}> implements Router<T, LightweightAnchor>  {

    anchorLists:Map<string, AnchorLists> = new Map()
    anchorLocations:Map<string, AnchorPlacement> = new Map()

    constructor(public instance:JsPlumbInstance ) {
        instance.bind<ConnectionDetachedParams<T["E"]>>(Constants.EVENT_INTERNAL_CONNECTION_DETACHED, (p:ConnectionDetachedParams<T["E"]>) => {
            if (p.sourceEndpoint._anchor.isContinuous) {
                this._removeEndpointFromAnchorLists(p.sourceEndpoint)
            }
            if (p.targetEndpoint._anchor.isContinuous) {
                this._removeEndpointFromAnchorLists(p.targetEndpoint)
            }
        })

        instance.bind<Endpoint<T["E"]>>(Constants.EVENT_INTERNAL_ENDPOINT_UNREGISTERED, (ep:Endpoint<T["E"]>) => {
            this._removeEndpointFromAnchorLists(ep)
        })
    }

    getAnchorOrientation(anchor:LightweightAnchor): Orientation {
        const loc = this.anchorLocations.get(anchor.id)
        return loc ? [loc.ox, loc.oy] :  [0,0]
    }

    private _distance(anchor:AnchorRecord, cx:number, cy:number, xy:PointXY, wh:Size, rotation:Rotations, targetRotation:Rotations):number {

        let ax = xy.x + (anchor.x * wh.w), ay = xy.y + (anchor.y * wh.h),
            acx = xy.x + (wh.w / 2), acy = xy.y + (wh.h / 2)

        if(rotation != null && rotation.length > 0) {
            const rotated = this.instance._applyRotations([ax,ay, 0, 0], rotation)
            ax = rotated.x
            ay = rotated.y
        }

        return (Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2)))
    }

    private _anchorSelector(xy:PointXY, wh:Size, txy:PointXY, twh:Size, rotation:Rotations, targetRotation:Rotations, locations:Array<AnchorRecord>):[number, AnchorRecord] {

        let cx = txy.x + (twh.w / 2), cy = txy.y + (twh.h / 2)
        let minIdx = -1, minDist = Infinity
        for (let i = 0; i < locations.length; i++) {
            let d = this._distance(locations[i], cx, cy, xy, wh, rotation, targetRotation)
            if (d < minDist) {
                minIdx = i + 0
                minDist = d
            }
        }
        return [minIdx, locations[minIdx]]
    }

    private _floatingAnchorCompute(anchor:LightweightFloatingAnchor, params:AnchorComputeParams):AnchorPlacement {
        let xy = params.xy
        const pos = {curX:xy.x + (anchor.size.w / 2), curY:xy.y + (anchor.size.h / 2), x:0, y:0, ox:0 as AnchorOrientationHint, oy:0 as AnchorOrientationHint } // return origin of the element. we may wish to improve this so that any object can be the drag proxy.
        return this._setComputedPosition(anchor, pos)
    }

    private _setComputedPosition(anchor:LightweightAnchor, pos:ComputedPosition, timestamp?:string):ComputedPosition {
        this.anchorLocations.set(anchor.id, pos)
        anchor.computedPosition = pos
        if (timestamp) {
            anchor.timestamp = timestamp
        }
        return pos
    }

    private _computeSingleLocation(loc:AnchorRecord, xy:PointXY, wh:Size, params:AnchorComputeParams):AnchorPlacement {

        let pos:AnchorPlacement
        //console.log(params.element.elementId, xy, wh, params)
        const rotation = params.rotation
        const candidate:AnchorPlacement = {curX:xy.x + (loc.x * wh.w) + loc.offx, curY:xy.y + (loc.y * wh.h) + loc.offy, x:loc.x, y:loc.y, ox:0, oy:0 }

        if (rotation != null && rotation.length > 0) {

            let o = [loc.iox,loc.ioy],
                current:RotatedPointXY = {x:candidate.curX, y:candidate.curY, cr:0, sr:0}

            forEach(rotation, (r) => {
                current = rotatePoint(current, r.c, r.r)
                let _o:AnchorOrientationHint[] = [ Math.round((o[0] * current.cr) - (o[1] * current.sr)),
                    Math.round((o[1] * current.cr) + (o[0] * current.sr)) ] as AnchorOrientationHint[]
                o = _o.slice()
            })

            loc.ox = o[0]
            loc.oy = o[1]
            pos = {curX:current.x, curY:current.y, x:loc.x, y:loc.y, ox:o[0], oy:o[1] }

        } else {
            loc.ox = loc.iox
            loc.oy = loc.ioy
            pos = extend({
                ox:loc.iox,
                oy:loc.ioy
            } as any, candidate)
        }

        return pos
    }

    /**
     * Computes the position for an anchor that has only a single location. This is analogous to the
     * original `Anchor` class.
     * @param anchor
     * @param params
     * @internal
     */
    private _singleAnchorCompute(anchor:LightweightAnchor, params:AnchorComputeParams):AnchorPlacement {

        let xy = params.xy,
            wh = params.wh,
            timestamp = params.timestamp,
            pos = this.anchorLocations.get(anchor.id)

        if (pos != null && timestamp && timestamp === anchor.timestamp) {
            return pos
        }
        const [_, currentLoc] = getCurrentLocation(anchor)
        pos = this._computeSingleLocation(currentLoc, xy, wh, params)
        return this._setComputedPosition(anchor, pos, timestamp)
    }

    /**
     * Computes the position for an anchor that is neither floating nor continuous. This case covers what
     * was previously both DynamicAnchor and Anchor, since those concepts have now been folded into
     * a single concept - any given anchor has one or more locations.
     * @param anchor
     * @param params
     */
    private _defaultAnchorCompute(anchor:LightweightAnchor, params:AnchorComputeParams):AnchorPlacement {

        let pos:AnchorPlacement

        if (anchor.locations.length === 1) {
            return this._singleAnchorCompute(anchor, params)
        }

        let xy = params.xy, wh = params.wh, txy = params.txy, twh = params.twh

        const [currentIdx, currentLoc] = getCurrentLocation(anchor)
        if (anchor.locked || txy == null || twh == null) {
            pos = this._computeSingleLocation(currentLoc, xy, wh, params)
        } else {
            const [newIdx, newLoc] = this._anchorSelector(xy, wh, txy, twh, params.rotation, params.tRotation, anchor.locations)
            anchor.currentLocation = newIdx


            if(newIdx !== currentIdx) {
                anchor.cssClass = newLoc.cls || anchor.cssClass
                params.element._anchorLocationChanged(anchor)
            }
            pos = this._computeSingleLocation(newLoc, xy, wh, params)
        }

        return this._setComputedPosition(anchor, pos, params.timestamp)
    }

    private _placeAnchors (elementId:string, _anchorLists:AnchorLists):void {
        let cd:ViewportElement<any> = this.instance.viewport.getPosition(elementId),
            placeSomeAnchors = (desc:string, element:ViewportElement<any>, unsortedConnections:Array<AnchorListEntry>, isHorizontal:boolean, otherMultiplier:number, orientation:Orientation) => {
                if (unsortedConnections.length > 0) {
                    let sc = unsortedConnections.sort(edgeSortFunctions[desc]), // puts them in order based on the target element's pos on screen
                        reverse = desc === RIGHT || desc === TOP,
                        anchors = _placeAnchorsOnLine(cd, sc,
                            isHorizontal,
                            otherMultiplier,
                            reverse)

                    for (let i = 0; i < anchors.length; i++) {
                        const c = anchors[i].c, weAreSource = c.endpoints[0].elementId === elementId,
                            ep = weAreSource ? c.endpoints[0] : c.endpoints[1]

                        this._setComputedPosition(ep._anchor, {curX:anchors[i].x, curY:anchors[i].y, x:anchors[i].xLoc, y:anchors[i].yLoc, ox:orientation[0], oy:orientation[1] })
                    }
                }
            }

        placeSomeAnchors(BOTTOM, cd, _anchorLists.bottom, true, 1, [0, 1])
        placeSomeAnchors(TOP, cd, _anchorLists.top, true, 0, [0, -1])
        placeSomeAnchors(LEFT, cd, _anchorLists.left, false, 0, [-1, 0])
        placeSomeAnchors(RIGHT, cd, _anchorLists.right, false, 1, [1, 0])
    }

    private _updateAnchorList (lists:AnchorLists, theta:number, order:number, conn:ConnectionFacade, aBoolean:boolean, otherElId:string, idx:number, reverse:boolean, edgeId:string, connsToPaint:Set<ConnectionFacade>, endpointsToPaint:Set<Endpoint>) {
        // first try to find the exact match, but keep track of the first index of a matching element id along the way.s
        let exactIdx = -1,
            firstMatchingElIdx = -1,
            endpoint = conn.endpoints[idx],
            endpointId = endpoint.id,
            oIdx = [1, 0][idx],
            values:AnchorListEntry = {
                theta, order,
                c:conn,
                b:aBoolean,
                elId:otherElId,
                epId:endpointId
            },
            listToAddTo = lists[edgeId],
            listToRemoveFrom:Array<AnchorListEntry> = (endpoint as any)._continuousAnchorEdge ? lists[(endpoint as any)._continuousAnchorEdge] : null,
            candidate:ConnectionFacade

        if (listToRemoveFrom) {
            let rIdx = findWithFunction(listToRemoveFrom, (e:AnchorListEntry) => {
                return e.epId === endpointId
            })
            if (rIdx !== -1) {
                listToRemoveFrom.splice(rIdx, 1)
                // get all connections from this list
                for (let i = 0; i < listToRemoveFrom.length; i++) {
                    candidate = listToRemoveFrom[i].c

                    if (candidate.placeholder !== true) {
                        connsToPaint.add(candidate)
                    }
                    endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[idx])
                    endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[oIdx])
                }
            }
        }

        for (let i = 0; i < listToAddTo.length; i++) {
            candidate = listToAddTo[i].c

            if (candidate.placeholder !== true) {
                connsToPaint.add(candidate)
            }

            endpointsToPaint.add(listToAddTo[i].c.endpoints[idx])
            endpointsToPaint.add(listToAddTo[i].c.endpoints[oIdx])
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

    private _removeEndpointFromAnchorLists (endpoint:Endpoint):void {
        const listsForElement = this.anchorLists.get(endpoint.elementId)
        let total = 0;

        (function (list, eId) {
            if (list) {  // transient anchors dont get entries in this list.
                let f = (e:AnchorListEntry) => {
                    return e.epId === eId
                }
                removeWithFunction(list.top, f)
                removeWithFunction(list.left, f)
                removeWithFunction(list.bottom, f)
                removeWithFunction(list.right, f)

                total += list.top.length
                total += list.left.length
                total += list.bottom.length
                total += list.right.length
            }
        })(listsForElement, endpoint.id)

        // remove entry from anchor lists if there are no anchors left.
        if (total === 0) {
            this.anchorLists.delete(endpoint.elementId)
        }

        this.anchorLocations.delete(endpoint._anchor.id)
    }

    computeAnchorLocation(anchor: LightweightAnchor, params: AnchorComputeParams): AnchorPlacement {
        let pos:AnchorPlacement
        if (isContinuous(anchor)) {
            pos = this.anchorLocations.get(anchor.id) || {curX:0, curY:0, x:0, y:0, ox:0, oy:0}
        } else if (isFloating(anchor)) {
            pos = this._floatingAnchorCompute(anchor, params)
        } else {
            pos = this._defaultAnchorCompute(anchor, params)
        }

        anchor.timestamp = params.timestamp
        return pos
    }

    computePath(connection: Connection<any>, timestamp: string): void {
        let sourceInfo = this.instance.viewport.getPosition(connection.sourceId),
            targetInfo = this.instance.viewport.getPosition(connection.targetId),
            sE = connection.endpoints[0], tE = connection.endpoints[1]

        let sAnchorP = this.getEndpointLocation(sE, {
                xy: sourceInfo,
                wh: sourceInfo,
                element: sE,
                timestamp: timestamp,
                rotation:this.instance._getRotations(connection.sourceId)
            }),
            tAnchorP = this.getEndpointLocation(tE, {
                xy: targetInfo,
                wh: targetInfo,
                element: tE,
                timestamp: timestamp,
                rotation:this.instance._getRotations(connection.targetId)
            })

        connection.connector.resetBounds()

        connection.connector.compute({
            sourcePos: sAnchorP,
            targetPos: tAnchorP,
            sourceEndpoint: connection.endpoints[0],
            targetEndpoint: connection.endpoints[1],
            strokeWidth: connection.paintStyleInUse.strokeWidth,
            sourceInfo: sourceInfo,
            targetInfo: targetInfo
        })
    }

    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement {
        params = params || {}
        const anchor = endpoint._anchor
        let pos = this.anchorLocations.get(anchor.id)
        if (pos == null || (params.timestamp != null && anchor.timestamp !== params.timestamp)) {
            pos = this.computeAnchorLocation(anchor, params)
            this._setComputedPosition(anchor, pos, params.timestamp)
        }
        return pos
    }

    getEndpointOrientation(ep: Endpoint<any>): Orientation {
        return ep._anchor ? this.getAnchorOrientation(ep._anchor) : [0,0]
    }

    setAnchorOrientation(anchor:LightweightAnchor, orientation:Orientation):void {
        const anchorLoc = this.anchorLocations.get(anchor.id)
        if (anchorLoc != null) {
            anchorLoc.ox = orientation[0]
            anchorLoc.oy = orientation[1]
        }
    }

    // TODO this method should not need to be called. for now, a placeholder implementation, which
    // returns whether or not the endpoint is not continuous and has more than one placement
    isDynamicAnchor(ep: Endpoint<any>): boolean {
        return ep._anchor ? !isContinuous(ep._anchor) && ep._anchor.locations.length > 1 : false
    }

    isFloating(ep: Endpoint<any>): boolean {
        return ep._anchor ? isFloating(ep._anchor) : false
    }

    prepareAnchor(params: AnchorSpec | Array<AnchorSpec>): LightweightAnchor {
        return makeLightweightAnchorFromSpec(params)
    }

    redraw(elementId: string, timestamp?: string, offsetToUI?: PointXY): RedrawResult {
        let connectionsToPaint:Set<Connection> = new Set(),
            endpointsToPaint:Set<Endpoint> = new Set(),
            anchorsToUpdate:Set<string> = new Set()

        if (!this.instance._suspendDrawing) {

            // get all the endpoints for this element
            let ep = this.instance.endpointsByElement[elementId] || []

            timestamp = timestamp || uuid()

            let orientationCache = {}, a:LightweightAnchor, anEndpoint:Endpoint

            for (let i = 0; i < ep.length; i++) {

                anEndpoint = ep[i]

                if (anEndpoint.visible === false) {
                    continue;
                }

                endpointsToPaint.add(anEndpoint)
                a = anEndpoint._anchor

                if (anEndpoint.connections.length === 0) {

                    if (isContinuous(a)) {
                        if (!this.anchorLists.has(elementId)) {
                            this.anchorLists.set(elementId, {top: [], right: [], bottom: [], left: []})
                        }
                        this._updateAnchorList(
                            this.anchorLists.get(elementId),
                            -Math.PI / 2,
                            0,
                            {endpoints: [anEndpoint, anEndpoint], placeholder:true},
                            false,
                            elementId,
                            0,
                            false,
                            getDefaultFace(a),
                            connectionsToPaint,
                            endpointsToPaint)
                        anchorsToUpdate.add(elementId)
                    }

                } else {

                    for (let i = 0; i < anEndpoint.connections.length; i++) {
                        let conn = anEndpoint.connections[i],
                            sourceId = conn.sourceId,
                            targetId = conn.targetId,
                            sourceContinuous = isContinuous(conn.endpoints[0]._anchor),
                            targetContinuous = isContinuous(conn.endpoints[1]._anchor)

                        if (sourceContinuous || targetContinuous) {
                            // key for orientation cache must take allowed faces for each anchor into account (issue 1086)
                            let c1 = ((conn.endpoints[0]._anchor as any).faces || []).join("-"),
                                c2 = ((conn.endpoints[1]._anchor as any).faces || []).join("-"),
                                oKey = [sourceId, c1, targetId, c2].join("-"),
                                o = orientationCache[oKey],
                                oIdx = conn.sourceId === elementId ? 1 : 0

                            if (sourceContinuous && !this.anchorLists.has(sourceId)) {
                                this.anchorLists.set(sourceId, {top: [], right: [], bottom: [], left: []})
                            }
                            if (targetContinuous && !this.anchorLists.has(targetId)) {
                                this.anchorLists.set(targetId, {top: [], right: [], bottom: [], left: []})
                            }

                            let td = this.instance.viewport.getPosition(targetId),
                                sd = this.instance.viewport.getPosition(sourceId)

                            if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                                // here we may want to improve this by somehow determining the face we'd like
                                // to put the connector on.  ideally, when drawing, the face should be calculated
                                // by determining which face is closest to the point at which the mouse button
                                // was released.  for now, we're putting it on the top face.
                                this._updateAnchorList(this.anchorLists.get(sourceId), -Math.PI / 2, 0, conn, false, targetId, 0, false, TOP, connectionsToPaint, endpointsToPaint)
                                this._updateAnchorList(this.anchorLists.get(targetId), -Math.PI / 2, 0, conn, false, sourceId, 1, false, TOP, connectionsToPaint, endpointsToPaint)
                            } else {
                                const sourceRotation = this.instance._getRotations(sourceId)
                                const targetRotation = this.instance._getRotations(targetId)

                                if (!o) {
                                    o = this._calculateOrientation(sourceId, targetId, sd, td,
                                        conn.endpoints[0]._anchor as LightweightContinuousAnchor,
                                        conn.endpoints[1]._anchor as LightweightContinuousAnchor,
                                        sourceRotation,
                                        targetRotation
                                    )
                                    orientationCache[oKey] = o
                                }
                                if (sourceContinuous) {
                                    this._updateAnchorList(this.anchorLists.get(sourceId), o.theta, 0, conn, false, targetId, 0, false, o.a[0], connectionsToPaint, endpointsToPaint)
                                }
                                if (targetContinuous) {
                                    this._updateAnchorList(this.anchorLists.get(targetId), o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], connectionsToPaint, endpointsToPaint)
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
                        } else {
                            let otherEndpoint = anEndpoint.connections[i].endpoints[conn.sourceId === elementId ? 1 : 0],
                                otherAnchor = otherEndpoint._anchor

                            if (isDynamic(otherAnchor)) {

                                this.instance._paintEndpoint(otherEndpoint, {
                                    elementWithPrecedence: elementId,
                                    timestamp: timestamp
                                })

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
            anchorsToUpdate.forEach((anchor) => {
                this._placeAnchors(anchor, this.anchorLists.get(anchor))
            })

            // now that continuous anchors have been placed, paint all the endpoints for this element and any other endpoints we came across as a result of the continuous anchors.
            endpointsToPaint.forEach((ep) => {
                let cd = this.instance.viewport.getPosition(ep.elementId)
                this.instance._paintEndpoint(ep, { timestamp: timestamp, offset: cd })
            })

            // paint all the connections
            connectionsToPaint.forEach((c) => {
                this.instance._paintConnection(c, {timestamp: timestamp})
            })
        }

        return {
            c:connectionsToPaint,
            e:endpointsToPaint
        }
    }

    reset(): void {
        this.anchorLocations.clear()
        this.anchorLists.clear()
    }

    setAnchor(endpoint: Endpoint<any>, anchor: LightweightAnchor): void {
        if(anchor != null) {
            endpoint._anchor = anchor
        }
    }

    setConnectionAnchors(conn: Connection<any>, anchors: [LightweightAnchor, LightweightAnchor]): void {
        conn.endpoints[0]._anchor = anchors[0]
        conn.endpoints[1]._anchor = anchors[1]
    }

    private _calculateOrientation (sourceId:string, targetId:string,
                                  sd:ViewportElement<T["E"]>,
                                  td:ViewportElement<T["E"]>,
                                  sourceAnchor:LightweightContinuousAnchor,
                                  targetAnchor:LightweightContinuousAnchor,
                                  sourceRotation:Rotations,
                                  targetRotation:Rotations):OrientationResult {

        let Orientation = { HORIZONTAL: "horizontal", VERTICAL: "vertical", DIAGONAL: "diagonal", IDENTITY: "identity" }

        if (sourceId === targetId) {
            return {
                orientation: Orientation.IDENTITY,
                a: [TOP, TOP]
            }
        }

        // since we only support rotation around the center of an element these two lines don't have to take rotation
        // into account.
        let theta = Math.atan2((td.c.y - sd.c.y), (td.c.x- sd.c.x)),
            theta2 = Math.atan2((sd.c.y - td.c.y), (sd.c.x - td.c.x))

// --------------------------------------------------------------------------------------

        // improved face calculation. get midpoints of each face for source and target, then put in an array with all combinations of
        // source/target faces. sort this array by distance between midpoints. the entry at index 0 is our preferred option. we can
        // go through the array one by one until we find an entry in which each requested face is supported.
        let candidates:Array<{source:Face, target:Face, dist:number}> = [], midpoints:Record<string, {
                top:PointXY,
                left:PointXY,
                right:PointXY,
                bottom:PointXY
            }> = { }
        ;( (types:Array<string>, dim:Array<[ViewportElement<T["E"]>, Rotations]>) => {
            for (let i = 0; i < types.length; i++) {
                midpoints[types[i]] = {
                    [LEFT]: {x:dim[i][0].x, y:dim[i][0].c.y },
                    [RIGHT]: {x:dim[i][0].x + dim[i][0].w, y:dim[i][0].c.y },
                    [TOP]: {x:dim[i][0].c.x, y:dim[i][0].y },
                    [BOTTOM]: {x:dim[i][0].c.x, y:dim[i][0].y + dim[i][0].h}
                }

                if (dim[i][1] != null && dim[i][1].length > 0) {
                    for (let axis in midpoints[types[i]]) {
                        midpoints[types[i]][axis] = this.instance._applyRotationsXY(midpoints[types[i]][axis], dim[i][1])
                    }
                }

            }
        })([ SOURCE, TARGET ], [ [ sd, sourceRotation], [td, targetRotation] ])

        let FACES:Array<Face> = [ TOP, LEFT, RIGHT, BOTTOM ]

        for (let sf = 0; sf < FACES.length; sf++) {
            for (let tf = 0; tf < FACES.length; tf++) {
                candidates.push({
                    source: FACES[sf],
                    target: FACES[tf],
                    dist: lineLength(midpoints.source[FACES[sf]], midpoints.target[FACES[tf]])
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
                        [LEFT]:0,
                        [TOP]:1,
                        [RIGHT]:2,
                        [BOTTOM]:3
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

            if (isContinuous(sourceAnchor) && sourceAnchor.locked) {
                sourceEdge = sourceAnchor.currentFace
            }
            else if (!sourceAnchor.isContinuous || isEdgeSupported(sourceAnchor, candidates[i].source)) {
                sourceEdge = candidates[i].source
            }
            else {
                sourceEdge = null
            }

            if (targetAnchor.isContinuous && targetAnchor.locked) {
                targetEdge = targetAnchor.currentFace
            }
            else if (!targetAnchor.isContinuous || isEdgeSupported(targetAnchor, candidates[i].target)) {
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
            this.setCurrentFace(sourceAnchor, sourceEdge)
        }

        if (targetAnchor.isContinuous) {
            this.setCurrentFace(targetAnchor, targetEdge)
        }

// --------------------------------------------------------------------------------------

        return {
            a: [ sourceEdge, targetEdge ],
            theta: theta,
            theta2: theta2
        }
    }

    /**
     * @internal
     * @param a
     * @param face
     * @param overrideLock
     */
    setCurrentFace (a:LightweightContinuousAnchor, face:Face, overrideLock?:boolean) {
        a.currentFace = face
        // if currently locked, and the user wants to override, do that.
        if (overrideLock && a.lockedFace != null) {
            a.lockedFace = a.currentFace
        }
    }

    /**
     * @internal
     * @param a
     */
    lock(a:LightweightAnchor) {
        a.locked = true
        if (isContinuous(a)) {
            a.lockedFace = a.currentFace
        }
    }

    /**
     * @internal
     * @param a
     */
    unlock(a:LightweightAnchor):void {
        a.locked = false
        if (isContinuous(a)) {
            a.lockedFace = null
        }
    }

    /**
     * Attempts to set the location in the given anchor whose x/y matches the coordinates given. An anchor may have more than
     * one declared location. This method provides a means for setting the active location based upon matching its x/y values.
     * @param a
     * @param coords
     * @returns true if a matching location was found and activated, false if not.
     * @internal
     */
    selectAnchorLocation(a:LightweightAnchor, coords:{x:number, y:number}):boolean {
        const idx = findWithFunction(a.locations, (loc) => {
            return loc.x === coords.x && loc.y === coords.y
        });
        if (idx !== -1) {
            a.currentLocation = idx
            return true
        } else {
            return false
        }
    }

    /**
     * @internal
     * @param a
     */
    lockCurrentAxis(a:LightweightContinuousAnchor) {
        if (a.currentFace != null) {
            a.lockedAxis = (a.currentFace ===  LEFT || a.currentFace === RIGHT) ? X_AXIS_FACES : Y_AXIS_FACES
        }
    }

    /**
     * @internal
     * @param a
     */
    unlockCurrentAxis(a:LightweightContinuousAnchor):void {
        a.lockedAxis = null
    }

    /**
     * Returns whether or not the two anchors represent the same location.
     * @param a1
     * @param a2
     * @internal
     */
    anchorsEqual(a1:LightweightAnchor, a2:LightweightAnchor):boolean {
        if (!a1 || !a2) {
            return false
        }

        let l1 = a1.locations[a1.currentLocation],
            l2 = a2.locations[a2.currentLocation]

        return l1.x === l2.x && l1.y === l2.y && l1.offx === l2.offx && l1.offy === l2.offy && l1.ox === l2.ox && l1.oy === l2.oy
    }

}

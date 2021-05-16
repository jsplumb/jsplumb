
import {Endpoint} from "../endpoint/endpoint"
import {
    AnchorComputeParams,
    AnchorOrientationHint,
    AnchorSpec, ComputedPosition,
    Face,
    Orientation,
    X_AXIS_FACES, Y_AXIS_FACES
} from "../factory/anchor-record-factory"
import {
    AnchorRecord,
    LightweightAnchor,
    LightweightContinuousAnchor,
    LightweightFloatingAnchor, makeLightweightAnchorFromSpec,
    TOP, BOTTOM, LEFT, RIGHT
} from "../factory/anchor-record-factory"
import {ConnectionDetachedParams, Dictionary, PointXY, Rotations, Size, SortFunction} from "../common"
import {AnchorPlacement, RedrawResult, Router} from "./router"
import {Connection} from "../connector/connection-impl"
import {JsPlumbInstance} from "../core"
import * as Constants from "../constants"
import {
    extend,
    findWithFunction,
    forEach,
    removeWithFunction,
    RotatedPointXY,
    rotatePoint,
    sortHelper,
    uuid
} from "../util"
import {ViewportElement} from "../viewport"
import {lineLength} from "../geom"

const anchorMap:Map<string, LightweightAnchor> = new Map()
const anchorLocations:Map<string, AnchorPlacement> = new Map()

// -------------------- internal data structures --------------------------------------

interface ConnectionFacade {
    endpoints: [ Endpoint, Endpoint ]
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

const anchorLists:Map<string, AnchorLists> = new Map()

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
const edgeSortFunctions:Dictionary<SortFunction<AnchorListEntry>> = {
    "top": _leftAndTopSort,
    "right": _rightAndBottomSort,
    "bottom": _rightAndBottomSort,
    "left": _leftAndTopSort
}

function _updateAnchorList (lists:AnchorLists, theta:number, order:number, conn:ConnectionFacade, aBoolean:boolean, otherElId:string, idx:number, reverse:boolean, edgeId:string, connsToPaint:Set<ConnectionFacade>, endpointsToPaint:Set<Endpoint>) {
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

                connsToPaint.add(candidate)
                endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[idx])
                endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[oIdx])
            }
        }
    }

    for (let i = 0; i < listToAddTo.length; i++) {
        candidate = listToAddTo[i].c

        connsToPaint.add(candidate)

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

function _placeAnchors (instance:JsPlumbInstance, elementId:string, _anchorLists:AnchorLists):void {
    let cd:ViewportElement<any> = instance.viewport.getPosition(elementId),
    placeSomeAnchors = (desc:string, element:ViewportElement<any>, unsortedConnections:Array<AnchorListEntry>, isHorizontal:boolean, otherMultiplier:number, orientation:Orientation) => {
        if (unsortedConnections.length > 0) {
            let sc = sortHelper(unsortedConnections, edgeSortFunctions[desc]), // puts them in order based on the target element's pos on screen
                reverse = desc === RIGHT || desc === TOP,
                anchors = _placeAnchorsOnLine(cd, sc,
                    isHorizontal,
                    otherMultiplier,
                    reverse)

            // takes a computed anchor position and adjusts it for parent offset and scroll, then stores it.
            let _setAnchorLocation = (endpoint:Endpoint, anchorPos:ContinuousAnchorPlacement) => {
                _setComputedPosition(endpoint._anchor, {curX:anchorPos.x, curY:anchorPos.y, x:anchorPos.xLoc, y:anchorPos.yLoc, ox:orientation[0], oy:orientation[1] })
            }

            for (let i = 0; i < anchors.length; i++) {
                let c = anchors[i].c, weAreSource = c.endpoints[0].elementId === elementId, weAreTarget = c.endpoints[1].elementId === elementId
                if (weAreSource) {
                    _setAnchorLocation(c.endpoints[0], anchors[i])
                }
                if (weAreTarget) {
                    _setAnchorLocation(c.endpoints[1], anchors[i])
                }
            }
        }
    }

    placeSomeAnchors(BOTTOM, cd, _anchorLists.bottom, true, 1, [0, 1])
    placeSomeAnchors(TOP, cd, _anchorLists.top, true, 0, [0, -1])
    placeSomeAnchors(LEFT, cd, _anchorLists.left, false, 0, [-1, 0])
    placeSomeAnchors(RIGHT, cd, _anchorLists.right, false, 1, [1, 0])
}

function _removeEndpointFromAnchorLists (endpoint:Endpoint):void {
    const listsForElement = anchorLists.get(endpoint.elementId)
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
        anchorLists.delete(endpoint.elementId)
    }

    anchorLocations.delete(endpoint._anchor.id)
}

const opposites:Dictionary<Face> = {"top": "bottom", "right": "left", "left": "right", "bottom": "top"}
const clockwiseOptions:Dictionary<Face> = {"top": "right", "right": "bottom", "left": "top", "bottom": "left"}
const antiClockwiseOptions:Dictionary<Face> = {"top": "left", "right": "top", "left": "bottom", "bottom": "right"}

function _getCurrentFace(a:LightweightContinuousAnchor):Face {
    return a.currentFace
}

/**
 *
 * @param a
 * @private
 */
export function _getDefaultFace(a:LightweightContinuousAnchor):Face {
    return a.faces.length === 0 ? "top" : a.faces[0]
}

function _isFaceAvailable(a:LightweightContinuousAnchor, face:Face):boolean {
    return a.faces.indexOf(face) !== -1
}

function _secondBest(a:LightweightContinuousAnchor, edge:Face):Face {
    return (a.clockwise ? clockwiseOptions : antiClockwiseOptions)[edge]
}

function _lastChoice(a:LightweightContinuousAnchor, edge:Face):Face {
    return (a.clockwise ? antiClockwiseOptions : clockwiseOptions)[edge]
}

// if the given edge is supported, returns it. otherwise looks for a substitute that _is_
// supported. if none supported we also return the request edge.
function verifyEdge (a:LightweightContinuousAnchor, edge:Face):Face {
    //const availableFaces:Array<Face> = _getAvailableFaces(a)
    if (_isFaceAvailable(a, edge)) {
        return edge
    }
    else if (_isFaceAvailable(a, opposites[edge])) {
        return opposites[edge]
    }
    else {
        const secondBest = _secondBest(a, edge)
        if (_isFaceAvailable(a, secondBest)) {
            return secondBest
        } else {
            const lastChoice = _lastChoice(a, edge)
            if (_isFaceAvailable(a, lastChoice)) {
                return lastChoice
            }
        }
    }
    // else if (_isFaceAvailable(a, _secondBest(a,edge))) {
    //     return this.secondBest[edge]
    // }
    // else if (availableFaces[this.lastChoice[edge]]) {
    //     return this.lastChoice[edge]
    // }
    return edge // we have to give them something.
}

/**
 *
 * @param a
 * @param edge
 * @private
 */
export function _isEdgeSupported (a:LightweightContinuousAnchor, edge:Face):boolean {
    return  a.lockedAxis == null ?
        (a.lockedFace == null ? _isFaceAvailable(a, edge) === true : a.lockedFace === edge)
        : a.lockedAxis.indexOf(edge) !== -1
}


// function getSupportedFaces (a:LightweightContinuousAnchor):Array<Face> {
//     let af:Array<Face> = []
//     for (let k in this.availableFaces) {
//         if (this.availableFaces[k]) {
//             af.push(k as Face)
//         }
//     }
//     return af
// }

// -------------------- / internal data structures --------------------------------------

function isContinuous(a:LightweightAnchor):a is LightweightContinuousAnchor {
    return a.isContinuous === true
}

function isFloating(a:LightweightAnchor):a is LightweightFloatingAnchor {
    return a.isContinuous === true
}

function isDynamic(a:LightweightAnchor):boolean {
    return a.locations.length > 1
}


export function getAnchorOrientation(anchor:LightweightAnchor): Orientation {
    // if (anchor.isContinuous) {
    //     return this.continuousAnchorOrientations[endpoint.id] || [ 0, 0 ]
    // } else if (anchor.isDynamic) {
    //     return (anchor as DynamicAnchor)._curAnchor != null ? (anchor as DynamicAnchor)._curAnchor.orientation : [ 0, 0 ]

    // } else if (anchor.isFloating) {
    //     if (anchor.orientation) {
    //         return anchor.orientation
    //     }
    //     else {
    //         let o = this.getAnchorOrientation((anchor as FloatingAnchor).ref, endpoint)
    //         // here we take into account the orientation of the other
    //         // anchor: if it declares zero for some direction, we declare zero too. this might not be the most awesome. perhaps we can come
    //         // up with a better way. it's just so that the line we draw looks like it makes sense. maybe this wont make sense.
    //         return [ (Math.abs(o[0]) * (anchor as FloatingAnchor).xDir * -1) as AnchorOrientationHint,
    //             (Math.abs(o[1]) * (anchor as FloatingAnchor).yDir * -1) as AnchorOrientationHint ]
    //     }
    // } else {
    //     return anchor.orientation
    // }
    //return anchorOrientations.get(anchor.id) || [0, 0]
    const loc = anchorLocations.get(anchor.id)
    return loc ? [loc.ox, loc.oy] : [0,0]
}

function floatingAnchorCompute(instance:JsPlumbInstance, anchor:LightweightFloatingAnchor, params:AnchorComputeParams):AnchorPlacement {
    let xy = params.xy
    const pos = {curX:xy.x + (anchor.size.w / 2), curY:xy.y + (anchor.size.h / 2), x:0, y:0, ox:0, oy:0 } // return origin of the element. we may wish to improve this so that any object can be the drag proxy.
    return _setComputedPosition(anchor, pos)
}

function _setComputedPosition(anchor:LightweightAnchor, pos:ComputedPosition, timestamp?:string):ComputedPosition {
    anchorLocations.set(anchor.id, pos)
    anchor.computedPosition = pos
    if (timestamp) {
        anchor.timestamp = timestamp
    }
    return pos
}

function getCurrentLocation(anchor:LightweightAnchor):[number, AnchorRecord] {
    return [anchor.currentLocation, anchor.locations[anchor.currentLocation]]
}

function computeSingleLocation(instance:JsPlumbInstance, loc:AnchorRecord, xy:PointXY, wh:Size, params:AnchorComputeParams):AnchorPlacement {
    const candidate:AnchorPlacement = {curX:xy.x + (loc.x * wh.w) + loc.offx, curY:xy.y + (loc.y * wh.h) + loc.offy, x:loc.x, y:loc.y, ox:0, oy:0 }

    let pos:AnchorPlacement
    const rotation = params.rotation;
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
        //pos = candidate
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
 * @private
 */
function _singleAnchorCompute(instance:JsPlumbInstance, anchor:LightweightAnchor, params:AnchorComputeParams):AnchorPlacement {
    let xy = params.xy, wh = params.wh, timestamp = params.timestamp

    let pos = anchorLocations.get(anchor.id)

    if (pos != null && timestamp && timestamp === anchor.timestamp) {
        return pos
    }

    const [_, currentLoc] = getCurrentLocation(anchor)

    pos = computeSingleLocation(instance, currentLoc, xy, wh, params)

    return _setComputedPosition(anchor, pos, timestamp)
}

/**
 * Computes the position for an anchor that is neither floating nor continuous. This case covers what
 * was previously both DynamicAnchor and Anchor, since those concepts have now been folded into
 * a single concept - any given anchor has one or more locations.
 * @param anchor
 * @param params
 */
function defaultAnchorCompute(instance:JsPlumbInstance, anchor:LightweightAnchor, params:AnchorComputeParams):AnchorPlacement {

    let pos:AnchorPlacement

    if (anchor.locations.length === 1) {
        return _singleAnchorCompute(instance, anchor, params)
    }

    let xy = params.xy, wh = params.wh, txy = params.txy, twh = params.twh

    const [currentIdx, currentLoc] = getCurrentLocation(anchor)
    if (anchor.locked || txy == null || twh == null) {
        pos = computeSingleLocation(instance, currentLoc, xy, wh, params)
    } else {
        const [newIdx, newLoc] = _anchorSelector(instance, xy, wh, txy, twh, params.rotation, params.tRotation, anchor.locations)
        anchor.currentLocation = newIdx


        if(newIdx !== currentIdx) {
            anchor.cssClass = newLoc.cls || anchor.cssClass
            params.element._anchorLocationChanged(anchor)
        }
        pos = computeSingleLocation(instance, newLoc, xy, wh, params)
    }

    return _setComputedPosition(anchor, pos, params.timestamp)
}

function _distance(instance:JsPlumbInstance, anchor:AnchorRecord, cx:number, cy:number, xy:PointXY, wh:Size, rotation:Rotations, targetRotation:Rotations):number {

    let ax = xy.x + (anchor.x * wh.w), ay = xy.y + (anchor.y * wh.h),
        acx = xy.x + (wh.w / 2), acy = xy.y + (wh.h / 2)

    if(rotation != null && rotation.length > 0) {
        const rotated = instance._applyRotations([ax,ay, 0, 0], rotation)
        ax = rotated.x
        ay = rotated.y
    }

    return (Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2)))
}

function _anchorSelector(instance:JsPlumbInstance, xy:PointXY, wh:Size, txy:PointXY, twh:Size, rotation:Rotations, targetRotation:Rotations, locations:Array<AnchorRecord>):[number, AnchorRecord] {

    let cx = txy.x + (twh.w / 2), cy = txy.y + (twh.h / 2)
    let minIdx = -1, minDist = Infinity
    for (let i = 0; i < locations.length; i++) {
        let d = _distance(instance, locations[i], cx, cy, xy, wh, rotation, targetRotation)
        if (d < minDist) {
            minIdx = i + 0
            minDist = d
        }
    }
    return [minIdx, locations[minIdx]]
}

export class LightweightRouter<T extends {E:unknown}> implements Router<T, LightweightAnchor>  {

    constructor(public instance:JsPlumbInstance ) {
        instance.bind<ConnectionDetachedParams<T["E"]>>(Constants.EVENT_INTERNAL_CONNECTION_DETACHED, (p:ConnectionDetachedParams<T["E"]>) => {
            _removeEndpointFromAnchorLists(p.sourceEndpoint)
            _removeEndpointFromAnchorLists(p.targetEndpoint)
        })

        instance.bind<Endpoint<T["E"]>>(Constants.EVENT_INTERNAL_ENDPOINT_UNREGISTERED, (ep:Endpoint<T["E"]>) => {
            _removeEndpointFromAnchorLists(ep)
            anchorMap.delete(ep.id)
        })
    }

    computeAnchorLocation(anchor: LightweightAnchor, params: AnchorComputeParams): AnchorPlacement {
        let pos:AnchorPlacement
        if (isContinuous(anchor)) {
            pos = anchorLocations.get(anchor.id) || {curX:0, curY:0, x:0, y:0, ox:0, oy:0}
        } else if (isFloating(anchor)) {
            pos = floatingAnchorCompute(this.instance, anchor, params)
        } else {
            pos = defaultAnchorCompute(this.instance, anchor, params)
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
            // sourceOrientation:[sAnchorP.ox, sAnchorP.oy],
            // targetOrientation:[tAnchorP.ox, tAnchorP.oy],
            sourceEndpoint: connection.endpoints[0],
            targetEndpoint: connection.endpoints[1],
            strokeWidth: connection.paintStyleInUse.strokeWidth,
            sourceInfo: sourceInfo,
            targetInfo: targetInfo
        })
    }

    // getAnchor(ep: Endpoint<any>): LightweightAnchor {
    //     return anchorMap.get(ep.id)
    // }

    getAnchorOrientation(anchor: LightweightAnchor, endpoint?: Endpoint<any>): [number, number] {
        return getAnchorOrientation(anchor)
    }

    getEndpointLocation(endpoint: Endpoint<any>, params: AnchorComputeParams): AnchorPlacement {
        params = params || {}
        const anchor = anchorMap.get(endpoint.id)
        let pos = anchorLocations.get(anchor.id)
        if (pos == null || (params.timestamp != null && anchor.timestamp !== params.timestamp)) {
            pos = this.computeAnchorLocation(anchor, params)
            _setComputedPosition(anchor, pos, params.timestamp)
        }
        return pos
    }

    getEndpointOrientation(ep: Endpoint<any>): [number, number] {
        //const a = this.getAnchor(endpoint)
        return ep._anchor ? getAnchorOrientation(ep._anchor) : [0,0]
    }

    // TODO this method should not need to be called. for now, a placeholder implementation, which
    // returns whether or not the endpoint is not continuous and has more than one placement
    isDynamicAnchor(ep: Endpoint<any>): boolean {
        //const a = this.getAnchor(ep)
        return ep._anchor ? !isContinuous(ep._anchor) && ep._anchor.locations.length > 1 : false
    }

    isFloating(ep: Endpoint<any>): boolean {
        //const a = this.getAnchor(ep)
        return ep._anchor ? isFloating(ep._anchor) : false
    }

    prepareAnchor(endpoint: Endpoint<any>, params: AnchorSpec | Array<AnchorSpec>): LightweightAnchor {
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

            let orientationCache = {}, a:LightweightAnchor

            forEach(ep, (anEndpoint) => {

                endpointsToPaint.add(anEndpoint)
                a = anchorMap.get(anEndpoint.id)

                if (anEndpoint.connections.length === 0) {

                    if (isContinuous(a)) {
                        if (!anchorLists.has(elementId)) {
                            anchorLists.set(elementId, { top: [], right: [], bottom: [], left: [] })
                        }
                        _updateAnchorList(
                            anchorLists.get(elementId),
                            -Math.PI / 2,
                            0,
                            {endpoints: [anEndpoint, anEndpoint]},
                            false,
                            elementId,
                            0,
                            false,
                            _getDefaultFace(a),
                            connectionsToPaint,
                            endpointsToPaint)
                        anchorsToUpdate.add(elementId)
                    }

                } else {
                    for (let i = 0; i < anEndpoint.connections.length; i++) {
                        let conn = anEndpoint.connections[i],
                            sourceId = conn.sourceId,
                            targetId = conn.targetId,
                            sourceContinuous = isContinuous(anchorMap.get(conn.endpoints[0].id)),
                            targetContinuous = isContinuous(anchorMap.get(conn.endpoints[0].id))

                        if (sourceContinuous || targetContinuous) {
                            let oKey = sourceId + "_" + targetId,
                                o = orientationCache[oKey],
                                oIdx = conn.sourceId === elementId ? 1 : 0

                            if (sourceContinuous && !anchorLists.has(sourceId)) {
                                anchorLists.set(sourceId, { top: [], right: [], bottom: [], left: [] })
                            }
                            if (targetContinuous && !anchorLists.has(targetId)) {
                                anchorLists.set(targetId, { top: [], right: [], bottom: [], left: [] })
                            }

                            let td = this.instance.viewport.getPosition(targetId),
                                sd = this.instance.viewport.getPosition(sourceId)

                            if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                                // here we may want to improve this by somehow determining the face we'd like
                                // to put the connector on.  ideally, when drawing, the face should be calculated
                                // by determining which face is closest to the point at which the mouse button
                                // was released.  for now, we're putting it on the top face.
                                _updateAnchorList( anchorLists.get(sourceId), -Math.PI / 2, 0, conn, false, targetId, 0, false, "top", connectionsToPaint, endpointsToPaint)
                                _updateAnchorList( anchorLists.get(targetId), -Math.PI / 2, 0, conn, false, sourceId, 1, false, "top", connectionsToPaint, endpointsToPaint)
                            }
                            else {
                                const sourceRotation = this.instance._getRotations(sourceId)
                                const targetRotation = this.instance._getRotations(targetId)

                                if (!o) {
                                    o = this._calculateOrientation(sourceId, targetId, sd, td,
                                        anchorMap.get(conn.endpoints[0].id) as LightweightContinuousAnchor,
                                        anchorMap.get(conn.endpoints[1].id) as LightweightContinuousAnchor,
                                        sourceRotation,
                                        targetRotation
                                    )
                                    orientationCache[oKey] = o
                                }
                                if (sourceContinuous) {
                                    _updateAnchorList(anchorLists.get(sourceId), o.theta, 0, conn, false, targetId, 0, false, o.a[0], connectionsToPaint, endpointsToPaint)
                                }
                                if (targetContinuous) {
                                    _updateAnchorList(anchorLists.get(targetId), o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], connectionsToPaint, endpointsToPaint)
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
                            let otherEndpoint = anEndpoint.connections[i].endpoints[conn.sourceId === elementId ? 1 : 0],
                                otherAnchor = anchorMap.get(otherEndpoint.id)

                            if (isDynamic(otherAnchor)) {

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
            })

            // now place all the continuous anchors we need to
            anchorsToUpdate.forEach((anchor) => {
                _placeAnchors(this.instance, anchor, anchorLists.get(anchor))
            })

            // now that continuous anchors have been placed, paint all the endpoints for this element and any other endpoints we came across as a result of the continuous anchors.
            endpointsToPaint.forEach((ep) => {
                let cd = this.instance.viewport.getPosition(ep.elementId)
                this.instance.paintEndpoint(ep, { timestamp: timestamp, offset: cd })
            })

            // paint all the connections
            connectionsToPaint.forEach((c) => {
                this.instance.paintConnection(c, {timestamp: timestamp})
            })
        }

        return {
            c:connectionsToPaint,
            e:endpointsToPaint
        }
    }

    reset(): void {
        anchorMap.clear()
        anchorLocations.clear()
        anchorLists.clear()
    }

    setAnchor(endpoint: Endpoint<any>, anchor: LightweightAnchor): void {
        if(anchor != null) {
            anchorMap.set(endpoint.id, anchor)
            endpoint._anchor = anchor
        }
    }

    setConnectionAnchors(conn: Connection<any>, anchors: [LightweightAnchor, LightweightAnchor]): void {
        conn.endpoints[0]._anchor = anchors[0]
        conn.endpoints[1]._anchor = anchors[1]
        anchorMap.set(conn.endpoints[0].id, anchors[0])
        anchorMap.set(conn.endpoints[1].id, anchors[1])
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
                a: ["top", "top"]
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
        let candidates:Array<{source:Face, target:Face, dist:number}> = [], midpoints:Dictionary<{
                top:PointXY,
                left:PointXY,
                right:PointXY,
                bottom:PointXY
            }> = { }
        ;( (types:Array<string>, dim:Array<[ViewportElement<T["E"]>, Rotations]>) => {
            for (let i = 0; i < types.length; i++) {
                midpoints[types[i]] = {
                    "left": {x:dim[i][0].x, y:dim[i][0].c.y },
                    "right": {x:dim[i][0].x + dim[i][0].w, y:dim[i][0].c.y },
                    "top": {x:dim[i][0].c.x, y:dim[i][0].y },
                    "bottom": {x:dim[i][0].c.x, y:dim[i][0].y + dim[i][0].h}
                }


                if (dim[i][1] != null && dim[i][1].length > 0) {
                    for (let axis in midpoints[types[i]]) {
                        midpoints[types[i]][axis] = this.instance._applyRotationsXY(midpoints[types[i]][axis], dim[i][1])
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

            if (isContinuous(sourceAnchor) && sourceAnchor.locked) {
                sourceEdge = _getCurrentFace(sourceAnchor)
            }
            else if (!sourceAnchor.isContinuous || _isEdgeSupported(sourceAnchor, candidates[i].source)) {
                sourceEdge = candidates[i].source
            }
            else {
                sourceEdge = null
            }

            if (targetAnchor.isContinuous && targetAnchor.locked) {
                targetEdge = _getCurrentFace(targetAnchor)
            }
            else if (!targetAnchor.isContinuous || _isEdgeSupported(targetAnchor, candidates[i].target)) {
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

    setCurrentFace (a:LightweightContinuousAnchor, face:Face, overrideLock?:boolean) {
        a.currentFace = face
        // if currently locked, and the user wants to override, do that.
        if (overrideLock && a.lockedFace != null) {
            a.lockedFace = a.currentFace
        }
    }

    lock(a:LightweightAnchor) {
        a.locked = true
        if (isContinuous(a)) {
            a.lockedFace = a.currentFace
        }
    }

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
     * @return true if a matching location was found and activated, false if not.
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

    lockCurrentAxis(a:LightweightContinuousAnchor) {
        if (a.currentFace != null) {
            a.lockedAxis = (a.currentFace ===  LEFT || a.currentFace === RIGHT) ? X_AXIS_FACES : Y_AXIS_FACES
        }
    }

    unlockCurrentAxis(a:LightweightContinuousAnchor):void {
        a.lockedAxis = null
    }

    /**
     * Returns whether or not
     * @param a1
     * @param a2
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

/*
 * jsPlumb
 * 
 * Title:jsPlumb 2.1.1
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG.
 * 
 * This file contains the code for creating and manipulating anchors.
 *
 * Copyright (c) 2010 - 2016 jsPlumb (hello@jsplumbtoolkit.com)
 * 
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;
(function () {

    "use strict";

    var root = this,
        _ju = root.jsPlumbUtil,
        _jp = root.jsPlumb;

    //
    // manages anchors for all elements.
    //
    _jp.AnchorManager = function (params) {
        var _amEndpoints = {},
            continuousAnchorLocations = {},
            userDefinedContinuousAnchorLocations = {},
            continuousAnchorOrientations = {},
            Orientation = { HORIZONTAL: "horizontal", VERTICAL: "vertical", DIAGONAL: "diagonal", IDENTITY: "identity" },
            axes = ["left", "top", "right", "bottom"],
            connectionsByElementId = {},
            self = this,
            anchorLists = {},
            jsPlumbInstance = params.jsPlumbInstance,
            floatingConnections = {},
            calculateOrientation = function (sourceId, targetId, sd, td, sourceAnchor, targetAnchor) {

                if (sourceId === targetId) return {
                    orientation: Orientation.IDENTITY,
                    a: ["top", "top"]
                };

                var theta = Math.atan2((td.centery - sd.centery), (td.centerx - sd.centerx)),
                    theta2 = Math.atan2((sd.centery - td.centery), (sd.centerx - td.centerx));

// --------------------------------------------------------------------------------------

                // improved face calculation. get midpoints of each face for source and target, then put in an array with all combinations of
                // source/target faces. sort this array by distance between midpoints. the entry at index 0 is our preferred option. we can
                // go through the array one by one until we find an entry in which each requested face is supported.
                var candidates = [], midpoints = { };
                (function (types, dim) {
                    for (var i = 0; i < types.length; i++) {
                        midpoints[types[i]] = {
                            "left": [ dim[i].left, dim[i].centery ],
                            "right": [ dim[i].right, dim[i].centery ],
                            "top": [ dim[i].centerx, dim[i].top ],
                            "bottom": [ dim[i].centerx , dim[i].bottom]
                        };
                    }
                })([ "source", "target" ], [ sd, td ]);

                for (var sf = 0; sf < axes.length; sf++) {
                    for (var tf = 0; tf < axes.length; tf++) {
                        candidates.push({
                            source: axes[sf],
                            target: axes[tf],
                            dist: Biltong.lineLength(midpoints.source[axes[sf]], midpoints.target[axes[tf]])
                        });
                    }
                }

                candidates.sort(function (a, b) {
                    return a.dist < b.dist ? -1 : a.dist > b.dist ? 1 : 0;
                });

                // now go through this list and try to get an entry that satisfies both (there will be one, unless one of the anchors
                // declares no available faces)
                var sourceEdge = candidates[0].source, targetEdge = candidates[0].target;
                for (var i = 0; i < candidates.length; i++) {

                    if (!sourceAnchor.isContinuous || sourceAnchor.isEdgeSupported(candidates[i].source))
                        sourceEdge = candidates[i].source;
                    else
                        sourceEdge = null;

                    if (!targetAnchor.isContinuous || targetAnchor.isEdgeSupported(candidates[i].target))
                        targetEdge = candidates[i].target;
                    else {
                        targetEdge = null;
                    }

                    if (sourceEdge != null && targetEdge != null) break;
                }

// --------------------------------------------------------------------------------------

                return {
                    a: [ sourceEdge, targetEdge ],
                    theta: theta,
                    theta2: theta2
                };
            },
        // used by placeAnchors function
            placeAnchorsOnLine = function (desc, elementDimensions, elementPosition, connections, horizontal, otherMultiplier, reverse) {
                var a = [], step = elementDimensions[horizontal ? 0 : 1] / (connections.length + 1);

                for (var i = 0; i < connections.length; i++) {
                    var val = (i + 1) * step, other = otherMultiplier * elementDimensions[horizontal ? 1 : 0];
                    if (reverse)
                        val = elementDimensions[horizontal ? 0 : 1] - val;

                    var dx = (horizontal ? val : other), x = elementPosition[0] + dx, xp = dx / elementDimensions[0],
                        dy = (horizontal ? other : val), y = elementPosition[1] + dy, yp = dy / elementDimensions[1];

                    a.push([ x, y, xp, yp, connections[i][1], connections[i][2] ]);
                }

                return a;
            },
        // used by edgeSortFunctions
            currySort = function (reverseAngles) {
                return function (a, b) {
                    var r = true;
                    if (reverseAngles) {
                        r = a[0][0] < b[0][0];
                    }
                    else {
                        r = a[0][0] > b[0][0];
                    }
                    return r === false ? -1 : 1;
                };
            },
        // used by edgeSortFunctions
            leftSort = function (a, b) {
                // first get adjusted values
                var p1 = a[0][0] < 0 ? -Math.PI - a[0][0] : Math.PI - a[0][0],
                    p2 = b[0][0] < 0 ? -Math.PI - b[0][0] : Math.PI - b[0][0];
                if (p1 > p2) return 1;
                else return a[0][1] > b[0][1] ? 1 : -1;
            },
        // used by placeAnchors
            edgeSortFunctions = {
                "top": function (a, b) {
                    return a[0] > b[0] ? 1 : -1;
                },
                "right": currySort(true),
                "bottom": currySort(true),
                "left": leftSort
            },
        // used by placeAnchors
            _sortHelper = function (_array, _fn) {
                return _array.sort(_fn);
            },
        // used by AnchorManager.redraw
            placeAnchors = function (elementId, _anchorLists) {
                var cd = jsPlumbInstance.getCachedData(elementId), sS = cd.s, sO = cd.o,
                    placeSomeAnchors = function (desc, elementDimensions, elementPosition, unsortedConnections, isHorizontal, otherMultiplier, orientation) {
                        if (unsortedConnections.length > 0) {
                            var sc = _sortHelper(unsortedConnections, edgeSortFunctions[desc]), // puts them in order based on the target element's pos on screen
                                reverse = desc === "right" || desc === "top",
                                anchors = placeAnchorsOnLine(desc, elementDimensions,
                                    elementPosition, sc,
                                    isHorizontal, otherMultiplier, reverse);

                            // takes a computed anchor position and adjusts it for parent offset and scroll, then stores it.
                            var _setAnchorLocation = function (endpoint, anchorPos) {
                                continuousAnchorLocations[endpoint.id] = [ anchorPos[0], anchorPos[1], anchorPos[2], anchorPos[3] ];
                                continuousAnchorOrientations[endpoint.id] = orientation;
                            };

                            for (var i = 0; i < anchors.length; i++) {
                                var c = anchors[i][4], weAreSource = c.endpoints[0].elementId === elementId, weAreTarget = c.endpoints[1].elementId === elementId;
                                if (weAreSource)
                                    _setAnchorLocation(c.endpoints[0], anchors[i]);
                                if (weAreTarget)
                                    _setAnchorLocation(c.endpoints[1], anchors[i]);
                            }
                        }
                    };

                placeSomeAnchors("bottom", sS, [sO.left, sO.top], _anchorLists.bottom, true, 1, [0, 1]);
                placeSomeAnchors("top", sS, [sO.left, sO.top], _anchorLists.top, true, 0, [0, -1]);
                placeSomeAnchors("left", sS, [sO.left, sO.top], _anchorLists.left, false, 0, [-1, 0]);
                placeSomeAnchors("right", sS, [sO.left, sO.top], _anchorLists.right, false, 1, [1, 0]);
            };

        this.reset = function () {
            _amEndpoints = {};
            connectionsByElementId = {};
            anchorLists = {};
        };
        this.addFloatingConnection = function (key, conn) {
            floatingConnections[key] = conn;
        };
        this.removeFloatingConnection = function (key) {
            delete floatingConnections[key];
        };
        this.newConnection = function (conn) {
            var sourceId = conn.sourceId, targetId = conn.targetId,
                ep = conn.endpoints,
                doRegisterTarget = true,
                registerConnection = function (otherIndex, otherEndpoint, otherAnchor, elId, c) {
                    if ((sourceId == targetId) && otherAnchor.isContinuous) {
                        // remove the target endpoint's canvas.  we dont need it.
                        conn._jsPlumb.instance.removeElement(ep[1].canvas);
                        doRegisterTarget = false;
                    }
                    _ju.addToList(connectionsByElementId, elId, [c, otherEndpoint, otherAnchor.constructor == _jp.DynamicAnchor]);
                };

            registerConnection(0, ep[0], ep[0].anchor, targetId, conn);
            if (doRegisterTarget)
                registerConnection(1, ep[1], ep[1].anchor, sourceId, conn);
        };
        var removeEndpointFromAnchorLists = function (endpoint) {
            (function (list, eId) {
                if (list) {  // transient anchors dont get entries in this list.
                    var f = function (e) {
                        return e[4] == eId;
                    };
                    _ju.removeWithFunction(list.top, f);
                    _ju.removeWithFunction(list.left, f);
                    _ju.removeWithFunction(list.bottom, f);
                    _ju.removeWithFunction(list.right, f);
                }
            })(anchorLists[endpoint.elementId], endpoint.id);
        };
        this.connectionDetached = function (connInfo, doNotRedraw) {
            var connection = connInfo.connection || connInfo,
                sourceId = connInfo.sourceId,
                targetId = connInfo.targetId,
                ep = connection.endpoints,
                removeConnection = function (otherIndex, otherEndpoint, otherAnchor, elId, c) {
                   _ju.removeWithFunction(connectionsByElementId[elId], function (_c) {
                        return _c[0].id == c.id;
                    });
                };

            removeConnection(1, ep[1], ep[1].anchor, sourceId, connection);
            removeConnection(0, ep[0], ep[0].anchor, targetId, connection);
            if (connection.floatingId) {
                removeConnection(connection.floatingIndex, connection.floatingEndpoint, connection.floatingEndpoint.anchor, connection.floatingId, connection);
                removeEndpointFromAnchorLists(connection.floatingEndpoint);
            }

            // remove from anchorLists            
            removeEndpointFromAnchorLists(connection.endpoints[0]);
            removeEndpointFromAnchorLists(connection.endpoints[1]);

            if (!doNotRedraw) {
                self.redraw(connection.sourceId);
                if (connection.targetId !== connection.sourceId)
                    self.redraw(connection.targetId);
            }
        };
        this.add = function (endpoint, elementId) {
            _ju.addToList(_amEndpoints, elementId, endpoint);
        };
        this.changeId = function (oldId, newId) {
            connectionsByElementId[newId] = connectionsByElementId[oldId];
            _amEndpoints[newId] = _amEndpoints[oldId];
            delete connectionsByElementId[oldId];
            delete _amEndpoints[oldId];
        };
        this.getConnectionsFor = function (elementId) {
            return connectionsByElementId[elementId] || [];
        };
        this.getEndpointsFor = function (elementId) {
            return _amEndpoints[elementId] || [];
        };
        this.deleteEndpoint = function (endpoint) {
            _ju.removeWithFunction(_amEndpoints[endpoint.elementId], function (e) {
                return e.id == endpoint.id;
            });
            removeEndpointFromAnchorLists(endpoint);
        };
        this.clearFor = function (elementId) {
            delete _amEndpoints[elementId];
            _amEndpoints[elementId] = [];
        };
        // updates the given anchor list by either updating an existing anchor's info, or adding it. this function
        // also removes the anchor from its previous list, if the edge it is on has changed.
        // all connections found along the way (those that are connected to one of the faces this function
        // operates on) are added to the connsToPaint list, as are their endpoints. in this way we know to repaint
        // them wthout having to calculate anything else about them.
        var _updateAnchorList = function (lists, theta, order, conn, aBoolean, otherElId, idx, reverse, edgeId, elId, connsToPaint, endpointsToPaint) {
            // first try to find the exact match, but keep track of the first index of a matching element id along the way.s
            var exactIdx = -1,
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
                listToRemoveFrom = endpoint._continuousAnchorEdge ? lists[endpoint._continuousAnchorEdge] : null,
                i,
                candidate;

            if (listToRemoveFrom) {
                var rIdx = _ju.findWithFunction(listToRemoveFrom, function (e) {
                    return e[4] == endpointId;
                });
                if (rIdx != -1) {
                    listToRemoveFrom.splice(rIdx, 1);
                    // get all connections from this list
                    for (i = 0; i < listToRemoveFrom.length; i++) {
                        candidate = listToRemoveFrom[i][1];
                        _ju.addWithFunction(connsToPaint, candidate, function (c) {
                            return c.id == candidate.id;
                        });
                        _ju.addWithFunction(endpointsToPaint, listToRemoveFrom[i][1].endpoints[idx], function (e) {
                            return e.id == candidate.endpoints[idx].id;
                        });
                        _ju.addWithFunction(endpointsToPaint, listToRemoveFrom[i][1].endpoints[oIdx], function (e) {
                            return e.id == candidate.endpoints[oIdx].id;
                        });
                    }
                }
            }

            for (i = 0; i < listToAddTo.length; i++) {
                candidate = listToAddTo[i][1];
                if (params.idx == 1 && listToAddTo[i][3] === otherElId && firstMatchingElIdx == -1)
                    firstMatchingElIdx = i;
                _ju.addWithFunction(connsToPaint, candidate, function (c) {
                    return c.id == candidate.id;
                });
                _ju.addWithFunction(endpointsToPaint, listToAddTo[i][1].endpoints[idx], function (e) {
                    return e.id == candidate.endpoints[idx].id;
                });
                _ju.addWithFunction(endpointsToPaint, listToAddTo[i][1].endpoints[oIdx], function (e) {
                    return e.id == candidate.endpoints[oIdx].id;
                });
            }
            if (exactIdx != -1) {
                listToAddTo[exactIdx] = values;
            }
            else {
                var insertIdx = reverse ? firstMatchingElIdx != -1 ? firstMatchingElIdx : 0 : listToAddTo.length; // of course we will get this from having looked through the array shortly.
                listToAddTo.splice(insertIdx, 0, values);
            }

            // store this for next time.
            endpoint._continuousAnchorEdge = edgeId;
        };

        //
        // find the entry in an endpoint's list for this connection and update its target endpoint
        // with the current target in the connection.
        // This method and sourceChanged need to be folder into one.
        //
        this.updateOtherEndpoint = function (sourceElId, oldTargetId, newTargetId, connection) {
            var sIndex = _ju.findWithFunction(connectionsByElementId[sourceElId], function (i) {
                    return i[0].id === connection.id;
                }),
                tIndex = _ju.findWithFunction(connectionsByElementId[oldTargetId], function (i) {
                    return i[0].id === connection.id;
                });

            // update or add data for source
            if (sIndex != -1) {
                connectionsByElementId[sourceElId][sIndex][0] = connection;
                connectionsByElementId[sourceElId][sIndex][1] = connection.endpoints[1];
                connectionsByElementId[sourceElId][sIndex][2] = connection.endpoints[1].anchor.constructor == _jp.DynamicAnchor;
            }

            // remove entry for previous target (if there)
            if (tIndex > -1) {
                connectionsByElementId[oldTargetId].splice(tIndex, 1);
                // add entry for new target
                _ju.addToList(connectionsByElementId, newTargetId, [connection, connection.endpoints[0], connection.endpoints[0].anchor.constructor == _jp.DynamicAnchor]);
            }

            connection.updateConnectedClass();
        };

        //
        // notification that the connection given has changed source from the originalId to the newId.
        // This involves:
        // 1. removing the connection from the list of connections stored for the originalId
        // 2. updating the source information for the target of the connection
        // 3. re-registering the connection in connectionsByElementId with the newId
        //
        this.sourceChanged = function (originalId, newId, connection, newElement) {
            if (originalId !== newId) {

                connection.sourceId = newId;
                connection.source = newElement;

                // remove the entry that points from the old source to the target
                _ju.removeWithFunction(connectionsByElementId[originalId], function (info) {
                    return info[0].id === connection.id;
                });
                // find entry for target and update it
                var tIdx = _ju.findWithFunction(connectionsByElementId[connection.targetId], function (i) {
                    return i[0].id === connection.id;
                });
                if (tIdx > -1) {
                    connectionsByElementId[connection.targetId][tIdx][0] = connection;
                    connectionsByElementId[connection.targetId][tIdx][1] = connection.endpoints[0];
                    connectionsByElementId[connection.targetId][tIdx][2] = connection.endpoints[0].anchor.constructor == _jp.DynamicAnchor;
                }
                // add entry for new source
                _ju.addToList(connectionsByElementId, newId, [connection, connection.endpoints[1], connection.endpoints[1].anchor.constructor == _jp.DynamicAnchor]);

                // TODO SP not final on this yet. when a user drags an existing connection and it turns into a self
                // loop, then this code hides the target endpoint (by removing it from the DOM) But I think this should
                // occur only if the anchor is Continuous
                if (connection.endpoints[1].anchor.isContinuous) {
                    if (connection.source === connection.target) {
                        connection._jsPlumb.instance.removeElement(connection.endpoints[1].canvas);
                    }
                    else {
                        if (connection.endpoints[1].canvas.parentNode == null) {
                            connection._jsPlumb.instance.appendElement(connection.endpoints[1].canvas);
                        }
                    }
                }

                connection.updateConnectedClass();
            }
        };

        //
        // moves the given endpoint from `currentId` to `element`.
        // This involves:
        //
        // 1. changing the key in _amEndpoints under which the endpoint is stored
        // 2. changing the source or target values in all of the endpoint's connections
        // 3. changing the array in connectionsByElementId in which the endpoint's connections
        //    are stored (done by either sourceChanged or updateOtherEndpoint)
        //
        this.rehomeEndpoint = function (ep, currentId, element) {
            var eps = _amEndpoints[currentId] || [],
                elementId = jsPlumbInstance.getId(element);

            if (elementId !== currentId) {
                var idx = eps.indexOf(ep);
                if (idx > -1) {
                    var _ep = eps.splice(idx, 1)[0];
                    self.add(_ep, elementId);
                }
            }

            for (var i = 0; i < ep.connections.length; i++) {
                if (ep.connections[i].sourceId == currentId) {
                    //ep.connections[i].sourceId = ep.elementId;
                    //ep.connections[i].source = ep.element;
                    self.sourceChanged(currentId, ep.elementId, ep.connections[i], ep.element);
                }
                else if (ep.connections[i].targetId == currentId) {
                    ep.connections[i].targetId = ep.elementId;
                    ep.connections[i].target = ep.element;
                    self.updateOtherEndpoint(ep.connections[i].sourceId, currentId, ep.elementId, ep.connections[i]);
                }
            }
        };

        this.redraw = function (elementId, ui, timestamp, offsetToUI, clearEdits, doNotRecalcEndpoint) {

            if (!jsPlumbInstance.isSuspendDrawing()) {
                // get all the endpoints for this element
                var ep = _amEndpoints[elementId] || [],
                    endpointConnections = connectionsByElementId[elementId] || [],
                    connectionsToPaint = [],
                    endpointsToPaint = [],
                    anchorsToUpdate = [];

                timestamp = timestamp || jsPlumbInstance.timestamp();
                // offsetToUI are values that would have been calculated in the dragManager when registering
                // an endpoint for an element that had a parent (somewhere in the hierarchy) that had been
                // registered as draggable.
                offsetToUI = offsetToUI || {left: 0, top: 0};
                if (ui) {
                    ui = {
                        left: ui.left + offsetToUI.left,
                        top: ui.top + offsetToUI.top
                    };
                }

                // valid for one paint cycle.
                var myOffset = jsPlumbInstance.updateOffset({ elId: elementId, offset: ui, recalc: false, timestamp: timestamp }),
                    orientationCache = {};

                // actually, first we should compute the orientation of this element to all other elements to which
                // this element is connected with a continuous anchor (whether both ends of the connection have
                // a continuous anchor or just one)

                for (var i = 0; i < endpointConnections.length; i++) {
                    var conn = endpointConnections[i][0],
                        sourceId = conn.sourceId,
                        targetId = conn.targetId,
                        sourceContinuous = conn.endpoints[0].anchor.isContinuous,
                        targetContinuous = conn.endpoints[1].anchor.isContinuous;

                    if (sourceContinuous || targetContinuous) {
                        var oKey = sourceId + "_" + targetId,
                            o = orientationCache[oKey],
                            oIdx = conn.sourceId == elementId ? 1 : 0;

                        if (sourceContinuous && !anchorLists[sourceId]) anchorLists[sourceId] = { top: [], right: [], bottom: [], left: [] };
                        if (targetContinuous && !anchorLists[targetId]) anchorLists[targetId] = { top: [], right: [], bottom: [], left: [] };

                        if (elementId != targetId) jsPlumbInstance.updateOffset({ elId: targetId, timestamp: timestamp });
                        if (elementId != sourceId) jsPlumbInstance.updateOffset({ elId: sourceId, timestamp: timestamp });

                        var td = jsPlumbInstance.getCachedData(targetId),
                            sd = jsPlumbInstance.getCachedData(sourceId);

                        if (targetId == sourceId && (sourceContinuous || targetContinuous)) {
                            // here we may want to improve this by somehow determining the face we'd like
                            // to put the connector on.  ideally, when drawing, the face should be calculated
                            // by determining which face is closest to the point at which the mouse button
                            // was released.  for now, we're putting it on the top face.
                            _updateAnchorList( anchorLists[sourceId], -Math.PI / 2, 0, conn, false, targetId, 0, false, "top", sourceId, connectionsToPaint, endpointsToPaint);
                            _updateAnchorList( anchorLists[targetId], -Math.PI / 2, 0, conn, false, sourceId, 1, false, "top", targetId, connectionsToPaint, endpointsToPaint);
                        }
                        else {
                            if (!o) {
                                o = calculateOrientation(sourceId, targetId, sd.o, td.o, conn.endpoints[0].anchor, conn.endpoints[1].anchor);
                                orientationCache[oKey] = o;
                                // this would be a performance enhancement, but the computed angles need to be clamped to
                                //the (-PI/2 -> PI/2) range in order for the sorting to work properly.
                                /*  orientationCache[oKey2] = {
                                 orientation:o.orientation,
                                 a:[o.a[1], o.a[0]],
                                 theta:o.theta + Math.PI,
                                 theta2:o.theta2 + Math.PI
                                 };*/
                            }
                            if (sourceContinuous) _updateAnchorList(anchorLists[sourceId], o.theta, 0, conn, false, targetId, 0, false, o.a[0], sourceId, connectionsToPaint, endpointsToPaint);
                            if (targetContinuous) _updateAnchorList(anchorLists[targetId], o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], targetId, connectionsToPaint, endpointsToPaint);
                        }

                        if (sourceContinuous) _ju.addWithFunction(anchorsToUpdate, sourceId, function (a) {
                            return a === sourceId;
                        });
                        if (targetContinuous) _ju.addWithFunction(anchorsToUpdate, targetId, function (a) {
                            return a === targetId;
                        });
                        _ju.addWithFunction(connectionsToPaint, conn, function (c) {
                            return c.id == conn.id;
                        });
                        if ((sourceContinuous && oIdx === 0) || (targetContinuous && oIdx === 1))
                            _ju.addWithFunction(endpointsToPaint, conn.endpoints[oIdx], function (e) {
                                return e.id == conn.endpoints[oIdx].id;
                            });
                    }
                }

                // place Endpoints whose anchors are continuous but have no Connections
                for (i = 0; i < ep.length; i++) {
                    if (ep[i].connections.length === 0 && ep[i].anchor.isContinuous) {
                        if (!anchorLists[elementId]) anchorLists[elementId] = { top: [], right: [], bottom: [], left: [] };
                        _updateAnchorList(anchorLists[elementId], -Math.PI / 2, 0, {endpoints: [ep[i], ep[i]], paint: function () {
                        }}, false, elementId, 0, false, ep[i].anchor.getDefaultFace(), elementId, connectionsToPaint, endpointsToPaint);
                        _ju.addWithFunction(anchorsToUpdate, elementId, function (a) {
                            return a === elementId;
                        });
                    }
                }


                // now place all the continuous anchors we need to;
                for (i = 0; i < anchorsToUpdate.length; i++) {
                    placeAnchors(anchorsToUpdate[i], anchorLists[anchorsToUpdate[i]]);
                }

                // now that continuous anchors have been placed, paint all the endpoints for this element
                // TODO performance: add the endpoint ids to a temp array, and then when iterating in the next
                // loop, check that we didn't just paint that endpoint. we can probably shave off a few more milliseconds this way.
                for (i = 0; i < ep.length; i++) {
                    ep[i].paint({ timestamp: timestamp, offset: myOffset, dimensions: myOffset.s, recalc: doNotRecalcEndpoint !== true });
                }

                // ... and any other endpoints we came across as a result of the continuous anchors.
                for (i = 0; i < endpointsToPaint.length; i++) {
                    var cd = jsPlumbInstance.getCachedData(endpointsToPaint[i].elementId);
                    endpointsToPaint[i].paint({ timestamp: timestamp, offset: cd, dimensions: cd.s });
                }

                // paint all the standard and "dynamic connections", which are connections whose other anchor is
                // static and therefore does need to be recomputed; we make sure that happens only one time.

                // TODO we could have compiled a list of these in the first pass through connections; might save some time.
                for (i = 0; i < endpointConnections.length; i++) {
                    var otherEndpoint = endpointConnections[i][1];
                    if (otherEndpoint.anchor.constructor == _jp.DynamicAnchor) {
                        otherEndpoint.paint({ elementWithPrecedence: elementId, timestamp: timestamp });
                        _ju.addWithFunction(connectionsToPaint, endpointConnections[i][0], function (c) {
                            return c.id == endpointConnections[i][0].id;
                        });
                        // all the connections for the other endpoint now need to be repainted
                        for (var k = 0; k < otherEndpoint.connections.length; k++) {
                            if (otherEndpoint.connections[k] !== endpointConnections[i][0])
                                _ju.addWithFunction(connectionsToPaint, otherEndpoint.connections[k], function (c) {
                                    return c.id == otherEndpoint.connections[k].id;
                                });
                        }
                    } else if (otherEndpoint.anchor.constructor == _jp.Anchor) {
                        _ju.addWithFunction(connectionsToPaint, endpointConnections[i][0], function (c) {
                            return c.id == endpointConnections[i][0].id;
                        });
                    }
                }

                // paint current floating connection for this element, if there is one.
                var fc = floatingConnections[elementId];
                if (fc)
                    fc.paint({timestamp: timestamp, recalc: false, elId: elementId});

                // paint all the connections
                for (i = 0; i < connectionsToPaint.length; i++) {
                    connectionsToPaint[i].paint({elId: elementId, timestamp: timestamp, recalc: false, clearEdits: clearEdits});
                }
            }
        };

        var ContinuousAnchor = function (anchorParams) {
            _ju.EventGenerator.apply(this);
            this.type = "Continuous";
            this.isDynamic = true;
            this.isContinuous = true;
            var faces = anchorParams.faces || ["top", "right", "bottom", "left"],
                clockwise = !(anchorParams.clockwise === false),
                availableFaces = { },
                opposites = { "top": "bottom", "right": "left", "left": "right", "bottom": "top" },
                clockwiseOptions = { "top": "right", "right": "bottom", "left": "top", "bottom": "left" },
                antiClockwiseOptions = { "top": "left", "right": "top", "left": "bottom", "bottom": "right" },
                secondBest = clockwise ? clockwiseOptions : antiClockwiseOptions,
                lastChoice = clockwise ? antiClockwiseOptions : clockwiseOptions,
                cssClass = anchorParams.cssClass || "";

            for (var i = 0; i < faces.length; i++) {
                availableFaces[faces[i]] = true;
            }

            this.getDefaultFace = function () {
                return faces.length === 0 ? "top" : faces[0];
            };

            // if the given edge is supported, returns it. otherwise looks for a substitute that _is_
            // supported. if none supported we also return the request edge.
            this.verifyEdge = function (edge) {
                if (availableFaces[edge]) return edge;
                else if (availableFaces[opposites[edge]]) return opposites[edge];
                else if (availableFaces[secondBest[edge]]) return secondBest[edge];
                else if (availableFaces[lastChoice[edge]]) return lastChoice[edge];
                return edge; // we have to give them something.
            };

            this.isEdgeSupported = function (edge) {
                return availableFaces[edge] === true;
            };

            this.compute = function (params) {
                return userDefinedContinuousAnchorLocations[params.element.id] || continuousAnchorLocations[params.element.id] || [0, 0];
            };
            this.getCurrentLocation = function (params) {
                return userDefinedContinuousAnchorLocations[params.element.id] || continuousAnchorLocations[params.element.id] || [0, 0];
            };
            this.getOrientation = function (endpoint) {
                return continuousAnchorOrientations[endpoint.id] || [0, 0];
            };
            this.clearUserDefinedLocation = function () {
                delete userDefinedContinuousAnchorLocations[anchorParams.elementId];
            };
            this.setUserDefinedLocation = function (loc) {
                userDefinedContinuousAnchorLocations[anchorParams.elementId] = loc;
            };
            this.getCssClass = function () {
                return cssClass;
            };
        };

        // continuous anchors
        jsPlumbInstance.continuousAnchorFactory = {
            get: function (params) {
                return new ContinuousAnchor(params);
            },
            clear: function (elementId) {
                delete userDefinedContinuousAnchorLocations[elementId];
                delete continuousAnchorLocations[elementId];
            }
        };
    };

    /**
     * Anchors model a position on some element at which an Endpoint may be located.  They began as a first class citizen of jsPlumb, ie. a user
     * was required to create these themselves, but over time this has been replaced by the concept of referring to them either by name (eg. "TopMiddle"),
     * or by an array describing their coordinates (eg. [ 0, 0.5, 0, -1 ], which is the same as "TopMiddle").  jsPlumb now handles all of the
     * creation of Anchors without user intervention.
     */
    _jp.Anchor = function (params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.elementId = params.elementId;
        this.cssClass = params.cssClass || "";
        this.userDefinedLocation = null;
        this.orientation = params.orientation || [ 0, 0 ];
        this.lastReturnValue = null;
        this.offsets = params.offsets || [ 0, 0 ];
        this.timestamp = null;

        _ju.EventGenerator.apply(this);

        this.compute = function (params) {

            var xy = params.xy, wh = params.wh, timestamp = params.timestamp;

            if (params.clearUserDefinedLocation)
                this.userDefinedLocation = null;

            if (timestamp && timestamp === self.timestamp)
                return this.lastReturnValue;

            if (this.userDefinedLocation != null) {
                this.lastReturnValue = this.userDefinedLocation;
            }
            else {
                this.lastReturnValue = [ xy[0] + (this.x * wh[0]) + this.offsets[0], xy[1] + (this.y * wh[1]) + this.offsets[1] ];
            }

            this.timestamp = timestamp;
            return this.lastReturnValue;
        };

        this.getCurrentLocation = function (params) {
            params = params || {};
            return (this.lastReturnValue == null || (params.timestamp != null && this.timestamp != params.timestamp)) ? this.compute(params) : this.lastReturnValue;
        };
    };
    _ju.extend(_jp.Anchor, _ju.EventGenerator, {
        equals: function (anchor) {
            if (!anchor) return false;
            var ao = anchor.getOrientation(),
                o = this.getOrientation();
            return this.x == anchor.x && this.y == anchor.y && this.offsets[0] == anchor.offsets[0] && this.offsets[1] == anchor.offsets[1] && o[0] == ao[0] && o[1] == ao[1];
        },
        getUserDefinedLocation: function () {
            return this.userDefinedLocation;
        },
        setUserDefinedLocation: function (l) {
            this.userDefinedLocation = l;
        },
        clearUserDefinedLocation: function () {
            this.userDefinedLocation = null;
        },
        getOrientation: function () {
            return this.orientation;
        },
        getCssClass: function () {
            return this.cssClass;
        }
    });

    /**
     * An Anchor that floats. its orientation is computed dynamically from
     * its position relative to the anchor it is floating relative to.  It is used when creating
     * a connection through drag and drop.
     *
     * TODO FloatingAnchor could totally be refactored to extend Anchor just slightly.
     */
    _jp.FloatingAnchor = function (params) {

        _jp.Anchor.apply(this, arguments);

        // this is the anchor that this floating anchor is referenced to for
        // purposes of calculating the orientation.
        var ref = params.reference,
            // the canvas this refers to.
            refCanvas = params.referenceCanvas,
            size = _jp.getSize(refCanvas),
            // these are used to store the current relative position of our
            // anchor wrt the reference anchor. they only indicate
            // direction, so have a value of 1 or -1 (or, very rarely, 0). these
            // values are written by the compute method, and read
            // by the getOrientation method.
            xDir = 0, yDir = 0,
            // temporary member used to store an orientation when the floating
            // anchor is hovering over another anchor.
            orientation = null,
            _lastResult = null;

        // clear from parent. we want floating anchor orientation to always be computed.
        this.orientation = null;

        // set these to 0 each; they are used by certain types of connectors in the loopback case,
        // when the connector is trying to clear the element it is on. but for floating anchor it's not
        // very important.
        this.x = 0;
        this.y = 0;

        this.isFloating = true;

        this.compute = function (params) {
            var xy = params.xy,
                result = [ xy[0] + (size[0] / 2), xy[1] + (size[1] / 2) ]; // return origin of the element. we may wish to improve this so that any object can be the drag proxy.
            _lastResult = result;
            return result;
        };

        this.getOrientation = function (_endpoint) {
            if (orientation) return orientation;
            else {
                var o = ref.getOrientation(_endpoint);
                // here we take into account the orientation of the other
                // anchor: if it declares zero for some direction, we declare zero too. this might not be the most awesome. perhaps we can come
                // up with a better way. it's just so that the line we draw looks like it makes sense. maybe this wont make sense.
                return [ Math.abs(o[0]) * xDir * -1,
                        Math.abs(o[1]) * yDir * -1 ];
            }
        };

        /**
         * notification the endpoint associated with this anchor is hovering
         * over another anchor; we want to assume that anchor's orientation
         * for the duration of the hover.
         */
        this.over = function (anchor, endpoint) {
            orientation = anchor.getOrientation(endpoint);
        };

        /**
         * notification the endpoint associated with this anchor is no
         * longer hovering over another anchor; we should resume calculating
         * orientation as we normally do.
         */
        this.out = function () {
            orientation = null;
        };

        this.getCurrentLocation = function (params) {
            return _lastResult == null ? this.compute(params) : _lastResult;
        };
    };
    _ju.extend(_jp.FloatingAnchor, _jp.Anchor);

    var _convertAnchor = function (anchor, jsPlumbInstance, elementId) {
        return anchor.constructor == _jp.Anchor ? anchor : jsPlumbInstance.makeAnchor(anchor, elementId, jsPlumbInstance);
    };

    /* 
     * A DynamicAnchor is an Anchor that contains a list of other Anchors, which it cycles
     * through at compute time to find the one that is located closest to
     * the center of the target element, and returns that Anchor's compute
     * method result. this causes endpoints to follow each other with
     * respect to the orientation of their target elements, which is a useful
     * feature for some applications.
     * 
     */
    _jp.DynamicAnchor = function (params) {
        _jp.Anchor.apply(this, arguments);

        this.isDynamic = true;
        this.anchors = [];
        this.elementId = params.elementId;
        this.jsPlumbInstance = params.jsPlumbInstance;

        for (var i = 0; i < params.anchors.length; i++)
            this.anchors[i] = _convertAnchor(params.anchors[i], this.jsPlumbInstance, this.elementId);

        this.getAnchors = function () {
            return this.anchors;
        };
        this.locked = false;
        var _curAnchor = this.anchors.length > 0 ? this.anchors[0] : null,
            _lastAnchor = _curAnchor,
            self = this,

        // helper method to calculate the distance between the centers of the two elements.
            _distance = function (anchor, cx, cy, xy, wh) {
                var ax = xy[0] + (anchor.x * wh[0]), ay = xy[1] + (anchor.y * wh[1]),
                    acx = xy[0] + (wh[0] / 2), acy = xy[1] + (wh[1] / 2);
                return (Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) +
                    Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2)));
            },
        // default method uses distance between element centers.  you can provide your own method in the dynamic anchor
        // constructor (and also to jsPlumb.makeDynamicAnchor). the arguments to it are four arrays:
        // xy - xy loc of the anchor's element
        // wh - anchor's element's dimensions
        // txy - xy loc of the element of the other anchor in the connection
        // twh - dimensions of the element of the other anchor in the connection.
        // anchors - the list of selectable anchors
            _anchorSelector = params.selector || function (xy, wh, txy, twh, anchors) {
                var cx = txy[0] + (twh[0] / 2), cy = txy[1] + (twh[1] / 2);
                var minIdx = -1, minDist = Infinity;
                for (var i = 0; i < anchors.length; i++) {
                    var d = _distance(anchors[i], cx, cy, xy, wh);
                    if (d < minDist) {
                        minIdx = i + 0;
                        minDist = d;
                    }
                }
                return anchors[minIdx];
            };

        this.compute = function (params) {
            var xy = params.xy, wh = params.wh, txy = params.txy, twh = params.twh;

            this.timestamp = params.timestamp;

            var udl = self.getUserDefinedLocation();
            if (udl != null) {
                return udl;
            }

            // if anchor is locked or an opposite element was not given, we
            // maintain our state. anchor will be locked
            // if it is the source of a drag and drop.
            if (this.locked || txy == null || twh == null)
                return _curAnchor.compute(params);
            else
                params.timestamp = null; // otherwise clear this, i think. we want the anchor to compute.

            _curAnchor = _anchorSelector(xy, wh, txy, twh, this.anchors);
            this.x = _curAnchor.x;
            this.y = _curAnchor.y;

            if (_curAnchor != _lastAnchor)
                this.fire("anchorChanged", _curAnchor);

            _lastAnchor = _curAnchor;

            return _curAnchor.compute(params);
        };

        this.getCurrentLocation = function (params) {
            return this.getUserDefinedLocation() || (_curAnchor != null ? _curAnchor.getCurrentLocation(params) : null);
        };

        this.getOrientation = function (_endpoint) {
            return _curAnchor != null ? _curAnchor.getOrientation(_endpoint) : [ 0, 0 ];
        };
        this.over = function (anchor, endpoint) {
            if (_curAnchor != null) _curAnchor.over(anchor, endpoint);
        };
        this.out = function () {
            if (_curAnchor != null) _curAnchor.out();
        };

        this.getCssClass = function () {
            return (_curAnchor && _curAnchor.getCssClass()) || "";
        };
    };
    _ju.extend(_jp.DynamicAnchor, _jp.Anchor);

// -------- basic anchors ------------------    
    var _curryAnchor = function (x, y, ox, oy, type, fnInit) {
        _jp.Anchors[type] = function (params) {
            var a = params.jsPlumbInstance.makeAnchor([ x, y, ox, oy, 0, 0 ], params.elementId, params.jsPlumbInstance);
            a.type = type;
            if (fnInit) fnInit(a, params);
            return a;
        };
    };

    _curryAnchor(0.5, 0, 0, -1, "TopCenter");
    _curryAnchor(0.5, 1, 0, 1, "BottomCenter");
    _curryAnchor(0, 0.5, -1, 0, "LeftMiddle");
    _curryAnchor(1, 0.5, 1, 0, "RightMiddle");

    _curryAnchor(0.5, 0, 0, -1, "Top");
    _curryAnchor(0.5, 1, 0, 1, "Bottom");
    _curryAnchor(0, 0.5, -1, 0, "Left");
    _curryAnchor(1, 0.5, 1, 0, "Right");
    _curryAnchor(0.5, 0.5, 0, 0, "Center");
    _curryAnchor(1, 0, 0, -1, "TopRight");
    _curryAnchor(1, 1, 0, 1, "BottomRight");
    _curryAnchor(0, 0, 0, -1, "TopLeft");
    _curryAnchor(0, 1, 0, 1, "BottomLeft");

// ------- dynamic anchors -------------------    

    // default dynamic anchors chooses from Top, Right, Bottom, Left
    _jp.Defaults.DynamicAnchors = function (params) {
        return params.jsPlumbInstance.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"], params.elementId, params.jsPlumbInstance);
    };

    // default dynamic anchors bound to name 'AutoDefault'
    _jp.Anchors.AutoDefault = function (params) {
        var a = params.jsPlumbInstance.makeDynamicAnchor(_jp.Defaults.DynamicAnchors(params));
        a.type = "AutoDefault";
        return a;
    };

// ------- continuous anchors -------------------    

    var _curryContinuousAnchor = function (type, faces) {
        _jp.Anchors[type] = function (params) {
            var a = params.jsPlumbInstance.makeAnchor(["Continuous", { faces: faces }], params.elementId, params.jsPlumbInstance);
            a.type = type;
            return a;
        };
    };

    _jp.Anchors.Continuous = function (params) {
        return params.jsPlumbInstance.continuousAnchorFactory.get(params);
    };

    _curryContinuousAnchor("ContinuousLeft", ["left"]);
    _curryContinuousAnchor("ContinuousTop", ["top"]);
    _curryContinuousAnchor("ContinuousBottom", ["bottom"]);
    _curryContinuousAnchor("ContinuousRight", ["right"]);

// ------- position assign anchors -------------------    

    // this anchor type lets you assign the position at connection time.
    _curryAnchor(0, 0, 0, 0, "Assign", function (anchor, params) {
        // find what to use as the "position finder". the user may have supplied a String which represents
        // the id of a position finder in jsPlumb.AnchorPositionFinders, or the user may have supplied the
        // position finder as a function.  we find out what to use and then set it on the anchor.
        var pf = params.position || "Fixed";
        anchor.positionFinder = pf.constructor == String ? params.jsPlumbInstance.AnchorPositionFinders[pf] : pf;
        // always set the constructor params; the position finder might need them later (the Grid one does,
        // for example)
        anchor.constructorParams = params;
    });

    // these are the default anchor positions finders, which are used by the makeTarget function.  supplying
    // a position finder argument to that function allows you to specify where the resulting anchor will
    // be located
    root.jsPlumbInstance.prototype.AnchorPositionFinders = {
        "Fixed": function (dp, ep, es) {
            return [ (dp.left - ep.left) / es[0], (dp.top - ep.top) / es[1] ];
        },
        "Grid": function (dp, ep, es, params) {
            var dx = dp.left - ep.left, dy = dp.top - ep.top,
                gx = es[0] / (params.grid[0]), gy = es[1] / (params.grid[1]),
                mx = Math.floor(dx / gx), my = Math.floor(dy / gy);
            return [ ((mx * gx) + (gx / 2)) / es[0], ((my * gy) + (gy / 2)) / es[1] ];
        }
    };

// ------- perimeter anchors -------------------    

    _jp.Anchors.Perimeter = function (params) {
        params = params || {};
        var anchorCount = params.anchorCount || 60,
            shape = params.shape;

        if (!shape) throw new Error("no shape supplied to Perimeter Anchor type");

        var _circle = function () {
                var r = 0.5, step = Math.PI * 2 / anchorCount, current = 0, a = [];
                for (var i = 0; i < anchorCount; i++) {
                    var x = r + (r * Math.sin(current)),
                        y = r + (r * Math.cos(current));
                    a.push([ x, y, 0, 0 ]);
                    current += step;
                }
                return a;
            },
            _path = function (segments) {
                var anchorsPerFace = anchorCount / segments.length, a = [],
                    _computeFace = function (x1, y1, x2, y2, fractionalLength) {
                        anchorsPerFace = anchorCount * fractionalLength;
                        var dx = (x2 - x1) / anchorsPerFace, dy = (y2 - y1) / anchorsPerFace;
                        for (var i = 0; i < anchorsPerFace; i++) {
                            a.push([
                                    x1 + (dx * i),
                                    y1 + (dy * i),
                                0,
                                0
                            ]);
                        }
                    };

                for (var i = 0; i < segments.length; i++)
                    _computeFace.apply(null, segments[i]);

                return a;
            },
            _shape = function (faces) {
                var s = [];
                for (var i = 0; i < faces.length; i++) {
                    s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length]);
                }
                return _path(s);
            },
            _rectangle = function () {
                return _shape([
                    [ 0, 0, 1, 0 ],
                    [ 1, 0, 1, 1 ],
                    [ 1, 1, 0, 1 ],
                    [ 0, 1, 0, 0 ]
                ]);
            };

        var _shapes = {
                "Circle": _circle,
                "Ellipse": _circle,
                "Diamond": function () {
                    return _shape([
                        [ 0.5, 0, 1, 0.5 ],
                        [ 1, 0.5, 0.5, 1 ],
                        [ 0.5, 1, 0, 0.5 ],
                        [ 0, 0.5, 0.5, 0 ]
                    ]);
                },
                "Rectangle": _rectangle,
                "Square": _rectangle,
                "Triangle": function () {
                    return _shape([
                        [ 0.5, 0, 1, 1 ],
                        [ 1, 1, 0, 1 ],
                        [ 0, 1, 0.5, 0]
                    ]);
                },
                "Path": function (params) {
                    var points = params.points, p = [], tl = 0;
                    for (var i = 0; i < points.length - 1; i++) {
                        var l = Math.sqrt(Math.pow(points[i][2] - points[i][0]) + Math.pow(points[i][3] - points[i][1]));
                        tl += l;
                        p.push([points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], l]);
                    }
                    for (var j = 0; j < p.length; j++) {
                        p[j][4] = p[j][4] / tl;
                    }
                    return _path(p);
                }
            },
            _rotate = function (points, amountInDegrees) {
                var o = [], theta = amountInDegrees / 180 * Math.PI;
                for (var i = 0; i < points.length; i++) {
                    var _x = points[i][0] - 0.5,
                        _y = points[i][1] - 0.5;

                    o.push([
                            0.5 + ((_x * Math.cos(theta)) - (_y * Math.sin(theta))),
                            0.5 + ((_x * Math.sin(theta)) + (_y * Math.cos(theta))),
                        points[i][2],
                        points[i][3]
                    ]);
                }
                return o;
            };

        if (!_shapes[shape]) throw new Error("Shape [" + shape + "] is unknown by Perimeter Anchor type");

        var da = _shapes[shape](params);
        if (params.rotation) da = _rotate(da, params.rotation);
        var a = params.jsPlumbInstance.makeDynamicAnchor(da);
        a.type = "Perimeter";
        return a;
    };
}).call(typeof window !== 'undefined' ? window : this);
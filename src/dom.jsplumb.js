/*
 * This file contains code used when jsPlumb is being rendered in a DOM.
 *
 * Copyright (c) 2010 - 2019 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
;
(function () {

    "use strict";

    var _time = { };
    var _counts = { };
    var _timers = {};
    var _onlyProfile = null;
    var _enabled = false;

    window.jtimeEnable = function() {
        _enabled = true;
    };

    window.jtime = function(topic) {
        if (_enabled && (_onlyProfile == null || _onlyProfile === topic)) {
            _time[topic] = _time[topic] || 0;
            _timers[topic] = new Date().getTime();
            _counts[topic] = _counts[topic] || 0;
            _counts[topic]++;
        }
    };

    window.jtimeEnd = function(topic) {
        if (_enabled && (_onlyProfile == null || _onlyProfile === topic)) {
            var d = new Date().getTime();
            _time[topic] = _time[topic] + (d - _timers[topic]);
        }
    };

    window.dumpTime = function() {

        function pc(a, b) {
            return Math.trunc( a / b * 100) + "%";
        }

        if (_enabled) {
            var list = [], grandTotal = 0;
            for (var t in _time) {
                list.push({topic:t, count:_counts[t], total:_time[t], avg:_time[t] /  _counts[t]});
                grandTotal += _time[t];
            }
            list.sort(function(a, b) {
                if (a.total > b.total) {
                    return -1;
                }
                else {
                    return 1;
                }

            });

            list.forEach(function(entry) {
                console.log(entry.topic + " : count [" + entry.count + "] avg [" + entry.avg + "] total [" + entry.total + "]  + percent [" + pc(entry.total, grandTotal) + "]");
            });
        }
    };

    window.jtimeProfileOnly = function(category) {
        _onlyProfile = category;
    };

    var _makeConnectionDragHandler = function (endpoint, placeholder, _jsPlumb) {
        var stopped = false;
        return {
            drag: function () {
                if (stopped) {
                    stopped = false;
                    return true;
                }

                if (placeholder.element) {
                    var _ui = _jsPlumb.getUIPosition(arguments, _jsPlumb.getZoom());
                    if (_ui != null) {
                        _jsPlumb.setPosition(placeholder.element, _ui);
                    }
                    _jsPlumb.repaint(placeholder.element, _ui);
                    // always repaint the source endpoint, because only continuous/dynamic anchors cause the endpoint
                    // to be repainted, so static anchors need to be told (or the endpoint gets dragged around)
                    endpoint.paint({anchorPoint:endpoint.anchor.getCurrentLocation({element:endpoint})});
                }
            },
            stopDrag: function () {
                stopped = true;
            }
        };
    };

    var selectorFilter = function (evt, _el, selector, _instance, negate) {
        var t = evt.target || evt.srcElement, ok = false,
            sel = _instance.getSelector(_el, selector);
        for (var j = 0; j < sel.length; j++) {
            if (sel[j] === t) {
                ok = true;
                break;
            }
        }
        return negate ? !ok : ok;
    };

    // creates a placeholder div for dragging purposes, adds it, and pre-computes its offset.
    var _makeDraggablePlaceholder = function (placeholder, _jsPlumb, ipco, ips) {
        var n = _jsPlumb.createElement("div", { position : "absolute" });
        _jsPlumb.appendElement(n);
        var id = _jsPlumb.getId(n);
        _jsPlumb.setPosition(n, ipco);
        n.style.width = ips[0] + "px";
        n.style.height = ips[1] + "px";
        _jsPlumb.manage(id, n, true); // TRANSIENT MANAGE
        // create and assign an id, and initialize the offset.
        placeholder.id = id;
        placeholder.element = n;
        return n;
    };

    // create a floating endpoint (for drag connections)
    var _makeFloatingEndpoint = function (paintStyle, referenceAnchor, endpoint, referenceCanvas, sourceElement, _jsPlumb, scope) {
        var floatingAnchor = new _jp.FloatingAnchor({ reference: referenceAnchor, referenceCanvas: referenceCanvas, jsPlumbInstance: _jsPlumb });
        //setting the scope here should not be the way to fix that mootools issue.  it should be fixed by not
        // adding the floating endpoint as a droppable.  that makes more sense anyway!
        // TRANSIENT MANAGE
        return _jsPlumb._newEndpoint({
            paintStyle: paintStyle,
            endpoint: endpoint,
            anchor: floatingAnchor,
            source: sourceElement,
            scope: scope
        });
    };


    var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil,
        _jk = root.Katavorio, _jg = root.Biltong;

    var _getEventManager = function(instance) {
        var e = instance._mottle;
        if (!e) {
            e = instance._mottle = new root.Mottle();
        }
        return e;
    };

    var _getDragManager = function (instance, category) {

        category = category || "main";
        var key = "_katavorio_" + category;
        var k = instance[key],
            e = instance.getEventManager();

        if (!k) {

            if (category !== "main") {

                k = new _jk({
                    bind: e.on,
                    unbind: e.off,
                    getSize: _jp.getSize,
                    getConstrainingRectangle: function (el) {
                        return [el.parentNode.scrollWidth, el.parentNode.scrollHeight];
                    },
                    getPosition: function (el, relativeToRoot) {
                        // if this is a nested draggable then compute the offset against its own offsetParent, otherwise
                        // compute against the Container's origin. see also the getUIPosition method below.
                        var o = instance.getOffset(el, relativeToRoot, el._katavorioDrag ? el.offsetParent : null);
                        return [o.left, o.top];
                    },
                    setPosition: function (el, xy) {
                        el.style.left = xy[0] + "px";
                        el.style.top = xy[1] + "px";
                    },
                    addClass: _jp.addClass,
                    removeClass: _jp.removeClass,
                    intersects: _jg.intersects,
                    indexOf: function (l, i) {
                        return l.indexOf(i);
                    },
                    scope: instance.getDefaultScope(),
                    css: {
                        noSelect: instance.dragSelectClass,
                        droppable: "jtk-droppable",
                        delegatedDraggable:"jtk-delegated-draggable",
                        draggable: "jtk-draggable",
                        drag: "jtk-drag",
                        selected: "jtk-drag-selected",
                        active: "jtk-drag-active",
                        hover: "jtk-drag-hover",
                        ghostProxy: "jtk-ghost-proxy"
                    }
                });
            }

            k.setZoom(instance.getZoom());
            instance[key] = k;
            instance.bind("zoom", k.setZoom);
        }
        return k;
    };

    function hasManagedParent(container, el) {
        var pn = el.parentNode;
        while (pn != null && pn !== container) {
            if (pn.getAttribute("jtk-managed") != null) {
                return true;
            } else {
                pn = pn.parentNode;
            }
        }
    }


    var _dragOffset = null;
    var _dragStart = function(instance, params) {
        var el = params.drag.getDragElement();

        if(hasManagedParent(instance.getContainer(), el) && el.offsetParent._jsPlumbGroup == null) {
            return false;
        } else {
            //var options = el._jsPlumbDragOptions;
            //_dragChildren = el.querySelectorAll("[jtk-managed]");

            // TODO refactor, now there are no drag options on each element as we dont call 'draggable' for each one. the canDrag method would
            // have been supplied to the instance's dragOptions.

            var options = el._jsPlumbDragOptions || {};
            if (el._jsPlumbGroup) {
                _dragOffset = instance.getOffset(el.offsetParent);
            }

            var cont = true;
            if (options.canDrag) {
                cont = options.canDrag();
            }
            if (cont) {
                instance.setHoverSuspended(true);
                instance.select({source: el}).addClass(instance.elementDraggingClass + " " + instance.sourceElementDraggingClass, true);
                instance.select({target: el}).addClass(instance.elementDraggingClass + " " + instance.targetElementDraggingClass, true);
                instance.setConnectionBeingDragged(true);
            }
            return cont;
        }

    };

    var _dragMove = function(instance, params) {

        var el = params.drag.getDragElement();
        var finalPos = params.finalPos || params.pos;
        var ui = { left:finalPos[0], top:finalPos[1] };

        //var ui = null;//instance.getUIPosition([params], instance.getZoom());
        if (ui != null) {
            //var o = el._jsPlumbDragOptions;

            // TODO refactor, now there are no drag options on each element as we dont call 'draggable' for each one. the canDrag method would
            // have been supplied to the instance's dragOptions.
            var o = el._jsPlumbDragOptions || {};

            if (_dragOffset != null) {
                ui.left += _dragOffset.left;
                ui.top += _dragOffset.top;
            }

            instance.draw(el, ui, null, true);
            if (o._dragging) {
                instance.addClass(el, "jtk-dragged");
            }
            o._dragging = true;

            // for (var i = 0; i < _dragChildren.length; i++) {
            //     instance.draw(_dragChildren[i]);
            // }
        }
    };

    var _dragStop = function(instance, params) {

        var elements = params.selection, uip;

        var _one = function (_e) {
            var dragElement = _e[2].getDragElement();
            if (_e[1] != null) {
                // run the reported offset through the code that takes parent containers
                // into account, to adjust if necessary (issue 554)
                uip = this.getUIPosition([{
                    el:dragElement,
                    pos:[_e[1].left, _e[1].top]
                }]);
                if (_dragOffset) {
                    uip.left += _dragOffset.left;
                    uip.top += _dragOffset.top;
                }
                this.draw(dragElement, uip);
            }

            // TODO refactor, see above: these drag options dont exist now
            //delete _e[0]._jsPlumbDragOptions._dragging;

            this.removeClass(_e[0], "jtk-dragged");
            this.select({source: dragElement}).removeClass(this.elementDraggingClass + " " + this.sourceElementDraggingClass, true);
            this.select({target: dragElement}).removeClass(this.elementDraggingClass + " " + this.targetElementDraggingClass, true);
        }.bind(instance);

        for (var i = 0; i < elements.length; i++) {
            _one(elements[i]);
        }

        instance.setHoverSuspended(false);
        instance.setConnectionBeingDragged(false);
        _dragOffset = null;
    };

    var _animProps = function (o, p) {
        var _one = function (pName) {
            if (p[pName] != null) {
                if (_ju.isString(p[pName])) {
                    var m = p[pName].match(/-=/) ? -1 : 1,
                        v = p[pName].substring(2);
                    return o[pName] + (m * v);
                }
                else {
                    return p[pName];
                }
            }
            else {
                return o[pName];
            }
        };
        return [ _one("left"), _one("top") ];
    };

    var _genLoc = function (prefix, e) {
            if (e == null) {
                return [ 0, 0 ];
            }
            var ts = _touches(e), t = _getTouch(ts, 0);
            return [t[prefix + "X"], t[prefix + "Y"]];
        },
        _pageLocation = _genLoc.bind(this, "page"),
        _screenLocation = _genLoc.bind(this, "screen"),
        _clientLocation = _genLoc.bind(this, "client"),
        _getTouch = function (touches, idx) {
            return touches.item ? touches.item(idx) : touches[idx];
        },
        _touches = function (e) {
            return e.touches && e.touches.length > 0 ? e.touches :
                e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches :
                    e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches :
                        [ e ];
        };

    /**
     Manages dragging for some instance of jsPlumb.

     TODO instead of this being accessed directly, it should subscribe to events on the jsPlumb instance: every method
     in here is called directly by jsPlumb. But what should happen is that we have unpublished events that this listens
     to.  The only trick is getting one of these instantiated with every jsPlumb instance: it needs to have a hook somehow.
     Basically the general idea is to pull ALL the drag code out (prototype method registrations plus this) into a
     dedicated drag script), that does not necessarily need to be included.


     */
    var DragManager = function (_currentInstance) {
        var _draggables = {}, _dlist = [], _elementsWithEndpoints = {},
            // elementids mapped to the draggable to which they belong.
            _draggablesForElements = {},
            e = _currentInstance.getEventManager();

        // create a delegated drag handler
        var katavorio = new _jk({
            bind: e.on,
            unbind: e.off,
            getSize: _jp.getSize,
            getConstrainingRectangle:function(el) {
                return [ el.parentNode.scrollWidth, el.parentNode.scrollHeight ];
            },
            getPosition: function (el, relativeToRoot) {
                // if this is a nested draggable then compute the offset against its own offsetParent, otherwise
                // compute against the Container's origin. see also the getUIPosition method below.
                //var o = _currentInstance.getOffset(el, relativeToRoot, el._katavorioDrag ? el.offsetParent : null);
                //var o = _currentInstance.getOffset(el, relativeToRoot, el._jsPlumbGroup ? el.offsetParent : null);
                var o = _currentInstance.getOffset(el, relativeToRoot, el.offsetParent);
                console.log("get position ", el.id, o.left, o.top);
                return [o.left, o.top];
            },
            setPosition: function (el, xy) {
                el.style.left = xy[0] + "px";
                el.style.top = xy[1] + "px";
            },
            addClass: _jp.addClass,
            removeClass: _jp.removeClass,
            intersects: _jg.intersects,
            indexOf: function(l, i) { return l.indexOf(i); },
            scope:_currentInstance.getDefaultScope(),
            css: {
                noSelect: _currentInstance.dragSelectClass,
                delegatedDraggable:"jtk-delegated-draggable",
                droppable: "jtk-droppable",
                draggable: "jtk-draggable",
                drag: "jtk-drag",
                selected: "jtk-drag-selected",
                active: "jtk-drag-active",
                hover: "jtk-drag-hover",
                ghostProxy:"jtk-ghost-proxy"
            }
        });

        //
        // ------------ drag handler for elements (and elements inside groups). this is added as a selector on the endpoint drag handler below ------------------
        //
        var elementDragOptions = jsPlumb.extend({selector:"[jtk-managed]"}, _currentInstance.Defaults.dragOptions || {});
        elementDragOptions.start = _ju.wrap(elementDragOptions.start, function(p) {
            return _dragStart(_currentInstance, p);
        });
        elementDragOptions.drag = _ju.wrap(elementDragOptions.drag, function(p) { return _dragMove(_currentInstance, p); });
        elementDragOptions.stop = _ju.wrap(elementDragOptions.stop, function(p) { return _dragStop(_currentInstance, p); });

        // var elementDragHandler = katavorio.draggable(_currentInstance.getContainer(), elementDragOptions)[0];
        // _currentInstance.bind("container:change", function(newContainer) {
        //     elementDragHandler.destroy();
        //     elementDragHandler = katavorio.draggable(newContainer, elementDragOptions);
        // });

        //_currentInstance["_katavorio_main"] = katavorio;


        //
        // ------------ drag handler for endpoints (source and target) ------------------
        //
        var endpointDragOptions = {selector:".jtk-endpoint"};
        var jpc,
            existingJpc,
            ep,
            existingJpcParams,
            placeholderInfo = { id: null, element: null },
            floatingElement = null,
            //floatingElementSize = null,
            payload,
            _stopped,
            inPlaceCopy,
            endpointDropTargets = [],
            currentDropTarget = null;

        endpointDragOptions.start = function(p) {
            console.log("drag started on endpoint");

            currentDropTarget = null;

            ep = p.drag.getDragElement()._jsPlumb;
            if (!ep) {
                return false;
            }

            jpc = ep.connectorSelector();

// -------------------------------- now a bunch of tests about whether or not to proceed -------------------------

            var _continue = true;
            // if not enabled, return
            if (!ep.isEnabled()) {
                _continue = false;
            }
            // if no connection and we're not a source - or temporarily a source, as is the case with makeSource - return.
            if (jpc == null && !ep.isSource && !ep.isTemporarySource) {
                _continue = false;
            }
            // otherwise if we're full and not allowed to drag, also return false.
            if (ep.isSource && ep.isFull() && !(jpc != null && ep.dragAllowedWhenFull)) {
                _continue = false;
            }
            // if the connection was setup as not detachable or one of its endpoints
            // was setup as connectionsDetachable = false, or Defaults.ConnectionsDetachable
            // is set to false...
            if (jpc != null && !jpc.isDetachable(ep)) {
                // .. and the endpoint is full
                if (ep.isFull()) {
                    _continue = false;
                } else {
                    // otherwise, if not full, set the connection to null, and we will now proceed
                    // to drag a new connection.
                    jpc = null;
                }
            }

            var beforeDrag = _currentInstance.checkCondition(jpc == null ? "beforeDrag" : "beforeStartDetach", {
                endpoint:ep,
                source:ep.element,
                sourceId:ep.elementId,
                connection:jpc
            });
            if (beforeDrag === false) {
                _continue = false;
            }
            // else we might have been given some data. we'll pass it in to a new connection as 'data'.
            // here we also merge in the optional payload we were given on mousedown.
            else if (typeof beforeDrag === "object") {
                _jp.extend(beforeDrag, payload || {});
            }
            else {
                // or if no beforeDrag data, maybe use the payload on its own.
                beforeDrag = payload || {};
            }

            if (_continue === false) {
                // this is for mootools and yui. returning false from this causes jquery to stop drag.
                // the events are wrapped in both mootools and yui anyway, but i don't think returning
                // false from the start callback would stop a drag.
                // if (_currentInstance.stopDrag) {
                //     _currentInstance.stopDrag(ep.canvas);
                // }
                //_dragHandler.stopDrag();
                _stopped = true;
                return false;
            }

// ---------------------------------------------------------------------------------------------------------------------

            // ok to proceed.

            // clear hover for all connections for this endpoint before continuing.
            for (var i = 0; i < ep.connections.length; i++) {
                ep.connections[i].setHover(false);
            }

            // clear this list. we'll reconstruct it based on whether its an existing or new connection.s
            endpointDropTargets.length = 0;

            ep.addClass("endpointDrag");
            _currentInstance.setConnectionBeingDragged(true);

            // if we're not full but there was a connection, make it null. we'll create a new one.
            if (jpc && !ep.isFull() && ep.isSource) {
                jpc = null;
            }

            _currentInstance.updateOffset({ elId: ep.elementId });

// ----------------    make the element we will drag around, and position it -----------------------------

            var ipco = _currentInstance.getOffset(ep.canvas),
                canvasElement = ep.canvas,
                ips = _currentInstance.getSize(ep.canvas);

            _makeDraggablePlaceholder(placeholderInfo, _currentInstance, ipco, ips);

            // store the id of the dragging div and the source element. the drop function will pick these up.
            _currentInstance.setAttributes(ep.canvas, {
                "dragId": placeholderInfo.id,
                "elId": ep.elementId
            });

// ------------------- create an endpoint that will be our floating endpoint ------------------------------------

            var endpointToFloat = ep.dragProxy || ep.endpoint;
            if (ep.dragProxy == null && ep.connectionType != null) {
                var aae = _currentInstance.deriveEndpointAndAnchorSpec(ep.connectionType);
                if (aae.endpoints[1]) {
                    endpointToFloat = aae.endpoints[1];
                }
            }
            var centerAnchor = _currentInstance.makeAnchor("Center");
            centerAnchor.isFloating = true;

            _currentInstance.floatingEndpoint = _makeFloatingEndpoint(ep.getPaintStyle(), centerAnchor, endpointToFloat, ep.canvas, placeholderInfo.element, _currentInstance, ep.scope);
            var _savedAnchor = _currentInstance.floatingEndpoint.anchor;
            floatingElement = _currentInstance.floatingEndpoint.canvas;
            //floatingElementSize = _currentInstance.getSize(_currentInstance.floatingEndpoint.canvas);

            if (jpc == null) {

                var boundingRect;
                // get the list of potential drop targets for this endpoint, which excludes the source of the new connection.
                _currentInstance.getSelector(_currentInstance.getContainer(), ".jtk-endpoint[jtk-scope-" + ep.scope + "]").forEach(function(candidate) {
                    if (candidate !== ep.canvas && candidate !== _currentInstance.floatingEndpoint.canvas) {
                        var o = _currentInstance.getOffset(candidate), s = _currentInstance.getSize(candidate);
                        boundingRect = { x:o.left, y:o.top, w:s[0], h:s[1]};
                        endpointDropTargets.push({el:candidate, r:boundingRect});
                        _currentInstance.addClass(candidate, _currentInstance.Defaults.dropOptions.activeClass || "jtk-drag-active"); // TODO get from defaults.
                    }
                });
                //endpointDropTargets = endpointDropTargets.filter(function(candidate) { return candidate !== ep.canvas; });
                console.log(endpointDropTargets);

                ep.setHover(false, false);
                // create a connection. one end is this endpoint, the other is a floating endpoint.
                // TODO - get
                jpc = _currentInstance._newConnection({
                    sourceEndpoint: ep,
                    targetEndpoint: _currentInstance.floatingEndpoint,
                    source: ep.element,  // for makeSource with parent option.  ensure source element is represented correctly.
                    target: placeholderInfo.element,
                    anchors: [ ep.anchor, _currentInstance.floatingEndpoint.anchor ],
                    paintStyle: ep._jsPlumb.connectorStyle, // this can be null. Connection will use the default.
                    hoverPaintStyle: ep._jsPlumb.connectorHoverStyle,
                    connector: ep._jsPlumb.connector, // this can also be null. Connection will use the default.
                    overlays: ep._jsPlumb.connectorOverlays,
                    type: ep.connectionType,
                    cssClass: ep.connectorClass,
                    hoverClass: ep.connectorHoverClass,
                    scope:ep._jsPlumb.scope,
                    data:beforeDrag
                });
                jpc.pending = true;
                jpc.addClass(_currentInstance.draggingClass);
                _currentInstance.floatingEndpoint.addClass(_currentInstance.draggingClass);
                _currentInstance.floatingEndpoint.anchor = _savedAnchor;
                // fire an event that informs that a connection is being dragged
                _currentInstance.fire("connectionDrag", jpc);

                // register the new connection on the drag manager. This connection, at this point, is 'pending',
                // and has as its target a temporary element (the 'placeholder'). If the connection subsequently
                // becomes established, the anchor manager is informed that the target of the connection has
                // changed.

                // TODO is this still necessary.
                _currentInstance.anchorManager.newConnection(jpc);

            } else {


                // get the list of potential drop targets for this endpoint, which includes the ep from which the connection has been dragged?
                // TODO
                // Array.prototype.push.apply(endpointDropTargets, _currentInstance.getSelector(_currentInstance.getContainer(), ".jtk-endpoint[jtk-scope-" + ep.scope + "]"));
                // endpointDropTargets = endpointDropTargets.filter(function(candidate) { return candidate !== ep.canvas; });
                // console.log(endpointDropTargets);

                existingJpc = true;
                jpc.setHover(false);
                // new anchor idx
                var anchorIdx = jpc.endpoints[0].id === ep.id ? 0 : 1;
                ep.detachFromConnection(jpc, null, true);                         // detach from the connection while dragging is occurring. but dont cleanup automatically.

                // store the original scope (issue 57)
                var dragScope = _currentInstance.getDragScope(canvasElement);
                _currentInstance.setAttribute(ep.canvas, "originalScope", dragScope);

                // fire an event that informs that a connection is being dragged. we do this before
                // replacing the original target with the floating element info.
                _currentInstance.fire("connectionDrag", jpc);

                // now we replace ourselves with the temporary div we created above:
                if (anchorIdx === 0) {
                    existingJpcParams = [ jpc.source, jpc.sourceId, canvasElement, dragScope ];
                    _currentInstance.anchorManager.sourceChanged(jpc.endpoints[anchorIdx].elementId, placeholderInfo.id, jpc, placeholderInfo.element);

                } else {
                    existingJpcParams = [ jpc.target, jpc.targetId, canvasElement, dragScope ];
                    jpc.target = placeholderInfo.element;
                    jpc.targetId = placeholderInfo.id;

                    _currentInstance.anchorManager.updateOtherEndpoint(jpc.sourceId, jpc.endpoints[anchorIdx].elementId, jpc.targetId, jpc);
                }

                // store the original endpoint and assign the new floating endpoint for the drag.
                jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];

                // PROVIDE THE SUSPENDED ELEMENT, BE IT A SOURCE OR TARGET (ISSUE 39)
                jpc.suspendedElement = jpc.endpoints[anchorIdx].getElement();
                jpc.suspendedElementId = jpc.endpoints[anchorIdx].elementId;
                jpc.suspendedElementType = anchorIdx === 0 ? "source" : "target";

                jpc.suspendedEndpoint.setHover(false);
                _currentInstance.floatingEndpoint.referenceEndpoint = jpc.suspendedEndpoint;
                jpc.endpoints[anchorIdx] = _currentInstance.floatingEndpoint;

                jpc.addClass(_currentInstance.draggingClass);
                _currentInstance.floatingEndpoint.addClass(_currentInstance.draggingClass);
            }

            _currentInstance.registerFloatingConnection(placeholderInfo, jpc, _currentInstance.floatingEndpoint);

            // tell jsplumb about it
            _currentInstance.currentlyDragging = true;

        };
        endpointDragOptions.drag = function (params) {
            if (_stopped) {
                _stopped = false;
                return true;
            }

            if (placeholderInfo.element) {

                var hoverClass = _currentInstance.Defaults.dropOptions.hoverClass || "jtk-drag-hover";

                var floatingElementSize = _currentInstance.getSize(_currentInstance.floatingEndpoint.canvas);
                var _ui = { left:params.pos[0], top:params.pos[1]};
                _currentInstance.repaint(placeholderInfo.element, _ui);

                var boundingRect = { x:params.pos[0], y:params.pos[1], w:floatingElementSize[0], h:floatingElementSize[1]},
                    newDropTarget, idx, _cont, candidateTarget;

                for (var i = 0; i < endpointDropTargets.length; i++) {

                    if (Biltong.intersects(boundingRect, endpointDropTargets[i].r)) {
                        newDropTarget = endpointDropTargets[i];
                        break;
                    }
                }

                if (newDropTarget !== currentDropTarget && currentDropTarget != null) {
                    idx = _currentInstance.getFloatingAnchorIndex(jpc);
                    candidateTarget = currentDropTarget.el._jsPlumb;
                    _currentInstance.removeClass(currentDropTarget.el, hoverClass);
                    candidateTarget.removeClass(_currentInstance.endpointDropAllowedClass);
                    candidateTarget.removeClass(_currentInstance.endpointDropForbiddenClass);
                    jpc.endpoints[idx].anchor.out();
                }

                if (newDropTarget != null) {
                    _currentInstance.addClass(newDropTarget.el, hoverClass);

                    idx = _currentInstance.getFloatingAnchorIndex(jpc);
                    candidateTarget = newDropTarget.el._jsPlumb;
                    _cont = (candidateTarget.isTarget && idx !== 0) || (jpc.suspendedEndpoint && candidateTarget.referenceEndpoint && candidateTarget.referenceEndpoint.id === jpc.suspendedEndpoint.id);
                    if (_cont) {
                        var bb = _currentInstance.checkCondition("checkDropAllowed", {
                            sourceEndpoint: jpc.endpoints[idx],
                            targetEndpoint: candidateTarget,
                            connection: jpc
                        });
                        candidateTarget[(bb ? "add" : "remove") + "Class"](_currentInstance.endpointDropAllowedClass);
                        candidateTarget[(bb ? "remove" : "add") + "Class"](_currentInstance.endpointDropForbiddenClass);
                        jpc.endpoints[idx].anchor.over(candidateTarget.anchor, candidateTarget);
                    }
                }

                currentDropTarget = newDropTarget;

                // always repaint the source endpoint, because only continuous/dynamic anchors cause the endpoint
                // to be repainted, so static anchors need to be told (or the endpoint gets dragged around)
                ep.paint({anchorPoint:ep.anchor.getCurrentLocation({element:ep})});
            }
        };

        function maybeCleanup (ep) {
            if (ep._mtNew && ep.connections.length === 0) {
                _currentInstance.deleteObject({endpoint: ep});
            }
            else {
                delete ep._mtNew;
            }
        }

        endpointDragOptions.stop = function(p) {

            var originalEvent = _currentInstance.getDropEvent(arguments);

            console.log("drag ended on endpoint");
            _currentInstance.setConnectionBeingDragged(false);

            if (jpc && jpc.endpoints != null) {

                if (currentDropTarget != null) {
                    console.log("dropped on an endpoint " + currentDropTarget.el._jsPlumb);

                    var idx = _currentInstance.getFloatingAnchorIndex(jpc);

                    var dropEndpoint = currentDropTarget.el._jsPlumb;
                    dropEndpoint.removeClass(_currentInstance.endpointDropAllowedClass);
                    dropEndpoint.removeClass(_currentInstance.endpointDropForbiddenClass);

                    // calculate if this is an existing connection.
                    var existingConnection = jpc.suspendedEndpoint != null;

                    // if suspended endpoint exists but has been cleaned up, bail. This means it's an existing connection
                    // that has been detached and will shortly be discarded.
                    if (existingConnection && jpc.suspendedEndpoint._jsPlumb == null) {
                        return;
                    }

                    // if this is a drop back where the connection came from, mark it force reattach and
                    // return; the stop handler will reattach. without firing an event.
                    if (jpc.suspendedEndpoint && (jpc.suspendedEndpoint.id === ep.id)) {
                        jpc._forceReattach = true;
                        jpc.setHover(false);

                        // TODO what about the old `maybeCleanup` thing
                        maybeCleanup(dropEndpoint);

                        return;
                    }

                    // ensure we dont bother trying to drop sources on non-source eps, and same for target.

                    if ((idx === 0 && !ep.isSource) || (idx === 1 && !ep.isTarget)) {
                        // if (dhParams.maybeCleanup) {
                        //     dhParams.maybeCleanup(_ep);
                        // }
                        maybeCleanup(dropEndpoint);
                        return;
                    }


                    // if (dhParams.onDrop) {
                    //     dhParams.onDrop(jpc);
                    // }

                    // restore the original scope if necessary (issue 57)
                    // if (scope) {
                    //     _currentInstance.setDragScope(draggable, scope);
                    // }

                    // if the target of the drop is full, fire an event (we abort below)
                    // makeTarget: keep.
                    var isFull = dropEndpoint.isFull();
                    if (isFull) {
                        dropEndpoint.fire("maxConnections", {
                            endpoint: this,
                            connection: jpc,
                            maxConnections: _currentInstance.maxConnections
                        }, originalEvent);
                    }
                    //
                    // if endpoint enabled, not full, and matches the index of the floating endpoint...
                    if (!isFull && dropEndpoint.isEnabled()) {
                        var _doContinue = true;

                        // before testing for beforeDrop, reset the connection's source/target to be the actual DOM elements
                        // involved (that is, stash any temporary stuff used for dragging. but we need to keep it around in
                        // order that the anchor manager can clean things up properly).
                        if (idx === 0) {
                            jpc.floatingElement = jpc.source;
                            jpc.floatingId = jpc.sourceId;
                            jpc.floatingEndpoint = jpc.endpoints[0];
                            jpc.floatingIndex = 0;
                            jpc.source = ep.element;
                            jpc.sourceId = ep.elementId;
                        } else {
                            jpc.floatingElement = jpc.target;
                            jpc.floatingId = jpc.targetId;
                            jpc.floatingEndpoint = jpc.endpoints[1];
                            jpc.floatingIndex = 1;
                            jpc.target = dropEndpoint.element;
                            jpc.targetId = dropEndpoint.elementId;
                        }

                        // if this is an existing connection and detach is not allowed we won't continue. The connection's
                        // endpoints have been reinstated; everything is back to how it was.
                        if (existingConnection && jpc.suspendedEndpoint.id !== dropEndpoint.id) {
                            if (!jpc.isDetachAllowed(jpc) || !jpc.endpoints[idx].isDetachAllowed(jpc) || !jpc.suspendedEndpoint.isDetachAllowed(jpc) || !_currentInstance.checkCondition("beforeDetach", jpc)) {
                                _doContinue = false;
                            }
                        }

                        // ------------ wrap the execution path in a function so we can support asynchronous beforeDrop

                        var continueFunction = function (optionalData) {
                            // remove this jpc from the current endpoint, which is a floating endpoint that we will
                            // subsequently discard.
                            jpc.endpoints[idx].detachFromConnection(jpc);

                            // if there's a suspended endpoint, detach it from the connection.
                            if (jpc.suspendedEndpoint) {
                                jpc.suspendedEndpoint.detachFromConnection(jpc);
                            }

                            jpc.endpoints[idx] = dropEndpoint;
                            dropEndpoint.addConnection(jpc);

                            // copy our parameters in to the connection:
                            var params = dropEndpoint.getParameters();
                            for (var aParam in params) {
                                jpc.setParameter(aParam, params[aParam]);
                            }

                            if (existingConnection) {
                                var suspendedElementId = jpc.suspendedEndpoint.elementId;
                                _currentInstance.fireMoveEvent({
                                    index: idx,
                                    originalSourceId: idx === 0 ? suspendedElementId : jpc.sourceId,
                                    newSourceId: idx === 0 ? dropEndpoint.elementId : jpc.sourceId,
                                    originalTargetId: idx === 1 ? suspendedElementId : jpc.targetId,
                                    newTargetId: idx === 1 ? dropEndpoint.elementId : jpc.targetId,
                                    originalSourceEndpoint: idx === 0 ? jpc.suspendedEndpoint : jpc.endpoints[0],
                                    newSourceEndpoint: idx === 0 ? dropEndpoint : jpc.endpoints[0],
                                    originalTargetEndpoint: idx === 1 ? jpc.suspendedEndpoint : jpc.endpoints[1],
                                    newTargetEndpoint: idx === 1 ? dropEndpoint : jpc.endpoints[1],
                                    connection: jpc
                                }, originalEvent);
                            }

                            if (idx === 1) {
                                _currentInstance.anchorManager.updateOtherEndpoint(jpc.sourceId, jpc.floatingId, jpc.targetId, jpc);
                            }
                            else {
                                _currentInstance.anchorManager.sourceChanged(jpc.floatingId, jpc.sourceId, jpc, jpc.source);
                            }

                            // when makeSource has uniqueEndpoint:true, we want to create connections with new endpoints
                            // that are subsequently deleted. So makeSource sets `finalEndpoint`, which is the Endpoint to
                            // which the connection should be attached. The `detachFromConnection` call below results in the
                            // temporary endpoint being cleaned up.
                            if (jpc.endpoints[0].finalEndpoint) {
                                var _toDelete = jpc.endpoints[0];
                                _toDelete.detachFromConnection(jpc);
                                jpc.endpoints[0] = jpc.endpoints[0].finalEndpoint;
                                jpc.endpoints[0].addConnection(jpc);
                            }

                            // if optionalData was given, merge it onto the connection's data.
                            if (_ju.isObject(optionalData)) {
                                jpc.mergeData(optionalData);
                            }
                            // finalise will inform the anchor manager and also add to
                            // connectionsByScope if necessary.
                            _currentInstance.finaliseConnection(jpc, null, originalEvent, false);
                            jpc.setHover(false);

                            // SP continuous anchor flush
                            _currentInstance.revalidate(jpc.endpoints[0].element);

                        }.bind(this);

                        var dontContinueFunction = function () {
                            // otherwise just put it back on the endpoint it was on before the drag.
                            if (jpc.suspendedEndpoint) {
                                jpc.endpoints[idx] = jpc.suspendedEndpoint;
                                jpc.setHover(false);
                                jpc._forceDetach = true;
                                if (idx === 0) {
                                    jpc.source = jpc.suspendedEndpoint.element;
                                    jpc.sourceId = jpc.suspendedEndpoint.elementId;
                                } else {
                                    jpc.target = jpc.suspendedEndpoint.element;
                                    jpc.targetId = jpc.suspendedEndpoint.elementId;
                                }
                                jpc.suspendedEndpoint.addConnection(jpc);

                                // TODO checkSanity
                                if (idx === 1) {
                                    _currentInstance.anchorManager.updateOtherEndpoint(jpc.sourceId, jpc.floatingId, jpc.targetId, jpc);
                                }
                                else {
                                    _currentInstance.anchorManager.sourceChanged(jpc.floatingId, jpc.sourceId, jpc, jpc.source);
                                }

                                _currentInstance.repaint(jpc.sourceId);
                                jpc._forceDetach = false;
                            }
                        };

                        // --------------------------------------
                        // now check beforeDrop.  this will be available only on Endpoints that are setup to
                        // have a beforeDrop condition (although, secretly, under the hood all Endpoints and
                        // the Connection have them, because they are on jsPlumbUIComponent.  shhh!), because
                        // it only makes sense to have it on a target endpoint.
                        _doContinue = _doContinue && dropEndpoint.isDropAllowed(jpc.sourceId, jpc.targetId, jpc.scope, jpc, dropEndpoint);// && jpc.pending;

                        if (_doContinue) {
                            continueFunction(_doContinue);
                        }
                        else {
                            dontContinueFunction();
                        }
                    }

                    maybeCleanup(dropEndpoint);

                    // makeTarget sets this flag, to tell us we have been replaced and should delete this object.
                    if (dropEndpoint.deleteAfterDragStop) {
                        _currentInstance.deleteObject({endpoint: dropEndpoint});
                    }
                    else {
                        if (dropEndpoint._jsPlumb) {
                            dropEndpoint.paint({recalc: false});
                        }
                    }

                    // although the connection is no longer valid, there are use cases where this is useful.
                    _currentInstance.fire("connectionDragStop", jpc, originalEvent);
                    // fire this event to give people more fine-grained control (connectionDragStop fires a lot)
                    if (jpc.pending) {
                        _currentInstance.fire("connectionAborted", jpc, originalEvent);
                    }
                    // tell jsplumb that dragging is finished.
                    _currentInstance.currentlyDragging = false;
                    jpc.suspendedElement = null;
                    jpc.suspendedEndpoint = null;

                } else {
                    //alert("drag stopped with no target - discard the connection");
                }

                // deactivate the drop targets
                endpointDropTargets.forEach(function (candidate) {
                    _currentInstance.removeClass(candidate.el, _currentInstance.Defaults.dropOptions.activeClass || "jtk-drag-active"); // TODO get value from defaults
                    _currentInstance.removeClass(candidate.el, _currentInstance.Defaults.dropOptions.hoverClass || "jtk-drag-hover");
                });

                jpc = null;
            }

            // if no endpoints, jpc already cleaned up. but still we want to ensure we're reset properly.
            // remove the element associated with the floating endpoint
            // (and its associated floating endpoint and visual artefacts)
            if (placeholderInfo && placeholderInfo.element) {
                _currentInstance.remove(placeholderInfo.element, false, false);
            }
            // remove the inplace copy
            if (inPlaceCopy) {
                _currentInstance.deleteObject({endpoint: inPlaceCopy});
            }

            if (ep._jsPlumb) {
                // make our canvas visible (TODO: hand off to library; we should not know about DOM)
                ep.canvas.style.visibility = "visible";
                // unlock our anchor
                ep.anchor.unlock();
                // clear floating anchor.
                ep._jsPlumb.floatingEndpoint = null;
            }
        };

        var endpointSourceDragHandler = katavorio.draggable(_currentInstance.getContainer(), endpointDragOptions)[0];
        _currentInstance.bind("container:change", function(newContainer) {
            endpointSourceDragHandler.destroy();
            endpointSourceDragHandler = katavorio.draggable(newContainer, endpointDragOptions);
            endpointSourceDragHandler.addSelector(elementDragOptions);
        });


        endpointSourceDragHandler.addSelector(elementDragOptions);


        // refresh the offsets for child elements of this element.
        this.updateOffsets = function (elId, childOffsetOverrides) {
            // if (elId != null) {
            //     childOffsetOverrides = childOffsetOverrides || {};
            //     var domEl = jsPlumb.getElement(elId),
            //         id = _currentInstance.getId(domEl),
            //         children = _delements[id],
            //         parentOffset;
            //
            //     if (children) {
            //         for (var i in children) {
            //             if (children.hasOwnProperty(i)) {
            //                 var cel = jsPlumb.getElement(i),
            //                     cOff = childOffsetOverrides[i] || _currentInstance.getOffset(cel);
            //
            //                 // do not update if we have a value already and we'd just be writing 0,0
            //                 if (cel.offsetParent == null && _delements[id][i] != null) {
            //                     continue;
            //                 }
            //
            //                 if (!parentOffset) {
            //                     parentOffset = _currentInstance.getOffset(domEl);
            //                 }
            //
            //                 _delements[id][i] = {
            //                     id: i,
            //                     offset: {
            //                         left: cOff.left - parentOffset.left,
            //                         top: cOff.top - parentOffset.top
            //                     }
            //                 };
            //                 _draggablesForElements[i] = id;
            //             }
            //         }
            //     }
            // }
        };

        this.endpointDeleted = function (endpoint) {
            if (_elementsWithEndpoints[endpoint.elementId]) {
                _elementsWithEndpoints[endpoint.elementId]--;
            }
        };

        this.getElementsForDraggable = function (el) {
            if (typeof el === "string") {
                el = _currentInstance.getElement(el);
            }
            return el.querySelectorAll("[jtk-managed]");
        };

        this.reset = function () {
            _draggables = {};
            _dlist = [];
            _elementsWithEndpoints = {};
        };

        this.revalidateParent = function(el, elId, childOffset) {
            var current = _draggablesForElements[elId];
            if (current) {
                var co = {};
                co[elId] = childOffset;
                this.updateOffsets(current, co);
                _currentInstance.revalidate(current);
            }
        };
        
        _currentInstance.on(_currentInstance.getContainer(), "mousedown", "[jtk-source]", function(e) {
            if (e.which === 3 || e.button === 2) {
                return;
            }
           
            var targetEl = e.target || e.srcElement, sourceDef = this._jsPlumbSourceDefinition, sourceElement = this, def;
            console.log("mousedown on source " + targetEl + " with definition " + def);
            if (sourceDef) {
                // if disabled, return.
                if (!sourceDef.enabled) {
                    return;
                }

                def = sourceDef.def;

                var elid = _currentInstance.getId(this); // elid might have changed since this method was called to configure the element.

                // if a filter was given, run it, and return if it says no.
                if (def.filter) {
                    var r = _ju.isString(def.filter) ? selectorFilter(e, sourceElement, def.filter, _currentInstance, def.filterExclude) : def.filter(e, sourceElement);
                    if (r === false) {
                        return;
                    }
                }

                // if maxConnections reached
                var sourceCount = _currentInstance.select({source: elid}).length;
                if (sourceDef.maxConnections >= 0 && (sourceCount >= sourceDef.maxConnections)) {
                    _ju.consume(e);
                    if (def.onMaxConnections) {
                        def.onMaxConnections({
                            element: this,
                            maxConnections: sourceDef.maxConnections
                        }, e);
                    }
                    return false;
                }

                // find the position on the element at which the mouse was pressed; this is where the endpoint
                // will be located.
                var elxy = _currentInstance.getPositionOnElement(e, sourceElement, _currentInstance.getZoom());

                // we need to override the anchor in here, and force 'isSource', but we don't want to mess with
                // the params passed in, because after a connection is established we're going to reset the endpoint
                // to have the anchor we were given.
                var tempEndpointParams = {};
                root.jsPlumb.extend(tempEndpointParams, def);
                tempEndpointParams.isTemporarySource = true;
                tempEndpointParams.anchor = [ elxy[0], elxy[1] , 0, 0];
                tempEndpointParams.dragOptions = def.dragOptions || {};

                if (def.scope) {
                    tempEndpointParams.scope = def.scope;
                }

                ep = _currentInstance.addEndpoint(elid, tempEndpointParams);
                //endpointAddedButNoDragYet = true;
                ep.setDeleteOnEmpty(true);

                // if unique endpoint and it's already been created, push it onto the endpoint we create. at the end
                // of a successful connection we'll switch to that endpoint.
                // TODO this is the same code as the programmatic endpoints create on line 1050 ish
                if (def.uniqueEndpoint) {
                    if (!def.endpoint) {
                        def.endpoint = ep;
                        ep.setDeleteOnEmpty(false);
                    }
                    else {
                        ep.finalEndpoint = def.endpoint;
                    }
                }

                var _delTempEndpoint = function () {
                    // this mouseup event is fired only if no dragging occurred, by jquery and yui, but for mootools
                    // it is fired even if dragging has occurred, in which case we would blow away a perfectly
                    // legitimate endpoint, were it not for this check.  the flag is set after adding an
                    // endpoint and cleared in a drag listener we set in the dragOptions above.
                    _currentInstance.off(ep.canvas, "mouseup", _delTempEndpoint);
                    _currentInstance.off(sourceElement, "mouseup", _delTempEndpoint);
                    //if (endpointAddedButNoDragYet) {
                      //  endpointAddedButNoDragYet = false;
                        _currentInstance.deleteEndpoint(ep);
                    //}
                };

                _currentInstance.on(ep.canvas, "mouseup", _delTempEndpoint);
                _currentInstance.on(sourceElement, "mouseup", _delTempEndpoint);

                // optionally check for attributes to extract from the source element
                var payload = {};
                if (def.extract) {
                    for (var att in def.extract) {
                        var v = targetEl.getAttribute(att);
                        if (v) {
                            payload[def.extract[att]] = v;
                        }
                    }
                }

                // and then trigger its mousedown event, which will kick off a drag, which will start dragging
                // a new connection from this endpoint.
                _currentInstance.trigger(ep.canvas, "mousedown", e, payload);

                _ju.consume(e);
            }
            
        });

    };

    var _setClassName = function (el, cn, classList) {
            cn = _ju.fastTrim(cn);
            if (typeof el.className.baseVal !== "undefined") {
                el.className.baseVal = cn;
            }
            else {
                el.className = cn;
            }

            // recent (i currently have  61.0.3163.100) version of chrome do not update classList when you set the base val
            // of an svg element's className. in the long run we'd like to move to just using classList anyway
            try {
                var cl = el.classList;
                if (cl != null) {
                    while (cl.length > 0) {
                        cl.remove(cl.item(0));
                    }
                    for (var i = 0; i < classList.length; i++) {
                        if (classList[i]) {
                            cl.add(classList[i]);
                        }
                    }
                }
            }
            catch(e) {
                // not fatal
                _ju.log("JSPLUMB: cannot set class list", e);
            }
        },
        _getClassName = function (el) {
            return (typeof el.className.baseVal === "undefined") ? el.className : el.className.baseVal;
        },
        _classManip = function (el, classesToAdd, classesToRemove) {
            classesToAdd = classesToAdd == null ? [] : _ju.isArray(classesToAdd) ? classesToAdd : classesToAdd.split(/\s+/);
            classesToRemove = classesToRemove == null ? [] : _ju.isArray(classesToRemove) ? classesToRemove : classesToRemove.split(/\s+/);

            var className = _getClassName(el),
                curClasses = className.split(/\s+/);

            var _oneSet = function (add, classes) {
                for (var i = 0; i < classes.length; i++) {
                    if (add) {
                        if (curClasses.indexOf(classes[i]) === -1) {
                            curClasses.push(classes[i]);
                        }
                    }
                    else {
                        var idx = curClasses.indexOf(classes[i]);
                        if (idx !== -1) {
                            curClasses.splice(idx, 1);
                        }
                    }
                }
            };

            _oneSet(true, classesToAdd);
            _oneSet(false, classesToRemove);

            _setClassName(el, curClasses.join(" "), curClasses);
        };

    root.jsPlumb.extend(root.jsPlumbInstance.prototype, {

        headless: false,

        pageLocation: _pageLocation,
        screenLocation: _screenLocation,
        clientLocation: _clientLocation,

        getDragManager:function() {
            if (this.dragManager == null) {
                this.dragManager = new DragManager(this);
            }

            return this.dragManager;
        },

        recalculateOffsets:function(elId) {
            this.getDragManager().updateOffsets(elId);
        },

        createElement:function(tag, style, clazz, atts) {
            return this.createElementNS(null, tag, style, clazz, atts);
        },

        createElementNS:function(ns, tag, style, clazz, atts) {
            var e = ns == null ? document.createElement(tag) : document.createElementNS(ns, tag);
            var i;
            style = style || {};
            for (i in style) {
                e.style[i] = style[i];
            }

            if (clazz) {
                e.className = clazz;
            }

            atts = atts || {};
            for (i in atts) {
                e.setAttribute(i, "" + atts[i]);
            }

            return e;
        },

        getAttribute: function (el, attName) {
            return el.getAttribute != null ? el.getAttribute(attName) : null;
        },

        setAttribute: function (el, a, v) {
            if (el.setAttribute != null) {
                el.setAttribute(a, v);
            }
        },

        setAttributes: function (el, atts) {
            for (var i in atts) {
                if (atts.hasOwnProperty(i)) {
                    el.setAttribute(i, atts[i]);
                }
            }
        },
        removeAttribute:function(el, attName) {
            el.removeAttribute && el.removeAttribute(attName);
        },
        appendToRoot: function (node) {
            document.body.appendChild(node);
        },
        getClass:_getClassName,
        addClass: function (el, clazz) {

            if (el != null && clazz != null && clazz.length > 0) {
                window.jtime("addClass");
                if (el.classList) {
                    var classes = Array.isArray(clazz) ? clazz : _ju.fastTrim(clazz).split(/\s+/);
                    window.DOMTokenList.prototype.add.apply(el.classList, classes);

                } else {
                    _classManip(el, clazz);
                }

                window.jtimeEnd("addClass");

            }
        },
        hasClass: function (el, clazz) {
            if (el.classList) {
                return el.classList.contains(clazz);
            }
            else {
                return _getClassName(el).indexOf(clazz) !== -1;
            }
        },
        removeClass: function (el, clazz) {
            if (el != null && clazz != null && clazz.length > 0) {
                if (el.classList) {
                    window.DOMTokenList.prototype.remove.apply(el.classList, clazz.split(/\s+/));
                } else {
                    _classManip(el, null, clazz);
                }
            }
        },
        toggleClass:function(el, clazz) {
            if (el != null && clazz != null && clazz.length > 0) {
                if (el.classList) {
                    el.classList.toggle(clazz);
                }
                else {
                    if (jsPlumb.hasClass(el, clazz)) {
                        jsPlumb.removeClass(el, clazz);
                    } else {
                        jsPlumb.addClass(el, clazz);
                    }
                }
            }

        },
        setPosition: function (el, p) {
            el.style.left = p.left + "px";
            el.style.top = p.top + "px";
        },
        getPosition: function (el) {
            var _one = function (prop) {
                var v = el.style[prop];
                return v ? v.substring(0, v.length - 2) : 0;
            };
            return {
                left: _one("left"),
                top: _one("top")
            };
        },
        getStyle:function(el, prop) {
            if (typeof window.getComputedStyle !== 'undefined') {
                return getComputedStyle(el, null).getPropertyValue(prop);
            } else {
                return el.currentStyle[prop];
            }
        },
        getSelector: function (ctx, spec) {
            var sel = null;
            if (arguments.length === 1) {
                sel = ctx.nodeType != null ? ctx : document.querySelectorAll(ctx);
            }
            else {
                sel = ctx.querySelectorAll(spec);
            }

            return sel;
        },
        getOffset:function(el, relativeToRoot, container) {
            window.jtime("get offset");
            //console.log("get offset arg was " + el);
            //el = jsPlumb.getElement(el);
            container = container || this.getContainer();
            var out = {
                    left: el.offsetLeft,
                    top: el.offsetTop
                },
                op = (relativeToRoot  || (container != null && (el !== container && el.offsetParent !== container))) ?  el.offsetParent : null,
                _maybeAdjustScroll = function(offsetParent) {
                    if (offsetParent != null && offsetParent !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
                        out.left -= offsetParent.scrollLeft;
                        out.top -= offsetParent.scrollTop;
                    }
                }.bind(this);

            while (op != null) {
                out.left += op.offsetLeft;
                out.top += op.offsetTop;
                _maybeAdjustScroll(op);
                op = relativeToRoot ? op.offsetParent :
                    op.offsetParent === container ? null : op.offsetParent;
            }

            // if container is scrolled and the element (or its offset parent) is not absolute or fixed, adjust accordingly.
            if (container != null && !relativeToRoot && (container.scrollTop > 0 || container.scrollLeft > 0)) {
                var pp = el.offsetParent != null ? this.getStyle(el.offsetParent, "position") : "static",
                    p = this.getStyle(el, "position");
                if (p !== "absolute" && p !== "fixed" && pp !== "absolute" && pp !== "fixed") {
                    out.left -= container.scrollLeft;
                    out.top -= container.scrollTop;
                }
            }
            window.jtimeEnd("get offset");

            return out;
            // return {
            //     left:Math.random() * 600,
            //     top:Math.random() * 600
            // };
        },
        //
        // return x+y proportion of the given element's size corresponding to the location of the given event.
        //
        getPositionOnElement: function (evt, el, zoom) {
            var box = typeof el.getBoundingClientRect !== "undefined" ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 },
                body = document.body,
                docElem = document.documentElement,
                scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
                scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
                clientTop = docElem.clientTop || body.clientTop || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                pst = 0,
                psl = 0,
                top = box.top + scrollTop - clientTop + (pst * zoom),
                left = box.left + scrollLeft - clientLeft + (psl * zoom),
                cl = jsPlumb.pageLocation(evt),
                w = box.width || (el.offsetWidth * zoom),
                h = box.height || (el.offsetHeight * zoom),
                x = (cl[0] - left) / w,
                y = (cl[1] - top) / h;

            return [ x, y ];
        },

        /**
         * Gets the absolute position of some element as read from the left/top properties in its style.
         * @method getAbsolutePosition
         * @param {Element} el The element to retrieve the absolute coordinates from. **Note** this is a DOM element, not a selector from the underlying library.
         * @return {Number[]} [left, top] pixel values.
         */
        getAbsolutePosition: function (el) {
            var _one = function (s) {
                var ss = el.style[s];
                if (ss) {
                    return parseFloat(ss.substring(0, ss.length - 2));
                }
            };
            return [ _one("left"), _one("top") ];
        },

        /**
         * Sets the absolute position of some element by setting the left/top properties in its style.
         * @method setAbsolutePosition
         * @param {Element} el The element to set the absolute coordinates on. **Note** this is a DOM element, not a selector from the underlying library.
         * @param {Number[]} xy x and y coordinates
         * @param {Number[]} [animateFrom] Optional previous xy to animate from.
         * @param {Object} [animateOptions] Options for the animation.
         */
        setAbsolutePosition: function (el, xy, animateFrom, animateOptions) {
            if (animateFrom) {
                this.animate(el, {
                    left: "+=" + (xy[0] - animateFrom[0]),
                    top: "+=" + (xy[1] - animateFrom[1])
                }, animateOptions);
            }
            else {
                el.style.left = xy[0] + "px";
                el.style.top = xy[1] + "px";
            }
        },
        /**
         * gets the size for the element, in an array : [ width, height ].
         */
        getSize: function (el) {

            //return [100,100];
            //window.jtime("get size");
            var s =[ el.offsetWidth, el.offsetHeight ];
            //window.jtimeEnd("get size");
            return s;
           //return [ el.offsetWidth, el.offsetHeight ];
        },
        getRenderMode : function() { return "svg"; },
        // draggable : function (el, options) {
        //     var info;
        //     el = _ju.isArray(el) || (el.length != null && !_ju.isString(el)) ? el: [ el ];
        //     Array.prototype.slice.call(el).forEach(function(_el) {
        //         info = this.info(_el);
        //         if (info.el) {
        //             this._initDraggableIfNecessary(info.el, true, options, info.id, true);
        //         }
        //     }.bind(this));
        //     return this;
        // },
        initDraggable: function (el, options, category) {
            _getDragManager(this, category).draggable(el, options);
            el._jsPlumbDragOptions = options;
        },
        // destroyDraggable: function (el, category) {
        //     _getDragManager(this, category).destroyDraggable(el);
        //     delete el._jsPlumbDragOptions;
        // },
        unbindDraggable: function (el, evt, fn, category) {
            _getDragManager(this, category).destroyDraggable(el, evt, fn);
        },
        setDraggable : function (element, draggable) {
            return jsPlumb.each(element, function (el) {
                //if (this.isDragSupported(el)) {
                    this._draggableStates[this.getAttribute(el, "id")] = draggable;
                    this.setElementDraggable(el, draggable);
                //}
            }.bind(this));
        },
        _draggableStates : {},
        /*
         * toggles the draggable state of the given element(s).
         * el is either an id, or an element object, or a list of ids/element objects.
         */
        toggleDraggable : function (el) {
            var state;
            jsPlumb.each(el, function (el) {
                var elId = this.getAttribute(el, "id");
                state = this._draggableStates[elId] == null ? false : this._draggableStates[elId];
                state = !state;
                this._draggableStates[elId] = state;
                this.setDraggable(el, state);
                return state;
            }.bind(this));
            return state;
        },
        // _initDraggableIfNecessary : function (element, isDraggable, dragOptions, id, fireEvent) {
        //
        //
        //     this.manage(id, element);
        //     var options = dragOptions || this.Defaults.DragOptions;
        //     options = jsPlumb.extend({}, options); // make a copy.
        //     this.initDraggable(element, options);
        //
        //     // TODO this bit i think is important, due to it figuring out nested elements.
        //     this.getDragManager().register(element);
        //
        //     /* TODO FIRST: move to DragManager. including as much of the decision to init dragging as possible.
        //     if (!jsPlumb.headless) {
        //         var _draggable = isDraggable == null ? false : isDraggable;
        //         if (_draggable) {
        //
        //                 var options = dragOptions || this.Defaults.DragOptions;
        //                 options = jsPlumb.extend({}, options); // make a copy.
        //                 if (!jsPlumb.isAlreadyDraggable(element, this)) {
        //                     var dragEvent = jsPlumb.dragEvents.drag,
        //                         stopEvent = jsPlumb.dragEvents.stop,
        //                         startEvent = jsPlumb.dragEvents.start;
        //
        //                     this.manage(id, element);
        //
        //                     options[startEvent] = _ju.wrap(options[startEvent], _dragStart.bind(this));
        //
        //                     options[dragEvent] = _ju.wrap(options[dragEvent], _dragMove.bind(this));
        //
        //                     options[stopEvent] = _ju.wrap(options[stopEvent], _dragStop.bind(this));
        //
        //                     var elId = this.getId(element); // need ID
        //
        //                     this._draggableStates[elId] = true;
        //                     var draggable = this._draggableStates[elId];
        //
        //                     options.disabled = draggable == null ? false : !draggable;
        //                     this.initDraggable(element, options);
        //                     this.getDragManager().register(element);
        //                     if (fireEvent) {
        //                         this.fire("elementDraggable", {el:element, options:options});
        //                     }
        //                 }
        //                 else {
        //                     // already draggable. attach any start, drag or stop listeners to the current Drag.
        //                     if (dragOptions.force) {
        //                         this.initDraggable(element, options);
        //                     }
        //                 }
        //
        //         }
        //     }*/
        // },
        animationSupported:true,
        getElement: function (el) {
            if (el == null) {
                return null;
            }
            // here we pluck the first entry if el was a list of entries.
            // this is not my favourite thing to do, but previous versions of
            // jsplumb supported jquery selectors, and it is possible a selector
            // will be passed in here.
            el = typeof el === "string" ? el : el.length != null && el.enctype == null ? el[0] : el;
            return typeof el === "string" ? document.getElementById(el) : el;
        },
        removeElement: function (element) {
           // _getDragManager(this).elementRemoved(element);
            this.getEventManager().remove(element);
        },
        //
        // this adapter supports a rudimentary animation function. no easing is supported.  only
        // left/top properties are supported. property delta args are expected to be in the form
        //
        // +=x.xxxx
        //
        // or
        //
        // -=x.xxxx
        //
        doAnimate: function (el, properties, options) {
            options = options || {};
            var o = this.getOffset(el),
                ap = _animProps(o, properties),
                ldist = ap[0] - o.left,
                tdist = ap[1] - o.top,
                d = options.duration || 250,
                step = 15, steps = d / step,
                linc = (step / d) * ldist,
                tinc = (step / d) * tdist,
                idx = 0,
                _int = setInterval(function () {
                    _jp.setPosition(el, {
                        left: o.left + (linc * (idx + 1)),
                        top: o.top + (tinc * (idx + 1))
                    });
                    if (options.step != null) {
                        options.step(idx, Math.ceil(steps));
                    }
                    idx++;
                    if (idx >= steps) {
                        window.clearInterval(_int);
                        if (options.complete != null) {
                            options.complete();
                        }
                    }
                }, step);
        },
        // DRAG/DROP


        destroyDroppable: function (el, category) {
            _getDragManager(this, category).destroyDroppable(el);
        },
        unbindDroppable: function (el, evt, fn, category) {
            _getDragManager(this, category).destroyDroppable(el, evt, fn);
        },

        droppable :function(el, options) {
            el = _ju.isArray(el) || (el.length != null && !_ju.isString(el)) ? el: [ el ];
            var info;
            options = options || {};
            options.allowLoopback = false;
            Array.prototype.slice.call(el).forEach(function(_el) {
                info = this.info(_el);
                if (info.el) {
                    this.initDroppable(info.el, options);
                }
            }.bind(this));
            return this;
        },

        initDroppable: function (el, options, category) {
            _getDragManager(this, category).droppable(el, options);
        },
        isAlreadyDraggable: function (el) {
            return el._katavorioDrag != null;
        },
        // isDragSupported: function (el, options) {
        //     return true;
        // },
        // isDropSupported: function (el, options) {
        //     return true;
        // },
        isElementDraggable: function (el) {
            el = _jp.getElement(el);
            return el._katavorioDrag && el._katavorioDrag.isEnabled();
        },
        getDragObject: function (eventArgs) {
            return eventArgs[0].drag.getDragElement();
        },
        getDragScope: function (el) {
            return el._katavorioDrag && el._katavorioDrag.scopes.join(" ") || "";
        },
        getDropEvent: function (args) {
            return args[0].e;
        },
        getUIPosition: function (eventArgs, zoom) {
            // here the position reported to us by Katavorio is relative to the element's offsetParent. For top
            // level nodes that is fine, but if we have a nested draggable then its offsetParent is actually
            // not going to be the jsplumb container; it's going to be some child of that element. In that case
            // we want to adjust the UI position to account for the offsetParent's position relative to the Container
            // origin.
            var el = eventArgs[0].el;
            if (el.offsetParent == null) {
                return null;
            }
            var finalPos = eventArgs[0].finalPos || eventArgs[0].pos;
            var p = { left:finalPos[0], top:finalPos[1] };
            if (el._katavorioDrag && el.offsetParent !== this.getContainer()) {
                var oc = this.getOffset(el.offsetParent);
                p.left += oc.left;
                p.top += oc.top;
            }
            return p;
        },
        setDragFilter: function (el, filter, _exclude) {
            if (el._katavorioDrag) {
                el._katavorioDrag.setFilter(filter, _exclude);
            }
        },
        setElementDraggable: function (el, draggable) {
            el = _jp.getElement(el);
            if (el._katavorioDrag) {
                el._katavorioDrag.setEnabled(draggable);
            }
        },
        setDragScope: function (el, scope) {
            if (el._katavorioDrag) {
                el._katavorioDrag.k.setDragScope(el, scope);
            }
        },
        setDropScope:function(el, scope) {
            if (el._katavorioDrop && el._katavorioDrop.length > 0) {
                el._katavorioDrop[0].k.setDropScope(el, scope);
            }
        },
        addToPosse:function(el, spec) {
            var specs = Array.prototype.slice.call(arguments, 1);
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) {
                _el = [ _jp.getElement(_el) ];
                _el.push.apply(_el, specs );
                dm.addToPosse.apply(dm, _el);
            });
        },
        setPosse:function(el, spec) {
            var specs = Array.prototype.slice.call(arguments, 1);
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) {
                _el = [ _jp.getElement(_el) ];
                _el.push.apply(_el, specs );
                dm.setPosse.apply(dm, _el);
            });
        },
        removeFromPosse:function(el, posseId) {
            var specs = Array.prototype.slice.call(arguments, 1);
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) {
                _el = [ _jp.getElement(_el) ];
                _el.push.apply(_el, specs );
                dm.removeFromPosse.apply(dm, _el);
            });
        },
        removeFromAllPosses:function(el) {
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) { dm.removeFromAllPosses(_jp.getElement(_el)); });
        },
        setPosseState:function(el, posseId, state) {
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) { dm.setPosseState(_jp.getElement(_el), posseId, state); });
        },
        dragEvents: {
            'start': 'start', 'stop': 'stop', 'drag': 'drag', 'step': 'step',
            'over': 'over', 'out': 'out', 'drop': 'drop', 'complete': 'complete',
            'beforeStart':'beforeStart'
        },
        animEvents: {
            'step': "step", 'complete': 'complete'
        },
        stopDrag: function (el) {
            if (el._katavorioDrag) {
                el._katavorioDrag.abort();
            }
        },
        addToDragSelection: function (spec) {
            _getDragManager(this).select(spec);
        },
        removeFromDragSelection: function (spec) {
            _getDragManager(this).deselect(spec);
        },
        clearDragSelection: function () {
            _getDragManager(this).deselectAll();
        },
        trigger: function (el, event, originalEvent, payload) {
            this.getEventManager().trigger(el, event, originalEvent, payload);
        },
        doReset:function() {
            // look for katavorio instances and reset each one if found.
            for (var key in this) {
                if (key.indexOf("_katavorio_") === 0) {
                    this[key].reset();
                }
            }
        },
        getEventManager:function() {
            return _getEventManager(this);
        },
        on : function(el, event, callback) {
            // TODO: here we would like to map the tap event if we know its
            // an internal bind to a click. we have to know its internal because only
            // then can we be sure that the UP event wont be consumed (tap is a synthesized
            // event from a mousedown followed by a mouseup).
            //event = { "click":"tap", "dblclick":"dbltap"}[event] || event;
            this.getEventManager().on.apply(this, arguments);
            return this;
        },
        off : function(el, event, callback) {
            this.getEventManager().off.apply(this, arguments);
            return this;
        }

    });

    var ready = function (f) {
        var _do = function () {
            if (/complete|loaded|interactive/.test(document.readyState) && typeof(document.body) !== "undefined" && document.body != null) {
                f();
            }
            else {
                setTimeout(_do, 9);
            }
        };

        _do();
    };
    ready(_jp.init);

}).call(typeof window !== 'undefined' ? window : this);

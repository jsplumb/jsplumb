;(function() {

    var mottle = new Mottle();
    var _t = function(el, evt, x, y) {
        mottle.trigger(el, evt, { pageX:x, pageY:y, screenX:x, screenY:y, clientX:x, clientY:y});
    };
    var _randomEvent = function() {
        var x = parseInt(Math.random() * 2000), y = parseInt(Math.random() * 2000);
        return {
            clientX:x,
            clientY:y,
            screenX:x,
            screenY:y,
            pageX:x,
            pageY:y
        };
    };
    var _distantPointEvent = {
        clientX: 50000,
        clientY: 50000,
        screenX: 50000,
        screenY: 50000,
        pageX: 50000,
        pageY: 50000
    };
    var _makeEvt = function (_jsPlumb, el) {
        var o = _jsPlumb.getOffset(el),
            s = _jsPlumb.getSize(el),
            l = o.left + (s[0] / 2),
            t = o.top + (s[1] / 2);

        return {
            clientX: l,
            clientY: t,
            screenX: l,
            screenY: t,
            pageX: l,
            pageY: t
        };
    };
    var _dragANodeAround = function(_jsPlumb, el) {
        _jsPlumb.trigger(el, "mousedown", _makeEvt(_jsPlumb, el));
        var steps = Math.random() * 50;
        for (var i = 0; i < steps; i++) {
            var evt = _randomEvent();
            el.style.left = evt.screenX + "px";
            el.style.top= evt.screenY + "px";
            _jsPlumb.trigger(document, "mousemove", evt);
        }
        _jsPlumb.trigger(document, "mouseup", _distantPointEvent);
    };

    var _dragNodeTo = function(_jsPlumb, el, x, y, events) {
        events = events || {};
        if (events.before) events.before();
        _jsPlumb.trigger(el, "mousedown", _makeEvt(_jsPlumb, el));
        if (events.beforeMouseMove) {
            events.beforeMouseMove();
        }
        _t(document, "mousemove", x, y);
        if (events.beforeMouseUp) {
            events.beforeMouseUp();
        }
        mottle.trigger(document, "mouseup");
        if (events.after) events.after();
    };

    var _dragNodeBy = function(_jsPlumb, el, x, y, events) {
        var xy = _jsPlumb.getOffset(el);
        _dragNodeTo(_jsPlumb, el, xy.left+x, xy.top+y, events);
    };

    //
    // helper method to cause a connection to be dragged via the mouse, but programmatically.
    //
    var _dragConnection = function (_jsPlumb, d1, d2) {
        var el1 = d1.canvas || d1, el2 = d2.canvas || d2;
        var e1 = _makeEvt(_jsPlumb, el1), e2 = _makeEvt(_jsPlumb, el2);

        var conns = _jsPlumb.select().length;

        _jsPlumb.trigger(el1, "mousedown", e1);
        _jsPlumb.trigger(document, "mousemove", e2);
        _jsPlumb.trigger(el2, "mouseup", e2);

        return _jsPlumb.select().get(conns);
    };

    var _dragAndAbort = function (_jsPlumb, d1) {
        var el1 = d1.canvas || d1;
        var e1 = _makeEvt(_jsPlumb, el1);

        _jsPlumb.trigger(el1, "mousedown", e1);
        _jsPlumb.trigger(document, "mousemove", _distantPointEvent);
        _jsPlumb.trigger(document, "mouseup", _distantPointEvent);
    };

    //
    // helper method to cause a connection to be detached via the mouse, but programmatically.
    var _detachConnection = function (_jsPlumb, e, connIndex) {
        var el1 = e.canvas,
            c = e.connections[connIndex];

        var e1 = _makeEvt(_jsPlumb, el1);

        _jsPlumb.trigger(el1, "mousedown", e1);
        _jsPlumb.trigger(document, "mousemove", document);
        _jsPlumb.trigger(document, "mouseup", _distantPointEvent);
    };

    var _relocateTarget = function(_jsPlumb, conn, target, events) {
        _relocate(_jsPlumb, conn, 1, target, events);
    };

    var _relocate = function(_jsPlumb, conn, idx, newEl, events) {
        events = events || {};

        // allow Endpoints to be passed in
        newEl = newEl.canvas || newEl;

        var el1 = conn.endpoints[idx].canvas;
        var e1 = _makeEvt(_jsPlumb, el1);
        var e2 = _makeEvt(_jsPlumb, newEl);

        events.before && events.before();

        _jsPlumb.trigger(el1, "mousedown", e1);
        events.beforeMouseMove && events.beforeMouseMove();
        _jsPlumb.trigger(document, "mousemove", e2);
        events.beforeMouseUp && events.beforeMouseUp();
        _jsPlumb.trigger(newEl, "mouseup", e2);

        events.after && events.after();
    };

    var _relocateSource = function(_jsPlumb, conn, source, events) {
        _relocate(_jsPlumb, conn, 0, source, events);
    };

    this.jsPlumbTestSupport = {
        getInstance:function(_jsPlumb) {

            var _divs = [];
            var _addDiv = function (id, parent, className, x, y, w, h) {
                var d1 = document.createElement("div");
                d1.style.position = "absolute";
                if (parent) parent.appendChild(d1); else document.getElementById("container").appendChild(d1);
                d1.setAttribute("id", id);
                d1.style.left = (x != null ? x : (Math.floor(Math.random() * 1000))) + "px";
                d1.style.top = (y!= null ? y : (Math.floor(Math.random() * 1000))) + "px";
                if (className) d1.className = className;
                if (w) d1.style.width = w + "px";
                if (h) d1.style.height = h + "px";
                _divs.push(id);
                return d1;
            };

            var _addDraggableDiv = function (_jsPlumb, id, parent, className, x, y, w, h) {
                var d = _addDiv.apply(null, [id, parent, className, x, y, w, h]);
                _jsPlumb.draggable(d);
                return d;
            };

            var _addDivs = function (ids, parent) {
                for (var i = 0; i < ids.length; i++)
                    _addDiv(ids[i], parent);
            };

            var _assertEndpointCount = function (_jsPlumb, elId, count) {
                var ep = _jsPlumb.getEndpoints(elId),
                    epl = ep ? ep.length : 0;
                equal(epl, count, elId + " has " + count + ((count > 1 || count == 0) ? " endpoints" : " endpoint"));
                equal(_jsPlumb.anchorManager.getEndpointsFor(elId).length, count, "anchor manager has " + count + ((count > 1 || count == 0) ? " endpoints" : " endpoint") + " for " + elId);
            };

            return {
                getAttribute:function(el, att) {
                    return el.getAttribute(att);
                },

                droppableClass:"jtk-droppable",

                dragNodeBy:_dragNodeBy.bind(null, _jsPlumb),

                dragNodeTo:_dragNodeTo.bind(null, _jsPlumb),

                dragANodeAround:_dragANodeAround.bind(null, _jsPlumb),

                dragConnection:_dragConnection.bind(null, _jsPlumb),

                dragAndAbortConnection:_dragAndAbort.bind(null, _jsPlumb),

                dragtoDistantLand:_dragAndAbort.bind(null, _jsPlumb),

                detachConnection:_detachConnection.bind(null, _jsPlumb),

                relocate:_relocate.bind(null, _jsPlumb),

                relocateSource:_relocateSource.bind(null, _jsPlumb),

                relocateTarget:_relocateTarget.bind(null, _jsPlumb),

                makeEvent:_makeEvt.bind(null, _jsPlumb),

                addDiv:_addDiv,
                addDivs:_addDivs,
                addDraggableDiv:_addDraggableDiv.bind(null, _jsPlumb),
                assertEndpointCount:_assertEndpointCount.bind(null, _jsPlumb),

                cleanup:function() {
                    for (var i in _divs) {
                        var d = document.getElementById(_divs[i]);
                        d && d.parentNode.removeChild(d);
                    }
                    _divs.length = 0;
                },
                makeContent : function (s) {
                    var d = document.createElement("div");
                    d.innerHTML = s;
                    return d.firstChild;
                }
            }
        }
    };

}).call(this);
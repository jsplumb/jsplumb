;(function() {
    "use strict";

    var root = this;
    var HANDLE_CLASS = "jsplumb-bezier-handle";
    var CONNECTION_EDIT_CLASS = "jsplumb-connection-edit";
    var GUIDELINE_CLASS = "jsplumb-bezier-guideline";
    var NONE = "none";
    var BLOCK = "block";
    var DUAL = "dual";
    var CLICK = "click";

    root.jsPlumb.ConnectorEditors = root.jsPlumb.ConnectorEditors || { };

    jsPlumbInstance.prototype.editConnection = function(connection, params) {
        if (connection.getConnector().isEditable()) {
            params = jsPlumb.extend({}, params || {});
            var clearOnDrag = params.clearOnDrag !== false;
            var connectorType = connection.getConnector().type;
            if (!jsPlumb.ConnectorEditors[connectorType]) {
                throw new TypeError("No editor available for connector type [" + connectorType + "]");
            }
            if (connection.editor == null) {
                params.connection = connection;
                connection.editor = new jsPlumb.ConnectorEditors[connectorType](params);

                //
                // when user drags source or target node, reset.
                //
                connection._jsPlumb.instance.draggable([connection.source, connection.target], {
                    force: true,
                    start: function () {
                       if (clearOnDrag)
                           connection.editor.reset();
                    },
                    drag:function() {
                        if (!clearOnDrag) {
                            connection.editor.update()
                        }
                    }
                });
            }

            setTimeout(function () {
                connection.editor.activate();
            }, 0);
        }
    };

    var _makeHandle = function(x, y) {
        var h = document.createElement("div");
        h.className = HANDLE_CLASS;
        h.style.position = "absolute";
        h.style.left = x + "px";
        h.style.top = y + "px";
        h.style.display = "none";
        return h;
    };

    var _updateGuideline = function(handle, anchor, line, x, y) {
        x = x + (handle.offsetWidth / 2);
        y = y + (handle.offsetHeight / 2);
        var w = Math.max(5, Math.abs(x - anchor.left)), h = Math.max(5, Math.abs(y - anchor.top));
        jsPlumbUtil.svg.attr(line, { width:w, height:h });
        line.style.left = (Math.min(anchor.left, x)) + "px";
        line.style.top= (Math.min(anchor.top, y)) + "px";

        var path = "M " + (x > anchor.left ? w : "0") + " " + (y > anchor.top ? h : "0") + " L " +
                   (x > anchor.left ? "0" : w) + " " + (y > anchor.top ? "0" : h);
        jsPlumbUtil.svg.attr(line.childNodes[0], {d:path});

    };

    var _makeGuideline = function(handle, anchor, x2, y2) {
        var w = Math.abs(x2-anchor.left), h = Math.abs(y2-anchor.top),
            s = jsPlumbUtil.svg.node("svg", { width:w, height:h}),
            l = jsPlumbUtil.svg.node("path", { d:"M " + 0 + " " + 0 + " L " + w + " " + h });

        s.appendChild(l);
        jsPlumb.addClass(s, GUIDELINE_CLASS);

        _updateGuideline(handle, anchor, s, x2, y2);

        return s;
    };

    var AbstractBezierEditor = function(params) {
        var conn = params.connection, _jsPlumb = conn._jsPlumb.instance,
            mode = params.mode || "single";
        var closeOnMouseUp = params.closeOnMouseUp !== false;
        var cp, origin, cp1 = [0,0], cp2 = [0,0], self = this, active = false, sp, center, tp;

        var _updateOrigin = function() {
            sp = _jsPlumb.getOffset(conn.endpoints[0].canvas);
            tp = _jsPlumb.getOffset(conn.endpoints[1].canvas);
            origin = [sp.left, sp.top ];
            center = [ (sp.left + tp.left) / 2, (sp.top + tp.top) / 2 ];
        };

        //
        // updates the current origin of the connector's SVG element (the location of its to left corner wrt
        // the origin of the jsplumb instance's container). Then updates the offset of the source and target points
        // from the origin of the SVG element. Finally, extracts the control point information from the connection,
        // either as geometry (if previously edited or set) or from the computed control points.
        //
        // The offset of the source and target points is of interest because control points are treated as being
        // with respect to the source point.  When you drag a handle, you get an offset for it wrt the the jsplumb
        // instance's container. You can then adjust this
        var _updateConnectorInfo = function() {
            _updateOrigin();
            var geom = conn.getConnector().getGeometry();
            if (geom && geom.controlPoints) {
                cp = geom.controlPoints;
                cp1[0] = geom.controlPoints[0][0];
                cp1[1] = geom.controlPoints[0][1];
                cp2[0] = geom.controlPoints[1][0];
                cp2[1] = geom.controlPoints[1][1];
            }
            else {
                cp = conn.getConnector().getControlPoints();
                cp1[0] = cp[0][0];
                cp1[1] = cp[0][1];
                cp2[0] = cp[1][0];
                cp2[1] = cp[1][1];
            }
        };

        var _updateHandlePositions = function() {
            if (mode === DUAL) {
                h1.style.left = origin[0] + ((cp1[0] + cp2[0]) / 2) + "px";
                h1.style.top = origin[1] + ((cp1[1] + cp2[1]) / 2) + "px";

                h3.style.left = (origin[0] + cp1[0]) + "px";
                h3.style.top = (origin[1] + cp1[1]) + "px";
                h4.style.left = (origin[0] + cp2[0]) + "px";
                h4.style.top = (origin[1] + cp2[1]) + "px";
            }
            else {
                h1.style.left = (origin[0] + cp1[0]) + "px";
                h1.style.top = (origin[1] + cp1[1]) + "px";

                var _cp2 = this.lockHandles ? cp1 : cp2;
                h2.style.left = (origin[0] + _cp2[0]) + "px";
                h2.style.top = (origin[1] + _cp2[1]) + "px";
            }

        }.bind(this);

        _updateConnectorInfo();

        var h1 = _makeHandle(sp.left + cp[0][0], sp.top + cp[0][1]),   //_makeHandle(origin[0] + cp[0][0], origin[1] + cp[0][1]),
            h2 = _makeHandle(sp.left + cp[0][0], sp.top + cp[0][1]),  //_makeHandle(origin[0] + cp[0][0], origin[1] + cp[0][1]),
            l1 = _makeGuideline(h2, tp, origin[0] + cp[0][0], origin[1] + cp[0][1]),
            l2 = _makeGuideline(self.lockHandles ? h2 : h1, sp, origin[0] + cp[1][0], origin[1] + cp[1][1]),

            h3 = _makeHandle(origin[0] + cp[0][0], origin[1] + cp[0][1]),
            h4 = _makeHandle(origin[0] + cp[0][0], origin[1] + cp[0][1]);

        if (mode == DUAL) {
            h3.style.display = BLOCK;
            h4.style.display = BLOCK;
            _jsPlumb.appendElement(h3);
            _jsPlumb.appendElement(h4);
        }

        //_jsPlumb.appendElement(l1);
        //_jsPlumb.appendElement(l2);
        _jsPlumb.appendElement(h1);
        _jsPlumb.appendElement(h2);

        var _setGeometry = function() {
            conn.getConnector().setGeometry({
                controlPoints:[ cp1, cp2 ]
            });
            conn.repaint();
        };
        var _clearGeometry = function() {
            conn.getConnector().setGeometry(null);
            conn.repaint();
        };

        var _updateGuidelines = function() {
            _updateGuideline(h2, tp, l1, origin[0] + cp1[0], origin[1] + cp1[1]);
            var _cp2 = this.lockHandles ? cp1 : cp2;
            _updateGuideline(self.lockHandles ? h2 : h1, sp, l2, origin[0] + _cp2[0], origin[1] + _cp2[1]);
        }.bind(this);

        var _toBiltongPoint = function(xy) { return { x:xy[0], y:xy[1] }; };

        var _initDraggable = function(el, arr) {
            _jsPlumb.draggable(el, {
                drag:function(dp) {
                    var l = dp.pos[0] - origin[0], t = dp.pos[1] - origin[1];
                    //var l = dp.pos[0] - sp.left, t = dp.pos[1] - sp.top;
                    if (!self.lockHandles) {
                        arr[0] = l;
                        arr[1] = t;
                    }
                    else {

                        if (mode === DUAL) {
                            // get radius and then get a line that is a tangent to the circle, whose length is 1.5 times
                            // the radius. This has the effect of making the curve more bulbous as you drag it out.
                            var radius = Biltong.lineLength(center, dp.pos);
                            var cpLine = Biltong.perpendicularLineTo(_toBiltongPoint(center), _toBiltongPoint(dp.pos), radius*1.5);
                            // swap the two control points if in segment 4 or 2.
                            var quadrant = Biltong.quadrant(center, dp.pos);
                            var idx1 = quadrant == 1 || quadrant == 3 ? 0 : 1,
                                idx2 = quadrant == 1 || quadrant == 3 ? 1 : 0;

                            cp1[0] = cpLine[idx1].x - origin[0];
                            cp1[1] = cpLine[idx1].y - origin[1];
                            cp2[0] = cpLine[idx2].x - origin[0];
                            cp2[1] = cpLine[idx2].y - origin[1];

                            h3.style.left = (origin[0] + cp1[0]) + "px";
                            h3.style.top = (origin[1] + cp1[1]) + "px";
                            h4.style.left = (origin[0] + cp2[0]) + "px";
                            h4.style.top = (origin[1] + cp2[1]) + "px";

                        }
                        else {
                            cp1[0] = l; cp1[1] = t;
                            cp2[0] = l; cp2[1] = t;
                        }
                    }
                    _setGeometry();
                    _updateGuidelines();

                }
            });
        };

        _initDraggable(h1, cp1);
        _initDraggable(h2, cp2);

        _setGeometry();

        this.activate = function() {
            _updateConnectorInfo();
            _updateHandlePositions();
            h1.style.display = BLOCK;
            if (!self.lockHandles)
                h2.style.display = BLOCK;
            if (mode === DUAL) {
                h3.style.display = BLOCK;
                h4.style.display = BLOCK;
            }
            l1.style.display = BLOCK;
            l2.style.display = BLOCK;
            sp = _jsPlumb.getOffset(conn.endpoints[0].canvas);
            tp = _jsPlumb.getOffset(conn.endpoints[1].canvas);
            _updateGuidelines();
            conn.addClass(CONNECTION_EDIT_CLASS);
            if (closeOnMouseUp) {
                _jsPlumb.on(document, CLICK, self.deactivate);
            }
            active = true;
        };

        this.deactivate = function(e) {
            if (e && jsPlumb.hasClass(e.srcElement, HANDLE_CLASS)) return;

            h1.style.display = NONE;
            h2.style.display = NONE;
            h3.style.display = NONE;
            h4.style.display = NONE;
            l1.style.display = NONE;
            l2.style.display = NONE;
            conn.removeClass(CONNECTION_EDIT_CLASS);
            if (closeOnMouseUp) {
                _jsPlumb.off(document, CLICK, self.deactivate);
            }
            active = false;
        };

        this.reset = function() {
            _clearGeometry();
            self.deactivate();
        };

        this.update = function() {
            _updateConnectorInfo();
            _updateHandlePositions();
        };
    };

    root.jsPlumb.ConnectorEditors.StateMachine = function() {
        this.lockHandles = true;
        AbstractBezierEditor.apply(this, arguments);
    };

    root.jsPlumb.ConnectorEditors.Bezier = function() {
        AbstractBezierEditor.apply(this, arguments);
    };


}).call(this);
;(function() {
    "use strict";

    var root = this;
    var HANDLE_CLASS = "jsplumb-bezier-handle";
    var CONNECTION_EDIT_CLASS = "jsplumb-connection-edit";
    var GUIDELINE_CLASS = "jsplumb-bezier-guideline";

    root.jsPlumb.ConnectorEditors = root.jsPlumb.ConnectorEditors || { };

    jsPlumbInstance.prototype.editConnection = function(connection) {
        var connectorType = connection.getConnector().type;
        if (!jsPlumb.ConnectorEditors[connectorType]) {
            throw new TypeError("No editor available for connector type [" + connectorType + "]");
        }
        if (connection.editor == null) {
            connection.editor = new jsPlumb.ConnectorEditors[connectorType]({
                connection: connection
            });

            //
            // when user drags source or target node, reset.
            //
            connection._jsPlumb.instance.draggable([connection.source, connection.target], {
                force:true,
                start:function() {
                    connection.editor.reset();
                }
            });
        }

        setTimeout(function() { connection.editor.activate(); }, 0);
    } ;

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

        return s;
    };

    var AbstractBezierEditor = function(params) {
        var conn = params.connection, _jsPlumb = conn._jsPlumb.instance;
        var cp, origin, cp1 = [0,0], cp2 = [0,0], self = this;

        var _updateConnectorInfo = function() {
            var geom = conn.getConnector().getGeometry();
            if (geom && geom.controlPoints) {
                cp1[0] = geom.controlPoints[0][0];
                cp1[1] = geom.controlPoints[0][1];
                cp2[0] = geom.controlPoints[1][0];
                cp2[1] = geom.controlPoints[1][1];
            }
            else {
                cp = conn.getConnector().getControlPoints();
                origin = [ conn.canvas.offsetLeft, conn.canvas.offsetTop ];
                cp1[0] = cp[0][0];
                cp1[1] = cp[0][1];
                cp2[0] = cp[1][0];
                cp2[1] = cp[1][1];
            }
        };

        var _updateHandlePositions = function() {
            h1.style.left = (origin[0] + cp1[0]) + "px";
            h1.style.top = (origin[1] + cp1[1]) + "px";
            h2.style.left = (origin[0] + cp2[0]) + "px";
            h2.style.top = (origin[1] + cp2[1]) + "px";
        };

        _updateConnectorInfo();

        var sp = _jsPlumb.getOffset(conn.endpoints[0].canvas);
        var tp = _jsPlumb.getOffset(conn.endpoints[1].canvas);
        var h1 = _makeHandle(origin[0] + cp[0], origin[1] + cp[1]), h2 = _makeHandle(origin[0] + cp[0], origin[1] + cp[1]);
        var l1 = _makeGuideline(h1, sp, origin[0] + cp[0][0], origin[1] + cp[0][1]);
        var l2 = _makeGuideline(h2, tp, origin[0] + cp[1][0], origin[1] + cp[1][1]);

        _jsPlumb.appendElement(l1);
        _jsPlumb.appendElement(l2);
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
            _updateGuideline(h1, sp, l1, origin[0] + cp1[0], origin[1] + cp1[1]);
            _updateGuideline(h2, tp, l2, origin[0] + cp2[0], origin[1] + cp2[1]);
        };

        var _initDraggable = function(el, arr) {
            _jsPlumb.draggable(el, {
                drag:function(dp) {
                    arr[0] = dp.pos[0] - origin[0];
                    arr[1] = dp.pos[1] - origin[1];
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
            h1.style.display = "block";
            h2.style.display = "block";
            l1.style.display = "block";
            l2.style.display = "block";
            _updateGuidelines();
            conn.addClass(CONNECTION_EDIT_CLASS);
            _jsPlumb.on(document, "click", self.deactivate);
        };

        this.deactivate = function(e) {
            if (e && jsPlumb.hasClass(e.srcElement, HANDLE_CLASS)) return;
            h1.style.display = "none";
            h2.style.display = "none";
            l1.style.display = "none";
            l2.style.display = "none";
            conn.removeClass(CONNECTION_EDIT_CLASS);
            _jsPlumb.off(document, "click", self.deactivate);
        };

        this.reset = function() {
            _clearGeometry();
            self.deactivate();
        };
    };

    root.jsPlumb.ConnectorEditors.StateMachine = function() {
        AbstractBezierEditor.apply(this, arguments);
    };

    root.jsPlumb.ConnectorEditors.Bezier = function() {
        AbstractBezierEditor.apply(this, arguments);
    };


}).call(this);
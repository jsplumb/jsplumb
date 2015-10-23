;(function() {
    "use strict";

    var root = this;
    var HANDLE_CLASS = "jsplumb-bezier-handle";

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
                cp1[0] = cp[0];
                cp1[1] = cp[1];
                cp2[0] = cp[0];
                cp2[1] = cp[1];
            }
        };

        var _updateHandlePositions = function() {
            h1.style.left = (origin[0] + cp1[0]) + "px";
            h1.style.top = (origin[1] + cp1[1]) + "px";
            h2.style.left = (origin[0] + cp2[0]) + "px";
            h2.style.top = (origin[1] + cp2[1]) + "px";
        };

        _updateConnectorInfo();
        var h1 = _makeHandle(origin[0] + cp[0], origin[1] + cp[1]), h2 = _makeHandle(origin[0] + cp[0], origin[1] + cp[1]);
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

        var _initDraggable = function(el, arr) {
            _jsPlumb.draggable(el, {
                drag:function(dp) {
                    arr[0] = dp.pos[0] - origin[0];
                    arr[1] = dp.pos[1] - origin[1];
                    _setGeometry();
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
            _jsPlumb.on(document, "click", self.deactivate);
        };

        this.deactivate = function(e) {
            if (e && jsPlumb.hasClass(e.srcElement, HANDLE_CLASS)) return;
            h1.style.display = "none";
            h2.style.display = "none";
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
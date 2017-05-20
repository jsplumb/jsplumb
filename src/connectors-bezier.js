/*
 * jsPlumb Community Edition
 *
 * Provides a way to visually connect elements on an HTML page, using SVG.
 *
 * This file contains the code for the Bezier connector type.
 *
 * Copyright (c) 2010 - 2017 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
;
(function () {

    "use strict";
    var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;

    _jp.Connectors.AbstractBezierConnector = function(params) {
        params = params || {};
        var showLoopback = params.showLoopback !== false,
            curviness = params.curviness || 10,
            margin = params.margin || 5,
            proximityLimit = params.proximityLimit || 80,
            clockwise = params.orientation && params.orientation === "clockwise",
            loopbackRadius = params.loopbackRadius || 25,
            isLoopbackCurrently = false,
            _super;

        this.overrideSetEditable = function() { return !isLoopbackCurrently; };

        this._compute = function (paintInfo, p) {

            var sp = p.sourcePos,
                tp = p.targetPos,
                _w = Math.abs(sp[0] - tp[0]),
                _h = Math.abs(sp[1] - tp[1]);

            if (!showLoopback || (p.sourceEndpoint.elementId !== p.targetEndpoint.elementId)) {
                isLoopbackCurrently = false;
                this._computeBezier(paintInfo, p, sp, tp, _w, _h);
            } else {
                isLoopbackCurrently = true;
                // a loopback connector.  draw an arc from one anchor to the other.
                var x1 = p.sourcePos[0], y1 = p.sourcePos[1] - margin,
                    cx = x1, cy = y1 - loopbackRadius,
                // canvas sizing stuff, to ensure the whole painted area is visible.
                    _x = cx - loopbackRadius,
                    _y = cy - loopbackRadius;

                _w = 2 * loopbackRadius;
                _h = 2 * loopbackRadius;

                paintInfo.points[0] = _x;
                paintInfo.points[1] = _y;
                paintInfo.points[2] = _w;
                paintInfo.points[3] = _h;

                // ADD AN ARC SEGMENT.
                _super.addSegment(this, "Arc", {
                    loopback: true,
                    x1: (x1 - _x) + 4,
                    y1: y1 - _y,
                    startAngle: 0,
                    endAngle: 2 * Math.PI,
                    r: loopbackRadius,
                    ac: !clockwise,
                    x2: (x1 - _x) - 4,
                    y2: y1 - _y,
                    cx: cx - _x,
                    cy: cy - _y
                });
            }
        };

        _super = _jp.Connectors.AbstractConnector.apply(this, arguments);
        return _super;
    };
    _ju.extend(_jp.Connectors.AbstractBezierConnector, _jp.Connectors.AbstractConnector);

    var Bezier = function (params) {
        params = params || {};
        this.type = "Bezier";

        var _super = _jp.Connectors.AbstractBezierConnector.apply(this, arguments),
            majorAnchor = params.curviness || 150,
            minorAnchor = 10;

        this.getCurviness = function () {
            return majorAnchor;
        };

        this._findControlPoint = function (point, sourceAnchorPosition, targetAnchorPosition, sourceEndpoint, targetEndpoint, soo, too) {
            // determine if the two anchors are perpendicular to each other in their orientation.  we swap the control
            // points around if so (code could be tightened up)
            var perpendicular = soo[0] !== too[0] || soo[1] === too[1],
                p = [];

            if (!perpendicular) {
                if (soo[0] === 0) {
                    p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + minorAnchor : point[0] - minorAnchor);
                }
                else {
                    p.push(point[0] - (majorAnchor * soo[0]));
                }

                if (soo[1] === 0) {
                    p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + minorAnchor : point[1] - minorAnchor);
                }
                else {
                    p.push(point[1] + (majorAnchor * too[1]));
                }
            }
            else {
                if (too[0] === 0) {
                    p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + minorAnchor : point[0] - minorAnchor);
                }
                else {
                    p.push(point[0] + (majorAnchor * too[0]));
                }

                if (too[1] === 0) {
                    p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + minorAnchor : point[1] - minorAnchor);
                }
                else {
                    p.push(point[1] + (majorAnchor * soo[1]));
                }
            }

            return p;
        };

        this._computeBezier = function (paintInfo, p, sp, tp, _w, _h) {

            var geometry = this.getGeometry(), _CP, _CP2,
                _sx = sp[0] < tp[0] ? _w : 0,
                _sy = sp[1] < tp[1] ? _h : 0,
                _tx = sp[0] < tp[0] ? 0 : _w,
                _ty = sp[1] < tp[1] ? 0 : _h;

            if ((this.hasBeenEdited() || this.isEditing()) && geometry != null && geometry.controlPoints != null && geometry.controlPoints[0] != null && geometry.controlPoints[1] != null) {
                _CP = geometry.controlPoints[0];
                _CP2 = geometry.controlPoints[1];
            }
            else {
                _CP = this._findControlPoint([_sx, _sy], sp, tp, p.sourceEndpoint, p.targetEndpoint, paintInfo.so, paintInfo.to);
                _CP2 = this._findControlPoint([_tx, _ty], tp, sp, p.targetEndpoint, p.sourceEndpoint, paintInfo.to, paintInfo.so);
            }

            _super.setGeometry({controlPoints:[_CP, _CP2]}, true);

            _super.addSegment(this, "Bezier", {
                x1: _sx, y1: _sy, x2: _tx, y2: _ty,
                cp1x: _CP[0], cp1y: _CP[1], cp2x: _CP2[0], cp2y: _CP2[1]
            });
        };


    };

    _ju.extend(Bezier, _jp.Connectors.AbstractBezierConnector);
    _jp.registerConnectorType(Bezier, "Bezier");

}).call(typeof window !== 'undefined' ? window : this);
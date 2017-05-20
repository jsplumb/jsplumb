/*
 * jsPlumb Community Edition
 *
 * Provides a way to visually connect elements on an HTML page, using SVG.
 *
 * This file contains the 'flowchart' connectors, consisting of vertical and horizontal line segments.
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
    var STRAIGHT = "Straight";

    var Straight = function (params) {
        this.type = STRAIGHT;
        var _super = _jp.Connectors.AbstractConnector.apply(this, arguments);

        this._compute = function (paintInfo, _) {
            _super.addSegment(this, STRAIGHT, {x1: paintInfo.sx, y1: paintInfo.sy, x2: paintInfo.startStubX, y2: paintInfo.startStubY});
            _super.addSegment(this, STRAIGHT, {x1: paintInfo.startStubX, y1: paintInfo.startStubY, x2: paintInfo.endStubX, y2: paintInfo.endStubY});
            _super.addSegment(this, STRAIGHT, {x1: paintInfo.endStubX, y1: paintInfo.endStubY, x2: paintInfo.tx, y2: paintInfo.ty});
        };
    };

    _ju.extend(Straight, _jp.Connectors.AbstractConnector);
    _jp.registerConnectorType(Straight, STRAIGHT);

}).call(typeof window !== 'undefined' ? window : this);
/*
 * Default router. Defers to an AnchorManager for placement of anchors, and connector paint routines for paths.
 *
 * Copyright (c) 2010 - 2020 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * https://jsplumbtoolkit.com
 * https://github.com/jsplumb/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */

;
(function () {

    "use strict";

    var root = this,
        _ju = root.jsPlumbUtil,
        _jp = root.jsPlumb;

    _jp.DefaultRouter = function(jsPlumbInstance) {
        this.jsPlumbInstance = jsPlumbInstance;
        this.anchorManager = new _jp.AnchorManager({jsPlumbInstance:jsPlumbInstance});
    };

}).call(typeof window !== 'undefined' ? window : this);



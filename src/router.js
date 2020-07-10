/*
 * Default router. Defers to an AnchorManager for placement of anchors, and connector paint routines for paths.
 * Currently this is a placeholder and acts as a facade to the pre-existing anchor manager. The Toolkit edition
 * will make use of concept to provide more advanced routing.
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

        this.sourceOrTargetChanged = function (originalId, newId, connection, newElement, anchorIndex) {
            this.anchorManager.sourceOrTargetChanged(originalId, newId, connection, newElement, anchorIndex);
        };
    };



}).call(typeof window !== 'undefined' ? window : this);



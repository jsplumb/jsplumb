/*
 * jsPlumb
 *
 * Title:jsPlumb 1.7.2
 *
 * Provides a way to visually connect elements on an HTML page, using SVG or VML.
 *
 * This file contains the base class for library adapters. From 1.7.2 onwards all event management internal to jsPlumb is handled
 * through Mottle, regardless of the underlying library. Dragging - and the events associated with it - is still handled
 * by the library.
 *
 * Copyright (c) 2010 - 2014 Simon Porritt (simon@jsplumbtoolkit.com)
 *
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {
    "use strict";

    var _getEventManager = function(instance) {
        var e = instance._mottle;
        if (!e) {
            e = instance._mottle = new Mottle();
        }
        return e;
    };

    jsPlumb.extend(jsPlumbInstance.prototype, {
        getEventManager:function() {
            return _getEventManager(this);
        },
        //           EVENTS
        // e.originalEvent is for jQuery; in Vanilla jsPlumb we get the native event.

        on : function(el, event, callback) {
            // TODO: here we would like to map the tap event if we know its
            // an internal bind to a click. we have to know its internal because only
            // then can we be sure that the UP event wont be consumed (tap is a synthesized
            // event from a mousedown followed by a mouseup).
            //event = { "click":"tap", "dblclick":"dbltap"}[event] || event;
            this.getEventManager().on.apply(this, arguments);
        },
        off : function(el, event, callback) {
            this.getEventManager().off.apply(this, arguments);
        }
    });


}).call(this);
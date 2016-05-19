/*
 * jsPlumb
 *
 * Title:jsPlumb 2.1.1
 *
 * Provides a way to visually connect elements on an HTML page, using SVG.
 *
 * This file contains code for components that support overlays.
 *
 * Copyright (c) 2010 - 2016 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
;(function() {

    "use strict";
    var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;

    // ------------------------------ BEGIN OverlayCapablejsPlumbUIComponent --------------------------------------------

    var _internalLabelOverlayId = "__label",
    // this is a shortcut helper method to let people add a label as
    // overlay.
        _makeLabelOverlay = function (component, params) {

            var _params = {
                    cssClass: params.cssClass,
                    labelStyle: component.labelStyle,
                    id: _internalLabelOverlayId,
                    component: component,
                    _jsPlumb: component._jsPlumb.instance  // TODO not necessary, since the instance can be accessed through the component.
                },
                mergedParams = _jp.extend(_params, params);

            return new _jp.Overlays[component._jsPlumb.instance.getRenderMode()].Label(mergedParams);
        },
        _processOverlay = function (component, o) {
            var _newOverlay = null;
            if (_ju.isArray(o)) {	// this is for the shorthand ["Arrow", { width:50 }] syntax
                // there's also a three arg version:
                // ["Arrow", { width:50 }, {location:0.7}]
                // which merges the 3rd arg into the 2nd.
                var type = o[0],
                // make a copy of the object so as not to mess up anyone else's reference...
                    p = _jp.extend({component: component, _jsPlumb: component._jsPlumb.instance}, o[1]);
                if (o.length == 3) _jp.extend(p, o[2]);
                _newOverlay = new _jp.Overlays[component._jsPlumb.instance.getRenderMode()][type](p);
            } else if (o.constructor == String) {
                _newOverlay = new _jp.Overlays[component._jsPlumb.instance.getRenderMode()][o]({component: component, _jsPlumb: component._jsPlumb.instance});
            } else {
                _newOverlay = o;
            }

            _newOverlay.id = _newOverlay.id || _ju.uuid();
            component.cacheTypeItem("overlay", _newOverlay, _newOverlay.id);
            //component._jsPlumb.overlays.push(_newOverlay);
            component._jsPlumb.overlays[_newOverlay.id] = _newOverlay;

            return _newOverlay;
        };

    _jp.OverlayCapableJsPlumbUIComponent = function (params) {

        root.jsPlumbUIComponent.apply(this, arguments);
        this._jsPlumb.overlays = {};
        this._jsPlumb.overlayPositions = {};

        if (params.label) {
            this.getDefaultType().overlays[_internalLabelOverlayId] = ["Label", {
                label: params.label,
                location: params.labelLocation || this.defaultLabelLocation || 0.5,
                labelStyle: params.labelStyle || this._jsPlumb.instance.Defaults.LabelStyle,
                id:_internalLabelOverlayId
            }];
        }

        this.setListenerComponent = function (c) {
            if (this._jsPlumb) {
                for (var i in this._jsPlumb.overlays)
                    this._jsPlumb.overlays[i].setListenerComponent(c);
            }
        };
    };

    _jp.OverlayCapableJsPlumbUIComponent.applyType = function (component, t) {
        if (t.overlays) {
            // loop through the ones in the type. if already present on the component,
            // dont remove or re-add.
            var keep = {}, i;

            for (i in t.overlays) {

                var existing = component._jsPlumb.overlays[t.overlays[i][1].id];
                if (existing) {
                    // maybe update from data, if there were parameterised values for instance.
                    existing.updateFrom(t.overlays[i][1]);
                    keep[t.overlays[i][1].id] = true;
                }
                else {
                    var c = component.getCachedTypeItem("overlay", t.overlays[i][1].id);
                    if (c != null) {
                        c.reattach(component._jsPlumb.instance);
                        c.setVisible(true);
                        // maybe update from data, if there were parameterised values for instance.
                        c.updateFrom(t.overlays[i][1]);
                        component._jsPlumb.overlays[c.id] = c;
                    }
                    else {
                        c = component.addOverlay(t.overlays[i], true);
                    }
                    keep[c.id] = true;
                }
            }

            // now loop through the full overlays and remove those that we dont want to keep
            for (i in component._jsPlumb.overlays) {
                if (keep[component._jsPlumb.overlays[i].id] == null)
                    component.removeOverlay(component._jsPlumb.overlays[i].id, true); // remove overlay but dont clean it up.
                    // that would remove event listeners etc; overlays are never discarded by the types stuff, they are
                    // just detached/reattached.
            }
        }
    };

    _ju.extend(_jp.OverlayCapableJsPlumbUIComponent, root.jsPlumbUIComponent, {

        setHover: function (hover, ignoreAttachedElements) {
            if (this._jsPlumb && !this._jsPlumb.instance.isConnectionBeingDragged()) {
                for (var i in this._jsPlumb.overlays) {
                    this._jsPlumb.overlays[i][hover ? "addClass" : "removeClass"](this._jsPlumb.instance.hoverClass);
                }
            }
        },
        addOverlay: function (overlay, doNotRepaint) {
            var o = _processOverlay(this, overlay);
            if (!doNotRepaint) this.repaint();
            return o;
        },
        getOverlay: function (id) {
            return this._jsPlumb.overlays[id];
        },
        getOverlays: function () {
            return this._jsPlumb.overlays;
        },
        hideOverlay: function (id) {
            var o = this.getOverlay(id);
            if (o) o.hide();
        },
        hideOverlays: function () {
            for (var i in this._jsPlumb.overlays)
                this._jsPlumb.overlays[i].hide();
        },
        showOverlay: function (id) {
            var o = this.getOverlay(id);
            if (o) o.show();
        },
        showOverlays: function () {
            for (var i in this._jsPlumb.overlays)
                this._jsPlumb.overlays[i].show();
        },
        removeAllOverlays: function (doNotRepaint) {
            for (var i in this._jsPlumb.overlays) {
                if (this._jsPlumb.overlays[i].cleanup) this._jsPlumb.overlays[i].cleanup();
            }

            this._jsPlumb.overlays = {};
            this._jsPlumb.overlayPositions = null;
            if (!doNotRepaint)
                this.repaint();
        },
        removeOverlay: function (overlayId, dontCleanup) {
            var o = this._jsPlumb.overlays[overlayId];
            if (o) {
                o.setVisible(false);
                if (!dontCleanup && o.cleanup) o.cleanup();
                delete this._jsPlumb.overlays[overlayId];
                if (this._jsPlumb.overlayPositions)
                    delete this._jsPlumb.overlayPositions[overlayId];
            }
        },
        removeOverlays: function () {
            for (var i = 0, j = arguments.length; i < j; i++)
                this.removeOverlay(arguments[i]);
        },
        moveParent: function (newParent) {
            if (this.bgCanvas) {
                this.bgCanvas.parentNode.removeChild(this.bgCanvas);
                newParent.appendChild(this.bgCanvas);
            }

            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
                newParent.appendChild(this.canvas);

                for (var i in this._jsPlumb.overlays) {
                    if (this._jsPlumb.overlays[i].isAppendedAtTopLevel) {
                        var el = this._jsPlumb.overlays[i].getElement();
                        el.parentNode.removeChild(el);
                        newParent.appendChild(el);
                    }
                }
            }
        },
        getLabel: function () {
            var lo = this.getOverlay(_internalLabelOverlayId);
            return lo != null ? lo.getLabel() : null;
        },
        getLabelOverlay: function () {
            return this.getOverlay(_internalLabelOverlayId);
        },
        setLabel: function (l) {
            var lo = this.getOverlay(_internalLabelOverlayId);
            if (!lo) {
                var params = l.constructor == String || l.constructor == Function ? { label: l } : l;
                lo = _makeLabelOverlay(this, params);
                this._jsPlumb.overlays[_internalLabelOverlayId] = lo;
            }
            else {
                if (l.constructor == String || l.constructor == Function) lo.setLabel(l);
                else {
                    if (l.label) lo.setLabel(l.label);
                    if (l.location) lo.setLocation(l.location);
                }
            }

            if (!this._jsPlumb.instance.isSuspendDrawing())
                this.repaint();
        },
        cleanup: function (force) {
            for (var i in this._jsPlumb.overlays) {
                this._jsPlumb.overlays[i].cleanup(force);
                this._jsPlumb.overlays[i].destroy(force);
            }
            if (force) {
                this._jsPlumb.overlays = {};
                this._jsPlumb.overlayPositions = null;
            }
        },
        setVisible: function (v) {
            this[v ? "showOverlays" : "hideOverlays"]();
        },
        setAbsoluteOverlayPosition: function (overlay, xy) {
            this._jsPlumb.overlayPositions[overlay.id] = xy;
        },
        getAbsoluteOverlayPosition: function (overlay) {
            return this._jsPlumb.overlayPositions ? this._jsPlumb.overlayPositions[overlay.id] : null;
        },
        _clazzManip:function(action, clazz, dontUpdateOverlays) {
            if (!dontUpdateOverlays) {
                for (var i in this._jsPlumb.overlays) {
                    this._jsPlumb.overlays[i][action + "Class"](clazz);
                }
            }
        },
        addClass:function(clazz, dontUpdateOverlays) {
            this._clazzManip("add", clazz, dontUpdateOverlays)
        },
        removeClass:function(clazz, dontUpdateOverlays) {
            this._clazzManip("remove", clazz, dontUpdateOverlays)
        }
    });

// ------------------------------ END OverlayCapablejsPlumbUIComponent --------------------------------------------

}).call(typeof window !== 'undefined' ? window : this);

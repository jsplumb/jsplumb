/*
 * jsPlumb Community Edition
 *
 * Provides a way to visually connect elements on an HTML page, using SVG.
 * 
 * This file contains the 'vanilla' adapter - having no external dependencies other than bundled libs.
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
    var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil,
        _jk = root.Katavorio, _jg = root.Biltong;

    var _getDragManager = function (instance, category) {

        category = category || "main";
        var key = "_katavorio_" + category;
        var k = instance[key],
            e = instance.getEventManager();

        if (!k) {
            k = new _jk({
                bind: e.on,
                unbind: e.off,
                getSize: _jp.getSize,
                getConstrainingRectangle:function(el) {
                    return [ el.parentNode.scrollWidth, el.parentNode.scrollHeight ];
                },
                getPosition: function (el, relativeToRoot) {
                    // if this is a nested draggable then compute the offset against its own offsetParent, otherwise
                    // compute against the Container's origin. see also the getUIPosition method below.
                    var o = instance.getOffset(el, relativeToRoot, el._katavorioDrag ? el.offsetParent : null);
                    return [o.left, o.top];
                },
                setPosition: function (el, xy) {
                    el.style.left = xy[0] + "px";
                    el.style.top = xy[1] + "px";
                },
                addClass: _jp.addClass,
                removeClass: _jp.removeClass,
                intersects: _jg.intersects,
                indexOf: function(l, i) { return l.indexOf(i); },
                scope:instance.getDefaultScope(),
                css: {
                    noSelect: instance.dragSelectClass,
                    droppable: "jtk-droppable",
                    draggable: "jtk-draggable",
                    drag: "jtk-drag",
                    selected: "jtk-drag-selected",
                    active: "jtk-drag-active",
                    hover: "jtk-drag-hover",
                    ghostProxy:"jtk-ghost-proxy"
                }
            });
            k.setZoom(instance.getZoom());
            instance[key] = k;
            instance.bind("zoom", k.setZoom);
        }
        return k;
    };

    var _animProps = function (o, p) {
        var _one = function (pName) {
            if (p[pName] != null) {
                if (_ju.isString(p[pName])) {
                    var m = p[pName].match(/-=/) ? -1 : 1,
                        v = p[pName].substring(2);
                    return o[pName] + (m * v);
                }
                else {
                    return p[pName];
                }
            }
            else {
                return o[pName];
            }
        };
        return [ _one("left"), _one("top") ];
    };

    _jp.extend(root.jsPlumbInstance.prototype, {

        animationSupported:true,
        getElement: function (el) {
            if (el == null) {
                return null;
            }
            // here we pluck the first entry if el was a list of entries.
            // this is not my favourite thing to do, but previous versions of
            // jsplumb supported jquery selectors, and it is possible a selector
            // will be passed in here.
            el = typeof el === "string" ? el : el.length != null && el.enctype == null ? el[0] : el;
            return typeof el === "string" ? document.getElementById(el) : el;
        },
        removeElement: function (element) {
            _getDragManager(this).elementRemoved(element);
            this.getEventManager().remove(element);
        },
        //
        // this adapter supports a rudimentary animation function. no easing is supported.  only
        // left/top properties are supported. property delta args are expected to be in the form
        //
        // +=x.xxxx
        //
        // or
        //
        // -=x.xxxx
        //
        doAnimate: function (el, properties, options) {
            options = options || {};
            var o = this.getOffset(el),
                ap = _animProps(o, properties),
                ldist = ap[0] - o.left,
                tdist = ap[1] - o.top,
                d = options.duration || 250,
                step = 15, steps = d / step,
                linc = (step / d) * ldist,
                tinc = (step / d) * tdist,
                idx = 0,
                _int = setInterval(function () {
                    _jp.setPosition(el, {
                        left: o.left + (linc * (idx + 1)),
                        top: o.top + (tinc * (idx + 1))
                    });
                    if (options.step != null) {
                        options.step(idx, Math.ceil(steps));
                    }
                    idx++;
                    if (idx >= steps) {
                        window.clearInterval(_int);
                        if (options.complete != null) {
                            options.complete();
                        }
                    }
                }, step);
        },
        // DRAG/DROP
        destroyDraggable: function (el, category) {
            _getDragManager(this, category).destroyDraggable(el);
        },
        destroyDroppable: function (el, category) {
            _getDragManager(this, category).destroyDroppable(el);
        },
        initDraggable: function (el, options, category) {
            _getDragManager(this, category).draggable(el, options);
        },
        initDroppable: function (el, options, category) {
            _getDragManager(this, category).droppable(el, options);
        },
        isAlreadyDraggable: function (el) {
            return el._katavorioDrag != null;
        },
        isDragSupported: function (el, options) {
            return true;
        },
        isDropSupported: function (el, options) {
            return true;
        },
        isElementDraggable: function (el) {
            el = _jp.getElement(el);
            return el._katavorioDrag && el._katavorioDrag.isEnabled();
        },
        getDragObject: function (eventArgs) {
            return eventArgs[0].drag.getDragElement();
        },
        getDragScope: function (el) {
            return el._katavorioDrag && el._katavorioDrag.scopes.join(" ") || "";
        },
        getDropEvent: function (args) {
            return args[0].e;
        },
        getUIPosition: function (eventArgs, zoom) {
            // here the position reported to us by Katavorio is relative to the element's offsetParent. For top
            // level nodes that is fine, but if we have a nested draggable then its offsetParent is actually
            // not going to be the jsplumb container; it's going to be some child of that element. In that case
            // we want to adjust the UI position to account for the offsetParent's position relative to the Container
            // origin.
            var el = eventArgs[0].el;
            if (el.offsetParent == null) {
                return null;
            }
            var finalPos = eventArgs[0].finalPos || eventArgs[0].pos;
            var p = { left:finalPos[0], top:finalPos[1] };
            if (el._katavorioDrag && el.offsetParent !== this.getContainer()) {
                var oc = this.getOffset(el.offsetParent);
                p.left += oc.left;
                p.top += oc.top;
            }
            return p;
        },
        setDragFilter: function (el, filter, _exclude) {
            if (el._katavorioDrag) {
                el._katavorioDrag.setFilter(filter, _exclude);
            }
        },
        setElementDraggable: function (el, draggable) {
            el = _jp.getElement(el);
            if (el._katavorioDrag) {
                el._katavorioDrag.setEnabled(draggable);
            }
        },
        setDragScope: function (el, scope) {
            if (el._katavorioDrag) {
                el._katavorioDrag.k.setDragScope(el, scope);
            }
        },
        setDropScope:function(el, scope) {
            if (el._katavorioDrop && el._katavorioDrop.length > 0) {
                el._katavorioDrop[0].k.setDropScope(el, scope);
            }
        },
        addToPosse:function(el, spec) {
            var specs = Array.prototype.slice.call(arguments, 1);
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) {
                _el = [ _jp.getElement(_el) ];
                _el.push.apply(_el, specs );
                dm.addToPosse.apply(dm, _el);
            });
        },
        setPosse:function(el, spec) {
            var specs = Array.prototype.slice.call(arguments, 1);
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) {
                _el = [ _jp.getElement(_el) ];
                _el.push.apply(_el, specs );
                dm.setPosse.apply(dm, _el);
            });
        },
        removeFromPosse:function(el, posseId) {
            var specs = Array.prototype.slice.call(arguments, 1);
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) {
                _el = [ _jp.getElement(_el) ];
                _el.push.apply(_el, specs );
                dm.removeFromPosse.apply(dm, _el);
            });
        },
        removeFromAllPosses:function(el) {
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) { dm.removeFromAllPosses(_jp.getElement(_el)); });
        },
        setPosseState:function(el, posseId, state) {
            var dm = _getDragManager(this);
            _jp.each(el, function(_el) { dm.setPosseState(_jp.getElement(_el), posseId, state); });
        },
        dragEvents: {
            'start': 'start', 'stop': 'stop', 'drag': 'drag', 'step': 'step',
            'over': 'over', 'out': 'out', 'drop': 'drop', 'complete': 'complete',
            'beforeStart':'beforeStart'
        },
        animEvents: {
            'step': "step", 'complete': 'complete'
        },
        stopDrag: function (el) {
            if (el._katavorioDrag) {
                el._katavorioDrag.abort();
            }
        },
        addToDragSelection: function (spec) {
            _getDragManager(this).select(spec);
        },
        removeFromDragSelection: function (spec) {
            _getDragManager(this).deselect(spec);
        },
        clearDragSelection: function () {
            _getDragManager(this).deselectAll();
        },
        trigger: function (el, event, originalEvent, payload) {
            this.getEventManager().trigger(el, event, originalEvent, payload);
        },
        doReset:function() {
            // look for katavorio instances and reset each one if found.
            for (var key in this) {
                if (key.indexOf("_katavorio_") === 0) {
                    this[key].reset();
                }
            }
        }
    });

    var ready = function (f) {
        var _do = function () {
            if (/complete|loaded|interactive/.test(document.readyState) && typeof(document.body) !== "undefined" && document.body != null) {
                f();
            }
            else {
                setTimeout(_do, 9);
            }
        };

        _do();
    };
    ready(_jp.init);

}).call(typeof window !== 'undefined' ? window : this);

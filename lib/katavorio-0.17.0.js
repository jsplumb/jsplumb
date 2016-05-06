/**
 drag/drop functionality for use with jsPlumb but with
 no knowledge of jsPlumb. supports multiple scopes (separated by whitespace), dragging
 multiple elements, constrain to parent, drop filters, drag start filters, custom
 css classes.

 a lot of the functionality of this script is expected to be plugged in:

 addClass
 removeClass

 addEvent
 removeEvent

 getPosition
 setPosition
 getSize

 indexOf
 intersects

 the name came from here:

 http://mrsharpoblunto.github.io/foswig.js/

 copyright 2016 jsPlumb
 */

;(function() {

    "use strict";
    var root = this;

    var _suggest = function(list, item, head) {
        if (list.indexOf(item) === -1) {
            head ? list.unshift(item) : list.push(item);
            return true;
        }
        return false;
    };

    var _vanquish = function(list, item) {
        var idx = list.indexOf(item);
        if (idx != -1) list.splice(idx, 1);
    };

    var _difference = function(l1, l2) {
        var d = [];
        for (var i = 0; i < l1.length; i++) {
            if (l2.indexOf(l1[i]) == -1)
                d.push(l1[i]);
        }
        return d;
    };

    var _isString = function(f) {
        return f == null ? false : (typeof f === "string" || f.constructor == String);
    };

    var getOffsetRect = function (elem) {
        // (1)
        var box = elem.getBoundingClientRect(),
            body = document.body,
            docElem = document.documentElement,
        // (2)
            scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
            scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
        // (3)
            clientTop = docElem.clientTop || body.clientTop || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
        // (4)
            top  = box.top +  scrollTop - clientTop,
            left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    };

    var matchesSelector = function(el, selector, ctx) {
        ctx = ctx || el.parentNode;
        var possibles = ctx.querySelectorAll(selector);
        for (var i = 0; i < possibles.length; i++) {
            if (possibles[i] === el)
                return true;
        }
        return false;
    };

    var iev = (function() {
            var rv = -1;
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent,
                    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                    rv = parseFloat(RegExp.$1);
            }
            return rv;
        })(),
        DEFAULT_GRID_X = 50,
        DEFAULT_GRID_Y = 50,
        isIELT9 = iev > -1 && iev < 9,
        isIE9 = iev == 9,
        _pl = function(e) {
            if (isIELT9) {
                return [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
            }
            else {
                var ts = _touches(e), t = _getTouch(ts, 0);
                // for IE9 pageX might be null if the event was synthesized. We try for pageX/pageY first,
                // falling back to clientX/clientY if necessary. In every other browser we want to use pageX/pageY.
                return isIE9 ? [t.pageX || t.clientX, t.pageY || t.clientY] : [t.pageX, t.pageY];
            }
        },
        _getTouch = function(touches, idx) { return touches.item ? touches.item(idx) : touches[idx]; },
        _touches = function(e) {
            return e.touches && e.touches.length > 0 ? e.touches :
                    e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches :
                    e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches :
                [ e ];
        },
        _classes = {
            draggable:"katavorio-draggable",    // draggable elements
            droppable:"katavorio-droppable",    // droppable elements
            drag : "katavorio-drag",            // elements currently being dragged
            selected:"katavorio-drag-selected", // elements in current drag selection
            active : "katavorio-drag-active",   // droppables that are targets of a currently dragged element
            hover : "katavorio-drag-hover",     // droppables over which a matching drag element is hovering
            noSelect : "katavorio-drag-no-select", // added to the body to provide a hook to suppress text selection
            ghostProxy:"katavorio-ghost-proxy"  // added to a ghost proxy element in use when a drag has exited the bounds of its parent.
        },
        _defaultScope = "katavorio-drag-scope",
        _events = [ "stop", "start", "drag", "drop", "over", "out", "beforeStart" ],
        _devNull = function() {},
        _true = function() { return true; },
        _foreach = function(l, fn, from) {
            for (var i = 0; i < l.length; i++) {
                if (l[i] != from)
                    fn(l[i]);
            }
        },
        _setDroppablesActive = function(dd, val, andHover, drag) {
            _foreach(dd, function(e) {
                e.setActive(val);
                if (val) e.updatePosition();
                if (andHover) e.setHover(drag, val);
            });
        },
        _each = function(obj, fn) {
            if (obj == null) return;
            obj = !_isString(obj) && (obj.tagName == null && obj.length != null) ? obj : [ obj ];
            for (var i = 0; i < obj.length; i++)
                fn.apply(obj[i], [ obj[i] ]);
        },
        _consume = function(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
                e.preventDefault();
            }
            else {
                e.returnValue = false;
            }
        },
        _defaultInputFilterSelector = "input,textarea,select,button,option",
    //
    // filters out events on all input elements, like textarea, checkbox, input, select.
        _inputFilter = function(e, el, _katavorio) {
            var t = e.srcElement || e.target;
            return !matchesSelector(t, _katavorio.getInputFilterSelector(), el);
        };

    var Super = function(el, params, css, scope) {
        this.params = params || {};
        this.el = el;
        this.params.addClass(this.el, this._class);
        this.uuid = _uuid();
        var enabled = true;
        this.setEnabled = function(e) { enabled = e; };
        this.isEnabled = function() { return enabled; };
        this.toggleEnabled = function() { enabled = !enabled; };
        this.setScope = function(scopes) {
            this.scopes = scopes ? scopes.split(/\s+/) : [ scope ];
        };
        this.addScope = function(scopes) {
            var m = {};
            _each(this.scopes, function(s) { m[s] = true;});
            _each(scopes ? scopes.split(/\s+/) : [], function(s) { m[s] = true;});
            this.scopes = [];
            for (var i in m) this.scopes.push(i);
        };
        this.removeScope = function(scopes) {
            var m = {};
            _each(this.scopes, function(s) { m[s] = true;});
            _each(scopes ? scopes.split(/\s+/) : [], function(s) { delete m[s];});
            this.scopes = [];
            for (var i in m) this.scopes.push(i);
        };
        this.toggleScope = function(scopes) {
            var m = {};
            _each(this.scopes, function(s) { m[s] = true;});
            _each(scopes ? scopes.split(/\s+/) : [], function(s) {
                if (m[s]) delete m[s];
                else m[s] = true;
            });
            this.scopes = [];
            for (var i in m) this.scopes.push(i);
        };
        this.setScope(params.scope);
        this.k = params.katavorio;
        return params.katavorio;
    };

    var TRUE = function() { return true; };
    var FALSE = function() { return false; };

    var Drag = function(el, params, css, scope) {
        this._class = css.draggable;
        var k = Super.apply(this, arguments);
        this.rightButtonCanDrag = this.params.rightButtonCanDrag;
        var downAt = [0,0], posAtDown = null, pagePosAtDown = null, pageDelta = [0,0], moving = false,
            consumeStartEvent = this.params.consumeStartEvent !== false,
            dragEl = this.el,
            clone = this.params.clone,
            scroll = this.params.scroll,
            _multipleDrop = params.multipleDrop !== false,
            isConstrained = false,
            useGhostProxy = params.ghostProxy === true ? TRUE : params.ghostProxy && typeof params.ghostProxy === "function" ? params.ghostProxy : FALSE,
            ghostProxy = function(el) { return el.cloneNode(true); };

        var snapThreshold = params.snapThreshold || 5,
            _snap = function(pos, x, y, thresholdX, thresholdY) {
                thresholdX = thresholdX || snapThreshold;
                thresholdY = thresholdY || snapThreshold;
                var _dx = Math.floor(pos[0] / x),
                    _dxl = x * _dx,
                    _dxt = _dxl + x,
                    _x = Math.abs(pos[0] - _dxl) <= thresholdX ? _dxl : Math.abs(_dxt - pos[0]) <= thresholdX ? _dxt : pos[0];

                var _dy = Math.floor(pos[1] / y),
                    _dyl = y * _dy,
                    _dyt = _dyl + y,
                    _y = Math.abs(pos[1] - _dyl) <= thresholdY ? _dyl : Math.abs(_dyt - pos[1]) <= thresholdY ? _dyt : pos[1];

                return [ _x, _y];
            };

        this.posses = [];
        this.posseRoles = {};

        this.toGrid = function(pos) {
            if (this.params.grid == null) {
                return pos;
            }
            else {
                return _snap(pos, this.params.grid[0], this.params.grid[1]);
            }
        };

        this.snap = function(x, y) {
            if (dragEl == null) return;
            x = x || (this.params.grid ? this.params.grid[0] : DEFAULT_GRID_X);
            y = y || (this.params.grid ? this.params.grid[1] : DEFAULT_GRID_Y);
            var p = this.params.getPosition(dragEl);
            this.params.setPosition(dragEl, _snap(p, x, y, x, y));
        };

        this.setUseGhostProxy = function(val) {
            useGhostProxy = val ? TRUE : FALSE;
        };

        var constrain;
        var negativeFilter = function(pos) {
            return (params.allowNegative === false) ? [ Math.max (0, pos[0]), Math.max(0, pos[1]) ] : pos;
        };

        var _setConstrain = function(value) {
            constrain = typeof value === "function" ? value : value ? function(pos) {
                return negativeFilter([
                    Math.max(0, Math.min(constrainRect.w - this.size[0], pos[0])),
                    Math.max(0, Math.min(constrainRect.h - this.size[1], pos[1]))
                ]);
            }.bind(this) : function(pos) { return negativeFilter(pos); };
        }.bind(this);

        _setConstrain(typeof this.params.constrain === "function" ? this.params.constrain  : (this.params.constrain || this.params.containment));


        /**
         * Sets whether or not the Drag is constrained. A value of 'true' means constrain to parent bounds; a function
         * will be executed and returns true if the position is allowed.
         * @param value
         */
        this.setConstrain = function(value) {
            _setConstrain(value);
        };

        var revertFunction;
        /**
         * Sets a function to call on drag stop, which, if it returns true, indicates that the given element should
         * revert to its position before the previous drag.
         * @param fn
         */
        this.setRevert = function(fn) {
            revertFunction = fn;
        };

        var _assignId = function(obj) {
                if (typeof obj == "function") {
                    obj._katavorioId = _uuid();
                    return obj._katavorioId;
                } else {
                    return obj;
                }
            },
        // a map of { spec -> [ fn, exclusion ] } entries.
            _filters = {},
            _testFilter = function(e) {
                for (var key in _filters) {
                    var f = _filters[key];
                    var rv = f[0](e);
                    if (f[1]) rv = !rv;
                    if (!rv) return false;
                }
                return true;
            },
            _setFilter = this.setFilter = function(f, _exclude) {
                if (f) {
                    var key = _assignId(f);
                    _filters[key] = [
                        function(e) {
                            var t = e.srcElement || e.target, m;
                            if (_isString(f)) {
                                m = matchesSelector(t, f, el);
                            }
                            else if (typeof f === "function") {
                                m = f(e, el);
                            }
                            return m;
                        },
                            _exclude !== false
                    ];

                }
            },
            _addFilter = this.addFilter = _setFilter,
            _removeFilter = this.removeFilter = function(f) {
                var key = typeof f == "function" ? f._katavorioId : f;
                delete _filters[key];
            };

        this.clearAllFilters = function() {
            _filters = {};
        };

        this.canDrag = this.params.canDrag || _true;

        var constrainRect,
            matchingDroppables = [], intersectingDroppables = [];

        this.downListener = function(e) {
            var isNotRightClick = this.rightButtonCanDrag || (e.which !== 3 && e.button !== 2);
            if (isNotRightClick && this.isEnabled() && this.canDrag()) {
                var _f =  _testFilter(e) && _inputFilter(e, this.el, this.k);
                if (_f) {
                    if (!clone)
                        dragEl = this.el;
                    else {
                        dragEl = this.el.cloneNode(true);
                        dragEl.setAttribute("id", null);
                        dragEl.style.position = "absolute";
                        // the clone node is added to the body; getOffsetRect gives us a value
                        // relative to the body.
                        var b = getOffsetRect(this.el);
                        dragEl.style.left = b.left + "px";
                        dragEl.style.top = b.top + "px";
                        document.body.appendChild(dragEl);
                    }
                    consumeStartEvent && _consume(e);
                    downAt = _pl(e);
                    //
                    this.params.bind(document, "mousemove", this.moveListener);
                    this.params.bind(document, "mouseup", this.upListener);
                    k.markSelection(this);
                    k.markPosses(this);
                    this.params.addClass(document.body, css.noSelect);
                    _dispatch("beforeStart", {el:this.el, pos:posAtDown, e:e, drag:this});
                }
                else if (this.params.consumeFilteredEvents) {
                    _consume(e);
                }
            }
        }.bind(this);

        this.moveListener = function(e) {
            if (downAt) {
                if (!moving) {
                    var _continue = _dispatch("start", {el:this.el, pos:posAtDown, e:e, drag:this});
                    if (_continue !== false) {
                        if (!downAt) return;
                        this.mark(true);
                        moving = true;
                    }
                }

                // it is possible that the start event caused the drag to be aborted. So we check
                // again that we are currently dragging.
                if (downAt) {
                    intersectingDroppables.length = 0;
                    var pos = _pl(e), dx = pos[0] - downAt[0], dy = pos[1] - downAt[1],
                        z = this.params.ignoreZoom ? 1 : k.getZoom();
                    dx /= z;
                    dy /= z;
                    this.moveBy(dx, dy, e);
                    k.updateSelection(dx, dy, this);
                    k.updatePosses(dx, dy, this);
                }
            }
        }.bind(this);

        this.upListener = function(e) {
            if (downAt) {
                downAt = null;
                this.params.unbind(document, "mousemove", this.moveListener);
                this.params.unbind(document, "mouseup", this.upListener);
                this.params.removeClass(document.body, css.noSelect);
                this.unmark(e);
                k.unmarkSelection(this, e);
                k.unmarkPosses(this, e);
                this.stop(e);
                k.notifySelectionDragStop(this, e);
                k.notifyPosseDragStop(this, e);
                moving = false;
                if (clone) {
                    dragEl && dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
                    dragEl = null;
                }

                if (revertFunction && revertFunction(this.el, this.params.getPosition(this.el)) === true) {
                    this.params.setPosition(this.el, posAtDown);
                    _dispatch("revert", this.el);
                }
            }
        }.bind(this);

        this.getFilters = function() { return _filters; };

        this.abort = function() {
            if (downAt != null)
                this.upListener();
        };

        this.getDragElement = function() {
            return dragEl || this.el;
        };

        var listeners = {"start":[], "drag":[], "stop":[], "over":[], "out":[], "beforeStart":[], "revert":[] };
        if (params.events.start) listeners.start.push(params.events.start);
        if (params.events.beforeStart) listeners.beforeStart.push(params.events.beforeStart);
        if (params.events.stop) listeners.stop.push(params.events.stop);
        if (params.events.drag) listeners.drag.push(params.events.drag);
        if (params.events.revert) listeners.revert.push(params.events.revert);

        this.on = function(evt, fn) {
            if (listeners[evt]) listeners[evt].push(fn);
        };

        this.off = function(evt, fn) {
            if (listeners[evt]) {
                var l = [];
                for (var i = 0; i < listeners[evt].length; i++) {
                    if (listeners[evt][i] !== fn) l.push(listeners[evt][i]);
                }
                listeners[evt] = l;
            }
        };

        var _dispatch = function(evt, value) {
            if (listeners[evt]) {
                for (var i = 0; i < listeners[evt].length; i++) {
                    try {
                        listeners[evt][i](value);
                    }
                    catch (e) { }
                }
            }
        };

        this.notifyStart = function(e) {
            _dispatch("start", {el:this.el, pos:this.params.getPosition(dragEl), e:e, drag:this});
        };

        this.stop = function(e, force) {
            if (force || moving) {
                var positions = [],
                    sel = k.getSelection(),
                    dPos = this.params.getPosition(dragEl);

                if (sel.length > 1) {
                    for (var i = 0; i < sel.length; i++) {
                        var p = this.params.getPosition(sel[i].el);
                        positions.push([ sel[i].el, { left: p[0], top: p[1] }, sel[i] ]);
                    }
                }
                else {
                    positions.push([ dragEl, {left:dPos[0], top:dPos[1]}, this ]);
                }

                _dispatch("stop", {
                    el: dragEl,
                    pos: ghostProxyOffsets || dPos,
                    finalPos:dPos,
                    e: e,
                    drag: this,
                    selection:positions
                });
            }
        };

        this.mark = function(andNotify) {
            posAtDown = this.params.getPosition(dragEl);
            pagePosAtDown = this.params.getPosition(dragEl, true);
            pageDelta = [pagePosAtDown[0] - posAtDown[0], pagePosAtDown[1] - posAtDown[1]];
            this.size = this.params.getSize(dragEl);
            matchingDroppables = k.getMatchingDroppables(this);
            _setDroppablesActive(matchingDroppables, true, false, this);
            this.params.addClass(dragEl, this.params.dragClass || css.drag);
            //if (this.params.constrain || this.params.containment) {
            var cs = this.params.getSize(dragEl.parentNode);
            constrainRect = { w:cs[0], h:cs[1] };
            //}
            if (andNotify) {
                k.notifySelectionDragStart(this);
            }
        };
        var ghostProxyOffsets;
        this.unmark = function(e, doNotCheckDroppables) {
            _setDroppablesActive(matchingDroppables, false, true, this);


            if (isConstrained && useGhostProxy(this.el)) {
                ghostProxyOffsets = [dragEl.offsetLeft, dragEl.offsetTop];
                this.el.parentNode.removeChild(dragEl);
                dragEl = this.el;
            }
            else {
                ghostProxyOffsets = null;
            }

            this.params.removeClass(dragEl, this.params.dragClass || css.drag);
            matchingDroppables.length = 0;
            isConstrained = false;
            if (!doNotCheckDroppables) {
                if (intersectingDroppables.length > 0 && ghostProxyOffsets) {
                    params.setPosition(this.el, ghostProxyOffsets);
                }
                for (var i = 0; i < intersectingDroppables.length; i++) {
                    var retVal = intersectingDroppables[i].drop(this, e);
                    if (retVal === true) break;
                }
            }
        };
        this.moveBy = function(dx, dy, e) {
            intersectingDroppables.length = 0;
            var desiredLoc = this.toGrid([posAtDown[0] + dx, posAtDown[1] + dy]),
                cPos = constrain(desiredLoc, dragEl);

            if (useGhostProxy(this.el)) {
                if (desiredLoc[0] != cPos[0] || desiredLoc[1] != cPos[1]) {
                    if (!isConstrained) {
                        var gp = ghostProxy(this.el);
                        params.addClass(gp, _classes.ghostProxy);
                        this.el.parentNode.appendChild(gp);
                        dragEl = gp;
                        isConstrained = true;
                    }
                    cPos = desiredLoc;
                }
                else {
                    if (isConstrained) {
                        this.el.parentNode.removeChild(dragEl);
                        dragEl = this.el;
                        isConstrained = false;
                    }
                }
            }

            var rect = { x:cPos[0], y:cPos[1], w:this.size[0], h:this.size[1]},
                pageRect = { x:rect.x + pageDelta[0], y:rect.y + pageDelta[1], w:rect.w, h:rect.h},
                focusDropElement = null;



            this.params.setPosition(dragEl, cPos);
            for (var i = 0; i < matchingDroppables.length; i++) {
                var r2 = { x:matchingDroppables[i].pagePosition[0], y:matchingDroppables[i].pagePosition[1], w:matchingDroppables[i].size[0], h:matchingDroppables[i].size[1]};
                if (this.params.intersects(pageRect, r2) && (_multipleDrop || focusDropElement == null || focusDropElement == matchingDroppables[i].el) && matchingDroppables[i].canDrop(this)) {
                    if (!focusDropElement) focusDropElement = matchingDroppables[i].el;
                    intersectingDroppables.push(matchingDroppables[i]);
                    matchingDroppables[i].setHover(this, true, e);
                }
                else if (matchingDroppables[i].isHover()) {
                    matchingDroppables[i].setHover(this, false, e);
                }
            }

            _dispatch("drag", {el:this.el, pos:cPos, e:e, drag:this});

            /* test to see if the parent needs to be scrolled (future)
             if (scroll) {
             var pnsl = dragEl.parentNode.scrollLeft, pnst = dragEl.parentNode.scrollTop;
             console.log("scroll!", pnsl, pnst);
             }*/
        };
        this.destroy = function() {
            this.params.unbind(this.el, "mousedown", this.downListener);
            this.params.unbind(document, "mousemove", this.moveListener);
            this.params.unbind(document, "mouseup", this.upListener);
            this.downListener = null;
            this.upListener = null;
            this.moveListener = null;
        };

        // init:register mousedown, and perhaps set a filter
        this.params.bind(this.el, "mousedown", this.downListener);

        // if handle provded, use that.  otherwise, try to set a filter.
        // note that a `handle` selector always results in filterExclude being set to false, ie.
        // the selector defines the handle element(s).
        if (this.params.handle)
            _setFilter(this.params.handle, false);
        else
            _setFilter(this.params.filter, this.params.filterExclude);
    };

    var Drop = function(el, params, css, scope) {
        this._class = css.droppable;
        this.params = params || {};
        this._activeClass = this.params.activeClass || css.active;
        this._hoverClass = this.params.hoverClass || css.hover;
        Super.apply(this, arguments);
        var hover = false;
        this.allowLoopback = this.params.allowLoopback !== false;

        this.setActive = function(val) {
            this.params[val ? "addClass" : "removeClass"](this.el, this._activeClass);
        };

        this.updatePosition = function() {
            this.position = this.params.getPosition(this.el);
            this.pagePosition = this.params.getPosition(this.el, true);
            this.size = this.params.getSize(this.el);
        };

        this.canDrop = this.params.canDrop || function(drag) {
            return true;
        };

        this.isHover = function() { return hover; };

        this.setHover = function(drag, val, e) {
            // if turning off hover but this was not the drag that caused the hover, ignore.
            if (val || this.el._katavorioDragHover == null || this.el._katavorioDragHover == drag.el._katavorio) {
                this.params[val ? "addClass" : "removeClass"](this.el, this._hoverClass);
                //this.el._katavorioDragHover = val ? drag.el._katavorio : null;
                this.el._katavorioDragHover = val ? drag.el._katavorio : null;
                if (hover !== val)
                    this.params.events[val ? "over" : "out"]({el:this.el, e:e, drag:drag, drop:this});
                hover = val;
            }
        };

        this.drop = function(drag, event) {
            return this.params.events["drop"]({ drag:drag, e:event, drop:this });
        };

        this.destroy = function() {
            this._class = null;
            this._activeClass = null;
            this._hoverClass = null;
            //this.params = null;
            hover = null;
            //this.el = null;
        };
    };

    var _uuid = function() {
        return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }));
    };

    var _gel = function(el) {
        if (el == null) return null;
        el = (typeof el === "string" || el.constructor == String)  ? document.getElementById(el) : el;
        if (el == null) return null;
        el._katavorio = el._katavorio || _uuid();
        return el;
    };

    root.Katavorio = function(katavorioParams) {

        var _selection = [],
            _selectionMap = {};

        this._dragsByScope = {};
        this._dropsByScope = {};
        var _zoom = 1,
            _reg = function(obj, map) {
                _each(obj, function(_obj) {
                    for(var i = 0; i < _obj.scopes.length; i++) {
                        map[_obj.scopes[i]] = map[_obj.scopes[i]] || [];
                        map[_obj.scopes[i]].push(_obj);
                    }
                });
            },
            _unreg = function(obj, map) {
                var c = 0;
                _each(obj, function(_obj) {
                    for(var i = 0; i < _obj.scopes.length; i++) {
                        if (map[_obj.scopes[i]]) {
                            var idx = katavorioParams.indexOf(map[_obj.scopes[i]], _obj);
                            if (idx != -1) {
                                map[_obj.scopes[i]].splice(idx, 1);
                                c++;
                            }
                        }
                    }
                });

                return c > 0 ;
            },
            _getMatchingDroppables = this.getMatchingDroppables = function(drag) {
                var dd = [], _m = {};
                for (var i = 0; i < drag.scopes.length; i++) {
                    var _dd = this._dropsByScope[drag.scopes[i]];
                    if (_dd) {
                        for (var j = 0; j < _dd.length; j++) {
                            if (_dd[j].canDrop(drag) &&  !_m[_dd[j].uuid] && (_dd[j].allowLoopback || _dd[j].el !== drag.el)) {
                                _m[_dd[j].uuid] = true;
                                dd.push(_dd[j]);
                            }
                        }
                    }
                }
                return dd;
            },
            _prepareParams = function(p) {
                p = p || {};
                var _p = {
                    events:{}
                }, i;
                for (i in katavorioParams) _p[i] = katavorioParams[i];
                for (i in p) _p[i] = p[i];
                // events

                for (i = 0; i < _events.length; i++) {
                    _p.events[_events[i]] = p[_events[i]] || _devNull;
                }
                _p.katavorio = this;
                return _p;
            }.bind(this),
            _mistletoe = function(existingDrag, params) {
                for (var i = 0; i < _events.length; i++) {
                    if (params[_events[i]]) {
                        existingDrag.on(_events[i], params[_events[i]]);
                    }
                }
            }.bind(this),
            _css = {},
            overrideCss = katavorioParams.css || {},
            _scope = katavorioParams.scope || _defaultScope;

        // prepare map of css classes based on defaults frst, then optional overrides
        for (var i in _classes) _css[i] = _classes[i];
        for (var i in overrideCss) _css[i] = overrideCss[i];

        var inputFilterSelector = katavorioParams.inputFilterSelector || _defaultInputFilterSelector;
        /**
         * Gets the selector identifying which input elements to filter from drag events.
         * @method getInputFilterSelector
         * @return {String} Current input filter selector.
         */
        this.getInputFilterSelector = function() { return inputFilterSelector; };

        /**
         * Sets the selector identifying which input elements to filter from drag events.
         * @method setInputFilterSelector
         * @param {String} selector Input filter selector to set.
         * @return {Katavorio} Current instance; method may be chained.
         */
        this.setInputFilterSelector = function(selector) {
            inputFilterSelector = selector;
            return this;
        };

        this.draggable = function(el, params) {
            var o = [];
            _each(el, function(_el) {
                _el = _gel(_el);
                if (_el != null) {
                    if (_el._katavorioDrag == null) {
                        var p = _prepareParams(params);
                        _el._katavorioDrag = new Drag(_el, p, _css, _scope);
                        _reg(_el._katavorioDrag, this._dragsByScope);
                        o.push(_el._katavorioDrag);
                        katavorioParams.addClass(_el, _css.draggable);
                    }
                    else {
                        _mistletoe(_el._katavorioDrag, params);
                    }
                }
            }.bind(this));
            return o;

        };

        this.droppable = function(el, params) {
            var o = [];
            _each(el, function(_el) {
                _el = _gel(_el);
                if (_el != null) {
                    var drop = new Drop(_el, _prepareParams(params), _css, _scope);
                    _el._katavorioDrop = _el._katavorioDrop || [];
                    _el._katavorioDrop.push(drop);
                    _reg(drop, this._dropsByScope);
                    o.push(drop);
                    katavorioParams.addClass(_el, _css.droppable);
                }
            }.bind(this));
            return o;
        };

        /**
         * @name Katavorio#select
         * @function
         * @desc Adds an element to the current selection (for multiple node drag)
         * @param {Element|String} DOM element - or id of the element - to add.
         */
        this.select = function(el) {
            _each(el, function() {
                var _el = _gel(this);
                if (_el && _el._katavorioDrag) {
                    if (!_selectionMap[_el._katavorio]) {
                        _selection.push(_el._katavorioDrag);
                        _selectionMap[_el._katavorio] = [ _el, _selection.length - 1 ];
                        katavorioParams.addClass(_el, _css.selected);
                    }
                }
            });
            return this;
        };

        /**
         * @name Katavorio#deselect
         * @function
         * @desc Removes an element from the current selection (for multiple node drag)
         * @param {Element|String} DOM element - or id of the element - to remove.
         */
        this.deselect = function(el) {
            _each(el, function() {
                var _el = _gel(this);
                if (_el && _el._katavorio) {
                    var e = _selectionMap[_el._katavorio];
                    if (e) {
                        var _s = [];
                        for (var i = 0; i < _selection.length; i++)
                            if (_selection[i].el !== _el) _s.push(_selection[i]);
                        _selection = _s;
                        delete _selectionMap[_el._katavorio];
                        katavorioParams.removeClass(_el, _css.selected);
                    }
                }
            });
            return this;
        };

        this.deselectAll = function() {
            for (var i in _selectionMap) {
                var d = _selectionMap[i];
                katavorioParams.removeClass(d[0], _css.selected);
            }

            _selection.length = 0;
            _selectionMap = {};
        };

        this.markSelection = function(drag) {
            _foreach(_selection, function(e) { e.mark(); }, drag);
        };

        this.markPosses = function(drag) {
            if (drag.posses) {
                _each(drag.posses, function(p) {
                    if (drag.posseRoles[p] && _posses[p]) {
                        _foreach(_posses[p].members, function (d) {
                            d.mark();
                        }, drag);
                    }
                })
            }
        };

        this.unmarkSelection = function(drag, event) {
            _foreach(_selection, function(e) { e.unmark(event); }, drag);
        };

        this.unmarkPosses = function(drag, event) {
            if (drag.posses) {
                _each(drag.posses, function(p) {
                    if (drag.posseRoles[p] && _posses[p]) {
                        _foreach(_posses[p].members, function (d) {
                            d.unmark(event, true);
                        }, drag);
                    }
                });
            }
        };

        this.getSelection = function() { return _selection.slice(0); };

        this.updateSelection = function(dx, dy, drag) {
            _foreach(_selection, function(e) { e.moveBy(dx, dy); }, drag);
        };

        var _posseAction = function(fn, drag) {
            if (drag.posses) {
                _each(drag.posses, function(p) {
                    if (drag.posseRoles[p] && _posses[p]) {
                        _foreach(_posses[p].members, function (e) {
                            fn(e);
                        }, drag);
                    }
                });
            }
        };

        this.updatePosses = function(dx, dy, drag) {
            _posseAction(function(e) { e.moveBy(dx, dy); }, drag);
        };

        this.notifyPosseDragStop = function(drag, evt) {
            _posseAction(function(e) { e.stop(evt, true); }, drag);
        };

        this.notifySelectionDragStop = function(drag, evt) {
            _foreach(_selection, function(e) { e.stop(evt, true); }, drag);
        };

        this.notifySelectionDragStart = function(drag, evt) {
            _foreach(_selection, function(e) { e.notifyStart(evt);}, drag);
        };

        this.setZoom = function(z) { _zoom = z; };
        this.getZoom = function() { return _zoom; };

        // does the work of changing scopes
        var _scopeManip = function(kObj, scopes, map, fn) {
            _each(kObj, function(_kObj) {
                _unreg(_kObj, map);  // deregister existing scopes
                _kObj[fn](scopes); // set scopes
                _reg(_kObj, map); // register new ones
            });
        };

        _each([ "set", "add", "remove", "toggle"], function(v) {
            this[v + "Scope"] = function(el, scopes) {
                _scopeManip(el._katavorioDrag, scopes, this._dragsByScope, v + "Scope");
                _scopeManip(el._katavorioDrop, scopes, this._dropsByScope, v + "Scope");
            }.bind(this);
            this[v + "DragScope"] = function(el, scopes) {
                _scopeManip(el.constructor === Drag ? el : el._katavorioDrag, scopes, this._dragsByScope, v + "Scope");
            }.bind(this);
            this[v + "DropScope"] = function(el, scopes) {
                _scopeManip(el.constructor === Drop ? el : el._katavorioDrop, scopes, this._dropsByScope, v + "Scope");
            }.bind(this);
        }.bind(this));

        this.snapToGrid = function(x, y) {
            for (var s in this._dragsByScope) {
                _foreach(this._dragsByScope[s], function(d) { d.snap(x, y); });
            }
        };

        this.getDragsForScope = function(s) { return this._dragsByScope[s]; };
        this.getDropsForScope = function(s) { return this._dropsByScope[s]; };

        var _destroy = function(el, type, map) {
            el = _gel(el);
            if (el[type]) {
                if (_unreg(el[type], map)) {
                    _each(el[type], function(kObj) { kObj.destroy() });
                }

                delete el[type];
            }
        };

        this.elementRemoved = function(el) {
            this.destroyDraggable(el);
            this.destroyDroppable(el);
        };

        this.destroyDraggable = function(el) {
            _destroy(el, "_katavorioDrag", this._dragsByScope);
        };

        this.destroyDroppable = function(el) {
            _destroy(el, "_katavorioDrop", this._dropsByScope);
        };

        this.reset = function() {
            this._dragsByScope = {};
            this._dropsByScope = {};
            _selection = [];
            _selectionMap = {};
            _posses = {};
        };

        // ----- groups
        var _posses = {};

        var _processOneSpec = function(el, _spec, dontAddExisting) {
            var posseId = _isString(_spec) ? _spec : _spec.id;
            var active = _isString(_spec) ? true : _spec.active !== false;
            var posse = _posses[posseId] || (function() {
                var g = {name:posseId, members:[]};
                _posses[posseId] = g;
                return g;
            })();
            _each(el, function(_el) {
                if (_el._katavorioDrag) {

                    if (dontAddExisting && _el._katavorioDrag.posseRoles[posse.name] != null) return;

                    _suggest(posse.members, _el._katavorioDrag);
                    _suggest(_el._katavorioDrag.posses, posse.name);
                    _el._katavorioDrag.posseRoles[posse.name] = active;
                }
            });
            return posse;
        };

        /**
         * Add the given element to the posse with the given id, creating the group if it at first does not exist.
         * @method addToPosse
         * @param {Element} el Element to add.
         * @param {String...|Object...} spec Variable args parameters. Each argument can be a either a String, indicating
         * the ID of a Posse to which the element should be added as an active participant, or an Object containing
         * `{ id:"posseId", active:false/true}`. In the latter case, if `active` is not provided it is assumed to be
         * true.
         * @returns {Posse|Posse[]} The Posse(s) to which the element(s) was/were added.
         */
        this.addToPosse = function(el, spec) {

            var posses = [];

            for (var i = 1; i < arguments.length; i++) {
                posses.push(_processOneSpec(el, arguments[i]));
            }

            return posses.length == 1 ? posses[0] : posses;
        };

        /**
         * Sets the posse(s) for the element with the given id, creating those that do not yet exist, and removing from
         * the element any current Posses that are not specified by this method call. This method will not change the
         * active/passive state if it is given a posse in which the element is already a member.
         * @method setPosse
         * @param {Element} el Element to set posse(s) on.
         * @param {String...|Object...} spec Variable args parameters. Each argument can be a either a String, indicating
         * the ID of a Posse to which the element should be added as an active participant, or an Object containing
         * `{ id:"posseId", active:false/true}`. In the latter case, if `active` is not provided it is assumed to be
         * true.
         * @returns {Posse|Posse[]} The Posse(s) to which the element(s) now belongs.
         */
        this.setPosse = function(el, spec) {

            var posses = [];

            for (var i = 1; i < arguments.length; i++) {
                posses.push(_processOneSpec(el, arguments[i], true).name);
            }

            _each(el, function(_el) {
                if (_el._katavorioDrag) {
                    var diff = _difference(_el._katavorioDrag.posses, posses);
                    var p = [];
                    Array.prototype.push.apply(p, _el._katavorioDrag.posses);
                    for (var i = 0; i < diff.length; i++) {
                        this.removeFromPosse(_el, diff[i]);
                    }
                }
            }.bind(this));

            return posses.length == 1 ? posses[0] : posses;
        };

        /**
         * Remove the given element from the given posse(s).
         * @method removeFromPosse
         * @param {Element} el Element to remove.
         * @param {String...} posseId Varargs parameter: one value for each posse to remove the element from.
         */
        this.removeFromPosse = function(el, posseId) {
            if (arguments.length < 2) throw new TypeError("No posse id provided for remove operation");
            for(var i = 1; i < arguments.length; i++) {
                posseId = arguments[i];
                _each(el, function (_el) {
                    if (_el._katavorioDrag && _el._katavorioDrag.posses) {
                        var d = _el._katavorioDrag;
                        _each(posseId, function (p) {
                            _vanquish(_posses[p].members, d);
                            _vanquish(d.posses, p);
                            delete d.posseRoles[p];
                        });
                    }
                });
            }
        };

        /**
         * Remove the given element from all Posses to which it belongs.
         * @method removeFromAllPosses
         * @param {Element|Element[]} el Element to remove from Posses.
         */
        this.removeFromAllPosses = function(el) {
            _each(el, function(_el) {
                if (_el._katavorioDrag && _el._katavorioDrag.posses) {
                    var d = _el._katavorioDrag;
                    _each(d.posses, function(p) {
                        _vanquish(_posses[p].members, d);
                    });
                    d.posses.length = 0;
                    d.posseRoles = {};
                }
            });
        };

        /**
         * Changes the participation state for the element in the Posse with the given ID.
         * @param {Element|Element[]} el Element(s) to change state for.
         * @param {String} posseId ID of the Posse to change element state for.
         * @param {Boolean} state True to make active, false to make passive.
         */
        this.setPosseState = function(el, posseId, state) {
            var posse = _posses[posseId];
            if (posse) {
                _each(el, function(_el) {
                    if (_el._katavorioDrag && _el._katavorioDrag.posses) {
                        _el._katavorioDrag.posseRoles[posse.name] = state;
                    }
                });
            }
        };
    };
}).call(typeof window !== 'undefined' ? window : this);

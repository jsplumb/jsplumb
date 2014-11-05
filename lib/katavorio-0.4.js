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

 copyright 2014 jsPlumb
 */

;(function() {

    "use strict";

    var getOffsetRect = function (elem) {
        // (1)
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docElem = document.documentElement;

        // (2)
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        // (3)
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        // (4)
        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

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
        isIELT9 = iev > -1 && iev < 9,
        _pl = function(e) {
            if (isIELT9) {
                return [ e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop ];
            }
            else {
                var ts = _touches(e), t = _getTouch(ts, 0);
                // this is for iPad. may not fly for Android.
                return [t.pageX, t.pageY];
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
            noSelect : "katavorio-drag-no-select" // added to the body to provide a hook to suppress text selection
        },
        _defaultScope = "katavorio-drag-scope",
        _events = [ "stop", "start", "drag", "drop", "over", "out" ],
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
            obj = (typeof obj !== "string") && (obj.tagName == null && obj.length != null) ? obj : [ obj ];
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
        _defaultInputFilterSelector = "input,textarea,select,button",
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

    var Drag = function(el, params, css, scope) {
        this._class = css.draggable;
        var k = Super.apply(this, arguments);
        this.rightButtonCanDrag = this.params.rightButtonCanDrag;
        var downAt = [0,0], posAtDown = null, moving = false,
            consumeStartEvent = this.params.consumeStartEvent !== false,
            dragEl = this.el,
            clone = this.params.clone;
        this.toGrid = function(pos) {
            return this.params.grid == null ? pos :
                [
                        this.params.grid[0] * Math.floor(pos[0] / this.params.grid[0]),
                        this.params.grid[1] * Math.floor(pos[1] / this.params.grid[1])
                ];
        };

        this.constrain = typeof this.params.constrain === "function" ? this.params.constrain  : (this.params.constrain || this.params.containment) ? function(pos) {
            return [
                Math.max(0, Math.min(constrainRect.w - this.size[0], pos[0])),
                Math.max(0, Math.min(constrainRect.h - this.size[1], pos[1]))
            ];
        } : function(pos) { return pos; };

        var filter = _true,
            filterSpec = "",
            filterExclude = this.params.filterExclude !== false,
            _setFilter = this.setFilter = function(f, _exclude) {
                if (f) {
                    filterSpec = f;
                    filterExclude = _exclude !== false;
                    filter = function(e) {
                        var t = e.srcElement || e.target, ms = matchesSelector(t, f, el);
                        return filterExclude ? !ms : ms;
                    };
                }
            };
        this.canDrag = this.params.canDrag || _true;

        var constrainRect,
            matchingDroppables = [], intersectingDroppables = [];

        this.downListener = function(e) {
            var isNotRightClick = this.rightButtonCanDrag || (e.which !== 3 && e.button !== 2);
            if (isNotRightClick && this.isEnabled() && this.canDrag()) {
                var _f =  filter(e) && _inputFilter(e, this.el, this.k);
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
                    this.params.addClass(document.body, css.noSelect);
                }
                else if (this.params.consumeFilteredEvents) {
                    _consume(e);
                }
            }
        }.bind(this);

        this.moveListener = function(e) {
            if (downAt) {
                if (!moving) {
                    this.params.events["start"]({el:this.el, pos:posAtDown, e:e, drag:this});
                    this.mark();
                    moving = true;
                }

                intersectingDroppables.length = 0;
                var pos = _pl(e), dx = pos[0] - downAt[0], dy = pos[1] - downAt[1],
                    z = this.params.ignoreZoom ? 1 : k.getZoom();
                dx /= z;
                dy /= z;
                this.moveBy(dx, dy, e);
                k.updateSelection(dx, dy, this);
            }
        }.bind(this);

        this.upListener = function(e) {
            downAt = null;
            moving = false;
            this.params.unbind(document, "mousemove", this.moveListener);
            this.params.unbind(document, "mouseup", this.upListener);
            this.params.removeClass(document.body, css.noSelect);
            this.unmark(e);
            k.unmarkSelection(this, e);
            this.stop(e);
            k.notifySelectionDragStop(this, e);
            if (clone) {
                dragEl && dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
                dragEl = null;
            }
        }.bind(this);

        this.getFilter = function() { return filterSpec; };
        this.isFilterExclude = function() { return filterExclude; };

        this.abort = function() {
            if (downAt != null)
                this.upListener();
        };

        this.getDragElement = function() {
            return dragEl || this.el;
        };

        this.stop = function(e) {
            this.params.events["stop"]({el:dragEl, pos:this.params.getPosition(dragEl), e:e, drag:this});
        };

        this.mark = function() {
            posAtDown = this.params.getPosition(dragEl);
            this.size = this.params.getSize(dragEl);
            matchingDroppables = k.getMatchingDroppables(this);
            _setDroppablesActive(matchingDroppables, true, false, this);
            this.params.addClass(dragEl, this.params.dragClass || css.drag);
            if (this.params.constrain || this.params.containment) {
                var cs = this.params.getSize(dragEl.parentNode);
                constrainRect = { w:cs[0], h:cs[1] };
            }
        };
        this.unmark = function(e) {
            _setDroppablesActive(matchingDroppables, false, true, this);
            matchingDroppables.length = 0;
            for (var i = 0; i < intersectingDroppables.length; i++)
                intersectingDroppables[i].drop(this, e);
        };
        this.moveBy = function(dx, dy, e) {
            intersectingDroppables.length = 0;
            var cPos = this.constrain(this.toGrid(([posAtDown[0] + dx, posAtDown[1] + dy])), dragEl),
                rect = { x:cPos[0], y:cPos[1], w:this.size[0], h:this.size[1]};
            this.params.setPosition(dragEl, cPos);
            for (var i = 0; i < matchingDroppables.length; i++) {
                var r2 = { x:matchingDroppables[i].position[0], y:matchingDroppables[i].position[1], w:matchingDroppables[i].size[0], h:matchingDroppables[i].size[1]};
                if (this.params.intersects(rect, r2) && matchingDroppables[i].canDrop(this)) {
                    intersectingDroppables.push(matchingDroppables[i]);
                    matchingDroppables[i].setHover(this, true, e);
                }
                else if (matchingDroppables[i].el._katavorioDragHover) {
                    matchingDroppables[i].setHover(this, false, e);
                }
            }
            this.params.events["drag"]({el:this.el, pos:cPos, e:e, drag:this});
        };
        this.destroy = function() {
            this.params.unbind(this.el, "mousedown", this.downListener);
            this.params.unbind(document, "mousemove", this.moveListener);
            this.params.unbind(document, "mouseup", this.upListener);
            this.downListener = null;
            this.upListener = null;
            this.moveListener = null;
            //this.params = null;
            //this.el = null;
            //dragEl = null;
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
        this._activeClass = params.activeClass || css.active;
        this._hoverClass = params.hoverClass || css.hover;
        Super.apply(this, arguments)
        var hover = false;

        this.setActive = function(val) {
            this.params[val ? "addClass" : "removeClass"](this.el, this._activeClass);
        };

        this.updatePosition = function() {
            this.position = this.params.getPosition(this.el);
            this.size = this.params.getSize(this.el);
        };

        this.canDrop = this.params.canDrop || function(drag) {
            return true;
        };

        this.setHover = function(drag, val, e) {
            // if turning off hover but this was not the drag that caused the hover, ignore.
            if (val || this.el._katavorioDragHover == null || this.el._katavorioDragHover == drag.el._katavorio) {
                this.params[val ? "addClass" : "removeClass"](this.el, this._hoverClass);
                this.el._katavorioDragHover = val ? drag.el._katavorio : null;
                if (hover !== val)
                    this.params.events[val ? "over" : "out"]({el:this.el, e:e, drag:drag, drop:this});
                hover = val;
            }
        };

        this.drop = function(drag, event) {
            this.params.events["drop"]({ drag:drag, e:event, drop:this });
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
        el = typeof el === "string" ? document.getElementById(el) : el;
        if (el == null) return null;
        el._katavorio = el._katavorio || _uuid();
        return el;
    };

    this.Katavorio = function(katavorioParams) {

        var _selection = [],
            _selectionMap = {};
        this._dragsByScope = {};
        this._dropsByScope = {};
        var _zoom = 1,
            _reg = function(obj, map) {
                for(var i = 0; i < obj.scopes.length; i++) {
                    map[obj.scopes[i]] = map[obj.scopes[i]] || [];
                    map[obj.scopes[i]].push(obj);
                }
            },
            _unreg = function(obj, map) {
                var c = 0;
                for(var i = 0; i < obj.scopes.length; i++) {
                    if (map[obj.scopes[i]]) {
                        var idx = katavorioParams.indexOf(map[obj.scopes[i]], obj);
                        if (idx != -1) {
                            map[obj.scopes[i]].splice(idx, 1);
                            c++;
                        }
                    }
                }
                return c > 0 ;
            },
            _getMatchingDroppables = this.getMatchingDroppables = function(drag) {
                var dd = [], _m = {};
                for (var i = 0; i < drag.scopes.length; i++) {
                    var _dd = this._dropsByScope[drag.scopes[i]];
                    if (_dd) {
                        for (var j = 0; j < _dd.length; j++) {
                            if (_dd[j].canDrop(drag) &&  !_m[_dd[j].el._katavorio] && _dd[j].el !== drag.el) {
                                _m[_dd[j].el._katavorio] = true;
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
                };
                for (var i in katavorioParams) _p[i] = katavorioParams[i];
                for (var i in p) _p[i] = p[i];
                // events

                for (var i = 0; i < _events.length; i++) {
                    _p.events[_events[i]] = p[_events[i]] || _devNull;
                }
                _p.katavorio = this;
                return _p;
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
                    var p = _prepareParams(params);
                    _el._katavorioDrag = new Drag(_el, p, _css, _scope);
                    _reg(_el._katavorioDrag, this._dragsByScope);
                    o.push(_el._katavorioDrag);
                    katavorioParams.addClass(_el, _css.draggable);
                }
            }.bind(this));
            return o;

        };

        this.droppable = function(el, params) {
            var o = [];
            _each(el, function(_el) {
                _el = _gel(_el);
                if (_el != null) {
                    _el._katavorioDrop = new Drop(_el, _prepareParams(params), _css, _scope);
                    _reg(_el._katavorioDrop, this._dropsByScope);
                    o.push(_el._katavorioDrop);
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

        this.unmarkSelection = function(drag, event) {
            _foreach(_selection, function(e) { e.unmark(event); }, drag);
        };

        this.getSelection = function() { return _selection.slice(0); };

        this.updateSelection = function(dx, dy, drag) {
            _foreach(_selection, function(e) { e.moveBy(dx, dy); }, drag);
        };

        this.notifySelectionDragStop = function(drag, evt) {
            _foreach(_selection, function(e) { e.stop(evt); }, drag);
        };

        this.setZoom = function(z) { _zoom = z; };
        this.getZoom = function() { return _zoom; };

        // does the work of changing scopes
        var _scopeManip = function(kObj, scopes, map, fn) {
            if (kObj != null) {
                _unreg(kObj, map);  // deregister existing scopes
                kObj[fn](scopes); // set scopes
                _reg(kObj, map); // register new ones
            }
        };

        _each([ "set", "add", "remove", "toggle"], function(v) {
            this[v + "Scope"] = function(el, scopes) {
                _scopeManip(el._katavorioDrag, scopes, this._dragsByScope, v + "Scope");
                _scopeManip(el._katavorioDrop, scopes, this._dropsByScope, v + "Scope");
            }.bind(this);
            this[v + "DragScope"] = function(el, scopes) {
                _scopeManip(el._katavorioDrag, scopes, this._dragsByScope, v + "Scope");
            }.bind(this);
            this[v + "DropScope"] = function(el, scopes) {
                _scopeManip(el._katavorioDrop, scopes, this._dropsByScope, v + "Scope");
            }.bind(this);
        }.bind(this));

        this.getDragsForScope = function(s) { return this._dragsByScope[s]; };
        this.getDropsForScope = function(s) { return this._dropsByScope[s]; };

        var _destroy = function(el, type, map) {
            el = _gel(el);
            if (el[type]) {
                if (_unreg(el[type], map))
                    el[type].destroy();
                el[type] = null;
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
    };
}).call(this);

/*
 * jsPlumb
 *
 * Title:jsPlumb 2.1.1
 *
 * Provides a way to visually connect elements on an HTML page, using SVG.
 *
 * This file contains the base functionality for DOM type adapters.
 *
 * Copyright (c) 2010 - 2016 jsPlumb (hello@jsplumbtoolkit.com)
 *
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 *
 * Dual licensed under the MIT and GPL2 licenses.
 */
;
(function () {

    var root = this, _ju = root.jsPlumbUtil;

    var svgAvailable = !!window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"),

        _genLoc = function (e, prefix) {
            if (e == null) return [ 0, 0 ];
            var ts = _touches(e), t = _getTouch(ts, 0);
            return [t[prefix + "X"], t[prefix + "Y"]];
        },
        _pageLocation = function (e) {
            if (e == null) return [ 0, 0 ];
            return _genLoc(e, "page");
        },
        _screenLocation = function (e) {
            return _genLoc(e, "screen");
        },
        _clientLocation = function (e) {
            return _genLoc(e, "client");
        },
        _getTouch = function (touches, idx) {
            return touches.item ? touches.item(idx) : touches[idx];
        },
        _touches = function (e) {
            return e.touches && e.touches.length > 0 ? e.touches :
                    e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches :
                    e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches :
                [ e ];
        };

    /**
     Manages dragging for some instance of jsPlumb.

     TODO instead of this being accessed directly, it should subscribe to events on the jsPlumb instance: every method
     in here is called directly by jsPlumb. But what should happen is that we have unpublished events that this listens
     to.  The only trick is getting one of these instantiated with every jsPlumb instance: it needs to have a hook somehow.
     Basically the general idea is to pull ALL the drag code out (prototype method registrations plus this) into a
     dedicated drag script), that does not necessarily need to be included.


     */
    var DragManager = function (_currentInstance) {
        var _draggables = {}, _dlist = [], _delements = {}, _elementsWithEndpoints = {},
        // elementids mapped to the draggable to which they belong.
            _draggablesForElements = {};

        /**
         register some element as draggable.  right now the drag init stuff is done elsewhere, and it is
         possible that will continue to be the case.
         */
        this.register = function (el) {
            var id = _currentInstance.getId(el),
                parentOffset = _currentInstance.getOffset(el);

            if (!_draggables[id]) {
                _draggables[id] = el;
                _dlist.push(el);
                _delements[id] = {};
            }

            // look for child elements that have endpoints and register them against this draggable.
            var _oneLevel = function (p) {
                if (p) {
                    for (var i = 0; i < p.childNodes.length; i++) {
                        if (p.childNodes[i].nodeType != 3 && p.childNodes[i].nodeType != 8) {
                            var cEl = jsPlumb.getElement(p.childNodes[i]),
                                cid = _currentInstance.getId(p.childNodes[i], null, true);
                            if (cid && _elementsWithEndpoints[cid] && _elementsWithEndpoints[cid] > 0) {
                                var cOff = _currentInstance.getOffset(cEl);
                                _delements[id][cid] = {
                                    id: cid,
                                    offset: {
                                        left: cOff.left - parentOffset.left,
                                        top: cOff.top - parentOffset.top
                                    }
                                };
                                _draggablesForElements[cid] = id;
                            }
                            _oneLevel(p.childNodes[i]);
                        }
                    }
                }
            };

            _oneLevel(el);
        };

        // refresh the offsets for child elements of this element.
        this.updateOffsets = function (elId, childOffsetOverrides) {
            if (elId != null) {
                childOffsetOverrides = childOffsetOverrides || {};
                var domEl = jsPlumb.getElement(elId),
                    id = _currentInstance.getId(domEl),
                    children = _delements[id],
                    parentOffset = _currentInstance.getOffset(domEl);

                if (children) {
                    for (var i in children) {
                        if (children.hasOwnProperty(i)) {
                            var cel = jsPlumb.getElement(i),
                                cOff = childOffsetOverrides[i] || _currentInstance.getOffset(cel);

                            // do not update if we have a value already and we'd just be writing 0,0
                            if (cel.offsetParent == null && _delements[id][i] != null) continue;

                            _delements[id][i] = {
                                id: i,
                                offset: {
                                    left: cOff.left - parentOffset.left,
                                    top: cOff.top - parentOffset.top
                                }
                            };
                            _draggablesForElements[i] = id;
                        }
                    }
                }
            }
        };

        /**
         notification that an endpoint was added to the given el.  we go up from that el's parent
         node, looking for a parent that has been registered as a draggable. if we find one, we add this
         el to that parent's list of elements to update on drag (if it is not there already)
         */
        this.endpointAdded = function (el, id) {

            id = id || _currentInstance.getId(el);

            var b = document.body,
                p = el.parentNode;

            _elementsWithEndpoints[id] = _elementsWithEndpoints[id] ? _elementsWithEndpoints[id] + 1 : 1;

            while (p != null && p != b) {
                var pid = _currentInstance.getId(p, null, true);
                if (pid && _draggables[pid]) {
                    var pLoc = _currentInstance.getOffset(p);

                    if (_delements[pid][id] == null) {
                        var cLoc = _currentInstance.getOffset(el);
                        _delements[pid][id] = {
                            id: id,
                            offset: {
                                left: cLoc.left - pLoc.left,
                                top: cLoc.top - pLoc.top
                            }
                        };
                        _draggablesForElements[id] = pid;
                    }
                    break;
                }
                p = p.parentNode;
            }
        };

        this.endpointDeleted = function (endpoint) {
            if (_elementsWithEndpoints[endpoint.elementId]) {
                _elementsWithEndpoints[endpoint.elementId]--;
                if (_elementsWithEndpoints[endpoint.elementId] <= 0) {
                    for (var i in _delements) {
                        if (_delements.hasOwnProperty(i) && _delements[i]) {
                            delete _delements[i][endpoint.elementId];
                            delete _draggablesForElements[endpoint.elementId];
                        }
                    }
                }
            }
        };

        this.changeId = function (oldId, newId) {
            _delements[newId] = _delements[oldId];
            _delements[oldId] = {};
            _draggablesForElements[newId] = _draggablesForElements[oldId];
            _draggablesForElements[oldId] = null;
        };

        this.getElementsForDraggable = function (id) {
            return _delements[id];
        };

        this.elementRemoved = function (elementId) {
            var elId = _draggablesForElements[elementId];
            if (elId) {
                delete _delements[elId][elementId];
                delete _draggablesForElements[elementId];
            }
        };

        this.reset = function () {
            _draggables = {};
            _dlist = [];
            _delements = {};
            _elementsWithEndpoints = {};
        };

        //
        // notification drag ended. We check automatically if need to update some
        // ancestor's offsets.
        //
        this.dragEnded = function (el) {
            if (el.offsetParent != null) {
                var id = _currentInstance.getId(el),
                    ancestor = _draggablesForElements[id];

                if (ancestor) this.updateOffsets(ancestor);
            }
        };

        this.setParent = function (el, elId, p, pId, currentChildLocation) {
            var current = _draggablesForElements[elId];
            if (!_delements[pId]) {
                _delements[pId] = {};
            }
            var pLoc = _currentInstance.getOffset(p),
                cLoc = currentChildLocation || _currentInstance.getOffset(el);
            if (current) {
                delete _delements[current][elId];
            }

            _delements[pId][elId] = {
                id:elId,
                offset : {
                    left: cLoc.left - pLoc.left,
                    top: cLoc.top - pLoc.top
                }
            };
            _draggablesForElements[elId] = pId;
        };

        this.clearParent = function(el, elId) {
            var current = _draggablesForElements[elId];
            if (current) {
                delete _delements[current][elId];
                delete _draggablesForElements[elId];
            }
        };

        this.revalidateParent = function(el, elId, childOffset) {
            var current = _draggablesForElements[elId];
            if (current) {
                var co = {};
                co[elId] = childOffset;
                this.updateOffsets(current, co);
                _currentInstance.revalidate(current);
            }
        };

        this.getDragAncestor = function (el) {
            var de = jsPlumb.getElement(el),
                id = _currentInstance.getId(de),
                aid = _draggablesForElements[id];

            if (aid)
                return jsPlumb.getElement(aid);
            else
                return null;
        };

    };

    var trim = function (str) {
            return str == null ? null : (str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
        },
        _setClassName = function (el, cn) {
            cn = trim(cn);
            if (typeof el.className.baseVal != "undefined")  // SVG
                el.className.baseVal = cn;
            else
                el.className = cn;
        },
        _getClassName = function (el) {
            return (typeof el.className.baseVal == "undefined") ? el.className : el.className.baseVal;
        },
        _classManip = function (el, classesToAdd, classesToRemove) {
            classesToAdd = classesToAdd == null ? [] : _ju.isArray(classesToAdd) ? classesToAdd : classesToAdd.split(/\s+/);
            classesToRemove = classesToRemove == null ? [] : _ju.isArray(classesToRemove) ? classesToRemove : classesToRemove.split(/\s+/);

            var className = _getClassName(el),
                curClasses = className.split(/\s+/);

            var _oneSet = function (add, classes) {
                for (var i = 0; i < classes.length; i++) {
                    if (add) {
                        if (curClasses.indexOf(classes[i]) == -1)
                            curClasses.push(classes[i]);
                    }
                    else {
                        var idx = curClasses.indexOf(classes[i]);
                        if (idx != -1)
                            curClasses.splice(idx, 1);
                    }
                }
            };

            _oneSet(true, classesToAdd);
            _oneSet(false, classesToRemove);

            _setClassName(el, curClasses.join(" "));
        };

    root.jsPlumb.extend(root.jsPlumbInstance.prototype, {

        headless: false,

        pageLocation: _pageLocation,
        screenLocation: _screenLocation,
        clientLocation: _clientLocation,

        getDragManager:function() {
            if (this.dragManager == null)
                this.dragManager = new DragManager(this);

            return this.dragManager;
        },

        recalculateOffsets:function(elId) {
            this.getDragManager().updateOffsets(elId);
        },

        createElement:function(tag, style, clazz, atts) {
            return this.createElementNS(null, tag, style, clazz, atts);
        },

        createElementNS:function(ns, tag, style, clazz, atts) {
            var e = ns == null ? document.createElement(tag) : document.createElementNS(ns, tag);
            var i;
            style = style || {};
            for (i in style)
                e.style[i] = style[i];

            if (clazz)
                e.className = clazz;

            atts = atts || {};
            for (i in atts)
                e.setAttribute(i, "" + atts[i]);

            return e;
        },

        getAttribute: function (el, attName) {
            return el.getAttribute != null ? el.getAttribute(attName) : null;
        },

        setAttribute: function (el, a, v) {
            if (el.setAttribute != null) el.setAttribute(a, v);
        },

        setAttributes: function (el, atts) {
            for (var i in atts)
                if (atts.hasOwnProperty(i)) el.setAttribute(i, atts[i]);
        },
        appendToRoot: function (node) {
            document.body.appendChild(node);
        },
        getRenderModes: function () {
            return [ "svg"  ];
        },
        getClass:_getClassName,
        addClass: function (el, clazz) {
            jsPlumb.each(el, function (e) {
                _classManip(e, clazz);
            });
        },
        hasClass: function (el, clazz) {
            el = jsPlumb.getElement(el);
            if (el.classList) return el.classList.contains(clazz);
            else {
                return _getClassName(el).indexOf(clazz) != -1;
            }
        },
        removeClass: function (el, clazz) {
            jsPlumb.each(el, function (e) {
                _classManip(e, null, clazz);
            });
        },
        updateClasses: function (el, toAdd, toRemove) {
            jsPlumb.each(el, function (e) {
                _classManip(e, toAdd, toRemove);
            });
        },
        setClass: function (el, clazz) {
            jsPlumb.each(el, function (e) {
                _setClassName(e, clazz);
            });
        },
        setPosition: function (el, p) {
            el.style.left = p.left + "px";
            el.style.top = p.top + "px";
        },
        getPosition: function (el) {
            var _one = function (prop) {
                var v = el.style[prop];
                return v ? v.substring(0, v.length - 2) : 0;
            };
            return {
                left: _one("left"),
                top: _one("top")
            };
        },
        getStyle:function(el, prop) {
            if (typeof window.getComputedStyle !== 'undefined') {
                return getComputedStyle(el, null).getPropertyValue(prop);
            } else {
                return el.currentStyle[prop];
            }
        },
        getSelector: function (ctx, spec) {
            var sel = null;
            if (arguments.length == 1) {
                sel = ctx.nodeType != null ? ctx : document.querySelectorAll(ctx);
            }
            else
                sel = ctx.querySelectorAll(spec);

            return sel;
        },
        getOffset:function(el, relativeToRoot, container) {
            el = jsPlumb.getElement(el);
            container = container || this.getContainer();
            var out = {
                    left: el.offsetLeft,
                    top: el.offsetTop
                },
                op = (relativeToRoot  || (container != null && (el != container && el.offsetParent != container))) ?  el.offsetParent : null,
                _maybeAdjustScroll = function(offsetParent) {
                    if (offsetParent != null && offsetParent !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
                        out.left -= offsetParent.scrollLeft;
                        out.top -= offsetParent.scrollTop;
                    }
                }.bind(this);

            while (op != null) {
                out.left += op.offsetLeft;
                out.top += op.offsetTop;
                _maybeAdjustScroll(op);
                op = relativeToRoot ? op.offsetParent :
                        op.offsetParent == container ? null : op.offsetParent;
            }

            // if container is scrolled and the element (or its offset parent) is not absolute or fixed, adjust accordingly.
            if (container != null && !relativeToRoot && (container.scrollTop > 0 || container.scrollLeft > 0)) {
                var pp = el.offsetParent != null ? this.getStyle(el.offsetParent, "position") : "static",
                    p = this.getStyle(el, "position");
                if (p !== "absolute" && p !== "fixed" && pp !== "absolute" && pp != "fixed") {
                    out.left -= container.scrollLeft;
                    out.top -= container.scrollTop;
                }
            }
            return out;
        },
        //
        // return x+y proportion of the given element's size corresponding to the location of the given event.
        //
        getPositionOnElement: function (evt, el, zoom) {
            var box = typeof el.getBoundingClientRect !== "undefined" ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 },
                body = document.body,
                docElem = document.documentElement,
                scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
                scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
                clientTop = docElem.clientTop || body.clientTop || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                pst = 0,
                psl = 0,
                top = box.top + scrollTop - clientTop + (pst * zoom),
                left = box.left + scrollLeft - clientLeft + (psl * zoom),
                cl = jsPlumb.pageLocation(evt),
                w = box.width || (el.offsetWidth * zoom),
                h = box.height || (el.offsetHeight * zoom),
                x = (cl[0] - left) / w,
                y = (cl[1] - top) / h;

            return [ x, y ];
        },

        /**
         * Gets the absolute position of some element as read from the left/top properties in its style.
         * @method getAbsolutePosition
         * @param {Element} el The element to retrieve the absolute coordinates from. **Note** this is a DOM element, not a selector from the underlying library.
         * @return {Number[]} [left, top] pixel values.
         */
        getAbsolutePosition: function (el) {
            var _one = function (s) {
                var ss = el.style[s];
                if (ss) return parseFloat(ss.substring(0, ss.length - 2));
            };
            return [ _one("left"), _one("top") ];
        },

        /**
         * Sets the absolute position of some element by setting the left/top properties in its style.
         * @method setAbsolutePosition
         * @param {Element} el The element to set the absolute coordinates on. **Note** this is a DOM element, not a selector from the underlying library.
         * @param {Number[]} xy x and y coordinates
         * @param {Number[]} [animateFrom] Optional previous xy to animate from.
         * @param {Object} [animateOptions] Options for the animation.
         */
        setAbsolutePosition: function (el, xy, animateFrom, animateOptions) {
            if (animateFrom) {
                this.animate(el, {
                    left: "+=" + (xy[0] - animateFrom[0]),
                    top: "+=" + (xy[1] - animateFrom[1])
                }, animateOptions);
            }
            else {
                el.style.left = xy[0] + "px";
                el.style.top = xy[1] + "px";
            }
        },
        /**
         * gets the size for the element, in an array : [ width, height ].
         */
        getSize: function (el) {
            return [ el.offsetWidth, el.offsetHeight ];
        },
        getWidth: function (el) {
            return el.offsetWidth;
        },
        getHeight: function (el) {
            return el.offsetHeight;
        }

    });
}).call(typeof window !== 'undefined' ? window : this);

import { isString, forEach, fastTrim, isArray, log, NONE, EVENT_CONTEXTMENU, removeWithFunction, EVENT_MOUSEDOWN as EVENT_MOUSEDOWN$1, EVENT_MOUSEUP as EVENT_MOUSEUP$1, EVENT_MOUSEOVER, EVENT_MOUSEOUT, EVENT_TAP, EVENT_DBL_TAP, EVENT_MOUSEENTER, EVENT_MOUSEEXIT, EVENT_FOCUS, ATTRIBUTE_TABINDEX, uuid, IS, extend, wrap, getWithFunction, SELECTOR_MANAGED_ELEMENT, cls, CLASS_OVERLAY, ATTRIBUTE_NOT_DRAGGABLE, FALSE as FALSE$1, optional, getFromSetWithFunction, intersects, CLASS_ENDPOINT, each, SOURCE, TARGET, INTERCEPT_BEFORE_DRAG, INTERCEPT_BEFORE_START_DETACH, makeAnchorFromSpec, AnchorLocations, ATTRIBUTE_SCOPE_PREFIX, SELECTOR_JTK_TARGET, SELECTOR_JTK_SOURCE, findWithFunction, findAllWithFunction, getAllWithFunction, CHECK_DROP_ALLOWED, classList, EVENT_MAX_CONNECTIONS, functionChain, IS_DETACH_ALLOWED, CHECK_CONDITION, INTERCEPT_BEFORE_DETACH, addToDictionary, FloatingAnchor, isAssignableFrom, EndpointRepresentation, SELECTOR_GROUP, EVENT_MANAGE_ELEMENT, EVENT_UNMANAGE_ELEMENT, EVENT_CONNECTION, INTERCEPT_BEFORE_DROP, Connection, Endpoint, Overlay, TRUE as TRUE$1, UNDEFINED, EVENT_CLICK, EVENT_DBL_CLICK, EVENT_ENDPOINT_CLICK, EVENT_ENDPOINT_DBL_CLICK, EVENT_ELEMENT_CLICK, EVENT_ELEMENT_TAP, EVENT_ELEMENT_DBL_TAP, PROPERTY_POSITION, STATIC, ABSOLUTE, FIXED, fromArray, SELECTOR_OVERLAY, SELECTOR_CONNECTOR, SELECTOR_ENDPOINT, EVENT_MOUSEMOVE as EVENT_MOUSEMOVE$1, ATTRIBUTE_CONTAINER, CLASS_CONNECTOR, ATTRIBUTE_MANAGED, isLabelOverlay, isArrowOverlay, isDiamondOverlay, isPlainArrowOverlay, isCustomOverlay, isFunction, JsPlumbInstance, EVENT_CONNECTION_MOUSEOVER, EVENT_CONNECTION_MOUSEOUT, EVENT_ENDPOINT_MOUSEOVER, EVENT_ENDPOINT_MOUSEOUT, EVENT_ELEMENT_DBL_CLICK, EVENT_ELEMENT_MOUSE_OVER, EVENT_ELEMENT_MOUSE_OUT, EVENT_ELEMENT_MOUSE_MOVE } from '@jsplumb/core';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function matchesSelector(el, selector, ctx) {
  ctx = ctx || el.parentNode;
  var possibles = ctx.querySelectorAll(selector);
  for (var i = 0; i < possibles.length; i++) {
    if (possibles[i] === el) {
      return true;
    }
  }
  return false;
}
function consume(e, doNotPreventDefault) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.returnValue = false;
  }
  if (!doNotPreventDefault && e.preventDefault) {
    e.preventDefault();
  }
}
function findParent(el, selector, container, matchOnElementAlso) {
  while (el != null && el !== container) {
    if (matchesSelector(el, selector) || matchOnElementAlso && matchesSelector(el, selector, container)) {
      return el;
    } else {
      el = el.parentNode;
    }
  }
}
function getEventSource(e) {
  return e.srcElement || e.target;
}
function _setClassName(el, cn, classList) {
  cn = fastTrim(cn);
  if (typeof el.className.baseVal !== "undefined") {
    el.className.baseVal = cn;
  } else {
    el.className = cn;
  }
  try {
    var cl = el.classList;
    if (cl != null) {
      while (cl.length > 0) {
        cl.remove(cl.item(0));
      }
      for (var i = 0; i < classList.length; i++) {
        if (classList[i]) {
          cl.add(classList[i]);
        }
      }
    }
  } catch (e) {
    log("JSPLUMB: cannot set class list", e);
  }
}
function _getClassName(el) {
  return el.className != null ? typeof el.className.baseVal === "undefined" ? el.className : el.className.baseVal : "";
}
function _classManip(el, classesToAdd, classesToRemove) {
  var cta = classesToAdd == null ? [] : isArray(classesToAdd) ? classesToAdd : classesToAdd.split(/\s+/);
  var ctr = classesToRemove == null ? [] : isArray(classesToRemove) ? classesToRemove : classesToRemove.split(/\s+/);
  var className = _getClassName(el),
      curClasses = className.split(/\s+/);
  var _oneSet = function _oneSet(add, classes) {
    for (var i = 0; i < classes.length; i++) {
      if (add) {
        if (curClasses.indexOf(classes[i]) === -1) {
          curClasses.push(classes[i]);
        }
      } else {
        var idx = curClasses.indexOf(classes[i]);
        if (idx !== -1) {
          curClasses.splice(idx, 1);
        }
      }
    }
  };
  _oneSet(true, cta);
  _oneSet(false, ctr);
  _setClassName(el, curClasses.join(" "), curClasses);
}
function isNodeList(el) {
  return !isString(el) && !Array.isArray(el) && el.length != null && el.documentElement == null && el.nodeType == null;
}
function isArrayLike(el) {
  return !isString(el) && (Array.isArray(el) || isNodeList(el));
}
function getClass(el) {
  return _getClassName(el);
}
function addClass(el, clazz) {
  var _one = function _one(el, clazz) {
    if (el != null && clazz != null && clazz.length > 0) {
      if (el.classList) {
        var parts = fastTrim(clazz).split(/\s+/);
        forEach(parts, function (part) {
          el.classList.add(part);
        });
      } else {
        _classManip(el, clazz);
      }
    }
  };
  if (isNodeList(el)) {
    forEach(el, function (el) {
      return _one(el, clazz);
    });
  } else {
    _one(el, clazz);
  }
}
function hasClass(el, clazz) {
  if (el.classList) {
    return el.classList.contains(clazz);
  } else {
    return _getClassName(el).indexOf(clazz) !== -1;
  }
}
function removeClass(el, clazz) {
  var _one = function _one(el, clazz) {
    if (el != null && clazz != null && clazz.length > 0) {
      if (el.classList) {
        var parts = fastTrim(clazz).split(/\s+/);
        parts.forEach(function (part) {
          el.classList.remove(part);
        });
      } else {
        _classManip(el, null, clazz);
      }
    }
  };
  if (isNodeList(el)) {
    forEach(el, function (el) {
      return _one(el, clazz);
    });
  } else {
    _one(el, clazz);
  }
}
function toggleClass(el, clazz) {
  var _this = this;
  var _one = function _one(el, clazz) {
    if (el != null && clazz != null && clazz.length > 0) {
      if (el.classList) {
        el.classList.toggle(clazz);
      } else {
        if (_this.hasClass(el, clazz)) {
          _this.removeClass(el, clazz);
        } else {
          _this.addClass(el, clazz);
        }
      }
    }
  };
  if (isNodeList(el)) {
    forEach(el, function (el) {
      return _one(el, clazz);
    });
  } else {
    _one(el, clazz);
  }
}
function createElement(tag, style, clazz, atts) {
  return createElementNS(null, tag, style, clazz, atts);
}
function createElementNS(ns, tag, style, clazz, atts) {
  var e = ns == null ? document.createElement(tag) : document.createElementNS(ns, tag);
  var i;
  style = style || {};
  for (i in style) {
    e.style[i] = style[i];
  }
  if (clazz) {
    e.className = clazz;
  }
  atts = atts || {};
  for (i in atts) {
    e.setAttribute(i, "" + atts[i]);
  }
  return e;
}
function offsetRelativeToRoot(el) {
  var box = el.getBoundingClientRect(),
      body = document.body,
      docElem = document.documentElement,
  scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
      scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
  clientTop = docElem.clientTop || body.clientTop || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
  top = box.top + scrollTop - clientTop,
      left = box.left + scrollLeft - clientLeft;
  return {
    x: Math.round(left),
    y: Math.round(top)
  };
}
function size(el) {
  return {
    w: el.offsetWidth,
    h: el.offsetHeight
  };
}

var svgAttributeMap = {
  "stroke-linejoin": "stroke-linejoin",
  "stroke-dashoffset": "stroke-dashoffset",
  "stroke-linecap": "stroke-linecap"
};
var STROKE_DASHARRAY = "stroke-dasharray";
var DASHSTYLE = "dashstyle";
var FILL = "fill";
var STROKE = "stroke";
var STROKE_WIDTH = "stroke-width";
var LINE_WIDTH = "strokeWidth";
var ns = {
  svg: "http://www.w3.org/2000/svg"
};
function _attr(node, attributes) {
  for (var i in attributes) {
    node.setAttribute(i, "" + attributes[i]);
  }
}
function _node(name, attributes) {
  attributes = attributes || {};
  attributes.version = "1.1";
  attributes.xmlns = ns.svg;
  return createElementNS(ns.svg, name, null, null, attributes);
}
function _pos(d) {
  return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px";
}
function _applyStyles(parent, node, style, dimensions, uiComponent) {
  node.setAttribute(FILL, style.fill ? style.fill : NONE);
  node.setAttribute(STROKE, style.stroke ? style.stroke : NONE);
  if (style.strokeWidth) {
    node.setAttribute(STROKE_WIDTH, style.strokeWidth);
  }
  if (style[DASHSTYLE] && style[LINE_WIDTH] && !style[STROKE_DASHARRAY]) {
    var sep = style[DASHSTYLE].indexOf(",") === -1 ? " " : ",",
        parts = style[DASHSTYLE].split(sep),
        styleToUse = "";
    forEach(parts, function (p) {
      styleToUse += Math.floor(p * style.strokeWidth) + sep;
    });
    node.setAttribute(STROKE_DASHARRAY, styleToUse);
  } else if (style[STROKE_DASHARRAY]) {
    node.setAttribute(STROKE_DASHARRAY, style[STROKE_DASHARRAY]);
  }
  for (var i in svgAttributeMap) {
    if (style[i]) {
      node.setAttribute(svgAttributeMap[i], style[i]);
    }
  }
}
function _appendAtIndex(svg, path, idx) {
  if (svg.childNodes.length > idx) {
    svg.insertBefore(path, svg.childNodes[idx]);
  } else {
    svg.appendChild(path);
  }
}
function _size(svg, x, y, w, h) {
  svg.style.width = w + "px";
  svg.style.height = h + "px";
  svg.style.left = x + "px";
  svg.style.top = y + "px";
  svg.height = h;
  svg.width = w;
}

function _touch(target, pageX, pageY, screenX, screenY, clientX, clientY) {
  return new Touch({
    target: target,
    identifier: uuid(),
    pageX: pageX,
    pageY: pageY,
    screenX: screenX,
    screenY: screenY,
    clientX: clientX || screenX,
    clientY: clientY || screenY
  });
}
function _touchList() {
  var list = [];
  list.push.apply(list, arguments);
  list.item = function (index) {
    return this[index];
  };
  return list;
}
function _touchAndList(target, pageX, pageY, screenX, screenY, clientX, clientY) {
  return _touchList(_touch(target, pageX, pageY, screenX, screenY, clientX, clientY));
}
function matchesSelector$1(el, selector, ctx) {
  ctx = ctx || el.parentNode;
  var possibles = ctx.querySelectorAll(selector);
  for (var i = 0; i < possibles.length; i++) {
    if (possibles[i] === el) {
      return true;
    }
  }
  return false;
}
function _t(e) {
  return e.srcElement || e.target;
}
function _pi(e, target, obj, doCompute) {
  if (!doCompute) return {
    path: [target],
    end: 1
  };else if (typeof e.path !== "undefined" && e.path.indexOf) {
    return {
      path: e.path,
      end: e.path.indexOf(obj)
    };
  } else {
    var out = {
      path: [],
      end: -1
    },
        _one = function _one(el) {
      out.path.push(el);
      if (el === obj) {
        out.end = out.path.length - 1;
      } else if (el.parentNode != null) {
        _one(el.parentNode);
      }
    };
    _one(target);
    return out;
  }
}
function _d(l, fn) {
  var i = 0,
      j;
  for (i = 0, j = l.length; i < j; i++) {
    if (l[i][0] === fn) {
      break;
    }
  }
  if (i < l.length) {
    l.splice(i, 1);
  }
}
var guid = 1;
var isTouchDevice = "ontouchstart" in document.documentElement || navigator.maxTouchPoints != null && navigator.maxTouchPoints > 0;
var isMouseDevice = "onmousedown" in document.documentElement;
var touchMap = {
  "mousedown": "touchstart",
  "mouseup": "touchend",
  "mousemove": "touchmove"
};
var PAGE = "page";
var SCREEN = "screen";
var CLIENT = "client";
function _genLoc(e, prefix) {
  if (e == null) return {
    x: 0,
    y: 0
  };
  var ts = touches(e),
      t = getTouch(ts, 0);
  return {
    x: t[prefix + "X"],
    y: t[prefix + "Y"]
  };
}
function pageLocation(e) {
  return _genLoc(e, PAGE);
}
function screenLocation(e) {
  return _genLoc(e, SCREEN);
}
function clientLocation(e) {
  return _genLoc(e, CLIENT);
}
function getTouch(touches, idx) {
  return touches.item ? touches.item(idx) : touches[idx];
}
function touches(e) {
  return e.touches && e.touches.length > 0 ? e.touches : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches : e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches : [e];
}
function touchCount(e) {
  return touches(e).length;
}
function _bind(obj, type, fn, originalFn) {
  _store(obj, type, fn);
  originalFn.__tauid = fn.__tauid;
  if (obj.addEventListener) {
    obj.addEventListener(type, fn, false);
  } else if (obj.attachEvent) {
    var key = type + fn.__tauid;
    obj["e" + key] = fn;
    obj[key] = function () {
      obj["e" + key] && obj["e" + key](window.event);
    };
    obj.attachEvent("on" + type, obj[key]);
  }
}
function _unbind(obj, type, fn) {
  var _this = this;
  if (fn == null) return;
  _each(obj, function (_el) {
    _unstore(_el, type, fn);
    if (fn.__tauid != null) {
      if (_el.removeEventListener) {
        _el.removeEventListener(type, fn, false);
        if (isTouchDevice && touchMap[type]) _el.removeEventListener(touchMap[type], fn, false);
      } else if (_this.detachEvent) {
        var key = type + fn.__tauid;
        _el[key] && _el.detachEvent("on" + type, _el[key]);
        _el[key] = null;
        _el["e" + key] = null;
      }
    }
    if (fn.__taTouchProxy) {
      _unbind(obj, fn.__taTouchProxy[1], fn.__taTouchProxy[0]);
    }
  });
}
function _each(obj, fn) {
  if (obj == null) return;
  var entries = typeof obj === "string" ? document.querySelectorAll(obj) : obj.length != null ? obj : [obj];
  for (var i = 0; i < entries.length; i++) {
    fn(entries[i]);
  }
}
function _store(obj, event, fn) {
  var g = guid++;
  obj.__ta = obj.__ta || {};
  obj.__ta[event] = obj.__ta[event] || {};
  obj.__ta[event][g] = fn;
  fn.__tauid = g;
  return g;
}
function _unstore(obj, event, fn) {
  obj.__ta && obj.__ta[event] && delete obj.__ta[event][fn.__tauid];
  if (fn.__taExtra) {
    for (var i = 0; i < fn.__taExtra.length; i++) {
      _unbind(obj, fn.__taExtra[i][0], fn.__taExtra[i][1]);
    }
    fn.__taExtra.length = 0;
  }
  fn.__taUnstore && fn.__taUnstore();
}
function _curryChildFilter(children, obj, fn, evt) {
  if (children == null) return fn;else {
    var c = children.split(","),
        _fn = function _fn(e) {
      _fn.__tauid = fn.__tauid;
      var t = _t(e);
      var done = false;
      var target = t;
      var pathInfo = _pi(e, t, obj, children != null);
      if (pathInfo.end != -1) {
        for (var p = 0; !done && p < pathInfo.end; p++) {
          target = pathInfo.path[p];
          for (var i = 0; !done && i < c.length; i++) {
            if (matchesSelector$1(target, c[i], obj)) {
              fn.apply(target, [e, target]);
              done = true;
              break;
            }
          }
        }
      }
    };
    registerExtraFunction(fn, evt, _fn);
    return _fn;
  }
}
function registerExtraFunction(fn, evt, newFn) {
  fn.__taExtra = fn.__taExtra || [];
  fn.__taExtra.push([evt, newFn]);
}
var DefaultHandler = function DefaultHandler(obj, evt, fn, children) {
  if (isTouchDevice && touchMap[evt]) {
    var tfn = _curryChildFilter(children, obj, fn, touchMap[evt]);
    _bind(obj, touchMap[evt], tfn, fn);
  }
  if (evt === EVENT_FOCUS && obj.getAttribute(ATTRIBUTE_TABINDEX) == null) {
    obj.setAttribute(ATTRIBUTE_TABINDEX, "1");
  }
  _bind(obj, evt, _curryChildFilter(children, obj, fn, evt), fn);
};
var _tapProfiles = {
  "tap": {
    touches: 1,
    taps: 1
  },
  "dbltap": {
    touches: 1,
    taps: 2
  },
  "contextmenu": {
    touches: 2,
    taps: 1
  }
};
function meeHelper(type, evt, obj, target) {
  for (var i in obj.__tamee[type]) {
    if (obj.__tamee[type].hasOwnProperty(i)) {
      obj.__tamee[type][i].apply(target, [evt]);
    }
  }
}
var TapHandler =
function () {
  function TapHandler() {
    _classCallCheck(this, TapHandler);
  }
  _createClass(TapHandler, null, [{
    key: "generate",
    value: function generate(clickThreshold, dblClickThreshold) {
      return function (obj, evt, fn, children) {
        if (evt == EVENT_CONTEXTMENU && isMouseDevice) DefaultHandler(obj, evt, fn, children);else {
          if (obj.__taTapHandler == null) {
            var tt = obj.__taTapHandler = {
              tap: [],
              dbltap: [],
              down: false,
              taps: 0,
              downSelectors: []
            };
            var down = function down(e) {
              var target = _t(e),
                  pathInfo = _pi(e, target, obj, children != null),
                  finished = false;
              for (var p = 0; p < pathInfo.end; p++) {
                if (finished) return;
                target = pathInfo.path[p];
                for (var i = 0; i < tt.downSelectors.length; i++) {
                  if (tt.downSelectors[i] == null || matchesSelector$1(target, tt.downSelectors[i], obj)) {
                    tt.down = true;
                    setTimeout(clearSingle, clickThreshold);
                    setTimeout(clearDouble, dblClickThreshold);
                    finished = true;
                    break;
                  }
                }
              }
            },
                up = function up(e) {
              if (tt.down) {
                var target = _t(e),
                    currentTarget,
                    pathInfo;
                tt.taps++;
                var tc = touchCount(e);
                for (var eventId in _tapProfiles) {
                  if (_tapProfiles.hasOwnProperty(eventId)) {
                    var p = _tapProfiles[eventId];
                    if (p.touches === tc && (p.taps === 1 || p.taps === tt.taps)) {
                      for (var i = 0; i < tt[eventId].length; i++) {
                        pathInfo = _pi(e, target, obj, tt[eventId][i][1] != null);
                        for (var pLoop = 0; pLoop < pathInfo.end; pLoop++) {
                          currentTarget = pathInfo.path[pLoop];
                          if (tt[eventId][i][1] == null || matchesSelector$1(currentTarget, tt[eventId][i][1], obj)) {
                            tt[eventId][i][0].apply(currentTarget, [e, currentTarget]);
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
                clearSingle = function clearSingle() {
              tt.down = false;
            },
                clearDouble = function clearDouble() {
              tt.taps = 0;
            };
            obj.__taTapHandler.downHandler = down;
            obj.__taTapHandler.upHandler = up;
            DefaultHandler(obj, EVENT_MOUSEDOWN$1, down);
            DefaultHandler(obj, EVENT_MOUSEUP$1, up);
          }
          obj.__taTapHandler.downSelectors.push(children);
          obj.__taTapHandler[evt].push([fn, children]);
          fn.__taUnstore = function () {
            if (obj.__taTapHandler != null) {
              removeWithFunction(obj.__taTapHandler.downSelectors, function (ds) {
                return ds === children;
              });
              _d(obj.__taTapHandler[evt], fn);
              if (obj.__taTapHandler.downSelectors.length === 0) {
                _unbind(obj, EVENT_MOUSEDOWN$1, obj.__taTapHandler.downHandler);
                _unbind(obj, EVENT_MOUSEUP$1, obj.__taTapHandler.upHandler);
                delete obj.__taTapHandler;
              }
            }
          };
        }
      };
    }
  }]);
  return TapHandler;
}();
var MouseEnterExitHandler =
function () {
  function MouseEnterExitHandler() {
    _classCallCheck(this, MouseEnterExitHandler);
  }
  _createClass(MouseEnterExitHandler, null, [{
    key: "generate",
    value: function generate() {
      var activeElements = [];
      return function (obj, evt, fn, children) {
        if (!obj.__tamee) {
          obj.__tamee = {
            over: false,
            mouseenter: [],
            mouseexit: []
          };
          var over = function over(e) {
            var t = _t(e);
            if (children == null && t == obj && !obj.__tamee.over || matchesSelector$1(t, children, obj) && (t.__tamee == null || !t.__tamee.over)) {
              meeHelper(EVENT_MOUSEENTER, e, obj, t);
              t.__tamee = t.__tamee || {};
              t.__tamee.over = true;
              activeElements.push(t);
            }
          },
              out = function out(e) {
            var t = _t(e);
            for (var i = 0; i < activeElements.length; i++) {
              if (t == activeElements[i] && !matchesSelector$1(e.relatedTarget || e.toElement, "*", t)) {
                t.__tamee.over = false;
                activeElements.splice(i, 1);
                meeHelper(EVENT_MOUSEEXIT, e, obj, t);
              }
            }
          };
          _bind(obj, EVENT_MOUSEOVER, _curryChildFilter(children, obj, over, EVENT_MOUSEOVER), over);
          _bind(obj, EVENT_MOUSEOUT, _curryChildFilter(children, obj, out, EVENT_MOUSEOUT), out);
        }
        fn.__taUnstore = function () {
          delete obj.__tamee[evt][fn.__tauid];
        };
        _store(obj, evt, fn);
        obj.__tamee[evt][fn.__tauid] = fn;
      };
    }
  }]);
  return MouseEnterExitHandler;
}();
var EventManager =
function () {
  function EventManager(params) {
    _classCallCheck(this, EventManager);
    _defineProperty(this, "clickThreshold", void 0);
    _defineProperty(this, "dblClickThreshold", void 0);
    _defineProperty(this, "tapHandler", void 0);
    _defineProperty(this, "mouseEnterExitHandler", void 0);
    params = params || {};
    this.clickThreshold = params.clickThreshold || 250;
    this.dblClickThreshold = params.dblClickThreshold || 450;
    this.mouseEnterExitHandler = MouseEnterExitHandler.generate();
    this.tapHandler = TapHandler.generate(this.clickThreshold, this.dblClickThreshold);
  }
  _createClass(EventManager, [{
    key: "_doBind",
    value: function _doBind(el, evt, fn, children) {
      if (fn == null) return;
      var jel = el;
      if (evt === EVENT_TAP || evt === EVENT_DBL_TAP || evt === EVENT_CONTEXTMENU) {
        this.tapHandler(jel, evt, fn, children);
      } else if (evt === EVENT_MOUSEENTER || evt == EVENT_MOUSEEXIT) this.mouseEnterExitHandler(jel, evt, fn, children);else {
        DefaultHandler(jel, evt, fn, children);
      }
    }
  }, {
    key: "on",
    value: function on(el, event, children, fn) {
      var _c = fn == null ? null : children,
          _f = fn == null ? children : fn;
      this._doBind(el, event, _f, _c);
      return this;
    }
  }, {
    key: "off",
    value: function off(el, event, fn) {
      _unbind(el, event, fn);
      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(el, event, originalEvent, payload, detail) {
      var originalIsMouse = isMouseDevice && (typeof MouseEvent === "undefined" || originalEvent == null || originalEvent.constructor === MouseEvent);
      var eventToBind = isTouchDevice && !isMouseDevice && touchMap[event] ? touchMap[event] : event,
          bindingAMouseEvent = !(isTouchDevice && !isMouseDevice && touchMap[event]);
      var pl = pageLocation(originalEvent),
          sl = screenLocation(originalEvent),
          cl = clientLocation(originalEvent);
      _each(el, function (_el) {
        var evt;
        originalEvent = originalEvent || {
          screenX: sl.x,
          screenY: sl.y,
          clientX: cl.x,
          clientY: cl.y
        };
        var _decorate = function _decorate(_evt) {
          if (payload) {
            _evt.payload = payload;
          }
        };
        var eventGenerators = {
          "TouchEvent": function TouchEvent(evt) {
            var touchList = _touchAndList(_el, pl.x, pl.y, sl.x, sl.y, cl.x, cl.y),
                init = evt.initTouchEvent || evt.initEvent;
            init(eventToBind, true, true, window, null, sl.x, sl.y, cl.x, cl.y, false, false, false, false, touchList, touchList, touchList, 1, 0);
          },
          "MouseEvents": function MouseEvents(evt) {
            evt.initMouseEvent(eventToBind, true, true, window, detail == null ? 1 : detail, sl.x, sl.y, cl.x, cl.y, false, false, false, false, 1, _el);
          }
        };
        var ite = !bindingAMouseEvent && !originalIsMouse && isTouchDevice && touchMap[event],
            evtName = ite ? "TouchEvent" : "MouseEvents";
        evt = document.createEvent(evtName);
        eventGenerators[evtName](evt);
        _decorate(evt);
        _el.dispatchEvent(evt);
      });
      return this;
    }
  }]);
  return EventManager;
}();

function findDelegateElement(parentElement, childElement, selector) {
  if (matchesSelector(childElement, selector, parentElement)) {
    return childElement;
  } else {
    var currentParent = childElement.parentNode;
    while (currentParent != null && currentParent !== parentElement) {
      if (matchesSelector(currentParent, selector, parentElement)) {
        return currentParent;
      } else {
        currentParent = currentParent.parentNode;
      }
    }
  }
}
function _getPosition(el) {
  return {
    x: el.offsetLeft,
    y: el.offsetTop
  };
}
function _getSize(el) {
  return {
    w: el.offsetWidth,
    h: el.offsetHeight
  };
}
function _setPosition(el, pos) {
  el.style.left = pos.x + "px";
  el.style.top = pos.y + "px";
}
function _assignId(obj) {
  if (typeof obj === "function") {
    obj._katavorioId = uuid();
    return obj._katavorioId;
  } else {
    return obj;
  }
}
function _snap(pos, gridX, gridY, thresholdX, thresholdY) {
  var _dx = Math.floor(pos.x / gridX),
      _dxl = gridX * _dx,
      _dxt = _dxl + gridX,
      x = Math.abs(pos.x - _dxl) <= thresholdX ? _dxl : Math.abs(_dxt - pos.x) <= thresholdX ? _dxt : pos.x;
  var _dy = Math.floor(pos.y / gridY),
      _dyl = gridY * _dy,
      _dyt = _dyl + gridY,
      y = Math.abs(pos.y - _dyl) <= thresholdY ? _dyl : Math.abs(_dyt - pos.y) <= thresholdY ? _dyt : pos.y;
  return {
    x: x,
    y: y
  };
}
function findMatchingSelector(availableSelectors, parentElement, childElement) {
  var el = null;
  var draggableId = parentElement.getAttribute("katavorio-draggable"),
      prefix = draggableId != null ? "[katavorio-draggable='" + draggableId + "'] " : "";
  for (var i = 0; i < availableSelectors.length; i++) {
    el = findDelegateElement(parentElement, childElement, prefix + availableSelectors[i].selector);
    if (el != null) {
      if (availableSelectors[i].filter) {
        var matches = matchesSelector(childElement, availableSelectors[i].filter, el),
            exclude = availableSelectors[i].filterExclude === true;
        if (exclude && !matches || matches) {
          return null;
        }
      }
      return [availableSelectors[i], el];
    }
  }
  return null;
}
var EVENT_START = "start";
var EVENT_BEFORE_START = "beforeStart";
var EVENT_DRAG = "drag";
var EVENT_DROP = "drop";
var EVENT_OVER = "over";
var EVENT_OUT = "out";
var EVENT_STOP = "stop";
var ATTRIBUTE_DRAGGABLE = "katavorio-draggable";
var CLASS_DRAGGABLE = ATTRIBUTE_DRAGGABLE;
var DEFAULT_GRID_X = 10;
var DEFAULT_GRID_Y = 10;
var TRUE = function TRUE() {
  return true;
};
var FALSE = function FALSE() {
  return false;
};
var _classes = {
  delegatedDraggable: "katavorio-delegated-draggable",
  draggable: CLASS_DRAGGABLE,
  drag: "katavorio-drag",
  selected: "katavorio-drag-selected",
  noSelect: "katavorio-drag-no-select",
  ghostProxy: "katavorio-ghost-proxy",
  clonedDrag: "katavorio-clone-drag"
};
var _events = [EVENT_STOP, EVENT_START, EVENT_DRAG, EVENT_DROP, EVENT_OVER, EVENT_OUT, EVENT_BEFORE_START];
var _devNull = function _devNull() {};
var _each$1 = function _each(obj, fn) {
  if (obj == null) return;
  obj = !IS.aString(obj) && obj.tagName == null && obj.length != null ? obj : [obj];
  for (var i = 0; i < obj.length; i++) {
    fn.apply(obj[i], [obj[i]]);
  }
};
var _inputFilter = function _inputFilter(e, el, collicat) {
  var t = e.srcElement || e.target;
  return !matchesSelector(t, collicat.getInputFilterSelector(), el);
};
var Base =
function () {
  function Base(el, k) {
    _classCallCheck(this, Base);
    this.el = el;
    this.k = k;
    _defineProperty(this, "_class", void 0);
    _defineProperty(this, "uuid", uuid());
    _defineProperty(this, "enabled", true);
    _defineProperty(this, "scopes", []);
  }
  _createClass(Base, [{
    key: "setEnabled",
    value: function setEnabled(e) {
      this.enabled = e;
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.enabled;
    }
  }, {
    key: "toggleEnabled",
    value: function toggleEnabled() {
      this.enabled = !this.enabled;
    }
  }, {
    key: "addScope",
    value: function addScope(scopes) {
      var m = {};
      _each$1(this.scopes, function (s) {
        m[s] = true;
      });
      _each$1(scopes ? scopes.split(/\s+/) : [], function (s) {
        m[s] = true;
      });
      this.scopes.length = 0;
      for (var i in m) {
        this.scopes.push(i);
      }
    }
  }, {
    key: "removeScope",
    value: function removeScope(scopes) {
      var m = {};
      _each$1(this.scopes, function (s) {
        m[s] = true;
      });
      _each$1(scopes ? scopes.split(/\s+/) : [], function (s) {
        delete m[s];
      });
      this.scopes.length = 0;
      for (var i in m) {
        this.scopes.push(i);
      }
    }
  }, {
    key: "toggleScope",
    value: function toggleScope(scopes) {
      var m = {};
      _each$1(this.scopes, function (s) {
        m[s] = true;
      });
      _each$1(scopes ? scopes.split(/\s+/) : [], function (s) {
        if (m[s]) delete m[s];else m[s] = true;
      });
      this.scopes.length = 0;
      for (var i in m) {
        this.scopes.push(i);
      }
    }
  }]);
  return Base;
}();
function getConstrainingRectangle(el) {
  return {
    w: el.parentNode.offsetWidth + el.parentNode.scrollLeft,
    h: el.parentNode.offsetHeight + el.parentNode.scrollTop
  };
}
var ContainmentTypes;
(function (ContainmentTypes) {
  ContainmentTypes["notNegative"] = "notNegative";
  ContainmentTypes["parent"] = "parent";
  ContainmentTypes["parentEnclosed"] = "parentEnclosed";
})(ContainmentTypes || (ContainmentTypes = {}));
var Drag =
function (_Base) {
  _inherits(Drag, _Base);
  function Drag(el, params, k) {
    var _this;
    _classCallCheck(this, Drag);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Drag).call(this, el, k));
    _defineProperty(_assertThisInitialized(_this), "_class", void 0);
    _defineProperty(_assertThisInitialized(_this), "rightButtonCanDrag", void 0);
    _defineProperty(_assertThisInitialized(_this), "consumeStartEvent", void 0);
    _defineProperty(_assertThisInitialized(_this), "clone", void 0);
    _defineProperty(_assertThisInitialized(_this), "scroll", void 0);
    _defineProperty(_assertThisInitialized(_this), "trackScroll", void 0);
    _defineProperty(_assertThisInitialized(_this), "_downAt", void 0);
    _defineProperty(_assertThisInitialized(_this), "_posAtDown", void 0);
    _defineProperty(_assertThisInitialized(_this), "_pagePosAtDown", void 0);
    _defineProperty(_assertThisInitialized(_this), "_pageDelta", {
      x: 0,
      y: 0
    });
    _defineProperty(_assertThisInitialized(_this), "_moving", void 0);
    _defineProperty(_assertThisInitialized(_this), "_lastPosition", void 0);
    _defineProperty(_assertThisInitialized(_this), "_lastScrollValues", {
      x: 0,
      y: 0
    });
    _defineProperty(_assertThisInitialized(_this), "_initialScroll", {
      x: 0,
      y: 0
    });
    _defineProperty(_assertThisInitialized(_this), "_size", void 0);
    _defineProperty(_assertThisInitialized(_this), "_currentParentPosition", void 0);
    _defineProperty(_assertThisInitialized(_this), "_ghostParentPosition", void 0);
    _defineProperty(_assertThisInitialized(_this), "_dragEl", void 0);
    _defineProperty(_assertThisInitialized(_this), "_multipleDrop", void 0);
    _defineProperty(_assertThisInitialized(_this), "_ghostProxyOffsets", void 0);
    _defineProperty(_assertThisInitialized(_this), "_ghostDx", void 0);
    _defineProperty(_assertThisInitialized(_this), "_ghostDy", void 0);
    _defineProperty(_assertThisInitialized(_this), "_isConstrained", false);
    _defineProperty(_assertThisInitialized(_this), "_ghostProxyParent", void 0);
    _defineProperty(_assertThisInitialized(_this), "_useGhostProxy", void 0);
    _defineProperty(_assertThisInitialized(_this), "_ghostProxyFunction", void 0);
    _defineProperty(_assertThisInitialized(_this), "_activeSelectorParams", void 0);
    _defineProperty(_assertThisInitialized(_this), "_availableSelectors", []);
    _defineProperty(_assertThisInitialized(_this), "_canDrag", void 0);
    _defineProperty(_assertThisInitialized(_this), "_consumeFilteredEvents", void 0);
    _defineProperty(_assertThisInitialized(_this), "_parent", void 0);
    _defineProperty(_assertThisInitialized(_this), "_ignoreZoom", void 0);
    _defineProperty(_assertThisInitialized(_this), "_filters", {});
    _defineProperty(_assertThisInitialized(_this), "_constrainRect", void 0);
    _defineProperty(_assertThisInitialized(_this), "_elementToDrag", void 0);
    _defineProperty(_assertThisInitialized(_this), "downListener", void 0);
    _defineProperty(_assertThisInitialized(_this), "moveListener", void 0);
    _defineProperty(_assertThisInitialized(_this), "upListener", void 0);
    _defineProperty(_assertThisInitialized(_this), "listeners", {
      "start": [],
      "drag": [],
      "stop": [],
      "over": [],
      "out": [],
      "beforeStart": [],
      "revert": []
    });
    _this._class = _this.k.css.draggable;
    addClass(_this.el, _this._class);
    _this.downListener = _this._downListener.bind(_assertThisInitialized(_this));
    _this.upListener = _this._upListener.bind(_assertThisInitialized(_this));
    _this.moveListener = _this._moveListener.bind(_assertThisInitialized(_this));
    _this.rightButtonCanDrag = params.rightButtonCanDrag === true;
    _this.consumeStartEvent = params.consumeStartEvent !== false;
    _this._dragEl = _this.el;
    _this.clone = params.clone === true;
    _this.scroll = params.scroll === true;
    _this.trackScroll = params.trackScroll !== false;
    _this._multipleDrop = params.multipleDrop !== false;
    _this._canDrag = params.canDrag || TRUE;
    _this._consumeFilteredEvents = params.consumeFilteredEvents;
    _this._parent = params.parent;
    _this._ignoreZoom = params.ignoreZoom === true;
    _this._ghostProxyParent = params.ghostProxyParent;
    if (_this.trackScroll) {
      document.addEventListener("scroll", function (e) {
        if (_this._moving) {
          var currentScrollValues = {
            x: document.documentElement.scrollLeft,
            y: document.documentElement.scrollTop
          },
              dsx = currentScrollValues.x - _this._lastScrollValues.x,
              dsy = currentScrollValues.y - _this._lastScrollValues.y,
              _pos = {
            x: dsx + _this._lastPosition.x,
            y: dsy + _this._lastPosition.y
          },
          dx = _pos.x - _this._downAt.x,
              dy = _pos.y - _this._downAt.y,
              _z = _this._ignoreZoom ? 1 : _this.k.getZoom();
          if (_this._dragEl && _this._dragEl.parentNode) {
            dx += _this._dragEl.parentNode.scrollLeft - _this._initialScroll.x;
            dy += _this._dragEl.parentNode.scrollTop - _this._initialScroll.y;
          }
          dx /= _z;
          dy /= _z;
          _this.moveBy(dx, dy, e);
          _this._lastPosition = _pos;
          _this._lastScrollValues = currentScrollValues;
        }
      });
    }
    if (params.ghostProxy === true) {
      _this._useGhostProxy = TRUE;
    } else {
      if (params.ghostProxy && typeof params.ghostProxy === "function") {
        _this._useGhostProxy = params.ghostProxy;
      } else {
        _this._useGhostProxy = function (container, dragEl) {
          if (_this._activeSelectorParams && _this._activeSelectorParams.useGhostProxy) {
            return _this._activeSelectorParams.useGhostProxy(container, dragEl);
          } else {
            return false;
          }
        };
      }
    }
    if (params.makeGhostProxy) {
      _this._ghostProxyFunction = params.makeGhostProxy;
    } else {
      _this._ghostProxyFunction = function (el) {
        if (_this._activeSelectorParams && _this._activeSelectorParams.makeGhostProxy) {
          return _this._activeSelectorParams.makeGhostProxy(el);
        } else {
          return el.cloneNode(true);
        }
      };
    }
    if (params.selector) {
      var draggableId = _this.el.getAttribute(ATTRIBUTE_DRAGGABLE);
      if (draggableId == null) {
        draggableId = "" + new Date().getTime();
        _this.el.setAttribute("katavorio-draggable", draggableId);
      }
      _this._availableSelectors.push(params);
    }
    _this.k.eventManager.on(_this.el, EVENT_MOUSEDOWN, _this.downListener);
    return _this;
  }
  _createClass(Drag, [{
    key: "on",
    value: function on(evt, fn) {
      if (this.listeners[evt]) {
        this.listeners[evt].push(fn);
      }
    }
  }, {
    key: "off",
    value: function off(evt, fn) {
      if (this.listeners[evt]) {
        var l = [];
        for (var i = 0; i < this.listeners[evt].length; i++) {
          if (this.listeners[evt][i] !== fn) {
            l.push(this.listeners[evt][i]);
          }
        }
        this.listeners[evt] = l;
      }
    }
  }, {
    key: "_upListener",
    value: function _upListener(e) {
      if (this._downAt) {
        this._downAt = null;
        this.k.eventManager.off(document, EVENT_MOUSEMOVE, this.moveListener);
        this.k.eventManager.off(document, EVENT_MOUSEUP, this.upListener);
        removeClass(document.body, _classes.noSelect);
        this.unmark(e);
        this.stop(e);
        this._moving = false;
        if (this.clone) {
          this._dragEl && this._dragEl.parentNode && this._dragEl.parentNode.removeChild(this._dragEl);
          this._dragEl = null;
        } else {
          if (this._activeSelectorParams && this._activeSelectorParams.revertFunction && this._activeSelectorParams.revertFunction(this._dragEl, _getPosition(this._dragEl)) === true) {
            _setPosition(this._dragEl, this._posAtDown);
            this._dispatch(EVENT_REVERT, this._dragEl);
          }
        }
      }
    }
  }, {
    key: "_downListener",
    value: function _downListener(e) {
      if (e.defaultPrevented) {
        return;
      }
      var isNotRightClick = this.rightButtonCanDrag || e.which !== 3 && e.button !== 2;
      if (isNotRightClick && this.isEnabled() && this._canDrag()) {
        var _f = this._testFilter(e) && _inputFilter(e, this.el, this.k);
        if (_f) {
          this._activeSelectorParams = null;
          this._elementToDrag = null;
          if (this._availableSelectors.length === 0) {
            console.log("JSPLUMB: no available drag selectors");
          }
          var eventTarget = e.target || e.srcElement;
          var match = findMatchingSelector(this._availableSelectors, this.el, eventTarget);
          if (match != null) {
            this._activeSelectorParams = match[0];
            this._elementToDrag = match[1];
          }
          if (this._activeSelectorParams == null || this._elementToDrag == null) {
            return;
          }
          var initial = this._activeSelectorParams.dragInit ? this._activeSelectorParams.dragInit(this._elementToDrag) : null;
          if (initial != null) {
            this._elementToDrag = initial;
          }
          if (this.clone) {
            this._dragEl = this._elementToDrag.cloneNode(true);
            addClass(this._dragEl, _classes.clonedDrag);
            this._dragEl.setAttribute("id", null);
            this._dragEl.style.position = "absolute";
            if (this._parent != null) {
              var _p2 = _getPosition(this.el);
              this._dragEl.style.left = _p2.x + "px";
              this._dragEl.style.top = _p2.y + "px";
              this._parent.appendChild(this._dragEl);
            } else {
              var b = offsetRelativeToRoot(this._elementToDrag);
              this._dragEl.style.left = b.x + "px";
              this._dragEl.style.top = b.y + "px";
              document.body.appendChild(this._dragEl);
            }
          } else {
            this._dragEl = this._elementToDrag;
          }
          if (this.consumeStartEvent) {
            consume(e);
          }
          this._downAt = pageLocation(e);
          if (this._dragEl && this._dragEl.parentNode) {
            this._initialScroll = {
              x: this._dragEl.parentNode.scrollLeft,
              y: this._dragEl.parentNode.scrollTop
            };
          }
          this._posAtDown = _getPosition(this._dragEl);
          this._pagePosAtDown = offsetRelativeToRoot(this._dragEl);
          this._pageDelta = {
            x: this._pagePosAtDown.x - this._posAtDown.x,
            y: this._pagePosAtDown.y - this._posAtDown.y
          };
          this._size = _getSize(this._dragEl);
          this.k.eventManager.on(document, EVENT_MOUSEMOVE, this.moveListener);
          this.k.eventManager.on(document, EVENT_MOUSEUP, this.upListener);
          addClass(document.body, _classes.noSelect);
          this._dispatch(EVENT_BEFORE_START, {
            el: this.el,
            pos: this._posAtDown,
            e: e,
            drag: this
          });
        } else if (this._consumeFilteredEvents) {
          consume(e);
        }
      }
    }
  }, {
    key: "_moveListener",
    value: function _moveListener(e) {
      if (this._downAt) {
        if (!this._moving) {
          var dispatchResult = this._dispatch(EVENT_START, {
            el: this.el,
            pos: this._posAtDown,
            e: e,
            drag: this
          });
          if (dispatchResult !== false) {
            if (!this._downAt) {
              return;
            }
            this.mark(dispatchResult);
            this._moving = true;
          } else {
            this.abort();
          }
        }
        if (this._downAt) {
          var _pos2 = pageLocation(e),
              dx = _pos2.x - this._downAt.x,
              dy = _pos2.y - this._downAt.y,
              _z2 = this._ignoreZoom ? 1 : this.k.getZoom();
          this._lastPosition = {
            x: _pos2.x,
            y: _pos2.y
          };
          this._lastScrollValues = {
            x: document.documentElement.scrollLeft,
            y: document.documentElement.scrollTop
          };
          if (this._dragEl && this._dragEl.parentNode) {
            dx += this._dragEl.parentNode.scrollLeft - this._initialScroll.x;
            dy += this._dragEl.parentNode.scrollTop - this._initialScroll.y;
          }
          dx /= _z2;
          dy /= _z2;
          this.moveBy(dx, dy, e);
        }
      }
    }
  }, {
    key: "mark",
    value: function mark(payload) {
      this._posAtDown = _getPosition(this._dragEl);
      this._pagePosAtDown = offsetRelativeToRoot(this._dragEl);
      this._pageDelta = {
        x: this._pagePosAtDown.x - this._posAtDown.x,
        y: this._pagePosAtDown.y - this._posAtDown.y
      };
      this._size = _getSize(this._dragEl);
      addClass(this._dragEl, this.k.css.drag);
      this._constrainRect = getConstrainingRectangle(this._dragEl);
      this._ghostDx = 0;
      this._ghostDy = 0;
    }
  }, {
    key: "unmark",
    value: function unmark(e) {
      if (this._isConstrained && this._useGhostProxy(this._elementToDrag, this._dragEl)) {
        this._ghostProxyOffsets = {
          x: this._dragEl.offsetLeft - this._ghostDx,
          y: this._dragEl.offsetTop - this._ghostDy
        };
        this._dragEl.parentNode.removeChild(this._dragEl);
        this._dragEl = this._elementToDrag;
      } else {
        this._ghostProxyOffsets = null;
      }
      removeClass(this._dragEl, this.k.css.drag);
      this._isConstrained = false;
    }
  }, {
    key: "moveBy",
    value: function moveBy(dx, dy, e) {
      var desiredLoc = this.toGrid({
        x: this._posAtDown.x + dx,
        y: this._posAtDown.y + dy
      }),
          cPos = this._doConstrain(desiredLoc, this._dragEl, this._constrainRect, this._size);
      if (this._useGhostProxy(this.el, this._dragEl)) {
        if (desiredLoc.x !== cPos.x || desiredLoc.y !== cPos.y) {
          if (!this._isConstrained) {
            var gp = this._ghostProxyFunction(this._elementToDrag);
            addClass(gp, _classes.ghostProxy);
            if (this._ghostProxyParent) {
              this._ghostProxyParent.appendChild(gp);
              this._currentParentPosition = offsetRelativeToRoot(this._elementToDrag.parentNode);
              this._ghostParentPosition = offsetRelativeToRoot(this._ghostProxyParent);
              this._ghostDx = this._currentParentPosition.x - this._ghostParentPosition.x;
              this._ghostDy = this._currentParentPosition.y - this._ghostParentPosition.y;
            } else {
              this._elementToDrag.parentNode.appendChild(gp);
            }
            this._dragEl = gp;
            this._isConstrained = true;
          }
          cPos = desiredLoc;
        } else {
          if (this._isConstrained) {
            this._dragEl.parentNode.removeChild(this._dragEl);
            this._dragEl = this._elementToDrag;
            this._isConstrained = false;
            this._currentParentPosition = null;
            this._ghostParentPosition = null;
            this._ghostDx = 0;
            this._ghostDy = 0;
          }
        }
      }
      _setPosition(this._dragEl, {
        x: cPos.x + this._ghostDx,
        y: cPos.y + this._ghostDy
      });
      this._dispatch("drag", {
        el: this.el,
        pos: cPos,
        e: e,
        drag: this
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      if (this._downAt != null) {
        this._upListener();
      }
    }
  }, {
    key: "getDragElement",
    value: function getDragElement(retrieveOriginalElement) {
      return retrieveOriginalElement ? this._elementToDrag || this.el : this._dragEl || this.el;
    }
  }, {
    key: "stop",
    value: function stop(e, force) {
      if (force || this._moving) {
        var positions = [],
            dPos = _getPosition(this._dragEl);
        positions.push([this._dragEl, dPos, this]);
        this._dispatch(EVENT_STOP, {
          el: this._dragEl,
          pos: this._ghostProxyOffsets || dPos,
          finalPos: dPos,
          e: e,
          drag: this,
          selection: positions
        });
      } else if (!this._moving) {
        this._activeSelectorParams.dragAbort ? this._activeSelectorParams.dragAbort(this._elementToDrag) : null;
      }
    }
  }, {
    key: "_dispatch",
    value: function _dispatch(evt, value) {
      var result = null;
      if (this._activeSelectorParams && this._activeSelectorParams[evt]) {
        result = this._activeSelectorParams[evt](value);
      } else if (this.listeners[evt]) {
        for (var i = 0; i < this.listeners[evt].length; i++) {
          try {
            var v = this.listeners[evt][i](value);
            if (v != null) {
              result = v;
            }
          } catch (e) {}
        }
      }
      return result;
    }
  }, {
    key: "resolveGrid",
    value: function resolveGrid() {
      var out = [null, DEFAULT_GRID_X / 2, DEFAULT_GRID_Y / 2];
      if (this._activeSelectorParams != null && this._activeSelectorParams.grid != null) {
        out[0] = this._activeSelectorParams.grid;
        if (this._activeSelectorParams.snapThreshold != null) {
          out[1] = this._activeSelectorParams.snapThreshold;
          out[2] = this._activeSelectorParams.snapThreshold;
        }
      }
      return out;
    }
  }, {
    key: "toGrid",
    value: function toGrid(pos) {
      var _this$resolveGrid = this.resolveGrid(),
          _this$resolveGrid2 = _slicedToArray(_this$resolveGrid, 3),
          grid = _this$resolveGrid2[0],
          thresholdX = _this$resolveGrid2[1],
          thresholdY = _this$resolveGrid2[2];
      if (grid == null) {
        return pos;
      } else {
        var tx = grid ? grid[0] / 2 : thresholdX,
            ty = grid ? grid[1] / 2 : thresholdY;
        return _snap(pos, grid[0], grid[1], tx, ty);
      }
    }
  }, {
    key: "setUseGhostProxy",
    value: function setUseGhostProxy(val) {
      this._useGhostProxy = val ? TRUE : FALSE;
    }
  }, {
    key: "_doConstrain",
    value: function _doConstrain(pos, dragEl, _constrainRect, _size) {
      if (this._activeSelectorParams != null && this._activeSelectorParams.constrainFunction && typeof this._activeSelectorParams.constrainFunction === "function") {
        return this._activeSelectorParams.constrainFunction(pos, dragEl, _constrainRect, _size);
      } else {
        return pos;
      }
    }
  }, {
    key: "_testFilter",
    value: function _testFilter(e) {
      for (var key in this._filters) {
        var f = this._filters[key];
        var rv = f[0](e);
        if (f[1]) {
          rv = !rv;
        }
        if (!rv) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: "addFilter",
    value: function addFilter(f, _exclude) {
      var _this2 = this;
      if (f) {
        var key = _assignId(f);
        this._filters[key] = [function (e) {
          var t = e.srcElement || e.target;
          var m;
          if (IS.aString(f)) {
            m = matchesSelector(t, f, _this2.el);
          } else if (typeof f === "function") {
            m = f(e, _this2.el);
          }
          return m;
        }, _exclude !== false];
      }
    }
  }, {
    key: "removeFilter",
    value: function removeFilter(f) {
      var key = typeof f === "function" ? f._katavorioId : f;
      delete this._filters[key];
    }
  }, {
    key: "clearAllFilters",
    value: function clearAllFilters() {
      this._filters = {};
    }
  }, {
    key: "addSelector",
    value: function addSelector(params, atStart) {
      if (params.selector) {
        if (atStart) {
          this._availableSelectors.unshift(params);
        } else {
          this._availableSelectors.push(params);
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.k.eventManager.off(this.el, EVENT_MOUSEDOWN, this.downListener);
      this.k.eventManager.off(document, EVENT_MOUSEMOVE, this.moveListener);
      this.k.eventManager.off(document, EVENT_MOUSEUP, this.upListener);
      this.downListener = null;
      this.upListener = null;
      this.moveListener = null;
    }
  }]);
  return Drag;
}(Base);
var DEFAULT_INPUTS = ["input", "textarea", "select", "button", "option"];
var DEFAULT_INPUT_FILTER_SELECTOR = DEFAULT_INPUTS.join(",");
var Collicat =
function () {
  function Collicat(options) {
    _classCallCheck(this, Collicat);
    _defineProperty(this, "eventManager", void 0);
    _defineProperty(this, "zoom", 1);
    _defineProperty(this, "css", {});
    _defineProperty(this, "inputFilterSelector", void 0);
    options = options || {};
    this.inputFilterSelector = options.inputFilterSelector || DEFAULT_INPUT_FILTER_SELECTOR;
    this.eventManager = new EventManager();
    this.zoom = options.zoom || 1;
    var _c = options.css || {};
    extend(this.css, _c);
  }
  _createClass(Collicat, [{
    key: "getZoom",
    value: function getZoom() {
      return this.zoom;
    }
  }, {
    key: "setZoom",
    value: function setZoom(z) {
      this.zoom = z;
    }
  }, {
    key: "_prepareParams",
    value: function _prepareParams(p) {
      p = p || {};
      var _p = {
        events: {}
      },
          i;
      for (i in p) {
        _p[i] = p[i];
      }
      for (i = 0; i < _events.length; i++) {
        _p.events[_events[i]] = p[_events[i]] || _devNull;
      }
      return _p;
    }
  }, {
    key: "getInputFilterSelector",
    value: function getInputFilterSelector() {
      return this.inputFilterSelector;
    }
  }, {
    key: "setInputFilterSelector",
    value: function setInputFilterSelector(selector) {
      this.inputFilterSelector = selector;
      return this;
    }
  }, {
    key: "draggable",
    value: function draggable(el, params) {
      if (el._katavorioDrag == null) {
        var _p3 = this._prepareParams(params);
        var d = new Drag(el, _p3, this);
        addClass(el, _classes.delegatedDraggable);
        el._katavorioDrag = d;
        return d;
      } else {
        return el._katavorioDrag;
      }
    }
  }, {
    key: "destroyDraggable",
    value: function destroyDraggable(el) {
      if (el._katavorioDrag) {
        el._katavorioDrag.destroy();
        delete el._katavorioDrag;
      }
    }
  }]);
  return Collicat;
}();

function _isInsideParent(instance, _el, pos) {
  var p = _el.parentNode,
      s = instance.getSize(p),
      ss = instance.getSize(_el),
      leftEdge = pos.x,
      rightEdge = leftEdge + ss.w,
      topEdge = pos.y,
      bottomEdge = topEdge + ss.h;
  return rightEdge > 0 && leftEdge < s.w && bottomEdge > 0 && topEdge < s.h;
}
var CLASS_DELEGATED_DRAGGABLE = "jtk-delegated-draggable";
var CLASS_DRAGGABLE$1 = "jtk-draggable";
var CLASS_DRAG_CONTAINER = "jtk-drag";
var CLASS_GHOST_PROXY = "jtk-ghost-proxy";
var CLASS_DRAG_SELECTED = "jtk-drag-selected";
var CLASS_DRAG_ACTIVE = "jtk-drag-active";
var CLASS_DRAGGED = "jtk-dragged";
var CLASS_DRAG_HOVER = "jtk-drag-hover";
var EVENT_DRAG_MOVE = "drag:move";
var EVENT_DRAG_STOP = "drag:stop";
var EVENT_DRAG_START = "drag:start";
var EVENT_MOUSEDOWN = "mousedown";
var EVENT_MOUSEMOVE = "mousemove";
var EVENT_MOUSEUP = "mouseup";
var EVENT_REVERT = "revert";
var EVENT_ZOOM = "zoom";
var EVENT_CONNECTION_ABORT = "connection:abort";
var EVENT_CONNECTION_DRAG = "connection:drag";
var DragManager =
function () {
  function DragManager(instance, options) {
    var _this = this;
    _classCallCheck(this, DragManager);
    this.instance = instance;
    _defineProperty(this, "collicat", void 0);
    _defineProperty(this, "drag", void 0);
    _defineProperty(this, "_draggables", {});
    _defineProperty(this, "_dlist", []);
    _defineProperty(this, "_elementsWithEndpoints", {});
    _defineProperty(this, "_draggablesForElements", {});
    _defineProperty(this, "handlers", []);
    _defineProperty(this, "_trackScroll", void 0);
    _defineProperty(this, "_filtersToAdd", []);
    this.collicat = new Collicat({
      zoom: this.instance.currentZoom,
      css: {
        noSelect: this.instance.dragSelectClass,
        delegatedDraggable: CLASS_DELEGATED_DRAGGABLE,
        draggable: CLASS_DRAGGABLE$1,
        drag: CLASS_DRAG_CONTAINER,
        selected: CLASS_DRAG_SELECTED,
        active: CLASS_DRAG_ACTIVE,
        hover: CLASS_DRAG_HOVER,
        ghostProxy: CLASS_GHOST_PROXY
      }
    });
    this.instance.bind(EVENT_ZOOM, function (z) {
      _this.collicat.setZoom(z);
    });
    options = options || {};
    this._trackScroll = options.trackScroll !== false;
  }
  _createClass(DragManager, [{
    key: "addHandler",
    value: function addHandler(handler, dragOptions) {
      var _this2 = this;
      var o = extend({
        selector: handler.selector
      }, dragOptions || {});
      o.start = wrap(o.start, function (p) {
        return handler.onStart(p);
      });
      o.drag = wrap(o.drag, function (p) {
        return handler.onDrag(p);
      });
      o.stop = wrap(o.stop, function (p) {
        return handler.onStop(p);
      });
      o.beforeStart = (handler.onBeforeStart || function (p) {}).bind(handler);
      o.dragInit = function (el) {
        return handler.onDragInit(el);
      };
      o.dragAbort = function (el) {
        return handler.onDragAbort(el);
      };
      if (handler.useGhostProxy) {
        o.useGhostProxy = handler.useGhostProxy;
        o.makeGhostProxy = handler.makeGhostProxy;
      }
      if (o.constrainFunction == null && o.containment != null) {
        switch (o.containment) {
          case "notNegative":
            {
              o.constrainFunction = function (pos, dragEl, _constrainRect, _size) {
                return {
                  x: Math.max(0, Math.min(pos.x)),
                  y: Math.max(0, Math.min(pos.y))
                };
              };
              break;
            }
          case "parent":
            {
              var padding = o.containmentPadding || 5;
              o.constrainFunction = function (pos, dragEl, _constrainRect, _size) {
                var x = pos.x < 0 ? 0 : pos.x > _constrainRect.w - padding ? _constrainRect.w - padding : pos.x;
                var y = pos.y < 0 ? 0 : pos.y > _constrainRect.h - padding ? _constrainRect.h - padding : pos.y;
                return {
                  x: x,
                  y: y
                };
              };
              break;
            }
          case "parentEnclosed":
            {
              o.constrainFunction = function (pos, dragEl, _constrainRect, _size) {
                var x = pos.x < 0 ? 0 : pos.x + _size.w > _constrainRect.w ? _constrainRect.w - _size.w : pos.x;
                var y = pos.y < 0 ? 0 : pos.y + _size.h > _constrainRect.h ? _constrainRect.h - _size.h : pos.y;
                return {
                  x: x,
                  y: y
                };
              };
              break;
            }
        }
      }
      if (this.drag == null) {
        o.trackScroll = this._trackScroll;
        this.drag = this.collicat.draggable(this.instance.getContainer(), o);
        forEach(this._filtersToAdd, function (filterToAdd) {
          return _this2.drag.addFilter(filterToAdd[0], filterToAdd[1]);
        });
        this.drag.on(EVENT_REVERT, function (el) {
          _this2.instance.revalidate(el);
        });
      } else {
        this.drag.addSelector(o);
      }
      this.handlers.push({
        handler: handler,
        options: o
      });
      handler.init(this.drag);
    }
  }, {
    key: "addFilter",
    value: function addFilter(filter, exclude) {
      if (this.drag == null) {
        this._filtersToAdd.push([filter, exclude === true]);
      } else {
        this.drag.addFilter(filter, exclude);
      }
    }
  }, {
    key: "removeFilter",
    value: function removeFilter(filter) {
      if (this.drag != null) {
        this.drag.removeFilter(filter);
      }
    }
  }, {
    key: "setFilters",
    value: function setFilters(filters) {
      var _this3 = this;
      forEach(filters, function (f) {
        _this3.drag.addFilter(f[0], f[1]);
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      var out = [];
      forEach(this.handlers, function (p) {
        p.handler.reset();
      });
      if (this.drag != null) {
        var currentFilters = this.drag._filters;
        for (var f in currentFilters) {
          out.push([f, currentFilters[f][1]]);
        }
        this.collicat.destroyDraggable(this.instance.getContainer());
      }
      delete this.drag;
      return out;
    }
  }, {
    key: "setOption",
    value: function setOption(handler, options) {
      debugger;
      var handlerAndOptions = getWithFunction(this.handlers, function (p) {
        return p.handler === handler;
      });
      if (handlerAndOptions != null) {
        extend(handlerAndOptions.options, options || {});
      }
    }
  }]);
  return DragManager;
}();

function decodeDragGroupSpec(instance, spec) {
  if (isString(spec)) {
    return {
      id: spec,
      active: true
    };
  } else {
    return {
      id: instance.getId(spec),
      active: spec.active
    };
  }
}
function isActiveDragGroupMember(dragGroup, el) {
  var details = getFromSetWithFunction(dragGroup.members, function (m) {
    return m.el === el;
  });
  if (details !== null) {
    return details.active === true;
  } else {
    return false;
  }
}
var ElementDragHandler =
function () {
  function ElementDragHandler(instance) {
    _classCallCheck(this, ElementDragHandler);
    this.instance = instance;
    _defineProperty(this, "selector", "> " + SELECTOR_MANAGED_ELEMENT + ":not(" + cls(CLASS_OVERLAY) + ")");
    _defineProperty(this, "_dragOffset", null);
    _defineProperty(this, "_groupLocations", []);
    _defineProperty(this, "_intersectingGroups", []);
    _defineProperty(this, "_currentDragParentGroup", null);
    _defineProperty(this, "_dragGroupByElementIdMap", {});
    _defineProperty(this, "_dragGroupMap", {});
    _defineProperty(this, "_currentDragGroup", null);
    _defineProperty(this, "_currentDragGroupOffsets", new Map());
    _defineProperty(this, "_currentDragGroupSizes", new Map());
    _defineProperty(this, "_dragSelection", []);
    _defineProperty(this, "_dragSelectionOffsets", new Map());
    _defineProperty(this, "_dragSizes", new Map());
    _defineProperty(this, "drag", void 0);
    _defineProperty(this, "originalPosition", void 0);
  }
  _createClass(ElementDragHandler, [{
    key: "onDragInit",
    value: function onDragInit(el) {
      return null;
    }
  }, {
    key: "onDragAbort",
    value: function onDragAbort(el) {
      return null;
    }
  }, {
    key: "onStop",
    value: function onStop(params) {
      var _this = this;
      var _one = function _one(_el, pos) {
        var redrawResult = _this.instance.setElementPosition(_el, pos.x, pos.y);
        _this.instance.fire(EVENT_DRAG_STOP, {
          el: _el,
          e: params.e,
          pos: pos,
          r: redrawResult,
          originalPosition: _this.originalPosition
        });
        _this.instance.removeClass(_el, CLASS_DRAGGED);
        _this.instance.select({
          source: _el
        }).removeClass(_this.instance.elementDraggingClass + " " + _this.instance.sourceElementDraggingClass, true);
        _this.instance.select({
          target: _el
        }).removeClass(_this.instance.elementDraggingClass + " " + _this.instance.targetElementDraggingClass, true);
      };
      var dragElement = params.drag.getDragElement();
      _one(dragElement, params.finalPos);
      this._dragSelectionOffsets.forEach(function (v, k) {
        if (v[1] !== params.el) {
          var pp = {
            x: params.finalPos.x + v[0].x,
            y: params.finalPos.y + v[0].y
          };
          _one(v[1], pp);
        }
      });
      if (this._intersectingGroups.length > 0) {
        var targetGroup = this._intersectingGroups[0].group;
        var intersectingElement = this._intersectingGroups[0].intersectingElement;
        var currentGroup = intersectingElement._jsPlumbParentGroup;
        if (currentGroup !== targetGroup) {
          if (currentGroup != null) {
            if (currentGroup.overrideDrop(intersectingElement, targetGroup)) {
              return;
            }
          }
          this.instance.groupManager.addToGroup(targetGroup, false, intersectingElement);
        }
      }
      this._cleanup();
    }
  }, {
    key: "_cleanup",
    value: function _cleanup() {
      var _this2 = this;
      forEach(this._groupLocations, function (groupLoc) {
        _this2.instance.removeClass(groupLoc.el, CLASS_DRAG_ACTIVE);
        _this2.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
      });
      this._currentDragParentGroup = null;
      this._groupLocations.length = 0;
      this.instance.hoverSuspended = false;
      this._dragOffset = null;
      this._dragSelectionOffsets.clear();
      this._dragSizes.clear();
      this._currentDragGroupOffsets.clear();
      this._currentDragGroupSizes.clear();
      this._currentDragGroup = null;
    }
  }, {
    key: "reset",
    value: function reset() {}
  }, {
    key: "init",
    value: function init(drag) {
      this.drag = drag;
    }
  }, {
    key: "onDrag",
    value: function onDrag(params) {
      var _this3 = this;
      var el = params.drag.getDragElement();
      var finalPos = params.pos;
      var elSize = this.instance.getSize(el);
      var ui = {
        x: finalPos.x,
        y: finalPos.y
      };
      this._intersectingGroups.length = 0;
      if (this._dragOffset != null) {
        ui.x += this._dragOffset.x;
        ui.y += this._dragOffset.y;
      }
      var _one = function _one(el, bounds, e) {
        var ancestorsOfIntersectingGroups = new Set();
        forEach(_this3._groupLocations, function (groupLoc) {
          if (!ancestorsOfIntersectingGroups.has(groupLoc.group.id) && intersects(bounds, groupLoc.r)) {
            if (groupLoc.group !== _this3._currentDragParentGroup) {
              _this3.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER);
            }
            _this3._intersectingGroups.push({
              group: groupLoc.group,
              intersectingElement: params.drag.getDragElement(true),
              d: 0
            });
            forEach(_this3.instance.groupManager.getAncestors(groupLoc.group), function (g) {
              return ancestorsOfIntersectingGroups.add(g.id);
            });
          } else {
            _this3.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
          }
        });
        _this3.instance.setElementPosition(el, bounds.x, bounds.y);
        _this3.instance.fire(EVENT_DRAG_MOVE, {
          el: el,
          e: params.e,
          pos: {
            x: bounds.x,
            y: bounds.y
          },
          originalPosition: _this3.originalPosition
        });
      };
      var elBounds = {
        x: ui.x,
        y: ui.y,
        w: elSize.w,
        h: elSize.h
      };
      _one(el, elBounds, params.e);
      this._dragSelectionOffsets.forEach(function (v, k) {
        var s = _this3._dragSizes.get(k);
        var _b = {
          x: elBounds.x + v[0].x,
          y: elBounds.y + v[0].y,
          w: s.w,
          h: s.h
        };
        v[1].style.left = _b.x + "px";
        v[1].style.top = _b.y + "px";
        _one(v[1], _b, params.e);
      });
      this._currentDragGroupOffsets.forEach(function (v, k) {
        var s = _this3._currentDragGroupSizes.get(k);
        var _b = {
          x: elBounds.x + v[0].x,
          y: elBounds.y + v[0].y,
          w: s.w,
          h: s.h
        };
        v[1].style.left = _b.x + "px";
        v[1].style.top = _b.y + "px";
        _one(v[1], _b, params.e);
      });
    }
  }, {
    key: "onStart",
    value: function onStart(params) {
      var _this4 = this;
      var el = params.drag.getDragElement();
      var elOffset = this.instance.getOffset(el);
      this.originalPosition = {
        x: params.pos.x,
        y: params.pos.y
      };
      if (el._jsPlumbParentGroup) {
        this._dragOffset = this.instance.getOffset(el.offsetParent);
        this._currentDragParentGroup = el._jsPlumbParentGroup;
      }
      var cont = true;
      var nd = el.getAttribute(ATTRIBUTE_NOT_DRAGGABLE);
      if (this.instance.elementsDraggable === false || nd != null && nd !== FALSE$1) {
        cont = false;
      }
      if (cont) {
        this._groupLocations.length = 0;
        this._intersectingGroups.length = 0;
        this.instance.hoverSuspended = true;
        this._dragSelectionOffsets.clear();
        this._dragSizes.clear();
        forEach(this._dragSelection, function (jel) {
          var id = _this4.instance.getId(jel);
          var off = _this4.instance.getOffset(jel);
          _this4._dragSelectionOffsets.set(id, [{
            x: off.x - elOffset.x,
            y: off.y - elOffset.y
          }, jel]);
          _this4._dragSizes.set(id, _this4.instance.getSize(jel));
        });
        var _one = function _one(_el) {
          if (!_el._isJsPlumbGroup || _this4.instance.allowNestedGroups) {
            var isNotInAGroup = !_el._jsPlumbParentGroup;
            var membersAreDroppable = isNotInAGroup || _el._jsPlumbParentGroup.dropOverride !== true;
            var isGhostOrNotConstrained = !isNotInAGroup && (_el._jsPlumbParentGroup.ghost || _el._jsPlumbParentGroup.constrain !== true);
            if (isNotInAGroup || membersAreDroppable && isGhostOrNotConstrained) {
              forEach(_this4.instance.groupManager.getGroups(), function (group) {
                var elementGroup = _el._jsPlumbGroup;
                if (group.droppable !== false && group.enabled !== false && _el._jsPlumbGroup !== group && !_this4.instance.groupManager.isDescendant(group, elementGroup)) {
                  var groupEl = group.el,
                      s = _this4.instance.getSize(groupEl),
                      o = _this4.instance.getOffset(groupEl),
                      boundingRect = {
                    x: o.x,
                    y: o.y,
                    w: s.w,
                    h: s.h
                  };
                  _this4._groupLocations.push({
                    el: groupEl,
                    r: boundingRect,
                    group: group
                  });
                  if (group !== _this4._currentDragParentGroup) {
                    _this4.instance.addClass(groupEl, CLASS_DRAG_ACTIVE);
                  }
                }
              });
              _this4._groupLocations.sort(function (a, b) {
                if (_this4.instance.groupManager.isDescendant(a.group, b.group)) {
                  return -1;
                } else if (_this4.instance.groupManager.isAncestor(b.group, a.group)) {
                  return 1;
                } else {
                  return 0;
                }
              });
            }
          }
          _this4.instance.select({
            source: _el
          }).addClass(_this4.instance.elementDraggingClass + " " + _this4.instance.sourceElementDraggingClass, true);
          _this4.instance.select({
            target: _el
          }).addClass(_this4.instance.elementDraggingClass + " " + _this4.instance.targetElementDraggingClass, true);
          return _this4.instance.fire(EVENT_DRAG_START, {
            el: _el,
            e: params.e,
            originalPosition: _this4.originalPosition,
            pos: _this4.originalPosition
          });
        };
        var elId = this.instance.getId(el);
        this._currentDragGroup = this._dragGroupByElementIdMap[elId];
        if (this._currentDragGroup && !isActiveDragGroupMember(this._currentDragGroup, el)) {
          this._currentDragGroup = null;
        }
        var dragStartReturn = _one(el);
        if (dragStartReturn === false) {
          this._cleanup();
          return false;
        }
        if (this._currentDragGroup != null) {
          this._currentDragGroupOffsets.clear();
          this._currentDragGroupSizes.clear();
          this._currentDragGroup.members.forEach(function (jel) {
            var off = _this4.instance.getOffset(jel.el);
            _this4._currentDragGroupOffsets.set(jel.elId, [{
              x: off.x - elOffset.x,
              y: off.y - elOffset.y
            }, jel.el]);
            _this4._currentDragGroupSizes.set(jel.elId, _this4.instance.getSize(jel.el));
            _one(jel.el);
          });
        }
      }
      return cont;
    }
  }, {
    key: "addToDragSelection",
    value: function addToDragSelection(el) {
      var domElement = el;
      if (this._dragSelection.indexOf(domElement) === -1) {
        this.instance.addClass(el, CLASS_DRAG_SELECTED);
        this._dragSelection.push(domElement);
      }
    }
  }, {
    key: "clearDragSelection",
    value: function clearDragSelection() {
      var _this5 = this;
      forEach(this._dragSelection, function (el) {
        return _this5.instance.removeClass(el, CLASS_DRAG_SELECTED);
      });
      this._dragSelection.length = 0;
    }
  }, {
    key: "removeFromDragSelection",
    value: function removeFromDragSelection(el) {
      var _this6 = this;
      var domElement = el;
      this._dragSelection = this._dragSelection.filter(function (e) {
        var out = e !== domElement;
        if (!out) {
          _this6.instance.removeClass(e, CLASS_DRAG_SELECTED);
        }
        return out;
      });
    }
  }, {
    key: "toggleDragSelection",
    value: function toggleDragSelection(el) {
      var domElement = el;
      var isInSelection = this._dragSelection.indexOf(domElement) !== -1;
      if (isInSelection) {
        this.removeFromDragSelection(el);
      } else {
        this.addToDragSelection(el);
      }
    }
  }, {
    key: "getDragSelection",
    value: function getDragSelection() {
      return this._dragSelection;
    }
  }, {
    key: "addToDragGroup",
    value: function addToDragGroup(spec) {
      var _this7 = this;
      var details = decodeDragGroupSpec(this.instance, spec);
      var dragGroup = this._dragGroupMap[details.id];
      if (dragGroup == null) {
        dragGroup = {
          id: details.id,
          members: new Set()
        };
        this._dragGroupMap[details.id] = dragGroup;
      }
      for (var _len = arguments.length, els = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        els[_key - 1] = arguments[_key];
      }
      this.removeFromDragGroup.apply(this, els);
      forEach(els, function (el) {
        var elId = _this7.instance.getId(el);
        dragGroup.members.add({
          elId: elId,
          el: el,
          active: details.active
        });
        _this7._dragGroupByElementIdMap[elId] = dragGroup;
      });
    }
  }, {
    key: "removeFromDragGroup",
    value: function removeFromDragGroup() {
      var _this8 = this;
      for (var _len2 = arguments.length, els = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        els[_key2] = arguments[_key2];
      }
      forEach(els, function (el) {
        var id = _this8.instance.getId(el);
        var dragGroup = _this8._dragGroupByElementIdMap[id];
        if (dragGroup != null) {
          var s = new Set();
          dragGroup.members.forEach(function (member) {
            if (member.el !== el) {
              s.add(member);
            }
          });
          dragGroup.members = s;
          delete _this8._dragGroupByElementIdMap[id];
        }
      });
    }
  }, {
    key: "setDragGroupState",
    value: function setDragGroupState(state) {
      var _this9 = this;
      for (var _len3 = arguments.length, els = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        els[_key3 - 1] = arguments[_key3];
      }
      var elementIds = els.map(function (el) {
        return _this9.instance.getId(el);
      });
      forEach(elementIds, function (id) {
        optional(_this9._dragGroupByElementIdMap[id]).map(function (dragGroup) {
          optional(getFromSetWithFunction(dragGroup.members, function (m) {
            return m.elId === id;
          })).map(function (member) {
            member.active = state;
          });
        });
      });
    }
  }]);
  return ElementDragHandler;
}();

function _makeFloatingEndpoint(paintStyle, referenceAnchor, endpoint, referenceCanvas, sourceElement, instance, scope) {
  var floatingAnchor = new FloatingAnchor(instance, {
    reference: referenceAnchor,
    referenceCanvas: referenceCanvas
  });
  var p = {
    paintStyle: paintStyle,
    preparedAnchor: floatingAnchor,
    element: sourceElement,
    scope: scope
  };
  if (endpoint != null) {
    if (isAssignableFrom(endpoint, EndpointRepresentation)) {
      p.existingEndpoint = endpoint;
    } else {
      p.endpoint = endpoint;
    }
  }
  var ep = instance._internal_newEndpoint(p);
  instance.paintEndpoint(ep, {});
  return ep;
}
function selectorFilter(evt, _el, selector, _instance, negate) {
  var t = evt.target || evt.srcElement,
      ok = false,
      sel = _instance.getSelector(_el, selector);
  for (var j = 0; j < sel.length; j++) {
    if (sel[j] === t) {
      ok = true;
      break;
    }
  }
  return negate ? !ok : ok;
}
var SELECTOR_DRAG_ACTIVE_OR_HOVER = cls(CLASS_DRAG_ACTIVE, CLASS_DRAG_HOVER);
var EndpointDragHandler =
function () {
  function EndpointDragHandler(instance) {
    _classCallCheck(this, EndpointDragHandler);
    this.instance = instance;
    _defineProperty(this, "jpc", void 0);
    _defineProperty(this, "existingJpc", void 0);
    _defineProperty(this, "_originalAnchor", void 0);
    _defineProperty(this, "ep", void 0);
    _defineProperty(this, "endpointRepresentation", void 0);
    _defineProperty(this, "canvasElement", void 0);
    _defineProperty(this, "_activeDefinition", void 0);
    _defineProperty(this, "placeholderInfo", {
      id: null,
      element: null
    });
    _defineProperty(this, "floatingIndex", void 0);
    _defineProperty(this, "floatingId", void 0);
    _defineProperty(this, "floatingElement", void 0);
    _defineProperty(this, "floatingEndpoint", void 0);
    _defineProperty(this, "floatingAnchor", void 0);
    _defineProperty(this, "_stopped", void 0);
    _defineProperty(this, "inPlaceCopy", void 0);
    _defineProperty(this, "endpointDropTargets", []);
    _defineProperty(this, "currentDropTarget", null);
    _defineProperty(this, "payload", void 0);
    _defineProperty(this, "floatingConnections", {});
    _defineProperty(this, "_forceReattach", void 0);
    _defineProperty(this, "_forceDetach", void 0);
    _defineProperty(this, "mousedownHandler", void 0);
    _defineProperty(this, "mouseupHandler", void 0);
    _defineProperty(this, "selector", cls(CLASS_ENDPOINT));
    var container = instance.getContainer();
    this.mousedownHandler = this._mousedownHandler.bind(this);
    this.mouseupHandler = this._mouseupHandler.bind(this);
    instance.on(container, EVENT_MOUSEDOWN, SELECTOR_MANAGED_ELEMENT, this.mousedownHandler);
    instance.on(container, EVENT_MOUSEUP, SELECTOR_MANAGED_ELEMENT, this.mouseupHandler);
  }
  _createClass(EndpointDragHandler, [{
    key: "_mousedownHandler",
    value: function _mousedownHandler(e) {
      var targetEl;
      var sourceDef;
      if (e.which === 3 || e.button === 2) {
        return;
      }
      sourceDef = this._getSourceDefinitionFromInstance(e);
      if (sourceDef != null) {
        targetEl = findParent(e.target || e.srcElement, sourceDef.def.parentSelector || SELECTOR_MANAGED_ELEMENT, this.instance.getContainer());
        if (targetEl == null) {
          return;
        }
      } else {
        targetEl = findParent(e.target || e.srcElement, SELECTOR_MANAGED_ELEMENT, this.instance.getContainer());
        if (targetEl == null) {
          return;
        }
        sourceDef = this._getSourceDefinitionFromElement(targetEl, e);
      }
      if (sourceDef) {
        var sourceElement = e.currentTarget,
            def;
        consume(e);
        this._activeDefinition = sourceDef;
        def = sourceDef.def;
        var sourceCount = this.instance.select({
          source: targetEl
        }).length;
        if (sourceDef.maxConnections >= 0 && sourceCount >= sourceDef.maxConnections) {
          consume(e);
          if (def.onMaxConnections) {
            def.onMaxConnections({
              element: self,
              maxConnections: sourceDef.maxConnections
            }, e);
          }
          e.stopImmediatePropagation && e.stopImmediatePropagation();
          return false;
        }
        var elxy = getPositionOnElement(e, targetEl, this.instance.currentZoom);
        var tempEndpointParams = {};
        extend(tempEndpointParams, def);
        tempEndpointParams.isTemporarySource = true;
        tempEndpointParams.anchor = [elxy.x, elxy.y, 0, 0];
        if (def.scope) {
          tempEndpointParams.scope = def.scope;
        }
        this.ep = this.instance.addEndpoint(targetEl, tempEndpointParams);
        this.ep.deleteOnEmpty = true;
        this._originalAnchor = def.anchor || this.instance.Defaults.anchor;
        var payload = {};
        if (def.extract) {
          for (var att in def.extract) {
            var v = targetEl.getAttribute(att);
            if (v) {
              payload[def.extract[att]] = v;
            }
          }
          this.ep.mergeParameters(payload);
        }
        if (def.uniqueEndpoint) {
          if (!sourceDef.endpoint) {
            sourceDef.endpoint = this.ep;
            this.ep.deleteOnEmpty = false;
          } else {
            this.ep.finalEndpoint = sourceDef.endpoint;
          }
        }
        sourceElement._jsPlumbOrphanedEndpoints = sourceElement._jsPlumbOrphanedEndpoints || [];
        sourceElement._jsPlumbOrphanedEndpoints.push(this.ep);
        this.instance.trigger(this.ep.endpoint.canvas, EVENT_MOUSEDOWN, e, payload);
      }
    }
  }, {
    key: "_mouseupHandler",
    value: function _mouseupHandler(e) {
      var el = e.currentTarget || e.srcElement;
      if (el._jsPlumbOrphanedEndpoints) {
        each(el._jsPlumbOrphanedEndpoints, this.instance._maybePruneEndpoint.bind(this.instance));
        el._jsPlumbOrphanedEndpoints.length = 0;
      }
      this._activeDefinition = null;
    }
  }, {
    key: "onDragInit",
    value: function onDragInit(el) {
      var ipco = this.instance.getOffset(el),
          ips = this.instance.getSize(el);
      this._makeDraggablePlaceholder(ipco, ips);
      this.placeholderInfo.element.jtk = el.jtk;
      return this.placeholderInfo.element;
    }
  }, {
    key: "onDragAbort",
    value: function onDragAbort(el) {
      this._cleanupDraggablePlaceholder();
    }
  }, {
    key: "_makeDraggablePlaceholder",
    value: function _makeDraggablePlaceholder(ipco, ips) {
      this.placeholderInfo = this.placeholderInfo || {};
      var n = createElement("div", {
        position: "absolute"
      });
      this.instance._appendElement(n, this.instance.getContainer());
      var id = this.instance.getId(n);
      this.instance.setPosition(n, ipco);
      n.style.width = ips.w + "px";
      n.style.height = ips.h + "px";
      this.instance.manage(n);
      this.placeholderInfo.id = id;
      this.placeholderInfo.element = n;
      return n;
    }
  }, {
    key: "_cleanupDraggablePlaceholder",
    value: function _cleanupDraggablePlaceholder() {
      if (this.placeholderInfo.element) {
        this.instance.unmanage(this.placeholderInfo.element, true);
        delete this.placeholderInfo.element;
        delete this.placeholderInfo.id;
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      var c = this.instance.getContainer();
      this.instance.off(c, EVENT_MOUSEUP, this.mouseupHandler);
      this.instance.off(c, EVENT_MOUSEDOWN, this.mousedownHandler);
    }
  }, {
    key: "init",
    value: function init(drag) {}
  }, {
    key: "startNewConnectionDrag",
    value: function startNewConnectionDrag(scope, data) {
      this.jpc = this.instance._newConnection({
        sourceEndpoint: this.ep,
        targetEndpoint: this.floatingEndpoint,
        source: this.ep.element,
        target: this.placeholderInfo.element,
        paintStyle: this.ep.connectorStyle,
        hoverPaintStyle: this.ep.connectorHoverStyle,
        connector: this.ep.connector,
        overlays: this.ep.connectorOverlays,
        type: this.ep.connectionType,
        cssClass: this.ep.connectorClass,
        hoverClass: this.ep.connectorHoverClass,
        scope: scope,
        data: data
      });
      this.jpc.pending = true;
      this.jpc.addClass(this.instance.draggingClass);
      this.floatingEndpoint.addClass(this.instance.draggingClass);
      this.instance.fire(EVENT_CONNECTION_DRAG, this.jpc);
    }
  }, {
    key: "startExistingConnectionDrag",
    value: function startExistingConnectionDrag() {
      this.existingJpc = true;
      this.instance.setHover(this.jpc, false);
      var anchorIdx = this.jpc.endpoints[0].id === this.ep.id ? 0 : 1;
      this.ep.detachFromConnection(this.jpc, null, true);
      this.floatingEndpoint.addConnection(this.jpc);
      this.floatingEndpoint.addClass(this.instance.draggingClass);
      this.instance.fire(EVENT_CONNECTION_DRAG, this.jpc);
      this.instance.sourceOrTargetChanged(this.jpc.endpoints[anchorIdx].elementId, this.placeholderInfo.id, this.jpc, this.placeholderInfo.element, anchorIdx);
      this.jpc.suspendedEndpoint = this.jpc.endpoints[anchorIdx];
      this.jpc.suspendedElement = this.jpc.endpoints[anchorIdx].element;
      this.jpc.suspendedElementId = this.jpc.endpoints[anchorIdx].elementId;
      this.jpc.suspendedElementType = anchorIdx === 0 ? SOURCE : TARGET;
      this.instance.setHover(this.jpc.suspendedEndpoint, false);
      this.floatingEndpoint.referenceEndpoint = this.jpc.suspendedEndpoint;
      this.jpc.endpoints[anchorIdx] = this.floatingEndpoint;
      this.jpc.addClass(this.instance.draggingClass);
      this.floatingId = this.placeholderInfo.id;
      this.floatingIndex = anchorIdx;
    }
  }, {
    key: "_shouldStartDrag",
    value: function _shouldStartDrag() {
      var _continue = true;
      if (!this.ep.enabled) {
        _continue = false;
      }
      if (this.jpc == null && !this.ep.isSource && !this.ep.isTemporarySource) {
        _continue = false;
      }
      if (this.ep.isSource && this.ep.isFull() && !(this.jpc != null && this.ep.dragAllowedWhenFull)) {
        _continue = false;
      }
      if (this.jpc != null && !this.jpc.isDetachable(this.ep)) {
        if (this.ep.isFull()) {
          _continue = false;
        } else {
          this.jpc = null;
        }
      }
      var beforeDrag = this.instance.checkCondition(this.jpc == null ? INTERCEPT_BEFORE_DRAG : INTERCEPT_BEFORE_START_DETACH, {
        endpoint: this.ep,
        source: this.ep.element,
        sourceId: this.ep.elementId,
        connection: this.jpc
      });
      if (beforeDrag === false) {
        _continue = false;
      }
      else if (_typeof(beforeDrag) === "object") {
          extend(beforeDrag, this.payload || {});
        } else {
          beforeDrag = this.payload || {};
        }
      return [_continue, beforeDrag];
    }
  }, {
    key: "_createFloatingEndpoint",
    value: function _createFloatingEndpoint(canvasElement) {
      var endpointToFloat = this.ep.endpoint;
      if (this.ep.connectionType != null) {
        var aae = this.instance._deriveEndpointAndAnchorSpec(this.ep.connectionType);
        endpointToFloat = aae.endpoints[1];
      }
      var centerAnchor = makeAnchorFromSpec(this.instance, AnchorLocations.Center);
      centerAnchor.isFloating = true;
      this.floatingEndpoint = _makeFloatingEndpoint(this.ep.getPaintStyle(), centerAnchor, endpointToFloat, canvasElement, this.placeholderInfo.element, this.instance, this.ep.scope);
      this.floatingAnchor = this.floatingEndpoint.anchor;
      this.floatingEndpoint.deleteOnEmpty = true;
      this.floatingElement = this.floatingEndpoint.endpoint.canvas;
      this.floatingId = this.instance.getId(this.floatingElement);
    }
  }, {
    key: "_populateTargets",
    value: function _populateTargets(canvasElement) {
      var _this = this;
      var isSourceDrag = this.jpc && this.jpc.endpoints[0] === this.ep;
      var boundingRect;
      var matchingEndpoints = this.instance.getContainer().querySelectorAll([".", CLASS_ENDPOINT, "[", ATTRIBUTE_SCOPE_PREFIX, this.ep.scope, "]"].join(""));
      forEach(matchingEndpoints, function (candidate) {
        if ((_this.jpc != null || candidate !== canvasElement) && candidate !== _this.floatingElement) {
          if (isSourceDrag && candidate.jtk.endpoint.isSource || !isSourceDrag && candidate.jtk.endpoint.isTarget) {
            var o = _this.instance.getOffset(candidate),
                s = _this.instance.getSize(candidate);
            boundingRect = {
              x: o.x,
              y: o.y,
              w: s.w,
              h: s.h
            };
            _this.endpointDropTargets.push({
              el: candidate,
              r: boundingRect,
              endpoint: candidate.jtk.endpoint,
              def: null
            });
            _this.instance.addClass(candidate, CLASS_DRAG_ACTIVE);
          }
        }
      });
      var selectors = [];
      if (!isSourceDrag) {
        selectors.push([SELECTOR_JTK_TARGET, "[", ATTRIBUTE_SCOPE_PREFIX, this.ep.scope, "]"].join(""));
      } else {
        selectors.push([SELECTOR_JTK_SOURCE, "[", ATTRIBUTE_SCOPE_PREFIX, this.ep.scope, "]"].join(""));
      }
      var matchingElements = this.instance.getContainer().querySelectorAll(selectors.join(","));
      forEach(matchingElements, function (candidate) {
        var jel = candidate;
        var o = _this.instance.getOffset(candidate),
            s = _this.instance.getSize(candidate);
        boundingRect = {
          x: o.x,
          y: o.y,
          w: s.w,
          h: s.h
        };
        var d = {
          el: candidate,
          r: boundingRect
        };
        if (isSourceDrag) {
          var sourceDefinitionIdx = findWithFunction(candidate._jsPlumbSourceDefinitions, function (sdef) {
            return sdef.enabled !== false && (sdef.def.allowLoopback !== false || candidate !== _this.ep.element) && (_this._activeDefinition == null || _this._activeDefinition.def.allowLoopback !== false || candidate !== _this.ep.element);
          });
          if (sourceDefinitionIdx !== -1) {
            if (jel._jsPlumbSourceDefinitions[sourceDefinitionIdx].def.rank != null) {
              d.rank = jel._jsPlumbSourceDefinitions[sourceDefinitionIdx].def.rank;
            }
            d.def = jel._jsPlumbSourceDefinitions[sourceDefinitionIdx];
            _this.endpointDropTargets.push(d);
            _this.instance.addClass(candidate, CLASS_DRAG_ACTIVE);
          }
        } else {
          var targetDefinitionIndexes = findAllWithFunction(candidate._jsPlumbTargetDefinitions, function (tdef) {
            return tdef.enabled !== false && (tdef.def.allowLoopback !== false || candidate !== _this.ep.element) && (_this._activeDefinition == null || _this._activeDefinition.def.allowLoopback !== false || candidate !== _this.ep.element);
          });
          forEach(targetDefinitionIndexes, function (targetDefinitionIdx) {
            var d = {
              el: candidate,
              r: boundingRect
            };
            if (jel._jsPlumbTargetDefinitions[targetDefinitionIdx].def.rank != null) {
              d.rank = jel._jsPlumbTargetDefinitions[targetDefinitionIdx].def.rank;
            }
            d.def = jel._jsPlumbTargetDefinitions[targetDefinitionIdx];
            _this.endpointDropTargets.push(d);
          });
          if (targetDefinitionIndexes.length > 0) {
            _this.instance.addClass(candidate, CLASS_DRAG_ACTIVE);
          }
        }
      });
      if (isSourceDrag) {
        var sourceDef = getWithFunction(this.instance.sourceSelectors, function (sSel) {
          return sSel.isEnabled() && (sSel.def.def.scope == null || sSel.def.def.scope === _this.ep.scope);
        });
        if (sourceDef != null) {
          var targetZones = this.instance.getContainer().querySelectorAll(sourceDef.selector);
          forEach(targetZones, function (el) {
            var d = {
              r: null
            };
            d.el = findParent(el, SELECTOR_MANAGED_ELEMENT, _this.instance.getContainer(), true);
            var o = _this.instance.getOffset(d.el),
                s = _this.instance.getSize(d.el);
            d.r = {
              x: o.x,
              y: o.y,
              w: s.w,
              h: s.h
            };
            if (sourceDef.def.def.rank != null) {
              d.rank = sourceDef.def.def.rank;
            }
            d.def = sourceDef;
            _this.endpointDropTargets.push(d);
            _this.instance.addClass(d.el, CLASS_DRAG_ACTIVE);
          });
        }
      } else {
        var targetDefs = getAllWithFunction(this.instance.targetSelectors, function (tSel) {
          return tSel.isEnabled();
        });
        targetDefs.forEach(function (targetDef) {
          var targetZones = _this.instance.getContainer().querySelectorAll(targetDef.selector);
          forEach(targetZones, function (el) {
            var d = {
              r: null
            };
            d.el = findParent(el, SELECTOR_MANAGED_ELEMENT, _this.instance.getContainer(), true);
            if (targetDef.def.def.allowLoopback === false || _this._activeDefinition && _this._activeDefinition.def.allowLoopback === false) {
              if (d.el === _this.ep.element) {
                return;
              }
            }
            var o = _this.instance.getOffset(el),
                s = _this.instance.getSize(el);
            d.r = {
              x: o.x,
              y: o.y,
              w: s.w,
              h: s.h
            };
            d.def = targetDef.def;
            if (targetDef.def.def.rank != null) {
              d.rank = targetDef.def.def.rank;
            }
            _this.endpointDropTargets.push(d);
            _this.instance.addClass(d.el, CLASS_DRAG_ACTIVE);
          });
        });
      }
      this.endpointDropTargets.sort(function (a, b) {
        if (a.el._isJsPlumbGroup && !b.el._isJsPlumbGroup) {
          return 1;
        } else if (!a.el._isJsPlumbGroup && b.el._isJsPlumbGroup) {
          return -1;
        } else {
          if (a.rank != null && b.rank != null) {
            if (a.rank > b.rank) {
              return -1;
            } else if (a.rank < b.rank) {
              return 1;
            } else ;
          } else {
            return 0;
          }
        }
      });
    }
  }, {
    key: "onStart",
    value: function onStart(p) {
      this.endpointDropTargets.length = 0;
      this.currentDropTarget = null;
      this._stopped = false;
      var dragEl = p.drag.getDragElement();
      this.ep = dragEl.jtk.endpoint;
      if (!this.ep) {
        return false;
      }
      this.endpointRepresentation = this.ep.endpoint;
      this.canvasElement = this.endpointRepresentation.canvas;
      this.jpc = this.ep.connectorSelector();
      var _this$_shouldStartDra = this._shouldStartDrag(),
          _this$_shouldStartDra2 = _slicedToArray(_this$_shouldStartDra, 2),
          _continue = _this$_shouldStartDra2[0],
          payload = _this$_shouldStartDra2[1];
      if (_continue === false) {
        this._stopped = true;
        return false;
      }
      this.instance.setHover(this.ep, false);
      this.instance.isConnectionBeingDragged = true;
      if (this.jpc && !this.ep.isFull() && this.ep.isSource) {
        this.jpc = null;
      }
      this._createFloatingEndpoint(this.canvasElement);
      this._populateTargets(this.canvasElement);
      if (this.jpc == null) {
        this.startNewConnectionDrag(this.ep.scope, payload);
      } else {
        this.startExistingConnectionDrag();
      }
      this._registerFloatingConnection(this.placeholderInfo, this.jpc, this.floatingEndpoint);
      this.instance.currentlyDragging = true;
    }
  }, {
    key: "onBeforeStart",
    value: function onBeforeStart(beforeStartParams) {
      this.payload = beforeStartParams.e.payload || {};
    }
  }, {
    key: "onDrag",
    value: function onDrag(params) {
      if (this._stopped) {
        return true;
      }
      if (this.placeholderInfo.element) {
        var floatingElementSize = this.instance.getSize(this.floatingElement);
        this.instance.setElementPosition(this.placeholderInfo.element, params.pos.x, params.pos.y);
        var boundingRect = {
          x: params.pos.x,
          y: params.pos.y,
          w: floatingElementSize.w,
          h: floatingElementSize.h
        },
            newDropTarget,
            idx,
            _cont;
        for (var i = 0; i < this.endpointDropTargets.length; i++) {
          var cont = true,
              filter = this.endpointDropTargets[i].def ? this.endpointDropTargets[i].def.def.filter : null,
              filterExclude = filter != null ? this.endpointDropTargets[i].def.def.filterExclude : null;
          if (filter != null) {
            var r = selectorFilter(params.e, this.endpointDropTargets[i].el, filter, this.instance, filterExclude);
            if (r === false) {
              cont = false;
            }
          }
          if (cont && intersects(boundingRect, this.endpointDropTargets[i].r)) {
            newDropTarget = this.endpointDropTargets[i];
            break;
          }
        }
        if (newDropTarget !== this.currentDropTarget && this.currentDropTarget != null) {
          idx = this.getFloatingAnchorIndex(this.jpc);
          this.instance.removeClass(this.currentDropTarget.el, CLASS_DRAG_HOVER);
          if (this.currentDropTarget.endpoint) {
            this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropAllowedClass);
            this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropForbiddenClass);
          }
          this.floatingAnchor.out();
        }
        if (newDropTarget != null) {
          this.instance.addClass(newDropTarget.el, CLASS_DRAG_HOVER);
          idx = this.getFloatingAnchorIndex(this.jpc);
          if (newDropTarget.endpoint != null) {
            _cont = newDropTarget.endpoint.isSource && idx === 0 || newDropTarget.endpoint.isTarget && idx !== 0 || this.jpc.suspendedEndpoint && newDropTarget.endpoint.referenceEndpoint && newDropTarget.endpoint.referenceEndpoint.id === this.jpc.suspendedEndpoint.id;
            if (_cont) {
              var bb = this.instance.checkCondition(CHECK_DROP_ALLOWED, {
                sourceEndpoint: this.jpc.endpoints[idx],
                targetEndpoint: newDropTarget.endpoint.endpoint,
                connection: this.jpc
              });
              if (bb) {
                newDropTarget.endpoint.endpoint.addClass(this.instance.endpointDropAllowedClass);
                newDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropForbiddenClass);
              } else {
                newDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropAllowedClass);
                newDropTarget.endpoint.endpoint.addClass(this.instance.endpointDropForbiddenClass);
              }
              this.floatingAnchor.over(newDropTarget.endpoint.anchor, newDropTarget.endpoint);
            } else {
              newDropTarget = null;
            }
          }
        }
        this.currentDropTarget = newDropTarget;
      }
    }
  }, {
    key: "_maybeCleanup",
    value: function _maybeCleanup(ep) {
      if (ep._mtNew && ep.connections.length === 0) {
        this.instance.deleteEndpoint(ep);
      } else {
        delete ep._mtNew;
      }
    }
  }, {
    key: "_reattachOrDiscard",
    value: function _reattachOrDiscard(originalEvent) {
      var existingConnection = this.jpc.suspendedEndpoint != null;
      var idx = this.getFloatingAnchorIndex(this.jpc);
      if (existingConnection && this._shouldReattach(originalEvent)) {
        if (idx === 0) {
          this.jpc.source = this.jpc.suspendedElement;
          this.jpc.sourceId = this.jpc.suspendedElementId;
        } else {
          this.jpc.target = this.jpc.suspendedElement;
          this.jpc.targetId = this.jpc.suspendedElementId;
        }
        this._doForceReattach(idx);
        return true;
      } else {
        this._discard(idx, originalEvent);
        return false;
      }
    }
  }, {
    key: "onStop",
    value: function onStop(p) {
      var _this2 = this;
      var originalEvent = p.e;
      this.instance.isConnectionBeingDragged = false;
      this.instance.currentlyDragging = false;
      var classesToRemove = classList(CLASS_DRAG_HOVER, CLASS_DRAG_ACTIVE);
      var matchingSelectors = this.instance.getContainer().querySelectorAll(SELECTOR_DRAG_ACTIVE_OR_HOVER);
      forEach(matchingSelectors, function (el) {
        _this2.instance.removeClass(el, classesToRemove);
      });
      if (this.jpc && this.jpc.endpoints != null) {
        var existingConnection = this.jpc.suspendedEndpoint != null;
        var idx = this.getFloatingAnchorIndex(this.jpc);
        var suspendedEndpoint = this.jpc.suspendedEndpoint;
        var dropEndpoint;
        var discarded = false;
        if (this.currentDropTarget != null) {
          dropEndpoint = this._getDropEndpoint(p, this.jpc);
          if (dropEndpoint == null) {
            discarded = !this._reattachOrDiscard(p.e);
          } else {
            if (suspendedEndpoint && suspendedEndpoint.id === dropEndpoint.id) {
              this._doForceReattach(idx);
            } else {
              if (!dropEndpoint.enabled) {
                this._reattachOrDiscard(p.e);
              } else if (dropEndpoint.isFull()) {
                dropEndpoint.fire(EVENT_MAX_CONNECTIONS, {
                  endpoint: this,
                  connection: this.jpc,
                  maxConnections: this.instance.Defaults.maxConnections
                }, originalEvent);
                this._reattachOrDiscard(p.e);
              } else {
                if (idx === 0) {
                  this.jpc.source = dropEndpoint.element;
                  this.jpc.sourceId = dropEndpoint.elementId;
                } else {
                  this.jpc.target = dropEndpoint.element;
                  this.jpc.targetId = dropEndpoint.elementId;
                }
                var _doContinue = true;
                if (existingConnection && this.jpc.suspendedEndpoint.id !== dropEndpoint.id) {
                  if (!this.jpc.isDetachAllowed(this.jpc) || !this.jpc.endpoints[idx].isDetachAllowed(this.jpc) || !this.jpc.suspendedEndpoint.isDetachAllowed(this.jpc) || !this.instance.checkCondition("beforeDetach", this.jpc)) {
                    _doContinue = false;
                  }
                }
                _doContinue = _doContinue && dropEndpoint.isDropAllowed(this.jpc.sourceId, this.jpc.targetId, this.jpc.scope, this.jpc, dropEndpoint);
                if (_doContinue) {
                  this._drop(dropEndpoint, idx, originalEvent, _doContinue);
                } else {
                  this._reattachOrDiscard(p.e);
                }
              }
            }
          }
        } else {
          this._reattachOrDiscard(p.e);
        }
        this.instance.refreshEndpoint(this.ep);
        this.ep.removeClass(this.instance.draggingClass);
        this._cleanupDraggablePlaceholder();
        this.jpc.removeClass(this.instance.draggingClass);
        delete this.jpc.suspendedEndpoint;
        delete this.jpc.suspendedElement;
        delete this.jpc.suspendedElementType;
        delete this.jpc.suspendedElementId;
        delete this.jpc.suspendedIndex;
        delete this.floatingId;
        delete this.floatingIndex;
        delete this.floatingElement;
        delete this.floatingEndpoint;
        delete this.floatingAnchor;
        delete this.jpc.pending;
        if (dropEndpoint != null) {
          this._maybeCleanup(dropEndpoint);
        }
      }
    }
  }, {
    key: "_getSourceDefinitionFromElement",
    value: function _getSourceDefinitionFromElement(fromElement, evt, ignoreFilter) {
      var sourceDef;
      if (fromElement._jsPlumbSourceDefinitions) {
        for (var i = 0; i < fromElement._jsPlumbSourceDefinitions.length; i++) {
          sourceDef = fromElement._jsPlumbSourceDefinitions[i];
          if (sourceDef.enabled !== false) {
            if (!ignoreFilter && sourceDef.def.filter) {
              var r = isString(sourceDef.def.filter) ? selectorFilter(evt, fromElement, sourceDef.def.filter, this.instance, sourceDef.def.filterExclude) : sourceDef.def.filter(evt, fromElement);
              if (r !== false) {
                return sourceDef;
              }
            } else {
              return sourceDef;
            }
          }
        }
      }
    }
  }, {
    key: "_getSourceDefinitionFromInstance",
    value: function _getSourceDefinitionFromInstance(evt) {
      var selector;
      for (var i = 0; i < this.instance.sourceSelectors.length; i++) {
        selector = this.instance.sourceSelectors[i];
        if (selector.isEnabled()) {
          var r = selectorFilter(evt, this.instance.getContainer(), selector.selector, this.instance, selector.exclude);
          if (r !== false) {
            return selector.def;
          }
        }
      }
    }
  }, {
    key: "_getDropEndpoint",
    value: function _getDropEndpoint(p, jpc) {
      var dropEndpoint;
      if (this.currentDropTarget.endpoint == null) {
        var targetDefinition = this.currentDropTarget.def;
        if (targetDefinition == null) {
          return null;
        }
        var eps = this.instance._deriveEndpointAndAnchorSpec(jpc.getType().join(" "), true);
        var pp = eps.endpoints ? extend(p, {
          endpoint: targetDefinition.def.endpoint || eps.endpoints[1]
        }) : p;
        if (eps.anchors) {
          pp = extend(pp, {
            anchor: targetDefinition.def.anchor || eps.anchors[1]
          });
        }
        if (targetDefinition.def.parameters != null) {
          pp.parameters = targetDefinition.def.parameters;
        }
        if (targetDefinition.def.portId != null) {
          pp.portId = targetDefinition.def.portId;
        }
        dropEndpoint = this.instance.addEndpoint(this.currentDropTarget.el, pp);
        dropEndpoint._mtNew = true;
        dropEndpoint.deleteOnEmpty = true;
        if (targetDefinition.def.extract) {
          var tpayload = {};
          for (var att in targetDefinition.def.extract) {
            var v = this.currentDropTarget.el.getAttribute(att);
            if (v) {
              tpayload[targetDefinition.def.extract[att]] = v;
            }
          }
          dropEndpoint.parameters = tpayload;
        }
        if (dropEndpoint.anchor.positionFinder != null) {
          var finalPos = p.finalPos || p.pos;
          var dropPosition = {
            x: finalPos.x,
            y: finalPos.y
          };
          var elPosition = this.instance.getOffset(this.currentDropTarget.el),
              elSize = this.instance.getSize(this.currentDropTarget.el),
              ap = dropEndpoint.anchor.positionFinder(dropPosition, elPosition, elSize, dropEndpoint.anchor.constructorParams);
          dropEndpoint.anchor.x = ap[0];
          dropEndpoint.anchor.y = ap[1];
        }
      } else {
        dropEndpoint = this.currentDropTarget.endpoint;
      }
      if (dropEndpoint) {
        dropEndpoint.removeClass(this.instance.endpointDropAllowedClass);
        dropEndpoint.removeClass(this.instance.endpointDropForbiddenClass);
      }
      return dropEndpoint;
    }
  }, {
    key: "_doForceReattach",
    value: function _doForceReattach(idx) {
      this.floatingEndpoint.detachFromConnection(this.jpc, null, true);
      this.jpc.endpoints[idx] = this.jpc.suspendedEndpoint;
      this.instance.setHover(this.jpc, false);
      this.jpc._forceDetach = true;
      this.jpc.suspendedEndpoint.addConnection(this.jpc);
      this.instance.sourceOrTargetChanged(this.floatingId, this.jpc.suspendedEndpoint.elementId, this.jpc, this.jpc.suspendedEndpoint.element, idx);
      this.instance.deleteEndpoint(this.floatingEndpoint);
      this.instance.repaint(this.jpc.source);
      delete this.jpc._forceDetach;
    }
  }, {
    key: "_shouldReattach",
    value: function _shouldReattach(originalEvent) {
      return this.jpc.isReattach() || this.jpc._forceReattach || !functionChain(true, false, [[this.jpc.endpoints[0], IS_DETACH_ALLOWED, [this.jpc]], [this.jpc.endpoints[1], IS_DETACH_ALLOWED, [this.jpc]], [this.jpc, IS_DETACH_ALLOWED, [this.jpc]], [this.instance, CHECK_CONDITION, [INTERCEPT_BEFORE_DETACH, this.jpc]]]);
    }
  }, {
    key: "_discard",
    value: function _discard(idx, originalEvent) {
      if (this.jpc.pending) {
        this.instance.fire(EVENT_CONNECTION_ABORT, this.jpc, originalEvent);
      } else {
        if (idx === 0) {
          this.jpc.source = this.jpc.suspendedEndpoint.element;
          this.jpc.sourceId = this.jpc.suspendedEndpoint.elementId;
        } else {
          this.jpc.target = this.jpc.suspendedEndpoint.element;
          this.jpc.targetId = this.jpc.suspendedEndpoint.elementId;
        }
        this.jpc.endpoints[idx] = this.jpc.suspendedEndpoint;
      }
      if (this.floatingEndpoint) {
        this.floatingEndpoint.detachFromConnection(this.jpc);
      }
      this.instance.deleteConnection(this.jpc, {
        originalEvent: originalEvent,
        force: true
      });
    }
  }, {
    key: "_drop",
    value: function _drop(dropEndpoint, idx, originalEvent, optionalData) {
      this.jpc.endpoints[idx].detachFromConnection(this.jpc);
      if (this.jpc.suspendedEndpoint) {
        this.jpc.suspendedEndpoint.detachFromConnection(this.jpc);
      }
      this.jpc.endpoints[idx] = dropEndpoint;
      dropEndpoint.addConnection(this.jpc);
      this.jpc.mergeParameters(dropEndpoint.parameters);
      if (this.jpc.suspendedEndpoint) {
        var suspendedElementId = this.jpc.suspendedEndpoint.elementId;
        this.instance.fireMoveEvent({
          index: idx,
          originalSourceId: idx === 0 ? suspendedElementId : this.jpc.sourceId,
          newSourceId: idx === 0 ? dropEndpoint.elementId : this.jpc.sourceId,
          originalTargetId: idx === 1 ? suspendedElementId : this.jpc.targetId,
          newTargetId: idx === 1 ? dropEndpoint.elementId : this.jpc.targetId,
          originalEndpoint: this.jpc.suspendedEndpoint,
          connection: this.jpc,
          newEndpoint: dropEndpoint
        }, originalEvent);
      }
      if (idx === 1) {
        this.instance.sourceOrTargetChanged(this.floatingId, this.jpc.targetId, this.jpc, this.jpc.target, 1);
      } else {
        this.instance.sourceOrTargetChanged(this.floatingId, this.jpc.sourceId, this.jpc, this.jpc.source, 0);
      }
      if (this.jpc.endpoints[0].finalEndpoint) {
        var _toDelete = this.jpc.endpoints[0];
        _toDelete.detachFromConnection(this.jpc);
        this.jpc.endpoints[0] = this.jpc.endpoints[0].finalEndpoint;
        this.jpc.endpoints[0].addConnection(this.jpc);
      }
      if (IS.anObject(optionalData)) {
        this.jpc.mergeData(optionalData);
      }
      if (this._originalAnchor) {
        this.jpc.endpoints[0].setAnchor(this._originalAnchor);
        this._originalAnchor = null;
      }
      this.instance._finaliseConnection(this.jpc, null, originalEvent);
      this.instance.setHover(this.jpc, false);
      this.instance.revalidate(this.jpc.endpoints[0].element);
    }
  }, {
    key: "_registerFloatingConnection",
    value: function _registerFloatingConnection(info, conn, ep) {
      this.floatingConnections[info.id] = conn;
      addToDictionary(this.instance.endpointsByElement, info.id, ep);
    }
  }, {
    key: "getFloatingAnchorIndex",
    value: function getFloatingAnchorIndex(jpc) {
      return jpc.endpoints[0].isFloating() ? 0 : jpc.endpoints[1].isFloating() ? 1 : 1;
    }
  }]);
  return EndpointDragHandler;
}();

var GroupDragHandler =
function (_ElementDragHandler) {
  _inherits(GroupDragHandler, _ElementDragHandler);
  function GroupDragHandler(instance) {
    var _this;
    _classCallCheck(this, GroupDragHandler);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupDragHandler).call(this, instance));
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "selector", [">", SELECTOR_GROUP, SELECTOR_MANAGED_ELEMENT].join(" "));
    _defineProperty(_assertThisInitialized(_this), "doRevalidate", void 0);
    _this.doRevalidate = _this._revalidate.bind(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(GroupDragHandler, [{
    key: "reset",
    value: function reset() {
      this.drag.off(EVENT_REVERT, this.doRevalidate);
    }
  }, {
    key: "_revalidate",
    value: function _revalidate(el) {
      this.instance.revalidate(el);
    }
  }, {
    key: "init",
    value: function init(drag) {
      this.drag = drag;
      drag.on(EVENT_REVERT, this.doRevalidate);
    }
  }, {
    key: "useGhostProxy",
    value: function useGhostProxy(container, dragEl) {
      var group = dragEl._jsPlumbParentGroup;
      return group == null ? false : group.ghost === true;
    }
  }, {
    key: "makeGhostProxy",
    value: function makeGhostProxy(el) {
      var jel = el;
      var newEl = jel.cloneNode(true);
      newEl._jsPlumbParentGroup = jel._jsPlumbParentGroup;
      return newEl;
    }
  }, {
    key: "onDrag",
    value: function onDrag(params) {
      _get(_getPrototypeOf(GroupDragHandler.prototype), "onDrag", this).call(this, params);
    }
  }, {
    key: "onDragAbort",
    value: function onDragAbort(el) {
      return null;
    }
  }, {
    key: "onStop",
    value: function onStop(params) {
      var jel = params.el;
      var originalElement = params.drag.getDragElement(true);
      var originalGroup = jel._jsPlumbParentGroup,
          out = _get(_getPrototypeOf(GroupDragHandler.prototype), "onStop", this).call(this, params),
          currentGroup = jel._jsPlumbParentGroup;
      if (currentGroup === originalGroup) {
        this._pruneOrOrphan(params);
      } else {
        if (originalGroup.ghost) {
          var o1 = this.instance.getOffset(currentGroup.getContentArea());
          var o2 = this.instance.getOffset(originalGroup.getContentArea());
          var o = {
            x: o2.x + params.pos.x - o1.x,
            y: o2.y + params.pos.y - o1.y
          };
          originalElement.style.left = o.x + "px";
          originalElement.style.top = o.y + "px";
        }
      }
      this.instance.revalidate(originalElement);
      return out;
    }
  }, {
    key: "_isInsideParent",
    value: function _isInsideParent(_el, pos) {
      var p = _el.offsetParent,
          s = this.instance.getSize(p),
          ss = this.instance.getSize(_el),
          leftEdge = pos.x,
          rightEdge = leftEdge + ss.w,
          topEdge = pos.y,
          bottomEdge = topEdge + ss.h;
      return rightEdge > 0 && leftEdge < s.w && bottomEdge > 0 && topEdge < s.h;
    }
  }, {
    key: "_pruneOrOrphan",
    value: function _pruneOrOrphan(params) {
      var jel = params.el;
      var orphanedPosition = null;
      if (!this._isInsideParent(jel, params.pos)) {
        var group = jel._jsPlumbParentGroup;
        if (group.prune) {
          if (jel._isJsPlumbGroup) {
            this.instance.removeGroup(jel._jsPlumbGroup);
          } else {
            group.remove(params.el, true);
          }
        } else if (group.orphan) {
          orphanedPosition = this.instance.groupManager.orphan(params.el);
          if (jel._isJsPlumbGroup) {
            group.removeGroup(jel._jsPlumbGroup);
          } else {
            group.remove(params.el);
          }
        }
      }
      return orphanedPosition;
    }
  }]);
  return GroupDragHandler;
}(ElementDragHandler);

var SupportedEdge;
(function (SupportedEdge) {
  SupportedEdge[SupportedEdge["top"] = 0] = "top";
  SupportedEdge[SupportedEdge["bottom"] = 1] = "bottom";
})(SupportedEdge || (SupportedEdge = {}));
var DEFAULT_ANCHOR_LOCATIONS = new Map();
DEFAULT_ANCHOR_LOCATIONS.set(SupportedEdge.top, ["TopRight", "TopLeft"]);
DEFAULT_ANCHOR_LOCATIONS.set(SupportedEdge.bottom, ["BottomRight", "BottomLeft"]);
var DEFAULT_LIST_OPTIONS = {
  deriveAnchor: function deriveAnchor(edge, index, ep, conn) {
    return DEFAULT_ANCHOR_LOCATIONS.get(edge)[index];
  }
};
var ATTR_SCROLLABLE_LIST = "jtk-scrollable-list";
var SELECTOR_SCROLLABLE_LIST = "[" + ATTR_SCROLLABLE_LIST + "]";
var EVENT_SCROLL = "scroll";
var JsPlumbListManager =
function () {
  function JsPlumbListManager(instance, params) {
    var _this = this;
    _classCallCheck(this, JsPlumbListManager);
    this.instance = instance;
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "count", void 0);
    _defineProperty(this, "lists", void 0);
    this.count = 0;
    this.lists = {};
    this.options = params || {};
    this.instance.bind(EVENT_MANAGE_ELEMENT, function (p) {
      var scrollableLists = _this.instance.getSelector(p.el, SELECTOR_SCROLLABLE_LIST);
      for (var i = 0; i < scrollableLists.length; i++) {
        _this.addList(scrollableLists[i]);
      }
    });
    this.instance.bind(EVENT_UNMANAGE_ELEMENT, function (p) {
      _this.removeList(p.el);
    });
    this.instance.bind(EVENT_CONNECTION, function (params, evt) {
      if (evt == null) {
        var targetParent = _this.findParentList(params.target);
        if (targetParent != null) {
          targetParent.newConnection(params.connection, params.target, 1);
        }
        var sourceParent = _this.findParentList(params.source);
        if (sourceParent != null) {
          sourceParent.newConnection(params.connection, params.source, 0);
        }
      }
    });
    this.instance.bind(INTERCEPT_BEFORE_DROP, function (p) {
      var el = p.dropEndpoint.element;
      var dropList = _this.findParentList(el);
      return dropList == null || el.offsetTop >= dropList.domElement.scrollTop && el.offsetTop + el.offsetHeight <= dropList.domElement.scrollTop + dropList.domElement.offsetHeight;
    });
  }
  _createClass(JsPlumbListManager, [{
    key: "addList",
    value: function addList(el, options) {
      var dp = extend({}, DEFAULT_LIST_OPTIONS);
      extend(dp, this.options);
      options = extend(dp, options || {});
      var id = [this.instance._instanceIndex, this.count++].join("_");
      this.lists[id] = new JsPlumbList(this.instance, el, options, id);
      return this.lists[id];
    }
  }, {
    key: "getList",
    value: function getList(el) {
      var listId = this.instance.getAttribute(el, ATTR_SCROLLABLE_LIST);
      if (listId != null) {
        return this.lists[listId];
      }
    }
  }, {
    key: "removeList",
    value: function removeList(el) {
      var list = this.getList(el);
      if (list) {
        list.destroy();
        delete this.lists[list.id];
      }
    }
  }, {
    key: "findParentList",
    value: function findParentList(el) {
      var parent = el.parentNode,
          container = this.instance.getContainer(),
          parentList;
      while (parent != null && parent !== container && parent !== document) {
        parentList = this.getList(parent);
        if (parentList != null) {
          return parentList;
        }
        parent = parent.parentNode;
      }
    }
  }]);
  return JsPlumbListManager;
}();
var JsPlumbList =
function () {
  function JsPlumbList(instance, el, options, id) {
    _classCallCheck(this, JsPlumbList);
    this.instance = instance;
    this.el = el;
    this.options = options;
    this.id = id;
    _defineProperty(this, "_scrollHandler", void 0);
    _defineProperty(this, "domElement", void 0);
    _defineProperty(this, "elId", void 0);
    this.domElement = el;
    this.elId = this.instance.getId(el);
    instance.setAttribute(el, ATTR_SCROLLABLE_LIST, id);
    this._scrollHandler = this.scrollHandler.bind(this);
    this.domElement._jsPlumbScrollHandler = this._scrollHandler;
    instance.on(el, EVENT_SCROLL, this._scrollHandler);
    this._scrollHandler();
  }
  _createClass(JsPlumbList, [{
    key: "deriveAnchor",
    value: function deriveAnchor(edge, index, ep, conn) {
      return this.options.anchor ? this.options.anchor : this.options.deriveAnchor(edge, index, ep, conn);
    }
  }, {
    key: "deriveEndpoint",
    value: function deriveEndpoint(edge, index, ep, conn) {
      return this.options.deriveEndpoint ? this.options.deriveEndpoint(edge, index, ep, conn) : this.options.endpoint ? this.options.endpoint : ep.endpoint.getType();
    }
  }, {
    key: "newConnection",
    value: function newConnection(c, el, index) {
      if (el.offsetTop < this.el.scrollTop) {
        this._proxyConnection(el, c, index, SupportedEdge.top);
      } else if (el.offsetTop + el.offsetHeight > this.el.scrollTop + this.domElement.offsetHeight) {
        this._proxyConnection(el, c, index, SupportedEdge.bottom);
      }
    }
  }, {
    key: "scrollHandler",
    value: function scrollHandler() {
      var _this2 = this;
      var children = this.instance.getSelector(this.el, SELECTOR_MANAGED_ELEMENT);
      var elId = this.instance.getId(this.el);
      var _loop = function _loop(i) {
        if (children[i].offsetTop < _this2.el.scrollTop) {
          children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
          _this2.instance.select({
            source: children[i]
          }).each(function (c) {
            _this2._proxyConnection(children[i], c, 0, SupportedEdge.top);
          });
          _this2.instance.select({
            target: children[i]
          }).each(function (c) {
            _this2._proxyConnection(children[i], c, 1, SupportedEdge.top);
          });
        }
        else if (children[i].offsetTop + children[i].offsetHeight > _this2.el.scrollTop + _this2.domElement.offsetHeight) {
            children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
            _this2.instance.select({
              source: children[i]
            }).each(function (c) {
              _this2._proxyConnection(children[i], c, 0, SupportedEdge.bottom);
            });
            _this2.instance.select({
              target: children[i]
            }).each(function (c) {
              _this2._proxyConnection(children[i], c, 1, SupportedEdge.bottom);
            });
          } else if (children[i]._jsPlumbProxies) {
            for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
              _this2.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1]);
            }
            delete children[i]._jsPlumbProxies;
          }
        _this2.instance.revalidate(children[i]);
      };
      for (var i = 0; i < children.length; i++) {
        _loop(i);
      }
    }
  }, {
    key: "_proxyConnection",
    value: function _proxyConnection(el, conn, index,
    edge) {
      var _this3 = this;
      this.instance.proxyConnection(conn, index, this.domElement, function (c, index) {
        return _this3.deriveEndpoint(edge, index, conn.endpoints[index], conn);
      }, function (c, index) {
        return _this3.deriveAnchor(edge, index, conn.endpoints[index], conn);
      });
      el._jsPlumbProxies = el._jsPlumbProxies || [];
      el._jsPlumbProxies.push([conn, index]);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.instance.off(this.el, EVENT_SCROLL, this._scrollHandler);
      delete this.domElement._jsPlumbScrollHandler;
      var children = this.instance.getSelector(this.el, SELECTOR_MANAGED_ELEMENT);
      for (var i = 0; i < children.length; i++) {
        if (children[i]._jsPlumbProxies) {
          for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
            this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1]);
          }
          delete children[i]._jsPlumbProxies;
        }
      }
    }
  }]);
  return JsPlumbList;
}();

var HTMLElementOverlay =
function () {
  function HTMLElementOverlay(instance, overlay) {
    _classCallCheck(this, HTMLElementOverlay);
    this.instance = instance;
    this.overlay = overlay;
    _defineProperty(this, "htmlElementOverlay", void 0);
    this.htmlElementOverlay = overlay;
  }
  _createClass(HTMLElementOverlay, null, [{
    key: "createElement",
    value: function createElement$1(o) {
      var el = createElement("div", {}, o.instance.overlayClass + " " + (o.cssClass ? o.cssClass : ""));
      o.instance.setAttribute(el, "jtk-overlay-id", o.id);
      return el;
    }
  }, {
    key: "getElement",
    value: function getElement(o, component, elementCreator) {
      if (o.canvas == null) {
        if (elementCreator && component) {
          o.canvas = elementCreator(component);
        } else {
          o.canvas = HTMLElementOverlay.createElement(o);
        }
        o.canvas.style.position = "absolute";
        o.instance._appendElement(o.canvas, o.instance.getContainer());
        o.instance.getId(o.canvas);
        var ts = "translate(-50%, -50%)";
        o.canvas.style.webkitTransform = ts;
        o.canvas.style.mozTransform = ts;
        o.canvas.style.msTransform = ts;
        o.canvas.style.oTransform = ts;
        o.canvas.style.transform = ts;
        if (!o.isVisible()) {
          o.canvas.style.display = "none";
        }
        o.canvas.jtk = {
          overlay: o
        };
      }
      return o.canvas;
    }
  }, {
    key: "destroy",
    value: function destroy(o) {
      var el = HTMLElementOverlay.getElement(o);
      el.parentNode.removeChild(el);
      delete o.canvas;
      delete o.cachedDimensions;
    }
  }, {
    key: "_getDimensions",
    value: function _getDimensions(o, forceRefresh) {
      if (o.cachedDimensions == null || forceRefresh) {
        o.cachedDimensions = {
          w: 1,
          h: 1
        };
      }
      return o.cachedDimensions;
    }
  }]);
  return HTMLElementOverlay;
}();

var SVGElementOverlay =
function (_Overlay) {
  _inherits(SVGElementOverlay, _Overlay);
  function SVGElementOverlay() {
    var _getPrototypeOf2;
    var _this;
    _classCallCheck(this, SVGElementOverlay);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SVGElementOverlay)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _defineProperty(_assertThisInitialized(_this), "path", void 0);
    return _this;
  }
  _createClass(SVGElementOverlay, null, [{
    key: "ensurePath",
    value: function ensurePath(o) {
      if (o.path == null) {
        o.path = _node("path", {
          "jtk-overlay-id": o.id
        });
        var parent = null;
        if (o.component instanceof Connection) {
          var connector = o.component.getConnector();
          parent = connector != null ? connector.canvas : null;
        } else if (o.component instanceof Endpoint) {
          var endpoint = o.component.endpoint;
          parent = endpoint != null ? endpoint.svg : endpoint;
        }
        if (parent != null) {
          _appendAtIndex(parent, o.path, 1);
        }
        o.instance.addClass(o.path, o.instance.overlayClass);
        o.path.jtk = {
          overlay: o
        };
      }
      return o.path;
    }
  }, {
    key: "paint",
    value: function paint(o, path, params, extents) {
      this.ensurePath(o);
      var offset = [0, 0];
      if (extents.xmin < 0) {
        offset[0] = -extents.xmin;
      }
      if (extents.ymin < 0) {
        offset[1] = -extents.ymin;
      }
      var a = {
        "d": path,
        stroke: params.stroke ? params.stroke : null,
        fill: params.fill ? params.fill : null,
        transform: "translate(" + offset[0] + "," + offset[1] + ")",
        "pointer-events": "visibleStroke"
      };
      _attr(o.path, a);
    }
  }, {
    key: "destroy",
    value: function destroy(o, force) {
      var _o = o;
      if (_o.path != null && _o.path.parentNode != null) {
        _o.path.parentNode.removeChild(_o.path);
      }
      if (_o.bgPath != null && _o.bgPath.parentNode != null) {
        _o.bgPath.parentNode.removeChild(_o.bgPath);
      }
      delete _o.path;
      delete _o.bgPath;
    }
  }]);
  return SVGElementOverlay;
}(Overlay);

var SvgComponent =
function () {
  function SvgComponent() {
    _classCallCheck(this, SvgComponent);
  }
  _createClass(SvgComponent, null, [{
    key: "paint",
    value: function paint(connector, useDivWrapper, paintStyle, extents) {
      if (paintStyle != null) {
        var xy = [connector.x, connector.y],
            wh = [connector.w, connector.h],
            p;
        if (extents != null) {
          if (extents.xmin < 0) {
            xy[0] += extents.xmin;
          }
          if (extents.ymin < 0) {
            xy[1] += extents.ymin;
          }
          wh[0] = extents.xmax + (extents.xmin < 0 ? -extents.xmin : 0);
          wh[1] = extents.ymax + (extents.ymin < 0 ? -extents.ymin : 0);
        }
        if (isFinite(wh[0]) && isFinite(wh[1])) {
          if (useDivWrapper) {
            _size(connector.canvas, xy[0], xy[1], wh[0], wh[1]);
            xy[0] = 0;
            xy[1] = 0;
            p = _pos([0, 0]);
            _attr(connector.svg, {
              "style": p,
              "width": "" + (wh[0] || 0),
              "height": "" + (wh[1] || 0)
            });
          } else {
            p = _pos([xy[0], xy[1]]);
            _attr(connector.canvas, {
              "style": p,
              "width": "" + (wh[0] || 0),
              "height": "" + (wh[1] || 0)
            });
          }
        }
      }
    }
  }]);
  return SvgComponent;
}();

var SvgElementConnector =
function () {
  function SvgElementConnector() {
    _classCallCheck(this, SvgElementConnector);
  }
  _createClass(SvgElementConnector, null, [{
    key: "paint",
    value: function paint(connector, paintStyle, extents) {
      this.getConnectorElement(connector);
      SvgComponent.paint(connector, false, paintStyle, extents);
      var segments = connector.getSegments();
      var p = "",
          offset = [0, 0];
      if (extents.xmin < 0) {
        offset[0] = -extents.xmin;
      }
      if (extents.ymin < 0) {
        offset[1] = -extents.ymin;
      }
      if (segments.length > 0) {
        p = connector.getPathData();
        var a = {
          d: p,
          transform: "translate(" + offset[0] + "," + offset[1] + ")",
          "pointer-events": "visibleStroke"
        },
            outlineStyle = null,
            d = [connector.x, connector.y, connector.w, connector.h];
        if (paintStyle.outlineStroke) {
          var outlineWidth = paintStyle.outlineWidth || 1,
              outlineStrokeWidth = paintStyle.strokeWidth + 2 * outlineWidth;
          outlineStyle = extend({}, paintStyle);
          outlineStyle.stroke = paintStyle.outlineStroke;
          outlineStyle.strokeWidth = outlineStrokeWidth;
          if (connector.bgPath == null) {
            connector.bgPath = _node("path", a);
            connector.instance.addClass(connector.bgPath, connector.instance.connectorOutlineClass);
            _appendAtIndex(connector.canvas, connector.bgPath, 0);
          } else {
            _attr(connector.bgPath, a);
          }
          _applyStyles(connector.canvas, connector.bgPath, outlineStyle);
        }
        if (connector.path == null) {
          connector.path = _node("path", a);
          _appendAtIndex(connector.canvas, connector.path, paintStyle.outlineStroke ? 1 : 0);
        } else {
          _attr(connector.path, a);
        }
        _applyStyles(connector.canvas, connector.path, paintStyle);
      }
    }
  }, {
    key: "getConnectorElement",
    value: function getConnectorElement(c) {
      if (c.canvas != null) {
        return c.canvas;
      } else {
        var svg = _node("svg", {
          "style": "",
          "width": "0",
          "height": "0",
          "pointer-events": "none",
          "position": "absolute"
        });
        c.canvas = svg;
        c.instance._appendElement(c.canvas, c.instance.getContainer());
        if (c.cssClass != null) {
          c.instance.addClass(svg, c.cssClass);
        }
        c.instance.addClass(svg, c.instance.connectorClass);
        svg.jtk = svg.jtk || {};
        svg.jtk.connector = c;
        return svg;
      }
    }
  }]);
  return SvgElementConnector;
}();

var SvgEndpoint =
function () {
  function SvgEndpoint() {
    _classCallCheck(this, SvgEndpoint);
  }
  _createClass(SvgEndpoint, null, [{
    key: "getEndpointElement",
    value: function getEndpointElement(ep) {
      if (ep.canvas != null) {
        return ep.canvas;
      } else {
        var svg = _node("svg", {
          "style": "",
          "width": "0",
          "height": "0",
          "pointer-events": "none",
          "position": "absolute"
        });
        ep.svg = svg;
        var canvas = createElement("div", {
          position: "absolute"
        });
        ep.canvas = canvas;
        var classes = ep.classes.join(" ");
        ep.instance.addClass(canvas, classes);
        var scopes = ep.endpoint.scope.split(/\s/);
        for (var i = 0; i < scopes.length; i++) {
          ep.instance.setAttribute(canvas, ATTRIBUTE_SCOPE_PREFIX + scopes[i], TRUE$1);
        }
        if (!ep.instance._suspendDrawing) {
          _size(canvas, 0, 0, 1, 1);
        }
        ep.instance._appendElement(canvas, ep.instance.getContainer());
        canvas.appendChild(svg);
        if (ep.cssClass != null) {
          ep.instance.addClass(canvas, ep.cssClass);
        }
        ep.instance.addClass(canvas, ep.instance.endpointClass);
        canvas.jtk = canvas.jtk || {};
        canvas.jtk.endpoint = ep.endpoint;
        canvas.style.display = ep.endpoint.visible !== false ? "block" : "none";
        return canvas;
      }
    }
  }, {
    key: "paint",
    value: function paint(ep, handlers, paintStyle) {
      this.getEndpointElement(ep);
      SvgComponent.paint(ep, true, paintStyle);
      var s = extend({}, paintStyle);
      if (s.outlineStroke) {
        s.stroke = s.outlineStroke;
      }
      if (ep.node == null) {
        ep.node = handlers.makeNode(ep, s);
        ep.svg.appendChild(ep.node);
      } else if (handlers.updateNode != null) {
        handlers.updateNode(ep, ep.node);
      }
      _applyStyles(ep.canvas, ep.node, s, [ep.x, ep.y, ep.w, ep.h]);
    }
  }]);
  return SvgEndpoint;
}();

var endpointMap = {};
function registerEndpointRenderer(name, fns) {
  endpointMap[name] = fns;
}
function getPositionOnElement(evt, el, zoom) {
  var jel = el;
  var box = _typeof(el.getBoundingClientRect) !== UNDEFINED ? el.getBoundingClientRect() : {
    left: 0,
    top: 0,
    width: 0,
    height: 0
  },
      body = document.body,
      docElem = document.documentElement,
      scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
      scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
      clientTop = docElem.clientTop || body.clientTop || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
      pst = 0,
      psl = 0,
      top = box.top + scrollTop - clientTop + pst * zoom,
      left = box.left + scrollLeft - clientLeft + psl * zoom,
      cl = pageLocation(evt),
      w = box.width || jel.offsetWidth * zoom,
      h = box.height || jel.offsetHeight * zoom,
      x = (cl.x - left) / w,
      y = (cl.y - top) / h;
  return {
    x: x,
    y: y
  };
}
function isSVGElementOverlay(o) {
  return isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o);
}
function setVisible(component, v) {
  if (component.canvas) {
    component.canvas.style.display = v ? "block" : "none";
  }
}
function cleanup(component) {
  if (component.canvas) {
    component.canvas.parentNode.removeChild(component.canvas);
  }
  delete component.canvas;
  delete component.svg;
}
function getEndpointCanvas(ep) {
  return ep.canvas;
}
function getLabelElement(o) {
  return HTMLElementOverlay.getElement(o);
}
function getCustomElement(o) {
  return HTMLElementOverlay.getElement(o, o.component, function (c) {
    var el = o.create(c);
    o.instance.addClass(el, o.instance.overlayClass);
    return el;
  });
}
var BrowserJsPlumbInstance =
function (_JsPlumbInstance) {
  _inherits(BrowserJsPlumbInstance, _JsPlumbInstance);
  function BrowserJsPlumbInstance(_instanceIndex, defaults) {
    var _this;
    _classCallCheck(this, BrowserJsPlumbInstance);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowserJsPlumbInstance).call(this, _instanceIndex, defaults));
    _this._instanceIndex = _instanceIndex;
    _defineProperty(_assertThisInitialized(_this), "dragManager", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectorClick", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectorDblClick", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectorTap", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectorDblTap", void 0);
    _defineProperty(_assertThisInitialized(_this), "_endpointClick", void 0);
    _defineProperty(_assertThisInitialized(_this), "_endpointDblClick", void 0);
    _defineProperty(_assertThisInitialized(_this), "_overlayClick", void 0);
    _defineProperty(_assertThisInitialized(_this), "_overlayDblClick", void 0);
    _defineProperty(_assertThisInitialized(_this), "_overlayTap", void 0);
    _defineProperty(_assertThisInitialized(_this), "_overlayDblTap", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectorMouseover", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectorMouseout", void 0);
    _defineProperty(_assertThisInitialized(_this), "_endpointMouseover", void 0);
    _defineProperty(_assertThisInitialized(_this), "_endpointMouseout", void 0);
    _defineProperty(_assertThisInitialized(_this), "_overlayMouseover", void 0);
    _defineProperty(_assertThisInitialized(_this), "_overlayMouseout", void 0);
    _defineProperty(_assertThisInitialized(_this), "_elementClick", void 0);
    _defineProperty(_assertThisInitialized(_this), "_elementTap", void 0);
    _defineProperty(_assertThisInitialized(_this), "_elementDblTap", void 0);
    _defineProperty(_assertThisInitialized(_this), "_elementMouseenter", void 0);
    _defineProperty(_assertThisInitialized(_this), "_elementMouseexit", void 0);
    _defineProperty(_assertThisInitialized(_this), "_elementMousemove", void 0);
    _defineProperty(_assertThisInitialized(_this), "eventManager", void 0);
    _defineProperty(_assertThisInitialized(_this), "listManager", void 0);
    _defineProperty(_assertThisInitialized(_this), "draggingClass", "jtk-dragging");
    _defineProperty(_assertThisInitialized(_this), "elementDraggingClass", "jtk-element-dragging");
    _defineProperty(_assertThisInitialized(_this), "hoverClass", "jtk-hover");
    _defineProperty(_assertThisInitialized(_this), "sourceElementDraggingClass", "jtk-source-element-dragging");
    _defineProperty(_assertThisInitialized(_this), "targetElementDraggingClass", "jtk-target-element-dragging");
    _defineProperty(_assertThisInitialized(_this), "hoverSourceClass", "jtk-source-hover");
    _defineProperty(_assertThisInitialized(_this), "hoverTargetClass", "jtk-target-hover");
    _defineProperty(_assertThisInitialized(_this), "dragSelectClass", "jtk-drag-select");
    _defineProperty(_assertThisInitialized(_this), "elementsDraggable", void 0);
    _defineProperty(_assertThisInitialized(_this), "elementDragHandler", void 0);
    _defineProperty(_assertThisInitialized(_this), "groupDragOptions", void 0);
    _defineProperty(_assertThisInitialized(_this), "elementDragOptions", void 0);
    _defineProperty(_assertThisInitialized(_this), "svg", {
      node: function node(name, attributes) {
        return _node(name, attributes);
      },
      attr: function attr(node, attributes) {
        return _attr(node, attributes);
      },
      pos: function pos(d) {
        return _pos(d);
      }
    });
    _this.elementsDraggable = defaults && defaults.elementsDraggable !== false;
    _this.eventManager = new EventManager();
    _this.dragManager = new DragManager(_assertThisInitialized(_this), defaults && defaults.dragOptions ? defaults.dragOptions : null);
    _this.listManager = new JsPlumbListManager(_assertThisInitialized(_this));
    _this.dragManager.addHandler(new EndpointDragHandler(_assertThisInitialized(_this)));
    _this.groupDragOptions = {
      constrainFunction: function constrainFunction(desiredLoc, dragEl, constrainRect, size) {
        var x = desiredLoc.x,
            y = desiredLoc.y;
        if (dragEl._jsPlumbParentGroup && dragEl._jsPlumbParentGroup.constrain) {
          x = Math.max(desiredLoc.x, 0);
          y = Math.max(desiredLoc.y, 0);
          x = Math.min(x, constrainRect.w - size.w);
          y = Math.min(y, constrainRect.h - size.h);
        }
        return {
          x: x,
          y: y
        };
      },
      revertFunction: function revertFunction(dragEl, pos) {
        var _el = dragEl;
        return _el.parentNode != null && _el._jsPlumbParentGroup && _el._jsPlumbParentGroup.revert ? !_isInsideParent(_assertThisInitialized(_this), _el, pos) : false;
      }
    };
    _this.dragManager.addHandler(new GroupDragHandler(_assertThisInitialized(_this)), _this.groupDragOptions);
    _this.elementDragHandler = new ElementDragHandler(_assertThisInitialized(_this));
    _this.elementDragOptions = defaults && defaults.dragOptions || {};
    _this.dragManager.addHandler(_this.elementDragHandler, _this.elementDragOptions);
    var _connClick = function _connClick(event, e) {
      if (!e.defaultPrevented) {
        var connectorElement = findParent(getEventSource(e), SELECTOR_CONNECTOR, this.getContainer());
        this.fire(event, connectorElement.jtk.connector.connection, e);
      }
    };
    _this._connectorClick = _connClick.bind(_assertThisInitialized(_this), EVENT_CLICK);
    _this._connectorDblClick = _connClick.bind(_assertThisInitialized(_this), EVENT_DBL_CLICK);
    _this._connectorTap = _connClick.bind(_assertThisInitialized(_this), EVENT_TAP);
    _this._connectorDblTap = _connClick.bind(_assertThisInitialized(_this), EVENT_DBL_TAP);
    var _connectorHover = function _connectorHover(state, e) {
      var el = getEventSource(e).parentNode;
      if (el.jtk && el.jtk.connector) {
        this.setConnectorHover(el.jtk.connector, state);
        this.fire(state ? EVENT_CONNECTION_MOUSEOVER : EVENT_CONNECTION_MOUSEOUT, el.jtk.connector.connection, e);
      }
    };
    _this._connectorMouseover = _connectorHover.bind(_assertThisInitialized(_this), true);
    _this._connectorMouseout = _connectorHover.bind(_assertThisInitialized(_this), false);
    var _epClick = function _epClick(event, e, endpointElement) {
      if (!e.defaultPrevented) {
        this.fire(event, endpointElement.jtk.endpoint, e);
      }
    };
    _this._endpointClick = _epClick.bind(_assertThisInitialized(_this), EVENT_ENDPOINT_CLICK);
    _this._endpointDblClick = _epClick.bind(_assertThisInitialized(_this), EVENT_ENDPOINT_DBL_CLICK);
    var _endpointHover = function _endpointHover(state, e) {
      var el = getEventSource(e);
      if (el.jtk && el.jtk.endpoint) {
        this.setEndpointHover(el.jtk.endpoint, state);
        this.fire(state ? EVENT_ENDPOINT_MOUSEOVER : EVENT_ENDPOINT_MOUSEOUT, el.jtk.endpoint, e);
      }
    };
    _this._endpointMouseover = _endpointHover.bind(_assertThisInitialized(_this), true);
    _this._endpointMouseout = _endpointHover.bind(_assertThisInitialized(_this), false);
    var _oClick = function _oClick(method, e) {
      consume(e);
      var overlayElement = findParent(getEventSource(e), SELECTOR_OVERLAY, this.getContainer());
      var overlay = overlayElement.jtk.overlay;
      if (overlay) {
        overlay[method](e);
      }
    };
    _this._overlayClick = _oClick.bind(_assertThisInitialized(_this), EVENT_CLICK);
    _this._overlayDblClick = _oClick.bind(_assertThisInitialized(_this), EVENT_DBL_CLICK);
    _this._overlayTap = _oClick.bind(_assertThisInitialized(_this), EVENT_TAP);
    _this._overlayDblTap = _oClick.bind(_assertThisInitialized(_this), EVENT_DBL_TAP);
    var _overlayHover = function _overlayHover(state, e) {
      var overlayElement = findParent(getEventSource(e), SELECTOR_OVERLAY, this.getContainer());
      var overlay = overlayElement.jtk.overlay;
      if (overlay) {
        this.setOverlayHover(overlay, state);
      }
    };
    _this._overlayMouseover = _overlayHover.bind(_assertThisInitialized(_this), true);
    _this._overlayMouseout = _overlayHover.bind(_assertThisInitialized(_this), false);
    var _elementClick = function _elementClick(event, e, target) {
      if (!e.defaultPrevented) {
        this.fire(e.detail === 1 ? EVENT_ELEMENT_CLICK : EVENT_ELEMENT_DBL_CLICK, target, e);
      }
    };
    _this._elementClick = _elementClick.bind(_assertThisInitialized(_this), EVENT_ELEMENT_CLICK);
    var _elementTap = function _elementTap(event, e, target) {
      if (!e.defaultPrevented) {
        this.fire(EVENT_ELEMENT_TAP, target, e);
      }
    };
    _this._elementTap = _elementTap.bind(_assertThisInitialized(_this), EVENT_ELEMENT_TAP);
    var _elementDblTap = function _elementDblTap(event, e, target) {
      if (!e.defaultPrevented) {
        this.fire(EVENT_ELEMENT_DBL_TAP, target, e);
      }
    };
    _this._elementDblTap = _elementDblTap.bind(_assertThisInitialized(_this), EVENT_ELEMENT_DBL_TAP);
    var _elementHover = function _elementHover(state, e) {
      this.fire(state ? EVENT_ELEMENT_MOUSE_OVER : EVENT_ELEMENT_MOUSE_OUT, getEventSource(e), e);
    };
    _this._elementMouseenter = _elementHover.bind(_assertThisInitialized(_this), true);
    _this._elementMouseexit = _elementHover.bind(_assertThisInitialized(_this), false);
    var _elementMousemove = function _elementMousemove(e) {
      if (!e.defaultPrevented) {
        var element = findParent(getEventSource(e), SELECTOR_MANAGED_ELEMENT, this.getContainer());
        this.fire(EVENT_ELEMENT_MOUSE_MOVE, element, e);
      }
    };
    _this._elementMousemove = _elementMousemove.bind(_assertThisInitialized(_this));
    _this._attachEventDelegates();
    return _this;
  }
  _createClass(BrowserJsPlumbInstance, [{
    key: "addDragFilter",
    value: function addDragFilter(filter, exclude) {
      this.dragManager.addFilter(filter, exclude);
    }
  }, {
    key: "removeDragFilter",
    value: function removeDragFilter(filter) {
      this.dragManager.removeFilter(filter);
    }
  }, {
    key: "setDragGrid",
    value: function setDragGrid(grid) {
      this.dragManager.setOption(this.elementDragHandler, {
        grid: grid
      });
    }
  }, {
    key: "_removeElement",
    value: function _removeElement(element) {
      element.parentNode && element.parentNode.removeChild(element);
    }
  }, {
    key: "_appendElement",
    value: function _appendElement(el, parent) {
      if (parent) {
        parent.appendChild(el);
      }
    }
  }, {
    key: "_getChildElements",
    value: function _getChildElements(el) {
      var out = [];
      if (el && el.nodeType !== 3 && el.nodeType !== 8) {
        for (var i = 0, ii = el.childNodes.length; i < ii; i++) {
          if (el.childNodes[i].nodeType !== 3 && el.childNodes[i].nodeType !== 8) out.push(el.childNodes[i]);
        }
      }
      return out;
    }
  }, {
    key: "_getAssociatedElements",
    value: function _getAssociatedElements(el) {
      var els = el.querySelectorAll(SELECTOR_MANAGED_ELEMENT);
      var a = [];
      Array.prototype.push.apply(a, els);
      return a;
    }
  }, {
    key: "shouldFireEvent",
    value: function shouldFireEvent(event, value, originalEvent) {
      return true;
    }
  }, {
    key: "getClass",
    value: function getClass$1(el) {
      return getClass(el);
    }
  }, {
    key: "addClass",
    value: function addClass$1(el, clazz) {
      addClass(el, clazz);
    }
  }, {
    key: "hasClass",
    value: function hasClass$1(el, clazz) {
      return hasClass(el, clazz);
    }
  }, {
    key: "removeClass",
    value: function removeClass$1(el, clazz) {
      removeClass(el, clazz);
    }
  }, {
    key: "toggleClass",
    value: function toggleClass$1(el, clazz) {
      toggleClass(el, clazz);
    }
  }, {
    key: "setAttribute",
    value: function setAttribute(el, name, value) {
      el.setAttribute(name, value);
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(el, name) {
      return el.getAttribute(name);
    }
  }, {
    key: "setAttributes",
    value: function setAttributes(el, atts) {
      for (var i in atts) {
        el.setAttribute(i, atts[i]);
      }
    }
  }, {
    key: "removeAttribute",
    value: function removeAttribute(el, attName) {
      el.removeAttribute && el.removeAttribute(attName);
    }
  }, {
    key: "on",
    value: function on(el, event, callbackOrSelector, callback) {
      var _this2 = this;
      var _one = function _one(_el) {
        if (callback == null) {
          _this2.eventManager.on(_el, event, callbackOrSelector);
        } else {
          _this2.eventManager.on(_el, event, callbackOrSelector, callback);
        }
      };
      if (isNodeList(el)) {
        forEach(el, function (el) {
          return _one(el);
        });
      } else {
        _one(el);
      }
      return this;
    }
  }, {
    key: "off",
    value: function off(el, event, callback) {
      var _this3 = this;
      if (isNodeList(el)) {
        forEach(el, function (_el) {
          return _this3.eventManager.off(_el, event, callback);
        });
      } else {
        this.eventManager.off(el, event, callback);
      }
      return this;
    }
  }, {
    key: "trigger",
    value: function trigger(el, event, originalEvent, payload, detail) {
      this.eventManager.trigger(el, event, originalEvent, payload, detail);
    }
  }, {
    key: "getOffsetRelativeToRoot",
    value: function getOffsetRelativeToRoot(el) {
      return offsetRelativeToRoot(el);
    }
  }, {
    key: "getOffset",
    value: function getOffset(el) {
      var jel = el;
      var container = this.getContainer();
      var out = {
        x: jel.offsetLeft,
        y: jel.offsetTop
      },
          op = el !== container && jel.offsetParent !== container ? jel.offsetParent : null,
          _maybeAdjustScroll = function _maybeAdjustScroll(offsetParent) {
        if (offsetParent != null && offsetParent !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
          out.x -= offsetParent.scrollLeft;
          out.y -= offsetParent.scrollTop;
        }
      };
      while (op != null) {
        out.x += op.offsetLeft;
        out.y += op.offsetTop;
        _maybeAdjustScroll(op);
        op = op.offsetParent === container ? null : op.offsetParent;
      }
      if (container != null && (container.scrollTop > 0 || container.scrollLeft > 0)) {
        var pp = jel.offsetParent != null ? this.getStyle(jel.offsetParent, PROPERTY_POSITION) : STATIC,
            p = this.getStyle(jel, PROPERTY_POSITION);
        if (p !== ABSOLUTE && p !== FIXED && pp !== ABSOLUTE && pp !== FIXED) {
          out.x -= container.scrollLeft;
          out.y -= container.scrollTop;
        }
      }
      return out;
    }
  }, {
    key: "getSize",
    value: function getSize(el) {
      return size(el);
    }
  }, {
    key: "getStyle",
    value: function getStyle(el, prop) {
      if (_typeof(window.getComputedStyle) !== UNDEFINED) {
        return getComputedStyle(el, null).getPropertyValue(prop);
      } else {
        return el.currentStyle[prop];
      }
    }
  }, {
    key: "getSelector",
    value: function getSelector(ctx, spec) {
      var sel = null;
      if (arguments.length === 1) {
        if (!isString(ctx)) {
          var nodeList = document.createDocumentFragment();
          nodeList.appendChild(ctx);
          return fromArray(nodeList.childNodes);
        }
        sel = fromArray(document.querySelectorAll(ctx));
      } else {
        sel = fromArray(ctx.querySelectorAll(spec));
      }
      return sel;
    }
  }, {
    key: "setPosition",
    value: function setPosition(el, p) {
      var jel = el;
      jel.style.left = p.x + "px";
      jel.style.top = p.y + "px";
    }
  }, {
    key: "setDraggable",
    value: function setDraggable(element, draggable) {
      if (draggable) {
        this.removeAttribute(element, ATTRIBUTE_NOT_DRAGGABLE);
      } else {
        this.setAttribute(element, ATTRIBUTE_NOT_DRAGGABLE, TRUE$1);
      }
    }
  }, {
    key: "isDraggable",
    value: function isDraggable(el) {
      var d = this.getAttribute(el, ATTRIBUTE_NOT_DRAGGABLE);
      return d == null || d === FALSE$1;
    }
  }, {
    key: "toggleDraggable",
    value: function toggleDraggable(el) {
      var state = this.isDraggable(el);
      this.setDraggable(el, !state);
      return !state;
    }
  }, {
    key: "_attachEventDelegates",
    value: function _attachEventDelegates() {
      var currentContainer = this.getContainer();
      this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_OVERLAY, this._overlayClick);
      this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_OVERLAY, this._overlayDblClick);
      this.eventManager.on(currentContainer, EVENT_TAP, SELECTOR_OVERLAY, this._overlayTap);
      this.eventManager.on(currentContainer, EVENT_DBL_TAP, SELECTOR_OVERLAY, this._overlayDblTap);
      this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_CONNECTOR, this._connectorClick);
      this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_CONNECTOR, this._connectorDblClick);
      this.eventManager.on(currentContainer, EVENT_TAP, SELECTOR_CONNECTOR, this._connectorTap);
      this.eventManager.on(currentContainer, EVENT_DBL_TAP, SELECTOR_CONNECTOR, this._connectorDblTap);
      this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_ENDPOINT, this._endpointClick);
      this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_ENDPOINT, this._endpointDblClick);
      this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_MANAGED_ELEMENT, this._elementClick);
      this.eventManager.on(currentContainer, EVENT_TAP, SELECTOR_MANAGED_ELEMENT, this._elementTap);
      this.eventManager.on(currentContainer, EVENT_DBL_TAP, SELECTOR_MANAGED_ELEMENT, this._elementDblTap);
      this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_CONNECTOR, this._connectorMouseover);
      this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_CONNECTOR, this._connectorMouseout);
      this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_ENDPOINT, this._endpointMouseover);
      this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_ENDPOINT, this._endpointMouseout);
      this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_OVERLAY, this._overlayMouseover);
      this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_OVERLAY, this._overlayMouseout);
      this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_MANAGED_ELEMENT, this._elementMouseenter);
      this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_MANAGED_ELEMENT, this._elementMouseexit);
      this.eventManager.on(currentContainer, EVENT_MOUSEMOVE$1, SELECTOR_MANAGED_ELEMENT, this._elementMousemove);
    }
  }, {
    key: "_detachEventDelegates",
    value: function _detachEventDelegates() {
      var currentContainer = this.getContainer();
      if (currentContainer) {
        this.eventManager.off(currentContainer, EVENT_CLICK, this._connectorClick);
        this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._connectorDblClick);
        this.eventManager.off(currentContainer, EVENT_TAP, this._connectorTap);
        this.eventManager.off(currentContainer, EVENT_DBL_TAP, this._connectorDblTap);
        this.eventManager.off(currentContainer, EVENT_CLICK, this._endpointClick);
        this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._endpointDblClick);
        this.eventManager.off(currentContainer, EVENT_CLICK, this._overlayClick);
        this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._overlayDblClick);
        this.eventManager.off(currentContainer, EVENT_TAP, this._overlayTap);
        this.eventManager.off(currentContainer, EVENT_DBL_TAP, this._overlayDblTap);
        this.eventManager.off(currentContainer, EVENT_CLICK, this._elementClick);
        this.eventManager.off(currentContainer, EVENT_TAP, this._elementTap);
        this.eventManager.off(currentContainer, EVENT_DBL_TAP, this._elementDblTap);
        this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._connectorMouseover);
        this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._connectorMouseout);
        this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._endpointMouseover);
        this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._endpointMouseout);
        this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._overlayMouseover);
        this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._overlayMouseout);
        this.eventManager.off(currentContainer, EVENT_MOUSEENTER, this._elementMouseenter);
        this.eventManager.off(currentContainer, EVENT_MOUSEEXIT, this._elementMouseexit);
        this.eventManager.off(currentContainer, EVENT_MOUSEMOVE$1, this._elementMousemove);
      }
    }
  }, {
    key: "setContainer",
    value: function setContainer(newContainer) {
      var _this4 = this;
      if (newContainer === document || newContainer === document.body) {
        throw new Error("Cannot set document or document.body as container element");
      }
      this._detachEventDelegates();
      var dragFilters;
      if (this.dragManager != null) {
        dragFilters = this.dragManager.reset();
      }
      this.setAttribute(newContainer, ATTRIBUTE_CONTAINER, uuid().replace("-", ""));
      var currentContainer = this.getContainer();
      if (currentContainer != null) {
        currentContainer.removeAttribute(ATTRIBUTE_CONTAINER);
        var children = fromArray(currentContainer.childNodes).filter(function (cn) {
          return cn != null && (_this4.hasClass(cn, CLASS_CONNECTOR) || _this4.hasClass(cn, CLASS_ENDPOINT) || _this4.hasClass(cn, CLASS_OVERLAY) || cn.getAttribute && cn.getAttribute(ATTRIBUTE_MANAGED) != null);
        });
        forEach(children, function (el) {
          newContainer.appendChild(el);
        });
      }
      _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "setContainer", this).call(this, newContainer);
      if (this.eventManager != null) {
        this._attachEventDelegates();
      }
      if (this.dragManager != null) {
        this.dragManager.addHandler(new EndpointDragHandler(this));
        this.dragManager.addHandler(new GroupDragHandler(this), this.groupDragOptions);
        this.elementDragHandler = new ElementDragHandler(this);
        this.dragManager.addHandler(this.elementDragHandler, this.elementDragOptions);
        if (dragFilters != null) {
          this.dragManager.setFilters(dragFilters);
        }
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "reset", this).call(this);
      var container = this.getContainer();
      var els = container.querySelectorAll([SELECTOR_MANAGED_ELEMENT, SELECTOR_ENDPOINT, SELECTOR_CONNECTOR, SELECTOR_OVERLAY].join(","));
      forEach(els, function (el) {
        return el.parentNode && el.parentNode.removeChild(el);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._detachEventDelegates();
      if (this.dragManager != null) {
        this.dragManager.reset();
      }
      this.clearDragSelection();
      _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "destroy", this).call(this);
    }
  }, {
    key: "unmanage",
    value: function unmanage(el, removeElement) {
      this.removeFromDragSelection(el);
      _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "unmanage", this).call(this, el, removeElement);
    }
  }, {
    key: "addToDragSelection",
    value: function addToDragSelection() {
      var _this5 = this;
      for (var _len = arguments.length, el = new Array(_len), _key = 0; _key < _len; _key++) {
        el[_key] = arguments[_key];
      }
      forEach(el, function (_el) {
        return _this5.elementDragHandler.addToDragSelection(_el);
      });
    }
  }, {
    key: "clearDragSelection",
    value: function clearDragSelection() {
      this.elementDragHandler.clearDragSelection();
    }
  }, {
    key: "removeFromDragSelection",
    value: function removeFromDragSelection() {
      var _this6 = this;
      for (var _len2 = arguments.length, el = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        el[_key2] = arguments[_key2];
      }
      forEach(el, function (_el) {
        return _this6.elementDragHandler.removeFromDragSelection(_el);
      });
    }
  }, {
    key: "toggleDragSelection",
    value: function toggleDragSelection() {
      var _this7 = this;
      for (var _len3 = arguments.length, el = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        el[_key3] = arguments[_key3];
      }
      forEach(el, function (_el) {
        return _this7.elementDragHandler.toggleDragSelection(_el);
      });
    }
  }, {
    key: "getDragSelection",
    value: function getDragSelection() {
      return this.elementDragHandler.getDragSelection();
    }
  }, {
    key: "addToDragGroup",
    value: function addToDragGroup(spec) {
      var _this$elementDragHand;
      for (var _len4 = arguments.length, els = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        els[_key4 - 1] = arguments[_key4];
      }
      (_this$elementDragHand = this.elementDragHandler).addToDragGroup.apply(_this$elementDragHand, [spec].concat(els));
    }
  }, {
    key: "removeFromDragGroup",
    value: function removeFromDragGroup() {
      var _this$elementDragHand2;
      (_this$elementDragHand2 = this.elementDragHandler).removeFromDragGroup.apply(_this$elementDragHand2, arguments);
    }
  }, {
    key: "setDragGroupState",
    value: function setDragGroupState(state) {
      var _this$elementDragHand3;
      for (var _len5 = arguments.length, els = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        els[_key5 - 1] = arguments[_key5];
      }
      (_this$elementDragHand3 = this.elementDragHandler).setDragGroupState.apply(_this$elementDragHand3, [state].concat(els));
    }
  }, {
    key: "consume",
    value: function consume$1(e, doNotPreventDefault) {
      consume(e, doNotPreventDefault);
    }
  }, {
    key: "addList",
    value: function addList(el, options) {
      return this.listManager.addList(el, options);
    }
  }, {
    key: "removeList",
    value: function removeList(el) {
      this.listManager.removeList(el);
    }
  }, {
    key: "rotate",
    value: function rotate(element, rotation, doNotRepaint) {
      var elementId = this.getId(element);
      if (this._managedElements[elementId]) {
        this._managedElements[elementId].el.style.transform = "rotate(" + rotation + "deg)";
        this._managedElements[elementId].el.style.transformOrigin = "center center";
        return _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "rotate", this).call(this, element, rotation, doNotRepaint);
      }
      return {
        c: new Set(),
        e: new Set()
      };
    }
  }, {
    key: "getPath",
    value: function getPath(segment, isFirstSegment) {
      return {
        "Straight": function Straight(isFirstSegment) {
          return (isFirstSegment ? "M " + segment.x1 + " " + segment.y1 + " " : "") + "L " + segment.x2 + " " + segment.y2;
        },
        "Bezier": function Bezier(isFirstSegment) {
          var b = segment;
          return (isFirstSegment ? "M " + b.x2 + " " + b.y2 + " " : "") + "C " + b.cp2x + " " + b.cp2y + " " + b.cp1x + " " + b.cp1y + " " + b.x1 + " " + b.y1;
        },
        "Arc": function Arc(isFirstSegment) {
          var a = segment;
          var laf = a.sweep > Math.PI ? 1 : 0,
              sf = a.anticlockwise ? 0 : 1;
          return (isFirstSegment ? "M" + a.x1 + " " + a.y1 + " " : "") + "A " + a.radius + " " + a.radius + " 0 " + laf + "," + sf + " " + a.x2 + " " + a.y2;
        }
      }[segment.type](isFirstSegment);
    }
  }, {
    key: "addOverlayClass",
    value: function addOverlayClass(o, clazz) {
      if (isLabelOverlay(o)) {
        o.instance.addClass(getLabelElement(o), clazz);
      } else if (isSVGElementOverlay(o)) {
        o.instance.addClass(SVGElementOverlay.ensurePath(o), clazz);
      } else if (isCustomOverlay(o)) {
        o.instance.addClass(getCustomElement(o), clazz);
      } else {
        throw "Could not add class to overlay of type [" + o.type + "]";
      }
    }
  }, {
    key: "removeOverlayClass",
    value: function removeOverlayClass(o, clazz) {
      if (isLabelOverlay(o)) {
        o.instance.removeClass(getLabelElement(o), clazz);
      } else if (isSVGElementOverlay(o)) {
        o.instance.removeClass(SVGElementOverlay.ensurePath(o), clazz);
      } else if (isCustomOverlay(o)) {
        o.instance.removeClass(getCustomElement(o), clazz);
      } else {
        throw "Could not remove class from overlay of type [" + o.type + "]";
      }
    }
  }, {
    key: "paintOverlay",
    value: function paintOverlay(o, params, extents) {
      if (isLabelOverlay(o)) {
        getLabelElement(o);
        var XY = o.component.getXY();
        o.canvas.style.left = XY.x + params.d.minx + "px";
        o.canvas.style.top = XY.y + params.d.miny + "px";
      } else if (isSVGElementOverlay(o)) {
        var path = isNaN(params.d.cxy.x) || isNaN(params.d.cxy.y) ? "M 0 0" : "M" + params.d.hxy.x + "," + params.d.hxy.y + " L" + params.d.tail[0].x + "," + params.d.tail[0].y + " L" + params.d.cxy.x + "," + params.d.cxy.y + " L" + params.d.tail[1].x + "," + params.d.tail[1].y + " L" + params.d.hxy.x + "," + params.d.hxy.y;
        SVGElementOverlay.paint(o, path, params, extents);
      } else if (isCustomOverlay(o)) {
        getCustomElement(o);
        var _XY = o.component.getXY();
        o.canvas.style.left = _XY.x + params.d.minx + "px";
        o.canvas.style.top = _XY.y + params.d.miny + "px";
      } else {
        throw "Could not paint overlay of type [" + o.type + "]";
      }
    }
  }, {
    key: "setOverlayVisible",
    value: function setOverlayVisible(o, visible) {
      var d = visible ? "block" : "none";
      function s(el) {
        if (el != null) {
          el.style.display = d;
        }
      }
      if (isLabelOverlay(o)) {
        s(getLabelElement(o));
      } else if (isCustomOverlay(o)) {
        s(getCustomElement(o));
      } else if (isSVGElementOverlay(o)) {
        s(o.path);
      }
    }
  }, {
    key: "reattachOverlay",
    value: function reattachOverlay(o, c) {
      if (isLabelOverlay(o)) {
        o.instance._appendElement(getLabelElement(o), this.getContainer());
      } else if (isCustomOverlay(o)) {
        o.instance._appendElement(getCustomElement(o), this.getContainer());
      } else if (isSVGElementOverlay(o)) {
        this._appendElement(SVGElementOverlay.ensurePath(o), c.connector.canvas);
      }
    }
  }, {
    key: "setOverlayHover",
    value: function setOverlayHover(o, hover) {
      var method = hover ? "addClass" : "removeClass";
      var canvas;
      if (isLabelOverlay(o)) {
        canvas = getLabelElement(o);
      } else if (isCustomOverlay(o)) {
        canvas = getCustomElement(o);
      } else if (isSVGElementOverlay(o)) {
        canvas = SVGElementOverlay.ensurePath(o);
      }
      if (canvas != null) {
        if (this.hoverClass != null) {
          this[method](canvas, this.hoverClass);
        }
        this.setHover(o.component, hover);
      }
    }
  }, {
    key: "destroyOverlay",
    value: function destroyOverlay(o) {
      if (isLabelOverlay(o)) {
        var el = getLabelElement(o);
        el.parentNode.removeChild(el);
        delete o.canvas;
        delete o.cachedDimensions;
      } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
        SVGElementOverlay.destroy(o);
      } else if (isCustomOverlay(o)) {
        var _el2 = getCustomElement(o);
        _el2.parentNode.removeChild(_el2);
        delete o.canvas;
        delete o.cachedDimensions;
      }
    }
  }, {
    key: "drawOverlay",
    value: function drawOverlay(o, component, paintStyle, absolutePosition) {
      if (isLabelOverlay(o) || isCustomOverlay(o)) {
        var td = HTMLElementOverlay._getDimensions(o);
        if (td != null && td.w != null && td.h != null) {
          var cxy = {
            x: 0,
            y: 0
          };
          if (absolutePosition) {
            cxy = {
              x: absolutePosition.x,
              y: absolutePosition.y
            };
          } else if (component instanceof EndpointRepresentation) {
            var locToUse = isArray(o.location) ? o.location : [o.location, o.location];
            cxy = {
              x: locToUse[0] * component.w,
              y: locToUse[1] * component.h
            };
          } else {
            var loc = o.location,
                absolute = false;
            if (IS.aString(o.location) || o.location < 0 || o.location > 1) {
              loc = parseInt("" + o.location, 10);
              absolute = true;
            }
            cxy = component.pointOnPath(loc, absolute);
          }
          var minx = cxy.x - td.w / 2,
              miny = cxy.y - td.h / 2;
          return {
            component: o,
            d: {
              minx: minx,
              miny: miny,
              td: td,
              cxy: cxy
            },
            minX: minx,
            maxX: minx + td.w,
            minY: miny,
            maxY: miny + td.h
          };
        } else {
          return {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0
          };
        }
      } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
        return o.draw(component, paintStyle, absolutePosition);
      } else {
        throw "Could not draw overlay of type [" + o.type + "]";
      }
    }
  }, {
    key: "updateLabel",
    value: function updateLabel(o) {
      if (isFunction(o.label)) {
        var lt = o.label(this);
        if (lt != null) {
          getLabelElement(o).innerHTML = lt.replace(/\r\n/g, "<br/>");
        } else {
          getLabelElement(o).innerHTML = "";
        }
      } else {
        if (o.labelText == null) {
          o.labelText = o.label;
          if (o.labelText != null) {
            getLabelElement(o).innerHTML = o.labelText.replace(/\r\n/g, "<br/>");
          } else {
            getLabelElement(o).innerHTML = "";
          }
        }
      }
    }
  }, {
    key: "setHover",
    value: function setHover(component, hover) {
      component._hover = hover;
      if (component instanceof Endpoint && component.endpoint != null) {
        this.setEndpointHover(component, hover);
      } else if (component instanceof Connection && component.connector != null) {
        this.setConnectorHover(component.connector, hover);
      }
    }
  }, {
    key: "paintConnector",
    value: function paintConnector(connector, paintStyle, extents) {
      SvgElementConnector.paint(connector, paintStyle, extents);
    }
  }, {
    key: "setConnectorHover",
    value: function setConnectorHover(connector, h, doNotCascade) {
      if (h === false || !this.currentlyDragging && !this.isHoverSuspended()) {
        var method = h ? "addClass" : "removeClass";
        var canvas = connector.canvas;
        if (canvas != null) {
          if (connector.hoverClass != null) {
            this[method](canvas, connector.hoverClass);
          }
          this[method](canvas, this.hoverClass);
        }
        if (connector.connection.hoverPaintStyle != null) {
          connector.connection.paintStyleInUse = h ? connector.connection.hoverPaintStyle : connector.connection.paintStyle;
          if (!this._suspendDrawing) {
            this.paintConnection(connector.connection);
          }
        }
        if (!doNotCascade) {
          this.setEndpointHover(connector.connection.endpoints[0], h, true);
          this.setEndpointHover(connector.connection.endpoints[1], h, true);
        }
      }
    }
  }, {
    key: "destroyConnection",
    value: function destroyConnection(connection) {
      if (connection.connector != null) {
        cleanup(connection.connector);
      }
    }
  }, {
    key: "addConnectorClass",
    value: function addConnectorClass(connector, clazz) {
      if (connector.canvas) {
        this.addClass(connector.canvas, clazz);
      }
    }
  }, {
    key: "removeConnectorClass",
    value: function removeConnectorClass(connector, clazz) {
      if (connector.canvas) {
        this.removeClass(connector.canvas, clazz);
      }
    }
  }, {
    key: "getConnectorClass",
    value: function getConnectorClass(connector) {
      if (connector.canvas) {
        return connector.canvas.className.baseVal;
      } else {
        return "";
      }
    }
  }, {
    key: "setConnectorVisible",
    value: function setConnectorVisible(connector, v) {
      setVisible(connector, v);
    }
  }, {
    key: "applyConnectorType",
    value: function applyConnectorType(connector, t) {
      if (connector.canvas && t.cssClass) {
        var classes = Array.isArray(t.cssClass) ? t.cssClass : [t.cssClass];
        this.addClass(connector.canvas, classes.join(" "));
      }
    }
  }, {
    key: "addEndpointClass",
    value: function addEndpointClass(ep, c) {
      var canvas = getEndpointCanvas(ep.endpoint);
      if (canvas != null) {
        this.addClass(canvas, c);
      }
    }
  }, {
    key: "applyEndpointType",
    value: function applyEndpointType(ep, t) {
      if (t.cssClass) {
        var canvas = getEndpointCanvas(ep.endpoint);
        if (canvas) {
          var classes = Array.isArray(t.cssClass) ? t.cssClass : [t.cssClass];
          this.addClass(canvas, classes.join(" "));
        }
      }
    }
  }, {
    key: "destroyEndpoint",
    value: function destroyEndpoint(ep) {
      cleanup(ep.endpoint);
    }
  }, {
    key: "renderEndpoint",
    value: function renderEndpoint(ep, paintStyle) {
      var renderer = endpointMap[ep.endpoint.getType()];
      if (renderer != null) {
        SvgEndpoint.paint(ep.endpoint, renderer, paintStyle);
      } else {
        console.log("JSPLUMB: no endpoint renderer found for type [" + ep.endpoint.getType() + "]");
      }
    }
  }, {
    key: "removeEndpointClass",
    value: function removeEndpointClass(ep, c) {
      var canvas = getEndpointCanvas(ep.endpoint);
      if (canvas != null) {
        this.removeClass(canvas, c);
      }
    }
  }, {
    key: "getEndpointClass",
    value: function getEndpointClass(ep) {
      var canvas = getEndpointCanvas(ep.endpoint);
      if (canvas != null) {
        return canvas.className;
      } else {
        return "";
      }
    }
  }, {
    key: "setEndpointHover",
    value: function setEndpointHover(endpoint, h, doNotCascade) {
      if (endpoint != null && (h === false || !this.currentlyDragging && !this.isHoverSuspended())) {
        var method = h ? "addClass" : "removeClass";
        var canvas = getEndpointCanvas(endpoint.endpoint);
        if (canvas != null) {
          if (endpoint.hoverClass != null) {
            this[method](canvas, endpoint.hoverClass);
          }
        }
        if (endpoint.hoverPaintStyle != null) {
          endpoint.paintStyleInUse = h ? endpoint.hoverPaintStyle : endpoint.paintStyle;
          if (!this._suspendDrawing) {
            this.renderEndpoint(endpoint, endpoint.paintStyleInUse);
          }
        }
        if (!doNotCascade) {
          for (var i = 0; i < endpoint.connections.length; i++) {
            this.setConnectorHover(endpoint.connections[i].connector, h, true);
          }
        }
      }
    }
  }, {
    key: "setEndpointVisible",
    value: function setEndpointVisible(ep, v) {
      setVisible(ep.endpoint, v);
    }
  }, {
    key: "deleteConnection",
    value: function deleteConnection(connection, params) {
      if (connection != null && connection.deleted !== true) {
        this.setEndpointHover(connection.endpoints[0], false, true);
        this.setEndpointHover(connection.endpoints[1], false, true);
        return _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "deleteConnection", this).call(this, connection, params);
      } else {
        return false;
      }
    }
  }, {
    key: "addSourceSelector",
    value: function addSourceSelector(selector, params, exclude) {
      this.addDragFilter(selector);
      return _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "addSourceSelector", this).call(this, selector, params, exclude);
    }
  }, {
    key: "removeSourceSelector",
    value: function removeSourceSelector(selector) {
      this.removeDragFilter(selector.selector);
      _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "removeSourceSelector", this).call(this, selector);
    }
  }]);
  return BrowserJsPlumbInstance;
}(JsPlumbInstance);

var register = function register() {
  registerEndpointRenderer("Dot", {
    makeNode: function makeNode(ep, style) {
      return _node("circle", {
        "cx": ep.w / 2,
        "cy": ep.h / 2,
        "r": ep.radius
      });
    },
    updateNode: function updateNode(ep, node) {
      _attr(node, {
        "cx": "" + ep.w / 2,
        "cy": "" + ep.h / 2,
        "r": "" + ep.radius
      });
    }
  });
};

var register$1 = function register() {
  registerEndpointRenderer("Rectangle", {
    makeNode: function makeNode(ep, style) {
      return _node("rect", {
        "width": ep.w,
        "height": ep.h
      });
    },
    updateNode: function updateNode(ep, node) {
      _attr(node, {
        "width": ep.w,
        "height": ep.h
      });
    }
  });
};

var BLANK_ATTRIBUTES = {
  "width": 10,
  "height": 0,
  "fill": "transparent",
  "stroke": "transparent"
};
var register$2 = function register() {
  registerEndpointRenderer("Blank", {
    makeNode: function makeNode(ep, style) {
      return _node("rect", BLANK_ATTRIBUTES);
    },
    updateNode: function updateNode(ep, node) {
      _attr(node, BLANK_ATTRIBUTES);
    }
  });
};

register();
register$2();
register$1();
var _jsPlumbInstanceIndex = 0;
function getInstanceIndex() {
  var i = _jsPlumbInstanceIndex + 1;
  _jsPlumbInstanceIndex++;
  return i;
}
function newInstance(defaults) {
  return new BrowserJsPlumbInstance(getInstanceIndex(), defaults);
}
function ready(f) {
  var _do = function _do() {
    if (/complete|loaded|interactive/.test(document.readyState) && typeof document.body !== "undefined" && document.body != null) {
      f();
    } else {
      setTimeout(_do, 9);
    }
  };
  _do();
}

export { BrowserJsPlumbInstance, Collicat, Drag, EVENT_BEFORE_START, EVENT_CONNECTION_ABORT, EVENT_CONNECTION_DRAG, EVENT_DRAG, EVENT_DRAG_MOVE, EVENT_DRAG_START, EVENT_DRAG_STOP, EVENT_DROP, EVENT_OUT, EVENT_OVER, EVENT_START, EVENT_STOP, EventManager, addClass, consume, createElement, createElementNS, findParent, getClass, getEventSource, getPositionOnElement, getTouch, hasClass, isArrayLike, isNodeList, matchesSelector, newInstance, offsetRelativeToRoot, pageLocation, ready, registerEndpointRenderer, removeClass, size, toggleClass, touchCount, touches };
